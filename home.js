var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height/2;

var ballRadius = 10;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();

}

var posx = 20;
var posy = 40;

function drawRect(){
	movement();
	ctx.beginPath();
	ctx.rect(posx, posy, 50, 50);
	ctx.fillStyle = "#FF0000";
	ctx.fill();
	ctx.closePath();
}

var posx2 = 80;
var posy2 = 120;

function drawRect2(){
	
	movement();
	ctx.beginPath();
	ctx.rect(posx2, posy2, 50, 50);
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

function movement(){
	if (rightPressed === true) {
		posx -= 2;
		posx2 -= 2;
	}
	if (leftPressed === true){
		posx += 2;
		posx2 += 2;
	}
	if (downPressed === true){
		posy -= 2;
		posy2 -= 2;
	}
	if (upPressed === true){
		posy += 2;
		posy2 += 2;
	}
}


var interval = setInterval(draw, 10);