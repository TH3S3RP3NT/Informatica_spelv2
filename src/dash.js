function Dash() {
    const START_X = 100;
    let game = {
        player: null,
        platforms: [],
        coins: [],
        obstacles: [],
        score: 0,
        gameOver: false,
        win: false,
        gravity: 0.5,
        groundY: 0,
        highScore: 0,
        lastScore: 0,
        _scoreSaved: false,
        scrollSpeed: 3.2,
        distance: 0,
        targetScore: 100
    };

    game.player = {
        x: START_X,
        y: 0,
        width: 30,
        height: 40,
        velocityX: 0,
        velocityY: 0,
        speed: 5,
        jumpPower: -12,
        health: 100,
        isDucking: false,
        canJump: true,
        color: [255, 0, 0],
        prevX: 0,
        prevY: 0
    };

    this.setup = function () {
        game.groundY = height - 50;
        game.player.x = START_X;
        game.player.y = game.groundY - game.player.height;
        game.player.velocityX = 0;
        game.player.velocityY = 0;
        game.player.prevX = game.player.x;
        game.player.prevY = game.player.y;

        try {
            const storedHigh = parseInt(localStorage.getItem('highScore'));
            if (!isNaN(storedHigh)) game.highScore = storedHigh;
            const storedLast = parseInt(localStorage.getItem('lastScore'));
            if (!isNaN(storedLast)) game.lastScore = storedLast;
        } catch (e) {
        }

        this.generateLevel();

        game.score = 0;
        game.player.health = 100;
        game.gameOver = false;
        game.win = false;
        game._scoreSaved = false;
        game.distance = 0;
    };

    this.draw = function () {
        background(fightimg);

        rectMode(CORNER);
        ellipseMode(CENTER);

        if (game.gameOver) {
            this.displayGameOver();
            return;
        }

        if (game.win) {
            this.displayWin();
            return;
        }

        this.syncGroundWithCanvas();

        this.handleInput();

        this.applyPhysics();

        this.autoScroll();

        this.checkCollisions();

        this.drawGame();

        this.displayHUD();

        this.checkWinCondition();
    };

    this.handleInput = function () {
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            game.player.velocityX = -game.player.speed;
        } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            game.player.velocityX = game.player.speed;
        } else {
            game.player.velocityX *= 0.7;
        }

        if ((keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32)) && game.player.canJump) {
            game.player.velocityY = game.player.jumpPower;
            game.player.canJump = false;
        }

        const wantsDuck = (keyIsDown(DOWN_ARROW) || keyIsDown(83));
        const bottom = game.player.y + game.player.height;
        game.player.isDucking = wantsDuck;
        const targetHeight = wantsDuck ? 20 : 40;
        if (targetHeight !== game.player.height) {
            game.player.height = targetHeight;
            game.player.y = bottom - game.player.height;
        }
    };

    this.applyPhysics = function () {
        game.player.velocityY += game.gravity;

        game.player.prevX = game.player.x;
        game.player.prevY = game.player.y;

        game.player.x += game.player.velocityX;
        game.player.y += game.player.velocityY;

        game.player.x = constrain(game.player.x, 0, width - game.player.width);
    };

    this.autoScroll = function () {
        const dx = game.scrollSpeed;
        game.distance += dx;

        for (let platform of game.platforms) {
            if (!platform.isGround) {
                platform.x -= dx;
            }
        }
        for (let coin of game.coins) {
            coin.x -= dx;
        }
        for (let obstacle of game.obstacles) {
            obstacle.x -= dx;
        }

        this.pruneOffscreenContent();
        this.recycleAndExtendPlatforms();
        this.ensureCoinPool();
        this.ensureObstaclePool();
    };

    this.checkCollisions = function () {
        game.player.canJump = false;
        const epsilon = 0.1;

        for (let platform of game.platforms) {
            if (!this.rectCollision(game.player.x, game.player.y, game.player.width, game.player.height, platform.x, platform.y, platform.width, platform.height)) {
                continue;
            }

            const prevBottom = game.player.prevY + game.player.height;
            const prevTop = game.player.prevY;
            const prevRight = game.player.prevX + game.player.width;
            const prevLeft = game.player.prevX;

            const landingFromAbove = prevBottom <= platform.y + epsilon && game.player.velocityY >= 0;
            const hittingHead = prevTop >= platform.y + platform.height - epsilon && game.player.velocityY <= 0;
            const hittingFromLeft = prevRight <= platform.x + epsilon && game.player.velocityX > 0;
            const hittingFromRight = prevLeft >= platform.x + platform.width - epsilon && game.player.velocityX < 0;

            if (landingFromAbove) {
                game.player.y = platform.y - game.player.height;
                game.player.velocityY = 0;
                game.player.canJump = true;
            } else if (hittingHead) {
                game.player.y = platform.y + platform.height;
                game.player.velocityY = 0;
            } else if (hittingFromLeft) {
                game.player.x = platform.x - game.player.width;
                game.player.velocityX = 0;
            } else if (hittingFromRight) {
                game.player.x = platform.x + platform.width;
                game.player.velocityX = 0;
            }
        }

        for (let coin of game.coins) {
            if (!coin.collected && this.rectCollision(game.player.x, game.player.y, game.player.width, game.player.height, coin.x, coin.y, coin.size, coin.size)) {
                coin.collected = true;
                game.score += 10;
                this.playCoinSound();
            }
        }

        for (let obstacle of game.obstacles) {
            if (this.rectCollision(game.player.x, game.player.y, game.player.width, game.player.height, obstacle.x, obstacle.y, obstacle.width, obstacle.height)) {
                game.player.health -= 15;
                let index = game.obstacles.indexOf(obstacle);
                if (index > -1) {
                    game.obstacles.splice(index, 1);
                }

                if (obstacle.type === 'ground') {
                    game.player.velocityY = -5;
                } else {
                    game.player.velocityY = 5;
                }

                if (game.player.health <= 0) {
                    game.gameOver = true;
                    if (!game._scoreSaved) {
                        game._scoreSaved = true;
                        this.save();
                    }
                }
                break;
            }
        }
    };

    this.drawGame = function () {
        fill(100, 200, 100);
        noStroke();
        for (let platform of game.platforms) {
            fill(platform.color);
            rect(platform.x, platform.y, platform.width, platform.height);
        }

        for (let coin of game.coins) {
            if (!coin.collected) {
                fill(coin.color);
                ellipse(coin.x + coin.size / 2, coin.y + coin.size / 2, coin.size);
                fill(255, 255, 255, 150);
                ellipse(coin.x + coin.size / 3, coin.y + coin.size / 3, coin.size / 4);
            }
        }

        for (let obstacle of game.obstacles) {
            fill(obstacle.color);
            if (obstacle.type === 'ground') {
                triangle(obstacle.x, obstacle.y + obstacle.height, obstacle.x + obstacle.width / 2, obstacle.y, obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            } else {
                triangle(obstacle.x, obstacle.y, obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height, obstacle.x + obstacle.width, obstacle.y);
            }
        }

        fill(game.player.color);
        if (game.player.isDucking) {
            rect(game.player.x, game.player.y + 10, game.player.width, game.player.height - 10);
            ellipse(game.player.x + game.player.width / 2, game.player.y + 5, 15, 15);
        } else {
            rect(game.player.x, game.player.y, game.player.width, game.player.height);
            ellipse(game.player.x + game.player.width / 2, game.player.y - 5, 20, 20);
        }
    };

    this.displayHUD = function () {
        push();
        textAlign(LEFT, TOP);

        fill(255, 0, 0);
        rect(10, 10, 200, 20);
        fill(0, 255, 0);
        const healthWidth = constrain(game.player.health * 2, 0, 200);
        rect(10, 10, healthWidth, 20);

        fill(255);
        textSize(20);
        text(`Score: ${Math.floor(game.score)}`, 10, 40);

        textSize(14);
        text(`Health: ${Math.max(0, Math.floor(game.player.health))}%`, 10, 65);

        text(`Goal: ${game.targetScore} score`, 10, 82);

        textSize(12);
        text("Arrow Keys / WASD: Move | Space: Jump | Down/S: Duck", 10, height - 20);
        pop();
    };

    this.displayGameOver = function () {
        fill(0, 0, 0, 200);
        rect(0, 0, width, height);

        fill(255);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("GAME OVER", width / 2, height / 2 - 40);

        textSize(20);
        text(`Final Score: ${game.score}`, width / 2, height / 2);


        textSize(15);
        text("Press R to play again, or Press L to go to the leaderboard", width / 2, height / 2 + 40);

        if (keyIsPressed && key === 'r') {
            this.setup();
            game.gameOver = false;
            game.score = 0;
            game.player.health = 100;
            game.win = false;
            game._scoreSaved = false;
        } else if (keyIsPressed && key === 'l') {
            game.gameOver = false;
            game.score = 0;
            game.player.health = 100;
            game.win = false;
            game._scoreSaved = false;
            setTimeout(this.sceneManager.showScene(Leaderboard), 500);

        }
    };

    this.displayWin = function () {
        fill(0, 255, 0, 100);
        rect(0, 0, width, height);

        fill(255);
        textSize(40);
        textAlign(CENTER, CENTER);
        text("YOU WIN!", width / 2, height / 2 - 40);

        textSize(20);
        text(`Final Score: ${game.score}`, width / 2, height / 2);

        textSize(15);
        text("Press R to play again, or Press L to go to the leaderboard", width / 2, height / 2 + 40);

        textSize(14);
        text(`Next target: ${game.targetScore} score`, width / 2, height / 2 + 70);

        if (keyIsPressed && key === 'r') {
            this.setup();
            game.gameOver = false;
            game.score = 0;
            game.player.health = 100;
            game.win = false;
            game._scoreSaved = false;
        } else if (keyIsPressed && key === 'l') {
            game.gameOver = false;
            game.score = 0;
            game.player.health = 100;
            game.win = false;
            game._scoreSaved = false;
            setTimeout(this.sceneManager.showScene(Leaderboard), 500);
        }
    };

    this.checkWinCondition = function () {
        if (game.score >= game.targetScore) {
            if (!game.win) {
                game.win = true;
                if (!game._scoreSaved) {
                    game._scoreSaved = true;
                    this.save();
                }

                game.targetScore += 100;
            }
        }
    };

    this.rectCollision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    };


    this.sendScore = function (scoreToSend) {
        const userVal = localStorage.getItem('username') || '';
        const scoreVal = Math.max(0, Math.floor(scoreToSend ?? game.lastScore ?? game.score ?? 0));

        let apiUrl = 'https://api.tristan.informatica-corlaer.nl/store.php';
        let fullUrl = `${apiUrl}?u=${encodeURIComponent(userVal)}&s=${scoreVal}`;

        httpGet(fullUrl, 'text');
    };

    this.save = function () {
        try {
            const scoreVal = Math.max(0, Math.floor(game.score) || 0);
            const prevHigh = Number(game.highScore) || 0;
            const newHigh = Math.max(prevHigh, scoreVal);

            game.lastScore = scoreVal;
            game.highScore = newHigh;

            try {
                localStorage.setItem('lastScore', String(game.lastScore));
                localStorage.setItem('highScore', String(game.highScore));
            } catch (e) {
            }

            if (typeof this.sendScore === 'function') {
                this.sendScore(scoreVal);
            }

        } catch (e) {
        }
    };

    this.generateLevel = function () {
        const groundHeight = 50;
        const groundWidth = Math.max(width, (typeof windowWidth !== 'undefined' ? windowWidth : width)) + 10;

        game.platforms = [{
            x: 0, y: game.groundY, width: groundWidth, height: groundHeight, color: [100, 200, 100], isGround: true
        }];

        this.generatePlatforms();
        this.generateObstacles();
        this.generateCoins();
    };

    this.generatePlatforms = function () {
        const targetCount = Math.max(3, Math.floor(width / 250));
        const minWidth = 120;
        const maxWidth = 220;
        const minY = Math.max(80, game.groundY - Math.max(250, height * 0.4));
        const maxY = game.groundY - 80;
        const margin = 40;
        let attempts = 0;

        while (game.platforms.length < targetCount + 1 && attempts < targetCount * 12) {
            const platformWidth = random(minWidth, maxWidth);
            const x = random(margin, Math.max(margin, width - platformWidth - margin));
            const y = random(minY, maxY);
            const candidate = {x, y, width: platformWidth, height: 20, color: [150, 100, 50], isGround: false};

            if (!this.platformOverlaps(candidate)) {
                game.platforms.push(candidate);
            }
            attempts++;
        }
    };

    this.platformOverlaps = function (candidate) {
        const pad = 24;
        for (const platform of game.platforms) {
            const horizontal = candidate.x < platform.x + platform.width + pad && candidate.x + candidate.width + pad > platform.x;
            const vertical = Math.abs(candidate.y - platform.y) < candidate.height + pad;
            if (horizontal && vertical) {
                return true;
            }
        }
        return false;
    };

    this.generateObstacles = function () {
        game.obstacles = [];
        const obstacleCount = Math.max(3, Math.floor(game.platforms.length * 1.5));
        const obstacleHeight = 20;
        let attempts = 0;

        while (game.obstacles.length < obstacleCount && attempts < obstacleCount * 15) {
            const hostIndex = floor(random(game.platforms.length));
            const host = game.platforms[hostIndex];
            const spikeWidth = random(30, 60);
            const minX = host.x + 10;
            const maxX = host.x + host.width - spikeWidth - 10;
            if (maxX <= minX) {
                attempts++;
                continue;
            }

            const x = random(minX, maxX);
            if (hostIndex === 0 && x < 140) {
                attempts++;
                continue;
            }
            const y = host.y - obstacleHeight;
            const candidate = {x, y, width: spikeWidth, height: obstacleHeight, type: 'ground', color: [100, 100, 100]};

            if (!this.obstacleOverlaps(candidate)) {
                game.obstacles.push(candidate);
            }
            attempts++;
        }
    };

    this.obstacleOverlaps = function (candidate) {
        const pad = 12;
        for (const obstacle of game.obstacles) {
            if (this.rectCollision(candidate.x - pad, candidate.y - pad, candidate.width + pad * 2, candidate.height + pad * 2, obstacle.x, obstacle.y, obstacle.width, obstacle.height)) {
                return true;
            }
        }
        return false;
    };

    this.generateCoins = function () {
        game.coins = [];
        const coinSize = 20;

        const groundCoins = Math.max(2, Math.floor(width / 400));
        for (let i = 0; i < groundCoins; i++) {
            const minX = Math.max(140, width / 2);
            const maxX = Math.max(minX + 1, width - coinSize - 40);
            if (maxX <= minX) continue;
            const x = random(minX, maxX);
            const y = game.groundY - coinSize - 8;
            if (!this.coinBlocked(x, y, coinSize)) {
                game.coins.push({x, y, size: coinSize, collected: false, color: [255, 215, 0]});
            }
        }

        for (const platform of game.platforms.slice(1)) {
            const coinCount = max(1, floor(platform.width / 140));
            for (let i = 0; i < coinCount; i++) {
                const minX = Math.max(platform.x + 10, width / 2);
                const maxX = platform.x + platform.width - coinSize - 10;
                if (maxX <= minX) continue;
                const x = random(minX, maxX);
                const y = platform.y - coinSize - 6;
                if (!this.coinBlocked(x, y, coinSize)) {
                    game.coins.push({x, y, size: coinSize, collected: false, color: [255, 215, 0]});
                }
            }
        }
    };

    this.coinBlocked = function (x, y, size) {
        for (const obstacle of game.obstacles) {
            if (this.rectCollision(x, y, size, size, obstacle.x - 8, obstacle.y - 8, obstacle.width + 16, obstacle.height + 16)) {
                return true;
            }
        }
        return false;
    };

    this.spawnCoin = function () {
        const coinSize = 20;
        const maxAttempts = 30;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const hostIndex = floor(random(game.platforms.length));
            const host = game.platforms[hostIndex];
            let x;
            let y;

            if (hostIndex === 0) {
                const minX = Math.max(140, width / 2);
                const maxX = Math.max(minX + 1, width - coinSize - 40);
                if (maxX <= minX) continue;
                x = random(minX, maxX);
                y = game.groundY - coinSize - 8;
            } else {
                const minX = Math.max(host.x + 10, width / 2);
                const maxX = host.x + host.width - coinSize - 10;
                if (maxX <= minX) continue;
                x = random(minX, maxX);
                y = host.y - coinSize - 6;
            }

            if (this.coinBlocked(x, y, coinSize)) {
                continue;
            }

            const overlapsCoin = game.coins.some(c => !c.collected && this.rectCollision(x, y, coinSize, coinSize, c.x - 4, c.y - 4, c.size + 8, c.size + 8));
            if (overlapsCoin) {
                continue;
            }

            game.coins.push({x, y, size: coinSize, collected: false, color: [255, 215, 0]});
            return true;
        }
        return false;
    };

    this.pruneOffscreenContent = function () {
        const leftCull = -120;
        game.platforms = game.platforms.filter(p => p.isGround || p.x + p.width > leftCull);
        game.coins = game.coins.filter(c => !c.collected && c.x + c.size > leftCull);
        game.obstacles = game.obstacles.filter(o => o.x + o.width > leftCull);
    };

    this.recycleAndExtendPlatforms = function () {
        const desiredCount = Math.max(3, Math.floor(width / 250));
        const maxRight = this.maxPlatformRight();
        while (game.platforms.filter(p => !p.isGround).length < desiredCount) {
            this.appendPlatform(maxRight + random(80, 200));
        }
        if (maxRight < width * 1.2) {
            this.appendPlatform(maxRight + random(80, 200));
        }
    };

    this.maxPlatformRight = function () {
        let right = 0;
        for (const p of game.platforms) {
            right = Math.max(right, p.x + p.width);
        }
        return right;
    };

    this.appendPlatform = function (startX) {
        const minWidth = 120;
        const maxWidth = 220;
        const minY = Math.max(80, game.groundY - Math.max(250, height * 0.4));
        const maxY = game.groundY - 80;
        const widthVal = random(minWidth, maxWidth);
        const y = random(minY, maxY);
        const platform = {x: startX, y, width: widthVal, height: 20, color: [150, 100, 50], isGround: false};
        game.platforms.push(platform);
    };

    this.ensureCoinPool = function () {
        const targetCoins = Math.max(3, Math.floor(width / 300));
        let active = game.coins.filter(c => !c.collected && c.x + c.size > 0).length;
        while (active < targetCoins) {
            if (!this.spawnCoin()) break;
            active++;
        }
    };

    this.ensureObstaclePool = function () {
        const targetObs = Math.max(3, Math.floor(width / 280));
        let active = game.obstacles.filter(o => o.x + o.width > 0).length;
        let guard = 0;
        while (active < targetObs && guard < 10) {
            this.spawnObstacleAhead();
            active = game.obstacles.filter(o => o.x + o.width > 0).length;
            guard++;
        }
    };

    this.spawnObstacleAhead = function () {
        const hostIndex = floor(random(game.platforms.length));
        const host = game.platforms[hostIndex];
        const obstacleHeight = 20;
        const spikeWidth = random(30, 60);
        const minX = host.x + 10;
        const maxX = host.x + host.width - spikeWidth - 10;
        if (maxX <= minX) return false;
        const x = random(minX, maxX);
        const y = host.y - obstacleHeight;
        const candidate = {x, y, width: spikeWidth, height: obstacleHeight, type: 'ground', color: [100, 100, 100]};
        if (this.obstacleOverlaps(candidate)) return false;
        game.obstacles.push(candidate);
        return true;
    };

    this.syncGroundWithCanvas = function () {
        game.groundY = height - 50;
        if (game.platforms.length) {
            const ground = game.platforms[0];
            ground.x = 0;
            ground.y = game.groundY;
            ground.height = 50;
            ground.width = windowWidth;
        }
    };

    this.playCoinSound = function () {
        const allowedFlag = getItem('SFX');
        const sfxAllowed = (allowedFlag === null || allowedFlag === undefined) ? true : Boolean(allowedFlag);
        if (!sfxAllowed) return;
        if (!coinSound || (typeof coinSound.isLoaded === 'function' && !coinSound.isLoaded())) return;
        try {
            coinSound.stop();
            coinSound.play();
        } catch (e) {
        }
    };

}
