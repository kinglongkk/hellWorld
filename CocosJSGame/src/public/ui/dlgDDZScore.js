

DLG_CREATOR[ID_DlgDDZScore] = function() {
	return new DlgDDZScore();
};

var DlgDDZScore = DlgBase.extend({
	ctor: function(){
		
		//玩家分数
		this.GameScore = [500,300,-800];
		//3个玩家剩余卡牌数
		this.CardCount = [];
		//剩余的卡牌按牌数截断
		this.CardAll = [];
		//炸弹数
		this.Bomb = 5;
		//火箭标志0 没有 1 有
		this.Rocket = 1;
		//春天标志 0:无 1: 春天2：反春天
		this.Spring = 2;
		//头像URL数组
		this.Thumb = [];
		this.Thumb[0]="http://a-ssl.duitang.com/uploads/item/201607/05/20160705130934_MLJzU.jpeg";
		this.Thumb[1]="http://a-ssl.duitang.com/uploads/item/201607/05/20160705130934_MLJzU.jpeg";
		this.Thumb[2]="http://a-ssl.duitang.com/uploads/item/201607/05/20160705130934_MLJzU.jpeg";
		//昵称数组
		this.NickName = ["漩涡鸣人","旗木卡卡西","小泽玛利亚"];
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {

		cc.spriteFrameCache.addSpriteFrames(res.dlgddzOutcome_plist);
		cc.spriteFrameCache.addSpriteFrames(res.dlgnnOutcome_plist);
		var json = ccs.load(res.dlgddzOutcome_json);
		this._rootWidget = json.node;


		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.Panel_main = this._rootWidget.getChildByName('Panel_main');
		
		this.Text_rocket = this.Panel_main.getChildByName('Text_rocket');
		this.Text_bomb = this.Panel_main.getChildByName('Text_bomb');
		this.Text_spring = this.Panel_main.getChildByName('Text_spring');
		
		this.Panel_result = this.Panel_main.getChildByName('Panel_result');
		this.Image_win = this.Panel_result.getChildByName('Image_win');
		this.Image_lost = this.Panel_result.getChildByName('Image_lost');
		//setVisible(false);

		this.Button_ready = this.Panel_main.getChildByName('Button_ready');
		this.Button_share = this.Panel_main.getChildByName('Button_share');
		this.Button_back = this.Panel_main.getChildByName('Button_back');

		this.Button_ready.setTouchEnabled(true);
		this.Button_ready.addTouchEventListener(this.onClickEvent, this);
		this.Button_share.setTouchEnabled(true);
		this.Button_share.addTouchEventListener(this.onClickEvent, this);
		this.Button_back.setTouchEnabled(true);
		this.Button_back.addTouchEventListener(this.onClickEvent, this);
		
		this.Panel_outcome = this.Panel_main.getChildByName('Panel_outcome');
		this.Image_outcome = new Array();
		this.Image_outcome[0] = this.Panel_outcome.getChildByName('Image_outcome1');
		this.Image_outcome[1] = this.Panel_outcome.getChildByName('Image_outcome2');
		this.Image_outcome[2] = this.Panel_outcome.getChildByName('Image_outcome3');
		
		this.setImageNameView();

		this.addActionNodeMB(this.Panel_main);
	},

	setonResultView : function(gamenum){
	},

	setImageNameView : function(){
		
		if(this.GameScore[1]>0){
			console.log("你赢了");
			this.Image_win.setVisible(true);
			this.Image_lost.setVisible(false);
		}

		this.Image_player = new Array();
		this.Text_player =  new Array();
		this.AtlasLabel_win = new Array();
		this.AtlasLabel_lost = new Array();
		this.Panel_card = new Array();

		for(var num =0;num<3;num++){

			this.Image_player[num] = this.Image_outcome[num].getChildByName('Image_player');
			this.Text_player[num] = this.Image_outcome[num].getChildByName('Text_player');
			this.AtlasLabel_win[num] = this.Image_outcome[num].getChildByName('AtlasLabel_win');
			this.AtlasLabel_lost[num] = this.Image_outcome[num].getChildByName('AtlasLabel_lost');
			this.Panel_card[num] = this.Image_outcome[num].getChildByName('Panel_card');
		}
		
		this.Text_rocket.setString("火箭"+this.Rocket);
		this.Text_bomb.setString("炸弹"+(this.Bomb-this.Rocket));
		
		if(this.Spring == 1){
			this.Text_spring.setString("春天1");
		}
		if(this.Spring == 2){
			this.Text_spring.setString("反春天");
		}
				
		//设置头像名称输赢牛数
		for(var num =0;num<3;num++){
			//头像
			this.sizeImage = this.Image_player[0].getSize();
			this.setThunmb(num,this.sizeImage,this.Image_player);
			//昵称
			this.Text_player[num].setString("玩家"+(num+1)+"号");
			this.Text_player[num].setString(this.NickName[num]);
			//输赢分数
			if(this.GameScore[num]>=0){//赢
				this.AtlasLabel_win[num].setVisible(true);
				this.AtlasLabel_win[num].setString("."+this.GameScore[num]);
				this.AtlasLabel_lost[num].setVisible(false);
			}
			else{//输
				this.AtlasLabel_win[num].setVisible(false);
				this.AtlasLabel_lost[num].setString("/"+this.GameScore[num]);
				this.AtlasLabel_lost[num].setVisible(true);
			}
			//设置输家牌数
//			this.cardboxSize = this.Panel_card[0].getSize();
//			this.setLostCard(num,this.CardCount[num]);

		}	

	},
	
	setLostCard : function(num,CardCount) {//设置玩家num剩余牌型
		if(CardCount>0){
			var Jnum = 0;
			if(num == 1){
				Jnum = this.CardCount[0]-1;
				CardCount = CardCount + this.CardCount[0];
			}
			if(num == 2){
				Jnum = this.CardCount[0]+this.CardCount[1]-1;
				CardCount = CardCount + this.CardCount[0]+this.CardCount[1];
			}
			for(Jnum ;Jnum<CardCount; Jnum++){
//				this.CardAll[Jnum]=
			}
		}
	},

	setThunmb : function(num,sizeImage,Image_player){			
		cc.loader.loadImg(this.Thumb[num],{isCrossOrigin : false}, function(err,img){;
		if(err) {
			cc.log(err);
		}
		else{
			var logo = new cc.Sprite(img); 
			logo.x = sizeImage.width / 2;
			logo.y = sizeImage.height / 2;

			var sizelogo = logo.getContentSize();
			logo.setScaleX((sizeImage.width/sizelogo.width));
			logo.setScaleY(sizeImage.height / sizelogo.height);

			Image_player[num].addChild(logo);
		}
		});
	},
	onClickEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_ready":
				UIMgr.getInstance().closeDlg(ID_DlgDDZScore);
				break;
			case "Button_share":
//				UIMgr.getInstance().closeDlg(ID_DlgResult);
				break;
			case "Button_back":
				UIMgr.getInstance().closeDlg(ID_DlgDDZScore);
				break;
			default:
				break;
			}
		}
	}
});
