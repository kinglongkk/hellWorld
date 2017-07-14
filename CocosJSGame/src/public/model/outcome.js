var outcome = cc.Class.extend({
	ctor: function () {
		this.reset();
	},

	reset: function(){
		//玩家ID数组
        cc.log("设置player人数重置");
        this.gamePlayernum = 4;
        this.playerDatas = [];
		for(var i = 0; i < this.gamePlayernum; i++){
			this.playerDatas[i] = {
					nPlayer:null,
					gNumPoint:[]
			};
		}	
		
	},

    resetWithPlayerCount: function (nCount) {
        if (nCount == this.gamePlayernum) return;

        cc.log("重置设置player人数");
        this.gamePlayernum = nCount;
        this.playerDatas = [];
        for(var i = 0; i < this.gamePlayernum; i++){
            this.playerDatas[i] = {
                nPlayer:null,
                gNumPoint:[]
            };
        }
    },
	
	test:function(){
		for(var i = 0; i < this.gamePlayernum; i++){
			this.playerDatas[i] = {
					nPlayer:g_objHero,
					gNumPoint:[1,2,3,4,5,6,7,8]
			};
		}
	},

    setPlayerByChairId: function (chairId, player) {
	    cc.log("player人数"+chairId);
	    if (this.playerDatas[chairId]) this.playerDatas[chairId].nPlayer = player;
    },
    getPlayerByChairId: function (chairId) {
        return this.playerDatas[chairId].nPlayer;
    },

    setPointByChairId: function (chairId, point) {
        if (Object.prototype.toString.call(point) === '[object Array]') {
            this.playerDatas[chairId].gNumPoint = point;
        } else {
            this.playerDatas[chairId].gNumPoint.push(point);
        }
    },
    getPointByChairId: function (chairId) {
        return this.playerDatas[chairId].gNumPoint;
    }

});

var g_outcome = new outcome();

