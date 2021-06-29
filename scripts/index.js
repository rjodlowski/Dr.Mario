"use strict";
import { gameBoard } from "./gameBoard.js"
import { pill } from "./pill.js"
import { keyboard } from "./keyboard.js"
import { virus } from "./virus.js"
import { doctor } from "./doctor.js";

// Create game 2D array
gameBoard.generateGameArray()

// Create visible gameBoard based on gameBoard array
gameBoard.generateGameDiv()

// Create spyglass animation
virus.animateSpyglass();

// Create set number of viruses
for (let x = 0; x < 4; x++) {
    virus.create();
}

// Crete points
virus.createScore();

// Refresh gameBoard
gameBoard.refreshGameBoard()

// Generate throwing array
doctor.generateThrowArr();

// Doctor throws a pill
doctor.throwPill()

// Key press detection
document.onkeydown = keyboard.keyPressed;


