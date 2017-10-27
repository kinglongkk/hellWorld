/**
 * Created by cj on 15-9-29.
 */
define(['common/BaseListPage', 'bootstrap-dialog', 'site/report/operate/filterBox', 'autocompleter'], function(BaseListPage, BootstrapDialog, fBox) {

    return BaseListPage.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        fBox: null,
        init: function (title) {
            this.formSelector = "#reportForm";
            this.fBox = new fBox();
            this._super();
        },
        /** 页面加载事件函数 */
        onPageLoad: function () {
            this._super();
            var _this = this;
            $('[name="search.masterName"]',this.formSelector).bind('input propertychange', function(){
                var $subSysCode = $('[name=subSysCode]');
                if ($(this).val()) {
                    $subSysCode.val($('[name="role.player"]').val());
                    _this.queryMaster($(this).val());
                } else {
                    $subSysCode.val($('[name="role.company"]').val());
                    $('span.hsel').text('').addClass('hide');
                    $('a.look').attr('class', 'btn btn-filter pull-right look');
                }
            });
            $('input.role', this.formSelector).bind('input propertychange', function(){
                _this.changeAction();
            });
            var siteId = $('[name="search.siteId"]').val();
            if (siteId) {
                this.fillApi(eval('({"key":"' + siteId + '"})'));
                $('div.filter').removeClass('hide');
            } else {
                $('div.filter').addClass('hide');
                $('span.choose').text(window.top.message.report['operate.list.all']);
            }
        },
        /** 当前对象事件初始化函数 */
        bindEvent: function () {
            this._super();
        },

        /** 重写query方法 */
        query: function(event, option) {
            var _this=this;
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
                        var condition = 'div.search-list-condition';
                        var container = 'div.search-list-container';
                        $(condition, _this.formSelector).html($(condition, $(data)).html());
                        $(container, _this.formSelector).html($(container, $(data)).html());
                        $(event.currentTarget).unlock();
                        _this.onPageLoad();
                    },
                    error:function(data, state, msg){
                        window.top.topPage.showErrorMessage(window.top.message.common["server.error"]);
                        $(event.currentTarget).unlock();
                    }});
            } else {
                $(event.currentTarget).unlock();
            }
        },

        /** 切换站点 */
        changeSite: function(e) {
            $('div.apiHide').each(function(){
                $('[name="search.apiIds"]').prop('checked', false);
                $('[name="search.apiTypeIds"]').prop('checked', false);
                $('[name="search.hideGameTypes"]').prop('checked', false);
            });
            $('div.filter span a.all').addClass('btn-outline');
            $('span.choose').text(window.top.message.report['operate.list.all']);
            var $subSysCode = $('[name=subSysCode]');
            if (e.key) {
                $('div.role').removeClass('hide');
                $('div.filter').removeClass('hide');
                var roleName = $('input.role').val();
                if (roleName) { // 如果有输入总代或代理名称
                    var role = $('[name="role"]').val();
                    if (role == 'search.topagentName') {
                        $subSysCode.val($('[name="role.agent"]').val());
                    } else {
                        $subSysCode.val($('[name="role.player"]').val());
                    }
                } else {
                    $subSysCode.val($('[name="role.topAgent"]').val());
                }
                this.fillApi(e);
            } else {
                $('div.role').addClass('hide');
                $('div.filter').addClass('hide');
                $subSysCode.val($('[name="role.player"]').val());
            }
        },
        /** 切换角色 */
        changeRole: function(e) {
            $('input.role').attr('name', e.key).val('');
            this.changeAction();
        },
        /** 切换角色 */
        changeAction: function() {
            var $subSysCode = $('[name=subSysCode]');
            var roleName = $('input.role').val();
            if (roleName) {
                var role = $('[name="role"]').val();
                if (role == 'search.topagentName') {
                    $subSysCode.val($('[name="role.agent"]').val());
                } else {
                    $subSysCode.val($('[name="role.player"]').val());
                }
            } else {
                $subSysCode.val($('[name="role.topAgent"]').val());
            }
        },
        /** 查询站长账号 */
        queryMaster: function(uname) {
            if (uname) {
                window.top.topPage.ajax({
                    url: root+'/report/operate/queryMaster.html',
                    dataType: 'json',
                    type: 'POST',
                    data: {'search.username':uname},
                    success: function(data) {
                        if (data) {
                            $('.nope').autocompleter({
                                highlightMatches: true,
                                source: data,
                                template: '{{ label }}',
                                hint: true,
                                empty: false,
                                limit: 5
                            });
                            $('span.hsel').text('').addClass('hide');
                            $('a.look').attr('class', 'btn btn-filter pull-right look');
                        } else {
                            $('span.hsel').text(window.top.message.report['tip.warn.nodata']).removeClass('hide');
                            $('a.look').attr('class', 'btn btn-default pull-right ui-button-disable disabled look');
                        }
                    }
                });
            }
        },
        /** 检测站长账号是否存在 */
        checkMaster: function() {
            var uname = $('[name="search.masterName"]').val();
            if (uname) {
                var bool = false;
                window.top.topPage.ajax({
                    url: root+'/report/operate/checkMaster.html',
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    data: {'search.username':uname, 'search.siteId':$('[name="search.centerId"]').val()},
                    success: function(data) {
                        if (!data) {
                            window.top.topPage.showWarningMessage(window.top.message.report['tip.warn.nomaster']);
                        } else {
                            bool = true;
                        }
                    }
                });
                return bool;
            } else {
                return true;
            }
        },

        fillApi: function(e) {
            $.getJSON(root + '/report/operate/queryApis.html', 'siteId='+ e.key, function(data){
                var $btnApi = $('span.btn_api');
                $btnApi.html('');
                var $btnApiType = $('span.btn_api_type');
                $btnApiType.html('');

                var $boxApi = $('span.box_api');
                $boxApi.html('');
                var $boxApiType = $('span.box_api_type');
                $boxApiType.html('');

                var $boxGameType = $('tbody.box_game_type');
                $boxGameType.html('');

                var $hide = $('div.apiHide');
                $hide.html('');
                $.each(data.apis, function (i, item) {
                    var text = item.name;
                    var rel = '{&quot;precall&quot;:&quot;&quot;,&quot;callback&quot;:&quot;&quot;,post:&quot;&quot;,opType:&quot;function&quot;,dataType:&quot;&quot;,target:&quot;fBox.selectApi&quot;,confirm:&quot;&quot;,text:&quot;'
                        + text + '&quot;,size:&quot;&quot;,&quot;data&quot;:&quot;' + i + '&quot; }';
                    $btnApi.append('<a title="' + text + '" class="btn btn-outline btn-filter btn_api_' + i + ' all" data-rel="' + rel + '" href="javascript:void(0);">' + text + '</a> ');
                    $hide.append('<input type="checkbox" name="search.apiIds" value="' + i + '" title="' + text + '" />');

                    $boxApi.append('<button onclick="page.fBox.selectPopApi(this, ' + i + ')" data-id="' + i + '" data-text="api' + i + '" class="btn btn-outline btn-filter btn-xs btn_api_'+ i +' all">' + text + '</button> ');
                });
                $.each(data.apiTypes, function(i, item) {
                    var text = item.name;
                    var rel = '{&quot;precall&quot;:&quot;&quot;,&quot;callback&quot;:&quot;&quot;,post:&quot;&quot;,opType:&quot;function&quot;,dataType:&quot;&quot;,target:&quot;fBox.selectApiType&quot;,confirm:&quot;&quot;,text:&quot;'
                        + text + '&quot;,size:&quot;&quot;,&quot;data&quot;:&quot;' + i + '&quot; }';
                    $btnApiType.append('<a title="' + text + '" class="btn btn-outline btn-filter btn_api_type_' + i + ' all" data-rel="' + rel + '" href="javascript:void(0);">' + text + '</a> ');
                    $hide.append('<input type="checkbox" name="search.apiTypeIds" value="' + i + '" title="' + text + '" />');

                    $boxApiType.append('<button onclick="page.fBox.selectPopApiType(this, ' + i + ')" data-text="apiType' + i + '" class="btn btn-outline btn-filter btn-xs btn_api_type_' + i + ' all">' + text + '</button> ');
                });
                $.each(data.gameTypes, function(key, item) {
                    var idx = key.substring(0, key.indexOf('*'));
                    var apiName = key.substring(key.indexOf('*') + 1);
                    var htm = '<tr><td class="bg-gray al-left" name="api_td" data-id="' + idx + '"><label>' +
                        '<input type="checkbox" name="box.apiIds" data-id="' + idx + '" onclick="page.fBox.clickPopApi(this)" class="i-checks" />' +
                        '<span class="m-l-xs"><b>' + apiName + '</b></span></label></td>' +
                        '<td class="al-left"  data-id="' + idx + '">';
                    $.each(item, function(k, ktem) {
                        var text = ktem.name;
                        htm += '<label class="fwn m-r-sm">' +
                            '<input type="checkbox" name="box.gameTypes" onclick="page.fBox.clickPopGameType(this)" class="i-checks" data-id="' + idx + '" data-text="'
                            + text + '" value="' + text + '"' + 'title="' + ktem.apiName + '-' + text + '" data-title="' + ktem.apiName + '">' + text + '</label>';
                        if (ktem.idx==0) {
                            $.each(data.apiTypes, function(m, mtem) {
                                htm += '<label style="display: none"><input type="checkbox" name="box.apiTypeIds" data-id="' + m + '" data-title="' + mtem.name + '"></label>';
                            });
                        }
                        $hide.append('<input type="checkbox" name="search.hideGameTypes" data-id="' + idx + '" data-text="' + ktem.name + '" value="' + k + '" title="' + apiName + '-' + ktem.name + '" class="gtype">');
                    })
                    htm += '</td></tr>';
                    $boxGameType.append(htm);
                });
            });
        },

        /** 站长详情 */
        detailMaster: function(e) {
            $('[name="search.masterId"]').val($(e.currentTarget).parent().parent().find('input[name="masterId"]').val());
            $('[name=subSysCode]').val($('[name="role.player"]').val());
            return true;
        },
        /** 站点详情 */
        detailSite: function(e) {
            $('[name="search.siteId"]').val($(e.currentTarget).parent().parent().find('input[name="siteId"]').val());
            $('[name=subSysCode]').val($('[name="role.topAgent"]').val());
            return true;
        },
        /** 总代详情 */
        detailTopAgent: function(e) {
            $('[name="search.topagentId"]').val($(e.currentTarget).parent().parent().find('input[name="topAgentId"]').val());
            $('[name=subSysCode]').val($('[name="role.agent"]').val());
            return true;
        },
        /** 代理详情 */
        detailAgent: function(e) {
            $('[name="search.agentId"]').val($(e.currentTarget).parent().parent().find('input[name="agentId"]').val());
            $('[name=subSysCode]').val($('[name="role.player"]').val());
            return true;
        },

        /** 返回站长 */
        prevMaster: function(e) {
            $('[name="search.siteId"]').val('');
            $('[name=subSysCode]').val($('[name="role.company"]').val());
            return true;
        },
        /** 返回站点 */
        prevSite: function(e) {
            $('[name="search.siteId"]').val('');
            $('[name=subSysCode]').val($('[name="role.player"]').val());
            return true;
        },
        /** 返回总代 */
        prevTopAgent: function(e) {
            $('[name=subSysCode]').val($('[name="role.topAgent"]').val());
            return true;
        },
        /** 返回代理 */
        prevAgent: function(e) {
            $('[name=subSysCode]').val($('[name="role.agent"]').val());
            return true;
        },

        toExportHistory:function(e,opt){
            if(e.returnValue=="showProcess"){
                var btnOption = {};
                btnOption.target = root + "/share/exports/showProcess.html";
                btnOption.text=window.top.message['export.exportdata'];
                btnOption.type="post",
                    btnOption.callback = function (e) {
                        $("#toExportHistory").click();
                    };
                window.top.topPage.doDialog({}, btnOption);
            }else if(e.returnValue){
                $("#toExportHistory").click();
            }
        },
        exportData: function (e,opt) {
            var data = $("#conditionJson").val();
            return data;
        },
        validateData: function (e,opt) {
            if($("[name='paging.totalCount']").val()==0){
                window.top.topPage.showWarningMessage(window.top.message.report['tip.warn.export.nodata']);
                $(e.currentTarget).unlock();
                return false;
            }
            return true;
        }
    });
});