/**
 * Created by jeff on 15-10-20.
 */
define(['common/BaseEditPage'], function (BaseEditPage) {

    return BaseEditPage.extend({
        init: function () {
            this._super();
        },
        bindEvent: function () {
            this._super();
            var that = this;
            $('._changePasswordType').on("click",function(){
                var $this = $(this);
                var data = $this.data();
                $("input[name='changePassword']").val($this.val());
                $(data.hide).addClass('hide');
                $(data.show).removeClass('hide');
                that.resizeDialog();
            });
            $("[name=sysUserStatus]").on("click",function(){
                $("[name='sysUser.status']").val($(this).val());
            });
        },
        onPageLoad: function () {
            this._super();
        },
        previewRole: function ( event , option ) {
            this.returnValue = 'role';
            this.closePage();
        }
    });
});