// Advanced lessons use immutable frames, so every operation can be replayed.
const advancedLessons = [
 ['dijkstra','Advanced Graphs','Dijkstra · Shortest Paths','O(V² + E)','Find the cheapest routes from A in a graph with nonnegative weights.','This demo scans vertices: O(V² + E) time, O(V) working space. A priority queue implementation can improve sparse-graph performance.'],
 ['kruskal','Advanced Graphs','Kruskal · Minimum Spanning Tree','O(E log E)','Connect all vertices with the smallest total edge weight.','Sorting dominates: O(E log E) time. Disjoint-set storage: O(V). The example is a connected, undirected graph.'],
 ['topological','Advanced Graphs','Topological Sort · Kahn','O(V + E)','Schedule tasks so every prerequisite comes first.','Time: O(V + E). Extra space: O(V). Only directed acyclic graphs have a complete topological ordering.'],
 ['lis','Advanced DP','Longest Increasing Subsequence','O(n²)','Find the longest strictly increasing sequence, allowing skipped positions.','Time: O(n²), space: O(n) for lengths and parent pointers. Equal values do not extend a strictly increasing sequence.'],
 ['coin','Advanced DP','Coin Change · Fewest Coins','O(k × amount)','Find the fewest coins needed to make an exact amount.','Time: O(k × amount), space: O(amount). Coins must be positive integers; supplies are unlimited.'],
 ['kmp','String Algorithms','KMP · Pattern Matching','O(n + m)','Find a pattern without repeatedly checking characters that already matched.','Time: O(n + m), space: O(m) for the prefix table. This demo returns the first match, or −1.']
];
for(const [id,group,title,complexity,desc,cost] of advancedLessons)lessons.push({id,group,title,complexity,desc,how:desc,cost,type:'advanced'});

