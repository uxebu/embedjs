{
    baseUrl: "../src",
    dir: "../src-build",
    requireUrl: "../src/require.js",
    // we need to execute the modules
    // to catch the require.modify / require.alter calls
    execModules: true,
    /*alternatives:{
        "dojo/array":"dojo/array/functional"
    },
    modifiers:{
        "dojo/array":"dojo/array/functional_addon"
    },*/
    pragmas: {
        requireExcludePlugin: true,
        requireExcludePageLoad: true,
        requireExcludeContext: true
        // we will use modify/alter to change the behaviour
        // of our modules, so we need them after a build
        //requireExcludeModify: true,
        //requireExcludeAlter: true,
    },
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