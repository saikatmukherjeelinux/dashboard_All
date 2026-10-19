# ◈ DSA Motion Lab

**An interactive, animated Data Structures & Algorithms learning website.**

Understand algorithms by watching each operation, controlling playback, inspecting complexity, and reading runnable Python implementations.

## ✨ Features

- 🌌 Dark neon interface with responsive sidebar and smooth animated bars, nodes, graphs, and trees
- ▶️ Play / pause / previous / next controls, plus adjustable animation speed
- ✍️ Custom numeric inputs (up to 16 numbers) for most lessons
- 🐍 Read and copy complete Python examples
- 🧮 Explanations and time/space complexity notes
- 🧰 No framework, build system, CDN, Python dependency, or external font required
- 🧪 Python standard-library `unittest` suite

- Search the lesson catalogue, randomize inputs, and set custom search targets
- Scrub the animation timeline and save lesson completion in your browser
- 200 integrated interview questions: one intermediate and one advanced question in each of the 100 lesson sections, with reasoning, worked examples, complexity notes, and trade-offs
- A separate Quiz Arena with 200 four-option questions across all 100 topics, instant answer explanations, filters, shuffled choices, scoring, saved attempts, and retry-missed practice

## 📚 Available interactive lessons

| Category | Lessons |
|---|---|
| Sorting | Bubble sort, Selection sort, Insertion sort, Merge sort, Quick sort, Heap sort |
| Searching | Linear search, Binary search |
| Linear structures | Stack, Queue, Singly linked list |
| Graphs | Breadth-first search (BFS), Depth-first search (DFS) |
| Trees | Binary search tree insertion |
| Array patterns | Prefix sums |
| Dynamic programming | Maximum subarray (Kadane), Fibonacci table |
| Advanced graphs | Dijkstra shortest paths, Kruskal minimum spanning tree, Kahn topological sort |
| Advanced dynamic programming | Longest increasing subsequence, minimum coin change |
| Strings | KMP pattern matching |
| More string matching | Z algorithm, Rabin–Karp, Boyer–Moore–Horspool, Aho–Corasick |
| String indexes | Trie autocomplete, Suffix array, Kasai LCP |
| Palindromes | Manacher, Longest palindromic subsequence, Minimum palindrome cuts |
| String DP | LCS, Longest common substring, Edit distance, Shortest common supersequence, Word break, Count matching subsequences, Wildcard matching |
| String windows | Minimum window, Anagram windows, Longest substring without repeats |
| Regex foundations | Literals, boundaries, case-insensitive matching, classes, negation, alternation, bounded repetition |
| Regex quantifiers and anchors | Multiline lines, Greedy matching, Lazy matching |
| Regex assertions | Positive/negative lookahead, Positive/negative lookbehind, Overlapping matches |
| Regex extraction | Captures, Backreferences, Integers, Decimals, Email-shaped tokens, HTTP URL tokens, Words |
| Regex validation | IPv4 shape and range, 24-hour time, Identifiers, Password-rule lookaheads |
| Regex transformations | Splitting, Whitespace normalization, Digit masking, Capture-based date reformatting |

| Interview arrays and hashing | Two sum, Three sum, Product except self, Subarray sum equals K, Longest consecutive sequence, Dutch national flag |
| Interview pointers and search | Trapping rain water, Container with most water, Search rotated sorted array |
| Interview intervals and heaps | Merge intervals, Meeting rooms II, Top K frequent, Kth largest quickselect |
| Interview monotonic structures | Next greater element, Sliding window maximum |
| Interview greedy and DP | Jump game, Gas station, House robber, Equal subset partition, 0/1 knapsack |
| Interview backtracking | Subsets, Permutations, Combination sum, N-Queens |
| Interview grids and range queries | Number of islands, Union–find connectivity, Fenwick tree |

**100 interactive lessons included.** This is an extensible foundation, not an exhaustive implementation of every DSA topic.

## 🚀 Run locally

1. Download / clone this repository.
2. Open `index.html` in Chrome, Edge, Firefox, or Safari.

Optional local server (Python installed):

```bash
python -m http.server 8000
```

Visit `http://localhost:8000`.

Run the code samples:

```bash
python python_examples/algorithms.py
```

Run tests from the project root:

```bash
python -m unittest discover -s tests -v
```

## 📦 Project layout

