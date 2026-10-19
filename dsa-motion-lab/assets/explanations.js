// Plain-language guides for every interactive lesson.
const guides = {
 bubble: {
  idea:'Imagine moving the heaviest book to the end of a shelf by swapping neighboring books.',
  steps:['Look at two numbers next to each other.','If the left number is bigger, swap them.','Continue to the end. The largest number is now in its final place.','Repeat for the remaining numbers. Stop when a whole pass makes no swaps.'],
  example:'[3, 1, 2] → swap 3 and 1 → [1, 3, 2] → swap 3 and 2 → [1, 2, 3]. The next pass makes no swaps.',
  use:'Good for learning comparisons and swaps, or very small lists. Usually too slow for large lists.',
  watch:'Orange marks the current comparison or swap. Green marks positions already settled.'
 },
 selection: {
  idea:'Choose the smallest remaining number, just as you might pick the shortest person for the front of a line.',
  steps:['Start at the first position.','Search the remaining list for the smallest number.','Swap that number into the current position.','Move one position right and repeat until the list is sorted.'],
  example:'[3, 1, 2] → smallest is 1 → [1, 3, 2] → smallest remaining is 2 → [1, 2, 3].',
  use:'Useful for learning how to track a minimum. It makes few swaps but still needs many comparisons.',
  watch:'Follow the current minimum as the scan moves right. Each pass settles one position.'
 },
 insertion: {
  idea:'Sort numbers the way you arrange playing cards in your hand: insert each new card into the correct place.',
  steps:['Treat the first number as a sorted group.','Pick up the next number; call it the key.','Shift bigger numbers in the sorted group one place right.','Put the key into the gap, then pick up the next number.'],
  example:'[3, 1, 2] → insert 1 before 3 → [1, 3, 2] → insert 2 between 1 and 3 → [1, 2, 3].',
  use:'Works well for small lists and lists that are already almost sorted.',
  watch:'During a shift, a value can appear twice temporarily: the key is being held separately until it is placed.'
 },
 merge: {
  idea:'Small sorted lists are easy to combine. Split a big list into small pieces, then combine them in order.',
  steps:['Split the range into two halves.','Keep splitting until each piece contains one number.','Compare the first unused numbers of two sorted pieces and take the smaller one.','Repeat the merge until every piece has been combined into one sorted list.'],
  example:'[4, 1, 3, 2] → [4, 1] and [3, 2] → sort to [1, 4] and [2, 3] → merge to [1, 2, 3, 4].',
  use:'Useful when predictable sorting time matters. It needs extra memory to hold the pieces.',
  watch:'A merge writes one position at a time. Temporary repeated values are expected while the saved halves are being copied back.'
 },
 quick: {
  idea:'Choose a dividing number, called a pivot. Put smaller numbers on one side and larger numbers on the other.',
  steps:['Choose the last number in the range as the pivot.','Scan the other numbers, moving values no bigger than the pivot to the left.','Put the pivot between the two groups. Its position is now final.','Repeat separately on the left and right groups.'],
  example:'[3, 1, 2] → choose pivot 2 → move 1 left → place pivot → [1, 2, 3].',
  use:'Often fast for general sorting. This last-element pivot can be slow on already sorted input.',
  watch:'Follow the pivot and the boundary of the left group. Only the current range is being partitioned.'
 },
 heap: {
  idea:'Arrange the numbers so the largest one stays at the top, then repeatedly take it out.',
  steps:['Treat the array as a tree: index i has children at 2i + 1 and 2i + 2.','Build a max heap: every parent is at least as large as its children.','Swap the root, which holds the maximum, with the last unsorted number.','Shrink the heap, move the new root down until heap order returns, and repeat.'],
  example:'[3, 1, 2] is already a max heap → move 3 to the end: [2, 1, 3] → move 2 to its final place: [1, 2, 3].',
  use:'Useful for sorting with little extra memory and a guaranteed O(n log n) time bound.',
  watch:'The bars show the array that stores the heap. A heap is only partly ordered; it is not yet a sorted list.'
 },
 linear: {
  idea:'Find a number the way you search for a name on an unsorted list: check one entry at a time.',
  steps:['Start at index 0, the first position.','Compare the current number with your target.','If they match, return that index and stop.','Otherwise move right. If you reach the end, return −1 to mean not found.'],
  example:'Find 5 in [8, 3, 5]: check 8, then 3, then 5. The result is index 2 because counting starts at 0.',
  use:'Works on unsorted data and is simple for short lists. It returns the first match.',
  watch:'Enter a target to try both successful and unsuccessful searches. With an empty target, the lesson picks a value from the list.'
 },
 binary: {
  idea:'Like finding a word in a dictionary, use the middle to decide which half to search next.',
  steps:['Start with sorted numbers; this lesson sorts your input first.','Compare the middle number with the target.','If the target is larger, search the right half. If smaller, search the left half.','Repeat until you find it or the search range becomes empty.'],
  example:'Find 8 in [1, 3, 5, 8, 9]: middle is 5, so ignore the left half. The next middle is 8: found at index 3.',
  use:'Useful for fast searches in sorted data. Sorting a previously unsorted list has its own cost.',
  watch:'The status shows the remaining range. Returned indices refer to the sorted list; duplicate values may have more than one valid matching index.'
 },
 stack: {
  idea:'A stack is like a pile of plates: the last plate added is the first one removed.',
  steps:['Push means add an item to the top.','Peek means look at the top without removing it.','Pop means remove the top item.','Only pop or peek when the stack is not empty.'],
  example:'Push 8, then 3, then 5 → [8, 3, 5]. Pop removes 5, leaving [8, 3].',
  use:'Useful for undo history, matching brackets, and remembering unfinished work.',
  watch:'This demo uses up to the first eight input values. The rightmost node is the top. It pushes the values, then pops once.'
 },
 queue: {
  idea:'A queue is like a line at a shop: the first person to join is the first person served.',
  steps:['Enqueue means add an item at the back.','Front means the item that has waited longest.','Dequeue means remove the item at the front.','Use a deque in Python so removing from the front stays fast.'],
  example:'Enqueue 8, then 3, then 5 → [8, 3, 5]. Dequeue removes 8, leaving [3, 5].',
  use:'Useful for processing tasks in arrival order and exploring graphs with BFS.',
  watch:'This demo uses up to eight values. The leftmost node is the front; the rightmost is the back. It enqueues the values, then dequeues once.'
 },
 linked: {
  idea:'A linked list is a treasure hunt: each item holds a value and a clue pointing to the next item.',
  steps:['The head points to the first node.','Each node contains a value and a next pointer.','Follow next pointers to visit the nodes in order.','A pointer to None means there are no more nodes.'],
  example:'Head → 8 → 3 → 5 → None. To reach 5, start at 8 and follow two links.',
  use:'Useful when you want to connect or unlink nodes without shifting an array. Finding a position still takes a walk from the head.',
  watch:'The demo appends up to eight nodes, then walks through them. The Python example builds the same order by prepending values in reverse order.'
 },
 bfs: {
  idea:'Explore nearby places before faraway places, like a ripple spreading out from a stone dropped in water.',
  steps:['Put the starting node in a queue and mark it discovered.','Remove the front node and visit it.','Add each undiscovered neighbor to the back of the queue. Mark it discovered immediately to avoid adding it twice.','Repeat until the queue is empty.'],
  example:'In this graph, start at A → visit B and C → then D, E, and F. The visit order is A, B, C, D, E, F.',
  use:'Finds the fewest-edge route from a starting node in an unweighted graph. Store each node’s parent if you also want to reconstruct the route.',
  watch:'The graph is a fixed example. Its connections follow the adjacency lists shown in the Python code; the drawing omits arrowheads. The status shows queue changes.'
 },
 dfs: {
  idea:'Explore one path as far as possible, then come back to the last junction and try another path.',
  steps:['Visit the starting node and mark it seen.','Choose a neighbor you have not seen.','Explore that neighbor in the same way. Recursion remembers where to return.','When no unseen neighbors remain, backtrack. Continue until all reachable nodes are visited.'],
  example:'For the neighbors listed in this lesson: A → B → D, back to B → E → F, back to A → C. Visit order: A, B, D, E, F, C.',
  use:'Useful for exploring connected paths and as a building block for cycle detection and dependency ordering. It does not generally find the shortest route.',
  watch:'Backtracking returns to earlier nodes without visiting them again. A seen set prevents repeated visits. The fixed graph follows the adjacency lists in the code.'
 },
 bst: {
  idea:'A binary search tree is a branching number guide: smaller numbers go left and larger numbers go right.',
  steps:['The first inserted value becomes the root.','Compare each new value with the current node.','Go left if smaller, right if larger, and repeat until you find an empty spot.','To read values in order, visit the left subtree, the node itself, then the right subtree.'],
  example:'Insert 8, 3, 10, 6: 8 is the root; 3 goes left; 10 goes right; 6 goes right of 3. An in-order walk gives 3, 6, 8, 10.',
  use:'Useful for ordered storage and searching. A balanced tree is fast; a long, one-sided tree can be as slow as scanning a list.',
  watch:'The demo inserts up to seven distinct values. Duplicate values are ignored. The final frame shows the completed tree; it does not animate the in-order walk.'
 },
 prefix: {
  idea:'Keep a running total, like adding each new purchase to your shopping bill.',
  steps:['Start the total at zero.','Add the next number to the total.','Save that total at the same index in a new list.','For a range from l to r, subtract the total before l from the total at r. If l is 0, just use the total at r.'],
  example:'[2, 4, 1, 3] → running totals [2, 6, 7, 10]. Sum at indices 1 through 3 is 10 − 2 = 8, which equals 4 + 1 + 3.',
  use:'Useful when you need many range-sum answers for a list whose values stay fixed.',
  watch:'Each processed bar becomes a running total. Unprocessed bars still show the original input values.'
 },
 kadane: {
  idea:'Find the best total from a continuous stretch of numbers. At each number, decide whether to extend your stretch or start fresh.',
  steps:['Start with the first number as both the current sum and the best sum.','For each next value, compare that value alone with the current sum plus that value. Keep the larger choice.','Update the best sum if the current sum beats it.','Continue to the end. The selected stretch must contain at least one number.'],
  example:'[-2, 3, -1, 4, -5]: restart at 3, extend to 2, then to 6. The best stretch is [3, -1, 4], with sum 6.',
  use:'Useful for finding the most profitable continuous period or strongest continuous signal. If every number is negative, the answer is the largest single number.',
  watch:'The status compares the sum ending here with the best sum seen. Green marks the best stretch so far; the array itself stays unchanged.'
 },
 fibonacci: {
  idea:'Build a number sequence where each new number is the sum of the previous two. Save answers so you never calculate the same one again.',
  steps:['Start with F(0) = 0 and F(1) = 1.','Calculate F(2) = 0 + 1 = 1.','Calculate each later value by adding the previous two saved values.','Continue until the table has the requested number of entries. This is dynamic programming: reuse smaller answers.'],
  example:'Seven entries give [0, 1, 1, 2, 3, 5, 8]. The last entry is F(6), because indices start at 0.',
  use:'A simple introduction to dynamic programming. If you only need the last value, you can keep just the previous two values instead of the whole table.',
  watch:'Only the number of input values matters here, not their values. Six input numbers produce F(0) through F(5). Unfilled positions start at zero.'
 }
};

const chooseWithGuide = choose;
choose = function(id) {
 chooseWithGuide(id);
 const guide = guides[id];
 $('explanation').textContent = guide.idea;
 $('simpleGuide').innerHTML = `<div class="eyebrow">EXPLAINED SIMPLY</div><h2>${esc(selected.title)}, one step at a time</h2><p>${esc(guide.idea)}</p><ol>${guide.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><div class="guide-example"><h3>A tiny example</h3><p>${esc(guide.example)}</p></div><h3>When would I use it?</h3><p>${esc(guide.use)}</p><h3>What to watch in this animation</h3><p>${esc(guide.watch)}</p>`;
};
choose(selected.id);
