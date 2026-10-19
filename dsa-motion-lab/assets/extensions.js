// Additional lessons share the existing snapshot renderer and playback controls.
const additions = [
 ['merge','Sorting','Merge Sort','O(n log n)','Split ranges, then merge their sorted halves.','Stable. Time: O(n log n); extra space: O(n).'],
 ['quick','Sorting','Quick Sort','O(n log n)','Partition around a pivot, then sort each side.','Average: O(n log n); worst: O(n²). Recursion space: O(n) worst. Not stable.'],
 ['heap','Sorting','Heap Sort','O(n log n)','Build a max heap and move its largest value to the end.','Time: O(n log n); extra space: O(1). Not stable.'],
 ['prefix','Array Patterns','Prefix Sums','O(n)','Accumulate a running total at each index.','Build: O(n), storage: O(n). Range sum [l, r]: prefix[r] minus prefix[l − 1].'],
 ['kadane','Dynamic Programming','Maximum Subarray','O(n)','Keep the best sum ending here and the best sum seen.','Time: O(n); extra space: O(1). Handles all-negative arrays.'],
 ['fibonacci','Dynamic Programming','Fibonacci DP','O(n)','Fill a table using F(i) = F(i − 1) + F(i − 2).','Time: O(n); table space: O(n). Input length determines the table size.']
];
for (const [id,group,title,complexity,desc,cost] of additions) {
 lessons.push({id,group,title,complexity,desc,how:desc+' Step through the highlighted values to follow each update.',cost,type:'bars'});
}
Object.assign(PY, {
merge:`def merge_sort(items):
    if len(items) <= 1:
        return list(items)
    mid = len(items) // 2
    left, right = merge_sort(items[:mid]), merge_sort(items[mid:])
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

print(merge_sort([8, 3, 5, 1, 9, 2]))`,
quick:`def quick_sort(items):
    a = list(items)
    def sort(lo, hi):
        if lo >= hi:
            return
        pivot, p = a[hi], lo
        for j in range(lo, hi):
            if a[j] <= pivot:
                a[p], a[j] = a[j], a[p]
                p += 1
        a[p], a[hi] = a[hi], a[p]
        sort(lo, p - 1)
        sort(p + 1, hi)
    sort(0, len(a) - 1)
    return a

print(quick_sort([8, 3, 5, 1, 9, 2]))`,
heap:`def heap_sort(items):
    a = list(items)
    def sift(root, end):
        while 2 * root + 1 < end:
            child = 2 * root + 1
            if child + 1 < end and a[child] < a[child + 1]:
                child += 1
            if a[root] >= a[child]:
                break
            a[root], a[child] = a[child], a[root]
            root = child
    for root in range(len(a) // 2 - 1, -1, -1):
        sift(root, len(a))
    for end in range(len(a) - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift(0, end)
    return a

print(heap_sort([8, 3, 5, 1, 9, 2]))`,
prefix:`def prefix_sums(items):
    result = []
    total = 0
    for value in items:
        total += value
        result.append(total)
    return result

print(prefix_sums([8, 3, 5, 1, 9, 2]))`,
kadane:`def maximum_subarray(items):
    if not items:
        raise ValueError("Expected at least one number")
    current = best = items[0]
    for value in items[1:]:
        current = max(value, current + value)
        best = max(best, current)
    return best

print(maximum_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))`,
fibonacci:`def fibonacci_table(n):
    if n < 0:
        raise ValueError("n must be nonnegative")
    table = [0] * n
    if n > 1:
        table[1] = 1
    for i in range(2, n):
        table[i] = table[i - 1] + table[i - 2]
    return table

print(fibonacci_table(10))`
});
const originalProduce = produce;
produce = function () {
 if (!additions.some(x=>x[0]===selected.id)) return originalProduce();
 const a=values(), n=a.length, id=selected.id;
 frames=[]; frame(a,'Initial input');
 if(id==='merge') {
  function sort(lo,hi) {
   if(hi-lo<2)return;
   const mid=Math.floor((lo+hi)/2); frame(a,`Split range [${lo}, ${hi-1}] at ${mid}`,[lo,mid]);
   sort(lo,mid);sort(mid,hi);
   const left=a.slice(lo,mid),right=a.slice(mid,hi);let i=0,j=0;
   for(let k=lo;k<hi;k++) {a[k]=j>=right.length||(i<left.length&&left[i]<=right[j])?left[i++]:right[j++];frame(a,`Merge into index ${k}`,[k]);}
  } sort(0,n);
 } else if(id==='quick') {
  function sort(lo,hi){if(lo>=hi)return;const pivot=a[hi];let p=lo;
   for(let j=lo;j<hi;j++){frame(a,`Compare ${a[j]} with pivot ${pivot}`,[j,hi]);if(a[j]<=pivot){[a[p],a[j]]=[a[j],a[p]];frame(a,'Move value into the left partition',[p,j]);p++;}}
   [a[p],a[hi]]=[a[hi],a[p]];frame(a,`Pivot ${pivot} settled at ${p}`,[p]);sort(lo,p-1);sort(p+1,hi);
  }sort(0,n-1);
 } else if(id==='heap') {
  function sift(root,end){while(root*2+1<end){let child=root*2+1;if(child+1<end&&a[child]<a[child+1])child++;frame(a,'Compare parent with its largest child',[root,child]);if(a[root]>=a[child])break;[a[root],a[child]]=[a[child],a[root]];frame(a,'Restore max-heap order',[root,child]);root=child;}}
  for(let root=Math.floor(n/2)-1;root>=0;root--)sift(root,n);
  for(let end=n-1;end>0;end--){[a[0],a[end]]=[a[end],a[0]];frame(a,`Move maximum to index ${end}`,[end]);sift(0,end);}
 } else if(id==='prefix') {
  let total=0;for(let i=0;i<n;i++){total+=a[i];a[i]=total;frame(a,`Prefix [0, ${i}] has sum ${total}`,[i],Array.from({length:i},(_,k)=>k));}
 } else if(id==='kadane') {
  let current=a[0],best=a[0],start=0,bestStart=0,bestEnd=0;
  frame(a,`Start with sum ${best}`,[0]);
  for(let i=1;i<n;i++){if(a[i]>current+a[i]){current=a[i];start=i;}else current+=a[i];if(current>best){best=current;bestStart=start;bestEnd=i;}frame(a,`Ending here: ${current}; best sum: ${best}`,[i],Array.from({length:bestEnd-bestStart+1},(_,k)=>bestStart+k));}
  frame(a,`Maximum sum ${best}, indices ${bestStart}–${bestEnd}`,[],Array.from({length:bestEnd-bestStart+1},(_,k)=>bestStart+k));index=0;render();return;
 } else {a.fill(0);if(n>1)a[1]=1;frame(a,'Base cases: F(0) = 0, F(1) = 1');for(let i=2;i<n;i++){a[i]=a[i-1]+a[i-2];frame(a,`F(${i}) = ${a[i-1]} + ${a[i-2]} = ${a[i]}`,[i-2,i-1,i]);}}
 frame(a,id==='prefix'?'Prefix sums complete':id==='fibonacci'?'Fibonacci table complete':'Sorted!',[],a.map((_,i)=>i));index=0;render();
};
// Rebuild navigation so categories stay together as the catalogue grows.
nav.replaceChildren();
for(const group of [...new Set(lessons.map(l=>l.group))]) {
 const heading=document.createElement('div');heading.className='side-label';heading.textContent=group.toUpperCase();nav.append(heading);
 for(const lesson of lessons.filter(l=>l.group===group)){const b=document.createElement('button');b.textContent=lesson.title;b.dataset.lesson=lesson.id;b.onclick=()=>choose(lesson.id);nav.append(b);}
}
$('topicCount').textContent=lessons.length;
const completed=new Set();
function restoreProgress(){try {const saved=JSON.parse(localStorage.getItem('dsa-completed')||'[]');if(Array.isArray(saved))saved.filter(id=>lessons.some(l=>l.id===id)).forEach(id=>completed.add(id));} catch {}}
restoreProgress();
function showProgress(){ $('completion').textContent=`${completed.has(selected.id)?'✓ Completed':'Mark completed'} · ${completed.size}/${lessons.length}`;document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('completed',completed.has(b.dataset.lesson))); }
$('completion').onclick=()=>{if(completed.has(selected.id))completed.delete(selected.id);else completed.add(selected.id);try{localStorage.setItem('dsa-completed',JSON.stringify([...completed]));}catch{}showProgress();};
const originalChoose=choose;
choose=function(id){$('target').value='';originalChoose(id);$('targetControl').hidden=!['binary','linear'].includes(id);showProgress();};
const originalRender=render;
render=function(){originalRender();$('timeline').max=Math.max(0,frames.length-1);$('timeline').value=index;$('timeline').disabled=!frames.length;};
$('timeline').oninput=()=>{pause();index=Number($('timeline').value);render();};
$('lessonSearch').oninput=()=>{const query=$('lessonSearch').value.toLowerCase();for(const b of nav.querySelectorAll('button'))b.hidden=!b.textContent.toLowerCase().includes(query);for(const h of nav.querySelectorAll('.side-label')){let b=h.nextElementSibling,visible=false;while(b&&!b.classList.contains('side-label')){visible ||= !b.hidden;b=b.nextElementSibling;}h.hidden=!visible;}};
function rebuild(){pause();try{produce();$('input').removeAttribute('aria-invalid');}catch(e){frames=[];index=0;$('viz').replaceChildren();$('status').textContent=e.message;$('counter').textContent='0 / 0';$('timeline').disabled=true;$('prev').disabled=$('next').disabled=true;$('input').setAttribute('aria-invalid','true');}}
$('reset').onclick=rebuild;$('input').onchange=rebuild;$('target').onchange=rebuild;
$('random').onclick=()=>{if($('input').disabled)return;$('input').value=Array.from({length:8},()=>Math.floor(Math.random()*60)-20).join(', ');rebuild();};
choose('bubble');
