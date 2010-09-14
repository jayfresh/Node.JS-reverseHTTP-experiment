var socket;
$(document).ready(function() {
	socket = new io.Socket("localhost");
	socket.options.port = 3001;
	socket.connect();
	socket.on('connect', function(){
		log('connected');
	});
	socket.on('message', function(data){
		addToIncoming(data);
		var resText = $('#response textarea').val();
		eval('window.data = data; var res = '+resText);
		socket.send(res);
	});
	socket.on('disconnect', function(){
		log('disconnected');		
	});
});

function log(newLog) {
	var text = $('#log').val();
	$('#log').val(new Date() + ': ' + newLog + '\n' + text);
}

function addToIncoming(data) {
	var text = $('#incoming textarea').val();
	$('#incoming textarea').val(data + '\n' + text);
	log(data);
}