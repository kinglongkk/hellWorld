/**
 * Created by jeff on 15-8-14.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
            this.domainIdEnable();
        },
        bindEvent: function () {
            var _this=this;
            this._super();
            $(this.formSelector).on("keyup","input[name='result.domain']", function () {
                //线路域名没填或格式不对，提交按钮禁用
                _this.domainIdEnable();
            })

        },
        onPageLoad: function () {
            this._super();
        },
        saveDomain:function(e,p){
            if (!this.validateForm(e)) {
                return false;
            }
            //设为默认
            $("input[name='result.isDefault']").val($("#isDefault").is(":checked"));
            if (!this.validateForm(e)) {
                return false;
            }
            return true;
        },
        //线路域名是否有效
        domainIdEnable: function () {
            var domain=$("input[name='result.domain']").val();
            var checkNum = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
            if($.trim(domain).length>0&&checkNum.test(domain)){
                $("._search").unlock();
                $("._search").removeClass("disabled");
            }else{
                $("._search").lock();
                $("._search").addClass("disabled");
            }
        }
    });
});