Object.assign(guides, {
 dijkstra:{idea:'Imagine finding the cheapest travel costs from your home. Always finish the cheapest unfinished destination next.',steps:['Give A distance 0 and all other vertices distance infinity.','Choose the unfinished vertex with the smallest distance. Its distance is final because edge weights are nonnegative.','For each neighbor, compare its current distance with the cost of going through this vertex. Keep the cheaper route.','Repeat until no reachable unfinished vertices remain.'],example:'A→B costs 4, A→C costs 2, and C→B costs 1. Going through C costs 3, so B improves from 4 to 3.',use:'Road routing and other shortest-path problems with nonnegative edge weights. Negative weights require a different algorithm.',watch:'The fixed undirected graph shows edge weights. The table records the best distances from A; green vertices have final distances.'},
 kruskal:{idea:'Connect a group of towns as cheaply as possible. Keep choosing the cheapest road that does not form a loop.',steps:['Sort all edges by weight, cheapest first.','Start with each vertex in its own group.','If an edge joins different groups, accept it and merge the groups. Otherwise skip it because it would form a cycle.','Stop after accepting V − 1 edges for a connected graph.'],example:'For edges B–C:1, A–C:2, A–B:4, take B–C and A–C. Skip A–B: all three towns are already connected. Total cost: 3.',use:'Designing inexpensive connected networks. A spanning tree minimizes total connection cost; it does not guarantee shortest routes between vertices.',watch:'Green edges belong to the chosen tree. Orange marks the edge being considered. The status explains accepted and rejected edges.'},
 topological:{idea:'Plan tasks like getting dressed: socks must come before shoes, but unrelated tasks can happen in either order.',steps:['Count how many incoming edges each task has. This is its number of unfinished prerequisites.','Put all tasks with zero prerequisites in a queue.','Remove a task, add it to the schedule, and reduce the counts of the tasks that depend on it.','Enqueue newly available tasks. If tasks remain but the queue is empty, a cycle prevents a complete schedule.'],example:'A→B, A→C, B→D, C→D: A must come first, B and C may come in either order, and D must come after both.',use:'Build systems, course prerequisites, and dependency scheduling for directed acyclic graphs.',watch:'Arrowheads show prerequisite direction. The table shows remaining incoming edges, and the status shows the available queue.'},
 lis:{idea:'Pick numbers from left to right so each chosen number is bigger than the last. You may skip numbers, but cannot reorder them.',steps:['Give every index a starting length of 1: a single number is already an increasing subsequence.','For each index i, inspect earlier indices j.','If value[j] is smaller than value[i], try extending the best subsequence ending at j. Keep the longest option and remember its previous index.','Find the largest length and follow previous indices backward to recover one answer.'],example:'In [3, 1, 2, 5, 4], one longest increasing subsequence is [1, 2, 5], with length 3. [1, 2, 4] is equally valid.',use:'Finding ordered trends when skipped values are allowed. Unlike maximum subarray, the chosen positions need not be next to each other.',watch:'The table gives the longest length ending at each index. Highlighted input cells in the final frame show one valid longest subsequence.'},
 coin:{idea:'Build answers for small amounts first, then reuse them to make larger amounts with as few coins as possible.',steps:['Set the cost of amount 0 to 0 coins. Mark every positive amount unreachable initially.','For each amount, try every coin that fits.','If the amount minus that coin is reachable, try its answer plus one coin. Keep the smallest count.','Read the target answer and follow the remembered coins backward. Infinity means the exact amount is impossible.'],example:'With coins [1, 3, 4] and target 6, greedy choosing 4 gives 4+1+1: three coins. Dynamic programming finds 3+3: two coins.',use:'Making an exact total using unlimited copies of each denomination. This solves cases where taking the largest coin first fails.',watch:'Input values are coin denominations; Target is the amount, limited to 40 for a readable table. Zero and fractional coin values are rejected.'},
 kmp:{idea:'When a partial match fails, reuse what you already know instead of starting the whole comparison again.',steps:['Build an LPS table for the pattern: each entry stores the longest proper prefix that is also a suffix of the pattern ending there. Proper means shorter than the whole part.','Compare the text and pattern from left to right. On a match, move both positions forward.','On a mismatch after some matches, set the pattern position to the previous LPS value. Keep the text position unchanged.','If the whole pattern matches, return its starting index. If the text ends first, return −1.'],example:'For pattern ABAB, the LPS table is [0, 0, 1, 2]. In text ABACABAB, a mismatch after ABA falls back to a known prefix, and the full pattern is found at index 4.',use:'Searching text efficiently, especially when repeated prefixes cause naive matching to redo comparisons.',watch:'Use the Text and Pattern controls. Matching is case-sensitive. Indices count Unicode code points; spaces are meaningful. The LPS table is built before text scanning.'}
});

