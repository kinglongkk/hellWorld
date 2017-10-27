
define(['common/BasePage', 'common/Pagination', 'validate','validateExtend'], function(BasePage, Pagination) {

    return BasePage.extend({
        funMoreMenu:".wrapper .function-menu-show",
        pagination : null,
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init : function(formSelector) {
            this.formSelector = this.formSelector || formSelector ||"#mainFrame form";
            this.pagination = new Pagination(this.formSelector);
            this._super(this.formSelector);
            this.moreData();
        },
        /**
         * 页面加载事件函数
         */
        onPageLoad: function () {
            this._super();
            //自定义下拉选择事件
            this.pagination.processOrderColumnTag(this);
            $(this.formSelector +" .search-wrapper [selectDiv]").attr("callback","selectListChange");
            this.bindFormValidation();
            this.checkNoRecords();
            this.toolBarCheck({currentTarget:$(this.formSelector)[0]});
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
            var _this=this;
            //绑定所有table的列头选择事件
            $(this.formSelector).on("click","table thead input[type=checkbox]", function (e) {
                e.page=_this;
                $("tbody input[type=checkbox]",_this.getFirstParentByTag(e,"table")).each(function(node,obj) {
                    var $this=$(obj);
                    if (e.currentTarget.checked && !$this.prop("disabled")) {
                        $this.parents('tr').addClass('open');
                    }
                    else
                    {
                        $this.parents('tr').removeClass('open');
                    }
                    if(!$this.prop("disabled")) {
                        obj.checked = e.currentTarget.checked;
                    }
                });
                _this.toolBarCheck(e);

            });
            //绑定所有table的列头选择事件
            $(this.formSelector).on("click","table tbody input[type=checkbox]", function (e) {
                e.page=_this;
                var $this=$(this);
                if ($this.prop("checked")) {
                    $this.parents('tr').addClass('open');
                }
                else
                {
                    $this.parents('tr').removeClass('open');
                }
                if($this.prop("checked")) {
                    $this.attr("checked", "checked")
                }
                else{
                    $this.removeAttr("checked")
                }
                var $theadCheckBox = $('table thead input[type=checkbox]',_this.getCurrentForm(e));
                var allRows=$("table tbody input[type=checkbox]",_this.getCurrentForm(e)).length;
                var allCheckedRows=$("tbody input[type=checkbox]:checked",_this.getCurrentForm(e)).length;
                var allDisabledRows=$("tbody input[type=checkbox]:disabled",_this.getCurrentForm(e)).length;
                if (e.currentTarget.checked &&
                    allRows-allCheckedRows-allDisabledRows==0 ) {
                    $theadCheckBox.prop('checked', true);
                } else {
                    $theadCheckBox.prop('checked', false);
                }
                _this.toolBarCheck(e);
            });
            //自定义字段列表事件
            $(this.formSelector).on("change","[name='selectFields.id']", function (e) {
                e.page=_this;
                _this.query(e);
            });
            //绑定自动能够已过滤下拉事件
            $(this.formSelector).on("click",".filter-conditions dt a", function (e) {
                $(".filter-conditions ",this.formSelector).addClass("hide");
                $(".filter-conditions ",this.formSelector).children("dd").remove();
                _this.query(e);
            });
        },
        /**
         * 自定义下拉选择事件
         * @param e
         */
        selectListChange:function(e) {
            if(e.key.indexOf("search")==0){
                if(e.key=="search.payeeBank"){
                    $(this.formSelector + " .search-wrapper .form-control[type=text]").addClass("hide");
                    $(this.formSelector + " .show").children().removeClass("hide");
                }else{
                    $(this.formSelector + " .search-wrapper .form-control[type=text]").removeClass("hide");
                    $(this.formSelector + " .show").children().addClass("hide");
                    $(this.formSelector + " .show").children().attr("value","");
                    $(this.formSelector + " .show input").val("");
                    $(this.formSelector + " .search-wrapper .form-control[type=text]").attr("name", e.key).val('');
                }
            }else{
                $(".show input[name='search.payeeBank']").val(e.key)
            }
            $(this.formSelector + " .search-wrapper .form-control[type=text]").attr("placeholder", e.value);

        },
        /**
         * 绑定表单验证规则
         * @private
         */
        bindFormValidation : function() {
            var $form = $(this.formSelector);
            var rule = this.getValidateRule($form);
            if (rule) {
                if($.data($form[0], "validator")) {
                    $.data($form[0], "validator", null);
                }
                $form.validate(rule);
            }
        },
        /**
         * 详情关闭/打开
         * @param e
         */
        initShowDetail: function () {
            $(this.formSelector).on("mousedown",".view", function (e) {
                var $target = $(e.currentTarget);
                var isLoad = $target.attr("data-load");//是否加载标识
                var id = $target.attr("data-id");

                if(isLoad != '1') {
                    var href = $target.attr("data-href");
                    $('#'+id).load(href,{"search.id":id});
                    $target.attr("data-load", "1");
                }
                $target.parent("td").parent("tr").next(".bg-color").toggle();
                $target.parents("tr").toggleClass("shut");

                $target.unlock();
            });

        },
        /**
         * 检查ToolBar的显示状态
         * @param e
         */
        toolBarCheck:function(e)
        {
            this._isShowTotalRow();
            var $funMoreMenu= $(this.funMoreMenu,this.getCurrentForm(e));
            if(e==undefined)
            {
                $funMoreMenu.css("display","").removeClass('show').addClass('hide');
                return;
            }

            if(!this.getSelectIdsArray(e).length)
            {
                $funMoreMenu.css("display","").removeClass('show').addClass('hide');
            }
            else
            {
                $funMoreMenu.css("display","").removeClass('hide').addClass('show');
            }
        },
        /**
         * 操作回调，event.returnValue==true时才执行 query方法，
         * 其他的操作回调，请参考这里，不要任何时候都执行刷新操作
         * @param event
         * @param option
         */
        callBackQuery:function(event,option)
        {
            if(event.returnValue==true)
            {
                this.query(event,option);
            }
        },
        /**
         * 执行查询
         * @param event         事件对象
         */
        query : function(event,option) {
            var $form = $(window.top.topPage.getCurrentForm(event));
            if(!$form.valid || $form.valid()) {
                window.top.topPage.ajax({
                    loading:true,
                    url:window.top.topPage.getCurrentFormAction(event),
                    headers: {
                        "Soul-Requested-With":"XMLHttpRequest"
                    },
                    type:"post",
                    data:this.getCurrentFormData(event),
                    success:function(data){
                        var $result=$(".search-list-container",$form);
                        $result.html(data);
                        event.page.onPageLoad();
                        event.page.toolBarCheck(event);
                        $(event.currentTarget).unlock()},
                    error:function(data, state, msg){
                        window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                        $(event.currentTarget).unlock();
                    }});
            } else {
                $(event.currentTarget).unlock();
            }
        },
        //region 列表操作
        /**
         * 获取当前事件Form的列表选中的Id数组对象，针对Form Post提交
         * @param e             事件对象
         * @param option        Button标签的参数
         */
        getSelectIds:function(e,option)
        {
            return {ids:this.getSelectIdsArray(e,option).join(",")};
        },
        /**
         * 获取当前事件Form的列表选中的Id数组
         * @param e             事件对象
         * @param option        Button标签的参数
         */
        getSelectIdsArray:function(e,option)
        {
            var checkedItems = [],counter = 0;
            $("table tbody input[type=checkbox]",this.getCurrentForm(e)).not("[name=my-checkbox]").each(function(node,obj) {
                if(obj.checked) {
                    checkedItems[counter] = obj.value;
                    counter++;
                }
            });

            return checkedItems;
        },
        /**
         * 点击取消选定全部记录
         * @param e
         */
        cancelSelectAll : function(e) {
            e.page=this;
            $('thead input[type=checkbox]').prop('checked', false);
            $('tbody input[type=checkbox]',this.getCurrentForm(e)).each(function(node,obj) {
                if(!$(obj).prop('disabled')) {
                    $(obj).prop('checked', false);
                }
            });
            $('thead .bd-none').addClass('hide');
            /*隐藏公共区域*/
            $(this.funMoreMenu).addClass("hide");
            $('tbody tr',this.getCurrentForm(e)).removeClass("open");
            this.toolBarCheck(e);
            $(e.currentTarget).unlock();
        },
        /**
         * 每行选定后背景色
         * @param ele
         * @param selected
         * @private
         */
        _isShowTotalRow:function() {
            var checkedRows = $("table tbody tr",this.formSelector).find("td:first").find("input[type=checkbox]:checked:not([name=my-checkbox])");
            $('#page_selected_total_record').text(checkedRows.length);
            if (checkedRows.length>1) {
                $('thead .bd-none').removeClass('hide');
            } else {
                $('thead .bd-none').addClass('hide');
                var checkedRows = $("tbody tr").removeClass("open");
            }
        },
        //endregion
        //region  自定义列表
        /**
         * 绑定更多自定义列表事件
         */
        moreData:function(){
            $(".more-data").off("click", this._moreData).on("click", this._moreData);
            $(".more-data-wrapper").off("mouseleave", this._moreDataOut).on("mouseleave", this._moreDataOut);
        },
        /**
         * 处理更多数据的鼠标离开事件
         * @param e
         * @private
         */
        _moreDataOut:function(e){
            if($(e.currentTarget).hasClass("more-data"))
            {
                
            }
            //$(".more-data").attr("slide", "0");
            //$(".more-wrapper").removeClass("show-data");
        },
        /**
         * 更多自定义列表
         * @param e
         * @private
         */
        _moreData:function (e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            var slide = $target.attr("slide");//查看或关闭标识
            if(slide != '1') {
                var href = $target.attr("data-href");
                $target.next().load(href,function() {
                    $target.attr("slide", "1");
                    $(".more-wrapper").addClass("show-data");
                });
            } else {
                $target.attr("slide", "0");
                $(".more-wrapper").removeClass("show-data");
            }
            $target.unlock();

        },
        /**
         * 刷新加载数据
         */
        loadMoreData:function()
        {
            var $target=$(".more-data");
            var href = $target.attr("data-href");
            $target.next().load(href,function() {
                $target.addClass("show-data");
            });
        },
        //endregion
        //region 自定义过滤
        /**
         * 显示选择的条件
         * @param e
         * @param option
         */
        showFiltersCallBack:function(e,option){
            var _this = this;
            if(e.returnValue)
            {
                var arr = e.returnValue.result.content;
                var this_event = e;
                if(arr.length>0){
                    $(".filter-conditions dd").remove();
                    $(".filter-conditions").removeClass("hide");
                }

                for(var i=0;i<arr.length;i++) {
                    var text = arr[i].text||'';
                    var strTmp='<dd>'+arr[i].propertyName+ arr[i].operatorName+'：'+text+'<a href="javascript:void(0)">×</a>' +
                        '<input type="hidden" name="query.criterions['+i+'].property" value="'+arr[i].property+'" />';
                    if(arr[i].value=='IS_NOT_NULL'){
                        strTmp += '<input type="hidden" name="query.criterions['+i+'].operator" value="IS_NOT_NULL" />';
                    }else if(arr[i].value=='IS_NULL'){
                        strTmp += '<input type="hidden" name="query.criterions['+i+'].operator" value="IS_NULL" />';
                    }else{
                        strTmp += '<input type="hidden" name="query.criterions['+i+'].operator" value="'+arr[i].operator+'" />';
                        var arrTemp=arr[i].value.split(",");
                        for(var j=0;j<arrTemp.length;j++) {
                            strTmp+='<input type="hidden" name="query.criterions[' + i + '].value" value="' + arrTemp[j] + '" />';
                        }
                    }

                    strTmp+='</dd>';
                    $(".filter-conditions").append($(strTmp));
                }
                $(".filter-conditions dd a").bind("click", function (e1) {
                    $(e1.currentTarget.parentNode).remove();
                    e1.page=_this;
                    _this.query(e1,option);
                    if (!$(".filter-conditions dd").length) {
                        $(".filter-conditions ",this.formSelector).addClass("hide");
                    }
                });
                _this.query(e,option);
            }
        },
        /**
         * 获取页面上的选择的列和自定义过滤条件
         * @returns {{filters: (*|jQuery), ids: *}}
         */
        getFilters:function()
        {
            var btnOption = eval("(" + $(this.parentTarget).data('rel') + ")");
            return {
                filters:$(".filter-conditions dd"),
                ids:this.getSelectIds({currentTarget:this.parentTarget,page:this},btnOption)
            };
        },

        /**
         * 搜索校验 precall
         * @param e
         * @param option
         * @returns {boolean}
         */
        checksearch:function(e,option) {
            var searchlist = $("#searchlist").val();
            if (!searchlist) {
                window.top.topPage.showWarningMessage(message.player['choose.search.list']);
                return false;
            }
            /*var searchtext = $("#searchtext").val();
            if (!searchtext) {
                window.top.topPage.showWarningMessage(message.player['input.search.text']);
                return false;
            }*/
            return true;
        },

    });
});