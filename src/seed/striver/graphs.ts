export const STRIVER_GRAPHS_QUESTIONS = [
  {
    title: 'Clone Graph',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(V + E)',
    explanation: 'Given a reference of a node in a connected undirected graph, return a deep copy of the graph.',
    code: `class GraphNode {
  constructor(val, neighbors) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
  }
}
function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  function dfs(curr) {
    if (map.has(curr)) return map.get(curr);
    const copy = new GraphNode(curr.val);
    map.set(curr, copy);
    for (const neighbor of curr.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }
    return copy;
  }
  return dfs(node);
}`,
    tags: ['Graphs', 'DFS', 'Striver SDE Sheet'],
    examples: ['Node 1 linked to Node 2 -> deep cloned copies generated'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    analogy: 'Imagine replicating a complex network of road junctions: place a new marker whenever you visit a junction for the first time, and draw connecting roads recursively.',
    intuition: 'Use DFS. Maintain a Hash Map that maps original nodes to their cloned counterparts to prevent infinite loops caused by cycles.',
    dryRun: 'Start at Node 1. Clone it and record in map. Recurse neighbors, clone neighbor 2, connect neighbor nodes. Complete clone.',
    mistake: 'Failing to track visited nodes in the map, leading to stack overflow crashes due to cycles.',
    prefer: 'Always insert node clones into the `map` BEFORE visiting child neighbors.'
  },
  {
    title: 'Depth First Search',
    topic: 'Graphs',
    difficulty: 'Easy' as const,
    complexity: 'O(V + E)',
    explanation: 'Perform DFS traversal of an undirected graph.',
    code: `function dfsOfGraph(V, adj) {
  const visited = new Array(V).fill(false);
  const result = [];
  function dfs(node) {
    visited[node] = true;
    result.push(node);
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) {
        dfs(neighbor);
      }
    }
  }
  dfs(0); return result;
}`,
    tags: ['Graphs', 'DFS', 'Striver SDE Sheet'],
    examples: ['adj=[[1,2],[0],[0]] -> [0,1,2]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine navigating a dark castle: walk down one path as deep as possible, mark intersections with chalk to avoid circles, and backtrack when blocked.',
    intuition: 'Recursively descend down adjacent branches. Maintain a boolean array to track visited states and prevent cycles.',
    dryRun: 'Start at 0. Mark visited. Travel to neighbor 1. Mark visited. Go deep down paths before checking other root connections.',
    mistake: 'Forgetting to mark nodes as visited, leading to infinite execution loops.',
    prefer: 'Mark `visited[node] = true` immediately upon entering the recursion.'
  },
  {
    title: 'Breadth First Search',
    topic: 'Graphs',
    difficulty: 'Easy' as const,
    complexity: 'O(V + E)',
    explanation: 'Perform BFS traversal of a graph.',
    code: `function bfsOfGraph(V, adj) {
  const visited = new Array(V).fill(false);
  const result = [];
  const q = [0];
  visited[0] = true;
  while (q.length > 0) {
    const node = q.shift();
    result.push(node);
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        q.push(neighbor);
      }
    }
  }
  return result;
}`,
    tags: ['Graphs', 'BFS', 'Striver SDE Sheet'],
    examples: ['adj=[[1,2],[0],[0]] -> [0,1,2]'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine a droplet of water spreading on a napkin: it expands outward in concentric rings, soaking close fibers before spreading further.',
    intuition: 'Use a Queue. Traverse nodes level-by-level (nearest neighbors first). Mark nodes as visited when pushing them onto the queue.',
    dryRun: 'Push 0. Pop 0. Add neighbors 1 and 2 to queue. Pop 1, pop 2. Returns [0, 1, 2].',
    mistake: 'Marking nodes as visited only after popping them from the queue, causing duplicate node additions.',
    prefer: 'Set `visited[neighbor] = true` immediately when pushing nodes onto the queue.'
  },
  {
    title: 'Detect Cycle in Undirected Graph',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(V + E)',
    explanation: 'Determine if an undirected graph contains any cycles.',
    code: `function isCycleUndirected(V, adj) {
  const visited = new Array(V).fill(false);
  function dfs(node, parent) {
    visited[node] = true;
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent) {
        return true;
      }
    }
    return false;
  }
  for (let i = 0; i < V; i++) {
    if (!visited[i]) {
      if (dfs(i, -1)) return true;
    }
  }
  return false;
}`,
    tags: ['Graphs', 'DFS', 'Striver SDE Sheet'],
    examples: ['V=3, adj=[[1],[0,2],[1]] -> false (no cycle)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine hiking on paths: if you reach a signpost you already visited, and it is not the path you just walked from, you found a loop.',
    intuition: 'Use DFS. Maintain a parent pointer during traversal. If a neighbor is already visited and is not the parent of the current node, a cycle exists.',
    dryRun: 'V=3, path 0->1->2. At 2, neighbor is 1 (parent of 2). No other neighbors visited -> no cycle.',
    mistake: 'Failing to handle disconnected components, missing cycles in sub-graphs.',
    prefer: 'Run the cycle detection loop across all unvisited vertices `i` in the graph.'
  },
  {
    title: 'Detect Cycle in Directed Graph',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(V + E)',
    explanation: 'Determine if a directed graph contains a cycle.',
    code: `function isCycleDirected(V, adj) {
  const visited = new Array(V).fill(false);
  const pathVisited = new Array(V).fill(false);
  function dfs(node) {
    visited[node] = true;
    pathVisited[node] = true;
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) {
        if (dfs(neighbor)) return true;
      } else if (pathVisited[neighbor]) {
        return true;
      }
    }
    pathVisited[node] = false;
    return false;
  }
  for (let i = 0; i < V; i++) {
    if (!visited[i]) {
      if (dfs(i)) return true;
    }
  }
  return false;
}`,
    tags: ['Graphs', 'DFS', 'Striver SDE Sheet'],
    examples: ['V=2, adj=[[1],[0]] -> true (loop between 0 and 1)'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine tracing lineage links: if a descendant\'s tree path connects back to their active ancestor, a chronological paradox (loop) is found.',
    intuition: 'Maintain a `pathVisited` array for the active recursion stack. If we visit a node that is already on the active stack path, a cycle exists.',
    dryRun: 'DFS tracks path links. Re-entering a node that has `pathVisited === true` triggers cycle detection.',
    mistake: 'Using undirected cycle detection logic on directed links, resulting in false alerts.',
    prefer: 'Use an explicit `pathVisited` array and reset `pathVisited[node] = false` when backtracking.'
  },
  {
    title: 'Topological Sort',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(V + E)',
    explanation: 'Find a topological ordering of vertices in a Directed Acyclic Graph (DAG).',
    code: `function topoSort(V, adj) {
  const visited = new Array(V).fill(false);
  const stack = [];
  function dfs(node) {
    visited[node] = true;
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) {
        dfs(neighbor);
      }
    }
    stack.push(node);
  }
  for (let i = 0; i < V; i++) {
    if (!visited[i]) dfs(i);
  }
  return stack.reverse();
}`,
    tags: ['Graphs', 'DFS', 'Striver SDE Sheet'],
    examples: ['DAG nodes -> linear sequence satisfying node dependencies'],
    sheets: ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150'],
    analogy: 'Like sorting chapters of a book: you must complete the prerequisite chapters before reading chapters that depend on them.',
    intuition: 'Use DFS. Recurse down all children first. Upon finishing a node\'s DFS completely, push it onto a stack. Reversing the stack yields topological order.',
    dryRun: 'Process DFS branches. Pop completed leaf nodes onto the stack first. Reverse stack to return order.',
    mistake: 'Applying topological sort on a graph containing cycles, which is mathematically impossible.',
    prefer: 'Apply topological sorting only on Directed Acyclic Graphs (DAGs).'
  },
  {
    title: 'Number of Islands',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(M * N)',
    explanation: 'Count the number of disconnected islands (connected groups of "1"s) in a 2D grid.',
    code: `function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0'; // mark visited
    dfs(r + 1, c); dfs(r - 1, c);
    dfs(r, c + 1); dfs(r, c - 1);
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === '1') {
        count++; dfs(i, j);
      }
    }
  }
  return count;
}`,
    tags: ['Graphs', 'DFS', 'Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'],
    examples: ['Grid with land groups -> returns count of islands'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine discovering separate landmasses in an ocean: land on a patch of grass, explore all connected paths to sink them, and record it as one island.',
    intuition: 'Traverse the grid. Every time we find "1", increment island count and use DFS/BFS to sink (change "1"s to "0"s) all connected land pixels.',
    dryRun: 'Iterate grid. Island found at (0,0). Sink adjacent land. Submerge connected pixels and continue.',
    mistake: 'Failing to mark visited pixels, causing infinite DFS loops.',
    prefer: 'Set `grid[r][c] = "0"` immediately when entering DFS to submerge visited pixels.'
  },
  {
    title: 'Bipartite Graph',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(V + E)',
    explanation: 'Check if a graph is bipartite (vertices can be divided into two independent sets colored red and blue).',
    code: `function isBipartite(adj) {
  const V = adj.length;
  const color = new Array(V).fill(-1);
  function bfs(start) {
    const q = [start];
    color[start] = 0;
    while (q.length > 0) {
      const node = q.shift();
      for (const neighbor of adj[node]) {
        if (color[neighbor] === -1) {
          color[neighbor] = 1 - color[node];
          q.push(neighbor);
        } else if (color[neighbor] === color[node]) {
          return false;
        }
      }
    }
    return true;
  }
  for (let i = 0; i < V; i++) {
    if (color[i] === -1) {
      if (!bfs(i)) return false;
    }
  }
  return true;
}`,
    tags: ['Graphs', 'BFS', 'Striver SDE Sheet'],
    examples: ['adj=[[1,3],[0,2],[1,3],[0,2]] -> true'],
    sheets: ['Striver SDE Sheet', 'NeetCode 150'],
    analogy: 'Imagine dividing guests into two groups: if two friends are colored with matching shirts, the team configuration fails.',
    intuition: 'Color nodes using two shades (0 and 1). Perform BFS: color adjacent neighbors with the opposite shade. A graph is not bipartite if any adjacent node has matching colors.',
    dryRun: 'Queue BFS traversal. Alternate node coloring between 0 and 1. Check for conflicts.',
    mistake: 'Forgetting to check disconnected components, leaving parts of the graph unchecked.',
    prefer: 'Iterate through all vertices `i` to ensure every component gets bipartite verification.'
  },
  {
    title: 'Dijkstra\'s Algorithm',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O((V + E) log V)',
    explanation: 'Find the shortest path from a source vertex to all other vertices in a weighted graph.',
    code: `function dijkstra(V, adj, S) {
  const dist = new Array(V).fill(Infinity);
  dist[S] = 0;
  // Custom simple PQ simulation for compilation
  const q = [[S, 0]];
  while (q.length > 0) {
    q.sort((a, b) => a[1] - b[1]);
    const [node, d] = q.shift();
    if (d > dist[node]) continue;
    for (const [neighbor, weight] of adj[node]) {
      if (dist[node] + weight < dist[neighbor]) {
        dist[neighbor] = dist[node] + weight;
        q.push([neighbor, dist[neighbor]]);
      }
    }
  }
  return dist;
}`,
    tags: ['Graphs', 'Shortest Path', 'Striver SDE Sheet'],
    examples: ['S=0 in weighted graph -> returns array of shortest distances'],
    sheets: ['Striver SDE Sheet', 'NeetCode 150'],
    analogy: 'Imagine routing internet packets: always forward data along paths that offer the absolute minimum delays (lowest weight).',
    intuition: 'Maintain a distance array. Repeatedly visit the unvisited node with the smallest distance, and relax (update) adjacent node distances.',
    dryRun: 'Relax distances iteratively. Queue keeps path distances sorted.',
    mistake: 'Using Dijkstra on graphs with negative weights, which fails.',
    prefer: 'Use Bellman-Ford if the graph contains negative edge weights.'
  },
  {
    title: 'Bellman-Ford Algorithm',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(V * E)',
    explanation: 'Find shortest paths from a source node, supporting negative edge weights and detecting negative cycles.',
    code: `function bellmanFord(V, edges, S) {
  const dist = new Array(V).fill(1e8);
  dist[S] = 0;
  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== 1e8 && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  // Check for negative cycle
  for (const [u, v, w] of edges) {
    if (dist[u] !== 1e8 && dist[u] + w < dist[v]) {
      return -1; // negative cycle detected
    }
  }
  return dist;
}`,
    tags: ['Graphs', 'Shortest Path', 'Striver SDE Sheet'],
    examples: ['Weighted edges -> shortest paths or negative cycle indicator'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Like auditing accounting ledgers: relax all accounts systematically V-1 times. If values continue to drop on the V-th audit, a debt cycle (negative loop) exists.',
    intuition: 'Relax all edges V-1 times. Since the longest simple path can contain at most V-1 edges, a final relaxation check detects negative-weight cycles.',
    dryRun: 'Iterate relaxing edges. V-th pass checks for further reductions to signal cycles.',
    mistake: 'Failing to initialize non-source distances to a large sentinel value (Infinity / 1e8).',
    prefer: 'Use `1e8` or `Infinity` as a safe initial boundary distance.'
  },
  {
    title: 'Floyd-Warshall Algorithm',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(V^3)',
    explanation: 'Find shortest paths between all pairs of vertices.',
    code: `function floydWarshall(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === -1) matrix[i][j] = Infinity;
      if (i === j) matrix[i][j] = 0;
    }
  }
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][k] !== Infinity && matrix[k][j] !== Infinity) {
          matrix[i][j] = Math.min(matrix[i][j], matrix[i][k] + matrix[k][j]);
        }
      }
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === Infinity) matrix[i][j] = -1;
    }
  }
}`,
    tags: ['Graphs', 'Shortest Path', 'Striver SDE Sheet'],
    examples: ['Distance matrix -> all-pairs shortest paths computed in-place'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine routing flights globally: for any flight from A to B, check if routing through an intermediate airport K is faster.',
    intuition: 'Dynamic Programming. Update the distance matrix progressively by testing intermediate nodes K as bridge points between all node pairs (i, j).',
    dryRun: 'Process triple nested loops. Matrix distance values are updated in-place.',
    mistake: 'Reordering the nested loops: the intermediate node loop `k` must always be the outermost loop.',
    prefer: 'Verify `k` is the outermost loop: `for (let k = 0; k < n; k++)`.'
  },
  {
    title: 'Prim\'s Algorithm',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(E log V)',
    explanation: 'Find a Minimum Spanning Tree (MST) in a weighted undirected graph.',
    code: `function primsMST(V, adj) {
  const visited = new Array(V).fill(false);
  const parent = new Array(V).fill(-1);
  const key = new Array(V).fill(Infinity);
  key[0] = 0;
  let mstSum = 0;
  for (let i = 0; i < V; i++) {
    let u = -1, minKey = Infinity;
    for (let v = 0; v < V; v++) {
      if (!visited[v] && key[v] < minKey) {
        minKey = key[v]; u = v;
      }
    }
    if (u === -1) break;
    visited[u] = true;
    mstSum += minKey;
    for (const [v, w] of adj[u]) {
      if (!visited[v] && w < key[v]) {
        key[v] = w; parent[v] = u;
      }
    }
  }
  return mstSum;
}`,
    tags: ['Graphs', 'MST', 'Striver SDE Sheet'],
    examples: ['Weighted graph -> returns the minimum sum of edges of the Spanning Tree'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine connecting utility lines to homes: start at home 0, and greedily lay down the shortest line leading to any unconnected neighbor.',
    intuition: 'Greedy choice. Build the tree node-by-node. Maintain a priority list of minimum edge weights connecting visited nodes to unvisited nodes, and relax edge costs.',
    dryRun: 'Relax weights dynamically. Visit minimal key vertices and aggregate weights.',
    mistake: 'Failing to verify visited status, resulting in cyclic or redundant links.',
    prefer: 'Ensure adjacent relaxations check `!visited[v]` bounds.'
  },
  {
    title: 'Kruskal\'s Algorithm',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(E log E)',
    explanation: 'Find a Minimum Spanning Tree using Disjoint Set Union (DSU).',
    code: `class DisjointSet {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(i) {
    if (this.parent[i] === i) return i;
    return this.parent[i] = this.find(this.parent[i]); // path compression
  }
  union(i, j) {
    const rootI = this.find(i), rootJ = this.find(j);
    if (rootI !== rootJ) {
      if (this.rank[rootI] < this.rank[rootJ]) {
        this.parent[rootI] = rootJ;
      } else if (this.rank[rootI] > this.rank[rootJ]) {
        this.parent[rootJ] = rootI;
      } else {
        this.parent[rootJ] = rootI; this.rank[rootI]++;
      }
      return true;
    }
    return false;
  }
}
function kruskalsMST(V, edges) {
  edges.sort((a, b) => a[2] - b[2]); // sort by weight
  const ds = new DisjointSet(V);
  let mstWeight = 0, count = 0;
  for (const [u, v, w] of edges) {
    if (ds.union(u, v)) {
      mstWeight += w; count++;
      if (count === V - 1) break;
    }
  }
  return mstWeight;
}`,
    tags: ['Graphs', 'MST', 'Striver SDE Sheet'],
    examples: ['List of weighted edges -> returns minimum edge sum of Spanning Tree'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine linking islands with bridges: sort all candidate bridges by cost, and build bridges starting from cheapest, skipping bridges that connect already linked islands.',
    intuition: 'Sort all edges. Use a Disjoint Set structure. For each edge, check if vertices belong to separate subsets: if they do, merge them (union) and include the edge.',
    dryRun: 'Sort edges. Union vertices. If they belong to different roots, merge them to build the MST.',
    mistake: 'Failing to implement path compression inside the Disjoint Set, which slows down unions.',
    prefer: 'Use path compression `parent[i] = find(parent[i])` inside the DSU find function.'
  },
  {
    title: 'Strongly Connected Components (Kosaraju)',
    topic: 'Graphs',
    difficulty: 'Medium' as const,
    complexity: 'O(V + E)',
    explanation: 'Find strongly connected components in a directed graph.',
    code: `function kosaraju(V, adj) {
  const visited = new Array(V).fill(false);
  const stack = [];
  function dfs(node) {
    visited[node] = true;
    for (const neighbor of adj[node]) {
      if (!visited[neighbor]) dfs(neighbor);
    }
    stack.push(node);
  }
  for (let i = 0; i < V; i++) {
    if (!visited[i]) dfs(i);
  }
  const transpose = Array.from({ length: V }, () => []);
  for (let u = 0; u < V; u++) {
    for (const v of adj[u]) {
      transpose[v].push(u);
    }
  }
  visited.fill(false);
  let sccCount = 0;
  function dfsT(node) {
    visited[node] = true;
    for (const neighbor of transpose[node]) {
      if (!visited[neighbor]) dfsT(neighbor);
    }
  }
  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited[node]) {
      sccCount++; dfsT(node);
    }
  }
  return sccCount;
}`,
    tags: ['Graphs', 'DFS', 'Striver SDE Sheet'],
    examples: ['Directed graph -> returns count of strongly connected components'],
    sheets: ['Striver SDE Sheet'],
    analogy: 'Imagine trading circles: if group A can reach B, and B can reach A, reversing the direction of transactions keeps them locked in their isolated bubble.',
    intuition: 'Three steps: 1. Order nodes by finish times using DFS. 2. Transpose (reverse) graph edges. 3. Traverse nodes in order from the stack on the transposed graph.',
    dryRun: 'DFS 1 fills stack. Transpose edges. DFS 2 pops stack, isolates components, and increments SCC counts.',
    mistake: 'Failing to reverse the stack processing order in the second DFS pass.',
    prefer: 'Perform the second DFS pass strictly in the order popped from the first pass stack.'
  }
];
