DIR=`pwd`

. helper.sh

# TODO actually the check should vallidate if this is a valid definition file
if [ -z "$1" ]; then
	echo "Please specify the kind of build you would like, choose from:"
	# TODO the follwoing should actually ONLY be a list of the valid
	PROFILES=$(normalize_path $DIR/../profiles)
	find $PROFILES -type f -name "*.profile" | xargs basename -a -s .profile
	echo
	exit;
fi

PLATFORMS=`find $(normalize_path $DIR/../platforms) -type f -name "*.json"`

for P in $PLATFORMS; do
	# The following has to be executed in "tools" directory, since getFiles.js relys on the path.
	FILES=$(java -jar $DIR/js.jar $DIR/js/getFiles.js $DIR/js "$P" $(normalize_path $DIR/../src) $(normalize_path $DIR/../profiles/$1.profile))

	PLATFORM_NAME=`basename "$P" .json`
	if [ "${FILES:0:6}" = "ERROR:" ]; then
		echo $FILES
		exit;
	fi

	NORMALIZED_FILES=( )
	for FILE in $FILES; do
		NORMALIZED_FILE=$(normalize_path $FILE)
		NORMALIZED_FILES+="$NORMALIZED_FILE "
	done

	DEST_FILE=$(normalize_path $DIR/../build/embed-$1-$PLATFORM_NAME.js)
	DEST_FILE_UNCOMPRESSED=$(normalize_path $DIR/../build/embed-$1-$PLATFORM_NAME.uncompressed.js)
	java -jar $DIR/shrinksafe.jar $NORMALIZED_FILES > $DEST_FILE
	echo "created `du -h $DEST_FILE`"
	# Create uncompressed files
	cat $NORMALIZED_FILES > $DEST_FILE_UNCOMPRESSED
	echo "created `du -h $DEST_FILE_UNCOMPRESSED`"
done

echo
echo "Creating files in src/tests"
echo
$DIR/createRunTests.sh