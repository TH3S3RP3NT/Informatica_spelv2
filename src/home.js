function Loadscreen() {
    this.buttons = [];

    this.setup = function() {
        clear();
        textFont(font);
        this.buttons = [
            new Button(width/2, height/2 - 60, 'Start Game', () => {
                this.sceneManager.showScene(Game);
            }),
            new Button(width/2, height/2 + 10, 'Settings', () => {
                this.sceneManager.showScene(Settings);
            }),
            new Button(width/2, height/2 + 80, 'Credits', () => {
                this.sceneManager.showScene(Credits);
            })
        ];
    };

    this.draw = function() {
        background(fightimg);

        fill(255, 215, 0);
        textSize(64);
        textAlign(CENTER, CENTER);
        text('Informatica Game v2', width/2, 150);


        fill(255, 200, 255);
        textSize(24);
        text('Ondertitel', width/2, 220);


        this.buttons.forEach(button => button.draw());
    };

    this.mousePressed = function() {
        this.buttons.forEach(button => button.checkClick());
    };

    this.mouseMoved = function() {
        this.buttons.forEach(button => button.updateHover());
    };
}