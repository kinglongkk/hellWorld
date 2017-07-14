//邮件数据
var Mail = cc.Class.extend({

	ctor: function () {
		this.reset();
	},

	reset: function(){
		//新邮件数量
		this.newMailNum = 0;
		
		
		this.mailsNew = [];	//新邮件（包含：系统邮件、活动邮件、好友邮件）
		this.mailsXT = [];	//系统邮件（包含：新邮件、已读邮件）
		this.mailsHD = [];	//活动邮件（包含：新邮件、已读邮件）
		this.mailsHY = [];	//好友邮件（包含：新邮件、已读邮件）
	},
	
	//新邮件数量
	setNewMailNum: function(num){
		this.newMailNum = num;
	},
	getNewMailNum: function(){
		return this.newMailNum;
	},

	//最大mailID邮件
	getMaxMailID: function(mailList){
		var maxMailID = 0;

		for(var i=0; i<mailList.length; i++){
			var info = mailList[i];
			if(parseInt(info.mailID) > parseInt(maxMailID)){
				maxMailID = info.mailID;
			}
		}

		return maxMailID;
	},

	//最小mailID邮件
	getMinMailID: function(mailList){
		var minMailID = 0;
		
		if(mailList.length > 0){
			minMailID = mailList[0].mailID;
		}

		for(var i=0; i<mailList.length; i++){
			var info = mailList[i];
			if(parseInt(info.mailID) < parseInt(minMailID)){
				minMailID = info.mailID;
			}
		}

		return minMailID;
	},

	//新邮件
	getMailsNew: function(){
		this.mailsNew.sort(function(a, b){
			return a.mailID - b.mailID;
		});
		
		return this.mailsNew;
	},
	addMailNewList: function(mailList){		
		for(var i=0; i<mailList.length; i++){
			var mailInfo = mailList[i];

			for(var j=0; j<this.mailsNew.length; j++){
				var info = this.mailsNew[j];
				if(info.mailID == mailInfo.mailId){
					this.mailsNew.splice(j, 1);
					break;
				}
			}
		}		

		this.mailsNew = this.mailsNew.concat(mailList);

		return this.mailsNew;
	},

	//新系统邮件
	getMailsXT: function(){
		this.mailsXT.sort(function(a, b){
			return a.mailID - b.mailID;
		});
		
		return this.mailsXT;
	},
	addMailXTList: function(mailList){		
		for(var i=0; i<mailList.length; i++){
			var mailInfo = mailList[i];

			for(var j=0; j<this.mailsXT.length; j++){
				var info = this.mailsXT[j];
				if(info.mailID == mailInfo.mailId){
					this.mailsXT.splice(j, 1);
					break;
				}
			}
		}		

		this.mailsXT = this.mailsXT.concat(mailList);

		return this.mailsXT;
	},

	//活动邮件
	getMailsHD: function(){
		this.mailsHD.sort(function(a, b){
			return a.mailID - b.mailID;
		});
		
		return this.mailsHD;
	},
	addMailHDList: function(mailList){		
		for(var i=0; i<mailList.length; i++){
			var mailInfo = mailList[i];

			for(var j=0; j<this.mailsHD.length; j++){
				var info = this.mailsHD[j];
				if(info.mailID == mailInfo.mailId){
					this.mailsHD.splice(j, 1);
					break;
				}
			}
		}		

		this.mailsHD = this.mailsHD.concat(mailList);
		
		return this.mailsHD;
	},
	
	//好友邮件
	getMailsHY: function(){
		this.mailsHY.sort(function(a, b){
			return a.mailID - b.mailID;
		});
		
		return this.mailsHY;
	},
	addMailHYList: function(mailList){		
		for(var i=0; i<mailList.length; i++){
			var mailInfo = mailList[i];

			for(var j=0; j<this.mailsHY.length; j++){
				var info = this.mailsHY[j];
				if(info.mailID == mailInfo.mailId){
					this.mailsHY.splice(j, 1);
					break;
				}
			}
		}		
		
		this.mailsHY = this.mailsHY.concat(mailList);
		
		return this.mailsHY;
	},
	

	deleMail: function(mailId){
		this.deleMailNew(mailId);
		this.deleMailXT(mailId);
		this.deleMailHD(mailId);
		this.deleMailHY(mailId);
	},
	//删除新邮件
	deleMailNew: function(mailId){
		for(var i=0; i<this.mailsNew.length; i++){
			var info = this.mailsNew[i];
			if(info.mailID == mailId){
				this.mailsNew.splice(i, 1);
				break;
			}
		}

		return this.mailsNew;
	},
	//删除系统邮件
	deleMailXT: function(mailId){
		for(var i=0; i<this.mailsXT.length; i++){
			var info = this.mailsXT[i];
			if(info.mailID == mailId){
				this.mailsXT.splice(i, 1);
				break;
			}
		}

		return this.mailsXT;
	},
	//删除活动邮件
	deleMailHD: function(mailId){
		for(var i=0; i<this.mailsHD.length; i++){
			var info = this.mailsHD[i];
			if(info.mailID == mailId){
				this.mailsHD.splice(i, 1);
				break;
			}
		}

		return this.mailsHD;
	},
	//删除好友邮件
	deleMailHY: function(mailId){
		for(var i=0; i<this.mailsHY.length; i++){
			var info = this.mailsHY[i];
			if(info.mailID == mailId){
				this.mailsHY.splice(i, 1);
				break;
			}
		}

		return this.mailsHY;
	},
	
	readMail: function(mailId){
		this.readMailNew(mailId);
		this.readMailXT(mailId);
		this.readMailHD(mailId);
		this.readMailHY(mailId);
	},
	//读新邮件
	readMailNew: function(mailId){
		//读新邮件就是删除新邮件
		return this.deleMailNew(mailId);
	},
	//读系统邮件
	readMailXT: function(mailId){
		for(var i=0; i<this.mailsXT.length; i++){
			var info = this.mailsXT[i];
			if(info.mailID == mailId){
				//设置读标记
				info.IsRead = 1;
				break;
			}
		}

		return this.mailsXT;
	},
	//读活动邮件
	readMailHD: function(mailId){
		for(var i=0; i<this.mailsHD.length; i++){
			var info = this.mailsHD[i];
			if(info.mailID == mailId){
				//设置读标记
				info.IsRead = 1;
				break;
			}
		}

		return this.mailsHD;
	},
	//读好友邮件
	readMailHY: function(mailId){
		for(var i=0; i<this.mailsHY.length; i++){
			var info = this.mailsHY[i];
			if(info.mailID == mailId){
				//设置读标记
				info.IsRead = 1;
				break;
			}
		}

		return this.mailsHY;
	},

	//判断是否已读
	isMailRead: function(mailInfo){
		var bRead = false;
		
		if(mailInfo.IsRead == 1){
			bRead = true;
		}

		return bRead;
	},
});