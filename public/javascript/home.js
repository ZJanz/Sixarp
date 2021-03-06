
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

            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "wall"){
              ctx.beginPath();
              //positioning is equal to playerXY multiplied by chunkXY times the size of 16 and the grid size of forty. Then array x/y position multiplied by grid size is added
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(139,69,19,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/200 + ")";
              ctx.fill();
              ctx.closePath();
            }

            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "tree"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(0,255,0,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/100 + ")";
              ctx.fill();
              ctx.closePath();
            }

            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "jungle"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(2,89,57,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/120 + ")";
              ctx.fill();
              ctx.closePath();
            }

             if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "catus"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(255,0,0,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/120 + ")";
              ctx.fill();
              ctx.closePath();
            }

            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "savanna"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(210,180,140,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/120 + ")";
              ctx.fill();
              ctx.closePath();
            }

            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "plain"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(5,237,152,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/120 + ")";
              ctx.fill();
              ctx.closePath();
            }

            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "marsh"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(0,153,77,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/120 + ")";
              ctx.fill();
              ctx.closePath();
            }

            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "frost"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(77,106,255,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/120 + ")";
              ctx.fill();
              ctx.closePath();
            }

            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "snow"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(53,73,176,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/120 + ")";
              ctx.fill();
              ctx.closePath();
            }

            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "frozen"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(25,35,84,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/120 + ")";
              ctx.fill();
              ctx.closePath();
            }


            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "rock"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(128,128,128,"+ chunkInfo[xC+"x"+yC].chunk[x][y].dura/150 + ")";
              ctx.fill();
              ctx.closePath();
            }

            if(chunkInfo[xC+"x"+yC].chunk[x][y].name === "water"){
              ctx.beginPath();
              ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.fillStyle = "rgba(0,0,255,"+ 1 +")";
              ctx.fill();
              ctx.closePath();
            }
              // ctx.beginPath();
              // //tree positioning is equal to playerXY multiplied by chunkXY times the size of 16 and the grid size of forty. Then array x/y position multiplied by grid size is added
              // ctx.rect(x * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), y * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              // ctx.fillStyle = "rgb(" + (128 + Math.floor(128 * chunkInfo[xC+"x"+yC].chunk[x][y].noiseValue)) +", "  + (128 + Math.floor(128 * chunkInfo[xC+"x"+yC].chunk[x][y].noiseValue)) + ", " + (128 + Math.floor(128 * chunkInfo[xC+"x"+yC].chunk[x][y].noiseValue)) +")"
              // ctx.fill();
              // ctx.closePath();
          }
        }
        if(chunkInfo[xC+"x"+yC].x === clickedArea.chunkClickedX && chunkInfo[xC+"x"+yC].y === clickedArea.chunkClickedY){
              ctx.beginPath();
              ctx.strokeStyle = "blue";
              ctx.rect(clickedArea.chunkGridXClicked * gridSize - players[currentPlayer].x + 320 + (chunkInfo[xC+"x"+yC].x * chunkSize * gridSize), clickedArea.chunkGridYClicked * gridSize - players[currentPlayer].y + 240 + (chunkInfo[xC+"x"+yC].y * chunkSize * gridSize), gridSize, gridSize)
              ctx.stroke();
              ctx.closePath();
              var chosenGrid = chunkInfo[xC+"x"+yC].chunk[clickedArea.chunkGridXClicked][clickedArea.chunkGridYClicked]
              document.getElementById("gridValue").innerHTML = "name = " + chosenGrid.name + " isSolid = " + chosenGrid.isSolid + " isEmpty = " + chosenGrid.isEmpty + " chunkX = " + clickedArea.chunkClickedX + " chunkY = " + clickedArea.chunkClickedY + " gridX = " + clickedArea.chunkGridXClicked + " gridY = " + clickedArea.chunkGridYClicked + " noise value = " + chosenGrid.noiseValue;
              if(chosenGrid.name === "tree"){
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

var selectedSlot = 1;

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
    if(e.keyCode === 32) {
      if(selectedSlot === 1){
        chopHandler();
      }
      if(selectedSlot === 2){
        placeWallHandler();
      }
      if(selectedSlot === 3){
        fightHandler();
      }
    }
    if(e.keyCode === 49) {
      selectedSlot = 1;
    }
    if(e.keyCode === 50) {
      selectedSlot = 2;
    }
    if(e.keyCode === 51) {
      selectedSlot = 3;
    }
    if(e.keyCode === 52) {
      selectedSlot = 4;
    }
    if(e.keyCode === 53) {
      selectedSlot = 5;
    }
    if(e.keyCode === 54) {
      selectedSlot = 6;
    }
    if(e.keyCode === 55) {
      selectedSlot = 7;
    }
    if(e.keyCode === 56) {
      selectedSlot = 8;
    }
    if(e.keyCode === 57) {
      selectedSlot = 9;
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
