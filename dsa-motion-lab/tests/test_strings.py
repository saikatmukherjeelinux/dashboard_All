"""Independent small-input oracles and cross-language fixtures for 20 lessons."""
import itertools
import json
import random
import re
import sys
import unittest
from collections import Counter
from functools import lru_cache
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from python_examples import strings as algorithms


def subsequences(text):
    return [''.join(text[i] for i in range(len(text)) if mask & (1 << i))
            for mask in range(1 << len(text))]


def substrings(text):
    return [text[start:end] for start in range(len(text) + 1)
            for end in range(start, len(text) + 1)]


def all_matches(text, pattern):
    return [i for i in range(len(text) + 1) if text.startswith(pattern, i)]


def lcs_length(a, b):
    candidates = set(subsequences(b))
    return max(map(len, (s for s in subsequences(a) if s in candidates)))


@lru_cache(None)
def brute_edit(a, b):
    if not a or not b:
        return len(a) + len(b)
    if a[0] == b[0]:
        return brute_edit(a[1:], b[1:])
    return 1 + min(brute_edit(a[1:], b), brute_edit(a, b[1:]), brute_edit(a[1:], b[1:]))


def brute_palcut(text):
    @lru_cache(None)
    def pieces(start):
        if start == len(text):
            return 0
        return 1 + min(pieces(end) for end in range(start + 1, len(text) + 1)
                       if text[start:end] == text[start:end][::-1])
    return max(0, pieces(0) - 1)


def brute_wordbreak(text, words):
    @lru_cache(None)
    def possible(start):
        return start == len(text) or any(word and text.startswith(word, start)
                                        and possible(start + len(word)) for word in words)
    return possible(0)


FUNCTIONS = {
    'zstring': algorithms.z_search, 'rabin': algorithms.rabin_karp,
    'horspool': algorithms.horspool_search, 'aho': algorithms.aho_corasick,
    'trie': algorithms.trie_autocomplete, 'suffix': algorithms.suffix_array,
    'kasai': algorithms.kasai_lcp, 'manacher': algorithms.manacher,
    'lcs': algorithms.longest_common_subsequence,
    'lcsubstr': algorithms.longest_common_substring, 'edit': algorithms.edit_distance,
    'scs': algorithms.shortest_common_supersequence,
    'lps': algorithms.longest_palindromic_subsequence, 'palcut': algorithms.palindrome_min_cuts,
    'wordbreak': algorithms.word_break, 'distinct': algorithms.count_subsequences,
    'wildcard': algorithms.wildcard_match, 'minwindow': algorithms.minimum_window,
    'anagrams': algorithms.anagram_windows, 'unique': algorithms.longest_unique_substring,
}
SINGLE = {'suffix', 'kasai', 'manacher', 'lps', 'palcut', 'unique'}
DICTIONARY = {'aho', 'trie', 'wordbreak'}


def cases():
    rng = random.Random(314159)
    pairs = [('', ''), ('', 'a'), ('a', ''), ('aaaaa', 'aaa'),
             ('ababa', 'aba'), ('🙂a🙂b', '🙂b'), ('a⟂a', '⟂'),
             ('<a&b>', '&'), ('a a ', 'a ')]
    pairs += [(''.join(rng.choices('ab🙂', k=rng.randrange(7))),
               ''.join(rng.choices('ab🙂', k=rng.randrange(5)))) for _ in range(60)]
    for lesson in FUNCTIONS:
        for text, pattern in pairs:
            if lesson in DICTIONARY:
                pattern = 'a, aa, aba, b, 🙂, a🙂, a' if pattern else ''
                args = [text, list(dict.fromkeys(w.strip() for w in pattern.split(',') if w.strip()))]
            elif lesson in SINGLE:
                args = [text]
            else:
                args = [text, pattern]
            yield lesson, text, pattern, args
    for text, pattern in [('adceb', '*a*b'), ('acdcb', 'a*c?b'), ('', '***'),
                          ('🙂a', '?*'), ('abc', 'a?'), ('abc', '*'), ('ab', '*?*?*')]:
        yield 'wildcard', text, pattern, [text, pattern]


