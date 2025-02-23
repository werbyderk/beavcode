#!/bin/sh
chroot ../run_env bin/sh -c "su sandbox -c \"usr/local/bin/python -B wrapper.py > output.json\""