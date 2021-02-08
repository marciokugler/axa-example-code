(function () {
	'use strict';
		
	angular.module('unfitControllers')
	
	.controller('ActivitiesController', ['$scope', '$state', 'authService', 'activityService',
      '$uibModal', 'usSpinnerService','baService',
      function ($scope, $state, authService, activityService, $uibModal, usSpinnerService,baService) {

        $scope.alert = {};
        $scope.clearAlert = clearAlert;

        $scope.activities = [];
        $scope.page = 1;
        $scope.perPage = 10;
        $scope.total = 0;
        $scope.pageChange = pageChange;

        $scope.activity = newActivity();
        $scope.setName = setName;
        $scope.add = add;

        $scope.openSync = openSync;
        $scope.$watch(function () { return $state.current.syncMessage; }, doneSync);

        load();

		baService.sendScreenshot('Activities');
        ////////

        function clearAlert() {
          $scope.alert = {};
        };

        function setAlert(type, msg) {
          $scope.alert = { type: type, msg: msg };
        };

        function pageChange() {
          clearAlert();
          if (($scope.page * $scope.perPage) > $scope.activities.length) {
            loadActivities($scope.activities.length, ($scope.page * $scope.perPage) - $scope.activities.length);
          };
        };

        function loadActivities(offset, limit) {
		  baService.startTR('unfit','Load Activities');
          activityService.getAll(offset, limit).then(function (result) {
            $scope.activities.push.apply($scope.activities, result.activities);
            $scope.total = result.total;
            usSpinnerService.stop('activitylist-spinner');
			baService.stopTR('unfit','Load Activities');
          }, handleError);
        };

        function handleError(error) {
          if (error.status < 0) {
            setAlert('danger', 'ActivityService is not available');
          } else {
            setAlert('danger', error.data.errorMessage);
          }
          usSpinnerService.stop();
        };

        function newActivity() {
          return {
            userId: authService.currentUserId(),
            startTs: new Date().setMinutes(0, 0, 0),
            duration: 60,
            intensity: 'MODERATE'
          };
        };

        function setName(name) {
          $scope.activity.name = name;
        };

        function add() {
          usSpinnerService.spin('activityform-spinner');
		  baService.startTR('unfit','Add Activity');
          activityService.add($scope.activity).then(function (result) {
			  
    		baService.setCustomStrEvent('custom_field2',$scope.activity.type);
			baService.setCustomNumEvent('custom_double_field2',parseFloat($scope.activity.duration));

            $scope.activities.push(result);
            $scope.total += 1;
            setAlert('info', 'Activity \'' + result.name + '\' for ' + result.duration + ' minutes created');
            // reset form
            $scope.activity = newActivity();
            $scope.activityForm.$setPristine();
            usSpinnerService.stop('activityform-spinner');
			baService.stopTR('unfit','Add Activity');
          }, handleError);
        };

        function openSync() {
          var syncModal = $uibModal.open({
            templateUrl: 'views/sync.html',
            controller: 'SyncController',
            backdrop: 'static',
            keyboard: false
          });
          syncModal.result.then(function (syncMessage) {
            load(syncMessage);
          });
        };

        function doneSync(syncMessage) {
          if (syncMessage) {
            load(syncMessage);
            $state.current.syncMessage = '';
          };
        };

        function load(syncMessage) {
          $scope.activities = [];
          $scope.page = 1;
          loadActivities(0, $scope.perPage);
          if (syncMessage) {
            setAlert('info', syncMessage);
          } else {
            clearAlert();
          };
        };

      }])
	
	
})();