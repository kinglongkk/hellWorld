/*
 * mail http request:
 */

var s_sharedMailHttp = null;

var MailHttp = cc.Class.extend({
	ctor: function () {
	},

	reset: function(){
	},

	requestMailNum: function(){
		var gameId = g_objHero.getGameId();
		var url = _CONFIG_.WEB_IP + '/User/EmailNumber/' + gameId;
		
		HttpRequest.getInstance().sendPostForms(
				url,
				"",
				function(response){
					if(!response){
						cc.log("response is null!");
						var mail = ClientData.getInstance().getMail();
						if(mail){
							mail.setNewMailNum(0);
						}
						
						return;
					}
					
					//cc.log("#####http guest url: " + url);
					//cc.log("#####http guest result : " + response);
					
					var info = JSON.parse(response);
					var newMailNum = info['number'];
					
					////////////////////////////////////////
					//数据
					var mail = ClientData.getInstance().getMail();
					if(mail){
						mail.setNewMailNum(newMailNum);
					}
					
					////////////////////////////////////////
					//界面
					var dlgPlaza= UIMgr.getInstance().getDlg(ID_DlgPlaza);
					if(dlgPlaza){
						dlgPlaza.updateNewMailCount();
					}
				});
	},
	
	//num:请求邮件数量
	requestEmailList: function(emailType, sendType, page, mailID){
		var gameId = g_objHero.getGameId();
		var url = _CONFIG_.WEB_IP + '/User/EmailList';
		url = url + '/' + emailType;//邮件类型：0新邮件，1系统邮件，2活动邮件，3好友邮件
		url = url + '/' + sendType;//发送类型：0：最小邮件ID，1：最大邮件ID
		url = url + '/' + page;
		url = url + '/' + mailID;
		url = url + '/' + gameId;

		HttpRequest.getInstance().sendPostForms(
				url,
				"",
				function(response){
					if(!response){
						cc.log("response is null!");
						return;
					}
					
					cc.log("#####http guest url: " + url);
					cc.log("#####http guest result : " + response );
					
					var mailList = JSON.parse(response);
					
					if(mailList.length == 0){
						return;
					}

					////////////////////////////////////////
					//数据
					var mail = ClientData.getInstance().getMail();
					if(mail){
						//邮件类型：0新邮件，1系统邮件，2活动邮件，3好友邮件
						switch (emailType) {
						case 0:
							mail.addMailNewList(mailList);
							break;
						case 1:
							mail.addMailXTList(mailList);
							break;
						case 2:
							mail.addMailHDList(mailList);
							break;
						case 3:
							mail.addMailHYList(mailList);
							break;
						default:
							break;
						}
						
					}

					////////////////////////////////////////
					//界面
					var dlgMail = UIMgr.getInstance().getDlg(ID_DlgMail);
					if(dlgMail){
						if(sendType == 0){
							dlgMail.reloadMailList(true);
						}else if(sendType == 1){
							dlgMail.reloadMailList(false);
						}
						
					}
				});
	},
	
	requestEmailBody: function(mailTitle, maidId){
		var gameId = g_objHero.getGameId();
		var url = _CONFIG_.WEB_IP + '/User/EmailBody/' + maidId + '/' + gameId;

		HttpRequest.getInstance().sendPostForms(
				url,
				"",
				function(response){					
					if(!response){
						cc.log("response is null!");
						return;
					}

					cc.log("#####http guest url: " + url);
					cc.log("#####http guest result : " + response );
					
					var strHtml = response;
					
					////////////////////////////////////////
					//数据
					var mail = ClientData.getInstance().getMail();
					if(mail){
						mail.readMail(maidId);
					}

					////////////////////////////////////////
					//界面
					var dlgMail = UIMgr.getInstance().getDlg(ID_DlgMail);
					if(dlgMail){
						dlgMail.reloadMailList(true);
					}
					
					var dlgMailInfo = UIMgr.getInstance().openDlg(ID_DlgMailInfo);
					dlgMailInfo.setTitle(mailTitle);
					dlgMailInfo.setBody(strHtml);
				});
	},
	
	requestEmailDelete: function(maidId){
		var gameId = g_objHero.getGameId();
		var url = _CONFIG_.WEB_IP + '/User/EmailDelete/' + maidId + '/' + gameId;

		HttpRequest.getInstance().sendPostForms(
				url,
				"",
				function(response){					
					if(!response){
						cc.log("response is null!");
						return;
					}

					cc.log("#####http guest url: " + url);
					cc.log("#####http guest result : " + response );

					if(response != 1){
						return;
					}

					////////////////////////////////////////
					//数据
					var mail = ClientData.getInstance().getMail();
					if(mail){
						mail.deleMail(maidId);
					}

					////////////////////////////////////////
					//界面
					var dlgMail = UIMgr.getInstance().getDlg(ID_DlgMail);
					if(dlgMail){
						dlgMail.reloadMailList(true);
					}
				});
	},
});

MailHttp.getInstance = function() {
	if (!s_sharedMailHttp) {
		s_sharedMailHttp = new MailHttp();
	}
	return s_sharedMailHttp;
};