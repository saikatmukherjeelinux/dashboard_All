# String algorithms

The catalogue now has **100 lessons**, including **20 dedicated string lessons** in
addition to the existing KMP lesson. Every new lesson includes an editable
example, operation snapshots, a simple guide, a worked example, complexity
notes, and standalone Python code.

## New lessons

| Category | Algorithm | Result |
|---|---|---|
| Matching | Z algorithm | All exact pattern start indices |
| Matching | Rabin–Karp | All matches using rolling hashes and exact verification |
| Matching | Boyer–Moore–Horspool | All matches using right-to-left comparisons and shifts |
| Matching | Aho–Corasick | Word and start index for each dictionary match |
| Indexes | Trie autocomplete | Sorted words beginning with the supplied prefix |
| Indexes | Suffix array by prefix doubling | Suffix start indices in lexicographic order |
| Indexes | Kasai LCP | Common-prefix lengths of neighboring sorted suffixes |
| Palindromes | Manacher | One longest continuous palindrome |
| Palindromes | Longest palindromic subsequence | Length of a palindrome allowing skipped characters |
| Palindromes | Minimum palindrome cuts | Fewest boundaries needed to make palindrome pieces |
| Dynamic programming | Longest common subsequence | One longest ordered sequence shared by two strings |
| Dynamic programming | Longest common substring | One longest continuous shared stretch |
| Dynamic programming | Levenshtein distance | Fewest insertions, deletions, and replacements |
| Dynamic programming | Shortest common supersequence | One shortest string containing both as subsequences |
| Dynamic programming | Word break | Whether reusable dictionary words can cover the text |
| Dynamic programming | Count matching subsequences | Number of position selections forming the target |
| Dynamic programming | Wildcard matching | Whether the entire text matches a `?` / `*` pattern |
| Sliding windows | Minimum window substring | Shortest window covering required character counts |
| Sliding windows | Anagram windows | All starts of fixed-size rearrangements of a pattern |
| Sliding windows | Longest substring without repeats | One longest window containing distinct characters |

## Controls and conventions

- Select a lesson, edit Text and its labeled second input, then press Reset or
  leave the edited field to rebuild the trace. One-string lessons hide the
  second input. Random numeric input is disabled for string lessons.
- Previous, Next, Play, Speed, and the timeline work with every trace.
- Dictionary lessons use comma-separated words. Outer spaces are trimmed,
  duplicates are removed, and blank words are ignored. Empty dictionary words
  are not treated as matches.
- Matching is case-sensitive. Text indices count Unicode code points, matching
  Python's indexing. Combining marks are separate code points; inputs are not
  normalized. Other than dictionary trimming, whitespace is meaningful.
- New lessons accept at most 32 text code points, 24 second-input code points,
  or 100 dictionary code points. These limits keep complete traces readable.
  Python reference functions have no UI length limit.
- Z, Rabin–Karp, Horspool, and anagram searches include overlapping matches.
  An empty pattern matches all `n + 1` boundaries in those lessons. KMP retains
  its existing first-match behavior: an empty pattern returns 0.
- Minimum window returns an empty string for an empty requirement or no valid
  window. Wildcards match the entire string, with only `?` and `*` special.
- Tables show prefix lengths including the empty prefix, or interval start/end
  indices as labeled. The final frame retains the completed table. Long tables
  scroll inside the visualization on narrow screens.
- Complexity describes the algorithm, excluding stored animation snapshots.
  Lesson notes explain the extra cost of this implementation's suffix sorting,
  Aho–Corasick construction, substring slicing, and autocomplete sorting.

## Source and verification

- `assets/string-engine.js`: pure JavaScript algorithms and immutable trace frames.
- `assets/string-lessons.js`: catalogue entries, guides, input controls, table rendering.
- `python_examples/strings.py`: Python reference implementations.
- `tools/build_string_samples.py`: generates `assets/string-python.js` directly
  from the Python functions, including any required helper functions.

From the project root:

```sh
python tools/build_string_samples.py
python -m unittest discover -s tests -v
node tests/animations.cjs
node tests/string-engine.cjs
```

Python tests compare all 20 implementations with small-input independent
oracles. JavaScript trace tests compare against Python on deterministic random
and boundary cases, including Unicode and empty inputs. They need Python on
PATH, a `PYTHON` environment variable pointing to it, or the bundled runtime.

With Playwright and Microsoft Edge available, browser checks can also run:

```sh
node tests/browser-smoke.cjs
node tests/string-browser.cjs
```

These cover all lessons, input changes, controls, mobile overflow, validation,
HTML escaping, completion persistence, and navigation filtering.
