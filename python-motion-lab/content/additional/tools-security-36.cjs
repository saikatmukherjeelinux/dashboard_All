const {lesson:l,e}=require('./helpers.cjs');
module.exports=[
l(168,'Why does itertools.groupby group consecutive runs rather than all equal keys?','Grouping consecutive runs','Iteration',
'itertools.groupby creates a group whenever its key changes as the input is traversed. Equal keys separated by another key therefore form separate groups. Each group is an iterator sharing the underlying input with the outer iterator, so consume or materialize a group before advancing to the next one.',
'Use groupby for run-length summaries, already ordered records, and streaming groups. Sort by the same key first when the goal is one group for every distinct key.',
'groupby does not sort the input or retain independent copies of every group. Saving group iterators for later consumption can produce empty results once the outer iterator has advanced.',
'groupby splits consecutive runs. Sort first for one group per key, and consume each group before moving to the next.',
e('Group neighboring letters',`from itertools import groupby
for key, group in groupby("AAABBAC"):
    print(key, len(list(group)))`,`A 3
B 2
A 1
C 1`,'The later A starts a new group because B interrupted the earlier run. Grouping depends on adjacent key changes rather than a global lookup.','Materializing each group inside the loop consumes its members before advancing the outer iterator, avoiding shared-input surprises.'),
e('Sort records by the grouping key',`from itertools import groupby
records = [("b", 2), ("a", 1), ("b", 3)]
records.sort(key=lambda row: row[0])
for key, rows in groupby(records, key=lambda row: row[0]):
    print(key, sum(value for _, value in rows))`,`a 1
b 5`,'Sorting by the exact grouping key places both b records next to each other, allowing a single b group to contain both values.','The group is consumed immediately by sum. Aggregation can stream through a group without building another list of all its rows.'),
e('Materialize groups that must outlive iteration',`from itertools import groupby
groups = [(key, list(items)) for key, items in groupby([1, 1, 2, 3, 3])]
print(groups)
print(groups[0][1])`,`[(1, [1, 1]), (2, [2]), (3, [3, 3])]
[1, 1]`,'Each group is converted to a list while it is current. The stored lists no longer depend on the advancing shared input iterator.','This trades streaming memory behavior for retained results. Keep just counts or other summaries when retaining every element is unnecessary.')),
l(169,'How does itertools.tee copy iteration, and why can it buffer memory?','Tee & independent iterator cursors','Iteration',
'itertools.tee returns iterators that can traverse the same input independently. It does not eagerly copy every source value. Instead, it retains values needed by slower branches as faster branches advance. A large gap between consumers can therefore require substantial storage.',
'Use tee for a few coordinated passes over a finite or similarly consumed stream. A list may be simpler when all values will be retained anyway.',
'Do not continue consuming the original input separately after splitting it, because tee branches share that source. The retained values are object references, not deep copies.',
'tee gives separate cursors over one source. Lagging branches cause buffering, and yielded mutable objects can still be shared.',
e('Advance two branches separately',`from itertools import tee
first, second = tee(iter([10, 20, 30]))
print(next(first))
print(list(second))
print(list(first))`,`10
[10, 20, 30]
[20, 30]`,'The second branch starts at its own initial position even after the first has consumed 10. tee retains needed items behind the faster cursor.','The first branch still has its own remaining position. Draining one branch does not rewind or exhaust the other branch’s logical sequence.'),
e('Compute two summaries',`from itertools import tee
values = (n * n for n in range(4))
left, right = tee(values)
print(sum(left))
print(max(right))`,`14
9`,'Both summaries observe the square sequence 0, 1, 4, 9. tee allows separate consumption without running the generator expression twice.','Here sum drains its branch before max begins, so the other branch must retain the full sequence. For large data, consider combining summaries in one pass.'),
e('Observe shared yielded objects',`from itertools import tee
left, right = tee(iter([[1], [2]]))
item = next(left)
item.append(9)
print(next(right))
print(next(left))`,`[1, 9]
[2]`,'Both branches receive references to the same first list, so mutating it through the first branch changes what the second branch observes.','tee duplicates cursor behavior rather than deep-copying yielded data. Copy values explicitly if the branches must mutate independent objects.')),
l(170,'How does itertools.accumulate expose intermediate reductions?','Accumulate & running state','Iteration',
'itertools.accumulate yields the running result of combining input values. Addition is the default operation, but another binary function can implement running products, minima, or state transitions. An initial value can seed the calculation and is itself included as the first yielded result.',
'Use accumulate for cumulative totals, running extrema, and incremental reports where intermediate results matter. Use a single reduction when only the final result is needed.',
'The result is a one-shot iterator. Providing initial adds an extra output, and the chosen function must accept the accumulated state and the next input value.',
'accumulate yields every intermediate reduction. Choose the combining function and initial state to describe the running calculation.',
e('Compute running totals',`from itertools import accumulate
print(list(accumulate([2, 3, 4])))
print(list(accumulate([2, 3, 4], initial=10)))`,`[2, 5, 9]
[10, 12, 15, 19]`,'Without an initial value, the first input becomes the first result. Each later result adds the next input to the previous accumulated value.','The explicit initial value is yielded first, then combined with every input. Three inputs therefore produce four outputs in that second call.'),
e('Track a running maximum',`from itertools import accumulate
values = [3, 1, 5, 2, 7]
print(list(accumulate(values, max)))`,`[3, 3, 5, 5, 7]`,'max compares the previous accumulated maximum with each new value. Smaller incoming values leave the running result unchanged.','The output retains a position for each input even when the maximum does not change, making it useful for aligned running summaries.'),
e('Multiply rather than add',`from itertools import accumulate
from operator import mul
print(list(accumulate([2, 3, 4], mul, initial=1)))
print(list(accumulate([], initial=0)))`,`[1, 2, 6, 24]
[0]`,'The multiplicative identity 1 seeds the product. The successive states multiply by 2, then 3, then 4.','Even an empty input yields the supplied initial value. This distinction matters when aligning accumulated outputs with the original input positions.')),
l(171,'How does cached_property differ from a property that recomputes every access?','Cached properties & invalidation','Classes & design',
'functools.cached_property computes a value on first attribute access and normally stores that value in the instance dictionary under the attribute name. Later accesses use the stored value. Deleting the stored attribute permits recomputation on the next access. Dependencies that change do not invalidate the cache automatically.',
'Use a cached property for an expensive derived value on an instance whose inputs remain stable or whose invalidation policy is explicit.',
'Instances normally need a writable __dict__. Do not assume the getter runs only once under concurrent access; synchronize when duplicate computation would be unsafe.',
'cached_property stores a derived value on the instance. Change its inputs only with an explicit plan to invalidate or refresh that stored result.',
e('Count initial computation',`from functools import cached_property
class Report:
    def __init__(self):
        self.calls = 0
    @cached_property
    def total(self):
        self.calls += 1
        return 42
r = Report()
print(r.total, r.total)
print(r.calls)`,`42 42
1`,'The first access executes the getter and stores 42 on this instance. The second access finds the cached attribute rather than recomputing it.','The counter measures actual getter calls for this sequential example. It does not establish a guarantee against concurrent duplicate computation.'),
e('Invalidate a derived value',`from functools import cached_property
class Basket:
    def __init__(self):
        self.values = [2, 3]
    @cached_property
    def total(self):
        return sum(self.values)
b = Basket()
print(b.total)
b.values.append(4)
print(b.total)
del b.total
print(b.total)`,`5
5
9`,'Mutating the input list does not tell cached_property that its stored answer is outdated. The second access therefore still returns 5.','Deleting the attribute removes the cached binding. The next access computes a new total from the updated list and stores 9.'),
e('Compare a normal property',`class Sensor:
    def __init__(self):
        self.value = 2
    @property
    def doubled(self):
        return self.value * 2
s = Sensor()
print(s.doubled)
s.value = 5
print(s.doubled)`,`4
10`,'A normal property invokes its getter on each access, so the derived value immediately reflects the changed input.','Caching is a design choice rather than an automatic improvement. Recomputing a cheap value can be simpler and avoids an invalidation requirement.')),
l(172,'How do operator helpers replace small lookup and method-call lambdas?','Operator lookup & call helpers','Functions',
'operator.itemgetter builds a callable that selects one or more items, attrgetter selects attributes and can traverse dotted attribute paths, and methodcaller invokes a named method with stored arguments. These helpers fit APIs such as sorted(key=...) that expect a callable.',
'Use these helpers for straightforward field extraction and method invocation. Prefer a named function when validation, branching, or a substantial explanation belongs in the operation.',
'itemgetter uses indexing while attrgetter uses attribute access. Missing keys, indexes, attributes, or methods still raise their normal errors.',
'Operator helpers package a simple lookup or method call as a callable. Choose item access, attribute access, or method invocation to match the data.',
e('Sort records by multiple fields',`from operator import itemgetter
rows = [("b", 2), ("a", 3), ("a", 1)]
print(sorted(rows, key=itemgetter(0, 1)))`,`[('a', 1), ('a', 3), ('b', 2)]`,'itemgetter(0, 1) returns a tuple containing two indexed fields from each row. Those tuples become the sorting keys.','Tuple comparison first compares the first field, then the second when the first fields match, producing the displayed two-level ordering.'),
e('Extract a nested attribute',`from operator import attrgetter
from types import SimpleNamespace
person = SimpleNamespace(address=SimpleNamespace(city="Kolkata"))
get_city = attrgetter("address.city")
print(get_city(person))`,`Kolkata`,'The dotted attribute path first accesses person.address and then accesses city on that object. It is not dictionary key traversal.','The returned callable can be reused for many similarly shaped objects. Missing attributes still fail rather than producing an automatic default.'),
e('Build a stored method call',`from operator import methodcaller
replace_spaces = methodcaller("replace", " ", "-")
print(replace_spaces("learn python now"))
print(methodcaller("upper")("quiz"))`,`learn-python-now
QUIZ`,'methodcaller stores the method name and its arguments, then looks up and calls that method on each object supplied later.','The helpers do not modify these strings because string methods return new strings. Method behavior still depends on the receiving object’s type.')),
l(173,'When should secrets be used instead of random for unpredictable tokens?','Secrets & unpredictable tokens','Python toolkit',
'secrets provides randomness suitable for security-sensitive choices and tokens using the operating system’s randomness facilities. token_hex and token_urlsafe encode random bytes for common text transports. Specify an explicit byte count when the token size is part of the application’s contract, and treat generated tokens as secrets.',
'Use secrets for password-reset links, session tokens, and other values that must resist guessing. Store and compare them according to the application’s authentication design.',
'A deterministic random.Random seed is useful for simulation but inappropriate for secret generation. Encoding a token does not encrypt it, and actual security depends on adequate entropy and the full surrounding system.',
'Use secrets when unpredictability matters. Choose an explicit random-byte budget and do not expose real tokens in logs or example output.',
e('Inspect token shape without revealing it',`import secrets
token = secrets.token_hex(16)
print(len(token))
print(all(c in "0123456789abcdef" for c in token))`,`32
True`,'Sixteen random bytes become thirty-two hexadecimal characters because each byte needs two hex digits. The generated token itself is not printed.','Only deterministic properties of the token are displayed. A fresh run generates different secret content while preserving those format properties.'),
e('Choose from an allowed alphabet',`import secrets
alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
code = "".join(secrets.choice(alphabet) for _ in range(12))
print(len(code))
print(set(code) <= set(alphabet))`,`12
True`,'Each position is chosen from the specified alphabet with secrets.choice. The final string has the requested number of positions.','The membership test checks the output alphabet without disclosing the generated code. Length and alphabet determine its entropy budget, not visual complexity alone.'),
e('Create a URL-friendly token',`import secrets
token = secrets.token_urlsafe(24)
print(len(token))
print("+" not in token and "/" not in token)
print(isinstance(token, str))`,`32
True
True`,'Twenty-four random bytes encode to thirty-two URL-safe Base64 characters here. The URL-safe alphabet avoids plus and slash.','The text is still a bearer secret if used for authentication. URL-safe encoding makes transport convenient but adds neither access control nor encryption.')),
l(174,'How can a local random.Random instance make simulations reproducible?','Independent random generators','Python toolkit',
'random.Random holds its own pseudorandom generator state. Separate instances with the same seed and the same sequence of operations can reproduce the same sequence. Local instances avoid coupling a simulation to unrelated calls on the module-level generator. State can also be saved and restored.',
'Use local seeded generators for simulations, randomized tests, and examples that need controlled repetition. Record assumptions about Python versions and algorithms when exact reproducibility is a long-term requirement.',
'Pseudorandom sequences are not suitable for authentication secrets. A seed does not mean successive samples are equal, and different operations advance generator state differently.',
'Give each simulation its own Random instance. A seed controls its sequence; getstate and setstate can preserve a specific position.',
e('Repeat the same seeded sequence',`import random
a = random.Random(7)
b = random.Random(7)
print([a.random() for _ in range(3)] == [b.random() for _ in range(3)])
print(a is b)`,`True
False`,'Both independent generators begin from the same seeded state and receive the same calls, so their generated sample lists match.','They are distinct objects rather than shared aliases. Advancing one later does not automatically advance the other generator.'),
e('Restore a generator position',`import random
rng = random.Random(10)
saved = rng.getstate()
first = rng.random()
rng.setstate(saved)
print(first == rng.random())`,`True`,'getstate captures the generator’s internal position before drawing the first value. Restoring that state repeats the next draw.','This controls an experiment’s pseudorandom input sequence. It is not a security feature and should not be used to make authentication tokens predictable.'),
e('Shuffle a copy of the input',`import random
original = [1, 2, 3, 4]
shuffled = original.copy()
random.Random(12).shuffle(shuffled)
print(original)
print(sorted(shuffled))
print(shuffled is original)`,`[1, 2, 3, 4]
[1, 2, 3, 4]
False`,'shuffle mutates the supplied list in place, so copying first preserves the original ordering for other consumers.','Sorting the shuffled result verifies its members without depending on a particular displayed permutation. The two lists remain separate objects.')),
l(175,'What can a cryptographic hash verify, and what does it not provide?','Hashlib & content digests','Python toolkit',
'hashlib computes digests of byte sequences using algorithms such as SHA-256. The same bytes produce the same digest, and incremental updates hash the concatenation of the supplied chunks. A digest can identify expected content when the expected digest comes from a trusted source; it does not encrypt the content or authenticate an untrusted sender by itself.',
'Use digests for content identifiers and integrity checks against trusted expected values. Encode text explicitly and define whether normalization or line-ending conversion is part of the format.',
'A plain fast hash is not appropriate password storage. Use a purpose-built password hashing design, and use a keyed authentication construction when authenticity is required.',
'A hash maps bytes to a content digest. It is not encryption, and integrity depends on trusting the expected digest.',
e('Hash a known byte sequence',`import hashlib
digest = hashlib.sha256(b"abc")
print(digest.hexdigest())
print(len(digest.digest()))`,`ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
32`,'SHA-256 produces thirty-two digest bytes for this input. Hexadecimal representation uses two characters per digest byte.','The input is explicitly bytes, so no implicit text encoding is involved. Changing the input bytes produces a different digest in ordinary use.'),
e('Hash chunks incrementally',`import hashlib
digest = hashlib.sha256()
for chunk in [b"py", b"thon"]:
    digest.update(chunk)
print(digest.digest() == hashlib.sha256(b"python").digest())`,`True`,'Sequential updates feed the same byte stream as hashing the concatenated chunks. Chunk boundaries are not included as extra data.','This permits streaming large files without materializing the entire file in memory. Add explicit framing if separate logical records must remain distinguishable.'),
e('Copy digest state for two suffixes',`import hashlib
prefix = hashlib.sha256(b"prefix:")
left = prefix.copy()
right = prefix.copy()
left.update(b"A")
right.update(b"B")
print(left.digest() != right.digest())
print(prefix.digest() == hashlib.sha256(b"prefix:").digest())`,`True
True`,'copy duplicates the current hashing state, allowing two independent suffix calculations from the same previously hashed prefix.','Updating the copies does not mutate the original digest state. The prefix object still represents only the original prefix bytes.')),
l(176,'How does HMAC authenticate bytes using a shared secret key?','HMAC & authentication tags','Python toolkit',
'HMAC combines a secret key, a message, and a cryptographic hash in a defined authentication construction. Parties with the same secret can compute and verify a message authentication tag. Use hmac.compare_digest for supported same-type tag values rather than an ordinary equality test when comparing secret-derived values.',
'Use a documented HMAC-based protocol when a shared-key authentication design is appropriate. Specify exact message bytes and encoding, keep keys secret, and include protocol-level replay protection when needed.',
'HMAC does not encrypt the message or stop replay by itself. A hard-coded demonstration key is only for examples and must not be reused as a real credential.',
'HMAC uses a shared secret to authenticate exact message bytes. Verify tags carefully; encryption and replay prevention are separate requirements.',
e('Verify a matching message tag',`import hashlib
import hmac
key = b"demo-only-key"
tag = hmac.new(key, b"message", hashlib.sha256).digest()
expected = hmac.new(key, b"message", hashlib.sha256).digest()
print(hmac.compare_digest(tag, expected))
print(len(tag))`,`True
32`,'The same key and the same message bytes produce the same SHA-256 HMAC tag. Its raw output occupies thirty-two bytes.','The fixed key makes this a reproducible demonstration only. Real systems need appropriate key generation, storage, distribution, and rotation.'),
e('Detect changed message content',`import hmac
key = b"demo-only-key"
first = hmac.digest(key, b"amount=10", "sha256")
changed = hmac.digest(key, b"amount=11", "sha256")
print(hmac.compare_digest(first, changed))`,`False`,'Changing the message changes the tag even though the key and algorithm remain the same. Verification binds the authenticated bytes to the key.','Both values are byte strings of the same type. Applications must also agree on exact serialization so they authenticate the same logical message representation.'),
e('Update an authentication tag incrementally',`import hmac
key = b"demo-only-key"
tagger = hmac.new(key, digestmod="sha256")
tagger.update(b"hello")
tagger.update(b" world")
print(hmac.compare_digest(tagger.digest(), hmac.digest(key, b"hello world", "sha256")))`,`True`,'Incremental updates authenticate the concatenated bytes, just as a one-shot call would. A chunk boundary is not part of the message.','Streaming computation avoids loading an entire message at once. Distinct logical fields still need unambiguous framing in the surrounding protocol.')),
l(177,'What does Base64 encoding do, and why is it not encryption?','Base64 & binary-to-text encoding','Python toolkit',
'Base64 encodes binary data using a text-friendly alphabet. Standard Base64 and URL-safe Base64 use different characters for two alphabet positions. Encoding is reversible without a secret, so it provides neither confidentiality nor authentication. Decoding text should follow the input format’s rules, including any padding requirements.',
'Use Base64 when a transport supports text but must carry binary data. Choose the alphabet and validation behavior required by the protocol.',
'Never treat an encoded password or token as encrypted. By default some decoding modes are permissive; request strict validation when the format requires rejecting unrelated characters.',
'Base64 makes bytes easier to transport as text. Anyone can decode it, so it is encoding rather than secrecy.',
e('Round-trip binary bytes',`import base64
encoded = base64.b64encode(b"Python")
print(encoded.decode("ascii"))
print(base64.b64decode(encoded))`,`UHl0aG9u
b'Python'`,'The encoded bytes contain only the Base64 text alphabet. Decoding them reconstructs the original byte sequence exactly.','decode("ascii") is used only to present the encoded text. It does not change the original binary content or add any security protection.'),
e('Compare standard and URL-safe alphabets',`import base64
data = bytes([251, 255])
print(base64.b64encode(data).decode("ascii"))
print(base64.urlsafe_b64encode(data).decode("ascii"))`,`+/8=
-_8=`,'The URL-safe alphabet replaces plus and slash with minus and underscore. Both outputs encode the same two input bytes.','The equals sign is padding for this input size. Keep or remove padding only according to the transport format’s documented rules.'),
e('Reject an invalid character explicitly',`import base64
import binascii
try:
    base64.b64decode("@@@", validate=True)
except binascii.Error:
    print("invalid Base64")
print(base64.b64decode("YQ==", validate=True))`,`invalid Base64
b'a'`,'Strict validation rejects the at-sign characters instead of treating them as ignorable material around the encoded content.','A valid encoded value decodes to bytes. Converting those bytes into text requires a separate encoding decision when the application expects text.')),
l(178,'How do urllib.parse helpers separate URL structure from query encoding?','URL parsing & query parameters','Python toolkit',
'urllib.parse separates URLs into structural components and encodes query parameters using defined escaping rules. urlsplit identifies scheme, network location, path, query, and fragment; urlencode builds query text from values. Parsing is structural processing, not a guarantee that a URL is safe, reachable, or appropriate for an application.',
'Use these helpers rather than concatenating unescaped parameter strings. Preserve repeated query parameters when the endpoint defines them, and validate allowed schemes and destinations separately.',
'urljoin can let an absolute second URL replace the base host. Do not treat it as a security boundary for untrusted path input.',
'Parse URLs into components and encode parameters with a query encoder. Structural parsing does not validate trust or constrain the destination.',
e('Build and parse query values',`from urllib.parse import urlencode, parse_qs
query = urlencode({"q": "python tips", "tag": ["a", "b"]}, doseq=True)
print(query)
print(parse_qs(query))`,`q=python+tips&tag=a&tag=b
{'q': ['python tips'], 'tag': ['a', 'b']}`,'urlencode escapes the space and expands the tag sequence because doseq is enabled. Repeated keys remain separate query entries.','parse_qs returns lists of values for each key, preserving the possibility that a parameter appears more than once.'),
e('Separate structural URL components',`from urllib.parse import urlsplit
parts = urlsplit("https://example.com:8443/docs?q=py#intro")
print(parts.scheme, parts.hostname, parts.port)
print(parts.path, parts.query, parts.fragment)`,`https example.com 8443
/docs q=py intro`,'urlsplit identifies components without making a network request. hostname and port are convenient interpretations of the network location.','The query and fragment remain text components. Application-specific validation is still required before using a parsed URL as a request target.'),
e('Understand how joining resolves targets',`from urllib.parse import urljoin
base = "https://example.com/docs/page"
print(urljoin(base, "../help"))
print(urljoin(base, "https://other.example/path"))`,`https://example.com/help
https://other.example/path`,'The relative path is resolved against the base URL’s directory, with the parent segment moving up one path level.','An absolute second URL supplies its own scheme and host. Validate or constrain untrusted targets rather than assuming the base host will always be retained.')),
l(179,'How do statistics helpers distinguish central tendency and spread?','Descriptive statistics in Python','Python toolkit',
'statistics provides basic numerical summaries such as mean, median, multimode, and measures of variance. Mean uses all values arithmetically, while median selects the middle of the ordered data. pvariance treats the input as the population; variance estimates population variance from a sample using a different denominator.',
'Use these functions for small descriptive summaries when their definitions match the data and question. Check missing values, units, outliers, and whether the data represents a sample or a whole population.',
'A mean can hide skew and outliers. Sample variance needs at least two values, and numerical summaries do not by themselves justify causal or statistical conclusions.',
'Choose a summary by its definition: mean averages, median finds the center, and sample and population variance use different assumptions.',
e('Compare mean with median',`from statistics import mean, median
values = [1, 2, 3, 100]
print(mean(values))
print(median(values))`,`26.5
2.5`,'The mean sums all four values and divides by four, so the unusually large final value strongly affects it.','The median averages the two central ordered values because the input has an even number of members. It answers a different question about the distribution.'),
e('Choose population or sample variance',`from statistics import pvariance, variance
values = [1, 2, 3]
print(pvariance(values))
print(variance(values))`,`0.6666666666666666
1`,'The squared deviations sum to two. Population variance divides by three because these values are treated as the entire population.','Sample variance divides by two for the sample estimate. Selecting the function should follow the intended interpretation rather than whichever result looks preferable.'),
e('Preserve more than one mode',`from statistics import multimode, StatisticsError, mean
print(multimode(["a", "b", "a", "b", "c"]))
try:
    mean([])
except StatisticsError:
    print("no values to summarize")`,`['a', 'b']
no values to summarize`,'Both a and b appear twice, so multimode retains both equally frequent modes in their first-encountered order.','An empty dataset has no arithmetic mean. Catching the documented exception lets the application distinguish missing data from a numerical result such as zero.'))
].map(lesson=>({...lesson,batch:'latest-36',body:lesson.body.replace(/(__[a-z_]+__)/g,'`$1`')}));
