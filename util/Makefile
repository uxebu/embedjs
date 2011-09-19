#-------------------#
#     defaults      #
#-------------------#

ifndef profile
profile=testbuild
endif

ifndef platform
platform=android
endif

ifndef optimize
optimize=uglify
endif


#-------------------#
#     filename      #
#-------------------#

filename=$(profile)-$(platform).js


#-------------------#
#       paths       #
#-------------------#

#requirepath=../libs/requirejs
requirepath=../libs/requirejs-0.24
rjspath=../libs/r.js
rhinopath=$(rjspath)/lib/rhino
closurepath=$(rjspath)/lib/closure


#-------------------#
#        go         #
#-------------------#

build:
	#java -classpath $(rhinopath)/js.jar:$(closurepath)/compiler.jar org.mozilla.javascript.tools.shell.Main $(rjspath)/dist/r-0.26.0.js -o baseUrl=../src name=../profiles/$(profile) out=../build/$(filename) paths.implementations=../platforms/$(platform) optimize=$(optimize)
	$(requirepath)/build/buildj.sh baseUrl=../src name=../profiles/$(profile) out=../build/embed-$(filename) paths.implementations=../platforms/$(platform)  optimize=$(optimize)
	
clean:
	java -classpath $(rhinopath)/js.jar org.mozilla.javascript.tools.shell.Main ./clean.js ./ ./ ../build/embed-$(filename)
