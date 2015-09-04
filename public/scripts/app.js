console.log('app.js');

// io object from socket.io.js
// console.log('io ', io);
var app = angular.module('socketApp', ['ngRoute']);

app.factory('socketService', ['$rootScope', '$log', function ($rootScope, $log) {
    var socket = io.connect();
	$log.log('socket - client connection created');
 
    return {
        on: function (eventName, callback) {
	        	$log.log('socket - received event with name ', eventName);
	        	// set up wrapper function to synch socket changes with angular
	            function wrapper() {
	            	// store the arguments object 
	            	// which just contains the function arguments
	                var args = arguments;
	                console.log('on args: ',args);
	                // use $apply to trigger angular 2way data binding update
	                $rootScope.$apply(function () {
	                    callback.apply(socket, args);
	                });
	            }
	 
	 			// calls uses socket.io's on method with 
	 			// our callback function and the $apply wrapper that helps synch up with angular 
	            socket.on(eventName, wrapper);
	 
	 			// @TODO - why?
	            // return function () {
	            // 	$log.log("superfun")
	            //     socket.removeListener(eventName, wrapper);
	            // };
	        },
 
        emit: function (eventName, data, callback) {
	        	$log.log('socket - sending event with name ', eventName, '\ndata ', data);
	            socket.emit(eventName, data, function () {
	                var args = arguments;
	                //console.log('emit args: ',args);
	                $rootScope.$apply(function () {
	                    if(callback) {
	                        callback.apply(socket, args);
	                    }
	                });
	            });
	        }
    };
}]);


app.controller('MainCtrl', ['$scope', '$log', 'socketService', function($scope, $log, socketService){
	$scope.test = 'greetings!';
	$scope.messageLog = [{message: 'first!', time: 0, sender: 'epoch'}];
	$scope.newMessage = '';
	$scope.sendThroughSocket = function(msg){
		socketService.emit('message-event', msg);
		$scope.messageLog.push({message: msg, time: Date.now(), sender: 'me'});
	}
	socketService.on('greeting-event', function(data){
		$log.log('received greeting with data ', data);
	});
	socketService.on('communication-event', function(data){
		$log.log('received communication with data ', data);
		$scope.messageLog.push({message: data.msg, time: Date.now(), sender: 'them'});
	});
}]);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: '/',
			controller: 'MainCtrl'
		});
}]);




