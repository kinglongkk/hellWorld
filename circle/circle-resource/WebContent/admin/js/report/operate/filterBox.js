/**
 * Created by fly on 15-12-4.
 */
define(['common/BaseListPage', 'bootstrap-dialog'], function(BaseListPage, BootstrapDialog) {

    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (title) {
            this.formSelector = "#reportForm";
            this._super();
        },
        /** 页面加载事件函数 */
        onPageLoad: function () {
            this._super();
        },
        /** 当前对象事件初始化函数 */
        bindEvent: function () {
            this._super();
        },

        /** 快速筛选-全选 */
        checkAll: function (e) {
            $(e.currentTarget).removeClass('btn-outline');
            $('div.filter span a.all').removeClass('btn-outline');
            $(e.currentTarget).unlock();
            $('span.choose').text(window.top.message.report['operate.list.all']);
            $('div.apiHide').each(function(){
                $('[name="search.apiIds"]').prop('checked', true);
                $('[name="search.apiTypeIds"]').prop('checked', true);
            });
            this.setAll(1);
        },
        /** 快速筛选-清除 */
        clearAll: function (e) {
            $('div.filter span a.all').addClass('btn-outline');
            $(e.currentTarget).unlock();
            $('span.choose').text(window.top.message.report['operate.list.all']);
            $('div.apiHide').each(function(){
                $('[name="search.apiIds"]').prop('checked', false);
                $('[name="search.apiTypeIds"]').prop('checked', false);
                $('[name="search.hideGameTypes"]').prop('checked', false);
            });
            this.setAll(0);
        },
        /** 快速筛选-api选择 */
        selectApi: function(e, o) {
            var $choose = $('span.choose');
            this.setSelTip($choose.text());

            var apiId = o.data;
            if ($('[name="selAll"]').val()==0 && !($('[name="search.apiIds"][value="' + apiId + '"]').prop('checked'))) {
                $(e.currentTarget).removeClass('btn-outline');
                var text = $(e.currentTarget).attr('title');
                var rel = '{&quot;precall&quot;:&quot;&quot;,&quot;callback&quot;:&quot;&quot;,post:&quot;&quot;,opType:&quot;function&quot;,dataType:&quot;&quot;,target:&quot;fBox.cancelApi&quot;,confirm:&quot;&quot;,text:&quot;'
                    + text + '&quot;,size:&quot;&quot;,&quot;data&quot;:&quot;' + apiId + '&quot; }';
                $choose.append('<a class="btn btn-filter btn-outline" data=' + apiId + ' data-text="api_' + apiId + '" data-rel="' + rel + '">' + text + '</a> ');
                $('[name="search.apiIds"][value=' + apiId + ']').prop('checked', true);
            }
            $(e.currentTarget).unlock();
        },
        /** 快速筛选-取消当前API的选择 */
        cancelApi: function(e, o) {
            this.setAll(0);
            var apiId = o.data;
            $('a.btn_api_' + apiId).addClass('btn-outline');
            $('[name="search.apiIds"][value=' + apiId + ']').prop('checked',false);
            $(e.currentTarget).remove();

            this.setSelTip($('span.choose').text());
        },
        /** 快速筛选-API类型选择 */
        selectApiType: function (e, o) {
            var $choose = $('span.choose');
            this.setSelTip($choose.text());

            this.setAll(0);
            var apiTypeId = o.data;
            if ($('[name="selAll"]').val()==0 && !($('[name="search.apiTypeIds"][value="' + apiTypeId + '"]').prop('checked'))) {
                $(e.currentTarget).removeClass('btn-outline');
                var text = $(e.currentTarget).attr('title');
                var rel = '{&quot;precall&quot;:&quot;&quot;,&quot;callback&quot;:&quot;&quot;,post:&quot;&quot;,opType:&quot;function&quot;,dataType:&quot;&quot;,target:&quot;fBox.cancelApiType&quot;,confirm:&quot;&quot;,text:&quot;'
                    + text + '&quot;,size:&quot;&quot;,&quot;data&quot;:&quot;' + apiTypeId + '&quot; }';
                $choose.append('<a class="btn btn-filter btn-outline" data="' + apiTypeId + '" data-rel="' + rel + '">' + text + '</a> ');
                $('[name="search.apiTypeIds"][value=' + apiTypeId + ']').prop('checked', true);
            }
            $(e.currentTarget).unlock();
        },
        /** 快速筛选-取消当前API类型的选择 */
        cancelApiType: function(e, o) {
            this.setAll(0);
            $('a.btn_api_type_' + o.data).addClass('btn-outline');
            $('[name="search.apiTypeIds"][value=' + o.data + ']').prop('checked', false);
            $(e.currentTarget).remove();

            this.setSelTip($('span.choose').text());
        },
        /** 快速筛选-取消游戏类型的选择 */
        cancelGameType: function(e, o) {
            this.setAll(0);
            var apiId = $(e.currentTarget).attr('data-id');
            $('[name="search.hideGameTypes"][data-id=' + apiId + '][data-text="' + o.data + '"]').prop('checked', false);
            $(e.currentTarget).remove();
        },

        /** 快速筛选弹框 */
        filterBox: function(e, opt) {
            var $this = this;
            var $div = $('<div></div>');
            var $fbox = $('#filterBox');
            $this.initBox(e, opt);
            $fbox.children().appendTo($div);
            var option={
                title: opt.text,
                type: BootstrapDialog.TYPE_PRIMARY,
                message: $div,
                onhide:function(){
                    $div.children().appendTo($fbox);
                },
                buttons: [{
                    label: window.top.message.common['OK'],
                    cssClass: 'btn btn-filter',
                    action: function(dialogItself){
                        $("td[name='api_td']", '[role="dialog"]').each(function () {
                            $(this).next().children().children('input[type=checkbox]').each(function (index, ele){
                                var $choose = $('span.choose');
                                var apiId = $(ele).attr('data-id');
                                var apiTypeId = $(ele).attr('data-id');
                                var gameType = $(ele).val();
                                var text = $(ele).attr('data-title');
                                var $apiId = $('[name="search.apiIds"][value=' + apiId + ']');
                                var $apiTypeId = $('[name="search.apiTypeIds"][value=' + apiId + ']');
                                var $hideGt = $('[name="search.hideGameTypes"][data-id=' + apiId + '][data-text="' + gameType + '"]');
                                var rel = '{&quot;precall&quot;:&quot;&quot;,&quot;callback&quot;:&quot;&quot;,post:&quot;&quot;,opType:&quot;function&quot;,dataType:&quot;&quot;,confirm:&quot;&quot;';
                                var $boxAll = $('[name="boxAll"]');
                                var $clrAll = $('[name="clrAll"]');
                                if ($boxAll.val() == 1) {
                                    $this.setAll(1);
                                    $('[name="search.apiIds"]').prop('checked', true);
                                    $('[name="search.apiTypeIds"]').prop('checked', true);
                                    $('a.all').removeClass('btn-outline');
                                    $choose.text(window.top.message.report['operate.list.all']);
                                    return false;
                                }
                                if ($clrAll.val() == 1) {
                                    $this.setAll(0);
                                    $('[name="search.apiIds"]').prop('checked', false);
                                    $('[name="search.apiTypeIds"]').prop('checked', false);
                                    $('[name="search.hideGameTypes"]').prop('checked', false);
                                    $('a.all').addClass('btn-outline');
                                    $choose.text('');
                                    $clrAll.val(0);
                                }
                                if (ele.checked) {
                                    if ($('[name="box.apiIds"][data-id=' + apiId + ']').prop('checked')) {
                                        if (!$apiId.prop('checked')) {
                                            $apiId.prop('checked', true);
                                            $('a.btn_api_' + apiId).removeClass('btn-outline');
                                            rel = rel + ',target:&quot;fBox.cancelApi&quot;,text:&quot;' + text + '&quot;,size:&quot;&quot;,&quot;data&quot;:&quot;' + apiId + '&quot; }';
                                            $choose.append('<a class="btn btn-filter btn-outline" data=' + apiId + ' data-text="api_' + apiId + '" data-rel="' + rel + '">' + text + '</a> ');
                                            if ($apiId.prop('checked')) {
                                                $('span.choose a[data-id=' + apiId + '].gtype').remove();
                                                $('input[data-id=' + apiId + '].gtype').prop('checked', false);
                                            }
                                            return false;
                                        }
                                    } else if ($('[name="box.apiTypeIds"][data-id=' + apiTypeId + ']').prop('checked')) {
                                        if (!$apiTypeId.prop('checked')) {
                                            $apiTypeId.prop('checked', true);
                                            $('a.btn_api_type_' + apiTypeId).removeClass('btn-outline');
                                            rel = rel + ',target:&quot;fBox.cancelApiType&quot;,text:&quot;' + text + '&quot;,size:&quot;&quot;,&quot;data&quot;:&quot;' + apiTypeId + '&quot; }';
                                            $choose.append('<a class="btn btn-filter btn-outline" data=' + apiTypeId + ' data-text="api_type_' + apiTypeId + '" data-rel="' + rel + '">' + text + '</a> ');
                                        }
                                    } else if ($boxAll.val() == 0) {
                                        text = $(ele).attr('title');
                                        if (!($hideGt.prop('checked'))) {
                                            rel = rel + ',target:&quot;fBox.cancelGameType&quot;,text:&quot;' + text + '&quot;,size:&quot;&quot;,&quot;data&quot;:&quot;' + gameType + '&quot; }';
                                            $choose.append('<a class="btn btn-filter btn-outline gtype" data-id=' + apiId + ' data-text="' + gameType + '" data-rel="' + rel + '">' + text + '</a> ');
                                            $hideGt.prop('checked', true);
                                        } else {
                                            if ($apiId.prop('checked')) {
                                                $('span.choose a[data-id=' + apiId + '].gtype').remove();
                                                $('input[data-id=' + apiId + '].gtype').prop('checked', false);
                                            }
                                        }
                                    }
                                } else {
                                    $this.setAll(0);
                                    if ($apiId.prop('checked')) {
                                        $apiId.prop('checked', false);
                                        $('a.btn_api_' + apiId).addClass('btn-outline');
                                        $('a[data-text="api_' + apiId + '"]').remove();

                                        text = $(ele).attr('title');
                                        if ($hideGt.prop('checked')) {
                                            rel = rel + ',target:&quot;fBox.cancelGameType&quot;,text:&quot;' + text + '&quot;,size:&quot;&quot;,&quot;data&quot;:&quot;' + gameType + '&quot; }';
                                            $choose.append('<a class="btn btn-filter btn-outline gtype" data-id=' + apiId + ' data-text="' + gameType + '" data-rel="' + rel + '">' + text + '</a> ');
                                            $hideGt.prop('checked', true);
                                        }
                                    } else {
                                        if ($hideGt.prop('checked')) {
                                            $('span.choose a[data-id=' + apiId + '][data-text="' + gameType + '"]').remove();
                                            $hideGt.prop('checked', false);
                                        }
                                    }
                                }
                            });
                        });
                        dialogItself.close();
                        $this.setSelTip($('span.choose').text());
                    }
                }, {
                    label: window.top.message.common['cancel'],
                    cssClass: 'btn btn-outline btn-filter',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                }]
            };
            BootstrapDialog.show(option);
            $(e.currentTarget).unlock();
            e.page.onPageLoad();
        },

        /** 初始化弹窗 */
        initBox: function(e, opt) {
            if ($('[name="selAll"]').val()==1) {
                $('div.boxFilter button.all').removeClass('btn-outline');
                $('[type=checkbox]').prop('checked', true);
            } else {
                $('div.boxFilter button.all').addClass('btn-outline');
                var api = $('[name="search.apiIds"]');
                var apiId;
                for (var i = 0; i < api.length; i++) {
                    apiId = $(api[i]).val();
                    if ($('[name="search.apiIds"][value=' + apiId + ']').prop('checked')) {
                        $('[name="box.apiIds"][data-id=' + apiId + ']').prop('checked', true);
                        $('[name="box.gameTypes"][data-id=' + apiId + ']').prop('checked', true);
                        $('button[data-text="api' + apiId + '"]').removeClass('btn-outline');
                    } else {
                        $('[name="box.apiIds"][data-id=' + apiId + ']').prop('checked', false);
                        $('[name="box.gameTypes"][data-id=' + apiId + ']').prop('checked', false);
                        $('button[data-text="api' + apiId + '"]').addClass('btn-outline');
                    }
                }
                var apiType = $('[name="search.apiTypeIds"]');
                for (var j = 0; j < apiType.length; j++) {
                    var apiTypeId = $(apiType[j]).val();
                    if ($('[name="search.apiTypeIds"][value=' + apiTypeId + ']').prop('checked')) {
                        $('[name="box.apiTypeIds"][data-id=' + apiTypeId + ']').prop('checked', true);
                        $('button[data-text="apiType' + apiTypeId + '"]').removeClass('btn-outline');
                    } else {
                        $('[name="box.apiTypeIds"][data-id=' + apiTypeId + ']').prop('checked', false);
                        $('button[data-text="apiType' + apiTypeId + '"]').addClass('btn-outline');
                    }
                }
                var gameTypes = $('[name="search.hideGameTypes"]');
                for (var k = 0; k < gameTypes.length; k++) {
                    apiId = $(gameTypes[k]).attr('data-id');
                    var gameType = $(gameTypes[k]).attr('data-text');
                    if ($('[name="search.hideGameTypes"][data-id=' + apiId + '][data-text="' + gameType + '"]').prop('checked')) {
                        $('[name="box.gameTypes"][data-id=' + apiId + '][data-text="' + gameType + '"]').prop('checked', true);
                    } else {
                        if (($('[name="search.apiIds"][value=' + apiId + ']').prop('checked'))) {
                            $('[name="box.gameTypes"][data-id=' + apiId + '][data-text="' + gameType + '"]').prop('checked', true);
                        } else {
                            $('[name="box.gameTypes"][data-id=' + apiId + '][data-text="' + gameType + '"]').prop('checked', false);
                        }
                    }
                }
            }
        },

        /** 弹窗-全选 */
        popCheckAll: function (obj) {
            $('[name="clrAll"]').val(0);
            $('[name="boxAll"]').val(1);
            $('label').children('input[type=checkbox]').prop("checked", true);
            $('div.boxFilter button.all').removeClass('btn-outline');
        },
        /** 弹窗-清除所有 */
        popClearAll: function (obj) {
            $('[name="clrAll"]').val(1);
            $('[name="boxAll"]').val(0);
            $('label').children('input[type=checkbox]').prop("checked", false);
            $('div.boxFilter button.all').addClass('btn-outline');
        },
        /** 弹窗-api选择 */
        selectPopApi: function (obj, apiId) {
            this.setAll(0);
            $('td').each(function () {
                if (apiId == $(this).attr("data-id")) {
                    $(this).children().children("input[type=checkbox]").prop("checked", true);
                }
            });
            $(obj).removeClass('btn-outline');
        },
        /** 弹窗-API类型选择 */
        selectPopApiType: function (obj, apiType) {
            if (!$('[name="box.apiTypeIds"][data-id='+apiType+']').prop('checked')) {
                this.setAll(0);
                $('[name="box.apiTypeIds"]').each(function () {
                    if (apiType == $(this).attr('data-id')) {
                        $(this).prop('checked', true);
                        $(this).prop('value', apiType);
                    }
                });
                $(obj).removeClass('btn-outline');
            }
        },
        /** 弹窗-点击左侧api */
        clickPopApi: function (ele) {
            if (ele.checked) {
                $(ele).parents('td').next().children().children("input[type=checkbox]").each(function (){
                    $(this).prop('checked', true);
                });
                $('button[data-text="api' + $(ele).attr('data-id') + '"]').removeClass('btn-outline');
            } else {
                this.setAll(0);
                $(ele).parents('td').next().children().children("input[type=checkbox]").each(function (){
                    $(this).prop('checked', false);
                });
                $('button[data-text="api' + $(ele).attr('data-id') + '"]').addClass('btn-outline');
            }
        },
        /** 弹窗-点击右侧二级类型 */
        clickPopGameType: function (ele) {
            this.setAll(0);
            var $td = $(ele).parents('td');
            var typeLen = $td.find('[type=checkbox].i-checks').length;
            var apiId = $(ele).attr('data-id');
            if (ele.checked) {
                var chkedLen = $td.find('[type=checkbox]:checked').length;
                if (typeLen == chkedLen) {
                    $($td).prev().find('[type=checkbox]').prop('checked', true);
                    $($td).parents('div').prev().find('[onclick="page.selectPopApi(this, ' + $($td).attr('data-id') + ')"]').removeClass('btn-outline');
                }
                if ($('[name="box.apiIds"][data-id=' + apiId + ']').prop('checked')) {
                    $('button[data-text="api' + apiId + '"]').removeClass('btn-outline');
                }
            } else {
                $($td).prev().find('[type=checkbox]').prop('checked', false);
                $('button[data-text="api' + apiId + '"]').addClass('btn-outline');
            }
        },
        /**设置全部状态*/
        setAll: function(v) {
            $('[name="selAll"]').val(v);
            $('[name="boxAll"]').val(v);
        },
        setSelTip: function(text) {
            var $choose = $('span.choose');
            if (text.indexOf(window.top.message.report['operate.list.all']) > -1) {
                $choose.html($choose.html().replace(window.top.message.report['operate.list.all'], ''));
            } else if (text.trim()=='') {
                $choose.text(window.top.message.report['operate.list.all']);
            }
        }
    });
});