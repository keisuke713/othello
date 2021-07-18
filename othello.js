class Facilitator{
    constructor(users, board){
        this.users              = users;
        this.board              = board;
        this.currentUserIndex   = 0;
        this.amountOfBlackStone = 0;
        this.amountOfWhiteStone = 0;
    }

    // 既に石が置かれているかどうか
    ifAStoneIsOnTheCell(row, col){
        this.board.ifAStoneIsOnTheCell(row, col);
    }
    // ユーザーが石を置けるかどうか
    ifUserCanPutStoneOnTheCell(row, col){
        this.currentUser().canPutAStoneOnTheCell(this.board, row, col);
    }
    // ユーザーが石をおく
    userPutAStoneOnTheCell(row, col){
        this.currentUser().putAStone(this.board, row, col);
    }
    // 石をひっくり返す
    userReverseStones(row, col){
        this.currentUser().reverseStones(this.board, row, col);
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
    canPutAStoneOnTheCell(board, row, col){}
    // ユーザーが石をおく
    putAStone(board, row, col){}
    // 石をひっくり返す
    reverseStones(board, row, col){}
    // getCellsUserCanPutAStone(board){}
}

class Board{
    constructor(cells){
        this.cells = cells;
    }

    // 既に石が置かれているかどうか
    ifAStoneIsOnTheCell(row, col){
        cells[row][col].isStoneOn();
    }
    getAmountOfStones(color){}
    isThereAnyCellUserCanPutAStone(user){}
    isAllCellPutAStone(){}
}

class Cell{
    constructor(row, col){
        this.stone = null;
        this.row   = row;
        this.col   = col;
    }

    // 既に石が置かれているかどうか
    isStoneOn(){}
    isStoneBlack(){}
    isStoneWhite(){}
}

class Stone{
    constructor(color){
        this.color      = color;
        this.image = "";
    }

    isBlack(){
        return this.color = "black";
    }
    isWhite(){
        return this.color == "white";
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

let facilitator = new Facilitator([], "");