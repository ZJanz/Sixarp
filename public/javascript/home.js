
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
var socket = io();

console.log(sessionID)
socket.emit('verifyId', { sessionId: sessionID });


canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

onLoad()


// document.getElementById("research").addEventListener("click", researchHandler);
document.getElementById("joinGame").addEventListener("click", joinGameHandler);
document.getElementById("buildUnit").addEventListener("click", buildUnitHandler);
document.getElementById("viewCity").addEventListener("click", viewCityHandler);
document.getElementById("buildScout").addEventListener("click", buildUnitHandler);
document.getElementById("buildSettler").addEventListener("click", buildSettlerHandler);
document.getElementById("buildWarrior").addEventListener("click", buildWarriorHandler);
document.getElementById("buildSpearman").addEventListener("click", buildSpearmanHandler);
document.getElementById("buildSwordman").addEventListener("click", buildSwordmanHandler);
document.getElementById("zoomIn").addEventListener("click", zoomInHandler);
document.getElementById("zoomOut").addEventListener("click", zoomOutHandler);
document.getElementById("buildWorkshop").addEventListener("click", buildWorkshopHandler);
document.getElementById("settleCity").addEventListener("click", settleCityHandler);

let gameInfo = {
	unitAnimations : {

	}
}


function zoomInHandler(){
	game.zoom += 0.2
}

function zoomOutHandler(){
	game.zoom -= 0.2
}


function researchHandler(){
	game.researchMenu = true;
	game.normalDisplay = false;
  	document.getElementById('research').style.display = "none"
  	document.getElementById('viewCity').style.display = "none"
  	
  	document.getElementById('buildSettler').style.display = "none"
  	document.getElementById('buildScout').style.display = "none"
  	document.getElementById('buildWorkshop').style.display = "none"
  	document.getElementById('settleCity').style.display = "none"
  	document.getElementById('buildUnit').style.display = "none"
  	document.getElementById('zoomIn').style.display = "none"
  	document.getElementById('zoomOut').style.display = "none"

}



// document.getElementById("move").addEventListener("click", moveHandler);
function viewCityHandler(){
	game.viewingCity = !game.viewingCity
	if(game.viewingCity === true){
		document.getElementById('buildScout').style.display = "inline"
		document.getElementById('buildScout').style.top = `${canvas.height * 0.9}px`
		document.getElementById('buildSettler').style.display = "inline"
		document.getElementById('buildSettler').style.top = `${canvas.height * 0.9 - 20}px`
		document.getElementById('buildWorkshop').style.display = "inline"
		document.getElementById('buildWorkshop').style.top = `${canvas.height * 0.9 - 40}px`
		document.getElementById('buildSwordman').style.display = "inline"
		document.getElementById('buildSwordman').style.top = `${canvas.height * 0.9 - 60}px`
		document.getElementById('buildWarrior').style.display = "inline"
		document.getElementById('buildWarrior').style.top = `${canvas.height * 0.9 - 80}px`
		document.getElementById('buildSpearman').style.display = "inline"
		document.getElementById('buildSpearman').style.top = `${canvas.height * 0.9 - 100}px`

	} else {
		document.getElementById('buildScout').style.display = "none"
		document.getElementById('buildSettler').style.display = "none"
		document.getElementById('buildWorkshop').style.display = "none"
		document.getElementById('buildWarrior').style.display = "none"
		document.getElementById('buildSpearman').style.display = "none"
		document.getElementById('buildSwordman').style.display = "none"
	}

}

function move(hexX, hexZ, hexY){
	var moveWrap = {
		selectedUnit : game.selectedUnit,
		hexX : hexX,
		hexY : hexY,
		hexZ : hexZ,
	} 
	socket.emit("moveUnit", moveWrap)
}

// function moveHandler(){
// 	console.log(game.playerState.units[game.selectedUnit])
// 	var moveWrap = {
// 		selectedUnit : game.selectedUnit,
// 		hexX : game.playerState.units[game.selectedUnit].hexX - 1,
// 		hexY : game.playerState.units[game.selectedUnit].hexY + 1,
// 		hexZ : game.playerState.units[game.selectedUnit].hexZ
// 	} 
// 	socket.emit("moveUnit", moveWrap)
// }

