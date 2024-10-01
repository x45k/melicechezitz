import level14 from './levels/level14.js';

// global vars
let currentPage = 0;
let currentLevel = 0;
let levelToGoToAfterOk = 0;
let activeObstacles = [];
const levelsPerPage = 5;
const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
const playerHeight = 30;
const grassHeight = playerHeight - 10;
const obstacleHeight = 100;
const levels = [
    // level 1 with 3 obstacles
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 20, height: grassHeight },
        { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 20, height: grassHeight },
        { type: 'grass', x: 1300, y: window.innerHeight - grassHeight, width: 20, height: grassHeight },
    ],
    // level 2 with 3 obstacles
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 40, height: grassHeight },
        { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 40, height: grassHeight },
        { type: 'grass', x: 1100, y: window.innerHeight - grassHeight, width: 40, height: grassHeight },
    ],
    // level 3 with 5 obstacles
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 40, height: grassHeight },
        { type: 'grass', x: 750, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 5) },
        { type: 'grass', x: 1000, y: window.innerHeight - grassHeight, width: 45, height: grassHeight },
        { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 30, height: (grassHeight + 10) },
        { type: 'grass', x: 1300, y: window.innerHeight - grassHeight, width: 40, height: grassHeight },
    ],
    // level 4 with 3 wide obstacles
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5) },
        { type: 'grass', x: 1000, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5) },
        { type: 'grass', x: 1500, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5) },
    ],
    // level 5 with 3 tall obstacles
    [
        { type: 'grass', x: 400, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 10) },
        { type: 'grass', x: 900, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 10) },
        { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 10) },
    ],
    // level 6 with a mix of tall and short obstacles
    [
        { type: 'grass', x: 400, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 10) },
        { type: 'grass', x: 700, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5) },
        { type: 'grass', x: 1100, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 10) },
        { type: 'grass', x: 1300, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5)},
        { type: 'grass', x: 1800, y: window.innerHeight - grassHeight, width: 35, height: (grassHeight + 10)},
        { type: 'grass', x: 2200, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 10) },
    ],
    // level 7 with more obstacles and varying heights
    [
        { type: 'grass', x: 500, y: window.innerHeight - grassHeight, width: 60, height: (grassHeight - 10) },
        { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 15) },
        { type: 'grass', x: 1100, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight - 5) },
        { type: 'grass', x: 1300, y: window.innerHeight - grassHeight, width: 70, height: (grassHeight + 20) },
        { type: 'grass', x: 1600, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight - 15) },
    ],
    // level 8 with narrow gaps between tall obstacles
    [
        { type: 'grass', x: 400, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 20) },
        { type: 'grass', x: 600, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 30) },
        { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 20) },
        { type: 'grass', x: 1000, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 25) },
        { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 15) },
    ],
    // level 9 with a series of staggered obstacles
    [
        { type: 'grass', x: 300, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 10) },
        { type: 'grass', x: 600, y: window.innerHeight - grassHeight, width: 60, height: (grassHeight - 5) },
        { type: 'grass', x: 900, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 10) },
        { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 20) },
        { type: 'grass', x: 1500, y: window.innerHeight - grassHeight, width: 30, height: (grassHeight + 15) },
    ],
    // level 10 with increasing obstacle density
    [
        { type: 'grass', x: 200, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 25) },
        { type: 'grass', x: 400, y: window.innerHeight - grassHeight, width: 30, height: (grassHeight + 10) },
        { type: 'grass', x: 600, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 15) },
        { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 60, height: (grassHeight - 10) },
        { type: 'grass', x: 1000, y: window.innerHeight - grassHeight, width: 50, height: (grassHeight + 30) },
        { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 70, height: (grassHeight - 5) },
        { type: 'grass', x: 1400, y: window.innerHeight - grassHeight, width: 40, height: (grassHeight + 10) },
    ],
    // level 11 which is impossible to fail rn lmao
    [
        { type: 'experimental' },
        { type: 'block', x: 400, y: window.innerHeight - grassHeight, width: 60, height: 20 },
        { type: 'expiramental-photo', x: 900, y: window.innerHeight - grassHeight - obstacleHeight, width: 100, height: 100 },
    ],
    // level 12 which introduces moving grass that is horribly bugged currently, hence the setting option
    [
        { type: 'experimental' },
        { type: 'moving-grass', bottomY: 400, topY: 200, width: 50, height: 20, x: 500, y: window.innerHeight - grassHeight },
    ],
    // level 13 which introduces blue potions which increase player speed
    [
        { type: 'experimental' },
        { type: 'blue-potion', x: 900, y: window.innerHeight - grassHeight - obstacleHeight, width: 100, height: 100 },
    ],
    // level 14 which soley exists to show how to import levels from other files if you want to
    level14,
    /* example block usage:
    [
        { type: 'block', x: 800, y: window.innerHeight - grassHeight, width: 60, height: 20 },
    ]
    make something with it ig if you want
    */
   /* example expiramental usage:
   photo:
   [
        { type: 'expiramental-photo', x: 900, y: window.innerHeight - grassHeight - obstacleHeight, width: 100, height: 100 },
    ],
    popup:
    [
        { type: 'experimental' },
    ],
    make something with it ig if you want
    */
   /* example moving grass: (VERY BUGGY, NOT RECCOMENDED TO USE UNLESS NEEDED)
   [
        { type: 'moving-grass', bottomY: 400, topY: 200, width: 50, height: 20, x: 500, y: window.innerHeight - grassHeight },
    ],
   */
  /* example blue potion usage:
  [
        { type: 'blue-potion', x: 900, y: window.innerHeight - grassHeight - obstacleHeight, width: 100, height: 70 },
    ]
    make something with it ig if you want*/
];

