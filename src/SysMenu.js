

var SysMenu = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        let winSize = cc.director.getWinSize();
        this.initBackGround();
        cc.log(g_mainmenu);

        let btnNewGame = ccui.Button();
        btnNewGame.setTitleText("New Game");
        btnNewGame.setTitleFontSize(32);
        btnNewGame.setZoomScale(0.1);
        btnNewGame.setPosition(winSize.width / 2, winSize.height / 2);
        btnNewGame.setPressedActionEnabled(true);
        this.addChild(btnNewGame);
        btnNewGame.addClickEventListener(this.onNewGame.bind(this));

        return true;
    },
    initBackGround:function()
    {
        //Add code here
    },

    onNewGame:function (pSender) {
        //load resources
        cc.log("Start");
        cc.LoaderScene.preload(g_maingame, function () {
            let scene = new cc.Scene();
            let newGame = new Game();
            scene.addChild(newGame);
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    },
    update:function () {

    },

});

SysMenu.scene = function () {
    var scene = new cc.Scene();
    var layer = new SysMenu();
    scene.addChild(layer);
    return scene;
}