# Content provenance

The full source is `content/python-notes.md`, copied unchanged from the user-supplied **Python_Notes_Theory (1).md**. There are 104 numbered top-level questions spanning 1–105, with 43 absent. Repeated topics are retained intentionally for revision.

The content generator recognizes increasing numbered headings outside code fences, preserves question IDs, strips copied `python / Copy code` interface labels from code fences, and assigns topic groups and estimated reading times. Raw HTML in source notes is escaped by the website renderer. Source content is read-only in the website.

The quiz questions and simulations are authored additions. They focus on the source concepts rather than generating trivial questions from repeated source text. The quiz does not claim to cover each numbered question individually. Python examples in the notes are for reading and local execution, not a sandbox inside this application.

## Visible clarifications

1. **GIL (question 1):** PEP 684 targets Python 3.12 for per-interpreter GIL support. Free-threaded builds are available starting with Python 3.13. The original notes incorrectly associate per-interpreter GIL support with 3.2. The website shows a correction above that lesson and qualifies the quiz discussion as GIL-enabled CPython.
   - https://peps.python.org/pep-0684/
   - https://docs.python.org/3/howto/free-threading-python.html
2. **Finalizers (questions 41 and 76):** `del` removes a binding; it is not a guaranteed direct call to a finalizer. Modern CPython can collect many cycles with finalizers; the blanket claim that all such cycles are uncollectable is outdated. Resource cleanup should use a context manager when deterministic behavior is needed.
   - https://docs.python.org/3/reference/datamodel.html#object.__del__
3. **Circular imports (questions 30, 55 and 104):** local imports can defer import-time dependency resolution. The example functions that call each other still recurse without a stopping condition. The website flags this separately from import behavior.

These are targeted clarifications, not a full audit of every claim in the notes. The original source is retained so the adaptation remains inspectable.

## Expanded coding examples

Every lesson has three additional examples; the original context-management lessons have four. Each example includes its own runnable Python snippet, expected standard output, and at least two detailed explanation steps. A simplest-summary card is the final learning-content section for every topic. Source-lesson additions are maintained in `content/examples/`; new conceptual lessons are maintained in `content/additional/`. Both are generated into the lesson bank by `scripts/build-content.cjs`.

There are **604 example placements across 200 lessons**, drawn from **154 concept packs** containing **462 distinct runnable snippets**. Repeated source questions on the same concept intentionally reuse relevant examples and summaries. The original source-note examples are preserved separately and are not included in authored-snippet execution checks.

All 462 distinct authored snippets were executed with **CPython 3.12.14** and compared against their displayed stdout. `tests/examples.py` repeats that validation. Python 3.11+ is required for additions including exception groups and TaskGroup. Examples use only the standard library, keep outputs deterministic where practical, and catch intentionally demonstrated exceptions. The assertion-tuple example may also emit a SyntaxWarning on stderr; its explanation calls that out. The circular-import examples are explicitly labeled single-file models rather than falsely claiming to reproduce a multi-file import cycle.

## Fifty additional conceptual questions

Questions **106–155** are authored additions, not claims of extra content in the original source file. Every question includes a direct answer, use cases, a common mistake, three checked examples with explanations, and a simplest summary. The source file remains unchanged, and existing lesson IDs retain their meaning for saved bookmarks and completion. The app now displays 200 lessons and includes all additions in search, navigation, and flashcards. The **Added concepts (96)** filter includes the authored additions; **Previous 36 concepts** isolates lessons 156–191. The quiz bank now includes 500 questions; the subsequent visual-lab extension is documented below.

## Visual-lab expansions

The Visual lab contains **100 experiments**: six original traces, fifty first-expansion traces, and forty-four second-expansion traces. There are **41 scene-renderer families**, with named variants such as pipelines versus sieves, trees versus fan-out, and clocks versus orbital composition. Some variants intentionally share rendering primitives; named variants are not claimed to be independent animation engines. SVG groups keep stable keys so objects can move between positions; gauges and balances rotate; charts, pointers, selected regions, and ownership links change according to their trace states. Resizing relays out the current frame rather than shrinking a desktop diagram into unreadable mobile text.

New experiments attach to checked examples already present in the authored lesson bank. All **94 linked Python snippets** were executed again and compared with their displayed output. Simulation geometry and timing are teaching models rather than CPython memory layout, exact interpreter internals, benchmark results, or general-purpose parsers. Stable-sort movement illustrates the stable ordering result, not Python’s internal sorting implementation; the four hash buckets are explicitly illustrative. Semaphore admission is distinguished from rate limiting, and cancellation remains cooperative.

The [complete catalogue](VISUAL_LAB.md) lists names, renderer styles, and related lesson IDs. Browser validation covers every experiment, all **451 trace frames**, playback, pause, timeline scrubbing, search/filtering, deep links, reduced motion, resize, and all 94 added layouts on a phone viewport. Lesson and quiz regression checks also pass.

