
var g_payMgr = null;
var payMgr = cc.Class.extend({
    _bSDKInit: false,
    _Key_receipt : "IOS_RECEIPT_KEY",
    ctor:function() {
        this._localListstr = null;
        this.tLocalReceipt = [];
        this.initLocalReceipt();
    }

    ,
    // 取得本地保存的清单
    initLocalReceipt:function () {
        this.tLocalReceipt = [];
        var strReceipt = cc.sys.localStorage.getItem(this._Key_receipt)
        if (strReceipt && strReceipt.length > 0) {
            this.tLocalReceipt = JSON.parse(strReceipt)
        }else {
            cc.log("--------------------本地的定单是空的")
        }
    },

    // 取得本地清单
    getLocalGoosList:function () {

        if (!this._localListstr)
        {
            var diamond = _shop_config["diamond"] || {}
            var items = diamond["item"] || []
            var lists = []
            for(var i = 0; i <items.length; i ++)
            {
                var productId = items[i].productId
                if (productId){
                    lists.push(productId)
                }
            }
            var dic = {list:lists}
            cc.log("-------------------取取商品列表清单 = ",JSON.stringify(dic))
            this._localListstr = JSON.stringify(dic)
        }
        return this._localListstr
    },

    // 支付购买
    payBuyGoods : function (goodsId) {
        // 开启菊花
        cc.log("-------------kai juhua ------------------")
        if (cc.sys.os == cc.sys.OS_IOS) {
            cc.log("-------------call oc ------------------")
            this.switchWait(true)
            var listStr = this.getLocalGoosList()
            jsb.reflection.callStaticMethod("AppController","payBuyGoods:withProductStr:",goodsId, listStr);
        }
    },

    payCallBack:function(result, data ){
		// 关闭菊花
        this.switchWait(false)
        cc.log ("-------------OC back JS Function------------------")
        cc.log("-------------result == " +result)
        cc.log("-------------data == \n" + data)
        if(parseInt(result)  == 1){ // 支付成功
            this.saveReceipt(data)  // 先加入了本地
            // 向后台请求
            this.requestVerifyReceipt()
        }
    },

    // 移除了记录
    deleteReceipt:function (item) {
        var index = this.tLocalReceipt.indexOf(item)
        if(index > -1){
            cc.log("---------------移除了记录订单-------")
            this.tLocalReceipt.splice(index, 1)
        }
        this.saveReceipt()
    },

    // 保存记录订单
    saveReceipt:function (item) {
        if (item) {
            cc.log("---------------增加了了记录订单-------")
            this.tLocalReceipt.push(item)
        }
        if (this.tLocalReceipt.length > 0){
            cc.sys.localStorage.setItem(this._Key_receipt, JSON.stringify(this.tLocalReceipt))
        }
        else {
            cc.sys.localStorage.removeItem(this._Key_receipt)
        }
    },

    // 请求验证
    requestVerifyReceipt:function () {
        if (this.tLocalReceipt.length < 1 )return;
        cc.log("---------------请求验证记录订单-------")
        var self= this
        for (var i = 0; i <this.tLocalReceipt.length; i ++){
            var preapyid = this.tLocalReceipt[i];
            var args ={
                userid : g_objHero.getUserId(),
                receiptdata:preapyid
            }

            var url = "http://zyd769.f3322.net:20001/applepay";
            HttpRequest.getInstance().sendPostJson(url, args, function(response){
                if(!response){
                    cc.log("response is null!");
                    return;
                }
                cc.log("-----------请求支付订单验证返回数据:====>>> "+JSON.stringify(response));

                var info = JSON.parse(response);
                var code = info.Code;

                if(code == 200 ) {
                    var Status = info.Status
                    if ( 0 == Status  || 2 == Status)
                    {
                        var receipt = info.ReceiptDaTa;
                        if (receipt){
                            self.deleteReceipt(receipt)
                        }
                        if (0 == Status)
                        {
                            var TransactionID = info.TransactionID
                            self.sendPaySucess(TransactionID)
                        }
                        else {
                            var strTip = "支付失败！"
                            DlgTip.openSysTip(strTip);
                        }
                    }
                    else {
                        var strTip = "支付失败！"
                        DlgTip.openSysTip(strTip);
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
        }
    },

    // 向登录服务器发送订单成功处理请求
    sendPaySucess:function (transactionId) {
        cc.log("-----------请求登录服务器支付订单成功的订单号：", transactionId)
        if (transactionId) {
            LogonMsgHandler.getInstance().send("C2L_RechangerOk",{OrderId:transactionId});
        }
    },

    // 登录服务器支付订单成功请求返回
    onL2C_RechangerOk:function (data) {
        cc.log("-----------请求登录服务器支付订单成功请求返回：", JSON.stringify(data))
        var code = data.code || -1
        if (0 == code) {
            var gold = data.Gold || 0
            SHOWTIP("充值成功！，获得钻石 " + gold)
        }
        else if (1 == code) {
            SHOWERROR("该订单未付款！" )
        }
        else if(2 == code) {
            SHOWERROR("该订单已完成！")
        }
    },

    // 购买支付
    sendPayGoods:function (goodsId, num, price) {
        var payWay = _CONFIG_.PAYTPYE || 0
        this.callPayGoods(payWay, goodsId, num, price)
    },

    callPayGoods:function (payWay, goodsId, num, priceValue) {
        cc.log("-----------------调用支付接口------------")
        if(cc.sys.isNative){
            var platform = cc.sys.os
            if(platform == cc.sys.OS_ANDROID){
                cc.log("-----------------调用安卓微信支付接口------------")
                this.switchWait(true)
                var info = {goodsNumber:num, price:0.01}
                gg.WxSdkMgr.getInstance().wxSdkPay(info)
            }
            else if(platform == cc.sys.OS_IOS){
                if(1 == payWay) {
                    cc.log("-----------------调用IOS微信支付接口------------")
                    this.switchWait(true)
                    var info = {goodsNumber:num, price:priceValue}
                    gg.WxSdkMgr.getInstance().wxSdkPay(info)
                }
                else if(0 == payWay){
                    cc.log("-----------------调用IOS内购支付接口------------")
                    this.payBuyGoods(goodsId)
                }
            }
        }
    },

    onWXPayCallBack:function () {
        this.switchWait(false)
    },

    switchWait:function (bOpen) {
        showWaiting(bOpen, 20, "正在支付中.........");
    }
});

payMgr.getInstance = function(){
    if (!g_payMgr) {
        g_payMgr = new payMgr();
    }
    return g_payMgr;
}
