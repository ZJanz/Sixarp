var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var socket = io();

var movedx = 0;
var movedy = 0;

var ballx = canvas.width/2;
var bally = canvas.height/2;

var ballRadius = 10;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var rectangles = [];
var players = [];
var gridSize = 40;

var arrayPOS;

var state = {
  rightPressed : false,
  leftPressed : false,
  upPressed : false,
  downPressed : false
};

socket.on('playerInfo', function(playersS){
   players = playersS;
   draw();
 });

socket.on('playerArrayPOS', function(result){
  arrayPOS = result;
})

//client
 function drawGrid(){
    ctx.beginPath();
    ctx.translate(0.5, 0.5);
    for(var x = 0 - (players[arrayPOS].movedx % gridSize); x < canvas.width; x += gridSize){
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.clientHeight);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

    }    
    for(var y = 0 - (players[arrayPOS].movedy % gridSize); y < canvas.height; y += gridSize){
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }    
    ctx.translate(-0.5, -0.5);
  }


//client
function drawPlayers(){
  for(var i = 0; i < players.length; i++){
    ctx.beginPath();
    ctx.arc(players[i].x - players[arrayPOS].movedx, players[i].y - players[arrayPOS].movedy, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

}

function drawBall(){
	ctx.beginPath();
	ctx.arc(ballx, bally, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();

}

socket.on('rectangleInfo', function(rectanglesS){
  rectangles = rectanglesS;
});
//possibly needs changing
function drawRect(){
	for(var i = 0; i < rectangles.length; i++){
		ctx.beginPath();
		ctx.rect(rectangles[i].recx * gridSize - players[arrayPOS].movedx, rectangles[i].recy * gridSize - players[arrayPOS].movedy, gridSize, gridSize);
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
	drawBall();
  drawPlayers();
	document.getElementById("cords").innerHTML = "X= " + players[arrayPOS].x + "Y= " + players[arrayPOS].y;
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
