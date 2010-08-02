SRC_PATH="../../src"
DOJO_PATH="../../src/dojo"
DEST_FILE="../../dist/dojo-webkit-mobile-kitchensink.js"

#
#	The build process is only split into multiple cats to allow documenting all deps separately.
#
cat\
	$SRC_PATH/dojo.js \
	$DOJO_PATH/array.js \
	$DOJO_PATH/connect.js \
	> $DEST_FILE
	
# Add dojo/destroy.js
# deps: html.js
#			lang/string.js
cat \
	$DOJO_PATH/lang/string.js \
	$DOJO_PATH/html.js \
	$DOJO_PATH/destroy.js \
	>> $DEST_FILE
	
cat \
	$DOJO_PATH/event.js \
	>> $DEST_FILE
	
# Add dojo/fx.js
# deps: lang/hitch.js
#			lang.js
cat \
	$DOJO_PATH/lang.js \
	$DOJO_PATH/lang/is.js \
	$DOJO_PATH/lang/hitch.js \
	$DOJO_PATH/fx.js \
	>> $DEST_FILE

cat \
	$DOJO_PATH/io/script.js \
	>> $DEST_FILE

# Add lang/clone
# deps: array
#		lang/is
cat \
	$DOJO_PATH/lang/is.js \
	$DOJO_PATH/lang/clone.js \
	>> $DEST_FILE

cat \
	$DOJO_PATH/lang/string.js \
	>> $DEST_FILE

cat \
	$DOJO_PATH/json.js \
	>> $DEST_FILE

# Add oo/declare
# deps: oo/delegate
#		oo/extend
#		lang/is
#		array
cat \
	$DOJO_PATH/oo/delegate.js \
	$DOJO_PATH/oo/extend.js \
	$DOJO_PATH/oo/declare.js \
	>> $DEST_FILE

# Add deferred/xhr
# deps: lang
cat \
	$DOJO_PATH/deferred.js \
	$DOJO_PATH/xhr.js \
	>> $DEST_FILE

