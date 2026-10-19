const {e}=require('./helpers.cjs');
module.exports=[
{ids:[3],summary:'A generator produces values one at a time and remembers where it paused. Once consumed, it does not restart automatically.',examples:[
e('Pause and resume at yield',`def steps():
    print("start")
    yield 10
    print("resume")
    yield 20

g = steps()
print("created")
print(next(g))
print(next(g))`,`created
start
10
resume
20`,'Calling steps creates a generator without executing its body. The first next starts execution, prints start, and pauses at the first yield.','The second next continues after that yield, prints resume, and yields 20. Local state and execution position survive the pause.'),
e('Consume the remaining values only once',`g = (n * n for n in range(4))
print(next(g))
print(list(g))
print(list(g))`,`0
[1, 4, 9]
[]`,'next consumes the first item. list then drains only the remaining items, so 0 does not appear in the second result.','A second list call finds an exhausted iterator. Recreate the generator expression when another independent pass is required.'),
e('Process a stream without a result list',`def running_total(values):
    total = 0
    for value in values:
        total += value
        yield total

for total in running_total([2, 3, 4]):
    print(total)`,`2
5
9`,'The generator retains total between iterations, yielding each intermediate accumulation as soon as it is available.','It does not build a separate list of running totals. This makes generators useful for incremental pipelines, though retaining yielded values elsewhere can still consume memory.') ]},
{ids:[23,95],summary:'An iterable can supply an iterator. An iterator keeps a current position and returns items through next until it raises StopIteration.',examples:[
e('Separate the iterable from its iterator',`values = [10, 20]
iterator = iter(values)
print(next(iterator))
print(next(iterator))
print(next(iterator, "finished"))
print(list(values))`,`10
20
finished
[10, 20]`,'iter creates a cursor over the list. Consuming that cursor does not remove values from the list itself.','next with a default returns finished when this iterator is exhausted. Without the default, the same situation raises StopIteration.'),
e('Implement a custom iterator',`class Countdown:
    def __init__(self, start):
        self.current = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

c = Countdown(3)
print(list(c))
print(list(c))`,`[3, 2, 1]
[]`,'__next__ updates the instance’s cursor after returning each value. __iter__ returns self because the object is its own iterator.','The cursor remains exhausted after the first list call. This single-pass behavior is also characteristic of generators.'),
e('Create a reusable iterable with fresh iterators',`class Countdown:
    def __init__(self, start):
        self.start = start
    def __iter__(self):
        return iter(range(self.start, 0, -1))

c = Countdown(3)
print(list(c))
print(list(c))`,`[3, 2, 1]
[3, 2, 1]`,'Here the object stores configuration, not a shared mutable cursor. Each __iter__ call creates a new iterator over the range.','Repeated loops therefore get independent traversal state. Choose between an iterable and an iterator deliberately when designing a collection-like API.') ]},
{ids:[42,52],summary:'yield emits one value. yield from delegates iteration to another iterable and can also pass through generator communication and return values.',examples:[
e('Compare yielding a list with delegating to it',`def one_item():
    yield [1, 2]

def many_items():
    yield from [1, 2]

print(list(one_item()))
print(list(many_items()))`,`[[1, 2]]
[1, 2]`,'yield returns the list object as one item. yield from repeatedly forwards the items produced by iterating that list.','This is one-level delegation, not automatic recursive flattening of every nested structure.'),
e('Compose smaller generators',`def letters():
    yield "A"
    yield "B"

def message():
    yield "start"
    yield from letters()
    yield "end"

print(list(message()))`,`['start', 'A', 'B', 'end']`,'message begins its own sequence, delegates to letters until that generator is exhausted, and then resumes afterward.','Breaking a pipeline into small generators improves reuse without materializing intermediate lists.'),
e('Receive a delegated generator’s return value',`def child():
    yield 1
    return 99

def parent():
    result = yield from child()
    print("child returned", result)
    yield 2

print(list(parent()))`,`child returned 99
[1, 2]`,'child yields 1 as an item but returns 99 as its completion value. yield from captures that completion value rather than yielding it to the caller.','The parent prints 99, then yields 2. This illustrates why delegation is richer than merely writing yield for each item in a loop.') ]},
{ids:[49],summary:'Generators can handle exceptions around yield points. throw injects an exception into a suspended generator, while close requests cleanup through GeneratorExit.',examples:[
e('Handle an injected exception and continue',`def worker():
    try:
        yield "ready"
    except ValueError:
        yield "recovered"

g = worker()
print(next(g))
print(g.throw(ValueError("bad input")))
print(next(g, "done"))`,`ready
recovered
done`,'The generator must first be advanced to its yield. throw then raises ValueError at that suspension point, where the surrounding handler can catch it.','The handler yields recovered. Once the handler finishes, the generator ends and next with a default reports done.'),
e('Run cleanup when a generator is closed',`def resource_values():
    try:
        yield 1
        yield 2
    finally:
        print("cleanup")

g = resource_values()
print(next(g))
g.close()
print(next(g, "closed"))`,`1
cleanup
closed`,'close injects GeneratorExit at the suspension point. The finally block executes as the generator exits, so cleanup runs even though the second value was never requested.','Do not yield a new value while handling GeneratorExit. Resource ownership should remain explicit, especially when a consumer might abandon a generator early.'),
e('Distinguish return from raising StopIteration manually',`def broken():
    yield 1
    raise StopIteration("stop")

g = broken()
print(next(g))
try:
    next(g)
except RuntimeError:
    print("Use return to finish a generator")`,`1
Use return to finish a generator`,'An unexpected StopIteration escaping a generator body is converted to RuntimeError in modern Python. This prevents accidental silent termination from masking bugs.','Use return or let execution reach the end to finish normally. The iterator protocol then reports completion to the consumer correctly.') ]},
{ids:[57],summary:'map transforms items, filter keeps matching items, and reduce combines items into one result. map and filter are lazy iterators in Python 3.',examples:[
e('Transform and filter a sequence',`values = [1, 2, 3, 4]
squares = map(lambda n: n * n, values)
even = filter(lambda n: n % 2 == 0, values)
print(list(squares))
print(list(even))`,`[1, 4, 9, 16]
[2, 4]`,'map calls the transformation for each consumed input. filter calls a predicate and yields only the original values whose test is truthy.','The list calls materialize the iterators for display. A comprehension may be more readable when the transformation or filtering rule grows complex.'),
e('Reduce with an explicit initial accumulator',`from functools import reduce

print(reduce(lambda total, n: total + n, [2, 3, 4], 10))
print(reduce(lambda total, n: total + n, [], 10))`,`19
10`,'The accumulator begins at 10, then incorporates 2, 3, and 4. With no items, the initial accumulator is returned unchanged.','An explicit initializer also defines empty-input behavior. Prefer sum for simple addition; reduce is useful for genuinely custom accumulation.'),
e('Observe lazy execution',`def show(n):
    print("compute", n)
    return n * 2

result = map(show, [1, 2])
print("created")
print(next(result))
print(list(result))`,`created
compute 1
2
compute 2
[4]`,'Constructing map does not immediately call show. Requesting the first item performs just the first transformation.','The final list drains the remaining work. If a transformation has side effects or raises, that behavior happens during consumption rather than necessarily at construction.') ]},
{ids:[68],summary:'Lazy evaluation delays work until values are requested. It can reduce intermediate storage and unnecessary computation, but the resulting iterator is usually consumed once.',examples:[
e('Delay a calculation until next',`def values():
    print("working")
    yield 5

g = values()
print("not yet")
print(next(g))`,`not yet
working
5`,'The generator function body does not run when g is created. next starts the body and requests the first value.','This can avoid unused work, but it also delays side effects and exceptions. Understand where the pipeline is actually consumed.'),
e('Read a small prefix of an infinite sequence',`from itertools import count, islice

numbers = count(10)
print(list(islice(numbers, 3)))
print(next(numbers))`,`[10, 11, 12]
13`,'count can produce values indefinitely, but islice requests only three. The source iterator then remains positioned at 13.','Trying list(count(10)) would never finish and would keep growing memory. Always put a bound on materialization of an unbounded source.'),
e('Short-circuit a lazy search',`def checks():
    for n in [0, 2, 3]:
        print("check", n)
        yield n > 1

print(any(checks()))`,`check 0
check 2
True`,'any consumes until it finds a truthy result. It never asks for the final item after the test for 2 succeeds.','A lazy source makes that early stop avoid the remaining computation. With an already-built list of results, the work would have happened before any could short-circuit.') ]},
{ids:[70],summary:'itertools supplies small iterator tools that combine into efficient pipelines. Most produce values on demand rather than building full lists.',examples:[
e('Join and group neighboring pairs',`from itertools import chain, pairwise

print(list(chain([1, 2], [3, 4])))
print(list(pairwise([10, 20, 30])))`,`[1, 2, 3, 4]
[(10, 20), (20, 30)]`,'chain visits inputs one after another. pairwise produces overlapping adjacent pairs, useful for comparing consecutive observations.','pairwise requires Python 3.10 or newer. Neither tool recursively processes arbitrary nested objects.'),
e('Generate combinations and Cartesian products',`from itertools import combinations, product

print(list(combinations("ABC", 2)))
print(list(product([1, 2], ["x", "y"])))`,`[('A', 'B'), ('A', 'C'), ('B', 'C')]
[(1, 'x'), (1, 'y'), (2, 'x'), (2, 'y')]`,'combinations chooses groups without repeating positions or counting different orders separately. product pairs each value in the first input with each in the second.','The number of results can grow rapidly. Laziness avoids storing every result at once, but cannot remove the cost of consuming a huge output space.'),
e('Group consecutive runs, not all matching keys globally',`from itertools import groupby

values = ["A", "A", "B", "A"]
groups = [(key, len(list(items))) for key, items in groupby(values)]
print(groups)`,`[('A', 2), ('B', 1), ('A', 1)]`,'groupby starts a new group whenever the key changes. The last A is separate because a B appears between the A runs.','Sort first if the goal is grouping every equal key together, and consume each group before advancing the shared outer iterator.') ]}
];
