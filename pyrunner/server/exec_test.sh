#!/bin/sh
# TODO: Can user logout of sandbox, back into root?
# old: chroot ../run_env bin/sh -c "su sandbox -c \"usr/local/bin/python -B wrapper.py > output.json\""
# newer: chroot ../run_env bin/sh -c "su sandbox -c \"cd home && python -B wrapper.py > output.json\""
#ubunut: chroot ../run_env /bin/bash -c "su sandbox -c \"cd home && python3 -B wrapper.py > output.json\""
# chroot ../run_env /bin/bash -c "python3 -B wrapper.py > output.json"

#no chroot
cd ../run_env && su sandbox -c "python -B wrapper.py > output.json"