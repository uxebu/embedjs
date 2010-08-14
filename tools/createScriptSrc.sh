DIR=`pwd`
PLATFORM=$1
FEATURES_FILE=${2:-"kitchensink"}
RELATIVE_PATH=${3:-"./"}
SOURCE_DIR=${4:-"../src"}
IS_DEBUG=$5

if [ ! $PLATFORM ]; then
	echo
	echo "createScriptSrc.sh platformName [featuresFileName] [relativePath] [sourceDirectory] [debug]"
	echo "    platformName - The platform file which defines the files that belong to a certain feature, e.g. 'Android'."
	echo "    featuresFileName - The file listing all the features, defaults to 'kitchensink'."
	echo "    relativePath - The path to prefix the src-attr in <script src='...'> with, defaults to './'"
	echo "    sourceDirectory - The path to the javascript source files, defaults to '../src'."
	echo "    debug - If set debugging messages will be shown, default is false."
	echo
	exit;
fi

. helper.sh

if [ $IS_DEBUG ]; then
	java -jar $DIR/js.jar $DIR/js/createScriptSrc.js $DIR $(normalize_path $DIR/../platforms/$PLATFORM.json)\
		$(normalize_path $DIR/../profiles/$FEATURES_FILE.profile) $RELATIVE_PATH $DIR/$SOURCE_DIR $IS_DEBUG
else
	java -jar $DIR/js.jar $DIR/js/createScriptSrc.js $DIR $(normalize_path $DIR/../platforms/$PLATFORM.json)\
		$(normalize_path $DIR/../profiles/$FEATURES_FILE.profile) $RELATIVE_PATH $DIR/$SOURCE_DIR
fi