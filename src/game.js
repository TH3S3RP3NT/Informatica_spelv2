function Game() {
    this.send = null;
    this.gameStarted = false;
    this.buttons = [];
    this.nameSaved = false;
    let Username;

    const inputWidth = 300;
    const inputHeight = 30;

    this.setup = function () {
        clear();
        textFont(font);
        Username = createInput();
        Username.position(width/2, height/2+200);
        Username.size(inputWidth, inputHeight);
        Username.style('text-align', 'center');
        Username.hide();
        this.buttons = [
            new Button(width/2, height / 3 + 50, 'Begin!', () => {
                this.gameStarted = true;
            }),
            new Button(width/2, height / 2 + 20, 'Opslaan', () => {
                this.save();
            })
        ];

    }

    this.draw = function () {
        background(fightimg);
        fill(255);
        this.buttons.forEach(button => button.draw());

        if (!this.gameStarted) {
            text("Klaar?", width / 2, height / 3);
        } else {

            text("Voer je naam in:", width/2, height/3 + 20);
            Username.show();






            if (this.nameSaved) {
                sceneManager.showScene(Leaderboard);


            }
        }
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

    this.mouseMoved = function() {
        this.buttons.forEach(button => button.updateHover());
    };

    this.save = function() {
        storeItem('username', Username.value().trim());
        this.nameSaved = true;
        Username.hide();
    }
}