/*
 * 大厅商城 网络接口
 * Author: 	YangJiazhen
 * Date:	2017.4.8
 *
 * 功能：商城相关网络接口处理
 * */

var g_plazaMailMsg = null;
var  PlazaMailMsg = cc.Class.extend({
    ctor: function () {
    },

    // 获取个人财产，金豆、钻石数量
    sendQueryToGetPersonalProperty: function (data) {
        var dataBuilder = new DataBuilder();
        dataBuilder.init(20);

        dataBuilder.build([
            ["dwUserID", "DWORD", g_objHero.getUserId()],
        ]);

        console.log("准备发送请求个人财产指令");

        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
            g_gameSocket.sendData(MDM_CS_MANAGER_SERVICE, SUB_CS_C_SYSTEM_MESSAGE, dataBuilder.getData());
        }
    },

    // 获取商品列表
    sendQueryToGetGoodsList: function (data) {
        var dataBuilder = new DataBuilder();
        dataBuilder.init(20);

        dataBuilder.build([
            ["dwUserID", "DWORD", g_objHero.getUserId()],
        ]);

        console.log("准备发送请求商品列表指令指令");
        if(g_gameSocket.status == SOCKET_STATUS._SS_CONNECTED){
            g_gameSocket.sendData(MDM_CS_MANAGER_SERVICE, SUB_CS_C_SYSTEM_MESSAGE, dataBuilder.getData());
        }
    },

    // 指令回调
    onMsgMallRet: function (subCmd, data) {
        console.log("商城指令回调了");
        switch (subCmd) {
            case 0:
                break;
            default:
                break;
        }
    },

    // 处理个人财产数据
    getPersonalPropertyData: function (data) {
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["dwMsgID", "DWORD"]
        ]);

        cc.log("返回json数据 = " + JSON.stringify(parseData));

        // 刷新UI界面
        var dlgMall = MsgMgr.getInstance().getDlg(ID_DlgPlazaMall);
        if (dlgMall) {
            dlgMall.getPersonalPropertyData(data);
        }
    },

    // 处理商品列表数据
    getGoodsListData: function (data) {
        var dataParser = new DataParser();
        dataParser.init(data);
        var parseData = dataParser.parse([
            ["dwMsgID", "DWORD"]
        ]);

        cc.log("返回json数据 = " + JSON.stringify(parseData));

        // 刷新UI界面
        var dlgMall = MsgMgr.getInstance().getDlg(ID_DlgPlazaMall);
        if (dlgMall) {
            dlgMall.getGoodsListData(data);
        }
    },
});