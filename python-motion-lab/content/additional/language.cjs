const {lesson:l,e}=require('./helpers.cjs');
module.exports=[
l(106,'How does LEGB name resolution work, and when should you use global or nonlocal?','LEGB & scope declarations','Functions',
'Python normally resolves a name through Local, Enclosing function scopes, Global module scope, and Builtins. Assignment inside a function normally creates a local binding. global redirects assignment to the module binding; nonlocal redirects it to an existing enclosing function binding. Reading a value and assigning a value are different operations.',
'Use enclosing scope for small stateful callbacks. Use explicit parameters and return values when shared mutable module state would make dependencies difficult to follow.',
'Reading a variable before a local assignment can raise UnboundLocalError, even if a global with that name exists. Scope is determined by the function’s statements, not only execution order.',
'Names are searched from nearby scopes outward. Assignment is local unless global or nonlocal explicitly chooses a different binding.',
e('Read local, enclosing, and global bindings',`name = "global"
def outer():
    name = "enclosing"
    def inner():
        print(name)
    inner()
    print(len([1, 2]))
outer()
print(name)`,`enclosing
2
global`,'inner finds name in its enclosing function because it has no local binding of that name. The module-level name remains separate.','len is found among builtins when no nearer binding shadows it. The example deliberately uses different names rather than modifying the module value.'),
e('Choose assignment targets explicitly',`count = 0
def outer():
    value = 1
    def inner():
        nonlocal value
        global count
        value += 2
        count += 1
    inner()
    return value
print(outer())
print(count)`,`3
1`,'nonlocal refers to value in outer, while global refers to count at module scope. The two statements control assignment targets independently.','Use these declarations to express intended ownership, not to hide dependencies that could more clearly be passed as arguments.'),
e('Identify an unbound local',`value = 10
def broken():
    print(value)
    value = 20
try:
    broken()
except UnboundLocalError:
    print("Local value was read before assignment")
print(value)`,`Local value was read before assignment
10`,'The later assignment marks value as local throughout broken. The earlier print therefore attempts to read an uninitialized local binding.','The global binding was never changed. Move the assignment, pass an argument, or deliberately declare global depending on the desired design.')),
l(107,'Why are mutable default arguments dangerous, and how can you avoid shared state?','Mutable default arguments','Functions',
'Default argument expressions are evaluated when the function is defined, rather than on each call. A list used as a default can therefore be shared across many calls. A None sentinel followed by per-call construction gives each omitted argument a fresh container, while still permitting callers to pass an explicit container.',
'Use this pattern for optional lists, dictionaries, and sets in ordinary functions. A deliberately shared default is possible, but should be rare and documented.',
'Changing [] to {} does not solve the problem: both are mutable. Also distinguish an omitted value from a supplied empty container rather than replacing every false-like input.',
'A mutable default is created once. Use None and create a fresh container inside the function when each call needs independent state.',
e('Observe the shared list',`def add(value, items=[]):
    items.append(value)
    return items
print(add("A"))
print(add("B"))`,`['A']
['A', 'B']`,'The first omitted argument uses the default list and mutates it. The second omitted argument uses that exact same object again.','Printing after each call shows the accumulation. The effect is caused by the default’s lifetime, not by the local parameter name.'),
e('Create a fresh list for omitted input',`def add(value, items=None):
    if items is None:
        items = []
    items.append(value)
    return items
print(add("A"))
print(add("B"))`,`['A']
['B']`,'Each omitted argument becomes None, then a new list is constructed inside that particular call. The calls no longer share their default data.','The identity test is important: an explicitly supplied empty list is a real container and should not be mistaken for an omitted argument.'),
e('Respect an explicitly passed container',`def add(value, items=None):
    if items is None:
        items = []
    items.append(value)
    return items
shared = []
print(add(1, shared) is shared)
print(add(2, shared))`,`True
[1, 2]`,'The caller intentionally passes the same list, so both calls modify shared. The safe-default pattern does not silently copy explicit input.','Decide whether mutation is part of the API. Make a copy inside the function instead if caller-owned containers must remain untouched.')),
l(108,'What are positional-only and keyword-only parameters, and why design an API with them?','Positional-only & keyword-only','Functions',
'Parameters before / are positional-only. Parameters after a bare * are keyword-only, while ordinary parameters between those markers accept either style. These markers define allowed calling conventions without changing the function’s main computation. Keyword-only options make calls self-describing; positional-only parameters can avoid exposing internal argument names as part of an API.',
'Use keyword-only flags for easily confused options. Positional-only inputs are helpful for compact conventional operations or a parameter whose name should not constrain future versions.',
'A default does not make a parameter keyword-only. The placement of / and * determines that rule, and Python raises TypeError for invalid call styles.',
'A slash means “pass earlier parameters by position.” A star means “name later parameters explicitly.”',
e('Require an explicit keyword for a flag',`def format_name(name, *, upper=False):
    return name.upper() if upper else name
print(format_name("Ada", upper=True))
try:
    format_name("Ada", True)
except TypeError:
    print("upper must be named")`,`ADA
upper must be named`,'The bare star makes upper keyword-only, so the successful call documents what True means at the call site.','Supplying the flag as a second positional argument is rejected before the body runs. This prevents accidental positional interpretation.'),
e('Hide an internal parameter name from callers',`def double(value, /):
    return value * 2
print(double(4))
try:
    double(value=4)
except TypeError:
    print("Use a positional argument")`,`8
Use a positional argument`,'value appears before the slash and cannot be supplied by keyword. Its name is available inside the implementation only for this calling convention.','The restriction can make renaming the implementation parameter less disruptive to callers, since they cannot depend on that keyword spelling.'),
e('Combine all three parameter styles',`def report(code, /, name, *, active=True):
    return code, name, active
print(report(7, name="Ada", active=False))
print(report(8, "Grace"))`,`(7, 'Ada', False)
(8, 'Grace', True)`,'code is positional-only, name accepts position or keyword, and active is keyword-only with a default. Each portion of the signature has a distinct role.','Default values control omission, while the separators control how supplied arguments are written. These two concepts are independent.')),
l(109,'How do sequence unpacking and starred assignment work?','Unpacking & starred assignment','Python toolkit',
'Unpacking assigns items from an iterable to multiple targets. Without a star, the number of produced items must match the number of targets. A single starred target collects the remaining items into a new list, possibly empty. Nested target patterns unpack nested structures, which can make record processing readable when the shape is well defined.',
'Use unpacking for small records, head-and-tail operations, swapping values, and loops over structured data. It communicates the expected shape directly.',
'A starred assignment still consumes the input iterable; it is not a lazy view. Unexpected input lengths can raise ValueError rather than silently discard extra items.',
'Unpacking assigns several values at once. A starred target gathers leftover items into a list.',
e('Capture a head and remaining values',`first, *rest = [10, 20, 30]
print(first)
print(rest)
first, *rest = [10]
print(rest)`,`10
[20, 30]
[]`,'first receives one item, and rest collects everything after it. With only one input item, rest is an empty list rather than an error.','The list is newly collected data, not a live view of the original container. Avoid unpacking enormous or unbounded iterators.'),
e('Unpack nested records',`record = ("Ada", (7, 9))
name, (low, high) = record
print(name, low, high)
a, b = 1, 2
a, b = b, a
print(a, b)`,`Ada 7 9
2 1`,'The target structure mirrors the nested tuple structure. Python assigns the inner pair to low and high after unpacking the outer record.','During the swap, the right-hand values are evaluated before assignment to the left-hand targets, preserving both original values.'),
e('Reject an unexpected record length',`try:
    a, b = [1, 2, 3]
except ValueError:
    print("Expected exactly two items")
a, *middle, b = [1, 2, 3, 4]
print(a, middle, b)`,`Expected exactly two items
1 [2, 3] 4`,'The first assignment has no starred target, so three input items cannot fit two targets. A shape mismatch raises ValueError.','The second pattern assigns the ends explicitly and collects the middle. It accepts varying middle lengths while still requiring enough items for both ends.')),
l(110,'How do comprehensions work, and what scope do their variables have?','Comprehensions & their scope','Iteration',
'Comprehensions construct lists, sets, or dictionaries from an iterable, optionally filtering or nesting loops. In Python 3 their iteration variables have a separate comprehension scope rather than leaking into the surrounding function or module. A generator expression uses similar syntax but produces values lazily. Clear comprehensions express a transformation more directly than repeated append calls.',
'Use a comprehension for short, readable mapping and filtering. Split a complex expression into named steps when nested conditions make it hard to understand.',
'A list comprehension eagerly creates all results. Avoid using comprehensions only for side effects, and do not assume a mutable input becomes independent merely because the outer list is new.',
'A comprehension builds a collection from a clear rule. Its loop variable stays inside the comprehension in Python 3.',
e('Transform and filter in one expression',`values = [1, 2, 3, 4]
print([n * n for n in values if n % 2 == 0])
print({n: n * n for n in values[:2]})`,`[4, 16]
{1: 1, 2: 4}`,'The if clause selects inputs before the result expression is evaluated. Only 2 and 4 contribute square values to the list.','The dictionary comprehension creates key/value pairs instead of list items. Its insertion order follows the traversal order in this example.'),
e('Keep the outer binding unchanged',`n = "outside"
values = [n for n in range(3)]
print(values)
print(n)`,`[0, 1, 2]
outside`,'The comprehension’s iteration variable is local to its own scope in Python 3. It does not overwrite the outer n binding.','This scope rule differs from an ordinary for statement at module scope. Do not generalize the behavior of one construct to the other.'),
e('Read nested comprehension order',`pairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]
print(pairs)
print(sorted({letter for letter in "banana"}))`,`[(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
['a', 'b', 'n']`,'The clauses read like nested loops from left to right: each x visits both y values. The displayed order follows that traversal.','A set comprehension removes duplicates. Sorting the resulting set for display avoids claiming that the set itself maintains a sorted iteration order.')),
l(111,'What does the walrus operator := do, and when is it useful?','Assignment expressions with :=','Python toolkit',
'An assignment expression both binds a name and produces a value inside a larger expression. The := syntax is useful when an intermediate result is needed for both a condition and subsequent work. It is not a replacement for ordinary assignment statements, and some contexts require parentheses to make grouping explicit.',
'Use it to avoid a repeated parse or function call in a condition. Prefer a regular statement when embedding the assignment would obscure the sequence of operations.',
'Do not confuse =, which assigns in a statement, with :=, which also returns the assigned value. Be careful with operator precedence and names that escape a comprehension.',
'The walrus operator saves a value while using it in an expression. Use it when that makes a repeated calculation easier to read.',
e('Reuse a length in a condition',`values = [1, 2, 3]
if (size := len(values)) > 2:
    print("size", size)
print(size)`,`size 3
3`,'The parenthesized expression binds size to the length, then compares that same value with 2. The name remains available afterward.','This avoids computing the length twice, although len on a list is already cheap. The main benefit here is showing the data flow clearly.'),
e('Parse once while filtering values',`texts = ["0", "2", "3"]
positive = [value for text in texts if (value := int(text)) > 0]
print(positive)`,`[2, 3]`,'int(text) runs once per input and its result is reused in the output expression for matching items. Zero is filtered out.','Invalid integer text would still raise ValueError. Assignment expressions do not automatically provide error handling or input validation.'),
e('Stop an iterator loop using a sentinel',`source = iter(["A", "B", ""])
while (item := next(source)) != "":
    print(item)
print("done")`,`A
B
done`,'Each condition reads the next item and stores it for the loop body. The empty string is an explicit end marker in this bounded input.','Use a carefully chosen sentinel or catch StopIteration if exhaustion is also possible. This example’s sentinel is part of its input contract.')),
l(112,'How does structural pattern matching differ from a sequence of equality checks?','Structural pattern matching','Python toolkit',
'match/case, introduced in Python 3.10, selects cases by an object’s structure and can bind components to names. Sequence, mapping, and class patterns express expected shapes; guards add conditions after a pattern matches. The first successful case runs, and there is no fall-through. A bare name is usually a capture pattern, not a comparison with an existing variable.',
'Use pattern matching for tagged records, command structures, and well-defined nested data. It can replace repetitive shape checks and manual indexing.',
'Writing case expected with a bare name captures the value rather than comparing it to a prior expected binding. Use literal values, qualified constants, or guards for comparisons.',
'Pattern matching recognizes a value’s shape and extracts pieces. The first matching case with a satisfied guard wins.',
e('Match command shapes',`def command(value):
    match value:
        case ["move", x, y]:
            return x + y
        case _:
            return "unknown"
print(command(["move", 2, 3]))
print(command(["stop"]))`,`5
unknown`,'The first case requires three sequence items and a literal move tag. It then captures the remaining items as x and y.','The wildcard case provides a fallback. No later case runs after the successful branch returns.'),
e('Use a mapping pattern and a guard',`def status(record):
    match record:
        case {"score": score} if score >= 10:
            return "high"
        case {"score": _}:
            return "low"
        case _:
            return "missing"
print(status({"score": 12, "name": "Ada"}))
print(status({"score": 3}))
print(status({}))`,`high
low
missing`,'The mapping pattern requires score but accepts additional keys. The guard runs only after score has been extracted.','The second case handles a present score that fails the first guard. The final wildcard covers records without the required shape.'),
e('Recognize that a bare name captures',`expected = "A"
match "B":
    case expected:
        print("captured", expected)
print(expected)`,`captured B
B`,'expected is a capture pattern here, so it binds to B instead of comparing against the old A value. This case therefore succeeds.','Use a quoted literal, an enum member such as Kind.A, or an explicit guard when the intent is equality against a particular value.')),
l(113,'How do truthiness and short-circuit boolean operators work?','Truthiness & short-circuiting','Python toolkit',
'Conditions use an object’s truth value, which may come from __bool__, __len__, or ordinary defaults. and and or evaluate left to right and stop as soon as the result is determined. They return one of their operands, not necessarily True or False. not converts the truth result to a boolean. Empty containers, zero, and None are all false-like but are not the same value.',
'Use short-circuit conditions for guarded operations and any/all for collections of tests. Treat missing data separately when empty or zero values are legitimate.',
'value or default replaces every false-like value, including zero. Use an explicit None check when only absence should trigger a default.',
'Boolean operators can skip work and return actual operands. False-like values are not automatically missing values.',
e('Inspect operand return values',`print("" or "fallback")
print("ready" and 7)
print(not [])`,`fallback
7
True`,'or returns the first truthy operand, while and returns the second operand when the first is truthy. The results therefore need not be booleans.','not always returns a boolean. An empty list is false-like, so negating its truth value produces True.'),
e('Show skipped evaluation',`def check():
    print("called")
    return True
print(False and check())
print(True or check())`,`False
True`,'The first expression already has a false left operand; the second already has a true left operand. Neither needs the function call.','The absence of called in the output makes short-circuiting visible. Avoid depending on skipped side effects for essential application work.'),
e('Keep zero when it is a supplied value',`def default_if_missing(value):
    return 10 if value is None else value
print(0 or 10)
print(default_if_missing(0))
print(default_if_missing(None))`,`10
0
10`,'or replaces zero because zero is false-like. The explicit None test preserves zero and replaces only the chosen missing-value marker.','Choosing between these forms is a data-model decision. Similar care is needed for empty strings, empty lists, and custom false-like objects.')),
l(114,'How do chained comparisons work, and are middle expressions evaluated more than once?','Chained comparisons','Python toolkit',
'A comparison chain such as low < value <= high means that adjacent comparisons must all hold. Evaluation short-circuits on failure, and a middle expression is evaluated once for that chain. This differs from explicitly writing two comparisons that repeat a function call. Mixed comparison operators are allowed, but readability matters more than brevity.',
'Use natural range checks for numbers and explicit comparisons when checking sorted relationships. The notation mirrors familiar mathematical intervals.',
'a != b != c does not assert that a and c differ. It checks only adjacent pairs, so use an appropriate distinctness test when all values must be unique.',
'A comparison chain checks neighboring values, stops on failure, and evaluates each participating expression at most once.',
e('Express inclusive and exclusive bounds',`def allowed(value):
    return 0 <= value < 10
print(allowed(0))
print(allowed(10))
print(allowed(7))`,`True
False
True`,'Zero satisfies the inclusive lower bound, while 10 fails the exclusive upper bound. The chain reads as one interval condition.','The chosen operators define the boundary contract. Tests should include endpoints, not just values comfortably inside the range.'),
e('Evaluate a middle function once',`def middle():
    print("middle")
    return 5
print(1 < middle() < 9)`,`middle
True`,'middle is evaluated once and its result participates in both adjacent comparisons. The printed message occurs once.','Writing 1 < middle() and middle() < 9 could call the function twice, which matters if the computation is expensive or has side effects.'),
e('Avoid mistaking adjacent inequality for uniqueness',`a, b, c = 1, 2, 1
print(a != b != c)
print(len({a, b, c}) == 3)`,`True
False`,'The chain checks 1 != 2 and 2 != 1, both true. It does not also check the first 1 against the last 1.','A set-based uniqueness test works here because the values are hashable and their equality semantics match the requirement. Choose another approach for unhashable values.')),
l(115,'What does a stable sort guarantee, and how should you use key functions?','Stable sorting & key functions','Python toolkit',
'Python sorting is stable: items with equal sort keys retain their previous relative order. sorted produces a new list, while list.sort changes an existing list and returns None. A key function supplies the comparison value for each input item; a tuple key expresses primary and secondary ordering. Stability also permits deliberate multi-pass sorting.',
'Use key functions to sort records by fields without building custom comparison methods. Stable ordering is valuable when preserving an earlier user-selected order within tied groups.',
'Do not assign result = items.sort() expecting a new sorted list. Also distinguish reverse ordering from reversing the input before a stable sort.',
'Sort by a key, and tied items keep their earlier order. sorted returns a new list; list.sort changes the original.',
e('Preserve relative order among equal keys',`records = [("Ada", 2), ("Grace", 1), ("Lin", 2)]
print(sorted(records, key=lambda row: row[1]))`,`[('Grace', 1), ('Ada', 2), ('Lin', 2)]`,'Grace moves first because her key is 1. Ada and Lin both have key 2, so their original relative order is retained.','Stability describes tie behavior. It does not imply that records are also sorted alphabetically unless a secondary rule requests that.'),
e('Sort with a primary and secondary key',`records = [("Bob", 2), ("Ada", 2), ("Grace", 1)]
print(sorted(records, key=lambda row: (row[1], row[0])))`,`[('Grace', 1), ('Ada', 2), ('Bob', 2)]`,'Tuple comparison uses the first element first and the second only when the first ties. The output orders by number, then name.','This makes both sorting rules explicit. The key function returns comparable values rather than mutating the original record.'),
e('Separate mutation from the return value',`values = [3, 1, 2]
new = sorted(values)
print(values, new)
result = values.sort()
print(values, result)`,`[3, 1, 2] [1, 2, 3]
[1, 2, 3] None`,'sorted leaves values unchanged and returns another list. list.sort modifies values in place and intentionally returns None.','Choose based on ownership: preserve caller-owned order with sorted, or sort an owned mutable list in place when that is the intended operation.'))
];
