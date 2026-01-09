function Game() {
    this.test1 = null;
    this.test2 = null;
    this.send = null;

    this.setup = function () {
        clear();
        textFont(font);


        if (!this.test1) {
            this.test1 = createInput();
            this.test1.position(width / 2 + 20, height / 2 + 60);
            this.test1.attribute('placeholder', 'Enter username');
            this.test1.show();
        } else {
            this.test1.position(width / 2 + 20, height / 2 + 60);
            this.test1.value('');
            this.test1.show();
        }

        if (!this.test2) {
            this.test2 = createInput();
            this.test2.position(width / 2 + 20, height / 2 + 110);
            this.test2.attribute('placeholder', 'Enter score');
            this.test2.show();
        } else {
            this.test2.position(width / 2 + 20, height / 2 + 110);
            this.test2.value('');
            this.test2.show();
        }

        if (!this.send) {
            this.send = createButton('Send Score');
            this.send.position(width / 2 + 20, height / 2 + 140);
            this.send.mousePressed(this.sendScore.bind(this));
            this.send.show();
        } else {
            this.send.position(width / 2 + 20, height / 2 + 140);
            this.send.show();
        }
    };

    this.draw = function () {
        background(fightimg);
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text('GAME SCENE', width / 2, height / 2 - 100);


        textSize(18);
        textAlign(RIGHT, CENTER);
        text('Username:', width / 2, height / 2 + 60);
        text('Score:', width / 2, height / 2 + 110);
    };

    this.sendScore = function () {
        const userVal = (this.test1.value() || '').trim();
        const scoreRaw = (this.test2.value() || '').trim();
        const scoreVal = parseInt(scoreRaw, 10);

        if (!userVal) {
            alert('Please enter a username!');
            return;
        }

        if (isNaN(scoreVal) || scoreVal < 0) {
            alert('Please enter a valid score!');
            return;
        }

        let apiUrl = 'https://api.tristan.informatica-corlaer.nl/store.php';
        let fullUrl = `${apiUrl}?u=${encodeURIComponent(userVal)}&s=${scoreVal}`;

        console.log("Sending to:", fullUrl);

        httpGet(fullUrl, 'text', function (response) {
            console.log("Server Response:", response);


            if (this.test1) {
                this.test1.value('');
                this.test1.hide();
            }
            if (this.test2) {
                this.test2.value('');
                this.test2.hide();
            }
            if (this.send) this.send.hide();

            this.hideAllStrayInputs();

            setTimeout(() => {
                sceneManager.showScene(Leaderboard);
            }, 500);
        }.bind(this));
    };

    this.hideAllStrayInputs = function() {
        const inputs = document.querySelectorAll('input, button');
        inputs.forEach(el => {
            if (el.style && el !== this.test1.elt && el !== this.test2.elt && el !== this.send.elt) {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            }
        });
    };

    this.cleanup = function() {
        if (this.test1) {
            this.test1.hide();
            this.test1.value('');
        }
        if (this.test2) {
            this.test2.hide();
            this.test2.value('');
        }
        if (this.send) this.send.hide();

        this.hideAllStrayInputs();
    };
}