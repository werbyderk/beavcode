def twoSum(nums, target):
  solution = []
  def ts(i, prev_sum):
    if prev_sum == target and len(solution) == 2:
        return True
    if len(solution) > 2 or prev_sum > target:
      return False
    
    for j in range(i, len(nums)):
      next_sum = prev_sum + nums[j]
      solution.append(j)
      valid = ts(j + 1, next_sum)
      if valid:
        return True
      solution.pop()

  ts(0, 0)
  return solution
  

# print(twoSum([2,7,11,15], 9))