const {lesson:l,e}=require('./helpers.cjs');
module.exports=[
l(116,'How does exception chaining preserve the cause of a failure?','Exception chaining','Python toolkit',
'When translating a low-level error into a domain-specific error, raise NewError(...) from original records an explicit cause. The new exception remains what callers catch, while its __cause__ points to the original failure. Python also records implicit exception context when an exception arises during handling. raise ... from None suppresses context display but is not a method of erasing all diagnostic state.',
'Use chaining at abstraction boundaries, such as translating parsing failures into a configuration error. It gives callers a meaningful error while retaining debugging evidence.',
'Replacing an exception with an unrelated generic message can hide the information needed to diagnose it. Avoid catching every exception merely to return a success-like default.',
'Raise a meaningful new error from the original one so the public message and underlying cause both remain available.',
e('Translate a parsing error',`def parse(text):
    try:
        return int(text)
    except ValueError as error:
        raise RuntimeError("Invalid configuration") from error
try:
    parse("bad")
except RuntimeError as error:
    print(error)
    print(type(error.__cause__).__name__)`,`Invalid configuration
ValueError`,'The caller catches RuntimeError at the intended abstraction level. The original ValueError is retained as the explicit cause.','Printing the cause type verifies preservation without making the example depend on a version-specific full traceback layout.'),
e('Observe implicit exception context',`try:
    try:
        int("bad")
    except ValueError:
        raise RuntimeError("conversion failed")
except RuntimeError as error:
    print(error.__cause__ is None)
    print(type(error.__context__).__name__)`,`True
ValueError`,'Raising without from does not set an explicit cause, but Python records the error being handled as the context.','Explicit chaining communicates deliberate translation more clearly. Both mechanisms can preserve useful debugging relationships.'),
e('Suppress context display deliberately',`try:
    try:
        int("bad")
    except ValueError:
        raise RuntimeError("Invalid input") from None
except RuntimeError as error:
    print(error.__suppress_context__)
    print(type(error.__context__).__name__)`,`True
ValueError`,'from None tells normal traceback presentation to suppress the implicit context. It does not remove the __context__ reference itself.','Use suppression when the underlying implementation detail is not useful to the caller, while retaining appropriate internal diagnostics.')),
l(117,'How do try, except, else, and finally divide error-handling responsibilities?','try / except / else / finally','Python toolkit',
'The try suite contains the operation whose failures are being handled. except handles matching exceptions, else runs only when try completes without an exception or control-flow exit, and finally provides cleanup as the construct exits. Keeping successful follow-up work in else reduces the amount of code accidentally covered by a handler. A return in finally can override another return or suppress a pending exception.',
'Use else for follow-up work that should not be mistaken for failure of the guarded operation. Use finally for cleanup that must accompany exit.',
'Returning from finally can hide the real result or error. Keep cleanup straightforward and use context managers for resources with a clear ownership protocol.',
'try attempts, except handles failure, else handles success, and finally cleans up on exit.',
e('Trace a successful operation',`try:
    value = int("7")
except ValueError:
    print("failed")
else:
    print("success", value)
finally:
    print("cleanup")`,`success 7
cleanup`,'The conversion succeeds, so the handler is skipped and else runs. finally runs after the successful branch.','Follow-up code in else is outside the conversion’s ValueError handler, helping prevent unrelated errors from being misclassified.'),
e('Trace a handled failure',`try:
    value = int("bad")
except ValueError:
    print("failed")
else:
    print("success")
finally:
    print("cleanup")`,`failed
cleanup`,'The matching handler runs and else does not. finally still executes as the statement finishes.','A handler for another exception type would not handle this failure. Cleanup does not imply that all errors have been suppressed.'),
e('See why returning from finally is surprising',`def value():
    try:
        return "original"
    finally:
        return "replacement"
print(value())`,`replacement`,'The finally suite executes during the pending return and introduces a different return, replacing the original result.','This is a demonstration of behavior to avoid. Ordinary cleanup should not unexpectedly change the function’s success or failure contract.')),
l(118,'How should you design and raise custom exception classes?','Custom exception design','Classes & design',
'Custom exception classes usually inherit from Exception or a more specific application exception. They give callers a meaningful type to catch without parsing message strings. An exception can retain structured attributes such as a field name or rejected value, while its message gives a readable description. Small hierarchies let callers catch one specific problem or a related family of problems.',
'Use a custom type for a meaningful domain failure that callers should distinguish from ordinary implementation errors. Keep data safe and avoid embedding secrets in messages.',
'Do not inherit ordinary application exceptions directly from BaseException, which also covers control-flow signals such as KeyboardInterrupt. Avoid creating a new type for every wording variation.',
'A custom exception gives an application failure a useful name and structured details that callers can handle reliably.',
e('Catch a domain-specific failure',`class InvalidAge(ValueError):
    pass
def register(age):
    if age < 0:
        raise InvalidAge("Age cannot be negative")
    return "ok"
try:
    register(-1)
except InvalidAge as error:
    print(error)`,`Age cannot be negative`,'InvalidAge remains a ValueError while providing a more specific category. Callers can handle just this domain failure if necessary.','The function explicitly raises the type at the validation boundary, rather than forcing consumers to inspect a generic error message.'),
e('Attach structured context',`class MissingField(Exception):
    def __init__(self, field):
        self.field = field
        super().__init__(f"Missing field: {field}")
try:
    raise MissingField("email")
except MissingField as error:
    print(error.field)
    print(str(error))`,`email
Missing field: email`,'The field attribute lets programmatic handling use structured information. The base initializer also receives a useful display message.','Callers do not need to split or parse the string to recover the missing field name, so message wording can evolve independently.'),
e('Catch a related family of failures',`class AppError(Exception):
    pass
class ValidationError(AppError):
    pass
class StorageError(AppError):
    pass
for error in [ValidationError("bad"), StorageError("offline")]:
    try:
        raise error
    except AppError as caught:
        print(type(caught).__name__)`,`ValidationError
StorageError`,'Both concrete exceptions inherit AppError, so the shared handler can cover the application’s intended error family.','Unrelated bugs remain outside that family. A focused hierarchy avoids an overly broad except Exception that hides programming mistakes.')),
l(119,'What is the difference between EAFP and LBYL error-handling styles?','EAFP vs LBYL','Python toolkit',
'EAFP means attempting an operation and handling an expected failure. LBYL means checking a condition before attempting the operation. Both are useful: direct validation is clear for known input constraints, while EAFP can avoid repeated checks or stale assumptions about an object. A check followed by an action is not automatically atomic when another participant can change the state.',
'Use a narrow try block when a failure is an ordinary possible result of one operation. Use explicit validation when it communicates the contract clearly.',
'Catching a broad exception around too much code can hide unrelated bugs. A preliminary existence check can become invalid before the action in concurrent or external systems.',
'EAFP tries and handles an expected failure. LBYL checks first. Keep either approach narrow and appropriate to the state being checked.',
e('Look before accessing a dictionary key',`data = {"name": "Ada"}
if "city" in data:
    print(data["city"])
else:
    print("unknown")`,`unknown`,'The condition explicitly checks the expected case before the lookup. For this local stable dictionary, that is easy to read.','The code performs a check and an access separately. It should not be generalized into an atomic guarantee for externally changing resources.'),
e('Handle the specific failed operation',`data = {"name": "Ada"}
try:
    city = data["city"]
except KeyError:
    city = "unknown"
print(city)`,`unknown`,'The lookup is attempted directly, and only its expected KeyError is handled. The rest of the program proceeds with an explicit fallback.','Keeping the try suite small avoids confusing a KeyError from unrelated downstream code with a missing city key.'),
e('Use a direct API instead of either verbose pattern',`data = {"name": "Ada", "city": None}
print(data.get("country", "unknown"))
print(data.get("city", "unknown"))`,`unknown
None`,'dict.get expresses an optional lookup directly. Its fallback applies only when the key is absent, not when a present value is None.','Choose the API that matches the semantics. If absence and a stored None must differ, use a dedicated sentinel instead of merging them accidentally.')),
l(120,'What are ExceptionGroup and except*, and when do they help?','Exception groups & except*','Python toolkit',
'Python 3.11 introduced ExceptionGroup to represent several independent failures together. except* selects matching subgroups by exception type and permits separate handlers to process different parts of the group. This is important for structured concurrent operations where several tasks may fail. Handling one subgroup does not automatically handle all remaining failures.',
'Use exception groups when an operation genuinely produces multiple failures, particularly with TaskGroup. Preserve group structure when callers need to inspect nested failures.',
'An ordinary except ValueError does not select ValueError members inside a group. except* has different restrictions, and unhandled members continue propagating.',
'ExceptionGroup carries several failures together. except* handles the matching parts without pretending the other failures disappeared.',
e('Inspect a group’s members',`group = ExceptionGroup("batch", [ValueError("bad"), TypeError("wrong")])
print(group.message)
print([type(error).__name__ for error in group.exceptions])`,`batch
['ValueError', 'TypeError']`,'The group retains both exceptions as structured members rather than flattening them into one message. Its message labels the combined operation.','This example requires Python 3.11 or newer. The exceptions are constructed here to make the structure visible without a traceback.'),
e('Handle different subgroups by type',`try:
    raise ExceptionGroup("batch", [ValueError("bad"), TypeError("wrong")])
except* ValueError as group:
    print("values", len(group.exceptions))
except* TypeError as group:
    print("types", len(group.exceptions))`,`values 1
types 1`,'Each handler receives the matching subgroup. Both run because the original group contains failures of both selected types.','This is not ordinary first-matching-handler behavior. Any members not covered by handlers would remain pending for propagation.'),
e('Split a group for explicit processing',`group = ExceptionGroup("batch", [ValueError("bad"), KeyError("key")])
matching, rest = group.split(ValueError)
print(type(matching.exceptions[0]).__name__)
print(type(rest.exceptions[0]).__name__)`,`ValueError
KeyError`,'split divides matching members from the rest while preserving useful group structure. The result supports programmatic classification outside an except* statement.','A side can be None when it has no members. General-purpose code must check before accessing its exceptions attribute.')),
l(121,'Why use pathlib for filesystem paths instead of building strings manually?','Pathlib & filesystem paths','Python toolkit',
'pathlib represents paths as objects with operations for joining, inspecting, and accessing files. Path performs filesystem operations, while PurePath variants can model path syntax without touching the filesystem. The / operator joins components according to path rules. Reading and writing text should specify an encoding so behavior is not dependent on a machine’s default.',
'Use Path for ordinary local file access and temporary directories for experiments. PurePosixPath or PureWindowsPath is useful when reasoning about another platform’s path syntax.',
'Joining an absolute component can replace the earlier path. Also, resolving or joining a path alone does not establish that an untrusted target stays inside an allowed directory.',
'Path objects keep path handling readable and platform-aware. Choose explicit encodings and validate untrusted file locations.',
e('Inspect path components without creating files',`from pathlib import PurePosixPath
p = PurePosixPath("notes") / "chapter.txt"
print(str(p))
print(p.stem, p.suffix)
print(p.with_suffix(".md"))`,`notes/chapter.txt
chapter .txt
notes/chapter.md`,'PurePosixPath fixes the syntax for a portable, deterministic example. These operations describe names and do not access disk.','Changing a suffix returns another path object; it does not rename a real file. Filesystem operations require a concrete Path.'),
e('Read and write a temporary text file',`from pathlib import Path
from tempfile import TemporaryDirectory
with TemporaryDirectory() as folder:
    file = Path(folder) / "note.txt"
    file.write_text("hello", encoding="utf-8")
    print(file.exists())
    print(file.read_text(encoding="utf-8"))`,`True
hello`,'The temporary directory owns the experiment’s files and cleans them up on exit. Path handles joining and text access.','An explicit encoding makes this text round-trip predictable. Real applications should still handle permission errors and other I/O failures.'),
e('Understand absolute path replacement',`from pathlib import PurePosixPath
base = PurePosixPath("/safe/root")
print(base / "child.txt")
print(base / "/elsewhere/file.txt")`,`/safe/root/child.txt
/elsewhere/file.txt`,'The relative child extends base, but an absolute right-hand component starts a new root path and replaces the previous base.','Do not accept untrusted components and assume joining guarantees containment. Validate the resolved destination before sensitive filesystem operations.')),
l(122,'How are str, bytes, encoding, and decoding related?','Text encodings & bytes','Python toolkit',
'str holds Unicode text, while bytes holds byte values. Encoding converts text into bytes using a named encoding; decoding reverses that interpretation when the bytes are valid for that encoding. Character counts and byte counts can differ. File, network, and binary boundaries require a clear encoding contract. Error handlers such as replace deliberately lose information and should be chosen intentionally.',
'Use explicit UTF-8 when that is the agreed format. Keep data as bytes for binary protocols and decode only where the protocol specifies text.',
'Calling str on bytes does not decode the bytes into their text contents. It produces a representation of the bytes object; use decode with the correct encoding instead.',
'Encode text into bytes; decode bytes into text. The encoding is the shared rule that makes that conversion meaningful.',
e('Compare character count and byte count',`text = "caf\u00e9"
data = text.encode("utf-8")
print(len(text), len(data))
print(data.hex())
print(data.decode("utf-8") == text)`,`4 5
636166c3a9
True`,'The accented character occupies one Python string code point here but requires two UTF-8 bytes. The complete string therefore has different character and byte lengths.','Decoding with the same agreed encoding reconstructs the original text. The hexadecimal display avoids relying on terminal font or locale settings.'),
e('Handle invalid input deliberately',`data = bytes([255])
try:
    data.decode("utf-8")
except UnicodeDecodeError:
    print("Invalid UTF-8")
print(ascii(data.decode("utf-8", errors="replace")))`,`Invalid UTF-8
'\\ufffd'`,'The single byte 255 is not a valid standalone UTF-8 sequence, so strict decoding raises. The replacement handler substitutes the Unicode replacement character.','Replacement can be useful for best-effort display, but loses the original text meaning. Keep raw bytes if diagnostics or lossless recovery matter.'),
e('Distinguish representation from decoding',`data = b"hello"
print(str(data))
print(data.decode("ascii"))
print(list(data[:2]))`,`b'hello'
hello
[104, 101]`,'str(data) describes a bytes object, including the b prefix and quotes. decode interprets its bytes as text using the specified encoding.','Indexing bytes yields integer byte values. A byte sequence is not a sequence of one-character Unicode strings.')),
l(123,'What does JSON serialization preserve, and which Python values need special handling?','JSON serialization boundaries','Python toolkit',
'json.dumps converts supported Python data into JSON text, and json.loads parses JSON text back into Python values. JSON has objects, arrays, strings, numbers, booleans, and null, not arbitrary Python classes or tuple types. A round-trip can therefore change certain Python details, such as converting a tuple into a list. Custom conversion must define a deliberate, interoperable representation.',
'Use JSON for structured interchange and validate parsed data before using it. Stable key ordering is useful for readable snapshots but is not a replacement for a data schema.',
'A valid JSON document can still have the wrong shape for your application. Also, do not load untrusted serialized Python objects with pickle as if it were equivalent to JSON.',
'JSON exchanges a limited set of data shapes, not every Python object. Parse the text, then validate the resulting data.',
e('Round-trip ordinary data',`import json
data = {"name": "Ada", "active": True}
text = json.dumps(data, sort_keys=True)
print(text)
print(json.loads(text)["active"])`,`{"active": true, "name": "Ada"}
True`,'The serializer maps Python True to JSON true, and the parser maps it back. sort_keys makes this displayed object ordering explicit.','The parsed result is data, not a validated User object. Application rules must still check required fields and accepted value types.'),
e('Notice changes in container type',`import json
original = (1, 2)
restored = json.loads(json.dumps(original))
print(restored)
print(type(restored).__name__)`,`[1, 2]
list`,'JSON arrays do not distinguish Python tuples from lists. Parsing the serialized array produces a list.','A successful round-trip of values does not guarantee preservation of every Python type or object identity. Use an explicit format when that distinction matters.'),
e('Define a representation for a date',`import json
from datetime import date
value = date(2026, 1, 2)
try:
    json.dumps(value)
except TypeError:
    print("Date needs conversion")
print(json.dumps({"day": value.isoformat()}))`,`Date needs conversion
{"day": "2026-01-02"}`,'A date is not a built-in JSON type, so ordinary serialization fails. Converting it to an agreed ISO-formatted string gives a clear representation.','The receiver must know whether that string represents a date. JSON alone does not attach a date type or timezone policy to strings.')),
l(124,'Why should CSV data be parsed with the csv module rather than split on commas?','CSV parsing & quoting','Python toolkit',
'CSV fields may contain commas, quotes, or line breaks when escaped according to a dialect. Splitting a line on commas ignores those rules and can corrupt record boundaries. csv.reader and csv.writer handle quoting, while DictReader and DictWriter associate columns with names. Parsed fields are normally strings, so numeric and domain conversion are separate steps.',
'Use the csv module for tabular text exchange. When opening real CSV files, specify newline="" and an explicit encoding to let the CSV layer handle line endings consistently.',
'A field that looks numeric is not automatically an integer. Validate headers and convert values intentionally rather than assuming every record has the expected shape.',
'CSV is a quoted data format, not just comma-separated substrings. Let csv parse fields, then convert their meanings.',
e('Parse a quoted comma correctly',`import csv
from io import StringIO
text = 'name,city\\n"Ada, A.",London\\n'
rows = list(csv.reader(StringIO(text)))
print(rows[1])`,`['Ada, A.', 'London']`,'The comma inside the quoted name belongs to one field, not a new column. csv.reader understands that quoting rule.','A plain split would create too many pieces and damage the record. The in-memory stream keeps this example self-contained.'),
e('Read by column name and convert a value',`import csv
from io import StringIO
rows = csv.DictReader(StringIO("name,score\\nAda,7\\n"))
row = next(rows)
print(row["name"])
print(type(row["score"]).__name__)
print(int(row["score"]) + 1)`,`Ada
str
8`,'DictReader uses the first record as headers and provides named string fields. The score remains a string until explicitly converted.','Handle missing or invalid columns in real data. Parsing a syntactically valid CSV file does not establish that its contents meet your business rules.'),
e('Write the required quoting automatically',`import csv
from io import StringIO
output = StringIO()
writer = csv.writer(output, lineterminator="\\n")
writer.writerow(["Ada, A.", 7])
print(output.getvalue().strip())`,`"Ada, A.",7`,'The writer detects the comma in the name and adds quotes automatically. A fixed line terminator makes the demonstrated output deterministic.','Use the writer rather than hand-building quotes, which becomes error-prone when values themselves contain quotes or newlines.')),
l(125,'What is the difference between naive and timezone-aware datetime values?','Naive & aware datetimes','Python toolkit',
'An aware datetime has timezone information that defines its relation to a time standard. A naive datetime has no such interpretation attached. UTC-aware values are useful for recording instants, while a separate local-zone conversion is needed for presentation. Attaching a timezone to wall-clock fields and converting an already-aware instant are different operations. Civil time can have ambiguous or nonexistent local times around clock changes.',
'Use aware timestamps for events exchanged across systems. Keep a clear policy for user-local dates, scheduled wall-clock times, and elapsed durations.',
'replace(tzinfo=...) labels existing fields without converting them. Use astimezone for conversion of an aware instant, and do not silently mix naive and aware timestamps.',
'A naive datetime has no timezone meaning attached. An aware datetime identifies how its clock fields relate to an instant.',
e('Represent an explicit UTC instant',`from datetime import datetime, timezone
stamp = datetime(2026, 1, 2, 12, 30, tzinfo=timezone.utc)
print(stamp.isoformat())
print(stamp.utcoffset().total_seconds())`,`2026-01-02T12:30:00+00:00
0.0`,'The +00:00 offset states the UTC interpretation explicitly. No machine-local timezone is consulted to construct this timestamp.','Use fixed dates in reproducible examples instead of now. Applications can capture the current UTC time with an explicit aware-time API.'),
e('Convert the same instant to another offset',`from datetime import datetime, timedelta, timezone
utc = datetime(2026, 1, 2, 12, 0, tzinfo=timezone.utc)
offset = timezone(timedelta(hours=5, minutes=30))
local = utc.astimezone(offset)
print(local.isoformat())
print(local == utc)`,`2026-01-02T17:30:00+05:30
True`,'astimezone changes displayed clock fields and offset while preserving the represented instant. Equality confirms that both aware values identify the same time.','This fixed-offset timezone has no daylight-saving rules. Use an appropriate ZoneInfo zone when historical or seasonal civil-time changes matter.'),
e('Reject ordering across missing timezone meaning',`from datetime import datetime, timezone
naive = datetime(2026, 1, 2)
aware = datetime(2026, 1, 2, tzinfo=timezone.utc)
try:
    print(naive < aware)
except TypeError:
    print("Choose a consistent timezone policy")`,`Choose a consistent timezone policy`,'Python rejects this ordering comparison because the naive value lacks the information needed to relate it to the aware instant.','Do not patch over the problem by arbitrarily labeling the naive value. First establish what timezone its original clock fields actually meant.'))
];