```text
dsa-motion-lab/
├── index.html                # Learning studio
├── assets/
│   ├── style.css             # Responsive neon UI + transitions
│   └── app.js                # Lesson metadata + animation step engine
├── python_examples/
│   ├── __init__.py
│   └── algorithms.py         # Tested reference functions
├── tests/
│   └── test_algorithms.py
├── docs/
│   └── ROADMAP.md            # Suggested complete DSA curriculum
├── .gitignore
├── LICENSE
└── README.md
```

## 🌐 Publish with GitHub Pages

1. Create a **public** repository on GitHub (suggested name: `dsa-motion-lab`).
2. Upload these files, keeping the same folder structure.
3. Go to **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, branch `main`, folder `/(root)`, then Save.
5. Your website will appear at `https://YOUR-USERNAME.github.io/dsa-motion-lab/` once GitHub deploys it.

If using Git locally:

```bash
git init
git add .
git commit -m "Launch animated DSA learning lab"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/dsa-motion-lab.git
git push -u origin main
```

Create the empty repository on GitHub before the final push. Replace `YOUR-USERNAME` with your own username.

## 🧠 Learning workflow

1. Read the concept and complexity.
2. Press **Next** to inspect the first operation.
3. Use **Play** to watch the full animation.
4. Read the Python implementation and run it locally.
5. Modify the input, predict the output, and compare your expectation.
6. Reimplement the algorithm yourself, then add tests.

## 🛣️ Expand the curriculum

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for an ordered curriculum covering Big O, arrays, recursion, hashing, heaps, trees, graphs, greedy, dynamic programming and advanced patterns.

## License

MIT. See [LICENSE](LICENSE).

## Advanced lessons

Every advanced lesson includes a beginner guide, a worked example, a replayable trace, complexity notes, and a runnable Python implementation. Graph lessons use fixed labeled sample graphs. LIS accepts custom numeric input. Coin change accepts positive integer denominations and a target amount from 0 to 40 (unlimited coins). KMP accepts custom text and pattern, including an empty pattern, and returns the first matching index.

Run animation checks with `node tests/animations.cjs`.

## Twenty additional string lessons

The new string lessons include editable text, algorithm-specific second inputs, animated tables, simple explanations, and runnable Python code. See [the string lesson guide](docs/STRING_ALGORITHMS.md) for all 20 additions, input conventions, source files, and verification commands.

## Thirty regex lessons

Regex lessons include editable multiline text, patterns, flags, capture tables, replacement controls, simple guides, and Python examples. They show match-level operations. Browser evaluation runs in a worker with a 1.5-second timeout. See [the regex lesson guide](docs/REGEX_ALGORITHMS.md) for all 30 recipes, conventions, implementation limits, and verification commands.

## Interview practice inside each lesson

Choose any existing algorithm, string, or regex lesson, then scroll below its simple explanation to **Interview Q&A**. Open the intermediate or advanced question to reveal its detailed answer, worked example, and complexity/trade-off discussion. Questions belong to the selected lesson and do not add a separate sidebar path.

The source banks are `assets/interview-core.js`, `assets/interview-strings.js`, `assets/interview-regex.js`, and `assets/interview-pattern-questions.js`; `assets/interview.js` renders the selected lesson's questions. Run `node tests/interviews-browser.cjs` with Playwright and Microsoft Edge available to verify all 200 questions, keyboard access, mobile layout, and lesson/playback integration.

## Quiz Arena

Select **Quiz Arena** above the main content to enter a separate practice screen. Filter by category, topic, and difficulty, then choose 10, 20, 50, or all matching questions. Each topic has one intermediate and one advanced multiple-choice question.

Every question shows exactly four shuffled options. Selecting one immediately reveals the correct choice, detailed reasoning, a worked example, and complexity/trade-off notes. The first answer is final for that attempt. Review results, retry only missed questions, or open the corresponding interactive lesson without losing quiz progress. Quiz progress is saved separately from lesson completion, and attempts can resume after a reload when local storage is available.

See [the quiz guide](docs/QUIZ_ARENA.md) for behavior, content maintenance, and verification. Run `node tests/quiz-engine.cjs` for content/state checks and `node tests/quiz-browser.cjs` with Playwright and Microsoft Edge for all-question interaction and mobile checks.

## Twenty-seven more interview algorithms

The additional interview-pattern lessons bring the catalogue to 100. Each has editable problem inputs, valid randomized examples, replayable operation frames, simple guides, Python code, and integrated intermediate/advanced Q&A. Structured problems use an editable JSON example for arrays, targets, intervals, grids, item weights, or updates and queries. Press Reset or Ctrl+Enter after editing. See [the interview-pattern guide](docs/INTERVIEW_PATTERNS.md) for the full list, input conventions, preparation sources, and verification commands.
