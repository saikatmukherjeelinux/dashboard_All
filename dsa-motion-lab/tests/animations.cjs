const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
class Element{constructor(){this.value='';this.children=[];this.childNodes=[];this.dataset={};this.style={};this.classList={toggle(){}};}closest(){return {parentElement:new Element(),childNodes:[],prepend(){}};}appendChild(e){this.children.push(e);}prepend(e){this.children.unshift(e);}append(e){this.appendChild(e);}replaceChildren(){this.children=[];}addEventListener(){}setAttribute(){}removeAttribute(){}querySelectorAll(){return [];} }
const els={};const document={getElementById(id){return els[id]??=new Element();},createElement(){return new Element();},querySelectorAll(){return [];}};
const ctx=vm.createContext({document,localStorage:{getItem(){return null},setItem(){}},navigator:{},setTimeout,clearTimeout,console});
els.input=new Element();els.input.value='8, 3, 5, 1, 9, 2';
vm.runInContext(fs.readFileSync('assets/app.js','utf8'),ctx);vm.runInContext(fs.readFileSync('assets/extensions.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('assets/explanations.js','utf8'),ctx);
els.matchText=new Element();els.matchText.value='ABACABAB';els.matchPattern=new Element();els.matchPattern.value='ABAB';
vm.runInContext(fs.readFileSync('assets/advanced.js','utf8'),ctx);
for(const file of ['string-engine','string-python','string-lessons'])vm.runInContext(fs.readFileSync('assets/'+file+'.js','utf8'),ctx);
for(const file of ['regex-engine','regex-catalog','regex-python','regex-lessons'])vm.runInContext(fs.readFileSync('assets/'+file+'.js','utf8'),ctx);
for(const file of ['interview-core','interview-strings','interview-regex','interview','interview-pattern-engine','interview-pattern-catalog','pattern-python','interview-pattern-questions','interview-pattern-lessons'])vm.runInContext(fs.readFileSync('assets/'+file+'.js','utf8'),ctx);
function run(code){return vm.runInContext(code,ctx);}let checks=0;
for(const id of ['bubble','selection','insertion','merge','quick','heap'])for(const a of [[5,-2,5,0,1],[1],[9,8,7,6],[-9,-3,-5]]){run(`choose('${id}');$('input').value='${a.join(',')}';produce();`);assert.deepEqual(JSON.parse(run('JSON.stringify(frames.at(-1).a)')),[...a].sort((a,b)=>a-b));checks++;}
for(const id of ['linear','binary']){run(`choose('${id}');$('target').value='999';produce();`);assert.match(run('frames.at(-1).msg'),/not found/);checks++;}
run("choose('kadane');$('input').value='-8,-2,-9';produce()");assert.match(run('frames.at(-1).msg'),/Maximum sum -2/);
run("choose('prefix');$('input').value='3,-5,4';produce()");assert.equal(run('JSON.stringify(frames.at(-1).a)'),'[3,-2,2]');
run("choose('fibonacci');$('input').value='1,2,3,4,5,6,7';produce()");assert.equal(run('JSON.stringify(frames.at(-1).a)'),'[0,1,1,2,3,5,8]');
for(const id of run('lessons.map(l=>l.id)'))run(`choose('${id}');index=frames.length-1;render();`);
run("choose('bubble');$('input').value='bad';rebuild()");assert.equal(run('frames.length'),0);
console.log(`${checks+21} animation, rendering, and input checks passed`);

for(const id of run('lessons.map(l=>l.id)')){run('choose('+JSON.stringify(id)+')');assert.match(els.simpleGuide.innerHTML,/A tiny example/);assert.match(els.simpleGuide.innerHTML,/When would I use it/);}
console.log('All 100 beginner guides render successfully');

run("choose('dijkstra')");assert.equal(run('JSON.stringify(frames.at(-1).table)'),'[0,3,2,8,10,13]');
run("choose('kruskal')");assert.match(run('frames.at(-1).msg'),/total weight 13/);assert.equal(run('frames.at(-1).chosen.length'),5);
run("choose('topological')");const order=run('frames.at(-1).vertices');for(const [a,b] of run('dependencyEdges'))assert.ok(order.indexOf(a)<order.indexOf(b));
run("choose('lis');$('input').value='2,2,2';produce()");assert.match(run('frames.at(-1).msg'),/Length 1/);
run("choose('lis');$('input').value='-4,-3,-2,-1';produce()");assert.match(run('frames.at(-1).msg'),/Length 4/);
run("choose('coin')");assert.match(run('frames.at(-1).msg'),/Fewest coins: 2/);
run("$('input').value='2,4';$('target').value='3';produce()");assert.match(run('frames.at(-1).msg'),/unreachable/);
run("$('target').value='0';produce()");assert.match(run('frames.at(-1).msg'),/Fewest coins: 0/);
run("$('input').value='0,1';rebuild()");assert.equal(run('frames.length'),0);
run("$('input').value='1,3';$('target').value='41';rebuild()");assert.equal(run('frames.length'),0);
run("choose('kmp');$('matchText').value='ABACABAB';$('matchPattern').value='ABAB';produce()");assert.match(run('frames.at(-1).msg'),/index 4/);assert.equal(run('JSON.stringify(frames.at(-1).table)'),'[0,0,1,2]');
for(const [text,pattern,expected] of [['AAAAAB','AAAB',2],['ABC','D',-1],['ABC','',0],['','A',-1],['🙂a🙂b','🙂b',2]]){
 els.matchText.value=text;els.matchPattern.value=pattern;run('produce()');assert.match(run('frames.at(-1).msg'),expected<0?/not found/:new RegExp('index '+expected+'$'));
}
console.log('Advanced graph, DP, validation, and string matching checks passed');
