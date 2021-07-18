const numberOfCells           = 64;
const numberOfEachStones      = numberOfCells/2;
const numberOfCellsPerEachRow = Math.sqrt(numberOfCells);

class Facilitator{
    constructor(users, board){
        this.users              = users;
        this.board              = board;
        this.currentUserIndex   = 0;
        this.amountOfBlackStone = 0;
        this.amountOfWhiteStone = 0;
    }

    // 既に石が置かれているかどうか
    ifAStoneIsOnTheCell(col, row){
        this.board.ifAStoneIsOnTheCell(col, row);
    }
    // ユーザーが石を置けるかどうか
    ifUserCanPutStoneOnTheCell(col, row){
        this.currentUser().canPutAStoneOnTheCell(this.board, col, row);
    }
    // ユーザーが石をおく
    userPutAStoneOnTheCell(col, row){
        this.currentUser().putAStone(this.board, col, row);
    }
    // 石をひっくり返す
    userReverseStones(col, row){
        this.currentUser().reverseStones(this.board, col, row);
    }
    // currentUserを更新
    currentUser(){
        return this.users[this.currentUserIndex];
    }
    // インデックスを更新
    updateIndex(){
        this.currentUserIndex = (this.currentUserIndex + 1) & 1;
    }
    // 盤の黒の石の数を更新
    setAmountOfBlackStone(){
        this.amountOfBlackStone = this.board.getAmountOfStones("black");
    }
    // 盤の白の石の数を更新
    setAmountOfWhiteStone(){
        this.amountOfWhiteStone =this.board.getAmountOfStones("white");
    }
}

class User{
    constructor(name, stones, stoneColor){
        this.name       = name;
        this.stones     = stones;
        this.stoneColor = stoneColor;
    }

    // 該当のセルに石を置けるかどうか
    canPutAStoneOnTheCell(board, col, row){}
    // ユーザーが石をおく
    putAStone(board, col, row){}
    // 石をひっくり返す
    reverseStones(board, col, row){}
    // getCellsUserCanPutAStone(board){}
}

class Board{
    constructor(cells){
        this.cells = cells;
    }

    // 既に石が置かれているかどうか
    ifAStoneIsOnTheCell(col, row){
        cells[row][col].isStoneOn();
    }
    getAmountOfStones(color){}
    isThereAnyCellUserCanPutAStone(user){}
    isAllCellPutAStone(){}
}

class Cell{
    constructor(col, row){
        this.stone = null;
        this.col   = col;
        this.row   = row;
    }

    // 既に石が置かれているかどうか
    isStoneOn(){}
    isStoneBlack(){}
    isStoneWhite(){}
}

class Stone{
    constructor(color){
        this.color = color;
        this.image = this.initialImage();
    }

    isBlack(){
        return this.color == "black";
    }
    isWhite(){
        return this.color == "white";
    }
    initialImage(){
        return this.isBlack() ? "black.png" : "white.png"
    }
    turnIntoBlack(){
        this.color = "black";
        this.image = "black.png";
    }
    turnIntoWhite(){
        this.color = "white";
        this.image = "white.png";
    }
}

class UserBuilder{}
class BoardBuilder{}
class CellBuilder{}

let blackStones = [];
for(let i = 0; i < numberOfEachStones; i++){
    blackStones.push(new Stone("black"));
}

let whtieStones = [];
for(let i = 0; i < numberOfEachStones; i++){
    whtieStones.push(new Stone("whtie"));
}

let users = [new User("user1", blackStones, "black"), new User("user2", whtieStones, "white")];

let cells = [];
for(let i = 0; i < numberOfCellsPerEachRow; i++){
    let tmp = [];
    for(let j = 0; j < numberOfCellsPerEachRow; j++){
        tmp.push(new Cell(i,j));
    }
    cells.push(tmp);
}
let board = new Board(cells);

let facilitator = new Facilitator(users, board);

console.log(facilitator);
