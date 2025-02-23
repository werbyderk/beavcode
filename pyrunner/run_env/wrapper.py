import unittest
import test
import json

def parse_test_results(test_result):
   return list(map(lambda tr: (tr[0].shortDescription(), tr[1]), test_result))

def execute_test():
      suite = unittest.TestSuite()
      for method in dir(test.TestMethods):
          if method.startswith("test"):
            suite.addTest(test.TestMethods(method))
      test_runner = unittest.TextTestRunner().run(suite)
      results = {
        "errors": parse_test_results(test_runner.errors),
        "failures": parse_test_results(test_runner.failures),
        "durations": test_runner.collectedDurations
      }
      return results
if __name__ == '__main__':
    try:
      test_result = execute_test()
      
      if len(test_result['errors']) + len(test_result['failures']) == 0:
        total_runtime = 0
        for _ in range(3):
          durations = execute_test()['durations']
          for d in durations:
            total_runtime += d[1]
        avg_runtime = total_runtime / 3
        print(json.dumps({
          "wrapper_success": True,
          "test_success": True,
          "test_runtime": avg_runtime
        }))
      else:
         print(json.dumps({
            "wrapper_success": True,
            "test_success": False,
            "errors": test_result["errors"],
            "failures": test_result["failures"]
         }))
    except Exception as err:
       print(json.dumps({
          "wrapper_success": False,
          "wrapper_error": err
       }))
          
