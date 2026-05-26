export const STRIVER_BINARY_TREES_QUESTIONS = [
  {
    title: 'Inorder Traversal',
    topic: 'Binary Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Perform inorder traversal (Left, Root, Right) of a Binary Tree.',
    code: `function inorderTraversal(root) {
  const res = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    res.push(node.val);
    traverse(node.right);
  }
  traverse(root); return res;
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[1,null,2,3] -> [1,3,2]'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150'],
    analogy: 'Imagine touring a structured garden: explore the left greenhouse completely, then admire the centerpiece, and then tour the right greenhouse.',
    intuition: 'Recursive traversal: visit the left subtree, record the current node value, and then visit the right subtree.',
    dryRun: 'Trace a small tree: visit left branch, pop values into result array, print current node, recurse right branch.',
    mistake: 'Failing to handle null nodes, causing execution crashes.',
    prefer: 'Check `if (!node) return` as the base case.'
  },
  {
    title: 'Preorder Traversal',
    topic: 'Binary Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Perform preorder traversal (Root, Left, Right) of a Binary Tree.',
    code: `function preorderTraversal(root) {
  const res = [];
  function traverse(node) {
    if (!node) return;
    res.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }
  traverse(root); return res;
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[1,null,2,3] -> [1,2,3]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like introducing yourself at a party: announce your name first, then introduce the friend on your left, and then the friend on your right.',
    intuition: 'Process the root node immediately before descending recursively to the left and right subtrees.',
    dryRun: 'Process root. Recurse left node, process it, recurse down till leaf, then process right nodes.',
    mistake: 'Forgetting L-R order inside traversal steps.',
    prefer: 'Always execute `traverse(node.left)` before `traverse(node.right)`.'
  },
  {
    title: 'Postorder Traversal',
    topic: 'Binary Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Perform postorder traversal (Left, Right, Root) of a Binary Tree.',
    code: `function postorderTraversal(root) {
  const res = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    res.push(node.val);
  }
  traverse(root); return res;
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[1,null,2,3] -> [3,2,1]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like wrapping up a project: let the left team finish, then the right team, and only then compile the final report.',
    intuition: 'Recurse fully down left and right subtrees, processing child levels before recording the current parent node.',
    dryRun: 'Traverse left, traverse right, add current node to the end of the results list.',
    mistake: 'Storing values before subtrees are resolved, resulting in a preorder layout.',
    prefer: 'Add current node value to result array only AFTER recursive child calls are completed.'
  },
  {
    title: 'Left View of Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Find the nodes visible from the left side of a Binary Tree.',
    code: `function leftView(root) {
  const res = [];
  function traverse(node, level) {
    if (!node) return;
    if (level === res.length) res.push(node.val);
    traverse(node.left, level + 1);
    traverse(node.right, level + 1);
  }
  traverse(root, 0); return res;
}`,
    tags: ['Binary Trees', 'Striver SDE Sheet'],
    examples: ['Tree [1,2,3,null,4] -> [1,2,4]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine looking at a building from the far left: you can only see the very first window on each floor because it blocks the windows behind it.',
    intuition: 'Recursively perform preorder traversal (Left before Right). Record the node value of the first node encountered at each level (when `level === result.length`).',
    dryRun: 'Level 0: record 1. Level 1: record 2 (left of 1). Level 2: record 4 (left child of 2). Return [1,2,4].',
    mistake: 'Failing to track levels, resulting in printing incorrect depth nodes.',
    prefer: 'Pass `level` as a recursion parameter and check `level === res.length` to isolate left-most nodes.'
  },
  {
    title: 'Bottom View of Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N log N)',
    explanation: 'Find the nodes visible from the bottom view of a Binary Tree.',
    code: `function bottomView(root) {
  if (!root) return [];
  const map = new Map(); // horizontal distance -> val
  const q = [[root, 0]];
  let minCol = 0, maxCol = 0;
  while (q.length > 0) {
    const [node, col] = q.shift();
    map.set(col, node.val);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    if (node.left) q.push([node.left, col - 1]);
    if (node.right) q.push([node.right, col + 1]);
  }
  const res = [];
  for (let i = minCol; i <= maxCol; i++) {
    if (map.has(i)) res.push(map.get(i));
  }
  return res;
}`,
    tags: ['Binary Trees', 'BFS', 'Striver SDE Sheet'],
    examples: ['Tree [1,2,3,4,5,6,7] -> [4,2,6,3,7]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine columns of shadows cast by trees: nodes at identical coordinates overwrite each other, and only the lowest node is visible from the ground.',
    intuition: 'Use Breadth-First Search (BFS) to track horizontal distances (columns). For each column, overwrite values progressively; the last node processed is the bottom-most.',
    dryRun: 'Nodes processed column-by-column. BFS records column coordinates and yields bottom nodes.',
    mistake: 'Using DFS, which doesn\'t process level-by-level, leading to incorrect bottom-most selections.',
    prefer: 'Use Queue-based BFS to process nodes from top to bottom.'
  },
  {
    title: 'Top View of Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N log N)',
    explanation: 'Find the nodes visible from the top view of a Binary Tree.',
    code: `function topView(root) {
  if (!root) return [];
  const map = new Map();
  const q = [[root, 0]];
  let minCol = 0, maxCol = 0;
  while (q.length > 0) {
    const [node, col] = q.shift();
    if (!map.has(col)) map.set(col, node.val);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    if (node.left) q.push([node.left, col - 1]);
    if (node.right) q.push([node.right, col + 1]);
  }
  const res = [];
  for (let i = minCol; i <= maxCol; i++) {
    if (map.has(i)) res.push(map.get(i));
  }
  return res;
}`,
    tags: ['Binary Trees', 'BFS', 'Striver SDE Sheet'],
    examples: ['Tree [1,2,3,4,5,6,7] -> [4,2,1,3,7]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Similar to bottom view, but you look from the sky: the first node placed in any vertical column blocks all lower nodes in that column.',
    intuition: 'Perform BFS and map horizontal columns. Only record the node value if the column has not been visited yet.',
    dryRun: 'Level-by-level traversal. Col 0 gets 1. Left child gets col -1 (value 2). Right gets col 1. Columns are locked in.',
    mistake: 'Overwriting earlier keys, which behaves like bottom view.',
    prefer: 'Only write to the map if the key `!map.has(col)` is true.'
  },
  {
    title: 'Preorder Inorder Postorder in Single Traversal',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Perform preorder, inorder, and postorder traversals in a single pass.',
    code: `function allTraversals(root) {
  if (!root) return [];
  const pre = [], inOrd = [], post = [];
  const stack = [[root, 1]];
  while (stack.length > 0) {
    const it = stack[stack.length - 1];
    if (it[1] === 1) {
      pre.push(it[0].val); it[1]++;
      if (it[0].left) stack.push([it[0].left, 1]);
    } else if (it[1] === 2) {
      inOrd.push(it[0].val); it[1]++;
      if (it[0].right) stack.push([it[0].right, 1]);
    } else {
      post.push(it[0].val); stack.pop();
    }
  }
  return { pre, inOrd, post };
}`,
    tags: ['Binary Trees', 'Stack', 'Striver SDE Sheet'],
    examples: ['Standard binary tree -> returns all three traversal arrays'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine a tour guide taking notes on three separate lists: write a node on the checklist when entering, in the notebook when turning, and on the invoice when leaving.',
    intuition: 'Use an iterative stack tracking states (1: Preorder, 2: Inorder, 3: Postorder). Push, modify state, and pop accordingly to process in one pass.',
    dryRun: 'Process nodes using state transitions on stack. Pop elements and populate results.',
    mistake: 'Failing to increment state counters inside the stack nodes, leading to infinite loops.',
    prefer: 'Explicitly increment `it[1]++` state counter on each transition.'
  },
  {
    title: 'Level Order Traversal',
    topic: 'Binary Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Perform level-by-level traversal of a Binary Tree.',
    code: `function levelOrder(root) {
  if (!root) return [];
  const res = [], q = [root];
  while (q.length > 0) {
    const size = q.length, level = [];
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(level);
  }
  return res;
}`,
    tags: ['Binary Trees', 'BFS', 'Striver SDE Sheet'],
    examples: ['[3,9,20,null,null,15,7] -> [[3],[9,20],[15,7]]'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Like scanning a document from top to bottom, reading line-by-line before moving down.',
    intuition: 'Use a Queue. Record the queue size at the start of each level loop. This ensures we process exactly one tree level per iteration.',
    dryRun: 'Root in queue. size=1 -> level=[3]. Push children 9, 20. Next level size=2 -> level=[9, 20].',
    mistake: 'Forgetting to lock in the level size `q.length` at the start of the loop, causing the loop to consume children on the same level.',
    prefer: 'Store `size = q.length` before starting the level traversal loop.'
  },
  {
    title: 'Vertical Order Traversal',
    topic: 'Binary Trees',
    difficulty: 'Hard' as const,
    complexity: 'O(N log N)',
    explanation: 'Perform vertical order traversal of a Binary Tree.',
    code: `function verticalTraversal(root) {
  if (!root) return [];
  const nodes = []; // holds { col, row, val }
  function dfs(node, col, row) {
    if (!node) return;
    nodes.push({ col, row, val: node.val });
    dfs(node.left, col - 1, row + 1);
    dfs(node.right, col + 1, row + 1);
  }
  dfs(root, 0, 0);
  nodes.sort((a, b) => {
    if (a.col !== b.col) return a.col - b.col;
    if (a.row !== b.row) return a.row - b.row;
    return a.val - b.val;
  });
  const res = [];
  let currCol = null, currList = [];
  for (const n of nodes) {
    if (currCol === null || n.col !== currCol) {
      if (currList.length > 0) res.push(currList);
      currCol = n.col; currList = [n.val];
    } else {
      currList.push(n.val);
    }
  }
  if (currList.length > 0) res.push(currList);
  return res;
}`,
    tags: ['Binary Trees', 'DFS', 'Striver SDE Sheet'],
    examples: ['[3,9,20,null,null,15,7] -> [[9],[3,15],[20],[7]]'],
    sheets: ['Striver SDE Sheet', 'NeetCode 150'],
    analogy: 'Like sorting files into vertical slots: arrange them by slot, then by drawer index, and sort alphabetically if they overlap.',
    intuition: 'Collect nodes with their row and column coordinates. Sort them first by column, then by row, and by value as a tie-breaker.',
    dryRun: 'Run DFS, gather coordinates, sort the coordinate structures, and group by column.',
    mistake: 'Failing to sort overlapping nodes at identical row/column coordinates, violating SDE guidelines.',
    prefer: 'Use a strict comparator: sort by `col` first, then `row`, then `val`.'
  },
  {
    title: 'Root to Node Path',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Find the path from root to a target node in a Binary Tree.',
    code: `function getPath(root, target) {
  const path = [];
  function solve(node) {
    if (!node) return false;
    path.push(node.val);
    if (node.val === target) return true;
    if (solve(node.left) || solve(node.right)) return true;
    path.pop(); // backtrack
    return false;
  }
  solve(root); return path;
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['target=7 in [1,2,3,null,null,6,7] -> [1,3,7]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine navigating a maze: trace your steps, and rewind (erase) your markings whenever you hit a dead-end.',
    intuition: 'Use backtracking. Push the current node onto the path. If it matches target or its children lead to the target, return true. Otherwise, pop it and return false.',
    dryRun: 'Start at 1. Recurse down. Target 7 not in left. Go right. Found at 7. Path is [1, 3, 7].',
    mistake: 'Failing to pop the node from the path array when backtracking, leaving orphaned dead-end nodes in the path.',
    prefer: 'Call `path.pop()` to clean up states on dead-ends.'
  },
  {
    title: 'Maximum Width of Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Find the maximum width of a Binary Tree (maximum nodes between end-points per level).',
    code: `function widthOfBinaryTree(root) {
  if (!root) return 0;
  let maxWidth = 0;
  const q = [[root, 0n]];
  while (q.length > 0) {
    const size = q.length;
    let first = 0n, last = 0n;
    for (let i = 0; i < size; i++) {
      const [node, id] = q.shift();
      if (i === 0) first = id;
      if (i === size - 1) last = id;
      const normalizedId = id - first;
      if (node.left) q.push([node.left, normalizedId * 2n]);
      if (node.right) q.push([node.right, normalizedId * 2n + 1n]);
    }
    const width = Number(last - first + 1n);
    maxWidth = Math.max(maxWidth, width);
  }
  return maxWidth;
}`,
    tags: ['Binary Trees', 'BFS', 'Striver SDE Sheet'],
    examples: ['[1,3,2,5,3,null,9] -> 4 (width between 5 and 9)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine measuring the span of a suspension bridge: find the distance between the leftmost and rightmost support cables on each level.',
    intuition: 'Index nodes binary-tree style: left child = `2 * index`, right child = `2 * index + 1`. Subtract the first node\'s index at each level to prevent integer overflow.',
    dryRun: 'Breadth-first search using BigInt indices. Calculate width at each level and normalize indices to 0.',
    mistake: 'Failing to handle index overflow on deep, skewed trees.',
    prefer: 'Use BigInt (`BigInt` / `0n`) indices and subtract `first` to keep numbers small.'
  },
  {
    title: 'Zig-Zag Level Order Traversal',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Perform level order traversal in a zig-zag pattern.',
    code: `function zigzagLevelOrder(root) {
  if (!root) return [];
  const res = [], q = [root];
  let leftToRight = true;
  while (q.length > 0) {
    const size = q.length, level = new Array(size);
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      const idx = leftToRight ? i : size - 1 - i;
      level[idx] = node.val;
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(level); leftToRight = !leftToRight;
  }
  return res;
}`,
    tags: ['Binary Trees', 'BFS', 'Striver SDE Sheet'],
    examples: ['[3,9,20,null,null,15,7] -> [[3],[20,9],[15,7]]'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine a gardener watering plants row-by-row, alternating walking direction left-to-right and right-to-left.',
    intuition: 'Standard level-order BFS, but we insert elements into a pre-allocated level array starting from either the front or the back based on our direction flag.',
    dryRun: 'First level L-R -> [3]. Second level R-L -> insert 20, then 9 at back -> [20, 9]. Alternates.',
    mistake: 'Reversing lists iteratively, which is computationally expensive.',
    prefer: 'Pre-allocate the level array size and assign indices directly using `size - 1 - i`.'
  },
  {
    title: 'Height of Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Calculate the maximum depth (height) of a Binary Tree.',
    code: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[3,9,20,null,null,15,7] -> 3'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine climbing down a cave: your total depth is one step plus the depth of the deepest branch you choose.',
    intuition: 'Base case is 0 for null nodes. Recursively compute left and right subtree heights, and return the maximum height plus 1.',
    dryRun: 'Null node yields 0. Leaf node returns 1 + max(0, 0) = 1. Propagates up.',
    mistake: 'Failing to add the +1 for the current parent node.',
    prefer: 'Use `1 + Math.max(left, right)` to calculate depth.'
  },
  {
    title: 'Diameter of Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Find the length of the longest path between any two nodes in a tree.',
    code: `function diameterOfBinaryTree(root) {
  let diameter = 0;
  function depth(node) {
    if (!node) return 0;
    const left = depth(node.left);
    const right = depth(node.right);
    diameter = Math.max(diameter, left + right);
    return 1 + Math.max(left, right);
  }
  depth(root); return diameter;
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[1,2,3,4,5] -> 3 (path 4 -> 2 -> 1 -> 3)'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Like finding the longest scenic route in a park: it is the sum of the longest paths leading to a major intersection node.',
    intuition: 'The diameter at a node is the sum of the heights of its left and right subtrees. Compute depth recursively and update global diameter on-the-fly.',
    dryRun: 'Calculate depth at leaf nodes. At root, left depth is 2, right is 1. Diameter = 2 + 1 = 3.',
    mistake: 'Calculating height separately at each node, resulting in a suboptimal O(N^2) complexity.',
    prefer: 'Compute height recursively and update the global diameter in a single pass to achieve O(N) time.'
  },
  {
    title: 'Check if Binary Tree is Balanced',
    topic: 'Binary Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Determine if the height of left and right subtrees at any node differs by at most 1.',
    code: `function isBalanced(root) {
  function check(node) {
    if (!node) return 0;
    const left = check(node.left);
    if (left === -1) return -1;
    const right = check(node.right);
    if (right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  }
  return check(root) !== -1;
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[3,9,20,null,null,15,7] -> true'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine a scale balancing blocks: if at any step one side weighs significantly more than the other, the scale tips over (returns -1).',
    intuition: 'Compute node height recursively. If the height difference at any node exceeds 1, propagate a sentinel value (-1) up the recursion stack immediately.',
    dryRun: 'Recursively verify child balances. Symmetrical subtrees return valid heights. Skewed subtrees trigger -1.',
    mistake: 'Running separate height queries, resulting in O(N^2) time complexity.',
    prefer: 'Use -1 as a failure sentinel to prune search paths immediately.'
  },
  {
    title: 'Lowest Common Ancestor in a Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Find the lowest common ancestor (LCA) node of two given nodes in a Binary Tree.',
    code: `function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['p=5, q=1 in [3,5,1,6,2,0,8] -> Node 3'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine tracing family trees upward: the LCA is the first intersection point where family branches merge.',
    intuition: 'Recursively search left and right subtrees. If a node matches p or q, return it. If a node receives valid search results from both subtrees, it is their LCA.',
    dryRun: 'Search left subtree (finds p) and right subtree (finds q). Root returns itself as the LCA.',
    mistake: 'Scanning the entire tree even after finding both nodes.',
    prefer: 'Return search results immediately when matching `root === p || root === q`.'
  },
  {
    title: 'Check if Two Trees are Identical',
    topic: 'Binary Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Verify if two binary trees are structurally identical and have matching values.',
    code: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q) return false;
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['p=[1,2,3], q=[1,2,3] -> true'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Like scanning two blueprints side-by-side: at each junction, confirm both have matching layout structures and values.',
    intuition: 'Verify root values. Recursively check if left subtrees are identical and right subtrees are identical.',
    dryRun: 'Compare root nodes. Check left and right subtrees recursively. If all match, return true.',
    mistake: 'Failing to check null boundaries, leading to crash errors.',
    prefer: 'Use `if (!p || !q) return false` after verifying both are not null.'
  },
  {
    title: 'Boundary Traversal of Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Perform anti-clockwise boundary traversal of a Binary Tree.',
    code: `function boundaryTraversal(root) {
  if (!root) return [];
  const res = [];
  if (!isLeaf(root)) res.push(root.val);
  addLeftBoundary(root.left, res);
  addLeaves(root, res);
  addRightBoundary(root.right, res);
  return res;
}
function isLeaf(node) {
  return !node.left && !node.right;
}
function addLeftBoundary(node, res) {
  let curr = node;
  while (curr) {
    if (!isLeaf(curr)) res.push(curr.val);
    curr = curr.left ? curr.left : curr.right;
  }
}
function addLeaves(node, res) {
  if (!node) return;
  if (isLeaf(node)) { res.push(node.val); return; }
  addLeaves(node.left, res);
  addLeaves(node.right, res);
}
function addRightBoundary(node, res) {
  let curr = node;
  const temp = [];
  while (curr) {
    if (!isLeaf(curr)) temp.push(curr.val);
    curr = curr.right ? curr.right : curr.left;
  }
  while (temp.length > 0) res.push(temp.pop()); // reverse
}`,
    tags: ['Binary Trees', 'Striver SDE Sheet'],
    examples: ['Tree [1,2,3,4,5] -> [1,2,4,5,3]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine wrapping a rope around a tree: slide down the left side, trace along the roots (leaves) at the bottom, and climb up the right side.',
    intuition: 'Decompose traversal: 1. Add left boundary (excluding leaf nodes). 2. Add leaf nodes using DFS. 3. Add right boundary in reverse (excluding leaf nodes).',
    dryRun: 'Build left boundary [1, 2]. Add leaves [4, 5]. Add right boundary reversed [3]. Yields [1, 2, 4, 5, 3].',
    mistake: 'Including leaf nodes inside boundary lists, which duplicates them in the output.',
    prefer: 'Use `!isLeaf(node)` checks during boundary builds to prevent duplication.'
  },
  {
    title: 'Binary Tree Maximum Path Sum',
    topic: 'Binary Trees',
    difficulty: 'Hard' as const,
    complexity: 'O(N)',
    explanation: 'Find the maximum path sum between any two nodes in a tree.',
    code: `function maxPathSum(root) {
  let maxVal = -Infinity;
  function solve(node) {
    if (!node) return 0;
    const left = Math.max(0, solve(node.left));
    const right = Math.max(0, solve(node.right));
    maxVal = Math.max(maxVal, node.val + left + right);
    return node.val + Math.max(left, right);
  }
  solve(root); return maxVal;
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[-10,9,20,null,null,15,7] -> 42 (path 15 -> 20 -> 7)'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Like finding the highest earning path through branching routes: choose whether to merge branches at the current node, or carry only the highest single branch up.',
    intuition: 'Compute the maximum single-branch path sum recursively. Prune negative path sums by using `Math.max(0, path)`. Update global maximum path sum at each node.',
    dryRun: 'Leaf node 15 returns 15. Leaf 7 returns 7. At 20, maxPath = 20 + 15 + 7 = 42. Returns 20 + 15 = 35. Global max updated to 42.',
    mistake: 'Failing to handle negative nodes correctly, returning wrong paths.',
    prefer: 'Use `Math.max(0, branchSum)` to safely discard negative branches.'
  },
  {
    title: 'Construct Binary Tree from Inorder and Preorder',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Reconstruct a binary tree given its inorder and preorder traversals.',
    code: `function buildTree(preorder, inorder) {
  const map = new Map();
  for (let i = 0; i < inorder.length; i++) {
    map.set(inorder[i], i);
  }
  let preIdx = 0;
  function solve(left, right) {
    if (left > right) return null;
    const rootVal = preorder[preIdx++];
    const root = new TreeNode(rootVal);
    const inIdx = map.get(rootVal);
    root.left = solve(left, inIdx - 1);
    root.right = solve(inIdx + 1, right);
    return root;
  }
  return solve(0, inorder.length - 1);
}`,
    tags: ['Binary Trees', 'Sorting', 'Striver SDE Sheet'],
    examples: ['preorder=[3,9,20], inorder=[9,3,20] -> [3,9,20]'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150'],
    analogy: 'Like assembling a puzzle: preorder tells you the centerpiece to place, and inorder tells you which pieces belong to its left and right sides.',
    intuition: 'Preorder tells us the next root node. Inorder tells us the boundary dividing the left and right subtrees. Use a Hash Map to look up indexes quickly.',
    dryRun: 'Root is 3. Index of 3 in inorder splits it into left=[9] and right=[20]. Build subtrees.',
    mistake: 'Using `indexOf` inside recursive loops, increasing complexity to O(N^2).',
    prefer: 'Use a pre-populated Hash Map of the inorder array to retrieve index lookups in O(1).'
  },
  {
    title: 'Construct Binary Tree from Inorder and Postorder',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Reconstruct a binary tree given its inorder and postorder traversals.',
    code: `function buildTree(inorder, postorder) {
  const map = new Map();
  for (let i = 0; i < inorder.length; i++) {
    map.set(inorder[i], i);
  }
  let postIdx = postorder.length - 1;
  function solve(left, right) {
    if (left > right) return null;
    const rootVal = postorder[postIdx--];
    const root = new TreeNode(rootVal);
    const inIdx = map.get(rootVal);
    root.right = solve(inIdx + 1, right); // right first!
    root.left = solve(left, inIdx - 1);
    return root;
  }
  return solve(0, inorder.length - 1);
}`,
    tags: ['Binary Trees', 'Sorting', 'Striver SDE Sheet'],
    examples: ['inorder=[9,3,15,20,7], postorder=[9,15,7,20,3] -> [3,9,20,null,null,15,7]'],
    sheets: ['Striver SDE Sheet', 'NeetCode 150'],
    analogy: 'Similar to preorder construction, but we read postorder backwards, which yields root nodes starting from the right side.',
    intuition: 'Postorder read backwards gives roots. Because roots are encountered from right to left, we must construct the right subtree before the left.',
    dryRun: 'Root is 3. Split inorder boundary. Recursively construct the right subtree, then the left subtree.',
    mistake: 'Constructing the left subtree before the right subtree, which breaks index ordering.',
    prefer: 'Build the right subtree first (`root.right = ...`) when reading postorder backwards.'
  },
  {
    title: 'Symmetric Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Easy' as const,
    complexity: 'O(N)',
    explanation: 'Check if a binary tree is a mirror of itself.',
    code: `function isSymmetric(root) {
  if (!root) return true;
  function isMirror(t1, t2) {
    if (!t1 && !t2) return true;
    if (!t1 || !t2) return false;
    return t1.val === t2.val && 
           isMirror(t1.left, t2.right) && 
           isMirror(t1.right, t2.left);
  }
  return isMirror(root.left, root.right);
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['[1,2,2,3,4,4,3] -> true'],
    sheets: ['Striver SDE Sheet', 'NeetCode 150'],
    analogy: 'Imagine folding a drawing of a tree in half: check that every node on the left aligns perfectly with its mirrored counterpart on the right.',
    intuition: 'A tree is symmetric if its left and right subtrees are mirror images. Recursively compare `left.left` with `right.right`, and `left.right` with `right.left`.',
    dryRun: 'Compare roots of subtrees. Verify symmetric paths recursively. If all align, return true.',
    mistake: 'Comparing `left.left` with `right.left`, which checks for equality, not symmetry.',
    prefer: 'Always check mirrored children: `isMirror(t1.left, t2.right)`.'
  },
  {
    title: 'Flatten Binary Tree to Linked List',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Flatten a binary tree into a single-right-linked list in-place.',
    code: `function flatten(root) {
  let curr = root;
  while (curr) {
    if (curr.left) {
      let prev = curr.left;
      while (prev.right) prev = prev.right;
      prev.right = curr.right;
      curr.right = curr.left;
      curr.left = null;
    }
    curr = curr.right;
  }
}`,
    tags: ['Binary Trees', 'Two Pointers', 'Striver SDE Sheet'],
    examples: ['[1,2,5,3,4,null,6] -> [1,null,2,null,3,null,4,null,5,null,6]'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150'],
    analogy: 'Imagine reshaping a family tree: shift the left branch to the right side, and link the original right branch to the end of the shifted segment.',
    intuition: 'Morris Traversal. For each node with a left child, find its inorder predecessor (rightmost node in left subtree). Connect its right child to the predecessor, and shift.',
    dryRun: 'Find rightmost child of left subtree (4). Set 4.right = 5. Set 1.right = 2, 1.left = null. Repeat.',
    mistake: 'Using recursion which requires O(N) stack memory, violating in-place constraints.',
    prefer: 'Use Morris Traversal with pointers to flatten in O(1) auxiliary space.'
  },
  {
    title: 'Check for Children Sum Property',
    topic: 'Binary Trees',
    difficulty: 'Medium' as const,
    complexity: 'O(N)',
    explanation: 'Modify a binary tree so that every node\'s value equals the sum of its children\'s values.',
    code: `function changeTree(root) {
  if (!root) return;
  let childSum = 0;
  if (root.left) childSum += root.left.val;
  if (root.right) childSum += root.right.val;
  if (childSum >= root.val) {
    root.val = childSum;
  } else {
    if (root.left) root.left.val = root.val;
    if (root.right) root.right.val = root.val;
  }
  changeTree(root.left);
  changeTree(root.right);
  let total = 0;
  if (root.left) total += root.left.val;
  if (root.right) total += root.right.val;
  if (root.left || root.right) root.val = total;
}`,
    tags: ['Binary Trees', 'Recursion', 'Striver SDE Sheet'],
    examples: ['Binary tree -> modified in-place to satisfy children sum property'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine budget allocations: if child departments require more funds, increase the parent budget. If not, temporarily boost the child budgets, and reconcile sums on the way back.',
    intuition: 'On the way down: if child sum is smaller than parent, overwrite child values with parent. On the way up: update parent value to match the sum of its children.',
    dryRun: 'Traverse down. Increase child values if smaller than parent. Traverse up and recalculate parent values to reconcile sums.',
    mistake: 'Directly overwriting values without parent-child balance checks, which fails on complex subtrees.',
    prefer: 'Perform a pre-order increase on child nodes followed by a post-order sum update.'
  }
];
export class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}
