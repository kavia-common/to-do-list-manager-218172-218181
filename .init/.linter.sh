#!/bin/bash
cd /home/kavia/workspace/code-generation/to-do-list-manager-218172-218181/to_do_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

