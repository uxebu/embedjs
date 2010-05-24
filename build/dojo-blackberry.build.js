({
    baseUrl: "./src",
    execModules: true,
    skipModuleInsertion:true,
    includeRequire: false,
    out: "dist/dojo-blackberry.js",
    include: [
        "dojo/_platforms/blackberry",
        "dojo/_features/dojo-kitchen-sink"
    ]
})
