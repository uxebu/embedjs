//
//	This file implements a layer that makes embedJS API compatible to dojo,
//	so you can put an embedJS build "under" this compat layer and on top
//	you get exactly the API you are used to from dojo.
//	Of course, you can also purely use embedJS, which is optimized and
//	trimmed to be as efficient as possible on mobile.
//	But to get started this makes it a lot easier for developers who are used to the Dojo API.
//
dojo._toArray = dojo.toArray;