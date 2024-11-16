document.body.style.backgroundImage = "url('./assets/backgroundd.png')";
document.body.style.backgroundSize = "cover";
document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.color = "#fff";
document.body.style.textAlign = "center";

let clickValue = 1;
let _grassPerSecond = 0; 
let affordableUpgrades = Array(15).fill(false);
let devMode = false;
let _grassCount = 0; 

const grassCountHandler = {
    get: () => _grassCount,
    set: () => {
        console.warn("Direct modification of grassCount is not allowed.");
        return false;
    }
};

const grassCountProxy = new Proxy({}, grassCountHandler);

const grassPerSecondHandler = {
    get: () => _grassPerSecond,
    set: () => {
        console.warn("Direct modification of grassPerSecond is not allowed.");
        return false;
    }
};

const grassPerSecondProxy = new Proxy({}, grassPerSecondHandler);

function setGrassCount(value, tag = '') {
    if (tag === '9898') {
        _grassCount = value / 10;
        console.log(`grassCount set to ${_grassCount}`);
        updateUI();
    } else {
        console.warn("Invalid command. Use the password suffix to modify grassCount.");
    }
}

function setGrassPerSecond(value, tag = '') {
    if (tag === '9898') {
        _grassPerSecond = value;
        console.log(`grassPerSecond set to ${_grassPerSecond}`);
    } else {
        console.warn("Invalid command. Use the password suffix to modify grassPerSecond.");
    }
}

const originalEval = window.eval;
window.eval = function (command) {
    if (command.endsWith('9898')) {
        return originalEval(command.slice(0, -5).trim());
    } else {
        console.warn("Commands are disabled unless suffixed with the password.");
    }
};

function enterDevTesting() {
    console.log("Dev Testing Mode activated. Changes won't be saved.");
    devMode = true;
}

function leaveDevTesting() {
    console.log("Leaving Dev Testing Mode.");
    devMode = false;
}

function resetGame() {
    console.log("Game reset. All progress lost.");
    localStorage.clear();
    clickValue = 1;
    _grassPerSecond = 0; 
    affordableUpgrades = Array(15).fill(false);
    _grassCount = 0; 
    setTimeout(() => {
        location.reload();
    }, 100);
}

window.enterDevTesting = enterDevTesting;
window.leaveDevTesting = leaveDevTesting;
window.resetGame = resetGame;
window.setGrassCount = setGrassCount;
window.setGrassPerSecond = setGrassPerSecond; 

function loadGameData() {
    if (devMode) return;

    const savedGrassCount = localStorage.getItem('grassCount');
    const savedAffordableUpgrades = localStorage.getItem('affordableUpgrades');
    const savedUpgrades = localStorage.getItem('upgrades');
    const savedGrassPerSecond = localStorage.getItem('grassPerSecond');

    if (savedGrassCount !== null) _grassCount = parsefloat(savedGrassCount);
    if (savedAffordableUpgrades !== null) affordableUpgrades = JSON.parse(savedAffordableUpgrades);
    if (savedUpgrades !== null) {
        const savedUpgradesData = JSON.parse(savedUpgrades);
        savedUpgradesData.forEach((savedUpgrade, index) => {
            upgrades[index].level = savedUpgrade.level || 0;
            upgrades[index].currentCost = Math.floor(upgrades[index].baseCost * Math.pow(upgrades[index].costMultiplier, upgrades[index].level));
        });
    }
    if (savedGrassPerSecond !== null) _grassPerSecond = parsefloat(savedGrassPerSecond);

    updateUI();
    updateUpgradeDisplay();
    showUnlockedUpgrades();
}

function saveGameData() {
    if (devMode) return;

    localStorage.setItem('grassCount', _grassCount);
    localStorage.setItem('affordableUpgrades', JSON.stringify(affordableUpgrades));
    localStorage.setItem('upgrades', JSON.stringify(upgrades.map(upg => ({ level: upg.level }))));
    localStorage.setItem('grassPerSecond', _grassPerSecond);
}

