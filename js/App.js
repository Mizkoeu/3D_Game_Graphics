// App constructor
let App = function(canvas, overlay, score, health) {
	this.canvas = canvas;
	this.overlay = overlay;
	this.score = score;
	this.health = health;
	this.fired = false;

	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	if (this.gl === null) {
		throw new Error("Browser does not support WebGL");

	}

	this.gl.pendingResources = {};
	// create a simple scene
	this.scene = new Scene(this.gl);
	this.resize();
	this.keysPressed = {};
	this.mousePos = {};

	//for gem swap
	this.startPos = null;
	this.endPos = null;
};

// match WebGL rendering resolution and viewport to the canvas size
App.prototype.resize = function() {
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	this.scene.camera.setAspectRatio(this.canvas.clientWidth / this.canvas.clientHeight);
};

//closure function?
App.prototype.registerEventHandlers = function() {
	let theApp = this;
	document.onkeydown = function(event) {
		//jshint unused:false
		if(keyboardMap[event.keyCode] === 'C') {
			if (!theApp.fired) {
				theApp.fired = true;
				theApp.keysPressed.C = true;
			} else {theApp.keysPressed.C = false;}
		} else {
			theApp.keysPressed[keyboardMap[event.keyCode]] = true;
		}
	};
	document.onkeyup = function(event) {
		//jshint unused:false
		if(keyboardMap[event.keyCode] === 'C') {
			theApp.fired = false;
		}
		theApp.keysPressed[keyboardMap[event.keyCode]] = false;
	};
	this.canvas.onmousedown = function(event) {
		//jshint unused:false
		theApp.scene.camera.mouseDown();
	};
	this.canvas.onmousemove = function(event) {
		//jshint unused:false
		event.stopPropagation();
		theApp.scene.camera.mouseMove(event);
	};
	this.canvas.onmouseout = function(event) {
		//jshint unused:false
	};
	this.canvas.onmouseup = function(event) {
		//jshint unused:false
		theApp.scene.camera.mouseUp();
	};
	window.addEventListener('resize', function() {
		theApp.resize();
	});
	window.requestAnimationFrame(function() {
		theApp.update();
	});
};

// animation frame update
App.prototype.update = function() {

	let pendingResourceNames = Object.keys(this.gl.pendingResources);
	if (pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl, this.keysPressed);
		if (this.scene.state === 0) {
			this.health.innerHTML = "HEY MAN, YOU HAVE " + this.scene.playerHealth + " LIVES LEFT!";
			this.score.innerHTML = "You have rescued " + this.scene.survivorCount + "/"
														+ this.scene.totalSurvivor + " fellow astronauts.";
		} else {
			this.health.style.left = "30%";
			this.health.style.width = "40%";
			this.health.style.top = "40%";
			this.health.style.color = "yellow";
			this.health.style.fontSize = "6vw";
			this.health.style.padding = "5% 5%";
			if (this.scene.state === 1) {
				this.health.innerHTML = "Wow, you won this exceptionally difficult game!";
			} else if (this.scene.state === -1) {
				this.health.innerHTML = "Sajnos, you lost!";
			}
		}
	} else {
		this.overlay.innerHTML = "Loading: " + pendingResourceNames;
		// this.health.innerHTML = "HEY MAN!";
	}

	// refresh
	let theApp = this;
	window.requestAnimationFrame(function() {
		theApp.update();
	});
};

// entry point from HTML
window.addEventListener('load', function() {
	let canvas = document.getElementById("canvas");
	let overlay = document.getElementById("overlay");
	let health = document.getElementById("health");
	let score = document.getElementById("score");
	overlay.innerHTML = "WebGL";

	let app = new App(canvas, overlay, score, health);
	app.registerEventHandlers();
});
