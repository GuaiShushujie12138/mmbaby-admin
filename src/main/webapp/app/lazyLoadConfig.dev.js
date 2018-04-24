var moduleConfig = {
  // Set to true if you want to see what and when is dynamically loaded
  // 注意:如果新增一个模块,注意要在lazyLoadConfig.release.js 中也要添加一下,不然会在生产中出现不了
  debug: true, events: true, modules: [{
    name: "app.dashboard",
    module: true,
    files: ["app/dashboard/dashboard.module.js?v="
    + LG.appConfig.clientVersion,
      "app/dashboard/dashboard.service.js?v=" + LG.appConfig.clientVersion,
      "app/dashboard/dashboard.controller.js?v="
      + LG.appConfig.clientVersion]
  }, {
    name: "app.demand-mgmt",
    module: true,
    files: ["app/demand-mgmt/demand-mgmt.module.js?v="
    + LG.appConfig.clientVersion,
      "app/demand-mgmt/demand-mgmt.service.js?v="
      + LG.appConfig.clientVersion,
      "app/demand-mgmt/modal/detail-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/demand-mgmt/modal/demand-result.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/demand-mgmt/modal/trade-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/demand-mgmt/modal/user-undispatch-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/demand-mgmt/modal/user-dispatch-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/demand-mgmt/modal/reply-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/demand-mgmt/modal/demand-area.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/demand-mgmt/modal/demand-dynamic.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/demand-mgmt/demand-mgmt.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/demand-mgmt/modal/print-demand-qr-code.modal.controller.js?v="
      + LG.appConfig.clientVersion,
    ]
  }, {
    name: "app.role-permission-mgmt",
    module: true,
    files: ["app/role-permission-mgmt/role-permission-mgmt.module.js?v="
    + LG.appConfig.clientVersion,
      "app/role-permission-mgmt/role-permission-mgmt.service.js?v="
      + LG.appConfig.clientVersion,
      "app/role-permission-mgmt/modal/role-permission-mgmt-detail.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/role-permission-mgmt/modal/assignPermission.modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/role-permission-mgmt/role-permission-mgmt.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/role-permission-mgmt/modal/role-scope-mgmt.modal.controller.js?v="
      + LG.appConfig.clientVersion]
  }, {
    name: "app.user-mgmt",
    module: true,
    files: ["app/user-mgmt/user-mgmt.module.js?v="
    + LG.appConfig.clientVersion,
      "app/user-mgmt/user-mgmt.service.js?v=" + LG.appConfig.clientVersion,
      "app/user-mgmt/modal/view-user-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/user-mgmt/modal/view-user-log-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/user-mgmt/modal/add-dept-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/user-mgmt/modal/add-user-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/user-mgmt/modal/update-user-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/user-mgmt/modal/change-dept-modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/user-mgmt/modal/add-sales-area.modal.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/user-mgmt/user-mgmt.controller.js?v="
      + LG.appConfig.clientVersion
    ]
  }, {
    name: "app.customer-mgmt",
    module: true,
    files: ["app/customer-mgmt/customer-mgmt.module.js?v="
    + LG.appConfig.clientVersion,
      "app/customer-mgmt/customer-mgmt.service.js?v="
      + LG.appConfig.clientVersion,
      "app/customer-mgmt/customer-mgmt.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/customer-mgmt/modal/customer-edit.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/customer-mgmt/modal/allotcustomerSeller.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/customer-mgmt/modal/allotcustomerBuyer.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/customer-mgmt/modal/customer-log.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/customer-mgmt/modal/customer-visitRecord.controller.js?v="
      + LG.appConfig.clientVersion,
        "app/customer-mgmt/modal/customer-visitBack.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/customer-mgmt/modal/customer-public.controller.js?v="
      + LG.appConfig.clientVersion,
      "app/customer-mgmt/modal/allocate-batch.controller.js?v="
      + LG.appConfig.clientVersion,
        "app/customer-mgmt/modal/addVisit.controller.js?v="
        + LG.appConfig.clientVersion
    ]
  },
    {
      name: "app.real-name-authentication-mgmt",
      module: true,
      files: ["app/real-name-authentication-mgmt/real-mgmt.module.js?v="
      + LG.appConfig.clientVersion,
        "app/real-name-authentication-mgmt/real-mgmt.service.js?v="
        + LG.appConfig.clientVersion,
        "app/real-name-authentication-mgmt/real-mgmt.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/real-name-authentication-mgmt/modal/real-detail.controller.js?v="
        + LG.appConfig.clientVersion

      ]
    },

    {
      name: "app.userlog-mgmt",
      module: true,
      files: ["app/sys-mgmt/userlog-mgmt.module.js?v="
      + LG.appConfig.clientVersion,
        "app/sys-mgmt/userlog-mgmt.service.js?v="
        + LG.appConfig.clientVersion,
        "app/sys-mgmt/userlog-mgmt.controller.js?v="
        + LG.appConfig.clientVersion,

      ]
    }, {
      name: "app.report-mgmt",
      module: true,
      files: ["app/report-mgmt/report-mgmt.module.js?v="
      + LG.appConfig.clientVersion,
        "app/report-mgmt/report-mgmt.service.js?v="
        + LG.appConfig.clientVersion,
        "app/report-mgmt/report-mgmt.controller.js?v="
        + LG.appConfig.clientVersion

      ]
    }, {
      name: "app.download-mgmt",
      module: true,
      files: ["app/download-mgmt/download-mgmt.module.js?v="
      + LG.appConfig.clientVersion,
        "app/download-mgmt/download-mgmt.service.js?v="
        + LG.appConfig.clientVersion,
        "app/download-mgmt/download-mgmt.controller.js?v="
        + LG.appConfig.clientVersion

      ]
    }, {
      name: "app.trade-mgmt",
      module: true,
      files: [
        "app/trade-mgmt/trade-mgmt.module.js?v="
        + LG.appConfig.clientVersion,
        "app/trade-mgmt/trade-mgmt.service.js?v="
        + LG.appConfig.clientVersion,
        "app/trade-mgmt/modal/trade-detail-modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/trade-mgmt/modal/trade-mark-source.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/trade-mgmt/modal/trade-mark-shop.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/trade-mgmt/modal/refundLog.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/trade-mgmt/modal/mark-shop-search.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/trade-mgmt/modal/changeOperator.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/trade-mgmt/trade-mgmt.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/trade-mgmt/modal/delivery.controller.js?v=" + LG.appConfig.clientVersion
      ]
    },

    {
      name: "app.function-privilege-mgmt",
      module: true,
      files: ["app/function-privilege-mgmt/function-privilege-mgmt.module.js?v="
      + LG.appConfig.clientVersion,
        "app/function-privilege-mgmt/function-privilege-mgmt.service.js?v="
        + LG.appConfig.clientVersion,
        "app/function-privilege-mgmt/function-privilege-mgmt.controller.js?v="
        + LG.appConfig.clientVersion

      ]
    },
    {
      name: "app.customer-layer-mgmt",
      module: true,
      files: ["app/customer-layer-mgmt/customer-layer-mgmt.module.js?v="
      + LG.appConfig.clientVersion,
        "app/customer-layer-mgmt/customer-layer-mgmt.service.js?v="
        + LG.appConfig.clientVersion,
        "app/customer-layer-mgmt/customer-layer-mgmt.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/customer-layer-mgmt/modal/save-layer-modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/customer-layer-mgmt/modal/limit-count-modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/customer-layer-mgmt/modal/white-list-modal.controller.js?v="
        + LG.appConfig.clientVersion
      ]
    }, {
      name: "app.cloth-check",
      module: true,
      serie: true,
      files: [
        "app/cloth-check/cloth-check.module.js?v="
        + LG.appConfig.clientVersion,
        "app/cloth-check/cloth-check.service.js?v="
        + LG.appConfig.clientVersion,
        "app/cloth-check/cloth-check.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/cloth-check/modal/clothRecord.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/cloth-check/modal/closeClothRecord.controller.js?v="
        + LG.appConfig.clientVersion,
      ]
    },
    {
      name: "app.sample-mgmt",
      module: true,
      files: [
        "app/sample-mgmt/sample-mgmt.module.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/sample-mgmt.service.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/sample-mgmt.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/modal/sample-detail.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/modal/sample-log.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/modal/print-qr-code.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/modal/create-sample-id.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/modal/print-batch-qr-code.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/modal/search-item.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/modal/modify-belong-operator.modal.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/modal/sample-history.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/sample-mgmt/modal/re-create-print-sample.modal.controller.js?v="
          + LG.appConfig.clientVersion,
        "app/sample-mgmt/modal/batch-change-shelf.controller.js?v="
        + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.item-check-mgmt",
      module: true,
      files: [
        "app/item-check-mgmt/item-check-mgmt.module.js?v="
        + LG.appConfig.clientVersion,
        "app/item-check-mgmt/item-check-mgmt.service.js?v="
        + LG.appConfig.clientVersion,
        "app/item-check-mgmt/item-check-mgmt.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/item-check-mgmt/modal/add-edit-check-item.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/item-check-mgmt/modal/add-edit-check-item-iframe.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/item-check-mgmt/modal/is-qualified.controller.js?v="
        + LG.appConfig.clientVersion
      ]
    },
    {
      name: "app.import-data-mgmt",
      module: true,
      files: [
        "app/import-data-mgmt/import-data-mgmt.module.js?v="
        + LG.appConfig.clientVersion,
        "app/import-data-mgmt/import-data-mgmt.service.js?v="
        + LG.appConfig.clientVersion,
        "app/import-data-mgmt/import-data-mgmt.controller.js?v="
        + LG.appConfig.clientVersion

      ]
    },
    {
      name: "app.request-inquiry-management",
      module: true,
      files: [
        "app/requestInquiry-management-mgmt/requestInquiry-management.module.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/requestInquiry-management.service.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/requestInquiry-management.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/inquiry-recordList.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/allocate-inquiry.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/requestInquiry-detail.controller.js?v="
        + LG.appConfig.clientVersion,
        'app/requestInquiry-management-mgmt/modal/select-buyerSeller-id.controller.js?v='
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/start-packing-slip.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/supplier-list.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/supplier-detail.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/add-supplier.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/editInquiry.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/editInquiryNext.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/feedbackInquiry.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/watchInquiryDetail.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/stateChange.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/chooseTrade.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/requestInquiry-management-mgmt/modal/editInquiryForSupplier.controller.js?v="
        + LG.appConfig.clientVersion,

      ]
    }, {
      name: "app.packing-slip-management",
      module: true,
      files: [
        "app/packingSlip-management-mgmt/packingSlip-management.module.js?v="
        + LG.appConfig.clientVersion,
        "app/packingSlip-management-mgmt/packingSlip-management.service.js?v="
        + LG.appConfig.clientVersion,
        "app/packingSlip-management-mgmt/packingSlip-management.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/packingSlip-management-mgmt/modal/packingSlip-recordList.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/packingSlip-management-mgmt/modal/packingSlip-detail.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/packingSlip-management-mgmt/modal/modifySalePrice.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/packingSlip-management-mgmt/modal/modifyLsPrice.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/packingSlip-management-mgmt/modal/select-buyerSeller-id.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/packingSlip-management-mgmt/modal/electronic-packing-slip.controller.js?v="
        + LG.appConfig.clientVersion,
        "app/packingSlip-management-mgmt/modal/packingSlipFailure.controller.js?v="
        + LG.appConfig.clientVersion,
      ]
    },{
      name: "app.bind-card",
      module: true,
      files: [
          "app/bindCard/bindCard.module.js?v=" + LG.appConfig.clientVersion,
          "app/bindCard/bindCard.service.js?v=" + LG.appConfig.clientVersion,
          "app/bindCard/bindCard.controller.js?v=" + LG.appConfig.clientVersion
      ]
    },{
      name: "app.supplier-mgmt",
      module: true,
      files: [
        "app/supplier-allocation/supplier-mgmt.module.js?v=" + LG.appConfig.clientVersion,
        "app/supplier-allocation/supplier-mgmt.service.js?v=" + LG.appConfig.clientVersion,
        "app/supplier-allocation/supplier-mgmt.controller.js?v=" + LG.appConfig.clientVersion,
        "app/supplier-allocation/modal/allocate-supplier.controller.js?v=" + LG.appConfig.clientVersion,
        "app/supplier-allocation/modal/release-supplier.controller.js?v=" + LG.appConfig.clientVersion
      ]
    }
  ]
};