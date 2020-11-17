const width = 7;
const height = 6;
let currPlayer = 1; // active player: 1 or 2; starts ar 1
const board = []; // array of rows, each row is array of cells  (board[y][x])

//makeBoard: create in-JS board structure:
//board = array of rows, each row is array of cells  (board[y][x])

const makeBoard = () => {
  for(let i=0; i <height; i++){
    board[i]=new Array(); //creates an empty array (6 times)
    for(let j=0; j<width; j++){ 
      board[i][j] = null // creates a null element for the desired width (7) for each row
    }
  }
  return board //final output of board
}
/** makeHtmlBoard: make HTML table and row of column tops. */
const body = document.querySelector('body');
const thePlayer = document.createElement('div');
thePlayer.classList.add('whichPlayer')
const playerNow = document.createElement('div'); //create div to display the current player to make next move


const makeHtmlBoard = () => {
  const htmlBoard = document.querySelector('#board'); 
  thePlayer.innerText = 'Your Turn:'
  playerNow.innerText = `Player ${currPlayer}`;
  const top = document.createElement("tr"); // top row to click on the play piece
  top.setAttribute("id", "column-top"); // creates the top row (<tr>) for out connect4 table
  top.addEventListener("click", handleClick); //EventListener added to excute the handleClick funtion if the top (row) is clicked --> so only works for top square...

  for (let i = 0; i < width; i++) {
    const headCell = document.createElement("td"); //creates a data cell for every column (width)
    headCell.setAttribute("id", i);  // each headcell is given a unique id from 0 to the width (here 7 is width so will be 0 to 6)
    headCell.innerText='Click to Drop Piece';
    top.append(headCell); //each <td> is added to the top row
  }
  htmlBoard.append(top); //this adds the top row with all of the headCells to the htmlBoard (existing html element)

  // TODO: add comment for this code
  for (let i = 0; i < height; i++) {
    const row = document.createElement("tr"); //creates a new row; loops through to create however many up to the desired height (of 6)
    for (let j = 0; j < width; j++) {
      const cell = document.createElement("td"); //new cells being created for the row (for each column (width))
      cell.setAttribute("id", `${i}-${j}`); //each cell will be given an id of its row - column (unique identifier)
      row.append(cell); //append these <td>'s to the row;
    }
    htmlBoard.append(row); //append the rows to the existing htmlBoard (they will be lined up under the top row)
  }
}

//findSpotForCol: given column x, return top empty y (null if filled) 
const findSpotForCol = x => {
  for(let i=height -1; i >=0; i--){ // loops through 5 to 0 indeces (so from bottom row to the top)
    if(board[i][x] === null){ // check if the current spot at the bottom of the column is empty 
      board[i][x]= currPlayer; //null will be changed to the current player (1 or 2)
      return i //return i (the row)
    }
  } 
  return null // returns null if there's no spot left in that column for any of the rows aka if statement never runs
}

//placeInTable: update DOM to place piece into HTML table of board 
const placeInTable = (y, x) => {
  const myPiece = document.createElement('div'); // create a new div for the piece (div should appear as a colored circle)
  myPiece.classList.add("piece");//adds the class of "piece" for each myPiece <div>;
  if(currPlayer === 1){ //set to 1 globally at start of game
    myPiece.classList.add("p1");
  } else if (currPlayer === 2) {
    myPiece.classList.add("p2")
  }
 
  const thisCell = document.getElementById(`${y}-${x}`); //this is the id of the cell the piece should go into
  thisCell.append(myPiece); //append the div element (the piece) to a <td> (table data cell);
}

//execute if game ends (either a win or a tie if board's filled)
const endGame = msg => {
    alert(msg)
}

//handleClick: handle click of column top to play piece 
function handleClick(evt) {
  if(checkForWin()){ //prevents more clicks from being handled if a winner has already been declared
    return alert('A player has already won. Refresh page to begin again');
  };

  if(checkForTie()){ //prevents more clicks from being handled if a tie has already happened
    return alert('There are no more moves left. Refresh page to begin again');
  }
  // get x from ID of clicked cell
  const x = +evt.target.id;
  console.log(x)
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return alert('This column is full, please choose another spot'); //if there's no more spots in the column this will pop up
  }
  // place piece in board and add to HTML table
  placeInTable(y, x);
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if(checkForTie()){ //if checkForTie (is a tie) evaluates to true
    return endGame(`The board is filled. Player 1 and Player 2 tie!`) //alert this message id there's a tie
  }

  // switch players
  if(currPlayer === 1){
    currPlayer = 2;
  } else if(currPlayer === 2){
    currPlayer = 1;
  }

  playerNow.innerText = `Player ${currPlayer}`;
  
}

function checkForTie(){
  for(let array of board){
    return array.every(value => value) //will return true if no value is equal to null, so when the board is filled
  }
}

//checkForWin: check board cell-by-cell for "does a win start here?" 
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < height &&
        x >= 0 &&
        x < width &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
const container = document.querySelector('.container')
const startButton = document.querySelector('#startGame');
const key = document.createElement('div');
const space = document.createElement('br');
key.innerText = 'Player 1 is Yellow, Player 2 is Red'
key.classList.add('key');
startButton.addEventListener('click', e => {
  e.preventDefault();
  makeBoard(); //make js baord of arrays
  makeHtmlBoard(); //make HTML board (table)
  container.append(thePlayer);
  thePlayer.append(playerNow);
  container.append(space);
  container.append(key);
  startButton.remove();
})


