"use strict";
import { pill } from "./pill.js"
import { keyboard } from "./keyboard.js"
import { virus } from "./virus.js"
import { doctor } from "./doctor.js";
export { gameBoard }

// GameBoard object
var gameBoard = {
    gameBoardDiv: document.getElementById("gameBoard"),

    // Generate 2d array filled with 0s (16 x 8)
    generateGameArray: function () {
        var gameArr = []
        for (let y = 0; y < 16; y++) {
            gameArr[y] = []
            for (let x = 0; x < 8; x++) {
                gameArr[y][x] = 0
            }
        }
        // Add gameboard to an object
        this.gameBoardTable = gameArr;
    },

    // gameboardTable = [][],

    // Generate a div gameBoard displayed on screen
    generateGameDiv: function () {
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 8; x++) {
                let el = document.createElement("div")
                el.className = "gameBoardField"

                // div id names
                if (y < 10) {
                    el.id = `node0${y}${x}`
                } else {
                    el.id = `node${y}${x}`
                }

                this.gameBoardDiv.appendChild(el)
            }
        }
    },

    refreshGameBoard: function () {
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 8; x++) {
                // If a pill node in gameBoardTable (array)
                if (this.gameBoardTable[y][x] != 0) {
                    if (this.gameBoardTable[y][x].type == "pill") {
                        let pillColor = this.gameBoardTable[y][x].color
                        let pillSide = this.gameBoardTable[y][x].side
                        let pillSingle = this.gameBoardTable[y][x].isSingle
                        if (pillSingle == true) {
                            document.getElementById(`node${this.cordsToId(y, x)}`).style = `background-image: url("./img/${pillColor}_dot.png")`
                        } else {
                            document.getElementById(`node${this.cordsToId(y, x)}`).style = `background-image: url("./img/${pillColor}_${pillSide}.png")`
                        }
                    } else {
                        document.getElementById(`node${this.cordsToId(y, x)}`).style = `background-image: url("./img/covid_${this.gameBoardTable[y][x].color}.png")`
                    }
                } else /* If empty field */ {
                    // Set no background-image
                    document.getElementById(`node${this.cordsToId(y, x)}`).style = `background-image: none;`
                }
            }
        }
    },

    cordsToId: function (givenY, givenX) {
        let Id;

        if (givenY < 10) {
            Id = `0${givenY}`
        } else {
            Id = givenY.toString()
        }

        Id += givenX.toString();

        return Id;
    },

    // Working not proven
    idToCords: function (givenId) {
        let X, Y;

        if (givenId.length == 3) {
            Y = parseInt(givenId.substr(0, 2))
            X = parseInt(givenId[2])
        } else if (givenId.length == 2) {
            Y = parseInt(givenId[0])
            X = parseInt(givenId[1])
        } else {
            console.log("idToCords conversion error");
        }

        return { y: Y, x: X }
    },

    updateGame: function () {
        // Update current pill location to gameBoardTable (arr)
        pill.updatePillPosition()

        // Draw Pill Id
        // pill.drawPillId()

        // Update gameBoardDiv
        this.refreshGameBoard();


        // console.table(gameBoard.gameBoardTable);

    },

    clearPillPosition: function () {
        // Clears current pill's position in gameBoardTable (gameBoard array)
        this.gameBoardTable[parseInt(pill.currPill.node1.position[0])][parseInt(pill.currPill.node1.position[1])] = 0;
        this.gameBoardTable[parseInt(pill.currPill.node2.position[0])][parseInt(pill.currPill.node2.position[1])] = 0;
    },

    gravity: function () {
        var gravityInterval = setInterval(() => {
            var sthHasFallen = false;
            var searchedId = []

            console.log("gravity");

            for (let y = 15; y >= 0; y--) {
                for (let x = 0; x < 8; x++) {
                    let field = this.gameBoardTable[y][x]

                    if (field != 0) {
                        if (field.type == "pill") {
                            // Pill wasn't processed
                            if (searchedId.includes(field.id) == false) {
                                // Mark pill processed
                                searchedId.push(field.id)

                                // Add field's position to an array
                                let pillPosition = []
                                pillPosition.push(field.position)

                                // Try to find another field with matching id
                                // check left
                                if (x - 1 >= 0) {
                                    // if it's not empty and is a pill
                                    if (this.gameBoardTable[y][x - 1] != 0 && this.gameBoardTable[y][x - 1].type == "pill") {
                                        // if id match
                                        if (this.gameBoardTable[y][x - 1].id == field.id) {
                                            pillPosition.push(this.gameBoardTable[y][x - 1].position)
                                        }
                                    }
                                }

                                // check right
                                if (x + 1 < 8) {
                                    // if it's not empty and is a pill
                                    if (this.gameBoardTable[y][x + 1] != 0 && this.gameBoardTable[y][x + 1].type == "pill") {
                                        // if id match
                                        if (this.gameBoardTable[y][x + 1].id == field.id) {
                                            pillPosition.push(this.gameBoardTable[y][x + 1].position)
                                        }
                                    }
                                }

                                // check top
                                if (y - 1 >= 0) {
                                    // if it's not empty and is a pill
                                    if (this.gameBoardTable[y - 1][x] != 0 && this.gameBoardTable[y - 1][x].type == "pill") {
                                        // if id match
                                        if (this.gameBoardTable[y - 1][x].id == field.id) {
                                            pillPosition.push(this.gameBoardTable[y - 1][x].position)
                                        }
                                    }
                                }

                                // console.log(pillPosition);

                                // If not only one node
                                if (pillPosition.length > 1) {

                                    // If a pill is vertical - same x's
                                    if (pillPosition[0][1] == pillPosition[1][1]) {
                                        let bottomNode = pillPosition[0];

                                        // If not on the bikini bottom
                                        if (parseInt(bottomNode[0]) + 1 < 16) {
                                            // If has free space underneath
                                            if (this.gameBoardTable[parseInt(bottomNode[0]) + 1][parseInt(bottomNode[1])] == 0) {
                                                sthHasFallen = true

                                                // Move pill down by one field
                                                let oldBotNodeYPos = parseInt(bottomNode[0])
                                                let oldBotNodeXPos = parseInt(bottomNode[1])

                                                // Move bottom node down
                                                this.gameBoardTable[oldBotNodeYPos + 1][oldBotNodeXPos] = this.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos]
                                                this.gameBoardTable[oldBotNodeYPos + 1][oldBotNodeXPos].position[0] = `${oldBotNodeYPos + 1}`

                                                // Move top node bottom
                                                this.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos] = this.gameBoardTable[oldBotNodeYPos - 1][oldBotNodeXPos]
                                                this.gameBoardTable[oldBotNodeYPos][oldBotNodeXPos].position[0] = `${oldBotNodeYPos}`

                                                // Clear top node's position
                                                this.gameBoardTable[oldBotNodeYPos - 1][oldBotNodeXPos] = 0

                                                this.refreshGameBoard()
                                                // pill.drawPillId()
                                            }
                                        }
                                    } else {
                                        // pill is horizontal
                                        let leftNode = pillPosition[0];
                                        let rightNode = pillPosition[1];

                                        // If whole pill not on the bikini bottom
                                        if (parseInt(leftNode[0]) + 1 < 16 && parseInt(rightNode[0]) + 1 < 16) {
                                            // If has free space underneath
                                            if (gameBoard.gameBoardTable[parseInt(leftNode[0]) + 1][parseInt(leftNode[1])] == 0 &&
                                                gameBoard.gameBoardTable[parseInt(rightNode[0]) + 1][parseInt(rightNode[1])] == 0
                                            ) {
                                                sthHasFallen = true

                                                // Move pill down by one field
                                                let oldLeftNodeYPos = parseInt(leftNode[0])
                                                let oldLeftNodeXPos = parseInt(leftNode[1])
                                                let oldRightNodeYPos = parseInt(rightNode[0])
                                                let oldRightNodeXPos = parseInt(rightNode[1])

                                                // Move left node down
                                                this.gameBoardTable[oldLeftNodeYPos + 1][oldLeftNodeXPos] = this.gameBoardTable[oldLeftNodeYPos][oldLeftNodeXPos]
                                                this.gameBoardTable[oldLeftNodeYPos + 1][oldLeftNodeXPos].position[0] = `${oldLeftNodeYPos + 1}`

                                                // Move right node down
                                                this.gameBoardTable[oldRightNodeYPos + 1][oldRightNodeXPos] = this.gameBoardTable[oldRightNodeYPos][oldRightNodeXPos]
                                                this.gameBoardTable[oldRightNodeYPos + 1][oldRightNodeXPos].position[0] = `${oldRightNodeYPos + 1}`

                                                // Clear top & bot node's position
                                                this.gameBoardTable[oldLeftNodeYPos][oldLeftNodeXPos] = 0
                                                this.gameBoardTable[oldRightNodeYPos][oldRightNodeXPos] = 0

                                                this.refreshGameBoard()
                                                // pill.drawPillId()
                                            }
                                        }
                                    }
                                } else {
                                    // a single field

                                    // If not on the bikini bottom
                                    if (parseInt(pillPosition[0][0]) + 1 < 16) {
                                        // If has free space underneath
                                        if (this.gameBoardTable[parseInt(pillPosition[0][0]) + 1][parseInt(pillPosition[0][1])] == 0) {
                                            sthHasFallen = true

                                            // Move pill down by one field
                                            let oldNodeYPos = parseInt(pillPosition[0][0])
                                            let oldNodeXPos = parseInt(pillPosition[0][1])

                                            // Move node down
                                            this.gameBoardTable[oldNodeYPos + 1][oldNodeXPos] = this.gameBoardTable[oldNodeYPos][oldNodeXPos]
                                            this.gameBoardTable[oldNodeYPos + 1][oldNodeXPos].position[0] = `${oldNodeYPos + 1}`

                                            // Clear previous node's position
                                            this.gameBoardTable[oldNodeYPos][oldNodeXPos] = 0

                                            this.refreshGameBoard()
                                            // pill.drawPillId()
                                        }
                                    }
                                }
                            }
                        } else {
                            // field is a virus
                        }
                    } else {
                        // empty field
                    }
                }
            }

            this.refreshGameBoard()

            // Find if sth was to be deleted and delete it
            pill.findMatches(true)
            this.refreshGameBoard()

            for (let y = 0; y < 16; y++) {
                for (let x = 0; x < 8; x++) {
                    if (this.gameBoardTable[y][x].toBeDeleted == true) {
                        if (this.gameBoardTable[y][x].type == "virus") {
                            virus.deleted()
                            let nodeColor = this.gameBoardTable[y][x].color
                            document.getElementById(`node${this.cordsToId(y, x)}`).style = `background-image: url("./img/${nodeColor}_x.png")`
                            sthHasFallen = true
                        } else {
                            let nodeColor = this.gameBoardTable[y][x].color;
                            document.getElementById(`node${this.cordsToId(y, x)}`).style = `background-image: url("./img/${nodeColor}_o.png")`
                            sthHasFallen = true
                        }
                        setTimeout(() => {
                            this.gameBoardTable[y][x] = 0
                            this.refreshGameBoard()
                        }, 100);
                    }
                }
            }

            // this.refreshGameBoard()

            if (sthHasFallen == false) {
                // kill gravity interval
                clearInterval(gravityInterval)

                if (virus.count == 0) {
                    this.gameWin()
                } else {
                    doctor.throwPill()
                }

            }

        }, 100);
    },

    updateScore: function (whichScore) {
        if (whichScore == "score") {
            let scoreDiv = document.getElementById(whichScore)
            let currScore = localStorage.getItem(whichScore)
            scoreDiv.children[4].style = `background-image: url("./img/cyfry/${currScore[0]}.png")`
        } else if (whichScore == "highScore") {
            let scoreDiv = document.getElementById(whichScore)
            let currScore = localStorage.getItem("score")
            scoreDiv.children[4].style = `background-image: url("./img/cyfry/${currScore[0]}.png")`
        }
    },


    updateVirusCount: function () {
        let virusDiv = document.getElementById("virusCount")
        virusDiv.children[1].style = `background-image: url("./img/cyfry/${virus.count}.png")`
    },

    gameWin: function () {
        // Update high score
        if (parseInt(localStorage.getItem("score")) > parseInt(localStorage.getItem("highScore"))) {
            this.updateScore("highScore")
        }

        setTimeout(() => {
            // Prompt an alert in the middle of a screen
            let winDiv = document.createElement("div")
            winDiv.id = "winDiv"
            document.getElementById("game").appendChild(winDiv)
        }, 100);
    },

    gameLose: function () {
        // Prompt an alert in the middle of a screen
        let loseDiv = document.createElement("div")
        loseDiv.id = "loseDiv"
        document.getElementById("game").appendChild(loseDiv)

        // Make doctor surprised
        let surprisedDoc = document.createElement("div")
        surprisedDoc.id = "surprisedDoc"
        document.getElementById("game").appendChild(surprisedDoc)

        // Stop rotatnig viruses
        virus.gameIsNotLost = false;
    }

}
