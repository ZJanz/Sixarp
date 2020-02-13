var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballx = canvas.width/2;
var bally = canvas.height/2;

var ballRadius = 10;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;


var rectangles = [];

for(var i = 0; i <= 9; i++){
		rectangles.push({
			recx : Math.random() * 640,
			recy : Math.random() * 480
		})
	}

 function drawGrid(){
    var gridSize = 40;
    ctx.beginPath();
    ctx.translate(0.5, 0.5);
    for(var x = 0 - movedx; x < canvas.width; x += gridSize){
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.clientHeight);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }    
    for(var y = 0 - movedy; y < canvas.height; y += gridSize){
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }    
    ctx.translate(-0.5, -0.5);
  }



function drawBall(){
	ctx.beginPath();
	ctx.arc(ballx, bally, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();

}



function drawRect(){
	for(var i = 0; i < 9; i++){
		ctx.beginPath();
		ctx.rect(rectangles[i].recx - movedx, rectangles[i].recy - movedy, 50, 50);
		ctx.fillStyle = "#FF0000";
		ctx.fill();
		ctx.closePath();
	}
}





function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	movement();
	drawGrid();
	drawRect();
	drawBall();
	document.getElementById("cords").innerHTML = "X= " + xCord + "Y= " + yCord;
}



document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
}

var movedx = 0;
var movedy = 0;

var xCord = canvas.width/2;
var yCord = canvas.height/2;
document.getElementById("cords").innerHTML = "X= " + xCord + "Y= " + yCord;

function movement(){
	if (rightPressed === true) {
		movedx += 2;
		xCord += 2;
	}
	if (leftPressed === true){
		movedx -= 2;
		xCord -= 2;
	}
	if (downPressed === true){
		movedy += 2;
		yCord += 2;
	}
	if (upPressed === true){
		movedy -= 2;
		yCord -=2;
	}
}


var interval = setInterval(draw, 10);
