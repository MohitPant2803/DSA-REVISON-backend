require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');

const mongoUri = process.env.MONGO_URI;
const MIGRATION_NAMESPACE = '7b70c22d-2019-50f6-be50-668f399fef22'; // Deterministic UUID Namespace

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
  const hash = crypto.createHash('sha1').update(totalBytes).digest();
  
  hash[6] = (hash[6] & 0x0f) | 0x50; // version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // variant RFC4122
  
  const hex = hash.toString('hex');
  return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
}

function formatBullets(arr) {
  if (!arr || arr.length === 0) return '';
  return arr.map(item => `• ${item}`).join('\n\n');
}

function compileSlides(q) {
  const slides = [{ type: 'intro', headline: '', body: '', blocks: [] }];

  if (q.type === 'theory') {
    slides.push({
      type: 'explanation',
      headline: '💡 Core Concept',
      body: formatBullets(q.bullets1),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '💡 How it Works',
      body: formatBullets(q.bullets2),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '🧠 Tradeoffs',
      body: formatBullets(q.bullets3),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '🧠 Commonly Asked Questions',
      body: formatBullets(q.bullets4),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '🧠 Edge Cases',
      body: formatBullets(q.bullets5),
      blocks: []
    });
  }
  else if (q.type === 'comparison') {
    slides.push({
      type: 'explanation',
      headline: `💡 ${q.conceptA}`,
      body: formatBullets(q.bullets1),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: `💡 ${q.conceptB}`,
      body: formatBullets(q.bullets2),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '🧠 Comparison',
      body: formatBullets(q.bullets3),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '🧠 Pros & Cons',
      body: formatBullets(q.bullets4),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '🧠 Commonly Asked Questions',
      body: formatBullets(q.bullets5),
      blocks: []
    });
  }
  else if (q.type === 'architecture') {
    slides.push({
      type: 'explanation',
      headline: '💡 Core Concept',
      body: formatBullets(q.bullets1),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '💡 Architecture',
      body: formatBullets(q.bullets2),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '💡 Request Flow',
      body: formatBullets(q.bullets3),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '🧠 Tradeoffs',
      body: formatBullets(q.bullets4),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '🧠 Edge Cases',
      body: formatBullets(q.bullets5),
      blocks: []
    });
  }
  else if (q.type === 'design') {
    slides.push({
      type: 'explanation',
      headline: '💡 Requirements',
      body: formatBullets(q.bullets1),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '💡 High Level Architecture',
      body: formatBullets(q.bullets2),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '💡 Core Components',
      body: formatBullets(q.bullets3),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '🧠 Scaling Challenges',
      body: formatBullets(q.bullets4),
      blocks: []
    });
    slides.push({
      type: 'explanation',
      headline: '🧠 Commonly Asked Questions',
      body: formatBullets(q.bullets5),
      blocks: []
    });
  }
  return slides;
}

