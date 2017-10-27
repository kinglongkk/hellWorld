/**
 * Created by cj on 15-6-18.
 */
define(['common/BaseEditPage', 'css!themesCss/iCheck/custom'], function (BaseEditPage) {
    return BaseEditPage.extend({
        init: function () {
            this.formSelector = "form";
            this._super();
            this.fillCondition();
            this.getParentParam();

        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
            //this.bindButtonEvents();
        },
        onPageLoad: function () {
            this._super();
            //$(".result-fileName-css").attr("name","result.fileName");
            //$(".result-code-css").attr("name","result.code");
            //$(".result-fileName-css").val("");
        },
        /**
         * 弹出框替换内容
         * @param e
         */
        replace: function (e) {
            var target = e.currentTarget;
            var href = $(target).attr("data-href");
            window.location.href = href;
            $(target).unlock();
        },
        getParentParam: function (e,opt) {
            var data = window.parent.page.exportData();
            if(data){
                var arr = eval("("+data+")");
                for(var i=0;i<arr.length;i++) {
                    var strTmp='<dd><input type="hidden" name="query.criterions['+i+'].property" value="'+arr[i].property+'" />'+
                        '<input type="hidden" name="query.criterions['+i+'].operator" value="'+arr[i].operator+'" />';
                    var val = arr[i].value;
                    if(val!=""){
                        var vals = val.split(",");
                        for(var x=0;x<vals.length;x++){
                            strTmp = strTmp+'<input type="hidden" name="query.criterions[' + i + '].value" value="' + vals[x] + '" />';
                        }
                    }else{
                        strTmp = strTmp+'<input type="hidden" name="query.criterions[' + i + '].value" value="" />';
                    }
                    strTmp = strTmp+ "</dd>";
                    $(".filter-conditions").append($(strTmp));
                }
            }

        },
        fillCondition: function () {

            var conditions = window.parent.page.getFilters();
            //var idsCount = $.map(conditions.ids, function (v, k) {
            //    return k;
            //}).length;
            if(conditions.ids.ids!=""){
                var idsCount = conditions.ids.ids.split(',').length;

                if (conditions.filters.length > 0) {
                    $(".conditions_div").removeClass("hide");
                    $.each(conditions.filters,function(index,item){
                        $('.filter-conditions').append($(item).clone());
                    });
                    $('.filter-conditions').find('a').remove();
                } else {
                    $(".conditions_div").addClass("hide");
                    $('input:radio[value=0]').parent().parent().hide();
                }
                if (idsCount > 0) {
                    $('input:radio[value=1]').attr('checked', true);
                } else if (conditions.filters.length > 0) {
                    $('input:radio[value=0]').attr('checked', true);
                }
                $('._checkedCount').text(idsCount);
                $("input[name='ids']").val(conditions.ids.ids);
            }else{
                $('input:radio[value=1]').parent().parent().hide();
                $(".exportTypeDiv").hide();
            }

            this.resizeDialog();
        },
        showProgress: function (e,opt) {
            if(opt.data.state){
                this.returnValue = "showProcess";
                this.closePage();
                //$("#progressForm").submit();
            }

        },
        /**
         * 保存或更新前验证
         * @param e   事件对象
         * @return 验证是否通过
         */
        validateForm: function(e) {
            var $form = $(window.top.topPage.getCurrentForm(e));
            var _valid = !$form.valid || $form.valid();
            if (!_valid) {
                $(e.currentTarget).unlock();
                return false;
            }
            return _valid;
        },
        /**
         * 检查是否选中了记录
         * @param e
         * @returns {boolean}
         */
        valiSelected: function (e) {
            var _target = e.currentTarget;
            var selectIds = this.getSelectIds(e);
            if (selectIds.ids) {
                return true;
            } else {
                window.top.topPage.showErrorMessage(window.top.message.share['record.choose.first']);
            }
        },
        showHistory:function(e,opt){
            this.returnValue=true;
            this.closePage();
        },
        continueClear:function(e,opt){
            var ids = $("#playerId").val();
            var length = ids.split(',').length;
            $("#idsLength").val(length);
            $("#clearForm").submit();
        }
    })
});