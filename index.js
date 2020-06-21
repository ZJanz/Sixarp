const fastnoise = require('fastnoisejs')
const noise1 = fastnoise.Create(464)
const noise2 = fastnoise.Create(2341)
noise1.SetNoiseType(fastnoise.Perlin)
noise1.SetSeed(744212321)
noise1.SetFrequency(0.01)

noise2.SetNoiseType(fastnoise.Perlin)
noise2.SetSeed(4324)
noise2.SetFrequency(0.01)
 
// for (let x = 0; x < 10; x++) {
//   for (let y = 0; y < 10; y++) {
//     console.log(noise.GetNoise(x, y))
//   }
// }



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


var defaultGrid = {
	isSolid : false,
	isEmpty : true
}

var treeGrid = {
	name : "tree",
	isEmpty : false,
	isSolid : true,
	dura : 100
}

var wallGrid = {
	name : "wall",
	isEmpty : false,
	isSolid : true,
	dura : 200,

}

var catusGrid = {
	name : "catus",
	isEmpty : false,
	isSolid : true,
	dura : 120
}

var savannaGrid = {
	name : "savanna",
	isEmpty : false,
	isSolid : true,
	dura : 120
}

var jungleGrid = {
	name : "jungle",
	isEmpty : false,
	isSolid : true,
	dura : 120
}

var plainGrid = {
	name : "plain",
	isEmpty : false,
	isSolid : true,
	dura : 120
}

var marshGrid = {
	name : "marsh",
	isEmpty : false,
	isSolid : true,
	dura : 120
}

var frostGrid = {
	name : "frost",
	isEmpty : false,
	isSolid : true,
	dura : 120
}

var snowyGrid = {
	name : "snow",
	isEmpty : false,
	isSolid : true,
	dura : 120
}

var frozenGrid = {
	name : "frozen",
	isEmpty : false,
	isSolid : true,
	dura : 120
}

var rockGrid = {
	name : "rock",
	isEmpty : false,
	isSolid : true,
	dura : 150
}

var waterGrid = {
	name : "water",
	isEmpty : false,
	isSolid : false,
}


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
				chunkInfo.chunk[x][y] = { ...defaultGrid};
				var noiseValueT = noise1.GetNoise(x + (chunkInfo.x*8), y + (chunkInfo.y*8))
				var noiseValueR = noise2.GetNoise(x + (chunkInfo.x*8), y + (chunkInfo.y*8))

				var randomNum = Math.random()
				if(randomNum< 0.2 && noiseValueT > 0.3 && noiseValueR < -0.3){	
					chunkInfo.chunk[x][y] = { ...catusGrid};
				}

				if(randomNum< 0.2 && noiseValueT > 0.3 && noiseValueR > -0.3 && noiseValueR < 0.3){	
					chunkInfo.chunk[x][y] = { ...savannaGrid};
				}

				if(randomNum< 0.2 && noiseValueT > 0.3 && noiseValueR > 0.3){	
					chunkInfo.chunk[x][y] = { ...jungleGrid};
				}

				if(randomNum< 0.2 && noiseValueT < 0.3 && noiseValueT > -0.3 && noiseValueR < -0.3){	
					chunkInfo.chunk[x][y] = { ...plainGrid};
				}

				if(randomNum< 0.2 && noiseValueT < 0.3 && noiseValueT > -0.3 && noiseValueR > -0.3 && noiseValueR < 0.3){	
					chunkInfo.chunk[x][y] = { ...treeGrid};
				}

				if(randomNum< 0.2 && noiseValueT < 0.3 && noiseValueT > -0.3 && noiseValueR > 0.3){	
					chunkInfo.chunk[x][y] = { ...marshGrid};
				}

				if(randomNum< 0.2 && noiseValueT < -0.3 && noiseValueR < -0.3){	
					chunkInfo.chunk[x][y] = { ...frostGrid};
				}

				if(randomNum< 0.2 && noiseValueT < -0.3 && noiseValueR > -0.3 && noiseValueR < 0.3){	
					chunkInfo.chunk[x][y] = { ...snowyGrid};
				}

				if(randomNum< 0.2 && noiseValueT < -0.3 && noiseValueR > 0.3){	
					chunkInfo.chunk[x][y] = { ...frozenGrid};
				}

				// if(randomNum< 0.2 && (noiseValueT >= -0.2 && noiseValueT < 0.2)  && (noiseValueR >= -0.2 && noiseValueR < 0.2)){	
				// 	chunkInfo.chunk[x][y] = { ...treeGrid};
				// }

				// if(randomNum< 0.2 && noiseValueT < -0.8 && noiseValueR < -0.8 ){	
				// 	chunkInfo.chunk[x][y] = { ...rockGrid};
				// }

				// if(noiseValueR >= 0.9){	
				// 	chunkInfo.chunk[x][y] = { ...waterGrid};
				// }


			}
		}
		chunks[cX + "x" + cY] = chunkInfo;
}

