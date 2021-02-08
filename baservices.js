(function () {
  'use strict';

  /* services */

  angular
    .module('unfitServices')

   .factory('baService', ['$http', 'config',
      function ($http, config) {

		var ba = {};
		ba.saveUser = function (userId) {
			try{
				console.log('baService:savingUserID:'+userId);
				CaMDOIntegration.setCustomerId(fixUser(userId),function callback(action, returned , error) {
					console.log('SDK Callback');if(returned.success) {console.log('OK');}else {	console.log(error);	}});		
			} catch (err) {
				console.log('[BASERVICE ERROR ]'+err);
			}
		};
		
		ba.getUser = function () {
			try{
				console.log('baService:getUser');
				return CaMDOIntegration.customerId(function callback(action, returned , error) {
					console.log('SDK Callback');if(returned.success) {console.log('OK');}else {	console.log(error);	}}); 
			} catch (err) {
				console.log('[BASERVICE ERROR ]'+err);
			}
		};
		
		ba.startTR = function (svcName,trName) {
			try{
				console.log('baService:startingTransaction ['+trName+']');
				CaMDOIntegration.startApplicationTransaction({"transactionName" : trName,"serviceName" : svcName},function callback(action, returned , error) {
					console.log('SDK Callback');if(returned.success) {console.log('OK');}else {	console.log(error);	}});
			} catch (err) {
				console.log('[BASERVICE ERROR ]'+err);
			}
		};
		
		ba.stopTR = function (svcName,trName) {
			try{
				console.log('baService:stopingTransaction ['+trName+']');
				CaMDOIntegration.stopApplicationTransaction({"transactionName" : trName,"serviceName" : svcName},function callback(action, returned , error) {
					console.log('SDK Callback');if(returned.success) {console.log('OK');}else {	console.log(error);	}});
			} catch (err) {
				console.log('[BASERVICE ERROR ]'+err);
			}
		};
		
		ba.stopTR = function (svcName,trName,errorMsg) {
			try{
				console.log('baService:stopingTransaction ['+trName+']');
				CaMDOIntegration.stopApplicationTransaction({"transactionName" : trName,"serviceName" : svcName,"failure" : errorMsg },function callback(action, returned , error) {
					console.log('SDK Callback');if(returned.success) {console.log('OK');}else {	console.log(error);	}});
			} catch (err) {
				console.log('[BASERVICE ERROR ]'+err);
			}
		};
		
		ba.setSesstionAtrib = function (sessionKey,sessionValue) {
			try{
				console.log('baService:setSessionAtrib:'+sessionKey+":"+sessionValue);
				CaMDOIntegration.setSessionAttribute({"type" : "string","key" : sessionKey,"value" : sessionValue},function callback(action, returned , error) {console.log('SDK Callback');if(returned.success) {console.log('OK');}else {	console.log(error);	}});
			} catch (err) {
				console.log('[BASERVICE ERROR ]'+err);
			}			
			

			
			
		};
		
		ba.setCustomStrEvent = function (evtKey,evtValue) {
			try{
				console.log('baService:setCustomStrEvent ['+evtKey+' '+evtKey+' '+evtValue+ ']');
				CaMDOIntegration.logTextMetrics({"key" : evtKey,"value": evtValue},function callback(action, returned , error) {
					console.log('SDK Callback');if(returned.success) {console.log('OK');}else {	console.log(error);	}}); 
			} catch (err) {
				console.log('[BASERVICE ERROR ]'+err);
			}
		};
		
		ba.setCustomNumEvent = function (evtKey,evtValue) {
			try{
				console.log('baService:setCustomNumEvent ['+evtKey+' '+evtKey+' '+evtValue+ ']');
				CaMDOIntegration.logNumericMetrics({"key" : evtKey,"value": evtValue},function callback(action, returned , error) {
					console.log('SDK Callback');if(returned.success) {console.log('OK');}else {	console.log(error);	}}); 
			} catch (err) {
				console.log('[BASERVICE ERROR ]'+err);
			}
		};
		
		ba.sendScreenshot = function (screenName) {
			try{
				console.log('baService:sendScreenshot ['+screenName+']');
				CaMDOIntegration.sendScreenShot(screenName,CaMDOIntegration.quality.medium,function callback(action, returned , error) {
					console.log('SDK Callback');if(returned.success) {console.log('OK');}else {	console.log(error);	}}); 
			} catch (err) {
				console.log('[BASERVICE ERROR ]'+err);
			}
		};
		
		ba.sendFeedback = function (feedBack) {
			try{
				console.log('baService:sendFeedback ['+feedBack+']');
				CaMDOIntegration.setCustomerFeedback(feedBack,function callback(action, returned , error) {
					console.log('SDK Callback');if(returned.success) {console.log('OK');}else {	console.log(error);	}}); 
			} catch (err) {
				console.log('[BASERVICE ERROR ]'+err);
			}
		};
		
		
		var fixUser = function (userLogin){
			return userLogin.replace("@", "-").replace(".","-");
		}
		
		/**
		* action : name of the //CaMDOIntegration API that is invoked
		* returnVal : json of format {"success": true , "value" : true }
		* error : description of failure of javascript api call
		*/
		/*
		function callback(action, returned , error) {
			console.log('SDK Callback');
			if(returned.success) {
				console.log('OK');
			}
			else {
				console.log(error);
			}
		}
		*/
		
		return ba;
      }])
})();