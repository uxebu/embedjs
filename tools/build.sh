cd .. # Lets change to the root directory

# TODO actually the check should valllidate if this is a valid definition file
if [ -z "$1" ]; then
	echo "Please specify the kind of build you would like, choose from"
	# TODO the follwoing should actually ONLY be a list of the valid 
	cd profiles
	find . -type f -name "*.definition"
	exit;
fi

PLATFORMS=`find profiles/platforms -type f -name "*.json"`
cd tools
for P in $PLATFORMS; do
	cd ..
	PLATFORM_NAME=`basename "$P" .json`
	FILES=$(java -jar tools/js.jar tools/getFiles.js "$P" `cat profiles/$1.definition`)
	cd src
	java -jar ../tools/shrinksafe.jar $FILES > ../build/dojo-$1-$PLATFORM_NAME.js
	echo "created `du -h ../build/dojo-$1-$PLATFORM_NAME.js`"
done