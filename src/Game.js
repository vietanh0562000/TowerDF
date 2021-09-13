let Game = cc.Layer.extend({
    Map: null,
    Monster: null,
    time: null,
    timeToRemove: null,
    trackOfMonster: null,
    ctor:function (){
        this._super();
        this.Monster = [];
        this.time = 0;
        this.timeToRemove = 0;
        this.trackOfMonster = [];
        poolMonster = new Array(GameConfig.MONSTER_TYPE.length);
        this.init();
    },
    init: function (){
        for (let i = 0; i < poolMonster.length; i++){
            poolMonster[i] = [];
        }
        this.createMap();
        this.addTouchListener();
        this.scheduleUpdate();
    },
    update: function (dt){
        this.time += dt;
        if (this.time > 2){
            let typeMonster = Math.floor(Math.random() * 3);
            let newMonster = null;
            // if (poolMonster[typeMonster].length === 0){
            newMonster = new Monster({type: typeMonster, x: 0, y: 0});
            this.addChild(newMonster, 2);
            this.Monster.push(newMonster);
            // }else{
            //     cc.log(poolMonster[typeMonster].length);
            //     newMonster = poolMonster[typeMonster].pop();
            //     cc.log(poolMonster[typeMonster].length);
            //     newMonster.setPosition(0, 0);
            //     newMonster.visible = true;
            // }

            if (!this.trackOfMonster[newMonster.type]){
                newMonster.createTrack(this.Map, GameConfig.STATE.PLAYING);
                this.trackOfMonster[newMonster.type] = newMonster.track;
            }
            else{
                newMonster.track = this.trackOfMonster[newMonster.type];
            }
            newMonster.moveMonster();
            if (this.Monster.length % 5 == 0){
                this.trackOfMonster = [];
                this.time = -7;
            }
            else{
                this.time = 0;
            }

        }
    },
    createMap: function (){
        let copy_MAP_WEIGHT_RANDOM = GameConfig.MAP_WEIGHT_RANDOM;
        // BUILD RAW MAP
        this.Map = new Array(7);
        for (let i = 0; i < 7; i++){
            this.Map[i] = new Array(7);
        }
        for (let i = 0; i < 7; i++){
            for (let j = 0; j < 7; j++){
                this.Map[i][j] = {};
                this.Map[i][j].type = 0;
                this.Map[i][j].sprite = new cc.Sprite("res/grass100.png");
                this.Map[i][j].sprite.setPosition(i * GameConfig.perCell, j * GameConfig.perCell);
                this.Map[i][j].sprite.setAnchorPoint(0,0);
                this.addChild(this.Map[i][j].sprite);
            }
        }

        // FIND TRACK FOR MONSTER
        let monster = new Monster({type: 1, x: 0, y: 0});
        monster.createTrack(this.Map, GameConfig.STATE.BUILDING_MAP);
        for (let i = 0; i < monster.track.length; i++){
            GameConfig.MAP_WEIGHT_RANDOM[monster.track[i].x][monster.track[i].y] = 0;
        }

        // ADD HINDRANCE
        this.createHindrance();
        GameConfig.MAP_WEIGHT_RANDOM = copy_MAP_WEIGHT_RANDOM;
    },
    // createMap: function (){
    //     let copy_MAP_WEIGHT_RANDOM = GameConfig.MAP_WEIGHT_RANDOM;
    //     this.Map = new Array(7);
    //     for (let i = 0; i < 7; i++){
    //         this.Map[i] = new Array(7);
    //     }
    //
    //     for (let i = 0; i < 7; i++){
    //         for (let j = 0; j < 7; j++){
    //             this.Map[i][j] = {};
    //             this.Map[i][j].type = 0;
    //             this.Map[i][j].sprite = new cc.Sprite("res/grass100.png");
    //             this.Map[i][j].sprite.setPosition(i * GameConfig.perCell, j * GameConfig.perCell);
    //             this.Map[i][j].sprite.setAnchorPoint(0,0);
    //             this.addChild(this.Map[i][j].sprite);
    //         }
    //     }
    //
    //     this.createHindrance();
    //     GameConfig.MAP_WEIGHT_RANDOM = copy_MAP_WEIGHT_RANDOM;
    //     if (!this.checkMapValid()) {
    //         //cc.log("Create again");
    //         this.createMap();
    //     }
    // },
    getRandomPosition: function (){
      let total = 0;
      for (let i = 0; i < GameConfig.MAP.HEIGHT; i++){
          for (let j = 0; j < GameConfig.MAP.WIDTH; j++){
              total += GameConfig.MAP_WEIGHT_RANDOM[i][j];
          }
      }

      let threshold = Math.random() * total;
      total = 0;
      //cc.log(threshold);
      for (let i = 0; i < GameConfig.MAP.HEIGHT; i++){
          for (let j = 0; j < GameConfig.MAP.WIDTH; j++){
              total += GameConfig.MAP_WEIGHT_RANDOM[i][j];
              if (total > threshold){
                  for (let k = 0; k < GameConfig.ADJACENT.ROW.length; k++){
                      let u = i + GameConfig.ADJACENT.ROW[k];
                      let v = j + GameConfig.ADJACENT.COL[k];
                      if (u < 0 || v < 0 || u >= GameConfig.MAP.HEIGHT || v >= GameConfig.MAP.WIDTH) continue;
                      GameConfig.MAP_WEIGHT_RANDOM[u][v] = 0;
                  }
                  return {x:i, y:j};
              }
          }
      }
    },
    createHindrance: function (){
        let numberHindrance = Math.floor(Math.random() * 2) + 5;
        for (let i = 0; i < numberHindrance; i++){
            let newPos = this.getRandomPosition();
            this.Map[newPos.x][newPos.y].type = 1;
            this.Map[newPos.x][newPos.y].sprite.setTexture("res/sand100.png");
            GameConfig.MAP_WEIGHT_RANDOM[newPos.x][newPos.y] = 0;
        }
    },
    addTouchListener: function (){
        cc.log("Click");
        let self = this;
        cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: function (event){
                    let x = Math.floor(event.getLocationX() / GameConfig.perCell);
                    let y = Math.floor(event.getLocationY() / GameConfig.perCell);
                    self.Map[x][y].type = 1;
                    self.Map[x][y].sprite.setTexture("res/sand100.png");
                }
            }, this)
    },

    checkMapValid: function (){
        let monster = new Monster({type: 1, x: 0, y: 0});
        monster.createTrack(this.Map, GameConfig.STATE.PLAYING);
        if (monster.track){
            return true;
        }
        return false;
    },

})