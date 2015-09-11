var display, input, frames, spFrames, lvFrames,finalScore=0;
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
		// here it is where the game starts
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
	//creating a bullets object
	bullets=[];
	//creating the city object with methods
	cities={
		canvas:null,
		y:tank.y - (30 + ciSprite.h),
		h:ciSprite.h,

		init: function() {
			this.canvas = document.createElement("canvas");
			this.canvas.width = display.width;
			this.canvas.height = this.h;
			this.ctx = this.canvas.getContext("2d");

			for(var i=0;i<4;i++){
				this.ctx.drawImage(ciSprite.img, ciSprite.x,ciSprite.y,
					ciSprite.w,ciSprite.h,68+111*i,0,ciSprite.w,ciSprite.h);
			}
		},
		generateDamage:function(x,y){
			x=Math.floor(x/2)*2;
			y=Math.floor(y/2)*2;
			this.ctx.clearRect(x-2, y-2, 4, 4);
			this.ctx.clearRect(x+2, y-4, 2, 4);
			this.ctx.clearRect(x+4, y, 2, 2);
			this.ctx.clearRect(x+2, y+2, 2, 2);
			this.ctx.clearRect(x-4, y+2, 2, 2);
			this.ctx.clearRect(x-6, y, 2, 2);
			this.ctx.clearRect(x-4, y-4, 2, 2);
			this.ctx.clearRect(x-2, y-6, 2, 2);
			
		},
		hits:function(x,y) {
			y-=this.y;
			var data= this.ctx.getImageData(x,y,1,1);
			if (data.data[3] !==0){
				this.generateDamage(x,y);
				return true;
			}
			return false;
		}
	};
	cities.init();
	var rows = [1,0,0,2,2];
	for(var i=0,len = rows.length;i<len;i++){
		for(var j=0 ;j <10 ;j++){
			var a = rows[i];
			aliens.push({
				sprite: alSprite[a],
				x:30 + j*30+[0,4,0][a],  //position of the aliens on x
				y:60 + i*30,            // position of the aliens on y
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
	for (var i =0,len = bullets.length; i<len; i++){
		var b= bullets[i];
		b.update();
		if (b.y+b.height<0 || b.y > display.height){
			bullets.splice(i,1);
			i--;
			len--;
			continue;
		}
		//function that determinates if a citie was damage
		var height2 = b.height *0.5;
		if (cities.y < b.y + height2 && b.y+height2 < cities.y + cities.h){
			if (cities.hits(b.x,b.y+ height2)){
			bullets.splice(i,1);
			i--;
			len--;
			continue;
			}
		}
		// function that determinates if a alien was hit
		for(var j= 0, len2 = aliens.length; j<len2; j++) {
			var a = aliens[j];
			if(ABIntersect(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h)){
				aliens.splice(j,1);
				j--;
				len2--;
				bullets.splice(i,1);
				i--;
				len--;
				finalScore=finalScore+10;

				switch(len2){
					case 30:{
						this.lvFrames=40;
						break;
					}
					case 20:{
						this.lvFrames=20;
						break;
					}
					case 10:{
						this.lvFrames=10;
						break;
					}
				}

			}
		} 
	}

	// shots of the aliens

	if (Math.random() < 0.03 && aliens.length>0){
		var a = aliens[Math.round(Math.random() *(aliens.length - 1))];
		for (var i =0,len=aliens.length;i<len;i++){
			var b=aliens[i];
			if (ABIntersect(a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h)){
				a=b;
			}
		}
		bullets.push(new Bullet(a.x + a.w*0.5,a.y + a.h, 4, 2, 4, "#fff"));
	}
	if ( frames % lvFrames === 0){
		spFrames=(spFrames + 1)%2;
        var maxposition=0, minposition=display.width;
		for(var i = 0,len = aliens.length;i<len;i++){
			var a = aliens[i];
			a.x+= 30*direction;

			maxposition= Math.max(maxposition, a.x + a.w);
			minposition=Math.min(minposition,a.x);
		}
		if (maxposition>display.width -30 || minposition < 30) {
			direction *= -1;
			for (var i = 0,len=aliens.length; i < len; i++) {
				aliens[i].x += 30 * direction;   // when change the line position on x
				aliens[i].y +=30;
			}
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
	display.ctx.drawImage(cities.canvas,0,cities.y);
	display.drawSprite(tank.sprite, tank.x,tank.y);
	display.scoreBoard(finalScore);
};
main();