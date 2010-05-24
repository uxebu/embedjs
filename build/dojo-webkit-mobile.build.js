({
    baseUrl: "./src",
    execModules: true,
    skipModuleInsertion:true,
    includeRequire: false,
    out: "dist/dojo-webkit-mobile.js",
    include: [
        "dojo/_platforms/webkit-mobile",
        "dojo/_features/dojo-kitchen-sink"
    ]
})
