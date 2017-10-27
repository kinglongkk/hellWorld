define(['common/BaseEditPage'], function(BaseEditPage) {
    var _this;
    return BaseEditPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function () {
            _this = this;
            _this.delDiv();
            this._super();
        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            $("#addPosition").click(function(){
                var div_size = $("#div_size").val();
                div_size = parseInt(div_size);
                var html ='<div class="line-hi34 input-group date" id="div_'+div_size+'">';
                html +='<input type="text" value="" maxlength="20" name="sp['+div_size+'].name" class="form-control">';
                html +='<span class="input-group-addon"><a href="javascript:void(0)" class="delCss" tt="div_'+div_size+'"><i class="fa fa-minus"></i></a></span>';
                html +='</div>';
                $("#add_div").before(html);
                $("#div_size").val(div_size+1)
                _this.resizeDialog();
                _this.delDiv();
            })

        },
        delDiv:function(){
            $(".delCss").on('click', function() {
                var name = $(this).attr("tt");
                var count = $(this).attr("tc");
                if(count>0){
                    var msg = window.top.message.contacts['contacts.position.nodel'];
                    window.top.topPage.showErrorMessage(msg);
                }else{
                    $("#"+name).remove();
                    _this.resizeDialog();
                }
            })
        },
        validateForm:function(){
            var bo = true;
            $("input[type='text']").each(function () {
                var obj = $(this);
                var val = obj.val();
                if(val==''){
                    var msg = window.top.message.contacts['name.NotBlank'];
                    window.top.topPage.showErrorMessage(msg,function(){
                        obj.focus();
                    });
                    bo=false;
                    return false;
                }
                if(val.length>20){
                    var msg = window.top.message.contacts['name.length'];
                    window.top.topPage.showErrorMessage(msg,function(){
                        obj.focus();
                    });
                    bo=false;
                    return false;
                }
            });
            return bo;
        }

    })
});