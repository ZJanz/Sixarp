
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


// function drawTrees(){
//   for(var i = 0; i < trees.length; i++){
//       ctx.beginPath();
//       ctx.rect(trees[i].gridX * gridSize - players[currentPlayer].x + 320, trees[i].gridY * gridSize - players[currentPlayer].y + 240, gridSize, gridSize)
//       ctx.fillStyle = "rgb(0, 255, 0)";
//       ctx.fill();
//       ctx.closePath();
//   }
// }

chunkSize = 8;

var chunkInfo = {};

socket.on('renderedChunks', function(rendered){
  for(x = -1; x <=1; x++){
      for(y = -1; y <=1; y++){
      chunkInfo[x+"x"+y] = rendered[x+"x"+y];
    }
  }
});

function checkSuroundings(){
  document.getElementById("woodAmount").innerHTML = players[currentPlayer].wood;

  if(players[currentPlayer].chunkGridX === 7) {

    if(chunkInfo[1+"x"+0].chunk[7][players[currentPlayer].chunkGridY].isEmpty === true && players[currentPlayer].wood > 0){
      document.getElementById("eastPlace").style.display = "inline";
    } else {
      document.getElementById("eastPlace").style.display = "none";
    }

    if(chunkInfo[1+"x"+0].chunk[0][players[currentPlayer].chunkGridY].tree === true){
      document.getElementById("eastChop").style.display = "inline";
    } else {
      document.getElementById("eastChop").style.display = "none";
    }
  } else {

    if(chunkInfo[0+"x"+0].chunk[players[currentPlayer].chunkGridX + 1][players[currentPlayer].chunkGridY].isEmpty === true && players[currentPlayer].wood > 0){
      document.getElementById("eastPlace").style.display = "inline";
    } else {
      document.getElementById("eastPlace").style.display = "none";
    }

    if(chunkInfo[0+"x"+0].chunk[players[currentPlayer].chunkGridX + 1][players[currentPlayer].chunkGridY].tree === true){
      document.getElementById("eastChop").style.display = "inline";
    } else {
      document.getElementById("eastChop").style.display = "none";
    }
  }

  if(players[currentPlayer].chunkGridX === 0) {
    if(chunkInfo[-1+"x"+0].chunk[7][players[currentPlayer].chunkGridY].isEmpty === true && players[currentPlayer].wood > 0){
      document.getElementById("westPlace").style.display = "inline";
    } else {
      document.getElementById("westPlace").style.display = "none";
    }

    if(chunkInfo[-1+"x"+0].chunk[7][players[currentPlayer].chunkGridY].tree === true){
      document.getElementById("westChop").style.display = "inline";
    } else {
      document.getElementById("westChop").style.display = "none";
    }
  } else {
    if(chunkInfo[0+"x"+0].chunk[players[currentPlayer].chunkGridX - 1][players[currentPlayer].chunkGridY].tree === true){
      document.getElementById("westChop").style.display = "inline";
    } else {
      document.getElementById("westChop").style.display = "none";
    }

    if(chunkInfo[0+"x"+0].chunk[players[currentPlayer].chunkGridX - 1][players[currentPlayer].chunkGridY].isEmpty === true && players[currentPlayer].wood > 0){
      document.getElementById("westPlace").style.display = "inline";
    } else {
      document.getElementById("westPlace").style.display = "none";
    }
  }

  if(players[currentPlayer].chunkGridY === 0) {
    if(chunkInfo[0+"x"+-1].chunk[players[currentPlayer].chunkGridX][7].tree === true){
      document.getElementById("northChop").style.display = "inline";
    } else {
      document.getElementById("northChop").style.display = "none";
    }

    if(chunkInfo[0+"x"+-1].chunk[players[currentPlayer].chunkGridX][7].isEmpty === true && players[currentPlayer].wood > 0){
      document.getElementById("northPlace").style.display = "inline";
    } else {
      document.getElementById("northPlace").style.display = "none";
    }
  } else {
    if(chunkInfo[0+"x"+0].chunk[players[currentPlayer].chunkGridX][players[currentPlayer].chunkGridY-1].tree === true){
      document.getElementById("northChop").style.display = "inline";
    } else {
      document.getElementById("northChop").style.display = "none";
    }

    if(chunkInfo[0+"x"+0].chunk[players[currentPlayer].chunkGridX][players[currentPlayer].chunkGridY-1].isEmpty === true && players[currentPlayer].wood > 0){
      document.getElementById("northPlace").style.display = "inline";
    } else {
      document.getElementById("northPlace").style.display = "none";
    }
  }

  if(players[currentPlayer].chunkGridY === 7) {
    if(chunkInfo[0+"x"+1].chunk[players[currentPlayer].chunkGridX][0].tree === true){
      document.getElementById("southChop").style.display = "inline";
    } else {
      document.getElementById("southChop").style.display = "none";
    }

    if(chunkInfo[0+"x"+1].chunk[players[currentPlayer].chunkGridX][0].isEmpty === true && players[currentPlayer].wood > 0){
      document.getElementById("southPlace").style.display = "inline";
    } else {
      document.getElementById("southPlace").style.display = "none";
    }

  } else {
    if(chunkInfo[0+"x"+0].chunk[players[currentPlayer].chunkGridX][players[currentPlayer].chunkGridY+1].tree === true){
      document.getElementById("southChop").style.display = "inline";
    } else {
      document.getElementById("southChop").style.display = "none";
    }

    if(chunkInfo[0+"x"+0].chunk[players[currentPlayer].chunkGridX][players[currentPlayer].chunkGridY+1].isEmpty === true && players[currentPlayer].wood > 0){
      document.getElementById("southPlace").style.display = "inline";
    } else {
      document.getElementById("southPlace").style.display = "none";
    }
  }
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
              ctx.fillStyle = "rgb(0, 255, 0)";
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
  // alert("chunk " + chunkClickedX + ", " + chunkClickedY + " Grid " + chunkGridXClicked+", " + chunkGridYClicked);
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
document.getElementById("eastChop").addEventListener("click", chopEastHandler);
document.getElementById("westChop").addEventListener("click", chopWestHandler);
document.getElementById("northChop").addEventListener("click", chopNorthHandler);
document.getElementById("southChop").addEventListener("click", chopSouthHandler);

document.getElementById("eastPlace").addEventListener("click", placeEastHandler);
document.getElementById("westPlace").addEventListener("click", placeWestHandler);
document.getElementById("northPlace").addEventListener("click", placeNorthHandler);
document.getElementById("southPlace").addEventListener("click", placeSouthHandler);

function chopEastHandler(){
  socket.emit('chopEast');
}

function chopWestHandler(){
  socket.emit('chopWest');
}

function chopNorthHandler(){
  socket.emit('chopNorth');
}

function chopSouthHandler(){
  socket.emit('chopSouth');
}

function placeEastHandler(){
  socket.emit('placeEast');
}

function placeWestHandler(){
  socket.emit('placeWest');
}

function placeNorthHandler(){
  socket.emit('placeNorth');
}

function placeSouthHandler(){
  socket.emit('placeSouth');
}

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
