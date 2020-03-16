//index.js

var express = require('express');
app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var borderRadius = 800;
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
				chunkInfo.chunk[x][y].isSolid = false;
				chunkInfo.chunk[x][y].isEmpty = true;
				if(Math.random()< 0.2){	
					chunkInfo.chunk[x][y].tree = true;
					chunkInfo.chunk[x][y].isEmpty = false;
					chunkInfo.chunk[x][y].isSolid = true;
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

					if(playerRender[p][x+"x"+y] === undefined){
						createChunk(currentChunk.chunkX, currentChunk.chunkY)
						playerRender[p][x+"x"+y] = chunks[currentChunk.chunkX + "x" + currentChunk.chunkY];
					}
				}
			}
	io.to(`${playerIDs[p]}`).emit('renderedChunks', playerRender[p])
}


function emitInfo(){
	for(var i = 0; i < players.length; i++){
		var wraper = {
			playerList : []
		}
		for(var n = 0; n < players.length; n++){
			if(players[n].gridX <= players[i].gridX + 8 && players[n].gridX >= players[i].gridX - 8){
    			if(players[n].gridY <= players[i].gridY + 6 && players[n].gridY >= players[i].gridY - 6){
      				wraper.playerList.push(players[n]);
    			}
  			}
		}

		io.to(`${playerIDs[i]}`).emit('playerInfo', wraper.playerList);

	}
}


