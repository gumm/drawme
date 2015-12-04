#!/bin/bash

# 1 ${WORKSPACE}
# 2 ${PROJECT_NAME}
# 3 ${SITE_VERSION}
# 4 ${CSS_PATH}
# 5 ${COMPILED_OUTPUT_PATH}
# 6 ${LESS_COMPILER}
# 7 ${BUILD_PARM}

WORKSPACE=$1
PROJECT_NAME=$2
SITE_VERSION=$3
CSS_PATH=$4
COMPILED_PATH=$5
LESS_COMPILER=$6
ONLY_BUILD_THIS_THEME=$7

if [ -z "${ONLY_BUILD_THIS_THEME}" ]
  then
    echo "No argument supplied"
    ONLY_BUILD_THIS_THEME='all'
fi

THEME_PATH=${CSS_PATH}/themes

echo "-----------------------------------------------------"
echo "WORKSPACE: ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "SITE_VERSION: ${SITE_VERSION}"
echo "CSS_PATH: ${CSS_PATH}"
echo "IMG_COMPILER_PATH: ${IMG_COMPILER_PATH}"
echo "THEME_PATH: ${THEME_PATH}"
echo "ONLY_BUILD_THIS_THEME: ${ONLY_BUILD_THIS_THEME}"
echo "-----------------------------------------------------"
echo ""

figlet Compile CSS

echo "SITE VERSION: $SITE_VERSION";

# Find all the directories in the theme path, and compile their css
cd ${THEME_PATH}
echo "NOW IN: ${THEME_PATH}"

for i in `find ${THEME_PATH} -maxdepth 1 -type d | sort`
do
    # Grab the theme name and define some vars.
    THEME_NAME=${i##/*/}
    OUTPUT_FILE=${THEME_NAME}.min.css
    SYMLINK_NAME=${THEME_NAME}.min.${SITE_VERSION}.css

    if [ "${THEME_NAME}" == "${ONLY_BUILD_THIS_THEME}" ] \
        || [ "${ONLY_BUILD_THIS_THEME}" == "all" ]; then

        # There is nothing to do in the top level directory.
        # Simply skip it.
        if [ "${THEME_NAME}" == "themes" ]
        then
            continue
        fi

        # Delete existing compiled file
        rm ${COMPILED_PATH}/${THEME_NAME}.min.*.css

        # Place a headline
        figlet ${THEME_NAME}

        # Descend into the theme's CSS directory.
        cd ${i}/css
        echo "CURRENT WORKING DIRECTORY: `pwd`"

        # Delete all previously compiled files.
        echo "Removing all existing minified css files..."
        find . -name "*.min.*css" -delete

        # Print some feedback
        echo "THEME: ${THEME_NAME}";
        echo "Compiling Theme..."
        ${LESS_COMPILER} --clean-css="advanced" --strict-math=on ./imports.less ./${OUTPUT_FILE}

        # Links must be relative to make sure this is portable.
        echo "Linking to compiled css"

        # Delete existing symbolic link
        cd ${COMPILED_PATH}
        echo "${SYMLINK_NAME}"
        rm -f ${SYMLINK_NAME}

        # Create new symbolic link
        ln -s ../css/themes/${THEME_NAME}/css/${OUTPUT_FILE} ${SYMLINK_NAME}
        echo "-------------------------------";
        echo ""
    fi
done
echo ""
