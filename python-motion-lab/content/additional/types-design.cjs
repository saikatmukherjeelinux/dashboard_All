const {lesson:l,e}=require('./helpers.cjs');
module.exports=[
l(136,'How do typing.Protocol and structural subtyping differ from explicit inheritance?','Protocols & structural typing','Classes & design',
'A Protocol describes the attributes and methods a type must provide to satisfy a static interface. An ordinary class can satisfy it structurally without inheriting from the protocol. This brings a checkable contract to duck-typed APIs. @runtime_checkable enables limited isinstance checks for the presence of members, but does not validate method signatures, return types, or actual behavior.',
'Use protocols to describe small capabilities consumed by a function, especially when accepting third-party objects that should not inherit your base class.',
'A runtime protocol match does not prove full correctness or compatible types. Static checking and behavior tests serve different purposes from a shallow runtime presence check.',
'A protocol describes required behavior without requiring shared inheritance. Runtime checks are limited; they do not replace type checking or tests.',
e('Accept an implementation without protocol inheritance',`from typing import Protocol
class Named(Protocol):
    name: str
class User:
    name = "Ada"
def greet(value: Named) -> str:
    return "Hi " + value.name
print(greet(User()))`,`Hi Ada`,'User provides the attribute the protocol describes without explicitly inheriting Named. A static checker can recognize this structural match.','At runtime, greet simply accesses name. The annotation documents the intended contract but does not insert validation into the call.'),
e('Enable a limited runtime member check',`from typing import Protocol, runtime_checkable
@runtime_checkable
class Sized(Protocol):
    def __len__(self) -> int: ...
print(isinstance([1, 2], Sized))
print(isinstance(7, Sized))`,`True
False`,'The list supplies the required special method while an integer does not. runtime_checkable permits this isinstance use.','The check concerns member availability, not a guarantee that every supported object will return a meaningful non-negative length under all conditions.'),
e('Do not mistake presence for a verified signature',`from typing import Protocol, runtime_checkable
@runtime_checkable
class Runner(Protocol):
    def run(self) -> str: ...
class Wrong:
    def run(self, required):
        return required
value = Wrong()
print(isinstance(value, Runner))
try:
    value.run()
except TypeError:
    print("Signature is incompatible")`,`True
Signature is incompatible`,'The method exists, so the shallow runtime protocol check succeeds. Calling it with the promised zero-extra-argument interface still fails.','A static checker can catch the incompatible signature before execution. This is why runtime_checkable should not be described as complete interface validation.')),
l(137,'How do TypeVar and generics express relationships between types?','Type variables & generics','Functions',
'A type variable represents a type relationship across annotations, such as connecting a container’s element type with a function’s return type. A generic function can support many types while still preserving those relationships for a static checker. Bounds and constraints limit the intended possibilities. Runtime function calls still follow ordinary Python behavior unless validation is explicitly added.',
'Use generics for reusable containers, identity-like transformations, and functions where a fixed annotation would discard useful type information. Keep contracts as narrow as practical.',
'A TypeVar is not a runtime cast, constructor, or automatic validator. Do not assume that annotations can prevent a caller from supplying an incompatible value during execution.',
'Generics let one implementation preserve useful type relationships for many inputs. They guide checking rather than enforcing types at runtime.',
e('Connect input and output element types',`from typing import TypeVar
T = TypeVar("T")
def first(values: list[T]) -> T:
    return values[0]
print(first([1, 2]))
print(first(["Ada", "Grace"]))`,`1
Ada`,'A static checker can infer int for the first result and str for the second from the same generic function.','The implementation still assumes a nonempty list. Type relationships alone do not guarantee valid lengths or every other value-level condition.'),
e('Write a small generic container',`from typing import Generic, TypeVar
T = TypeVar("T")
class Box(Generic[T]):
    def __init__(self, value: T):
        self.value = value
print(Box[int](7).value)
print(Box[str]("hello").value)`,`7
hello`,'The type parameter describes the relationship between the container and its stored value. It helps checking tools retain information at call sites.','Generic specialization does not create separate optimized storage implementations here. The normal class stores the supplied Python object.'),
e('Observe that a bound is a checking contract',`from typing import TypeVar
T = TypeVar("T", bound=int)
def echo(value: T) -> T:
    return value
print(echo(3))
print(echo("runtime still accepts this"))`,`3
runtime still accepts this`,'A checker should reject the string call because it violates the bound. The runtime body simply returns its input and performs no type test.','This intentionally invalid typed call illustrates the distinction between static diagnostics and execution. Add an explicit check if rejection is a required runtime behavior.')),
l(138,'What does TypedDict describe, and does it validate dictionaries at runtime?','TypedDict & data shapes','Python toolkit',
'TypedDict describes the expected keys and value types of a dictionary for static type checking. Required and NotRequired distinguish key presence requirements. Instances remain ordinary dict objects at runtime, without automatic schema validation. This makes TypedDict useful for documenting structured records while retaining dictionary operations, but parsed external data still needs explicit checks.',
'Use TypedDict for internal record-shaped dictionaries and API boundaries whose validated data can then be given a useful static shape.',
'Constructing or annotating a TypedDict does not automatically reject missing keys or invalid value types during execution. It is not an isinstance schema validator.',
'TypedDict documents a dictionary’s expected shape for checking tools. Runtime data is still a dict and needs its own validation.',
e('Describe required and optional fields',`from typing import TypedDict, NotRequired
class User(TypedDict):
    name: str
    city: NotRequired[str]
user: User = {"name": "Ada"}
print(user["name"])
print(user.get("city", "unknown"))
print(type(user).__name__)`,`Ada
unknown
dict`,'name is required by the declared static shape, while city may be absent. Ordinary dictionary access rules still apply.','NotRequired requires Python 3.11 or a compatible typing backport. It describes presence, not a value that must be None.'),
e('See that runtime construction does not enforce fields',`from typing import TypedDict
class User(TypedDict):
    name: str
value = User()
print(value)
try:
    print(value["name"])
except KeyError:
    print("Required field was not validated")`,`{}
Required field was not validated`,'The runtime constructor creates a normal empty dictionary. Accessing a missing field raises the normal KeyError later.','A static checker can flag the incomplete construction. External data should be validated before callers rely on required-field annotations.'),
e('Validate a record before consuming it',`from typing import TypedDict
class User(TypedDict):
    name: str
def parse(data) -> User:
    if not isinstance(data, dict) or not isinstance(data.get("name"), str):
        raise ValueError("Expected a name string")
    return {"name": data["name"]}
print(parse({"name": "Ada"}))
try:
    parse({"name": 7})
except ValueError as error:
    print(error)`,`{'name': 'Ada'}
Expected a name string`,'The explicit conditions enforce the value-level requirement, and the function creates a record with the validated shape.','The return annotation documents the result for later checking. It complements the validation rather than replacing the code that performs it.')),
l(139,'How should loggers, handlers, levels, and formatting work together?','Structured application logging','Python toolkit',
'A logger creates records at levels such as DEBUG, INFO, WARNING, and ERROR. Handlers route eligible records to destinations, and formatters control their presentation. The effective logger level and each handler’s level can both filter output. Module-named loggers let applications configure reporting centrally. Passing format arguments separately delays message interpolation until logging needs the message.',
'Use logging for operational diagnostics with useful context. Let the application configure destinations instead of every library repeatedly configuring global logging.',
'Adding handlers repeatedly can duplicate output. Avoid logging secrets, and do not treat a log message as a substitute for actually handling or propagating an error.',
'Loggers produce records, handlers send them somewhere, and formatters display them. Levels decide which records are kept.',
e('Filter and format log records deterministically',`import io
import logging
stream = io.StringIO()
logger = logging.getLogger("lesson")
logger.setLevel(logging.INFO)
logger.propagate = False
handler = logging.StreamHandler(stream)
handler.setFormatter(logging.Formatter("%(levelname)s:%(message)s"))
logger.addHandler(handler)
logger.debug("hidden")
logger.info("hello %s", "Ada")
print(stream.getvalue().strip())`,`INFO:hello Ada`,'The INFO threshold drops the DEBUG record. The formatter emits a stable level-and-message string into an in-memory stream.','Passing Ada as a separate logging argument avoids eager string interpolation when a record is filtered. The example uses an isolated named logger.'),
e('Apply a stricter handler threshold',`import io
import logging
stream = io.StringIO()
logger = logging.getLogger("threshold")
logger.setLevel(logging.DEBUG)
logger.propagate = False
handler = logging.StreamHandler(stream)
handler.setLevel(logging.WARNING)
logger.addHandler(handler)
logger.info("not routed")
logger.warning("attention")
print(stream.getvalue().strip())`,`attention`,'The logger permits both records, but the handler accepts only WARNING and above. Filtering can therefore occur at more than one layer.','When a message appears to be missing, inspect both logger configuration and handler configuration rather than checking a single level setting.'),
e('Add contextual fields to a record',`import io
import logging
stream = io.StringIO()
logger = logging.getLogger("context")
logger.setLevel(logging.INFO)
logger.propagate = False
handler = logging.StreamHandler(stream)
handler.setFormatter(logging.Formatter("%(request_id)s:%(message)s"))
logger.addHandler(handler)
logger.info("complete", extra={"request_id": "R7"})
print(stream.getvalue().strip())`,`R7:complete`,'extra adds contextual record fields for a formatter or downstream structured logging handler. The request identifier makes the event easier to correlate.','If the formatter requires a field, ensure every routed record supplies it or provide defaults. Contextual fields should not include confidential values accidentally.')),
l(140,'How do mocks, specs, and call assertions help isolate a unit test?','Mocks & interaction testing','Python toolkit',
'unittest.mock supplies replaceable callables and objects that record interactions. return_value defines a simple response, side_effect can raise or compute responses, and call assertions inspect how the dependency was used. A spec or autospec limits accidental access to unsupported interfaces. Mocking is useful at a chosen dependency boundary, but tests should still exercise meaningful behavior rather than merely repeat the implementation.',
'Use mocks for controlled failures, expensive boundaries, or external effects that should not occur in a unit test. Prefer simple real values or fakes when they communicate behavior more clearly.',
'Patching the wrong lookup location leaves the code using its original dependency. Overly permissive mocks can also hide misspelled methods and unrealistic interactions.',
'Mocks replace a dependency and record its use. Give them a realistic interface and assert behavior that matters to the caller.',
e('Check a dependency call and its result',`from unittest.mock import Mock
loader = Mock(return_value={"name": "Ada"})
def greeting(load):
    return "Hi " + load(7)["name"]
print(greeting(loader))
loader.assert_called_once_with(7)
print("call verified")`,`Hi Ada
call verified`,'The fake loader returns a known record, making the greeting deterministic. The assertion verifies the important request identifier passed across the boundary.','The test checks a visible result as well as the interaction. It avoids requiring a real database or network request.'),
e('Model a failing dependency',`from unittest.mock import Mock
load = Mock(side_effect=TimeoutError("slow"))
try:
    load()
except TimeoutError:
    print("timeout handled")
print(load.call_count)`,`timeout handled
1`,'side_effect raises when the mock is called, allowing a repeatable failure path without sleeping or relying on an external system.','The attempted call is still recorded. A mock failure scenario is useful only if the surrounding code’s handling is also asserted appropriately.'),
e('Catch an unsupported mocked attribute',`from unittest.mock import Mock
class Service:
    def fetch(self):
        return "real"
fake = Mock(spec_set=Service)
fake.fetch.return_value = "fake"
print(fake.fetch())
try:
    fake.fecth()
except AttributeError:
    print("Unknown method rejected")`,`fake
Unknown method rejected`,'spec_set restricts the mock to attributes on the specified interface, so a misspelled method is not silently fabricated.','This is more realistic than an unrestricted mock, though it does not replace integration tests proving that the real service contract actually works.')),
l(141,'Why use if __name__ == "__main__", and what happens on import?','Script entry points & imports','Python toolkit',
'A module executed as the top-level script normally has __name__ equal to __main__. An imported module uses its module name instead. Top-level statements run during module initialization, so separating definitions from a guarded main function prevents ordinary imports from starting command-line work. This is particularly important when spawned worker processes import the main module.',
'Use a main function plus the guard for scripts that should also expose reusable functions. Keep import-time side effects small and deliberate.',
'The guard does not stop all top-level code from running on import; only its guarded body is skipped. Code placed above or outside it still executes during initialization.',
'The main guard runs script-only work while allowing functions to be imported without automatically starting that work.',
e('Check the name in a saved script',`def main():
    print("script work")
if __name__ == "__main__":
    main()`,`script work`,'Running this saved file directly gives it the top-level script name and executes main. The function definition itself does not call the function.','When importing the same file as a module, the guard would be false and main would remain available for explicit use.'),
e('Model imported and direct execution names',`code = 'print("top level");\\nif __name__ == "__main__": print("guarded")'
print("import model")
exec(code, {"__name__": "example_module"})
print("script model")
exec(code, {"__name__": "__main__"})`,`import model
top level
script model
top level
guarded`,'This fixed, trusted exec input models two module namespaces; it is not loading external text. The top-level print executes in both namespaces.','Only the guarded print depends on the special name. The example makes clear that the guard is a conditional statement, not an automatic import sandbox.'),
e('Keep reusable computation separate from presentation',`def square(value):
    return value * value
def main():
    print(square(7))
if __name__ == "__main__":
    main()`,`49`,'The computational function returns a result without printing. The script entry function decides how to present it.','This separation makes importing and testing square straightforward. It also keeps command-line behavior from being mixed into the function’s core result.')),
l(142,'How do packages and explicit relative imports organize modules?','Packages & relative imports','Python toolkit',
'A package organizes a module hierarchy and normally provides a package path for locating submodules. A regular package uses __init__.py, while namespace packages can span locations without that same file requirement. Explicit relative imports use a known package context, such as from .helpers import parse. They are not ordinary filesystem-relative lookups based only on the current working directory.',
'Use package structure to express dependency boundaries and run a package entry point with python -m when package-relative imports are needed.',
'Running an inner file directly can remove the package context required for relative imports. Changing working directory is not the same as defining a correct package hierarchy.',
'Packages give modules a hierarchy. Relative imports refer to that hierarchy, so they need package context rather than just a matching directory.',
e('Inspect a standard-library module’s package context',`import xml.etree.ElementTree as element_tree
print(element_tree.__package__)
print(element_tree.Element("root").tag)`,`xml.etree
root`,'ElementTree is a module inside the xml.etree package hierarchy. Its __package__ gives the context used for package-relative resolution.','The example imports a real standard-library module, avoiding a simulated claim about a nonexistent multi-file project.'),
e('Resolve a relative module with an explicit package',`from importlib import import_module
module = import_module(".ElementTree", package="xml.etree")
print(module.Element("item").tag)
print(module.__name__)`,`item
xml.etree.ElementTree`,'The leading dot means relative resolution, and package supplies the required base. The result is the same fully qualified module.','Use this mechanism only when dynamic importing is actually needed. Ordinary explicit import statements are clearer for fixed dependencies.'),
e('Distinguish a package from an ordinary module',`import math
import xml
print(hasattr(xml, "__path__"))
print(hasattr(math, "__path__"))
from importlib import import_module
try:
    import_module(".helpers")
except TypeError:
    print("Relative import needs package context")`,`True
False
Relative import needs package context`,'xml is a package with a package path; math is an ordinary extension module. Both can be imported, but they have different hierarchy roles.','The relative import request without a package is rejected. A leading dot alone does not tell the import machinery which package should contain helpers.')),
l(143,'How do __getattribute__ and __getattr__ differ during attribute lookup?','Attribute lookup hooks','Classes & design',
'__getattribute__ participates in ordinary attribute access and must usually delegate to the base implementation to preserve descriptors and normal lookup rules. __getattr__ is a fallback used after normal lookup fails with AttributeError. This makes __getattr__ suitable for selected virtual attributes, while __getattribute__ is a broader and more delicate interception point. These hooks do not universally intercept every implicit special-method lookup.',
'Use __getattr__ for narrow fallback behavior or lazy wrappers. Override __getattribute__ only when broad interception is a deliberate part of the object’s design.',
'Reading self.name from inside an unrestricted __getattribute__ override can recurse indefinitely. Use object.__getattribute__ or carefully designed delegation for internal access.',
'__getattribute__ handles normal lookup; __getattr__ is the missing-attribute fallback. Delegate carefully to avoid recursion and preserve normal behavior.',
e('Add a missing-attribute fallback',`class Settings:
    theme = "dark"
    def __getattr__(self, name):
        if name == "color":
            return "blue"
        raise AttributeError(name)
settings = Settings()
print(settings.theme)
print(settings.color)
print(hasattr(settings, "missing"))`,`dark
blue
False`,'theme is found normally, so the fallback is unnecessary. color is missing and is supplied by __getattr__.','Raising AttributeError for unsupported names preserves hasattr and ordinary missing-attribute behavior. Returning a default for every typo can hide mistakes.'),
e('Intercept one normal attribute safely',`class User:
    def __init__(self):
        self.name = "Ada"
    def __getattribute__(self, name):
        value = object.__getattribute__(self, name)
        return value.upper() if name == "name" else value
print(User().name)`,`ADA`,'The override delegates to object.__getattribute__ to obtain the real value, then transforms only the intended attribute.','Using self.name while handling the same lookup would recurse. Narrow interception is easier to reason about than changing every attribute access.'),
e('Observe the fallback after normal failure',`class Example:
    def __getattribute__(self, name):
        print("lookup", name)
        return object.__getattribute__(self, name)
    def __getattr__(self, name):
        return "fallback"
print(Example().unknown)`,`lookup unknown
fallback`,'The normal lookup hook runs first and delegates, which raises AttributeError for unknown. Python then invokes __getattr__ as the fallback.','The two hooks are not competing aliases. Their order and failure signaling determine whether fallback behavior is reached.')),
l(144,'What does double-underscore name mangling do, and is it privacy?','Name mangling & conventions','Classes & design',
'An attribute with a leading double underscore and no special-method-style trailing double underscore is transformed inside a class definition to include the class name. This reduces accidental collisions when subclasses use the same internal spelling. It is not encryption or an access-control boundary. A single leading underscore instead communicates a non-public convention without the same transformation.',
'Use mangling sparingly when a base class needs an internal attribute unlikely to collide with subclass state. Prefer clear public contracts and ordinary internal naming for most classes.',
'Do not confuse __value with __len__. Special protocol names ending in double underscores are not ordinary private fields, and mangled names can still be accessed explicitly.',
'Name mangling prevents accidental subclass name collisions. It is a naming transformation, not a security or privacy guarantee.',
e('Inspect the transformed storage name',`class Secret:
    def __init__(self):
        self.__value = 7
    def reveal(self):
        return self.__value
item = Secret()
print(item.reveal())
print(sorted(vars(item)))`,`7
['_Secret__value']`,'The class body’s __value references are transformed to a class-qualified name, which is visible in the instance dictionary.','The method reads the same transformed name. This is why a plain item.__value lookup would not find that stored field.'),
e('Avoid a base/subclass field collision',`class Base:
    def __init__(self):
        self.__value = "base"
    def base_value(self):
        return self.__value
class Child(Base):
    def __init__(self):
        super().__init__()
        self.__value = "child"
item = Child()
print(item.base_value())
print(sorted(vars(item)))`,`base
['_Base__value', '_Child__value']`,'The identical source spelling is mangled using the class where it appears. Base and Child therefore store different attributes.','The base method still reads its own base field, which prevents an accidental override by the subclass’s similarly named implementation detail.'),
e('See that mangling is not access control',`class Example:
    def __init__(self):
        self.__value = 7
item = Example()
print(item._Example__value)
item._Example__value = 9
print(item._Example__value)`,`7
9`,'A caller who knows the transformed name can still read and modify the attribute. Python does not enforce secrecy through this convention.','Respect non-public APIs even when technically accessible. Confidential data needs an actual security design rather than a naming prefix.')),
l(145,'How do class attributes, instance attributes, and shared mutable defaults differ?','Class vs instance state','Classes & design',
'Class attributes are shared through the class namespace, while ordinary instance attributes are stored per instance. Reading an absent instance name can fall back to the class, but assigning the name on an instance usually creates an instance binding instead of changing the class. Mutating a shared class-level list is different: every instance still referring to that list sees the mutation.',
'Use class attributes for genuinely shared constants or configuration, and initialize per-object mutable data inside __init__. Document deliberate shared registries explicitly.',
'Putting items = [] on a class does not give each instance a fresh list. Also, item.count += 1 can create an instance shadow rather than update a common class counter.',
'Instance state belongs to one object; class state is shared. Create mutable per-instance containers during initialization.',
e('Observe accidental shared mutable state',`class Basket:
    items = []
a, b = Basket(), Basket()
a.items.append("apple")
print(b.items)
print(a.items is b.items)`,`['apple']
True`,'Neither instance owns a separate items attribute, so both look up the same class-level list. append mutates that shared object.','This is an ownership mistake when baskets should be independent. The class declaration creates the list once, not once per instance.'),
e('Give each instance an independent container',`class Basket:
    def __init__(self):
        self.items = []
a, b = Basket(), Basket()
a.items.append("apple")
print(a.items)
print(b.items)`,`['apple']
[]`,'Each constructor call creates and stores a fresh list on its receiver. The two baskets therefore maintain separate state.','This is the ordinary pattern for mutable per-object fields. A class-level constant can still be appropriate for immutable shared defaults.'),
e('Distinguish shadowing from a class update',`class Counter:
    count = 0
a, b = Counter(), Counter()
a.count += 1
print(a.count, b.count, Counter.count)
Counter.count = 5
print(a.count, b.count, Counter.count)`,`1 0 0
1 5 5`,'The augmented assignment reads a’s inherited zero, computes a new integer, and writes an instance attribute. It does not update Counter.count.','Later changing the class affects b, which still falls back to the class, but a keeps its own shadowing value.'))
];
