let Monster = cc.Sprite.extend({
    type: null,
    speed: null,
    hp: null,
    track: null,
    ctor: function (arg){
        cc.log("Create Monster: " + arg.type);

        this._super(GameConfig.MONSTER_TYPE[arg.type].spriteSrc)
        this.init(arg);
    },
    init: function (arg){
        this.type = arg.type;
        this.speed = GameConfig.MONSTER_TYPE[this.type].speed;
        this.hp = GameConfig.MONSTER_TYPE[this.type].hp;
        this.setPosition(arg.x, arg.y);
        this.setAnchorPoint(0, 0);
        this.track = [];
        this.scheduleUpdate();
    },
    update: function (dt){
        if (this.x / 100 == GameConfig.MAP.HEIGHT - 1 && this.y / 100 == GameConfig.MAP.WIDTH - 1){
            //poolMonster[this.type].push(this);
            this.visible = false;
        }
    },
    BFS: function (Map, startX, startY, endX, endY){
        let track = [];
        let Pass = new Array(GameConfig.MAP.HEIGHT);
        for (let i = 0; i < Pass.length; i++){
            Pass[i] = new Array(GameConfig.MAP.WIDTH);
        }
        for (let i = 0; i < Pass.length; i++){
            for (let j = 0; j < Pass[i].length; j++) Pass[i][j] = 0;
        }


        let queue = [];
        let index = 0;
        queue.push({u:startX, v:startY, parent: -1});
        Pass[0][0] = 1;
        while (index < queue.length){
            let u = queue[index].u;
            let v = queue[index].v;
            if (u == endX && v == endY){
                break;
            }
            for (let i = 0; i < GameConfig.ADJACENT.ROW.length; i++){
                let next_u = u + GameConfig.ADJACENT.ROW[i];
                let next_v = v + GameConfig.ADJACENT.COL[i];
                if (next_v < 0 || next_u < 0 || next_u >= GameConfig.MAP.HEIGHT || next_v >= GameConfig.MAP.WIDTH) continue;

                if (Map[next_u][next_v].type == 1 && this.type != 2) continue;
                if (Pass[next_u][next_v] == 0){
                    Pass[next_u][next_v] = 1;
                    queue.push({u:next_u, v:next_v, parent:index});
                }
            }
            index++;

        }
        if (index < queue.length){
            while(index != -1){
                track.push({x: queue[index].u, y: queue[index].v});
                index = queue[index].parent;
            }
            track.reverse();
            return track;
        }else{
            return null;
        }
    },
    createTrack: function(Map, type){
        if (type == GameConfig.STATE.BUILDING_MAP){
            let x = Math.floor(Math.random() * (GameConfig.MAP.WIDTH-1));
            let y = Math.floor(Math.random() * (GameConfig.MAP.HEIGHT-1));
            let track1 = this.BFS(Map, 0, 0, x, y);
            let track2 = this.BFS(Map, x, y, GameConfig.MAP.HEIGHT-1, GameConfig.MAP.WIDTH-1);
            if (track1 && track2){
                this.track = track1.concat(track2);
            }
        }else{
            this.track = this.BFS(Map, 0, 0, GameConfig.MAP.HEIGHT-1, GameConfig.MAP.WIDTH-1);
        }
    },
    moveMonster: function (){
        let moveToTowerArray = [];
        for (let i = 1; i < this.track.length; i++){
            let move = cc.moveTo(GameConfig.MONSTER_TYPE[this.type].speed,cc.p(this.track[i].x * GameConfig.perCell, this.track[i].y * GameConfig.perCell));
            moveToTowerArray.push(move);
        }
        let moveToTower = cc.sequence(moveToTowerArray);
        this.runAction(moveToTower);
    }
})