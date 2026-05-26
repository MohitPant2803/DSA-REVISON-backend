export const STRIVER_DP_QUESTIONS = [
  {
    title: 'Maximum Product Subarray',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Find a contiguous subarray within a 1D numerical array that has the largest product.',
    code: `function maxProduct(nums) {
  let res = nums[0], maxProd = nums[0], minProd = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const val = nums[i];
    if (val < 0) {
      const temp = maxProd; maxProd = minProd; minProd = temp;
    }
    maxProd = Math.max(val, maxProd * val);
    minProd = Math.min(val, minProd * val);
    res = Math.max(res, maxProd);
  }
  return res;
}`,
    tags: ['Dynamic Programming', 'Arrays', 'Striver SDE Sheet'],
    examples: ['[2,3,-2,4] -> 6 ([2,3])'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine traveling down a path where multiplying by double-negatives instantly turns your deepest debt into extreme wealth: track both your highest gains and lowest debts.',
    intuition: 'Since multiplying by a negative swaps the maximum and minimum products, we maintain both running maximum and minimum products, and swap them when we encounter a negative number.',
    dryRun: 'nums = [2,3,-2,4]. At 3, max=6, min=3. At -2, swap max/min. max = max(-2, 3*-2)=-2, min = min(-2, 6*-2)=-12. Returns 6.',
    mistake: 'Only tracking the maximum product, which fails to capture how multiplying two negative values can yield a positive maximum.',
    prefer: 'Maintain both `maxProd` and `minProd` and swap them when `nums[i] < 0`.'
  },
  {
    title: 'Longest Increasing Subsequence',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(N log N)',
    explanation: 'Find the length of the longest strictly increasing subsequence in an array.',
    code: `function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let i = 0, j = tails.length;
    while (i < j) {
      const mid = (i + j) >> 1;
      if (tails[mid] < x) i = mid + 1;
      else j = mid;
    }
    tails[i] = x;
  }
  return tails.length;
}`,
    tags: ['Dynamic Programming', 'Binary Search', 'Striver SDE Sheet'],
    examples: ['[10,9,2,5,3,7,101,18] -> 4 ([2,3,7,101] or [2,3,7,18])'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine sorting playing cards into piles: if a card is larger than the top card of all piles, start a new pile. Otherwise, place it on top of the first pile that is larger than it.',
    intuition: 'Maintain an array `tails` storing the smallest tail of all increasing subsequences of various lengths. Use binary search to locate the correct placement for each number.',
    dryRun: 'nums = [10, 9, 2, 5]. tails becomes [10] -> [9] -> [2] -> [2, 5]. Length is 2.',
    mistake: 'Using standard O(N^2) double-loop DP which triggers timeouts on large inputs.',
    prefer: 'Use Binary Search (Patience Sorting) to resolve the LIS length in O(N log N) time.'
  },
  {
    title: 'Longest Common Subsequence',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(N * M)',
    explanation: 'Find the length of the longest subsequence common to two strings.',
    code: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    tags: ['Dynamic Programming', 'Strings', 'Striver SDE Sheet'],
    examples: ['text1 = "abcde", text2 = "ace" -> 3 ("ace")'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Like matching matching frames in film strips: if frames match, lock them in. If not, pick the best alignment from sliding either strip back.',
    intuition: 'Use a 2D grid. If characters match, `dp[i][j] = 1 + dp[i-1][j-1]`. If they mismatch, skip the current character from either string and take the maximum path.',
    dryRun: 'Build grid for "abc" and "ac". Diagonal matches add to the score. Returns 2.',
    mistake: 'Using simple recursion without memoization, leading to exponential O(2^(N+M)) time complexity.',
    prefer: 'Use bottom-up tabulating iterative DP to solve in O(N * M) time.'
  },
  {
    title: '0-1 Knapsack Problem',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(N * W)',
    explanation: 'Find the maximum value possible by filling a knapsack of capacity W with complete items.',
    code: `function knapSack(W, wt, val, n) {
  const dp = new Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let w = W; w >= wt[i]; w--) {
      dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);
    }
  }
  return dp[W];
}`,
    tags: ['Dynamic Programming', 'Striver SDE Sheet'],
    examples: ['W=4, wt=[1,2,3], val=[6,10,12] -> 22 (take items 1 and 2)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine packing a limited suitcase: for each item, decide whether to pack it (subtracting weight and adding value) or leave it on the table.',
    intuition: 'Maintain a 1D DP array representing maximum values for weights up to W. Traverse items, and update the DP array backwards to prevent using the same item twice.',
    dryRun: 'W=4. Item 1 (wt 1, val 6) -> dp=[0, 6, 6, 6, 6]. Item 2 (wt 2, val 10) -> dp=[0, 6, 10, 16, 16].',
    mistake: 'Updating the 1D weight array from left to right, which allows the same item to be selected multiple times (unbounded knapsack).',
    prefer: 'Traverse the weight boundary backwards `for (let w = W; w >= wt[i]; w--)` to ensure items are selected at most once.'
  },
  {
    title: 'Edit Distance',
    topic: 'Dynamic Programming',
    difficulty: 'Hard' as const,
    complexity: 'O(N * M)',
    explanation: 'Find the minimum operations (insert, delete, replace) required to convert word1 to word2.',
    code: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],    // delete
          dp[i][j - 1],    // insert
          dp[i - 1][j - 1] // replace
        );
      }
    }
  }
  return dp[m][n];
}`,
    tags: ['Dynamic Programming', 'Strings', 'Striver SDE Sheet'],
    examples: ['word1 = "horse", word2 = "ros" -> 3'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine correcting spelling errors: check whether deleting, inserting, or replacing a character offers the fastest path to match the target word.',
    intuition: 'Use a 2D grid representing prefixes. If characters match, carry over the score. If they mismatch, take the minimum of the three edits and add 1.',
    dryRun: 'Evaluate "cat" vs "cut". dp grid resolves mismatch edits recursively and returns 1 (replace "a" with "u").',
    mistake: 'Failing to initialize boundaries (first row/column), leading to index errors.',
    prefer: 'Initialize `dp[i][0] = i` and `dp[0][j] = j` as base editing limits.'
  },
  {
    title: 'Partition Equal Subset Sum',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(N * Sum)',
    explanation: 'Determine if an array can be partitioned into two subsets with equal sums.',
    code: `function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % 2 !== 0) return false;
  const target = sum / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const n of nums) {
    for (let j = target; j >= n; j--) {
      if (dp[j - n]) dp[j] = true;
    }
  }
  return dp[target];
}`,
    tags: ['Dynamic Programming', 'Arrays', 'Striver SDE Sheet'],
    examples: ['[1,5,11,5] -> true (split into [1,5,5] and [11])'],
    sheets: ['Striver SDE Sheet', 'NeetCode 150'],
    analogy: 'Like sharing weights equally on a balance scale: check if a subset of items can sum to exactly half of the total weight.',
    intuition: 'Equivalent to the 0-1 Knapsack problem. Find if there exists a subset of numbers whose sum is exactly `totalSum / 2`.',
    dryRun: 'nums = [1, 5]. target = 3. Check combinations. Returns false since 3 is not achievable.',
    mistake: 'Running search paths when the total sum is odd, which can never be split equally.',
    prefer: 'Check `if (sum % 2 !== 0) return false` immediately to exit early.'
  },
  {
    title: 'Matrix Chain Multiplication',
    topic: 'Dynamic Programming',
    difficulty: 'Hard' as const,
    complexity: 'O(N^3)',
    explanation: 'Find the most efficient way to multiply a chain of matrices.',
    code: `function matrixMultiplication(N, arr) {
  const dp = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let len = 2; len < N; len++) {
    for (let i = 1; i < N - len + 1; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + arr[i - 1] * arr[k] * arr[j];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }
  return dp[1][N - 1];
}`,
    tags: ['Dynamic Programming', 'Matrix', 'Striver SDE Sheet'],
    examples: ['arr=[10,20,30] -> 6000 (10x20x30 multiplication operations)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like placing parentheses around nested equations: find the grouping structure that minimizes the total multiplication steps.',
    intuition: 'Partition DP. Define `dp[i][j]` as the minimum cost to multiply matrices from `i` to `j`. Split at all intermediate indices `k` to find the minimum cost.',
    dryRun: 'Process subsegments. Test division coordinates `k` and select the partition that minimizes cost.',
    mistake: 'Iterating length loops inside boundary loops, which corrupts dependencies.',
    prefer: 'Keep matrix chain length `len` as the outermost loop, followed by index `i`.'
  },
  {
    title: 'Minimum Sum Path in a Matrix',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(M * N)',
    explanation: 'Find a path from top-left to bottom-right in a grid which minimizes the sum of numbers along its path.',
    code: `function minPathSum(grid) {
  const r = grid.length, c = grid[0].length;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (i === 0 && j > 0) grid[i][j] += grid[i][j - 1];
      else if (j === 0 && i > 0) grid[i][j] += grid[i - 1][j];
      else if (i > 0 && j > 0) {
        grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
      }
    }
  }
  return grid[r - 1][c - 1];
}`,
    tags: ['Dynamic Programming', 'Matrix', 'Striver SDE Sheet'],
    examples: ['[[1,3,1],[1,5,1],[4,2,1]] -> 7 (path 1 -> 3 -> 1 -> 1 -> 1)'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150'],
    analogy: 'Imagine traveling down a grid of toll roads: at each intersection, choose whether arriving from the north or the west costs less.',
    intuition: 'Each cell (i, j) can only be reached from (i-1, j) or (i, j-1). We update each cell in-place by adding the minimum cost of the two incoming paths.',
    dryRun: 'Row 0 updated in-place. Column 0 updated. Middle cells accumulate minimums. Returns 7.',
    mistake: 'Using extra memory buffers when in-place grid modifications are possible.',
    prefer: 'Modify the input matrix in-place to achieve O(1) auxiliary space.'
  },
  {
    title: 'Coin Change',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(N * Amount)',
    explanation: 'Find the minimum number of coins to make up an amount.',
    code: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    tags: ['Dynamic Programming', 'Striver SDE Sheet'],
    examples: ['coins = [1,2,5], amount = 11 -> 3 (5 + 5 + 1)'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Similar to minimum coin change, but we must use dynamic programming because the available coin denominations can be arbitrary (non-canonical).',
    intuition: 'Maintain a DP array representing the minimum coins needed for each amount. For each coin, iterate forward and update minimum counts.',
    dryRun: 'amount = 5, coins = [1,2,5]. Tabulation builds minimum coin requirements and returns 1.',
    mistake: 'Using a greedy approach, which fails on non-canonical currency systems (e.g. coins=[1,3,4], amount=6 -> greedy gives 4+1+1=3, optimal is 3+3=2).',
    prefer: 'Apply tabulating DP to guarantee absolute mathematical optimality.'
  },
  {
    title: 'Subset Sum Problem',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(N * Sum)',
    explanation: 'Determine if there exists a subset of an array that sums to target.',
    code: `function isSubsetSum(N, arr, sum) {
  const dp = new Array(sum + 1).fill(false);
  dp[0] = true;
  for (let i = 0; i < N; i++) {
    for (let j = sum; j >= arr[i]; j--) {
      if (dp[j - arr[i]]) dp[j] = true;
    }
  }
  return dp[sum];
}`,
    tags: ['Dynamic Programming', 'Arrays', 'Striver SDE Sheet'],
    examples: ['arr=[3,34,4], sum=9 -> true (5 + 4 = 9)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine checking if a set of packages can perfectly fill a shipping container of a specific weight.',
    intuition: 'Maintain a boolean DP array representing achievable sums. Traverse numbers, updating possible sums backwards to prevent duplicate element reuse.',
    dryRun: 'arr = [3, 4], sum=7. Traverse elements. Map possible subset sums. Returns true.',
    mistake: 'Failing to loop backwards, allowing elements to be reused multiple times.',
    prefer: 'Loop backwards from `sum` down to `arr[i]` to satisfy the single-use constraint.'
  },
  {
    title: 'Rod Cutting',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(N^2)',
    explanation: 'Find the maximum value possible by cutting a rod of length N into pieces and selling them.',
    code: `function cutRod(price, n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    for (let j = i; j <= n; j++) {
      dp[j] = Math.max(dp[j], price[i - 1] + dp[j - i]);
    }
  }
  return dp[n];
}`,
    tags: ['Dynamic Programming', 'Striver SDE Sheet'],
    examples: ['price=[1,5,8,9], n=4 -> 10 (two cuts of length 2)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine cutting a metal beam to sell: find the cut configurations that maximize market profit.',
    intuition: 'Unbounded Knapsack. We can cut pieces of any length multiple times. Update the DP array forward to allow reusing cuts.',
    dryRun: 'n=4. Price configurations evaluated. Maximum value of 10 obtained by selling two pieces of length 2.',
    mistake: 'Looping backwards, which restricts cuts to being used at most once (like 0-1 Knapsack).',
    prefer: 'Loop forward `for (let j = i; j <= n; j++)` to support multiple cuts of the same length.'
  },
  {
    title: 'Egg Dropping Puzzle',
    topic: 'Dynamic Programming',
    difficulty: 'Hard' as const,
    complexity: 'O(K * N)',
    explanation: 'Find the minimum number of attempts needed to find the threshold floor in a building of N floors using K eggs.',
    code: `function superEggDrop(k, n) {
  const dp = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0));
  let attempts = 0;
  while (dp[attempts][k] < n) {
    attempts++;
    dp.push(new Array(k + 1).fill(0)); // dynamically allocate
    for (let j = 1; j <= k; j++) {
      dp[attempts][j] = dp[attempts - 1][j - 1] + dp[attempts - 1][j] + 1;
    }
  }
  return attempts;
}`,
    tags: ['Dynamic Programming', 'Math', 'Striver SDE Sheet'],
    examples: ['eggs = 2, floors = 6 -> 3'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like sorting items with fragile testers: determine the minimum attempts needed to pinpoint the breaking point floor.',
    intuition: 'Change the state representation: let `dp[attempts][eggs]` represent the maximum number of floors we can test. If an egg breaks, we test the floors below; if it survives, we test the floors above.',
    dryRun: 'Calculate maximum floor heights testable with K eggs and M attempts. Terminate when target height N is reached.',
    mistake: 'Using O(K*N^2) recursive partition search, which causes TLE timeouts.',
    prefer: 'Reformulate the DP state to track testable floors with K eggs and M attempts to solve in O(K * N) time.'
  },
  {
    title: 'Word Break',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(N^2)',
    explanation: 'Determine if a string can be segmented into space-separated dictionary words.',
    code: `function wordBreak(s, wordDict) {
  const dict = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && dict.has(s.substring(j, i))) {
        dp[i] = true; break;
      }
    }
  }
  return dp[s.length];
}`,
    tags: ['Dynamic Programming', 'Strings', 'Striver SDE Sheet'],
    examples: ['s = "leetcode", wordDict = ["leet","code"] -> true'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine decoding continuous telegraph messages: check if you can split the message into valid dictionary words.',
    intuition: 'Maintain a boolean DP array representing if prefix substrings can be segmented. For each position, check if there exists a split point where the left prefix is valid and the right suffix is in the dictionary.',
    dryRun: 's = "leetcode". dp[0]=true. dp[4]=true ("leet"). dp[8]=true ("code"). Returns true.',
    mistake: 'Performing redundant substring lookups without converting the dictionary into a Hash Set.',
    prefer: 'Use a `Set` for O(1) dictionary lookups.'
  },
  {
    title: 'Maximum Path Sum in a Grid',
    topic: 'Dynamic Programming',
    difficulty: 'Medium' as const,
    complexity: 'O(M * N)',
    explanation: 'Find a path from top-left to bottom-right that maximizes the sum of values.',
    code: `function maxPathSumGrid(grid) {
  const r = grid.length, c = grid[0].length;
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (i === 0 && j > 0) grid[i][j] += grid[i][j - 1];
      else if (j === 0 && i > 0) grid[i][j] += grid[i - 1][j];
      else if (i > 0 && j > 0) {
        grid[i][j] += Math.max(grid[i - 1][j], grid[i][j - 1]);
      }
    }
  }
  return grid[r - 1][c - 1];
}`,
    tags: ['Dynamic Programming', 'Matrix', 'Striver SDE Sheet'],
    examples: ['[[1,2,5],[3,2,1]] -> 9 (path 1 -> 3 -> 2 -> 2 -> 1)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine sweeping a minefield for gold coins: always choose the incoming direction that maximizes your total treasure.',
    intuition: 'Each cell can be reached from above or from the left. Accumulate maximum paths in-place across the grid.',
    dryRun: 'Update matrix in-place with maximum sums. Return bottom-right cell value.',
    mistake: 'Using nested loops that run out of grid boundaries.',
    prefer: 'Use strict boundary checks `i > 0` and `j > 0` to guide the updates.'
  }
];
