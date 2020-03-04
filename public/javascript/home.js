var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var socket = io();


var ballRadius = 10;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var gridSize = 40;

var trees = [];

var players = [];

var ID;

var state = {
  rightPressed : false,
  leftPressed : false,
  upPressed : false,
  downPressed : false
};


// socket.on('treeInfo', function(treesInfo){
//   trees = treesInfo;
// });

socket.on('playerInfo', function(playerList){
   players = playerList;
   draw();
 });

socket.on('ID', function(result){
  ID = result;
});

var chunkInfo = {};

socket.on('renderedChunks', function(rendered){
  chunkInfo = rendered;
});


//client
 function drawGrid(){
    ctx.beginPath();
    ctx.translate(0.5, 0.5);
    for(var x = 0 - (players[currentPlayer].x % gridSize); x < canvas.width; x += gridSize){
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.clientHeight);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

    }    
    for(var y = 0 - (players[currentPlayer].y % gridSize); y < canvas.height; y += gridSize){
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }    
    ctx.translate(-0.5, -0.5);
  }


var currentPlayer;
function getFocus(){
  for(var i = 0; i < players.length; i++){
    if (players[i].ID === ID){
      currentPlayer = i;
      break;
    }
  }
}

//client
function drawPlayers(){
  for(var i = 0; i < players.length; i++){
    ctx.beginPath();
    ctx.rect(players[i].gridX * gridSize - players[currentPlayer].x + 320, players[i].gridY * gridSize - players[currentPlayer].y + 240, gridSize, gridSize);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(players[i].x - players[currentPlayer].x + canvas.width/2, players[i].y - players[currentPlayer].y + canvas.height/2, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

}



function render(x, y){
  if(x <= players[ID].gridX + 8 && x >= players[ID].gridX - 8){
    if(y <= players[ID].gridY + 6 && y >= players[ID].gridY - 6){
      return true;
    }
  }
  else {return false}
}


function drawTrees(){
  for(var i = 0; i < trees.length; i++){
      ctx.beginPath();
      ctx.rect(trees[i].gridX * gridSize - players[currentPlayer].x + 320, trees[i].gridY * gridSize - players[currentPlayer].y + 240, gridSize, gridSize)
      ctx.fillStyle = "rgb(0, 255, 0)";
      ctx.fill();
      ctx.closePath();
  }
}

chunkSize = 8;

function drawChunk(){
  for(var x = 0; x < chunkSize; x++){
    for(var y = 0; y < chunkSize; y++){
      if(chunkInfo.chunk[x][y].tree === true){
        ctx.beginPath();
        ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo.x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo.y * chunkSize * gridSize), gridSize, gridSize)
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
  getFocus();
	drawGrid();
  // drawTrees();
  drawChunk();
  drawPlayers();
	document.getElementById("cords").innerHTML = "X= " + players[currentPlayer].x + "Y= " + players[currentPlayer].y;
}



document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        state.rightPressed = true;
        socket.emit('movement', state);
    }
    if(e.key == "Left" || e.key == "ArrowLeft") {
        state.leftPressed = true;
       socket.emit('movement', state);
    }
    if(e.key == "Down" || e.key == "ArrowDown") {
        state.downPressed = true;
       socket.emit('movement', state);
    }
    if(e.key == "Up" || e.key == "ArrowUp") {
        state.upPressed = true;
        socket.emit('movement', state);
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        state.rightPressed = false;
        socket.emit('movement', state);
    }
    if(e.key == "Left" || e.key == "ArrowLeft") {
        state.leftPressed = false;
        socket.emit('movement', state);
    }
    if(e.key == "Down" || e.key == "ArrowDown") {
        state.downPressed = false;
        socket.emit('movement', state);
    }
    if(e.key == "Up" || e.key == "ArrowUp") {
        state.upPressed = false;
        socket.emit('movement', state);
    }
}
