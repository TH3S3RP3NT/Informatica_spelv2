function Leaderboard() {
    let scores = [];
    let refreshButton;
    let backButton;
    let lastFetchTime = 0;
    const FETCH_COOLDOWN = 5000;


    let colRankX, colPlayerX, colScoreX, colDateX;
    let tableWidth, tableX, rowHeight;

    this.setup = function () {
        clear();
        textFont(font);

        this.hideAllInputs();
        this.calculateColumnPositions();


        refreshButton = new Button(width / 2 - 110, height - 80, 'Refresh', () => {
            const now = Date.now();
            if (now - lastFetchTime > FETCH_COOLDOWN) {
                this.fetchScores();
                lastFetchTime = now;
            }
        });

        backButton = new Button(width / 2 + 110, height - 80, 'Back', () => {
            this.sceneManager.showScene(Loadscreen);
        });


        this.fetchScores();
    };

    this.hideAllInputs = function () {

        const allElements = document.querySelectorAll('input, button, textarea, select');
        allElements.forEach(el => {

            if (!el.classList.contains('p5Button') &&
                !el.classList.contains('p5Input') &&
                el.id !== 'defaultCanvas0') {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
                el.style.position = 'absolute';
                el.style.left = '-9999px';
            }
        });
    };

    this.calculateColumnPositions = function () {

        tableWidth = min(width - 100, 900);
        tableX = (width - tableWidth) / 2;
        rowHeight = 45;

        colRankX = tableX + 30;
        colPlayerX = tableX + 100;
        colScoreX = tableX + tableWidth - 150;
        colDateX = tableX + tableWidth - 30;
    };

    this.draw = function () {
        background(fightimg);


        fill(255, 215, 0);
        textSize(48);
        textAlign(CENTER, CENTER);
        text('LEADERBOARD', width / 2, 80);

        fill(200, 200, 255);
        textSize(18);
        text('Top 10 Scores', width / 2, 120);

        this.drawTable();

        refreshButton.draw();
        backButton.draw();

        if (scores.length === 0) {
            fill(255);
            textSize(20);
            textAlign(CENTER, CENTER);
            text('Loading scores...', width / 2, height / 2);
        }
    };

    this.drawTable = function () {
        const headerY = 160;
        const startY = headerY + 40;

        this.drawHeaders(headerY);
        this.drawScoresList(startY);
    };

    this.drawHeaders = function (y) {
        fill(255, 215, 0);
        textSize(16);
        textFont(font);

        textAlign(LEFT, CENTER);
        text('#', colRankX, y + 20);

        text('PLAYER', colPlayerX, y + 20);

        textAlign(RIGHT, CENTER);
        text('SCORE', colScoreX, y + 20);

        text('DATE', colDateX, y + 20);

        stroke(255, 215, 0, 100);
        strokeWeight(1);
        line(tableX, y + 40, tableX + tableWidth, y + 40);
        noStroke();
    };

    this.drawScoresList = function (startY) {
        const maxVisible = Math.min(10, Math.floor((height - startY - 100) / rowHeight));

        for (let i = 0; i < Math.min(scores.length, maxVisible); i++) {
            const score = scores[i];
            const y = startY + (i * rowHeight);

            textSize(18);
            textAlign(LEFT, CENTER);
            if (i === 0) {
                fill(255, 215, 0); // Gold
            } else if (i === 1) {
                fill(192, 192, 192); // Silver
            } else if (i === 2) {
                fill(205, 127, 50); // Bronze
            } else {
                fill(200, 200, 255);
            }
            text(`${i + 1}.`, colRankX, y + rowHeight / 2);

            fill(255);
            textSize(16);
            let playerName = score.USERNAME || 'Unknown';
            if (playerName.length > 15) {
                playerName = playerName.substring(0, 15) + '...';
            }
            textAlign(LEFT, CENTER);
            text(playerName, colPlayerX, y + rowHeight / 2);

            if (i < 3) {
                fill(255, 215, 0);
            } else {
                fill(100, 255, 100);
            }
            textSize(18);
            textAlign(RIGHT, CENTER);
            text(score.SCORE || 0, colScoreX, y + rowHeight / 2);

            fill(200, 200, 255);
            textSize(14);
            textAlign(RIGHT, CENTER);
            text(this.formatDate(score.DATE), colDateX, y + rowHeight / 2);
        }

        if (scores.length === 0) {
            fill(255, 200, 200);
            textSize(18);
            textAlign(CENTER, CENTER);
            text('No scores yet. Be the first!', width / 2, startY + 50);
        }


        if (scores.length > 0) {
            fill(200, 200, 255);
            textSize(14);
            textAlign(LEFT, CENTER);
            text(`Showing ${Math.min(scores.length, maxVisible)} of ${scores.length} scores`,
                tableX + 10, height - 100);
        }
    };

    this.formatDate = function (dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (e) {
            return 'N/A';
        }
    };

    this.fetchScores = async function () {
        try {
            const response = await fetch('https://api.tristan.informatica-corlaer.nl/get_scores.php');
            const data = await response.json();

            if (data.success) {
                scores = data.data;
                console.log(`Fetched ${scores.length} scores`);

                localStorage.setItem('gameLeaderboard', JSON.stringify({
                    scores: scores,
                    lastUpdated: new Date().toISOString()
                }));

                scores.sort((a, b) => (b.SCORE || 0) - (a.SCORE || 0));

                scores = scores.slice(0, 10);

            } else {
                console.error('API error:', data.message);
                this.loadFromLocalStorage();
            }
        } catch (error) {
            console.error('Error fetching scores:', error);
            this.loadFromLocalStorage();
        }
    };

    this.loadFromLocalStorage = function () {
        const storedData = localStorage.getItem('gameLeaderboard');
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                scores = data.scores || [];
                scores.sort((a, b) => (b.SCORE || 0) - (a.SCORE || 0));
                scores = scores.slice(0, 10);
                console.log(`Loaded ${scores.length} scores from localStorage`);
            } catch (error) {
                console.error('Error parsing localStorage data:', error);
                scores = [];
            }
        } else {
            scores = [];
        }
    };

    this.mousePressed = function () {
        refreshButton.checkClick();
        backButton.checkClick();
    };

    this.mouseMoved = function () {
        refreshButton.updateHover();
        backButton.updateHover();
    };

    this.windowResized = function () {
        this.calculateColumnPositions();
    };
}