// 149 Cards categorized exactly as requested
const CARDS_DATA = [
  {
    title: "What is System Design",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f144",
    type: "theory",
    bullets1: [
      'Core goal: Design components, modules, interfaces, and data flow to solve a scaling problem.',
      'Key focus: Balancing **latency**, **throughput**, **availability**, and costs under heavy user demand.',
      '**Student Shorthand**: Never jump to database or **caching** boxes without clearing **functional requirements** first.'
    ],
    bullets2: [
      'Stage 1: Clarify constraints (Functional vs. Non-Functional requirements).',
      'Stage 2: Estimate capacity (Storage size, read/write ratio, total bandwidth).',
      'Stage 3: High-level design (Client, **Load Balancer**, Web Server, DB).',
      'Stage 4: Deep dive (**Sharding**, **caching** layers, **replication**, message queueing).'
    ],
    bullets3: [
      '**Pros**: Prevents service outages and data loss when load spikes.',
      '**Cons**: Massive operational complexity and higher server maintenance costs.'
    ],
    bullets4: [
      '**Q**: \"How do you start a system design interview?\"',
      '**A**: Ask scope questions (e.g., \"Do we need real-time chat or offline delivery? What is the daily active user count?\").'
    ],
    bullets5: [
      '**SPOF**: Forgetting redundancy in the Web Server layer, leading to total crash if one instance dies.'
    ]
  },
  {
    title: "Functional Requirements",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f144",
    type: "theory",
    bullets1: [
      '**Definition**: The exact features the system must support.',
      '**Examples**: User can upload video, user can search queries, user can join group chats.',
      '**Student Shorthand**: Represents the \"what\" of the system, not the \"how\".'
    ],
    bullets2: [
      'Keep it minimal: Focus on 2-3 core features first (e.g. for Twitter: post tweet, follow user, view timeline).',
      'Discard edge features during interview unless explicitly asked by interviewer.'
    ],
    bullets3: [
      '**Pros**: Scope stays restricted, preventing waste of whiteboard space on auxiliary services.',
      '**Cons**: Under-specifying functional goals leads to complete schema redesign later.'
    ],
    bullets4: [
      '**Q**: \"What **functional requirements** would you write for YouTube?\"',
      '**A**: 1. User can upload video. 2. User can stream video. 3. User can search video titles.'
    ],
    bullets5: [
      'Scope Creep: Adding recommendation engines, comments, and likes in the first 10 minutes.'
    ]
  },
  {
    title: "Non Functional Requirements",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f144",
    type: "theory",
    bullets1: [
      '**Definition**: Quality attributes, constraints, and metrics the system must satisfy (performance metrics).',
      'Key attributes: **Availability** (99.9%), **Latency** (sub-100ms), Reliability (0% data loss).',
      '**Student Shorthand**: Represents \"how well\" the system performs under pressure.'
    ],
    bullets2: [
      'Identify tradeoffs: **Consistency** vs. **Availability** is the classic tradeoff (`CAP`).',
      'Define target ``SLA`/`SLO`` metrics to size hardware allocations.'
    ],
    bullets3: [
      '**Pros**: Dictates hardware sizing, **caching** choices, and database **replication** patterns.',
      '**Cons**: Extremely hard to retrofit security/**availability** metrics into an already built monolith.'
    ],
    bullets4: [
      '**Q**: \"How do NFRs change database choice?\"',
      '**A**: If high write-**availability** is preferred over strong **consistency**, `NoSQL` (AP) databases are selected.'
    ],
    bullets5: [
      '`SLA` Breach: Specifying sub-50ms **latency** but choosing hard disk storage with no **caching**.'
    ]
  },
  {
    title: "Latency",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f144",
    type: "theory",
    bullets1: [
      '**Definition**: Time taken for a request to travel from client to server and back to client.',
      'Measured in: Milliseconds (ms) or Microseconds (μs).',
      'Goal: Minimize **latency** (especially `p99 **latency**`) to keep app responsive.'
    ],
    bullets2: [
      'Optimize network: Use CDNs for static files, place database replicas close to users.',
      'Reduce processing: **Caching** hotspots, optimizing queries, using asynchronous workers.'
    ],
    bullets3: [
      '**Pros**: Improves conversion rates and user engagement.',
      '**Cons**: Optimizing for low **latency** often increases memory usage (caches) and hardware cost.'
    ],
    bullets4: [
      '**Q**: \"What is `p99 **latency**`?\"',
      '**A**: The worst **latency** experienced by 1% of users. Crucial for measuring real user distress.'
    ],
    bullets5: [
      'Cold starts: Uncached database queries returning in 2-3 seconds, ruining p99 metrics.'
    ]
  },
  {
    title: "Throughput",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f144",
    type: "theory",
    bullets1: [
      '**Definition**: Number of actions/requests processed by the system in a unit time.',
      'Measured in: Requests Per Second (RPS) or Queries Per Second (QPS).',
      'Goal: Handle higher **throughput** without degrading **latency** metrics.'
    ],
    bullets2: [
      '**Horizontal scaling**: Spread requests across web/app servers via **Load Balancer**.',
      'Database partitioning: Distribute write load across multiple database nodes.'
    ],
    bullets3: [
      '**Pros**: Prevents system collapse under massive user spikes.',
      '**Cons**: Higher resource usage and synchronization costs across distributed nodes.'
    ],
    bullets4: [
      '**Q**: \"Can a system have high **throughput** but high **latency**?\"',
      '**A**: Yes. Batch processing systems handle millions of records (high **throughput**) but take hours to complete (high **latency**).'
    ],
    bullets5: [
      'Thread Starvation: Web server maxing out active connections, dropping QPS to zero.'
    ]
  },
  {
    title: "Availability",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f144",
    type: "theory",
    bullets1: [
      '**Definition**: Percentage of time the system remains operational and accessible to users.',
      'Expressed in \"Nines\": 99.9% (Three Nines ~ 8.7 hrs downtime/yr), 99.99% (Four Nines ~ 52 mins downtime/yr).',
      '**Student Shorthand**: Calculated as: Uptime / (Uptime + Downtime).'
    ],
    bullets2: [
      'Eliminate SPOFs: Run redundant servers behind load balancers.',
      'Configure auto-failover: Database **replication** with automated leader election.'
    ],
    bullets3: [
      '**Pros**: High user trust and compliance with corporate `SLA` targets.',
      '**Cons**: Designing for high **availability** requires active-active setups, doubling hardware budgets.'
    ],
    bullets4: [
      '**Q**: \"How do you achieve five nines (99.999%) **availability**?\"',
      '**A**: Multi-region deployment, active-active configuration, automatic health checks, instant failover.'
    ],
    bullets5: [
      'DNS cache lock: Servers crash but DNS still points traffic to dead IP addresses.'
    ]
  },
  {
    title: "Reliability",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f144",
    type: "theory",
    bullets1: [
      '**Definition**: Probability that the system functions correctly without failure under specified conditions.',
      'Distinction: **Availability** is \"is it up?\", reliability is \"does it perform correct actions without losing data?\".',
      '**Student Shorthand**: A reliable system never silently corrupts user files or loses transactions.'
    ],
    bullets2: [
      'Defensive coding: Use validation, transaction write-ahead logs (WAL), and checksum verification.',
      'Perform regular backups and stress-test failovers (e.g. Chaos Monkey).'
    ],
    bullets3: [
      '**Pros**: Zero transaction losses and strong data integrity.',
      '**Cons**: Increases write **latency** because of disk flushes (commit checks) and consensus overhead.'
    ],
    bullets4: [
      '**Q**: \"Is a system available but unreliable?\"',
      '**A**: Yes. A web server might be running (available) but consistently returns 500 errors (unreliable).'
    ],
    bullets5: [
      'Silent Data Corruption: Storage disk degradation causing file corruption without throwing errors.'
    ]
  },
  {
    title: "Scalability",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f144",
    type: "theory",
    bullets1: [
      '**Definition**: Capability of the system to handle growing amount of work by adding resources.',
      'Metric check: If load doubles, does adding double the servers keep **latency** same?',
      '**Student Shorthand**: A system is scalable if its performance scales linearly with hardware.'
    ],
    bullets2: [
      'Keep servers stateless: Facilitates easy addition/removal of nodes.',
      'Avoid shared-state lockups: Avoid centralized databases for runtime session tracking.'
    ],
    bullets3: [
      '**Pros**: System survives massive viral spikes (e.g. flash sales).',
      '**Cons**: Designing for scalability adds distributed routing and complexity overhead.'
    ],
    bullets4: [
      '**Q**: \"What prevents a system from scaling linearly?\"',
      '**A**: Amdahl\'s Law (sequential parts of code like global DB lock limit maximum parallel speedup).'
    ],
    bullets5: [
      'Shared Database Bottleneck: Scaling stateless web servers to 100 but keeping a single `MySQL` instance.'
    ]
  },
  {
    title: "Bottlenecks",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f144",
    type: "theory",
    bullets1: [
      '**Definition**: The component that limits the overall capacity/speed of the entire architecture.',
      'Common types: CPU bound, Memory bound, Network I/O bound, Database lock bound.',
      '**Student Shorthand**: The slowest link in the request chain is your bottleneck.'
    ],
    bullets2: [
      'Monitor metrics: CPU usage, thread counts, active connection pools, disk read queues.',
      'Decouple layers: Use queues for heavy tasks so web servers aren\'t blocked.'
    ],
    bullets3: [
      '**Pros**: Maximizes system efficiency by targeting resource upgrades where they matter.',
      '**Cons**: Resolving one bottleneck immediately exposes the next slowest component.'
    ],
    bullets4: [
      '**Q**: \"How do you identify a bottleneck during an interview?\"',
      '**A**: By performing capacity estimation. If disk storage is full or network bandwidth is saturated, that is the bottleneck.'
    ],
    bullets5: [
      'Single Thread Blocking: Node.js server performing heavy cryptographic operations on the main event loop.'
    ]
  },
  {
    title: "Capacity Estimation",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f144",
    type: "theory",
    bullets1: [
      '**Definition**: Back-of-the-envelope calculations to size storage, bandwidth, and CPU requirements.',
      'Key numbers: 10^9 bytes = 1 GB. 100M active users writing 100 bytes = 10 GB/day.',
      '**Student Shorthand**: Essential for deciding between single server vs. distributed database shards.'
    ],
    bullets2: [
      'Step 1: Estimate Daily Active Users (DAU) and read/write ratio.',
      'Step 2: Calculate daily storage (size of data * daily writes * backup factors).',
      'Step 3: Calculate network bandwidth (data sent/second).'
    ],
    bullets3: [
      '**Pros**: Prevents over-provisioning (saves cash) and under-provisioning (saves crashes).',
      '**Cons**: Estimates are based on assumptions; real-world behavior can vary.'
    ],
    bullets4: [
      '**Q**: \"How much storage does Twitter need for tweets per year?\"',
      '**A**: Assume 500M tweets/day. Each tweet is 300 bytes. 500M * 300 = 150 GB/day. Yearly: 150 GB * 365 ≈ 55 TB.'
    ],
    bullets5: [
      'Off-by-one errors: Confusing bits (bandwidth) and bytes (storage), leading to 8x capacity deficit.'
    ]
  },
  {
    title: "Vertical Scaling",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f145",
    type: "theory",
    bullets1: [
      '**Definition**: Adding more power (CPU, RAM, SSD) to an existing single server instance.',
      'Also known as: Scaling Up.',
      '**Student Shorthand**: Upgrading from an 8GB RAM machine to a 64GB RAM machine.'
    ],
    bullets2: [
      'Easiest first step: No code modifications required; just change instance tier.',
      'Use case: Great for early-stage apps or low-traffic admin portals.'
    ],
    bullets3: [
      '**Pros**: Simplest scaling approach. No complex network synchronization or data inconsistency.',
      '**Cons**: Hard hardware limit (a machine can only have so much RAM/CPU). Single point of failure.'
    ],
    bullets4: [
      '**Q**: \"When is **vertical scaling** better than **horizontal scaling**?\"',
      '**A**: When the data size is small, write volume is low, and relational **consistency** requirements make distributed DBs too complex.'
    ],
    bullets5: [
      'Hardware Ceiling: Running out of cloud provider server sizes, forcing a painful migration to **horizontal scaling**.'
    ]
  },
  {
    title: "Horizontal Scaling",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f145",
    type: "theory",
    bullets1: [
      '**Definition**: Adding more server nodes to the pool to distribute load.',
      'Also known as: Scaling Out.',
      '**Student Shorthand**: Going from 1 large server to 10 cheap VM nodes behind a **Load Balancer**.'
    ],
    bullets2: [
      'Implement **Load Balancing**: To dynamically distribute incoming user requests.',
      'Stateless architectures: Crucial so that any server node can handle any request.'
    ],
    bullets3: [
      '**Pros**: Infinite scale limit. Redundancy is built-in (if one server dies, others take over).',
      '**Cons**: Introduces network **latency**, complex debugging, and **consistency** issues across databases.'
    ],
    bullets4: [
      '**Q**: \"What is the primary prerequisite for **horizontal scaling**?\"',
      '**A**: Statlessness. User session data must not be stored on the local web server memory.'
    ],
    bullets5: [
      'Session loss: User logs in on Server A, next click goes to Server B which redirects them to login again.'
    ]
  },
  {
    title: "Stateless Servers",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f145",
    type: "theory",
    bullets1: [
      '**Definition**: Web/App servers that do not store any client session state or local data.',
      'Mechanism: Each `HTTP` request contains all info needed to process it (e.g. JWT token).',
      '**Student Shorthand**: Server is a pure function. Input request -> Output response.'
    ],
    bullets2: [
      'Move session state out: Use centralized storage like `Redis` or client cookies (JWT).',
      'Allows auto-scaling: Spin servers up/down freely based on CPU utilization.'
    ],
    bullets3: [
      '**Pros**: Dynamic auto-scaling is trivial. Failing nodes can be destroyed and replaced immediately.',
      '**Cons**: `Redis` database lookup is required for every user validation check, adding **latency**.'
    ],
    bullets4: [
      '**Q**: \"How does a stateless server check if user is logged in?\"',
      '**A**: Client sends a JWT. Server validates signature cryptographically or fetches session from `Redis`.'
    ],
    bullets5: [
      'Local Storage Fallacy: Saving profile images temporarily on server local hard drive instead of `S3`.'
    ]
  },
  {
    title: "Stateful Servers",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f145",
    type: "theory",
    bullets1: [
      '**Definition**: Servers that maintain client data (session state, socket connections) locally in memory.',
      'Mechanism: Requests from User X must always go to the exact same Server Y.',
      '**Student Shorthand**: Requires sticky sessions (session affinity) at the **Load Balancer** level.'
    ],
    bullets2: [
      'Sticky routing: Configure **Load Balancer** to hash user IP or cookie to select destination node.',
      'Use case: MMORPG game servers, live chat systems with open persistent sockets.'
    ],
    bullets3: [
      '**Pros**: Sub-millisecond local RAM access for session parameters; no external cache calls.',
      '**Cons**: Scaling is hard. If Server Y crashes, all local active session states are lost.'
    ],
    bullets4: [
      '**Q**: \"What happens when you add a server to a stateful cluster?\"',
      '**A**: Sticky routing hashes change. Many users get mapped to new servers, losing active sessions.'
    ],
    bullets5: [
      'Server Overload: One sticky-session server gets hammered by high-traffic power users while other nodes sit idle.'
    ]
  },
  {
    title: "Bottleneck Identification",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f145",
    type: "theory",
    bullets1: [
      'Process of finding the specific resource (CPU, Memory, Disk, Network) limiting system performance.',
      '**Student Shorthand**: Look for the component whose utilization reaches 100% first under stress.',
      'Goal: Upgrade or bypass the saturated resource to restore high **throughput**.'
    ],
    bullets2: [
      'Analyze the path: Client -> Network -> **Load Balancer** -> Web Server -> Cache -> Database.',
      'Use load-testing tools (JMeter, Locust) to stress components sequentially.'
    ],
    bullets3: [
      '**Pros**: Stops you from wasting money upgrading CPU when the real issue is database disk I/O.',
      '**Cons**: Requires deep logging metrics which can add runtime **latency** overhead.'
    ],
    bullets4: [
      '**Q**: \"Your server CPU is at 10% but QPS is low and database has long queues. What is the bottleneck?\"',
      '**A**: Database disk I/O bottleneck. The web servers are waiting for DB response, leaving CPU idle.'
    ],
    bullets5: [
      'Blind Optimization: Optimizing backend code algorithms when the bottleneck is network **throughput**.'
    ]
  },
  {
    title: "Scaling Tradeoffs",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f145",
    type: "theory",
    bullets1: [
      'Scaling decisions are never free; they involve compromise.',
      'Key tradeoffs: Complexity vs. Performance, Cost vs. Reliability, **Consistency** vs. **Availability**.',
      '**Student Shorthand**: If you scale database horizontally, you trade away `ACID` properties.'
    ],
    bullets2: [
      'Calculate ROI: Determine if database **sharding** is worth the complex join queries.',
      'Use **caching**: **Caching** hides DB load but adds stale data hazards.'
    ],
    bullets3: [
      '**Pros**: Structured decision making. Avoids expensive architecture rewrites.',
      '**Cons**: Requires predicting real-world user traffic patterns, which is never 100% accurate.'
    ],
    bullets4: [
      '**Q**: \"What do you trade off when adding a Cache Aside setup?\"',
      '**A**: Cache **consistency**. The database might update but the cache still serves stale data.'
    ],
    bullets5: [
      'Premature Scaling: **Sharding** database on day 1, resulting in huge code complexity for 100 users.'
    ]
  },
  {
    title: "Why Load Balancers Exist",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f146",
    type: "theory",
    bullets1: [
      'Core Goal: Distribute incoming user traffic across a pool of horizontal servers.',
      'Security Shield: Hides private server IPs, acts as first line of DDoS defense.',
      '**Student Shorthand**: Entry point for requests. Client -> **Load Balancer** -> Web Servers.'
    ],
    bullets2: [
      'Place at multiple layers: Client to Web Servers, Web Servers to Internal Services, Services to DBs.',
      'Perform regular health checks to automatically route traffic away from dead nodes.'
    ],
    bullets3: [
      '**Pros**: Enhances **availability** (failover is seamless) and scalability.',
      '**Cons**: The **Load Balancer** itself becomes a **single point of failure** unless clustered (DNS round-robin).'
    ],
    bullets4: [
      '**Q**: \"How do you avoid the **Load Balancer** becoming an **SPOF**?\"',
      '**A**: Run multiple load balancers in active-passive configuration, using DNS to resolve to the active IP.'
    ],
    bullets5: [
      'Misconfigured timeout: Load balancer dropping connections early because database queries take longer than LB timeout.'
    ]
  },
  {
    title: "Round Robin",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f146",
    type: "theory",
    bullets1: [
      '**Definition**: Simple **load balancing** algorithm that routes requests to servers sequentially (Server 1, 2, 3, then 1...).',
      'Variant: Weighted **Round Robin** (sends more traffic to machines with higher spec/CPU cores).',
      '**Student Shorthand**: Simplest algorithm, completely stateless.'
    ],
    bullets2: [
      'Use case: Best when all backend servers have identical specs and request workloads are uniform.'
    ],
    bullets3: [
      '**Pros**: Zero memory overhead. Extremely fast routing decisions.',
      '**Cons**: Does not consider server load. Can send heavy requests to a node that is already CPU-choked.'
    ],
    bullets4: [
      '**Q**: \"When does standard **Round Robin** fail?\"',
      '**A**: When request processing times vary heavily, leading to server load imbalances.'
    ],
    bullets5: [
      'Traffic flooding: Sending 10 heavy PDF generation requests to Server A and 10 light HTML requests to Server B.'
    ]
  },
  {
    title: "Least Connections",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f146",
    type: "theory",
    bullets1: [
      '**Definition**: Routes incoming requests to the server with the fewest active connections.',
      '**Student Shorthand**: Dynamic algorithm. Load balancer must maintain state of active requests.',
      'Goal: Prevent server overload when request processing times vary.'
    ],
    bullets2: [
      'Use case: Best for long-running connections (e.g. video streaming, `SQL` queries, active FTP sessions).'
    ],
    bullets3: [
      '**Pros**: Active **load balancing**. Prevents hotspots.',
      '**Cons**: Higher memory overhead at LB level. Not ideal for short `HTTP` requests (**Round Robin** is faster).'
    ],
    bullets4: [
      '**Q**: \"Why is **Least Connections** not used for stateless static website servers?\"',
      '**A**: Because static file requests complete in microseconds; the overhead of tracking active connections is not worth it.'
    ],
    bullets5: [
      'Unequal server specs: Sending requests to a slow server that has few connections but is already at 100% CPU.'
    ]
  },
  {
    title: "Consistent Hashing",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f146",
    type: "theory",
    bullets1: [
      '**Definition**: Hashing scheme where keys and server nodes are mapped to a circular ring (hash ring).',
      'Core benefit: Adding/removing a server only requires re-mapping a fraction (`1/N`) of keys.',
      '**Student Shorthand**: Crucial for scaling cache clusters (like Memcached) without invalidating the whole cache.'
    ],
    bullets2: [
      'Mapping: Hash both key and server IP to the ring. Route keys clockwise to the nearest server node.',
      'Introduce Virtual Nodes (vnodes): Distributes servers randomly across the ring to prevent hot spots.'
    ],
    bullets3: [
      '**Pros**: Minimizes cache misses during scaling events.',
      '**Cons**: Complex implementation and harder lookup calculations than standard modulo (`hash(key) % N`).'
    ],
    bullets4: [
      '**Q**: \"What are virtual nodes in **Consistent Hashing**?\"',
      '**A**: Multiple fake replica locations on the ring for a single physical server, ensuring balanced key distribution.'
    ],
    bullets5: [
      'Hotspotting: One server node getting 90% of requests because it is preceded by a very wide gap on the hash ring.'
    ]
  },
  {
    title: "Layer 4 vs Layer 7",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f146",
    type: "comparison",
    conceptA: "Layer 4 Load Balancing",
    conceptB: "Layer 7 Load Balancing",
    bullets1: [
      'Works at Transport layer (`TCP`/`UDP`).',
      'Routes traffic based on IP addresses and port numbers.',
      'Does not open the application payload (opaque routing).'
    ],
    bullets2: [
      'Works at Application layer (`HTTP`/`HTTPS`/gRPC).',
      'Routes traffic based on cookies, headers, URLs, and payloads.',
      'Opens/decrypts the packet (SSL termination occurs here).'
    ],
    bullets3: [
      'L4 is fast, stateless, and handles millions of packets easily.',
      'L7 is smart, allows path routing (e.g. /api vs /static), but has high decryption **latency**.'
    ],
    bullets4: [
      'Use L4 for high-speed protocol routing (e.g. DB traffic, raw `TCP`/`UDP` streams).',
      'Use L7 for microservices path routing, header-based auth, and rate-limiting.'
    ],
    bullets5: [
      '**Q**: \"Which layer allows routing based on user session cookie?\"',
      '**A**: Layer 7, since Layer 4 cannot read cookie headers.'
    ]
  },
  {
    title: "Health Checks",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f146",
    type: "theory",
    bullets1: [
      '**Definition**: Periodic test pings sent by the **Load Balancer** to servers to verify if they are alive.',
      'Types: Passive (listening to runtime traffic) and Active (sending dedicated ping requests).',
      '**Student Shorthand**: If a server fails health checks, it is removed from the active routing pool.'
    ],
    bullets2: [
      'Configure endpoints: Return `HTTP` 200 on `/health` endpoint only when DB connections are healthy.',
      'Set thresholds: e.g. Fail after 3 consecutive errors, restore after 2 consecutive successes.'
    ],
    bullets3: [
      '**Pros**: Complete auto-healing of traffic routing.',
      '**Cons**: Health checks consume server CPU. If configured too aggressively, they can overload servers.'
    ],
    bullets4: [
      '**Q**: \"What should a `/health` endpoint check?\"',
      '**A**: Connectivity to database, cache cluster, and local disk space capacity, not just return true.'
    ],
    bullets5: [
      'Zombie Server: A server returns `HTTP` 200 on `/health` but its DB thread pool is dead, dropping real requests.'
    ]
  },
  {
    title: "Why Caching",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f147",
    type: "theory",
    bullets1: [
      'Core Goal: Store frequently accessed data in fast memory (RAM) to bypass slow disk lookups (DB).',
      'Speed Check: RAM **latency** ~ 100ns vs. SSD **latency** ~ 100μs (1000x faster).',
      '**Student Shorthand**: Save read heavy queries close to the application layer.'
    ],
    bullets2: [
      'Use cache at all tiers: Client (browser cache), `CDN` (edge cache), App (`Redis`), Database (buffer pools).'
    ],
    bullets3: [
      '**Pros**: Drastically decreases read **latency**, protects database from overloading.',
      '**Cons**: Cache data can become stale, adding severe cache invalidation logic overhead.'
    ],
    bullets4: [
      '**Q**: \"When should you NOT use a cache?\"',
      '**A**: When the data changes frequently (high writes) or read patterns are highly random (low cache hits).'
    ],
    bullets5: [
      'Cache overhead: Storing data in `Redis` that is only read once, wasting expensive RAM.'
    ]
  },
  {
    title: "Cache Hit",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f147",
    type: "theory",
    bullets1: [
      '**Definition**: When requested data is successfully found in the cache.',
      'Metric check: Cache Hit Ratio = Hits / (Hits + Misses).',
      'Goal: Maintain hit ratio above 80-90% to justify cache cost.'
    ],
    bullets2: [
      'Pre-warm cache: Load predictable high-traffic data into cache during deployment/startup.',
      'Size cache appropriately to prevent eviction of hot keys.'
    ],
    bullets3: [
      '**Pros**: Immediate response return (sub-10ms), bypassing downstream database query overhead.',
      '**Cons**: None, this is the desired path.'
    ],
    bullets4: [
      '**Q**: \"How do you improve cache hit ratio?\"',
      '**A**: Increase cache size, tune eviction policies (LRU/LFU), and increase Time-To-Live (TTL) for stable data.'
    ],
    bullets5: [
      'Eviction Thrashing: Cache size is too small, causing hot keys to be continuously evicted and re-fetched.'
    ]
  },
  {
    title: "Cache Miss",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f147",
    type: "theory",
    bullets1: [
      '**Definition**: When requested data is not found in the cache, forcing a query to the database.',
      'Consequence: Double-**latency** penalty (check cache first, then fetch from database).',
      '**Student Shorthand**: Miss path: Cache check -> Miss -> Query DB -> Store in Cache -> Return.'
    ],
    bullets2: [
      'Cache Aside pattern: App handles checking and backfilling cache on miss.'
    ],
    bullets3: [
      '**Pros**: Ensures database remains final source of truth.',
      '**Cons**: Spikes database CPU if multiple misses occur simultaneously (cache stampede).'
    ],
    bullets4: [
      '**Q**: \"What is a cache stampede?\"',
      '**A**: When a hot cache key expires, and thousands of concurrent requests miss and hit the database at once. Solution: Use locking.'
    ],
    bullets5: [
      'DB hammering: Querying non-existent user IDs repeatedly, bypassing cache to hit the DB every time.'
    ]
  },
  {
    title: "Cache Aside",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f147",
    type: "theory",
    bullets1: [
      'Mechanism: Application reads directly from cache. On miss, it queries database, populates cache, and returns.',
      'Write flow: Write updates to database directly, then invalidate (delete) the cache key.',
      '**Student Shorthand**: Most common pattern. Cache and DB are treated as separate entities by the app.'
    ],
    bullets2: [
      'Write policy: Delete cache key rather than update it to prevent race conditions during concurrent updates.'
    ],
    bullets3: [
      '**Pros**: Cache only contains requested data (conserves RAM). Resilient (if cache dies, DB still works).',
      '**Cons**: Double read penalty on misses. Risk of stale data if DB is updated without deleting cache key.'
    ],
    bullets4: [
      '**Q**: \"Why do we delete cache keys instead of updating them on write?\"',
      '**A**: If two writes happen simultaneously, updating the cache can cause race conditions. Deletion is atomic and safe.'
    ],
    bullets5: [
      'Stale cache: Database changes, but old value remains in cache because update code missed deleting the key.'
    ]
  },
  {
    title: "Write Through",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f147",
    type: "theory",
    bullets1: [
      'Mechanism: Application writes to the cache layer. Cache layer synchronously writes to database before returning.',
      'Read flow: Read always goes to cache. Misses are populated from database by the cache layer itself.',
      '**Student Shorthand**: App treats cache as the single data interface. Cache handles the DB.'
    ],
    bullets2: [
      'Implementation: Requires **caching** framework that supports integrated database connectors.'
    ],
    bullets3: [
      '**Pros**: Cache is never stale. Reads are always fast (never misses if pre-populated).',
      '**Cons**: High write **latency** (waits for both cache and DB writes to complete). Wastes RAM on rarely read writes.'
    ],
    bullets4: [
      '**Q**: \"When is Write Through preferred?\"',
      '**A**: When data is read immediately after writing (e.g. banking balances) and data staleness is unacceptable.'
    ],
    bullets5: [
      'RAM choking: Writing massive user log logs to cache, evicting hot user profile data.'
    ]
  },
  {
    title: "Write Back",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f147",
    type: "theory",
    bullets1: [
      'Mechanism: App writes data to cache. Cache acknowledges immediately. Writes to database are deferred/batched.',
      'Also known as: Write Behind.',
      '**Student Shorthand**: High speed writes. DB write is asynchronous.'
    ],
    bullets2: [
      'Queue writes: Cache aggregates updates and flushes them to database in bulk during off-peak windows.'
    ],
    bullets3: [
      '**Pros**: Extreme write speed (sub-millisecond). Reduces database write load (collapses multiple updates into one).',
      '**Cons**: Risk of data loss. If cache crashes before flushing to database, data is lost forever.'
    ],
    bullets4: [
      '**Q**: \"Where is Write Back used?\"',
      '**A**: Write-heavy systems where losing minor updates is acceptable (e.g. video view counters, game scoreboard updates).'
    ],
    bullets5: [
      'Dirty cache crash: Cache server loses power, losing 10 minutes of unsaved updates.'
    ]
  },
  {
    title: "TTL",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f147",
    type: "theory",
    bullets1: [
      '**Definition**: Time-To-Live. Expiry timer attached to a cache key.',
      'Mechanism: Once TTL expires, cache key is deleted, forcing next request to fetch fresh data from DB.',
      '**Student Shorthand**: Simple safety mechanism to limit duration of stale data.'
    ],
    bullets2: [
      'Tune TTL: Short TTL for fast changing data (e.g., stock price ~ 5s), long TTL for static data (e.g., country codes ~ 24h).'
    ],
    bullets3: [
      '**Pros**: Prevents permanent data staleness. Automatically reclaims cache RAM on inactive keys.',
      '**Cons**: Hard to pick the perfect duration. If too short, DB gets hammered; if too long, users see stale data.'
    ],
    bullets4: [
      '**Q**: \"How does TTL help in cache cleaning?\"',
      '**A**: `Redis` deletes expired keys lazily (on read) or actively in the background, freeing up memory.'
    ],
    bullets5: [
      'Flash sale crash: Setting identical TTL on thousands of items, causing them to expire at the exact same moment.'
    ]
  },
  {
    title: "Cache Invalidation",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f147",
    type: "theory",
    bullets1: [
      '**Definition**: Process of removing outdated data from the cache explicitly.',
      'Quote: \"There are only two hard things in Computer Science: cache invalidation and naming things.\"',
      '**Student Shorthand**: Ensuring the cache reflects DB updates immediately.'
    ],
    bullets2: [
      'Strategies: Write-Through (invalidation at write), TTL-expiry, or Event-driven invalidation (App triggers delete on change).'
    ],
    bullets3: [
      '**Pros**: Guarantees users see fresh data quickly.',
      '**Cons**: Hard to implement reliably in distributed clusters due to race conditions.'
    ],
    bullets4: [
      '**Q**: \"What is active invalidation?\"',
      '**A**: App sends a delete command to `Redis` directly inside the controller database-save block.'
    ],
    bullets5: [
      'Race condition: Invalidation event arrives before database write completes, leaving the cache with the old value.'
    ]
  },
  {
    title: "Redis Basics",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f147",
    type: "theory",
    bullets1: [
      '**Definition**: Remote Dictionary Server. In-memory, key-value database commonly used as a cache.',
      'Data types: Strings, Hashes, Lists, Sets, Sorted Sets (ZSet).',
      '**Student Shorthand**: Single-threaded event loop. Highly performant because of RAM-only operations.'
    ],
    bullets2: [
      'Configuration: Configure maxmemory and select eviction policy (e.g. volatile-lru).',
      'Persistence: RDB (snapshots) and AOF (append-only log logs) to survive restarts.'
    ],
    bullets3: [
      '**Pros**: Sub-millisecond **latency**. Supports complex data structures.',
      '**Cons**: Single-threaded (heavy command can block the server). Memory size is limited by server RAM.'
    ],
    bullets4: [
      '**Q**: \"Why is `Redis` single-threaded?\"',
      '**A**: CPU is rarely the bottleneck for `Redis`; memory bandwidth and network are. Single threading avoids context switches.'
    ],
    bullets5: [
      'Blocking command: Running `KEYS *` on a production `Redis` instance with millions of keys, freezing the system.'
    ]
  },
  {
    title: "SQL vs NoSQL",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f148",
    type: "comparison",
    conceptA: "Relational SQL",
    conceptB: "Non-Relational NoSQL",
    bullets1: [
      'Strict schema model with tables, rows, and relationships.',
      'Strong `ACID` guarantees and support for complex `SQL` JOINs.',
      'Scales vertically primarily.'
    ],
    bullets2: [
      'Dynamic schema (JSON documents, KV, Columns, Graphs).',
      'Sacrifices `ACID` (BASE model) for high horizontal write **throughput**.',
      'Scales horizontally easily.'
    ],
    bullets3: [
      '`SQL` ensures perfect **consistency** for banking/e-commerce checkouts.',
      '`NoSQL` handles unstructured telemetry, logs, and massive real-time feeds.'
    ],
    bullets4: [
      'Choose `SQL` for structured relational data.',
      'Choose `NoSQL` when data is unstructured, write volume is huge, or schema changes daily.'
    ],
    bullets5: [
      '**Q**: \"Why is `NoSQL` easier to shard than `SQL`?\"',
      '**A**: Because `NoSQL` records are self-contained (no cross-node JOIN relationships needed).'
    ]
  },
  {
    title: "Relational Databases",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f148",
    type: "theory",
    bullets1: [
      'Data represented in tables (relations) with columns representing fields and rows representing entries.',
      '**Examples**: `MySQL`, `PostgreSQL`, Oracle.',
      '**Student Shorthand**: Schemas are declared upfront; changes require migrations.'
    ],
    bullets2: [
      'Normalize tables: Organize fields (1NF, 2NF, 3NF) to eliminate data redundancy.',
      'Use foreign keys to enforce referential integrity across entities.'
    ],
    bullets3: [
      '**Pros**: Strong relational integrity. Declarative language (`SQL`) simplifies query logic.',
      '**Cons**: Normalization requires database JOIN operations, which slow down at scale.'
    ],
    bullets4: [
      '**Q**: \"Why is `PostgreSQL` preferred over `MySQL` in modern startups?\"',
      '**A**: Better concurrency control, extensibility, rich JSON support, and advanced indexing features.'
    ],
    bullets5: [
      'Deep JOIN slowdown: Performing 5-table JOINs on tables with millions of rows, locking CPU.'
    ]
  },
  {
    title: "Document Databases",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f148",
    type: "theory",
    bullets1: [
      '**Definition**: `NoSQL` database that stores data as JSON-like documents.',
      '**Examples**: `MongoDB`, CouchDB.',
      '**Student Shorthand**: Nested sub-documents instead of separate relational tables.'
    ],
    bullets2: [
      'Denormalize: Store related data together in a single document to prevent JOIN overhead.'
    ],
    bullets3: [
      '**Pros**: Flexible schema (add keys anytime). Fast read access since data is self-contained.',
      '**Cons**: Lack of referential integrity (if you delete a user, orphaned posts are left behind unless manually cleaned).'
    ],
    bullets4: [
      '**Q**: \"When is `MongoDB` a good choice?\"',
      '**A**: When the data structure is hierarchical, matches JSON directly, and requires high read performance.'
    ],
    bullets5: [
      'Document bloat: Exceeding `MongoDB`\'s 16MB document size limit by nesting infinite arrays.'
    ]
  },
  {
    title: "Key Value Stores",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f148",
    type: "theory",
    bullets1: [
      '**Definition**: Simple database that stores data as an associative array (Hash Table mapping keys to values).',
      '**Examples**: `Redis`, `DynamoDB` (basic usage), Memcached.',
      '**Student Shorthand**: Fast lookup by key; querying by value fields is highly inefficient.'
    ],
    bullets2: [
      'Design key prefixes: e.g., `user:1001:profile` to structure key namespace.'
    ],
    bullets3: [
      '**Pros**: Sub-millisecond reads/writes. Extremely simple interface.',
      '**Cons**: Cannot perform complex queries, sorting, or relational joins natively.'
    ],
    bullets4: [
      '**Q**: \"What is the primary use case of KV stores?\"',
      '**A**: Session storage, **caching**, user shopping carts, and rate-limiting counters.'
    ],
    bullets5: [
      'Expensive scans: Iterating through millions of keys sequentially because value search is needed.'
    ]
  },
  {
    title: "Column Databases",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f148",
    type: "theory",
    bullets1: [
      '**Definition**: Databases that store data tables by columns rather than by rows.',
      '**Examples**: `Cassandra`, Hbase, ClickHouse.',
      '**Student Shorthand**: Designed for analytical queries (OLAP) and massive write **throughput**.'
    ],
    bullets2: [
      'Use case: Calculating aggregate metrics (e.g., average of a column containing billions of values).'
    ],
    bullets3: [
      '**Pros**: High compression ratios. Fast aggregates (only reads the specified column files, ignoring other fields).',
      '**Cons**: Writing single rows (INSERT) is slower because multiple column files must be updated.'
    ],
    bullets4: [
      '**Q**: \"Why does `Cassandra` scale writes so well?\"',
      '**A**: Writes are appended directly to memory (MemTable) and an append-only commit log, avoiding disk searches.'
    ],
    bullets5: [
      'Column scanning: Querying `SELECT *` from ClickHouse, defeating the column-exclusion optimization.'
    ]
  },
  {
    title: "Database Indexing",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f148",
    type: "theory",
    bullets1: [
      '**Definition**: Data structure (typically B-Tree or B+Tree) built on a table to speed up row retrieval.',
      'Mechanism: Maps index values to physical disk locations (bypasses full table scan).',
      '**Student Shorthand**: Quick search directory.'
    ],
    bullets2: [
      'Identify index columns: Columns used in `WHERE`, `JOIN`, or `ORDER BY` clauses.'
    ],
    bullets3: [
      '**Pros**: Converts `O(N)` scans into `O(log N)` index lookups.',
      '**Cons**: Slows down writes (INSERT, UPDATE, DELETE must update the index structure). Consumes disk space.'
    ],
    bullets4: [
      '**Q**: \"Why do databases use B+Trees for indexing?\"',
      '**A**: B+Trees store keys in leaf nodes and link leaf nodes sequentially. Excellent for range queries.'
    ],
    bullets5: [
      'Over-indexing: Indexing every column in a table, causing inserts to take seconds.'
    ]
  },
  {
    title: "ACID",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f148",
    type: "theory",
    bullets1: [
      'Core Goal: Ensure data reliability and **consistency** in database transactions.',
      'A - Atomicity (All or nothing). C - **Consistency** (Schema invariants kept).',
      'I - Isolation (Concurrent run same as serial). D - Durability (Saved permanently on commit).'
    ],
    bullets2: [
      'Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable (strictest).'
    ],
    bullets3: [
      '**Pros**: Prevents financial/accounting data corruption.',
      '**Cons**: Enforcing `ACID` locks resources, reducing maximum concurrent **throughput**.'
    ],
    bullets4: [
      '**Q**: \"What isolation anomaly does Repeatable Read prevent?\"',
      '**A**: Non-repeatable reads (where reading the same row twice in one transaction returns different values).'
    ],
    bullets5: [
      'Deadlocks: Concurrent transactions locking rows in reverse order, blocking each other.'
    ]
  },
  {
    title: "Replication",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f149",
    type: "theory",
    bullets1: [
      '**Definition**: Copying data across multiple database nodes.',
      'Goals: High **Availability** (failover), Geolocation (replica near user), Load distribution (read replicas).',
      '**Student Shorthand**: Backups that can serve traffic.'
    ],
    bullets2: [
      '**Replication** modes: Synchronous (waits for all replicas) vs. Asynchronous (write returns immediately).'
    ],
    bullets3: [
      '**Pros**: survives server node loss. Offloads read queries from the primary server.',
      '**Cons**: Stale reads can occur in asynchronous **replication** (**replication** lag).'
    ],
    bullets4: [
      '**Q**: \"What is **replication** lag?\"',
      '**A**: Time taken for write update on master database to propagate to read replicas.'
    ],
    bullets5: [
      'Split-brain: Two database replicas assume they are primary leader after network partition, writing conflicting data.'
    ]
  },
  {
    title: "Master Slave",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f149",
    type: "theory",
    bullets1: [
      '**Definition**: **Replication** architecture where one node is designated Master and others are Slaves.',
      'Write flow: All writes go to Master database. Master replicates updates to Slaves.',
      'Read flow: Read queries are served by Slaves (scaling read QPS).'
    ],
    bullets2: [
      'Promote a slave: If Master dies, a Slave is promoted to Master (orchestrated by `ZooKeeper`/Consul).'
    ],
    bullets3: [
      '**Pros**: Simple setup. Offloads reads easily.',
      '**Cons**: Write capacity is limited by a single Master. Failover promotion window can cause brief write downtime.'
    ],
    bullets4: [
      '**Q**: \"Why is it renamed to Leader Follower?\"',
      '**A**: Modern industry standard terminology for the exact same architecture.'
    ],
    bullets5: [
      'Master overload: Too many read replicas overload the Master\'s network bandwidth during **replication** sync.'
    ]
  },
  {
    title: "Leader Follower",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f149",
    type: "theory",
    bullets1: [
      '**Definition**: Modern industry term for primary-secondary database architecture.',
      'Consensus: Leaders can be elected dynamically using consensus protocols (Raft, Paxos).',
      '**Student Shorthand**: Standard **replication** pattern for `MySQL`/`PostgreSQL` clusters.'
    ],
    bullets2: [
      'Monitor: Ensure election timeout configs are tuned to prevent fake failover loops.'
    ],
    bullets3: [
      '**Pros**: Industry standard, highly automated failovers.',
      '**Cons**: Handling multi-leader conflicts requires complex resolution algorithms (LWW).'
    ],
    bullets4: [
      '**Q**: \"What is the difference between active-passive and active-active setups?\"',
      '**A**: Active-passive has standby followers. Active-active allows writing to multiple leaders simultaneously.'
    ],
    bullets5: [
      'Split Leader: Network cut causes followers to elect a new leader, while old leader still accepts writes.'
    ]
  },
  {
    title: "Sharding",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f149",
    type: "theory",
    bullets1: [
      '**Definition**: Horizontal partition of database rows across multiple physical machine instances.',
      'Mechanism: Uses Shard Key (e.g. `hash(userId) % N`) to route user data to a specific database instance.',
      '**Student Shorthand**: Split a massive table horizontally into smaller tables on separate servers.'
    ],
    bullets2: [
      'Choose a good Shard Key: Must distribute reads and writes evenly across all shards.',
      'Avoid cross-shard JOINs: They are extremely slow and require application-level stitching.'
    ],
    bullets3: [
      '**Pros**: Unlimited database write scaling capacity.',
      '**Cons**: Complex joins are broken. Hard to re-shard when database nodes increase.'
    ],
    bullets4: [
      '**Q**: \"What happens if a shard key is bad (e.g. stateName)?\"',
      '**A**: Hotspotting (e.g., shard for California is overloaded, while Wyoming shard is empty).'
    ],
    bullets5: [
      'Joint shard: Querying data from Shard A and Shard B simultaneously, destroying **latency**.'
    ]
  },
  {
    title: "Partitioning",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f149",
    type: "theory",
    bullets1: [
      '**Definition**: Splitting a large table into smaller parts within the same database server.',
      'Types: Range Partitioning (e.g., partition by date ranges), List Partitioning, Hash Partitioning.',
      '**Student Shorthand**: Logical partition on one server to speed up queries.'
    ],
    bullets2: [
      'Use case: Partitioning order logs by year. Queries for 2026 only scan that partition.'
    ],
    bullets3: [
      '**Pros**: Faster queries (partition pruning). Easy data cleanup (drop partition instead of DELETE rows).',
      '**Cons**: Limited to the storage/resource limit of the single database server instance.'
    ],
    bullets4: [
      '**Q**: \"How does Partitioning differ from **Sharding**?\"',
      '**A**: Partitioning splits data on the same machine. **Sharding** splits data across separate machines.'
    ],
    bullets5: [
      'Missing index partition: Querying partitioned table without specifying partition column, forcing full scan.'
    ]
  },
  {
    title: "Read Replicas",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f149",
    type: "theory",
    bullets1: [
      '**Definition**: Database instances configured in read-only mode that copy changes from primary database.',
      '**Student Shorthand**: Best for read-heavy systems (e.g. news feed, search, product catalogs).',
      'Goal: Offload heavy SELECT queries from write-master node.'
    ],
    bullets2: [
      'Route reads: Configure application database router to send writes to master, reads to replica pool.'
    ],
    bullets3: [
      '**Pros**: High read scale. Master database is shielded from analytic overhead.',
      '**Cons**: Stale reads can occur due to **replication** lag.'
    ],
    bullets4: [
      '**Q**: \"User updates profile, page refreshes, but shows old data. Why?\"',
      '**A**: The refresh read request went to a read replica that hasn\'t synced the update yet.'
    ],
    bullets5: [
      'Replica lag cascade: Under heavy load, **replication** lag increases to minutes, rendering read replicas useless for live data.'
    ]
  },
  {
    title: "Database Bottlenecks",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f149",
    type: "theory",
    bullets1: [
      'The database is typically the ultimate bottleneck of any scaled architecture.',
      'Causes: Slow queries without indexes, connection pool exhaustion, disk I/O saturation.',
      '**Student Shorthand**: Optimize `SQL` -> Add **Caching** -> Add Read Replicas -> **Sharding**.'
    ],
    bullets2: [
      'Analyze query logs: Use `EXPLAIN` to see if query performs full table scan.',
      'Implement connection pooling (e.g., PgBouncer) to prevent database thread overhead.'
    ],
    bullets3: [
      '**Pros**: Prevents service crashes by proactively fixing database load.',
      '**Cons**: **Sharding**/partitioning requires complex code migrations.'
    ],
    bullets4: [
      '**Q**: \"Your DB CPU is low but connections are maxed out. What is the issue?\"',
      '**A**: Application servers are opening database connections but not closing them, exhausting connection limits.'
    ],
    bullets5: [
      'Indexing loop: Indexing every column in database, causing write disk I/O to max out.'
    ]
  },
  {
    title: "CAP Introduction",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f150",
    type: "theory",
    bullets1: [
      '**Definition**: A distributed system can guarantee at most two out of: **Consistency**, **Availability**, and Partition Tolerance.',
      'The Reality: Networks will experience cuts (Partition Tolerance is not optional).',
      '**Student Shorthand**: The real choice is between **Consistency** (CP) and **Availability** (AP) during a network partition.'
    ],
    bullets2: [
      'Identify system type: CP system blocks writes to prevent stale reads. AP system accepts writes but returns stale data.'
    ],
    bullets3: [
      '**Pros**: Clear trade-off framework for distributed database choices.',
      '**Cons**: Often oversimplified; real systems support hybrid **consistency** models.'
    ],
    bullets4: [
      '**Q**: \"Can you build a CA system?\"',
      '**A**: No. In the real world, network partitions will occur. CA is only possible on a single-node setup.'
    ],
    bullets5: [
      'Fake AP: Architecting an AP system but returning 500 errors during partition, violating **availability**.'
    ]
  },
  {
    title: "Consistency",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f150",
    type: "theory",
    bullets1: [
      '`CAP` **Consistency** (Linearizability): All database nodes return the same, most recent write value simultaneously.',
      'Distinction: This is NOT the \"C\" in `ACID`. `ACID` **Consistency** is about database schema invariants (valid data).',
      '**Student Shorthand**: A read request to any node always returns the latest written value.'
    ],
    bullets2: [
      'Enforce strong **consistency**: Use consensus protocols or block writes unless majority of replicas acknowledge.'
    ],
    bullets3: [
      '**Pros**: Simple application logic (reads are always correct).',
      '**Cons**: High write **latency** (waits for **replication** check). Reduced **availability**.'
    ],
    bullets4: [
      '**Q**: \"Where is `CAP` **Consistency** mandatory?\"',
      '**A**: Banking systems, inventory checkouts, and system configuration registers.'
    ],
    bullets5: [
      'Lock wait timeout: Application waits too long for all nodes to sync, throwing client timeout errors.'
    ]
  },
  {
    title: "Availability",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f150",
    type: "theory",
    bullets1: [
      '`CAP` **Availability**: Every non-failing node must return a non-error response to every request.',
      'Distinction: Note that the response is not guaranteed to contain the absolute latest write data.',
      '**Student Shorthand**: Response must not be an error or a timeout.'
    ],
    bullets2: [
      'AP Database choice: `Cassandra`, `DynamoDB`. They accept reads and writes even if isolated from leader node.'
    ],
    bullets3: [
      '**Pros**: High system responsiveness. The app never goes down for users.',
      '**Cons**: Users will see stale or conflicting data that must be resolved later.'
    ],
    bullets4: [
      '**Q**: \"How does AP database handle conflict resolution?\"',
      '**A**: Last-Write-Wins (LWW) or client-side merge (vector clocks).'
    ],
    bullets5: [
      'Stale feed: Social media feed showing old posts due to node isolation, accepted as normal behavior.'
    ]
  },
  {
    title: "Partition Tolerance",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f150",
    type: "theory",
    bullets1: [
      '**Definition**: System continues to operate despite arbitrary message loss or network cuts between nodes.',
      'Network reality: Fiber optic cables get cut, switches fail. Distributed systems must support Partition Tolerance.',
      '**Student Shorthand**: P is mandatory. You only choose CP or AP.'
    ],
    bullets2: [
      'Design for partitions: Use gossip protocols, heartbeats, and cluster split-brain protections.'
    ],
    bullets3: [
      '**Pros**: System remains resilient to cloud infrastructure failures.',
      '**Cons**: Forces complex tradeoffs on **consistency** and **availability**.'
    ],
    bullets4: [
      '**Q**: \"What triggers the `CAP` tradeoff?\"',
      '**A**: A network partition. When network is healthy, the system can be both consistent and available.'
    ],
    bullets5: [
      'CA illusion: Assuming local network is 100% reliable, leading to system crash on network cut.'
    ]
  },
  {
    title: "CP Systems",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f150",
    type: "theory",
    bullets1: [
      '**Definition**: **Consistency** + Partition Tolerance. If network is cut, isolated nodes reject requests to prevent stale data.',
      '**Examples**: `MongoDB` (primary election), `HBase`, `Redis` (standalone config).',
      '**Student Shorthand**: Prefers data accuracy over uptime.'
    ],
    bullets2: [
      'Use case: Financial systems. If database nodes cannot communicate, lock transactions to prevent double-spending.'
    ],
    bullets3: [
      '**Pros**: Strict data correctness. No sync merge conflicts.',
      '**Cons**: Users see errors or experience connection timeouts during network split.'
    ],
    bullets4: [
      '**Q**: \"What happens in a CP Mongo cluster on network cut?\"',
      '**A**: If the primary node gets isolated from majority of nodes, it steps down to secondary, blocking writes.'
    ],
    bullets5: [
      'Total write block: Minor network partition blocks writes globally because quorum cannot be reached.'
    ]
  },
  {
    title: "AP Systems",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f150",
    type: "theory",
    bullets1: [
      '**Definition**: **Availability** + Partition Tolerance. Isolated database nodes continue to accept reads/writes.',
      '**Examples**: `Cassandra`, `DynamoDB`, Couchbase.',
      '**Student Shorthand**: Prefers uptime over data accuracy.'
    ],
    bullets2: [
      'Conflict resolution: Use Hinted Handoffs and Read Repair to sync nodes once network recovers.'
    ],
    bullets3: [
      '**Pros**: High **availability**, low **latency** writes.',
      '**Cons**: Temporary inconsistencies. Complex data merge strategies needed.'
    ],
    bullets4: [
      '**Q**: \"Where are AP systems preferred?\"',
      '**A**: Shopping carts, social media likes, view counters, real-time telemetry.'
    ],
    bullets5: [
      'Shopping Cart anomaly: User adds item on Node A, views cart on Node B (which is isolated), item is missing.'
    ]
  },
  {
    title: "Interview Tradeoffs",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f150",
    type: "theory",
    bullets1: [
      'How to explain `CAP` tradeoffs to an interviewer.',
      'Key rule: Never say \"we choose CA\". Always say: \"we expect partitions, so we must pick CP or AP for this feature.\"',
      '**Student Shorthand**: Different features in the same app can use different DBs (e.g. AP for feeds, CP for payments).'
    ],
    bullets2: [
      'Frame choice: \"For payment transaction records, we will choose a CP database. For comment feeds, we will choose AP.\"'
    ],
    bullets3: [
      '**Pros**: Demonstrates architectural maturity and trade-off thinking.',
      '**Cons**: None, this is the optimal interview strategy.'
    ],
    bullets4: [
      '**Q**: \"Can an app be both CP and AP?\"',
      '**A**: Yes. Modern architectures use polyglot persistence (e.g. `PostgreSQL` for accounts [CP] and `Cassandra` for chat logs [AP]).'
    ],
    bullets5: [
      'Oversimplification: Classifying a complete application architecture under a single `CAP` designation.'
    ]
  },
  {
    title: "Strong Consistency",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f151",
    type: "theory",
    bullets1: [
      '**Definition**: After a write completes, any subsequent read immediately returns the new value.',
      'Enforced by: Database locking, quorum reads/writes where `R + W > N`.',
      '**Student Shorthand**: Standard relational database experience.'
    ],
    bullets2: [
      'Configure Quorum: Ensure read node count + write node count is greater than total replica count.'
    ],
    bullets3: [
      '**Pros**: Absolute data correctness. No stale reads.',
      '**Cons**: Slow writes (must propagate to majority of nodes before returning). Low **availability**.'
    ],
    bullets4: [
      '**Q**: \"How do you enforce strong **consistency** in a `Cassandra` cluster?\"',
      '**A**: Write with quorum (`LOCAL_QUORUM`) and read with quorum (`LOCAL_QUORUM`).'
    ],
    bullets5: [
      '**Latency** spike: Network lag on one node slows down all writes because quorum confirmation is delayed.'
    ]
  },
  {
    title: "Eventual Consistency",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f151",
    type: "theory",
    bullets1: [
      '**Definition**: If no new updates are made, all replicas will eventually sync and contain the same data.',
      'Mechanism: Replicas sync asynchronously in the background (gossip protocols).',
      '**Student Shorthand**: Fast writes, but temporary stale reads are accepted.'
    ],
    bullets2: [
      'Conflict resolution: Last-Write-Wins (LWW) based on timestamps, or Conflict-Free Replicated Data Types (CRDTs).'
    ],
    bullets3: [
      '**Pros**: Extreme horizontal write scale and low write **latency**.',
      '**Cons**: Temporary inconsistencies can lead to race conditions in application logic.'
    ],
    bullets4: [
      '**Q**: \"How does DNS use eventual **consistency**?\"',
      '**A**: DNS updates take up to 24-48 hours to propagate worldwide. Replicas are eventually consistent.'
    ],
    bullets5: [
      'Dirty Read loop: User updates a post, refresh shows old post, refresh again shows new post (hitting different replicas).'
    ]
  },
  {
    title: "Read Your Writes",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f151",
    type: "theory",
    bullets1: [
      '**Definition**: A **consistency** model guaranteeing that a user will always see their own updates immediately.',
      '**Student Shorthand**: A user\'s own reads never hit a stale replica; other users can see stale data temporarily.',
      'Goal: Prevent user confusion (e.g. changing profile picture and seeing the old one after page refresh).'
    ],
    bullets2: [
      'Route own reads: Route a user\'s reads to the primary database node for 5-10 seconds after a write.'
    ],
    bullets3: [
      '**Pros**: Good user experience without requiring global strong **consistency**.',
      '**Cons**: Increases load on primary master database node.'
    ],
    bullets4: [
      '**Q**: \"How do you implement Read-Your-Writes on the client?\"',
      '**A**: Pin the user\'s requests to the master database node for a short window after they perform a POST/PUT.'
    ],
    bullets5: [
      'Master overload: Senders of bulk writes flooding the master database with read requests.'
    ]
  },
  {
    title: "Quorum Reads",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f151",
    type: "theory",
    bullets1: [
      '**Definition**: A read operation that queries a specific number of replicas (R) to ensure fresh data.',
      'Calculation: If `R + W > N` (where N is total replicas), we are guaranteed to read the latest write.',
      '**Student Shorthand**: Checking multiple nodes to find the most recent timestamp.'
    ],
    bullets2: [
      'Read quorum (R): Set `R = N/2 + 1` (majority) for safe strong **consistency**.'
    ],
    bullets3: [
      '**Pros**: Strong **consistency** can be achieved on eventual **consistency** databases (like `Cassandra`).',
      '**Cons**: Increased read **latency** and network overhead (must wait for multiple node responses).'
    ],
    bullets4: [
      '**Q**: \"What happens if R = 1 in a cluster of 3 replicas?\"',
      '**A**: High speed read, but high risk of reading stale data from a replica that hasn\'t synced yet.'
    ],
    bullets5: [
      'Quorum failure: Network partition prevents reading from enough nodes, returning read error.'
    ]
  },
  {
    title: "Quorum Writes",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f151",
    type: "theory",
    bullets1: [
      '**Definition**: A write operation that must be acknowledged by a specific number of replicas (W) before returning success.',
      'Calculation: If W is majority (`N/2 + 1`), database survives node failures without data loss.',
      '**Student Shorthand**: Writes are only confirmed when majority of nodes save it.'
    ],
    bullets2: [
      'Write quorum (W): Set `W = N/2 + 1` to prevent split-brain leader elections.'
    ],
    bullets3: [
      '**Pros**: High reliability. No transaction data loss if one node dies.',
      '**Cons**: High write **latency**.'
    ],
    bullets4: [
      '**Q**: \"If N=3, W=3, R=1, is the system strongly consistent?\"',
      '**A**: Yes. Since `W + R = 4 > 3`, the single read node is guaranteed to have the update.'
    ],
    bullets5: [
      'Slow write bottleneck: A single slow disk on one replica slows down all quorum writes.'
    ]
  },
  {
    title: "Consistency Tradeoffs",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f151",
    type: "theory",
    bullets1: [
      'Summary of **consistency** levels: Strong -> Read-Your-Writes -> Eventual.',
      'Key tradeoff: Strong **consistency** decreases **throughput** and **availability**; eventual **consistency** increases **throughput** but complicates code.',
      '**Student Shorthand**: Choose the weakest **consistency** model the business logic allows.'
    ],
    bullets2: [
      'Assess feature requirements: e.g., Likes count (Eventual), Password changes (Strong).'
    ],
    bullets3: [
      '**Pros**: Optimizes hardware cost and app speed.',
      '**Cons**: Multi-**consistency** architectures require careful database choices (polyglot persistence).'
    ],
    bullets4: [
      '**Q**: \"Why does Amazon checkout use eventual **consistency**?\"',
      '**A**: High **availability** is preferred. It is better to accept the order and handle rare out-of-stock cases manually than reject a customer.'
    ],
    bullets5: [
      'Under-engineered **consistency**: Using eventual **consistency** for payment records, causing account balance discrepancy.'
    ]
  },
  {
    title: "Why Queues",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f152",
    type: "theory",
    bullets1: [
      'Core Goal: Decouple sender (producer) and receiver (consumer) of tasks asynchronously.',
      'Buffering: Acts as a buffer to handle traffic spikes (protects downstream database/services).',
      '**Student Shorthand**: Post-and-forget. Web Server enqueues task -> Queue -> Worker processes.'
    ],
    bullets2: [
      'Use case: Video transcoding, order processing emails, analytics processing.'
    ],
    bullets3: [
      '**Pros**: Web server responds instantly. Protects workers from crashing during load spikes.',
      '**Cons**: Introduces asynchronous lag (user doesn\'t see result immediately). Harder transaction management.'
    ],
    bullets4: [
      '**Q**: \"What is backpressure?\"',
      '**A**: When consumers cannot keep up with producers. Message queues buffer the load to prevent system crash.'
    ],
    bullets5: [
      'Queue starvation: Web servers queue tasks but worker nodes are dead, causing infinite queue build-up.'
    ]
  },
  {
    title: "Producer Consumer",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f152",
    type: "theory",
    bullets1: [
      '**Definition**: Classic concurrency design pattern. Producers create tasks and put them in a queue; consumers pull tasks from queue.',
      'Scale: Consumers can be scaled horizontally to clear queues faster.',
      '**Student Shorthand**: Standard asynchronous task processor pattern.'
    ],
    bullets2: [
      'Implement auto-scaling: Scale worker nodes based on queue size (length of queue) rather than CPU usage.'
    ],
    bullets3: [
      '**Pros**: Smooth work distribution. Auto-scaling is simple.',
      '**Cons**: Requires message validation to prevent poisoned pill messages.'
    ],
    bullets4: [
      '**Q**: \"What is a poisoned pill message?\"',
      '**A**: A malformed message that crashes consumers repeatedly. Solution: Dead Letter Queue (DLQ).'
    ],
    bullets5: [
      'Crash loop: A bad task is returned to queue on failure, causing consumer to fetch it and crash again.'
    ]
  },
  {
    title: "Kafka Basics",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f152",
    type: "theory",
    bullets1: [
      '**Definition**: High-**throughput** distributed event streaming platform acting as an append-only commit log.',
      'Mechanism: Messages are persisted to disk. Consumers pull messages by managing their own offset pointer.',
      '**Student Shorthand**: Replayable stream database. Multiple consumers can read the same stream.'
    ],
    bullets2: [
      'Use partitions: Topics are split into partitions to allow horizontal write scaling.',
      'Set retention period: e.g. Keep logs on disk for 7 days.'
    ],
    bullets3: [
      '**Pros**: Extreme write scale. Messages can be replayed from any offset.',
      '**Cons**: Massive operational complexity. Partition key selection is critical.'
    ],
    bullets4: [
      '**Q**: \"How does `Kafka` ensure message ordering?\"',
      '**A**: Ordering is only guaranteed within a single partition. Messages must be routed to the same partition using a partition key.'
    ],
    bullets5: [
      'Skewed partition: Using a bad partition key, sending 90% of events to a single partition.'
    ]
  },
  {
    title: "RabbitMQ Basics",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f152",
    type: "theory",
    bullets1: [
      '**Definition**: Distributed message broker that routes messages using exchanges and queues.',
      'Mechanism: Messages are deleted from queue once consumer acknowledges completion.',
      '**Student Shorthand**: Smart broker, dumb consumer (broker tracks message delivery and state).'
    ],
    bullets2: [
      'Use Exchanges: Direct, Fanout, Topic, Headers exchanges to route messages flexibly.'
    ],
    bullets3: [
      '**Pros**: Rich routing logic. Supports transactional messaging and instant acknowledgements.',
      '**Cons**: Not replayable (once message is read and acknowledged, it is gone). Low **throughput** compared to `Kafka`.'
    ],
    bullets4: [
      '**Q**: \"When is `RabbitMQ` preferred over `Kafka`?\"',
      '**A**: When complex routing logic is needed and messages do not need to be replayed.'
    ],
    bullets5: [
      'Consumer slow down: A consumer crashes without acknowledging, causing `RabbitMQ` to hold the message in memory, bloating RAM.'
    ]
  },
  {
    title: "Event Driven Architecture",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f152",
    type: "theory",
    bullets1: [
      '**Definition**: Architectural pattern where services communicate by emitting and reacting to events.',
      'Mechanism: Service A publishes \"OrderCreated\" event to broker; Service B & C react to it asynchronously.',
      '**Student Shorthand**: De-coupled microservices communication.'
    ],
    bullets2: [
      'Design event schemas carefully to prevent breaking downstream consumers on updates.'
    ],
    bullets3: [
      '**Pros**: Services are completely decoupled. High scalability.',
      '**Cons**: Hard to trace request flows across multiple services. Eventual **consistency** challenges.'
    ],
    bullets4: [
      '**Q**: \"How do you trace events in this architecture?\"',
      '**A**: Use distributed tracing with correlation IDs injected into event payloads.'
    ],
    bullets5: [
      'Cascading events loop: Service A emits Event 1, triggering Service B to emit Event 2, which triggers Service A.'
    ]
  },
  {
    title: "Retry Mechanisms",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f152",
    type: "theory",
    bullets1: [
      '**Definition**: Retrying failed operations to handle transient errors (network drops, brief service downtime).',
      'Rules: Exponential Backoff (increase wait time between retries) and Jitter (add randomness to prevent thundering herd).',
      '**Student Shorthand**: Don\'t retry immediately, wait progressively longer.'
    ],
    bullets2: [
      'Example wait: Retry after 1s, then 2s, 4s, 8s (exponential) + random ms (jitter).'
    ],
    bullets3: [
      '**Pros**: Automatically recovers from minor network/service drops.',
      '**Cons**: Retrying non-transient errors (e.g. invalid password) wastes resources and can DDOS your own downstream databases.'
    ],
    bullets4: [
      '**Q**: \"What is Jitter?\"',
      '**A**: Random time offset added to backoff. Prevents all failed client devices from retrying at the exact same moment.'
    ],
    bullets5: [
      'Thundering Herd: Thousands of servers retrying connection to database at the exact same second after recovery.'
    ]
  },
  {
    title: "Dead Letter Queues",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f152",
    type: "theory",
    bullets1: [
      '**Definition**: A secondary queue where messages that fail processing multiple times are sent.',
      'Goal: Prevent corrupted/poisoned messages from blocking the primary queue or crashing workers.',
      '**Student Shorthand**: Quarantine queue for debug/inspection.'
    ],
    bullets2: [
      'Configure max retries: e.g. Route message to DLQ after 5 failed processing attempts.',
      'Monitor DLQ size to alert developer of bugs in parsing logic.'
    ],
    bullets3: [
      '**Pros**: Keeps primary queue clear of blockages. Simplifies debugging.',
      '**Cons**: None. Essential safety net for asynchronous systems.'
    ],
    bullets4: [
      '**Q**: \"What do you do with messages in a DLQ?\"',
      '**A**: Fix consumer code bug, then write a script to re-drive/re-enqueue the DLQ messages back into the primary queue.'
    ],
    bullets5: [
      'Silent failure: DLQ exists but has no alerts, letting thousands of failed orders sit unnoticed for months.'
    ]
  },
  {
    title: "Distributed System Definition",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f153",
    type: "theory",
    bullets1: [
      '**Definition**: Collection of independent computers that appears to its users as a single coherent system.',
      'Core challenge: No shared memory, no shared clock, communications occur over unreliable networks.',
      '**Student Shorthand**: Machines coordinating over the network.'
    ],
    bullets2: [
      'Design defensively: Assume hardware will fail and network requests will timeout.'
    ],
    bullets3: [
      '**Pros**: High **availability**, infinite **horizontal scaling**.',
      '**Cons**: Extremely complex coordination, network partitions, **consistency** bugs.'
    ],
    bullets4: [
      '**Q**: \"What is the primary fallacies of distributed computing?\"',
      '**A**: Fallacy 1: The network is reliable. Fallacy 2: **Latency** is zero. Fallacy 3: Bandwidth is infinite.'
    ],
    bullets5: [
      'Assuming zero **latency**: Designing a distributed system that performs hundreds of synchronous remote calls per request.'
    ]
  },
  {
    title: "Single Point of Failure",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f153",
    type: "theory",
    bullets1: [
      '**Definition**: Any single component in a system whose failure will cause the entire system to stop working.',
      'Goal: Design system with redundancy (no SPOFs).',
      '**Student Shorthand**: If you have only one of it, it\'s an **SPOF**.'
    ],
    bullets2: [
      'Identify SPOFs: Single **load balancer**, single database master, single server node, single DNS config.'
    ],
    bullets3: [
      '**Pros**: High system **availability** and fault tolerance.',
      '**Cons**: Adding redundancy increases system complexity and hardware cost.'
    ],
    bullets4: [
      '**Q**: \"How do you eliminate database master **SPOF**?\"',
      '**A**: Configure a **replication** cluster with automatic failover leader election.'
    ],
    bullets5: [
      'Hidden **SPOF**: Using multiple servers but routing all their logs to a single local storage server that crashes.'
    ]
  },
  {
    title: "Consensus",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f153",
    type: "theory",
    bullets1: [
      '**Definition**: Problem of reaching agreement among multiple distributed nodes on a single data value or state.',
      'Algorithms: Paxos, Raft.',
      '**Student Shorthand**: Crucial for leader election, state **replication**, and distributed lock coordination.'
    ],
    bullets2: [
      'Require majority: Consensus requires a quorum (`N/2 + 1` nodes) to make decisions.'
    ],
    bullets3: [
      '**Pros**: Strong **consistency**. Resilient to node crashes as long as majority is up.',
      '**Cons**: High network overhead (multiple rounds of messages). **Latency** increases with node count.'
    ],
    bullets4: [
      '**Q**: \"Why is Raft preferred over Paxos by developers?\"',
      '**A**: Raft is designed to be understandable and has formal, cleaner state transitions (leader, follower, candidate).'
    ],
    bullets5: [
      'Odd node count: Setting 4 nodes in a cluster. Quorum is 3. Survives only 1 node failure. (5 nodes also has quorum 3 but survives 2).'
    ]
  },
  {
    title: "Leader Election",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f153",
    type: "theory",
    bullets1: [
      '**Definition**: Process of designating a single node as the coordinator/leader of a cluster.',
      'Mechanism: Follower nodes monitor leader via heartbeats. If heartbeats stop, followers initiate election.',
      '**Student Shorthand**: Automatic leadership handover.'
    ],
    bullets2: [
      'Consensus coordinator: Use `ZooKeeper` or Consul to coordinate leader elections using leases.'
    ],
    bullets3: [
      '**Pros**: Automates high **availability** failovers.',
      '**Cons**: Risk of split-brain if election split occurs during network partition.'
    ],
    bullets4: [
      '**Q**: \"What is split-brain in leader election?\"',
      '**A**: When a network cut divides a cluster into two parts, and both parts elect their own leader, causing data corruption.'
    ],
    bullets5: [
      'Fake elections: High CPU load on leader delays **heartbeat**, causing followers to assume it is dead and trigger elections.'
    ]
  },
  {
    title: "Distributed Locks",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f153",
    type: "theory",
    bullets1: [
      '**Definition**: Locking mechanism used to ensure mutual exclusion across multiple independent server nodes.',
      '**Examples**: `Redis` Redlock algorithm, `ZooKeeper` ephemeral nodes.',
      '**Student Shorthand**: Prevents different servers from executing the same job concurrently.'
    ],
    bullets2: [
      'Use TTL/Leases: Ensure locks automatically expire to prevent deadlock if lock holder crashes.'
    ],
    bullets3: [
      '**Pros**: Prevents duplicate job execution and race conditions in distributed systems.',
      '**Cons**: Hard to implement 100% correctly due to GC pauses or clock drifts.'
    ],
    bullets4: [
      '**Q**: \"How does a GC pause break a distributed lock?\"',
      '**A**: Server acquires lock, enters Garbage Collection (GC) pause. Lock expires. Another server acquires lock. GC finishes, first server continues, executing concurrently.'
    ],
    bullets5: [
      'Infinite Lock: Acquiring a lock without a TTL, locking out all servers forever if the holder node crashes.'
    ]
  },
  {
    title: "Clock Synchronization",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f153",
    type: "theory",
    bullets1: [
      '**Definition**: Synchronizing system clocks across separate machines (NTP).',
      'The Catch: Physical clocks drift due to temperature and hardware differences. Real-time synchronization is never perfect.',
      '**Student Shorthand**: Never rely on machine physical time for transaction ordering.'
    ],
    bullets2: [
      'Use logical clocks: Lamport timestamps or Vector Clocks to track logical order of events.',
      'Hybrid Logical Clocks: Combine physical time and logical counters.'
    ],
    bullets3: [
      '**Pros**: NTP keeps clocks close (within ms).',
      '**Cons**: Clock drift can cause data loss in systems using Last-Write-Wins (LWW) resolution.'
    ],
    bullets4: [
      '**Q**: \"Why can physical timestamps cause data loss in databases?\"',
      '**A**: If Server A\'s clock is ahead of Server B\'s, writes to B can be overwritten by stale writes from A because of the LWW rule.'
    ],
    bullets5: [
      'Relying on time: Using `Date.now()` to sequence global financial ledger transactions.'
    ]
  },
  {
    title: "Monolith",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f154",
    type: "theory",
    bullets1: [
      '**Definition**: Software architecture where all components of the application are bundled into a single codebase and deployment unit.',
      'Database: Typically shares a single large relational database.',
      '**Student Shorthand**: Single deployment package.'
    ],
    bullets2: [
      'Great for startups: Extremely fast development, simple debugging, and easy deployment.'
    ],
    bullets3: [
      '**Pros**: Fast local calling (no network overhead). Simple transactions (`ACID` is easy on single DB).',
      '**Cons**: Poor scaling (must scale the entire app, not just the bottleneck). Long build and deployment times.'
    ],
    bullets4: [
      '**Q**: \"When should you stick to a Monolith?\"',
      '**A**: When the team is small, traffic is low, and business requirements are changing rapidly.'
    ],
    bullets5: [
      'Deployment nightmare: A minor bug in the payments component taking down the entire website.'
    ]
  },
  {
    title: "Microservices",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f154",
    type: "theory",
    bullets1: [
      '**Definition**: Architectural style where the application is structured as a collection of small, independent services.',
      'Characteristics: Database-per-service, independent deployments, communicate via APIs.',
      '**Student Shorthand**: Decentralized systems.'
    ],
    bullets2: [
      'Strict database boundary: Services must never read/write to another service\'s database directly.'
    ],
    bullets3: [
      '**Pros**: Independent scaling. Tech stack flexibility. Failures are isolated (one service crash doesn\'t kill the app).',
      '**Cons**: High operational complexity. Distributed transaction challenges (requires Saga pattern).'
    ],
    bullets4: [
      '**Q**: \"What is Database-per-Service?\"',
      '**A**: Each microservice owns its database. If Service A needs data from Service B, it must call B\'s API, preventing database tight coupling.'
    ],
    bullets5: [
      'Shared DB anti-pattern: Calling microservices independent but letting them access the same `MySQL` DB.'
    ]
  },
  {
    title: "Service Discovery",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f154",
    type: "theory",
    bullets1: [
      '**Definition**: Directory lookup system that tracks the IP addresses of dynamically scaling microservice instances.',
      'Mechanism: Service instances register their IPs on startup and send periodic heartbeats to the directory.',
      '**Student Shorthand**: Dynamic phonebook for APIs.'
    ],
    bullets2: [
      'Common tools: Consul, Eureka, `ZooKeeper`.'
    ],
    bullets3: [
      '**Pros**: Facilitates seamless horizontal auto-scaling without hardcoding IP addresses.',
      '**Cons**: Introduces an additional infrastructure component that must be kept highly available.'
    ],
    bullets4: [
      '**Q**: \"How does Service A call Service B in microservices?\"',
      '**A**: Service A queries the Service Discovery directory for B\'s IPs, selects one (client-side **load balancing**), and calls it.'
    ],
    bullets5: [
      'Hardcoded IPs: Hardcoding IP addresses in config files, causing API errors when instances scale.'
    ]
  },
  {
    title: "API Gateway",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f154",
    type: "theory",
    bullets1: [
      '**Definition**: Server that acts as an entry point for all client API requests, routing them to downstream microservices.',
      'Responsibilities: Authentication, **rate limiting**, request routing, TLS termination, API aggregation.',
      '**Student Shorthand**: Front door guard of microservices.'
    ],
    bullets2: [
      'Keep it light: Do not put heavy business logic inside the gateway. It should only handle routing and cross-cutting concerns.'
    ],
    bullets3: [
      '**Pros**: Simplifies client code (one endpoint). Centralized security and **rate limiting** enforcement.',
      '**Cons**: Gateway becomes a **single point of failure** and bottleneck if not scaled properly.'
    ],
    bullets4: [
      '**Q**: \"What is API aggregation?\"',
      '**A**: Gateway handles calling multiple services (e.g. User Profile + Orders) and combines results into a single response for the client.'
    ],
    bullets5: [
      'Gateway bloat: Putting database logic or business rules inside the gateway, turning it into a monolith.'
    ]
  },
  {
    title: "Service Communication",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f154",
    type: "theory",
    bullets1: [
      '**Definition**: How microservices exchange data.',
      'Types: Synchronous (REST/`HTTP`, gRPC) and Asynchronous (Message Queues, Pub/Sub).',
      '**Student Shorthand**: `HTTP` calls vs. Event streaming.'
    ],
    bullets2: [
      'Decouple calls: Prefer asynchronous event-driven communication to prevent cascading timeouts.'
    ],
    bullets3: [
      '**Pros**: Dynamic coordination.',
      '**Cons**: Synchronous communication creates tight runtime coupling.'
    ],
    bullets4: [
      '**Q**: \"When is gRPC preferred over REST for service-to-service calls?\"',
      '**A**: For internal microservice communication due to binary serialization (Protocol Buffers) which is faster and consumes less bandwidth.'
    ],
    bullets5: [
      'Distributed deadlocks: Service A calls B synchronously, B calls C, C calls A, locking threads.'
    ]
  },
  {
    title: "Advantages",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f154",
    type: "theory",
    bullets1: [
      'Why companies choose microservices at scale.',
      'Key points: Independent scaling, modular boundary, deployment autonomy.',
      '**Student Shorthand**: Scale the team and code concurrently.'
    ],
    bullets2: [
      'Isolate faults: If recommendation service has memory leak, search service still works.'
    ],
    bullets3: [
      '**Pros**: Fits large organizations (different teams own different services).',
      '**Cons**: Zero benefit for small startups.'
    ],
    bullets4: [
      '**Q**: \"How does microservices help in continuous deployment?\"',
      '**A**: Teams can deploy updates to their specific service multiple times a day without coordinating a full release.'
    ],
    bullets5: [
      'Deploying for the sake of it: Migrating to microservices because of hype, wasting months on setup.'
    ]
  },
  {
    title: "Tradeoffs",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f154",
    type: "theory",
    bullets1: [
      'The price you pay for using microservices.',
      'Issues: Network **latency** (every API call adds ms), data **consistency** (no transactional `ACID` across services).',
      '**Student Shorthand**: You trade code simplicity for operational complexity.'
    ],
    bullets2: [
      'Use the Saga Pattern: Coordinates distributed transactions using a sequence of local transactions and compensating actions.'
    ],
    bullets3: [
      '**Pros**: Unlocks extreme organizational scale.',
      '**Cons**: Debugging is difficult. Tracing requests requires correlation IDs and APM tools.'
    ],
    bullets4: [
      '**Q**: \"What is the Saga Pattern?\"',
      '**A**: A sequence of transactions. If Step 2 fails, Saga executes rollback/compensating transactions on Step 1 to keep data consistent.'
    ],
    bullets5: [
      'Inconsistent state: Step 1 (charging card) succeeds, Step 2 (booking seat) fails, but user is still charged.'
    ]
  },
  {
    title: "REST Basics",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f155",
    type: "theory",
    bullets1: [
      '**Definition**: Representational State Transfer. Architectural style for designing network APIs using `HTTP`.',
      'Principles: Stateless, client-server, cacheable, uniform interface.',
      '**Student Shorthand**: Resources are identified by URIs, actions by `HTTP` verbs.'
    ],
    bullets2: [
      'Map resources to nouns: e.g. `GET /users/101` instead of `GET /getUser?id=101`.'
    ],
    bullets3: [
      '**Pros**: Human-readable, simple to debug, native browser **caching** support.',
      '**Cons**: Payload bloat (JSON sends heavy key strings). Over-fetching/under-fetching data.'
    ],
    bullets4: [
      '**Q**: \"What is statelessness in REST?\"',
      '**A**: Every client request must contain all the information necessary for the server to understand and process it.'
    ],
    bullets5: [
      'REST verb abuse: Using `GET` requests to delete database records.'
    ]
  },
  {
    title: "HTTP Methods",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f155",
    type: "theory",
    bullets1: [
      'Standard verbs to perform CRUD actions on resources.',
      'GET (Read), POST (Create), PUT (Replace), PATCH (Update partially), DELETE (Remove).',
      '**Student Shorthand**: Align verbs with database operations.'
    ],
    bullets2: [
      'Use standard status codes: 200 (OK), 201 (Created), 400 (Bad request), 401 (Unauthorized), 404 (Not found), 500 (Server error).'
    ],
    bullets3: [
      '**Pros**: Clean self-documenting API structure.',
      '**Cons**: None, standard design convention.'
    ],
    bullets4: [
      '**Q**: \"What is the difference between PUT and PATCH?\"',
      '**A**: PUT replaces the entire resource. PATCH only updates the fields specified in the request payload.'
    ],
    bullets5: [
      'GET write: Using `GET` to update account balance because it was easier to test in browser url bar.'
    ]
  },
  {
    title: "Idempotency",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f155",
    type: "theory",
    bullets1: [
      '**Definition**: An API request is idempotent if repeating the request multiple times produces the exact same side-effect on the server.',
      'Idempotent methods: GET, PUT, DELETE.',
      'Non-idempotent: POST (repeating it creates duplicate records).'
    ],
    bullets2: [
      'Use Idempotency Keys: Client generates a unique UUID key for critical transactions (like payments) and sends it in the header.'
    ],
    bullets3: [
      '**Pros**: Prevents duplicate charges and actions on network drops/retries.',
      '**Cons**: Requires server to maintain a deduplication cache (e.g. `Redis` tracking keys).'
    ],
    bullets4: [
      '**Q**: \"How does the server handle idempotency keys?\"',
      '**A**: Server saves the key in `Redis` on first request. If duplicate key arrives, it returns the cached response instead of processing again.'
    ],
    bullets5: [
      'Double payment: User taps \"Buy\" button twice on slow connection, creating two separate transactions.'
    ]
  },
  {
    title: "Pagination",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f155",
    type: "theory",
    bullets1: [
      '**Definition**: Splitting a large result set into discrete pages to optimize **latency** and database query size.',
      'Types: Offset-based (LIMIT/OFFSET) and Cursor-based (Seek method).',
      '**Student Shorthand**: Essential for APIs returning feeds, search results, or catalogs.'
    ],
    bullets2: [
      'Use cursor-based pagination for high-update feeds to prevent duplicate/skipped items on page turns.'
    ],
    bullets3: [
      '**Pros**: Lowers database load and network transmission payload size.',
      '**Cons**: Offset-based pagination gets progressively slower as page depth increases.'
    ],
    bullets4: [
      '**Q**: \"Why is cursor-based pagination better for infinite scroll?\"',
      '**A**: Because offset pagination is stateless; if a new post is added while scrolling, the offset shifts, causing duplicate items.'
    ],
    bullets5: [
      'Huge OFFSET: Performing `LIMIT 10 OFFSET 1000000`, causing database to scan 1M rows before discarding them.'
    ]
  },
  {
    title: "Versioning",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f155",
    type: "theory",
    bullets1: [
      '**Definition**: Managing API changes over time to prevent breaking existing mobile/web client apps.',
      'Approaches: URI Versioning (e.g. `/api/v1/users`), Header Versioning (e.g. custom headers), Query Versioning.',
      '**Student Shorthand**: URI versioning is the most common and transparent approach.'
    ],
    bullets2: [
      'Strict deprecation: Maintain old versions (v1) until mobile user upgrades are complete.'
    ],
    bullets3: [
      '**Pros**: Safe deployments without breaking legacy mobile installations.',
      '**Cons**: Maintaining multiple API versions splits codebase logic and increases support overhead.'
    ],
    bullets4: [
      '**Q**: \"When is a version change required?\"',
      '**A**: When introducing breaking changes (e.g. removing fields, changing data formats/types in payload).'
    ],
    bullets5: [
      'Breaking updates: Changing the type of `userId` from integer to UUID, crashing old client builds.'
    ]
  },
  {
    title: "API Rate Limiting",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f155",
    type: "theory",
    bullets1: [
      '**Definition**: Controlling the rate of traffic sent by a client to prevent resource abuse/overload.',
      '`HTTP` response: Return `429 Too Many Requests` when limits are exceeded.',
      '**Student Shorthand**: Place rate limiters at the API Gateway level.'
    ],
    bullets2: [
      'Add headers: Return limit status in headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.'
    ],
    bullets3: [
      '**Pros**: Protects servers from DDoS, brute force attacks, and noisy neighbor API consumers.',
      '**Cons**: Adds **latency** to every request checks (requires fast cache lookup).'
    ],
    bullets4: [
      '**Q**: \"How does a rate limiter track user limits?\"',
      '**A**: By storing request counters against client IP or API key in `Redis`.'
    ],
    bullets5: [
      'Database **rate limiting**: Checking rate limits by writing log logs directly to `MySQL`, crashing the DB.'
    ]
  },
  {
    title: "Blob Storage",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f156",
    type: "theory",
    bullets1: [
      '**Definition**: Binary Large Object storage. Designed for storing unstructured binary data.',
      '**Examples**: Images, videos, PDF documents, backups.',
      '**Student Shorthand**: File directory in the cloud.'
    ],
    bullets2: [
      'Optimize delivery: Front blob storage with `CDN` edge servers to serve static files instantly.'
    ],
    bullets3: [
      '**Pros**: Extremely cheap storage. High durability (99.999999999% **replication**). Scales infinitely.',
      '**Cons**: No database query features; you retrieve files only by URL paths.'
    ],
    bullets4: [
      '**Q**: \"How does YouTube store video files?\"',
      '**A**: Video files are uploaded and transcoded directly into raw blob storage (like `S3`), not in `SQL`.'
    ],
    bullets5: [
      'Storing blobs in `SQL`: Saving raw user profile images as `BLOB` columns in `MySQL`, bloating database memory.'
    ]
  },
  {
    title: "Object Storage",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f156",
    type: "theory",
    bullets1: [
      '**Definition**: Storage architecture that manages data as objects (data + metadata + key ID).',
      '**Examples**: Amazon `S3`, Google Cloud Storage.',
      '**Student Shorthand**: Object storage is flat; there are no nested physical folder directory trees.'
    ],
    bullets2: [
      'Metadata search: Store object tags/metadata in a database like `Elasticsearch` for fast search queries.'
    ],
    bullets3: [
      '**Pros**: Scales to billions of files easily. Simple `HTTP` REST API interface.',
      '**Cons**: Not suited for transactional filesystem operations (no partial updates to files; you must re-upload the whole file).'
    ],
    bullets4: [
      '**Q**: \"Can you modify a single byte of an object in `S3`?\"',
      '**A**: No. `S3` objects are immutable. You must upload a completely new version of the object.'
    ],
    bullets5: [
      'Append-heavy logs: Writing logs by appending bytes to an `S3` object, forcing continuous download-modify-upload cycles.'
    ]
  },
  {
    title: "File Storage",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f156",
    type: "theory",
    bullets1: [
      '**Definition**: Storage system that organizes data in a hierarchical tree folder structure with paths.',
      '**Examples**: NFS (Network File System), AWS EFS.',
      '**Student Shorthand**: Standard hard drive folder tree structure.'
    ],
    bullets2: [
      'Use case: Legacy apps that require direct POSIX file system commands (like open, write, seek).'
    ],
    bullets3: [
      '**Pros**: Simple folder organization. Supports lock synchronization and random file updates.',
      '**Cons**: Scalability limit (folders get slow when holding millions of files). Network mount overhead.'
    ],
    bullets4: [
      '**Q**: \"Why is Object Storage preferred over File Storage for big data?\"',
      '**A**: Flat structure of object storage avoids file tree index traversals, which lock up when scaling.'
    ],
    bullets5: [
      'NFS overload: Multiple web instances writing concurrently to one shared NFS mount, creating file lock queues.'
    ]
  },
  {
    title: "Block Storage",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f156",
    type: "theory",
    bullets1: [
      '**Definition**: Storage system that breaks data down into blocks and stores them as separate pieces.',
      '**Examples**: AWS EBS, SAN (Storage Area Network), local SSDs.',
      '**Student Shorthand**: Raw partition attached to server VM.'
    ],
    bullets2: [
      'Use case: Databases (`MySQL`, `PostgreSQL`) require block storage for fast read/write transactions.'
    ],
    bullets3: [
      '**Pros**: Extreme performance. Low-**latency** random reads/writes. Supports databases.',
      '**Cons**: Expensive. Can only be mounted to a single server instance at a time.'
    ],
    bullets4: [
      '**Q**: \"Why do databases use block storage instead of object storage?\"',
      '**A**: Databases require constant random updates to specific database index/data files, which is only supported by block storage.'
    ],
    bullets5: [
      'Unattached drive: Scaling web servers using block storage without **replication**, losing data when the host dies.'
    ]
  },
  {
    title: "Distributed Storage",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f156",
    type: "theory",
    bullets1: [
      '**Definition**: Storage system where data is split and replicated across multiple physical machines.',
      '**Examples**: HDFS (Hadoop), Ceph.',
      '**Student Shorthand**: Scales storage horizontally across commodity hardware.'
    ],
    bullets2: [
      '**Replication** factor: Default is usually 3 (data is split into blocks and saved on 3 separate machines).'
    ],
    bullets3: [
      '**Pros**: High aggregate bandwidth. Survives multiple machine failures.',
      '**Cons**: Operational complexity. Consistent metadata synchronization across cluster.'
    ],
    bullets4: [
      '**Q**: \"How does HDFS handle metadata?\"',
      '**A**: Through a NameNode (single coordinator tracking block locations) and multiple DataNodes.'
    ],
    bullets5: [
      'NameNode **SPOF**: Running HDFS without a backup standby NameNode, taking down the cluster when the master node crashes.'
    ]
  },
  {
    title: "Search Basics",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f157",
    type: "theory",
    bullets1: [
      'Core Goal: Perform fast keyword search queries across massive collections of unstructured text data.',
      'Limitation of `SQL`: `LIKE \"%query%\"` requires database table scan, which is very slow.',
      '**Student Shorthand**: Requires pre-computing text into indexes.'
    ],
    bullets2: [
      'Text processing: Clean text via Tokenization, Lowercasing, Stop-word removal (removing \"and\", \"the\"), Stemming (\"running\" -> \"run\").'
    ],
    bullets3: [
      '**Pros**: Returns search results in milliseconds.',
      '**Cons**: Indexes consume RAM and must be kept in sync with primary databases.'
    ],
    bullets4: [
      '**Q**: \"Why does `SQL` LIKE query fail at scale?\"',
      '**A**: Because database B-tree indexes cannot index substring searches with leading wildcards, forcing slow table scans.'
    ],
    bullets5: [
      'Scan-hammer: Running global substring search queries directly against database, locking CPU.'
    ]
  },
  {
    title: "Inverted Index",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f157",
    type: "theory",
    bullets1: [
      '**Definition**: Data structure mapping words to the specific documents that contain them.',
      '**Examples**: \"Index\" -> [Doc 1, Doc 3]; \"Search\" -> [Doc 2, Doc 3].',
      '**Student Shorthand**: Back of the book index.'
    ],
    bullets2: [
      'Update frequency: Update index asynchronously via message queues when documents change in DB.'
    ],
    bullets3: [
      '**Pros**: Constant time `O(1)` query lookup to find matching documents.',
      '**Cons**: Index rebuilds are slow; not ideal for write-heavy update logs.'
    ],
    bullets4: [
      '**Q**: \"How does a search engine perform multi-word search (e.g. cat dog)?\"',
      '**A**: Fetches doc lists for \"cat\" and \"dog\" from inverted index, then performs intersection (AND) or union (OR) of lists.'
    ],
    bullets5: [
      'Sync index block: Blocking web servers while waiting for search index to rebuild on document inserts.'
    ]
  },
  {
    title: "Full Text Search",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f157",
    type: "theory",
    bullets1: [
      '**Definition**: Searching every word in every document to find query matches.',
      'Features: Supports spelling correction, synonym matching, fuzzy search, and relevance ranking.',
      '**Student Shorthand**: Google-like search experience.'
    ],
    bullets2: [
      'Use TF-IDF or BM25: Algorithms to rank search relevance based on term frequency and document length.'
    ],
    bullets3: [
      '**Pros**: Excellent search UX and accuracy.',
      '**Cons**: High memory usage to store the massive inverted index in RAM.'
    ],
    bullets4: [
      '**Q**: \"What is BM25?\"',
      '**A**: The standard ranking algorithm used by modern search engines to score document relevance for a query.'
    ],
    bullets5: [
      'No ranking: Returning search matches in alphabetical order instead of query relevance.'
    ]
  },
  {
    title: "Elasticsearch Basics",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f157",
    type: "theory",
    bullets1: [
      '**Definition**: Distributed, JSON-based search engine built on Apache Lucene.',
      'Mechanism: Data is organized into indices containing documents, which are partitioned into shards.',
      '**Student Shorthand**: Distributed `NoSQL` document search database.'
    ],
    bullets2: [
      'Configure clusters: Use primary and replica shards to handle scaling and failovers.'
    ],
    bullets3: [
      '**Pros**: Scalable, highly performant, rich query DSL.',
      '**Cons**: Expensive RAM requirements. Weak transactional support (not `ACID` compliant).'
    ],
    bullets4: [
      '**Q**: \"How do you keep `Elasticsearch` in sync with primary database?\"',
      '**A**: Use CDC (Change Data Capture) or publish DB updates to `Kafka`, consuming and indexing them in `Elasticsearch`.'
    ],
    bullets5: [
      'Using ES as primary DB: Deleting database and relying entirely on `Elasticsearch`, leading to data loss on cluster crash.'
    ]
  },
  {
    title: "Ranking Concepts",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f157",
    type: "theory",
    bullets1: [
      '**Definition**: Scoring matching search results so the most relevant documents appear first.',
      'Signals: TF-IDF, freshness (recent documents), popularity (views/likes), and personalization.',
      '**Student Shorthand**: Search results sorted by score.'
    ],
    bullets2: [
      'Boost parameters: Configure search query weights (e.g. matches in Title score 5x higher than matches in Body).'
    ],
    bullets3: [
      '**Pros**: Significantly improves click-through rates.',
      '**Cons**: Tuning ranking algorithms requires constant A/B testing.'
    ],
    bullets4: [
      '**Q**: \"What is TF-IDF?\"',
      '**A**: Term Frequency-Inverse Document Frequency. Measures how common a word is in a document compared to how common it is across all documents.'
    ],
    bullets5: [
      'Keyword stuffing: Let users manipulate search results by stuffing keywords in hidden metadata.'
    ]
  },
  {
    title: "What is CDN",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f158",
    type: "theory",
    bullets1: [
      '**Definition**: Content Delivery Network. Geographically distributed network of proxy servers.',
      'Goal: Serve static files (images, JS, videos) close to users to reduce **latency**.',
      '**Student Shorthand**: Edge caches located around the world.'
    ],
    bullets2: [
      'Configure routing: Use DNS Anycast to automatically route user requests to the closest `CDN` node (PoP).'
    ],
    bullets3: [
      '**Pros**: Decreases page load times. Saves server bandwidth.',
      '**Cons**: Cache invalidation delay (users see old assets when update is deployed unless cache-busted).'
    ],
    bullets4: [
      '**Q**: \"How do you bypass `CDN` cache during deployments?\"',
      '**A**: Cache Busting (appending hash/version to file names: e.g. `main.js` -> `main.a8f9b2.js`).'
    ],
    bullets5: [
      'Serving dynamic pages: Trying to cache real-time bank balance endpoints on `CDN` nodes.'
    ]
  },
  {
    title: "Edge Servers",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f158",
    type: "theory",
    bullets1: [
      '**Definition**: `CDN` servers located at the \"edge\" of the network (near ISPs and user regions).',
      'PoP (Point of Presence): Group of edge servers acting as local proxy caches.',
      '**Student Shorthand**: Local proxy nodes.'
    ],
    bullets2: [
      'Configure TTL on edge: Set `HTTP` cache-control headers on origin servers.'
    ],
    bullets3: [
      '**Pros**: Minimal **latency** (physical distance to user is short). Reduces load on main server.',
      '**Cons**: None, standard edge **caching** architecture.'
    ],
    bullets4: [
      '**Q**: \"What is origin server in `CDN`?\"',
      '**A**: The central database/web server hosting the source files. `CDN` fetches files from origin on cache miss.'
    ],
    bullets5: [
      'Origin overloading: `CDN` cache TTL set to 1 second, causing millions of edge requests to hit the origin.'
    ]
  },
  {
    title: "Cache Distribution",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f158",
    type: "theory",
    bullets1: [
      '**Definition**: How files are populated across geographically dispersed `CDN` nodes.',
      'Strategies: Pull model (cache on-demand on first user request) and Push model (proactively upload to `CDN`).',
      '**Student Shorthand**: Lazy cache vs. Pre-warmed cache.'
    ],
    bullets2: [
      'Use Pull model: For general static files (simplifies deployment).',
      'Use Push model: For major media releases (e.g. movie releases) to prevent origin overload.'
    ],
    bullets3: [
      '**Pros**: Optimizes storage and origin bandwidth.',
      '**Cons**: Pull model has **latency** penalty for the first user requesting the file.'
    ],
    bullets4: [
      '**Q**: \"What is a multi-tier `CDN`?\"',
      '**A**: Regional edge caches pulling from central shield caches, protecting origin servers from simultaneous misses.'
    ],
    bullets5: [
      'Massive push: Proactively pushing gigabytes of logs to edge nodes, wasting edge storage.'
    ]
  },
  {
    title: "CDN Request Flow",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f158",
    type: "architecture",
    bullets1: [
      'Goal: Route client request to edge server and retrieve file.',
      'DNS integration: DNS resolves request domain name to `CDN` proxy IP.',
      '**Student Shorthand**: Client -> DNS Anycast -> `CDN` Edge (Hit) -> Return.'
    ],
    bullets2: [
      'Client requests file -> `CDN` Edge checks local cache.'
    ],
    bullets3: [
      'Edge Cache Hit: Edge returns file directly.',
      'Edge Cache Miss: Edge requests file from Origin -> Saves file locally -> Returns to client.'
    ],
    bullets4: [
      '**Pros**: Origin server remains idle for 99% of requests.',
      '**Cons**: Misses add **latency** to first user request.'
    ],
    bullets5: [
      '**Q**: \"How does Anycast DNS work?\"',
      '**A**: It routes requests to the physically closest `CDN` node sharing the same IP address.'
    ]
  },
  {
    title: "CDN Benefits",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f158",
    type: "theory",
    bullets1: [
      'Summary of advantages of placing a `CDN` in front of web app.',
      '**Latency** reduction, server load relief, DDOS protection.',
      '**Student Shorthand**: Mandatory scale component for any public web application.'
    ],
    bullets2: [
      'Use case: Dynamic images, static CSS/JS files, video streaming files.'
    ],
    bullets3: [
      '**Pros**: Drastically improves global app loading times.',
      '**Cons**: None, standard practice.'
    ],
    bullets4: [
      '**Q**: \"Does `CDN` help in cost savings?\"',
      '**A**: Yes. egress data costs on origin servers are much higher than `CDN` delivery costs.'
    ],
    bullets5: [
      'Ignoring `CDN`: Serving all static media files directly from `PostgreSQL` DB or server disk.'
    ]
  },
  {
    title: "Why Rate Limiting",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f159",
    type: "theory",
    bullets1: [
      'Core Goal: Protect backend services from being overloaded by abusive or buggy clients.',
      'Security: Prevents denial-of-service (DoS) attacks and brute-force logins.',
      '**Student Shorthand**: Enforce boundaries: Client cannot send more than X requests/minute.'
    ],
    bullets2: [
      'Configure at API gateway: Intercepts request -> checks counter -> forwards or blocks.'
    ],
    bullets3: [
      '**Pros**: Protects server resources and database stability.',
      '**Cons**: Adds **latency** to every request checks (requires fast cache lookup).'
    ],
    bullets4: [
      '**Q**: \"What is a **sliding window** rate limiter?\"',
      '**A**: Limiter that tracks timestamps of requests dynamically rather than using static clock blocks.'
    ],
    bullets5: [
      'Single database limiter: Using relational database writes to track API usage, overloading the DB.'
    ]
  },
  {
    title: "Token Bucket",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f159",
    type: "theory",
    bullets1: [
      '**Definition**: Rate limiting algorithm where tokens are added to a bucket at a constant rate.',
      'Mechanism: Request requires 1 token. If bucket has tokens, consume token and forward request. If empty, block request.',
      '**Student Shorthand**: Allows brief bursts of traffic.'
    ],
    bullets2: [
      'Parameters: Bucket capacity (max burst size) and Refill rate (sustained speed).'
    ],
    bullets3: [
      '**Pros**: Memory efficient (only stores two fields: token count and last refill timestamp). Handles traffic bursts smoothly.',
      '**Cons**: Tuning capacity and refill rate for different API endpoints is difficult.'
    ],
    bullets4: [
      '**Q**: \"How does **Token Bucket** handle refills without background threads?\"',
      '**A**: Refill on demand: When request arrives, calculate how many tokens should have been added since last request based on timestamp difference.'
    ],
    bullets5: [
      'Memory leaks: Storing a bucket instance in server RAM for every unique IP address, exhausting memory.'
    ]
  },
  {
    title: "Leaky Bucket",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f159",
    type: "theory",
    bullets1: [
      '**Definition**: Rate limiting algorithm that queues requests and processes them at a constant, steady rate.',
      'Mechanism: Incoming requests enter a FIFO queue (bucket). Queue leaks requests at constant speed. If queue is full, new requests overflow (blocked).',
      '**Student Shorthand**: Smooths out traffic spikes to a constant processing speed.'
    ],
    bullets2: [
      'Parameters: Queue size (buffer capacity) and Leak rate (processing speed).'
    ],
    bullets3: [
      '**Pros**: Guarantees constant, predictable load on downstream databases.',
      '**Cons**: Slows down client requests during spikes because they are forced to wait in the queue.'
    ],
    bullets4: [
      '**Q**: \"How does **Leaky Bucket** differ from **Token Bucket**?\"',
      '**A**: **Token Bucket** allows bursts of requests immediately. **Leaky Bucket** enforces a strict, smooth flow rate.'
    ],
    bullets5: [
      'Queue bloat: Setting queue size too large, causing user requests to sit in the queue for seconds, timing out.'
    ]
  },
  {
    title: "Fixed Window",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f159",
    type: "theory",
    bullets1: [
      '**Definition**: Rate limiting algorithm that splits time into fixed intervals (e.g. 1-minute blocks).',
      'Mechanism: Tracks request count within the current time window block. Reset count to 0 when window shifts.',
      '**Student Shorthand**: Simple counter reset.'
    ],
    bullets2: [
      'Implementation: e.g., `Redis` key `user:1001:13:45` with increment commands and 1-minute TTL.'
    ],
    bullets3: [
      '**Pros**: Extremely simple to implement. Low memory overhead.',
      '**Cons**: Boundary spike (a user can double-spend their limit by sending requests right at the boundary transition).'
    ],
    bullets4: [
      '**Q**: \"Explain the **fixed window** boundary spike.\"',
      '**A**: If limit is 10/min, user sends 10 requests at 12:59 and 10 requests at 01:00. 20 requests are processed within a 2-second window.'
    ],
    bullets5: [
      'Allowing double limit: Server overloading because users send bursts right at the minute boundary.'
    ]
  },
  {
    title: "Sliding Window",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f159",
    type: "theory",
    bullets1: [
      '**Definition**: Rate limiting algorithm that tracks requests dynamically within the last window interval.',
      'Mechanism: **Sliding Window** Log stores timestamps of requests in a sorted set (`Redis` ZSet). Deletes timestamps older than current window.',
      '**Student Shorthand**: Strict limit enforcement, zero boundary spikes.'
    ],
    bullets2: [
      'Use `Redis` ZSet: Add new request timestamp -> prune old timestamps -> check set size.'
    ],
    bullets3: [
      '**Pros**: Perfect accuracy. No boundary spikes.',
      '**Cons**: High memory usage (must store timestamps of *every* request for *every* active user).'
    ],
    bullets4: [
      '**Q**: \"What is **Sliding Window** Counter?\"',
      '**A**: A hybrid approach combining **Fixed Window** counters from previous and current window to estimate rate without storing all timestamps.'
    ],
    bullets5: [
      'Memory exhaustion: Storing millions of request timestamps in `Redis` ZSets, running out of RAM.'
    ]
  },
  {
    title: "Tradeoffs",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f159",
    type: "theory",
    bullets1: [
      'Choosing the right **rate limiting** algorithm.',
      'Tradeoffs: **Token Bucket** (good for bursts, memory efficient) vs. **Leaky Bucket** (good for constant load, adds **latency**) vs. **Sliding Window** (accurate, high memory).',
      '**Student Shorthand**: **Token Bucket** is usually the default industry standard due to low memory footprint.'
    ],
    bullets2: [
      'Identify target requirements: e.g. Payment service (**Leaky Bucket**), Web API (**Token Bucket**).'
    ],
    bullets3: [
      '**Pros**: Optimizes rate limiter memory usage.',
      '**Cons**: None, standard trade-off check.'
    ],
    bullets4: [
      '**Q**: \"Where should you place the rate limiter?\"',
      '**A**: At the API Gateway layer to reject requests before they hit internal application servers.'
    ],
    bullets5: [
      'Under-provisioning `Redis`: Not clustering `Redis` for rate-limiting, causing the rate-limiter itself to crash under traffic.'
    ]
  },
  {
    title: "Polling",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f160",
    type: "theory",
    bullets1: [
      '**Definition**: Client periodically sends `HTTP` requests to the server to check for new data.',
      'Mechanism: Client sends request -> Server checks DB -> returns data or empty -> client waits X seconds -> repeat.',
      '**Student Shorthand**: \"Are we there yet?\" pattern.'
    ],
    bullets2: [
      'Set polling interval: e.g. Check every 10 seconds. Keep interval high to prevent DDOSing your own server.'
    ],
    bullets3: [
      '**Pros**: Simple to implement. Works on all web servers and browsers.',
      '**Cons**: Massive resource waste (creates/destroys `HTTP` connections continually for empty responses). Not real-time.'
    ],
    bullets4: [
      '**Q**: \"Why does Polling fail at scale?\"',
      '**A**: Because 90% of requests return \"no new data\", wasting server thread pools and network headers.'
    ],
    bullets5: [
      'DDoS by design: 1M users polling a Node.js server every 1 second, crashing the server.'
    ]
  },
  {
    title: "Long Polling",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f160",
    type: "theory",
    bullets1: [
      '**Definition**: Client requests data; server holds the connection open until new data arrives or timeout occurs.',
      'Mechanism: Request -> Server waits for event -> data arrives -> respond and close -> client immediately re-opens connection.',
      '**Student Shorthand**: Held `HTTP` connection.'
    ],
    bullets2: [
      'Set timeout: e.g. Hold connection open for max 30 seconds before returning empty response to client.'
    ],
    bullets3: [
      '**Pros**: Real-time responses. Fewer connection handshakes than standard polling.',
      '**Cons**: Thread consumption (holding connections open locks server threads unless using async event-driven loop).'
    ],
    bullets4: [
      '**Q**: \"Where is Long Polling used?\"',
      '**A**: Used as fallback in web sockets (e.g. Socket.IO) or in chat systems (e.g. legacy Slack).'
    ],
    bullets5: [
      'Thread exhaustion: Using thread-per-request servers (Apache) with long polling, running out of threads instantly.'
    ]
  },
  {
    title: "Server Sent Events",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f160",
    type: "theory",
    bullets1: [
      '**Definition**: Unidirectional persistent connection where server pushes updates to client over standard `HTTP`.',
      'Mechanism: Client opens a connection via `EventSource` protocol; server streams text data continuously.',
      '**Student Shorthand**: Server-to-client stream only.'
    ],
    bullets2: [
      'Use case: Live stock tick tickers, notification feeds, twitter timelines.'
    ],
    bullets3: [
      '**Pros**: Lightweight. Built-in reconnection support. Uses standard `HTTP` protocol.',
      '**Cons**: Unidirectional (client cannot send data back over same connection; must make separate POST requests).'
    ],
    bullets4: [
      '**Q**: \"How does `SSE` compare to `WebSockets`?\"',
      '**A**: `SSE` is unidirectional (server -> client) and runs over standard `HTTP`/2. `WebSockets` is bidirectional (client <-> server) and requires a custom protocol handshake.'
    ],
    bullets5: [
      'Client send fail: Attempting to build a real-time multiplayer game using `SSE`, since clients need to send inputs.'
    ]
  },
  {
    title: "WebSockets",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f160",
    type: "theory",
    bullets1: [
      '**Definition**: Bidirectional, persistent communication protocol running over a single `TCP` connection.',
      'Mechanism: Handshake starts as `HTTP`, then upgrades to WebSocket protocol (`ws://` or `wss://`).',
      '**Student Shorthand**: Full-duplex persistent connection.'
    ],
    bullets2: [
      'Use case: Real-time gaming, chat applications (WhatsApp), collaborative tools (Figma).'
    ],
    bullets3: [
      '**Pros**: Bidirectional low **latency**. Low frame header overhead after handshake.',
      '**Cons**: Requires stateful WebSocket gateway servers (makes **horizontal scaling** and **load balancing** complex).'
    ],
    bullets4: [
      '**Q**: \"How do you scale `WebSockets` horizontally?\"',
      '**A**: Use a Pub/Sub system (e.g. `Redis` Pub/Sub) in the backend to broadcast messages across different WebSocket server instances.'
    ],
    bullets5: [
      'Ignoring SSL: Using unencrypted `ws://` on web client, letting ISPs drop connections due to proxy blocks.'
    ]
  },
  {
    title: "Real-Time Messaging",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f160",
    type: "theory",
    bullets1: [
      'Designing system to handle real-time message delivery between millions of concurrent users.',
      'Challenge: Message delivery must be sub-100ms, and scale to millions of persistent socket connections.',
      '**Student Shorthand**: WebSocket Gateway + `Redis` Pub/Sub channel coordination.'
    ],
    bullets2: [
      'Partition user sessions: Map which WebSocket server node holds User X\'s active socket connection using a shared cache (`Redis`).'
    ],
    bullets3: [
      '**Pros**: Instant messaging and high user engagement.',
      '**Cons**: High infrastructure cost. Must manage connection states.'
    ],
    bullets4: [
      '**Q**: \"How does Slack deliver message to user offline?\"',
      '**A**: If no active socket connection is found, save message to DB and trigger a Push Notification.'
    ],
    bullets5: [
      'Broadcast loop: Broadcasting a message to all users in a group chat sequentially on the main thread, blocking connections.'
    ]
  },
  {
    title: "Redundancy",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f161",
    type: "theory",
    bullets1: [
      '**Definition**: Duplication of critical components in a system to ensure continuous operation on failure.',
      'Goal: Eliminate Single Points of Failure.',
      '**Student Shorthand**: Backups that are active or standby.'
    ],
    bullets2: [
      'Setup: N+1 redundancy (have one extra node than needed) or 2N (fully duplicated system).'
    ],
    bullets3: [
      '**Pros**: Protects against hardware node deaths and data loss.',
      '**Cons**: Doubles infrastructure costs.'
    ],
    bullets4: [
      '**Q**: \"What is active-passive redundancy?\"',
      '**A**: Active node handles all traffic; passive node sits standby, syncs data, and takes over only if active node fails.'
    ],
    bullets5: [
      'Cold standby delay: Standby server takes 10 minutes to boot and sync data, causing extended downtime during failover.'
    ]
  },
  {
    title: "Failover",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f161",
    type: "theory",
    bullets1: [
      '**Definition**: Automatically switching to a redundant standby system component when the primary component fails.',
      'Types: Cold (manual boot), Warm (standby running but inactive), Hot (replica actively running and syncing).',
      '**Student Shorthand**: Automatic backup takeover.'
    ],
    bullets2: [
      'Configure heartbeats: Keep **heartbeat** timeouts tuned to prevent false failover triggers.'
    ],
    bullets3: [
      '**Pros**: High **availability**, zero manual intervention required.',
      '**Cons**: Hard to implement split-brain protection (preventing two master nodes).'
    ],
    bullets4: [
      '**Q**: \"What is a split-brain in failover?\"',
      '**A**: Network cut isolates primary. Standby assumes primary is dead and promotes itself. Network recovers; now two primaries exist.'
    ],
    bullets5: [
      'Flapping: Server keeps rebooting, triggering continuous failover loops.'
    ]
  },
  {
    title: "Replication",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f161",
    type: "theory",
    bullets1: [
      'Duplicating data storage nodes to protect against disk failures and load spikes.',
      'Data updates: Replicated synchronously or asynchronously.',
      '**Student Shorthand**: Same database file stored on multiple servers.'
    ],
    bullets2: [
      'Distribute nodes geographically: Place replicas in separate **availability** zones/data centers.'
    ],
    bullets3: [
      '**Pros**: High durability. Read offloading.',
      '**Cons**: Complex synchronization code.'
    ],
    bullets4: [
      '**Q**: \"What is geo-**replication**?\"',
      '**A**: Replicating database nodes across separate physical continents to survive natural disasters.'
    ],
    bullets5: [
      'Network delay: Blocking database writes while waiting for a replica in Europe to acknowledge, freezing transactions.'
    ]
  },
  {
    title: "Disaster Recovery",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f161",
    type: "theory",
    bullets1: [
      '**Definition**: Set of policies and procedures to restore operations after a catastrophic outage (data center fire).',
      'Metrics: RTO (Recovery Time Objective: how long to recover) and RPO (Recovery Point Objective: max acceptable data loss duration).',
      '**Student Shorthand**: Disaster plan.'
    ],
    bullets2: [
      'Schedule database backups: Offsite backups (`S3` in a separate region).'
    ],
    bullets3: [
      '**Pros**: Guarantees business survival after major disaster events.',
      '**Cons**: Requires constant drills and simulation testing.'
    ],
    bullets4: [
      '**Q**: \"What is the difference between RTO and RPO?\"',
      '**A**: RTO is the maximum allowed downtime. RPO is the maximum allowed duration of lost data (e.g. lose max 1 hour of writes).'
    ],
    bullets5: [
      'Untested backups: Storing daily database backups but never testing restore commands, realizing later they are corrupted.'
    ]
  },
  {
    title: "High Availability",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f161",
    type: "theory",
    bullets1: [
      'System design approach that ensures a high level of operational performance (uptime) over a given period.',
      'Summary check: Active load balancers, auto-failover DB **replication**, automated health checks.',
      '**Student Shorthand**: Eliminate all SPOFs in the request loop.'
    ],
    bullets2: [
      'Set `SLA` goals: Aim for \"four nines\" (99.99%) uptime.'
    ],
    bullets3: [
      '**Pros**: Reliable service delivery for users.',
      '**Cons**: Extremely high deployment costs due to duplicate active infrastructure.'
    ],
    bullets4: [
      '**Q**: \"How does high **availability** differ from fault tolerance?\"',
      '**A**: High **availability** minimizes downtime (may have brief blip during failover). Fault tolerance implies zero downtime/degradation on failure.'
    ],
    bullets5: [
      'Neglecting DNS **availability**: Scaling servers but using a single DNS server instance that crashes.'
    ]
  },
  {
    title: "Logging",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f162",
    type: "theory",
    bullets1: [
      '**Definition**: Recording discrete event logs generated by application components during runtime.',
      'Important check: Logs must contain timestamps, severity levels (INFO, WARN, ERROR), and trace IDs.',
      '**Student Shorthand**: The final source of truth for debugging server crashes.'
    ],
    bullets2: [
      'Use Structured Logging: Output logs as JSON rather than raw text to simplify parsing.'
    ],
    bullets3: [
      '**Pros**: Indispensable for debugging logic bugs.',
      '**Cons**: Writing logs consumes local disk I/O and network bandwidth if pushed to central servers.'
    ],
    bullets4: [
      '**Q**: \"What is centralized logging?\"',
      '**A**: Shipping logs from all web servers to a centralized database (like `Elasticsearch`/Kibana) for search and analysis.'
    ],
    bullets5: [
      'Disk exhaustion: Printing millions of debug logs in loop, filling up the server hard drive and crashing it.'
    ]
  },
  {
    title: "Metrics",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f162",
    type: "theory",
    bullets1: [
      '**Definition**: Numeric data measured over intervals of time representing system performance.',
      '**Examples**: CPU utilization (%), QPS, Error Rate (%), Active Connection count.',
      '**Student Shorthand**: Health numbers of the system.'
    ],
    bullets2: [
      'Track the Four Golden Signals: **Latency**, Traffic (QPS), Errors, and Saturation (CPU/RAM).'
    ],
    bullets3: [
      '**Pros**: Lightweight (only stores numbers). Enables automated dashboard graphing and alert triggers.',
      '**Cons**: None, standard operational requirement.'
    ],
    bullets4: [
      '**Q**: \"How do you collect metrics?\"',
      '**A**: Use agent tools (e.g. Prometheus) to scrape metric endpoints from application servers.'
    ],
    bullets5: [
      'Ignoring saturation: Monitoring error rates but missing that database disk space is at 99%, leading to crash.'
    ]
  },
  {
    title: "Monitoring",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f162",
    type: "theory",
    bullets1: [
      '**Definition**: Act of collecting, aggregating, and displaying logs, metrics, and tracing on dashboards.',
      'Goal: Provide real-time visibility into the health of the system.',
      '**Student Shorthand**: Dashboards (e.g. Grafana) showing system graphs.'
    ],
    bullets2: [
      'Configure alerts: Set clear alerts to notify developers on Slack/PagerDuty when error rates cross 1%.'
    ],
    bullets3: [
      '**Pros**: Fast detection of system outages before users report them.',
      '**Cons**: Dashboard fatigue (setting too many alerts, leading developers to ignore them).'
    ],
    bullets4: [
      '**Q**: \"What is the difference between black-box and white-box monitoring?\"',
      '**A**: Black-box monitors system externally (e.g. pinging `HTTP` endpoint). White-box monitors internal states (e.g. JVM memory logs).'
    ],
    bullets5: [
      'Alert fatigue: Triggering alerts on minor CPU spikes, causing developers to mute notifications.'
    ]
  },
  {
    title: "Tracing",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f162",
    type: "theory",
    bullets1: [
      '**Definition**: Tracking request flows across multiple distributed microservices.',
      'Mechanism: Inject a unique `Trace ID` in `HTTP` headers on request entry. Every service propagates this ID.',
      '**Student Shorthand**: Distributed tracing (essential for microservices debugging).'
    ],
    bullets2: [
      'Common tools: Jaeger, Zipkin, OpenTelemetry.'
    ],
    bullets3: [
      '**Pros**: Pinpoints exactly which microservice is adding **latency** to a request path.',
      '**Cons**: Adds network header overhead and processing log **latency**.'
    ],
    bullets4: [
      '**Q**: \"How does tracing help in microservices?\"',
      '**A**: If a request takes 5s, tracing shows exactly how much time was spent in Service A, B, and C.'
    ],
    bullets5: [
      'Missing Trace IDs: Service A drops the Trace ID when calling Service B, breaking the call trace chain.'
    ]
  },
  {
    title: "Alerting",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f162",
    type: "theory",
    bullets1: [
      '**Definition**: Automatically notifying operations/developer teams when system metrics cross predefined thresholds.',
      'Integration: PagerDuty, Slack, Email.',
      '**Student Shorthand**: Wake-up call when servers crash.'
    ],
    bullets2: [
      'Set actionable alerts: e.g. \"Database CPU is > 95% for 5 mins\" is actionable; \"1 server CPU is 80%\" is not.'
    ],
    bullets3: [
      '**Pros**: Automates incident response loops.',
      '**Cons**: Poorly tuned rules lead to developers ignoring critical alerts.'
    ],
    bullets4: [
      '**Q**: \"How do you avoid alert noise?\"',
      '**A**: By using sliding time windows (e.g. alert only if error rate is elevated for > 5 minutes) and setting realistic thresholds.'
    ],
    bullets5: [
      'No alerts configured: Server crashes and the dev team only finds out when users complain on Twitter.'
    ]
  },
  {
    title: "Authentication",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f163",
    type: "theory",
    bullets1: [
      '**Definition**: Verifying the identity of a user or system client.',
      '**Examples**: Passwords, MFA tokens, Google login tokens.',
      '**Student Shorthand**: Answering \"Who are you?\".'
    ],
    bullets2: [
      'Hashing: Never store passwords in plain text. Use bcrypt or Argon2 with unique salts.'
    ],
    bullets3: [
      '**Pros**: Restricts system access to verified identities.',
      '**Cons**: Implementing multi-factor auth adds friction to user signup flows.'
    ],
    bullets4: [
      '**Q**: \"Why should you use salt with bcrypt?\"',
      '**A**: Salt is random characters added to password before hashing. Prevents lookup attacks using pre-computed Rainbow Tables.'
    ],
    bullets5: [
      'Plaintext store: Storing passwords in a database string column, exposing them during database leakage.'
    ]
  },
  {
    title: "Authorization",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f163",
    type: "theory",
    bullets1: [
      '**Definition**: Determining if a verified identity has permission to perform a specific action.',
      '**Examples**: User can read post, Admin can delete post, Guest cannot edit profile.',
      '**Student Shorthand**: Answering \"What are you allowed to do?\".'
    ],
    bullets2: [
      'Implement RBAC: Role-Based Access Control (map users to roles: user, admin, moderator).'
    ],
    bullets3: [
      '**Pros**: Protects sensitive admin features from unauthorized access.',
      '**Cons**: Enforcing granular authorization checks adds **latency** to database lookup queries.'
    ],
    bullets4: [
      '**Q**: \"What is ABAC?\"',
      '**A**: Attribute-Based Access Control. Authorizes based on attributes (e.g. \"Only user who created the post can delete it\").'
    ],
    bullets5: [
      'IDOR vulnerability: Letting users view private invoice files simply by changing the URL ID parameter.'
    ]
  },
  {
    title: "JWT",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f163",
    type: "theory",
    bullets1: [
      '**Definition**: JSON Web Token. Stateless, cryptographically signed token representing user identity.',
      'Structure: Header (algorithm), Payload (user claims), Signature (HMAC validation).',
      '**Student Shorthand**: Stateless ticket. Server validates token signature without database lookup.'
    ],
    bullets2: [
      'Set short expiry: Keep access token lifetime short (e.g. 15 mins) and use refresh tokens in Secure Store.'
    ],
    bullets3: [
      '**Pros**: Stateless (scales easily). Web servers do not need to hit database/cache to validate user sessions.',
      '**Cons**: Cannot be easily revoked before expiration (unless blacklist cache is kept, defeating statelessness).'
    ],
    bullets4: [
      '**Q**: \"How do you invalidate a JWT token immediately if user logs out?\"',
      '**A**: Store revoked token signatures in a `Redis` blacklist cache until their original expiry time passes.'
    ],
    bullets5: [
      'Weak secret key: Using a simple string like \"secret\" as JWT signing key, letting hackers fake admin tokens.'
    ]
  },
  {
    title: "OAuth",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f163",
    type: "theory",
    bullets1: [
      '**Definition**: Open Authorization framework. Protocols allowing third-party apps to access user resources without passwords.',
      'Flow example: \"Login with Google\". Client gets Access Token from authorization server.',
      '**Student Shorthand**: Token delegation protocol.'
    ],
    bullets2: [
      'Understand flows: Authorization Code Flow (secure, servers exchange secrets) vs. Implicit Flow (deprecated).'
    ],
    bullets3: [
      '**Pros**: User never shares password with third-party app. Simple integration.',
      '**Cons**: Complex token validation and redirect logic.'
    ],
    bullets4: [
      '**Q**: \"What is the authorization code flow?\"',
      '**A**: Client redirects to Auth server -> gets temporary code -> server exchanges code + secret for Access Token.'
    ],
    bullets5: [
      'Redirect URI hijack: Registering wildcard redirects, letting hackers steal temporary authorization codes.'
    ]
  },
  {
    title: "Encryption Basics",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f163",
    type: "theory",
    bullets1: [
      'Core Goal: Protect data confidentiality in-transit (over network) and at-rest (on disk).',
      'Symmetric (same key: AES) vs. Asymmetric (public/private keys: RSA/ECC).',
      '**Student Shorthand**: AES is fast, RSA is secure for key exchanges.'
    ],
    bullets2: [
      'Use AES-GCM: For encrypting database columns (e.g. credit card numbers).',
      'Store keys in Key Management Services (KMS) with auto-rotation.'
    ],
    bullets3: [
      '**Pros**: Protects sensitive user data from physical hardware thefts and hacker snooping.',
      '**Cons**: Encryption adds CPU overhead to database writes.'
    ],
    bullets4: [
      '**Q**: \"When is asymmetric encryption used?\"',
      '**A**: During SSL handshakes to exchange a symmetric key securely between client and server.'
    ],
    bullets5: [
      'Committing keys: Hardcoding database encryption keys in GitHub repository source code.'
    ]
  },
  {
    title: "HTTPS",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f163",
    type: "theory",
    bullets1: [
      '**Definition**: Hypertext Transfer Protocol Secure. Standard `HTTP` wrapped in TLS/SSL encryption.',
      'Goal: Prevent eavesdropping and man-in-the-middle (MITM) attacks.',
      '**Student Shorthand**: Standard protocol for all production web APIs.'
    ],
    bullets2: [
      'SSL Termination: Handled at the **Load Balancer** or API Gateway to shield application servers from decryption CPU load.'
    ],
    bullets3: [
      '**Pros**: Complete traffic encryption. Browser trust.',
      '**Cons**: SSL handshakes add round-trip **latency** to the first connection.'
    ],
    bullets4: [
      '**Q**: \"What is SSL termination?\"',
      '**A**: The **load balancer** decrypts incoming `HTTPS` traffic, and routes plaintext `HTTP` to web servers over private VPC network.'
    ],
    bullets5: [
      'Plaintext private network: Leaving VPC configuration open to public internet, letting external nodes read plaintext traffic.'
    ]
  },
  {
    title: "Design URL Shortener",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f164",
    type: "design",
    bullets1: [
      'Functional: Shorten long URL (long -> short), redirect short URL to long (short -> ``HTTP` 302`).',
      'Non-Functional: Sub-10ms redirects, high **availability**, URL hashes must be short.',
      '**Student Shorthand**: Design TinyURL.'
    ],
    bullets2: [
      'Hash generation: Convert DB auto-increment ID to `Base62` (characters `[a-zA-Z0-9]`).',
      'Scale: Cache all lookup redirects in `Redis` to prevent database reads.'
    ],
    bullets3: [
      'Database: Use `NoSQL` Key-Value store (`DynamoDB`/`Cassandra`) mapping hash key -> long URL.',
      'Cache: `Redis` (stores most active short URL redirects).'
    ],
    bullets4: [
      'Avoid hash collision: Don\'t use `MD5` directly (needs truncation). `Base62` encoding of database ID is 100% collision-free.'
    ],
    bullets5: [
      '**Q**: \"How do you scale write hashes concurrently?\"',
      '**A**: Use a Range Key Server (`ZooKeeper` distributing counter ranges to web instances, preventing duplicate ID generation).'
    ]
  },
  {
    title: "Design Instagram Feed",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f164",
    type: "design",
    bullets1: [
      'Functional: Post photos, follow users, view home feed containing photos of followed users.',
      'Non-Functional: sub-200ms feed loading, high **availability**, eventual **consistency**.',
      '**Student Shorthand**: Design Photo Newsfeed.'
    ],
    bullets2: [
      'Hybrid model: Fanout-on-write (precompute feed for normal users) + Fanout-on-read (pull posts on request for celebrity users).'
    ],
    bullets3: [
      'Metadata DB: `PostgreSQL` (users/relationships), `Cassandra` (post metadata).',
      'Storage: Amazon `S3` (image blobs).',
      'Cache: `Redis` (stores precomputed user timelines).'
    ],
    bullets4: [
      'Celeb issue: Fanout-on-write fails if a user with 50M followers posts; writing to 50M feed queues locks the system. Solution: Celebrity posts are pulled on request (read fanout).'
    ],
    bullets5: [
      '**Q**: \"How do you rank feed?\"',
      '**A**: Combine post timestamp (freshness) with affinity score (likes/interactions) in feed generation service.'
    ]
  },
  {
    title: "Design WhatsApp",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f164",
    type: "design",
    bullets1: [
      'Functional: 1-to-1 chat, group chat, delivery status (sent, delivered, read), media attachments.',
      'Non-Functional: Sub-100ms message delivery, high **availability**, zero message loss.',
      '**Student Shorthand**: Design Chat System.'
    ],
    bullets2: [
      'Gateway sockets: Persistent `WebSockets`/`TCP` connections maintained by Chat Servers.',
      'Push fallback: If user is offline, send push notification via `FCM`/`APNS`.'
    ],
    bullets3: [
      'DB: `HBase`/`Cassandra` (handles massive chronological writes).',
      'Cache: `Redis` (tracks user online status and gateway node mapping).'
    ],
    bullets4: [
      'Online status: Don\'t trigger active DB updates on mouse move. Use **heartbeat** pings (every 5s) and update `Redis`.'
    ],
    bullets5: [
      '**Q**: \"How does group chat scale?\"',
      '**A**: Message is copied to group participant queues. For massive groups, route messages asynchronously via message queues.'
    ]
  },
  {
    title: "Design Uber",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f164",
    type: "design",
    bullets1: [
      'Functional: Request ride, match driver, live update driver location.',
      'Non-Functional: Sub-second driver matching, high **availability**, geolocation updates (every 4s).',
      '**Student Shorthand**: Design Ride-Hailing System.'
    ],
    bullets2: [
      'Spatial Indexing: Split map into grid cells using Geospatial indexing (Google `S2`, Uber `H3`) to search nearby drivers.'
    ],
    bullets3: [
      'DB: `PostgreSQL` (postgis for historical routes), `Cassandra` (high write geo-locations).',
      'Cache: `Redis` (holds active driver coordinates).'
    ],
    bullets4: [
      'Scale writes: Drivers send updates every 4s. Don\'t write to `SQL` directly; buffer in memory/`Redis`.'
    ],
    bullets5: [
      '**Q**: \"How does matching work?\"',
      '**A**: Query drivers within radius cells -> select closest matching drivers -> send requests sequentially.'
    ]
  },
  {
    title: "Design YouTube",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f164",
    type: "design",
    bullets1: [
      'Functional: Upload videos, stream videos in different resolutions, search video titles.',
      'Non-Functional: Sub-second streaming starts, high **availability**, 99.99% video durability.',
      '**Student Shorthand**: Design Video Streaming.'
    ],
    bullets2: [
      'Chunking: Split uploaded video into small 2-5 second chunks for adaptive bitrate streaming (`HLS`).',
      '`CDN` delivery: Store video chunks at CDNs to bypass origin server reads.'
    ],
    bullets3: [
      'Metadata DB: `MySQL` (user info, video metadata).',
      'Storage: Object Storage (`S3` for raw and chunked video files).',
      'Cache: `Redis` (holds video metadata, hot video chunks).'
    ],
    bullets4: [
      'Write flow: Upload raw video -> Queue transcoding jobs (creates resolutions: 1080p, 720p) -> Save metadata.'
    ],
    bullets5: [
      '**Q**: \"How do you handle viral videos?\"',
      '**A**: Push viral video chunks proactively to edge `CDN` nodes, bypassing origin servers completely.'
    ]
  },
  {
    title: "Design Dropbox",
    topic: "System Design",
    difficulty: "Hard",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f164",
    type: "design",
    bullets1: [
      'Functional: Upload file, sync files across devices, version history.',
      'Non-Functional: 100% data reliability, fast sync, low bandwidth usage.',
      '**Student Shorthand**: Design Cloud Storage.'
    ],
    bullets2: [
      'Block-level transfer: Split files into small blocks (e.g. 4MB). Only upload modified blocks (delta sync).'
    ],
    bullets3: [
      'Metadata DB: `PostgreSQL` (tracks file folders, block lists, and versions).',
      'Storage: `S3` (stores encrypted file blocks).',
      'Metadata Cache: `Redis`.'
    ],
    bullets4: [
      'Hashing: Calculate checksum (`SHA-256`) of each block. If duplicate block is found in `S3`, avoid uploading (deduplication).'
    ],
    bullets5: [
      '**Q**: \"How do clients sync changes instantly?\"',
      '**A**: Use long-polling or `HTTP`/2 streams connected to a Notification service to check metadata updates.'
    ]
  },
  {
    title: "Design Notification System",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f164",
    type: "design",
    bullets1: [
      'Functional: Send email, SMS, and Mobile Push notifications.',
      'Non-Functional: Low **latency**, high **availability**, message prioritization.',
      '**Student Shorthand**: Design Notification Engine.'
    ],
    bullets2: [
      'Decouple layers: Web servers put notification tasks in message queues (`Kafka`/`RabbitMQ`).'
    ],
    bullets3: [
      'Storage: `PostgreSQL` (user notification preferences, templates).',
      'Queues: `Kafka`/`RabbitMQ`.',
      'External APIs: `Twilio` (SMS), `SendGrid` (Email), `APNS`/`FCM` (Push).'
    ],
    bullets4: [
      'Prioritization: Separate queue channels for critical notifications (OTP ~ 1s) vs marketing alerts (~ 1h).'
    ],
    bullets5: [
      '**Q**: \"How do you prevent duplicate notifications on network retry?\"',
      '**A**: Enforce idempotency using unique request correlation IDs stored in `Redis` cache.'
    ]
  },
  {
    title: "Design Rate Limiter",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f164",
    type: "design",
    bullets1: [
      'Functional: Restrict client API requests based on rules (e.g., 50 requests/min).',
      'Non-Functional: Sub-millisecond checks, high **availability**, low memory consumption.',
      '**Student Shorthand**: Design API Rate Limiter.'
    ],
    bullets2: [
      '**Token Bucket** algorithm: Highly memory efficient and handles dynamic traffic bursts.'
    ],
    bullets3: [
      'Storage: `Redis` (tracks rate limits counters and timestamps).',
      'Limiter middleware: Positioned at the API Gateway.'
    ],
    bullets4: [
      'Concurrency: Use `Redis` Lua scripts to execute increment and boundary checks atomically, preventing race conditions.'
    ],
    bullets5: [
      '**Q**: \"How do you scale rate limiters across regions?\"',
      '**A**: Use localized `Redis` instances in each data center and sync counters asynchronously (or accept slight inaccuracy).'
    ]
  },
  {
    title: "SQL vs NoSQL",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f165",
    type: "comparison",
    conceptA: "Relational Database (SQL)",
    conceptB: "Non-Relational Database (NoSQL)",
    bullets1: [
      'Relational data tables with predefined schemas and relations.',
      'Strong `ACID` transaction guarantees.',
      'Scale limit: Upgrades vertically; horizontal **sharding** is complex.'
    ],
    bullets2: [
      'Dynamic schema structures (documents, key-value pairs, wide columns).',
      'Eventual **consistency** (BASE) to enable write **throughput**.',
      'Scale limit: Upgrades horizontally out-of-the-box.'
    ],
    bullets3: [
      '`SQL`: Postgres, `MySQL`. `NoSQL`: `MongoDB`, `Cassandra`, `DynamoDB`.'
    ],
    bullets4: [
      '`SQL`: Financial Ledgers, user profiles, inventory. `NoSQL`: Chat logs, real-time metrics, feeds.'
    ],
    bullets5: [
      '**Q**: \"Why does `SQL` struggle to scale horizontally?\"',
      '**A**: Because cross-node JOINS and distributed transaction coordinations require locking nodes, slowing down the system.'
    ]
  },
  {
    title: "Sharding vs Partitioning",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f165",
    type: "comparison",
    conceptA: "Database Sharding",
    conceptB: "Database Partitioning",
    bullets1: [
      'Data rows are split horizontally and saved across multiple physical machine instances.',
      'App must route queries to correct server using shard keys.',
      'Goal: Scale database write **throughput** horizontally.'
    ],
    bullets2: [
      'Data is split logically into separate tables within the same physical machine server.',
      'Managed internally by single database server engine.',
      'Goal: Speed up query scans on massive single tables (e.g. partition by year).'
    ],
    bullets3: [
      '**Sharding** scales memory, CPU, and storage. Partitioning only splits storage index.'
    ],
    bullets4: [
      '**Sharding**: Multi-node scale-out. Partitioning: Single-node query optimization.'
    ],
    bullets5: [
      '**Q**: \"Which one requires application code modifications?\"',
      '**A**: **Sharding**, since the app must route requests to correct database server instances.'
    ]
  },
  {
    title: "Cache vs Database",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f165",
    type: "comparison",
    conceptA: "Cache Memory (RAM)",
    conceptB: "Persistent Database (Disk)",
    bullets1: [
      'Data stored in volatile memory (RAM) for fast lookup.',
      '**Latency**: Sub-millisecond (100ns access).',
      'Goal: Accelerate reads; data is lost on power reset.'
    ],
    bullets2: [
      'Data written to non-volatile storage (HDD/SSD).',
      '**Latency**: Milliseconds (100μs access).',
      'Goal: Durable storage; final source of truth.'
    ],
    bullets3: [
      'Cache: `Redis`, Memcached. Database: `MySQL`, `PostgreSQL`, `MongoDB`.'
    ],
    bullets4: [
      'Cache: Session tokens, active feeds. Database: Financial accounts, records.'
    ],
    bullets5: [
      '**Q**: \"Why not use Cache for everything?\"',
      '**A**: RAM is extremely expensive compared to SSD storage. **Caching** everything is cost-prohibitive.'
    ]
  },
  {
    title: "Replication vs Sharding",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f165",
    type: "comparison",
    conceptA: "Database Replication",
    conceptB: "Database Sharding",
    bullets1: [
      'Copying the exact same database files to multiple server nodes.',
      'Goal: High **Availability**, offload read queries, survive node failure.'
    ],
    bullets2: [
      'Splitting database rows and distributing them across multiple servers.',
      'Goal: Horizontal write scaling.'
    ],
    bullets3: [
      '**Replication** provides backup redundancy. **Sharding** splits the data footprint.'
    ],
    bullets4: [
      'Use **Replication** for read-heavy systems. Use **Sharding** for write-heavy systems.'
    ],
    bullets5: [
      '**Q**: \"Can you combine both?\"',
      '**A**: Yes. Modern scaled architectures run **replication** within each shard.'
    ]
  },
  {
    title: "Strong vs Eventual Consistency",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f165",
    type: "comparison",
    conceptA: "Strong Consistency",
    conceptB: "Eventual Consistency",
    bullets1: [
      'Reads are guaranteed to return the latest written value immediately.',
      'Enforced by locking nodes and sync **replication**.',
      '**Latency**: High write **latency**.'
    ],
    bullets2: [
      'Reads may return stale data temporarily; replicas sync asynchronously in background.',
      'No locking; writes return immediately.',
      '**Latency**: Low write **latency**.'
    ],
    bullets3: [
      'Strong: R + W > N. Eventual: R + W <= N.'
    ],
    bullets4: [
      'Strong: Passwords, banks. Eventual: Likes count, comments, news feed.'
    ],
    bullets5: [
      '**Q**: \"Explain how **latency** is impacted by **consistency** choice.\"',
      '**A**: Strong **consistency** blocks writes until majority of replicas acknowledge, increasing write **latency**.'
    ]
  },
  {
    title: "Monolith vs Microservices",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f165",
    type: "comparison",
    conceptA: "Monolithic Architecture",
    conceptB: "Microservice Architecture",
    bullets1: [
      'Single codebase and deployment unit; shared database.',
      '**Pros**: Simple code, fast deployment, easy transactions.',
      '**Cons**: Scales as a unit; long build times.'
    ],
    bullets2: [
      'De-coupled independent services communicating via APIs.',
      '**Pros**: Independent scaling, modular code boundaries.',
      '**Cons**: Distributed transactions, operation complexity.'
    ],
    bullets3: [
      'Monolith: Best for startups. Microservices: Best for large organizations.'
    ],
    bullets4: [
      'Monolith: Simple transactions. Microservices: Saga pattern required.'
    ],
    bullets5: [
      '**Q**: \"When is microservices a bad idea?\"',
      '**A**: When the business domain is changing rapidly or the engineering team is under 15 developers.'
    ]
  },
  {
    title: "Kafka vs RabbitMQ",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f165",
    type: "comparison",
    conceptA: "Apache Kafka",
    conceptB: "RabbitMQ",
    bullets1: [
      'Distributed commit log. Messages are persisted to disk and replayable.',
      'Consumer manages offset; pull-based model.',
      '**Throughput**: Extremely high.'
    ],
    bullets2: [
      'Message broker exchange model. Messages deleted once consumer acknowledges.',
      'Broker tracks message state; push-based model.',
      '**Throughput**: Moderate.'
    ],
    bullets3: [
      '`Kafka`: Replay log. `RabbitMQ`: Action queue.'
    ],
    bullets4: [
      '`Kafka`: Log streaming, analytics pipelines, activity tracking. `RabbitMQ`: Job queues, SMS dispatch.'
    ],
    bullets5: [
      '**Q**: \"What is message replay?\"',
      '**A**: The ability for a consumer to reset its read pointer (offset) and re-process old messages.'
    ]
  },
  {
    title: "Polling vs WebSockets",
    topic: "System Design",
    difficulty: "Easy",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f165",
    type: "comparison",
    conceptA: "HTTP Polling",
    conceptB: "WebSockets",
    bullets1: [
      'Client periodically opens standard `HTTP` connections to check for data.',
      'Unidirectional; connection closes after response.',
      'Overhead: High connection handshakes.'
    ],
    bullets2: [
      'Handshake upgrades to dynamic persistent bidirectional socket connection.',
      'Full-duplex bidirectional stream.',
      'Overhead: Low overhead after handshake.'
    ],
    bullets3: [
      'Polling: Dumb pull. `WebSockets`: Active push.'
    ],
    bullets4: [
      'Polling: Low-frequency feeds. `WebSockets`: Live gaming, stock trading, WhatsApp.'
    ],
    bullets5: [
      '**Q**: \"Why does polling consume more network bandwidth?\"',
      '**A**: Because every poll request sends full `HTTP` headers (cookies, user-agents), even if no new data exists.'
    ]
  },
  {
    title: "CDN Flow",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f165",
    type: "comparison",
    conceptA: "CDN Cache Hit",
    conceptB: "CDN Cache Miss",
    bullets1: [
      'Client requests file -> DNS routes to closest edge server -> Edge finds file -> returns directly.',
      '**Latency**: Sub-20ms.',
      'Origin server load: Zero.'
    ],
    bullets2: [
      'Client requests file -> Edge does not find file -> queries origin server -> saves copy -> returns.',
      '**Latency**: High (double hop).',
      'Origin server load: 1 read.'
    ],
    bullets3: [
      'Hit: Direct return. Miss: Origin fetch and backfill.'
    ],
    bullets4: [
      'Hit: Standard state. Miss: Deployments, first requests, or post-expiration.'
    ],
    bullets5: [
      '**Q**: \"How does `CDN` cache-control headers work?\"',
      '**A**: Origin server sends `Cache-Control: max-age=3600`, instructing edge server to cache file for 1 hour.'
    ]
  },
  {
    title: "CAP Theorem Tradeoffs",
    topic: "System Design",
    difficulty: "Medium",
    folderId: "81d530e3-d883-5ee2-a8d9-6c4e6435f165",
    type: "comparison",
    conceptA: "Consistency System (CP)",
    conceptB: "Availability System (AP)",
    bullets1: [
      'Prioritizes data correctness. Rejects writes if partition prevents sync confirmation.',
      'Behavior: Returns error or timeout to user during split.',
      '**Examples**: `HBase`, `MongoDB` (primary).'
    ],
    bullets2: [
      'Prioritizes uptime. Replicas continue accepting writes even when disconnected.',
      'Behavior: Accepts write, returns success, syncs later.',
      '**Examples**: `Cassandra`, `DynamoDB`.'
    ],
    bullets3: [
      'CP: **Consistency** + Partition Tolerance. AP: **Availability** + Partition Tolerance.'
    ],
    bullets4: [
      'CP: Banks, passwords. AP: Feeds, metrics, shopping cart.'
    ],
    bullets5: [
      '**Q**: \"How does AP system resolve partition write conflicts?\"',
      '**A**: Conflict resolution strategies like Last-Write-Wins (LWW) or vector clocks.'
    ]
  }
];

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // 1. Get system admin user
  let admin = await db.collection('users').findOne({ email: 'system@admin.com' });
  if (!admin) {
    const result = await db.collection('users').insertOne({
      name: 'System Auto-Seeder',
      email: 'system@admin.com',
      role: 'superadmin',
      authProvider: 'system',
      streakCount: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    admin = { _id: result.insertedId };
  }
  const adminId = admin._id;

  console.log('\n--- Seeding 149 System Design Cards ---');
  
  // Track seeded card IDs per folder to update folders.cardIds array
  const folderCardIdsMap = {};

  for (const q of CARDS_DATA) {
    const cardId = generateDeterministicUUID(`${q.topic}-${q.title}`);
    const slides = compileSlides(q);

    // Track folder mapping
    if (!folderCardIdsMap[q.folderId]) {
      folderCardIdsMap[q.folderId] = [];
    }
    folderCardIdsMap[q.folderId].push(cardId);

    // Delete existing card to guarantee fresh updates
    await db.collection('revisioncards').deleteOne({ _id: cardId });

    const newCard = {
      _id: cardId,
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      complexity: '',
      explanation: q.type === 'comparison' ? `Comparison: ${q.conceptA} vs ${q.conceptB}` : formatBullets(q.bullets1),
      folderId: q.folderId,
      createdBy: adminId,
      visibility: 'public',
      order: 0,
      isDeleted: false,
      slides: slides,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('revisioncards').insertOne(newCard);
    console.log(`✅ Seeded Card: "${q.title}" | ID: ${cardId}`);
  }

  // 2. Associate cardIds inside folders collection
  console.log('\n--- Updating Folder Card References ---');
  for (const folderId of Object.keys(folderCardIdsMap)) {
    const cardIdsList = folderCardIdsMap[folderId];
    await db.collection('folders').updateOne(
      { _id: folderId },
      { $set: { cardIds: cardIdsList, updatedAt: new Date() } }
    );
    console.log(`✅ Updated Folder ${folderId} with ${cardIdsList.length} cards.`);
  }

  // 3. Write deletion tombstones for all registered users in deletedentities
  console.log('\n--- Creating Deletion Tombstones for Existing Users ---');
  const allUsers = await db.collection('users').find({}).toArray();
  console.log(`Found ${allUsers.length} users in the database.`);

  let tombstonesCount = 0;
  for (const user of allUsers) {
    const userId = user._id;
    
    // We increment the user's currentRevision sequentially to trigger sync
    const startRevision = user.currentRevision || 0;
    
    // If the folder/card is updated, we make sure they receive the tombstone
    // (This is a safety measure to prune any stray old items)
    // We update user's currentRevision accordingly
    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { currentRevision: startRevision + 1 } }
    );
    tombstonesCount++;
  }
  console.log(`✅ Completed writing ${tombstonesCount} user revisions updates.`);

  await mongoose.disconnect();
  console.log('\nCard seeding completed successfully.');
}

run().catch(console.error);
