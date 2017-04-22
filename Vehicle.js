function Vehicle(x,y,speciesName,maxSpeed=3,maxForce=0.1,maxHealth=100){
	this.pos = {
		x:x,
		y:y
	};
	this.vel = {
		x:0,
		y:0
	};
	this.acc = {
		x:0,
		y:0
	};
	this.maxSpeed = maxSpeed;
	this.maxForce = maxForce;
	this.maxHealth = maxHealth;
	this.health = maxHealth;
	this.delay = 0;
	this.generation = 1;
	this.speciesName = speciesName.toString();
	this.tentacle = new Tentacle(Math.floor(this.maxHealth/10),5,this.pos,false,"green",5);
}

Vehicle.prototype.update = function(){
	if(this.delay){
		this.delay--;
	}else{
		this.vel.x += this.acc.x;
		this.vel.y += this.acc.y;
		var speed = Math.sqrt(Math.pow(this.vel.x,2)+Math.pow(this.vel.y,2));
		if(speed>this.maxSpeed){
			var correctionFactor = this.maxSpeed/speed;
			this.vel.x *= correctionFactor;
			this.vel.y *= correctionFactor;
		}
		speed = Math.sqrt(Math.pow(this.vel.x,2)+Math.pow(this.vel.y,2));
		var force = Math.sqrt(Math.pow(this.acc.x,2)+Math.pow(this.acc.y,2));
		this.health -= this.baseCost;
		this.health -= this.speedCost(speed);
		this.health -= this.forceCost(force);
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
		this.acc.x = 0;
		this.acc.y = 0;
		this.tentacle.moveTo(this.pos.x,this.pos.y)
	}
}

Vehicle.prototype.seek = function(target){
	var desired = {
		x: target.x-this.pos.x,
		y: target.y-this.pos.y
	};
	desired.magnitude = Math.sqrt(Math.pow(desired.x,2)+Math.pow(desired.y,2));
	desired.x *= this.maxSpeed/desired.magnitude;
	desired.y *= this.maxSpeed/desired.magnitude;
	var steer = {
		x: desired.x-this.vel.x,
		y: desired.y-this.vel.y
	};
	var force = Math.sqrt(Math.pow(steer.x,2)+Math.pow(steer.y,2));
	if(force>this.maxForce){
		var correctionFactor = this.maxForce/force;
		steer.x *= correctionFactor;
		steer.y *= correctionFactor;
	}
	this.acc.x += steer.x;
	this.acc.y += steer.y;
};

Vehicle.prototype.eat = function(food){
	if(!this.delay){
		if(food.length>0){
			var minDist = Infinity;
			var closest = null;
			for(var i=0;i<food.length;i++){
				var dist = Math.sqrt(Math.pow(this.pos.x-food[i].x,2)+Math.pow(this.pos.y-food[i].y,2));
				if(dist<minDist){
					closest = i;
					minDist = dist;
				}
			}
			if(closest!=null){
				this.seek(food[closest]);
				if(minDist<5){
					food.splice(closest,1);
					this.increaseHealth();
				}
			}
		}
	}
}

Vehicle.prototype.draw = function(context){
	this.tentacle.color = "hsla("+((this.health/this.maxHealth)*120)+",100%,50%,"+Math.min(1,(this.health/this.maxHealth)*5)+")";
	this.tentacle.show2(context);
}

Vehicle.prototype.dead = function(){
	return (this.health<0);
}

Vehicle.prototype.speedCost = function(speed){
	return (speed+Math.pow(speed,2)/10)/100;
}

Vehicle.prototype.forceCost = function(force){
	return force;
}

Vehicle.prototype.baseCost = 0.1;

Vehicle.prototype.splitChance = 0.3;
Vehicle.prototype.splitDelay = 5;
Vehicle.prototype.maxMutationFactor = 0.1; //Atribute Changes by max 10%


Vehicle.prototype.getMutationFactor = function(){
	return 1-this.maxMutationFactor+2*Math.random()*this.maxMutationFactor;
}

Vehicle.prototype.increaseHealth = function(){
	this.health += 50;
	if(this.health>this.maxHealth){
		this.health = this.maxHealth;
		if(Math.random()<this.splitChance){
			this.split();
		}
	}
}

Vehicle.prototype.split = function(){
	vehicles.push(new Vehicle(
		this.pos.x,
		this.pos.y,
		this.speciesName,
		this.maxSpeed*this.getMutationFactor(),
		this.maxForce*this.getMutationFactor(),
		this.maxHealth*this.getMutationFactor()
	));
	var child = vehicles[vehicles.length-1];
	child.health /= 2;
	child.delay = this.splitDelay;
	child.generation = this.generation+1;
	this.health /= 2;
}

Vehicle.prototype.log = function(){
	console.log(
		"maxSpeed: "+this.maxSpeed+"\n"+
		"maxForce: "+this.maxForce+"\n"+
		"maxHealth: "+this.maxHealth
	);
}