const config = {
    "target": document.getElementById("target")
}

const numberOfCells           = 64;
const numberOfEachStones      = numberOfCells/2;
const numberOfCellsPerEachRow = Math.sqrt(numberOfCells);

let facilitator = null;

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
    constructor(name, isAI, stones, stoneColor){
        this.name       = name;
        this.isAI       = isAI;
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
    // AIだったらtrue
    AI(){
        return this.isAI == 1;
    }
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

class UsersBuilder{
    static createUsers(user1Name, user1Type, user2Name, user2Type){
        return [
            new User(user1Name, user1Type, StonesBuilder.createStones("black"), "black"), 
            new User(user2Name, user2Type, StonesBuilder.createStones("white"), "white")
        ];
    }
}

class BoardBuilder{
    static createBoard(cells){
        return new Board(cells);
    }
}

class CellsBuilder{
    static createCells(){
        let cells = [];
        for(let i = 0; i < numberOfCellsPerEachRow; i++){
            let tmp = [];
            for(let j = 0; j < numberOfCellsPerEachRow; j++){
                tmp.push(new Cell(i, j));
            }
            cells.push(tmp);
        }
        return cells;
    }
}

class StonesBuilder{
    static createStones(color){
        let stones = [];
        for(let i = 0; i < numberOfEachStones - 2; i++){
            stones.push(new StonesBuilder(color));
        }
        return stones;
    }
}

// トップページをレンダリングするファンクション
const displayTopPage = () => {
    config.target.innerHTML =
    `
    <div class="row align-middle">
        <div class="col-sm-12 col-md-12 col-lg-12">
            <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                <h2>オセロゲーム</h2>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                <form id="signup">
                    <button type="button" class="btn btn-primary col-12" onclick='displayUserRegisterPage();return false;'>ユーザー対戦</button>
                    <button type="button" class="btn btn-primary col-12" onclick='displayAIRegisterPage();return false;'>AI対戦</button>
                </form>
            </div>
        </div>
    </div>
    `
}

// ユーザー登録画面を表示するファンクション(User同士の対戦)
const displayUserRegisterPage = () => {
    config.target.innerHTML =
    `
    <div class="row align-middle">
        <div class="col-sm-12 col-md-12 col-lg-12">
            <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                <h2>ログイン</h2>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                <form id="signup">
                    <div class="form-group">
                        <input type="text" name="userName1" class="form-control" id="input-user-name1" placeholder="ユーザーネーム" value="">
                        <input type="hidden" name="userType1" id="input-user-type1" value=0>
                    </div>
                    <div class="form-group">
                        <input type="text" name="userName2" class="form-control" id="input-user-name2" placeholder="ユーザーネーム" value="">
                        <input type="hidden" name="userType2" id="input-user-type2" value=0>
                    </div>
                    <button type="submit" class="btn btn-primary col-12" onclick='initialGame();return false;'>登録してゲームスタート</button>
                    <button type="button" class="btn btn-primary col-12" onclick='displayTopPage();return false;'>戻る</button>
                </form>
            </div>
        </div>
    </div>
    `
}

// ユーザー登録画面を表示するファンクション(AIとの対戦)
const displayAIRegisterPage = () => {
    config.target.innerHTML =
    `
    <div class="row align-middle">
        <div class="col-sm-12 col-md-12 col-lg-12">
            <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                <h2>ログイン</h2>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                <form id="signup">
                    <div class="form-group">
                        <input type="text" name="userName1" class="form-control" id="input-user-name1" placeholder="ユーザーネーム" value="">
                        <input type="hidden" name="userType1" id="input-user-type1" value=0>
                    </div>
                    <div class="form-group">
                        <input type="hidden" name="userName2" class="form-control" id="input-user-name2" placeholder="ユーザーネーム" value="AI">
                        <input type="hidden" name="userType2" id="input-user-type2" value=1>
                    </div>
                    <button type="submit" class="btn btn-primary col-12" onclick='initialGame();return false;'>登録してゲームスタート</button>
                    <button type="button" class="btn btn-primary col-12" onclick='displayTopPage();return false;'>戻る</button>
                </form>
            </div>
        </div>
    </div>
    `
}

// 各インスタンス作成、ボードのHtml作成、石を2こずつ配置
const initialGame = () => {
    const user1Name = document.getElementById("input-user-name1").value;
    const user1Type = Number(document.getElementById("input-user-type1").value);
    const user2Name = document.getElementById("input-user-name2").value;
    const user2Type = Number(document.getElementById("input-user-type2").value);

    let users = UsersBuilder.createUsers(user1Name, user1Type, user2Name, user2Type);
    let board = BoardBuilder.createBoard(CellsBuilder.createCells());

    facilitator = new Facilitator(users, board);

    // まずはhtmlを作るんご
    // html作成
    // 石を配置
    // stoneのインスタンスにも石を置く
    // 得点板を更新
}

displayTopPage();
