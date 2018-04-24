/**
 * Admin - 后台管理
 *
 * Use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 */

(function () {

    'use strict';

    function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider,
                    IdleProvider, KeepaliveProvider) {

        // Configure Idle settings
        IdleProvider.idle(5); // in seconds
        IdleProvider.timeout(120); // in seconds

        $urlRouterProvider.otherwise('/dashboard/index');

        $ocLazyLoadProvider.config(moduleConfig);

        $stateProvider
            .state('dashboard', {
                abstract: true,
                url: '/dashboard',
                cache: 'false',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('dashboard.index', {
                url: '/index',
                templateUrl: 'app/dashboard/index.html?v=' + LG.appConfig.clientVersion,
                data: {pageTitle: '工作台', functionCode: "-1"},
                controller: 'DashboardCtrl',
                cache: 'false',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.dashboard']);
                    }]
                }

            })
            .state('DEMAND-MGMT', {
                abstract: true,
                url: '/demand-mgmt',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('DEMAND-MGMT.QUERY', {
                url: '/demand-list',
                templateUrl: 'app/demand-mgmt/demand-query.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '需求管理', functionCode: "WEB.DEMAND-MGMT.QUERY"},
                controller: 'DemandMgmtCtrl',
                controllerAs: 'vm',
                params: {
                    demandIdStr: ''
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.demand-mgmt', 'app.sample-mgmt', 'app.customer-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['css/plugins/chosen/chosen.css',
                                    'js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js']
                            }, {
                                files: ['js/plugins/sweetalert/sweetalert.min.js',
                                    'css/plugins/sweetalert/sweetalert.css']
                            }, {
                                name: 'oitozero.ngSweetAlert',
                                files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                            }, {
                                name: 'datePicker',
                                files: ['css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/moment/moment.min.js',
                                    'js/plugins/daterangepicker/daterangepicker.zh.js',
                                    'css/plugins/daterangepicker/daterangepicker-bs3.css']
                            }, {
                                name: 'daterangepicker',
                                files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                            }, {
                                files: [
                                    'js/plugins/swipeBox/jquery.swipebox.min.js',
                                    'js/plugins/swipeBox/swipebox.min.css'
                                ]
                            }
                        ]);
                    }
                }
            })
            .state('DEMAND-MGMT.FEEDBACK', {
                url: '/feedback/:demandId',
                templateUrl: 'app/demand-mgmt/modal/demandResult.html?v=' + LG.appConfig.clientVersion,
                data: {pageTitle: '找版反馈', functionCode: 'WEB.DEMAND-MGMT.QUERY.QUERYRESULTLIST'},
                controller: 'DemandResultCtrlForRoute',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.demand-mgmt']);
                    }],
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['css/plugins/chosen/chosen.css',
                                    'js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js']
                            }, {
                                files: ['js/plugins/sweetalert/sweetalert.min.js',
                                    'css/plugins/sweetalert/sweetalert.css']
                            }, {
                                name: 'oitozero.ngSweetAlert',
                                files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                            }, {
                                name: 'datePicker',
                                files: ['css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/moment/moment.min.js',
                                    'js/plugins/daterangepicker/daterangepicker.zh.js',
                                    'css/plugins/daterangepicker/daterangepicker-bs3.css']
                            }, {
                                name: 'daterangepicker',
                                files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                            }, {
                                files: [
                                    'js/plugins/swipeBox/jquery.swipebox.min.js',
                                    'js/plugins/swipeBox/swipebox.min.css'
                                ]
                            }
                        ]);
                    }
                }
            })
            .state('SAMPLE-MGMT', {
                abstract: true,
                url: '/sample-mgmt',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('SAMPLE-MGMT.QUERY', {
                url: '/sample-query',
                templateUrl: 'app/sample-mgmt/sample-query.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '样卡列表', functionCode: "WEB.SAMPLE-MGMT.QUERY"},
                controller: 'SampleMgmtCtrl',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.sample-mgmt', 'app.trade-mgmt', 'app.demand-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['css/plugins/chosen/chosen.css',
                                    'js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js']
                            }, {
                                files: ['js/plugins/blueimp/jquery.blueimp-gallery.min.js',
                                    'css/plugins/blueimp/css/blueimp-gallery.min.css']
                            }, {
                                files: ['js/plugins/sweetalert/sweetalert.min.js',
                                    'css/plugins/sweetalert/sweetalert.css']
                            }, {
                                name: 'oitozero.ngSweetAlert',
                                files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                            }, {
                                name: 'datePicker',
                                files: ['css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/moment/moment.min.js',
                                    'js/plugins/daterangepicker/daterangepicker.zh.js',
                                    'css/plugins/daterangepicker/daterangepicker-bs3.css']
                            }, {
                                name: 'daterangepicker',
                                files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                            }, {
                                files: ['css/plugins/jsTree/style.min.css',
                                    'js/plugins/jsTree/jstree.min.js']
                            }, {
                                name: 'ngJsTree', files: ['js/plugins/jsTree/ngJsTree.min.js']
                            }
                        ]);
                    }
                }
            })

            .state('SAMPLE-MGMT.DETAIL', {
                url: '/sample-detail/:sampleId',
                templateUrl: 'app/sample-mgmt/modal/sample-detail.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '样卡详情', functionCode: "WEB.SAMPLE-MGMT.QUERY"},
                controller: 'SampleDetailCtrlForRoute',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.sample-mgmt', 'app.trade-mgmt', 'app.demand-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['css/plugins/chosen/chosen.css',
                                    'js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js']
                            }, {
                                files: ['js/plugins/blueimp/jquery.blueimp-gallery.min.js',
                                    'css/plugins/blueimp/css/blueimp-gallery.min.css']
                            }
                        ]);
                    }
                }
            })

            .state('PERMISSION', {
                abstract: true,
                url: '/permission',
                cache: 'false',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('PERMISSION.ROLE-MGMT', {
                url: '/role-query',
                templateUrl: 'app/role-permission-mgmt/role-permission-mgmt-query.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '角色权限', functionCode: "WEB.PERMISSION.ROLE-MGMT"},
                controller: 'RolePermissionMgmtCtrl',
                cache: 'false',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.role-permission-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            insertBefore: '#loadBefore',
                            name: 'localytics.directives',
                            files: ['css/plugins/chosen/chosen.css',
                                'js/plugins/chosen/chosen.jquery.js',
                                'js/plugins/chosen/chosen.js']
                        }, {
                            files: ['js/plugins/sweetalert/sweetalert.min.js',
                                'css/plugins/sweetalert/sweetalert.css']
                        }, {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }, {
                            files: ['css/plugins/jsTree/style.min.css',
                                'js/plugins/jsTree/jstree.min.js']
                        }, {
                            name: 'ngJsTree', files: ['js/plugins/jsTree/ngJsTree.min.js']
                        }]);
                    }
                }

            })
            .state('PERMISSION.USER-MGMT', {
                url: '/user-query',
                templateUrl: 'app/user-mgmt/user-query.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '用户管理', functionCode: "WEB.PERMISSION.USER-MGMT"},
                controller: 'UserMgmtCtrl',
                cache: 'false',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.user-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            insertBefore: '#loadBefore',
                            name: 'localytics.directives',
                            files: ['css/plugins/chosen/chosen.css',
                                'js/plugins/chosen/chosen.jquery.js',
                                'js/plugins/chosen/chosen.js']
                        }, {
                            files: ['js/plugins/sweetalert/sweetalert.min.js',
                                'css/plugins/sweetalert/sweetalert.css']
                        }, {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }, {
                            files: ['css/plugins/jsTree/style.min.css',
                                'js/plugins/jsTree/jstree.min.js']
                        }, {
                            name: 'ngJsTree', files: ['js/plugins/jsTree/ngJsTree.min.js']
                        }]);
                    }
                }

            })
            .state('PERMISSION.FUNCTION-PRIVILEGE-MGMT', {
                url: '/function-privilege-mgmt-query',
                templateUrl: 'app/function-privilege-mgmt/function-privilege-mgmt-query.html?v='
                + LG.appConfig.clientVersion,
                data: {
                    pageTitle: '功能权限管理',
                    functionCode: "WEB.PERMISSION.FUNCTION-PRIVILEGE-MGMT"
                },
                controller: 'FunctionPrivilegeMgmtCtrl',
                cache: 'false',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.function-privilege-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            insertBefore: '#loadBefore',
                            name: 'localytics.directives',
                            files: ['css/plugins/chosen/chosen.css',
                                'js/plugins/chosen/chosen.jquery.js',
                                'js/plugins/chosen/chosen.js']
                        }, {
                            files: ['js/plugins/sweetalert/sweetalert.min.js',
                                'css/plugins/sweetalert/sweetalert.css']
                        }, {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }]);
                    }
                }

            })
            .state('CUSTOMER', {
                abstract: true,
                url: '/customer-mgmt',
                cache: 'false',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('CUSTOMER.CUSTOMER-MGMT', {
                url: '/customer-query',
                templateUrl: 'app/customer-mgmt/customer-query.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '客户管理', functionCode: 'WEB.CUSTOMER.CUSTOMER-MGMT'},
                controller: 'CustomerMgmtCtrl',
                cache: 'false',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.customer-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            insertBefore: '#loadBefore',
                            name: 'localytics.directives',
                            files: ['js/plugins/chosen/chosen.jquery.js',
                                'js/plugins/chosen/chosen.js']
                        }, {
                            files: ['js/plugins/blueimp/jquery.blueimp-gallery.min.js',
                                'css/plugins/blueimp/css/blueimp-gallery.min.css']
                        }, {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css',
                                'js/plugins/datapicker/angular-datepicker.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/moment/moment.min.js',
                                'js/plugins/daterangepicker/daterangepicker.zh.js',
                                'css/plugins/daterangepicker/daterangepicker-bs3.css']
                        }, {
                            name: 'daterangepicker',
                            files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                        }]);
                    }
                }
            })
            .state('CUSTOMER.REAL-NAME-AUTHENTICATION-MGMT', {
                url: '/real-authentication',
                templateUrl: 'app/real-name-authentication-mgmt/real-authentication.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '实名认证审核', functionCode: 'WEB.CUSTOMER.REAL-NAME-AUTHENTICATION-MGMT'},
                controller: 'RealMgmtCtrl',
                cache: 'false',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.real-name-authentication-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            insertBefore: '#loadBefore',
                            name: 'localytics.directives',
                            files: ['js/plugins/chosen/chosen.jquery.js',
                                'js/plugins/chosen/chosen.js']
                        }, {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css',
                                'js/plugins/datapicker/angular-datepicker.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/moment/moment.min.js',
                                'js/plugins/daterangepicker/daterangepicker.zh.js',
                                'css/plugins/daterangepicker/daterangepicker-bs3.css']
                            // }, {
                            //   files: ['js/plugins/blueimp/jquery.blueimp-gallery.min.js',
                            //     'css/plugins/blueimp/css/blueimp-gallery.min.css']
                        }, {
                            name: 'daterangepicker',
                            files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                        }, {
                            files: ['js/plugins/photoswipe/js/photoswipe.min.js',
                                'js/plugins/photoswipe/js/photoswipe-ui-default.min.js',
                                'js/plugins/photoswipe/css/photoswipe.css',
                                'js/plugins/photoswipe/default-skin/default-skin.css']
                        }]);
                    }
                }
            })

            .state('REPORT', {
                abstract: true,
                url: '/report',
                cache: 'false',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('REPORT.KPI-SUMMARY', {
                url: '/kpi-summary',
                templateUrl: 'app/report-mgmt/kpi-summary.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '业绩汇总', functionCode: 'WEB.REPORT.KPI-SUMMARY'},
                controller: 'ReportMgmtCtrl',
                cache: 'false',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.report-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            insertBefore: '#loadBefore',
                            name: 'localytics.directives',
                            files: ['js/plugins/chosen/chosen.jquery.js',
                                'js/plugins/chosen/chosen.js']
                        }, {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css',
                                'js/plugins/datapicker/angular-datepicker.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/moment/moment.min.js',
                                'js/plugins/daterangepicker/daterangepicker.zh.js',
                                'css/plugins/daterangepicker/daterangepicker-bs3.css']
                        }, {
                            name: 'daterangepicker',
                            files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                        }]);
                    }
                }
            })
            .state('REPORT.DOWNLOAD', {
                url: '/download',
                templateUrl: 'app/download-mgmt/download-mgmt-query.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '下载列表', functionCode: 'WEB.REPORT.DOWNLOAD'},
                controller: 'DownloadMgmtCtrl',
                cache: 'false',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.download-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            insertBefore: '#loadBefore',
                            name: 'localytics.directives',
                            files: ['js/plugins/chosen/chosen.jquery.js',
                                'js/plugins/chosen/chosen.js']
                        }, {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css',
                                'js/plugins/datapicker/angular-datepicker.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/moment/moment.min.js',
                                'js/plugins/daterangepicker/daterangepicker.zh.js',
                                'css/plugins/daterangepicker/daterangepicker-bs3.css']
                        }, {
                            name: 'daterangepicker',
                            files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                        }]);
                    }
                }
            })
            .state('SYSTEM', {
                abstract: true,
                url: '/system-mgmt',
                cache: 'false',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('SYSTEM.SYSLOG', {
                url: '/userlog-query',
                templateUrl: 'app/sys-mgmt/userlog-query.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '系统日志', functionCode: 'WEB.SYSTEM.SYSLOG'},
                controller: 'UserLogMgmtCtrl',
                cache: 'false',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.userlog-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css',
                                'js/plugins/datapicker/angular-datepicker.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/moment/moment.min.js',
                                'js/plugins/daterangepicker/daterangepicker.zh.js',
                                'css/plugins/daterangepicker/daterangepicker-bs3.css']
                        }, {
                            name: 'daterangepicker',
                            files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                        }]);
                    }
                }
            })
            .state('TRADE-MGMT', {
                abstract: true,
                url: '/trade-mgmt',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })

            .state('TRADE-MGMT.QUERY', {
                url: '/trade-query',
                templateUrl: 'app/trade-mgmt/trade-query.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '订单管理', functionCode: 'WEB.TRADE-MGMT.QUERY'},
                controller: 'TradeMgmtCtrl',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.trade-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {

                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js']
                            }, {
                                name: 'datePicker',
                                files: ['css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/moment/moment.min.js',
                                    'js/plugins/daterangepicker/daterangepicker.zh.js',
                                    'css/plugins/daterangepicker/daterangepicker-bs3.css']
                            }, {
                                name: 'daterangepicker',
                                files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                            }, {
                                files: [
                                    'js/plugins/plupload/plupload.min.js',
                                    'js/plugins/plupload/new_oss_upload.js',
                                ],
                                serie: true
                            }]);
                    }
                }
            })
            .state('CLOTH-CHECK', {
                abstract: true,
                url: '/cloth-check',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('CLOTH-CHECK.QUERY', {
                url: '/cloth-query',
                templateUrl: 'app/cloth-check/cloth-query.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '验布大盘', functionCode: 'WEB.CLOTH-CHECK.QUERY'},
                controller: 'ClothCheckCtrl',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.cloth-check']);
                    }], loadPlugin: function ($ocLazyLoad) {

                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js']
                            }, {
                                name: 'datePicker',
                                files: ['css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/moment/moment.min.js',
                                    'js/plugins/daterangepicker/daterangepicker.zh.js',
                                    'css/plugins/daterangepicker/daterangepicker-bs3.css']
                            }, {
                                name: 'daterangepicker',
                                files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                            }, {
                                files: ['css/plugins/jsTree/style.min.css',
                                    'js/plugins/jsTree/jstree.min.js']
                            }, {
                                name: 'ngJsTree', files: ['js/plugins/jsTree/ngJsTree.min.js']
                            }
                        ]);
                    }
                }
            })
            .state('CUSTOMER-LAYER', {
                abstract: true,
                url: '/customer-layer-mgmt',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('CUSTOMER-LAYER.BUYER', {
                url: '/buyer',
                templateUrl: 'app/customer-layer-mgmt/customer-layer.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '买家客户分层管理', functionCode: 'WEB.CUSTOMER-LAYER.BUYER'},
                controller: 'CustomerLayerMgmtCtrl',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.customer-layer-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {

                        return $ocLazyLoad.load([{
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css',
                                'js/plugins/datapicker/angular-datepicker.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/moment/moment.min.js',
                                'js/plugins/daterangepicker/daterangepicker.zh.js',
                                'css/plugins/daterangepicker/daterangepicker-bs3.css']
                        }, {
                            name: 'daterangepicker',
                            files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                        }, {
                            insertBefore: '#loadBefore',
                            name: 'localytics.directives',
                            files: ['js/plugins/chosen/chosen.jquery.js',
                                'js/plugins/chosen/chosen.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                        }]);
                    },
                    customerType: function () {
                        return 1;
                    }
                }
            })
            .state('CUSTOMER-LAYER.SELLER', {
                url: '/seller',
                templateUrl: 'app/customer-layer-mgmt/customer-layer.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '卖家客户分层管理', functionCode: 'WEB.CUSTOMER-LAYER.SELLER'},
                controller: 'CustomerLayerMgmtCtrl',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.customer-layer-mgmt']);
                    }],
                    loadPlugin: function ($ocLazyLoad) {

                        return $ocLazyLoad.load([{
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css',
                                'js/plugins/datapicker/angular-datepicker.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/moment/moment.min.js',
                                'js/plugins/daterangepicker/daterangepicker.zh.js',
                                'css/plugins/daterangepicker/daterangepicker-bs3.css']
                        }, {
                            name: 'daterangepicker',
                            files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                        }, {
                            insertBefore: '#loadBefore',
                            name: 'localytics.directives',
                            files: ['js/plugins/chosen/chosen.jquery.js',
                                'js/plugins/chosen/chosen.js']
                        }, {
                            serie: true,
                            files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                        }]);
                    },
                    customerType: function () {
                        return 2;
                    }
                }
            })
            .state('ITEM-CHECK', {
                abstract: true,
                url: '/item-check',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('ITEM-CHECK.QUERY', {
                url: '/query',
                templateUrl: 'app/item-check-mgmt/item-check-mgmt-query.html?v=' + LG.appConfig.clientVersion,
                data: {pageTitle: '自营普通商品', functionCode: 'WEB.ITEM-CHECK.QUERY'},
                controller: 'itemCheckMgmtCtrl',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.item-check-mgmt']);
                    }],
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js']
                            }, {
                                name: 'datePicker',
                                files: ['css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/moment/moment.min.js',
                                    'js/plugins/daterangepicker/daterangepicker.zh.js',
                                    'css/plugins/daterangepicker/daterangepicker-bs3.css']
                            }, {
                                name: 'daterangepicker',
                                files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                            }, {
                                files: ['js/plugins/sweetalert/sweetalert.min.js',
                                    'css/plugins/sweetalert/sweetalert.css']
                            }, {
                                name: 'oitozero.ngSweetAlert',
                                files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                            }])
                    }
                }

            })
            .state('ITEM-CHECK.EDIT', {
                url: '/edit/:itemId/:state',
                templateUrl: 'app/item-check-mgmt/modal/add-edit-check-item.html?v=' + LG.appConfig.clientVersion,
                data: {pageTitle: '编辑自营普通商品', functionCode: 'WEB.ITEM-CHECK.QUERY'},
                controller: 'addEditCheckItemCtrlForRoute',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.item-check-mgmt']);
                    }],
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js']
                            }, {
                                name: 'datePicker',
                                files: ['css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/moment/moment.min.js',
                                    'js/plugins/daterangepicker/daterangepicker.zh.js',
                                    'css/plugins/daterangepicker/daterangepicker-bs3.css']
                            }, {
                                name: 'daterangepicker',
                                files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                            }, {
                                files: ['js/plugins/sweetalert/sweetalert.min.js',
                                    'css/plugins/sweetalert/sweetalert.css']
                            }, {
                                name: 'oitozero.ngSweetAlert',
                                files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                            }])
                    }
                }

            })
            .state('IMPORT-DATA', {
                abstract: true,
                url: '/import-data',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })
            .state('IMPORT-DATA.OFFLINE-ORDER', {
                url: '/upload',
                templateUrl: 'app/import-data-mgmt/import-data-mgmt-upload.html?v=' + LG.appConfig.clientVersion,
                data: {pageTitle: '导入线下样布订单', functionCode: 'WEB.IMPORT-DATA.OFFLINE-ORDER'},
                controller: 'importDataMgmtCtrl',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.import-data-mgmt']);
                    }],
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                name: 'daterangepicker',
                                files: [
                                    'js/plugins/daterangepicker/angular-daterangepicker.js',
                                    'js/plugins/daterangepicker/daterangepicker.zh.js']
                            }
                        ])
                    }
                }

    })
    .state('PACKING', {
      abstract: true,
      url: '/packing',
      templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
    })
    .state('PACKING.SLIP',{
      url: '/query',
      templateUrl: 'app/packingSlip-management-mgmt/packingSlip-management-query.html?v=' + LG.appConfig.clientVersion,
      data: {pageTitle: '码单管理',functionCode: 'WEB.PACKING.SLIP'},
      controller: 'packingSlipCtrl',
      controllerAs: 'vm',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load(['app.packing-slip-management','app.packing-slip-management']);
        }],
        loadPlugin: function($ocLazyLoad) {
          return $ocLazyLoad.load([
            {
              insertBefore: '#loadBefore',
              name: 'localytics.directives',
              files: ['js/plugins/chosen/chosen.jquery.js',
                'js/plugins/chosen/chosen.js']
            }, {
              files: ['js/plugins/sweetalert/sweetalert.min.js',
                'css/plugins/sweetalert/sweetalert.css']
            },
            {
              name: 'oitozero.ngSweetAlert',
              files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
            },{
              name: 'datePicker',
              files: ['css/plugins/datapicker/angular-datapicker.css',
                'js/plugins/datapicker/angular-datepicker.js']
            }, {
              serie: true,
              files: ['js/plugins/moment/moment.min.js',
                'js/plugins/daterangepicker/daterangepicker.zh.js',
                'css/plugins/daterangepicker/daterangepicker-bs3.css']
            }, {
              name: 'daterangepicker',
              files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
            },{
              files: ['css/plugins/jsTree/style.min.css',
                'js/plugins/jsTree/jstree.min.js']
            }, {
                  serie: true,
                  files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
              },{
              name: 'ngJsTree', files: ['js/plugins/jsTree/ngJsTree.min.js']
            },{
              files: [
                'js/plugins/plupload/plupload.min.js',
                'js/plugins/plupload/new_oss_upload.js',
              ],
              serie: true
            }])
        }
      }
    })
    .state('REQUEST', {
      abstract: true,
      url: '/request',
      templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
    })
    .state('REQUEST.INQUIRY',{
      url: '/query',
      templateUrl: 'app/requestInquiry-management-mgmt/requestInquiry-management-query.html?v=' + LG.appConfig.clientVersion,
      data: {pageTitle: '询价单管理',functionCode: 'WEB.REQUEST.INQUIRY'},
      controller: 'requestInquiryCtrl',
      controllerAs: 'vm',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load(['app.request-inquiry-management']);
        }],
        loadPlugin: function($ocLazyLoad) {
          return $ocLazyLoad.load([
            {
              insertBefore: '#loadBefore',
              name: 'localytics.directives',
              files: ['js/plugins/chosen/chosen.jquery.js',
                'js/plugins/chosen/chosen.js',
              ]
            }, {
              files: ['js/plugins/sweetalert/sweetalert.min.js',
                'css/plugins/sweetalert/sweetalert.css']
            }, {
              name: 'oitozero.ngSweetAlert',
              files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
            },{
              name: 'datePicker',
              files: ['css/plugins/datapicker/angular-datapicker.css',
                'js/plugins/datapicker/angular-datepicker.js']
            }, {
              serie: true,
              files: ['js/plugins/moment/moment.min.js',
                'js/plugins/daterangepicker/daterangepicker.zh.js',
                'css/plugins/daterangepicker/daterangepicker-bs3.css']
            }, {
              files: ['css/plugins/select2/select2.min.css',
                 'js/plugins/select2/select2.min.js']
            },{
              name: 'daterangepicker',
              files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
            },{
              files: ['css/plugins/jsTree/style.min.css',
                'js/plugins/jsTree/jstree.min.js']
            }, {
                  serie: true,
                  files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
              },{
              name: 'ngJsTree', files: ['js/plugins/jsTree/ngJsTree.min.js']
            },{
              files: [
                'js/plugins/plupload/plupload.min.js',
                'js/plugins/plupload/new_oss_upload.js',
              ],
              serie: true
            }
          ])
        }
      }
    })
    .state('REQUEST.INQUIRYDETAIL',{
      url: '/query/:itemId',
      templateUrl: 'app/requestInquiry-management-mgmt/modal/watchInquiryDetail.html?v=' + LG.appConfig.clientVersion,
      data: {pageTitle: '询价单详情',functionCode: 'WEB.REQUEST.INQUIRY.DETAIL'},
      controller: 'watchInquiryCtrlForRoute',
      controllerAs: 'vm',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load(['app.request-inquiry-management']);
        }],
        loadPlugin: function($ocLazyLoad) {
          return $ocLazyLoad.load([
            {
              insertBefore: '#loadBefore',
              name: 'localytics.directives',
              files: ['js/plugins/chosen/chosen.jquery.js',
                'js/plugins/chosen/chosen.js',
              ]
            }, {
              files: ['js/plugins/sweetalert/sweetalert.min.js',
                'css/plugins/sweetalert/sweetalert.css']
            }, {
              name: 'oitozero.ngSweetAlert',
              files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
            },{
              name: 'datePicker',
              files: ['css/plugins/datapicker/angular-datapicker.css',
                'js/plugins/datapicker/angular-datepicker.js']
            }, {
              serie: true,
              files: ['js/plugins/moment/moment.min.js',
                'js/plugins/daterangepicker/daterangepicker.zh.js',
                'css/plugins/daterangepicker/daterangepicker-bs3.css']
            }, {
              name: 'daterangepicker',
              files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
            },{
              files: ['css/plugins/jsTree/style.min.css',
                'js/plugins/jsTree/jstree.min.js']
            }, {
                  serie: true,
                  files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
              },{
              name: 'ngJsTree', files: ['js/plugins/jsTree/ngJsTree.min.js']
            },{
              files: [
                'js/plugins/plupload/plupload.min.js',
                'js/plugins/plupload/new_oss_upload.js',
              ],
              serie: true
            }
          ])
        }
      }
    })
    .state('REQUEST.INQUIRYEDITFORSUPPLIER',{
      url: '/editForSupplier/:itemId',
      templateUrl: 'app/requestInquiry-management-mgmt/modal/editInquiryForSupplier.html?v=' + LG.appConfig.clientVersion,
      data: {pageTitle: '询价单详情',functionCode: 'WEB.REQUEST.INQUIRY.DETAIL'},
      controller: 'editInquiryCtrlForRouteSupplier',
      controllerAs: 'vm',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load(['app.request-inquiry-management']);
        }],
        loadPlugin: function($ocLazyLoad) {
          return $ocLazyLoad.load([
            {
              insertBefore: '#loadBefore',
              name: 'localytics.directives',
              files: ['js/plugins/chosen/chosen.jquery.js',
                'js/plugins/chosen/chosen.js',
              ]
            }, {
              files: ['js/plugins/sweetalert/sweetalert.min.js',
                'css/plugins/sweetalert/sweetalert.css']
            }, {
              name: 'oitozero.ngSweetAlert',
              files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
            },{
              name: 'datePicker',
              files: ['css/plugins/datapicker/angular-datapicker.css',
                'js/plugins/datapicker/angular-datepicker.js']
            }, {
              serie: true,
              files: ['js/plugins/moment/moment.min.js',
                'js/plugins/daterangepicker/daterangepicker.zh.js',
                'css/plugins/daterangepicker/daterangepicker-bs3.css']
            }, {
              name: 'daterangepicker',
              files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
            },{
              files: ['css/plugins/jsTree/style.min.css',
                'js/plugins/jsTree/jstree.min.js']
            }, {
              serie: true,
              files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
            },{
              name: 'ngJsTree', files: ['js/plugins/jsTree/ngJsTree.min.js']
            },{
              files: [
                'js/plugins/plupload/plupload.min.js',
                'js/plugins/plupload/new_oss_upload.js',
              ],
              serie: true
            }
          ])
        }
      }
    })
    .state('REQUEST.INQUIRYEDIT',{
      url: '/edit/:itemId',
      templateUrl: 'app/requestInquiry-management-mgmt/modal/editInquiry.html?v=' + LG.appConfig.clientVersion,
      data: {pageTitle: '询价单详情',functionCode: 'WEB.REQUEST.INQUIRY.DETAIL'},
      controller: 'editInquiryCtrlForRoute',
      controllerAs: 'vm',
      resolve: {
        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
          return $ocLazyLoad.load(['app.request-inquiry-management']);
        }],
        loadPlugin: function($ocLazyLoad) {
          return $ocLazyLoad.load([
            {
              insertBefore: '#loadBefore',
              name: 'localytics.directives',
              files: ['js/plugins/chosen/chosen.jquery.js',
                'js/plugins/chosen/chosen.js',
              ]
            }, {
              files: ['js/plugins/sweetalert/sweetalert.min.js',
                'css/plugins/sweetalert/sweetalert.css']
            }, {
              name: 'oitozero.ngSweetAlert',
              files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
            },{
              name: 'datePicker',
              files: ['css/plugins/datapicker/angular-datapicker.css',
                'js/plugins/datapicker/angular-datepicker.js']
            }, {
              serie: true,
              files: ['js/plugins/moment/moment.min.js',
                'js/plugins/daterangepicker/daterangepicker.zh.js',
                'css/plugins/daterangepicker/daterangepicker-bs3.css']
            }, {
              name: 'daterangepicker',
              files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
            },{
              files: ['css/plugins/jsTree/style.min.css',
                'js/plugins/jsTree/jstree.min.js']
            }, {
                  serie: true,
                  files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
              },{
              name: 'ngJsTree', files: ['js/plugins/jsTree/ngJsTree.min.js']
            },{
              files: [
                'js/plugins/plupload/plupload.min.js',
                'js/plugins/plupload/new_oss_upload.js',
              ],
              serie: true
            }
          ])
        }
      }
    })

            .state('REQUEST.PACKINGSLIP', {
                url: '/start-packing-slip/:requestInquiryId/:packingSlipId',
                templateUrl: 'app/requestInquiry-management-mgmt/modal/start-packing-slip.html?v=' + LG.appConfig.clientVersion,
                data: {pageTitle: '码单详情', functionCode: '-1'},
                controller: 'startPackingSlipCtrl',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.request-inquiry-management']);
                    }],
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js',
                                ]
                            }, {
                                files: ['js/plugins/sweetalert/sweetalert.min.js',
                                    'css/plugins/sweetalert/sweetalert.css']
                            }, {
                                name: 'oitozero.ngSweetAlert',
                                files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                            }, {
                                name: 'datePicker',
                                files: ['css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/moment/moment.min.js',
                                    'js/plugins/daterangepicker/daterangepicker.zh.js',
                                    'css/plugins/daterangepicker/daterangepicker-bs3.css']
                            }, {
                                name: 'daterangepicker',
                                files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                            }, {
                                files: ['css/plugins/jsTree/style.min.css',
                                    'js/plugins/jsTree/jstree.min.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                            }, {
                                name: 'ngJsTree', files: ['js/plugins/jsTree/ngJsTree.min.js']
                            }, {
                                files: [
                                    'js/plugins/plupload/plupload.min.js',
                                    'js/plugins/plupload/new_oss_upload.js',
                                ],
                                serie: true
                            }
                        ])
                    }
                }
            })

            .state('SAMPLE-MGMT.CREATESAMPLE', {
                url: '/createSample/:itemId',
                templateUrl: 'app/sample-mgmt/modal/create-sample-id.html?v=' + LG.appConfig.clientVersion,
                data: {pageTitle: '创建样卡', functionCode: 'WEB.REQUEST.INQUIRY.DETAIL'},
                controller: 'CreateSampleIdModalCtrlForRoute',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.sample-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['css/plugins/chosen/chosen.css',
                                    'js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js']
                            }, {
                                files: ['js/plugins/sweetalert/sweetalert.min.js',
                                    'css/plugins/sweetalert/sweetalert.css']
                            }, {
                                name: 'oitozero.ngSweetAlert',
                                files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                            }
                        ]);
                    }
                }
            })
            .state('BIND-CARD', {
                abstract: true,
                url: '/bind-card',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion

            })
            .state('BIND-CARD.DETAIL', {
                url: '/detail',
                templateUrl: 'app/bindCard/bindCard.html?v=' + LG.appConfig.clientVersion,
                data: {pageTitle: '修改银行卡', functionCode: '-1'},
                controller: 'bindCardCtrl',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.bind-card']);
                    }],
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js',
                                    'css/plugins/chosen/chosen.css'
                                ]
                            }
                        ])
                    }
                }
            })

            .state('SUPPLIER', {
                abstract: true,
                url: '/supplier',
                templateUrl: 'views/common/content.html?v=' + LG.appConfig.clientVersion
            })

            .state('SUPPLIER.ASSIGN', {
                url: '/list',
                templateUrl: 'app/supplier-allocation/supplier-query.html?v='
                + LG.appConfig.clientVersion,
                data: {pageTitle: '供应商分配管理', functionCode: 'WEB.SUPPLIER.ASSIGN'},
                controller: 'SupplierMGMTCtrl',
                controllerAs: 'vm',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load(['app.supplier-mgmt']);
                    }], loadPlugin: function ($ocLazyLoad) {

                        return $ocLazyLoad.load([
                            {
                                insertBefore: '#loadBefore',
                                name: 'localytics.directives',
                                files: ['js/plugins/chosen/chosen.jquery.js',
                                    'js/plugins/chosen/chosen.js']
                            }, {
                                name: 'datePicker',
                                files: ['css/plugins/datapicker/angular-datapicker.css',
                                    'js/plugins/datapicker/angular-datepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/moment/moment.min.js',
                                    'js/plugins/daterangepicker/daterangepicker.zh.js',
                                    'css/plugins/daterangepicker/daterangepicker-bs3.css']
                            }, {
                                name: 'daterangepicker',
                                files: ['js/plugins/daterangepicker/angular-daterangepicker.js']
                            }, {
                                serie: true,
                                files: ['js/plugins/colResizable/js/colResizable-1.5.min.js']
                            }, {
                                files: [
                                    'js/plugins/plupload/plupload.min.js',
                                    'js/plugins/plupload/new_oss_upload.js',
                                ],
                                serie: true
                            }]);
                    }
                }
            })
    }

    angular
        .module('app')
        .config(config)
        .run(function ($rootScope, $state, $location, $cookies, $templateCache,
                       toaster) {
            $rootScope.$state = $state;
            $rootScope.user = LG.me;
            $rootScope.appName = LG.appConfig.appName;
            $rootScope.authButtonList = LG.authButtonList;
            $rootScope.clientVersion = LG.appConfig.clientVersion;
            $rootScope.navigationUrl = 'navigation.xhtml?v='
                + LG.appConfig.clientVersion;
            $rootScope.topnavbarUrl = 'views/common/topnavbar.html?v='
                + LG.appConfig.clientVersion;
            $rootScope.footerUrl = 'views/common/footer.html?v='
                + LG.appConfig.clientVersion;
            $rootScope.rightSideBarUrl = 'views/common/right_sidebar.html?v='
                + LG.appConfig.clientVersion;
            $rootScope.staticUrl = LG.appConfig.staticUrl;
            $rootScope.showLoding = true;
            $rootScope.permission = LG.permission;

            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    $rootScope.showLoding = true;
                    var userToken = $cookies.get('token');
                    // 如果用户不存在
                    if (!$rootScope.user || !userToken) {
                        event.preventDefault();// 取消默认跳转行为
                        window.location.href = LG.appConfig.loginUrl;
                    } else {
                        $rootScope.user.usertoken = userToken;
                        var functionCode = toState.data.functionCode;
                        if (isNullOrEmpty(functionCode)) {

                            event.preventDefault();// 取消默认跳转行为
                            toaster.pop({
                                type: 'error',
                                title: '参数错误',
                                body: '没有找到定义的菜单编号,请删除缓存重试!' + functionCode,
                                showCloseButton: true,
                                timeout: 3000
                            });
                            if (fromState.name) {
                                $state.go(fromState.name);
                            } else {
                                window.location = "/";
                            }
                            return;
                        }

                        //-1为工作台
                        if (functionCode != '-1') {

                            //查询是否有此菜单权限的的列表
                            if (!$rootScope.authButtonList.hasOwnProperty(functionCode)) {

                                event.preventDefault();

                                toaster.pop({
                                    type: 'error',
                                    title: '无权限',
                                    body: '无菜单【' + toState.data.pageTitle + '】访问权限',
                                    showCloseButton: true,
                                    timeout: 3000
                                });
                                if (fromState.name) {

                                    $state.go(fromState.name);
                                } else {
                                    window.location = "/";
                                }

                            }

                        }
                    }

                });

            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (toState.data && toState.data.pageTitle) {
                        $rootScope.pageTitle = toState.data.pageTitle;
                    }
                    $rootScope.showLoding = false;
                });
        });

})();
