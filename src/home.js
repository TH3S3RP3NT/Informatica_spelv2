function Loadscreen() {
    this.buttons = [];

    this.setup = function() {
        clear();
        textFont(font);
        musicController.init();
        const startY = height / 2 - 100;
        const stepY = 70;
        this.buttons = [new Button(width / 2, startY, 'Start Game', () => {
                this.sceneManager.showScene(Game);
        }), new Button(width / 2, startY + stepY, 'How to Play', () => {
            this.sceneManager.showScene(Instructions);
        }), new Button(width / 2, startY + stepY * 2, 'Settings', () => {
                this.sceneManager.showScene(Settings);
        }), new Button(width / 2, startY + stepY * 3, 'Credits', () => {
                this.sceneManager.showScene(Credits);
        }), new Button(width / 2, startY + stepY * 4, 'Leaderboard', () => {
                this.sceneManager.showScene(Leaderboard);
            })
        ];
        if (musicController.isAllowed) {
            musicController.play();
        }
    };

    this.draw = function() {
        background(fightimg);

        fill(255, 215, 0);
        textSize(64);
        textAlign(CENTER, CENTER);
        text('Platform Pulse', width / 2, 150);


        fill(255, 200, 255);
        textSize(24);
        text('Dash, jump, and grab coins for the leaderboard!', width/2, 220);

        if (musicController.isAllowed && !musicController.isPlaying) {
            musicController.play();
        }

        this.buttons.forEach(button => button.draw());
    };

    this.mousePressed = function() {
        this.buttons.forEach(button => button.checkClick());
        musicController.play();
    };

    this.mouseMoved = function() {
        this.buttons.forEach(button => button.updateHover());
    };
}