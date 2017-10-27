define(['common/BaseEditPage','bootstrap-dialog'], function (BaseEditPage, BootstrapDialog) {
    var _this =null;
    return BaseEditPage.extend({
        formSelector:'#agent_main',
        init: function () {
            this._super('#agent_main');
            _this = this;
        },
        bindEvent: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();
            $('.help-popover').popover();
            var val = $("#setting").val();
            if(val==1){
                this.showBank(val);
            }
        },
        myValidateForm:function(e,option){
            var money = $("#money").val();
            var minMoney = $("#minMoney").val();
            var maxMoney = $("#maxMoney").val();
            var balance = $("#balance").val();
            if(money==null || money==''){
                $("#errMsg").text("提现金额不能为空");
                return false;
            }
            var reg = /^[0-9]+(.[0-9]{1,2})?$/;
            if(!reg.test(money)){
                $("#errMsg").text("仅支持正数和2位小数");
                return false;
            }
            var int_money = parseInt(money*100);
            var int_minMoney = parseInt(minMoney*100);
            var int_maxMoney = parseInt(maxMoney*100);
            var int_balance = parseInt(balance*100);
            if(int_money<int_minMoney){
                $("#errMsg").text("单次取款不得小于"+minMoney);
                return false;
            }
            if(int_money>int_maxMoney){
                $("#errMsg").text("单次取款不得大于"+maxMoney);
                return false;
            }
            if(int_money>int_balance){
                $("#errMsg").text("余额不足");
                return false;
            }
            return true;
        },
        updateStatus:function(){
            $("#freeze_status").val("1");
        },
        withdrawals:function(e, opt){
            var that = this;
            window.top.topPage.ajax({
                url: root + "/vAgentFundRecord/withdrawals.html",
                type: "post",
                dataType: "json",
                data: window.top.topPage.getCurrentFormData(e),
                success: function (data) {
                    if(data.state) {
                        that.showSuccess(e, opt);
                    } else {
                        that.showFail(data.msg,e, opt);
                    }
                }
            });
        },
        showSuccess: function (e, opt) {
            $('#div_success').show();
            var $div = $('<div></div>');
            $div.append($('#div_success').html());
            var option={
                title: opt.text,
                type: BootstrapDialog.TYPE_PRIMARY,
                message: $div,
                buttons: [{
                    label: "好的",
                    cssClass: 'btn btn-filter',
                    action: function(dialogItself){
                        dialogItself.close();
                        $("#reback_btn").click();
                    }
                },{
                    label: "查看资金记录",
                    cssClass: 'btn btn-filter',
                    action: function(dialogItself){
                        dialogItself.close();
                        $("#reback_btn").click();
                    }
                }]
            };
            BootstrapDialog.show(option);
            $(e.currentTarget).unlock();
            e.page.onPageLoad();
        },
        showFail: function (msg,e, opt) {
            $('#div_fail').show();
            $("#fail_msg").text(msg);
            var $div = $('<div></div>');
            $div.append($('#div_fail').html());
            var option={
                title: opt.text,
                type: BootstrapDialog.TYPE_PRIMARY,
                message: $div,
                buttons: [{
                    label: "再取一次",
                    cssClass: 'btn btn-filter',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                }]
            };
            BootstrapDialog.show(option);
            $(e.currentTarget).unlock();
            e.page.onPageLoad();
        },
        showBank: function (val) {
            var labelName = "下一步";
            if(val==1){
                labelName="确定";
            }
            $('#div_bank').show();
            var $div = $('<div></div>');
            $div.append($('#div_bank').html());
            var option={
                title: "设置收款银行卡",
                type: BootstrapDialog.TYPE_PRIMARY,
                closable: false,
                message: $div,
                buttons: [{
                    label: "重置",
                    cssClass: 'btn btn-outline btn-filter',
                    action: function(dialogItself){
                        $div.find("#bankNo").val("");
                        $div.find("#bank_deposit").val("");
                        $div.find("#bank_pwd").val("");
                    }
                }, {
                    label: labelName,
                    cssClass: 'btn btn-filter',
                    action: function(dialogItself){
                        if(_this.yzBank($div)){
                            _this.saveBank($div,val,dialogItself);
                        }
                    }
                }]
            };
            BootstrapDialog.show(option);
        },
        saveBank:function($div,val,dialogItself){
            window.top.topPage.ajax({
                url: root + "/vAgentFundRecord/saveBank.html",
                type: "post",
                dataType: "json",
                data: {'result.bankcardNumber':$div.find("#bankNo").val(),'result.bankName':$div.find("input[name='result.bankName']").val(),
                    'result.bankDeposit':$div.find("#bank_deposit").val(),'permissionPwd':$div.find("#bank_pwd").val()},
                success: function (data) {
                    if(data.state) {
                        dialogItself.close();
                        $("#tot").click();
                    } else {
                        window.top.topPage.showErrorMessage(data.msg);
                    }
                }
            });
        },
        yzBank:function($div){
            var bankNo = $div.find("#bankNo").val();
            var bankName = $div.find("input[name='result.bankName']").val();
            var bank_deposit = $div.find("#bank_deposit").val();
            var bank_pwd = $div.find("#bank_pwd").val();
            if(bankNo==null || $.trim(bankNo)==''){
                window.top.topPage.showErrorMessage("请输入卡号！");
                return false;
            }
            var reg = /^[0-9]*$/;
            if(!reg.test(bankNo) || $.trim(bankNo).length<10){
                window.top.topPage.showErrorMessage("请输入正确卡号！");
                return false;
            }
            if(bankName==null || $.trim(bankName)==''){
                window.top.topPage.showErrorMessage("请选择银行！");
                return false;
            }
            var patrn=/^[a-zA-Z\u4E00-\u9FA5]+$/;
            if(bank_deposit==null || $.trim(bank_deposit)==''||bank_pwd.length>50||!patrn.exec(bank_deposit)){
                window.top.topPage.showErrorMessage("开户行格式不对！");
                return false;
            }

            if(bank_pwd==null || $.trim(bank_pwd)==''||bank_pwd.length>20){
                window.top.topPage.showErrorMessage("请填写正确安全密码！");
                return false;
            }
            return true;
        }
    });
});