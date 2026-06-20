module.exports = [
  // === 1. Python ===
  {
    title: 'Lists',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Dynamic arrays that are mutable, ordered, and allow duplicate elements.',
      'Shorthand: Use brackets `[]` or the `list()` constructor to initialize.',
      'Student Shorthand: Elements are stored as references in contiguous memory locations, making index lookups extremely fast.'
    ],
    code: `# List initialization and manipulation\nmy_list = [10, 20, 30]\nmy_list.append(40) # O(1) amortized\nmy_list.insert(1, 15) # O(N) shift\npopped_val = my_list.pop() # O(1) end removal`,
    bullets3: [
      'Line 1-2: Creates a list with elements. Memory allocates capacity for expansion.',
      'Line 3: Appending to the end is O(1) unless array doubling is triggered.',
      'Line 4: Inserting at index 1 forces elements to shift right, resulting in O(N) time.',
      'Line 5: Popping the last element is extremely fast, O(1).'
    ],
    bullets4: [
      'Time Complexity: Lookup by index: O(1) | Append: O(1) amortized | Insert/Delete: O(N) | Search: O(N).',
      'Space Complexity: O(N) where N is the number of elements stored.'
    ],
    bullets5: [
      'Common Interview Question: Modifying a list while iterating over it leads to skipped elements or index errors. Use a slice copy `my_list[:]` instead.',
      'Common Interview Question: Lists are mutable. Passing a list as a default parameter `def func(x=[])` binds a single shared list across all function calls.'
    ]
  },
  {
    title: 'Tuples',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Ordered, immutable sequences of elements.',
      'Shorthand: Initialized using parentheses `()` or comma-separated values.',
      'Student Shorthand: Since they are immutable, they can be hashed and used as dictionary keys (if they contain only hashable elements).'
    ],
    code: `# Tuple definitions and behavior\nmy_tuple = (10, 20, 30)\n# my_tuple[0] = 50 -> Raises TypeError\nhashable_tuple = (1, [2, 3]) # Tuple itself is immutable, but contains a mutable list\n# hash(hashable_tuple) -> Raises TypeError because of the list`,
    bullets3: [
      'Line 2: Tuple is immutable, so indexing updates raise a TypeError.',
      'Line 3-4: A tuple is only hashable if all internal elements are hashable. Nested lists break hashability.'
    ],
    bullets4: [
      'Time Complexity: Lookup by index: O(1) | Creation: faster than lists due to fixed memory allocation.',
      'Space Complexity: O(N) but uses less memory overhead than lists since no extra buffer capacity is reserved.'
    ],
    bullets5: [
      'Common Interview Question: Single element tuples must include a trailing comma, e.g. `x = (5,)`. Without it, `x = (5)` is parsed as a regular integer.',
      'Common Interview Question: Immutability prevents appending, but concatenation `t1 + t2` creates an entirely new tuple object (O(N) copy).'
    ]
  },
  {
    title: 'Dictionaries',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Key-value stores backed by a hash table.',
      'Shorthand: Initialized using curly braces `{}` with `key: value` pairs.',
      'Student Shorthand: Keys must be hashable (immutable objects like strings, numbers, or tuples of hashable items).'
    ],
    code: `# Dictionary lookup and updates\nmy_dict = {"a": 1, "b": 2}\nval = my_dict.get("c", 0) # O(1) lookup with default value\nmy_dict["d"] = 4 # O(1) insert\n# my_dict[[1, 2]] = 3 -> Raises TypeError because lists are unhashable`,
    bullets3: [
      'Line 2: The `.get()` method prevents key errors by returning a default value (0) if the key is missing.',
      'Line 3: Inserts key "d" into the hash table at O(1) average time.',
      'Line 4: Lists cannot be used as dictionary keys because they are mutable.'
    ],
    bullets4: [
      'Time Complexity: Insert/Delete/Lookup: O(1) average, O(N) in worst-case hash collisions.',
      'Space Complexity: O(N) where N is the number of key-value pairs.'
    ],
    bullets5: [
      'Common Interview Question: Python dictionaries preserve insertion order (since Python 3.7). Prior versions did not.',
      'Common Interview Question: Iterating over key views while modifying dictionary size raises a RuntimeError.'
    ]
  },
  {
    title: 'Sets',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Unordered collections of unique, hashable elements.',
      'Shorthand: Initialized using curly braces `{}` or `set()` constructor.',
      'Student Shorthand: Backed by a hash table containing only keys. Ideal for deduplication and membership checks.'
    ],
    code: `# Set operations\nset_a = {1, 2, 3}\nset_b = {3, 4, 5}\nunion_set = set_a | set_b # {1, 2, 3, 4, 5}\nintersect_set = set_a & set_b # {3}\nis_member = 3 in set_a # O(1) lookup`,
    bullets3: [
      'Line 3: Set union combines unique values.',
      'Line 4: Set intersection finds common elements.',
      'Line 5: Set lookups (`in` operator) are average O(1) since they bypass linear scans.'
    ],
    bullets4: [
      'Time Complexity: Add/Remove/Lookup: O(1) average. Intersection: O(min(len(A), len(B))).',
      'Space Complexity: O(N) where N is the number of elements in the set.'
    ],
    bullets5: [
      'Common Interview Question: `{}` creates an empty dictionary, not an empty set. Use `set()` to initialize an empty set.',
      'Common Interview Question: Set elements must be hashable. You cannot nest sets or lists inside sets. Use `frozenset` if you need a set of sets.'
    ]
  },
  {
    title: 'List Comprehension',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: A concise syntax to construct lists based on existing iterables.',
      'Format: `[expression for item in iterable if condition]`.',
      'Student Shorthand: Highly optimized in CPython, executing faster than manual `for` loops by bypassing method lookups (`list.append`).'
    ],
    code: `# List comprehension with conditional filter\nnumbers = [1, 2, 3, 4, 5, 6]\nevens_squared = [x**2 for x in numbers if x % 2 == 0]\n# Output: [4, 16, 36]`,
    bullets3: [
      'Line 2: Loops through elements in `numbers`, applies the filter `if x % 2 == 0`, and squares the qualifying elements `x**2` in a single pass.'
    ],
    bullets4: [
      'Time Complexity: O(N) where N is the size of the input iterable.',
      'Space Complexity: O(M) where M is the number of elements that pass the filter.'
    ],
    bullets5: [
      'Common Interview Question: Avoid nesting more than two list comprehensions. It ruins readability and makes debugging difficult.',
      'Common Interview Question: If you use `if-else` within list comprehensions, place it before the loop: `[x if x % 2 == 0 else 0 for x in numbers]`.'
    ]
  },
  {
    title: 'Functions',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Reusable blocks of code defined using the `def` keyword.',
      'Pass-by-assignment: Python passes arguments by assignment (object reference). Modifying a mutable object inside a function affects the caller.',
      'Student Shorthand: Arguments are evaluated when the function is defined, not when it is executed.'
    ],
    code: `# Pass-by-assignment behavior\ndef modify_inputs(val, lst):\n    val = 100 # Local bind, caller variable unchanged\n    lst.append(4) # In-place update, caller list modified\n\nv = 5; l = [1, 2, 3]\nmodify_inputs(v, l) # v remains 5, l becomes [1, 2, 3, 4]`,
    bullets3: [
      'Line 3: Rebinding variable `val` inside the function creates a local variable reference.',
      'Line 4: Calling a mutator method on `lst` updates the original object in memory.'
    ],
    bullets4: [
      'Time Complexity: Function call overhead is small but non-zero due to frame allocation.',
      'Space Complexity: Allocates memory on the call stack for local frames.'
    ],
    bullets5: [
      'Common Interview Question: Never use mutable defaults `def my_func(a=[])`. The default list is instantiated once at function compile time and shared across all calls.',
      'Common Interview Question: Modifying global variables inside a function requires the `global` keyword, but this is a code smell. Use arguments and return values instead.'
    ]
  },
  {
    title: 'Lambda Functions',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Anonymous, inline functions containing a single expression.',
      'Format: `lambda arguments: expression`.',
      'Student Shorthand: Useful for throwaway logic passed as arguments (e.g. sorting keys, map/filter operations).'
    ],
    code: `# Sorting dictionary by value using lambda\ndata = [{"name": "A", "score": 90}, {"name": "B", "score": 85}]\ndata.sort(key=lambda x: x["score"])\n# Sorted output: [{"name": "B", "score": 85}, {"name": "A", "score": 90}]`,
    bullets3: [
      'Line 3: Passes a lambda function to extracting `x["score"]` as the sorting key. The sort executes in-place.'
    ],
    bullets4: [
      'Time Complexity: Sorting takes O(N log N) using Timsort.',
      'Space Complexity: O(1) auxiliary space.'
    ],
    bullets5: [
      'Common Interview Question: Lambda functions cannot contain statements (e.g. `assert`, `pass`, `return`, `for`). Only expressions are allowed.',
      'Common Interview Question: PEP 8 discourages binding lambdas to names (e.g. `f = lambda x: x*2`). Use standard `def` declarations for named functions.'
    ]
  },
  {
    title: 'Decorators',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Design pattern that modifies the behavior of a function without changing its source code.',
      'First-Class Functions: Python functions are objects; they can be passed as arguments, returned, and nested.',
      'Student Shorthand: A decorator wraps a target function, intercepting inputs and outputs (e.g. for logging or execution timing).'
    ],
    code: `# Decorator to time function execution\nimport time\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        print(f"Elapsed: {time.perf_counter() - start:.4f}s")\n        return result\n    return wrapper`,
    bullets3: [
      'Line 3: The decorator function takes the target function `func` as an argument.',
      'Line 4: Outer wrapper captures arguments using `*args` and `**kwargs`.',
      'Line 6: Executes the actual function, captures output, and returns it after printing elapsed time.'
    ],
    bullets4: [
      'Time Complexity: Negligible overhead besides target function execution.',
      'Space Complexity: Creates call stack frames for the wrapper function.'
    ],
    bullets5: [
      'Common Interview Question: Decorable wrappers replace the target function\'s metadata (e.g. name, docstrings). Fix this by importing `functools.wraps` and applying `@wraps(func)` to the wrapper.',
      'Common Interview Question: Order matters. Multiple decorators are stacked bottom-up (innermost to outermost).'
    ]
  },
  {
    title: 'Generators',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Functions that return an iterator using the `yield` keyword instead of `return`.',
      'State Retention: Execution pauses at `yield` and resumes on next call, preserving local variable states.',
      'Student Shorthand: Provides lazy evaluation. Elements are computed on-demand, making it ideal for streaming massive files.'
    ],
    code: `# Generator for streaming data\ndef read_large_file(file_path):\n    with open(file_path, "r") as f:\n        for line in f:\n            yield line.strip()\n\n# Usage preserves memory\nfor line in read_large_file("huge.txt"):\n    process(line)`,
    bullets3: [
      'Line 4: Yields a single line of text and pauses, releasing control back to the loop without loading the rest of the file into memory.'
    ],
    bullets4: [
      'Time Complexity: Next element retrieval: O(1).',
      'Space Complexity: O(1) auxiliary memory, as opposed to O(N) for reading the entire file into a list.'
    ],
    bullets5: [
      'Common Interview Question: Generator iterators can only be traversed once. Once exhausted, they raise `StopIteration` and cannot be reset.',
      'Common Interview Question: You cannot use list indexes or slicing operations on generators directly. Use `itertools.islice` if indexing is required.'
    ]
  },
  {
    title: 'Iterators',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Objects representing a stream of data that implement the iterator protocol.',
      'Iterator Protocol: Must implement `__iter__()` (returns self) and `__next__()` (returns next item or raises `StopIteration`).',
      'Iterable vs Iterator: An iterable (e.g. list, dict) returns an iterator when passed to `iter()`.'
    ],
    code: `# Manual Iterator implementation\nclass Counter:\n    def __init__(self, limit):\n        self.limit = limit; self.current = 0\n    def __iter__(self): return self\n    def __next__(self):\n        if self.current < self.limit:\n            self.current += 1; return self.current\n        raise StopIteration`,
    bullets3: [
      'Line 4: Returns `self` so the iterator can be used in standard loops.',
      'Line 5-8: Computes and returns the next value, raising `StopIteration` when the limit is reached.'
    ],
    bullets4: [
      'Time Complexity: Next element retrieval: O(1).',
      'Space Complexity: O(1) state tracker.'
    ],
    bullets5: [
      'Common Interview Question: Iterating over an iterator directly in a nested loop fails on the second iteration since the iterator is already exhausted.',
      'Common Interview Question: Iterators are lazy evaluators. Do not verify length with `len()` as they do not support length checking.'
    ]
  },
  {
    title: 'OOP Basics',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Object-Oriented Programming structured around classes and objects.',
      'Core Pillars: Encapsulation (hiding state), Inheritance (parent/child classes), Polymorphism (shared interfaces).',
      'Self keyword: Represents the specific instance of the class currently being modified.'
    ],
    code: `# Class inheritance and polymorphism\nclass Model:\n    def predict(self): raise NotImplementedError()\nclass Regressor(Model):\n    def __init__(self, weight):\n        self.weight = weight\n    def predict(self, x):\n        return x * self.weight`,
    bullets3: [
      'Line 2: Base class defines abstract interface pattern.',
      'Line 5: `__init__` constructor sets initial instance states.',
      'Line 6: Polymorphic implementation of the `predict` method.'
    ],
    bullets4: [
      'Time Complexity: Method invocation: O(1) lookup in class MRO (Method Resolution Order).',
      'Space Complexity: O(1) class reference memory.'
    ],
    bullets5: [
      'Common Interview Question: Class variables (defined in class scope) are shared by all instances. Instance variables (defined in `__init__`) are separate. Watch out for shared list mutations in class scope.',
      'Common Interview Question: Python supports multiple inheritance. It resolves method name conflicts using C3 Linearization to build the `__mro__` lookup order.'
    ]
  },
  {
    title: 'Exception Handling',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '00defa66-9528-51d8-9138-874f33246159',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Restructuring execution flow to intercept runtime errors.',
      'Format: `try`, `except`, `else`, `finally` blocks.',
      'Student Shorthand: The `finally` block executes under all conditions (even if exceptions are raised or values are returned).'
    ],
    code: `# Exception handling with resource cleanup\ndef get_ratio(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return 0\n    finally:\n        print("Operation attempted") # Runs no matter what`,
    bullets3: [
      'Line 3: Runs the target operation.',
      'Line 4-5: Catches division by zero and returns a fallback value (0).',
      'Line 7: Runs the cleanup block under all execution paths.'
    ],
    bullets4: [
      'Time Complexity: Small stack allocation overhead when exceptions occur.',
      'Space Complexity: Stack allocation for traceback frame information.'
    ],
    bullets5: [
      'Common Interview Question: Never write bare `except: pass`. It silences all exceptions (including syntax errors and system keyboard interrupts), making debugging impossible.',
      'Common Interview Question: Exceptions are matched sequentially. Place specific exception subclasses (e.g. `FileNotFoundError`) before base classes (e.g. `Exception`).'
    ]
  },

  // === 2. NumPy ===
  {
    title: 'Arrays',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'bfb619dd-1519-54cf-8b14-6adfe4642b25',
    type: 'code',
    lang: 'NumPy',
    bullets1: [
      'Definition: Multidimensional, homogeneous collections of items.',
      'Data Type: Elements must share the same data type (`dtype`), which allows them to be stored in contiguous memory buffers.',
      'Student Shorthand: Bypasses Python\'s reference lists, eliminating object pointer lookup overhead.'
    ],
    code: `import numpy as np\n# Array initialization\narr = np.array([1, 2, 3], dtype=np.int32)\nprint(arr.ndim) # 1 (dimension count)\nprint(arr.shape) # (3,) (shape tuple)\nprint(arr.itemsize) # 4 (bytes per element)`,
    bullets3: [
      'Line 3: Creates a 1D contiguous array of 32-bit integers.',
      'Line 4-6: Accesses array metadata. itemsize is 4 bytes (32 bits).'
    ],
    bullets4: [
      'Time Complexity: Creation: O(N) | Lookup: O(1) using stride math.',
      'Space Complexity: Contiguous memory storage equal to `size * itemsize` bytes.'
    ],
    bullets5: [
      'Common Interview Question: Passing elements of mixed types forces upcasting (e.g. matching ints and strings forces array elements to become strings).',
      'Common Interview Question: Creating standard lists from arrays `arr.tolist()` is computationally expensive because it wraps every primitive integer into a Python object.'
    ]
  },
  {
    title: 'Array Operations',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'bfb619dd-1519-54cf-8b14-6adfe4642b25',
    type: 'code',
    lang: 'NumPy',
    bullets1: [
      'Definition: Element-wise mathematical computations executed natively in compiled C.',
      'Vectorization: Replaces Python loops with optimized loops compiled in C.',
      'Universal Functions: Math operations are executed using NumPy `ufuncs`.'
    ],
    code: `import numpy as np\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nsum_arr = a + b # Element-wise add: [5, 7, 9]\nprod_arr = a * b # Element-wise multiply: [4, 10, 18]\nsqrt_arr = np.sqrt(a) # Apply ufunc`,
    bullets3: [
      'Line 4-5: Operates on vectors directly without Python loop iteration overhead.',
      'Line 6: Applies the vectorized square root operation element-wise.'
    ],
    bullets4: [
      'Time Complexity: O(N) execution implemented in compiled C loops.',
      'Space Complexity: O(N) memory allocation for output arrays.'
    ],
    bullets5: [
      'Common Interview Question: The `*` operator performs element-wise multiplication. For matrix dot products, use `a @ b` or `np.dot(a, b)`.',
      'Common Interview Question: Operators fail with `ValueError` if array shapes are incompatible and cannot be broadcasted.'
    ]
  },
  {
    title: 'Broadcasting',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'bfb619dd-1519-54cf-8b14-6adfe4642b25',
    type: 'code',
    lang: 'NumPy',
    bullets1: [
      'Definition: How NumPy performs operations on arrays of different shapes.',
      'Rule: Two dimensions are compatible if: 1. They are equal, or 2. One of them is 1.',
      'Student Shorthand: Stretches the smaller array conceptually along the singleton dimension without copying data in memory.'
    ],
    code: `import numpy as np\n# 3x3 matrix and 1x3 vector\nmatrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])\nvector = np.array([1, 0, 1])\nresult = matrix + vector # Adds vector to each row\n# result: [[2, 2, 4], [5, 5, 7], [8, 8, 10]]`,
    bullets3: [
      'Line 5: Checks dimensions: `matrix` shape is (3,3), `vector` shape is (1,3). The first dimension of vector is 1, so it is broadcasted across the rows of the matrix.'
    ],
    bullets4: [
      'Time Complexity: O(R * C) math execution.',
      'Space Complexity: O(R * C) to store the result, with O(1) memory duplication overhead during broadcasting.'
    ],
    bullets5: [
      'Common Interview Question: Broadcasting fails if trailing dimensions are not compatible (e.g. trying to add a vector of shape (2,) to a matrix of shape (3,3) raises a `ValueError`).',
      'Common Interview Question: Always check dimensions using `.reshape()` or `np.newaxis` to force compatibility before performing operations.'
    ]
  },
  {
    title: 'Vectorization',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'bfb619dd-1519-54cf-8b14-6adfe4642b25',
    type: 'code',
    lang: 'NumPy',
    bullets1: [
      'Definition: Replacing explicit loop iterations in code with array operations.',
      'Why it works: Compiled C operations run at hardware speed using SIMD (Single Instruction Multiple Data) registers.',
      'Student Shorthand: Loops in Python are slow because of type-checking and dynamic lookup overhead on every iteration.'
    ],
    code: `import numpy as np\n# Manual loop (Slow)\ndef loop_add(arr):\n    return [x + 10 for x in arr]\n\n# Vectorized add (Fast)\ndef vec_add(arr):\n    return arr + 10`,
    bullets3: [
      'Line 3-4: Standard Python loops must inspect dynamic types and unpack object values on every iteration.',
      'Line 7-8: Delegates iteration directly to compiled C loop code using static type strides.'
    ],
    bullets4: [
      'Time Complexity: Vectorized implementation runs up to 100x faster than standard Python loops.',
      'Space Complexity: Equal memory footprints, but vectorized calls significantly reduce execution times.'
    ],
    bullets5: [
      'Common Interview Question: Not all logic is vectorizable. Complex conditional branches (`if-else`) inside loops are hard to vectorize without using `np.where` or boolean indexing.',
      'Common Interview Question: `np.vectorize` is a convenience wrapper for readability. It does not run compiled C loops and is as slow as standard `for` loops.'
    ]
  },
  {
    title: 'Reshaping',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'bfb619dd-1519-54cf-8b14-6adfe4642b25',
    type: 'code',
    lang: 'NumPy',
    bullets1: [
      'Definition: Changing the dimensions of an array without modifying its data.',
      'Views vs Copies: Reshaping returns a shallow view of the array data without copying it in memory, if the stride matches.',
      'Rule: The total number of elements must remain constant.'
    ],
    code: `import numpy as np\narr = np.arange(6) # [0, 1, 2, 3, 4, 5]\nreshaped = arr.reshape(2, 3) # View created\n# reshaped: [[0, 1, 2], [3, 4, 5]]\nreshaped[0, 0] = 99 # Modifying view updates original\nprint(arr[0]) # Prints 99`,
    bullets3: [
      'Line 3: Changes shape from (6,) to (2,3) by adjusting dimension strides. No memory allocation for data is performed.',
      'Line 5-6: Modifying the reshaped view updates the underlying array.'
    ],
    bullets4: [
      'Time Complexity: O(1) metadata update.',
      'Space Complexity: O(1) auxiliary allocation since the underlying data buffer is shared.'
    ],
    bullets5: [
      'Common Interview Question: If target dimensions do not match size (e.g. reshaping 6 elements into shape (2,4)), a `ValueError` is raised.',
      'Common Interview Question: Use `-1` as a dimension placeholder to let NumPy automatically calculate the required size, e.g. `arr.reshape(2, -1)`.'
    ]
  },
  {
    title: 'Indexing',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'bfb619dd-1519-54cf-8b14-6adfe4642b25',
    type: 'code',
    lang: 'NumPy',
    bullets1: [
      'Definition: Accessing array elements using slices, coordinates, or boolean masks.',
      'Boolean Masking: Filtering array elements based on logical conditions.',
      'Views vs Copies: Basic slicing (`arr[0:2]`) returns a view. Fancy indexing (`arr[[0, 2]]`) returns a copy.'
    ],
    code: `import numpy as np\narr = np.array([10, 20, 30, 40])\nslice_view = arr[0:2] # Slicing returns a view\nmask = arr > 25 # Boolean mask: [False, False, True, True]\nfiltered = arr[mask] # Filtering returns a copy: [30, 40]`,
    bullets3: [
      'Line 3: Slice updates modify the original array.',
      'Line 4-5: Evaluates element conditions, returning a new copy matching the filter criteria.'
    ],
    bullets4: [
      'Time Complexity: Slicing: O(1) view creation | Filtering/Fancy Indexing: O(N) allocation and copy.',
      'Space Complexity: Slicing: O(1) auxiliary | Filtering: O(K) where K is the number of elements matching the condition.'
    ],
    bullets5: [
      'Common Interview Question: Modifying basic slices updates the original array in-place. If you want to prevent updates, call `.copy()` explicitly: `arr[0:2].copy()`.',
      'Common Interview Question: Mixing basic slicing and fancy indexing can lead to unexpected array shapes and copies.'
    ]
  },
  {
    title: 'Performance Advantages',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'bfb619dd-1519-54cf-8b14-6adfe4642b25',
    type: 'theory',
    bullets1: [
      'Contiguous Storage: Elements are stored in continuous memory blocks, which optimizes cache hits.',
      'No Box Overhead: Stores raw primitives, as opposed to Python lists which store pointers to wrapper objects.',
      'Student Shorthand: Uses compiled C and Fortran code behind the scenes for vector math.'
    ],
    bullets2: [
      'CPython lists require pointer lookups for every element, which causes cache misses.',
      'NumPy arrays use dimension strides to calculate memory offsets directly, making lookups extremely fast.'
    ],
    bullets3: [
      'Pro: Up to 100x faster than standard Python list calculations.',
      'Con: Requires homogeneous data types. Not suitable for storing complex mixed-type objects.'
    ],
    bullets4: [
      'Q: "Why is NumPy faster than standard lists?"',
      'A: 1. Contiguous memory layout. 2. CPU cache locality. 3. Bypasses object boxing/unboxing. 4. Vectorized C code execution.'
    ],
    bullets5: [
      'Trap: Repeatedly adding items to an array in a loop using `np.append` is very slow because it copies the entire array in memory on every call. Use Python lists for dynamic updates, and then convert to a NumPy array once completed.'
    ]
  },

  // === 3. Pandas ===
  {
    title: 'DataFrame',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '7c93c5e4-7a7d-5c43-a6a4-5062fd720f8c',
    type: 'code',
    lang: 'Pandas',
    bullets1: [
      'Definition: Two-dimensional tabular data structure with labeled axes (rows and columns).',
      'Data layout: Structured as a collection of Series objects sharing a common Index.',
      'Student Shorthand: Backed by NumPy arrays under the hood, but adds descriptive row/column labels.'
    ],
    code: `import pandas as pd\n# Creating a DataFrame\ndata = {"age": [25, 30], "salary": [50000, 80000]}\ndf = pd.DataFrame(data, index=["A", "B"])\nprint(df.dtypes) # Displays data types per column\n# age: int64, salary: int64`,
    bullets3: [
      'Line 3-4: Initializes a DataFrame with explicit row indexes ("A" and "B") and column headers.'
    ],
    bullets4: [
      'Time Complexity: Creation: O(R * C) | Accessing column metadata: O(1).',
      'Space Complexity: O(R * C) memory footprint.'
    ],
    bullets5: [
      'Common Interview Question: Storing columns with different data types inside a single DataFrame is supported, but mixing types inside a single column forces the column data type to become a generic `object`, which slows down calculations.',
      'Common Interview Question: Avoid iterating over rows using `for index, row in df.iterrows()`. It is slow because it creates a new Series object for every row. Use vectorized operations instead.'
    ]
  },
  {
    title: 'Series',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '7c93c5e4-7a7d-5c43-a6a4-5062fd720f8c',
    type: 'code',
    lang: 'Pandas',
    bullets1: [
      'Definition: One-dimensional labeled array capable of holding any data type.',
      'Properties: Contains data values and an associated array of labels, called the index.',
      'Student Shorthand: Think of it as a dictionary with fixed-order keys.'
    ],
    code: `import pandas as pd\ns = pd.Series([10, 20, 30], index=["x", "y", "z"])\nval = s["y"] # 20 (index lookup)\nsubset = s[s > 15] # Boolean indexing\n# subset: y -> 20, z -> 30`,
    bullets3: [
      'Line 2: Creates a Series with explicit string indices.',
      'Line 3: Looks up elements by index label.',
      'Line 4: Performs vectorized filtering, returning a new Series object.'
    ],
    bullets4: [
      'Time Complexity: Label lookup: O(1) average | Integer index lookup: O(1).',
      'Space Complexity: O(N) where N is the number of elements in the Series.'
    ],
    bullets5: [
      'Common Interview Question: Unlike dictionaries, Series index labels do not need to be unique, but duplicate index values slow down search performance from O(1) to O(N).',
      'Common Interview Question: Performing math operations on two Series align values based on matching index labels. Mismatched labels return `NaN`.'
    ]
  },
  {
    title: 'Reading Data',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '7c93c5e4-7a7d-5c43-a6a4-5062fd720f8c',
    type: 'code',
    lang: 'Pandas',
    bullets1: [
      'Definition: Loading tabular datasets from files into Pandas DataFrames.',
      'Common methods: `read_csv()`, `read_excel()`, `read_parquet()`, `read_sql()`.',
      'Student Shorthand: Parquet files are columnar, meaning they load faster and take up less memory than standard text CSVs.'
    ],
    code: `import pandas as pd\n# Read dataset and optimize memory usage\ndf = pd.read_csv("data.csv", usecols=["age", "salary"], dtype={"age": "int8"})\n# Loads only required columns and specifies datatype size`,
    bullets3: [
      'Line 3: Using `usecols` avoids loading unnecessary columns into memory, and `dtype` overrides the default 64-bit integer type with a smaller 8-bit integer type to save space.'
    ],
    bullets4: [
      'Time Complexity: Reading Parquet: O(N) (columnar, fast) | Reading CSV: O(N) (slower parsing overhead).',
      'Space Complexity: Loads the selected dataset directly into RAM.'
    ],
    bullets5: [
      'Common Interview Question: Loading massive datasets without chunking can exceed system memory limits, causing crashes. Use the `chunksize` parameter to load and process data in batches: `pd.read_csv("huge.csv", chunksize=10000)`.',
      'Common Interview Question: Parsing date columns is slow. Specify date columns explicitly during load using `parse_dates=["date_col"]` rather than converting them later.'
    ]
  },
  {
    title: 'Filtering',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '7c93c5e4-7a7d-5c43-a6a4-5062fd720f8c',
    type: 'code',
    lang: 'Pandas',
    bullets1: [
      'Definition: Selecting a subset of rows from a DataFrame based on conditions.',
      'Slicing methods: `loc` (label-based filtering) vs `iloc` (integer index-based filtering).',
      'Student Shorthand: Boolean indexing evaluates conditions element-wise, creating a boolean mask.'
    ],
    code: `import pandas as pd\n# Filtering rows\nmask = (df["age"] > 25) & (df["salary"] > 40000) # Bitwise AND\nfiltered_df = df.loc[mask, ["name", "salary"]]\n# iloc for position selection\nsubset_df = df.iloc[0:5, 0:2]`,
    bullets3: [
      'Line 3: Multiple conditions require parentheses around each condition, joined by bitwise operators `&` (AND) or `|` (OR).',
      'Line 4: Filters rows using the boolean mask and selects the target columns.',
      'Line 6: Selects the first 5 rows and 2 columns by their integer position.'
    ],
    bullets4: [
      'Time Complexity: Filtering: O(R) where R is the number of rows.',
      'Space Complexity: Creates a new DataFrame containing the filtered copies.'
    ],
    bullets5: [
      'Common Interview Question: Standard logical operators `and` and `or` do not work for DataFrame filters. You must use the bitwise operators `&` and `|` instead.',
      'Common Interview Question: Modifying filtered subsets without using `.loc` can trigger a `SettingWithCopyWarning`. Use `.loc` explicitly to modify original values.'
    ]
  },
  {
    title: 'GroupBy',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '7c93c5e4-7a7d-5c43-a6a4-5062fd720f8c',
    type: 'code',
    lang: 'Pandas',
    bullets1: [
      'Definition: A split-apply-combine workflow on rows of data.',
      'Stages: 1. Split data by keys. 2. Apply aggregation functions (mean, sum, count). 3. Combine results into a DataFrame.',
      'Student Shorthand: The group keys become the index of the resulting aggregated DataFrame.'
    ],
    code: `import pandas as pd\n# GroupBy and aggregation\ngrouped = df.groupby("department")["salary"].mean()\n# Custom aggregate names using named aggregation\nagg_df = df.groupby("department").agg(avg_sal=("salary", "mean"), total_sal=("salary", "sum"))`,
    bullets3: [
      'Line 3: Splits rows by department, accesses the salary column, and calculates the mean values.',
      'Line 5: Performs multiple aggregations on columns, naming the resulting columns.'
    ],
    bullets4: [
      'Time Complexity: O(N) average where N is the number of rows.',
      'Space Complexity: O(K) where K is the number of unique groups.'
    ],
    bullets5: [
      'Common Interview Question: Grouping by multiple columns creates a MultiIndex. Use `as_index=False` inside `.groupby()` to return standard columns instead.',
      'Common Interview Question: Avoid calculating aggregations using manual loops inside `.apply()`. Use optimized built-in vector methods like `.mean()` or `.sum()` instead.'
    ]
  },
  {
    title: 'Merge',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '7c93c5e4-7a7d-5c43-a6a4-5062fd720f8c',
    type: 'code',
    lang: 'Pandas',
    bullets1: [
      'Definition: Combining two DataFrames based on matching values in join columns.',
      'Join Types: `inner` (intersection), `left` (preserves left keys), `right` (preserves right keys), `outer` (union).',
      'Student Shorthand: Similar to SQL JOIN operations.'
    ],
    code: `import pandas as pd\n# Merging two DataFrames\nmerged_df = pd.merge(df1, df2, on="employee_id", how="left")\n# Merging on different column names\nmerged_diff = pd.merge(df1, df2, left_on="emp_id", right_on="id", how="inner")`,
    bullets3: [
      'Line 3: Performs a left join matching `employee_id` values.',
      'Line 5: Joins tables when the key columns have different names.'
    ],
    bullets4: [
      'Time Complexity: O(R1 + R2) average using hash joins.',
      'Space Complexity: O(R1 + R2) to store the merged result.'
    ],
    bullets5: [
      'Common Interview Question: If duplicate keys exist in both DataFrames, a merge returns a Cartesian product (multiplies matching rows), which can cause massive memory consumption.',
      'Common Interview Question: Joins that result in missing values convert integer columns to floats because standard integers do not support `NaN` values.'
    ]
  },
  {
    title: 'Join',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '7c93c5e4-7a7d-5c43-a6a4-5062fd720f8c',
    type: 'code',
    lang: 'Pandas',
    bullets1: [
      'Definition: Combining DataFrames based on index values instead of columns.',
      'Comparison: `merge()` joins on columns; `join()` joins on indices by default.',
      'Student Shorthand: Convenient for combining multiple tables sharing a common index.'
    ],
    code: `import pandas as pd\n# Join on index\nresult = df1.join(df2, how="left", lsuffix="_left", rsuffix="_right")\n# Join on left column and right index\nresult_col = df1.join(df2, on="key_col")`,
    bullets3: [
      'Line 3: Joins df2 to df1 matching index labels, resolving name conflicts using column suffixes.',
      'Line 5: Joins using key values from a df1 column against index values from df2.'
    ],
    bullets4: [
      'Time Complexity: O(R1 + R2) average index alignment.',
      'Space Complexity: O(R1 + R2) memory allocation.'
    ],
    bullets5: [
      'Common Interview Question: If joining columns share the same name, the operation raises a ValueError unless suffixes are explicitly specified.',
      'Common Interview Question: Always check that index labels match exactly. Mismatched index labels return `NaN` values.'
    ]
  },
  {
    title: 'Missing Values',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '7c93c5e4-7a7d-5c43-a6a4-5062fd720f8c',
    type: 'code',
    lang: 'Pandas',
    bullets1: [
      'Definition: Handling missing data elements (`NaN`, `None`, or `null`).',
      'Common methods: `isna()`, `dropna()`, `fillna()`.',
      'Student Shorthand: Standard numeric columns use `np.nan` (float) to represent missing values, which converts integer columns to float.'
    ],
    code: `import pandas as pd\n# Missing value operations\nnull_mask = df["age"].isna() # Boolean mask of nulls\nclean_df = df.dropna(subset=["salary"]) # Drops rows with null salary\nfilled_df = df.fillna({"age": df["age"].mean()}) # Imputation`,
    bullets3: [
      'Line 3: Creates a boolean mask to locate missing values.',
      'Line 4: Removes rows where the salary column is null.',
      'Line 5: Imputes missing age values with the mean of the column.'
    ],
    bullets4: [
      'Time Complexity: Check/Fill: O(R * C) | Drop: O(R * C).',
      'Space Complexity: Returns a new copy of the DataFrame unless `inplace=True` is specified.'
    ],
    bullets5: [
      'Common Interview Question: Python `NaN` values cannot be compared using `==` (e.g. `NaN == NaN` is False). Always use `.isna()` to locate missing values.',
      'Common Interview Question: Avoid imputing missing values with the mean if the column contains extreme outliers. Use the median or mode instead.'
    ]
  },
  {
    title: 'Apply Functions',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '7c93c5e4-7a7d-5c43-a6a4-5062fd720f8c',
    type: 'code',
    lang: 'Pandas',
    bullets1: [
      'Definition: Applying custom functions across columns or rows of a DataFrame.',
      'Direction: `axis=0` applies the function to each column; `axis=1` applies it to each row.',
      'Student Shorthand: `.apply()` is slow because it performs loops under the hood. Avoid it if vectorized alternatives are available.'
    ],
    code: `import pandas as pd\n# Apply lambda on a column (Fast-ish)\ndf["tax"] = df["salary"].apply(lambda x: x * 0.1)\n# Apply function on rows (Very Slow)\ndf["total"] = df.apply(lambda row: row["salary"] + row["bonus"], axis=1)`,
    bullets3: [
      'Line 3: Applies calculations element-wise to a single Series.',
      'Line 5: Loops through rows, generating Series objects on every step. Highly inefficient.'
    ],
    bullets4: [
      'Time Complexity: `axis=1` is O(R) but has high interpreter overhead. Vectorized alternatives are up to 50x faster.',
      'Space Complexity: Auxiliary allocations for transient Series objects during loop.'
    ],
    bullets5: [
      'Common Interview Question: Row-wise loops (`axis=1`) are a common bottleneck in preprocessing pipelines. Use vectorized calculations instead: `df["total"] = df["salary"] + df["bonus"]`.',
      'Common Interview Question: If elements can be mapped directly using a dictionary lookup, use `.map()` instead of `.apply()` for better performance.'
    ]
  }
];
