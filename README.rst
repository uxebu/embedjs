
::

              |             |  _)
    -_)  ` \   _ \  -_)  _` |   |(_-<
  \___|_|_|_|_.__/\___|\__,_|_) |___/
                             __/

embed.js
========

*NOTE: The current state of the project is NOT stable and under heavy development, use at your own risk :)*

embed.js is a super optimized JavaScript framework for embedded devices (mobile phones, TVs, etc.) and is based on the Dojo Toolkit.

Some of the TODOs
-----------------

* Provide an optimized version for devices, that cover the features of each device platform as optimal as possible. E.g. if a platform offers CSS transitions with native HW acceleration the fx library will make use of it, to provide the fastest speed and best user experience possible.
* Stay compatible to the dojo APIs. For those who are used to dojo.query, dojo.fx, etc. we don't want to make it hard for you to learn a new set of APIs just stick to those you know. And make it easy for those new to dojo to learn the API by referencing the existing docs and not reinventing the wheel.