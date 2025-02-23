from flask import Flask, request
import subprocess
import json

app = Flask(__name__)

@app.route("/run", methods=['POST'])
def run():
    submission_py_code = request.files['submission']
    unittest_py_code = request.files['test']

    if not submission_py_code or not unittest_py_code:
        return 'Bad request'

    with open('../run_env/submission.py', 'wb') as dest:
        dest.write(submission_py_code.stream.read())
    with open('../run_env/test.py', 'wb') as dest:
        dest.write(unittest_py_code.stream.read())
    try:
        proc = subprocess.run('./exec_test.sh', capture_output=True, text=True, check=False, timeout=3)
    except subprocess.TimeoutExpired:
        return 'Submission timed out.'
    if proc.returncode != 0:
        return 'Failed to execute test.'
    with open('../run_env/output.json', 'r') as proc_stdout:
        try:
            test_results = json.loads(proc_stdout.read())
        except json.decoder.JSONDecodeError as err:
            return 'Failed to execute test' + proc.stdout + proc.stderr + str(proc.returncode)
        
    if not test_results.get('wrapper_success'):
        return 'Something went wrong running the test suite.'
    return test_results

if __name__ == '__main__':
    app.run(port=3000, debug=True, host='0.0.0.0')