function death(i){
	
	players[i].x = 0
	players[i].y = 0
	players[i].gridX = 0
	players[i].gridY = 0
	players[i].chunkX = 0
	players[i].chunkY = 0
	players[i].chunkGridX = 0
	players[i].chunkGridY = 0
	players[i].wood = 0
	players[i].health = 10



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
  		ID : playerCount,
  		wood : 0,
  		health : 10
  	});
  	io.to(`${socket.id}`).emit('ID', players[players.length-1].ID);
  	playerCount++;
  	var idPOS = playerIDs.indexOf(socket.id);
  	socket.on('movement', function(state){
  		players[playerIDs.indexOf(socket.id)].right = state.rightPressed;
  		players[playerIDs.indexOf(socket.id)].left = state.leftPressed;
  		players[playerIDs.indexOf(socket.id)].up = state.upPressed;
  		players[playerIDs.indexOf(socket.id)].down = state.downPressed;
  	} )
  	socket.on('fight', function(clickedArea){
  	var range = 1;
  	var damage = 1;
  		if(players[idPOS].chunkX+1 === clickedArea.chunkClickedX && players[idPOS].chunkY === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy != undefined){
				  			players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health -= 1;
				  			console.log("hit");
				  			if(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health <= 0){
				  					death(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].ID);
				  				
				  			}

			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX-1 === clickedArea.chunkClickedX && players[idPOS].chunkY === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy != undefined){
				  			players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health -= 1;
				  			console.log("hit");
				  			if(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health <= 0){
				  					death(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].ID);
				  				
				  			}

			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX === clickedArea.chunkClickedX && players[idPOS].chunkY - 1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy != undefined){
				  			players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health -= 1;
				  			console.log("hit");
				  			if(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health <= 0){
				  					death(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].ID);
				  					
				  			}
				  			
			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX === clickedArea.chunkClickedX && players[idPOS].chunkY + 1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked + 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy != undefined){
				  			players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health -= 1;
				  			console.log("hit");
				  			if(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health <= 0){
				  					death(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].ID);
				  				
				  			}
				  			
			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX-1 === clickedArea.chunkClickedX && players[idPOS].chunkY - 1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy != undefined){
				  			players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health -= 1;
				  			console.log("hit");
				  			if(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health <= 0){
				  					death(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].ID);
				  				
				  			}
				  			
				  			
			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX-1 === clickedArea.chunkClickedX && players[idPOS].chunkY + 1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked + 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy != undefined){
				  			players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health -= 1;
				  			console.log("hit");
				  			if(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health <= 0){
				  					death(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].ID);
				  					
				  			}
				  			
			  			}
		  			}
		  		}


		  		if(players[idPOS].chunkX+1 === clickedArea.chunkClickedX && players[idPOS].chunkY -1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked - 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy != undefined){
				  			players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health -= 1;
				  			console.log("hit");
				  				if(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health <= 0){
				  					death(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].ID);
				  					
				  				}
				  			
				  			
			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX+1 === clickedArea.chunkClickedX && players[idPOS].chunkY + 1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked + 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy != undefined){
				  			players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health -= 1;
				  			console.log("hit");
				  			if(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health <= 0){
				  					death(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].ID);
				  					
				  			}

				  			
			  			}
		  			}
		  		}



		  		if(players[idPOS].chunkX === clickedArea.chunkClickedX && players[idPOS].chunkY === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy != undefined){
				  			players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health -= 1;
				  			console.log("hit");
				  			if(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health <= 0){
				  					death(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].ID);
				  			}

			  			}
			  		}
			  	}
			
  	})




  	socket.on('chop', function(chopArea){
  		var range = 1;
  		if(players[idPOS].chunkX+1 === chopArea.chunkClickedX && players[idPOS].chunkY === chopArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= chopArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked - range){
	  			if(chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree === true){
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isSolid=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isEmpty=true;

		  			players[idPOS].wood += 1;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX-1 === chopArea.chunkClickedX && players[idPOS].chunkY === chopArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= chopArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked - range){
	  			if(chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree === true){
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isSolid=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isEmpty=true;

		  			players[idPOS].wood += 1;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX === chopArea.chunkClickedX && players[idPOS].chunkY - 1 === chopArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= chopArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked - 8 - range){
	  			if(chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree === true){
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isSolid=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isEmpty=true;

		  			players[idPOS].wood += 1;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX === chopArea.chunkClickedX && players[idPOS].chunkY + 1 === chopArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= chopArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked + 8 - range){
	  			if(chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree === true){
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isSolid=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isEmpty=true;

		  			players[idPOS].wood += 1;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX-1 === chopArea.chunkClickedX && players[idPOS].chunkY - 1 === chopArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= chopArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked - 8 - range){
	  			if(chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree === true){
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isSolid=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isEmpty=true;

		  			players[idPOS].wood += 1;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX-1 === chopArea.chunkClickedX && players[idPOS].chunkY + 1 === chopArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= chopArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked + 8 - range){
	  			if(chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree === true){
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isSolid=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isEmpty=true;

		  			players[idPOS].wood += 1;
	  			}
  			}
  		}


  		if(players[idPOS].chunkX+1 === chopArea.chunkClickedX && players[idPOS].chunkY -1 === chopArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= chopArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked - 8 - range){
	  			if(chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree === true){
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isSolid=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isEmpty=true;

		  			players[idPOS].wood += 1;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX+1 === chopArea.chunkClickedX && players[idPOS].chunkY + 1 === chopArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= chopArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked + 8 - range){
	  			if(chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree === true){
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isSolid=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isEmpty=true;

		  			players[idPOS].wood += 1;
	  			}
  			}
  		}



  		if(players[idPOS].chunkX === chopArea.chunkClickedX && players[idPOS].chunkY === chopArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= chopArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked - range){
	  			if(chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree === true){
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].tree=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isSolid=false;
		  			chunks[chopArea.chunkClickedX + "x" + chopArea.chunkClickedY].chunk[chopArea.chunkGridXClicked][chopArea.chunkGridYClicked].isEmpty=true;


		  			players[idPOS].wood += 1;
	  			}
	  		}
	  	}

  	})

	socket.on('placeWall', function(clickedArea){
	  		var range = 1;
	  		if(players[idPOS].wood > 0){
		  		if(players[idPOS].chunkX+1 === clickedArea.chunkClickedX && players[idPOS].chunkY === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].wall=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty=false;

				  			players[idPOS].wood -= 1;
			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX-1 === clickedArea.chunkClickedX && players[idPOS].chunkY === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].wall=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty=false;

				  			players[idPOS].wood -= 1;
			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX === clickedArea.chunkClickedX && players[idPOS].chunkY - 1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].wall=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty=false;

				  			players[idPOS].wood -= 1;
			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX === clickedArea.chunkClickedX && players[idPOS].chunkY + 1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked + 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].wall=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty=false;

				  			players[idPOS].wood -= 1;
			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX-1 === clickedArea.chunkClickedX && players[idPOS].chunkY - 1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].wall=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty=false;

				  			players[idPOS].wood -= 1;
			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX-1 === clickedArea.chunkClickedX && players[idPOS].chunkY + 1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked + 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].wall=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty=false;

				  			players[idPOS].wood -= 1;
			  			}
		  			}
		  		}


		  		if(players[idPOS].chunkX+1 === clickedArea.chunkClickedX && players[idPOS].chunkY -1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= chopArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= chopArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked - 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].wall=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty=false;

				  			players[idPOS].wood -= 1;
			  			}
		  			}
		  		}

		  		if(players[idPOS].chunkX+1 === clickedArea.chunkClickedX && players[idPOS].chunkY + 1 === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked + 8 - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].wall=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty=false;

				  			players[idPOS].wood -= 1;
			  			}
		  			}
		  		}



		  		if(players[idPOS].chunkX === clickedArea.chunkClickedX && players[idPOS].chunkY === clickedArea.chunkClickedY){
			  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - range){
			  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].wall=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid=true;
				  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty=false;


				  			players[idPOS].wood -= 1;
			  			}
			  		}
			  	}
			}

	  	})
  	


  	socket.on('disconnect', function(){
    	console.log(socket.id + ' disconnected');
	})

});



