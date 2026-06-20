require('dotenv').config();
const mongoose = require('mongoose');
const { createHash } = require('crypto');

const mongoUri = process.env.MONGO_URI;
const QUANT_PARENT_ID = '3ac92035-d04e-5d30-a358-9197846728e5';
const MIGRATION_NAMESPACE = '7c2fcc3e-7a6d-45a5-a0d3-742fcc3e7a6d';

function parseUUID(uuidStr) {
  const hex = uuidStr.replace(/-/g, '');
  const bytes = Buffer.alloc(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function generateDeterministicUUID(input) {
  const nsBytes = parseUUID(MIGRATION_NAMESPACE);
  const nameBytes = Buffer.from(input, 'utf8');
  const totalBytes = Buffer.concat([nsBytes, nameBytes]);
  
  const hash = createHash('sha1').update(totalBytes).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50; // Version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // Variant RFC4122
  
  const hex = hash.toString('hex');
  return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
}

function processEquations(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/( ?)`([^`]+)`/g, (match, space, p1, offset) => {
    const len = p1.length;
    if (len <= 30) {
      const cleaned = p1.replace(/ /g, '\u00A0');
      return `${space}\`${cleaned}\``;
    } else {
      if (space === ' ') {
        return `\n\`${p1}\``;
      } else {
        return offset > 0 ? `\n\`${p1}\`` : `\`${p1}\``;
      }
    }
  });
}

function formatBullets(arr) {
  if (!arr || arr.length === 0) return '';
  return arr.map(item => `• ${item}`).join('\n\n');
}

// 11 Subfolder Definitions
const SUBFOLDERS = [
  { title: 'Probability', description: 'Core probability rules, independent/dependent events, addition/multiplication rules, and shortcuts.', icon: 'percent', color: '#8B5CF6', order: 1 },
  { title: 'Conditional Probability', description: 'Bayes Theorem, medical testing problems, coin flip conditional probability, and common traps.', icon: 'filter', color: '#8B5CF6', order: 2 },
  { title: 'Expected Value', description: 'EV calculations, fair game concepts, lottery setups, and recursive EV problems.', icon: 'trending-up', color: '#8B5CF6', order: 3 },
  { title: 'Combinatorics', description: 'Permutations, combinations, circular arrangements, derangements, and restrictions.', icon: 'shuffle', color: '#8B5CF6', order: 4 },
  { title: 'Counting Techniques', description: 'Inclusion-exclusion principle, stars & bars method, pigeonhole principle, and path counting.', icon: 'hash', color: '#8B5CF6', order: 5 },
  { title: 'Game Theory', description: 'Optimal plays, winning/losing states, Nim game strategies, and minimax reasoning.', icon: 'target', color: '#8B5CF6', order: 6 },
  { title: 'Logical Puzzles', description: 'Monty Hall, 100 Prisoners, Blue Eyes, Poisoned Bottle, and other classic logic puzzles.', icon: 'help-circle', color: '#8B5CF6', order: 7 },
  { title: 'Statistics', description: 'Mean, median, mode, variance, covariance, correlation, and the Central Limit Theorem.', icon: 'bar-chart-2', color: '#8B5CF6', order: 8 },
  { title: 'Mental Math', description: 'Fast percentage/fraction conversions, mental squares/cubes, and estimation shortcuts.', icon: 'zap', color: '#8B5CF6', order: 9 },
  { title: 'Interview Classics', description: 'Birthday Paradox, Secretary Problem, Coupon Collector, Random Walks, and Gambler\'s Ruin.', icon: 'award', color: '#8B5CF6', order: 10 },
  { title: 'Markov Chains', description: 'States and transition matrices, stationary distribution, and expected steps problems.', icon: 'git-commit', color: '#8B5CF6', order: 11 }
];

function compileSlides(q) {
  const slides = [];

  // Always include exactly one empty intro slide as the first slide
  slides.push({
    type: 'intro',
    headline: '',
    body: '',
    blocks: []
  });

  if (q.type === 'theory') {
    slides.push({
      headline: '💡 Explanation',
      body: formatBullets(q.explanation),
      type: 'explanation'
    });
    slides.push({
      headline: '🧠 Interview Intuition',
      body: formatBullets(q.intuition),
      type: 'explanation'
    });
    slides.push({
      headline: 'Key Takeaways',
      body: formatBullets(q.takeaways),
      type: 'explanation'
    });
  } 
  else if (q.type === 'comparison') {
    slides.push({
      headline: `💡 Concept: ${q.conceptA}`,
      body: formatBullets(q.conceptA_bullets),
      type: 'explanation'
    });
    slides.push({
      headline: `💡 Concept: ${q.conceptB}`,
      body: formatBullets(q.conceptB_bullets),
      type: 'explanation'
    });
    slides.push({
      headline: 'Comparison Table',
      body: formatBullets(q.comparisonTable),
      type: 'explanation'
    });
    slides.push({
      headline: '🧠 Interview Intuition',
      body: formatBullets(q.intuition),
      type: 'explanation'
    });
  } 
  else if (q.type === 'flow') {
    slides.push({
      headline: 'Step 1',
      body: q.step1,
      type: 'explanation'
    });
    slides.push({
      headline: 'Step 2',
      body: q.step2,
      type: 'explanation'
    });
    slides.push({
      headline: 'Step 3',
      body: q.step3,
      type: 'explanation'
    });
    if (q.step4) {
      slides.push({
        headline: 'Step 4',
        body: q.step4,
        type: 'explanation'
      });
    }
    if (q.step5) {
      slides.push({
        headline: 'Step 5',
        body: q.step5,
        type: 'explanation'
      });
    }
    slides.push({
      headline: 'Final Flow',
      body: q.finalFlow,
      type: 'explanation'
    });
    slides.push({
      headline: '🧠 Interview Intuition',
      body: formatBullets(q.intuition),
      type: 'explanation'
    });
  } 
  else if (q.type === 'numerical' || q.type === 'puzzle') {
    slides.push({
      headline: 'Step 1',
      body: q.step1,
      type: 'explanation'
    });
    slides.push({
      headline: 'Step 2',
      body: q.step2,
      type: 'explanation'
    });
    slides.push({
      headline: 'Step 3',
      body: q.step3,
      type: 'explanation'
    });
    if (q.step4) {
      slides.push({
        headline: 'Step 4',
        body: q.step4,
        type: 'explanation'
      });
    }
    slides.push({
      headline: 'Final Answer',
      body: q.answer,
      type: 'explanation'
    });
    slides.push({
      headline: '🧠 Interview Shortcut',
      body: q.shortcut,
      type: 'explanation'
    });
  }

  return slides;
}

