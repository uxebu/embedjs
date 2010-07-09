
dojo.mixin
==========

Platforms
---------

Available on all platforms.


Introduction
------------

dojo.mixin adds all properties and methods of an object to another object.

Usage
-----

Syntax:

.. code-block:: none
  
  var modified = dojo.mixin(object1, object2);

Params:

- *object1* is the object that will get the properties of *object2*.

- *object2* is the object whose properties will be mixed into *object1*.

Example:

.. code-block:: none
  
  var stick = { easyToHold: true };
  var lamp = { producesLight: true };
  var flashlight = dojo.mixin(stick, lamp);

Notes:

- dojo.mixin modifies the object that recieves the additional properties. In our example, stick has also turned into a flashlight (i.e. the object *stick* now also has the property *producesLight*).

- You can mix more than two objects together, like *var trafficLight = dojo.mixin(stick, lamp, greenPlastic);*

- Properties of objects will overwrite the properties of the objects they are mixed into.


