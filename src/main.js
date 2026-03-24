let sceneManager;
let muziek = [];
let musicData;
let coinSound;

const musicController = {
    currentIndex: 0, isAllowed: true, isPlaying: false, initialized: false,

    init() {
        if (this.initialized) return;
        const storedIdx = Number(getItem('CTI'));
        if (!Number.isNaN(storedIdx)) {
            this.currentIndex = Math.max(0, storedIdx);
        }
        const storedAllowed = getItem('IMP');
        if (storedAllowed === null || storedAllowed === undefined) {
            this.isAllowed = true;
            storeItem('IMP', true);
        } else {
            this.isAllowed = Boolean(storedAllowed);
        }
        this.initialized = true;
    },

    currentTrack() {
        if (!muziek.length) return null;
        if (this.currentIndex >= muziek.length) this.currentIndex = 0;
        return muziek[this.currentIndex];
    },

    play() {
        this.init();
        const storedAllowed = getItem('IMP');
        if (storedAllowed !== null && storedAllowed !== undefined) {
            this.isAllowed = Boolean(storedAllowed);
        }

        if (!this.isAllowed || !muziek.length) {
            this.isPlaying = false;
            return;
        }

        const track = this.currentTrack();
        if (!track) return;

        this.stopOthers(track);

        try {
            getAudioContext().resume();
        } catch (e) {
        }

        track.setVolume(0.3);
        if (!track.isPlaying()) {
            try {
                track.play();
            } catch (e) {
                return;
            }
        }

        track.onended(() => {
            if (!this.isPlaying || !this.isAllowed) return;
            this.next();
        });

        this.isPlaying = true;
        storeItem('IMP', true);
        storeItem('CTI', this.currentIndex);
    },

    pause() {
        const track = this.currentTrack();
        if (track) {
            if (typeof track.pause === 'function') {
                track.pause();
            } else {
                track.stop();
            }
            track.onended(() => {
            });
        }
        this.isPlaying = false;
    },

    stop() {
        this.pause();
        this.isAllowed = false;
        storeItem('IMP', false);
    },

    allowAndPlay() {
        this.isAllowed = true;
        storeItem('IMP', true);
        this.play();
    },

    next() {
        if (!muziek.length) return;
        this.currentIndex = (this.currentIndex + 1) % muziek.length;
        storeItem('CTI', this.currentIndex);
        if (this.isPlaying && this.isAllowed) {
            this.play();
        }
    },

    stopOthers(track) {
        muziek.forEach(t => {
            if (t && t !== track && typeof t.isPlaying === 'function' && t.isPlaying()) {
                t.stop();
                t.onended(() => {
                });
            }
        });
    }
};

function preload() {
    fightimg = loadImage('public/assets/img/fight.gif');
    font = loadFont('public/assets/fonts/AvenirLTProBook.otf')
    musicData = loadJSON("public/assets/json/music.json", () => {
        for (let i = 0; i < musicData.Muziek.length; i++) {
            const sound = loadSound('public/assets/music/' + musicData.Muziek[i].filename, () => sound.setVolume(0.3));
            muziek.push(sound);
        }
    });
    coinSound = loadSound('public/assets/music/coin.mp3', () => coinSound.setVolume(0.5));
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    musicController.init();
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