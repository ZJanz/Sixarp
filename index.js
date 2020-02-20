//index.js

var express = require('express');
app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var publicEnties ={
	rectangles : [],
	players : []
}

var playerIDs = [];

for(var i = 0; i <= 9; i++){
		publicEnties.rectangles.push({
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
  	io.to(`${socket.id}`).emit('playerArrayPOS', publicEnties.players.length);
  	playerIDs.push(socket.id);
  	publicEnties.players.push({
  		x : 0,
  		y : 0,
  		right : false,
  		left : false,
  		up : false,
  		down : false

  	});
  	socket.on('movement', function(state){
  		publicEnties.players[playerIDs.indexOf(socket.id)].right = state.rightPressed;
  		publicEnties.players[playerIDs.indexOf(socket.id)].left = state.leftPressed;
  		publicEnties.players[playerIDs.indexOf(socket.id)].up = state.upPressed;
  		publicEnties.players[playerIDs.indexOf(socket.id)].down = state.downPressed;

  	} )
  	io.emit('rectangleInfo', publicEnties.rectanglesS);
  	socket.on('disconnect', function(){
    	console.log(socket.id + ' disconnected');
	})

});

function move(){
	for(i = 0; i < publicEnties.players.length; i++){
		if (publicEnties.players[i].right === true){
	  			publicEnties.players[i].x += 2;
	  		}

	  		if (publicEnties.players[i].left === true){
	  			publicEnties.players[i].x -= 2;

	  		}

	  		if (publicEnties.players[i].up === true){
	  			publicEnties.players[i].y -= 2;

	  		}

	  		if (publicEnties.players[i].down === true){
	  			publicEnties.players[i].y += 2;

	  		}
	  	}
}

function ping(){
	move();
	io.emit('playerInfo', publicEnties);
}

var interval = setInterval(ping, 10);


http.listen(3000, function(){
  console.log('listening on *:3000');
});
