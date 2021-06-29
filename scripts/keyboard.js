"use strict";
import { gameBoard } from "./gameBoard.js"
import { pill } from "./pill.js"
import { virus } from "./virus.js"
import { doctor } from "./doctor.js"
export { keyboard }

var keyboard = {
    keyPressed: function (event) {
        if (pill.currPill.state == "falling") {
            let key = event.keyCode;

            if /* A || leftArr */ (key == 65 || key == 37) {
                pill.moveLeft()
            } else if /* D || rightArr */ (key == 68 || key == 39) {
                pill.moveRight()
            } else if /* W || leftArr */ (key == 87 || key == 38) {
                pill.rotateLeft()
                console.log("Rotate left");
            } else if /* Shift */ (key == 16) {
                pill.rotateRight()
                console.log("Rotate right");
            } else if /* S || downArr */ (key == 83 || key == 40) {
                pill.fallDown()
                console.log("Go down");
            }
        }
    },
}


