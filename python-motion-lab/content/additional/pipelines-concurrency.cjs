const {lesson:l,e}=require('./helpers.cjs');
module.exports=[
l(146,'How do enumerate and zip support parallel iteration, and what does strict=True add?','Enumerate & strict zip','Iteration',
'enumerate pairs each item with an incrementing index, optionally starting from a chosen number. zip pairs items from several iterables and is lazy; by default it stops at the shortest input. strict=True, introduced in Python 3.10, raises when input lengths differ rather than silently truncating. These tools help express relationships between data streams without manual index bookkeeping.',
'Use enumerate when both a position and value are needed. Use strict zip when equal-length columns are part of the data contract rather than a convenient coincidence.',
'A zip iterator is consumed once, and mismatched lengths are detected during consumption, not necessarily when zip is constructed. Truncation can silently lose unmatched records.',
'Enumerate adds positions; zip pairs streams. Use strict zip when unequal lengths should be an error.',
e('Number records from a chosen start',`for number, name in enumerate(["Ada", "Grace"], start=1):
    print(number, name)`,`1 Ada
2 Grace`,'enumerate maintains the index and yields it alongside each original item. start changes the displayed numbering without changing the source collection.','This avoids manually incrementing a counter that could become inconsistent after a continue statement or later loop edit.'),
e('Compare truncating and strict pairing',`print(list(zip([1, 2], ["A"])))
try:
    list(zip([1, 2], ["A"], strict=True))
except ValueError:
    print("Lengths differ")`,`[(1, 'A')]
Lengths differ`,'Ordinary zip stops when the shorter sequence ends, leaving 2 unmatched. strict=True treats that mismatch as a failure.','The list call consumes the iterator and exposes the error. Creating a lazy zip alone does not force all inputs to be checked immediately.'),
e('Transpose rectangular rows',`rows = [(1, "A"), (2, "B")]
columns = list(zip(*rows, strict=True))
print(columns)`,`[(1, 2), ('A', 'B')]`,'The star expands the rows into separate zip arguments. Items at the same column position become tuples of column values.','Strict mode verifies that the row iterables have matching lengths during consumption. Handle the empty-input case separately if your application requires a known column shape.')),
l(147,'How does functools.partial differ from a closure or a lambda?','Partial function application','Functions',
'partial creates a callable with some positional or keyword arguments pre-filled for an existing callable. It reuses the original function rather than defining a new function body. Remaining arguments are supplied later, and later keyword arguments can override pre-filled keyword values. A closure or lambda is more flexible when actual computation or control flow must change, rather than only argument binding.',
'Use partial to configure callbacks or specialize a reusable operation with a clear named dependency. It can be easier to inspect than a one-off anonymous forwarding lambda.',
'Binding an object does not copy it: mutable bound arguments remain shared. Also, binding a positional argument can make a later duplicate keyword invalid.',
'partial saves some arguments for a later function call. It configures an existing operation rather than rewriting its behavior.',
e('Pre-fill one argument',`from functools import partial
def multiply(factor, value):
    return factor * value
double = partial(multiply, 2)
print(double(7))
print(double.func is multiply)
print(double.args)`,`14
True
(2,)`,'double stores multiply and the initial factor argument. Calling it appends the later value and invokes the original function.','The func and args attributes make that configuration inspectable. The partial object is a callable, not a newly defined function with a custom body.'),
e('Override a pre-filled keyword',`from functools import partial
def greet(name, punctuation="!"):
    return "Hi " + name + punctuation
friendly = partial(greet, punctuation="!")
print(friendly("Ada"))
print(friendly("Ada", punctuation="?"))`,`Hi Ada!
Hi Ada?`,'The stored keyword supplies a default for the partial call. An explicitly supplied later keyword replaces the stored value.','This differs from supplying a positional value and then assigning the same parameter by keyword. Ordinary duplicate positional/keyword binding rules still apply.'),
e('Observe shared mutable bound state',`from functools import partial
def append_to(items, value):
    items.append(value)
    return items
items = []
add = partial(append_to, items)
print(add(1))
print(add(2))
print(items)`,`[1]
[1, 2]
[1, 2]`,'The partial retains the same list object rather than a copy. Each call therefore changes the shared bound list.','This may be intentional for a collector callback, but it is not an isolation mechanism. Create or copy state explicitly when independent calls are required.')),
l(148,'What limits recursion in Python, and when is an iterative approach better?','Recursion & iterative alternatives','Functions',
'Recursive functions solve a problem by invoking the same operation on a smaller subproblem, requiring a base case and progress toward it. Python maintains call frames and has a recursion limit intended to prevent uncontrolled depth. Ordinary Python does not promise tail-call elimination. An iterative loop or explicit stack avoids relying on deep call nesting and can make resource usage easier to control.',
'Use recursion for naturally recursive structures with manageable depth. Use iteration or an explicit stack for deep inputs or algorithms where the call stack would become a limitation.',
'Increasing the recursion limit does not make unlimited recursion safe. Missing a base case or failing to reduce the problem still causes unbounded work or a RecursionError.',
'Recursion needs a stopping case and a smaller next problem. For deep inputs, use a loop or an explicit stack instead of hoping calls are optimized away.',
e('Use a clear base case',`def factorial(n):
    if n < 0:
        raise ValueError("Use a nonnegative integer")
    if n == 0:
        return 1
    return n * factorial(n - 1)
print(factorial(0))
print(factorial(5))`,`1
120`,'Zero is the stopping case, and each recursive call reduces a nonnegative input by one. The return values combine while the calls unwind.','The example is for small integer inputs. A complete public API would also define and validate accepted types and practical resource limits.'),
e('Compute the same result iteratively',`def factorial(n):
    result = 1
    for value in range(2, n + 1):
        result *= value
    return result
print(factorial(5))
print(factorial(0))`,`120
1`,'The loop stores the accumulating result in one local variable instead of building a chain of Python calls. Empty iteration naturally preserves the zero-factorial result.','This implementation illustrates the iterative structure. Add the same input validation contract used by the recursive version when exposing it to callers.'),
e('Traverse nested data with an explicit stack',`values = [1, [2, [3]], 4]
stack = list(reversed(values))
result = []
while stack:
    value = stack.pop()
    if isinstance(value, list):
        stack.extend(reversed(value))
    else:
        result.append(value)
print(result)`,`[1, 2, 3, 4]`,'The explicit stack holds pending traversal work. Reversing before pushing preserves left-to-right output despite last-in-first-out removal.','This avoids one Python call frame per nesting level. Cyclic structures still require a separate detection policy to prevent infinite traversal.')),
l(149,'What problem do contextvars solve in asynchronous applications?','Context-local state with contextvars','Concurrency',
'ContextVar stores a value associated with the current execution context rather than one global mutable binding. Asyncio tasks normally receive a copy of the current context when created, allowing request metadata to vary independently between tasks. set returns a token that can restore the previous binding with reset. Context isolation does not deep-copy arbitrary mutable values stored inside a variable.',
'Use context variables for request identifiers, tracing metadata, or other scoped information that would be awkward to pass through every helper. Keep ownership and reset boundaries clear.',
'Storing a shared mutable dictionary in a context variable does not magically isolate mutations. Context-local bindings and deep object isolation are different guarantees.',
'A ContextVar gives each execution context its own binding. Set it for a scope and reset it afterward; do not assume mutable contents are copied.',
e('Restore an earlier binding with a token',`from contextvars import ContextVar
request = ContextVar("request", default="none")
print(request.get())
token = request.set("R7")
print(request.get())
request.reset(token)
print(request.get())`,`none
R7
none`,'set changes the current context’s binding and returns the information needed to restore its previous state. reset returns the example to its default lookup.','Use try/finally around temporary changes in real code so a failure does not leave a later operation with the wrong contextual value.'),
e('Keep task bindings independent',`import asyncio
from contextvars import ContextVar
name = ContextVar("name", default="parent")
async def worker(value):
    name.set(value)
    await asyncio.sleep(0)
    return name.get()
async def main():
    print(await asyncio.gather(worker("A"), worker("B")))
    print(name.get())
asyncio.run(main())`,`['A', 'B']
parent`,'Each task updates its own contextual binding and retains it across suspension. One task does not overwrite the other task’s string binding.','The parent context remains unchanged. This is useful for per-request identifiers in concurrent asynchronous handlers.'),
e('Run an operation in a copied context',`from contextvars import ContextVar, copy_context
value = ContextVar("value", default=0)
context = copy_context()
context.run(value.set, 7)
print(context.run(value.get))
print(value.get())`,`7
0`,'The copied context can be entered to set and read its own binding. The outer current context keeps the default.','The context copy contains bindings, not a recursive clone of every stored object. Mutable shared values still need deliberate ownership.')),
l(150,'How does asyncio.TaskGroup provide structured concurrency?','Structured concurrency with TaskGroup','Concurrency',
'TaskGroup, available in Python 3.11+, owns tasks created inside its asynchronous context. Exiting waits for those tasks. If one task fails with an ordinary exception, the group cancels remaining tasks and reports failures through an exception group after cleanup. This ties task lifetime to a lexical scope instead of leaving background work unowned. Cancellation remains cooperative, so tasks must not block the event loop indefinitely.',
'Use TaskGroup for related concurrent operations that should complete as one unit. Keep unrelated long-lived services under an explicit lifecycle owner instead.',
'Do not discard cleanup by swallowing CancelledError indiscriminately. TaskGroup is a lifecycle mechanism, not automatic isolation from blocking code or arbitrary shared-state races.',
'TaskGroup owns a set of related tasks, waits for them, and coordinates cancellation when one fails.',
e('Read results after all owned tasks finish',`import asyncio
async def square(value):
    await asyncio.sleep(0)
    return value * value
async def main():
    async with asyncio.TaskGroup() as group:
        tasks = [group.create_task(square(n)) for n in [2, 3]]
    print([task.result() for task in tasks])
asyncio.run(main())`,`[4, 9]`,'Leaving the async with block waits until the group’s tasks finish. Their results can then be retrieved without pending-work ambiguity.','The list follows the stored task order, not a claim about completion order. The scope gives each task a clear owner.'),
e('Handle the grouped failure',`import asyncio
async def fail():
    raise ValueError("bad task")
async def main():
    try:
        async with asyncio.TaskGroup() as group:
            group.create_task(fail())
    except* ValueError as errors:
        print("failures", len(errors.exceptions))
asyncio.run(main())`,`failures 1`,'The failing child is reported as part of an exception group when the TaskGroup exits. except* selects the ValueError subgroup.','A single failing child can still be wrapped in a group because the abstraction supports multiple independent failures.'),
e('Clean up a sibling that gets cancelled',`import asyncio
events = []
async def wait():
    try:
        await asyncio.sleep(60)
    finally:
        events.append("cleanup")
async def fail():
    await asyncio.sleep(0)
    raise ValueError("bad")
async def main():
    try:
        async with asyncio.TaskGroup() as group:
            group.create_task(wait())
            group.create_task(fail())
    except* ValueError:
        events.append("failure")
    print(sorted(events))
asyncio.run(main())`,`['cleanup', 'failure']`,'The waiting task enters its try before the other task fails. Group cancellation unwinds the pending sleep and runs finally without waiting sixty seconds.','The parent observes failure only after group cleanup. Sorting the event names avoids making the final display depend on incidental logging order.')),
l(151,'How do async iterators and async generators differ from ordinary iterators?','Async iterators & generators','Iteration',
'An asynchronous iterator provides __aiter__ and an asynchronous __anext__ operation that can suspend before returning the next item. async for awaits those items and stops on StopAsyncIteration. An async generator uses async def together with yield to implement this pattern concisely. It cannot be consumed by ordinary list or next in the same way as a synchronous iterator.',
'Use async iteration for data arriving through asynchronous I/O or pipelines where requesting the next item may require waiting. Use explicit closing when early exit must trigger resource cleanup promptly.',
'An async generator is not a coroutine returning a ready list. async for and async comprehensions require an asynchronous context, and abandoned generators still need a clear cleanup policy.',
'Async iteration lets getting the next item involve await. Use async for to consume it and close resource-owning generators explicitly when stopping early.',
e('Yield values from an asynchronous generator',`import asyncio
async def values():
    for n in range(3):
        await asyncio.sleep(0)
        yield n
async def main():
    async for value in values():
        print(value)
asyncio.run(main())`,`0
1
2`,'The async generator can suspend before yielding each item. async for handles the awaitable next-item protocol automatically.','sleep(0) is a controlled suspension point rather than a real I/O request. The example demonstrates consumption without external dependencies.'),
e('Build a filtered async comprehension',`import asyncio
async def values():
    for n in range(4):
        yield n
async def main():
    print([n * n async for n in values() if n % 2 == 0])
asyncio.run(main())`,`[0, 4]`,'The comprehension consumes an asynchronous iterator and materializes the matching transformed items into a normal list.','The list result is eager even though the source is asynchronous. Bound the stream before collecting it if the source could be unbounded.'),
e('Close an async generator when breaking early',`import asyncio
from contextlib import aclosing
async def values():
    try:
        yield 1
        yield 2
    finally:
        print("cleanup")
async def main():
    async with aclosing(values()) as stream:
        async for value in stream:
            print(value)
            break
asyncio.run(main())`,`1
cleanup`,'aclosing awaits the generator’s close operation when leaving the context. The finally block runs even though the consumer stops after one item.','This gives cleanup a deliberate boundary rather than relying on later garbage collection or event-loop shutdown.')),
l(152,'How does queue.Queue coordinate producer and consumer threads?','Thread-safe work queues','Concurrency',
'queue.Queue provides synchronized operations for passing work between threads. get can wait for an item, put can wait for capacity, and each task_done marks one retrieved item complete for join’s accounting. A sentinel value can request worker termination. Queue safety does not automatically make processing side effects safe or define how every worker failure should be handled.',
'Use a queue to separate producers from worker threads and introduce bounded buffering where needed. Give worker shutdown and error reporting explicit designs.',
'Queue.join waits for unfinished-task accounting, not directly for thread termination. Missing task_done calls can block it indefinitely; an empty queue does not necessarily mean all work is complete.',
'Queue passes work safely between threads. Pair each retrieved task with task_done, and separately manage worker shutdown and joining.',
e('Run a worker with explicit shutdown',`from queue import Queue
from threading import Thread
queue = Queue()
results = []
def worker():
    while True:
        value = queue.get()
        try:
            if value is None:
                return
            results.append(value * value)
        finally:
            queue.task_done()
thread = Thread(target=worker)
thread.start()
for value in [2, 3, None]:
    queue.put(value)
queue.join()
thread.join()
print(results)`,`[4, 9]`,'One worker processes FIFO inputs and exits on the sentinel. finally balances each get with task_done, including the shutdown item.','Queue.join waits for the accounting to reach zero, while thread.join confirms the worker has actually exited. They solve different lifecycle concerns.'),
e('Handle nonblocking empty and full states',`from queue import Queue, Empty, Full
queue = Queue(maxsize=1)
queue.put_nowait("A")
try:
    queue.put_nowait("B")
except Full:
    print("full")
print(queue.get_nowait())
queue.task_done()
try:
    queue.get_nowait()
except Empty:
    print("empty")`,`full
A
empty`,'The bounded queue rejects an immediate second item instead of blocking. After retrieving the existing item, another immediate get reports Empty.','Use these explicit exceptions instead of assuming a preliminary empty or full check remains valid while other threads act.'),
e('Choose a priority-based work queue',`from queue import PriorityQueue
queue = PriorityQueue()
queue.put((2, "later"))
queue.put((1, "first"))
while not queue.empty():
    print(queue.get()[1])
    queue.task_done()
queue.join()`,`first
later`,'PriorityQueue selects smaller tuple priorities before larger ones. The loop is safe as written because this example has no concurrent producers.','In a live multi-threaded system, avoid relying on empty as a stable promise. Use blocking gets, sentinels, or another explicit coordination policy.')),
l(153,'How does threading.Event coordinate signals without a busy-wait loop?','Thread signaling with Event','Concurrency',
'Event maintains a shared set/clear flag. wait blocks until the flag is set or an optional timeout expires; set wakes waiting threads, and clear resets the signal. It communicates a condition such as readiness or shutdown rather than carrying a stream of distinct messages. Several rapid set calls do not accumulate a count of events.',
'Use Event for one shared state transition or a simple stop request. Use Queue when every individual item must be delivered, or Condition when a richer predicate must be protected with state.',
'An Event is not a mutual-exclusion lock, and wait returning does not automatically make a group of state changes atomic. A cleared flag also does not erase data written elsewhere.',
'Event is a shared readiness flag that threads can wait on efficiently. It is a signal, not a queue of messages or a lock.',
e('Inspect set, wait, and clear behavior',`from threading import Event
event = Event()
print(event.wait(timeout=0))
event.set()
print(event.wait(timeout=0))
event.clear()
print(event.is_set())`,`False
True
False`,'A zero timeout checks the current condition without waiting. set makes waits succeed until clear resets the flag.','Repeated set calls do not create several independently consumable signals. Choose a queue or semaphore if counting separate work matters.'),
e('Release a worker after initialization',`from threading import Event, Thread
ready = Event()
values = []
def worker():
    ready.wait()
    values.append("started")
thread = Thread(target=worker)
thread.start()
ready.set()
thread.join()
print(values)`,`['started']`,'The worker waits without polling repeatedly. Setting ready permits it to continue, and joining ensures the output is observed after completion.','The flag remains set after waking this worker. Other later waiters would also proceed until the event is cleared.'),
e('Use separate readiness and release signals',`from threading import Event, Thread
ready, release = Event(), Event()
results = []
def worker():
    ready.set()
    release.wait()
    results.append("complete")
thread = Thread(target=worker)
thread.start()
ready.wait()
print("worker ready")
release.set()
thread.join()
print(results)`,`worker ready
['complete']`,'The first event reports that the worker reached its waiting stage. The second event explicitly grants permission to finish.','Separating directions makes the handshake understandable. More complicated repeating protocols generally need a carefully defined state machine rather than ad hoc signal reuse.')),
l(154,'How do asyncio.Semaphore and BoundedSemaphore limit concurrent work?','Async concurrency limits','Concurrency',
'An asyncio semaphore tracks available permits. A task acquires a permit before entering a constrained region and releases it afterward; async with manages that lifetime safely. The limit controls concurrently admitted tasks, not a requests-per-second rate. BoundedSemaphore additionally rejects releases that would increase the count beyond its initial value. These primitives coordinate tasks on an event loop, not arbitrary operating-system threads.',
'Use a semaphore around a limited resource such as a connection-dependent operation. Keep the permit held only for the operation whose concurrency should be constrained.',
'Launching many tasks and placing the semaphore only after the expensive resource has already been acquired does not limit that acquisition. Rate limiting requires a separate time-based policy.',
'A semaphore limits how many tasks enter a region at once. Use async with so permits are released even when work fails.',
e('Measure the maximum admitted concurrency',`import asyncio
active = 0
maximum = 0
async def main():
    semaphore = asyncio.Semaphore(2)
    async def work():
        global active, maximum
        async with semaphore:
            active += 1
            maximum = max(maximum, active)
            try:
                await asyncio.sleep(0)
            finally:
                active -= 1
    await asyncio.gather(*(work() for _ in range(5)))
    print(maximum, active)
asyncio.run(main())`,`2 0`,'At most two tasks hold permits. The explicit suspension lets overlap occur, and the counter shows that all tasks release their active state before completion.','This single-event-loop counter has no suspension inside its update steps. Shared counters used across threads require an appropriate synchronization design.'),
e('Reject an extra release with a bounded semaphore',`import asyncio
async def main():
    semaphore = asyncio.BoundedSemaphore(1)
    await semaphore.acquire()
    semaphore.release()
    try:
        semaphore.release()
    except ValueError:
        print("Too many releases")
asyncio.run(main())`,`Too many releases`,'The first release returns the acquired permit. The second would exceed the configured starting capacity and is rejected.','BoundedSemaphore helps expose accounting bugs. Prefer async with for ordinary scoped use so successful acquisition and release remain paired.'),
e('Release permits during exception handling',`import asyncio
async def main():
    semaphore = asyncio.Semaphore(1)
    try:
        async with semaphore:
            raise ValueError("failed")
    except ValueError:
        print("handled")
    async with semaphore:
        print("permit available")
asyncio.run(main())`,`handled
permit available`,'The context manager releases the permit as the first block exits with an error. The later acquisition can therefore proceed.','Manual acquire without a reliable finally release can strand permits and stall unrelated work. Scope the resource ownership explicitly.')),
l(155,'How do unittest fixtures, subTest, and cleanup callbacks make tests reliable?','Test fixtures & subtests','Python toolkit',
'unittest.TestCase supplies assertions, fixtures, and result reporting. setUp runs before each test method, helping avoid accidental shared per-test state. subTest identifies cases inside one test so several inputs can be checked with useful failure context. addCleanup registers cleanup functions that run after the test, including important failure paths. Tests should observe meaningful behavior and keep external dependencies controlled.',
'Use fixtures for small repeatable setup, subtests for related input cases, and cleanup callbacks for resources whose release should not depend on reaching the end of a test body.',
'Do not depend on test execution order or put mutable per-test state on the class unintentionally. A passing test that merely duplicates implementation expressions offers little independent evidence.',
'Reliable tests start from controlled state, check visible behavior, and release resources even when a check fails.',
e('Run a focused behavior test',`import unittest
def double(value):
    return value * 2
class Tests(unittest.TestCase):
    def test_double(self):
        self.assertEqual(double(3), 6)
result = unittest.TestResult()
unittest.defaultTestLoader.loadTestsFromTestCase(Tests).run(result)
print(result.testsRun, result.wasSuccessful())`,`1 True`,'The test verifies the function’s public result through a standard assertion. A TestResult captures outcome without version-dependent runner formatting.','A test failure is recorded rather than presented as the example’s expected success output. Real suites should include meaningful boundary and failure cases as well.'),
e('Give each test fresh fixture state',`import unittest
class Tests(unittest.TestCase):
    def setUp(self):
        self.items = []
    def test_one(self):
        self.items.append(1)
        self.assertEqual(self.items, [1])
    def test_two(self):
        self.assertEqual(self.items, [])
result = unittest.TestResult()
unittest.defaultTestLoader.loadTestsFromTestCase(Tests).run(result)
print(result.testsRun, result.wasSuccessful())`,`2 True`,'setUp constructs an independent list before each test method. Mutating the first test’s list does not leak into the second fixture.','This makes the test contract independent of incidental ordering. Avoid shared mutable class attributes when the intended lifetime is one test.'),
e('Use subtests and guaranteed cleanup',`import unittest
events = []
class Tests(unittest.TestCase):
    def test_cases(self):
        self.addCleanup(events.append, "cleaned")
        for value, expected in [(0, 0), (2, 4), (-1, -2)]:
            with self.subTest(value=value):
                self.assertEqual(value * 2, expected)
result = unittest.TestResult()
unittest.defaultTestLoader.loadTestsFromTestCase(Tests).run(result)
print(result.wasSuccessful())
print(events)`,`True
['cleaned']`,'Each subtest labels a related input case, improving failure diagnostics while preserving one shared test procedure. The example covers zero, positive, and negative inputs.','The registered cleanup runs after the test. Real resources should be acquired and registered for cleanup promptly so failures do not leak them.'))
];
