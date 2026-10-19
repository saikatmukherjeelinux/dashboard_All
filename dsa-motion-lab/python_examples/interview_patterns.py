"""27 interview-focused reference algorithms. The UI enforces teaching limits.

Functions preserve their supplied arrays. Ranges and special-case conventions
are documented in the corresponding interactive lesson.
"""
from collections import Counter, deque
import heapq


def two_sum(nums, target):
    seen = {}
    for i, value in enumerate(nums):
        if target - value in seen:
            return [seen[target - value], i]
        seen.setdefault(value, i)
    return []


def three_sum(nums):
    values, result = sorted(nums), []
    for i in range(len(values) - 2):
        if i and values[i] == values[i - 1]:
            continue
        left, right = i + 1, len(values) - 1
        while left < right:
            total = values[i] + values[left] + values[right]
            if total == 0:
                result.append([values[i], values[left], values[right]])
                left, right = left + 1, right - 1
                while left < right and values[left] == values[left - 1]:
                    left += 1
                while left < right and values[right] == values[right + 1]:
                    right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result


def product_except_self(nums):
    result, prefix, suffix = [1] * len(nums), 1, 1
    for i, value in enumerate(nums):
        result[i] = prefix
        prefix *= value
    for i in range(len(nums) - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    return result


def subarray_sum_k(nums, target):
    counts, prefix, answer = {0: 1}, 0, 0
    for value in nums:
        prefix += value
        answer += counts.get(prefix - target, 0)
        counts[prefix] = counts.get(prefix, 0) + 1
    return answer


def longest_consecutive(nums):
    values, best = set(nums), 0
    for start in values:
        if start - 1 in values:
            continue
        end = start
        while end in values:
            end += 1
        best = max(best, end - start)
    return best


def trapped_water(nums):
    if any(value < 0 for value in nums):
        raise ValueError('Heights must be nonnegative')
    left, right, left_max, right_max, total = 0, len(nums) - 1, 0, 0, 0
    while left <= right:
        if nums[left] <= nums[right]:
            left_max = max(left_max, nums[left])
            total += left_max - nums[left]
            left += 1
        else:
            right_max = max(right_max, nums[right])
            total += right_max - nums[right]
            right -= 1
    return total


def container_area(nums):
    left, right, best = 0, len(nums) - 1, 0
    while left < right:
        best = max(best, (right - left) * min(nums[left], nums[right]))
        if nums[left] <= nums[right]:
            left += 1
        else:
            right -= 1
    return best


def dutch_flag(nums):
    if any(value not in (0, 1, 2) for value in nums):
        raise ValueError('Only 0, 1 and 2 are allowed')
    values = list(nums)
    low = middle = 0
    high = len(values) - 1
    while middle <= high:
        if values[middle] == 0:
            values[low], values[middle] = values[middle], values[low]
            low, middle = low + 1, middle + 1
        elif values[middle] == 1:
            middle += 1
        else:
            values[middle], values[high] = values[high], values[middle]
            high -= 1
    return values


def rotated_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        middle = (left + right) // 2
        if nums[middle] == target:
            return middle
        if nums[left] <= nums[middle]:
            if nums[left] <= target < nums[middle]:
                right = middle - 1
            else:
                left = middle + 1
        elif nums[middle] < target <= nums[right]:
            left = middle + 1
        else:
            right = middle - 1
    return -1


def merge_intervals(intervals):
    merged = []
    for start, end in sorted(intervals):
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged


def meeting_rooms(intervals):
    active, best = [], 0
    for start, end in sorted(intervals):
        while active and active[0] <= start:
            heapq.heappop(active)
        heapq.heappush(active, end)
        best = max(best, len(active))
    return best


def top_k_frequent(nums, k):
    counts = Counter(nums)
    if not 0 <= k <= len(counts):
        raise ValueError('k must not exceed the number of distinct values')
    heap = []
    for value, count in counts.items():
        heapq.heappush(heap, (count, -value))
        if len(heap) > k:
            heapq.heappop(heap)
    return [-negative for count, negative in sorted(heap, key=lambda item: (-item[0], -item[1]))]


def kth_largest(nums, k):
    if not 1 <= k <= len(nums):
        raise ValueError('k must be from 1 through len(nums)')
    values, target = list(nums), len(nums) - k
    left, right = 0, len(values) - 1
    while left <= right:
        pivot = values[(left + right) // 2]
        low, current, high = left, left, right
        while current <= high:
            if values[current] < pivot:
                values[low], values[current] = values[current], values[low]
                low, current = low + 1, current + 1
            elif values[current] > pivot:
                values[current], values[high] = values[high], values[current]
                high -= 1
            else:
                current += 1
        if target < low:
            right = low - 1
        elif target > high:
            left = high + 1
        else:
            return values[target]


def next_greater(nums):
    stack, result = [], [-1] * len(nums)
    for i, value in enumerate(nums):
        while stack and nums[stack[-1]] < value:
            result[stack.pop()] = value
        stack.append(i)
    return result


def window_maximum(nums, k):
    if not nums and k == 0:
        return []
    if not 1 <= k <= len(nums):
        raise ValueError('Invalid window size')
    candidates, result = deque(), []
    for i, value in enumerate(nums):
        while candidates and candidates[0] <= i - k:
            candidates.popleft()
        while candidates and nums[candidates[-1]] <= value:
            candidates.pop()
        candidates.append(i)
        if i >= k - 1:
            result.append(nums[candidates[0]])
    return result


def jump_game(nums):
    frontier = 0
    for i, jump in enumerate(nums):
        if i > frontier:
            return False
        frontier = max(frontier, i + jump)
        if frontier >= len(nums) - 1:
            return True
    return False


def gas_station(gas, cost):
    if len(gas) != len(cost):
        raise ValueError('gas and cost must have equal length')
    total = tank = start = 0
    for i, (supply, price) in enumerate(zip(gas, cost)):
        total += supply - price
        tank += supply - price
        if tank < 0:
            start, tank = i + 1, 0
    return start if gas and total >= 0 else -1


def house_robber(nums):
    previous_two = previous_one = 0
    for value in nums:
        previous_two, previous_one = previous_one, max(previous_one, previous_two + value)
    return previous_one


def equal_partition(nums):
    if any(value < 0 for value in nums):
        raise ValueError('Values must be nonnegative')
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    possible = [True] + [False] * target
    for value in nums:
        for amount in range(target, value - 1, -1):
            possible[amount] = possible[amount] or possible[amount - value]
    return possible[target]


def knapsack(weights, values, capacity):
    if len(weights) != len(values) or capacity < 0 or any(weight < 0 for weight in weights):
        raise ValueError('Invalid weights, values or capacity')
    best = [0] * (capacity + 1)
    for weight, value in zip(weights, values):
        for remaining in range(capacity, weight - 1, -1):
            best[remaining] = max(best[remaining], best[remaining - weight] + value)
    return best[capacity]


def subsets(nums):
    result, path = [], []
    def visit(start):
        result.append(path.copy())
        for i in range(start, len(nums)):
            path.append(nums[i])
            visit(i + 1)
            path.pop()
    visit(0)
    return result


def permutations(nums):
    result, path, used = [], [], [False] * len(nums)
    def visit():
        if len(path) == len(nums):
            result.append(path.copy())
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            visit()
            path.pop()
            used[i] = False
    visit()
    return result


def combination_sum(nums, target):
    if target < 0 or any(value <= 0 for value in nums):
        raise ValueError('Use positive candidates and nonnegative target')
    candidates, result, path = sorted(set(nums)), [], []
    def visit(start, remaining):
        if remaining == 0:
            result.append(path.copy())
            return
        for i in range(start, len(candidates)):
            value = candidates[i]
            if value > remaining:
                break
            path.append(value)
            visit(i, remaining - value)
            path.pop()
    visit(0, target)
    return result


def n_queens(n):
    if n < 1:
        raise ValueError('Use a positive board size')
    board = [['.'] * n for _ in range(n)]
    columns, diagonal_one, diagonal_two, result = set(), set(), set(), []
    def visit(row):
        if row == n:
            result.append([''.join(line) for line in board])
            return
        for column in range(n):
            if column in columns or row - column in diagonal_one or row + column in diagonal_two:
                continue
            board[row][column] = 'Q'
            columns.add(column)
            diagonal_one.add(row - column)
            diagonal_two.add(row + column)
            visit(row + 1)
            board[row][column] = '.'
            columns.remove(column)
            diagonal_one.remove(row - column)
            diagonal_two.remove(row + column)
    visit(0)
    return result


def number_of_islands(grid):
    if not grid:
        return 0
    rows, columns = len(grid), len(grid[0])
    seen, count = set(), 0
    for row in range(rows):
        for column in range(columns):
            if grid[row][column] != 1 or (row, column) in seen:
                continue
            count += 1
            queue = deque([(row, column)])
            seen.add((row, column))
            while queue:
                x, y = queue.popleft()
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < rows and 0 <= ny < columns and grid[nx][ny] == 1 and (nx, ny) not in seen:
                        seen.add((nx, ny))
                        queue.append((nx, ny))
    return count


def connected_components(n, edges):
    parent, size, count = list(range(n)), [1] * n, n
    def find(vertex):
        while parent[vertex] != vertex:
            parent[vertex] = parent[parent[vertex]]
            vertex = parent[vertex]
        return vertex
    for first, second in edges:
        a, b = find(first), find(second)
        if a == b:
            continue
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        count -= 1
    groups = {}
    for vertex in range(n):
        groups.setdefault(find(vertex), []).append(vertex)
    return {'count': count, 'groups': sorted(groups.values(), key=lambda group: group[0])}


def fenwick_ranges(nums, updates, queries):
    values, tree = list(nums), [0] * (len(nums) + 1)
    def add(index, delta):
        i = index + 1
        while i < len(tree):
            tree[i] += delta
            i += i & -i
    def prefix(end):
        result = 0
        while end > 0:
            result += tree[end]
            end -= end & -end
        return result
    for i, value in enumerate(values):
        add(i, value)
    for i, delta in updates:
        values[i] += delta
        add(i, delta)
    return {'array': values, 'sums': [prefix(right + 1) - prefix(left) for left, right in queries]}