Object.assign(PY, {
dijkstra:`def dijkstra(graph, start):
    vertices = set(graph) | {start}
    for edges in graph.values():
        for neighbor, weight in edges:
            if weight < 0:
                raise ValueError("Dijkstra requires nonnegative weights")
            vertices.add(neighbor)
    distance = dict.fromkeys(vertices, float('inf'))
    distance[start] = 0
    remaining = set(vertices)
    while remaining:
        node = min(remaining, key=distance.get)
        if distance[node] == float('inf'):
            break
        remaining.remove(node)
        for neighbor, weight in graph.get(node, []):
            distance[neighbor] = min(distance[neighbor], distance[node] + weight)
    return distance

print(dijkstra({'A': [('B', 4), ('C', 2)], 'C': [('B', 1)]}, 'A'))`,
kruskal:`def kruskal(vertices, edges):
    parent = {v: v for v in vertices}
    size = {v: 1 for v in vertices}
    def find(v):
        while parent[v] != v:
            parent[v] = parent[parent[v]]
            v = parent[v]
        return v
    tree, total = [], 0
    for u, v, weight in sorted(edges, key=lambda edge: edge[2]):
        a, b = find(u), find(v)
        if a == b:
            continue
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        tree.append((u, v, weight))
        total += weight
    return tree, total  # A forest if the graph is disconnected.

print(kruskal('ABC', [('A', 'B', 4), ('A', 'C', 2), ('B', 'C', 1)]))`,
topological:`from collections import deque

def topological_sort(graph):
    indegree = {v: 0 for v in graph}
    for neighbors in graph.values():
        for v in neighbors:
            indegree[v] = indegree.get(v, 0) + 1
    queue = deque(v for v in indegree if indegree[v] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    if len(order) != len(indegree):
        raise ValueError("Graph contains a cycle")
    return order

print(topological_sort({'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': []}))`,
lis:`def longest_increasing_subsequence(items):
    if not items:
        return []
    lengths, previous = [1] * len(items), [-1] * len(items)
    for i in range(len(items)):
        for j in range(i):
            if items[j] < items[i] and lengths[j] + 1 > lengths[i]:
                lengths[i] = lengths[j] + 1
                previous[i] = j
    index = max(range(len(items)), key=lambda i: lengths[i])
    result = []
    while index != -1:
        result.append(items[index])
        index = previous[index]
    return result[::-1]

print(longest_increasing_subsequence([3, 1, 2, 5, 4]))`,
coin:`def coin_change(coins, amount):
    if not isinstance(amount, int) or amount < 0:
        raise ValueError("Amount must be a nonnegative integer")
    if any(not isinstance(c, int) or c <= 0 for c in coins):
        raise ValueError("Coins must be positive integers")
    best = [0] + [float('inf')] * amount
    choice = [None] * (amount + 1)
    for value in range(1, amount + 1):
        for coin in coins:
            if coin <= value and best[value - coin] + 1 < best[value]:
                best[value] = best[value - coin] + 1
                choice[value] = coin
    if best[amount] == float('inf'):
        return -1, []
    result, remaining = [], amount
    while remaining:
        coin = choice[remaining]
        result.append(coin)
        remaining -= coin
    return best[amount], result

print(coin_change([1, 3, 4], 6))`,
kmp:`def kmp_search(text, pattern):
    if not pattern:
        return 0
    lps = [0] * len(pattern)
    length, i = 0, 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            i += 1
    i = j = 0
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):
                return i - j
        elif j:
            j = lps[j - 1]
        else:
            i += 1
    return -1

print(kmp_search('ABACABAB', 'ABAB'))`
});

