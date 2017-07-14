
var MANIFEST_PATH = "project_qpgame.manifest";
var ASSETS_PATH = "";

//游戏层
var LoadLayer = cc.Layer.extend({
	_am : null,
	_progress : null,
	_percent : 0,
	_percentByFile : 0,
	_strTip : "",
	_tipColor : cc.color(243, 172, 110),
	_fileLoadingBar : null,
	_start_update: false,
	ctor:function () {
		this._super();

		var json = ccs.load(resLoad.load_json);
		this.widgetLoad = json.node;
		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this.widgetLoad.setContentSize(sizeDir);
		ccui.helper.doLayout(this.widgetLoad);
		
		this.addChild(this.widgetLoad);

		this.Panel = this.widgetLoad.getChildByName('Panel');

		this.ProgressBar_1 = this.Panel.getChildByName('ProgressBar_1');
		this.ProgressBar_1.setPercent(0);
		this.LabPercent_1 = this.Panel.getChildByName('LabPercent_1');

		this.ProgressBar_2 = this.Panel.getChildByName('ProgressBar_2');
		this.ProgressBar_2.setPercent(0);
		this.LabPercent_2 = this.Panel.getChildByName('LabPercent_2');

		this.LabDownloadFile = this.Panel.getChildByName('LabDownloadFile');

		this.BtnReUpdate = this.Panel.getChildByName('BtnReUpdate');
		this.BtnReUpdate.setPressedActionEnabled(true);
		this.BtnReUpdate.addTouchEventListener(this.onClickReUpdate, this);
		this.BtnReUpdate.setEnabled(false);
		this.BtnReUpdate.setVisible(false);

		this.LabTip = this.Panel.getChildByName('LabTip');
		
		this._percent = 0;
		this._percentByFile = 0;
		this._strTip = "正在检查更新，请耐心等待……";
		this._tipColor = cc.color(243, 172, 110);

		this.startUpdate();

		this.schedule(this.updateProgress, 0.5);
	},

	onClickReUpdate: function(sender, type) {
		if (ccui.Widget.TOUCH_ENDED == type) {
			this.BtnReUpdate.setEnabled(false);
			this.BtnReUpdate.setVisible(false);
			this.reStartUpdate();
		}
	},

	startUpdate: function(){
		var manifestPath = MANIFEST_PATH;
		var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + ASSETS_PATH);
		cc.log("Storage path: " + storagePath);



		this._am = new jsb.AssetsManager(manifestPath, storagePath);
		this._am.retain();

		if (!this._am.getLocalManifest().isLoaded())
		{
			cc.log("Fail to update assets, step skipped.");
			this._percent = 100;
			this._percentByFile = 100;
			this._strTip = "本地文件完整，跳过更新！";
			this._tipColor = cc.color(243, 172, 110);
			this.enterNextScene();
		}
		else
		{
			var self = this;
			var listener = new jsb.EventListenerAssetsManager(this._am, function(event) {
				var scene;
				switch (event.getEventCode())
				{
				case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
					//cc.log("No local manifest file found, skip assets update.");
					self._strTip = "检测更新失败！请重新尝试！";
					self._tipColor = cc.color(255, 0, 0);

					self.updateFail();
					break;
				case jsb.EventAssetsManager.UPDATE_PROGRESSION:
					if(!self._start_update){
						self._start_update = true;
					}
					self._percent = event.getPercent();
					self._percentByFile = event.getPercentByFile();
					cc.log(self._percent + "%");
					cc.log(self._percentByFile + "%");

					var msg = event.getMessage();
					if (msg) {
						cc.log("msg : " + msg);
					}

					var assetId = event.getAssetId();
					if (assetId) {
						cc.log( "assetId : " + assetId);
					}

					self._strTip = "正在更新！";
					self._tipColor = cc.color(255, 255, 0);
					break;
				case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
					//cc.log("Fail to download manifest file, update skipped.");
					self._strTip = "下载失败！请重新尝试！";
					self._tipColor = cc.color(255, 0, 0);
					self.updateFail();
					break;
				case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
					//cc.log("Fail to parse manifest file, update skipped.");
					self._strTip = "解析失败！请重新尝试！";
					self._tipColor = cc.color(255, 0, 0);
					self.updateFail();
					break;
				case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
					//cc.log("Already up-to-date: " + event.getMessage());
					self._strTip = "已经是最新版本！";
					self._tipColor = cc.color(0, 255, 0);
					self._percent = 100;
					self._percentByFile = 100;
					self.enterNextScene();
					break;
				case jsb.EventAssetsManager.UPDATE_FINISHED:
					//cc.log("Update finished. " + event.getMessage());
					self._strTip = "更新完成！";
					self._percent = 100;
					self._percentByFile = 100;
					sself._tipColor = cc.color(0, 255, 0);
					self.enterNextScene();
					break;
				case jsb.EventAssetsManager.UPDATE_FAILED:
					//cc.log("Update failed. " + event.getMessage());

					__failCount ++;
					if (__failCount < 5)
					{
						self._am.downloadFailedAssets();
					}
					else
					{
						cc.log("Reach maximum fail count, exit update process");
						self._strTip = "更新失败！请重新尝试！";
						sself._tipColor = c.color(255, 0, 0);
						__failCount = 0;
						self.updateFail();
					}
					break;
				case jsb.EventAssetsManager.ERROR_UPDATING:
					cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
					self._strTip = "更新出错！请重新尝试！";
					self._tipColor = cc.color(255, 0, 0);
					self.updateFail();
					break;
				case jsb.EventAssetsManager.ERROR_DECOMPRESS:
					cc.log(event.getMessage());
					self._strTip = "解压出错！请重新尝试！";
					self._tipColor = cc.color(255, 0, 0);
					self.updateFail();
					break;
				default:
					break;
				}
			});

			cc.eventManager.addListener(listener, 1);

			this._am.update();
		}
	},

	reStartUpdate: function(){
		this._am.release();

		this._percent = 0;
		this._percentByFile = 0;
		this._start_update = false;

		this.LabTip.string = "尝试再次更新！";
		this.LabTip.setColor(cc.color(243, 172, 110));
		this.ProgressBar_1.setPercent(0);
		this.ProgressBar_2.setPercent(0);

		this.startUpdate();
	},

	updateFail: function(){
		//更新失败提示
		this.BtnReUpdate.setEnabled(true);
		this.BtnReUpdate.setVisible(true);
	},

	enterNextScene:function(){
		var self = this;

		var delay = cc.DelayTime.create(1);
		var callFunc = cc.CallFunc.create(function(){
			
			//load js
			cc.loader.loadJsWithImg("", ["src/public/jsList.js"], function(){
				if(g_jsList){					
					cc.loader.loadJsWithImg("", g_jsList, function(){						
						//load res
						cc.LoaderScene.preload(g_resources, function () {
							var scene = new cc.TransitionPageTurn(0.5, new LoginScene(), false);
							cc.director.runScene(scene);
						}, this);
					}); 
				}
			});
			cc.log("----------> enter next scene!");
		}, this);

		var seq = cc.Sequence.create(delay, callFunc);
		this.runAction(seq);
	},
	updateProgress : function () {
		//cc.log("Percent:%d filePercent:%d", this._percent, this._percentByFile);		
		this.ProgressBar_1.setPercent(this._percent);
		this.ProgressBar_2.setPercent(this._percentByFile);
		this.LabPercent_1.string = this._percent + "%";
		this.LabPercent_2.string = this._percentByFile + "%";
		this.LabTip.string = this._strTip;
		this.LabTip.setColor(this._tipColor);
	},
	onExit : function () {
		this._am.release();

		this._start_update = false;
		this._super();
	}
});

var LoadScene = cc.Scene.extend({
	ctor:function () {
		this._super();
		this.init();
	},
	
	onEnter:function () {
		this._super();	

		this.layerLoad = new LoadLayer();
		this.addChild(this.layerLoad);
	}
});