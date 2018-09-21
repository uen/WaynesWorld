var canvasElement = document.querySelector('canvas');

var canvas = {
	element: canvasElement,
	context: canvasElement.getContext('2d'),
	backgroundStyle: "#000",
};


var burst = new Image();
burst.src = '/WaynesWorld/img/rays.png';

var wayne = new Image();
wayne.src = '/WaynesWorld/img/wayne.png'

var delphiLogo = new Image();
delphiLogo.src = '/WaynesWorld/img/delphi.png';

var delphiLogos = [];
for(var i =0; i<5; i++){
	delphiLogos.push({scale:Math.random()*100, y: Math.random()*canvas.element.clientHeight-1000, x:Math.random()*canvas.element.clientWidth});
}

var miracle = new Audio('/WaynesWorld/audio/music.ogg');
miracle.addEventListener('ended', function(){
	this.currentTime = 0;
	this.play();
}, false);
miracle.play();

var mouse = {clientOffset:{}};

onscroll = function(){
	canvas.clientRect = canvas.element.getClientRects()[0];
	mouse.clientOffset.x = canvas.clientRect.left+canvas.origin.x;
	mouse.clientOffset.y = canvas.clientRect.top+canvas.origin.y;
};

(onresize = function(){
	canvas.element.width = canvas.element.clientWidth;
	canvas.element.height = canvas.element.clientHeight;
	canvas.origin = {
		x:Math.floor(canvas.element.width/2),
		y:Math.floor(canvas.element.height/2)
	};
	canvas.origin.distance = {
		top:-canvas.origin.y,
		bottom:canvas.element.height-canvas.origin.y,
		left:-canvas.origin.x,
		right:canvas.element.width-canvas.origin.x
	};
	onscroll();
})();

onmousemove = function(e){
	mouse.x = e.clientX-mouse.clientOffset.x;
	mouse.y = e.clientY-mouse.clientOffset.y;
};

var currentRot = 0;

var wayneObject = {
	x:-250,
	y:canvas.element.clientHeight*2,
	scale: 0
} 

function increaseWayne(){
	if(wayneObject.scale < 1.25){
		wayneObject.scale += 0.0005;	
	} 
}

var waynesAdded = 0;
var lastWayne = 0;
function raiseWayne(){
	if(wayneObject.y<(canvas.element.height/2)+800){
		stageFunc = increaseWayne;	
	}
	wayneObject.y-=1;

	if(lastWayne == 0 && waynesAdded < 100){
		delphiLogos.push({scale:Math.random()*100, y: Math.random(), x:Math.random()*canvas.element.clientWidth});
		waynesAdded++;
	}
	lastWayne++;
	if(lastWayne>5) lastWayne = 0;

}

function startWayne(){
	if(wayneObject.scale>1) stageFunc = raiseWayne;
	wayneObject.scale+=0.004;
}
var stageFunc = startWayne;

requestAnimationFrame(loop = function(){
	var origin = canvas.origin,
	ctx = canvas.context,
	width = canvas.element.width,
	height = canvas.element.height;
	ctx.setTransform(1,0,0,1,0,0);
	ctx.fillStyle = canvas.backgroundStyle;
	ctx.fillRect(0,0,width,height);
	ctx.translate(origin.x,origin.y);

	ctx.save();
		ctx.rotate(currentRot*wayneObject.scale*1.2);
	
		if(width<height){
			ctx.drawImage(burst, -origin.y*1.5, -origin.y*1.5, height*1.5, height*1.5);	
		} 
		else{
			ctx.drawImage(burst, -origin.x*1.5, -origin.x*1.5, width*1.5, width*1.5);
		}
		
		currentRot = currentRot + 0.005;
	ctx.restore();
	
	for(var i=0; i<delphiLogos.length;i++){
		delphiLogos[i].y += .05*delphiLogos[i].scale;
		ctx.drawImage(delphiLogo, -origin.x + delphiLogos[i].x + Math.sin((delphiLogos[i].y*height)/100000)*100, -origin.y+(delphiLogos[i].y%(canvas.element.height+(600))-500), delphiLogos[i].scale, delphiLogos[i].scale);
	}

	ctx.drawImage(wayne, -((500*wayneObject.scale)/2), wayneObject.y-((700*wayneObject.scale))-700, 500*wayneObject.scale, 700*wayneObject.scale);
	stageFunc();

	requestAnimationFrame(loop);
});
