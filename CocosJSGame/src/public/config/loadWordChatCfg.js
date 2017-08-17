var g_LoadWordChatCfg = null;
var LoadWordChatCfg = cc.Class.extend({
	ctor:function(){
		this.wordChatCfg = cc.loader.getRes(res.wordChatCfg_cfg);
	},
	
	getWordList: function(sex, kindID){
		var wordist = [];
		var wordChatList = null;
		switch(kindID){
			case CMD_HZMJ.KIND_ID:{
				wordChatList = this.wordChatCfg["hzmj_wordChatList"];
				break;
			}
            case CMD_ZPMJ.KIND_ID:{
                wordChatList = this.wordChatCfg["zpmj_wordChatList"];
                break;
            }
            case CMD_YXMJ.KIND_ID:{
                wordChatList = this.wordChatCfg["yxmj_wordChatList"];
                break;
            }
			case CMD_NIUNIU_TB.KIND_ID:{
				wordChatList = this.wordChatCfg["nntb_wordChatList"];
				break;
			}
			case CMD_SSS.KIND_ID:{
				wordChatList = this.wordChatCfg["sss_wordChatList"];
				break;
			}
            case CMD_DDZ.KIND_ID: {
                wordChatList = this.wordChatCfg["ddz_wordChatList"];
                break;
            }
			default:
				break;
		}
		
		if(sex==1){
			for(var i=0; i<wordChatList.length; i++){
				wordist.push(wordChatList[i].chatStrBoy);
			}
		}
		else{
			for(var i=0; i<wordChatList.length; i++){
				wordist.push(wordChatList[i].chatStrGirl);
			}
		}
		
		return wordist;
	},
	
	getSoundFile: function(index, sex, kindID){
		var wordChatList = null;
		switch(kindID){
			case CMD_HZMJ.KIND_ID:{
				wordChatList = this.wordChatCfg["hzmj_wordChatList"];
				break;
			}
			case CMD_ZPMJ.KIND_ID:{
				wordChatList = this.wordChatCfg["zpmj_wordChatList"];
				break;
			}
            case CMD_YXMJ.KIND_ID:{
                wordChatList = this.wordChatCfg["yxmj_wordChatList"];
                break;
            }
			case CMD_NIUNIU_TB.KIND_ID:{
				wordChatList = this.wordChatCfg["nntb_wordChatList"];
				break;
			}
			case CMD_SSS.KIND_ID:{
				wordChatList = this.wordChatCfg["sss_wordChatList"];
				break;
			}
			case CMD_DDZ.KIND_ID: {
                wordChatList = this.wordChatCfg["ddz_wordChatList"];
				break;
			}
			default:
				break;
		}
		
		var chatTemp = wordChatList[index];
		if(sex==1)
			return chatTemp.soundStrBoy;
		
		return chatTemp.soundStrGirl;
	},
	
});

LoadWordChatCfg.getInstance = function(){
	if(g_LoadWordChatCfg == null){
		g_LoadWordChatCfg = new LoadWordChatCfg();
	}
	return g_LoadWordChatCfg;
}