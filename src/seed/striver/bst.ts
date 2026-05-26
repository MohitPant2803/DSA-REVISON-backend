export const STRIVER_BST_QUESTIONS = [
  {
    title: 'Populating Next Right Pointers',
    topic: 'Binary Search Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to NULL.',
    code: `function connect(root) {
  if (!root) return null;
  let leftMost = root;
  while (leftMost.left) {
    let head = leftMost;
    while (head) {
      head.left.next = head.right;
      if (head.next) {
        head.right.next = head.next.left;
      }
      head = head.next;
    }
    leftMost = leftMost.left;
  }
  return root;
}`,
    tags: ['Binary Trees', 'BFS', 'Striver SDE Sheet'],
    examples: ['Perfect binary tree -> nodes linked horizontally by next pointers'],
    sheets: ['Striver SDE Sheet', 'NeetCode 150'],
    analogy: 'Imagine multiple rows of workers: link each worker to the person sitting directly on their right, even if they are in different sub-teams.',
    intuition: 'Since it is a perfect binary tree, we can establish horizontal links (next pointers) on the current level, and use those links to easily connect children on the level below without extra space.',
    dryRun: 'Root linked to null. Row 1: head = root. Connect 1.left ("2") next = 1.right ("3"). Traverse down level by level.',
    mistake: 'Using a Queue which takes O(N) auxiliary space, violating the constant space constraint.',
    prefer: 'Use already established `next` pointers to traverse horizontally in O(1) space.'
  },
  {
    title: 'Search in a Binary Search Tree',
    topic: 'Binary Search Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(log N)',
    explanation: 'Find a node with a given value in a Binary Search Tree.',
    code: `function searchBST(root, val) {
  let curr = root;
  while (curr && curr.val !== val) {
    curr = val < curr.val ? curr.left : curr.right;
  }
  return curr;
}`,
    tags: ['Binary Search Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['val=2 in [4,2,7,1,3] -> [2,1,3]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like playing a guessing game: if target is smaller than current, search in the left room; if larger, search in the right room.',
    intuition: 'Use BST invariants. At each node, decide: if target is smaller, go left. If larger, go right. Stop when found or when hitting a null node.',
    dryRun: 's = 2, root = 4. 2 < 4 -> go left. Current becomes 2. Found! Return current node.',
    mistake: 'Using DFS/BFS without utilizing BST sorted properties, resulting in O(N) complexity.',
    prefer: 'Apply binary search principles to traverse tree levels in O(log N) time.'
  },
  {
    title: 'Convert Sorted Array to BST',
    topic: 'Binary Search Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Convert a sorted array into a height-balanced BST.',
    code: `function sortedArrayToBST(nums) {
  function solve(left, right) {
    if (left > right) return null;
    const mid = (left + right) >> 1;
    const node = new TreeNode(nums[mid]);
    node.left = solve(left, mid - 1);
    node.right = solve(mid + 1, right);
    return node;
  }
  return solve(0, nums.length - 1);
}`,
    tags: ['Binary Search Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[-10,-3,0,5,9] -> [0,-3,9,-10,null,5]'],
    sheets: ['Striver SDE Sheet', 'NeetCode 150'],
    analogy: 'Imagine constructing a balanced mobile hanging: always pick the middle book of a sorted pile to hang in the center, and repeat for the remaining piles.',
    intuition: 'To ensure height balance, choose the middle element of the active subarray as the root, and recursively construct its left and right children from the sub-segments.',
    dryRun: 'nums = [-10, -3, 0, 5, 9]. mid=2 (0) is root. Left subset [-10, -3] -> mid=-3 (left child). Right [5, 9] -> mid=9 (right child).',
    mistake: 'Picking non-midpoint indices as roots, resulting in skewed trees.',
    prefer: 'Use `(left + right) >> 1` to find midpoints and guarantee balance.'
  },
  {
    title: 'Construct BST from Preorder Traversal',
    topic: 'Binary Search Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Reconstruct a BST given its preorder traversal.',
    code: `function bstFromPreorder(preorder) {
  let i = 0;
  function solve(bound) {
    if (i === preorder.length || preorder[i] > bound) return null;
    const rootVal = preorder[i++];
    const root = new TreeNode(rootVal);
    root.left = solve(rootVal);
    root.right = solve(bound);
    return root;
  }
  return solve(Infinity);
}`,
    tags: ['Binary Search Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[8,5,1,7,10,12] -> [8,5,10,1,7,null,12]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like sorting mail dynamically: check if the envelope value fits within active bounds before placing it; if it exceeds, return to the sorting shelf.',
    intuition: 'Maintain a boundary limit for each recursion. A preorder node can only be placed as a left child if it is smaller than the parent, and as a right child if it is smaller than the grandparent\'s boundary.',
    dryRun: 'preorder = [8, 5, 1]. root=8 (bound=Infinity). Left child 5 (bound=8). Left-left 1 (bound=5). Sinks into place recursively.',
    mistake: 'Sorting the array and running inorder reconstruction, increasing complexity to O(N log N).',
    prefer: 'Use an upper boundary constraint (`bound`) to reconstruct the tree in a single O(N) pass.'
  },
  {
    title: 'Validate Binary Search Tree',
    topic: 'Binary Search Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Determine if a binary tree is a valid BST.',
    code: `function isValidBST(root) {
  function solve(node, min, max) {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return solve(node.left, min, node.val) && solve(node.right, node.val, max);
  }
  return solve(root, -Infinity, Infinity);
}`,
    tags: ['Binary Search Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[2,1,3] -> true', '[5,1,4,null,null,3,6] -> false'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine auditing a strict chain of command: every subordinate on the left must be strictly less than the boss, and everyone on the right must be strictly greater.',
    intuition: 'Maintain dynamic range limits [min, max] for each node. As we descend left, max becomes the parent value. As we descend right, min becomes the parent value.',
    dryRun: 'Validate [5,1,4]. Root 5. Left child 1 is inside [-Infinity, 5]. Right child 4 is not inside [5, Infinity] -> false.',
    mistake: 'Only checking local parent-child equality. A node deep inside a left branch could violate grandparent constraints.',
    prefer: 'Pass `min` and `max` constraints through recursion to check grandparent bounds.'
  },
  {
    title: 'Lowest Common Ancestor in a BST',
    topic: 'Binary Search Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(log N)',
    explanation: 'Find lowest common ancestor of two nodes in a BST.',
    code: `function lowestCommonAncestorBST(root, p, q) {
  let curr = root;
  while (curr) {
    if (p.val < curr.val && q.val < curr.val) {
      curr = curr.left;
    } else if (p.val > curr.val && q.val > curr.val) {
      curr = curr.right;
    } else {
      return curr;
    }
  }
  return null;
}`,
    tags: ['Binary Search Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['p=2, q=8 in [6,2,8,0,4,7,9] -> Node 6'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine two hikers searching for a meeting point: if both are on the west side, go west. If both are on the east side, go east. The first split node is their meeting point.',
    intuition: 'Use BST invariants. If both target values are smaller than the current node, their LCA must be in the left subtree. If both are larger, it is in the right subtree. The split node is the LCA.',
    dryRun: 'p=2, q=8, root=6. 2 < 6 and 8 > 6. Pointers split -> 6 is the LCA. Return 6.',
    mistake: 'Using general tree LCA recursion, which takes O(N) space, when O(1) space is possible.',
    prefer: 'Use an iterative loop to solve in O(1) auxiliary space.'
  },
  {
    title: 'Predecessor and Successor in BST',
    topic: 'Binary Search Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(log N)',
    explanation: 'Find the inorder predecessor and successor of a key in a BST.',
    code: `function findPreSuc(root, key) {
  let predecessor = null, successor = null;
  let curr = root;
  while (curr) {
    if (curr.val >= key) {
      curr = curr.left;
    } else {
      predecessor = curr; curr = curr.right;
    }
  }
  curr = root;
  while (curr) {
    if (curr.val <= key) {
      curr = curr.right;
    } else {
      successor = curr; curr = curr.left;
    }
  }
  return { predecessor, successor };
}`,
    tags: ['Binary Search Trees', 'Striver SDE Sheet'],
    examples: ['key=8 in [10,5,15,2,8,12,20] -> predecessor=5, successor=10'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine searching for neighboring properties on a street: predecessor is the nearest house on the left, and successor is the nearest house on the right.',
    intuition: 'To find the predecessor, search the tree: if the current node value is smaller than key, record it as a candidate predecessor and move right. To find the successor, do the opposite.',
    dryRun: 'Key=8. Left searches yield predecessor 5. Right searches yield successor 10.',
    mistake: 'Failing to handle missing keys, which breaks general BST iterator traversals.',
    prefer: 'Use independent binary search loops to resolve predecessor and successor in O(log N) time.'
  },
  {
    title: 'Floor in a BST',
    topic: 'Binary Search Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(log N)',
    explanation: 'Find the maximum value in a BST which is <= key.',
    code: `function floorBST(root, key) {
  let floor = -1;
  let curr = root;
  while (curr) {
    if (curr.val === key) return curr.val;
    if (curr.val > key) {
      curr = curr.left;
    } else {
      floor = curr.val; curr = curr.right;
    }
  }
  return floor;
}`,
    tags: ['Binary Search Trees', 'Striver SDE Sheet'],
    examples: ['key=6 in [8,4,12,2,6,10,14] -> 6'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like booking flights: find the closest flight that departs at or before your desired time.',
    intuition: 'Search the tree. If current node value is smaller than or equal to key, record it as the best candidate floor so far and move right to seek larger matches. If greater, move left.',
    dryRun: 'key=11. root=8 -> floor=8, move right. val=12 > 11 -> move left. val=10 -> floor=10. Return 10.',
    mistake: 'Pruning search paths early, missing closer floor values.',
    prefer: 'Record candidate values and continue searching to locate the closest match.'
  },
  {
    title: 'Ceil in a BST',
    topic: 'Binary Search Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(log N)',
    explanation: 'Find the minimum value in a BST which is >= key.',
    code: `function ceilBST(root, key) {
  let ceil = -1;
  let curr = root;
  while (curr) {
    if (curr.val === key) return curr.val;
    if (curr.val < key) {
      curr = curr.right;
    } else {
      ceil = curr.val; curr = curr.left;
    }
  }
  return ceil;
}`,
    tags: ['Binary Search Trees', 'Striver SDE Sheet'],
    examples: ['key=5 in [8,4,12,2,6,10,14] -> 6'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like buying clothes: find the smallest size available that fits at or above your measurements.',
    intuition: 'Search the tree. If current node value is greater than or equal to key, record it as a candidate ceil and move left to search for smaller matching values. Otherwise, move right.',
    dryRun: 'key=5. root=8 -> ceil=8, go left. val=4 < 5 -> go right. val=6 -> ceil=6. Return 6.',
    mistake: 'Failing to track ceiling candidates when moving left.',
    prefer: 'Record `ceil = curr.val` whenever traversing left.'
  },
  {
    title: 'Find K-th Smallest Element in BST',
    topic: 'Binary Search Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Find the K-th smallest element in a BST.',
    code: `function kthSmallest(root, k) {
  const stack = [];
  let curr = root;
  while (curr || stack.length > 0) {
    while (curr) {
      stack.push(curr); curr = curr.left;
    }
    curr = stack.pop();
    k--;
    if (k === 0) return curr.val;
    curr = curr.right;
  }
  return -1;
}`,
    tags: ['Binary Search Trees', 'Stack', 'Striver SDE Sheet'],
    examples: ['[3,1,4,null,2], k=1 -> 1'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine reading sorted files in drawers: pull out files in order, counting them, and stop exactly at index K.',
    intuition: 'Perform iterative inorder traversal. Since inorder visits BST nodes in sorted order, decrement K at each step and return the node value when K reaches 0.',
    dryRun: 'Inorder stack traversal. Pop elements 1, then 2. If K=1, return 1.',
    mistake: 'Storing all nodes in an array, violating the O(H) height space constraint.',
    prefer: 'Use an iterative stack to traverse and exit early when K reaches 0.'
  },
  {
    title: 'Find K-th Largest Element in BST',
    topic: 'Binary Search Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Find the K-th largest element in a BST.',
    code: `function kthLargest(root, k) {
  const stack = [];
  let curr = root;
  while (curr || stack.length > 0) {
    while (curr) {
      stack.push(curr); curr = curr.right; // right first!
    }
    curr = stack.pop();
    k--;
    if (k === 0) return curr.val;
    curr = curr.left;
  }
  return -1;
}`,
    tags: ['Binary Search Trees', 'Stack', 'Striver SDE Sheet'],
    examples: ['[3,1,4,null,2], k=1 -> 4'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Similar to finding the K-th smallest, but we read the bookshelf from right to left to count largest elements first.',
    intuition: 'Perform reverse inorder traversal (Right, Root, Left). Decrement K at each step and return the node value when K reaches 0.',
    dryRun: 'Reverse inorder traversal. Pop elements in descending order. Return matching node.',
    mistake: 'Iterating through the entire tree when early exit is possible.',
    prefer: 'Use reverse inorder stack traversal with early termination.'
  },
  {
    title: 'Two Sum IV - Input is a BST',
    topic: 'Binary Search Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Find if there exist two elements in a BST that sum to target.',
    code: `class BSTIteratorDirectional {
  constructor(root, isReverse) {
    this.stack = []; this.isReverse = isReverse; this.pushAll(root);
  }
  next() {
    const node = this.stack.pop();
    if (!this.isReverse) this.pushAll(node.right);
    else this.pushAll(node.left);
    return node.val;
  }
  pushAll(node) {
    let curr = node;
    while (curr) {
      this.stack.push(curr);
      curr = !this.isReverse ? curr.left : curr.right;
    }
  }
}
function findTarget(root, k) {
  if (!root) return false;
  const l = new BSTIteratorDirectional(root, false);
  const r = new BSTIteratorDirectional(root, true);
  let left = l.next(), right = r.next();
  while (left < right) {
    const sum = left + right;
    if (sum === k) return true;
    if (sum < k) left = l.next();
    else right = r.next();
  }
  return false;
}`,
    tags: ['Binary Search Trees', 'Two Pointers', 'Striver SDE Sheet'],
    examples: ['target=9 in [5,3,6,2,4,null,7] -> true (2 + 7 = 9)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine searching from both ends of a sorted line: advance the left pointer if the sum is too small, and pull the right pointer back if the sum is too large.',
    intuition: 'Maintain two BST iterators: one traversing in-order (smallest to largest) and one traversing reverse in-order (largest to smallest). Apply two-pointer matching.',
    dryRun: 'Iterators initialized. left=2, right=7. sum=9 -> matches target! Return true.',
    mistake: 'Failing to implement O(H) height space iterators, using full array copies instead.',
    prefer: 'Use directional BST iterators to solve in O(H) auxiliary space.'
  },
  {
    title: 'BST Iterator',
    topic: 'Binary Search Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(1) average',
    explanation: 'Design an iterator over a BST that represents in-order traversal.',
    code: `class BSTIterator {
  constructor(root) {
    this.stack = []; this.pushAll(root);
  }
  next() {
    const node = this.stack.pop();
    this.pushAll(node.right);
    return node.val;
  }
  hasNext() {
    return this.stack.length > 0;
  }
  pushAll(node) {
    let curr = node;
    while (curr) {
      this.stack.push(curr); curr = curr.left;
    }
  }
}`,
    tags: ['Binary Search Trees', 'Design', 'Striver SDE Sheet'],
    examples: ['Instantiate iterator -> next() returns smallest -> hasNext() checks status'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150'],
    analogy: 'Like keeping a bookmark in a book: resolve reading left pages completely, and only bookmark right pages as you encounter them.',
    intuition: 'Use a stack to simulate recursion. Initialize by pushing the root and all its left children. Popping a node yields the next smallest, and we push its right subtree.',
    dryRun: 'Push left nodes. Pop node -> return val. Add right children of popped node onto stack.',
    mistake: 'Storing all tree nodes in an array during initialization, violating O(H) space boundaries.',
    prefer: 'Push only left branches onto the stack to maintain O(H) space.'
  },
  {
    title: 'Size of Largest BST in a Binary Tree',
    topic: 'Binary Search Trees',
    difficulty: 'Hard' as const,
    complexity: 'O(N)',
    explanation: 'Find the size of the largest BST present inside a Binary Tree.',
    code: `function largestBSTSubtree(root) {
  function solve(node) {
    if (!node) return { size: 0, min: Infinity, max: -Infinity, isBST: true };
    const left = solve(node.left);
    const right = solve(node.right);
    if (left.isBST && right.isBST && node.val > left.max && node.val < right.min) {
      const minVal = node.left ? left.min : node.val;
      const maxVal = node.right ? right.max : node.val;
      return {
        size: left.size + right.size + 1,
        min: minVal,
        max: maxVal,
        isBST: true
      };
    }
    return {
      size: Math.max(left.size, right.size),
      min: -Infinity,
      max: Infinity,
      isBST: false
    };
  }
  return solve(root).size;
}`,
    tags: ['Binary Search Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['Tree [10,5,15,1,8,null,7] -> 3 (subtree centered at 5)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine auditing departments inside a company: verify if sub-departments are fully compliant; if both are, calculate combined size. If not, forward the largest compliant size.',
    intuition: 'Post-order traversal. For each node, recursively gather size, minimum, and maximum boundaries from subtrees. A node forms a valid BST if it is greater than left max and smaller than right min.',
    dryRun: 'Recursively verify child states. Leaves return valid. Parent nodes audit bounds and calculate cumulative sizes.',
    mistake: 'Checking validity independently at each node, resulting in O(N^2) complexity.',
    prefer: 'Use post-order traversal to gather bounds and sizes in a single O(N) pass.'
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    topic: 'Binary Search Trees',
    difficulty: 'Hard' as const,
    complexity: 'O(N)',
    explanation: 'Design an algorithm to serialize and deserialize a binary tree.',
    code: `function serialize(root) {
  if (!root) return "null";
  const res = [];
  const q = [root];
  while (q.length > 0) {
    const node = q.shift();
    if (node) {
      res.push(node.val);
      q.push(node.left); q.push(node.right);
    } else {
      res.push("null");
    }
  }
  return res.join(",");
}
function deserialize(data) {
  if (data === "null") return null;
  const vals = data.split(",");
  const root = new TreeNode(parseInt(vals[0]));
  const q = [root];
  let i = 1;
  while (q.length > 0 && i < vals.length) {
    const node = q.shift();
    if (vals[i] !== "null") {
      node.left = new TreeNode(parseInt(vals[i]));
      q.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== "null") {
      node.right = new TreeNode(parseInt(vals[i]));
      q.push(node.right);
    }
    i++;
  }
  return root;
}`,
    tags: ['Binary Trees', 'Design', 'Striver SDE Sheet'],
    examples: ['Serialize tree -> returns csv string -> deserialize reconstructs tree'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150'],
    analogy: 'Imagine shipping a delicate wooden sculpture: flatten it row-by-row into a packaged box with labels for empty nodes, and rebuild it sequentially upon unpacking.',
    intuition: 'Use Level-Order BFS. Serialize by writing values (and "null" for empty children) to a string. Deserialize by reading tokens and linking nodes using a queue.',
    dryRun: 'Serialize: node 1 -> left child 2, right 3 -> "1,2,3,null,null,null,null". Rebuild dynamically using queue lookups.',
    mistake: 'Failing to handle empty or single-node edge boundaries, resulting in crash errors.',
    prefer: 'Use commas as delimiters and "null" as a sentinel value for empty branches.'
  }
];
export class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}