const totalPages = Math.ceil(levels.length / levelsPerPage); // this is here cause js was being stupid asf, couldnt access levels before initialization whatever

const player = {
    x: 50,
    y: window.innerHeight - playerHeight - 5,
    width: 30,
    height: playerHeight,
    velocityY: 0,
    gravity: 0.5,
    jumpPower: 10,
    jumpCount: 0,
    moveSpeed: 5,
};

function initGame() {
    showLevelMenu();
}

function navigateToLevel(level) {
    currentLevel = level;
    localStorage.setItem('currentLevel', currentLevel);
    
    const isExperimental = levels[currentLevel].some(obj => obj.type === 'experimental');
    if (isExperimental) {
        showExperimentalPopup(currentLevel);
    } else {
        startLevel(currentLevel);
    }
}

function showExperimentalPopup(levelToGoToAfterOk) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.color = '#fff';
    popup.style.borderRadius = '10px';
    popup.style.textAlign = 'center';
    popup.style.zIndex = 1000;

    const message = document.createElement('p');
    message.textContent = "This level is experimental, meaning it is not fully done, don't complain if it has bugs.";
    popup.appendChild(message);

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.marginTop = '10px';
    okButton.style.padding = '10px';
    okButton.style.backgroundColor = '#007BFF';
    okButton.style.color = '#fff';
    okButton.style.border = 'none';
    okButton.style.borderRadius = '5px';
    okButton.style.cursor = 'pointer';

    okButton.onclick = () => {
        document.body.removeChild(popup);
        startLevel(levelToGoToAfterOk);
    };

    popup.appendChild(okButton);
    document.body.appendChild(popup);
}

