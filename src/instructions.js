function Instructions() {
    this.buttons = [];

    this.setup = function () {
        clear();
        textFont(font);

        this.buttons = [new Button(width / 2, height - 80, 'Back', () => {
            this.sceneManager.showScene(Loadscreen);
        })];
    };

    this.draw = function () {
        background(fightimg);

        fill(255, 215, 0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text('HOW TO PLAY', width / 2, 120);

        fill(200, 200, 255);
        textSize(20);
        text('Quick tips to get you started', width / 2, 165);

        const tips = ['Goal: reach the target score shown in the HUD. Each win raises the next target by +100.', 'Move with Arrow Keys or WASD. Press Space/Up/W to jump. Hold Down/S to duck.', 'Land on platforms, avoid spikes. Collisions cost health; hit 0 and it is game over.', 'Grab coins for +10 points each. They often sit above platforms or along the ground.', 'Press R after a run to restart quickly, or L to jump straight to the leaderboard.'];

        const startY = 230;
        const lineHeight = 34;
        textAlign(CENTER, TOP);
        textSize(18);
        fill(255);
        tips.forEach((tip, index) => {
            text(`• ${tip}`, width / 2, startY + index * lineHeight);
        });

        this.buttons.forEach(button => button.draw());
    };

    this.mousePressed = function () {
        this.buttons.forEach(button => button.checkClick());
    };

    this.mouseMoved = function () {
        this.buttons.forEach(button => button.updateHover());
    };
}
