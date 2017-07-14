/*
 * 大厅商城 网络接口
 * Author: 	YangJiazhen
 * Date:	2017.4.8
 *
 * 功能：商城相关网络接口处理
 * */

var g_plazaMallMsg = null;
var  PlazaMallMsg = cc.Class.extend({
    ctor: function () {
    },

    // 获取个人财产，金豆、钻石数量
    sendQueryToGetPersonalProperty: function (data) {

        LogonMsgHandler.getInstance().connect(function () {
            if (g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED) {
                cc.log("准备发送请求个人财产指令");
                g_logonSocket.sendData(MDM_GP_PROPERTY, SUB_GP_QUERY_PROPERTY, null);
            }
        });
    },

    // 获取商品列表
    sendQueryToGetGoodsList: function (data) {

        LogonMsgHandler.getInstance().connect(function () {
            if (g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED) {
                cc.log("准备发送请求商品列表指令指令");
                g_logonSocket.sendData(MDM_GP_PROPERTY, SUB_GP_QUERY_PROPERTY, null);
            }
        });
    },

    // 购买道具
    sendQueryToBuyGoods: function (nPropertyID, nItemCount, cConsumeType) {
        console.log("购买道具入参"+nPropertyID+","+nItemCount+","+cConsumeType+",userid="+g_objHero.getUserId()+",pass="+g_objHero.getMd5Pass()+"机器="+LocalStorageMgr.getInstance().getUuidItem());
        var dataBuilder = new DataBuilder();
        dataBuilder.init(145);

        dataBuilder.build([
            ["cbConsumeType", "BYTE", cConsumeType],
            ["dwUserID", "DWORD", g_objHero.getUserId()],  // 用户ID
            ["dwPropertyID", "DWORD", nPropertyID],
            ["dwItemCount", "DWORD", nItemCount],
            ["tConcludeTime[33]", "TCHAR", g_objHero.getMd5Pass(), 33],
            ["szMachineID[33]", "TCHAR", LocalStorageMgr.getInstance().getUuidItem(), 33]
        ]);
        LogonMsgHandler.getInstance().connect(function () {
            if (g_logonSocket.status == SOCKET_STATUS._SS_CONNECTED) {
                cc.log("准备发送兑换道具指令json="+JSON.stringify(dataBuilder));
                g_logonSocket.sendData(MDM_GP_PROPERTY, SUB_GP_PROPERTY_BUY, dataBuilder.getData());
            }
        });
    },

    // 指令回调
    onMsgMallRet: function (subCmd, data) {
        console.log("商城指令回调了");
        switch (subCmd) {
            case SUB_GP_QUERY_PROPERTY_RESULT:
                this.getGoodsListData(data);
                break;
            case SUB_GP_PROPERTY_BUY_RESULT:
                this.buyGoodsResult(data);
                break;
            case SUB_GP_PROPERTY_FAILURE:
                this.buyGoodsFailure(data);
                break;
            default:
                break;
        }
        //关闭连接
        LogonMsgHandler.getInstance().close();
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
        var dlgMall = UIMgr.getInstance().getDlg(ID_DlgPlazaMall);
        if (dlgMall) {
            dlgMall.getPersonalPropertyData(data);
        }
    },

    // 处理商品列表数据
    getGoodsListData: function (data) {
        var dataParser = new DataParser();
        dataParser.init(data);

        var parseData = [];
        var length = data.byteLength;
        for (var i = 0; i < length / 20; i++) {
            parseData[i] = dataParser.parse([
                ["nCurrencyType", "DWORD"],     // 货币类型
                ["nCurrencyNum", "DWORD"],      // 砖石数量
                ["nPropertyID", "DWORD"],       // 道具标识
                ["nPropertyNum", "LONGLONG"],   // 道具数量
            ]);
        }

        cc.log("返回json数据 = " + JSON.stringify(parseData));

        // 刷新UI界面
        var dlgMall = UIMgr.getInstance().getDlg(ID_DlgPlazaMall);
        if (dlgMall) {
            dlgMall.getGoodsListData(parseData);
        }
    },

    // 购买道具返回账单处理
    buyGoodsResult: function (data) {
        var dataParser = new DataParser();
        dataParser.init(data);
        console.log("数据长度="+data.byteLength);
        var parseData = dataParser.parse([
            ["nUserID", "DWORD"],       // 用户ID
            ["nPropertyID", "DWORD"],   // 道具标识
            ["nItemCount", "DWORD"],    // 道具数目
            ["nDiamond", "DWORD"],      // 用户砖石
            ["nInsureScore", "LONGLONG"],   // 银行存款
        ]);

        cc.log("返回json数据 = " + JSON.stringify(parseData));

        // 刷新UI界面
        var dlgMall = UIMgr.getInstance().getDlg(ID_DlgPlazaMall);
        if (dlgMall) {
            dlgMall.getBuyGoodsResult(parseData);
        }
    },

    // 兑换道具失败
    buyGoodsFailure: function (data) {
        var dataParser = new DataParser();
        dataParser.init(data);
        console.log("数据长度="+data.byteLength);
        var parseData = dataParser.parse([
            ["lErrorCode", "LONG"],       // 用户ID
            ["szDescribeString", "TCHARS", 128],   // 道具标识
        ]);

        cc.log("返回json数据 = " + JSON.stringify(parseData));
        // 刷新UI界面
        var dlgMall = UIMgr.getInstance().getDlg(ID_DlgPlazaMall);
        if (dlgMall) {
            dlgMall.buyGoodsFailure(parseData);
        }
    },
});

PlazaMallMsg.getInstance = function () {
    if (!g_plazaMallMsg) g_plazaMallMsg = new PlazaMallMsg();
    return g_plazaMallMsg;
}