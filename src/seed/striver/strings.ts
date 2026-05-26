export const STRIVER_STRINGS_QUESTIONS = [
  {
    title: 'Reverse Words in a String',
    topic: 'Strings',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Given an input string s, reverse the order of the words.',
    code: `function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(' ');
}`,
    tags: ['Strings', 'Two Pointers', 'Striver SDE Sheet'],
    examples: ['"the sky is blue" -> "blue is sky the"', '"  hello world  " -> "world hello"'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150'],
    analogy: 'Imagine books stacked horizontally on a shelf: to reverse them, you pick them up one-by-one and place them on a new shelf from right to left.',
    intuition: 'Trim outer spaces, split by any contiguous sequence of whitespace, reverse the resulting array of words, and join them with a single space.',
    dryRun: 's = "  hello   world  ". trim() -> "hello   world". split(/\\s+/) -> ["hello", "world"]. reverse() -> ["world", "hello"]. join(" ") -> "world hello".',
    mistake: 'Failing to handle multiple spaces between words, resulting in empty strings in the output.',
    prefer: 'Use a regular expression split like `/\\s+/` or manual two-pointer traversal to bypass multiple spaces.'
  },
  {
    title: 'Longest Palindromic Substring',
    topic: 'Strings',
    difficulty: 'Medium' as const,
    complexity: 'O(N^2)',
    explanation: 'Find the longest contiguous palindromic substring in s.',
    code: `function longestPalindrome(s) {
  if (!s || s.length < 1) return "";
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    const len1 = expandAroundCenter(s, i, i);
    const len2 = expandAroundCenter(s, i, i + 1);
    const len = Math.max(len1, len2);
    if (len > end - start) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2);
    }
  }
  return s.substring(start, end + 1);
}
function expandAroundCenter(s, left, right) {
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--; right++;
  }
  return right - left - 1;
}`,
    tags: ['Strings', 'Dynamic Programming', 'Striver SDE Sheet'],
    examples: ['"babad" -> "bab" (or "aba")', '"cbbd" -> "bb"'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Like placing a mirror at each point in a word and expanding your field of view symmetrically outwards to see if the reflection matches.',
    intuition: 'A palindrome expands symmetrically from its center. Since centers can be single characters (odd length) or between two characters (even length), we check both expansions for each index.',
    dryRun: 's = "babad". Center at index 1 ("a") expands to "bab". Center at index 2 ("b") expands to "aba". Longest found is 3.',
    mistake: 'Using a brute-force O(N^3) solution which times out on long string inputs.',
    prefer: 'Use the expand-around-center technique to solve in O(N^2) time and O(1) space.'
  },
  {
    title: 'Roman to Integer',
    topic: 'Strings',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Convert a roman numeral to an integer.',
    code: `function romanToInt(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const current = map[s[i]];
    const next = map[s[i + 1]];
    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }
  return total;
}`,
    tags: ['Strings', 'Math', 'Striver SDE Sheet'],
    examples: ['"III" -> 3', '"LVIII" -> 58', '"MCMXCIV" -> 1994'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like counting cash with deductions: if a smaller bill is placed before a larger one (like a $1 bill before a $5 bill), it means subtract $1.',
    intuition: 'Traverse the string from left to right. If the current Roman character value is smaller than the next one, it represents subtraction (e.g. IV = -1 + 5 = 4). Otherwise, add the value.',
    dryRun: 's = "MCMXCIV". M=1000. C < M -> -100. M=1000. X < C -> -10. C=100. I < V -> -1. V=5. Total = 1994.',
    mistake: 'Hardcoding all subtraction cases which leads to convoluted code.',
    prefer: 'Check if the next character value is greater than the current one to dynamically handle subtraction cases.'
  },
  {
    title: 'Integer to Roman',
    topic: 'Strings',
    difficulty: 'Medium' as const,
    complexity: 'O(1)',
    explanation: 'Convert an integer to a roman numeral.',
    code: `function intToRoman(num) {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let roman = "";
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      roman += symbols[i];
      num -= values[i];
    }
  }
  return roman;
}`,
    tags: ['Strings', 'Math', 'Striver SDE Sheet'],
    examples: ['3724 -> "MMMDCCXXIV"'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like cashier cashout: always distribute the largest denominations of bills possible before moving to smaller ones.',
    intuition: 'Use a greedy approach. Map Roman symbols to their values in descending order. Subtract the largest possible value and append the symbol.',
    dryRun: 'num = 14. values[i] = 10 (X) -> num=4, roman="X". values[i] = 4 (IV) -> num=0, roman="XIV".',
    mistake: 'Failing to include the subtractive cases (e.g., 900, 400, 90) in the mapping.',
    prefer: 'Pre-populate subtraction symbols like "CM", "CD" in the map to make subtraction greedy and clean.'
  },
  {
    title: 'Longest Common Prefix',
    topic: 'Strings',
    difficulty: 'Easy' as const,
    complexity: 'O(N * M)',
    explanation: 'Find the longest common prefix string amongst an array of strings.',
    code: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (!prefix) return "";
    }
  }
  return prefix;
}`,
    tags: ['Strings', 'Striver SDE Sheet'],
    examples: ['["flower","flow","flight"] -> "fl"', '["dog","racecar","car"] -> ""'],
    sheets: ['Striver SDE Sheet', 'NeetCode 150'],
    analogy: 'Like comparing a stack of signature cards: trim down the letters from the end until the signature perfectly fits all cards.',
    intuition: 'Assume the first string is the common prefix. Compare it with the next string and truncate characters from the end of the prefix until it becomes a prefix of the target string.',
    dryRun: 'strs = ["flower", "flow"]. prefix="flower". Compare with "flow". Truncate to "flowe", then "flow". Matches! Compare "flow" with "flight" -> truncates to "fl". Matches!',
    mistake: 'Checking characters character-by-character across all words in a nested fashion, which is harder to implement and read.',
    prefer: 'Use string truncation (horizontal scanning) or sorting to quickly isolate prefix matches.'
  },
  {
    title: 'Rabin-Karp Algorithm',
    topic: 'Strings',
    difficulty: 'Medium' as const,
    complexity: 'O(N + M) average',
    explanation: 'Find the index of the first occurrence of a pattern in a text using rolling hashes.',
    code: `function strStrRabinKarp(text, pattern) {
  const d = 256, q = 101;
  const M = pattern.length, N = text.length;
  let p = 0, t = 0, h = 1;
  if (M > N) return -1;
  for (let i = 0; i < M - 1; i++) {
    h = (h * d) % q;
  }
  for (let i = 0; i < M; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }
  for (let i = 0; i <= N - M; i++) {
    if (p === t) {
      let j = 0;
      for (j = 0; j < M; j++) {
        if (text[i + j] !== pattern[j]) break;
      }
      if (j === M) return i;
    }
    if (i < N - M) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + M)) % q;
      if (t < 0) t = t + q;
    }
  }
  return -1;
}`,
    tags: ['Strings', 'Pattern Matching', 'Striver SDE Sheet'],
    examples: ['text = "hello", pattern = "ll" -> 2'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like scanning a crowd for a fingerprint: instead of looking at everyone in detail, calculate a quick numeric ID (hash) for each group and only inspect matches.',
    intuition: 'Compute a hash value for the pattern and for each window of length M in the text. If the hash values match, verify characters to avoid false positives (hash collisions).',
    dryRun: 'pattern = "ll", text = "hello". Hash matches at index 2. Character-by-character checking confirms match. Return 2.',
    mistake: 'Failing to handle negative hash values resulting from subtraction during rolling hash updates.',
    prefer: 'Always add the prime modulus `q` if the rolling hash goes negative during computation.'
  },
  {
    title: 'Implement Atoi',
    topic: 'Strings',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Convert a string to a 32-bit signed integer.',
    code: `function myAtoi(s) {
  let i = 0, sign = 1, result = 0;
  const INT_MAX = 2147483647, INT_MIN = -2147483648;
  while (i < s.length && s[i] === ' ') i++;
  if (i < s.length && (s[i] === '+' || s[i] === '-')) {
    sign = s[i] === '-' ? -1 : 1;
    i++;
  }
  while (i < s.length && s[i] >= '0' && s[i] <= '9') {
    const digit = s[i].charCodeAt(0) - 48;
    if (result > Math.floor(INT_MAX / 10) || 
       (result === Math.floor(INT_MAX / 10) && digit > 7)) {
      return sign === 1 ? INT_MAX : INT_MIN;
    }
    result = result * 10 + digit;
    i++;
  }
  return result * sign;
}`,
    tags: ['Strings', 'Math', 'Striver SDE Sheet'],
    examples: ['"42" -> 42', '"   -42" -> -42', '"4193 with words" -> 4193'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine a parser machine: sweep past whitespace, read a single sign post, pull in digits one by one, and sound an alarm if the gauge exceeds overflow bounds.',
    intuition: 'Manually parse the string: discard whitespace, record the sign, accumulate numerical digits, and guard against 32-bit signed integer overflow.',
    dryRun: 's = "   -42". i moves to 3. sign is -1. Read "4" -> result=4. Read "2" -> result=42. Non-digit stops loop. Return -42.',
    mistake: 'Using JS `parseInt` directly which doesn\'t strictly follow the 32-bit SDE specifications for boundaries.',
    prefer: 'Implement manual bounds-checking of `result > INT_MAX / 10` to handle overflows gracefully.'
  },
  {
    title: 'Z-Function',
    topic: 'Strings',
    difficulty: 'Hard' as const,
    complexity: 'O(N + M)',
    explanation: 'Find all occurrences of a pattern in a text using the Z-array algorithm.',
    code: `function zAlgorithm(text, pattern) {
  const concat = pattern + "$" + text;
  const L = concat.length;
  const Z = new Array(L).fill(0);
  let l = 0, r = 0;
  const result = [];
  for (let i = 1; i < L; i++) {
    if (i <= r) {
      Z[i] = Math.min(r - i + 1, Z[i - l]);
    }
    while (i + Z[i] < L && concat[Z[i]] === concat[i + Z[i]]) {
      Z[i]++;
    }
    if (i + Z[i] - 1 > r) {
      l = i;
      r = i + Z[i] - 1;
    }
  }
  for (let i = 0; i < L; i++) {
    if (Z[i] === pattern.length) {
      result.push(i - pattern.length - 1);
    }
  }
  return result;
}`,
    tags: ['Strings', 'Pattern Matching', 'Striver SDE Sheet'],
    examples: ['text = "baabaa", pattern = "aab" -> [1]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like scanning a sequence for replicas: remember the rightmost match segment (window [l, r]) to copy prefix metrics without re-checking.',
    intuition: 'Maintain a window [l, r] which is the rightmost substring that is also a prefix. Use previously computed Z-values to solve in linear time.',
    dryRun: 'concat = "aab$baabaa". Build Z-array using bounds l and r. Find values matching pattern length.',
    mistake: 'Failing to add a sentinel character (like "$") between pattern and text, leading to index spillover.',
    prefer: 'Use a special non-alphabet sentinel like "$" to separate pattern and text.'
  },
  {
    title: 'KMP Algorithm',
    topic: 'Strings',
    difficulty: 'Medium' as const,
    complexity: 'O(N + M)',
    explanation: 'Find the index of the first occurrence of a pattern in a text using Knuth-Morris-Pratt.',
    code: `function strStrKMP(text, pattern) {
  if (!pattern) return 0;
  const lps = buildLPS(pattern);
  let i = 0, j = 0;
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++; j++;
    }
    if (j === pattern.length) {
      return i - j;
    } else if (i < text.length && text[i] !== pattern[j]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  return -1;
}
function buildLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0, i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++; lps[i] = len; i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0; i++;
      }
    }
  }
  return lps;
}`,
    tags: ['Strings', 'Pattern Matching', 'Striver SDE Sheet'],
    examples: ['text = "sadbutsad", pattern = "sad" -> 0'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150'],
    analogy: 'Like reading a manual: if you hit a typo, don\'t restart from the first page; check the index to see how far back you need to flip.',
    intuition: 'Construct an LPS (Longest Prefix Suffix) array. This tracks lengths of identical prefixes and suffixes, helping bypass redundant comparisons.',
    dryRun: 'pattern = "sad". LPS = [0, 0, 0]. Text matching scans SAD, mismatches fall back via LPS pointers.',
    mistake: 'Failing to backtrack properly inside the LPS construction loop, leading to infinite loops.',
    prefer: 'Use `len = lps[len - 1]` inside the mismatch branch of both pattern and LPS construction.'
  },
  {
    title: 'Minimum characters to make palindrome',
    topic: 'Strings',
    difficulty: 'Hard' as const,
    complexity: 'O(N)',
    explanation: 'Find the minimum characters to add at the front of a string to make it a palindrome.',
    code: `function solveMinInsertions(s) {
  const rev = s.split("").reverse().join("");
  const concat = s + "$" + rev;
  const lps = new Array(concat.length).fill(0);
  let len = 0, i = 1;
  while (i < concat.length) {
    if (concat[i] === concat[len]) {
      len++; lps[i] = len; i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0; i++;
      }
    }
  }
  return s.length - lps[concat.length - 1];
}`,
    tags: ['Strings', 'Pattern Matching', 'Striver SDE Sheet'],
    examples: ['"AACECAAAA" -> 2 (add "AA" at front)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like creating a mirror reflection: find the longest palindromic prefix already present, and prepend the reverse of the remaining suffix.',
    intuition: 'We want to find the longest palindromic prefix. If we concatenate the string with its reverse separated by "$", the last LPS value gives the length of this palindromic prefix.',
    dryRun: 's = "ABC". rev = "CBA". concat = "ABC$CBA". LPS yields 1. Min characters needed = 3 - 1 = 2.',
    mistake: 'Using recursive DP which takes O(N^2) time and space, causing memory limits.',
    prefer: 'Apply the KMP LPS array trick to resolve insertions in O(N) time and space.'
  },
  {
    title: 'Check for Anagrams',
    topic: 'Strings',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Given two strings s and t, return true if t is an anagram of s.',
    code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (let i = 0; i < s.length; i++) {
    count[s[i]] = (count[s[i]] || 0) + 1;
    count[t[i]] = (count[t[i]] || 0) - 1;
  }
  for (const char in count) {
    if (count[char] !== 0) return false;
  }
  return true;
}`,
    tags: ['Strings', 'Hash Map', 'Striver SDE Sheet'],
    examples: ['s = "anagram", t = "nagaram" -> true', 's = "rat", t = "car" -> false'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Like auditing two inventories of letters: ensure that both boxes have exactly matching counts for every letter.',
    intuition: 'Count character frequencies in one pass. Add frequency for string s, subtract for string t. Every count must end at zero.',
    dryRun: 's="rat", t="car". count={r:1, a:0, t:1, c:-1}. Count contains non-zeroes -> false.',
    mistake: 'Sorting both strings, which costs O(N log N) time, when linear O(N) time is possible.',
    prefer: 'Use a single frequency Map or bucket array to count in linear time.'
  },
  {
    title: 'Count and Say',
    topic: 'Strings',
    difficulty: 'Medium' as const,
    complexity: 'O(N * M)',
    explanation: 'Generate the n-th term of the count-and-say sequence.',
    code: `function countAndSay(n) {
  let curr = "1";
  for (let i = 2; i <= n; i++) {
    let next = "", count = 1;
    for (let j = 0; j < curr.length; j++) {
      if (curr[j] === curr[j + 1]) {
        count++;
      } else {
        next += count.toString() + curr[j];
        count = 1;
      }
    }
    curr = next;
  }
  return curr;
}`,
    tags: ['Strings', 'Recursion', 'Striver SDE Sheet'],
    examples: ['n = 4 -> "1211" (say "1" -> "11" -> "21" -> "1211")'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like dictating numbers over a phone line: read out consecutive duplicates as "two 1s, one 2" etc.',
    intuition: 'Start with "1". Loop up to n. Scan the current string, counting identical adjacent characters, and construct the next string.',
    dryRun: 'n=3. start="1". n=2: count 1 -> "11". n=3: count two 1s -> "21". Returns "21".',
    mistake: 'Using nested recursion without memoization, leading to memory overheads.',
    prefer: 'Use iterative progression to manage state transitions cleanly.'
  },
  {
    title: 'Compare Version Numbers',
    topic: 'Strings',
    difficulty: 'Medium' as const,
    complexity: 'O(N + M)',
    explanation: 'Compare two version numbers version1 and version2.',
    code: `function compareVersion(version1, version2) {
  const v1 = version1.split("."), v2 = version2.split(".");
  const len = Math.max(v1.length, v2.length);
  for (let i = 0; i < len; i++) {
    const num1 = i < v1.length ? parseInt(v1[i]) : 0;
    const num2 = i < v2.length ? parseInt(v2[i]) : 0;
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }
  return 0;
}`,
    tags: ['Strings', 'Striver SDE Sheet'],
    examples: ['v1 = "1.01", v2 = "1.001" -> 0', 'v1 = "1.0", v2 = "1.0.0" -> 0'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine comparing release versions of software: pad shorter codes with zeros (e.g. 1.2 is equivalent to 1.2.0) and compare values.',
    intuition: 'Split both strings by ".". Iterate through the segments, convert them to integers (handling prepended zeros automatically), and compare.',
    dryRun: 'v1="1.01", v2="1.001". Split v1=["1", "01"], v2=["1", "001"]. Compare 1=1, then 1=1. Returns 0.',
    mistake: 'Comparing version segments as strings instead of integers (e.g. "01" vs "001"), which fails string comparisons.',
    prefer: 'Cast segments to numbers using `parseInt()` or `+` to ignore padded zeroes.'
  }
];
