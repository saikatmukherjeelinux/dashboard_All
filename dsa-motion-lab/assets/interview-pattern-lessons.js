const patternIds=new Set(PatternCatalog.map(l=>l.id));
function formatPatternInput(data){return '{\n'+Object.entries(data).map(([key,value])=>'  '+JSON.stringify(key)+': '+JSON.stringify(value)).join(',\n')+'\n}';}
for(const config of PatternCatalog){lessons.push({...config,type:'interview-pattern',desc:config.idea,how:config.idea,cost:`${config.complexity}. ${config.watch} Stored animation frames add work and storage beyond the algorithm itself.`});guides[config.id]=config;}
const patternProduceBefore=produce;
produce=function(){
 if(!patternIds.has(selected.id))return patternProduceBefore();
 cancelRegex();const raw=$('patternInput').value;
 if(raw.length>6000)throw Error('Use at most 6000 characters of JSON input.');
 let data;try{data=JSON.parse(raw);}catch{throw Error('Enter valid JSON: use double-quoted field names and array brackets, then press Reset.');}
 const trace=InterviewPatterns.solve(selected.id,data);frames=trace.frames;index=0;render();
};
const patternRenderBefore=render;
render=function(){
 patternRenderBefore();if(!patternIds.has(selected.id)||!frames[index])return;
 const f=frames[index];
 const rows=f.rows.map(r=>`<p class="trace-caption">${esc(r.label)}</p><div class="trace-row">${r.values.map((v,i)=>`<div class="trace-cell ${r.active.includes(i)?'trace-active':''}"><small>${i}</small><strong>${esc(v)}</strong></div>`).join('')||'<span class="trace-empty">Empty</span>'}</div>`).join('');
 const matrix=f.matrix?`<p class="trace-caption">${selected.id==='queens'?'Board · Q = queen, · = empty':'Grid · 0 = water, 1 = unseen land, 2+ = island labels'}</p><div class="trace-matrix-wrap" tabindex="0" aria-label="Scrollable algorithm grid"><table class="trace-matrix"><thead><tr><th scope="col">row / col</th>${(f.matrix[0]||[]).map((_,i)=>`<th scope="col">${i}</th>`).join('')}</tr></thead><tbody>${f.matrix.map((r,i)=>`<tr><th scope="row">${i}</th>${r.map((v,j)=>`<td class="${f.focus[0]===i&&f.focus[1]===j?'trace-active':''}">${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
 const output=Object.prototype.hasOwnProperty.call(f,'result')?`<p class="trace-caption">Final answer</p><pre class="pattern-output">${esc(JSON.stringify(f.result,null,2))}</pre>`:'';
 $('viz').innerHTML=`<div class="advanced-trace">${rows}${matrix}${output}</div>`;
};
const patternControls=document.createElement('div');patternControls.id='patternControls';patternControls.className='pattern-controls';patternControls.hidden=true;
patternControls.innerHTML='<label for="patternInput">Problem input · JSON</label><textarea id="patternInput" rows="5" maxlength="6000" spellcheck="false" aria-label="Algorithm input as JSON"></textarea><p id="patternHint" class="string-hint"></p>';
$('input').closest('label').parentElement.append(patternControls);
$('patternInput').onchange=rebuild;
$('patternInput').addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();rebuild();}});
const patternChooseBefore=choose;
choose=function(id){
 const config=PatternCatalog.find(l=>l.id===id);
 if(config)$('patternInput').value=formatPatternInput(config.defaults);
 patternChooseBefore(id);$('patternControls').hidden=!config;
 if(config){$('input').closest('label').hidden=true;$('stringControls').hidden=true;$('regexOptions').hidden=true;$('targetControl').hidden=true;$('random').disabled=false;$('patternHint').textContent=config.watch+' Edit the fields, then press Reset or Ctrl+Enter. Randomize supplies another valid example.';rebuild();}
};
const patternRandomBefore=$('random').onclick;
$('random').onclick=()=>{
 if(!patternIds.has(selected.id))return patternRandomBefore();
 const id=selected.id,config=PatternCatalog.find(l=>l.id===id),data=JSON.parse(JSON.stringify(config.defaults));
 const positive=()=>Array.from({length:6},()=>1+Math.floor(Math.random()*8));
 if('nums' in data){data.nums=Array.from({length:6},()=>Math.floor(Math.random()*7)-3);
  if(['rain','container','jump','partition'].includes(id))data.nums=positive();
  if(['subsets','permutations'].includes(id))data.nums=[...new Set(data.nums)].slice(0,5);
  if(id==='dutch')data.nums=data.nums.map(()=>Math.floor(Math.random()*3));
  if(id==='combination'){data.nums=[1,2+Math.floor(Math.random()*3),5];data.target=8;}
  if(id==='rotated'){const sorted=[...new Set(positive())].sort((a,b)=>a-b),cut=Math.floor(sorted.length/2);data.nums=sorted.slice(cut).concat(sorted.slice(0,cut));data.target=data.nums[0];}
  if(id==='two_sum')data.target=data.nums[0]+data.nums[1];
  if(id==='top_k')data.k=Math.min(2,new Set(data.nums).size);
  if(id==='fenwick'){data.updates=[[0,2]];data.queries=[[0,data.nums.length-1],[1,3]];}
 }
 if('intervals' in data)data.intervals=Array.from({length:5},()=>{const start=Math.floor(Math.random()*15);return [start,start+1+Math.floor(Math.random()*7)];});
 if(id==='gas_station'){data.gas=positive();data.cost=positive();}
 if(id==='knapsack'){data.weights=positive();data.values=positive().map(x=>x*2);data.capacity=12;}
 if(id==='queens')data.n=4+Math.floor(Math.random()*3);
 if(id==='islands')data.grid=Array.from({length:4},()=>Array.from({length:5},()=>Math.random()<0.5?0:1));
 if(id==='union_find'){data.n=6;data.edges=Array.from({length:7},()=>[Math.floor(Math.random()*6),Math.floor(Math.random()*6)]);}
 $('patternInput').value=formatPatternInput(data);rebuild();
};
for(const group of [...new Set(PatternCatalog.map(l=>l.group))]){
 const heading=document.createElement('div');heading.className='side-label';heading.textContent=group.toUpperCase();nav.append(heading);
 for(const config of PatternCatalog.filter(l=>l.group===group)){const button=document.createElement('button');button.dataset.lesson=config.id;button.textContent=config.title;button.onclick=()=>choose(config.id);nav.append(button);}
}
$('topicCount').textContent=lessons.length;restoreProgress();choose(selected.id);
