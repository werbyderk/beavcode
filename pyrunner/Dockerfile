FROM python:alpine3.21

RUN apk add build-base linux-headers wget

# Sandbox setup
RUN adduser sandbox -D -h /
RUN passwd sandbox -d
WORKDIR /home/run_env
COPY run_env/wrapper.py ./
COPY run_env/exec_mem_profile.sh ./
RUN chmod 755 exec_mem_profile.sh
RUN touch output.json
RUN chmod 666 output.json

# Server setup
WORKDIR /home/server
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY server/server.py ./
COPY server/exec_test.sh ./

WORKDIR /home
RUN chmod 700 -R server

WORKDIR /home/server
EXPOSE 3001

CMD ["gunicorn", "-b", "0.0.0.0:3001", "server:app"]