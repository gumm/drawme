#!/bin/bash

# --accept_const_keyword                 : Allows usage of const keyword.
# --allow_es6_out                        : Experimental: Allows ES6 language_out,
#                                          for compiling ES6 to ES6 as well as
#                                          transpiling to ES6 from lower
#                                          versions. Enabling this flag may
#                                          cause the compiler to crash or
#                                          produce incorrect output.
# --angular_pass                         : Generate $inject properties for
#                                          AngularJS for functions annotated
#                                          with @ngInject
# --charset VAL                          : Input and output charset for all
#                                          files. By default, we accept UTF-8 as
#                                          input and output US_ASCII
# --checks-only                          : Don't generate output. Run checks,
#                                          but no compiler passes.
# --closure_entry_point VAL              : Entry points to the program. Must be
#                                          goog.provide'd symbols. Any goog.provi
#                                          de'd symbols that are not a transitive
#                                          dependency of the entry points will
#                                          be removed. Files without goog.provide
#                                          s, and their dependencies, will
#                                          always be left in. If any entry
#                                          points are specified, then the
#                                          manage_closure_dependencies option
#                                          will be set to true and all files
#                                          will be sorted in dependency order.
# --common_js_entry_module VAL           : Root of your common JS dependency
#                                          hierarchy. Your main script.
# --common_js_module_path_prefix VAL     : Path prefix to be removed from
#                                          CommonJS module names.
# --compilation_level (-O) VAL           : Specifies the compilation level to
#                                          use. Options: WHITESPACE_ONLY,
#                                          SIMPLE, ADVANCED
# --conformance_configs VAL              : A list of JS Conformance configuration
#                                          s in text protocol buffer format.
# --create_renaming_reports              : If true, variable renaming and
#                                          property renaming report files will
#                                          be produced as {binary name}_vars_rena
#                                          ming_report.out and {binary name}_prop
#                                          s_renaming_report.out. Note that this
#                                          flag cannot be used in conjunction
#                                          with either variable_renaming_report
#                                          or property_renaming_report
# --create_source_map VAL                : If specified, a source map file
#                                          mapping the generated source files
#                                          back to the original source file will
#                                          be output to the specified path. The
#                                          %outname% placeholder will expand to
#                                          the name of the output file that the
#                                          source map corresponds to.
# --debug                                : Enable debugging options
# --define (--D, -D) VAL                 : Override the value of a variable
#                                          annotated @define. The format is
#                                          <name>[=<val>], where <name> is the
#                                          name of a @define variable and <val>
#                                          is a boolean, number, or a single-quot
#                                          ed string that contains no single
#                                          quotes. If [=<val>] is omitted, the
#                                          variable is marked true
# --export_local_property_definitions    : Generates export code for local
#                                          properties marked with @export
# --externs VAL                          : The file containing JavaScript
#                                          externs. You may specify multiple
# --extra_annotation_name VAL            : A whitelist of tag names in JSDoc.
#                                          You may specify multiple
# --flagfile VAL                         : A file containing additional command-l
#                                          ine options.
# --formatting [PRETTY_PRINT | PRINT_INP : Specifies which formatting options,
# UT_DELIMITER | SINGLE_QUOTES]          : if any, should be applied to the
#                                          output JS. Options: PRETTY_PRINT,
#                                          PRINT_INPUT_DELIMITER, SINGLE_QUOTES
# --generate_exports                     : Generates export code for those
#                                          marked with @export
# --help                                 : Displays this message on stdout and
#                                          exit
# --js VAL                               : The JavaScript filename. You may
#                                          specify multiple. The flag name is
#                                          optional, because args are interpreted
#                                          as files by default. You may also use
#                                          minimatch-style glob patterns. For
#                                          example, use --js='**.js' --js='!**_te
#                                          st.js' to recursively include all js
#                                          files that do not end in _test.js
# --js_output_file VAL                   : Primary output filename. If not
#                                          specified, output is written to stdout
# --jscomp_error VAL                     : Make the named class of warnings an
#                                          error. Options:accessControls,
#                                          ambiguousFunctionDecl, checkEventfulOb
#                                          jectDisposal, checkRegExp, checkStruct
#                                          DictInheritance, checkTypes, checkVars
#                                          , conformanceViolations, const,
#                                          constantProperty, deprecated,
#                                          deprecatedAnnotations, duplicateMessag
#                                          e, es3, es5Strict, externsValidation,
#                                          fileoverviewTags, globalThis,
#                                          inferredConstCheck, internetExplorerCh
#                                          ecks, invalidCasts, misplacedTypeAnnot
#                                          ation, missingGetCssName, missingPrope
#                                          rties, missingProvide, missingRequire,
#                                          missingReturn,newCheckTypes, nonStanda
#                                          rdJsDocs, reportUnknownTypes,
#                                          suspiciousCode, strictModuleDepCheck,
#                                          typeInvalidation, undefinedNames,
#                                          undefinedVars, unknownDefines,
#                                          uselessCode, useOfGoogBase, visibility
# --jscomp_off VAL                       : Turn off the named class of warnings.
#                                          Options:accessControls, ambiguousFunct
#                                          ionDecl, checkEventfulObjectDisposal,
#                                          checkRegExp, checkStructDictInheritanc
#                                          e, checkTypes, checkVars, conformanceV
#                                          iolations, const, constantProperty,
#                                          deprecated, deprecatedAnnotations,
#                                          duplicateMessage, es3, es5Strict,
#                                          externsValidation, fileoverviewTags,
#                                          globalThis, inferredConstCheck,
#                                          internetExplorerChecks, invalidCasts,
#                                          misplacedTypeAnnotation, missingGetCss
#                                          Name, missingProperties, missingProvid
#                                          e, missingRequire, missingReturn,newCh
#                                          eckTypes, nonStandardJsDocs, reportUnk
#                                          nownTypes, suspiciousCode, strictModul
#                                          eDepCheck, typeInvalidation, undefined
#                                          Names, undefinedVars, unknownDefines,
#                                          uselessCode, useOfGoogBase, visibility
# --jscomp_warning VAL                   : Make the named class of warnings a
#                                          normal warning. Options:accessControls
#                                          , ambiguousFunctionDecl, checkEventful
#                                          ObjectDisposal, checkRegExp, checkStru
#                                          ctDictInheritance, checkTypes,
#                                          checkVars, conformanceViolations,
#                                          const, constantProperty, deprecated,
#                                          deprecatedAnnotations, duplicateMessag
#                                          e, es3, es5Strict, externsValidation,
#                                          fileoverviewTags, globalThis,
#                                          inferredConstCheck, internetExplorerCh
#                                          ecks, invalidCasts, misplacedTypeAnnot
#                                          ation, missingGetCssName, missingPrope
#                                          rties, missingProvide, missingRequire,
#                                          missingReturn,newCheckTypes, nonStanda
#                                          rdJsDocs, reportUnknownTypes,
#                                          suspiciousCode, strictModuleDepCheck,
#                                          typeInvalidation, undefinedNames,
#                                          undefinedVars, unknownDefines,
#                                          uselessCode, useOfGoogBase, visibility
# --language_in VAL                      : Sets what language spec that input
#                                          sources conform. Options: ECMASCRIPT3
#                                          (default), ECMASCRIPT5, ECMASCRIPT5_ST
#                                          RICT, ECMASCRIPT6 (experimental),
#                                          ECMASCRIPT6_STRICT (experimental),
#                                          ECMASCRIPT6_TYPED (experimental)
# --language_out VAL                     : Sets what language spec the output
#                                          should conform to.  If omitted,
#                                          defaults to the value of language_in.
#                                          Options: ECMASCRIPT3, ECMASCRIPT5,
#                                          ECMASCRIPT5_STRICT, ECMASCRIPT6_TYPED
#                                          (experimental)
# --logging_level VAL                    : The logging level (standard java.util.
#                                          logging.Level values) for Compiler
#                                          progress. Does not control errors or
#                                          warnings for the JavaScript code
#                                          under compilation
# --manage_closure_dependencies          : Automatically sort dependencies so
#                                          that a file that goog.provides symbol
#                                          X will always come before a file that
#                                          goog.requires symbol X. If an input
#                                          provides symbols, and those symbols
#                                          are never required, then that input
#                                          will not be included in the compilatio
#                                          n.
# --module VAL                           : A JavaScript module specification.
#                                          The format is <name>:<num-js-files>[:[
#                                          <dep>,...][:]]]. Module names must be
#                                          unique. Each dep is the name of a
#                                          module that this module depends on.
#                                          Modules must be listed in dependency
#                                          order, and JS source files must be
#                                          listed in the corresponding order.
#                                          Where --module flags occur in
#                                          relation to --js flags is unimportant.
#                                          <num-js-files> may be set to 'auto'
#                                          for the first module if it has no
#                                          dependencies. Provide the value
#                                          'auto' to trigger module creation
#                                          from CommonJSmodules.
# --module_output_path_prefix VAL        : Prefix for filenames of compiled JS
#                                          modules. <module-name>.js will be
#                                          appended to this prefix. Directories
#                                          will be created as needed. Use with
#                                          --module
# --module_wrapper VAL                   : An output wrapper for a JavaScript
#                                          module (optional). The format is
#                                          <name>:<wrapper>. The module name
#                                          must correspond with a module
#                                          specified using --module. The wrapper
#                                          must contain %s as the code placeholde
#                                          r. The %basename% placeholder can
#                                          also be used to substitute the base
#                                          name of the module output file.
# --new_type_inf                         : In development new type inference
#                                          pass. DO NOT USE!
# --only_closure_dependencies            : Only include files in the transitive
#                                          dependency of the entry points
#                                          (specified by closure_entry_point).
#                                          Files that do not provide dependencies
#                                          will be removed. This supersedes
#                                          manage_closure_dependencies
# --output_manifest VAL                  : Prints out a list of all the files in
#                                          the compilation. If --manage_closure_d
#                                          ependencies is on, this will not
#                                          include files that got dropped
#                                          because they were not required. The
#                                          %outname% placeholder expands to the
#                                          JS output file. If you're using
#                                          modularization, using %outname% will
#                                          create a manifest for each module.
# --output_module_dependencies VAL       : Prints out a JSON file of dependencies
#                                          between modules.
# --output_wrapper VAL                   : Interpolate output into this string
#                                          at the place denoted by the marker
#                                          token %output%. Use marker token
#                                          %output|jsstring% to do js string
#                                          escaping on the output.
# --output_wrapper_file VAL              : Loads the specified file and passes
#                                          the file contents to the --output_wrap
#                                          per flag, replacing the value if it
#                                          exists.
# --polymer_pass                         : Rewrite Polymer classes to be
#                                          compiler-friendly.
# --print_ast                            : Prints a dot file describing the
#                                          internal abstract syntax tree and
#                                          exits
# --print_pass_graph                     : Prints a dot file describing the
#                                          passes that will get run and exits
# --print_tree                           : Prints out the parse tree and exits
# --process_closure_primitives           : Processes built-ins from the Closure
#                                          library, such as goog.require(),
#                                          goog.provide(), and goog.exportSymbol(
#                                          ). True by default.
# --process_common_js_modules            : Process CommonJS modules to a
#                                          concatenable form.
# --process_jquery_primitives            : Processes built-ins from the Jquery
#                                          library, such as jQuery.fn and
#                                          jQuery.extend()
# --property_renaming_report VAL         : File where the serialized version of
#                                          the property renaming map produced
#                                          should be saved
# --rename_prefix_namespace VAL          : Specifies the name of an object that
#                                          will be used to store all non-extern
#                                          globals
# --source_map_format [DEFAULT | V3]     : The source map format to produce.
#                                          Options are V3 and DEFAULT, which are
#                                          equivalent.
# --source_map_input VAL                 : Source map locations for input files,
#                                          separated by a '|', (i.e. input-file-p
#                                          ath|input-source-map)
# --source_map_location_mapping VAL      : Source map location mapping separated
#                                          by a '|' (i.e. filesystem-path|webserv
#                                          er-path)
# --summary_detail_level N               : Controls how detailed the compilation
#                                          summary is. Values: 0 (never print
#                                          summary), 1 (print summary only if
#                                          there are errors or warnings), 2
#                                          (print summary if the 'checkTypes'
#                                          diagnostic  group is enabled, see
#                                          --jscomp_warning), 3 (always print
#                                          summary). The default level is 1
# --third_party                          : Check source validity but do not
#                                          enforce Closure style rules and
#                                          conventions
# --tracer_mode [ALL | RAW_SIZE |        : Shows the duration of each compiler
# TIMING_ONLY | OFF]                     : pass and the impact to the compiled
#                                          output size. Options: ALL, RAW_SIZE,
#                                          TIMING_ONLY, OFF
# --transform_amd_modules                : Transform AMD to CommonJS modules.
# --translations_file VAL                : Source of translated messages.
#                                          Currently only supports XTB.
# --translations_project VAL             : Scopes all translations to the
#                                          specified project.When specified, we
#                                          will use different message ids so
#                                          that messages in different projects
#                                          can have different translations.
# --transpile_only                       : Run ES6 to ES3 transpilation only,
#                                          skip other passes.
# --use_only_custom_externs              : Specifies whether the default externs
#                                          should be excluded
# --use_types_for_optimization           : Enable or disable the optimizations
#                                          based on available type information.
#                                          Inaccurate type annotations may
#                                          result in incorrect results.
# --variable_renaming_report VAL         : File where the serialized version of
#                                          the variable renaming map produced
#                                          should be saved
# --version                              : Prints the compiler version to stdout
#                                          and exit.
# --warning_level (-W) [QUIET | DEFAULT  : Specifies the warning level to use.
# | VERBOSE]                             : Options: QUIET, DEFAULT, VERBOSE
# --warnings_whitelist_file VAL          : A file containing warnings to
#                                          suppress. Each line should be of the
#                                          form
#                                          <file-name>:<line-number>?  <warning-d
#                                          escription>


