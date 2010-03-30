require({
    baseUrl: "./",
    dir: "../src-build",
    requireUrl: "require.js",
    //optimize: "none",
    paths: {
        "dojo/array": "dojo/array/functional"
    },
    execModules:true,
    
    modifiers:{
        alter:"blubb"
    }/*,
    includeRequire: true,
    pragmas: {
        requireExcludeModify: true,
        requireExcludeAlter: true,
        requireExcludePlugin: true,
        requireExcludePageLoad: true,
        requireExcludeContext: true
    }*/
},
"dojo",
["platforms/WindowsMobile-v6.5-widget.js", "dojo/array"]);