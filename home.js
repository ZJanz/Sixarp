var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height/2;

var ballRadius = 10;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var objects = [];



function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();

}


function drawRect(){
	movement();
	ctx.beginPath();
	ctx.rect(20 + movedx, 40 + movedy, 50, 50);
	ctx.fillStyle = "#FF0000";
	ctx.fill();
	ctx.closePath();
}


function drawRect2(){
	
	movement();
	ctx.beginPath();
	ctx.rect(80 + movedx, 120 + movedy, 50, 50);
	ctx.fillStyle = "#00FF00";
	ctx.fill();
	ctx.closePath();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawRect();
	drawBall();
	drawRect2();
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

function movement(){
	if (rightPressed === true) {
		movedx -= 2;
	}
	if (leftPressed === true){
		movedx += 2;
	}
	if (downPressed === true){
		movedy -= 2;
	}
	if (upPressed === true){
		movedy += 2;
	}
}


var interval = setInterval(draw, 10);
