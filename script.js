var ctx, dtx,
	food = new Array(),
	vehicles = new Array(),
	diagrams = {
		timestep: 100,
		maxValues: 100000,
		population: [],
		food: [],
		averageSpeed: [],
		averageForce: [],
		averageHealth: []
	},
	width = 600,
	diagramWidt = 600,
	height = 600
	frame = 0;

window.onload = function(){
	var canvas = document.getElementById("canvas");
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");
	canvas = document.getElementById("diagram");
	canvas.width = width;
	canvas.height = height;
	dtx = canvas.getContext("2d");
	for(var i=0;i<1;i++){
		vehicles.push(new Vehicle(Math.random()*width,Math.random()*height,String.fromCharCode(i+65),Math.random()*5,Math.random()*0.01,Math.random()*1000));
	}
	requestAnimationFrame(main);
};

function main(){
	if(vehicles.length>0){
		ctx.clearRect(0,0,width,height);
		for(var i=0;i<vehicles.length;i++){
			vehicles[i].draw(ctx);
			vehicles[i].eat(food);
			vehicles[i].update();
			if(vehicles[i].dead()){
				vehicles.splice(i--,1);
			}
		}
		ctx.fillStyle = "green";
		for(var i=0;i<food.length;i++){
			ctx.fillRect(food[i].x,food[i].y,5,5);
		}
		if(frame%1==0){
			food.push({
				x: Math.random()*width,
				y: Math.random()*height
			});
		}
		if(frame%diagrams.timestep==0){
			diagrams.update();
		}
		frame++;
		requestAnimationFrame(main);
	}
}

diagrams.draw = function(context, borderWidth=20){
	var height = context.canvas.height;
	var width = context.canvas.width;
	context.clearRect(0,0,width,height);
	var properties = ["population","food","averageSpeed","averageForce","averageHealth"];
	var diagramNums = [0,0,1,1,1];
	var diagramColors = ["purple","darkGreen ","green","blue","red"];
	height = (height-(Math.max(...diagramNums)+2)*borderWidth)/(Math.max(...diagramNums)+1);
	width -= 2*borderWidth;
	context.strokeWidth = 3;
	var length = this.population.length;
	for(var p=0;p<properties.length;p++){
		context.strokeStyle = diagramColors[p];
		var arr = this[properties[p]];
		var max = Math.max(...arr);
		var min = Math.min(...arr);
		var baseHeight = (diagramNums[p]+1)*(borderWidth+height);
		context.beginPath();
		for(var i=0;i<length;i++){
			if(p>1){
				var y = baseHeight-(height*(arr[i]-min)/(max-min));
			}else{
				var y = baseHeight-(height/max*arr[i]);
			}
			var x = borderWidth+(width/length)*i;
			if(i==0){
				context.moveTo(x,y);
			}else{
				context.lineTo(x,y);
			}
		}
		context.stroke();
	}
}

diagrams.update = function(){
	this.population.push(vehicles.length);
	this.food.push(food.length);
	var averageSpeed = averageForce = averageHealth = 0;
	for(var i=0;i<vehicles.length;i++){
		averageSpeed += vehicles[i].maxSpeed;
		averageForce += vehicles[i].maxForce;
		averageHealth += vehicles[i].maxHealth;
	}
	this.averageSpeed.push(averageSpeed/vehicles.length);
	this.averageForce.push(averageForce/vehicles.length);
	this.averageHealth.push(averageHealth/vehicles.length);
	if(this.food.length>this.maxValues){
		this.population.shift();
		this.food.shift();
		this.averageHealth.shift();
		this.averageForce.shift();
		this.averageSpeed.shift();

	}
	this.draw(dtx);
}