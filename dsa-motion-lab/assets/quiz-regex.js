Object.assign(QuizChoices,{
 rx_literal:[
  ['Escape regex metacharacters when input is meant literally; ordinary characters match themselves.','Every character in an editable pattern is automatically interpreted literally.','A dot always matches a literal period without escaping.','Grouping parentheses never change what text a regex recognizes.'],
  ['Unescaped input can inject regex structure and expensive ambiguity; distinguish literal search from a regex editor.','Escaping pattern input and grouping are unnecessary when concatenating user strings.','A worker timeout proves an arbitrary pattern has linear complexity.','Adding capturing parentheses cannot change existing group numbering.']
 ],
 rx_boundary:[
  ['A word boundary is a zero-width change between word and non-word classification, not a literal space.','A word boundary consumes exactly one whitespace character.','Digits and underscore are never word characters in JavaScript boundaries.','Boundaries guarantee language-aware word segmentation for every script.'],
  ['Define a Unicode boundary policy and use appropriate properties or segmentation, considering combining marks.','ASCII word boundaries already implement every natural language’s word rules.','Replacing letters by any Unicode property removes all need to define a token policy.','Python and JavaScript always use identical default word-boundary rules.']
 ],
 rx_case:[
  ['Case-insensitive matching changes comparison behavior while preserving original matched spelling and positions.','The i flag rewrites the original input into lowercase.','The i flag returns every match in uppercase.','Case-insensitive regex matching is always a locale-selectable collation algorithm.'],
  ['Preprocessing can alter representation or offsets; case folding, normalization, and identity policy are separate choices.','Lowercasing always preserves one-to-one character positions for all Unicode text.','The i flag automatically normalizes every canonically equivalent spelling.','A regex i flag supplies every security-sensitive identifier equality rule.']
 ],
 rx_class:[
  ['A character class selects one character from a set; quantifiers can repeat that selection.','[aeiou] means the literal five-character sequence aeiou.','A leading caret outside brackets negates an entire character class.','A dot inside a basic class necessarily has the same wildcard meaning as outside.'],
  ['Choose an explicit alphabet or Unicode policy, including marks and the desired character unit.','[A-Za-z] already covers all Unicode letters.','Any Unicode letter category automatically implements complete linguistic tokenization.','JavaScript and Python support all property escapes with identical syntax.']
 ],
 rx_negated:[
  ['Leading ^ inside brackets negates that set; the sample excludes ASCII letters, digits, and whitespace.','A negated ASCII class is a universal Unicode punctuation classifier.','The caret has the same meaning at every regex position.','Adding + changes which characters belong to the class rather than how many are consumed.'],
  ['Sanitization depends on the destination grammar; deletion is not a substitute for parsing or context-safe APIs.','Removing punctuation makes data safe to concatenate into every execution context.','Regex filtering and HTML encoding are interchangeable for all inputs.','Deleting characters can never join tokens into a different meaning.']
 ],
 rx_alternation:[
  ['Alternatives are tried in written order at a candidate start, so a complete short branch can win.','Alternation always chooses the longest branch regardless of order.','cat|catalog must return catalog because it contains more letters.','An anchor on one branch automatically applies to every ungrouped alternative.'],
  ['Factor or index literal alternatives carefully, preserving ordering and captures; large dictionaries may suit Aho–Corasick.','Reordering alternatives cannot change match spans or captures.','A larger backtracking alternative list always guarantees O(n) matching.','Literal alternatives need no escaping before being combined into regex syntax.']
 ],
 rx_repeat:[
  ['Bounds restrict repetition count; boundaries separately prevent accepting a short fragment inside a longer word.','A bounded letter rule automatically requires the whole token.','{3,5} applies to every previous character in the pattern, regardless of grouping.','A zero-minimum quantifier cannot produce an empty match.'],
  ['Finite bounds do not remove combinatorial ambiguity in nested or overlapping pattern choices.','Every finitely bounded regex has constant evaluation time independent of its bounds and input.','Adding bounds makes all near-miss inputs cheaper than successful inputs.','Only unbounded quantifiers can create many backtracking paths.']
 ],
 rx_lines:[
  ['m changes line-anchor behavior; s separately changes whether dot includes line terminators.','m makes dot match every newline without changing anchors.','s makes ^ match the start of every line.','Multiline mode rewrites every newline into a space before searching.'],
  ['Strict validation must consume the true entire input; ordinary anchors can have line or final-newline behavior.','A substring test with ^ and $ always rejects any trailing newline in every mode.','Trimming all input is always equivalent to strict full-input validation.','Any valid line inside a field proves the complete field is valid.']
 ],
 rx_greedy:[
  ['Greedy repetition tries large counts first but may backtrack to satisfy later requirements.','Greedy means the longest match anywhere in the text always wins over an earlier start.','A greedy quantifier never returns any consumed character.','Dot always includes line terminators even without s.'],
  ['Ambiguous nested repetition may explore many partitions when a later condition fails.','A fast accepted input proves all near-miss inputs are equally fast.','Nested repetition such as (a+)+ always has exactly one way to divide its a run.','A failed suffix eliminates all prior choices without backtracking.']
 ],
 rx_lazy:[
  ['Lazy repetition starts small and expands until the remainder can match.','Lazy repetition always stops after exactly one character.','Adding ? after a quantifier removes all following requirements.','Lazy and greedy forms must accept entirely disjoint sets of strings.'],
  ['Laziness changes exploration order, not necessarily the number of ambiguous paths or repeated scans.','Replacing every greedy quantifier by a lazy one guarantees linear time.','A lazy pattern is always an HTML parser with correct nesting.','Rejected inputs cannot cause expensive work in a lazy regex.']
 ],
 rx_lookahead:[
  ['Lookahead checks following context without consuming it, so the colon stays outside the label match.','Lookahead includes the asserted colon in every full match.','A zero-width assertion cannot ever capture text in a subgroup.','Lookahead moves the next search position past all asserted characters.'],
  ['Chained assertions constrain their current position; whole-field conditions need clear anchoring and complete consumption.','A lookahead at any later point automatically inspects already-consumed earlier text.','Several lookaheads always imply one linear pass with no rescanning.','A syntactic lookahead can establish every calendar or business-rule requirement.']
 ],
 rx_not_ahead:[
  ['The forbidden continuation is the exact word cat at that boundary, so catalog remains allowed.','(?!cat followed by a boundary) rejects every word containing cat anywhere.','Negative lookahead consumes the excluded word before matching the rest.','A leading boundary is irrelevant because scanning can never restart inside a word.'],
  ['A spelling blacklist does not parse a language or authorize an operation; use explicit grammar and semantic checks.','Rejecting one raw keyword prevents all equivalent interpreted meanings.','Regex keyword exclusion is a complete permission system.','A forbidden substring test can never reject an innocent larger identifier.']
 ],
 rx_lookbehind:[
  ['Lookbehind checks preceding context without including it in the full matched span.','Lookbehind consumes the prefix and always includes it in the output match.','A captured prefix and lookbehind always have identical global iteration behavior.','A dollar lookbehind automatically parses every currency format.'],
  ['Compile and test each target engine; lookbehind restrictions and Unicode behavior differ across JavaScript and Python re.','Every JavaScript lookbehind is accepted by Python re unchanged.','Replacing lookbehind with consuming context never changes adjacency behavior.','Variable-width lookbehind is supported identically by every regex engine.']
 ],
 rx_not_behind:[
  ['Boundaries prevent retrying inside a rejected digit run after the immediate-minus check fails.','The minus assertion alone prevents all suffix matches inside a number.','A word boundary deletes a minus from the input before checking digits.','The sample treats a separated minus and an adjacent minus identically.'],
  ['A numeric lexer and expression grammar are needed to distinguish unary signs, subtraction, and exponent signs.','The immediately preceding character always determines a minus operator’s full meaning.','The digit filter already parses scientific notation and all arithmetic expressions.','Every hyphen before any later digit must be a unary numeric sign.']
 ],
 rx_overlap:[
  ['Capture the payload inside zero-width lookahead and advance the next candidate so occurrences can overlap.','A consuming global match automatically restarts one character after its start.','Zero-width matches imply every capture must also be empty.','Overlap detection requires sorting the text characters first.'],
  ['After empty exec matches, explicitly advance by a whole code point and step past the final boundary to terminate.','Repeated exec always advances lastIndex after an empty match.','Advancing one UTF-16 unit is always a whole Unicode code point.','The empty pattern has no possible match boundaries.']
 ],
 rx_captures:[
  ['Captures allocate numbered fields; noncapturing groups preserve structure without shifting those field numbers.','All parentheses are noncapturing unless the matched text is numeric.','An unmatched optional capture is always the same as a participating empty capture.','Adding an outer capture cannot affect later numbered replacements.'],
  ['A date-shape regex extracts fields but calendar validity requires additional semantic checks.','Four year digits and two month/day digits prove the date exists.','Reformatting a matched date automatically checks leap years.','A parser that silently rolls invalid components forward always validates the original date.']
 ],
 rx_backref:[
  ['A backreference repeats captured content, unlike independently repeating the rule that captured it.','Two separate letter-run groups guarantee their words are equal.','A backreference reruns the capture’s pattern and may accept unrelated content.','A repeated capture always reports a list of every iteration by default.'],
  ['Backreferences can express dependencies beyond ordinary finite automata, so linear-engine guarantees may not apply.','All linear-time regex engines support unrestricted backreferences with the same guarantees.','Captured text length is irrelevant to every backreference comparison.','Backreferences eliminate ambiguous choices from surrounding repetitions.']
 ],
 rx_integer:[
  ['The rule extracts optional-sign digit fragments; it does not validate a complete numeric field or range.','A signed digit run proves the entire surrounding field is an integer.','The rule automatically recognizes decimal points and exponent notation as part of one integer.','Matching integer spelling guarantees it fits any chosen integer type.'],
  ['Preserve strings or choose sufficient precision; Number conversion can round large integers and discard formatting.','Every arbitrarily long decimal integer is exactly representable as JavaScript Number.','Leading zeros can never be meaningful because the token contains only digits.','A length bound alone proves every accepted numeric value fits a safe integer range.']
 ],
 rx_decimal:[
  ['Trying the decimal branch before the integer branch avoids accepting only the leading integer part.','Alternation always prefers the longest decimal branch even when the integer branch is first.','An unescaped dot requires a literal decimal separator.','The sample automatically accepts exponents and every locale-specific number format.'],
  ['Define grammar and rounding requirements, then choose exact scaled integers or suitable decimal representation if needed.','Successful decimal extraction guarantees exact binary floating-point representation.','Treating exponent pieces as unrelated integer tokens preserves their numeric meaning.','Comma and dot can always be accepted interchangeably without a locale policy.']
 ],
 rx_email:[
  ['The sample recognizes a practical address-like subset, not all email syntax, deliverability, or ownership.','Any matched email-shaped token proves its mailbox exists.','The sample validates every domain-label restriction and all email-standard address forms.','Adding more regex alternatives alone can verify the user controls the address.'],
  ['Separate candidate extraction, parsing, and explicitly documented normalization/identity rules.','Dots and plus tags can be removed from every provider’s address without changing identity.','Domain and local-part normalization rules are necessarily identical.','Preserving original spelling is never useful once a regex has matched.']
 ],
 rx_url:[
  ['A broad URL token may include prose punctuation or malformed components; parse and apply an explicit trimming policy.','The token rule proves the host is well formed and reachable.','Removing every trailing punctuation symbol can never alter a real URL.','An http prefix determines all path and query semantics.'],
  ['Fetching needs parsed-destination and redirect policies; recognizing an http-shaped token is not authorization.','Any extracted http URL is safe for a server to fetch.','A public-looking initial hostname guarantees every redirect stays public.','Regex token shape establishes the resolved network destination.']
 ],
 rx_words:[
  ['The optional noncapturing group allows one internal apostrophe plus letters without adding an extraction field.','The rule is a complete multilingual word segmenter.','An optional apostrophe permits a standalone apostrophe as a complete token.','A noncapturing group makes the whole token optional.'],
  ['Choose language-aware segmentation or a formal lexer according to the input grammar and token policy.','One ASCII letter-run regex parses quoted source strings and every natural language.','Programming tokens and linguistic words always share identical boundaries.','A lexer’s token precedence and state cannot affect output.']
 ],
 rx_ipv4:[
  ['Range-specific octet alternatives allow 0–255, reject leading zeros, and repeat exactly four dotted components.','Any one-to-three digit component is a valid IPv4 octet.','The sample allows 256 and every three-digit value.','Matching the dotted shape proves address reachability.'],
  ['Parsing four components can make range and spelling checks clearer, but accepted syntax and network policy remain separate.','Every address parser rejects all noncanonical spellings by definition.','An IPv4 regex is also a complete IPv6 validator.','Leading-zero policy never matters once a component can be converted to a number.']
 ],
 rx_time:[
  ['The hour branches allow 00–23 and minute classes allow 00–59, with exact full-input HH:MM matching.','Any two hour digits and two minute digits represent valid 24-hour time.','The recipe accepts 24:00 and missing leading zeros by default.','A valid prefix allows arbitrary trailing fields or a newline.'],
  ['A clock value still needs date, zone, and scheduling semantics to identify an instant.','A valid HH:MM string uniquely identifies a global timestamp.','Local clock times can never be ambiguous or nonexistent.','Recurring local time and one absolute instant are always the same scheduling requirement.']
 ],
 rx_identifier:[
  ['The first class excludes digits; the repeating second class allows them after the first character.','Using one repeated class containing digits also forbids digits at the start.','The sample automatically rejects every reserved keyword in every language.','Every Unicode identifier policy is identical to this ASCII rule.'],
  ['Unicode syntax, normalization, identity, and confusable-display policies require separate explicit decisions.','Allowing Unicode letters automatically prevents visually confusable identifiers.','Normalizing after a name becomes a key can never affect identity.','A single letter-category regex supplies all language identifier rules.']
 ],
 rx_password:[
  ['The sample requires length 8–32, upper/lowercase and a digit; symbols are permitted but not required.','The sample necessarily requires at least one symbol.','An allowed-character class by itself requires every listed character category.','The password pattern proves cryptographic strength.'],
  ['Composition is a format rule, separate from predictability, secure storage, and authentication controls.','Passing case/digit checks establishes a secret is hard to guess.','A regex can replace password hashing and account verification controls.','Every long generated secret is weak if it lacks one listed category.']
 ],
 rx_split:[
  ['Split returns slices between delimiter matches, preserving specified edge empty pieces.','Split returns only the matched delimiter characters.','A quantified delimiter must generate an empty piece for every character inside its one matched run.','The app always inserts captured delimiters into split output.'],
  ['Quoted or nested formats need their grammar and state handled by an appropriate parser.','Splitting every comma correctly parses any CSV row.','Quotes cannot change whether a comma is data or a delimiter.','A simple delimiter class automatically handles doubled quote escapes and nested structure.']
 ],
 rx_space:[
  ['Each whitespace run becomes one space, so edge runs become spaces unless trimming is separately requested.','Replacing runs with one space automatically removes leading and trailing whitespace.','The rule preserves every newline because whitespace excludes line breaks.','A whitespace-only input necessarily becomes an empty string.'],
  ['Whitespace may carry structural meaning; normalize only according to the containing format’s rules.','Global whitespace collapse cannot change quoted data or indentation meaning.','Flattening newlines never merges records.','Horizontal collapse, line-ending conversion, and trimming are identical operations.']
 ],
 rx_mask:[
  ['A one-digit match receives one replacement; a quantified digit run receives one fixed replacement for the whole run.','A fixed replacement automatically repeats to match the span length.','[0-9]+ with replacement # preserves the count of every original digit.','ASCII digit matching automatically includes every Unicode numeric symbol.'],
  ['Masking can still leak context, length, and unmasked data elsewhere; redaction needs a defined data-flow policy.','Changing visible digits guarantees the underlying data has been erased everywhere.','A digit-only mask removes every sensitive alphanumeric identifier.','Preserving the visible length can never reveal information.']
 ],
 rx_reorder:[
  ['Groups store year/month/day; $3/$2/$1 copies them in day/month/year order while preserving surrounding text.','The replacement parses calendar dates and rejects all impossible days.','Capture replacement converts fields to numbers and always removes leading zeros.','The same numbered-replacement syntax is native and identical in every language.'],
  ['Specify optional/missing groups, literal dollars, reference width, and whether replacement text is literal or a template.','Every nonexistent group reference must behave identically across all APIs.','Escaping a pattern automatically makes replacement text literal.','This app expands every JavaScript replacement feature, including named references and $&.']
 ]
});
