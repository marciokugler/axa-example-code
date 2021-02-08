(function () {
	'use strict';
		
	angular.module('unfitControllers')
	
	.controller('DashboardController', ['$scope', 'activityService', 'usSpinnerService','baService',
	      function ($scope, activityService, usSpinnerService,baService) {

	        $scope.activities = [];
	        $scope.showNoActivitiesMsg = false;
	        $scope.alert = {};
			
			

	        // duration summary by day chart
	        $scope.duration = { labels: [], data: [[]], series: ['Duration'], colors: ['#fd7360'] };
	        $scope.duration.options = {
	          tooltips: {
	            callbacks: {
	              title: function (tooltipItems, data) { return moment(data.labels[tooltipItems[0].index]).format('ddd MMM Do'); },
	              label: function (tooltipItem, data) { return tooltipItem.yLabel + ' minutes'; }
	            }
	          },
	          scales: {
	            xAxes: [{ ticks: { callback: function (value) { return moment(value).format('ddd Do'); } } }],
	            yAxes: [{ ticks: { min: 0, stepSize: 1 } }]
	          }
	        };

	        // calories summary by day chart
	        $scope.cals = { labels: [], data: [[]], series: ['Calories'], colors: ['#97BBCD'] };
	        $scope.cals.options = {
	          tooltips: {
	            callbacks: {
	              title: function (tooltipItems, data) { return moment(data.labels[tooltipItems[0].index]).format('ddd MMM Do'); },
	              label: function (tooltipItem, data) { return tooltipItem.yLabel + ' calories'; }
	            }
	          },
	          scales: {
	            xAxes: [{ ticks: { callback: function (value) { return moment(value).format('ddd Do'); } } }],
	            yAxes: [{ ticks: { min: 0, stepSize: 1 } }]
	          }
	        };

	        $scope.type = { labels: [], data: [], options: { legend: { display: true, position: 'bottom' } } };

	        load();

			baService.sendScreenshot('Dashboard');
			
	        ////////

	        function setAlert(type, msg) {
	          $scope.alert = { type: type, msg: msg };
	        };

	        function handleError(error) {
	        	
	          if (error.status < 0) {
	        	  
	        	  	setAlert('danger', 'ActivityService is not available');
	          } else {
	            setAlert('danger', error.data.errorMessage);
	          }
	          usSpinnerService.stop();
	        }

	        function load() {
	          activityService.getSummaryByDay(7).then(function (result) {
	            for (var i = 0; i < result.length; i++) {
	              $scope.duration.labels.push(result[i].date);
	              $scope.duration.data[0].push(result[i].duration);
	              $scope.cals.labels.push(result[i].date);
	              $scope.cals.data[0].push(result[i].calories);
	            }
	            // reset y-axis to auto when data
	            if (Math.max.apply(Math, result.map(function (o) { return o.duration; })) > 0) {
	              $scope.duration.options.scales.yAxes = {};
	              $scope.cals.options.scales.yAxes = {};
	            }
	            usSpinnerService.stop('duration-spinner');
	            usSpinnerService.stop('cals-spinner');
	          }, handleError);

	          activityService.getSummaryByType(7).then(function (result) {
	            for (var i = 0; i < result.length; i++) {
	              $scope.type.labels.push(result[i].type);
	              $scope.type.data.push(result[i].count);
	            }
	            usSpinnerService.stop('type-spinner');
	          }, handleError);

	          activityService.getAll(0, 5).then(function (result) {
	            if (result.total == 0) {
	              $scope.showNoActivitiesMsg = true;
	            }
	            else {
	              $scope.activities = result.activities.slice();
	            }
	            usSpinnerService.stop('list-spinner');
	          }, handleError);
	        };

	      }])

	
	
})();