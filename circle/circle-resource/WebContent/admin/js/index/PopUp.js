define(['gb/components/PopUp'], function (PopUp) {

    return PopUp.extend({
        tones:null,
        init: function () {
            this._super();
        },
        popUpCallBack : function (data) {
            console.info("订阅类型为ACENTER-popUp-Notice的订阅点收到消息，成功调用回调函数，参数值为" + data);
            var msgBody = $.parseJSON($.parseJSON(data).msgBody);
            var content = "<a herf='#' onclick='alert(\"你点到人家啦\")'>"+msgBody.content+"</a>"
            var date = msgBody.date;
            popUp.pop(content,date,"success");
        },
        dialogCallBack :function (data) {
            console.info("订阅类型为ACENTER-dialog-Notice的订阅点收到消息，成功调用回调函数，参数值为" + data);
            var msgBody = $.parseJSON($.parseJSON(data).msgBody);
            var content = "<a herf='#' onclick='alert(\"你点到人家啦\")'>"+msgBody.content+"</a>"
            var date = msgBody.date;
            popUp.showDialog(content,date);
        },
        /**
         * 系统公告-公告弹窗
         * @param data
         */
        playerAnnouncementDialogCallBack: function (data) {
            var btnOption = {};
            var dataObj = $.parseJSON(data);
            var id = dataObj.msgBody;
            btnOption.target = root + "/messageAnnouncement/announcementPopup.html?search.id=" + id;
            btnOption.text = "公告";
            btnOption.callback = function (e, opt) {
                if(e.returnValue.isDetail){
                    if(e.returnValue.apiId!=""){
                        $("#mainFrame").load(root + "/messageAnnouncement/gameAnnouncementDetail.html?search.id=" + e.messageId);
                    }else{
                        $("#mainFrame").load(root + "/messageAnnouncement/systemAnnouncementDetail.html?search.id=" + e.messageId);
                    }
                }
            };
            window.top.topPage.doDialog({page: this, messageId: id}, btnOption);
        },
        profit: function (data) {
            var profit= $.parseJSON(data)
            var btnOption = {};
            var dataObj = $.parseJSON(data);
            var id = dataObj.msgBody.payId;
            if(profit.dictCode=='profitOrange'){
                btnOption.target = root + "/userTaskReminder/profitOrange.html";
            }else{
                btnOption.target = root + "/userTaskReminder/payDialogOrange.html";
            }

            btnOption.text = "消息";
            btnOption.callback = function(e,opt){
            };
            window.top.topPage.doDialog({page:this,payId:id}, btnOption);
        },
        /**
         * 更新顶部消息数量
         */
        unReadNotice: function (data) {
            window.top.popUp.queryTones();
            var tones = window.top.popUp.tones;

            //声音集合
            for (var index = 0; index < tones.length; index++) {
                var tone = tones[index];
                if ("notice" == tone.paramCode) {
                    if ($.browser && $.browser.version == '8.0') {
                        //本来这里用的是<bgsound src="system.wav"/>,结果IE8不播放声音,于是换成了embed
                        $('#newMessageDIV').html("<embed src='" + root + "/mcenter/" + tone.paramValue + "'/>");
                    } else {
                        //IE9+,Firefox,Chrome均支持<audio/>
                        $('#newMessageDIV').html("<audio autoplay='autoplay'><source src='" + root + "/mcenter/" + tone.paramValue + "' type='audio/wav'/></audio>");
                    }
                    $("#unReadCount").text(parseInt($("#unReadCount").text()) + 1);
                }
            };
        },
        queryTones: function () {
        var _this=this;
        window.top.topPage.ajax({
            url: root + '/index/queryTones.html',
            dataType: "json",
            async:false,
            success: function (data) {
                _this.tones=data;
            }
        })
    },
        playerAudio: function (data) {
            window.top.popUp.queryTones();
            var tones = window.top.popUp.tones;
            var map = $.parseJSON(data);
            //声音集合
            for (var index = 0; index < tones.length; index++) {
                var tone = tones[index];
                if (map.msgBody == tone.paramCode) {
                    if ($.browser && $.browser.version == '8.0') {
                        //本来这里用的是<bgsound src="system.wav"/>,结果IE8不播放声音,于是换成了embed
                        $('#newMessageDIV').html("<embed src='" + root + "/ccenter/" + tone.paramValue + "'/>");
                    } else {
                        //IE9+,Firefox,Chrome均支持<audio/>
                        $('#newMessageDIV').html("<audio autoplay='autoplay'><source src='" + root + "/ccenter/" + tone.paramValue + "' type='audio/wav'/></audio>");
                    }
                }
            };
        }

    });
});