function startGame() {
	GameArea.start();
	player1 = new component(15, 100, "black", 20, GameArea.canvas.height / 2 - 50);
	player2 = new component(15, 100, "black", GameArea.canvas.width - 20 - 15, GameArea.canvas.height / 2 - 50);
	ball = new component(20, 20, "red", GameArea.canvas.width / 2 - 10, GameArea.canvas.height / 2 - 10);
	ball.speed = 3;
	ball.degree = Math.round(Math.random() * 90 - 45 + 180);
	player1.score = 0;
	player2.score = 0;
	
	
	s = new sound("audio/bounce.wav");
	
	document.addEventListener('keydown', (event) => {
		let name = event.key;
		if ((name == "W") || (name == "S")) {
			name = name.toLowerCase();
		}
		if (!keys.includes(name)) {
			keys.push(name);
		}
	}, false);

	document.addEventListener('keyup', (event) => {
		let name = event.key;
		if ((name == "W") || (name == "S")) {
			name = name.toLowerCase();
		}
		let index = keys.indexOf(name);
		if (index > -1) {
			keys.splice(index, 1);
		}
	}, false);
}

let keys = [];

let GameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 480;
		this.canvas.height = 270;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function component(width, height, color, x, y, type) {
	this.type = type;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.update = function(){
		ctx = GameArea.context;
		if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		}
		else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	this.crashWith = function(otherobj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) ||
		(mytop > otherbottom) ||
		(myright < otherleft) ||
		(myleft > otherright)) {
		  crash = false;
		}
		return crash;
	  }
}

function reset_game(winner){
	ball.speed = 3;
	ball.x = GameArea.canvas.width / 2 - 10;
	ball.y = GameArea.canvas.height / 2 - 10;
	ball.degree = Math.round(Math.random() * 90 - 45);

	player1.y = GameArea.canvas.height / 2 - 50;
	player2.y = GameArea.canvas.height / 2 - 10;
	keys = [];
	window.alert("================    " + winner + " scored    ================" + "\nplayer one score: " + player1.score + "\nplayer two score: " + player2.score);
}

function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
}

function updateGameArea() {
	GameArea.clear();

	if (keys.includes("w") && player1.y > 0) {
		player1.y -= 3;
	}
	else if (keys.includes("s") && player1.y < GameArea.canvas.height - player1.height) {
		player1.y += 3;
	}

	if (keys.includes("ArrowUp") && player2.y > 0) {
		player2.y -= 3;
	}
	else if (keys.includes("ArrowDown") && player2.y < GameArea.canvas.height - player2.height) {
		player2.y += 3;
	}

	
	// player1.y = ball.y - player1.height / 2;
	// player2.y = ball.y - player2.height / 2;



	// ball

	ball.x += Math.cos(ball.degree * (Math.PI/180)) * ball.speed;
	ball.y -= Math.sin(ball.degree * (Math.PI/180)) * ball.speed;
	
	if (ball.y <= 0){
		ball.degree *= -1;
		s.play();
	}
	else if (ball.y + ball.height >= GameArea.canvas.height){
		ball.degree *= -1;
		s.play();
	}
	
	if (player1.crashWith(ball)){
		let ballCenterY = ball.y + ball.height / 2;
		let differenceY = ((ballCenterY - player1.y) / player1.height) * 100;
		ball.degree = -(0.9 * Math.max(0, Math.min(100, differenceY)) - 45);

		s.play();
		ball.speed += 0.1
	}
	else if (player2.crashWith(ball)){
		let ballCenterY = ball.y + ball.height / 2;
		let differenceY = ((ballCenterY - player2.y) / player2.height) * 100;
		ball.degree = -(180 - (0.9 * Math.max(0, Math.min(100, differenceY)) - 45));
		
		s.play();
		ball.speed += 0.1
	}


	// scoring

	if (ball.x + ball.width <= 0) {
		player2.score += 1
		reset_game("player2")
	}
	else if (ball.x >= GameArea.canvas.width) {
		player1.score += 1
		reset_game("player1")
	}

	

	player1.update();
	player2.update();
	ball.update();
}