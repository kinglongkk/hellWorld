/**
 * Created by Orange on 2015-11-17
 */

define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },

        onPageLoad: function () {
            this._super();
            this.copyLanguage();//复制语系
            this.initEditContentEvent();//初始化输入框的文本事件
            this.checkForNext();//判断输入框是否填写

            //计算文本字数
            $('input').bind('input propertychange', function () {
                if ($(this).val().length <= 100) {
                    $(this).next().html($(this).val().length + "/100");
                }
            });
            $('textarea').bind('input propertychange', function () {
                if ($(this).val().length <= 2000) {
                    $(this).next().html($(this).val().length + "/2000");
                }
            });

            //返回上一页，还原输入框的现有字数
            for (var i = 0; i < $(".div_length").length; i++) {
                var title_len = $("input[name='title[" + i + "]']").val().length;
                $(".msg" + i).html(title_len + "/100");
                var content_len = $("textarea[name='content[" + i + "]']").val().length;
                $(".textareaMsg" + i).html(content_len + "/2000");
                if (title_len > 0 && content_len > 0) {
                    $("#index_" + i).children().text(window.top.message.common['switch.CloseReminder.edited']);

                    
                }
            }

            //初始化多语言版本
            $("#index_0").children().text(window.top.message.common['switch.CloseReminder.editing']);
            $(".click_index").on("click", function (e) {
                var _this = e.currentTarget;
                var id = $(_this).prop("id").substr(6, 7);
                var data_language = $(_this).attr("data-language");
                $(".click_index").each(function (e) {
                    var this_id = $(this).prop("id").substr(6, 7);
                    if (this_id == id) {
                        $("#div_" + this_id).children().removeClass("hide");
                        $(this).addClass("current");
                        $(this).children().text(window.top.message.common['switch.CloseReminder.editing']);
                    } else {
                        var title = $("input[name='title[" + this_id + "]']").val();
                        var content = $("textarea[name='content[" + this_id + "]']").val();
                        if (title.length > 0 && content.length > 0) {
                            $("#div_" + this_id).children().addClass("hide");
                            $(this).removeClass("current");
                            $(this).children().text(window.top.message.common['switch.CloseReminder.edited']);
                        } else {
                            $("#div_" + this_id).children().addClass("hide");
                            $(this).removeClass("current");
                            $(this).children().text(window.top.message.common['switch.CloseReminder.unedited']);
                        }
                    }
                });
                //初始化复制语系
                for (var i = 0; i < $(".div_length").length; i++) {
                    var title = $("input[name='title[" + i + "]']").val();
                    var content = $("textarea[name='content[" + i + "]']").val();
                    if (title.length > 0 && content.length > 0) {
                        var language = $("#div_" + i + "").attr("language");
                        $(".temp").each(function (e) {
                            var lang = $(this).children().attr("copy-language");
                            if (lang == language) {
                                if (lang == data_language) {
                                    $(this).addClass("hide");
                                } else {
                                    $(this).removeClass("hide");
                                }

                            }
                        })
                    }
                }
            });

            //隐藏定时发送时间按钮
            $("[name='result.timingSend']").on("click", function (e) {
                var _this = e.currentTarget;
                if ($(_this).prop("checked")) {
                    $(".input-group").removeClass("hide");
                } else {
                    $(".input-group").addClass("hide");
                }
            });

            //点击代理公告
            $(".agentNotice").on("click", function (e) {
                var isTrue = $(this).is(":checked");
                if(isTrue){
                    $(".personal").removeClass("hide");
                }else {
                    $(".personal").addClass("hide");
                    $("#appointAgent").addClass("hide");
                    $("#_agent").val("");
                }
            });
            //显示指定代理
            $("#chooseAgent").on("click", function (e) {
                var val = $(this).val();
                if (val == 'appointAgent') {
                    $("#appointAgent").removeClass("hide");
                    $("._agent_added_length").removeClass("hide");
                    $("._agent_added_all").addClass("hide");
                } else {
                    $("#appointAgent").addClass("hide");
                    $("._agent_added_length").addClass("hide");
                    $("._agent_added_all").removeClass("hide");
                }
            });
        },
        //复制语系
        copyLanguage: function () {
            var $this = this;
            $(".co-gray").on("click", function (e) {
                var copy_language = $(this).attr("copy-language");
                var number = $("[language='" + copy_language + "']").prop("id").substr(4, 5);

                var title = $("input[name='title[" + number + "]']").val();
                var textarea = $("textarea[name='content[" + number + "]']").val();
                var title_number = $("input[name='title[" + number + "]']").next().text();
                var content_number = $("textarea[name='content[" + number + "]']").next().text();

                var current_id = $(".current").prop("id").substr(6, 7);
                $("input[name='title[" + current_id + "]']").val("");
                $("input[name='title[" + current_id + "]']").val(title);
                $("input[name='title[" + current_id + "]']").next().text(title_number);
                $("textarea[name='content[" + current_id + "]']").val("");
                $("textarea[name='content[" + current_id + "]']").val(textarea);
                $("textarea[name='content[" + current_id + "]']").next().text(content_number);
                $this.checkForNext();
            });
        },
        /**
         * 初始化输入框的文本事件
         */
        initEditContentEvent: function () {
            var $this = this;
            $(".p-r-70,.p-b-30").on("keyup", function () {
                $this.checkForNext();
            })
            $("._editTags a").on("click",function(){
                var $this = $(this);
                var $parent = $this.parent();
                var $tag = '$'+$this.children().text();
                var $contentId = $parent.attr("id");
                var $selector = "[name='"+$contentId+"']";
                var obj =$($selector);
                var startPos =  obj[0].selectionStart;
                var endPos =  obj[0].selectionEnd;
                var newValue= obj.val().substring(0, startPos) + $tag + obj.val().substring(endPos, obj.val().length);
                $(obj).val(newValue);
            })
        },
        /**
         * 判断输入框是否填写
         */
        checkForNext: function () {
            var checkTitle = true;
            var checkContent = true;
            $(".p-r-70").each(function (e) {
                if ($(this).val() == "") {
                    checkTitle = false;
                    return;
                }
            });

            $(".p-b-30").each(function () {
                if ($(this).val() == "") {
                    checkContent = false;
                    return;
                }
            });

            if (checkTitle && checkContent) {
                $(".sysNoticePreview").children().attr("disabled", false);
            } else {
                $(".sysNoticePreview").children().attr("disabled", true);
            }
        },
        /**
         * 进入预览前
         * @param e
         */
        sysNoticePreview: function (e) {
            var check = $("[name=agentNotice]").is(":checked");
            if(check){
                var group = $("[name='result.groupCode']").val();
                if(group=='appointAgent'){
                    var ids = $("[name=agentIds]").val();
                    if(ids!="" && ids!=null){
                        this.preview(e);
                    }else{
                        window.top.topPage.showWarningMessage("请选择指定代理商！");
                        $(e.currentTarget).unlock();
                    }
                }else{
                    this.preview(e);
                }
            }else{
                this.preview(e);
            }
        },
        /**
         * 进入预览
         * @param e
         */
        preview: function (e) {
            var data = window.top.topPage.getCurrentFormData(e);
            window.top.topPage.ajax({
                type: 'POST',
                url: root + "/vSysAnnouncement/sysNoticePreview.html",
                data: data,
                success: function (data) {
                    $("#mainFrame").html(data);
                }
            });
            $(e.currentTarget).unlock();
        },
        /**
         * 个人公告-添加代理(左侧移动到右侧)
         * @param e
         * @param opt
         */
        addAgent: function (e, opt) {
            var a = $("._addAgent").find("option:selected").remove();
            $("._agent_added").append(a);
            $("._agent_added").val('');
            this.countAgentLength();
            this.agentList();
            this.checkIsChooseUser("appointAgent");
            $(e.currentTarget).unlock();
        },
        /**
         * 个人公告-删除代理(右侧移动到左侧)
         * @param e
         * @param opt
         */
        removeAgent: function (e, opt) {
            var a = $("._agent_added").find("option:selected").remove();
            $("._addAgent").append(a);
            $("._addAgent").val('');
            this.countAgentLength();
            this.agentList();
            this.checkIsChooseUser("appointAgent");
            $(e.currentTarget).unlock();
        }, /**
         * 计算已添加的代理个数
         */
        countAgentLength: function () {
            var c = $("._agent_added").children().length;
            $("._agent_added_length").text(window.top.message.common['alreadyChoose']+c + window.top.message.common['severalAgent']);
        },
        agentList: function () {
            var agentStr = "";
            $("._agent_added").children().each(function () {
                if (agentStr != "") {
                    agentStr += ",";
                }
                agentStr += $(this).val();
            });
            var agentLi = agentStr.split(",");
            $("#_agent").val(agentLi);
        },
        checkIsChooseUser: function (type) {
            var btnNext = $(".nextStep");
            if (type == "appointAgent") {
                //appoint Agent/player check
                if ($("._master_added").find("option").length > 0 || $("._agent_added").find("option").length > 0) {
                    btnNext.attr("disabled", false);
                } else {
                    btnNext.attr("disabled", true);
                }
            }
        }


    });

});
