//index.js

var express = require('express');
app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var nonconEnties = {
	rectangles : [],
	borderRadius : 50,
	gridSpot : []
}

var publicEnties ={
	players : []
}

var order = 0;

for(var x = 0; x < nonconEnties.borderRadius * 2; x++){
	nonconEnties.gridSpot.push(
		[]	
	)
	for(var y = 0; y < nonconEnties.borderRadius * 2; y++){
		var red = Math.floor(Math.random() * 255);
        var green = Math.floor(Math.random() * 255);
        var blue = Math.floor(Math.random() * 255);


		nonconEnties.gridSpot[x].push({
			r : red,
			g : green,
			b : blue,
			spot : order
		})

		order++
	}

}

// for(var i = 0; i < borderRadius * 2; i++){
// 	publicEnties.gridSpot.push({
// 		[]
// 	})
// }

var playerIDs = [];

for(var i = 0; i <= 1000; i++){
		nonconEnties.rectangles.push({
			recx : Math.floor(Math.random() * (nonconEnties.borderRadius * 2)) - nonconEnties.borderRadius,
			recy : Math.floor(Math.random() * (nonconEnties.borderRadius * 2)) - nonconEnties.borderRadius
		})
	}

app.use(express.static('public')); //used to get files from public

app.get('/', function(req, res){
  res.render("index.ejs");
});

io.on('connection', function(socket){
  	console.log(socket.id + " connected");
  	io.emit('noncon', nonconEnties);
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
  	io.emit('rectangleInfo', nonconEnties.rectanglesS);
  	socket.on('disconnect', function(){
    	console.log(socket.id + ' disconnected');
	})

});

function move(){
	for(i = 0; i < publicEnties.players.length; i++){
		if (publicEnties.players[i].right === true && publicEnties.players[i].x < nonconEnties.borderRadius * 40){
	  			publicEnties.players[i].x += 2;
	  		}

	  		if (publicEnties.players[i].left === true && publicEnties.players[i].x > (Math.abs(nonconEnties.borderRadius) * -1) * 40){
	  			publicEnties.players[i].x -= 2;

	  		}

	  		if (publicEnties.players[i].up === true && publicEnties.players[i].y > (Math.abs(nonconEnties.borderRadius) * -1) * 40){
	  			publicEnties.players[i].y -= 2;

	  		}

	  		if (publicEnties.players[i].down === true && publicEnties.players[i].y < nonconEnties.borderRadius * 40){
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