class StringAlgorithmsTest(unittest.TestCase):
    def test_independent_oracles(self):
        for lesson, text, pattern, args in cases():
            with self.subTest(lesson=lesson, text=text, pattern=pattern):
                result = FUNCTIONS[lesson](*args)
                if lesson in {'zstring', 'rabin', 'horspool'}:
                    self.assertEqual(result, all_matches(text, pattern))
                elif lesson == 'aho':
                    expected = sorted((word, i) for word in args[1] for i in all_matches(text, word))
                    self.assertEqual(sorted((hit['word'], hit['index']) for hit in result), expected)
                elif lesson == 'trie':
                    self.assertEqual(result, sorted(word for word in args[1] if word.startswith(text)))
                elif lesson in {'suffix', 'kasai'}:
                    order = sorted(range(len(text)), key=lambda i: text[i:])
                    if lesson == 'suffix':
                        self.assertEqual(result, order)
                    else:
                        expected = [0] * len(text)
                        for r in range(1, len(order)):
                            for a, b in zip(text[order[r]:], text[order[r - 1]:]):
                                if a != b:
                                    break
                                expected[r] += 1
                        self.assertEqual(result, expected)
                elif lesson == 'manacher':
                    best = max((s for s in substrings(text) if s == s[::-1]), key=len)
                    self.assertEqual(len(result), len(best))
                    self.assertEqual(result, result[::-1])
                    self.assertIn(result, text)
                elif lesson == 'lcs':
                    self.assertEqual(len(result), lcs_length(text, pattern))
                    self.assertIn(result, subsequences(text))
                    self.assertIn(result, subsequences(pattern))
                elif lesson == 'lcsubstr':
                    self.assertEqual(len(result), max(map(len, (s for s in substrings(text) if s in pattern))))
                    self.assertIn(result, text)
                    self.assertIn(result, pattern)
                elif lesson == 'edit':
                    self.assertEqual(result, brute_edit(text, pattern))
                elif lesson == 'scs':
                    self.assertEqual(len(result), len(text) + len(pattern) - lcs_length(text, pattern))
                    self.assertIn(text, subsequences(result))
                    self.assertIn(pattern, subsequences(result))
                elif lesson == 'lps':
                    self.assertEqual(result, max(len(s) for s in subsequences(text) if s == s[::-1]))
                elif lesson == 'palcut':
                    self.assertEqual(result, brute_palcut(text))
                elif lesson == 'wordbreak':
                    self.assertEqual(result, brute_wordbreak(text, args[1]))
                elif lesson == 'distinct':
                    self.assertEqual(result, subsequences(text).count(pattern))
                elif lesson == 'wildcard':
                    regex = ''.join('.*' if c == '*' else '.' if c == '?' else re.escape(c) for c in pattern)
                    self.assertEqual(result, bool(re.fullmatch(regex, text, flags=re.DOTALL)))
                elif lesson == 'minwindow':
                    required = Counter(pattern)
                    valid = [s for s in substrings(text) if not required - Counter(s)]
                    expected = min(valid, key=len) if valid else ''
                    self.assertEqual(result, expected)
                elif lesson == 'anagrams':
                    self.assertEqual(result, [i for i in range(len(text) - len(pattern) + 1)
                                              if Counter(text[i:i + len(pattern)]) == Counter(pattern)])
                elif lesson == 'unique':
                    expected = max((s for s in substrings(text) if len(s) == len(set(s))), key=len)
                    self.assertEqual(result, expected)

    def test_displayed_samples_run_standalone(self):
        root = Path(__file__).resolve().parents[1]
        source = (root / 'assets' / 'string-python.js').read_text(encoding='utf-8')
        samples = json.loads(source[source.index('{'):source.rindex('}') + 1])
        self.assertEqual(len(samples), 20)
        import contextlib
        import io
        for name, sample in samples.items():
            with self.subTest(lesson=name), contextlib.redirect_stdout(io.StringIO()):
                exec(compile(sample, f'<sample:{name}>', 'exec'), {})


if __name__ == '__main__':
    if '--fixtures' in sys.argv:
        print(json.dumps([{'id': lesson, 'text': text, 'pattern': pattern,
                           'expected': FUNCTIONS[lesson](*args)}
                          for lesson, text, pattern, args in cases()]))
    else:
        unittest.main()