WORKSPACE=$1
PROJECT_NAME=$2
SITE_VERSION=$3
JS_PATH=$4
CLOSURE_LIBRARY_PATH=$5
CLOSURE_COMPILER_PATH=$6
COMPILED_OUTPUT_PATH=$7
BUILD_LOG_FILE=$8
BUILD_PARM=$9

echo "-----------------------------------------------------"

figlet Compile JS

echo "WORKSPACE: ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "JS_PATH: ${JS_PATH}"
echo "CLOSURE_LIBRARY_PATH: ${CLOSURE_LIBRARY_PATH}"
echo "CLOSURE_COMPILER_PATH: ${CLOSURE_COMPILER_PATH}"
echo "SITE_VERSION: ${SITE_VERSION}"
echo "BUILD_PARM: ${BUILD_PARM}"
echo "BUILD_LOG_FILE: ${BUILD_LOG_FILE}"
echo ""

#Delete all previously compiled files.
echo "Delete existing compiled JS files..."
cd ${COMPILED_OUTPUT_PATH}
find . -name "${PROJECT_NAME}.min*.js*" -delete

cd ${COMPILED_OUTPUT_PATH}

java -server -XX:+TieredCompilation -jar ${CLOSURE_COMPILER_PATH}/compiler.jar \
    --flagfile              ${WORKSPACE}/bin/build/options/compile.ini \
    --closure_entry_point   ${PROJECT_NAME} \
    --js_output_file        ${PROJECT_NAME}.min.js \
    --output_manifest       ${PROJECT_NAME}.min.js.manifest \
    --define                goog.DEBUG=false \
    --source_map_location_mapping "${WORKSPACE}/public|" \
    --externs               ${CLOSURE_COMPILER_PATH}/contrib/externs/maps/google_maps_api_v3_22.js \
    --output_wrapper        "(function(){%output%})();//# sourceMappingURL=${PROJECT_NAME}.min.${SITE_VERSION}.js.map" \
    ${CLOSURE_LIBRARY_PATH}/ \
    ${JS_PATH}/bad-library/bad/ \
    ${JS_PATH}/contracts/ \
    ${JS_PATH}/${PROJECT_NAME}/ 2>${BUILD_LOG_FILE}

