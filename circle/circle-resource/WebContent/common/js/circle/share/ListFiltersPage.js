define(['common/BaseEditPage','jsrender'], function(BaseEditPage) {
    return BaseEditPage.extend({

        $dataResult:null,
        init : function() {
            this._super();
            this.copyFilter();
            this.resetElement();
            this.changeButtonColor();
            this.clickItem();
            this.add();
            this.cancelCreate();
            this.editItem();
            this.deleteItem();
            this.deleteCondition();
            this.keyClassName=$("[name=keyClassName]").val();
        },

        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            this._super();
            this.add();
            $(".condition-wraper .add").trigger("click");
        },

        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
        },
        keyClassName:null,

        /**
         * 添加过滤条件
         */
        copyFilter:function() {
            var _this = this;
            $("#cloneCondition").on("click",function(){
                if($("div.cl").length>=5) {
                    // window.top.topPage.showInfoMessage(window.top.message.share['more.than']);  // "最多5个过滤条件"
                    $(this).addClass("disabled");
                    $("span.zd").css("display","");
                    return;
                }
                _this._copyTemplate();
            });
        },

        /**
         * 行模板拷贝
         * @private
         */
        _copyTemplate:function()
        {
            var _this = this;
            var $template=$("#template").clone(true).removeAttr("id");
            // select 需要根据chosen-select-no-single样式来绑定事件
            $(".chosen-select-no-single1",$template).removeClass('chosen-select-no-single1').addClass('chosen-select-no-single');
            $template.addClass("cl").insertBefore($("#columnOp"));
            this.initSelectOne($('.chosen-select-no-single', $template),'.chosen-select-no-single');
            if ($("#columnOp").css("display")!='none') {
                $(".condition-options-wraper.sx.cl").css("display","none");
                $(".condition-options-wraper.sx.cl").not("#template").slideToggle(200,function(){
                    page.resizeDialog();//添加筛选条件需重新调整dialog高度
                    // 重写绑定下拉框事件
                    _this.initSelect();
                });
            };
            $("input[type='text'],input[type='checkbox']",$template).on("change",function(){
                _this.fillDescription();
            });
            // _this.limitInputNum();
        },

        /**
         * 新增、编辑筛选
         */
        createNewFilter:function(e,options) {
            var _this = e.page;
            // 构建键值对象
            var sig = _this.getJsonData();

            window.top.topPage.ajax({
                url:root+'/share/filters/edit.html',
                contentType: 'application/json; charset=utf-8',
                dataType:'json',
                data:JSON.stringify(sig),   // 转json格式
                type:"POST",
                async:false,
                success:function(dataResult){
                    if (dataResult.code==='WARMING'){
                        window.top.topPage.showWarningMessage(window.top.message.share['more.than.ten']);
                    } else {
                        $("button[data-rel*='createNewFilter']").prev().val(dataResult.result.id);
                    }
                    _this.$dataResult = dataResult;
                }
            });
            $(e.currentTarget).unlock();
        },

        /**
         * 生成JSON数据
         */
        getJsonData:function() {
            // 构建键值对象
            var _this = this;
            var sig = {};
            sig.description = $("input[name='description']").val(); // 过滤条件名称

            sig.id = $("input[name='id']").val();   // 主键
            sig.classFullName=_this.keyClassName;   // 用于判断业务
            var jsonStr = "[";
            // 每行过滤条件 含有特有cl样式的div包裹
            $("div.cl").each(function(){
                var innerJson = "{";
                var tt = $(this).find("input[name=tabType]").val(); // 筛选条件property 类型 包括：日期类型、文本类型、下拉类型
                innerJson = innerJson+"'property':'"+$(this).find("input[name=property]").val()+"',";
                innerJson = innerJson+"'operator':'"+$(this).find("input[name=operator]").val()+"',";
                if (tt == "checkbox") {
                    var checkboxStr = "" ;
                    $(this).find("input[name=value]").each(function(){
                        if($(this).is(":checked")){
                            checkboxStr += $(this).val()+",";
                        }
                    })
                    if (checkboxStr!="")
                        checkboxStr = checkboxStr.substring(0,checkboxStr.length-1);
                    innerJson = innerJson+"'value':'"+checkboxStr+"',";
                } else {
                    innerJson = innerJson+"'value':'"+$(this).find("[name=value]").val()+"',";
                }
                innerJson = innerJson+"'nodeType':'"+$(this).find("input[name=tabType]").val()+"',";
                jsonStr = jsonStr+innerJson.substring(0,innerJson.length-1)+"},";
            });
            sig.content= jsonStr.substring(0,jsonStr.length-1)+"]";
            return sig;
        },

        /**
         * 取消--暂时无用
         */
        resetElement:function() {
            var _this = this;
            $("#resetElement").on("click",function(){
                // 删除原先所有条件
                $("div.cl").remove();
                _this._copyTemplate();
                $(this).addClass("btn-outline");
                $("input[name='id']").val('');
                $("input[name='description']").val("");
            });
        },

        /**
         * 变动下拉框、描述、名称 改变取消按钮样式
         */
        changeButtonColor:function() {
            $("select").on("change",function(){
                $("#resetElement").removeClass("btn-outline");
            });
            $("input[name='description']").on("keyup",function(){
                $("#resetElement").removeClass("btn-outline");
            });
            $("input[name='value']").on("keyup",function(){
                $("#resetElement").removeClass("btn-outline");
            });
        },

        /**
         * 点击、鼠标移动时间
         * 筛选条件行行增加样式
         */
        clickItem:function(){
            var _this = this;
            $("ul.condition li").on("click",function(){
                $(this).parent("ul.condition").children().removeClass("click");
                $(this).addClass("click");
            });

            $("ul.condition li").on("mouseover",function(){
                $(this).children(".edit").show();
            });
            $("ul.condition li").on("mouseleave",function(){
                $(this).children(".edit").hide();
            });
        },

        /**
         * 点击筛选条件的 修改图标
         */
        editItem:function(){
            var _this = this;
            $("ul.condition li i.fa-edit").on("click",function(){
                // 获取模板筛选记录隐藏域ID
                var id = $(this).parent().parent().parent().children("input:last-child").val();
                // 根据ID后台ajax 返回筛选json格式内容
                _this.getItem(id,function(jsonObj){
                    // 填充描述内容
                    $("input[name='description']").val(jsonObj.result.description);
                    // 标识是否是保存or更新
                    $("input[name='id']").val(jsonObj.result.id);
                    // 按条件筛选数组
                    var arr = eval("("+jsonObj.result.content+")");
                    $("div.cl").remove();
                    for(var i=0;i<arr.length;i++) {
                        var divObj = $("#template").clone(true).css("display","block").addClass("cl").removeAttr("id").removeClass("condition-options-wraper");
                        $(divObj).find("select[name='property']").val(arr[i].property);
                        _this.changeEvent($(divObj).find("select[name='property']"),arr[i].property);
                        $(divObj).find("select[name='operator']").val(arr[i].operator);
                        var nodeType = arr[i].nodeType;
                        if (nodeType=='checkbox') {
                            $(divObj).find("input[name='value']").each(function(){
                                var qvAry = arr[i].value.split(",");
                                var _thisChk = this;
                                $(qvAry).each(function(i,con){
                                    if (qvAry[i]==$(_thisChk).val()) {
                                        $(_thisChk).attr("checked",true);
                                    }
                                })
                            });
                        } else if(nodeType=='text') {
                            $(divObj).find("input[name='value']").val(arr[i].value);
                        } else if(nodeType=='select') {
                            $(divObj).find("select[name='value']").val(arr[i].value);
                        } else if(nodeType=='date') {
                            $(divObj).find("input[name='value']").siblings("input").val(arr[i].value);
                            $(divObj).find("input[name='value']").val(arr[i].value);
                        }
                        $(divObj).find("input[name='tabType']").val(nodeType);
                        $(divObj).insertBefore($("#cloneCondition").parent());
                        /*if (nodeType=='text') {
                             _this.limitInputNum();
                        }*/
                        $('.chosen-select-no-single1', divObj).removeClass('chosen-select-no-single1').addClass('chosen-select-no-single');
                        _this.initSelectOne($('.chosen-select-no-single', divObj),'.chosen-select-no-single');
                        $("#cloneCondition").parent().parent().show(0,function(){
                            page.resizeDialog();
                        });
                    }
                    // _this.selectChange();
                    _this.changeCheck(false);
                });
            });
        },

        /**
         * 改变复选框状态
         * @param state
         */
        changeCheck:function(state) {
            $("#saveCk").prop("checked",state);
           /* if (state) {
                $("#saveCk").attr("disabled","disabled");
            } else {
                $("#saveCk").removeAttr("disabled");
            }*/
        },

        /**
         * 根据主键值、筛选业务条件获取该筛选条件的完整信息
         * @param id
         * @param callback
         */
        getItem:function(id,callback)
        {
            var _this=this;
            window.top.topPage.ajax({
                url:root+"/share/filters/singleContent.html",
                type:"POST",
                data:{id:id,keyClassName:_this.keyClassName},
                dataType:"json",
                success:function(data){
                    var jsonObj = eval(data);
                    callback(data);
                }
            });
        },

        /**
         * 点击删除筛选条件图标
         */
        deleteItem:function(){
            var _this = this;
            $("ul.condition li i.fa-trash-o").on("click",function(){
                var _deleteRow = $(this).parent().parent().parent();
                var id = $(this).parent().parent().parent().children("input:last-child").val();
                window.top.topPage.showConfirmMessage(window.top.message.share['confirm.delete'],function(result){
                   if (result) {
                       window.top.topPage.ajax({
                           dataType:'json',
                           url:root+"/share/filters/delete.html",
                           type:"POST",
                           data:{id:id,keyClassName:_this.keyClassName},
                           success:function(data){
                               if(data.state) {
                                   $(_deleteRow).remove();
                                   if ($("ul.condition-scroll").children("li").length<1) {
                                       $("ul.condition").addClass("no-content_wrap");
                                       $("#nofilters").css("display","block");
                                   }
                                   $("#resetElement").click();
                                   window.top.topPage.showSuccessMessage(window.top.message.common['delete.success']);
                               }
                               else{
                                   window.top.topPage.showErrorMessage(window.top.message.common['delete.failed']);
                               }
                           }
                       });
                   }
                });
            });
        },

        /**
         * 删除单个筛选条件
         */
        deleteCondition: function () {
            var _this = this;
            $("a.recover i").on("click",function(){
                if ($(".condition-options-wraper.sx.cl").length>1) {
                    $(this).parents("div.condition-options-wraper.sx.cl").remove();
                    _this.fillDescription();
                    $("#cloneCondition").removeClass("disabled")
                    $("span.zd").css("display")=='none'?'':$("span.zd").css("display","none");
                    page.resizeDialog();
                } else {
                    window.top.topPage.showWarningMessage(window.top.message.share['last.filter.unable.delete']);
                    return;
                }
            });
        },

        /**
         * 创建新的筛选条件
         */
        add:function(){
            var _this = this;
            $(".condition-wraper .add").on("click",function(){
                $(this).hide();
                $(".cancel-create").show();
                $("span.zd").hide();
                $("div.cl").remove();
                _this._copyTemplate();
                if ($('[name="tabType"]').val()=='select')
                    _this.fillDescription();
                else
                    $("input[name='description']").val("");
                $("input[name='id']").val('');
                if ($("#columnOp").css("display")=='none')
                    $(".condition-options-wraper.sx").not("#template").slideToggle(200,function(){
                        page.resizeDialog();
                        _this.initSelect();
                    });
                $("#condition").text("按条件筛选");
            })
        },

        /**
         * 取消创建
         */
        cancelCreate:function(){
            var _this = this;
            $(".condition-wraper .cancel-create").on("click",function(){
                $(this).hide();
                $(".condition-options-wraper.sx").not("#template").slideToggle(200,function(){
                    $(".add").show(10,function()
                    {
                        page.resizeDialog();
                        _this.initSelect();
                    });
                });
                _this.changeCheck(false);
                $("#condition").text("用模板筛选");
            })
        },

        /**
         * 筛选条件第一列的下拉框点击事件
         */
        selectChange:function(event,option){
            this.changeEvent(event);
            this.fillDescription();
        },

        /**
         * 分别传入事件源对象
         * @param event
         */
        changeEvent:function(event,property) {
            var _this = event.currentTarget||event;
            var arr = eval("("+jsonList+")");
            var selectColumn = $(_this).attr("key")||property;
            $.each(arr,function (index,content) {
                if (selectColumn==content.property) {
                    var compareAry = eval(content.compare);
                    var secondSelect = $(_this).parents("div.wjcj").next();
                    var thirdDiv = $(_this).parents("div.wjcj").next().next();
                    $(secondSelect).empty();
                    $(secondSelect).append('<select class="btn-group chosen-select-no-single" name="operator" callback="reFillDescription"></select>');
                    $.each(compareAry,function(comIndex,comContent){
                        $(secondSelect).children().append('<option value="'+comContent.key+'">'+comContent.value+'</option>');
                    });
                    var tabType = content.tabType;
                    $(thirdDiv).empty();
                    // $(thirdDiv).removeClass("s-condition-3");
                    if (tabType=='text') {
                        $(thirdDiv).append('<input type="text" class="form-control" value="" name="value"/>');
                        $(thirdDiv).removeClass("s-condition-3").addClass("s-condition-2");
                        $("input",thirdDiv).on("change",function(){
                            event.page.fillDescription();
                        });
                        // page.limitInputNum();
                    } else if (tabType=='checkbox') {
                        var values = eval(content.values);
                        $(thirdDiv).removeClass("s-condition-2").addClass("s-condition-3");
                        values && $.each(values,function(vi,vvs){
                            $(thirdDiv).append('<input type="checkbox" class="i-checks" value="'+vvs.key+'" name="value"/><span>'+vvs.value+"</span>&nbsp;&nbsp;");
                        });
                        $("input[type='checkbox']",thirdDiv).on("change",function(){
                            event.page.fillDescription();
                        });
                    } else if (tabType=='date') {
                        var $clone_date = $("#dateTemp").parent().removeAttr("id").clone().css("display","");
                        $($clone_date).children("input").removeAttr("id");
                        $(thirdDiv).removeClass("s-condition-3").addClass("s-condition-2");
                        $(thirdDiv).append($clone_date);
                        event.page.initDatePick($clone_date);
                    } else if (tabType=='select') {
                        var values = eval(content.values);
                        $(thirdDiv).append('<select class="btn-group chosen-select-no-single" name="value" callback="reFillDescription"></select>');
                        values && $.each(values,function(vi,vvs){
                            $(thirdDiv).children().append('<option value="'+vvs.key+'">'+vvs.value+'</option>');
                        })
                    } else if (tabType=='regions') {
                        var $clone_regions = $("div.regions").clone().removeClass("regions").css("display","");
                        $(thirdDiv).removeClass("s-condition-2").addClass("s-condition-3");
                        $(thirdDiv).append($clone_regions);
                    }
                    page.initSelect();
                    $(thirdDiv).siblings("input[name=tabType]").val(tabType);
                }
            });
        },

        /**
         * 筛选按钮函数
         * @param e
         * @param options
         */
        goFilter:function(e,options){
            var _this=this;
            var id= $("[name='id']").val()||$("ul.condition li.click input").val();
            // 4中情况，1、有按条件筛选没有选中“同时保存为模板”复选框；2、有按条件筛选有选中“同时保存为模板”复选框；3、没按条件筛选有选中历史查询记录；4、没按条件筛选又没选中历史记录的，警告
            var cc = $(".condition-wraper .cancel-create").css("display");
            if (!$("#saveCk").is(":checked") && cc!='none'){
                var _data = {'result':_this.getJsonData()};
                _this.$dataResult = _data;
                _this.goFilterCallBack(_this.$dataResult,e,options);
            } else if(cc!='none' && $("#saveCk").is(":checked")){
                $("button[data-rel*='createNewFilter']").trigger("click");
                id = $("button[data-rel*='createNewFilter']").prev().val();
                if (id==null||id=="") {
                    window.top.topPage.showWarningMessage(window.top.message.share['save.filter.fail']);
                    $(e.currentTarget).unlock();
                    return;
                }
                _this.goFilterCallBack(_this.$dataResult,e,options);

            } else if (cc=='none' && !!id) {
                this.getItem(id,function(data){
                    _this.goFilterCallBack(data,e,options);
                });
            } else {
                window.top.topPage.showWarningMessage(window.top.message.share['choose.one']);
                $(e.currentTarget).unlock();
                return;
            }

        },

        goFilterCallBack:function(data,e,options) {
            var arr = eval("("+jsonList+")");
            data.result.content = eval("("+data.result.content+")");
            for(var i=0;i<data.result.content.length;i++) {
                var tempOne=data.result.content[i];
                for(var j=0;j<arr.length;j++) {
                    if(arr[j].property==tempOne.property) {
                        tempOne.propertyName =arr[j].propertyName;
                        for(var k=0;k<arr[j].compare.length;k++) {
                            if(arr[j].compare[k].key==tempOne.operator) {
                                tempOne.operatorName =arr[j].compare[k].value;
                                break;
                            }
                        }
                        if(arr[j].values && arr[j].values.length>0) {
                            var values=tempOne.value?tempOne.value.split(","):[];
                            for (var k = 0; k < arr[j].values.length; k++) {
                                for (var l = 0; l < values.length; l++) {
                                    if (arr[j].values[k].key == values[l]) {
                                        if(tempOne.text){
                                            tempOne.text += ","+arr[j].values[k].value;
                                        }else{
                                            tempOne.text = arr[j].values[k].value;
                                        }
                                    }
                                }

                            }
                        }else{
                            tempOne.text = tempOne.value;
                        }
                        break;
                    }
                }
                data.result.content[i]=tempOne;
            }
            this.returnValue=data;
            this.closePage(e,options)
        },


        /**
         * 限制文本只能输入数字
         */
        /*limitInputNum: function() {
            $("input[type=text]").not("[name=description]").keyup(function(){
                $(this).val($(this).val().replace(/\D|^0/g,''));
                $(this).val().length>15?$(this).val($(this).val().substring(0,14)):'';
            }).bind("paste", function(){
                $(this).val($(this).val().replace(/\D|^0/g,''));
                $(this).val().length>15?$(this).val($(this).val().substring(0,14)):'';
            });
        },*/

        /**
         * 保存或更新前验证
         * @param e   事件对象
         * @return 验证是否通过
         */
        _validateForm: function(e) {
            var _this = this;
            var isPass = true;
            var errorIndex;
            var $rowList = $("div.cl");
            reg = /^(?!(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
            for(var index=0;index<$rowList.size();index++) {
                var tt = $($rowList[index]).find("input[name=tabType]").val(); // 筛选条件property 类型 包括：日期类型、文本类型、下拉类型

                if (tt == "checkbox") {
                    var checkboxStr = "" ;
                    $($rowList[index]).find("input[name=value]").each(function(){
                        if($(this).is(":checked")){
                            checkboxStr += $(this).val()+",";
                        }
                    })
                    if (!checkboxStr) {
                        isPass = false;
                        errorIndex = index;
                        $($rowList[index]).find("input[name=value]").parent().formtip(window.top.message.share['value.empty']);
                        break;
                    }
                } else if (tt == 'text'){
                    var textVal =$($rowList[index]).find("[name=value]").val();
                    if (!textVal) {
                        isPass = false;
                        errorIndex = index;
                        $($rowList[index]).find("input[name=value]").parent().formtip(window.top.message.share['value.empty']);
                        break;
                    } else if (!reg.test(textVal)){
                        isPass = false;
                        errorIndex = index;
                        $($rowList[index]).find("input[name=value]").parent().formtip(window.top.message.share['value.regNum']);
                        break;
                    }

                } else {
                    var textVal =$($rowList[index]).find("[name=value]").val();
                    if (!textVal) {
                        isPass = false;
                        errorIndex = index;
                        $($rowList[index]).find("input[name=value]").parent().formtip(window.top.message.share['value.empty']);
                        break;
                    }
                }
            }
            if (!$("input[name='description']").val()) {
                window.top.topPage.showWarningMessage(window.top.message.share['name.empty']);
                return false;
            }
            if (!isPass) {
                var msg = (window.top.message.share['filter.meet.condition']).replace("{0}",errorIndex+1);
                window.top.topPage.showWarningMessage(msg);
                return false;
            }

            var $form = $(window.top.topPage.getCurrentForm(e));
            return !$form.valid || $form.valid();
        },

        /**
         * 填充名称
         */
        fillDescription:function() {
            var description = "";
            $("div.cl").each(function(){
                var tt = $(this).find("input[name=tabType]").val(); // 筛选条件property 类型 包括：日期类型、文本类型、下拉类型
                description += $(this).find("input[name=property]").parents("div.wjcj").find("span[prompt='prompt']").text();
                description += $(this).find("input[name=operator]").parents("div.wjcj").find("span[prompt='prompt']").text();
                if (tt == "checkbox") {
                    var checkboxStr = "" ;
                    $(this).find("input[name=value]").each(function(){
                        if($(this).is(":checked")){
                            checkboxStr += $(this).next().text()+",";
                        }
                    })
                    if (checkboxStr!="")
                        checkboxStr = checkboxStr.substring(0,checkboxStr.length-1);
                    description += checkboxStr;
                } else if(tt=="text" || tt=="date") {
                    description += $(this).find("[name=value]").val();
                } else if (tt=="select") {
                    description += $(this).find("input[name=value]").parents("div.wjcj").find("span[prompt='prompt']").text();
                }
                description +=";";
            });
            $("input[name='description']").val(description);
        },

        /**
         * 日期控件回调函数
         * @param e
         * @param option
         */
        reFillDescription:function(e,option) {
            this.fillDescription();
        },

    });
});