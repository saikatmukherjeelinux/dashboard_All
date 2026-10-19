import unittest
from python_examples.algorithms import (
    dijkstra, kruskal, topological_sort,
    longest_increasing_subsequence, coin_change, kmp_search,
)


class AdvancedAlgorithmsTest(unittest.TestCase):
    def test_shortest_paths(self):
        graph = {'A': [('B', 4), ('C', 2)], 'C': [('B', 1)], 'Z': []}
        distances = dijkstra(graph, 'A')
        self.assertEqual([distances[v] for v in 'ABC'], [0, 3, 2])
        self.assertEqual(distances['Z'], float('inf'))
        self.assertEqual(dijkstra({}, 'A'), {'A': 0})
        with self.assertRaises(ValueError):
            dijkstra({'A': [('B', -1)]}, 'A')

    def test_spanning_tree(self):
        edges = [('A', 'B', 4), ('A', 'C', 2), ('B', 'C', 1)]
        tree, total = kruskal('ABC', edges)
        self.assertEqual(total, 3)
        self.assertEqual(len(tree), 2)
        self.assertEqual(kruskal('AB', []), ([], 0))

    def test_topological_order(self):
        graph = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D']}
        order = topological_sort(graph)
        self.assertEqual(set(order), set('ABCD'))
        for node, neighbors in graph.items():
            for neighbor in neighbors:
                self.assertLess(order.index(node), order.index(neighbor))
        self.assertEqual(topological_sort({}), [])
        with self.assertRaises(ValueError):
            topological_sort({'A': ['B'], 'B': ['A']})

    def test_lis(self):
        for items, length in [([], 0), ([2, 2, 2], 1), ([4, 3, 2], 1),
                              ([-4, -3, -2], 3), ([3, 1, 2, 5, 4], 3)]:
            result = longest_increasing_subsequence(items)
            self.assertEqual(len(result), length)
            self.assertTrue(all(a < b for a, b in zip(result, result[1:])))
            remaining = iter(items)
            self.assertTrue(all(any(x == value for x in remaining) for value in result))

    def test_coin_change(self):
        count, coins = coin_change([1, 3, 4], 6)
        self.assertEqual(count, 2)
        self.assertEqual(sum(coins), 6)
        self.assertEqual(coin_change([2, 4], 3), (-1, []))
        self.assertEqual(coin_change([], 0), (0, []))
        self.assertEqual(coin_change([], 4), (-1, []))
        for coins, amount in [([0], 3), ([-2], 3), ([1.5], 3), ([1], -1)]:
            with self.assertRaises(ValueError):
                coin_change(coins, amount)

    def test_kmp(self):
        for text in ['', 'ABC', 'ABACABAB', 'AAAAAB', '🙂a🙂b']:
            for pattern in ['', 'A', 'ABAB', 'AAAB', 'D', '🙂b']:
                with self.subTest(text=text, pattern=pattern):
                    self.assertEqual(kmp_search(text, pattern), text.find(pattern))


if __name__ == '__main__':
    unittest.main()
