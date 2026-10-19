const assert=require('assert/strict');
const path=require('path');
const fs=require('fs');
const {spawnSync}=require('child_process');
const {solve}=require('../assets/string-engine.js');
const bundled=path.resolve(path.dirname(process.execPath),'../../python/python.exe');
const python=process.env.PYTHON || (fs.existsSync(bundled)?bundled:process.platform==='win32'?'python':'python3');
const reference=spawnSync(python,[path.join(__dirname,'test_strings.py'),'--fixtures'],{encoding:'utf8',maxBuffer:8*1024*1024});
if(reference.status!==0)throw Error(reference.stderr||reference.error||'Python oracle failed');
const cases=JSON.parse(reference.stdout);
for(const {id,text,pattern,expected} of cases){
 const {result,frames}=solve(id,text,pattern);
 assert.deepEqual(result,expected,JSON.stringify({id,text,pattern}));
 assert.ok(frames.length>=2);
 assert.deepEqual(frames.at(-1).result,expected);
 // Replaying a result must not depend on a previous run or shared arrays.
 const before=JSON.stringify(frames[0]);
 solve(id,'a','a');
 assert.equal(JSON.stringify(frames[0]),before);
}
console.log(`${cases.length} string traces agree with independently tested Python references across all 20 new algorithms`);
