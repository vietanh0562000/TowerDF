let GameConfig = {}
GameConfig.perCell = 100;

GameConfig.MAP = {
    WIDTH: 7,
    HEIGHT: 7
}
GameConfig.MAP_WEIGHT_RANDOM = [
    [0, 1, 1, 2, 3, 3, 3],
    [1, 1, 1, 2, 3, 3, 3],
    [1, 1, 1, 2, 3, 3, 3],
    [2, 2, 2, 1, 2, 2, 2],
    [3, 3, 3, 2, 1, 1, 1],
    [3, 3, 3, 2, 1, 1, 1],
    [3, 3, 3, 2, 1, 1, 0],
];

GameConfig.ADJACENT = {
    ROW: [0, 1, 0, -1],
    COL: [-1, 0, 1, 0]
}

GameConfig.MONSTER_TYPE = [
    {
        type: 0,
        speed: 0.5,
        hp : 2,
        spriteSrc: "res/Enemy_1.png"
    },
    {
        type: 1,
        speed: 0.3,
        hp : 1,
        spriteSrc: "res/Enemy_2.png"
    },
    {
        type: 2,
        speed: 0.6,
        hp: 3,
        spriteSrc: "res/Enemy_3.png"
    }
];

GameConfig.STATE = {
    BUILDING_MAP: 0,
    PLAYING: 1
}