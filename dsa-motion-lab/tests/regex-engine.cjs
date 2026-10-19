const assert=require('assert/strict'),path=require('path'),fs=require('fs');
const {spawnSync}=require('child_process');
const {solve}=require('../assets/regex-engine.js');
const recipes=require('../assets/regex-catalog.js');
assert.equal(recipes.length,30);assert.equal(new Set(recipes.map(r=>r.id)).size,30);
const bundled=path.resolve(path.dirname(process.execPath),'../../python/python.exe');
const python=process.env.PYTHON||(fs.existsSync(bundled)?bundled:process.platform==='win32'?'python':'python3');
const reference=spawnSync(python,[path.join(__dirname,'test_regex.py'),'--fixtures'],{encoding:'utf8',maxBuffer:8*1024*1024});
if(reference.status!==0)throw Error(reference.stderr||reference.error);
const cases=JSON.parse(reference.stdout);
for(const test of cases){
 const trace=solve({mode:test.mode},test.text,test.pattern,test.flags,test.replacement);
 assert.deepEqual(trace.result,test.expected,JSON.stringify(test));
 assert.deepEqual(trace.frames.at(-1).result,test.expected);
 assert.ok(trace.frames.length>=2);
 for(const match of trace.matches){assert.ok(match.start<=match.end);assert.equal(Array.from(test.text).slice(match.start,match.end).join(''),match.match);}
}
for(const flags of ['ii','g','u','x','i\n',' '])assert.throws(()=>solve({mode:'matches'},'a','a',flags),/Flags/);
assert.throws(()=>solve({mode:'matches'},'a','('),/Invalid/);
assert.throws(()=>solve({mode:'matches'},'a'.repeat(257),'a'),/256/);
assert.throws(()=>solve({mode:'matches'},'a','a'.repeat(161)),/160/);
assert.throws(()=>solve({mode:'replace'},'a','a','','b'.repeat(81)),/80/);
console.log(`${cases.length} regex cases agree with Python references across 30 recipes, plus invalid flags/patterns and length limits`);
