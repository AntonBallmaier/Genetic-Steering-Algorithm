function Tentacle(segments, segmentLength, origin, fixed=false,color="white",width=3,maxSpeed){
	this.joints = new Array(); //tip of the tentacle is segments[0]
	for(var i=0;i<=segments;i++){
		this.joints.push({
			x: origin.x/*-i*segmentLength*/,
			y: origin.y
		});
	}
	this.origin = origin;
	this.segmentLength = segmentLength;
	this.fixed = fixed;
	this.color = color;
	this.width = width;
	this.maxSpeed = maxSpeed;
}

Tentacle.prototype.moveTo = function(x,y){
	var target = {x:x,y:y};
	var tip = this.joints[0];
	if(target.x!=tip.x||target.y!=tip.y){
		if(this.maxSpeed){
			var dx = target.x-tip.x;
			var dy = target.y-tip.y;
			var dir = Math.atan(dy/dx);
			var distance = Math.sqrt(dx*dx+dy*dy);
			if(distance>this.maxSpeed){
				distance = this.maxSpeed;
			}
			if(dx<0){
				distance *= -1;
			}
			this.joints[0] = {
				x: tip.x+Math.cos(dir)*distance,
				y: tip.y+Math.sin(dir)*distance
			};
		}else{
			this.joints[0] = target;
		}
		for(var i=1;i<this.joints.length;i++){
			var joint = this.joints[i];
			var target = this.joints[i-1];
			var dx = target.x-joint.x;
			var dy = target.y-joint.y;
			var dir = Math.atan(dy/dx);
			var distance = Math.sqrt(dx*dx+dy*dy);
			distance -= this.segmentLength;
			if(dx<0){
				distance *= -1;
			}
			joint = {
				x: joint.x+Math.cos(dir)*distance,
				y: joint.y+Math.sin(dir)*distance
			};
			this.joints[i] = joint;
		}
		if(this.fixed){
			var end = this.joints[this.joints.length-1];
			var dx = this.origin.x-end.x;
			var dy = this.origin.y-end.y;
			for(var i=0;i<this.joints.length;i++){
				var joint = this.joints[i];
				joint.x += dx;
				joint.y += dy;
			}
		}
	}
};

Tentacle.prototype.show = function(context){
	context.lineCap = "round";
	context.beginPath();
	context.moveTo(this.joints[0].x,this.joints[0].y);
	for(var i=1;i<this.joints.length;i++){
		context.lineTo(this.joints[i].x,this.joints[i].y);
	}
	context.lineWidth = this.width;
	context.strokeStyle = this.color;
	context.lineJoin = "round";
	context.stroke();
}

Tentacle.prototype.show2 = function(context){
	context.strokeStyle = this.color;
	context.lineCap = "round";
	for(var i=1;i<this.joints.length;i++){
		context.beginPath();
		context.moveTo(this.joints[i-1].x,this.joints[i-1].y);
		context.lineTo(this.joints[i].x,this.joints[i].y);
		context.lineWidth = this.width/this.joints.length*(this.joints.length-i);
		context.stroke();
	}
}