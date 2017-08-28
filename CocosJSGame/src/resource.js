var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    dlgNnFpScene_json : "res/game_nnfp/dlgNnFpScene.json",
    nnFpAnimationPlist_plist: "res/game_nnfp/nnFpAnimationPlist.plist",
    dlgNnFpPlayer_json: "res/game_nnfp/dlgNnFpPlayer.json",
    huaiFengCardPlist_plist: "res/public/huaiFengCard/huaiFengCardPlist.plist",
    huaiFengCardPlist_png: "res/public/huaiFengCard/huaiFengCardPlist.png",
    dlgNnFpClock_json: "res/game_nnfp/dlgNnFpClock.json",
    dlgNnFpOpen_json: "res/game_nnfp/dlgNnFpOpen.json",
    dlgNnFpReady_json: "res/game_nnfp/dlgNnFpReady.json",
    dlgNnFpSystem_json: "res/game_nnfp/dlgNnFpSystem.json",
    dlgNnFpGetType_json: "res/game_nnfp/dlgNnFpGetType.json",
    dlgNnFpChooseTextChatScene_json: "res/game_nnfp/dlgChooseTextChatScene.json",
    tx1huoyan_plist: "res/game_nnfp/tx1huoyan.plist",
    nnFpWinOrLose_json : "res/game_nnfp/nnFpWinOrLoseNode.json",
    nnFpSet_json : "res/game_nnfp/dlgNnFpSet.json",
    nnFpRule_json : "res/game_nnfp/dlgNnFpRule.json",
    nnFpResultScene_json : "res/game_nnfp/dlgNnFpResultScene.json",
    nnFpReminder_json : "res/game_nnfp/dlgReminder.json",
    nnFpRobBanker_json : "res/game_nnfp/dlgNnFpRobBanker.json",
    nnFpAddChip_json : "res/game_nnfp/dlgNnFpAddChip.json",
    nnFpGamePlist_plist: "res/game_nnfp/gameNnFpPlist.plist",



    dlgCardOp_ddz_json: "res/game_nnfp/dlgCardOp_ddz.json",

    NiuNiuTable2R: "res/kkNiuNiu/NiuNiu/NiuNiuTable_4R/NiuNiuTable/NiuNiuTable2R.json",
    NiuNiuTable3R: "res/kkNiuNiu/NiuNiu/NiuNiuTable_4R/NiuNiuTable/NiuNiuTable3R.json",
    NiuNiuTable4R: "res/kkNiuNiu/NiuNiu/NiuNiuTable_4R/NiuNiuTable/NiuNiuTable4R.json",
    NiuNiuTable5R: "res/kkNiuNiu/NiuNiu/NiuNiuTable_4R/NiuNiuTable/NiuNiuTable5R.json",
    NiuNiuTable6R: "res/kkNiuNiu/NiuNiu/NiuNiuTable_4R/NiuNiuTable/NiuNiuTable6R.json",




//    base
    node64_png      : "res/node_64.png",
    node128_png     : "res/node_128.png",
    node152_png     : "res/node_152.png",
    node256_png     : "res/node_256.png",
    node512_png     : "res/node_512.png",
    back1_png       : "res/base/back1.png",
    back2_png       : "res/base/back2.png",
    next1_png       : "res/base/next1.png",
    next2_png       : "res/base/next2.png",
    restart1_png    : "res/base/restart1.png",
    restart2_png    : "res/base/restart2.png",

//    sprite --> Lesson0306
    skill_plist     : "res/skill.plist",
    skill_png       : "res/skill.png",
    scale9_png      : "res/Scale9.png",

//    action --> Lesson0401
    heart_png       : "res/action/heart.png",
    xyq_bg          : "res/action/bg.png",
    shadow_png      : "res/action/shadow.png",
    boy_plist       : "res/action/boy.plist",
    boy_png         : "res/action/boy.png",
    meinv_plist     : "res/action/meinv.plist",
    meinv_png       : "res/action/meinv.png",
    attack_effct    : "res/action/attack.mp3",
    attack_music    : "res/action/fight9.mp3",

//    event --> Lesson0501
    cyan_png        : "res/event/cyan_square.png",
    magenta_png     : "res/event/magenta_square.png",
    yellow_png      : "res/event/yellow_square.png",
    bg_scale9_png   : "res/event/buttonBackground.png",
    base_png        : "res/event/control_base.png",
    knob_png        : "res/event/control_knob.png",
    bone_plist      : "res/event/bone.plist",
    bone_png        : "res/event/bone.png",
    knob_bg_png     : "res/event/bg.png",

    // sound -->Lesson0601
    bg_mp3          : "res/Sound/background.mp3",
    effect_mp3      : "res/Sound/effect2.mp3",

    // particle --> Lesson0701
    particle_star_plist : "res/particle/star.plist",
    particle_star_png   : "res/particle/star.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}