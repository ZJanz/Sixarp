
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const rect = canvas.getBoundingClientRect();

var socket = io();


var ballRadius = 10;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var gridSize = 40;


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


canvas.addEventListener("mousedown", onDown, false);


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

    //debug info
    // ctx.beginPath();
    // ctx.rect(players[i].gridX * gridSize - players[currentPlayer].x + 320, players[i].gridY * gridSize - players[currentPlayer].y + 240, gridSize, gridSize);
    // ctx.fillStyle = "#FF0000";
    // ctx.fill();
    // ctx.closePath();

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

chunkSize = 8;

var chunkInfo = {};

socket.on('renderedChunks', function(rendered){
  for(x = -1; x <=1; x++){
      for(y = -1; y <=1; y++){
      chunkInfo[x+"x"+y] = rendered[(x + rendered.cenChunkX)+"x"+(y + rendered.cenChunkY)];
    }
  }
});

function checkSuroundings(){
  document.getElementById("woodAmount").innerHTML = players[currentPlayer].wood;
}

function drawChunk(){
  for(xC = -1; xC <=1; xC++){
      for(yC = -1; yC <=1; yC++){
        for(var x = 0; x < chunkSize; x++){
          for(var y = 0; y < chunkSize; y++){

            if(chunkInfo[xC+"x"+yC].chunk[x][y].wall === true){
              ctx.beginPath();
              //positioning is equal to playerXY multiplied by chunkXY times the size of 16 and the grid size of forty. Then array x/y position multiplied by grid size is added
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgb(139,69,19)";
              ctx.fill();
              ctx.closePath();
            }

            if(chunkInfo[xC+"x"+yC].chunk[x][y].tree === true){
              ctx.beginPath();
              //tree positioning is equal to playerXY multiplied by chunkXY times the size of 16 and the grid size of forty. Then array x/y position multiplied by grid size is added
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgb("+ ( (100 - (chunkInfo[xC+"x"+yC].chunk[x][y].dura)) * 2.55)  +", 255," + ((100 - (chunkInfo[xC+"x"+yC].chunk[x][y].dura)) * 2.55)  + ")";
              ctx.fill();
              ctx.closePath();
            }
          }
        }
        if(chunkInfo[xC+"x"+yC].x === clickedArea.chunkClickedX && chunkInfo[xC+"x"+yC].y === clickedArea.chunkClickedY){
              ctx.beginPath();
              ctx.strokeStyle = "blue";
              ctx.rect(clickedArea.chunkGridXClicked * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), clickedArea.chunkGridYClicked * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.stroke();
              ctx.closePath();
              var chosenGrid = chunkInfo[xC+"x"+yC].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked]
              document.getElementById("gridValue").innerHTML = "tree = " + chosenGrid.tree + " isSolid = " + chosenGrid.isSolid + " isEmpty = " + chosenGrid.isEmpty + " chunkX = " + clickedArea.chunkClickedX + " chunkY = " + clickedArea.chunkClickedY + " gridX = " + clickedArea.chunkGridXClicked + " gridY = " + clickedArea.chunkGridYClicked;
              if(chosenGrid.tree === true){
                document.getElementById("chop").style.display = "inline";
              } else {
                document.getElementById("chop").style.display = "none";
              }
              if(chosenGrid.isEmpty === true){
                document.getElementById("wall").style.display = "inline";
              } else {
                document.getElementById("wall").style.display = "none";
              }
              if(chosenGrid.occupiedBy != undefined){
                document.getElementById("fight").style.display = "inline";
              } else {
                document.getElementById("fight").style.display = "none";
              }
              // console.log(chosenGrid.occupiedBy)


        }
      }
    }
  }

function onDown(event){
  cx = (event.pageX - rect.left - (canvas.width/2)) + players[currentPlayer].x;
  cy = (event.pageY - rect.top - (canvas.height/2)) + players[currentPlayer].y;
  getChosenGrid(cx, cy);
}


var clickedArea = {};

function getChosenGrid(x, y){
  var gridXClicked = Math.floor(x/40)
  var gridYClicked = Math.floor(y/40)

  // var chunkClickedX = undefined
  // var chunkClickedY = undefined

  var chunkClickedX = Math.floor(gridXClicked/8);
  var chunkClickedY = Math.floor(gridYClicked/8);

  var chunkGridXClicked = gridXClicked % 8;
  var chunkGridYClicked = gridYClicked % 8;

  if(chunkGridXClicked < 0){
    chunkGridXClicked += 8;
  }

  if(chunkGridYClicked < 0){
    chunkGridYClicked += 8;
  }

  clickedArea.chunkClickedX = chunkClickedX
  clickedArea.chunkClickedY = chunkClickedY
  clickedArea.chunkGridXClicked = chunkGridXClicked
  clickedArea.chunkGridYClicked = chunkGridYClicked
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
  getFocus();
	drawGrid();
  drawChunk();
  drawPlayers();
  checkSuroundings();
	document.getElementById("cords").innerHTML = "X= " + players[currentPlayer].x + "Y= " + players[currentPlayer].y;
}



document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.getElementById("chop").addEventListener("click", chopHandler);
document.getElementById("wall").addEventListener("click", placeWallHandler);
document.getElementById("fight").addEventListener("click", fightHandler);


function fightHandler(){
  socket.emit('fight', clickedArea);
}

function chopHandler(){
  socket.emit('chop', clickedArea);
}

function placeWallHandler(){
  socket.emit('placeWall', clickedArea)
}

  

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.keyCode === 68) {
        state.rightPressed = true;
        socket.emit('movement', state);
    }
    if(e.key == "Left" || e.key == "ArrowLeft" || e.keyCode === 65) {
        state.leftPressed = true;
       socket.emit('movement', state);
    }
    if(e.key == "Down" || e.key == "ArrowDown" || e.keyCode === 83) {
        state.downPressed = true;
       socket.emit('movement', state);
    }
    if(e.key == "Up" || e.key == "ArrowUp" || e.keyCode === 87) {
        state.upPressed = true;
        socket.emit('movement', state);
    }
}
//keycodes for WASD controls

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.keyCode === 68) {
        state.rightPressed = false;
        socket.emit('movement', state);
    }
    if(e.key == "Left" || e.key == "ArrowLeft" || e.keyCode === 65) {
        state.leftPressed = false;
        socket.emit('movement', state);
    }
    if(e.key == "Down" || e.key == "ArrowDown" || e.keyCode === 83) {
        state.downPressed = false;
        socket.emit('movement', state);
    }
    if(e.key == "Up" || e.key == "ArrowUp" || e.keyCode === 87) {
        state.upPressed = false;
        socket.emit('movement', state);
    }
}