const graphVertices=['A','B','C','D','E','F'];
const weightedEdges=[['A','B',4],['A','C',2],['B','C',1],['B','D',5],['C','D',8],['C','E',10],['D','E',2],['D','F',6],['E','F',3]];
const dependencyEdges=[['A','B'],['A','C'],['B','D'],['C','D'],['C','E'],['D','F'],['E','F']];
const advancedIds=new Set(advancedLessons.map(x=>x[0]));
const graphIds=new Set(['dijkstra','kruskal','topological']);
function advancedFrame(msg, extra={}) {frames.push({a:[],active:[],done:[],msg,...extra});}
const produceBeforeAdvanced=produce;
produce=function(){
 if(!advancedIds.has(selected.id))return produceBeforeAdvanced();
 frames=[];index=0;
 const id=selected.id;
 if(graphIds.has(id)) {
  const edges=id==='topological'?dependencyEdges:weightedEdges;
  const settled=[],chosen=[];
  const snapshot=(msg,table,active=[],edge=null)=>advancedFrame(msg,{table:[...table],labels:graphVertices,vertices:[...settled],active,edge,chosen:[...chosen],edges});
  if(id==='dijkstra') {
   const distance=[0,Infinity,Infinity,Infinity,Infinity,Infinity];snapshot('Start at A; ∞ means not reached yet',distance);
   while(settled.length<6){let u=-1;for(let i=0;i<6;i++)if(!settled.includes(graphVertices[i])&&(u<0||distance[i]<distance[u]))u=i;
    if(u<0||!Number.isFinite(distance[u]))break;
    const node=graphVertices[u];settled.push(node);snapshot(`Finalize ${node}: distance ${distance[u]}`,distance,[node]);
    for(const [a,b,w] of edges){if(a!==node&&b!==node)continue;const other=a===node?b:a,v=graphVertices.indexOf(other);if(settled.includes(other))continue;const candidate=distance[u]+w;
     snapshot(`Try ${node} → ${other}: ${distance[u]} + ${w} = ${candidate}`,distance,[node,other],[a,b]);
     if(candidate<distance[v]){distance[v]=candidate;snapshot(`Improve ${other} to ${candidate}`,distance,[other],[a,b]);}}
   }snapshot(`Shortest distances from A: ${distance.join(', ')}`,distance);
  } else if(id==='kruskal') {
   const parent=Object.fromEntries(graphVertices.map(v=>[v,v])),size=Object.fromEntries(graphVertices.map(v=>[v,1]));
   function find(v){while(parent[v]!==v){parent[v]=parent[parent[v]];v=parent[v];}return v;}
   let total=0;snapshot('Start with six separate components',graphVertices.map(v=>v));
   for(const [a,b,w] of [...edges].sort((a,b)=>a[2]-b[2])){snapshot(`Consider ${a}–${b}, weight ${w}`,graphVertices.map(find),[a,b],[a,b]);let x=find(a),y=find(b);if(x===y){snapshot(`Skip ${a}–${b}: it would create a cycle`,graphVertices.map(find),[a,b],[a,b]);continue;}if(size[x]<size[y])[x,y]=[y,x];parent[y]=x;size[x]+=size[y];chosen.push([a,b]);total+=w;snapshot(`Accept ${a}–${b}; total weight ${total}`,graphVertices.map(find),[a,b]);if(chosen.length===5)break;}
   snapshot(`Minimum spanning tree: ${chosen.length} edges, total weight ${total}`,graphVertices.map(find));
  } else {
   const counts=graphVertices.map(v=>edges.filter(e=>e[1]===v).length),queue=graphVertices.filter((v,i)=>counts[i]===0);snapshot(`Queue: [${queue.join(', ')}]`,counts);
   while(queue.length){const node=queue.shift();settled.push(node);snapshot(`Schedule ${node}; order: ${settled.join(' → ')}`,counts,[node]);for(const [a,b] of edges)if(a===node){const i=graphVertices.indexOf(b);counts[i]--;if(counts[i]===0)queue.push(b);snapshot(`Complete prerequisite ${a} → ${b}; queue: [${queue.join(', ')}]`,counts,[b],[a,b]);}}
   snapshot(settled.length===6?`Valid order: ${settled.join(' → ')}`:'Cycle detected: no complete ordering',counts);
  }
 } else if(id==='lis') {
  const a=values(),dp=a.map(()=>1),previous=a.map(()=>-1);
  const snap=(msg,active=[],done=[])=>advancedFrame(msg,{a:[...a],table:[...dp],labels:a.map((_,i)=>i),active,done});
  snap('Each value alone has subsequence length 1');
  for(let i=0;i<a.length;i++)for(let j=0;j<i;j++){snap(`Can ${a[i]} extend a sequence ending in ${a[j]}?`,[j,i]);if(a[j]<a[i]&&dp[j]+1>dp[i]){dp[i]=dp[j]+1;previous[i]=j;snap(`Length ending at index ${i} improves to ${dp[i]}`,[i]);}}
  let p=dp.indexOf(Math.max(...dp)),path=[];while(p!==-1){path.unshift(p);p=previous[p];}snap(`Length ${path.length}: ${path.map(i=>a[i]).join(' → ')}`,[],path);
 } else if(id==='coin') {
  const coins=[...new Set(values())];if(coins.some(c=>!Number.isInteger(c)||c<=0))throw Error('Coin values must be positive integers.');
  const raw=$('target').value.trim(),amount=raw===''?6:Number(raw);if(!Number.isInteger(amount)||amount<0||amount>40)throw Error('Enter a target amount from 0 to 40.');
  const dp=Array(amount+1).fill(Infinity),choice=Array(amount+1);dp[0]=0;
  const snap=(msg,active=[])=>advancedFrame(msg,{table:[...dp],labels:dp.map((_,i)=>i),active});snap('Amount 0 needs 0 coins; ∞ means unreachable');
  for(let value=1;value<=amount;value++)for(const coin of coins)if(coin<=value){snap(`Try coin ${coin} for amount ${value}`,[value-coin,value]);if(dp[value-coin]+1<dp[value]){dp[value]=dp[value-coin]+1;choice[value]=coin;snap(`Amount ${value} now needs ${dp[value]} coins`,[value]);}}
  const result=[];let remaining=amount;if(Number.isFinite(dp[amount]))while(remaining){result.push(choice[remaining]);remaining-=choice[remaining];}
  snap(Number.isFinite(dp[amount])?`Fewest coins: ${dp[amount]}; coins: [${result.join(', ')}]`:`Amount ${amount} is unreachable`,[amount]);
 } else {
  const text=Array.from($('matchText').value),pattern=Array.from($('matchPattern').value);
  if(text.length>60||pattern.length>24)throw Error('Use at most 60 text characters and 24 pattern characters.');
  const lps=Array(pattern.length).fill(0);
  const snap=(msg,i=-1,j=-1)=>advancedFrame(msg,{table:[...lps],labels:pattern.map((v,i)=>`${i}: ${v}`),text:[...text],pattern:[...pattern],textIndex:i,patternIndex:j});
  snap('Build the LPS prefix table');
  let i=1,length=0;while(i<pattern.length){if(pattern[i]===pattern[length]){lps[i++]=++length;snap(`Save prefix length ${length} at index ${i-1}`);}else if(length){length=lps[length-1];snap(`Prefix mismatch: fall back to length ${length}`);}else{i++;snap(`No matching prefix at index ${i-1}`);}}
  i=0;let j=0,found=pattern.length? -1:0;
  while(i<text.length&&pattern.length){snap(`Compare text[${i}] with pattern[${j}]`,i,j);if(text[i]===pattern[j]){i++;j++;if(j===pattern.length){found=i-j;break;}}else if(j){j=lps[j-1];snap(`Reuse prefix: pattern position becomes ${j}`,i,j);}else i++;}
  snap(found>=0?`Found pattern at index ${found}`:'Pattern not found (−1)');
 }
 render();
};