function move(i){

		delete chunks[players[i].chunkX + "x" + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY].occupiedBy;
		chunks[players[i].chunkX + "x" + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY].isSolid = false;

	
		if (chunks[players[i].chunkX + "x" + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY].occupiedBy === players[i].ID) { 
			chunks[players[i].chunkX + "x" + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY].occupiedBy.splice(x, 1); 
		}


		if (players[i].right === true && players[i].x < borderRadius * 40){
			var moveRight = true;
			if (players[i].x % 40 === 38 || players[i].x % 40 === -2) {
				if(playerRender[i]["0x0"].chunk[players[i].chunkGridX + 1] === undefined){
					if (playerRender[i]["1x0"].chunk[0][players[i].chunkGridY].isSolid === true){
		  				moveRight = false;
		  			}
				} else {
		  		
		  		if (playerRender[i]["0x0"].chunk[players[i].chunkGridX + 1][players[i].chunkGridY].isSolid === true){
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
			if (players[i].x % 40 === 2 || players[i].x % 40 <= -38) {
				if(playerRender[i]["0x0"].chunk[players[i].chunkGridX - 1] === undefined){
					if (playerRender[i]["-1x0"].chunk[7][players[i].chunkGridY].isSolid === true ){
		  				moveLeft = false;
		  			}
				} else {
		  		
		  		if (playerRender[i]["0x0"].chunk[players[i].chunkGridX - 1][players[i].chunkGridY].isSolid === true){
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
					if (playerRender[i]["0x-1"].chunk[players[i].chunkGridX][7].isSolid === true){
		  				moveUp = false;
		  			}
				} else {
		  		
		  		if (playerRender[i]["0x0"].chunk[players[i].chunkGridX][players[i].chunkGridY-1].isSolid === true){
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
					if (playerRender[i]["0x1"].chunk[players[i].chunkGridX][0].isSolid === true){
		  				moveDown = false;
		  			}
				} else {
		  		
		  		if (playerRender[i]["0x0"].chunk[players[i].chunkGridX][players[i].chunkGridY+1].isSolid === true){
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

  		
  		chunks[players[i].chunkX + "x" + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY].occupiedBy = players[i].ID;
  		chunks[players[i].chunkX + "x" + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY].isSolid = true;


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
