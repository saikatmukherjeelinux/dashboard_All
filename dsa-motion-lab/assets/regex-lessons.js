const regexIds=new Set(RegexCatalog.map(l=>l.id));
for(const lesson of RegexCatalog){
 lessons.push({...lesson,type:'regex-trace',complexity:'Pattern-dependent',desc:lesson.idea,how:lesson.idea,cost:lesson.watch});guides[lesson.id]=lesson;
}
let regexJob=0,regexWorker=null,regexDeadline=null;
function cancelRegex(){regexJob++;if(regexWorker)regexWorker.terminate();regexWorker=null;clearTimeout(regexDeadline);}
function regexFailure(message){pause();frames=[];index=0;$('viz').replaceChildren();$('status').textContent=message;$('counter').textContent='0 / 0';$('timeline').disabled=true;$('prev').disabled=$('next').disabled=true;}
const regexProduceBefore=produce;
produce=function(){
 cancelRegex();
 if(!regexIds.has(selected.id))return regexProduceBefore();
 const config=RegexCatalog.find(l=>l.id===selected.id),args=[{mode:config.mode},$('matchText').value,$('matchPattern').value,$('regexFlags').value,$('regexReplacement').value];
 if(Array.from(args[1]).length>256)throw Error('Use at most 256 text characters.');
 if(Array.from(args[2]).length>160)throw Error('Use at most 160 pattern characters.');
 if(args[4].length>80)throw Error('Use at most 80 replacement characters.');
 const job=regexJob;
 const accept=trace=>{if(job!==regexJob)return;pause();frames=trace.frames;index=0;render();};
 // Pure synchronous mode is used by Node unit tests only. Browsers always use
 // a worker, even for invalid or potentially expensive patterns.
 if(typeof Worker==='undefined'&&typeof window==='undefined'){accept(RegexAlgorithms.solve(...args));return;}
 frames=[{a:[],active:[],done:[],msg:'Evaluating regex…',text:Array.from(args[1]),highlight:[],matches:[]}];index=0;render();
 try{
  const code=`const solve=${RegexAlgorithms.solve.toString()};onmessage=event=>{try{postMessage({trace:solve(...event.data)});}catch(error){postMessage({error:error.message});}};`;
  const url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));
  try{regexWorker=new Worker(url);}finally{URL.revokeObjectURL(url);}
  const worker=regexWorker;
  const finish=()=>{clearTimeout(regexDeadline);worker.terminate();if(regexWorker===worker)regexWorker=null;};
  worker.onmessage=event=>{if(job!==regexJob)return;finish();if(event.data.error)regexFailure(event.data.error);else accept(event.data.trace);};
  worker.onerror=()=>{if(job!==regexJob)return;finish();regexFailure('The regex worker could not run. Reload the page and try again.');};
  regexDeadline=setTimeout(()=>{if(job!==regexJob)return;finish();regexFailure('Regex exceeded 1.5 seconds. Simplify the pattern and press Reset.');},1500);
  worker.postMessage(args);
 }catch(error){cancelRegex();regexFailure('Unable to start regex worker: '+error.message);}
};
const regexRenderBefore=render;
render=function(){
 regexRenderBefore();if(!regexIds.has(selected.id)||!frames[index])return;
 const f=frames[index],selectedPositions=new Set(f.highlight);
 const cells=f.text.map((c,i)=>`<div class="trace-cell ${selectedPositions.has(i)?'trace-active':''}"><small>${i}</small><strong>${esc(c===' '?'␠':c==='\n'?'↵':c==='\t'?'⇥':c)}</strong></div>`).join('');
 const matches=f.matches.map((m,i)=>`<tr><th scope="row">${i+1}</th><td>${m.start}</td><td>${m.end}</td><td><code>${esc(JSON.stringify(m.match))}</code></td><td><code>${esc(JSON.stringify(m.groups))}</code></td></tr>`).join('');
 const result=Object.prototype.hasOwnProperty.call(f,'result')?`<p class="trace-caption">Final output</p><pre class="regex-output">${esc(JSON.stringify(f.result,null,2))}</pre>`:'';
 $('viz').innerHTML=`<div class="advanced-trace"><p class="trace-caption">Text · Unicode code-point indices</p><div class="trace-row">${cells||'<span class="trace-empty">Empty text</span>'}</div>${f.boundary==null?'':`<p class="trace-caption">Zero-width match at boundary ${f.boundary}; captured text is listed below.</p>`}<p class="trace-caption">Matches discovered so far · end is exclusive</p><div class="trace-matrix-wrap" tabindex="0" aria-label="Scrollable regex matches"><table class="trace-matrix"><thead><tr><th scope="col">#</th><th scope="col">Start</th><th scope="col">End</th><th scope="col">Match</th><th scope="col">Capture groups</th></tr></thead><tbody>${matches||'<tr><td colspan="5">No matches recorded</td></tr>'}</tbody></table></div>${result}</div>`;
};
const regexOptions=document.createElement('div');regexOptions.id='regexOptions';regexOptions.className='string-controls';regexOptions.hidden=true;
regexOptions.innerHTML='<label>Flags <input id="regexFlags" type="text" value="" placeholder="i, m, s" maxlength="12" aria-label="Regex flags"></label><label id="regexReplacementLabel">Replacement <input id="regexReplacement" type="text" value="" maxlength="80" aria-label="Replacement text"></label>';
$('stringControls').append(regexOptions);
$('regexFlags').onchange=rebuild;$('regexReplacement').onchange=rebuild;
const regexChooseBefore=choose;
choose=function(id){
 cancelRegex();const config=RegexCatalog.find(l=>l.id===id);
 // Restore the original string lessons' smaller HTML limits when leaving.
 $('matchText').maxLength=config?512:120;$('matchPattern').maxLength=config?320:200;
 if(config){$('matchText').value=config.defaults[0];$('matchPattern').value=config.defaults[1];$('regexFlags').value=config.flags;$('regexReplacement').value=config.replacement;}
 regexChooseBefore(id);
 $('regexOptions').hidden=!config;
 if(config){$('input').closest('label').hidden=true;$('stringControls').hidden=false;$('matchPattern').closest('label').hidden=false;$('patternCaption').textContent='Regex pattern';$('targetControl').hidden=true;$('random').disabled=true;$('regexReplacementLabel').hidden=config.mode!=='replace';$('stringHint').hidden=false;$('stringHint').textContent='Enter the pattern without / delimiters. Flags: i ignores case; m changes line anchors; s lets dot include newlines. Global search and Unicode mode are automatic. Text ≤ 256 code points; pattern ≤ 160. Match-level animation shows native engine results, not internal backtracking. Evaluation stops after 1.5 seconds. Replacement supports $1–$9 and $$; split keeps empty pieces but does not insert captured delimiters.';rebuild();}
};
for(const group of [...new Set(RegexCatalog.map(l=>l.group))]){
 const h=document.createElement('div');h.className='side-label';h.textContent=group.toUpperCase();nav.append(h);
 for(const lesson of RegexCatalog.filter(l=>l.group===group)){const button=document.createElement('button');button.dataset.lesson=lesson.id;button.textContent=lesson.title;button.onclick=()=>choose(lesson.id);nav.append(button);}
}
$('topicCount').textContent=lessons.length;restoreProgress();choose(selected.id);
