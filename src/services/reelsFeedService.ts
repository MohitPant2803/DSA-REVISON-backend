import mongoose, { Types } from 'mongoose';
import crypto from 'crypto';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import Folder from '../models/folder.model';
import RevisionCard from '../models/revisionCard.model';
import UserReelPreference, { IUserReelPreference } from '../models/userReelPreference.model';
import UserReelSession, { IUserReelSession } from '../models/userReelSession.model';
import UserCardState from '../models/userCardState.model';

// Configurable constants
const MAX_QUEUE_SIZE = 2000;
const PREVIOUS_WINDOW_SIZE = 5;
const NEXT_WINDOW_SIZE = 10;
const STALE_LOCK_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Helper to shuffle array (Fisher-Yates Shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Seeded PRNG LCG implementation for diverse, highly reproducible shuffles
class SeededRandom {
  private seed: number;
  constructor(seedString: string) {
    let h = 1779033703 ^ seedString.length;
    for (let i = 0; i < seedString.length; i++) {
      h = Math.imul(h ^ seedString.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    this.seed = (h >>> 0);
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

const seededShuffle = <T>(array: T[], prng: SeededRandom): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(prng.next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Compute contentHash representing the eligible card universe state
export const computeContentHash = async (
  selectedFolderIds: mongoose.Types.ObjectId[]
): Promise<{ hash: string; cardCount: number }> => {
  const foldersKey = [...selectedFolderIds].map(id => id.toString()).sort().join(',');
  
  // Count non-deleted cards in the selected folders
  const cardCount = await RevisionCard.countDocuments({
    rootFolderId: { $in: selectedFolderIds },
    isDeleted: false,
  });

  // Find the latest card update time in selected folders
  const latestCard = await RevisionCard.findOne({
    rootFolderId: { $in: selectedFolderIds },
    isDeleted: false,
  })
    .sort({ updatedAt: -1 })
    .select('updatedAt')
    .lean();

  const latestUpdatedAt = latestCard ? latestCard.updatedAt.getTime() : 0;

  const rawString = `${foldersKey}-${cardCount}-${latestUpdatedAt}`;
  const hash = crypto.createHash('sha256').update(rawString).digest('hex');

  return { hash, cardCount };
};

// 1. Get or Create user folder preferences
export const getUserPreferences = async (userId: string): Promise<IUserReelPreference> => {
  let preference = await UserReelPreference.findOne({ userId: new Types.ObjectId(userId) });
  
  if (!preference) {
    // Default to all root folders
    const rootFolders = await Folder.find({ parentFolderId: null }).select('_id').lean();
    const folderIds = rootFolders.map(f => f._id as Types.ObjectId);
    
    preference = await UserReelPreference.create({
      userId: new Types.ObjectId(userId),
      selectedRootFolderIds: folderIds,
    });
  }
  
  return preference;
};

// 2. Update user folder preferences with server-side validations
export async function updateUserPreferences(
  userId: string,
  selectedRootFolderIds: string[]
): Promise<IUserReelPreference> {
  if (!selectedRootFolderIds || selectedRootFolderIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'At least one root folder must remain active');
  }

  const validObjectIds = selectedRootFolderIds
    .filter(id => Types.ObjectId.isValid(id))
    .map(id => new Types.ObjectId(id));

  if (validObjectIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid folder selections');
  }

  // Server-side validation: ensure they are actual accessible root folders
  const activeRootFolders = await Folder.find({
    _id: { $in: validObjectIds },
    parentFolderId: null,
  })
    .select('_id')
    .lean();

  if (activeRootFolders.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Selected folders do not exist or are not root level');
  }

  const activeIds = activeRootFolders.map(f => f._id as Types.ObjectId);

  const preference = await UserReelPreference.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $set: { selectedRootFolderIds: activeIds } },
    { new: true, upsert: true }
  );

  // Regenerate session inline and preserve maximum distance covered index progress
  await generateReelsQueue(userId, 'preference_change');

  return preference;
}

// 3. Generate balanced, interleaved queue deterministic session
export async function generateReelsQueue(
  userId: string,
  triggerReason: 'preference_change' | 'scroll_refill' | 'session_start' = 'session_start'
): Promise<IUserReelSession> {
  const uid = new Types.ObjectId(userId);
  
  // Retrieve user root folder preferences
  const prefs = await getUserPreferences(userId);
  const selectedFolders = prefs.selectedRootFolderIds;

  if (selectedFolders.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No root folders selected in study preferences');
  }

  // ─── Mutex locking implementation ──────────────────────────────────────────
  let session = await UserReelSession.findOne({ userId: uid });

  if (session && session.isGenerating) {
    // Stale Lock Recovery: If lock is older than 2 minutes, reset it
    const lastUpdate = session.updatedAt.getTime();
    if (Date.now() - lastUpdate > STALE_LOCK_TIMEOUT_MS) {
      console.warn(`[Stale Lock Recovery] Resetting stale generator lock for user: ${userId}`);
      await UserReelSession.updateOne({ userId: uid }, { $set: { isGenerating: false } });
    } else {
      // Parallel request - return current session state to prevent double execution
      return session;
    }
  }

  // Acquire Mutex Lock atomically
  const lockAcquired = await UserReelSession.findOneAndUpdate(
    { userId: uid, isGenerating: false },
    { $set: { isGenerating: true } },
    { new: true, upsert: false }
  );

  if (!lockAcquired) {
    // Session is creating or locked by another request, fetch it and return
    const activeSession = await UserReelSession.findOne({ userId: uid });
    if (activeSession) return activeSession;
    
    // If not exists yet, create a baseline document to grab lock
    session = await UserReelSession.create({
      userId: uid,
      isGenerating: true,
      queue: [],
      currentIndex: 0,
      deepestIndexReached: 0,
      queueVersion: 1,
      contentHash: '',
      eligibleCardCount: 0,
      selectedFolderSnapshot: selectedFolders,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    });
  } else {
    session = lockAcquired;
  }

  try {
    // Compute contentHash and count eligible cards
    const { hash, cardCount } = await computeContentHash(selectedFolders);
    
    if (cardCount === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The selected root folders contain no cards to study');
    }

    // Create seeded random generator
    const timestampBucket = Math.floor(Date.now() / (15 * 60 * 1000));
    const seedString = `${userId}-${session.queueVersion}-${hash}-${timestampBucket}`;
    const prng = new SeededRandom(seedString);

    // Proportional Folder Card Sampling up to MAX_QUEUE_SIZE
    const finalQueueIds: Types.ObjectId[] = [];
    const samplingCap = Math.min(MAX_QUEUE_SIZE, cardCount);

    // Group non-deleted cards by rootFolderId
    const cards = await RevisionCard.find({
      rootFolderId: { $in: selectedFolders },
      isDeleted: false,
    })
      .select('_id rootFolderId')
      .lean();

    const folderCardGroups: Record<string, Types.ObjectId[]> = {};
    selectedFolders.forEach(id => {
      folderCardGroups[id.toString()] = [];
    });

    cards.forEach(card => {
      if (card.rootFolderId) {
        const rootIdStr = card.rootFolderId.toString();
        if (folderCardGroups[rootIdStr]) {
          folderCardGroups[rootIdStr].push(card._id as Types.ObjectId);
        }
      }
    });

    // 1. Fetch Viewed States for the user
    const viewedStates = await UserCardState.find({ userId: uid, viewed: true }).select('cardId').lean();
    const viewedCardIds = new Set(viewedStates.map(s => s.cardId.toString()));

    const folderSampledLists: Types.ObjectId[][] = [];
    let cardsToReset: Types.ObjectId[] = [];
    let unseenEligibleCardCount = 0;
    
    for (const folderId of selectedFolders) {
      const groupCards = folderCardGroups[folderId.toString()] || [];
      if (groupCards.length === 0) continue;

      const viewedInFolder = groupCards.filter(c => viewedCardIds.has(c.toString()));
      let unseenGroupCards: Types.ObjectId[] = [];

      // 2. Evaluate Folder Exhaustion
      // Skip reset if triggerReason is 'preference_change'
      const isExhausted = viewedInFolder.length >= groupCards.length;
      
      if (isExhausted && triggerReason !== 'preference_change') {
        // Reset this folder
        cardsToReset.push(...groupCards);
        unseenGroupCards = [...groupCards]; // Everything is unseen now
      } else {
        // Filter to unseen
        unseenGroupCards = groupCards.filter(c => !viewedCardIds.has(c.toString()));
      }

      if (unseenGroupCards.length === 0) continue; // Safety catch
      
      unseenEligibleCardCount += unseenGroupCards.length;

      // Seeded Fisher-Yates group shuffle on UNSEEN cards
      const shuffledGroup = seededShuffle(unseenGroupCards, prng);
      folderSampledLists.push(shuffledGroup);
    }

    // Emergency fallback if ALL folders are exhausted and reset was skipped due to preference_change
    if (unseenEligibleCardCount === 0 && selectedFolders.length > 0) {
      for (const folderId of selectedFolders) {
        const groupCards = folderCardGroups[folderId.toString()] || [];
        if (groupCards.length === 0) continue;
        const shuffledGroup = seededShuffle(groupCards, prng);
        folderSampledLists.push(shuffledGroup);
        unseenEligibleCardCount += groupCards.length;
      }
    }

    // 3. Batch Reset Exhausted Folders
    if (cardsToReset.length > 0) {
      await UserCardState.updateMany(
        { userId: uid, cardId: { $in: cardsToReset } },
        { $set: { viewed: false } }
      );
    }

    // Re-adjust proportional size allocations based on exact unseen eligible count
    for (let i = 0; i < folderSampledLists.length; i++) {
      const pool = folderSampledLists[i];
      const allocation = Math.round((pool.length / Math.max(1, unseenEligibleCardCount)) * samplingCap);
      folderSampledLists[i] = pool.slice(0, Math.max(1, allocation));
    }

    // Interleave proportional card groups using weighted folder fatigue scores
    let poolIndices = new Array(folderSampledLists.length).fill(0);
    let fatigueScores = new Array(folderSampledLists.length).fill(0);

    while (finalQueueIds.length < samplingCap) {
      let bestFolderIndex = -1;
      let lowestScore = Infinity;

      // Find non-exhausted folder with lowest fatigue score
      for (let i = 0; i < folderSampledLists.length; i++) {
        const pool = folderSampledLists[i];
        const idx = poolIndices[i];
        if (idx < pool.length) {
          if (fatigueScores[i] < lowestScore) {
            lowestScore = fatigueScores[i];
            bestFolderIndex = i;
          }
        }
      }

      if (bestFolderIndex === -1) {
        break; // All pools exhausted
      }

      // Select next card
      const pool = folderSampledLists[bestFolderIndex];
      const idx = poolIndices[bestFolderIndex];
      finalQueueIds.push(pool[idx]);
      
      // Increment folder pointer
      poolIndices[bestFolderIndex] = idx + 1;
      
      // Apply soft fatigue penalty to selected folder group
      fatigueScores[bestFolderIndex] += 1.5;
      
      // Decay penalties of other active folder pools
      for (let j = 0; j < fatigueScores.length; j++) {
        if (j !== bestFolderIndex) {
          fatigueScores[j] = Math.max(0, fatigueScores[j] - 0.4);
        }
      }
    }

    // Update session queue document
    session.queue = finalQueueIds.slice(0, samplingCap);
    if (triggerReason === 'preference_change') {
      // Clamp index in case new queue is smaller than previous index progress
      session.currentIndex = Math.min(session.currentIndex, session.queue.length - 1);
      session.deepestIndexReached = Math.min(session.deepestIndexReached, session.queue.length - 1);
      if (session.currentIndex < 0) session.currentIndex = 0;
      if (session.deepestIndexReached < 0) session.deepestIndexReached = 0;
    } else {
      session.currentIndex = 0;
      session.deepestIndexReached = 0;
    }
    session.contentHash = hash;
    session.eligibleCardCount = cardCount;
    session.selectedFolderSnapshot = selectedFolders;
    session.queueVersion = session.queueVersion + 1;
    session.expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await session.save();
    return session;

  } finally {
    // Guaranteed Mutex Lock Release
    await UserReelSession.updateOne(
      { userId: uid },
      { $set: { isGenerating: false } }
    );
  }
};

// 4. Retrieve session slice window with soft-delete skipped refill loops
export const getSessionSlice = async (userId: string): Promise<any> => {
  const uid = new Types.ObjectId(userId);
  let session: any = await UserReelSession.findOne({ userId: uid });

  // Manual Expiry Validation: do not rely solely on MongoDB background TTL polling
  const isExpired = session && session.expiresAt.getTime() <= Date.now();

  if (!session || isExpired) {
    session = await generateReelsQueue(userId, 'session_start');
  } else {
    // Reconcile and validate current content hash
    const prefs = await getUserPreferences(userId);
    const { hash } = await computeContentHash(prefs.selectedRootFolderIds);
    
    if (session.contentHash !== hash) {
      // Soft Invalidation: trigger async background regeneration, serve current in the meantime
      generateReelsQueue(userId, 'preference_change').catch(err => console.error('[Async Regeneration Failure]', err));
    }
  }

  if (!session) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to initialize reels session');
  }

  const queueLength = session.queue.length;
  if (queueLength === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Your study queue is empty');
  }

  let currentIdx = session.currentIndex;
  const nextUnseenIdx = session.deepestIndexReached + 1;
  if (nextUnseenIdx < queueLength && currentIdx < nextUnseenIdx) {
    currentIdx = nextUnseenIdx;
    session.currentIndex = currentIdx;
    await session.save();
  }
  let sliceIds: Types.ObjectId[] = [];
  let orderedSlice: any[] = [];
  let refillRetries = 0;

  // Skipped / Soft-Deleted cards refill loop
  while (refillRetries < 3) {
    const startIdx = Math.max(0, currentIdx - PREVIOUS_WINDOW_SIZE);
    const endIdx = Math.min(queueLength - 1, currentIdx + NEXT_WINDOW_SIZE);

    sliceIds = session.queue.slice(startIdx, endIdx + 1);

    // Hydrate slice IDs from database (Hydrate only non-deleted cards)
    const cards = await RevisionCard.find({
      _id: { $in: sliceIds },
      isDeleted: false,
    })
      .populate('folderId', 'title icon color')
      .lean();

    // Hydration Sort Order Guarantee Map
    const cardMap = new Map(cards.map(c => [c._id.toString(), c]));
    orderedSlice = sliceIds
      .map(id => cardMap.get(id.toString()))
      .filter(Boolean);

    // Verify if active card is missing or soft deleted
    const activeCardId = session.queue[currentIdx];
    const isActiveCardDeleted = !cardMap.has(activeCardId.toString());

    if (isActiveCardDeleted) {
      console.warn(`[Refill Skipped] Active card ${activeCardId} is soft-deleted. Skipping...`);
      currentIdx++;
      
      if (currentIdx >= queueLength) {
        // Queue Exhausted due to deletions - force full queue regeneration
        session = await generateReelsQueue(userId, 'scroll_refill');
        currentIdx = 0;
      } else {
        session.currentIndex = currentIdx;
        await session.save();
      }
      refillRetries++;
    } else {
      break; // Active card is valid, proceed serving slice
    }
  }

  if (refillRetries >= 3) {
    // If refill loops hit repeated deletions, execute direct hard regeneration
    console.warn(`[Refill Loop Guard] Hit high density deletion bounds. Triggering hard replenishment...`);
    session = await generateReelsQueue(userId, 'scroll_refill');
    return getSessionSlice(userId);
  }

  return {
    queueLength,
    orderedCardIds: session.queue,
    startIdx: Math.max(0, currentIdx - PREVIOUS_WINDOW_SIZE),
    currentIndex: session.currentIndex,
    deepestIndexReached: session.deepestIndexReached,
    queueVersion: session.queueVersion,
    contentHash: session.contentHash,
    cardsSlice: orderedSlice,
  };
};


