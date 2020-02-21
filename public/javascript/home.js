var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var socket = io();


var ballRadius = 10;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var gridSize = 40;

var nonconEntiesC;

var publicEntiesC = {
  rectangles : [],
  players : []
}

var arrayPOS;

var state = {
  rightPressed : false,
  leftPressed : false,
  upPressed : false,
  downPressed : false
};

socket.on('noncon', function(nonconEnties){
  nonconEntiesC = nonconEnties;
});

socket.on('tree', function(info){
  nonconEntiesC.gridSpot[info.x][info.y].r = 0;
  nonconEntiesC.gridSpot[info.x][info.y].g = 255;
  nonconEntiesC.gridSpot[info.x][info.y].b = 0;
  nonconEntiesC.gridSpot[info.x][info.y].tree = true;
})

socket.on('playerInfo', function(publicEnties){
   publicEntiesC = publicEnties;
   draw();
 });

socket.on('playerArrayPOS', function(result){
  arrayPOS = result;
});

//client
 function drawGrid(){
    ctx.beginPath();
    ctx.translate(0.5, 0.5);
    for(var x = 0 - (publicEntiesC.players[arrayPOS].x % gridSize); x < canvas.width; x += gridSize){
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.clientHeight);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

    }    
    for(var y = 0 - (publicEntiesC.players[arrayPOS].y % gridSize); y < canvas.height; y += gridSize){
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }    
    ctx.translate(-0.5, -0.5);
  }


//client
function drawPlayers(){
  for(var i = 0; i < publicEntiesC.players.length; i++){
    ctx.beginPath();
    ctx.arc(publicEntiesC.players[i].x - publicEntiesC.players[arrayPOS].x + canvas.width/2, publicEntiesC.players[i].y - publicEntiesC.players[arrayPOS].y + canvas.height/2, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

}



function render(x, y){
  if((x * gridSize) - (nonconEntiesC.borderRadius * gridSize) <= (publicEntiesC.players[arrayPOS].x + 320) && x * gridSize - nonconEntiesC.borderRadius * gridSize >= (publicEntiesC.players[arrayPOS].x - 360) && y * gridSize - nonconEntiesC.borderRadius * gridSize <= (publicEntiesC.players[arrayPOS].y + 240) && y * gridSize - nonconEntiesC.borderRadius * gridSize >= (publicEntiesC.players[arrayPOS].y - 280)){
    return true;
  }
  else {return false};
}

function drawBlocks(){
  for(var x = 0; x < nonconEntiesC.gridSpot.length; x++){
    for(var y = 0; y < nonconEntiesC.gridSpot[x].length; y++){
      if(render(x, y) === true) {
        if(nonconEntiesC.gridSpot[x][y].r != null){
            ctx.beginPath();
            ctx.rect(x * gridSize - publicEntiesC.players[arrayPOS].x + 320 - (nonconEntiesC.borderRadius * gridSize) , y * gridSize - publicEntiesC.players[arrayPOS].y + 240 - (nonconEntiesC.borderRadius * gridSize), gridSize, gridSize);
            ctx.fillStyle = "rgb(" + nonconEntiesC.gridSpot[x][y].r + ", " +nonconEntiesC.gridSpot[x][y].g + ", " + nonconEntiesC.gridSpot[x][y].b + ")";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }
  }



//client
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();
  drawBlocks();
  drawPlayers();
	document.getElementById("cords").innerHTML = "X= " + publicEntiesC.players[arrayPOS].x + "Y= " + publicEntiesC.players[arrayPOS].y;
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
