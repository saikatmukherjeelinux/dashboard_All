const {lesson:l,e}=require('./helpers.cjs');
module.exports=[
l(192,'How does tomllib read TOML configuration into Python values?','TOML configuration with tomllib','Python toolkit',
'tomllib parses TOML configuration into dictionaries and native Python values. Tables become nested mappings, arrays become lists, and supported scalar types include strings, booleans, integers, floats, and date/time values. loads accepts text, while load expects a binary file object. The standard-library module reads TOML but does not write it.',
'Use TOML for structured human-edited configuration and inspect pyproject.toml with the same parser. Validate the resulting keys and domain constraints after parsing succeeds.',
'Successful parsing establishes TOML syntax, not the validity of application settings. Open files in binary mode for load, and do not assume tomllib provides a dump function.',
'tomllib reads TOML into Python values. Parse first, then validate your application’s required settings; use binary files with load.',
e('Parse tables and typed values',`import tomllib
config = tomllib.loads('[app]\\nname = "Lab"\\nworkers = 3\\ndebug = false\\n')
print(config["app"]["name"])
print(config["app"]["workers"] + 1)
print(config["app"]["debug"])`,`Lab
4
False`,'The app table becomes a nested dictionary. The integer and boolean are converted to their corresponding Python types rather than left as strings.','Application code can use those parsed types directly, but should still verify that worker counts and other values satisfy its own constraints.'),
e('Load a binary stream',`import tomllib
from io import BytesIO
stream = BytesIO(b'tags = ["python", "practice"]\\n[limits]\\nretries = 2\\n')
config = tomllib.load(stream)
print(config["tags"])
print(config["limits"]["retries"])`,`['python', 'practice']
2`,'load receives a binary stream and handles the TOML text encoding. A real configuration file would similarly be opened with mode rb.','The tags array and limits table remain separate structured values, avoiding the need to manually split strings to reconstruct lists or nested settings.'),
e('Catch invalid TOML syntax',`import tomllib
try:
    tomllib.loads("count = [1, 2")
except tomllib.TOMLDecodeError:
    print("invalid TOML")
print(tomllib.loads("count = 0")["count"])`,`invalid TOML
0`,'The unfinished array violates TOML syntax, so the parser raises TOMLDecodeError before returning a configuration dictionary.','The second document is syntactically valid even though an application might reject a zero count. Syntax validation and domain validation are separate steps.')),
l(193,'How does ipaddress validate addresses and reason about networks?','IP addresses & network membership','Python toolkit',
'ipaddress provides value objects for IPv4 and IPv6 addresses, interfaces, and networks. Factories parse text into the appropriate address family. Network objects support address membership, prefix information, and iteration helpers. They reason about numeric addresses without contacting a network or resolving hostnames.',
'Use these objects to validate address syntax and compare network ranges. Treat address parsing as one step in a larger networking policy rather than evidence that a destination is reachable or trusted.',
'ip_network normally rejects host bits in a strict network specification. Use strict=False only when intentionally normalizing an address to its containing network, and define policies for both IPv4 and IPv6.',
'ipaddress turns address text into structured numeric values. Network membership is a local calculation, not a connectivity test.',
e('Check address family and membership',`from ipaddress import ip_address, ip_network
address = ip_address("192.0.2.10")
network = ip_network("192.0.2.0/24")
print(address.version)
print(address in network)
print(ip_address("192.0.3.1") in network)`,`4
True
False`,'The parsed address is IPv4. Comparing it with a network checks whether its numeric value falls within that network’s prefix range.','The checks make no network requests. The final address is outside the selected /24 prefix even though much of its text looks similar.'),
e('Normalize an interface address intentionally',`from ipaddress import ip_network, ip_interface
network = ip_network("192.0.2.17/24", strict=False)
interface = ip_interface("192.0.2.17/24")
print(network)
print(interface.ip)
print(interface.network)`,`192.0.2.0/24
192.0.2.17
192.0.2.0/24`,'With strict=False, host bits are masked out to produce the containing network. The original host address is not retained in the network object.','An interface object preserves both the host address and its network. Choose the object type that represents the information the application needs.'),
e('Inspect a small network and invalid input',`from ipaddress import ip_network, ip_address
network = ip_network("192.0.2.0/30")
print([str(address) for address in network.hosts()])
try:
    ip_address("999.1.2.3")
except ValueError:
    print("invalid address")`,`['192.0.2.1', '192.0.2.2']
invalid address`,'For this ordinary IPv4 /30 network, hosts excludes its network and broadcast addresses, leaving two usable host addresses.','The invalid octet is rejected during parsing. Avoid materializing every host of a very large network simply to test membership or inspect its size.')),
l(194,'How do fnmatch patterns differ from regular expressions and filesystem searches?','Filename patterns with fnmatch','Python toolkit',
'fnmatch compares strings with shell-style patterns: * matches any sequence, ? matches one character, and bracket expressions select characters. fnmatchcase applies case-sensitive matching without platform case normalization. The functions match supplied names rather than walking a filesystem, and path separators do not have the special traversal role they have in glob.',
'Use fnmatch for filtering a list of names or applying a simple wildcard policy. Use glob or Path.glob when you actually need filesystem traversal.',
'A wildcard pattern is not a regular expression. Choose fnmatchcase for consistent case-sensitive behavior across platforms, and do not assume a filename pattern validates a safe filesystem destination.',
'fnmatch applies simple wildcards to strings you already have. fnmatchcase makes case sensitivity explicit; filesystem discovery is a separate task.',
e('Match extensions consistently',`from fnmatch import fnmatchcase
names = ["a.py", "b.txt", "C.PY", "test.py"]
print([name for name in names if fnmatchcase(name, "*.py")])`,`['a.py', 'test.py']`,'The star permits any leading sequence, but the literal extension must match case exactly because fnmatchcase is used.','This filters an existing list rather than finding files on disk. The mixed-case C.PY name is intentionally excluded by this policy.'),
e('Select a single digit position',`from fnmatch import fnmatchcase
names = ["log1.txt", "log9.txt", "log12.txt", "logA.txt"]
print([name for name in names if fnmatchcase(name, "log[0-9].txt")])
print(fnmatchcase("ab", "a?"))`,`['log1.txt', 'log9.txt']
True`,'The bracket range matches exactly one digit, so the two-digit name and the letter name do not satisfy the full pattern.','The question mark also matches exactly one character. It is not the regex optional-quantifier syntax, so wildcard and regex patterns should not be interchanged.'),
e('Understand slash handling',`from fnmatch import fnmatchcase
print(fnmatchcase("docs/a.txt", "*.txt"))
print(fnmatchcase(".hidden", "*"))
print(fnmatchcase("notes.md", "*.txt"))`,`True
True
False`,'fnmatch treats the slash as an ordinary character for matching, so the star can include the directory-like prefix in this string.','Leading dots also match normally. Filesystem glob tools can apply different traversal and hidden-name rules, so select the helper whose semantics match the task.')),
l(195,'How do itertools product, permutations, and combinations count different selections?','Combinatorial iterators','Iteration',
'itertools.product enumerates Cartesian products, permutations enumerates ordered selections without reusing an input position, and combinations enumerates selections in input order without reusing positions. combinations_with_replacement allows a position to be selected again. These tools yield results incrementally, but consume and retain finite input pools.',
'Use them for test cases, small search spaces, and candidate generation when the selection rules are clear. Estimate the output count before exploring a large space.',
'These functions distinguish input positions rather than deduplicating equal input values. Lazy output does not prevent a combinatorial explosion or make an infinite input pool suitable.',
'Choose whether order matters and whether reuse is allowed. Combinatorial iterators generate candidates lazily, but their total number can still be huge.',
e('Build a Cartesian product',`from itertools import product
print(list(product(["A", "B"], [1, 2])))
print(list(product([0, 1], repeat=2)))`,`[('A', 1), ('A', 2), ('B', 1), ('B', 2)]
[(0, 0), (0, 1), (1, 0), (1, 1)]`,'product pairs every element of the first pool with every element of the second. The rightmost pool advances fastest.','repeat=2 uses the same pool in two independent positions, allowing repeated values such as the pair 1, 1.'),
e('Compare ordered and unordered selections',`from itertools import permutations, combinations
print(list(permutations("ABC", 2)))
print(list(combinations("ABC", 2)))`,`[('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('C', 'A'), ('C', 'B')]
[('A', 'B'), ('A', 'C'), ('B', 'C')]`,'Permutations include both A,B and B,A because changing selection order produces a different ordered result.','Combinations preserve the input position order and choose each pair once. They do not sort the input values to establish that order.'),
e('Allow replacement and inspect repeated inputs',`from itertools import combinations, combinations_with_replacement
print(list(combinations_with_replacement("AB", 2)))
print(list(combinations("AAB", 2)))`,`[('A', 'A'), ('A', 'B'), ('B', 'B')]
[('A', 'A'), ('A', 'B'), ('A', 'B')]`,'Allowing replacement permits selecting the same pool position more than once, which creates the A,A and B,B results.','The two A positions in the second input remain distinct positions. That is why the displayed A,B value pair occurs twice rather than being deduplicated.')),
l(196,'What does pickle preserve when serializing trusted Python object graphs?','Pickle & trusted object graphs','Python toolkit',
'pickle serializes supported Python objects into a Python-specific binary representation and reconstructs them on loading. It can preserve shared references and cycles within a serialized object graph. It is not a safe parser for untrusted input: unpickling can execute arbitrary code. Use a safer data format such as JSON for simple untrusted interchange.',
'Use pickle only when the data and its provenance are trusted and the Python-specific representation is appropriate. Plan for importable class definitions and compatibility when storing custom instances across program versions.',
'Never load a pickle received from an untrusted party. Pickle bytes are not encrypted, and successful serialization does not guarantee compatibility with every Python version or future class definition.',
'Pickle can preserve a Python object graph, including sharing and cycles. Only unpickle trusted data; it is neither a secure interchange parser nor encryption.',
e('Round-trip built-in data',`import pickle
original = {"name": "Lab", "scores": [2, 4]}
payload = pickle.dumps(original)
restored = pickle.loads(payload)
print(restored == original)
print(restored is original)
print(isinstance(payload, bytes))`,`True
False
True`,'The payload is created locally from trusted data and then loaded immediately. The reconstructed mapping compares equal but is a different object.','Printing only stable properties avoids depending on a particular protocol’s byte layout. A serialized representation is a data format, not a security boundary.'),
e('Preserve a shared nested reference',`import pickle
shared = [1]
original = [shared, shared]
restored = pickle.loads(pickle.dumps(original))
restored[0].append(2)
print(restored)
print(restored[0] is restored[1])
print(shared)`,`[[1, 2], [1, 2]]
True
[1]`,'Pickle records the repeated reference within the graph, so both restored outer positions refer to the same reconstructed inner list.','The restored graph is separate from the original graph. Mutating its shared inner list does not change the original shared list.'),
e('Preserve a cycle in trusted data',`import pickle
original = []
original.append(original)
restored = pickle.loads(pickle.dumps(original))
print(restored[0] is restored)
print(restored is original)`,`True
False`,'The graph contains a reference back to its own root. Pickle’s graph tracking reconstructs that relationship without expanding it forever.','The new root is distinct from the original root, even though the same cyclic shape is preserved. No externally supplied pickle is loaded in this example.')),
l(197,'How does total_ordering derive comparisons from equality and one ordering method?','Derived comparisons with total_ordering','Classes & design',
'functools.total_ordering supplies missing rich comparison methods when a class defines equality and at least one of less-than, less-than-or-equal, greater-than, or greater-than-or-equal. It reduces repetitive code but relies on the supplied methods expressing a consistent ordering. Unsupported operand types should normally return NotImplemented.',
'Use it for small value classes where one ordering key defines a clear total order. Implement all methods explicitly if profiling shows the derived methods or stack traces are a meaningful cost.',
'The decorator does not make an inconsistent comparison rule mathematically valid. Defining equality also affects default hashability, so review the hash contract before using such objects as dictionary keys.',
'total_ordering derives missing comparisons from your existing rules. Define consistent equality and ordering, and return NotImplemented for unsupported types.',
e('Derive comparison operators for a value class',`from functools import total_ordering
@total_ordering
class Score:
    def __init__(self, value):
        self.value = value
    def __eq__(self, other):
        if not isinstance(other, Score):
            return NotImplemented
        return self.value == other.value
    def __lt__(self, other):
        if not isinstance(other, Score):
            return NotImplemented
        return self.value < other.value
print(Score(2) <= Score(2))
print(Score(3) > Score(2))
print(Score(1) >= Score(4))`,`True
True
False`,'The class provides equality and less-than directly. The decorator derives the missing operators using those supplied comparisons.','Every comparison uses the same numeric field, so the derived operators have a consistent interpretation across instances of this class.'),
e('Sort by a compound ordering key',`from functools import total_ordering
@total_ordering
class Entry:
    def __init__(self, priority, name):
        self.key = (priority, name)
    def __eq__(self, other):
        if not isinstance(other, Entry):
            return NotImplemented
        return self.key == other.key
    def __lt__(self, other):
        if not isinstance(other, Entry):
            return NotImplemented
        return self.key < other.key
items = [Entry(2, "b"), Entry(1, "z"), Entry(2, "a")]
print([item.key for item in sorted(items)])`,`[(1, 'z'), (2, 'a'), (2, 'b')]`,'The tuple key compares priority first and name second, giving a deterministic tie-breaker when two entries share a priority.','sorted uses the class’s less-than rule. total_ordering is useful for the other rich comparisons but does not replace the need to design that rule.'),
e('Handle unrelated operand types',`from functools import total_ordering
@total_ordering
class Rank:
    def __init__(self, value):
        self.value = value
    def __eq__(self, other):
        if not isinstance(other, Rank):
            return NotImplemented
        return self.value == other.value
    def __lt__(self, other):
        if not isinstance(other, Rank):
            return NotImplemented
        return self.value < other.value
print(Rank(1) == 1)
try:
    print(Rank(1) < 1)
except TypeError:
    print("unsupported ordering")`,`False
unsupported ordering`,'Returning NotImplemented lets Python try the other operand’s comparison behavior. Unsupported equality ultimately produces False here.','Ordering unrelated types has no valid implementation in this example, so Python raises TypeError rather than guessing an arbitrary ordering.')),
l(198,'Why can UserDict be easier to customize than subclassing dict directly?','Custom mappings with UserDict','Classes & design',
'collections.UserDict is a mutable mapping wrapper whose underlying dictionary is exposed as data. Its mapping operations are designed to work through overridable methods, making policies such as key normalization or assignment validation easier to express than relying on every built-in dict operation to call an overridden special method.',
'Use UserDict when building an application mapping with a consistent normalization or validation policy. Define all relevant access paths so lookups, writes, deletions, and membership agree.',
'The data attribute is still directly accessible and can bypass your methods. A convenience wrapper is not a security boundary, and normalizing only writes does not automatically normalize every read.',
'UserDict wraps a dictionary with customizable mapping methods. Keep the key policy consistent across operations, and remember that direct access to data can bypass it.',
e('Normalize keys consistently',`from collections import UserDict
class LowerKeys(UserDict):
    def __setitem__(self, key, value):
        self.data[key.lower()] = value
    def __getitem__(self, key):
        return self.data[key.lower()]
    def __delitem__(self, key):
        del self.data[key.lower()]
    def __contains__(self, key):
        return key.lower() in self.data
settings = LowerKeys({"MODE": "safe"})
settings.update({"LEVEL": 2})
print(settings["Mode"])
print("level" in settings)
print(sorted(settings))`,`safe
True
['level', 'mode']`,'Initialization and update route assignments through the custom setter. Stored keys use lowercase, while the getter and membership method normalize requests.','Deletion is normalized as well, keeping this string-key mapping’s access policy consistent. Supporting arbitrary key types would require a different contract.'),
e('Validate values on assignment and update',`from collections import UserDict
class NonNegative(UserDict):
    def __setitem__(self, key, value):
        if value < 0:
            raise ValueError("negative value")
        self.data[key] = value
counts = NonNegative({"a": 2})
try:
    counts.update({"b": -1})
except ValueError as error:
    print(error)
print(dict(counts))`,`negative value
{'a': 2}`,'The update attempts to assign b through the custom setter. Validation raises before that individual value is stored in the underlying dictionary.','A multi-entry update is not automatically transactional: earlier successful assignments can remain if a later entry fails. Validate all inputs first when atomic updates are required.'),
e('Distinguish a wrapper policy from a boundary',`from collections import UserDict
class Positive(UserDict):
    def __setitem__(self, key, value):
        if value <= 0:
            raise ValueError("must be positive")
        self.data[key] = value
values = Positive({"ok": 1})
values.data["bypass"] = -3
print(values["bypass"])
print(len(values))`,`-3
2`,'Writing directly to data uses the underlying dictionary, bypassing the wrapper’s custom assignment method and its validation.','The example makes the limitation visible rather than recommending the bypass. Keep ownership and interfaces explicit when callers must respect a policy.')),
l(199,'How does calendar handle leap years and month layouts without manual date arithmetic?','Calendar calculations & month grids','Python toolkit',
'calendar offers helpers for leap-year rules, month lengths, weekdays, and month grids. monthrange returns the weekday of the first day and the number of days in the month, with Monday numbered zero. Calendar objects can customize the first day of each displayed week. Zero entries in month-day grids represent padding outside the selected month.',
'Use calendar for date-picker layouts, monthly reports, and Gregorian calendar calculations. Use datetime when representing a specific date or a timezone-aware instant.',
'Weekday numbering and padding conventions must be read carefully. A calendar grid is a layout of dates, not a timezone conversion or a statement that all months contain the same number of weeks.',
'calendar supplies Gregorian month rules and display grids. Check weekday numbering, first-weekday settings, and zero padding when building a monthly view.',
e('Apply Gregorian leap-year rules',`import calendar
print(calendar.isleap(2000))
print(calendar.isleap(1900))
print(calendar.isleap(2024))`,`True
False
True`,'Years divisible by four are normally leap years, but century years must also be divisible by four hundred. The year 2000 qualifies while 1900 does not.','The helper applies these rules directly, avoiding an incomplete manual test that would incorrectly classify every year divisible by four.'),
e('Inspect a month boundary',`import calendar
first_weekday, days = calendar.monthrange(2024, 2)
print(first_weekday)
print(first_weekday == calendar.THURSDAY)
print(days)`,`3
True
29`,'The first day of February 2024 is weekday index 3 because Monday is index 0. The explicit comparison confirms that index 3 denotes Thursday.','The month contains 29 days because 2024 is a leap year. The weekday index and day count are separate parts of the returned pair.'),
e('Choose the start of a calendar week',`import calendar
monday = calendar.Calendar(firstweekday=calendar.MONDAY)
sunday = calendar.Calendar(firstweekday=calendar.SUNDAY)
print(monday.monthdayscalendar(2024, 2)[0])
print(sunday.monthdayscalendar(2024, 2)[0])`,`[0, 0, 0, 1, 2, 3, 4]
[0, 0, 0, 0, 1, 2, 3]`,'The month begins on Thursday, so a Monday-first row needs three leading padding cells before day 1.','A Sunday-first row needs four leading padding cells. Zero means a cell outside the selected month, not an actual day numbered zero.')),
l(200,'How does ElementTree read and construct a small XML document?','XML trees with ElementTree','Python toolkit',
'xml.etree.ElementTree represents XML elements as objects with tags, attributes, text, and child elements. fromstring parses an XML string, find and findall select elements using supported paths, and tostring serializes a tree. Namespace-qualified names use expanded notation with the namespace URI inside braces.',
'Use ElementTree for small structured XML documents when its supported features fit the format. Treat external XML as potentially hostile and apply appropriate parser and resource protections for that input source.',
'ElementTree is not a full XPath engine. Also, a parsed tree is not a guarantee of schema validity, and application code should test an element against None when checking whether a lookup found anything.',
'ElementTree turns XML into nested elements. Read tags, attributes, and text explicitly, and use namespace-aware names for namespaced documents.',
e('Read an element and its attribute',`from xml.etree import ElementTree as ET
root = ET.fromstring('<library><book id="7">Python</book></library>')
book = root.find("book")
if book is not None:
    print(book.get("id"))
    print(book.text)
print(root.find("missing") is None)`,`7
Python
True`,'find returns the matching element or None. The explicit identity check distinguishes a missing element from an element that happens to have no children.','Attributes are accessed separately from text. XML parsing establishes structure, while application rules decide whether an id or text value is acceptable.'),
e('Construct and escape text content',`from xml.etree import ElementTree as ET
root = ET.Element("note")
child = ET.SubElement(root, "text", language="en")
child.text = "A & B < C"
serialized = ET.tostring(root, encoding="unicode")
print(serialized)
print(ET.fromstring(serialized).findtext("text"))`,`<note><text language="en">A &amp; B &lt; C</text></note>
A & B < C`,'Serializing the tree escapes reserved XML characters in the text content. Those escapes preserve the intended characters without creating markup.','Parsing the serialized tree restores the original text value. Use tree construction rather than string concatenation when inserting ordinary text into XML.'),
e('Look up a namespace-qualified element',`from xml.etree import ElementTree as ET
root = ET.fromstring('<root xmlns="urn:lab"><item>one</item><item>two</item></root>')
print(root.find("item") is None)
print([item.text for item in root.findall("p:item", {"p": "urn:lab"})])`,`True
['one', 'two']`,'The default XML namespace applies to each item, so the unqualified lookup does not match those namespace-qualified names.','The lookup prefix is a local alias for the namespace URI. It does not need to reproduce a prefix used in the original document.')),
l(201,'How do HTML escaping and HTMLParser differ when handling text and markup?','HTML escaping & parsing','Python toolkit',
'html.escape converts reserved characters in text to HTML character references, with optional quote escaping. html.unescape performs character-reference decoding. HTMLParser consumes HTML-like markup and sends events to handler methods for tags and text. Neither unescape nor a basic parser is an HTML sanitizer.',
'Escape ordinary text before inserting it into an HTML text context, and use a proper context-aware template system for complete pages. Use HTMLParser for controlled extraction from markup when its event model is sufficient.',
'HTML escaping is not a universal encoding for JavaScript, CSS, or URL contexts. Parsing or removing a few tags does not establish that untrusted markup is safe to render.',
'Escape text when inserting it into HTML; parse markup when extracting structure. Decoding references and parsing tags do not sanitize untrusted HTML.',
e('Escape text and decode character references',`from html import escape, unescape
text = '<b title="x">A & B</b>'
encoded = escape(text)
print(encoded)
print(unescape(encoded) == text)`,`&lt;b title=&quot;x&quot;&gt;A &amp; B&lt;/b&gt;
True`,'escape replaces the angle brackets, ampersand, and quotes so the supplied value can be represented as text rather than interpreted as those tags.','unescape reverses the character references for this value. Decoding is not sanitization and can restore markup characters that need escaping before later rendering.'),
e('Collect text events from markup',`from html.parser import HTMLParser
class TextCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
    def handle_data(self, data):
        self.parts.append(data)
parser = TextCollector()
parser.feed("<p>Hello <b>Python</b> &amp; friends</p>")
parser.close()
print("".join(parser.parts))`,`Hello Python & friends`,'The parser sends ordinary text segments to handle_data and decodes supported character references under its default behavior.','Joining the segments extracts this document’s text. The handler does not preserve layout or implement a browser’s complete rendering rules.'),
e('Inspect a tag attribute as data',`from html.parser import HTMLParser
class LinkCollector(HTMLParser):
    def handle_starttag(self, tag, attrs):
        if tag == "a":
            print(dict(attrs).get("href"))
parser = LinkCollector()
parser.feed('<a href="/search?q=py&amp;page=2">Search</a>')
parser.close()`,`/search?q=py&page=2`,'The handler receives a tag name and attribute pairs. The encoded ampersand is decoded in the resulting href value.','Extracting a URL does not validate its scheme, host, or intended use. Apply separate URL and destination rules before treating extracted links as trusted.'))
].map(lesson=>({...lesson,batch:'latest-10',body:lesson.body.replace(/(__[a-z_]+__)/g,'`$1`')}));