const upgradeNames = [
    "Grass Cutter", "Weed Whacker", "Lawnmower", "Grass Pulverizer", 
    "Super Shredder", "Grass Obliterator", "Turf Terminator", "Sod Smasher", 
    "Field flattening", "Grass Annihilator", "Eco Eraser", "Blades of Fury", 
    "Grass Exterminator", "Eco Destructor", "Ground Breaker", "Lawn Assassin"
];

const upgrades = Array.from({ length: 15 }, (_, index) => ({
    name: upgradeNames[index],
    baseCost: Math.pow(10, index + 1),
    costMultiplier: 1.5,
    level: 0,
    currentCost: Math.pow(10, index + 1),
    minRequired: Math.pow(10, index + 1) * 0.8,
    effect: () => {
        const increments = [0.3, 1, 5, 50, 200, 1000, 7500, 30000, 135000, 
                            750000, 2750000, 30000000, 300000000, 3000000000, 
                            30000000000];
        _grassPerSecond += increments[index];
        _grassPerSecond = Math.round(_grassPerSecond * 10) / 10;
        upgrades[index].level++;
    }
}));

const grassElement = document.getElementById('grass');
const grassCountElement = document.getElementById('grass-count');
const upgradesContainer = document.getElementById('upgrades');

grassElement.addEventListener('click', () => {
    _grassCount += clickValue;
    _grassCount = Math.round(_grassCount * 10) / 10;
    updateUI();
    updateUpgradeButtons();
    saveGameData();
});

upgrades.forEach((upgrade, index) => {
    const button = document.createElement('button');
    button.textContent = `${upgrade.name} (Cost: ${upgrade.currentCost})`;
    button.classList.add('upgrade-button');
    button.id = `upgrade-${index}`;
    button.addEventListener('click', () => purchaseUpgrade(index));
    upgradesContainer.appendChild(button);
});

function purchaseUpgrade(index) {
    const upgrade = upgrades[index];
    if (_grassCount >= upgrade.currentCost) {
        _grassCount -= upgrade.currentCost;
        upgrade.effect();
        upgrade.currentCost = Math.floor(upgrade.currentCost * upgrade.costMultiplier);
        affordableUpgrades[index] = true;
        updateUI();
        updateUpgradeDisplay();
        saveGameData();
    }
}

function updateUpgradeButtons() {
    upgrades.forEach((upgrade, index) => {
        const button = document.getElementById(`upgrade-${index}`);
        button.style.display = affordableUpgrades[index] || _grassCount >= upgrade.minRequired ? 'inline-block' : 'none';
        button.disabled = _grassCount < upgrade.currentCost;
    });
}

function updateUpgradeDisplay() {
    upgrades.forEach((upgrade, index) => {
        const button = document.getElementById(`upgrade-${index}`);
        button.textContent = `${upgrade.name} (Cost: ${upgrade.currentCost.toLocaleString()})`;
    });
}

const grassPerSecondElement = document.createElement('div');
grassPerSecondElement.id = 'grass-per-second';
document.body.appendChild(grassPerSecondElement);

function updateUI() {
    grassCountElement.textContent = _grassCount.toLocaleString();
    grassPerSecondElement.textContent = `Grass per second: ${_grassPerSecond.toLocaleString()} g/s`;
}

function showUnlockedUpgrades() {
    upgrades.forEach((upgrade, index) => {
        const button = document.getElementById(`upgrade-${index}`);
        if (_grassCount >= upgrade.minRequired) {
            affordableUpgrades[index] = true;
        } else {
            affordableUpgrades[index] = false;
        }
        button.style.display = affordableUpgrades[index] ? 'inline-block' : 'none';
    });
}

setInterval(() => {
    if (!devMode) { 
        _grassCount += _grassPerSecond;
        _grassCount = Math.round(_grassCount * 10) / 10;
        updateUI();
        saveGameData();
    }
}, 1000);

loadGameData();
