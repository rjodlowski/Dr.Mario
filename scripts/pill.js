"use strict";
import { doctor } from "./doctor.js";
import { gameBoard } from "./gameBoard.js"
import { keyboard } from "./keyboard.js"
import { virus } from "./virus.js"
export { pill }


// Pill object
var pill = {
    nextPillId: 0,
    fallingSpeed: 600,

    // Draw pill node's color
    drawRandomColor: function () {
        let color;

        Math.random() < 0.35 ? color = "brown" : Math.random() > 0.5 ? color = "blue" : color = "yellow"

        return color;
    },

    drawPillId: function () {
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 8; x++) {
                let divId = gameBoard.cordsToId(y, x);
                document.getElementById(`node${divId}`).innerText = "";
                if (gameBoard.gameBoardTable[y][x] != 0) {
                    // console.log(gameBoard.gameBoardTable[y][x].type == "pill");
                    if (gameBoard.gameBoardTable[y][x].type == "pill") {
                        let currId = gameBoard.gameBoardTable[y][x].id;
                        document.getElementById(`node${divId}`).innerText = currId;
                    }
                }
            }
        }
    },

    // Create new pill
    create: function (color1, color2) {
        let nextPill = {
            state: "falling",
            direction: "horizontal",
            type: "pill",
            node1: {
                color: color1,
                position: ["00", "3"],
                state: "falling",
                type: "pill",
                toBeDeleted: false,
                id: pill.nextPillId,
                side: "left",
                isSingle: false,
            },
            node2: {
                color: color2,
                position: ["00", "4"],
                state: "falling",
                type: "pill",
                toBeDeleted: false,
                id: pill.nextPillId,
                side: "right",
                isSingle: false,
            },

        }
        pill.nextPillId += 1;

        //Add latest pill to object
        pill.currPill = nextPill;
        gameBoard.updateGame();
    },

    // currPill: { direction, node1{}, node2{} },

    // Update pill's position to gameBoard
    updatePillPosition: function () {
        let pill1Y = pill.currPill.node1.position[0]
        let pill1X = pill.currPill.node1.position[1]
        let pill2Y = pill.currPill.node2.position[0]
        let pill2X = pill.currPill.node2.position[1]

        gameBoard.gameBoardTable[parseInt(pill1Y)][parseInt(pill1X)] = pill.currPill.node1;
        gameBoard.gameBoardTable[parseInt(pill2Y)][parseInt(pill2X)] = pill.currPill.node2;

        // console.log(gameBoard.gameBoardTable);
    },

    // A pill has fallen into the river in lego city!
    // Draw a new pill and start a rescue!
    pillAtTheBottom: function () {
        // Set current pill and its node's positions to static
        pill.currPill.state = "static"
        pill.currPill.node1.state = "static"
        pill.currPill.node2.state = "static"

        // Update the game, cuz why not
        gameBoard.updateGame();

        // Clerar pill falling interval, there's nothing to fall
        clearInterval(pill.fallInterval);

        // Check for game lose
        let gameWasLost = false;
        for (let x = 0; x < 8; x++) {
            if (gameBoard.gameBoardTable[0][x] != 0 && gameBoard.gameBoardTable[0][x].state == "static") {
                gameWasLost = true;
                gameBoard.gameLose()
            }
        }

        if (gameWasLost == false) {
            gameBoard.updateGame()
            pill.findMatches(false);
        }
    },

    // Change pill's and both node's directions to given one
    changeCurrPillDirection: function (changeTo) {
        pill.currPill.direction = changeTo
        pill.currPill.node1.direction = changeTo
        pill.currPill.node2.direction = changeTo
    },

    // Set pill falling interval
    falling: function (time) {
        if (this.currPill.state == "falling") {
            // Interval of falling pill every second
            pill.fallInterval = setInterval(() => {
                // Can be changed to pill.updatePosition's vars
                let oldNode1PosY = parseInt(pill.currPill.node1.position[0]);
                let oldNode1PosX = parseInt(pill.currPill.node1.position[1]);
                let oldNode2PosY = parseInt(pill.currPill.node2.position[0]);
                let oldNode2PosX = parseInt(pill.currPill.node2.position[1]);

                // console.log(oldNode1PosY, oldNode1PosX, oldNode2PosY, oldNode2PosX);

                // If not on the last available field down on set x
                if (oldNode1PosY + 1 <= 15 && oldNode2PosY + 1 <= 15) {
                    // console.log(pill.currPill.direction);
                    if (pill.currPill.direction == "vertical") {
                        // Which node is bottom
                        if /* node1 bottom */ (oldNode1PosY > oldNode2PosY) {
                            gameBoard.clearPillPosition();
                            // If available space below
                            if (gameBoard.gameBoardTable[oldNode1PosY + 1][oldNode1PosX] == 0) {
                                this.currPill.node1.position[0] = `${oldNode1PosY + 1}`
                                this.currPill.node2.position[0] = `${oldNode1PosY}`
                                gameBoard.updateGame();
                            } else {
                                console.log("No available space below");
                                pill.pillAtTheBottom()
                            }
                        } else if /* node2 bottom */ (oldNode2PosY > oldNode1PosY) {
                            gameBoard.clearPillPosition();
                            // If available space below
                            if (gameBoard.gameBoardTable[oldNode2PosY + 1][oldNode2PosX] == 0) {
                                this.currPill.node2.position[0] = `${oldNode2PosY + 1}`
                                this.currPill.node1.position[0] = `${oldNode2PosY}`
                                gameBoard.updateGame();
                            } else {
                                console.log("No available space below");
                                pill.pillAtTheBottom()
                            }
                        } else {
                            console.log("Unexpected error");
                            clearInterval(pill.fallInterval);
                        }
                    } else if (pill.currPill.direction == "horizontal") {
                        // If free space under any node of falling one
                        if (gameBoard.gameBoardTable[oldNode1PosY + 1][oldNode1PosX] == 0 &&
                            gameBoard.gameBoardTable[oldNode2PosY + 1][oldNode2PosX] == 0
                        ) {
                            // Delete first, paint another one | paint another one, delete previous (op.1)
                            gameBoard.clearPillPosition();

                            // Make new Y positions
                            if (oldNode1PosY + 1 < 10) {
                                var newNode1PosY = `0${oldNode1PosY + 1}`;
                            } else if (oldNode1PosY + 1 >= 10) {
                                var newNode1PosY = (oldNode1PosY + 1).toString()
                            }
                            if (oldNode2PosY + 1 < 10) {
                                var newNode2PosY = `0${oldNode2PosY + 1}`;
                            } else if (oldNode2PosY + 1 >= 10) {
                                var newNode2PosY = (oldNode2PosY + 1).toString()
                            }

                            // Change current pill nodes Y positions (pill.currPill.node{1, 2}.position[0])
                            pill.currPill.node1.position[0] = newNode1PosY;
                            pill.currPill.node2.position[0] = newNode2PosY;

                            // Update game state
                            gameBoard.updateGame()
                        } else {
                            console.log("No available space below");
                            pill.pillAtTheBottom();
                        }
                    }
                } else {
                    console.log("Pill at the bottom");
                    pill.pillAtTheBottom();
                }
            }, time);
        } else {
            console.log("currPill's position is static");
            pill.pillAtTheBottom();
        }
    },

    // Move pill right
    moveRight: function () {
        if (this.currPill.state == "falling") {
            if (pill.currPill.direction == "vertical") {
                let oldNode1PosY = parseInt(pill.currPill.node1.position[0])
                let oldNode1PosX = parseInt(pill.currPill.node1.position[1])
                let oldNode2PosY = parseInt(pill.currPill.node2.position[0])
                let oldNode2PosX = parseInt(pill.currPill.node2.position[1])

                // Can move right
                if (parseInt(pill.currPill.node1.position[1]) + 1 < 8 &&
                    parseInt(pill.currPill.node2.position[1]) + 1 < 8) {
                    // If free space right
                    if (gameBoard.gameBoardTable[oldNode1PosY][oldNode1PosX + 1] == 0 &&
                        gameBoard.gameBoardTable[oldNode2PosY][oldNode2PosX + 1] == 0) {
                        // Instert 0s in currPill's node positions
                        gameBoard.gameBoardTable[oldNode2PosY][oldNode2PosX] = 0;
                        gameBoard.gameBoardTable[oldNode1PosY][oldNode1PosX] = 0;
                        // Move both nodes right by 1 field
                        pill.currPill.node1.position[1] = (oldNode1PosX + 1).toString();
                        pill.currPill.node2.position[1] = (oldNode2PosX + 1).toString();

                        gameBoard.updateGame();
                    } else {
                        console.log("Occupied space right");
                    }
                } else {
                    console.log("Hit the left border");
                }
            } else if (pill.currPill.direction == "horizontal") {
                // Determine, which node is closer to right side
                if /* 1 closer */ (parseInt(pill.currPill.node1.position[1]) > parseInt(pill.currPill.node2.position[1])) {
                    let oldNode1PosY = parseInt(pill.currPill.node1.position[0]);
                    let oldNode1PosX = parseInt(pill.currPill.node1.position[1]);
                    let oldNode2PosY = parseInt(pill.currPill.node2.position[0]);
                    let oldNode2PosX = parseInt(pill.currPill.node2.position[1]);
                    // Can move right
                    if (oldNode1PosX + 1 < 8) {
                        // If free space right
                        if (gameBoard.gameBoardTable[oldNode1PosY][oldNode1PosX + 1] == 0) {
                            // Insert 0 in left's position
                            gameBoard.gameBoardTable[oldNode2PosY][oldNode2PosX] = 0;
                            // Move left one to right's position
                            pill.currPill.node2.position[1] = pill.currPill.node1.position[1];
                            // Move right one, one field to the right
                            pill.currPill.node1.position[1] = (oldNode1PosX + 1).toString();

                            gameBoard.updateGame();
                        } else {
                            console.log("Occupied space right");
                        }
                    } else {
                        console.log("Hit the right border");
                    }
                } else if /* 2 closer */ (parseInt(pill.currPill.node2.position[1]) > parseInt(pill.currPill.node1.position[1])) {
                    let oldNode1PosY = parseInt(pill.currPill.node1.position[0]);
                    let oldNode1PosX = parseInt(pill.currPill.node1.position[1]);
                    let oldNode2PosY = parseInt(pill.currPill.node2.position[0]);
                    let oldNode2PosX = parseInt(pill.currPill.node2.position[1]);
                    // Can move right
                    if (oldNode2PosX + 1 < 8) {
                        // If can move right
                        if (gameBoard.gameBoardTable[oldNode2PosY][oldNode2PosX + 1] == 0) {
                            // Insert 0 in left's position
                            gameBoard.gameBoardTable[oldNode1PosY][oldNode1PosX] = 0;
                            // Move left one to right's position
                            pill.currPill.node1.position[1] = pill.currPill.node2.position[1];
                            // Move right one, one field to the right
                            pill.currPill.node2.position[1] = (oldNode2PosX + 1).toString();

                            gameBoard.updateGame();
                        } else {
                            console.log("Occupied space right");
                        }
                    } else {
                        console.log("Hit the right border");
                    }
                }
            }
        }
    },

    // Move pill left
    moveLeft: function () {
        if (this.currPill.state == "falling") {
            if (pill.currPill.direction == "vertical") {
                let oldNode1PosY = parseInt(pill.currPill.node1.position[0])
                let oldNode1PosX = parseInt(pill.currPill.node1.position[1])
                let oldNode2PosY = parseInt(pill.currPill.node2.position[0])
                let oldNode2PosX = parseInt(pill.currPill.node2.position[1])
                console.log(oldNode1PosY, oldNode1PosX, ";", oldNode2PosY, oldNode2PosX);

                // Can move left
                if (oldNode1PosX - 1 >= 0 &&
                    oldNode2PosX - 1 >= 0) {
                    // If free space left
                    if (gameBoard.gameBoardTable[oldNode1PosY][oldNode1PosX - 1] == 0 &&
                        gameBoard.gameBoardTable[oldNode2PosY][oldNode2PosX - 1] == 0) {
                        // Insert 0s in currPill's position
                        gameBoard.gameBoardTable[oldNode2PosY][oldNode2PosX] = 0;
                        gameBoard.gameBoardTable[oldNode1PosY][oldNode1PosX] = 0;
                        // Move both nodes left by 1 field
                        pill.currPill.node1.position[1] = (oldNode1PosX - 1).toString();
                        pill.currPill.node2.position[1] = (oldNode2PosX - 1).toString();

                        gameBoard.updateGame();
                    } else {
                        console.log("Occupied space left");
                    }
                } else {
                    console.log("Unable to move left");
                }
            } else if (pill.currPill.direction == "horizontal") {
                // Determine, which node is closer to left side
                if /* 1 closer */ (parseInt(pill.currPill.node1.position[1]) < parseInt(pill.currPill.node2.position[1])) {
                    let oldNode1PosY = parseInt(pill.currPill.node1.position[0]);
                    let oldNode1PosX = parseInt(pill.currPill.node1.position[1]);
                    let oldNode2PosY = parseInt(pill.currPill.node2.position[0]);
                    let oldNode2PosX = parseInt(pill.currPill.node2.position[1]);
                    // Can move left
                    if (oldNode1PosX - 1 >= 0) {
                        // If free space left 
                        if (gameBoard.gameBoardTable[oldNode1PosY][oldNode1PosX - 1] == 0) {
                            // Insert 0 in right's position
                            gameBoard.gameBoardTable[oldNode2PosY][oldNode2PosX] = 0;
                            // Move right one to left's position
                            pill.currPill.node2.position[1] = pill.currPill.node1.position[1];
                            // Move left one, one field to the left
                            pill.currPill.node1.position[1] = (oldNode1PosX - 1).toString();

                            gameBoard.updateGame();
                        } else {
                            console.log("Occupied space left");
                        }
                    } else {
                        console.log("Hit the left border");
                    }
                } else if /* 2 closer */ (parseInt(pill.currPill.node2.position[1]) < parseInt(pill.currPill.node1.position[1])) {
                    let oldNode1PosY = parseInt(pill.currPill.node1.position[0]);
                    let oldNode1PosX = parseInt(pill.currPill.node1.position[1]);
                    let oldNode2PosY = parseInt(pill.currPill.node2.position[0]);
                    let oldNode2PosX = parseInt(pill.currPill.node2.position[1]);
                    // Can move left
                    if (oldNode2PosX - 1 >= 0) {
                        // If free space left 
                        if (gameBoard.gameBoardTable[oldNode2PosY][oldNode2PosX - 1] == 0) {
                            // Insert 0 in right's position
                            gameBoard.gameBoardTable[oldNode1PosY][oldNode1PosX] = 0;
                            // Move right one to left's position
                            pill.currPill.node1.position[1] = pill.currPill.node2.position[1];
                            // Move left one, one field to the left
                            pill.currPill.node2.position[1] = (oldNode2PosX - 1).toString();

                            gameBoard.updateGame();
                        } else {
                            console.log("Occupied space left");
                        }
                    } else {
                        console.log("Unable to move left");
                    }
                }
            }
        }

    },

    // Rotate pill left
    rotateLeft: function () {
        if (this.currPill.state == "falling") {
            if (this.currPill.direction == "vertical") {
                // Which cell is one on the bottom
                if /* node1 bottom */ (parseInt(this.currPill.node1.position[0]) > parseInt(this.currPill.node2.position[0])) {
                    // console.log(pill.currPill.node1.color);
                    let oldBotNodeYPos = parseInt(this.currPill.node1.position[0])
                    let oldBotNodeXPos = parseInt(this.currPill.node1.position[1])
                    let oldTopNodeYPos = parseInt(this.currPill.node2.position[0])
                    let oldTopNodeXPos = parseInt(this.currPill.node2.position[1])

                    // There is free place right to bottom node (node1)
                    if (gameBoard.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos + 1] == 0) {
                        gameBoard.clearPillPosition()
                        // Move node1 right
                        this.currPill.node1.position[1] = `${oldBotNodeXPos + 1}` // x + 1
                        // Move node2 down
                        this.currPill.node2.position[0] = `${oldTopNodeYPos + 1}` // y - 1

                        // Change node sides
                        this.currPill.node1.side = "right";
                        this.currPill.node2.side = "left";

                        this.changeCurrPillDirection("horizontal")
                    } else if /* Pill is touching the right edge | If free space left to bottom's node*/
                        (gameBoard.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos - 1] == 0) {

                        gameBoard.clearPillPosition()

                        // Move top node's position left to the bottom node
                        this.currPill.node2.position[0] = `${oldTopNodeYPos + 1}`;
                        this.currPill.node2.position[1] = `${oldTopNodeXPos - 1}`;

                        // Change node sides
                        this.currPill.node1.side = "right"
                        this.currPill.node2.side = "left"

                        this.changeCurrPillDirection("horizontal")
                    }
                    gameBoard.updateGame();
                } else if /* node2 bottom */ (parseInt(this.currPill.node2.position[0]) > parseInt(this.currPill.node1.position[0])) {
                    // console.log(pill.currPill.node2.color);
                    let oldBotNodeYPos = parseInt(this.currPill.node2.position[0])
                    let oldBotNodeXPos = parseInt(this.currPill.node2.position[1])
                    let oldTopNodeYPos = parseInt(this.currPill.node1.position[0])
                    let oldTopNodeXPos = parseInt(this.currPill.node1.position[1])

                    // There is free place right to bottom node (node2)
                    if (gameBoard.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos + 1] == 0) {
                        gameBoard.clearPillPosition()

                        // Move node2 right
                        this.currPill.node2.position[1] = `${oldBotNodeXPos + 1}` // x + 1
                        // Move node1 down
                        this.currPill.node1.position[0] = `${oldTopNodeYPos + 1}` // y - 1

                        // Change node sides
                        this.currPill.node1.side = "left"
                        this.currPill.node2.side = "right"

                        this.changeCurrPillDirection("horizontal")
                    } else if /* Pill is touching the right edge | If free space left to bottom's node */
                        (gameBoard.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos - 1] == 0) {
                        gameBoard.clearPillPosition()

                        // Move top node's position left to the bottom node
                        this.currPill.node1.position[0] = `${oldTopNodeYPos + 1}`;
                        this.currPill.node1.position[1] = `${oldTopNodeXPos - 1}`;

                        // Change node sides
                        this.currPill.node1.side = "left"
                        this.currPill.node2.side = "right"

                        this.changeCurrPillDirection("horizontal")
                    }
                } else {
                    console.log("Unexpected error");
                }
                gameBoard.updateGame();

            } else if (this.currPill.direction == "horizontal") {
                // If pill not on the top
                if (parseInt(this.currPill.node1.position[0]) > 0) {

                    // Which node is closer right
                    if /* node1 right */ (parseInt(this.currPill.node1.position[1]) > parseInt(this.currPill.node2.position[1])) {
                        // console.log(pill.currPill.node1.color);
                        let oldRightNodeYPos = parseInt(this.currPill.node1.position[0])
                        let oldRightNodeXPos = parseInt(this.currPill.node1.position[1])
                        let oldLeftNodeYPos = parseInt(this.currPill.node2.position[0])
                        let oldLeftNodeXPos = parseInt(this.currPill.node2.position[1])

                        // If free place top to left node (node2)
                        if (gameBoard.gameBoardTable[oldLeftNodeYPos - 1][oldLeftNodeXPos] == 0) {
                            gameBoard.clearPillPosition()

                            // Move right node (node1) top
                            this.currPill.node1.position[0] = `${oldRightNodeYPos - 1}`
                            this.currPill.node1.position[1] = `${oldRightNodeXPos - 1}`

                            // Change node sides
                            this.currPill.node1.side = "up"
                            this.currPill.node2.side = "down"

                            this.changeCurrPillDirection("vertical")
                        }
                    } else if /* node2 right */ (parseInt(this.currPill.node2.position[1]) > parseInt(this.currPill.node1.position[1])) {
                        // console.log(pill.currPill.node2.color);
                        let oldRightNodeYPos = parseInt(this.currPill.node2.position[0])
                        let oldRightNodeXPos = parseInt(this.currPill.node2.position[1])
                        let oldLeftNodeYPos = parseInt(this.currPill.node1.position[0])
                        let oldLeftNodeXPos = parseInt(this.currPill.node1.position[1])

                        // If free place top to left node (node1)
                        if (gameBoard.gameBoardTable[oldLeftNodeYPos - 1][oldLeftNodeXPos] == 0) {
                            gameBoard.clearPillPosition()

                            // Move right node (node2) top
                            this.currPill.node2.position[0] = `${oldRightNodeYPos - 1}`
                            this.currPill.node2.position[1] = `${oldRightNodeXPos - 1}`

                            // Change node sides
                            this.currPill.node1.side = "down"
                            this.currPill.node2.side = "up"

                            this.changeCurrPillDirection("vertical")
                        }
                    } else {
                        console.log("Unexpected error");
                    }
                    gameBoard.updateGame()
                } else {
                    console.log("Pill on the top");
                }
            }
        }
        // console.log(gameBoard.gameBoardTable);

    },

    // Rotate pill right
    rotateRight: function () {
        if (this.currPill.state == "falling") {
            if (this.currPill.direction == "vertical") {
                // Which cell is one on the bottom
                if /* node1 bottom */ (parseInt(this.currPill.node1.position[0]) > parseInt(this.currPill.node2.position[0])) {
                    // console.log(pill.currPill.node1.color);
                    let oldBotNodeYPos = parseInt(this.currPill.node1.position[0])
                    let oldBotNodeXPos = parseInt(this.currPill.node1.position[1])
                    let oldTopNodeYPos = parseInt(this.currPill.node2.position[0])
                    let oldTopNodeXPos = parseInt(this.currPill.node2.position[1])

                    // There is free place right to the bottom node (node1)
                    if (gameBoard.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos + 1] == 0) {
                        gameBoard.clearPillPosition()

                        // Move node2 right & down
                        this.currPill.node2.position[0] = `${oldTopNodeYPos + 1}` // y + 1
                        this.currPill.node2.position[1] = `${oldTopNodeXPos + 1}` // x + 1

                        // Change node sides
                        this.currPill.node1.side = "left"
                        this.currPill.node2.side = "right"

                        this.changeCurrPillDirection("horizontal")
                    } else if/* Pill is touching the right edge | If free space left to bottom's node */
                        (gameBoard.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos - 1] == 0) {
                        gameBoard.clearPillPosition()

                        // Move top node down 
                        this.currPill.node2.position[0] = `${oldTopNodeYPos + 1}`; // y + 1
                        // Move bottom node left                            
                        this.currPill.node1.position[1] = `${oldTopNodeXPos - 1}`; // x - 1

                        // Change node sides
                        this.currPill.node1.side = "right"
                        this.currPill.node2.side = "left"

                        pill.changeCurrPillDirection("horizontal")
                    } else {
                        console.log("No av space on both sides");
                    }
                    gameBoard.updateGame();
                } else if /* node2 bottom */ (parseInt(this.currPill.node2.position[0]) > parseInt(this.currPill.node1.position[0])) {
                    // console.log(pill.currPill.node2.color);
                    let oldBotNodeYPos = parseInt(this.currPill.node2.position[0])
                    let oldBotNodeXPos = parseInt(this.currPill.node2.position[1])
                    let oldTopNodeYPos = parseInt(this.currPill.node1.position[0])
                    let oldTopNodeXPos = parseInt(this.currPill.node1.position[1])

                    // There is free place right to bottom node (node2)
                    if (gameBoard.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos + 1] == 0) {
                        gameBoard.clearPillPosition()

                        // Move node1 right & down
                        this.currPill.node1.position[0] = `${oldTopNodeYPos + 1}` // y + 1
                        this.currPill.node1.position[1] = `${oldTopNodeXPos + 1}` // x + 1

                        // Change node sides
                        this.currPill.node1.side = "right"
                        this.currPill.node2.side = "left"

                        this.changeCurrPillDirection("horizontal")
                    } else if /* Pill is touching the right edge | If free space left to bottom's node */
                        (gameBoard.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos - 1] == 0) {
                        gameBoard.clearPillPosition()

                        // Move top node down 
                        this.currPill.node1.position[0] = `${oldTopNodeYPos + 1}`; // y + 1
                        // Move bottom node left                            
                        this.currPill.node1.position[1] = `${oldTopNodeXPos - 1}`; // x - 1

                        // Change node sides
                        this.currPill.node1.side = "left"
                        this.currPill.node2.side = "right"

                        this.changeCurrPillDirection("horizontal")
                    } else {
                        console.log("No av space on both sides");
                    }
                } else {
                    console.log("Unexpected error");
                }
                gameBoard.updateGame();

            } else if (this.currPill.direction == "horizontal") {
                // If pill not on the top
                if (parseInt(this.currPill.node1.position[0]) > 0) {
                    // Which node is closer right
                    if /* node1 right */ (parseInt(this.currPill.node1.position[1]) > parseInt(this.currPill.node2.position[1])) {
                        // console.log(pill.currPill.node1.color);
                        let oldRightNodeYPos = parseInt(this.currPill.node1.position[0])
                        let oldRightNodeXPos = parseInt(this.currPill.node1.position[1])
                        let oldLeftNodeYPos = parseInt(this.currPill.node2.position[0])
                        let oldLeftNodeXPos = parseInt(this.currPill.node2.position[1])

                        // If free place top to left node (node2)
                        if (gameBoard.gameBoardTable[oldLeftNodeYPos - 1][oldLeftNodeXPos] == 0) {
                            gameBoard.clearPillPosition()

                            // Move left node top
                            this.currPill.node2.position[0] = `${oldRightNodeYPos - 1}`
                            // Move right node left
                            this.currPill.node1.position[1] = `${oldRightNodeXPos - 1}`

                            // Change node sides
                            this.currPill.node1.side = "down"
                            this.currPill.node2.side = "up"

                            this.changeCurrPillDirection("vertical")
                        }
                    } else if /* node2 right */ (parseInt(this.currPill.node2.position[1]) > parseInt(this.currPill.node1.position[1])) {
                        // console.log(pill.currPill.node2.color);
                        let oldRightNodeYPos = parseInt(this.currPill.node2.position[0])
                        let oldRightNodeXPos = parseInt(this.currPill.node2.position[1])
                        let oldLeftNodeYPos = parseInt(this.currPill.node1.position[0])
                        let oldLeftNodeXPos = parseInt(this.currPill.node1.position[1])

                        // If free place top to left node (node1)
                        if (gameBoard.gameBoardTable[oldLeftNodeYPos - 1][oldLeftNodeXPos] == 0) {
                            gameBoard.clearPillPosition()

                            // Move left node top
                            this.currPill.node1.position[0] = `${oldRightNodeYPos - 1}`
                            // Move right node left
                            this.currPill.node2.position[1] = `${oldRightNodeXPos - 1}`

                            // Change node sides
                            this.currPill.node1.side = "up"
                            this.currPill.node2.side = "down"

                            this.changeCurrPillDirection("vertical")
                        }
                    } else {
                        console.log("Unexpected error");
                    }
                    gameBoard.updateGame()
                } else {
                    console.log("Pill on the top");
                }
            } else {
                console.log("Unknown pill orientation");
            }
        }
        console.log(gameBoard.gameBoardTable);
    },

    // Make pill fall down
    fallDown: function () {
        // Lock the keyboard (move keys don't) while pill is falling down
        document.onkeydown = null;
        clearInterval(this.fallInterval)
        // Make a pill fall down very fast
        this.falling(50)
    },

    findMatches: function (gravityOn) {
        // Vertical
        for (let x = 0; x < 8; x++) {
            let colorsRow = []
            let positions = []
            let streakBroken = false;
            for (let y = 0; y < 16; y++) {
                if (gameBoard.gameBoardTable[y][x] != 0) {

                    if ((colorsRow.length == 0 || gameBoard.gameBoardTable[y][x].color == colorsRow[colorsRow.length - 1]) && streakBroken == false) {
                        colorsRow.push(gameBoard.gameBoardTable[y][x].color)
                        positions.push(gameBoard.gameBoardTable[y][x].position)

                    } else if (gameBoard.gameBoardTable[y][x].color != colorsRow[colorsRow.length - 1]) {
                        if (colorsRow.length >= 4) {
                            streakBroken = true;
                        } else {
                            colorsRow = []
                            positions = []
                            colorsRow.push(gameBoard.gameBoardTable[y][x].color)
                            positions.push(gameBoard.gameBoardTable[y][x].position)
                        }
                    }
                } else {
                    if (colorsRow.length < 4) {
                        colorsRow = []
                        positions = []
                    } else {
                        streakBroken = true;
                    }
                }
            }

            if (colorsRow.length >= 4) {
                for (let x = 0; x < positions.length; x++) {
                    gameBoard.gameBoardTable[parseInt(positions[x][0])][parseInt(positions[x][1])].toBeDeleted = true;

                    // Look for neighbouring pill fragments
                    this.checkIfSamePillId(positions, x)

                    // console.log(gameBoard.gameBoardTable[parseInt(positions[x][0])][parseInt(positions[x][1])]);
                }
            }
        }

        // Horizontal
        for (let y = 0; y < 16; y++) {
            let colorsRow = []
            let positions = []
            let streakBroken = false;
            for (let x = 0; x < 8; x++) {
                if (gameBoard.gameBoardTable[y][x] != 0) {

                    if ((colorsRow.length == 0 || gameBoard.gameBoardTable[y][x].color == colorsRow[colorsRow.length - 1]) && streakBroken == false) {
                        colorsRow.push(gameBoard.gameBoardTable[y][x].color)
                        positions.push(gameBoard.gameBoardTable[y][x].position)

                    } else if (gameBoard.gameBoardTable[y][x].color != colorsRow[colorsRow.length - 1]) {
                        if (colorsRow.length >= 4) {
                            streakBroken = true;
                        } else {
                            colorsRow = []
                            positions = []
                            colorsRow.push(gameBoard.gameBoardTable[y][x].color)
                            positions.push(gameBoard.gameBoardTable[y][x].position)
                        }
                    }
                } else {
                    if (colorsRow.length < 4) {
                        colorsRow = []
                        positions = []
                    } else {
                        streakBroken = true;
                    }
                }
            }

            if (colorsRow.length >= 4) {
                for (let x = 0; x < positions.length; x++) {
                    gameBoard.gameBoardTable[parseInt(positions[x][0])][parseInt(positions[x][1])].toBeDeleted = true;

                    // Look for neighbouring pill fragments
                    this.checkIfSamePillId(positions, x)

                    // console.log(gameBoard.gameBoardTable[parseInt(positions[x][0])][parseInt(positions[x][1])]);
                }
            }
        }

        if (gravityOn == false) {
            this.clearMatches()
        }
    },

    clearMatches: function () {
        let sthWasDeleted = false;
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 8; x++) {
                if (gameBoard.gameBoardTable[y][x].toBeDeleted == true) {
                    sthWasDeleted = true;
                    if (gameBoard.gameBoardTable[y][x].type == "virus") {
                        virus.deleted()
                        let nodeColor = gameBoard.gameBoardTable[y][x].color
                        document.getElementById(`node${gameBoard.cordsToId(y, x)}`).style = `background-image: url("./img/${nodeColor}_x.png")`
                    } else {
                        let nodeColor = gameBoard.gameBoardTable[y][x].color;
                        document.getElementById(`node${gameBoard.cordsToId(y, x)}`).style = `background-image: url("./img/${nodeColor}_o.png")`
                    }
                    setTimeout(() => {
                        gameBoard.gameBoardTable[y][x] = 0
                        gameBoard.refreshGameBoard()
                    }, 100);
                }
            }
        }

        if (sthWasDeleted == true) {
            gameBoard.gravity()
        } else {
            doctor.throwPill()
        }
    },

    checkIfSamePillId: function (positions, x) {
        // neighbouring node has the same id as the one looked at 
        let positionY = parseInt(positions[x][0])
        let positionX = parseInt(positions[x][1])


        // Look left
        if (positionX - 1 >= 0 && gameBoard.gameBoardTable[positionY][positionX - 1] != 0) {
            if (gameBoard.gameBoardTable[positionY][positionX - 1].id == gameBoard.gameBoardTable[positionY][positionX].id) {
                gameBoard.gameBoardTable[positionY][positionX - 1].isSingle = true
            }
        }
        // Look right
        if (positionX + 1 < 8 && gameBoard.gameBoardTable[positionY][positionX + 1] != 0) {
            if (gameBoard.gameBoardTable[positionY][positionX + 1].id == gameBoard.gameBoardTable[positionY][positionX].id) {
                gameBoard.gameBoardTable[positionY][positionX + 1].isSingle = true
            }
        }
        // Look top
        if (positionY - 1 >= 0 && gameBoard.gameBoardTable[positionY - 1][positionX] != 0) {
            if (gameBoard.gameBoardTable[positionY - 1][positionX].id == gameBoard.gameBoardTable[positionY][positionX].id) {
                gameBoard.gameBoardTable[positionY - 1][positionX].isSingle = true
            }
        }
        // Look bottom
        if (positionY + 1 < 16 && gameBoard.gameBoardTable[positionY + 1][positionX] != 0) {
            if (gameBoard.gameBoardTable[positionY + 1][positionX].id == gameBoard.gameBoardTable[positionY][positionX].id) {
                gameBoard.gameBoardTable[positionY + 1][positionX].isSingle = true
            }
        }

        gameBoard.refreshGameBoard()

    },
}