const renderBeforeAdvanced=render;
render=function(){
 renderBeforeAdvanced();if(!advancedIds.has(selected.id)||!frames[index])return;
 const f=frames[index],active=new Set(f.active),done=new Set(f.done);
 const cell=(value,label,highlight)=>`<div class="trace-cell ${highlight?'trace-active':''}"><small>${esc(label)}</small><strong>${esc(value===Infinity?'∞':value)}</strong></div>`;
 let content='';
 if(graphIds.has(selected.id)) {
  const coords={A:[60,60],B:[220,40],C:[90,180],D:[340,120],E:[240,245],F:[440,245]},directed=selected.id==='topological';
  const same=(a,b,e)=>e&&((a===e[0]&&b===e[1])||(!directed&&b===e[0]&&a===e[1]));
  content=`<svg viewBox="0 0 510 300" role="img" aria-label="${esc(selected.title)} graph"><defs><marker id="edge-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8294b9"/></marker></defs>${f.edges.map(([a,b,w])=>{const p=coords[a],q=coords[b],dx=q[0]-p[0],dy=q[1]-p[1],dist=Math.hypot(dx,dy),color=same(a,b,f.edge)?'#ffc470':f.chosen.some(e=>same(a,b,e))?'#55e3db':'#637697';return `<line x1="${p[0]+dx/dist*24}" y1="${p[1]+dy/dist*24}" x2="${q[0]-dx/dist*28}" y2="${q[1]-dy/dist*28}" stroke="${color}" stroke-width="3" ${directed?'marker-end="url(#edge-tip)"':''}/>${w===undefined?'':`<text x="${(p[0]+q[0])/2}" y="${(p[1]+q[1])/2-8}" text-anchor="middle" class="edge-weight">${w}</text>`}`;}).join('')}${graphVertices.map(v=>{const [x,y]=coords[v];return `<circle cx="${x}" cy="${y}" r="23" fill="${active.has(v)?'#96703d':f.vertices.includes(v)?'#126d6c':'#273859'}" stroke="#7a94c2"/><text x="${x}" y="${y+5}" text-anchor="middle" fill="white">${v}</text>`;}).join('')}</svg>`;
 } else if(selected.id==='lis')content=`<div class="trace-row">${f.a.map((v,i)=>cell(v,`input[${i}]`,active.has(i)||done.has(i))).join('')}</div>`;
 else if(selected.id==='kmp')content=`<p class="trace-caption">Text</p><div class="trace-row">${f.text.map((v,i)=>cell(v,i,i===f.textIndex)).join('')}</div><p class="trace-caption">Pattern</p><div class="trace-row">${f.pattern.map((v,i)=>cell(v,i,i===f.patternIndex)).join('')}</div>`;
 const title=selected.id==='dijkstra'?'Distance from A':selected.id==='kruskal'?'Disjoint-set representative':selected.id==='topological'?'Remaining prerequisites':selected.id==='lis'?'Best length ending at each index':selected.id==='coin'?'Fewest coins for each amount':'LPS prefix table';
 content+=`<p class="trace-caption">${title}</p><div class="trace-row">${f.table.map((v,i)=>cell(v,f.labels[i],active.has(i))).join('')}</div>`;
 $('viz').innerHTML=`<div class="advanced-trace">${content}</div>`;
};

