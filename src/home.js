function Loadscreen() {
    this.buttons = [];
    let currentTrackIndex = 0;
    let isMusicPlaying = false;

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
            }),
            new Button(width/2, height/2 + 150, 'Leaderboard', () => {
                this.sceneManager.showScene(Leaderboard);
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
        storeItem('CTI', currentTrackIndex);
        storeItem('IMP', isMusicPlaying);
    };

    this.mousePressed = function() {
        this.buttons.forEach(button => button.checkClick());
        this.playMusic();
    };

    this.mouseMoved = function() {
        this.buttons.forEach(button => button.updateHover());
    };
    this.playMusic = function() {
        if (!isMusicPlaying && muziek.length > 0) {
            muziek[currentTrackIndex].play();
            isMusicPlaying = true;
            muziek[currentTrackIndex].onended(this.playNextTrack.bind(this));
        }
    }

    this.playNextTrack = function() {
        if (muziek[currentTrackIndex] && muziek[currentTrackIndex].isPlaying()) {
            muziek[currentTrackIndex].stop();
        }

        currentTrackIndex++;
        if (currentTrackIndex >= muziek.length) {
            currentTrackIndex = 0;
        }

        if (muziek[currentTrackIndex]) {
            muziek[currentTrackIndex].play();
            muziek[currentTrackIndex].onended(this.playNextTrack.bind(this));
        }
    }
}