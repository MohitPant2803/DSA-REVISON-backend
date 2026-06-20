module.exports = [
  // === 9. Data Preprocessing ===
  {
    title: 'Missing Values',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3ce30203-c999-5546-98f9-ad103a2bba22',
    type: 'theory',
    bullets1: [
      'Definition: Absent values in variables, classified as MCAR (completely at random), MAR (at random), or MNAR (not at random).',
      'Impact: Most ML algorithms fail if inputs contain missing values (NaN/None).',
      'Student Shorthand: MNAR is the most dangerous because the missingness itself contains information (e.g. high-income users refusing to report salary).'
    ],
    bullets2: [
      'Locate missing fields using mask checks.',
      'Apply removal strategies (dropping rows/columns) or imputation strategies (replacing with mean, median, mode, or model-based estimates).',
      'Verify if imputation shifts variance or introduces skew.'
    ],
    bullets3: [
      'Analogy: Missing values are like holes in a water pipe. You can block them by cutting out the pipe section (dropping data) or filling them with putty (imputation).'
    ],
    bullets4: [
      'Q: "When is mean imputation bad?"',
      'A: Mean imputation is bad if the column contains outliers or is highly skewed, because it changes the distribution shape and reduces variance artificially. Use median or mode imputation instead.'
    ],
    bullets5: [
      'MCAR vs MNAR: MCAR means missingness is independent of any values. MNAR means missingness depends on the unobserved value itself, requiring domain-specific handling.'
    ]
  },
  {
    title: 'Outliers',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3ce30203-c999-5546-98f9-ad103a2bba22',
    type: 'theory',
    bullets1: [
      'Definition: Data points that lie far away from the overall pattern of the rest of the dataset.',
      'Detection: Common statistical methods include Z-score thresholding (>3 or <-3) and IQR scaling (`1.5 * IQR`).',
      'Sensitivity: Distance-based models (KNN, K-Means) and linear regressions are highly sensitive to outliers.'
    ],
    bullets2: [
      'Z-score check: Flag points where `Z = (x - μ) / (σ) > 3`.',
      'IQR check: Flag points outside range `[Q1 - 1.5 * IQR, Q3 + 1.5 * IQR]`.',
      'Handle by trimming (dropping), capping (winsorization), or applying mathematical transformations (log transform).'
    ],
    bullets3: [
      'Analogy: An outlier is like a giant entering a room of average-height people. The average height shifts dramatically, but the median height remains unchanged.'
    ],
    bullets4: [
      'Q: "How do you handle outliers in linear regression?"',
      'A: 1. Remove them if they are measurement errors. 2. Cap them using winsorization. 3. Use robust cost functions like Huber Loss instead of Mean Squared Error.'
    ],
    bullets5: [
      'Anomaly detection vs Outliers: Outliers are noise/anomalies in existing datasets. Anomaly detection is the task of identifying novel, unexpected patterns in streaming data.'
    ]
  },
  {
    title: 'Encoding',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3ce30203-c999-5546-98f9-ad103a2bba22',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Converting categorical text labels into numerical values so ML algorithms can process them.',
      'Types: Label Encoding (integer maps for ordinal data) and One-Hot Encoding (binary columns for nominal data).',
      'Student Shorthand: One-hot encoding nominal variables with high cardinality creates massive, sparse columns, which slows down models.'
    ],
    code: `import pandas as pd\n# Nominal categorical data\ndf = pd.DataFrame({"city": ["NY", "LA", "NY"]})\n# One-Hot Encoding\nohe_df = pd.get_dummies(df, columns=["city"], drop_first=True)\n# Output has: city_NY (binary column, LA dropped to prevent collinearity)`,
    bullets3: [
      'Line 4: Converts nominal strings into binary columns. Setting `drop_first=True` drops the first class column, preventing multicollinearity (dummy variable trap).'
    ],
    bullets4: [
      'Time Complexity: O(R * C) where R is rows and C is unique labels.',
      'Space Complexity: O(R * C) memory expansion for one-hot matrices.'
    ],
    bullets5: [
      'Gotcha: Label encoding nominal data (e.g. mapping "LA" to 0, "NY" to 1) tricks models into assuming mathematical order (NY > LA), which degrades linear/distance model performance.',
      'Gotcha: High cardinality nominal features (e.g. Zip codes) should be encoded using target encoding or frequency encoding instead of one-hot encoding.'
    ]
  },
  {
    title: 'Scaling',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3ce30203-c999-5546-98f9-ad103a2bba22',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Transforming feature ranges so they have similar scales.',
      'Why it matters: Bypasses scaling dominance where large-scale features (e.g. salary) dominate small-scale features (e.g. age) in distance calculations.',
      'Standardization: Scaling features to have a mean of 0 and variance of 1.'
    ],
    code: `from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\n# Fit on train, transform both train and test\nscaled_train = scaler.fit_transform(X_train)\nscaled_test = scaler.transform(X_test)`,
    bullets3: [
      'Line 3-4: `fit_transform` calculates training mean and variance, then scales training data. Test data is scaled using the *same* training statistics to prevent data leakage.'
    ],
    bullets4: [
      'Time Complexity: Fit: O(R * C) | Transform: O(R * C).',
      'Space Complexity: O(R * C) for scaled output arrays.'
    ],
    bullets5: [
      'Gotcha: Standard scaling assumes data is normally distributed. If data contains extreme outliers, use `RobustScaler` (which scales using median and IQR) instead.',
      'Gotcha: Scaling target variable `Y` is rarely required, but scaling inputs is vital for gradient descent speed and distance model correctness.'
    ]
  },
  {
    title: 'Normalization',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3ce30203-c999-5546-98f9-ad103a2bba22',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Scaling features to a fixed range, typically between 0 and 1.',
      'Formula: Min-Max scaling: `x_{scaled} = (x - x_{\\min}) / (x_{\\max) - x_{\\min}}`.',
      'Student Shorthand: Ideal for algorithms that do not assume normal distributions (e.g. neural networks or KNN).'
    ],
    code: `from sklearn.preprocessing import MinMaxScaler\nscaler = MinMaxScaler(feature_range=(0, 1))\n# Apply Min-Max scaling\nX_train_norm = scaler.fit_transform(X_train)\nX_test_norm = scaler.transform(X_test)`,
    bullets3: [
      'Line 3-4: Fits parameters (`X_{min}` and `X_{max}`) on the training set, then scales both datasets.'
    ],
    bullets4: [
      'Time Complexity: O(R * C) operations.',
      'Space Complexity: O(R * C) array allocations.'
    ],
    bullets5: [
      'Gotcha: Outliers ruin min-max scaling because they stretch `X_{max}` artificially, compressing normal values into a tiny range (e.g. 0.01 to 0.05).',
      'Gotcha: Min-Max normalization does not handle values outside the training range during test time gracefully. They will map outside the [0, 1] range.'
    ]
  },
  {
    title: 'Train Test Split',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3ce30203-c999-5546-98f9-ad103a2bba22',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Splitting a dataset into distinct sets: training (to fit models) and testing (to evaluate performance).',
      'Stratification: Ensuring split sets contain the same proportion of target classes as the original dataset.',
      'Data Leakage: Preprocessing (scaling, imputation) must occur *after* splitting, using statistics calculated solely from the training set.'
    ],
    code: `from sklearn.model_selection import train_test_split\n# Stratified split for class balance\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, stratify=y, random_state=42\n)`,
    bullets3: [
      'Line 3-4: Splits data with 20% allocated for testing. Setting `stratify=y` guarantees that both train and test sets have the same ratio of class outcomes.'
    ],
    bullets4: [
      'Time Complexity: O(R) row copying.',
      'Space Complexity: O(R * C) memory allocation.'
    ],
    bullets5: [
      'Gotcha: Forgetting to set a static `random_state` causes the split to change on every execution, making model evaluation results inconsistent and hard to reproduce.',
      'Gotcha: For time-series data, never use random splitting. It leaks future information into past predictions. Use sequential splits (`TimeSeriesSplit`) instead.'
    ]
  },

  // === 10. EDA ===
  {
    title: 'EDA Workflow',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'a9e90ea7-d657-525d-bbeb-852f76770874',
    type: 'theory',
    bullets1: [
      'Definition: Systematically analyzing datasets to summarize their main characteristics, identify patterns, and find anomalies.',
      'Steps: 1. Shape and type inspection. 2. Summary stats. 3. Missing/Outlier detection. 4. Univariate & Multivariate visualization.',
      'Student Shorthand: Never build models without performing EDA. It determines your feature engineering and algorithm selection strategies.'
    ],
    bullets2: [
      'Run `.info()`, `.describe()`, and `.isna().sum()` to get a quick summary of the data.',
      'Visualize distributions using histograms and box plots.',
      'Analyze variables using scatter plots and correlation heatmaps.'
    ],
    bullets3: [
      'Analogy: EDA is like inspecting a second-hand car before buying it: checking for rust, checking oil levels, and taking it for a test drive.'
    ],
    bullets4: [
      'Q: "What are the core metrics checked in numerical columns during EDA?"',
      'A: Check the range (min/max), skewness, standard deviation, and count of missing values.'
    ],
    bullets5: [
      'Data Profiling: Automating EDA workflows using libraries like `ydata-profiling` to generate HTML reports. Great for quick checks, but manual deep dives are still needed.'
    ]
  },
  {
    title: 'Univariate Analysis',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'a9e90ea7-d657-525d-bbeb-852f76770874',
    type: 'theory',
    bullets1: [
      'Definition: Analyzing the distribution, central tendency, and spread of a single variable in isolation.',
      'Numerical: Analyzed using histograms, density plots (KDE), box plots, and summary statistics.',
      'Categorical: Analyzed using bar charts, pie charts, and frequency tables.'
    ],
    bullets2: [
      'Extract a single target column.',
      'Compute descriptive statistics (mean, median, standard deviation, skewness).',
      'Plot the distribution (histogram for continuous data, bar chart for categorical data).'
    ],
    bullets3: [
      'Analogy: Univariate analysis is like examining each candidate\'s resume individually before comparing them.'
    ],
    bullets4: [
      'Q: "How do you identify skewness in univariate analysis?"',
      'A: Compare the mean and median: if Mean > Median, it is right-skewed; if Mean < Median, it is left-skewed. Check visual symmetry on a histogram.'
    ],
    bullets5: [
      'Constant Features: Columns with zero variance (every row has the same value). Identify and drop them during univariate analysis since they add no predictive power.'
    ]
  },
  {
    title: 'Bivariate Analysis',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'a9e90ea7-d657-525d-bbeb-852f76770874',
    type: 'theory',
    bullets1: [
      'Definition: Analyzing the relationship or correlation between two variables.',
      'Num-Num: Analyzed using scatter plots, line plots, and correlation coefficients.',
      'Cat-Num: Analyzed using box plots, violin plots, and grouped bar charts.'
    ],
    bullets2: [
      'Select two variables of interest (e.g. age vs. salary).',
      'Choose the appropriate visualization based on their data types (scatter plot for numeric-numeric).',
      'Calculate statistical measures of association (e.g. Pearson correlation or t-test).'
    ],
    bullets3: [
      'Analogy: Bivariate analysis is like studying the dynamics between two dance partners: how their movements change relative to each other.'
    ],
    bullets4: [
      'Q: "How do you analyze the relationship between a categorical variable and a numerical variable?"',
      'A: Use grouped box plots or violin plots to show the distribution of the numerical variable across each category.'
    ],
    bullets5: [
      'Simpson\'s Paradox: A trend appearing in different groups of data can reverse when the groups are combined. Always segment your bivariate analysis to check for hidden confounding variables.'
    ]
  },
  {
    title: 'Correlation Analysis',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'a9e90ea7-d657-525d-bbeb-852f76770874',
    type: 'theory',
    bullets1: [
      'Definition: Measuring the statistical relationship between variables.',
      'Types: Pearson (linear relationships), Spearman (rank-based monotonic relationships), Kendall (ordinal association).',
      'Correlation Range: Scaled from -1 to +1.'
    ],
    bullets2: [
      'Compute the correlation matrix for all numerical variables.',
      'Visualize coefficients using a correlation heatmap.',
      'Flag features with high mutual correlation (>0.8) to address multicollinearity.'
    ],
    bullets3: [
      'Analogy: High correlation is like two clocks ticking in sync: they move together, but one clock does not cause the other to tick.'
    ],
    bullets4: [
      'Q: "When is Spearman rank correlation preferred over Pearson?"',
      'A: When the relationship between variables is monotonic but non-linear (e.g. exponential growth), or when the dataset contains significant outliers that distort linear calculations.'
    ],
    bullets5: [
      'Spurious Correlation: Variables showing high correlation due to pure coincidence or a shared hidden factor (e.g., ice cream sales and shark attacks both increase during summer).'
    ]
  },
  {
    title: 'Data Leakage',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'a9e90ea7-d657-525d-bbeb-852f76770874',
    type: 'theory',
    bullets1: [
      'Definition: When information from the target variable or test set leaks into the training set during preprocessing or model training.',
      'Symptoms: Extremely high training accuracy but poor generalization performance on test/production data.',
      'Common Causes: Calculating global statistics (mean, variance) before train-test splitting, or including future data in time-series inputs.'
    ],
    bullets2: [
      'Always split datasets into train and test sets *before* performing any preprocessing steps.',
      'Calculate scaling parameters (mean, standard deviation) using only the training set, and apply them to both sets.',
      'Remove features that would not be available at the time of prediction (e.g. customer support logs created *after* churn occurred).'
    ],
    bullets3: [
      'Analogy: Data leakage is like a student getting a sneak peek at the exam questions while studying. They get a perfect score on the practice test but fail to learn the underlying material.'
    ],
    bullets4: [
      'Q: "How do you prevent target leakage?"',
      'A: Analyze features to ensure they represent information available *at the time of prediction*. Remove variables that are updated as a result of the target event occurring.'
    ],
    bullets5: [
      'Time-Series Leakage: Forgetting to use temporal splits. If you randomly split time-series data, the model uses future information to predict past events, which is impossible in production.'
    ]
  },

  // === 11. ML Fundamentals ===
  {
    title: 'Machine Learning Overview',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '9fa1a0ac-3007-5101-bfa1-3daabb658e40',
    type: 'theory',
    bullets1: [
      'Definition: Algorithmic systems that learn patterns directly from data to make predictions, rather than relying on hardcoded rules.',
      'Types: Supervised (labeled outputs), Unsupervised (unlabeled structure), Reinforcement (feedback loop).',
      'Student Shorthand: Replaces standard programming (`data + rules = answers`) with learning (`data + answers = rules`).'
    ],
    bullets2: [
      'Collect and clean training data.',
      'Select a model architecture and define a cost/loss function.',
      'Optimize parameter weights using algorithms like gradient descent to minimize loss.'
    ],
    bullets3: [
      'Analogy: Standard programming is like baking with a detailed recipe. Machine learning is like trial-and-error baking, adjusting ingredients based on taste tests.'
    ],
    bullets4: [
      'Q: "What is the difference between parametric and non-parametric models?"',
      'A: Parametric models assume a fixed shape for the mapping function (e.g. Linear Regression, defined by weights). Non-parametric models grow in complexity with the size of the training data (e.g. Decision Trees, KNN).'
    ],
    bullets5: [
      'No Free Lunch Theorem: No single machine learning algorithm works best for every problem. The optimal model depends on the dataset size, dimensionality, and noise.'
    ]
  },
  {
    title: 'Bias',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '9fa1a0ac-3007-5101-bfa1-3daabb658e40',
    type: 'math',
    bullets1: [
      'Definition: Error introduced by approximating a complex real-world problem with a simple model.',
      'High Bias: Leads to underfitting. The model is too simple to capture patterns in the training data.',
      'Student Shorthand: The difference between the expected prediction of our model and the true value.'
    ],
    bullets2: [
      'Formula: `Bias[f_hat(x)] = E[f_hat(x)] - f(x)`'
    ],
    bullets3: [
      'Model: In a dartboard model, high bias is throwing a cluster of darts that lands far away from the bullseye.'
    ],
    bullets4: [
      'Using a straight line (linear model) to fit a highly quadratic dataset.',
      'The model has high bias, resulting in large errors on both the training and test sets.'
    ],
    bullets5: [
      'Q: "How do you reduce model bias?"',
      'A: 1. Use more complex model architectures. 2. Engineer more features. 3. Decrease regularization penalties.'
    ]
  },
  {
    title: 'Variance',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '9fa1a0ac-3007-5101-bfa1-3daabb658e40',
    type: 'math',
    bullets1: [
      'Definition: The sensitivity of a model to small fluctuations in the training set.',
      'High Variance: Leads to overfitting. The model learns random noise in the training set rather than the underlying pattern.',
      'Student Shorthand: Measures how much the predictions would change if the model was trained on a different sample of the same data.'
    ],
    bullets2: [
      'Formula: `Variance[f_hat(x)] = E[(f_hat(x) - E[f_hat(x)])^2]`'
    ],
    bullets3: [
      'Model: In a dartboard model, high variance is darts scattered randomly all over the board, showing high sensitivity to throwing conditions.'
    ],
    bullets4: [
      'Fitting a 20-degree polynomial curve to a linear dataset with 10 points.',
      'The curve passes through every training point (zero error) but fluctuates wildly between points, resulting in poor generalization.'
    ],
    bullets5: [
      'Q: "How do you reduce model variance?"',
      'A: 1. Gather more training data. 2. Simplify the model architecture. 3. Increase regularization penalties. 4. Use bagging ensemble methods.'
    ]
  },
  {
    title: 'Underfitting',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '9fa1a0ac-3007-5101-bfa1-3daabb658e40',
    type: 'theory',
    bullets1: [
      'Definition: When a model is too simple to learn the underlying structure of the training data.',
      'Symptoms: High training error and high testing error.',
      'Root Cause: High bias. The model makes strong, incorrect assumptions about the data.'
    ],
    bullets2: [
      'Increase model complexity (e.g. add layers to a neural network, or use polynomial features).',
      'Train for more epochs or reduce regularization penalties.',
      'Engineer better features and inputs.'
    ],
    bullets3: [
      'Analogy: Underfitting is like a student memorizing only one page of a textbook. They perform poorly on both practice quizzes and the final exam.'
    ],
    bullets4: [
      'Q: "What are the common indicators of underfitting?"',
      'A: Training performance is poor, and test performance is also poor, indicating the model failed to capture the training patterns.'
    ],
    bullets5: [
      'Underfitting vs Noise: Sometimes high error is due to pure noise in the labels (irreducible error), which no model can resolve. Verify data quality before increasing model complexity.'
    ]
  },
  {
    title: 'Overfitting',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '9fa1a0ac-3007-5101-bfa1-3daabb658e40',
    type: 'theory',
    bullets1: [
      'Definition: When a model learns the noise and details of the training data to the extent that it negatively impacts generalization.',
      'Symptoms: Low training error but high testing error.',
      'Root Cause: High variance. The model is too flexible and memorizes individual training points.'
    ],
    bullets2: [
      'Introduce regularization penalties (L1/L2 weights decay).',
      'Apply early stopping during training, or use dropout in neural networks.',
      'Reduce model complexity and collect more training data.'
    ],
    bullets3: [
      'Analogy: Overfitting is like a student memorizing the exact answers to a specific practice test. They get a perfect score on the practice test, but fail the final exam because they cannot apply the concepts to new questions.'
    ],
    bullets4: [
      'Q: "How do you identify overfitting from a training curve?"',
      'A: Overfitting is occurring if the training loss continues to decrease while the validation loss stops decreasing and starts to rise.'
    ],
    bullets5: [
      'Overfitting to the validation set: If you tune model hyperparameters repeatedly based on validation performance, the model can overfit the validation set. Always reserve a final test set for independent evaluation.'
    ]
  },
  {
    title: 'Regularization',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '9fa1a0ac-3007-5101-bfa1-3daabb658e40',
    type: 'theory',
    bullets1: [
      'Definition: Adding penalty terms to the loss function to constrain model weights and prevent overfitting.',
      'Types: L1 Regularization (Lasso, pushes weights to exactly 0) and L2 Regularization (Ridge, shrinks weights towards 0).',
      'Student Shorthand: Controls the trade-off between model simplicity and training performance.'
    ],
    bullets2: [
      'Lasso Loss (L1): `L = Loss + λ ∑ |w_i|`, promoting feature sparsity.',
      'Ridge Loss (L2): `L = Loss + λ ∑ w_i^2`, penalizing extreme weights.'
    ],
    bullets3: [
      'Analogy: Regularization acts like a speed limit: it prevents the model from moving too fast and over-reacting to noise in the data.'
    ],
    bullets4: [
      'Q: "Why does L1 regularization lead to feature sparsity?"',
      'A: L1 regularization uses absolute values, creating sharp corners in the constraint boundary. Optimization paths tend to hit these corners along coordinate axes, setting weights to exactly zero.'
    ],
    bullets5: [
      'Elastic Net: Combines L1 and L2 penalties: `L = Loss + r λ ∑ |w_i| + 1-r / 2 λ ∑ w_i^2`. Ideal when features are highly correlated.'
    ]
  },
  {
    title: 'Cross Validation',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '9fa1a0ac-3007-5101-bfa1-3daabb658e40',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Partitioning datasets into multiple folds to evaluate model generalization and prevent validation bias.',
      'K-Fold: Data is split into K equal folds; the model is trained on K-1 folds and tested on the remaining fold, repeating the process K times.',
      'Stratified K-Fold: Ensures each fold preserves class proportions (highly recommended for imbalanced datasets).'
    ],
    code: `from sklearn.model_selection import cross_val_score, KFold\nfrom sklearn.linear_model import LogisticRegression\n# 5-fold cross validation setup\nkf = KFold(n_splits=5, shuffle=True, random_state=42)\nscores = cross_val_score(LogisticRegression(), X, y, cv=kf)\n# scores: array of 5 validation metrics`,
    bullets3: [
      'Line 4-5: Automatically splits the data into 5 folds, trains the model on 4 folds, tests it on the 5th fold, and repeats the process 5 times, returning an array of scores.'
    ],
    bullets4: [
      'Time Complexity: O(K * T) where T is the training time of a single model.',
      'Space Complexity: O(R * C) to store split datasets.'
    ],
    bullets5: [
      'Gotcha: Performing preprocessing (e.g. scaling, PCA) globally before cross-validation leaks information from validation folds into training folds. Wrap steps in a scikit-learn `Pipeline` to prevent this.',
      'Gotcha: For time-series data, K-Fold cross-validation leaks future data into the past. Use `TimeSeriesSplit` (expanding training windows) instead.'
    ]
  },

  // === 12. Supervised Learning ===
  {
    title: 'Linear Regression',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '35892415-4e7c-5cf9-97b4-415f85628266',
    type: 'math',
    bullets1: [
      'Definition: Parametric model that predicts continuous target values using linear combinations of inputs.',
      'Cost Function: Ordinary Least Squares (OLS) minimizes Mean Squared Error (MSE).',
      'Assumptions: Linearity, homoscedasticity (constant variance of residuals), independence, and normality of residuals.'
    ],
    bullets2: [
      'Model Equation: `y_hat = w^T x + b`',
      'OLS Cost: `J(w, b) = 1 / 2N ∑_{i=1}^N (y_i - y_hat_i)^2`',
      'Normal Equation (Closed-form): `w = (X^T X)^{-1} X^T y`'
    ],
    bullets3: [
      'Model: Linear regression fits a flat hyperplane through data coordinates, minimizing the sum of squared vertical distances from points to the hyperplane.'
    ],
    bullets4: [
      'Computing closed-form solution: `w = (X^T X)^{-1} X^T y`.',
      'If features are collinear, `X^T X` is singular (not invertible), causing the closed-form calculation to fail.'
    ],
    bullets5: [
      'Q: "How do you detect multicollinearity in linear regression?"',
      'A: Calculate Variance Inflation Factors (VIF). A VIF > 5 or 10 indicates high multicollinearity, meaning you should drop or merge correlated features.'
    ]
  },
  {
    title: 'Logistic Regression',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '35892415-4e7c-5cf9-97b4-415f85628266',
    type: 'math',
    bullets1: [
      'Definition: Linear model for binary classification that outputs probabilities using the sigmoid function.',
      'Decision Boundary: The boundary is linear: the model outputs 1 if probability `≥ 0.5`, which occurs when `w^T x + b ≥ 0`.',
      'Cost Function: Log Loss (Binary Cross-Entropy) because MSE is non-convex for logistic outputs.'
    ],
    bullets2: [
      'Sigmoid Function: `σ(z) = (1) / (1 + e^{-z)}`',
      'Probability: `P(y=1 | x) = σ(w^T x + b)`',
      'Log Loss Cost: `J(w, b) = -1 / N ∑ [y_i log(y_hat_i) + (1-y_i) log(1-y_hat_i)]`'
    ],
    bullets3: [
      'Model: Logistic regression projects data onto a linear line, then squashes the output through an S-shaped curve (sigmoid) to map it to a [0, 1] range.'
    ],
    bullets4: [
      'If `z = w^T x + b = 0`, probability is `σ(0) = 0.5` (exactly on the decision boundary).',
      'If `z = 2`, probability is `σ(2) = (1) / (1 + e^{-2)} ≈ 0.88`.'
    ],
    bullets5: [
      'Q: "Why can\'t we use Mean Squared Error as the cost function for Logistic Regression?"',
      'A: Combining MSE with the non-linear sigmoid function results in a non-convex cost surface with many local minima. Gradient descent can get trapped in these local minima. Log Loss ensures a convex cost surface.'
    ]
  },
  {
    title: 'KNN',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '35892415-4e7c-5cf9-97b4-415f85628266',
    type: 'theory',
    bullets1: [
      'Definition: Lazy, non-parametric instance-based algorithm that classifies a query point based on the majority vote of its `K` nearest neighbors.',
      'Distance Metrics: Typically uses Euclidean distance (L2 norm) or Manhattan distance (L1 norm).',
      'Curse of Dimensionality: Performance degrades in high dimensions because distances between points compress and become uniform.'
    ],
    bullets2: [
      'Calculate the distance between the query point and all training points.',
      'Sort points by distance and select the top `K` nearest neighbors.',
      'Return the majority class (classification) or average target value (regression) of these `K` points.'
    ],
    bullets3: [
      'Analogy: Birds of a feather flock together: the class of a point is determined by the classes of the points closest to it.'
    ],
    bullets4: [
      'Q: "How does selecting `K` impact the model?"',
      'A: Small `K` values (e.g. `K=1`) lead to low bias but high variance (overfitting, sensitive to noise). Large `K` values smooth out boundaries, leading to low variance but high bias (underfitting).'
    ],
    bullets5: [
      'Lazy Learner: KNN has zero training phase cost. However, testing is computationally expensive (`O(N)`) because it must calculate distances to all training points for every query.'
    ]
  },
  {
    title: 'Decision Trees',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '35892415-4e7c-5cf9-97b4-415f85628266',
    type: 'math',
    bullets1: [
      'Definition: Non-parametric supervised model that recursively splits datasets based on feature thresholds.',
      'Splitting Criteria: Classification: Gini Impurity or Entropy (Information Gain). Regression: Variance reduction (MSE).',
      'High Variance: Prone to overfitting if allowed to grow to maximum depth without constraints.'
    ],
    bullets2: [
      'Gini Impurity: `I_G(p) = 1 - ∑ p_i^2`',
      'Entropy: `H(p) = -∑ p_i log_2(p_i)`',
      'Information Gain: `IG(T, a) = H(T) - H(T | a)`'
    ],
    bullets3: [
      'Model: Decision trees divide the input feature space into orthogonal rectangular regions (axis-aligned splits).'
    ],
    bullets4: [
      'A dataset contains 4 positive and 4 negative classes. Total entropy is `H(T) = -0.5 log_2(0.5) - 0.5 log_2(0.5) = 1`.',
      'A split separates the data into a pure positive group (4 points, entropy 0) and a pure negative group (4 points, entropy 0). Information Gain is `1 - 0 = 1` (perfect split).'
    ],
    bullets5: [
      'Q: "How do you control overfitting in decision trees?"',
      'A: 1. Set maximum depth (`max_depth`). 2. Require a minimum number of samples per split (`min_samples_split`). 3. Apply post-pruning techniques like Cost Complexity Pruning.'
    ]
  },
  {
    title: 'SVM',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '35892415-4e7c-5cf9-97b4-415f85628266',
    type: 'math',
    bullets1: [
      'Definition: Supervised classifier that finds the optimal separating hyperplane maximizing the margin between classes.',
      'Kernel Trick: Projects non-linearly separable data into higher dimensions where it becomes linearly separable.',
      'Support Vectors: The data points that lie closest to the decision boundary and define the separating hyperplane.'
    ],
    bullets2: [
      'Primal Optimization: `\\min_{w, b} 1 / 2 \\|w\\|^2` subject to `y_i(w^T x_i + b) ≥ 1`',
      'RBF Kernel Function: `K(x, x\') = \exp(-γ \\|x - x\'\\|^2)`'
    ],
    bullets3: [
      'Model: SVM places a separating wall between two classes, pushing the wall as far as possible from the nearest data points of both classes.'
    ],
    bullets4: [
      'Linear SVM finds decision boundary weights. Points on the margin boundaries satisfy `w^T x_i + b = ± 1`.',
      'The margin width is given by `2 / \\|w\\|`, so minimizing `\\|w\\|^2` maximizes the margin.'
    ],
    bullets5: [
      'Q: "What are the C and gamma parameters in an RBF SVM?"',
      'A: C controls the tradeoff between margin width and classification errors: large C penalizes errors heavily (narrower margin, risk of overfitting). Gamma controls the radius of influence of support vectors: large gamma creates localized decision boundaries (overfitting).'
    ]
  },
  {
    title: 'Naive Bayes',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '35892415-4e7c-5cf9-97b4-415f85628266',
    type: 'math',
    bullets1: [
      'Definition: Classifier based on Bayes Theorem that assumes conditional independence between features given the class label.',
      'Naive Assumption: Assumes the presence of one feature does not affect the presence of another, given the target class.',
      'Shorthand: Fast to train, highly effective for high-dimensional text classification (e.g. spam detection).'
    ],
    bullets2: [
      'Classification Rule: `y_hat = \\arg\\max_c P(y=c) ∏_{i=1}^D P(x_i | y=c)`',
      'Laplace Smoothing: `P(x_i | y=c) = (count(x_i, c) + α) / (count(c) + α D)`'
    ],
    bullets3: [
      'Model: Multiplies probability scores along the features dimension to determine which class is more likely.'
    ],
    bullets4: [
      'Predicting spam: A new email contains the word "Winner" (which appeared in 5/10 spam emails and 0/10 non-spam emails).',
      'Without smoothing, `P("Winner" | Non-Spam) = 0`, causing the entire joint probability to collapse to 0. Laplace smoothing (adding `α=1` to counts) prevents this.'
    ],
    bullets5: [
      'Q: "Why is the Naive Bayes assumption called naive?"',
      'A: Because real-world features are rarely independent (e.g. in text, the word "machine" is highly likely to be followed by "learning"). Despite this incorrect assumption, the model performs surprisingly well in practice.'
    ]
  },

  // === 13. Unsupervised Learning ===
  {
    title: 'Clustering',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'd104d670-6ef0-52af-9b1b-d5317913915c',
    type: 'theory',
    bullets1: [
      'Definition: Grouping unlabeled data points so that points in the same group are similar, and points in different groups are distinct.',
      'Types: Partitioning (K-Means), Hierarchical (Agglomerative), Density-Based (DBSCAN).',
      'Validation: Internal validation metrics (Silhouette score) and external validation metrics (Adjusted Rand Index).'
    ],
    bullets2: [
      'Choose a similarity/distance metric (e.g. Euclidean distance).',
      'Group data points iteratively to optimize cluster tightness (compactness).',
      'Evaluate cluster quality and cohesion.'
    ],
    bullets3: [
      'Analogy: Clustering is like sorting a pile of unsorted clothes into separate piles: shirts, pants, and socks.'
    ],
    bullets4: [
      'Q: "How do you evaluate clustering quality without labels?"',
      'A: Use the Silhouette Coefficient: `s = (b - a) / (\\max(a, b))` where `a` is intra-cluster distance and `b` is nearest-cluster distance. Scores close to 1 indicate well-separated, compact clusters.'
    ],
    bullets5: [
      'Sensitive to scaling: Feature scale impacts distance calculations. Always scale features prior to clustering.'
    ]
  },
  {
    title: 'K Means',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'd104d670-6ef0-52af-9b1b-d5317913915c',
    type: 'math',
    bullets1: [
      'Definition: Centroid-based partitioning algorithm that splits data into `K` non-overlapping clusters.',
      'Initialization: Choosing initial centroids. Standard K-Means is sensitive to initialization; `K-Means++` resolves this by placing initial centroids far apart.',
      'Limitations: Struggles with non-spherical shapes, outliers, and varying densities.'
    ],
    bullets2: [
      'Objective Function: Minimize Within-Cluster Sum of Squares (WCSS): `J = ∑_{j=1}^K ∑_{x ∈ C_j} \\|x - μ_j\\|^2`.',
      'Step 1: Assign each point to the closest centroid (Voronoi iteration).',
      'Step 2: Update centroids by calculating the mean of all assigned points. Repeat until convergence.'
    ],
    bullets3: [
      'Model: K-Means partitions space into Voronoi cells where each cell boundaries are equidistant from the centroid.'
    ],
    bullets4: [
      'Selecting optimal K: Plot WCSS values for different K values. Identify the "elbow" point where the rate of decrease in WCSS slows down.'
    ],
    bullets5: [
      'Q: "Why does standard K-Means converge to local minima?"',
      'A: Because the assignment-update optimization step is coordinate descent, which is greedy. Running multiple initializations (`n_init`) decreases the risk of getting trapped in a poor local minimum.'
    ]
  },
  {
    title: 'Hierarchical Clustering',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'd104d670-6ef0-52af-9b1b-d5317913915c',
    type: 'theory',
    bullets1: [
      'Definition: Clustering algorithm that builds a tree of clusters (dendrogram) using bottom-up (agglomerative) or top-down (divisive) splits.',
      'Linkage Criteria: Single linkage (minimum distance between points), Complete linkage (maximum distance), Average linkage, or Ward linkage (minimizes variance increase).',
      'Student Shorthand: The dendrogram allows you to choose the number of clusters after running the algorithm.'
    ],
    bullets2: [
      'Treat every data point as an individual cluster.',
      'Find the two closest clusters and merge them.',
      'Repeat until all points are merged into a single cluster. Cut the dendrogram at the desired height to extract clusters.'
    ],
    bullets3: [
      'Analogy: Hierarchical clustering is like building a family tree: individuals form couples, couples form families, families form clans, and clans form the entire population.'
    ],
    bullets4: [
      'Q: "What are the computational limits of hierarchical clustering?"',
      'A: High computational complexity: Time complexity is `O(N^3)` (or `O(N^2)` optimized) and space complexity is `O(N^2)` to store the distance matrix. This makes it unsuitable for large datasets.'
    ],
    bullets5: [
      'Chaining Effect: A drawback of single linkage where clusters get pulled together into a long chain because of intermediate noise points between them.'
    ]
  },
  {
    title: 'DBSCAN',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'd104d670-6ef0-52af-9b1b-d5317913915c',
    type: 'theory',
    bullets1: [
      'Definition: Density-Based Spatial Clustering of Applications with Noise. Groups points in dense regions and flags sparse points as outliers.',
      'Hyperparameters: `eps` (search radius) and `minSamples` (minimum points required within the radius).',
      'Point Types: Core points (sufficient neighbors), Border points (reachable from core), Noise points (outliers).'
    ],
    bullets2: [
      'For each point, count neighbors within radius `eps`. If counts `≥` `minSamples`, flag as a Core point.',
      'Connect core points within `eps` distance to form density-reachable clusters.',
      'Assign border points to clusters, and flag remaining points as Noise.'
    ],
    bullets3: [
      'Analogy: DBSCAN is like locating crowded party groups: core members are in the center, friends on the edge are border members, and isolated individuals in empty space are noise.'
    ],
    bullets4: [
      'Q: "What are the main advantages of DBSCAN over K-Means?"',
      'A: 1. You do not need to specify the number of clusters (K) in advance. 2. It can identify arbitrary, non-spherical cluster shapes. 3. It natively filters out noise and outliers.'
    ],
    bullets5: [
      'Struggles with varying densities: If the dataset contains clusters of different densities, a single `eps` value cannot capture them all. Use OPTICS instead.'
    ]
  },
  {
    title: 'PCA',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'd104d670-6ef0-52af-9b1b-d5317913915c',
    type: 'math',
    bullets1: [
      'Definition: Unsupervised dimensionality reduction technique that projects high-dimensional data onto orthogonal axes of maximum variance.',
      'Principal Components: The eigenvectors of the covariance matrix, ordered by their corresponding eigenvalues.',
      'Multicollinearity: PCA eliminates multicollinearity because the principal components are orthogonal (uncorrelated).'
    ],
    bullets2: [
      'Mean-center the data: `X_c = X - μ`.',
      'Calculate the covariance matrix: `C = 1 / N X_c^T X_c`.',
      'Compute eigenvectors and eigenvalues of `C`. Select the top `k` eigenvectors to form the projection matrix `W`. Project data: `Z = X_c W`.'
    ],
    bullets3: [
      'Model: PCA projects data points onto the line/plane that minimizes the sum of squared reconstruction errors.'
    ],
    bullets4: [
      'If covariance matrix `C` has eigenvalues `λ_1 = 80` and `λ_2 = 20`:',
      'The first principal component captures `80 / 80+20 = 80%` of total dataset variance.'
    ],
    bullets5: [
      'Q: "Why is mean-centering mandatory before running PCA?"',
      'A: If data is not mean-centered, the first principal component will point in the direction of the dataset mean vector instead of the direction of maximum variance.'
    ]
  },

  // === 14. Model Evaluation ===
  {
    title: 'Confusion Matrix',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '8e657ab3-e8f5-5b69-90be-2fed65907b78',
    type: 'theory',
    bullets1: [
      'Definition: A tabular layout displaying classifier predictions against true outcomes.',
      'Terms: True Positive (TP), True Negative (TN), False Positive (FP, Type I error), False Negative (FN, Type II error).',
      'Student Shorthand: The diagonal represents correct predictions; off-diagonal elements are prediction errors.'
    ],
    bullets2: [
      'Row indices represent true classes (Actual 1, Actual 0).',
      'Column indices represent predicted classes (Predicted 1, Predicted 0).',
      'Populate cells by matching actual vs. predicted values for all data points.'
    ],
    bullets3: [
      'Analogy: A scoreboard that separates correct calls from incorrect calls, showing exactly where mistakes were made.'
    ],
    bullets4: [
      'Q: "How does confusion matrix change with class imbalance?"',
      'A: With class imbalance (e.g. fraud detection), the TN count is massive, masking high rates of FN errors. Focus on precision and recall instead of raw accuracy.'
    ],
    bullets5: [
      'Accuracy: Total correct predictions divided by all predictions: `ACC = (TP + TN) / (TP + TN + FP + FN)`. Can be highly misleading in imbalanced datasets.'
    ]
  },
  {
    title: 'Precision',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '8e657ab3-e8f5-5b69-90be-2fed65907b78',
    type: 'math',
    bullets1: [
      'Definition: The ratio of correctly predicted positive observations to the total predicted positive observations.',
      'Use Case: Critical when the cost of a False Positive is high (e.g. spam filters where flag-as-spam must not catch important emails).',
      'Student Shorthand: Out of all instances predicted as positive, how many were actually positive?'
    ],
    bullets2: [
      'Formula: `Precision = (TP) / (TP + FP)`'
    ],
    bullets3: [
      'Model: The fraction of the predicted positive region that overlaps with actual positive points.'
    ],
    bullets4: [
      'A model predicts 10 emails as spam. 8 are actually spam, 2 are legitimate (False Positives).',
      '`Precision = 8 / 8+2 = 0.80`.'
    ],
    bullets5: [
      'Q: "How do you increase precision?"',
      'A: Increase the decision threshold (e.g. from 0.5 to 0.8). The model becomes more conservative, making fewer positive predictions but with higher confidence.'
    ]
  },
  {
    title: 'Recall',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '8e657ab3-e8f5-5b69-90be-2fed65907b78',
    type: 'math',
    bullets1: [
      'Definition: The ratio of correctly predicted positive observations to all actual positive observations.',
      'Use Case: Critical when the cost of a False Negative is high (e.g. cancer detection, where missing a positive case is catastrophic).',
      'Student Shorthand: Out of all actual positive instances, how many did the model identify?'
    ],
    bullets2: [
      'Formula: `Recall = (TP) / (TP + FN)`'
    ],
    bullets3: [
      'Model: The fraction of the actual positive points that overlap with predicted positive regions.'
    ],
    bullets4: [
      'A patient cohort has 10 actual cancer cases. The model identifies 7 cases, missing 3 (False Negatives).',
      '`Recall = 7 / 7+3 = 0.70`.'
    ],
    bullets5: [
      'Q: "How do you increase recall?"',
      'A: Lower the decision threshold (e.g. from 0.5 to 0.2). The model becomes more sensitive, making more positive predictions and reducing False Negatives.'
    ]
  },
  {
    title: 'F1 Score',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '8e657ab3-e8f5-5b69-90be-2fed65907b78',
    type: 'math',
    bullets1: [
      'Definition: The harmonic mean of precision and recall, providing a single evaluation metric.',
      'Why Harmonic Mean: Penalizes extreme differences between precision and recall, unlike the arithmetic mean.',
      'Student Shorthand: A robust metric for imbalanced classification tasks.'
    ],
    bullets2: [
      'Formula: `F_1 = 2 * (Precision * Recall) / (Precision + Recall) = (2TP) / (2TP + FP + FN)`'
    ],
    bullets3: [
      'Model: F1-score falls to 0 if either precision or recall is 0, requiring both metrics to be high to get a high score.'
    ],
    bullets4: [
      'If a classifier has Precision = 0.9 and Recall = 0.1:',
      'Arithmetic mean is `0.9+0.1 / 2 = 0.5`.',
      'Harmonic mean (F1) is `2 * 0.09 / 1.0 = 0.18` (reflecting poor performance).'
    ],
    bullets5: [
      'F-beta Score: Generalizes F1 to weigh precision or recall higher: `F_β = (1+β^2) (Precision * Recall) / (β^2 Precision + Recall)`. `β=2` weighs recall twice as high; `β=0.5` weighs precision twice as high.'
    ]
  },
  {
    title: 'ROC Curve',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '8e657ab3-e8f5-5b69-90be-2fed65907b78',
    type: 'theory',
    bullets1: [
      'Definition: Receiver Operating Characteristic curve. A graphical plot of True Positive Rate (TPR, Recall) vs False Positive Rate (FPR) across all classification thresholds.',
      'FPR: The fraction of actual negative instances that are incorrectly predicted as positive: `FPR = (FP) / (TN + FP)`.',
      'Student Shorthand: Evaluates classifier performance across all threshold settings.'
    ],
    bullets2: [
      'Calculate predictions for the dataset.',
      'Sort predictions by probability and step through threshold values from 1.0 down to 0.0.',
      'Calculate and plot TPR and FPR coordinates at each step.'
    ],
    bullets3: [
      'Analogy: A diagnostic dial: turning the dial makes the test more sensitive (higher TPR) but increases false alarms (higher FPR).'
    ],
    bullets4: [
      'Q: "What does the diagonal line represent on an ROC curve?"',
      'A: The diagonal line represents a random classifier (no predictive power). The closer the curve is to the top-left corner, the better the model.'
    ],
    bullets5: [
      'Threshold independence: ROC curves evaluate ranking quality, meaning they remain unchanged even if the dataset class balance shifts.'
    ]
  },
  {
    title: 'AUC',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '8e657ab3-e8f5-5b69-90be-2fed65907b78',
    type: 'math',
    bullets1: [
      'Definition: Area Under the ROC Curve. Measures the probability that a classifier will rank a randomly chosen positive instance higher than a randomly chosen negative instance.',
      'Range: Bound between 0.5 (random guess) and 1.0 (perfect classifier).',
      'Interpretation: Higher AUC scores indicate better model separation capability.'
    ],
    bullets2: [
      'Formula: `AUC = ∫_0^1 TPR(FPR) d(FPR)`'
    ],
    bullets3: [
      'Model: AUC measures the area under the ROC curve on the [0,1] grid.'
    ],
    bullets4: [
      'An AUC score of 0.85 indicates there is an 85% chance the model will assign a higher probability score to a true positive instance than a true negative instance.'
    ],
    bullets5: [
      'Q: "When does AUC fail as an evaluation metric?"',
      'A: With extreme class imbalance (e.g. 1 positive in 10,000 negatives), the FPR denominator (`TN+FP`) is dominated by TN. A model can make many false positive errors while maintaining a low FPR and high AUC. Use Precision-Recall AUC (PR-AUC) instead.'
    ]
  }
];
