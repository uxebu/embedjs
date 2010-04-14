({
    baseUrl: "./src",
    dir: "./src-build",
    requireUrl: "./src/require.js",
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
    },
    modules: [
        {
            name: "build/dojo-windows-mobile-v6.5-widget",
            include: [
                "_platforms/windows-mobile-v6.5-widget",
                "_features/dojo-kitchen-sink"
            ]
        },
        {
            // TODO: ignoring depedenceny on the first module!
            name: "build/dojo-android-phonegap",
            include: [
                "_platforms/android-phonegap",
                "_features/dojo-kitchen-sink"
            ]
        }
    ]
})
