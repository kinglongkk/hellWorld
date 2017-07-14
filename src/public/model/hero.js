var Hero = Player.extend({
    ctor: function () {
        Player.prototype.ctor.call(this);

        this.strBindMb = "";
        this.lockInfo = {};
        this._backPlazaSign = false;
    },
    
    setBindMb: function(strMb){
    	this.strBindMb = strMb;
    },
    getBindMb: function(){
    	return this.strBindMb;
    },

    setBackPlazaSign: function (sign) {
        this._backPlazaSign = sign;
    },
    getBackPlazaSign: function () {
        return this._backPlazaSign;
    },

    setLockInfo: function(lockInfo){
    	cc.log("lockInfo = " + JSON.stringify(lockInfo));
    	this.lockInfo = lockInfo;
    },
    getLockInfo: function(){
    	return this.lockInfo;
    },
});

var g_objHero = new Hero();