echo "-----------------------------------------------------"
NUM_CLIB_FILES=$(grep -o closure-library/ ${COMPILED_OUTPUT_PATH}/${PROJECT_NAME}.min.js.manifest | wc -l)
NUM_BLIB_FILES=$(grep -o bad-library/ ${COMPILED_OUTPUT_PATH}/${PROJECT_NAME}.min.js.manifest | wc -l)
NUM_SAPP_FILES=$(grep -o public/js/${PROJECT_NAME}/ ${COMPILED_OUTPUT_PATH}/${PROJECT_NAME}.min.js.manifest | wc -l)
FILE_SIZE=$(stat -c%s ${COMPILED_OUTPUT_PATH}/${PROJECT_NAME}.min.js)
QUALITY=$(sed '/error(s).*warning(s).*typed/!d' < ${BUILD_LOG_FILE})
RESULT='SUCCESS'

if grep --quiet "0 error(s), 0 warning(s)" ${BUILD_LOG_FILE}; then
  SUCCESS_COL='[SUCCESS]'
else
  SUCCESS_COL='[ERROR]'
  RESULT=$(cat ${BUILD_LOG_FILE})
fi

echo "FULL COMPILE"
echo "Results:                  ${RESULT}"
echo "Closure Library files:    ${NUM_CLIB_FILES}"
echo "Bad-Library files:        ${NUM_BLIB_FILES}"
echo "${PROJECT_NAME} App files:         ${NUM_SAPP_FILES}"
echo "Compiled size:            ${FILE_SIZE}"
echo "${SUCCESS_COL} Quality:   ${QUALITY}"
echo ""

# Linking has to be done relative otherwise this whole thing is not
# portable any more.
echo "----- LINKING TO COMPILED FILES ------"
cd ${COMPILED_OUTPUT_PATH}
ln -s   ${PROJECT_NAME}.min.js.map ${PROJECT_NAME}.min.${SITE_VERSION}.js.map
ln -s   ${PROJECT_NAME}.min.js ${PROJECT_NAME}.min.${SITE_VERSION}.js
#       |____________________| |____________________________________|
#                  |                           |
#             path/to/file                  path/to/link

echo "Done"