function showLevelMenu() {
    document.body.innerHTML = '';

    document.body.style.backgroundImage = 'url(./assets/background.png)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';

    const title = document.createElement('h1');
    title.textContent = 'Select Level';
    title.style.fontFamily = 'Poppins, sans-serif';
    title.style.textAlign = 'center';
    title.style.marginTop = '50px';
    title.style.color = '#fff';
    title.style.textShadow = '2px 2px 10px rgba(0, 0, 0, 0.7)';
    title.style.fontWeight = '700';
    title.style.fontSize = '3em';
    document.body.appendChild(title);

    const levelsContainer = document.createElement('div');
    levelsContainer.style.display = 'flex';
    levelsContainer.style.justifyContent = 'center';
    levelsContainer.style.flexWrap = 'wrap';
    levelsContainer.style.marginTop = '20px';
    document.body.appendChild(levelsContainer);

    const startLevel = currentPage * levelsPerPage;
    const endLevel = Math.min(startLevel + levelsPerPage, levels.length);

    for (let i = startLevel; i < endLevel; i++) {
        const button = document.createElement('button');
        button.textContent = `Level ${i + 1}`;
        button.style.width = '180px';
        button.style.height = '60px';
        button.style.margin = '10px';
        button.style.borderRadius = '12px';
        button.style.fontSize = '20px';
        button.style.fontFamily = 'Poppins, sans-serif';
        
        if (i === 0 || completedLevels.includes(i - 1)) {
            button.style.backgroundColor = '#007BFF';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '0 8px 15px rgba(0, 123, 255, 0.2)';
    
            button.onmouseover = () => {
                button.style.backgroundColor = '#0056b3';
                button.style.boxShadow = '0 12px 25px rgba(0, 86, 179, 0.3)';
                button.style.transform = 'translateY(-3px)';
            };
            button.onmouseout = () => {
                button.style.backgroundColor = '#007BFF';
                button.style.boxShadow = '0 8px 15px rgba(0, 123, 255, 0.2)';
                button.style.transform = 'translateY(0)';
            };
            
            button.onclick = () => navigateToLevel(i);
        } else {
            button.style.backgroundColor = '#888';
            button.style.cursor = 'not-allowed';
            button.disabled = true;
    
            button.onmouseover = null;
            button.onmouseout = null;
        }
    
        levelsContainer.appendChild(button);
    }    

    const navContainer = document.createElement('div');
    navContainer.style.display = 'flex';
    navContainer.style.justifyContent = 'center';
    navContainer.style.marginTop = '30px';
    document.body.appendChild(navContainer);

    const prevButton = document.createElement('button');
    prevButton.textContent = '← Previous';
    prevButton.style.padding = '12px 25px';
    prevButton.style.marginRight = '20px';
    prevButton.style.fontSize = '18px';
    prevButton.style.cursor = 'pointer';
    prevButton.style.borderRadius = '8px';
    prevButton.style.backgroundColor = currentPage > 0 ? '#28A745' : '#888';
    prevButton.style.color = '#fff';
    prevButton.style.border = 'none';
    prevButton.style.transition = 'all 0.3s ease';
    prevButton.style.boxShadow = '0 8px 15px rgba(40, 167, 69, 0.2)';

    prevButton.onclick = () => {
        if (currentPage > 0) {
            currentPage--;
            showLevelMenu();
        }
    };

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next →';
    nextButton.style.padding = '12px 25px';
    nextButton.style.fontSize = '18px';
    nextButton.style.cursor = 'pointer';
    nextButton.style.borderRadius = '8px';
    nextButton.style.backgroundColor = currentPage < totalPages - 1 ? '#28A745' : '#888';
    nextButton.style.color = '#fff';
    nextButton.style.border = 'none';
    nextButton.style.transition = 'all 0.3s ease';
    nextButton.style.boxShadow = '0 8px 15px rgba(40, 167, 69, 0.2)';

    nextButton.onclick = () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            showLevelMenu();
        }
    };

    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);

    const settingsButton = document.createElement('button');
    settingsButton.textContent = '⚙';
    settingsButton.style.position = 'absolute';
    settingsButton.style.top = '20px';
    settingsButton.style.right = '20px';
    settingsButton.style.fontSize = '30px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.backgroundColor = 'transparent';
    settingsButton.style.color = '#fff';
    settingsButton.style.border = 'none';
    settingsButton.style.transition = 'transform 0.3s ease';
    settingsButton.onmouseover = () => {
        settingsButton.style.transform = 'scale(1.2)';
    };
    settingsButton.onmouseout = () => {
        settingsButton.style.transform = 'scale(1)';
    };
    document.body.appendChild(settingsButton);
    
    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.style.position = 'fixed';
    backgroundOverlay.style.top = '0';
    backgroundOverlay.style.left = '0';
    backgroundOverlay.style.width = '100%';
    backgroundOverlay.style.height = '100%';
    backgroundOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    backgroundOverlay.style.opacity = '0';
    backgroundOverlay.style.transition = 'opacity 0.5s ease';
    backgroundOverlay.style.display = 'none';
    document.body.appendChild(backgroundOverlay);
    
    const settingsMenu = document.createElement('div');
    settingsMenu.style.position = 'absolute';
    settingsMenu.style.top = '50%';
    settingsMenu.style.left = '50%';
    settingsMenu.style.transform = 'translate(-50%, -50%)';
    settingsMenu.style.backgroundColor = '#f4f4f4';
    settingsMenu.style.borderRadius = '20px';
    settingsMenu.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
    settingsMenu.style.padding = '25px';
    settingsMenu.style.width = '350px';
    settingsMenu.style.maxHeight = '400px';
    settingsMenu.style.overflowY = 'auto';
    settingsMenu.style.opacity = '0';
    settingsMenu.style.transition = 'opacity 0.5s ease';
    settingsMenu.style.pointerEvents = 'none';
    document.body.appendChild(settingsMenu);
    
    let currentContextMenu = null;
    
    function saveSwitchValue(key, value) {
        localStorage.setItem(key, value);
    }
    
    function loadSwitchValue(key) {
        return localStorage.getItem(key);
    }
    
    function createCategory(title) {
        const categoryContainer = document.createElement('div');
        categoryContainer.style.marginBottom = '30px';
    
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = title;
        categoryTitle.style.fontFamily = 'Poppins, sans-serif';
        categoryTitle.style.fontSize = '20px';
        categoryTitle.style.marginBottom = '10px';
        categoryContainer.appendChild(categoryTitle);
    
        settingsMenu.appendChild(categoryContainer);
        return categoryContainer;
    }
    
    function createSwitch(labelText, description, switchKey, defaultState, categoryContainer, additionalSwitches = []) {
        const switchContainer = document.createElement('div');
        switchContainer.style.display = 'flex';
        switchContainer.style.alignItems = 'center';
        switchContainer.style.marginBottom = '20px';
    
        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.fontFamily = 'Poppins, sans-serif';
        label.style.fontSize = '18px';
        label.style.marginRight = 'auto';
        label.title = description;
        label.style.cursor = 'default';
    
        const sliderContainer = document.createElement('div');
        sliderContainer.style.position = 'relative';
        sliderContainer.style.width = '40px';
        sliderContainer.style.height = '20px';
        sliderContainer.style.borderRadius = '10px';
        sliderContainer.style.cursor = 'pointer';
        sliderContainer.style.transition = 'background-color 0.3s';
    
        const slider = document.createElement('div');
        slider.style.position = 'absolute';
        slider.style.height = '16px';
        slider.style.width = '16px';
        slider.style.borderRadius = '50%';
        slider.style.backgroundColor = '#fff';
        slider.style.transition = 'left 0.3s';
    
        const isEnabled = loadSwitchValue(switchKey) !== null ? loadSwitchValue(switchKey) === 'true' : defaultState === 'enabled';
        slider.style.left = isEnabled ? '24px' : '2px';
        sliderContainer.style.backgroundColor = isEnabled ? '#4CAF50' : '#555';
    
        sliderContainer.onclick = () => {
            const currentState = slider.style.left === '24px';
            const targetPosition = currentState ? '2px' : '24px';
            const targetColor = currentState ? '#555' : '#4CAF50';
    
            slider.style.transition = 'left 0.3s';
            slider.style.left = targetPosition;
    
            sliderContainer.style.transition = 'background-color 0.3s';
            sliderContainer.style.backgroundColor = targetColor;
    
            setTimeout(() => {
                saveSwitchValue(switchKey, !currentState);
            }, 300);
        };
    
        switchContainer.oncontextmenu = (event) => {
            event.preventDefault();
            openContextMenu(event.clientX, event.clientY, additionalSwitches);
        };
    
        sliderContainer.appendChild(slider);
        switchContainer.appendChild(label);
        switchContainer.appendChild(sliderContainer);
        categoryContainer.appendChild(switchContainer);
    }
    
    function openContextMenu(x, y, additionalSwitches) {
        if (currentContextMenu) {
            currentContextMenu.remove();
        }
    
        const contextMenu = document.createElement('div');
        contextMenu.style.position = 'absolute';
        contextMenu.style.top = `${y}px`;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.backgroundColor = '#fff';
        contextMenu.style.borderRadius = '10px';
        contextMenu.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        contextMenu.style.padding = '10px';
        contextMenu.style.zIndex = '1000';
    
        additionalSwitches.forEach(({ label, description, key, defaultState }) => {
            const switchDiv = document.createElement('div');
            switchDiv.style.display = 'flex';
            switchDiv.style.alignItems = 'center';
            switchDiv.style.marginBottom = '10px';
    
            const featureLabel = document.createElement('label');
            featureLabel.textContent = label;
            featureLabel.title = description;
            featureLabel.style.cursor = 'default';
    
            const featureSliderContainer = document.createElement('div');
            featureSliderContainer.style.position = 'relative';
            featureSliderContainer.style.width = '40px';
            featureSliderContainer.style.height = '20px';
            featureSliderContainer.style.borderRadius = '10px';
            featureSliderContainer.style.cursor = 'pointer';
            featureSliderContainer.style.transition = 'background-color 0.3s';
    
            const featureEnabled = loadSwitchValue(key) !== null ? loadSwitchValue(key) === 'true' : defaultState === 'enabled';
            const featureSlider = document.createElement('div');
            featureSlider.style.position = 'absolute';
            featureSlider.style.height = '16px';
            featureSlider.style.width = '16px';
            featureSlider.style.borderRadius = '50%';
            featureSlider.style.backgroundColor = '#fff';
            featureSlider.style.transition = 'left 0.3s';
    
            featureSliderContainer.style.backgroundColor = featureEnabled ? '#4CAF50' : '#555';
            featureSlider.style.left = featureEnabled ? '24px' : '2px';
    
            featureSliderContainer.onclick = () => {
                const currentState = featureSlider.style.left === '24px';
                const targetPosition = currentState ? '2px' : '24px';
                const targetColor = currentState ? '#555' : '#4CAF50';
    
                featureSlider.style.transition = 'left 0.3s';
                featureSlider.style.left = targetPosition;
    
                featureSliderContainer.style.transition = 'background-color 0.3s';
                featureSliderContainer.style.backgroundColor = targetColor;
    
                setTimeout(() => {
                    saveSwitchValue(key, !currentState);
                }, 300);
            };
    
            featureSliderContainer.appendChild(featureSlider);
            switchDiv.appendChild(featureLabel);
            switchDiv.appendChild(featureSliderContainer);
            contextMenu.appendChild(switchDiv);
        });
    
        document.body.appendChild(contextMenu);
        currentContextMenu = contextMenu;
    
        const closeContextMenu = (event) => {
            if (!contextMenu.contains(event.target)) {
                contextMenu.remove();
                currentContextMenu = null;
                document.removeEventListener('click', closeContextMenu);
            }
        };
    
        document.addEventListener('click', closeContextMenu);
    }    
    
    function closeSettingsMenu() {
        settingsMenu.style.opacity = '0';
        settingsMenu.style.pointerEvents = 'none';
        backgroundOverlay.style.opacity = '0';
        setTimeout(() => {
            settingsMenu.style.display = 'none';
            backgroundOverlay.style.display = 'none';
        }, 500);
    }
    
    let switchesLoaded = false;

    settingsButton.onclick = () => {
        if (settingsMenu.style.display === 'none' || settingsMenu.style.display === '') {
            settingsMenu.style.display = 'block';
            backgroundOverlay.style.display = 'block';
            settingsMenu.style.opacity = '1';
            backgroundOverlay.style.opacity = '1';
            settingsMenu.style.pointerEvents = 'auto';

            if (!switchesLoaded) {
                loadSwitches();
                switchesLoaded = true;
            }
        } else {
            closeSettingsMenu();
        }
    };

    function loadSwitches() {
        /* example sub switch system thingy thingy thing: 
        createSwitch('title', 'description.', 'switchvalue', 'disabled', switchcategory, [
            { label: 'sub switch 1', description: 'description', key: 'subswitchvalue', defaultState: 'disabled' }
        ]);*/
        const firstCategory = createCategory('Graphics Settings');
        createSwitch('Enable Moving Grass (BUGGY)', 'Enables moving grass', 'byeSwitchValue', 'disabled', firstCategory);

        const secondCategory = createCategory('Audio Settings');
        createSwitch('Enable Music', 'Toggles game music.', 'musicSwitchValue', 'enabled', secondCategory, [
            { label: 'All Sounds', description: 'Enable/disable all sounds in the game', key: 'allSoundsSwitchValue', defaultState: 'disabled' }
        ]);

        const thirdCategory = createCategory('Miscellaneous Settings');
        createSwitch('hi', 'hello, this does absolutely nothing', 'hiSwitchValue', 'enabled', thirdCategory);
    }
    
    backgroundOverlay.onclick = closeSettingsMenu;  
}

