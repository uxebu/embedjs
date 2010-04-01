{
    baseUrl: "../src",
    dir: "../src-build",
    requireUrl: "../src/require.js",
    //optimize: "none",
    paths: {
        "dojo/array": "dojo/array/functional"
    },
    execModules: true,
    modifiers:{
        alter:"blubb"
    },
    /*pragmas: {
        requireExcludeModify: true,
        requireExcludeAlter: true,
        requireExcludePlugin: true,
        requireExcludePageLoad: true,
        requireExcludeContext: true
    },*/
    modules: [
        {
            name: "dojo",
            includeRequire: true,
            include: [
                "platforms/WindowsMobile-v6.5-widget",
                "dojo/array"
            ]
        }
    ]
}