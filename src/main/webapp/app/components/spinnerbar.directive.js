/**
 *
 */
(function() {

    'use strict';


    function spinnerbar($rootScope,$timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    alert('$stateChangeStart');
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    alert('$stateChangeSuccess');
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };

    }

    angular
        .module('app')
        .directive('spinnerbar', spinnerbar);

})();

