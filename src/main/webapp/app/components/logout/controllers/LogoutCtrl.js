(function () {
    'use strict';

    angular
        .module('AtlasUi')
        .controller('LogoutCtrl', LogoutCtrl);

    LogoutCtrl.$inject = ['$location', '$scope', 'AuthenticationService'];
    function LogoutCtrl($location, $scope, AuthenticationService) {
        var ctrl = this;
        ctrl.logout = logout;

        (function initController() {
            // reset credentials
            ctrl.logout();
        })();

        function logout() {
            AuthenticationService.Logout();
            $scope.refreshDevices();
            $scope.loggedOut();
        };
    }

})();