//index.js

var express = require('express');
app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


var rectanglesS = [];
var playerIDs = [];
var playersS = [];

for(var i = 0; i <= 9; i++){
		rectanglesS.push({
			recx : Math.floor(Math.random() * 16),
			recy : Math.floor(Math.random() * 12)
		})
	}

app.use(express.static('public')); //used to get files from public

app.get('/', function(req, res){
  res.render("index.ejs");
});

io.on('connection', function(socket){
  	console.log(socket.id + " connected");
  	io.to(`${socket.id}`).emit('playerArrayPOS', playersS.length);
  	playerIDs.push(socket.id);
  	playersS.push({
  		x : 320,
  		y : 240,
  		movedx : 0,
  		movedy : 0,
  		right : false,
  		left : false,
  		up : false,
  		down : false

  	});
  	socket.on('movement', function(state){
  		playersS[playerIDs.indexOf(socket.id)].right = state.rightPressed;
  		playersS[playerIDs.indexOf(socket.id)].left = state.leftPressed;
  		playersS[playerIDs.indexOf(socket.id)].up = state.upPressed;
  		playersS[playerIDs.indexOf(socket.id)].down = state.downPressed;

  	} )
  	io.emit('rectangleInfo', rectanglesS);
  	socket.on('disconnect', function(){
    	console.log(socket.id + ' disconnected');
	})

});

function ping() {
	move()
	io.emit('playerInfo', playersS)
}

function move(){
	for(i = 0; i < playersS.length; i++){
		if (playersS[i].right === true){
	  			playersS[i].x += 2;
	  			playersS[i].movedx += 2;
	  		}

	  		if (playersS[i].left === true){
	  			playersS[i].x -= 2;
	  			playersS[i].movedx -= 2;

	  		}

	  		if (playersS[i].up === true){
	  			playersS[i].y -= 2;
	  			playersS[i].movedy -= 2;

	  		}

	  		if (playersS[i].down === true){
	  			playersS[i].y += 2;
	  			playersS[i].movedy += 2;

	  		}
	  	}
}

var interval = setInterval(ping, 10);


http.listen(3000, function(){
  console.log('listening on *:3000');
});
