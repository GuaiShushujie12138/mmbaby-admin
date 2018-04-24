var moduleConfig = {
  // Set to true if you want to see what and when is dynamically loaded
  debug: true,
  events: true,
  modules: [
    {
      name: "app.dashboard",
      module: true,
      files: [
        "dist/script/dashboard" + LG.appConfig.staticFileSuffix + ".js" + "?v="
        + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.demand-mgmt",
      module: true,
      files: [
        "dist/script/demand-mgmt" + LG.appConfig.staticFileSuffix + ".js" + "?v="
        + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.role-permission-mgmt",
      module: true,
      files: [
        "dist/script/role-permission-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.user-mgmt",
      module: true,
      files: [
        "dist/script/user-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.customer-mgmt",
      module: true,
      files: [
        "dist/script/customer-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion

      ]
    },
    {
      name: "app.real-name-authentication-mgmt",
      module: true,
      files: [
        "dist/script/real-name-authentication-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion

      ]
    },
    {
      name: "app.userlog-mgmt",
      module: true,
      files: [
        "dist/script/sys-mgmt" + LG.appConfig.staticFileSuffix
        + ".js" + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.report-mgmt",
      module: true,
      files: [
        "dist/script/report-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.download-mgmt",
      module: true,
      files: [
        "dist/script/download-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.trade-mgmt",
      module: true,
      files: [
        "dist/script/trade-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.function-privilege-mgmt",
      module: true,
      files: [
        "dist/script/function-privilege-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.customer-layer-mgmt",
      module: true,
      files: [
        "dist/script/customer-layer-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.cloth-check",
      module: true,
      files: [
        "dist/script/cloth-check" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.sample-mgmt",
      module: true,
      files: [
        "dist/script/sample-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.item-check-mgmt",
      module: true,
      files: [
        "dist/script/item-check-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.import-data-mgmt",
      module: true,
      files: [
        "dist/script/import-data-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.request-inquiry-management",
      module: true,
      files: [
        "dist/script/requestInquiry-management-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.packing-slip-management",
      module: true,
      files: [
        "dist/script/packingSlip-management-mgmt" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.bind-card",
      module: true,
      files: [
        "dist/script/bindCard" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.supplier-mgmt",
      module: true,
      files: [
        "dist/script/supplier-allocation" + LG.appConfig.staticFileSuffix + ".js"
        + "?v=" + LG.appConfig.clientVersion
      ]
    }
  ]
}