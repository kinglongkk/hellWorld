/**
 * Created by lingjianfeng on 15/1/15.
 */


var LINE_SPACE = 50;
var audioEngine = cc.audioEngine;
var soundId = null;

// TODO

// 1. 背景音乐一次只能播放一首。
// 2. 音效一次可以有多个同时播放
// 3. 音效和音乐的音量都是可以【分别】控制的  -- 分别
// 4. 音效和音乐都是支持循环播放的。
// 5. 音频格式在各个平台上的支持有所差异，
//      建议：若无高标准要求，例如：音频文件大小。那可以考虑统一使用mp3格式，省事。

var DenshionTests = [
    {
        title:"Play Music",
        playFunc:function () {
            return new playMusic();
        }
    },
    {
        title:"Stop Music",
        playFunc:function () {
            return new stopMusic();
        }
    },
    {
        title:"Pause Music",
        playFunc:function () {
            return new pauseMusic();
        }
    },
    {
        title:"Resume Music",
        playFunc:function () {
            return new resumeMusic();
        }
    },
    {
        title:"Rewind Music",
        playFunc:function () {
            return new rewindMusic();
        }
    },
    {
        title:"is Music Playing",
        playFunc:function () {
            return new isMusicPlaying();
        }
    },
    {
        title:"Increase Music Volume",
        playFunc:function () {
            return new addMusicVolume();
        }
    },
    {
        title:"Decrease Music Volume",
        playFunc:function () {
            return new subMusicVolume();
        }
    },
    {
        title:"Play Sound Effect",
        playFunc:function () {
            return new playEffect();
        }
    },
    {
        title:"Repeat Sound Effect",
        playFunc:function () {
            return new playEffectRepeatly();
        }
    },
    {
        title:"Stop Sound Effect",
        playFunc:function () {
            return new stopEffect();
        }
    },
    {
        title:"Unload Sound Effect",
        playFunc:function () {
            return new unloadEffect();
        }
    },
    {
        title:"Increase Sound Effect Volume",
        playFunc:function () {
            return new addEffectsVolume();
        }
    },
    {
        title:"Decrease Sound Effect Volume",
        playFunc:function () {
            return new subEffectsVolume();
        }
    },
    {
        title:"Pause Sound Effect",
        playFunc:function () {
            return new pauseEffect();
        }
    },
    {
        title:"Resume Sound Effect",
        playFunc:function () {
            return new resumeEffect();
        }
    },
    {
        title:"Pause All Sound Effects",
        playFunc:function () {
            return new pauseAllEffects();
        }
    },
    {
        title:"Resume All Sound Effects",
        playFunc:function () {
            return new resumeAllEffects();
        }
    },
    {
        title:"Stop All Sound Effects",
        playFunc:function () {
            return new stopAllEffects();
        }
    }
];



var AudioLayer = cc.LayerGradient.extend({

    _itemMenu : null,
	_testCount : 0,
    ctor:function () {
        this._super(cc.color(0, 0, 0, 255), cc.color(148, 80, 120, 255));
        this.loadMenu();

    },
    loadMenu : function(){
    	this._itemMenu = new cc.Menu();


        for (var i = 0; i < DenshionTests.length; i++) {
            var label = new cc.LabelTTF(DenshionTests[i].title, "Arial", 24);
            var menuItem = new cc.MenuItemLabel(label, this.onMenuCallback, this);
            this._itemMenu.addChild(menuItem, i + 10000);
            menuItem.x = GC.w2;
            menuItem.y = GC.h - (i + 1) * LINE_SPACE;
        }
        this._testCount = i;
        this._itemMenu.width = GC.w;
	    this._itemMenu.height = (this._testCount + 1) * LINE_SPACE;
        this._itemMenu.x = 0;
        this._itemMenu.y = 0;
        this.addChild(this._itemMenu);

        if( 'touches' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: function (touches, event) {
                    event.getCurrentTarget().moveMenu(touches[0].getDelta());
                }
            }, this);
        } else if ('mouse' in cc.sys.capabilities )
             cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                 onMouseMove: function(event){
                     if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().moveMenu(event.getDelta());
                 }
             }, this);

        audioEngine.setEffectsVolume(0.5);
        audioEngine.setMusicVolume(0.5);

    },
    moveMenu:function (delta) {
        var newY = this._itemMenu.y + delta.y;

        if (newY < 0)
            newY = 0;

        if (newY > ((DenshionTests.length + 1) * LINE_SPACE - GC.h))
            newY = ((DenshionTests.length + 1) * LINE_SPACE - GC.h);

        this._itemMenu.y = newY;
    },
    onMenuCallback : function(sender){
		var idx = sender.zIndex - 10000;
        DenshionTests[idx].playFunc();		    		
    }
});




var AudioScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new AudioLayer();
        this.addChild(layer);
    }
});



var playMusic = function () {
    cc.log("play background music");
	// 背景音乐[播放][一次只能播放一首][true和false表示：是否循环播放]
    audioEngine.playMusic(res.bg_mp3, false);
};

var stopMusic = function () {
    cc.log("stop background music");
	// 背景音乐[停止]
    audioEngine.stopMusic();
};

var pauseMusic = function () {
    cc.log("pause background music");
	// 背景音乐[暂停]
    audioEngine.pauseMusic();
};

var resumeMusic = function () {
    cc.log("resume background music");
	// 背景音乐[恢复]
    audioEngine.resumeMusic();
};

var rewindMusic = function () {
    cc.log("rewind background music");
	// 背景音乐[重新播放]
    audioEngine.rewindMusic();
};

// is background music playing
var isMusicPlaying = function () {
	// 逻辑判断[背景音乐是否正在播放]
    if (audioEngine.isMusicPlaying()) {
        cc.log("background music is playing");
    }
    else {
        cc.log("background music is not playing");
    }
};

var playEffect = function () {
    cc.log("play effect");
    // 音效[播放]
    soundId = audioEngine.playEffect(res.effect_mp3);
};

var playEffectRepeatly = function () {
    cc.log("play effect repeatly");
    // 音效[循环播放]
    soundId = audioEngine.playEffect(res.effect_mp3, false);
};

var stopEffect = function () {
    cc.log("stop effect");
    // 音效[停止]
    audioEngine.stopEffect(soundId);
};

var unloadEffect = function () {
    cc.log("unload effect");
    // 音效[卸载]
    audioEngine.unloadEffect(res.effect_mp3);
};

var addMusicVolume = function () {
    cc.log("add bakcground music volume");
    // 音效[音量增加]
    audioEngine.setMusicVolume(audioEngine.getMusicVolume() + 0.1);
};

var subMusicVolume = function () {
    cc.log("sub backgroud music volume");
    // 音效[音量减小]
    audioEngine.setMusicVolume(audioEngine.getMusicVolume() - 0.1);
};

var addEffectsVolume = function () {
    cc.log("add effects volume");
    audioEngine.setEffectsVolume(audioEngine.getEffectsVolume() + 0.1);
};

var subEffectsVolume = function () {
    cc.log("sub effects volume");
    audioEngine.setEffectsVolume(audioEngine.getEffectsVolume() - 0.1);
};

var pauseEffect = function () {
    cc.log("pause effect");
    audioEngine.pauseEffect(soundId);
};

var resumeEffect = function () {
    cc.log("resume effect");
    audioEngine.resumeEffect(soundId);
};

var pauseAllEffects = function () {
    cc.log("pause all effects");
    audioEngine.pauseAllEffects();
};
var resumeAllEffects = function () {
    cc.log("resume all effects");
    audioEngine.resumeAllEffects();
};
var stopAllEffects = function () {
    cc.log("stop all effects");
    audioEngine.stopAllEffects();
};
