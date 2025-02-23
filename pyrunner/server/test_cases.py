import unittest
import run

class TestMethods(unittest.TestCase):

    def test_sum(self):
        x = run.fn(1,2)
        self.assertEqual(x, 3)

if __name__ == '__main__':
    unittest.main()