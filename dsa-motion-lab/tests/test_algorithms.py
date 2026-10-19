import unittest
from python_examples.algorithms import (
    bubble_sort, selection_sort, insertion_sort,
    linear_search, binary_search, bfs, dfs,
    merge_sort, quick_sort, heap_sort, prefix_sums,
    maximum_subarray, fibonacci_table
)


class AlgorithmsTest(unittest.TestCase):
    def test_sorts(self):
        for fn in (bubble_sort, selection_sort, insertion_sort, merge_sort, quick_sort, heap_sort):
            for values in ([], [1], [4, 4, -1, 3], [5, 2, 8, 1]):
                with self.subTest(fn=fn.__name__, values=values):
                    self.assertEqual(fn(values), sorted(values))
                    original = list(values)
                    fn(values)
                    self.assertEqual(values, original)

    def test_patterns(self):
        self.assertEqual(prefix_sums([3, -5, 4]), [3, -2, 2])
        self.assertEqual(prefix_sums([]), [])
        self.assertEqual(maximum_subarray([-4, -2, -8]), -2)
        self.assertEqual(maximum_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6)
        with self.assertRaises(ValueError):
            maximum_subarray([])
        self.assertEqual(fibonacci_table(0), [])
        self.assertEqual(fibonacci_table(1), [0])
        self.assertEqual(fibonacci_table(7), [0, 1, 1, 2, 3, 5, 8])
        with self.assertRaises(ValueError):
            fibonacci_table(-1)

    def test_search(self):
        self.assertEqual(linear_search([3, 2, 5], 5), 2)
        self.assertEqual(linear_search([3, 2, 5], 7), -1)
        self.assertEqual(binary_search([1, 3, 5, 7], 5), 2)
        self.assertEqual(binary_search([1, 3, 5, 7], 4), -1)

    def test_graph(self):
        graph = {'A': ['B', 'C'], 'B': ['D'], 'C': [], 'D': []}
        self.assertEqual(bfs(graph, 'A'), ['A', 'B', 'C', 'D'])
        self.assertEqual(dfs(graph, 'A'), ['A', 'B', 'D', 'C'])


if __name__ == '__main__':
    unittest.main()
