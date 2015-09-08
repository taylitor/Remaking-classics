var display, input, frames, spFrames, lvFrames;
var alSprite, tankSprite, ciSprite;
var aliens, direction, tank, bullets, cities;


function main() {
	display = new Screen(504, 600); // size of the canvas
	input = new InputHandeler();
    // the image of the sprites
	var img = new Image();
	img.addEventListener("load", function() {
		
		alSprite = [ // save every position of the sprites on the image for by use on the game
			[new Sprite(this,  0, 0, 22, 16), new Sprite(this,  0, 16, 22, 16)],//position on x , on y , width, height
			[new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)],
			[new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]
		];
		tankSprite = new Sprite(this, 62, 0, 22, 16 );
		ciSprite = new Sprite(this, 84, 8, 36, 24);

		init();
		run();
	});
	img.src = "res/invaders.png"; //
};

function init() {
	frames = 0;
    spFrames= 0;
    lvFrames= 60;
    direction=1;
	aliens = [];
	tank={
		sprite:tankSprite,
		x:(display.width - tankSprite.w) / 2,
		y:display.height - (30 + tankSprite.h)
	};
	bullets=[];
	var rows = [1,0,0,2,2];
	for(var i=0,len = rows.length;i<len;i++){
		for(var j=0;j <10;j++){
			var a = rows[i];
			aliens.push({
				sprite: alSprite[a],
				x:30 + j*30+[0,4,0][a],
				y:30 + i*30,
				w:alSprite[a][0].w,
				h:alSprite[a][0].h
			});
		}
	}
};

function run() {
	var loop = function() {
		update();
		render();

		window.requestAnimationFrame(loop, display.canvas);
	};
	window.requestAnimationFrame(loop, display.canvas);
};

function update() {
	frames++;
	//movement of the tank
	if (input.isDown(37)){ //left
      tank.x -= 4;
	}
	if (input.isDown(39)){ // right
		tank.x +=4;
	}
	tank.x = Math.max(Math.min(tank.x,display.width - (30+tankSprite.w)),30);

	//bullet
	if(input.isPressed(32)){//space bar
      bullets.push(new Bullet(tank.x + 10, tank.y, -8, 2, 6, "#fff"));
	}
	for (var i =0,len = bullets.length;i<len;i++){
		var b= bullets[i];
		b.update();
		if (b.y+b.height<0 || b.y > display.height){
			bullets.splice(i,1);
			i--;
			len--;
			continue;
		}
	}
	if (Math.random() < 0.03 && aliens.length>0){
		var a = aliens[Math.round(Math.random() *(aliens.length - 1))];
		for (var i =0,len=aliens.length;i<len;i++){
			var b=aliens[i];
			if (ABIntersect(a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h)){
				a=b;
			}
			bullets.push(new Bullet(a.x + a.w*0.5,a.y + a.h, 4, 2, 4, "#fff"));
		}
	}
	if ( frames % lvFrames === 0){
		spFrames=(spFrames + 1)%2;
        var maxposition=0, minposition=display.width;
		for(var i = 0,len = aliens.length;i<len;i++){
			var a = aliens [i];
			a.x+=30*direction;

			maxposition= Math.max(maxposition, a.x + a.w);
			minposition=Math.min(minposition,a.x);
		}
		if (maxposition>display.width -30 || minposition < 30) {
			direction *= -1;
			for (var i = 0,len=aliens.length; i < len; i++) {
				aliens[i].x += 30 * direction;
				aliens[i].y +=30;
			};
		}
	}
};

function render() {
	display.clear();
	for(var i=0,len = aliens.length;i < len;i++){
		var a = aliens[i];
		display.drawSprite(a.sprite[spFrames],a.x,a.y);
	}
	display.ctx.save();
	for (var i = 0, len = bullets.length;i<len;i++){
		display.drawBullet(bullets[i]);
	}
	display.ctx.restore();
	display.drawSprite(tank.sprite, tank.x,tank.y);
};


main();