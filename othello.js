class Facilitator{
    constructor(users, board){
        this.users = users;
        this.board = board;
    }

    run(){}
    ifUserCanPutStoneOnTheCell(user, cell){}
}

class User{
    constructor(name, stones, stoneColor){
        this.name       = name;
        this.stones     = stones;
        this.stoneColor = stoneColor;
    }

    putAStone(cell){}
    reverseStone(board, cell){}
    getCellsUserCanPutAStone(board){}
}

class Board{
    constructor(cells){
        this.cells = cells;
    }


    isThereAnyCellUserCanPutAStone(user){}
    isAllCellPutAStone(){}
}

class Cell{
    constructor(row, col){
        this.stone = null;
        this.row   = row;
        this.col   = col;
    }

    isPutAStone(){}
}

class Stone{
    constructor(color){
        this.color = color;
    }

    isBlack(){}
    isWhite(){}
}

class UserBuilder{}
class BoardBuilder{}
class CellBuilder{}

let facilitator = new Facilitator([], "");