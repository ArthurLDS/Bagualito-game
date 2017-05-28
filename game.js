
var canvas, ctx, frames = 0, game = {};
const WIDTH=900, HEIGHT=600, MAX_JUMPS=3;

game.ground = {
  x: 0,
  y: HEIGHT-50,
  height: 50,
  color: "#ffdf70",
  draw: function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, WIDTH, this.height);
  }
};

game.character = {
  x: 50,
  y: 50,
  height: 50,
  width: 50,
  color: "#e43",
  speed: 0,
  gravity: 1.6,
  jumpPower: 20,
  qntJumps: 0,
  refresh: function(){
    this.speed += this.gravity;
    this.y += this.speed;
    if(this.y >= game.ground.y - this.height){
      this.y = game.ground.y - this.height;
    }
    if(this.y == game.ground.y - this.height)
      this.qntJumps = 0;
  },
  jump: function(){
    if(this.qntJumps < MAX_JUMPS){
      this.qntJumps++;
      this.speed = -this.jumpPower;
    }
  },
  draw: function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};

game.obstacles = {
  obstacles : [],
  colors: ["#ffe805", "#05ffd9", "#be05ff", "#1ed665", "#ff9126", "#11F"],
  insersionTime: 0,
  speed: 8,
  insert: function() {
    let obstacle = {
      x: WIDTH,
      width: 50 + Math.round(30 * Math.random()),
      height: 30 + Math.round(120 * Math.random()),
      color: this.colors[Math.round(5 * Math.random())]
    };
    this.obstacles.push(obstacle);
    this.insersionTime = 20 + Math.round(30 * Math.random());
  },
  refresh: function(){
    if(this.insersionTime === 0)
      this.insert();
    else
      this.insersionTime--;
    for (let i = 0; i <this.obstacles.length; i++) {
      let obstacle = this.obstacles[i];
      obstacle.x -= this.speed;
      if(obstacle.x <= -obstacle.width)
        this.obstacles.splice(i, 1);
    }
  },
  draw: function() {
    for(let i=0; i<this.obstacles.length; i++){
      let obstacle = this.obstacles[i];
      ctx.fillStyle = obstacle.color;
      ctx.fillRect(obstacle.x, game.ground.y - obstacle.height, obstacle.width, obstacle.height);
    }
  }
};

game.clickJump = function(){
  game.character.jump();
};

game.main = function(){
  canvas = document.createElement("canvas");
  canvas.height = HEIGHT;
  canvas.width = WIDTH;
  canvas.style.border = "1px solid #000";
  ctx = canvas.getContext("2d");
  $("body").append(canvas);

  $("body").click(() => game.clickJump());

  game.run();
  setInterval(() => game.run(), 50);
};


game.run = function(){
  game.refresh();
  game.draw();
};

game.refresh = function(){
  game.character.refresh();
  game.obstacles.refresh();
  frames++;
};

game.draw = function(){
  drawCanvasBackground();

  game.ground.draw();
  game.obstacles.draw();
  game.character.draw();
};

drawCanvasBackground = function(){
  ctx.fillStyle = "#50BEFF";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
};

game.main();