Primary reference material for the authored additions:

- [Python data model](https://docs.python.org/3/reference/datamodel.html) — attribute protocols, special methods, instance creation, and finalization.
- [functools](https://docs.python.org/3/library/functools.html) — caching, wraps, reduction, and single dispatch.
- [contextlib](https://docs.python.org/3/library/contextlib.html) — generator context managers, suppress, and ExitStack.
- [Asyncio tasks](https://docs.python.org/3/library/asyncio-task.html) — coroutine execution, gather, task scheduling, and cancellation.
- [Python control flow](https://docs.python.org/3/tutorial/controlflow.html) — parameter conventions, defaults, and pattern matching.
- [Typing](https://docs.python.org/3/library/typing.html) — protocols, type variables, and TypedDict.
- [Enum](https://docs.python.org/3/library/enum.html) — named choices, conversion, and alias behavior.

The second expansion adds a **Latest 44 additions** collection filter while retaining the original six and first fifty collections. Its topics include argument unpacking, scope assignments, callback binding, representations, annotations, signature inspection, metadata, exceptions, construction, ABCs, mixins, observers, descriptors, name mangling, class/instance state, weak caches, paths, encodings, JSON container types, CSV writing, NaN, fractions, numeric inheritance, case folding, protocols, generics, TypedDict, logging, mocks, entry points, relative imports, context variables, and TaskGroup cleanup.

### Quiz arena: 100 additional questions

The first quiz extension added 100 questions to the original 58, covering lessons 106–155. The subsequent 342-question extension brings the current total to 500. Each new lesson has one conceptual question and one code-output question, with four choices, detailed feedback, and a related lesson link. Use the collection filter to practice the new 100, original 58, or all questions. Code and multiline output retain their formatting in questions and review. Existing quiz IDs and saved attempts remain valid.

The additions live in `assets/quizzes-more.js`. Its 50 code-output questions reuse lesson examples; `node tests/quiz-manifest.cjs` followed by `python tests/quiz-examples.py` executes each snippet and compares its stdout with the correct answer.

### Quiz arena: 342 more questions, 500 total

The latest batch adds 68 conceptual questions and 274 code-output questions. Its programs are distinct from the 50 code questions in the earlier batch, giving the full bank 324 distinct runnable programs. Topics include object lifetimes, generators, decorators, descriptors, inheritance, concurrency, typing, exceptions, data formats, collections, testing, and numerical behavior. Every question has four distinct choices, explanatory feedback, and a related lesson link.

Choose **Newest 342 questions**, **Previous 100 questions**, **Original 58 questions**, or all 500. Topic filters and 10-question, 20-question, or all-matching sessions work with each collection. Existing question IDs q1–q158 and saved attempts retain their meaning; new IDs are q159–q500.

The source for the conceptual additions is `content/quiz-342-concepts.txt`. Run `npm run build:quiz` to rebuild `assets/quizzes-342.js`, which also selects distinct worked examples and supplies output distractors. Run `npm test`, `npm run test:quiz-examples`, and `npm run test:browser` to validate the bank, execute all 324 programs, and exercise quiz interactions.

### Learn concepts: 36 additional topics

Lessons **156–191** add slicing, range, dictionary views, set algebra, join, splitting, format specifications, bytearray, ChainMap, mapping proxies, typed arrays, struct, groupby, tee, accumulate, cached_property, operator helpers, secrets, local random generators, hashlib, HMAC, Base64, URL parsing, statistics, approximate comparisons, timeit, pprint, textwrap, argparse, ConfigParser, temporary files, SQLite, subprocesses, ZIP archives, singledispatchmethod, and dataclass replacement/conversion.

Each includes a direct answer, use cases, a common mistake, three independently runnable examples with expected outputs and two explanatory paragraphs each, and a simplest summary at the end. The 36 lessons and 108 examples are authored in `content/additional/{collections-text,tools-security,applications}-36.cjs` and regenerated with `npm run build:content`. They are included in search, bookmarking, completion, navigation, and the 200-card flashcard deck. Existing lesson IDs and quiz questions retain their meaning.

### Learn concepts: 10 more topics, 200 total

Lessons **192–201** cover TOML configuration, IP address and network values, filename wildcard matching, combinatorial iterators, trusted pickle graphs, total_ordering, UserDict mappings, Gregorian calendar calculations, XML trees, and HTML escaping/parsing. Each has a direct answer, use cases, a common mistake, three checked examples with expected output and detailed explanations, and a simplest summary at the end.

Use **Newest 10 concepts** to browse this batch, **Previous 36 concepts** for the preceding batch, or **Added concepts (96)** for every authored addition. The source is `content/additional/practical-10.cjs`; run `npm run build:content` to rebuild the lesson asset. All 200 lessons participate in search, navigation, bookmarking, completion, and flashcards. The lesson bank now contains 604 example placements and 462 distinct runnable snippets.
