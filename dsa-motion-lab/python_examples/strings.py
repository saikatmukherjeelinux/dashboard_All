"""Twenty string algorithms. Indices count Unicode code points, not bytes.

Dictionary functions accept an iterable of nonempty words. Search functions
return all matches, including overlaps; an empty pattern matches n+1 boundaries.
"""
from collections import Counter, deque


def z_search(text, pattern):
    """Linear-time pattern search with a separator that cannot be a character."""
    if not pattern:
        return list(range(len(text) + 1))
    sequence = list(pattern) + [None] + list(text)
    z = [0] * len(sequence)
    left = right = 0
    for i in range(1, len(sequence)):
        if i <= right:
            z[i] = min(right - i + 1, z[i - left])
        while i + z[i] < len(sequence) and sequence[z[i]] == sequence[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > right:
            left, right = i, i + z[i] - 1
    offset = len(pattern) + 1
    return [i - offset for i in range(offset, len(sequence)) if z[i] >= len(pattern)]


def rabin_karp(text, pattern):
    """Rolling hash with exact collision verification; O(nm) worst-case time."""
    n, m = len(text), len(pattern)
    if not m:
        return list(range(n + 1))
    if m > n:
        return []
    base, modulus = 257, 1000003
    power = pow(base, m - 1, modulus)
    target = window = 0
    for i in range(m):
        target = (target * base + ord(pattern[i]) + 1) % modulus
        window = (window * base + ord(text[i]) + 1) % modulus
    matches = []
    for start in range(n - m + 1):
        if target == window and text[start:start + m] == pattern:
            matches.append(start)
        if start < n - m:
            window = ((window - (ord(text[start]) + 1) * power) * base
                      + ord(text[start + m]) + 1) % modulus
    return matches


def horspool_search(text, pattern):
    """Boyer–Moore–Horspool search, including overlapping matches."""
    n, m = len(text), len(pattern)
    if not m:
        return list(range(n + 1))
    shifts = {pattern[i]: m - 1 - i for i in range(m - 1)}
    result, start = [], 0
    while start <= n - m:
        j = m - 1
        while j >= 0 and pattern[j] == text[start + j]:
            j -= 1
        if j < 0:
            result.append(start)
        start += shifts.get(text[start + m - 1], m)
    return result


def aho_corasick(text, words):
    """Return {word, index} matches. Empty/duplicate dictionary words ignored.

    For clarity this version copies inherited output lists; output-link
    implementations avoid that extra preprocessing and storage overhead.
    """
    nodes = [{'next': {}, 'fail': 0, 'out': []}]
    for word in dict.fromkeys(w for w in words if w):
        state = 0
        for char in word:
            if char not in nodes[state]['next']:
                nodes[state]['next'][char] = len(nodes)
                nodes.append({'next': {}, 'fail': 0, 'out': []})
            state = nodes[state]['next'][char]
        nodes[state]['out'].append(word)
    queue = deque(nodes[0]['next'].values())
    while queue:
        state = queue.popleft()
        for char, child in nodes[state]['next'].items():
            fallback = nodes[state]['fail']
            while fallback and char not in nodes[fallback]['next']:
                fallback = nodes[fallback]['fail']
            nodes[child]['fail'] = nodes[fallback]['next'].get(char, 0)
            nodes[child]['out'].extend(nodes[nodes[child]['fail']]['out'])
            queue.append(child)
    state, result = 0, []
    for i, char in enumerate(text):
        while state and char not in nodes[state]['next']:
            state = nodes[state]['fail']
        state = nodes[state]['next'].get(char, 0)
        for word in nodes[state]['out']:
            result.append({'word': word, 'index': i - len(word) + 1})
    return result


def trie_autocomplete(prefix, words):
    """Collect dictionary words under a prefix; sorted suggestions add cost."""
    root = {}
    terminal = None  # Cannot collide with any character key.
    for word in words:
        if not word:
            continue
        node = root
        for char in word:
            node = node.setdefault(char, {})
        node[terminal] = word
    node = root
    for char in prefix:
        if char not in node:
            return []
        node = node[char]
    result = []
    def collect(current):
        if terminal in current:
            result.append(current[terminal])
        for char, child in current.items():
            if char is not terminal:
                collect(child)
    collect(node)
    return sorted(result)


def suffix_array(text):
    """Prefix doubling with comparison sorting: O(n log² n), O(n) space."""
    n = len(text)
    order = list(range(n))
    alphabet = {char: i for i, char in enumerate(sorted(set(text)))}
    rank = [alphabet[char] for char in text]
    k = 1
    while k < n:
        def key(i):
            return rank[i], rank[i + k] if i + k < n else -1
        order.sort(key=key)
        updated = [0] * n
        for i in range(1, n):
            updated[order[i]] = updated[order[i - 1]] + (key(order[i]) != key(order[i - 1]))
        rank = updated
        if rank[order[-1]] == n - 1:
            break
        k *= 2
    return order


def kasai_lcp(text):
    """LCP[i] compares suffix order[i] with order[i-1]; LCP[0] is 0.

    LCP construction is O(n); suffix-array construction here is O(n log² n).
    """
    n = len(text)
    order = suffix_array(text)
    rank, lcp = [0] * n, [0] * n
    for i, start in enumerate(order):
        rank[start] = i
    overlap = 0
    for start in range(n):
        r = rank[start]
        if r == 0:
            overlap = 0
            continue
        previous = order[r - 1]
        while start + overlap < n and previous + overlap < n and text[start + overlap] == text[previous + overlap]:
            overlap += 1
        lcp[r] = overlap
        overlap = max(0, overlap - 1)
    return lcp


def manacher(text):
    """Longest continuous palindrome in O(n) time and space."""
    n = len(text)
    best_start = best_length = 0
    for parity in (1, 0):
        radii = [0] * n
        left, right = 0, -1
        for i in range(n):
            radius = parity if i > right else min(radii[left + right - i + (0 if parity else 1)], right - i + 1)
            while i + radius < n and i - radius - (0 if parity else 1) >= 0 and text[i + radius] == text[i - radius - (0 if parity else 1)]:
                radius += 1
            radii[i] = radius
            length, start = 2 * radius - parity, i - radius + parity
            if length > best_length:
                best_start, best_length = start, length
            if i + radius - 1 > right:
                left, right = start, i + radius - 1
    return text[best_start:best_start + best_length]


def _lcs_table(first, second):
    table = [[0] * (len(second) + 1) for _ in range(len(first) + 1)]
    for i, char in enumerate(first, 1):
        for j, other in enumerate(second, 1):
            table[i][j] = table[i - 1][j - 1] + 1 if char == other else max(table[i - 1][j], table[i][j - 1])
    return table


def longest_common_subsequence(first, second):
    """One LCS; ties prefer consuming from the first string."""
    table = _lcs_table(first, second)
    i, j, result = len(first), len(second), []
    while i and j:
        if first[i - 1] == second[j - 1]:
            result.append(first[i - 1])
            i, j = i - 1, j - 1
        elif table[i - 1][j] >= table[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return ''.join(reversed(result))


def longest_common_substring(first, second):
    """Longest continuous piece shared by both strings."""
    table = [[0] * (len(second) + 1) for _ in range(len(first) + 1)]
    best_length = best_end = 0
    for i, char in enumerate(first, 1):
        for j, other in enumerate(second, 1):
            if char == other:
                table[i][j] = table[i - 1][j - 1] + 1
                if table[i][j] > best_length:
                    best_length, best_end = table[i][j], i
    return first[best_end - best_length:best_end]


def edit_distance(first, second):
    """Levenshtein distance; insert/delete/replace each cost one."""
    table = [[0] * (len(second) + 1) for _ in range(len(first) + 1)]
    for i in range(len(first) + 1):
        table[i][0] = i
    for j in range(len(second) + 1):
        table[0][j] = j
    for i, char in enumerate(first, 1):
        for j, other in enumerate(second, 1):
            table[i][j] = table[i - 1][j - 1] if char == other else 1 + min(table[i - 1][j], table[i][j - 1], table[i - 1][j - 1])
    return table[-1][-1]


def shortest_common_supersequence(first, second):
    """One shortest string containing both inputs as subsequences."""
    table = _lcs_table(first, second)
    i, j, result = len(first), len(second), []
    while i and j:
        if first[i - 1] == second[j - 1]:
            result.append(first[i - 1])
            i, j = i - 1, j - 1
        elif table[i - 1][j] >= table[i][j - 1]:
            result.append(first[i - 1])
            i -= 1
        else:
            result.append(second[j - 1])
            j -= 1
    result.extend(reversed(first[:i]))
    result.extend(reversed(second[:j]))
    return ''.join(reversed(result))


def longest_palindromic_subsequence(text):
    """Length of an LPS; characters may be skipped."""
    n = len(text)
    table = [[0] * n for _ in range(n)]
    for start in range(n - 1, -1, -1):
        table[start][start] = 1
        for end in range(start + 1, n):
            table[start][end] = (2 + (table[start + 1][end - 1] if end - start > 1 else 0)
                                 if text[start] == text[end] else max(table[start + 1][end], table[start][end - 1]))
    return table[0][-1] if n else 0


def palindrome_min_cuts(text):
    """Fewest cuts into palindrome pieces; empty text needs zero cuts."""
    n = len(text)
    palindrome = [[False] * n for _ in range(n)]
    cuts = list(range(n))
    for end in range(n):
        for start in range(end + 1):
            if text[start] == text[end] and (end - start < 2 or palindrome[start + 1][end - 1]):
                palindrome[start][end] = True
                cuts[end] = min(cuts[end], 0 if start == 0 else cuts[start - 1] + 1)
    return cuts[-1] if n else 0


def word_break(text, words):
    """Whether dictionary words can cover text; repeated words allowed."""
    dictionary = set(words) - {''}
    possible = [True] + [False] * len(text)
    for end in range(1, len(text) + 1):
        for start in range(end):
            if possible[start] and text[start:end] in dictionary:
                possible[end] = True
                break
    return possible[-1]


def count_subsequences(text, target):
    """Count choices of positions forming target, not distinct output strings."""
    table = [[0] * (len(target) + 1) for _ in range(len(text) + 1)]
    for row in table:
        row[0] = 1
    for i, char in enumerate(text, 1):
        for j, other in enumerate(target, 1):
            table[i][j] = table[i - 1][j] + (table[i - 1][j - 1] if char == other else 0)
    return table[-1][-1]


def wildcard_match(text, pattern):
    """Full-string glob matching: ? matches one code point, * matches any count."""
    table = [[False] * (len(pattern) + 1) for _ in range(len(text) + 1)]
    table[0][0] = True
    for j, char in enumerate(pattern, 1):
        table[0][j] = char == '*' and table[0][j - 1]
    for i, char in enumerate(text, 1):
        for j, token in enumerate(pattern, 1):
            if token == '*':
                table[i][j] = table[i - 1][j] or table[i][j - 1]
            else:
                table[i][j] = (token == '?' or token == char) and table[i - 1][j - 1]
    return table[-1][-1]


def minimum_window(text, required):
    """Shortest substring covering all required counts, or empty if impossible."""
    if not required:
        return ''
    need, counts = Counter(required), Counter()
    missing, left, best_start, best_length = len(required), 0, 0, float('inf')
    for right, char in enumerate(text):
        counts[char] += 1
        if counts[char] <= need[char]:
            missing -= 1
        while missing == 0:
            if right - left + 1 < best_length:
                best_start, best_length = left, right - left + 1
            old = text[left]
            if counts[old] <= need[old]:
                missing += 1
            counts[old] -= 1
            left += 1
    return '' if best_length == float('inf') else text[best_start:best_start + best_length]


def anagram_windows(text, pattern):
    """All fixed-width anagram start indices; duplicates respected."""
    if not pattern:
        return list(range(len(text) + 1))
    need, counts = Counter(pattern), Counter()
    missing, left, result = len(pattern), 0, []
    for right, char in enumerate(text):
        counts[char] += 1
        if counts[char] <= need[char]:
            missing -= 1
        if right - left + 1 > len(pattern):
            old = text[left]
            if counts[old] <= need[old]:
                missing += 1
            counts[old] -= 1
            left += 1
        if right - left + 1 == len(pattern) and missing == 0:
            result.append(left)
    return result


def longest_unique_substring(text):
    """Longest continuous span with no repeated code points; first tie wins."""
    counts = Counter()
    left = best_start = best_length = 0
    for right, char in enumerate(text):
        counts[char] += 1
        while counts[char] > 1:
            counts[text[left]] -= 1
            left += 1
        if right - left + 1 > best_length:
            best_start, best_length = left, right - left + 1
    return text[best_start:best_start + best_length]
