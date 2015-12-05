#!/bin/bash

WORKSPACE=$1
GOOG_BIN_PATH=$2
PROJECT_NAME=$3

JS_PATH=${WORKSPACE}/public/js

echo "-----------------------------------------------------"

figlet NODE Deps

echo "WORKSPACE:        ${WORKSPACE}"
echo "GOOG_BIN_PATH:    ${GOOG_BIN_PATH}"
echo "PROJECT_NAME:     ${PROJECT_NAME}"
echo "-----------------------------------------------------"
echo ""

# Just start somewhere.
cd ${WORKSPACE}

# The path should be relative to where goog.base is...
${GOOG_BIN_PATH}/depswriter.py \
    --root_with_prefix="public/js/contracts ../../../../public/js/contracts" > deps.js
