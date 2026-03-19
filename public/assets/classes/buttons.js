class Button {
    constructor(x, y, label, action) {
        this.x = x;
        this.y = y;
        this.label = label;
        this.action = action;
        this.width = 200;
        this.height = 50;
        this.hover = false;
        this.visible = true;
        this.enabled = true;
    }

    draw() {
        if (!this.visible) return;

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
        if (!this.visible || !this.enabled) {
            this.hover = false;
            cursor(ARROW);
            return;
        }

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
        if (this.visible && this.enabled && this.hover) {
            this.action();
        }
    }


    hide() {
        this.visible = false;
        this.hover = false;
    }

    show() {
        this.visible = true;
    }

    toggleVisibility() {
        this.visible = !this.visible;
        if (!this.visible) this.hover = false;
    }

    isVisible() {
        return this.visible;
    }


    disable() {
        this.enabled = false;
        this.hover = false;
    }

    enable() {
        this.enabled = true;
    }
}

class ToggleButton extends Button {
    constructor(x, y, label, initialState, onToggle) {
        super(x, y, label, () => this.toggle());
        this.baseLabel = label.split(':')[0];
        this.state = initialState;
        this.onToggle = onToggle;
        this.updateLabel();
    }

    toggle() {
        this.state = !this.state;
        this.updateLabel();

        if (this.onToggle) {
            this.onToggle(this.state);
        }
    }

    updateLabel() {
        this.label = `${this.baseLabel}: ${this.state ? 'ON' : 'OFF'}`;
    }


    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = newState;
        this.updateLabel();
    }
}