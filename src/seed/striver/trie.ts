export const STRIVER_TRIES_QUESTIONS = [
  {
    title: 'Implement Trie (Prefix Tree)',
    topic: 'Tries',
    difficulty: 'Medium' as const,
    complexity: 'O(L) per operation',
    explanation: 'Implement a trie with insert, search, and startsWith methods.',
    code: `class TrieNode {
  constructor() {
    this.children = {}; this.isEnd = false;
  }
}
class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) curr.children[char] = new TrieNode();
      curr = curr.children[char];
    }
    curr.isEnd = true;
  }
  search(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return curr.isEnd;
  }
  startsWith(prefix) {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children[char]) return false;
      curr = curr.children[char];
    }
    return true;
  }
}`,
    tags: ['Tries', 'Design', 'Striver SDE Sheet'],
    examples: ['insert("apple") -> search("apple")=true -> startsWith("app")=true'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine a dictionary organizer with drawers: pulling drawer "a" leads to folder "p", which leads to folder "p", sharing prefix paths for spelling and matching.',
    intuition: 'Store characters at nodes of a tree. Sharing prefix nodes enables high-performance prefix validation and insertion matching in O(length) time.',
    dryRun: 'Insert "cat". Root -> node "c" -> node "a" -> node "t" (isEnd = true). Search "cap" -> fails at "p".',
    mistake: 'Re-allocating child nodes unnecessarily on insert, which clears existing branches.',
    prefer: 'Only instantiate a new `TrieNode` if the character key does not exist.'
  },
  {
    title: 'Implement Trie II',
    topic: 'Tries',
    difficulty: 'Medium' as const,
    complexity: 'O(L) per operation',
    explanation: 'Implement a Trie supporting frequency metrics for insert, search, and prefix matching.',
    code: `class TrieNode2 {
  constructor() {
    this.children = {}; this.countWord = 0; this.countPrefix = 0;
  }
}
class Trie2 {
  constructor() { this.root = new TrieNode2(); }
  insert(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) curr.children[char] = new TrieNode2();
      curr = curr.children[char];
      curr.countPrefix++;
    }
    curr.countWord++;
  }
  countWordsEqualTo(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) return 0;
      curr = curr.children[char];
    }
    return curr.countWord;
  }
  countWordsStartsWith(prefix) {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children[char]) return 0;
      curr = curr.children[char];
    }
    return curr.countPrefix;
  }
  erase(word) {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children[char]) return;
      curr = curr.children[char];
      curr.countPrefix--;
    }
    curr.countWord--;
  }
}`,
    tags: ['Tries', 'Design', 'Striver SDE Sheet'],
    examples: ['insert("apple") -> countWordsEqualTo("apple") = 1 -> erase("apple")'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Similar to a standard Trie, but each folder keeps two sticky notes: one for the number of files with this exact spelling, and one for the total files inside.',
    intuition: 'Maintain frequency variables (`countWord` and `countPrefix`) at each node. Update counters dynamically during insert and erase operations.',
    dryRun: 'Insert "apple" -> countPrefix incremented along path. countWord incremented at "e". countWordsEqualTo("apple") returns 1.',
    mistake: 'Failing to decrement node counters properly during erase operations, leading to corrupted counts.',
    prefer: 'Perform a single pass and decrement both `countPrefix` and `countWord` variables on erase.'
  },
  {
    title: 'Longest String with All Prefixes',
    topic: 'Tries',
    difficulty: 'Medium' as const,
    complexity: 'O(N * L)',
    explanation: 'Find the longest string in an array of strings such that all its prefixes are also in the array.',
    code: `class TrieNodeAllPrefix {
  constructor() { this.children = {}; this.isEnd = false; }
}
function longestWord(words) {
  const root = new TrieNodeAllPrefix();
  for (const w of words) {
    let curr = root;
    for (const char of w) {
      if (!curr.children[char]) curr.children[char] = new TrieNodeAllPrefix();
      curr = curr.children[char];
    }
    curr.isEnd = true;
  }
  let longest = "";
  for (const w of words) {
    let curr = root, possible = true;
    for (const char of w) {
      curr = curr.children[char];
      if (!curr || !curr.isEnd) { possible = false; break; }
    }
    if (possible) {
      if (w.length > longest.length) longest = w;
      else if (w.length === longest.length && w < longest) longest = w;
    }
  }
  return longest;
}`,
    tags: ['Tries', 'Strings', 'Striver SDE Sheet'],
    examples: ['["w","wo","wor","worl","world"] -> "world"'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine constructing a word tower: you can only place a brick if all the bricks below it are solid and marked as completed.',
    intuition: 'Insert all words into a Trie. Then, verify each word by checking if every node along its prefix path has `isEnd === true`. Find the longest matching word.',
    dryRun: 'Build Trie. "w" has isEnd=t. "wo" has isEnd=t. "world" has all prefix nodes marked. Length checking yields "world".',
    mistake: 'Failing to perform lexicographical tie-breakers when multiple words have the same length.',
    prefer: 'Check `word < longest` as a tie-breaker when lengths are equal.'
  },
  {
    title: 'Number of Distinct Substrings',
    topic: 'Tries',
    difficulty: 'Medium' as const,
    complexity: 'O(N^2)',
    explanation: 'Find the total number of distinct substrings in a string.',
    code: `class TrieNodeDistinct {
  constructor() { this.children = {}; }
}
function countDistinctSubstrings(s) {
  const root = new TrieNodeDistinct();
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    let curr = root;
    for (let j = i; j < s.length; j++) {
      const char = s[j];
      if (!curr.children[char]) {
        curr.children[char] = new TrieNodeDistinct();
        count++;
      }
      curr = curr.children[char];
    }
  }
  return count + 1; // including empty string
}`,
    tags: ['Tries', 'Strings', 'Striver SDE Sheet'],
    examples: ['"abab" -> 8 (distinct: "", "a", "b", "ab", "ba", "aba", "bab", "abab")'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine walking along a branching hedge maze: every unique crossing pathway you trace out is a new distinct substring.',
    intuition: 'Insert all suffixes of the string into a Trie. Every time we instantiate a new node in the Trie, it represents the first appearance of a unique substring.',
    dryRun: 's = "abab". Suffixes are "abab", "bab", "ab", "b". Weave nodes into Trie. Total new allocations = 7. Result = 7 + 1 = 8.',
    mistake: 'Using a Hash Set to store all substrings, resulting in O(N^3) time and memory overheads.',
    prefer: 'Use Trie nodes to count distinct substrings in O(N^2) time and space.'
  },
  {
    title: 'Power Set: Print all Subsequences',
    topic: 'Tries',
    difficulty: 'Medium' as const,
    complexity: 'O(2^N)',
    explanation: 'Generate the complete power set of a string.',
    code: `function powerSet(s) {
  const result = [];
  function backtrack(index, path) {
    if (index === s.length) {
      result.push(path); return;
    }
    backtrack(index + 1, path + s[index]); // include
    backtrack(index + 1, path);            // exclude
  }
  backtrack(0, "");
  return result.sort();
}`,
    tags: ['Recursion', 'Backtracking', 'Striver SDE Sheet'],
    examples: ['"abc" -> ["", "a", "ab", "abc", "ac", "b", "bc", "c"]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine flipping a coin for each letter: heads means keep it, tails means toss it out.',
    intuition: 'Use backtracking. Each index presents a binary choice: include the current character in the subsequence, or skip it.',
    dryRun: 's="ab". include "a" -> "a". include "b" -> "ab". exclude "b" -> "a". exclude "a" -> include "b" -> "b", else "".',
    mistake: 'Using a loops-only structure that is hard to generalize for dynamic string lengths.',
    prefer: 'Apply standard binary choice backtracking recursion to generate all subsequences.'
  },
  {
    title: 'Maximum XOR of Two Numbers',
    topic: 'Tries',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Find the maximum XOR value possible between two numbers inside an array.',
    code: `class TrieNodeBit {
  constructor() { this.children = {}; } // holds '0' and '1'
}
class BitTrie {
  constructor() { this.root = new TrieNodeBit(); }
  insert(num) {
    let curr = this.root;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      if (!curr.children[bit]) curr.children[bit] = new TrieNodeBit();
      curr = curr.children[bit];
    }
  }
  getMaxXOR(num) {
    let curr = this.root, maxXOR = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      const opposite = 1 - bit;
      if (curr.children[opposite]) {
        maxXOR = maxXOR | (1 << i);
        curr = curr.children[opposite];
      } else {
        curr = curr.children[bit];
      }
    }
    return maxXOR;
  }
}
function findMaximumXOR(nums) {
  const trie = new BitTrie();
  for (const n of nums) trie.insert(n);
  let maxVal = 0;
  for (const n of nums) {
    maxVal = Math.max(maxVal, trie.getMaxXOR(n));
  }
  return maxVal;
}`,
    tags: ['Tries', 'Bit Manipulation', 'Striver SDE Sheet'],
    examples: ['[3,10,5,25,2,8] -> 28 (5 XOR 25 = 28)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine searching for your polar opposite: at each junction in a maze, always choose the opposite turn of your active bit if possible to maximize polarity.',
    intuition: 'Store numbers as 32-bit binary paths in a Trie. To maximize XOR for a number, search the Trie: at each bit, greedily choose the opposite bit if it exists.',
    dryRun: 'Insert numbers. For 25 (11001), traverse Trie trying to pick opposite bits. Accumulate XOR results.',
    mistake: 'Using nested loops, resulting in O(N^2) timeouts on large arrays.',
    prefer: 'Use a Binary Bit Trie to resolve maximum XOR queries in O(N) overall time.'
  },
  {
    title: 'Maximum XOR With an Element From Array',
    topic: 'Tries',
    difficulty: 'Hard' as const,
    complexity: 'O((N + Q) log N)',
    explanation: 'Find maximum XOR for queries of type [xi, mi] where elements must be <= mi.',
    code: `class TrieNodeBit2 {
  constructor() { this.children = {}; }
}
class BitTrie2 {
  constructor() { this.root = new TrieNodeBit2(); }
  insert(num) {
    let curr = this.root;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      if (!curr.children[bit]) curr.children[bit] = new TrieNodeBit2();
      curr = curr.children[bit];
    }
  }
  getMaxXOR(num) {
    if (!this.root.children[0] && !this.root.children[1]) return -1;
    let curr = this.root, maxXOR = 0;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >> i) & 1;
      const opposite = 1 - bit;
      if (curr.children[opposite]) {
        maxXOR = maxXOR | (1 << i);
        curr = curr.children[opposite];
      } else if (curr.children[bit]) {
        curr = curr.children[bit];
      } else {
        return -1;
      }
    }
    return maxXOR;
  }
}
function maximizeXor(nums, queries) {
  nums.sort((a, b) => a - b);
  const qWithIdx = queries.map((q, idx) => ({ x: q[0], m: q[1], idx }));
  qWithIdx.sort((a, b) => a.m - b.m);
  const trie = new BitTrie2();
  const ans = new Array(queries.length).fill(-1);
  let i = 0;
  for (const q of qWithIdx) {
    while (i < nums.length && nums[i] <= q.m) {
      trie.insert(nums[i++]);
    }
    ans[q.idx] = trie.getMaxXOR(q.x);
  }
  return ans;
}`,
    tags: ['Tries', 'Bit Manipulation', 'Striver SDE Sheet'],
    examples: ['nums = [0,1,2,3,4], queries = [[3,1]] -> [2]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like sorting tickets at a gate: sort both gate heights and queries. Open the gate progressively to let valid tickets through before searching.',
    intuition: 'Offline Query Optimization. Sort both nums and queries by the boundary value `m`. Insert numbers into the Bit Trie progressively, then resolve the queries.',
    dryRun: 'Sort elements. For queries, dynamically insert numbers into the Trie up to limit `m`. Find maximum XOR and store at correct index.',
    mistake: 'Failing to return -1 for queries where no element in the array is <= m.',
    prefer: 'Check if the Trie is empty at the root to return -1 safely.'
  }
];
