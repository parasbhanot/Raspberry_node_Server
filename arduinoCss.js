/**
 * Created by parasbhanot on 11/26/2015.
 */

var sp = require("serialport");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var portName = 'COM8';

app.use(require("express").static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
    console.log('listening on http://localhost:3000');
});

var serialPort = new sp.SerialPort(portName, {
    baudrate: 9600,
    parser: sp.parsers.readline('\r\n')
    //parser: serialport.parsers.raw
});


serialPort.on('open',function() {
    console.log('Port open');
});

serialPort.on('data', function(data) {
    console.log(data);
    io.sockets.emit('received', {message: data });
});

serialPort.on('error', function(data) {
    console.log("arduino not connected");
});

serialPort.on('close', function(data) {
    console.log("arduino disconnected");
});

io.sockets.on('connection', function (socket) {

    console.log('a user connected'+" "+socket.id );

    socket.on('chat', function  (data) {

        console.log(data.message);
        serialPort.write(data.message);
    });

});
