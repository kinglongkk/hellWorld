
var _CONFIG_ = cc.loader.getRes(res.config_cfg, true);

//帧动画
var _anim_cfg = cc.loader.getRes(res.animCfg_json, true);

//牌
var _CARD_CFG_ = cc.loader.getRes(res.cardCfg_json, true);

//声音
var _sound_cfg = cc.loader.getRes(res.sound_json);

//屏蔽关键字
var _key_words_cfg = cc.loader.getRes(res.keywords_json);

//
var _help_cfg = cc.loader.getRes(res.help_json);

//游戏头像
var _game_face_cfg = cc.loader.getRes(res.gameFace_json);

//平台http请求结果
var _HTTP_PLATFORM_CODE_ = cc.loader.getRes(res.httpPlatformCode_cfg);

//游戏列表
var _GAME_LIST_CFG_ = cc.loader.getRes(res.gameList_cfg);

// 商店列表
var _shop_config = cc.loader.getRes("res/public/config/shopConfig.json");

if(!cc.sys.isNative){
    _CONFIG_ = JSON.parse(cc.loader._loadTxtSync(res.config_cfg));

//帧动画
    _anim_cfg = JSON.parse(cc.loader._loadTxtSync(res.animCfg_json));

//牌
    _CARD_CFG_ = JSON.parse(cc.loader._loadTxtSync(res.cardCfg_json));

//声音
    _sound_cfg = JSON.parse(cc.loader._loadTxtSync(res.sound_json));

//屏蔽关键字
    _key_words_cfg = JSON.parse(cc.loader._loadTxtSync(res.keywords_json));

//
    _help_cfg = JSON.parse(cc.loader._loadTxtSync(res.help_json));

//游戏头像
    _game_face_cfg = JSON.parse(cc.loader._loadTxtSync(res.gameFace_json));

//平台http请求结果
    _HTTP_PLATFORM_CODE_ = JSON.parse(cc.loader._loadTxtSync(res.httpPlatformCode_cfg));

//游戏列表
    _GAME_LIST_CFG_ = JSON.parse(cc.loader._loadTxtSync(res.gameList_cfg));

    // 商店列表
    _shop_config = JSON.parse(cc.loader._loadTxtSync("res/public/config/shopConfig.json"));
}

