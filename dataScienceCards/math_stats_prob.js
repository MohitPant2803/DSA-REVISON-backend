module.exports = [
  // === 4. Data Visualization ===
  {
    title: 'Matplotlib Basics',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'dbe91067-1589-591b-a9c2-6e9d37778547',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Low-level charting library in Python, offering absolute control over figure elements.',
      'Object-Oriented API: Recommended format using `fig, ax = plt.subplots()` for managing multiple axes.',
      'Student Shorthand: Generates static raster or vector plots. Bypasses automatic styling, meaning titles and labels must be set manually.'
    ],
    code: `import matplotlib.pyplot as plt\nfig, ax = plt.subplots(figsize=(6, 4))\nax.plot([1, 2, 3], [10, 20, 15], label="Trend", color="blue")\nax.set_title("Line Plot")\nax.legend()\nplt.close()`,
    bullets3: [
      'Line 2: `fig` represents the outer window/canvas container. `ax` is the actual plot/axes object where lines and titles are drawn.',
      'Line 3: Plots vectors and adds a custom label and color.'
    ],
    bullets4: [
      'Time Complexity: Rendering: O(N) where N is the number of points plotted.',
      'Space Complexity: O(N) memory allocation to store vector coordinate coordinates.'
    ],
    bullets5: [
      'Gotcha: Calling `plt.plot()` globally operates on the active axis object implicitly, which can cause plotting errors in multi-axis setups. Always use the explicit OO API `ax.plot()`.',
      'Gotcha: Forgetting to call `plt.close()` in scripts running batch exports leads to memory leaks because figure instances remain open in memory.'
    ]
  },
  {
    title: 'Seaborn Basics',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'dbe91067-1589-591b-a9c2-6e9d37778547',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: High-level visualization library built on top of Matplotlib, designed to integrate with Pandas DataFrames.',
      'Aesthetics: Features clean default themes and automatic statistical aggregations.',
      'Student Shorthand: Simplifies complex plots (e.g. hue mapping) into single-line function calls.'
    ],
    code: `import seaborn as sns\nimport matplotlib.pyplot as plt\nsns.set_theme(style="whitegrid")\nsns.scatterplot(data=df, x="age", y="salary", hue="status")\nplt.close()`,
    bullets3: [
      'Line 4: Plots columns directly from a DataFrame, automatically mapping unique `status` values to distinct categorical colors (hue).'
    ],
    bullets4: [
      'Time Complexity: Parsing: O(N) + rendering: O(N) where N is the number of rows.',
      'Space Complexity: Allocates memory for temporary Pandas copies during aggregation.'
    ],
    bullets5: [
      'Gotcha: Seaborn is built on Matplotlib. Modifying plots (e.g. setting limits, custom ticks) requires using Matplotlib axis methods returned by Seaborn functions.',
      'Gotcha: High-level Seaborn grid plots (like `sns.pairplot` or `sns.jointplot`) create their own figure instances, meaning they cannot be plotted directly onto existing axes.'
    ]
  },
  {
    title: 'Histograms',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'dbe91067-1589-591b-a9c2-6e9d37778547',
    type: 'theory',
    bullets1: [
      'Definition: Graphical representation of the distribution of numerical data by grouping values into continuous intervals, called bins.',
      'Height: Represents the frequency or density of elements falling within each bin.',
      'Student Shorthand: Ideal for inspecting data skewness, modality (e.g. bimodal distributions), and identifying outlier gaps.'
    ],
    bullets2: [
      'Divide the range of values into equal intervals (bins).',
      'Count how many data points fall inside each interval.',
      'Draw bars with height proportional to count, placed over bin ranges.'
    ],
    bullets3: [
      'Analogy: Think of a histogram as sorting data points into sorting boxes. The tallest box contains the most popular range of values.'
    ],
    bullets4: [
      'Q: "How does bin size change a histogram?"',
      'A: Overly large bins smooth out features (underplotting), whereas tiny bins create noisy, jagged bars that obscure the underlying distribution.'
    ],
    bullets5: [
      'Trap: Confusing bar charts and histograms. Bar charts represent categorical counts and have gaps between bars. Histograms represent continuous ranges and have no gaps.'
    ]
  },
  {
    title: 'Box Plots',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'dbe91067-1589-591b-a9c2-6e9d37778547',
    type: 'theory',
    bullets1: [
      'Definition: Graphical representation of the five-number summary of a dataset: minimum, Q1, median, Q3, and maximum.',
      'IQR: Interquartile Range ($IQR = Q3 - Q1$), representing the middle 50% of the dataset.',
      'Outliers: Individual points plotted beyond the whiskers, representing values further than $1.5 \\times IQR$ from the box edges.'
    ],
    bullets2: [
      'Calculate quartiles Q1, Median (Q2), and Q3.',
      'Draw a central box from Q1 to Q3, with a line at the Median.',
      'Extend whiskers to the furthest data points within $1.5 \\times IQR$ from the box. Plot remaining points as individual outliers.'
    ],
    bullets3: [
      'Analogy: The box is the crowded lobby where the middle 50% of people stand. The whiskers show the reach of the crowd, and outliers are individuals standing far away outside.'
    ],
    bullets4: [
      'Q: "What are whiskers in a box plot?"',
      'A: Whiskers show data spread. They extend up to $1.5 \\times IQR$ from the box, capping at the actual minimum and maximum values of the dataset.'
    ],
    bullets5: [
      'Trap: Box plots do not show the shape of the distribution (e.g. a bimodal distribution can look identical to a uniform distribution in a box plot). Combine them with a violin plot to see the density curve.'
    ]
  },
  {
    title: 'Scatter Plots',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'dbe91067-1589-591b-a9c2-6e9d37778547',
    type: 'theory',
    bullets1: [
      'Definition: Plotted points displaying relationship trends between two numerical variables.',
      'Correlation: Inspects if points form linear paths (positive/negative correlation) or non-linear curves.',
      'Clustering: Identifies grouping structures and separation boundaries in the dataset.'
    ],
    bullets2: [
      'Assign the independent variable to the X-axis and the dependent variable to the Y-axis.',
      'Plot each coordinate pair as an individual point on the grid.',
      'Analyze point density, slopes, and spacing gaps.'
    ],
    bullets3: [
      'Analogy: Looking at a scatter plot is like looking down at a city from an airplane: clusters show downtown centers, and spread shows suburbs.'
    ],
    bullets4: [
      'Q: "How do you handle overplotting in scatter plots?"',
      'A: 1. Reduce point sizes. 2. Apply opacity (`alpha=0.3`) so overlapping points look darker. 3. Use a hexbin plot to group points into hexagons.'
    ],
    bullets5: [
      'Trap: Correlation is not causation. A linear pattern in a scatter plot only proves statistical association, not cause.'
    ]
  },
  {
    title: 'Correlation Heatmaps',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: 'dbe91067-1589-591b-a9c2-6e9d37778547',
    type: 'code',
    lang: 'Python',
    bullets1: [
      'Definition: Grid displays displaying the correlation coefficients between all numerical variable pairs in a dataset.',
      'Correlation Coefficient: Ranges from -1 (perfect negative) to +1 (perfect positive), with 0 indicating no linear relationship.',
      'Student Shorthand: Vital during feature selection to spot multicollinearity (highly correlated features).'
    ],
    code: `import seaborn as sns\nimport matplotlib.pyplot as plt\ncorr_matrix = df.corr() # Pearson correlation\nsns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f")\nplt.close()`,
    bullets3: [
      'Line 3: Calculates pairwise Pearson correlation coefficients between numerical columns.',
      'Line 4: Plots the heatmap with value annotations and a color mapping where red represents positive and blue represents negative correlation.'
    ],
    bullets4: [
      'Time Complexity: Calculation: O(C^2 * R) where C is columns and R is rows.',
      'Space Complexity: O(C^2) to store the symmetric correlation matrix.'
    ],
    bullets5: [
      'Gotcha: Pearson correlation only measures linear relationships. Variables with perfect non-linear relationships (e.g. $y = x^2$) can return a correlation of 0. Use Spearman correlation if monotonic non-linear relationships are present.',
      'Gotcha: Outliers heavily skew correlation metrics. Clean outliers before plotting heatmaps to prevent misleading coefficients.'
    ]
  },

  // === 5. Statistics ===
  {
    title: 'Mean',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3269cc09-0f7f-568a-8629-38a4ffd91a4a',
    type: 'math',
    bullets1: [
      'Definition: The mathematical average of a set of numerical values.',
      'Types: Arithmetic Mean (standard average), Geometric Mean (rates/ratios), Harmonic Mean (speeds/averages of rates).',
      'Student Shorthand: Represents the balance point/center of gravity of the data distribution.'
    ],
    bullets2: [
      'Arithmetic Mean: \\(\\mu = \\frac{1}{N} \\sum_{i=1}^N x_i\\)',
      'Geometric Mean: \\(GM = \\left(\\prod_{i=1}^N x_i\\right)^{1/N}\\)',
      'Harmonic Mean: \\(HM = \\frac{N}{\\sum_{i=1}^N \\frac{1}{x_i}}\\)'
    ],
    bullets3: [
      'Model: Think of data values as weights placed on a scale. The mean is the exact fulcrum point where the scale balances perfectly.'
    ],
    bullets4: [
      'Compute arithmetic mean of `[2, 4, 12]`: \\(\\frac{2+4+12}{3} = 6\\).',
      'If 12 is replaced by 100, the mean changes to \\(\\frac{2+4+100}{3} = 35.3\\), showing high sensitivity to outliers.'
    ],
    bullets5: [
      'Q: "When does the mean fail as a summary metric?"',
      'A: In highly skewed distributions (e.g. household income). A few billionaires pull the mean artificially high, making it unrepresentative of the typical value. Use the median instead.'
    ]
  },
  {
    title: 'Median',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3269cc09-0f7f-568a-8629-38a4ffd91a4a',
    type: 'math',
    bullets1: [
      'Definition: The middle value in a sorted dataset, separating the top 50% from the bottom 50%.',
      'Robustness: Robust to outliers because it relies on value order rather than magnitudes.',
      'Student Shorthand: Represents the 50th percentile of the distribution.'
    ],
    bullets2: [
      'Sort the dataset in ascending order.',
      'If dataset size $N$ is odd: \\(Median = x_{(N+1)/2}\\).',
      'If dataset size $N$ is even: \\(Median = \\frac{x_{N/2} + x_{(N/2) + 1}}{2}\\).'
    ],
    bullets3: [
      'Model: The median is the physical middle link of a chain. It remains the middle link even if you stretch the endpoints of the chain.'
    ],
    bullets4: [
      'Even set `[2, 4, 6, 100]`: Sorted: `[2, 4, 6, 100]`. Even size, so average the middle two values: \\(\\frac{4+6}{2} = 5\\).',
      'Even if 100 is replaced by 10,000, the median remains 5, proving its outlier resistance.'
    ],
    bullets5: [
      'Q: "How do mean and median compare in skewed distributions?"',
      'A: In a right-skewed (positive) distribution, the mean is greater than the median (Mean > Median). In a left-skewed (negative) distribution, the mean is less than the median (Mean < Median).'
    ]
  },
  {
    title: 'Mode',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3269cc09-0f7f-568a-8629-38a4ffd91a4a',
    type: 'math',
    bullets1: [
      'Definition: The value that appears most frequently in a dataset.',
      'Modality: Datasets can have one mode (unimodal), two modes (bimodal), or multiple modes (multimodal).',
      'Student Shorthand: The only measure of central tendency that works for categorical variables.'
    ],
    bullets2: [
      'Count the frequency of each unique value in the dataset.',
      'Identify the value with the maximum count.',
      'If all values appear once, there is no mode.'
    ],
    bullets3: [
      'Model: The mode is the tallest bar in a histogram or categorical count plot.'
    ],
    bullets4: [
      'Categorical set `["Red", "Blue", "Red", "Green"]`: Frequencies: Red=2, Blue=1, Green=1. The mode is `"Red"`.'
    ],
    bullets5: [
      'Q: "Why is identifying a bimodal distribution important in ML?"',
      'A: A bimodal distribution indicates that the dataset contains two distinct underlying subgroups (e.g. height data combining males and females). Clustering or splitting the data prior to modeling yields better results.'
    ]
  },
  {
    title: 'Variance',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3269cc09-0f7f-568a-8629-38a4ffd91a4a',
    type: 'math',
    bullets1: [
      'Definition: The average of the squared differences from the mean, measuring data spread.',
      'Bessels Correction: When estimating sample variance, divide by $N-1$ instead of $N$ to correct for underestimation bias.',
      'Student Shorthand: Units are squared (e.g. \\(meters^2\\)), which makes it difficult to interpret directly.'
    ],
    bullets2: [
      'Population Variance: \\(\\sigma^2 = \\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2\\)',
      'Sample Variance: \\(s^2 = \\frac{1}{N-1} \\sum_{i=1}^N (x_i - \\bar{x})^2\\)'
    ],
    bullets3: [
      'Model: Think of data points as balls attached to the mean by springs. Variance measures the total tension/stretch of all the springs combined.'
    ],
    bullets4: [
      'Dataset `[2, 4, 6]` with mean 4:',
      'Squared deviations: \\((2-4)^2 = 4\\), \\((4-4)^2 = 0\\), \\((6-4)^2 = 4\\).',
      'Sample variance: \\(s^2 = \\frac{4+0+4}{3-1} = 4\\).'
    ],
    bullets5: [
      'Q: "Why do we use Bessel\'s correction (N-1) for sample variance?"',
      'A: Using $N$ underestimates true population variance because sample values tend to cluster closer to the sample mean than the true population mean. Dividing by $N-1$ corrects this bias.'
    ]
  },
  {
    title: 'Standard Deviation',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3269cc09-0f7f-568a-8629-38a4ffd91a4a',
    type: 'math',
    bullets1: [
      'Definition: The square root of the variance, measuring data spread in original units.',
      'Interpretation: High standard deviation indicates that data points are spread out widely; low standard deviation indicates they cluster closely around the mean.',
      'Student Shorthand: Retains the same units as the original data, making it easy to interpret.'
    ],
    bullets2: [
      'Population Standard Deviation: \\(\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2}\\)',
      'Sample Standard Deviation: \\(s = \\sqrt{\\frac{1}{N-1} \\sum_{i=1}^N (x_i - \\bar{x})^2}\\)'
    ],
    bullets3: [
      'Model: In a normal distribution, standard deviation partitions the area under the curve into known percentages (Empirical Rule).'
    ],
    bullets4: [
      'If sample variance $s^2 = 4$, standard deviation is \\(s = \\sqrt{4} = 2\\).',
      'Under a normal distribution: ~68% of values fall within \\(\\pm 1 s\\) from the mean, and ~95% fall within \\(\\pm 2 s\\).'
    ],
    bullets5: [
      'Q: "How does scaling affect standard deviation?"',
      'A: Adding a constant $c$ to all data points leaves the standard deviation unchanged. Multiplying all points by $c$ scales the standard deviation by $|c|$.'
    ]
  },
  {
    title: 'Covariance',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3269cc09-0f7f-568a-8629-38a4ffd91a4a',
    type: 'math',
    bullets1: [
      'Definition: Measures how two variables change together.',
      'Sign: Positive indicates they increase together; negative indicates one increases while the other decreases.',
      'Scale: Value depends on data units, making it difficult to measure correlation strength directly.'
    ],
    bullets2: [
      'Sample Covariance: \\(Cov(X, Y) = \\frac{1}{N-1} \\sum_{i=1}^N (x_i - \\bar{x})(y_i - \\bar{y})\\)'
    ],
    bullets3: [
      'Model: If you plot variables $X$ and $Y$ on a scatter grid relative to their means, covariance is the sum of areas of rectangles representing the points. Quadrants 1 and 3 add positive value; quadrants 2 and 4 add negative value.'
    ],
    bullets4: [
      'Points `(X, Y)`: `(2,3)`, `(4,5)`, `(6,7)`. Mean X=4, Mean Y=5.',
      'Deviations: `(2-4)(3-5) = 4`, `(4-4)(5-5) = 0`, `(6-4)(7-5) = 4`.',
      'Covariance: \\(Cov(X, Y) = \\frac{4+0+4}{2} = 4\\).'
    ],
    bullets5: [
      'Q: "What does a covariance of 0 mean?"',
      'A: A covariance of 0 indicates that there is no linear relationship between the two variables. They can still have non-linear relationships.'
    ]
  },
  {
    title: 'Correlation',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '3269cc09-0f7f-568a-8629-38a4ffd91a4a',
    type: 'math',
    bullets1: [
      'Definition: Standardized covariance, measuring the strength and direction of the linear relationship between two variables.',
      'Pearson Coefficient ($r$): Standard correlation metric, ranging from -1 to +1.',
      'Student Shorthand: Dividing covariance by standard deviations removes units, standardizing the metric.'
    ],
    bullets2: [
      'Pearson Correlation: \\(r = \\frac{Cov(X, Y)}{s_x s_y}\\)'
    ],
    bullets3: [
      'Model: Correlation is the cosine of the angle between the two centered data vectors in high-dimensional space.'
    ],
    bullets4: [
      'If \\(Cov(X, Y) = 4\\), \\(s_x = 2\\), and \\(s_y = 2.5\\):',
      '\\(r = \\frac{4}{2 \\times 2.5} = 0.8\\) (strong positive linear relationship).'
    ],
    bullets5: [
      'Q: "How does correlation differ from covariance?"',
      'A: Covariance is bound by data scale and units. Correlation is standardized, unitless, and strictly bounded between -1 and +1.'
    ]
  },
  {
    title: 'Central Limit Theorem',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '3269cc09-0f7f-568a-8629-38a4ffd91a4a',
    type: 'theory',
    bullets1: [
      'Definition: As sample size increases, the sampling distribution of the sample mean approaches a normal distribution, regardless of the shape of the population distribution.',
      'Sample Size Rule: Typically holds for sample sizes $N \\ge 30$.',
      'Mean/Variance: Sampling distribution mean equals population mean (\\(\\mu\\)); sampling standard error equals \\(\\sigma / \\sqrt{N}\\).'
    ],
    bullets2: [
      'Draw random samples of size $N$ from any distribution.',
      'Calculate the mean of each sample.',
      'Plot sample means. The resulting distribution is normal with standard error \\(SE = \\frac{\\sigma}{\\sqrt{N}}\\).'
    ],
    bullets3: [
      'Analogy: If you roll a fair die, outcomes are uniform. But if you roll 30 dice and average the scores, outcomes follow a bell curve centered at 3.5.'
    ],
    bullets4: [
      'Q: "Why is the Central Limit Theorem vital for ML/Stats?"',
      'A: It justifies using normal distribution assumptions for hypothesis testing and calculating confidence intervals, even when the underlying data is skewed or non-normal.'
    ],
    bullets5: [
      'Trap: Forgetting that the CLT applies to the distribution of sample *means*, not individual data points. The population distribution remains non-normal.'
    ]
  },
  {
    title: 'Hypothesis Testing',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '3269cc09-0f7f-568a-8629-38a4ffd91a4a',
    type: 'theory',
    bullets1: [
      'Definition: Statistical framework to determine if there is enough evidence to reject a baseline claim.',
      'Null Hypothesis ($H_0$): Baseline claim of no effect or no difference.',
      'Alternative Hypothesis ($H_a$): Claim of an effect or difference that we want to prove.'
    ],
    bullets2: [
      'Formulate null ($H_0$) and alternative ($H_a$) hypotheses.',
      'Set significance level \\(\\alpha\\) (typically 0.05) and calculate test statistics (z-score, t-statistic).',
      'Compute the p-value. Reject $H_0$ if \\(p\\text{-value} \\le \\alpha\\).'
    ],
    bullets3: [
      'Analogy: Similar to a court trial: a defendant is assumed innocent ($H_0$) until proven guilty beyond reasonable doubt ($H_a$).'
    ],
    bullets4: [
      'Q: "What are Type I and Type II errors?"',
      'A: Type I Error (False Positive): Rejecting $H_0$ when it is true. Type II Error (False Negative): Failing to reject $H_0$ when it is false.'
    ],
    bullets5: [
      'Power of Test: Probability of correctly rejecting $H_0$ when it is false (\\(1 - \\beta\\), where \\(b\\) is the Type II error rate). Power increases with larger sample sizes.'
    ]
  },
  {
    title: 'P Value',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '3269cc09-0f7f-568a-8629-38a4ffd91a4a',
    type: 'math',
    bullets1: [
      'Definition: The probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true.',
      'Decision Boundary: If \\(p \\le \\alpha\\), reject the null hypothesis; if \\(p > \\alpha\\), fail to reject it.',
      'Student Shorthand: Measures null hypothesis incompatibility, not the probability that the null hypothesis is true.'
    ],
    bullets2: [
      'Formula: \\(p\\text{-value} = P(\\text{Test Statistic} \\ge \\text{Observed Value} \\mid H_0 \\text{ is True})\\)'
    ],
    bullets3: [
      'Model: The p-value is the tail area of the test statistic distribution beyond the observed value.'
    ],
    bullets4: [
      'Testing coin fairness: Flip 10 times, get 9 heads. Null hypothesis: coin is fair ($P(H) = 0.5$).',
      'Calculating the probability of getting 9 or 10 heads gives a low p-value (e.g. 0.01), suggesting we should reject the null hypothesis.'
    ],
    bullets5: [
      'Q: "Does a small p-value mean the effect size is large?"',
      'A: No. With massive datasets, even tiny, practically insignificant effects can yield low p-values. Always report effect sizes alongside p-values.'
    ]
  },

  // === 6. Probability ===
  {
    title: 'Basic Probability',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '8c095663-6169-50a5-acaa-0c9dff663184',
    type: 'math',
    bullets1: [
      'Definition: The mathematical likelihood of an event occurring.',
      'Bounds: Probability values are strictly bounded: \\(0 \\le P(A) \\le 1\\).',
      'Complement: The probability of an event not occurring is \\(P(A^c) = 1 - P(A)\\).'
    ],
    bullets2: [
      'Formula: \\(P(A) = \\frac{\\text{Favorable Outcomes}}{\\text{Total Outcomes in Sample Space}}\\)',
      'Addition Rule (Union): \\(P(A \\cup B) = P(A) + P(B) - P(A \\cap B)\\)'
    ],
    bullets3: [
      'Model: Probability is the ratio of target event areas to the total area of the sample space on a Venn diagram.'
    ],
    bullets4: [
      'Rolling an even number on a 6-sided die: Favorable: `[2, 4, 6]` (3). Sample space: `[1, 2, 3, 4, 5, 6]` (6).',
      '\\(P(\\text{Even}) = \\frac{3}{6} = 0.5\\).'
    ],
    bullets5: [
      'Q: "How do you calculate union probability for mutually exclusive events?"',
      'A: For mutually exclusive events, intersection is empty: \\(P(A \\cap B) = 0\\), so the addition rule simplifies to: \\(P(A \\cup B) = P(A) + P(B)\\).'
    ]
  },
  {
    title: 'Conditional Probability',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '8c095663-6169-50a5-acaa-0c9dff663184',
    type: 'math',
    bullets1: [
      'Definition: The probability of event A occurring, given that event B has already occurred.',
      'Notation: Written as \\(P(A \\mid B)\\).',
      'Student Shorthand: Shrinks the active sample space from the entire universe to only the subset of event B.'
    ],
    bullets2: [
      'Formula: \\(P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}\\) where \\(P(B) > 0\\)'
    ],
    bullets3: [
      'Model: On a Venn diagram, conditional probability is the ratio of the overlap area \\(A \\cap B\\) to the area of circle B.'
    ],
    bullets4: [
      'Rolling a 6-sided die: Let A be rolling a 4, B be rolling an even number.',
      '\\(P(B) = 3/6\\), \\(P(A \\cap B) = 1/6\\).',
      '\\(P(A \\mid B) = \\frac{1/6}{3/6} = \\frac{1}{3}\\).'
    ],
    bullets5: [
      'Q: "How does independence affect conditional probability?"',
      'A: If A and B are independent, the occurrence of B does not affect the probability of A: \\(P(A \\mid B) = P(A)\\), and \\(P(A \\cap B) = P(A)P(B)\\).'
    ]
  },
  {
    title: 'Bayes Theorem',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '8c095663-6169-50a5-acaa-0c9dff663184',
    type: 'math',
    bullets1: [
      'Definition: Mathematical formula to update probability estimates as new evidence becomes available.',
      'Components: Prior \\(P(A)\\), Likelihood \\(P(B \\mid A)\\), Posterior \\(P(A \\mid B)\\), Marginal Likelihood \\(P(B)\\).',
      'Student Shorthand: Fundamental to Bayesian statistics, spam filters, and binary classifier analysis.'
    ],
    bullets2: [
      'Formula: \\(P(A \\mid B) = \\frac{P(B \\mid A)P(A)}{P(B)}\\)',
      'Expanded denominator: \\(P(B) = P(B \\mid A)P(A) + P(B \\mid A^c)P(A^c)\\)'
    ],
    bullets3: [
      'Model: Bayes Theorem scales the prior probability by the likelihood ratio of the evidence.'
    ],
    bullets4: [
      'Drug test accuracy: Prior probability of usage is 1% (\\(P(U) = 0.01\\)). Test accuracy is 99% (\\(P(+\\mid U) = 0.99\\), false positive is 1% (\\(P(+\\mid U^c) = 0.01\\)).',
      '\\(P(U \\mid +) = \\frac{0.99 \\times 0.01}{(0.99 \\times 0.01) + (0.01 \\times 0.99)} = 0.50\\) (only a 50% chance they use drugs despite the positive test).'
    ],
    bullets5: [
      'Q: "Why is the posterior probability often lower than expected in medical tests?"',
      'A: The Base Rate Fallacy: if the base rate (prior probability) of the disease is extremely rare, even a highly accurate test can produce more total false positives than true positives.'
    ]
  },
  {
    title: 'Independent Events',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '8c095663-6169-50a5-acaa-0c9dff663184',
    type: 'math',
    bullets1: [
      'Definition: Events where the occurrence of one does not affect the probability of the other occurring.',
      'Multiplication Rule: The joint probability of independent events is the product of their individual probabilities.',
      'Mutual Exclusion: Independent events with non-zero probabilities can never be mutually exclusive.'
    ],
    bullets2: [
      'Rule: \\(P(A \\cap B) = P(A)P(B)\\)',
      'Condition: \\(P(A \\mid B) = P(A)\\) and \\(P(B \\mid A) = P(B)\\)'
    ],
    bullets3: [
      'Model: Independent events represent orthogonal dimensions in probability tree diagrams.'
    ],
    bullets4: [
      'Flipping two coins: Let A be getting heads on coin 1, B be getting tails on coin 2. \\(P(A) = 0.5\\), \\(P(B) = 0.5\\).',
      '\\(P(A \\cap B) = 0.5 \\times 0.5 = 0.25\\).'
    ],
    bullets5: [
      'Q: "Why can mutually exclusive events never be independent?"',
      'A: If events are mutually exclusive, the occurrence of one prevents the other (\\(P(A \\cap B) = 0\\)). Knowing that B occurred tells you that A cannot occur (\\(P(A \\mid B) = 0\\)), which violates independence.'
    ]
  },
  {
    title: 'Random Variables',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '8c095663-6169-50a5-acaa-0c9dff663184',
    type: 'math',
    bullets1: [
      'Definition: A variable whose values depend on numerical outcomes of a random experiment.',
      'Types: Discrete (countable values, mapped by PMF) vs Continuous (uncountable values, mapped by PDF).',
      'Student Shorthand: Functions mapping sample space outcomes to real numbers.'
    ],
    bullets2: [
      'Discrete PMF: \\(P(X = x) = p(x)\\), where \\(\\sum p(x) = 1\\)',
      'Continuous PDF: \\(P(a \\le X \\le b) = \\int_a^b f(x) dx\\), where \\(\\int_{-\\infty}^{\\infty} f(x) dx = 1\\)'
    ],
    bullets3: [
      'Model: PMFs look like distinct spikes at coordinates; PDFs look like continuous area curves.'
    ],
    bullets4: [
      'Let X be the sum of two rolled dice: X can take integer values from 2 to 12. PMF: \\(P(X = 7) = 6/36\\).'
    ],
    bullets5: [
      'Q: "Why is the probability of a single point in a continuous PDF equal to 0?"',
      'A: In a continuous distribution, probability is defined as the area under the PDF curve. The area under a single point (with interval width of 0) is zero: \\(P(X = x) = \\int_x^x f(t) dt = 0\\).'
    ]
  },
  {
    title: 'Expectation',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '8c095663-6169-50a5-acaa-0c9dff663184',
    type: 'math',
    bullets1: [
      'Definition: The long-run average value of a random variable over repeated trials.',
      'Linearity of Expectation: The expectation of the sum of random variables is the sum of their expectations: \\(E[X + Y] = E[X] + E[Y]\\), regardless of independence.',
      'Student Shorthand: The probability-weighted average of all possible values.'
    ],
    bullets2: [
      'Discrete Expectation: \\(E[X] = \\sum x_i P(X = x_i)\\)',
      'Continuous Expectation: \\(E[X] = \\int_{-\\infty}^{\\infty} x f(x) dx\\)'
    ],
    bullets3: [
      'Model: Expectation is the physical balance point (center of mass) of the probability distribution.'
    ],
    bullets4: [
      'Rolling a fair 6-sided die:',
      '\\(E[X] = 1(1/6) + 2(1/6) + 3(1/6) + 4(1/6) + 5(1/6) + 6(1/6) = 3.5\\).'
    ],
    bullets5: [
      'Q: "Why does Linearity of Expectation hold even for dependent variables?"',
      'A: Because the mathematical derivation expansion of joint integration simplifies to individual marginal integrations, requiring no independence assumptions.'
    ]
  },
  {
    title: 'Variance (Probability)',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '8c095663-6169-50a5-acaa-0c9dff663184',
    type: 'math',
    bullets1: [
      'Definition: Measures the spread/dispersion of a random variable around its expectation.',
      'Alternate Formula: Expected value of the square minus the square of the expected value: \\(E[X^2] - (E[X])^2\\).',
      'Scaling Rules: \\(Var(aX + b) = a^2 Var(X)\\).'
    ],
    bullets2: [
      'Formula: \\(Var(X) = E[(X - E[X])^2]\\)',
      'Computational: \\(Var(X) = E[X^2] - (E[X])^2\\)'
    ],
    bullets3: [
      'Model: Measures the average squared distance of the random variable\'s values from its center of mass.'
    ],
    bullets4: [
      'For a coin flip where Heads=1, Tails=0, with \\(P(H)=0.5\\):',
      '\\(E[X] = 0.5\\), \\(E[X^2] = 1^2(0.5) + 0^2(0.5) = 0.5\\).',
      '\\(Var(X) = 0.5 - 0.5^2 = 0.25\\).'
    ],
    bullets5: [
      'Q: "How does independence affect the variance of the sum of two random variables?"',
      'A: If X and Y are independent, \\(Var(X + Y) = Var(X) + Var(Y)\\). If they are dependent, you must add a covariance term: \\(Var(X + Y) = Var(X) + Var(Y) + 2Cov(X, Y)\\).'
    ]
  },
  {
    title: 'Common Distributions',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '8c095663-6169-50a5-acaa-0c9dff663184',
    type: 'theory',
    bullets1: [
      'Definition: Mathematical models describing the likelihood of different random variable outcomes.',
      'Discrete: Bernoulli (one trial), Binomial (N trials), Poisson (event rates in time intervals).',
      'Continuous: Uniform (equal odds), Normal (bell curve), Exponential (waiting time between events).'
    ],
    bullets2: [
      'Binomial PMF: \\(P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}\\), Mean = \\(np\\), Variance = \\(np(1-p)\\).',
      'Poisson PMF: \\(P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}\\), Mean = \\(\\lambda\\), Variance = \\(\\lambda\\).',
      'Normal PDF: \\(f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}\\).'
    ],
    bullets3: [
      'Analogy: Bernoulli is flipping a coin once. Binomial is the count of heads in 10 flips. Poisson is counting how many cars pass through a toll booth in an hour.'
    ],
    bullets4: [
      'Q: "How does the Poisson distribution relate to the Binomial distribution?"',
      'A: The Poisson distribution is a limiting case of the Binomial distribution as $N \\to \\infty$ and $p \\to 0$, keeping the rate \\(\\lambda = np\\) constant.'
    ],
    bullets5: [
      'Exponential distribution is memoryless: \\(P(X > s + t \\mid X > s) = P(X > t)\\). Past waiting time does not affect future probability (e.g. how long you wait for a bus).'
    ]
  },

  // === 7. Linear Algebra ===
  {
    title: 'Vectors',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '14cd2730-3240-59a6-8314-919e32ad27cc',
    type: 'math',
    bullets1: [
      'Definition: Ordered lists of numbers representing coordinates in space.',
      'Vector Space: Operations include vector addition and scalar multiplication.',
      'Student Shorthand: Think of a vector as an arrow pointing from the origin to a coordinate in $N$-dimensional space.'
    ],
    bullets2: [
      'Magnitude (L2 Norm): \\(\\|v\\|_2 = \\sqrt{\\sum x_i^2}\\)',
      'Addition: \\(u + v = [u_1 + v_1, u_2 + v_2]\\)'
    ],
    bullets3: [
      'Model: Adding two vectors placing them tip-to-tail. The result is the arrow pointing directly from start to finish.'
    ],
    bullets4: [
      'Calculate magnitude of `v = [3, 4]`: \\(\\|v\\|_2 = \\sqrt{3^2 + 4^2} = 5\\).'
    ],
    bullets5: [
      'Q: "What does cosine similarity measure between two vectors?"',
      'A: Cosine similarity measures the directional alignment of vectors, ignoring magnitude: \\(\\cos(\\theta) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}\\). A value of 1 indicates they point in the same direction.'
    ]
  },
  {
    title: 'Matrices',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '14cd2730-3240-59a6-8314-919e32ad27cc',
    type: 'math',
    bullets1: [
      'Definition: Rectangular grids of numbers representing linear transformations in space.',
      'Operations: Can scale, rotate, shear, or project vectors.',
      'Student Shorthand: A matrix of shape (R, C) has R rows and C columns, mapping vectors from $C$-dimensional space to $R$-dimensional space.'
    ],
    bullets2: [
      'Transpose: Flips a matrix over its diagonal: \\((A^T)_{ij} = A_{ji}\\)',
      'Inverse: Reverses transformations: \\(A^{-1} A = I\\) (only exists if determinant is non-zero)'
    ],
    bullets3: [
      'Model: A matrix acts like a coordinate warp grid, stretching and bending the space when multiplied by a vector.'
    ],
    bullets4: [
      'Inverse of 2x2 matrix `[[a, b], [c, d]]`:',
      '\\(A^{-1} = \\frac{1}{ad-bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}\\).'
    ],
    bullets5: [
      'Q: "What does a matrix determinant measure?"',
      'A: The determinant measures the scaling factor of the transformation. If the determinant is 0, the matrix collapses space onto a lower dimension, and the inverse cannot be computed.'
    ]
  },
  {
    title: 'Matrix Multiplication',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '14cd2730-3240-59a6-8314-919e32ad27cc',
    type: 'math',
    bullets1: [
      'Definition: Multiplying matrices to chain linear transformations together.',
      'Dimension Rule: Inner dimensions must match: matrix A of shape (M, N) can only multiply matrix B of shape (N, P), resulting in matrix C of shape (M, P).',
      'Non-commutative: Order matters: \\(AB \\ne BA\\) in general.'
    ],
    bullets2: [
      'Formula: \\(C_{ij} = \\sum_{k=1}^N A_{ik} B_{kj}\\)'
    ],
    bullets3: [
      'Model: Matrix multiplication is equivalent to running transformations sequentially (e.g. rotate vector, then scale it).'
    ],
    bullets4: [
      'Multiply `A = [[1, 2], [3, 4]]` and `B = [[2, 0], [1, 2]]`:',
      '\\(C_{11} = (1\\times2) + (2\\times1) = 4\\), \\(C_{12} = (1\\times0) + (2\\times2) = 4\\).',
      '\\(C_{21} = (3\\times2) + (4\\times1) = 10\\), \\(C_{22} = (3\\times0) + (4\\times2) = 8\\).',
      'Result: `[[4, 4], [10, 8]]`.'
    ],
    bullets5: [
      'Q: "Why is matrix multiplication non-commutative?"',
      'A: Because applying transformation A then B yields a different final coordinate than applying B then A (e.g. rotating 90 degrees then shifting along the X-axis is not the same as shifting first then rotating).'
    ]
  },
  {
    title: 'Dot Product',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '14cd2730-3240-59a6-8314-919e32ad27cc',
    type: 'math',
    bullets1: [
      'Definition: Sum of element-wise products of two vectors, returning a scalar.',
      'Orthogonality: If the dot product is 0, the vectors are perpendicular (orthogonal).',
      'Projection: Measures the projection length of one vector onto another.'
    ],
    bullets2: [
      'Algebraic Formula: \\(u \\cdot v = \\sum_{i=1}^N u_i v_i\\)',
      'Geometric Formula: \\(u \\cdot v = \\|u\\| \\|v\\| \\cos(\\theta)\\)'
    ],
    bullets3: [
      'Model: The dot product measures how much two vector directions align. Positive: pointing in a similar direction; negative: pointing away.'
    ],
    bullets4: [
      'Calculate dot product of `u = [1, 2, 3]` and `v = [4, -1, 2]`:',
      '\\(u \\cdot v = (1\\times4) + (2\\times-1) + (3\\times2) = 4 - 2 + 6 = 8\\).'
    ],
    bullets5: [
      'Q: "Why is dot product essential for ML models?"',
      'A: It is the core mathematical operation for computing neuron outputs (\\(w^T x\\)) and calculating self-attention scores in Transformer models.'
    ]
  },
  {
    title: 'Eigenvalues',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '14cd2730-3240-59a6-8314-919e32ad27cc',
    type: 'math',
    bullets1: [
      'Definition: Scalars that represent the scaling factor of eigenvectors during linear transformations.',
      'Characteristic Equation: Found by solving the determinant equation \\(\\det(A - \\lambda I) = 0\\).',
      'Student Shorthand: Represents the variance or energy of the transformation along the eigenvector axes.'
    ],
    bullets2: [
      'Equation: \\(A v = \\lambda v\\) (where \\(\\lambda\\) is the eigenvalue scalar)'
    ],
    bullets3: [
      'Model: When a matrix distorts grid space, eigenvalues measure the stretching factor along the invariant directions.'
    ],
    bullets4: [
      'For matrix `A = [[2, 1], [1, 2]]`:',
      '\\(\\det(A - \\lambda I) = (2-\\lambda)^2 - 1 = 0 \\implies \\lambda^2 - 4\\lambda + 3 = 0\\).',
      'Eigenvalues are \\(\\lambda = 3\\) and \\(\\lambda = 1\\).'
    ],
    bullets5: [
      'Q: "Why do we calculate eigenvalues in PCA?"',
      'A: The eigenvalues of the covariance matrix measure the amount of variance captured by each principal component. Principal components with small eigenvalues can be dropped to reduce dimensions.'
    ]
  },
  {
    title: 'Eigenvectors',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '14cd2730-3240-59a6-8314-919e32ad27cc',
    type: 'math',
    bullets1: [
      'Definition: Non-zero vectors whose direction remains unchanged when multiplied by a matrix.',
      'Orthogonality: Eigenvectors of symmetric matrices are always orthogonal.',
      'Student Shorthand: The invariant axes of linear transformations.'
    ],
    bullets2: [
      'Equation: \\((A - \\lambda I)v = 0\\) (solved to find nullspace vectors)'
    ],
    bullets3: [
      'Model: If you draw vectors on a rubber sheet and stretch it, the eigenvectors are the directions that stretch but do not rotate.'
    ],
    bullets4: [
      'Finding eigenvector for matrix `A = [[2, 1], [1, 2]]` with \\(\\lambda = 3\\):',
      '\\(A - 3I = \\begin{bmatrix} -1 & 1 \\\\ 1 & -1 \\end{bmatrix} \\implies -x + y = 0 \\implies x = y\\).',
      'Normalized eigenvector: \\(v = \\frac{1}{\\sqrt{2}} [1, 1]^T\\).'
    ],
    bullets5: [
      'Q: "What are eigenvectors of covariance matrices?"',
      'A: They represent the directional axes of maximum variance in the data distribution (principal components).'
    ]
  },
  {
    title: 'SVD Intuition',
    topic: 'Data Science & AI',
    difficulty: 'Hard',
    folderId: '14cd2730-3240-59a6-8314-919e32ad27cc',
    type: 'math',
    bullets1: [
      'Definition: Factorizing any matrix into three constituent matrices representing rotation, scaling, and rotation.',
      'Components: Left singular vectors \\(U\\), Singular values \\(\\Sigma\\), Right singular vectors \\(V^T\\).',
      'Student Shorthand: Generalizes eigendecomposition to non-square matrices.'
    ],
    bullets2: [
      'Formula: \\(A = U \\Sigma V^T\\)'
    ],
    bullets3: [
      'Model: Singular values measure the variance of projections along the coordinate singular vectors.'
    ],
    bullets4: [
      'Dimensionality reduction: Keep only the top $k$ singular values in \\(\\Sigma\\) to reconstruct a low-rank approximation of A.'
    ],
    bullets5: [
      'Q: "How is SVD used in Collaborative Filtering?"',
      'A: It factorizes the user-item rating matrix into low-dimensional user and item embedding matrices, capturing latent preferences for recommendation.'
    ]
  },

  // === 8. Calculus for ML ===
  {
    title: 'Derivatives',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '4d6577e5-3c12-536d-a3e6-f9c129ba89c3',
    type: 'math',
    bullets1: [
      'Definition: Measures the instantaneous rate of change of a function.',
      'Tangent Line: Slope of the tangent line at a given coordinate point on a function.',
      'Student Shorthand: Tells you how small changes in inputs impact function outputs.'
    ],
    bullets2: [
      'Limit definition: \\(f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}\\)',
      'Power Rule: \\(\\frac{d}{dx} x^n = n x^{n-1}\\)'
    ],
    bullets3: [
      'Model: Zooming in infinitely on a curve. The curve looks like a straight line; the derivative is the slope of that line.'
    ],
    bullets4: [
      'Find derivative of \\(f(x) = 3x^2 + 5x\\): \\(f\'(x) = 6x + 5\\).'
    ],
    bullets5: [
      'Q: "Why are derivatives critical for ML optimization?"',
      'A: Derivatives calculate cost function slopes. This slope tells the model whether to increase or decrease weight parameters to reduce cost.'
    ]
  },
  {
    title: 'Partial Derivatives',
    topic: 'Data Science & AI',
    difficulty: 'Easy',
    folderId: '4d6577e5-3c12-536d-a3e6-f9c129ba89c3',
    type: 'math',
    bullets1: [
      'Definition: Derivatives of multi-variable functions taken with respect to one variable, keeping other variables constant.',
      'Notation: Written using the curly delta symbol: \\(\\frac{\\partial f}{\\partial x}\\).',
      'Student Shorthand: Measures rates of change along a single coordinate axis.'
    ],
    bullets2: [
      'Formula: \\(\\frac{\\partial f(x, y)}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h, y) - f(x, y)}{h}\\)'
    ],
    bullets3: [
      'Model: Slicing a multi-dimensional surface with a plane parallel to the target coordinate axis, measuring the slope of the resulting curve.'
    ],
    bullets4: [
      'Find partial derivatives of \\(f(x, y) = x^2 y + 3y^2\\):',
      '\\(\\frac{\\partial f}{\\partial x} = 2xy\\), \\(\\frac{\\partial f}{\\partial y} = x^2 + 6y\\).'
    ],
    bullets5: [
      'Q: "How are partial derivatives used in backpropagation?"',
      'A: They calculate how the total loss changes with respect to individual weights, treating all other parameter values in the network as constants.'
    ]
  },
  {
    title: 'Gradients',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '4d6577e5-3c12-536d-a3e6-f9c129ba89c3',
    type: 'math',
    bullets1: [
      'Definition: Vector of partial derivatives of a multi-variable function.',
      'Direction: Points in the direction of steepest ascent of the function.',
      'Magnitude: Measures the rate of change in that direction.'
    ],
    bullets2: [
      'Formula: \\(\\nabla f(x, y) = \\left[ \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y} \\right]\\)'
    ],
    bullets3: [
      'Model: The gradient is the steepest uphill vector pointing from a coordinate position on a 3D landscape.'
    ],
    bullets4: [
      'Find gradient of \\(f(x, y) = x^2 y + 3y^2\\) at point `(2, 1)`:',
      '\\(\\nabla f(x, y) = [2xy, x^2 + 6y]\\). At (2,1): `[2(2)(1), 2^2 + 6(1)] = [4, 10]`.'
    ],
    bullets5: [
      'Q: "How does gradient descent use the gradient?"',
      'A: To minimize loss, parameters are updated in the *negative* direction of the gradient (direction of steepest descent): \\(w \\leftarrow w - \\eta \\nabla L\\).'
    ]
  },
  {
    title: 'Chain Rule',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '4d6577e5-3c12-536d-a3e6-f9c129ba89c3',
    type: 'math',
    bullets1: [
      'Definition: Formula to calculate derivatives of nested composite functions.',
      'Composition: If \\(z = f(y)\\) and \\(y = g(x)\\), then \\(z = f(g(x))\\).',
      'Student Shorthand: Multiplies rate-of-change fractions along the function chain.'
    ],
    bullets2: [
      'Formula: \\(\\frac{dz}{dx} = \\frac{dz}{dy} \\cdot \\frac{dy}{dx}\\)'
    ],
    bullets3: [
      'Model: Think of nested functions as linked gears: the rate of change of the last gear is the product of gear ratio changes along the chain.'
    ],
    bullets4: [
      'Let \\(z = y^2\\) and \\(y = 3x + 1\\):',
      '\\(\\frac{dz}{dy} = 2y\\), \\(\\frac{dy}{dx} = 3\\).',
      '\\(\\frac{dz}{dx} = 2y \\cdot 3 = 6y = 6(3x+1) = 18x + 6\\).'
    ],
    bullets5: [
      'Q: "Why is the Chain Rule crucial for Deep Learning?"',
      'A: Backpropagation is the chain rule applied iteratively from the output layer back to the input layer to compute parameter gradients across hidden layers.'
    ]
  },
  {
    title: 'Gradient Descent',
    topic: 'Data Science & AI',
    difficulty: 'Medium',
    folderId: '4d6577e5-3c12-536d-a3e6-f9c129ba89c3',
    type: 'math',
    bullets1: [
      'Definition: Optimization algorithm that iteratively updates parameter values in the negative gradient direction to find loss function minimums.',
      'Learning Rate (\\(\\eta\\)): Scalar controlling the step size of parameter updates.',
      'Shorthand: Updates weights iteratively using \\(w \\leftarrow w - \\eta \\nabla L(w)\\).'
    ],
    bullets2: [
      'Update Rule: \\(w^{(t+1)} = w^{(t)} - \\eta \\nabla L(w^{(t)})\\)'
    ],
    bullets3: [
      'Model: Walking down a foggy hill by feeling the slope under your feet and taking steps downhill.'
    ],
    bullets4: [
      'Minimize \\(L(w) = w^2\\) with \\(\\eta = 0.1\\) starting at \\(w = 10\\):',
      '\\(\\nabla L = 2w\\). Step 1: \\(\\nabla L = 20\\). New \\(w = 10 - 0.1(20) = 8\\).',
      'Step 2: \\(\\nabla L = 16\\). New \\(w = 8 - 0.1(16) = 6.4\\).'
    ],
    bullets5: [
      'Q: "How does learning rate selection impact convergence?"',
      'A: An overly large learning rate causes updates to overshoot the minimum, leading to divergence. An overly small learning rate makes convergence extremely slow.'
    ]
  }
];
