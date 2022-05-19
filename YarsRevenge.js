// Create your variables here
var currentLevel=1;
var lives=3;
var score=0;
var currentScreen="startScreen"; //startScreeen, arena, quotiledeath, gameover
var quotileVelocity=2;
var cannonIsFiring=false;
var cannonVelocity=8;
var missileVelocity=2;


//sprites for the arena
var quotile = createSprite(375, 200);
var safeWall = createSprite(200, 200);
var fly = createSprite(50, 200);
var cannon = createSprite(10, 200);
var missile = createSprite(350,200);
var bullet = createSprite(200, 200);

missile.setCollider("rectangle",0,0,20,10);
fly.setCollider("rectangle",0,0,75,75);
cannon.setCollider("rectangle",0,0,20,10);
safeWall.setCollider("rectangle",0,0,35,100);
bullet.setAnimation("bullet");

quotile.scale = 0.3;
fly.scale = 0.5;
cannon.scale=1.25;
safeWall.scale = 4;


// Create your sprites here
quotile.setAnimation("quotile");
fly.setAnimation("flyRight");
safeWall.setAnimation("playerShield");
cannon.setAnimation("cannonBullet");
missile.setAnimation("missile");
cannon.visible=true;


function draw() {
  // draw background
  background("black");
  
  if(currentScreen == "startScreen"){
    RenderStartScreen();
  }else if(currentScreen == "arena"){
    RenderArena();
  }else if(currentScreen =="quotileDeath" ){
    RenderQuotileDeath();
  }else{
    RenderGameOver();
  }
  
  //Functions
  //startScreen();
  //level1();
  //playerMovement();
  //quotileMovement();
  //playerShoots();

  // update sprites

}

function ResetArena(){
  fly.x=50;
  fly.y=200;
  missile.x=350;
  missile.y= 200;
  cannon.visible=false;
  cannon.x=10;
  cannon.y=fly.y;
  cannonIsFiring=false;
}

function RenderStartScreen() {
  //console.log("In DoStartScreen");
  ResetArena();
  textSize(25);
  fill("white");
  text("Level: " + currentLevel, 25,50);
  text("Lives: " + lives,25,100);
  text("Score: " + score,25,150);
  text("Press Enter To Start",25,200);
  
  if (keyDown("enter")) {
    currentScreen="arena";
  }
}


function RenderArena() {
  //console.log("Cannon State:"+ cannonIsFiring);
  DoCollisionCheck();

 

  DoPlayerMovement(); 
  DoCannonFire();
  DoBulletFire();

  DoCannonMovement();
  DoQuotileMovement();
  DoMissileMovement();
  DoBulletMovement();
  GameWin();
  
  drawSprites();
}

var delayTime=0;
function RenderQuotileDeath(){
  
  textSize(25);
  fill("white");
  text("Level: " + currentLevel, 25,50);
  text("Lives: " + lives,25,100);
  text("Score: " + score,25,150);

  fill("red");
  text("You Killed the Quotile!",25,200);
  
  while(World.seconds < delayTime+5){
    
  }
  fill("white");
  text("Press Enter To Continue",25,250);
  if (keyDown("enter")) {
    currentScreen="arena";
  }
}

function DoQuotileDeath(){
  delayTime=World.seconds;

  ResetArena(); 
  currentLevel=currentLevel+1;
  score=score=50;
  currentScreen="quotileDeath";
}

function DoPlayerDeath(){
  ResetArena(); 
  
  lives=lives-1;
  if(lives == 0){
    currentScreen="gameover";
    delayTime=World.seconds;
  }else{
    currentScreen="startScreen";

  }
}
function RenderGameOver(){
  //console.log("In DoGameOver");
  ResetArena();
  
  textSize(25);
  fill("white");
  
  text("Game Over", 25,50);
  text("Final Score: "+ score, 25,100);
  
  while(World.seconds< delayTime+10){
    //do nothing
  }

  text("Press Enter To Start Over",25,150);
  
  

  if(keyDown("enter")){
    lives=3;
    currentLevel=1;
    score=0;
    currentScreen="startScreen";
  }
}