function buildUnitHandler(){
	socket.emit("buildUnit", game.selectedTown)
}

function buildScoutHandler(){
	socket.emit("buildScout", game.selectedTown)
}

function buildWarriorHandler(){
	socket.emit("buildWarrior", game.selectedTown)
}

function buildSpearmanHandler(){
	socket.emit("buildSpearman", game.selectedTown)
}

function buildSwordmanHandler(){
	socket.emit("buildSwordman", game.selectedTown)
}

function buildSettlerHandler(){
	socket.emit("buildSettler", game.selectedTown)
}

function buildWorkshopHandler(){
	socket.emit("buildWorkshop", game.selectedTown)
}



function startTurnHandler(){
	socket.emit("startTurn")
}

canvas.addEventListener('contextmenu', function(event) {
	event.preventDefault()
	
	point = {
		x : event.clientX,
		y : event.clientY
	}

	hex = pixel_to_flat_hex(point)
	move(hex.x, hex.z, hex.y)
})

canvas.addEventListener("mousedown", (event) => {
	if(game.normalDisplay === true){
		game.isDragging = true
		game.offSetX = event.clientX
		game.offSetY = event.clientY

		point = {
			x : event.clientX,
			y : event.clientY
		}
		

		game.selectedHex = pixel_to_flat_hex(point)
	}
})

function pixel_to_flat_hex(point){
	var q = ( 2./3 * (point.x - game.scrollX)                        									) / (16 * game.zoom)
    var r = (-1./3 * (point.x - game.scrollX) +  Math.sqrt(3)/3 * (point.y-game.scrollY - (8*game.zoom))) / (16 * game.zoom)
    var hex = {
    	x : Math.floor(q),
    	z : Math.floor(r),
    	y : -Math.floor(q)-Math.floor(r)
    }
    return hex
}

socket.on("playerState", function(playerState){
	game.playerState = playerState
	game.user = playerState.user
	// console.log(playerState)
	// console.log(playerState)
})

socket.on("yourTurn", function(turnTimer){
	game.currentTurn = true
	game.turnTimer = turnTimer
})


canvas.addEventListener("mouseup", (event) => {
	game.isDragging = false
})

canvas.addEventListener("mousemove", (event) => {
	if(game.isDragging === true){

		game.scrollX -= game.offSetX - event.clientX
		game.scrollY -= game.offSetY - event.clientY

		game.offSetX = event.clientX
		game.offSetY = event.clientY

	}
})






var game = {
	isDragging : false,
	offSetX : 0,
	offSetY : 0,
	zoom : 1,
	scrollX : 0,
	scrollY : 0,
	selectedHex: {},
	playerState : {},
	viewingCity : false,
	started : false,
}

function joinGameHandler(){
	game.user = "Guest"
	
	// socket.emit("joinGame", game.user)
	game.normalDisplay = true
	document.getElementById('research').style.display = "inline"
  	document.getElementById('zoomOut').style.display = "inline"
  	document.getElementById('zoomIn').style.display = "inline"


	document.getElementById('user').style.display = "none"
	document.getElementById('joinGame').style.display = "none"
	document.getElementById('login').style.display = "none"
	document.getElementById('signUp').style.display = "none"
}






var frame = 0;
var frameSecond = 0;

function draw(){
	frame++;
	if (frame === 60){
		frame = 0;
	}
	frameSecond = frame/60;
	frameRule = Math.floor(frame/10);
	context.clearRect(0, 0, canvas.width, canvas.height);
	// drawHexes(game.zoom)
	drawPlayerMap(game.playerState.map, game.zoom)

	drawMenu()
	

}

function drawMenu(){
	if(game.currentTurn === true){
		context.beginPath();
	    context.font = `16px Arial`;
	    context.fillStyle = "#FF0000";
	    context.fillText("Your Turn " + game.turnTimer, canvas.width/2, canvas.height*0.1);
		context.closePath();
	}
}



