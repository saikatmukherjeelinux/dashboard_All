# Thirty regex lessons

The app now has **100 lessons**, including 30 regex techniques and
text-processing recipes. These lessons use the browser's native
JavaScript regex engine. Their animations show **match-level operations**, not
the engine's internal automaton or backtracking steps.

Each lesson has editable multiline text, a pattern, flags, a simple guide, a
worked example, Python code, and replayable match spans/capture groups. Split
and replacement lessons also show their final transformed output.

| Category | Lesson | Default behavior |
|---|---|---|
| Foundations | Literal substring search | Find each `cat` |
| Foundations | Whole-word matching | Use `\b` to exclude larger words |
| Foundations | Case-insensitive search | Use `i` to match case variations |
| Foundations | Character-class filtering | Collect vowels |
| Foundations | Negated character classes | Collect punctuation-like runs |
| Foundations | Alternation | Match `cat` or `dog` |
| Foundations | Bounded repetition | Find words of length 3–5 |
| Quantifiers and anchors | Multiline line selection | Select lines beginning with uppercase letters |
| Quantifiers and anchors | Greedy matching | Match through the last usable `>` |
| Quantifiers and anchors | Lazy matching | Stop at the first usable `>` |
| Assertions | Positive lookahead | Extract labels followed by `:` |
| Assertions | Negative lookahead | Collect words except `cat` |
| Assertions | Positive lookbehind | Extract amounts following `$` |
| Assertions | Negative lookbehind | Exclude digit tokens preceded by `-` |
| Assertions | Overlapping matches | Capture `ana` at indices 1 and 3 in `banana` |
| Extraction | Capture groups | Extract year, month, and day fields |
| Extraction | Backreferences | Find adjacent repeated words |
| Extraction | Signed integers | Collect signed digit runs |
| Extraction | Decimal numbers | Collect ordinary decimal/integer fragments |
| Extraction | Email-shaped tokens | Extract a practical email-like shape |
| Extraction | HTTP URL tokens | Extract `http://` and `https://` candidates |
| Extraction | Word tokenization | Allow one internal apostrophe in ASCII words |
| Validation | IPv4 shape and ranges | Require four octets in 0–255, without leading zeros |
| Validation | 24-hour time | Check exact `HH:MM` |
| Validation | Identifier | Check a simple ASCII identifier rule |
| Validation | Password-rule lookaheads | Combine illustrative length/case/digit rules |
| Transformations | Delimiter splitting | Split on comma, semicolon, or whitespace runs |
| Transformations | Whitespace normalization | Collapse every whitespace run to one space |
| Transformations | Digit masking | Replace each digit with `#` |
| Transformations | Date reformatting | Reorder captures with `$3/$2/$1` |

## Input and result conventions

- Enter a JavaScript regex source without `/` delimiters. Empty patterns are
  allowed. Search is global and Unicode mode is always enabled.
- Flags: `i` for case-insensitivity, `m` for multiline anchors, and `s` to let
  dot match newlines. Each flag may appear once. Other flags are rejected.
- Text supports newlines. Limits are 256 Unicode code points for text, 160 for
  the pattern, and 80 UTF-16 code units for replacement text.
- Spans use `[start, end)` and Unicode code-point indices. These indices differ
  from native JavaScript UTF-16 offsets when the text contains astral symbols.
  Combining characters remain separate code points; text is not normalized.
- The match table shows full matches and numbered capture groups. An unmatched
  optional group is shown as `null`. Named captures still appear in numeric
  group order; there is no separate named-group view.
- Ordinary matches are non-overlapping. Use the overlapping-lookahead lesson
  to capture shared occurrences. Zero-width matches advance by a whole code
  point, including an end-of-text boundary, so they cannot loop forever.
- Validation requires the **entire** text, including a final newline, to match.
  It does not merely test whether a matching substring exists.
- Split retains empty pieces at the edges and does not insert captured
  delimiters into its output. This is an explicit teaching convention, which
  differs from native split APIs when delimiter captures are present.
- Replacement supports `$1`–`$9` and `$$`. An unmatched existing group expands
  to an empty string; a reference to a nonexistent group stays literal. `$&`,
  `$0`, named references, and backslash replacements are not expanded. Larger
  numbers are parsed one digit at a time, so `$10` means `$1` followed by `0`.

## Execution and complexity

Every editable browser pattern runs in a disposable Web Worker. A job exceeding
1.5 seconds is terminated and shows a recoverable error. Reset or selecting
another lesson cancels the earlier job. Results from cancelled jobs cannot
overwrite the current lesson. Workers are created from an in-memory Blob, so
opening `index.html` directly still works without a server or packages.

Runtime depends on pattern structure and the regex engine. Backtracking and
backreferences can lead to exponential behavior; short input is not a proof of
fast evaluation. No universal linear-time claim is made. Match-by-match scans,
substring copies, and stored animation snapshots add time and space beyond one
native regex operation. The timeout protects responsiveness, not algorithmic
complexity guarantees.

Email, URL, date, identifier, and password recipes explain their scope in the
lesson. They are practical teaching examples, not full standards implementations
or production security policies. Password symbols are allowed but not required
by the sample rule. Calendar dates are only shape-matched.

## Python and source files

`python_examples/regex_algorithms.py` provides a common Python `re` reference.
Every displayed example includes the function and a runnable recipe call, so it
can be copied as a standalone script. JavaScript and Python regex syntax,
Unicode classes, boundaries, case folding, and lookbehind support can differ.
The supplied default examples agree; arbitrary edited patterns are not promised
to work identically. Python examples do not impose the browser worker timeout.

The catalogue in `assets/regex-catalog.js` defines all 30 recipes and guides.
`assets/regex-engine.js` implements match traces and transformations;
`assets/regex-lessons.js` manages controls, workers, and visualization.

Regenerate samples and run checks from the project root:

```sh
node tools/build_regex_samples.cjs
python -m unittest discover -s tests -v
node tests/regex-engine.cjs
node tests/animations.cjs
```

The builder generates `assets/regex-python.js` and
`python_examples/regex_recipes.json` from the catalogue and tested Python source.
The regex engine suite checks 261 cross-language cases, including empty matches,
overlaps, captures, replacements, Unicode spans, and full-input validation.
Python tests also execute all 30 displayed samples and check known expected
results and invalid validation examples.

With Playwright and Microsoft Edge available:

```sh
node tests/regex-browser.cjs
node tests/browser-smoke.cjs
node tests/string-browser.cjs
```

Browser checks cover results, playback, flags, errors, mobile overflow, worker
timeout/recovery, cancellation, persistent completion, and the existing lessons.
