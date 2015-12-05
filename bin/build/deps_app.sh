#!/bin/bash

WORKSPACE=$1
GOOG_BIN_PATH=$2
PROJECT_NAME=$3

JS_PATH=${WORKSPACE}/public/js

echo "-----------------------------------------------------"

figlet Build JS Dependencies

echo "WORKSPACE:            ${WORKSPACE}"
echo "GOOG_BIN_PATH:        ${GOOG_BIN_PATH}"
echo "PROJECT_NAME:         ${PROJECT_NAME}"
echo "-----------------------------------------------------"
echo ""

# Just start somewhere.
cd ${WORKSPACE}

chmod +x ${GOOG_BIN_PATH}/*.py

${GOOG_BIN_PATH}/depswriter.py \
    --root_with_prefix="public/js/contracts ../../../contracts" \
    --root_with_prefix="public/js/${PROJECT_NAME} ../../../${PROJECT_NAME}" \
    --root_with_prefix="public/js/bad-library/bad ../../../bad-library/bad"> ${JS_PATH}/deps.js


