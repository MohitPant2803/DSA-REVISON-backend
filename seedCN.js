require('dotenv').config();
const mongoose = require('mongoose');
const { randomUUID, createHash } = require('crypto');

const mongoUri = process.env.MONGO_URI;
const CN_PARENT_ID = '38ecba9d-004b-58eb-93b6-323767a4f3e9';
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

function formatBullets(arr) {
  if (!arr || arr.length === 0) return '';
  return arr.map(item => `• ${item}`).join('\n\n');
}

// 12 Subfolder Definitions
const SUBFOLDERS = [
  { title: 'Network Fundamentals', description: 'LAN, MAN, WAN, topologies, devices, and transmission modes.', icon: 'cpu', color: '#10B981', order: 1 },
  { title: 'OSI Model', description: 'Layer duties, encapsulation, and standard OSI comparisons.', icon: 'layers', color: '#10B981', order: 2 },
  { title: 'TCP/IP Model', description: 'TCP/IP architecture, layering comparisons, and packet encapsulation.', icon: 'layout', color: '#10B981', order: 3 },
  { title: 'Physical Layer', description: 'Transmission media, switching, and hardware-level operations.', icon: 'activity', color: '#10B981', order: 4 },
  { title: 'Data Link Layer', description: 'Framing, error detection (CRC), sliding window, MAC, and Ethernet.', icon: 'link', color: '#10B981', order: 5 },
  { title: 'Network Layer', description: 'IP addressing, subnetting, CIDR, ARP, NAT, and routing basics.', icon: 'globe', color: '#10B981', order: 6 },
  { title: 'Transport Layer', description: 'TCP vs UDP, headers, flow control, and congestion control.', icon: 'zap', color: '#10B981', order: 7 },
  { title: 'Application Layer', description: 'HTTP, HTTPS, DNS, DHCP, FTP, SMTP, POP3, and IMAP.', icon: 'chrome', color: '#10B981', order: 8 },
  { title: 'Routing Algorithms', description: 'Distance Vector, Link State, RIP, OSPF, and BGP.', icon: 'git-branch', color: '#10B981', order: 9 },
  { title: 'Congestion and Flow Control', description: 'Stop and Wait, Go Back N, Selective Repeat, and queue algorithms.', icon: 'sliders', color: '#10B981', order: 10 },
  { title: 'Network Security', description: 'SSL/TLS handshake, firewalls, VPNs, and symmetric/asymmetric keys.', icon: 'shield', color: '#10B981', order: 11 },
  { title: 'Most Asked Interview Questions', description: 'High-yield placement questions (URL type, TCP handshake, ARP flow).', icon: 'help-circle', color: '#10B981', order: 12 }
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
  else if (q.type === 'numerical') {
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
  else if (q.type === 'protocol') {
    slides.push({
      headline: '💡 How It Works',
      body: formatBullets(q.howItWorks),
      type: 'explanation'
    });
    slides.push({
      headline: 'Packet / Request Flow',
      body: formatBullets(q.packetFlow),
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

  return slides;
}

const CN_CARDS_DATA = {
  'Network Fundamentals': [
    {
      title: 'What is a Computer Network',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **Computer Network** is a set of interconnected nodes (devices) that communicate with each other using shared protocols over physical links.',
      explanation: [
        'Enables sharing of hardware, software, files, and processing power.',
        'Uses standard rules (protocols) to format, transmit, and check for errors in packets.',
        'Physical links can be guided (cables) or unguided (wireless).'
      ],
      intuition: [
        'An interviewer expects nodes to mean hosts, routers, switches, gateways, etc., rather than just PCs. Think of the network as a graph: nodes are devices, edges are communication links.'
      ],
      takeaways: [
        'Primary purpose: resource sharing and data communication.',
        'Devices are called **Nodes**; links are called **Channels**.',
        'Protocols govern nodes behavior.'
      ]
    },
    {
      title: 'Network Types (LAN, MAN, WAN)',
      difficulty: 'Easy',
      type: 'comparison',
      intro: 'Networks are categorized by their geographic span, ownership, and transmission speed.',
      conceptA: 'LAN (Local Area Network)',
      conceptA_bullets: [
        'Spans small areas like homes, offices, or labs.',
        'Very high data transfer rates (Gbps/10Gbps).',
        'Private ownership with extremely low propagation delay.'
      ],
      conceptB: 'WAN (Wide Area Network)',
      conceptB_bullets: [
        'Spans massive geographic regions (countries/continents).',
        'Relatively lower speeds and higher propagation delay.',
        'Owned by public companies or telecom providers (e.g., Internet).'
      ],
      comparisonTable: [
        '**Scope**: Small (LAN) ➔ Medium (MAN) ➔ Continental (WAN)',
        '**Speed**: High (Gbps) ➔ Medium (Mbps) ➔ Variable',
        '**Error Rate**: Very low ➔ Moderate ➔ High',
        '**Examples**: Home Wi-Fi ➔ City Cable network ➔ The Internet'
      ],
      intuition: [
        'Understand that the key differences are **propagation delay** and **packet loss rate**. LANs are clean and fast, WANs are noisy, slower, and route-dense.'
      ]
    },
    {
      title: 'Network Topologies',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A **Network Topology** describes the geometric arrangement or physical connection of devices in a network.',
      explanation: [
        '**Mesh**: Every node connects directly to every other node. Fully redundant, most expensive.',
        '**Star**: Every node connects to a central Hub/Switch. Single point of failure (Hub), easy installation.',
        '**Bus**: Nodes share a single transmission line (backbone). Easy setup, cabling breakdown stops all.',
        '**Ring**: Nodes connect in a closed circular loop. Token passing required, unidirectional flow.'
      ],
      intuition: [
        'Mesh topology formulas are high-frequency: A fully connected mesh of N nodes requires `N * (N - 1) / 2` duplex links, and each node needs `N - 1` I/O ports.'
      ],
      takeaways: [
        'Mesh has max redundancy, Star has central dependency, Bus has backbone dependency.',
        'Star is most common in modern LAN setups.'
      ]
    },
    {
      title: 'Network Devices',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Interconnecting networks requires specialized hardware operating at different layers of the OSI model.',
      explanation: [
        '**Repeater / Hub**: Physical layer devices. Regenerate signals; Hub broadcasts to all ports.',
        '**Bridge / Switch**: Data Link layer devices. Switch filters and forwards frames using MAC addresses.',
        '**Router**: Network layer device. Forwards packets across distinct networks using IP addresses.',
        '**Gateway**: Application layer. Connects heterogeneous networks using different protocol families.'
      ],
      intuition: [
        'Remember collision vs broadcast domains. Hub: 1 collision, 1 broadcast. Switch: N collision domains (1 per port), 1 broadcast domain. Router: N collision domains, N broadcast domains.'
      ],
      takeaways: [
        'Hub = Broadcast (Physical Layer).',
        'Switch = MAC based switching (Data Link Layer).',
        'Router = IP routing (Network Layer).'
      ]
    },
    {
      title: 'Transmission Modes',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Transmission mode defines the direction of signal flow between two connected devices.',
      explanation: [
        '**Simplex**: Unidirectional communication. One device transmits, the other only receives (e.g., Keyboard, TV).',
        '**Half-Duplex**: Bidirectional communication, but **not simultaneously**. Devices must take turns (e.g., Walkie-Talkie).',
        '**Full-Duplex**: Simultaneous bidirectional communication. Both devices can send/receive at the same time (e.g., Mobile Phone).'
      ],
      intuition: [
        'Half-duplex channels require arbitration (collision detection, e.g., CSMA/CD). Full-duplex channels split bandwidth into two separate paths, avoiding collisions.'
      ],
      takeaways: [
        'Simplex: One-way street.',
        'Half-Duplex: Single lane bridge (one direction at a time).',
        'Full-Duplex: Two-way highway.'
      ]
    }
  ],
  'OSI Model': [
    {
      title: 'Introduction to OSI',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **OSI (Open Systems Interconnection) Model** is a 7-layer conceptual framework developed by the ISO to standardize network communications.',
      explanation: [
        'Abstracts system interactions into distinct, independent layers.',
        'Each layer provides services to the layer above it and requests services from the layer below.',
        'Enables multivendor hardware compatibility.'
      ],
      intuition: [
        'OSI is a **logical model**, not a physical implementation. Memorize layers from bottom to top: Physical, Data Link, Network, Transport, Session, Presentation, Application (Mnemonic: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way).'
      ],
      takeaways: [
        '7-layer conceptual framework.',
        'Each layer has unique headers and trailer (Data Link).',
        'Standardized communication interfaces.'
      ]
    },
    {
      title: 'Physical Layer',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Physical Layer (Layer 1)** deals with the physical connection of devices and raw bit stream transmission over physical media.',
      explanation: [
        'Defines connectors, pins, voltage levels, cabling types, and line coding.',
        'Handles bit synchronization (sender/receiver clocks alignment).',
        'Defines physical transmission rates (bps) and topologies.'
      ],
      intuition: [
        'This layer deals with bits (`1`s and `0`s) as electrical/optical/radio signals. It has no concept of packets, frames, or destinations.'
      ],
      takeaways: [
        'Unit: **Bits**.',
        'Responsibilities: Pin configurations, signaling, encoding, bit rate control.',
        'Devices: Cables, Repeaters, Hubs, Modems.'
      ]
    },
    {
      title: 'Data Link Layer',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Data Link Layer (Layer 2)** provides reliable hop-to-hop node communication over a physical link.',
      explanation: [
        '**Framing**: Packages bits from physical layer into logical units called frames.',
        '**Physical Addressing**: Adds MAC addresses of sender and receiver to the frame header.',
        '**Flow Control**: Prevents fast senders from overwhelming slow receivers.',
        '**Error Control**: Appends checksum/CRC trailer to detect corrupted bits.'
      ],
      intuition: [
        'Data Link Layer handles **local delivery** on the same subnet. Routers strip Layer 2 headers/trailers and rewrite them at each hop, while IP remains unchanged.'
      ],
      takeaways: [
        'Unit: **Frames**.',
        'Responsibilities: Framing, Error/Flow control, MAC addressing.',
        'Sublayers: LLC (Logical Link Control) and MAC (Media Access Control).'
      ]
    },
    {
      title: 'Network Layer',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Network Layer (Layer 3)** manages host-to-host packet delivery across distinct, heterogeneous networks.',
      explanation: [
        '**Routing**: Determines the optimal path from source to destination across multiple networks.',
        '**Logical Addressing**: Uses IP addresses to identify devices globally.',
        '**Fragmentation**: Splits packets if they exceed the link\'s Maximum Transmission Unit (MTU).'
      ],
      intuition: [
        'While Layer 2 manages hop-to-hop link delivery, Layer 3 handles **end-to-end logical delivery**. Routers use IP headers to make path decisions.'
      ],
      takeaways: [
        'Unit: **Packets**.',
        'Responsibilities: Logical addressing (IP), Routing, Fragmentation/Reassembly.',
        'Protocols: IPv4, IPv6, ICMP, ARP.'
      ]
    },
    {
      title: 'Transport Layer',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Transport Layer (Layer 4)** provides process-to-process reliable, end-to-end data delivery.',
      explanation: [
        '**Port Addressing**: Directs packet stream to specific applications using port numbers.',
        '**Segmentation & Reassembly**: Splits message into segments at source and reconstructs them at destination.',
        '**Connection Control**: Manages setup and teardown (connection-oriented vs connectionless).',
        '**Flow & Congestion Control**: Matches transfer speed and throttles sender during network congestion.'
      ],
      intuition: [
        'The Transport Layer is responsible for **process-to-process delivery** (using Port numbers, e.g., HTTP = 80). Layer 3 only gets it to the destination machine, Layer 4 gets it to the correct running program.'
      ],
      takeaways: [
        'Unit: **Segments** (TCP) / **Datagrams** (UDP).',
        'Responsibilities: Process addressing, Reliability, Flow/Congestion control.',
        'Key Protocols: TCP and UDP.'
      ]
    },
    {
      title: 'Session Layer',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Session Layer (Layer 5)** establishes, manages, synchronizes, and terminates dialogs between network applications.',
      explanation: [
        '**Dialog Control**: Determines full-duplex or half-duplex turn-taking dialog.',
        '**Synchronization**: Injects checkpoints into streams so transfers can resume from the last point after a crash.',
        '**Session Restoration**: Re-establishes broken transport connections seamlessly.'
      ],
      intuition: [
        'Think of downloading a 2GB file. If connection drops at 1.5GB, the Session layer uses checkpoints to resume downloading rather than restarting from zero.'
      ],
      takeaways: [
        'Responsibilities: Dialog control, Synchronization checkpoints.',
        'Rarely implemented as a distinct protocol in TCP/IP (merged into Application).'
      ]
    },
    {
      title: 'Presentation Layer',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Presentation Layer (Layer 6)** manages syntax and semantics of the transmitted information.',
      explanation: [
        '**Translation**: Converts data from application formats to common network formats (e.g., ASCII/EBCDIC).',
        '**Encryption/Decryption**: Encrypts data for security before transmission.',
        '**Compression**: Reduces data size for bandwidth efficiency.'
      ],
      intuition: [
        'This is the "translator" layer. It formats data (JSON, XML, Encryption like SSL/TLS) so the Application layer can read it.'
      ],
      takeaways: [
        'Responsibilities: Translation, Encryption/Decryption, Compression.',
        'Acts as the data format translator.'
      ]
    },
    {
      title: 'Application Layer',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Application Layer (Layer 7)** provides direct network services to user applications and software interfaces.',
      explanation: [
        'Acts as the window through which software interacts with the network.',
        'Provides services like file transfer, email client support, database access, and remote terminal connections.',
        'Common interfaces: Browsers, Email Clients.'
      ],
      intuition: [
        'Note: This layer is **not** the web browser itself, but the protocol (like HTTP) that the browser calls to perform web transfers.'
      ],
      takeaways: [
        'Responsibilities: User interface, file/mail transfer support.',
        'Key Protocols: HTTP, HTTPS, FTP, DNS, SMTP.'
      ]
    }
  ],
  'TCP/IP Model': [
    {
      title: 'TCP/IP Architecture',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **TCP/IP Model** (Internet Protocol Suite) is a 4-layer functional framework used to run the modern Internet.',
      explanation: [
        '**Link Layer**: Handles physical transmission and network interfaces (combines OSI Layers 1 and 2).',
        '**Internet Layer**: Handles logical addressing and global packet routing (OSI Layer 3).',
        '**Transport Layer**: Manages host-to-host process communication (OSI Layer 4).',
        '**Application Layer**: Exposes communication interfaces to applications (combines OSI Layers 5, 6, 7).'
      ],
      intuition: [
        'TCP/IP is a practical, protocol-driven architecture. Unlike OSI, it was created after its protocols (TCP, IP, UDP) were already running successfully.'
      ],
      takeaways: [
        '4-layer architecture.',
        'The foundation of the modern Internet.',
        'Simpler and more direct than OSI.'
      ]
    },
    {
      title: 'OSI vs TCP/IP',
      difficulty: 'Easy',
      type: 'comparison',
      intro: 'While OSI is an academic reference model, TCP/IP is the actual operational model of the Internet.',
      conceptA: 'OSI Model',
      conceptA_bullets: [
        '7 logical layers (strict boundaries).',
        'Independent of specific protocols.',
        'Distinguishes strictly between services, interfaces, and protocols.'
      ],
      conceptB: 'TCP/IP Model',
      conceptB_bullets: [
        '4 layers (more relaxed and practical).',
        'Protocol-dependent (centered around IP and TCP).',
        'Combines physical/link layers and application/presentation/session layers.'
      ],
      comparisonTable: [
        '**Layer Count**: 7 layers ➔ 4 layers',
        '**Approach**: Theoretical/Academic ➔ Practical/Implementation',
        '**Data Delivery**: Connectionless & Connection-oriented (Network Layer) ➔ Connectionless only (Network/Internet Layer)'
      ],
      intuition: [
        'In interviews, state that OSI is excellent for theoretical learning and diagnostics, whereas TCP/IP is the actual standard that devices execute.'
      ]
    },
    {
      title: 'Encapsulation & Decapsulation',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Data flows down the sender stack (Encapsulation) and up the receiver stack (Decapsulation), changing unit wrappers at each layer.',
      explanation: [
        '**Encapsulation**: At each layer, header information is prepended to the data payload from above. The Data Link Layer also appends a trailer (FCS).',
        '**Decapsulation**: The receiver reads, processes, and strips off the layer header as the payload moves up the stack.',
        'Each layer only interacts with its peer layer on the remote host.'
      ],
      intuition: [
        'Think of sending a letter: you write it (Application Data), put it in an envelope (Transport Segment), write the address (Network Packet), and load it into a shipping box (Data Link Frame).'
      ],
      takeaways: [
        'Encapsulation = Adding headers downwards.',
        'Decapsulation = Stripping headers upwards.',
        'Maintains logical peer-to-peer layer conversations.'
      ]
    }
  ],
  'Physical Layer': [
    {
      title: 'Transmission Media',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Transmission media carries the raw bit signals across physical channels between sender and receiver.',
      explanation: [
        '**Twisted Pair**: Copper wires twisted together to reduce electromagnetic interference (crosstalk). Common in Ethernet.',
        '**Coaxial Cable**: Solid copper core wrapped in shielding. High bandwidth, common in TV cable.',
        '**Fiber Optic**: Glass/plastic cores conducting light pulses. Maximum bandwidth, lowest attenuation, immune to noise.',
        '**Wireless**: Unguided media using electromagnetic waves (Radio, Microwave, Infrared) to transmit signals.'
      ],
      intuition: [
        'Fiber optics utilize **Total Internal Reflection** to guide light beams over thousands of miles with negligible loss. It is the backbone of global subsea cables.'
      ],
      takeaways: [
        'Guided: Twisted pair, Coaxial, Fiber.',
        'Unguided: Radio waves, Microwaves, Infrared.',
        'Fiber optic offers the highest throughput and distance.'
      ]
    },
    {
      title: 'Switching Techniques',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Switching is the process of forwarding signals through intermediate nodes from source to destination.',
      explanation: [
        '**Circuit Switching**: Establishes a dedicated physical path between nodes. Bandwidth is reserved and guaranteed.',
        '**Packet Switching**: Divides data into packets routed independently. Resources are shared dynamically (statistical multiplexing).',
        '**Message Switching**: Sends the entire message block, storing and forwarding it at each intermediate node. (Largely deprecated).'
      ],
      intuition: [
        'Compare a phone call (Circuit: dedicated line, busy tone if occupied) vs web browsing (Packet: shared link, packets from different users interleave).'
      ],
      takeaways: [
        'Circuit Switching = Dedicated path, reserved resource.',
        'Packet Switching = Shared path, dynamic routing, store-and-forward delay.'
      ]
    },
    {
      title: 'Circuit vs Packet Switching',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'Circuit and packet switching manage network bandwidth and routing under fundamentally different constraints.',
      conceptA: 'Circuit Switching',
      conceptA_bullets: [
        'Connection setup phase required before transmission.',
        'Zero queueing delay; dedicated path bandwidth.',
        'Inefficient for bursty traffic (idle links waste resources).'
      ],
      conceptB: 'Packet Switching',
      conceptB_bullets: [
        'No prior connection path reservation (connectionless routing).',
        'Packets experience queueing, serialization, and propagation delays.',
        'Highly efficient; handles bursty data traffic cleanly.'
      ],
      comparisonTable: [
        '**Bandwidth Reservation**: Yes ➔ No (Dynamic)',
        '**Setup Phase**: Required ➔ None',
        '**Congestion**: Cannot occur once connection is set ➔ Occurs in queues (packet drop)'
      ],
      intuition: [
        'Circuit switching is optimized for real-time constant voice/video feeds. Packet switching is optimized for dynamic, bursty, data-heavy web traffic.'
      ]
    }
  ],
  'Data Link Layer': [
    {
      title: 'Framing',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Framing is the process of encapsulating packet data into distinct frames with markers so the receiver can detect boundaries.',
      explanation: [
        '**Character Count**: Header field specifies frame length. Risk: if count gets corrupted, all subsequent frames desynchronize.',
        '**Byte Stuffing**: Uses flag bytes (e.g., `ESC`) to wrap frame data. Escape bytes are stuffed before flags inside data.',
        '**Bit Stuffing**: Inserts a `0` bit after five consecutive `1`s in data to prevent it from matching the flag bit pattern (`01111110`).'
      ],
      intuition: [
        'In bit stuffing: Sender checks data stream. If it sees `11111`, it inserts a `0` immediately. Receiver sees `11111`, checks the next bit: if `0`, it strips it; if `1` and next is `0`, it is a Flag.'
      ],
      takeaways: [
        'Prevents receivers from misinterpreting raw bits.',
        'Bit stuffing is bit-level boundary demarcation.',
        'Byte stuffing is byte-level boundary demarcation.'
      ]
    },
    {
      title: 'Error Detection Techniques',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Error detection techniques add redundant bits to frames so the receiver can verify if data was modified during transit.',
      explanation: [
        '**Simple Parity**: Appends a single bit to make total `1`s count even or odd. Cannot detect even-numbered bit errors.',
        '**Checksum**: Sender splits frame into 16-bit integers, sums them using 1s complement arithmetic, and appends complement. Receiver verifies sum is all `1`s.',
        '**Cyclic Redundancy Check (CRC)**: Uses binary polynomial division. Highly robust, implemented in hardware.'
      ],
      intuition: [
        'Note: Error **detection** simply drops corrupted frames. Error **correction** (e.g., Hamming Code) corrects minor bit flips but has higher bit overhead.'
      ],
      takeaways: [
        'Parity: Simple, low overhead, weak.',
        'Checksum: Software friendly (used in IP/TCP headers).',
        'CRC: Hardware friendly, mathematically robust.'
      ]
    },
    {
      title: 'CRC',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Cyclic Redundancy Check (CRC) uses binary division modulo 2 to calculate a remainder appended to the frame.',
      step1: 'Identify the divisor polynomial of degree G. Append G zero bits to the sender data frame.',
      step2: 'Perform modulo 2 division (XOR operations instead of subtraction) of the modified frame by the divisor.',
      step3: 'Extract the remainder of size G bits, replace the appended zeroes at the end of the frame with this remainder.',
      answer: 'Sender transmits: Frame + Remainder. Receiver divides the incoming frame by the same divisor. If remainder is 0, no errors occurred; else, packet is dropped.',
      shortcut: 'Modulo 2 XOR rule: `0 XOR 0 = 0`, `1 XOR 1 = 0`, `0 XOR 1 = 1`, `1 XOR 0 = 1`. Do not carry over arithmetic borrows.'
    },
    {
      title: 'MAC Address',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **MAC (Media Access Control) Address** is a 48-bit physical identifier burned into the Network Interface Card (NIC).',
      explanation: [
        'Unique address for hop-to-hop communication on local subnets.',
        'Written in hexadecimal notation (e.g., `00:1A:2B:3C:4D:5E`).',
        '**OUI (Organizationally Unique Identifier)**: First 24 bits identify vendor. Remaining 24 bits are device specific.'
      ],
      intuition: [
        'IP address changes when you connect to different Wi-Fi routers. MAC address is physical and never changes; it is the unique hardware fingerprint of the network interface.'
      ],
      takeaways: [
        '48-bit physical address (Layer 2).',
        'OUI (Vendor code) + NIC Specific ID.',
        'Flat address space, not hierarchical.'
      ]
    },
    {
      title: 'Ethernet',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Ethernet** (IEEE 802.3) is the dominant physical cabling and frame protocol standard for wired LANs.',
      explanation: [
        'Uses **CSMA/CD** (Carrier Sense Multiple Access with Collision Detection) to manage access on shared media.',
        'Ethernet frame contains: Preamble, SFD (Start Frame Delimiter), Destination MAC, Source MAC, EtherType, Data Payload, and FCS (CRC-32 trailer).',
        'Minimum Ethernet frame size is **64 bytes** (to ensure collision detection works before transmission ends).'
      ],
      intuition: [
        'Formula for min frame size: `Frame Size >= 2 * Propagation Time * Bandwidth`. If the frame is too short, the sender finishes sending before the collision signal reaches it.'
      ],
      takeaways: [
        'IEEE 802.3 standard.',
        'Min frame size: 64 bytes (CSMA/CD constraint).',
        'FCS trailer contains CRC-32 checksum.'
      ]
    }
  ],
  'Network Layer': [
    {
      title: 'IP Addressing',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'An **IP Address** is a logical identifier used to address and route packets globally across the network layer.',
      explanation: [
        '**IPv4**: 32-bit address, dotted-decimal notation (e.g., `192.168.1.1`). Total space: ~4.3 billion IPs.',
        '**IPv6**: 128-bit address, hexadecimal colon notation (e.g., `2001:db8::ff00:42:8329`). Practically infinite space.',
        'Hierarchical routing: divided into Network ID (routing) and Host ID (local interface).'
      ],
      intuition: [
        'Network prefix routing is how routers scale. Routers only route packets based on the network prefix, not individual host addresses, keeping routing tables small.'
      ],
      takeaways: [
        'Logical address (Layer 3).',
        'IPv4 = 32-bits (4 bytes).',
        'IPv6 = 128-bits (16 bytes).'
      ]
    },
    {
      title: 'IPv4',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **IPv4 Header** contains essential fields for logical addressing, path routing, and packet assembly.',
      explanation: [
        '**TTL (Time to Live)**: 8-bit hop counter decremented by 1 at each router. Prevents packet loops (dropped if TTL reaches 0).',
        '**Protocol**: Specifies the Transport Layer protocol (TCP = 6, UDP = 17) to hand the payload to.',
        '**Flags & Fragment Offset**: Used to fragment and reconstruct packets when crossing interfaces with smaller MTUs.'
      ],
      intuition: [
        'Interviewers love TTL questions. If a packet gets stuck in a loop, it will rotate forever unless TTL kills it. ICMP TTL Expired is sent back, which is how Traceroute works.'
      ],
      takeaways: [
        'Standard header size: 20 to 60 bytes (Options field).',
        'TTL prevents infinite routing loops.',
        'Fragment offset allows reassembly at target host.'
      ]
    },
    {
      title: 'IPv6',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**IPv6** replaces IPv4 to solve address exhaustion and streamline routing operations.',
      explanation: [
        'Massive 128-bit space eliminates the absolute dependency on NAT.',
        'Simplified fixed-size 40-byte base header (faster hardware processing).',
        'No header checksum (errors handled at Layers 2 and 4 to boost speed).',
        'No router fragmentation: source host path-discovery is mandatory.'
      ],
      intuition: [
        'By making the base header size fixed (40 bytes), router hardware can process packet fields in parallel pipelines rather than calculating variable offsets.'
      ],
      takeaways: [
        '128-bit address space.',
        'Fixed base header size of 40 bytes.',
        'Eliminates mid-network fragmentation.'
      ]
    },
    {
      title: 'Subnetting',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Subnetting divides a large network block into smaller, isolated logical subnets to optimize security and broadcast traffic.',
      step1: 'Determine the number of subnets needed. Convert this value to bits `2^S >= Subnets`. Borrow S bits from Host ID.',
      step2: 'Write the new Subnet Mask by shifting the boundary to the right. Class C mask `/24` with 2 borrowed bits becomes `/26`.',
      step3: 'Calculate block size: `2^(Host bits remaining)`. For `/26`, host bits = 32 - 26 = 6. Block size = `2^6 = 64` IPs.',
      answer: 'Subnets start at intervals of 64: Network 1: `.0` to `.63`, Network 2: `.64` to `.127`. Total usable hosts per subnet = `Block Size - 2` (network address and broadcast address reserved).',
      shortcut: 'Usable hosts formula: `2^H - 2`. Subtract the first IP (network ID) and last IP (directed broadcast IP).'
    },
    {
      title: 'CIDR',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**CIDR (Classless Inter-Domain Routing)** replaces old classful addressing with variable-length subnet masks (VLSM).',
      explanation: [
        'Denoted as `IP/Prefix` (e.g., `192.0.2.0/24`).',
        'Prefix indicates the number of static bits representing the Network ID.',
        'Allows precise, custom-sized IP allocations, minimizing wasted address space.'
      ],
      intuition: [
        'Classful allocation was wasteful: Class A gave 16M hosts, Class B gave 65k, Class C gave 254. If you needed 1000 hosts, you had to take Class B, wasting 64,000 addresses. CIDR allows `/22` (1024 IPs).'
      ],
      takeaways: [
        'Eliminates Class A/B/C static boundaries.',
        'Uses slash notation (`/x`) for mask prefix.',
        'Enables route aggregation (supernetting).'
      ]
    },
    {
      title: 'ARP',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**ARP (Address Resolution Protocol)** dynamically maps a logical IP address to a physical MAC address on a local network.',
      explanation: [
        '**ARP Request**: Broadcast frame (`FF:FF:FF:FF:FF:FF`) asking "Who has IP X? Tell MAC Y".',
        '**ARP Reply**: Unicast frame from the owner containing its MAC address.',
        '**ARP Cache**: In-memory table on devices to store IP-to-MAC mappings, avoiding broadcast overload.'
      ],
      intuition: [
        'IP routing gets the packet to the correct local network interface. But to physically cross the Ethernet cable to the next card, it MUST be wrapped in a frame with the next card\'s MAC address. ARP finds that MAC.'
      ],
      takeaways: [
        'Bridges Layer 3 (IP) to Layer 2 (MAC).',
        'ARP Request is Broadcast; ARP Reply is Unicast.',
        'Operates within the local broadcast domain only.'
      ]
    },
    {
      title: 'NAT',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**NAT (Network Address Translation)** allows multiple devices on a private network to share a single public IP address.',
      explanation: [
        'Translates private IP/ports to public IP/ports at the network gateway.',
        'Saves public IPv4 addresses and acts as a security firewall.',
        '**PAT (Port Address Translation / Overloading)**: Maps multiple private IPs to one public IP using unique source port numbers.'
      ],
      intuition: [
        'When your home phone requests a page, NAT router translates private `192.168.1.5:5000` to public `203.0.113.1:9000` and records this mapping in its translation table to route the return packets.'
      ],
      takeaways: [
        'Translates private IP ranges (`10.x`, `172.16.x`, `192.168.x`) to Public IPs.',
        'Conserves IPv4 addresses.',
        'Relies on NAT Translation Tables.'
      ]
    }
  ],
  'Transport Layer': [
    {
      title: 'TCP',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**TCP (Transmission Control Protocol)** is a connection-oriented, reliable Transport Layer protocol.',
      explanation: [
        '**Reliable Delivery**: Re-transmits lost packets and ensures in-order delivery using sequence numbers and ACKs.',
        '**Connection-Oriented**: Requires setup handshake before data exchange.',
        '**Byte-Stream**: Views data as an unstructured stream of bytes, not message blocks.'
      ],
      intuition: [
        'TCP guarantees that whatever the application sends is exactly what the receiver gets, in the correct order, without duplicates. It manages this reliability over noisy, unpredictable IP routes.'
      ],
      takeaways: [
        'Connection-oriented (handshake).',
        'Guarantees order and arrival.',
        'Flow and Congestion control mechanisms.'
      ]
    },
    {
      title: 'UDP',
      difficulty: 'Easy',
      type: 'theory',
      intro: '**UDP (User Datagram Protocol)** is a connectionless, lightweight, and fast Transport Layer protocol.',
      explanation: [
        '**Connectionless**: Sends datagrams immediately without setup handshake.',
        '**Unreliable Delivery**: No guarantees of packet arrival, ordering, or duplicate checks.',
        '**Message-Oriented**: Keeps application boundary records intact for each write.'
      ],
      intuition: [
        'UDP has zero connection overhead or wait state. If a packet is lost, it is ignored. This is perfect for real-time multiplayer gaming, live streams, DNS, and VOIP where speed is preferred over reliability.'
      ],
      takeaways: [
        'Unreliable and Connectionless.',
        'No flow/congestion control, minimal overhead.',
        'Preferred for real-time streaming and quick query applications.'
      ]
    },
    {
      title: 'TCP Header',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **TCP Header** contains control flags and window configurations to manage connection reliability and speed.',
      explanation: [
        '**Sequence & ACK Numbers**: 32-bit tracking fields for byte byte-stream ordering.',
        '**Flags**: control indicators (`SYN`, `ACK`, `FIN`, `RST`, `PSH`, `URG`).',
        '**Window Size**: 16-bit field advertising the receiver\'s buffer size (used for Flow Control).'
      ],
      intuition: [
        'If the Window Size is advertised as 0, the sender must stop sending data immediately. This stops the receiver buffer from overflowing (Flow Control).'
      ],
      takeaways: [
        'Minimum size: 20 bytes.',
        'Control Flags manage session state.',
        'Window Size field controls the flow speed.'
      ]
    },
    {
      title: 'UDP Header',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **UDP Header** is minimal and designed for low-overhead packet processing.',
      explanation: [
        '**Source & Destination Ports**: 16-bit fields routing packets to correct processes.',
        '**Length**: 16-bit field indicating size of header + payload data.',
        '**Checksum**: 16-bit validation field (optional on IPv4, mandatory on IPv6).'
      ],
      intuition: [
        'UDP header is exactly **8 bytes** fixed. This makes UDP processing extremely fast and highly suitable for simple query-response protocols.'
      ],
      takeaways: [
        'Fixed size: exactly 8 bytes.',
        'Only 4 fields: Ports, Length, Checksum.',
        'Minimal processing overhead.'
      ]
    },
    {
      title: 'Flow Control',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Flow control is a speed-matching mechanism in TCP to prevent a fast sender from overwhelming a slow receiver.',
      explanation: [
        'Implemented using a **Sliding Window Protocol**.',
        'Receiver advertises its available buffer space (`rwnd`) in every ACK.',
        'Sender must ensure that the total unacknowledged bytes in transit never exceed the advertised `rwnd`.'
      ],
      intuition: [
        'Flow Control is **end-to-end** (Sender vs Receiver). This is different from Congestion Control, which handles traffic limits inside the network routing path.'
      ],
      takeaways: [
        'End-to-end mechanism.',
        'Driven by receiver\'s advertised Window Size (`rwnd`).',
        'Prevents receiver buffer overflows.'
      ]
    },
    {
      title: 'Congestion Control',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'Congestion control throttles the sender to prevent overloading the network routers and links.',
      explanation: [
        '**Slow Start**: Sender starts with small window (`cwnd` = 1 MSS) and doubles it every RTT (exponential growth).',
        '**Congestion Avoidance**: Increases `cwnd` linearly (+1 MSS per RTT) once it reaches threshold (`ssthresh`).',
        '**Fast Retransmit & Recovery**: Triggers retransmission immediately upon receiving 3 duplicate ACKs without waiting for timeout.'
      ],
      intuition: [
        'If a packet drops, TCP assumes the network is congested. It halves `ssthresh` and drops the `cwnd` down to 1 MSS (or halves it in Fast Recovery) to allow the network routers to recover.'
      ],
      takeaways: [
        'Network-level mechanism (Sender vs Network capacity).',
        'driven by Congestion Window (`cwnd`).',
        'Uses AIMD (Additive Increase Multiplicative Decrease) strategy.'
      ]
    }
  ],
  'Application Layer': [
    {
      title: 'HTTP',
      difficulty: 'Easy',
      type: 'protocol',
      intro: '**HTTP (HyperText Transfer Protocol)** is a stateless application layer protocol used for transferring web resources.',
      howItWorks: [
        'Runs on top of TCP (Port 80).',
        'Client-Server model: Client sends requests (GET, POST, PUT, DELETE), Server replies with resources.',
        'Stateless: Each request/response pair is isolated. States are maintained using Cookies or Sessions.'
      ],
      packetFlow: [
        'Client opens TCP connection ➔ Sends request headers ➔ Server processes ➔ Returns status code (e.g., 200 OK, 404 Not Found) + HTML payload ➔ Closes/reuses connection.'
      ],
      intuition: [
        'HTTP/1.1 introduced persistent connections (keep-alive) to reuse the same TCP connection. HTTP/2 added multiplexing over a single connection, and HTTP/3 moved from TCP to UDP (QUIC) to eliminate head-of-line blocking.'
      ],
      takeaways: [
        'Port 80, TCP base.',
        'Stateless by design.',
        'HTTP/3 uses UDP (QUIC).'
      ]
    },
    {
      title: 'HTTPS',
      difficulty: 'Medium',
      type: 'protocol',
      intro: '**HTTPS** is HTTP encapsulated within an encrypted SSL/TLS session to provide security and integrity.',
      howItWorks: [
        'Runs on top of TCP (Port 443).',
        'Uses SSL/TLS to provide: **Encryption** (confidentiality), **Authentication** (identity validation), and **Data Integrity** (prevents tampering).'
      ],
      packetFlow: [
        'TCP 3-way handshake ➔ SSL/TLS handshake (Certificates verified, Session keys generated) ➔ Encrypted HTTP data starts flowing.'
      ],
      intuition: [
        'HTTPS encrypts the entire HTTP header, path, and data payload. Only the destination IP address and port remain visible to intermediate routers.'
      ],
      takeaways: [
        'Port 443, Secure socket base.',
        'Uses symmetric encryption for data, asymmetric for key exchange.',
        'Protects against Man-in-the-Middle attacks.'
      ]
    },
    {
      title: 'DNS',
      difficulty: 'Medium',
      type: 'protocol',
      intro: '**DNS (Domain Name System)** translates human-readable domain names to machine-readable IP addresses.',
      howItWorks: [
        'Acts as the phonebook of the Internet. Typically uses UDP (Port 53) for speed.',
        'Hierarchical database: Root servers (`.`), TLD servers (`.com`), and Authoritative servers.'
      ],
      packetFlow: [
        'Client requests IP for domain ➔ Local Resolver checks cache ➔ Queries Root (directs to TLD) ➔ Queries TLD (directs to Authoritative) ➔ Queries Authoritative (gets IP) ➔ Returns to client.'
      ],
      intuition: [
        'Why does DNS use UDP? Speed. Setting up a TCP connection for a single name translation would double web page load times. DNS only falls back to TCP for large zone transfers (exceeding 512 bytes).'
      ],
      takeaways: [
        'Port 53, primarily UDP.',
        'Hierarchical lookup flow.',
        'Resolver queries Root ➔ TLD ➔ Authoritative.'
      ]
    },
    {
      title: 'DHCP',
      difficulty: 'Medium',
      type: 'protocol',
      intro: '**DHCP (Dynamic Host Configuration Protocol)** dynamically assigns IP addresses and network parameters to devices joining a network.',
      howItWorks: [
        'Uses UDP (Port 67 for server, Port 68 for client).',
        'Avoids manual IP conflicts and automates network boot parameters.'
      ],
      packetFlow: [
        '**Discover**: Client broadcasts query.',
        '**Offer**: Server offers an IP.',
        '**Request**: Client requests to lease that IP.',
        '**ACK**: Server commits the IP lease.'
      ],
      intuition: [
        'Remember the **DORA** sequence in interviews: Discover (Broadcast) ➔ Offer (Unicast/Broadcast) ➔ Request (Broadcast) ➔ ACK (Unicast/Broadcast).'
      ],
      takeaways: [
        'Automates IP configuration.',
        'DORA lease handshake.',
        'Uses UDP ports 67 & 68.'
      ]
    }
  ],
  'Routing Algorithms': [
    {
      title: 'Distance Vector Routing',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Distance Vector Routing** calculates the shortest path based on direction (vector) and distance to target nodes.',
      explanation: [
        'Uses the **Bellman-Ford algorithm**.',
        'Each router maintains a table containing the distance to all nodes and the next-hop router.',
        'Routers periodically share their entire routing table with **immediate neighbors** only.'
      ],
      intuition: [
        'Has a famous vulnerability: the **Count-to-Infinity problem** during link failures. Resolved using **Split Horizon** (do not advertise routes back to the neighbor they were learned from) and **Route Poisoning**.'
      ],
      takeaways: [
        'Based on Bellman-Ford algorithm.',
        'Shares complete tables to neighbors only.',
        'Vulnerable to routing loops (count-to-infinity).'
      ]
    },
    {
      title: 'Link State Routing',
      difficulty: 'Hard',
      type: 'theory',
      intro: '**Link State Routing** allows each router to build a complete topological map of the entire network to calculate routes.',
      explanation: [
        'Uses **Dijkstra\'s algorithm**.',
        'Routers flood LSP (Link State Packets) containing link states to **all routers** in the network.',
        'Each node runs Dijkstra independently to find the shortest path tree.'
      ],
      intuition: [
        'Unlike Distance Vector, Link State routers don\'t rely on neighbors\' routing summaries. They get the raw topology map and calculate routes themselves, which avoids routing loops.'
      ],
      takeaways: [
        'Based on Dijkstra\'s algorithm.',
        'Floods link states globally.',
        'Converges faster than Distance Vector.'
      ]
    },
    {
      title: 'RIP, OSPF, BGP Basics',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'RIP, OSPF, and BGP are routing protocols optimized for different network scales and routing constraints.',
      conceptA: 'OSPF (Interior Gateway)',
      conceptA_bullets: [
        'Link State protocol used inside Autonomous Systems.',
        'Uses Dijkstra algorithm for fast routing convergence.',
        'Scale: High capacity, uses metric cost based on link bandwidth.'
      ],
      conceptB: 'BGP (Exterior Gateway)',
      conceptB_bullets: [
        'Path-Vector protocol routing between Autonomous Systems.',
        'Routes packets based on policy and path rules (hop count is ignored).',
        'The operational routing protocol of the global Internet.'
      ],
      comparisonTable: [
        '**Type**: Distance Vector (RIP) ➔ Link State (OSPF) ➔ Path Vector (BGP)',
        '**Metric**: Hop count (Max 15) ➔ Cost (Bandwidth) ➔ Path attributes',
        '**Scope**: Small enterprise ➔ Large enterprise ➔ Global Internet'
      ],
      intuition: [
        'Understand that RIP uses simple hop counts (16 is infinity, meaning unreachable). OSPF is for routing inside your company network, and BGP handles routing across different ISPs.'
      ]
    }
  ],
  'Congestion and Flow Control': [
    {
      title: 'Stop and Wait',
      difficulty: 'Medium',
      type: 'numerical',
      intro: 'Stop and Wait ARQ is the simplest flow control protocol: the sender transmits a packet and waits for an ACK before sending the next.',
      step1: 'Identify transmission time: `Tx = Packet Size / Bandwidth`. Identify propagation time: `Tp = Distance / Speed`.',
      step2: 'Calculate total cycle time to send a packet and receive its ACK: `Total Time = Tx + 2 * Tp`. (Neglect ACK Tx time).',
      step3: 'Calculate link efficiency `η`: the ratio of useful transmission time to total cycle time: `η = Tx / (Tx + 2 * Tp)`.',
      answer: 'Efficiency: `η = 1 / (1 + 2 * a)` where `a = Tp / Tx`.Usable link utilization is extremely low if propagation time `Tp` is high (e.g., satellite links).',
      shortcut: 'If `Tp >> Tx` (long distance, high speed), efficiency drops to near zero. Sliding window protocols are required to keep the link busy.'
    },
    {
      title: 'Go Back N',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Go-Back-N (GBN) is a sliding window protocol that allows the sender to transmit multiple packets before receiving an ACK.',
      step1: 'Identify sender window size `Ws` and receiver window size `Wr`. In GBN, `Ws = 2^k - 1` (where k is sequence bits) and `Wr = 1`.',
      step2: 'If a packet is lost or corrupted, the receiver discards it and all subsequent packets (out-of-order packets are not buffered).',
      step3: 'The sender window slides only upon receiving cumulative ACKs. If a packet timeout occurs, the sender retransmits the entire window.',
      answer: 'Efficiency: `η = Ws / (1 + 2 * a)`. GBN is highly efficient when errors are rare, but retransmitting the entire window wastes bandwidth on noisy links.',
      shortcut: 'Remember: GBN uses cumulative ACKs. If packet 0, 1, 2 are sent, and ACK 2 is received, it means all packets up to 2 were received.'
    },
    {
      title: 'Selective Repeat',
      difficulty: 'Hard',
      type: 'numerical',
      intro: 'Selective Repeat ARQ improves GBN by buffering out-of-order packets and retransmitting only the lost packet.',
      step1: 'Identify window sizes: in Selective Repeat, sender and receiver windows are equal: `Ws = Wr = 2^(k-1)`.',
      step2: 'The receiver maintains a buffer for out-of-order packets and sends negative ACKs (NAK) for missing frames.',
      step3: 'Upon receiving a NAK, the sender retransmits only the specified lost frame without sliding the window.',
      answer: 'Efficiency: `η = Ws / (1 + 2 * a)`. Minimizes bandwidth wastage on noisy links at the cost of buffer memory at the receiver.',
      shortcut: 'Constraint: To avoid window overlap issues, the sum of sender and receiver windows must be less than or equal to the sequence number space: `Ws + Wr <= 2^k`.'
    }
  ],
  'Network Security': [
    {
      title: 'SSL/TLS',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'The **SSL/TLS Handshake** establishes an encrypted session keys exchange before HTTPS application transmission starts.',
      explanation: [
        'Client sends `ClientHello` advertising cipher suites and a random number.',
        'Server replies with `ServerHello` (cipher chosen), random number, and its public Key certificate.',
        'Client verifies the certificate authority (CA) signature.',
        'Client generates a `Pre-Master Secret`, encrypts it using the server\'s public key, and sends it. Both compute the symmetric session key.'
      ],
      intuition: [
        'Why both asymmetric and symmetric encryption? Asymmetric (RSA/Diffie-Hellman) is heavy and slow; it is used only to securely exchange a session key. Symmetric (AES) is extremely fast and encrypts the actual HTTP data.'
      ],
      takeaways: [
        'Protects against eavesdropping and modification.',
        'Asymmetric encryption authenticates and exchanges keys.',
        'Symmetric session keys encrypt the data stream.'
      ]
    },
    {
      title: 'Symmetric vs Asymmetric Encryption',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'Symmetric and asymmetric cryptography protect communications using different key structures.',
      conceptA: 'Symmetric Encryption',
      conceptA_bullets: [
        'Uses a single shared key for both encryption and decryption.',
        'Extremely fast; optimized for bulk data transfers.',
        'Key distribution problem: key must be shared securely beforehand.'
      ],
      conceptB: 'Asymmetric Encryption',
      conceptB_bullets: [
        'Uses a key pair: Public Key (encrypts) and Private Key (decrypts).',
        'Slow; computationally expensive.',
        'No distribution problem: public key can be openly shared.'
      ],
      comparisonTable: [
        '**Key Count**: 1 shared key ➔ 2 keys (Public + Private)',
        '**Processing Speed**: Very fast ➔ Slow',
        '**Common Algorithms**: AES, DES, Blowfish ➔ RSA, Diffie-Hellman, ECC'
      ],
      intuition: [
        'In interviews, emphasize that modern secure protocols (like TLS) leverage **both**: Asymmetric encryption sets up the session, and Symmetric encryption takes over for data transfer.'
      ]
    }
  ],
  'Most Asked Interview Questions': [
    {
      title: 'What Happens When You Type a URL',
      difficulty: 'Hard',
      type: 'flow',
      intro: 'Typing a URL (e.g., `https://www.example.com`) triggers an end-to-end network operation spanning all layers.',
      step1: '**DNS Lookup**: Browser checks caches (Browser, OS, Router). If missed, recursive resolver queries DNS root, TLD, and authoritative servers to fetch the IP address.',
      step2: '**ARP Resolution**: If the target IP is outside, client uses ARP to get default gateway router MAC. If target is inside, ARP gets host MAC.',
      step3: '**TCP Handshake**: Client initiates a TCP connection (Port 443) with the target IP via a 3-way handshake (SYN ➔ SYN-ACK ➔ ACK).',
      step4: '**TLS Negotiation**: Secure handshake establishes encryption algorithms and exchanges symmetric session keys.',
      step5: '**HTTP Request/Response**: Browser sends GET request, server processes, and returns HTML/assets. Connection is closed or kept alive.',
      finalFlow: 'URL Input ➔ DNS Query ➔ ARP Resolution ➔ TCP 3-Way Handshake ➔ TLS Encrypted Session ➔ HTTP Exchange ➔ Render Page.',
      intuition: [
        'This is the most common interview question. Routers handle IP hops (Layer 3), switches manage local frames (Layer 2), and DNS resolves names (Layer 7). Walk through each layer logically.'
      ]
    },
    {
      title: 'TCP vs UDP',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'TCP and UDP are the two primary Transport Layer protocols, offering different reliability and speed trade-offs.',
      conceptA: 'TCP',
      conceptA_bullets: [
        'Reliable: re-transmits lost packets and ensures correct ordering.',
        'Connection-oriented (requires setup handshake).',
        'Heavier header overhead (20 to 60 bytes) and slower speeds.'
      ],
      conceptB: 'UDP',
      conceptB_bullets: [
        'Unreliable: no delivery or ordering guarantees.',
        'Connectionless: fires packets immediately without setup.',
        'Minimal header overhead (exactly 8 bytes) and maximum speed.'
      ],
      comparisonTable: [
        '**Reliability**: Guaranteed ➔ Best-effort',
        '**Connection**: Handshake required ➔ No handshake',
        '**Speed**: Slower (congestion windows) ➔ Maximum speed',
        '**Common Protocols**: HTTP, HTTPS, SSH, FTP ➔ DNS, DHCP, VOIP, Games'
      ],
      intuition: [
        'Ask yourself: does a packet drop matter? If yes (loading a webpage or file), use TCP. If no (video frame dropped in zoom call, game ping packet lost), use UDP.'
      ]
    },
    {
      title: 'Three Way Handshake',
      difficulty: 'Medium',
      type: 'flow',
      intro: 'TCP uses a three-way handshake to synchronize sequence numbers and establish a connection.',
      step1: '**SYN**: Client sends segment with `SYN = 1`, and a random sequence number `ISN_C` (e.g., `x`). Status: `SYN_SENT`.',
      step2: '**SYN-ACK**: Server replies with `SYN = 1`, `ACK = 1`, sequence number `ISN_S` (e.g., `y`), and `ACK number = x + 1`. Status: `SYN_RCVD`.',
      step3: '**ACK**: Client sends segment with `ACK = 1`, `sequence number = x + 1`, and `ACK number = y + 1`. Status: `ESTABLISHED`.',
      finalFlow: 'Client sends SYN (seq=x) ➔ Server replies SYN-ACK (seq=y, ack=x+1) ➔ Client sends ACK (seq=x+1, ack=y+1) ➔ Connection Established.',
      intuition: [
        'Why is it a 3-way handshake and not 2? To prevent stale connection requests. If an old delayed SYN packet arrives at the server, the server replies with SYN-ACK, but the client ignores it since it didn\'t initiate a connection.'
      ]
    },
    {
      title: 'Four Way Termination',
      difficulty: 'Medium',
      type: 'flow',
      intro: 'TCP connections are terminated using a four-way handshake to allow both sides to gracefully flush data.',
      step1: '**FIN**: Active side (e.g., client) sends `FIN = 1` indicating it has no more data. Status: `FIN_WAIT_1`.',
      step2: '**ACK**: Passive side (server) replies with `ACK = 1` acknowledging the close request. Status: `CLOSE_WAIT` (server can still send data).',
      step3: '**FIN**: Server finishes sending data, sends its own `FIN = 1`. Status: `LAST_ACK`.',
      step4: '**ACK**: Client replies with `ACK = 1`. Status: `TIME_WAIT` (client waits 2 MSL to ensure ACK reached server, then closes).',
      finalFlow: 'Client sends FIN ➔ Server sends ACK ➔ Server sends FIN ➔ Client sends ACK ➔ TIME_WAIT ➔ Closed.',
      intuition: [
        'Why the `TIME_WAIT` state? If the final ACK is lost, the server will retransmit its FIN. The client must stay alive in `TIME_WAIT` (typically 2-4 mins) to retransmit the ACK; else the connection resets.'
      ]
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

  // 2. Ensure subfolders exist under Computer Networks
  const folderMap = new Map();
  console.log('\n--- Ensuring 12 Computer Networks Subfolders exist ---');
  
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
          parentFolderId: CN_PARENT_ID,
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
  console.log('\n--- Seeding/Updating Computer Networks Revision Cards ---');

  for (const [folderTitle, cards] of Object.entries(CN_CARDS_DATA)) {
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
        body: s.body,
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
            topic: 'Computer Networks',
            explanation: c.intro || c.problem || '',
            code: c.code || '',
            image: '',
            tags: ['Computer Networks', folderTitle, 'Placements'],
            difficulty: c.difficulty,
            complexity: '',
            examples: c.examples || [],
            folderId: folderId,
            createdBy: adminId,
            visibility: 'public',
            order: i,
            slides: formattedSlides,
            isDeleted: false,
            rootFolderId: CN_PARENT_ID,
            rootFolderName: 'Computer Networks',
            subfolderPath: `/Computer Networks/${folderTitle}`,
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
  console.log(`\n🎉 DONE! Seeded/Updated a total of ${totalCardsSeeded} Computer Networks cards.`);
}

run().catch(console.error);
