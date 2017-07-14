var gg = gg || {};

gg.WxSdkMgr = cc.Class.extend({
    ctor: function () {
        this.reset();

        this._bInit = false;
        this.init();
    },

    reset: function(){
    },

    init: function(){

        this._bInit = true;
    },

    //发起微信登录
    sendWxLogin: function(){
        if(cc.sys.isNative){
            if(cc.sys.os == cc.sys.OS_ANDROID){
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "jsWxLogin", "()V");
            }

            if(cc.sys.os == cc.sys.OS_IOS){
                zutils.sendWeChatLoginRequest();
            }
        }         
    },

    //ios 微信登录结果
    onSendAuthResp:function(code, errCode){
        cc.log("### onSendAuthResp", code, errCode);
        if(code){
            gg.WxSdkMgr.getInstance().javaCallWxLoginSucc(code);
        }
    },
      
    // 测试加载url 图片 sxh
     loadUrlImage: function (url)
     {
          cc.log("loadUrlImage");
          if (url != null && url != undefined && url != "")
          {
                         
             cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                               
                    if(err) {
                               
                               cc.log(err);
                               
                    }
                    else{
                           if (!cc.sys.isNative)
                            {
                                    var logo = new cc.Sprite(img);
                                logo.setPosition(70,90)
                                    UIMgr.getInstance().getDlg(ID_DlgLogin).addChild(logo);
                            }
                        
                    }
                               
             });
                              
           }
     },
    // 代码调用该接口
    javaCallWxLoginSucc: function(code){
        console.log("--------------javaCallWxLoginSucc code = " + code);
        var url = 'http://'+ _CONFIG_.LOGON_WCHAT + '/register.aspx?code='+code+"&channelType="+_CONFIG_.channelType; 
        //var url = "http://weixin.gamesqp.cn/module/interfacemanager/weixinrespond.aspx?code="+code;
        
        var args = 'code=' + code;
        var _self = this;
        
        //DlgTip.openSysTip(url);
        
         HttpRequest.getInstance().sendPostForms(
        		url,
                args,
                function(response){
                    console.log("###WxLoginSucc : " + response);

                    var info = JSON.parse(response);
                    var code = info.code;
                    
                    var strtip = "--------------账号 = " + info.account+"--------------密码 = " + info.pwd;
                    console.log("--------------账号 = " + info.account);
                    console.log("--------------密码 = " + info.pwd);
                    console.log("--------------url = " + info.key);
                 
                    if(code == 200 && info.account!="" && info.pwd!=""){ 
                        if(info.account && info.pwd){
                        	g_objHero.loginType = 1;
                        	g_objHero.setAccount(info.account);
                        	g_objHero.setMd5Pass(info.pwd);
                            g_objHero.setHeaderUrl(info.key);
                                                
                        	//ClientData.getInstance().setCurAccountInfo(info.account, info.pwd);
                        	LoginSceneUIMgr.getInstance().onLogonResult(true);
                        	LoginSceneUIMgr.getInstance().sendLogonMsg(info.account, info.pwd);
                                            
                        }
                    }else{
                        //错误
                        if(info.msg){
                            DlgTip.openSysTip(info.msg);
                        }else{
                            var strTip = "登录失败！（code:" + code + "）"
                            DlgTip.openSysTip(strTip);
                        }
                    }
                }
        );
    },

    
    //微信分享
    wxSdkShareUrl: function(shareUrl, title, description, isSession, picPath){
    	var sendData = {
    			webpageUrl: shareUrl,
    			title: title,
    			description: description,
    			isSession: isSession, //, //true微信，false微信朋友圈
    			//picPath: picPath
    	};

    	var strSendData = JSON.stringify(sendData);
      
    	cc.log(strSendData);
    	
    	if(cc.sys.isNative){
    		if(cc.sys.os == cc.sys.OS_ANDROID){
    			jsb.reflection.callStaticMethod(
    					"org/cocos2dx/javascript/AppActivity",
    					"jsWxShareUrl",
    					"(Ljava/lang/String;)V",
    					strSendData
    			);
    		}

    		if(cc.sys.os == cc.sys.OS_IOS){
                              
                              cc.log("content:"+strSendData);
                              
    			jsb.reflection.callStaticMethod(
    					"AppController",
    					"wxShare:",
    					strSendData
    			);
    		}
    	}

    	 
    },

    //微信分享图片
    wxSdkShareImg: function(isSession, imgPath){
    	var sendData = {
    			isSession: isSession, //true微信，false微信朋友圈
    			img: imgPath//截图路径
    	};

    	var strSendData = JSON.stringify(sendData);

    	if(cc.sys.isNative){
    		if(cc.sys.os == cc.sys.OS_ANDROID){
    			jsb.reflection.callStaticMethod(
    					"org/cocos2dx/javascript/AppActivity",
    					"jsWxShareImg",
    					"(Ljava/lang/String;)V",
    					strSendData
    			);
    		}

    		if(cc.sys.os == cc.sys.OS_IOS){
    			jsb.reflection.callStaticMethod(
    					"AppController",
    					"wxShareImage:",
    					strSendData
    			);

    		}
    	}

    	 
    },

    //=====================微信所用函数 自定义实现=====================

    //微信随机数生成
    randomString: function () {
        len = 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    // 微信生成ip 分平台实现
    GetIP:function () {

        var ip = "192.168.1.1";

        return ip;
    },


    /**
     * 下订单的签名
     */
    orderSign:function( )
    {
        var wx_appid = this._wxParam.m_appid;
        var body = this._wxParam.m_body;
        var wx_mchid = this._wxParam.m_mchid;
        var nonce_str = this._wxParam.m_nonce_str;
        var wx_notify_url = this._wxParam.m_notify_url;
        var out_trade_no = this._wxParam.m_out_trade_no;
        var price = this._wxParam.m_price;
        var wx_trade_type = this._wxParam.m_trade_type;
        var wx_key = this._wxParam.m_key;

        var str1= "";
        str1 +="appid="+wx_appid;
        str1 +="&body="+body;
        str1 +="&mch_id="+wx_mchid;
        str1 +="&nonce_str="+nonce_str;
        str1 +="&notify_url="+wx_notify_url;
        str1 +="&out_trade_no="+out_trade_no;
        str1 +="&spbill_create_ip="+this.GetIP();
        str1 +="&total_fee="+price;
        str1 +="&trade_type="+wx_trade_type;
        str1 +="&key="+wx_key;

        var sign = CryptoUtil.md5(str1).toUpperCase();

        return sign;
    },

    /**
     * 微信支付签名算法sign
     */
    paySign:function()
    {
        var appid = this._wxParam.m_appid;
        var noncestr = this._wxParam.m_nonce_str;
        var packageValue = this._wxParam.m_package;
        var partnerid = this._wxParam.m_mchid;
        var prepayid = this._wxParam.m_prepayid;
        var timestamp = this._wxParam.m_timestamp;
        var wx_key = this._wxParam.m_key;

        var str1= "";
        str1 +="appid="+ appid;
        str1 +="&noncestr="+noncestr;
        str1 +="&package="+ packageValue;
        str1 +="&partnerid="+ partnerid;
        str1 +="&prepayid="+ prepayid;
        str1 +="&timestamp="+timestamp;
        str1 +="&key="+ wx_key;

        var sign = CryptoUtil.md5(str1).toUpperCase();

        return sign;
    },


    /**
     * 第三步 支付成功后，向web获取稻穗值请求函数
     */
    GetUserDataFromWeb:function()
    {
        var preapyid = this._wxParam.m_prepayid;
        var postData = "";
        postData += "paystate=1&";
        postData += "prepayid="+preapyid;

        cc.log("postData:===>>"+postData);

        var url = _CONFIG_.DAOSUI_URL;
        var args = postData;
        HttpRequest.getInstance().sendPostForms(url, args, function(response){
            if(!response){
                cc.log("response is null!");
                return;
            }

            cc.log("json:====>>>"+response);

            var info = JSON.parse(response);
            var code = info.code;

            if(code == 200 )
            {
                if (info.UserID == g_objHero.getUserId()){

                    if (info.Score.length)
                    {
                        cc.log(info.Score);
                        cc.log(info.UserID);
                    }
                }
            }else{
                //错误
                if(info.msg){
                    DlgTip.openSysTip(info.msg);
                }else{
                    var strTip = "支付失败！"
                    DlgTip.openSysTip(strTip);
                }
            }

        });

    },

    /**
     * 第二步 获取订单成功后，发订单号到后台
     */
    SendPrepayIdToWeb:function( preapyid,  payamount)
    {
        var userid = g_objHero.getUserId();
        var payamount = this._wxParam.m_price;
        var preapyid = this._wxParam.m_prepayid;
        var appid = this._wxParam.m_appid;
        var mchid = this._wxParam.m_mchid;
        var count = this._wxParam.m_count;
        var out_trade_no = this._wxParam.m_out_trade_no;

        var postData = "";
        postData += "userid="+userid+"&";
        postData += "payamount="+payamount+"&";
        postData += "prepayid="+preapyid+"&";
        postData += "appID="+appid+"&";
        postData += "mchID="+mchid+"&";
        postData += "quantity="+count+"&";
        postData += "spbillCreateIP="+this.GetIP()+"&";
        postData+= "outtradeno="+out_trade_no;

        cc.log("postData:===>>"+postData);

        var url = _CONFIG_.ORDERURL_UP;
        var args = postData;
        HttpRequest.getInstance().sendPostForms(url, args, null);
    },

    SendOrderReqToWx:function ()
    {

        var url 		= _CONFIG_.ORDERURL_DOWN; // 下单网址

        // 参数
        var body                = this._wxParam.m_body;
        var apid                = this._wxParam.m_appid;
        var mch_id              = this._wxParam.m_mchid;
        var nonce_str           = this._wxParam.m_nonce_str;
        var sign                = this.orderSign();
        var out_trade_no        = this._wxParam.m_out_trade_no;
        var total_fee           = this._wxParam.m_price;
        var spbill_create_ip    = this.GetIP();
        var notify_url          = this._wxParam.m_notify_url;
        var trade_type          = "APP";

        var postData = "";
        postData += "<xml>";
        postData += "\n";
        postData += "<appid><![CDATA["+apid+"]]></appid>";
        postData += "\n";
        postData += "<mch_id><![CDATA["+mch_id+"]]></mch_id>";
        postData += "\n";
        postData += "<nonce_str><![CDATA["+nonce_str+"]]></nonce_str>";
        postData += "\n";
        postData += "<sign><![CDATA["+sign+"]]></sign>";
        postData += "\n";
        postData += "<body><![CDATA["+body+"]]></body>";
        postData += "\n";
        postData += "<out_trade_no><![CDATA["+out_trade_no+"]]></out_trade_no>";
        postData += "\n";
        postData += "<total_fee>"+total_fee+"</total_fee>";
        postData += "\n";
        postData += "<spbill_create_ip><![CDATA["+spbill_create_ip+"]]></spbill_create_ip>";
        postData += "\n";
        postData += "<notify_url><![CDATA["+notify_url+"]]></notify_url>";
        postData += "\n";
        postData += "<trade_type><![CDATA["+trade_type+"]]></trade_type>";
        postData += "\n";
        postData += "</xml>";

        var args = postData;

        cc.log("args =" + args);

        var tempthis = this;

        //请求生成订单
        HttpRequest.getInstance().sendPostForms(
            url,
            args,
            function(response){
                if(!response){
                    cc.log("response is null!");
                    return;
                }

                cc.log("xml："+response);

                var start = "<return_code><![CDATA[";
                var end = "]]></return_code>";
                var x = response.indexOf(start)+start.length ;
                var y = response.indexOf(end);
                var result = response.substring(x,y);

                if (result == "SUCCESS")
                {
                    start = "<prepay_id><![CDATA[";
                    end = "]]></prepay_id>";
                    x = response.indexOf(start)+start.length ;
                    y = response.indexOf(end);
                    var prePareid = response.substring(x,y);

                    cc.log("prePareid====>>："+prePareid);

                    if (prePareid.length > 0)
                    {
                        tempthis._wxParam.m_prepayid = prePareid; // 保存起来

                        // 通知web

                        tempthis.SendPrepayIdToWeb(tempthis._wxParam.m_prepayid,tempthis._wxParam.m_price);

                        // 支付
                        var response={};

                        response.appid           = tempthis._wxParam.m_appid;
                        response.partnerid       = tempthis._wxParam.m_mchid;
                        response.prepayid        = tempthis._wxParam.m_prepayid;
                        response.package    	  = tempthis._wxParam.m_package;
                        response.noncestr        = tempthis._wxParam.m_nonce_str;
                        response.timestamp       = tempthis._wxParam.m_timestamp;
                        response.sign            = tempthis.paySign();

                        var strSendPay = JSON.stringify(response);
                        cc.log(strSendPay);

                        if (cc.sys.os == cc.sys.OS_ANDROID)
                        {
                            var strSendPay = response;
                            jsb.reflection.callStaticMethod(
                                "org/cocos2dx/javascript/AppActivity",
                                "jsWxPay",
                                "(Ljava/lang/String;)V",
                                strSendPay);
                        }
                        else if (cc.sys.os == cc.sys.OS_IOS)
                        {
                            jsb.reflection.callStaticMethod(
                                "AppController",
                                "jsWxPay:",
                                strSendPay
                            );
                        }
                    }
                    else
                    {
                        alert(" 生成订单失败 ");
                    }
                }
                else
                {
                     start = "<return_msg><![CDATA[";
                     end = "]]></return_msg>";
                     x = response.indexOf(start)+start.length ;
                     y = response.indexOf(end);
                    var errMsg = response.substring(x,y);

                    DlgTip.openSysTip(errMsg);

                }



            });
    },

    // 微信充值 向服务器请求支付信息 再请求微信支付
    wxSdkPay: function(goodInfos){

        var objParam = JSON.parse(goodInfos);
        var goodsNumber = objParam.goodsNumber;
        var payAmount = objParam.price;

        var myDate = new Date();

        var timestamp = Date.parse(myDate);
        timestamp = timestamp / 1000;

        var nonce_str    = this.randomString();   //随机生成自己实现

        var out_trade_no = g_objHero.getUserId()+rand()+(myDate.getFullYear())%rand()+(myDate.getMonth())%rand()+(myDate.getDay())%rand()+(myDate.getHours())%rand()+(myDate.getMinutes())%rand()+(myDate.getSeconds())%rand();
        var wx_mchid = _CONFIG_.WX_MACID;
        var wx_trade_type = "APP";
        var wx_key = _CONFIG_.WX_KEY;
        var wx_appid = _CONFIG_.WCHAT_APPID; //"wx70ca0de9d440e381";// "wxf8b4f85f3a794e77"; // "wx12b173846e25f055"
        var body = _CONFIG_.WX_BODY;
        var wx_notify_url = _CONFIG_.WX_NOTIFY_URL;

        var fPrice = payAmount *100;
        var price  =  parseInt(fPrice.toString());      //"1"; // 分 (总金额)
        var count  =  goodsNumber;                             // 个数

        this._wxParam = {
            "m_appid":wx_appid,
            "m_mchid":wx_mchid,
            "m_out_trade_no":out_trade_no,
            "m_price":price,
            "m_count":count,
            "m_body":body,
            "m_notify_url":wx_notify_url,
            "m_trade_type":wx_trade_type,
            "m_key":wx_key,
            "m_package":"Sign=WXPay",
            "m_timestamp":timestamp,
            "m_nonce_str":nonce_str
        };

        this.SendOrderReqToWx();
    },


    
    //微信支付成功
    WxPayCallbackSucc: function(){

        // 发送顶单号给web
        cc.log("WxPayCallbackSucc  doing ");

        GetUserDataFromWeb();

        /*
        var runScene = cc.director.getRunningScene();
        if(runScene)
        {
            var action = cc.sequence(
            	//延时3秒更新金币
                cc.delayTime(3),
                cc.callFunc(function(){
                    gg.HeroMsg.getInstance().getTreasureInfo();
                }, this)
            );

            runScene.runAction(action);
        }else{
            gg.HeroMsg.getInstance().getTreasureInfo();
        }
        */
    },

    ///======================================================================================================

    // 微信分享成功回调
    WXShareCallbackSucc:function () {
       // UIMgr.getInstance().openDlg(ID_DlgWelfare).WXShareCBSucc();
	   if(WXShare.getInstance().shareCallBack || WXShare.getInstance().taskCallBack){
    		WXShare.getInstance().wxShareOKCallBack();
    	}
    	else{
    		UIMgr.getInstance().openDlg(ID_DlgWelfare).WXShareCBSucc();
    	}
    },

    // gps定位成功回调用，暂时也写这边 到时候可以到具体dlg 去打开然后设置
    ThirdPartLocationSucc:function (jsonStr) {
    	cc.log("-----gps定位成功回调用ThirdPartLocationSucc, 暂时关闭连接消息服务器-----");
    	return;
    	
        cc.log("jsonStr"+jsonStr);
        // 发送登陆
        var phoneMode = "phone6pluss";
        var md5Pass =  g_objHero.getMd5Pass();
        var cb = function (parseData){
        	cc.log("parseData parseData= " + JSON.stringify(parseData));
            if (parseData.lErrorCode==0) {
                cc.log("消息服务器登陆成功");
                if(jsonStr.berror==false){
                	// 发送位置信息
                	var latiude = jsonStr.latiude;
                	var longitude = jsonStr.longitude;
                	var address =  jsonStr.address;
                	var cb = function (parseData){
                		if(parseData.lErrorCode==0) {
                			cc.log("位置更新成功latiude:"+latiude+",longitude:"+longitude+",address:"+address);
                		}
                		else {
                			cc.log("szDescribeString"+parseData.szDescribeString);
                		}
                	}

                	CmdHandler.getInstance().connect(function(){
                		cc.log("发送位置信息");
                		Cmd4GCUser.getInstance().sendGcUpdateCoordinateReq(latiude,longitude,address,cb);
                	});
                }
                else{
                	//DlgTip.openSysTip("定位失败-"+jsonStr.msg);
                }
            }
            else {
            	cc.log("szDescribeString----"+parseData.szDescribeString);
            }
        };

        CmdHandler.getInstance().connect(function(){
        	cc.log("--发送登陆--");
            Cmd4GCLogon.getInstance().sendGcLogon(phoneMode, md5Pass,cb);
        });
    },
    
    //定时获取附近玩家信息
    getUserPosInfoTimer: function(userID){
    	if(this.hGetPosInfo)
    		return;
    	
    	var dwUserID = userID;
    	var cb = function(){
    		return function(){
    			// 发送请求位置
    			Cmd4GCUser.getInstance().sendGcGetNearuser(dwUserID);
    		};
    	};
    	this.hGetPosInfo = setInterval(cb, 1000);
    },
});


gg.s_sharedWxSdkMgr = null;
gg.WxSdkMgr.getInstance = function() {
    if (!gg.s_sharedWxSdkMgr) {
        gg.s_sharedWxSdkMgr = new gg.WxSdkMgr();
    }
    return gg.s_sharedWxSdkMgr;
};
