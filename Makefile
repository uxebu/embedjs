#
# DIRECTORIES
#
ROOT_DIR := $(PWD)
SOURCE_DIR := $(ROOT_DIR)/src
DIST_DIR := $(ROOT_DIR)/dist
TOOLS_DIR :=  $(ROOT_DIR)/tools

#
# TOOLS
#
##########add back in !!!!!
MINIFIER := java -jar -Dfile.encoding=UTF8 $(TOOLS_DIR)/shrinksafe.jar -escape-unicode

#
# JAVASCRIPT PROFILES
# These should be replaced with our capability-based "dojo mini" builds in the future
#


Android := ./build/build.sh Android ??? no idea how this works :)
iPhone := ./build/build.sh iPhone
opera := $(BASE_JS)
wrt := $(BASE_JS)
ie := $(BASE_JS)
web := $(COMPAT_JS) $(FX_JS)
blackberry := $(BASE_JS)

all: .PHONY

#
# SPECIAL TARGETS
#
.PHONY: clean webkit common opera wrt ie web blackberry

#
# ALIASES
#
common: $(DIST_DIR)/dojo-common.js
webkit: $(DIST_DIR)/dojo-webkit.js
opera: $(DIST_DIR)/dojo-opera.js
wrt: $(DIST_DIR)/dojo-wrt.js
ie: $(DIST_DIR)/dojo-ie.js
web: $(DIST_DIR)/dojo-web.js
blackberry: $(DIST_DIR)/dojo-blackberry.js

#
# BUILD TARGETS
#
$(DIST_DIR)/dojo-%.js: $(DIST_DIR)
	$(MINIFIER) $($*) > $@

#
#
#
$(DIST_DIR):
	mkdir -p $(DIST_DIR) 2> /dev/null

clean-%s:
	rm $(DIST_DIR)/dojo-$*.js

clean:
	rm -rf $(DIST_DIR)