function saveSwitchValue(key, value) {
    localStorage.setItem(key, value);
}

function loadSwitchValue(key) {
    return localStorage.getItem(key);
}

function startLevel(level) {
    const byeSwitchValue = loadSwitchValue('byeSwitchValue') === 'true';

    document.body.innerHTML = '';
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    const gameContainer = document.createElement('div');
    gameContainer.style.position = 'relative';
    gameContainer.style.overflow = 'hidden';
    gameContainer.style.width = '100vw';
    gameContainer.style.height = '100vh';
    document.body.appendChild(gameContainer);

    const background = document.createElement('img');
    background.src = './assets/background.png';
    background.style.position = 'absolute';
    background.style.width = '100%';
    background.style.height = '100%';
    background.style.objectFit = 'cover';
    background.style.zIndex = '-1';
    background.style.userSelect = 'none';
    gameContainer.appendChild(background);

    levels[level].forEach(obstacle => {
        let obstacleElement;

        if (obstacle.type === 'grass') {
            obstacleElement = document.createElement('img');
            obstacleElement.src = './assets/grass-1.png';
            obstacleElement.style.zIndex = '1';
        } else if (obstacle.type === 'moving-grass') {
            if (byeSwitchValue) {
                obstacleElement = document.createElement('img');
                obstacleElement.src = './assets/grass-2.png';
                obstacleElement.style.zIndex = '1';
                animateMovingGrass(obstacleElement, obstacle.bottomY, obstacle.topY);
            }
        } else if (obstacle.type === 'block') {
            obstacleElement = document.createElement('img');
            obstacleElement.src = './assets/block.png';
        } else if (obstacle.type === 'expiramental-photo') {
            obstacleElement = document.createElement('img');
            obstacleElement.src = './assets/expiramental-photo.png';
        } else if (obstacle.type === 'blue-potion') {
            obstacleElement = document.createElement('img');
            obstacleElement.src = './assets/blue-potion.png';
        }

        if (obstacleElement) {
            obstacleElement.style.position = 'absolute';
            obstacleElement.style.left = `${obstacle.x}px`;
            obstacleElement.style.top = `${obstacle.y}px`;
            obstacleElement.style.width = `${obstacle.width}px`;
            obstacleElement.style.height = `${obstacle.height}px`;
            obstacleElement.setAttribute('data-cleared', 'false');
            obstacleElement.style.userSelect = 'none';
            gameContainer.appendChild(obstacleElement);
        }
    });

    initPlayer(gameContainer);
}

