define(['common/BasePage', 'nestable'], function (BasePage, nestable) {
    return BasePage.extend({
        init: function () {
            var _this = this;
            this.select();
            this.nestable();
            this.addList(_this);
            this.defaultOperator();
            this.save();
            //this.deleteFa();
            this.zsListTitle();
            var defaults = {
                listNodeName: 'ul',
                itemNodeName: 'li',
                rootClass: 'dd',
                listClass: 'dd-list',
                itemClass: 'dd-item',
                dragClass: 'dd-dragel',
                handleClass: 'dd-handle',
                collapsedClass: 'dd-collapsed',
                placeClass: 'dd-placeholder',
                noDragClass: 'dd-nodrag',
                emptyClass: 'dd-empty',
                expandBtnHTML: '<button data-action="expand" type="button">Expand</button>',
                collapseBtnHTML: '<button data-action="collapse" type="button">Collapse</button>',
                group: 0,
                maxDepth: 1,
                threshold: 20
            };
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            this._super();
            $(".zs_list_title .fa-trash-o").hide();
            $(".zs_list_title").mouseover(function () {
                $(".zs_list_title .fa-trash-o").show();
            });
            $(".zs_list_title").mouseleave(function () {
                $(".zs_list_title .fa-trash-o").hide();
            });

        },
        //选中/删除列表中选项
        select: function () {
            $('[name=content]').each(function () {
                var tar = $('#default1').children();
                $(this).click(function (e) {
                    //做标记
                    if (this.checked) {
                        var length = $(e.currentTarget).parent().parent().parent().find("input[type='checkbox']:checked").length;//默认column
                        var showLength = $(".zs_list_title").length;//总共几列
                        //每列下有多少个字段
                        var default3Length = $("#default3").children("ul").children().length-1;
                        var default2Length = $("#default2").children("ul").children().length-1;
                        var default1Length = $("#default1").children("ul").children().length-1;
                        var lihtml = '<li class="dd-item" data-value="' + $(this).attr("data-val") + '"><a class="dd-handle">' + $(this).parent().text() + '</a></li><li class="dd-item empty-item"></li>';

                        if ((showLength - 1) == 3) {
                            if (default1Length == 10 && default2Length == 10 && default3Length < 10) {
                                var ulObj = $("#default3").children("ul");
                                var liObj = ulObj.find(".empty-item");
                                liObj.remove();
                                $(lihtml).appendTo(ulObj);
                                //$('<li class="dd-item" data-value="' + $(this).attr("data-val") + '"><a class="dd-handle">' + $(this).parent().text() + '</a></li>').appendTo($("#default3").children("ul"));
                            }
                            if (default1Length == 10 && default2Length < 10) {
                                var ulObj = $("#default2").children("ul");
                                var liObj = ulObj.find(".empty-item");
                                liObj.remove();
                                $(lihtml).appendTo(ulObj);
                                //$('<li class="dd-item" data-value="' + $(this).attr("data-val") + '"><a class="dd-handle">' + $(this).parent().text() + '</a></li>').appendTo($("#default2").children("ul"));
                            }
                            if (default1Length < 10) {
                                var ulObj = $("#default1").children("ul");
                                var liObj = ulObj.find(".empty-item");
                                liObj.remove();
                                $(lihtml).appendTo(ulObj);
                                //$('<li class="dd-item" data-value="' + $(this).attr("data-val") + '"><a class="dd-handle">' + $(this).parent().text() + '</a></li>').appendTo($("#default1").children("ul"));
                            }

                            if (length > 26) {
                                $(this).prop("checked", false);
                                window.top.topPage.showWarningMessage(message.share['name.maxField']);
                                return;
                            }
                        }
                        if ((showLength - 1) == 2) {
                            if (default1Length == 10 && default2Length < 10) {
                                var ulObj = $("#default2").children("ul");
                                var liObj = ulObj.find(".empty-item");
                                liObj.remove();
                                $(lihtml).appendTo(ulObj);
                                //$('<li class="dd-item" data-value="' + $(this).attr("data-val") + '"><a class="dd-handle">' + $(this).parent().text() + '</a></li>').appendTo($("#default2").children("ul"));
                            }
                            if (default1Length < 10) {
                                var ulObj = $("#default1").children("ul");
                                var liObj = ulObj.find(".empty-item");
                                liObj.remove();
                                $(lihtml).appendTo(ulObj);
                                //$('<li class="dd-item" data-value="' + $(this).attr("data-val") + '"><a class="dd-handle">' + $(this).parent().text() + '</a></li>').appendTo($("#default1").children("ul"));
                            }
                            if (length > 18) {
                                $(this).prop("checked", false);
                                window.top.topPage.showWarningMessage(message.share['name.maxField']);
                                return;
                            }
                        }
                        if ((showLength - 1) == 1) {
                            if (default1Length < 10) {
                                var ulObj = $("#default1").children("ul");
                                var liObj = ulObj.find(".empty-item");
                                liObj.remove();
                                $(lihtml).appendTo(ulObj);
                            }
                            if (length > 10) {
                                $(this).prop("checked", false);
                                window.top.topPage.showWarningMessage(message.share['name.maxField']);
                                return;
                            }
                        }
                    }
                    if (!this.checked) {
                        var len = $('.dd-item').length;
                        var child;
                        for (var i = 0; i < len; i++) {
                            child = $('.dd-item')[i];
                            if ($(this).attr("data-val") == $(child).attr("data-value")) {
                                $(child).remove();
                            }
                        }
                    }


                });
            });
        },
        serializeObject: function () {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },
        //拖曳排序
        nestable: function () {
            $('#default1').nestable({
                expandBtnHTML: '',
                collapseBtnHTML: '',
                collapsedClass: '',
                placeClass: '',
                group: 1,
                maxDepth: 1
            });
            $('#default2').nestable({
                expandBtnHTML: '',
                collapseBtnHTML: '',
                collapsedClass: '',
                placeClass: '',
                group: 1,
                maxDepth: 1
            });
            $('#default3').nestable({
                expandBtnHTML: '',
                collapseBtnHTML: '',
                collapsedClass: '',
                placeClass: '',
                group: 1,
                maxDepth: 1
            });
        },
        //添加新列表
        addList: function (_this) {
            $("#add_List").on("click", function () {
                var dataMsg = $(this).attr("new-Table-msg");
                var length = $(".table_row").length;
                if (length == 3) {
                    $(this).attr("disabled", true);
                }
                if ($("#default2").text() == "") {
                    $("#default2").append($(".trigger").children().clone());
                    $("#default2 div").removeClass('trigger');
                    $("#default2 ul").attr("class", "zs_list dd-list ul-list");
                    $("#default2 label").attr("class", "zs_list_title table_row").attr("rel-data", dataMsg);
                } else {
                    if ($("#default3").text() == "") {
                        $("#default3").append($(".trigger").children().clone());
                        $("#default3 div").removeClass('trigger');
                        $("#default3 ul").attr("class", "zs_list dd-list ul-list");
                        $("#default3 label").attr("class", "zs_list_title table_row").attr("rel-data", dataMsg);
                        $(".add_List").attr("disabled", true);
                    }
                }
                /*if(length==2){
                 $("#default3").append($(".trigger").children().clone());
                 $("#default3 div").removeClass('trigger');
                 $("#default3 ul").attr("class","zs_list dd-list ul-list");
                 $("#default3 label").attr("class","zs_list_title table_row").attr("rel-data",dataMsg);
                 $(".add_List").attr("disabled",true);
                 }
                 if(length==1){
                 $("#default2").append($(".trigger").children().clone());
                 $("#default2 div").removeClass('trigger');
                 $("#default2 ul").attr("class","zs_list dd-list ul-list");
                 $("#default2 label").attr("class","zs_list_title table_row").attr("rel-data",dataMsg);
                 }
                 if(length==0){
                 $("#default1").append($(".trigger").children().clone());
                 $("#default1 div").removeClass('trigger');
                 $("#default1 ul").attr("class","zs_list dd-list ul-list");
                 $("#default1 label").attr("class","zs_list_title table_row").attr("rel-data",dataMsg);
                 }*/
                _this.deleteFa();
                _this.zsListTitle();
            });
        },
        //恢复默认
        defaultOperator: function () {
            $("#defaultOperator").on("click", function () {
                var cleanMsg = $(this).attr("cleanMsg");
                var defaultTableMsg = $(this).attr("default-table-msg");

                window.top.topPage.showConfirmMessage(cleanMsg, function (result) {
                    if (result) {
                        $(".zs_list_title").each(function () {
                            var id = $(this).attr("rel-id");
                            if (id != null && id != undefined && id != "") {
                                window.top.topPage.ajax({
                                    url: root + "/share/columns/deleteOperator.html",
                                    type: "post",
                                    sync: false,
                                    data: {"result.id": id, "keyClassName": $("[name=keyClassName]").val()},
                                    dataType: "json",
                                    success: function (data) {
                                        if (data.state) {
                                            /*$("#default1 label").removeAttr("rel-id");
                                             $("#default1 ul").removeAttr("data-id");
                                             $("#default1 ul").html($(".trigger ul li").clone());
                                             $("#default1 label").attr("rel-data", defaultTableMsg);
                                             $("#default1 label").html(defaultTableMsg);
                                             $("#default2").html('');
                                             $("#default3").html('');*/
                                            var length = $(".zs_list_title").length;
                                            if (length < 3) {
                                                $("#add_List").attr("disabled", false);
                                            }
                                            window.page.loadMoreData();
                                        }
                                        else {
                                            window.top.topPage.showErrorMessage(message.common['delete.failed']);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        },
        //删除列
        deleteFa: function () {
            $(".fa-trash-o").unbind();
            $(".fa-trash-o").on("click", function (e) {
                var _this = this;
                var defaults = $(_this).parent().attr("list-default");
                if (defaults == "defaults") {

                } else {
                    window.top.topPage.showConfirmDynamic(window.top.message.player['column.deleteColumn'], window.top.message.player['column.yesOrNo'], window.top.message.setting['common.ok'], window.top.message.setting['common.cancel'], function (confirm) {
                        if (confirm) {
                            var id = $(_this).parent().attr("rel-id");
                            window.top.topPage.ajax({
                                url: root + "/share/columns/deleteOperator.html",
                                type: "post",
                                dataType: "json",
                                data: {"result.id": id, "keyClassName": $("[name=keyClassName]").val()},
                                success: function (data) {
                                    if (data.state == false) {
                                        window.top.topPage.showErrorMessage(data.msg);
                                    }
                                    else {
                                        window.page.loadMoreData();
                                    }
                                },
                                error: function (data) {
                                }
                            });

                            $(_this).parent().parent().html('');
                            var length = $(".zs_list_title").length;
                            if (length < 3) {
                                $("#add_List").attr("disabled", false);
                            }
                        }

                    });

                }

            });
        },
        //双击修改列名称
        zsListTitle: function () {
            var _this = this;
            $(".zs_list_title").dblclick(function () {
                $(this).removeClass().addClass("zs_list_title table_row");//标记特殊的title在下面.each循环中使用到
                var id = $(this).attr("rel-id");
                var value = $(this).text();
                if (id == "" || id == undefined) {
                    $(this).html("<input style='width: 89px;height: 32px;' type='text'  value=" + value + ">");
                } else {
                    $(this).html("<input style='width: 89px;height: 32px;' type='text'  id=" + id + " value=" + value + ">");
                }
                var rel = null;
                $(".zs_list_title > input").focus().blur(function () {
                    var editval = $(this).val();//获取更改内容
                    if (editval == undefined || editval == "") {
                        $(this).parent().attr("rel-data", "");
                        window.top.topPage.showWarningMessage(message.share['name.empty']);
                        return false;
                    }
                    /*if (editval.length > 8) {
                        window.top.topPage.showWarningMessage(message.share['column.title.length']);
                        return false;
                    }
*/
                    $(".font-noraml").each(function (index, obj) {
                        var relData = $(this).attr("rel-data");
                        if (editval == relData) {
                            window.top.topPage.showWarningMessage(message.share['name.existed']);
                            rel = 1;
                            return false;
                        }
                    });
                    if (rel == 1) {
                        $(this).parent().attr("rel-data", value);
                        $(this).parent().html(value + '<i class="fa fa-trash-o"></i>');
                    } else {
                        var is_default1 = $(this).parent().parent().prop("id");
                        if (is_default1 == "default1") {
                            $(this).parent().attr("rel-data", editval);
                            $(this).parent().html(editval);
                        } else {
                            $(this).parent().attr("rel-data", editval);
                            $(this).parent().html(editval + '<i class="fa fa-trash-o"></i>');
                        }
                    }

                    $(".zs_list_title").removeAttr("special-title");
                    _this.deleteFa();
                })

            });
        },
        //完成设置
        save: function () {
            $("#submit").on("click", function () {
                var tar = $('.ul-list');
                var hand = {};
                var item;
                var sig = {};
                var data = new Array();
                var items = new Array();
                for (var i = 0; i < tar.length; i++) {
                    items = new Array();
                    sig = {};
                    var ul = $(tar)[i];
                    var $ul = $(ul);
                    var li = $ul.children('li');
                    var idx = 0;
                    for (var j = 0; j < li.length; j++) {
                        item = $(li)[j];
                        var name = $(item).attr("data-value");
                        if(!name){
                            continue;
                        }
                        hand.order = j;
                        hand.name = name;
                        items[idx] = hand;
                        hand = {};
                        idx ++;
                    }
                    sig.id = $ul.attr("data-id");
                    sig.classFullName = $("[name=keyClassName]").val();
                    sig.content = JSON.stringify(items);
                    sig.id = $ul.attr("data-id");
                    sig.isDefault = $ul.attr("data-default");
                    sig.description = $ul.prev(".zs_list_title").attr("rel-data");
                    var sub = true;
                    if(sig.description!=""){
                        data.forEach(function (obj) {
                            var relData = $ul.prev(".zs_list_title").attr("rel-data");
                            if (obj.description === relData) {
                                window.top.topPage.showWarningMessage(message.share['name.existed']);
                                sub = false;
                                return;
                            }
                            if (relData == undefined || relData === "") {
                                window.top.topPage.showWarningMessage(message.share['name.empty']);
                                sub = false;
                                return;
                            }
                            /*if (relData.length > 8) {
                                window.top.topPage.showWarningMessage(message.share['column.title.length']);
                                sub = false;
                                return;
                            }*/
                        });
                        data.push(sig);
                    }else{
                        window.top.topPage.showWarningMessage(message.share['name.empty']);
                        sub = false;
                        return;
                    }

                }
                if (sub) {
                    window.top.topPage.ajax({
                        url: root + "/share/columns/saveOperator.html",
                        contentType: 'application/json; charset=utf-8',
                        dataType: "json",
                        data: JSON.stringify({"entities": data, "keyClassName": $("[name=keyClassName]").val()}),
                        type: 'POST',
                        success: function (data) {
                            if (data.state) {
                                window.top.topPage.showSuccessMessage(data.msg, function () {
                                    window.top.page.loadMoreData();
                                });
                            } else {
                                window.top.topPage.showErrorMessage(data.msg);
                            }
                        }
                    })
                }
            });
        }
    });
});