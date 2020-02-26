//index.js

var express = require('express');
app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var borderRadius = 50;
var trees = [];

var players = [];

// var order = 0;

// for(var x = 0; x < nonconEnties.borderRadius * 2; x++){
// 	nonconEnties.gridSpot.push(
// 		[]	
// 	)
// 	for(var y = 0; y < nonconEnties.borderRadius * 2; y++){
// 		var red = null;
//         var green = null;
//         var blue = null;
//         var trueX = x * 40;
//         var trueY = y * 40;


// 		nonconEnties.gridSpot[x].push({
// 			r : red,
// 			g : green,
// 			b : blue,
// 			spot : order
// 		})

// 		order++
// 	}

// }
function render(x, y){
  if(x <= players[arrayPOS].gridX + 8 && x >= players[arrayPOS].gridX - 8){
    if(y <= players[arrayPOS].gridY + 6 && y >= players[arrayPOS].gridY - 6){
      return true;
    }
  }
  else {return false}
}

function emitInfo(){
	for(var i = 0; i < players.length; i++){
		var wraper = {
			treeList : [],
			playerList : []
		}
		for(var n = 0; n < players.length; n++){
			if(players[n].gridX <= players[i].gridX + 8 && players[n].gridX >= players[i].gridX - 8){
    			if(players[n].gridY <= players[i].gridY + 6 && players[n].gridY >= players[i].gridY - 6){
      				wraper.playerList.push(players[n]);
    			}
  			}
		}


		for(var n = 0; n < trees.length; n++){
			if(trees[n].gridX <= players[i].gridX + 8 && trees[n].gridX >= players[i].gridX - 8){
    			if(trees[n].gridY <= players[i].gridY + 6 && trees[n].gridY >= players[i].gridY - 6){
      				wraper.treeList.push(trees[n]);
    			}
  			}
		}

		io.to(`${playerIDs[i]}`).emit('treeInfo', wraper.treeList);
		io.to(`${playerIDs[i]}`).emit('playerInfo', wraper.playerList);

	}
}

function growTree(){
	if (Math.random() < 0.5){
		var randX = (Math.floor(Math.random() * (borderRadius*2)) - borderRadius);
		var randY = (Math.floor(Math.random() * (borderRadius*2)) - borderRadius);

		var info = {
			gridX: randX,
			gridY: randY
		}

		trees.push(info);

		// io.emit('treeInfo', trees);
	}


}


var playerIDs = [];


app.use(express.static('public')); //used to get files from public

app.get('/', function(req, res){
  res.render("index.ejs");
});


var playerCount = 0;

io.on('connection', function(socket){
  	console.log(socket.id + " connected");
  	playerIDs.push(socket.id);
  	players.push({
  		x : 0,
  		y : 0,
  		gridX : 0,
  		gridY : 0,
  		right : false,
  		left : false,
  		up : false,
  		down : false,
  		ID : playerCount
  	});
  	io.to(`${socket.id}`).emit('ID', players[players.length-1].ID);
  	playerCount++;
  	socket.on('movement', function(state){
  		players[playerIDs.indexOf(socket.id)].right = state.rightPressed;
  		players[playerIDs.indexOf(socket.id)].left = state.leftPressed;
  		players[playerIDs.indexOf(socket.id)].up = state.upPressed;
  		players[playerIDs.indexOf(socket.id)].down = state.downPressed;

  	} )
  	socket.on('disconnect', function(){
    	console.log(socket.id + ' disconnected');
	})

});



function move(){
	for(var i = 0; i < players.length; i++){
			if (players[i].right === true && players[i].x < borderRadius * 40){
	  			players[i].x += 2;
	  		}

	  		if (players[i].left === true && players[i].x > (Math.abs(borderRadius) * -1) * 40){
	  			players[i].x -= 2;

	  		}

	  		if (players[i].up === true && players[i].y > (Math.abs(borderRadius) * -1) * 40){
	  			players[i].y -= 2;

	  		}

	  		if (players[i].down === true && players[i].y < borderRadius * 40){
	  			players[i].y += 2;

	  		}
	  		players[i].gridX = Math.floor(players[i].x/40)
	  		players[i].gridY = Math.floor(players[i].y/40)
	  	}
}

function ping(){
	move();
	growTree();
	emitInfo();
}

var interval = setInterval(ping, 10);


http.listen(3000, function(){
  console.log('listening on *:3000');
});
