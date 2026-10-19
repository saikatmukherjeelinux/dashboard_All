Object.assign(InterviewBank, {
 zstring: [
  ['What does a Z value represent, and how does a Z box avoid repeated comparisons?',
   'Z[i] is the number of consecutive characters beginning at i that match the beginning of the whole sequence. A Z box [l,r] records a range already known to equal a prefix. If i lies inside that box, Z[i−l] supplies a reusable lower bound, capped at r−i+1 because anything beyond r has not yet been verified. Only the unverified part needs direct character comparisons.',
   'For aaaaa, the Z values are [0,4,3,2,1] under this lesson’s convention. Once the long box beginning at index 1 is known, later positions reuse its prefix structure rather than independently comparing four, three, and two characters.',
   'The right boundary advances at most O(n) times, giving linear construction time and O(n) storage. Copying a Z value without capping it at the current box boundary can claim matches that were never checked.'],
  ['How does Z-based pattern search handle separators, overlaps, and empty patterns?',
   'Construct pattern + separator + text. A text position with Z value at least the pattern length begins an occurrence. The separator must not equal any input character; using an internal non-character token avoids guessing a supposedly unused character. Every text position is tested independently through its Z value, so overlapping occurrences are naturally included. Empty patterns require a separately stated boundary convention.',
   'Pattern ABA in ABABA produces starts 0 and 2. If the pattern length is m, a qualifying combined-sequence index i maps to text index i−m−1. Using a literal # separator would be unsafe if # also appears in an input.',
   'Time and storage are O(n+m), plus O(z) reported positions. This lesson defines the empty pattern to match all n+1 text boundaries. Do not confuse the display symbol for the separator with its actual internal identity.']
 ],
 rabin: [
  ['How is the rolling hash updated when a fixed-size window moves?',
   'Represent an m-character window as a polynomial in base B modulo M. Remove the outgoing character multiplied by B^(m−1), multiply the remaining value by B, then add the incoming character. Taking the modulus keeps numbers bounded. Precompute B^(m−1) so each shift uses a constant number of arithmetic operations rather than hashing the whole window again.',
   'For a two-character window AB with hash code(A)×B+code(B), subtract code(A)×B to leave code(B). Multiplying by B and adding code(C) gives the hash of BC. Normalize negative residues if the language’s remainder operator can return them.',
   'Initial hashing costs O(m); rolling updates cost O(1) each under bounded arithmetic. Modulus and base choices affect collisions. In JavaScript, intermediate products must stay within exact integer range or use an appropriate alternative representation.'],
  ['Why does exact verification matter, and when does Rabin–Karp still become quadratic?',
   'Different strings can share a modular hash, so accepting hash equality alone is probabilistic. Comparing the actual characters after equal hashes makes the result exact. However, there may be many candidate windows, and each verification may inspect m characters. Even genuine matches, not just collisions, can force repeated verification work. Double hashing reduces accidental collisions but does not remove this worst-case verification cost.',
   'Searching aaa…a of length m in a longer all-a text yields a hash match at every possible start. Exact verification checks m equal characters at each start, giving Θ((n−m+1)m) work in this implementation.',
   'Worst-case time is O(nm); rolling hash state itself is O(1) beyond inputs and output. For a deterministic linear single-pattern search, use KMP or Z. Hashes are useful filters, not proofs of equality unless followed by exact checking.']
 ],
 horspool: [
  ['Why does Horspool build its shift table without the last pattern character?',
   'The shift is determined by the character aligned with the current window’s final position. For each character occurring before the pattern end, store the distance from its rightmost such occurrence to the end. If the character is absent, shift by the full pattern length. Excluding the last position prevents a zero shift and aligns the next plausible occurrence without skipping a possible match.',
   'For ABA, positions before the last A give shifts A:2 and B:1; another character shifts 3. When the current window ends in B, moving one position aligns that B with the middle B of the pattern.',
   'Preprocessing takes O(m) time and up to O(m) table entries. Compare from right to left, but use the window’s last text character for Horspool’s shift—not necessarily the character at the mismatch position.'],
  ['Why is Horspool often fast but not guaranteed linear, and how does it differ from full Boyer–Moore?',
   'Large shifts let Horspool skip many starting positions on favorable text. Repetitive inputs can make shifts very small and comparisons very long, so the skipped-position advantage disappears. Full Boyer–Moore uses additional information, including a mismatch-sensitive bad-character rule and a good-suffix rule. Horspool is a simpler variant, so theoretical guarantees for other variants should not be attached to it automatically.',
   'With an all-a pattern in an all-a text, a full match can occur at every offset and the shift table allows a shift of only 1. Reporting all overlaps then repeatedly compares the whole pattern.',
   'The lesson’s worst-case time is O(nm), with O(m) preprocessing storage plus output. A large alphabet and longer, varied patterns often improve typical behavior. Empty patterns and overlapping-match reporting must be specified separately from average-case speed claims.']
 ],
 aho: [
  ['What is a failure link, and why can one text position report several dictionary words?',
   'A trie state represents a prefix of a dictionary word. Its failure link points to the longest proper suffix of that prefix that is also a trie prefix. On a missing edge, follow failure links until an edge can consume the next character or the root is reached. A state can correspond to a complete word and also have suffix states that are complete words, so all those terminal outputs must be reported.',
   'For dictionary [he, she, hers], reading she reaches the she state. Its suffix he is also a word, so that one ending position reports she and he with different starting indices.',
   'Failure links are built in breadth-first order so shorter fallback states are ready before longer states depend on them. Marking only the current state’s own terminal word misses suffix matches. Output size z must be included in search complexity.'],
  ['Why can copying inherited output lists use much more memory than output links?',
   'A teaching implementation may copy every terminal word from a failure state into each descendant state’s output list. This makes reporting easy but duplicates the same outputs across many states. An output link instead points to the next terminal state on the failure chain, allowing matches to be enumerated without storing every inherited list repeatedly. Transition representation also affects construction bounds.',
   'For patterns a, aa, aaa, and so on, a deep all-a state inherits many shorter words. Copying the entire inherited list at every depth stores a triangular number of word references. Output links store a short chain of references between terminal states instead.',
   'Optimized fixed-alphabet implementations can achieve O(S+n+z) time and O(S) structural storage, where S is total pattern length. This lesson’s copied outputs and map-based fallback construction justify its more conservative O(SL+n+z) bound, with L the longest word.']
 ],
 trie: [
  ['Why does a trie support prefix lookup without scanning every stored word?',
   'A trie stores one outgoing edge per next character, sharing paths for common prefixes. Following a prefix of length p reaches exactly the subtree containing its completions. If any required edge is missing, no stored word has that prefix. To return suggestions, traverse only the matching subtree and collect terminal nodes, remembering that a node can be both a complete word and the parent of longer words.',
   'With car, card, care, cat, and dog, following c then a reaches four relevant words while excluding the entire d branch. A terminal marker on car lets it be returned alongside card and care.',
   'Lookup alone takes O(p) expected transition work with hash maps. Listing results also costs the visited subtree and output length; it is not simply O(p). Sorting suggestions adds comparison cost beyond trie traversal.'],
  ['How would you support ranked autocomplete and deletion without corrupting shared prefixes?',
   'For ranked suggestions, maintain frequency or score information at terminal nodes and optionally cache the best k suggestions at each prefix node. Updates must repair caches on the affected path. For deletion, clear the word’s terminal marker, then prune only nodes that are nonterminal and have no children. Shared prefixes and shorter words must survive. Counts can support multiple occurrences of a word.',
   'Deleting car must not delete card or care. Deleting card afterward may remove its final d node, but the shared car prefix still supports care. A cache for prefix ca needs updating if car’s score changes or the word disappears.',
   'Cached top-k results speed reads but add O(k) storage per cached node and more update work. A radix tree compresses chains of single-child nodes to reduce pointer overhead, but matching and editing inside compressed edge labels becomes more involved.']
 ],
 suffix: [
  ['Why can suffixes be ranked by pairs during prefix doubling?',
   'If rank[i] describes the first k characters of suffix i, then the first 2k characters are determined by the pair (rank[i], rank[i+k]). Sorting these pairs orders those longer prefixes. A missing second block receives a rank below every real rank so a shorter suffix sorts first when it is a prefix of another. Reassign compact ranks and double k until every suffix is distinguished.',
   'In banana, suffix a must sort before ana, and ana before anana. The missing second block’s sentinel rank ensures that a finished suffix does not incorrectly sort after a longer suffix with the same opening characters.',
   'Comparison sorting over O(log n) rounds gives O(n log² n) time and O(n) working arrays. Using stable integer/radix sorting for rank pairs can reduce construction to O(n log n). Displaying full suffix strings adds visualization-only copying.'],
  ['How can a suffix array answer substring occurrence queries?',
   'All suffixes beginning with a pattern form one consecutive interval in lexicographic suffix order. Binary-search the first suffix whose relevant prefix is not smaller than the pattern, then the first suffix beyond that matching-prefix range. The suffix start indices in the interval are occurrence positions in the original text. A suffix array orders suffixes, not the positions themselves numerically.',
   'For banana, suffix-array entries [3,1] correspond to ana and anana. Both begin with ana, so the pattern occurs at original positions 3 and 1; sort those positions separately if left-to-right output is required.',
   'Straightforward comparisons take O(m log n) time per pattern plus O(z) reporting, after construction. LCP-aware techniques can reduce repeated character comparisons. Use a proper prefix comparison: a suffix longer than the pattern can still be a matching occurrence.']
 ],
 kasai: [
  ['Why can Kasai reuse the previous overlap minus one?',
   'Suppose suffix i shares h characters with its lexicographic predecessor. Removing the first character leaves suffix i+1 with a known matching prefix of length at least h−1 against an appropriate earlier suffix. Its immediate predecessor cannot have a smaller common prefix than that known candidate. Therefore the next comparison can begin at max(h−1,0), extending only beyond what is already guaranteed.',
   'For banana, LCP in suffix order is [0,1,3,0,0,2]. The long overlap between ana and anana gives reusable information when the original-index scan advances to the following suffixes, instead of independently restarting every comparison at zero.',
   'The overlap increases only O(n) times overall and decreases by at most one per original index, giving O(n) LCP construction time. That bound assumes a suffix array is already available; this lesson’s preceding suffix-array build has its own cost.'],
  ['How can LCP values count distinct substrings or find a longest repeated substring?',
   'Suffix i contributes n−i possible nonempty prefixes, each representing a substring. In suffix order, its overlap with the preceding suffix counts the prefixes that have already appeared. Subtract those LCP values from the total n(n+1)/2 possible position-defined substrings. The largest LCP also gives the length of a longest repeated substring, because suffixes sharing a prefix form a consecutive block.',
   'banana has 21 position-defined nonempty substrings. Its LCP values sum to 7, so it has 14 distinct substrings. The maximum LCP is 3, identifying ana as a longest repeated substring.',
   'After suffix array and LCP construction, both calculations take O(n). Overlapping occurrences are allowed. Requiring non-overlapping repeated occurrences changes the problem; taking the largest LCP alone is then insufficient.']
 ],
 manacher: [
  ['How do odd and even palindrome radii differ?',
   'An odd palindrome is centered on a character, while an even palindrome is centered between characters. In this lesson, odd[i] includes the center, giving length 2×odd[i]−1. even[i] is centered immediately before index i and gives length 2×even[i]. Keeping separate arrays avoids introducing a separator character and makes the two indexing conventions explicit.',
   'For aba, odd[1]=2 represents the full length-3 palindrome. For abba, even[2]=2 represents the full length-4 palindrome centered between the two b characters. A single character has odd radius 1 and even radius 0.',
   'Both passes together take O(n) time and O(n) radius storage. The longest continuous palindrome is not the longest palindromic subsequence: Manacher cannot skip characters. Off-by-one errors commonly arise from treating even centers as character positions.'],
  ['What makes mirror reuse safe and gives Manacher a linear bound?',
   'Keep the palindrome reaching farthest right. For a new center inside it, reflect that center across the known palindrome’s center. The mirrored radius is reusable only up to the current right boundary; outside that boundary no match has been established. Start from that capped radius and compare outward. Successful new comparisons extend the right boundary, which can advance only n times in each pass.',
   'If the mirrored palindrome fits wholly inside the known outer palindrome, its matching structure is already determined. If it touches the boundary, copy only the safe portion, then test whether the new center extends farther right.',
   'Do not blindly copy the full mirror radius when it crosses the known boundary. The resulting amortized O(n) bound is stronger than independently expanding at every center, which can take O(n²) on an all-equal string. Stored animation snapshots have additional cost.']
 ],
 lcs: [
  ['Why does LCS take the maximum of two neighbors on a character mismatch?',
   'For prefixes ending in different characters, an optimal common subsequence cannot use both of those final characters as its last shared character. At least one final character is skipped. The alternatives are therefore the best result without the first prefix’s last character or without the second prefix’s last character. When the final characters agree, a longest answer can extend an optimal diagonal-prefix answer by that character.',
   'For ABC and AC, the B has no counterpart in the second string. Skipping it preserves A, then matching C extends the diagonal answer to AC. A substring algorithm would reset on mismatches instead of allowing that gap.',
   'The full table costs O(nm) time and space and supports reconstruction. Empty-prefix row and column are zero. Equal-length alternatives may produce different valid LCS strings, so validate both length and subsequence membership rather than one arbitrary tie outcome.'],
  ['How can you reconstruct an LCS using linear rather than quadratic space?',
   'Hirschberg’s method splits one input in half. Compute LCS lengths between its first half and every prefix of the other input using rolling rows. Compute corresponding suffix lengths for the second half in reverse. Choose the split position maximizing the sum of these two lengths, then recursively reconstruct each side and concatenate the results. The split identifies a point through which some optimal alignment passes.',
   'If the first input is split into X and Y, test every split B[:j] / B[j:] of the second input. A maximum of LCS(X,B[:j]) + LCS(Y,B[j:]) determines compatible subproblems whose answers can be joined.',
   'Time remains O(nm), with O(min(n,m)) DP workspace under a careful implementation, plus recursion and output. Two rolling rows alone recover the length but discard the predecessor information needed for ordinary backtracking.']
 ],
 lcsubstr: [
  ['Why does a mismatch reset longest-common-substring DP to zero?',
   'The cell represents the length of the common suffix ending exactly at the current pair of characters. A mismatch means no nonempty shared run can end at both positions, so this state must be zero. On a match, add one to the diagonal state. Track the maximum over every cell because the longest shared substring may end before either entire input ends.',
   'ABABC and BABCA share BABC. Its length-4 run ends at the final C in the first string and the fourth character of the second, not at the bottom-right table cell.',
   'The full teaching table uses O(nm) time and space. Rolling one previous row reduces space to O(m), or O(min(n,m)) after choosing orientation. Preserve the best end index to recover the actual substring.'],
  ['How can suffix structures find the longest common substring between two texts?',
   'Build a generalized suffix array for first text, a unique separator, second text, and optionally an end marker. Label each suffix by its source text. A longest shared substring is represented by a large LCP between adjacent suffixes from different sources; scan those cross-source adjacencies for the maximum. Unique separators ensure a common prefix cannot improperly continue across a text boundary.',
   'If one suffix from ABABC begins at BABC and a neighboring suffix from BABCA begins at BABCA, their shared prefix BABC supplies a length-4 candidate. Same-source neighbors alone do not prove the substring appears in both texts.',
   'Construction cost depends on the suffix-array algorithm; the LCP scan is linear afterward. Keep source labels and boundary handling explicit. A suffix automaton offers another route, but neither approach is equivalent to computing LCS with gaps.']
 ],
 edit: [
  ['What do the three Levenshtein DP neighbors mean?',
   'For converting a source prefix to a target prefix, deleting the last source character uses the cell above plus one. Inserting the last target character uses the cell to the left plus one. Replacing a mismatched final character uses the diagonal cell plus one. Equal final characters reuse the diagonal cost without adding an edit. Empty-prefix borders count the necessary insertions or deletions.',
   'kitten→sitten replaces k with s; sitten→sittin replaces e with i; sittin→sitting inserts g. The distance is 3. Transposing adjacent letters is not a single operation in ordinary Levenshtein distance.',
   'Time is O(nm), and the full table uses O(nm) space. Two rows suffice for the numeric distance. Reconstructing an edit script needs predecessor information or a more elaborate divide-and-conquer method. Weighted edits require adjusting both transitions and initialization.'],
  ['How can a known distance threshold accelerate edit-distance checking?',
   'If only answers at most k matter, states with |i−j|>k cannot belong to a path of at most k insertions/deletions. Restrict computation to a diagonal band of width about 2k+1 and treat outside states as infinity. If the input lengths differ by more than k, reject immediately. The banded result answers whether the distance is at most k, rather than automatically recovering every larger exact distance.',
   'For two length-1000 strings and threshold 2, a narrow band examines roughly five cells per row instead of a million-cell full matrix. A length difference of 5 already rules out distance ≤2.',
   'For small k, banding can reduce time to O(k×max(n,m)) and rolling workspace to O(k). A result exceeding the band’s threshold must be reported as greater than k, not trusted as an exact unbounded distance.']
 ],
 scs: [
  ['Why is shortest-common-supersequence length n + m − LCS length?',
   'Start by placing all characters from both strings into a merged sequence, which would cost n+m positions if nothing were shared. Characters aligned as a common subsequence can occupy one position instead of two. The largest possible saving is the LCS length. Conversely, sharing more positions in any supersequence would identify a longer common subsequence, contradicting the definition of LCS.',
   'For abac and cab, an LCS has length 2. Therefore an SCS has length 4+3−2=5. cabac achieves that length and contains both inputs in their original order.',
   'The lesson builds an O(nm) LCS table and reconstructs one SCS in O(n+m) additional traversal. A supersequence preserves order but need not contain either input as a continuous substring. Multiple optimal outputs can be equally correct.'],
  ['Why does a local merge based only on the next characters fail to guarantee a shortest result?',
   'A locally convenient character choice can sacrifice a longer alignment later. LCS-guided reconstruction compares optimal remaining alignments, so it knows which side can be consumed without losing the greatest possible sharing. At a mismatch, follow the neighboring state with the larger LCS value while adding the consumed character to the supersequence. Equal states permit multiple optimal choices.',
   'For first input bc and second input ab, blindly consuming from the first input on mismatches can produce bcab, length 4. Taking a from the second input first, then sharing b and adding c, produces abc, length 3. The DP table identifies that better alignment.',
   'In backward reconstruction, collect characters in reverse and reverse once at the end; repeated prepending can add avoidable copying cost. If a problem asks for the lexicographically smallest SCS, arbitrary LCS tie-breaking is insufficient and needs an additional comparison strategy.']
 ],
 lps: [
  ['Why is an interval DP appropriate for longest palindromic subsequence?',
   'A palindrome relates the two ends of an interval. If they match, they can surround an optimal palindrome inside, contributing two characters. If they differ, at least one end must be skipped, so take the larger result from dropping either end. A single-character interval has length 1, and the interior of two adjacent matching ends has length 0.',
   'For bbbab, matching outside b characters allows a length-4 answer bbbb after skipping a. The characters do not need to be adjacent, which is why the longest continuous palindrome can have a different length.',
   'Compute shorter dependencies before larger intervals, for example by decreasing the left index and increasing the right index. Time and table storage are O(n²). The lesson returns a length; recovering actual characters requires a separate reconstruction walk.'],
  ['How does LPS relate to minimum deletions and to LCS with a reversed string?',
   'Keeping a longest palindromic subsequence and deleting everything else gives a palindrome with n−LPS deletions. No solution can delete fewer, because its kept characters would then form a longer palindromic subsequence. The numeric LPS length also equals LCS(text, reverse(text)). However, arbitrary LCS reconstruction tie-breaking need not return a palindrome, so use interval-DP reconstruction or a carefully constrained method when an actual palindrome is required.',
   'For bbbab, LPS length is 4, so deleting the single a is optimal. For ACBAC and its reverse CABCA, ABC is a longest common subsequence of length 3 but is not a palindrome; ACA is a valid palindromic answer of the same length.',
   'The length computation remains O(n²). Deletion-only conversion is different from edit distance to a palindrome, where insertions and replacements may be allowed with different costs. A correct numeric equivalence does not justify every reconstruction method.']
 ],
 palcut: [
  ['Why does minimum palindrome partitioning need both palindrome information and prefix costs?',
   'To end a partition at index r, choose a start l such that text[l…r] is a palindrome. Its cost is zero cuts if l=0, otherwise bestCuts[l−1]+1. A palindrome table makes the interval test O(1), while the prefix-cost array remembers the best earlier partition. Greedily choosing the longest current palindrome does not evaluate all possible partition boundaries.',
   'For aab, interval aa is a palindrome, so ending its piece at index 1 costs zero cuts. Appending the palindrome b adds one boundary, yielding aa|b. Counting pieces would give 2, but the requested cut count is 1.',
   'The interval table and all boundary checks take O(n²) time and O(n²) storage. Empty text needs zero cuts. Compute palindrome dependencies before relying on them, especially for adjacent equal characters.'],
  ['How can center expansion remove the quadratic palindrome table?',
   'Initialize each prefix’s cut count to the worst case, then expand odd and even palindromes around centers in increasing order. Whenever expansion finds palindrome [l,r], improve the prefix ending at r from the already established best prefix ending at l−1, or use zero if l=0. The prefix before l lies entirely before the current center, so its useful palindrome endings have already been considered.',
   'When expanding the even center between the first two a characters in aab, discover [0,1] and set its cut count to zero. The later single-character b can then extend that best prefix using one cut.',
   'Worst-case time stays O(n²) because all-equal text has quadratically many palindromes, but working storage can drop to O(n). Processing centers in an arbitrary order can use unfinished prefix costs; the update order is part of the correctness argument.']
 ],
 wordbreak: [
  ['Why does word break use reachability over prefix lengths?',
   'possible[end] is true when the first end characters can be segmented into dictionary words. Try every final word start: if possible[start] is true and text[start…end) is in the dictionary, the longer prefix is reachable. Initializing possible[0]=true represents the valid empty segmentation and lets the first word begin at index 0. Dictionary words may be reused unless the problem explicitly restricts inventory.',
   'For leetcode and [leet, code], possible[4] becomes true from leet. Then possible[8] becomes true because possible[4] is true and text[4…8) is code. A failed short candidate must not prevent trying a later split.',
   'There are O(n²) candidate splits. In this slicing-based implementation, constructing and hashing each candidate can take O(n), giving O(n³) worst-case time. The boolean DP uses O(n) storage beyond dictionary data and traces.'],
  ['How would you return all segmentations without confusing feasibility cost with output cost?',
   'Record valid word transitions between prefix positions, then traverse paths from 0 to n. Memoize suffix solutions or prune with a feasibility DP so dead suffixes are not repeatedly explored. Nevertheless the number of valid segmentations may itself be exponential, so memoization cannot make returning every sentence polynomial in input length alone. State the output-size term explicitly.',
   'For a repeated-a string with dictionary [a, aa], each position may offer one- or two-character choices. The count follows a Fibonacci-like growth even though a yes/no answer is inexpensive to compute.',
   'A trie can scan dictionary prefixes directly, avoiding repeated candidate substring creation. Maximum dictionary-word length can also bound explored starts. Enumeration still needs time proportional to emitted characters, and storing all completed sentences may dominate DP memory.']
 ],
 distinct: [
  ['Why are the skip and use cases added rather than maximized?',
   'The task counts different choices of text positions, not just the best length. Every matching subsequence either excludes the current text position or includes it as the final selected character. These cases are disjoint, so add their counts. The include case exists only when the text and target characters match. There is one way to form an empty target—select no positions—from any text prefix.',
   'rabbbit has three choices for which two of its three b positions form the two target b characters in rabbit. All produce the same visible word but count as distinct index selections.',
   'The full table costs O(nm) time and space. Empty text with a nonempty target has zero solutions. If the target is longer than the text, the answer must be zero. Counts can grow combinatorially even when the strings are short.'],
  ['How do you compress subsequence-count DP without reusing one text character twice?',
   'Keep one array indexed by target prefix length, with dp[0]=1. For each text character, update target indices from right to left. On equality, add dp[j−1] into dp[j]. Descending order ensures dp[j−1] still belongs to the previous text prefix; ascending order could include the same current text character more than once. Choose an integer representation large enough for the counts.',
   'With text a and target aa, an ascending loop first sets dp[1]=1 and then incorrectly uses that new value to set dp[2]=1. Descending updates correctly leave dp[2]=0.',
   'Time remains O(nm), storage drops to O(m). Counts such as choosing 16 positions from 32 equal characters are already large; longer inputs can exceed JavaScript’s exact Number range. Use BigInt, a required modulus, or an arbitrary-precision language when extending the UI limits.']
 ],
 wildcard: [
  ['What are the two possible meanings of a star in wildcard DP?',
   'For full-string glob matching, * can represent no characters or consume one more text character. Therefore a star cell is true if the left cell is true, dropping the star, or if the cell above is true, using the same star for a longer text prefix. A literal or ? consumes exactly one character and uses the diagonal cell. Only a prefix consisting entirely of stars can match empty text.',
   'Pattern a*b matches ab by making * empty and axxxb by letting it consume xxx. Pattern a?b matches axb but not ab. These are glob rules: regex * instead repeats the preceding regex item.',
   'The lesson uses O(nm) time and space. It matches the entire text, not merely a substring. Regex punctuation such as . or brackets has no special meaning in this simplified wildcard implementation.'],
  ['Can you match simple ?/* wildcard patterns with constant extra space?',
   'A common greedy approach remembers the most recent star and the text position currently assigned to it. On a mismatch, extend that star’s coverage by one character and retry the pattern immediately after the star. Without a remembered star, the match fails. After consuming all text, only trailing stars may remain. This uses the fact that an unconstrained star can absorb additional characters without restricting what they are.',
   'For text axxb and pattern a*b, match a, remember *, and try b. Each failure grows the star’s coverage until b aligns with the final character. A question mark still consumes exactly one character.',
   'This basic retry implementation uses O(1) auxiliary state, but can take O(nm) worst-case time when a long suffix is retried repeatedly. Do not claim universal linear time without a stronger algorithm and proof. Character classes or other glob extensions need their own semantics.']
 ],
 minwindow: [
  ['Why must minimum-window search track required counts rather than just a set?',
   'A set only records whether a character appears, but the requirement may need multiple copies. Track how many required occurrences are still missing. Adding a character reduces missing only when its new count does not exceed the required count. Once missing is zero, shrink from the left; removing a character increases missing only if the window loses a required occurrence.',
   'For required AABC, window ABC is not valid because one A is missing. In ADOBECODEBANC with requirement ABC, repeated expansion and shrinking eventually finds BANC, whose length is smaller than earlier valid windows.',
   'Each boundary moves forward at most n times, giving O(n+m) time with expected constant-time map access. A window can contain extra irrelevant or surplus characters. For ties, this implementation retains the first minimum-length window found.'],
  ['How would you adapt minimum-window search to Unicode-aware positions or a streaming source?',
   'First define what a character means. The lesson uses Unicode code points, so convert text consistently before storing window indices; UTF-16 offsets differ for many emoji. Grapheme clusters require a separate segmentation layer. For a stream, retain window content or relevant-position data so the left boundary can advance and the best text can be recovered. Indices alone cannot reconstruct content that has already been discarded.',
   'In 🙂A🙂B with requirement AB, code-point positions differ from JavaScript string offsets because each 🙂 uses two UTF-16 units. A visually single accented grapheme may itself contain multiple code points and therefore changes counting semantics again.',
   'A streaming window can grow to O(n) in the worst case if a required character never arrives. Returning only the best length or boundaries has different storage needs from returning the full substring. State that output requirement before promising constant space.']
 ],
 anagrams: [
  ['Why can anagram detection use a fixed-size window and a missing count?',
   'An anagram must have exactly the pattern length and the same multiplicity of every character. Keep a window of that length, adding the right character and removing the oldest when necessary. Track missing required occurrences. At full width, missing=0 implies that every required occurrence is present; since total lengths are equal, no extra character can remain without displacing a required one.',
   'For cbaebabacd and abc, windows cba and bac have the required counts and start at 0 and 6. A window aab is not an abc anagram even though some letters overlap.',
   'Time is O(n+m) with expected constant-time count updates. Sorting each window instead costs repeated O(m log m) work. Duplicate pattern letters matter, and ordinary matching here includes overlapping anagram windows.'],
  ['How can fixed alphabets reduce space, and why are single numeric fingerprints insufficient?',
   'For a known alphabet, use a fixed count-difference array and maintain the number of nonzero entries. Each arriving or departing character updates one difference and may change that nonzero count. A full-width window is an anagram exactly when all differences are zero. Replacing the vector with a sum or XOR loses information because different multisets can share those fingerprints.',
   'Using letter values a=1,b=2,c=3, the multisets [a,c] and [b,b] both sum to 4 but are not anagrams. XOR also cancels even repetitions and therefore cannot represent arbitrary multiplicities exactly.',
   'A fixed alphabet of size σ gives O(σ) storage, independent of n; Unicode usually calls for a map or an explicit alphabet mapping. If the pattern is empty, this lesson returns all n+1 boundaries, which should be tested rather than inferred from a nonempty-window loop.']
 ],
 unique: [
  ['Why does the left boundary move until the newly added duplicate disappears?',
   'Before adding the next character, the current window contains no repeats. Only the new character can violate that invariant. Remove characters from the left until its count returns to one, then the whole window is valid again. Record the longest valid window after repair. Because the left edge never moves backward, discarded starts are never reconsidered.',
   'For abba, the second b forces removal of a and then the first b, leaving b. Adding the final a gives ba. Keeping only a single left-step adjustment would leave bb and violate the invariant.',
   'Each character is added once and removed at most once, so time is O(n) with expected constant-time counts. The count map can use O(n) space for an unrestricted alphabet. This is a continuous substring problem, not a subsequence problem.'],
  ['How does the last-seen-index method avoid repeated removals, and what is its common bug?',
   'Store the last index of each character. At index right, set left=max(left,lastSeen[character]+1), then update that character’s last index. The maximum is essential: an earlier occurrence outside the current window must not move left backward. The interval [left,right] remains the longest valid window ending at right, so checking its length is enough.',
   'For abba, the second b moves left to 2. When the final a arrives, its earlier index is 0. Setting left to 1 would incorrectly reopen a window containing bb; max(2,1) correctly keeps left at 2.',
   'Time is O(n), storage is proportional to distinct characters. Keep indices in the same unit used for extraction: code points, UTF-16 units, or grapheme clusters. Returning one chosen substring also requires a documented tie rule; this lesson keeps the first longest answer.']
 ]
});
