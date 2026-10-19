Object.assign(InterviewBank, {
 rx_literal: [
  ['When does a regex pattern mean literal text, and which characters must be escaped?',
   'Ordinary characters such as the letters in cat match themselves. Regex metacharacters instead describe matching rules: a dot means a character, brackets introduce a class, and parentheses group expressions. To search for literal user-provided text, escape regex metacharacters rather than inserting the text directly as pattern syntax. The lesson’s pattern input intentionally accepts regex syntax, so escaping is a separate requirement when building a literal-search feature.',
   'An unescaped a.b matches a-b as well as a.b. Type a\\.b in this app’s pattern field to require a literal dot. In an ordinary JavaScript string literal, that regex backslash needs another backslash, so the source string contains two backslashes.',
   'Use a tested regex-escaping API when available, or a carefully tested equivalent. For exact substring search without regex features, a direct string-search API is simpler and avoids interpreting user text as executable pattern structure.'],
  ['Why can wrapping user text inside a larger regex change both correctness and runtime?',
   'Unescaped user text can inject alternation, assertions, or nested quantifiers into the surrounding expression. Parentheses used only for precedence should be noncapturing so existing group numbers do not shift. Escaping solves literal-pattern interpretation, but not a deliberate regex editor’s performance risks. A worker timeout is a responsiveness measure for the editor, not a substitute for defining how a production search API treats input.',
   'Building prefix + userText + suffix with userText equal to a|b creates two alternatives unless grouping and escaping are handled appropriately. A user string such as (a+)+ can also introduce expensive backtracking if interpreted as regex syntax.',
   'Separate the requirements: literal search, trusted predefined regex, or arbitrary editable regex. They need different input handling and performance guarantees. The app implements the last case in a terminable worker and shows match spans, not internal execution states.']
 ],
 rx_boundary: [
  ['What does a word boundary test, and why does it not consume a character?',
   'A word boundary succeeds at a position where the character classification changes between word and non-word, including appropriate text edges. It does not match the adjacent letters or separator itself. Therefore placing boundaries around cat excludes scatter and cats while still allowing punctuation next to the word. A boundary is not simply a literal space check.',
   'Type \\bcat\\b in the app’s pattern field. It matches cat in cat! and (cat), but not in cat2 or _cat because digits and underscore are word characters. In an ordinary JavaScript string literal, each regex backslash must itself be escaped.',
   'JavaScript word characters are primarily ASCII letters, digits, and underscore, with additional case-folding behavior under appropriate flags. Natural-language word segmentation is a different task; do not assume \\b implements dictionary word boundaries for every script.'],
  ['How would you define whole words for Unicode text rather than relying on \\b?',
   'First define the application’s boundary policy: letters only, letters and combining marks, identifiers, or linguistic words. Explicit lookarounds using suitable Unicode property classes can express some policies, while a segmentation API can handle language-aware word boundaries more appropriately. Combining marks must be considered or an accented grapheme may be split unexpectedly. The pattern and the indexing unit should be documented independently.',
   'For a policy that treats Unicode letters as word content, the positions around cat in écat differ from an ASCII-oriented boundary policy. A combining accent after a base letter is another case where a simplistic class may disagree with visible words.',
   'A more Unicode-aware class is not automatically a complete language tokenizer. JavaScript and Python have different default word-class behavior, so cross-language tests should include accented letters, combining marks, underscores, digits, and the intended scripts.']
 ],
 rx_case: [
  ['Does case-insensitive matching modify the original text or matched output?',
   'No. The i flag changes which characters are considered equivalent during matching; it does not rewrite the input. A match therefore preserves the original spelling and span. This matters when displaying highlights, extracting records, or applying replacements that need the user’s original capitalization. Lowercasing both strings is a different implementation choice with its own indexing consequences.',
   'Searching cat with i in Cat cat CAT cAt returns the four original spellings. Without i, only the exactly lowercase cat matches. The start and end positions still refer to the original text.',
   'The flag applies to the compiled expression, including backreference comparisons in relevant engines. It is not a locale-selectable collation algorithm. Case-insensitive behavior should be tested against the actual JavaScript flags used by the app.'],
  ['Why can lowercasing strings before searching be unsafe for Unicode offsets or identity rules?',
   'Unicode case transformations and case-folding rules are not equivalent to a universal one-character substitution. Some transformations change length or interact with locale-specific expectations. Searching a transformed copy can therefore yield positions that do not map directly to the original text. Unicode case equivalence also differs from normalization: visually similar composed and decomposed sequences may still be different strings.',
   'A user-visible accented character may be represented as one code point or a base plus a combining mark. An i flag alone does not make every canonically equivalent representation identical, and locale-sensitive letters require an explicitly chosen policy.',
   'For search, preserve a mapping if preprocessing changes the representation. For identifiers or security-sensitive equality, define normalization and comparison rules rather than assuming regex i supplies them. Python and JavaScript case-insensitive matching are not interchangeable for every Unicode character.']
 ],
 rx_class: [
  ['How does a character class differ from alternation or a literal string?',
   'A character class selects one character from a set at the current position. [aeiou] means one of those vowels, not the five-letter sequence aeiou. Add a quantifier to collect runs. Inside classes, several symbols have different roles: a leading caret negates, a hyphen may define a range, and a dot is usually literal rather than a wildcard. Escaping rules depend on this context.',
   'In education, [aeiou] produces separate vowel matches. [aeiou]+ combines consecutive vowels such as io into one match. The alternative expression a|e|i|o|u has similar one-character choices but is a different grouping construct.',
   'The lesson’s vowel set describes these Latin characters only. The i flag includes case variants but does not turn the set into a linguistic definition of all vowels or automatically include accented forms.'],
  ['How should you design a character classifier when the input alphabet is not known in advance?',
   'Choose a policy rather than expanding an ASCII range by guesswork. Unicode property escapes can classify broad categories such as letters in JavaScript Unicode mode, while script-specific rules or a tokenizer may be needed for an application’s definition. Consider combining marks and whether matching is meant to operate on code points or grapheme clusters. A negated or incomplete ASCII class can otherwise misclassify valid text.',
   'The class [A-Za-z] excludes é, Greek letters, and many other letters. Replacing it with a Unicode-letter category broadens coverage, but a decomposed accent mark may require a separate mark category to keep a visible word intact.',
   'Property support and syntax vary by regex engine. The app always uses JavaScript Unicode mode; the provided Python re examples do not support every JavaScript property escape. For a fixed small alphabet, an explicit set can be clearer and easier to audit.']
 ],
 rx_negated: [
  ['Where does ^ mean negation, and what does the lesson’s excluded-character rule actually allow?',
   'A caret negates a bracket class only in its special leading position inside that class. Outside a class it is normally a start anchor. The pattern [^A-Za-z0-9\\s]+ matches one or more characters that are neither ASCII letters, digits, nor whitespace. This is an explicit allowed-character policy; it should not be described as a universal punctuation classifier.',
   'Hello, world! #42 produces comma, exclamation mark, and # runs. The letter é also falls outside the listed ASCII letter ranges, so it can be matched as disallowed even though it is a letter in ordinary language.',
   'Adding + groups consecutive excluded characters into one span. Removing + gives individual characters. Whitespace is retained by this rule, so using the pattern to remove all unsafe content would leave a broad range of unexamined structure.'],
  ['Why is removing characters with a negated regex not a general sanitization strategy?',
   'Safety depends on where the resulting value will be used. HTML, SQL, shell arguments, URLs, and application identifiers have different grammars and escaping rules. Deleting a few character classes may miss dangerous constructs, break legitimate Unicode input, or join previously separated tokens into a new meaning. Validation and context-specific encoding solve different problems and should not be conflated.',
   'Deleting punctuation from two tokens can merge them. Allowing angle brackets for one use would be unacceptable in another, while removing them still does not make arbitrary data safe to concatenate into a query or command.',
   'Use a narrowly specified allowlist for a field when appropriate, and use the destination’s safe APIs or encoders. For display, this app escapes match content before inserting it into HTML instead of treating regex filtering as an HTML safety boundary.']
 ],
 rx_alternation: [
  ['Why does cat|catalog often return cat when the text begins with catalog?',
   'A backtracking regex engine tries alternatives in their written order at the same candidate position. If the first branch completes the whole surrounding pattern, the engine can return it without checking whether a later branch would consume more characters. Alternation therefore does not automatically mean longest match. Grouping determines which surrounding requirements apply to all alternatives.',
   'cat|catalog on catalog accepts cat. catalog|cat tries the longer branch first. A full-input check around cat|catalog may backtrack from the short branch when the required end is not reached, allowing catalog instead.',
   'If whole tokens are required, apply boundaries to a grouped alternative such as a noncapturing group. Writing a start anchor only before the first branch and an end anchor only after the second does not anchor both branches.'],
  ['How can a large alternative list be optimized without changing precedence semantics?',
   'Factor common prefixes or construct a trie-like regex so shared beginnings are checked once where possible. Escape each literal before combining it, and use noncapturing groups for structure. However, ordering and branch-specific captures may be observable, so regrouping should be validated against required outputs. For a large dictionary with all occurrences required, Aho–Corasick can provide a clearer explicit multi-pattern algorithm.',
   'Literal alternatives cat, car, and care can share ca as a prefix, but car before care still affects which match is accepted without a suffix requirement. A longest-token policy must be specified rather than inferred from factoring.',
   'Large backtracking expressions can have significant compile and search costs; there is no universal O(n) guarantee for an arbitrary alternation. Benchmark the intended workload and preserve capture numbering or migrate callers to a documented field mapping.']
 ],
 rx_repeat: [
  ['Why do boundaries matter when matching words of length 3 through 5?',
   'The quantifier {3,5} restricts how many copies of the preceding character rule can be consumed, but it does not by itself require a whole token. Without boundaries, the engine can match a 3–5 letter fragment inside a longer word. Boundaries add a separate condition that the match begins and ends at transitions between word and non-word positions.',
   'In elephant, [A-Za-z]{3,5} can match eleph. With boundaries at both ends, the default rule rejects the whole long word instead of accepting that prefix. cat, bird, and horse satisfy the 3–5 rule.',
   'Bounds belong to the immediately preceding item or group. A bound of {0,5} permits an empty match, which changes iteration behavior. ASCII word classes and underscore/digit boundaries should be considered when the input is not simple alphabetic words.'],
  ['Does bounding every quantifier guarantee that a pattern is inexpensive?',
   'Finite bounds limit possible consumed lengths but do not eliminate combinatorial ambiguity. Nested or overlapping quantified alternatives can still offer many ways to divide the same characters, particularly when a required suffix fails. Input bounds and pattern bounds reduce exposure, but a useful complexity argument must examine how many paths can be reconsidered, not just whether the language is finite.',
   'A pattern containing many adjacent optional copies of a followed by the same number of required a characters can create numerous choices about which optional copies consume input. A near-miss may force a backtracking engine to revisit many combinations.',
   'Prefer deterministic structure with clearly separated tokens, avoid unnecessary overlapping alternatives, and consider a linear-time engine when its feature set suffices. The app’s timeout bounds waiting for a worker; it does not prove a particular regex has a good asymptotic bound.']
 ],
 rx_lines: [
  ['What does multiline mode change, and what does it leave unchanged?',
   'The m flag changes how start and end anchors recognize line boundaries. It does not make dot match line terminators; that is the separate s flag. This lesson uses a start anchor followed by an uppercase ASCII letter, then a negated newline class to consume the rest of the selected line. Excluding both carriage return and line feed handles common CRLF input without capturing its terminators.',
   'For Alpha, beta, Gamma, and 42 on separate lines, ^[A-Z][^\\r\\n]* with m selects Alpha and Gamma. Without m, only the very beginning of the complete text is a candidate start.',
   'Line-based extraction is different from validating the entire input. JavaScript recognizes additional line terminators in anchor behavior, while the explicit class in this recipe excludes only CR and LF; broaden it if that distinction matters.'],
  ['Why can ^...$ be insufficient for strict full-input validation?',
   'With multiline mode, anchors can succeed at individual line boundaries. Even without m, end-anchor rules in common regex engines can allow a position before a final line terminator. A strict validator must require that the match actually consumes the entire original input. The app’s validation mode uses a start-at-zero match with a true-end assertion, rather than assuming a substring test with anchors is enough.',
   'A line containing 23:59 followed by a newline should fail the app’s exact HH:MM validator. A naive anchored search may still succeed before that newline, or may accept one valid line inside a larger multiline input.',
   'Do not trim input silently unless trimming is part of the field specification. In Python use an appropriate fullmatch operation; in JavaScript define true-end semantics explicitly. Extraction and validation should have different APIs and tests.']
 ],
 rx_greedy: [
  ['Does greedy mean a regex always returns the longest possible match anywhere in the text?',
   'No. Greedy describes how a quantifier tries repetition counts within a candidate match: it initially takes as much as possible, then may give characters back so later requirements succeed. The engine still normally searches for the leftmost successful start, and alternation order can affect which branch wins. These are separate choices from greedy repetition.',
   'On <b>one</b><i>two</i>, <.*> begins at the first < and can consume through the last >, producing one long match. If a required suffix follows the quantifier, the engine may shorten that consumption to satisfy the suffix.',
   'Dot excludes line terminators unless s is enabled. Greedy matching over delimiters does not understand nesting or markup structure, so the example should not be used as a general HTML parser.'],
  ['Why can nested greedy repetition cause catastrophic backtracking on a near-miss?',
   'When several repetitions can consume the same characters, the engine may explore many partitions of that input after a later requirement fails. Nested repetition such as (a+)+ creates many equivalent ways to divide an a run into groups. A failing end condition forces the engine to reconsider those divisions. A successful example can look fast while a similar rejected input is dramatically slower.',
   'The pattern (a+)+$ may accept a long all-a string quickly, yet take far longer when the same string ends with !. That final mismatch exposes the many partitions tried before failure.',
   'Remove redundant nesting when it preserves the intended language, use an engine with suitable guarantees where possible, and test rejected as well as accepted inputs. The app runs such patterns in a disposable worker and terminates jobs exceeding 1.5 seconds.']
 ],
 rx_lazy: [
  ['How does a lazy quantifier decide where to stop?',
   'A lazy quantifier tries the smallest repetition count first, then expands until the rest of the pattern can match. It is not an unconditional stop at the next character; the following requirements still control success. Adding ? after a quantifier changes its preference, whereas a standalone ? quantifier makes the preceding item optional.',
   'For <b>one</b>, <.*?> first tries an empty interior, then b, reaching the first usable > and matching <b>. Later global matches find </b>. If the pattern required additional text after >, a candidate closing bracket might need to be skipped.',
   'The lazy and greedy forms may describe the same set of accepted strings while returning different spans. Use a delimiter-aware class when it expresses the intended token more precisely than an unrestricted dot.'],
  ['Why does replacing greedy quantifiers with lazy ones not generally fix ReDoS?',
   'Laziness changes the order in which repetition counts are tried, not necessarily the number of possibilities. Ambiguous nested repetitions or alternatives may still have exponentially many paths, especially on rejected input. A lazy pattern can also repeatedly scan long suffixes from many candidate starts. Correctness and runtime depend on the entire expression, not on one added question mark.',
   'Making the inner repetition of an ambiguous nested pattern lazy still leaves many ways to assign characters to its groups. A missing final delimiter can force the engine to explore far more than the short successful examples suggest.',
   'Analyze ambiguity, limit the accepted grammar, and choose an explicit parser for nested structures. Worker termination protects UI responsiveness but can discard a computation rather than finish it; it does not convert the pattern into a linear-time algorithm.']
 ],
 rx_lookahead: [
  ['Why is the colon absent from a positive-lookahead match?',
   'A lookahead checks a condition at the current position without advancing the match endpoint. The consuming letter rule matches the label, and (?=:) only verifies that the next character is a colon. Assertions can constrain context while leaving that context available for later matching or unchanged output. They do not themselves add characters to the full match.',
   'In name: Saikat age: 25, the matches are name and age. Their spans end just before the colons. Changing the pattern to consume a literal colon would instead include it in each full match.',
   'A capture inside a successful positive lookahead may still appear in the captured-group output even though the assertion consumes nothing. Distinguish full-match length from captured substring length.'],
  ['How do chained lookaheads combine constraints, and where must they be placed?',
   'Several lookaheads at the same position act like independent requirements: every assertion must succeed before the consuming part can continue. Their position matters because each checks from the engine’s current point. If a constraint is meant to describe the whole field, assert it at a clearly defined start and pair it with full-input consumption. Assertions embedded later in the pattern inspect only the remaining context.',
   'A rule beginning with lookaheads for a digit and an uppercase letter can require both somewhere ahead, then consume an allowed-character sequence. Moving one lookahead after several consumed characters would stop it from considering characters already passed.',
   'Multiple lookaheads can rescan the same text and need not be a single-pass solution. Keep each constraint understandable and test where it applies. A semantic requirement such as calendar validity is usually clearer in ordinary validation code.']
 ],
 rx_not_ahead: [
  ['Why does the default negative-lookahead rule allow catalog while rejecting cat?',
   'The assertion (?!cat\\b) rejects a candidate start only when cat followed by a word boundary begins there. catalog has no boundary after its first three letters, so the forbidden continuation does not match and the assertion succeeds. The surrounding word-boundary and letter rules then consume the whole allowed word. This excludes an exact keyword, not every word containing those letters.',
   'In cat dog catalog bird, cat is rejected, while dog, catalog, and bird match. Removing the boundary from the assertion would also reject catalog because it begins with cat.',
   'A negative lookahead consumes nothing. If the main pattern can restart inside a word, a misplaced assertion may reject only one starting position and still allow an unwanted suffix. The leading boundary prevents that behavior here.'],
  ['Why is a negative keyword assertion not a substitute for parsing or authorization?',
   'The assertion checks text spelling and context at a regex position. It does not understand comments, escaping, encodings, semantic aliases, or an application’s execution rules. A blacklist can miss equivalent representations and can also reject innocent text. For an exact allowed field, prefer a positive grammar plus semantic validation; for permissions, check the actual operation and principal rather than a string fragment.',
   'Rejecting a word in raw source does not prevent an interpreter from constructing the same meaning through another representation. Conversely, forbidding a substring can reject a longer harmless identifier that merely contains those letters.',
   'For interview discussion, explain exactly what the assertion excludes and where matching may restart. Avoid claiming that successful text filtering proves an input safe in an unrelated language or execution context.']
 ],
 rx_lookbehind: [
  ['How does positive lookbehind differ from consuming a prefix in a capture group?',
   'Positive lookbehind requires context immediately before the current position while leaving it outside the full match. A consuming prefix instead advances through those characters and makes them part of the full span unless callers manually select a subgroup. Both approaches can extract the same payload, but their full-match positions and behavior during global iteration differ.',
   'In Costs $12.50, (?<=\\$)[0-9]+(?:\\.[0-9]{2})? matches 12.50 beginning after $. A pattern consuming \\$ would include the dollar sign in the full match, even if a separate group captured only the number.',
   'The example’s fixed dollar prefix is simple to reason about. The amount grammar is intentionally limited; it does not accept every currency notation, thousands separator, or decimal precision.'],
  ['Why should lookbehind patterns be reviewed separately when porting between JavaScript and Python?',
   'Regex engines differ in which lookbehind lengths and internal constructs they allow. JavaScript may accept lookbehind forms that Python’s built-in re rejects because re generally requires fixed-length lookbehind. Even where both compile, Unicode matching and captures can differ. A portable extraction rule may be clearer as a consumed context group plus a selected payload group, provided its global-match semantics are checked.',
   'A one-character dollar lookbehind is fixed length and works in the supplied examples. Replacing it with a variably repeated whitespace prefix can introduce a portability problem rather than simply broadening the same rule.',
   'Compile patterns in every target engine and test full spans as well as captured values. Replacing lookbehind with consuming context can miss adjacent occurrences if consuming shared context prevents the next global match from starting where needed.']
 ],
 rx_not_behind: [
  ['Why are word boundaries needed in addition to the negative-minus assertion?',
   'The negative lookbehind checks only the character immediately before a candidate number start. Without a boundary, failing at the first digit of -34 could let the engine restart at the second digit, whose preceding character is 3 rather than -. A leading word boundary prevents starting in the middle of the digit run. The final boundary also requires the matched digit token to end appropriately.',
   'For 12 -34 56 -78, the default rule returns 12 and 56. A weaker rule consisting only of negative-minus lookbehind followed by digits can accidentally extract 4 from -34 after the first start fails.',
   'The condition is immediate context: - 34 is treated differently from -34 because the space, not the minus, precedes the digits. Token policy must be explicit rather than described as complete numeric parsing.'],
  ['How would you distinguish a negative literal from subtraction in an expression?',
   'That distinction requires lexical or grammatical context. A minus may be a unary sign, a binary subtraction operator, part of an exponent, or simply punctuation. An immediate negative lookbehind cannot decide those meanings by itself. Tokenize the expression with a defined numeric grammar and operator tokens, then let a parser determine whether a minus is unary or binary.',
   'In 5-34, the characters -34 may represent subtraction from 5 rather than a separately signed literal. In 1e-3, the minus belongs to the exponent under a scientific-number grammar. The lesson’s digit-token filter handles neither expression grammar.',
   'A small context filter is useful when its input format guarantees the surrounding meaning. For general expressions, explicit tokens and parsing are easier to validate than extending a growing collection of lookarounds.']
 ],
 rx_overlap: [
  ['How can a regex report overlapping occurrences when global matches normally do not overlap?',
   'Wrap the desired payload in a capturing positive lookahead. The assertion succeeds without consuming the payload, making the full match empty at its start. Advancing the search by one position after an empty match permits another candidate inside the previously captured text. The actual occurrence is then read from the capture group rather than from the zero-length full match.',
   'For banana and (?=(ana)), the full-match spans are [1,1) and [3,3), while group 1 contains ana in both. A normal consuming ana search would take the first occurrence and resume too late for the second.',
   'The app reports code-point boundaries and advances empty matches by a full code point. Empty full-match length does not imply that the captured payload is empty, and highlighting must distinguish these two concepts.'],
  ['Why must an exec-based scanner explicitly advance after a zero-width match?',
   'JavaScript RegExp.exec can return an empty global match without moving lastIndex forward. Repeating exec unchanged can therefore return the same result forever. After an empty match, advance by one code point under Unicode mode, or one unit according to the chosen matching convention. At the final boundary, advance past the end so the next call terminates.',
   'An empty pattern on 🙂a has code-point boundaries 0,1,2. Advancing one UTF-16 unit from the emoji’s start would land inside its surrogate pair, conflicting with Unicode-mode iteration. The lesson advances the entire emoji instead.',
   'Different high-level iteration APIs may implement their own empty-match progress rules. The app and its Python helper use an explicit convention: one emitted empty match per visited boundary, then advance. Test empty input and end-of-input assertions as well as overlapping words.']
 ],
 rx_captures: [
  ['How do capturing and noncapturing parentheses affect extracted fields?',
   'Capturing parentheses store the matched text in numbered groups according to opening-parenthesis order. Noncapturing groups, written with ?: after the opening parenthesis, control precedence without allocating a numbered field. Adding an ordinary structural group can shift every later group number and silently break extraction or replacement code. Optional groups that do not participate are distinct from groups that match an empty string.',
   'The date-shaped rule captures 2026, 10, and 18 as groups 1–3 from 2026-10-18. Wrapping the entire rule in an additional capture would make that full date group 1 and shift the three fields to 2–4.',
   'The app shows a missing optional capture as null. Its replacement convention turns a missing existing group into empty text. Use named fields where the target engine and application support them, or carefully document numbered positions.'],
  ['Why is a date-shaped regex not a calendar validator?',
   'Fixed digit counts and separators prove only that the spelling follows a shape. Month ranges, day ranges dependent on the month, leap years, and supported calendar systems are semantic rules. A regex can encode some of these constraints, but the expression becomes harder to inspect and maintain. Extract the fields, parse them as numbers, and validate against an appropriate calendar representation.',
   '2026-99-99 matches the lesson’s shape even though it is not a calendar date. 2025-02-29 needs a leap-year check that cannot be inferred merely from its two-digit month and day fields.',
   'When using a date library, reject normalization that silently rolls invalid dates into a different month; confirm the parsed components match the input. Reformatting captured strings should not be advertised as validating the represented date.']
 ],
 rx_backref: [
  ['How is a backreference different from repeating a character rule?',
   'A backreference requires the exact text previously captured, subject to the expression’s matching flags. Repeating [A-Za-z]+ merely requires another word-shaped run and does not relate its value to the first. The repeated-word recipe captures one word, consumes whitespace, then uses group 1 again. Word boundaries prevent accepting only a matching prefix of the second word.',
   'For go go stop now now, the rule matches go go and now now. A pattern containing two independent letter runs would also accept go stop. With i, differently cased spellings may satisfy the backreference comparison while the original captures retain their spelling.',
   'Only the captured value is reused, not the pattern that produced it. When a capturing group itself repeats, the reported capture typically represents its final participating iteration rather than a list of every iteration.'],
  ['Why do backreferences change what performance guarantees a regex engine can offer?',
   'A backreference can require equality with a previously captured string of unbounded length, which goes beyond the capabilities of ordinary finite automata for general patterns. Engines promising linear-time matching often restrict or omit backreferences. Backtracking engines may support them but can face large search spaces when captures and repetitions admit many candidate assignments.',
   'A pattern that captures an arbitrary prefix and later requires it again must remember the captured content, not just a finite classification state. Ambiguous ways of choosing that prefix can multiply the work on a failing input.',
   'For adjacent repeated words, tokenizing and comparing neighboring normalized tokens is an alternative with more explicit semantics. Do not assume a performance claim for regular-expression automata applies unchanged to an engine feature set containing arbitrary backreferences.']
 ],
 rx_integer: [
  ['What does an optional sign plus a digit run guarantee, and what does it not?',
   '[+-]? allows zero or one sign, and [0-9]+ requires at least one ASCII digit. This extracts integer-shaped fragments wherever they occur. It does not require a whole field, check numeric range, exclude digits embedded in identifiers, or understand decimal points and exponents. Extraction deliberately has weaker semantics than validating one complete integer input.',
   'Values -12, +7, and 42 produce those three strings. The same rule can extract 12 and 50 from 12.50, because the dot ends the first digit run and another run begins afterward.',
   'Use full-input validation when the entire field must be an integer. Add token-context rules only after defining the input grammar. Preserve the extracted string until the required numeric range and representation are known.'],
  ['Why can converting every extracted integer to JavaScript Number lose information?',
   'Number represents integers exactly only within its safe integer range. A longer digit string may be rounded even though the regex extraction is exact. Leading zeros and an explicit plus sign may also be meaningful formatting information that numeric conversion discards. BigInt supports exact integers but has different serialization and arithmetic rules; keeping a string may be best for identifiers.',
   'An account-like value with leading zeros must not be rewritten merely because it contains digits. A sufficiently long integer token can compare equal to a neighboring mathematical integer after Number rounding, despite having a different original spelling.',
   'Validate range before relying on numeric arithmetic, choose BigInt when appropriate, and separate numbers used for calculation from digit strings used as identifiers. Regex length constraints alone do not establish that every accepted value is safely representable.']
 ],
 rx_decimal: [
  ['Why is the decimal branch placed before the integer branch?',
   'Alternatives are tried in order at a candidate position. If the integer branch comes first, it can succeed on the leading digits before the engine attempts a longer decimal branch. Placing the decimal form first lets it consume both digit runs and their literal dot when possible, with the integer branch as a fallback. The optional sign applies to the entire noncapturing alternative group.',
   'For 12.50, the intended decimal-first rule returns one token 12.50. An integer-first alternative may return 12 and later 50 during global scanning. Escaping the dot is essential: an unescaped dot would also accept 12x50.',
   'This recipe omits exponents, a leading-dot form such as .5, trailing-dot forms, and locale-specific separators. Those omissions should be documented rather than treated as accidental failures.'],
  ['How would you design reliable decimal parsing for money or scientific input?',
   'Define the grammar first: optional sign, integer and fraction rules, exponent policy, separators, and permitted whitespace. After extracting or validating the spelling, choose a representation that preserves the needed arithmetic semantics. Binary floating point cannot exactly represent many decimal fractions. Money may require integer minor units or decimal arithmetic with explicit scale and rounding rules.',
   'The decimal 0.1 is a valid token but is not generally an exact binary floating-point value. A scientific token such as 1e-3 needs an exponent branch; treating its pieces as unrelated integer tokens changes its meaning.',
   'Regex checks spelling, not precision or business rounding policy. If separators depend on locale, use an explicitly configured parser rather than accepting both comma and dot without knowing which is decimal and which is grouping.']
 ],
 rx_email: [
  ['Why is the email recipe described as email-shaped extraction rather than complete validation?',
   'The pattern recognizes a familiar local-part, @, domain-like text, dot, and suffix shape. The full email address syntax has additional forms and restrictions, and a practical extractor often intentionally supports only common spellings. Even a syntactically valid address does not establish that its domain or mailbox exists or that the user controls it. Those are separate questions.',
   'a.b@example.com matches the default shape. The recipe can still accept some undesirable domain spellings because [A-Za-z0-9.-]+ does not validate label boundaries or hyphen placement. Unusual but syntactically supported address forms may be missed.',
   'State the supported product format and validate it accordingly. If ownership matters, use a verification workflow. Avoid claiming that an ever-larger regex alone proves deliverability or ownership.'],
  ['How should extraction, normalization, and identity comparison be separated for addresses?',
   'Extraction identifies candidate spans in surrounding text. Parsing determines the address components. Normalization and identity policy then decide which transformations are safe for the application. Provider-specific conventions such as ignoring dots or tags are not universal rules, and indiscriminate rewriting can conflate different addresses. Internationalized domains and Unicode local parts introduce further representation choices.',
   'Treating every plus-tagged address as equivalent may fit one provider’s behavior but not a general mailbox system. The domain and local part also do not necessarily share identical case and normalization policies.',
   'Preserve the original address for display and auditing, and apply only documented normalization rules for lookup. Cross-language regex differences should be tested on the supported address subset rather than hidden behind a claim of universal email correctness.']
 ],
 rx_url: [
  ['Why can the URL extractor include trailing punctuation or malformed hosts?',
   'The rule finds an http or https prefix and consumes characters until a simple separator such as whitespace, a quote, or an angle bracket. It does not parse URL authority, host, path, query, or punctuation conventions in prose. A period or closing parenthesis may be legitimate inside a URL or may be sentence punctuation, so a broad token rule cannot always decide which interpretation is intended.',
   'In See https://example.com., the final period may be included by this recipe. In an actual path a punctuation character can be meaningful, so blindly trimming every punctuation symbol can also corrupt a valid candidate.',
   'Use the regex to locate candidates, then apply a URL parser and a documented prose-trimming policy. Match success alone does not establish a well-formed or reachable URL.'],
  ['Why does extracting an http URL not make it safe for a server to fetch?',
   'A fetch policy must consider the parsed scheme, destination host, resolved addresses, redirects, credentials, and network boundaries. An http-shaped string can still refer to an unintended internal or local destination. Regex spelling checks do not replace address resolution and connection policy, and redirects can change the effective destination after the initial URL was inspected.',
   'A syntactically ordinary http URL may name a loopback or private destination. A public-looking host can redirect elsewhere. Those behaviors are unrelated to whether the extraction pattern correctly found the token in text.',
   'For an interview, distinguish token extraction from URL parsing and from authorization to make a network request. A production fetcher needs explicit destination controls and redirect handling in addition to input syntax checks.']
 ],
 rx_words: [
  ['Why does the word tokenizer use a noncapturing optional apostrophe group?',
   'The core letter run is required, while the optional group allows one apostrophe followed by another required letter run. Noncapturing parentheses keep that structural choice from creating an unnecessary output field. This supports a narrow English-like token definition without matching a standalone apostrophe or accepting an empty token. It is not a complete natural-language segmentation algorithm.',
   'Don’t stop produces Don’t and stop. A trailing apostrophe has no following letter run, so it is not part of the token. A hyphenated expression is split because hyphens are not included in the grammar.',
   'ASCII ranges exclude many languages and accented letters. Multiple apostrophes, curly apostrophes, and possessive conventions need an explicitly expanded policy rather than assuming this simple pattern already handles them.'],
  ['How do tokenizer requirements change for international text or programming languages?',
   'Natural languages may not separate words with spaces and may use combining marks or apostrophe forms outside the sample alphabet. A language-aware segmenter can provide more suitable boundaries. Programming-language tokens instead need a formal lexical grammar, often including comments, quoted strings, escape sequences, and longest-token rules. One broad word regex does not supply either set of semantics automatically.',
   'A quoted string in source code may contain spaces and comment-like characters that must remain inside one token. A natural-language word can contain characters outside A–Z. Treating both as the same letter-run problem loses essential context.',
   'Define token classes, precedence, and output positions before choosing regexes. A lexer can combine several regular rules with explicit state; a parser is needed when relationships between tokens go beyond local lexical structure.']
 ],
 rx_ipv4: [
  ['How does the octet alternation restrict values to 0 through 255?',
   'The branches cover disjoint useful ranges: 25 followed by 0–5 covers 250–255; 2 then 0–4 then a digit covers 200–249; 1 followed by two digits covers 100–199; and an optional 1–9 followed by a digit covers 0–99 without a leading zero on two-digit forms. Repeating a dotted octet three times produces four octets total.',
   '255.0.10.42 passes. 256.0.10.42 fails because no octet branch permits 256. 01.2.3.4 fails the chosen leading-zero policy even though each component could be numerically interpreted in a more permissive parser.',
   'The app applies a true full-input check, so extra characters or a final newline invalidate the field. This validates one dotted-decimal spelling, not reachability, subnet membership, or whether an address is appropriate for a network operation.'],
  ['When is parsing octets clearer than encoding the range in regex?',
   'Split on literal dots, require exactly four components, verify each component’s digit grammar and leading-zero policy, then parse and range-check 0–255. This exposes each rule separately and can give precise errors. However, using a permissive address parser without checking its accepted syntax may admit alternate spellings outside the product’s desired format.',
   'A parser can report that the third component is empty in 1.2..4 or exceeds range in 1.2.999.4. The regex can only provide match failure unless additional diagnostic logic is written.',
   'Keep syntax policy separate from networking policy. Rejecting leading zeros may be intentional even if a library accepts them. IPv6 requires a different grammar, and an IPv4-only rule must not be advertised as a complete IP-address validator.']
 ],
 rx_time: [
  ['How does the rule prevent 24:00 and 12:60 from matching?',
   'The hour alternatives are [01][0-9], covering 00–19, and 2[0-3], covering 20–23. Minutes require [0-5][0-9], covering 00–59. The literal colon fixes the separator, and full-input validation rejects missing leading zeros, extra fields, and trailing characters. The rule expresses an exact 24-hour HH:MM policy rather than every possible time notation.',
   '00:00 and 23:59 pass. 24:00, 12:60, 1:05, and 23:59 followed by a newline fail. Some applications define 24:00 specially, but this recipe deliberately does not.',
   'The input width is fixed for the default pattern, so matching this particular rule has bounded work. That does not justify a universal constant-time claim for arbitrarily edited patterns in the same lesson.'],
  ['Why is a valid HH:MM string not enough to represent a scheduled instant?',
   'A wall-clock time omits date, time zone, and calendar context. Depending on the location and date, a local clock time can be ambiguous or nonexistent during a daylight-saving transition. A schedule may also mean a recurring local time rather than one absolute timestamp. Regex can validate the display shape but cannot resolve these semantic choices.',
   'A daily reminder at 09:00 needs a chosen time zone and a policy for future calendar changes. Converting only the digits 09 and 00 into a timestamp cannot determine which day or offset is intended.',
   'Use an appropriate date/time model and explicit zone information after syntactic validation. If the application merely stores a clock-face value, say so and do not imply that the string uniquely identifies an instant.']
 ],
 rx_identifier: [
  ['Why must the first character have a different rule from the rest?',
   'The sample identifier policy permits a letter or underscore at the start, then letters, digits, or underscores afterward. A single repeated class containing digits would incorrectly allow a digit in the first position. The trailing star permits zero additional characters, so a one-character letter or underscore can be valid. Full-input validation excludes spaces and punctuation anywhere in the field.',
   'my_value2 and _ pass; 2value and my-value fail. The regex checks this chosen shape only. A word such as class can still match even if it is reserved by a particular programming language.',
   'Language identifiers often have Unicode and reserved-word rules beyond this ASCII policy. Apply keyword checks separately and use the target language’s actual specification when accepting real source-code identifiers.'],
  ['How do Unicode identifiers introduce normalization and confusable-character problems?',
   'Allowing Unicode letters broadens the syntax but can permit visually similar identifiers composed of different code points or scripts. Canonically equivalent spellings may also have different underlying representations without normalization. Syntax acceptance, identity comparison, and display-confusability policies are separate decisions. A regex category by itself does not resolve them.',
   'Two identifiers can look nearly identical while one contains a character from another script. A decomposed accent sequence can also differ from a precomposed letter even if users perceive the same visible name.',
   'Choose allowed scripts, normalization, and uniqueness rules for the application. Do not silently transliterate identifiers after they have been used as keys. For a language tool, follow that language’s defined identifier and normalization behavior rather than inventing a universal rule.']
 ],
 rx_password: [
  ['Which conditions does the sample password regex actually require?',
   'The lookaheads require a length from 8 through 32, at least one uppercase ASCII letter, at least one lowercase ASCII letter, and at least one digit. The final character class permits letters, digits, and the listed symbols. A symbol is allowed but not required because there is no separate assertion requiring one. The entire value must match the allowed-character sequence.',
   'LearnDSA9! passes, and Abcdefg1 also passes despite having no symbol. short1 fails the length and uppercase conditions. Adding an explicit symbol lookahead would change the policy rather than merely restate the existing one.',
   'Read each assertion independently when reviewing a compound rule. The pattern demonstrates constraint composition; it is not a password-strength measurement or a complete authentication design.'],
  ['Why do composition checks not establish password strength or secure storage?',
   'A predictable string can satisfy every required character category while remaining easy to guess. Strength depends on the secret’s generation and exposure, not just its spelling. Storage requires a suitable password-hashing process, and an authentication system also needs protections around verification and account access. None of those properties follows from regex acceptance.',
   'A familiar base word with a capital letter, digit, and symbol may pass a composition rule while still being highly predictable. Conversely, a long generated secret may fail an unnecessarily restrictive allowed-character class.',
   'For an interview, separate format validation from secret generation, breached-secret handling, storage, and verification controls. Avoid logging example or real password inputs in production. The lesson uses an illustrative policy so its Boolean result should not be labeled secure or insecure.']
 ],
 rx_split: [
  ['How does regex splitting differ from extracting the delimiter matches?',
   'Extraction returns the characters that satisfy the delimiter rule. Splitting returns the text between those matches. Track a cursor at the end of the previous delimiter; for each new delimiter, emit the slice from the cursor to its start, then move the cursor to its end. After scanning, emit the final suffix. This makes edge empty pieces and repeated-delimiter handling explicit.',
   'With delimiter [,;\\s]+, red,green; blue becomes [red, green, blue]. Splitting ,red, on a comma produces an empty first piece, red, and an empty final piece under this lesson’s convention.',
   'The + combines consecutive allowed delimiter characters into one span. Capturing delimiters are displayed but not inserted into this app’s split result, which differs from native split behavior in several language APIs.'],
  ['Why is a delimiter regex insufficient for general CSV or nested formats?',
   'A comma can separate fields or occur inside a quoted field; quotes may themselves be escaped. Determining which commas delimit fields requires tracking the format’s quoting state and escape rules. Nested or context-dependent structures need still more state. A naive comma regex treats every identical character alike and cannot infer those semantics merely from its position.',
   'The row a,"b,c",d has three CSV fields, not four. Splitting every comma incorrectly separates b and c. Handling doubled quotes inside a quoted field adds another case that a simple delimiter class does not address.',
   'Use a parser for the actual format, including its newline and escaping rules. If the data contract guarantees no quoting or embedded delimiters, a simple regex split is appropriate and should document that restriction.']
 ],
 rx_space: [
  ['Why does replacing whitespace runs not automatically trim the result?',
   'The rule finds each one-or-more whitespace run and replaces that span with one ordinary space. It applies equally in the middle and at the edges. Therefore leading or trailing runs become leading or trailing spaces rather than disappearing. Trimming is a separate operation and should be applied only when edge whitespace is insignificant for the field.',
   'The text with three spaces between a and b, tabs before c, and a newline before d becomes a b c d. Input consisting only of whitespace becomes one space, not an empty string, under this replacement rule.',
   'The recipe also flattens line breaks, which can destroy paragraph structure. JavaScript \\s recognizes a particular set of whitespace characters; cross-language Unicode whitespace behavior should be tested rather than assumed identical.'],
  ['When can whitespace normalization change meaning rather than merely improve formatting?',
   'Whitespace can be significant in source code, quoted values, preformatted documents, protocols, and natural-language layout. A global regex replacement does not know which regions permit normalization. Even if extra spaces are insignificant in one context, replacing newlines can join records or remove boundaries. Apply normalization at a known structural layer rather than blindly across mixed-format content.',
   'Inside a quoted string, two spaces may be intentional data. In an indentation-sensitive language, leading whitespace can determine block structure. In line-delimited records, removing newlines merges separate records.',
   'Define whether the goal is horizontal-space collapse, line-ending normalization, trimming, or full whitespace flattening. These are different transformations. Parse or preserve protected regions when the surrounding format requires them.']
 ],
 rx_mask: [
  ['Why does [0-9] produce one replacement per digit, while [0-9]+ behaves differently?',
   'Without a quantifier, each match consumes one digit, so replacing each match with # preserves the number of digit positions. Adding + groups a run of digits into one match, so a fixed replacement inserts only one # for the whole run. The pattern’s match granularity controls the replacement count; a static replacement is not automatically repeated to match the span length.',
   '1234 with [0-9] and replacement # becomes ####. With [0-9]+ and the same replacement it becomes #. Non-digit text remains unchanged in both cases.',
   'The sample targets ASCII digits only. If a field allows other digit scripts, define whether to mask those as well. Preserving length may be useful for formatting but can also reveal information.'],
  ['Why is digit masking not a complete anonymization or redaction system?',
   'The transformed value can still expose non-digit identifiers, names, context, token structure, and original digit count. Sensitive information may use letters or multiple encodings. A transformation useful for display may also leave the original value in logs, application state, or exported artifacts. Privacy properties depend on the complete data flow and a defined threat model, not just visible character replacement.',
   'Card #### still reveals the number of digits masked in this toy example. A sensitive alphanumeric identifier would retain its letters. Keeping a raw input elsewhere means the display transformation did not remove that underlying data.',
   'Specify what information must be removed, where raw data may persist, and whether deterministic partial masking is acceptable. Use field-aware redaction when data has known structure, and test exports and logs as well as the rendered page.']
 ],
 rx_reorder: [
  ['How does the replacement $3/$2/$1 reorder date-shaped fields?',
   'The pattern captures year, month, and day in groups 1, 2, and 3. The replacement template reads those captured strings in a new order while copying unmatched text unchanged. It does not parse them as numbers, so leading zeros are preserved. The result is a formatting transformation over matches, not a check that the represented date exists.',
   '2026-10-18 becomes 18/10/2026. A sentence containing two matching dates is rebuilt from its untouched pieces and both expanded replacements, keeping the surrounding punctuation and wording.',
   'This app supports numbered references $1–$9 and $$ for a literal dollar. Python’s native substitution syntax differs, so the provided helper explicitly implements the same small replacement grammar for these examples.'],
  ['What edge cases must a capture-template replacement specify?',
   'Define behavior for an optional group that did not match, an empty participating group, a reference to a nonexistent group, literal dollar signs, and numbers beyond the supported reference range. Also distinguish pattern escaping from replacement escaping: making text literal in one context does not make it literal in the other. A replacement supplied as data should not unexpectedly execute a template language unless that is the intended feature.',
   'Here an unmatched existing group expands to empty text, a nonexistent $9 remains literal, and $$ becomes $. References are one digit, so $10 means group 1 followed by 0 rather than group 10. $& is not expanded by this teaching helper.',
   'Test the explicit template contract instead of assuming every language uses JavaScript’s or Python’s native replacement rules. If a replacement must be entirely literal, use a callback or an API mode that inserts the exact provided string without reference expansion.']
 ]
});
