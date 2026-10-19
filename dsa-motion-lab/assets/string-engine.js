/* Pure, Unicode-code-point string algorithms with replayable snapshots.
   The same engine is used by the UI and the reference-oracle tests. */
(function(root){
 function solve(id,text,pattern){
  const a=Array.from(text),b=Array.from(pattern),n=a.length,m=b.length,frames=[];
  const row=(label,values,active=[])=>({label,values:[...values],active:[...active]});
  function emit(msg,rows=[],matrix=null,focus=[]){frames.push({a:[],active:[],done:[],msg,rows:rows.map(r=>({...r,values:[...r.values],active:[...r.active]})),matrix:matrix?matrix.map(r=>[...r]):null,focus:[...focus]});}
  const words=()=>[...new Set(pattern.split(',').map(s=>s.trim()).filter(Boolean))];
  const indices=()=>Array.from({length:n+1},(_,i)=>i);
  function suffixArray(){
   let sa=a.map((_,i)=>i),alphabet=new Map([...new Set(a)].sort((x,y)=>x.codePointAt(0)-y.codePointAt(0)).map((c,i)=>[c,i])),rank=a.map(c=>alphabet.get(c));
   for(let k=1;k<n;k*=2){const second=i=>i+k<n?rank[i+k]:-1;sa.sort((i,j)=>rank[i]-rank[j]||second(i)-second(j));const next=Array(n).fill(0);for(let i=1;i<n;i++)next[sa[i]]=next[sa[i-1]]+Number(rank[sa[i]]!==rank[sa[i-1]]||second(sa[i])!==second(sa[i-1]));rank=next;emit(`Rank suffixes by first ${2*k} characters`,[row('Suffix indices in order',sa),row('Rank at each text index',rank)]);if(rank[sa[n-1]]===n-1)break;}
   return sa;
  }
  emit('Start with your text and the lesson-specific second input',[row('Text',a),row('Second input',b)]);
  let result;
  if(id==='zstring'){
   const s=[...b,null,...a],z=Array(s.length).fill(0);let l=0,r=0;
   for(let i=1;i<s.length;i++){if(i<=r)z[i]=Math.min(r-i+1,z[i-l]);while(i+z[i]<s.length&&s[z[i]]===s[i+z[i]])z[i]++;if(i+z[i]-1>r){l=i;r=i+z[i]-1;}emit(`Z[${i}] = ${z[i]}; reusable box [${l}, ${r}]`,[row('Pattern · separator · text',s.map(c=>c===null?'⟂':c),[i]),row('Z values',z,[i])]);}
   result=m?z.flatMap((v,i)=>i>m&&v>=m?[i-m-1]:[]):indices();
  }else if(id==='rabin'){
   const base=257,mod=1000003,code=c=>c.codePointAt(0)+1;let power=1,ph=0,wh=0;result=[];
   if(!m)result=indices();else if(m<=n){for(let i=0;i<m;i++){ph=(ph*base+code(b[i]))%mod;wh=(wh*base+code(a[i]))%mod;if(i<m-1)power=power*base%mod;}
    for(let i=0;i<=n-m;i++){const match=wh===ph&&b.every((c,j)=>c===a[i+j]);emit(`Window ${i}: hash ${wh}, pattern hash ${ph}${wh===ph?'; verify characters':''}`,[row('Text',a,Array.from({length:m},(_,j)=>i+j)),row('Matches',result)]);if(match)result.push(i);if(i<n-m)wh=(((wh-code(a[i])*power)%mod+mod)*base+code(a[i+m]))%mod;}}
  }else if(id==='horspool'){
   const shifts=new Map();for(let j=0;j<m-1;j++)shifts.set(b[j],m-1-j);result=[];let i=0;
   if(!m)result=indices();else while(i<=n-m){let j=m-1;while(j>=0&&b[j]===a[i+j]){emit(`Compare from the right: text ${i+j}, pattern ${j}`,[row('Text',a,[i+j]),row('Pattern',b,[j])]);j--;}if(j<0)result.push(i);const step=shifts.get(a[i+m-1])??m;emit(`${j<0?'Match':'Mismatch'} at window ${i}; shift ${step}`,[row('Text',a,[i+m-1]),row('Shift characters',[...shifts.keys()]),row('Shift distances',[...shifts.values()])]);i+=step;}
  }else if(id==='trie'||id==='aho'){
   const dictionary=words(),nodes=[{next:new Map(),fail:0,out:[],prefix:''}];
   for(const word of dictionary){let state=0;for(const c of Array.from(word)){if(!nodes[state].next.has(c)){nodes[state].next.set(c,nodes.length);nodes.push({next:new Map(),fail:0,out:[],prefix:nodes[state].prefix+c});}state=nodes[state].next.get(c);}nodes[state].out.push(word);emit(`Insert word ${word}`,[row('Trie prefixes',nodes.map(v=>v.prefix||'root')),row('Terminal words',nodes.map(v=>v.out.join('|')||'—'))]);}
   if(id==='trie'){let state=0,exists=true;for(const c of a){if(!nodes[state].next.has(c)){exists=false;break;}state=nodes[state].next.get(c);emit(`Follow prefix ${nodes[state].prefix}`,[row('Trie prefixes',nodes.map(v=>v.prefix||'root'),[state])]);}result=[];if(exists){const visit=s=>{result.push(...nodes[s].out);for(const v of nodes[s].next.values())visit(v);};visit(state);}result.sort((x,y)=>{const u=Array.from(x),v=Array.from(y);for(let i=0;i<Math.min(u.length,v.length);i++)if(u[i]!==v[i])return u[i].codePointAt(0)-v[i].codePointAt(0);return u.length-v.length;});
   }else{
    const q=[...nodes[0].next.values()];for(let head=0;head<q.length;head++){const u=q[head];for(const [c,v] of nodes[u].next){let f=nodes[u].fail;while(f&&!nodes[f].next.has(c))f=nodes[f].fail;nodes[v].fail=nodes[f].next.get(c)??0;nodes[v].out.push(...nodes[nodes[v].fail].out);q.push(v);}emit(`Build failure links for state ${u}`,[row('State',nodes.map((_,i)=>i)),row('Failure link',nodes.map(v=>v.fail))]);}
    result=[];let state=0;for(let i=0;i<n;i++){while(state&&!nodes[state].next.has(a[i]))state=nodes[state].fail;state=nodes[state].next.get(a[i])??0;for(const word of nodes[state].out)result.push({word,index:i-Array.from(word).length+1});emit(`Read ${a[i]}: state ${state}, ${result.length} matches so far`,[row('Text',a,[i]),row('State prefixes',nodes.map(v=>v.prefix||'root'),[state]),row('Failure links',nodes.map(v=>v.fail))]);}
   }
  }else if(id==='suffix'||id==='kasai'){
   const sa=suffixArray();if(id==='suffix')result=sa;else{const rank=Array(n),lcp=Array(n).fill(0);sa.forEach((v,i)=>rank[v]=i);let h=0;for(let i=0;i<n;i++){const r=rank[i];if(r===0){h=0;continue;}const j=sa[r-1];while(i+h<n&&j+h<n&&a[i+h]===a[j+h])h++;lcp[r]=h;emit(`LCP of suffix ${i} and previous suffix ${j} is ${h}`,[row('Suffix array',sa,[r-1,r]),row('LCP (0 for first suffix)',lcp,[r])]);if(h)h--;}result=lcp;}
   emit('Sorted suffixes',[row('Indices',sa),row('Suffixes',sa.map(i=>a.slice(i).join('')))]);
  }else if(id==='manacher'){
   const odd=Array(n).fill(0),even=Array(n).fill(0);let bestStart=0,bestLength=0;
   for(const parity of [1,0]){const d=parity?odd:even;let l=0,r=-1;for(let i=0;i<n;i++){let k=i>r?parity:Math.min(d[l+r-i+(parity?0:1)],r-i+1);while(i+k<n&&i-k-(parity?0:1)>=0&&a[i+k]===a[i-k-(parity?0:1)])k++;d[i]=k;const length=2*k-parity,start=i-k+parity;if(length>bestLength){bestLength=length;bestStart=start;}if(i+k-1>r){l=start;r=i+k-1;}emit(`${parity?'Odd':'Even'} center ${i}: radius ${k}`,[row('Text',a,[i]),row('Odd radii (include center)',odd),row('Even radii (center before index)',even)]);}}
   result=a.slice(bestStart,bestStart+bestLength).join('');
  }else if(['lcs','lcsubstr','edit','scs','distinct','wildcard'].includes(id)){
   const dp=Array.from({length:n+1},()=>Array(m+1).fill(0));
   if(id==='edit'){for(let i=0;i<=n;i++)dp[i][0]=i;for(let j=0;j<=m;j++)dp[0][j]=j;}
   if(id==='distinct')for(let i=0;i<=n;i++)dp[i][0]=1;
   if(id==='wildcard'){dp[0][0]=1;for(let j=1;j<=m;j++)dp[0][j]=Number(b[j-1]==='*'&&dp[0][j-1]);}
   let bestLength=0,bestEnd=0;
   emit('Initialize empty-prefix row and column',[],dp);
   for(let i=1;i<=n;i++)for(let j=1;j<=m;j++){
    if(id==='lcs'||id==='scs')dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
    else if(id==='lcsubstr'){dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:0;if(dp[i][j]>bestLength){bestLength=dp[i][j];bestEnd=i;}}
    else if(id==='edit')dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
    else if(id==='distinct')dp[i][j]=dp[i-1][j]+(a[i-1]===b[j-1]?dp[i-1][j-1]:0);
    else dp[i][j]=b[j-1]==='*'?Number(dp[i-1][j]||dp[i][j-1]):Number((b[j-1]==='?'||b[j-1]===a[i-1])&&dp[i-1][j-1]);
    emit(`Prefixes ${i} and ${j}: table value ${dp[i][j]}`,[],dp,[i,j]);
   }
   if(id==='edit'||id==='distinct')result=dp[n][m];else if(id==='wildcard')result=Boolean(dp[n][m]);else if(id==='lcsubstr')result=a.slice(bestEnd-bestLength,bestEnd).join('');else{
    let i=n,j=m,out=[];while(i&&j){if(a[i-1]===b[j-1]){out.push(a[--i]);j--;}else if(dp[i-1][j]>=dp[i][j-1]){if(id==='scs')out.push(a[i-1]);i--;}else{if(id==='scs')out.push(b[j-1]);j--;}}
    if(id==='scs'){while(i)out.push(a[--i]);while(j)out.push(b[--j]);}result=out.reverse().join('');
   }
  }else if(id==='lps'||id==='palcut'){
   const dp=Array.from({length:n},()=>Array(n).fill(0));
   if(id==='lps'){for(let i=n-1;i>=0;i--){dp[i][i]=1;for(let j=i+1;j<n;j++){dp[i][j]=a[i]===a[j]?2+(j-i===1?0:dp[i+1][j-1]):Math.max(dp[i+1][j],dp[i][j-1]);emit(`Best palindrome subsequence in [${i}, ${j}]: ${dp[i][j]}`,[],dp,[i,j]);}}result=n?dp[0][n-1]:0;
   }else{const cuts=Array(n).fill(0);for(let end=0;end<n;end++){cuts[end]=end;for(let start=0;start<=end;start++){if(a[start]===a[end]&&(end-start<2||dp[start+1][end-1])){dp[start][end]=1;cuts[end]=Math.min(cuts[end],start===0?0:cuts[start-1]+1);}emit(`Palindrome [${start}, ${end}]? ${Boolean(dp[start][end])}; cuts through ${end}: ${cuts[end]}`,[row('Minimum cuts per prefix',cuts,[end])],dp,[start,end]);}}result=n?cuts[n-1]:0;}
  }else if(id==='wordbreak'){
   const dictionary=new Set(words()),dp=Array(n+1).fill(false);dp[0]=true;
   for(let end=1;end<=n;end++)for(let start=0;start<end;start++){const word=a.slice(start,end).join('');if(dp[start]&&dictionary.has(word))dp[end]=true;emit(`Prefix ${end}: try ${JSON.stringify(word)} after reachable prefix ${start}`,[row('Reachable prefix lengths',dp,[start,end])]);if(dp[end])break;}result=dp[n];
  }else if(['minwindow','anagrams','unique'].includes(id)){
   const counts=new Map(),need=new Map();for(const c of b)need.set(c,(need.get(c)||0)+1);let left=0,missing=m,bestStart=0,bestLength=id==='unique'?0:Infinity;result=[];
   for(let right=0;right<n;right++){
    const c=a[right];counts.set(c,(counts.get(c)||0)+1);
    if(id==='unique'){while(counts.get(c)>1){const old=a[left++];counts.set(old,counts.get(old)-1);}if(right-left+1>bestLength){bestStart=left;bestLength=right-left+1;}}
    else{if((counts.get(c)||0)<=(need.get(c)||0))missing--;
     const remove=()=>{const old=a[left++];if(counts.get(old)<=(need.get(old)||0))missing++;counts.set(old,counts.get(old)-1);};
     if(id==='anagrams'){while(right-left+1>m)remove();if(m&&missing===0&&right-left+1===m)result.push(left);}
     else if(m)while(missing===0){if(right-left+1<bestLength){bestStart=left;bestLength=right-left+1;}emit(`Valid window [${left}, ${right}]; try shrinking`,[row('Text',a,Array.from({length:right-left+1},(_,i)=>left+i))]);remove();}
    }
    emit(`Window [${left}, ${right}]${id==='unique'?' has no repeated characters':`; missing ${missing} required characters`}`,[row('Text',a,Array.from({length:Math.max(0,right-left+1)},(_,i)=>left+i)),row('Characters',[...counts.keys()]),row('Window counts',[...counts.values()])]);
   }
   if(id==='anagrams'){if(!m)result=indices();}else result=m||id==='unique'?(Number.isFinite(bestLength)?a.slice(bestStart,bestStart+bestLength).join(''):''):'';
  }else throw Error(`Unknown string algorithm: ${id}`);
  const last=frames[frames.length-1];
  emit(`Result: ${JSON.stringify(result)}`,last.rows.length?last.rows:[row('Text',a)],last.matrix);frames[frames.length-1].result=result;
  return {result,frames};
 }
 root.StringAlgorithms={solve};
 if(typeof module!=='undefined')module.exports={solve};
})(globalThis);
