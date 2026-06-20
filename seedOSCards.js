require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');

const mongoUri = process.env.MONGO_URI;
const OS_PARENT_ID = 'f4944c6e-f81a-52d5-ac46-c2d04056462e';
const MIGRATION_NAMESPACE = '3b671a64-40d5-491e-99b0-da01ff1f3341';

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
  
  // Set version to 5
  hash[6] = (hash[6] & 0x0f) | 0x50;
  // Set variant to RFC4122
  hash[8] = (hash[8] & 0x3f) | 0x80;
  
  const hex = hash.toString('hex');
  return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
}

// Helper to format bullets with double newlines
function formatBullets(arr) {
  if (!arr || arr.length === 0) return '';
  return arr.map(item => `• ${item}`).join('\n\n');
}

// Cinematic Slide Compiler that matches strictly user templates
function compileSlides(q) {
  const slides = [];

  // Always include exactly one intro slide as the first slide.
  slides.push({
    type: 'intro',
    headline: '',
    body: '',
    blocks: []
  });

  if (q.type === 'theory') {
    // 3 slides: 💡 Explanation, 🧠 Interview Intuition, Key Takeaways
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
    // 4 slides: 💡 Concept A, 💡 Concept B, Comparison Table, 🧠 Interview Intuition
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
  else if (q.type === 'algorithm') {
    // 3 slides: 💡 Explanation, Dry Run, Complexity / Important Points (Removed), 🧠 Interview Intuition
    slides.push({
      headline: '💡 Explanation',
      body: formatBullets(q.explanation),
      type: 'explanation'
    });
    slides.push({
      headline: 'Dry Run',
      body: formatBullets(q.dryRun),
      type: 'explanation'
    });
    slides.push({
      headline: '🧠 Interview Intuition',
      body: formatBullets(q.intuition),
      type: 'explanation'
    });
  } 
  else if (q.type === 'numerical') {
    // 6 slides: Problem Statement (Moved to intro/explanation), Step 1, Step 2, Step 3, Final Answer, 🧠 Interview Shortcut
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
  else if (q.type === 'syscall') {
    // 4 slides: 💡 How It Works, Code Snippet, 🧠 Interview Intuition, Key Takeaways
    slides.push({
      headline: '💡 How It Works',
      body: formatBullets(q.howItWorks),
      type: 'explanation'
    });
    slides.push({
      headline: 'Code Snippet',
      code: q.code,
      type: 'code'
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

// HIGH-YIELD OS CARD DATABASE DEFINITIONS - REFINED & POLISHED FOR MAXIMUM APPEAL
const OS_CARDS_DATA = {
  'OS Basics': [
    {
      title: 'What is an OS',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'An **Operating System (OS)** is system software that acts as an intermediary between a user and computer hardware.',
      explanation: [
        'Manages computer hardware resources like the `CPU`, `Memory`, and `I/O devices`.',
        'Provides an execution environment for application software.',
        'Abstracts physical hardware complexities by exposing a clean, high-level interface.'
      ],
      intuition: [
        'Interviewers look for core definitions: an OS is a **resource allocator** (CPU scheduling, memory paging) and a **control program** (preventing errors and hardware misuse).'
      ],
      takeaways: [
        'Bridge between User Applications and Hardware.',
        'Primary duties: **Resource Allocation** and **Hardware Control**.',
        'Examples: `Linux`, `Windows`, `macOS`, `Android`.'
      ]
    },
    {
      title: 'User Mode vs Kernel Mode',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'To protect itself from buggy or malicious applications, the CPU enforces dual-mode execution using a **Mode Bit**.',
      conceptA: 'User Mode',
      conceptA_bullets: [
        'Restricted mode where user applications execute.',
        'Direct access to physical hardware or kernel memory is **strictly prohibited**.',
        'Crashes are isolated and do not bring down the OS.'
      ],
      conceptB: 'Kernel Mode',
      conceptB_bullets: [
        'Privileged mode where core OS services execute.',
        'CPU has **unrestricted access** to hardware and physical memory.',
        'Crashes here crash the entire machine (e.g., Blue Screen).'
      ],
      comparisonTable: [
        '**Mode Bit**: `User Mode = 1` ➔ `Kernel Mode = 0`',
        '**Privilege level**: Restricted ➔ Unrestricted access',
        '**Hardware Access**: Indirect (via system calls) ➔ Direct access'
      ],
      intuition: [
        'Switching from user mode to kernel mode requires a **hardware trap instruction** (software interrupt). Mode switching is a fundamental performance cost of system programming.'
      ]
    },
    {
      title: 'System Calls',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **System Call** is the programmatic interface that allows user applications to request kernel-level services from the OS.',
      explanation: [
        'Serves as the bridge between `User Mode` and `Kernel Mode`.',
        'Triggers a software interrupt or trap instruction, switching CPU privileges.',
        'Common types: Process Control (`fork`, `exit`), File Management (`open`, `read`, `write`), Device Management, Information Maintenance, Communications.'
      ],
      intuition: [
        'Reading a file doesn\'t write directly to disk; the user program invokes a `read()` system call, the CPU switches to kernel mode, the OS fetches the file, and then returns control.'
      ],
      takeaways: [
        'The only entry point to request Kernel-level tasks.',
        'Causes a context switch from User Mode to Kernel Mode.',
        'Strictly regulated for system stability.'
      ]
    },
    {
      title: 'Interrupts vs Exceptions',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'Both interrupt the standard CPU execution flow to request OS intervention, but they have different origins.',
      conceptA: 'Interrupts',
      conceptA_bullets: [
        '**Asynchronous events** generated by external hardware devices.',
        'Independent of the currently executing instruction.',
        'Examples: Timer interrupts, keyboard key presses, network packet arrival.'
      ],
      conceptB: 'Exceptions',
      conceptB_bullets: [
        '**Synchronous events** generated internally by the CPU itself.',
        'Direct result of executing a specific instruction.',
        'Examples: Division by zero, page faults, segmentation faults.'
      ],
      comparisonTable: [
        '**Origin**: External hardware ➔ Internal CPU execution',
        '**Timing**: Asynchronous ➔ Synchronous (immediate on instruction)',
        '**Purpose**: I/O & timer handling ➔ Handling errors or software traps'
      ],
      intuition: [
        'If a program runs the same instruction twice, an exception will happen at the exact same spot both times. An interrupt will happen at random points.'
      ]
    },
    {
      title: 'Monolithic vs Microkernel',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'These are the two main architectural designs for structuring operating system kernels.',
      conceptA: 'Monolithic Kernel',
      conceptA_bullets: [
        'All OS services (scheduling, file system, drivers) run in **Kernel Space**.',
        'Direct, fast function calls with zero IPC overhead.',
        'If one driver crashes, the entire system crashes.'
      ],
      conceptB: 'Microkernel',
      conceptB_bullets: [
        'Only bare minimum services (IPC, scheduling) run in kernel space.',
        'Other services run as **User Space servers** (drivers, file systems).',
        'High reliability, but slower due to intensive IPC message passing.'
      ],
      comparisonTable: [
        '**Size**: Large footprint ➔ Small minimalist core',
        '**Performance**: Fast (direct execution) ➔ Slower (IPC message overhead)',
        '**Fault Isolation**: Poor (any crash kills OS) ➔ Excellent (crashed server restarts)'
      ],
      intuition: [
        'Monolithic kernels (e.g. Linux) prioritize **performance** over modularity. Microkernels (e.g. Minix, L4) are used in safety-critical systems like aerospace and medical devices.'
      ]
    }
  ],
  'Processes': [
    {
      title: 'Program vs Process',
      difficulty: 'Easy',
      type: 'comparison',
      intro: 'This is the most basic process concept, explaining the transition from static code to live execution.',
      conceptA: 'Program',
      conceptA_bullets: [
        'A **static** entity containing compiled machine instructions.',
        'Stored on non-volatile secondary storage (disk/SSD).',
        'Has a lifespan that persists indefinitely until deleted.'
      ],
      conceptB: 'Process',
      conceptB_bullets: [
        'An **active**, dynamic execution instance of a program.',
        'Loaded into main memory (RAM).',
        'Has resources allocated (PCB, registers, heap, stack).'
      ],
      comparisonTable: [
        '**State**: Static ➔ Dynamic',
        '**Storage**: Hard Disk/SSD ➔ Main Memory (RAM)',
        '**Resource Usage**: None (passive file) ➔ Consumes CPU cycles, RAM, file handles'
      ],
      intuition: [
        'Think of a **Program** as a cooking recipe (text in a book) and a **Process** as the actual act of cooking the dish in the kitchen.'
      ]
    },
    {
      title: 'Process States',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'As a process executes, it moves through different states managed by the operating system scheduler.',
      explanation: [
        '`New`: The process is being created.',
        '`Ready`: Waiting in memory to be assigned to a CPU core.',
        '`Running`: Instructions are actively executing on the CPU.',
        '`Waiting` (Blocked): Blocked waiting for an I/O completion or signal.',
        '`Terminated`: Execution is complete, resources are released.'
      ],
      intuition: [
        'The transition from `Running` to `Ready` happens when a process\'s time slice expires or a higher priority process interrupts it.'
      ],
      takeaways: [
        'Only **one** process can be `Running` on a single CPU core at any instant.',
        'Blocked processes are moved to the `Waiting` queue to keep the CPU free.',
        'Process states are tracked inside the `PCB`.'
      ]
    },
    {
      title: 'PCB',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'The **Process Control Block (PCB)** is a data structure in kernel memory that contains all metadata about a process.',
      explanation: [
        '**Process State**: Current state (Ready, Running, Waiting).',
        '**Program Counter (PC)**: Memory address of the next instruction to execute.',
        '**CPU Registers**: Register states to save/restore on context switch.',
        '**CPU Scheduling Info**: Process priority, scheduling queue pointers.',
        '**Memory Management**: Page tables, segment limits.',
        '**I/O Status**: Open file descriptors, allocated devices.'
      ],
      intuition: [
        'Think of the PCB as the OS\'s "save state" card. When the OS pauses a process, it writes all current registers and the PC to the PCB so it can resume exactly where it left off.'
      ],
      takeaways: [
        'Every process has exactly **one PCB**.',
        'Allocated in Kernel memory space upon process creation.',
        'Destroyed when the process terminates.'
      ]
    },
    {
      title: 'Context Switching',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A **Context Switch** is the mechanism by which the CPU switches execution from one process to another.',
      explanation: [
        'OS saves execution state (context) of the current running process to its `PCB`.',
        'OS loads the saved state of the next ready process from its `PCB` into CPU registers.',
        'Enables multitasking and fair distribution of CPU time.'
      ],
      intuition: [
        'Context switching is **pure overhead**! The CPU does no useful work while saving and restoring state. High switch frequency ruins system performance, so schedulers try to balance responsiveness and overhead.'
      ],
      takeaways: [
        'Directly impacts performance (must be fast).',
        'Flushes CPU cache and invalidates `TLB` translations (heavy cache penalty).',
        'Hardware support (multiple register banks) makes it much faster.'
      ]
    },
    {
      title: 'Process Creation & Termination',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The OS manages how new processes are spawned and how they are cleaned up on completion.',
      explanation: [
        '**Creation**: Processes spawn child processes forming a **process tree**.',
        'In Unix/Linux, creation uses `fork()` (copies parent) followed by `exec()` (replaces memory image).',
        '**Termination**: A process ends using the `exit()` system call, returning status to parent.',
        'Parent retrieves child exit status using the `wait()` system call.'
      ],
      intuition: [
        'Process creation is hierarchical. The first user process (often `init` or `systemd`, PID `1`) is the root ancestor of all processes in user space.'
      ],
      takeaways: [
        'Parent-child relationships form a tree structure.',
        'Resource sharing can be shared, partial, or independent.',
        'Parent must call `wait()` to clean up terminated children.'
      ]
    },
    {
      title: 'Zombie Process',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A **Zombie Process** is a process that has terminated execution but still has an entry in the Process Table.',
      explanation: [
        'Occurs when a child exits, but its parent has not yet read its termination status using the `wait()` system call.',
        'The OS retains the child\'s PID and termination code in the process table.',
        'Once the parent calls `wait()`, the zombie process is completely deleted.'
      ],
      intuition: [
        'Do zombies consume CPU resources? **No!** They consume zero CPU and RAM. However, they consume **PID slots**. If the process table fills with zombies, the OS cannot spawn new processes.'
      ],
      takeaways: [
        'Zombies are already dead; they cannot be killed using `kill -9`.',
        'They are reaped by their parent calling `wait()`.',
        'If parent ignores them, killing the parent makes them **Orphans**, which are adopted and reaped by `init`.'
      ]
    },
    {
      title: 'Orphan Process',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'An **Orphan Process** is a running child process whose parent has exited or crashed.',
      explanation: [
        'Since the parent is dead, there is no process left to collect the child\'s termination status.',
        'The OS handles this by automatically **reparenting** the orphan to the `init` process (PID `1`).',
        'The `init` process periodically calls `wait()` to reap finished orphan processes.'
      ],
      intuition: [
        'Why are orphans safer than zombies? Because orphans have a parent (`init` / PID `1`) that guarantees they will be cleaned up, whereas zombies are ignored by their live parent.'
      ],
      takeaways: [
        'Parent exits before child.',
        'Adopted by root process `init` (PID `1`).',
        'Cleaned up automatically; does not leak system resources.'
      ]
    },
    {
      title: 'Daemon Process',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A **Daemon Process** is a background process that runs continuously and is not under the direct control of an interactive user.',
      explanation: [
        'Commonly created by having a process fork, then immediately exit the parent, leaving the child process orphan.',
        'The child calls `setsid()` to detach from the terminal and run as a session leader.',
        'Names usually end with a `d` (e.g., `sshd`, `httpd`, `crond`).'
      ],
      intuition: [
        'Why do they detach from the terminal? So they don\'t block the shell they were started from, and they don\'t exit when the user logs out.'
      ],
      takeaways: [
        'Run in the background.',
        'No direct user interface or terminal control.',
        'Provide system-wide services (web servers, database engines, cron schedulers).'
      ]
    }
  ],
  'Threads': [
    {
      title: 'Process vs Thread',
      difficulty: 'Easy',
      type: 'comparison',
      intro: 'Understanding how threads compare to processes is fundamental to writing concurrent applications.',
      conceptA: 'Process',
      conceptA_bullets: [
        'An independent execution unit with its own virtual memory space.',
        'Heavyweight: high creation and context switching overhead.',
        'Processes are isolated; communication requires IPC mechanisms.'
      ],
      conceptB: 'Thread',
      conceptB_bullets: [
        'A lightweight execution unit within a parent process.',
        'Shares memory, code, data, and OS resources with sibling threads.',
        'Has its own Program Counter, register set, and stack space.'
      ],
      comparisonTable: [
        '**Address Space**: Private virtual space ➔ Shares parent process space',
        '**Context Switch**: Heavy (restores page tables) ➔ Light (restores registers only)',
        '**Isolation**: Highly isolated (safe) ➔ Low isolation (shared state risk)'
      ],
      intuition: [
        'Always summarize: *"A process is an allocating unit of resources, whereas a thread is a scheduling unit of execution."*'
      ]
    },
    {
      title: 'User Threads vs Kernel Threads',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'Threads can be managed either at the application level (User) or by the operating system kernel.',
      conceptA: 'User Threads',
      conceptA_bullets: [
        'Managed entirely by user-level library; kernel is unaware of them.',
        'Fast thread creation and context switching (no kernel mode transition).',
        '**Major Drawback**: If one user thread blocks for I/O, the entire process blocks.'
      ],
      conceptB: 'Kernel Threads',
      conceptB_bullets: [
        'Managed directly by the OS kernel.',
        'Thread operations require kernel system calls (slower overhead).',
        '**Major Advantage**: If one kernel thread blocks, the OS can run another thread.'
      ],
      comparisonTable: [
        '**Management**: User-level library ➔ OS Kernel directly',
        '**Blocking**: Blocks the whole process ➔ Blocks only that specific thread',
        '**Execution**: Runs on single core ➔ Can scale across multi-core CPUs'
      ],
      intuition: [
        'Modern systems (Windows, Linux) use kernel threads because CPU cores can schedule them in parallel, making user-level threads mostly obsolete except for lightweight coroutines (Go channels, fibers).'
      ]
    },
    {
      title: 'Multithreading Models',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'To run user threads on a system, they must be mapped to kernel threads. There are three mapping models.',
      explanation: [
        '**Many-to-One**: Maps many user threads to one kernel thread. Fast management, but no parallel execution on multi-core CPUs.',
        '**One-to-One**: Maps each user thread to a kernel thread. Provides true parallelism and non-blocking I/O, but thread limits apply.',
        '**Many-to-Many**: Multiplexes many user threads to a smaller or equal number of kernel threads. Flexible, but highly complex to implement.'
      ],
      intuition: [
        'Most modern OS architectures (Linux, Windows, macOS) use the **One-to-One** model, prioritizing multiprocessing power over the thread creation overhead.'
      ],
      takeaways: [
        'Defines user-to-kernel thread relationship.',
        'One-to-One is the standard implementation in modern OS.',
        'Many-to-One does not utilize multiple CPU cores.'
      ]
    },
    {
      title: 'Benefits of Multithreading',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Threads offer massive design advantages over multiple processes when building interactive programs.',
      explanation: [
        '**Responsiveness**: An interactive application can execute long-running background tasks while keeping the UI responsive.',
        '**Resource Sharing**: Sharing memory space is cheaper than establishing complex IPC pipes/channels.',
        '**Economy**: Spawning a thread takes about 30x less memory and CPU overhead than spawning a process.',
        '**Scalability**: Threads can scale automatically to run across multiple CPU cores.'
      ],
      intuition: [
        'If a web browser used a process per tab *and* a process for every animation, your computer would run out of RAM immediately. Threads allow tabs to share browser engine memory.'
      ],
      takeaways: [
        'Saves CPU and RAM resources.',
        'Improves UI responsiveness.',
        'Enables high-performance parallel execution.'
      ]
    },
    {
      title: 'Thread Lifecycle',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Like processes, threads transition through multiple execution states during their lifetime.',
      explanation: [
        '`New`: The thread is instantiated but not yet started.',
        '`Runnable`: Registered in thread library, waiting for CPU scheduling.',
        '`Running`: Actively executing code on a CPU core.',
        '`Blocked/Waiting`: Paused waiting for a resource, lock, sleep timer, or I/O.',
        '`Terminated`: Execution is complete; resources are cleaned up.'
      ],
      intuition: [
        'Unlike processes, a thread\'s lifecycle is bound to the parent process. If the parent process terminates, all of its threads are forcefully terminated immediately.'
      ],
      takeaways: [
        'State transitions are fast.',
        'States are tracked in Thread Control Blocks (TCB).',
        'Lifecycle is bound to parent process.'
      ]
    }
  ],
  'CPU Scheduling': [
    {
      title: 'Scheduling Criteria',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Operating systems use specific metrics to measure the efficiency of CPU scheduling algorithms.',
      explanation: [
        '**CPU Utilization**: Keep the CPU as busy as possible (target: 40% to 90%).',
        '**Throughput**: Number of processes completed per unit time.',
        '**Turnaround Time**: Total time from process submission to completion.',
        '**Waiting Time**: Total time spent waiting in the ready queue.',
        '**Response Time**: Time from submission to the first CPU response.'
      ],
      intuition: [
        'In interactive systems (like Windows/macOS), the OS prioritizes minimizing **Response Time**. In batch systems (like data processors), the OS prioritizes maximizing **Throughput**.'
      ],
      takeaways: [
        'Different OS types optimize for different metrics.',
        'Interactive OS: Minimize Response Time.',
        'Batch OS: Maximize Throughput.'
      ]
    },
    {
      title: 'FCFS',
      difficulty: 'Easy',
      type: 'algorithm',
      intro: '**First-Come, First-Served (FCFS)** is the simplest scheduling algorithm, assigning CPU to the process that arrives first.',
      explanation: [
        'Non-preemptive scheduling policy.',
        'Implemented using a simple FIFO queue.',
        'Easy to understand and code, but performance can be highly inefficient.'
      ],
      dryRun: [
        'Processes (Arrival=Burst): P1(0=24ms), P2(0=3ms), P3(0=3ms).',
        'Gantt Chart: `[ P1 (0-24) ] ➔ [ P2 (24-27) ] ➔ [ P3 (27-30) ]`',
        'Average Waiting Time: `(0 + 24 + 27) / 3 = 17ms`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N)` where `N` is the number of processes.',
        '**Convoy Effect**: Long processes block short processes, increasing waiting times.'
      ],
      intuition: [
        'FCFS is terrible if a long process arrives first. Imagine a giant truck at a toll booth blocking a line of small sports cars. This is called the **Convoy Effect**.'
      ]
    },
    {
      title: 'SJF',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: '**Shortest Job First (SJF)** schedules the process with the shortest CPU burst time next.',
      explanation: [
        'Optimal scheduling policy: guarantees minimum average waiting time.',
        'Can be non-preemptive (standard) or preemptive (SRTF).',
        '**Major Drawback**: Hard to implement because predicting the next CPU burst is difficult.'
      ],
      dryRun: [
        'Processes: P1(Burst=6), P2(Burst=8), P3(Burst=7), P4(Burst=3). (All arrive at time 0).',
        'Gantt Chart: `[ P4 (0-3) ] ➔ [ P1 (3-9) ] ➔ [ P3 (9-16) ] ➔ [ P2 (16-24) ]`',
        'Average Waiting Time: `(3 + 16 + 9 + 0) / 4 = 7ms`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N log N)` (if sorting is required).',
        '**Starvation**: Long processes can starve if short processes keep arriving.'
      ],
      intuition: [
        'SJF is optimal in theory but hard in practice because we cannot look into the future to know how long a program will run. OS engineers estimate execution times using **Exponential Averaging** of past runs.'
      ]
    },
    {
      title: 'SRTF',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: '**Shortest Remaining Time First (SRTF)** is the preemptive version of Shortest Job First (SJF).',
      explanation: [
        'If a new process arrives with a remaining burst time shorter than the current executing process, the CPU preempts current process.',
        'Guarantees the lowest possible average waiting time.'
      ],
      dryRun: [
        'P1(Arr=0, Burst=8), P2(Arr=1, Burst=4).',
        'At t=0: P1 runs. At t=1: P2 arrives. P2 remaining = 4, P1 remaining = 7. P1 is preempted.',
        'Gantt Chart: `[ P1 (0-1) ] ➔ [ P2 (1-5) ] ➔ [ P1 (5-12) ]`'
      ],
      complexity: [
        '**Time Complexity**: `O(N log N)`.',
        '**High Context Switch Overhead**: High frequency of switches degrades performance.'
      ],
      intuition: [
        'Always check the remaining time of the running process when a new one arrives. If there is a tie, use Arrival Time (FCFS) to break the tie.'
      ]
    },
    {
      title: 'Priority Scheduling',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: 'CPU allocates execution to the process with the highest priority value next.',
      explanation: [
        'Can be preemptive or non-preemptive.',
        'Priority can be defined internally (memory limits, time slice) or externally (user roles, cost).',
        'Convention: Some systems use lower number as high priority (Linux), others use higher number.'
      ],
      dryRun: [
        'P1(Burst=10, Priority=3), P2(Burst=1, Priority=1) [Highest].',
        'Gantt Chart: `[ P2 (0-1) ] ➔ [ P1 (1-11) ]`'
      ],
      complexity: [
        '**Time Complexity**: `O(N log N)`.',
        '**Starvation**: Low-priority processes may wait forever (Starve) on a busy system.'
      ],
      intuition: [
        'How do we fix Starvation? **Aging**! Gradually increase the priority of processes that wait in the queue for a long time.'
      ]
    },
    {
      title: 'Round Robin',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: '**Round Robin (RR)** is a preemptive scheduling algorithm designed specifically for time-sharing systems.',
      explanation: [
        'Every process gets a small unit of CPU time called a **Time Quantum** (usually 10-100ms).',
        'If a process burst is longer than the quantum, it is preempted and put back at the tail of the ready queue.',
        'Highly responsive; prevents starvation.'
      ],
      dryRun: [
        'P1(Burst=20), P2(Burst=3), P3(Burst=4) | Time Quantum = 4.',
        'Gantt Chart: `[ P1 (0-4) ] ➔ [ P2 (4-7) ] ➔ [ P3 (7-11) ] ➔ [ P1 (11-27) ]`'
      ],
      complexity: [
        '**Time Complexity**: `O(N)`.',
        'Performance depends heavily on the **Time Quantum**: too large = FCFS, too small = extreme context switch overhead.'
      ],
      intuition: [
        'Rule of thumb: Choose a time quantum where **80% of CPU bursts** are shorter than the quantum. This keeps response times fast while limiting context switch overhead.'
      ]
    },
    {
      title: 'Starvation',
      difficulty: 'Easy',
      type: 'theory',
      intro: '**Starvation** (or indefinite blocking) is a scenario where a ready process waits indefinitely for the CPU and is never scheduled.',
      explanation: [
        'Occurs in priority or SJF/SRTF scheduling.',
        'High-priority or shorter processes continually bypass older, low-priority/longer processes.',
        'Causes processes to remain frozen in the Ready queue.'
      ],
      intuition: [
        'An interviewer might ask: *"Is starvation the same as deadlock?"* **No!** In starvation, the process is ready to run but ignored. In deadlock, processes are waiting for events that will never occur (blocked on resource locks).'
      ],
      takeaways: [
        'Ready processes are starved by scheduling bias.',
        'Fixed by the **Aging** mechanism.',
        'Differs from Deadlock (deadlocked processes cannot run even if CPU is free).'
      ]
    },
    {
      title: 'Aging',
      difficulty: 'Easy',
      type: 'theory',
      intro: '**Aging** is a technique used to solve the problem of **Starvation** in priority-based systems.',
      explanation: [
        'The OS gradually increases the priority of processes that wait in the ready queue for a long time.',
        'Over time, even the lowest priority process will eventually age to become the highest priority process, guaranteeing CPU execution.'
      ],
      intuition: [
        'Think of aging as a ticket queue: the longer you wait in line, the higher your priority ticket becomes until you are served.'
      ],
      takeaways: [
        'Solves Starvation.',
        'Dynamically adjusts process priority over time.',
        'Ensures system fairness.'
      ]
    },
    {
      title: 'Scheduling Numericals',
      difficulty: 'Hard',
      type: 'numerical',
      problem: 'Processes P1, P2, P3 have Burst Times: P1=6ms, P2=8ms, P3=2ms, and Arrive at: P1=0ms, P2=1ms, P3=2ms. Find Average Turnaround Time (TAT) and Average Waiting Time (WT) using **preemptive SRTF**.',
      step1: 'Draw the Gantt Chart tracking remaining burst times: \n\n• t=0: P1 starts (remaining: 6). \n\n• t=1: P2 arrives (P2 remaining: 8, P1 remaining: 5). P1 continues. \n\n• t=2: P3 arrives (P3 remaining: 2, P1 remaining: 4). P3 runs.',
      step2: 'Continue tracking: \n\n• t=2 to t=4: P3 runs and finishes. \n\n• t=4: Ready: P1 (rem: 4), P2 (rem: 8). P1 runs [4-8] and finishes. \n\n• t=8: P2 runs [8-16] and finishes.',
      step3: 'Gantt Chart Summary: \n\n`[ P1 (0-2) ] ➔ [ P3 (2-4) ] ➔ [ P1 (4-8) ] ➔ [ P2 (8-16) ]` \n\n• Turnaround Time (Completion - Arrival): \n  P1 = 8 - 0 = 8 | P2 = 16 - 1 = 15 | P3 = 4 - 2 = 2. \n\n• Waiting Time (Turnaround - Burst): \n  P1 = 8 - 6 = 2 | P2 = 15 - 8 = 7 | P3 = 2 - 2 = 0.',
      answer: 'Average TAT = `(8 + 15 + 2) / 3 = 8.33ms` \n\nAverage WT = `(2 + 7 + 0) / 3 = 3ms`',
      shortcut: 'Double-check: Total Gantt chart duration must equal the sum of burst times (`6 + 8 + 2 = 16ms`). Since the Gantt chart terminates at `16`, execution timeline is correct.'
    }
  ],
  'Process Synchronization': [
    {
      title: 'Critical Section Problem',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Critical Section** is a segment of code where shared resources (memory, file, database) are accessed, which can lead to data corruption if multiple processes enter concurrently.',
      explanation: [
        'A solution must satisfy three requirements:',
        '**Mutual Exclusion**: Only one process can execute in its critical section at a time.',
        '**Progress**: If no process is executing and some want to enter, selection cannot be postponed indefinitely.',
        '**Bounded Waiting**: There must be a limit on the number of times other processes can enter before a waiting process gets turn.'
      ],
      intuition: [
        'Every process synchronization mechanism (Mutex, Semaphore, Monitor) exists to solve the critical section problem by enforcing these three conditions.'
      ],
      takeaways: [
        'Critical section access must be exclusive.',
        'Prevents data inconsistency.',
        'Requires Entry section and Exit section protocols.'
      ]
    },
    {
      title: 'Race Condition',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **Race Condition** is an undesirable situation that occurs when multiple threads read and write shared data concurrently, and the final value depends on the exact execution timing.',
      explanation: [
        'Happens when read-modify-write instructions are not executed atomically.',
        'Example: Two threads incrementing shared `counter = 5` concurrently. Read `5`, increment to `6`, write back. If interleaved, final count is `6` instead of `7`.',
        'Prevented by making the critical section **atomic** using locks.'
      ],
      intuition: [
        'Race conditions are dangerous because they are non-deterministic. A program might pass tests 99% of the time, and only fail under high CPU loads in production.'
      ],
      takeaways: [
        'Caused by concurrent execution on shared state.',
        'Results in non-deterministic bugs.',
        'Fixed by forcing Mutual Exclusion.'
      ]
    },
    {
      title: 'Peterson\'s Algorithm',
      difficulty: 'Hard',
      type: 'algorithm',
      intro: '**Peterson\'s Algorithm** is a classic software-based solution to the critical section problem for exactly **two processes**.',
      explanation: [
        'Uses two shared variables: `flag[2]` (boolean array indicating desire to enter) and `turn` (integer tracking whose turn it is).',
        'Process `i` sets `flag[i] = true` and yields turn to process `j` (`turn = j`).',
        'Busy waits while `flag[j]` is true and `turn === j`.'
      ],
      dryRun: [
        'P0 wants to enter: `flag[0] = true`, `turn = 1`.',
        'P1 wants to enter: `flag[1] = true`, `turn = 0`.',
        'Since `turn === 0`, P1 waits at the while loop. P0 enters critical section, exits, sets `flag[0] = false`, freeing P1.'
      ],
      complexity: [
        '**Time Complexity**: `O(1)` per request.',
        '**CPU Wasted**: Busy waiting (spin-locking) consumes 100% CPU time while waiting.'
      ],
      intuition: [
        'Peterson\'s algorithm is restricted to two processes and relies on strict sequential execution. On modern out-of-order CPUs, instruction reordering can break Peterson\'s algorithm, requiring hardware-level memory barriers.'
      ]
    },
    {
      title: 'Mutex',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A **Mutex** (Mutual Exclusion lock) is a hardware-supported software tool used to protect critical sections and prevent race conditions.',
      explanation: [
        'Acts as a locking mechanism with binary states: `locked` (`0`) or `unlocked` (`1`).',
        'A thread calls `acquire()` to get the lock. If locked, the thread is blocked until lock is released.',
        'Strict ownership: Only the thread that acquired the mutex can release it using `release()`.'
      ],
      intuition: [
        'Mutexes can be implemented as **Spinlocks** (busy waiting) or **Mutex Locks** (which put the thread to sleep, yielding CPU). Spinlocks are preferred for extremely short critical sections to avoid context switch overhead.'
      ],
      takeaways: [
        'Binary state lock.',
        'Strict ownership (Lock-holder must release).',
        'Prevents simultaneous critical section access.'
      ]
    },
    {
      title: 'Semaphore',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A **Semaphore** is a synchronization tool represented by an integer variable `S` that is accessed via two atomic operations: `wait()` and `signal()`.',
      explanation: [
        '**Binary Semaphore**: Integer value ranges between `0` and `1` (similar to Mutex, but has no ownership).',
        '**Counting Semaphore**: Integer value can range over an unrestricted domain, representing the number of available resources.',
        'Atomic methods: `wait(S)` decrements `S`, blocks if `S <= 0`. `signal(S)` increments `S`, wakes up a waiting thread.'
      ],
      intuition: [
        'Unlike Mutex, a Semaphore has **no owner**. A thread can call `wait()` to block itself, and a completely different thread (or interrupt handler) can call `signal()` to wake it up.'
      ],
      takeaways: [
        'Signaling mechanism.',
        'Counting semaphore tracks N resources.',
        'No ownership model.'
      ]
    },
    {
      title: 'Monitor',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'A **Monitor** is a high-level programming language construct that provides equivalent functionality to semaphores but with automatic mutual exclusion.',
      explanation: [
        'Only **one** thread can be active inside the monitor at any time.',
        'Variables and procedures are encapsulated. Access is automatically synchronized by the compiler.',
        'Uses **Condition Variables** (`wait` and `signal`) to allow threads to wait for specific conditions.'
      ],
      intuition: [
        'Java\'s `synchronized` keyword on methods is an implementation of the monitor concept. You don\'t write manual acquire/release code; the compiler/JVM manages the lock entry automatically.'
      ],
      takeaways: [
        'High-level synchronization construct.',
        'Automatic mutual exclusion enforced by compiler.',
        'Encapsulates shared variables and lock logic.'
      ]
    },
    {
      title: 'Producer Consumer',
      difficulty: 'Hard',
      type: 'algorithm',
      intro: 'The **Producer-Consumer Problem** (or Bounded-Buffer) is a classical synchronization problem with a shared buffer of size `N`.',
      explanation: [
        'Producer generates data and places it in buffer. Consumer removes data.',
        'Must prevent producer from writing to a **full buffer**, and consumer from reading from an **empty buffer**.',
        'Uses three semaphores: `mutex` (for exclusive access), `empty` (tracks empty slots), `full` (tracks filled slots).'
      ],
      dryRun: [
        'Buffer size = 3. Init: `empty=3`, `full=0`, `mutex=1`.',
        'Producer: `wait(empty)` ➔ `wait(mutex)` ➔ Write ➔ `signal(mutex)` ➔ `signal(full)`. (Buffer full=1, empty=2).',
        'Consumer: `wait(full)` ➔ `wait(mutex)` ➔ Read ➔ `signal(mutex)` ➔ `signal(empty)`. (Buffer full=0, empty=3).'
      ],
      complexity: [
        '**Time Complexity**: `O(1)` per operation.',
        '**Space Complexity**: `O(N)` buffer storage.'
      ],
      intuition: [
        'Make sure to call `wait(empty)` or `wait(full)` **before** calling `wait(mutex)`. Swapping these locks causes a **Deadlock** (producer locks buffer, but waits forever for empty slot, while consumer can\'t enter buffer to consume).'
      ]
    },
    {
      title: 'Reader Writer',
      difficulty: 'Hard',
      type: 'algorithm',
      intro: 'The **Readers-Writers Problem** manages access to a shared resource where multiple readers can access concurrently, but writers require exclusive access.',
      explanation: [
        '**Rules**: Multiple readers can read. Only one writer can write. No reading during writing.',
        'Uses semaphores: `rw_mutex` (for writer lock), `mutex` (protects read_count variable), and integer `read_count`.',
        'First reader locks `rw_mutex`. Last reader unlocks `rw_mutex`.'
      ],
      dryRun: [
        'Reader 1 arrives: `lock(mutex)`, `read_count++`. Since `read_count === 1`, `lock(rw_mutex)`. `unlock(mutex)`. Reader 1 reads.',
        'Reader 2 arrives: `lock(mutex)`, `read_count++`. Since it is not first, skips `rw_mutex` lock. `unlock(mutex)`. Reader 2 reads concurrently.',
        'Reader 1 & 2 exit: decrement `read_count`. When `read_count === 0`, `unlock(rw_mutex)` is called, letting writers write.'
      ],
      complexity: [
        '**Time Complexity**: `O(1)` access setup.',
        '**Starvation**: Writers can starve if new readers keep arriving, keeping `read_count > 0`.'
      ],
      intuition: [
        'Standard Readers-Writers favor readers. In production databases, we use **Writer-Preference** locks to prevent writers from starving indefinitely when read loads are high.'
      ]
    },
    {
      title: 'Dining Philosophers',
      difficulty: 'Hard',
      type: 'algorithm',
      intro: 'The **Dining Philosophers Problem** is a classic synchronization problem representing resource allocation challenges.',
      explanation: [
        'Five philosophers sit around a table with five chopsticks. A philosopher needs both left and right chopsticks to eat.',
        'If all pick up their left chopstick simultaneously, they wait forever for the right one, causing a **Deadlock**.',
        'Solutions: Allow eating only if both are free, use an asymmetric rule (odd/even philosophers pick different sides first), or limit table seats to 4.'
      ],
      dryRun: [
        'Asymmetric Rule: Philosopher `i` (if odd) grabs left then right; (if even) grabs right then left.',
        'Prevents the cycle: Phil 0 grabs right (chopstick 1). Phil 1 grabs left (chopstick 1 - blocked!). Phil 0 eats, releases, break deadlock.'
      ],
      complexity: [
        '**Time Complexity**: `O(1)`.',
        '**Deadlock Prevention**: Breaks Circular Wait condition.'
      ],
      intuition: [
        'This problem represents competing processes lock-ordering dependencies. Standardizing lock acquisition order across all threads is the most practical way to prevent deadlocks in real-world software.'
      ]
    }
  ],
  'Deadlocks': [
    {
      title: 'Deadlock Introduction',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **Deadlock** is a state where a set of processes are blocked because each process holds a resource and waits for another resource held by another process in the set.',
      explanation: [
        'Example: Process A holds Resource 1 and waits for Resource 2. Process B holds Resource 2 and waits for Resource 1.',
        'Neither process can make progress; they remain frozen indefinitely.',
        'Requires manual OS intervention (termination or rollback) to resolve.'
      ],
      intuition: [
        'Think of a intersection gridlock where four cars block each other in a circle. No car can move forward because the path is blocked by the car in front of it.'
      ],
      takeaways: [
        'Deadlock means execution freeze.',
        'Caused by resource request dependencies.',
        'Cannot resolve automatically without OS action.'
      ]
    },
    {
      title: 'Necessary Conditions',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A deadlock can occur if and only if **all four Coffman conditions** hold simultaneously.',
      explanation: [
        '**Mutual Exclusion**: At least one resource must be held in a non-shareable mode (only one process can use it).',
        '**Hold and Wait**: A process must hold at least one resource and wait for other resources.',
        '**No Preemption**: Resources cannot be taken away from a process; they must be released voluntarily.',
        '**Circular Wait**: A closed loop of processes exists where each process waits for a resource held by the next.'
      ],
      intuition: [
        'To prevent deadlocks, you only need to **break one** of these four conditions! Eliminating any single condition guarantees deadlocks will never occur.'
      ],
      takeaways: [
        'Four Coffman conditions.',
        'Must happen simultaneously.',
        'Breaking any single condition prevents deadlocks.'
      ]
    },
    {
      title: 'Resource Allocation Graph',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A **Resource Allocation Graph (RAG)** is a directed graph used to detect deadlocks visually.',
      explanation: [
        '**Vertices**: Divided into Processes ($P$) and Resource types ($R$).',
        '**Request Edge**: Directed edge $P_i \rightarrow R_j$ (process requests resource).',
        '**Allocation Edge**: Directed edge $R_j \rightarrow P_i$ (resource is allocated to process).',
        '**Deadlock Rule**: If the RAG has **no cycles**, there is no deadlock. If it has a **cycle**, deadlock exists if resources have single instances.'
      ],
      intuition: [
        'If resources have multiple instances (e.g. 3 identical printers), a cycle in the RAG indicates a **potential** deadlock, not a guaranteed one, as another process could release a resource copy.'
      ],
      takeaways: [
        'Visual tool for deadlock detection.',
        'Cycle with single-instance resources = Deadlock.',
        'Cycle with multi-instance resources = Potential deadlock.'
      ]
    },
    {
      title: 'Deadlock Prevention',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Deadlock Prevention** methods eliminate deadlocks by ensuring that at least one of the four Coffman conditions cannot hold.',
      explanation: [
        '**Prevent Hold and Wait**: Force processes to request all resources at startup, or release all held resources before requesting new ones.',
        '**Prevent No Preemption**: If a process requests a resource that is not free, preempt (forcefully release) all resources it currently holds.',
        '**Prevent Circular Wait**: Order all resources globally (e.g., $1$ to $N$). Processes must request resources only in strictly increasing numeric order.'
      ],
      intuition: [
        'Preventing Circular Wait by **lock-ordering** is the most common technique used in software engineering. For example, if database updates always lock Account Table first, then transaction logs, deadlock is impossible.'
      ],
      takeaways: [
        'Disables one of Coffman conditions.',
        'Decreases resource utilization (highly restrictive).',
        'Lock-ordering is the most practical method.'
      ]
    },
    {
      title: 'Deadlock Avoidance',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Deadlock Avoidance** dynamically decides whether to grant a resource request based on safety states to avoid deadlocks.',
      explanation: [
        'Requires the OS to have **a priori knowledge** of each process\'s maximum resource demands.',
        '**Safe State**: A state is safe if there exists a sequence of processes such that all processes can finish execution without deadlocking.',
        'If a request leads to an unsafe state, the process is forced to wait, even if the resource is currently free.'
      ],
      intuition: [
        'An **unsafe state** is NOT a deadlock! An unsafe state is simply a state that *might* lead to a deadlock depending on future requests. Avoidance keeps the system strictly in a Safe State.'
      ],
      takeaways: [
        'Dynamic validation of requests.',
        'Keeps system in a Safe State.',
        'Requires knowing maximum resource demands beforehand.'
      ]
    },
    {
      title: 'Banker\'s Algorithm',
      difficulty: 'Hard',
      type: 'algorithm',
      intro: 'The **Banker\'s Algorithm** is a classic deadlock avoidance algorithm for systems with multi-instance resources.',
      explanation: [
        'Checks if granting a request keeps the system in a safe state.',
        'Maintains matrices: `Allocation` (held resources), `Max` (total needed), `Need` (`Max - Allocation`), and vector `Available`.',
        'Simulates allocating resources, checking if there is a sequence where all processes can execute using remaining available resources.'
      ],
      dryRun: [
        'Available = `[3, 3, 2]`. P0 needs `[7, 4, 3]`. P1 needs `[1, 2, 2]`. P0 cannot finish.',
        'P1 can finish because its Need `[1,2,2] <= Available [3,3,2]`.',
        'Simulate P1 run, finish, and return its allocated resources to available pool. Repeat for other processes to verify if all can finish.'
      ],
      complexity: [
        '**Time Complexity**: `O(M * N^2)` where `N` is processes and `M` is resource types.',
        '**Space Complexity**: `O(N * M)` for matrices.'
      ],
      intuition: [
        'Like a bank manager who only lends money if they can guarantee they have enough cash flow to let at least one customer finish their business, retrieve their loan, and serve the next.'
      ]
    },
    {
      title: 'Detection & Recovery',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'If a system does not prevent or avoid deadlocks, it must periodically run detection algorithms and recover if a deadlock is found.',
      explanation: [
        '**Detection**: OS periodically runs a wait-for graph cycle detection algorithm.',
        '**Recovery Option 1**: Process Termination. Kill all deadlocked processes, or kill one process at a time until the deadlock cycle is broken.',
        '**Recovery Option 2**: Resource Preemption. Reclaim resources from one process and allocate them to another, rolling back the preempted process.'
      ],
      intuition: [
        'Recovery by process termination is expensive because aborted processes lose all progress. Schedulers select victims based on process priority, runtime remaining, and held resources.'
      ],
      takeaways: [
        'Allows deadlocks to happen, then cleans them.',
        'Wait-for graph is used for detection.',
        'Recovery requires aborting processes or rolling them back.'
      ]
    },
    {
      title: 'Deadlock Numericals',
      difficulty: 'Hard',
      type: 'numerical',
      problem: 'System has 3 processes (P0, P1, P2) and 3 resource types (A, B, C). \n\n• Available = `[3, 3, 2]` \n\n• Allocation matrices: P0=`[0, 1, 0]`, P1=`[2, 0, 0]`, P2=`[3, 0, 2]` \n\n• Max demand: P0=`[7, 5, 3]`, P1=`[3, 2, 2]`, P2=`[9, 0, 2]`. \n\nIs the system in a safe state? Find a safe execution sequence.',
      step1: 'Calculate the **Need Matrix** (`Need = Max - Allocation`):\n\n• P0 Need = `[7, 4, 3]`\n\n• P1 Need = `[1, 2, 2]`\n\n• P2 Need = `[6, 0, 0]`\n\nAvailable = `[3, 3, 2]`.',
      step2: 'Find a process whose Need $\le$ Available: \n\n• Compare P1: Need `[1, 2, 2] <= Available [3, 3, 2]`. True! \n\n• P1 executes, completes, and releases resources. \n\n• New Available = `Available + P1 Allocation = [3, 3, 2] + [2, 0, 0] = [5, 3, 2]`. Mark P1 completed.',
      step3: 'Find the next process: \n\n• Compare P2: Need `[6, 0, 0] <= Available [5, 3, 2]`. False. \n\n• Compare P0: Need `[7, 4, 3] <= Available [5, 3, 2]`. False. \n\n• No other process can finish execution.',
      answer: 'The system is in an **unsafe state** (deadlocked!). There is no safe sequence because neither P0 nor P2 can finish execution with remaining available resources.',
      shortcut: 'Instant Check: Since no process can execute after P1 finishes, the system lacks resource liquidity. The final state holds no safe path.'
    }
  ],
  'Memory Management': [
    {
      title: 'Logical vs Physical Address',
      difficulty: 'Easy',
      type: 'comparison',
      intro: 'Modern memory management abstracts hardware physical memory using virtual mapping.',
      conceptA: 'Logical Address',
      conceptA_bullets: [
        'Generated by the CPU during code execution (also called Virtual Address).',
        'Reference point for user programs; processes never see actual physical RAM.',
        'Exists inside the program\'s virtual memory layout.'
      ],
      conceptB: 'Physical Address',
      conceptB_bullets: [
        'Actual physical address inside the memory unit (RAM hardware).',
        'Loaded into the memory address register.',
        'Mapped from logical address by the MMU (Memory Management Unit).'
      ],
      comparisonTable: [
        '**Generated by**: CPU ➔ MMU Hardware during execution',
        '**Program visibility**: Fully visible in user space ➔ Completely hidden from user space',
        '**Address Space range**: Virtual Address Space ➔ Physical RAM memory layout'
      ],
      intuition: [
        'Logical address is like a room number in a hotel directory ("Room 101"). Physical address is the actual latitude and longitude coordinates of that room on Earth.'
      ]
    },
    {
      title: 'Address Binding',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Address Binding is the process of mapping program instructions and data to physical memory locations.',
      explanation: [
        '**Compile Time**: If memory location is known beforehand, absolute code is generated. Requires recompile if location changes.',
        '**Load Time**: Compiler generates relocatable code. Binding is delayed until the program is loaded into memory.',
        '**Execution (Run) Time**: Binding is delayed until runtime. Process can move during execution (requires MMU support). Standard in modern OS.'
      ],
      intuition: [
        'Run-time binding is crucial for virtual memory and swapping. It allows the OS to move pages in and out of the disk without breaking the memory references in running processes.'
      ],
      takeaways: [
        'Maps code references to memory locations.',
        'Compile-time, Load-time, and Run-time binding options.',
        'Modern OS uses Run-time binding.'
      ]
    },
    {
      title: 'Swapping',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Swapping** is the mechanism where a process is temporarily moved out of main memory (RAM) to backing store (SSD/HDD), and brought back later.',
      explanation: [
        'Enables execution of more processes than fit in physical RAM size.',
        '**Swap Out**: Move idle/blocked process to disk.',
        '**Swap In**: Move process back to memory when scheduled.',
        'Backing store is usually a dedicated disk partition (swap space).'
      ],
      intuition: [
        'Swapping is slow because disk access takes thousands of times longer than RAM access. Modern OS perform **page swapping** (moving individual pages) rather than swapping entire processes.'
      ],
      takeaways: [
        'Increases multiprogramming limits.',
        'Backing store is swap space.',
        'Incurs high disk I/O latency.'
      ]
    },
    {
      title: 'Fragmentation',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Fragmentation** is a state where memory storage is wasted, leaving available memory slots unused.',
      explanation: [
        '**External Fragmentation**: Total free memory is sufficient to satisfy a request, but it is split into tiny, non-contiguous chunks.',
        '**Internal Fragmentation**: Memory allocated to a process is slightly larger than requested. The unused partition space inside the allocation is wasted.',
        'External fragmentation is resolved by **compaction** (moving processes together) or by **Paging**.'
      ],
      intuition: [
        'Paging completely solves external fragmentation because it allows physical memory allocation to be completely non-contiguous, meaning any page can fit into any free page frame.'
      ],
      takeaways: [
        'Internal: wasted space inside allocated blocks.',
        'External: wasted space between allocated blocks.',
        'Resolved by Paging and Compaction.'
      ]
    },
    {
      title: 'First Fit',
      difficulty: 'Easy',
      type: 'algorithm',
      intro: '**First Fit** is a dynamic memory allocation strategy that assigns the process to the first free block that is large enough.',
      explanation: [
        'Scans the memory free list from the beginning.',
        'Allocates block immediately upon finding a fit.',
        'Fastest search strategy.'
      ],
      dryRun: [
        'Request size: `150 KB`. Memory Blocks: `[100 KB, 300 KB, 200 KB]`.',
        'Scan starts: `100 KB` is too small. `300 KB` fits.',
        'Allocate inside `300 KB` block. Leftover block is `150 KB`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N)` search time.',
        'Prone to accumulating small unusable blocks at the beginning of the free list.'
      ],
      intuition: [
        'First Fit is highly efficient in practice because it minimizes search times. However, it tends to clutter the front of the memory list with tiny fragments.'
      ]
    },
    {
      title: 'Best Fit',
      difficulty: 'Easy',
      type: 'algorithm',
      intro: '**Best Fit** allocates the process to the smallest free block that is large enough to contain it.',
      explanation: [
        'Scans the entire free list (unless sorted).',
        'Finds the block that leaves the smallest leftover fragment.',
        'Minimizes wasted memory footprint for the current allocation.'
      ],
      dryRun: [
        'Request size: `150 KB`. Memory Blocks: `[100 KB, 300 KB, 200 KB]`.',
        'Scan list: `200 KB` is the closest size that fits.',
        'Allocate inside `200 KB` block. Leftover fragment is `50 KB`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N)` (must scan entire list).',
        'Produces tiny, unusable leftover fragments (external fragmentation).'
      ],
      intuition: [
        'Best Fit sounds optimal, but it is often the worst overall because it leaves behind tiny, useless memory fragments that are too small to satisfy any future requests.'
      ]
    },
    {
      title: 'Worst Fit',
      difficulty: 'Easy',
      type: 'algorithm',
      intro: '**Worst Fit** allocates the process to the largest available free memory block.',
      explanation: [
        'Scans the entire free list to find the largest block.',
        'Hypothesis: Leaving a large leftover fragment is better because that fragment can be used for future allocations.'
      ],
      dryRun: [
        'Request: `150 KB`. Blocks: `[100 KB, 300 KB, 200 KB]`.',
        'Largest block is `300 KB`.',
        'Allocate inside `300 KB`. Leftover block is `150 KB`, which is still large enough to be useful.'
      ],
      complexity: [
        '**Time Complexity**: `O(N)` scan time.',
        'Rapidly consumes largest blocks, preventing large processes from running.'
      ],
      intuition: [
        'Worst fit preserves fragment utility but performs poorly because it quickly splits your largest contiguous blocks, meaning big memory requests will soon fail.'
      ]
    }
  ],
  'Paging': [
    {
      title: 'Paging Basics',
      difficulty: 'Easy',
      type: 'theory',
      intro: '**Paging** is a memory management scheme that eliminates the need for contiguous allocation of physical memory.',
      explanation: [
        'Divides logical memory into fixed-size blocks called **Pages**.',
        'Divides physical memory into fixed-size blocks called **Frames**.',
        'Page size is exactly equal to Frame size (typically 4 KB).',
        'Eliminates **External Fragmentation** entirely.'
      ],
      intuition: [
        'Because any page can fit into any free frame, the OS no longer has to search for contiguous blocks of RAM. Logical memory looks contiguous to the program, but physical frames can be scattered anywhere in RAM.'
      ],
      takeaways: [
        'Fixed-size blocks (Pages/Frames).',
        'Resolves external fragmentation.',
        'Suffers from minor **Internal Fragmentation** (only on the last page of a process).'
      ]
    },
    {
      title: 'Page Table',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Page Table** is a data structure kept in kernel memory for each process, used to translate logical page numbers to physical frame numbers.',
      explanation: [
        'Indexed by Page Number ($p$).',
        'Contains the corresponding Frame Number ($f$) in RAM.',
        'Has control bits: Valid/Invalid (in RAM or disk), Read/Write privileges, Dirty bit (modified).'
      ],
      intuition: [
        'Because the page table is stored in RAM, accessing data requires **two memory accesses**: one to read the page table entry, and one to read the actual data. This slows down execution, which is resolved by the **TLB**.'
      ],
      takeaways: [
        'Maintains page-to-frame mapping.',
        'One page table exists per process.',
        'Stored in main memory (Page Table Base Register points to it).'
      ]
    },
    {
      title: 'TLB',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Translation Lookaside Buffer (TLB)** is a high-speed hardware cache located inside the CPU MMU that stores recent page translations.',
      explanation: [
        'Acts as an associative cache for the Page Table.',
        'CPU checks TLB first. **TLB Hit**: Frame retrieved instantly (zero overhead).',
        '**TLB Miss**: MMU reads Page Table in RAM, updates TLB, and accesses data.'
      ],
      intuition: [
        'TLB works because of **locality of reference**. Programs access the same pages repeatedly, yielding a typical TLB hit rate of over 95%.'
      ],
      takeaways: [
        'Fast hardware cache inside MMU.',
        'Speeds up address translation.',
        'Miss triggers standard page table lookup.'
      ]
    },
    {
      title: 'Address Translation',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The CPU MMU translates logical addresses to physical addresses using page mapping.',
      explanation: [
        'Logical address generated by CPU is split into: **Page Number ($p$)** and **Page Offset ($d$)**.',
        'MMU uses $p$ to lookup the Frame Number ($f$) in the Page Table.',
        'Physical Address is constructed by appending the offset $d$ to the frame address $f$.',
        'Note: Page offset ($d$) remains **unchanged** during translation.'
      ],
      intuition: [
        'If page size is $2^k$ bytes, the low-order $k$ bits of the logical address represent the offset $d$, and the remaining high-order bits represent the page number $p$.'
      ],
      takeaways: [
        'Address split: `p` (page number) and `d` (offset).',
        'Frame number `f` replaces `p`.',
        'Offset `d` is constant.'
      ]
    },
    {
      title: 'Multi-Level Paging',
      difficulty: 'Hard',
      type: 'theory',
      intro: '**Multi-Level Paging** divides the page table into smaller hierarchy levels to avoid storing giant contiguous page tables in memory.',
      explanation: [
        'A 32-bit system with 4 KB pages requires a 4 MB page table *per process*, which is too large to fit contiguously.',
        'Multi-level paging pages the page table itself (e.g., Two-Level Paging).',
        'Outer page table points to page table pages, which point to actual frames.',
        'Only the outer page table must remain in RAM; outer entries point to page tables loaded on demand.'
      ],
      intuition: [
        'Think of it as a book index. Instead of having a single 1000-page index list, you have a 1-page table of contents (Outer) pointing to sub-indexes (Inner).'
      ],
      takeaways: [
        'Breaks page table into non-contiguous chunks.',
        'Saves kernel RAM space.',
        'Increases memory access latency (requires more lookup steps).'
      ]
    },
    {
      title: 'Effective Access Time',
      difficulty: 'Hard',
      type: 'numerical',
      problem: 'In a paging system, **TLB access time** is `20 ns`, and **Main Memory access time** is `120 ns`. If the **TLB hit rate** is `90%`, what is the **Effective Access Time (EAT)**?',
      step1: 'Identify parameters: \n\n• Hit rate = `0.9` | Miss rate = `0.1`. \n\n• TLB time = `20 ns` | Memory time = `120 ns`. \n\nFormula: `EAT = Hit_Rate * (TLB + Memory) + Miss_Rate * (TLB + 2 * Memory)`.',
      step2: 'Plug in the values: \n\n• `EAT = 0.9 * (20 + 120) + 0.1 * (20 + 2 * 120)` \n\n• `EAT = 0.9 * (140) + 0.1 * (20 + 240)` \n\n• `EAT = 0.9 * 140 + 0.1 * 260`.',
      step3: 'Calculate final arithmetic values: \n\n• `EAT = 126 + 26` \n\n• `EAT = 152 ns`.',
      answer: 'Effective Access Time (EAT) = **152 ns**.',
      shortcut: 'Sanity Check: EAT must lie between `TLB + Memory` (`140 ns`) and `TLB + 2 * Memory` (`260 ns`). Since `140 < 152 < 260`, the output value is verified.'
    },
    {
      title: 'Paging Numericals',
      difficulty: 'Hard',
      type: 'numerical',
      problem: 'A system uses a **32-bit logical address space** with a **Page Size of 4 KB**. How many entries are there in the page table, and what is the size of the page table (assuming each entry is 4 bytes)?',
      step1: 'Calculate number of pages: \n\n• Logical address size = $2^{32}$ bytes. \n\n• Page size = 4 KB = $4 \times 1024$ bytes = $2^{12}$ bytes. \n\n• Number of Pages = $\\frac{2^{32}}{2^{12}} = 2^{20}$ pages.',
      step2: 'Find number of page table entries: \n\n• Every page must have an entry. \n\n• Number of Page Table Entries = $2^{20} = 1,048,576$ entries.',
      step3: 'Calculate Page Table Size: \n\n• Page Table Size = $2^{20} \\times 4$ bytes = $4 \\text{ MB}$.',
      answer: 'Number of Page Table Entries = **$2^{20}$ entries** \n\nPage Table Size = **4 MB**',
      shortcut: 'Quick calculation trick: Subtract page size bits (`12` for 4 KB) from address bits (`32`) to get the page index bits (`20` bits). $2^{20}$ entries $\\times$ 4 bytes = 4 MB.'
    }
  ],
  'Segmentation': [
    {
      title: 'Segmentation Basics',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Segmentation** is a memory management scheme that maps the programmer\'s view of a program to physical memory.',
      explanation: [
        'Divides logical memory into variable-sized, logical segments (e.g., main program, stack, heap, library functions).',
        'Addresses consist of a **Segment Number ($s$)** and a **Segment Offset ($d$)**.',
        'Allows programs to be modularized and protected based on logical divisions.'
      ],
      intuition: [
        'Paging divides memory blindly into fixed blocks without care for program structure. Segmentation keeps logical sections (like the code segment or stack segment) grouped together.'
      ],
      takeaways: [
        'Variable-sized memory blocks.',
        'Reflects programmer\'s logical view of code.',
        'Prevents logical data corruption.'
      ]
    },
    {
      title: 'Segment Table',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The **Segment Table** maps 2D logical segment addresses to physical memory addresses.',
      explanation: [
        'Indexed by Segment Number ($s$).',
        'Each entry contains: **Base** (starting physical address of segment) and **Limit** (length of segment).',
        'MMU checks if Offset ($d$) is within the Limit: if $d \\ge \\text{Limit}$, a **Trap (Segment Fault)** is thrown.'
      ],
      intuition: [
        'Why does it check $d < \\text{Limit}$? Since segments are variable in length, the MMU must prevent a program from indexing beyond the boundary of a segment (which would lead to buffer overflows).'
      ],
      takeaways: [
        'Maintains Segment Base and Limit.',
        'Protects boundaries (checks $d < \\text{Limit}$).',
        'Stored in MMU registers.'
      ]
    },
    {
      title: 'Paging vs Segmentation',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'These two memory allocation techniques differ in size allocation and structural logic.',
      conceptA: 'Paging',
      conceptA_bullets: [
        'Memory is divided into fixed-size blocks.',
        'No external fragmentation; suffers from internal fragmentation.',
        'Hardware-centric division.'
      ],
      conceptB: 'Segmentation',
      conceptB_bullets: [
        'Memory is divided into variable-sized logical blocks.',
        'Suffers from external fragmentation; no internal fragmentation.',
        'User-centric division.'
      ],
      comparisonTable: [
        '**Partition Size**: Fixed blocks (pages) ➔ Variable blocks (segments)',
        '**Fragmentation**: Internal fragmentation ➔ External fragmentation',
        '**Address Scheme**: 1D address (p + d) ➔ 2D address (s + d)'
      ],
      intuition: [
        'Modern operating systems combine both: **Paged Segmentation**. The logical view is divided into segments, and each segment is subdivided into pages to get the benefits of both worlds.'
      ]
    }
  ],
  'Virtual Memory': [
    {
      title: 'Virtual Memory Concept',
      difficulty: 'Easy',
      type: 'theory',
      intro: '**Virtual Memory** is a technique that allows the execution of processes that are not completely loaded in physical RAM.',
      explanation: [
        'Separates user logical memory from physical memory space.',
        'Enables execution of programs that are larger than physical RAM size.',
        'Increases multiprogramming limits by storing inactive pages on backing disk.'
      ],
      intuition: [
        'Virtual memory allows developers to code as if they have unlimited memory. The OS manages the actual swapping behind the scenes.'
      ],
      takeaways: [
        'Abstracts physical RAM limits.',
        'Allows execution of partially loaded processes.',
        'Implements swap space separation.'
      ]
    },
    {
      title: 'Demand Paging',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Demand Paging** is the standard virtual memory implementation where pages are loaded into memory only when they are requested (on demand).',
      explanation: [
        'A page is never loaded into RAM until the CPU attempts to access it.',
        'Saves CPU time and RAM space by avoiding loading unused code (e.g., error routines).',
        'Uses a **Valid/Invalid Bit** in the page table to track if a page is currently in RAM.'
      ],
      intuition: [
        'Why load code you never run? Demand paging keeps startup times fast by loading only the code path currently executing.'
      ],
      takeaways: [
        'Load pages only on request.',
        'Reduces startup overhead.',
        'Managed using page table valid/invalid bits.'
      ]
    },
    {
      title: 'Page Fault',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A **Page Fault** is a hardware interrupt trap thrown by the MMU when a process attempts to access a page that is not currently loaded in main memory (RAM).',
      explanation: [
        'CPU attempts to read page and finds the **Invalid** bit in Page Table.',
        'Trap interrupt is sent to the OS kernel.',
        'OS locates the page on backing store (disk).',
        'OS finds a free frame in RAM, reads page from disk, updates page table to **Valid**, and restarts the CPU instruction.'
      ],
      intuition: [
        'Page faults are expensive because they block execution to perform disk I/O. Minimizing page faults is the key target of page replacement algorithms.'
      ],
      takeaways: [
        'Hardware trap thrown on invalid page references.',
        'Triggers disk I/O to fetch page.',
        'Instruction restarts automatically after page is loaded.'
      ]
    },
    {
      title: 'Thrashing',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Thrashing** is a high-paging state where a process spends more time swapping pages in and out of disk than executing instructions.',
      explanation: [
        'Occurs when the sum of active pages needed (Working Set) exceeds the number of available memory frames.',
        'CPU utilization drops to near-zero because the CPU is waiting on page swaps.',
        'OS incorrectly thinks CPU is idle, increases multiprogramming level, spawning more processes and making thrashing worse.'
      ],
      intuition: [
        'If a computer is thrashing, you will hear the hard drive clicking constantly (thrashing) and the UI will freeze. To stop thrashing, you must terminate some processes or add more RAM.'
      ],
      takeaways: [
        'System spends all time paging.',
        'Drastic drop in CPU performance.',
        'Resolved by terminating processes.'
      ]
    },
    {
      title: 'Working Set',
      difficulty: 'Hard',
      type: 'theory',
      intro: 'The **Working Set Model** tracks a process\'s active pages over a sliding time window to prevent thrashing.',
      explanation: [
        '**Working Set ($\Delta$)**: The set of pages referenced in the last $\Delta$ page references.',
        'If total working sets of all active processes exceeds available RAM frames ($D > \\Sigma WSS_i$), the OS will swap out an entire process to prevent thrashing.'
      ],
      intuition: [
        'Working set model tracks the locality of a process. If a loop uses pages {1, 2, 5}, those three pages constitute the working set. The OS must keep all three in RAM, or the loop will fault on every iteration.'
      ],
      takeaways: [
        'Measures active page requirements.',
        'Prevents Thrashing.',
        'Uses a sliding time parameter $\Delta$.'
      ]
    },
    {
      title: 'Copy on Write',
      difficulty: 'Medium',
      type: 'theory',
      intro: '**Copy-on-Write (COW)** is an optimization technique that allows parent and child processes to share the same physical memory pages initially on `fork()`.',
      explanation: [
        'OS marks the shared pages as read-only.',
        'If either process attempts to write/modify a page, a page fault is triggered.',
        'The OS then duplicates that specific page, marks it writeable, and maps it to the modifying process.',
        'Saves massive CPU time during process creation.'
      ],
      intuition: [
        'Since `fork()` is often followed immediately by `exec()` (which discards parent memory), copying the whole parent memory space on fork is a waste. COW ensures we only copy memory if it actually changes.'
      ],
      takeaways: [
        'Shares parent-child memory initially.',
        'Duplicate page only upon modification.',
        'Highly optimizes `fork()` system calls.'
      ]
    }
  ],
  'Page Replacement': [
    {
      title: 'FIFO',
      difficulty: 'Easy',
      type: 'algorithm',
      intro: '**First-In-First-Out (FIFO)** page replacement replaces the page that has been in memory for the longest time.',
      explanation: [
        'OS tracks pages in memory using a FIFO queue.',
        'Replaces the queue head on page faults.',
        'Simple to implement, but can perform poorly in practice.'
      ],
      dryRun: [
        'Reference string: `[7, 0, 1, 2, 0, 3]` | Frames: 3 \n\n• `7`, `0`, `1` ➔ Faults ➔ Frames: `[7, 0, 1]` \n\n• `2` ➔ Replaces `7` (oldest) ➔ Frames: `[2, 0, 1]` \n\n• `0` ➔ Hit ➔ Frames: `[2, 0, 1]` \n\n• `3` ➔ Replaces `0` (oldest) ➔ Frames: `[2, 3, 1]`.'
      ],
      complexity: [
        '**Time Complexity**: `O(1)` per page reference.',
        '**Belady\'s Anomaly**: Increasing memory frames can cause *more* page faults.'
      ],
      intuition: [
        'FIFO has a major logical flaw: it might replace a highly active page just because it was loaded first. This lead to the discovery of **Belady\'s Anomaly**.'
      ]
    },
    {
      title: 'Optimal',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: 'The **Optimal Page Replacement (OPT)** algorithm replaces the page that will not be used for the longest period in the future.',
      explanation: [
        'Guarantees the lowest possible page fault rate for a fixed frame count.',
        'Impossible to implement in real-world operating systems because it requires looking into the future.',
        'Used as a benchmark to measure other algorithms.'
      ],
      dryRun: [
        'Reference: `[1, 2, 3, 4, 1, 2]` | Frames: 3 \n\n• `1`, `2`, `3` ➔ Faults ➔ Frames: `[1, 2, 3]` \n\n• `4` ➔ Replaces `3` (since `1` and `2` are used next, `3` is used longest in future) ➔ Frames: `[1, 2, 4]`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N)` look-ahead search.',
        'Theoretical benchmark only.'
      ],
      intuition: [
        'OPT is like having a crystal ball. Since OS designers don\'t have one, they design algorithms like **LRU** that use the past to estimate the future.'
      ]
    },
    {
      title: 'LRU',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: '**Least Recently Used (LRU)** page replacement replaces the page that has not been accessed for the longest period of time.',
      explanation: [
        'Exploits the **Temporal Locality** principle (past behavior predicts future usage).',
        'Replaces the page with the oldest timestamp.',
        'Performs very close to Optimal in most real-world workloads.'
      ],
      dryRun: [
        'Reference: `[1, 2, 3, 2, 4]` | Frames: 3 \n\n• `1`, `2`, `3` ➔ Faults ➔ Frames: `[1, 2, 3]` \n\n• `2` ➔ Hit ➔ Frames: `[1, 3, 2]` (page `2` marked most recently used) \n\n• `4` ➔ Replaces `1` (least recently used) ➔ Frames: `[3, 2, 4]`.'
      ],
      complexity: [
        '**Time Complexity**: `O(1)` per reference if implemented with a **Doubly Linked List** and a **Hash Map**.',
        'Requires hardware support to track timestamps on every memory reference.'
      ],
      intuition: [
        'Why is true LRU rarely used? Because updating timestamps or moving linked list nodes on *every single memory reference* causes massive hardware speed bottlenecks. OS use approximations like the **Clock Algorithm**.'
      ]
    },
    {
      title: 'Second Chance',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: 'The **Second Chance** algorithm is a practical approximation of LRU that prevents active pages from being replaced.',
      explanation: [
        'Uses a **Reference Bit** for each page (set to `1` by hardware when accessed).',
        'Maintains pages in a FIFO queue.',
        'When replacing: if oldest page has ref bit `1`, clear it to `0`, put it at the tail (gives second chance), and inspect next page.'
      ],
      dryRun: [
        'Queue: `A(1) -> B(0) -> C(1)`. Need to replace page. \n\n• Inspect `A`: ref bit is 1. Clear to 0, move to tail ➔ Queue: `B(0) -> C(1) -> A(0)`. \n\n• Inspect `B`: ref bit is 0. Replace B.'
      ],
      complexity: [
        '**Time Complexity**: `O(N)` worst-case scan.',
        'Significantly reduces page fault rate compared to standard FIFO.'
      ],
      intuition: [
        'Second chance acts like a filter: it protects pages that were recently used (ref bit = 1) from being swept away by FIFO, giving them another pass through the queue.'
      ]
    },
    {
      title: 'Clock Algorithm',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: 'The **Clock Algorithm** is a highly efficient implementation of Second Chance using a circular buffer.',
      explanation: [
        'Pages are arranged in a circular list, and a **hand** points to the next page to inspect.',
        'On page fault: if hand points to page with ref bit `1`, set to `0`, advance hand. Repeat until ref bit is `0`, then replace that page.'
      ],
      dryRun: [
        'Circular list: `A(1)`, `B(1)`, `C(0)`. Hand points to `A`. \n\n• Hand checks `A`: set `A(0)`, hand moves to `B`. \n\n• Hand checks `B`: set `B(0)`, hand moves to `C`. \n\n• Hand checks `C`: ref bit is 0. Replace `C`, insert new page, advance hand.'
      ],
      complexity: [
        '**Time Complexity**: `O(1)` average case.',
        'Standard page replacement algorithm used in Unix/Linux kernels.'
      ],
      intuition: [
        'The Clock algorithm is fast because it doesn\'t move pages in a physical queue. It only changes bits and advances a pointer (the hand), making it very lightweight.'
      ]
    },
    {
      title: 'Belady\'s Anomaly',
      difficulty: 'Easy',
      type: 'theory',
      intro: '**Belady\'s Anomaly** is a phenomenon where increasing the number of physical frames results in a **higher** number of page faults for certain reference strings.',
      explanation: [
        'Violates the intuitive assumption: "more memory = fewer page faults".',
        'Occurs in FIFO page replacement.',
        'Does **not** occur in stack-based algorithms (LRU, OPT) because the set of pages in a smaller frame limit is always a subset of the pages in a larger frame limit.'
      ],
      intuition: [
        'An interviewer might ask: *"Does LRU suffer from Belady\'s Anomaly?"* **No!** Because LRU is a stack algorithm. Only non-stack algorithms like FIFO suffer from it.'
      ],
      takeaways: [
        'More frames = more page faults.',
        'Occurs in FIFO.',
        'Stack algorithms (LRU, OPT) are immune.'
      ]
    },
    {
      title: 'Numericals',
      difficulty: 'Hard',
      type: 'numerical',
      problem: 'Given the page reference string: `[7, 0, 1, 2, 0, 3, 0]` and **3 memory frames**, find the number of page faults using **LRU** replacement.',
      step1: 'Trace the first references: \n\n• `7` ➔ Fault ➔ Frames: `[7]` \n\n• `0` ➔ Fault ➔ Frames: `[7, 0]` \n\n• `1` ➔ Fault ➔ Frames: `[7, 0, 1]` (3 page faults so far).',
      step2: 'Trace next references: \n\n• `2` ➔ Fault. Replaces `7` (least recently used) ➔ Frames: `[2, 0, 1]`. \n\n• `0` ➔ Hit. Frames: `[2, 1, 0]` (update `0` to most recently used).',
      step3: 'Trace final references: \n\n• `3` ➔ Fault. Replaces `1` (least recently used) ➔ Frames: `[2, 0, 3]`. \n\n• `0` ➔ Hit. Frames: `[2, 3, 0]` (update `0` to most recently used).',
      answer: 'Total Page Faults = **5**',
      shortcut: 'Verification tip: Keep track of page access times. When replacing for `3` at step 3, check history backwards: `0` was used at t=5, `2` at t=4, `1` at t=3. Since `1` is the oldest, it must be replaced.'
    }
  ],
  'File Systems': [
    {
      title: 'File Concept',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'A **File** is an abstract logical storage unit mapped by the OS onto physical secondary storage devices.',
      explanation: [
        'Hides sector-level hardware complexities from applications.',
        'Attributes: Name, Identifier, Type, Location, Size, Protection, Timestamps.',
        'Operations: Create, Write, Read, Reposition (seek), Delete, Truncate.'
      ],
      intuition: [
        'To the OS, a file is just a stream of raw bytes. It is the application (like a text editor or image viewer) that interprets these bytes as formatted text or pixels.'
      ],
      takeaways: [
        'Logical abstraction of storage.',
        'OS maps files to physical sectors.',
        'Attributes tracked in directory structures.'
      ]
    },
    {
      title: 'Directory Structure',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'A **Directory** is a special file containing a list of file names, attributes, and physical addresses.',
      explanation: [
        '**Single-Level**: All files in one directory (naming conflicts, no grouping).',
        '**Two-Level**: Directory per user (isolated, but no folder hierarchies).',
        '**Tree-Structured**: Directory contains files and subdirectories (standard in modern OS).',
        '**Acyclic Graph**: Allows directories to share files/folders via links (symlinks).'
      ],
      intuition: [
        'Directory lookups must be fast. OS use Hash Tables or B-Trees to search directories instead of linear lists, preventing file search lag.'
      ],
      takeaways: [
        'Maps file names to metadata/addresses.',
        'Tree-structure is the modern standard.',
        'Acyclic graphs allow file sharing.'
      ]
    },
    {
      title: 'File Allocation Methods',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'File allocation defines how blocks of secondary storage are allocated to files.',
      explanation: [
        '**Contiguous**: File blocks are stored in a continuous line on disk. Fast read/write, but suffers from external fragmentation.',
        '**Linked**: Blocks are scattered; each block points to the next. No fragmentation, but slow random access (must traverse link chain).',
        '**Indexed**: An **Index Block** stores pointers to all file blocks. Fast random access and no fragmentation. Used in Unix/Linux inodes.'
      ],
      intuition: [
        'If asked: *"How does Unix implement file allocation?"* Answer: **Indexed Allocation**. It uses an **inode** containing direct block pointers and indirect pointers for large files.'
      ],
      takeaways: [
        'Contiguous: Fast, but fragmentation issues.',
        'Linked: No fragmentation, but slow random access.',
        'Indexed: Fast, no fragmentation (used in Linux inodes).'
      ]
    },
    {
      title: 'Free Space Management',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The OS must track all free disk blocks to allocate them efficiently when new files are created.',
      explanation: [
        '**Bit Vector (Bitmap)**: An array of bits where `1` represents free and `0` represents allocated. Fast search, but takes memory.',
        '**Linked List**: Free blocks are linked together. No memory overhead, but slow search.',
        '**Grouping**: First free block stores addresses of next $N$ free blocks.',
        '**Counting**: Tracks starting address of contiguous free blocks and count of free blocks.'
      ],
      intuition: [
        'Bitmap is preferred for modern SSDs because it allows processors to quickly find contiguous blocks of free space using specialized CPU bitwise search instructions.'
      ],
      takeaways: [
        'Bitmap: Fast, requires RAM storage.',
        'Linked List: Zero memory overhead, slow.',
        'Counting: Good for contiguous allocation.'
      ]
    },
    {
      title: 'File Protection',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'File protection regulates who can access files and what operations (Read, Write, Execute) they can perform.',
      explanation: [
        '**Access Control List (ACL)**: Lists user accounts and permissions for each file. Secure, but directory size increases.',
        '**Unix/Linux Owner/Group/Public Model**: Compact 9-bit mask representing permissions for Owner, Group, and Others (e.g., `rwxr-xr-x`).',
        'Enforced by OS kernel during file open system calls.'
      ],
      intuition: [
        'Linux `chmod 755 file` translates to binary `111 101 101`, giving read/write/execute to owner, and read/execute to group and others.'
      ],
      takeaways: [
        'Enforces security privileges.',
        'ACL vs Owner-Group-Other models.',
        'Controls Read (r), Write (w), and Execute (x).'
      ]
    }
  ],
  'Disk Scheduling': [
    {
      title: 'FCFS',
      difficulty: 'Easy',
      type: 'algorithm',
      intro: '**First-Come, First-Served (FCFS)** disk scheduling services sector read/write requests in the exact order they arrive.',
      explanation: [
        'Fair; no starvation.',
        'Highly inefficient: disk head swings back and forth across track cylinders.',
        'No optimization for head movement overhead.'
      ],
      dryRun: [
        'Queue: `[98, 183, 37, 122]` | Initial head = 53 \n\n• Head path: `53 ➔ 98 ➔ 183 ➔ 37 ➔ 122` \n\n• Head movement: `|98-53| + |183-98| + |37-183| + |122-37| = 45 + 85 + 146 + 85 = 361 cylinders`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N)` where `N` is request count.',
        'Prone to high average head movement times.'
      ],
      intuition: [
        'FCFS is only useful when the disk request load is very light. Under heavy loads, the disk head will thrash back and forth across the platters, degrading performance.'
      ]
    },
    {
      title: 'SSTF',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: '**Shortest Seek Time First (SSTF)** disk scheduling services the request closest to the current head position next.',
      explanation: [
        'Minimizes disk head seek time.',
        'Can cause **Starvation**: requests far away from the head may wait indefinitely if new, closer requests arrive.'
      ],
      dryRun: [
        'Queue: `[98, 183, 37, 122]` | Initial head = 53 \n\n• Closest to 53 is 37 (dist: 16). Head moves to 37. \n\n• Closest to 37 is 98 (dist: 61). Head moves to 98. \n\n• Closest to 98 is 122 (dist: 24). Head moves to 122. \n\n• Head moves to 183. Total movement = `16 + 61 + 24 + 61 = 162 cylinders`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N)` per request search.',
        '**Starvation**: Suffers from starvation for edge tracks.'
      ],
      intuition: [
        'SSTF is similar to Shortest Job First (SJF) scheduling: it is optimal for local execution but introduces starvation risk.'
      ]
    },
    {
      title: 'SCAN',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: 'The **SCAN** (or Elevator) algorithm moves the disk head in one direction servicing requests, then reverses direction on reaching the boundary.',
      explanation: [
        'Simulates an elevator: goes floor to floor in one direction, then reverses.',
        'Eliminates starvation.',
        '**Major Drawback**: Requests that just arrived behind the head must wait until it sweeps back.'
      ],
      dryRun: [
        'Queue: `[98, 183, 37, 122]` | Head = 53 (moving towards 0), cylinders = 0-199 \n\n• Head path: `53 ➔ 37 ➔ 0` (boundary) ➔ `98 ➔ 122 ➔ 183`. \n\n• Total movement = `(53 - 0) + (183 - 0) = 236 cylinders`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N log N)` (if sorting is required).',
        'Provides fair waiting times compared to SSTF.'
      ],
      intuition: [
        'Remember that SCAN **must touch the boundary** (0 or 199) even if there are no requests there, which wastes head movement cylinders.'
      ]
    },
    {
      title: 'C-SCAN',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: '**Circular SCAN (C-SCAN)** moves the disk head in one direction servicing requests, then wraps around to the beginning track without servicing requests on the return.',
      explanation: [
        'Provides a more uniform waiting time than SCAN.',
        'Disk head returns to the starting boundary instantly once it reaches the end cylinder.'
      ],
      dryRun: [
        'Queue: `[98, 183, 37, 122]` | Head = 53 (moving towards 199), cylinders = 0-199 \n\n• Path: `53 ➔ 98 ➔ 122 ➔ 183 ➔ 199` (boundary) ➔ `0` (wrap) ➔ `37`. \n\n• Total: `(199 - 53) + (199 - 0) [wrap overhead] + (37 - 0) = 146 + 199 + 37 = 382 cylinders`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N log N)`.',
        'Reduces waiting variance.'
      ],
      intuition: [
        'Why wrap without servicing? Because the tracks at the beginning have been waiting the longest. Servicing them immediately yields consistent latency.'
      ]
    },
    {
      title: 'LOOK',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: '**LOOK** is an optimization of SCAN that reverses head direction when there are no more requests ahead, without visiting the boundary.',
      explanation: [
        'Head "looks" ahead to see if there are more requests in the current direction.',
        'Saves seek cylinders by avoiding empty sweeps to boundary tracks `0` or `199`.'
      ],
      dryRun: [
        'Queue: `[98, 183, 37, 122]` | Head = 53 (moving towards 0) \n\n• Path: `53 ➔ 37` (reverses here because 37 is the smallest request) ➔ `98 ➔ 122 ➔ 183`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N log N)`.',
        'Highly efficient head utilization.'
      ],
      intuition: [
        'If asked: *"What is the difference between SCAN and LOOK?"* Answer: SCAN always goes to the boundary cylinder (`0` or `199`), whereas LOOK reverses immediately upon reaching the last request in that direction.'
      ]
    },
    {
      title: 'C-LOOK',
      difficulty: 'Medium',
      type: 'algorithm',
      intro: '**C-LOOK** is an optimization of C-SCAN that wraps around immediately upon reaching the last request, instead of traveling to the boundary.',
      explanation: [
        'Head travels only as far as the last request in the current direction, then wraps around to the lowest request.'
      ],
      dryRun: [
        'Queue: `[98, 183, 37, 122]` | Head = 53 (moving towards 199) \n\n• Path: `53 ➔ 98 ➔ 122 ➔ 183` (reverses) ➔ `37` (lowest request). \n\n• Total seek: `(183 - 53) + (183 - 37) [wrap] + (37 - 37) = 130 + 146 + 0 = 276 cylinders`.'
      ],
      complexity: [
        '**Time Complexity**: `O(N log N)`.',
        'Standard disk scheduling algorithm for rotational disks.'
      ],
      intuition: [
        'C-LOOK minimizes wasteful seek times because it skips boundary visits both on the forward sweep and the return wrap.'
      ]
    },
    {
      title: 'Numericals',
      difficulty: 'Hard',
      type: 'numerical',
      problem: 'Given the request queue: `[98, 183, 37, 122]` and **initial head position = 53**. Find the total seek time (in cylinders) using the **LOOK** algorithm (moving towards larger tracks first).',
      step1: 'Identify tracks and sorting sequence: \n\n• Initial head = 53. \n\n• Requests: `[37, 98, 122, 183]`. \n\n• Direction: towards larger tracks (right).',
      step2: 'Trace head movement to the right: \n\n• Head visits: `53 ➔ 98 ➔ 122 ➔ 183`. \n\n• Seek distance = `(183 - 53) = 130 cylinders`.',
      step3: 'Reverse direction to service the remaining left requests: \n\n• Head visits `37` (largest to smallest remaining). \n\n• Seek distance = `(183 - 37) = 146 cylinders`.',
      answer: 'Total head movement = `130 + 146 = 276 cylinders`',
      shortcut: 'Quick calculation tip: For LOOK (single direction sweep with reverse), the formula is `(Max_request - Initial_head) + (Max_request - Min_request)`. Here: `(183 - 53) + (183 - 37) = 130 + 146 = 276`.'
    }
  ],
  'IPC': [
    {
      title: 'Shared Memory',
      difficulty: 'Medium',
      type: 'syscall',
      intro: '**Shared Memory** is an IPC mechanism where a region of memory is mapped into the address spaces of multiple processes.',
      howItWorks: [
        'Processes read and write directly to the shared region.',
        'Fastest IPC mechanism (no system call overhead during data transfer).',
        '**Responsibility**: Processes must manually synchronize access (using Mutex/Semaphores) to prevent race conditions.'
      ],
      code: `// Writer process
int shmid = shmget((key_t)1234, 1024, 0666 | IPC_CREAT);
char *str = (char*)shmat(shmid, (void*)0, 0);
strcpy(str, "Hello from shared memory!");
shmdt(str);`,
      intuition: [
        'Why is Shared Memory faster than Message Passing? Because it maps memory directly. Message passing requires copying data from user space to kernel buffer, then back to target user space (2 system calls per message).'
      ],
      takeaways: [
        'Fastest IPC mechanism.',
        'Direct memory mapping.',
        'Requires manual mutual exclusion.'
      ]
    },
    {
      title: 'Message Passing',
      difficulty: 'Easy',
      type: 'theory',
      intro: '**Message Passing** is an IPC mechanism where processes communicate by sending and receiving messages via a kernel mailbox.',
      explanation: [
        'Enforced by OS system calls: `send(message)` and `receive(message)`.',
        'Good for exchanging smaller data amounts and distributed systems.',
        'No manual synchronization needed (OS handles queuing and locking).'
      ],
      intuition: [
        'Can be synchronous (blocking send/receive) or asynchronous (non-blocking). If synchronous, sender blocks until message is received, ensuring strict process synchronization.'
      ],
      takeaways: [
        'Safe communication (no shared state).',
        'OS manages synchronization.',
        'Incurs system call copy overhead.'
      ]
    },
    {
      title: 'Pipes',
      difficulty: 'Medium',
      type: 'syscall',
      intro: 'A **Pipe** is a unidirectional communication channel in Unix systems.',
      howItWorks: [
        'Operates as a FIFO queue with two file descriptors: `fd[0]` (read end) and `fd[1]` (write end).',
        '**Ordinary (Anonymous) Pipes**: Restricted to parent-child communication. Destroyed on process termination.',
        '**Named Pipes (FIFOs)**: Appear as files in filesystem; can be used by unrelated processes.'
      ],
      code: `int fd[2];
pipe(fd); // creates pipe
if (fork() == 0) {
    close(fd[0]); // child closes read
    write(fd[1], "Hi", 2);
} else {
    close(fd[1]); // parent closes write
    char buf[10];
    read(fd[0], buf, 10);
}`,
      intuition: [
        'Pipes are half-duplex (data flows in one direction). For bidirectional communication, you must instantiate **two pipes**.'
      ],
      takeaways: [
        'Unidirectional communication channel.',
        'Anonymous (related processes) vs Named (unrelated).',
        'Uses standard file descriptors.'
      ]
    },
    {
      title: 'Message Queues',
      difficulty: 'Medium',
      type: 'syscall',
      intro: 'A **Message Queue** is a kernel-linked list of messages that allows asynchronous communication.',
      howItWorks: [
        'Messages are retrieved by type, not just FIFO order.',
        'Persistent in kernel until deleted or system reboot.',
        'Uses system calls: `msgget` (create/get), `msgsnd` (send), and `msgrcv` (receive).'
      ],
      code: `struct msg_buffer {
    long msg_type;
    char msg_text[100];
} message;
int msqid = msgget((key_t)5678, 0666 | IPC_CREAT);
message.msg_type = 1;
strcpy(message.msg_text, "Queue Message");
msgsnd(msqid, &message, sizeof(message), 0);`,
      intuition: [
        'Unlike pipes which read stream bytes, message queues preserve **message boundaries**. A receiver reads a complete, structured message block.'
      ],
      takeaways: [
        'Message boundaries preserved.',
        'Asynchronous, typed communication.',
        'Persistent in OS memory.'
      ]
    },
    {
      title: 'Signals',
      difficulty: 'Medium',
      type: 'syscall',
      intro: 'A **Signal** is a software interrupt sent by the OS kernel to notify a process of an event.',
      howItWorks: [
        'Process can handle signals by: Catching (custom handler), Ignoring, or Default OS action.',
        'Common signals: `SIGINT` (Ctrl+C), `SIGKILL` (force terminate), `SIGSEGV` (invalid memory).',
        'Sent using the `kill(pid, signal)` system call.'
      ],
      code: `#include <signal.h>
void handle_sigint(int sig) {
    printf("Caught signal %d\\n", sig);
}
int main() {
    signal(SIGINT, handle_sigint); // register handler
    while(1);
}`,
      intuition: [
        'Can all signals be caught? **No!** `SIGKILL` (PID kill) and `SIGSTOP` (pause) cannot be caught, blocked, or ignored. They guarantee OS process control.'
      ],
      takeaways: [
        'Software interrupt notification.',
        'Custom handler overrides.',
        'SIGKILL and SIGSTOP cannot be blocked.'
      ]
    },
    {
      title: 'Sockets',
      difficulty: 'Hard',
      type: 'syscall',
      intro: 'A **Socket** is a bidirectional endpoint for communication over a network or local loopback.',
      howItWorks: [
        'Allows communication between processes running on different machines.',
        'Identified by IP address and Port number.',
        'Uses connection-oriented TCP (`SOCK_STREAM`) or connectionless UDP (`SOCK_DGRAM`).'
      ],
      code: `int client_fd = socket(AF_INET, SOCK_STREAM, 0);
struct sockaddr_in serv_addr;
serv_addr.sin_family = AF_INET;
serv_addr.sin_port = htons(8080);
inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr);
connect(client_fd, (struct sockaddr*)&serv_addr, sizeof(serv_addr));`,
      intuition: [
        'Sockets are the foundation of all client-server architecture (HTTP, FTP, database connections).'
      ],
      takeaways: [
        'Network-based communication.',
        'Endpoint pair: IP address + Port.',
        'Supports TCP and UDP.'
      ]
    }
  ],
  'Linux for Interviews': [
    {
      title: 'fork()',
      difficulty: 'Medium',
      type: 'syscall',
      intro: 'The `fork()` system call creates a child process by copying the parent.',
      howItWorks: [
        'Duplicates parent\'s stack, heap, files, and registers.',
        'Enforces Copy-on-Write (COW) optimization.',
        'Both processes run concurrently starting at the instruction right after `fork()`.'
      ],
      code: `#include <stdio.h>
#include <unistd.h>
int main() {
    pid_t pid = fork();
    if (pid == 0) {
        printf("Child process\\n");
    } else if (pid > 0) {
        printf("Parent process\\n");
    }
    return 0;
}`,
      intuition: [
        '**Fork Returns Twice**: It returns `0` inside the child process, and returns the child\'s `PID` inside the parent process.'
      ],
      takeaways: [
        'Creates child process.',
        'Returns 0 to child; child\'s PID to parent.',
        'Independent memory space.'
      ]
    },
    {
      title: 'exec()',
      difficulty: 'Medium',
      type: 'syscall',
      intro: 'The `exec()` family of system calls replaces the current process memory image with a new program.',
      howItWorks: [
        'Discards current stack, heap, and code segment.',
        'Loads the new executable program file into memory.',
        'Does not create a new process; PID remains unchanged.'
      ],
      code: `#include <unistd.h>
int main() {
    char *args[] = {"/bin/ls", "-lh", NULL};
    execvp(args[0], args); // Replaces process with ls command
    printf("This will never print unless exec fails!");
    return 0;
}`,
      intuition: [
        'Why does code after `exec()` not run? Because the entire process binary image is wiped and replaced by the new executable. The original program ceases to exist.'
      ],
      takeaways: [
        'Replaces current process image.',
        'No PID change.',
        'Code after successful exec is unreachable.'
      ]
    },
    {
      title: 'wait()',
      difficulty: 'Medium',
      type: 'syscall',
      intro: 'The `wait()` system call blocks the calling parent process until one of its child processes terminates.',
      howItWorks: [
        'Enables parents to retrieve child exit codes.',
        'Cleans up terminated child process entries, preventing zombie accumulation.'
      ],
      code: `#include <sys/wait.h>
#include <unistd.h>
int main() {
    if (fork() == 0) {
        sleep(2); // child sleeps
    } else {
        int status;
        wait(&status); // parent blocks until child exits
        printf("Child finished execution");
    }
    return 0;
}`,
      intuition: [
        'If a process has no children, `wait()` returns `-1` immediately. If a child is already a zombie, `wait()` reaps it and returns immediately without blocking.'
      ],
      takeaways: [
        'Blocks parent until child exits.',
        'Reaps child processes (destroys zombies).',
        'Returns terminated child PID.'
      ]
    },
    {
      title: 'pipe()',
      difficulty: 'Medium',
      type: 'syscall',
      intro: 'The `pipe()` system call instantiates a unidirectional data channel in the kernel.',
      howItWorks: [
        'Takes an array of two integers: `fd[0]` (read endpoint) and `fd[1]` (write endpoint).',
        'Data written to `fd[1]` is queued in kernel buffer and read from `fd[0]`.'
      ],
      code: `#include <unistd.h>
int main() {
    int fd[2];
    pipe(fd);
    write(fd[1], "data", 4);
    char buf[5];
    read(fd[0], buf, 4);
    return 0;
}`,
      intuition: [
        'Standard shell redirection like `ls | grep txt` works by having the shell create a pipe, fork two processes, map `ls` standard output (`stdout`) to `fd[1]`, and map `grep` standard input (`stdin`) to `fd[0]` using `dup2()`.'
      ],
      takeaways: [
        'Creates unidirectional channel.',
        'fd[0] is read end | fd[1] is write end.',
        'Used for shell pipeline redirection.'
      ]
    },
    {
      title: 'Signals',
      difficulty: 'Medium',
      type: 'syscall',
      intro: 'Linux processes use signals to communicate asynchronous control events.',
      howItWorks: [
        'Sent by terminal shortcuts (Ctrl+C sends `SIGINT`), CPU traps (`SIGSEGV`), or user code (`kill`).',
        'Handled by custom signal handlers.'
      ],
      code: `#include <signal.h>
#include <unistd.h>
void handler(int sig) {
    write(1, "Handled!\\n", 9);
}
int main() {
    struct sigaction sa;
    sa.sa_handler = handler;
    sigaction(SIGINT, &sa, NULL); // Catch Ctrl+C
    while(1) sleep(1);
}`,
      intuition: [
        'Interview question: *"Can you ignore SIGKILL?"* **No**. `SIGKILL` and `SIGSTOP` bypass handler interception to ensure administrative control.'
      ],
      takeaways: [
        'Asynchronous notifications.',
        'Can be ignored, caught, or defaulted.',
        'SIGKILL bypasses code interception.'
      ]
    },
    {
      title: 'Basic Linux Commands',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'These are the standard Linux commands for system diagnostics and process management.',
      explanation: [
        '`ps`: Displays snapshot of current running processes.',
        '`top` / `htop`: Real-time system monitor showing CPU/RAM/process usage.',
        '`kill <PID>`: Sends `SIGTERM` signal to process. Use `kill -9 <PID>` to send unignorable `SIGKILL`.',
        '`lsof`: Lists all open files and active network ports.',
        '`free -m`: Displays available and used physical RAM and swap space.'
      ],
      intuition: [
        'Knowing these commands is essential for backend engineering and system administration interviews.'
      ],
      takeaways: [
        'ps: List processes.',
        'top: Interactive usage stats.',
        'kill -9: Unignorable termination.'
      ]
    }
  ],
  'Most Asked Interview Questions': [
    {
      title: 'Process vs Thread',
      difficulty: 'Easy',
      type: 'comparison',
      intro: 'This is the most common OS interview question. It checks if you understand memory isolation and execution overhead.',
      conceptA: 'Process',
      conceptA_bullets: [
        'Private virtual address space.',
        'No direct sharing (isolated).',
        'Context switches are heavy (restores page tables, CPU state).'
      ],
      conceptB: 'Thread',
      conceptB_bullets: [
        'Shares parent process\'s address space.',
        'Shares static variable data and open files.',
        'Context switches are very fast (swaps only registers and stack pointer).'
      ],
      comparisonTable: [
        '**Address Space**: Private isolated virtual space ➔ Shared parent process space',
        '**Context Switch**: Heavy context swap (virtual map change) ➔ Fast thread swap (registers only)',
        '**Communication**: Heavyweight IPC required ➔ Fast shared variables and pointers'
      ],
      intuition: [
        'Always summarize: *"A process is an allocating unit of resources, whereas a thread is a scheduling unit of execution."*'
      ]
    },
    {
      title: 'Mutex vs Semaphore',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'This comparison tests your understanding of mutual exclusion vs counting signals.',
      conceptA: 'Mutex',
      conceptA_bullets: [
        'A locking mechanism.',
        'Binary state (Locked/Unlocked).',
        'Strict ownership: Lock-holder must release the lock.'
      ],
      conceptB: 'Semaphore',
      conceptB_bullets: [
        'A signaling mechanism.',
        'Integer value (can track N resources).',
        'No ownership: Any thread can signal (increment) it.'
      ],
      comparisonTable: [
        '**Mechanism**: Locking mechanism (resource locking) ➔ Signaling mechanism (resource counts)',
        '**Ownership**: Has a strict owner thread ➔ No ownership constraints',
        '**Concurrency**: Only 1 thread in critical section ➔ Up to N threads concurrently'
      ],
      intuition: [
        'Use the toilet key analogy: Mutex = single key to restroom stall. Semaphore = key-rack containing N keys for N identical stalls.'
      ]
    },
    {
      title: 'Paging vs Segmentation',
      difficulty: 'Medium',
      type: 'comparison',
      intro: 'This comparison tests your knowledge of fixed division vs logical division memory designs.',
      conceptA: 'Paging',
      conceptA_bullets: [
        'Fixed-size blocks (Pages/Frames).',
        'Eliminates external fragmentation.',
        'Invisible to programmer.'
      ],
      conceptB: 'Segmentation',
      conceptB_bullets: [
        'Variable-sized logical segments.',
        'Saves blocks according to programmer\'s logical view.',
        'Enforces logical security (e.g. read-only code segments).'
      ],
      comparisonTable: [
        '**Block Size**: Fixed-size divisions ➔ Variable-size logical segments',
        '**Fragmentation**: Internal fragmentation risk ➔ External fragmentation risk',
        '**Logical Scheme**: 1D linear memory addresses ➔ 2D structural segments'
      ],
      intuition: [
        'Modern OS combine both into **Paged Segmentation** (logical segments subdivided into pages) to get best properties of both.'
      ]
    },
    {
      title: 'Internal vs External Fragmentation',
      difficulty: 'Easy',
      type: 'comparison',
      intro: 'This question tests if you understand why memory is wasted under different allocation designs.',
      conceptA: 'Internal Fragmentation',
      conceptA_bullets: [
        'Occurs when allocated memory block is larger than requested.',
        'Wasted space resides **inside** the process\'s allocated memory block.',
        'Caused by fixed partition limits.'
      ],
      conceptB: 'External Fragmentation',
      conceptB_bullets: [
        'Occurs when total free memory fits request, but is split into tiny non-contiguous blocks.',
        'Wasted space resides **between** allocated memory blocks.',
        'Caused by variable partition allocation.'
      ],
      comparisonTable: [
        '**Wasted space location**: Inside allocated block ➔ Outside allocated blocks (between holes)',
        '**Resolution**: Decrease fixed frame/block size ➔ Perform compaction or use Paging',
        '**Allocation Cause**: Fixed-partition allocation ➔ Dynamic variable partition sizing'
      ],
      intuition: [
        'Paging solves external fragmentation because it allows physical frames to be non-contiguous, meaning any page fits anywhere.'
      ]
    },
    {
      title: 'Zombie vs Orphan',
      difficulty: 'Easy',
      type: 'comparison',
      intro: 'This tests process termination hierarchy and reaping dynamics.',
      conceptA: 'Zombie Process',
      conceptA_bullets: [
        'Child process has terminated but parent has not called `wait()`.',
        'Occupies PID slot in the Process Table.',
        'Cannot be killed because it is already dead.'
      ],
      conceptB: 'Orphan Process',
      conceptB_bullets: [
        'Parent process has exited/crashed while child is still running.',
        'Adopted by `init` process (PID 1).',
        'Runs normally in background; reaped automatically on exit.'
      ],
      comparisonTable: [
        '**Process State**: Terminated (already dead) ➔ Active execution (alive)',
        '**Resource leaked**: PID slot in process table ➔ Consumes active CPU/memory resources',
        '**Guardian / Reaping**: Parent must call `wait()` ➔ Root `init` process (PID 1) reaps it'
      ],
      intuition: [
        'A zombie process is a dead process waiting for its funeral. An orphan is an active child whose parent passed away, now adopted by the system guardian (PID 1).'
      ]
    },
    {
      title: 'Deadlock vs Starvation',
      difficulty: 'Easy',
      type: 'comparison',
      intro: 'This question tests if you understand system blocking vs scheduling bias.',
      conceptA: 'Deadlock',
      conceptA_bullets: [
        'Two or more processes are blocked waiting for resources held by each other.',
        'Execution is completely frozen.',
        'Requires OS intervention to resolve.'
      ],
      conceptB: 'Starvation',
      conceptB_bullets: [
        'A process is ready to run but is continuously ignored by the CPU scheduler.',
        'Execution could continue if CPU was allocated.',
        'Resolved by the **Aging** mechanism.'
      ],
      comparisonTable: [
        '**Process State**: Blocked/Waiting (cannot run) ➔ Ready to Run (executable)',
        '**System execution**: Entire deadlock loop is frozen ➔ Other high-priority tasks executing',
        '**Recovery**: Process termination or rollback ➔ Aging priority scheduling'
      ],
      intuition: [
        'In Deadlock, processes are stuck in a mutual lock loop. In Starvation, the process is ready to run but is repeatedly cut in line by higher priority processes.'
      ]
    },
    {
      title: 'Virtual Memory',
      difficulty: 'Easy',
      type: 'theory',
      intro: 'Virtual Memory abstracts physical RAM limits by utilizing disk storage.',
      explanation: [
        'Separates logical programmer view of memory from actual physical RAM frames.',
        'Allows programs to execute even if they exceed physical RAM size.',
        'Implemented using **Demand Paging**.'
      ],
      intuition: [
        'Virtual memory improves multiprogramming by letting the OS load only the active code pages of multiple applications simultaneously, swapping out inactive ones.'
      ],
      takeaways: [
        'Bypasses physical RAM size constraints.',
        'Enables execution of partially loaded processes.',
        'Uses demand paging.'
      ]
    },
    {
      title: 'TLB',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'The Translation Lookaside Buffer (TLB) is a fast memory cache for page translations.',
      explanation: [
        'CPU checks TLB first for virtual-to-physical address mapping.',
        'If hit, address is resolved instantly. If miss, page table in RAM is accessed.',
        'Hit rate is typically >95% due to program temporal locality.'
      ],
      intuition: [
        'Without TLB, virtual memory would be twice as slow because every variable load would require 2 RAM operations (Page Table access + Data access).'
      ],
      takeaways: [
        'Associative MMU hardware cache.',
        'Resolves address translations in parallel.',
        'Reduces memory access overhead.'
      ]
    },
    {
      title: 'Context Switching',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Context switching swaps the execution state of processes on the CPU.',
      explanation: [
        'Saves current process state to its PCB, and loads next process state from its PCB.',
        'Pure system overhead (no user computations are performed during switch).',
        'Triggered by timer interrupts, system calls, or I/O waits.'
      ],
      intuition: [
        'OS designers keep context switches to a minimum. Swapping page tables and flushing CPU caches degrades processor pipelines.'
      ],
      takeaways: [
        'Multitasking mechanism.',
        'Pure OS overhead.',
        'Saves/restores process states via PCB.'
      ]
    },
    {
      title: 'Copy on Write',
      difficulty: 'Medium',
      type: 'theory',
      intro: 'Copy on Write (COW) optimizes process creation by sharing parent physical pages.',
      explanation: [
        'Parent and child share read-only memory pages initially on `fork()`.',
        'If either writes, a page fault copies that page, mapping it to the modifying process.',
        'Avoids copying the parent address space when child calls `exec()` immediately.'
      ],
      intuition: [
        'COW makes `fork()` call almost instantaneous because only pointers are duplicated, delaying resource allocation until writes occur.'
      ],
      takeaways: [
        'Parent-child memory share.',
        'Duplicates pages only on modification.',
        'Optimizes fork-exec pipelines.'
      ]
    }
  ]
};

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

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
  console.log(`👤 Using Admin User: ${admin.name || admin.email} | ID: ${adminId}`);

  // 2. Fetch all child subfolders under the OS parent
  const subfolders = await db.collection('folders').find({ parentFolderId: OS_PARENT_ID }).toArray();
  if (subfolders.length === 0) {
    console.error('❌ No child subfolders found under OS parent folder. Run seedOSFolders.js first!');
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`📂 Found ${subfolders.length} subfolders in database.`);

  const folderMap = new Map();
  for (const f of subfolders) {
    folderMap.set(f.title, f._id);
  }

  // 3. Upsert instead of delete & insert to avoid creating tombstones or losing user progress/history
  let totalCardsSeeded = 0;
  
  console.log('\n--- Seeding 108 Polished OS Revision Cards (Upsert Mode) ---');

  for (const [folderTitle, cards] of Object.entries(OS_CARDS_DATA)) {
    const folderId = folderMap.get(folderTitle);
    if (!folderId) {
      console.warn(`⚠️ Warning: Subfolder "${folderTitle}" not found in database. Skipping these cards.`);
      continue;
    }

    console.log(`\n📁 Seeding/Updating ${cards.length} cards under "${folderTitle}"...`);
    const cardIdsForFolder = [];

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const cardId = generateDeterministicUUID(`card-${c.title}|${folderTitle}`);

      // Compile slides programmatically based on template definitions
      const compiledSlides = compileSlides(c);
      const formattedSlides = compiledSlides.map((s, idx) => ({
        type: s.type,
        headline: s.headline,
        body: s.body,
        code: s.code,
        blocks: s.blocks || [],
        slideIndex: idx,
        totalSlides: compiledSlides.length
      }));

      await db.collection('revisioncards').updateOne(
        { _id: cardId },
        {
          $set: {
            title: c.title,
            topic: 'Operating Systems',
            explanation: c.intro || c.problem || '',
            code: c.code || '',
            image: '',
            tags: ['Operating Systems', folderTitle, 'Placements'],
            difficulty: c.difficulty,
            complexity: '',
            examples: c.examples || [],
            folderId: folderId,
            createdBy: adminId,
            visibility: 'public',
            order: i,
            slides: formattedSlides,
            isDeleted: false,
            rootFolderId: OS_PARENT_ID,
            rootFolderName: 'Operating Systems',
            subfolderPath: `/Operating Systems/${folderTitle}`,
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
  console.log(`\n🎉 DONE! Seeded a total of ${totalCardsSeeded} cards.`);
}

run().catch(console.error);
