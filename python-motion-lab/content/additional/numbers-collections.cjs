const {lesson:l,e}=require('./helpers.cjs');
module.exports=[
l(126,'Why can floating-point arithmetic be surprising, and when should you use Decimal?','Floating point & Decimal','Python toolkit',
'A binary float represents numbers using a finite binary fraction, so many decimal fractions are approximated. The representation is excellent for many scientific and general computations, but exact decimal rounding rules may require Decimal. Constructing Decimal from a string preserves that decimal spelling, while constructing it from a float preserves the float’s already-approximated value. Arithmetic context and rounding mode remain part of the contract.',
'Use approximate comparisons for numerical floats and Decimal when the application requires deliberate decimal precision and rounding rules. Choose the numeric model before performing calculations.',
'Converting an imprecise float to Decimal afterward cannot recover an original exact decimal value. Also, formatting a value to two places does not change its underlying arithmetic type.',
'Floats approximate many decimal fractions. Use Decimal from strings when exact decimal input and explicit rounding rules matter.',
e('See binary rounding and a tolerant comparison',`import math
value = 0.1 + 0.2
print(value)
print(value == 0.3)
print(math.isclose(value, 0.3))`,`0.30000000000000004
False
True`,'The finite binary approximations produce a result slightly different from the float representing 0.3. Exact equality therefore fails.','isclose uses tolerances rather than a blanket equality rule. Set tolerances appropriate to the scale and accuracy requirements of the computation.'),
e('Build exact decimal values from strings',`from decimal import Decimal
value = Decimal("0.1") + Decimal("0.2")
print(value)
print(value == Decimal("0.3"))
print(Decimal(0.1) == Decimal("0.1"))`,`0.3
True
False`,'The string inputs specify exact decimal fractions within this simple calculation. Their sum is exactly the intended decimal 0.3.','Decimal(0.1) instead imports the already-approximated float value. The source of a numeric value matters as much as the final class used to store it.'),
e('Specify a rounding rule',`from decimal import Decimal, ROUND_HALF_UP
value = Decimal("2.345")
rounded = value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
print(rounded)
print(value)`,`2.35
2.345`,'quantize requests two decimal places with an explicit half-up tie rule. The original immutable value is unchanged.','Different domains can require different rounding policies. State the rule instead of assuming a display format or default context matches it.')),
l(127,'When is fractions.Fraction more useful than float?','Exact rational arithmetic','Python toolkit',
'Fraction represents a rational number as an exact numerator and denominator in reduced form. Arithmetic between rational values remains exact unless you deliberately convert into a different numeric model. Construction from an integer pair or decimal string differs from construction from a float: a float input represents its binary value exactly, including any prior approximation. limit_denominator can find a simpler nearby rational.',
'Use fractions for ratios, exact combinatorial calculations, and teaching arithmetic. Consider growth in numerator and denominator sizes during long computations.',
'Fraction(0.1) is not the same as Fraction("0.1"). An exact representation of an approximate input does not make the original decimal interpretation exact.',
'Fraction keeps ratios exact as integers over integers. Choose inputs carefully, especially when converting existing floats.',
e('Add exact rational values',`from fractions import Fraction
value = Fraction(1, 3) + Fraction(1, 6)
print(value)
print(value.numerator, value.denominator)`,`1/2
1 2`,'Fraction combines the ratios exactly and reduces the result to its simplest form. No floating-point intermediate is required.','The numerator and denominator remain integers, which makes exact equality and later symbolic ratio calculations straightforward.'),
e('Compare decimal-text and float construction',`from fractions import Fraction
print(Fraction("0.1"))
print(Fraction(0.1) == Fraction(1, 10))
print(Fraction("0.1") == Fraction(1, 10))`,`1/10
False
True`,'The string specifies the exact decimal tenth, while the float already contains a binary approximation. Fraction faithfully represents whichever value it receives.','Decide whether you need the exact stored float or the decimal value a user intended. Those are different conversion tasks.'),
e('Approximate a ratio with a bounded denominator',`from fractions import Fraction
estimate = Fraction("3.14159").limit_denominator(100)
print(estimate)
print(float(Fraction(1, 4)))`,`311/99
0.25`,'limit_denominator chooses a nearby rational whose denominator is at most 100. This is a deliberate approximation of the original exact decimal fraction.','Converting a quarter to float is exact here because its denominator is a power of two. Not every rational converts to an exact binary float.')),
l(128,'How are bool, int, float, NaN, and numeric comparisons related?','Numeric types & NaN','Python toolkit',
'Python numeric types have compatible operations in many common cases, but they do not all represent the same values or semantics. bool is a subclass of int, so True and False participate numerically as 1 and 0. Floats include non-finite values such as infinity and NaN. NaN has unusual comparison rules, including not being equal to itself, so explicit predicates are needed when checking data quality.',
'Use isinstance when accepting numeric families and exact type checks when excluding booleans is intentional. Handle non-finite values explicitly in computations that require finite measurements.',
'A check value == float("nan") never identifies NaN. Also, int conversion truncates toward zero; it is not a general rounding operation.',
'Numeric types overlap, but their edge cases differ. Check for NaN and finiteness explicitly, and decide whether booleans count as integers in your API.',
e('See the bool/int relationship',`print(isinstance(True, int))
print(type(True) is int)
print(True + True)
print(sum([True, False, True]))`,`True
False
2
2`,'bool inherits from int but is still its own exact type. Arithmetic treats True as 1 and False as 0.','Counting predicate results with sum can be useful. Validation that requires an ordinary integer may deliberately reject bool despite isinstance returning True.'),
e('Check NaN with the correct predicate',`import math
value = float("nan")
print(value == value)
print(math.isnan(value))
print(math.isfinite(value))
print(math.isfinite(float("inf")))`,`False
True
False
False`,'NaN represents a not-a-number result and compares unequal even to itself. math.isnan detects that category directly.','math.isfinite excludes both NaN and infinity. Use it when downstream calculations require ordinary finite measurements.'),
e('Separate truncation, rounding, and floor',`import math
print(int(-2.9))
print(math.floor(-2.9))
print(round(2.5), round(3.5))`,`-2
-3
2 4`,'int truncates toward zero, while floor selects the greatest integer not greater than the input. Negative values make the distinction visible.','The exact-half examples use round’s ties-to-even behavior. Choose explicit rounding policies when a domain requires a different treatment.')),
l(129,'Why can visually identical Unicode strings compare unequal?','Unicode normalization & casefold','Python toolkit',
'Unicode text can encode a visually similar character as one code point or as a base character plus combining marks. Python string equality compares code points rather than rendered appearance. Normalization provides named transformations such as NFC to produce a consistent representation for many equivalent sequences. casefold supports more comprehensive caseless matching than lower, but neither operation is a universal policy for every language or identifier.',
'Normalize according to a defined application policy before comparisons, storage deduplication, or search. Retain original user-facing text where appropriate.',
'Length in code points is not necessarily the number of user-perceived characters. Normalization and case folding do not solve every confusable-character or language-specific issue.',
'Text that looks the same can have different code points. Normalize and casefold only according to a deliberate comparison policy.',
e('Compare composed and decomposed text',String.raw`import unicodedata
a = "\u00e9"
b = "e\u0301"
print(len(a), len(b))
print(a == b)
print(unicodedata.normalize("NFC", a) == unicodedata.normalize("NFC", b))`,`1 2
False
True`,'The two strings use different code-point sequences, so direct equality is false. NFC combines the decomposed sequence where a composed equivalent exists.','The normalized values compare equal. This example does not assume that every apparent visual match is canonically equivalent.'),
e('Use casefold for a caseless comparison',String.raw`a = "Stra\u00dfe"
b = "STRASSE"
print(a.lower() == b.lower())
print(a.casefold() == b.casefold())`,`False
True`,'lower leaves the special German letter distinct from ss, while casefold applies a stronger caseless matching transformation.','Use the transformation for comparison keys rather than silently replacing the user’s original display text. Locale-specific requirements may need additional handling.'),
e('Inspect code points explicitly',String.raw`text = "e\u0301"
print([f"U+{ord(char):04X}" for char in text])
print(len(text.encode("utf-8")))`,`['U+0065', 'U+0301']
3`,'The code-point list reveals the base e and combining accent separately. Their UTF-8 encoding occupies three bytes.','Code points, encoded bytes, and rendered graphemes are different units. Choose the unit that matches the operation instead of treating every length as a character count.')),
l(130,'How do regex search, match, fullmatch, groups, and raw strings differ?','Regular expression matching modes','Python toolkit',
're.search looks for a match anywhere, re.match starts at the beginning, and re.fullmatch requires the whole string to satisfy the pattern. Groups extract structured portions of a match. Raw string literals reduce Python-level backslash escaping, while the regex engine still interprets regex escapes. A pattern matching a prefix is not automatically a full-input validator.',
'Use fullmatch for simple whole-field format checks, search for finding embedded text, and captured groups when a match needs named components. Keep patterns understandable and bounded for untrusted input.',
'An unescaped dot means any suitable character, not a literal period. Raw strings do not turn regex metacharacters into literal text; re.escape handles literal fragments.',
'Choose where a regex may match, then extract the needed groups. Raw strings preserve backslashes for the regex parser rather than disabling regex syntax.',
e('Compare matching positions',`import re
text = "item 123"
print(bool(re.search(r"\\d+", text)))
print(bool(re.match(r"\\d+", text)))
print(bool(re.fullmatch(r"\\d+", "123x")))`,`True
False
False`,'search finds digits after the prefix. match rejects the same input because digits do not begin at position zero.','fullmatch rejects the trailing x even though the string starts with digits. Whole-field validation needs that complete coverage.'),
e('Extract named groups',`import re
match = re.fullmatch(r"(?P<name>[A-Za-z]+):(?P<score>\\d+)", "Ada:7")
print(match.group("name"))
print(int(match.group("score")) + 1)`,`Ada
8`,'Named groups identify the two meaningful fields of this simple format. The digit group is still text until converted to an integer.','Check for a None match in real input handling. Accessing group on a failed match is a separate error from a valid match with an unexpected value.'),
e('Escape a literal fragment',`import re
fragment = "a.b"
pattern = re.escape(fragment)
print(bool(re.fullmatch(pattern, "a.b")))
print(bool(re.fullmatch(pattern, "axb")))`,`True
False`,'re.escape protects the period so it matches itself. Without escaping, a dot would match the x in the second string too.','Escape data fragments, not an entire deliberately authored regex. Pattern syntax and literal input serve different roles.')),
l(131,'When should you use Counter and defaultdict instead of an ordinary dictionary?','Counter & defaultdict','Python toolkit',
'Counter counts hashable values and supplies zero for missing counts. defaultdict calls a configured factory when an absent key is accessed through indexing, then stores the new value. These tools express common accumulation patterns without repeated initialization branches. They remain dictionaries with additional behavior, so methods such as get do not necessarily trigger the same missing-key machinery as indexing.',
'Use Counter for frequencies and defaultdict(list) or defaultdict(set) for grouping. A factory should create fresh mutable state for each new key.',
'defaultdict(list) passes the factory itself, not list(). Also, reading a missing key through [] mutates the mapping by inserting a value, which may be surprising during inspection.',
'Counter counts things; defaultdict creates a starting value for new keys. Their convenience depends on understanding when missing-key access changes state.',
e('Count repeated values',`from collections import Counter
counts = Counter("banana")
print(counts["a"], counts["b"], counts["x"])
print(counts.most_common(1))`,`3 1 0
[('a', 3)]`,'Counter accumulates occurrences and reports zero for an unseen key. most_common selects the highest-frequency item in this input.','Values must be suitable dictionary keys. Counter does not group mutable lists as keys without converting them into a hashable representation.'),
e('Group records without manual initialization',`from collections import defaultdict
groups = defaultdict(list)
for city, name in [("A", "Ada"), ("B", "Grace"), ("A", "Lin")]:
    groups[city].append(name)
print(dict(groups))`,`{'A': ['Ada', 'Lin'], 'B': ['Grace']}`,'The first indexed access for a city calls list to create its independent group. Later accesses reuse that city’s stored list.','Passing the callable list lets the mapping create separate containers. A single pre-created shared list would couple unrelated groups.'),
e('Distinguish get from indexed missing access',`from collections import defaultdict
data = defaultdict(list)
print(data.get("x"))
print("x" in data)
print(data["x"])
print("x" in data)`,`None
False
[]
True`,'get does not invoke defaultdict’s factory, so the first read leaves the mapping unchanged. Indexed access creates and stores the default list.','This matters when diagnostics should not mutate data. Use the access form whose state changes match the intended operation.')),
l(132,'Why is collections.deque useful for queues and bounded history?','Deque & bounded history','Python toolkit',
'deque supports efficient additions and removals at both ends. It is suitable for FIFO queues, stacks, and bounded history buffers. A maxlen limit discards items from the opposite end when appending to a full deque. It is not a replacement for a list when frequent middle indexing is the main operation, and a series of operations still needs an appropriate concurrency design.',
'Use append plus popleft for a local FIFO queue, or a bounded deque for the latest observations. Use queue.Queue when blocking producer/consumer coordination is required.',
'popleft on an empty deque raises IndexError. Also, a bounded deque’s automatic eviction may discard important work if it is mistakenly used as a lossless task queue.',
'A deque is efficient at both ends. It makes a good local queue or rolling history, but bounds can intentionally discard old items.',
e('Process items in first-in, first-out order',`from collections import deque
queue = deque()
queue.append("first")
queue.append("second")
print(queue.popleft())
print(queue.popleft())`,`first
second`,'Items enter on the right and leave on the left, preserving arrival order. This avoids repeatedly shifting the remainder of a list.','The example assumes work exists before removal. Handle empty state explicitly if producers and consumers do not run in a fixed sequence.'),
e('Keep only recent history',`from collections import deque
history = deque(maxlen=3)
for value in [1, 2, 3, 4]:
    history.append(value)
print(list(history))`,`[2, 3, 4]`,'Adding 4 to the full deque evicts 1 from the opposite end. The buffer therefore retains exactly the most recent three entries.','This is intentionally lossy storage. Use a different design for pending work that must never disappear without being processed.'),
e('Rotate and extend on either side',`from collections import deque
values = deque([1, 2, 3])
values.rotate(1)
print(list(values))
values.appendleft(0)
print(list(values))`,`[3, 1, 2]
[0, 3, 1, 2]`,'A positive rotation moves items from the right end to the left. appendleft then inserts a new leading item.','These operations are useful for cyclic scheduling and endpoint-oriented algorithms. They do not imply that arbitrary middle operations have list-like performance.')),
l(133,'What invariant does heapq maintain, and how do priority queues handle ties?','Heaps & priority queues','Python toolkit',
'heapq maintains a min-heap in a list: the smallest item is at index zero, and each parent is no greater than its children. The list is not globally sorted. heappop removes the minimum while restoring the invariant. Tuple entries allow a priority followed by tie-breaker fields. A monotonically increasing counter prevents accidental comparison of payload objects when priorities tie.',
'Use a heap when repeatedly selecting the next smallest priority without sorting the full set each time. It suits schedulers and top-k selection.',
'Reading the raw heap list as sorted output is incorrect. Equal priorities can trigger comparisons of later tuple fields, so ensure those fields have a defined ordering.',
'A heap quickly exposes the smallest priority, but its backing list is not a sorted list. Add an explicit tie-breaker for equal priorities.',
e('Extract values in increasing order',`import heapq
heap = [5, 1, 3]
heapq.heapify(heap)
print(heap[0])
print([heapq.heappop(heap) for _ in range(3)])`,`1
[1, 3, 5]`,'heapify arranges the existing list into a valid heap. Repeated heappop calls produce increasing values even though the raw layout need not be fully sorted.','Each pop changes the heap. Do not expect to retain the original list or iterate it afterward as if nothing were consumed.'),
e('Use a counter to preserve order among tied priorities',`import heapq
from itertools import count
serial = count()
heap = []
for name in ["first", "second"]:
    heapq.heappush(heap, (1, next(serial), {"name": name}))
print(heapq.heappop(heap)[2]["name"])
print(heapq.heappop(heap)[2]["name"])`,`first
second`,'The equal priority is followed by a unique increasing number, so tuple comparison never reaches the unorderable dictionaries.','The counter also gives first-in ordering for this tied priority. Other applications may deliberately choose a different tie-breaking policy.'),
e('Select a small number of extreme values',`import heapq
values = [9, 2, 7, 1, 8]
print(heapq.nsmallest(2, values))
print(heapq.nlargest(2, values))`,`[1, 2]
[9, 8]`,'These helpers return the requested extremes in sorted order without requiring the caller to manage a heap explicitly.','Choose based on workload: a full sort may be simpler or preferable when most of the collection is needed. Performance claims depend on input size and k.')),
l(134,'How do bisect_left, bisect_right, and insort work on sorted data?','Binary insertion with bisect','Python toolkit',
'bisect finds insertion positions in an already-sorted sequence using binary search. bisect_left chooses a position before equal values, while bisect_right chooses after them. Neither function by itself guarantees that the requested value exists. insort also inserts into a mutable list, but list shifting still makes that insertion linear in the worst case. The ordering assumptions must remain consistent.',
'Use bisect for repeated boundary queries and moderate sorted lists. It is valuable for counts within numeric intervals and maintaining small ordered collections.',
'Calling bisect on unsorted input produces a position with no useful sorted-search guarantee. Do not mistake logarithmic search for logarithmic list insertion.',
'Bisect locates boundaries in sorted data. Left goes before ties, right goes after ties, and insertion still has list-shifting costs.',
e('Locate both boundaries of equal values',`from bisect import bisect_left, bisect_right
values = [1, 2, 2, 4]
left = bisect_left(values, 2)
right = bisect_right(values, 2)
print(left, right)
print(right - left)`,`1 3
2`,'The half-open interval from left to right contains all values equal to 2. Their difference gives the count of equal items.','This relies on the sequence already being sorted under the same comparison rules. No scan of all ties is needed to locate the boundaries.'),
e('Check membership after finding a position',`from bisect import bisect_left
values = [1, 3, 5]
def contains(target):
    index = bisect_left(values, target)
    return index < len(values) and values[index] == target
print(contains(3))
print(contains(4))`,`True
False`,'bisect_left returns where the target could be inserted, including positions for absent targets. The equality check establishes actual membership.','The bounds test prevents indexing beyond the end. Short-circuiting keeps the second check from running when the position is invalid.'),
e('Maintain sorted order on insertion',`from bisect import insort
values = [1, 3, 5]
insort(values, 4)
insort(values, 3)
print(values)`,`[1, 3, 3, 4, 5]`,'insort locates a valid boundary and inserts the new value into the list. Existing values shift to make room.','For high-volume updates, choose a data structure suited to that workload rather than assuming binary position search eliminates insertion costs.')),
l(135,'How do Enum members improve the representation of fixed choices?','Enums & fixed choices','Classes & design',
'Enum defines a named set of members representing a fixed domain, such as workflow states. Members have names and associated values, and ordinary Enum members remain distinct from their underlying values. Aliases can occur when values repeat unless uniqueness is enforced. auto can generate values, but the generated storage value should not automatically become an external protocol contract.',
'Use an enum for meaningful closed choices and convert external inputs at a clear boundary. A recognizable member is more expressive than an unexplained numeric constant.',
'Do not assume Color.RED equals the string or integer stored in its value. Also, adding an enum does not automatically validate every assignment to an ordinary object attribute.',
'Enums name the allowed choices in a domain. Convert raw values into members explicitly, and treat their names and stored values as different things.',
e('Read a member’s name and value',`from enum import Enum
class Status(Enum):
    NEW = "new"
    DONE = "done"
print(Status.NEW.name)
print(Status.NEW.value)
print(Status.NEW == "new")`,`NEW
new
False`,'The member has a symbolic name and a stored value, but remains an Enum member rather than an ordinary string.','That separation prevents accidental mixing of unrelated domains that happen to share the same raw value.'),
e('Validate a raw value at a boundary',`from enum import Enum
class Status(Enum):
    NEW = "new"
    DONE = "done"
print(Status("done") is Status.DONE)
try:
    Status("missing")
except ValueError:
    print("Unknown status")`,`True
Unknown status`,'Calling the enum class with a known value retrieves the corresponding member. An unknown value raises instead of silently creating a new choice.','Handle that conversion failure where outside data enters the application. An existing plain string variable does not validate itself merely because an enum exists.'),
e('Prevent accidental aliases',`from enum import Enum, unique
try:
    @unique
    class Code(Enum):
        FIRST = 1
        SECOND = 1
except ValueError:
    print("Duplicate enum values")`,`Duplicate enum values`,'Without an explicit uniqueness rule, equal values can create aliases. @unique rejects the duplicate during class construction.','Choose aliases deliberately when they are meaningful; use uniqueness enforcement when each named choice must have its own value.'))
];