// Controls remain part of the shared lesson player.
const stringControls=document.createElement('div');stringControls.id='stringControls';stringControls.className='string-controls';stringControls.hidden=true;
stringControls.innerHTML='<label>Text <textarea id="matchText" rows="2" maxlength="120" aria-label="Text to search">ABACABAB</textarea></label><label>Pattern <input id="matchPattern" type="text" value="ABAB" maxlength="48" aria-label="Pattern to find"></label>';
$('input').closest('label').parentElement.append(stringControls);
$('matchText').onchange=rebuild;$('matchPattern').onchange=rebuild;
const chooseBeforeAdvanced=choose;
choose=function(id){
 const isGraph=graphIds.has(id),isKmp=id==='kmp';
 // The shared chooser produces a first frame, so set lesson-specific defaults first.
 if(id==='coin')$('target').value='6';
 chooseBeforeAdvanced(id);
 $('input').closest('label').hidden=isKmp;
 $('stringControls').hidden=!isKmp;
 $('input').disabled=isGraph||id==='bfs'||id==='dfs';$('random').disabled=$('input').disabled||isKmp;
 $('targetControl').hidden=!['linear','binary','coin'].includes(id);
 if(id==='coin'){$('input').value='1, 3, 4';$('target').value='6';}
 if(id==='lis')$('input').value='3, 1, 2, 5, 4';
 if(advancedIds.has(id))rebuild();
};
for(const group of [...new Set(advancedLessons.map(x=>x[1]))]){
 const heading=document.createElement('div');heading.className='side-label';heading.textContent=group.toUpperCase();nav.append(heading);
 for(const lesson of lessons.filter(l=>l.group===group)){const b=document.createElement('button');b.textContent=lesson.title;b.dataset.lesson=lesson.id;b.onclick=()=>choose(lesson.id);nav.append(b);}
}
$('topicCount').textContent=lessons.length;
const randomBeforeAdvanced=$('random').onclick;
$('random').onclick=()=>{if(selected.id==='coin'){$('input').value=[1,...Array.from({length:3},()=>1+Math.floor(Math.random()*9))].join(', ');rebuild();}else randomBeforeAdvanced();};
restoreProgress();
choose(selected.id);
