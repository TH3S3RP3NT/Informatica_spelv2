function Game() {
    this.gameStarted = false;
    this.nameSaved = false;
    let Username;
    let BeginButton;
    let SaveButton;

    const inputWidth = 300;
    const inputHeight = 30;


    this.setup = function () {
        clear();
        textFont(font);
        Username = createInput();
        Username.position(width / 2 - 150, height / 3 + 50);
        Username.size(inputWidth, inputHeight);
        Username.style('text-align', 'center');
        Username.hide();
        BeginButton = createButton('Begin');
        BeginButton.position(width / 2 - 100, height / 3 + 100);
        BeginButton.size(200, 50);
        BeginButton.mousePressed(this.gameStarted = true);
        BeginButton.hide();
        SaveButton = createButton('Opslaan');
        SaveButton.position(width / 2 - 100, height / 3 + 100);
        SaveButton.size(200, 50);
        SaveButton.mousePressed(this.save.bind(this));
        SaveButton.hide();

    }

    this.draw = function () {
        background(fightimg);
        fill(255);

        if (!this.gameStarted) {
            text("Klaar?", width / 2, height / 3);
            BeginButton.show();
        } else {
            BeginButton.hide();
            text("Voer je naam in:", width / 2, height / 3 + 20);
            Username.show();
            SaveButton.show();


            if (this.nameSaved) {
                SaveButton.hide();
                Username.hide();
                sceneManager.showScene(Dash);
            }
        }
    };



    this.save = function () {
        storeItem('username', Username.value().trim());
        this.nameSaved = true;
        Username.hide();
    }
}