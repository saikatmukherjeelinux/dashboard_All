const {e}=require('./helpers.cjs');
module.exports=[
{ids:[2,56],summary:'Variables refer to objects. CPython uses reference counting plus a cycle collector to reclaim unreachable objects; resource cleanup should still be explicit.',examples:[
e('Separate names from the object they reference',`import gc
import weakref

class Item:
    pass

a = Item()
b = a
ref = weakref.ref(a)
del a
print(ref() is b)
del b
gc.collect()
print(ref() is None)`,`True
True`,'a and b initially point to the same instance. Deleting a removes one binding, but b still keeps the object alive.','After deleting b and collecting garbage, the weak reference shows that the object is gone. The weak reference itself does not own the instance.'),
e('Collect an unreachable cycle',`import gc
import weakref

class Node:
    pass

node = Node()
node.link = node
ref = weakref.ref(node)
del node
gc.collect()
print(ref() is None)`,`True`,'The node references itself, so its reference count alone cannot fall to zero when the external name is removed.','gc.collect asks the cyclic collector to examine unreachable tracked objects. It can reclaim this isolated self-cycle; the weak reference then returns None.'),
e('Release temporary references deliberately',`import gc
import weakref

class Record:
    pass

record = Record()
ref = weakref.ref(record)
cache = [record]
del record
print(ref() is not None)
cache.clear()
gc.collect()
print(ref() is None)`,`True
True`,'Containers also hold references. The list keeps the instance alive even after its original variable disappears.','Clearing the list removes that ownership. This demonstrates why a growing cache can retain memory even when the objects are no longer needed elsewhere.') ]},
{ids:[12,64,80,103],summary:'A shallow copy duplicates the outer container and shares nested objects. A deep copy also copies nested objects in this example, so later nested changes stay separate.',examples:[
e('Compare assignment, shallow copy, and deep copy',`import copy

original = [[1], [2]]
alias = original
shallow = copy.copy(original)
deep = copy.deepcopy(original)
print(alias is original)
print(shallow is original, shallow[0] is original[0])
print(deep[0] is original[0])`,`True
False True
False`,'Assignment creates another name for the same outer list. copy.copy creates a different outer list but retains references to the same inner lists.','deepcopy creates independent inner lists here. Test identity at both levels to understand which mutations will be shared.'),
e('Mutate a nested value',`import copy

a = {"scores": [10, 20]}
b = copy.copy(a)
c = copy.deepcopy(a)
b["scores"].append(30)
print(a["scores"])
print(b["scores"])
print(c["scores"])`,`[10, 20, 30]
[10, 20, 30]
[10, 20]`,'a and b are separate dictionaries containing the same scores list. Appending through b changes that shared list, so a observes it too.','c contains a different list from the deep copy and retains its original values. Replacing a top-level dictionary entry would behave differently from mutating the referenced list.'),
e('Distinguish replacing an item from mutating it',`import copy

a = [[1], [2]]
b = copy.copy(a)
b[0] = [99]
print(a)
print(b)
b[1].append(8)
print(a)
print(b)`,`[[1], [2]]
[[99], [2]]
[[1], [2, 8]]
[[99], [2, 8]]`,'Assigning b[0] changes one slot in b’s outer list; it does not modify a’s slot or the old inner list.','The second inner list remains shared. Appending to b[1] mutates that object and is visible through a[1] as well.') ]},
{ids:[13,35,89],summary:'__slots__ reserves named instance attributes and can reduce per-instance memory overhead. It does not automatically make instances immutable or faster in every workload.',examples:[
e('Restrict instance attributes',`class Point:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(2, 3)
print(p.x, p.y)
print(hasattr(p, "__dict__"))
try:
    p.z = 4
except AttributeError:
    print("z is not a declared slot")`,`2 3
False
z is not a declared slot`,'The class reserves storage for x and y without a normal per-instance attribute dictionary. Assigning an undeclared z therefore fails.','This can save memory across many small instances, but the exact saving depends on the Python implementation and class hierarchy.'),
e('Slots are still writable',`class Account:
    __slots__ = ("balance",)
    def __init__(self, balance):
        self.balance = balance

a = Account(10)
a.balance += 5
print(a.balance)`,`15`,'A slot controls where an attribute can be stored; it is not a read-only declaration. Updating the declared balance attribute works normally.','Use properties, validation, or an appropriate immutable data design when you need restrictions on changing values.'),
e('Extend slots explicitly in subclasses',`class Base:
    __slots__ = ("x",)

class Child(Base):
    __slots__ = ("y",)

c = Child()
c.x, c.y = 1, 2
print(c.x + c.y)
print(hasattr(c, "__dict__"))`,`3
False`,'Child inherits the x slot and adds its own y slot. Defining slots again avoids introducing an ordinary instance dictionary in this subclass.','A subclass that omits __slots__ normally gets a __dict__, so memory and attribute restrictions must be considered across the whole inheritance chain.') ]},
{ids:[26,53,73],summary:'A weak reference lets you observe an object without keeping it alive. Check whether the object still exists before using it.',examples:[
e('Observe an object without owning it',`import gc
import weakref

class User:
    pass

user = User()
ref = weakref.ref(user)
print(ref() is user)
del user
gc.collect()
print(ref() is None)`,`True
True`,'Calling ref retrieves the referent while it exists. The weak reference does not prevent the object from being collected.','After its strong owner is removed, ref returns None. In real code, assign target = ref() and check target before accessing attributes.'),
e('Build a cache that does not retain values',`import gc
import weakref

class Product:
    pass

cache = weakref.WeakValueDictionary()
product = Product()
cache["item"] = product
print("item" in cache)
del product
gc.collect()
print("item" in cache)`,`True
False`,'WeakValueDictionary holds values weakly, so the cache is not a strong owner of the product. While product exists, the entry can be retrieved normally.','Once that last strong reference disappears, the entry vanishes. Use an ordinary dictionary when the cache is supposed to retain values intentionally.'),
e('Track membership without owning members',`import gc
import weakref

class Listener:
    pass

listeners = weakref.WeakSet()
listener = Listener()
listeners.add(listener)
print(len(listeners))
del listener
gc.collect()
print(len(listeners))`,`1
0`,'WeakSet is useful for registries of objects that should disappear when their owners release them. Adding a listener does not extend its lifetime.','Iteration results may change as objects are collected. Keep a strong reference during any operation that needs a listener to stay alive.') ]},
{ids:[41,76],summary:'del removes a reference, while __del__ is a finalizer with timing limitations. Use with and explicit cleanup when the timing of resource release matters.',examples:[
e('Deleting a name is not deleting every reference',`import gc
import weakref

class Item:
    pass

a = Item()
b = a
ref = weakref.ref(a)
del a
print(ref() is b)
del b
gc.collect()
print(ref() is None)`,`True
True`,'The first del removes only the a binding. Since b still owns the same instance, the object remains alive.','The example uses a weak reference to observe lifetime without relying on finalizer print timing, which is not a portable cleanup guarantee.'),
e('Use a context manager for predictable cleanup',`class Resource:
    def __enter__(self):
        print("open")
        return self
    def __exit__(self, kind, value, traceback):
        print("close")
        return False

try:
    with Resource():
        print("work")
        raise ValueError("problem")
except ValueError:
    print("handled")`,`open
work
close
handled`,'__exit__ runs as the with block exits, including during exception propagation. Returning False keeps the exception active for the outer handler.','This gives a defined cleanup boundary. Relying on __del__ would tie cleanup to object lifetime and interpreter behavior instead.'),
e('Register an explicit finalization callback',`import weakref

class Owner:
    pass

owner = Owner()
cleanup = weakref.finalize(owner, print, "released")
print(cleanup.alive)
cleanup()
print(cleanup.alive)
cleanup()`,`True
released
False`,'weakref.finalize creates a callback that can also be invoked explicitly. Here we call it ourselves so the output does not depend on collection timing.','The callback runs at most once: afterward alive is False and another explicit call does nothing. For structured resource management, a context manager is usually clearer.') ]},
{ids:[45],summary:'Mutable objects can change in place; immutable objects cannot. An immutable container can still refer to a mutable object inside it.',examples:[
e('Mutate a shared list',`a = [1, 2]
b = a
b.append(3)
print(a)
print(a is b)`,`[1, 2, 3]
True`,'Both names refer to one list. append changes that list in place, so the update is visible through either name.','No new outer list was created. Use a deliberate copy if another part of the program must retain an independent container.'),
e('Rebind an immutable string',`a = "cat"
b = a
a += "s"
print(a)
print(b)
print(a is b)`,`cats
cat
False`,'Strings cannot be extended in place. a += "s" produces the concatenated string and rebinds a to it; b still refers to the original value.','The old value remains unchanged. This differs from a mutable operation such as list.append, which changes an existing object.'),
e('Mutate an object inside an immutable tuple',`record = ([1, 2], "fixed")
record[0].append(3)
print(record)
try:
    record[1] = "changed"
except TypeError:
    print("Tuple slots cannot be reassigned")`,`([1, 2, 3], 'fixed')
Tuple slots cannot be reassigned`,'The tuple keeps the same two references throughout. Its first reference points to a list, and that list can still change.','Replacing a tuple slot fails. Tuple immutability is therefore different from deep immutability of every object reachable from the tuple.') ]},
{ids:[69],summary:'memoryview provides access to buffer data without first copying the entire buffer. A writable view can change its underlying mutable buffer.',examples:[
e('Edit a bytearray through a view',`data = bytearray(b"cat")
view = memoryview(data)
view[0] = ord("b")
print(data.decode())
print(view.readonly)
view.release()`,`bat
False`,'memoryview refers to the existing bytearray storage. Replacing its first byte changes the same storage read through data.','The view is writable because bytearray is mutable. release explicitly ends access through this view when it is no longer needed.'),
e('Slice a view and mutate shared storage',`data = bytearray(b"abcd")
view = memoryview(data)
part = view[1:3]
part[0] = ord("Z")
print(data.decode())
print(part.tobytes())
part.release()
view.release()`,`aZcd
b'Zc'`,'The slice is another view into the same buffer, so part[0] corresponds to data[1]. Editing it updates the original bytearray.','tobytes creates a bytes copy of the selected data for display. It is the conversion, not the view slice, that materializes a new bytes object.'),
e('Respect read-only buffers',`view = memoryview(b"abc")
print(view.readonly)
try:
    view[0] = 90
except TypeError:
    print("Buffer is read-only")
view.release()`,`True
Buffer is read-only`,'bytes supplies a read-only buffer, so the memoryview cannot be used to mutate it. Creating a view does not override the owner’s mutability rules.','Read-only views still allow efficient inspection. Use a bytearray when your operation intentionally requires writable byte storage.') ]},
{ids:[98],summary:'A weak proxy acts like its live target but does not keep it alive. Access after collection raises ReferenceError instead of returning None.',examples:[
e('Read attributes through a proxy',`import weakref

class User:
    def __init__(self, name):
        self.name = name

user = User("Ada")
proxy = weakref.proxy(user)
print(proxy.name)
proxy.name = "Grace"
print(user.name)`,`Ada
Grace`,'Attribute operations on the proxy are forwarded to its referent. Setting proxy.name updates the original User instance.','The proxy is not a copied object and does not own the instance’s lifetime. The user variable supplies the strong ownership in this example.'),
e('Handle access after the target disappears',`import gc
import weakref

class User:
    name = "Ada"

user = User()
proxy = weakref.proxy(user)
del user
gc.collect()
try:
    print(proxy.name)
except ReferenceError:
    print("Target no longer exists")`,`Target no longer exists`,'Removing the last strong owner allows collection even though the proxy is still bound. A proxy operation then has no live target to forward to.','Catch ReferenceError where disappearance is a normal possibility, or redesign ownership if the operation requires the object to stay alive.'),
e('Compare weakref.ref with weakref.proxy',`import gc
import weakref

class Item:
    value = 7

item = Item()
ref = weakref.ref(item)
proxy = weakref.proxy(item)
print(ref().value, proxy.value)
del item
gc.collect()
print(ref() is None)
try:
    proxy.value
except ReferenceError:
    print("Proxy raises ReferenceError")`,`7 7
True
Proxy raises ReferenceError`,'A weak reference must be called to retrieve its target, while a proxy forwards supported operations directly. Neither keeps the target alive.','After collection, the reference returns None; the proxy raises when used. Choose the interface that makes disappearance easiest to handle safely.') ]}
];
