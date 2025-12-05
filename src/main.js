let sceneManager;

function preload(){
 fightimg = loadImage('public/assets/img/fight.gif');
 font = loadFont('public/assets/fonts/AvenirLTProBook.otf')
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    sceneManager = new SceneManager();
    sceneManager.wire();
    sceneManager.showScene(Loadscreen);
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    sceneManager.draw();
}

function keyPressed() {
    sceneManager.handleEvent("keyPressed");
}

function mousePressed() {
    sceneManager.handleEvent("mousePressed");
}

function mouseReleased() {
    sceneManager.handleEvent("mouseReleased");
}
function mouseMoved() {
    sceneManager.handleEvent("mouseMoved");
}