"use strict";
import { pill } from "./pill.js"
import { gameBoard } from "./gameBoard.js"
import { virus } from "./virus.js"
import { keyboard } from "./keyboard.js"
export { doctor }

var doctor = {
    doctorDiv: document.getElementById("doctorDiv"),
    nextColor1: "",
    nextColor2: "",

    generateThrowArr: function () {
        let arr2d = []
        for (let y = 0; y < 8; y++) {
            arr2d[y] = []
            for (let x = 0; x < 12; x++) {
                arr2d[y][x] = 0
            }
        }

        this.throwArr = arr2d;
        this.generateThrowDiv()
        console.log(this.throwArr);
    },

    generateThrowDiv: function () {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 12; x++) {
                let el = document.createElement("div")
                el.className = "doctorField"

                // div id names
                if (x < 10) {
                    el.id = `field${y}0${x}`
                } else {
                    el.id = `field${y}${x}`
                }

                this.doctorDiv.appendChild(el)
            }
        }

        this.nextColor1 = pill.drawRandomColor()
        this.nextColor2 = pill.drawRandomColor()
    },

    moveHand: function (stage) {
        if (stage == 0) {
            // Clear existing hand fragments
            document.getElementById("field611").style.backgroundImage = "none";
            document.getElementById("field711").style.backgroundImage = "none";

            document.getElementById("field411").style.backgroundImage = "url('./img/hands/up_1.png')";
            document.getElementById("field511").style.backgroundImage = "url('./img/hands/up_2.png')";
            document.getElementById("field611").style.backgroundImage = "url('./img/hands/up_3.png')";
        } else if (stage == 1) {
            // Clear existing hand fragments
            document.getElementById("field411").style.backgroundImage = "none";

            // Paint a new hand
            document.getElementById("field510").style.backgroundImage = "url('./img/hands/middle_11.png')";
            document.getElementById("field511").style.backgroundImage = "url('./img/hands/middle_12.png')";
            document.getElementById("field610").style.backgroundImage = "url('./img/hands/middle_21.png')";
            document.getElementById("field611").style.backgroundImage = "url('./img/hands/middle_22.png')";
        } else if (stage == 2) {
            // Clear exiting hand fragments
            document.getElementById("field510").style.backgroundImage = "none";
            document.getElementById("field511").style.backgroundImage = "none";
            document.getElementById("field610").style.backgroundImage = "none";

            // Paint a new hand
            document.getElementById("field611").style.backgroundImage = "url('./img/hands/down_1.png')";
            document.getElementById("field711").style.backgroundImage = "url('./img/hands/down_2.png')";
        }
    },

    paintPill: function (Id, color, direction) {
        document.getElementById(`field${Id}`).style.backgroundImage = `url("./img/${color}_${direction}.png")`
    },

    clearPill: function (Id) {
        document.getElementById(`field${Id}`).style.backgroundImage = `none`
    },

    throwPill: function () {
        let color1 = this.nextColor1
        let color2 = this.nextColor2
        console.log(color1, color2);

        // first position
        this.paintPill("311", color1, "right")
        this.paintPill("310", color2, "left")
        this.moveHand(0)

        setTimeout(() => {
            this.clearPill("311")
            this.paintPill("210", color1, "up")
            this.paintPill("310", color2, "down")
        }, 50);
        setTimeout(() => {
            this.clearPill("310")
            this.paintPill("210", color2, "right")
            this.paintPill("209", color1, "left")
        }, 100);
        setTimeout(() => {
            this.clearPill("210")
            this.paintPill("109", color2, "up")
            this.paintPill("209", color1, "down")
        }, 150);
        setTimeout(() => {
            this.clearPill("209")
            this.paintPill("109", color1, "right")
            this.paintPill("108", color2, "left")
            this.moveHand(1)
        }, 200);
        setTimeout(() => {
            this.clearPill("109")
            this.paintPill("008", color1, "up")
            this.paintPill("108", color2, "down")
        }, 250);
        setTimeout(() => {
            this.clearPill("008")
            this.paintPill("107", color1, "left")
            this.paintPill("108", color2, "right")
        }, 300);
        setTimeout(() => {
            this.clearPill("108")
            this.paintPill("007", color2, "up")
            this.paintPill("107", color1, "down")
            this.moveHand(2)
        }, 350);
        setTimeout(() => {
            this.clearPill("007")
            this.paintPill("107", color1, "right")
            this.paintPill("106", color2, "left")
        }, 400);
        setTimeout(() => {
            this.clearPill("107")
            this.paintPill("006", color1, "up")
            this.paintPill("106", color2, "down")
        }, 450);
        setTimeout(() => {
            this.clearPill("006")
            this.paintPill("105", color1, "left")
            this.paintPill("106", color2, "right")
        }, 500);
        setTimeout(() => {
            this.clearPill("106")
            this.paintPill("005", color2, "up")
            this.paintPill("105", color1, "down")
        }, 550);
        setTimeout(() => {
            this.clearPill("005")
            this.paintPill("104", color2, "left")
            this.paintPill("105", color1, "right")
        }, 600);
        setTimeout(() => {
            this.clearPill("105")
            this.paintPill("004", color1, "up")
            this.paintPill("104", color2, "down")
        }, 650);
        setTimeout(() => {
            this.clearPill("004")
            this.paintPill("103", color1, "left")
            this.paintPill("104", color2, "right")
        }, 700);
        setTimeout(() => {
            this.clearPill("104")
            this.paintPill("003", color2, "up")
            this.paintPill("103", color1, "down")
        }, 750);
        setTimeout(() => {
            this.clearPill("003")
            this.paintPill("102", color2, "left")
            this.paintPill("103", color1, "right")
        }, 800);
        setTimeout(() => {
            this.clearPill("103")
            this.paintPill("002", color1, "up")
            this.paintPill("102", color2, "down")
        }, 850);
        setTimeout(() => {
            this.clearPill("002")
            this.clearPill("102")
            this.paintPill("202", color2, "right")
            this.paintPill("201", color1, "left")
        }, 900);
        setTimeout(() => {
            this.clearPill("202")
            this.paintPill("101", color2, "up")
            this.paintPill("201", color1, "down")
        }, 950);
        setTimeout(() => {
            this.clearPill("101")
            this.paintPill("200", color2, "left")
            this.paintPill("201", color1, "right")
        }, 1000);
        setTimeout(() => {
            this.clearPill("200")
            this.clearPill("201")
            this.paintPill("300", color2, "left")
            this.paintPill("301", color1, "right")
        }, 1050);
        setTimeout(() => {
            this.clearPill("300")
            this.clearPill("301")
            this.paintPill("400", color2, "left")
            this.paintPill("401", color1, "right")
        }, 1100);
        setTimeout(() => {
            this.clearPill("400")
            this.clearPill("401")
            this.paintPill("500", color2, "left")
            this.paintPill("501", color1, "right")
        }, 1150);
        setTimeout(() => {
            this.clearPill("500")
            this.clearPill("501")
        }, 1200);

        setTimeout(() => {
            // Create a new pill and begin its falling process
            pill.create(color2, color1)
            pill.falling(pill.fallingSpeed)

            // Resurrect the keyboard
            document.onkeydown = keyboard.keyPressed;

            this.nextColor1 = pill.drawRandomColor()
            this.nextColor2 = pill.drawRandomColor()
            color1 = this.nextColor1
            color2 = this.nextColor2

            this.moveHand(0)
            this.paintPill("311", color1, "right")
            this.paintPill("310", color2, "left")

        }, 1200);

    }
}
