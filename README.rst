
::

              |             |  _)
    -_)  ` \   _ \  -_)  _` |   |(_-<
  \___|_|_|_|_.__/\___|\__,_|_) |___/
                             __/

embed.js
========

The API you know from dojo, optimized for what you really just need on a mobile phone.
EmbedJS is a super optimized JavaScript framework for embedded devices (mobile phones, TVs, etc.) and is based on the Dojo Toolkit.

Goal 1 - of this project is to provide an optimized version for each phone, that covers the features of each phone platform as optimal as possible. E.g. if a platform offers CSS transitions with native hardware acceleration the dojo.fx library will make use of it, to provide the fastest speed and best user experience possible.

Goal 2 - stay compatible to the dojo APIs. For those who are used to dojo.query, dojo.fx, etc. we don't want to make it hard for you to learn a new set of APIs just stick to those you know. And make it easy for those new to dojo to learn the API by referencing the existing docs and not reinventing the wheel.

Most of the work in embedJS - especially about how to strip out of dojo what is really needed, how to make it most efficient and what platform to provide with what features - comes from the investigations of the people inside uxebu. We are planning to actively push this project and we'll strive to provide the best quality, as used to from dojo. In the hope that all the efforts one day may flow back into dojo.

Building embedJS
----------------

See https://github.com/uxebu/embedjs/wiki/build

*NOTE: The current state of the project is NOT stable and under heavy development, use at your own risk :)*