const QUANT_CARDS_DATA = {
  'Probability': [
    {
      title: 'Sample Space',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Sample Space** (denoted by `S` or `Ω`) is the set of all possible outcomes of a random experiment.',
      explanation: [
        'Formulates the baseline of any probability computation by setting boundaries for outcomes.\nMust be mutually exclusive and collectively exhaustive to avoid overlaps or unrepresented possibilities.',
        'Determines the denominator in classical probability. If the sample space contains outcomes that are equally likely, then\n`P(A) = |A| / |S|`.',
        'Can be discrete (e.g., throwing a die `S = {1,2,3,4,5,6}`) or continuous (e.g., measuring lifetime of a bulb `S = [0, ∞)`).'
      ],
      intuition: [
        'In interviews, always define your sample space first. Missing a single outcome (like a coin landing on its edge or not accounting for birth order in gender puzzles) leads to wrong calculations.'
      ],
      takeaways: [
        'Sample space is the set of **all** possible experiment outcomes.',
        'Must be mutually exclusive (no overlap) and exhaustive.',
        'Sizing the sample space provides the math denominator.'
      ]
    },
    {
      title: 'Favorable Outcomes',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **Favorable Outcome** represents an event subset `E` within the sample space `S` that satisfies a specific condition.',
      explanation: [
        'Represents the target events whose probability is being computed. The number of favorable outcomes is denoted by `|E|`.',
        'Formulates the numerator in the classical probability formula `P(E) = |E| / |S|`. Finding this often requires counting tools like combinations.',
        'Can be a single outcome (simple event) or a combination of multiple outcomes (compound event).'
      ],
      intuition: [
        'Focus on how restrictions filter the sample space. For example, when throwing two dice, if the event is "sum equals 7", the favorable subset is `{(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)}` out of 36.'
      ],
      takeaways: [
        'Favorable outcomes represent the event subset `E`.',
        'Provides the mathematical numerator in probability ratios.',
        'Requires systematic enumeration or combinatorics to calculate accurately.'
      ]
    },
    {
      title: 'Independent Events',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Two events `A` and `B` are **Independent** if the occurrence of one does not change the probability of the other.',
      explanation: [
        'Pathways of influence: Mathematically defined as `P(A ∩ B) = P(A) * P(B)`. This is the multiplication rule for independent events.',
        'Implies that conditional probability matches absolute probability: `P(A|B) = P(A)` and `P(B|A) = P(B)`. Knowing `B` happened gives zero new info about `A`.',
        'Different from physical isolation. Independent events can happen in the same time-space, but their underlying systems must share no statistical correlation.'
      ],
      intuition: [
        'A common mistake is assuming "independent" means "disjoint". Disjoint events are highly dependent: if `A` happens, `B` cannot happen, meaning `P(B|A) = 0`. Independence requires zero information exchange.'
      ],
      takeaways: [
        'Independence formula:\n`P(A ∩ B) = P(A) * P(B)`.',
        'Conditional probability matches absolute:\n`P(A|B) = P(A)`.',
        'Do not confuse independence with mutually exclusive events.'
      ]
    },
    {
      title: 'Dependent Events',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Two events are **Dependent** if the occurrence of one changes the probability of the occurrence of the other.',
      explanation: [
        'Statistical connection: Occurs when the probability of event `B` changes depending on whether `A` happened. Mathematically,\n`P(B|A) ≠ P(B)`.',
        'The joint probability of dependent events requires conditional probability:\n`P(A ∩ B) = P(A) * P(B|A)`.',
        'Common in processes without replacement (e.g., drawing cards from a deck without putting them back alters the deck size and composition).'
      ],
      intuition: [
        'Identify dependencies by tracking the state of the system. If the sample space changes in size or composition after the first step, subsequent steps are dependent on it.'
      ],
      takeaways: [
        'Dependency formula:\n`P(A ∩ B) = P(A) * P(B|A)`.',
        'Commonly occurs during "drawing without replacement" setups.',
        'Requires tracking structural shifts in the sample space.'
      ]
    },
    {
      title: 'Mutually Exclusive Events',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Events are **Mutually Exclusive** (or disjoint) if they cannot occur at the same time.',
      explanation: [
        'Exclusive states: If event `A` occurs, event `B` cannot occur. Their intersection is empty:\n`A ∩ B = ∅`.',
        'Mathematically, their joint probability is zero:\n`P(A ∩ B) = 0`.',
        'The addition rule simplifies for disjoint events: `P(A ∪ B) = P(A) + P(B)`. There is no overlap to subtract.'
      ],
      intuition: [
        'Think of a coin flip: landing on Heads and landing on Tails are mutually exclusive. In interviews, remember that mutually exclusive events are dependent because knowing one happened tells you the other definitely did not.'
      ],
      takeaways: [
        'Intersection probability is zero:\n`P(A ∩ B) = 0`.',
        'Simplified addition rule:\n`P(A ∪ B) = P(A) + P(B)`.',
        'Disjoint events are inherently dependent.'
      ]
    },
    {
      title: 'Complement Rule',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Complement Rule** states that the probability of an event `A` occurring plus the probability of its complement `A\'` is exactly `1`.',
      explanation: [
        'System partitioning: Written as `P(A) + P(A\') = 1` or `P(A\') = 1 - P(A)`. The event and its complement partition the sample space.',
        'Saves time when calculating "at least one" events. Instead of summing many complex terms, compute the probability of "none" and subtract from 1.',
        'Extends to multiple events where the complement event is simpler to construct and count.'
      ],
      intuition: [
        'If an interviewer asks for "the probability of getting at least one 6 in 4 rolls", do not sum the probabilities of getting 1, 2, 3, or 4 sixes. Compute the probability of getting "no 6" in all rolls (`(5/6)^4`) and subtract it from 1.'
      ],
      takeaways: [
        'Complement formula:\n`P(A\') = 1 - P(A)`.',
        'Highly effective for calculating "at least one" probabilities.',
        'Reduces complex multi-event problems to a single calculation.'
      ]
    },
    {
      title: 'Addition Rule',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Addition Rule** calculates the probability of the union of two events (either event `A` or event `B` occurring).',
      explanation: [
        'Venn mathematics: The general formula is `P(A ∪ B) = P(A) + P(B) - P(A ∩ B)`. We subtract the intersection because it is counted twice.',
        'If the events are mutually exclusive, the intersection is zero, simplifying the formula to:\n`P(A ∪ B) = P(A) + P(B)`.',
        'Extends to three events:\n`P(A ∪ B ∪ C) = P(A) + P(B) + P(C) - P(A ∩ B) - P(B ∩ C) - P(A ∩ C) + P(A ∩ B ∩ C)`.'
      ],
      intuition: [
        'Visualize a Venn diagram. Adding the circles `A` and `B` doubles the weight of the overlapping region. Subtracting the intersection restores the balance.'
      ],
      takeaways: [
        'Union formula:\n`P(A ∪ B) = P(A) + P(B) - P(A ∩ B)`.',
        'Subtracting the intersection prevents double counting.',
        'Simplifies to `P(A) + P(B)` for disjoint events.'
      ]
    },
    {
      title: 'Multiplication Rule',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Multiplication Rule** calculates the joint probability of two events occurring together (intersection of `A` and `B`).',
      explanation: [
        'Intersection calculations: The general formula is `P(A ∩ B) = P(A) * P(B|A)` or `P(A ∩ B) = P(B) * P(A|B)`. This applies to all events.',
        'For independent events, since `P(B|A) = P(B)`, the formula simplifies to:\n`P(A ∩ B) = P(A) * P(B)`.',
        'Can be chained for multiple events:\n`P(A ∩ B ∩ C) = P(A) * P(B|A) * P(C|A ∩ B)`.'
      ],
      intuition: [
        'Think of the rule as walking down a path of decision trees. You must cross the first gate (`P(A)`) and then cross the second gate given you crossed the first (`P(B|A)`).'
      ],
      takeaways: [
        'Joint probability:\n`P(A ∩ B) = P(A) * P(B|A)`.',
        'Independent version:\n`P(A ∩ B) = P(A) * P(B)`.',
        'Can be chained sequentially for any number of events.'
      ]
    },
    {
      title: 'Law of Total Probability',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Law of Total Probability** calculates the overall probability of an event by summing its conditional probabilities across a partitioned sample space.',
      explanation: [
        'Partition summing: If events `B1, B2, ..., Bn` partition the sample space (disjoint and sum to 1), then\n`P(A) = Σ P(A|Bi) * P(Bi)`.',
        'Allows you to solve a complex probability by dividing it into simpler conditional branches.',
        'Forms the mathematical denominator for Bayes Theorem calculations.'
      ],
      intuition: [
        'Think of it as a weighted average. If you are drawing from three bags with different ball ratios, the overall probability of drawing a red ball is the sum of the probabilities of choosing a bag times the probability of drawing red from that bag.'
      ],
      takeaways: [
        'Total probability formula:\n`P(A) = Σ P(A|Bi) * P(Bi)`.',
        'Requires a partition of the sample space.',
        'Essential for solving multi-stage branch problems.'
      ]
    },
    {
      title: 'Probability Tricks',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Probability tricks utilize symmetry, complements, and indicator variables to bypass long calculations in interviews.',
      explanation: [
        'Symmetry: If `N` items are arranged randomly in a circle, the probability that item `A` is next to `B` is independent of their exact locations.',
        'Complement shortcut: Whenever you see "at least", reformulate the problem to `1 - P(None)` to avoid summing multiple terms.',
        'Geometric probability: For continuous variables, sketch the coordinate system and compute the ratio of the areas representing the favorable condition vs the sample space.'
      ],
      intuition: [
        'Look for symmetry. If 100 people roll a die, the probability that the 50th person rolls a 6 is exactly `1/6`, the same as the 1st person. Order of execution without replacement maintains uniform probability distribution across positions.'
      ],
      takeaways: [
        'Use symmetry to resolve order-based questions instantly.',
        'Use complements to avoid sum series.',
        'Use area ratios for continuous probability.'
      ]
    },
    {
      title: 'Probability Interview Patterns',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Probability interview patterns group questions into recurring archetypes like coin sequences, random walks, and bag drawings.',
      explanation: [
        'Coin sequences: Finding the expected flips to get `HT` vs `HH`. These are solved using recursive conditional equations.',
        'Bag drawings: Drawing colored balls with/without replacement. These require combinatorics (`nCr`) or conditional chains.',
        'Grid/Path walks: Moving on a coordinate grid from `(0,0)` to `(X,Y)` with random steps, solved using combinations.'
      ],
      intuition: [
        'Recognize the archetype early. When an interviewer describes a system that resets or transitions based on states, immediately set up recursive state equations (`E[X] = 1 + ...`).'
      ],
      takeaways: [
        'Identify coin/dice state-reset patterns.',
        'Use combinations for bag drawing paths.',
        'Map state spaces to solve random walks.'
      ]
    }
  ],
  'Conditional Probability': [
    {
      title: 'Conditional Probability Basics',
      difficulty: 'Easy',
      type: 'theory',
      intro: '**Conditional Probability** measures the probability of an event `A` occurring given that another event `B` has already occurred.',
      explanation: [
        'Math description: Denoted as `P(A|B)` (read "probability of A given B").',
        'Formula: `P(A|B) = P(A ∩ B) / P(B)`, where `P(B) > 0`. We restrict our universe to the outcomes in `B`.',
        'Shifts the sample space from the entire universe `S` to the subset `B`. Only the outcomes of `A` that fall inside `B` remain favorable.'
      ],
      intuition: [
        'Think of it as filtering a spreadsheet. If you look at all candidates, the probability of knowing C++ is `P(C++)`. If you filter to only CS graduates, you compute the conditional probability:\n`P(C++ | CS)`.'
      ],
      takeaways: [
        'Formula:\n`P(A|B) = P(A ∩ B) / P(B)`.',
        'Restricts the sample space denominator to the given event.',
        'Forms the foundation of Bayes Theorem.'
      ]
    },
    {
      title: 'Bayes Theorem',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Bayes Theorem** relates conditional probabilities and their inverses, updating event likelihood based on new evidence.',
      explanation: [
        'Reverse modeling: Formula is:\n`P(A|B) = [P(B|A) * P(A)] / P(B)`.',
        'Can be expanded using the Law of Total Probability:\n`P(A|B) = [P(B|A) * P(A)] / [P(B|A)*P(A) + P(B|A\')*P(A\')]`.',
        'Components: `P(A)` is the Prior, `P(B|A)` is the Likelihood, `P(B)` is the Normalizing Constant, and `P(A|B)` is the Posterior.'
      ],
      intuition: [
        'Bayes Theorem allows you to reverse conditional directions. If you know the probability of having a fever given you have flu, Bayes helps you find the probability of having flu given you have a fever.'
      ],
      takeaways: [
        'Bayes Formula:\n`P(A|B) = [P(B|A) * P(A)] / P(B)`.',
        'Allows reversing conditional directions.',
        'Updates prior beliefs using new evidence.'
      ]
    },
    {
      title: 'Bayes Intuition',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Bayes Intuition helps prevent the base rate fallacy by separating the prior likelihood from test accuracy.',
      explanation: [
        'Cognitive alignment: Base Rate Fallacy occurs when misinterpreting high test accuracy as a high posterior probability while ignoring the rarity of the condition.',
        'Likelihood ratio: A highly accurate test for a rare disease still yields mostly false positives because the base rate of healthy people is massive.',
        'Updates: Prior probability is updated by evidence to produce the posterior. Rarity acts as an anchor.'
      ],
      intuition: [
        'If a disease affects 1 in 10,000 people and a test is 99% accurate, a positive test result only means a `~1%` chance of actually having the disease. The pool of false positives from the 9,999 healthy people dominates the pool of true positives.'
      ],
      takeaways: [
        'Always combine base rates with test accuracy.',
        'Rare priors require extremely strong evidence to shift.',
        'Avoid the base rate fallacy in diagnostics.'
      ]
    },
    {
      title: 'Medical Testing Problems',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate the probability that a patient has a disease given a positive test result, considering base rate and accuracy.',
      step1: 'Identify the parameters: Prior probability `P(D) = 0.001` (1 in 1000 have the disease). Test sensitivity `P(+|D) = 0.99` (true positive rate) and specificity `P(-|D\') = 0.98` (true negative rate, which means false positive rate `P(+|D\') = 0.02`).',
      step2: 'Apply the Law of Total Probability to find the overall positive test rate `P(+) = P(+|D)*P(D) + P(+|D\')*P(D\')`. Substituting values:\n`P(+) = (0.99 * 0.001) + (0.02 * 0.999) = 0.00099 + 0.01998 = 0.02097`.',
      step3: 'Use Bayes Theorem to calculate the posterior probability:\n`P(D|+) = [P(+|D) * P(D)] / P(+) = 0.00099 / 0.02097`.',
      answer: 'Posterior probability `P(D|+) ≈ 0.047` or `4.7%`. Despite a 99% accurate test, there is only a 4.7% chance the patient has the disease due to its rarity.',
      shortcut: 'Out of 100,000 people, 100 have it (99 test positive) and 99,900 do not (1,998 test positive). Total positive tests = 2,097. Probability =\n`99 / 2097 ≈ 4.7%`.'
    },
    {
      title: 'Coin Flip Conditional Probability',
      difficulty: 'Medium',
      type: 'puzzle',
      intro: 'A classic puzzle: You choose a coin from a bag containing one two-headed coin, one regular coin, and one two-tailed coin. You flip it and get Heads. What is the probability that the other side is also Heads?',
      step1: 'Define the events and priors. Three coins: `C1` (double Heads), `C2` (normal), `C3` (double Tails). Priors:\n`P(C1) = P(C2) = P(C3) = 1/3`.',
      step2: 'Define the condition. We see Heads on the flip. The conditional probabilities of flipping Heads are: `P(H|C1) = 1`, `P(H|C2) = 0.5`,\n`P(H|C3) = 0`.',
      step3: 'Calculate overall probability of flipping Heads: `P(H) = P(H|C1)*P(C1) + P(H|C2)*P(C2) = (1 * 1/3) + (0.5 * 1/3) = 1/2`. Now find\n`P(C1|H) = [P(H|C1) * P(C1)] / P(H) = (1 * 1/3) / (1/2) = 2/3`.',
      answer: 'The probability that the other side is Heads is the probability that you chose the double-headed coin, which is:\n`2/3`.',
      shortcut: 'There are 6 sides in total. 3 sides are Heads (2 from C1, 1 from C2). If you see a Head, you are looking at one of these 3 sides. In 2 of those cases, the coin is C1. Probability =\n`2/3`.'
    },
    {
      title: 'Card Drawing Conditional Probability',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate the probability of drawing specific cards sequentially without replacement.',
      step1: 'Identify the target: drawing two Aces in a row from a standard 52-card deck.',
      step2: 'Find the probability of the first card being an Ace:\n`P(A1) = 4 / 52`.',
      step3: 'Find the conditional probability of drawing a second Ace given the first was an Ace: `P(A2|A1) = 3 / 51` (one Ace and one card removed). Calculate joint:\n`P(A1 ∩ A2) = (4/52) * (3/51)`.',
      answer: 'Joint probability:\n`P(A1 ∩ A2) = 12 / 2652 = 1 / 221 ≈ 0.45%`.',
      shortcut: 'Number of ways to draw 2 Aces is `4C2 = 6`. Total ways to draw 2 cards is `52C2 = 1326`. Probability =\n`6 / 1326 = 1 / 221`.'
    },
    {
      title: 'Information Changes Probability',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'Introducing new facts about a system filters the sample space and alters the probabilities of remaining outcomes.',
      explanation: [
        'Information constraints: Known as the "Boy or Girl" paradox archetype. Knowing a family has at least one boy yields different probabilities than knowing the eldest child is a boy.',
        '"Eldest is a boy" specifies a position: sample space is `{BG, BB}` (favorable `BB` = 1/2).',
        '"At least one is a boy" does not specify position: sample space is `{BG, GB, BB}` (favorable `BB` = 1/3).'
      ],
      intuition: [
        'Pay close attention to how information is revealed. If the information specifies a particular instance (e.g. "I saw the eldest child"), it divides the space symmetrically. If it is global (e.g. "At least one"), it removes options unsymmetrically.'
      ],
      takeaways: [
        'Specific identifiers preserve symmetry.',
        'Global constraints filter the sample space asymmetrical.',
        'Always list the filtered sample space when new info is given.'
      ]
    },
    {
      title: 'Common Interview Traps',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'Avoid standard cognitive errors in conditional probability, such as treating dependent events as independent or ignoring base rates.',
      explanation: [
        'Prosecutor\'s Fallacy: Confusing `P(Evidence | Innocent)` with `P(Innocent | Evidence)`. A low match rate of DNA does not mean guilt if the population is massive.',
        'Monty Hall Trap: Assuming that since two doors remain, the probability is split `50/50`. The host\'s action was dependent on your choice, which concentrates probability.',
        'Order effects: Forgetting to scale by arrangements when calculating conditional combinations.'
      ],
      intuition: [
        'In interviews, if a question seems too simple (like a 50/50 split after an event), check if the revealing action was dependent on hidden parameters.'
      ],
      takeaways: [
        'Never confuse `P(A|B)` with `P(B|A)`.',
        'Verify if revealing actions are random or restricted.',
        'Write out intersections explicitly during doubts.'
      ]
    }
  ],
  'Expected Value': [
    {
      title: 'Expected Value Basics',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Expected Value (EV)** of a random variable is its long-run arithmetic average value over many repetitions.',
      explanation: [
        'Equilibrium point: Reps the center of gravity of the probability distribution. It does not have to be a value the variable can actually take.',
        'Weighted average: Each possible value is multiplied by its probability of occurrence, and the products are summed.',
        'Linearity of Expectation: `E[X + Y] = E[X] + E[Y]` holds true even if `X` and `Y` are dependent. This is a powerful shortcut.'
      ],
      intuition: [
        'If you play a game where you win $10 with 50% probability and lose $5 with 50% probability, the expected value is `$2.50`. Over thousands of runs, your average payoff per game converges to this value.'
      ],
      takeaways: [
        'EV is the long-term average value of a random variable.',
        'Formula:\n`E[X] = Σ x * P(X = x)`.',
        'Linearity of expectation holds for dependent variables.'
      ]
    },
    {
      title: 'EV Formula',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The mathematical formulas define expected value for both discrete and continuous random variables.',
      explanation: [
        'Mathematical representations: Discrete formula is `E[X] = Σ x_i * P(X = x_i)` for all possible outcomes `i`.',
        'Continuous formula: `E[X] = ∫ x * f(x) dx` integrated from `-∞` to `+∞`, where `f(x)` is the probability density function.',
        'Properties: `E[c] = c` (constant), `E[cX] = c * E[X]`, and if `X` and `Y` are independent,\n`E[X * Y] = E[X] * E[Y]`.'
      ],
      intuition: [
        'Remember that `E[X^2]` is not `(E[X])^2`. Their difference is the variance:\n`Var(X) = E[X^2] - (E[X])^2`.'
      ],
      takeaways: [
        'Discrete: Sum of value times probability.',
        'Continuous: Integration of value times density.',
        'Difference of `E[X^2]` and `E[X]^2` is Variance.'
      ]
    },
    {
      title: 'Fair Game Concept',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **Fair Game** is a game of chance where the expected value of the net profit is exactly zero.',
      explanation: [
        'Game neutrality: For a game to be fair, the entry cost must equal the expected gross payoff:\n`E[Net Profit] = E[Payoff] - Cost = 0`.',
        'If `E[Net Profit] > 0`, the game favors the player; if `E[Net Profit] < 0`, it favors the house (casino edge).',
        'In finance, pricing derivatives uses risk-neutral valuation, which forces the expectation of returns to match the risk-free rate (making transactions fair).'
      ],
      intuition: [
        'If an interviewer asks "How much would you pay to play a game where you roll a die and get paid the face value?", calculate the EV of the die (`3.5`). A fair price to pay is exactly `$3.50`.'
      ],
      takeaways: [
        'Fair game:\n`E[Net Profit] = 0`.',
        'Entry fee must equal expected payoff.',
        'Foundation of financial asset pricing.'
      ]
    },
    {
      title: 'Unfair Game Concept',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'An **Unfair Game** has a non-zero expected profit, creating an edge for either the player or the house.',
      explanation: [
        'Asymmetrical advantages: All casino games are unfair games with negative EV for the player (e.g. Roulette house edge is `~2.7%` to `5.3%`).',
        'If a game has a positive EV for you, the optimal strategy is to maximize play count to let the Law of Large Numbers secure your profit.',
        'Helps in risk management: avoiding bets where the probability of winning is high but the payout is too low to cover the loss risk.'
      ],
      intuition: [
        'In trading or betting, look for "positive expectancy". Even if your win rate is only 40%, if your average win pays 3x your average loss, the EV is positive:\n`(0.4 * 3) + (0.6 * -1) = +0.6`.'
      ],
      takeaways: [
        'Unfair game:\n`E[Net Profit] ≠ 0`.',
        'House edge guarantees long-term player losses.',
        'Expectancy combines win rate with payout size.'
      ]
    },
    {
      title: 'Dice EV Problems',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate the expected value of rolling one or more standard dice under specific conditions.',
      step1: 'Identify the outcomes of a standard 6-sided die: `{1, 2, 3, 4, 5, 6}`, each with probability:\n`1/6`.',
      step2: 'Apply the EV formula for one die:\n`E[X] = (1 * 1/6) + (2 * 1/6) + (3 * 1/6) + (4 * 1/6) + (5 * 1/6) + (6 * 1/6) = 21/6 = 3.5`.',
      step3: 'Calculate the expected sum of two independent dice: using Linearity of Expectation, `E[X1 + X2] = E[X1] + E[X2] = 3.5 + 3.5 = 7` (holds even if they are somehow tied/dependent).',
      answer: 'Expected value of one die is `3.5`. Expected sum of two dice is `7`.',
      shortcut: 'Symmetry rule: The average of the minimum (1) and maximum (6) outcomes of a uniform discrete distribution is:\n`(1 + 6) / 2 = 3.5`.'
    },
    {
      title: 'Coin EV Problems',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate expected value when flipping coins, such as counting the expected number of Heads in a series of trials.',
      step1: 'Set up the experiment: Flip a fair coin `N` times. Let `X` be the number of Heads. We want to find\n`E[X]`.',
      step2: 'Define indicator variables: Let `Xi = 1` if the `i-th` flip is Heads, and `Xi = 0` otherwise. The probability `P(Xi = 1) = 0.5`. Thus,\n`E[Xi] = 1 * 0.5 + 0 * 0.5 = 0.5`.',
      step3: 'Sum the expectations: Total Heads `X = X1 + X2 + ... + XN`. Using linearity:\n`E[X] = E[X1] + E[X2] + ... + E[XN] = N * 0.5`.',
      answer: 'Expected number of Heads in `N` flips is:\n`N / 2`.',
      shortcut: 'For any binomial distribution with parameters `N` and `p`, the expected value is simply `N * p`. Here,\n`N * 0.5 = 0.5N`.'
    },
    {
      title: 'Lottery EV',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate the expected value of a lottery ticket to determine if buying it is a rational financial decision.',
      step1: 'Identify the payoffs and probabilities: Ticket costs $2. Grand prize is $10 million with probability 1 in 10 million. Smaller prizes: $100 with probability 1 in 1,000.',
      step2: 'Calculate expected gross payoff:\n`E[Gross] = ($10,000,000 * 1/10,000,000) + ($100 * 1/1,000) = $1.00 + $0.10 = $1.10`.',
      step3: 'Calculate expected net profit:\n`E[Net] = E[Gross] - Cost = $1.10 - $2.00 = -$0.90`.',
      answer: 'Expected net profit is `-$0.90` per ticket. Buying a ticket loses 90 cents on average, making it a negative EV decision.',
      shortcut: 'Unless the jackpot grows huge (and tax/split-prize options are neglected) such that `E[Gross] > Ticket Cost`, playing lotteries is a losing game.'
    },
    {
      title: 'Multiple Round EV',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate expected payoffs in multi-stage games where actions in early rounds affect options in later rounds.',
      step1: 'Understand the game: You roll a die. You can either keep the face value in dollars or reject it and roll a second time (final value). What is your optimal strategy and expected value?',
      step2: 'Work backward from the final round. If you roll a second time, the expected value of that roll is:\n`E[R2] = 3.5`.',
      step3: 'Determine optimal strategy for Round 1: You should roll again only if the first roll is less than the expected value of the second roll (`< 3.5`). So, keep `{4, 5, 6}` and reject `{1, 2, 3}`. Calculate EV:\n`(1/2 * average(4,5,6)) + (1/2 * E[R2]) = (1/2 * 5) + (1/2 * 3.5) = 2.5 + 1.75 = 4.25`.',
      answer: 'Expected value of this game is `$4.25`. Optimal strategy is to keep rolls ≥ 4.',
      shortcut: 'Symmetry of choice: The average payoff from keeping is `5` (half the time). The payoff from rolling again is `3.5` (half the time). Overall EV =\n`0.5*5 + 0.5*3.5 = 4.25`.'
    },
    {
      title: 'Recursive EV Problems',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Solve expected value problems with infinite loops or resetting conditions using recursive equations.',
      step1: 'Understand the problem: A game involves flipping a fair coin until you get two consecutive Heads (HH). What is the expected number of flips?',
      step2: 'Define states: Let `x` be the expected flips from start. Let `y` be the expected remaining flips if we just got a Head (H).',
      step3: 'Set up recursive equations: From start: `x = 1 + 0.5*x (got T, reset) + 0.5*y (got H)`. From H state: `y = 1 + 0.5*0 (got H, game ends) + 0.5*x (got T, reset)`. Simplify: `x = 1 + 0.5x + 0.5y` ➔ `0.5x = 1 + 0.5y` ➔ `x = 2 + y`. Substitute into second equation: `y = 1 + 0.5x` ➔ `y = 1 + 0.5(2 + y) = 2 + 0.5y` ➔ `0.5y = 2` ➔ `y = 4`. Find\n`x = 2 + 4 = 6`.',
      answer: 'The expected number of flips to get two consecutive Heads (HH) is `6`.',
      shortcut: 'State transition trick: Let `E` be the target flips. `E` satisfies the recursive partition: `E = 6`. (For HT, the answer is 4, showing sequence patterns matter due to overlaps).'
    },
    {
      title: 'EV Optimization',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'Expected Value Optimization is the process of selecting decisions that maximize expected utility or payoff.',
      explanation: [
        'Asymptotic utility: Combines decision trees with probability weights. The optimal decision is:\n`D* = argmax E[Utility(D)]`.',
        'Utility vs Cash: Rational decision makers optimize expected *utility* rather than cash value. This explains risk aversion (utility of $10M is not 10x the utility of $1M).',
        'Continuous optimization: Solved by setting the derivative of the expected payoff function with respect to the decision variable to zero.'
      ],
      intuition: [
        'In trading or bidding, bidding lower increases profit if you win but decreases the probability of winning. Optimization finds the sweet spot where `P(Win) * Profit` is maximized.'
      ],
      takeaways: [
        'Select actions that maximize expected utility.',
        'Accounts for risk preferences using utility functions.',
        'Balances payoff size against execution probability.'
      ]
    },
    {
      title: 'Interview EV Patterns',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Recognize expected value patterns in interviews, such as indicator variables, state-machines, and stop-rules.',
      explanation: [
        'Common architectures: Indicator variables are used to calculate expectations of sums (e.g. number of couples sitting together at a table) without computing joint distributions.',
        'First-step analysis: Setting up conditional expectation based on the first outcome of the process, leading to linear equations.',
        'Symmetric bets: Finding pricing limits for asymmetric payoffs.'
      ],
      intuition: [
        'If the question asks for the expected number of cards you need to turn over to find the first Ace, do not sum a giant series. Use indicator variables for the non-Ace cards, yielding\n`E[X] = 10.6`.'
      ],
      takeaways: [
        'Indicator variables simplify complex joint systems.',
        'First-step analysis resolves infinite chains.',
        'Symmetry reduces dimensional calculations.'
      ]
    }
  ],
  'Combinatorics': [
    {
      title: 'Rule of Sum',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Rule of Sum** is a fundamental counting principle used to calculate the size of the union of disjoint sets.',
      explanation: [
        'Set partitions: If an event can occur in `A` ways, and a second disjoint event can occur in `B` ways, then either event can occur in `A + B` ways.',
        'Disjoint condition: The options must be mutually exclusive. If they overlap, you must apply the Inclusion-Exclusion Principle instead.',
        'Corresponds to the logical operator **OR** in counting systems.'
      ],
      intuition: [
        'If a restaurant offers 5 vegetarian dishes and 4 meat dishes, and you want to choose *one* dish, you have `5 + 4 = 9` options. You cannot choose both.'
      ],
      takeaways: [
        'Rule of Sum = Addition for disjoint choices.',
        'Corresponds to the logical operator OR.',
        'Requires zero overlap between sets.'
      ]
    },
    {
      title: 'Rule of Product',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Rule of Product** is a counting principle used to calculate the total options in a sequence of choices.',
      explanation: [
        'Sequential events: If a first choice can be made in `A` ways, and for each of these choices a second choice can be made in `B` ways, the sequence of choices can be made in `A * B` ways.',
        'Applies to independent sequential operations. The choice made in the first step does not restrict the number of choices in the second step.',
        'Corresponds to the logical operator **AND** in counting systems.'
      ],
      intuition: [
        'If you have 3 shirts and 4 pants, the number of unique outfits you can choose is `3 * 4 = 12`. For each shirt, you can pair it with any of the 4 pants.'
      ],
      takeaways: [
        'Rule of Product = Multiplication for sequential steps.',
        'Corresponds to the logical operator AND.',
        'Requires independent options at each stage.'
      ]
    },
    {
      title: 'Factorials',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **Factorial** (denoted by `n!`) represents the number of ways to arrange `n` distinct objects in a linear sequence.',
      explanation: [
        'Arrangements logic: Formula is `n! = n * (n-1) * (n-2) * ... * 1`, with definition\n`0! = 1`.',
        'Grows extremely fast (faster than exponential functions). Stirling\'s approximation `n! ≈ √(2πn) * (n/e)^n` is used to estimate large factorials.',
        'Forms the basis of permutation and combination formulas.'
      ],
      intuition: [
        'If you arrange 5 books on a shelf, you have 5 choices for the first slot, 4 for the second, 3 for the third, 2 for the fourth, and 1 for the last. Total arrangements =\n`5! = 120`.'
      ],
      takeaways: [
        'Arranging `n` distinct items = `n!` ways.',
        'Grows faster than exponential functions.',
        'Defined as `0! = 1` for consistent formula algebra.'
      ]
    },
    {
      title: 'Permutations',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **Permutation** calculates the number of ways to select and arrange a subset of objects from a larger set where order matters.',
      explanation: [
        'Arranging selections: Formula is `nPr = n! / (n - r)!`, representing the number of ways to arrange `r` items chosen from a pool of `n` items.',
        'Order-sensitive: Arranging items `A` and `B` as `AB` is counted as a different permutation than `BA`.',
        'Can be solved using the multiplication rule: `n` options for slot 1, `n-1` for slot 2, down to:\n`n-r+1`.'
      ],
      intuition: [
        'If 10 runners compete in a race, the number of ways the gold, silver, and bronze medals can be awarded is `10P3 = 10! / 7! = 10 * 9 * 8 = 720`. Ordering matters.'
      ],
      takeaways: [
        'Permutations formula:\n`nPr = n! / (n - r)!`.',
        'Order of selected items is critical.',
        'Equivalent to selection followed by ordering.'
      ]
    },
    {
      title: 'Combinations',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **Combination** calculates the number of ways to select a subset of objects from a larger set where order does not matter.',
      explanation: [
        'Unordered selections: Formula is `nCr = n! / [r! * (n - r)!]`, also denoted as `(n choose r)`.',
        'Order-insensitive: Selecting `A` then `B` is identical to selecting `B` then `A`. We divide by `r!` to strip away arrangement duplicates.',
        'Symmetry property: `nCr = nC(n-r)`. Choosing `r` items to keep is identical to choosing `n-r` items to discard.'
      ],
      intuition: [
        'If you want to choose a committee of 3 people from a group of 10, the order of selection is irrelevant. The number of unique committees is:\n`10C3 = (10*9*8) / (3*2*1) = 120`.'
      ],
      takeaways: [
        'Combinations formula:\n`nCr = n! / [r!(n-r)!]`.',
        'Order of selected items is irrelevant.',
        'Symmetrical property:\n`nCr = nC(n-r)`.'
      ]
    },
    {
      title: 'Circular Arrangements',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Circular arrangements count the ways to arrange objects in a loop, where rotations are considered identical.',
      explanation: [
        'Rotational loops: Arranging `n` distinct items in a circle has `(n - 1)!` unique ways. We fix one item to break rotational symmetry.',
        'If the circle can be flipped (like a necklace of beads where clockwise and counterclockwise arrangements are identical), divide by 2:\n`(n - 1)! / 2`.',
        'Relative positions are what matter, rather than absolute coordinate positions.'
      ],
      intuition: [
        'If 5 people sit at a round table, placing them as `ABCDE` or `BCDEA` is the same seating arrangement because everyone has the same neighbors. Fixing person `A` leaves 4 slots to fill: `4! = 24` arrangements.'
      ],
      takeaways: [
        'Linear arrangements: `n!`, Circular arrangements:\n`(n - 1)!`.',
        'Divide by 2 if clockwise/counterclockwise matches.',
        'Fixing one element breaks rotational symmetry.'
      ]
    },
    {
      title: 'Repeated Elements',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Arrange items containing identical duplicates by dividing out permutation repetitions.',
      explanation: [
        'Multiset partitions: Arranging `n` items where `n1` are identical of type 1, `n2` of type 2, etc., has `n! / (n1! * n2! * ...)` ways.',
        'Prevents overcounting: swapping identical items does not create a new visual sequence.',
        'Forms the basis of path counting on grids.'
      ],
      intuition: [
        'To arrange the letters of "PEPPER" (6 letters: 3 P\'s, 2 E\'s, 1 R): start with `6! = 720`. Divide by `3!` for P repetitions and `2!` for E repetitions: `720 / (6 * 2) = 60` arrangements.'
      ],
      takeaways: [
        'Arrangements formula:\n`n! / (n1! * n2! ...)`.',
        'Divides out internal permutations of identical elements.',
        'Crucial for word arrangement puzzles.'
      ]
    },
    {
      title: 'Derangements',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Calculate the number of ways to arrange `n` items such that no item appears in its original starting position.',
      step1: 'Identify the derangement formula `D(n) = n! * Σ ((-1)^k / k!)` summed from `k = 0` to `n`. Or use the recurrence relation:\n`D(n) = (n - 1) * (D(n - 1) + D(n - 2))`.',
      step2: 'Set up base cases: `D(1) = 0`, `D(2) = 1`. Use the recurrence to build up: `D(3) = 2 * (1 + 0) = 2`, `D(4) = 3 * (2 + 1) = 9`,\n`D(5) = 4 * (9 + 2) = 44`.',
      step3: 'Understand probability connection: The probability that a random permutation is a derangement converges to `1/e ≈ 0.3678` very quickly for\n`n ≥ 4`.',
      answer: 'Number of derangements for `n=4` is `9`, and for `n=5` is `44`.',
      shortcut: 'For any `n`, the number of derangements `D(n)` is the nearest integer to:\n`n! / e`.'
    },
    {
      title: 'Committee Selection',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate selection combinations when picking teams under gender or role-based constraints.',
      step1: 'Understand the problem: A committee of 5 people must be chosen from a group of 6 men and 4 women. The committee must contain at least 3 women. How many combinations exist?',
      step2: 'Identify the cases: Case 1: Exactly 3 women and 2 men. Case 2: Exactly 4 women and 1 man. Case 3: Exactly 5 women (not possible since there are only 4 women total).',
      step3: 'Calculate combinations for each case. Case 1: `4C3 * 6C2 = 4 * 15 = 60`. Case 2: `4C4 * 6C1 = 1 * 6 = 6`. Sum the cases:\n`60 + 6 = 66`.',
      answer: 'The number of valid committee combinations is `66`.',
      shortcut: 'Complement alternative: If you had many cases, calculate the total combinations `10C5 = 252` and subtract invalid cases (0, 1, or 2 women).'
    },
    {
      title: 'Arrangement Restrictions',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate arrangements of items where certain objects must sit together or must not sit next to each other.',
      step1: 'Understand the problem: Arrange 5 boys and 3 girls in a row such that no two girls sit next to each other.',
      step2: 'Use the **Gap Method**. Arrange the unrestricted items (5 boys) first: `5! = 120` ways. This creates gaps before, between, and after the boys.',
      step3: 'Count the gaps: 5 boys create 6 gaps (`_ B _ B _ B _ B _ B _`). Choose 3 gaps for the 3 girls: `6C3 = 20` ways. Arrange the girls in those gaps: `3! = 6` ways. Calculate total:\n`120 * 20 * 6 = 14,400`.',
      answer: 'Total arrangements with no girls adjacent is `14,400`.',
      shortcut: 'Tie Method: If items *must* sit together, tie them into a single block, arrange the block with the rest of the items, then multiply by the internal arrangements of the tied block.'
    },
    {
      title: 'Common Interview Counting Tricks',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'Utilize combinatorial short-cuts such as the tie method, gap method, and grid projection during coding interviews.',
      explanation: [
        'Operational rules: Tie Method groups items that must remain adjacent as one "super item". Arrange the set, then multiply by the internal arrangements.',
        'Gap Method: Whenever items must remain separated, arrange the other items first, then place the restricted items in the gaps.',
        'Grid mapping: Transform paths on grids to binary strings of moves (e.g. Right/Down), converting path searches to combinations.'
      ],
      intuition: [
        'If the interviewer says "Arrange 6 books such that book A is not next to book B", do not calculate all separations. Calculate total arrangements (`6! = 720`) and subtract the case where they are tied together (`2 * 5! = 240`), yielding `480`.'
      ],
      takeaways: [
        'Tie method: group adjacent items into one.',
        'Gap method: place separated items in gaps between unrestricted items.',
        'Saves time by subtracting adjacent cases from the total.'
      ]
    }
  ],
  'Counting Techniques': [
    {
      title: 'Counting Without Enumeration',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Counting without enumeration uses mathematical structures to find the size of large sets without listing their elements.',
      explanation: [
        'Implicit sizes: Bypasses manual lists, which are prone to errors on large scales.',
        'Uses algebraic formulas (like sums of sequences or binomial coefficients) to compute set size.',
        'Requires mapping the objects to a known counted structure (e.g. binary sequences).'
      ],
      intuition: [
        'If you want to count the number of subsets of a set of size 10, do not list them. Know that each element has 2 choices (in or out), yielding `2^10 = 1024` subsets instantly.'
      ],
      takeaways: [
        'Avoid manual listing for large sets.',
        'Map configurations to binary state choices.',
        'Use combinatorial coefficients for calculations.'
      ]
    },
    {
      title: 'Inclusion Exclusion Principle',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Inclusion-Exclusion Principle (PIE)** calculates the size of the union of multiple overlapping sets by adjusting for intersections.',
      explanation: [
        'Set overlapping adjustments: For two sets:\n`|A ∪ B| = |A| + |B| - |A ∩ B|`.',
        'For three sets:\n`|A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |B ∩ C| - |A ∩ C| + |A ∩ B ∩ C|`.',
        'Alternates signs: Include single sets, exclude pairwise intersections, include triple intersections, and so on.'
      ],
      intuition: [
        'If you count numbers divisible by 2 (50) and divisible by 3 (33) up to 100, adding them counts numbers divisible by 6 (16) twice. Subtracting the intersection gives\n`50 + 33 - 16 = 67`.'
      ],
      takeaways: [
        'PIE adjusts for double counting in overlapping sets.',
        'Alternates addition and subtraction for intersections.',
        'Essential for counting numbers with multiple properties.'
      ]
    },
    {
      title: 'Stars and Bars',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Calculate the number of ways to distribute `n` identical objects into `k` distinct bins.',
      step1: 'Identify the objects as stars (`*`) and the dividers between bins as bars (`|`). To partition into `k` bins, we need `k - 1` bars.',
      step2: 'The total slots to arrange stars and bars is `n + k - 1`. Choose `k - 1` slots to place the bars: `(n + k - 1) choose (k - 1)`. This allows empty bins.',
      step3: 'If bins must be non-empty (at least 1 object per bin), distribute 1 object to each bin beforehand, leaving `n - k` objects. The formula becomes\n`(n - 1) choose (k - 1)`.',
      answer: 'Number of ways to distribute 10 identical apples to 3 children: `(10 + 3 - 1)C(3 - 1) = 12C2 = 66` ways (allowing empty allocations).',
      shortcut: 'Bins can be empty: `(n+k-1)C(k-1)`. Bins must have at least 1:\n`(n-1)C(k-1)`.'
    },
    {
      title: 'Complement Counting',
      difficulty: 'Easy',
      type: 'theory',
      intro: '**Complement Counting** calculates the size of a target set by subtracting the size of its complement from the total universal set.',
      explanation: [
        'Subtraction models: Formula is `|A| = |Universe| - |A\'|`. Useful when the complement `A\'` has fewer cases or is easier to define.',
        'Prevents breaking the target condition into many complex sub-cases.',
        'Commonly used with keywords like "at least", "at most", or "contains no".'
      ],
      intuition: [
        'If you want to count 4-digit numbers that contain at least one digit 7, do not count numbers with 1, 2, 3, or 4 sevens. Subtract the count of numbers with *no* sevens (`8 * 9 * 9 * 9 = 5832`) from total 4-digit numbers (`9000`), yielding `3168`.'
      ],
      takeaways: [
        'Formula:\n`|A| = |Total| - |Complement|`.',
        'Simplifies "at least" counting constraints.',
        'Reduces calculations by targeting the opposite state.'
      ]
    },
    {
      title: 'Bijection Thinking',
      difficulty: 'Hard',
      type: 'theory',
      intro: '**Bijection Thinking** counts a set by establishing a one-to-one mapping to another set that is easier to count.',
      explanation: [
        'Isomorphic mappings: Bijection is a mapping where every element in set `X` matches exactly one element in set `Y`, meaning\n`|X| = |Y|`.',
        'Transforms hard-to-visualize problems into standard counting setups (e.g. paths on a grid matching strings of characters).',
        'Useful for proving identities or proving that two different-looking problems are mathematically identical.'
      ],
      intuition: [
        'Think of the "handshakes at a party" problem. Instead of summing connections, notice a bijection: every handshake corresponds to a unique choice of 2 people. Counting handshakes is simply choosing `N` choose 2.'
      ],
      takeaways: [
        'Map complex sets to simple sets via one-to-one correspondence.',
        'Proves equality of size: if bijection exists,\n`|X| = |Y|`.',
        'Standard technique for advanced interview puzzles.'
      ]
    },
    {
      title: 'Double Counting',
      difficulty: 'Hard',
      type: 'theory',
      intro: '**Double Counting** is a proof and counting technique that calculates the size of a set in two different ways to establish an algebraic identity.',
      explanation: [
        'Dual angles: By counting the elements of a set or relationships in a bipartite graph from two different perspectives, the two resulting formulas must be equal.',
        'Useful for proving combinatorial identities without algebraic expansion.',
        'Helps find averages or verify structural constraints in networks.'
      ],
      intuition: [
        'In a grid of people, summing the row counts must equal summing the column counts. If you count the total edges in a graph by summing degrees, you get `2 * Edges` because every edge has two endpoints. This is double counting.'
      ],
      takeaways: [
        'Count from two perspectives (e.g. rows vs columns).',
        'Establishes identities:\n`Result A = Result B`.',
        'Prevents missing elements in complex matrices.'
      ]
    },
    {
      title: 'Pigeonhole Principle',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Pigeonhole Principle (PHP)** states that if `n` items are put into `m` containers and `n > m`, at least one container must hold more than one item.',
      explanation: [
        'Collision proofs: Generalized PHP states that if `n` items are put into `m` containers, at least one container must contain at least `ceil(n/m)` items.',
        'Non-constructive: It proves an item exists with a certain property without telling you which one it is or how to find it.',
        'Used to guarantee worst-case thresholds in data structures, hashing collisions, and logical puzzles.'
      ],
      intuition: [
        'In a room of 367 people, at least two people must share a birthday because there are only 366 possible birth dates. The birth dates are the pigeonholes, the people are the pigeons.'
      ],
      takeaways: [
        'If pigeons > holes, at least one hole has multiple pigeons.',
        'Generalized form: at least one hole contains `ceil(n/m)` items.',
        'Used to guarantee collisions or matching properties.'
      ]
    },
    {
      title: 'Counting Paths',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate the number of paths between two points on a grid, moving only in restricted directions (e.g. right and up).',
      step1: 'Identify the grid dimensions. To move from `(0,0)` to `(X,Y)`, you must take exactly `X` right steps (`R`) and `Y` up steps (`U`).',
      step2: 'The total number of steps is `X + Y`. Any path is a sequence of `X` R\'s and `Y` U\'s.',
      step3: 'Calculate the arrangements of these steps (selection of slots for R): `(X + Y) choose X` or\n`(X + Y) choose Y`.',
      answer: 'The number of paths from `(0,0)` to `(4,3)` is `(4 + 3) choose 4 = 7C4 = 35` paths.',
      shortcut: 'If you must pass through an intermediate point `(A,B)`, the total paths is:\n`[Paths(0,0 ➔ A,B)] * [Paths(A,B ➔ X,Y)]`.'
    },
    {
      title: 'Counting Grids',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate the total number of rectangles or squares contained within a grid of size `M x N`.',
      step1: 'Identify the grid lines: An `M x N` grid of squares has `M + 1` horizontal lines and `N + 1` vertical lines.',
      step2: 'To form any rectangle, you must choose 2 horizontal lines and 2 vertical lines.',
      step3: 'Calculate the combinations of choosing these lines: `(M + 1) choose 2` times\n`(N + 1) choose 2`.',
      answer: 'A standard `8x8` chessboard contains `9C2 * 9C2 = 36 * 36 = 1296` rectangles.',
      shortcut: 'To find only *squares* in an `N x N` grid, sum the squares of the dimensions: `Σ k^2` from `k = 1` to `N` (for 8x8 chessboard, this is `1^2 + 2^2 + ... + 8^2 = 204` squares).'
    },
    {
      title: 'Counting Probability Outcomes',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Counting probability outcomes scales combinatorics to calculate probability numerator and denominator terms.',
      explanation: [
        'Scaling events: Combines combinations with multiplication rules. The probability of getting a specific hand in Poker is:\n`Favorable Hands / Total Hands`.',
        'Denominator: Total possible outcomes (e.g. choosing 5 cards from 52 is `52C5 = 2,598,960`).',
        'Numerator: Favorable ways to choose the target pattern (e.g. Full House: choose card rank for triplet, choose 3 cards of that rank, choose rank for pair, choose 2 cards of that rank).'
      ],
      intuition: [
        'Break down the selection into sequential stages. For a Full House: select triplet rank (`13C1`), select 3 suits (`4C3`), select pair rank (`12C1`), select 2 suits (`4C2`). Multiply all terms to get the numerator.'
      ],
      takeaways: [
        'Calculate total sample space as the denominator.',
        'Break down numerator selection into sequential combinatorics.',
        'Verify that no cards are counted in multiple roles.'
      ]
    }
  ],
  'Game Theory': [
    {
      title: 'Optimal Play Concept',
      difficulty: 'Easy',
      type: 'theory',
      intro: '**Optimal Play** is a strategy in game theory where a player selects moves that guarantee the best possible outcome regardless of the opponent\'s choices.',
      explanation: [
        'Rational choices: Assumes both players are rational and seek to maximize their payoffs.',
        'In zero-sum games, one player\'s gain is the other\'s loss. Optimal play matches the Nash Equilibrium where neither player wants to change strategy.',
        'Often solved using backward induction: working backward from the end states of the game.'
      ],
      intuition: [
        'If you play a game where you can take 1 or 2 coins, and the person who takes the last coin wins, if there are 3 coins left, your optimal move is to take 2 because it leaves the opponent with 1 coin (forcing their loss).'
      ],
      takeaways: [
        'Optimal play assumes perfect opponent rationality.',
        'Matches the Nash Equilibrium in zero-sum games.',
        'Solved by working backward from end-game states.'
      ]
    },
    {
      title: 'Winning and Losing States',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A state in a game is a **Winning State** (P-position) or a **Losing State** (N-position) based on who can force a win from that position.',
      explanation: [
        'State classifications: Losing State (L) is a position where every valid move leads to a winning state for the opponent.',
        'Winning State (W): A position from which there exists at least one valid move leading to a losing state for the opponent.',
        'Terminal states (where no moves are left) are classified as losing states under normal play rules (the player who cannot move loses).'
      ],
      intuition: [
        'To solve coin/matchstick games, start at state 0 (Losing state because you cannot move). State 1 is a Winning state (move to 0). State 2 is a Winning state (move to 0). State 3 is a Losing state because all moves (taking 1 or 2) lead to Winning states (2 or 1).'
      ],
      takeaways: [
        'Losing state: All moves lead to winning states.',
        'Winning state: At least one move leads to a losing state.',
        'Analyze states from the terminal state 0 backwards.'
      ]
    },
    {
      title: 'Single Pile Nim',
      difficulty: 'Easy',
      type: 'numerical',
      intro: 'Calculate winning moves and states for a game with a single pile of items where you can remove a restricted number of items.',
      step1: 'Identify game rules: A pile has `N` items. You can remove between 1 and `M` items per turn. The player who cannot move loses.',
      step2: 'Map the losing states. If `N` is a multiple of `M + 1`, it is a losing state (P-position). If it is not, it is a winning state (N-position).',
      step3: 'Determine strategy: If you are at a winning state (not a multiple of `M + 1`), remove `N mod (M + 1)` items to force the pile size to a multiple of `M + 1` (a losing state for the opponent).',
      answer: 'For `N = 10` and `M = 3`, the losing states are multiples of 4: `{0, 4, 8}`. Since 10 is not a multiple, it is a winning state; your optimal move is to take `10 mod 4 = 2` items.',
      shortcut: 'Always reduce the pile size to the nearest multiple of `M + 1` on your turn.'
    },
    {
      title: 'Multi Pile Nim',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Determine if a multi-pile Nim game is a winning or losing state, and find the optimal move using the Nim Sum.',
      step1: 'Identify pile sizes: e.g. three piles of size `3, 4, 5`. Convert these sizes to binary: `3 = 011_2`, `4 = 100_2`,\n`5 = 101_2`.',
      step2: 'Calculate the **Nim Sum** (XOR sum of pile sizes): `011 XOR 100 XOR 101 = 010_2 = 2`. Since the Nim Sum is not zero, this is a winning state.',
      step3: 'Find the optimal move to reduce the Nim Sum to zero. Find a pile where `Pile XOR NimSum < Pile`. Pile 3 (`3 XOR 2 = 1 < 3`), or Pile 5 (`5 XOR 2 = 7 > 5`), or Pile 4 (`4 XOR 2 = 6 > 4`). Reduce Pile 1 (size 3) to 1 (remove 2 items). New sizes: `1, 4, 5`.',
      answer: 'Optimal move: Remove 2 items from the pile of size 3. New sizes `1, 4, 5` have Nim Sum `001 XOR 100 XOR 101 = 0` (losing state for opponent).',
      shortcut: 'If the XOR sum is non-zero, you can always make a single move to set the XOR sum to zero, securing your win.'
    },
    {
      title: 'Coin Removal Games',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Solve games where players take turns removing coins from a line under adjacency constraints.',
      step1: 'Identify the rules: There are `N` coins in a line. A player can remove any 1 coin or any 2 adjacent coins. The player who takes the last coin wins.',
      step2: 'Use **Symmetry Strategy**. If the opponent removes coins, mirror their actions relative to the center of the board.',
      step3: 'Set up the win: In round 1, if `N` is even, remove the 2 central coins (splitting the line into two equal segments of size `(N-2)/2`). If `N` is odd, remove the 1 central coin. Now, whatever the opponent does to one side, mirror it on the other side.',
      answer: 'Player 1 wins by taking the central coin(s) in the first turn and mirroring the opponent\'s moves thereafter.',
      shortcut: 'Symmetry guarantees that if you copy the opponent\'s moves on an identical independent half of the game, you will always get the final move.'
    },
    {
      title: 'Matchstick Games',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Solve matchstick removal puzzles, finding the winning strategy for the first player.',
      step1: 'Identify the rules: There are 21 matchsticks. You can remove 1, 2, 3, or 4 matchsticks per turn. The player who takes the last matchstick loses (Misere play).',
      step2: 'Work backward from the end. You want to force the opponent to take the last matchstick, which means you want to leave them with exactly 1 matchstick (losing state).',
      step3: 'Establish target sizes: To leave 1, you want to leave `1`, `6`, `11`, `16` matchsticks on your turns (intervals of `M + 1 = 5`).',
      answer: 'If the game starts with 21: since `21 = 5*4 + 1`, the starting state is a losing state if you go first. If the opponent goes first, whatever they take `k`, you take `5 - k` to force the count to 16, 11, 6, and finally 1.',
      shortcut: 'Complimentary taking: If the step size constraint is `M`, group turns into units of `M + 1` items.'
    },
    {
      title: 'Backward Induction',
      difficulty: 'Hard',
      type: 'theory',
      intro: '**Backward Induction** is a reasoning process that works backward from the end of a decision tree to determine optimal sequential choices.',
      explanation: [
        'Retrograde reasoning: Starts at terminal nodes (the final moves of the game) where outcomes are known.',
        'Determines what the last player would do, then moves up one level to determine what the second-to-last player would do, assuming rational play.',
        'Prunes suboptimal branches, resolving subgame perfect equilibria.'
      ],
      intuition: [
        'In the "100 Pirates" coin splitting game, look at what happens if only 2 pirates remain. Pirate 2 will take everything and vote yes. Knowing this, work backward to see what offers Pirate 3, 4, and 5 must make to secure votes.'
      ],
      takeaways: [
        'Work backward from final terminal states.',
        'Assumes perfect future rationality of all players.',
        'Essential for solving finite sequential games.'
      ]
    },
    {
      title: 'Minimax Thinking',
      difficulty: 'Hard',
      type: 'theory',
      intro: '**Minimax** is a decision rule that minimizes the maximum possible loss, commonly used in zero-sum two-player games.',
      explanation: [
        'Adversarial evaluations: Max Player seeks to maximize their payoff. Min Player seeks to minimize the Max player\'s payoff.',
        'Minimax value: The optimal score reached when both players play perfectly. Max chooses the move that yields the maximum of the minimums.',
        'Implemented in game AI (like chess engines) using alpha-beta pruning to speed up node searches.'
      ],
      intuition: [
        'When looking at your choices, assume that whatever move you make, the opponent will make the worst possible reply for you. Thus, choose the move whose worst-case reply is the most tolerable.'
      ],
      takeaways: [
        'Minimize your maximum possible loss.',
        'Assumes opponent always makes their best move.',
        'Forms the basis of zero-sum game algorithms.'
      ]
    },
    {
      title: 'Game Theory Interview Patterns',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'Identify game theory patterns in interviews, such as symmetry, modular invariants, and subtraction sets.',
      explanation: [
        'Interviewer strategies: Symmetry splits the game board into identical mirrored halves, allowing the second player to win by duplicating moves.',
        'Modular invariants: Winning states tied to `N mod (M + 1)`. The player forces this remainder to zero at each step.',
        'SG (Sprague-Grundy) Theorem: Assigning Grundy values (mex of next states) to states, converting any impartial game into an equivalent pile of Nim.'
      ],
      intuition: [
        'If a game involves removing items, check if the moves allow you to maintain a modular invariant. If they do, your strategy is to keep the state at `0 mod k`.'
      ],
      takeaways: [
        'Look for board symmetries to copy opponent moves.',
        'Modular invariants resolve taking games.',
        'Sprague-Grundy theorem converts impartial games to Nim.'
      ]
    }
  ],
  'Logical Puzzles': [
    {
      title: 'Monty Hall Problem',
      difficulty: 'Medium',
      type: 'puzzle',
      intro: 'A classic game show puzzle: You choose one of three doors. Behind one is a car, and behind the others are goats. The host opens a goat door and asks if you want to switch. Should you?',
      step1: 'Identify prior probabilities: The probability that your initial choice has the car is `1/3`. The probability that the car is behind one of the other two doors is:\n`2/3`.',
      step2: 'Analyze the host\'s action: The host *must* open a door containing a goat. This action is not random; it is dependent on your initial choice and the location of the car.',
      step3: 'Evaluate switching: The host\'s action concentrates the entire `2/3` probability of the other two doors into the single remaining unopened door. The probability of your initial door remains\n`1/3`.',
      answer: 'You should switch. Switching gives you a `2/3` probability of winning the car, while keeping your initial door gives only\n`1/3`.',
      shortcut: 'If you switch, you only lose if your initial choice was correct (which happens `1/3` of the time). So switching wins `2/3` of the time.'
    },
    {
      title: '100 Prisoners Problem',
      difficulty: 'Hard',
      type: 'puzzle',
      intro: '100 prisoners must find their own numbers in 100 closed boxes. Each can open 50 boxes. If one fails, all die. Find the optimal strategy.',
      step1: 'Identify the problem: If prisoners choose randomly, the probability of survival is `(1/2)^100 ≈ 0` (effectively zero).',
      step2: 'Define the **Loop Strategy**: Every prisoner starts by opening the box labeled with their own number. If they find their number, they succeed. If not, the box contains another number `K`; they proceed to open box `K`, and repeat this cycle.',
      step3: 'Analyze the cycles: This strategy links boxes into closed loops. A prisoner succeeds if their number is in a loop of size ≤ 50. Since all prisoners in a loop share the same loop size, the entire team succeeds if the longest loop in the box arrangement is ≤ 50.',
      answer: 'Using the loop strategy, the probability that the longest loop is ≤ 50 is `1 - ln(2) ≈ 31.18%`. This increases survival rate from near-zero to 31.18%.',
      shortcut: 'Sum of loop sizes: The probability of a random permutation having no cycle of length > 50 is `1 - Σ (1/k)` from `k = 51` to:\n`100 ≈ 31.18%`.'
    },
    {
      title: 'Blue Eyes Puzzle',
      difficulty: 'Hard',
      type: 'puzzle',
      intro: 'A group of people with blue eyes and brown eyes live on an island. If they discover they have blue eyes, they must leave at midnight. A visitor announces: "At least one of you has blue eyes." If there are N blue-eyed people, what happens?',
      step1: 'Apply mathematical induction. Case `N = 1`: The single blue-eyed person looks around, sees no one else with blue eyes, realizes they must be the one, and leaves on night 1.',
      step2: 'Case `N = 2`: Person A and B have blue eyes. On day 1, A sees B has blue eyes and expects B to leave on night 1. But B does not leave (because B sees A). On day 2, A realizes B didn\'t leave because B saw someone else with blue eyes. Since B only sees A, A realizes they have blue eyes. Both A and B leave on night 2.',
      step3: 'Generalize: If there are `N` blue-eyed people, nothing happens for `N - 1` days. On the `N-th` day, all `N` blue-eyed people realize their color and leave together at midnight.',
      answer: 'All `N` blue-eyed people leave on the `N-th` night after the announcement.',
      shortcut: 'Common knowledge creation: The announcement made the existence of blue eyes common knowledge, allowing the synchronization of days as indicators of eye counts.'
    },
    {
      title: 'Poisoned Bottle Puzzle',
      difficulty: 'Hard',
      type: 'puzzle',
      intro: 'You have 1000 bottles of wine, and exactly one is poisoned. A poisoned bottle kills a rat in 24 hours. What is the minimum number of rats needed to find the poisoned bottle in 24 hours?',
      step1: 'Identify the binary nature of test results: A rat either dies (1) or lives (0). Thus, `R` rats can represent `2^R` unique states.',
      step2: 'Map states to bottles: We need `2^R ≥ 1000` to uniquely identify each bottle. The smallest integer is `R = 10` (since `2^10 = 1024`).',
      step3: 'Design the testing matrix: Number the bottles 1 to 1000 in binary (10 digits). Rat `i` drinks from all bottles that have a `1` in the `i-th` digit of their binary code. After 24 hours, if rat `i` dies, write a `1` in the `i-th` digit of the secret code; else write `0`.',
      answer: 'The minimum number of rats needed is `10`. The binary code of the dead rats points directly to the poisoned bottle.',
      shortcut: 'Binary search projection: Every rat acts as a bit in the binary representation of the target bottle number.'
    },
    {
      title: 'Bridge and Torch Puzzle',
      difficulty: 'Medium',
      type: 'puzzle',
      intro: 'Four people must cross a bridge at night. A max of two can cross at a time, carrying a torch. Crossing times are: A (1 min), B (2 min), C (5 min), D (10 min). What is the minimum time needed for all to cross?',
      step1: 'Avoid the greedy choice trap: Crossing the two fastest (A + B = 2 min) and returning the fastest (A = 1 min) to bring the slow ones (C + D) back results in `2 + 1 + 10 + 1 + 2 = 16` min. We can do better.',
      step2: 'Group the slow crossers: We want C and D to cross together so their crossing times overlap: `C + D = 10` min. But we need a fast person already on the other side to bring the torch back.',
      step3: 'Design optimal steps: Step 1: A and B cross (2 min). Step 2: A returns with torch (1 min). Step 3: C and D cross (10 min). Step 4: B returns with torch (2 min). Step 5: A and B cross (2 min). Sum: `2 + 1 + 10 + 2 + 2 = 17` min.',
      answer: 'The minimum time needed for all four to cross the bridge is `17` minutes.',
      shortcut: 'Slower overlap rule: To send two slow items `S1` and `S2` together, use two fast items `F1` and `F2` to manage the torch returns.'
    },
    {
      title: 'Hat Color Puzzle',
      difficulty: 'Hard',
      type: 'puzzle',
      intro: 'Three players stand in a circle with a red or blue hat. They see others\' hats but not their own. They must simultaneously guess or pass. Team wins if at least one guesses right and no one guesses wrong. What is the optimal strategy?',
      step1: 'Identify target: We want to maximize the probability of winning. If they guess randomly, win rate is low. We want to coordinate guesses.',
      step2: 'Look for asymmetry: If a player sees two hats of the *same* color, they guess the *opposite* color. If they see different colors, they pass.',
      step3: 'Analyze outcomes: Case 1: Hats are all same color (RRR, BBB), happens `2/8` of the time. Everyone sees same colors and guesses opposite, so all three guess wrong (Loss). Case 2: Hats are mixed (e.g. RRB), happens `6/8` of the time. The player with B sees two R\'s and guesses B (correct!). The two players with R see R and B, so they pass. Team wins!',
      answer: 'Optimal strategy: Guess the opposite color if you see two identical hat colors, else pass. This yields a `6/8 = 75%` win rate.',
      shortcut: 'Hamming code geometry: The strategy partitions the 8 states into 2 losing centers and 6 winning neighbors.'
    },
    {
      title: 'Two Doors Puzzle',
      difficulty: 'Easy',
      type: 'puzzle',
      intro: 'You stand before two doors. One leads to freedom, the other to execution. Guarding the doors are twin guards: one tells the truth, the other lies. You can ask only one question to one guard. What question do you ask?',
      step1: 'Understand the goal: We want to ask a question that yields the same answer regardless of whether we ask the truth-teller or the liar.',
      step2: 'Combine the operations: A truth (T) combined with a lie (L) always results in a lie (`T * L = L`). We must ask about the other guard\'s answer.',
      step3: 'Formulate the question: Ask guard 1: "Which door would your twin say leads to freedom?"',
      answer: 'Whichever door they point to, choose the **other** door. The truth-teller will tell you the liar\'s lie (pointing to the bad door); the liar will lie about the truth-teller\'s truth (pointing to the bad door). Both point to the bad door.',
      shortcut: 'Double operation negation: Asking guard A what guard B would say always applies a negation step, guaranteeing a false answer.'
    },
    {
      title: 'Truth Teller and Liar',
      difficulty: 'Medium',
      type: 'puzzle',
      intro: 'Solve puzzles where characters represent truth-tellers, liars, or random answerers, using logical deduction.',
      step1: 'Identify statements: You meet three people, A, B, and C. One is a truth-teller, one is a liar, and one answers randomly. A says: "B is the liar." B says: "C is the liar."',
      step2: 'Map logical consistency: If A is the truth-teller, then B is indeed the liar. If B is the liar, then C is not the liar (C is the random one). This state is consistent.',
      step3: 'Verify other cases: If B is the truth-teller, A must be the liar. If A is the liar, A\'s statement is false, meaning B is not the liar (consistent). C is the random one.',
      answer: 'Deduce identity by tracking contradiction loops. A truth-teller\'s statement must match reality; a liar\'s must negate it.',
      shortcut: 'Look for claims of "I am a liar". A truth-teller cannot say this (contradiction), and a liar cannot say this (contradiction). Thus, only a random answerer can claim to be a liar.'
    },
    {
      title: 'River Crossing Puzzle',
      difficulty: 'Easy',
      type: 'puzzle',
      intro: 'A farmer must cross a river with a wolf, a goat, and a cabbage. His boat can hold only him and one other item. wolf eats goat, or goat eats cabbage if left unattended. How does he cross?',
      step1: 'Identify the constraint: The farmer must keep goat-wolf and goat-cabbage separated. The goat is the common link; it must be moved first.',
      step2: 'Step 1: Take goat across. Return alone. Step 2: Take wolf across. Return with goat (to prevent wolf eating goat).',
      step3: 'Step 3: Leave goat, take cabbage across. Return alone. Step 4: Take goat across.',
      answer: 'Move goat ➔ Return empty ➔ Move wolf ➔ Return goat ➔ Move cabbage ➔ Return empty ➔ Move goat.',
      shortcut: 'Never leave the goat with either the wolf or the cabbage. Use the goat as a return weight to break conflicts.'
    },
    {
      title: 'Logical Deduction Framework',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Systematize puzzle-solving in interviews by mapping constraints, assumptions, and contradiction states.',
      explanation: [
        'Reasoning platforms: Constraint mapping writes down the rules of the system as logical formulas.',
        'Assumption testing: Assume a node state (e.g. "A is the liar") and propagate results. If a contradiction occurs, the assumption is false.',
        'Symmetry reduction: Reduce the number of cases by grouping symmetric configurations.'
      ],
      intuition: [
        'Interviewers assess your *thinking process*. Do not guess. State your assumptions, trace their implications step-by-step, and explain how you eliminate invalid branches.'
      ],
      takeaways: [
        'Write out constraints explicitly.',
        'Use proof by contradiction for assumptions.',
        'Group symmetric options to save time.'
      ]
    }
  ],
  'Statistics': [
    {
      title: 'Mean',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Mean** (arithmetic average) is the sum of a set of values divided by the number of values.',
      explanation: [
        'Formula distributions: Formula is `μ = (Σ x_i) / N` for a population, and `x̄ = (Σ x_i) / n` for a sample.',
        'Highly sensitive to outliers. A single extreme value can shift the mean significantly, misrepresenting the center of the distribution.',
        'Represents the physical center of mass of the data distribution.'
      ],
      intuition: [
        'If 9 people earn $50,000 and 1 person earns $1,000,000, the mean salary is `$145,000`. This average does not represent what most people earn due to the outlier.'
      ],
      takeaways: [
        'Mean = Sum / Count.',
        'Highly sensitive to outlier values.',
        'Matches the expected value of a uniform sample.'
      ]
    },
    {
      title: 'Median',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Median** is the middle value of a data set sorted in ascending or descending order.',
      explanation: [
        'Sorted center: If the number of data points `N` is odd, the median is the value at position `(N + 1) / 2`. If `N` is even, it is the average of values at `N/2` and\n`N/2 + 1`.',
        'Outlier resistant: Extreme values at the ends of the sorted list do not affect the median.',
        'Splits the data distribution into two equal halves (50th percentile).'
      ],
      intuition: [
        'Using the salary example: sorted salaries has $50k at the center. The median is `$50,000`, which represents the typical salary of the group much better than the mean of `$145,000`.'
      ],
      takeaways: [
        'Median is the sorted middle value.',
        'Outlier resistant (robust metric).',
        'Splits the distribution into two 50% halves.'
      ]
    },
    {
      title: 'Mode',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Mode** is the value that appears most frequently in a data set.',
      explanation: [
        'Frequency distributions: A data set can have one mode (unimodal), multiple modes (bimodal/multimodal), or no mode at all if all values are unique.',
        'Only central tendency metric that can be used for categorical data (e.g. favorite color).',
        'Represents the highest peak of the probability density function.'
      ],
      intuition: [
        'In a clothing store, the mode is the most popular shoe size sold. Knowing the average shoe size is 8.2 is useless; knowing the mode is size 8 helps manage stock.'
      ],
      takeaways: [
        'Mode is the most frequent data value.',
        'Applicable to categorical data.',
        'Points to peaks in probability distributions.'
      ]
    },
    {
      title: 'Weighted Mean',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Weighted Mean** is an average where some data points contribute more to the final average than others.',
      explanation: [
        'Subgroup averages: Formula is `x̄_w = (Σ w_i * x_i) / (Σ w_i)`, where `w_i` is the weight of value `x_i`.',
        'Essential when averaging subgroups of different sizes or combining items with different priorities (e.g. GPA calculations).',
        'Matches expected value where weights act as probability densities.'
      ],
      intuition: [
        'If you score 90% on a test worth 20% of your grade and 70% on a final exam worth 80%, your average is not 80%. It is:\n`(0.2 * 90) + (0.8 * 70) = 18 + 56 = 74%`.'
      ],
      takeaways: [
        'Weighted Mean = Sum of value-weight products / Sum of weights.',
        'Accounts for size/priority differences in data.',
        'Analytically equivalent to Expected Value calculations.'
      ]
    },
    {
      title: 'Variance',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Variance** (denoted by `σ^2` or `s^2`) measures the dispersion of data points around their mean.',
      explanation: [
        'Deviation calculations: Formula is `σ^2 = Σ (x_i - μ)^2 / N` (population) or `s^2 = Σ (x_i - x̄)^2 / (n - 1)` (sample, using Bessel\'s correction).',
        'Calculates the average of the squared deviations. Squaring ensures negative and positive differences do not cancel out and penalizes larger deviations.',
        'Units of variance are squared (e.g. dollars squared), making physical interpretation difficult.'
      ],
      intuition: [
        'A low variance means data points sit tight around the mean (high predictability). A high variance means data points are spread out (high uncertainty or risk).'
      ],
      takeaways: [
        'Variance measures data spread around the mean.',
        'Sample denominator is `n - 1` (Bessel\'s correction for bias).',
        'Units are squared, making standard deviation preferred for scaling.'
      ]
    },
    {
      title: 'Standard Deviation',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Standard Deviation** (denoted by `σ` or `s`) is the square root of the variance, expressing dispersion in the original units of the data.',
      explanation: [
        'Standard distributions: Formula is `σ = √σ^2`. Restores the scaling units of dispersion to match the mean.',
        'Empirical Rule: In a normal distribution, `~68%` of data falls within 1 standard deviation, `~95%` within 2, and `~99.7%` within 3.',
        'Forms the basis of Z-score normalization:\n`Z = (x - μ) / σ`.'
      ],
      intuition: [
        'If the average height is 170 cm and the standard deviation is 10 cm, you know that 95% of people are between 150 cm and 190 cm tall (`170 ± 2*10`).'
      ],
      takeaways: [
        'Standard Deviation = Square root of variance.',
        'Expressed in the original data units.',
        'Governs the Empirical Rule bounds in normal distributions.'
      ]
    },
    {
      title: 'Covariance',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Covariance** measures the direction of the linear relationship between two random variables.',
      explanation: [
        'Direction vectors: Formula is:\n`Cov(X, Y) = E[(X - E[X])(Y - E[Y])] = E[XY] - E[X]E[Y]`.',
        'Direction indicator: Positive covariance means `X` and `Y` tend to increase together; negative covariance means one increases as the other decreases.',
        'Scale dependent: The magnitude of covariance depends on the units of the variables, making it hard to compare across different datasets.'
      ],
      intuition: [
        'If you study more, your grades increase (Positive Covariance). If you spend more time playing games, your study time decreases (Negative Covariance).'
      ],
      takeaways: [
        'Formula:\n`Cov(X,Y) = E[XY] - E[X]E[Y]`.',
        'Indicates the direction of linear relationships.',
        'Scale dependent (not standardized).'
      ]
    },
    {
      title: 'Correlation',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Correlation** (specifically Pearson\'s correlation coefficient `ρ`) is a standardized measure of the strength and direction of the linear relationship between two variables.',
      explanation: [
        'Normalized bounds: Formula is `ρ_XY = Cov(X, Y) / (σ_X * σ_Y)`. Dividing by the standard deviations standardizes the scale.',
        'Boundaries: Always ranges from `-1` (perfect negative linear correlation) to `+1` (perfect positive linear correlation). A value of `0` indicates no linear relationship.',
        'Only captures linear relationships. Variables can have a strong non-linear relationship (like a parabola) and still have `0` correlation.'
      ],
      intuition: [
        'Correlation normalizes covariance. It allows you to compare the relationship between temperature and ice cream sales (Celsius) with the relationship between marketing spend and revenue (Dollars).'
      ],
      takeaways: [
        'Standardized covariance: ranges from `-1` to:\n`+1`.',
        'Measures the strength of **linear** relationships only.',
        'Independent variables have `0` correlation.'
      ]
    },
    {
      title: 'Correlation vs Causation',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The classic rule: **Correlation does not imply causation**. A statistical association between variables does not prove one causes the other.',
      explanation: [
        'Statistical illusions: Spurious Correlation occurs when two variables correlate due to a hidden third variable (confounder) or pure coincidence.',
        'Confounder Example: Ice cream sales and drowning rates correlate. Ice cream does not cause drowning; both increase because of hot summer weather (the confounder).',
        'Establishing causation requires controlled experiments (A/B testing) to isolate the variable of interest.'
      ],
      intuition: [
        'In interviews, never claim that feature X *causes* user retention because they correlate. A hidden factor (like user interest or design) might drive both.'
      ],
      takeaways: [
        'Statistical correlation is not physical proof of cause.',
        'Look for hidden confounders (lurking variables).',
        'Causation requires experimental control (A/B tests).'
      ]
    },
    {
      title: 'Law of Large Numbers',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Law of Large Numbers (LLN)** states that the sample mean converges to the expected population mean as the sample size grows.',
      explanation: [
        'Convergence limits: Weak LLN states that the probability that the sample average differs from the expected value by more than a small margin approaches zero as sample size\n`n ➔ ∞`.',
        'Strong LLN: The sample average converges almost surely to the expected value.',
        'Underpins the stability of casinos and insurance firms: individual outcomes are unpredictable, but the collective average is guaranteed.'
      ],
      intuition: [
        'If you flip a fair coin 10 times, you might get 8 Heads (80%). If you flip it 10,000 times, the ratio of Heads will sit extremely close to 50%.'
      ],
      takeaways: [
        'Sample average converges to population mean as size increases.',
        'Guarantees long-term stability for statistical business models.',
        'Does not compensate for short-term streaks (Gambler\'s Fallacy).'
      ]
    },
    {
      title: 'Central Limit Theorem',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'The **Central Limit Theorem (CLT)** states that the distribution of the sum of i.i.d. variables converges to a normal distribution as sample size grows, regardless of the parent distribution.',
      explanation: [
        'Distribution bounds: Condition is that variables must be independent and identically distributed (i.e. i.i.d.) with finite variance.',
        'Convergence: The sample mean distribution approaches `N(μ, σ^2 / n)` as `n` increases (typically `n ≥ 30` is sufficient).',
        'Explains why normal distributions are so common in nature: they represent the sum of many independent small factors.'
      ],
      intuition: [
        'If you roll 100 dice and sum the values, the distribution of that sum will look like a normal curve (bell curve), even though a single die has a flat uniform distribution.'
      ],
      takeaways: [
        'Means of i.i.d. variables converge to a normal distribution.',
        'Applies regardless of the shape of the parent distribution.',
        'Requires finite variance and independent samples.'
      ]
    },
    {
      title: 'Statistical Intuition for Interviews',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Develop statistical intuition in interviews, focusing on sample size biases, regression to the mean, and metrics selection.',
      explanation: [
        'Analytical biases: Regression to the Mean states that extreme outcomes are usually followed by more moderate, average outcomes due to random fluctuations.',
        'Sample size bias: Small samples yield higher variance, producing extreme ratios more frequently than large samples.',
        'Metrics choice: Knowing when to report median (skewed data) vs mean (symmetrical data).'
      ],
      intuition: [
        'If an interviewer notes that "small hospitals report higher rates of 100% male births than large hospitals", do not look for biological reasons. It is a sample size effect: smaller sample sizes have higher variance and are more likely to reach extreme outcomes.'
      ],
      takeaways: [
        'Small sample sizes have higher variance (extremes).',
        'Extreme events naturally regress toward the mean next.',
        'Select median over mean for heavily skewed data.'
      ]
    }
  ],
  'Mental Math': [
    {
      title: 'Fast Percentage Calculations',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Calculate percentages rapidly in your head using splitting, scaling, and fraction conversions.',
      explanation: [
        'Symmetry rule: `x% of y` is exactly equal to `y% of x`. This is highly useful when one number is much simpler to calculate.',
        'Splitting method: Break down complex percentages into sums of standard benchmarks: `10%`, `5%`, `1%`, and `50%`.',
        'Example: To find 16% of 45, compute `10% of 45 = 4.5`, `5% = 2.25`, and `1% = 0.45`. Sum:\n`4.5 + 2.25 + 0.45 = 7.2`.'
      ],
      intuition: [
        'If you need to find 8% of 50 in your head, swap it to 50% of 8, which is instantly `4`.'
      ],
      takeaways: [
        'Symmetry:\n`x% of y = y% of x`.',
        'Split percentages into benchmarks (`10%`, `5%`, `1%`).',
        'Convert to fractions where possible (e.g. `25% = 1/4`).'
      ]
    },
    {
      title: 'Fast Fraction Conversions',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Memorize key fractions and their decimal conversions to speed up estimations during mental calculations.',
      explanation: [
        'Decimal sets: Seventh sets `1/7 ≈ 14.3%`, `2/7 ≈ 28.6%`, `3/7 ≈ 42.9%`. Notice the repeating pattern `142857`.',
        'Eighth sets: `1/8 = 12.5%`, `3/8 = 37.5%`, `5/8 = 62.5%`,\n`7/8 = 87.5%`.',
        'Eleventh sets: Multiples of 9: `1/11 ≈ 9.09%`, `2/11 ≈ 18.18%`,\n`3/11 ≈ 27.27%`.'
      ],
      intuition: [
        'Fractions act as shortcuts for division. Dividing a number by 8 is identical to halving it three times.'
      ],
      takeaways: [
        'Memorize benchmarks for denominators 7, 8, 9, and 11.',
        'Use decimal patterns to slide scale factors.',
        'Convert divisions to equivalent fraction multiplications.'
      ]
    },
    {
      title: 'Fast Square Calculations',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate squares of double-digit numbers rapidly using algebraic expansion.',
      step1: 'Identify the base formula for squaring: `(x + d)(x - d) + d^2 = x^2`. Choose `d` to round the number to the nearest multiple of 10.',
      step2: 'Example: To calculate `48^2`. Round 48 to 50 (`d = 2`). The formula yields:\n`(48 + 2)(48 - 2) + 2^2 = (50)(46) + 4`.',
      step3: 'Multiply the terms: `50 * 46 = 2300`. Add the remainder:\n`2300 + 4 = 2304`.',
      answer: '`48^2 = 2304`.',
      shortcut: 'Squaring numbers ending in 5: Multiply the first digit `N` by `N + 1` and append `25`. Example:\n`65^2 = (6*7) append 25 = 4225`.'
    },
    {
      title: 'Fast Cube Calculations',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Estimate or calculate cubes of two-digit numbers using binomial expansions.',
      step1: 'Identify the algebraic identity: `(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3`. Let the number be\n`10a + b`.',
      step2: 'Example: To compute `12^3`. Set `a = 10` and `b = 2`. The formula yields:\n`10^3 + 3(10^2)(2) + 3(10)(2^2) + 2^3`.',
      step3: 'Calculate terms:\n`1000 + 600 + 120 + 8 = 1728`.',
      answer: '`12^3 = 1728`.',
      shortcut: 'For estimations, use scaling: `(1 + x)^3 ≈ 1 + 3x` for very small values of `x`.'
    },
    {
      title: 'Approximation Techniques',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Approximation techniques allow you to estimate complex mathematical operations to within 5% error under time pressure.',
      explanation: [
        'Linear approximation: `(1 + x)^n ≈ 1 + nx` for small values of `x` (e.g. `1.03^5 ≈ 1 + 5*0.03 = 1.15`).',
        'Rounding adjustments: If you round one number up, round the other down to balance the error in multiplication.',
        'Sizing divisions: To calculate `423 / 78`, round to:\n`420 / 80 = 21 / 4 = 5.25`.'
      ],
      intuition: [
        'Interviewers look for speed and confidence. If they ask for `41 * 49`, do not compute `41 * 49`. Write it as:\n`(45 - 4)(45 + 4) = 45^2 - 16 = 2025 - 16 = 2009`.'
      ],
      takeaways: [
        'Use linear approximation for powers.',
        'Balance rounding directions in products.',
        'Use difference of squares to solve products.'
      ]
    },
    {
      title: 'Expected Value Shortcuts',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Expected value shortcuts use linearity of expectation and symmetry to bypass probability distributions.',
      explanation: [
        'Expectation linearity: `E[X + Y] = E[X] + E[Y]` regardless of dependencies.',
        'Symmetry: The expected value of a uniform symmetric distribution is the average of its endpoints.',
        'Expected duration: Expected trials for a geometric distribution with probability `p` is:\n`1/p`.'
      ],
      intuition: [
        'If you need to find the expected sum of 5 dice, do not construct a giant tree. Sum the expectation of each die:\n`5 * 3.5 = 17.5`.'
      ],
      takeaways: [
        'Linearity bypasses covariance structures.',
        'Geometric expectation is simply\n`1 / p`.',
        'Symmetry splits bounds evenly.'
      ]
    },
    {
      title: 'Probability Estimation',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Probability estimation uses bounds and heuristics to estimate risk scales when exact numbers are missing.',
      explanation: [
        'Union Bound: `P(A ∪ B) ≤ P(A) + P(B)`. Provides a quick upper limit for risk.',
        'Rule of 72: Establishes doubling times for compounds:\n`Time ≈ 72 / rate`.',
        'Heuristic sorting: Sorting outcomes from most likely to least likely before calculating.'
      ],
      intuition: [
        'In quantitative finance interviews, when asked for the likelihood of a multi-variable default, use the Union Bound to set the absolute worst-case scenario threshold immediately.'
      ],
      takeaways: [
        'Union Bound sets the upper risk limit.',
        'Rule of 72 approximates compound scales.',
        'Heuristics prioritize high-density cases.'
      ]
    },
    {
      title: 'Fermi Estimation',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Estimate unknown physical or economic quantities to within an order of magnitude using dimensional analysis.',
      step1: 'Break the target quantity into a product of basic parameters. For example, to estimate "number of piano tuners in Chicago".',
      step2: 'Estimate the inputs: Chicago population = 3 million. People per household = 3 (1 million households). 1 in 10 households owns a piano (100,000 pianos). A piano is tuned once a year (100,000 tunings/year).',
      step3: 'Estimate work capacity: A tuner works 250 days/year, tuning 2 pianos a day (500 tunings/year/tuner). Divide total tunings by capacity:\n`100,000 / 500 = 200`.',
      answer: 'There are approximately `200` piano tuners in Chicago.',
      shortcut: 'Focus on exponents: scale variables to the nearest power of 10 (`10^N`) during high uncertainty.'
    },
    {
      title: 'Order of Magnitude Thinking',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Order of magnitude thinking filters out minor calculations to focus on exponential scales (`10^x`).',
      explanation: [
        'Prevents details from slowing down high-level estimations.',
        'Rounds values to the nearest power of 10. `3` becomes `10^0`, `7` becomes\n`10^1`.',
        'Essential for checking the sanity of complex code calculations (e.g. verifying memory constraints).'
      ],
      intuition: [
        'If a calculation yields 1,234,567 and another yields 8,901,234, the key insight is that they are of scale `10^6` and `10^7`. Focus on the powers, not the trailing digits.'
      ],
      takeaways: [
        'Scale numbers to the nearest power of 10.',
        'Filters out noise during high-level planning.',
        'Quickly identifies calculation errors.'
      ]
    },
    {
      title: 'Mental Arithmetic Tricks',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Quick rules to perform arithmetic operations (multiplication, division, and addition) in your head.',
      explanation: [
        'Multiplying by 11: Add adjacent digits and insert them. Example:\n`23 * 11 = 2 (2+3) 3 = 253`.',
        'Dividing by 5: Multiply the number by 2 and shift the decimal point one place to the left.',
        'Multiplying by 9: Multiply by 10 and subtract the original number.'
      ],
      intuition: [
        'If you need to divide 135 by 5, double it to 270, then shift the decimal: `27`.'
      ],
      takeaways: [
        'Multiplying by 11: insert the sum of the digits.',
        'Dividing by 5: double and shift decimal.',
        'Multiplying by 9:\n`10x - x`.'
      ]
    }
  ],
  'Interview Classics': [
    {
      title: 'Birthday Paradox',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Calculate the probability that in a group of N randomly chosen people, at least two will share a birthday.',
      step1: 'Use complement counting: calculate the probability `P(Diff)` that all `N` people have different birthdays.',
      step2: 'Sequence the choices: Person 1 has 365 options. Person 2 has 364 options, and so on.\n`P(Diff) = (365/365) * (364/365) * ... * ((365 - N + 1)/365)`.',
      step3: 'Calculate for `N = 23`: `P(Diff) ≈ 0.4927`. Subtract from 1 to find the probability of sharing:\n`P(Share) = 1 - 0.4927 = 0.5073`.',
      answer: 'In a group of only `23` people, there is a `50.7%` chance that at least two share a birthday.',
      shortcut: 'Approximation formula: `P(Share) ≈ 1 - e^(-N^2 / (2 * 365))`. For `N = 23`, this yields\n`1 - e^(-0.72) ≈ 51.5%`.'
    },
    {
      title: 'Coupon Collector Problem',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Calculate the expected number of coupon draws needed to collect all N unique coupons.',
      step1: 'Define transition states: Let `Xi` be the number of draws to get the `i-th` unique coupon after collecting `i-1` coupons.',
      step2: 'Identify probabilities: The probability of getting a new coupon is `pi = (N - i + 1) / N`. This is a geometric distribution.',
      step3: 'Sum the expectations: Expected draws `E[X] = Σ E[Xi] = Σ (1 / pi) = N * Σ (1 / k)` from `k = 1` to `N`. This matches `N` times the `N-th` Harmonic number `H_N`.',
      answer: 'Expected draws is `N * H_N`. For `N = 10`, `E[X] = 10 * 2.929 = 29.29` draws.',
      shortcut: 'For large `N`, the harmonic sum approximates `ln(N) + γ`. Thus, expected draws\n`E[X] ≈ N * ln(N) + 0.577 * N`.'
    },
    {
      title: 'Secretary Problem',
      difficulty: 'Hard',
      type: 'puzzle',
      intro: 'You want to select the best candidate from a pool of N applicants. They are interviewed sequentially, and you must decide immediately after each interview whether to hire them. What is your optimal strategy?',
      step1: 'Identify the optimal strategy structure: Reject the first `R` applicants as a baseline, then hire the first subsequent applicant who is better than all previous applicants.',
      step2: 'Formulate the probability of choosing the best candidate as a function of the cutoff `r`. Take the limit as `N ➔ ∞` to set up the calculus optimization:\n`P(Success) = -(r/N) * ln(r/N)`.',
      step3: 'Find the maximum by setting the derivative to zero. The maximum occurs when the ratio\n`r/N = 1/e ≈ 0.3678`.',
      answer: 'Optimal strategy: Interview and reject the first `36.8%` of applicants, then hire the next applicant who is better than all candidates seen so far. This gives a `36.8%` chance of hiring the absolute best candidate.',
      shortcut: 'The cutoff threshold and the winning probability both converge to:\n`1/e`.'
    },
    {
      title: 'Gambler\'s Ruin',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Calculate the probability that a gambler who starts with capital i wins a target capital N before going bankrupt (0) in a series of independent rounds.',
      step1: 'Set up parameters: Gambler capital `i`, target `N`, win probability `p` per round, and loss probability `q = 1 - p`. We want to find `Pi_i` (probability of reaching `N`).',
      step2: 'Set up the recurrence relation: `Pi_i = p * Pi_(i+1) + q * Pi_(i-1)`. The boundary conditions are `Pi_0 = 0` and\n`Pi_N = 1`.',
      step3: 'Solve the characteristic equation: If `p = 0.5` (fair game), the solution is linear: `Pi_i = i / N`. If `p ≠ 0.5`, the solution is exponential:\n`Pi_i = [1 - (q/p)^i] / [1 - (q/p)^N]`.',
      answer: 'For a fair game, probability of winning is `i / N`. For an unfair game, it is:\n`[1 - (q/p)^i] / [1 - (q/p)^N]`.',
      shortcut: 'In a fair game starting with $10 and aiming for $100, the probability of reaching the goal is exactly\n`10 / 100 = 10%`.'
    },
    {
      title: 'Matching Problem',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Calculate the expected number of correct matches when N letters are placed randomly into N addressed envelopes.',
      step1: 'Set up indicator variables: Let `Xi = 1` if letter `i` is placed in the correct envelope `i`, and `Xi = 0` otherwise.',
      step2: 'Find the expectation of a single indicator: Since the envelope is chosen randomly, the probability of matching is `P(Xi = 1) = 1/N`. Thus,\n`E[Xi] = 1/N`.',
      step3: 'Sum the expectations: Total matches `X = X1 + X2 + ... + XN`. Using linearity:\n`E[X] = E[X1] + E[X2] + ... + E[XN] = N * (1/N) = 1`.',
      answer: 'The expected number of correct matches is exactly `1`, regardless of the number of letters/envelopes `N`.',
      shortcut: 'Linearity of expectation holds even though the events are highly dependent. The answer is always 1.'
    },
    {
      title: 'Random Walk Basics',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'A **Random Walk** is a mathematical object that describes a path consisting of a succession of random steps on a mathematical space.',
      explanation: [
        '1D Walk: A particle starts at 0 and moves +1 (probability p) or -1 (probability 1-p) at each step.',
        'Pólya\'s Theorem: A simple random walk on a grid is recurrent in 1D and 2D (guaranteed to return to the start), but transient in 3D or higher (probability of returning is `< 1`).',
        'Underpins Brownian motion, stock price modeling (geometric random walks), and diffusion processes.'
      ],
      intuition: [
        'A famous quote: "A drunk man will find his way home, but a drunk bird may get lost forever." This represents Pólya\'s recurrence theorem in 2D (ground) vs 3D (air).'
      ],
      takeaways: [
        '1D and 2D random walks are recurrent (guaranteed return).',
        '3D and higher walks are transient (can get lost).',
        'Forms the basis of pricing models in financial mathematics.'
      ]
    },
    {
      title: 'Buffon\'s Needle',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'A needle of length L is dropped onto a plane ruled with parallel lines at distance D. What is the probability that the needle crosses a line?',
      step1: 'Define the state variables: Let `x` be the distance from the needle center to the nearest line. `x` is uniformly distributed in `[0, D/2]`. Let `θ` be the angle of the needle, uniformly distributed in\n`[0, π/2]`.',
      step2: 'Establish the crossing condition: The needle crosses a line if\n`x ≤ (L/2) * sin(θ)`.',
      step3: 'Integrate the joint density function over the favorable region: `P = ∫ (2/D) * (2/π) * sin(θ) dθ` from `0` to `π/2` (assuming `L ≤ D`). This yields\n`P = 2L / (πD)`.',
      answer: 'The probability that the needle crosses a line is:\n`2L / (πD)`.',
      shortcut: 'Can be used to estimate `π` experimentally by dropping needles and counting crossings:\n`π ≈ 2L / (P * D)`.'
    },
    {
      title: 'Broken Stick Problem',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'A stick is broken at two randomly chosen points. What is the probability that the three resulting pieces can form a triangle?',
      step1: 'Define the sample space: Let the stick length be 1. The break points are `x` and `y` in `[0,1]`. The sample space is a square of area 0.5 (since `x < y` or `x > y`).',
      step2: 'Apply the Triangle Inequality: Three segments `a, b, c` can form a triangle if and only if `a + b > c`, `b + c > a`, and `a + c > b` (no piece can be ≥ 0.5).',
      step3: 'Map the constraints onto the coordinate grid. The favorable region forms a triangle of area `1/8` in the `x-y` plane. Calculate probability ratio:\n`Area(Favorable) / Area(SampleSpace) = (1/8) / (1/2) = 1/4`.',
      answer: 'The probability that the three pieces can form a triangle is `1/4` or `25%`.',
      shortcut: 'If you break a stick sequentially (break in two, then break the larger piece in two), the probability changes to:\n`ln(2) - 0.5 ≈ 19.3%`.'
    },
    {
      title: 'Drunkard\'s Walk',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'A drunk man stands 1 step away from a cliff. At each step, he moves 1 step toward the cliff (probability 1/3) or 1 step away (probability 2/3). What is the probability that he eventually falls off?',
      step1: 'Define the event: Let `P` be the probability of eventually falling off the cliff starting from 1 step away.',
      step2: 'Set up the recursive relation:\n`P = 1/3 (falls on step 1) + 2/3 * P^2 (moves away, must return to 1, then return to 0)`.',
      step3: 'Solve the quadratic equation: `2P^2 - 3P + 1 = 0` ➔ `(2P - 1)(P - 1) = 0`. This yields two solutions: `P = 1` or `P = 0.5`. Since the drift is away from the cliff (`2/3 > 1/3`), the probability must be less than 1. Thus,\n`P = 0.5`.',
      answer: 'The probability that the drunk man eventually falls off the cliff is `0.5` or `50%`.',
      shortcut: 'Formula for gambler\'s ruin with infinite target: `P = (q/p)` if `q < p`. Here, `q = 1/3`, `p = 2/3`. Ratio =\n`(1/3) / (2/3) = 0.5`.'
    },
    {
      title: 'Occupancy Problems',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Calculate the expected number of empty bins when N balls are distributed randomly into M bins.',
      step1: 'Set up indicator variables: Let `Xi = 1` if bin `i` is empty, and `Xi = 0` otherwise.',
      step2: 'Find the probability of a bin remaining empty: For each ball, the probability of missing bin `i` is `(M - 1) / M`. For `N` independent balls, `P(Xi = 1) = ((M - 1) / M)^N`. Thus,\n`E[Xi] = ((M - 1) / M)^N`.',
      step3: 'Sum the expectations: Total empty bins `X = Σ Xi`. Using linearity:\n`E[X] = M * ((M - 1) / M)^N`.',
      answer: 'Expected number of empty bins is:\n`M * (1 - 1/M)^N`.',
      shortcut: 'For large `M` and `N` where the ratio `N/M = r` (load factor), the expected empty fraction converges to:\n`e^(-r)`.'
    },
    {
      title: 'Airplane Seating Problem',
      difficulty: 'Hard',
      type: 'puzzle',
      intro: '100 passengers board a plane with 100 assigned seats. The first passenger loses their ticket and chooses a seat randomly. Every subsequent passenger sits in their assigned seat if available, and chooses a random empty seat otherwise. What is the probability that the 100th passenger sits in their assigned seat?',
      step1: 'Identify the decision tree: When passenger `k` boards, they either find their seat empty, find seat 1 empty, or find passenger 1\'s seat occupied. This creates a chain of choices.',
      step2: 'Look at the critical seats: The process only stops when someone chooses either seat 1 (restoring order) or seat 100 (forcing passenger 100 out). Until one of these two seats is chosen, passengers sit in random seats.',
      step3: 'Apply symmetry: Since seat 1 and seat 100 are treated symmetrically at every step of random selection, the game is a coin flip between choosing seat 1 first vs choosing seat 100 first.',
      answer: 'The probability that the 100th passenger sits in their assigned seat is exactly `0.5` or `50%`.',
      shortcut: 'No matter the number of passengers `N`, the probability for the final passenger is always `0.5`.'
    },
    {
      title: 'Interview Classics Summary',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Summarize standard interview quant patterns: birthday collisions, coupon harmonic sums, and secretary cutoff bounds.',
      explanation: [
        'Collision checks: Birthday paradox patterns scale with `√N` (collisions occur much faster than intuition suggests).',
        'Harmonic draws: Coupon collector sets show that collecting the final items dominates the total expected duration.',
        'Cutoff heuristics: Secretary problems prove that baseline gathering (rejecting `1/e` fraction) is the optimal strategy for sequence searches.'
      ],
      intuition: [
        'When an interviewer presents a puzzle, identify if it maps to these classic archetypes. If you recognize the pattern, state the standard mathematical limits immediately to show your domain knowledge.'
      ],
      takeaways: [
        'Collisions occur with scale factor\n`O(√N)`.',
        'Draw distributions scale with `O(N ln N)`.',
        'Cutoff optimizations target `1/e ≈ 36.8%` bounds.'
      ]
    }
  ],
  'Markov Chains': [
    {
      title: 'Markov Property',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Markov Property** states that the future state of a system depends only on the current state, not on the path taken to get there.',
      explanation: [
        'Memoryless nature: Mathematically,\n`P(X_n+1 = x | X_n = x_n, X_n-1 = x_n-1, ..., X_0 = x_0) = P(X_n+1 = x | X_n = x_n)`.',
        'Simplifies systems modeling by ignoring history. You only need to know the current state vector to calculate future probabilities.',
        'Contrast with memory-dependent systems (like drawing without replacement, which requires tracking all past draws unless you include them in the state definition).'
      ],
      intuition: [
        'Think of a game of Monopoly. Your next position depends only on where your token sits right now and the dice roll. It does not matter how many turns or paths it took you to get to your current square.'
      ],
      takeaways: [
        'Markov Property = Memorylessness.',
        'Future depends only on the present state.',
        'Significantly simplifies complex state-transition equations.'
      ]
    },
    {
      title: 'States and Transitions',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A Markov Chain is defined by its set of **States** and the **Transition Probabilities** between them.',
      explanation: [
        'State Space: The set of all possible configurations of the system (e.g. `{Sunny, Rainy}`).',
        'Transition probability `P_ij` is the probability of moving from state `i` to state `j` in a single step.',
        'State diagrams: Visualized as a directed graph where nodes represent states and weighted edges represent transition probabilities.'
      ],
      intuition: [
        'To model weather: if it is Sunny today, it is Sunny tomorrow with 80% probability and Rainy with 20%. If it is Rainy today, it is Sunny tomorrow with 40% probability and Rainy with 60%.'
      ],
      takeaways: [
        'State Space represents all possible system configurations.',
        'Transitions define step probabilities `P_ij`.',
        'Transitions from any single state must sum to exactly 1.'
      ]
    },
    {
      title: 'Transition Matrix',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A **Transition Matrix** (denoted by `P`) is a square matrix containing the transition probabilities between all states in a Markov Chain.',
      explanation: [
        'Row stochastic: Every element `P_ij ≥ 0`, and the sum of elements in each row must equal exactly 1 (since you must transition somewhere).',
        'Multi-step transitions: The `n-step` transition matrix is simply `P^n` (the matrix multiplied by itself `n` times). This is the Chapman-Kolmogorov equation.',
        'State vector evolution: The state probability distribution at step `t+1` is:\n`π_(t+1) = π_t * P`.'
      ],
      intuition: [
        'Rows represent starting states, columns represent target states. Multiplying the state vector by the transition matrix slides the entire system one step forward in time.'
      ],
      takeaways: [
        'Transition Matrix rows must sum to 1.',
        'n-step transition matrix is:\n`P^n`.',
        'Calculates state distribution changes over time.'
      ]
    },
    {
      title: 'Absorbing States',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'An **Absorbing State** is a state in a Markov Chain that, once entered, cannot be left.',
      explanation: [
        'Transition condition: A state `i` is absorbing if the transition probability `P_ii = 1` and `P_ij = 0` for all\n`j ≠ i`.',
        'Absorbing Markov Chain: A chain that has at least one absorbing state, and from every state it is possible to eventually reach an absorbing state.',
        'Used to model game ends (win/loss), bankruptcy, or system failures.'
      ],
      intuition: [
        'In the Gambler\'s Ruin game, state 0 (bankrupt) and state N (target reached) are absorbing states. Once you hit them, you stop playing.'
      ],
      takeaways: [
        'Absorbing state:\n`P_ii = 1`.',
        'Once entered, the system remains there forever.',
        'Underpins terminal analysis in games and risk models.'
      ]
    },
    {
      title: 'Stationary Distribution',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Calculate the stationary distribution of a Markov Chain, representing the long-run probability of being in each state.',
      step1: 'Define the stationary distribution vector `π` such that `π = π * P` and\n`Σ π_i = 1`.',
      step2: 'Set up the system of equations for a given matrix: `P = [[0.8, 0.2], [0.4, 0.6]]`. The equations are: `π_1 = 0.8*π_1 + 0.4*π_2` and\n`π_2 = 0.2*π_1 + 0.6*π_2`.',
      step3: 'Simplify the first equation: `0.2*π_1 = 0.4*π_2` ➔ `π_1 = 2*π_2`. Substitute into the normalization constraint `π_1 + π_2 = 1`: `2*π_2 + π_2 = 1` ➔ `3*π_2 = 1` ➔ `π_2 = 1/3`. Thus,\n`π_1 = 2/3`.',
      answer: 'The stationary distribution is `π = [2/3, 1/3]`. Over the long run, the system spends 66.7% of the time in state 1 and 33.3% in state 2.',
      shortcut: 'For a 2x2 matrix with transition parameters `a` (1➔2) and `b` (2➔1), the stationary distribution is:\n`[b/(a+b), a/(a+b)]`.'
    },
    {
      title: 'Simple Markov Examples',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Walk through simple Markov Chain setups, such as weather models, page ranking systems, and user behavior flows.',
      explanation: [
        'Weather model: Standard 2-state system `{Sunny, Rainy}` with set transition boundaries.',
        'PageRank: Google\'s algorithm models a web surfer clicking links randomly. Web pages are states, links are transitions. The PageRank score is the stationary distribution of this Markov Chain.',
        'User checkout flow: Modeling steps in an app\n`{Browse, AddToCart, Purchase, Exit}`.'
      ],
      intuition: [
        'Think of PageRank: popular pages have many incoming links, which means the random surfer is more likely to land on them. The stationary distribution represents where the surfer spends most of their time.'
      ],
      takeaways: [
        'PageRank is a stationary distribution of a link-graph.',
        'Transitions model link clicks and random jumps.',
        'Checkout flows use absorbing exit states.'
      ]
    },
    {
      title: 'Markov Chain Interview Questions',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'Identify Markov Chain patterns in interviews, such as expected steps to absorption and stationary equations.',
      explanation: [
        'Expected steps to absorption: Calculated using the fundamental matrix `F = (I - Q)^-1`, where `Q` represents transition boundaries between transient states.',
        'Equilibrium queries: Finding long-term ratios of active states.',
        'Periodic states: Chains that loop in fixed cycles, preventing convergence to a single stationary distribution.'
      ],
      intuition: [
        'If an interviewer asks for "the expected number of steps to reach a state", immediately label the expected steps from each state as variables and solve the system of linear equations.'
      ],
      takeaways: [
        'Expected steps to target is solved via systems of equations.',
        'Periodic loops prevent stationary convergence.',
        'Map the transition graph before solving.'
      ]
    },
    {
      title: 'Expected Steps Problems',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Calculate the expected number of steps to reach a target state in a Markov Chain using systems of linear equations.',
      step1: 'Define the variables: Let `Ei` be the expected number of steps to reach target state `T` starting from state `i`. The boundary condition is:\n`E_T = 0`.',
      step2: 'Set up the equations based on one-step transitions: `Ei = 1 + Σ P_ij * E_j` for all states `j`.',
      step3: 'Example: 3 states `{1, 2, 3}`. Target is 3. `P_11 = 0.5`, `P_12 = 0.5`. `P_21 = 0.2`, `P_23 = 0.8`. Set up equations: `E_1 = 1 + 0.5*E_1 + 0.5*E_2` ➔ `0.5*E_1 = 1 + 0.5*E_2` ➔ `E_1 = 2 + E_2`. `E_2 = 1 + 0.2*E_1 + 0.8*E_3`. Since 3 is the target, `E_3 = 0`. So `E_2 = 1 + 0.2*E_1`. Substitute `E_1`: `E_2 = 1 + 0.2(2 + E_2) = 1.4 + 0.2*E_2` ➔ `0.8*E_2 = 1.4` ➔ `E_2 = 1.75`. Find\n`E_1 = 2 + 1.75 = 3.75`.',
      answer: 'The expected number of steps to reach state 3 starting from state 1 is `3.75` steps.',
      shortcut: 'First-step analysis: Setting up `E = 1 + Σ P*E` resolves any finite step expectation question.'
    }
  ]
};

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected!');
  
  const db = mongoose.connection.db;

  // 1. Get system admin user
  let admin = await db.collection('users').findOne({ email: 'system@admin.com' });
  if (!admin) {
    console.log('👤 System Admin User not found. Querying first user...');
    admin = await db.collection('users').findOne({});
    if (!admin) {
      console.error('❌ No user found in system database. Cannot seed cards.');
      await mongoose.disconnect();
      process.exit(1);
    }
  }
  const adminId = admin._id;
  console.log(`👤 Using Admin User ID: ${adminId}`);

  // 2. Ensure subfolders exist under Quant
  const folderMap = new Map();
  console.log('\n--- Ensuring 11 Quant Subfolders exist ---');
  
  for (const sub of SUBFOLDERS) {
    const folderId = generateDeterministicUUID(`folder-${sub.title}`);
    
    // Upsert folder definition
    await db.collection('folders').updateOne(
      { _id: folderId },
      {
        $set: {
          title: sub.title,
          description: sub.description,
          icon: sub.icon,
          color: sub.color,
          createdBy: adminId,
          visibility: 'public',
          roleAccess: ['user', 'admin', 'superadmin'],
          order: sub.order,
          parentFolderId: QUANT_PARENT_ID,
          updatedAt: new Date()
        },
        $setOnInsert: {
          cardIds: [],
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    folderMap.set(sub.title, folderId);
    console.log(`📂 Subfolder "${sub.title}" verified/created. ID: ${folderId}`);
  }

  // 3. Upsert Cards
  let totalCardsSeeded = 0;
  console.log('\n--- Seeding/Updating Quant Revision Cards ---');

  for (const [folderTitle, cards] of Object.entries(QUANT_CARDS_DATA)) {
    const folderId = folderMap.get(folderTitle);
    if (!folderId) {
      console.warn(`⚠️ Warning: Subfolder "${folderTitle}" not found. Skipping cards.`);
      continue;
    }

    console.log(`\n📁 Seeding/Updating ${cards.length} cards under "${folderTitle}"...`);
    const cardIdsForFolder = [];

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const cardId = generateDeterministicUUID(`card-${c.title}|${folderTitle}`);

      // Compile slides programmatically
      const compiledSlides = compileSlides(c);
      const formattedSlides = compiledSlides.map((s, idx) => ({
        type: s.type,
        headline: s.headline,
        body: processEquations(s.body),
        code: s.code || null,
        blocks: s.blocks || [],
        slideIndex: idx,
        totalSlides: compiledSlides.length
      }));

      await db.collection('revisioncards').updateOne(
        { _id: cardId },
        {
          $set: {
            title: c.title,
            topic: 'Quant',
            explanation: processEquations(c.intro || c.problem || ''),
            code: c.code || '',
            image: '',
            tags: ['Quant', folderTitle, 'Placements'],
            difficulty: c.difficulty,
            complexity: '',
            examples: c.examples || [],
            folderId: folderId,
            createdBy: adminId,
            visibility: 'public',
            order: i,
            slides: formattedSlides,
            isDeleted: false,
            rootFolderId: QUANT_PARENT_ID,
            rootFolderName: 'Quant',
            subfolderPath: `/Quant/${folderTitle}`,
            subfolderIds: [folderId],
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
      
      cardIdsForFolder.push(cardId);
      totalCardsSeeded++;
    }

    // Link card IDs in the folder document
    await db.collection('folders').updateOne(
      { _id: folderId },
      { $set: { cardIds: cardIdsForFolder, updatedAt: new Date() } }
    );
    console.log(`   ✅ Linked ${cardIdsForFolder.length} cards in folder "${folderTitle}".`);
  }

  await mongoose.disconnect();
  console.log(`\n🎉 DONE! Seeded/Updated a total of ${totalCardsSeeded} Quant cards.`);
}

run().catch(console.error);
