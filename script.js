document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const currentBalanceText = document.getElementById("currentBalance");
    const betAmountInput = document.getElementById("betAmount");
    const addBalanceBtn = document.getElementById("addBalance");
    const startGameBtn = document.getElementById("startGame");
    const cashOutBtn = document.getElementById("cashOut");

    let balance = 100;
    let multiplier = 1;
    let minePositions = [];
    let revealedCells = 0;
    let playing = false;

    function updateBalance() {
        currentBalanceText.textContent = balance.toFixed(2);
    }

    addBalanceBtn.addEventListener("click", () => {
        let additionalBalance = parseFloat(betAmountInput.value);
        if (additionalBalance > 0) {
            balance += additionalBalance;
            updateBalance();
        }
    });

    startGameBtn.addEventListener("click", () => {
        if (balance <= 0) {
            alert("You need to set a balance first!");
            return;
        }

        let betAmount = parseFloat(betAmountInput.value);
        if (betAmount > balance) {
            alert("Not enough balance to place this bet!");
            return;
        }

        balance -= betAmount;
        updateBalance();

        multiplier = 1;
        revealedCells = 0;
        playing = true;
        createGrid();
        placeMines();
    });

    cashOutBtn.addEventListener("click", () => {
        if (playing) {
            balance += parseFloat(betAmountInput.value) * multiplier; // Cash out with multiplier applied
            updateBalance();
            playing = false;
        }
    });

    function createGrid() {
        grid.innerHTML = "";
        for (let i = 0; i < 25; i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;
            cell.addEventListener("click", () => revealCell(cell));
            grid.appendChild(cell);
        }
    }

    function placeMines() {
        let mineCount = 5; // Example
        minePositions = [];
        while (minePositions.length < mineCount) {
            let randomIndex = Math.floor(Math.random() * 25);
            if (!minePositions.includes(randomIndex)) {
                minePositions.push(randomIndex);
            }
        }
    }

    function revealCell(cell) {
        if (!playing || cell.classList.contains("revealed")) return;
        
        let index = parseInt(cell.dataset.index);
        cell.classList.add("revealed");

        if (minePositions.includes(index)) {
            cell.classList.add("mine");
            endGame(false);
        } else {
            cell.classList.add("gem");
            revealedCells++;
            multiplier += 0.2;
        }
    }

    function endGame(won) {
        playing = false;
        if (won) {
            balance *= multiplier;
        } else {
            balance = 0;
        }
        updateBalance();
    }

    updateBalance();  // Display initial balance
});
