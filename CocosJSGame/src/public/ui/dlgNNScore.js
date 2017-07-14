

DLG_CREATOR[ID_DlgNNScore] = function() {
	return new DlgNNScore();
};

var DlgNNScore = DlgBase.extend({
	ctor: function(){
		//对阵局数
		this.gamenum = 18;

		//玩游戏的人数
		this.gamekind = 7;

	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {

		cc.spriteFrameCache.addSpriteFrames(res.dlgRestultScene_Plist);
		var json = ccs.load(res.dlgRestultScene_json);
		this._rootWidget = json.node;


		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);

		this.Panel_main = this._rootWidget.getChildByName('Panel_main');
		
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
		
		this.Image_outcome = new Array();
		this.Image_outcome[0] = this.Panel_outcome.getChildByName('Image_outcome1');
		this.Image_outcome[1] = this.Panel_outcome.getChildByName('Image_outcome2');
		this.Image_outcome[2] = this.Panel_outcome.getChildByName('Image_outcome3');
		this.Image_outcome[3] = this.Panel_outcome.getChildByName('Image_outcome4');

		this.addActionNodeMB(this.Panel_main);
	},

	setonResultView : function(gamenum){
	},

	setImageNameView : function(){
		
		this.Image_player = new Array();
		this.Text_player =  new Array();
		this.AtlasLabel_win = new Array();
		this.AtlasLabel_lost = new Array();
		this.Panel_niu = new Array();
		
		for(var num =0;num<4;num++){
			
			this.Image_player[num] = this.Image_outcome[num].getChildByName('Image_player');
			this.Text_player[num] = this.Image_outcome[num].getChildByName('Text_player');
			this.AtlasLabel_win[num] = this.Image_outcome[num].getChildByName('AtlasLabel_win');
			this.AtlasLabel_lost[num] = this.Image_outcome[num].getChildByName('AtlasLabel_lost');
			this.Panel_niu[num] = this.Image_outcome[num].getChildByName('Panel_niu');
		}
		
		//设置头像名称输赢牛数
		for(var num =0;num<4;num++){
			//头像
			this.sizeImage = this.Image_player[0].getSize();
			this.setThunmb(num,this.sizeImage,this.Image_player,gamekind);
			//昵称
			this.Text_player[num].setString("玩家"+(num+1)+"号");
			//输赢
			if(1){//赢
				this.AtlasLabel_win[num].setVisible(true);
				this.AtlasLabel_win[num].setString(".1000");
				this.AtlasLabel_lost[num].setVisible(false);
			}
			else{//输
				this.AtlasLabel_win[num].setVisible(false);
				this.AtlasLabel_lost[num].setString("/1000");
				this.AtlasLabel_lost[num].setVisible(true);
			}
			
			//牛数
			
		}
	

	},

	setThunmb : function(num,sizeImage,Image_player,gamekind){			
		cc.loader.loadImg(this.playerURL[num],{isCrossOrigin : false}, function(err,img){;
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
				UIMgr.getInstance().closeDlg(ID_DlgResult);
				break;
			case "Button_share":
//				UIMgr.getInstance().closeDlg(ID_DlgResult);
				break;
			case "Button_back":
				UIMgr.getInstance().closeDlg(ID_DlgResult);
				break;
			default:
				break;
			}
		}
	}
});
