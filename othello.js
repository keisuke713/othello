class Config{
    constructor(target, numberOfCellsPerRow, numberOfBlackStonesId, numberOfWhiteStonesId, currentPlayerId){
        this.target        　　　　 = target;
        this.numberOfCellsPerRow   = numberOfCellsPerRow;
        this.numberOfBlackStonesId = numberOfBlackStonesId;
        this.numberOfWhiteStonesId = numberOfWhiteStonesId;
        this.currentPlayerId       = currentPlayerId
    }
    getNumberOfStones(){
        return Math.pow(this.numberOfCellsPerRow, 2)
    }
}

const config = new Config(document.getElementById("target"), 4, "numberOfBlackStones", "numberOfWhiteStones", "currentPlayer");

let users       = null;
let board       = null;

class Users{
    constructor(firstUser, lastUser, currentPlayerId){
        this.users = [firstUser, lastUser];
        this.currentUserIndex   = 1;
        this.currentPlayerId = currentPlayerId;
    }
    // currentUserを更新
    currentUser(){
        return this.users[this.currentUserIndex];
    }
    // インデックスを更新
    updateCurrentUser(){
        this.currentUserIndex = (this.currentUserIndex + 1) & 1;
        document.getElementById(this.currentPlayerId).value = this.currentUser().name;
    }
    firstUser(){
        return this.users[0];
    }
    lastUser(){
        return this.users[1];
    }
    resetUsers(stones){
        for(let user of this.users){
            user.stones = stones;
        }
        this.currentUserIndex = 1;
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
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount - 1})) return true;
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount})) return true;
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount + 1})) return true;
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount}, (amount) => {return amount - 1})) return true;
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount}, (amount) => {return amount + 1})) return true;
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount - 1})) return true;
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount})) return true;
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount + 1})) return true;
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
    putAStone(board, col, row){
        board.getCell(col, row).putAStone(this.stones.pop(), this.stoneColor);
    }

    // 石をひっくり返す
    reverseStones(board, col, row){
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount - 1})){
            this.reverseStonesHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount - 1});
        }
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount})){
            this.reverseStonesHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount});
        };
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount + 1})){
            this.reverseStonesHelper(board, col, row, (amount) => {return amount - 1}, (amount) => {return amount + 1});
        };
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount}, (amount) => {return amount - 1})){
            this.reverseStonesHelper(board, col, row, (amount) => {return amount}, (amount) => {return amount - 1});
        };
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount}, (amount) => {return amount + 1})){
            this.reverseStonesHelper(board, col, row, (amount) => {return amount}, (amount) => {return amount + 1});
        };
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount - 1})){
            this.reverseStonesHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount - 1});
        };
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount})){
            this.reverseStonesHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount});
        };
        if(this.canPutAStoneOnTheCellHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount + 1})){
            this.reverseStonesHelper(board, col, row, (amount) => {return amount + 1}, (amount) => {return amount + 1});
        };
    }
    reverseStonesHelper(board, col, row, addOrSubCol, addOrSubRow){
        col = addOrSubCol(col);
        row = addOrSubRow(row);

        while(board.getCell(col, row) != undefined && board.getCell(col, row).isStoneOn && this.stoneColor != board.getCell(col, row).stone.color){
            board.getCell(col, row).reverseStone();

            col = addOrSubCol(col);
            row = addOrSubRow(row);
        }
    }
    getCellsUserCanPutAStone(board){
        for(let i=0; i<board.cells.length; i++){
            for(let j=0; j<board.cells[i].length; j++){
                if(board.ifAStoneIsOnTheCell(i, j)) continue;
                if(this.canPutAStoneOnTheCell(board, i, j)) return {col: i, row: j};
            }
        }
        return {col: null, row: null};
    }
    // AIだったらtrue
    AI(){
        return this.isAI == 1;
    }
}

