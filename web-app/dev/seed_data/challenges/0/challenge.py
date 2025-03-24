import unittest
import submission
from memory_profiler import profile

@profile
def test_mem():
    submission.twoSum([2,7,11,15], 9)

class TestMethods(unittest.TestCase):
    def test_0(self):
        self.assertEqual(submission.twoSum([2,7,11,15], 9), [0,1])
    def test_1(self):
        self.assertEqual(submission.twoSum([3,2,4], 6), [1,2])

if __name__ == '__main__':
    test_mem()