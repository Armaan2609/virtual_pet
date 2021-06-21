//Create variables here
var dog;
var happyDog;
var database;
var foodS;
var food;
var foodStock;
//var foodObj;
var lastFed,fedTime,feed,adFood;
var gameState;
var bedroom;
var garden;
var washroom;
var readState;



function preload()
{
	//load images here
  dogImage1=loadImage("images/Dog.png");
  happyDog=loadImage("images/happyDog.png");
  sadDog=loadImage("images/dogImg.png");
bedroomImg=loadImage("images/Bed Room.png");
gardenImg=loadImage("images/Garden.png");
 washroomImg=loadImage("images/Wash Room.png");
  

  ;
}

function setup() {
  database = firebase.database();
	createCanvas(400, 600);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  food=new Food();

  foodStock=database.ref("food");
  foodStock.on("value",readStock);


  dog=createSprite(200,500);
  dog.addImage(dogImage1);
  dog.scale=0.2;

  feed=createButton("Feed the Dog");
  feed.position(390,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(590,95);
  addFood.mousePressed(addFoods);
  

 
   

  foodStock=database.ref("Food");
  foodStock.on("value",readStock)
  

 
}



function draw() {  
background("green");

food.display();  

fedTime=database.ref("FeedTime");
fedTime.on("value",function(data){
  lastFed=data.val();
})
fill(255,255,254);
textSize(15);
if(lastFed>=12){
text("Last Feed: "+lastFed%12 + "PM",140,30)
}else if(lastFed==0){
text("Last Feed:12 AM",70,30)
}else {
  text("Last Feed:"+lastFed + "AM",70,30)}


  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImage1);
  }

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    food.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    food.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    food.washroom();
  }else {
    update("Hungry")
    food.display();
  }

  drawSprites();
  

}

function readStock(data){
  foodS=data.val();
  food.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  food.updateFoodStock(food.getFoodStock()-1);
  database.ref("/").update({
    Food:food.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}