class Board{
    constructor(cells, stones, numberOfBlackStonesId, numberOfWhiteStonesId){
        this.cells = cells;
        this.setInitialStones(stones);
        this.numberOfBlackStonesId = numberOfBlackStonesId;
        this.numberOfWhiteStonesId = numberOfWhiteStonesId;
    }
    ifAStoneIsOnTheCell(col, row){
        return this.getCell(col, row).isStoneOn();
    }
    hasAnyCellUserCanPutStone(){
        for(let i=0; i<this.cells.length; i++){
            for(let j=0; j<this.cells[i].length; j++){
                if(this.getCell(i,j).stone == null) return true;
            }
        }
        return false;
    }
    setInitialStones(stones){
        for(let i = 0; i < this.getNumberOfCellsPerEachRow(); i++){
            for(let j = 0; j < this.getNumberOfCellsPerEachRow(); j++){
                if(i == this.getNumberOfCellsPerEachRow() / 2 - 1 && j == this.getNumberOfCellsPerEachRow() / 2 - 1) this.getCell(i, j).putAStone(stones.pop(), "black");
                if(i == this.getNumberOfCellsPerEachRow() / 2 && j == this.getNumberOfCellsPerEachRow() / 2) this.getCell(i, j).putAStone(stones.pop(), "black");
                if(i == this.getNumberOfCellsPerEachRow() / 2 - 1 && j == this.getNumberOfCellsPerEachRow() / 2) this.getCell(i, j).putAStone(stones.pop(), "white");
                if(i == this.getNumberOfCellsPerEachRow() / 2 && j == this.getNumberOfCellsPerEachRow() / 2 - 1) this.getCell(i, j).putAStone(stones.pop(), "white");
            }
        }
    }
    updateNumberOfBlackStones(){
        let count = 0;
        for(let i=0; i<this.cells.length; i++){
            for(let j=0; j<this.cells[i].length; j++){
                if(this.getCell(i,j).isStoneBlack()) count++;
            }
        }

        document.getElementById(this.numberOfBlackStonesId).innerText = count;
    }
    getNumberOfBlackStones(){
        const ele = document.getElementById(this.numberOfBlackStonesId);
        if(ele == null) return 0;
        return Number(ele.innerText);
    }
    updateNumberOfWhiteStones(){
        let count = 0;
        for(let i=0; i<this.cells.length; i++){
            for(let j=0; j<this.cells[i].length; j++){
                if(this.getCell(i,j).isStoneWhite()) count++;
            }
        }

        document.getElementById(this.numberOfWhiteStonesId).innerText = count;
    }
    getNumberOfWhiteStones(){
        const ele = document.getElementById(this.numberOfWhiteStonesId);
        if(ele == null) return 0;
        return Number(ele.innerText);
    }
    getNumberOfCellsPerEachRow(){
        return this.cells.length;
    }
    getCell(col, row){
        if(col < 0 || col >= this.getNumberOfCellsPerEachRow()) return;
        if(row < 0 || col >= this.getNumberOfCellsPerEachRow()) return;
        return this.cells[col][row];
    }
    resetBoard(stones){
        for(let i=0; i<this.cells.length; i++){
            for(let j=0; j<this.cells[i].length; j++){
                this.getCell(i,j).stone = null;
            }
        }
        this.setInitialStones(stones);
    }
    // AI用？
    isThereAnyCellUserCanPutAStone(user){}
}

class Cell{
    constructor(col, row){
        this.stone = null;
        this.col   = col;
        this.row   = row;
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
    stoneColor(){
        return this.stone.color;
    }
    putAStone(stone, color){
        stone.setColorAndImage(color);
        this.stone = stone;

        const cell = document.getElementById(`col${this.col}-row${this.row}`);

        if(cell == null) return;

        const img = document.createElement("img");
        img.src = stone.image;
        cell.append(img);
    }
    reverseStone(){
        this.stone.reverse()

        const img = document.getElementById(`col${this.col}-row${this.row}`).querySelector("img");
        img.src   = this.stone.image;
    }
}

class Stone{
    static image = {
        "black": "black.png",
        "white": "white.png"
    }

    static oppositeColorData = {
        "black": {"color": "white", "image": "white.png"},
        "white": {"color": "black", "image": "black.png"}
    }

