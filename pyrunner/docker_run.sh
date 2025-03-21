#! /bin/zsh

docker run -p 3001:3001 --cpus="0.5" --cpuset-cpus 0 --cpu-shares=9999 pyrunner:dev