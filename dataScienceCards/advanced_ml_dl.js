module.exports = [
  // === 15. Feature Engineering ===
  {
    title: 'Feature Selection',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '95aaa23b-e1b8-5425-b116-918f4a6268c4',
    type: 'theory',
    bullets1: [
      'Definition: Selecting a subset of relevant features for model construction.',
      'Methods: Filter methods (statistical checks: ANOVA, Chi-square), Wrapper methods (recursive elimination), Embedded methods (L1 regularization).',
      'Student Shorthand: Bypasses model noise and speeds up training times.'
    ],
    bullets2: [
      'Filter: Evaluate statistical relationship of each input feature against the target.',
      'Wrapper: Train models on subsets and add/remove features sequentially (e.g. forward selection).',
      'Embedded: Fit models that constrain weights (e.g. Lasso) and drop zero-weight features.'
    ],
    bullets3: [
      'Analogy: Feature selection is like picking the best ingredients for a recipe, rather than putting everything in the pantry into the pot.'
    ],
    bullets4: [
      'Q: "How do wrapper methods compare to filter methods?"',
      'A: Wrapper methods evaluate feature subsets using actual model performance. They are more accurate but computationally expensive. Filter methods are model-agnostic and fast.'
    ],
    bullets5: [
      'Variance Thresholding: A simple filter method that drops features with variance below a set threshold (e.g. columns where 99% of values are identical).'
    ]
  },
  {
    title: 'Feature Extraction',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '95aaa23b-e1b8-5425-b116-918f4a6268c4',
    type: 'theory',
    bullets1: [
      'Definition: Transforming raw data into new, lower-dimensional numerical features that contain the original information.',
      'Shorthand: Differs from feature selection (which drops columns); extraction projects data onto new feature dimensions.',
      'Examples: Extracting text embeddings, image edge features, or using dimensionality reduction algorithms.'
    ],
    bullets2: [
      'Map raw features through mathematical functions.',
      'Project coordinates onto lower-dimensional spaces.',
      'Combine multiple correlated columns into single composite indicators.'
    ],
    bullets3: [
      'Analogy: Summarizing a 500-page book into a 5-page outline: you capture the core themes without keeping all the original sentences.'
    ],
    bullets4: [
      'Q: "How does feature extraction help image classification?"',
      'A: Raw pixel arrays are high-dimensional and noisy. Extracting features (e.g. using HOG or CNN layers) captures edges and textures, improving classification performance.'
    ],
    bullets5: [
      'Information loss: Feature extraction techniques (like PCA) reduce dimensions but can lose non-linear patterns. Use t-SNE or UMAP if preserving non-linear structure is vital.'
    ]
  },
  {
    title: 'PCA Feature Transformation',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '95aaa23b-e1b8-5425-b116-918f4a6268c4',
    type: 'theory',
    bullets1: [
      'Definition: Using Principal Component Analysis as a preprocessing step to generate uncorrelated, lower-dimensional inputs.',
      'Multicollinearity: Ideal for linear models because the principal components are orthogonal.',
      'Variance retention: Select components that capture a target percentage (e.g. 95%) of cumulative explained variance.'
    ],
    bullets2: [
      'Fit PCA on the training set to find principal component axes.',
      'Transform both the training and test sets using these axes.',
      'Feed the transformed features into downstream classification or regression models.'
    ],
    bullets3: [
      'Analogy: Taking a 2D photograph of a 3D sculpture from the angle that captures the most detail.'
    ],
    bullets4: [
      'Q: "What are the drawbacks of using PCA in feature engineering?"',
      'A: It ruins model interpretability. The principal components are linear combinations of all original features, making it hard to explain which input variables drive predictions.'
    ],
    bullets5: [
      'Scaling dependency: Features with larger scales will dominate PCA axes. Always standardize features (mean=0, variance=1) before fitting PCA.'
    ]
  },
  {
    title: 'Dimensionality Reduction',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '95aaa23b-e1b8-5425-b116-918f4a6268c4',
    type: 'theory',
    bullets1: [
      'Definition: Reducing the number of input variables in a dataset.',
      'Why it matters: Bypasses the Curse of Dimensionality: in high dimensions, data points become sparse and distance metrics lose separation power.',
      'Common methods: Linear (PCA, LDA) and Non-linear (t-SNE, UMAP, Autoencoders).'
    ],
    bullets2: [
      'Analyze dataset shape and feature correlations.',
      'Select a reduction technique based on linearity (PCA for linear structures, t-SNE for localized clusters).',
      'Project features onto the selected low-dimensional space.'
    ],
    bullets3: [
      'Analogy: Flattening a 3D globe onto a 2D map: you lose some accuracy, but the map is much easier to store and analyze.'
    ],
    bullets4: [
      'Q: "What is t-SNE used for?"',
      'A: t-SNE (t-Distributed Stochastic Neighbor Embedding) is a non-linear dimensionality reduction technique used for high-dimensional data visualization, as it preserves local neighborhoods.'
    ],
    bullets5: [
      't-SNE is strictly for visualization. It is computationally expensive (`O(N^2)`) and does not output a projection function that can be applied to new test data.'
    ]
  },

  // === 16. Ensemble Learning ===
  {
    title: 'Bagging',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'd119adea-9262-555c-8dfa-4587f9100637',
    type: 'theory',
    bullets1: [
      'Definition: Bootstrap Aggregating. Training multiple base estimators in parallel on random subsets of the data with replacement, and averaging their predictions.',
      'Goal: Reduces model variance (overfitting) without increasing bias.',
      'Out-Of-Bag (OOB): Evaluating models on left-out bootstrap samples, bypassing the need for a separate validation set.'
    ],
    bullets2: [
      'Generate `B` bootstrap samples from the training set by sampling with replacement.',
      'Train a separate base model (typically deep decision trees) on each sample in parallel.',
      'Combine predictions: majority vote for classification, average for regression.'
    ],
    bullets3: [
      'Analogy: Asking a jury of 50 people to vote on a verdict. Individual biases cancel out, resulting in a more robust final decision.'
    ],
    bullets4: [
      'Q: "Why does bagging reduce variance?"',
      'A: Averaging predictions from multiple independent, high-variance models reduces the variance of the average by a factor of `B` (if models are uncorrelated).'
    ],
    bullets5: [
      'Base Estimator Choice: Bagging works best with high-variance, unstable base estimators (e.g. unpruned decision trees). It adds no value to low-variance models like linear regression.'
    ]
  },
  {
    title: 'Boosting',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'd119adea-9262-555c-8dfa-4587f9100637',
    type: 'theory',
    bullets1: [
      'Definition: Training base estimators sequentially, where each new estimator focuses on correcting the errors made by previous estimators.',
      'Goal: Reduces model bias (underfitting) and can decrease variance.',
      'Base Estimators: Uses weak learners (e.g. shallow decision trees/decision stumps).'
    ],
    bullets2: [
      'Train a weak learner on the training set.',
      'Calculate prediction errors and adjust sample weights (or fit the next model to the residuals).',
      'Repeat sequentially, combining models using weighted voting.'
    ],
    bullets3: [
      'Analogy: A student studying for an exam: they take a practice test, identify their mistakes, study those specific topics, and repeat the process.'
    ],
    bullets4: [
      'Q: "How does boosting compare to bagging?"',
      'A: Bagging trains models in parallel to reduce variance. Boosting trains models sequentially to reduce bias. Boosting is more accurate but is prone to overfitting if noise is high.'
    ],
    bullets5: [
      'Sensitivity to noise: Since boosting focuses on misclassified points, it can overfit outliers and noise in the labels. Clean datasets before boosting.'
    ]
  },
  {
    title: 'Random Forest',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'd119adea-9262-555c-8dfa-4587f9100637',
    type: 'theory',
    bullets1: [
      'Definition: Ensemble model that combines bagging with random feature selection to decorrelate base decision trees.',
      'Feature Randomness: Each split in a tree is chosen from a random subset of features (typically `√(D)` features).',
      'Student Shorthand: Decorrelating the trees reduces the variance of the average prediction compared to standard bagging.'
    ],
    bullets2: [
      'Create a bootstrap sample of the training set.',
      'Grow a decision tree on the sample. At each split, select a random subset of features to find the best split.',
      'Repeat `B` times and average predictions.'
    ],
    bullets3: [
      'Analogy: Instead of one expert analyzing a problem, you ask a forest of experts who each look at different features of the problem.'
    ],
    bullets4: [
      'Q: "Why does Random Forest select random features at each split?"',
      'A: If a few features are highly predictive, standard bagging trees will all split on those same features, making the trees highly correlated. Selecting random features at each split decorrelates the trees, reducing average variance.'
    ],
    bullets5: [
      'Feature Importance: Calculated by measuring the average decrease in impurity (Gini or entropy) caused by splits on a given feature across all trees.'
    ]
  },
  {
    title: 'XGBoost',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: 'd119adea-9262-555c-8dfa-4587f9100637',
    type: 'theory',
    bullets1: [
      'Definition: Extreme Gradient Boosting. An optimized implementation of gradient boosted decision trees that uses second-order Taylor expansion and regularization.',
      'Regularization: Adds L1/L2 regularization to the loss function to constrain tree complexity.',
      'Speed: Uses parallel split finding, block compression, and cache-aware structures.'
    ],
    bullets2: [
      'Objective Function: Optimize regularized loss: `L^{(t)} ≈ ∑ [g_i f_t(x_i) + 1 / 2 h_i f_t^2(x_i)] + Ω(f_t)`.',
      'Calculate first-order gradient (`g_i`) and second-order gradient (`h_i`, Hessian) of the loss.',
      'Build trees sequentially to fit these gradients, and apply learning rate shrinkage.'
    ],
    bullets3: [
      'Analogy: Standard gradient boosting takes steps downhill. XGBoost calculated the curvature of the hill (second derivative) to take faster, more accurate steps.'
    ],
    bullets4: [
      'Q: "Why is XGBoost faster than standard Gradient Boosting?"',
      'A: 1. Parallel tree construction. 2. Cache-aware data access. 3. Built-in handling of missing values. 4. Column block splitting.'
    ],
    bullets5: [
      'Missing Value Handling: XGBoost automatically learns a default direction (left or right split) for missing values based on which direction reduces training loss.'
    ]
  },
  {
    title: 'AdaBoost',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'd119adea-9262-555c-8dfa-4587f9100637',
    type: 'math',
    bullets1: [
      'Definition: Adaptive Boosting. Sequential ensemble method that adjusts sample weights, increasing weights for misclassified samples.',
      'Weak Learners: Typically uses decision stumps (1-split decision trees).',
      'Final Predictor: A weighted combination of all weak learners.'
    ],
    bullets2: [
      'Initialize sample weights: `D_1(i) = 1 / N`.',
      'Train weak learner, calculate error `ε_t`, and compute estimator weight: `α_t = 1 / 2 \\ln1-ε_t / ε_t`.',
      'Update sample weights: `D_{t+1}(i) = (D_t(i) e^{-α_t y_i h_t(x_i)}) / (Z_t)` (where `Z_t` is a normalization factor).'
    ],
    bullets3: [
      'Model: AdaBoost builds a strong classifier by sequentially adding weak classifiers that focus on the mistakes of their predecessors.'
    ],
    bullets4: [
      'If a weak learner has an error rate of 0.5 (random guess), its weight is `α_t = \\ln(1) = 0`, meaning it has no influence on the final model.'
    ],
    bullets5: [
      'Q: "Why is AdaBoost sensitive to outliers?"',
      'A: Because it increases sample weights exponentially for misclassified points. Outliers are hard to classify, so the model focuses heavily on them, which can degrade generalization.'
    ]
  },

  // === 17. Deep Learning Fundamentals ===
  {
    title: 'Deep Learning Overview',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '0c65e936-b634-5172-8d75-f2078e63758f',
    type: 'theory',
    bullets1: [
      'Definition: Subfield of ML based on artificial neural networks with multiple layers, designed to learn representations from data.',
      'Representation Learning: Bypasses manual feature engineering by learning features directly from raw inputs.',
      'Universal Approximation: A feedforward neural network with a single hidden layer can approximate any continuous function, given non-linear activations.'
    ],
    bullets2: [
      'Pass inputs forward through hidden layers (forward propagation).',
      'Calculate cost by comparing outputs against target labels.',
      'Pass gradients back through the network (backpropagation) and update weights.'
    ],
    bullets3: [
      'Analogy: Deep learning is like processing raw clay through multiple sculpting hands: early layers shape basic structures (edges), and deep layers carve intricate details (faces).'
    ],
    bullets4: [
      'Q: "Why has Deep Learning exploded recently?"',
      'A: 1. Availability of massive labeled datasets. 2. GPU acceleration for parallel matrix math. 3. Algorithmic advances (e.g. ReLU, dropout).'
    ],
    bullets5: [
      'Data dependency: Deep learning models are data-hungry. If training data is small, standard ML models (e.g. Random Forest) often generalize better.'
    ]
  },
  {
    title: 'Perceptron',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '0c65e936-b634-5172-8d75-f2078e63758f',
    type: 'math',
    bullets1: [
      'Definition: The fundamental building block of artificial neural networks, representing a single neuron.',
      'Linear Classifier: Classifies inputs by calculating a weighted sum and applying a step function.',
      'XOR Limit: A single perceptron can only learn linear decision boundaries, making it unable to solve the XOR problem.'
    ],
    bullets2: [
      'Activation Formula: `z = w^T x + b`',
      'Step Output: `y_hat = \\begin{cases} 1 & if z ≥ 0 \\\\ 0 & if z < 0 \\end{cases}`'
    ],
    bullets3: [
      'Model: A perceptron divides space into two halves using a linear decision boundary.'
    ],
    bullets4: [
      'Calculate output for inputs `x = [1, 0]` with weights `w = [2, -1]` and bias `b = -1`:',
      '`z = (1 * 2) + (0 * -1) - 1 = 1 ≥ 0 \\implies y_hat = 1`.'
    ],
    bullets5: [
      'Q: "Why did the XOR problem cause a winter in AI history?"',
      'A: Minsky and Papert proved that a single-layer perceptron cannot learn non-linear boundaries like XOR. The AI community abandoned neural networks until multi-layer networks and backpropagation were introduced.'
    ]
  },
  {
    title: 'Activation Functions',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '0c65e936-b634-5172-8d75-f2078e63758f',
    type: 'theory',
    bullets1: [
      'Definition: Mathematical functions applied to neuron outputs to introduce non-linearity.',
      'Why it matters: Without non-linear activation functions, a multi-layer neural network collapses into a single-layer linear model.',
      'Common functions: Sigmoid (probability), Tanh (centered), ReLU (rectified linear, fast, solves vanishing gradients).'
    ],
    bullets2: [
      'Sigmoid: `σ(z) = (1) / (1 + e^{-z)}`, outputs range [0, 1].',
      'Tanh: `g(z) = tanh(z)`, outputs range [-1, 1].',
      'ReLU: `g(z) = \\max(0, z)`, outputs range [0, \\infty).'
    ],
    bullets3: [
      'Analogy: Activation functions are like light switches with dimmers: they control how much signal is passed to the next layer.'
    ],
    bullets4: [
      'Q: "Why is ReLU preferred over Sigmoid in hidden layers?"',
      'A: Sigmoid saturates at extreme inputs, meaning its derivative approaches 0. This causes vanishing gradients during training. ReLU has a constant derivative of 1 for positive inputs, which speeds up training.'
    ],
    bullets5: [
      'Dying ReLU Problem: Neurons can get trapped in the inactive state (output 0) if weights receive large negative updates. Solve this by using Leaky ReLU: `g(z) = \\max(0.01z, z)`.'
    ]
  },
  {
    title: 'Backpropagation',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0c65e936-b634-5172-8d75-f2078e63758f',
    type: 'math',
    bullets1: [
      'Definition: Algorithmic process to calculate the gradients of the loss function with respect to neural network weights.',
      'Mechanism: The chain rule of calculus applied recursively from the output layer back to the input layer.',
      'Computational: Computes gradients efficiently by caching intermediate derivatives.'
    ],
    bullets2: [
      'Forward pass: Compute activations at each layer and calculate output loss.',
      'Backward pass: Compute error gradients at the output layer: `δ^{[L]} = ∇_a L ⊙ g\'(z^{[L]})`.',
      'Propagate errors back: `δ^{[l]} = (W^{[l+1]T} δ^{[l+1]}) ⊙ g\'(z^{[l]})`, and compute weights gradients: `(\\partial L) / (\\partial W^{[l])} = δ^{[l]} a^{[l-1]T}`.'
    ],
    bullets3: [
      'Model: Backpropagation flows error signals backward through the network, assigning credit or blame to weights for the output error.'
    ],
    bullets4: [
      'Gradient path for single weight: `(\\partial L) / (\\partial w_i) = (\\partial L) / (\\partial a) * (\\partial a) / (\\partial z) * (\\partial z) / (\\partial w_i)`.'
    ],
    bullets5: [
      'Q: "What is the difference between backpropagation and gradient descent?"',
      'A: Backpropagation *calculates* the gradients of the loss function with respect to weights. Gradient descent *uses* these gradients to update the weight values.'
    ]
  },
  {
    title: 'Loss Functions',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '0c65e936-b634-5172-8d75-f2078e63758f',
    type: 'math',
    bullets1: [
      'Definition: Functions that measure the difference between model predictions and true target values.',
      'Regression: Mean Squared Error (MSE, penalizes outliers), Mean Absolute Error (MAE, robust to outliers).',
      'Classification: Binary Cross-Entropy (two classes), Categorical Cross-Entropy (multi-class).'
    ],
    bullets2: [
      'MSE: `L = 1 / N ∑ (y_i - y_hat_i)^2`',
      'Cross-Entropy: `L = -1 / N ∑ ∑ y_{ij} log(y_hat_{ij})`'
    ],
    bullets3: [
      'Model: A loss function defines the optimization landscape: the goal is to navigate to the lowest point of this landscape.'
    ],
    bullets4: [
      'Computing Binary Cross-Entropy: For actual label 1 and prediction 0.9: `L = -[1 log(0.9) + 0] ≈ 0.105`.',
      'If prediction is 0.1: `L = -[1 log(0.1) + 0] ≈ 2.30` (high penalty for incorrect predictions).'
    ],
    bullets5: [
      'Q: "Why is Categorical Cross-Entropy paired with the Softmax activation function?"',
      'A: Softmax normalizes output scores into a probability distribution that sums to 1. Categorical Cross-Entropy then calculates the log loss of this probability distribution.'
    ]
  },

  // === 18. Neural Networks ===
  {
    title: 'Feed Forward Networks',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '1a63c1c3-fffc-59f5-86f5-12b916f27cb5',
    type: 'theory',
    bullets1: [
      'Definition: Multilayer Perceptron (MLP) where connections between nodes do not form cycles.',
      'Information Flow: Information moves strictly forward: from input layer, through hidden layers, to the output layer.',
      'Fully Connected: Each neuron in a layer is connected to all neurons in the next layer.'
    ],
    bullets2: [
      'Input layer receives feature values.',
      'Hidden layers apply linear transformations followed by non-linear activations.',
      'Output layer generates final predictions (Softmax for classification, Linear for regression).'
    ],
    bullets3: [
      'Analogy: An assembly line where each station processes inputs and passes them to the next station, without any feedback loops.'
    ],
    bullets4: [
      'Q: "What are the limitations of Feed Forward Networks?"',
      'A: 1. They do not handle spatial structures (images) well, as flattening inputs loses pixel relationships. 2. They do not process sequential data (text/time-series) well, as they lack temporal memory.'
    ],
    bullets5: [
      'Weight Initialization: Critical to prevent vanishing/exploding gradients on startup. Use Xavier initialization for Sigmoid/Tanh activations, and He initialization for ReLU.'
    ]
  },
  {
    title: 'Hidden Layers',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '1a63c1c3-fffc-59f5-86f5-12b916f27cb5',
    type: 'theory',
    bullets1: [
      'Definition: Intermediate neuron layers positioned between the input and output layers.',
      'Feature Hierarchy: Early hidden layers extract low-level features (e.g. edges); deep hidden layers extract high-level semantic features (e.g. shapes, objects).',
      'Width vs Depth: Width is the number of neurons per layer. Depth is the number of hidden layers.'
    ],
    bullets2: [
      'Receive activations from the previous layer.',
      'Multiply by weights, add bias, and apply activation functions.',
      'Pass the resulting activation vectors to the next layer.'
    ],
    bullets3: [
      'Analogy: Hidden layers act like processing filters in a photo editor: each layer applies a new filter to refine the image features.'
    ],
    bullets4: [
      'Q: "How does hidden layer depth affect model performance?"',
      'A: Deeper networks can learn more complex feature hierarchies with fewer parameters than shallow, wide networks. However, they are harder to train and prone to vanishing gradients.'
    ],
    bullets5: [
      'Sparsity: Using regularization (like L1) or activations (like ReLU) to keep many hidden layer outputs at exactly 0, which reduces memory footprints and acts as feature selection.'
    ]
  },
  {
    title: 'Vanishing Gradients',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '1a63c1c3-fffc-59f5-86f5-12b916f27cb5',
    type: 'theory',
    bullets1: [
      'Definition: When gradients shrink exponentially as they propagate backward through deep layers during backpropagation.',
      'Impact: Early layers receive tiny gradient updates, preventing them from learning and causing training to stall.',
      'Causes: Saturated activation functions (Sigmoid, Tanh) whose derivatives are less than 1.'
    ],
    bullets2: [
      'During backpropagation, weight gradients are computed by multiplying derivatives across layers (Chain Rule).',
      'If activation derivatives are consistently `< 0.25`, multiplying them repeatedly causes the gradient to decay exponentially towards 0.'
    ],
    bullets3: [
      'Analogy: A whisper game: as the message is passed down a long line of people, it gets quieter and quieter until the first person cannot hear anything at all.'
    ],
    bullets4: [
      'Q: "How do you solve the vanishing gradient problem?"',
      'A: 1. Use ReLU activation functions instead of Sigmoid. 2. Use residual connections (skip connections). 3. Apply Batch Normalization. 4. Use proper weight initialization (He/Xavier).'
    ],
    bullets5: [
      'Exploding Gradients: The opposite problem: when gradients grow exponentially because weights are initialized too large, causing training to diverge. Solve using Gradient Clipping.'
    ]
  },
  {
    title: 'Batch Normalization',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '1a63c1c3-fffc-59f5-86f5-12b916f27cb5',
    type: 'math',
    bullets1: [
      'Definition: Normalizing neuron activations within a mini-batch during training to stabilize and speed up training.',
      'Internal Covariate Shift: Reduces shift by stabilizing the distribution of activations across layers.',
      'Shorthand: Placed typically between linear layers and activation functions.'
    ],
    bullets2: [
      'Step 1: Compute batch mean `μ_B = 1 / m ∑ x_i` and variance `σ_B^2 = 1 / m ∑ (x_i - μ_B)^2`.',
      'Step 2: Normalize: `x_hat_i = (x_i - μ_B) / (√(σ_B^2 + ε))`.',
      'Step 3: Scale and shift: `y_i = γ x_hat_i + β` (where `γ` and `β` are learnable parameters).'
    ],
    bullets3: [
      'Model: Batch Norm stabilizes the input range of each layer, keeping activations from drifting too large or small.'
    ],
    bullets4: [
      'During testing, batch mean and variance are not calculated. Instead, the model uses running averages computed during training.'
    ],
    bullets5: [
      'Q: "Why does Batch Normalization act as a regularizer?"',
      'A: Because the mean and variance are calculated over mini-batches, they introduce slight noise into activations, which helps regularize the model and reduces the need for dropout.'
    ]
  },
  {
    title: 'Dropout',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '1a63c1c3-fffc-59f5-86f5-12b916f27cb5',
    type: 'theory',
    bullets1: [
      'Definition: Regularization technique where random neurons are deactivated during training with a probability `p`.',
      'Co-adaptation: Prevents neurons from co-adapting (relying on specific neighboring neurons), forcing them to learn robust features independently.',
      'Test Behavior: Deactivated only during training. During testing, all neurons are active, but weights are scaled by `1-p` to match activation expectations.'
    ],
    bullets2: [
      'Set dropout probability `p` (e.g. 0.5).',
      'During a training step, randomly set the activations of a fraction `p` of hidden neurons to 0.',
      'Scale remaining activations by `1 / 1-p` (inverted dropout) to keep expectations consistent.'
    ],
    bullets3: [
      'Analogy: A sports team training: randomly benching key players forces other players to step up and learn to collaborate, creating a more robust team.'
    ],
    bullets4: [
      'Q: "How does dropout change between training and testing?"',
      'A: Dropout is active only during training to regularize the model. During testing, all neurons are active to generate deterministic predictions, with no dropout masking applied.'
    ],
    bullets5: [
      'Ensemble Effect: Dropout can be viewed as training an ensemble of `2^H` sub-networks (where `H` is the number of hidden units) with shared weights.'
    ]
  },

  // === 19. CNNs ===
  {
    title: 'Convolution',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '18ed4fe7-e8ca-56c1-9aa5-28d6998e6473',
    type: 'math',
    bullets1: [
      'Definition: Mathematical operation where a sliding filter (kernel) is applied to an input matrix to create a feature map.',
      'Feature extraction: Captures local spatial patterns (edges, textures) in images.',
      'Parameter Sharing: The same filter is applied across the entire image, reducing parameter counts.'
    ],
    bullets2: [
      'Formula: `S(i, j) = (I * K)(i, j) = ∑_m ∑_n I(i-m, j-n) K(m, n)`'
    ],
    bullets3: [
      'Model: A sliding window multiplying element-wise and summing values to detect feature matches.'
    ],
    bullets4: [
      'Applying a 3x3 Sobel kernel to detect vertical edges in an input image matrix.',
      'The kernel values are negative on the left, positive on the right. Sliding it over a vertical edge yields high output values, flagging the edge position.'
    ],
    bullets5: [
      'Q: "Why is convolution preferred over fully connected layers for images?"',
      'A: 1. Preserves spatial structure. 2. Translation invariance (detects features regardless of location). 3. Significantly fewer parameters.'
    ]
  },
  {
    title: 'Filters',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '18ed4fe7-e8ca-56c1-9aa5-28d6998e6473',
    type: 'theory',
    bullets1: [
      'Definition: Kernel matrices representing feature detectors in convolutional layers.',
      'Channels: Filters have a depth dimension matching the input channel count (e.g. 3 for RGB images).',
      'Learning: Unlike manual filters (e.g. Sobel, Gabor), CNN filter weights are learned during training.'
    ],
    bullets2: [
      'Initialize filter weights randomly.',
      'Slide the filter over the input channels, calculating element-wise products and summing values across channels.',
      'Update weights using backpropagation to optimize feature extraction.'
    ],
    bullets3: [
      'Analogy: Filters are like specialized lenses: one lens highlights horizontal lines, another highlights vertical lines, and others detect specific colors.'
    ],
    bullets4: [
      'Q: "How does filter depth affect CNNs?"',
      'A: The number of filters in a layer determines the number of output channels (feature maps). Early layers use few filters (e.g. 32); deep layers use many filters (e.g. 512) to detect complex shapes.'
    ],
    bullets5: [
      'Receptive Field: The region in the input space that a specific CNN feature is looking at. Deeper layers have larger receptive fields.'
    ]
  },
  {
    title: 'Padding',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '18ed4fe7-e8ca-56c1-9aa5-28d6998e6473',
    type: 'math',
    bullets1: [
      'Definition: Adding border pixels around an input matrix before applying convolution.',
      'Why it matters: Prevents spatial dimensions from shrinking after every convolution, and preserves edge information.',
      'Types: Valid padding (no padding, shrinks size) and Same padding (adds padding to preserve input dimensions).'
    ],
    bullets2: [
      'Same Padding Formula: `P = (F - 1) / (2)` (where `F` is filter size, assuming stride of 1)'
    ],
    bullets3: [
      'Model: Adding a border of zeros around the image to allow filters to slide over border pixels without falling off the edge.'
    ],
    bullets4: [
      'For a 32x32 input with a 5x5 filter and stride 1:',
      'Without padding (Valid): Output shape is `32 - 5 + 1 = 28 * 28`.',
      'With Same padding: `P = 5-1 / 2 = 2`. Output shape remains 32x32.'
    ],
    bullets5: [
      'Q: "What is zero-padding vs reflection-padding?"',
      'A: Zero-padding fills borders with 0s, which can introduce border artifacts. Reflection-padding copies edge pixel values outward, reducing border artifacts in generative tasks.'
    ]
  },
  {
    title: 'Stride',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '18ed4fe7-e8ca-56c1-9aa5-28d6998e6473',
    type: 'math',
    bullets1: [
      'Definition: The step size (in pixels) by which a filter slides across the input matrix.',
      'Impact: Larger strides reduce output spatial dimensions and decrease computational costs.',
      'Shorthand: A stride of 1 moves the filter by 1 pixel at a time; a stride of 2 moves it by 2 pixels, skipping columns/rows.'
    ],
    bullets2: [
      'Output Dimension Formula: `O = floor( (I - F + 2P) / (S) ) + 1` (where `I` is input, `F` is filter, `P` is padding, `S` is stride)'
    ],
    bullets3: [
      'Model: Stride controls the spacing of filter application points across the image.'
    ],
    bullets4: [
      'For a 7x7 input, 3x3 filter, padding 0, stride 2:',
      '`O = (7 - 3 + 0) / (2) + 1 = 2 + 1 = 3 * 3`.'
    ],
    bullets5: [
      'Q: "When is strided convolution used instead of pooling?"',
      'A: In modern architectures (e.g. ResNet), strided convolutions (with stride=2) are preferred over max pooling to reduce spatial dimensions, as they allow the model to learn its own downsampling parameters.'
    ]
  },
  {
    title: 'Pooling',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '18ed4fe7-e8ca-56c1-9aa5-28d6998e6473',
    type: 'theory',
    bullets1: [
      'Definition: Downsampling operation that reduces the spatial dimensions of feature maps.',
      'Types: Max Pooling (extracts maximum value in window, preserves features) and Average Pooling (calculates average value).',
      'Invariance: Introduces translation invariance, helping the model recognize features even if they shift slightly.'
    ],
    bullets2: [
      'Define pooling window size (typically 2x2) and stride (typically 2).',
      'Slide the window over the feature map.',
      'Select the maximum value (Max Pooling) or compute the average (Average Pooling) within the window.'
    ],
    bullets3: [
      'Analogy: Looking at a map from a distance: you lose minor details but preserve the locations of major cities.'
    ],
    bullets4: [
      'Q: "Why is Max Pooling preferred over Average Pooling for classification?"',
      'A: Because Max Pooling acts as a feature detector: it preserves the strongest activation signal in the region (e.g. presence of an edge), while Average Pooling dilutes it.'
    ],
    bullets5: [
      'Information Loss: Pooling is non-reversible and discards spatial details (like exact coordinates), which can be problematic for tasks like image segmentation. Use stride convolutions instead.'
    ]
  },
  {
    title: 'CNN Architecture',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '18ed4fe7-e8ca-56c1-9aa5-28d6998e6473',
    type: 'theory',
    bullets1: [
      'Definition: End-to-end deep learning model containing alternating convolutional and pooling layers, followed by fully connected layers.',
      'Feature vs Classifier: Convolution/Pooling layers act as the feature extractor; fully connected layers act as the classifier.',
      'Examples: Classic architectures include LeNet, VGG, ResNet, and Inception.'
    ],
    bullets2: [
      'Input image passes through convolutional layers to extract feature maps.',
      'Pooling layers downsample feature maps, reducing spatial resolution while expanding channel depth.',
      'Flatten the final feature map into a 1D vector and pass it through fully connected layers to generate class probabilities.'
    ],
    bullets3: [
      'Analogy: Processing a document: first you scan for keywords (convolutions), summarize key points (pooling), and finally write the conclusion (fully connected layers).'
    ],
    bullets4: [
      'Q: "Why are skip connections used in ResNet?"',
      'A: Skip connections pass activations directly across layers: `y = F(x) + x`. This allows gradients to flow directly through the skip pathway, solving the vanishing gradient problem in very deep networks (e.g. 152 layers).'
    ],
    bullets5: [
      'Receptive field expansion: As you go deeper in a CNN, spatial dimensions shrink, but each remaining pixel represents a larger region of the original input image.'
    ]
  },

  // === 20. RNNs & LSTMs ===
  {
    title: 'RNN Basics',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '6430ed51-816c-5e6d-b23a-457e14b7f651',
    type: 'math',
    bullets1: [
      'Definition: Recurrent Neural Network. A class of neural networks designed for sequential data where connections form feedback loops.',
      'Hidden State (`h_t`): Acts as memory, capturing information from previous time steps: `h_t = f(W_{hh} h_{t-1} + W_{xh} x_t + b)`.',
      'Student Shorthand: Processes sequences step-by-step, sharing weights across time steps.'
    ],
    bullets2: [
      'Hidden State: `h_t = tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)`',
      'Output Equation: `y_t = W_{hy} h_t + b_y`'
    ],
    bullets3: [
      'Model: An RNN can be unfolded into a sequence of identical network cells, sharing the same parameters across time.'
    ],
    bullets4: [
      'Processing a sentence: At step `t`, the input is the current word `x_t` and the hidden state `h_{t-1}` representing the context of previous words.'
    ],
    bullets5: [
      'Q: "Why do standard RNNs struggle with long sequences?"',
      'A: Because they process data step-by-step using recursive multiplication. Over long steps, gradients decay exponentially (vanishing gradients), making the network forget early inputs.'
    ]
  },
  {
    title: 'Vanishing Gradient Problem',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '6430ed51-816c-5e6d-b23a-457e14b7f651',
    type: 'theory',
    bullets1: [
      'Definition: The decay of gradients over time steps during Backpropagation Through Time (BPTT) in RNNs.',
      'BPTT: Unrolling the network over time steps and calculating gradients using the chain rule.',
      'Effect: Weights in early time steps receive tiny updates, causing the model to lose track of long-term dependencies.'
    ],
    bullets2: [
      'Unroll the RNN over `T` time steps.',
      'Calculate output loss at the end of the sequence.',
      'Propagate gradients back through time steps. Recursive multiplication of weight matrices (`W_{hh}`) causes gradients to shrink if eigenvalues of `W_{hh} < 1`.'
    ],
    bullets3: [
      'Analogy: Trying to read a very long paragraph: by the time you reach the end, you have forgotten what was written in the first sentence.'
    ],
    bullets4: [
      'Q: "How do you solve vanishing gradients in RNNs?"',
      'A: 1. Use gated architectures like LSTMs or GRUs. 2. Apply gradient clipping (for exploding gradients). 3. Initialize recurrent weights to the identity matrix.'
    ],
    bullets5: [
      'Exploding Gradients in RNNs: Occurs when eigenvalues of recurrent weights `> 1`, causing gradients to grow exponentially and training to crash. Solve using Gradient Clipping.'
    ]
  },
  {
    title: 'LSTM',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '6430ed51-816c-5e6d-b23a-457e14b7f651',
    type: 'math',
    bullets1: [
      'Definition: Long Short-Term Memory network. A gated RNN architecture designed to learn long-term dependencies by resolving vanishing gradients.',
      'Cell State (`C_t`): The internal memory pipeline that runs straight down the chain, modified only by linear interactions.',
      'Gating Mechanism: Regulates information flow using three gates: Forget gate, Input gate, and Output gate.'
    ],
    bullets2: [
      'Forget Gate: `f_t = σ(W_f [h_{t-1}, x_t] + b_f)` (drops information).',
      'Input Gate: `i_t = σ(W_i [h_{t-1}, x_t] + b_i)` and candidate cell state: `C_tilde_t = tanh(W_c [h_{t-1}, x_t] + b_c)`.',
      'Update Cell State: `C_t = f_t ⊙ C_{t-1} + i_t ⊙ C_tilde_t`.',
      'Output Gate: `o_t = σ(W_o [h_{t-1}, x_t] + b_o)` and hidden state update: `h_t = o_t ⊙ tanh(C_t)`.'
    ],
    bullets3: [
      'Model: The cell state acts like a conveyor belt, with gates acting as valves adding or removing information along the belt.'
    ],
    bullets4: [
      'If forget gate `f_t = 1` and input gate `i_t = 0`, the cell state passes through unchanged: `C_t = C_{t-1}`. This linear connection allows gradients to flow back without exponential decay.'
    ],
    bullets5: [
      'Q: "What are the three gates of an LSTM and their roles?"',
      'A: 1. Forget Gate: decides what information to discard from the cell state. 2. Input Gate: decides what new information to store in the cell state. 3. Output Gate: decides what information from the cell state to output as the hidden state.'
    ]
  },
  {
    title: 'GRU',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '6430ed51-816c-5e6d-b23a-457e14b7f651',
    type: 'math',
    bullets1: [
      'Definition: Gated Recurrent Unit. A simplified variant of the LSTM that merges the cell state and hidden state, and uses two gates.',
      'Gates: Reset gate (determines how to combine new input with past memory) and Update gate (determines how much past memory to keep).',
      'Efficiency: Fewer parameters than LSTM, making it faster to train and less prone to overfitting on small datasets.'
    ],
    bullets2: [
      'Update Gate: `z_t = σ(W_z [h_{t-1}, x_t] + b_z)`',
      'Reset Gate: `r_t = σ(W_r [h_{t-1}, x_t] + b_r)`',
      'Candidate Hidden State: `h_tilde_t = tanh(W [r_t ⊙ h_{t-1}, x_t] + b)`',
      'Hidden State Update: `h_t = (1 - z_t) ⊙ h_{t-1} + z_t ⊙ h_tilde_t`'
    ],
    bullets3: [
      'Model: GRU merges the gating pipelines, using a single update gate to balance old and new activations.'
    ],
    bullets4: [
      'If update gate `z_t ≈ 0`, the hidden state remains unchanged: `h_t ≈ h_{t-1}`. If `z_t ≈ 1`, the hidden state is overwritten by the new candidate state.'
    ],
    bullets5: [
      'Q: "How does a GRU differ from an LSTM?"',
      'A: 1. GRU has 2 gates (Reset, Update); LSTM has 3 gates (Forget, Input, Output). 2. GRU merges cell state and hidden state. 3. GRU is computationally faster and has fewer parameters.'
    ]
  }
];
