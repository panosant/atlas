(function () {

    var app = angular
        .module("AtlasUi", ["ui.bootstrap", "ui.router", "ngSanitize", "ngTable", "ngCookies",
                                "ngCookies", "ngMaterial", "ui.sortable", "ngMessages", "md.time.picker"])
        .config(config)
        .run(run);

    /**
     *  Main Application Configuration (UI-Router)
     */
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {

        // Devices Review (homepage)
        $stateProvider.state("devices_review", {
            url: "/",
            templateUrl: "app/components/devices/views/devicesReview.html",
        });
        // Add Device (after login)
        $stateProvider.state("devices_add", {
            url: "/",
            templateUrl: "app/components/devices/views/devicesAdd.html",
        });

        // Actions (after login)
        $stateProvider.state("actions_review", {
            url: "/",
            templateUrl: "app/components/actions/views/actionsReview.html",
        });
        $stateProvider.state("actions_add", {
            url: "/add",
            templateUrl: "app/components/actions/views/actionsAdd.html",
        });

        // Alerts (after login)
        $stateProvider.state("alerts_review", {
            url: "/",
            templateUrl: "app/components/alerts/views/alertsReview.html",
        });
        $stateProvider.state("alerts_add", {
            url: "/add",
            templateUrl: "app/components/alerts/views/alertsAdd.html",
        });

        // User Login form
        $stateProvider.state("login", {
            url: "/login",
            templateUrl: "app/components/login/views/login.html",
        });
        // User Registration form
        $stateProvider.state("register", {
            url: "/register",
            templateUrl: "app/components/register/views/register.html",
        });
        // Devices Review after logout
        $stateProvider.state("logout", {
            url: "/",
            templateUrl: "app/components/devices/views/devicesReview.html",
            controller: "LogoutCtrl" ,
        });

        // Homepage
        $urlRouterProvider.otherwise("/");
    };

    /**
     *  Main Application Execution upon page (re)load:
     *  a) Initialization
     *  b) Root scope setup
     */
    run.$inject = ['$rootScope','$location', '$cookies', '$http', "$modal", "$q"];
    function run($rootScope, $location, $cookies, $http, $modal, $q) {

        $rootScope.safeApply = function () {
            if (!$rootScope.$$phase)
                $rootScope.$apply();
        };

        // Add Configuration on $rootScope
        $rootScope.backend_api = window.location.origin + '/api'

        /**
         * Keep user logged in after page refresh!
         *
         *  Tip:
         *  Uses stored 'globals.currentUser' information from his cookie
         */
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.currentUser.token;
        }

        /**
         *  Redirect to homepage if the user is not logged in and is trying to access a restricted page!
         *
         *  Tip:
         *  Uses stored 'globals.currentUser' information from his cookie
         */
        $rootScope.$on('$locationChangeStart', function () {
            var restrictedPage = $.inArray($location.path(), ['/', 'publisher', '/login', '/register']) === -1;

            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/');
            }
        });

        /**
         * INFO Message Prompt
         *
         * @param message
         * @param size
         */
        $rootScope.modalInfo = function (message, size) {
            var sz = "sm";
            if (!!size)
                sz = size
            var modalInstance = $modal.open(angular.extend({
                templateUrl: 'common/views/infoModal.html',
                controller: 'MessageInstanceCtrl',
                size: sz,
                resolve: {
                    message: function () {
                        return message;
                    }
                }
            }, Settings.ModalSettings));
            return modalInstance.result;
        };

        /**
         * WARN Confirmation Prompt
         *
         * @param message
         * @param size
         */
        $rootScope.modalWarning = function (message, choice) {
            var deferred = $q.defer();
            var modalInstance = $modal.open(angular.extend({
                templateUrl: 'app/common/views/warningModal.html',
                controller: 'ConfirmInstanceCtrl',
                resolve: {
                    message: function () {
                        return message;
                    },
                    choice: function () {
                        return choice;
                    }
                }
            }));
            modalInstance.result.then(function (res) {
                if (res === 'yes') {
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            });
            return deferred.promise;
        };

        /**
         * ALERT Confirmation Prompt
         *
         * @param message
         * @param size
         */
        $rootScope.modalAlert = function (message, choice) {
            var deferred = $q.defer();
            var modalInstance = $modal.open(angular.extend({
                templateUrl: 'app/common/views/alertModal.html',
                controller: 'ConfirmInstanceCtrl',
                resolve: {
                    message: function () {
                        return message;
                    },
                    choice: function () {
                        return choice;
                    }
                }
            }));
            modalInstance.result.then(function (res) {
                if (res === 'yes') {
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            });
            return deferred.promise;
        };

        /**
         * ERROR Message Prompt
         *
         * @param message
         * @param size
         */
        $rootScope.modalError = function (message, size) {
            var sz = "sm";
            if (!!size)
                sz = size
            var modalInstance = $modal.open(angular.extend({
                templateUrl: 'app/common/views/errorModal.html',
                controller: 'MessageInstanceCtrl',
                size: sz,
                resolve: {
                    message: function () {
                        return message;
                    }
                }
            }));
            return modalInstance.result;
        };

    }

    /**
     * Main Application controllers (RootController interpreting HeaderCtrl and FooterCtrl too)
     */
    app.controller("RootController", ["$rootScope", "$scope", "$cookies", "$http", "$mdToast", '$controller', "$state",
        function ($rootScope, $scope, $cookies, $http, $mdToast, $controller, $state) {

            // Header Controller
            $controller('HeaderCtrl', {
                $scope: $scope
            });
            $scope.initHeader();

            // Footer Controller
            $controller('FooterCtrl', {
                $scope: $scope
            });
            $scope.initFooter();

            // State transition marker
            $scope.$on('$stateChangeSuccess', function (ev, to, toParams, from) {
                $scope.previousState = from.name;
                $scope.currentState = to.name;
            });

            // Reload state
            $scope.reloadState = function() {
                $state.go($state.current, {}, {reload: true});
            }

            $scope.scrollTop = function () {
                window.scrollTo(0, 0);
            };
        }]
    );
}());

/**
 * Main Application
 */
$(document).ready(function () {
    htmlbodyHeightUpdate();
    $(window).resize(function () {
        htmlbodyHeightUpdate();
    });
    $(window).scroll(function () {
        height2 = $('.main').height();
        htmlbodyHeightUpdate();
    });
});

function htmlbodyHeightUpdate() {
    var height3 = $(window).height();
    var height1 = $('.nav').height() + 50;
    height2 = $('.main').height();
    if (height2 > height3) {
        $('html').height(Math.max(height1, height3, height2) + 10);
        $('body').height(Math.max(height1, height3, height2) + 10);
    } else {
        $('html').height(Math.max(height1, height3, height2));
        $('body').height(Math.max(height1, height3, height2));
    }
}
