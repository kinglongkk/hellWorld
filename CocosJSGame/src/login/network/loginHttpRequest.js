/*
 * login http request:
 * 1、登录：（游客登录）（平台账号检测/平台注册/平台登录）
 * 2、获取玩家信息：（服务端玩家信息）（平台玩家信息）
 * 3、游戏列表
 * 4、房间列表
 */

var s_sharedLoginHttp = null;

var LoginHttp = cc.Class.extend({
	ctor: function () {
	},

	reset: function(){
	},

	//游客登录
	guestLogin: function(){
		var str = LocalStorageMgr.getInstance().getVisitorLoginItem();
		var data = {
				sign: CryptoUtil.md5("").toUpperCase()
		};

		if(str){
			cc.log("ssssss = " + str);
			var accountInfo = JSON.parse(str);
			var username = accountInfo.username;
			var password = accountInfo.password;
			var sign = CryptoUtil.md5(username + password);
			sign = sign.toUpperCase();

			data = {
					username: username,
					password: password,
					sign: sign
			};
			
			g_objHero.setAccount(username);
		}
		
		var url = _CONFIG_.URL_SERVER + "/auth/guestLogin";
		HttpRequest.getInstance().sendPostJson(
				url,
				data,
				function(response){
					cc.log("http guest Login result : " + response);
					var info = JSON.parse(response);
					var code = info['code'];

					//登录成功
					if(code == 200){
						//首次登陆，获得账号密码
						if(info['username'] && info['password']){
							var username = info['username'];
							var password = info['password'];
							
							var accountInfo = {
									username: username,
									password: password
							};

							var strInfo = JSON.stringify(accountInfo);
							//保存
							LocalStorageMgr.getInstance().setVisitorLoginItem(strInfo);
														
							g_objHero.setAccount(username);
						}
						
						g_objHero.setPlayerId(info['playerId']);
						g_objHero.setToken(info['token']);
						ClientData.getInstance().setGuset(true);

						LoginHttp.getInstance().onLoginSucc();
					}else{
						//失败
						var strError = _HTTP_SERVER_CODE_[code] + "(code: " + code + ")";
						DlgTip.openSysTip(strError);
					}
				}
		);
	},
	
	//平台账号检测
	platformAccountCheck: function(account, cbResult){
		var ApiKey = _CONFIG_.API_KEY;
		var LoginName = account;
		var Sign = CryptoUtil.md5(ApiKey + LoginName);
		Sign = Sign.toUpperCase();

		var data = {
				Sign: Sign,
				LoginName: LoginName
		};
		
		var url = _CONFIG_.URL_PLATFORM + "/Account_CheckUser";
		var args = "Param=" + JSON.stringify(data);

		HttpRequest.getInstance().sendPostForms(
				url,
				args,
				function(response){
					cc.log("platform Account Check : " + response);

					var info = JSON.parse(response);
					var error = info.Error;

					switch (error) {
					case 0:
						var bSucc = true;
						cbResult(bSucc);
						
						break;
					case 1:
						DlgTip.openSysTip("对不起，您的用户名已被注册！");
						break;
					default:
						var strError = _HTTP_PLATFORM_CODE_[error] + "(code: " + error + ")";
						DlgTip.openSysTip(strError);
					break;
					}
				}
		);
	},

	//平台注册
	platformRegister: function(account, pass){
		var SourceKey = _CONFIG_.SourceKey;
		var ApiKey = _CONFIG_.API_KEY;
		var LoginName = account;
		var PassWord = pass;
		PassWord = CryptoUtil.md5(PassWord);
		PassWord = PassWord.toUpperCase();
		var NickName = LoginName;
		var FaceID = 1;
		var UserName = "";
		var PassPortID = "";
		var SpreaderID = 0;
		var Email = "";
		var Mobile = "";
		var Sex = 1;
		var RegisterIP = "";

		var Sign = CryptoUtil.md5(ApiKey + LoginName + PassWord + SpreaderID);
		Sign = Sign.toUpperCase();

		var data = {
				Sign: Sign,
				SourceKey: SourceKey,
				RegistInfo: {
					LoginName: LoginName,
					PassWord: PassWord,
					NickName: NickName,
					FaceID: FaceID,
					UserName: UserName,
					PassPortID: PassPortID,
					SpreaderID: SpreaderID,
					Email: Email,
					Mobile: Mobile,
					Sex: Sex,
					RegisterIP: RegisterIP
				}
		};
		
		var url = _CONFIG_.URL_PLATFORM + "/Account_Regist";
		var args = "Param=" + JSON.stringify(data);
		HttpRequest.getInstance().sendPostForms(
				url,
				args,
				function(response){
					cc.log("http register result : " + response);
					var info = JSON.parse(response);
					var error = info.Error;

					switch (error) {
					case 0:
						LoginSceneUIMgr.getInstance().sendLogon(account, pass);
						//LoginHttp.getInstance().platformLogin(account, pass);
						break;
					default:
						var strError = _HTTP_PLATFORM_CODE_[error] + "(code: " + error + ")";
						DlgTip.openSysTip(strError);
					break;
					}
				}
		);
	},

	//平台登录
	platformLogin: function(account, pass){
		//登录平台
		var SourceKey = _CONFIG_.SourceKey;
		var ApiKey = _CONFIG_.API_KEY;
		var LoginName = account;
		var PassWord = pass;
		var md5Pass = CryptoUtil.md5(PassWord);
		md5Pass = md5Pass.toUpperCase();

		var Sign = CryptoUtil.md5(ApiKey + LoginName + md5Pass);
		Sign = Sign.toUpperCase();

		var data = {
				Sign: Sign,
				SourceKey: SourceKey,
				LoginName: LoginName,
				PassWord: md5Pass,
		};
		
		var url = "http://api.yq175.com/Account_Login";
		var args = "Param=" + JSON.stringify(data);
		HttpRequest.getInstance().sendPostForms(
				url,
				args,
				function(response){
					cc.log("http login platform result : " + response);

					var info = JSON.parse(response);
					var error = info['Error'];

					switch (error) {
					case 0:
						//记住密码
						var bRecord = LocalStorageMgr.getInstance().getRecordPassItem();
						if(bRecord){
							ClientData.getInstance().saveRecordLogn(account, pass);
						}

						g_objHero.setAccount(account);
						var userInfo = info["UserInfo"];

						//////////
						//登录服务器
						var userId = userInfo["UserID"];
						var nickname = userInfo["NickName"];
						var token = userInfo["Token"];
						var sign = CryptoUtil.md5(userId + nickname + token);
						sign = sign.toUpperCase();
						g_objHero.setUserId(userId);

						var data = {
								userId: userId,
								nickname: nickname,
								token: token,
								sign: sign
						};

						var url = _CONFIG_.URL_SERVER + "/auth/login";
						HttpRequest.getInstance().sendPostJson(
								url,
								data,
								function(response){
									cc.log("http platform-to-server Login result : " + response);
									var info = JSON.parse(response);
									var code = info['code'];

									//登录成功
									if(code == 200){
										g_objHero.setPlayerId(info['playerId']);
										g_objHero.setToken(info['token']);						

										LoginHttp.getInstance().onLoginSucc();
									}else{
										//失败
										var strError = _HTTP_SERVER_CODE_[code] + "(code: " + code + ")";
										DlgTip.openSysTip(strError);
									}
								}
						);

						break;
					default:
						var strError = _HTTP_PLATFORM_CODE_[error] + "(code: " + error + ")";
						DlgTip.openSysTip(strError);
					break;
					}
				}
		);
	},

	//登录成功后步骤一：登录成功，获取玩家信息
	onLoginSucc: function(){
		var playerId = g_objHero.getPlayerId();
		var token = g_objHero.getToken();
		var sign = CryptoUtil.md5(playerId + token);
		sign = sign.toUpperCase();

		var data = {
				playerId: playerId,
				token: token,
				sign: sign
		};

		var url = _CONFIG_.URL_SERVER + "/api/player";
		HttpRequest.getInstance().sendGetRequest(
				url,
				data,
				function(response){
					cc.log("http get player info result : " + response);
					var info = JSON.parse(response);
					var code = info['code'];

					//登录成功
					if(code == 200){
						g_objHero.setPlayerId(info['playerId']);
						g_objHero.setNickname(info['nickname']);
						g_objHero.setGender(info['gender']);
						g_objHero.setRoleType(info['roleType']);
						g_objHero.setFaceId(info['faceId']);
						g_objHero.setGold(info['gold']);
						g_objHero.setBankGold(info['bankGold']);
						g_objHero.setVipLevel(info['vipLevel']);

						UIMgr.getInstance().closeDlg(ID_DlgLogin);
						UIMgr.getInstance().openDlg(ID_DlgLoader);
						var dlg = UIMgr.getInstance().getDlg(ID_DlgLoader);
						if(dlg){
							dlg.setFinishCallBack(function(){
								var scene = new cc.TransitionShrinkGrow(0.5, new PlazaScene());
								cc.director.runScene(scene);
							});

							dlg.setProgress(25);
						}

						LoginHttp.getInstance().getPlatformUserInfo();
					}else{
						//失败
						var strError = _HTTP_SERVER_CODE_[code] + "(code: " + code + ")";
						DlgTip.openSysTip(strError);
					}
				}
		);
	},

	//登录成功后步骤二：获得平台用户信息
	getPlatformUserInfo: function(){
		var bGuest = ClientData.getInstance().isGuset();
		if(bGuest){
			LoginHttp.getInstance().getGameList();
			return;
		}

		var url = _CONFIG_.URL_PLATFORM + "/Account_GetUserInfo";
		var ApiKey = _CONFIG_.API_KEY;
		var UserId = g_objHero.getUserId();
		var Sign = CryptoUtil.md5(ApiKey + UserId).toUpperCase();

		var data = {
				Sign: Sign,
				UserId: UserId
		};
		var args = "Param=" + JSON.stringify(data);

		HttpRequest.getInstance().sendPostForms(
				url,
				args,
				function(response){
					cc.log("http login result : " + response);

					var info = JSON.parse(response);
					var error = info['Error'];

					switch (error) {
					case 0:
						var UserInfo = info['UserInfo']
						var Email = UserInfo['Email'];
						//获得平台用户信息

						g_objHero.setEmail(Email);

						LoginHttp.getInstance().getGameList();

						break;
					default:
						var strError = _HTTP_PLATFORM_CODE_[error] + "(code: " + error + ")";
					DlgTip.openSysTip(strError);
					break;
					}
				}
		);
	},

	//登录成功后步骤三：获得游戏列表
	getGameList: function(){
		var dlg = UIMgr.getInstance().getDlg(ID_DlgLoader);
		if(dlg){
			dlg.setProgress(50);
		}
		
		var token = g_objHero.getToken();
		var sign = CryptoUtil.md5(token);
		sign = sign.toUpperCase();

		var data = {
				token: token,
				sign: sign
		};

		var url = _CONFIG_.URL_SERVER + "/api/games";
		HttpRequest.getInstance().sendGetRequest(
				url,
				data,
				function(response){
					cc.log("http get game list : " + response);
					var info = JSON.parse(response);
					var code = info['code'];

					//登录成功
					if(code == 200){
						/*
						var info = {"code":200,
								"gameList":[
								            {"gameId":1,"gameName":"牛牛","gameType":"niuniu","createTime":"2015-01-12T01:36:24.000Z"},
								            {"gameId":2,"gameName":"斗地主","gameType":"ddz","createTime":"2015-01-12T01:36:30.000Z"}
								            ]};
						*/						
						var gameList = info["gameList"];
						ClientData.getInstance().getPlaza().setGameList(gameList);
						
						LoginHttp.getInstance().getRoomList();
					}else{
						//失败
						var strError = _HTTP_SERVER_CODE_[code] + "(code: " + code + ")";
						DlgTip.openSysTip(strError);
					}
				}
		);
	},

	//登录成功后步骤四：获得房间列表
	getRoomList: function(){
		var dlg = UIMgr.getInstance().getDlg(ID_DlgLoader);
		if(dlg){
			dlg.setProgress(75);
		}
		
		var token = g_objHero.getToken();
		var sign = CryptoUtil.md5(token);
		sign = sign.toUpperCase();

		var data = {
				token: token,
				sign: sign
		};

		var url = _CONFIG_.URL_SERVER + "/api/rooms";
		HttpRequest.getInstance().sendGetRequest(
				url,
				data,
				function(response){
					cc.log("http get room list : " + response);
					var info = JSON.parse(response);
					var code = info['code'];

					//登录成功
					if(code == 200){
						/*
						var info = {"code":200,
						  "roomList":[
						    {"groupId":"ddz-group1","groupName":"VIP场","gameType":"ddz","roomType":1,"groupData":{},"itemOrder":1},
						    {"groupId":"niuniu-group1","groupName":"初级场","gameType":"niuniu","roomType":1,
						    	"groupData":{
						    		"baseScore":1,"minScore":1000,"maxScore":50000,"tableAmount":100,
						    		"tableConfig":{"chairAmount":5}},"itemOrder":2},
						    {"groupId":"niuniu-group2","groupName":"中级场","gameType":"niuniu","roomType":2,
						    	"groupData":{"baseScore":1,"minScore":1000,"maxScore":50000,"tableAmount":100,
						    		"tableConfig":{"chairAmount":5}},"itemOrder":1}
						    		]};
						 //*/						
						var roomList = info["roomList"];
						ClientData.getInstance().getPlaza().setRoomList(roomList);

						var dlg = UIMgr.getInstance().getDlg(ID_DlgLoader);
						if(dlg){
							dlg.setProgress(100);
						}
					}else{
						//失败
						var strError = _HTTP_SERVER_CODE_[code] + "(code: " + code + ")";
						DlgTip.openSysTip(strError);
					}
				}
		);

	},
});

LoginHttp.getInstance = function() {
	if (!s_sharedLoginHttp) {
		s_sharedLoginHttp = new LoginHttp();
	}
	return s_sharedLoginHttp;
};