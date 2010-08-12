DIR=`dirname $0`
cd $DIR/..

# Empty the widget stuff
rm -Rf tmp/wgt
# Create the temp dir where we are going to build the widget in
# Create a "embedJS" directory so we can remove all but nokia later for the Nokia WRT, to reduce the size.
mkdir -p tmp/wgt/embedJS

cd tmp/wgt
cp -R ../../tests/* .
cp ../../src/config.xml .
cp ../../build/embed-* ./embedJS

# Remove all *.uncompressed.js files, they are just bloat in a widget
find . -type f -name "*.uncompressed.js" | xargs rm

rm ../embedJStests.wgt
zip -r ../embedJStests.wgt *



# Create the Nokia WRT widget.
echo
echo "*** Create Nokia WRT widget ***"
echo 
rm config.xml
cp ../../src/Info.plist .
cd ..
mv wgt src # A nokia WRT widget has to be in the directory "src" for packaging it ... for whatever reason, but it wont install otherwise ... grrrr
find src/embedJS -type f ! -name "*nokia*" -delete
zip -r embedJStests.wgz src/*



# Clean up
rm -Rf src