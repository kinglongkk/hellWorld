/**
 * Created by catban on 15-11-18
 */
define(['common/BaseListPage','autocompleter'], function (BaseListPage) {

    return BaseListPage.extend({
        /*是否需要统计金额*/
        hasCount:true,
       ///* selectPure:null,*/
        init: function () {
            this._super();
           // this.selectPure = new SelectPure();
            this.changeType();
        },
        bindEvent: function () {
            var _that = this;
            this._super();

            /*改变订单类别 账号类别*/
            $('.changeSearchInputName').on('change',function( event , obj ){
                var $this = $(this);
                var _data = $(this).data();
                $(_data.parent).find(_data.target).prop('name',$this.val());
            });
            /*禁止form提交*/
            $(this.formSelector).on('submit',function(){
                var $search_btn = $("._search_btn");
                //var opt = eval("(" + $search_btn.data('rel') + ")");
                //_that.query({page:window.page,currentTarget:$("._search_btn")},opt);
                $("._search_btn").click();
                return false;
            });
            //$(this.formSelector).submit(function(){
            //    debugger;
            //    return false;
            //})


            /**
             * 数据输入相关的文本框进行数字输入限制
             */
            this.validateNumber();


        },
        onPageLoad: function () {
            this._super();
        },
        /*高级筛选 按钮*/
        advancedFilter:function ( event , option) {
            var $btn = $(event.currentTarget);
            $(".advanced-options").slideToggle("10");
            $btn.parent().toggleClass("show");
            $btn.unlock();
        },
        changeType:function () {
            var $fundTypeCheckboxs = $('#fundTypeCheckboxs');
            var $fundTypeSelect = $("#fundTypeSelect");
            $fundTypeSelect.on('change',function( event , object ){
                var $this = $(this);
                $this.val();
                /*fundTypeCheckboxs*/
                /*
                 *  收入：公司存款，线上支付，手动存款，转入，返水，优惠，推荐；
                 *  支出，勾选资金类型里的：手动取款，取款，转出；
                 */
                switch($this.val())
                {
                    case '':
                        $fundTypeCheckboxs.find("input[type=checkbox]").prop('checked',false);
                        break;
                    case 'earning':
                        /*收入*/
                        $fundTypeCheckboxs.find("input[type=checkbox]").prop('checked',false);
                        $fundTypeCheckboxs.find('.earning').prop('checked',true);
                        break;
                    case 'expend':
                        /*支出*/
                        $fundTypeCheckboxs.find("input[type=checkbox]").prop('checked',false);
                        $fundTypeCheckboxs.find('.expend').prop('checked',true);
                        break;
                    case 'all':
                        /*全部*/
                        $fundTypeCheckboxs.find("input[type=checkbox]").prop('checked',true);
                        break;
                    default:
                        /**/
                        break;
                }
            });
            var allCheckbox = $('input[type="checkbox"]',$fundTypeCheckboxs)
            allCheckbox.on('click',function(){
                $fundTypeSelect.val('');
                var checkedLength = $("input[type='checkbox']:checked",$fundTypeCheckboxs).length;
                if(allCheckbox.length === checkedLength){
                    $fundTypeSelect.val('all');
                }
                $fundTypeSelect.trigger("chosen:updated");
            });
        },
        /*重写query方法*/
        query:function( e , p ){

            var $totalContent = $(".total_content");

            /*调用父类的query*/
            this._super( e , p );

            /*如果查询过列表改变 需要重新统计*/
            this.hasCount = true;

            /*如果是显示的就隐藏*/
            $totalContent.hide('normal');
        },
        totalMoney:function( event , option ){

            var _that = this;

            /*显示统计金额*/
            var $totalContent = $(".total_content");

            /*当前按钮*/
            var $currentBtn = $(event.currentTarget);

            /*需要加载才去获取*/
            if(_that.hasCount && $totalContent.is(':hidden')){
                window.top.topPage.ajax({
                    url:root+'/report/gameTransaction/totalMoney.html',
                    data:window.top.topPage.getCurrentFormData(event),
                    type:'POST',
                    success:function(data){

                        /*转换为对象*/
                        var data = eval('('+data+')');

                        /*填充*/
                        if(data.totalMoney > 0){
                            $('.total_money').addClass("co-green")
                        }else{
                            $('.total_money').addClass("co-red")
                        }
                        $('.total_money',$totalContent).text(data.totalMoney);
                        $('.total_count',$totalContent).text(data.totalCount);
                        /*展示*/
                        $totalContent.slideToggle();

                        /*统计过 置为false*/
                        _that.hasCount = false;

                        /*解锁*/
                        $currentBtn.unlock();
                    },
                    error:function(err){
                        $currentBtn.unlock();
                    }
                });
            }else{

                /*展示||隐藏*/
                $totalContent.slideToggle();

                /*解锁*/
                $currentBtn.unlock();

            }

        },

        nameClick:function(obj){
            var btnNameLi = $("#infoBox li");
            var btn_master = $("input[name='masterName']");
            btn_master.val(obj.innerHTML);
            btn_master.attr("siteid",obj.getAttribute('siteid'));//uuu
            $("#infoBox").removeClass("show");
        },

        changeKey : function(e) {
            $('#operator').attr('name', e.key).val('');
        } ,
        changeKey2 : function(e) {
            $('#operator2').attr('name', e.key).val('');
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
                window.top.topPage.showWarningMessage("查询无数据,无法导出");
                $(e.currentTarget).unlock();
                return;
            }
            var siteId= $("#siteId").val();
            if(!siteId||siteId==""){
                window.top.topPage.showWarningMessage("请选择一个站点进行统计");
                $(e.currentTarget).unlock();
                return;
            }
            opt.target =  opt.target.replace('{siteId}',siteId);
            return true;
        },
        validateNumber : function(){
            var _this = this;
            $("input[name='search.startMoney'],input[name='search.endMoney']  ")
                .on("keyup", function () {
                    if (!/^\d+[.]?\d*$/.test(this.value)){
                        this.value = /^\d+[.]?\d*$/.exec(this.value);
                    }
                    return false;
                })
        }

    });
});