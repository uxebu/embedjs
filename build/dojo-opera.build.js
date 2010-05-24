({
    baseUrl: "./src",
    execModules: true,
    skipModuleInsertion:true,
    includeRequire: false,
    out: "dist/dojo-opera.js",
    include: [
        "dojo/_platforms/opera",
        "dojo/_features/dojo-kitchen-sink"
    ]
})
