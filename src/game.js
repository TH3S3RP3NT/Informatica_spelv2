function Game() {
    this.setup = function () {
        clear();
        textFont(font);
        // create inputs/buttons once (guard so repeated setup() calls don't recreate)
        if (!this.test1) {
            this.test1 = createInput();
            this.test1.position(width / 2 + 20, height / 2 + 60);
        }

        if (!this.test2) {
            this.test2 = createInput();
            this.test2.position(width / 2 + 20, height / 2 + 110);
        }

        if (!this.send) {
            this.send = createButton('Send');
            this.send.position(width / 2 + 20, height / 2 + 140);
            // bind the handler so `this` inside sendScore is the Game instance
            this.send.mousePressed(this.sendScore.bind(this));
        }
    }


    this.draw = function () {
        background(fightimg);

        text('GAME SCENE', width / 2, height / 2);


    }
    this.sendScore = function () {

        const userVal = (this.test1.value() || '').trim();
        const scoreRaw = (this.test2.value() || '').trim();
        const scoreVal = parseInt(scoreRaw, 10);


        let apiUrl = 'https://api.tristan.informatica-corlaer.nl/store.php';
        let fullUrl = `${apiUrl}?u=${encodeURIComponent(userVal)}&s=${scoreVal}`;

        console.log("Sending to:", fullUrl);

        httpGet(fullUrl, 'text', function (response) {
            console.log("Server Response:", response);
        });

    }
}