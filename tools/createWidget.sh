cd ..

# Empty the widget stuff
rm -Rf tmp/wgt
# Create the temp dir where we are going to build the widget in
mkdir -p tmp/wgt

cd tmp/wgt
cp -R ../../src/tests/* .
cp ../../src/config.xml .
cp ../../build/embed-* .

# Remove all *.uncompressed.js files, they are just bloat in a widget
find . -type f -name "*.uncompressed.js" | xargs rm

rm ../embedJStests.wgt
zip -r ../embedJStests.wgt *
cp ../embedJStests.wgt ../embedJStests.wgz