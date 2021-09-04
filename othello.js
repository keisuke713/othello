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

const config = new Config(document.getElementById("target"), 8, "numberOfBlackStones", "numberOfWhiteStones", "currentPlayer");

let doesLastPlayerPutAStone = false;

let users       = null;
let board       = null;

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
    updateCurrentUser(){
        this.currentUserIndex = (this.currentUserIndex + 1) & 1;
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
        this.currentUserIndex = 0;
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
    canPutAStone(board){
        const cell = this.getCellsUserCanPutAStone(board);
        return cell["col"] != null && cell["row"] != null
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
    }
    reverseStone(){
        this.stone.reverse()
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
    static createUsers(user1Name, user1Type, user2Name, user2Type, stones){
        return new Users(
            new User(user1Name, user1Type, stones, "black"), 
            new User(user2Name, user2Type, stones, "white"),
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

class Controller{
    static main(){
        View.renderTopPage();
    }
    static initialGame(){
        const user1Name = document.getElementById("input-user-name1").value;
        const user1Type = Number(document.getElementById("input-user-type1").value);
        const user2Name = document.getElementById("input-user-name2").value;
        const user2Type = Number(document.getElementById("input-user-type2").value);
    
        board = BoardBuilder.createBoard(CellsBuilder.createCells(), [new Stone(), new Stone(), new Stone(), new Stone()], config.numberOfBlackStonesId, config.numberOfWhiteStonesId)
        users = UsersBuilder.createUsers(user1Name, user1Type, user2Name, user2Type, StonesBuilder.createStones(config.getNumberOfStones()));
    
        View.renderMainPage();

        document.getElementById(config.currentPlayerId).addEventListener("valueChange", ()=>{
            if(!users.currentUser().canPutAStone(board)) Controller.pass();
            aiMove()
        })

        View.updateNumberOfStones(config.numberOfBlackStonesId, board.getNumberOfBlackStones());
        View.updateNumberOfStones(config.numberOfWhiteStonesId, board.getNumberOfWhiteStones());
    }
    static click(target){
        return new Promise((resolve) => {
            if(target.tagName == "IMG") target = target.parentNode; 
            const col = Number(target.dataset.col);
            const row = Number(target.dataset.row);

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

            View.updateBoard(board);

            // 点数更新
            View.updateNumberOfStones(config.numberOfBlackStonesId, board.getNumberOfBlackStones());
            View.updateNumberOfStones(config.numberOfWhiteStonesId, board.getNumberOfWhiteStones());

            doesLastPlayerPutAStone = true;

            resolve();
        }, 500)
        .then(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if(!board.hasAnyCellUserCanPutStone()){
                        View.displayWinner(board.getNumberOfBlackStones(), board.getNumberOfWhiteStones());
                        throw new Error();
                    }
                    resolve();
                }, 500);
            })
        })
        .then(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    users.updateCurrentUser();
                    View.updateCurrentUser(config.currentPlayerId, users.currentUser().name);
                    resolve();
                }, 500);
            })
        })
        .catch();
    }
    static pass(){
        alert(`${users.currentUser().name}は石を置けるマスがないのでパスします。`)
        if(doesLastPlayerPutAStone){
            doesLastPlayerPutAStone = false;
            users.updateCurrentUser();
            View.updateCurrentUser(config.currentPlayerId, users.currentUser().name);
        }else{
            View.displayWinner(board.getNumberOfBlackStones(), board.getNumberOfWhiteStones());
            return;
        }
    }
}