function drawPlayerMap(map, maginify){
	var offSet = 0
	var pastSelectedCheck = false
	

	if(map != undefined && game.normalDisplay === true){
		

		var mapArray = []

		var variance = true





		for(var x = 0; x < game.playerState.mapSize.x; x++){
			variance = !variance
			for(var z = 0; z < game.playerState.mapSize.z; z++){
				if(map[(z*2+variance) + "," + (Math.floor(x/2)-z) + "," + (-Math.ceil(x/2)-z)] != undefined){
					// console.log(map[(z*2+variance) + "," + (Math.floor(x/2)-z) + "," + (-Math.ceil(x/2)-z)])
					mapArray.push(map[(z*2+variance) + "," + (Math.floor(x/2)-z) + "," + (-Math.ceil(x/2)-z)])
				}

			}
		}




		
		for(var i = 0; i < mapArray.length; i++){
			


			if(mapArray[i].x === game.selectedHex.x && mapArray[i].y === game.selectedHex.y && mapArray[i].z === game.selectedHex.z){
				pastSelectedCheck = true
				var selected = true
				hexToCanvas(mapArray[i].x, mapArray[i].z, ((3/2*mapArray[i].x) * 16) * maginify, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify, maginify, mapArray[i].type, true)
				if(mapArray[i].type === "town" && mapArray[i].ownedBy === game.user){
					// hexToCanvas(mapArray[i].x, mapArray[i].z, ((3/2*mapArray[i].x) * 16) * maginify, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify, maginify, "dessert", true)
					document.getElementById("townInfo").style.display = "inline"

					
					game.selectedTown = mapArray[i].townHere.arrayIndex
					document.getElementById("townInfo").innerHTML = JSON.stringify(game.playerState.towns[mapArray[i].townHere.arrayIndex])
					uiToCanvas(((3/2*mapArray[i].x) * 16) * maginify + game.scrollX, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify + game.scrollY, offSet)

					
					
					offSet += 1

				} else {
					document.getElementById("townInfo").style.display = "none"
					document.getElementById('viewCity').style.display = 'none'

				}
				if(mapArray[i].unitHere != undefined && mapArray[i].unitHere.ownedBy === game.user){
					game.selectedUnit = mapArray[i].unitHere.arrayIndex
					if(mapArray[i].unitHere.name === "settler" ){
						// settleCityToCanvas(((3/2*mapArray[i].x) * 16) * maginify + game.scrollX, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify + game.scrollY, offSet)
						document.getElementById('settleCity').style.display = "inline"
						document.getElementById('settleCity').style.top = `${canvas.height * 0.9}px`
					}
					// unitUIToCanvas(((3/2*mapArray[i].x) * 16) * maginify + game.scrollX, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify + game.scrollY, offSet)
					// offSet += 1
				} else {
					document.getElementById("settleCity").style.display = "none"
					// document.getElementById('move').style.display = 'none'
				}
				document.getElementById("hexInfo").style.display = "inline"
				document.getElementById("hexInfo").style.top = "40px"
				document.getElementById("hexInfo").innerHTML = JSON.stringify(mapArray[i])

			} else {
				selected = false
				hexToCanvas(mapArray[i].x, mapArray[i].z, ((3/2*mapArray[i].x) * 16) * maginify, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify, maginify, mapArray[i].type, false)
			}
		

			

		}

		////////

		for(var i = 0; i < mapArray.length; i++){
			if(mapArray[i].unitHere != undefined){
				selected = false;

				if(mapArray[i].x === game.selectedHex.x && mapArray[i].y === game.selectedHex.y && mapArray[i].z === game.selectedHex.z){
					selected = true;
				}


				if(mapArray[i].unitHere.name === "scout"){
					scoutToCanvas(mapArray[i].x, mapArray[i].z, ((3/2*mapArray[i].x) * 16) * maginify, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify, maginify, selected, mapArray[i].unitHere)
				}
				if(mapArray[i].unitHere.name === "settler"){
					settlerToCanvas(mapArray[i].x, mapArray[i].z, ((3/2*mapArray[i].x) * 16) * maginify, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify, maginify, selected)
				}
				if(mapArray[i].unitHere.name === "horseman"){
					horsemanToCanvas(mapArray[i].x, mapArray[i].z, ((3/2*mapArray[i].x) * 16) * maginify, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify, maginify, selected)
				}
				if(mapArray[i].unitHere.name === "swordman"){
					swordsmanToCanvas(mapArray[i].x, mapArray[i].z, ((3/2*mapArray[i].x) * 16) * maginify, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify, maginify, selected)
				}
				if(mapArray[i].unitHere.name === "spearman"){
					spearmanToCanvas(mapArray[i].x, mapArray[i].z, ((3/2*mapArray[i].x) * 16) * maginify, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify, maginify, selected)
				}
				if(mapArray[i].unitHere.name === "warrior"){
					warriorToCanvas(mapArray[i].x, mapArray[i].z, ((3/2*mapArray[i].x) * 16) * maginify, (Math.sqrt(3)/2 * mapArray[i].x + Math.sqrt(3) * mapArray[i].z)* 16 * maginify, maginify, selected)
				}
			}
		}

		if(pastSelectedCheck === false){
			document.getElementById("viewCity").style.display = "none"
			document.getElementById("settleCity").style.display = "none"
			// document.getElementById('move').style.display = 'none'
		}
	}
}


