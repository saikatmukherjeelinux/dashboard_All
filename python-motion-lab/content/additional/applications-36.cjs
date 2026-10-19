const {lesson:l,e}=require('./helpers.cjs');
module.exports=[
l(180,'How should math.isclose compare approximate floating-point results?','Approximate numeric comparisons','Python toolkit',
'math.isclose compares two finite values using relative and absolute tolerances. Relative tolerance scales with the larger magnitude, while absolute tolerance allows a fixed difference that is especially useful near zero. Tolerances are part of the domain’s definition of an acceptable error, not a universal replacement for exact equality.',
'Use approximate comparisons for computed measurements or floating-point calculations when a justified error allowance is appropriate. Keep exact comparisons for exact discrete values and choose Decimal or Fraction when their arithmetic models fit the problem.',
'Near zero, relative tolerance alone can reject a small nonzero result. NaN is not close to any value, including itself; infinity is close only to the same infinity.',
'isclose asks whether an error fits your chosen tolerances. Relative tolerance scales with magnitude; absolute tolerance handles small values near zero.',
e('Compare a floating-point sum',`from math import isclose
value = 0.1 + 0.2
print(value == 0.3)
print(isclose(value, 0.3))`,`False
True`,'Binary floating-point cannot exactly represent these decimal fractions, so the computed sum differs slightly from the stored representation of 0.3.','The default closeness test accepts this tiny representation difference. Whether those tolerances are appropriate still depends on the application’s required accuracy.'),
e('Set an absolute tolerance near zero',`from math import isclose
print(isclose(1e-12, 0.0))
print(isclose(1e-12, 0.0, abs_tol=1e-10))
print(isclose(100.0, 100.05, rel_tol=0.001))`,`False
True
True`,'Relative tolerance alone scales to the tiny nonzero input and is too small here. An absolute tolerance permits a fixed error around zero.','The final comparison allows roughly a tenth of a percent relative error. Choose such a threshold using the meaning and units of the measurements.'),
e('Handle special floating-point values',`from math import isclose, inf, nan
print(isclose(inf, inf))
print(isclose(inf, -inf))
print(isclose(nan, nan))`,`True
False
False`,'Equal infinities are treated as close, while opposite infinities are not. Finite error tolerances do not bridge an infinite difference.','NaN represents an unordered or invalid numerical result and does not compare close even to itself. Detect it explicitly when it requires separate handling.')),
l(181,'How can timeit measure repeated work without misleading example timings?','Timeit & repeatable measurements','Python toolkit',
'timeit runs a statement or callable repeatedly and reports elapsed time. Setup work can be kept outside the timed statement, and repeat performs several batches. Timings vary with hardware, system load, interpreter, and data, so report the workload and environment rather than treating a single duration as a universal ranking.',
'Use timeit for small controlled performance experiments after verifying correctness. Include realistic input sizes and decide whether setup, allocation, and cleanup belong in the measurement.',
'A callable passed to timeit may mutate state each time it runs. Also note that timeit normally disables garbage collection during timing unless the setup explicitly enables it.',
'timeit repeats a defined workload and measures duration. Control the workload and state, and interpret timings as environment-dependent observations.',
e('Count the timed calls',`from timeit import timeit
calls = []
elapsed = timeit(lambda: calls.append(1), number=5)
print(len(calls))
print(elapsed >= 0)`,`5
True`,'number=5 invokes the supplied callable five times. The list records those calls so the example verifies behavior without asserting a particular speed.','Elapsed duration depends on the current environment. Only its nonnegative shape is printed, avoiding an output that would change on each run.'),
e('Separate setup from a repeated statement',`from timeit import Timer
values = [1, 2, 3]
timer = Timer("sum(values)", globals={"values": values})
results = timer.repeat(repeat=3, number=10)
print(len(results))
print(all(value >= 0 for value in results))
print(values)`,`3
True
[1, 2, 3]`,'repeat returns three elapsed measurements, each for a batch of ten executions of the sum statement. The globals mapping supplies its input.','sum does not modify values, so each repetition sees the same data. This example checks the measurement structure rather than claiming a performance improvement.'),
e('Avoid a changing workload by copying',`from timeit import timeit
original = [3, 1, 2]
def sort_copy():
    data = original.copy()
    data.sort()
elapsed = timeit(sort_copy, number=4)
print(original)
print(elapsed >= 0)`,`[3, 1, 2]
True`,'Each call copies the same unsorted source before sorting. Repetitions therefore do not silently become an already-sorted in-place workload.','The copy cost is included in this measurement. Excluding it would require a different experimental design, so describe exactly which operation is being timed.')),
l(182,'When should pprint format nested data instead of plain print?','Pretty-printing nested structures','Python toolkit',
'pprint formats Python object representations using indentation and line breaks intended to improve readability. pprint prints directly, while pformat returns the formatted string. Parameters control width, depth, compactness, and dictionary sorting. This is a diagnostic representation rather than a general interchange format.',
'Use pprint when inspecting nested lists and mappings during development. Use JSON or another explicit serialization format when another program must consume the output.',
'A depth limit hides detail rather than removing it from the original object. Pretty-printing sensitive data can still expose secrets, and arbitrary object representations need not be valid Python literals.',
'pprint makes nested Python representations readable. pformat returns the text, and formatting options affect display rather than stored data.',
e('Choose dictionary display order',`from pprint import pformat
data = {"z": 1, "a": 2}
print(pformat(data))
print(pformat(data, sort_dicts=False))`,`{'a': 2, 'z': 1}
{'z': 1, 'a': 2}`,'pformat sorts dictionary keys by default when possible, producing a diagnostic order that can differ from insertion order.','Disabling dictionary sorting preserves this mapping’s insertion order in the representation. Neither call changes the underlying dictionary.'),
e('Limit nested display depth',`from pprint import pformat
data = {"a": {"b": {"c": 1}}}
print(pformat(data, depth=2))
print(data["a"]["b"]["c"])`,`{'a': {'b': {...}}}
1`,'The depth setting abbreviates the deeper dictionary as an ellipsis-containing representation, keeping the outer structure readable.','The original nested value is still present and accessible. A display limit is not a transformation or deletion of the stored data.'),
e('Format a self-referential container',`from pprint import pformat
values = []
values.append(values)
text = pformat(values)
print("Recursion on list" in text)
print(isinstance(text, str))`,`True
True`,'The list contains itself, so expanding it recursively without detection would never finish. pprint emits a recursion marker instead.','The marker can include a process-specific object identifier. Checking its stable descriptive portion avoids relying on that changing identifier.')),
l(183,'How do textwrap helpers handle indentation, wrapping, and shortening?','Text wrapping & indentation','Python toolkit',
'textwrap provides tools for display-oriented text layout. dedent removes a common leading whitespace margin, indent prefixes selected lines, fill wraps words into one string, and shorten collapses whitespace and truncates at word boundaries with a placeholder. These operations return new strings.',
'Use textwrap for command-line help, readable embedded templates, and plain-text summaries. Choose widths appropriate to the destination rather than treating character counts as a full terminal-layout engine.',
'dedent removes a shared margin rather than every leading space. Wrapping does not parse Markdown or preserve all semantic formatting, and Unicode display width can differ from string length.',
'textwrap adjusts plain-text layout. Remove shared margins, add prefixes, wrap words, or shorten a preview without changing the original string.',
e('Remove the shared indentation margin',`from textwrap import dedent
text = "    alpha\\n      beta\\n    gamma"
print(dedent(text))`,`alpha
  beta
gamma`,'All three lines share a four-space left margin, so dedent removes those four spaces from each line.','The two extra spaces on beta remain because they represent indentation relative to the common margin rather than part of that shared margin.'),
e('Wrap a short paragraph',`from textwrap import fill, indent
wrapped = fill("one two three four", width=9)
print(wrapped)
print(indent("a\\nb", "> "))`,`one two
three
four
> a
> b`,'fill chooses word boundaries so each displayed line fits the requested width when ordinary word-breaking rules permit it.','indent prefixes the nonempty lines of its input with the requested marker, which is useful when rendering quoted or nested plain text.'),
e('Shorten a preview at a word boundary',`from textwrap import shorten
text = "  one   two three four  "
print(shorten(text, width=12, placeholder="..."))
print(repr(text[:2]))`,`one two...
'  '`,'shorten first collapses whitespace, then retains complete words that fit together with the placeholder inside the chosen width.','The original string still begins with two spaces. These helpers return formatted results rather than rewriting the input string in place.')),
l(184,'How does argparse turn command-line text into validated program options?','Argparse & command-line interfaces','Python toolkit',
'argparse describes accepted positional arguments and options, parses a list of strings, and produces a Namespace of values. You can define conversions, defaults, choices, flags, and subcommands. A parser normally reads process arguments, but an explicit list makes examples and tests independent of how the script was launched.',
'Use argparse for command-line tools that need consistent help and input handling. Keep parsing near the entry point and pass the resulting values into ordinary testable functions.',
'type=bool does not implement the usual yes/no flag behavior because nonempty strings are truthy. Use suitable actions such as store_true or an explicit boolean conversion.',
'argparse defines a command-line contract and returns parsed values. Use explicit types and actions, then keep application logic separate from argument parsing.',
e('Parse a typed option and a flag',`import argparse
parser = argparse.ArgumentParser()
parser.add_argument("--count", type=int, default=1)
parser.add_argument("--verbose", action="store_true")
args = parser.parse_args(["--count", "3", "--verbose"])
print(args.count, args.verbose)`,`3 True`,'The count text is converted to an integer by the declared type. The presence of the verbose flag sets its boolean value to True.','Providing the argument list explicitly makes this snippet independent of the actual process command line and straightforward to test.'),
e('Collect positional values',`import argparse
parser = argparse.ArgumentParser()
parser.add_argument("files", nargs="+")
parser.add_argument("--mode", choices=["fast", "safe"], default="safe")
args = parser.parse_args(["a.txt", "b.txt"])
print(args.files)
print(args.mode)`,`['a.txt', 'b.txt']
safe`,'nargs="+" collects one or more positional values into a list. The two filenames therefore belong to a single parsed field.','The optional mode was omitted, so its explicit default applies. choices defines the accepted values when the caller supplies that option.'),
e('Separate subcommand behavior',`import argparse
parser = argparse.ArgumentParser()
commands = parser.add_subparsers(dest="command", required=True)
show = commands.add_parser("show")
show.add_argument("name")
args = parser.parse_args(["show", "report"])
print(args.command, args.name)`,`show report`,'The first argument selects the show subparser, whose own contract then consumes the name argument. The chosen command is stored explicitly.','Subcommands allow related operations to share one executable while keeping their accepted arguments and help messages separated.')),
l(185,'How does ConfigParser read typed settings from INI-style configuration?','INI configuration & typed getters','Python toolkit',
'configparser reads INI-style sections and options. Stored values are strings, while getint, getfloat, and getboolean perform explicit conversions. DEFAULT values are available as fallbacks in sections. Basic interpolation can substitute other option values, and option names are case-insensitive under the default normalization.',
'Use ConfigParser for human-editable settings with a section-and-option structure. Keep defaults, parsing, and domain validation explicit so a configuration error is distinguishable from a valid setting.',
'bool("false") is True because the string is nonempty. Use getboolean for supported boolean spellings. Disable interpolation when literal percent signs should be read unchanged.',
'INI options begin as text. Use typed getters, understand inherited defaults, and choose interpolation behavior deliberately.',
e('Convert numeric and boolean values',`import configparser
config = configparser.ConfigParser()
config.read_string("[app]\\nretries = 3\\ndebug = false\\n")
print(config.getint("app", "retries") + 1)
print(config.getboolean("app", "debug"))
print(type(config["app"]["retries"]).__name__)`,`4
False
str`,'getint and getboolean apply explicit parsing rules. The false text becomes False rather than the truthiness of a nonempty Python string.','Direct section lookup still returns the stored string. Typed getters do not replace the underlying text with converted Python objects.'),
e('Inherit defaults and interpolate',`import configparser
config = configparser.ConfigParser()
config.read_string("[DEFAULT]\\nroot = /srv\\n[app]\\npath = %(root)s/data\\n")
print(config["app"]["root"])
print(config["app"]["path"])
print(config.get("app", "missing", fallback="none"))`,`/srv
/srv/data
none`,'The app section can read root through DEFAULT even though root is not declared directly in that section.','Basic interpolation inserts the resolved root into path. A missing requested option uses the explicit fallback rather than raising an error.'),
e('Preserve a literal percent sign',`import configparser
config = configparser.ConfigParser(interpolation=None)
config.read_string("[job]\\nProgress = 50%\\n")
print(config["job"]["progress"])
print(list(config["job"]))`,`50%
['progress']`,'Disabling interpolation lets the percentage text remain literal instead of being interpreted as interpolation syntax.','The default option-name transformation still normalizes Progress to progress. Section names and option names have distinct handling rules.')),
l(186,'How do temporary-file context managers define cleanup boundaries?','Temporary files & resource lifetimes','Python toolkit',
'tempfile creates temporary files and directories with managed names and cleanup behavior. TemporaryDirectory removes its directory tree on context exit. TemporaryFile supplies an open file-like object, while NamedTemporaryFile offers a filesystem name with platform-sensitive reopening and deletion considerations.',
'Use temporary resources for isolated tests, intermediate artifacts, and operations that require a path without retaining permanent output. Use context managers to make the lifetime clear.',
'On Windows, reopening a still-open named temporary file can encounter sharing restrictions. Close it or use a suitable documented deletion strategy before another component needs to open its path.',
'A temporary resource is still a real file or directory. Use a context manager to define its lifetime and account for platform-specific reopening rules.',
e('Clean up an isolated directory',`from tempfile import TemporaryDirectory
from pathlib import Path
with TemporaryDirectory() as folder:
    path = Path(folder) / "note.txt"
    path.write_text("hello", encoding="utf-8")
    print(path.read_text(encoding="utf-8"))
    print(path.exists())
print(path.exists())`,`hello
True
False`,'The file exists while its TemporaryDirectory context is active. Explicit UTF-8 encoding makes the text round trip independent of platform defaults.','Leaving the context removes the temporary directory and its contents. Keeping a Path object does not keep the referenced file alive.'),
e('Rewind an open temporary stream',`from tempfile import TemporaryFile
with TemporaryFile(mode="w+t", encoding="utf-8") as stream:
    stream.write("alpha\\nbeta")
    stream.seek(0)
    print(stream.readline().strip())
    print(stream.read())
print(stream.closed)`,`alpha
beta
True`,'After writing, the cursor is at the end. seek(0) moves it back so the subsequent reads can retrieve the stored text.','The context closes the stream on exit. A temporary file’s cursor and closed state follow normal file-object rules.'),
e('Reopen a named file after closing it',`from tempfile import NamedTemporaryFile
from pathlib import Path
with NamedTemporaryFile(mode="w", encoding="utf-8", delete=False) as stream:
    stream.write("saved")
    path = Path(stream.name)
try:
    print(path.read_text(encoding="utf-8"))
finally:
    path.unlink()
print(path.exists())`,`saved
False`,'delete=False keeps the named file available after its creation stream closes, avoiding an open-handle reopening conflict in this example.','The finally block supplies explicit deletion because automatic deletion was disabled. It still runs if reading the temporary file fails.')),
l(187,'How do SQLite parameters and transactions separate data from SQL commands?','SQLite parameters & transactions','Python toolkit',
'sqlite3 provides a database interface to SQLite. Parameter placeholders bind values separately from SQL text, avoiding manual quoting of those values. Transactions group related changes so they can be committed together or rolled back. A connection context manager manages a pending transaction; it does not itself close the connection.',
'Use SQLite for local structured storage and small application databases. Define constraints and use bound parameters for values; validate any dynamic table or column identifiers separately.',
'Do not build SQL by interpolating untrusted values. Also do not assume that leaving with connection closes the connection: close it explicitly or use a closing context manager.',
'Bind SQL values as parameters and group related writes in a transaction. Commit keeps changes, rollback cancels them, and connection closure is separate.',
e('Bind a value containing a quote',`import sqlite3
from contextlib import closing
with closing(sqlite3.connect(":memory:")) as db:
    db.execute("CREATE TABLE people (name TEXT)")
    db.execute("INSERT INTO people VALUES (?)", ("O'Reilly",))
    print(db.execute("SELECT name FROM people").fetchone()[0])`,`O'Reilly`,'The question-mark placeholder receives a separate parameter tuple, so the apostrophe is stored as data rather than interpreted as SQL syntax.','The closing context manager explicitly closes the connection. This in-memory database is isolated to that connection and disappears when it closes.'),
e('Roll back a failed group of writes',`import sqlite3
from contextlib import closing
with closing(sqlite3.connect(":memory:")) as db:
    db.execute("CREATE TABLE items (id INTEGER PRIMARY KEY)")
    try:
        with db:
            db.execute("INSERT INTO items VALUES (?)", (1,))
            db.execute("INSERT INTO items VALUES (?)", (1,))
    except sqlite3.IntegrityError:
        print("rolled back")
    print(db.execute("SELECT COUNT(*) FROM items").fetchone()[0])`,`rolled back
0`,'The duplicate primary key raises IntegrityError during the transaction. The connection context rolls back the pending first insertion as well.','The table exists outside this group of inserts, so it remains available for the count query. The transaction left it with no committed rows.'),
e('Read named columns with a row factory',`import sqlite3
from contextlib import closing
with closing(sqlite3.connect(":memory:")) as db:
    db.row_factory = sqlite3.Row
    row = db.execute("SELECT ? AS name, ? AS score", ("Ada", 9)).fetchone()
    print(row["name"], row["score"])
    print(row.keys())`,`Ada 9
['name', 'score']`,'The Row factory creates result objects that support column-name access as well as positional access. SQL aliases define the names here.','Bound parameters provide the values while the fixed query specifies the structure. Row formatting does not alter the database’s transaction behavior.')),
l(188,'How can subprocess.run launch a child program with explicit arguments and captured output?','Subprocess arguments & result handling','Python toolkit',
'subprocess.run starts a child process, waits for it, and returns a CompletedProcess. An argument list with shell=False passes values as arguments without shell expansion. capture_output retains standard output and standard error, text enables decoding, and check=True raises CalledProcessError for a nonzero exit code.',
'Use subprocess when integrating a real external executable. Specify the intended executable, argument boundaries, encoding, timeouts, and error handling rather than relying on a shell command string.',
'shell=False avoids shell interpretation but does not make every argument safe for every executable. An external program still interprets its own options; validate inputs according to that program’s contract.',
'Pass an explicit argument list and inspect the child result. Capture output and handle nonzero exits deliberately instead of assuming every launch succeeds.',
e('Capture output from a child interpreter',`import subprocess
import sys
result = subprocess.run([sys.executable, "-c", "print(2 + 3)"], capture_output=True, text=True, encoding="utf-8", check=True)
print(result.stdout.strip())
print(result.returncode)
print(result.stderr == "")`,`5
0
True`,'The current interpreter executable runs a small child program. Captured output belongs to the result object instead of being printed directly by the parent.','check=True permits this successful zero exit status but would raise for a failing child. The chosen encoding states how captured bytes become text.'),
e('Preserve an argument literally',`import subprocess
import sys
code = "import sys; print(sys.argv[1])"
result = subprocess.run([sys.executable, "-c", code, "a b; c"], capture_output=True, text=True, encoding="utf-8", check=True)
print(result.stdout.strip())`,`a b; c`,'The final list element is one argument even though it contains spaces and a semicolon. No shell is interpreting those characters.','The child receives the exact supplied text as sys.argv[1]. Its own option and input semantics still need consideration in a real integration.'),
e('Handle a nonzero exit code',`import subprocess
import sys
try:
    subprocess.run([sys.executable, "-c", "raise SystemExit(4)"], check=True, capture_output=True)
except subprocess.CalledProcessError as error:
    print(error.returncode)`,`4`,'The child exits deliberately with status 4. Because check=True was requested, run raises CalledProcessError instead of silently returning a failed result.','The exception exposes the return code for application-specific handling. Captured output can also be retained for diagnosis when the child provides it.')),
l(189,'How can zipfile create and read an archive without extracting it?','ZIP archives & in-memory files','Python toolkit',
'zipfile reads and writes ZIP archives and can operate on file paths or seekable binary streams such as BytesIO. writestr adds an entry from supplied content, namelist lists entry names, and read retrieves an entry’s bytes. Opening an archive with a context manager finalizes or closes it at the intended boundary.',
'Use in-memory archives for generated downloads and tests, and inspect individual members without extracting an entire archive. Treat untrusted archives as inputs requiring resource and path validation.',
'Compressed size can hide a very large expanded payload. Avoid extracting untrusted content without bounds and destination checks, and do not confuse an archive entry name with a trusted filesystem path.',
'ZIP stores named entries. You can inspect and read those entries directly, while extraction adds separate path and resource considerations.',
e('Create an archive in memory',`from io import BytesIO
from zipfile import ZipFile
buffer = BytesIO()
with ZipFile(buffer, "w") as archive:
    archive.writestr("hello.txt", "Hello")
buffer.seek(0)
with ZipFile(buffer) as archive:
    print(archive.namelist())
    print(archive.read("hello.txt").decode("utf-8"))`,`['hello.txt']
Hello`,'writestr adds a named member, and closing the writing archive finalizes its directory information before it is reopened for reading.','Reading a member returns bytes. Decoding with UTF-8 recovers the text without extracting the member into a real filesystem directory.'),
e('Inspect sizes and integrity',`from io import BytesIO
from zipfile import ZipFile, ZIP_DEFLATED
buffer = BytesIO()
with ZipFile(buffer, "w", compression=ZIP_DEFLATED) as archive:
    archive.writestr("data.txt", "A" * 1000)
buffer.seek(0)
with ZipFile(buffer) as archive:
    info = archive.getinfo("data.txt")
    print(info.file_size)
    print(info.compress_size < info.file_size)
    print(archive.testzip() is None)`,`1000
True
True`,'Repeated A characters compress well, so this member occupies fewer compressed bytes than its one-thousand-byte uncompressed content.','testzip checks member checksums and returns None here. Integrity checking is useful but does not authenticate the archive or enforce safe expansion limits.'),
e('Select a member without extraction',`from io import BytesIO
from zipfile import ZipFile
buffer = BytesIO()
with ZipFile(buffer, "w") as archive:
    archive.writestr("docs/a.txt", "alpha")
    archive.writestr("docs/b.txt", "beta")
buffer.seek(0)
with ZipFile(buffer) as archive:
    names = sorted(name for name in archive.namelist() if name.endswith("a.txt"))
    print(names)
    print(archive.read(names[0]).decode("utf-8"))`,`['docs/a.txt']
alpha`,'Member names can contain directory-like segments without creating directories on disk. The code filters names before reading the chosen member.','No extraction is performed, so the example creates no output files. For untrusted inputs, also limit member sizes and the amount of content read.')),
l(190,'How does singledispatchmethod choose method behavior from the first non-self argument?','Single dispatch for methods','Classes & design',
'functools.singledispatchmethod turns a method into a dispatcher based on the runtime type of its first argument after self or cls. Registered implementations specialize supported types, and the generic method supplies a fallback. Matching can use an applicable superclass registration when an exact type is not registered.',
'Use it for one conceptual operation that needs type-specific behavior in a class. Keep explicit branching when dispatch depends on several values or on business rules beyond a single argument type.',
'It is not dispatch on every argument or on the return annotation. When combining it with classmethod, singledispatchmethod must remain the outer decorator to expose register.',
'singledispatchmethod picks an implementation using the first non-self argument’s type. Register special cases and keep a deliberate generic fallback.',
e('Register integer and string behavior',`from functools import singledispatchmethod
class Formatter:
    @singledispatchmethod
    def show(self, value):
        return "other"
    @show.register(int)
    def _(self, value):
        return f"integer:{value}"
    @show.register(str)
    def _(self, value):
        return value.upper()
f = Formatter()
print(f.show(3))
print(f.show("python"))
print(f.show(1.5))`,`integer:3
PYTHON
other`,'The runtime types int and str select their registered method bodies. The float has no matching specialized registration and uses the generic fallback.','self is not the dispatch value. The same Formatter instance handles all three requests without changing its class or the method name.'),
e('Reject unsupported values intentionally',`from functools import singledispatchmethod
class Doubler:
    @singledispatchmethod
    def apply(self, value):
        raise TypeError("unsupported value")
    @apply.register(list)
    def _(self, value):
        return value + value
d = Doubler()
print(d.apply([1, 2]))
try:
    d.apply(None)
except TypeError as error:
    print(error)`,`[1, 2, 1, 2]
unsupported value`,'The list registration creates a concatenated list. The fallback explicitly rejects unsupported types instead of silently manufacturing a default answer.','A deliberate fallback contract makes type-specific APIs easier to use. Registered methods should still express the same overall conceptual operation.'),
e('Specialize bool separately from int',`from functools import singledispatchmethod
class Kind:
    @singledispatchmethod
    def name(self, value):
        return "other"
    @name.register(int)
    def _(self, value):
        return "integer"
    @name.register(bool)
    def _(self, value):
        return "boolean"
k = Kind()
print(k.name(True))
print(k.name(7))`,`boolean
integer`,'bool is a subclass of int, but its more specific registration takes precedence for True. Ordinary integers still use the int implementation.','Subclass relationships affect dispatch. Register bool explicitly when boolean meaning must differ from the treatment of numerical integer values.')),
l(191,'How do dataclasses.replace and asdict handle copying and derived fields?','Dataclass replacement & conversion','Classes & design',
'dataclasses.replace constructs another instance using the dataclass constructor with selected field changes, so __post_init__ runs again. It does not automatically deep-copy unchanged mutable fields. asdict recursively converts dataclass instances, mappings, lists, and tuples, using deep copying for other values. These operations serve different purposes.',
'Use replace for a modified record while preserving the original record’s field bindings. Use asdict when a recursive dictionary representation is appropriate, while checking whether its copying behavior and resulting types match the next consumer.',
'replace can share mutable fields with the source. asdict is not a promise of JSON compatibility, and init=False fields are not constructor overrides for replace.',
'replace creates a new dataclass instance with chosen changes; unchanged nested objects may be shared. asdict recursively converts and copies for a dictionary representation.',
e('Replace one field on an immutable record',`from dataclasses import dataclass, replace
@dataclass(frozen=True)
class Point:
    x: int
    y: int
first = Point(1, 2)
second = replace(first, y=9)
print(first)
print(second)
print(first is second)`,`Point(x=1, y=2)
Point(x=1, y=9)
False`,'replace supplies the unchanged x value and the requested new y value to a new Point construction. The original frozen instance stays unchanged.','The result is a separate object. A frozen outer record prevents ordinary field reassignment but does not make every possible nested value immutable.'),
e('Compare shared replacement with converted output',`from dataclasses import dataclass, replace, asdict
@dataclass
class Record:
    tags: list
original = Record(["python"])
changed = replace(original)
converted = asdict(original)
changed.tags.append("code")
print(original.tags)
print(converted["tags"])`,`['python', 'code']
['python']`,'The replacement receives the original tags list because no different value was supplied. Mutating that list is visible through both instances.','asdict constructed an independent list representation before the mutation, so its output does not gain the later code element.'),
e('Recompute an init-false derived field',`from dataclasses import dataclass, field, replace
@dataclass
class Line:
    price: int
    quantity: int
    total: int = field(init=False)
    def __post_init__(self):
        self.total = self.price * self.quantity
first = Line(3, 2)
second = replace(first, quantity=4)
print(first.total, second.total)`,`6 12`,'The total field is excluded from constructor arguments and computed by __post_init__. Initial construction computes 3 times 2.','replace constructs a new instance with quantity 4, so initialization recomputes the derived total as 12 rather than copying the earlier total blindly.'))
].map(lesson=>({...lesson,batch:'latest-36',body:lesson.body.replace(/(__[a-z_]+__)/g,'`$1`')}));
