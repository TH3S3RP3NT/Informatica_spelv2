function Settings() {
    this.buttons = [];
    this.toggles = [];
    let currentTrackIndex = getItem('CTI') || 0;
    let isMusicPlaying = Boolean(getItem('IMP'));

    const playNext = () => {
        if (!isMusicPlaying || muziek.length === 0) return;
        currentTrackIndex = (currentTrackIndex + 1) % muziek.length;
        storeItem('CTI', currentTrackIndex);
        const next = muziek[currentTrackIndex];
        if (next) {
            next.setVolume(0.3);
            next.play();
            next.onended(playNext);
        }
    };

    this.setup = function() {
        clear();
        textFont(font);
        this.buttons = [
            new Button(width/2, height - 80, 'Back', () => {
                this.sceneManager.showScene(Loadscreen);
            })
        ];

        this.toggles = [
            new ToggleButton(width/2, height/2 - 30, 'Music: ON', isMusicPlaying, (state) => {
                const track = muziek[currentTrackIndex] || muziek[0];
                if (!track) return;

                if (state) {
                    getAudioContext().resume();
                    track.setVolume(0.3);
                    if (!track.isPlaying()) {
                        track.play();
                    }
                    track.onended(playNext);
                    isMusicPlaying = true;
                    storeItem('IMP', true);
                    storeItem('CTI', currentTrackIndex);
                } else {
                    track.stop();
                    isMusicPlaying = false;
                    storeItem('IMP', false);
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