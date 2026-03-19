let sceneManager;
let muziek = [];
let musicData;

function preload() {
    fightimg = loadImage('public/assets/img/fight.gif');
    font = loadFont('public/assets/fonts/AvenirLTProBook.otf')
    musicData = loadJSON("public/assets/json/music.json", () => {
        for (let i = 0; i < musicData.Muziek.length; i++) {
            const sound = loadSound('public/assets/music/' + musicData.Muziek[i].filename, () => sound.setVolume(0.3));
            muziek.push(sound);
        }
    });
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
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