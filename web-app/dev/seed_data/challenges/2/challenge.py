import unittest
import submission
from memory_profiler import profile

@profile
def test_mem():
    submission.regex("aa", "a*")

class TestMethods(unittest.TestCase):
    def test_0(self):
        '''aa, a'''
        self.assertFalse(submission.regex("aa","a"))

    def test_1(self):
        '''aa, a*'''
        self.assertTrue(submission.regex('aa', 'a*'))
        
if __name__ == '__main__':
    test_mem()