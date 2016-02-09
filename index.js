var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*********************************************************/
//Code that controls electricity, do not touch.

var gpio = require('rpi-gpio');
var pinY = 11;
var pinG = 40;
var pinR = 18;
var waitTime = 2000;

gpio.setup(pinY, gpio.DIR_OUT);
gpio.setup(pinG, gpio.DIR_OUT);
gpio.setup(pinR, gpio.DIR_OUT);


function light(pin) {
  gpio.write(pin, 1);
  setTimeout(function(){
    gpio.write(pin, 0);
  }, waitTime);
}


/*********************************************************/


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log('a user connected');
  light(pinG);

  socket.on('disconnect', function(){
    console.log('a user disconnected');
    light(pinR);
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
    light(pinY);
  });

    
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
