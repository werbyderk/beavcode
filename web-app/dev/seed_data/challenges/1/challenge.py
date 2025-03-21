import unittest
import submission
from memory_profiler import profile

@profile
def test_mem():
    submission.fib(10)

class TestMethods(unittest.TestCase):
    def test_sum(self):
        '''Can fib'''
        self.assertEqual(submission.fib(25), 75025)

if __name__ == '__main__':
    test_mem()