function hexCordsToCanvas(x, z) {
    // ... Your conversion logic here ...
	convertedX = ((3/2*x) * 16) * game.zoom;
	convertedZ = (Math.sqrt(3)/2 * x + Math.sqrt(3) * z)* 16 * game.zoom;


    return { x: convertedX, z: convertedZ };
}



function settleCityToCanvas(x, y, offSet){
	document.getElementById('settleCity').style.display = 'inline'
	document.getElementById('settleCity').style.top = `${y - (20*offSet)}px`
	document.getElementById('settleCity').style.left = `${x}px`
}

function settleCityHandler(){
	socket.emit('settleCity', game.selectedUnit)
}

function uiToCanvas(x, y, offSet){
	document.getElementById('viewCity').style.display = 'inline'
	document.getElementById('viewCity').style.top = `${y - (20*offSet)}px`
	document.getElementById('viewCity').style.left = `${x}px`
}

function settlerToCanvas(hexX, hexZ, x, z, maginify, popup){
	var image = document.getElementById("settler")
	var selectedPop = 0;
	if(popup === true){
		selectedPop = 8
	}
	context.beginPath();
	context.drawImage(
	  image,
	    0, 0,
	    32, 28,
	    x + game.scrollX + (8 * maginify), z + game.scrollY + (16 * maginify) - selectedPop,
	    32*maginify, 28*maginify
	    )
	context.closePath();
}

