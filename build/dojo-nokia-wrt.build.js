({
    baseUrl: "./src",
    execModules: true,
    skipModuleInsertion:true,
    includeRequire: false,
    out: "dist/dojo-nokia-wrt.js",
    include: [
        "dojo/_platforms/nokia-wrt",
        "dojo/_features/dojo-kitchen-sink"
    ]
})
