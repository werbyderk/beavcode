import unittest
import submission
from memory_profiler import profile

@profile
def test_mem():
    pass
    # submission.fib(25)

class TestMethods(unittest.TestCase):
    def test_sum(self):
        '''My unittest'''
        pass
        #self.assertEqual(submission.fib(25), 75025)

if __name__ == '__main__':
    test_mem()