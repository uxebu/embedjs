
::

              |             |  _)
    -_)  ` \   _ \  -_)  _` |   |(_-<
  \___|_|_|_|_.__/\___|\__,_|_) |___/
                             __/

EmbedJS
========

About
-----

EmbedJS is a JavaScript framework for embedded devices (mobile phones, TVs, etc.). 
It takes a different approach than other frameworks by shipping just the code needed for each device. 
That means, there's less code going over the wire, less code branching at runtime and less memory usage.

The API you know from dojo, optimized for what you really just need on a mobile phone.
EmbedJS is a super optimized JavaScript framework for embedded devices (mobile phones, TVs, etc.) and is based on the Dojo Toolkit.


Features
--------

EmbedJS uses the concept of features - functionalities are split up into features, as fine-grained as possible,
and each feature might have multiple implementations.

The Features are implemented as AMD compatible modules, so you can use a loader like require.js to easily pull in the
features you need for your project – each implementation of a given feature knows it's dependencies, so you don't have
to worry about that.


Goal 1 - of this project is to provide an optimized version for each phone, that covers the features of each phone platform as optimal as 
possible. E.g. if a platform offers CSS transitions with native hardware acceleration the dojo.fx library will make use of it, to provide 
the fastest speed and best user experience possible.

Goal 2 - stay compatible to the dojo APIs. For those who are used to dojo.query, dojo.fx, etc. we don't want to make it hard for you to 
learn a new set of APIs just stick to those you know. And make it easy for those new to dojo to learn the API by referencing the 
existing docs and not reinventing the wheel.

Most of the work in embedJS - especially about how to strip out of dojo what is really needed, how to make it most efficient and what 
platform to provide with what features - comes from the investigations of the people inside uxebu. We are planning to actively push 
this project and we'll strive to provide the best quality, as used to from dojo. In the hope that all the efforts one day may flow 
back into dojo.

Building EmbedJS
----------------

You can download ready-made builds, just check out the build folder. But if you want to build your custom build, you can very well do that!

EmbedJS is using the AMD module pattern and it's working fine with James Burke's awesome require.js to load,
and with r.js to build. For instructions on how to build with r.js, please see the very detailed `require.js documentation`_.




.. _documentation: http://requirejs.org/
