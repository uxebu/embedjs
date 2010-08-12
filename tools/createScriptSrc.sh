DIR=`dirname $0`
PLATFORM=$1
RELATIVE_PATH=$2
SOURCE_DIR=$3
FEATURES_FILE=$4
IS_DEBUG=$5

if [ ! $PLATFORM ]; then
	echo
	echo "createScriptSrc.sh platformName [relativePath] [sourceDirectory] [featuresFileName] [debug]"
	echo "    platformName - The platform file which defines the files that belong to a certain feature, e.g. 'Android'."
	echo "    relativePath - The path to prefix the src-attr in <script src='...'> with, defaults to '../embedjs/src/'"
	echo "    sourceDirectory - The path to the javascript source files, defaults to '../src'."
	echo "    featuresFileName - The file listing all the features, defaults to '../profiles/kitchensink.profile'."
	echo "    debug - If set debugging messages will be shown, default is false."
	echo
	exit;
fi

if [ $SOURCE_DIR ]; then
	if [ $FEATURES_FILE ]; then
		if [ $IS_DEBUG ]; then
			java -jar $DIR/js.jar $DIR/js/createScriptSrc.js $DIR/js $DIR/../platforms/$PLATFORM.json\
				$RELATIVE_PATH $DIR/$SOURCE_DIR $DIR/$FEATURES_FILE $IS_DEBUG
		else
			java -jar $DIR/js.jar $DIR/js/createScriptSrc.js $DIR/js $DIR/../platforms/$PLATFORM.json\
				$RELATIVE_PATH $DIR/$SOURCE_DIR $DIR/$FEATURES_FILE
		fi
	else
		java -jar $DIR/js.jar $DIR/js/createScriptSrc.js $DIR/js $DIR/../platforms/$PLATFORM.json\
			$RELATIVE_PATH $DIR/$SOURCE_DIR
	fi
else
	java -jar $DIR/js.jar $DIR/js/createScriptSrc.js $DIR/js $DIR/../platforms/$PLATFORM.json\
		$RELATIVE_PATH
fi
