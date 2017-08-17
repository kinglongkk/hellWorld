/*
 * ExAward http request:
 */

var s_sharedExAward = null;

var ExAwardHttp = cc.Class.extend({
	ctor: function () {
	},

	reset: function(){
	},
	
	//请求兑换奖品列表
	requestExAwardList: function(){
		var userId = g_objHero.getUserId();
		//接口
		var url = _CONFIG_.WEB_IP + '/User/PrizeList';
		//参数
		url = url + '/' + userId;
		
		//{"id":"3","PrizeTile":"测试商品3","PrizeValue":"11","PrizeType":"1","PrizeState":"1"}
		
		HttpRequest.getInstance().sendPostForms(
				url,
				"",
				function(response){
					if(!response){
						cc.log("response is null!");
						return;
					}

					cc.log("#####http guest url: " + url);
					cc.log("#####http guest result : " + response);

					var exAwardList = JSON.parse(response);

					////////////////////////////////////////
					//数据
					var exAward = ClientData.getInstance().getExAward();
					if(exAward){
						exAward.setExAwardList(exAwardList);
					}

					////////////////////////////////////////
					//界面
					var dlgPlaza= UIMgr.getInstance().getDlg(ID_DlgPlaza);
					if(dlgPlaza){
						//dlgPlaza.updateNewMailCount();
					}
					
					UIMgr.getInstance().openDlg(ID_DlgExchange);
				});
	},
	
	//请求兑换
	requestExchange: function(exAwardID, priceTicket){
		var userId = g_objHero.getUserId();
		var md5Pass = g_objHero.getMd5Pass();
		cc.log('md5Pass = ' + md5Pass);
		var sign = CryptoUtil.md5(md5Pass);
		cc.log('sign = ' + sign);
		//9db06bcff9248837f86d1a6bcf41c9e7
		
		//接口
		var url = _CONFIG_.WEB_IP + '/User/GetExchange';
		//参数
		url = url + '/' + userId;
		url = url + '/' + exAwardID;
		url = url + '/' + sign;

		HttpRequest.getInstance().sendPostForms(
				url,
				"",
				function(response){
					if(!response){
						cc.log("response is null!");
						return;
					}

					cc.log("#####http guest url: " + url);
					cc.log("#####http guest result : " + response);

					var code = response;
					
					//code=0:成功
					//code=1:失败，兑换券不足
					//code=2:失败，兑换信息未填
					
					switch (code) {
					case '0':
						var ticket = g_objHero.getMbTicket();
						ticket = ticket - priceTicket;
						g_objHero.setMbTicket(ticket);
						
						DlgTip.openSysTip('兑换成功，奖品将按照所填写兑换信息发放，请注意查收。');
						
						var dlgPlaza = UIMgr.getInstance().getDlg(ID_DlgPlaza);
						if(dlgPlaza){
							dlgPlaza.updateDlg();
						}
						
						var dlgExchange = UIMgr.getInstance().getDlg(ID_DlgExchange);
						if(dlgExchange){
							dlgExchange.updateDlg();
						}
						break;
					case '1':
						DlgTip.openSysTip('兑换失败，你的兑换券不足。');
						break;
					case '2':
						DlgTip.openSysTip('请登录www.91236.com官网，【个人中心】补充兑换信息，如有疑问请联系客服。');
						break;
					case '3':
						DlgTip.openSysTip('兑换失败，参数错误。');
						break;
					default:
						break;
					}
				});
	},
	
	//请求兑换奖品记录
	//{"id":"1","Userid":"7","PrizeID":"2","PrizeTile":"测试商品2","ExchangeData":"2015-6-16 15:10:12","state":"0"}
	requestExAwardRecords: function(){
		var userId = g_objHero.getUserId();
		//接口
		var url = _CONFIG_.WEB_IP + '/User/PrizeExchange';
		//参数
		url = url + '/' + userId;

		HttpRequest.getInstance().sendPostForms(
				url,
				"",
				function(response){
					if(!response){
						cc.log("response is null!");
						DlgTip.openSysTip('您当前没有兑换记录。');
						return;
					}

					cc.log("#####http guest url: " + url);
					cc.log("#####http guest result : " + response);

					var exAwardRecords = JSON.parse(response);

					////////////////////////////////////////
					//数据
					var exAward = ClientData.getInstance().getExAward();
					if(exAward){
						exAward.setExAwardRecords(exAwardRecords);
					}

					////////////////////////////////////////
					//界面
					UIMgr.getInstance().openDlg(ID_DlgExAwardRecord);
				});
	},

});

ExAwardHttp.getInstance = function() {
	if (!s_sharedExAward) {
		s_sharedExAward = new ExAwardHttp();
	}
	return s_sharedExAward;
};