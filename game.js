
var canvas, ctx, frames = 0, game = {}, currentStatus;
const WIDTH=900, HEIGHT=600;
const status = {
  NOT_STARTED: 0,
  PLAYING: 1,
  LOOSER_GAME: 2,
};

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
  jumpPower: 25,
  qntJumps: 3,
  points: 0,
  refresh: function(){
    this.speed += this.gravity;
    this.y += this.speed;
    if(this.y >= game.ground.y - this.height && currentStatus != status.LOOSER_GAME){
      this.y = game.ground.y - this.height;
    }
    if(this.y == game.ground.y - this.height)
      this.qntJumps = 3;

  },
  jump: function(){
    if(this.qntJumps > 0 && this.qntJumps <= 3){
      this.qntJumps--;
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
    this.insersionTime = 20 + Math.round(40 * Math.random());
  },
  refresh: function(){
    if(this.insersionTime === 0)
      this.insert();
    else
      this.insersionTime--;
    for (let i = 0; i <this.obstacles.length; i++) {
      let obstacle = this.obstacles[i];
      obstacle.x -= this.speed;
      obstacle.y = game.ground.y - obstacle.height;

      if(checkLoseGame(game.character, obstacle))
        currentStatus = status.LOOSER_GAME;
      else if(game.character.x + game.character.width == obstacle.x)
        game.character.points++;

      if(obstacle.x < -obstacle.width)
        this.obstacles.splice(i, 1);
    }
  },
  draw: function() {
    for(let i=0; i<this.obstacles.length; i++){
      let obstacle = this.obstacles[i];
      ctx.fillStyle = obstacle.color;
      ctx.fillRect(obstacle.x, game.ground.y - obstacle.height, obstacle.width, obstacle.height);
    }
  },
  clearObstables:function(){
    this.obstacles = [];
  }
};

game.clickJump = function(){
  if(currentStatus == status.NOT_STARTED)
      currentStatus = status.PLAYING;
  else if(currentStatus == status.LOOSER_GAME){
    game.obstacles.clearObstables();
    game.character.points = 0;
    currentStatus = status.NOT_STARTED;
  }

  else
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

  currentStatus = status.NOT_STARTED;
  setInterval(() => game.run(), 40);
};


game.run = function(){
  game.refresh();
  game.draw();
};

game.refresh = function(){
  frames++;
  game.character.refresh();
  if(currentStatus == status.PLAYING){
    game.obstacles.refresh();
  }
};

game.draw = function(){
  drawCanvasBackground();


  if(currentStatus == status.NOT_STARTED){
    drawStartGameScreen();
  }
  else if(currentStatus == status.LOOSER_GAME){
    drawYouLostScreen();
  }
  else if(currentStatus == status.PLAYING){
    game.obstacles.draw();
    drawCountFrames();
    drawQntJumps();
  }
  game.ground.draw();
  game.character.draw();

};

drawCanvasBackground = function(){
  ctx.fillStyle = "#50BEFF";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
};

drawStartGameScreen = function(){
  ctx.font = "40px Arial";
  ctx.fillStyle = "#3f3";
  ctx.fillText("CLICK HERE TO START THE GAME.", WIDTH/2-340, HEIGHT/2);
}

drawYouLostScreen = function(){
  ctx.font = "40px Arial Black";
  ctx.fillStyle = "#e66";
  ctx.fillText("You Lost!", WIDTH/2-115, HEIGHT/2-40);
  ctx.font = "28px Arial";
  ctx.fillStyle = "#1f1";
  ctx.fillText(`Your score: ${game.character.points}`, WIDTH/2-94, HEIGHT/2+10);
}

drawCountFrames = function() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`Points: ${game.character.points}`,10,30);
}

drawQntJumps = function(){
  ctx.font = "20px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`Jumps: ${game.character.qntJumps}`,10,60);
}

checkLoseGame = function(character, obstacle){
  if(character.x < obstacle.x + obstacle.width &&
    character.x + character.width >= obstacle.x &&
     character.y + character.height>= obstacle.y)
       return true;
  return false;
};

game.main();
