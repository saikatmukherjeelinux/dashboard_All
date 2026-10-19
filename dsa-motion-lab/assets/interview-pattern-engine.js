/* Twenty-seven interview patterns. Pure results + immutable operation frames. */
(function(root){
 function solve(id,data){
  if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Input must be a JSON object.');
  const frames=[],row=(label,values,active=[])=>({label,values:[...values],active:[...active]});
  function emit(msg,rows=[],matrix=null,focus=[]){if(frames.length>=10000)throw Error('Trace is too large; use a smaller input.');frames.push({a:[],active:[],done:[],msg,rows:rows.map(r=>({...r,values:[...r.values],active:[...r.active]})),matrix:matrix?matrix.map(r=>[...r]):null,focus:[...focus]});}
  function integer(value,label,lo=-100,hi=100){if(!Number.isInteger(value)||value<lo||value>hi)throw Error(`${label} must be an integer from ${lo} to ${hi}.`);return value;}
  function numbers(name='nums',limit=20,lo=-100,hi=100){const a=data[name];if(!Array.isArray(a)||a.length>limit)throw Error(`${name} must be an array of at most ${limit} numbers.`);a.forEach(x=>integer(x,name,lo,hi));return [...a];}
  function distinct(a){if(new Set(a).size!==a.length)throw Error('Use distinct input values for this lesson.');}
  function intervals(){const list=data.intervals;if(!Array.isArray(list)||list.length>16)throw Error('Use at most 16 intervals.');return list.map(pair=>{if(!Array.isArray(pair)||pair.length!==2)throw Error('Each interval must be [start, end].');const [s,e]=pair;integer(s,'start');integer(e,'end');if(s>=e)throw Error('Every interval must have start < end.');return [s,e];});}
  class Heap{constructor(compare){this.a=[];this.compare=compare;}push(x){const a=this.a;a.push(x);let i=a.length-1;while(i){const p=(i-1)>>1;if(this.compare(a[i],a[p])>=0)break;[a[i],a[p]]=[a[p],a[i]];i=p;}}pop(){const a=this.a;if(!a.length)return undefined;const first=a[0],last=a.pop();if(a.length){a[0]=last;let i=0;while(2*i+1<a.length){let c=2*i+1;if(c+1<a.length&&this.compare(a[c+1],a[c])<0)c++;if(this.compare(a[i],a[c])<=0)break;[a[i],a[c]]=[a[c],a[i]];i=c;}}return first;}get size(){return this.a.length;}get top(){return this.a[0];}}
  let result;
  if(['two_sum','three_sum','product_except','sum_k','consecutive','rain','container','dutch','rotated','top_k','quickselect','next_greater','window_max','jump','robber','partition','subsets','permutations','combination'].includes(id)){
   const a=numbers('nums',id==='subsets'?10:id==='permutations'?6:20);const n=a.length;
   const snap=(msg,active=[],extras=[])=>emit(msg,[row('Input / working values',a,active),...extras]);
   snap('Initial values');
   if(id==='two_sum'){
    const target=integer(data.target,'target',-200,200),seen=new Map();result=[];
    for(let i=0;i<n;i++){const other=target-a[i];snap(`Need ${other} before index ${i}`,[i],[row('Seen values',[...seen.keys()]),row('Their indices',[...seen.values()])]);if(seen.has(other)){result=[seen.get(other),i];break;}if(!seen.has(a[i]))seen.set(a[i],i);}
   }else if(id==='three_sum'){
    a.sort((x,y)=>x-y);result=[];snap('Sort a copy; target sum is 0');
    for(let i=0;i<n-2;i++){if(i&&a[i]===a[i-1])continue;let l=i+1,r=n-1;while(l<r){const total=a[i]+a[l]+a[r];snap(`Fix ${a[i]}: sum ${total}`,[i,l,r]);if(total===0){result.push([a[i],a[l],a[r]]);l++;r--;while(l<r&&a[l]===a[l-1])l++;while(l<r&&a[r]===a[r+1])r--;}else if(total<0)l++;else r--;}}
   }else if(id==='product_except'){
    const out=Array(n).fill(1),safe=x=>{if(!Number.isSafeInteger(x))throw Error('Products exceed exact integer range; use smaller values.');return x===0?0:x;};let prefix=1,suffix=1;
    for(let i=0;i<n;i++){out[i]=prefix;if(i<n-1)prefix=safe(prefix*a[i]);snap(`Store product before index ${i}`,[i],[row('Output',out,[i])]);}
    for(let i=n-1;i>=0;i--){out[i]=safe(out[i]*suffix);if(i>0)suffix=safe(suffix*a[i]);snap(`Multiply by product after index ${i}`,[i],[row('Output',out,[i])]);}result=out;
   }else if(id==='sum_k'){
    const target=integer(data.target,'target',-200,200),counts=new Map([[0,1]]);let prefix=0,total=0;
    for(let i=0;i<n;i++){prefix+=a[i];const add=counts.get(prefix-target)||0;total+=add;snap(`Prefix ${prefix}: ${add} earlier prefixes equal ${prefix-target}; count ${total}`,[i],[row('Earlier prefixes',[...counts.keys()]),row('Frequencies',[...counts.values()])]);counts.set(prefix,(counts.get(prefix)||0)+1);}result=total;
   }else if(id==='consecutive'){
    const set=new Set(a);let best=0;for(const x of set){if(set.has(x-1)){snap(`Skip ${x}: it is not a run start`);continue;}let y=x;while(set.has(y)){y++;snap(`Extend run from ${x} through ${y-1}`,[],[row('Current consecutive run',Array.from({length:y-x},(_,i)=>x+i))]);}best=Math.max(best,y-x);}result=best;
   }else if(id==='rain'||id==='container'){
    if(a.some(x=>x<0))throw Error('Heights must be nonnegative.');let l=0,r=n-1,best=0,lmax=0,rmax=0;const water=Array(n).fill(0);
    while(l<=(id==='rain'?r:r-1)){
     if(id==='container'){const area=(r-l)*Math.min(a[l],a[r]);best=Math.max(best,area);snap(`Area ${area}; best ${best}`,[l,r]);if(a[l]<=a[r])l++;else r--;}
     else if(a[l]<=a[r]){lmax=Math.max(lmax,a[l]);water[l]=lmax-a[l];best+=water[l];snap(`Left index ${l} holds ${water[l]} water; total ${best}`,[l,r],[row('Water per index',water,[l])]);l++;}
     else{rmax=Math.max(rmax,a[r]);water[r]=rmax-a[r];best+=water[r];snap(`Right index ${r} holds ${water[r]} water; total ${best}`,[l,r],[row('Water per index',water,[r])]);r--;}
    }result=best;
   }else if(id==='dutch'){
    if(a.some(x=>x<0||x>2))throw Error('Dutch flag input uses only 0, 1, and 2.');let low=0,mid=0,high=n-1;
    while(mid<=high){snap(`0s before ${low}; inspect ${mid}; 2s after ${high}`,[low,mid,high]);if(a[mid]===0){[a[low],a[mid]]=[a[mid],a[low]];low++;mid++;}else if(a[mid]===1)mid++;else{[a[mid],a[high]]=[a[high],a[mid]];high--;}}result=a;
   }else if(id==='rotated'){
    distinct(a);let descents=0;for(let i=0;i<n;i++)if(a[i]>a[(i+1)%n])descents++;if(descents>1)throw Error('Use a rotation of a strictly increasing array.');
    const target=integer(data.target,'target');let l=0,r=n-1;result=-1;
    while(l<=r){const mid=(l+r)>>1;snap(`Search [${l}, ${r}]; middle ${mid}`,[l,mid,r]);if(a[mid]===target){result=mid;break;}if(a[l]<=a[mid]){if(a[l]<=target&&target<a[mid])r=mid-1;else l=mid+1;}else if(a[mid]<target&&target<=a[r])l=mid+1;else r=mid-1;}
   }else if(id==='top_k'){
    const counts=new Map();for(const x of a)counts.set(x,(counts.get(x)||0)+1);const k=integer(data.k,'k',0,counts.size),heap=new Heap((x,y)=>x[0]-y[0]||y[1]-x[1]);
    for(const [value,count] of counts){heap.push([count,value]);if(heap.size>k)heap.pop();snap(`Consider ${value}, frequency ${count}; retain at most ${k}`,[],[row('Heap values',heap.a.map(x=>x[1])),row('Heap frequencies',heap.a.map(x=>x[0]))]);}result=[...heap.a].sort((x,y)=>y[0]-x[0]||x[1]-y[1]).map(x=>x[1]);
   }else if(id==='quickselect'){
    const k=integer(data.k,'k',1,n),target=n-k;let lo=0,hi=n-1;
    while(lo<=hi){const pivot=a[(lo+hi)>>1];let less=lo,i=lo,greater=hi;while(i<=greater){snap(`Partition around ${pivot}; inspect ${i}`,[less,i,greater]);if(a[i]<pivot){[a[less],a[i]]=[a[i],a[less]];less++;i++;}else if(a[i]>pivot){[a[i],a[greater]]=[a[greater],a[i]];greater--;}else i++;}if(target<less)hi=less-1;else if(target>greater)lo=greater+1;else{result=a[target];break;}}
   }else if(id==='next_greater'){
    const stack=[],out=Array(n).fill(-1);for(let i=0;i<n;i++){while(stack.length&&a[stack[stack.length-1]]<a[i]){const j=stack.pop();out[j]=a[i];snap(`${a[i]} answers next-greater for index ${j}`,[j,i],[row('Answers',out),row('Pending indices',stack)]);}stack.push(i);snap(`Push pending index ${i}`,[i],[row('Answers',out),row('Pending indices',stack)]);}result=out;
   }else if(id==='window_max'){
    const k=integer(data.k,'k',n?1:0,n),queue=[],out=[];let head=0;for(let i=0;i<n;i++){while(head<queue.length&&queue[head]<=i-k)head++;while(queue.length>head&&a[queue[queue.length-1]]<=a[i])queue.pop();queue.push(i);if(i>=k-1)out.push(a[queue[head]]);snap(`Index ${i}; front candidate is ${queue[head]}`,[i,...queue.slice(head)],[row('Deque indices',queue.slice(head)),row('Window maxima',out)]);}result=out;
   }else if(id==='jump'){
    if(a.some(x=>x<0))throw Error('Jump lengths must be nonnegative.');let farthest=0;result=false;for(let i=0;i<n;i++){if(i>farthest){snap(`Index ${i} is unreachable`);break;}farthest=Math.max(farthest,i+a[i]);snap(`From index ${i}, reachable frontier is ${farthest}`,[i]);if(farthest>=n-1){result=true;break;}}
   }else if(id==='robber'){
    let prev2=0,prev1=0;const best=[];for(let i=0;i<n;i++){const take=prev2+a[i],skip=prev1,next=Math.max(take,skip);best.push(next);snap(`House ${i}: take ${take} or skip ${skip}; best ${next}`,[i],[row('Best prefix rewards',best)]);prev2=prev1;prev1=next;}result=prev1;
   }else if(id==='partition'){
    if(a.some(x=>x<0))throw Error('Partition uses nonnegative integers.');const total=a.reduce((s,x)=>s+x,0);if(total>200)throw Error('Use a total sum of at most 200 for the DP trace.');result=false;
    if(total%2)snap(`Total ${total} is odd: equal partition is impossible`);else{const target=total/2,dp=Array(target+1).fill(false);dp[0]=true;for(let i=0;i<n;i++){for(let s=target;s>=a[i];s--){dp[s]=dp[s]||dp[s-a[i]];snap(`Use index ${i} once; reachable sum ${s}: ${dp[s]}`,[i],[row('Reachable sums (indices)',dp,[s])]);}}result=dp[target];}
   }else if(id==='subsets'||id==='permutations'||id==='combination'){
    if(id!=='combination')distinct(a);else if(a.some(x=>x<=0))throw Error('Combination candidates must be positive.');result=[];const path=[];
    const trace=msg=>snap(msg,[],[row('Current choice',path),row('Recent complete answers',result.slice(-6).map(v=>JSON.stringify(v)))]);
    if(id==='subsets'){function visit(start){result.push([...path]);trace(`Record subset of size ${path.length}`);for(let i=start;i<n;i++){path.push(a[i]);trace(`Choose index ${i}`);visit(i+1);path.pop();trace(`Backtrack from index ${i}`);}}visit(0);}
    else if(id==='permutations'){const used=Array(n).fill(false);function visit(){if(path.length===n){result.push([...path]);trace('Record a full permutation');return;}for(let i=0;i<n;i++)if(!used[i]){used[i]=true;path.push(a[i]);trace(`Choose unused index ${i}`);visit();path.pop();used[i]=false;trace(`Restore index ${i} for other branches`);}}visit();}
    else{const candidates=[...new Set(a)].sort((x,y)=>x-y),target=integer(data.target,'target',0,24);function visit(start,remaining){if(remaining===0){result.push([...path]);trace('Target reached');return;}for(let i=start;i<candidates.length;i++){const value=candidates[i];if(value>remaining)break;path.push(value);trace(`Choose ${value}; remaining ${remaining-value}`);visit(i,remaining-value);path.pop();trace(`Backtrack from ${value}`);}}visit(0,target);}
   }
  }else if(id==='merge_intervals'||id==='meeting_rooms'){
   const list=intervals().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);emit('Sort intervals by start',[row('Intervals',list.map(JSON.stringify))]);
   if(id==='merge_intervals'){const merged=[];for(const [start,end] of list){if(merged.length&&start<=merged[merged.length-1][1])merged[merged.length-1][1]=Math.max(merged[merged.length-1][1],end);else merged.push([start,end]);emit(`Merge interval [${start}, ${end}]`,[row('Merged intervals',merged.map(JSON.stringify))]);}result=merged;}
   else{const heap=new Heap((a,b)=>a-b);let best=0;for(const [start,end] of list){while(heap.size&&heap.top<=start){const done=heap.pop();emit(`Release room ending at ${done}`,[row('Active meeting ends',heap.a)]);}heap.push(end);best=Math.max(best,heap.size);emit(`Start [${start}, ${end}); ${heap.size} rooms active`,[row('Active end-time heap',heap.a)]);}result=best;}
  }else if(id==='gas_station'){
   const gas=numbers('gas',20,0),cost=numbers('cost',20,0);if(gas.length!==cost.length)throw Error('gas and cost must have the same length.');let total=0,tank=0,start=0;
   for(let i=0;i<gas.length;i++){const delta=gas[i]-cost[i];total+=delta;tank+=delta;emit(`Station ${i}: balance ${tank}, global balance ${total}`,[row('Gas',gas,[i]),row('Travel cost',cost,[i])]);if(tank<0){start=i+1;tank=0;emit(`Reject starts through ${i}; try ${start}`);}}result=gas.length&&total>=0?start:-1;
  }else if(id==='knapsack'){
   const weights=numbers('weights',16,0,40),values=numbers('values',16,0),capacity=integer(data.capacity,'capacity',0,40);if(weights.length!==values.length)throw Error('weights and values must have equal length.');const dp=Array(capacity+1).fill(0);
   for(let i=0;i<weights.length;i++)for(let c=capacity;c>=weights[i];c--){dp[c]=Math.max(dp[c],dp[c-weights[i]]+values[i]);emit(`Item ${i} once, capacity ${c}: best ${dp[c]}`,[row('Weights',weights,[i]),row('Rewards',values,[i]),row('Best value by capacity',dp,[c])]);}result=dp[capacity];
  }else if(id==='queens'){
   const n=integer(data.n,'n',1,8),board=Array.from({length:n},()=>Array(n).fill('·')),cols=new Set(),diag1=new Set(),diag2=new Set();result=[];
   function visit(r){if(r===n){result.push(board.map(row=>row.map(c=>c==='·'?'.':c).join('')));emit(`Solution ${result.length}`,[],board);return;}for(let c=0;c<n;c++){if(cols.has(c)||diag1.has(r-c)||diag2.has(r+c))continue;board[r][c]='Q';cols.add(c);diag1.add(r-c);diag2.add(r+c);emit(`Place queen at (${r}, ${c})`,[],board,[r,c]);visit(r+1);board[r][c]='·';cols.delete(c);diag1.delete(r-c);diag2.delete(r+c);emit(`Remove queen at (${r}, ${c})`,[],board,[r,c]);}}visit(0);
  }else if(id==='islands'){
   const grid=data.grid;if(!Array.isArray(grid)||grid.length>8)throw Error('Use at most 8 grid rows.');const width=grid.length?grid[0]?.length:0;if(!Number.isInteger(width)||width>8)throw Error('Use at most 8 grid columns.');if(grid.some(r=>!Array.isArray(r)||r.length!==width||r.some(v=>v!==0&&v!==1)))throw Error('Use a rectangular grid of numeric 0s and 1s.');
   const matrix=grid.map(r=>[...r]);let count=0;emit('0 = water; 1 = undiscovered land',[],matrix);
   for(let r=0;r<grid.length;r++)for(let c=0;c<width;c++)if(matrix[r][c]===1){count++;const q=[[r,c]];matrix[r][c]=count+1;for(let head=0;head<q.length;head++){const [x,y]=q[head];emit(`Island ${count}: visit (${x}, ${y})`,[],matrix,[x,y]);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<grid.length&&ny>=0&&ny<width&&matrix[nx][ny]===1){matrix[nx][ny]=count+1;q.push([nx,ny]);}}}}result=count;
  }else if(id==='union_find'){
   const n=integer(data.n,'n',1,12),edges=data.edges;if(!Array.isArray(edges)||edges.length>24)throw Error('Use at most 24 edges.');const parent=Array.from({length:n},(_,i)=>i),size=Array(n).fill(1);let count=n;
   function find(v){while(parent[v]!==v){parent[v]=parent[parent[v]];v=parent[v];}return v;}
   for(const edge of edges){if(!Array.isArray(edge)||edge.length!==2)throw Error('Each edge must contain two vertices.');const [u,v]=edge;integer(u,'vertex',0,n-1);integer(v,'vertex',0,n-1);let a=find(u),b=find(v);if(a!==b){if(size[a]<size[b])[a,b]=[b,a];parent[b]=a;size[a]+=size[b];count--;}emit(`${a===b?'Already connected':'Union'} ${u} and ${v}; ${count} components`,[row('Parent links',parent,[u,v]),row('Root sizes (nonroots may be stale)',size)]);}
   const groups=new Map();for(let v=0;v<n;v++){const r=find(v);if(!groups.has(r))groups.set(r,[]);groups.get(r).push(v);}result={count,groups:[...groups.values()].sort((a,b)=>a[0]-b[0])};
  }else if(id==='fenwick'){
   const a=numbers('nums',16),n=a.length,tree=Array(n+1).fill(0),updates=data.updates,queries=data.queries;if(!Array.isArray(updates)||updates.length>8||!Array.isArray(queries)||queries.length>8)throw Error('Use arrays of at most 8 updates and 8 queries.');
   function add(index,delta){for(let i=index+1;i<=n;i+=i&-i){tree[i]+=delta;emit(`Add ${delta} at tree index ${i}`,[row('Current array',a),row('Fenwick tree (index 0 unused)',tree,[i])]);}}
   a.forEach((x,i)=>add(i,x));for(const update of updates){if(!Array.isArray(update)||update.length!==2)throw Error('Each update is [index, delta].');const [i,delta]=update;integer(i,'update index',0,n-1);integer(delta,'delta');a[i]+=delta;add(i,delta);}
   function prefix(end){let sum=0;for(let i=end;i>0;i-=i&-i){sum+=tree[i];emit(`Prefix ending before ${end}: add tree[${i}], total ${sum}`,[row('Current array',a),row('Fenwick tree',tree,[i])]);}return sum;}
   const sums=[];for(const query of queries){if(!Array.isArray(query)||query.length!==2)throw Error('Each query is [left, right], inclusive.');const [l,r]=query;integer(l,'left',0,n-1);integer(r,'right',l,n-1);sums.push(prefix(r+1)-prefix(l));}result={array:a,sums};
  }else throw Error('Unknown interview algorithm: '+id);
  const last=frames[frames.length-1]||{rows:[],matrix:null};
  const finalMatrix=id==='queens'&&result.length?result[0].map(line=>Array.from(line,c=>c==='.'?'·':c)):last.matrix;
  emit(`Complete${Array.isArray(result)?`: ${result.length} output entries`:typeof result==='object'?'':`: ${result}`}`,last.rows,finalMatrix);
  frames[frames.length-1].result=result;return {frames,result};
 }
 root.InterviewPatterns={solve};if(typeof module!=='undefined')module.exports={solve};
})(globalThis);
