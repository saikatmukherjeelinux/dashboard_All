const assert=require('assert/strict'),path=require('path'),fs=require('fs'),{spawnSync}=require('child_process');
const {solve}=require('../assets/interview-pattern-engine.js');
const catalog=require('../assets/interview-pattern-catalog.js');
assert.equal(catalog.length,27);assert.equal(new Set(catalog.map(l=>l.id)).size,27);
const bundled=path.resolve(path.dirname(process.execPath),'../../python/python.exe');
const python=process.env.PYTHON||(fs.existsSync(bundled)?bundled:process.platform==='win32'?'python':'python3');
const reference=spawnSync(python,[path.join(__dirname,'test_patterns.py'),'--fixtures'],{encoding:'utf8',maxBuffer:8*1024*1024});
if(reference.status!==0)throw Error(reference.stderr||reference.error);
const cases=JSON.parse(reference.stdout);
for(const {id,data,expected} of cases){
 const before=JSON.stringify(data),trace=solve(id,data);
 assert.deepEqual(trace.result,expected,JSON.stringify({id,data}));
 assert.equal(JSON.stringify(data),before,'Mutated input '+id);
 assert.deepEqual(trace.frames.at(-1).result,expected);
 assert.ok(trace.frames.length>=1);
}
for(const [id,data,message] of [
 ['dutch',{nums:[3]},/0, 1/],['rotated',{nums:[2,1,3],target:1},/rotation/],
 ['rotated',{nums:[1,1],target:1},/distinct/],['quickselect',{nums:[],k:1},/k must/],
 ['window_max',{nums:[1,2],k:0},/k must/],['queens',{n:9},/n must/],
 ['islands',{grid:[[1],[0,1]]},/rectangular/],['islands',{grid:[[2]]},/0s and 1s/],
 ['union_find',{n:2,edges:[[0,2]]},/vertex/],['fenwick',{nums:[1],updates:[[1,3]],queries:[]},/index/],
 ['combination',{nums:[0,1],target:3},/positive/],['permutations',{nums:[1,1]},/distinct/],
 ['gas_station',{gas:[1],cost:[]},/same length/],['partition',{nums:[101]},/integer/],
 ['product_except',{nums:Array(10).fill(100)},/exact integer/]
])assert.throws(()=>solve(id,data),message);
assert.equal(solve('queens',{n:8}).result.length,92);
assert.equal(solve('permutations',{nums:[1,2,3,4,5,6]}).result.length,720);
console.log(`${cases.length} interview-pattern results agree with independently tested Python references across all 27 additions; validation and upper-bound backtracking cases pass`);
