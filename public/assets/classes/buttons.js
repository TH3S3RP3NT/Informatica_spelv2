class Button {
    constructor(x, y, label, action) {
        this.x = x;
        this.y = y;
        this.label = label;
        this.action = action;
        this.width = 200;
        this.height = 50;
        this.hover = false;
    }

    draw() {
        if (this.hover) fill(100, 100, 200);
        else fill(70, 70, 150);

        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height, 10);

        stroke(255, 215, 0);
        strokeWeight(2);
        noFill();
        rect(this.x, this.y, this.width, this.height, 10);
        noStroke();

        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.label, this.x, this.y);

        this.updateHover();
    }

    updateHover() {
        this.hover = (
            mouseX > this.x - this.width/2 &&
            mouseX < this.x + this.width/2 &&
            mouseY > this.y - this.height/2 &&
            mouseY < this.y + this.height/2
        );

        if (this.hover) cursor(HAND);
        else cursor(ARROW);
    }

    checkClick() {
        if (this.hover) this.action();
    }
}

class ToggleButton extends Button {
    constructor(x, y, label, initialState) {
        super(x, y, label, () => this.toggle());
        this.state = initialState;
        this.updateLabel();
    }

    toggle() {
        this.state = !this.state;
        this.updateLabel();
    }

    updateLabel() {
        const prefix = this.label.split(':')[0];
        this.label = prefix + ': ' + (this.state ? 'ON' : 'OFF');
    }

    draw() {
        if (this.state) {
            if (this.hover) fill(80, 180, 80);
            else fill(60, 140, 60);
        } else {
            if (this.hover) fill(180, 80, 80);
            else fill(140, 60, 60);
        }

        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height, 10);

        stroke(255, 215, 0);
        strokeWeight(2);
        noFill();
        rect(this.x, this.y, this.width, this.height, 10);
        noStroke();

        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.label, this.x, this.y);

        this.updateHover();
    }
}