(function () {
	'use strict';
		
	angular.module('unfitControllers')
	
	  .controller('AddMealController', ['$scope',  '$uibModalInstance', 'foods', 'meals', 'userId', 'foodService','baService',
      function ($scope, $uibModalInstance, foods, meals, userId, foodService,baService) {

		  var mealTimes = ['breakfast', 'lunch', 'dinner', 'snack'];
		  
		  $scope.data = {
				  meal : null
		  };
		 
		  var getRandomInt = function getRandomInt(min, max) {
  		    return Math.floor(Math.random() * (max - min + 1)) + min;
  		  }
		  
		  $scope.analyzeMeal = function analyzeMeal() { 
    	  
	    	  console.log("analyzing.");
	    	  
	    	 
	    	  $scope.data.meal = {
	    			  user : userId,
	    			  timeOfDay : mealTimes[getRandomInt(0,3)],
	    			  calories : 0,
	    			  items : [],
	    	  			description : ''
	    	  }
	    	  
	    	  var numberOfItems = getRandomInt(2, 7);
	    	  
	    	  for (var i = 0; i < numberOfItems; i++) {
	    		  
	    		  var quantity = getRandomInt(1,4); 
	    		  
	    		  var selectedFood = foods[getRandomInt(0, foods.length-1)];
	    		  
	    		  var itemToAdd = {
	    				  food : selectedFood._id,
	    		  		  count : quantity,
	    		  		  calories : quantity * selectedFood.calories
	    		  }
	    		  
	    		  $scope.data.meal.items.push(itemToAdd);
	    		 
	    		  $scope.data.meal.calories += itemToAdd.calories;
	    		  
	    		  if (i > 0) {
	    			  $scope.data.meal.description += ", " + quantity + ' ' + selectedFood.unit + ' ' + selectedFood.description;
	    		  }
	    		  else {
	    			  $scope.data.meal.description += quantity + ' ' + selectedFood.unit + ' ' + selectedFood.description;
	    		  }
	    		  
	    	  }
	    	  
	      }
		  
		  $scope.confirmMeal = function confirmMeal() {
			  meals.push($scope.data.meal);
			  baService.startTR('unfit','Add Meal');
			  
			  //tirar depois - inicio
			  baService.stopTR('unfit','Add Meal');
				   var foods = $scope.breakMeals($scope.data.meal.description);
				   for (var i = 0; i < foods.length; i++) {
						baService.setCustomStrEvent('custom_field1',foods[i]);
				   }
			  //tirar depois - fim
			  
			  //depois corrir isso
			  /*
			  foodService.saveMeal($scope.data.meal).then(function() {
				   console.log("saved.");
				   baService.stopTR('unfit','Add Meal');
				   var foods = $scope.breakMeals($scope.data.meal.description);
				   for (i = 0; i < foods.length; i++) {
						baService.setCustomStrEvent('meal',foods[i]);
				   }
				   //baService.setCustomStrEvent('addedMeal',$scope.data.meal.description);
			   }).catch(function(error){
				   console.log("error", error);
			   })
			   */
		  };
		  
	      $scope.ok = function () {
	    	    $uibModalInstance.close();
	    	  };

    	 $scope.cancel = function () {
    	    $uibModalInstance.dismiss('cancel');
    	  };  
		  
		  $scope.breakMeals = function(meals){
			  console.log('spliting meals....')
			  var mealV = meals.split(',');
			  var mealRet = [];
			  for (var i = 0; i < mealV.length; i++) {
				mealRet.push(mealV[i].substring(2));
			  }
			  return mealRet;
		  }

      }])
	
	
})();