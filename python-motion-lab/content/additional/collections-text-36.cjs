const {lesson:l,e}=require('./helpers.cjs');
module.exports=[
l(156,'How do slicing, negative indices, and extended slice assignment work?','Slicing & extended assignment','Python toolkit',
'A slice selects positions using start, stop, and step. The stop is excluded, omitted boundaries depend on the step direction, and negative indices count from the end. Slicing a list creates a new outer list, while slice assignment changes an existing list. Extended slice assignment with a non-unit step requires the replacement to contain exactly as many elements as the selected positions.',
'Use slices for subsequences, reversing a sequence, and replacing contiguous or regularly spaced positions. Keep complex index arithmetic in named variables so the intended range is easy to inspect.',
'A list slice is shallow: nested objects can remain shared. A negative step also changes the default boundaries; a zero step raises ValueError.',
'A slice chooses positions with an excluded stop. Reading copies a list’s outer container; assigning to a slice updates the existing list.',
e('Select and reverse positions',`values = [10, 20, 30, 40, 50]
print(values[1:4:2])
print(values[-2:])
print(values[::-1])`,`[20, 40]
[40, 50]
[50, 40, 30, 20, 10]`,'The first slice visits indices 1 and 3, stopping before index 4. Negative indices locate the final two elements.','A step of -1 traverses from the final element toward the beginning because both explicit boundaries are omitted.'),
e('Replace a contiguous slice',`values = [1, 2, 3, 4]
alias = values
values[1:3] = [8, 9, 10]
print(values)
print(alias is values)`,`[1, 8, 9, 10, 4]
True`,'A contiguous replacement can change the length: two selected positions are replaced with three new elements.','Slice assignment mutates the existing list. The alias still references that same list and observes its updated contents.'),
e('Match an extended slice length',`values = [0, 1, 2, 3, 4, 5]
values[::2] = [10, 20, 30]
print(values)
try:
    values[::2] = [99]
except ValueError:
    print("length mismatch")`,`[10, 1, 20, 3, 30, 5]
length mismatch`,'The extended slice selects indices 0, 2, and 4. The three replacements occupy exactly those existing positions.','A single replacement cannot fill the three selected positions, so the second extended assignment raises ValueError.')),
l(157,'What makes range a compact reusable sequence rather than a generator?','Range objects & arithmetic sequences','Iteration',
'range represents an arithmetic sequence with a start, excluded stop, and nonzero step. It stores the sequence parameters instead of materializing every integer. A range supports iteration, indexing, slicing, and membership tests, and can be iterated again because it is a sequence rather than a one-shot iterator.',
'Use range for integer-indexed loops and compact arithmetic progressions. Materialize a list only when you need a mutable container of all the values.',
'The stop is excluded, and a step pointing away from the stop produces an empty range. range arguments describe integers, not arbitrary floating-point intervals.',
'range stores the rule for an integer sequence. It is compact, reusable, and excludes the stop value.',
e('Include a descending step',`numbers = range(8, 1, -2)
print(list(numbers))
print(numbers[1])
print(2 in numbers)`,`[8, 6, 4, 2]
6
True`,'The negative step subtracts two at each position, and 2 is included because the stop is 1 rather than 2.','Indexing and membership operate on the range sequence directly; creating a list is only needed here to display all elements.'),
e('Iterate a range twice',`numbers = range(1, 4)
print(sum(numbers))
print(list(numbers))
print(list(numbers[1:]))`,`6
[1, 2, 3]
[2, 3]`,'sum consumes an iterator obtained from the range, not the range object itself. Another iteration still starts at its first element.','Slicing a range returns another range that describes the selected arithmetic progression without requiring an intermediate list.'),
e('Describe a very large sequence',`numbers = range(0, 1_000_000, 5)
print(len(numbers))
print(numbers[-1])
print(list(range(5, 1)))`,`200000
999995
[]`,'There are 200,000 multiples of five from zero up to but excluding one million. The last is five below that stop.','The second range has a positive default step but a smaller stop, so it describes an empty sequence rather than counting backward.')),
l(158,'How do dictionary views and insertion order behave during updates?','Dictionary views & insertion order','Python toolkit',
'Dictionary keys, values, and items return view objects that reflect later changes to the dictionary. Dictionaries preserve insertion order. Updating an existing key keeps its position; deleting it and inserting it again places it at the end. A list constructed from a view is a separate snapshot of its elements at that time.',
'Use views to inspect current mappings without copying all entries. Use a snapshot when you need stable traversal while adding or deleting keys.',
'Adding or deleting keys while directly iterating a dictionary can raise RuntimeError. A view is not an immutable snapshot, even when stored in another variable.',
'Dictionary views stay connected to the mapping. Existing-key updates preserve order; a deleted and reinserted key moves to the end.',
e('Observe a live keys view',`data = {"red": 1}
view = data.keys()
snapshot = list(view)
data["blue"] = 2
print(list(view))
print(snapshot)`,`['red', 'blue']
['red']`,'The view reads current keys, so it includes blue after insertion. The earlier list keeps only the keys copied into it.','Both variables are valid ways to inspect keys, but choose a view for current state and a list when a stable snapshot is intended.'),
e('Update and reinsert keys',`data = {"a": 1, "b": 2, "c": 3}
data["b"] = 20
print(list(data))
del data["a"]
data["a"] = 10
print(list(data))`,`['a', 'b', 'c']
['b', 'c', 'a']`,'Changing the value for b leaves its insertion position intact. Dictionary ordering is not a sort by key or by value.','Deleting a removes that entry. Inserting a new entry for a afterward places it at the end of the remaining insertion order.'),
e('Delete safely using a snapshot',`data = {"a": 0, "b": 2, "c": 0}
for key in list(data):
    if data[key] == 0:
        del data[key]
print(data)`,`{'b': 2}`,'list(data) copies the keys before the loop begins, so deleting dictionary entries does not resize the object being iterated.','The loop still reads each current value from data. Snapshotting the keys is sufficient here because the goal is controlled deletion.')),
l(159,'How do set union, intersection, difference, and symmetric difference compare?','Set algebra & membership','Python toolkit',
'A set stores unique hashable elements. Union keeps elements from either operand, intersection keeps those shared by both, difference removes members of the right operand, and symmetric difference keeps elements found in exactly one operand. Set comparisons can express subset and superset relationships.',
'Use set algebra to compare permissions, remove duplicate identifiers, and find missing or overlapping records. Sort a set when presentation needs deterministic order.',
'A set is unordered and cannot preserve duplicate counts. Difference is directional: a - b is generally different from b - a.',
'Sets answer membership questions. Union combines, intersection overlaps, difference subtracts, and symmetric difference keeps non-overlapping members.',
e('Compare two collections',`a = {1, 2, 3}
b = {3, 4}
print(sorted(a | b))
print(sorted(a & b))
print(sorted(a ^ b))`,`[1, 2, 3, 4]
[3]
[1, 2, 4]`,'Union includes each distinct member once, while intersection includes only 3 because it occurs in both sets.','Symmetric difference excludes shared elements. Sorting is used solely to make the displayed list order predictable.'),
e('Find missing permissions',`required = {"read", "write"}
granted = {"read", "audit"}
print(sorted(required - granted))
print(required <= granted)
print({"read"} < required)`,`['write']
False
True`,'Subtracting granted from required identifies required permissions that are missing. The direction of subtraction matters.','The <= test asks whether all requirements are granted. The strict subset test is true for read because required contains an additional member.'),
e('Compare mutation with a new set',`a = {1, 2}
b = a | {3}
print(sorted(a))
a.update({4})
print(sorted(a))
print(sorted(b))`,`[1, 2]
[1, 2, 4]
[1, 2, 3]`,'The union operator returns a new set and leaves a unchanged. The new set b does not track later mutations to a.','update changes a in place. Choosing a mutating method versus a new result should match who owns and shares the original set.')),
l(160,'Why is str.join useful for building text from many pieces?','Joining text & iterable boundaries','Python toolkit',
'separator.join(parts) combines string elements with a separator between adjacent elements. It accepts an iterable of strings, including a generator, and returns one new string. The separator is not added before the first element or after the last. Non-string elements must be explicitly converted when that conversion is intended.',
'Use join for readable reports, generated lines, and delimited display text. For CSV with quoting rules, use the csv module rather than constructing records by joining fields.',
'join does not automatically stringify integers, and joining a dictionary iterates its keys. An empty iterable produces an empty string.',
'join puts a separator between string pieces. Convert non-strings deliberately and use a format-aware writer when quoting rules matter.',
e('Join ordinary pieces',`parts = ["learn", "practice", "repeat"]
print(" -> ".join(parts))
print(repr(",".join([])))`,`learn -> practice -> repeat
''`,'The separator appears only between neighboring pieces, so three strings produce two arrows and no trailing separator.','With no pieces there is nothing to concatenate. repr makes the resulting empty string visible in the displayed output.'),
e('Convert generated numbers',`numbers = [2, 4, 6]
print(", ".join(str(n) for n in numbers))
print("".join(["Py", "thon"]))`,`2, 4, 6
Python`,'The generator explicitly converts every integer to a string before join consumes it. join itself does not make that conversion.','An empty separator concatenates the pieces directly. The original list and its integer elements are not modified by formatting.'),
e('Handle an invalid element',`try:
    print("-".join(["item", 3]))
except TypeError:
    print("all pieces must be strings")
print("/".join({"home": 1, "docs": 2}))`,`all pieces must be strings
home/docs`,'An integer element violates join’s input contract, so the operation raises TypeError instead of silently formatting that value.','Iterating a dictionary yields its keys in insertion order. Joining a mapping therefore combines its keys unless another iterable is explicitly supplied.')),
l(161,'When should you use split, rsplit, or partition to separate text?','Splitting & partitioning strings','Python toolkit',
'split returns pieces separated by a delimiter, optionally limiting the number of splits. Without an explicit delimiter, it collapses whitespace runs and drops leading and trailing whitespace. partition always returns three strings: text before the first delimiter, the delimiter, and text after it. rsplit and rpartition start from the right.',
'Use partition for a single structured boundary such as a key and value. Use split for multiple fields when the format has no escaping or quoting rules.',
'split() and split(" ") have different empty-field behavior. A missing partition delimiter is represented by empty separator and tail fields, not an exception.',
'split creates a list of pieces. partition always gives a before/separator/after triple, making one optional boundary easy to handle.',
e('Compare whitespace handling',`text = "  a   b  "
print(text.split())
print("a,,b,".split(","))`,`['a', 'b']
['a', '', 'b', '']`,'The default whitespace mode treats adjacent spaces as one separator and discards empty pieces at the boundaries.','An explicit comma separator preserves empty fields, including the trailing empty field after the final comma.'),
e('Partition a configuration value',`key, sep, value = "mode=fast=extra".partition("=")
print(key, sep, value)
print("missing".partition("="))`,`mode = fast=extra
('missing', '', '')`,'partition stops at the first equals sign, leaving the remainder intact as the value even when another equals sign follows.','When the separator is absent, the original text occupies the first result field. The empty separator lets the caller detect that case.'),
e('Split from the right',`path = "folder/archive.tar.gz"
print(path.rsplit(".", 1))
print("a:b:c".split(":", 1))
print("a:b:c".rsplit(":", 1))`,`['folder/archive.tar', 'gz']
['a', 'b:c']
['a:b', 'c']`,'With a maximum of one split, rsplit chooses the rightmost delimiter. This extracts the final extension without splitting the earlier dot.','The left and right variants produce different boundaries when the split count is limited; without a limit their field sequences agree.')),
l(162,'How does the format specification mini-language control numeric display?','Format specifications & alignment','Python toolkit',
'Format specifications describe presentation such as width, alignment, precision, sign, and numeric type. They work in f-strings, format(), and str.format(). The specification is interpreted by the value’s formatting protocol, so the meaning of precision depends on the type and presentation mode. Formatting returns text rather than changing the stored number.',
'Use explicit formatting for aligned tables, percentages, hexadecimal displays, and human-readable numeric reports. Keep numeric values numeric until the presentation boundary.',
'Display rounding is not a change to the original value. A width is generally a minimum rather than a truncation limit, and locale-sensitive formatting needs additional care.',
'A format specification controls how a value is displayed. Width pads, alignment positions, and precision selects the requested representation.',
e('Format a number and a percentage',`value = 12.345
print(f"{value:.2f}")
print(f"{0.25:.1%}")
print(value)`,`12.35
25.0%
12.345`,'Fixed-point precision requests two digits after the decimal. Percent formatting multiplies the displayed value by one hundred and adds a percent sign.','The last print shows that formatting did not mutate value. Calculations should use the original numeric object rather than the formatted text.'),
e('Align fields with a minimum width',`print(f"|{'cat':<6}|")
print(f"|{'cat':^7}|")
print(f"{42:04d}")`,`|cat   |
|  cat  |
0042`,'The alignment markers place text at the left or center of the requested field. Vertical bars make padding spaces visible.','The integer specification uses decimal digits with zero padding to a minimum width of four. Longer values are not automatically truncated.'),
e('Choose integer bases and separators',`print(f"{255:#x}")
print(f"{10:08b}")
print(f"{1234567:,}")`,`0xff
00001010
1,234,567`,'The x type displays hexadecimal, and the # flag includes its prefix. Binary formatting here uses eight zero-padded positions.','The comma option groups decimal digits for display. These outputs are strings, so their visual separators are not part of the underlying integer.')),
l(163,'How do bytes and bytearray differ when editing binary data?','Bytearray & mutable binary data','Memory & objects',
'bytes is an immutable sequence of byte values, while bytearray provides mutable byte storage. Indexing either returns an integer from 0 through 255. bytearray supports element and slice assignment, and bytes(buffer) creates an immutable copy. Text still requires an explicit encoding or decoding step.',
'Use bytearray when assembling or editing binary records in place. Convert to bytes when an API expects immutable data or the result should no longer change.',
'Each assigned element must fit into one byte. A bytearray is not a Unicode string; replacing a character in encoded multibyte text requires understanding the encoding.',
'bytes is fixed binary content; bytearray is editable binary content. Indexing works with integer byte values, not Unicode characters.',
e('Edit one byte and append another',`data = bytearray(b"cat")
data[0] = ord("b")
data.append(ord("!"))
print(data.decode("ascii"))
print(data[0])`,`bat!
98`,'The first assignment replaces byte value 99 with 98. Appending 33 adds an ASCII exclamation mark to the mutable buffer.','Decoding creates text for display, while indexing returns the integer value stored in one byte rather than a one-character string.'),
e('Take an immutable snapshot',`data = bytearray([1, 2, 3])
saved = bytes(data)
data[1:3] = b"XY"
print(list(data))
print(list(saved))`,`[1, 88, 89]
[1, 2, 3]`,'The slice replacement writes the byte values for X and Y into data. Converting each sequence to a list makes the byte numbers explicit.','The immutable bytes object was copied before the mutation, so its contents stay independent of subsequent changes to the bytearray.'),
e('Reject an out-of-range byte',`data = bytearray([10])
try:
    data[0] = 256
except ValueError:
    print("byte must fit in 0..255")
print(list(data))`,`byte must fit in 0..255
[10]`,'A byte stores one of 256 possible values. Assignment outside that range raises ValueError instead of wrapping the number automatically.','The failing element assignment leaves the original byte unchanged. Validate numeric input when building binary data from external values.')),
l(164,'How does ChainMap layer dictionaries without merging copies?','ChainMap & layered configuration','Python toolkit',
'collections.ChainMap searches several mappings in order and returns the first matching binding. It references the original mappings instead of copying all entries. Normal assignment and deletion through the ChainMap target its first mapping, while new_child adds a fresh higher-priority layer.',
'Use ChainMap to express command-line overrides, user settings, and defaults as separate layers. The order of layers states which source wins.',
'A ChainMap is a live view of its mappings, not a merged snapshot. Deleting a key through it only affects the first mapping and can fail if the key exists only in a later layer.',
'ChainMap reads through layers from first to last. Writes target the first layer, so overrides can stay separate from defaults.',
e('Resolve an override before a default',`from collections import ChainMap
defaults = {"color": "blue", "size": 10}
overrides = {"color": "red"}
config = ChainMap(overrides, defaults)
print(config["color"], config["size"])
config["size"] = 20
print(overrides)
print(defaults["size"])`,`red 10
{'color': 'red', 'size': 20}
10`,'color is found in the first mapping, while size initially falls through to defaults. Reads do not merge the underlying dictionaries.','Writing size creates an override in the first dictionary. The fallback default remains unchanged and can still be read independently.'),
e('Create a temporary child layer',`from collections import ChainMap
base = ChainMap({"mode": "safe"})
child = base.new_child({"mode": "fast"})
child["debug"] = True
print(child["mode"], child["debug"])
print(base["mode"])
print("debug" in base)`,`fast True
safe
False`,'new_child places a new mapping before the existing layers. Both its override and its later debug assignment belong to that child layer.','The base mapping has no debug entry and still supplies safe. Child layers make scoped overrides explicit without modifying the parent layer.'),
e('Observe a live fallback update',`from collections import ChainMap
defaults = {"limit": 5}
config = ChainMap({}, defaults)
snapshot = dict(config)
defaults["limit"] = 8
print(config["limit"])
print(snapshot["limit"])`,`8
5`,'ChainMap retains the original defaults dictionary, so later changes are visible when a lookup reaches that layer.','dict(config) materializes a separate mapping at that moment. Choose that snapshot when future changes should not alter the resolved configuration.')),
l(165,'What does MappingProxyType protect, and what does it leave mutable?','Read-only mapping proxies','Memory & objects',
'types.MappingProxyType exposes a read-only view of a mapping. Assignment through the proxy is rejected, but changes made through the original mapping remain visible. The protection is shallow: a mutable value retrieved from the proxy is still the original mutable value.',
'Use a proxy to share mapping contents with code that should not replace or delete entries through that interface. Copy first when a stable snapshot is also required.',
'A proxy does not freeze nested values or prevent the mapping owner from making changes. Read-only access and deep immutability are different contracts.',
'A mapping proxy prevents writes through one interface. It still reflects owner updates, and nested mutable values remain mutable.',
e('Read owner changes through a proxy',`from types import MappingProxyType
data = {"mode": "safe"}
view = MappingProxyType(data)
data["mode"] = "fast"
print(view["mode"])
try:
    view["mode"] = "other"
except TypeError:
    print("read-only interface")`,`fast
read-only interface`,'The owner changes the underlying dictionary successfully, and the proxy lookup returns that new value rather than an old snapshot.','Assignment through the proxy raises TypeError. The protection applies to that access path, not to every reference to the underlying dictionary.'),
e('Recognize shallow protection',`from types import MappingProxyType
data = {"tags": ["python"]}
view = MappingProxyType(data)
view["tags"].append("examples")
print(data["tags"])`,`['python', 'examples']`,'Looking up tags returns the original list. Appending to that list does not replace an entry in the protected mapping.','For a deeply immutable interface, choose immutable nested values or an appropriate conversion rather than relying on a mapping proxy alone.'),
e('Make a detached read-only mapping',`from types import MappingProxyType
original = {"count": 1}
view = MappingProxyType(dict(original))
original["count"] = 9
print(view["count"])
print(original["count"])`,`1
9`,'dict(original) creates a new outer dictionary before the proxy is constructed. Updating the original mapping no longer changes this outer snapshot.','The snapshot is still shallow. This example uses an immutable integer value, so there is no nested mutable object shared between the mappings.')),
l(166,'When is array.array useful compared with a normal Python list?','Typed numeric arrays','Python toolkit',
'array.array stores values using a specified machine-oriented numeric type code. Unlike a general list, its elements must fit that representation. It supports sequence operations and the buffer protocol, making it useful for compact numeric storage and compatible binary interfaces. Type sizes and native byte order can depend on the platform.',
'Use array for homogeneous numeric buffers when the standard library is sufficient. Use struct or an explicitly specified format when interoperating across machines with different byte orders.',
'A type code constrains stored values, and native binary output is not automatically a portable file format. Do not assume every integer type code has the same width everywhere.',
'array holds one numeric representation rather than arbitrary objects. It is useful for compact buffers, but binary portability needs explicit format decisions.',
e('Store and edit signed integers',`from array import array
values = array("i", [1, 2, 3])
values.append(4)
values[0] = -1
print(values.tolist())
print(values.typecode)`,`[-1, 2, 3, 4]
i`,'The i type code selects signed integers, and ordinary sequence updates preserve that homogeneous storage representation.','tolist produces a normal list for display. The type code describes the array storage, while its exact item size should be inspected when relevant.'),
e('Round-trip raw bytes with the same type',`from array import array
source = array("h", [10, 20])
restored = array("h")
restored.frombytes(source.tobytes())
print(restored.tolist())
print(restored.itemsize == source.itemsize)`,`[10, 20]
True`,'The source and destination use the same type code on the same machine, so their native byte representations agree.','This local round trip does not establish a cross-platform format. Portable exchange should state the element width and byte order explicitly.'),
e('Enforce an unsigned byte range',`from array import array
values = array("B", [0, 255])
try:
    values.append(256)
except OverflowError:
    print("outside unsigned byte range")
print(values.tolist())`,`outside unsigned byte range
[0, 255]`,'The B type code stores unsigned byte values. The value 256 cannot fit and is rejected rather than silently truncated.','The unsuccessful append leaves the existing elements unchanged. Type constraints are part of the data structure’s contract, not just a display convention.')),
l(167,'How does struct encode fixed-width binary records with explicit byte order?','Struct & portable binary records','Python toolkit',
'struct translates between Python values and binary records described by a format string. Prefixes such as > and < select big-endian and little-endian layouts with standard sizes. pack creates bytes, unpack decodes a buffer of exactly the required size, and unpack_from can decode a record inside a larger buffer.',
'Use struct for network headers, device messages, and documented binary formats. Specify byte order and field widths to avoid accidental dependence on native alignment.',
'The format must match the data exactly. Native layout can include padding and platform differences, and out-of-range field values raise errors.',
'struct uses a format string as a binary layout contract. State byte order and field widths, then pack and unpack using that same contract.',
e('Encode two unsigned short values',`import struct
data = struct.pack(">HH", 1, 258)
print(data.hex())
print(struct.unpack(">HH", data))`,`00010102
(1, 258)`,'The > prefix requests big-endian standard layout. Each H field occupies two bytes, so 258 becomes the byte sequence 01 02.','unpack with the same format reconstructs a tuple of Python values. The tuple shape follows the number of fields in the format string.'),
e('Read a record from an offset',`import struct
data = b"ID" + struct.pack("<I", 1000)
print(struct.calcsize("<I"))
print(struct.unpack_from("<I", data, 2)[0])`,`4
1000`,'The little-endian I field occupies four standard-size bytes. The leading two marker bytes are not part of that integer.','unpack_from starts decoding at offset 2 without requiring the entire buffer to contain only one record. Offset and available size still need to be valid.'),
e('Reject a truncated record',`import struct
try:
    struct.unpack(">I", b"\\x00\\x01")
except struct.error:
    print("need four bytes")
print(struct.pack("<H", 258).hex())`,`need four bytes
0201`,'An unsigned standard-size integer requires four bytes with I, so a two-byte buffer cannot satisfy the requested layout.','The final H field uses two little-endian bytes, reversing the byte ordering seen for a big-endian representation of the same number.'))
].map(lesson=>({...lesson,batch:'latest-36',body:lesson.body.replace(/(__[a-z_]+__)/g,'`$1`')}));