function animateMovingGrass(obstacleElement, bottomY, topY) {
    const byeSwitchValue = loadSwitchValue('byeSwitchValue');
    if (!byeSwitchValue) return;

    let movingUp = true;
    const movementSpeed = 2;

    function animate() {
        const currentTop = parseFloat(obstacleElement.style.top);

        if (movingUp) {
            if (currentTop > topY) {
                obstacleElement.style.top = `${currentTop - movementSpeed}px`;
            } else {
                movingUp = false;
            }
        } else {
            if (currentTop < bottomY) {
                obstacleElement.style.top = `${currentTop + movementSpeed}px`;
            } else {
                movingUp = true;
            }
        }
        
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function initPlayer(gameContainer) {
    resetPlayer();
    const playerElement = document.createElement('img');
    playerElement.src = './assets/player.png';
    playerElement.style.position = 'absolute';
    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;
    playerElement.style.width = `${player.width}px`;
    playerElement.style.height = `${player.height}px`;
    gameContainer.appendChild(playerElement);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
            e.preventDefault(); // your welcome human being, learn how js works <3
            jump();
        }
    });
    
    document.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            jump();
        }
    });    

    const gameInterval = setInterval(() => {
        updateGame(playerElement, gameContainer, gameInterval);
    }, 20);
}

