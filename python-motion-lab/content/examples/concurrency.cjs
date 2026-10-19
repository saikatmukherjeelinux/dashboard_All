const {e}=require('./helpers.cjs');
module.exports=[
{ids:[1],summary:'In conventional GIL-enabled CPython, one thread per interpreter runs Python bytecode at a time. Threads can overlap waiting; processes can run CPU work separately. Free-threaded builds change this model.',examples:[
e('Compute safely with a thread pool',`from concurrent.futures import ThreadPoolExecutor

def square(n):
    return n * n

with ThreadPoolExecutor(max_workers=2) as pool:
    print(list(pool.map(square, [2, 3, 4])))`,`[4, 9, 16]`,'Two workers may be scheduled, but this tiny pure-Python computation is not evidence of CPU parallelism on a conventional GIL-enabled build. map preserves input order in its returned results.','Thread scheduling and elapsed time vary by machine, so the example verifies results rather than promising a speedup. Threads are often more useful when tasks spend time waiting on I/O.'),
e('Protect a shared update with a lock',`from threading import Thread, Lock

count = 0
lock = Lock()
def work():
    global count
    for _ in range(1000):
        with lock:
            count += 1

threads = [Thread(target=work) for _ in range(2)]
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()
print(count)`,`2000`,'Each update is performed while holding the same lock, and join waits for both workers before printing the result.','The GIL is not a substitute for protecting application-level shared invariants. Explicit synchronization also makes the intended contract clear across Python builds.'),
e('Use separate processes for independent CPU work',`from concurrent.futures import ProcessPoolExecutor

def square(n):
    return n * n

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=2) as pool:
        print(list(pool.map(square, [2, 3, 4])))`,`[4, 9, 16]`,'Save this example as a .py file and run it. Worker processes have separate interpreter state, so CPU work can use different cores without sharing one interpreter’s GIL.','The main guard avoids recursively starting workers on spawn-based systems such as Windows. Startup and data-transfer costs mean this tiny example is illustrative, not a performance benchmark.') ]},
{ids:[9],summary:'Threads are scheduled by the operating system; asyncio tasks cooperate by suspending at await points. Both can help overlap waiting, but they have different coordination rules.',examples:[
e('Collect thread results in input order',`from concurrent.futures import ThreadPoolExecutor

def fetch_label(n):
    return "item-" + str(n)

with ThreadPoolExecutor(max_workers=2) as pool:
    print(list(pool.map(fetch_label, [1, 2])))`,`['item-1', 'item-2']`,'The pool schedules normal functions on threads. The main thread receives map results in input order even if workers complete at different times.','This function is a deterministic stand-in for blocking I/O; it does not perform a real network request or demonstrate a timing improvement.'),
e('Collect coroutine results with gather',`import asyncio

async def fetch_label(n):
    await asyncio.sleep(0)
    return "item-" + str(n)

async def main():
    return await asyncio.gather(fetch_label(1), fetch_label(2))

print(asyncio.run(main()))`,`['item-1', 'item-2']`,'gather schedules both coroutines and returns their results in argument order. sleep(0) provides a suspension point where another ready task may run.','The event loop coordinates these tasks on one thread in this example. Cooperative concurrency is different from executing two Python bodies in parallel.'),
e('Move a blocking function away from the event loop',`import asyncio

def blocking_style_work(value):
    return value.upper()

async def main():
    return await asyncio.to_thread(blocking_style_work, "hello")

print(asyncio.run(main()))`,`HELLO`,'to_thread executes the normal callable in a worker thread and lets the coroutine await its result. This is useful for existing blocking I/O APIs.','The short function here only illustrates the interface. Moving pure-Python CPU work to a thread is not a general GIL-enabled multicore speedup strategy.') ]},
{ids:[16,27,33,93],summary:'Calling async def creates a coroutine. Awaiting or scheduling it runs the work; await lets other tasks proceed when the operation actually suspends.',examples:[
e('Create a coroutine, then run it',`import asyncio
import inspect

async def answer():
    return 7

coroutine = answer()
print(inspect.iscoroutine(coroutine))
print(asyncio.run(coroutine))`,`True
7`,'answer() returns a coroutine object, not 7 immediately. asyncio.run creates an event loop, runs the coroutine, and returns its final result.','In an environment that already has an event loop, such as some notebooks, await answer() instead of nesting asyncio.run.'),
e('Schedule concurrent waits and retain result order',`import asyncio

async def task(name):
    await asyncio.sleep(0)
    return name.upper()

async def main():
    results = await asyncio.gather(task("a"), task("b"))
    print(results)

asyncio.run(main())`,`['A', 'B']`,'gather schedules both awaitables and waits for their results. The output list follows argument order rather than completion order.','The tasks yield at sleep(0). CPU-heavy loops with no suspension would instead monopolize the event-loop thread until they finish.'),
e('Cancel a task and still run cleanup',`import asyncio

async def worker():
    try:
        await asyncio.sleep(60)
    finally:
        print("cleanup")

async def main():
    task = asyncio.create_task(worker())
    await asyncio.sleep(0)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        print("cancelled")

asyncio.run(main())`,`cleanup
cancelled`,'The initial sleep(0) gives worker a chance to enter its try block. Cancellation then interrupts its suspended sleep, triggering finally.','Awaiting the task observes CancelledError. The example does not wait 60 seconds: cancellation requests termination and the awaited task handles the unwind.') ]},
{ids:[31],summary:'Threads share a process and require coordination for shared state. Processes have separate memory and can execute CPU work independently, with communication and startup costs.',examples:[
e('Share state deliberately between threads',`from threading import Thread, Lock

values = []
lock = Lock()
def work(n):
    with lock:
        values.append(n * n)

threads = [Thread(target=work, args=(n,)) for n in [2, 3]]
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()
print(sorted(values))`,`[4, 9]`,'Both threads access the same values list and lock. join ensures work finishes before the main thread reads the completed data.','Sorting avoids making a promise about thread completion order. Shared memory is convenient but introduces synchronization requirements.'),
e('Return results from a process pool',`from concurrent.futures import ProcessPoolExecutor

def total(n):
    return sum(range(n))

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=2) as pool:
        print(list(pool.map(total, [4, 5])))`,`[6, 10]`,'Each worker calculates its own result and sends it back through the pool. Save this as a script; the module-level function can be imported in spawned workers.','map preserves input order. These tiny jobs are too small to justify process overhead in practice, but show the structure for independent larger computations.'),
e('See that worker mutation does not edit the parent list',`from concurrent.futures import ProcessPoolExecutor

def extend(values):
    values.append(3)
    return values

if __name__ == "__main__":
    original = [1, 2]
    with ProcessPoolExecutor(max_workers=1) as pool:
        result = pool.submit(extend, original).result()
    print(original)
    print(result)`,`[1, 2]
[1, 2, 3]`,'The argument is serialized for the worker process, which changes its own received list. The parent’s original list stays unchanged.','The modified list must be explicitly returned or communicated. Shared-memory and manager facilities exist, but ordinary process arguments do not create shared mutable Python objects.') ]}
];
