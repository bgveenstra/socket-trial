console.log('app.js');

// io object from socket.io.js
// console.log('io ', io);
var app = angular.module('socketApp', ['ngRoute']);

app.factory('socketService', ['$rootScope', '$log', function($rootScope, $log){
	var socket = io.connect();
	$log.log('socket - client connection created');

	return {
		on: function(eventName, callback) {
			socket.on(eventName, callback);
			return function(){
				$log.log('socket - received event with name ', eventName);
			}
		},
		emit: function(eventName, data, callback){
			socket.emit(eventName, data, function(){
				$log.log('inside emit');
			})
			$log.log('socket - sending event with name ', eventName, '\ndata ', data);
		}
	}
}]);

app.controller('MainCtrl', ['$scope', '$log', 'socketService', function($scope, $log, socketService){
	$scope.test = "greetings!";
	$scope.messageLog = ["first!"];
	$scope.newMessage = "";
	$scope.sendThroughSocket = function(msg){
		socketService.emit('message-event', msg);
	}
	$log.log("socketService", socketService)
	socketService.on('greeting-event', function(data){
		$log.log('received greeting with data ', data);
	});
	socketService.on('communication-event', function(data){
		$log.log('received communication with data ', data);
		$scope.messageLog.push(">> "+data.msg);
		$log.log($scope.messageLog);
	});
}]);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: '/',
			controller: 'MainCtrl'
		});
}]);




