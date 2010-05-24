#
# DIRECTORIES
#
ROOT_DIR := $(PWD)
BUILD_TOOL_DIR := $(ROOT_DIR)/requirejs/build
BUILD_TOOL := $(BUILD_TOOL_DIR)/build.sh
SRC_DIR := $(ROOT_DIR)/src
DIST_DIR := $(ROOT_DIR)/dist
BUILD_PROFILE_DIR := $(ROOT_DIR)/build

#
# BUILD TARGETS
#
.PHONY: clean

dojo-build:
	$(BUILD_TOOL) $(BUILD_PROFILE_DIR)/dojo-common.build.js
	$(BUILD_TOOL) $(BUILD_PROFILE_DIR)/dojo-webkit-mobile.build.js
	$(BUILD_TOOL) $(BUILD_PROFILE_DIR)/dojo-windows-mobile.build.js
	$(BUILD_TOOL) $(BUILD_PROFILE_DIR)/dojo-nokia-wrt.build.js
	$(BUILD_TOOL) $(BUILD_PROFILE_DIR)/dojo-opera.build.js
	$(BUILD_TOOL) $(BUILD_PROFILE_DIR)/dojo-blackberry.build.js
	$(BUILD_TOOL) $(BUILD_PROFILE_DIR)/dojo-blackberry46.build.js

clean:
	rm -rf $(DIST_DIR)
