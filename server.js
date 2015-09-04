// server-side javascript

// express + static files served
var express = require('express'),
	app = express();
app.use(express.static(__dirname + '/public'));


// api routes go here

// catchall route for angular front end
app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/views/index.html');
})


// set up server (will be shared by express, sockets)
var http = require('http'),
	httpServer = http.Server(app);

httpServer.listen(3000, function(){
	console.log('express api and socket.io listening on port 3000');
});

// set up socket.io
var io = require('socket.io').listen(httpServer);
// console.log('io', io);
io.on('connection', function(socket){
	console.log('new connection');
	console.log(socket);
	// socket.emit sends a message across one connection 
	// (to one client user)
	socket.emit('greeting-event', {msg: 'hello new user!'});
	// io.emit sends the message to everyone
	io.emit('communication-event', {msg: 'a user joined'});
	socket.on('message-event', function(data){
		console.log('received data: ', data);
		// socket.broadcast.emit sends a message to everyone but
		// the client
  		socket.broadcast.emit('communication-event', {msg: data})
		console.log('sent communication-event')
	});  
	socket.on('disconnect', function(){
    	console.log('user disconnected');
  });
});
