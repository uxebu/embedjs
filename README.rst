::

              |             |  _)
    -_)  ` \   _ \  -_)  _` |   |(_-<
  \___|_|_|_|_.__/\___|\__,_|_) |___/
                             __/

EmbedJS
========

About
-----

EmbedJS is a JavaScript framework targeted at embedded devices (mobile phones, TVs, etc.). 
It takes a different approach than other frameworks by shipping just the code needed for each device. 
That means, there's less code going over the wire, less code branching at runtime and less memory usage.

EmbedJS is based on the core code of the `Dojo Toolkit`_, optimized for what you really just need on a mobile phone.

EmbedJS is a `Dojo Foundation`_ project and dual-licensed -- new BSD or MIT.

Features
--------

EmbedJS uses the concept of features: Functionalities are split up into features, as fine-grained as possible,
and each feature might have multiple implementations.

The Features are implemented as AMD compatible modules, so if you don't use a ready-made build, you can use a 
loader like require.js to easily pull in the features you need for your project – each implementation of a 
given feature knows it's dependencies, so you don't have to worry about that.

This way it's super-easy to just use the features you want in a give project – no need to ship code that's 
never executed!


Goals
-----

Goal 1: Provide an optimized version for each device so that we can make use of the features 
of each platform as optimal as possible.

Goal 2: Stay compatible to the dojo APIs. For those who are used to dojo we don't want to 
make it hard for you to learn a new set of APIs – just stick to those you know. And make it easy for those new to 
dojo to learn the API by referencing the existing docs and not reinventing the wheel.

Goal 3: Show a way of how (we think) cross-device development should work today. Or, to be precise, how cross-target
development should work, as the feature based implementation approach used in EmbedJS is a very generic way to
manage, develop, test and build for different targets, be it a free vs. premium version of your app or a lightweight
vs. full-blown version of your website.

Goal 4: Ultimatively, we hope that all the efforts one day may flow back into the Dojo Toolkit.


Building EmbedJS
----------------

You can download ready-made builds, just check out the build folder. But if you want to build your custom build, you can very well do that!

EmbedJS is using the AMD module pattern and it's working fine with James Burke's awesome RequireJS_ to load,
and `r.js`_ to build. For instructions on how to build with r.js, please see the very detailed `RequireJS documentation`_.


.. _Dojo Toolkit: http://dojotoolkit.org/
.. _Dojo Foundation: http://dojofoundation.org/
.. _RequireJS: https://github.com/jrburke/requirejs/
.. _r.js: https://github.com/jrburke/r.js
.. _RequireJS documentation: http://requirejs.org/
