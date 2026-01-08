function Credits() {
    this.buttons = [];

    this.setup = function() {
        clear();
        textFont(font);
        this.buttons = [
            new Button(width/2, height - 80, 'Back', () => {
                this.sceneManager.showScene(Loadscreen);
            })
        ];
    };

    this.draw = function() {
        background(fightimg);

        fill(255, 215, 0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text('CREDITS', width/2, 150);


        fill(200, 200, 255);
        textSize(20);
        textAlign(CENTER);

        const credits = [
            'Game Design: Tristan de Groot',
            'Programming: Tristan de Groot',
            'Art: Tristan de Groot',
            'Music: Tristan de Groot',
            ''
        ];

        let y = 250;
        credits.forEach(line => {
            text(line, width/2, y);
            y += 30;
        });


        textSize(16);
        text('Version 0.0.1', width/2, 450);


        this.buttons.forEach(button => button.draw());
    };

    this.mousePressed = function() {
        this.buttons.forEach(button => button.checkClick());
    };

    this.mouseMoved = function() {
        this.buttons.forEach(button => button.updateHover());
    };
}