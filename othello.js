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
let cells       = null;

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
    constructor(firstUser, lastUser){
        this.users = [firstUser, lastUser];
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
    firstUser(){
        return this.users[0];
    }
    lastUser(){
        return this.users[1];
    }
}

class User{
    constructor(name, isAI, stones, stoneColor){
        this.name       = name;
        this.isAI       = isAI;
        this.stones     = stones;
        this.stoneColor = stoneColor;
    }

    canPutAStoneOnTheCell(board, col, row){
        if(users.currentUser().canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount - 1})) return true;
        if(users.currentUser().canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount})) return true;
        if(users.currentUser().canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount + 1})) return true;
        if(users.currentUser().canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount}, (amount) => {return amount - 1})) return true;
        if(users.currentUser().canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount}, (amount) => {return amount + 1})) return true;
        if(users.currentUser().canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount - 1})) return true;
        if(users.currentUser().canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount})) return true;
        if(users.currentUser().canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount + 1})) return true;
        return false;
    }

    canPutAStoneOnTheCellHelper(board, col, row, addOrSubCol, addOrSubRow){
        let ownColor = false;
        let otherColor = false;

        col = addOrSubCol(col);
        row = addOrSubRow(row);

        while(board.getCell(col, row) != undefined && board.getCell(col, row).isStoneOn()){
            if(this.stoneColor == board.getCell(col, row).stoneColor()){
                ownColor = true;
                break;
            }

            otherColor = true;
            col = addOrSubCol(col);
            row = addOrSubRow(row);
        }

        return ownColor && otherColor;
    }





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
        this.cells = cells;
        this.amountOfBlackStone = 0;
        this.amountOfWhiteStone = 0;
        this.setInitialStones(blackStones, whiteStones);
    }

    // 既に石が置かれているかどうか
    ifAStoneIsOnTheCell(col, row){
        return this.getCell(col, row).isStoneOn();
    }
    // getAmountOfStones(color){}
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

    getNumberOfBlackStones(){
        let count = 0;
        for(let i=0; i<this.cells.length; i++){
            for(let j=0; j<this.cells[i].length; j++){
                if(this.getCell(i,j).isStoneBlack()) count++;
            }
        }
        return count;
    }

    getNumberOfWhiteStones(){
        let count = 0;
        for(let i=0; i<this.cells.length; i++){
            for(let j=0; j<this.cells[i].length; j++){
                if(this.getCell(i,j).isStoneWhite()) count++;
            }
        }
        return count;
    }
    getNumberOfEachStones(){
        return this.cells.length ** 2 / 2;
    }

    getNumberOfCellsPerEachRow(){
        return this.cells.length;
    }

    getCell(col, row){
        if(col < 0 || col >= this.getNumberOfCellsPerEachRow()) return;
        if(row < 0 || col >= this.getNumberOfCellsPerEachRow()) return;
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
        return this.stone == null || this.stone.isWhite() ? false : true;
    }
    isStoneWhite(){
        return this.stone == null || this.stone.isBlack() ? false : true;
    }
    setStone(stone){
        this.stone = stone;
    }
    stoneColor(){
        return this.stone.color;
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
        return new Users(
            new User(user1Name, user1Type, StonesBuilder.createStones("black", config.numberOfCellsPerRow ** 2 / 2), "black"), 
            new User(user2Name, user2Type, StonesBuilder.createStones("white", config.numberOfCellsPerRow ** 2 / 2), "white")
        );
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

    board = BoardBuilder.createBoard(CellsBuilder.createCells(), [new Stone("black"), new Stone("black")], [new Stone("white"), new Stone("white")]);
    users = UsersBuilder.createUsers("keisuke1", 0, "kesuike2", 0);

    // facilitator = new Facilitator(users, board);

    // html作成
    let parent = document.createElement("div");
    parent.classList.add("row", "align-middle");
    let container = document.createElement("div");
    container.classList.add("col-sm-12", "col-md-12", "col-lg-12");

    // タイトル
    let title = document.createElement("div");
    title.classList.add("col-sm-12", "col-md-12", "col-lg-12", "text-center");
    title.innerHTML =
    `
    <h2>オセロゲーム</h2>
    `

    // オセロ盤
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
            td.classList.add("cell");
            td.dataset.col = i;
            td.dataset.row = j;
            tr.append(td);
        }
        table.append(tr);
    }
    tableWrapper.append(table);

    // CurrentPlayer
    let currentPlayerWrapper = document.createElement("div");
    currentPlayerWrapper.classList.add("col-sm-12", "col-md-12", "col-lg-12", "text-center");
    currentPlayerWrapper.innerHTML =　
    `
    <p>Current player: <span id="currentPlayer">${users.currentUser().name}</span></p>
    `

    // 石の数
    let numbersOfStonesWrapper = document.createElement("div");
    numbersOfStonesWrapper.classList.add("col-sm-12", "col-md-12", "col-lg-12", "text-center");
    numbersOfStonesWrapper.innerHTML =　
    `
    <p><span>${users.firstUser().name}:</span> <span id="numberOfBlackStones">${board.getNumberOfBlackStones()}</span>&nbsp;<span>${users.lastUser().name}:</span> <span id="numberOfBlackStones">${board.getNumberOfWhiteStones()}</span></p>
    `

    container.append(title);
    container.append(tableWrapper);
    container.append(currentPlayerWrapper);
    container.append(numbersOfStonesWrapper);
    parent.append(container);

    config.target.append(parent)
}

// displayTopPage();
initialGame();

cells = document.getElementsByClassName("cell");
for(let cell of cells){
    cell.addEventListener("click", () => {
        const col = Number(cell.dataset.col);
        const row = Number(cell.dataset.row);
        if(board.ifAStoneIsOnTheCell(col, row)){
            alert("既に石が置かれています");
            return;
        }

        // 現在のユーザーがそこに石をおいて良いか確認
        if(!users.currentUser().canPutAStoneOnTheCell(board, col, row)){
            alert(`User: ${users.currentUser().name}はそのマスに石を置くことはできません!!!`);
            return;
        }

        // 石を置く
        // ひっくり返す
        // 点数更新
        // ユーザーチェンジ
    })
}

// パスボタンを実装