function jump() {
    if (player.jumpCount < 1) { 
        player.velocityY = -player.jumpPower; 
        player.jumpCount++;
    }
}

function updateGame(playerElement, gameContainer, gameInterval) {
    player.velocityY += player.gravity; 
    player.y += player.velocityY;

    const obstacleElements = gameContainer.querySelectorAll('img[src="./assets/grass-1.png"], img[src="./assets/grass-2.png"], img[src="./assets/block.png"], img[src="./assets/expiramental-photo.png"], img[src="./assets/blue-potion.png"]');
    
    obstacleElements.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        const playerRect = {
            left: player.x,
            top: player.y,
            right: player.x + player.width,
            bottom: player.y + player.height,
        };

        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top &&
            playerRect.top < obstacleRect.bottom
        ) {
            if (obstacle.src.includes('block.png')) {
                if (player.velocityY > 0) {
                    player.y = obstacleRect.top - player.height;
                    player.velocityY = 0;
                    player.jumpCount = 0;
                }
            } else if (obstacle.src.includes('expiramental-photo.png')) {
                return;
            } else if (obstacle.src.includes('blue-potion.png')) {
                player.moveSpeed = 8;
                setTimeout(() => {
                    player.moveSpeed = 5;
                }, 3000);
                return;
            } else {
                clearInterval(gameInterval);
                showGameOverMessage();
            }
        }
    });

    const movingGrassElements = gameContainer.querySelectorAll('img[src="./assets/grass-2.png"]');
    movingGrassElements.forEach(movingGrass => {
        const bottomY = parseFloat(movingGrass.getAttribute('data-bottomY'));
        const topY = parseFloat(movingGrass.getAttribute('data-topY'));
        const currentTop = parseFloat(movingGrass.style.top);
        const isMovingUp = movingGrass.getAttribute('data-movingUp') === 'true';

        if (isMovingUp) {
            movingGrass.style.top = `${currentTop - 1}px`;
            if (currentTop <= topY) {
                movingGrass.style.top = `${topY}px`;
                movingGrass.setAttribute('data-movingUp', 'false');
            }
        } else {
            movingGrass.style.top = `${currentTop + 1}px`;
            if (currentTop >= bottomY) {
                movingGrass.style.top = `${bottomY}px`;
                movingGrass.setAttribute('data-movingUp', 'true');
            }
        }
    });

    if (player.y > window.innerHeight - playerHeight - 5) {
        player.y = window.innerHeight - playerHeight - 5; 
        player.jumpCount = 0; 
        player.velocityY = 0; 
    }

    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;

    moveObstacles(gameContainer);

    checkCollisions(gameInterval);
}