    constructor(color = null){
        this.color = color;
        this.image = color == null ? null : Stone.image[color];
    }

    setColorAndImage(color){
        this.color = color;
        this.image = Stone.image[color];
    }
    isBlack(){
        return this.color == "black";
    }
    isWhite(){
        return this.color == "white";
    }
    reverse(){
        const tmpColor = this.color;
        this.color = Stone.oppositeColorData[tmpColor]["color"];
        this.image = Stone.oppositeColorData[tmpColor]["image"];
    }
}

class UsersBuilder{
    static createUsers(user1Name, user1Type, user2Name, user2Type, currentPlayerId, stones){
        return new Users(
            new User(user1Name, user1Type, stones, "black"), 
            new User(user2Name, user2Type, stones, "white"),
            currentPlayerId
        );
    }
}

class BoardBuilder{
    static createBoard(cells, stones, numberOfBlackStonesId, numberOfWhiteStonesId){
        return new Board(cells, stones, numberOfBlackStonesId, numberOfWhiteStonesId);
    }
}

class CellsBuilder{
    static createCells(){
        let cells = [];
        for(let i = 0; i < config.numberOfCellsPerRow; i++){
            let tmp = [];
            for(let j = 0; j < config.numberOfCellsPerRow; j++){
                tmp.push(new Cell(i, j));
            }
            cells.push(tmp);
        }
        return cells;
    }
}

class StonesBuilder{
    static createStones(numberOfStones){
        let stones = [];
        for(let i = 0; i < numberOfStones - 4; i++){
            stones.push(new Stone());
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
                <button type="button" class="btn btn-primary col-12" onclick='displayUserRegisterPage();return false;'>ユーザー対戦</button>
            </div>
            <div style="height:5px;"></div>
            <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                <button type="button" class="btn btn-primary col-12" onclick='displayAIRegisterPage();return false;'>AI対戦</button>
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
                    <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                        <button type="submit" class="btn btn-primary col-12" onclick='initialGame();return false;'>登録してゲームスタート</button>
                    </div>
                    <div style="height:5px"></div>
                    <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                        <button type="button" class="btn btn-primary col-12" onclick='displayTopPage();return false;'>戻る</button>
                    </div>
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
                    <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                        <button type="submit" class="btn btn-primary col-12" onclick='initialGame();return false;'>登録してゲームスタート</button>
                    </div>
                    <div style="height:5px"></div>
                    <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                        <button type="button" class="btn btn-primary col-12" onclick='displayTopPage();return false;'>戻る</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
}

// メインページ
const displayMainPage = (table) => {
    config.target.innerHTML =
    `
    <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                    <h2>オセロゲーム</h2>
                </div>

                <div class="col-sm-12 col-md-12 col-lg-12 text-center" id="tableWrapper">
                </div>

                <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                    <p>current player: <input id="currentPlayer" value="" disabled=true style="border:transparent; background:transparent; color:black; width:70px;" onchange='aiMove()'></p>
                </div>

                <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                    <p><span>${users.firstUser().name}:</span> <span id="numberOfBlackStones"></span>&nbsp;<span>${users.lastUser().name}:</span> <span id="numberOfWhiteStones"></span></p>
                </div>

                <div class="col-sim-4 col-md-3 col-lg-2 text-center" style="margin:0 auto;">
                    <button type="button" id="pass" class="btn btn-primary col-12" onclick='users.updateCurrentUser();'>パス</button>
                </div>

                <div style="height:5px;"></div>

                <div class="col-sim-4 col-md-3 col-lg-2 text-center" style="margin:0 auto;">
                    <button type="button" class="btn btn-primary col-12" onclick='resetGame();'>リスタート</button>
                </div>
            </div>
    `

    document.getElementById("tableWrapper").append(table);
}

function addEventWhenPutAStone(cell){
    return new Promise((resolve) => {
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
        users.currentUser().putAStone(board, col, row);

        // ひっくり返す
        users.currentUser().reverseStones(board, col, row);

        // 点数更新
        board.updateNumberOfBlackStones();
        board.updateNumberOfWhiteStones();

        resolve();
    }, 500)
    .then(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                checkIfGameIsFinished(board.hasAnyCellUserCanPutStone(), board.getNumberOfBlackStones(), board.getNumberOfWhiteStones());
                resolve();
            }, 500);
        })
    })
    .then(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                users.updateCurrentUser();
                alert(`${users.currentUser().name}のターンです`);
                resolve();
            }, 500);
        })
    })
    .then(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if(users.currentUser().AI()){
                    const map = users.currentUser().getCellsUserCanPutAStone(board);
                    const ele = document.getElementById(`col${map["col"]}-row${map["row"]}`);
                    if(ele != null) ele.click();
                    else document.getElementById("pass").click();
                }
                resolve();
            }, 1000);
        })
    })
}

