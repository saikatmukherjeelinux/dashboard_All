import contextlib
import io
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from python_examples.regex_algorithms import regex_recipe

RECIPES = json.loads((ROOT / 'python_examples/regex_recipes.json').read_text(encoding='utf-8'))


def fixtures():
    for recipe in RECIPES:
        for text in [recipe['text'], '', 'cat CAT 12 -34 5.60', '🙂cat🙂 12',
                     'one\ntwo\n', '192.168.0.1', 'a,b; c']:
            yield {**recipe, 'text': text,
                   'expected': regex_recipe(text, recipe['pattern'], recipe['mode'],
                                            recipe['flags'], recipe['replacement'])}
    for pattern in ['', '(?:)', 'a*', '(a)?', '(?=(aa))']:
        for mode in ['matches', 'split', 'replace']:
            for text in ['', 'aaa', '🙂aa']:
                yield {'id': 'custom', 'text': text, 'pattern': pattern, 'mode': mode,
                       'flags': '', 'replacement': '$1/$$/$9',
                       'expected': regex_recipe(text, pattern, mode, '', '$1/$$/$9')}
    for text, pattern, flags in [('ab', 'a|ab', ''), ('a\n', 'a$', ''),
                                  ('a\n', 'a$', 'm'), ('A', 'a', 'i'),
                                  ('a\nb', 'a.b', 's'), ('🙂', '.', '')]:
        yield {'id': 'validation', 'text': text, 'pattern': pattern, 'mode': 'validate',
               'flags': flags, 'replacement': '',
               'expected': regex_recipe(text, pattern, 'validate', flags)}


class RegexRecipesTest(unittest.TestCase):
    def test_catalogue_and_samples(self):
        self.assertEqual(len(RECIPES), 30)
        self.assertEqual(len({r['id'] for r in RECIPES}), 30)
        source = (ROOT / 'assets/regex-python.js').read_text(encoding='utf-8')
        samples = json.loads(source[source.index('{'):source.rindex('}') + 1])
        self.assertEqual(set(samples), {r['id'] for r in RECIPES})
        for recipe in RECIPES:
            output = io.StringIO()
            with self.subTest(id=recipe['id']), contextlib.redirect_stdout(output):
                exec(compile(samples[recipe['id']], '<regex-example>', 'exec'), {})
            self.assertTrue(output.getvalue().strip())

    def test_known_extractions(self):
        expected = {
            'rx_literal': ['cat', 'cat'], 'rx_boundary': ['cat', 'cat'],
            'rx_case': ['Cat', 'cat', 'CAT', 'cAt'],
            'rx_negated': [',', '!', '#'],
            'rx_alternation': ['cat', 'dog', 'cat', 'dog'],
            'rx_repeat': ['cat', 'bird', 'horse'], 'rx_lines': ['Alpha', 'Gamma'],
            'rx_greedy': ['<b>one</b><i>two</i>'], 'rx_lazy': ['<b>', '</b>', '<i>', '</i>'],
            'rx_lookahead': ['name', 'age'], 'rx_not_ahead': ['dog', 'catalog', 'bird'],
            'rx_lookbehind': ['12.50', '7'], 'rx_not_behind': ['12', '56'],
            'rx_overlap': ['', ''], 'rx_backref': ['go go', 'now now'],
            'rx_integer': ['-12', '+7', '42'], 'rx_decimal': ['-12.50', '7', '+0.25'],
            'rx_email': ['a.b@example.com', 'dev@test.org'],
            'rx_url': ['https://example.com/a', 'http://test.org'],
            'rx_words': ["Don't", 'stop', 'learn', 'regex'],
            'rx_captures': ['2026-10-18', '2025-01-02'],
        }
        for recipe in RECIPES:
            if recipe['id'] in expected:
                with self.subTest(id=recipe['id']):
                    found = regex_recipe(recipe['text'], recipe['pattern'], flags=recipe['flags'])
                    self.assertEqual([item['match'] for item in found], expected[recipe['id']])
        overlap = next(r for r in RECIPES if r['id'] == 'rx_overlap')
        found = regex_recipe(overlap['text'], overlap['pattern'])
        self.assertEqual([item['start'] for item in found], [1, 3])
        self.assertEqual([item['groups'] for item in found], [['ana'], ['ana']])

    def test_validation_boundaries(self):
        samples = {
            'rx_ipv4': (['0.0.0.0', '255.255.255.255'], ['256.1.2.3', '01.2.3.4', '1.2.3', '1.2.3.4\n']),
            'rx_time': (['00:00', '23:59'], ['24:00', '12:60', '1:01', '23:59\n']),
            'rx_identifier': (['_value2', 'a'], ['2a', 'a-b', '']),
            'rx_password': (['LearnDSA9!', 'Abcdefg1'], ['short1', 'ALLUPPER1', 'lowercase1']),
        }
        for recipe in RECIPES:
            if recipe['id'] not in samples:
                continue
            valid, invalid = samples[recipe['id']]
            for text in valid + invalid:
                with self.subTest(id=recipe['id'], text=text):
                    self.assertEqual(regex_recipe(text, recipe['pattern'], 'validate'), text in valid)

    def test_transformations(self):
        expected = {'rx_split': ['red', 'green', 'blue', 'yellow'],
                    'rx_space': 'a b c d', 'rx_mask': 'Card ####, PIN ####',
                    'rx_reorder': 'Dates: 18/10/2026 and 02/01/2025'}
        for recipe in RECIPES:
            if recipe['id'] in expected:
                self.assertEqual(regex_recipe(recipe['text'], recipe['pattern'], recipe['mode'],
                                              recipe['flags'], recipe['replacement']), expected[recipe['id']])
        self.assertEqual(regex_recipe(',a,', ',', 'split'), ['', 'a', ''])
        self.assertEqual(regex_recipe('a,b', '(,)', 'split'), ['a', 'b'])
        self.assertEqual(regex_recipe('a', '(a)', 'replace', '', '$1 $$ $9'), 'a $ $9')

    def test_empty_matches_and_errors(self):
        self.assertEqual([m['start'] for m in regex_recipe('🙂a', '')], [0, 1, 2])
        self.assertTrue(regex_recipe('ab', 'a|ab', 'validate'))
        self.assertFalse(regex_recipe('a\n', 'a$', 'validate', 'm'))
        for flags in ['ii', 'g', 'u', 'x']:
            with self.assertRaises(ValueError):
                regex_recipe('a', 'a', flags=flags)
        with self.assertRaises(re.error):
            regex_recipe('a', '(')


if __name__ == '__main__':
    if '--fixtures' in sys.argv:
        print(json.dumps(list(fixtures())))
    else:
        unittest.main()
