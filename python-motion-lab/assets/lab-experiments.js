/* Fifty concept-specific traces, paired with already checked Python examples. */
(function(root){
 'use strict';
 const additions=[];
 function add(id,title,category,style,lesson,example,intro,insight,base,steps){
  const source=()=>root.LESSONS.find(l=>l.id===lesson).examples[example];
  additions.push({id,title,category,style,lessons:[lesson],intro,insight,tag:category.toUpperCase()+' / '+style.toUpperCase(),options:'',
   build(){return steps.map(([status,state],i)=>({status,scene:{...base,...state,type:style,step:i,title,description:title+': '+status}}));},
   code(){return source().code;},output(){return source().output;}
  });
 }
 add('scope-radar','LEGB scope radar','Functions','scope',106,0,
  'Follow a name lookup outward through nested scope rings until the enclosing binding is found.',
  'The rings depict lookup order, not physical memory. inner reads the enclosing name; len falls through to builtins. Assignment can change which scope a name belongs to.',{},[
  ['Enter inner(): begin in its local scope.',{cursor:0,result:'request: name'}],
  ['No local name binding: expand the search.',{cursor:1,result:'local: miss'}],
  ['Find name in the enclosing outer() scope.',{cursor:2,result:'enclosing: found'}],
  ['Return the enclosing value; the global binding stays separate.',{cursor:3,result:'name → enclosing'}],
  ['A different lookup for len can continue to builtins.',{cursor:4,result:'len → builtins'}]
 ]);
 add('closure-capture','Closure capture map','Functions','memory',15,0,
  'Watch returned functions retain separate connections to their captured factor bindings.',
  'Each factory call supplies a distinct enclosing binding. The returned functions retain access after the factory returns; a closure captures bindings rather than automatically snapshotting every value.',{names:['double','triple'],objects:['factor=2','factor=3'],links:[-1,-1]},[
  ['Create multiplier(2).',{active:0,links:[-1,-1],result:'new enclosing environment'}],
  ['Return double, retaining factor=2.',{active:0,links:[0,-1],result:'double → factor 2'}],
  ['Create multiplier(3) and return triple.',{active:1,links:[0,1],result:'triple → factor 3'}],
  ['double(5) reads its own captured factor.',{active:0,links:[0,1],result:'5 × 2 = 10'}],
  ['triple(5) reads the other environment.',{active:1,links:[0,1],result:'5 × 3 = 15'}]
 ]);
 add('argument-docking','Argument docking station','Functions','binder',108,2,
  'Dock positional and named values into the parameters of a mixed calling convention.',
  'The slash controls positional-only parameters; the star controls keyword-only parameters. Defaults supply values when omitted. The diagram shows the first report call in the snippet.',{slots:['code /','name','* active'],tokens:['7','Ada','False'],values:['','','']},[
  ['Read the report signature; no values are bound yet.',{bound:-1}],
  ['Bind the first positional argument to code.',{bound:0,active:0}],
  ['Bind name="Ada" by keyword.',{bound:1,active:1}],
  ['Bind active=False by its required keyword.',{bound:2,active:2}],
  ['The call body can now use all three bound values.',{bound:2,result:'(7, Ada, False)'}]
 ]);
 add('default-alias','Mutable-default echo','Functions','aliases',107,0,
  'See two omitted arguments return to the same default list instead of creating fresh lists.',
  'The default list is created once when def executes. The two calls reuse it. The safe None-sentinel alternative is shown in the related lesson.',{names:['call 1','call 2'],objects:['[]'],links:[-1,-1]},[
  ['Define add(): create one default list.',{objects:['[]'],links:[-1,-1],result:'default created once'}],
  ['First call omits items and binds the existing default.',{active:0,links:[0,-1]}],
  ['Append A to that shared list.',{active:0,objects:['[A]'],links:[0,-1],result:'first result: [A]'}],
  ['Second call omits items and reuses the same object.',{active:1,objects:['[A]'],links:[0,0]}],
  ['Append B: the earlier default state remains.',{active:1,objects:['[A, B]'],links:[0,0],result:'second result: [A, B]'}]
 ]);
 add('recursion-tower','Recursion tower','Functions','stack',148,0,
  'Stack factorial call frames until the base case, then follow the return values upward.',
  'The tower illustrates factorial(5), not the interpreter’s exact frame layout. Each non-base call waits for the smaller problem. Python does not promise tail-call elimination.',{maxDepth:6,labels:['factorial(5)','factorial(4)','factorial(3)','factorial(2)','factorial(1)','factorial(0)']},[
  ['Call factorial(5).',{depth:1}],['Defer multiplication while computing factorial(4).',{depth:2}],
  ['Continue through factorial(3) and factorial(2).',{depth:4}],['Reach factorial(0), whose result is 1.',{depth:6}],
  ['Return through the waiting multiplication frames.',{depth:3,returning:true,result:'2'}],
  ['factorial(5) finishes with 120.',{depth:1,returning:true,result:'120'}],['The call tower empties after return.',{depth:0,caption:'Result: 120'}]
 ]);
 add('partial-gears','Partial-application gears','Functions','gears',147,0,
  'Lock a factor into one gear, then supply a later value to complete the multiplication.',
  'partial retains the callable and bound arguments; it does not rewrite the original function. The gear analogy is conceptual, not an execution-speed claim.',{fixed:'factor=2'},[
  ['Start with multiply(factor, value).',{cursor:0,result:'7'}],
  ['partial binds factor=2 once.',{cursor:1,result:'7'}],
  ['double(7) supplies the remaining value.',{cursor:2,result:'7'}],
  ['The original callable receives both arguments.',{cursor:3,result:'14'}],
  ['The configured callable is reusable.',{cursor:0,result:'14'}]
 ]);
 add('comprehension-factory','Comprehension factory','Iteration','factory',110,0,
  'Send numbers through an even-value gate and a square machine into a result tray.',
  'The scene models the list comprehension, which eagerly collects matching results. The dictionary comprehension in the accompanying snippet is a separate operation.',{gates:['input','even?','square'],items:[1,2,3,4]},[
  ['Load the four input numbers.',{positions:[0,0,0,0],result:'output: []'}],
  ['Reject 1 because its remainder is not zero.',{positions:[1,0,0,0],rejected:[0],token:0}],
  ['Pass 2 and square it.',{positions:[1,2,0,0],rejected:[0],token:1,result:'output: [4]'}],
  ['Reject 3 at the even-value gate.',{positions:[1,2,1,0],rejected:[0,2],token:2}],
  ['Pass 4, producing 16.',{positions:[1,2,1,2],rejected:[0,2],token:3,result:'output: [4, 16]'}]
 ]);
 add('map-filter-sieve','Map/filter sieve','Iteration','sieve',57,0,
  'Compare transformation with selection: map changes values, while filter keeps matching original values.',
  'The first lane transforms all values into squares; the second selection rejects odd values. map and filter are lazy until consumed by list in the snippet.',{gates:['source','predicate','result'],items:[1,2,3,4]},[
  ['Create the source sequence.',{positions:[0,0,0,0],result:'input: 1, 2, 3, 4'}],
  ['Map transforms the first two values.',{items:[1,4,3,4],positions:[2,2,0,0],result:'squares: 1, 4, …'}],
  ['Map finishes all four transformations.',{items:[1,4,9,16],positions:[2,2,2,2],result:'map: [1, 4, 9, 16]'}],
  ['Now filter the original sequence by evenness.',{items:[1,2,3,4],positions:[1,2,1,2],rejected:[0,2],result:'filter: [2, 4]'}]
 ]);
 add('yield-relay','Yield-from relay','Iteration','lanes',42,1,
  'Pass control from the parent generator to its child, then resume the parent after delegation.',
  'Delegation yields the child’s values without turning them into one nested item. This is a conceptual control handoff, not simultaneous execution of two generator bodies.',{labels:['parent message()','child letters()'],values:['start','waiting']},[
  ['The parent yields start.',{progress:[.1,0],active:0,result:'output: start'}],
  ['yield from delegates to letters().',{progress:[.35,.1],active:1,values:['suspended','A']}],
  ['The child yields A and B.',{progress:[.35,.65],active:1,values:['suspended','B'],result:'output: start, A, B'}],
  ['The child ends; the parent resumes.',{progress:[.65,1],active:0,values:['resume','done']}],
  ['The parent yields end and finishes.',{progress:[1,1],active:0,values:['end','done'],result:'output: start, A, B, end'}]
 ]);
 add('zip-zipper','Zip zipper','Iteration','zipper',146,1,
  'Bring two streams together and see what happens when one has an unmatched item.',
  'Default zip stops at the shortest stream. strict=True detects the mismatch during consumption. The unmatched 2 must not be invented into a pair.',{left:[1,2],right:['A']},[
  ['Create two streams with unequal lengths.',{cursor:0,result:'left: 2 items; right: 1 item'}],
  ['Pull one value from each stream.',{cursor:1,result:'pair: (1, A)'}],
  ['The right stream is exhausted before the next pair.',{cursor:1,result:'2 remains unmatched'}],
  ['Ordinary zip stops; strict zip raises ValueError.',{cursor:1,result:'strict=True → length mismatch'}]
 ]);
 add('short-circuit','Short-circuit gate','Functions','circuit',113,1,
  'Trace a boolean circuit and watch an unneeded function call remain switched off.',
  'and/or return operands and evaluate only as far as needed. These examples return booleans because their determining operands are False and True.',{labels:['left operand','operator','evaluate right','skip right']},[
  ['Start False and check().',{path:[0],values:['False','and','',''],cursor:0,result:'False'}],
  ['and already knows the expression is false-like.',{path:[0,1,3],values:['False','and','','skipped'],cursor:3,result:'False'}],
  ['Start True or check().',{path:[0],values:['True','or','',''],cursor:0,result:'True'}],
  ['or already has its truthy result; check never runs.',{path:[0,1,3],values:['True','or','','skipped'],cursor:3,result:'True'}]
 ]);
 add('truth-switch','Truthiness switchboard','Functions','decision',113,2,
  'Route zero through a truthiness fallback and through an explicit missing-value check.',
  'Zero is false-like but is not None. The two routes implement different data contracts rather than interchangeable spellings of the same test.',{labels:['value = 0','which test?','or fallback','is None check']},[
  ['Receive a supplied numeric zero.',{path:[0],cursor:0,result:'0'}],
  ['The or expression checks truthiness.',{path:[0,1,2],cursor:2,values:['0','false-like','10',''],result:'10'}],
  ['The explicit None test asks a different question.',{path:[0,1,3],cursor:3,values:['0','not missing','','0'],result:'0'}],
  ['A real None value uses the missing-value fallback.',{path:[0,1,3],cursor:3,values:['None','missing','','10'],result:'10'}]
 ]);
 add('pattern-tree','Pattern-matching decision tree','Text & data','branch',112,1,
  'Match a mapping’s shape first, then use a guard to choose a score branch.',
  'Mapping patterns can accept extra keys. A guard runs after successful capture. The first matching case wins without fall-through.',{labels:['record','score present?','score ≥ 10','fallback']},[
  ['Read the record containing score=12.',{path:[0],cursor:0,values:['12','','','']}],
  ['The mapping pattern finds and captures score.',{path:[0,1],cursor:1,values:['12','yes','','']}],
  ['The guard succeeds, selecting high.',{path:[0,1,2],cursor:2,values:['12','yes','high',''],result:'high'}],
  ['A score of 3 falls through to the low case.',{path:[0,1,3],cursor:3,values:['3','yes','','low'],result:'low'}],
  ['An empty mapping falls through to missing.',{path:[0,3],cursor:3,values:['{}','no','','missing'],result:'missing'}]
 ]);
 add('exception-cascade','Exception cascade','Functions','waterfall',117,1,
  'Follow a failed conversion past the success branch and down through handling and cleanup.',
  'except and else are alternative paths for this conversion, but finally accompanies exit. Returning from finally can override outcomes and should usually be avoided.',{labels:['try int()','except ValueError','else skipped','finally'],values:['bad','','','']},[
  ['Attempt int("bad") inside try.',{active:0}],
  ['ValueError transfers control to its matching handler.',{active:1,values:['error','failed','','']}],
  ['The success-only else branch does not run.',{active:2,values:['error','handled','skipped','']}],
  ['finally still runs cleanup.',{active:3,values:['error','handled','skipped','cleanup'],result:'failed → cleanup'}]
 ]);
 add('context-airlock','Context-manager airlock','Functions','airlock',11,1,
  'Enter a managed scope, do work, then pass through its guaranteed exit path.',
  'The lifecycle ring shows the contextlib generator from the snippet: setup happens before yield and finally performs cleanup. The ring is a model of scope transitions, not repeated automatic execution.',{labels:['created','open','work','close']},[
  ['Construct a new context-manager instance.',{active:0}],
  ['Entering runs setup before the single yield.',{active:1,result:'open'}],
  ['The body uses the yielded ready value.',{active:2,result:'ready'}],
  ['The body raises ValueError and exits the scope.',{active:2,result:'exception'}],
  ['finally closes the session before the outer handler.',{active:3,result:'close → handled'}]
 ]);
 add('exception-splitter','Exception-group splitter','Functions','fanout',120,1,
  'Split one grouped failure into the matching ValueError and TypeError handlers.',
  'except* selects matching subgroups rather than treating the whole group as one ValueError. Unhandled members would continue propagating.',{labels:['ExceptionGroup','ValueError','TypeError','values handler','types handler'],edges:[[0,1],[0,2],[1,3],[2,4]]},[
  ['Raise the group containing two different failures.',{path:[0],active:0}],
  ['Partition members by the first handler’s type.',{path:[0,1],active:1}],
  ['Handle the ValueError subgroup.',{path:[1,3],active:3,values:['','','','1 member','']}],
  ['Handle the separate TypeError subgroup.',{path:[2,4],active:4,values:['','','','','1 member']}],
  ['Both subgroups are handled in this example.',{path:[3,4],result:'values 1 / types 1'}]
 ]);
 add('cycle-sweeper','Cycle-collection sweeper','Objects & memory','gc',56,1,
  'Remove the root reference to a self-cycle, then watch unreachable ownership get swept away.',
  'This models reachability, not the garbage collector’s exact internal algorithm or timing. A weak reference observes the node without keeping it alive.',{names:['node','weak observer'],objects:['self-cycle'],links:[0,-1]},[
  ['The root owns a node, and the node references itself.',{active:0,result:'reachable from node'}],
  ['The weak observer does not add strong ownership.',{active:1,result:'weak observer only'}],
  ['Delete the external node binding.',{links:[-1,-1],result:'isolated cycle'}],
  ['Request cyclic collection of unreachable objects.',{links:[-1,-1],swept:true,live:false,result:'gc.collect()'}],
  ['The weak reference now returns None.',{links:[-1,-1],swept:true,live:false,result:'referent is gone'}]
 ]);
 add('weak-bridge','Weak-reference ghost bridge','Objects & memory','weak',26,0,
  'Compare a strong owner’s solid bridge with a weak observer’s dashed, non-owning link.',
  'weakref.ref returns the referent or None. Unlike a strong reference, the dashed observer link cannot keep the object alive.',{names:['user','weak ref'],objects:['User'],links:[0,0]},[
  ['Create a User and a weak observer.',{active:0,live:true,result:'strong owner: user'}],
  ['Read through ref() while the owner exists.',{active:1,live:true,result:'ref() is user → True'}],
  ['Delete user: remove strong ownership.',{links:[-1,0],live:false,result:'weak link cannot retain object'}],
  ['After collection, ref() returns None.',{links:[-1,-1],live:false,result:'ref() is None → True'}]
 ]);
 add('slots-blueprint','Slots blueprint','Objects & memory','blueprint',13,0,
  'Fill declared attribute compartments, then try to add an undeclared field to the blueprint.',
  'Slots reserve named instance storage in this class and omit an ordinary instance dictionary. Inheritance can change that behavior; slots do not make values immutable.',{labels:['x','y','z','__dict__'],values:['empty','empty','not declared','absent']},[
  ['The class declares only x and y slots.',{active:0}],
  ['Initialization stores x=2.',{active:0,values:[2,'empty','not declared','absent']}],
  ['Initialization stores y=3.',{active:1,values:[2,3,'not declared','absent']}],
  ['No instance __dict__ is available here.',{active:3,values:[2,3,'not declared','False']}],
  ['An assignment to undeclared z is rejected.',{active:2,blocked:2,values:[2,3,'AttributeError','False']}]
 ]);
 add('descriptor-elevator','Descriptor lookup elevator','Objects & memory','elevator',34,2,
  'Move an attribute request through precedence levels and stop at the data descriptor.',
  'The Fixed descriptor defines __set__, so its getter wins over the same-named instance dictionary entry. The elevator illustrates normal lookup precedence for this instance.',{labels:['data descriptor','instance dict','class fallback','__getattr__'],values:['10','99','','']},[
  ['Request item.value through normal lookup.',{active:0,cursor:0}],
  ['Find a data descriptor on the class.',{active:0,cursor:0,result:'__get__ returns 10'}],
  ['The shadowing dictionary value exists but loses precedence.',{active:1,cursor:1,values:['10','99 ignored','','']}],
  ['Return to the winning data descriptor.',{active:0,cursor:0,result:'read: 10'}],
  ['The descriptor’s setter rejects a later write.',{active:0,cursor:0,values:['read-only','99','',''],result:'AttributeError'}]
 ]);
 add('property-gauge','Property validation gauge','Objects & memory','gauge',24,1,
  'Turn a balance dial, then see an invalid assignment rejected before stored state changes.',
  'The gauge range is an illustration, not a limit enforced by Account. The actual rule rejects negative values. The setter stores _balance only after validation.',{},[
  ['Construct Account(10) through its balance setter.',{value:10,result:'balance = 10'}],
  ['The property getter returns the accepted stored value.',{value:10,result:'read: 10'}],
  ['Attempt balance=-1, which fails validation.',{value:0,result:'reject -1',caption:'Invalid input does not become stored state'}],
  ['The existing balance remains unchanged.',{value:10,result:'still 10'}]
 ]);
 add('metaclass-forge','Metaclass class forge','Objects & memory','factory',5,1,
  'Move a class namespace through a metaclass stamping station before an instance is made.',
  'The metaclass transforms the class namespace during creation. Both class access and instance lookup can then see the new tag attribute.',{gates:['namespace','metaclass','class object'],items:['Invoice']},[
  ['Prepare the Invoice class namespace.',{positions:[0],result:'name: Invoice'}],
  ['Tagged.__new__ receives name, bases, and namespace.',{positions:[1],active:1}],
  ['Stamp tag="invoice" into the namespace.',{positions:[1],active:1,result:'namespace gains tag'}],
  ['Create the class object with the augmented namespace.',{positions:[2],active:2,result:'Invoice.tag → invoice'}],
  ['An instance can also find the inherited class attribute.',{positions:[2],active:2,result:'Invoice().tag → invoice'}]
 ]);
 add('dispatch-junction','Single-dispatch rail junction','Functions','junction',88,0,
  'Route values to implementations based on the type of the first argument.',
  'singledispatch uses the first argument’s type and applicable inheritance. It does not choose by the function’s return type or by every argument together.',{labels:['int handler','str handler?','generic fallback'],values:['integer','not registered','other']},[
  ['Receive describe(4).',{cursor:0,active:-1,result:'4'}],
  ['Select the registered int implementation.',{cursor:1,active:0,result:'int'}],
  ['Return integer from that implementation.',{cursor:2,active:0,result:'integer'}],
  ['Receive describe("four"); no str implementation is registered.',{cursor:0,active:-1,result:'str'}],
  ['Route to the generic fallback and return other.',{cursor:1,active:2,result:'other'}]
 ]);
 add('enum-dial','Enum selection dial','Objects & memory','dial',135,1,
  'Select a member from a closed domain and reject a value outside that domain.',
  'The dial is a domain-selection metaphor, not a restriction on workflow transitions. Status("done") returns the existing member; unknown raw values raise.',{labels:['NEW','DONE','unknown']},[
  ['Begin with the declared status domain.',{active:0,angle:0,result:'new'}],
  ['Convert the raw value done.',{active:1,angle:120,result:'done'}],
  ['Retrieve the existing Status.DONE member.',{active:1,angle:120,result:'same member'}],
  ['Attempt the undeclared raw value missing.',{active:2,angle:240,result:'missing'}],
  ['Reject the conversion with ValueError.',{active:2,angle:240,result:'rejected'}]
 ]);
 add('dataclass-ledger','Dataclass assembly ledger','Objects & memory','ledger',36,0,
  'Populate annotated fields and see generated initialization, representation, and equality behavior.',
  'Dataclasses generate common methods from fields. Annotations identify fields but do not automatically enforce their runtime types.',{labels:['field','first value','default'],rows:[['x','—','required'],['y','—',0],['__repr__','pending','generated']]},[
  ['Declare the annotated x and y fields.',{active:0}],
  ['Point(2) supplies x explicitly.',{active:0,rows:[['x',2,'required'],['y','—',0],['__repr__','pending','generated']]}],
  ['The initializer supplies y=0 from its default.',{active:1,rows:[['x',2,'required'],['y',0,0],['__repr__','pending','generated']]}],
  ['The generated representation includes both fields.',{active:2,rows:[['x',2,'required'],['y',0,0],['__repr__','Point(2,0)','generated']]}],
  ['Two Point(2,3) values compare equal.',{active:2,result:'equality → True'}]
 ]);
 add('hash-buckets','Hash-bucket router','Collections','buckets',62,0,
  'Follow equal tuple keys to the same illustrative bucket and retrieve the stored value.',
  'These four buckets are a teaching model, not CPython’s dictionary layout or a real hash value. Equal hashable keys must share a hash; unequal keys can still collide.',{},[
  ['Start with an empty conceptual dictionary.',{buckets:[[],[],[],[]],result:'no entries'}],
  ['Compute a hash for the tuple (A, 1).',{active:1,buckets:[[],[],[],[]],result:'model bucket: 1'}],
  ['Store the key and value in that bucket.',{active:1,buckets:[[],['(A,1)'],[],[]],result:'value: found'}],
  ['A distinct but equal tuple selects the same hash path.',{active:1,buckets:[[],['(A,1)'],[],[]],result:'equal key → same hash'}],
  ['The key equality check locates the stored entry.',{active:1,buckets:[[],['found'],[],[]],result:'lookup result: found'}]
 ]);
 add('counter-bars','Counter live histogram','Collections','bars',131,0,
  'Build a frequency chart one letter at a time while counting banana.',
  'Each bar is an accumulated count, not a sorted sequence of input characters. Counter supplies zero for an absent key, and most_common can select the dominant value.',{labels:['b','a','n']},[
  ['Begin with zero counts.',{values:[0,0,0],result:'input: banana'}],
  ['Consume b.',{values:[1,0,0],active:0,result:'b → 1'}],
  ['Consume a.',{values:[1,1,0],active:1,result:'a → 1'}],
  ['Consume n, then a.',{values:[1,2,1],active:1}],
  ['Consume n, then the final a.',{values:[1,3,2],active:1}],
  ['a is the most common symbol.',{values:[1,3,2],active:1,result:'most_common(1): a, 3'}]
 ]);
 add('grouping-garden','Defaultdict grouping garden','Collections','groups',131,1,
  'Grow independent city groups as records arrive, creating a container only when needed.',
  'defaultdict(list) calls list for each newly indexed key. The factory is not one shared list; get would not invoke the same missing-key creation behavior.',{labels:['city A','city B']},[
  ['No group has members yet.',{groups:[[],[]]}],
  ['Create group A and append Ada.',{groups:[['Ada'],[]],active:0}],
  ['Create a separate group B and append Grace.',{groups:[['Ada'],['Grace']],active:1}],
  ['Append Lin to the existing group A.',{groups:[['Ada','Lin'],['Grace']],active:0}],
  ['The two group lists remain independent.',{groups:[['Ada','Lin'],['Grace']],result:'A: Ada, Lin | B: Grace'}]
 ]);
 add('deque-train','Deque shunting train','Collections','deque',132,2,
  'Rotate the last wagon to the front, then attach a new wagon at the left end.',
  'A deque is efficient at both ends. Rotation rearranges the existing elements; appendleft introduces a new element. It is not the same as a sorted priority queue.',{},[
  ['Start with the deque [1,2,3].',{values:[1,2,3],active:2}],
  ['Detach the rightmost wagon for rotate(1).',{values:[1,2],removed:3}],
  ['Move that same wagon to the left.',{values:[3,1,2],active:0}],
  ['appendleft(0) attaches a new leading wagon.',{values:[0,3,1,2],active:0}],
  ['The final deque order is [0,3,1,2].',{values:[0,3,1,2],result:'left → 0, 3, 1, 2 → right'}]
 ]);
 add('heap-tree','Heap priority tree','Collections','heap',133,0,
  'Repair a min-heap and repeatedly remove its smallest item from the root.',
  'Tree positions model parent/child relationships in the backing list. The heap invariant is local ordering, not a globally sorted list.',{},[
  ['Load values [5,1,3] before heapify.',{values:[5,1,3],active:0}],
  ['Heapify moves the minimum to the root.',{values:[1,5,3],active:0}],
  ['heappop removes 1 and restores the heap.',{values:[3,5],active:0,result:'output: [1]'}],
  ['Pop 3 next.',{values:[5],active:0,result:'output: [1,3]'}],
  ['Pop 5 and finish.',{values:[],result:'output: [1,3,5]'}]
 ]);
 add('bisect-boundaries','Bisect boundary scanner','Collections','numberline',134,0,
  'Slide boundary markers over a sorted list containing duplicate values.',
  'Left insertion goes before ties; right insertion goes after ties. The final right position can be between items. Binary search assumes the sequence is already sorted.',{values:[1,2,2,4]},[
  ['Search the sorted sequence for target 2.',{index:1,result:'target 2',low:0,high:3}],
  ['The left boundary is before the first 2.',{index:1,result:'left = 1',low:1,high:2}],
  ['The right boundary is after the second 2.',{index:3,result:'right = 3',low:1,high:2}],
  ['Subtract boundaries to count equal items.',{index:2,result:'3 − 1 = 2',low:1,high:2}]
 ]);
 add('stable-sort','Stable-sort card dance','Collections','sort',115,0,
  'Move records into key order while tied records keep their previous relative positions.',
  'This is a visual trace of the required stable result, not a trace of Python’s internal sorting algorithm. Ada remains before Lin because both keys are 2.',{colors:{Ada:0,Grace:1,Lin:2}},[
  ['Begin with records in arrival order.',{values:[['Ada',2],['Grace',1],['Lin',2]],selected:[]}],
  ['Compare the displayed sort keys.',{values:[['Ada',2],['Grace',1],['Lin',2]],selected:[0,1]}],
  ['Grace moves before the records with key 2.',{values:[['Grace',1],['Ada',2],['Lin',2]],selected:[0]}],
  ['Preserve Ada before Lin within the tied key.',{values:[['Grace',1],['Ada',2],['Lin',2]],selected:[1,2],result:'stable tie order: Ada → Lin'}]
 ]);
 add('set-venn','Set-operation Venn stage','Collections','venn',39,2,
  'Light up membership regions for union, intersection, and difference.',
  'The circles depict set membership rather than stored item order. frozenset operations return new values; they do not mutate either input.',{left:[1],both:[2],right:[3]},[
  ['Define A={1,2} and B={2,3}.',{selected:[],result:'two immutable input sets'}],
  ['Union includes all members in either set.',{selected:[1,2,3],result:'A | B = {1,2,3}'}],
  ['Intersection selects the shared member.',{selected:[2],result:'A & B = {2}'}],
  ['Difference keeps only members of A outside B.',{selected:[1],result:'A − B = {1}'}],
  ['The original frozen sets remain unchanged.',{selected:[],result:'A and B are still the same values'}]
 ]);
 add('alias-ripple','List-alias mutation ripple','Objects & memory','aliases',45,0,
  'Watch one append travel through two names that point to a single mutable list.',
  'The two variables are not two copied lists. A mutation changes one object, and both aliases observe it. This differs from rebinding one name.',{names:['a','b'],objects:['[1,2]'],links:[0,-1]},[
  ['Create a = [1,2].',{active:0,result:'one list object'}],
  ['Assign b = a without copying.',{active:1,links:[0,0],result:'two names, one object'}],
  ['Call b.append(3).',{active:1,links:[0,0],objects:['[1,2,3]'],result:'mutate shared list'}],
  ['Read a: it sees the same appended value.',{active:0,links:[0,0],objects:['[1,2,3]'],result:'a is b → True'}]
 ]);
 add('tuple-locks','Tuple slot locks','Objects & memory','grid',45,2,
  'Separate immutable tuple slots from a mutable object contained in one of those slots.',
  'Tuple immutability fixes its references, not all reachable contents. Appending to the referenced list is allowed, while replacing a tuple slot is not.',{columns:2,indices:true},[
  ['Create a tuple containing a list and a string.',{values:['[1,2]','fixed'],selected:[]}],
  ['Follow slot 0 to its mutable inner list.',{values:['[1,2]','fixed'],selected:[0]}],
  ['Append 3 to that list without replacing the tuple slot.',{values:['[1,2,3]','fixed'],selected:[0],result:'nested mutation allowed'}],
  ['Try to replace slot 1.',{values:['[1,2,3]','fixed'],selected:[1],result:'TypeError: tuple slot is fixed'}]
 ]);
 add('buffer-window','Memoryview buffer window','Objects & memory','window',69,1,
  'Move a highlighted window over shared byte storage, then edit through the slice.',
  'The view slice refers to the existing bytearray buffer. tobytes in the snippet is the operation that creates a separate bytes copy.',{values:['a','b','c','d'],columns:4},[
  ['Create bytearray(b"abcd").',{selected:[],result:'one writable buffer'}],
  ['Create a memoryview over that buffer.',{selected:[0,1,2,3],result:'view: all bytes'}],
  ['Slice view[1:3] without copying storage.',{selected:[1,2],result:'part: bytes 1 and 2'}],
  ['Write Z through part[0], which is data[1].',{values:['a','Z','c','d'],selected:[1],result:'original becomes aZcd'}],
  ['Read part.tobytes(), then release the views.',{values:['a','Z','c','d'],selected:[1,2],result:'copied bytes: Zc'}]
 ]);
 add('unicode-orbit','Unicode composition orbit','Text & data','orbit',129,0,
  'Compare one composed code point with a base character and combining mark, then normalize.',
  'The orbit is a code-point composition metaphor, not a model of font rendering. NFC makes these canonically equivalent sequences compare equal; not every visual look-alike is equivalent.',{labels:['U+0065','U+0301','U+00E9']},[
  ['The composed string uses U+00E9.',{active:2,angle:240,result:'length 1'}],
  ['The decomposed string uses two code points.',{active:0,angle:0,result:'length 2'}],
  ['Raw code-point sequences compare unequal.',{active:1,angle:120,result:'not equal'}],
  ['NFC composes this equivalent pair.',{active:2,angle:240,result:'equal after NFC'}]
 ]);
 add('regex-scanner','Regex scanning ribbon','Text & data','ribbon',130,0,
  'Move a search cursor across text and contrast prefix matching with whole-input matching.',
  'search can find digits after a prefix; match requires position zero; fullmatch requires complete coverage. This highlights match locations without implementing a general regex engine.',{text:'item 123'},[
  ['Start a digit search at the beginning.',{cursor:0,selected:[0],result:'search: scan prefix'}],
  ['Advance past nonmatching letters and the space.',{cursor:4,selected:[4],result:'no digit yet'}],
  ['Find the digit run 123.',{cursor:5,selected:[5,6,7],result:'search → True'}],
  ['match cannot skip the leading item prefix.',{cursor:0,selected:[0],result:'match → False'}],
  ['fullmatch rejects 123x because x remains.',{text:'123x',cursor:3,selected:[3],result:'fullmatch → False'}]
 ]);
 add('fstring-composer','F-string interpolation ribbon','Text & data','typewriter',17,0,
  'Replace an expression slot with its current value, then finish a new string.',
  'Expressions are evaluated while constructing the string. The result does not remain a live link to the original variables.',{},[
  ['Read the template Hello {name}.',{text:'Hello {name}',selected:[6,7,8,9,10,11],result:'template'}],
  ['Resolve name from the current scope.',{text:'Hello {name}',selected:[7,8,9,10],output:'name → Ada'}],
  ['Insert Ada in place of the expression.',{text:'Hello Ada',selected:[6,7,8],output:'Hello Ada'}],
  ['Evaluate count + 1 for the second string.',{text:'Next count: 4',selected:[12],output:'3 + 1 → 4'}]
 ]);
 add('json-tree','JSON structure tree','Text & data','json',123,0,
  'Walk between a Python mapping and the object structure described by JSON text.',
  'The tree shows data structure, not a complete JSON parser. JSON booleans use true/false spellings, while the loaded Python values use True/False.',{labels:['object','name','active','Ada','True'],edges:[[0,1],[0,2],[1,3],[2,4]]},[
  ['Start with a Python dictionary.',{path:[0]}],
  ['Serialize name as a JSON string.',{path:[0,1,3],values:['','','','string','']}],
  ['Serialize True using JSON’s true spelling.',{path:[0,2,4],values:['','','','','true']}],
  ['Parse the text back into a mapping.',{path:[0,1,2],values:['dict','','','','']}],
  ['Reading active returns Python True.',{path:[2,4],values:['dict','','','','True']}]
 ]);
 add('csv-tape','CSV quote-state tape','Text & data','parser',124,0,
  'Move a reader through a quoted field and keep the comma inside that field.',
  'This trace explains the quoted record in the snippet. It is not a complete dialect parser; use Python’s csv module for real files.',{text:'"Ada, A.",London'},[
  ['Opening quote enters quoted-field state.',{cursor:0,selected:[0],result:'inside quotes'}],
  ['The comma inside the quotes belongs to the name.',{cursor:4,selected:[1,2,3,4,5,6,7],result:'one field so far'}],
  ['Closing quote ends that quoted field.',{cursor:8,selected:[8],result:'name: Ada, A.'}],
  ['The following comma separates fields.',{cursor:9,selected:[9],result:'start city field'}],
  ['Read London as the second field.',{cursor:10,selected:[10,11,12,13,14,15],output:'[Ada, A.] [London]'}]
 ]);
 add('float-balance','Floating-point balance','Text & data','balance',126,0,
  'Contrast exact equality with a tolerance-based comparison for 0.1 + 0.2.',
  'The tilt exaggerates a tiny binary-representation difference for visibility. It is not a numeric scale drawing. math.isclose needs tolerances appropriate to the application.',{left:'0.1 + 0.2',right:'0.3'},[
  ['Start with the intended decimal comparison.',{tilt:0,active:0,result:'same mathematical intent'}],
  ['Binary floats approximate the decimal inputs.',{tilt:3,active:0,left:'0.300000…004',result:'finite binary representation'}],
  ['Exact equality sees different float values.',{tilt:5,active:1,left:'0.300000…004',result:'== → False'}],
  ['A suitable tolerance treats them as close.',{tilt:0,left:'0.300000…004',result:'isclose → True'}]
 ]);
 add('decimal-rounding','Decimal rounding cursor','Text & data','rounding',126,2,
  'Choose between neighboring decimal hundredths using an explicit tie-breaking rule.',
  'The number-line labels show an exact midpoint at 2.345. ROUND_HALF_UP selects 2.35. This rule differs from other rounding modes and from binary-float formatting.',{values:['2.34','2.345','2.35'],indices:false},[
  ['Construct Decimal("2.345") from text.',{index:1,result:'exact input'}],
  ['Request a quantum of 0.01.',{index:1,result:'two decimal places'}],
  ['The value is halfway between the neighbors.',{index:1,result:'tie'}],
  ['ROUND_HALF_UP selects the upper neighbor.',{index:2,result:'2.35'}],
  ['The immutable original still represents 2.345.',{index:1,result:'original unchanged'}]
 ]);
 add('timezone-clock','Timezone conversion clock','Text & data','clock',125,1,
  'Rotate clock labels while retaining the same underlying instant across offsets.',
  'UTC 12:00 and +05:30 17:30 are the same instant here. The dial is illustrative, and the fixed offset does not model seasonal timezone rules.',{labels:['UTC 12:00','+05:30','17:30']},[
  ['Start with an aware UTC timestamp.',{active:0,angle:0,result:'12:00'}],
  ['Choose the fixed +05:30 offset.',{active:1,angle:165,result:'+05:30'}],
  ['astimezone adjusts clock fields for that offset.',{active:2,angle:165,result:'17:30'}],
  ['Both aware timestamps represent one instant.',{active:2,angle:165,result:'equality True'}]
 ]);
 add('process-lanes','Threads vs processes lanes','Concurrency','lanes',31,2,
  'Send a list into a separate worker process and return a changed value without editing the parent list.',
  'The lanes represent isolated process state. Ordinary pool arguments and results are communicated values, not one automatically shared mutable list. This is not a performance benchmark.',{labels:['parent process','worker process'],values:['[1,2]','waiting']},[
  ['The parent owns its original list.',{progress:[.05,0],active:0}],
  ['Send the argument to the worker.',{progress:[.3,.15],active:1,values:['[1,2]','[1,2]']}],
  ['The worker appends 3 to its received list.',{progress:[.3,.6],active:1,values:['[1,2]','[1,2,3]']}],
  ['Return the changed list as a result.',{progress:[.75,1],active:0,values:['result received','[1,2,3]']}],
  ['The parent’s original list is still [1,2].',{progress:[1,1],active:0,values:['[1,2]','[1,2,3]'],result:'original and returned value differ'}]
 ]);
 add('lock-crossing','Lock-protected intersection','Concurrency','crossing',1,1,
  'Permit one worker at a time to enter a shared counter’s critical section.',
  'The crossing compresses 1000 updates per thread into a few representative steps. The lock protects each update; a GIL is not an application-level invariant guarantee.',{},[
  ['Both workers are ready; the lock is free.',{owner:null,values:['ready','ready'],result:'count starts at 0'}],
  ['Worker A acquires the lock.',{owner:'A',values:['update','wait'],result:'one owner'}],
  ['A releases; worker B can enter.',{owner:'B',values:['wait','update'],result:'serialized protected updates'}],
  ['The workers repeat their protected increments.',{owner:'A',values:['update','wait'],result:'1000 increments each'}],
  ['Join both workers before reading the total.',{owner:null,values:['done','done'],result:'count = 2000'}]
 ]);
 add('semaphore-pool','Semaphore permit pool','Concurrency','pool',154,0,
  'Allocate two permits among waiting tasks and return them when tasks leave the region.',
  'The scene shows representative admissions from the five tasks in the snippet. A semaphore limits simultaneous entry, not requests per second.',{capacity:2,labels:['task A','task B','task C']},[
  ['Two permits are initially available.',{permits:2,running:[],done:[]}],
  ['A acquires the first permit.',{permits:1,running:[0],done:[]}],
  ['B acquires the second; C must wait.',{permits:0,running:[0,1],done:[]}],
  ['A finishes and releases a permit.',{permits:1,running:[1],done:[0]}],
  ['C acquires the released permit.',{permits:0,running:[1,2],done:[0]}],
  ['All tasks eventually exit; active returns to zero.',{permits:2,running:[],done:[0,1,2],result:'maximum 2; final active 0'}]
 ]);
 add('event-wave','Event signal waveform','Concurrency','wave',153,0,
  'Raise and clear a shared flag while observing whether waiting would proceed.',
  'An Event retains set state until clear. It does not count repeated signals or carry a sequence of messages; the waveform is a state illustration.',{labels:['waiter A','waiter B']},[
  ['The flag begins clear; an immediate wait fails.',{signal:[0,0,0,0,0],high:false,result:'wait(timeout=0) → False'}],
  ['set() raises the flag.',{signal:[0,0,1,1,1],high:true,result:'all current waiters may proceed'}],
  ['A later immediate wait also succeeds while set.',{signal:[1,1,1,1,1],high:true,result:'wait(timeout=0) → True'}],
  ['clear() resets the persistent flag.',{signal:[1,1,0,0,0],high:false,result:'is_set() → False'}]
 ]);
 add('queue-conveyor','Producer/consumer conveyor','Concurrency','pipeline',152,0,
  'Move work through a synchronized queue to a worker, then deliver a shutdown sentinel.',
  'The single worker processes the input order. task_done balances queue accounting, while thread.join separately confirms thread termination.',{gates:['producer','Queue','worker'],items:['2','3','None']},[
  ['Prepare two work items and a shutdown sentinel.',{positions:[0,0,0],result:'no work processed'}],
  ['Enqueue the first item and let the worker get it.',{positions:[2,0,0],token:0,result:'worker computes 4'}],
  ['Account for that item and process the second.',{positions:[2,2,0],token:1,result:'results: [4,9]'}],
  ['Deliver None to request worker exit.',{positions:[2,2,2],token:2,result:'sentinel received'}],
  ['Finish queue accounting and join the worker.',{positions:[2,2,2],result:'queue complete; thread exited'}]
 ]);
 add('cancellation-machine','Async cancellation state machine','Concurrency','states',16,2,
  'Request cancellation of a suspended task and follow cleanup before the caller handles the signal.',
  'Cancellation is delivered cooperatively. The first sleep(0) gives the worker time to enter its try block. Finally runs before the parent observes CancelledError.',{labels:['created','suspended','cancel requested','cleaned up']},[
  ['create_task schedules the worker.',{active:0,result:'pending'}],
  ['The worker enters try and suspends in sleep.',{active:1,result:'waiting'}],
  ['The caller invokes cancel().',{active:2,result:'request'}],
  ['The suspended task unwinds and runs finally.',{active:3,result:'cleanup'}],
  ['Awaiting the task observes CancelledError.',{active:3,result:'cancelled'}]
 ]);
 if(additions.length!==50)throw Error('Visual lab extension must contain exactly fifty experiments');
 root.LABS.push(...additions);
})(typeof window!=='undefined'?window:globalThis);
