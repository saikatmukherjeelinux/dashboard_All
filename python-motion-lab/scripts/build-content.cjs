// Regenerate the browser lesson bank from the original notes. No packages required.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const additional = require('../content/additional/index.cjs');
if(additional.length !== 96 || new Set(additional.map(l=>l.id)).size !== 96) throw Error('Expected exactly 96 distinct additional lessons');
const packs = [...require('../content/examples/index.cjs'), ...additional.map(l=>({ids:[l.id],summary:l.summary,examples:l.examples}))];
const enhancements = new Map();
for (const pack of packs) for (const id of pack.ids) {
  if (enhancements.has(id)) throw Error(`Duplicate example coverage for question ${id}`);
  if (!pack.summary || pack.examples.length < 3) throw Error(`Incomplete examples for question ${id}`);
  enhancements.set(id, pack);
}
const source = fs.readFileSync(path.join(root, 'content/python-notes.md'), 'utf8').replace(/\r\n/g, '\n');
const lessons = [];
let current, fence = false;
for (const line of source.split('\n')) {
  if (/^\s*```/.test(line)) fence = !fence;
  const match = !fence && line.match(/^#{1,3}\s+(?:\*\*)?(\d+)[.)]\s*(.+)$/);
  if (match && (!current || +match[1] > current.id)) {
    current = {id: +match[1], title: match[2].replace(/\*\*/g, '').trim(), lines: []};
    lessons.push(current);
  } else if (current) current.lines.push(line);
}
if (fence) throw Error('Unclosed source fence');
for(const lesson of additional) {
  if(lessons.some(l=>l.id===lesson.id)) throw Error(`Duplicate lesson ID ${lesson.id}`);
  lessons.push({...lesson,lines:lesson.body.split('\n')});
}
function category(title) {
  if (/gil|thread|coroutine|async|multiprocessing|event loop/i.test(title)) return 'Concurrency';
  if (/memory|garbage|reference|copy|mutable|immutable|__del__|slots/i.test(title)) return 'Memory & objects';
  if (/generator|iterator|yield|lazy|itertools|map.*filter/i.test(title)) return 'Iteration';
  if (/decorator|memoization|closure|lru_cache|wraps|annotations|args|docstring|overloading|singledispatch/i.test(title) && !/staticmethod|classmethod|property/i.test(title)) return 'Functions';
  if (/class|method|property|descriptor|dunder|magic|__str__|__repr__|__call__|__new__|__init__|super|mixin|singleton|observer|duck typing/i.test(title)) return 'Classes & design';
  return 'Python toolkit';
}
const names = {
  1:'The Global Interpreter Lock',2:'Memory management',3:'Generators',4:'Decorators',5:'Metaprogramming & metaclasses',6:'Monkey patching',7:'Static methods vs class methods',8:'__str__ vs __repr__',9:'Coroutines vs threads',10:'Memoization',11:'Context managers',12:'Shallow vs deep copying',13:'Memory optimization with slots',14:'Method overloading',15:'Closures',16:'Async & await',17:'F-strings',18:'Callable objects',19:'Function annotations',20:'Dunder methods',21:'MRO & C3 linearization',22:'Duck typing',23:'Generators vs iterators',24:'Property decorators',25:'eval & its risks',26:'Weak references',27:'The asyncio event loop',28:'__new__ vs __init__',29:'Identity vs equality',30:'Circular imports',31:'Processes vs threads',32:'Named tuples',33:'Coroutines',34:'Descriptors',35:'__slots__',36:'Dataclasses: benefits & limitations',37:'The LRU cache',38:'Magic methods',39:'Frozen sets',40:'Class & static method decorators',41:'Finalizers & __del__',42:'Delegating with yield from',44:'Introspection',45:'Mutable vs immutable objects',46:'Duck typing in practice',47:'The inspect module',48:'Metaclass use cases',49:'Generator exceptions',50:'The with statement',51:'Abstract base classes',52:'yield vs yield from',53:'Weak-reference use cases',54:'The contextlib module',55:'Resolving circular imports',56:'Reference counting & cycle collection',57:'map, filter & reduce',58:'*args & **kwargs',59:'The singleton pattern',60:'Runtime monkey patching',61:'Properties & encapsulation',62:'Hashing objects',63:'Overloading alternatives',64:'The copy module',65:'Using frozen sets',66:'Method chaining',67:'Assertions',68:'Lazy evaluation',69:'Memory views',70:'The itertools module',71:'Creating metaclasses',72:'Preserving metadata with wraps',73:'The weakref module',74:'Static vs class methods: revision',75:'Closures in practice',76:'Object finalization',77:'Docstrings',78:'Implementing __call__',79:'frozenset use cases',80:'copy vs deepcopy: revision',81:'Cooperative calls with super',82:'Methods & properties',83:'Implementing descriptors',84:'Implementing memoization',85:'The contextmanager decorator',86:'Instance creation & initialization',87:'Using dataclasses',88:'Single dispatch',89:'Slots & instance attributes',90:'Metaclasses vs regular classes',91:'Immutable sets: revision',92:'Fluent method chaining',93:'Coroutines vs functions',94:'Closure use cases',95:'Building custom iterators',96:'Mixins',97:'The Observer pattern',98:'Weak-reference proxies',99:'Abstract class contracts',100:'The __hash__ contract',101:'Method resolution: revision',102:'Monkey patching trade-offs',103:'Nested copies: revision',104:'Circular-import best practices',105:'Instance, static & class methods'
};
for (const l of lessons) {
  l.body = l.lines.join('\n').trim().replace(/(```python\n)python\nCopy code\n/g, '$1');
  l.category = l.category || category(l.title);
  l.label = l.label || l.title.replace(/`/g,'').replace(/^(Explain (the (difference between |purpose and use of |purpose of |use of )?)?|What (is|are) (the )?|How (does|do) |How can you |When would you )/i,'').replace(/\??\.?$/, '');
  l.label = names[l.id] || l.label;
  if (l.label.length > 56) l.label = l.label.slice(0, 53) + '…';
  const pack = enhancements.get(l.id);
  if (!pack) throw Error(`Missing worked examples for question ${l.id}`);
  l.examples = pack.examples;
  l.summary = pack.summary;
  l.minutes = Math.max(1, Math.ceil([l.body, l.summary, ...l.examples.flatMap(e=>[e.code,e.output,...e.explanation])].join(' ').split(/\s+/).length / 210));
  delete l.lines;
}
fs.writeFileSync(path.join(root, 'assets/lessons.js'), '/* Generated by scripts/build-content.cjs. */\nwindow.LESSONS = ' + JSON.stringify(lessons) + ';\n');
console.log(`Generated ${lessons.length} lessons across ${new Set(lessons.map(l => l.category)).size} categories. Original numbering preserved (43 is absent in the source).`);
console.log(`Added ${lessons.reduce((n,l)=>n+l.examples.length,0)} worked-example placements from ${packs.length} concept packs, with a closing summary for every lesson.`);