//added this due to problems while coding creating chunk 0,0
createChunk(0, 0)

function loadChunk(p){
	var positionX = players[p].gridX;
	var positionY = players[p].gridY;

	playerRender[p] = {};
	playerRender[p].cenChunkX = players[p].chunkX;
	playerRender[p].cenChunkY = players[p].chunkY;
		for(x = -1; x <=1; x++){
			for(y = -1; y <=1; y++){

				var currentChunk = {
					chunkX : players[p].chunkX + x,
					chunkY : players[p].chunkY + y
				}

				
				//consider changing to an array that pushes chunks.
				playerRender[p][currentChunk.chunkX+"x"+currentChunk.chunkY] = chunks[currentChunk.chunkX + "x" + currentChunk.chunkY];

					if(chunks[currentChunk.chunkX + "x" + currentChunk.chunkY] === undefined){
						createChunk(currentChunk.chunkX, currentChunk.chunkY)
						playerRender[p][currentChunk.chunkX+"x"+currentChunk.chunkY] = chunks[currentChunk.chunkX + "x" + currentChunk.chunkY];
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

  	if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy != undefined && isBlockInRange(range, idPOS, clickedArea) === true){
			players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health -= 1;
			console.log("hit");
			if(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].health <= 0){
					death(players[chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy].ID);
					chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].occupiedBy = undefined;
			}

		}
			
  	})




  	socket.on('chop', function(clickedArea){
  		var range = 1;
  		if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid === true && isBlockInRange(range, idPOS, clickedArea) === true){

  			mining(clickedArea.chunkClickedX, clickedArea.chunkClickedY, clickedArea.chunkGridXClicked, clickedArea.chunkGridYClicked, playerIDs.indexOf(socket.id));

  			
  			// chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].tree=false;
		  	// chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isSolid=false;
		  	// chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty=true;

		  	// players[idPOS].wood += 1;
  		}
  		

  	})

	socket.on('placeWall', function(clickedArea){
	  		var range = 1;
	  		if(players[idPOS].wood > 0 && chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty === true && isBlockInRange(range, idPOS, clickedArea) === true){
	  			chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked] = { ...wallGrid}

				players[idPOS].wood -= 1;
	  		}
	  		

	  	})
  	


  	socket.on('disconnect', function(){
    	console.log(socket.id + ' disconnected');
	})

});



function mining(cX, cY, x, y, pID){
	chunks[cX + "x" + cY].chunk[x][y].beingMinedBy = pID;
	players[pID].miningcX = cX;
	players[pID].miningcY = cY;
	players[pID].miningX = x;
	players[pID].miningY = y;

}



function move(i){

		delete chunks[players[i].chunkX + "x" + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY].occupiedBy;
		// chunks[players[i].chunkX + "x" + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY].isSolid = false;

	


		if (players[i].right === true && players[i].x < borderRadius * 40){
			var moveRight = true;
			if (players[i].x % 40 === 38 || players[i].x % 40 === -2) {
				if(playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridX + 1] === undefined){
					if (playerRender[i][(players[i].chunkX + 1) +"x" + players[i].chunkY].chunk[0][players[i].chunkGridY].isSolid === true || playerRender[i][(players[i].chunkX + 1) +"x" + players[i].chunkY].chunk[0][players[i].chunkGridY].occupiedBy != undefined){
		  				moveRight = false;
		  			}
				} else {
		  		
		  		if (playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridX + 1][players[i].chunkGridY].isSolid === true || playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridX + 1][players[i].chunkGridY].occupiedBy != undefined){
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
				if(playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridX - 1] === undefined){
					if (playerRender[i][(players[i].chunkX - 1) +"x" + players[i].chunkY].chunk[7][players[i].chunkGridY].isSolid === true || playerRender[i][(players[i].chunkX - 1) +"x" + players[i].chunkY].chunk[7][players[i].chunkGridY].occupiedBy != undefined){
		  				moveLeft = false;
		  			}
				} else {
		  		
		  		if (playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridX - 1][players[i].chunkGridY].isSolid === true || playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridX - 1][players[i].chunkGridY].occupiedBy != undefined){
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
				if(playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridY - 1] === undefined){
					if (playerRender[i][players[i].chunkX + 'x' + (players[i].chunkY - 1)].chunk[players[i].chunkGridX][7].isSolid === true || playerRender[i][players[i].chunkX + 'x' + (players[i].chunkY - 1)].chunk[players[i].chunkGridX][7].occupiedBy != undefined){
		  				moveUp = false;
		  			}
				} else {
		  		
		  		if (playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY-1].isSolid === true || playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY-1].occupiedBy != undefined ){
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
				if(playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridY + 1] === undefined){
					if (playerRender[i][players[i].chunkX + 'x' + (players[i].chunkY + 1)].chunk[players[i].chunkGridX][0].isSolid === true || playerRender[i][players[i].chunkX + 'x' + (players[i].chunkY + 1)].chunk[players[i].chunkGridX][0].occupiedBy != undefined){
		  				moveDown = false;
		  			}
				} else {
		  		
		  		if (playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY+1].isSolid === true || playerRender[i][players[i].chunkX + 'x' + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY+1].occupiedBy != undefined ){
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
  		// chunks[players[i].chunkX + "x" + players[i].chunkY].chunk[players[i].chunkGridX][players[i].chunkGridY].isSolid = true;


  	}