class View{
    static renderTopPage(){
        config.target.innerHTML =
        `
        <div class="row align-middle">
            <div class="col-sm-12 col-md-12 col-lg-12">
                <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                    <h2>オセロゲーム</h2>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                    <button type="button" class="btn btn-primary col-12" onclick='View.renderUserRegisterPage();return false;'>ユーザー対戦</button>
                </div>
                <div style="height:5px;"></div>
                <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                    <button type="button" class="btn btn-primary col-12" onclick='View.renderAIRegisterPage();return false;'>コンピュータ対戦</button>
                </div>
            </div>
        </div>
        `
    }
    static renderUserRegisterPage(){
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
                            <button type="submit" class="btn btn-primary col-12" onclick='Controller.initialGame();return false;'>登録してゲームスタート</button>
                        </div>
                        <div style="height:5px"></div>
                        <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                            <button type="button" class="btn btn-primary col-12" onclick='View.renderTopPage();return false;'>戻る</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `
    }
    static renderAIRegisterPage(){
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
                            <input type="hidden" name="userName2" class="form-control" id="input-user-name2" placeholder="ユーザーネーム" value="コンピュータ">
                            <input type="hidden" name="userType2" id="input-user-type2" value=1>
                        </div>
                        <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                            <button type="submit" class="btn btn-primary col-12" onclick='Controller.initialGame();return false;'>登録してゲームスタート</button>
                        </div>
                        <div style="height:5px"></div>
                        <div class="col-sm-6 col-md-4 col-lg-2 text-center" style="margin:0 auto;">
                            <button type="button" class="btn btn-primary col-12" onclick='View.renderTopPage();return false;'>戻る</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `
    }
    static renderMainPage(){
        config.target.innerHTML =
        `
        <div class="col-sm-12 col-md-12 col-lg-12">
            <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                <h2>オセロゲーム</h2>
            </div>

            <div class="col-sm-12 col-md-12 col-lg-12 text-center" id="tableWrapper">
            </div>

            <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                <p>current player: <input id="currentPlayer" disabled="true", value=${users.firstUser().name} style="border:transparent; background:transparent; color:black; width:70px;"></p>
            </div>

            <div class="col-sm-12 col-md-12 col-lg-12 text-center">
                <p><span>${users.firstUser().name}:</span> <span id="numberOfBlackStones"></span>&nbsp;<span>${users.lastUser().name}:</span> <span id="numberOfWhiteStones"></span></p>
            </div>
        </div>
        `
    
        document.getElementById("tableWrapper").append(this.createTable());
    }
    static createTable(){
        const table = document.createElement("table");
        for(let i=0; i<board.getNumberOfCellsPerEachRow(); i++){
            const tr = document.createElement("tr");
            for(let j=0; j<board.getNumberOfCellsPerEachRow(); j++){
                const td = document.createElement("td");
    
                if(board.getCell(i,j).isStoneOn()){
                    const img = document.createElement("img");
                    img.src = board.getCell(i,j).stone.image;
                    td.append(img);
                    td.dataset.color = board.getCell(i,j).stone.color;
                }
    
                td.classList.add("cell");
                td.setAttribute("id", `col${i}-row${j}`);
                td.dataset.col = i;
                td.dataset.row = j;
                td.addEventListener("click", (e) => {
                    Controller.click(e.target);
                })
    
                tr.append(td);
            }
            table.append(tr);
        }
        return table;
    }
    static updateNumberOfStones(id, numberOfStones){
        const ele = document.getElementById(id);
        if(ele == null) return;
        ele.innerText = numberOfStones;
    }
    static displayWinner(numberOfBlackStones, numberOfWhiteStones){
        if(numberOfBlackStones > numberOfWhiteStones){
            alert(`${users.firstUser().name}の勝利`);
        }else if(numberOfBlackStones < numberOfWhiteStones){
            alert(`${users.lastUser().name}の勝利`);
        }else{
            alert("引き分け");
        }
    }
    static updateCurrentUser(currentPlayerId, currentUserName){
        const ele = document.getElementById(currentPlayerId);
        if(ele == null) return;

        ele.value = currentUserName;
        alert(`${currentUserName}のターンです`);

        const event = new CustomEvent("valueChange");
        ele.dispatchEvent(event);
    }
    static updateBoard(board){
        for(let i=0; i<board.cells.length; i++){
            for(let j=0; j<board.cells[i].length; j++){
                const cell = board.getCell(i,j);
                if(!cell.isStoneOn()) continue;

                const ele  = document.getElementById(`col${i}-row${j}`);

                const childNode = ele.firstChild;

                if(childNode == null){
                    const img = document.createElement("img");
                    img.src = cell.stone.image;
                    ele.append(img);
                    ele.dataset.color = cell.stone.color;
                }else{
                    childNode.src = cell.stone.image;
                    ele.dataset.color = cell.stone.color;
                }
            }
        }
    }
}

const aiMove = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if(users.currentUser().AI()){
                const map = users.currentUser().getCellsUserCanPutAStone(board);
                const ele = document.getElementById(`col${map["col"]}-row${map["row"]}`);
                if(ele != null) ele.click();
                else Controller.pass();
            }
            resolve();
        }, 1500);
    })
}

alert("test");
Controller.main();
