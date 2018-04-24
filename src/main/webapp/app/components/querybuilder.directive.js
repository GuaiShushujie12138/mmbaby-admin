/**
 * icheck.directive
 */
(function() {

    'use strict';

    function queryBuilder($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue){
                        console.log('test');
                    })

                    return $(element).on('click', function(event) {
                        debugger;
                    });
                });
            }
        };
    }

    angular
        .module('app')
        .directive('queryBuilder', queryBuilder);

})();
