var res = {
    load_png    : "res/load.png",
    loadBar_png : "res/loadBar.png",

	MainMenu_plist 		: "res/MainMenu.plist",
	MainMenu_png 		: "res/MainMenu.png",

	LeveInfo_plist 		: "res/LeveInfo.plist",
	LeveInfo_png 		: "res/LeveInfo.png",

	ChooseLevel_plist 	: "res/ChooseLevel.plist",
	ChooseLevel_png 	: "res/ChooseLevel.png",

	GamePlay_Info_plist : "res/GamePlay_Info.plist",
	GamePlay_Info_png 	: "res/GamePlay_Info.png",
    
    enemy_plist 		: "res/enemy.plist",
    enemy_png 			: "res/enemy.png",

	sh_bg_png 			: "res/sh_bg.png",
	go_failedPanel_png 	: "res/go_failedPanel.png",

	startParticle_plist : "res/startParticle.plist",
	startParticle_png 	: "res/startParticle.png",

	ui_btnBack_png			: "res/ui_btnBack.png",
	ui_btnBackNormal_png	: "res/ui_btnBackNormal.png",
	ui_btnBackPress_png		: "res/ui_btnBackPress.png",
	ui_btnNext_png	: "res/ui_btnNext.png",
	ui_btnStart_png	: "res/ui_btnStart.png",

	music_mp3 		: "res/sound/music.mp3",
	newEnemy_mp3 	: "res/sound/comeout.wav"

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

g_resources.push("res/levelInfo_0.plist");
g_resources.push("res/levelInfo_1.plist");
g_resources.push("res/levelInfo_2.plist");
g_resources.push("res/levelInfo_3.plist");
g_resources.push("res/tilemap0.tmx");
g_resources.push("res/tilemap1.tmx");
g_resources.push("res/tilemap2.tmx");
g_resources.push("res/tilemap3.tmx");
g_resources.push("res/tilemap4.tmx");
g_resources.push("res/tilemap5.tmx");
g_resources.push("res/tiles.png");

g_resources.push("res/fonts/bitmapFontChinese.fnt");
g_resources.push("res/fonts/bitmapFontChinese.png");

g_resources.push("res/changjing.plist");


