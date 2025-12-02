let mgr;

function preload(){
 backgroundimg = loadImage('public/assets/img/background.gif');
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    mgr = new SceneManager();
    mgr.wire();
    mgr.showScene(Loadscreen);
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    mgr.draw();
}

function keyPressed() {
    mgr.handleEvent("keyPressed");
}

function mousePressed() {
    mgr.handleEvent("mousePressed");
}

function mouseReleased() {
    mgr.handleEvent("mouseReleased");
}
function mouseMoved() {
    mgr.handleEvent("mouseMoved");
}