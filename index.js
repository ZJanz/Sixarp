//index.js

var express = require('express');
app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var borderRadius = 400;
var trees = [];

var players = [];

var chunks ={};

var chunkSize = 8;
//takes player index
var playerRender = [];

createChunk(0,0);

function createChunk(cX, cY){
	var chunkInfo = {
		x : cX,
		y : cY,
		chunk : []
	}
		for(var x = 0; x < chunkSize; x++){
			chunkInfo.chunk.push([]);
			for(var y = 0; y < chunkSize; y++){
				chunkInfo.chunk[x].push({});
				if(Math.random()< 0.2){	
					chunkInfo.chunk[x][y].tree = true;
				}
			}
		}
		chunks[cX + "x" + cY] = chunkInfo;
}



function loadChunk(p){
	var positionX = players[p].gridX;
	var positionY = players[p].gridY;

	playerRender[p] = {};
		for(x = -1; x <=1; x++){
			for(y = -1; y <=1; y++){

				var currentChunk = {
					chunkX : Math.floor(players[p].gridX/chunkSize) + x,
					chunkY : Math.floor(players[p].gridY/chunkSize) + y
				}

				

				playerRender[p][x+"x"+y] = chunks[currentChunk.chunkX + "x" + currentChunk.chunkY];

				//creating new chunks
					if(playerRender[p][x+"x"+y] === undefined){
						createChunk(currentChunk.chunkX, currentChunk.chunkY)
						playerRender[p][x+"x"+y] = chunks[currentChunk.chunkX + "x" + currentChunk.chunkY];
					}
				}
			}
	io.to(`${playerIDs[p]}`).emit('renderedChunks', playerRender[p])
}

// var rendered = {
// 	playerIDs[p] : {
// 		loadedChunk : {
// 			renderedChunk : playerRender[p],
// 			chunkX : currentChunk.chunkX,
// 			chunkY : currentChunk.chunkY
// 		}
// 	}
// }

// function render(x, y){
//   if(x <= players[arrayPOS].gridX + 8 && x >= players[arrayPOS].gridX - 8){
//     if(y <= players[arrayPOS].gridY + 6 && y >= players[arrayPOS].gridY - 6){
//       return true;
//     }
//   }
//   else {return false}
// }

function emitInfo(){
	for(var i = 0; i < players.length; i++){
		var wraper = {
			// treeList : [],
			playerList : []
		}
		for(var n = 0; n < players.length; n++){
			if(players[n].gridX <= players[i].gridX + 8 && players[n].gridX >= players[i].gridX - 8){
    			if(players[n].gridY <= players[i].gridY + 6 && players[n].gridY >= players[i].gridY - 6){
      				wraper.playerList.push(players[n]);
    			}
  			}
		}


		// for(var n = 0; n < trees.length; n++){
		// 	if(trees[n].gridX <= players[i].gridX + 8 && trees[n].gridX >= players[i].gridX - 8){
  //   			if(trees[n].gridY <= players[i].gridY + 6 && trees[n].gridY >= players[i].gridY - 6){
  //     				wraper.treeList.push(trees[n]);
  //   			}
  // 			}
		// }

		// io.to(`${playerIDs[i]}`).emit('treeInfo', wraper.treeList);
		io.to(`${playerIDs[i]}`).emit('playerInfo', wraper.playerList);

	}
}

function growTree(){
	if (Math.random() < 0.04){
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
  		chunkX : 0,
  		chunkY : 0,
  		chunkGridX : 0,
  		chunkGridY : 0,
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



function move(i){
			if (players[i].right === true && players[i].x < borderRadius * 40){
				var moveRight = true;
				if (players[i].x % 40 === 38 || players[i].x % 40 === -2) {
					if(playerRender[i]["0x0"].chunk[players[i].chunkGridX + 1] === undefined){
						if (playerRender[i]["1x0"].chunk[0][players[i].chunkGridY].tree === true){
			  				moveRight = false;
			  			}
					} else {
			  		
			  		if (playerRender[i]["0x0"].chunk[players[i].chunkGridX + 1][players[i].chunkGridY].tree === true){
			  			moveRight = false;
			  		}
			  	}

		  		}
		  		if (moveRight === true){
		  			players[i].x += 2;
		  		} 
	  		}

	  		if (players[i].left === true && players[i].x > (Math.abs(borderRadius) * -1) * 40){
	  			var moveLeft = true;
				if (players[i].x % 40 === 2 || players[i].x % 40 === -38) {
					if(playerRender[i]["0x0"].chunk[players[i].chunkGridX - 1] === undefined){
						if (playerRender[i]["-1x0"].chunk[7][players[i].chunkGridY].tree === true){
			  				moveLeft = false;
			  			}
					} else {
			  		
			  		if (playerRender[i]["0x0"].chunk[players[i].chunkGridX - 1][players[i].chunkGridY].tree === true){
			  			moveLeft = false;
			  		}
			  	}

		  		}
		  		if (moveLeft === true){
		  			players[i].x -= 2;
		  		} 

	  		}

	  		if (players[i].up === true && players[i].y > (Math.abs(borderRadius) * -1) * 40){
	  			var moveUp = true;
				if (players[i].y % 40 === -38 || players[i].y % 40 === 2) {
					if(playerRender[i]["0x0"].chunk[players[i].chunkGridY - 1] === undefined){
						if (playerRender[i]["0x-1"].chunk[players[i].chunkGridX][7].tree === true){
			  				moveUp = false;
			  			}
					} else {
			  		
			  		if (playerRender[i]["0x0"].chunk[players[i].chunkGridX][players[i].chunkGridY-1].tree === true){
			  			moveUp = false;
			  		}
			  	}

		  		}
		  		if (moveUp === true){
		  			players[i].y -= 2;
		  		} 

	  		}

	  		if (players[i].down === true && players[i].y < borderRadius * 40){
	  			var moveDown = true;
				if (players[i].y % 40 === -2 || players[i].y % 40 === 38) {
					if(playerRender[i]["0x0"].chunk[players[i].chunkGridY + 1] === undefined){
						if (playerRender[i]["0x1"].chunk[players[i].chunkGridX][0].tree === true){
			  				moveDown = false;
			  			}
					} else {
			  		
			  		if (playerRender[i]["0x0"].chunk[players[i].chunkGridX][players[i].chunkGridY+1].tree === true){
			  			moveDown = false;
			  		}
			  	}

		  		}
		  		if (moveDown === true){
		  			players[i].y += 2;
		  		} 

	  		}
	  		players[i].gridX = Math.floor(players[i].x/40)
	  		players[i].gridY = Math.floor(players[i].y/40)

	  		players[i].chunkX = Math.floor(players[i].gridX/8)
	  		players[i].chunkY = Math.floor(players[i].gridY/8)

	  		players[i].chunkGridX = players[i].gridX % 8;
	  		if (players[i].chunkGridX < 0){
	  			players[i].chunkGridX += 8;
	  		}	

	  		players[i].chunkGridY = players[i].gridY % 8;
	  		if (players[i].chunkGridY < 0){
	  			players[i].chunkGridY += 8;
	  		}	
	  		

	  		// players[i].chunkGridX

	  		// //wrong
	  		// players[i].chunkGridX = Math.abs(players.gridX % 8);
	  		// players[i].chunkGridY = Math.abs(players.gridY % 8);
}

function selectPlayers(){
	for (var i=0; i < players.length; i++){
		loadChunk(i);
		move(i);
	}
}

function ping(){
	selectPlayers();
	// growTree();
	emitInfo();
}

var interval = setInterval(ping, 10);


http.listen(3000, function(){
  console.log('listening on *:3000');
});
