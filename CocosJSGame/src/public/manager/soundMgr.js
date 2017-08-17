var s_sharedSoundMgr = null;

var SoundMgr = cc.Class.extend({
	_language: "soundCN",

    ctor: function () {
    	this._bPlayMusic = true;
    	this._bPlayEffect = true;

        this._curMusicFile = null;
        this._bLoopMusic = true;
    },

    setLanguage: function (language) {
        this._language = language;
    },

    getSoundFile: function (soundID, sex) {
    	if(_sound_cfg == null){
    		return;
    	}
    	
        var languageID = "";
        var soundFile = "";

        switch (this._language) {
            case "cn":
            {
                languageID = "soundCN";
            }
                break;
            case "en":
            {
                languageID = "soundEN";
            }
                break;
            default :
            {
                languageID = "soundCN";
            }
                break;
        }

        var soundIDs = [];
        switch (sex) {
            case "man":
            {
                soundIDs = _sound_cfg[languageID][soundID]["man"];
            }
                break;
            case "woman":
            {
                soundIDs = _sound_cfg[languageID][soundID]["woman"];
            }
                break;
            default :
            {
                soundIDs = _sound_cfg[languageID][soundID];
            }
                break;
        }

        if (soundIDs && soundIDs.length > 0) {
            var randLen = soundIDs.length;
            var rand = Math.random() * randLen;
            var randID = Math.floor(rand);
            soundFile = soundIDs[randID];
        }

        return soundFile;
    },

    playMusic: function (soundID, sex, loop) {
    	var soundFile = this.getSoundFile(soundID, sex);
        if (!soundFile || soundFile == "") {
            cc.log("Not find " + soundID);
            return;
        }

        this._curMusicFile = soundFile;
        this._bLoopMusic = loop;
        
        if(this._bPlayMusic){
            cc.audioEngine.playMusic(soundFile, loop);
        }
    },

    playEffect: function (soundID, sex, loop) {
    	if(!this._bPlayEffect){
    		return;
    	}
    	
        var soundFile = this.getSoundFile(soundID, sex);
        if (!soundFile || soundFile == "") {
            cc.log("Not find " + soundID);
            return;
        }
        else
        {
            cc.log("播放:"+soundFile);
        }
        cc.audioEngine.playEffect(soundFile, loop);
    },
    
    setPlayMusic: function(bPlay){
    	if(bPlay == this._bPlayMusic){
            return;
        }

        this._bPlayMusic = bPlay;
        
        if(bPlay){
            if(this._curMusicFile){
                cc.audioEngine.playMusic(this._curMusicFile, this._bLoopMusic);
            }
            //cc.audioEngine.resumeMusic();
        }else{
            //cc.audioEngine.pauseMusic();
            cc.audioEngine.stopMusic(true);
        }
    },
    
    stopMusic: function(){
    	cc.audioEngine.stopMusic(true);
    },
    
    setPlayEffect: function(bPlay){
    	this._bPlayEffect = bPlay;
    	
    	if(!bPlay){
    		cc.audioEngine.stopAllEffects();
    	}
    },
    
    //value:0-1
    setMusicVolume: function(value){
    	cc.audioEngine.setMusicVolume(value);
    },
    setEffectsVolume: function(value){
    	cc.audioEngine.setEffectsVolume(value);
    },
});

SoundMgr.getInstance = function () {
    if (!s_sharedSoundMgr) {
        s_sharedSoundMgr = new SoundMgr();
    }
    return s_sharedSoundMgr;
};

