var display, input, frames;
var alSprite, taSprite, ciSprite;
var aliens, dir, tank, bullets, cities;


function main() {
	display = new Screen(510, 600);
	input = new InputHandeler();

	var img = new Image();
	img.addEventListener("load", function() {
		
		alSprite = [
			[new Sprite(this,  0, 0, 22, 16), new Sprite(this,  0, 16, 22, 16)],//position on x , on y , width, height
			[new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)],
			[new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]
		];
		taSprite = new Sprite(this);
		ciSprite = new Sprite(this);

		init();
		run();
	});
	img.src = "res/invaders.png";
};

function init() {};

function run() {
	var loop = function() {
		update();
		render();

		window.requestAnimationFrame(loop, display.canvas);
	};
	window.requestAnimationFrame(loop, display.canvas);
};

function update() {};

function render() {
	display.drawSprite(alSprite[0][0], 10, 10);
};


main();