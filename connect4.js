const width = 7;
const height = 6;
let currPlayer = 1; // active player: 1 or 2; starts ar 1
const board = []; // array of rows, each row is array of cells  (board[y][x])

const container = document.querySelector('.container')
const startButton = document.querySelector('#startGame');
startButton.addEventListener('click', e => {
  e.preventDefault();
  makeBoard(); //make js baord of arrays
  makeHtmlBoard(container); //make HTML board (table)
  startButton.remove();
});


const restartButtonDiv = document.createElement('div');
const restartButton=document.createElement('button');
restartButton.innerText = "Play Again"
restartButton.addEventListener('click', function(){
  restartButton.remove();
  const allTRs=document.querySelectorAll('tr');
  for(let tr of allTRs){
    tr.remove()
  }
  const board=[];
  makeBoard();
  makeHtmlBoard(document.querySelector('.container'));
})




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
 //create div to display the current player to make next move



const makeHtmlBoard = (container) => {

  const htmlBoard = document.querySelector('#board');
  
  const thePlayer = document.createElement('div');
  thePlayer.classList.add('whichPlayer');
  thePlayer.innerText = 'Your Turn:';

  const playerNow = document.createElement('div');
  playerNow.classList.add('thisPlayer'); 
  playerNow.innerText = `Player ${currPlayer}`;

  const key = document.createElement('div');
  const space = document.createElement('br');
  key.innerText = 'Player 1 is Yellow, Player 2 is Red';
  key.classList.add('key');

  container.append(thePlayer);
  thePlayer.append(playerNow);
 
  
  container.append(space);
  container.append(key);

  
  const top = document.createElement("tr"); // top row to click on the play piece

  top.setAttribute("id", "column-top"); // creates the top row (<tr>) for out connect4 table
  top.addEventListener("click", handleClick); //EventListener added to excute the handleClick funtion if the top (row) is clicked --> so only works for top square...
  htmlBoard.append(top); 

  for (let i = 0; i < width; i++) {
    const headCell = document.createElement("td"); //creates a data cell for every column (width)
    headCell.setAttribute("id", i);  // each headcell is given a unique id from 0 to the width (here 7 is width so will be 0 to 6)
    headCell.innerHTML= '&darr;';
    top.append(headCell); //each <td> is added to the top row
  }
  //this adds the top row with all of the headCells to the htmlBoard (existing html element)

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
    alert(msg);
    const thePlayer= document.querySelector('.whichPlayer');
    thePlayer.remove();
    const key=document.querySelector('.key');
    key.remove();
    const space = document.querySelector('br');
    space.remove();
    container.append(restartButtonDiv);
    restartButtonDiv.append(restartButton);
}

//handleClick: handle click of column top to play piece 
function handleClick(evt) {
  if(checkForWin()){ //prevents more clicks from being handled if a winner has already been declared
    return alert('A player has already won. Click "Play Again" for a new game');
  };

  if(checkForTie()){ //prevents more clicks from being handled if a tie has already happened
    return alert('There are no more moves left. Click "Play Again" for a new game');
  }
  // get x from ID of clicked cell
  const x = +evt.target.id;
  
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

  const playerNow = document.querySelector('.thisPlayer');
  playerNow.innerText = `Player ${currPlayer}`; //changes the innerText each turn to display the current player
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
        y >= 0 && //confines of the y-coordinate is in between 0 and the height of board
        y < height &&
        x >= 0 && //confines of the x-coordinate is in between 0 and the height of board
        x < width &&
        board[y][x] === currPlayer  //does this spot in the board contain the currPlayer...if all 4 does, will return true
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { //checks if any of the four possibilities are true, meaning there is a win
        return true;
      }
    }
  }

}


