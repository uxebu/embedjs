
dojo.connectOnce
================

Platforms
---------

Available on all platforms except IE.

Introduction
------------

dojo.connectOnce works just like dojo.connect, except that the connection is removed after it has been used for the first time.

Usage
-----

Just like dojo.connect.

Example
-------

Say, we want to connect to a button that closes something. After that something is closed, we don't need the connection anymore. To make things easier, we can use connctOnce, so we don't need to care about disconnecting.

.. code-block:: none
  
  dojo.connectOnce('#myButton','onclick',dojo.hitch(app,'closeSomething'));

