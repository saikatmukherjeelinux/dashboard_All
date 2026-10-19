/* Each lesson owns an intermediate and an advanced interview discussion.
   Tuple fields: question, explanation, worked example, complexity/trade-off. */
globalThis.InterviewBank = {
 bubble: [
  ['Why does each bubble-sort pass settle an element, and when is early exit correct?',
   'During a left-to-right pass, each comparison moves the larger of its two values right. After processing a prefix, its largest value is at the current right edge. Therefore the largest unsorted value reaches the end of the unsorted range. If an entire pass makes no swaps, every neighboring pair in that range is already ordered. Together with the settled suffix, the whole array is sorted.',
   '[4, 1, 3, 2] → [1, 3, 2, 4] after one pass. The final 4 need not be compared again. A later swap-free pass proves that the remaining prefix is sorted.',
   'With a swapped flag, already sorted input takes Θ(n) time. Average and worst time remain Θ(n²). Reset the flag before every pass; stopping after just one comparison without a swap is incorrect.'],
  ['How do bubble-sort swaps relate to inversions and stability?',
   'An inversion is a pair of positions i < j whose values satisfy a[i] > a[j]. Swapping an adjacent inverted pair removes exactly one inversion: that pair changes order, while its relationship with all other positions stays unchanged. Bubble sort therefore performs exactly as many swaps as the original inversion count. Swapping only when the left key is strictly greater also preserves the original order of equal-key records.',
   'For [3, 1, 2], the inversions are (3, 1) and (3, 2), so exactly two swaps are required. For records [2A, 2B, 1], 2A stays before 2B when equal keys are never swapped.',
   'At most n(n−1)/2 inversions exist. Swap count can be small while comparisons are still quadratic, so few swaps alone do not prove fast execution. The in-place core uses O(1) extra space; copying input for the reference function adds O(n).']
 ],
 selection: [
  ['What invariant makes selection sort correct, and how many swaps does it need?',
   'Before iteration i, the first i positions contain the i smallest values in sorted order. Scan the remaining suffix to find its minimum, then put that value at position i. This extends the invariant by one position. Since only the selected minimum is exchanged with the current position, an implementation that skips self-swaps needs at most n−1 actual swaps.',
   '[4, 2, 3, 1] → choose 1 → [1, 2, 3, 4]. Later scans still inspect the remaining values even though this particular array becomes sorted after the first swap.',
   'Comparisons total (n−1)+(n−2)+…+1 = n(n−1)/2 regardless of initial order. Its advantage is a low number of writes, not a fast best case. The core uses O(1) auxiliary space.'],
  ['Why is ordinary selection sort unstable, and how can you make it stable?',
   'The long-distance swap can move one equal-key record past another. To preserve stability, find the first minimum in the suffix, remove it, shift the intervening records one place right, and insert the minimum at the front. This keeps all other records in their previous relative order. Choosing the first minimum matters when several equal minima exist.',
   '[2A, 2B, 1] becomes [1, 2B, 2A] under the ordinary swap, reversing the equal 2 records. Stable insertion of 1 instead produces [1, 2A, 2B].',
   'Stable selection still takes O(n²) comparisons, and shifting can require O(n²) writes. That sacrifices the low-write advantage of the swap version. If stability and speed matter, merge sort is often a more appropriate choice.']
 ],
 insertion: [
  ['Why is insertion sort effective on nearly sorted data?',
   'The processed prefix is sorted. For each new key, move larger prefix elements right until its insertion position is exposed. Each shift crosses one inversion involving that key. If the array has I inversions, total shifts are I; the scans also perform O(n) terminating comparisons across the iterations. Its work is therefore O(n + I), which is small when few pairs are out of order.',
   '[1, 2, 4, 3, 5] needs only one shift: 4 moves right so 3 can be inserted. A reverse-sorted list has every possible pair inverted and requires quadratic shifting.',
   'Best time is Θ(n), worst time Θ(n²), and the in-place core uses O(1) space. Use a strict greater-than test when shifting to preserve the order of equal keys.'],
  ['Does binary-searching the insertion position make insertion sort O(n log n)?',
   'It reduces the number of key comparisons, but not the number of array moves. Binary search locates a position in O(log i) comparisons within a sorted prefix of size i. Opening that position can still require shifting i values. Summed over the array, those movements remain quadratic. Comparison cost and movement cost must be analyzed separately.',
   'Inserting 1 at the front of [2, 3, 4, 5, 6] takes only a few binary-search comparisons but still moves all five existing values. Repeating front insertions creates Θ(n²) movement.',
   'Binary insertion sort is useful when comparisons are expensive and records are cheap to move. For stability, insert after existing equal keys, equivalent to an upper-bound search. A linked list avoids array shifting but does not provide O(log n) random-access binary search.']
 ],
 merge: [
  ['Why is merge sort O(n log n), and what makes its merge stable?',
   'Each recursion level merges disjoint ranges whose total length is n. A merge advances one of two pointers at each step, so each level does O(n) work. Balanced splitting produces O(log n) levels. During merging, choose the left element when keys are equal: left-half records originally came before right-half records, so that tie rule preserves their original order.',
   'Merge [2A, 4] with [2B, 3]. Taking 2A before 2B yields [2A, 2B, 3, 4]. Taking the right equal key first would reverse the equal records across the split.',
   'Time is Θ(n log n) for this ordinary implementation, with O(n) merge storage plus O(log n) recursion depth. Reusing one auxiliary array avoids repeatedly allocating temporary buffers.'],
  ['How can merge sort count inversions without checking every pair?',
   'Recursively count inversions within both halves, then count cross-half inversions during the merge. If right[j] is smaller than left[i], it is smaller than every remaining element in the sorted left half. Add the number of remaining left elements before taking right[j]. Each cross-half inversion is counted exactly when its right-side element is selected.',
   'For left [2, 4] and right [1, 3], selecting 1 adds two inversions: (2,1) and (4,1). Later selecting 3 before 4 adds one more. Cross-half count is 3.',
   'The extra arithmetic does not change Θ(n log n) time or O(n) auxiliary storage. Equal values are not inversions under the strict greater-than definition, so merge equal keys from the left without incrementing the count.']
 ],
 quick: [
  ['What does the partition pointer mean in this quicksort implementation?',
   'With the last element as pivot, p marks the next available slot in the left partition. Before inspecting j, values before p are no greater than the pivot, while values from p through j−1 are greater. A qualifying a[j] is swapped into p, then p advances. Swapping the pivot into p finally places it between the two partitions, where it is already in its sorted position.',
   'Partition [4, 1, 3, 2] around 2. Move 1 into the left partition, then place 2 after it: [1, 2, 3, 4]. Only the ranges outside the pivot need recursive sorting.',
   'One partition is O(range length). Total time depends on partition balance: O(n log n) for balanced splits and O(n²) for repeated one-sided splits. Ordinary swapping does not preserve stability.'],
  ['How should you handle sorted input, duplicates, and recursion depth in production quicksort?',
   'A fixed last-element pivot gives one-sided splits on sorted data. Randomizing the pivot makes that specific input order unlikely to remain adversarial, yielding expected O(n log n) time. It does not solve all-equal data for this two-way partition: equal elements still go to one side. A three-way partition separates values less than, equal to, and greater than the pivot and skips the equal region.',
   'For [5,5,5,5], the lesson’s partition repeatedly removes only one pivot. Three-way partitioning recognizes one equal block and finishes after a single linear scan.',
   'Recurse into the smaller partition and iterate over the larger one to bound call-stack depth by O(log n). This alone does not fix quadratic running time. Introsort adds a depth limit and switches to heapsort to obtain a worst-case O(n log n) time guarantee.']
 ],
 heap: [
  ['Why is bottom-up heap construction O(n), rather than O(n log n)?',
   'Although a single sift-down can traverse the heap height, most starting nodes are near the bottom and can move only a short distance. Roughly half the nodes are leaves and need no sift; a quarter can move one level, an eighth can move two, and so on. Summing n times the convergent series h/2^(h+1) gives O(n) total construction work.',
   'In a heap with 15 nodes, 8 leaves need no work. Four internal nodes can move one level, two can move two levels, and only the root can move three levels.',
   'After construction, n maximum extractions each cost O(log n), so heapsort as a whole is O(n log n). Inserting elements individually into an initially empty heap is a different construction method with O(n log n) worst-case time.'],
  ['What invariant makes in-place heapsort correct, and what does it sacrifice?',
   'Maintain a max heap in the active prefix and a sorted suffix outside it. The root is the largest remaining value. Swapping it with the last active position grows the sorted suffix by one; shrinking the active range and sifting the replacement root down restores heap order. The suffix must never participate in later sift-down operations.',
   'A max heap [9, 5, 7, 1] first moves 9 to the last slot. Only indices 0 through 2 are then heapified; the settled 9 stays untouched.',
   'The iterative array core uses O(1) extra space and guarantees O(n log n) worst-case time. Long-distance swaps make it unstable, and its memory-access pattern can be less cache-friendly than quicksort. A heap is only partially ordered; traversing its array does not produce sorted output.']
 ],
 linear: [
  ['When is linear search preferable to sorting and binary searching?',
   'For one query on an unsorted array, a direct scan costs O(n) and needs no preprocessing. Sorting first usually costs O(n log n), can change positions, and may destroy meaningful order. For many queries on fixed data, the one-time sort cost can be amortized, or a hash-based index may be appropriate. The workload, not the individual query complexity alone, determines the choice.',
   'Finding one value among 20 unsorted records is a natural scan. Searching the same million records thousands of times may justify an index. If you sort, the resulting index is a sorted position, not necessarily the record’s original position.',
   'Linear search returns the first match when scanned left to right. Worst time is O(n), best time O(1), and auxiliary space O(1). A not-found query must inspect every element unless extra information is available.'],
  ['How can a sentinel remove a boundary check, and what are the trade-offs?',
   'Place the target itself in an extra slot after the logical array, then scan until equality succeeds. The sentinel guarantees termination without checking the end at every iteration. After stopping, test whether the found position is inside the original array. A variant temporarily overwrites the final element, but must save and restore it and separately handle a real final-position match.',
   'Searching [4,7,2] for 9 with an appended sentinel gives [4,7,2,9]. The scan stops at index 3; because the original length was 3, the correct result remains not found.',
   'Asymptotic time stays O(n). Mutation can be inappropriate for shared, immutable, or concurrently accessed data. In high-level languages the optimization may provide little benefit; prefer clear bounds checks unless profiling justifies a sentinel.']
 ],
 binary: [
  ['How do you find the first occurrence when binary-search input contains duplicates?',
   'Search for a boundary instead of returning immediately on equality. Maintain a half-open range [lo, hi). If a[mid] is smaller than the target, set lo = mid + 1; otherwise set hi = mid. This keeps the first value no smaller than the target inside the candidate range. When lo equals hi, verify that the position is in bounds and actually equals the target.',
   'For [1,2,2,2,5] and target 2, equality moves the upper boundary left rather than stopping. The lower-bound result is index 1. An upper-bound search would return index 4, so there are 4−1 = 3 copies.',
   'Both boundaries take O(log n) time and O(1) iterative space. Sorted input is mandatory. Keep the interval convention consistent: mixing inclusive and half-open update rules is a common source of infinite loops and missed endpoints.'],
  ['When can binary search solve an optimization problem instead of searching an array?',
   'If a feasibility predicate changes monotonically from false to true, search for its first true argument. Establish a lower and upper bound, evaluate the midpoint, and discard the half that cannot contain the boundary. The key proof is monotonicity: increasing the candidate answer must never turn a feasible solution infeasible for this orientation of the search.',
   'To minimize a shipping capacity for a fixed number of days, ask whether a proposed capacity can ship all items in order. If capacity C works, every larger capacity works. Search between the largest item and the total weight.',
   'With an O(n) feasibility check and integer answer range of width R, time is O(n log R). Avoid midpoint overflow in fixed-width languages using lo + (hi−lo)/2. A fast search is still wrong if the predicate is not monotone.']
 ],
 stack: [
  ['How would you build a stack that also returns the minimum in O(1) time?',
   'Store a pair for every pushed item: its value and the minimum of the stack up to that position. The new minimum is min(new value, previous minimum). Popping removes both pieces of state together, so the top pair always contains the correct minimum. Alternatively maintain a second minimum stack, but duplicates must be recorded or counted so popping one equal minimum does not erase another.',
   'Push 4,2,2,5 and store minima 4,2,2,2. After popping 5 and then one 2, the remaining top minimum is still 2. Popping the second 2 restores minimum 4.',
   'Push, pop, peek, and minimum are O(1), with O(n) storage. An array-backed push may be amortized O(1) because resizing occasionally copies elements. Define empty-stack behavior explicitly rather than returning a misleading numeric sentinel.'],
  ['Why is a monotonic stack linear even though it has a nested while loop?',
   'For next-greater elements, keep indices whose answers have not been found and whose values are non-increasing. When a larger value arrives, pop every smaller pending value and record the current value as its answer. Each index is pushed once and popped at most once. Charging a pop to that index bounds all iterations of the inner loop by n over the entire run.',
   'For [2,1,3], push 2 and 1. On 3, pop 1 and then 2, assigning 3 to both. The final 3 has no greater element to its right.',
   'Total time is O(n), space O(n). Use strict or non-strict comparisons according to whether the question asks for a strictly greater or greater-or-equal answer. Store indices when distances or original positions are required.']
 ],
 queue: [
  ['How can two stacks implement a FIFO queue?',
   'Push new arrivals onto an input stack. Dequeue from an output stack. If the output stack is empty, move every item from input to output; this reverses their order so the oldest arrival is now on top. Never move new input items while the output stack still contains older values, or their relative service order would be broken.',
   'Enqueue 1,2,3 into input. Transfer to output, whose pop order becomes 1,2,3. If 4 arrives after removing 1, it waits in input until the remaining 2 and 3 have been served.',
   'A single dequeue may take O(n), but over many operations each item is pushed, transferred, and popped only once: amortized O(1) per operation and O(n) storage. This is an amortized guarantee, not constant worst-case latency.'],
  ['How does a deque compute a sliding-window maximum in O(n) time?',
   'Keep candidate indices in increasing index order and decreasing value order. Before adding the current index, remove smaller or equal values from the back because the newer, at-least-as-large value dominates them for all future windows. Remove expired indices from the front. The front then holds the largest value in the current window.',
   'For [1,3,2,5] with window size 3, 3 dominates 1, giving first maximum 3. When 5 arrives, it dominates both 2 and 3, giving second maximum 5. Expiration is checked using indices, not values.',
   'Each index enters and leaves the deque at most once, yielding O(n) time and O(k) storage for window size k. A queue alone preserves arrival order but cannot discard dominated candidates from the back.']
 ],
 linked: [
  ['How do you reverse a singly linked list without losing nodes?',
   'Maintain previous and current pointers. Before changing current.next, save its original next pointer. Redirect current.next to previous, then advance previous to current and current to the saved node. The reversed prefix ends at previous, while current still starts the untouched suffix. When current becomes None, previous is the new head.',
   'For A→B→C→None, save B before redirecting A to None. Next save C and redirect B to A. Finally redirect C to B, producing C→B→A→None.',
   'Time is O(n), auxiliary space O(1). A recursive solution uses O(n) call-stack space. Updating current.next before saving the successor loses access to the rest of the original list.'],
  ['Why does Floyd’s slow/fast pointer method detect a cycle and locate its entry?',
   'Move slow one edge and fast two edges at a time. Inside a cycle, their relative position changes by one edge per iteration, so they eventually meet. Let the noncyclic prefix length be μ and cycle length λ. At a meeting after t slow steps, t is a multiple of λ, so advancing a pointer from the head and another from the meeting point at equal speed brings both to the entry after μ steps.',
   'For A→B→C→D→B, the entry is B. After detecting a meeting, reset one pointer to A, leave the other at the meeting, and move both one edge at a time until they meet at B.',
   'Detection and entry recovery take O(n) time with O(1) extra space. Compare node identity, not stored values: equal-valued nodes do not imply a cycle. Check fast and fast.next before advancing in an acyclic list.']
 ],
 bfs: [
  ['Why does BFS find shortest paths in an unweighted graph?',
   'The FIFO queue processes vertices in nondecreasing distance from the start. When visiting a vertex at distance d, undiscovered neighbors receive distance d+1 and enter behind all already-discovered vertices at distance d. Therefore a neighbor’s first discovery cannot be beaten by a later, shorter route. Store its predecessor on first discovery to reconstruct an actual path.',
   'If A connects to B and C, and B connects to D, first discoveries give distances A:0, B:1, C:1, D:2. Following parent[D]=B and parent[B]=A recovers A→B→D.',
   'With adjacency lists, time is O(V+E), space O(V). Mark a vertex when enqueuing it, not when dequeuing, to avoid duplicate queue entries. The shortest-path proof assumes equal edge costs.'],
  ['What changes are needed for multi-source BFS or edges weighted 0 and 1?',
   'For multi-source BFS, enqueue all starting vertices at distance 0 before processing anything. This computes the nearest-source distance without running separate searches. For weights restricted to 0 and 1, use a deque: improving a distance through a zero-weight edge goes to the front; an improvement through a unit edge goes to the back. Unlike ordinary BFS, relax distances rather than permanently accepting every first discovery.',
   'In a grid with several starting hospitals, one multi-source search gives every cell’s nearest hospital distance. With edges A→B of weight 1 and A→C→B both of weight 0, ordinary first-discovery BFS would incorrectly keep B at cost 1.',
   'Both methods can run in O(V+E) time under their stated conditions. Arbitrary nonnegative weights need a method such as Dijkstra. A boolean visited rule copied unchanged from unweighted BFS is not a correct replacement for 0–1 relaxation.']
 ],
 dfs: [
  ['How can DFS detect a cycle in a directed graph?',
   'Track three states: unseen, currently on the recursion path, and completely finished. An edge to a currently active vertex is a back edge to an ancestor, which closes a directed cycle. An edge to a finished vertex is not sufficient evidence of a cycle. Set a vertex active on entry and finished only after every outgoing edge has been explored.',
   'For A→B→C→A, C reaches active A and proves a cycle. For A→B and A→C→B, B may already be finished when C reaches it; that shared destination is not a cycle.',
   'Time is O(V+E), space O(V), including the recursion path. Start DFS from every unseen vertex to cover disconnected components. The undirected case needs different handling, including ignoring the edge back to the DFS parent.'],
  ['Why does reversing DFS finish order produce a topological ordering only for a DAG?',
   'In a directed acyclic graph, for every edge u→v, v must finish before u. If v is unseen, DFS finishes its subtree before returning to u; if v is already finished, the condition also holds. An active v would imply a cycle, which the DAG assumption excludes. Recording each vertex on exit and reversing that list places u before v for every edge.',
   'For A→B→C, exit order is C,B,A, so reversing gives A,B,C. With A→B→A, simply reversing an exit list cannot satisfy both dependencies; cycle detection must reject the graph.',
   'Time is O(V+E), with O(V) state. For very deep graphs, an explicit stack with enter/exit state avoids call-stack overflow. Recording discovery order instead of finish order does not generally produce a valid schedule.']
 ],
 bst: [
  ['How do you delete a BST node with zero, one, or two children?',
   'A leaf can be removed directly. A node with one child is replaced by that child. With two children, replace its key with its in-order successor, the minimum key in the right subtree, then delete the successor from that subtree. The successor has no left child, so the second deletion is one of the simpler cases. Reconnect the parent link or update the root as needed.',
   'Deleting root 8 from a tree whose right subtree contains 10 with left child 9 can replace 8 with 9. Then remove the original node 9 from beneath 10; all left values remain smaller and all right values remain larger.',
   'Search and deletion take O(h), where h is height: O(log n) in a balanced tree but O(n) in a chain. Define duplicate-key policy explicitly; this lesson ignores repeated values.'],
  ['How can an augmented BST answer kth-smallest and rank queries efficiently?',
   'Store each node’s subtree size. For a node with left-subtree size L, its key is the (L+1)th smallest in that subtree. Recurse left when k≤L, return the node when k=L+1, or recurse right with k reduced by L+1. For rank, accumulate left-subtree sizes plus the current node whenever moving right. Updates must maintain sizes along the changed path and through rotations.',
   'At root 8 with three nodes in its left subtree, k=4 returns 8 immediately. To find k=6, move right and ask for the second-smallest key in that subtree.',
   'Both queries cost O(h). Augmentation does not itself balance a tree: use a balanced BST for O(log n) worst-case height. If duplicates are stored as counts, sizes and rank formulas must count occurrences consistently.']
 ],
 prefix: [
  ['How do exclusive prefix sums avoid special cases in range queries?',
   'Create a prefix array of length n+1 with prefix[0]=0 and prefix[i+1]=prefix[i]+a[i]. Then the inclusive range sum from l through r is prefix[r+1]−prefix[l]. The two totals share every element before l, so subtraction cancels them. This convention naturally handles ranges beginning at 0 and empty half-open ranges.',
   'For [2,4,1,3], exclusive prefixes are [0,2,6,7,10]. Sum at indices 1 through 3 is prefix[4]−prefix[1]=10−2=8. The lesson animation displays inclusive totals instead, so adjust the indices when comparing formulas.',
   'Build time and storage are O(n); each query is O(1). In fixed-width languages, the accumulated total may require a wider integer type even when each input value is small.'],
  ['Why do static prefix sums struggle with updates, and which structures solve that?',
   'Changing a[i] by delta changes every prefix total that includes it, which can require O(n) updates. A Fenwick tree stores carefully chosen partial sums so both point updates and prefix queries touch only O(log n) nodes. A segment tree similarly supports O(log n) updates and queries and can store operations beyond sums. For many offline range additions, a difference array can instead record just the two boundaries.',
   'Adding 5 to indices 1 through 3 can be recorded as diff[1]+=5 and diff[4]−=5, with a sentinel slot when needed. A final prefix scan materializes all additions in O(n).',
   'Static prefix sums are simplest for immutable data. Fenwick trees fit dynamic sums; segment trees handle richer aggregates. A difference array makes updates cheap only when you can defer reconstruction rather than needing immediate range answers.']
 ],
 kadane: [
  ['What is Kadane’s recurrence, and why must all-negative arrays be initialized carefully?',
   'Let ending[i] be the best sum of a nonempty subarray ending at i. Its previous part either helps, in which case extend ending[i−1], or hurts, in which case start at a[i]. Thus ending[i]=max(a[i], ending[i−1]+a[i]). Track the largest ending value seen. Initialize both running and best sums from the first element, because initializing best to zero silently permits an empty answer.',
   'For [-4,-2,-7], the ending sums are -4,-2,-7, so the answer is -2, not 0. For [3,-5,4,2], restarting at 4 leads to the best sum 6.',
   'Time is O(n), auxiliary space O(1). Reject empty input or define a separate empty-subarray policy. If returning indices, record a new start whenever restarting and save its boundaries when the global best improves.'],
  ['How do you find the maximum-sum circular subarray without accepting an empty answer?',
   'A circular optimum is either an ordinary non-wrapping subarray or a wrapping subarray. A wrapping choice includes everything except one continuous minimum-sum interval, so its sum is total−minimumSubarray. Compute ordinary maximum and minimum Kadane values and take the better candidate. If every value is negative, the minimum interval may be the whole array, making the complement empty; return the ordinary maximum instead.',
   'For [5,-3,5], ordinary maximum is 7, total is 7, and minimum interval is [-3]. The wrapping answer is 7−(-3)=10, using the final 5 and initial 5. For [-3,-2], return -2 rather than zero.',
   'This extension remains O(n) time and O(1) extra space for sums. Tracking circular boundaries requires mapping the excluded minimum interval’s complement back into two end pieces.']
 ],
 fibonacci: [
  ['Why does tabulation eliminate the repeated work of naive Fibonacci recursion?',
   'Naive recursion computes F(n−1) and F(n−2), then repeatedly recomputes the same smaller values across those branches. Tabulation computes each F(i) once in increasing order and reuses the two saved predecessors. Memoization achieves the same reuse while retaining a recursive interface. The mathematical recurrence is unchanged; the number of times each subproblem is evaluated changes.',
   'Computing F(5) recursively requests F(3) from both the F(4) branch and the F(3) branch. A table fills 0,1,1,2,3,5 once. In this lesson, six table entries represent F(0) through F(5).',
   'There are O(n) arithmetic additions. A full table uses O(n) entries, while two rolling values use O(1) entries. Recursion without caching takes exponential calls. Large exact Fibonacci numbers require growing integer storage.'],
  ['How does fast doubling compute Fibonacci numbers in logarithmically many stages?',
   'Compute the pair (F(k), F(k+1)) recursively for k=floor(n/2). With a=F(k) and b=F(k+1), use F(2k)=a(2b−a) and F(2k+1)=a²+b². For even n return those two values; for odd n return F(2k+1) and F(2k)+F(2k+1). Each stage halves n, avoiding a loop over all earlier indices.',
   'Starting from (F(2),F(3))=(1,2), doubling gives F(4)=1×(4−1)=3 and F(5)=1+4=5. The same formulas work modulo an integer when only modular answers are required.',
   'There are O(log n) stages and O(log n) recursion depth. This counts arithmetic operations, not bit operations: exact F(n) has Θ(n) bits, so large-number multiplication is not constant time. Normalize negative intermediate residues when using modular arithmetic in languages that need it.']
 ],
 dijkstra: [
  ['Why can Dijkstra finalize the smallest tentative distance, and why do negative edges break the proof?',
   'Suppose the unfinished vertex u has the smallest tentative distance. Any alternative path reaching u through another unfinished vertex must already cost at least that other vertex’s tentative frontier distance. Nonnegative remaining edges cannot lower it below u’s value. Thus u cannot later improve. A negative edge invalidates the argument by allowing a more expensive frontier path to become cheaper afterward.',
   'With A→B cost 2, A→C cost 5, and C→B cost -10, finalizing B at 2 is premature: A→C→B costs -5. The lesson’s nonnegative example can safely finalize each selected vertex.',
   'The lesson uses a vertex scan, giving O(V²+E) time and O(V) working storage. Unreachable vertices remain at infinity. Zero-weight edges are allowed; negative edges need an appropriate algorithm such as Bellman–Ford.'],
  ['How do you implement Dijkstra with a priority queue without a decrease-key operation?',
   'Push a new (distance, vertex) entry whenever relaxation improves that vertex. Old entries remain in the heap. When popping, compare the stored distance with the current best distance and skip stale entries. This lazy strategy avoids searching the heap to update an existing item. For a single target, early exit is valid when its current minimum entry is popped, not when it is first discovered.',
   'If B is first pushed with distance 9 and later improved to 4, the heap contains both entries. Process (4,B), then ignore (9,B) when it eventually reaches the top.',
   'With a binary heap, a common bound is O((V+E) log V) for simple graphs; lazy heaps may hold O(E) entries. Parent pointers recover paths, but equal-cost routes require an explicit tie policy. The nonnegative-weight requirement still applies.']
 ],
 kruskal: [
  ['Why is adding the cheapest edge between two different components safe?',
   'The current forest partitions vertices into components. An edge joining different components cannot create a cycle. Consider the cut separating one component from the rest: a minimum-weight edge crossing that cut is safe, meaning some minimum spanning tree contains it together with the choices already made. Processing edges in increasing order ensures the next accepted edge meets this condition.',
   'For edges B–C:1, A–C:2, and A–B:4, accept the first two. A–B now joins vertices in the same component and would create a cycle, so skip it. The tree’s total is 3.',
   'Sorting costs O(E log E). Union by size/rank with path compression makes disjoint-set operations nearly constant amortized time. A disconnected graph yields a minimum spanning forest, not a tree covering all vertices with V−1 edges.'],
  ['When is a minimum spanning tree unique, and how can you find an alternative tree?',
   'Distinct edge weights guarantee uniqueness, but repeated weights do not automatically imply multiple MSTs. To test a non-tree edge e, add it to an MST: it creates one cycle. Removing a maximum-weight edge on that cycle restores a spanning tree. If its weight equals e’s weight, the replacement gives a different tree of the same cost; a smaller maximum would imply a higher-cost alternative.',
   'A triangle with all edges of weight 1 has three possible MSTs. A path whose only two edges both weigh 1 still has a unique spanning tree, showing that tied weights alone do not prove non-uniqueness.',
   'Naively checking each path costs O(V) per non-tree edge. Tree preprocessing with binary lifting can answer maximum-on-path queries in O(log V). An MST minimizes total edge weight, not every source-to-target path length.']
 ],
 topological: [
  ['Why does Kahn’s algorithm detect a directed cycle when it cannot process every vertex?',
   'A zero-indegree vertex has no unfinished prerequisites and can be scheduled safely. Removing its outgoing edges updates the remaining dependency counts. If vertices remain but none has indegree zero, each remaining vertex has an incoming edge from another remaining vertex. Repeatedly following incoming edges in this finite set eventually revisits a vertex, proving a directed cycle.',
   'A→B→C processes as A,B,C. Adding C→B leaves B and C waiting on each other after A is removed, so only one of three vertices is processed and the graph must be rejected.',
   'Time is O(V+E), space O(V) beyond the adjacency list. Include vertices appearing only as neighbors. A partial output is not a valid complete ordering; compare the processed count with the full vertex count.'],
  ['How can you determine whether a topological ordering is unique?',
   'Run Kahn’s algorithm while observing the set of available zero-indegree vertices. If more than one is available at any step, either may legally be chosen next, so at least two valid orderings exist. If exactly one is available at every step and all vertices are processed, the ordering is forced and unique. A priority queue can choose the lexicographically smallest ordering but does not make the underlying order unique.',
   'For A→C and B→C, both A and B initially have indegree zero, so A,B,C and B,A,C are valid. Adding A→B forces A,B,C and removes that choice.',
   'With a normal queue, uniqueness checking adds O(1) work per iteration to O(V+E). Choosing the smallest available label with a heap generally adds O(V log V). A cyclic graph has no topological ordering at all, so report failure separately.']
 ],
 lis: [
  ['Why must the quadratic LIS table store the best length ending at each index?',
   'To append a[i], you need a valid earlier endpoint j with a[j] < a[i]. The recurrence is dp[i]=1+max(dp[j]) over those endpoints, or 1 if none qualify. A single global best length does not reveal whether its final value is small enough to extend. Parent pointers remember which endpoint produced each improvement and allow reconstruction afterward.',
   'For [1,5,2,3], the length-2 sequence [1,5] cannot extend with 3, but [1,2] can. Keeping an ending-state value for index 2 makes the length-3 answer [1,2,3] discoverable.',
   'Time is O(n²) and storage O(n). Strictly increasing means equal values cannot extend one another. A subsequence preserves original index order but may skip positions; sorting the input changes the problem.'],
  ['How does the tails method improve LIS to O(n log n), and why is tails not necessarily the answer?',
   'Maintain tails[length−1] as the smallest possible ending value for any increasing subsequence of that length seen so far. For each value, replace the first tail no smaller than it, or append if it exceeds all tails. Smaller endings leave at least as many future extension options, so replacing an ending cannot reduce the achievable best length. Binary search locates the replacement slot.',
   'For [2,3,1], tails evolves [2], [2,3], [1,3]. The final [1,3] is not an input-order subsequence because 1 occurred after 3. Its length 2 is correct, but reconstruction needs endpoint indices and predecessors.',
   'Time is O(n log n), storage O(n). Use lower bound for strictly increasing LIS and upper bound for a nondecreasing subsequence. Without separate predecessor tracking, reporting the tails array as the reconstructed answer can be wrong.']
 ],
 coin: [
  ['Why can greedy coin choice fail while dynamic programming succeeds?',
   'Taking the largest affordable coin optimizes only the immediate choice. There may be no exchange argument showing that this choice belongs to an optimum. Dynamic programming considers every possible final coin: best[x]=1+min(best[x−coin]) over reachable smaller amounts. Since an optimal solution has some final coin, this recurrence examines a decomposition of every possible optimum.',
   'With coins [1,3,4] and target 6, greedy chooses 4+1+1, needing three coins. DP can take a final 3 after best[3]=1, producing 3+3 with two coins.',
   'For k denominations and target A, time is O(kA), space O(A). Mark unreachable amounts as infinity and initialize best[0]=0. Positive integer coins make dependencies go toward smaller amounts; zero or negative coins invalidate this formulation.'],
  ['Why is O(kA) coin-change DP called pseudo-polynomial, and how do bounded coins change it?',
   'The numeric amount A may need only O(log A) bits to represent, but the DP allocates an entry for every value through A. Its cost is polynomial in the amount’s value rather than the input’s bit length, so it is pseudo-polynomial. Unlimited and bounded inventories also have different dependency rules: unbounded updates may reuse the same denomination, whereas a one-copy coin must not be used twice in one item iteration.',
   'For one-copy coin 3 and target 6, an ascending in-place amount loop could reuse the newly updated best[3] and incorrectly form 3+3. Iterating amounts downward for that item avoids the reuse. Unlimited coins intentionally allow it.',
   'The gcd of denominations must divide A for a solution to exist, but this is only a necessary condition. With coins [4,6], target 2 passes divisibility by 2 yet is unreachable. Inventory bounds need additional state or carefully designed transitions.']
 ],
 kmp: [
  ['What does the LPS table mean, and why is a fallback not the same as moving the text pointer backward?',
   'LPS[j] is the length of the longest proper prefix of pattern[0…j] that is also its suffix. After matching j pattern characters and then failing, the already-matched text ends with a suffix equal to that prefix. Set the pattern position to LPS[j−1] and compare the same text character again. Earlier text positions need not be reread because their useful alignment is summarized by the prefix length.',
   'For pattern ABAB, LPS is [0,0,1,2]. If ABAB has matched and the next comparison fails, the suffix AB can stand in for the beginning AB at a shifted alignment.',
   'Prefix-table construction costs O(m) time and space. Searching costs O(n): pattern fallbacks consume earlier forward progress rather than generating an unrestricted nested scan. The prefix must be proper, excluding the whole pattern itself.'],
  ['How can KMP find overlapping matches or work on streaming text?',
   'After a full match, emit its start and set the pattern position to LPS[m−1] instead of zero. That preserves a matching suffix that may begin an overlapping occurrence. For streaming, retain the pattern, LPS table, current pattern position, and the total number of text code points consumed across chunks. Process each new chunk without restarting the state.',
   'Searching aaa in aaaaa finds starts 0,1,2 when a full match falls back to prefix length 2. Restarting at zero after each match would miss the overlapping starts. Splitting a matching occurrence across input chunks should not change the result.',
   'Time is O(n+m+z) including z reported matches, with O(m) matching state. In a UTF-16 stream, preserve an incomplete surrogate pair at a chunk boundary before converting to code points. The lesson returns only the first match, so collecting all matches requires this explicit extension.']
 ]
};
