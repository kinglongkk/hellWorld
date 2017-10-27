/**
 * Created by fly on 15-12-7.
 */
define(['common/BaseListPage','zeroClipboard'], function (BaseListPage, ZeroClipboard) {

    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            this.formSelector = this.formSelector || formSelector ||"#mainFrame form";
            this._super();
            $('.help-popover').popover();
        },
        /** 页面加载事件函数 */
        onPageLoad: function () {
            this._super();
        },
        /** 当前对象事件初始化函数 */
        bindEvent: function () {
            this._super();
            //这里初始化所有的事件
            var clip = new ZeroClipboard($('a[name="copy"]'));
            /*clip.on('copy', function (e) {
                window.top.topPage.showInfoMessage('复制成功');
            });*/
        },
        openMore: function(e) {
            $('div#domain').removeAttr('style');
            $('div#openMore').hide();
            $('div#hideMore').show();
            $(e.currentTarget).unlock();
        },
        hideMore: function(e) {
            $('div#domain').css({'height':'150px', 'overflow':'hidden'});
            $('div#openMore').show();
            $('div#hideMore').hide();
            $(e.currentTarget).unlock();
        }
    });
});
