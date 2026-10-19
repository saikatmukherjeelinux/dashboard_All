const {e}=require('./helpers.cjs');
module.exports=[
{ids:[4],summary:'A decorator takes a function and gives back a function with extra behavior. The @ syntax applies that transformation for you.',examples:[
e('Add behavior before and after a call',`def announce(fn):
    def wrapper():
        print("Before")
        result = fn()
        print("After")
        return result
    return wrapper

@announce
def greet():
    return "Hello"

print(greet())`,`Before
After
Hello`,'@announce replaces greet with announce(greet), so calling greet enters wrapper first. The original function is still reachable through the enclosing fn binding.','The wrapper saves and returns the original result. Its own messages print before the outer print receives and displays Hello.'),
e('Forward positional and keyword arguments',`from functools import wraps

def double_result(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return 2 * fn(*args, **kwargs)
    return wrapper

@double_result
def add(a, b=1):
    return a + b

print(add(3, b=4))
print(add.__name__)`,`14
add`,'*args and **kwargs preserve flexible calling conventions: 3 is positional and b=4 is forwarded by name. The original sum is 7 and the wrapper doubles it.','wraps preserves metadata such as the original function name; it does not perform the doubling or enforce argument types.'),
e('Understand stacked decorator order',`def tag(name):
    def decorate(fn):
        def wrapper():
            return name + "(" + fn() + ")"
        return wrapper
    return decorate

@tag("outer")
@tag("inner")
def value():
    return "core"

print(value())`,`outer(inner(core))`,'The decorator closest to def is applied first: value becomes tag("outer")(tag("inner")(value)).','At call time, the outer wrapper invokes the inner wrapper, which invokes the original function. The returned string makes that nesting visible.') ]},
{ids:[10,37,84],summary:'Memoization remembers answers to repeated calls. An LRU cache limits memory by discarding the answer that has gone unused the longest.',examples:[
e('Reuse an expensive result',`from functools import lru_cache

@lru_cache(maxsize=2)
def square(n):
    print("compute", n)
    return n * n

print(square(4))
print(square(4))
info = square.cache_info()
print(info.hits, info.misses)`,`compute 4
16
16
1 1`,'The first call misses the cache, executes square, and stores 16. The second call returns the stored result without executing the body again.','The compute message appears only once. cache_info reports one hit and one miss; those counts show reuse without relying on unreliable timing measurements.'),
e('Watch least-recently-used eviction',`from functools import lru_cache

@lru_cache(maxsize=2)
def square(n):
    print("compute", n)
    return n * n

for n in [1, 2, 1, 3, 2]:
    square(n)
print(square.cache_info().hits, square.cache_info().misses)`,`compute 1
compute 2
compute 3
compute 2
1 4`,'After caching 1 and 2, revisiting 1 makes it more recent. Inserting 3 therefore evicts 2, which must be computed again on the final request.','LRU tracks recency, not frequency or numerical order. A small cache can repeatedly recompute values when the working set exceeds its capacity.'),
e('Use hashable keys and clear stale results',`from functools import lru_cache

@lru_cache(maxsize=4)
def total(values):
    return sum(values)

print(total((2, 3)))
try:
    total([2, 3])
except TypeError:
    print("Use a hashable key")
total.cache_clear()
print(total.cache_info().currsize)`,`5
Use a hashable key
0`,'The tuple of integers is hashable and can form a cache key. A mutable list cannot, so the list call raises TypeError before entering the function body.','cache_clear removes existing entries and resets statistics. Prefer caching repeatable computations; mutable external state can otherwise make remembered answers stale.') ]},
{ids:[14,63],summary:'Python does not automatically keep several same-named methods based on their signatures. Use defaults, variable arguments, or explicit type dispatch.',examples:[
e('Support several call shapes with defaults',`def area(width, height=None):
    if height is None:
        height = width
    return width * height

print(area(4))
print(area(4, 3))`,`16
12`,'The same function handles both calls. A missing height selects square behavior, while an explicit height selects rectangle behavior.','Using None as the missing-value marker avoids treating a legitimate zero height as though it were omitted. This is conditional behavior, not signature-based overload resolution.'),
e('Collect a variable number of inputs',`def add(*values):
    return sum(values)

print(add())
print(add(2, 3))
print(add(2, 3, 4))`,`0
5
9`,'*values collects additional positional arguments into a tuple. sum works for an empty tuple and for tuples of any length containing compatible numeric values.','One definition covers all these arities. Document the accepted element types because *args itself does not validate their meaning.'),
e('See why redefining a method is not overloading',`class Greeter:
    def hello(self, name):
        return "Hi " + name

    def hello(self):
        return "Hi everyone"

g = Greeter()
print(g.hello())
try:
    g.hello("Ada")
except TypeError:
    print("Earlier definition was replaced")`,`Hi everyone
Earlier definition was replaced`,'A class body binds names in a namespace. The second def binds hello again, replacing the first function rather than adding another signature.','The surviving method accepts only self. Passing Ada gives it an unexpected positional argument and raises TypeError.') ]},
{ids:[15,75,94],summary:'A closure is an inner function that remembers variables from its surrounding function. It lets you keep small pieces of private state without a class.',examples:[
e('Build a configurable function',`def multiplier(factor):
    def apply(value):
        return value * factor
    return apply

double = multiplier(2)
triple = multiplier(3)
print(double(5))
print(triple(5))`,`10
15`,'Each call to multiplier creates its own enclosing factor binding. The returned functions retain access to those separate bindings after multiplier finishes.','double and triple run the same inner function logic with different remembered configuration. This is useful for callbacks and small function factories.'),
e('Update captured state using nonlocal',`def make_counter():
    count = 0
    def next_value():
        nonlocal count
        count += 1
        return count
    return next_value

a = make_counter()
b = make_counter()
print(a(), a(), b())`,`1 2 1`,'nonlocal directs assignment to the count binding in the enclosing function instead of creating a local count inside next_value.','a and b come from separate factory calls and have independent state. Two calls to a advance only its counter; b still starts at 1.'),
e('Avoid late-binding surprises in loops',`late = [lambda: n for n in range(3)]
fixed = [lambda n=n: n for n in range(3)]

print([fn() for fn in late])
print([fn() for fn in fixed])`,`[2, 2, 2]
[0, 1, 2]`,'The first set of lambdas looks up the shared loop binding when called, after the loop has finished with n equal to 2. A closure is not automatically a snapshot.','The default argument n=n is evaluated separately when each lambda is created. It preserves the value for that function call without relying on the later loop binding.') ]},
{ids:[19],summary:'Annotations describe intended types. They help readers and checking tools, but ordinary Python function calls do not automatically enforce them.',examples:[
e('Read a function’s declared types',`from typing import get_type_hints

def twice(value: int) -> int:
    return value * 2

hints = get_type_hints(twice)
print(hints["value"].__name__)
print(hints["return"].__name__)
print(twice(4))`,`int
int
8`,'get_type_hints retrieves resolved annotation information. Looking at the type names keeps the output readable rather than printing implementation-specific annotation storage.','The function’s body performs the actual multiplication. The annotations document the intended input and return types for readers and static checking tools.'),
e('Observe that annotations do not enforce types',`def twice(value: int) -> int:
    return value * 2

print(twice("ha"))
print(type(twice("ha")).__name__)`,`haha
str`,'The call succeeds because multiplying a string by 2 is valid Python. The int annotation does not insert a runtime check.','A static checker can flag this mismatch before execution. If runtime rejection matters, explicitly validate the value rather than assuming annotations do it.'),
e('Add explicit runtime validation',`def positive(value: int) -> int:
    if type(value) is not int:
        raise TypeError("Expected an integer")
    if value <= 0:
        raise ValueError("Expected a positive value")
    return value

print(positive(3))
for value in ["3", -1]:
    try:
        positive(value)
    except (TypeError, ValueError) as error:
        print(type(error).__name__)`,`3
TypeError
ValueError`,'The checks in the function body enforce the contract: the string fails the type check, while -1 passes the type check but fails the value constraint.','Using type(value) is int deliberately excludes bool and subclasses here. Use isinstance when your API should accept compatible subclasses instead.') ]},
{ids:[58],summary:'*args gathers extra positional values into a tuple. **kwargs gathers extra named values into a dictionary. The stars also unpack arguments when calling functions.',examples:[
e('See the collected argument containers',`def show(*args, **kwargs):
    print(args)
    print(sorted(kwargs.items()))

show(10, 20, color="blue", size=3)`,`(10, 20)
[('color', 'blue'), ('size', 3)]`,'The two unnamed values enter args in their original order. The named values enter kwargs under their keyword names.','Sorting keyword items makes this display independent of the order in which callers supply them. The names args and kwargs are conventions; the star syntax gives them their behavior.'),
e('Unpack a list and dictionary into a call',`def greet(name, punctuation="!"):
    return "Hi " + name + punctuation

values = ["Ada"]
settings = {"punctuation": "?"}
print(greet(*values, **settings))`,`Hi Ada?`,'At the call site, *values expands the list into positional arguments and **settings expands the dictionary into keyword arguments.','The resulting call is equivalent to greet("Ada", punctuation="?"). Dictionary keys used for keyword unpacking must be strings accepted by the callable.'),
e('Detect duplicate argument assignment',`def add(a, b):
    return a + b

try:
    print(add(1, **{"a": 2, "b": 3}))
except TypeError:
    print("Argument a was supplied twice")`,`Argument a was supplied twice`,'The positional 1 already binds a. Expanding the dictionary tries to bind a again, so Python rejects the call before the function body executes.','Argument unpacking does not override a value already supplied through another argument path. Remove the duplicate before calling the function.') ]},
{ids:[72],summary:'wraps keeps a decorated function recognizable by preserving metadata and a link to the original function. It does not change the wrapper’s actual runtime behavior.',examples:[
e('Preserve a function’s name and documentation',`from functools import wraps

def log(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@log
def greet():
    """Return a greeting."""
    return "Hi"

print(greet.__name__)
print(greet.__doc__)`,`greet
Return a greeting.`,'Without wraps, callers would inspect the wrapper’s name and documentation instead. wraps copies selected metadata from the wrapped function.','This matters for help output, debugging messages, documentation tools, and decorators that other tools inspect.'),
e('Inspect the original signature',`import inspect
from functools import wraps

def decorate(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@decorate
def add(a, b=2):
    return a + b

print(inspect.signature(add))
print(add(3))`,`(a, b=2)
5`,'inspect.signature follows the __wrapped__ link installed by wraps and can report the original parameters. The physical wrapper still receives *args and **kwargs.','The call works because the wrapper forwards those arguments to the original function; preserving metadata does not forward arguments by itself.'),
e('Access the undecorated function',`from functools import wraps

def double(fn):
    @wraps(fn)
    def wrapper():
        return fn() * 2
    return wrapper

@double
def answer():
    return 7

print(answer())
print(answer.__wrapped__())`,`14
7`,'Calling answer runs the wrapper and doubles the result. Calling its __wrapped__ attribute directly invokes the original function and bypasses that added behavior.','This escape hatch is useful for testing and introspection. It also means a decorator should not assume that its wrapper is an impenetrable security boundary.') ]},
{ids:[77],summary:'A docstring is a string placed first inside a module, class, or function. Python stores it as documentation that tools and readers can inspect.',examples:[
e('Retrieve a function’s documentation',`def add(a, b):
    """Return the sum of a and b."""
    return a + b

print(add.__doc__)
print(add(2, 3))`,`Return the sum of a and b.
5`,'The string is the first statement in add, so Python exposes it through __doc__. The return statement provides the function’s result separately.','A docstring describes behavior; it is not a comment and is not automatically printed whenever the function runs.'),
e('Clean indentation in multiline documentation',`import inspect

def greet(name):
    """Greet a person.

    Return a friendly message.
    """
    return "Hi " + name

print(inspect.getdoc(greet))`,`Greet a person.

Return a friendly message.`,'inspect.getdoc removes common indentation from a multiline docstring, producing readable documentation outside the source file.','The blank line separates the short summary from the extra detail. This structure helps both humans and documentation generators.'),
e('Distinguish a docstring from a later string',`def correct():
    """I am documentation."""
    return 1

def later():
    value = 1
    "This is not the function docstring."
    return value

print(correct.__doc__ is not None)
print(later.__doc__ is None)`,`True
True`,'Only a qualifying first-statement string supplies the function docstring. A later standalone string does not become __doc__.','Keep the docstring immediately after def, then put implementation statements below it. Comments above def also do not populate __doc__.') ]},
{ids:[88],summary:'singledispatch chooses a function implementation from the first argument’s type. It is useful when one operation needs different behavior for different kinds of values.',examples:[
e('Register specialized behavior',`from functools import singledispatch

@singledispatch
def describe(value):
    return "other"

@describe.register(int)
def _(value):
    return "integer"

print(describe(4))
print(describe("four"))`,`integer
other`,'The int implementation handles 4. No string implementation is registered, so the original generic function handles "four".','The registry selects code by the first argument’s type, not its value, name, or the desired return type.'),
e('Dispatch through inheritance',`from functools import singledispatch

@singledispatch
def label(value):
    return "object"

@label.register(int)
def _(value):
    return "integer family"

print(label(True))
print(label(3.5))`,`integer family
object`,'bool is a subclass of int, so the registered int implementation also applies to True when no more-specific bool registration exists.','A float does not inherit int and falls back to the generic implementation. Register bool separately if it needs distinct treatment.'),
e('Notice that only the first argument dispatches',`from functools import singledispatch

@singledispatch
def combine(first, second):
    return "generic"

@combine.register(str)
def _(first, second):
    return first + ":" + str(second)

print(combine("score", 5))
print(combine(5, "score"))`,`score:5
generic`,'A string in the first position selects the specialized implementation. Moving that string to the second position does not influence singledispatch selection.','Use explicit branching or another dispatch design if the combination of multiple argument types must determine behavior.') ]}
];
