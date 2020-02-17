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
  	playerIDs.push(socket.id);
  	playersS.push({
  		x : 320,
  		y : 240,
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

  		if (playersS[playerIDs.indexOf(socket.id)].right === true){
  			playersS[playerIDs.indexOf(socket.id)].x += 2;
  		}

  		if (playersS[playerIDs.indexOf(socket.id)].left === true){
  			playersS[playerIDs.indexOf(socket.id)].x -= 2;
  		}

  		if (playersS[playerIDs.indexOf(socket.id)].up === true){
  			playersS[playerIDs.indexOf(socket.id)].y -= 2;
  		}

  		if (playersS[playerIDs.indexOf(socket.id)].down === true){
  			playersS[playerIDs.indexOf(socket.id)].y += 2;
  		}
  		io.emit('playerInfo', playersS)


  	} )
  	io.emit('playerInfo', playersS)
  	io.emit('rectangleInfo', rectanglesS);
  	socket.on('disconnect', function(){
    	console.log(socket.id + ' disconnected');
	})

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});