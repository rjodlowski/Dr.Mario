"use strict";
import { gameBoard } from "./gameBoard.js"
export { virus }

var virus = {
    colors: ["yellow", "brown", "blue"],
    currColor: 0,
    count: 0,
    gameIsNotLost: true,

    create: function () {
        this.currColor > 2 ? this.currColor = 0 : 0

        let vir = {
            direction: "",
            state: "static",
            type: "virus",
            position: this.getVirusPosition(),
            color: this.colors[this.currColor],
        }

        // If free space
        if (gameBoard.gameBoardTable[parseInt(vir.position[0])][parseInt(vir.position[1])] == 0) {
            this.currColor += 1;
            this.count += 1;
            gameBoard.gameBoardTable[parseInt(vir.position[0])][parseInt(vir.position[1])] = vir
            gameBoard.updateVirusCount()
        } else {
            // Create a virus once again
            virus.create();
        }
    },

    getVirusPosition: function () {
        do {
            var pos = [
                `${Math.floor(Math.random() * 16) + 5}`,
                `${Math.floor(Math.random() * 8)}`,
            ]
        } while (parseInt(pos[0]) >= 16)

        return pos;
    },

    createScore: function () {
        localStorage.setItem("score", "000")
        localStorage.setItem("highScore", "000")
    },

    deleted: function () {
        let currScore = parseInt(localStorage.getItem("score"))
        currScore += 100
        localStorage.setItem("score", `${currScore}`)
        this.count -= 1
        gameBoard.updateScore("score")
        gameBoard.updateVirusCount()
    },

    animateSpyglass: function () {
        let imageCounter = 1
        let centerX = 66;
        let centerY = 66;
        let radius = 60;
        let blueAngle = 0;
        let brownAngle = 120;
        let yellowAngle = 240;
        let brownVir = document.getElementById("brownVir");
        let yellowVir = document.getElementById("yellowVir");
        let blueVir = document.getElementById("blueVir");

        // Change virus iamges
        var virusGraphics = setInterval(() => {
            if (this.gameIsNotLost == true) {
                brownVir.style.backgroundImage = `url("./img/lupa/brown/${imageCounter}.png")`
                yellowVir.style.backgroundImage = `url("./img/lupa/yellow/${imageCounter}.png")`
                blueVir.style.backgroundImage = `url("./img/lupa/blue/${imageCounter}.png")`

                // Reset counter
                imageCounter++
                imageCounter >= 4 ? imageCounter = 1 : 0
            } else {
                if (imageCounter == 1 || imageCounter == 3) {
                    imageCounter = 2
                } else if (imageCounter == 2) {
                    imageCounter = 4
                } else if (imageCounter == 4) {
                    imageCounter = 2
                }
                brownVir.style.backgroundImage = `url("./img/lupa/brown/${imageCounter}.png")`
                yellowVir.style.backgroundImage = `url("./img/lupa/yellow/${imageCounter}.png")`
                blueVir.style.backgroundImage = `url("./img/lupa/blue/${imageCounter}.png")`
            }
        }, 500);

        // Change virus positions
        var blueVirMove = setInterval(() => {
            if (this.gameIsNotLost == true) {
                let currAngle = this.getAngle(blueAngle, 30)
                blueAngle = currAngle

                let x = centerX + radius * Math.cos(currAngle * Math.PI / 180)
                let y = centerY + radius * Math.sin(currAngle * Math.PI / 180)

                blueVir.style.top = `${y}px`
                blueVir.style.left = `${x}px`
            }
        }, 1200);
        var yellowVirMove = setInterval(() => {
            if (this.gameIsNotLost == true) {
                let currAngle = this.getAngle(yellowAngle, 30)
                yellowAngle = currAngle

                let x = centerX + radius * Math.cos(currAngle * Math.PI / 180)
                let y = centerY + radius * Math.sin(currAngle * Math.PI / 180)

                yellowVir.style.top = `${y}px`
                yellowVir.style.left = `${x}px`
            }
        }, 1200);
        var brownVirMove = setInterval(() => {
            if (this.gameIsNotLost == true) {
                let currAngle = this.getAngle(brownAngle, 30)
                brownAngle = currAngle

                let x = centerX + radius * Math.cos(currAngle * Math.PI / 180)
                let y = centerY + radius * Math.sin(currAngle * Math.PI / 180)

                brownVir.style.top = `${y}px`
                brownVir.style.left = `${x}px`
            }
        }, 1200);
    },

    getAngle: function (angle, amount) {
        // Increase an angle
        if (angle += amount <= 360) {
            return angle += amount;
        } else /* angle += amount >= 360 */ {
            return angle + amount - 360;
        }
    },

    clearVirRotateIntervals: function () {
        clearInterval(blueVirMove)
        clearInterval(yellowVirMove)
        clearInterval(brownVirMove)
    },
}
