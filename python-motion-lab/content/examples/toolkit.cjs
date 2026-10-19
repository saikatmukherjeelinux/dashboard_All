const {e}=require('./helpers.cjs');
module.exports=[
{ids:[11,50,54,85],summary:'A context manager defines setup and cleanup around a with block. Cleanup happens on normal exit and while an exception unwinds the block.',examples:[
e('Implement the context-manager protocol',`class Session:
    def __enter__(self):
        print("enter")
        return "ready"
    def __exit__(self, kind, value, traceback):
        print("exit")
        return False

with Session() as status:
    print(status)`,`enter
ready
exit`,'The object’s __enter__ runs before the block, and its return value is bound to status. __exit__ runs when the block finishes.','Returning False means exceptions are not suppressed. It is normal for an exit method to return None with the same propagation behavior.'),
e('Use contextlib.contextmanager with finally',`from contextlib import contextmanager

@contextmanager
def session():
    print("open")
    try:
        yield "ready"
    finally:
        print("close")

try:
    with session() as value:
        print(value)
        raise ValueError("failure")
except ValueError:
    print("handled")`,`open
ready
close
handled`,'The generator yields exactly once to enter the block. When the body raises, the exception is passed back at the yield point and finally still runs.','The exception then propagates to the outer handler. Putting cleanup after yield without finally would not provide the same guarantee when the body fails.'),
e('Suppress only a deliberate exception type',`from contextlib import suppress

with suppress(KeyError):
    print({}["missing"])
print("continued")

try:
    with suppress(KeyError):
        int("bad")
except ValueError:
    print("ValueError was not suppressed")`,`continued
ValueError was not suppressed`,'suppress(KeyError) treats only KeyError as handled. The missing dictionary access is skipped and execution continues after the with block.','The unrelated ValueError still propagates. Narrow exception handling avoids concealing programming errors that were never intended to be ignored.'),
e('Manage a dynamic group of cleanup actions',`from contextlib import ExitStack

with ExitStack() as stack:
    stack.callback(print, "close first")
    stack.callback(print, "close second")
    print("work")`,`work
close second
close first`,'ExitStack records callbacks and runs them in reverse registration order when the stack exits. That mirrors nested with blocks.','This helps when the number of resources is discovered at runtime. Register each cleanup as soon as its corresponding resource is acquired.') ]},
{ids:[17],summary:'An f-string evaluates expressions inside braces when the string is built. Format specifiers control how those values are displayed.',examples:[
e('Insert variables and expressions',`name = "Ada"
count = 3
print(f"Hello {name}")
print(f"Next count: {count + 1}")`,`Hello Ada
Next count: 4`,'Expressions in braces are evaluated in the current scope when the f-string is created. They are not stored as live links to variables.','Keep expressions readable. Complex business logic is usually clearer when computed separately before formatting.'),
e('Control precision and alignment',`price = 12.5
print(f"Price: {price:.2f}")
print(f"Code: {7:04d}")
print(f"|{'Py':>5}|")`,`Price: 12.50
Code: 0007
|   Py|`,'The colon introduces a format specification. .2f displays two decimal places, 04d pads an integer with zeroes, and >5 right-aligns text to width five.','Formatting changes the displayed string, not the original numeric value. Use suitable numeric types when exact decimal arithmetic is required.'),
e('Show debugging representations and literal braces',`value = "hello"
print(f"repr={value!r}")
print(f"{{value}} = {value}")
value = "changed"
message = f"now={value}"
value = "later"
print(message)`,`repr='hello'
{value} = hello
now=changed`,'!r uses repr, which includes quotes around the string. Doubled braces insert literal braces rather than opening an expression.','The final message retains the value captured when it was formatted. Rebinding value later does not rewrite an already-created string.') ]},
{ids:[25],summary:'eval executes Python expressions, so do not use it to parse untrusted input. Choose a parser designed for the data format you actually expect.',examples:[
e('Understand what eval evaluates',`value = eval("2 + 3 * 4", {"__builtins__": {}})
print(value)`,`14`,'This fixed, trusted expression follows normal arithmetic precedence. eval evaluates an expression and returns its result.','The empty builtins mapping here is not presented as a secure sandbox. Do not pass attacker-controlled expressions to eval, even after superficial restrictions.'),
e('Parse JSON data instead of executing code',`import json

text = '{"name": "Ada", "active": true}'
data = json.loads(text)
print(data["name"])
print(data["active"])`,`Ada
True`,'json.loads interprets a defined data format rather than arbitrary Python expressions. JSON true becomes Python True.','Use this for JSON messages and configuration, then validate required fields and sizes according to your application’s contract.'),
e('Read Python literal data with literal_eval',`import ast

print(ast.literal_eval("[1, 2, 3]"))
try:
    ast.literal_eval("sum([1, 2])")
except ValueError:
    print("Function calls are not literals")`,`[1, 2, 3]
Function calls are not literals`,'literal_eval supports Python literal structures such as lists, strings, and numbers, but rejects a function-call expression.','It is not unrestricted code execution, but very large or deeply nested inputs can still exhaust resources. Use size limits and format-specific parsers for external data.') ]},
{ids:[29],summary:'== compares values according to equality rules. is compares whether two references point to the exact same object. Use is None for the missing-value sentinel.',examples:[
e('Compare equal but distinct lists',`a = [1, 2]
b = [1, 2]
c = a
print(a == b)
print(a is b)
print(a is c)`,`True
False
True`,'a and b have equal contents but were created as different list objects. c is another name for the same object as a.','Identity is useful when shared ownership matters. It is not a replacement for comparing the logical values of records, strings, or numbers.'),
e('Compare a shallow copy at two levels',`a = [[1]]
b = a.copy()
print(a == b)
print(a is b)
print(a[0] is b[0])`,`True
False
True`,'The outer containers are distinct but equal. Their first elements refer to the same nested list because the copy is shallow.','Identity comparisons at the relevant nesting level reveal sharing that a simple equality test cannot show.'),
e('Distinguish None from false-like values',`def describe(value):
    if value is None:
        return "missing"
    return "provided"

print(describe(None))
print(describe(0))
print(describe([]))`,`missing
provided
provided`,'None is a specific singleton used here to mean absence. Zero and an empty list are false-like but are still supplied values.','Using if not value would combine all three cases. Choose the test that matches the actual data contract instead of treating truthiness and absence as interchangeable.') ]},
{ids:[30,55,104],summary:'Circular imports happen when modules depend on each other during initialization. Move shared definitions to a neutral module or defer a carefully chosen dependency.',examples:[
e('Share definitions through a neutral module',`# Single-file model of three modules; no files need to be created.
from types import SimpleNamespace

common = SimpleNamespace(prefix="user")  # common.py
def module_a_label(name):                # module_a.py imports common
    return common.prefix + ":" + name
def module_b_label(name):                # module_b.py imports common
    return common.prefix + ":" + name.upper()

print(module_a_label("Ada"))
print(module_b_label("Ada"))`,`user:Ada
user:ADA`,'Both components depend on the shared definition rather than importing each other. The namespaces and comments model the dependency direction in one runnable file.','In a real project, put the shared definition in common.py and import it from both modules. This example demonstrates the refactor, not a real import cycle.'),
e('Perform an import only when an operation needs it',`def circle_area(radius):
    from math import pi
    return round(pi * radius * radius, 2)

print(circle_area(2))
print(circle_area(3))`,`12.57
28.27`,'The import statement is inside the function, so it executes when the function is called rather than during the surrounding module’s initial top-level setup.','This illustrates deferred import timing with a safe standard-library dependency. Local imports can help a specific cycle, but do not repair a fundamentally tangled module design.'),
e('Use dependency injection to remove a reverse dependency',`def build_report(load_user):
    user = load_user()
    return "Report for " + user["name"]

def load_user():
    return {"name": "Ada"}

print(build_report(load_user))`,`Report for Ada`,'The report component receives its loader instead of importing the concrete data component. A composition layer wires the pieces together.','This removes the need for a reverse import and simplifies testing. It also avoids the separate bug of functions calling one another recursively without a stopping condition.') ]},
{ids:[32],summary:'A named tuple is a tuple-like record whose fields also have names. The record is immutable, but its contained values may still be mutable.',examples:[
e('Read named and positional fields',`from collections import namedtuple

Point = namedtuple("Point", "x y")
p = Point(2, 3)
print(p.x, p[1])
print(p)
print(tuple(p))`,`2 3
Point(x=2, y=3)
(2, 3)`,'The field names improve readability while indexing and tuple conversion still work. namedtuple generates a tuple subclass for this record structure.','Use names when they make meaning clearer, especially when several same-typed fields would otherwise be easy to mix up.'),
e('Produce a modified record without mutating it',`from collections import namedtuple

Point = namedtuple("Point", "x y")
p = Point(2, 3)
q = p._replace(x=9)
print(p)
print(q)
try:
    p.x = 5
except AttributeError:
    print("Fields are immutable")`,`Point(x=2, y=3)
Point(x=9, y=3)
Fields are immutable`,'_replace returns a new named tuple with selected fields changed. The original record retains its x value.','Direct assignment fails because tuple slots cannot be reassigned. The underscore-prefixed helper is part of the namedtuple API.'),
e('Use defaults and dictionary conversion',`from collections import namedtuple

User = namedtuple("User", "name active", defaults=[True])
user = User("Ada")
print(user.active)
print(dict(user._asdict()))`,`True
{'name': 'Ada', 'active': True}`,'defaults supplies values for the rightmost fields, so active defaults to True when omitted. _asdict exposes the named fields as a mapping.','This is a shallow conversion: contained objects are not deep-copied. For richer validation or behavior, a dataclass or regular class may be more suitable.') ]},
{ids:[39,65,79,91],summary:'frozenset is an immutable set of unique, hashable elements. It supports set operations and can itself be a dictionary key or an element of another set.',examples:[
e('Remove duplicates without depending on display order',`values = frozenset([3, 1, 3, 2])
print(sorted(values))
print(2 in values)
print(len(values))`,`[1, 2, 3]
True
3`,'Like a set, frozenset retains unique elements and supports membership checks. It does not define an application-level sorted iteration order.','Sorting only for display makes the expected output stable. The frozenset itself remains unordered and immutable.'),
e('Use a set of tags as a dictionary key',`routes = {frozenset(["read", "write"]): "editor"}
key = frozenset(["write", "read"])
print(routes[key])
print(key == frozenset(["read", "write"]))`,`editor
True`,'Set equality ignores input ordering. Both frozensets represent the same pair of permissions and compare equal as keys.','Every member must be hashable. A frozenset containing a mutable list cannot be created just by freezing the outer container.'),
e('Return new sets instead of mutating the old one',`a = frozenset([1, 2])
b = frozenset([2, 3])
print(sorted(a | b))
print(sorted(a & b))
print(sorted(a - b))
try:
    a.add(4)
except AttributeError:
    print("No mutating add method")`,`[1, 2, 3]
[2]
[1]
No mutating add method`,'Union, intersection, and difference calculate new results while leaving a and b unchanged. Sorting makes the displayed values deterministic.','The absent add method reflects immutability. Rebind a name to a newly computed frozenset when the logical value should change.') ]},
{ids:[44],summary:'Introspection means asking a running object about its type, attributes, or behavior. It supports debugging, interactive exploration, and adaptable tooling.',examples:[
e('Inspect the type and available names',`class User:
    role = "reader"

user = User()
print(type(user).__name__)
print("role" in dir(user))
print(hasattr(user, "missing"))`,`User
True
False`,'type identifies the class, dir provides discoverable attribute names, and hasattr checks whether an attribute lookup succeeds.','These tools answer different questions. Attribute lookup can execute properties or descriptors, so inspection is not always free of side effects.'),
e('Read attributes dynamically with a default',`class User:
    name = "Ada"

user = User()
for field in ["name", "city"]:
    print(getattr(user, field, "unknown"))`,`Ada
unknown`,'getattr accepts the attribute name as data, useful for controlled field selection. Its third argument supplies a fallback for an absent attribute.','Validate field names when they come from outside your program. Dynamic lookup should not expose arbitrary internal attributes unintentionally.'),
e('Inspect stored instance state',`class Point:
    def __init__(self):
        self.x = 2
        self.y = 3

p = Point()
print(sorted(vars(p).items()))
setattr(p, "x", 9)
print(p.x)`,`[('x', 2), ('y', 3)]
9`,'vars returns the instance dictionary for an object that has one. setattr performs a named assignment just like p.x = 9.','This only shows dictionary-backed instance state, not every inherited attribute or property. Objects using slots may not provide an instance dictionary.') ]},
{ids:[47],summary:'inspect provides structured information about functions, classes, signatures, documentation, and source. Some source information is unavailable for built-ins or interactive objects.',examples:[
e('Inspect a signature and bind arguments',`import inspect

def add(a, b=2):
    return a + b

signature = inspect.signature(add)
bound = signature.bind(3)
bound.apply_defaults()
print(signature)
print(dict(bound.arguments))`,`(a, b=2)
{'a': 3, 'b': 2}`,'signature describes the calling interface. bind checks a proposed argument arrangement and maps supplied values to parameter names.','apply_defaults fills in omitted defaulted parameters without executing add. This is useful for wrappers, validation tools, and command dispatchers.'),
e('Distinguish functions, classes, and bound methods',`import inspect

class User:
    def greet(self):
        return "Hi"

print(inspect.isclass(User))
print(inspect.isfunction(User.greet))
print(inspect.ismethod(User().greet))`,`True
True
True`,'Access through the class exposes the original function in this example. Access through an instance produces a bound method with the receiver attached.','These distinctions help tools decide how to inspect or invoke an object without assuming every callable has identical binding behavior.'),
e('Retrieve documentation and saved source',`import inspect

def square(n):
    """Return n squared."""
    return n * n

print(inspect.getdoc(square))
source = inspect.getsource(square)
print("def square" in source)
print("return n * n" in source)`,`Return n squared.
True
True`,'Run this example from a saved .py file so inspect can read its source. getdoc returns cleaned documentation; getsource retrieves the defining source text.','Built-in functions and some dynamically defined or interactive objects do not have retrievable source. Handle OSError or TypeError when building a general-purpose inspection tool.') ]},
{ids:[67],summary:'assert checks an internal assumption during development. Use explicit conditions and exceptions for checks that must remain active in production.',examples:[
e('Check an internal invariant',`def average(values):
    assert values, "Internal input must not be empty"
    return sum(values) / len(values)

print(average([2, 4]))
try:
    average([])
except AssertionError as error:
    print(error)`,`3.0
Internal input must not be empty`,'With normal execution, the assertion raises when its condition is false. This example illustrates the mechanism, not a recommendation to validate public input with assert.','Optimized execution can remove the assertion. A public average API should use an explicit ValueError check if empty input must always be rejected.'),
e('Use a permanent validation check',`def positive(value):
    if value <= 0:
        raise ValueError("Must be positive")
    return value

print(positive(2))
try:
    positive(0)
except ValueError as error:
    print(error)`,`2
Must be positive`,'An ordinary if statement and raise remain part of the function under Python optimization. The check therefore enforces the contract in all normal execution modes.','Choose exception types that communicate the problem. Assertions are for assumptions about your own program, not mandatory external-input validation.'),
e('Avoid a tuple that is always truthy',`condition = False
assert (condition, "message")
print("A nonempty tuple is truthy")
try:
    assert condition, "Actual condition failed"
except AssertionError as error:
    print(error)`,`A nonempty tuple is truthy
Actual condition failed`,'Parenthesizing both values constructs a two-item tuple, which is truthy regardless of the first element. Python may also emit a SyntaxWarning for this mistake.','The correct assertion syntax separates the condition and message with a comma outside that tuple. This output assumes assertions have not been disabled with -O.') ]}
];
