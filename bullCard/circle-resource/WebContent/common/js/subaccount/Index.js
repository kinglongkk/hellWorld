/**
 * Created by jeff on 15-10-21.
 */
define(['common/BaseListPage', 'checkboxX'], function (BaseListPage, CheckboxX) {

    return BaseListPage.extend({
        loadRoles: true,
        init: function () {
            this._super();
        },
        bindEvent: function () {
            this._super();
            var that = this;
            $("#sys_user_role").on("click", function (e) {
                e.stopPropagation();
            });

            $('#sub_account_roles').on('show.bs.dropdown', function (e) {
                if (that.loadRoles) {
                    window.top.topPage.ajax({
                        url: root + "/subAccount/getRoles.html",
                        data: {
                            'search.sysUserIds': window.top.page.getSelectIdsArray(e).join(",")
                        },
                        type: "POST",
                        success: function (data) {
                            that.loadRoles = false;
                            $("#sys_user_role").html(data);
                            that.onRoleLoad();
                        },
                        error: function (a, b, c) {
                        }
                    })
                }
            });
        },
        onPageLoad: function () {
            this._super();
            var that = this;
            $(this.formSelector + " table input[type=checkbox]").on("click", function () {
                // 玩家列表 复选框 有改变 需要重新加载
                that.loadRoles = true;
            });

        },
        onRoleLoad: function () {

            /*初始化checkbox*/
            $('#sys_user_role .role_checkbox').checkboxX({
                enclosedLabel: true//checkbox 在label中需要置为true
            });
            /**
             * 状态为半选的，点击后变为全选，点击取消选中
             */
            $("#sys_user_role .role_checkbox[value=''][data-check-status='half']").on("change", function () {
                var $this = $(this);
                var thisVal = $this.val();
                if (thisVal === '0') {
                    $this.attr('data-check-status', 'other')
                    $this.off("change");
                    $this.val('1').checkboxX('refresh', {'threeState': false, 'enclosedLabel': true});
                    /*取消绑定change事件*/
                }
            });

        },
        getData: function (e, op) {

            /*------------------------------------------------------------------------------------------------------------*/
            var deleteRoleId = {};//是player_tag 的id
            var insertRoleId = {};//新增的tag_id
            var deleteRoleId_len = 0;
            var insertRoleId_len = 0;
            var playerIds = window.top.page.getSelectIdsArray(e, op);
            var playerIds_obj = {};
            //var
            /**
             *
             * 复选框的 value 0 未选中；1 选中； ‘’ 半选中；
             *
             */
            $(".sys_role .role_checkbox").each(function () {
                var $this = $(this);
                var $this_status = $this.attr("data-status");
                var $this_value = $this.val();
                var $this_tagId = $this.attr("data-value");

                if ($this_status === 'full_checked') {
                    //全选中

                    if ($this_value === '0') {
                        // 删除的。
                        deleteRoleId[deleteRoleId_len] = $this_tagId;
                        deleteRoleId_len++;
                    } else if ($this_value === '1') {
                        //未做改变
                    }

                } else if ($this_status === 'no_checked') {
                    //没有选中的
                    if ($this_value === '1') {
                        //新增的
                        insertRoleId[insertRoleId_len] = $this_tagId;
                        insertRoleId_len++;

                    }

                } else if ($this_status === 'half_checked') {
                    //半选中

                    if ($this_value === '0') {
                        //删除的
                        deleteRoleId[deleteRoleId_len] = $this_tagId;
                        deleteRoleId_len++;
                    } else if ($this_value === '1') {
                        //全部选中的
                        insertRoleId[insertRoleId_len] = $this_tagId;
                        insertRoleId_len++;
                    }
                }
            });
            for (var i = 0; playerIds[i]; i++) {
                playerIds_obj[i] = playerIds[i];
            }
            $(e.currentTarget).unlock();
            return {
                'search.deleteRoleIds': deleteRoleId,
                'search.insertRoleIds': insertRoleId,
                'search.sysUserIds': playerIds_obj
            };

        },
        deleteSubAccount: function (event, option) {
            var that = this;
            var usingCount = 0;
            var builtinCount = 0;
            var confirmMessage;
            $('._frist_td :checked').each(function (index, obj) {
                var data = $(obj).data()
                if (data.builtin) {
                    builtinCount += 1;
                }
                if (data.using) {
                    usingCount += 1;
                }
            });
            if (builtinCount) {
                confirmMessage = message.subAccount['delete.confirmMessageBuiltin'];
            } else if (usingCount) {
                confirmMessage = message.subAccount['delete.confirmMessageUsing'];
            } else {
                confirmMessage = message.subAccount['delete.confirmMessage'];
            }
            window.top.topPage.showConfirmMessage(confirmMessage, function (bol) {
                if (bol) {
                    window.top.topPage.ajax({
                        url: root + '/subAccount/subAccountDelete.html',
                        data: {
                            "search.sysUserIds": that.getSelectIdsArray(event).join(",")
                        },
                        type: 'POST',
                        success: function (data) {
                            that.query(event, option);
                        }
                    });
                }
                $(event.currentTarget).unlock();

            });
        },
        query: function (event, option) {
            if (event.returnValue === 'role') {
                $("#_roleSetting").click();
            } else {
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
            }
        },

    });
});