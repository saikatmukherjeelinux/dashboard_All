const {e}=require('./helpers.cjs');
module.exports=[
{ids:[5,48,71,90],summary:'A class makes instances; a metaclass makes classes. Use a metaclass only when class creation itself needs rules or customization.',examples:[
e('See that classes are objects too',`class User:
    pass

user = User()
print(type(user).__name__)
print(type(User).__name__)
print(isinstance(User, type))`,`User
type
True`,'user is an instance of User, and User is itself an instance of type. type is the usual metaclass that constructs class objects.','This is the extra level metaprogramming works with: code can inspect or customize a class object, not just instances created from it.'),
e('Add an attribute during class creation',`class Tagged(type):
    def __new__(mcls, name, bases, namespace):
        namespace["tag"] = name.lower()
        return super().__new__(mcls, name, bases, namespace)

class Invoice(metaclass=Tagged):
    pass

print(Invoice.tag)
print(Invoice().tag)`,`invoice
invoice`,'Tagged receives the new class name, base classes, and namespace before the class object is created. It inserts a class attribute into that namespace.','The attribute is available through both the class and its instances via normal attribute lookup. A simpler class decorator may be sufficient for many such transformations.'),
e('Reject an incomplete class definition',`class RequireRun(type):
    def __new__(mcls, name, bases, namespace):
        if "run" not in namespace:
            raise TypeError("run is required")
        return super().__new__(mcls, name, bases, namespace)

try:
    class Broken(metaclass=RequireRun):
        pass
except TypeError as error:
    print(error)

class Job(metaclass=RequireRun):
    def run(self):
        return "done"

print(Job().run())`,`run is required
done`,'The metaclass validates the class namespace when the class statement runs, before any instance is created. Broken fails because it does not declare run.','This deliberately checks only the new namespace, not inherited methods. For ordinary interface requirements, abstract base classes often express the intent more clearly.') ]},
{ids:[6,60,102],summary:'Monkey patching replaces behavior on an existing object, class, or module while the program runs. Keep patches narrow and restore the original behavior afterward.',examples:[
e('Replace a method at runtime',`class Greeter:
    def hello(self):
        return "Hello"

g = Greeter()
print(g.hello())
Greeter.hello = lambda self: "Hi"
print(g.hello())`,`Hello
Hi`,'The method is looked up on Greeter when g.hello is accessed. Replacing the class attribute changes what the existing instance calls.','This affects other instances using that class method too. It is a runtime modification, whereas a subclass override creates a separate specialization.'),
e('Scope a temporary test patch',`from unittest.mock import patch

class Clock:
    def now(self):
        return 100

clock = Clock()
with patch.object(Clock, "now", return_value=7):
    print(clock.now())
print(clock.now())`,`7
100`,'patch.object temporarily substitutes a mock for the method. The with block establishes exactly where the replacement applies.','On exit, the original method is restored even if the block raises. Scoped patches reduce the risk of one test changing another test’s behavior.'),
e('Prefer explicit dependencies when possible',`def report(now):
    return "time=" + str(now())

print(report(lambda: 7))
print(report(lambda: 12))`,`time=7
time=12`,'Instead of replacing a global clock, report accepts the behavior it depends on as an argument. Each caller can supply a deterministic clock.','Dependency injection makes the substitution visible in the function signature and avoids modifying a shared class or module. Use patching when that seam is not available.') ]},
{ids:[7,40,74,105],summary:'An instance method receives self, a class method receives cls, and a static method receives neither automatically. Choose based on which state the method needs.',examples:[
e('Compare all three kinds of method',`class Demo:
    label = "class"
    def instance(self):
        return self.label
    @classmethod
    def class_name(cls):
        return cls.__name__
    @staticmethod
    def add(a, b):
        return a + b

d = Demo()
d.label = "instance"
print(d.instance())
print(Demo.class_name())
print(Demo.add(2, 3))`,`instance
Demo
5`,'The instance method reads d’s own label. The class method receives Demo and reads its name. The static method just uses the explicitly supplied numbers.','A static method does not automatically know the instance or calling class. It groups a utility with the class without binding self or cls.'),
e('Make an inheritance-friendly alternate constructor',`class User:
    def __init__(self, name):
        self.name = name
    @classmethod
    def from_text(cls, text):
        return cls(text.strip())

class Admin(User):
    pass

user = Admin.from_text(" Ada ")
print(type(user).__name__)
print(user.name)`,`Admin
Ada`,'Calling the inherited class method through Admin binds cls to Admin. Constructing cls(...) therefore returns the appropriate subclass.','Hard-coding User(...) would lose this behavior. Alternate constructors are a common reason to choose classmethod over staticmethod.'),
e('Keep utilities independent from state',`class Temperature:
    @staticmethod
    def celsius_to_fahrenheit(celsius):
        return celsius * 9 / 5 + 32

print(Temperature.celsius_to_fahrenheit(0))
print(Temperature().celsius_to_fahrenheit(100))`,`32.0
212.0`,'Both calls pass only the explicit temperature value; no instance is injected when the static method is accessed through an instance.','The utility could also be a module-level function. Keeping it on the class is an organizational choice, not a requirement for accessing object state.') ]},
{ids:[8],summary:'__str__ gives a friendly display. __repr__ gives a useful debugging representation. If __str__ is absent, Python can fall back to __repr__.',examples:[
e('Separate user display from debugging',`class Book:
    def __init__(self, title):
        self.title = title
    def __str__(self):
        return self.title
    def __repr__(self):
        return f"Book({self.title!r})"

b = Book("Python")
print(str(b))
print(repr(b))`,`Python
Book('Python')`,'str uses the readable title, while repr includes the class-like structure and quotes around the string. !r applies repr to the title itself.','A helpful representation shows important state without depending on a memory address. It need not be executable in every class, but should be informative.'),
e('Understand representation inside containers',`class Item:
    def __str__(self):
        return "friendly"
    def __repr__(self):
        return "Item()"

item = Item()
print(item)
print([item])`,`friendly
[Item()]`,'Printing the object directly uses its string representation. Printing a list uses the representation of each contained item.','This is why a good __repr__ matters when debugging collections: a friendly __str__ alone does not control every display context.'),
e('Use the fallback when only repr is defined',`class Point:
    def __repr__(self):
        return "Point(2, 3)"

p = Point()
print(str(p))
print(repr(p))`,`Point(2, 3)
Point(2, 3)`,'Without a custom __str__, the inherited default uses the object’s representation. Both calls therefore produce the same text.','Start with a useful __repr__ for a data object, then add __str__ when users need a distinct, simpler display.') ]},
{ids:[18,78],summary:'Define __call__ on a class to make its instances callable. This gives you function-like syntax with object state.',examples:[
e('Keep state across calls',`class Counter:
    def __init__(self):
        self.value = 0
    def __call__(self):
        self.value += 1
        return self.value

counter = Counter()
print(callable(counter))
print(counter(), counter())`,`True
1 2`,'counter() invokes Counter.__call__ on that instance. The value attribute persists between calls, so each invocation increments the same counter.','callable reports that the object supports calling; it does not guarantee that every possible argument list will be accepted.'),
e('Configure a callable object',`class Multiply:
    def __init__(self, factor):
        self.factor = factor
    def __call__(self, value):
        return value * self.factor

double = Multiply(2)
print(double(7))
double.factor = 3
print(double(7))`,`14
21`,'The instance stores configuration in factor and applies it each time it is called. Updating the attribute changes future behavior.','This resembles a closure-based function factory, but a class makes state explicit through attributes and can expose additional methods.'),
e('Use callable instances in higher-order functions',`class LongerThan:
    def __init__(self, size):
        self.size = size
    def __call__(self, text):
        return len(text) > self.size

words = ["a", "cat", "python"]
print(list(filter(LongerThan(2), words)))`,`['cat', 'python']`,'filter calls the supplied object for each item just as it would call a function. The stored size determines which words pass.','This is useful when a callback needs reusable configuration. The consuming API only needs callable behavior, not a particular concrete type.') ]},
{ids:[20,38],summary:'Dunder methods connect your class to Python syntax and built-in operations. Implement the protocol that matches the behavior your object naturally supports.',examples:[
e('Support len and indexing',`class Team:
    def __init__(self, names):
        self.names = list(names)
    def __len__(self):
        return len(self.names)
    def __getitem__(self, index):
        return self.names[index]

team = Team(["Ada", "Grace"])
print(len(team))
print(team[1])`,`2
Grace`,'len(team) uses __len__, and team[1] uses __getitem__. The methods delegate to the internal list.','These hooks let your type fit ordinary Python expressions. Keep their behavior unsurprising: indexing should select an element and length should describe a non-negative size.'),
e('Define addition for a small value type',`class Score:
    def __init__(self, value):
        self.value = value
    def __add__(self, other):
        if not isinstance(other, Score):
            return NotImplemented
        return Score(self.value + other.value)

print((Score(2) + Score(3)).value)
try:
    Score(2) + 3
except TypeError:
    print("Unsupported operands")`,`5
Unsupported operands`,'The + operator finds __add__. It returns a new Score for a supported pair rather than mutating either input.','NotImplemented tells Python that this operand combination is unsupported, allowing other operator protocol steps before a final TypeError.'),
e('Control truthiness through length',`class Basket:
    def __init__(self, items):
        self.items = items
    def __len__(self):
        return len(self.items)

print(bool(Basket([])))
print(bool(Basket(["apple"])))`,`False
True`,'When __bool__ is not defined, Python can use __len__ to determine truthiness: zero is false and a positive length is true.','This makes if basket behave like if list. A separate __bool__ can override the meaning when length is not the right signal.') ]},
{ids:[21,101],summary:'MRO is the order Python searches through classes for attributes and methods. In multiple inheritance, it prevents inconsistent parent ordering.',examples:[
e('Inspect a diamond hierarchy',`class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass

print([cls.__name__ for cls in D.__mro__])`,`['D', 'B', 'C', 'A', 'object']`,'D lists B before C, and both bases depend on A. C3 places the shared ancestor after both intermediate classes.','The order is neither a simple depth-first traversal nor a repeated visit to A. Read __mro__ when multiple inheritance behavior is unclear.'),
e('Resolve the first matching method',`class A:
    def label(self):
        return "A"
class B(A):
    pass
class C(A):
    def label(self):
        return "C"
class D(B, C):
    pass

print(D().label())`,`C`,'Lookup checks D, then B, then C, then A. B does not define label, so C’s version is found before A’s.','Even though B inherits A, Python does not complete B’s entire ancestry before considering C. The single combined MRO controls lookup.'),
e('Reject contradictory base orders',`class X: pass
class Y: pass
class A(X, Y): pass
class B(Y, X): pass

try:
    class Broken(A, B):
        pass
except TypeError:
    print("No consistent MRO")`,`No consistent MRO`,'A requires X before Y, while B requires Y before X. A subclass combining both cannot satisfy those constraints at once.','Python raises at class creation rather than picking an arbitrary order. Redesign conflicting base relationships instead of relying on a guessed lookup path.') ]},
{ids:[22,46],summary:'Duck typing asks whether an object supports the needed behavior. A useful object does not always need to inherit a specific class.',examples:[
e('Accept different implementations of the same behavior',`class Dog:
    def speak(self):
        return "woof"
class Robot:
    def speak(self):
        return "beep"

def announce(thing):
    print(thing.speak())

announce(Dog())
announce(Robot())`,`woof
beep`,'announce depends on a callable speak method with suitable behavior. Dog and Robot satisfy that contract without a common custom base class.','This reduces coupling, but the behavioral contract still matters: a method with the same name but incompatible arguments is not automatically suitable.'),
e('Read text from any suitable stream',`from io import StringIO

def first_line(source):
    return source.readline().strip()

print(first_line(StringIO("hello\\nworld")))`,`hello`,'The function needs readline, not an actual file on disk. StringIO supplies that behavior using an in-memory string.','A real text file can work with the same function. Programming to a small protocol makes testing easier and avoids unnecessary concrete type checks.'),
e('Report an unsupported operation clearly',`def area(shape):
    return shape.area()

class Square:
    def area(self):
        return 9

print(area(Square()))
try:
    area(object())
except AttributeError:
    print("An area() method is required")`,`9
An area() method is required`,'The generic function tries the required operation directly. A plain object lacks area and raises AttributeError.','This illustrates the protocol boundary. In a larger program, avoid broad exception handling that could hide an unrelated AttributeError raised inside a valid implementation.') ]},
{ids:[24,61],summary:'A property lets ordinary attribute access run controlled getter or setter logic. Callers keep using obj.value while the class manages how that value is read or changed.',examples:[
e('Expose a computed attribute',`class Rectangle:
    def __init__(self, width, height):
        self.width, self.height = width, height
    @property
    def area(self):
        return self.width * self.height

r = Rectangle(3, 4)
print(r.area)
r.width = 5
print(r.area)`,`12
20`,'Accessing r.area calls the getter without parentheses. The result is recomputed from current attributes, so changing width changes the next result.','@property does not automatically cache values. Use it for a cheap computed attribute or for controlled access with a familiar interface.'),
e('Validate assignments with a setter',`class Account:
    def __init__(self, balance):
        self.balance = balance
    @property
    def balance(self):
        return self._balance
    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("Negative balance")
        self._balance = value

a = Account(10)
print(a.balance)
try:
    a.balance = -1
except ValueError as error:
    print(error)
print(a.balance)`,`10
Negative balance
10`,'Both initialization and later assignment go through the setter. The rejected value is never stored because validation runs before updating _balance.','The backing name _balance avoids recursively assigning the property itself. The leading underscore signals an internal implementation detail, not enforced privacy.'),
e('Create a read-only public attribute',`class User:
    def __init__(self, user_id):
        self._user_id = user_id
    @property
    def user_id(self):
        return self._user_id

user = User(7)
print(user.user_id)
try:
    user.user_id = 8
except AttributeError:
    print("Read-only property")`,`7
Read-only property`,'A property with no setter rejects ordinary assignment through that attribute name. The getter still permits reading.','This is API-level control, not deep immutability or a security boundary: internal code can still change the backing attribute if the design permits it.') ]},
{ids:[28,86],summary:'__new__ creates or selects the instance. __init__ then initializes it when appropriate. Most ordinary classes only need __init__.',examples:[
e('Trace creation before initialization',`class Item:
    def __new__(cls, name):
        print("new")
        return super().__new__(cls)
    def __init__(self, name):
        print("init")
        self.name = name

print(Item("book").name)`,`new
init
book`,'__new__ receives the class and returns the instance. Since it returns an Item instance, Python proceeds to __init__ with that instance as self.','__init__ assigns state but must return None. Returning a new object from __init__ is not how instance construction works.'),
e('Customize an immutable built-in subclass',`class UpperText(str):
    def __new__(cls, value):
        return super().__new__(cls, value.upper())

text = UpperText("hello")
print(text)
print(type(text).__name__)`,`HELLO
UpperText`,'The string content must be chosen while the immutable object is created, so __new__ transforms the value before delegating to str.__new__.','An __init__ method cannot rewrite the already-created string content in place. Immutable subclasses are a legitimate reason to customize __new__.'),
e('See when initialization is skipped',`class Factory:
    def __new__(cls):
        return {"value": 7}
    def __init__(self):
        print("not called")

result = Factory()
print(type(result).__name__)
print(result["value"])`,`dict
7`,'__new__ returns a dictionary rather than an instance of Factory. Python therefore does not call Factory.__init__ on that unrelated object.','This is legal but surprising in an ordinary class API. Prefer a plainly named factory function when returning an unrelated type would otherwise confuse callers.') ]}
];
