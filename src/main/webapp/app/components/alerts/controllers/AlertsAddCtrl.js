(function () {
	"use strict";
	angular
		.module("AtlasUi")
		.controller("AlertsAddCtrl", ["$rootScope", "$scope", "$http", "$state", AlertsAddCtrl]);

	function AlertsAddCtrl($rootScope, $scope, $http, $state) {
        var ctrl = this;
        ctrl.addAlertUrl = $rootScope.backend_api + "/alerts";

        ctrl.init = function() {
            $scope.alert = {};
            $scope.initialModel = angular.copy($scope.alert);
        }

        ctrl.reset = function() {
            var message = "This will reset the form. Proceed anyway?";
            $scope.modalWarning(message, "RESET")
                .then(function (response) {
                    if (response === true) {
                        $scope.alert = angular.copy($scope.initialModel);
                        // location.reload();
                        $scope.scrollTop();
                    }
                });
        }

        ctrl.cancel = function() {
            var message = "Your work will be lost. Proceed anyway?";
            $scope.modalWarning(message, "PROCEED")
                .then(function (response) {
                    if (response === true) {
                        $state.go("devices_review");
                        $scope.scrollTop();
                    }
                });
        }

        ctrl.getFormCtrl = function() {
            var retval = $scope.$$childHead
            if (retval) {
                retval = retval.formCtrl;
            }
            return retval;
        }

        ctrl.isValid = function() {
            var formCtrl = ctrl.getFormCtrl();
            if (formCtrl && formCtrl.$valid) {
                return true;
            }

            return false;
        }

        ctrl.add = function() {
            var message = "This will publish '"+$scope.alert.title +"'. Proceed?";
            var config = {
                headers : {
                    'Content-Type': 'application/json;charset=utf-8;'
                },
            }
            $scope.modalWarning(message, "ADD")
                .then(function (response) {
                    if (response === true) {
                        $http.post(ctrl.addAlertUrl, $scope.alert, config)
                            .then(function successCallback(response) {
                                $scope.refreshDevices();
                                $state.go("alerts_review");
                                // Reload footer's img to switch from alert to check-mark!
                                $scope.createToast(response.data.result + "! " + response.data.description)
                                if ($rootScope.devices === 0) {
                                  location.reload();
                                } else {
                                  $scope.scrollTop();
                                }
                            }, function errorCallback(response) {
                                $scope.createToast(response.data.result + "! " + response.data.description)
                                // var message = response.data.result + "<br/>" + response.data.description;
                                // $scope.modalError(message, "100");
                            });
                    }
                });
        }
    }
}());
