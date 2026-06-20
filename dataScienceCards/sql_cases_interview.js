module.exports = [
  // === 26. SQL for Data Science ===
  {
    title: 'SQL Query Execution Order',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '376dca71-3ee4-5ac0-ac1d-8785a9a7815f',
    type: 'theory',
    bullets1: [
      'Concept: Written order of a SQL query is different from its logical execution order.',
      'Written syntax: `SELECT` -> `FROM` -> `JOIN` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `ORDER BY` -> `LIMIT`.',
      'Logical path: The database engine executes clauses in a specific order to establish tables, filter rows, group them, and then project fields.'
    ],
    bullets2: [
      'Step 1: `FROM` and `JOIN` - Locate the primary tables and combine rows.',
      'Step 2: `WHERE` - Filter raw individual rows based on conditions.',
      'Step 3: `GROUP BY` - Group the filtered rows into buckets.',
      'Step 4: `HAVING` - Filter groups based on aggregate conditions.',
      'Step 5: `SELECT` and `DISTINCT` - Evaluate expressions and extract specified columns.',
      'Step 6: `ORDER BY` and `LIMIT` - Sort output rows and slice the top rows.'
    ],
    bullets3: [
      'Analogy: Think of it like sorting mail. First, you get the sack of letters (`FROM`), combine them with another sack (`JOIN`), throw away junk mail (`WHERE`), group by zip code (`GROUP BY`), keep only zip codes with many letters (`HAVING`), open the letters to read sender names (`SELECT`), sort by name (`ORDER BY`), and read only the first ten (`LIMIT`).'
    ],
    bullets4: [
      'Q: Why can you not reference a `SELECT` column alias in the `WHERE` clause?',
      'A: Because `WHERE` executes before `SELECT`. At that point, the column alias does not exist yet. However, you can use it in `ORDER BY` because sorting happens after selection.'
    ],
    bullets5: [
      'Limitation: Optimization engines (like PostgreSQL cost-based optimizer) can physically execute steps out of order to save disk reads, but they must always preserve the logical result of this standard order.'
    ]
  },
  {
    title: 'GROUP BY & HAVING',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '376dca71-3ee4-5ac0-ac1d-8785a9a7815f',
    type: 'code',
    lang: 'SQL',
    bullets1: [
      'Concept: `GROUP BY` collapses multiple rows into aggregate summaries. `HAVING` filters those grouped results.',
      'Rule: Any column in the `SELECT` clause that is not part of an aggregate function must be present in the `GROUP BY` clause.',
      'Difference: `WHERE` filters rows before grouping; `HAVING` filters groups after aggregates are computed.'
    ],
    code: `-- Find departments with average salary greater than 100k\nSELECT dept_id, AVG(salary) AS avg_sal\nFROM employees\nWHERE status = 'Active'\nGROUP BY dept_id\nHAVING AVG(salary) > 100000;`,
    bullets3: [
      'Line 3: Filters employees to include only active ones before any grouping starts.',
      'Line 4: Groups remaining employee rows by their department identifier.',
      'Line 5: Filters out departments whose calculated average salary is 100k or less.'
    ],
    bullets4: [
      'Time Complexity: Aggregation takes O(N log N) sorting time, or O(N) using a hash table under the hood.',
      'Space Complexity: O(G) memory where G is the number of distinct groups generated.'
    ],
    bullets5: [
      'Common Interview Question: Using a `HAVING` clause without a `GROUP BY` is technically valid but behaves as a single group. If the condition fails, it returns zero rows.',
      'Common Interview Question: Avoid putting non-aggregate filters in `HAVING` (e.g. `HAVING status = \'Active\'`). It forces the engine to group unneeded rows, hurting query performance.'
    ]
  },
  {
    title: 'Joins & NULLs',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '376dca71-3ee4-5ac0-ac1d-8785a9a7815f',
    type: 'code',
    lang: 'SQL',
    bullets1: [
      'Concept: How SQL join operators handle missing or null values during matching.',
      'Rule: `NULL` represents an unknown state, so comparing `NULL = NULL` yields `UNKNOWN` (effectively false), preventing matches on null values.',
      'Outer Joins: Keep non-matching rows and fill the missing side with `NULL`.'
    ],
    code: `-- Find users who have not made any purchases\nSELECT u.user_id, u.username\nFROM users u\nLEFT JOIN purchases p ON u.user_id = p.user_id\nWHERE p.purchase_id IS NULL;`,
    bullets3: [
      'Line 3: Performed a left join to keep all users even if they have no purchases.',
      'Line 4: Filtered rows where the joined purchase ID is missing, meaning no match was found.'
    ],
    bullets4: [
      'Time Complexity: Hash join takes O(M + N) where M and N are table sizes. Nested loop join takes O(M * N) if unindexed.',
      'Space Complexity: O(M) memory to build the hash table for the left join.'
    ],
    bullets5: [
      'Common Interview Question: Joining tables on fields containing `NULL` will result in those rows being discarded in an inner join, as `NULL` matches nothing.',
      'Common Interview Question: Putting a filter on the right table in the `WHERE` clause of a `LEFT JOIN` implicitly converts it into an `INNER JOIN`. Use the filter inside the `ON` clause instead.'
    ]
  },
  {
    title: 'Window Functions',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '376dca71-3ee4-5ac0-ac1d-8785a9a7815f',
    type: 'code',
    lang: 'SQL',
    bullets1: [
      'Concept: Calculations performed across a set of table rows related to the current row, without collapsing them.',
      'Syntax: Uses the `OVER` clause along with optional `PARTITION BY` and `ORDER BY`.',
      'Utility: Perfect for running totals, moving averages, and finding top-N ranks per category.'
    ],
    code: `-- Get the top 2 highest paid employees in each department\nWITH ranked_emp AS (\n  SELECT name, dept_id, salary,\n         DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rnk\n  FROM employees\n)\nSELECT name, dept_id, salary\nFROM ranked_emp\nWHERE rnk <= 2;`,
    bullets3: [
      'Line 4: Calculates the pay rank within each department bucket (`PARTITION BY dept_id`), ordering from highest to lowest salary.',
      'Line 8: Filters the CTE results to pull only rows with ranks 1 or 2.'
    ],
    bullets4: [
      'Time Complexity: O(N log N) due to partition sorting requirements.',
      'Space Complexity: O(N) memory to store ranking index partitions.'
    ],
    bullets5: [
      'Common Interview Question: `ROW_NUMBER()` assigns sequential numbers. `RANK()` skips ranks on ties (e.g. 1, 2, 2, 4). `DENSE_RANK()` has no gaps on ties (e.g. 1, 2, 2, 3).',
      'Common Interview Question: Window functions are executed after `GROUP BY` and `HAVING`. You cannot use window functions inside the `WHERE` clause directly.'
    ]
  },
  {
    title: 'Common Table Expressions',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '376dca71-3ee4-5ac0-ac1d-8785a9a7815f',
    type: 'code',
    lang: 'SQL',
    bullets1: [
      'Concept: Named temporary result sets defined within the execution scope of a single query.',
      'Syntax: Declared using the `WITH` keyword.',
      'Utility: Simplifies complex nested joins, improves code readability, and supports recursive queries for hierarchical data structures.'
    ],
    code: `-- Compute monthly sales and compare against average monthly sales\nWITH monthly_sales AS (\n  SELECT date_trunc('month', sale_date) AS sales_month, SUM(amount) AS total\n  FROM transactions\n  GROUP BY 1\n)\nSELECT sales_month, total,\n       AVG(total) OVER () as overall_avg\nFROM monthly_sales;`,
    bullets3: [
      'Line 2-5: Defines the temporary dataset `monthly_sales` containing sales aggregates per month.',
      'Line 7-8: Queries the CTE and applies an overall window average across all calculated sales months.'
    ],
    bullets4: [
      'Time Complexity: Same as running equivalent nested subqueries; modern engines optimize CTEs inline.',
      'Space Complexity: O(M) memory where M is the size of the temporary result set.'
    ],
    bullets5: [
      'Common Interview Question: In older versions of PostgreSQL, CTEs acted as optimization barriers, meaning they were always materialized, which could slow queries down. Modern engines optimize them.',
      'Common Interview Question: Recursive CTEs must include an anchor query, a `UNION ALL`, and a recursive query that eventually returns an empty set to prevent infinite loops.'
    ]
  },
  {
    title: 'SQL Indexing',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '376dca71-3ee4-5ac0-ac1d-8785a9a7815f',
    type: 'theory',
    bullets1: [
      'Concept: Data structures created to accelerate data retrieval speed at the cost of write speed and storage space.',
      'Structure: Mostly implemented as B-Trees, which keep keys sorted to allow binary searches.',
      'Clustered Index: Determines the physical storage order of rows. A table can have only one clustered index (typically the Primary Key).'
    ],
    bullets2: [
      'Step 1: Check query conditions (e.g. `WHERE age = 25`).',
      'Step 2: Traverse the B-Tree index from root to leaf to find the matching key and its row pointer.',
      'Step 3: Fetch the corresponding physical data block from disk using the pointer, skipping full table scans.'
    ],
    bullets3: [
      'Analogy: Think of a database table as a textbook. Without an index, finding a topic requires reading every page (table scan). An index at the back lets you find the topic and jump directly to the right page number.'
    ],
    bullets4: [
      'Q: Why does having too many indexes slow down insertion queries?',
      'A: Every write operation (`INSERT`, `UPDATE`, `DELETE`) must write to the table and also update all the corresponding index trees to keep them in sync.'
    ],
    bullets5: [
      'Limitation: Composite indexes (on multiple columns) only speed up queries that filter by the leftmost prefix. An index on `(last_name, first_name)` is useless for queries filtering only by `first_name`.'
    ]
  },

  // === 27. Case Studies ===
  {
    title: 'User Churn Prediction',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '0ca32c36-af11-5464-a51d-d1c0c664bd58',
    type: 'case_study',
    bullets1: [
      'Goal: Predict subscription churn to target retention campaigns.',
      'Target variable: Binary indicator of user cancellation within the next 30 days.',
      'Evaluation metric: Focus on `Recall` (we want to identify as many churners as possible) and `PR-AUC` due to class imbalance.'
    ],
    bullets2: [
      'Data collection: User activity logs, payment transaction histories, and demographic profiles.',
      'Feature Store: Computes and caches features (e.g., login frequency over 7 days, payment failures).',
      'Training Pipeline: Runs batch training on historical user snapshots using `XGBoost`.',
      'Inference Engine: Runs daily batch predictions to score active users and send them to the CRM tool.'
    ],
    bullets3: [
      'Activity Aggregator: Processes Kafka event streams to track clicks, logins, and session durations.',
      'Feature Engineering Layer: Computes rolling window averages (e.g. ratio of logins in the last 7 days vs last 30 days).',
      'Model Registry: Stores model versions, parameters, and evaluation metrics.',
      'Retention Engine: Triggers promotional emails to high-risk churners.'
    ],
    bullets4: [
      'Data Drift: Changes in user behavior (e.g., seasonal drops in summer holidays) cause prediction accuracy to drop.',
      'Concept Drift: The definition of churn changes (e.g., users pause instead of cancel). Monitor this by running KS tests on feature distributions.'
    ],
    bullets5: [
      'Tradeoff: Real-time vs Batch inference. Batch inference is cheaper and easier to manage but misses immediate signals (like a user deleting their profile). Real-time inference captures immediate signals but requires high-maintenance infrastructure.'
    ]
  },
  {
    title: 'Credit Card Fraud Detection',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0ca32c36-af11-5464-a51d-d1c0c664bd58',
    type: 'case_study',
    bullets1: [
      'Goal: Identify fraudulent credit card transactions in real time (within 50ms).',
      'Class Imbalance: Fraud is extremely rare (e.g., 0.01% of transactions). We must use synthetic oversampling or focal loss during training.',
      'Evaluation metric: High `Precision` at a target `Recall` minimum. A false positive blocks a legitimate purchase, irritating users.'
    ],
    bullets2: [
      'Ingestion: Stream transactions through Kafka.',
      'Feature Store: Low-latency KV store (`Redis`) lookup to pull user historical metrics (e.g., transaction count in last 10 minutes).',
      'Model Serving: Light model (e.g., Random Forest or simple neural network) running inside a fast container.',
      'Decision Gateway: Approves or blocks transaction based on the threshold.'
    ],
    bullets3: [
      'Flink Stream Processor: Computes sliding-window aggregates in real time.',
      'Redis Feature Cache: Holds features like user distance from their home location.',
      'Triton Server: Serves model predictions with high throughput.',
      'Human-in-the-loop: Queue flagged transactions for manual verification to generate clean labels.'
    ],
    bullets4: [
      'Scale: Must handle 10,000 queries per second (QPS) during peak holiday seasons.',
      'Monitoring: Track the latency distribution (p99) closely. If latencies cross 50ms, bypass model and fall back to rule-based heuristics.'
    ],
    bullets5: [
      'Tradeoff: Accuracy vs Latency. Deep neural networks are highly accurate but run slowly. We use a fast linear model or small Random Forest to meet the strict 50ms latency budget.'
    ]
  },
  {
    title: 'Ride Share ETA Prediction',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0ca32c36-af11-5464-a51d-d1c0c664bd58',
    type: 'case_study',
    bullets1: [
      'Goal: Predict estimated time of arrival (ETA) for ride-hailing passengers.',
      'Loss function: `Mean Absolute Error (MAE)` to avoid heavy penalties from outlier traffic delays.',
      'Input Features: Spatial coordinates, driver speed, historic traffic speeds, time of day, weather.'
    ],
    bullets2: [
      'Spatial Partitioning: Map coordinates to discrete cells using H3 grid index.',
      'Routing Engine: Calculates the shortest distance path using OSRM.',
      'ML Feature Processor: Combines distance with current traffic speeds.',
      'Deep Learning Model: Feedforward or graph neural network predicts the temporal offset.'
    ],
    bullets3: [
      'Kafka Stream: Consumes GPS pings from active drivers.',
      'Spatial Database: Stores geographical segments and historical travel times.',
      'Feature Joiner: Merges real-time weather and driver characteristics.',
      'Inference Host: Computes and returns the ETA back to the mobile app.'
    ],
    bullets4: [
      'Throughput: Millions of rides require frequent updates. Use spatial caching to avoid running model inference on every single GPS ping.',
      'Monitoring: Track MAE across different geographical areas. Outlying regions often need custom models.'
    ],
    bullets5: [
      'Tradeoff: Physics-based routing vs Pure Machine Learning. Physics-based routing is predictable but struggles with traffic variations. Pure ML fits traffic patterns but occasionally predicts negative travel times. Hybrid models perform best.'
    ]
  },
  {
    title: 'E-commerce Recommendation System',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '0ca32c36-af11-5464-a51d-d1c0c664bd58',
    type: 'case_study',
    bullets1: [
      'Goal: Personalize product listings on homepage to maximize CTR.',
      'Cold Start: New items and users have no interaction history.',
      'Evaluation Metric: `NDCG` (Normalized Discounted Cumulative Gain) to evaluate list ranking quality.'
    ],
    bullets2: [
      'Retrieval Phase: Downselect millions of items to 100 candidates using fast collaborative filtering or vector similarity.',
      'Ranking Phase: Score and sort the 100 candidates using a deep neural net (e.g. DLRM) considering user context.',
      'Re-ranking Layer: Filters out duplicates, out-of-stock items, and enforces category diversity.'
    ],
    bullets3: [
      'Vector Database: Stores item and user embeddings, running Approximate Nearest Neighbor (ANN) search.',
      'Feature Store: Houses user real-time interest profiles (e.g., category clicks).',
      'Inference Engine: Runs deep ranking model.',
      'Feedback Loop: Logs impressions and clicks back to training storage.'
    ],
    bullets4: [
      'Scale: Serving latency must be below 100ms. Retrieval phase is heavily cached to reduce backend load.',
      'Monitoring: Track metrics like coverage (percentage of catalog recommended) and novelty (how unexpected the recommendations are).'
    ],
    bullets5: [
      'Tradeoff: Personalization vs System Latency. More complex user features increase personalization quality but require expensive realtime joins that increase serving latency.'
    ]
  },
  {
    title: 'Ad Click-Through Rate Prediction',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0ca32c36-af11-5464-a51d-d1c0c664bd58',
    type: 'case_study',
    bullets1: [
      'Goal: Estimate the probability that a user will click on an ad to decide bidding prices in auctions.',
      'High Sparsity: Categorical features (user ID, publisher ID) have massive cardinality.',
      'Evaluation Metric: Log Loss (cross-entropy) and model calibration (ratio of predicted clicks to actual clicks).'
    ],
    bullets2: [
      'Request Router: Receives ad bidding requests.',
      'Feature Joiner: Gathers user and context features from key-value caches.',
      'CTR Model Host: Computes probability using factorization machines or logistic regression.',
      'Auction Solver: Combines CTR with bid value to run Vickrey-Clark-Groves auction.'
    ],
    bullets3: [
      'Redis Feature Store: Serves sparse features in under 5ms.',
      'Feature Hashing Layer: Reduces cardinality of sparse categorical inputs to fixed-size array indices.',
      'Model Serve Node: Runs highly optimized C++ code for matrix multiplications.',
      'Kafka Logs: Captures impressions and clicks to compile training datasets.'
    ],
    bullets4: [
      'SLA constraints: Bids must be submitted within 10ms. Feature lookup and model inference must take less than 5ms.',
      'Monitoring: Real-time logging of prediction calibration. A drop in calibration can cause financial losses.'
    ],
    bullets5: [
      'Tradeoff: Complex Deep Models vs Simple Logistic Regression. Logistic regression is faster and highly interpretable, but fails to capture complex feature crossings. Deep learning models capture crossings but are slower and expensive to run.'
    ]
  },

  // === 28. Most Asked Interview Questions ===
  {
    title: 'Bias vs Variance Tradeoff',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'f36094f6-adaa-54c8-b83c-129c256208ab',
    type: 'comparison',
    conceptA: 'Bias',
    conceptB: 'Variance',
    bullets1: [
      'Definition: Error introduced by approximating a complex real-world relation with a simpler model.',
      'Underfitting: High bias models fail to capture training data patterns (e.g. using linear regression on quadratic relations).',
      'Indicator: High training loss and high validation loss.'
    ],
    bullets2: [
      'Definition: Error introduced by a model\'s sensitivity to small fluctuations in the training dataset.',
      'Overfitting: High variance models memorize noise instead of learning general trends (e.g. using deep decision trees without pruning).',
      'Indicator: Low training loss and high validation loss.'
    ],
    bullets3: [
      'Tension: You cannot minimize both at the same time. Total expected error is the sum of squared Bias, Variance, and Irreducible Noise. As model complexity increases, bias drops but variance increases.'
    ],
    bullets4: [
      'Property | High Bias | High Variance',
      'Model Complexity | Low (Simple) | High (Complex)',
      'Training Error | High | Low',
      'Validation Error | High | High',
      'Underlying Cause | Simplistic assumptions | Over-parameterization'
    ],
    bullets5: [
      'Scenario: "My validation error is high but training error is low. What does this mean, and how do I fix it?"',
      'Diagnosis: High variance (overfitting).',
      'Solution: Collect more data, apply regularization (`L1`/`L2`), perform feature selection, prune trees, or use dropout in neural nets.'
    ]
  },
  {
    title: 'L1 vs L2 Regularization',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'f36094f6-adaa-54c8-b83c-129c256208ab',
    type: 'comparison',
    conceptA: 'L1 Regularization (Lasso)',
    conceptB: 'L2 Regularization (Ridge)',
    bullets1: [
      'Definition: Regularization method that adds a penalty proportional to the absolute values of the weights: `λ ∑ |w_i|`.',
      'Sparsity: Drives unimportant weight coefficients to exactly zero, performing feature selection.',
      'Utility: Best when you have many features and expect only a few to be predictive.'
    ],
    bullets2: [
      'Definition: Regularization method that adds a penalty proportional to the squared values of the weights: `λ ∑ w_i^2`.',
      'Weight Shrinkage: Shrinks weight coefficients toward zero, but never makes them exactly zero.',
      'Utility: Best when you have many correlated features and want to distribute weight among them.'
    ],
    bullets3: [
      'Tension: L1 provides sparse solutions but behaves erratically with correlated features (picking one randomly). L2 stabilizes weights and handles collinearity well, but preserves all features, resulting in less interpretable models.'
    ],
    bullets4: [
      'Feature | L1 (Lasso) | L2 (Ridge)',
      'Penalty Term | Absolute sum (`|w|`) | Squared sum (`w^2`)',
      'Sparse Weights? | Yes (weights become 0) | No (weights approach 0)',
      'Feature Selection | Built-in | None',
      'Analytical Solution | No (requires optimization) | Yes (closed-form available)'
    ],
    bullets5: [
      'Scenario: "Which regularization would you select for a dataset with 5,000 features where you suspect only 20 are truly active?"',
      'Answer: Use L1 regularization because its geometric constraints force uninformative features to have exactly zero weight, leaving you with a sparse, clean model.'
    ]
  },
  {
    title: 'Generative vs Discriminative Models',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'f36094f6-adaa-54c8-b83c-129c256208ab',
    type: 'comparison',
    conceptA: 'Generative Models',
    conceptB: 'Discriminative Models',
    bullets1: [
      'Definition: Models that learn the joint probability distribution `P(X, Y)` of the input features and target labels.',
      'Function: Models how the data was generated to compute probabilities and generate new synthetic samples.',
      'Examples: Naive Bayes, Linear Discriminant Analysis (LDA), Gaussian Mixture Models, GANs.'
    ],
    bullets2: [
      'Definition: Models that learn the conditional probability distribution `P(Y|X)` directly.',
      'Function: Maps input features straight to decision boundaries, focusing purely on classification.',
      'Examples: Logistic Regression, Support Vector Machines (SVM), Random Forests, Neural Networks.'
    ],
    bullets3: [
      'Tension: Generative models require more data and parameters because they model the full distribution, but they handle missing data well. Discriminative models focus only on the boundary, achieving higher classification accuracy with fewer assumptions.'
    ],
    bullets4: [
      'Aspect | Generative Models | Discriminative Models',
      'Objective | Learn joint distribution `P(X, Y)` | Learn conditional distribution `P(Y|X)`',
      'Data Generation | Can generate new samples | Cannot generate new samples',
      'Missing Data | Robust | Sensitive',
      'Outlier Detection | Excellent | Poor'
    ],
    bullets5: [
      'Scenario: "Compare Naive Bayes and Logistic Regression for binary classification."',
      'Answer: Naive Bayes is generative and assumes feature independence, making it fast and effective with small datasets. Logistic Regression is discriminative, makes fewer assumptions, and generally achieves better classification performance given sufficient training data.'
    ]
  },
  {
    title: 'Gradient Descent vs SGD',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'f36094f6-adaa-54c8-b83c-129c256208ab',
    type: 'comparison',
    conceptA: 'Batch Gradient Descent',
    conceptB: 'Stochastic Gradient Descent (SGD)',
    bullets1: [
      'Definition: Optimization algorithm that computes the loss gradient over the entire dataset before taking a single step.',
      'Update Path: Smooth, steady, and deterministic convergence toward the minimum.',
      'Cost: Extremely slow and memory-intensive for large datasets.'
    ],
    bullets2: [
      'Definition: Optimizer that updates weights using the gradient of a single randomly selected training sample.',
      'Update Path: Noisy and erratic trajectory, which helps escape local minima.',
      'Cost: Fast computation per step, but takes many steps to settle.'
    ],
    bullets3: [
      'Tension: Batch GD is stable but bottlenecked by dataset size. SGD is fast but its erratic updates cause it to oscillate around the minimum without settling. Mini-batch gradient descent balances both by computing gradients on small batches (e.g. 32, 64, 128).'
    ],
    bullets4: [
      'Metric | Batch GD | Stochastic GD (SGD)',
      'Data per update | Whole dataset | 1 random sample',
      'Speed per step | Slow | Extremely fast',
      'Memory footprint | High | Very low',
      'Convergence path | Direct | Noisy, oscillating'
    ],
    bullets5: [
      'Scenario: "Why is mini-batch training preferred over pure SGD or batch GD in deep learning?"',
      'Answer: Mini-batch gradient descent takes advantage of GPU parallelization (faster than SGD) while stabilizing update steps (less noisy than SGD) and avoiding CPU/GPU memory overflow (unlike batch GD).'
    ]
  },
  {
    title: 'Supervised vs Unsupervised',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'f36094f6-adaa-54c8-b83c-129c256208ab',
    type: 'comparison',
    conceptA: 'Supervised Learning',
    conceptB: 'Unsupervised Learning',
    bullets1: [
      'Definition: Machine learning where models train on labeled data with known target values.',
      'Goal: Predict outcomes or classify categories for new, unseen data.',
      'Examples: Linear regression, decision trees, support vector machines, neural nets.'
    ],
    bullets2: [
      'Definition: Machine learning where models find patterns in unlabeled data.',
      'Goal: Discover hidden structures, group similar items, or compress features.',
      'Examples: K-Means clustering, PCA, Isolation Forest, DBSCAN.'
    ],
    bullets3: [
      'Tension: Supervised learning requires expensive labeled datasets but has clear metrics (like accuracy or MSE) to measure success. Unsupervised learning uses cheap unlabeled data but evaluating results is subjective and lacks standard metrics.'
    ],
    bullets4: [
      'Parameter | Supervised Learning | Unsupervised Learning',
      'Input Data | Labeled | Unlabeled',
      'Evaluation Metric | Clear (MSE, F1, Accuracy) | Ambiguous (Silhouette, Inertia)',
      'Complexity | Simpler training loop | Complex pattern matching',
      'Use Cases | Forecasting, Classification | Customer segmentation, Anomaly detection'
    ],
    bullets5: [
      'Scenario: "How do you evaluate clustering performance if your data has no labels?"',
      'Answer: Use internal metrics like the silhouette score (to measure cluster separation and density) or elbow/inertia plots. Alternatively, inspect cluster characteristics manually or use them in downstream classification tasks to see if they improve accuracy.'
    ]
  },
  {
    title: 'Bagging vs Boosting',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'f36094f6-adaa-54c8-b83c-129c256208ab',
    type: 'comparison',
    conceptA: 'Bagging (Bootstrap Aggregation)',
    conceptB: 'Boosting',
    bullets1: [
      'Definition: Ensemble method that trains multiple base models (like decision trees) in parallel on bootstrap samples.',
      'Mechanism: Aggregates predictions by voting (classification) or averaging (regression).',
      'Goal: Reduces model variance and prevents overfitting (e.g. Random Forest).'
    ],
    bullets2: [
      'Definition: Ensemble method that trains base models sequentially, where each model focuses on correcting the errors of the previous one.',
      'Mechanism: Iteratively adjusts sample weights based on prior prediction errors.',
      'Goal: Reduces model bias, creating a strong classifier from weak learners (e.g. XGBoost).'
    ],
    bullets3: [
      'Tension: Bagging trains models independently in parallel, reducing variance without affecting bias. Boosting trains sequentially, lowering bias, but is prone to overfitting if the data is noisy.'
    ],
    bullets4: [
      'Feature | Bagging | Boosting',
      'Training order | Parallel | Sequential',
      'Primary benefit | Reduces Variance | Reduces Bias',
      'Base learners | Deep, complex trees | Shallow, simple trees (stumps)',
      'Overfitting risk | Low | High (on noisy data)'
    ],
    bullets5: [
      'Scenario: "Would you choose Random Forest (Bagging) or XGBoost (Boosting) if your training dataset has a lot of label noise?"',
      'Answer: Choose Random Forest because Bagging reduces variance and is robust to noise. Boosting focuses sequentially on correcting errors, meaning it will overfit by trying to fit the noisy labels.'
    ]
  },
  {
    title: 'Decision Trees vs Random Forests',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'f36094f6-adaa-54c8-b83c-129c256208ab',
    type: 'comparison',
    conceptA: 'Decision Trees',
    conceptB: 'Random Forests',
    bullets1: [
      'Definition: A single model that recursively splits features to build a decision tree.',
      'Interpretability: High. You can visualize the decision rules directly.',
      'Weakness: Prone to severe overfitting, resulting in high variance.'
    ],
    bullets2: [
      'Definition: An ensemble of many de-correlated decision trees.',
      'De-correlation: Employs bootstrap sampling (bagging) and feature subspace sampling (splitting on random feature subsets).',
      'Strength: High generalizability, low variance, and resistant to overfitting.'
    ],
    bullets3: [
      'Tension: A single Decision Tree is fast and highly interpretable but yields weak predictive performance. A Random Forest achieves high accuracy but is a complex black box that requires more memory and compute.'
    ],
    bullets4: [
      'Metric | Decision Tree | Random Forest',
      'Model Type | Single Estimator | Ensemble (Bagging)',
      'Interpretability | High | Low (Black box)',
      'Overfitting | Very High | Low',
      'Feature Importance | Biased toward high-cardinality features | Robust average importance'
    ],
    bullets5: [
      'Scenario: "Why does feature subspace sampling in Random Forest improve performance over simple bagging?"',
      'Answer: It de-correlates the individual trees. Without random feature selection, a dominant feature would be chosen at the root of every tree, making them highly correlated and reducing the benefits of ensemble averaging.'
    ]
  },
  {
    title: 'Parametric vs Non-Parametric',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'f36094f6-adaa-54c8-b83c-129c256208ab',
    type: 'comparison',
    conceptA: 'Parametric Models',
    conceptB: 'Non-Parametric Models',
    bullets1: [
      'Definition: Models that assume a fixed functional form (e.g. linear, logistic) for the target function.',
      'Complexity: Fixed number of parameters, independent of training dataset size.',
      'Examples: Linear Regression, Logistic Regression, Naive Bayes, Linear SVM.'
    ],
    bullets2: [
      'Definition: Models that do not assume a fixed functional form, allowing complexity to grow with the dataset.',
      'Complexity: Flexible parameter set, mapping complex, non-linear relations.',
      'Examples: K-Nearest Neighbors (KNN), Decision Trees, Support Vector Machines (RBF Kernel).'
    ],
    bullets3: [
      'Tension: Parametric models are fast to train, require less data, and are highly interpretable, but have limited capacity (high bias). Non-parametric models are flexible and highly accurate, but require more data, are slower to query, and overfit easily.'
    ],
    bullets4: [
      'Property | Parametric Models | Non-Parametric Models',
      'Parameters | Fixed size | Grows with training data size',
      'Training speed | Fast | Slow',
      'Data requirements | Low | High',
      'Interpretability | Simple | Complex'
    ],
    bullets5: [
      'Scenario: "When would you prefer a parametric model like Logistic Regression over a non-parametric model like KNN?"',
      'Answer: Prefer Logistic Regression when dataset size is small (KNN overfits), when model interpretability is required, or when online inference must run with low latency and memory footprints (KNN requires storing the entire training dataset to run predictions).'
    ]
  },
  {
    title: 'Precision vs Recall',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'f36094f6-adaa-54c8-b83c-129c256208ab',
    type: 'comparison',
    conceptA: 'Precision',
    conceptB: 'Recall (Sensitivity)',
    bullets1: [
      'Definition: Out of all positive predictions, how many were actually positive: `(TP) / (TP + FP)`.',
      'Objective: Minimize false positives (e.g. avoiding marking a legitimate email as spam).',
      'Utility: Critical when the cost of a false alarm is high.'
    ],
    bullets2: [
      'Definition: Out of all actual positives, how many did the model find: `(TP) / (TP + FN)`.',
      'Objective: Minimize false negatives (e.g. avoiding missing a malignant tumor).',
      'Utility: Critical when the cost of missing a positive case is catastrophic.'
    ],
    bullets3: [
      'Tension: Changing the decision threshold to increase precision (making the model more selective) decreases recall (missing more cases). The F1-score balances both by computing their harmonic mean: `2 * (Precision * Recall) / (Precision + Recall)`.'
    ],
    bullets4: [
      'Focus | Precision | Recall',
      'Denominator | Total predicted positives (`TP + FP`) | Total actual positives (`TP + FN`)',
      'Primary target | Minimizing False Positives | Minimizing False Negatives',
      'Key application | Spam detection, ad targeting | Disease screening, fraud detection'
    ],
    bullets5: [
      'Scenario: "In COVID-19 screening, would you prioritize Precision or Recall?"',
      'Answer: Prioritize Recall. Missing a positive case (false negative) means an infected person goes undetected and spreads the virus. A false positive can be corrected with a follow-up test.'
    ]
  },
  {
    title: 'Data Leakage',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'f36094f6-adaa-54c8-b83c-129c256208ab',
    type: 'theory',
    bullets1: [
      'Concept: When training data contains information about the target variable that will not be available during inference.',
      'Consequence: The model achieves excellent validation scores but performs poorly on real, unseen data.',
      'Types: Target leakage (features created using future information) and Train-Test contamination (scaling using the entire dataset).'
    ],
    bullets2: [
      'Step 1: Check feature timelines. Ensure no feature uses information recorded after the target event.',
      'Step 2: Preprocess inside CV folds. Fit scalers (`MinMaxScaler`, `StandardScaler`) and imputers only on the training folds, then apply them to validation folds.',
      'Step 3: Separate training and test splits early, before any data exploration or cleanup.'
    ],
    bullets3: [
      'Analogy: Imagine a student getting a copy of the final exam questions while studying. They will score 100% on the exam, but they haven\'t actually learned the material and will fail when given new questions.'
    ],
    bullets4: [
      'Q: How does standardizing features before splitting the dataset cause data leakage?',
      'A: Standardization computes the global mean and standard deviation. If you scale before splitting, the training data contains information about the mean and variance of the test set, leaking validation set characteristics into the training phase.'
    ],
    bullets5: [
      'Limitation: In time-series forecasting, standard cross-validation splits cause leakage. You must use rolling windows (e.g. `TimeSeriesSplit`) to ensure you only train on past data to predict future points.'
    ]
  }
];
