const {e}=require('./helpers.cjs');
module.exports=[
{ids:[34,83],summary:'A descriptor is an object that customizes attribute access through __get__, __set__, or __delete__. Properties and bound methods use related descriptor machinery.',examples:[
e('Calculate a value through __get__',`class Double:
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance.value * 2

class Number:
    doubled = Double()
    def __init__(self, value):
        self.value = value

n = Number(4)
print(n.doubled)
n.value = 7
print(n.doubled)`,`8
14`,'Double is stored on the class, so reading n.doubled invokes its __get__ with n as the instance. The returned result uses the instance’s current state.','The instance-is-None branch handles access through Number.doubled. Descriptors should consider class access as well as instance access.'),
e('Reuse validation across attributes',`class Positive:
    def __set_name__(self, owner, name):
        self.storage = "_" + name
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.storage)
    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError("Must be positive")
        setattr(instance, self.storage, value)

class Box:
    width = Positive()
    height = Positive()

b = Box()
b.width, b.height = 3, 4
print(b.width * b.height)
try:
    b.width = 0
except ValueError as error:
    print(error)`,`12
Must be positive`,'__set_name__ gives each descriptor its declared attribute name so it can store values separately. Assigning width invokes validation in __set__.','The actual values live on each Box instance under different backing names. The shared descriptor stores the rule and storage name, not one shared width for every box.'),
e('See data-descriptor precedence',`class Fixed:
    def __get__(self, instance, owner):
        return 10
    def __set__(self, instance, value):
        raise AttributeError("Read-only")

class Item:
    value = Fixed()

item = Item()
item.__dict__["value"] = 99
print(item.value)
try:
    item.value = 3
except AttributeError as error:
    print(error)`,`10
Read-only`,'Defining __set__ makes Fixed a data descriptor. Its getter takes precedence over a same-named entry in the instance dictionary.','Normal assignment calls its setter and is rejected. A non-data descriptor that only defines __get__ has different precedence and can be shadowed by instance state.') ]},
{ids:[36,87],summary:'A dataclass writes common data-object methods for you from annotated fields. You still decide validation, mutability, defaults, and application behavior.',examples:[
e('Generate an initializer, representation, and equality',`from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int = 0

print(Point(2))
print(Point(2, 3) == Point(2, 3))`,`Point(x=2, y=0)
True`,'The decorator generates an initializer with y defaulting to zero, a readable repr, and field-based equality under normal defaults.','The annotations identify fields, but do not automatically enforce their types at runtime. Add validation if your object requires stricter guarantees.'),
e('Give every instance its own mutable default',`from dataclasses import dataclass, field

@dataclass
class Basket:
    items: list = field(default_factory=list)

a = Basket()
b = Basket()
a.items.append("apple")
print(a.items)
print(b.items)`,`['apple']
[]`,'default_factory is called for each new Basket, producing separate lists. Mutating a’s list therefore leaves b’s list untouched.','A single shared mutable default would couple otherwise independent records. Factories make creation of fresh state explicit.'),
e('Make a frozen value object',`from dataclasses import dataclass, FrozenInstanceError

@dataclass(frozen=True)
class Key:
    code: str

key = Key("A")
print({key: "value"}[Key("A")])
try:
    key.code = "B"
except FrozenInstanceError:
    print("Frozen field")`,`value
Frozen field`,'The frozen dataclass rejects ordinary field reassignment. With these hashable fields and normal equality settings, it also supports use as a dictionary key.','Freezing is not a recursive transformation of contained objects. A mutable field would still require care and could prevent hashing.') ]},
{ids:[51,99],summary:'An abstract base class declares required behavior for subclasses. A subclass must implement remaining abstract methods before it can be instantiated.',examples:[
e('Reject an incomplete implementation',`from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

try:
    Shape()
except TypeError:
    print("Implement area first")`,`Implement area first`,'ABC and @abstractmethod mark area as a requirement. Python prevents constructing Shape while that requirement remains abstract.','The check concerns the class interface, not automatic correctness of an eventual area implementation. Tests must still verify the actual behavior.'),
e('Implement the contract in a concrete subclass',`from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Square(Shape):
    def __init__(self, side):
        self.side = side
    def area(self):
        return self.side ** 2

square = Square(4)
print(square.area())
print(isinstance(square, Shape))`,`16
True`,'Square supplies a concrete area method and can be instantiated. Its inheritance also makes isinstance(square, Shape) true.','The base provides a shared contract for callers. Other subclasses can compute area differently while exposing the same operation.'),
e('Combine reusable code with an abstract operation',`from abc import ABC, abstractmethod

class Report(ABC):
    @abstractmethod
    def rows(self):
        pass
    def count(self):
        return len(self.rows())

class SmallReport(Report):
    def rows(self):
        return ["A", "B"]

print(SmallReport().count())`,`2`,'An abstract base class may contain concrete methods too. count is reusable code that calls the required rows operation implemented by the subclass.','This template-style design centralizes shared behavior while leaving one step customizable. It does not require every method on the base to be abstract.') ]},
{ids:[59],summary:'A singleton tries to share one instance. Use it only when shared lifetime and state are intentional; a simple explicitly passed object is often easier to test.',examples:[
e('Reuse one instance with __new__',`class Settings:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a = Settings()
b = Settings()
print(a is b)
a.theme = "dark"
print(b.theme)`,`True
dark`,'__new__ stores the first instance and returns it for later construction calls. Both variables therefore observe the same attributes.','This minimal demonstration is not a thread-safe singleton implementation and does not solve subclass lifetime rules. Shared state needs an explicit concurrency and ownership design.'),
e('Notice repeated initialization',`class Shared:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    def __init__(self):
        print("init")

a = Shared()
b = Shared()
print(a is b)`,`init
init
True`,'Returning the same suitable instance from __new__ does not automatically prevent Python from calling __init__ again.','Repeated initialization can reset shared state unexpectedly. An initialization guard or a different factory design is needed when one-time setup is required.'),
e('Share an explicitly created dependency instead',`class Settings:
    def __init__(self, mode):
        self.mode = mode

def render(settings):
    return "mode=" + settings.mode

shared = Settings("dark")
print(render(shared))
print(render(Settings("test")))`,`mode=dark
mode=test`,'The caller chooses when to share an instance instead of hiding that choice in construction. Production code can reuse shared while tests provide isolated settings.','This retains the useful shared-configuration behavior without enforcing a global singleton across every call site.') ]},
{ids:[62,100],summary:'A hash helps dictionaries and sets find objects. Equal hashable objects must have equal hashes, and their hash must stay stable while they are used as keys.',examples:[
e('Use equal immutable values as keys',`a = ("A", 1)
b = tuple(["A", 1])
print(a == b)
print(hash(a) == hash(b))
print({a: "found"}[b])`,`True
True
found`,'The two tuples compare equal and obey the same-hash requirement, so a dictionary entry inserted with one can be retrieved with the other.','The actual hash number is deliberately not printed: string-containing hashes can vary between Python processes. Equality of the hashes is the relevant guarantee.'),
e('Implement equality and hashing together',`class Key:
    def __init__(self, code):
        self.code = code
    def __eq__(self, other):
        if not isinstance(other, Key):
            return NotImplemented
        return self.code == other.code
    def __hash__(self):
        return hash(self.code)

a, b = Key("A"), Key("A")
print(a == b)
print(hash(a) == hash(b))
print(len({a, b}))`,`True
True
1`,'Both methods derive from the same code value, so equal instances produce equal hashes and a set treats them as one value.','Do not mutate code while this object is in a set or used as a dictionary key. A frozen value object is safer when the key should never change.'),
e('Understand why defining equality can disable hashing',`class Value:
    def __eq__(self, other):
        return isinstance(other, Value)

print(Value.__hash__ is None)
try:
    hash(Value())
except TypeError:
    print("Unhashable without a compatible hash")`,`True
Unhashable without a compatible hash`,'When a class defines equality without a compatible hash, Python normally makes its instances unhashable rather than retaining identity-based hashing.','That prevents equal objects from accidentally having incompatible inherited hashes. Implement both consistently only when stable hashability suits the type.') ]},
{ids:[66,92],summary:'Method chaining works when each call returns an object that supports the next call. Returning self creates a fluent API that keeps modifying the same object.',examples:[
e('Return self from mutating builder methods',`class Query:
    def __init__(self):
        self.parts = []
    def add(self, text):
        self.parts.append(text)
        return self
    def build(self):
        return " ".join(self.parts)

print(Query().add("SELECT *").add("FROM users").build())`,`SELECT * FROM users`,'Each add updates the same Query and returns it, allowing the next add to find the same method again. build returns the final string.','A terminal operation can return a different type. This example assembles text only; it is not a safe parameterized SQL execution API.'),
e('Check whether chaining preserves identity',`class Counter:
    def __init__(self):
        self.value = 0
    def increment(self):
        self.value += 1
        return self

c = Counter()
result = c.increment().increment()
print(c.value)
print(result is c)`,`2
True`,'Both calls mutate c. The final result is the same instance because increment returns self.','Callers holding any alias to c will see these changes. Document whether a fluent API mutates the receiver or returns a new value.'),
e('Design a chain that returns new values',`class Text:
    def __init__(self, value):
        self.value = value
    def upper(self):
        return Text(self.value.upper())
    def surround(self):
        return Text("[" + self.value + "]")

original = Text("hello")
changed = original.upper().surround()
print(original.value)
print(changed.value)`,`hello
[HELLO]`,'Each transformation constructs a new Text instead of modifying the receiver. The original remains unchanged while the returned objects form the chain.','Chaining is about compatible return values, not necessarily returning self. Immutable-style pipelines are another valid fluent design.') ]},
{ids:[81],summary:'super() continues method lookup after the current class in the MRO. It enables cooperative inheritance and is not simply a fixed direct-parent reference.',examples:[
e('Extend a base initializer',`class Person:
    def __init__(self, name):
        self.name = name

class Employee(Person):
    def __init__(self, name, role):
        super().__init__(name)
        self.role = role

e = Employee("Ada", "engineer")
print(e.name, e.role)`,`Ada engineer`,'Employee delegates shared name initialization through super and then adds role-specific state. The instance is the same object throughout the calls.','The subclass does not have to duplicate Person’s initialization logic. Compatible arguments are still the programmer’s responsibility.'),
e('Trace a cooperative diamond',`class A:
    def visit(self):
        print("A")
class B(A):
    def visit(self):
        print("B")
        super().visit()
class C(A):
    def visit(self):
        print("C")
        super().visit()
class D(B, C):
    pass

D().visit()`,`B
C
A`,'D’s MRO is D, B, C, A, object. The super call inside B proceeds to C for this instance, even though B’s declared base is A.','C then continues to A. Calling A.visit directly from B would bypass C and break this cooperative chain.'),
e('Add behavior around the inherited result',`class Formatter:
    def format(self, text):
        return text.strip()

class LoudFormatter(Formatter):
    def format(self, text):
        return super().format(text).upper()

print(LoudFormatter().format(" hello "))`,`HELLO`,'The base implementation removes surrounding spaces, then the subclass uppercases that returned string.','super returns a lookup helper, not the base instance itself. The inherited method still operates with the same receiver.') ]},
{ids:[82],summary:'Use methods for actions and properties for controlled attribute access. Instance methods know the object, class methods know the calling class, and static methods need only explicit inputs.',examples:[
e('Expose a property alongside an action',`class Wallet:
    def __init__(self):
        self._balance = 0
    def deposit(self, amount):
        self._balance += amount
    @property
    def balance(self):
        return self._balance

w = Wallet()
w.deposit(10)
print(w.balance)`,`10`,'deposit is an action and is called with parentheses. balance is exposed as a property and read with attribute syntax.','Keeping this distinction makes a class interface easier to understand. Real financial code would also need appropriate numeric types and validation.'),
e('Use a class method to construct an instance',`class Distance:
    def __init__(self, meters):
        self.meters = meters
    @classmethod
    def from_km(cls, kilometers):
        return cls(kilometers * 1000)
    @property
    def km(self):
        return self.meters / 1000

d = Distance.from_km(2)
print(d.meters)
print(d.km)`,`2000
2.0`,'from_km receives the calling class and constructs an instance. km computes a readable view of stored meters.','The constructor and property play different roles: one creates an object, and the other provides an attribute-like conversion of current state.'),
e('Keep a static validator independent of state',`class User:
    def __init__(self, name):
        if not self.valid_name(name):
            raise ValueError("Empty name")
        self.name = name
    @staticmethod
    def valid_name(name):
        return bool(name.strip())

print(User.valid_name("Ada"))
print(User("Grace").name)`,`True
Grace`,'valid_name needs only its argument, so it does not receive self or cls. It can be used before constructing a User as well as from initialization.','Static methods are a useful way to group class-related helpers, but a module function is also reasonable when the operation has no meaningful class association.') ]},
{ids:[96],summary:'A mixin adds a focused capability through inheritance. Keep it small and make its requirements on the receiving class clear.',examples:[
e('Reuse a serialization capability',`class DictMixin:
    def to_dict(self):
        return dict(self.__dict__)

class User(DictMixin):
    def __init__(self, name):
        self.name = name

print(User("Ada").to_dict())`,`{'name': 'Ada'}`,'The mixin contributes to_dict while User defines the actual data. Other ordinary classes with an instance dictionary can reuse the same helper.','This mixin assumes __dict__ exists and does not filter private or sensitive attributes. State its limitations rather than treating it as universal serialization.'),
e('Combine independent capabilities',`class GreetingMixin:
    def greet(self):
        return "Hi " + self.name

class LabelMixin:
    def label(self):
        return self.name.upper()

class User(GreetingMixin, LabelMixin):
    def __init__(self, name):
        self.name = name

u = User("Ada")
print(u.greet())
print(u.label())`,`Hi Ada
ADA`,'Each mixin supplies a separate behavior that relies on the documented name attribute. Neither has to own initialization here.','Avoid mixing many overlapping responsibilities or conflicting method names. Small capabilities are easier to combine and reason about.'),
e('Make a mixin cooperative with super',`class PrefixMixin:
    def render(self):
        return "prefix:" + super().render()

class Content:
    def render(self):
        return "body"

class Page(PrefixMixin, Content):
    pass

print(Page().render())`,`prefix:body`,'Page’s MRO places PrefixMixin before Content. The mixin adds a prefix and delegates to the next render implementation through super.','The ordering of bases matters, and the mixin requires a later compatible render method. Cooperative interfaces make that dependency predictable.') ]},
{ids:[97],summary:'The Observer pattern lets listeners subscribe to changes. A subject publishes events, and registered listeners decide how to react.',examples:[
e('Notify a subscribed callback',`class Subject:
    def __init__(self):
        self.listeners = []
    def subscribe(self, callback):
        self.listeners.append(callback)
    def emit(self, value):
        for callback in tuple(self.listeners):
            callback(value)

s = Subject()
s.subscribe(lambda value: print("received", value))
s.emit(7)`,`received 7`,'The subject stores a callback and calls it when an event occurs. It does not need to know how that callback handles the value.','Iterating a tuple snapshot prevents simple subscription-list edits from changing the current loop’s membership mid-notification. This is synchronous notification, not an event loop.'),
e('Send the same event to several observers',`class Subject:
    def __init__(self):
        self.listeners = []
    def subscribe(self, callback):
        self.listeners.append(callback)
    def emit(self, value):
        for callback in self.listeners:
            callback(value)

s = Subject()
s.subscribe(lambda n: print("double", n * 2))
s.subscribe(lambda n: print("square", n * n))
s.emit(3)`,`double 6
square 9`,'Both observers receive the same value and perform independent work. Registration order determines notification order in this list-based implementation.','An exception from one callback would interrupt this simple loop. A production design should explicitly decide error isolation, ordering, and whether asynchronous delivery is needed.'),
e('Unsubscribe when a listener is no longer needed',`class Subject:
    def __init__(self):
        self.listeners = []
    def subscribe(self, callback):
        self.listeners.append(callback)
    def unsubscribe(self, callback):
        self.listeners.remove(callback)
    def emit(self, value):
        for callback in tuple(self.listeners):
            callback(value)

def listener(value):
    print(value)

s = Subject()
s.subscribe(listener)
s.emit("first")
s.unsubscribe(listener)
s.emit("second")
print(len(s.listeners))`,`first
0`,'Removing the callback stops future notifications. The second event has no listener and produces no message.','Explicit unsubscription also releases the subject’s strong reference to that callback. This matters when callbacks are bound methods that otherwise keep their owner instances alive.') ]}
];
