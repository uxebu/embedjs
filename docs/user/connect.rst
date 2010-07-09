
dojo.connect
============


Platforms
---------

Available on all platforms. On IE, DOM events will be normalized automatically.


Introduction
------------

dojo.connect lets you connect to either:

1. a DOM event (such as onclick, onresize and the likes), or

2. a method.

Usage
-----

Usage is slightly different depending on what you connect to.


Connecting to a DOM event
~~~~~~~~~~~~~~~~~~~~~~~~~

Syntax:

.. code-block:: none
  
  var connHandle = dojo.connect(node, event, callback);

Params:

- *node* can be a reference to a DOM node, a DOM object like 'window' or a CSS selector query like '#someNode'. If a selector string is given, dojo.connect will look for matching nodes and take the first it finds to connect to it.

- *event* is a string denoting the event to connect to, like you would note it as an HTML attribute, e.g. 'onclick', 'onresize' or 'onkeyup'.

- *callback* is the method that is called when the event that we connect to is fired.

Example:

Say we want to connect to a node's onclick event:

.. code-block:: none
  
  dojo.connect('#myButton', 'onclick', function(evt){ alert('Clicked on #' + evt.target.id + '!'); });

Or we want to call a function called 'handler' if the window is resized:

.. code-block:: none
  
  dojo.connect(window, 'onresize', handler);

**Note:** Be aware that you need to handle the context in which the callback method is called yourself! If the handler method from the above example lives inside of an, say, 'app' object and uses the *this* keyword to reference other properties of the 'app' object, we'd have to do the following:

.. code-block:: none
  
  dojo.connect(window, 'onresize', dojo.hitch(app,'handler'));

Connecting to a method
~~~~~~~~~~~~~~~~~~~~~~

Syntax:

.. code-block:: none
  
  var connHandle = dojo.connect(obj, method, callback);

Params:

- *obj* is the object in which *method* resides. If *method* lives in the global scope, use 'null' here.

- *method* is the method that you want to connect to.

- *callback* is the method that is called when the method that we connect to is executed.

Example:

Say we want to get notified whenever 'app.someMethod' is called:


.. code-block:: none
  
  dojo.connect(app, 'someMethod', function(){ alert('app.someMethod has just been executed!'); });


**Note:** Again, make sure you are in the right context if your callback function uses the *this* keyword!

