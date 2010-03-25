#
# DIRECTORIES
#
ROOT_DIR := $(PWD)
BUILD_DIR := $(ROOT_DIR)/build
SOURCE_DIR := $(ROOT_DIR)/src
DIST_DIR := $(ROOT_DIR)/dist
TOOLS_DIR :=  $(ROOT_DIR)/tools
PROFILES_DIR := $(BUILD_DIR)/profiles

#
# TOOLS
#
##########add back in !!!!!
MINIFIER := java -jar -Dfile.encoding=UTF8 $(TOOLS_DIR)/shrinksafe.jar -escape-unicode
RHINO := java -jar $(TOOLS_DIR)/js.jar
BUILD_JS := $(RHINO) $(TOOLS_DIR)/build.js

all: .PHONY

#
# SPECIAL TARGETS
#
.PHONY: clean Android iPhone

#
# ALIASES
#
Android: $(DIST_DIR)/dojo-Android.js
iPhone: $(DIST_DIR)/dojo-iPhone.js

#
# BUILD TARGETS
#
$(DIST_DIR)/dojo-%.js: $(DIST_DIR)
	$(MINIFIER) `$(BUILD_JS) $(PROFILES_DIR)/app/$(*).js` > $@

#
#
#
$(DIST_DIR):
	mkdir -p $(DIST_DIR) 2> /dev/null

clean-%s:
	rm $(DIST_DIR)/dojo-$*.js

clean:
	rm -rf $(DIST_DIR)
