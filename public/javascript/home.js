var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var socket = io();


var ballRadius = 10;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var gridSize = 40;

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

socket.on('playerInfo', function(publicEnties){
   publicEntiesC = publicEnties;
   draw();
 });

socket.on('playerArrayPOS', function(result){
  arrayPOS = result;
})

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


socket.on('rectangleInfo', function(rectanglesS){
  publicEntiesC.rectangles = rectanglesS;
});
//possibly needs changing
function drawRect(){
	for(var i = 0; i < publicEntiesC.rectangles.length; i++){
		ctx.beginPath();
		ctx.rect(publicEntiesC.rectangles[i].recx * gridSize - publicEntiesC.players[arrayPOS].x + 320, publicEntiesC.rectangles[i].recy * gridSize - publicEntiesC.players[arrayPOS].y + 240, gridSize, gridSize);
		ctx.fillStyle = "#FF0000";
		ctx.fill();
		ctx.closePath();
	}
}




//client
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();
	drawRect();
  drawPlayers();
	document.getElementById("cords").innerHTML = "X= " + publicEntiesC.players[arrayPOS].x + "Y= " + publicEntiesC.players[arrayPOS].y;
}



document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//client needs to emit
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
