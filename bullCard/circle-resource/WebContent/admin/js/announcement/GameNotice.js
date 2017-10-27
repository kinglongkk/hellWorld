define(['common/BaseEditPage','UE'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            var editor =new UE.ui.Editor();
            editor.render("container");
            this._super();
        },

        onPageLoad: function () {
            this._super();
            this.copyLanguage();//复制语系
            this.initEditContentEvent();//初始化输入框的文本事件
            this.checkForNext();//判断输入框是否填写
            var ue = UE.getEditor('container');
            var contentMesId = document.getElementById("ContentMes111");
            ue.addListener('blur',function(){
                var content = ue.getContentTxt().trim();
                if(content==""){
                    contentMesId.style.display='block';
                    setTimeout(function () {
                        contentMesId.style.display='none';
                    },5000);
                }
            });

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
                var title_len = $("input[name='result.title']").val().length;
                $(".msg" + i).html(title_len + "/100");
                if (title_len > 0) {
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
                        // var content = $("textarea[name='content[" + this_id + "]']").val();
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

            //判断是否显示 重复时间
            $("[name='result.repeat']").on("click", function (e) {
                var isTrue = $(this).val();
                if("true"==isTrue){
                    document.getElementById("divRepeat").style.display="";
                }else {
                    document.getElementById("divRepeat").style.display='none';
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
        },

        //复制语系
        copyLanguage: function () {
            var $this = this;
            $(".co-gray").on("click", function (e) {
                var copy_language = $(this).attr("copy-language");
                var number = $("[language='" + copy_language + "']").prop("id").substr(4, 5);
                var title = $("input[name='result.title']").val();
                var title_number = $("input[name='result.title']").next().text();
                var current_id = $(".current").prop("id").substr(6, 7);
                $("input[name='result.title']").val("");
                $("input[name='result.title']").val(title);
                $("input[name='result.title']").next().text(title_number);
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
         * 时间间隔效验
         */
        checkTimeValue:function () {
            var repeatTime = document.getElementById("repeatTime").value;
            var repeatUnit = document.getElementById("repeatUnit").value;
            if(repeatUnit=="20" && repeatTime>23){
                var timeMes = document.getElementById("timeMes");
                timeMes.style.display='block';
                setTimeout(function () {
                    timeMes.style.display='none';
                },3000);
            }
            else if(repeatUnit=="30" && repeatTime>59){
                var timeMes = document.getElementById("timeMes");
                timeMes.style.display='block';
                setTimeout(function () {
                    timeMes.style.display='none';
                },3000);
            }else if(repeatUnit=="40" && repeatTime>59){
                var timeMes = document.getElementById("timeMes");
                timeMes.style.display='block';
                setTimeout(function () {
                    timeMes.style.display='none';
                },3000);
            }else{
                timeMes.style.display='none';
            }
        },

        /**
         * 判断输入框是否填写
         */
        checkForNext: function () {
            var checkTitle = true;
            $(".p-r-70").each(function (e) {
                    if ($(this).val() == "") {
                    checkTitle = false;
                    return;
                }
            });

            if (checkTitle) {
                $(".gameNoticePreview").children().attr("disabled", false);
            } else {
                $(".gameNoticePreview").children().attr("disabled", true);
            }
        },

        /**
         * 进入预览前
         * @param e
         */
        gameNoticePreview: function (e) {
            this.preview(e);
        },

        /**
         * 进入预览
         * @param e
         */
        preview: function (e) {
            this.checkForNext();
            var data = window.top.topPage.getCurrentFormData(e);
            window.top.topPage.ajax({
                type: 'POST',
                url: root + "/vGameAnnouncement/gameNoticePreview.html",
                data: data,
                success: function (data) {
                    $("#mainFrame").html(data);
                }
            });
            $(e.currentTarget).unlock();
        }

    });

});
