#!/bin/bash

WORKSPACE=$1
PROJECT_NAME=$2


echo "-------------------------------------------------------------------------"

figlet Closure Linter

echo "WORKSPACE: ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "-------------------------------------------------------------------------"
echo ""

command -v easy_install >/dev/null 2>&1 || { echo >&2 "I require easy_install but it's not installed.  Aborting."; exit 1; }

cd ${WORKSPACE}/bin/build/parts/;

os=${OSTYPE//[0-9.]/};

if command -v ~/.local/bin/gjslint >/dev/null 2>&1; then
    echo "We already have the linter. No need to download it."
else
    echo "We don't have the linter. Download it now..."
    if [[ "$os" == 'linux' || "$os" == 'linux-gnu' ]]; then
        echo "Install for Linux"
        easy_install --user http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz
    elif [[ "$os" == 'darwin' ]]; then
        echo "Install for Mac OS X"
        easy_install --user http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz
    fi;
fi

