Object.assign(QuizChoices,{
 two_sum:[
  ['Look up the complement first so only earlier positions can match the current value.','Store the current index first so a value can pair with itself.','Duplicate values can never form a valid two-sum pair.','Every matching pair must use consecutive indices.'],
  ['Store earlier-value frequencies, add complement frequency before incrementing the current value, and include output cost if enumerating pairs.','A set of values alone counts every duplicate index pair.','Counting all index pairs and returning one unique value pair are the same problem.','Reporting Θ(n²) pairs can always be done in O(n) total time.']
 ],
 three_sum:[
  ['Sorted order proves which fixed-left or fixed-right candidates cannot improve a too-small or too-large sum.','Pointer moves are correct on every unsorted suffix without any further condition.','Any arbitrary pointer move preserves all possible triples.','After fixing one value, the two remaining positions must be adjacent.'],
  ['Skip equal fixed values and repeated pointer values after matches, but retain multiplicities needed within a triple.','Delete every duplicate value before solving.','Repeated equal indices may be reused to fill one triple.','Every distinct index combination must be emitted even when the requested value triple is identical.']
 ],
 product_except:[
  ['Multiply products strictly before and after each index; zeros are handled without division.','Divide the total product by each value, even when that value is zero.','One zero makes every excluded-self answer zero.','The product must include the current value twice to cancel it.'],
  ['Choose exact-safe arithmetic or an appropriate larger representation; multiplication-count bounds do not imply constant bit cost.','Number represents every arbitrarily large integer product exactly.','Modular division always works even when a factor has no inverse.','A correct recurrence cannot produce rounded results in a finite numeric representation.']
 ],
 sum_k:[
  ['Seed the empty-prefix count at one and query before recording the current prefix.','Seed no empty prefix, because ranges may not start at the first element.','Insert the current prefix first so zero-target empty intervals are counted as nonempty ranges.','A set alone preserves all repeated-prefix multiplicities.'],
  ['Negative values break simple window-sum monotonicity; prefix-difference maps still count the intervals.','Shrinking whenever the sum exceeds the target is correct for all mixed-sign input.','For every prefix-map problem, store only the latest index regardless of output.','Negative values prevent any prefix-sum identity from holding.']
 ],
 consecutive:[
  ['Only predecessor-free values start runs, so each distinct value is extended through once.','A nested loop must rescan every suffix and therefore cannot be linear in total.','Every duplicate increases the consecutive run length.','Array order must already be consecutive for a set-based method to work.'],
  ['Merge neighboring run boundary lengths on a new insertion; duplicate inserts do nothing.','Every deletion is handled by the same two-boundary merge operation without extra work.','Internal stale lengths can answer every possible interval query directly.','Adding a value between two runs can never join them.']
 ],
 rain:[
  ['The pointer invariant gives enough opposite-side support to finalize the currently lower-boundary side.','Water at an index depends only on its immediate two neighbors.','The highest single bar alone determines total water volume.','The rain-water result is the largest area from any one pair of walls.'],
  ['Prefix maxima compute per-cell support; a monotonic stack closes basin layers when a right wall arrives.','A popped basin needs no left wall to hold water.','The stack layer width is right−left rather than the number of intervening cells.','Storing complete prefix and suffix maximum arrays uses O(1) extra space.']
 ],
 container:[
  ['Keeping the shorter wall while reducing width cannot beat its current pair, so discard that wall.','Move the taller wall because its height is irrelevant to every future pair.','The maximum area is always formed by the two tallest walls regardless of distance.','Every pair must be examined to prove the maximum.'],
  ['Ordered physical coordinates preserve width monotonicity, but a changed score requires a new elimination proof.','Index distance always equals physical width even on unequally spaced positions.','Any objective involving two endpoints is solved by the same shorter-wall rule.','A two-pointer code shape is sufficient proof for every modified score.']
 ],
 dutch:[
  ['The value swapped from high is unclassified, so inspect it before advancing mid.','The value from high is guaranteed to be 1.','Advance every pointer after every swap regardless of its source region.','Swapping a 2 to high classifies every remaining unknown value.'],
  ['The equal block can be skipped completely, preventing repeated work on duplicate pivot keys.','Three-way partitioning guarantees balanced unequal regions for every pivot.','Duplicate-heavy input is always linear under any two-way partition.','Separating equal keys automatically makes swapping stable.']
 ],
 rotated:[
  ['Identify the sorted half and compare the target with that half’s value range.','Sort the whole array again and return its new index as the original rotated position.','Discard a random half because every rotation has two globally sorted halves.','The middle value’s size alone reveals the target side without endpoint comparisons.'],
  ['Duplicates can hide the rotated side and force one-at-a-time elimination, producing linear worst-case search.','Duplicates preserve the distinct-key logarithmic proof without changes.','Every repeated value means the target is absent.','Shrinking duplicate endpoints always discards half the candidates.']
 ],
 merge_intervals:[
  ['After start sorting, only the last disjoint merged interval can overlap the arriving interval.','An interval must be compared against all older output intervals even when output is sorted and disjoint.','Merging should replace the old end with the new end even when it is smaller.','Intervals can be merged correctly by sorting only their lengths.'],
  ['Define closed, half-open, and adjacency semantics explicitly; equality cases differ between merge and meeting rules.','Touching intervals must have the same overlap meaning in every application.','End+1 adjacency is automatically valid for continuous coordinates.','Endpoint equality can always be ignored because it never changes output.']
 ],
 meeting_rooms:[
  ['Heap size after releasing ended meetings measures simultaneous demand; the peak is necessary and achievable.','The total number of meetings is always the minimum room count.','A meeting ending at a start time still overlaps under the half-open convention.','Release the latest end first because the earliest ending cannot be reused.'],
  ['Process ends before equal-time starts for half-open sweeps, and track room IDs if assignments are requested.','A count-only result already includes a room assignment for each original meeting.','Process starts before equal-time ends to avoid overcounting half-open overlap.','Returning assignments eliminates the need to preserve original meeting identities.']
 ],
 top_k:[
  ['The root is the least desirable retained item, allowing efficient eviction with the specified tie rule.','The root must always be the best item so it can be discarded first.','Frequency counting is unnecessary because input values already encode their counts.','Equal-frequency numeric ordering can never affect which items belong in top k.'],
  ['Frequency buckets can avoid heap work, but deterministic value ties may still require ordering within buckets.','Buckets guarantee sorted numeric tie output regardless of insertion order.','An approximate stream heavy-hitter summary is automatically the exact batch top-k answer.','Bucket storage is independent of both n and the number of distinct values.']
 ],
 quickselect:[
  ['Only one partition contains rank n−k; if it lies in the equal block, selection is finished.','Every partition must be fully sorted before its rank boundaries are known.','All three partitions require recursive selection for a single kth-largest value.','Duplicate occurrences must be removed before interpreting any rank.'],
  ['Randomized pivots give expected linear time, median-of-medians gives worst-case linear time, and a heap suits streams.','A fixed midpoint-value pivot guarantees worst-case O(n).','Randomized expected guarantees and deterministic worst-case guarantees are identical.','A bounded heap needs to rearrange every input element in place.']
 ],
 next_greater:[
  ['Pending indices have not seen a larger value; the first value that pops one is its next greater answer.','Any larger value may overwrite an answer even after a nearer greater value was found.','Equal values answer strictly-greater queries.','Stack entries must be processed quadratically because every pair is needed.'],
  ['Scan up to two rounds modulo n, pushing original indices only in the first round.','Push each index on every round forever until all values have a greater answer.','Every circular maximum must answer itself after wrapping.','Circular next-greater queries require sorting and lose original positions.']
 ],
 window_max:[
  ['A newer at-least-as-large value dominates an older smaller candidate and expires no earlier.','An older smaller value always survives longer than a newly arrived larger one.','Removing dominated candidates can change the maximum of a future window containing both.','Only the numerical value is needed to determine expiration.'],
  ['Deque and fixed-block methods can be linear; heap alternatives need logarithmic updates and stale-entry accounting.','Lazy heap deletion guarantees at most k allocated entries without extra management.','Every fixed-k preprocessing scheme works unchanged when k varies per query.','Heap and deque implementations necessarily have identical storage behavior.']
 ],
 jump:[
  ['Under maximum forward jumps, every index through the frontier is reachable and a gap beyond it is fatal.','Each listed jump must be taken at exactly its full length.','The frontier represents only one reachable index, with all earlier indices forbidden.','Backward jumps and forbidden cells preserve the same proof without changes.'],
  ['Treat each reachable interval as a BFS layer and advance a recorded next frontier to count minimum jumps.','Increment the jump count at every scanned array index.','A frontier that cannot advance still proves the destination will be reached.','A Boolean reachability result automatically contains the minimum-jump route.']
 ],
 gas_station:[
  ['Any later start in a failed segment removes a nonnegative prefix and cannot rescue its negative final balance.','A failed segment proves no start anywhere in the circle works, regardless of total balance.','Resetting the tank must also reset the global total to zero.','The proof holds unchanged for any finite tank-capacity constraint.'],
  ['A nonnegative total guarantees existence under the model, not uniqueness; all-start queries need additional window analysis.','Nonnegative total guarantees exactly one feasible start.','Equal gas and cost at every station yields no feasible starts.','Returning one feasible candidate automatically enumerates every feasible start.']
 ],
 robber:[
  ['The recurrence compares skipping with taking plus the optimum two positions back.','Take every positive reward even when adjacent houses conflict.','Always choose the larger of each adjacent pair independently.','Negative rewards force the answer below zero even when taking no house is allowed.'],
  ['A circle splits into exclude-first/exclude-last cases; a tree needs take/skip states based on children.','The linear recurrence can ignore the first-last conflict in a circle.','Any general graph is solved by the same two rolling scalars.','A singleton circular house must always be excluded twice and yield zero.']
 ],
 partition:[
  ['Descending sum updates prevent using the same input occurrence more than once.','Ascending updates are required to prevent item reuse.','The empty sum must start unreachable.','An odd total can always be split equally by choosing a different subset.'],
  ['Choose bitsets for moderate sum ranges or meet-in-the-middle for small n with huge numeric values.','Sum-indexed DP is polynomial in the bit length of arbitrarily large sums.','Arbitrary-precision bit shifts have constant cost regardless of bitset width.','Meet-in-the-middle always uses constant storage independent of n.']
 ],
 knapsack:[
  ['Descending capacities preserve previous-item states; ascending capacities can reuse the current item.','Ascending and descending capacities always compute the same item-use policy.','A zero-weight item may be added repeatedly until the value stops increasing.','A one-dimensional value array automatically reconstructs the chosen items.'],
  ['Indivisible items break the value-density exchange argument that works for fractional knapsack.','Sorting by value per weight is always optimal for 0/1 knapsack.','Fractional and 0/1 knapsack permit exactly the same choices.','An O(nC) algorithm is polynomial in log C for all numeric capacities.']
 ],
 subsets:[
  ['Increasing chosen indices give each subset one canonical order; record the empty path too.','Restart at index zero after each choice to avoid reordered duplicates.','Subsets treat [1,2] and [2,1] as different outputs by definition.','There are n! subsets of n distinct values.'],
  ['Skip equal choices at the same depth or yield lazily, retaining multiplicities and unavoidable output cost.','Globally deleting duplicates preserves every multiplicity-aware subset.','Lazy generation removes the exponential total number of requested outputs.','Skipping an equal value at every depth still permits all repeated-value subsets.']
 ],
 permutations:[
  ['Used flags match the indices in the path, and both the flag and path entry must be restored after recursion.','Only values matter, so the same input index can fill several positions.','Undo the path but leave used flags permanently set across siblings.','Every partial path is a complete permutation regardless of its length.'],
  ['Use canonical equal-choice ordering or a frequency map to avoid duplicate branches before emitting results.','Generate every duplicate-index ordering and assume a set costs no additional work.','Deleting duplicate values globally preserves all valid arrangements of their multiplicities.','A frequency-map method must output n! distinct arrangements even when all values are equal.']
 ],
 combination:[
  ['Recurse from the same candidate for reuse while nondecreasing indices prevent reordered duplicates.','Advance past a candidate after each choice to allow unlimited reuse.','Restart from zero after each choice to avoid reordered duplicates.','Zero and negative candidates preserve the same decreasing-remainder termination proof.'],
  ['Order, reuse, and multiplicity change the recurrence; sequence counts and one-use combinations need different transitions.','[2,3] and [3,2] are always one answer even when ordered sequences are requested.','A one-copy value 2 can form target 4 by using the unbounded recurrence.','Every counting memo automatically stores all output lists in polynomial space.']
 ],
 queens:[
  ['Diagonal moves preserve row−column or row+column; one queen per row leaves column and diagonal checks.','Different rows and columns alone guarantee queens do not attack.','Each diagonal has the same column number in all rows.','Diagonal identifiers must be recomputed by scanning every complete board each time.'],
  ['Bitmasks accelerate safe-choice checks; symmetry needs explicit reflection/counting rules and does not remove exponential search.','Multiplying by two handles every odd-board symmetry case without exceptions.','JavaScript bitwise integers have unlimited width.','Ignoring reflected solutions still returns every board when all boards are requested.']
 ],
 islands:[
  ['Mark on enqueue to prevent duplicate discovery, and use the specified four-neighbor connectivity.','Mark only after dequeueing to guarantee every cell enters the queue once.','Diagonal contact always connects islands under a four-neighbor rule.','One BFS starting anywhere counts every disconnected island without scanning unseen land.'],
  ['Incrementally add land using union–find, merging distinct neighboring components; deletions need a different strategy.','Every neighbor edge reduces the component count, even if already connected.','A duplicate land insertion must create another island.','Ordinary union–find automatically splits a component after arbitrary land removal.']
 ],
 union_find:[
  ['Find roots first and compare their authoritative sizes; only distinct-root unions reduce component count.','Nonroot size values always remain current for their entire component.','Every edge reduces the count, including self-loops and duplicates.','Path compression alone makes every individual operation worst-case O(1).'],
  ['Rollback commonly avoids compression and logs union changes; arbitrary online deletions are a different connectivity problem.','Ordinary compressed parents can always undo arbitrary edge deletion without history.','Deleting a bridge cannot split a component.','Rollback needs no record of which size or parent entries changed.']
 ],
 fenwick:[
  ['tree[i] covers lowbit(i) positions ending at i; queries remove lowbit and updates add it.','Index zero is the natural starting point for every update because lowbit(0) advances it.','Every tree entry stores only its original single array value.','The repeated-point-addition build is O(n) regardless of n.'],
  ['Prefix subtraction relies on an inverse; replacement updates require a delta, while arbitrary minima do not subtract.','Subtracting two prefix minima always yields a range minimum.','Assigning a new value means adding that new value without subtracting the old one.','Every possible aggregate supports the same sum-specific Fenwick operations unchanged.']
 ]
});
