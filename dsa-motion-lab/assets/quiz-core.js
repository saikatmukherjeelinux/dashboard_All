// Options are authored in correct-first order; every quiz shuffles their display.
globalThis.QuizChoices={
 bubble:[
  ['A pass moves the largest remaining value to its final position; a whole swap-free pass proves order.','The first comparison without a swap proves the whole array is sorted.','Every pass settles the smallest value at the far right.','Early exit is valid only after exactly n passes.'],
  ['Each adjacent inverted swap removes one inversion; strict comparisons preserve equal-key order.','Each swap removes every inversion involving either value.','Few swaps guarantee few comparisons in every implementation.','Swapping equal keys is required for stability.']
 ],
 selection:[
  ['The prefix contains the smallest settled values; selecting a suffix minimum needs at most n−1 real swaps.','Every pass sorts the entire remaining suffix.','Sorted input avoids all suffix comparisons.','Selection sort requires a swap for every comparison.'],
  ['A long swap may reverse equal records; shifting the first minimum into place can preserve stability.','Selection sort is always stable because it selects a minimum.','Stability is obtained by choosing the last equal minimum and swapping it.','A stable version must run in O(n log n) time.']
 ],
 insertion:[
  ['Each shift crosses one inversion, giving O(n+I) work when there are I inversions.','Insertion sort always shifts every prefix element even on sorted input.','Nearly sorted data eliminates the need to inspect the next key.','Its time depends only on the largest numeric value.'],
  ['Binary search reduces comparisons, but opening an array slot can still require quadratic total movement.','Binary search automatically reduces total array work to O(n log n).','Binary insertion needs no shifts because the array is sorted.','Using a linked list makes ordinary indexed binary search O(log n).']
 ],
 merge:[
  ['Each level merges O(n) values across O(log n) levels; taking equal keys from the left preserves stability.','Each level costs O(log n), and taking equal keys from the right preserves stability.','Merge sort is stable regardless of how equal keys are selected.','The merge step compares every element against every other element.'],
  ['When a right value beats the current left value, count every remaining left value as a cross inversion.','Add one inversion for every merge comparison, even equal keys.','Count only inversions lying entirely inside one half.','Increment the inversion count whenever the left value is chosen.']
 ],
 quick:[
  ['p separates values no greater than the pivot from inspected larger values; the final pivot swap settles its rank.','p always points to the smallest element in the whole array.','Partitioning fully sorts both sides before recursion.','The pivot must stay at the last position after partitioning.'],
  ['Use suitable pivot selection, three-way duplicate handling, and smaller-side recursion; introsort adds a worst-case fallback.','Randomizing the pivot alone makes the lesson’s two-way partition linear on all equal values.','Recursing on the larger side first guarantees logarithmic stack usage.','Choosing the final value as pivot guarantees balanced partitions.']
 ],
 heap:[
  ['Most nodes have small height, so bottom-up sift work sums to O(n).','All n nodes must sift through the full heap height.','Building a heap and sorting it both require only O(n) total time.','A max heap is already a fully sorted array.'],
  ['Maintain a max-heap prefix and sorted suffix; extraction is space-efficient but ordinary heapsort is unstable.','Sift the settled suffix back into the heap after each extraction.','A min heap is required to move maxima to the end.','Long-distance swaps preserve the order of all equal-key records.']
 ],
 linear:[
  ['A scan can be preferable for a single query on unsorted data because sorting adds preprocessing and changes positions.','Sorting is always cheaper than one linear scan.','Linear search requires sorted input.','Binary-search positions always equal the original unsorted positions.'],
  ['A sentinel guarantees the scan stops, but mutation and the final original-length check must be handled carefully.','A sentinel changes the worst-case time to O(log n).','A sentinel match is always a real match inside the original array.','Sentinels require no modification or extra slot under any implementation.']
 ],
 binary:[
  ['Search a lower boundary by moving hi on equality, then verify the final position equals the target.','Return immediately at any equality to guarantee the first occurrence.','Move lo right on equality until it passes all duplicates, then return lo as the first occurrence.','Duplicate input prevents every form of logarithmic boundary search.'],
  ['Binary-search a monotone feasibility boundary and include the cost of each feasibility check.','Binary search works on any Boolean predicate even if it changes unpredictably.','An O(n) feasibility check makes the complete optimization O(log R).','A sorted numeric answer range is sufficient even when feasibility is nonmonotone.']
 ],
 stack:[
  ['Store the minimum alongside every pushed value, or correctly count duplicate minima in a second stack.','Store only the last value ever pushed as the minimum.','Remove all equal minima whenever one matching value is popped.','Scan the full stack on every minimum query to achieve O(1) query time.'],
  ['Every index is pushed once and popped at most once, so total stack work is linear.','A nested while loop always makes the algorithm quadratic.','Each index must be popped once for every larger value to its right.','The linear bound depends on all input values being distinct.']
 ],
 queue:[
  ['Transfer input to output only when output is empty; each item moves a bounded number of times.','Transfer all items before every enqueue to obtain worst-case constant latency.','Pop the input stack directly to get FIFO order.','Mix new input into a nonempty output stack without affecting arrival order.'],
  ['Keep decreasing candidate values with increasing indices; expire the front and discard dominated values from the back.','Keep only the newest element because it always has the largest value.','Discard the largest value whenever a smaller value arrives.','Use values alone so equal elements never need expiration indices.']
 ],
 linked:[
  ['Save the original successor before redirecting current.next, then advance previous and current.','Redirect current.next first and recover the lost successor from previous.','Swap only the head and tail values to reverse every link.','An iterative reversal necessarily requires O(n) auxiliary storage.'],
  ['Relative motion forces a meeting in a cycle; resetting one pointer to the head locates the entry at equal speed.','Equal stored values prove the pointers have found a cycle.','The first fast/slow meeting is always the cycle entry.','Floyd’s method needs a hash set of every visited node.']
 ],
 bfs:[
  ['The FIFO queue visits vertices in nondecreasing edge distance; save parents on first discovery.','The most recently discovered vertex must always be processed next.','First discovery is shortest even with arbitrary negative edge costs.','Marking only after dequeuing guarantees each vertex is enqueued once.'],
  ['Initialize all sources at distance zero; for 0–1 weights, relax distances using a deque.','Multi-source BFS requires running a separate complete search for each source.','Ordinary first-discovery BFS is correct for every weighted graph.','A zero-cost improvement should always go behind unit-cost work.']
 ],
 dfs:[
  ['An edge to an active recursion-path vertex proves a directed cycle; an edge to a finished vertex does not.','Any edge to any previously visited vertex proves a directed cycle.','A directed graph has a cycle only when a node points directly to itself.','Cycle detection can ignore every disconnected component after the first.'],
  ['Reverse finish order in a DAG, after checking for cycles.','Reverse discovery order in every directed graph, including cyclic graphs.','Use finish order without reversing it to place prerequisites first.','A partial DFS automatically supplies every disconnected vertex.']
 ],
 bst:[
  ['For two children, replace the key by its inorder successor and remove that successor from the right subtree.','Delete both child subtrees whenever removing a two-child node.','Replace a node by any leaf value regardless of its ordering range.','All BST deletions take O(1) time once the root is known.'],
  ['Maintain subtree sizes and follow rank offsets; balancing is separately required for logarithmic worst-case height.','Store only total tree size at the root to answer every rank query in O(1).','Subtree-size augmentation automatically balances a skewed tree.','The kth-smallest query always follows the right child.']
 ],
 prefix:[
  ['Use prefix[0]=0 and range sum prefix[r+1]−prefix[l] for an inclusive range.','Use prefix[r]−prefix[l] with an exclusive-prefix array for every inclusive range.','A range beginning at zero cannot be represented by prefix subtraction.','Store only the final total to answer arbitrary ranges exactly.'],
  ['Fenwick or segment trees support dynamic operations; difference arrays suit deferred range additions.','A point change affects only one static prefix entry.','A difference array always answers immediate range sums in O(1).','All dynamic range aggregates can be recovered by subtracting two prefix minima.']
 ],
 kadane:[
  ['Choose max(value, previousEnding+value) and initialize from the first value for a nonempty answer.','Initialize the best sum to zero even when an all-negative array requires a nonempty result.','Always extend the previous run, even if restarting is better.','Sort the array first because a subarray may reorder its values.'],
  ['Compare the ordinary maximum with total minus a minimum interval, guarding against an empty complement on all-negative data.','Return total minus minimum even when it excludes the entire all-negative array.','The circular optimum must always wrap around the end.','Computing a circular maximum requires enumerating all n rotations.']
 ],
 fibonacci:[
  ['Tabulation evaluates each recurrence state once instead of recomputing shared subproblems.','Naive recursion already evaluates every Fibonacci index exactly once.','Memoization changes the mathematical Fibonacci sequence.','Two rolling values require storing every earlier table entry.'],
  ['Use doubling identities for O(log n) arithmetic stages, while accounting separately for large-integer costs.','Fast doubling needs one arithmetic stage for each earlier Fibonacci index.','O(log n) arithmetic stages imply O(log n) bit operations for arbitrarily large exact answers.','The doubling formulas require division by F(k), so zeros make them unusable.']
 ],
 dijkstra:[
  ['Nonnegative edges make the minimum tentative distance final; negative edges invalidate that argument.','Dijkstra is correct on arbitrary negative-weight graphs as long as the start distance is zero.','Only strictly positive edges are allowed; zero weights always break it.','Any first-discovered tentative distance is final, even before minimum selection.'],
  ['Push improved entries and skip stale popped distances; stop at a target only when its current minimum is popped.','Discard every improved distance because the vertex was already inserted once.','Scan the entire heap to delete every old entry before any relaxation.','Stop when the target is first mentioned by any edge, regardless of competing costs.']
 ],
 kruskal:[
  ['A cheapest safe cross-component edge can extend an MST; union only distinct roots.','Accept any edge whose endpoints have different numeric labels, even inside the same component.','Reject negative edges because spanning trees require positive weights.','A disconnected graph still always produces a spanning tree with V−1 edges.'],
  ['An equal-weight replacement on the cycle formed by a non-tree edge proves an alternative MST.','Any repeated edge weight proves the MST is nonunique.','Distinct weights imply at least two different MSTs.','An MST minimizes every path length from an arbitrary source.']
 ],
 topological:[
  ['Unprocessed vertices with no zero-indegree choice contain a directed cycle.','An empty queue proves success regardless of the number of processed vertices.','Indegree should increase whenever a prerequisite is removed.','Only vertices listed as adjacency-map keys count toward completion.'],
  ['Exactly one available zero-indegree choice at every successful step makes the order unique.','A heap makes an inherently nonunique ordering mathematically unique.','Two available tasks cannot be swapped in a valid ordering.','Every DAG has exactly one topological ordering.']
 ],
 lis:[
  ['Store the best length ending at each index, because only smaller earlier endpoints can extend the current value.','A single global length reveals whether every later value can extend it.','Sort the values first without changing the subsequence problem.','Equal values always extend a strictly increasing subsequence.'],
  ['Maintain minimal possible tails with binary search; reconstruct using separate endpoint and predecessor information.','The final tails array is always an original-order subsequence.','Replace the first tail strictly greater than the value to compute strictly increasing LIS in all cases.','Binary-searching tails eliminates the need to preserve index order during reconstruction.']
 ],
 coin:[
  ['DP considers every final coin, while choosing the largest coin first can miss a better combination.','The largest affordable denomination is optimal for every positive coin system.','Zero and negative denominations preserve the same decreasing-amount recurrence.','An unreachable amount should be initialized with zero required coins.'],
  ['O(kA) depends on numeric amount A; bounded inventories require item-use-aware transitions.','O(kA) is polynomial in log A because the amount uses only log A bits.','A gcd divisibility test alone guarantees every target is reachable.','Ascending one-item updates prevent reuse in a bounded one-copy problem.']
 ],
 kmp:[
  ['LPS summarizes a matching proper prefix/suffix so the pattern falls back without rewinding text.','LPS stores the index of the last full occurrence in the text.','A mismatch requires moving the text pointer back to the previous match start.','The entire pattern counts as its own proper prefix.'],
  ['After a match, fall back to LPS[m−1]; retain matching state across streaming chunks.','Reset to zero and discard all prefix state to preserve overlapping matches.','Every streaming chunk can be searched independently without missing boundary-spanning matches.','KMP must keep all earlier text characters to remain linear.']
 ]
};
