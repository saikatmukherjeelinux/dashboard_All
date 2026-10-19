# Visual lab catalogue

100 experiments: six original traces, fifty first-expansion additions, and forty-four latest additions. The added experiments use 41 renderer families with named variants, producing a mix of memory maps, moving stacks, conveyor routes, branches, trees, gauges, dials, charts, Venn regions, text scanners, numerical models, and synchronization scenes.

## Using the library

Open Visual lab, search by concept, and filter by collection, concept group, or animation style. The Latest 44 additions collection isolates the newest batch. The direct selector lists every experiment; Surprise me picks a different one. Use Back, Step, Reset, Play/Pause, speed, and the timeline to inspect the trace. A deep link such as `#lab/set-venn` restores a selected experiment. Each new experiment has a related lesson link and checked Python output.

The diagrams are illustrative simulations rather than a Python execution sandbox or a claim about CPython's exact storage and scheduling implementation. Every status line explains its corresponding frame; scene geometry uses responsive layout and respects reduced-motion preferences. Some renderers share primitives while using different scene structures and behaviors.

## Experiments

| # | Experiment | Visual style | Related question | Frames |
| --- | --- | --- | --- | --- |
| 1 | References & copies | Original trace | Original collection | 4 |
| 2 | Generator lifecycle | Original trace | Original collection | 7 |
| 3 | Decorator call stack | Original trace | Original collection | 6 |
| 4 | Method resolution order | Original trace | Original collection | 5 |
| 5 | Async task scheduling | Original trace | Original collection | 6 |
| 6 | LRU cache explorer | Original trace | Original collection | 8 |
| 7 | LEGB scope radar | scope | 106 | 5 |
| 8 | Closure capture map | memory | 15 | 5 |
| 9 | Argument docking station | binder | 108 | 5 |
| 10 | Mutable-default echo | aliases | 107 | 5 |
| 11 | Recursion tower | stack | 148 | 7 |
| 12 | Partial-application gears | gears | 147 | 5 |
| 13 | Comprehension factory | factory | 110 | 5 |
| 14 | Map/filter sieve | sieve | 57 | 4 |
| 15 | Yield-from relay | lanes | 42 | 5 |
| 16 | Zip zipper | zipper | 146 | 4 |
| 17 | Short-circuit gate | circuit | 113 | 4 |
| 18 | Truthiness switchboard | decision | 113 | 4 |
| 19 | Pattern-matching decision tree | branch | 112 | 5 |
| 20 | Exception cascade | waterfall | 117 | 4 |
| 21 | Context-manager airlock | airlock | 11 | 5 |
| 22 | Exception-group splitter | fanout | 120 | 5 |
| 23 | Cycle-collection sweeper | gc | 56 | 5 |
| 24 | Weak-reference ghost bridge | weak | 26 | 4 |
| 25 | Slots blueprint | blueprint | 13 | 5 |
| 26 | Descriptor lookup elevator | elevator | 34 | 5 |
| 27 | Property validation gauge | gauge | 24 | 4 |
| 28 | Metaclass class forge | factory | 5 | 5 |
| 29 | Single-dispatch rail junction | junction | 88 | 5 |
| 30 | Enum selection dial | dial | 135 | 5 |
| 31 | Dataclass assembly ledger | ledger | 36 | 5 |
| 32 | Hash-bucket router | buckets | 62 | 5 |
| 33 | Counter live histogram | bars | 131 | 6 |
| 34 | Defaultdict grouping garden | groups | 131 | 5 |
| 35 | Deque shunting train | deque | 132 | 5 |
| 36 | Heap priority tree | heap | 133 | 5 |
| 37 | Bisect boundary scanner | numberline | 134 | 4 |
| 38 | Stable-sort card dance | sort | 115 | 4 |
| 39 | Set-operation Venn stage | venn | 39 | 5 |
| 40 | List-alias mutation ripple | aliases | 45 | 4 |
| 41 | Tuple slot locks | grid | 45 | 4 |
| 42 | Memoryview buffer window | window | 69 | 5 |
| 43 | Unicode composition orbit | orbit | 129 | 4 |
| 44 | Regex scanning ribbon | ribbon | 130 | 5 |
| 45 | F-string interpolation ribbon | typewriter | 17 | 4 |
| 46 | JSON structure tree | json | 123 | 5 |
| 47 | CSV quote-state tape | parser | 124 | 5 |
| 48 | Floating-point balance | balance | 126 | 4 |
| 49 | Decimal rounding cursor | rounding | 126 | 5 |
| 50 | Timezone conversion clock | clock | 125 | 4 |
| 51 | Threads vs processes lanes | lanes | 31 | 5 |
| 52 | Lock-protected intersection | crossing | 1 | 5 |
| 53 | Semaphore permit pool | pool | 154 | 6 |
| 54 | Event signal waveform | wave | 153 | 4 |
| 55 | Producer/consumer conveyor | pipeline | 152 | 5 |
| 56 | Async cancellation state machine | states | 16 | 5 |
| 57 | Starred-unpacking catcher | binder | 109 | 4 |
| 58 | Nested-record unfolding | tree | 109 | 4 |
| 59 | Comprehension scope bubble | scope | 110 | 4 |
| 60 | Walrus value capture | ribbon | 111 | 4 |
| 61 | Chained-comparison checkpoint | decision | 114 | 4 |
| 62 | Global/nonlocal binding routes | memory | 106 | 4 |
| 63 | Late-binding callback ledger | ledger | 15 | 4 |
| 64 | Independent closure counters | memory | 15 | 4 |
| 65 | Representation display lanes | lanes | 8 | 4 |
| 66 | Callable-instance counter dial | gauge | 18 | 4 |
| 67 | Annotation vs runtime portal | type-portal | 19 | 4 |
| 68 | Signature inspection binder | binder | 47 | 4 |
| 69 | Decorator metadata passport | passport | 72 | 4 |
| 70 | Custom-exception payload passport | passport | 118 | 4 |
| 71 | Exception cause chain | cause-chain | 116 | 4 |
| 72 | EAFP lookup fallback | decision | 119 | 4 |
| 73 | Frozen dataclass key vault | schema | 36 | 4 |
| 74 | Instance construction assembly | factory | 28 | 4 |
| 75 | Subclass constructor routing | junction | 7 | 4 |
| 76 | Abstract-class contract checklist | blueprint | 51 | 4 |
| 77 | Mixin capability tree | tree | 96 | 4 |
| 78 | Observer broadcast hub | broadcast | 97 | 4 |
| 79 | Descriptor backing-store groups | groups | 34 | 4 |
| 80 | Private-name collision blueprint | blueprint | 144 | 4 |
| 81 | Class-attribute shared basket | aliases | 145 | 4 |
| 82 | Instance shadowing ledger | ledger | 145 | 4 |
| 83 | Weak-value cache evaporation | weak | 26 | 4 |
| 84 | Path component folder map | package-map | 121 | 4 |
| 85 | UTF-8 character-to-byte bridge | bytebridge | 122 | 4 |
| 86 | JSON container-type crossing | type-portal | 123 | 4 |
| 87 | CSV quoting composer | text-transform | 124 | 4 |
| 88 | NaN comparison switch | circuit | 128 | 4 |
| 89 | Exact rational balance | balance | 127 | 4 |
| 90 | Bool and int family tree | tree | 128 | 4 |
| 91 | Unicode casefold transformation | text-transform | 129 | 4 |
| 92 | Protocol presence vs signature | type-portal | 136 | 4 |
| 93 | Generic first-element flow | pipeline | 137 | 4 |
| 94 | TypedDict required/optional form | schema | 138 | 4 |
| 95 | Logging threshold checkpoints | log-rail | 139 | 4 |
| 96 | Mock interaction ledger | ledger | 140 | 4 |
| 97 | Script/import entry-point fork | branch | 141 | 4 |
| 98 | Relative-import package map | package-map | 142 | 4 |
| 99 | ContextVar task-local lanes | lanes | 149 | 4 |
| 100 | TaskGroup sibling-cleanup tree | fanout | 150 | 5 |

## Authoring and validation

- `assets/labs.js` retains the original six.
- `assets/lab-experiments.js` contains the fifty additional traces and references to lesson examples.
- `assets/lab-experiments-more.js` adds the latest forty-four traces.
- `assets/lab-scenes.js` turns scene states into responsive keyed SVG objects.
- `assets/lab-styles.css` provides gallery and visual styling.
- `tests/content.cjs` checks IDs, frame data, desktop/mobile geometry, and required assets.
- `tests/labs-browser.cjs` exercises all 100 experiments and every trace frame.
- `tests/lab-manifest.cjs` and `tests/lab-examples.py` verify the displayed Python output.

After editing metadata, regenerate this catalogue with `npm run docs:labs`.
