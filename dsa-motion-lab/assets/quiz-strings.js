Object.assign(QuizChoices,{
 zstring:[
  ['Z[i] measures prefix agreement at i; reuse inside the box only up to its verified right boundary.','Z[i] always equals the length of the longest suffix anywhere in the text.','A mirrored Z value may be copied beyond the verified box without comparison.','Every Z value must be recomputed from zero even inside a known box.'],
  ['Use a unique internal separator, map combined indices back to text, and define empty-pattern boundary matches.','Choose any separator even if it occurs in both inputs.','Z search cannot report overlapping occurrences.','Subtract only the pattern length, ignoring the separator, when mapping positions.']
 ],
 rabin:[
  ['Subtract the outgoing weighted character, multiply by the base, and add the incoming character modulo M.','Rehashing the entire text is required for each window shift.','XOR the two characters to obtain an exact polynomial hash update.','Remove the outgoing character without its positional weight.'],
  ['Verify equal hashes exactly; many collisions or genuine candidates can still cause O(nm) work.','A single modular hash proves string equality with no verification.','Double hashing eliminates all possible collisions mathematically.','Exact character verification makes every search deterministically O(n+m).']
 ],
 horspool:[
  ['Excluding the final character gives positive shifts based on its rightmost earlier occurrence.','Including the final character with shift zero guarantees progress.','Every shift is the pattern length regardless of the current window.','The shift must always be based on the first mismatching text character.'],
  ['Horspool can repeat long comparisons with small shifts and lacks full Boyer–Moore’s additional rules.','All Boyer–Moore variants have identical preprocessing and worst-case guarantees.','Right-to-left comparison alone proves linear time.','Horspool must sort the text alphabet before it can compare characters.']
 ],
 aho:[
  ['Failure links lead to usable suffix-prefix states, and terminal suffix states can add several outputs.','A failure link always points to the trie parent regardless of suffix content.','Only the longest dictionary word ending at a position may be reported.','A missing transition requires restarting the entire text scan from its beginning.'],
  ['Copied inherited outputs can duplicate many references; output links avoid storing each inherited list.','Copying every inherited list always uses exactly one output reference per trie state.','Output size never contributes to search runtime.','Failure links can be built in any order without depending on shorter states.']
 ],
 trie:[
  ['Follow the requested prefix once, then enumerate terminal words only in its matching subtree.','A prefix lookup must compare against every complete dictionary word.','A node cannot be terminal if it has children.','All words in a trie must have the same length.'],
  ['Update ranking metadata along the path and prune deleted nodes only when nonterminal and childless.','Deleting car should delete its whole subtree, including card and care.','Top-k caches require no repair when scores or words change.','A compressed radix tree removes every need to compare edge labels.']
 ],
 suffix:[
  ['Two k-length ranks form a 2k-prefix rank pair; a missing second block sorts below real ranks.','The second rank should always be the same as the first rank.','Missing blocks must sort above every real character to order shorter suffixes first.','A comparison-sorted doubling implementation is automatically O(n) construction.'],
  ['Binary-search the consecutive range of suffixes beginning with the pattern, then report original starts.','Matching suffixes may be arbitrarily scattered in lexicographic suffix order.','Suffix-array order is already numerical order of original text positions.','Only a suffix exactly equal to the pattern counts as a substring occurrence.']
 ],
 kasai:[
  ['The next original-index suffix can reuse at least the previous overlap minus one before extending.','Every adjacent-suffix comparison must start at character zero.','The reusable overlap increases by one after every original index regardless of characters.','Kasai’s linear LCP bound automatically includes any suffix-array construction method.'],
  ['Subtract summed LCPs from n(n+1)/2 for distinct substrings; maximum LCP gives a repeated-substring length.','The sum of LCPs is the number of distinct substrings.','Maximum LCP guarantees repeated occurrences do not overlap.','Only suffixes with equal original indices can share repeated substrings.']
 ],
 manacher:[
  ['Odd radii include a character center; even radii use a center before an index and have length twice the radius.','Odd and even palindromes share identical center and radius formulas.','An even palindrome must have a repeated middle character stored as a separate separator in the input.','Manacher finds a subsequence and may skip mismatching characters.'],
  ['Cap mirror reuse at the known boundary and extend only beyond verified matches; boundary progress amortizes linearly.','Copy every mirror radius completely, even beyond the known outer palindrome.','Independent expansion from every center is always O(n).','The rightmost palindrome boundary must restart at zero for every center.']
 ],
 lcs:[
  ['On mismatch, skip one of the two final characters; on equality, extend an optimal diagonal state.','A mismatch resets LCS to zero because gaps are forbidden.','Only the final characters of the complete strings matter.','On mismatch, always discard the character with the smaller alphabetic value.'],
  ['Hirschberg combines forward and backward rolling-row lengths to choose recursive reconstruction splits.','Keeping two rows automatically preserves all ordinary backtracking predecessors.','Linear-space reconstruction requires changing the LCS length definition.','A greedy choice of the next equal character always reconstructs an optimal LCS.']
 ],
 lcsubstr:[
  ['The state is an ending common run, so mismatch resets it to zero and the maximum is taken over all cells.','Mismatch keeps the larger of the top and left values while allowing gaps.','Only the bottom-right cell can contain the longest common substring.','A mismatch should increment the diagonal run to count skipped characters.'],
  ['Use a generalized suffix order and scan adjacent cross-source LCPs, preventing matches across unique separators.','Any same-source LCP proves the substring occurs in both inputs.','Concatenating inputs without boundary handling cannot change the answer.','An LCS-with-gaps table is identical to a generalized suffix-array solution.']
 ],
 edit:[
  ['Top, left, and diagonal represent deletion, insertion, and replacement; equal characters reuse the diagonal.','Every mismatch needs all three edits at once.','Swapping neighboring characters always costs one ordinary Levenshtein edit.','Empty-prefix borders are all zero regardless of required insertions.'],
  ['For distance at most k, compute a diagonal band and report values beyond k as over-threshold, not exact.','A narrow band returns every unrestricted exact distance automatically.','A length difference greater than k can still have Levenshtein distance at most k.','Restricting the band changes insertion and deletion costs to zero.']
 ],
 scs:[
  ['LCS characters can be shared once, so an SCS has length n+m−LCS.','An SCS has length n+m+LCS because shared characters are duplicated.','Both inputs must appear as contiguous substrings in every supersequence.','An SCS is always one of the two original inputs.'],
  ['Use LCS information to preserve optimal future sharing; local character preference can produce a longer merge.','Always consuming from the first input on mismatch is optimal.','Lexicographically smaller next characters always minimize total supersequence length.','Any LCS tie rule guarantees the lexicographically smallest SCS.']
 ],
 lps:[
  ['Matching ends wrap an inner palindrome; unequal ends require skipping one end and keeping the better interval.','Every mismatching interval has palindrome-subsequence length zero.','All selected characters must be adjacent.','The answer is always the number of characters equal to the first one.'],
  ['Minimum deletions are n−LPS; LCS with the reversed text gives the length but arbitrary reconstruction may not be palindromic.','Every reconstructed LCS with the reversed text must itself be a palindrome.','Minimum deletions equal the LPS length for all inputs.','Allowing insertions and replacements does not change the deletion-only formulation.']
 ],
 palcut:[
  ['Try every palindromic final interval and combine it with the best earlier prefix cut count.','Always choose the longest palindrome starting at the current position.','The number of palindrome pieces equals the number of cuts.','Knowing which intervals are palindromes alone supplies the minimum partition without optimization.'],
  ['Expand odd and even centers in a dependency-safe order while updating prefix cuts, avoiding the full palindrome table.','Arbitrary center order is safe even when earlier prefix costs are unfinished.','Center expansion makes every input O(n) time regardless of its palindrome count.','Even-length centers can be ignored because every palindrome has a character center.']
 ],
 wordbreak:[
  ['A prefix is reachable if a reachable earlier boundary is followed by a dictionary word; seed the empty prefix true.','Use each dictionary word exactly once even when reuse is allowed.','Mark every prefix reachable if its last character appears in the dictionary.','The empty prefix must be false so no empty word is chosen.'],
  ['Record valid transitions and prune dead suffixes, but enumerating all segmentations may still have exponential output.','Memoization guarantees polynomial total size when every valid sentence is returned.','A trie removes all output costs from sentence enumeration.','A yes/no result automatically contains every segmentation path.']
 ],
 distinct:[
  ['Add disjoint skip and use counts, with the use case available only when the current characters match.','Take the maximum of skip and use because only one best sequence matters.','Count each visible resulting word only once regardless of chosen positions.','There are zero ways to make the empty target from a nonempty text.'],
  ['Update target states right to left so a current text character is not reused; choose sufficient integer precision.','Update left to right so newly created states can reuse the current character.','Counting choices never grows larger than the text length.','Rolling the table removes the need for the empty-target base count.']
 ],
 wildcard:[
  ['A glob star can consume nothing via the left state or consume more text via the state above.','A glob star repeats only its preceding character, exactly like regex *.','A question mark matches any-length substring.','Full-string wildcard matching may ignore an arbitrary unmatched suffix.'],
  ['Remember the latest star and retry with more coverage; constant-state retry can still have O(nm) worst-case time.','The basic last-star retry strategy is universally linear with no further argument.','Remembering a star means every future mismatch can be ignored.','Adding arbitrary regex backreferences preserves the same simple glob proof.']
 ],
 minwindow:[
  ['Track required multiplicities and missing occurrences; shrink only while all counts remain satisfied.','A set of present characters is sufficient even if the requirement repeats letters.','The required character order must match the window order exactly.','Removing an irrelevant character always makes a valid window invalid.'],
  ['Define character units and preserve enough streamed data or mappings to recover the chosen window.','UTF-16 offsets always equal Unicode code-point indices.','A stream implementation always uses constant memory even if it must return an unbounded window.','Case folding and normalization can never alter index mappings.']
 ],
 anagrams:[
  ['At full pattern width, zero missing required occurrences implies exactly the required multiset.','Only the sum of character codes is needed to prove an anagram.','Any window containing every distinct required letter is valid regardless of width and multiplicity.','Overlapping anagram windows must be discarded.'],
  ['Use exact count differences for a fixed alphabet; a scalar sum or XOR can collide for different multisets.','Matching XOR values prove arbitrary multisets are identical.','Matching character sums prove every multiplicity is equal.','Unicode always has the same fixed small alphabet as lowercase English letters.']
 ],
 unique:[
  ['Remove from the left until the new duplicate disappears, then measure the restored unique window.','Remove exactly one character on any duplicate, even if it remains duplicated.','Sort the window so uniqueness no longer depends on original positions.','A unique substring may skip any inconvenient repeated characters.'],
  ['Move left to max(left,lastSeen+1), preventing an old occurrence outside the window from moving it backward.','Always set left=lastSeen+1, even if that reduces left.','Discard all previous positions whenever any repeated character appears.','The last-seen method must scan the whole current window on every step.']
 ]
});
