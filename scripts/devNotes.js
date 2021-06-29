// ------- ISSUES --------
// 1) Two keys pressed at the same time (right % left movement)
//      Second function call, when one (of held 2) key lifted
//      Function called again for key held down after lifting previous one
//
// 2) Not everywhere pill node's Y position is kept 2-digit (might cause issues)
//
// 3)
//
//



// ------- DEV NOTES --------
// 1) Generate a pill
//      Generate a node and attach to a pill x2
//          Attributes:
//          State: falling (false) | static (true)
//          Color
//          Orientation
//          Primary node
//
// 2) Falling pills
//      Interval pill falling
//      Meantime direction change
//          Get pressed key
//          Apply action (rotation or fall)
//
// Method translating gameBoardDiv id's to gameBoardArr coords
//
//
// 3) Pill's rotation
//      Left:
//          Górna leci na dół, a dolna leci w prawo
//              1 . =>  . . 
//              2 . =>  1 2
//          Prawa leci nad górną, lewa zostaje na miejscu   
//              . . =>  2 .
//              1 2 =>  1 .
//      Right: 
//          Lewa leci do góry, prawa zajmuje miejsce pod nią
//               . . =>  1 . 
//               1 2 =>  2 .
//          Górna leci na prawo od dolnej, dolna zostaje w miejscu
//               1 . =>  . . 
//               2 . =>  2 1  
//
// 4) Gravity
//      może zamiast sprawdzać całego gameboarda, ma szukać po prawej,
//      nad i po lewej czy nie ma pola o podobnym id (idk czy może być pod
//      - raczej nie, nie ma sensu) - done
//      
//      jeżeli znajdzie similar one, dodaje go do arraya (mamy całego pilla)
//       - pasowałoby zachowywać info czy był poziomo czy pionowo
// 
//      dla każdego pilla vertical sprawdza, czy nie ma niczego pod array[0]
//       - dolny pill, i jeśli nie to opada
//      
//      dla każdego pilla horizontal sprawdza, czy nie ma pod jednym albo
//       drugim niczego innego i jeśli nie ma nic pod żadnym z nich, 
//      to opada cały pill (oba pola) 
//      
//      jeżeli cokolwiek opadło - zmienna na true
//      
//      gameboard.refreshGameboard()
//      
//      jeżeli zmienna == true, to grawitacja zostaje wywołana ponownie

// TODO
// 1) - stop rotatnig viruses after game over (plus swapping between only two graphics)
