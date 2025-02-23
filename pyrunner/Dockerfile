FROM python:alpine3.21

# Server setup
WORKDIR /usr/src/app/server
# Server virtual environment set up (run_env should only have access to default modules)
RUN python -m venv --symlinks --without-scm-ignore-files .venv
RUN source .venv/bin/activate
# Server dependencies, source code
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY server/server.py ./
COPY server/exec_test.sh ./
WORKDIR /usr/src/app
RUN chmod 770 -R server

# Sandbox setup
RUN adduser sandbox -D -h /
RUN passwd sandbox -d
WORKDIR /usr/src/app/run_env
COPY run_env/wrapper.py ./
RUN touch output.json
RUN mkdir -p usr/local/bin
RUN mkdir -p usr/local/lib
RUN mkdir bin lib etc
# TODO: only copy sandbox's passwd
RUN cp /etc/passwd etc
RUN cp /etc/shadow etc
# Copy binaries, linked files to chroot jail
RUN cp $(which sh) bin
RUN cp $(which login) bin
RUN cp $(which whoami) bin
RUN cp $(which su) bin
RUN cp $(which python) usr/local/bin
RUN cp /lib/ld-musl-aarch64.so.1 lib
RUN cp /usr/local/lib/libpython3.13.so.1.0 usr/local/lib
RUN cp -r /usr/local/lib/python3.13 usr/local/lib
WORKDIR /usr/src/app
RUN chmod -R 775 run_env 
RUN chmod 666 run_env/output.json

WORKDIR /usr/src/app/server
EXPOSE 3000
CMD [ "python", "./server.py" ]