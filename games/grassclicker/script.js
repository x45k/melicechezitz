document.body.style.backgroundImage = "url('./assets/backgroundd.png')";
document.body.style.backgroundSize = "cover";
document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.color = "#fff";
document.body.style.textAlign = "center";

let grassCount = 0;
let clickValue = 1;
let grassPerSecond = 0; 
let affordableUpgrades = Array(15).fill(false);

const upgradeNames = [
    "Grass Cutter",
    "Weed Whacker",
    "Lawnmower",
    "Grass Pulverizer",
    "Super Shredder",
    "Grass Obliterator",
    "Turf Terminator",
    "Sod Smasher",
    "Field Flattening",
    "Grass Annihilator",
    "Eco Eraser",
    "Blades of Fury",
    "Grass Exterminator",
    "Eco Destructor",
    "Ground Breaker",
    "Lawn Assassin"
];

const upgrades = Array.from({ length: 15 }, (_, index) => {
    const baseCost = Math.pow(10, index + 1);
    return {
        name: upgradeNames[index],
        baseCost: baseCost,
        costMultiplier: 1.5,
        level: 0,
        currentCost: baseCost,
        minRequired: baseCost * 0.8, 
        effect: () => {
            if (index === 0) {
                grassPerSecond += 0.3;
            } else if (index === 1) {
                grassPerSecond += 1;
            } else if (index <= 11) {
                grassPerSecond += 0.5;
            } else if (index === 12) {
                grassPerSecond += 1.5;
            } else if (index === 13) {
                grassPerSecond += 2; 
            } else if (index === 14) {
                grassPerSecond += 5;
            }
            grassPerSecond = Math.round(grassPerSecond * 10) / 10;
            upgrades[index].level++;
        }
    };
});

const grassElement = document.getElementById('grass');
const grassCountElement = document.getElementById('grass-count');
const upgradesContainer = document.getElementById('upgrades');

grassElement.addEventListener('dragstart', (event) => {
    event.preventDefault();
});

function loadGameData() {
    const savedGrassCount = localStorage.getItem('grassCount');
    const savedAffordableUpgrades = localStorage.getItem('affordableUpgrades');
    const savedUpgrades = localStorage.getItem('upgrades');
    const savedGrassPerSecond = localStorage.getItem('grassPerSecond');

    if (savedGrassCount !== null) {
        grassCount = parseFloat(savedGrassCount);
        console.log(`Loaded grass count: ${grassCount}`); 
    }

    if (savedAffordableUpgrades !== null) {
        affordableUpgrades = JSON.parse(savedAffordableUpgrades);
        console.log(`Loaded affordable upgrades: ${affordableUpgrades}`);
    }

    if (savedUpgrades !== null) {
        const savedUpgradesData = JSON.parse(savedUpgrades);
        savedUpgradesData.forEach((savedUpgrade, index) => {
            upgrades[index].level = savedUpgrade.level || 0;
            upgrades[index].currentCost = Math.floor(upgrades[index].baseCost * Math.pow(upgrades[index].costMultiplier, upgrades[index].level));
        });
    }

    if (savedGrassPerSecond !== null) {
        grassPerSecond = parseFloat(savedGrassPerSecond);
        console.log(`Loaded grass per second: ${grassPerSecond}`);
    }

    updateUI();
    updateUpgradeDisplay();
    showUnlockedUpgrades();
}

function saveGameData() {
    localStorage.setItem('grassCount', grassCount);
    localStorage.setItem('affordableUpgrades', JSON.stringify(affordableUpgrades));
    localStorage.setItem('upgrades', JSON.stringify(upgrades.map(upgrade => ({ level: upgrade.level }))));
    localStorage.setItem('grassPerSecond', grassPerSecond); 
    console.log(`Saved grass count: ${grassCount}`);
}

function showUnlockedUpgrades() {
    upgrades.forEach((upgrade, index) => {
        const button = document.getElementById(`upgrade-${index}`);
        if (grassCount >= upgrade.minRequired) {
            affordableUpgrades[index] = true; 
        }
    });
    updateUpgradeButtons();
}

grassElement.addEventListener('click', () => {
    grassCount += clickValue;
    grassCount = Math.round(grassCount * 10) / 10;
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
    if (grassCount >= upgrade.currentCost) {
        grassCount -= upgrade.currentCost; 
        grassCount = Math.round(grassCount * 10) / 10; 
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
        button.style.display = affordableUpgrades[index] || grassCount >= upgrade.minRequired ? 'inline-block' : 'none'; 
        button.disabled = grassCount < upgrade.currentCost;
        button.style.color = grassCount < upgrade.currentCost ? 'gray' : '';
    });
}

function updateUpgradeDisplay() {
    upgrades.forEach((upgrade, index) => {
        const button = document.getElementById(`upgrade-${index}`);
        button.textContent = `${upgrade.name} (Cost: ${upgrade.currentCost})`;
    });
}

function updateUI() {
    grassCountElement.textContent = grassCount;
}

function generateGrass() {
    if (grassPerSecond > 0) {
        grassCount += grassPerSecond; 
        grassCount = Math.round(grassCount * 10) / 10; 
        updateUI(); 
        saveGameData();
    }
}

setInterval(generateGrass, 1000); 

window.addEventListener('beforeunload', saveGameData);

loadGameData();