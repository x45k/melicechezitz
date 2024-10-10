const playerHeight = 30;
const grassHeight = playerHeight - 10;
const obstacleHeight = 70;

const level14 = [
    { type: 'experimental' },
    { type: 'grass', x: 400, y: window.innerHeight - grassHeight, width: 60, height: grassHeight },
    { type: 'grass', x: 800, y: window.innerHeight - grassHeight, width: 40, height: grassHeight + 15 },
    { type: 'grass', x: 1200, y: window.innerHeight - grassHeight, width: 50, height: grassHeight - 5 },
    { type: 'blue-potion', x: 1500, y: window.innerHeight - grassHeight - obstacleHeight, width: 100, height: 100 },
];

export default level14;