from flask import Flask, request
from flask_cors import CORS
import subprocess
import json
import logging
logging.basicConfig(level=logging.DEBUG)
import sys

app = Flask(__name__)
CORS(app)

@app.route("/run", methods=['POST'])
def run():
    submission_py_code = request.files.get('submission')
    unittest_py_code = request.files.get('test')
    if not submission_py_code or not unittest_py_code:
        return 'Bad request', 400
    
    with open('../run_env/submission.py', 'wb') as dest:
        dest.write(submission_py_code.stream.read())
    with open('../run_env/test.py', 'wb') as dest:
        dest.write(unittest_py_code.stream.read())
    try:
        proc = subprocess.run('./exec_test.sh', capture_output=True, text=True, check=False, timeout=15)
    except subprocess.TimeoutExpired:
        return 'Submission timed out.', 500
    if proc.returncode != 0:
        print('Failed to start test env: ', proc.stderr, file=sys.stderr)
        return 'Failed to execute test.', 500
    
    with open('../run_env/output.json', 'r') as proc_stdout:
        try:
            test_results = json.loads(proc_stdout.read())
        except json.decoder.JSONDecodeError as err:
            return 'Failed to execute test', 500
        
    if not test_results.get('wrapper_success'):
        print('Something went wrong running the test suite.')
        return 'Something went wrong running the test suite.', 500

    return test_results, 200

if __name__ == '__main__':
    app.run(port=3001, host='0.0.0.0')
