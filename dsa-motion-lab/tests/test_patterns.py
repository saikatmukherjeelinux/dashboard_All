"""Independent small-input oracles for the 27 new interview lessons."""
import contextlib
import copy
import io
import itertools
import json
import math
import random
import sys
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from python_examples import interview_patterns as reference

CATALOG = json.loads((ROOT / 'python_examples/pattern_recipes.json').read_text(encoding='utf-8'))
NAMES = json.loads((ROOT / 'python_examples/pattern_names.json').read_text(encoding='utf-8'))


def cases():
    rng = random.Random(271828)
    for recipe in CATALOG:
        yield recipe['id'], recipe['defaults']
        for _ in range(30):
            id = recipe['id']
            nums = [rng.randrange(-4, 5) for _ in range(rng.randrange(7))]
            data = {'nums': nums}
            if id in {'two_sum', 'sum_k'}:
                data['target'] = rng.randrange(-6, 7)
            if id in {'rain', 'container', 'jump', 'partition'}:
                data['nums'] = [abs(x) for x in nums]
            if id == 'dutch':
                data['nums'] = [abs(x) % 3 for x in nums]
            if id == 'rotated':
                values = sorted(set(nums))
                cut = rng.randrange(len(values) + 1)
                data = {'nums': values[cut:] + values[:cut], 'target': rng.randrange(-5, 6)}
            if id == 'top_k':
                data['k'] = rng.randrange(len(set(nums)) + 1)
            if id == 'quickselect':
                if not nums:
                    data['nums'] = [0]
                data['k'] = rng.randrange(1, len(data['nums']) + 1)
            if id == 'window_max':
                data['k'] = rng.randrange(1, len(nums) + 1) if nums else 0
            if id in {'subsets', 'permutations'}:
                data['nums'] = list(dict.fromkeys(nums))
            if id == 'combination':
                data = {'nums': sorted(set(abs(x) + 1 for x in nums)), 'target': rng.randrange(10)}
            if id in {'merge_intervals', 'meeting_rooms'}:
                starts = [rng.randrange(-5, 8) for _ in range(rng.randrange(7))]
                data = {'intervals': [[x, x + rng.randrange(1, 6)] for x in starts]}
            if id == 'gas_station':
                data = {'gas': [abs(x) for x in nums], 'cost': [rng.randrange(5) for _ in nums]}
            if id == 'knapsack':
                data = {'weights': [abs(x) for x in nums], 'values': [rng.randrange(10) for _ in nums], 'capacity': rng.randrange(10)}
            if id == 'queens':
                data = {'n': rng.randrange(1, 6)}
            if id == 'islands':
                rows, columns = rng.randrange(5), rng.randrange(5)
                data = {'grid': [[rng.randrange(2) for _ in range(columns)] for _ in range(rows)]}
            if id == 'union_find':
                n = rng.randrange(1, 8)
                data = {'n': n, 'edges': [[rng.randrange(n), rng.randrange(n)] for _ in range(8)]}
            if id == 'fenwick':
                data = {'nums': nums, 'updates': [[rng.randrange(len(nums)), rng.randrange(-5, 6)] for _ in range(3)] if nums else [], 'queries': []}
                for _ in range(3 if nums else 0):
                    left = rng.randrange(len(nums))
                    data['queries'].append([left, rng.randrange(left, len(nums))])
            yield id, data


def subsets_indices(n):
    return [[i for i in range(n) if mask & (1 << i)] for mask in range(1 << n)]


