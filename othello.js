class Config{
    constructor(target, numberOfCellsPerRow){
        this.target        　　　　= target;
        this.numberOfCellsPerRow = numberOfCellsPerRow;
    }
}

const config = new Config(document.getElementById("target"), 8);

// let facilitator = null;
let users       = null;
let board       = null;

// class Facilitator{
//     constructor(users, board){
//         this.users              = users;
//         this.board              = board;
//         this.currentUserIndex   = 0;
//         this.amountOfBlackStone = 0;
//         this.amountOfWhiteStone = 0;
//     }

//     // 既に石が置かれているかどうか
//     ifAStoneIsOnTheCell(col, row){
//         this.board.ifAStoneIsOnTheCell(col, row);
//     }
//     // ユーザーが石を置けるかどうか
//     ifUserCanPutStoneOnTheCell(col, row){
//         this.currentUser().canPutAStoneOnTheCell(this.board, col, row);
//     }
//     // ユーザーが石をおく
//     userPutAStoneOnTheCell(col, row){
//         this.currentUser().putAStone(this.board, col, row);
//     }
//     // 石をひっくり返す
//     userReverseStones(col, row){
//         this.currentUser().reverseStones(this.board, col, row);
//     }
//     // 現在のユーザー
//     currentUser(){
//         this.users.currentUser();
//     }
//     // 盤の黒の石の数を更新
//     setAmountOfBlackStone(){
//         this.amountOfBlackStone = this.board.getAmountOfStones("black");
//     }
//     // 盤の白の石の数を更新
//     setAmountOfWhiteStone(){
//         this.amountOfWhiteStone =this.board.getAmountOfStones("white");
//     }
// }

class Users{
    constructor(user1, user2){
        this.users = [user1, user2];
        this.currentUserIndex   = 0;
    }
    // currentUserを更新
    currentUser(){
        return this.users[this.currentUserIndex];
    }
    // インデックスを更新
    updateIndex(){
        this.currentUserIndex = (this.currentUserIndex + 1) & 1;
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
    constructor(cells, blackStones, whiteStones){
        console.log(cells)
        this.cells = cells;
        this.amountOfBlackStone = 0;
        this.amountOfWhiteStone = 0;
        this.setInitialStones(blackStones, whiteStones);
    }

    // 既に石が置かれているかどうか
    ifAStoneIsOnTheCell(col, row){
        return this.getCell(col, row).isStoneOn();
    }
    getAmountOfStones(color){}
    isThereAnyCellUserCanPutAStone(user){}
    isAllCellPutAStone(){}

    setInitialStones(blackStones, whiteStones){
        for(let i = 0; i < this.getNumberOfCellsPerEachRow(); i++){
            for(let j = 0; j < this.getNumberOfCellsPerEachRow(); j++){
                if(i == this.getNumberOfCellsPerEachRow() / 2 - 1 && j == this.getNumberOfCellsPerEachRow() / 2 - 1) this.getCell(i, j).setStone(blackStones.pop())
                if(i == this.getNumberOfCellsPerEachRow() / 2 && j == this.getNumberOfCellsPerEachRow() / 2) this.getCell(i, j).setStone(blackStones.pop())
                if(i == this.getNumberOfCellsPerEachRow() / 2 - 1 && j == this.getNumberOfCellsPerEachRow() / 2) this.getCell(i, j).setStone(whiteStones.pop())
                if(i == this.getNumberOfCellsPerEachRow() / 2 && j == this.getNumberOfCellsPerEachRow() / 2 - 1) this.getCell(i, j).setStone(whiteStones.pop())
            }
        }
    }

    getNumberOfEachStones(){
        return this.cells.length ** 2 / 2;
    }

    getNumberOfCellsPerEachRow(){
        return this.cells.length;
    }

    getCell(col, row){
        return this.cells[col][row];
    }
}

class Cell{
    constructor(col, row){
        this.stone = null;
    }

    // 既に石が置かれているかどうか
    isStoneOn(){
        return this.stone != null;
    }
    isStoneBlack(){
        this.stone == null || this.stone.isWhite() ? false : true;
    }
    isStoneWhite(){
        this.stone == null || this.stone.isBlack() ? false : true;
    }
    setStone(stone){
        this.stone = stone;
    }
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
            new User(user1Name, user1Type, StonesBuilder.createStones("black", config.numberOfCellsPerRow ** 2 / 2), "black"), 
            new User(user2Name, user2Type, StonesBuilder.createStones("white", config.numberOfCellsPerRow ** 2 / 2), "white")
        ];
    }
}

class BoardBuilder{
    static createBoard(cells, blackStones, whiteStones){
        return new Board(cells, blackStones, whiteStones);
    }
}

class CellsBuilder{
    static createCells(){
        let cells = [];
        for(let i = 0; i < config.numberOfCellsPerRow; i++){
            let tmp = [];
            for(let j = 0; j < config.numberOfCellsPerRow; j++){
                tmp.push(new Cell());
            }
            cells.push(tmp);
        }
        return cells;
    }
}

class StonesBuilder{
    static createStones(color, numberOfStones){
        let stones = [];
        for(let i = 0; i < numberOfStones - 2; i++){
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
    // const user1Name = document.getElementById("input-user-name1").value;
    // const user1Type = Number(document.getElementById("input-user-type1").value);
    // const user2Name = document.getElementById("input-user-name2").value;
    // const user2Type = Number(document.getElementById("input-user-type2").value);

    let board = BoardBuilder.createBoard(CellsBuilder.createCells(), [new Stone("black"), new Stone("black")], [new Stone("white"), new Stone("white")]);
    let users = UsersBuilder.createUsers("keisuke", 0, "kesuike", 0);

    // facilitator = new Facilitator(users, board);

    // html作成
    let parent = document.createElement("div");
    parent.classList.add("row", "align-middle");
    let container = document.createElement("div");
    container.classList.add("col-sm-12", "col-md-12", "col-lg-12");

    let title = document.createElement("div");
    title.classList.add("col-sm-12", "col-md-12", "col-lg-12", "text-center");
    title.innerHTML =
    `
    <h2>オセロゲーム</h2>
    `

    let tableWrapper = document.createElement("div");
    tableWrapper.classList.add("col-sm-12", "col-md-12", "col-lg-12", "text-center");
    let table = document.createElement("table");
    for(let i=0; i<board.getNumberOfCellsPerEachRow(); i++){
        let tr = document.createElement("tr");
        for(let j=0; j<board.getNumberOfCellsPerEachRow(); j++){
            let td = document.createElement("td");
            if(board.getCell(i,j).isStoneOn()){
                let img = document.createElement("img");
                img.src = board.getCell(i, j).stone.image;
                td.append(img);
            }
            td.dataset.col = i;
            td.dataset.row = j;
            tr.append(td);
        }
        table.append(tr);
    }
    tableWrapper.append(table);

    container.append(title);
    container.append(tableWrapper);
    parent.append(container);

    config.target.append(parent)
    // 残りのhtml
    // 得点板を更新
}

// displayTopPage();
initialGame();

document.getElementById("a").addEventListener("click", (event) => {
})