function moveObstacles(gameContainer) {
    const obstacleElements = gameContainer.querySelectorAll('img[src="./assets/grass-1.png"], img[src="./assets/grass-2.png"], img[src="./assets/block.png"], img[src="./assets/expiramental-photo.png"], img[src="./assets/blue-potion.png"]');
    
    obstacleElements.forEach(obstacle => {
        const currentX = parseFloat(obstacle.style.left);
        obstacle.style.left = `${currentX - player.moveSpeed}px`;

        if (currentX < -50) {
            obstacle.style.display = 'none';
            activeObstacles = activeObstacles.filter(item => item !== obstacle);
        }
    });
}

function checkCollisions(gameInterval) {
    const obstacleElements = document.querySelectorAll('img[src="./assets/grass-1.png"], img[src="./assets/grass-2.png"], img[src="./assets/grass-1.png"], img[src="./assets/grass-2.png"], img[src="./assets/block.png"], img[src="./assets/expiramental-photo.png"], img[src="./assets/blue-potion.png"]');
    
    obstacleElements.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        const playerRect = {
            left: player.x,
            top: player.y,
            right: player.x + player.width,
            bottom: player.y + player.height,
        };
    
        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top &&
            playerRect.top < obstacleRect.bottom
        ) {
            if (obstacle.src.includes('block.png')) {
                return;
            }
            if (obstacle.src.includes('expiramental-photo.png')) {
                return;
            }
            if (obstacle.src.includes('blue-potion.png')) {
                return;
            } else {
                clearInterval(gameInterval);
                showGameOverMessage();
            }
        } else {
            if (parseFloat(obstacle.style.left) + obstacleRect.width < playerRect.left) {
                obstacle.setAttribute('data-cleared', 'true');
                obstacle.style.display = 'none';
                activeObstacles.push(obstacle);
            }
        }
    });

    const allCleared = Array.from(obstacleElements).every(obstacle => obstacle.getAttribute('data-cleared') === 'true');
    if (allCleared) {
        clearInterval(gameInterval);
        levelComplete();
    }
}

