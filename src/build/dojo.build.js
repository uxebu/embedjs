{
    baseUrl: "../src",
    dir: "../src-build",
    requireUrl: "../src/require.js",
    //optimize: "none",
    /*paths: {
        "dojo/array": "dojo/array/functional"
    },*/
    execModules: true,
    /*alternatives:{
        "dojo/array":"dojo/array/functional"
    },
    modifiers:{
        "dojo/array":"dojo/array/functional_addon"
    },*/
    /*pragmas: {
        requireExcludeModify: true,
        requireExcludeAlter: true,
        requireExcludePlugin: true,
        requireExcludePageLoad: true,
        requireExcludeContext: true
    },*/
    modules: [
        {
            name: "build/dojo_WindowsMobile-v6.5",
            includeRequire: true,
            include: [
                "platforms/WindowsMobile-v6.5-widget",
                "dojo_kitchen_sink"
            ]
        }
    ]
}