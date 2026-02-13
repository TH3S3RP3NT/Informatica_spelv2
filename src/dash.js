function Dash() {


    this.setup = function () {
    };

    this.draw = function () {};



    this.sendScore = function () {
        const userVal = localStorage.getItem('username') || '';
        const scoreVal = parseInt(localStorage.getItem('highScore')) || 0;

        let apiUrl = 'https://api.tristan.informatica-corlaer.nl/store.php';
        let fullUrl = `${apiUrl}?u=${encodeURIComponent(userVal)}&s=${scoreVal}`;

        console.log("Sending to:", fullUrl);

        httpGet(fullUrl, 'text', function (response) {
            console.log("Server Response:", response);
        }.bind(this));
    };

    this.save = function () {

        this.highScore = max(this.score, this.highScore);
        localStorage.setItem('highScore', this.highScore);
    };

}