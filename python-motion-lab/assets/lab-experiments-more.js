/* Second expansion: 44 independently navigable traces, appended after the first 56. */
(function(root){
 'use strict';
 const additions=[];
 function add(id,title,category,style,lesson,example,intro,insight,base,steps){
  const source=()=>root.LESSONS.find(l=>l.id===lesson).examples[example];
  additions.push({id,title,category,style,lessons:[lesson],batch:'latest-44',intro,insight,tag:category.toUpperCase()+' / '+style.toUpperCase(),options:'',build(){return steps.map(([status,state],i)=>({status,scene:{...base,...state,type:style,step:i,title,description:title+': '+status}}));},code(){return source().code;},output(){return source().output;}});
 }
 add('starred-unpacking','Starred-unpacking catcher','Functions','binder',109,0,
  'Catch the first value in one slot and gather the remaining values into a fresh list.',
  'A starred assignment target collects leftover items as a list, including an empty list. It consumes the iterable rather than creating a lazy view.',{slots:['first','* rest'],tokens:['10','[20,30]'],values:['','']},[
  ['Prepare the iterable [10,20,30].',{bound:-1}],
  ['Assign its leading item to first.',{bound:0,active:0}],
  ['Collect the remaining items into rest.',{bound:1,active:1,result:'first=10; rest=[20,30]'}],
  ['A second assignment from [10] leaves no leftover items.',{bound:1,tokens:['10','[]'],result:'rest is an empty list'}]
 ]);
 add('nested-unpacking','Nested-record unfolding','Functions','tree',109,1,
  'Unfold an outer record and then its inner pair into named targets.',
  'The target pattern mirrors the input shape. The same snippet also swaps a and b by evaluating the right side before assigning either target.',{labels:['record','name','pair','low','high'],values:['','Ada','','7','9'],edges:[[0,1],[0,2],[2,3],[2,4]]},[
  ['Read (Ada, (7,9)) as one nested record.',{path:[0]}],
  ['Unpack the outer tuple into name and an inner pair.',{path:[0,1,2]}],
  ['Unpack the inner pair into low and high.',{path:[2,3,4]}],
  ['The names now identify all three values.',{path:[1,3,4],result:'Ada 7 9'}]
 ]);
 add('comprehension-scope','Comprehension scope bubble','Iteration','scope',110,1,
  'Watch a comprehension use its own loop binding while the surrounding name survives.',
  'In Python 3, comprehension loop variables do not overwrite the surrounding binding. The rings illustrate scope boundaries, not a physical allocation layout.',{},[
  ['The surrounding n is the string outside.',{cursor:3,result:'outer n = outside'}],
  ['The comprehension introduces its own loop binding.',{cursor:0,result:'inner n = 0'}],
  ['The local loop advances and builds [0,1,2].',{cursor:1,result:'comprehension result: [0,1,2]'}],
  ['Afterward, lookup outside finds the unchanged binding.',{cursor:3,result:'outer n is still outside'}]
 ]);
 add('walrus-capture','Walrus value capture','Functions','ribbon',111,0,
  'Scan a condition while storing its intermediate value for the body to reuse.',
  ':= binds a name and returns the assigned value. Parentheses clarify how the assignment expression participates in the comparison.',{text:'size := 3'},[
  ['Evaluate len(values), producing 3.',{cursor:8,selected:[8],output:'len(values) → 3'}],
  ['The assignment expression binds size to that value.',{cursor:5,selected:[0,1,2,3],output:'size = 3'}],
  ['Compare the returned 3 with the bound 2.',{text:'3 > 2',cursor:2,selected:[0,2,4],output:'condition is True'}],
  ['The body and later code can both read size.',{text:'size = 3',selected:[0,1,2,3],output:'size remains 3'}]
 ]);
 add('comparison-chain','Chained-comparison checkpoint','Functions','decision',114,1,
  'Use one evaluated middle value in two neighboring comparisons.',
  'The chained expression evaluates middle() once, then reuses the result. Explicitly repeating the function in two separate comparisons could call it twice.',{labels:['middle()','1 < value','value < 9','result'],values:['5','','','']},[
  ['Evaluate middle() and keep its returned value 5.',{path:[0],cursor:0,result:'one function call'}],
  ['Check 1 < 5.',{path:[0,1],cursor:1,values:['5','True','','']}],
  ['Reuse the same value for 5 < 9.',{path:[0,1,2],cursor:2,values:['5','True','True','']}],
  ['Both adjacent comparisons pass.',{path:[1,2,3],cursor:3,values:['5','True','True','True'],result:'middle printed once'}]
 ]);
 add('scope-assignment','Global/nonlocal binding routes','Functions','memory',106,1,
  'Route assignments to separate enclosing and module-level bindings.',
  'nonlocal chooses an existing enclosing function binding; global chooses the module binding. These declarations control assignment targets, not just lookup display.',{names:['nonlocal value','global count'],objects:['value=1','count=0'],links:[0,1]},[
  ['Enter outer() with value=1 and module count=0.',{active:0}],
  ['nonlocal directs value += 2 to the enclosing binding.',{active:0,objects:['value=3','count=0']}],
  ['global directs count += 1 to the module binding.',{active:1,objects:['value=3','count=1']}],
  ['Return the enclosing value and read the module count.',{objects:['3','1'],result:'outer() → 3; count → 1'}]
 ]);
 add('late-binding','Late-binding callback ledger','Functions','ledger',15,2,
  'Compare deferred lookup of one loop binding with per-function default arguments.',
  'The late lambdas read the final loop value when called. The fixed lambdas evaluate n=n at creation, keeping separate argument defaults.',{labels:['callback','late lookup','default capture'],rows:[['0','pending','0'],['1','pending','1'],['2','pending','2']]},[
  ['Create three lambdas while the loop advances.',{active:0}],
  ['The loop finishes with its shared n equal to 2.',{active:2,rows:[['0','n → 2','0'],['1','n → 2','1'],['2','n → 2','2']]}],
  ['Call the late-binding functions: every lookup finds 2.',{active:1,rows:[['0',2,0],['1',2,1],['2',2,2]]}],
  ['Default captures instead produce 0, 1, and 2.',{active:2,result:'late: [2,2,2] | fixed: [0,1,2]'}]
 ]);
 add('closure-counters','Independent closure counters','Functions','memory',15,1,
  'Advance one closure’s private counter twice while a separately created closure starts at one.',
  'Each make_counter call creates an independent enclosing count binding. nonlocal updates the correct binding instead of introducing a new local variable.',{names:['counter a','counter b'],objects:['count=0','count=0'],links:[0,1]},[
  ['Create two counters from separate factory calls.',{active:-1}],
  ['Call a(): update its captured count to 1.',{active:0,objects:['count=1','count=0']}],
  ['Call a() again: its state becomes 2.',{active:0,objects:['count=2','count=0']}],
  ['Call b(): its independent state becomes 1.',{active:1,objects:['count=2','count=1'],result:'printed values: 1 2 1'}]
 ]);
 add('representation-context','Representation display lanes','Objects & memory','lanes',8,1,
  'Send the same object through direct printing and container printing.',
  'Direct print uses str, while a list’s representation uses repr for its items. A custom __str__ does not control every display context.',{labels:['print(item)','print([item])'],values:['pending','pending']},[
  ['Start with one Item instance.',{progress:[0,0],active:-1}],
  ['Direct printing selects the friendly string.',{progress:[.7,0],active:0,values:['friendly','pending']}],
  ['List printing requests the item representation.',{progress:[.7,.7],active:1,values:['friendly','Item()']}],
  ['Both results describe the same original object.',{progress:[1,1],values:['friendly','[Item()]'],result:'display context selects the protocol'}]
 ]);
 add('callable-counter','Callable-instance counter dial','Objects & memory','gauge',18,0,
  'Call an instance as if it were a function and keep its state between invocations.',
  '__call__ supplies function-like syntax while ordinary instance attributes retain state. The dial’s numerical scale is illustrative rather than a class limit.',{},[
  ['Construct the Counter with value=0.',{value:0,result:'state 0'}],
  ['callable(counter) confirms call support.',{value:0,result:'callable → True'}],
  ['The first counter() call increments to 1.',{value:10,result:'return 1'}],
  ['The second call observes the retained state and returns 2.',{value:20,result:'return 2',caption:'The same instance owns both updates'}]
 ]);
 add('annotation-portal','Annotation vs runtime portal','Functions','type-portal',19,1,
  'Compare a declared integer contract with what a plain Python function actually executes.',
  'Annotations do not automatically enforce argument or return types. A checker can reject the string call statically, but ordinary runtime multiplication still accepts it.',{labels:['input','annotation','runtime'],values:['ha','int','pending']},[
  ['Supply the string ha to twice(value: int).',{active:0}],
  ['The annotation describes an intended integer input.',{active:1,values:['ha','mismatch','pending']}],
  ['No explicit runtime type check stops the call.',{active:2,values:['ha','not enforced','ha × 2']}],
  ['String repetition returns another string.',{active:2,values:['ha','not enforced','haha'],result:'type of result: str'}]
 ]);
 add('signature-binding','Signature inspection binder','Functions','binder',47,0,
  'Bind a proposed call to an inspected signature, then fill the omitted default.',
  'Signature.bind checks and maps arguments without executing the function. apply_defaults materializes the missing default in the BoundArguments mapping.',{slots:['a','b = 2'],tokens:['3','2'],values:['','']},[
  ['Inspect add(a, b=2).',{bound:-1,result:'signature: (a, b=2)'}],
  ['Bind the supplied positional argument 3 to a.',{bound:0,active:0}],
  ['b is omitted from the proposed call.',{bound:0,active:1,result:'b not supplied'}],
  ['apply_defaults fills b with 2.',{bound:1,active:1,result:'arguments: a=3, b=2'}]
 ]);
 add('wraps-passport','Decorator metadata passport','Functions','passport',72,0,
  'Preserve a wrapped function’s public identity while its wrapper still performs the call.',
  'functools.wraps copies selected metadata and installs __wrapped__. It does not itself forward arguments, cache results, or change the wrapper body.',{heading:'CALLABLE PASSPORT',labels:['__name__','__doc__','__wrapped__'],values:['wrapper','none','none']},[
  ['A plain wrapper initially exposes its own identity.',{active:0}],
  ['wraps restores the original name greet.',{active:0,values:['greet','none','none']}],
  ['It also preserves the greeting docstring.',{active:1,values:['greet','greeting doc','none']}],
  ['A link to the original function supports introspection.',{active:2,values:['greet','greeting doc','original greet'],result:'Readable identity; wrapper behavior remains'}]
 ]);
 add('exception-payload','Custom-exception payload passport','Functions','passport',118,1,
  'Carry a structured field name alongside a readable exception message.',
  'The custom exception stores field as data and passes a message to Exception. Callers can inspect attributes without parsing the display string.',{heading:'MISSING-FIELD ERROR',labels:['type','field','message'],values:['MissingField','—','pending']},[
  ['Construct MissingField for the missing email field.',{active:0}],
  ['Store the structured field attribute.',{active:1,values:['MissingField','email','pending']}],
  ['Build a readable message for the base exception.',{active:2,values:['MissingField','email','Missing: email']}],
  ['A handler can read data and display text independently.',{active:1,result:'field=email; message explains the failure'}]
 ]);
 add('exception-cause','Exception cause chain','Functions','cause-chain',116,0,
  'Translate a low-level parsing failure while keeping its explicit cause available.',
  'raise RuntimeError(...) from error records the ValueError as __cause__. The caller catches the translated type without losing the underlying failure.',{labels:['parser failure','translated error','caller'],values:['ValueError','—','waiting']},[
  ['int("bad") fails at the parsing boundary.',{active:0}],
  ['The handler constructs an application-facing RuntimeError.',{active:1,values:['ValueError','RuntimeError','waiting']}],
  ['from error attaches the original exception as the cause.',{active:1,result:'RuntimeError.__cause__ → ValueError'}],
  ['The caller receives the meaningful error and can inspect its cause.',{active:2,values:['ValueError','RuntimeError','handled']}]
 ]);
 add('eafp-fallback','EAFP lookup fallback','Functions','decision',119,1,
  'Attempt an optional dictionary lookup directly, then handle the specific missing-key failure.',
  'Only the lookup belongs inside this narrow try block. Catching KeyError around unrelated downstream work could hide a different bug.',{labels:['data[city]','lookup result','value exists','KeyError fallback']},[
  ['Attempt the city lookup without a preliminary test.',{path:[0],cursor:0}],
  ['The key is absent, so the operation raises KeyError.',{path:[0,1],cursor:1,values:['city','missing','','']}],
  ['The matching handler supplies unknown.',{path:[0,1,3],cursor:3,values:['city','missing','','unknown']}],
  ['Normal execution resumes with the explicit fallback.',{path:[3],cursor:3,result:'city = unknown'}]
 ]);
 add('frozen-key','Frozen dataclass key vault','Objects & memory','schema',36,2,
  'Read a frozen value object as a dictionary key, then reject ordinary field reassignment.',
  'The example’s hashable fields support generated hashing under normal frozen-dataclass rules. Frozen does not recursively freeze mutable contained objects.',{labels:['code'],required:[0],values:['A']},[
  ['Construct the frozen Key(code="A").',{active:0,result:'field established at construction'}],
  ['Insert it as a dictionary key.',{active:0,result:'hashable value object'}],
  ['An equal Key("A") finds the existing entry.',{active:0,result:'lookup returns value'}],
  ['Assignment to code is rejected.',{active:0,invalid:0,result:'FrozenInstanceError; code remains A'}]
 ]);
 add('instance-lifecycle','Instance construction assembly','Objects & memory','factory',28,0,
  'Create the instance first, then initialize that same instance’s state.',
  '__new__ returns the object; __init__ initializes a suitable instance and must return None. The factory drawing is a conceptual sequence, not interpreter allocation internals.',{gates:['__new__','__init__','ready instance'],items:['Item']},[
  ['Calling Item("book") begins construction.',{positions:[0],active:0,result:'create an instance'}],
  ['__new__ returns the new Item object.',{positions:[1],active:1,result:'same object enters initialization'}],
  ['__init__ stores name="book".',{positions:[1],active:1,result:'self.name = book'}],
  ['Return the initialized object to the caller.',{positions:[2],active:2,result:'instance.name → book'}]
 ]);
 add('classmethod-constructor','Subclass constructor routing','Objects & memory','junction',7,1,
  'Bind cls to the subclass so an inherited alternate constructor creates the right concrete type.',
  'Admin.from_text receives Admin as cls. Returning cls(...) preserves the subclass; hard-coding User(...) would not.',{labels:['User class','Admin class','constructed object'],values:['base','subclass','pending']},[
  ['Call Admin.from_text with padded text.',{cursor:0,active:1,result:'Ada'}],
  ['Bind cls to Admin rather than User.',{cursor:1,active:1,result:'cls=Admin'}],
  ['Strip surrounding whitespace and construct cls(name).',{cursor:2,active:2,values:['User','Admin','Admin']}],
  ['The result has type Admin and name Ada.',{cursor:2,active:2,result:'Admin / Ada'}]
 ]);
 add('abstract-contract','Abstract-class contract checklist','Objects & memory','blueprint',51,1,
  'Satisfy an abstract method requirement before constructing a concrete subclass.',
  'An ABC prevents instantiation while abstract requirements remain. It does not prove that a concrete area implementation is mathematically correct.',{labels:['Shape.area','Square.area','instance','result'],values:['abstract','missing','blocked','—']},[
  ['Shape declares area as abstract.',{active:0}],
  ['Square supplies a concrete area implementation.',{active:1,values:['required','implemented','ready','—']}],
  ['Instantiate Square with side=4.',{active:2,values:['required','implemented','Square(4)','—']}],
  ['Calling area computes 4 squared.',{active:3,values:['required','implemented','Square(4)',16]}]
 ]);
 add('mixin-composition','Mixin capability tree','Objects & memory','tree',96,1,
  'Compose two focused capabilities around one instance’s name attribute.',
  'The mixins supply greeting and labeling behavior but rely on User to supply name. Their requirements should remain explicit and compatible.',{labels:['User','GreetingMixin','LabelMixin','greet()','label()'],edges:[[0,1],[0,2],[1,3],[2,4]]},[
  ['User stores the shared instance data name=Ada.',{path:[0]}],
  ['GreetingMixin reads name and supplies greet().',{path:[0,1,3],values:['','','','Hi Ada','']}],
  ['LabelMixin reads the same name and supplies label().',{path:[0,2,4],values:['','','','','ADA']}],
  ['Both focused capabilities coexist on the same instance.',{path:[1,2,3,4],result:'Hi Ada / ADA'}]
 ]);
 add('observer-broadcast','Observer broadcast hub','Objects & memory','broadcast',97,1,
  'Broadcast one value to independent observers that compute different reactions.',
  'The callbacks are synchronous and follow registration order in this example. Real systems should decide how callback failures and subscription lifetime are handled.',{labels:['double observer','square observer'],center:'3'},[
  ['Register two observers with the subject.',{notified:[],values:['waiting','waiting']}],
  ['Emit the value 3 once.',{notified:[],sending:0,values:['receiving','waiting']}],
  ['The first observer computes double 6.',{notified:[0],sending:1,values:['6','receiving']}],
  ['The second observer computes square 9.',{notified:[0,1],values:['6','9'],result:'one event, two independent reactions'}]
 ]);
 add('descriptor-storage','Descriptor backing-store groups','Objects & memory','groups',34,1,
  'Use one reusable validation rule with distinct backing names for two attributes.',
  '__set_name__ supplies the declared field name so each Positive descriptor selects its own backing attribute. Rejected values are not stored.',{labels:['_width','_height']},[
  ['Two Positive descriptors receive distinct names at class creation.',{groups:[[],[]],result:'separate backing fields'}],
  ['Setting width=3 validates and stores _width.',{groups:[['3'],[]],active:0}],
  ['Setting height=4 validates and stores _height.',{groups:[['3'],['4']],active:1,result:'area: 3 × 4 = 12'}],
  ['Setting width=0 raises; the accepted fields remain intact.',{groups:[['3'],['4']],active:0,result:'ValueError; width is still 3'}]
 ]);
 add('name-mangling','Private-name collision blueprint','Objects & memory','blueprint',144,1,
  'Keep a base class’s internal field distinct from a subclass’s similarly spelled field.',
  'Double-underscore mangling uses the class where the name appears. It prevents accidental collisions but is not access-control security.',{labels:['_Base__value','_Child__value','base method','privacy'],values:['empty','empty','pending','convention']},[
  ['Base initialization stores its mangled field.',{active:0,values:['base','empty','pending','not security']}],
  ['Child initialization stores a different mangled field.',{active:1,values:['base','child','pending','not security']}],
  ['The base method still resolves the Base-qualified name.',{active:2,values:['base','child','reads Base','not security']}],
  ['Both fields coexist in the instance dictionary.',{active:1,result:'base_value() returns base'}]
 ]);
 add('class-shared-list','Class-attribute shared basket','Objects & memory','aliases',145,0,
  'Follow two instances back to one mutable class-level list.',
  'Neither instance initially owns an items attribute, so both inherit the same list reference. Initialize self.items inside __init__ for independent baskets.',{names:['basket a','basket b'],objects:['[]'],links:[0,0]},[
  ['The class creates one list while its body executes.',{active:-1,result:'one class-level items list'}],
  ['Both instances find that same list through class lookup.',{active:0,result:'a.items is b.items'}],
  ['a.items.append(apple) mutates shared state.',{active:0,objects:['[apple]']}],
  ['Reading b.items observes the same mutation.',{active:1,objects:['[apple]'],result:'shared identity → True'}]
 ]);
 add('attribute-shadowing','Instance shadowing ledger','Objects & memory','ledger',145,2,
  'Distinguish an instance rebind from an update to the shared class namespace.',
  'a.count += 1 reads the inherited integer and writes a new instance attribute. Updating Counter.count later affects only instances still falling back to it.',{labels:['lookup','value','source'],rows:[['a.count',0,'class'],['b.count',0,'class'],['Counter',0,'class']]},[
  ['Both instances initially fall back to the class value.',{active:2}],
  ['a.count += 1 creates an instance shadow.',{active:0,rows:[['a.count',1,'instance'],['b.count',0,'class'],['Counter',0,'class']]}],
  ['Set Counter.count to 5.',{active:2,rows:[['a.count',1,'instance'],['b.count',5,'class'],['Counter',5,'class']]}],
  ['a keeps its own value while b sees the new class value.',{active:1,result:'a=1, b=5, class=5'}]
 ]);
 add('weak-cache','Weak-value cache evaporation','Objects & memory','weak',26,1,
  'Let a cache observe a product without becoming its strong owner.',
  'WeakValueDictionary removes an entry when the value loses its strong owners. A cache that must retain data intentionally needs an ordinary strong-reference policy.',{names:['product owner','weak cache'],objects:['Product'],links:[0,0]},[
  ['The product variable strongly owns the instance.',{active:0,live:true,result:'cache entry exists'}],
  ['The weak cache refers to the product without owning it.',{active:1,live:true,result:'item in cache → True'}],
  ['Delete the product owner and permit collection.',{links:[-1,0],live:false,result:'no remaining strong owner'}],
  ['The weak-value entry disappears.',{links:[-1,-1],live:false,result:'item in cache → False'}]
 ]);
 add('pathlib-components','Path component folder map','Text & data','package-map',121,0,
  'Build a path from components, inspect its filename, and return a new suffix variation.',
  'This PurePosixPath example performs no filesystem operations. with_suffix returns a new path value; it does not rename an actual file.',{labels:['notes','chapter.txt']},[
  ['Start from the directory component notes.',{active:0,result:'PurePosixPath'}],
  ['Join chapter.txt using path semantics.',{active:1,result:'notes/chapter.txt'}],
  ['Inspect stem chapter and suffix .txt.',{active:1,result:'stem: chapter | suffix: .txt'}],
  ['Create a new path with suffix .md.',{active:1,labels:['notes','chapter.md'],result:'original path value is unchanged'}]
 ]);
 add('utf8-bridge','UTF-8 character-to-byte bridge','Text & data','bytebridge',122,0,
  'Expand four Unicode code points into five UTF-8 bytes and decode them back.',
  'The accented character requires two bytes in UTF-8. Code-point length, byte length, and rendered grapheme count are different units.',{chars:['c','a','f','é'],bytes:['63','61','66','c3','a9'],mapping:[0,1,2,3,3]},[
  ['The string café contains four code points.',{revealed:-1,active:-1,result:'len(text) = 4'}],
  ['The first three ASCII-range characters use one byte each.',{revealed:2,active:2,result:'63 61 66'}],
  ['The final code point encodes into two UTF-8 bytes.',{revealed:4,active:3,result:'c3 a9'}],
  ['Decoding all five bytes reconstructs the original string.',{revealed:4,active:-1,result:'len(bytes) = 5; round-trip equality True'}]
 ]);
 add('json-container-types','JSON container-type crossing','Text & data','type-portal',123,1,
  'Round-trip a tuple through JSON and notice which Python type does not survive.',
  'JSON arrays do not distinguish Python tuples from lists. A successful value round-trip does not preserve every runtime type or object identity.',{labels:['Python input','JSON data','Python result'],values:['tuple','array','pending']},[
  ['Begin with the tuple (1,2).',{active:0,result:'Python tuple input'}],
  ['Serialize its elements as a JSON array.',{active:1,values:['(1,2)','[1,2]','pending'],result:'JSON has an array, not a tuple type'}],
  ['Parse that array with json.loads.',{active:2,values:['tuple','array','list'],result:'the loader constructs a list'}],
  ['The resulting values are [1,2], with type list.',{active:2,result:'data retained; tuple type not retained'}]
 ]);
 add('csv-writer','CSV quoting composer','Text & data','text-transform',124,2,
  'Produce a quoted field when a value contains a comma, then serialize the following column.',
  'csv.writer applies quoting rules automatically. Hand-built comma joining would turn the comma inside the name into an unintended field separator.',{source:'Ada, A. | 7',operation:'csv.writer ↓'},[
  ['Supply two field values to the writer.',{target:'',result:'name and numeric score'}],
  ['Detect the comma inside the name field.',{target:'',selected:[3],result:'the comma belongs inside one field'}],
  ['Wrap that field in quotes.',{target:'"Ada, A."',selected:[0,8],result:'one correctly quoted name'}],
  ['Append the field separator and score.',{target:'"Ada, A.",7',result:'"Ada, A.",7'}]
 ]);
 add('nan-checks','NaN comparison switch','Text & data','circuit',128,1,
  'Use category predicates instead of equality to recognize a non-finite numeric value.',
  'NaN compares unequal to itself. math.isnan detects the category, while math.isfinite excludes both NaN and infinity.',{labels:['value = NaN','which check?','value == value','math.isnan']},[
  ['Construct a not-a-number float.',{path:[0],cursor:0,result:'NaN'}],
  ['Self-equality is not a NaN detection test.',{path:[0,1,2],cursor:2,values:['NaN','','False','']}],
  ['math.isnan explicitly identifies the value.',{path:[0,1,3],cursor:3,values:['NaN','','False','True']}],
  ['A finiteness check rejects NaN and infinity.',{path:[0,1],cursor:1,result:'isfinite(NaN) → False'}]
 ]);
 add('fraction-balance','Exact rational balance','Text & data','balance',127,0,
  'Combine integer ratios exactly and reduce their common-denominator result.',
  'Fraction preserves exact rational arithmetic for these inputs. The balance is symbolic, not a measurement scale; decimal float construction follows different conversion semantics.',{left:'1/3 + 1/6',right:'1/2'},[
  ['Start with one third and one sixth.',{active:0,tilt:0,result:'exact input ratios'}],
  ['Express one third as two sixths.',{active:0,left:'2/6 + 1/6',right:'3/6',result:'common denominator 6'}],
  ['Add numerators to obtain three sixths.',{active:1,left:'3/6',right:'1/2',result:'equal mathematical values'}],
  ['Reduce by their common factor.',{active:1,left:'1/2',right:'1/2',result:'numerator 1; denominator 2'}]
 ]);
 add('bool-int-family','Bool and int family tree','Text & data','tree',128,0,
  'Separate subtype relationships, exact types, and numeric behavior for boolean values.',
  'bool inherits from int but remains a distinct exact type. Decide whether your API intentionally accepts booleans as integers rather than assuming every isinstance match means the same contract.',{labels:['object','int','float','bool','True + True'],edges:[[0,1],[0,2],[1,3],[3,4]]},[
  ['Place bool underneath int in the type relationship.',{path:[0,1,3]}],
  ['isinstance(True,int) follows that inheritance.',{path:[1,3],values:['','','','True','']}],
  ['An exact type comparison still distinguishes bool from int.',{path:[3],result:'type(True) is int → False'}],
  ['Numeric operations treat True as 1 and False as 0.',{path:[3,4],values:['','','','','2'],result:'True + True = 2'}]
 ]);
 add('unicode-casefold','Unicode casefold transformation','Text & data','text-transform',129,1,
  'Compare lowercasing with the stronger caseless transformation used by casefold.',
  'This example’s German sharp-s case becomes ss under casefold. That does not establish a universal rule for every language or confusable character; retain original display text.',{source:'Straße',operation:'casefold ↓'},[
  ['Compare the inputs Straße and STRASSE.',{target:'STRASSE',result:'different raw strings'}],
  ['Lowercasing alone leaves distinct comparison keys.',{source:'straße',target:'strasse',operation:'lower comparison',result:'lower equality → False'}],
  ['Casefold expands the sharp-s in this word.',{source:'Straße',target:'strasse',operation:'casefold ↓',selected:[4,5],result:'a stronger caseless key'}],
  ['Both casefolded keys compare equal.',{source:'strasse',target:'strasse',operation:'compare keys',result:'casefold equality → True'}]
 ]);
 add('protocol-runtime','Protocol presence vs signature','Objects & memory','type-portal',136,2,
  'Pass a shallow runtime member check, then expose an incompatible method signature.',
  '@runtime_checkable checks supported member presence, not the full method signature or return behavior. A static checker and behavioral tests serve different roles.',{labels:['Wrong instance','presence check','run() call'],values:['run(required)','pending','pending']},[
  ['Provide an object with a method named run.',{active:0,result:'method exists'}],
  ['The runtime protocol presence check succeeds.',{active:1,values:['run(required)','True','pending'],result:'presence is not full compatibility'}],
  ['The caller tries the promised no-extra-argument operation.',{active:2,values:['run(required)','True','missing arg'],result:'signature does not match'}],
  ['The actual invocation raises TypeError.',{active:2,values:['run(required)','True','TypeError'],result:'a checker can flag this mismatch'}]
 ]);
 add('generic-type-flow','Generic first-element flow','Functions','pipeline',137,0,
  'Track how a generic annotation connects an input element type to the return type.',
  'TypeVar expresses a static relationship, not a runtime conversion. The function still requires a nonempty list; a type relationship does not prove value-level conditions.',{gates:['list input','T relationship','first result'],items:['int','str']},[
  ['A call supplies a list of integers.',{positions:[0,0],result:'first([1,2])'}],
  ['A checker relates the integer element type to T.',{positions:[1,0],token:0,result:'T = int for this call'}],
  ['The ordinary function returns the first value 1.',{positions:[2,0],token:0,result:'runtime result: 1'}],
  ['A separate string call infers str and returns Ada.',{positions:[2,2],token:1,result:'same implementation, different type relationship'}]
 ]);
 add('typeddict-form','TypedDict required/optional form','Objects & memory','schema',138,0,
  'Describe a required name and an optional city while the runtime value remains a plain dictionary.',
  'TypedDict supplies a checking-time shape rather than runtime schema validation. NotRequired controls key presence, which is different from permitting None as a field value.',{labels:['name','city'],required:[0],values:['absent','absent']},[
  ['Declare name as required and city as optional.',{active:0,result:'static record shape'}],
  ['Create a dictionary with name=Ada.',{active:0,values:['Ada','absent']}],
  ['Use get to supply unknown when the optional city is absent.',{active:1,values:['Ada','unknown fallback']}],
  ['Inspect the runtime value: it is an ordinary dict.',{active:0,result:'type(user).__name__ → dict'}]
 ]);
 add('logging-thresholds','Logging threshold checkpoints','Text & data','log-rail',139,1,
  'Pass records through a logger threshold and a separate handler threshold.',
  'A record allowed by the logger can still be dropped by a handler. This scene models the named logger’s DEBUG threshold and its handler’s WARNING threshold.',{labels:['logger: DEBUG','handler: WARNING','output'],values:['ready','ready','empty']},[
  ['Emit an INFO record.',{active:0,values:['INFO passes','ready','empty']}],
  ['The handler drops INFO because it is below WARNING.',{active:1,values:['INFO passes','INFO rejected','empty']}],
  ['Emit WARNING: it passes both thresholds.',{active:1,values:['WARNING passes','WARNING passes','pending']}],
  ['The destination receives the attention message.',{active:2,values:['passed','passed','attention']}]
 ]);
 add('mock-call-log','Mock interaction ledger','Functions','ledger',140,0,
  'Record a dependency request, return controlled data, and verify the meaningful interaction.',
  'The mock isolates the loader boundary. The test checks both the visible greeting and the identifier passed to the dependency rather than only reproducing the implementation.',{labels:['interaction','observed value'],rows:[['argument','pending'],['result','pending'],['call assertion','pending']]},[
  ['Configure the loader to return a known name.',{active:1,rows:[['argument','pending'],['result','name=Ada'],['call assertion','pending']]}],
  ['greeting calls the loader with identifier 7.',{active:0,rows:[['argument','7'],['result','name=Ada'],['call assertion','pending']]}],
  ['The visible greeting is Hi Ada.',{active:1,result:'greeting result verified'}],
  ['assert_called_once_with(7) verifies the boundary request.',{active:2,rows:[['argument','7'],['result','Hi Ada'],['call assertion','passed']]}]
 ]);
 add('main-guard','Script/import entry-point fork','Functions','branch',141,1,
  'Run the same trusted source under imported and direct-execution namespace names.',
  'This fixed exec input models two namespaces. Top-level statements run in both; only the guarded body depends on __name__ being __main__.', {labels:['top-level code','__name__ check','module import','direct script']},[
  ['Execute the top-level statement in the imported-module model.',{path:[0],cursor:0,result:'top level runs'}],
  ['The imported namespace does not satisfy the main guard.',{path:[0,1,2],cursor:2,values:['runs','not __main__','skip guard','']}],
  ['The script model also executes the top-level statement.',{path:[0],cursor:0,result:'top level runs again'}],
  ['Its __main__ name selects the guarded branch.',{path:[0,1,3],cursor:3,values:['runs','__main__','','guarded runs']}]
 ]);
 add('relative-import','Relative-import package map','Text & data','package-map',142,1,
  'Resolve a leading-dot module request using its explicit package context.',
  'The dot is relative to xml.etree as a package hierarchy, not an arbitrary working directory. This imports a real standard-library module.',{labels:['xml','etree','ElementTree']},[
  ['Start with package context xml.etree.',{active:1,result:'known package hierarchy'}],
  ['Resolve the relative name .ElementTree under that package.',{active:2,result:'xml.etree.ElementTree'}],
  ['Retrieve the resulting module object.',{active:2,result:'module name is fully qualified'}],
  ['Use Element("item") from the resolved module.',{active:2,result:'element tag: item'}]
 ]);
 add('contextvar-lanes','ContextVar task-local lanes','Concurrency','lanes',149,1,
  'Set independent contextual bindings in two tasks without overwriting the parent context.',
  'Task contexts preserve independent bindings across suspension. Context copying is not a deep copy of arbitrary mutable values stored inside a ContextVar.',{labels:['task A context','task B context','parent context'],values:['parent','parent','parent']},[
  ['The tasks begin from the parent context.',{progress:[0,0,0],active:2}],
  ['Task A binds its own name to A.',{progress:[.4,0,0],active:0,values:['A','parent','parent']}],
  ['Task B binds its own name to B.',{progress:[.4,.4,0],active:1,values:['A','B','parent']}],
  ['Both bindings survive an await and return independently.',{progress:[1,1,0],values:['A','B','parent'],result:'gather returns [A,B]; parent stays parent'}]
 ]);
 add('taskgroup-cleanup','TaskGroup sibling-cleanup tree','Concurrency','fanout',150,2,
  'Propagate a child failure through group cancellation and sibling cleanup before the parent handles it.',
  'TaskGroup owns child lifetime. The waiting task’s finally runs during cancellation, then the parent handles the grouped ValueError. Cancellation is cooperative.',{labels:['TaskGroup','waiting child','failing child','finally cleanup','except* handler'],edges:[[0,1],[0,2],[1,3],[2,4]]},[
  ['Create two related children inside the group.',{path:[0,1,2]}],
  ['One child suspends; the other raises ValueError.',{path:[1,2],values:['','','ValueError','','']}],
  ['The group requests cancellation of its waiting sibling.',{path:[0,1],values:['','cancelled','ValueError','','']}],
  ['The sibling runs its finally cleanup.',{path:[1,3],values:['','cancelled','ValueError','cleanup','']}],
  ['Only after group cleanup does the parent handle the failure.',{path:[3,4],values:['','done','failed','cleanup','handled'],result:'events: cleanup and failure'}]
 ]);
 if(additions.length!==44)throw Error('The second visual expansion must contain exactly 44 experiments');
 root.LABS.push(...additions);
})(typeof window!=='undefined'?window:globalThis);
