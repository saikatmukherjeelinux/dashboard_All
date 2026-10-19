# Twenty-seven additional interview algorithms

The catalogue has **100 interactive lessons** and **200 integrated interview
questions**. This addition contributes 27 lessons and 54 detailed Q&As. Every
new algorithm has a worked beginner guide, immutable operation frames,
previous/next/playback/speed controls, timeline scrubbing, editable inputs,
valid randomized examples, Python code, and saved completion.

## Selection and public preparation sources

These are broadly useful coding-interview patterns for preparation across
Google, Meta, Amazon, and other large employers. The selection prioritizes
problem-solving coverage, not a claim that an employer currently asks a
particular question or asks it at a particular frequency.

Public preparation material reviewed on 18 October 2026:

- [Amazon's software development interview topics](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics)
  emphasizes applying data structures, algorithms, coding, and computer science
  fundamentals. It also recommends confirming role-specific topics with the
  recruiting contact.
- [Life at Google's coding interview preparation](https://www.youtube.com/watch?v=6ZZX9iIgFoo)
  covers algorithms/data structures, communication, coding, testing, and error
  checking. It is official general preparation, not a current question list.

Company-specific requirements can vary by role. The examples, guides, and Q&As
are original teaching material organized around the broad patterns below,
rather than an employer-attributed question bank.

## The 27 lessons

| # | Lesson | Pattern / returned answer |
|---|---|---|
| 1 | Two sum | Complement map; two distinct original indices or [] |
| 2 | Three sum | Sorted pointers; unique zero-sum value triples |
| 3 | Product except self | Prefix and suffix products without division |
| 4 | Subarray sum equals K | Prefix-frequency map; count nonempty ranges |
| 5 | Longest consecutive sequence | Hash-set run starts; longest length |
| 6 | Trapping rain water | Two pointers; total unit-width volume |
| 7 | Container with most water | Dominance-based pointers; maximum pair area |
| 8 | Dutch national flag | In-place core partition over 0, 1, 2 |
| 9 | Search rotated sorted array | Binary search over distinct rotated values |
| 10 | Merge intervals | Sort and merge overlapping/touching ranges |
| 11 | Meeting rooms II | Active end-time heap; peak concurrent demand |
| 12 | Top K frequent | Frequency map and bounded min heap |
| 13 | Kth largest quickselect | Three-way rank partition; duplicates count |
| 14 | Next greater element | Monotonic stack; first greater value to the right |
| 15 | Sliding window maximum | Monotonic deque; one maximum per full window |
| 16 | Jump game | Farthest reachable frontier; Boolean reachability |
| 17 | Gas station | Circular greedy elimination; feasible start or −1 |
| 18 | House robber | Rolling take/skip prefix optimum |
| 19 | Equal subset partition | Descending 0/1 sum reachability |
| 20 | 0/1 knapsack | Descending capacity DP; maximum reward |
| 21 | Subsets | Increasing-index backtracking; empty subset included |
| 22 | Permutations | Choose/undo unused indices; all orderings |
| 23 | Combination sum | Positive reusable candidates; unique combinations |
| 24 | N-Queens | Row/column/diagonal backtracking; all boards |
| 25 | Number of islands | Four-directional grid BFS; component count |
| 26 | Union–find connectivity | Path compression and union by size; groups/count |
| 27 | Fenwick tree | Point additions followed by inclusive range sums |

## Inputs and conventions

Each lesson supplies a valid JSON object. Change its fields and press Reset,
Ctrl+Enter, or leave the edited input to rebuild the trace. Randomize creates a
fresh valid example. Structured JSON lets grids, paired arrays, intervals, and
multiple queries be edited without separate fixed demos.

- General arrays have at most 20 integer values in −100…100. Specialized fields
  narrow that range when needed. Targets for sum problems are −200…200.
- Heights and jump lengths are nonnegative. Jump means a maximum permitted
  forward distance. An empty jump array returns false; an empty robber array
  returns 0, and taking no houses is permitted.
- Product arithmetic rejects unsafe JavaScript integers instead of rounding.
  A singleton product-except-self input returns [1].
- Rotated search requires distinct values forming a legal cyclic rotation;
  validation is O(n), separate from O(log n) search.
- Intervals have at most 16 pairs with start < end. Merge combines touching
  closed ranges; meetings use half-open ranges and release rooms at equal times.
- Top-k ties favor smaller numeric values. k can be 0 for an empty result.
  Kth-largest rank is 1-based and includes duplicate occurrences.
- The next-greater output uses −1 for absence; with negative inputs this can
  also be a legitimate greater value. Use index/null results in an API that
  must distinguish them. Empty window-max input requires k=0.
- Partition uses nonnegative values totaling at most 200. Empty subsets are
  allowed. Knapsack supports 16 items, capacities/weights up to 40, rewards up
  to 100, and zero-weight items that may each be selected once.
- Subsets allow 10 distinct values; permutations allow 6 distinct values.
  Empty input produces one empty subset/permutation. Combination sum accepts
  positive candidates and target 0…24; target 0 produces one empty combination.
- N-Queens uses n=1…8 and counts reflected/rotated boards separately. The final
  board view shows the first solution if one exists; the output lists all boards.
- Islands use a rectangular numeric 0/1 grid up to 8×8. Diagonals do not connect
  islands. The trace labels copied land cells without changing input.
- Union–find uses 1…12 vertices and up to 24 edges, including duplicates and
  self-loops. Only a successful root merge decreases the component count.
- Fenwick uses up to 16 values, 8 [index,delta] additions, and 8 inclusive
  [left,right] queries. All additions happen before the queries. Public indices
  are zero-based; internal tree index 0 is unused.

Teaching traces stop at 10,000 frames and ask for a smaller input if necessary.
The lesson notes distinguish core algorithm storage from copied inputs, full
output, and saved frames. Enumerating backtracking answers is inherently
output-sensitive. Quickselect uses a deterministic midpoint-value pivot and
does not claim a worst-case linear-time guarantee.

## Sources and verification

- `assets/interview-pattern-engine.js`: pure algorithms and snapshot engine.
- `assets/interview-pattern-catalog.js`: 27 lesson contracts, guides, examples.
- `assets/interview-pattern-lessons.js`: JSON controls, random examples, grids,
  trace rendering, and existing playback integration.
- `assets/interview-pattern-questions.js`: 54 intermediate/advanced discussions
  with reasoning, examples, complexity, and follow-up traps.
- `python_examples/interview_patterns.py`: runnable reference functions.

Regenerate the catalogue fixture and Python samples after source edits:

```sh
node tools/build_pattern_catalog.cjs
python tools/build_pattern_samples.py
```

The builder writes `assets/pattern-python.js` directly from tested function
source, so every displayed sample is independently runnable. Python references
support larger inputs than the teaching UI but assume their documented domains.

```sh
python -m unittest discover -s tests -v
node tests/pattern-engine.cjs
node tests/animations.cjs
```

Python tests use brute-force or alternative small-input oracles for all 27
algorithms. The JavaScript suite compares 837 deterministic default/random cases
against those references, verifies input preservation, exercises validation, and
checks 8-Queens and all 720 permutations of six distinct values.

With Playwright and Microsoft Edge available:

```sh
node tests/pattern-browser.cjs
node tests/interviews-browser.cjs
node tests/browser-smoke.cjs
```

These cover new/editable/randomized inputs, playback, timelines, grids, Python
code, all 200 Q&As, keyboard access, mobile overflow, validation recovery, saved
completion, and preservation of the profile link and copyright footer.