function isBlockInRange(r, idPOS, clickedArea){
	var range = r;
  			if(players[idPOS].chunkX+1 === clickedArea.chunkClickedX && players[idPOS].chunkY === clickedArea.chunkClickedY){
	  			if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - range){
	  				if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
		  				return true;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX-1 === clickedArea.chunkClickedX && players[idPOS].chunkY === clickedArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - range){
	  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
		  			return true;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX === clickedArea.chunkClickedX && players[idPOS].chunkY - 1 === clickedArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - 8 - range){
	  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
		  			return true;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX === clickedArea.chunkClickedX && players[idPOS].chunkY + 1 === clickedArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked + 8 - range){
	  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
		  			return true;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX-1 === clickedArea.chunkClickedX && players[idPOS].chunkY - 1 === clickedArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - 8 - range){
	  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
		  			return true;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX-1 === clickedArea.chunkClickedX && players[idPOS].chunkY + 1 === clickedArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked - 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked + 8 - range){
	  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
		  			return true;
	  			}
  			}
  		}


  		if(players[idPOS].chunkX+1 === clickedArea.chunkClickedX && players[idPOS].chunkY -1 === clickedArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked - 8 + range && players[idPOS].chunkGridY >= chopArea.chunkGridYClicked - 8 - range){
	  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
		  			return true;
	  			}
  			}
  		}

  		if(players[idPOS].chunkX+1 === clickedArea.chunkClickedX && players[idPOS].chunkY + 1 === clickedArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + 8 + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked + 8 - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + 8 + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked + 8 - range){
	  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
		  			return true;
	  			}
  			}
  		}



  		if(players[idPOS].chunkX === clickedArea.chunkClickedX && players[idPOS].chunkY === clickedArea.chunkClickedY){
	  		if(players[idPOS].chunkGridX <= clickedArea.chunkGridXClicked + range && players[idPOS].chunkGridX >= clickedArea.chunkGridXClicked - range && players[idPOS].chunkGridY <= clickedArea.chunkGridYClicked + range && players[idPOS].chunkGridY >= clickedArea.chunkGridYClicked - range){
	  			if(chunks[clickedArea.chunkClickedX + "x" + clickedArea.chunkClickedY].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked].isEmpty = true){
		  			return true;
	  			}
	  		}
	  	}
	}
  		
var connectionPinged = {};

function selectPlayersLC(){
		for (var i=0; i < players.length; i++){
			//initally loads the chunks reguardless of tick value to prevent errors
			if(connectionPinged[i] != true){
					loadChunk(i);
					connectionPinged[i] = true;
				} else if(tick === 0) {
					loadChunk(i);
				} 
			}
		tick++;
		//tick value determines how often chunks are loaded for all players, reduces lag significantly
		if (tick === 20) {
			tick = 0;
		}

	}


function selectPlayers(){
	for (var i=0; i < players.length; i++){
		move(i);
	}
}

function selectPlayersMine(){
	for (var i=0; i < players.length; i++){
		isMining(i);
	}
}


function isMining(p){
	if(tick===19){
		if(players[p].miningcX != undefined){
			chunks[players[p].miningcX + "x" + players[p].miningcY].chunk[players[p].miningX][players[p].miningY].dura-=10;
			if(chunks[players[p].miningcX + "x" + players[p].miningcY].chunk[players[p].miningX][players[p].miningY].dura === 0){

				chunks[players[p].miningcX + "x" + players[p].miningcY].chunk[players[p].miningX][players[p].miningY] = { ...defaultGrid};

			  	players[p].wood += 1;

			  	players[p].miningcX = undefined;
			  	players[p].miningcY = undefined;
			  	players[p].miningx = undefined;
			  	players[p].miningy = undefined;



			}
		}
	}
}


var tick = 0;
function ping(){

	selectPlayersLC();
	selectPlayers();
	selectPlayersMine();
	emitInfo();
	
	

}

var interval = setInterval(ping, 10);


http.listen(3000, function(){
  console.log('listening on *:3000');
});
