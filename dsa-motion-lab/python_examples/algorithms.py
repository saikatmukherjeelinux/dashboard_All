"""Reference implementations corresponding to lessons in the website.
Run: python python_examples/algorithms.py
"""
from collections import deque


def bubble_sort(items):
    a = list(items)
    for end in range(len(a) - 1, 0, -1):
        swapped = False
        for i in range(end):
            if a[i] > a[i + 1]:
                a[i], a[i + 1] = a[i + 1], a[i]
                swapped = True
        if not swapped:
            break
    return a


def selection_sort(items):
    a = list(items)
    for i in range(len(a)):
        m = min(range(i, len(a)), key=lambda j: a[j])
        a[i], a[m] = a[m], a[i]
    return a


def insertion_sort(items):
    a = list(items)
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a


def linear_search(items, target):
    return next((i for i, x in enumerate(items) if x == target), -1)


def binary_search(sorted_items, target):
    lo, hi = 0, len(sorted_items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if sorted_items[mid] == target:
            return mid
        if sorted_items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


def bfs(graph, start):
    seen, queue, order = {start}, deque([start]), []
    while queue:
        v = queue.popleft()
        order.append(v)
        for w in graph.get(v, []):
            if w not in seen:
                seen.add(w)
                queue.append(w)
    return order


def dfs(graph, start):
    seen, order = set(), []

    def visit(v):
        if v in seen:
            return
        seen.add(v)
        order.append(v)
        for w in graph.get(v, []):
            visit(w)

    visit(start)
    return order


if __name__ == '__main__':
    data = [8, 3, 5, 1, 9, 2]
    for sorting_function in (bubble_sort, selection_sort, insertion_sort):
        print(sorting_function.__name__, sorting_function(data))
    print('linear_search:', linear_search(data, 5))
    print('binary_search:', binary_search(sorted(data), 5))
    graph = {'A': ['B', 'C'], 'B': ['D', 'E'], 'C': ['F'],
             'D': [], 'E': ['F'], 'F': []}
    print('bfs:', bfs(graph, 'A'))
    print('dfs:', dfs(graph, 'A'))


def merge_sort(items):
    if len(items) <= 1:
        return list(items)
    mid = len(items) // 2
    left, right = merge_sort(items[:mid]), merge_sort(items[mid:])
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]



def quick_sort(items):
    a = list(items)
    def sort(lo, hi):
        if lo >= hi:
            return
        pivot, p = a[hi], lo
        for j in range(lo, hi):
            if a[j] <= pivot:
                a[p], a[j] = a[j], a[p]
                p += 1
        a[p], a[hi] = a[hi], a[p]
        sort(lo, p - 1)
        sort(p + 1, hi)
    sort(0, len(a) - 1)
    return a



def heap_sort(items):
    a = list(items)
    def sift(root, end):
        while 2 * root + 1 < end:
            child = 2 * root + 1
            if child + 1 < end and a[child] < a[child + 1]:
                child += 1
            if a[root] >= a[child]:
                break
            a[root], a[child] = a[child], a[root]
            root = child
    for root in range(len(a) // 2 - 1, -1, -1):
        sift(root, len(a))
    for end in range(len(a) - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift(0, end)
    return a



def prefix_sums(items):
    result = []
    total = 0
    for value in items:
        total += value
        result.append(total)
    return result



def maximum_subarray(items):
    if not items:
        raise ValueError("Expected at least one number")
    current = best = items[0]
    for value in items[1:]:
        current = max(value, current + value)
        best = max(best, current)
    return best



def fibonacci_table(n):
    if n < 0:
        raise ValueError("n must be nonnegative")
    table = [0] * n
    if n > 1:
        table[1] = 1
    for i in range(2, n):
        table[i] = table[i - 1] + table[i - 2]
    return table



def dijkstra(graph, start):
    vertices = set(graph) | {start}
    for edges in graph.values():
        for neighbor, weight in edges:
            if weight < 0:
                raise ValueError("Dijkstra requires nonnegative weights")
            vertices.add(neighbor)
    distance = dict.fromkeys(vertices, float('inf'))
    distance[start] = 0
    remaining = set(vertices)
    while remaining:
        node = min(remaining, key=distance.get)
        if distance[node] == float('inf'):
            break
        remaining.remove(node)
        for neighbor, weight in graph.get(node, []):
            distance[neighbor] = min(distance[neighbor], distance[node] + weight)
    return distance



def kruskal(vertices, edges):
    parent = {v: v for v in vertices}
    size = {v: 1 for v in vertices}
    def find(v):
        while parent[v] != v:
            parent[v] = parent[parent[v]]
            v = parent[v]
        return v
    tree, total = [], 0
    for u, v, weight in sorted(edges, key=lambda edge: edge[2]):
        a, b = find(u), find(v)
        if a == b:
            continue
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        tree.append((u, v, weight))
        total += weight
    return tree, total  # A forest if the graph is disconnected.



from collections import deque

def topological_sort(graph):
    indegree = {v: 0 for v in graph}
    for neighbors in graph.values():
        for v in neighbors:
            indegree[v] = indegree.get(v, 0) + 1
    queue = deque(v for v in indegree if indegree[v] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    if len(order) != len(indegree):
        raise ValueError("Graph contains a cycle")
    return order



def longest_increasing_subsequence(items):
    if not items:
        return []
    lengths, previous = [1] * len(items), [-1] * len(items)
    for i in range(len(items)):
        for j in range(i):
            if items[j] < items[i] and lengths[j] + 1 > lengths[i]:
                lengths[i] = lengths[j] + 1
                previous[i] = j
    index = max(range(len(items)), key=lambda i: lengths[i])
    result = []
    while index != -1:
        result.append(items[index])
        index = previous[index]
    return result[::-1]



def coin_change(coins, amount):
    if not isinstance(amount, int) or amount < 0:
        raise ValueError("Amount must be a nonnegative integer")
    if any(not isinstance(c, int) or c <= 0 for c in coins):
        raise ValueError("Coins must be positive integers")
    best = [0] + [float('inf')] * amount
    choice = [None] * (amount + 1)
    for value in range(1, amount + 1):
        for coin in coins:
            if coin <= value and best[value - coin] + 1 < best[value]:
                best[value] = best[value - coin] + 1
                choice[value] = coin
    if best[amount] == float('inf'):
        return -1, []
    result, remaining = [], amount
    while remaining:
        coin = choice[remaining]
        result.append(coin)
        remaining -= coin
    return best[amount], result



def kmp_search(text, pattern):
    if not pattern:
        return 0
    lps = [0] * len(pattern)
    length, i = 0, 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            i += 1
    i = j = 0
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):
                return i - j
        elif j:
            j = lps[j - 1]
        else:
            i += 1
    return -1

