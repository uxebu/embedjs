* move Info.plist and config.xml into the test dirs, that is what they are used for
* create a build with just one feature at a time, and run all according tests against it, to verify that this
  feature does pass all it's tests properly (requires quite some infrastructure work, create one build for one feature,
  run tests for one feature, etc...)