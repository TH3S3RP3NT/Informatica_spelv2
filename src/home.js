function Loadscreen() {
    this.buttons = [];
    let storedPermission = getItem('IMP');
    let isMusicPlaying = storedPermission === null || storedPermission === undefined ? true : Boolean(storedPermission);
    if (storedPermission === null || storedPermission === undefined) {
        storeItem('IMP', true);
    }
    let currentTrackIndex = getItem('CTI') || 0;

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
        if (Boolean(getItem('IMP'))) {
            this.playMusic();
        }
    };

    this.draw = function() {
        background(fightimg);

        fill(255, 215, 0);
        textSize(64);
        textAlign(CENTER, CENTER);
        text('Informatica Game v2', width/2, 150);


        fill(255, 200, 255);
        textSize(24);
        text('Nieuw jaar, andere game!', width/2, 220);

        if (Boolean(getItem('IMP')) && !isMusicPlaying) {
            this.playMusic();
        }

        this.buttons.forEach(button => button.draw());
    };

    this.mousePressed = function() {
        this.buttons.forEach(button => button.checkClick());
        this.playMusic();
    };

    this.mouseMoved = function() {
        this.buttons.forEach(button => button.updateHover());
    };

    this.playMusic = function() {
        if (muziek.length === 0) return;
        const allowed = Boolean(getItem('IMP'));
        if (!allowed) {
            isMusicPlaying = false;
            return;
        }
        getAudioContext().resume();
        if (!isMusicPlaying) {
            const track = muziek[currentTrackIndex] || muziek[0];
            if (!track) return;
            track.setVolume(0.3);
            track.play();
            track.onended(this.playNextTrack.bind(this));
            isMusicPlaying = true;
            storeItem('IMP', true);
            storeItem('CTI', currentTrackIndex);
        }
    };

    this.playNextTrack = function() {
        if (!isMusicPlaying || muziek.length === 0) return;

        const current = muziek[currentTrackIndex];
        if (current && current.isPlaying()) {
            current.stop();
        }

        currentTrackIndex = (currentTrackIndex + 1) % muziek.length;
        storeItem('CTI', currentTrackIndex);

        const next = muziek[currentTrackIndex];
        if (next) {
            next.setVolume(0.3);
            next.play();
            next.onended(this.playNextTrack.bind(this));
        }
    };
}