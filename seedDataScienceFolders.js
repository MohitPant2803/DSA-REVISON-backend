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

const SUBFOLDERS = [
  { title: 'Python', icon: 'code', color: '#3776AB', description: 'Core Python concepts: collections, comprehensions, OOP, decorators, and generators for interviews.' },
  { title: 'NumPy', icon: 'grid', color: '#013243', description: 'Efficient numerical operations: arrays, broadcasting, vectorization, and reshaping.' },
  { title: 'Pandas', icon: 'table', color: '#150458', description: 'Data structures and manipulation: DataFrames, filtering, grouping, merges, and indexing.' },
  { title: 'Data Visualization', icon: 'bar-chart-2', color: '#E87A5D', description: 'Key plotting libraries (Matplotlib/Seaborn) and chart interpretations: histograms, box plots, heatmaps.' },
  { title: 'Statistics', icon: 'activity', color: '#4CAF50', description: 'Statistical concepts: measures of central tendency, CLT, covariance, correlation, and hypothesis testing.' },
  { title: 'Probability', icon: 'help-circle', color: '#FF9800', description: 'Probability fundamentals: conditional probability, Bayes theorem, distributions, expectation, and variance.' },
  { title: 'Linear Algebra', icon: 'shuffle', color: '#9C27B0', description: 'Linear algebra foundations for ML: matrix math, eigenvectors/eigenvalues, and SVD intuition.' },
  { title: 'Calculus for ML', icon: 'trending-up', color: '#E91E63', description: 'Optimization math: derivatives, gradients, chain rule, and gradient descent mechanics.' },
  { title: 'Data Preprocessing', icon: 'sliders', color: '#00BCD4', description: 'Data cleaning and transformation: scaling, encoding, missing values, outliers, and train-test splits.' },
  { title: 'Exploratory Data Analysis (EDA)', icon: 'search', color: '#3F51B5', description: 'Univariate, bivariate, and correlation analysis workflows to detect data leakage and patterns.' },
  { title: 'Machine Learning Fundamentals', icon: 'layers', color: '#673AB7', description: 'Key concepts: bias-variance tradeoff, overfitting, regularization, and cross-validation.' },
  { title: 'Supervised Learning', icon: 'git-commit', color: '#2196F3', description: 'Predictive algorithms: regressions, KNN, decision trees, Naive Bayes, and SVMs.' },
  { title: 'Unsupervised Learning', icon: 'users', color: '#009688', description: 'Finding hidden structures: K-means, hierarchical clustering, DBSCAN, and PCA.' },
  { title: 'Model Evaluation', icon: 'check-circle', color: '#8BC34A', description: 'Classification and regression metrics: confusion matrix, precision/recall, ROC-AUC, and F1-score.' },
  { title: 'Feature Engineering', icon: 'scissors', color: '#CDDC39', description: 'Transforming inputs: feature selection, extraction, and dimensionality reduction techniques.' },
  { title: 'Ensemble Learning', icon: 'package', color: '#FFC107', description: 'Meta-algorithms: bagging vs. boosting, Random Forests, XGBoost, and AdaBoost.' },
  { title: 'Deep Learning Fundamentals', icon: 'cpu', color: '#FF5722', description: 'Neural network basics: perceptrons, activation functions, backpropagation, and loss functions.' },
  { title: 'Neural Networks', icon: 'share-2', color: '#795548', description: 'Architectures: feedforward networks, hidden layers, vanishing gradients, batch norm, and dropout.' },
  { title: 'CNNs', icon: 'image', color: '#607D8B', description: 'Computer vision layers: convolutions, filters, stride, padding, pooling, and architectures.' },
  { title: 'RNNs & LSTMs', icon: 'repeat', color: '#E040FB', description: 'Sequential data processing: recurrent units, LSTM gates, GRUs, and gradient problems.' },
  { title: 'Transformers', icon: 'zap', color: '#18FFFF', description: 'State-of-the-art architectures: attention mechanisms, self-attention, BERT, and GPT.' },
  { title: 'NLP', icon: 'message-square', color: '#00E676', description: 'Natural Language Processing: tokenization, word embeddings (Word2Vec), and TF-IDF.' },
  { title: 'Recommendation Systems', icon: 'star', color: '#FFD700', description: 'Recommendation engines: content-based vs. collaborative filtering, matrix factorization, and cold starts.' },
  { title: 'Time Series', icon: 'clock', color: '#FF3D00', description: 'Analyzing temporal data: trend, seasonality, stationarity, and ARIMA forecasting.' },
  { title: 'MLOps Basics', icon: 'settings', color: '#651FFF', description: 'ML lifecycle engineering: model deployment, monitoring, data drift, and pipelines.' },
  { title: 'SQL for Data Science', icon: 'database', color: '#00B0FF', description: 'Database querying: GROUP BY, joins, window functions, and CTEs for data preparation.' },
  { title: 'Case Studies', icon: 'award', color: '#FF1744', description: 'System design scenarios: churn prediction, fraud detection, and recommendation systems.' },
  { title: 'Most Asked Interview Questions', icon: 'help-circle', color: '#FF8F00', description: 'High-frequency conceptual comparison questions and tricky placement challenges.' }
];

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // 1. Get system admin user
  let admin = await db.collection('users').findOne({ email: 'system@admin.com' });
  if (!admin) {
    console.log('Creating admin user system@admin.com...');
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

  // 2. Parent folder deterministic ID
  const PARENT_FOLDER_ID = generateDeterministicUUID('Data Science & AI Parent Folder');
  console.log(`Parent Folder ID: ${PARENT_FOLDER_ID}`);

  const existingParent = await db.collection('folders').findOne({ _id: PARENT_FOLDER_ID });
  if (!existingParent) {
    console.log('Inserting parent folder at 2nd position (shifting other folders)...');
    // Shift other root folders with order >= 1 by 1
    await db.collection('folders').updateMany(
      { parentFolderId: null, order: { $gte: 1 } },
      { $inc: { order: 1 } }
    );

    await db.collection('folders').insertOne({
      _id: PARENT_FOLDER_ID,
      title: 'Data Science & AI',
      description: 'Master core concepts in Python, NumPy, Pandas, Probability, Statistics, Machine Learning, Deep Learning, Transformers, SQL, and case studies.',
      icon: 'database',
      color: '#4FA2E5',
      createdBy: adminId,
      visibility: 'public',
      roleAccess: ['user', 'admin', 'superadmin'],
      order: 1, // 2nd position
      parentFolderId: null,
      cardIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } else {
    console.log('Parent folder already exists, updating properties...');
    await db.collection('folders').updateOne(
      { _id: PARENT_FOLDER_ID },
      {
        $set: {
          title: 'Data Science & AI',
          description: 'Master core concepts in Python, NumPy, Pandas, Probability, Statistics, Machine Learning, Deep Learning, Transformers, SQL, and case studies.',
          icon: 'database',
          color: '#4FA2E5',
          order: 1, // ensure it stays at order 1
          updatedAt: new Date()
        }
      }
    );
  }

  // 3. Insert child folders
  console.log('\n--- Seeding 28 Data Science & AI Child Folders ---');
  let order = 1;
  for (const sub of SUBFOLDERS) {
    const subFolderId = generateDeterministicUUID(`Data Science & AI - Subfolder - ${sub.title}`);
    console.log(`Seeding Folder: "${sub.title}" | ID: ${subFolderId}`);

    await db.collection('folders').deleteOne({ _id: subFolderId });

    await db.collection('folders').insertOne({
      _id: subFolderId,
      title: sub.title,
      description: sub.description,
      icon: sub.icon,
      color: sub.color,
      createdBy: adminId,
      visibility: 'public',
      roleAccess: ['user', 'admin', 'superadmin'],
      order: order++,
      parentFolderId: PARENT_FOLDER_ID,
      cardIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  await mongoose.disconnect();
  console.log('\nFolder seeding finished.');
}

run().catch(console.error);