function scoutToCanvas(hexX, hexZ, x, z, maginify, popup, unit){
	var image = document.getElementById("scoutWalk")
	var selectedPop = 0;
	if (unit.hitting === true){
		if(gameInfo.unitAnimations[`${unit.ownerArrayIndex}${unit.arrayIndex}`] === undefined){
			gameInfo.unitAnimations[`${unit.ownerArrayIndex}${unit.arrayIndex}`] = {}
		}
		if(gameInfo.unitAnimations[`${unit.ownerArrayIndex}${unit.arrayIndex}`].hitting === undefined || gameInfo.unitAnimations[`${unit.ownerArrayIndex}${unit.arrayIndex}`].hitting === false){
			gameInfo.unitAnimations[`${unit.ownerArrayIndex}${unit.arrayIndex}`].animationStart = Date.now();
			gameInfo.unitAnimations[`${unit.ownerArrayIndex}${unit.arrayIndex}`].hitting = true;
		}
	}
	if (gameInfo.unitAnimations[`${unit.ownerArrayIndex}${unit.arrayIndex}`] != undefined && gameInfo.unitAnimations[`${unit.ownerArrayIndex}${unit.arrayIndex}`].hitting === true){
		var anInfo = gameInfo.unitAnimations[`${unit.ownerArrayIndex}${unit.arrayIndex}`]
		var currentTime = Date.now();
		const elapsedTime = currentTime - anInfo.animationStart;
		anInfo.progress = Math.min(elapsedTime / 1000, 1);
		image = document.getElementById("scoutAttack")
		const startPosition = hexCordsToCanvas(hexX, hexZ, maginify);
		

		const targetPosition = hexCordsToCanvas(unit.movingTo.hexX, unit.movingTo.hexZ, maginify)
		

		const distanceX = targetPosition.x - startPosition.x;
    	const distanceZ = targetPosition.z - startPosition.z;
		
		const currentX = startPosition.x + distanceX * 0.5;
    	const currentZ = startPosition.z + distanceZ * 0.5;

		var framePicture = Math.floor(anInfo.progress * 8)//put # of frames in animation here

		if(anInfo.progress >= 1){
			gameInfo.unitAnimations[`${unit.ownerArrayIndex}${unit.arrayIndex}`].hitting = false;
		}

		context.beginPath();
		context.drawImage(
		image,
			framePicture*32, 0,
			32, 28,
			currentX + game.scrollX - (4*maginify), currentZ + game.scrollY + (8*maginify) - selectedPop,
			32*maginify, 28*maginify
			)
		context.closePath();
	}
	else if (unit.moving === true){
		var moveLength = 1;
		if(unit.attacking === true){
			moveLength = 0.5;
		}
		const startPosition = hexCordsToCanvas(hexX, hexZ, maginify);
		

		const targetPosition = hexCordsToCanvas(unit.movingTo.hexX, unit.movingTo.hexZ, maginify)
		

		const distanceX = targetPosition.x - startPosition.x;
    	const distanceZ = targetPosition.z - startPosition.z;
		
		const currentX = startPosition.x + distanceX * (unit.progress*moveLength);
    	const currentZ = startPosition.z + distanceZ * (unit.progress*moveLength);


		var framePicture = Math.floor(frameSecond * 7)

		

		context.beginPath();
		context.drawImage(
		image,
			framePicture*32, 0,
			32, 28,
			currentX + game.scrollX - (4*maginify), currentZ + game.scrollY + (8*maginify) - selectedPop,
			32*maginify, 28*maginify
			)
		context.closePath();
	}
	else{
		// var framePicture = Math.floor(frameSecond * 7)
		if(popup === true){
			selectedPop = 8
		}
		context.beginPath();
		context.drawImage(
			image,
			0*32, 0,
			32, 28,
			x + game.scrollX - (4*maginify), z + game.scrollY + (8*maginify) - selectedPop,
			32*maginify, 28*maginify
		)
		context.closePath();
	}

}

function warriorToCanvas(hexX, hexZ, x, z, maginify, popup){
	var image = document.getElementById("warrior")
	var selectedPop = 0;
	if(popup === true){
		selectedPop = 8
	}
	context.beginPath();
	context.drawImage(
	  image,
	    0, 0,
	    32, 28,
	    x + game.scrollX - (8*maginify), z + game.scrollY + (16*maginify) - selectedPop,
	    32*maginify, 28*maginify
	    )
	context.closePath();
}

function spearmanToCanvas(hexX, hexZ, x, z, maginify, popup){
	var image = document.getElementById("spearman")
	var selectedPop = 0;
	if(popup === true){
		selectedPop = 8
	}
	context.beginPath();
	context.drawImage(
	  image,
	    0, 0,
	    32, 28,
	    x + game.scrollX - (8*maginify), z + game.scrollY + (16*maginify) - selectedPop,
	    32*maginify, 28*maginify
	    )
	context.closePath();
}

function swordsmanToCanvas(hexX, hexZ, x, z, maginify, popup){
	var image = document.getElementById("swordsman")
	var selectedPop = 0;
	if(popup === true){
		selectedPop = 8
	}
	context.beginPath();
	context.drawImage(
	  image,
	    0, 0,
	    32, 28,
	    x + game.scrollX - (8*maginify), z + game.scrollY + (16*maginify) - selectedPop,
	    32*maginify, 28*maginify
	    )
	context.closePath();
}

