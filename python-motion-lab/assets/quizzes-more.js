/* 100 additions: one conceptual question and one checked code question for each
   lesson 106–155. Existing q1–q58 stay unchanged for saved attempts. */
(function(){
 'use strict';
 const additions=[];
 function add(id,question,correct,a,b,c,explanation,exampleIndex,wrongOutputs,outputExplanation){
  const lesson=window.LESSONS.find(l=>l.id===id),example=lesson.examples[exampleIndex];
  additions.push({lesson:id,category:lesson.category,question,options:[correct,a,b,c],answer:0,explanation});
  additions.push({lesson:id,category:lesson.category,question:`Predict the output — ${lesson.label}.`,code:example.code,format:'output',options:[example.output,...wrongOutputs],answer:0,explanation:outputExplanation});
 }
 add(106,'Why can reading a global-looking name before a later local assignment raise UnboundLocalError?',
  'The assignment makes the name local throughout that function unless a scope declaration says otherwise.',
  'Python always deletes global names when entering a function.','A global variable can only be read after declaring nonlocal.','Local scope starts only after the assignment statement has executed.',
  'Python determines local bindings from the function’s statements. A later assignment can make an earlier read target an uninitialized local. global or nonlocal changes the binding target when that is deliberately intended.',0,
  ['global\n2\nglobal','enclosing\n2\nenclosing','enclosing\n3\nglobal'],
  'inner finds name in its enclosing function, while len resolves to the builtin and returns 2. The enclosing binding never replaces the separate module binding, so the final print is global.');
 add(107,'When is the default list in def add(value, items=[]) created?',
  'When the function definition executes.','Every time a caller omits items.','Only after the first append completes.','Whenever the garbage collector runs.',
  'Default expressions are evaluated when def executes. Later calls that omit items reuse that object, so mutations can accumulate. A None sentinel with per-call construction provides independent defaults.',0,
  ["['A']\n['B']","['A', 'B']\n['A', 'B']",'TypeError'],
  'The first call appends A to the default list and prints it immediately. The second call reuses that same list and appends B, so its result contains both values. The earlier print is not retroactively changed.');
 add(108,'Which parameter placement makes an option keyword-only?',
  'Place it after a bare * or after a *args parameter.','Place it before /.','Give it any default value.','Annotate it with a type.',
  'The star marks later parameters as keyword-only. A default controls whether a value may be omitted, not whether it can be positional. The slash instead makes earlier parameters positional-only.',0,
  ['Ada\nupper must be named','ADA\nADA','TypeError before any output'],
  'The explicit upper=True keyword is accepted and produces ADA. Supplying True positionally violates the signature, so the caught TypeError produces the second message.');
 add(109,'What type does a starred assignment target receive, such as rest in first, *rest = values?',
  'A newly collected list of the remaining items.','An iterator sharing the original cursor without consumption.','A tuple in every case.','The original input object itself.',
  'Starred assignment collects remaining items into a list, which can be empty. It consumes the input while unpacking; it does not supply an unconsumed lazy view or promise to preserve the input container type.',0,
  ['10\n(20, 30)\n()','10\n[20, 30]\nValueError','[10]\n[20, 30]\n[]'],
  'The leading item becomes first. The first rest is [20, 30], and the second assignment has no leftover items, so rest becomes an empty list rather than raising.');
 add(110,'Which statement describes the loop variable of a Python 3 list comprehension?',
  'It belongs to the comprehension scope rather than overwriting an outer binding of the same name.',
  'It always becomes a global variable.','It overwrites the outer binding even when the input is empty.','It can only contain immutable values.',
  'Python 3 comprehensions use their own iteration-variable scope. This is separate from an ordinary for statement’s binding behavior. The resulting list is still eagerly constructed rather than generated lazily.',1,
  ['[0, 1, 2]\n2','[0, 1, 2]\nNameError','outside\n[0, 1, 2]'],
  'The comprehension’s n takes values 0, 1, and 2 only within its own scope. The outer n retains the string outside, which is printed after the list.');
 add(111,'What does an assignment expression using := produce as its expression value?',
  'The value assigned to its target name.','Always None.','Always a boolean reporting whether the name already existed.','A reference to the surrounding namespace dictionary.',
  'The assignment expression binds a name and evaluates to the assigned value, allowing a condition to reuse one computation. Parentheses can be necessary for the intended grouping with other operators.',0,
  ['size 3\nNone','size True\nTrue','3\nsize 3'],
  'The walrus binds size to len(values), which is 3, before comparing it with 2. The body prints size 3, and the later print reads the same retained binding.');
 add(112,'In match value: case expected:, what does the bare name expected normally mean?',
  'A capture pattern that binds the matched value.','An equality check against the existing expected variable.','A string literal matching the word expected.','A guard that only succeeds for booleans.',
  'A bare name in that position captures rather than compares with an earlier binding. Use a literal, a qualified constant such as an enum member, or a guard when an equality condition is intended.',0,
  ['5\nNone','unknown\nunknown','TypeError'],
  'The first sequence matches the literal move tag and captures x=2 and y=3, producing 5. The stop sequence does not have that shape and reaches the wildcard fallback.');
 add(113,'What do and and or return in Python?',
  'One of their operands, after evaluating only as far as needed.','A bool in every case.','Both operands as a tuple.','The right operand even when the left already determines the result.',
  'and/or short-circuit and return a determining operand. They do not coerce every result into bool. not does return a boolean. Consequently zero and None can both trigger or despite having different meanings.',0,
  ['True\nTrue\nTrue','fallback\nTrue\nFalse','\n7\nFalse'],
  'The empty string is false-like, so or returns fallback. The nonempty string is truthy, so and evaluates and returns 7. An empty list is false-like, making not [] True.');
 add(114,'Which extra relationship is NOT checked by the chain a != b != c?',
  'Whether a differs from c.','Whether a differs from b.','Whether b differs from c.','Whether the second comparison is needed after the first fails.',
  'A comparison chain checks adjacent operands and short-circuits. It does not imply all-pairs distinctness. In particular, a and c may be equal while both differ from b.',1,
  ['middle\nmiddle\nTrue','middle\nFalse','True'],
  'A chained comparison evaluates its middle expression once and reuses the result. middle returns 5, so both 1 < 5 and 5 < 9 hold, and only one middle message is printed.');
 add(115,'What does the stability guarantee of Python sorting say about equal sort keys?',
  'Their previous relative order is preserved.','They are automatically sorted by repr.','They are removed as duplicates.','Their order is reversed after every sort.',
  'A stable sort keeps tied records in their earlier relative order. It does not invent a secondary alphabetical key or deduplicate records. Supply a tuple key when secondary ordering is actually required.',0,
  ["[('Grace', 1), ('Lin', 2), ('Ada', 2)]","[('Ada', 2), ('Grace', 1), ('Lin', 2)]",'None'],
  'Grace has the smaller numeric key and moves first. Ada and Lin both have key 2, so stability retains Ada before Lin. sorted returns a new list instead of printing None.');
 add(116,'What does raise NewError(...) from original explicitly set?',
  'The new exception’s __cause__.','The original exception’s return value.','The new exception’s class to the original exception class.','A flag that suppresses the new exception automatically.',
  'Explicit chaining retains the original failure through __cause__ while exposing the translated exception to callers. It preserves debugging context; it neither handles the new exception nor changes its type.',0,
  ['Invalid configuration\nRuntimeError','bad\nValueError','Invalid configuration\nNone'],
  'parse catches ValueError and raises RuntimeError with a new message. The handler prints that message, then finds the original ValueError in __cause__.');
 add(117,'When does the else suite of a try/except statement run?',
  'When the try suite completes normally without raising or exiting through return, break, or continue.',
  'After every except handler.','Only when finally suppresses an exception.','Before the try suite starts.',
  'else is the normal-success path for try. finally accompanies exit regardless of that success/failure distinction. Keeping follow-up work in else narrows the code accidentally covered by a handler.',0,
  ['failed\ncleanup','success 7','cleanup\nsuccess 7'],
  'int("7") succeeds, so the success-only else prints its value. finally then runs cleanup. The exception handler is skipped rather than running before else.');
 add(118,'Why attach structured attributes to a custom exception?',
  'So callers can inspect meaningful details without parsing a human-facing message.','So the exception can never be caught by a base exception handler.','So raising it automatically retries the operation.','So its message must remain identical across every release.',
  'A field such as error.field provides a stable programmatic detail while str(error) serves readers. Inheriting an appropriate Exception subclass still permits normal hierarchy-based handling.',1,
  ['Missing field: email\nemail','email\nMissingField','None\nMissing field: email'],
  'The initializer stores email as the field attribute and passes a separate descriptive message to Exception. The two prints intentionally access structured data and display text independently.');
 add(119,'Why is checking whether a file exists and then opening it not automatically race-free?',
  'Another participant can change the filesystem between the check and the open.','File existence checks acquire a permanent process-wide lock.','open always ignores filesystem changes after a check.','Every path object is immutable, so the target cannot change.',
  'A check-then-act sequence is not one atomic filesystem operation. Handle the expected open failure at the actual operation boundary. Immutability of the path value does not freeze the external resource it names.',1,
  ['KeyError','None','city'],
  'The dictionary lacks city, so the narrow handler catches KeyError and assigns unknown. Execution then continues to the final print rather than propagating the handled exception.');
 add(120,'What does except* ValueError select from an ExceptionGroup?',
  'The subgroup containing matching ValueError failures.','Only the first error, regardless of type.','The entire group only if its message is ValueError.','Every error while discarding nonmatching members silently.',
  'except* processes matching subgroups, and other handlers may process other members. Any remaining unhandled failures continue propagating; matching one type does not erase the rest.',1,
  ['values 2','values 1','types 1\nvalues 2'],
  'The raised group has one ValueError and one TypeError. Each matching except* handler receives its own one-member subgroup, so both labeled counts are printed.');
 add(121,'What does Path.with_suffix return?',
  'A new path value with a different suffix, without renaming a file by itself.','The contents of the renamed file.','A boolean confirming a filesystem rename.','An opened writable file object.',
  'Path manipulation is distinct from filesystem mutation. with_suffix constructs another path value; an explicit rename operation would be required to rename an existing file.',0,
  ['notes/chapter.txt\nchapter.txt .txt\nnotes/chapter.txt','chapter.txt\nchapter .txt\nchapter.md','FileNotFoundError'],
  'PurePosixPath joins components and inspects their syntax without touching disk. The stem excludes .txt, and with_suffix creates the .md path without modifying the original path or any file.');
 add(122,'Why can len(text) differ from len(text.encode("utf-8"))?',
  'A Unicode code point can require multiple bytes in UTF-8.','UTF-8 always adds exactly one byte to every string.','len(text) counts only ASCII letters.','Encoding removes all non-ASCII characters.',
  'str length counts code points, while bytes length counts encoded bytes. Those are different units, and user-perceived grapheme count can differ from both. The encoding determines how code points become bytes.',0,
  ['4 4\n636166e9\nTrue','5 5\n636166c3a9\nTrue','4 5\n636166c3a9\nFalse'],
  'The accented final code point occupies two UTF-8 bytes, so four code points become five bytes. The hexadecimal sequence shows that encoding, and decoding it with UTF-8 reproduces the original string.');
 add(123,'What Python type does json.loads normally create for a JSON array?',
  'list','tuple','set','A dynamically generated dataclass.',
  'JSON arrays do not encode the distinction between Python tuples and lists. The loader creates a list, so value serialization need not preserve every Python runtime type or object identity.',1,
  ['(1, 2)\ntuple','[1, 2]\ntuple','TypeError'],
  'json.dumps serializes the tuple as an array. json.loads restores that array as a list, preserving the values but not the original tuple type.');
 add(124,'Why is splitting CSV rows on commas insufficient?',
  'Quoted fields can contain commas that belong to the field rather than separate columns.',
  'CSV always stores every row in a single unquoted field.','The csv module automatically converts all fields to integers.','A comma inside a field is forbidden by every CSV dialect.',
  'CSV quoting permits delimiters inside fields. A parser must understand quoting and escape rules to recover the correct boundaries. Parsed values are usually strings and still need deliberate conversion or validation.',0,
  ["['Ada', ' A.', 'London']","['Ada, A.,London']",'["Ada, A.", "London", ""]'],
  'The comma inside the quoted name is data within one field. csv.reader returns the complete name plus London as two fields, rather than splitting the name at its internal comma.');
 add(125,'Which operation converts an already-aware datetime to a different timezone while preserving its instant?',
  'astimezone(...)','replace(tzinfo=...) in every case.','Removing tzinfo.','Changing only its hour field manually.',
  'astimezone adjusts the displayed clock fields and offset for the same instant. replace(tzinfo=...) labels fields without conversion, which is a different operation requiring knowledge of their original meaning.',1,
  ['2026-01-02T12:00:00+05:30\nTrue','2026-01-02T17:30:00+05:30\nFalse','2026-01-02T06:30:00+00:00\nTrue'],
  'Adding the +05:30 display offset to 12:00 UTC gives 17:30 at that offset. Both aware values still describe the same instant, so equality is True.');
 add(126,'Which construction best preserves an intended exact decimal tenth for Decimal arithmetic?',
  'Decimal("0.1")','Decimal(0.1) always recovers the original decimal intent.','float("0.1") converted after arithmetic.','Formatting a float to one place without changing its type.',
  'A decimal string supplies the intended base-ten value directly. Constructing Decimal from a float instead preserves that float’s already-approximated binary value, and formatting alone is only presentation.',0,
  ['0.3\nTrue\nTrue','0.30000000000000004\nTrue\nFalse','0.30000000000000004\nFalse\nFalse'],
  'Binary floats approximate the decimal inputs, so their sum is the displayed nearby value rather than the float for 0.3. Exact equality fails, while math.isclose accepts the small difference using its tolerances.');
 add(127,'How does Fraction(0.1) differ from Fraction("0.1")?',
  'The first represents the existing binary float exactly; the second represents an exact decimal tenth.',
  'Both always become exactly 1/10.','Only the float form can produce a rational value.','The string form rounds to the nearest integer.',
  'Fraction retains the value of its actual input. A float has already undergone binary representation, while the string specifies the decimal ratio directly. Exact representation cannot undo an earlier approximation.',0,
  ['1/2\n3 6','0.5\n1 2','2/9\n2 9'],
  'The exact sum of one third and one sixth is three sixths, which Fraction reduces to one half. Its numerator and denominator are therefore the integers 1 and 2.');
 add(128,'Which predicate directly identifies a float NaN?',
  'math.isnan(value)','value == float("nan")','value is float("nan")','value == value',
  'NaN compares unequal even to itself, so equality with another NaN is not a detection strategy. math.isnan tests that category explicitly; math.isfinite instead excludes both NaN and infinities.',1,
  ['True\nTrue\nFalse\nFalse','False\nFalse\nFalse\nFalse','False\nTrue\nTrue\nFalse'],
  'NaN fails self-equality but satisfies isnan. It is not finite, and positive infinity is also not finite. These four results distinguish equality, category membership, and finiteness.');
 add(129,'What problem does Unicode normalization such as NFC address?',
  'Canonically equivalent code-point sequences can have different raw representations.',
  'Every visually similar character becomes the same identifier.','All languages use exactly the same case-matching rules.','String length automatically becomes the number of rendered graphemes.',
  'NFC provides a consistent composed representation for canonically equivalent sequences where defined. It is not a universal confusable-character policy, a complete locale comparison rule, or grapheme segmentation.',0,
  ['1 1\nTrue\nTrue','1 2\nTrue\nTrue','2 2\nFalse\nFalse'],
  'The composed accented character uses one code point; the base plus combining accent uses two. They compare unequal before normalization but equal after NFC. The code points, not appearance, determine the first comparison.');
 add(130,'Which re function requires the entire input to satisfy the pattern?',
  're.fullmatch','re.search','re.match in every case.','re.escape',
  'fullmatch requires full coverage. match only requires a match beginning at the start, search can find a match elsewhere, and escape prepares literal text for use inside a pattern.',0,
  ['True\nTrue\nFalse','False\nFalse\nFalse','True\nFalse\nTrue'],
  'search finds the digits after the item prefix. match cannot skip that prefix. fullmatch rejects 123x because the trailing x is not part of the digit pattern.');
 add(131,'Which operation triggers a defaultdict factory for a missing key?',
  'Indexed access with data[key].','data.get(key) without a default.','Checking key in data.','Iterating over data.keys().',
  'defaultdict’s missing-key behavior is invoked by indexed access, which stores the newly created value. get and membership tests do not automatically create missing entries, so choosing the access method can affect state.',2,
  ['[]\nTrue\n[]\nTrue','None\nFalse\n[]\nFalse','None\nTrue\n[]\nTrue'],
  'get returns None without inserting x, so membership is initially False. The indexed read then creates and stores a fresh default list; afterward x is present.');
 add(132,'What happens when append adds an item to an already full deque with maxlen?',
  'The item at the opposite end is discarded.','The deque always raises OverflowError.','The new item is silently rejected.','The maximum length doubles automatically.',
  'A bounded deque implements deliberately lossy history: appending to a full deque evicts from the other end. That is useful for recent observations but unsuitable for a lossless work queue without another policy.',1,
  ['[1, 2, 3]','[1, 2, 3, 4]','[4, 3, 2]'],
  'The buffer has room for only three values. Appending 4 after 1, 2, and 3 evicts the leftmost 1, leaving the three newest values in arrival order.');
 add(133,'Why add a unique sequence counter after a heap entry’s priority?',
  'It resolves equal-priority ties without comparing possibly unorderable payloads.',
  'It makes the backing heap list globally sorted.','It prevents every duplicate priority.','It changes a min-heap into a max-heap automatically.',
  'Tuple comparison proceeds to later fields when earlier fields tie. A unique increasing counter supplies a deterministic comparison before Python reaches payloads such as dictionaries that cannot be ordered.',1,
  ['second\nfirst','TypeError','first\nfirst'],
  'Both entries have priority 1, so the increasing sequence number breaks the tie in registration order. The dictionaries are never compared, and the names print first then second.');
 add(134,'What does bisect_left return when the target is absent from a sorted list?',
  'The insertion position that would preserve sorted order.','Always -1.','The nearest value itself.','A boolean reporting membership.',
  'bisect computes a boundary rather than proving membership. Check both the returned index bounds and the value at that index if actual presence matters. The input must already satisfy the sorting assumptions.',0,
  ['1 2\n1','2 3\n1','1 3\n3'],
  'The first 2 occurs at index 1, and the insertion point after both equal values is index 3. The half-open interval contains two values, so right minus left is 2.');
 add(135,'Why might you apply @unique to an Enum definition?',
  'To reject duplicate stored values that would otherwise create aliases.',
  'To convert every member into a plain string.','To guarantee that every instance attribute is validated.','To sort members by their stored values automatically.',
  'Enum can represent aliases when several names have the same value. unique rejects that condition during class construction when distinct stored values are required; it does not add general runtime field validation.',0,
  ['new\nNEW\nTrue','NEW\nnew\nTrue','Status.NEW\nnew\nFalse'],
  'The member’s name is NEW and its stored value is the string new. An ordinary Enum member is distinct from that raw string, making the equality comparison False.');
 add(136,'What does a runtime-checkable Protocol generally NOT verify?',
  'Complete compatibility of method signatures and return behavior.','Whether required members are available for its runtime check.','The fact that it is a Protocol class.','Whether isinstance was called with the object.',
  'runtime_checkable supports limited runtime protocol checking. A present method can still require incompatible arguments or return the wrong kind of value. Static checking and behavioral tests address more of the intended contract.',2,
  ['False\nSignature is incompatible','True','TypeError before any print'],
  'Wrong has a method named run, so the shallow runtime presence check succeeds. Its method requires an extra argument, so the no-argument call still raises the caught TypeError.');
 add(137,'What relationship does T express in def first(values: list[T]) -> T?',
  'The intended return type follows the element type of the supplied list.',
  'Every result is automatically converted to int.','The list is guaranteed to be nonempty.','Runtime calls reject every value that has no T attribute.',
  'The type variable connects annotations so a checker can retain useful information across many element types. It does not insert runtime validation or prove value-level facts such as a nonempty list.',0,
  ['int\nstr','1\nGrace','[1, 2]\n["Ada", "Grace"]'],
  'The implementation returns element zero with no conversion. The first list supplies 1, and the second supplies Ada. The generic annotation expresses that relationship for checking tools.');
 add(138,'Does constructing a TypedDict automatically validate all required keys at runtime?',
  'No; its runtime values are ordinary dictionaries without automatic schema enforcement.',
  'Yes; every missing key raises immediately during construction.','Yes; all unknown fields are removed by the constructor.','Only when the input comes from JSON.',
  'TypedDict documents key/value shapes for static checking. The runtime dictionary can still be incomplete or contain inappropriate values. Validate external data explicitly before relying on a typed shape.',1,
  ['TypeError during User()','{}\nNone','{}\nAttributeError'],
  'User() creates an empty dictionary despite the static required field. Accessing name then raises KeyError, which the example catches and describes. Required does not mean runtime construction enforcement.');
 add(139,'Why can an INFO message disappear even when its logger is set to DEBUG?',
  'A handler can have a stricter threshold that filters the record later.',
  'DEBUG loggers only accept DEBUG and reject every higher level.','All INFO messages require an active exception.','The logger name must be an integer for INFO output.',
  'Logger and handler thresholds are separate layers. A logger allowing INFO does not guarantee that each handler will emit it. Inspect both layers and propagation when diagnosing missing records.',1,
  ['not routed\nattention','INFO:not routed\nWARNING:attention','not routed'],
  'The logger admits both records, but the handler allows only WARNING and above. Only the attention message reaches the captured stream, using the default message-only formatter.');
 add(140,'What advantage does Mock(spec_set=Service) provide over an unrestricted Mock?',
  'It rejects access or assignment to attributes outside the specified interface.',
  'It guarantees the real external service is correct.','It makes every call execute the real service implementation.','It removes the need to assert visible outcomes.',
  'An interface restriction can expose misspelled or unsupported mocked methods rather than fabricating them. It still does not replace integration tests or prove that the real dependency behaves as the test assumes.',2,
  ['real\nUnknown method rejected','fake\nfake','AttributeError before any output'],
  'fetch is allowed by the spec and is configured to return fake. The misspelled fecth is not part of Service, so spec_set rejects it and the handler prints the diagnostic.');
 add(141,'What does the if __name__ == "__main__" guard prevent during ordinary import?',
  'Execution of its guarded script-only body.','Execution of all statements anywhere in the module.','Creation of function objects.','Importing any of the module’s dependencies.',
  'Only the conditional body is skipped when the module has an imported name. Other top-level statements still run during module initialization. Keeping script work in a main function makes that boundary clear.',0,
  ['No output', 'main\nscript work','NameError'],
  'This saved file is executed as the top-level script, so its name is __main__ and main prints script work. Merely defining main does not execute it before the guard.');
 add(142,'What context does an explicit relative import use?',
  'The containing package hierarchy.','Only the current working directory.','The most recently opened file in the editor.','The caller’s local variables.',
  'A leading-dot import is resolved using a package context. Running a nested file directly can lose that context. Changing directories alone does not establish a proper import hierarchy.',1,
  ['item\nElementTree','xml.etree\nitem','ModuleNotFoundError'],
  'The explicit package xml.etree resolves .ElementTree to xml.etree.ElementTree. The imported module creates an element tagged item, then exposes its fully qualified module name.');
 add(143,'When is __getattr__ used relative to ordinary __getattribute__ lookup?',
  'As a fallback after normal lookup fails with AttributeError.','Before every normal lookup, even when the attribute exists.','Only when the garbage collector runs.','Only when assigning an attribute.',
  '__getattribute__ participates in normal lookup; __getattr__ handles the missing-attribute fallback. Delegate carefully when overriding the broad hook, since reading the same self attribute inside it can recurse.',2,
  ['fallback\nlookup unknown','lookup unknown\nAttributeError','lookup fallback\nunknown'],
  'The normal hook prints its lookup message and delegates. The unknown attribute is absent, so AttributeError triggers __getattr__, whose fallback string is printed by the outer print.');
 add(144,'What is the main purpose of double-underscore name mangling?',
  'Reducing accidental internal-name collisions between a base class and its subclasses.',
  'Enforcing a security boundary that outside callers cannot bypass.','Making every instance attribute read-only.','Renaming every special method such as __len__.',
  'Mangling qualifies an internal name with the class where it appears. It avoids accidental reuse in subclasses, but a caller can still access the transformed name. Dunder protocol names are a separate convention.',0,
  ["7\n['__value']","7\n['value']",'AttributeError'],
  'The class body’s __value references are transformed to _Secret__value. reveal reads that same name and returns 7, while vars shows its actual storage key.');
 add(145,'Why does a.count += 1 often leave Counter.count unchanged when count is an integer class attribute?',
  'It reads the inherited value, then normally writes a new shadowing instance attribute.',
  'All augmented assignments always modify class namespaces.','Integers are mutable and update every instance automatically.','The class attribute is deleted as soon as any instance reads it.',
  'The operation combines a read and assignment. With an immutable integer, the new result is assigned on the receiver instance, shadowing class lookup. Mutating a shared class-level list would have different sharing behavior.',2,
  ['1 1 1\n5 5 5','1 0 0\n5 5 5','1 0 0\n1 0 5'],
  'a receives its own count=1 while b initially falls back to the class zero. Updating the class to 5 changes b’s inherited result, but a keeps its shadowing value.');
 add(146,'When does zip(..., strict=True) detect mismatched input lengths?',
  'During iterator consumption when the mismatch is encountered.','Always before returning the zip object.','Only when len is called on the zip object.','It never detects mismatches and simply pads with None.',
  'zip is lazy, so construction does not necessarily traverse inputs. strict mode raises when consuming exposes unequal lengths; ordinary zip stops at the shortest input without padding.',1,
  ["[(1, 'A'), (2, None)]\nLengths differ","[(1, 'A')]",'ValueError before any output'],
  'The ordinary zip yields one complete pair and truncates. Consuming the strict zip then exposes the extra left item, raises ValueError, and produces the handled diagnostic.');
 add(147,'What happens to a pre-filled keyword when a later partial call supplies that same keyword?',
  'The later keyword overrides the partial’s stored keyword value.','The partial always raises for duplicate stored and later keywords.','The stored value always wins silently.','The two values are concatenated.',
  'partial merges later keyword arguments over stored keyword defaults. This differs from giving the same function parameter both a bound positional value and a later keyword, which can violate ordinary argument binding.',1,
  ['Hi Ada!\nHi Ada!','Hi Ada?\nHi Ada?','Hi Ada!\nTypeError'],
  'The first call uses the stored exclamation mark. The second explicitly overrides that keyword with a question mark, so it produces Hi Ada? rather than a duplicate-keyword error.');
 add(148,'Why is raising Python’s recursion limit not a general solution for arbitrarily deep recursive input?',
  'It does not eliminate stack/resource limits or fix missing progress toward a base case.',
  'Python automatically converts every recursive call into a loop first.','A larger limit makes each recursive frame consume zero memory.','The limit only controls how many list items may exist.',
  'Recursion still consumes resources and requires a terminating algorithm. Ordinary Python does not promise tail-call elimination. An iterative algorithm or explicit stack is often the more robust design for deep structures.',0,
  ['0\n120','1\n24','RecursionError'],
  'The zero case returns the multiplicative identity 1. factorial(5) then combines the decreasing calls to compute 5×4×3×2×1 = 120; these small inputs stay well within normal recursion limits.');
 add(149,'What does copying an execution context do for objects stored in ContextVar bindings?',
  'It copies bindings, not necessarily the mutable objects those bindings reference.','It recursively deep-copies every referenced object.','It changes every ContextVar into an ordinary global variable.','It guarantees thread-safe mutation of every contained object.',
  'Context isolation concerns which value a binding points to. A shared mutable value can still be referenced from copied contexts. Prefer immutable metadata or deliberate ownership when independent mutation is needed.',1,
  ["['B', 'B']\nB","['A', 'B']\nB","['A', 'A']\nparent"],
  'Each asyncio task sets and retains its own string binding across suspension. gather reports results in argument order, while the parent context’s default binding remains parent.');
 add(150,'What does leaving an asyncio.TaskGroup context normally guarantee about the tasks it owns?',
  'The group waits for its owned tasks and coordinates failure/cancellation before the context finishes.',
  'All child functions run on separate CPU cores automatically.','Any child failure is silently ignored.','The child tasks must outlive the parent scope.',
  'TaskGroup provides structured ownership: exit waits for children, and ordinary failures trigger sibling cancellation and grouped error reporting after cleanup. It does not make blocking CPU work parallel or erase failures.',0,
  ['[9, 4]','[4, None]','[2, 3]'],
  'The context waits for both square tasks. Their result handles are stored in input order, so retrieving them after exit yields 4 and 9 even though scheduling is concurrent.');
 add(151,'What protocol does async for use to request successive items?',
  'The asynchronous iteration protocol, including awaited __anext__ operations.','Ordinary list indexing only.','A new operating-system process for each item.','The object’s __str__ method.',
  'An async iterator can suspend while producing the next value. async for awaits that protocol and stops on StopAsyncIteration. An async generator supplies this behavior with async def plus yield.',0,
  ['[0, 1, 2]','0\n1\n2\nStopAsyncIteration','2\n1\n0'],
  'async for consumes three yielded values, printing each on its own line. Normal exhaustion is handled by the loop and is not printed as an exception. sleep(0) provides suspension without changing the sequence.');
 add(152,'How does Queue.join differ from Thread.join in a producer/consumer design?',
  'Queue.join waits for unfinished-task accounting; Thread.join waits for thread termination.',
  'They are interchangeable names for the same operation.','Queue.join forcibly terminates every worker.','Thread.join automatically calls task_done for all retrieved items.',
  'Queue accounting and worker lifetime are separate. Every retrieved item needs a matching task_done, including a sentinel in this pattern. A worker may finish accounting before it has fully terminated.',0,
  ['[9, 4]','[4, 9, None]','[2, 3]'],
  'The one worker processes 2 and 3 in FIFO order, appending their squares. None is a shutdown sentinel, not a value to square. Both queue accounting and thread termination are awaited before printing.');
 add(153,'What do several Event.set calls accumulate?',
  'No message count; the event remains a set flag until cleared.','One queued message for each call.','A separate permit for each waiting thread.','An automatically resetting timer for every call.',
  'Event is persistent set/clear state, not a counted stream. Waiting threads can proceed while it remains set. Use a queue or counting semaphore when individual items or permits must be represented.',0,
  ['True\nTrue\nFalse','False\nTrue\nTrue','False\nFalse\nFalse'],
  'The initial zero-timeout wait sees a clear flag and returns False. After set it returns True. clear resets the state, so is_set finally returns False.');
 add(154,'What does an asyncio semaphore limit by itself?',
  'The number of tasks simultaneously holding permits in the protected region.','Requests per second regardless of task duration.','The total number of tasks that can ever be created.','The number of operating-system CPU cores.',
  'A semaphore limits concurrent admission, not a time-based rate. async with pairs acquisition and release on normal and exceptional exits. Rate limiting needs an additional policy involving time.',2,
  ['handled','permit available\nhandled','ValueError'],
  'The first async with releases its permit while unwinding the ValueError. The outer handler prints handled, and the later acquisition succeeds, printing permit available rather than hanging.');
 add(155,'Why create mutable per-test fixture state in setUp rather than one shared class-level list?',
  'Each test gets fresh state instead of depending on mutations left by another test.',
  'setUp runs only once after every test has finished.','Class-level lists automatically clear between assertions.','It forces tests to run in source-code order.',
  'setUp runs before each test method and can create independent mutable data. This removes accidental coupling through shared state; reliable tests should not depend on execution order.',1,
  ['1 True','2 False','0 True'],
  'There are two test methods. Each receives a fresh empty list, so the first method’s append does not affect the second method. Both pass, producing a testsRun count of 2 and successful status True.');
 if(additions.length!==100||window.QUIZZES.length!==58)throw Error('Expected 100 quiz additions after the original 58');
 window.QUIZZES.push(...additions.map((q,i)=>({...q,id:'q'+(59+i),collection:'new-100'})));
})();
