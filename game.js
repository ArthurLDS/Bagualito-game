
var canvas, ctx, frames = 0, game = {}, currentStatus, record, image;

const WIDTH=900, HEIGHT=600;
const status = {
  NOT_STARTED: 0,
  PLAYING: 1,
  LOOSER_GAME: 2,
};

const level = {
  LEVEL_1 : 1,
  LEVEL_2 : 5,
  LEVEL_3 : 8,
  LEVEL_4 : 18,
  LEVEL_FINAL: 25
};

const characterStatus = {
  RUNNING_1 : 0,
  RUNNING_2 : 1,
  RUNNING_3 : 2,
  RUNNING_4 : 3,
  RUNNING_5 : 4,
  RUNNING_6 : 5,
  RUNNING_7 : 6,
  RUNNING_8 : 7,
  JUMPING: 4,
  NOT_RUNNING: 5
}

game.ground = {
  x: 0,
  y: HEIGHT-80,
  height: 80,
  width: 595,
  refresh: function(){
    if(!game.obstacles.speed)
      this.x -= 8
    else
      this.x -= game.obstacles.speed;

    if(this.x<=-300)
      this.x += 300;

  },
  draw: function(){
      let img = new Image();
      img.src =  "ground.png";

      ctx.drawImage(img, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
      ctx.drawImage(img, 0, 0, this.width, this.height, this.x + this.width, this.y, this.width, this.height);
  }
};

game.character = {
  x: 65,
  y: 50+5,
  height: 115,
  width: 107,
  color: "#e43",
  speed: 0,
  gravity: 1.6,
  jumpPower: 25,
  qntJumps: 3,
  points: 0,
  status: 0,
  lastQntFrames: 0,
  moveStatus: false,
  level : '',
  brokedRecord: '',
  refresh: function(){
    this.speed += this.gravity;
    this.y += this.speed;
    //Manter character no chão
    if(this.y >= game.ground.y - this.height && currentStatus != status.LOOSER_GAME){
      this.y = game.ground.y - this.height;
    }
    if(this.y == game.ground.y - this.height)
      this.qntJumps = 3;

    if(!this.level || currentStatus == status.LOOSER_GAME)
      this.level = level.LEVEL_1;

  },
  jump: function(){
    if(this.qntJumps > 0 && this.qntJumps <= 3){
      this.qntJumps--;
      this.speed = -this.jumpPower;
    }
  },
  draw: function(){
    let img = new Image();
    img.src = "character-sprite.gif";

    //Check jumping
    if(this.y< game.ground.y-this.height){
      clearCharacter(this);
      ctx.drawImage(img, 650, 0, this.width, this.height, this.x, this.y, this.width, this.height);
      this.status = characterStatus.JUMPING;
    }
    else{
      drawCharacterSpriteSituations(img, this);
    }

    if(this.lastQntFrames === frames){
      if(this.status>= characterStatus.RUNNING_8)
        this.status = characterStatus.RUNNING_1;
      else
        this.status++;
    }
    else if(this.lastQntFrames <= frames){
      this.lastQntFrames += 2;
    }

  }
};

function drawCharacterSpriteSituations(img, character){
  ctx.save();
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowColor = "";
  ctx.shadowBlur = 0;

  if(character.status == characterStatus.RUNNING_1){
    clearCharacter(character);
    ctx.drawImage(img, 0, 0, character.width, character.height, character.x, character.y-18, character.width, character.height);
    //this.status = characterStatus.RUNNING_2;
  }
  else if(character.status == characterStatus.RUNNING_2){
    clearCharacter(character);
    ctx.drawImage(img, 109, 0,character.width, character.height+18, character.x, character.y-18, character.width, character.height+18);
    //this.status = characterStatus.RUNNING_3;
  }
  else if(character.status == characterStatus.RUNNING_3){
    clearCharacter(character);
    ctx.drawImage(img, 220, 0, character.width, character.height, character.x, character.y-18, character.width, character.height);
    //this.status = characterStatus.RUNNING_2;
  }
  else if(character.status == characterStatus.RUNNING_4){
    clearCharacter(character);
    ctx.drawImage(img, 324, 2, character.width, character.height, character.x, character.y-18, character.width, character.height);
    //this.status = characterStatus.RUNNING_3;
  }
  else if(character.status == characterStatus.RUNNING_5){
    clearCharacter(character);
    ctx.drawImage(img, 439, 0, character.width, character.height, character.x, character.y-18, character.width, character.height);
    //this.status = characterStatus.RUNNING_4;
  }
  else if(character.status == characterStatus.RUNNING_6){
    clearCharacter(character);
    ctx.drawImage(img, 540, 0, character.width, character.height+18, character.x, character.y-18, character.width, character.height+18);
    //this.status = characterStatus.RUNNING_5;
  }
  else if(character.status == characterStatus.RUNNING_7) {
    clearCharacter(character);
    ctx.drawImage(img, 650, 0, character.width, character.height, character.x, character.y-18, character.width, character.height);
  //  this.status = characterStatus.RUNNING_6;
  }
  else if(character.status == characterStatus.RUNNING_8) {
    clearCharacter(character);
    ctx.drawImage(img, 760, 0, character.width, character.height, character.x, character.y-18, character.width, character.height);
    //this.status = characterStatus.RUNNING_1;
  }
  ctx.restore();
}

function clearCharacter(character){
  //ctx.fillStyle = "rgb(233,233,233)";
  let img= new Image();
  image.src = "bg-game.jpg";
  ctx.beginPath();
  //ctx.rect(character.x, character.y, character.width, character.height);
  ctx.closePath();
  ctx.fill();
}

game.obstacles = {
  obstacles : [],
  colors: ["#ffe805", "#05ffd9", "#be05ff", "#1ed665", "#ff9126", "#11F"],
  imgs: ["block-brick.jpg", "block-stone-1.jpg", "block-stone-2.jpg", "block-land.png", "block-wood.png", "block-stone-3.png"],
  insersionTime: 0,
  speed: 0,
  scored : false,

  insert: function() {
    let obstacle = {
      x: WIDTH,
      width: 80 + Math.round(20 * Math.random()),
      height: 50 + Math.round(110 * Math.random()),
      color: this.colors[Math.round(5 * Math.random())],
      img: this.imgs[Math.floor(6 * Math.random())]
    };
    this.obstacles.push(obstacle);

    if(game.character.points <= level.LEVEL_1 || game.character.points < level.LEVEL_2){
      game.character.level= level.LEVEL_1;
      this.insersionTime = 20 + Math.round(120 * Math.random());
      this.speed = 8;
    }
    else if(game.character.points >= level.LEVEL_2 && game.character.points < level.LEVEL_3){
      game.character.level = level.LEVEL_2;
      this.insersionTime = 20 + Math.round(80 * Math.random());
      this.speed = 10;
    }
    else if(game.character.points >= level.LEVEL_3 && game.character.points < level.LEVEL_4){
      game.character.level = level.LEVEL_3;
      this.insersionTime = 20 + Math.round(60 * Math.random());
      this.speed = 13;
    }
    else if(game.character.points >= level.LEVEL_4 && game.character.points < level.LEVEL_FINAL){
      game.character.level = level.LEVEL_4;
      this.insersionTime = 20 + Math.round(70 * Math.random());
      this.speed = 18;
    }
    else if(game.character.points >= level.LEVEL_FINAL){
      game.character.level = level.LEVEL_FINAL;
      this.insersionTime = 20 + Math.round(50 * Math.random());
      this.speed = 21;
    }
  },
  refresh: function(){
    if(this.insersionTime === 0)
      this.insert();
    else
      this.insersionTime--;

    if(this.speed<=0)
      this.speed = 8;

    for (let i = 0; i <this.obstacles.length; i++) {
      let obstacle = this.obstacles[i];
      obstacle.x -= this.speed;
      obstacle.y = game.ground.y - obstacle.height+5;

      if(checkLoseGame(game.character, obstacle)){
        currentStatus = status.LOOSER_GAME;
      }
      else if(game.character.x + game.character.width >= obstacle.x && !obstacle.scored){
        game.character.points++;
        obstacle.scored = true;
        if(checkRecordGame(game.character.points)){
          setNewRecord(game.character.points);
          game.character.brokedRecord = true;
        }
        else {
          game.character.brokedRecord = false;
        }
      }
      if(obstacle.x < -obstacle.width)
        this.obstacles.splice(i, 1);
    }
  },
  draw: function() {
    for(let i=0; i<this.obstacles.length; i++){
      let obstacle = this.obstacles[i];
      let img = new Image();
      img.src = obstacle.img;
      ctx.drawImage(img, 0, 0, obstacle.width, obstacle.height, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  },
  clearObstables:function(){
    this.obstacles = [];
  }
};

game.click = function(){
  if(currentStatus == status.NOT_STARTED){
    currentStatus = status.PLAYING;
    game.character.speed = 0;
  }
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

  $("body").click(() => game.click());

  if(getRecordGame() == null){
    createLocalStorageRecord();
  }
  record = getRecordGame();

  image= new Image();
  image.src = "bg-game.jpg";


  currentStatus = status.NOT_STARTED;
  game.run();
};


game.run = function(){
  game.refresh();
  game.draw();
  //window.requestAnimationFrame(game.run());
  setTimeout(() => game.run(), 35);
};

game.refresh = function(){
  frames++;
  game.ground.refresh();
  game.character.refresh();
  if(currentStatus == status.PLAYING){
    game.obstacles.refresh();
  }
  if(currentStatus == status.NOT_STARTED){
    game.character.brokedRecord = false;
  }
};

game.draw = function(){
  drawCanvasBackground();
  if(currentStatus == status.NOT_STARTED){
    drawStartGameScreen();
  }
  else if(currentStatus == status.LOOSER_GAME){
    drawYouLostScreen();
    if(game.character.brokedRecord)
      drawBigTextNewRecord();
  }
  else if(currentStatus == status.PLAYING){
    game.obstacles.draw();
    drawPoints();
    drawLevel();
    drawQntJumps();
    drawRecord();
    if(game.character.brokedRecord)
      drawTextNewRecord();
  }

  game.ground.draw();
  game.character.draw();

};

drawCanvasBackground = function(){
  bg.desenha(image, 0,0);
};

drawStartGameScreen = function(){
  ctx.font = "40px Arial";
  ctx.fillStyle = "#3f3";
  ctx.fillText("CLICK HERE TO START THE GAME.", WIDTH/2-340, HEIGHT/2);
}

drawYouLostScreen = function(){
  //Drawing message
  ctx.font = "40px Arial Black";
  ctx.fillStyle = "#e66";
  ctx.fillText("GAME OVER", WIDTH/2-130, HEIGHT/2-40);
  //Drawing points
  ctx.font = "28px Arial";
  ctx.fillStyle = "#1f1";
  ctx.fillText(`Your score: ${game.character.points}`, WIDTH/2-87, HEIGHT/2+10);
  //Drawing record
  ctx.font = "28px Arial";
  ctx.fillStyle = "#1f1";
  ctx.fillText(`Record: ${record}`, WIDTH/2-77, HEIGHT/2+50);
}

drawPoints = function() {
  ctx.save();
  ctx.font = "20px Arial";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowColor = "";
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#000";
  ctx.fillText(`Points: ${game.character.points}`,10,30);
  ctx.restore();
}

drawRecord = function() {
  ctx.save();
  ctx.font = "20px Arial";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowColor = "";
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#000";
  ctx.fillText(`Record: ${record}`,10,90);
  ctx.restore();
}

drawLevel = function(){
  ctx.font = "23px Arial Black";
  ctx.fillStyle = "#ee6666";
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 4;

  if(game.character.level == level.LEVEL_1){
    ctx.fillText(`Level: 1`, WIDTH-110, 30);
  }

  else if(game.character.level == level.LEVEL_2)
    ctx.fillText(`Level: 2`, WIDTH-110, 30);
  else if(game.character.level == level.LEVEL_3)
    ctx.fillText(`Level: 3`, WIDTH-110, 30);
  else if(game.character.level == level.LEVEL_4)
    ctx.fillText(`Level: 4`, WIDTH-110, 30);
  else
    ctx.fillText(`Level: FINAL`, WIDTH-170, 30);

}

drawQntJumps = function(){
  ctx.save();
  ctx.font = "20px Arial";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowColor = "";
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#000";
  ctx.fillText(`Jumps: ${game.character.qntJumps}`,10,60);
  ctx.restore();
};
drawTextNewRecord = function(){
  ctx.save();
  ctx.font = "18px Arial Black";
  ctx.fillStyle = "#ffb91a";
  ctx.rotate(-0.3);
    ctx.fillText("NEW RECORD!", 15, 145);
  ctx.restore();
};

drawBigTextNewRecord = function(){
  ctx.save();
  ctx.font = "28px Arial Black";
  ctx.fillStyle = "#ffb91a";
  ctx.rotate(-0.2);
  ctx.fillText("NEW RECORD!", WIDTH/2-280, HEIGHT/2-30);
  ctx.restore();
};

checkLoseGame = function(character, obstacle){
  if(character.x < obstacle.x + obstacle.width &&
    character.x + character.width >= obstacle.x &&
     character.y + character.height>= obstacle.y)
       return true;
  return false;
};

getRecordGame = function(){
  return localStorage.getItem("record");
};

createLocalStorageRecord = function(){
  return localStorage.setItem("record", 0);
};

checkRecordGame = function(points) {
  return points > localStorage.getItem("record") ? true : false;
};

setNewRecord = function(points) {
  localStorage.setItem("record", points);
  record = points;
}

game.main();
