(function () {
	'use strict';
	
	 angular
	    .module('unfitServices', [])
	
	 .controller('AuthController', ['$scope', '$state', 'authService', 'usSpinnerService','baService',
	      function ($scope, $state, authService, usSpinnerService,baService) {

	        $scope.user = {};
	        $scope.alert = {};
	        $scope.register = register;
	        $scope.login = login;

			baService.sendScreenshot('Login');
			
	        ////////

	        function setAlert(type, msg) {
	          $scope.alert = { type: type, msg: msg };
	        };

	        function handleError(error) {
	          usSpinnerService.stop('page-spinner');
	          if (error.status < 0) {
	            setAlert('danger', 'TokenService is not available');
	          } else {
	            setAlert('danger', error.data.errorMessage)
	          };
	        };

	        function register() {
	          if ($scope.user.password != $scope.password2) {
	            setAlert('danger', 'Passwords do not match');
	            return;
	          };

	          usSpinnerService.spin('page-spinner');
	          authService.register($scope.user).then(function () {
	            $state.go('dashboard');
	            usSpinnerService.stop('page-spinner');
	          }, handleError);
	        };

	        function login() {
	          usSpinnerService.spin('page-spinner');
			  baService.startTR('unfit','Login');
	          authService.login($scope.user).then(function () {
	            if ($state.params.redirect) {
	              $state.go($state.params.redirect, $state.params.redirectParams);
	              usSpinnerService.stop('page-spinner');
	            } else {
	              $state.go('dashboard');
	              usSpinnerService.stop('page-spinner');
	            }
				baService.saveUser($scope.user.email)	
				baService.stopTR('unfit','Login');
	          }, handleError);
	        };

	      }])

	
	
})();