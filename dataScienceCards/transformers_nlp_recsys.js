module.exports = [
  // === 21. Transformers ===
  {
    title: 'Attention Mechanism',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0a1424a2-50be-5030-a4a2-1b2a79ee917a',
    type: 'theory',
    bullets1: [
      'Definition: Dynamic scoring mechanism that allows models to focus on specific parts of the input sequence when generating output tokens.',
      'Shorthand: Originally developed for seq2seq translation to replace the fixed-size bottleneck vector with dynamically weighted source vectors.',
      'Alignment Score: Measures the relevance of source word `i` to target word `j`.'
    ],
    bullets2: [
      'Calculate alignment scores matching decoder hidden states against all encoder hidden states.',
      'Normalize scores using the Softmax function to generate attention weights.',
      'Compute a weighted sum of encoder hidden states to form the context vector, and pass it to the decoder.'
    ],
    bullets3: [
      'Analogy: Looking at a photo and focusing your eyes on the main subject while ignoring the background.'
    ],
    bullets4: [
      'Q: "How does Bahdanau (Additive) attention differ from Luong (Multiplicative) attention?"',
      'A: Bahdanau attention calculates scores using a single-layer MLP: `v_a^T tanh(W_a [s, h])`. Luong attention uses matrix dot products: `s^T W_a h`, which is computationally faster.'
    ],
    bullets5: [
      'Bottleneck elimination: Standard encoders compress sequences into a single vector, losing early information. Attention allows the decoder to look at all source states directly.'
    ]
  },
  {
    title: 'Self Attention',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0a1424a2-50be-5030-a4a2-1b2a79ee917a',
    type: 'math',
    bullets1: [
      'Definition: Attention mechanism matching words within the same sequence to compute representations of that sequence.',
      'Vectors: Queries (`Q`), Keys (`K`), and Values (`V`). Projecting token embeddings into query, key, and value spaces.',
      'Scaled Dot-Product: Dividing dot products by `√(d_k)` to prevent gradients from vanishing in Softmax.'
    ],
    bullets2: [
      'Formula: `Attention(Q, K, V) = softmax(Q K^T) / (√(d_k)) V`'
    ],
    bullets3: [
      'Model: Self-attention calculates a lookup table matching each word against all other words in the sentence to build context.'
    ],
    bullets4: [
      'For the sentence "The bank of the river": self-attention links "bank" with "river", resolving semantic ambiguity (water bank vs financial bank).'
    ],
    bullets5: [
      'Q: "Why do we scale the dot product by `1 / √(d_k)`?"',
      'A: For large dimension sizes (`d_k`), dot products grow large, pushing the Softmax function into regions with tiny gradients. Scaling by `√(d_k)` keeps variance stable and prevents vanishing gradients during training.'
    ]
  },
  {
    title: 'Multi Head Attention',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0a1424a2-50be-5030-a4a2-1b2a79ee917a',
    type: 'math',
    bullets1: [
      'Definition: Running multiple self-attention operations (heads) in parallel, allowing the model to attend to information from different representation subspaces.',
      'Parallelism: Queries, keys, and values are split and projected into smaller dimensions.',
      'Aggregation: Outputs from all heads are concatenated and projected back to the original dimension.'
    ],
    bullets2: [
      'Formula: `MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O`',
      'Head Equation: `head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V)`'
    ],
    bullets3: [
      'Model: Multiple heads act like different observers: one head tracks subject-verb relations, another tracks adjectives, and another tracks coreferences.'
    ],
    bullets4: [
      'If dimension `d_{model} = 512` and heads `h = 8`, each head operates on a projected dimension size of `512 / 8 = 64`.'
    ],
    bullets5: [
      'Q: "Why is Multi-Head Attention better than Single-Head Attention?"',
      'A: A single head averages attention across all words, which can dilute important signals. Multi-head attention allows the model to attend to multiple relationships simultaneously.'
    ]
  },
  {
    title: 'Positional Encoding',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0a1424a2-50be-5030-a4a2-1b2a79ee917a',
    type: 'math',
    bullets1: [
      'Definition: Adding vector representations to input embeddings to convey word order information.',
      'Order: Unlike RNNs (which process sequentially), Transformers process all tokens in parallel, making them permutation-invariant without positional information.',
      'Sine/Cosine: Sinusoidal functions used to generate positional coordinates.'
    ],
    bullets2: [
      'Formula (Even): `PE_{(pos, 2i)} = sin(pos / 10000^{2i/d})`',
      'Formula (Odd): `PE_{(pos, 2i+1)} = cos(pos / 10000^{2i/d})`'
    ],
    bullets3: [
      'Model: Adding wave patterns to embeddings so the model can determine relative distances between words.'
    ],
    bullets4: [
      'Positional encoding values are added directly to token embeddings: `x_{input} = x_{token} + PE`.'
    ],
    bullets5: [
      'Q: "Why are sinusoidal functions used for positional encoding?"',
      'A: Because they allow the model to learn relative position relationships easily: for any fixed offset `k`, `PE_{pos+k}` can be represented as a linear function of `PE_{pos}`, allowing the model to generalize to longer sequences.'
    ]
  },
  {
    title: 'Transformer Architecture',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0a1424a2-50be-5030-a4a2-1b2a79ee917a',
    type: 'theory',
    bullets1: [
      'Definition: Encoder-decoder model architecture based entirely on self-attention mechanisms, bypassing recurrent and convolutional layers.',
      'Encoder: Processes input sequences, generating context vectors.',
      'Decoder: Autoregressively generates output tokens, using masked self-attention and cross-attention.'
    ],
    bullets2: [
      'Input passes through self-attention, layer normalization, residual skip connections, and feed-forward blocks.',
      'Decoder uses masked self-attention to prevent looking at future tokens during training.',
      'Cross-attention maps decoder queries against encoder keys and values.'
    ],
    bullets3: [
      'Analogy: Translating a book: the encoder reads and indexes the entire book, and the decoder writes the translation page-by-page, referring to the index.'
    ],
    bullets4: [
      'Q: "Why is layer normalization preferred over batch normalization in Transformers?"',
      'A: Batch normalization normalizes across the batch dimension, which fails with variable sequence lengths. Layer normalization normalizes across features within each token individually, making it sequence-length independent.'
    ],
    bullets5: [
      'Complexity limit: Self-attention has quadratic complexity: `O(N^2)` where `N` is the sequence length. This makes it computationally expensive for long contexts.'
    ]
  },
  {
    title: 'BERT',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0a1424a2-50be-5030-a4a2-1b2a79ee917a',
    type: 'theory',
    bullets1: [
      'Definition: Bidirectional Encoder Representations from Transformers. Encoder-only model trained to learn contextual representations.',
      'Pre-training tasks: Masked Language Modeling (MLM, predicts masked tokens) and Next Sentence Prediction (NSP).',
      'Bidirectional: Attends to both left and right context in all layers simultaneously.'
    ],
    bullets2: [
      'Mask 15% of input tokens randomly.',
      'Predict these masked tokens based on context vectors generated by self-attention.',
      'Fine-tune the model on downstream tasks (classification, Q&A) by adding a task-specific head.'
    ],
    bullets3: [
      'Analogy: Reading a fill-in-the-blank sentence: you look at words both before and after the blank to guess the missing word.'
    ],
    bullets4: [
      'Q: "How does BERT differ from GPT?"',
      'A: BERT is an encoder-only model that uses bidirectional self-attention to build representation context (ideal for analysis). GPT is a decoder-only model that uses masked, causal self-attention to predict the next token (ideal for text generation).'
    ],
    bullets5: [
      'NSP limitations: Recent architectures (e.g. RoBERTa) proved that the Next Sentence Prediction task was unnecessary and dropping it improved performance.'
    ]
  },
  {
    title: 'GPT',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '0a1424a2-50be-5030-a4a2-1b2a79ee917a',
    type: 'theory',
    bullets1: [
      'Definition: Generative Pre-trained Transformer. Decoder-only model architecture trained to generate text.',
      'Autoregressive: Generates text token-by-token: the output at step `t` becomes the input at step `t+1`.',
      'Causal Masking: Restricts self-attention so tokens can only attend to past tokens in the sequence.'
    ],
    bullets2: [
      'Input text sequence is tokenized and embedded.',
      'Passes through decoder blocks using causal self-attention (masking out future tokens).',
      'Predicts the probability distribution of the next token using a Softmax output layer.'
    ],
    bullets3: [
      'Analogy: Writing a story word-by-word: each word you write depends on what you have already written, without knowing what you will write next.'
    ],
    bullets4: [
      'Q: "Why does GPT use masked self-attention?"',
      'A: To prevent data leakage. During training, the model must learn to predict the next word without seeing future words. Causal masking enforces this constraint.'
    ],
    bullets5: [
      'In-context learning: Large language models (like GPT-3) can perform tasks with zero or few examples in the prompt, without modifying model weights.'
    ]
  },

  // === 22. NLP ===
  {
    title: 'Text Preprocessing',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '73f9186b-48a4-5a48-8655-45fc9b92575e',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Cleaning and preparing raw text data for NLP pipelines.',
      'Steps: Lowercasing, removing punctuation/special characters, stopword removal, and stemming/lemmatization.',
      'Lemmatization vs Stemming: Stemming cuts off suffixes using rules; lemmatization maps words back to their dictionary root (lemma).'
    ],
    code: `import nltk\nfrom nltk.stem import WordNetLemmatizer\nlemmatizer = WordNetLemmatizer()\n# Lemmatizing maps word back to root\nroot_word = lemmatizer.lemmatize("running", pos="v") # "run"\nstop_words = set(nltk.corpus.stopwords.words("english"))`,
    bullets3: [
      'Line 4: Maps "running" to its verb root "run" using semantic dictionary lookups.'
    ],
    bullets4: [
      'Time Complexity: Stemming: O(N) (fast, rule-based) | Lemmatization: O(N * log M) (slower, dictionary lookup).',
      'Space Complexity: O(N) memory allocation.'
    ],
    bullets5: [
      'Common Interview Question: Stopword removal can lose critical context in tasks like sentiment analysis (e.g. removing "not" in "not good" changes the meaning entirely).',
      'Common Interview Question: Stemming can create non-dictionary words (e.g. "universe" becomes "univers"), which hurts semantic representation.'
    ]
  },
  {
    title: 'Tokenization',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '73f9186b-48a4-5a48-8655-45fc9b92575e',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Splitting text sequences into smaller units, called tokens (words, subwords, or characters).',
      'Subword Tokenization: Modern standard for LLMs, balancing vocabulary size and out-of-vocabulary (OOV) errors.',
      'Algorithms: Byte Pair Encoding (BPE), WordPiece, SentencePiece.'
    ],
    code: `from transformers import AutoTokenizer\ntokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")\ntokens = tokenizer.tokenize("Tokenization is awesome!")\n# Output: ['token', '##ization', 'is', 'awesome', '!']`,
    bullets3: [
      'Line 3: Splits unknown or rare words ("Tokenization") into common subwords ("token" and "##ization") to prevent OOV errors.'
    ],
    bullets4: [
      'Time Complexity: O(L) where L is the character length of the string.',
      'Space Complexity: O(T) where T is the number of tokens generated.'
    ],
    bullets5: [
      'Common Interview Question: Different pre-trained models use different tokenization schemes. Always use the specific tokenizer paired with your model.',
      'Common Interview Question: Whitespace tokenization fails with languages that do not use spaces (e.g. Chinese, Japanese).'
    ]
  },
  {
    title: 'Embeddings',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '73f9186b-48a4-5a48-8655-45fc9b92575e',
    type: 'theory',
    bullets1: [
      'Definition: Low-dimensional, continuous vector representations of words or tokens that capture semantic meaning.',
      'Semantic Proximity: Words with similar meanings or contexts map close together in vector space.',
      'Static vs Contextual: Static embeddings (Word2Vec) assign a fixed vector to each word; contextual embeddings (BERT) generate vectors dynamically based on surrounding words.'
    ],
    bullets2: [
      'Map words to unique vocabulary indices.',
      'Lookup high-dimensional vectors in the model embedding weight matrix.',
      'Perform downstream calculations or pass vectors to model layers.'
    ],
    bullets3: [
      'Analogy: Mapping words onto a semantic globe: synonyms (e.g., "huge" and "giant") are placed in the same city, while unrelated words are on different continents.'
    ],
    bullets4: [
      'Q: "How does cosine similarity measure semantic proximity?"',
      'A: Cosine similarity measures the directional alignment of two embedding vectors. Values close to 1 indicate highly similar semantic meaning.'
    ],
    bullets5: [
      'Out of Vocabulary (OOV): Static embedding lookup tables fail if a word is missing from the vocabulary. Subword tokenization solves this.'
    ]
  },
  {
    title: 'Word2Vec',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '73f9186b-48a4-5a48-8655-45fc9b92575e',
    type: 'math',
    bullets1: [
      'Definition: Prediction-based framework to learn static word embeddings using shallow neural networks.',
      'Architectures: Continuous Bag of Words (CBOW, predicts target from context) and Skip-gram (predicts context from target).',
      'Semantic Math: Captures linear relationships: e.g. `v_{King} - v_{Man} + v_{Woman} ≈ v_{Queen}`.'
    ],
    bullets2: [
      'Skip-Gram Objective: Maximize average log probability: `J = 1 / T ∑_{t=1}^T ∑_{-c ≤ j ≤ c, j != 0} log P(w_{t+j} | w_t)`.',
      'Softmax Probability: `P(w_O | w_I) = (expv\'_{w_O / ^T v_{w_I})}{∑_{w} exp(v\'_w{}^T v_{w_I})}`.',
      'Negative Sampling: Speeds up training by replacing the expensive vocabulary sum with a few negative noise samples.'
    ],
    bullets3: [
      'Model: Word2Vec maps words into a dense vector space where spatial directions represent semantic relationships.'
    ],
    bullets4: [
      'Computing softmax over a 100,000-word vocabulary is slow. Negative sampling replaces it with binary logistic regression updates on 5-20 random noise words.'
    ],
    bullets5: [
      'Q: "When is Skip-gram preferred over CBOW?"',
      'A: Skip-gram works better with small datasets and represents rare words more effectively. CBOW is faster to train and shows slightly better accuracy for high-frequency words.'
    ]
  },
  {
    title: 'TF-IDF',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '73f9186b-48a4-5a48-8655-45fc9b92575e',
    type: 'math',
    bullets1: [
      'Definition: Term Frequency-Inverse Document Frequency. Statistical measure evaluating a word\'s relevance to a document in a collection.',
      'TF: Measures word frequency within a document: `TF(t, d) = (count(t, d)) / (total words in d)`.',
      'IDF: Downweights words that appear frequently across all documents (e.g. "the", "is"): `IDF(t, D) = log((N) / (1 + |\\{d ∈ D : t ∈ d\\)|})`.'
    ],
    bullets2: [
      'Formula: `TF-IDF(t, d, D) = TF(t, d) * IDF(t, D)`'
    ],
    bullets3: [
      'Model: TF-IDF scores highlight words that are unique and descriptive of a specific document, helping filter out common noise words.'
    ],
    bullets4: [
      'If a word appears 10 times in a 100-word document, TF = 0.1.',
      'If the word appears in all 1,000 documents in the collection, IDF = `log(1000/1000) = 0`, resulting in a TF-IDF score of 0.'
    ],
    bullets5: [
      'Q: "What are the limitations of TF-IDF?"',
      'A: 1. It lacks semantic understanding (treats synonyms as completely different words). 2. It ignores word order and context. 3. Prone to out-of-vocabulary errors on test data.'
    ]
  },
  {
    title: 'Attention in NLP',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '73f9186b-48a4-5a48-8655-45fc9b92575e',
    type: 'theory',
    bullets1: [
      'Definition: Scoring mechanisms that calculate relevance weights between words to capture contextual relationships.',
      'Seq2Seq: Solved the fixed-length memory bottleneck in encoder-decoder translation pipelines.',
      'Transformers: Replaced recurrence completely, allowing parallel sequence processing.'
    ],
    bullets2: [
      'Map words to Query, Key, and Value vectors.',
      'Compute dot products of Queries and Keys to generate attention weights.',
      'Multiply weights by Value vectors to compute context-aware embeddings.'
    ],
    bullets3: [
      'Analogy: Highlight marker: the model highlights relevant context words while reading, ignoring surrounding filler text.'
    ],
    bullets4: [
      'Q: "How does attention resolve word ambiguity?"',
      'A: By weighting neighboring context words. For example, in "The bank of the river", attention weights the word "river" highly when representing "bank", capturing the correct meaning.'
    ],
    bullets5: [
      'Self-Attention Complexity: Calculating attention weights takes `O(N^2)` computations, which limits sequence lengths in Transformer models.'
    ]
  },

  // === 23. Recommendation Systems ===
  {
    title: 'Content Based Filtering',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '524369d5-9716-5fd0-981e-d8008a93a564',
    type: 'theory',
    bullets1: [
      'Definition: Recommender system that suggests items similar to those a user liked in the past, based on item features.',
      'Features: Uses metadata attributes (e.g. genre, director, actors) or TF-IDF text features.',
      'Cosine Similarity: Standard metric used to compare item feature vectors.'
    ],
    bullets2: [
      'Construct a profile vector for the user based on their past ratings.',
      'Calculate feature vectors for all candidate items.',
      'Recommend items with the highest cosine similarity to the user profile vector.'
    ],
    bullets3: [
      'Analogy: A waiter recommending a dish: "Since you liked our spicy chicken, you will enjoy our spicy beef."'
    ],
    bullets4: [
      'Q: "What is the main limitation of content-based filtering?"',
      'A: Overspecialization: the model only recommends items similar to what the user has already consumed, failing to suggest novel or diverse items.'
    ],
    bullets5: [
      'No Collaborative Data: Does not use ratings or actions from other users, meaning it cannot leverage collective patterns.'
    ]
  },
  {
    title: 'Collaborative Filtering',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '524369d5-9716-5fd0-981e-d8008a93a564',
    type: 'theory',
    bullets1: [
      'Definition: Recommender system that makes predictions based on the preferences of similar users.',
      'Types: User-User (finds similar users) and Item-Item (finds items rated similarly by the same users).',
      'Shorthand: Bypasses the need for item metadata by relying entirely on user rating matrices.'
    ],
    bullets2: [
      'Build a User-Item rating matrix.',
      'Calculate similarity scores between users (or items) using Pearson correlation or cosine similarity.',
      'Predict ratings for unrated items by computing a weighted average of ratings from similar users.'
    ],
    bullets3: [
      'Analogy: Asking friends for recommendations: "Your friends liked this movie, so you might like it too."'
    ],
    bullets4: [
      'Q: "Why is Item-Item collaborative filtering preferred over User-User in production?"',
      'A: 1. Stability: Item ratings change slowly compared to dynamic user preferences. 2. Scalability: The number of items is typically much smaller than the number of users, making similarity calculations cheaper.'
    ],
    bullets5: [
      'Sparsity: Rating matrices are sparse (most users rate `< 1%` of items), which can degrade similarity calculations.'
    ]
  },
  {
    title: 'Matrix Factorization',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '524369d5-9716-5fd0-981e-d8008a93a564',
    type: 'math',
    bullets1: [
      'Definition: Model-based collaborative filtering that decomposes the sparse user-item rating matrix into low-dimensional latent feature matrices.',
      'Latent Factors: Unobserved attributes (e.g. movie genres) learned directly from user ratings.',
      'Optimization: Alternating Least Squares (ALS) or Stochastic Gradient Descent (SGD).'
    ],
    bullets2: [
      'Model Equation: `R_hat_{u, i} = q_i^T p_u` (where `q_i` is item embedding, `p_u` is user embedding).',
      'Regularized Objective: `\\min ∑ (R_{u, i} - q_i^T p_u)^2 + λ (\\|q_i\\|^2 + \\|p_u\\|^2)`.'
    ],
    bullets3: [
      'Model: Matrix factorization projects both users and items into a shared latent space where ratings are dot products.'
    ],
    bullets4: [
      'Decomposing a 10,000 x 1,000 matrix into a 10,000 x K user matrix and a K x 1,000 item matrix (where `K=50` latent features) significantly reduces memory and generalizes predictions.'
    ],
    bullets5: [
      'Q: "How do you handle missing ratings during matrix factorization?"',
      'A: Standard matrix factorization only computes loss on observed ratings, ignoring missing cells in the calculation.'
    ]
  },
  {
    title: 'Cold Start Problem',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '524369d5-9716-5fd0-981e-d8008a93a564',
    type: 'theory',
    bullets1: [
      'Definition: The challenge of making recommendations when new users or items join the system with zero historical rating data.',
      'Types: User Cold Start (no user profile) and Item Cold Start (no item ratings).',
      'Solutions: Using metadata, popular defaults, or active learning questionnaires.'
    ],
    bullets2: [
      'For new users, prompt them to select preferred categories or search queries on signup.',
      'For new items, leverage content-based filtering using item metadata (features) to match them to users.',
      'Use hybrid architectures that combine collaborative and content-based models.'
    ],
    bullets3: [
      'Analogy: Starting a new job: you don\'t know anyone\'s preferences yet, so you start by offering standard defaults.'
    ],
    bullets4: [
      'Q: "How does content-based filtering resolve the item cold start problem?"',
      'A: Because content-based models rely on item metadata features rather than user ratings, they can recommend a new item immediately after it is created.'
    ],
    bullets5: [
      'Exploration vs Exploitation: Using multi-armed bandits to recommend new items to a subset of users to gather initial ratings quickly.'
    ]
  },

  // === 24. Time Series ===
  {
    title: 'Trend',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'f5506a03-d1bd-5dca-b920-a730cb850edc',
    type: 'theory',
    bullets1: [
      'Definition: The long-term upward or downward movement in time-series data.',
      'Identification: Measured using rolling averages or linear regression trends.',
      'Decomposition: Separated from seasonal and residual noise components during time-series decomposition.'
    ],
    bullets2: [
      'Apply time-series decomposition to split components: `Y_t = Trend_t + Seasonality_t + Residuals_t`.',
      'Calculate moving averages to smooth out short-term fluctuations and highlight the trend.',
      'Fit linear regressions against the time variable.'
    ],
    bullets3: [
      'Analogy: The tide of the ocean: it rises or falls steadily over hours, regardless of individual wave ripples.'
    ],
    bullets4: [
      'Q: "How do you detrend a time series?"',
      'A: 1. Subtract the calculated rolling mean. 2. Apply differencing (subtracting previous values: `Y_t - Y_{t-1}`).'
    ],
    bullets5: [
      'Non-linear trends: Trends can be exponential or quadratic. Apply log transformations to linearize exponential trends before modeling.'
    ]
  },
  {
    title: 'Seasonality',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'f5506a03-d1bd-5dca-b920-a730cb850edc',
    type: 'theory',
    bullets1: [
      'Definition: Periodic fluctuations that repeat at regular intervals (e.g. daily, weekly, yearly).',
      'Causes: Driven by calendar cycles or weather patterns (e.g. ice cream sales peaking in summer).',
      'Multiplicative vs Additive: Additive seasonality has constant amplitude; multiplicative seasonality amplitude grows with the trend.'
    ],
    bullets2: [
      'Calculate autocorrelation to identify repeating lag intervals.',
      'Split data by seasonal periods (e.g. monthly averages).',
      'Subtract seasonal averages to deseasonalize the series.'
    ],
    bullets3: [
      'Analogy: Holiday shopping spikes: retail sales peak every December, repeating the same pattern year after year.'
    ],
    bullets4: [
      'Q: "How do you detect seasonality in time-series data?"',
      'A: Use Autocorrelation Function (ACF) plots. Repeating peaks at specific lag intervals (e.g. lag 12 for monthly data) indicate seasonality.'
    ],
    bullets5: [
      'Cyclical vs Seasonal: Seasonal patterns have a fixed, known period (e.g. weekly). Cyclical patterns have variable, unpredictable lengths (e.g. economic recessions).'
    ]
  },
  {
    title: 'Stationarity',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: 'f5506a03-d1bd-5dca-b920-a730cb850edc',
    type: 'math',
    bullets1: [
      'Definition: A time series is stationary if its statistical properties (mean, variance, autocorrelation) do not change over time.',
      'Why it matters: Most time-series models (ARIMA) require data to be stationary to make reliable predictions.',
      'Testing: Verified using the Augmented Dickey-Fuller (ADF) test.'
    ],
    bullets2: [
      'Stationary conditions: Mean is constant over time, variance is constant over time, and covariance depends only on lag interval, not time.'
    ],
    bullets3: [
      'Model: A stationary time series looks like a flat sequence with constant variance, fluctuating around a fixed mean line.'
    ],
    bullets4: [
      'ADF test: Null hypothesis (`H_0`) states the series has a unit root (non-stationary).',
      'If the calculated p-value is `< 0.05`, reject `H_0` and confirm stationarity.'
    ],
    bullets5: [
      'Q: "How do you make a non-stationary time series stationary?"',
      'A: 1. Differencing (subtracting the previous value: `Y_t - Y_{t-1}`) to remove trends. 2. Log transformation to stabilize variance.'
    ]
  },
  {
    title: 'Moving Average',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'f5506a03-d1bd-5dca-b920-a730cb850edc',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Calculating averages of rolling windows to smooth out short-term noise and highlight trends.',
      'Simple Moving Average (SMA): Equal weight to all points in the window.',
      'Exponential Moving Average (EMA): Assigns higher weight to recent data points, reacting faster to changes.'
    ],
    code: `import pandas as pd\n# Simple Moving Average with window 7\nsma = df["sales"].rolling(window=7).mean()\n# Exponential Moving Average\nema = df["sales"].ewm(span=7, adjust=False).mean()`,
    bullets3: [
      'Line 3: Computes the rolling mean over a 7-day window. The first 6 rows return `NaN`.',
      'Line 5: Computes the EMA using exponential decay parameters.'
    ],
    bullets4: [
      'Time Complexity: O(N) where N is the number of data points.',
      'Space Complexity: O(N) memory allocation for the output Series.'
    ],
    bullets5: [
      'Common Interview Question: Moving averages introduce lag. A 30-day moving average reacts slowly to recent market drops, making it lag behind current price actions.',
      'Common Interview Question: The first `W-1` values (where `W` is window size) are null, requiring imputation or drop handling before training models.'
    ]
  },
  {
    title: 'ARIMA Basics',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: 'f5506a03-d1bd-5dca-b920-a730cb850edc',
    type: 'math',
    bullets1: [
      'Definition: AutoRegressive Integrated Moving Average. Classical time-series forecasting model for stationary data.',
      'Hyperparameters: `p` (autoregressive lags), `d` (order of differencing), `q` (moving average lags of error).',
      'Autoregressive (AR): Predicts future values based on past values: `Y_t = c + φ_1 Y_{t-1} + ... + ε_t`.'
    ],
    bullets2: [
      'ARIMA Equation: `Y\'_t = c + ∑_{i=1}^p φ_i Y\'_{t-i} + ε_t + ∑_{j=1}^q θ_j ε_{t-j}` (where `Y\'` is the differenced series)'
    ],
    bullets3: [
      'Model: ARIMA combines past values and past prediction errors to predict the next step in the series.'
    ],
    bullets4: [
      'Identifying `p` and `q`: Analyze ACF (Autocorrelation) and PACF (Partial Autocorrelation) plots. PACF cutoff at lag `p` suggests AR(`p`); ACF cutoff at lag `q` suggests MA(`q`).'
    ],
    bullets5: [
      'Q: "How does SARIMA differ from ARIMA?"',
      'A: SARIMA adds seasonal terms: SARIMA(p,d,q)(P,D,Q)S, allowing the model to handle both standard trends and seasonal cycles with period S.'
    ]
  },

  // === 25. MLOps Basics ===
  {
    title: 'Model Deployment',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '2f28a92b-9a4d-5f1b-bfd2-cbb12ca45a6d',
    type: 'theory',
    bullets1: [
      'Definition: Integrating a trained model into a production environment where it can receive inputs and serve predictions.',
      'Deployment Modes: Batch inference (offline predictions) and Real-time inference (online APIs).',
      'APIs: Typically served using frameworks like FastAPI or Flask wrapped in Docker containers.'
    ],
    bullets2: [
      'Serialize the trained model (e.g. serialize to pickle or ONNX format).',
      'Wrap the model inside an API endpoint (e.g. using FastAPI).',
      'Package dependencies inside a Docker container, and deploy to cloud instances (AWS ECS, Kubernetes).'
    ],
    bullets3: [
      'Analogy: Moving a prototype engine from the design lab into a functional car on the road.'
    ],
    bullets4: [
      'Q: "When is batch inference preferred over real-time inference?"',
      'A: When predictions do not need to be instant (e.g. daily churn updates or weekly recommendations). Batch inference runs offline on schedule, saving API server hosting costs.'
    ],
    bullets5: [
      'Model serialization risks: Loading untrusted pickle files can execute arbitrary malicious code. Use safer alternatives like ONNX or Joblib in production.'
    ]
  },
  {
    title: 'Model Monitoring',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '2f28a92b-9a4d-5f1b-bfd2-cbb12ca45a6d',
    type: 'theory',
    bullets1: [
      'Definition: Tracking model performance, inputs, and predictions in production to detect degradation.',
      'Performance metrics: Monitoring latency, throughput, error rates, and predictive accuracy drift.',
      'Logging: Capturing API request payloads and model outputs for downstream analysis.'
    ],
    bullets2: [
      'Log incoming prediction requests and output predictions.',
      'Join predictions with actual labels when they become available (e.g. after a purchase occurs).',
      'Compute and display accuracy metrics on dashboards.'
    ],
    bullets3: [
      'Analogy: Monitoring a patient\'s heart rate: you track key signals in real-time to detect issues before a crash occurs.'
    ],
    bullets4: [
      'Q: "How do you detect model performance degradation if ground truth labels are delayed?"',
      'A: Monitor feature distributions and prediction distributions instead. If inputs shift, the model performance has likely degraded.'
    ],
    bullets5: [
      'Feedback loops: Automated alerts that trigger retraining jobs if accuracy drops below a set threshold.'
    ]
  },
  {
    title: 'Data Drift',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '2f28a92b-9a4d-5f1b-bfd2-cbb12ca45a6d',
    type: 'theory',
    bullets1: [
      'Definition: When the statistical distribution of input data changes over time, causing model performance to degrade.',
      'Concept Drift: The relationship between inputs and targets changes (e.g. user shopping habits change after a macro-economic shift).',
      'Detection: Statistical tests like Kolmogorov-Smirnov (KS) test or Population Stability Index (PSI).'
    ],
    bullets2: [
      'Store training data distributions as a reference baseline.',
      'Calculate incoming feature statistics periodically in production.',
      'Run statistical tests (e.g. KS test) to compare baseline and production distributions. Flag drift if p-value `< 0.05`.'
    ],
    bullets3: [
      'Analogy: A navigation app map becoming outdated as new roads are built and old roads are closed.'
    ],
    bullets4: [
      'Q: "How do you resolve data drift?"',
      'A: 1. Retrain the model using the latest production data. 2. Update feature preprocessing transformations. 3. Re-evaluate feature selection.'
    ],
    bullets5: [
      'Covariate Shift: A sub-type of data drift where the input distribution `P(X)` changes but the conditional probability `P(Y \mid X)` remains constant.'
    ]
  },
  {
    title: 'ML Pipelines',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '2f28a92b-9a4d-5f1b-bfd2-cbb12ca45a6d',
    type: 'theory',
    bullets1: [
      'Definition: Orchestrating the end-to-end steps of the ML lifecycle: data extraction, preprocessing, training, validation, and deployment.',
      'Orchestrators: Tools like Apache Airflow, Kubeflow, or Prefect.',
      'Reproducibility: Ensures the exact same data splits and preprocessing steps are applied to training and production inputs.'
    ],
    bullets2: [
      'Define steps as a Directed Acyclic Graph (DAG).',
      'Configure dependencies (step B only runs if step A completes successfully).',
      'Schedule and monitor pipeline executions.'
    ],
    bullets3: [
      'Analogy: A clean manufacturing assembly line: raw metal goes in, passes through structured welding stations, and a finished car rolls off the line.'
    ],
    bullets4: [
      'Q: "Why are ML pipelines preferred over manual scripts?"',
      'A: Pipelines automate execution, handle errors/retries gracefully, scale computation resources dynamically, and guarantee reproducibility.'
    ],
    bullets5: [
      'Feature Store: Centralized database (e.g. Feast) that stores engineered features, allowing both training and serving pipelines to access the same feature values.'
    ]
  },
  {
    title: 'Versioning',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '2f28a92b-9a4d-5f1b-bfd2-cbb12ca45a6d',
    type: 'theory',
    bullets1: [
      'Definition: Tracking versions of code, data, and model parameters to ensure reproducibility.',
      'Data Version Control (DVC): Git-like tool designed to track massive dataset files and model weights.',
      'Model Registry: Central database (e.g. MLflow) that stores model binaries, hyperparameters, and evaluation metrics.'
    ],
    bullets2: [
      'Commit code updates to Git.',
      'Store dataset hashes and tracking links using DVC.',
      'Log parameters, metrics, and model binaries in the Model Registry during training.'
    ],
    bullets3: [
      'Analogy: A time-travel system for ML: you can go back to any past experiment and recreate the exact same model with the exact same data.'
    ],
    bullets4: [
      'Q: "Why is Git insufficient for versioning machine learning projects?"',
      'A: Git is designed for text files. Storing massive dataset files (GBs) or binary model weights (MBs/GBs) in Git causes repository bloat and slows down commands.'
    ],
    bullets5: [
      'Model lineage: Tracking the exact code commit, training dataset version, and parameter settings used to build a specific model binary.'
    ]
  }
];
