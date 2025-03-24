import unittest
import test
import json
from time import time
from subprocess import run as exec_sh
import re

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
      }
      return results


if __name__ == '__main__':
    try:
      test_result = execute_test()

      if len(test_result['errors']) + len(test_result['failures']) == 0:
        # Get memory usage of the submission using a test function from unit test source
        mem_profile = exec_sh('./exec_mem_profile.sh', capture_output=True, text=True, check=False, timeout=15)
        out = mem_profile.stdout + mem_profile.stderr
        mem_matches = re.findall(r'\d+\.\d+ MiB', out)
        mem_values = map(lambda m: float(m.split()[0]), mem_matches)
        max_mem_usage = max(mem_values) * 1.048576 # MiB to MB

        total_runtime = 0
        for _ in range(15):
          start = time()
          execute_test()
          end = time()
          duration = (end - start) * 1000
          total_runtime += duration
        avg_runtime = round(total_runtime / 30)
        print(json.dumps({
          "wrapper_success": True,
          "test_success": True,
          "test_runtime": avg_runtime,
          "mem_usage": max_mem_usage
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
          "wrapper_error": str(err)
       }))
          
