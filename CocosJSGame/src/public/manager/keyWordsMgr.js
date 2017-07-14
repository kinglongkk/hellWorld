var s_sharedKeyWordsMgr = null;

var KeyWordsMgr = cc.Class.extend({

    ctor: function () {
        this.keyWordsCfg = [];
    },

    reset: function(){
        this.keyWordsCfg = [];
    },

    init: function(){
        this.reset();
        this.loadKeyWordsCfg();
    },

    loadKeyWordsCfg: function(){
        if(!_key_words_cfg){
            return false;
        }

        this.keyWordsCfg = _key_words_cfg;

        return true;
    },

    replaceWords: function(src, keys){
        if(!keys){
            keys = (!!this.keyWordsCfg) ? this.keyWordsCfg : [];
        }
        
        for(var i = 0; i < keys.length; i++){
            var re = new RegExp(keys[i], 'gim');
            var resArray = re.exec(src);
            var res = (!!resArray) ? resArray[0] : null ;
            if(!!res){
                src = src.replace(res, res.replace(/./gim, '*'));
            }
        }
        return src;
    },
});

KeyWordsMgr.getInstance = function () {
    if (!s_sharedKeyWordsMgr) {
        s_sharedKeyWordsMgr = new KeyWordsMgr();
        s_sharedKeyWordsMgr.init();
    }
    return s_sharedKeyWordsMgr;
};

