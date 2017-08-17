/*
 * 大厅商城
 * Author: 	YangJiazhen
 * Date:	2017.4.7
 *
 * 功能：商城界面
 * */

DLG_CREATOR[ID_DlgPlazaMall] = function() {
    // return new DlgPlazaMall();
    DlgTip.openSysTip("暂未开放，敬请期待！");
    return null;
};

var DlgPlazaMall = DlgBase.extend({
    ctor: function() {

    },

    onCreate: function() {
        this.init();
    },

    onClose: function() {

    },

    init: function() {

        this.goodsListData = {};
        // 从文件载入
        var json = ccs.load(res.dlgPlazaMallScene_json);

        this._rootWidget = json.node;

        //自适应屏幕大小
        var sizeDir = cc.director.getWinSize();
        this._rootWidget.setContentSize(sizeDir);
        ccui.helper.doLayout(this._rootWidget);

        var image_bg = this._rootWidget.getChildByName("Panel_Root").getChildByName("Image_bg");
        // 关闭按钮
        this.btnClose = image_bg.getChildByName("Button_Close");
        this.btnClose.addTouchEventListener(function(sender, type){
            if (ccui.Widget.TOUCH_ENDED == type) {
                UIMgr.getInstance().closeDlg(ID_DlgPlazaMall, false);
            }
        }, this);

        // 确认按钮
        this.btnOK = image_bg.getChildByName("Button_OK");
        this.btnOK.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {

                if (this.goodsTypeSelectIndex == this.listView_Goods_Key[0]) {

                    var data = this.goodsListData[this.goodsTypeSelectIndex][this.goodsIndex];
                    // 购买砖石跳转支付界面


                    // 调用URL
                    var tempUrl     =   'http://www.001060.com/web.php/Recharge/rechargeApi?';

                    // 以下参数，自己根据用户实际填

                    var gameName    =   10130;
                    var nickName    =   "";
                    var userID      =   g_objHero.getUserId();
                    var goodsNumber =   data.nPropertyNum;
                    var payAmount   =   data.nCurrencyNum;
                    var goodsName   =   "Diamond";
                    var goodsID     =   data.nPropertyID;

                    var url = tempUrl+"GameName="+gameName+"&NickName="+nickName+"&UserID="+userID+"&GoodsNumber="+goodsNumber+"&PayAmount="+payAmount+"&GoodsName="+goodsName+"&GoodsID="+goodsID;

                    cc.log(url);

                    if(cc.sys.os == cc.sys.OS_IOS) {
                        jsb.reflection.callStaticMethod(
                            "AppController",
                            "showWebView:",
                            url
                        );
                    }
                    else if(cc.sys.os == cc.sys.OS_ANDROID){
                        jsb.reflection.callStaticMethod(
                            "org/cocos2dx/javascript/AppActivity",
                            "onLoadwebMall",
                            "(Ljava/lang/String;)V",
                            url
                        );
                    }
                } else if ((this.goodsTypeSelectIndex == this.listView_Goods_Key[1]) ||
                           (this.goodsTypeSelectIndex == this.listView_Goods_Key[2])) {
                    // 兑换金币/房卡，直接调指令兑换
                    var data = this.goodsListData[this.goodsTypeSelectIndex][this.goodsIndex];
                    PlazaMallMsg.getInstance().sendQueryToBuyGoods(data.nPropertyID, data.nPropertyNum,data.nCurrencyType);
                }
            }
        }, this);

        // 标签控件
        this.textImazamox = image_bg.getChildByName("Text_Imazamox");
        this.textDiamonds = image_bg.getChildByName("Text_Diamonds");

        if (this.textImazamox) this.textImazamox.setString(g_objHero.getMoney());
        if (this.textDiamonds) this.textDiamonds.setString(g_objHero.getMbDiamond());

        // 顶部的选择背景
        this.bgGoodsType = [];      // 商品类型选中背景
        this.btnGoodsType = [];     // 商品类型按钮
        this.listView_Goods = {};   // 获取商品列表

        this.listView_Goods_Key = [27,28,26];

        for (var i = 0; i < 3; i++) {
            // 取商品类型选中背景
            var str = "Image_GoodsType_Select_";
            str += i;
            this.bgGoodsType[i] = image_bg.getChildByName(str);
            if (this.bgGoodsType[i]) this.bgGoodsType[i].setVisible(i == 0);

            // 取商品类型按钮
            str = "Button_GoodsType_";
            str += i;
            this.btnGoodsType[i] = image_bg.getChildByName(str);
            if (this.btnGoodsType[i]) {
                this.btnGoodsType[i].setTag(i);
                this.btnGoodsType[i].addTouchEventListener(this.goodsTypeChoose, this);
                this.btnGoodsType[i].setBright(i != 0);
            }

            // 商品列表控件
            str = "ListView_Goods_";
            str += i;
            var listView_Key = this.listView_Goods_Key[i];
            console.log("key="+listView_Key);
            this.listView_Goods[listView_Key] = image_bg.getChildByName(str);
            if (this.listView_Goods[listView_Key]) this.listView_Goods[listView_Key].setVisible(i == 0);
        }

        // 默认类型选中0
        this.goodsTypeIndex = 0;
        this.goodsSelectIndex = -1;
        this.goodsTypeSelectIndex = -1;
        // this.updateGoodsList();
        PlazaMallMsg.getInstance().sendQueryToGetGoodsList();
    },

    goodsBtnClick: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {

            for (var i = 0; i < 3; i++) {
                this.bgGoodsSelect[i].setVisible(false);
            }

            var btnTag = sender.getTag();

            // 选中的商品背景显示
            this.bgGoodsSelect[btnTag].setVisible(true);
        }
    },

    goodsTypeChoose: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            var btnTag = sender.getTag();

            for (var i = 0; i < 3; i++) {
                this.bgGoodsType[i].setVisible(false);

                this.btnGoodsType[i].setBright(true);
            }

            for (var i = 0; i < this.listView_Goods_Key.length; i++) {
                this.listView_Goods[this.listView_Goods_Key[i]].setVisible(false);
            }

            this.bgGoodsType[btnTag].setVisible(true);
            this.listView_Goods[this.listView_Goods_Key[btnTag]].setVisible(true);
            this.btnGoodsType[btnTag].setBright(false);
            this.goodsTypeIndex = btnTag;
        }
    },

    updateGoodsList: function(refreshModel) {

        var keyArray = [];

        if (refreshModel == null) {
            keyArray = this.listView_Goods_Key;
        } else {
            keyArray[0] = refreshModel;
        }

        // 取出自定义cell
        var json = ccs.load(res.dlgPlazaMallGoodsListCellNode_json);
        var cellNode = json.node;
        var panel_bg = cellNode.getChildByName("Panel_Bg");

        var nKeyCount = keyArray.length;
        for (var x = 0; x < nKeyCount; x++) {
            var j = keyArray[x];
            this.listView_Goods[j].removeAllChildren();
            var largeIcon;
            var smallIcon;

            switch (j) {
                case this.listView_Goods_Key[0]:
                    largeIcon = "dlgPlazaMallScenePlist/img_plaza_mall_diamonds.png";
                    smallIcon = "dlgPlazaMallScenePlist/img_plaza_mall_RMB.png";
                    break;
                case this.listView_Goods_Key[1]:
                    largeIcon = "dlgPlazaMallScenePlist/img_plaza_mall_gold.png";
                    smallIcon = "dlgPlazaMallScenePlist/img_plaza_mall_one_diamonds.png";
                    break;
                case this.listView_Goods_Key[2]:
                    largeIcon = "dlgPlazaMallScenePlist/img_plaza_mall_room_card.png";
                    smallIcon = "dlgPlazaMallScenePlist/img_plaza_mall_one_diamonds.png";
                    break;
                default:
                    break;
            }

            var goodsData = this.goodsListData[j];
            if (goodsData) {
                for (var i = 0; i < goodsData.length; i++) {
                    var goodsCell = panel_bg.clone();
                    goodsCell.setTouchEnabled(true);
                    var panel_root = goodsCell.getChildByName("Panel_Root");
                    panel_root.setTag(i);
                    panel_root.addTouchEventListener(function (sender, type) {
                        if (type == ccui.Widget.TOUCH_ENDED) {

                            // 变化
                            var bgGoodsSelect = sender.getChildByName("Image_btn_select");
                            bgGoodsSelect.setVisible(!bgGoodsSelect.isVisible());

                            var nTag = sender.getTag();

                            if (nTag == this.goodsIndex && this.goodsTypeSelectIndex == this.listView_Goods_Key[this.goodsTypeIndex]) {
                                this.goodsIndex = -1;
                                this.goodsTypeSelectIndex = -1;
                            } else {
                                var list_1 = this.listView_Goods[this.goodsTypeSelectIndex];
                                if (list_1) {
                                    var cell = list_1.getItem(this.goodsIndex);
                                    if (cell) {
                                        var panel = cell.getChildByName("Panel_Root").getChildByName("Image_btn_select");
                                        panel.setVisible(false);
                                    }
                                }

                                this.goodsIndex = nTag;
                                this.goodsTypeSelectIndex = this.listView_Goods_Key[this.goodsTypeIndex];
                            }
                        }
                    }, this);

                    // 取商品选中背景
                    var bgGoodsSelect = panel_root.getChildByName("Image_btn_select");
                    bgGoodsSelect.setVisible(false);

                    // 取商品类型大图标
                    var icon_big_GoodsType = panel_root.getChildByName("Image_Goods_Type");
                    icon_big_GoodsType.loadTexture(largeIcon, ccui.Widget.PLIST_TEXTURE);

                    // 取商品数量标签
                    var text_GoodsNum = panel_root.getChildByName("Text_Num");
                    text_GoodsNum.setString(goodsData[i].nPropertyNum);

                    // 取商品类型小图标
                    var btnPrice = panel_root.getChildByName("Image_Price_bg");
                    var icon_small_GoodsType = btnPrice.getChildByName("Image_Goods_Type");
                    icon_small_GoodsType.loadTexture(smallIcon, ccui.Widget.PLIST_TEXTURE);

                    // 取商品价格文本标签
                    var text_GoodsPrice = btnPrice.getChildByName("Text_Price");
                    text_GoodsPrice.setString(goodsData[i].nCurrencyNum);

                    this.listView_Goods[j].pushBackCustomItem(goodsCell);
                }
            }
        }
    },

    // 个人财产数据回调
    getPersonalPropertyData: function (data) {
        // 处理数据

        this.textDiamonds.setString("123");
        this.textImazamox.setString("5345");
    },

    // 商品列表数据
    getGoodsListData: function (data) {
        // 处理数据

        this.goodsListData = {};
        for (var i = 0; i < data.length; i++) {
            var nPropertyID = data[i].nPropertyID;
            var goods = this.goodsListData[nPropertyID];
            if (!goods) {
                console.log("需要创建数组");
                goods = new Array();
            }
            goods.push(data[i]);
            this.goodsListData[nPropertyID] = goods;
        }

        // 刷新界面
        this.updateGoodsList();
    },

    // 兑换道具结果返回
    getBuyGoodsResult: function (data) {
        var strTip = "兑换成功，您一共购买了";
        switch (data.nPropertyID) {
            case 26:
                strTip += "房卡";
                break;
            case 27:
                strTip += "钻石";
                break;
            case 28:
                strTip += "撸币";
                break;
            default:
                break;
        }
        strTip += data.nItemCount;

        DlgTip.openSysTip(strTip);

        this.textDiamonds.setString(data.nInsureScore);
        this.textImazamox.setString(data.nDiamond);
    },

    // 兑换道具失败
    buyGoodsFailure: function (data) {
        var strTip = data.szDescribeString;
        DlgTip.openSysTip(strTip);
    },

    // 选择类型
    chooseGoodsType: function (nIndex) {
        if (nIndex > 2) return;
        this.goodsTypeChoose(this.btnGoodsType[nIndex], ccui.Widget.TOUCH_ENDED);
    },
});
