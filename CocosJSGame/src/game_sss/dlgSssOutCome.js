
DLG_CREATOR[ID_DlgCNpokeoutcome] = function() {
	return new DlgCNpokeoutcome();
};

var DlgCNpokeoutcome = DlgBase.extend({
	ctor: function () {
		this.AllGame = 8;
		this.Image_outcome = []; 
		this.Image_player = [];
		this.dissolutionTime = 2;
	},

	onCreate: function() {
		this.init();

	},

	onClose: function() {

	},

	init: function(){
		cc.spriteFrameCache.addSpriteFrames(res.dlgCNoutcome_plist);
		var json = ccs.load(res.dlgCNoutcome_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);	

		this.Panel_main = this._rootWidget.getChildByName('Panel_main');
		
		this.Panel_outcome = this.Panel_main.getChildByName('Panel_outcome');
		
		for(var num = 0 ;num<4;num++){
			this.Image_outcome[num] = this.Panel_outcome.getChildByName('Image_outcome'+num);
			this.Image_player[num] = this.Image_outcome[num].getChildByName('Image_player');
			var AtlasLabel_win = this.Image_outcome[num].getChildByName('AtlasLabel_win');
			var AtlasLabel_lost = this.Image_outcome[num].getChildByName('AtlasLabel_lost');			
			AtlasLabel_win.setVisible(false);
			AtlasLabel_lost.setVisible(false);
			
			var Text_gun = this.Image_outcome[num].getChildByName('Text_gun');
			Text_gun.setVisible(false);
		}

		this.Panel_result = this.Panel_main.getChildByName('Panel_result');
		this.Image_win = this.Panel_result.getChildByName('Image_win');
		this.Image_lost = this.Panel_result.getChildByName('Image_lost');
		this.Image_win.setVisible(false);
		this.Image_lost.setVisible(false);
		
		this.Button_ready = this.Panel_main.getChildByName('Button_ready');
		this.Button_ready.addTouchEventListener(this.onClickBtnEvent, this);

		this.Button_share = this.Panel_main.getChildByName('Button_share');
		this.Button_share.addTouchEventListener(this.onClickBtnEvent, this);
		this.Button_share.setVisible(false);

		this.Button_back = this.Panel_main.getChildByName('Button_back');
		this.Button_back.addTouchEventListener(this.onClickBtnEvent, this);
		
		this.lab_systemsg = this.Panel_main.getChildByName('lab_systemsg');
		this.lab_systemsg.setVisible(false);
		
	},

	onStartCountDownTime: function () {
		cc.director.getScheduler().scheduleCallbackForTarget(this, this.updateCountDownTime,1, cc.REPEAT_FOREVER, 0, false, "keyCountDownTime");
	},
	updateCountDownTime : function() {
		this.lab_systemsg.setVisible(true);
		cc.log("this.dissolutionTime="+this.dissolutionTime);
		if(this.dissolutionTime<=0){
			this.lab_systemsg.setVisible(false);
			cc.director.getScheduler().unscheduleCallbackForTarget(this,this.updateCountDownTime);
		}
		this.dissolutionTime =this.dissolutionTime-1;
	},
	
	onSetBtnVisible : function(){
		this.Button_share.setVisible(false);
		this.Button_back.setVisible(false);
		this.Button_ready.setVisible(false);
		this.lab_systemsg.setString("游戏已结束，正在统计结果，请稍后~");
		this.lab_systemsg.y=this.Button_share.y;
	},
	
	onSetPlayerResult : function(result) {
		if(result>0){
			SoundMgr.getInstance().playEffect("sss_win", 0, false);
			cc.log("我赢了  result = "+result);
			this.Image_win.setVisible(true);
			this.Image_lost.setVisible(false);
		}
		else{
			SoundMgr.getInstance().playEffect("sss_lose", 0, false);
			cc.log("我输了  result = "+result);
			this.Image_win.setVisible(false);
			this.Image_lost.setVisible(true);
		}
	},
	
	onSetPlayerOutcome : function(pos,result,player,card) {
		var Image_player = this.Image_player[pos];
		var headSize = Image_player.getSize();
		if(player){
			cc.log("玩家头像url  result = "+player.getHeaderUrl());
			if(player.getHeaderUrl() == null){
				player.setHeaderUrl("http://a-ssl.duitang.com/uploads/item/201607/05/20160705130934_MLJzU.jpeg");
			}
			
			cc.log("玩家头像url  result = "+player.getHeaderUrl());
			player.loadUrlImage(function(savePath){
                if(savePath!=undefined&&savePath.length>0)
				Image_player.loadTexture(savePath, ccui.Widget.LOCAL_TEXTURE);
				Image_player.setContentSize(cc.size(headSize.width,headSize.height));
			});	

			var Text_player = this.Image_outcome[pos].getChildByName('Text_player');
			Text_player.setString(player.getNickName());
		}
		
		if(result>0){
			var AtlasLabel_win = this.Image_outcome[pos].getChildByName('AtlasLabel_win');
			var AtlasLabel_lost = this.Image_outcome[pos].getChildByName('AtlasLabel_lost');
			AtlasLabel_win.setVisible(true);
			AtlasLabel_lost.setVisible(false);
			AtlasLabel_win.setString('.'+result);
			var slen = AtlasLabel_win.getString().length;
			AtlasLabel_win.setContentSize(78*slen,90);
		}
		else{
			var AtlasLabel_lost = this.Image_outcome[pos].getChildByName('AtlasLabel_lost');
			var AtlasLabel_win = this.Image_outcome[pos].getChildByName('AtlasLabel_win');
			AtlasLabel_lost.setVisible(true);
			AtlasLabel_win.setVisible(false);
			AtlasLabel_lost.setString('/'+result);
			var slen = AtlasLabel_lost.getString().length;
			if(result == 0){
				AtlasLabel_lost.setContentSize(78*slen,90);
			}
			else{
				AtlasLabel_lost.setContentSize(78*(slen-1),90);
			}		
		}
		
		var cardonebox = this.Image_outcome[pos].getChildByName('Panel_one');
		var cardboxsize = cardonebox.getSize();
		
		var testCard = CardSprite.create(card[0],0,true);
		var sizeCard = testCard.ImgFront.getSize();
		
		for(var temp = 0;temp<3;temp++){
			card[temp] = this.onCreatCard(card[temp], 0);
			card[temp].x = ((cardboxsize.width/3)*(temp+1));
			card[temp].y = cardboxsize.height/2;
			card[temp].setScaleX(0.6);						
			card[temp].setScaleY(((cardboxsize.height+10) / (sizeCard.height)));
			cardonebox.addChild(card[temp]);
			card[temp].setName("card"+temp);
		}

		
		var cardtwobox = this.Image_outcome[pos].getChildByName('Panel_two');
		cardboxsize = cardtwobox.getSize();
		
		for(var temp = 3;temp<8;temp++){
			card[temp] = this.onCreatCard(card[temp], 0);
			card[temp].x = ((cardboxsize.width/7)*(temp+1))-80;
			card[temp].y = cardboxsize.height/2;
			card[temp].setScaleX(0.6);						
			card[temp].setScaleY(((cardboxsize.height+10) / (sizeCard.height)));
			cardtwobox.addChild(card[temp]);
			card[temp].setName("card"+temp);
		}
			
		var cardthreebox = this.Image_outcome[pos].getChildByName('Panel_three');
		cardboxsize = cardthreebox.getSize();
		
		for(var temp = 8;temp<13;temp++){
			card[temp] = this.onCreatCard(card[temp], 0);
			card[temp].x = ((cardboxsize.width/7)*(temp+1))-360;
			card[temp].y = cardboxsize.height/2;
			card[temp].setScaleX(0.6);						
			card[temp].setScaleY(((cardboxsize.height+10) / (sizeCard.height)));
			cardthreebox.addChild(card[temp]);
			card[temp].setName("card"+temp);
		}		
		cc.log("玩家结束页比牌数据nSssGameModel.playerDatas[pos].cardResult= " + JSON.stringify(nSssGameModel.playerDatas[pos].cardResult));
		
		if(nSssGameModel.playerDatas[pos].cardResult){
			var nGun = 0;
			for(var gNum = 0;gNum<4;gNum++){
				if(gNum!=pos && nSssGameModel.playerDatas[gNum].cardResult){
					if((nSssGameModel.playerDatas[pos].cardResult[0]>nSssGameModel.playerDatas[gNum].cardResult[0])&&
						(nSssGameModel.playerDatas[pos].cardResult[1]>nSssGameModel.playerDatas[gNum].cardResult[1])&&
						(nSssGameModel.playerDatas[pos].cardResult[2]>nSssGameModel.playerDatas[gNum].cardResult[2])){
						nGun++;
					}
					
				}
			}
			if(nGun>0){
				var Text_gun = this.Image_outcome[pos].getChildByName('Text_gun');
				Text_gun.setVisible(true);
				if(nGun<3){
					Text_gun.setString("打枪");
				}
				else{
					Text_gun.setString("全垒打");
				}
			}
			var cardboxsize = cardonebox.getSize();
			if(nSssGameModel.playerDatas[pos].cardResult[0]>0){
				var AtlasLabel_win = this.Image_outcome[pos].getChildByName('AtlasLabel_win');
				var Atlwin = AtlasLabel_win.clone();
				Atlwin.setString('.'+nSssGameModel.playerDatas[pos].cardResult[0]);
				Atlwin.setVisible(true);
				var slen = AtlasLabel_win.getString().length;
				Atlwin.setContentSize(78*slen,90);
				Atlwin.x = cardboxsize.width/2;
				Atlwin.y = cardboxsize.height/2;
				cardonebox.addChild(Atlwin);
				
			}
			else{
				var AtlasLabel_lost = this.Image_outcome[pos].getChildByName('AtlasLabel_lost');
				var Atlost = AtlasLabel_lost.clone();
				Atlost.setVisible(true);
				Atlost.setString('/'+nSssGameModel.playerDatas[pos].cardResult[0]);
				var slen = Atlost.getString().length;
				if(nSssGameModel.playerDatas[pos].cardResult[0] == 0){
					Atlost.setContentSize(78*slen,90);
				}
				else{
					Atlost.setContentSize(78*(slen-1),90);
				}	
				Atlost.x = cardboxsize.width/2;
				Atlost.y = cardboxsize.height/2;
				cardonebox.addChild(Atlost);
			}
			
			cardboxsize = cardtwobox.getSize();
			
			if(nSssGameModel.playerDatas[pos].cardResult[1]>0){
				var AtlasLabel_win = this.Image_outcome[pos].getChildByName('AtlasLabel_win');
				var Atlwin = AtlasLabel_win.clone();
				Atlwin.setString('.'+nSssGameModel.playerDatas[pos].cardResult[1]);
				Atlwin.setVisible(true);
				var slen = AtlasLabel_win.getString().length;
				Atlwin.setContentSize(78*slen,90);
				Atlwin.x = cardboxsize.width/2;
				Atlwin.y = cardboxsize.height/2;
				cardtwobox.addChild(Atlwin);

			}
			else{
				var AtlasLabel_lost = this.Image_outcome[pos].getChildByName('AtlasLabel_lost');
				var Atlost = AtlasLabel_lost.clone();
				Atlost.setVisible(true);
				Atlost.setString('/'+nSssGameModel.playerDatas[pos].cardResult[1]);
				var slen = Atlost.getString().length;
				if(nSssGameModel.playerDatas[pos].cardResult[1] == 0){
					Atlost.setContentSize(78*slen,90);
				}
				else{
					Atlost.setContentSize(78*(slen-1),90);
				}	
				Atlost.x = cardboxsize.width/2;
				Atlost.y = cardboxsize.height/2;
				cardtwobox.addChild(Atlost);
			}
			
			cardboxsize = cardthreebox.getSize();
			if(nSssGameModel.playerDatas[pos].cardResult[2]>0){
				var AtlasLabel_win = this.Image_outcome[pos].getChildByName('AtlasLabel_win');
				var Atlwin = AtlasLabel_win.clone();
				Atlwin.setString('.'+nSssGameModel.playerDatas[pos].cardResult[2]);
				Atlwin.setVisible(true);
				var slen = AtlasLabel_win.getString().length;
				Atlwin.setContentSize(78*slen,90);
				Atlwin.x = cardboxsize.width/2;
				Atlwin.y = cardboxsize.height/2;
				cardthreebox.addChild(Atlwin);

			}
			else{
				var AtlasLabel_lost = this.Image_outcome[pos].getChildByName('AtlasLabel_lost');
				var Atlost = AtlasLabel_lost.clone();
				Atlost.setVisible(true);
				Atlost.setString('/'+nSssGameModel.playerDatas[pos].cardResult[2]);
				var slen = Atlost.getString().length;
				if(nSssGameModel.playerDatas[pos].cardResult[2] == 0){
					Atlost.setContentSize(78*slen,90);
				}
				else{
					Atlost.setContentSize(78*(slen-1),90);
				}	
				Atlost.x = cardboxsize.width/2;
				Atlost.y = cardboxsize.height/2;
				cardthreebox.addChild(Atlost);
			}
		}
	},
	
	onChangePlayerStatus:function(){
		
	},

	onClickBtnEvent: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			var strBtnName = sender.getName();
			cc.log('onClickEvent ' + strBtnName);
			switch (strBtnName) {
			case "Button_ready":
				if(nSssGameModel.gameoverFlag == true  || this.dissolutionTime<0){
					cc.log("结束页显示结束，准备");
					GameFrameMsg.getInstance().sendReady();	
					nSssGameModel.reset();
					nSssGameModel.gameComping = false;
					nSssGameModel.gameoverFlag = false;
					SssUIMgr.getInstance().onChangePlayerStatus(3);
					UIMgr.getInstance().closeDlg(ID_DlgCNpokeoutcome);
				}
				else{
					this.lab_systemsg.setVisible(true);
					this.onStartCountDownTime();
				}
				break;
			case "Button_share":
				this.onLoadsysword();
				break;
			case "Button_back":
				cc.log('(nSssGameModel.gameoverFlag ' + nSssGameModel.gameoverFlag);
				if(nSssGameModel.gameoverFlag == true || this.dissolutionTime<0){
					cc.log("结束页显示结束，返回");
					UIMgr.getInstance().closeDlg(ID_DlgCNpokeoutcome);
					SssUIMgr.getInstance().onChangePlayerStatus(2);
					SssUIMgr.getInstance().onUpdateAllPlayerInfo(CMD_SSS.SSS_SCENE);
					nSssGameModel.reset();
					nSssGameModel.gameComping = false;
					nSssGameModel.gameoverFlag = false;
				}
				else{
					this.lab_systemsg.setVisible(true);
					this.onStartCountDownTime();
				}
				break;
			default:
				break;
			}
		}
	},
	
	//创建扑克牌
	onCreatCard : function(value,style){
		if (value == 0) value = 1;
		if (value == 0x41) value = 0x4e;
		if (value == 0x42) value = 0x4f;

		cc.log("1cardPath"+cardPath);
		var cardPath = "huaiFengCardListPlist/Value_" + ((value<0x10)?"0":"") + value.toString(16) + "_Style_" + style.toString() + ".png";
		cc.log("1cardPath"+cardPath);
		if (value < 0 || (value > 0x0d && value < 0x11) || (value > 0x1d && value < 0x21) ||
				(value > 0x2d && value < 0x31) || (value > 0x3d && value != 0x4e && value != 0x4f)) {
			cc.log("未知牌"+value);
			cardPath = "huaiFengCardListPlist/img_card_back.png";
		}
		var image_front = new ccui.ImageView(cardPath, ccui.Widget.PLIST_TEXTURE);
		return image_front;
	}
});
