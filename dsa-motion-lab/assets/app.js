const PY = {
bubble:`def bubble_sort(arr):
    a = arr.copy()
    for end in range(len(a) - 1, 0, -1):
        swapped = False
        for i in range(end):
            if a[i] > a[i + 1]:
                a[i], a[i + 1] = a[i + 1], a[i]
                swapped = True
        if not swapped:
            break
    return a

print(bubble_sort([8, 3, 5, 1, 9, 2]))`,
selection:`def selection_sort(arr):
    a = arr.copy()
    for i in range(len(a)):
        smallest = i
        for j in range(i + 1, len(a)):
            if a[j] < a[smallest]:
                smallest = j
        a[i], a[smallest] = a[smallest], a[i]
    return a

print(selection_sort([8, 3, 5, 1, 9, 2]))`,
insertion:`def insertion_sort(arr):
    a = arr.copy()
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a

print(insertion_sort([8, 3, 5, 1, 9, 2]))`,
linear:`def linear_search(arr, target):
    for i, value in enumerate(arr):
        if value == target:
            return i
    return -1

print(linear_search([8, 3, 5, 1, 9, 2], 5))`,
binary:`def binary_search(sorted_arr, target):
    lo, hi = 0, len(sorted_arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if sorted_arr[mid] == target:
            return mid
        if sorted_arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(binary_search([1, 2, 3, 5, 8, 9], 5))`,
stack:`stack = []
for x in [8, 3, 5, 1]:
    stack.append(x)  # push: O(1) amortized
print(stack[-1])  # peek: 1
print(stack.pop()) # pop: 1
print(stack)`,
queue:`from collections import deque
queue = deque()
for x in [8, 3, 5, 1]:
    queue.append(x)    # enqueue: O(1)
print(queue[0])       # front: 8
print(queue.popleft()) # dequeue: 8
print(list(queue))`,
linked:`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

head = None
for value in reversed([8, 3, 5, 1]):
    head = Node(value, head)

current = head
while current is not None:
    print(current.value, end=' -> ')
    current = current.next
print('None')`,
bfs:`from collections import deque

graph = {'A': ['B','C'], 'B': ['D','E'],
         'C': ['F'], 'D': [], 'E': ['F'], 'F': []}

def bfs(start):
    q = deque([start])
    seen = {start}
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in seen:
                seen.add(neighbor)
                q.append(neighbor)
    return order

print(bfs('A'))`,
dfs:`graph = {'A': ['B','C'], 'B': ['D','E'],
         'C': ['F'], 'D': [], 'E': ['F'], 'F': []}

def dfs(node, seen=None):
    if seen is None:
        seen = set()
    if node in seen:
        return []
    seen.add(node)
    order = [node]
    for neighbor in graph[node]:
        order.extend(dfs(neighbor, seen))
    return order

print(dfs('A'))`,
bst:`class Node:
    def __init__(self, value):
        self.value = value
        self.left = self.right = None

def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    elif value > root.value:
        root.right = insert(root.right, value)
    return root

def inorder(root):
    if root:
        yield from inorder(root.left)
        yield root.value
        yield from inorder(root.right)

root = None
for x in [8, 3, 10, 1, 6, 14]:
    root = insert(root, x)
print(list(inorder(root)))`
};
const lessons = [
{id:'bubble',group:'Sorting',title:'Bubble Sort',complexity:'O(n²)',desc:'Compare neighbors and swap them when they are out of order.',how:'After each complete pass, the largest remaining value has moved to the right. The algorithm stops early if a pass makes no swaps.',cost:'Time: O(n²) average/worst, O(n) best with early exit. Extra space: O(1). Stable.',type:'bars'},
{id:'selection',group:'Sorting',title:'Selection Sort',complexity:'O(n²)',desc:'Find the smallest value in the remaining unsorted portion.',how:'Scan the remaining array for the minimum, then swap it into the next final position.',cost:'Time: O(n²) all cases. Extra space: O(1). Not stable in this implementation.',type:'bars'},
{id:'insertion',group:'Sorting',title:'Insertion Sort',complexity:'O(n²)',desc:'Build a sorted prefix by inserting each next value where it belongs.',how:'Shift greater elements right until the current key fits. Excellent for tiny or nearly sorted collections.',cost:'Time: O(n²) average/worst, O(n) best. Extra space: O(1). Stable.',type:'bars'},
{id:'linear',group:'Searching',title:'Linear Search',complexity:'O(n)',desc:'Inspect each element until the target is found.',how:'Works on unsorted input. First matching index is returned, or -1 if absent. Target defaults to the third number.',cost:'Time: O(n) worst, O(1) best. Extra space: O(1).',type:'bars'},
{id:'binary',group:'Searching',title:'Binary Search',complexity:'O(log n)',desc:'Halve the search interval on every comparison.',how:'Requires sorted input. Compare the target with the middle value and eliminate the irrelevant half. Target defaults to the middle value of the sorted input.',cost:'Time: O(log n). Extra space: O(1) iterative.',type:'bars'},
{id:'stack',group:'Linear Structures',title:'Stack · LIFO',complexity:'O(1)',desc:'Last in, first out — like a stack of plates.',how:'Push values onto the top; pop the most recently pushed item. Useful for undo, parsing, and DFS.',cost:'Push/pop: O(1) amortized for Python lists. Peek: O(1). Space: O(n).',type:'nodes'},
{id:'queue',group:'Linear Structures',title:'Queue · FIFO',complexity:'O(1)',desc:'First in, first out — like people waiting in line.',how:'Enqueue on the right and dequeue from the left. Useful for task scheduling and BFS.',cost:'Enqueue/dequeue: O(1) with collections.deque. Space: O(n).',type:'nodes'},
{id:'linked',group:'Linear Structures',title:'Singly Linked List',complexity:'O(n)',desc:'Each node stores a value and a reference to the next node.',how:'Following next pointers walks the sequence. Insertion at the known head is O(1), but indexed access needs traversal.',cost:'Traversal/search: O(n). Prepend: O(1). Extra reference per node.',type:'nodes'},
{id:'bfs',group:'Graphs',title:'Breadth-First Search',complexity:'O(V + E)',desc:'Explore a graph one layer at a time using a queue.',how:'Visit A first, then its immediate neighbors B and C, then the next layer. BFS finds shortest paths in unweighted graphs.',cost:'Time: O(V + E), space: O(V), using adjacency lists.',type:'graph'},
{id:'dfs',group:'Graphs',title:'Depth-First Search',complexity:'O(V + E)',desc:'Follow one path as deep as possible before backtracking.',how:'Visit one neighbor recursively, continue to the deepest reachable node, then return and explore another branch.',cost:'Time: O(V + E), space: O(V) including recursion.',type:'graph'},
{id:'bst',group:'Trees',title:'Binary Search Tree',complexity:'O(h)',desc:'Smaller values go left; larger values go right.',how:'Insert values by comparing with each node and following its left or right pointer. In-order traversal gives sorted output.',cost:'Average search/insert: O(log n) for balanced trees; worst O(n) if skewed. h is tree height.',type:'tree'}
];
let selected=lessons[0],frames=[],index=0,playing=false,timer=null;
const $=id=>document.getElementById(id);
const nav=$('nav');let prevGroup='';for(const lesson of lessons){if(lesson.group!==prevGroup){const heading=document.createElement('div');heading.className='side-label';heading.style.paddingTop='14px';heading.textContent=lesson.group.toUpperCase();nav.appendChild(heading);prevGroup=lesson.group}const b=document.createElement('button');b.textContent=lesson.title;b.dataset.lesson=lesson.id;b.addEventListener('click',()=>choose(lesson.id));nav.appendChild(b)}
$('topicCount').textContent=lessons.length;
function values(){const raw=$('input').value.trim();const numbers=raw.split(/[ ,]+/).filter(Boolean).map(Number);if(!numbers.length||numbers.length>16||numbers.some(x=>!Number.isFinite(x)||Math.abs(x)>999)){throw Error('Enter between 1 and 16 valid numbers (−999 to 999).')}return numbers}
function frame(a,msg,active=[],done=[]){frames.push({a:[...a],msg,active:[...active],done:[...done]})}
function produce(){frames=[];let a=values();const id=selected.id;frame(a,'Initial state — press Next or Play');const n=a.length;
if(id==='bubble'){for(let end=n-1;end>0;end--){let swapped=false;for(let i=0;i<end;i++){frame(a,`Compare ${a[i]} and ${a[i+1]}`,[i,i+1],Array.from({length:n-1-end},(_,k)=>n-1-k));if(a[i]>a[i+1]){[a[i],a[i+1]]=[a[i+1],a[i]];swapped=true;frame(a,'Swap because left value is larger',[i,i+1])}}frame(a,`Position ${end} is settled`,[],Array.from({length:n-end},(_,k)=>n-1-k));if(!swapped)break}frame(a,'Sorted!',[],a.map((_,i)=>i))}
else if(id==='selection'){for(let i=0;i<n;i++){let min=i;for(let j=i+1;j<n;j++){frame(a,`Compare current minimum ${a[min]} with ${a[j]}`,[min,j],Array.from({length:i},(_,k)=>k));if(a[j]<a[min])min=j}if(min!==i)[a[i],a[min]]=[a[min],a[i]];frame(a,`Lock the minimum at index ${i}`,[i],Array.from({length:i+1},(_,k)=>k))}frame(a,'Sorted!',[],a.map((_,i)=>i))}
else if(id==='insertion'){for(let i=1;i<n;i++){let key=a[i],j=i-1;frame(a,`Insert ${key} into the sorted prefix`,[i]);while(j>=0&&a[j]>key){a[j+1]=a[j];frame(a,`Shift ${a[j]} right`,[j,j+1]);j--}a[j+1]=key;frame(a,`Placed ${key} at index ${j+1}`,[j+1],Array.from({length:i+1},(_,k)=>k))}frame(a,'Sorted!',[],a.map((_,i)=>i))}
else if(id==='linear'){let target=searchTarget(a[Math.min(2,n-1)]);let found=false;for(let i=0;i<n;i++){frame(a,`Is ${a[i]} equal to target ${target}?`,[i]);if(a[i]===target){frame(a,`Found ${target} at index ${i}`,[i],[i]);found=true;break}}if(!found)frame(a,`Target ${target} was not found`)}
else if(id==='binary'){a.sort((x,y)=>x-y);frames=[];frame(a,'First sort the input (binary search requires sorted data)');let target=searchTarget(a[Math.floor((n-1)/2)]),lo=0,hi=n-1;while(lo<=hi){const mid=Math.floor((lo+hi)/2);frame(a,`Search [${lo}, ${hi}]: compare middle ${a[mid]} to ${target}`,[mid]);if(a[mid]===target){frame(a,`Found ${target} at index ${mid}`,[mid],[mid]);break}if(a[mid]<target)lo=mid+1;else hi=mid-1;frame(a,`Discard the half that cannot contain ${target}`)} if(lo>hi)frame(a,`Target ${target} was not found`); }
else if(id==='stack'||id==='queue'){const data=[];frames=[];frame(data,'The structure is empty');for(const x of a.slice(0,8)){data.push(x);frame(data,id==='stack'?`Push ${x} on top`:`Enqueue ${x} at the rear`,[data.length-1])}if(data.length){const removed=id==='stack'?data.pop():data.shift();frame(data,id==='stack'?`Pop ${removed} from top`:`Dequeue ${removed} from front`)} }
else if(id==='linked'){frames=[];frame([],'Head → None');const built=[];for(const x of a.slice(0,8)){built.push(x);frame(built,`Append node ${x} and link previous next pointer`,[built.length-1])}built.forEach((x,i)=>frame(built,`Traverse node ${i}: value ${x}`,[i],Array.from({length:i},(_,k)=>k)));frame(built,'Reached None — traversal finished',[],built.map((_,i)=>i))}
else if(id==='bfs'||id==='dfs'){frames=[];const graph={A:['B','C'],B:['D','E'],C:['F'],D:[],E:['F'],F:[]};const seen=new Set(),order=[];frame(['A','B','C','D','E','F'],'Graph ready: start from A');if(id==='bfs'){const q=['A'];seen.add('A');while(q.length){const v=q.shift();order.push(v);frame(['A','B','C','D','E','F'],`Visit ${v}; queue is [${q.join(', ')}]`,[v],order);for(const w of graph[v])if(!seen.has(w)){seen.add(w);q.push(w);frame(['A','B','C','D','E','F'],`Discover ${w}; enqueue it`,[w],order)}}}else{function visit(v){if(seen.has(v))return;seen.add(v);order.push(v);frame(['A','B','C','D','E','F'],`Enter ${v} (recursive DFS)`,[v],order);for(const w of graph[v])visit(w);frame(['A','B','C','D','E','F'],`Backtrack from ${v}`,[],order)}visit('A')}frame(['A','B','C','D','E','F'],`Traversal: ${order.join(' → ')}`,[],order)}
else if(id==='bst'){frames=[];const nodes=[];frame(nodes,'Start with an empty tree');const unique=[...new Set(a)].slice(0,7);for(const value of unique){nodes.push(value);frame(nodes,`Insert ${value}: compare from root, left if smaller, right if larger`,[value])}frame(nodes,'BST built. An in-order walk returns ascending values.',[],nodes)}
index=0;render()}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function render(){const f=frames[index];if(!f)return;const viz=$('viz');const len=f.a.length;const act=new Set(f.active),done=new Set(f.done);if(selected.type==='bars'){const h=Math.max(1,...f.a.map(x=>Math.abs(x)));viz.innerHTML=`<div class="bars">${f.a.map((v,i)=>`<div class="barwrap"><div class="bar ${done.has(i)?'done':act.has(i)?'active':''}" style="height:${Math.max(15,Math.abs(v)/h*87)}%">${esc(v)}</div><div class="idx">${i}</div></div>`).join('')}</div>`}else if(selected.type==='nodes'){viz.innerHTML=`<div class="nodes">${f.a.map((v,i)=>`<div class="node ${done.has(i)?'done':act.has(i)?'active':''}">${esc(v)}</div>${i<len-1?'<div class="arrow">→</div>':''}`).join('')}${selected.id==='linked'?'<div class="arrow">→ None</div>':''}</div>`}else if(selected.type==='graph'){const coords={A:[170,35],B:[90,115],C:[250,115],D:[40,205],E:[145,205],F:[270,205]};const edges=[['A','B'],['A','C'],['B','D'],['B','E'],['C','F'],['E','F']];viz.innerHTML=`<svg viewBox="0 0 340 255" role="img" aria-label="Six-node graph animation">${edges.map(([a,b])=>`<line x1="${coords[a][0]}" y1="${coords[a][1]}" x2="${coords[b][0]}" y2="${coords[b][1]}" stroke="#526484" stroke-width="2"/>`).join('')}${Object.entries(coords).map(([name,[x,y]])=>`<circle cx="${x}" cy="${y}" r="24" fill="${act.has(name)?'#bc874a':done.has(name)?'#1a9996':'#354a74'}" stroke="#7a94c2"/><text x="${x}" y="${y+5}" font-size="16" text-anchor="middle" fill="white" font-weight="bold">${name}</text>`).join('')}</svg>`}else if(selected.type==='tree'){const positions=[];const roots=[];for(const val of f.a){const item={val,left:null,right:null};if(!roots.length){roots.push(item);positions.push({val,x:250,y:35})}else{let cur=roots[0],x=250,y=35,dist=110;while(true){if(val<cur.val){x-=dist;y+=45;if(cur.left){cur=cur.left;dist/=2}else{cur.left=item;break}}else{x+=dist;y+=80;if(cur.right){cur=cur.right;dist/=2}else{cur.right=item;break}}}positions.push({val,x,y})}}const connections=[];if(roots.length){const walk=(node,parent=null)=>{const p=positions.find(p=>p.val===node.val);if(parent)connections.push([parent,p]);if(node.left)walk(node.left,p);if(node.right)walk(node.right,p)};walk(roots[0])}viz.innerHTML=`<svg viewBox="0 0 500 350" role="img" aria-label="Binary search tree animation">${connections.map(([p,q])=>`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="#526484" stroke-width="2"/>`).join('')}${positions.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="23" fill="${act.has(p.val)?'#bc874a':done.has(p.val)?'#1a9996':'#354a74'}" stroke="#7a94c2"/><text x="${p.x}" y="${p.y+5}" fill="white" font-size="15" font-weight="bold" text-anchor="middle">${esc(p.val)}</text>`).join('')}</svg>`}
$('status').textContent=f.msg;$('counter').textContent=`${index+1} / ${frames.length}`;$('prev').disabled=index===0;$('next').disabled=index>=frames.length-1}
function pause(){playing=false;clearTimeout(timer);$('play').textContent='▶ Play animation'}function tick(){if(!playing)return;if(index<frames.length-1){index++;render();timer=setTimeout(tick,Math.max(100,1150-Number($('speed').value)*100))}else pause()}
function choose(id){pause();selected=lessons.find(x=>x.id===id);document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.lesson===id));$('crumb').textContent=selected.group;$('category').textContent=selected.group.toUpperCase();$('lessonTitle').textContent=selected.title;$('intro').textContent=selected.desc;$('complexity').textContent=selected.complexity;$('explanation').textContent=selected.how;$('analysis').textContent=selected.cost;$('code').textContent=PY[id];$('input').value=id==='bst'?'8, 3, 10, 1, 6, 14':id==='bfs'||id==='dfs'?'8, 3, 5, 1, 9, 2':'8, 3, 5, 1, 9, 2';$('input').disabled=id==='bfs'||id==='dfs';try{produce()}catch(e){$('status').textContent=e.message}}
$('next').onclick=()=>{pause();index=Math.min(frames.length-1,index+1);render()};$('prev').onclick=()=>{pause();index=Math.max(0,index-1);render()};$('play').onclick=()=>{if(!frames.length)return;if(playing){pause();return}if(index===frames.length-1)index=0;playing=true;$('play').textContent='Ⅱ Pause';tick()};$('reset').onclick=()=>{pause();try{produce()}catch(e){$('status').textContent=e.message}};$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(PY[selected.id]);$('copy').textContent='✓ Copied';setTimeout(()=>$('copy').textContent='Copy code ↗',1500)}catch(e){$('copy').textContent='Select code to copy'}};choose('bubble');

function searchTarget(fallback){const raw=$('target')?.value.trim() || '';if(!raw)return fallback;const value=Number(raw);if(!Number.isFinite(value)||Math.abs(value)>999)throw Error('Target must be a number between −999 and 999.');return value;}
