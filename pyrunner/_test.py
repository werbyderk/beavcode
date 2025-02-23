import unittest
import submission

class TestMethods(unittest.TestCase):
    def test_sum(self):
        '''Can add numbers'''
        self.assertEqual(submission.fn(3,4), 7)
