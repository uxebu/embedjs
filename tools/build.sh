cd .. # Lets change to the root directory

# TODO actually the check should valllidate if this is a valid definition file
if [ -z "$1" ]; then
	echo "Please specify the kind of build you would like, choose from"
	# TODO the follwoing should actually ONLY be a list of the valid 
	cd profiles
	find . -type f -name "*.definition" | xargs basename -a -s .definition
	echo 
	exit;
fi

PLATFORMS=`find profiles/platforms -type f -name "*.json"`
#PLATFORMS=profiles/platforms/iPhone.json
cd tools
for P in $PLATFORMS; do

	# The following has to be executed in "tools" directory, since getFiles.js relys on the path.
	cd ../tools
	FILES=$(java -jar js.jar getFiles.js "../$P" `cat ../profiles/$1.definition`)
	
	cd ..
	PLATFORM_NAME=`basename "$P" .json`
	if [ "${FILES:0:6}" = "ERROR:" ]; then
		echo $FILES
		exit;
	fi
	cd src
	DEST_FILE=../build/embed-$1-$PLATFORM_NAME.js
	DEST_FILE_UNCOMPRESSED=../build/embed-$1-$PLATFORM_NAME.uncompressed.js
	#echo $FILES
	java -jar ../tools/shrinksafe.jar $FILES > $DEST_FILE
	echo "created `du -h $DEST_FILE`"
	# Create uncompressed files
	cat $FILES > $DEST_FILE_UNCOMPRESSED
	echo "created `du -h $DEST_FILE_UNCOMPRESSED`"
done

echo
echo "Creating runTests-*.html files"
cd ../tools
./createRunTests.sh