// オセロ盤のhtml作成
const createTable = () => {
    const table = document.createElement("table");
    for(let i=0; i<board.getNumberOfCellsPerEachRow(); i++){
        const tr = document.createElement("tr");
        for(let j=0; j<board.getNumberOfCellsPerEachRow(); j++){
            const td = document.createElement("td");

            if(board.getCell(i,j).isStoneOn()){
                const img = document.createElement("img");
                img.src = board.getCell(i,j).stone.image;
                td.append(img);
            }

            td.classList.add("cell");
            td.setAttribute("id", `col${i}-row${j}`);
            td.dataset.col = i;
            td.dataset.row = j;
            td.addEventListener("click", (e) => {
                addEventWhenPutAStone(e.target)
            })

            tr.append(td);
        }
        table.append(tr);
    }
    return table;
}

const checkIfGameIsFinished = (hasAnyCellUserCanPutStone, numberOfBlackStones, numberOfWhiteStones) => {
    if(hasAnyCellUserCanPutStone) return;

    if(numberOfBlackStones > numberOfWhiteStones){
        alert(`${users.firstUser().name}の勝利`);
    }else if(numberOfBlackStones < numberOfWhiteStones){
        alert(`${users.lastUser().name}の勝利`);
    }else{
        alert("引き分け");
    }
}

// 各インスタンス作成、ボードのHtml作成、石を2こずつ配置、石を置くときのイベント設定
const initialGame = () => {
    // const user1Name = document.getElementById("input-user-name1").value;
    // const user1Type = Number(document.getElementById("input-user-type1").value);
    // const user2Name = document.getElementById("input-user-name2").value;
    // const user2Type = Number(document.getElementById("input-user-type2").value);

    board = BoardBuilder.createBoard(CellsBuilder.createCells(), [new Stone(), new Stone(), new Stone(), new Stone()], config.numberOfBlackStonesId, config.numberOfWhiteStonesId)
    // users = UsersBuilder.createUsers(user1Name, user1Type, user2Name, user2Type, config.currentPlayerId, StonesBuilder.createStones(config.getNumberOfStones()));
    users = UsersBuilder.createUsers("player1", 0, "player2", 1, config.currentPlayerId, StonesBuilder.createStones(config.getNumberOfStones()));

    const table = createTable();
    displayMainPage(table);

    users.updateCurrentUser();
    board.updateNumberOfBlackStones();
    board.updateNumberOfWhiteStones();
}

const resetGame = () => {
    board.resetBoard([new Stone(), new Stone(), new Stone(), new Stone()]);
    users.resetUsers(StonesBuilder.createStones(config.getNumberOfStones()));
    const table = createTable();
    displayMainPage(table);

    // addEventWhenPutAStone();

    users.updateCurrentUser();
    board.updateNumberOfBlackStones();
    board.updateNumberOfWhiteStones();
}

const aiMove = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if(users.currentUser().AI()){
                const map = users.currentUser().getCellsUserCanPutAStone(board);
                const ele = document.getElementById(`col${map["col"]}-row${map["row"]}`);
                if(ele != null) ele.click();
                else{
                    alert(`${users.currentUser().name}はパスを選択しました`)
                    document.getElementById("pass").click();
                }
            }
            resolve();
        }, 1000);
    })
}

// displayTopPage();
initialGame();