document.querySelectorAll('img[src="./assets/grass-1.png"], img[src="./assets/grass-2.png"], img[src="./assets/block.png"], img[src="./assets/expiramental-photo.png"], img[src="./assets/blue-potion.png"]').forEach(obstacle => {
    activeObstacles.push(obstacle);
});

function showGameOverMessage() { 
    // idk why tf this works, but it does so aight

    let existingMessageContainer = document.querySelector('div[style*="position: fixed;"]');
    
    if (existingMessageContainer) {
        existingMessageContainer.innerHTML = `
            <h2>You touched the grass!</h2>
            <p>Game over!</p>
            <button id="dismiss-button" style="margin-top: 10px; padding: 10px 20px;">Dismiss</button>
            <button id="restart-button" style="margin-top: 10px; padding: 10px 20px;">Restart</button>
        `;
    } else {
        existingMessageContainer = document.createElement('div');
        existingMessageContainer.style.position = 'fixed';
        existingMessageContainer.style.top = '50%';
        existingMessageContainer.style.left = '50%';
        existingMessageContainer.style.transform = 'translate(-50%, -50%)';
        existingMessageContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        existingMessageContainer.style.color = '#fff';
        existingMessageContainer.style.padding = '20px';
        existingMessageContainer.style.borderRadius = '10px';
        existingMessageContainer.style.zIndex = '1000';
        existingMessageContainer.style.textAlign = 'center';
        existingMessageContainer.innerHTML = `
            <h2>You touched the grass!</h2>
            <p>Game over!</p>
            <button id="dismiss-button" style="margin-top: 10px; padding: 10px 20px;">Dismiss</button>
            <button id="restart-button" style="margin-top: 10px; padding: 10px 20px;">Restart</button>
        `;
        document.body.appendChild(existingMessageContainer);
    }

    document.getElementById('dismiss-button').onclick = () => {
        document.body.removeChild(existingMessageContainer);
        showLevelMenu();
    };

    document.getElementById('restart-button').onclick = () => {
        document.body.removeChild(existingMessageContainer);
        navigateToLevel(currentLevel);
    };
}

function levelComplete() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    document.body.appendChild(overlay);

    const message = document.createElement('h2');
    message.textContent = `Level ${currentLevel + 1} Complete`;
    overlay.appendChild(message);

    const quitButton = document.createElement('button');
    quitButton.textContent = 'Quit';
    quitButton.onclick = () => {
        if (!completedLevels.includes(currentLevel)) {
            completedLevels.push(currentLevel);
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        }
        document.body.removeChild(overlay);
        showLevelMenu();
    };
    overlay.appendChild(quitButton);

    const continueButton = document.createElement('button');
    continueButton.textContent = 'Continue';
    continueButton.onclick = () => {
        if (!completedLevels.includes(currentLevel)) {
            completedLevels.push(currentLevel);
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        }
        document.body.removeChild(overlay);
        navigateToLevel(currentLevel + 1);
    };
    overlay.appendChild(continueButton);
}

function resetPlayer() {
    player.x = 50;
    player.y = window.innerHeight - playerHeight - 5;
    player.velocityY = 0;
    player.jumpCount = 0;
}

window.onload = initGame;