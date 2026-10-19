/* Responsive SVG scenes. Stable keyed groups move between actual trace states. */
(function(root){
 'use strict';
 const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const palette=['#68e0cc','#b4a0f4','#efbe7a','#87b8f4','#ef92b0','#9bd993'];
 const text=(x,y,value,cls='',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${E(value)}</text>`;
 const line=(x1,y1,x2,y2,cls='scene-wire')=>`<path d="M${x1},${y1} L${x2},${y2}" class="${cls}"/>`;
 const wrap=(value,width=22)=>String(value).split(' ').reduce((lines,word)=>{if((lines.at(-1)+' '+word).trim().length>width&&lines.at(-1))lines.push(word);else lines[lines.length-1]=(lines.at(-1)+' '+word).trim();return lines;},['']);
 function layout(s,w=760){
  const h=w<500?440:370,items=s.items||[],n=items.length,active=s.active??-1,k=s.cursor??s.step??0;
  const shapes=[];let background='';
  const put=(id,x,y,html,opacity=1,angle=0)=>shapes.push({id:String(id),x,y,html,opacity,angle});
  const note=(label,y=h-18)=>{const lines=wrap(label,Math.floor(w/7));put('caption',w/2,y,lines.map((t,i)=>text(0,(i-lines.length+1)*14,t,'scene-caption')).join(''));};
  const card=(id,x,y,label,value,lit=false,color=palette[0],width=110,height=65)=>{const lines=wrap(label,Math.max(9,Math.floor(width/7)));put(id,x,y,`<rect x="${-width/2}" y="${-height/2}" width="${width}" height="${height}" rx="10" class="scene-card${lit?' scene-lit':''}" style="--tone:${color}"/>${lines.slice(0,2).map((t,i)=>text(0,-height/2+18+i*14,t,'scene-small')).join('')}${text(0,height/2-12,value,'scene-value')}`);};
  const dot=(id,x,y,label,lit=false,color=palette[0],r=25)=>put(id,x,y,`<circle r="${r}" class="scene-orb${lit?' scene-lit':''}" style="--tone:${color}"/>${text(0,5,label,'scene-value')}`);
  const columns=(labels,top=90)=>{const cols=w<500?2:Math.min(4,labels.length),gap=(w-40)/cols;labels.forEach((label,i)=>card('col'+i,20+gap*(i%cols+.5),top+Math.floor(i/cols)*105,label,s.values?.[i]??'',i===active,palette[i%6],gap-16,78));};
  switch(s.type){
   case 'scope': {
    const cx=w/2,cy=h/2-15;['Builtins','Global','Enclosing','Local'].forEach((label,i)=>{const r=148-i*32;background+=`<circle cx="${cx}" cy="${cy}" r="${r}" class="scope-ring" style="--tone:${palette[i]}"/>`;put('scope'+i,cx,cy-r+14,text(0,0,label,'scene-small'));});
    const a=-Math.PI/2+k*.65,r=[26,62,72,72,132][Math.min(k,4)];dot('lookup',cx+Math.cos(a)*r,cy+Math.sin(a)*r,'?',true);note(s.result||'Look outward until a binding is found');break;
   }
   case 'memory': case 'aliases': case 'weak': case 'gc': {
    const names=s.names||['a','b'],cols=names.length;names.forEach((name,i)=>card('name'+i,30+(w-60)*(i+.5)/cols,65,name,'reference',i===active,palette[i%6],Math.min(120,(w-50)/cols-12),62));
    const objects=s.objects||['[1, 2]'],ox=objects.length===1?[w/2]:objects.map((_,i)=>35+(w-70)*(i+.5)/objects.length);
    objects.forEach((value,i)=>{dot('obj'+i,ox[i],215,value,s.live!==false,palette[(i+1)%6],Math.min(50,w/objects.length/2-15));});
    names.forEach((_,i)=>{const target=s.links?.[i]??0;if(target>=0&&target<ox.length)background+=`<path d="M${30+(w-60)*(i+.5)/cols},98 Q${w/2},150 ${ox[target]},165" class="scene-wire ${s.type==='weak'&&i===1?'weak-wire':''}"/>`;});
    if(s.type==='gc'&&s.swept)put('swept',w/2,215,`<circle r="63" class="sweep-ring"/>${text(0,6,'collected','scene-small')}`);
    if(s.type==='weak'&&s.live===false)shapes.filter(x=>x.id.startsWith('obj')).forEach(x=>x.opacity=.15);
    note(s.result||'Names point to objects; arrows model ownership');break;
   }
   case 'binder': {
    const labels=s.slots||['code','name','active'];columns(labels,140);(s.tokens||['7','Ada','False']).forEach((v,i)=>{const cols=w<500?2:Math.min(4,labels.length),gap=(w-40)/cols;const filled=i<=(s.bound??k);dot('arg'+i,filled?20+gap*(i%cols+.5):35+i*(w-70)/Math.max(1,labels.length-1),filled?140+Math.floor(i/cols)*105:40,v,filled,palette[i%6],20);});note(s.result||'Arguments dock only in compatible parameter slots');break;
   }
   case 'stack': {
    const depth=Math.max(0,s.depth??k),max=s.maxDepth||5,width=Math.min(330,w-60);background+=`<path d="M${w/2-width/2-8},55 V${h-65} H${w/2+width/2+8} V55" class="scene-wire"/>`;
    for(let i=0;i<max;i++)if(i<depth)card('frame'+i,w/2,h-100-i*48,s.labels?.[i]||`call ${i+1}`,s.values?.[i]??'',i===depth-1,palette[i%6],width,41);
    if(s.returning)dot('return',w/2+width/2-10,h-100-Math.max(0,depth-1)*48,s.result||'return',true,palette[2],25);note(s.caption||'Call frames grow downward, then unwind');break;
   }
   case 'gears': {
    const cx=w/2,cy=h/2-10;[0,1].forEach(i=>{const x=cx+(i?60:-60),r=i?48:68;put('gear'+i,x,cy,`<g class="motion-loop ${i?'gear-reverse':'gear-forward'}"><circle r="${r}" class="gear-ring" style="--tone:${palette[i]}" stroke-dasharray="12 7"/><circle r="${r-15}" class="scene-ring"/></g>${text(0,5,i?'value':s.fixed||'factor=2','scene-value')}`);});dot('input',40+(w-80)*Math.min(1,k/3),cy+100,s.result||'7',true,palette[2]);note('Partial application locks one gear; later input completes the call');break;
   }
   case 'pipeline': case 'sieve': case 'factory': {
    const gates=s.gates||['input','transform','output'],x=i=>35+(w-70)*(i+.5)/gates.length;
    background+=`<path d="M20,190 H${w-20}" class="belt-track"/>`;
    gates.forEach((label,i)=>card('gate'+i,x(i),115,label,'',i===active,palette[i%6],Math.max(70,(w-70)/gates.length-14),62));
    items.forEach((value,i)=>{const pos=s.positions?.[i]??Math.min(gates.length-1,Math.max(0,k-i));const rejected=s.rejected?.includes(i);dot('token'+i,x(pos),175+i*39,value,i===s.token,palette[i%6],18);if(rejected)shapes.at(-1).opacity=.3;});
    note(s.result||'Values move through one processing stage at a time');break;
   }
   case 'zipper': {
    const a=s.left||[1,2],b=s.right||['A','B'],spacing=65,start=w/2-(Math.max(a.length,b.length)-1)*spacing/2;
    a.forEach((v,i)=>card('a'+i,start+i*spacing,k>i?160:70,'',v,k===i,palette[0],52,45));b.forEach((v,i)=>card('b'+i,start+i*spacing,k>i?205:300,'',v,k===i,palette[1],52,45));
    for(let i=0;i<Math.min(k,a.length,b.length);i++)background+=line(start+i*spacing,162,start+i*spacing,205,'zip-link');note(s.result||'Each pair consumes one item from both streams');break;
   }
   case 'circuit': case 'decision': case 'branch': {
    const labels=s.labels||['input','test','yes','no'],coords=[[w/2,55],[w/2,150],[w*.25,265],[w*.75,265]];background+=line(w/2,80,w/2,125)+line(w/2,178,w*.25,240)+line(w/2,178,w*.75,240);
    labels.slice(0,4).forEach((label,i)=>card('decision'+i,...coords[i],label,s.values?.[i]??'',(s.path||[]).includes(i),palette[i%6],Math.min(140,w*.4),58));
    const p=coords[Math.min(k,coords.length-1)];dot('signal',p[0],p[1]-36,s.result||'•',true,palette[2],15);break;
   }
   case 'waterfall': {
    const rows=s.labels||['try','except','else','finally'],dy=(h-65)/rows.length;rows.forEach((label,i)=>{const x=45+i*(w-130)/Math.max(1,rows.length-1),y=45+i*dy;card('fall'+i,x+20,y,label,s.values?.[i]||'',i===active,palette[i%6],100,48);if(i<rows.length-1)background+=line(x+20,y+25,x+20+(w-130)/(rows.length-1),y+dy-25);});note(s.result||'Errors and cleanup follow distinct control-flow paths');break;
   }
   case 'airlock': case 'states': {
    const labels=s.labels||['created','entered','working','exited'],cx=w/2,cy=h/2-5,r=Math.min(w*.32,115);const positions=labels.map((_,i)=>[cx+Math.cos(-Math.PI/2+i*2*Math.PI/labels.length)*r,cy+Math.sin(-Math.PI/2+i*2*Math.PI/labels.length)*r]);
    positions.forEach((p,i)=>{const next=positions[(i+1)%positions.length];background+=line(...p,...next);card('state'+i,...p,labels[i],s.values?.[i]??'',i===active,palette[i%6],90,53);});note(s.result||'Follow allowed state transitions, including cleanup');break;
   }
   case 'fanout': case 'tree': case 'json': {
    const labels=s.labels||['root','left','right','leaf 1','leaf 2'],coords=[[w/2,45],[w*.25,145],[w*.75,145],[w*.18,265],[w*.5,265],[w*.82,265]];const edges=s.edges||[[0,1],[0,2],[1,3],[2,4]];
    edges.forEach(([a,b])=>{if(coords[a]&&coords[b])background+=line(...coords[a],...coords[b]);});labels.slice(0,6).forEach((label,i)=>card('tree'+i,...coords[i],label,s.values?.[i]??'',(s.path||[active]).includes(i),palette[i%6],Math.min(118,w*.28),58));break;
   }
   case 'blueprint': {
    const cols=2,gap=(w-60)/cols; background+=`<rect x="20" y="35" width="${w-40}" height="${h-90}" rx="5" class="blueprint-border"/>`;
    (s.labels||['x','y','z','__dict__']).forEach((label,i)=>{const x=30+gap*(i%cols+.5),y=100+Math.floor(i/cols)*105;card('slot'+i,x,y,label,s.values?.[i]??'empty',i===active,palette[i%6],gap-18,70);if(s.blocked===i)put('blocked',x,y,text(0,8,'×','scene-cross'));});note(s.result||'Declared storage slots are distinct from arbitrary attributes');break;
   }
   case 'elevator': {
    const labels=s.labels||['data descriptor','instance dict','class attribute','__getattr__'];const x=w*.6,width=Math.min(250,w*.6),dy=(h-60)/labels.length;labels.forEach((label,i)=>{const y=45+i*dy;card('floor'+i,x,y,label,s.values?.[i]??'',i===active,palette[i%6],width,52);});background+=`<path d="M${w*.15},30 V${h-60}" class="elevator-rail"/>`;dot('car',w*.15,45+Math.min(k,labels.length-1)*dy,'get',true);break;
   }
   case 'gauge': {
    const value=s.value??k*20,cx=w/2,cy=h/2+10,r=Math.min(w*.34,120),angle=Math.PI+(Math.max(0,Math.min(100,value))/100)*Math.PI;
    background+=`<path d="M${cx-r},${cy} A${r},${r} 0 0 1 ${cx+r},${cy}" class="gauge-track"/>`;
    for(let i=0;i<=5;i++)put('tick'+i,cx+Math.cos(Math.PI+i*Math.PI/5)*(r+18),cy+Math.sin(Math.PI+i*Math.PI/5)*(r+18),text(0,0,i*20,'scene-small'));
    put('needle',cx,cy,`<path d="M0,0 L${r-18},0" class="gauge-needle"/>`,1,angle*180/Math.PI);dot('hub',cx,cy,'',true,palette[0],9);put('value',cx,cy+55,text(0,0,s.result??value,'scene-large'));note(s.caption||'The setter validates before changing stored state');break;
   }
   case 'junction': {
    const ys=[80,180,280],targets=s.labels||['int','str','fallback'];background+=line(25,180,w*.45,180);targets.forEach((label,i)=>{background+=`<path d="M${w*.45},180 Q${w*.6},180 ${w*.72},${ys[i]}" class="scene-wire"/>`;card('target'+i,w*.8,ys[i],label,s.values?.[i]??'',i===active,palette[i%6],Math.min(120,w*.3),60);});dot('train',k===0?55:w*.57,k===0?180:ys[Math.max(0,active)],s.result||'input',true,palette[2],23);break;
   }
   case 'dial': case 'clock': case 'orbit': {
    const cx=w/2,cy=h/2-5,r=Math.min(w*.3,110),labels=s.labels||['NEW','RUN','DONE'];background+=`<circle cx="${cx}" cy="${cy}" r="${r}" class="scene-ring"/>`;
    labels.forEach((label,i)=>{const angle=-Math.PI/2+i*2*Math.PI/labels.length;card('orbit'+i,cx+Math.cos(angle)*r,cy+Math.sin(angle)*r,label,s.values?.[i]??'',i===active,palette[i%6],75,47);});put('hand',cx,cy,`<path d="M0,0 L0,${-r+28}" class="clock-hand"/>`,1,(s.angle??active*360/Math.max(1,labels.length)));dot('center',cx,cy,s.result||'•',true,palette[2],26);note(s.caption||'Select a state; membership has a defined domain');break;
   }
   case 'ledger': {
    const labels=s.labels||['field','value'],rows=s.rows||[],gap=(w-40)/labels.length;labels.forEach((v,i)=>put('header'+i,20+gap*(i+.5),35,text(0,0,v,'scene-small')));rows.forEach((row,i)=>row.forEach((v,j)=>card('cell'+i+'-'+j,20+gap*(j+.5),90+i*64,'',v,i===active,palette[j%6],gap-8,52)));note(s.result||'Fields, values, and generated behavior remain separate');break;
   }
   case 'buckets': {
    const buckets=s.buckets||[[],[],[],[]],cols=w<500?2:4,gap=(w-40)/cols;buckets.forEach((bucket,i)=>{const x=20+gap*(i%cols+.5),y=80+Math.floor(i/cols)*125;background+=`<path d="M${x-gap*.35},${y-20} V${y+70} H${x+gap*.35} V${y-20}" class="bucket-wall"/>`;put('bucketLabel'+i,x,y-32,text(0,0,'bucket '+i,'scene-small'));bucket.forEach((v,j)=>card('bucket'+i+'-'+j,x,y+15+j*34,'',v,i===active,palette[i%6],gap*.6,29));});note(s.result||'Illustrative buckets, not CPython dictionary layout');break;
   }
   case 'bars': {
    const labels=s.labels||['a','b','n'],values=s.values||[0,0,0],gap=(w-80)/labels.length,max=Math.max(4,...values);values.forEach((v,i)=>{const height=v/max*(h-140);put('bar'+i,40+gap*(i+.5),h-70,`<rect x="${-gap*.28}" y="${-height}" width="${gap*.56}" height="${Math.max(2,height)}" rx="5" fill="${palette[i%6]}" opacity="${i===active?1:.55}"/>${text(0,-height-12,v,'scene-value')}${text(0,24,labels[i],'scene-small')}`);});note(s.result||'Accumulate counts as input symbols arrive',h-12);break;
   }
   case 'groups': {
    const labels=s.labels||['A','B'],groups=s.groups||[[],[]],gap=(w-30)/labels.length;labels.forEach((label,i)=>{card('groupHead'+i,15+gap*(i+.5),55,label,'',i===active,palette[i%6],gap-15,45);groups[i].forEach((v,j)=>card('member'+i+'-'+v,15+gap*(i+.5),130+j*66,'',v,true,palette[i%6],gap-30,48));});note(s.result||'A missing group creates one independent container');break;
   }
   case 'deque': {
    const values=s.values||[],gap=Math.min(90,(w-50)/Math.max(1,values.length));background+=`<path d="M20,220 H${w-20}" class="rail-track"/>`;values.forEach((v,i)=>card('car'+v,w/2+(i-(values.length-1)/2)*gap,180,'',v,i===active,palette[i%6],gap-8,70));put('left',30,95,text(0,0,'LEFT','scene-small','start'));put('right',w-30,95,text(0,0,'RIGHT','scene-small','end'));if(s.removed!==undefined)dot('departed',w-35,285,s.removed,true,palette[4],23);note(s.result||'Add and remove from either end');break;
   }
   case 'heap': {
    const values=s.values||[],coords=[[w*.5,55],[w*.27,145],[w*.73,145],[w*.14,260],[w*.4,260],[w*.6,260],[w*.86,260]];for(let i=1;i<values.length;i++)background+=line(...coords[Math.floor((i-1)/2)],...coords[i]);values.forEach((v,i)=>dot('heap'+v,...coords[i],v,i===active,palette[i%6],24));note(s.result||'Parents are no larger than their children; the list is not globally sorted');break;
   }
   case 'numberline': case 'rounding': {
    const values=s.values||[1,2,2,4],gap=(w-60)/Math.max(1,values.length-1);background+=line(30,190,w-30,190);values.forEach((v,i)=>{const x=30+i*gap;put('num'+i,x,190,`<path d="M0,-10 V10" class="scene-wire"/>${text(0,37,v,'scene-value')}${text(0,60,i,'scene-small')}`);});const index=s.index??Math.min(k,values.length-1);dot('cursor',30+index*gap,133,s.result||'?',true,palette[2],22);if(s.low!==undefined&&s.high!==undefined)background+=`<rect x="${30+s.low*gap-14}" y="165" width="${Math.max(14,(s.high-s.low)*gap+28)}" height="80" rx="10" class="search-window"/>`;note(s.caption||'The cursor follows insertion and boundary rules');break;
   }
   case 'sort': {
    const values=s.values||[],gap=Math.min(95,(w-50)/Math.max(1,values.length));values.forEach((v,i)=>{const [label,key]=Array.isArray(v)?v:[String(v),v];card('sort'+label,w/2+(i-(values.length-1)/2)*gap,160,label,'key '+key,(s.selected||[]).includes(i),palette[(s.colors?.[label]??i)%6],gap-8,115);});note(s.result||'Equal keys retain their previous relative order');break;
   }
   case 'venn': {
    const cy=h/2,cx=w/2,r=Math.min(105,w*.27);background+=`<circle cx="${cx-r*.47}" cy="${cy}" r="${r}" class="venn-a"/><circle cx="${cx+r*.47}" cy="${cy}" r="${r}" class="venn-b"/>`;
    put('leftLabel',cx-r,cy-r-15,text(0,0,'A','scene-small'));put('rightLabel',cx+r,cy-r-15,text(0,0,'B','scene-small'));
    (s.left||[1]).forEach((v,i)=>dot('left'+v,cx-r*.9,cy+i*44-10,v,(s.selected||[]).includes(v),palette[0],21));(s.both||[2]).forEach((v,i)=>dot('both'+v,cx,cy+i*44-10,v,(s.selected||[]).includes(v),palette[1],21));(s.right||[3]).forEach((v,i)=>dot('right'+v,cx+r*.9,cy+i*44-10,v,(s.selected||[]).includes(v),palette[2],21));note(s.result||'Membership is about values, not input order');break;
   }
   case 'grid': case 'bytes': case 'window': {
    const values=s.values||[],cols=Math.max(1,Math.min(s.columns||8,Math.floor((w-40)/48))),gap=(w-40)/cols;values.forEach((v,i)=>{const x=20+gap*(i%cols+.5),y=80+Math.floor(i/cols)*74;card('grid'+i,x,y,s.indices===false?'':String(i),v,(s.selected||[active]).includes(i),palette[i%6],gap-6,59);});note(s.result||'Highlighted cells show a view into the underlying values');break;
   }
   case 'ribbon': case 'typewriter': case 'parser': {
    const values=s.values||Array.from(s.text||''),cols=Math.max(1,Math.floor((w-40)/35)),gap=Math.min(40,(w-40)/Math.min(cols,values.length||1));values.forEach((v,i)=>{const x=20+gap*(i%cols+.5),y=85+Math.floor(i/cols)*60;card('char'+i,x,y,'',v,(s.selected||[active]).includes(i),palette[(s.colorIndices?.[i]??0)%6],gap-4,43);if(i===s.cursor)put('reader',x,y+35,text(0,0,'▲','scene-caret'));});if(s.output)put('output',w/2,h-90,text(0,0,s.output,'scene-value'));note(s.result||'The cursor follows a character or field boundary');break;
   }
   case 'balance': {
    const cy=h/2-10,cx=w/2,tilt=s.tilt||0;background+=`<path d="M${cx},${cy} L${cx-30},${cy+110} H${cx+30} Z" class="balance-base"/>`;put('beam',cx,cy,`<path d="M${-w*.3},0 H${w*.3}" class="balance-beam"/>`,1,tilt);card('panA',cx-w*.27,cy+50-tilt*2,'left',s.left||'',active===0,palette[0],Math.min(145,w*.4),70);card('panB',cx+w*.27,cy+50+tilt*2,'right',s.right||'',active===1,palette[1],Math.min(145,w*.4),70);note(s.result||'Representation and mathematical intent need not be identical');break;
   }
   case 'lanes': {
    const labels=s.labels||['worker A','worker B'],gap=(h-75)/labels.length;labels.forEach((label,i)=>{const y=55+i*gap;background+=`<path d="M30,${y+35} H${w-25}" class="lane-track"/>`;put('laneLabel'+i,30,y-5,text(0,0,label,'scene-small','start'));card('worker'+i,50+(w-110)*(s.progress?.[i]??0),y+35,'',s.values?.[i]||'task',i===active,palette[i%6],70,43);});note(s.result||'A schedule illustration, not a timing benchmark');break;
   }
   case 'crossing': {
    const cx=w/2,cy=h/2; background+=`<path d="M25,${cy} H${w-25} M${cx},30 V${h-45}" class="crossing-road"/><rect x="${cx-35}" y="${cy-35}" width="70" height="70" rx="8" class="critical-zone"/>`;
    card('carA',s.owner==='A'?cx:55,cy,'thread A',s.values?.[0]||'read',s.owner==='A',palette[0],80,52);card('carB',cx,s.owner==='B'?cy:55,'thread B',s.values?.[1]||'wait',s.owner==='B',palette[1],80,52);put('lock',w-55,45,text(0,0,s.owner?'LOCKED':'FREE','scene-small'));note(s.result||'One owner at a time protects the critical section');break;
   }
   case 'pool': {
    const permits=s.permits??2,capacity=s.capacity??2;for(let i=0;i<capacity;i++)dot('permit'+i,w/2+(i-(capacity-1)/2)*65,65,i<permits?'●':'○',i<permits,palette[2],24);
    (s.labels||['A','B','C']).forEach((v,i)=>{const running=(s.running||[]).includes(i),done=(s.done||[]).includes(i);card('task'+i,35+(w-70)*(i+.5)/(s.labels||['A','B','C']).length,running?180:done?290:110,v,running?'running':done?'done':'waiting',running,palette[i%6],Math.min(95,(w-60)/3),60);});note(s.result||'Permits bound concurrency, not requests per second');break;
   }
   case 'wave': {
    const y=h/2,points=(s.signal||[0,0,0,0,0]).map((v,i)=>[25+i*(w-50)/4,y-v*80]);background+=`<path d="${points.map((p,i)=>(i?'L':'M')+p.join(',')).join(' ')}" class="wave-line"/>`;put('flag',w/2,55,text(0,0,s.high?'EVENT SET':'EVENT CLEAR','scene-value'));(s.labels||['waiter A','waiter B']).forEach((v,i)=>card('waiter'+i,w*(i? .72:.28),h-90,v,s.high?'released':'waiting',s.high,palette[i%6],Math.min(135,w*.4),64));note(s.result||'An event is a flag, not a counted stream of messages');break;
   }
   case 'passport': {
    const width=Math.min(w-45,460),cx=w/2,top=40; background+=`<rect x="${cx-width/2}" y="${top}" width="${width}" height="${h-105}" rx="17" class="passport-cover"/><path d="M${cx-width/2+20},${top+65} H${cx+width/2-20}" class="scene-wire"/>`;
    put('passportTitle',cx,top+35,text(0,0,s.heading||'FUNCTION IDENTITY','scene-value'));
    const fields=s.labels||['name','docstring','wrapped'];fields.forEach((label,i)=>{put('passportLabel'+i,cx-width/2+25,top+100+i*58,text(0,0,label,'scene-small','start'));card('passportValue'+i,cx+width*.15,top+98+i*58,'',s.values?.[i]??'—',i===active,palette[i%6],width*.52,39);});note(s.result||'Metadata describes the callable; its wrapper still performs the call');break;
   }
   case 'bytebridge': {
    const chars=s.chars||['c','a','f','é'],bytes=s.bytes||['63','61','66','c3','a9'],gapA=(w-40)/chars.length,gapB=(w-40)/bytes.length;
    chars.forEach((v,i)=>card('character'+i,20+gapA*(i+.5),85,'code point',v,i===active,palette[i%6],gapA-9,62));
    bytes.forEach((v,i)=>{const from=(s.mapping||[0,1,2,3,3])[i];background+=line(20+gapA*(from+.5),118,20+gapB*(i+.5),235);card('encoded'+i,20+gapB*(i+.5),268,'byte',s.revealed>=i?v:'?',s.mapping?.[i]===active||from===active,palette[from%6],gapB-8,63);});note(s.result||'Unicode code points are not the same unit as encoded bytes');break;
   }
   case 'broadcast': {
    const cx=w/2,cy=h/2,r=Math.min(w*.3,120),labels=s.labels||['observer A','observer B'];dot('subject',cx,cy,s.center||'event',true,palette[2],35);
    labels.forEach((label,i)=>{const a=-Math.PI/2+i*2*Math.PI/labels.length,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;background+=line(cx,cy,x,y);card('observer'+i,x,y,label,s.values?.[i]??'waiting',(s.notified||[]).includes(i),palette[i%6],Math.min(125,w*.39),62);const delivered=(s.notified||[]).includes(i),progress=delivered?.74:.45;if(s.sending===i||delivered)dot('message'+i,cx+(x-cx)*progress,cy+(y-cy)*progress,'•',true,palette[i%6],9);});note(s.result||'One event is delivered to every registered observer');break;
   }
   case 'package-map': {
    const labels=s.labels||['xml','etree','ElementTree'];labels.forEach((label,i)=>{const inset=20+i*24,y=35+i*65,width=w-2*inset;put('package'+i,w/2,y,`<path d="M${-width/2},0 h${Math.min(90,width*.5)} l12,14 H${width/2} V${h-y-70} H${-width/2} Z" class="package-folder${i===active?' folder-active':''}" style="--tone:${palette[i%6]}"/>${text(-width/2+14,35,label,'scene-small','start')}`);});note(s.result||'Import resolution uses package context, not a guessed working directory');break;
   }
   case 'type-portal': {
    const mobile=w<500,coords=mobile?[[w/2,55],[w/2,165],[w/2,275]]:[[w*.17,155],[w*.5,155],[w*.83,155]];const labels=s.labels||['input','static contract','runtime body'];coords.forEach((p,i)=>{if(i)background+=line(...coords[i-1],...p);card('portal'+i,...p,labels[i],s.values?.[i]??'',i===active,palette[i%6],mobile?w*.65:Math.min(160,w*.29),78);});note(s.result||'Annotations describe a contract; explicit runtime checks are separate');break;
   }
   case 'cause-chain': {
    const labels=s.labels||['low-level error','domain error','caller'],coords=[[w*.3,80],[w*.7,190],[w*.3,285]];
    background+=`<path d="M${coords[0][0]},110 Q${w*.7},100 ${coords[1][0]},155" class="cause-arrow"/><path d="M${coords[1][0]},225 Q${w*.7},285 ${coords[2][0]},285" class="scene-wire"/>`;
    labels.forEach((label,i)=>card('cause'+i,...coords[i],label,s.values?.[i]??'',i===active,palette[i%6],Math.min(175,w*.48),68));note(s.result||'The visible exception can retain the original cause');break;
   }
   case 'schema': {
    const labels=s.labels||['name','city'],width=w-50;labels.forEach((label,i)=>{const y=85+i*100;put('schemaRow'+i,w/2,y,`<rect x="${-width/2}" y="-36" width="${width}" height="78" rx="9" class="schema-field${s.invalid===i?' schema-invalid':''}"/><circle cx="${-width/2+22}" cy="0" r="9" class="schema-marker${i===active?' schema-marker-active':''}"/>${text(-width/2+43,-9,label,'scene-small','start')}${text(-width/2+43,16,s.values?.[i]??'absent','scene-value','start')}${text(width/2-12,-9,s.required?.includes(i)?'required':'optional','scene-small','end')}`);});note(s.result||'A declared shape does not automatically validate runtime dictionaries');break;
   }
   case 'log-rail': {
    const labels=s.labels||['logger','handler','destination'];background+=`<path d="M45,45 V${h-65}" class="log-rail"/>`;labels.forEach((label,i)=>{const y=70+i*100;dot('logNode'+i,45,y,i+1,i===active,palette[i%6],16);card('logStage'+i,(w+65)/2,y,label,s.values?.[i]??'',i===active,palette[i%6],Math.min(w-120,280),67);});note(s.result||'A record can pass the logger but still be filtered by a handler');break;
   }
   case 'text-transform': {
    const source=Array.from(s.source||''),target=Array.from(s.target||''),cols=Math.max(1,Math.floor((w-40)/32));
    const draw=(values,prefix,base)=>values.forEach((v,i)=>card(prefix+i,20+((w-40)/Math.min(cols,Math.max(1,values.length)))*(i%cols+.5),base+Math.floor(i/cols)*45,'',v,(s.selected||[]).includes(i),prefix==='from'?palette[1]:palette[0],Math.min(38,(w-40)/Math.max(1,Math.min(cols,values.length)))-3,35));
    put('fromLabel',w/2,30,text(0,0,'SOURCE','scene-small'));draw(source,'from',75);put('transform',w/2,190,text(0,0,s.operation||'transform ↓','scene-value'));draw(target,'to',275);note(s.result||'Transformation produces a new text value');break;
   }
   default: columns(items.map(String));note(s.result||'Explore this trace step by step');
  }
  return {width:w,height:h,background,shapes};
 }
 function render(container,scene){
  const w=Math.max(320,Math.min(900,container.clientWidth-24)),model=layout(scene,w),ns='http://www.w3.org/2000/svg';
  let svg=container.querySelector('svg.scene-svg');
  if(!svg){container.innerHTML='';svg=document.createElementNS(ns,'svg');svg.setAttribute('class','scene-svg');svg.innerHTML='<g data-background></g><g data-objects></g>';container.append(svg);}
  svg.setAttribute('viewBox',`0 0 ${model.width} ${model.height}`);svg.setAttribute('role','img');svg.setAttribute('aria-label',scene.description||scene.title||'Python execution diagram');svg.dataset.style=scene.type;
  svg.querySelector('[data-background]').innerHTML=model.background;
  const parent=svg.querySelector('[data-objects]'),keep=new Set(),reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  for(const obj of model.shapes){keep.add(obj.id);let node=[...parent.children].find(n=>n.dataset.key===obj.id),created=!node;if(!node){node=document.createElementNS(ns,'g');node.dataset.key=obj.id;parent.append(node);}
   const fromX=Number(node.dataset.x??obj.x),fromY=Number(node.dataset.y??obj.y),fromA=Number(node.dataset.angle??obj.angle);node.getAnimations().forEach(a=>a.cancel());node.innerHTML=obj.html;node.setAttribute('transform',`translate(${obj.x} ${obj.y}) rotate(${obj.angle})`);node.style.opacity=obj.opacity;
   if(!reduce){if(!created&&(fromX!==obj.x||fromY!==obj.y||fromA!==obj.angle))node.animate([{transform:`translate(${fromX}px,${fromY}px) rotate(${fromA}deg)`},{transform:`translate(${obj.x}px,${obj.y}px) rotate(${obj.angle}deg)`}],{duration:450,easing:'cubic-bezier(.2,.75,.25,1)'});else node.animate([{opacity:.4},{opacity:obj.opacity}],{duration:300});}
   node.dataset.x=obj.x;node.dataset.y=obj.y;node.dataset.angle=obj.angle;
  }
  for(const node of [...parent.children])if(!keep.has(node.dataset.key))node.remove();
 }
 root.LabScenes={layout,render,styles:['scope','memory','binder','stack','gears','pipeline','zipper','circuit','waterfall','states','tree','blueprint','elevator','gauge','junction','dial','ledger','buckets','bars','groups','deque','heap','numberline','sort','venn','grid','ribbon','balance','lanes','crossing','pool','wave','passport','bytebridge','broadcast','package-map','type-portal','cause-chain','schema','log-rail','text-transform']};
})(typeof window!=='undefined'?window:globalThis);