function horsemanToCanvas(hexX, hexZ, x, z, maginify, popup){
	var image = document.getElementById("horseman")
	var selectedPop = 0;
	if(popup === true){
		selectedPop = 8
	}
	context.beginPath();
	context.drawImage(
	  image,
	    0, 0,
	    32, 28,
	    x + game.scrollX - (8*maginify), z + game.scrollY + (16*maginify) - selectedPop,
	    32*maginify, 28*maginify
	    )
	context.closePath();
}

function hexToCanvas(hexX, hexZ, x, z, maginify, type, popup){
	var image = document.getElementById("hexTiles")
	var chosenSpriteX = 0;
	var chosenSpriteY = 0;
	var selectedPop = 0;
	if(popup === true){
		selectedPop = 8
	}
	if(type === "plain"){
		chosenSpriteX = 0;
		chosenSpriteY = 0;
	}
	if(type === "town"){
		chosenSpriteX = 0;
		chosenSpriteY = 48;
		if(game.started === false){
			game.scrollX = ((3/2*-hexX) * 16 * maginify) + canvas.width/2
			game.scrollY = (Math.sqrt(3)/2 * -hexX + Math.sqrt(3) * -hexZ) * 16 * maginify + canvas.height/2
			game.started = true
		}
	}
	if(type === "forest"){
		chosenSpriteX = 64;
		chosenSpriteY = 0; 
	}
	if(type === "frozen"){
		chosenSpriteX = 96;
		chosenSpriteY = 96; 
	}
	if(type === "frost"){
		chosenSpriteX = 160;
		chosenSpriteY = 96; 
	}
	if(type === "marsh"){
		chosenSpriteX = 224;
		chosenSpriteY = 0; 
	}
	if(type === "snow"){
		chosenSpriteX = 0;
		chosenSpriteY = 96;
	}
	if(type === "savana"){
		chosenSpriteX = 32;
		chosenSpriteY = 144;
	}
	if(type === "desert"){
		chosenSpriteX = 0;
		chosenSpriteY = 144;
	}
  	context.beginPath();
	context.drawImage(
	  image,
	    chosenSpriteX, chosenSpriteY,
	    32, 48,
	    x + game.scrollX, z + game.scrollY - selectedPop,
	    32*maginify, 48*maginify
	    )
	context.closePath();

	context.beginPath();
	    context.font = `${8*maginify}px Arial`;
	    context.fillStyle = "#0095DD";
	    context.fillText( hexX+ "," + hexZ + "," + (-hexX-hexZ), x + game.scrollX + (8*maginify), z + game.scrollY+ (32* maginify));
	context.closePath();
}




function onLoad(){
	resize()
}

window.addEventListener('resize', resize, false)

function resize(){
  canvas.setAttribute('width', window.innerWidth);
  canvas.setAttribute('height', window.innerHeight);
  document.getElementById('research').style.left = `${canvas.width * 0.90}px`
  document.getElementById('research').style.top = `${canvas.height * 0.05}px`
  document.getElementById('joinGame').style.top = `${canvas.height/2}px`
  document.getElementById('joinGame').style.left = `${canvas.width/2}px`
  document.getElementById('login').style.left = `${canvas.width/2}px`
  document.getElementById('login').style.top = `${canvas.height* 0.6}px`
  document.getElementById('signUp').style.left = `${canvas.width/2}px`
  document.getElementById('signUp').style.top = `${canvas.height * 0.7}px`
  document.getElementById('user').style.top = `${canvas.height/2 + 20}px`
  document.getElementById('user').style.left = `${canvas.width/2}px`
  document.getElementById('zoomOut').style.left = `${canvas.width*0.90}px`
  document.getElementById('zoomOut').style.top = `${canvas.height*0.10}px`
  document.getElementById('zoomIn').style.left = `${canvas.width*0.85}px`
  document.getElementById('zoomIn').style.top = `${canvas.height*0.10}px`



}

var interval = setInterval(draw, 1000/60);
