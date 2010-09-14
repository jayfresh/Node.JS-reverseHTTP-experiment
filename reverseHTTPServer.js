var http = require('http'),
    io = require('socket.io'), // for npm, otherwise use require('./path/to/socket.io')
	html_server = http.createServer(function(req, res) {
		// your normal server code
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end("Hi! Responding server hasn't connected yet, come back in a sec");
	}),
	socket_server = http.createServer(function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end("This is the socket server");
	});

html_server.listen(3000);
socket_server.listen(3001);

var socket = io.listen(socket_server);
socket.on('connection', function(client){ 
	// new client is here!
	socket.options.log('connection!');
	// set up the html_server to get response from the socket_server's client
	html_server.removeAllListeners('request');
	html_server.on('request', function(req, res) {
		// pipe request to socket client
		socket.options.log('request received by server');
		var socketCallback = function(data) {
			socket.options.log('received response from socket client: '+data);
			// then pipe socket client response back to response
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(data);
			socket.options.log('unbinding socketCallback');
			client.removeListener('message', socketCallback);
		};
		socket.options.log('attaching socketCallback');
		client.on('message', socketCallback);
		socket.options.log('piping to socket client');
		client.send(req.url);
	});
}); 