//startScreeen, arena, quotiledeath, gameover



function DoPlayerMovement() {
  
  if (keyDown("up")) {
    fly.setAnimation("flyUp");
    fly.y = fly.y - 5;
  } else if ((keyDown("down"))) {
    fly.setAnimation("flyDown");
    fly.y = fly.y + 5;
  } else if ((keyDown("left"))) {
    fly.setAnimation("flyLeft");
    fly.x = fly.x - 5;
  } else if ((keyDown("right"))) {
    fly.setAnimation("flyRight");
    fly.x = fly.x + 5;
  } else if (keyDown("k")){
    DoPlayerDeath();
  } else if (keyDown("l")){
    currentLevel=currentLevel+1;
  }else if(keyDown("p")){
    DoQuotileDeath();
  }
  
  if(fly.y<0){
      fly.y=400;    
  }
  
  if(fly.y>400){
    fly.y=0;
  }
  if(fly.x<15){
    fly.x=15;
  }
  if(fly.x>390){
    fly.x=390;
  }
   

  //Do Player wrap around....  
}

function DoQuotileMovement() {
  if ((quotile.y) <= 25) {
    quotileVelocity=-quotileVelocity;
  }
  if (quotile.y >= 375) {
    quotileVelocity=-quotileVelocity;
  }

  quotile.y=quotile.y+(quotileVelocity* currentLevel);   
}

var deltaX = 0; // change in x between the fly and the missile
var deltaY = 0; // change in y between the fly and the missile
var shipAngle=0; //angle between the ship and the missile
function DoMissileMovement(){

  //based off code found here 
  //https://studio.code.org/projects/gamelab/dz-de22XR4Xr2W6MFJfg64mTZKnNe0IwFwE76NyfVIw/view
  deltaX = fly.x - missile.x;
  deltaY = fly.y - missile.y;
  
  var shipAngle = Math.atan(deltaY / deltaX); 
  if (deltaX < 0) {
    // the arctan assumes that the angle is in the first or 
    // fourth quadrants, so if it's in the second or third
    // (i.e. deltaX/cosign is negative) correct by adding PI
    shipAngle = shipAngle + Math.PI;
  }
  missile.velocityX = Math.cos(shipAngle)* missileVelocity* currentLevel;
  missile.velocityY = Math.sin(shipAngle)* missileVelocity* currentLevel;

}

function DoCannonMovement(){
  if(cannonIsFiring==true){
    cannon.x=cannon.x+cannonVelocity;
  }else{
    cannon.y=fly.y;
  }
  
  if(cannon.x >400){
    cannon.x=10;
    cannon.y=fly.y;
    cannonIsFiring=false;
    cannon.visible=false;
  }
}

function DoCannonFire(){
  //Don't allow cannon fire when in the safe wall
  if(fly.isTouching(safeWall) && safeWall.visible==true){
    return;
  }    
  
  if(cannonIsFiring==false && keyDown("space")==true && cannon.visible==true){
    cannonIsFiring=true;
  }
}

function DoCollisionCheck(){
  if(fly.isTouching(missile)){
    if(fly.isTouching(safeWall) && safeWall.visible==true){
      //eat the check
    }
    else{
      DoPlayerDeath();
    }
  }
  
  if(cannonIsFiring==true && fly.isTouching(cannon)){
    DoPlayerDeath();
  }
  if(fly.isTouching(quotile)){
    cannon.visible=true;
  }
  if(cannon.isTouching(quotile)){
    DoQuotileDeath();
  }
}

function DoBulletFire() {
  
}

function DoBulletMovement() {
  bullet.x = fly.x;
  bullet.y = fly.y;
}

function GameWin() {
  if (currentLevel == 3) {
    
  }
}
