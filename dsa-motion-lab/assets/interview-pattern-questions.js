Object.assign(InterviewBank, {
 two_sum:[
  ['Why must complement lookup happen before storing the current index?',
   'The two positions must be different. Looking up target−value before inserting the current value guarantees every stored index belongs to an earlier position. If insertion happens first, a value equal to half the target could match itself. Keeping the first index for each value is a deterministic tie policy, although many problems accept any valid pair.',
   'With nums [3] and target 6, the answer is empty. With [3,3], the second 3 finds the earlier index 0 and returns [0,1]. The same position is never reused.',
   'Expected time is O(n), with O(n) map storage. A sorted two-pointer solution can use less lookup storage but needs original-index bookkeeping if the requested output is input indices.'],
  ['How would you count all index pairs instead of returning the first two-sum pair?',
   'Store frequencies rather than one index. For each value, add the number of earlier occurrences of its complement, then increase its own frequency. Each pair is counted exactly when its later endpoint arrives. This naturally handles duplicates. Enumerating actual pairs instead requires storing their indices and incurs output-proportional work.',
   'For [1,1,1,1] and target 2, successive additions are 0,1,2,3, giving 6 index pairs. Returning one unique value pair [1,1] would answer a different question.',
   'Counting uses expected O(n) time and O(u) map entries for u distinct values. Reporting all pairs may require Θ(n²) output; no lookup optimization can eliminate the cost of writing that output.']
 ],
 three_sum:[
  ['How does sorting make the three-sum pointer moves correct?',
   'Fix a first value and search the sorted suffix with left and right pointers. If the total is too small, pairing the same left value with any smaller right value cannot help, so discard that left position. If the total is too large, pairing the same right value with any larger left value cannot help, so discard that right position. These monotonicity arguments justify each elimination.',
   'For fixed −1 and remaining [0,1,2], pairing 0 and 2 totals 1, so moving the right pointer to 1 reaches total 0. Arbitrarily moving either pointer would lack this ordering proof.',
   'Sorting costs O(n log n), followed by O(n²) pointer work. The lesson sorts a copy and returns value triples, so the original order is preserved but original triple indices are not returned.'],
  ['Where must duplicate skipping occur to return each three-sum value triple once?',
   'Skip a first value equal to the previous fixed value. After recording a triple, move both pointers and skip repeated values at their new boundaries. Otherwise equal input occurrences can generate the same value triple through different index combinations. Do not remove all duplicate values before solving: some valid triples require the same value twice or three times.',
   '[-1,-1,2] needs both copies of −1 to produce its one triple. [0,0,0,0] has four index triples but only one distinct value triple [0,0,0], which this lesson reports once.',
   'Duplicate skipping preserves O(n²) time. Counting index triples requires multiplicity calculations instead of simply suppressing duplicate values; the output specification determines which behavior is correct.']
 ],
 product_except:[
  ['Why does the prefix/suffix method work even when the input contains zeros?',
   'Every excluded-self product splits into elements strictly before the index and strictly after it. Multiplying those two independent products includes every required factor exactly once. No inverse or division is used, so zero is handled by ordinary multiplication. One zero makes only its own excluded-self product potentially nonzero; two zeros make all excluded-self products zero.',
   'For [2,0,4], the zero position sees prefix 2 and suffix 4, giving 8, while the other positions include zero. For [2,0,4,0], every answer contains at least one zero.',
   'Two passes take O(n) time with O(1) running state beyond the output array. Empty products are 1, so a singleton input produces [1] under the lesson’s convention.'],
  ['What changes when products can exceed the numeric representation’s exact range?',
   'Algorithmic correctness assumes multiplication preserves the required values. JavaScript Number cannot represent all large integers exactly, so a mathematically correct recurrence can still return rounded answers. Use checked arithmetic, BigInt, or a specified modulus depending on the task. Modular division is not a general replacement because factors may lack inverses, especially when zeros or composite moduli are involved.',
   'Twenty factors of magnitude 100 can exceed the exact-integer range long before the algorithm finishes. The UI rejects unsafe intermediate products; Python’s integers can keep exact values with increasing storage.',
   'The usual O(n) count measures arithmetic operations. Large-integer multiplication has a cost depending on operand bit length. If the task asks for exact integers, state that representation choice rather than silently accepting floating-point rounding.']
 ],
 sum_k:[
  ['Why is the initial prefix frequency {0:1} necessary for subarray-sum counting?',
   'A prefix total represents the sum before a boundary. A nonempty interval ending at the current position has target sum when an earlier boundary total equals currentPrefix−target. The empty prefix at boundary 0 must be present so intervals beginning at the first element can be counted. Query before inserting the current prefix to avoid counting an empty interval when target is zero.',
   'For [3] and target 3, currentPrefix is 3 and the required earlier prefix is 0. Its initial frequency contributes the single correct interval. For [0] and target 0, inserting first would overcount.',
   'Expected time and storage are O(n). Frequencies, not just a set, are required because the same prefix sum can occur at several boundaries and each produces a different interval.'],
  ['Why does a standard shrinking sliding window fail when negative values are allowed?',
   'A simple sum window relies on monotonicity: adding a value cannot decrease the sum and removing a value cannot increase it. Negative values break both assumptions, so discarding a window because its sum is currently too large may discard a future valid interval. Prefix-difference counting does not rely on monotone sums and therefore works for mixed signs.',
   'For [4,-1] and target 3, shrinking immediately when the first sum is 4 would discard the starting 4. Keeping it until −1 arrives finds the valid whole-array interval of sum 3.',
   'For longest target-sum length, store earliest prefix positions instead of counts. For counting intervals, retain all frequencies. Similar-looking prefix-map problems require different stored information according to the requested result.']
 ],
 consecutive:[
  ['Why is the nested run-extension loop linear in total expected work?',
   'Only values without a predecessor begin a run. Every distinct value belongs to exactly one such run and is visited during that run’s extension. Values inside a run are skipped as starts. Thus long runs are not repeatedly rescanned, despite the nested while loop. Hash-set operations give expected constant-time membership checks.',
   'For [1,2,3,4,100], only 1 and 100 start runs. Starting again at 2,3,4 would repeat work, but checking whether the predecessor exists prevents those scans.',
   'Expected time is O(n) and storage O(u) for u distinct values. Duplicates do not increase run length. Sorting is an O(n log n) alternative when hashing is unavailable or its guarantees are unsuitable.'],
  ['How would you maintain longest consecutive runs as new values arrive?',
   'A boundary-length map can merge neighboring intervals on insertion. If x is new, read the lengths of the intervals ending at x−1 and starting at x+1, then form a new interval of left+1+right. Update the new interval’s two endpoints and mark x present. Internal stale lengths need not answer arbitrary queries; the algorithm relies on reading only valid neighboring boundary information.',
   'Insert 1,3,2. The first two values form separate length-1 intervals. Inserting 2 joins them into [1,3] of length 3 by reading the left length at 1 and right length at 3.',
   'Expected insertion work is O(1) with hashing, excluding occasional map costs. Duplicate insertion must be ignored. Supporting deletions is harder because deleting an interior value can split a run and invalidates the simple boundary-only update strategy.']
 ],
 rain:[
  ['Why can the lower-boundary side be finalized without knowing every opposite-side height?',
   'Water at an index depends on the smaller of the highest supporting walls on both sides. When processing the side selected by the two-pointer invariant, the opposite boundary already guarantees sufficient support for that side’s established maximum. The limiting height can therefore be determined from the processed side, and the pointer may move inward without revisiting the finalized cell.',
   'For [3,0,2,0,4], the right wall of 4 supports the left maximum of 3 throughout the interior. Water contributions are 0,3,1,3,0, totaling 7 units.',
   'The core uses O(n) time and O(1) state. Negative heights are outside the model. This problem sums water over unit-width bars, unlike the container problem that chooses just two boundaries.'],
  ['How do prefix maxima and a monotonic stack solve the same water problem differently?',
   'Prefix/suffix maxima precompute the supporting height on each side, making each cell’s water formula direct but requiring O(n) arrays. A decreasing stack instead waits until a right wall arrives, pops a basin bottom, and computes the newly enclosed rectangular layer from its left and right walls. Each index is pushed and popped at most once.',
   'In [3,0,2], the arrival of 2 closes a basin over the middle zero: bounded height is min(3,2)−0=2, with width 1. A later taller wall can contribute another layer rather than double-count the same water.',
   'All three methods can run in O(n) time; their storage and explanation styles differ. In the stack method, stop if popping leaves no left wall, and use distance minus one for the number of cells between walls.']
 ],
 container:[
  ['Why is moving the shorter container boundary a safe elimination?',
   'With the shorter boundary fixed, moving the other boundary inward reduces width while the limiting height cannot exceed that fixed shorter height. No such pair can improve the current area. Therefore the shorter boundary can be discarded while retaining at least one possibility for an optimum. Moving the taller side without this argument can throw away a useful partner.',
   'If heights at the ends are 3 and 8 with width 6, the area is 18. Keeping height 3 and shrinking width can never exceed 18, regardless of how tall the replacement right wall is.',
   'Each pointer advances at most n times, giving O(n) time and O(1) core space. Equal boundary heights permit discarding either side because both have the same domination argument.'],
  ['How does the proof change if positions have unequal spacing or the score is not width times minimum height?',
   'With strictly increasing physical coordinates, moving inward still reduces geometric width, so the same shorter-wall dominance proof remains valid using coordinate differences. If the score changes, however, that monotonicity may disappear. Reusing two pointers because the code looks similar is not sufficient; identify which discarded candidates are guaranteed not to improve the score.',
   'For coordinates [0,2,10], the outer width is 10, not an index difference of 2. Computing area with array positions would return the wrong value even though the pointer strategy itself may still be valid.',
   'State assumptions: ordered coordinates, nonnegative heights, and the stated minimum-height area model. A different objective involving sums, costs, or obstacles may require another algorithm rather than a modified formula alone.']
 ],
 dutch:[
  ['Why must mid stay in place after swapping a 2 with high?',
   'The element arriving from high belonged to the unknown region. It may be 0,1,or 2 and has not yet been classified, so advancing mid would skip necessary work. By contrast, swapping a 0 into low brings back a value from the established middle region, making the usual low and mid advance safe. The four-region invariant determines these updates.',
   'For [1,2,0], after seeing the middle 2, swap it with the final 0 to get [1,0,2]. Keeping mid in place lets that incoming 0 move to the front. Advancing immediately would leave the array unsorted.',
   'The unknown region shrinks on every step, giving O(n) time and O(1) core space. The swapping version is not stable, so records with the same category may change relative order.'],
  ['Why is three-way partitioning valuable when quicksort or quickselect encounters many duplicate keys?',
   'A two-way partition can repeatedly leave nearly all equal values on one side, causing little progress. Three-way partitioning creates a contiguous equal region and excludes all of it from further work. Quicksort recurses only on the less and greater regions. Quickselect can stop immediately if the desired rank lies inside the equal region.',
   'For a million identical values, a three-way partition identifies one equal block in a single scan. A naive two-way scheme may still recurse through one less element at each stage and perform quadratic work.',
   'Duplicate handling does not by itself guarantee balanced unequal partitions. Randomized pivots improve expected behavior; a deterministic worst-case selection guarantee needs an additional pivot strategy. Equality must use the same key comparison as ordering.']
 ],
 rotated:[
  ['How do you decide which half of a rotated array can be searched by value range?',
   'With distinct keys, at most one rotation break exists. Comparing the left endpoint with the middle shows whether the left half is sorted. If it is, check whether the target lies between those endpoint values; otherwise discard it. If the left half is not sorted, the right half is sorted and can be tested similarly. Equality with the middle is handled before either elimination.',
   'In [4,5,6,7,0,1,2], middle 7 has a sorted left half [4,5,6,7]. Target 0 lies outside it, so the remaining search is [0,1,2], where index 4 can be found.',
   'The search is O(log n), with O(1) state. The lesson validates that the array is a legal distinct rotation in O(n) before animating, so total UI processing includes that separate scan.'],
  ['Why can allowing duplicate keys degrade rotated-array search to linear time?',
   'Equal endpoint and midpoint values can hide which half contains the rotation. When those comparisons give no information, safely shrinking an endpoint may remove only one candidate. Repeating that situation can take linear time. A distinct-key proof cannot simply be reused for duplicates without handling this ambiguity explicitly.',
   'In arrays filled with 1 except for one 0, comparisons against 1 may not reveal which side contains 0. A placement of the exceptional value can force a duplicate-aware search to discard candidates one at a time.',
   'Duplicate-aware variants remain useful but have O(n) worst-case search time. This lesson deliberately rejects duplicate keys to preserve its stated logarithmic search guarantee and simpler pointer invariant.']
 ],
 merge_intervals:[
  ['Why is checking only the last merged interval sufficient after sorting?',
   'Sorted starts ensure every earlier merged interval begins no later than the current interval. The merged output is disjoint and ordered. If the current interval overlaps any existing merged interval, it must overlap the last one, because all earlier ones end before that last interval begins. Extending the last end or appending a new interval preserves this invariant.',
   'After merging [1,3] and [2,6] into [1,6], the next interval [8,10] cannot overlap an older output interval without first overlapping [1,6]. Its start 8 exceeds 6, so append it.',
   'Sorting dominates at O(n log n); the merge scan is O(n). The demo copies interval pairs. Use max of ends when merging a nested interval, rather than replacing the end with a possibly smaller one.'],
  ['How do endpoint conventions change merging and overlap decisions?',
   'Closed intervals include both endpoints, so [1,3] and [3,5] overlap at 3 and can merge. Half-open intervals exclude the end, so [1,3) and [3,5) do not overlap in time, although an application may still coalesce their union as adjacent ranges. Distinguish overlap detection from a policy that intentionally merges adjacency.',
   'The merge lesson combines touching endpoint ranges into [1,5]. The meeting-room lesson can reuse a room at time 3 when one meeting ends there and another starts there. These outputs are consistent with their different specifications.',
   'Write the equality case explicitly in comparisons and tests. Integer intervals may also have adjacency rules such as end+1=start, but adding one can overflow in fixed-width representations and does not apply to continuous coordinates.']
 ],
 meeting_rooms:[
  ['Why does a min heap of active meeting end times give the minimum required room count?',
   'Process starts in chronological order. Every meeting still in the heap overlaps the arriving meeting under half-open semantics, so all need distinct rooms at that instant. Remove ended meetings, add the arriving end, and track the maximum heap size. That maximum is both a lower bound from simultaneous demand and achievable by reusing rooms that have become free.',
   'For [0,30), [5,10), [15,20), the heap size reaches 2. Before time 15, the end at 10 is removed, so the third meeting reuses its room while [0,30) remains active.',
   'Time is O(n log n), space O(n). Remove all ends ≤ the new start for an active-meeting interpretation. Empty or reversed meetings are rejected by this teaching input contract.'],
  ['How can a sweep line find room demand, and how are actual room assignments recovered?',
   'Sort start and end events, processing an end before a start at the same time for half-open meetings. The maximum running count is the answer. To return room assignments rather than just a count, keep end-time entries paired with room identifiers and reuse freed identifiers. The required output determines what additional state must be retained.',
   'Meetings [1,3) and [3,4) need one room, so at time 3 the end event must be applied before the start. Reversing that tie order incorrectly observes a momentary demand of 2.',
   'Both sorting approaches take O(n log n). A count-only algorithm does not automatically return a valid schedule; preserve original meeting indices and room IDs if that is part of the interview follow-up.']
 ],
 top_k:[
  ['Why should a bounded top-k heap expose its worst retained candidate at the root?',
   'After adding a new candidate, the only element that needs eviction is the least desirable among the retained candidates. A min heap keyed by frequency makes that eviction efficient. If equal counts prefer smaller values, larger values must be considered worse for the heap tie rule. Counting frequencies first reduces n raw elements to u distinct candidates.',
   'With frequencies 1:3, 2:2, 3:1 and k=2, inserting the third candidate makes it the worst, so it is removed. The final values are [1,2] after applying the requested output ordering.',
   'Counting takes expected O(n); heap processing takes O(u log(k+1)), and sorting the final k values adds O(k log k). The map uses O(u) space and the bounded heap O(k).'],
  ['When is bucket frequency selection preferable, and what does deterministic tie ordering cost?',
   'Frequencies range from 1 through n, so place each distinct value into a bucket indexed by its count and scan buckets from high to low. This can avoid heap logarithms when the frequency range is practical. However, if the output must sort equal-frequency values numerically, those buckets need an ordering step; simply scanning unsorted bucket contents does not satisfy the tie policy.',
   'If values 8,2,5 all occur twice and k=2, a frequency-only result may return any two. This lesson requires [2,5], so the tie rule affects selection as well as final presentation.',
   'Buckets use O(n+u) storage. Streaming approximate heavy-hitter algorithms answer a different problem from exact batch top-k; they have error or candidate-verification requirements that should not be hidden behind the same name.']
 ],
 quickselect:[
  ['Why does quickselect recurse into only one partition after partitioning?',
   'A correct partition establishes which sorted ranks belong to the less-than region, the equal region, and the greater-than region. The desired rank n−k can belong to only one. Values in the other regions need not be internally sorted because their exact order cannot change that rank’s value. A three-way partition can finish immediately when the target lies among equal pivot values.',
   'For the second largest of [3,2,1,5,6,4], the target ascending index is 4. After a useful partition, only the region containing index 4 matters; fully sorting the smaller half adds unnecessary work.',
   'Balanced partitions lead to O(n) total scanning, but this lesson’s deterministic midpoint-value pivot can still have O(n²) worst-case time. Iteration avoids recursion space; the replay implementation works on a copied array.'],
  ['How do randomized quickselect, median-of-medians, and a bounded heap compare?',
   'Randomized pivots give expected linear selection time by making consistently bad rank splits unlikely. Median-of-medians chooses a pivot with a provable rank-quality bound and yields deterministic O(n) worst-case selection, at a larger constant cost. A size-k heap takes O(n log k) time but is convenient for streamed data and does not need to rearrange the entire input.',
   'A fixed positional pivot can repeatedly select an extreme value on a crafted input. Randomization addresses expected behavior, whereas median-of-medians provides a worst-case guarantee rather than just a different deterministic heuristic.',
   'Clarify whether duplicates count as separate rank positions, whether mutation is allowed, and whether the data is a stream. Those requirements can matter more than the asymptotic advantage of one selection method.']
 ],
 next_greater:[
  ['What do unresolved stack indices represent in next-greater search?',
   'Each pending index has not yet seen a strictly greater value to its right. Their values are non-increasing down the arrival order. When the current value is greater than the top, it is the first qualifying right-side value for that index, because all intervening values failed to pop it. Pop and assign repeatedly, then keep the current index for a future answer.',
   'For [2,1,2,4,3], the second 2 answers the pending 1 but not the earlier equal 2. The later 4 answers both unresolved 2s, producing [4,2,4,-1,-1].',
   'Every index is pushed once and popped at most once, so total time is O(n). Store indices rather than just values when duplicates exist or distances and expiration matter.'],
  ['How does the monotonic-stack idea extend to circular next-greater queries?',
   'Scan the indices twice modulo n, allowing values near the beginning to answer indices near the end. Push each original index only during the first pass, and use both passes to resolve pending entries. Strict comparison prevents a value from answering itself through equality after wrapping. Unresolved entries still have no qualifying value in a complete circle.',
   'For [1,2,1], the final 1 can wrap around to find 2, so the circular answers are [2,-1,2]. The linear version would leave that final position unanswered.',
   'Time stays O(n), with O(n) stack space. A sentinel value such as −1 may also be a legitimate greater value for negative inputs, so an index result or nullable result is clearer if absence must be distinguishable.']
 ],
 window_max:[
  ['Why can a newer value permanently eliminate a smaller deque candidate?',
   'The newer value is at least as large and expires no earlier than the older smaller value. For every future window that contains the older index, the newer index will also be present until that older candidate expires. Therefore the older value can never become a necessary maximum. This dominance argument justifies removing it from the back instead of retaining every window element.',
   'With incoming 5 after pending values 3,−1,−3, the 5 dominates all of them for future windows in which they could still participate. The deque can discard them and keep 5 as the front maximum.',
   'Each index enters and leaves at most once, giving O(n) work and O(k) active candidates. This JavaScript trace keeps an array with a moving head, so allocated backing storage can exceed the active deque size.'],
  ['How do heap and block-decomposition solutions compare with the monotonic deque?',
   'A heap can report the largest candidate while lazily removing expired top entries, but stale non-top entries may accumulate unless explicitly managed. A block method precomputes prefix and suffix maxima within k-sized blocks, combining at most two summaries for each window. The deque supports online arrival with minimal active state, while block preprocessing is simple for a fixed batch.',
   'For a window crossing a block boundary, combine the suffix maximum from its start block with the prefix maximum from its end block. Windows aligned to one block still use the same maximum-combination principle.',
   'The deque and block methods can run in O(n). Heap variants usually cost logarithmic updates and require careful storage accounting. If window size changes dynamically, the fixed-k proofs and preprocessing may no longer apply unchanged.']
 ],
 jump:[
  ['What does the reachable frontier prove about every index before it?',
   'Under the maximum-jump interpretation, reaching an index permits landing at any nearer forward position within its allowance. Inductively, all positions from the start through the maintained frontier are reachable. Scanning a position inside that range can extend it; a position beyond the frontier is impossible to visit. There is no need to record every path that reaches the same position.',
   'For [2,3,1,1,4], index 0 reaches through 2, then index 1 extends the frontier through 4. In [3,2,1,0,4], no processed position extends beyond 3, so index 4 is unreachable.',
   'Time is O(n), state O(1). The rule means at most the listed number of steps, not exactly that many. Allowing backward jumps or forbidden landing cells changes the reachability model and may require a graph search.'],
  ['How can reachable layers compute the minimum number of jumps?',
   'Treat all indices reachable with the current number of jumps as a layer. Scan that layer while recording the farthest next frontier. When the scan reaches the current layer end, increment the jump count and replace the layer end with the next frontier. This is a compressed breadth-first traversal because each reachable interval can be summarized by its rightmost endpoint.',
   'For [2,3,1,1,4], the first jump can land at indices 1 or 2. Their combined next frontier reaches 4, so two layers, and therefore two jumps, suffice.',
   'The extension is O(n) time and O(1) state for the numeric count. Detect a frontier that fails to advance before the destination; otherwise an unreachable input can produce a misleading count. Reconstructing actual landings needs additional bookkeeping.']
 ],
 gas_station:[
  ['Why can every start inside a failed gas-station segment be discarded?',
   'From the current candidate, every proper prefix before the failure had nonnegative balance. Starting later within that segment removes a nonnegative prefix from the same negative full-segment balance, so it cannot make the failure station reachable with a nonnegative tank. The next possible candidate is therefore just after the failure. A separate total-balance check determines global feasibility.',
   'If a candidate accumulates balances 2,1,−1, then each earlier prefix before the final station was nonnegative. Starting at the second or third station cannot improve the balance at that failure relative to removing those positive prefixes.',
   'One pass takes O(n) time and O(1) state. The proof assumes unlimited tank capacity and an initially empty tank at the chosen start; capacity restrictions require different reasoning.'],
  ['Does nonnegative total balance prove a unique starting station exists?',
   'It proves at least one feasible start under the standard unlimited-capacity model, but not uniqueness. The restart algorithm returns one feasible candidate, not a count or all starts. To find all feasible starts, use prefix sums over the doubled circular sequence and test whether the minimum prefix in each n-edge window stays above that start’s baseline, with a sliding minimum structure.',
   'When every station has gas equal to its outgoing cost, every station is a valid start. The total is zero, yet there are n solutions rather than a unique answer.',
   'Returning one start is O(n) with constant state. Enumerating all starts can also be done in O(n) with extra deque/prefix storage, but it is a different output requirement. State whether multiple solutions are accepted before applying a uniqueness assumption.']
 ],
 robber:[
  ['Why are only two earlier house-robber states needed?',
   'The best prefix reward either skips the current house, keeping the previous prefix optimum, or takes it, combining its reward with the optimum two positions earlier. No older state is referenced directly by this recurrence, so two rolling variables are enough for the numeric answer. Allowing selection of no houses initializes both earlier optima to zero and handles negative rewards naturally.',
   'For [2,7,9,3,1], the prefix optima are 2,7,11,11,12. At the final house, take 1 with the earlier optimum 11 from the first three houses, giving 12.',
   'Time is O(n), auxiliary numeric state O(1). Reconstructing which houses were selected needs stored decisions or an additional reconstruction strategy; the two scalar values alone do not retain that history.'],
  ['How does the recurrence change when houses form a circle or a tree?',
   'In a circle, the first and last houses conflict, so solve two linear cases: exclude the last, or exclude the first, then take the better result. Handle a singleton separately. In a tree, compute take and skip values for each node: taking a node forces skipping its children, while skipping it allows each child’s better option. The conflict graph determines the state dependencies.',
   'For circular [2,3,2], the two 2 houses cannot both be taken, so the answer is 3 rather than the linear answer 4. A branching tree needs child-based states rather than adjacent array positions.',
   'The circle remains O(n) time with constant rolling state for each pass. Tree DP is O(V) time plus traversal storage. A general graph version is not solved merely by reusing the two-state path recurrence.']
 ],
 partition:[
  ['Why must equal-partition sums be updated downward for each value?',
   'Every input occurrence may be assigned to only one side once. A descending target loop reads smaller-sum states from before the current item was used. An ascending loop could immediately reuse a state it just created, turning a 0/1 problem into an unlimited-copy problem. The sum-zero state starts true because choosing no values is always possible.',
   'With one value 3 and target 6, an ascending loop could set reachable[3] and then reachable[6] from that new state, falsely using the same 3 twice. Descending updates prevent that reuse.',
   'Time is O(nS), space O(S), where S is half the total. This is pseudo-polynomial in numeric sum, not polynomial in its bit length. An odd total is rejected before allocating the DP table.'],
  ['When are bitsets or meet-in-the-middle better than a sum-indexed boolean table?',
   'For moderate total sums, a bitset can represent reachable sums and update them with bits OR (bits shifted by value), processing many states per machine word. When there are few items but enormous values, split the items into two halves, enumerate subset sums for each half, and search for complementary half-target sums. This avoids allocating memory proportional to the numeric total.',
   'About 40 items with very large values may make a sum-sized array impossible, while roughly 2^20 subset sums per half can still be considered. For a small sum range, the boolean DP is often simpler.',
   'Bitset cost depends on the number of machine words, and arbitrary-precision shifts are not constant time. Meet-in-the-middle requires exponential item-count storage, so choose based on both n and numeric magnitude rather than one complexity label.']
 ],
 knapsack:[
  ['Why is descending capacity the key distinction between 0/1 and unbounded knapsack?',
   'In 0/1 knapsack, each item may contribute at most once. Descending capacity updates ensure the smaller-capacity state still belongs to the previous set of items. Ascending capacity allows that same item’s newly improved state to be reused, implementing unlimited copies instead. Zero-weight items need careful reasoning: each capacity must still be updated once for that item, not repeatedly until stable.',
   'A single weight-2, value-3 item with capacity 4 should give value 3 in 0/1 knapsack. Ascending updates would use its improvement at capacity 2 again and incorrectly return 6.',
   'The one-dimensional recurrence uses O(nC) time and O(C) space for capacity C. The numeric DP value does not itself retain the chosen item set; reconstruction needs additional information.'],
  ['Why does greedy value-per-weight sorting solve fractional knapsack but not this problem?',
   'Fractional knapsack permits taking part of an item, so an exchange argument favors the highest remaining value density. In 0/1 knapsack, taking a whole high-density item can leave unusable capacity and exclude a better combination of lower-density items. Indivisibility breaks that greedy proof. Dynamic programming evaluates feasible combinations rather than committing to density order.',
   'With weights [10,20,30], values [60,100,120], and capacity 50, density greedy chooses the first two for 160. Choosing the last two gives 220, which is the better 0/1 solution.',
   'O(nC) is pseudo-polynomial. For huge capacities, consider value-indexed DP, meet-in-the-middle, or an approximation approach when its error guarantee is permitted. A fractional upper bound can assist search but is not an exact 0/1 answer.']
 ],
 subsets:[
  ['Why does increasing the next start index generate each subset exactly once?',
   'A subset can be represented uniquely by its chosen indices in increasing order. After choosing index i, recursing from i+1 preserves that canonical order and prevents returning to earlier indices. Recording the current path at every call includes all subset sizes, including the empty subset. Undoing the last element restores the correct path for sibling branches.',
   'For [1,2], the search records [], then [1], then [1,2], then [2]. It never emits [2,1], because that is the same subset in a different order and indices cannot move backward.',
   'There are 2^n subsets. Copying each result costs Θ(n2^n) total output work in aggregate, with O(n) recursion/path state beyond output. The lesson requires distinct values to avoid a separate duplicate-output policy.'],
  ['How would duplicate input values or a lazy-output requirement change subset generation?',
   'For unique value subsets with duplicates, sort the input and skip an equal value only when it repeats at the same recursion depth. Equal values at deeper depths may still be necessary to represent different multiplicities. A generator can yield one path copy at a time instead of storing all results, reducing retained output memory while preserving the unavoidable total enumeration work.',
   'For [1,2,2], skipping the second 2 at one depth prevents duplicate [2] results, but a deeper choice must still allow [2,2]. Globally deleting duplicate values would lose that valid multiplicity.',
   'Lazy generation uses O(n) active search state but consumers that collect every result still pay exponential storage. Bitmask enumeration is another option; its integer width and copying costs must be accounted for.']
 ],
 permutations:[
  ['What invariant do the used flags enforce during permutation search?',
   'Each path position chooses one input index that has not appeared earlier in that path. The used flags exactly describe those chosen indices. A complete path therefore contains every occurrence once. After returning from a branch, pop the path value and clear the same flag so sibling choices start from identical state. Forgetting either restoration can omit answers or reuse a value.',
   'For [1,2,3], selecting 1 then 2 leaves only index 2, value 3, for the final position. Backtracking restores 3 and 2 before exploring the branch beginning [1,3].',
   'There are n! results for distinct values, and writing them costs Θ(n×n!). Active flags, path, and recursion use O(n) space, excluding output. Empty input has one empty permutation by the recursive convention.'],
  ['How can duplicate values be handled without storing every emitted permutation in a global set?',
   'Sort values and prevent choosing a later equal occurrence at a depth while the preceding equal occurrence is still unused. This enforces a canonical use order for indistinguishable copies. Alternatively, recurse over a frequency map, selecting a value only while its remaining count is positive. Both approaches avoid exploring duplicate arrangements rather than deduplicating after factorial work.',
   'For [1,1,2], the unique results are [1,1,2], [1,2,1], and [2,1,1]. Treating the two 1 indices as visibly different would emit each of these multiple times.',
   'The number of unique results is n! divided by the factorials of multiplicities. A frequency-map generator retains O(u+n) state for u distinct values, while total time still includes copying every emitted result.']
 ],
 combination:[
  ['Why does combination-sum recursion reuse the same candidate index instead of the next one?',
   'The problem allows unlimited copies of a candidate, so after choosing index i the recursive call starts at i again. Keeping indices nondecreasing prevents different orderings of the same values from being reported as different combinations. Sorting makes it safe to stop the loop when a candidate exceeds the remaining positive target. Deduplicating candidate values avoids identical branches.',
   'For candidates [2,3] and target 7, choosing 2 may recurse at 2 again, producing [2,2,3]. Starting at i+1 would forbid the repeated 2; restarting at index 0 would also generate reordered duplicates.',
   'Positive values ensure every chosen step reduces the remainder and bounds recursion depth. Zero or negative values break that termination argument and are rejected. Returning all combinations has output-sensitive exponential worst-case cost.'],
  ['How do you change combination sum into counting ordered sequences or one-use combinations?',
   'Ordered sequences distinguish [2,3] from [3,2], so the state and iteration order must allow any candidate after every partial choice. A sum-based count DP can count those sequences without materializing them. For one-use combinations, advance to i+1 after selecting an occurrence, and skip equal values at the same depth when duplicate input occurrences are allowed. These are different problems despite similar inputs.',
   'With values [2,3] and target 5, unlimited unordered combinations return one answer [2,3], while ordered sequence counting returns 2. With a single one-use value 2 and target 4, no answer exists.',
   'Be explicit about reuse, order, and multiplicity before choosing a loop direction or recurrence. Memoization for a counting problem can reuse numeric states; memoizing full output lists may still consume enormous memory.']
 ],
 queens:[
  ['Why do row−column and row+column identify the two queen diagonals?',
   'Moving along one diagonal changes row and column together, preserving their difference. Moving along the other changes them in opposite directions, preserving their sum. Because the search places exactly one queen per row, only columns and these two diagonal sets need checking for conflicts with earlier rows. Each safe placement records all three identifiers and removes them when backtracking.',
   'Queens at (0,1) and (2,3) share row−column = −1 and attack each other. Queens at (0,3) and (2,1) share row+column = 3 and also conflict despite occupying different rows and columns.',
   'Constraint lookups are expected O(1), but the search remains exponential. One queen per row reduces the raw board search considerably without making N-Queens polynomial. The displayed board uses O(n²) space.'],
  ['How can bitmasks and symmetry reduce N-Queens search without losing solutions?',
   'Bitmasks encode occupied columns and shifted diagonal attacks, allowing all currently available columns to be computed with bit operations. Iterating set bits explores safe choices efficiently. Symmetry can restrict the first queen to half the columns and reflect resulting boards, but middle-column cases on odd boards need separate handling. Counting representatives and returning every reflected board are different output goals.',
   'On an even-width board, reflecting a solution whose first queen is in the left half produces a corresponding right-half solution. If the caller wants all boards, the reflected board must be emitted rather than merely multiplying a count.',
   'Mask width must fit the chosen integer representation; JavaScript bitwise operators use 32-bit integers. Symmetry reduces work but does not change the exponential nature of enumeration, and rotations/reflections require a documented equivalence policy.']
 ],
 islands:[
  ['Why must a land cell be marked when enqueued rather than when dequeued?',
   'Different neighboring cells may discover the same land before it reaches the queue front. Marking immediately makes discovery unique and prevents duplicate queue entries. A full grid scan starts one BFS only for still-unseen land, so each start corresponds to a distinct connected component. The chosen neighborhood determines the meaning of connectivity.',
   'For a 2×2 block of ones, two processed cells may both reach the bottom-right cell. Discovery-time marking ensures it enters the queue only once. Diagonal ones in [[1,0],[0,1]] remain separate under the four-neighbor rule.',
   'Each cell and each constant-size neighbor list is processed O(1) times, giving O(rows×columns) time. The lesson copies and labels the grid, preserving the original input at O(rows×columns) storage cost.'],
  ['How would you support land additions over time rather than recomputing every island?',
   'Maintain a disjoint-set structure over active land cells. Adding a new land cell increases the component count by one, then union it with each active neighbor and decrease the count only when two distinct components merge. Ignore a duplicate addition. This replaces repeated whole-grid flood fills with local connectivity updates, provided land is only added.',
   'Adding the middle cell between two existing one-cell islands first creates a third component, then successful unions with its two neighbors reduce the count to one. Re-unioning already connected neighbors must not decrease it again.',
   'Updates are nearly constant amortized work per neighboring union with O(rows×columns) storage. Removing land can split a component, which ordinary union–find cannot undo directly; deletions need a different dynamic-connectivity strategy.']
 ],
 union_find:[
  ['Why should union compare roots and use root sizes rather than endpoint sizes?',
   'A component is represented by its root. Endpoints may already be nonroot nodes with stale size values, so find both roots before deciding whether a merge is needed. Attach the smaller root tree under the larger root and update only the surviving root’s size. If the roots are equal, the edge adds no connectivity and the component count must remain unchanged.',
   'After joining 0–1 and 1–2, an edge 0–2 connects vertices in the same component. Decrementing the count again would invent a component reduction. Size values on former roots are no longer authoritative.',
   'Union by size and path compression give inverse-Ackermann amortized operation cost over a sequence, not literal O(1) worst-case per call. Parent and size arrays need O(n) storage.'],
  ['Why are rollback union–find and online deletions not solved by ordinary path compression?',
   'Path compression rewrites many parent links during find, making it expensive to reverse a history of operations unless every rewrite is logged. Rollback variants commonly use union by size without compression and record the small set of changes made by each successful union. Offline dynamic-connectivity algorithms can then apply edges over time intervals and roll back when leaving a time segment.',
   'Removing the bridge edge between two groups may split one component into two. The ordinary parent forest does not retain enough edge-history information to identify that split just by undoing the most recent find.',
   'Rollback changes the performance trade-off: operations often become logarithmic rather than inverse-Ackermann, while restoring a saved state is controlled. Arbitrary online edge deletion is a substantially different requirement from incremental connectivity.']
 ],
 fenwick:[
  ['What interval does a one-based Fenwick entry cover, and why does lowbit work?',
   'tree[i] stores the sum of the lowbit(i) positions ending at i, where lowbit(i)=i & −i. A prefix query repeatedly removes the lowest set bit, visiting disjoint blocks that cover exactly the requested prefix. A point addition climbs to larger covering blocks by adding lowbit. Index 0 is excluded because its lowbit is zero and would prevent progress.',
   'Index 6 has binary form 110, lowbit 2, and covers one-based positions 5–6. A prefix through 6 reads tree[6], then tree[4], covering 5–6 and 1–4 without overlap.',
   'Each update or query touches O(log n) entries and the tree uses O(n) storage. This demo builds by repeated additions, so its construction is O(n log n), although a linear build is also possible.'],
  ['Why do range-sum queries require subtraction, and which aggregates do not transfer directly?',
   'An inclusive range sum is prefix(r+1)−prefix(l) in the public zero-based indexing. This works because sums have an inverse operation that cancels the unwanted prefix. Minimum does not have an analogous subtraction: knowing two prefix minima does not reveal the minimum in their difference interval. Updates that replace values also need a delta from the old value rather than blindly adding the new value.',
   'With [2,3,3,4,5], query [1,4] is prefix(5)−prefix(1)=17−2=15. If index 1 is assigned 10 rather than incremented by 10, the tree update must add 10−3=7.',
   'Fenwick trees are especially convenient for additive groups. Some restricted min/max variants exist but have different update/query constraints. For general dynamic range aggregates, a segment tree may fit the required algebra more naturally.']
 ]
});