class InterviewPatternsTest(unittest.TestCase):
    def test_independent_results(self):
        for id, data in cases():
            with self.subTest(id=id, data=data):
                before = copy.deepcopy(data)
                result = getattr(reference, NAMES[id])(**data)
                self.assertEqual(data, before, 'Reference changed input')
                a = data.get('nums', [])
                n = len(a)
                if id == 'two_sum':
                    expected = next(([j, i] for i in range(n) for j in range(i) if a[j] + a[i] == data['target']), [])
                    self.assertEqual(result, expected)
                elif id == 'three_sum':
                    expected = sorted(set(tuple(sorted(values)) for values in itertools.combinations(a, 3) if sum(values) == 0))
                    self.assertEqual(result, [list(values) for values in expected])
                elif id == 'product_except':
                    self.assertEqual(result, [math.prod(a[:i] + a[i + 1:]) for i in range(n)])
                elif id == 'sum_k':
                    self.assertEqual(result, sum(sum(a[i:j]) == data['target'] for i in range(n) for j in range(i + 1, n + 1)))
                elif id == 'consecutive':
                    best = current = 0
                    previous = None
                    for value in sorted(set(a)):
                        current = current + 1 if previous is not None and value == previous + 1 else 1
                        best, previous = max(best, current), value
                    self.assertEqual(result, best)
                elif id == 'rain':
                    self.assertEqual(result, sum(min(max(a[:i + 1]), max(a[i:])) - value for i, value in enumerate(a)))
                elif id == 'container':
                    self.assertEqual(result, max(((j - i) * min(a[i], a[j]) for i in range(n) for j in range(i + 1, n)), default=0))
                elif id == 'dutch':
                    self.assertEqual(result, sorted(a))
                elif id == 'rotated':
                    self.assertEqual(result, a.index(data['target']) if data['target'] in a else -1)
                elif id == 'merge_intervals':
                    pending, expected = list(map(tuple, data['intervals'])), []
                    while pending:
                        left, right = pending.pop()
                        changed = True
                        while changed:
                            changed = False
                            for pair in pending[:]:
                                if pair[0] <= right and pair[1] >= left:
                                    pending.remove(pair)
                                    left, right = min(left, pair[0]), max(right, pair[1])
                                    changed = True
                        expected.append([left, right])
                    self.assertEqual(result, sorted(expected))
                elif id == 'meeting_rooms':
                    self.assertEqual(result, max((sum(start <= time < end for start, end in data['intervals']) for time, _ in data['intervals']), default=0))
                elif id == 'top_k':
                    counts = Counter(a)
                    self.assertEqual(result, sorted(counts, key=lambda x: (-counts[x], x))[:data['k']])
                elif id == 'quickselect':
                    self.assertEqual(result, sorted(a, reverse=True)[data['k'] - 1])
                elif id == 'next_greater':
                    self.assertEqual(result, [next((x for x in a[i + 1:] if x > value), -1) for i, value in enumerate(a)])
                elif id == 'window_max':
                    self.assertEqual(result, [max(a[i:i + data['k']]) for i in range(n - data['k'] + 1)] if a else [])
                elif id == 'jump':
                    reachable = {0} if a else set()
                    for i in range(n):
                        if i in reachable:
                            reachable.update(range(i + 1, min(n, i + a[i] + 1)))
                    self.assertEqual(result, n - 1 in reachable)
                elif id == 'gas_station':
                    valid = []
                    for start in range(len(data['gas'])):
                        tank = 0
                        for step in range(len(data['gas'])):
                            index = (start + step) % len(data['gas'])
                            tank += data['gas'][index] - data['cost'][index]
                            if tank < 0:
                                break
                        else:
                            valid.append(start)
                    self.assertIn(result, valid or [-1])
                elif id == 'robber':
                    self.assertEqual(result, max((sum(a[i] for i in indices) for indices in subsets_indices(n) if all(y - x > 1 for x, y in zip(indices, indices[1:]))), default=0))
                elif id == 'partition':
                    self.assertEqual(result, any(2 * sum(a[i] for i in indices) == sum(a) for indices in subsets_indices(n)))
                elif id == 'knapsack':
                    indices = subsets_indices(len(data['weights']))
                    self.assertEqual(result, max(sum(data['values'][i] for i in chosen) for chosen in indices if sum(data['weights'][i] for i in chosen) <= data['capacity']))
                elif id == 'subsets':
                    self.assertEqual(sorted(map(tuple, result)), sorted(tuple(a[i] for i in chosen) for chosen in subsets_indices(n)))
                elif id == 'permutations':
                    self.assertEqual(list(map(tuple, result)), list(itertools.permutations(a)))
                elif id == 'combination':
                    values, expected = sorted(set(a)), []
                    for counts in itertools.product(*(range(data['target'] // value + 1) for value in values)):
                        if sum(value * count for value, count in zip(values, counts)) == data['target']:
                            expected.append([value for value, count in zip(values, counts) for _ in range(count)])
                    self.assertEqual(sorted(result), sorted(expected))
                elif id == 'queens':
                    self.assertEqual(len(result), {1: 1, 2: 0, 3: 0, 4: 2, 5: 10}[data['n']])
                    self.assertEqual(len({tuple(board) for board in result}), len(result))
                    for board in result:
                        columns = [line.index('Q') for line in board]
                        self.assertEqual(len(set(columns)), data['n'])
                        self.assertEqual(len({r - c for r, c in enumerate(columns)}), data['n'])
                        self.assertEqual(len({r + c for r, c in enumerate(columns)}), data['n'])
                elif id in {'islands', 'union_find'}:
                    if id == 'islands':
                        grid = data['grid']
                        nodes = {(r, c) for r, line in enumerate(grid) for c, value in enumerate(line) if value == 1}
                        neighbors = {cell: {other for other in nodes if abs(cell[0] - other[0]) + abs(cell[1] - other[1]) == 1} for cell in nodes}
                    else:
                        nodes = set(range(data['n']))
                        neighbors = {v: set() for v in nodes}
                        for u, v in data['edges']:
                            neighbors[u].add(v); neighbors[v].add(u)
                    groups = []
                    while nodes:
                        stack, component = [next(iter(nodes))], set()
                        while stack:
                            vertex = stack.pop()
                            if vertex in component:
                                continue
                            component.add(vertex); stack.extend(neighbors[vertex] - component)
                        nodes -= component; groups.append(sorted(component))
                    if id == 'islands':
                        self.assertEqual(result, len(groups))
                    else:
                        self.assertEqual(result, {'count': len(groups), 'groups': sorted(groups, key=lambda group: group[0])})
                elif id == 'fenwick':
                    values = list(a)
                    for i, delta in data['updates']:
                        values[i] += delta
                    self.assertEqual(result, {'array': values, 'sums': [sum(values[left:right + 1]) for left, right in data['queries']]})

    def test_standalone_samples(self):
        source = (ROOT / 'assets/pattern-python.js').read_text(encoding='utf-8')
        samples = json.loads(source[source.index('{'):source.rindex('}') + 1])
        self.assertEqual(len(samples), 27)
        for id, sample in samples.items():
            with self.subTest(id=id), contextlib.redirect_stdout(io.StringIO()):
                exec(compile(sample, '<interview-example>', 'exec'), {})


if __name__ == '__main__':
    if '--fixtures' in sys.argv:
        print(json.dumps([{'id': id, 'data': data, 'expected': getattr(reference, NAMES[id])(**data)} for id, data in cases()]))
    else:
        unittest.main()
