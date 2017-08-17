DLG_CREATOR[ID_DlgGameShop] = function() {
	return new DlgGameShop();
};

var DlgGameShop = DlgBase.extend({
	ctor: function(){
	},

	onCreate: function() {
		this.init();
	},

	onClose: function() {

	},

	init: function() {
		var json = ccs.load(res.dlgShopScene_json);
		this._rootWidget = json.node;

		//自适应屏幕大小
		var sizeDir = cc.director.getWinSize();
		this._rootWidget.setContentSize(sizeDir);
		ccui.helper.doLayout(this._rootWidget);
		
		this._rootWidget.setGlobalZOrder(1000);

		this.Panel_root = this._rootWidget.getChildByName('Panel_root');
        var Button_close = this.Panel_root.getChildByName('Button_close');
        Button_close.addTouchEventListener(this.onClickClose, this);

        var Button_itemTypeTemp = this.Panel_root.getChildByName('Button_itemTypeTemp');
        var ListView_itemType = this.Panel_root.getChildByName('ListView_itemType');
        var Button_itemTemp = this.Panel_root.getChildByName('Button_itemTemp');
        var ListView_item = this.Panel_root.getChildByName('ListView_item');

        var shopCfg = LoadShopCfg.getInstance().getShopCfg();
        var Text_tip = this.Panel_root.getChildByName('Text_tip');
        var curItemType = null;

        var onItemTypeListViewEvent = function(sender, type) {
            if(type==ccui.ListView.ON_SELECTED_ITEM_END){
                var selectedItem = sender.getItem(sender.getCurSelectedIndex());
                curItemType.setTouchEnabled(true);
                curItemType.setBright(true);
                curItemType.setEnabled(true);

                var typeName = selectedItem.getName();
                var cfgInfo = shopCfg[typeName];

                if(cfgInfo.enable){
                    Text_tip.setVisible(false);

                    //itemListView
                    ListView_item.removeAllItems();
                    var arrItem = cfgInfo.item;
                    for(var itemIndex=0; itemIndex<arrItem.length; ++itemIndex){
                        var itemInfo = arrItem[itemIndex];
                        var item = Button_itemTemp.clone();
                        item.setName(String(itemIndex));
                        var AtlasLabel_counts = item.getChildByName('AtlasLabel_counts');
                        var Text_money = item.getChildByName('Text_money');

                        item.loadTextureNormal(itemInfo.itemIcon,ccui.Widget.PLIST_TEXTURE);
                        var strCounts = String(itemInfo.counts);
                        cc.log("strCounts--"+strCounts+"--length--"+strCounts.length);
                        AtlasLabel_counts.setString(strCounts);
                        AtlasLabel_counts.setContentSize(cc.size(29*strCounts.length,48));
                        Text_money.string = itemInfo.money;

                        item.setVisible(true);
                        ListView_item.pushBackCustomItem(item);
                    }
                    ccui.ScrollView.prototype.scrollToTop.call(ListView_item,0.01, false);
				}
				else{
                    ListView_item.removeAllItems();
                    ccui.ScrollView.prototype.scrollToTop.call(ListView_item,0.01, false);

                    Text_tip.setVisible(true);
				}

                selectedItem.setTouchEnabled(false);
                selectedItem.setBright(false);
                selectedItem.setEnabled(false);
                curItemType = selectedItem;
            }
        }

        var onItemListViewEvent = function(sender, type) {
            if(type==ccui.ListView.ON_SELECTED_ITEM_START){
                var selectedItem = sender.getItem(sender.getCurSelectedIndex());
                var itemIndex = selectedItem.getName();
                var item = sender.getChildByName(itemIndex);
                var Text_money = item.getChildByName("Text_money");
                var AtlasLabel_counts = item.getChildByName("AtlasLabel_counts");
                var posY = Text_money.getPositionY();
                Text_money.setScale(1.3);
                AtlasLabel_counts.setScale(1.3);
                Text_money.setPositionY(posY*0.9);
            }
            if(type==ccui.ListView.ON_SELECTED_ITEM_END){
                var selectedItem = sender.getItem(sender.getCurSelectedIndex());
                var itemIndex = selectedItem.getName();
                var curType = curItemType.getName();

                var item = sender.getChildByName(itemIndex);
                var Text_money = item.getChildByName("Text_money");
                var AtlasLabel_counts = item.getChildByName("AtlasLabel_counts");
                var posY = Text_money.getPositionY();
                Text_money.setScale(1.0);
                AtlasLabel_counts.setScale(1.0);
                Text_money.setPositionY(posY/0.9);

                var cfgInfo = shopCfg[curType];
                var arrItem = cfgInfo.item;
                var itemInfo = arrItem[Number(itemIndex)];
                var strTip = "您确定购买 "+curType+"\n\r"+"数量 "+itemInfo.counts+" 价格 "+itemInfo.money;
                //
                DlgTip.openSysTip(strTip, function(){
                	//发送购买
                    if(payMgr.getInstance().sendPayGoods)
                        payMgr.getInstance().sendPayGoods(itemInfo.productId, itemInfo.counts, itemInfo.money);
                	this.closeTip();
				}, true);
            }
        }

        for(var index in shopCfg){
        	var cfgInfo = shopCfg[index];
        	var itemType = Button_itemTypeTemp.clone();
            itemType.setName(index);
            itemType.loadTextureNormal(cfgInfo.typeIconNomal,ccui.Widget.PLIST_TEXTURE);
            itemType.loadTexturePressed(cfgInfo.typeIconPress,ccui.Widget.PLIST_TEXTURE);
            itemType.loadTextureDisabled(cfgInfo.typeIconDisable,ccui.Widget.PLIST_TEXTURE);
            itemType.setVisible(true);
            ListView_itemType.pushBackCustomItem(itemType);

            //setDefault
            if(curItemType==null){
                itemType.setTouchEnabled(false);
                itemType.setBright(false);
                itemType.setEnabled(false);

                //itemListView
                var arrItem = cfgInfo.item
				for(var itemIndex=0; itemIndex<arrItem.length; ++itemIndex){
                    var itemInfo = arrItem[itemIndex];
                    var item = Button_itemTemp.clone();
                    item.setName(String(itemIndex));
                    var AtlasLabel_counts = item.getChildByName('AtlasLabel_counts');
                    var Text_money = item.getChildByName('Text_money');

                    item.loadTextureNormal(itemInfo.itemIcon,ccui.Widget.PLIST_TEXTURE);
                    var strCounts = String(itemInfo.counts);
                    cc.log("strCounts--"+strCounts+"--length--"+strCounts.length);
                    AtlasLabel_counts.setString(strCounts);
                    AtlasLabel_counts.setContentSize(cc.size(29*strCounts.length,48));
                    Text_money.string = itemInfo.money;

                    item.setVisible(true);
                    ListView_item.pushBackCustomItem(item);
				}
                ccui.ScrollView.prototype.scrollToTop.call(ListView_item,0.01, false);
                curItemType = itemType;
            }
		}
        ccui.ScrollView.prototype.scrollToTop.call(ListView_itemType,0.01, false);
        ListView_itemType.addEventListener(onItemTypeListViewEvent, this);
        ListView_item.addEventListener(onItemListViewEvent, this);
	},

    onClickClose: function(sender, type) {
        if (ccui.Widget.TOUCH_ENDED == type) {
            UIMgr.getInstance().closeDlg(ID_DlgGameShop);
        }
    }
});
