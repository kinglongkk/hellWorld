define(['gb/components/PopUp'], function (PopUp) {

    return PopUp.extend({
        init: function () {
            this._super();
        },
        popUpCallBack : function (data) {
            var dataObj = $.parseJSON(data);
            console.info("订阅类型为"+dataObj.subscribeType+"的订阅点收到消息，成功调用回调函数，参数值为" + data);
            var msgBody = dataObj.msgBody;
            var content = "<a herf='#' onclick='alert(\"你点到人家啦\")'>"+msgBody.content+"</a>"
            var date = msgBody.title;
            popUp.pop(content,date,"success");
        },
        dialogCallBack :function (data) {
            var dataObj = $.parseJSON(data);
            console.info("订阅类型为"+dataObj.subscribeType+"的订阅点收到消息，成功调用回调函数，参数值为" + data);
            var msgBody = dataObj.msgBody;
            var content = "<a herf='#' onclick='alert(\"你点到人家啦\")'>"+msgBody.content+"</a>"
            var title = msgBody.title;
            var opt = {};
            opt.title = title;
            opt.message = content;
            popUp.showDialog(opt);
        },
        /**
         * 系统公告-公告弹窗
         * @param data
         */
        playerAnnouncementDialogCallBack: function (data) {

            var dataObj = $.parseJSON(data);
            var id = dataObj.msgBody;
            var btnOption = {};
            //总代
            if(userTypeVal){
                btnOption.target = root + "/topAgentGameAnnouncement/announcementPopup.html?search.id=" + id;
                btnOption.text = "公告";
                btnOption.callback = function (e, opt) {
                    if(e.returnValue.isDetail){
                        if(e.returnValue.apiId!=""){
                            $("#mainFrame").load(root + "/topAgentGameAnnouncement/topAgentMessageDetail.html?search.id=" + e.messageId);
                        }else{
                            $("#mainFrame").load(root + "/topAgentGameAnnouncement/systemNoticeDetail.html?search.id=" + e.messageId);
                        }
                    }
                };
            }else{
                //代理
                btnOption.target = root + "/agentGameAnnouncement/announcementPopup.html?search.id=" + id;
                btnOption.text = "公告";
                btnOption.callback = function (e, opt) {
                    if(e.returnValue.isDetail){
                        if(e.returnValue.apiId!=""){
                            $("#mainFrame").load(root + "/agentGameAnnouncement/agentMessageDetail.html?search.id=" + e.messageId);
                        }else{
                            $("#mainFrame").load(root + "/agentGameAnnouncement/systemNoticeDetail.html?search.id=" + e.messageId);
                        }
                    }
                };
            }

            window.top.topPage.doDialog({page: this, messageId: id}, btnOption);
        }

    });
});