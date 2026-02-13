function Settings() {
    this.buttons = [];
    this.toggles = [];
    let currentTrackIndex = getItem('CTI');
    let isMusicPlaying = getItem('IMP');

    this.setup = function() {
        clear();
        textFont(font);
        this.buttons = [
            new Button(width/2, height - 80, 'Back', () => {
                this.sceneManager.showScene(Loadscreen);
            })
        ];

        this.toggles = [
            new ToggleButton(width/2, height/2 - 30, 'Music: ON', true, (state) => {
                if (state && isMusicPlaying) {
                    muziek[currentTrackIndex].play();
                } else if (!state && isMusicPlaying) {
                    muziek[currentTrackIndex].pause();
                }
            }),
            new ToggleButton(width/2, height/2 + 30, 'Sound: ON', true)
        ];
    };

    this.draw = function() {
        background(fightimg);

        fill(255, 215, 0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text('SETTINGS', width/2, 150);


        fill(200, 200, 255);
        textSize(20);
        text('Adjust your game preferences', width/2, 200);


        this.toggles.forEach(toggle => toggle.draw());


        this.buttons.forEach(button => button.draw());
    };

    this.mousePressed = function() {
        this.buttons.forEach(button => button.checkClick());
        this.toggles.forEach(toggle => toggle.checkClick());
    };

    this.mouseMoved = function() {
        this.buttons.forEach(button => button.updateHover());
        this.toggles.forEach(toggle => toggle.updateHover());
    };
}