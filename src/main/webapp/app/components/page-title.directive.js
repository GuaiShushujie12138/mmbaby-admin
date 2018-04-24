/**
 * page-title.directive
 */
(function() {

    'use strict';
    
    /**
     * pageTitle - Directive for set Page title - mata title
     */
    function pageTitle($rootScope, $timeout) {
        return {
            link: function(scope, element) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // Default title
                    var title = 'Admin | 首页';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) title = 'Admin | ' + toState.data.pageTitle;
                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        }
    }

    angular
        .module('app')
        .directive('pageTitle', pageTitle);

})();