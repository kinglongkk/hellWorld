define(['bootstrap-dialog','eventlock','moment','poshytip'], function (BootstrapDialog,eventlock,moment,Poshytip) {

    return Class.extend({
        titleRoot:"",
        hashEvent:{},
        oldHash:null,
        lastHash:{},
        titleFirstLevel:"",
        titleSecondLevel:"",
        bootstrapDialog:BootstrapDialog,
        dialogMessageContainer:'<div style="line-height: 60px;padding-left: 20px;"></div>',
        pages:{},
        errorPages:[602,603,604,605,404,401,403],
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init : function() {
            var _this=this;
            this.bindNavigation();
            this.titleRoot=document.title;
            window.onhashchange = this.onHashChange;
            document.onkeydown = function(event){
                var e = event ? event :(window.event ? window.event : null);
                if(e.keyCode == 116 || e.keyCode == 505)
                {
                    _this.showPage();
                    return false;
                }
            };
            $(document).ajaxComplete(function( event, xhr, settings ) {
                if(settings.loading){
                    $('div.preloader').hide();
                }
                if(xhr.status==600){//Session过期
                    window.top.location.href=window.top.root;
                }
                else if(xhr.status==601){//需要权限密码验证
                    _this.checkPrivilege({owner:window,type:0,eventTarget:settings.eventTarget,eventCall:settings.eventCall});
                }
                else if(xhr.status==606){//踢出
                    window.top.location.href = window.top.root + "/errors/" + xhr.status + ".html";
                } else if (xhr.status==608){
                    _this.showErrorMessage(window.top.message.common["repeat.request.error"],undefined,true);
                }
                else if(_this.errorPages.indexOf(xhr.status)>=0 && settings.comet!=true) {//服务器忙
                    //_this.doDialog({currentTarget:settings.eventTarget},{title:window.top.message.common["dialog.title.error"],target:window.top.root+"/errors/"+xhr.status+".html"});
                    if(!settings.error) {
                        window.top.location.href = window.top.root + "/errors/" + xhr.status + ".html";
                    }
                }
                else if(!settings.error && xhr.status!=200)
                {
                    if(settings.comet==true){
                        _this.showErrorMessage(window.top.message.common["online.message.error"],undefined,true);
                    }else{
                        _this.showErrorMessage(window.top.message.common["server.error"],undefined,true);
                    }
                    if(settings.eventTarget) {
                        $(settings.eventTarget).unlock();
                    }
                }
            });
            $("img[data-rel]").on("load",function(){
                $(this).removeAttr("data-rel");
                this.src=window.top.resRoot+"/"+this.src;
            })
        },
        /**
         * 格式化制定的日期时间
         * @param date
         * @param format
         */
        formatDateTime:function(date,format)
        {
            var theMoment=moment();
            theMoment._d=date;
            return theMoment.format(format);
        },

        /**
         * 将0时区时间转换为用户时区时间
         * @param date
         * @param format
         * @returns {*}
         */
        formatToMyDateTime:function(date,format)
        {
            var theMoment=moment();
            theMoment._d=date;
            theMoment.utcOffset(0,false);
            return theMoment.utcOffset(window.top.utcOffSet,false).format(format);
        },
        /**
         * 提示信息回调
         * @param e
         * @param btnOption
         */
        showPopoverCountDown:function(e,btnOption){
            window.setTimeout(function(){
                e.popoverObj.popover("destroy");
                //当页面变更时，这个e.popoverObj.popover("destroy")就不会生效了,所以多加一个根据proverId来销毁信息回调
                var popoverId = $(e.popoverObj).attr("aria-describedby");
                $("#"+popoverId+".popover").popover('destroy');
                if (btnOption && btnOption.callback) {
                    window.top.topPage.doPageFunction(e, btnOption.callback, btnOption);
                }
                $(e.currentTarget).unlock();
            },2000);
            /*e.popover.countdown(timeNext).on('finish.countdown', function () {
             e.popover.remove();
             if (btnOption && btnOption.callback) {
             window.top.topPage.doPageFunction(e, btnOption.callback, btnOption);
             }
             });*/
        },
        /**
         * 返回上一个页面的回调
         * @param url
         */
        goToLastPage:function(refresh)
        {
            if(!this.isEmpty(this.lastHash)) {
                this.pages[this.lastHash].refresh=(refresh||false);
                window.location.hash = this.lastHash;
            }else{
                window.location=root;
            }
        },
        /**
         * 检查一个Json对象是不是为空
         * @param obj
         * @returns {boolean}
         */
        isEmpty: function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        },
        /**
         * 处理HashChange事件，前进后退，返回最后一页等
         * @param e
         */
        onHashChange:function(e){
            var _this=window.top.topPage;
            var _newHash=window.location.hash;
            var _oldHash=this.oldHash;
            var _newPage= _this.pages[_newHash];
            $.each($("input",document),function(index,item){
                $(item).attr("value",$(item).val());
            });
            $('div.preloader').hide();
            _this.pages[_oldHash]={content:$("#mainFrame").html(),lastHash:_this.lastHash,hashEvent:_this.hashEvent,data: $.data};
            _this.lastHash=_oldHash;
            this.oldHash=_newHash;
            if(_newPage)
            {
                $("#mainFrame").html(_newPage.content);
                $.data=_newPage.data;
                $("html, body").animate({scrollTop: 0});
                window.setTimeout(function () {
                    if ((_newPage.refresh=="true" || _newPage.refresh==true) && window.page.query) {
                        var btnOption = eval("(" + $(_newPage.hashEvent.currentTarget).data('rel') + ")");
                        window.page.query({
                            currentTarget: $(window.page.formSelector)[0],//;newPage.hashEvent.currentTarget,
                            page: window.page
                        }, btnOption);
                    }
                    _this.hashEvent = _this.pages[location.hash].hashEvent;
                    _this.lastHash = _this.pages[location.hash].lastHash;
                    //$(newPage.hashEvent.currentTarget).lock();
                }, 100);
                return;
            }
            if(location.hash.length>0) {
                _this.showPage();
            }
            else
            {
                if(_this.hashEvent=={}) {
                    location.reload(true);
                }
            }
        },
        /**
         * 自动绑定Button标签的所有按钮事件
         */
        bindNavigation:function()
        {

            var _this=this;
            $(document).on("click","a[nav-top]", function (e) {
                e.preventDefault();
                _this._doNavigate(e);
                //$(window.topNav.topMenu +" li").removeClass("active");
                //$(e.currentTarget).parent().addClass("active");
            });
            $(document).on("click","a[nav-second]", function (e) {
                e.preventDefault();
                _this._doNavigate(e);
            });
            $(document).on("click","a[nav-target]", function (e) {
                e.preventDefault();
                _this._doNavigate(e);
            });
        },
        _doNavigate:function(e)
        {

            this.hashEvent={currentTarget:e.currentTarget};

            var url= $(this.hashEvent.currentTarget).attr("href");

            this.pages["#"+url]=null;
            if(window.location.hash==("#"+url))
            {
                this.showPage();
            }
            else{
                window.location.hash=url;
            }
        },

        loading: function() {
            var obj = 'div.preloader';
            $(obj).show();
            var _this = this;
            this.center(obj);
            $(window).scroll(function() {
                _this.center(obj);
            });
            $(window).resize(function() {
                _this.center(obj);
            });
        },
        center: function(obj) {
            var windowHeight = document.documentElement.clientHeight;
            $(obj).css({
                "position": "absolute",
                "top": (windowHeight - 200) / 2 + $(document).scrollTop(),
            });
        },
        /**
         * 显示最后一次点击的 {nav-top,nav-second,nav-target} 页面
         */
        showPage:function(url){
            var _this=this;
            var $obj= $(_this.hashEvent.currentTarget);
            var level=3;
            url= url||$obj.attr("href");
            if(!url || url=="" || url=="/"){
                //$obj.unlock();
                return;
            }
            /*if(_this.hashEvent) {
                $("li",_this.getFirstParentByTag(_this.hashEvent, "ul")).removeClass("active");
            }
            $obj.parent().addClass("active");*/
            var target=$obj.attr("nav-top")||$obj.attr("nav-second")||$obj.attr("nav-target");
            if(!target){
                target="mainFrame";
            }
            if($obj.attr("nav-top"))
            {
                level=1;
            }
            if($obj.attr("nav-second"))
            {
                level=2;
            }
            if($obj.attr("nav-target"))
            {
                level=3;
            }

            //lock
            this.ajax({
                mimeType: 'text/html; charset=utf-8', // ! Need set mimeType only when run from local file
                url: root+url,
                type: 'GET',
                dataType: "html",
                loading:level!=1,//一级菜单不需要显示遮罩
                eventTarget:{currentTarget:_this.hashEvent.currentTarget},
                eventCall:eventCall=function(e){
                    _this.showPage();
                },
                success: function(data) {
                    if(level==1)
                    {
                        _this.titleSecondLevel="";
                        $("#"+ target).html(data);
                        var text= $("span",$obj).text();
                        _this.titleFirstLevel=text;
                        //加载二级菜单第一条
                        /*$("#side-menu").find("li:first").addClass("active");
                        var menuitem= $("#side-menu li a[nav-second]","#"+ target);
                        if(menuitem.length>0 && ! $(menuitem[0]).hasClass("shortcut-class")){
                            $('.preloader').show();
                            $("#mainFrame").load(root+$(menuitem[0]).attr("href"),function(){
                                $('.preloader').hide();
                            });

                        }*/
                    }
                    else if(level==2)
                    {
                        $("#"+ target).html(data);
                        var text=$obj.text();
                        if($("span",$obj).length>0)
                        {
                            if($("span",$obj)[0].childNodes.length>0) {
                                text= $("span",$obj)[0].childNodes[0].nodeValue;
                            }else{
                                text=$("span", $obj)[0].innerText;
                            }
                        }

                        _this.titleSecondLevel=text;
                    }else
                    {
                        $("#"+ target).html(data);
                    }

                    document.title=_this.currentMenuTitle();

                    //$obj.unlock();
                    //document.activeElement=document.body;
                    //document.activeElement.focus();
                }
            });

        },
        /**
         * 获取默认的消息提示的容器
         * @param msg
         * @returns {*}
         */
        getDefaultMessageContainer:function(msg){
            return $(this.dialogMessageContainer).html(msg)[0];
        },
        /**
         * 显示提示信息，time后隐藏
         * @param msg 提示信息
         * @param time 显示时间
         * @param callback  回调
         */
        showTips:function(msg,time,callback){

        },
        /**
         * 提示错误信息
         * @param msg       错误信息字符串
         */
        showErrorMessage:function(msg,callback,autoClose){
            callback=this._showCallback(callback);
            var option={
                type: BootstrapDialog.TYPE_DANGER,
                title:window.top.message.common["dialog.title.error"],
                onhidden:callback,
                message: this.getDefaultMessageContainer(msg)};
            if(autoClose==true){
                option.onshow=function(){
                    var _this=BootstrapDialog.dialogs[this.id];
                    window.setTimeout(function(){_this.close();},2000)
                };
            }
            BootstrapDialog.show(option);
        },
        /**
         * 提示信息
         * @param msg       信息字符串
         */
        showInfoMessage:function(msg,callback){
            callback=this._showCallback(callback);
            var option={
                type: BootstrapDialog.TYPE_INFO,
                title:window.top.message.common["dialog.title.info"],
                onhidden:callback,
                message: this.getDefaultMessageContainer(msg)};
            BootstrapDialog.show(option);
        },
        /**
         * 提示成功信息
         * @param msg       成功信息字符串
         */
        showSuccessMessage:function(msg,callback){
            callback=this._showCallback(callback);
            var option={
                type: BootstrapDialog.TYPE_SUCCESS,
                title:window.top.message.common["dialog.title.success"],
                onhidden:callback,
                message: this.getDefaultMessageContainer(msg),
                buttons: [{
                    label: BootstrapDialog.DEFAULT_TEXTS.OK,
                    action: function(dialog) {
                        dialog.setData('btnClicked', true);
                        typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
                        dialog.close();
                    }
                }]};
            BootstrapDialog.show(option);
        },
        /**
         * 提示警告信息
         * @param msg       警告信息字符串
         */
        showWarningMessage:function(msg,callback){
            callback=this._showCallback(callback);
            var option={
                type: BootstrapDialog.TYPE_WARNING,
                title:window.top.message.common["dialog.title.warning"],
                onhidden:callback,
                message: this.getDefaultMessageContainer(msg)};
            BootstrapDialog.show(option);
        },
        /**
         * 提示警告信息
         * @param msg       警告信息字符串
         */
        showConfirmMessage:function(msg,callback){
            callback=this._showCallback(callback);
            BootstrapDialog.confirm({
                type: this.bootstrapDialog.TYPE_WARNING,
                title:window.top.message.common["dialog.title.confirm"],
                callback:callback,
                message: this.getDefaultMessageContainer(msg)});
        },
        /**
         * 提示警告信息(可以自己定义标题、按钮名称)
         * @param title       标题
         * @param msg         警告信息字符串
         * @param okLabel     确认按钮名称
         * @param cancelLabel 取消按钮名称
         * @param callback    回调方法
         */
        showConfirmDynamic:function(title,msg,okLabel,cancelLabel,callback){
            callback=this._showCallback(callback);
            BootstrapDialog.confirmDynamic(title,this.getDefaultMessageContainer(msg),okLabel,cancelLabel,this._showCallback(callback));
        },

        /**
         * 提示警告信息(可以自己定义标题、按钮名称,关闭按钮)
         * @param title       标题
         * @param msg         警告信息字符串
         * @param okLabel     确认按钮名称
         * @param cancelLabel 取消按钮名称
         * @param callback    回调方法
         * @param closable    对话框关闭按钮
         */
        showConfirmDynamic:function(title,msg,okLabel,cancelLabel,callback,closable){
            callback=this._showCallback(callback);
            BootstrapDialog.confirmDynamic(title,
                {
                    title:title,
                    message:this.getDefaultMessageContainer(msg),
                    btnOKLabel:okLabel,
                    btnCancelLabel:cancelLabel,
                    callback:this._showCallback(callback),
                    closable:closable
                });
        },

        /**
         * 提示信息 只有一个按钮
         * @param title
         * @param msg
         * @param buttonLabel 按钮文字
         * @param callback
         */
        showAlertMessage:function(title,msg,buttonLabel,callback){
            callback=this._showCallback(callback);
            BootstrapDialog.alert({title:title,message:this.getDefaultMessageContainer(msg),buttonLabel:buttonLabel,callback:callback});
        },
        /**
         * 处理弹出对话框的Body的样式问题，引起滚动条消失
         * @param callback
         * @returns {*}
         * @private
         */
        _showCallback:function(callback){
            if(callback){
                return function(returnValue){
                    callback(returnValue);
                    $(window.top.document.body).removeClass("modal-open");
                }
            }
            else{
                return callback;
            }
        },
        /**
         * 自动绑定Button标签的所有按钮事件
         */
        bindButtonEvents:function(page,doc)
        {
            var _this=this;
            $(page.formSelector,doc).on("click", "[data-rel]", function (e) {
                var isLocked = $(e.currentTarget).isLocked();
                if (isLocked) {
                    return false;
                }
                $(e.currentTarget).lock();
                var _target=e.currentTarget;
                e.preventDefault();
                var _e={currentTarget: _target, page:e.page||page};
                var btnOption = eval("(" + $(_target).data('rel') + ")");
                if(_target.title){
                    btnOption.text=_target.title;
                }
                //lock

                if (btnOption.confirm) {
                    _this.showConfirmMessage(btnOption.confirm, function (result) {
                        if (result) {
                            _this._doEvents(page, _e, btnOption);
                        }
                        else {
                            $(_target).unlock();

                        }
                    })
                }
                else {
                   return  _this._doEvents(page, _e, btnOption);
                }
            });
        },
        /**
         * 事件执行方法体
         * @param page          Page对象
         * @param e             事件对象
         * @param btnOption     Button标签的参数
         * @private             私有事件
         */
        _doEvents: function (page, e, btnOption) {
            if (btnOption.precall && !this.doPageFunction(e, btnOption.precall, btnOption)) {
                $(e.currentTarget).unlock();
                return false;
            }
            page.parentTarget = e.currentTarget;
            if (btnOption.opType == "dialog") {
                this.doDialog(e, btnOption);
            } else if (btnOption.opType == "ajax") {
                this.doAjax(e, btnOption);
            } else if (btnOption.opType == "function") {
                this.doPageFunction(e, btnOption.target, btnOption)
            }
        },
        /**
         * 获取顶级或者指定窗口的可用大小
         * @param win       指定的Window对象，为空时则取window.top对象
         * @returns {*[]}   尺寸的数字数组，如：[750 ,500]
         */
        getWindowSize:function(win)
        {
            if(win==null)
            {
                win=window.top;
            }
            var h= win.document.compatMode == "CSS1Compat" ? win.document.documentElement.clientHeight : win.document.body.clientHeight;
            var w= win.document.compatMode == "CSS1Compat" ? win.document.documentElement.clientWidth : win.document.body.clientWidth;
            return [w,h];
        },
        /**
         * 根据指定的区域大小计算居中的位置
         * @param offset    以逗号隔开的两个数字字符串，如：”700,400“
         * @param area      区域大小的数字数组，如：[750 ,500]
         * @returns {*[]}   位置的数字数组，如：[750 ,500]
         */
        getCenterOffset:function(offset,area)
        {
            if(offset &&  typeof offset == "string")
            {
                offset= offset.split(",");
            }
            if(!offset) {
                var size=this.getWindowSize();
                var left=(size[0]-area[0])/2;
                var top=(size[1]-area[1])/2;
                return [top>0?top:0,left>0?left:0];
            }
        },
        /**
         * 根据传入的字符串获取指定或默认区域大小
         * @param area      以逗号隔开的两个数字字符串，如：”700,400“
         * @returns {*[]}   区域大小的数字数组，如：[750 ,500]
         */
        getArea:function(area)
        {
            if(area &&  typeof area == "string")
            {
                area= area.split(",");
            }
            if(!area) {
                area =  [750 ,500];
            }
            return area;
        },
        /**
         * 根据当前的时间对象获取所对应的Form对象
         * @param e         发起事件
         * @returns {*}     返回Form对象
         */
        getFirstParentByTag:function(e,tag)
        {
            tag=tag.toLowerCase();
            var $form= e.currentTarget;
            while($form && $form.tagName.toLowerCase()!=tag)
            {
                if($form.parentElement) {
                    $form=$form.parentElement;
                } else {
                    break;
                }
            }
            if($form && $form.tagName.toLowerCase()==tag) {
                return $form;
            }
            else
            {
                return window.document.forms[0];
            }
        },
        /**
         * 根据当前的时间对象获取所对应的Form对象
         * @param e         发起事件
         * @returns {*}     返回Form对象
         */
        getCurrentForm:function(e)
        {
            return this.getFirstParentByTag(e,"form");
        },
        /**
         *获取当前事件Form对象的Action属性
         * @param e             事件对象
         * @returns {string}    Form的Action
         */
        getCurrentFormAction:function(e)
        {
            return this.getFirstParentByTag(e,'form').action;
        },
        /**
         * 获取当前事件Form数据的serialize值
         * @param e             事件对象
         * @returns {*|jQuery}  Form数据serialize值
         */
        getCurrentFormData:function(e)
        {
            return $(this.getFirstParentByTag(e,'form')).serialize();
        },
        /**
         * 根据参数打开一个对话框
         * @param e             事件对象
         * @param btnOption     Button标签的参数
         */
        doDialog:function(e,btnOption)
        {
            var _this=this;
            var option= {
                title: btnOption.text,
                closable:btnOption.closable=="false"?false:btnOption.closable,
                message: function(dialog) {
                    if(dialog.options.closable==false){
                        $(".close",dialog.$modalHeader).remove();
                    }
                    var $message = $("<iframe frameBorder='0' scrolling='no' width='100%' style='overflow:visible;height:auto' src='"+btnOption.target+"'></iframe>");
                    $message.bind("load",function()
                    {
                        //传递Page对象到
                        this.contentWindow.openPage = e.page;
                        _this.doResizeDialog(dialog);
                    });
                    return $message;
                },
                onhidden:function(dialog){
                    try {
                        if ($("iframe", dialog.$modalContent)[0].contentWindow.page) {
                            e.returnValue = $("iframe", dialog.$modalContent)[0].contentWindow.page.returnValue;
                        }
                    }catch(ex)
                    {

                    }
                    _this._callbackDialog(e,btnOption)
                }
            };
            if(btnOption.size!=this.bootstrapDialog.SIZE_NORMAL &&
                btnOption.size!=this.bootstrapDialog.SIZE_WIDE &&
                btnOption.size!=this.bootstrapDialog.SIZE_LARGE)
            {
                option.cssClass= btnOption.size;
            }
            else
            {
                option.size= btnOption.size;
            }

            //btnOption.offset= _this.getCenterOffset(btnOption.offset,btnOption.area);
            _this.openDialog(option);
        },
        doResizeDialog:function(dialog){
            if(dialog!=null) {
                var _body = $("iframe", dialog.$modalDialog)[0].contentWindow.document.body;
                var $modalbody=$(".modal-body", _body);
                var $modalfooter=$(".modal-footer", _body);
                var footerHeight=0;
                if($modalfooter.length>0){
                    footerHeight=$modalfooter.outerHeight();
                }
                if($modalbody.length!=0){
                    var innerHeight=0;
                    $.each($modalbody[0].childNodes, function (node, obj) {
                        if (obj.tagName) {
                            if(obj.tagName=='BR'){
                                innerHeight += 20;
                            }else{
                                innerHeight += obj.clientHeight+parseInt($(obj).css("margin-top"))+parseInt($(obj).css("margin-bottom"));
                            }

                        }
                    });
                    var innerHeight=innerHeight+footerHeight;
                    var dialogOuterHeight=dialog.$modalHeader.outerHeight()+dialog.$modalFooter.outerHeight();
                    var dialogInnerHeight=$(window.top).height()-dialogOuterHeight-100;
                    var frameHeight=dialogInnerHeight>innerHeight?innerHeight:(dialogInnerHeight);
                    var maxBodyHeight=dialogInnerHeight>innerHeight?(innerHeight -footerHeight):(dialogInnerHeight -footerHeight-5);
                    $modalbody.css("max-height", maxBodyHeight+45);
                    $("iframe", dialog.$modalContent).css("height", frameHeight+45);
                }else{
                    var bodyInner=0;
                    $.each(_body.childNodes, function (node, obj) {
                        if (obj.tagName) {
                            bodyInner += obj.clientHeight + parseInt($(obj).css("margin-top")) + parseInt($(obj).css("margin-bottom"));
                        }
                    });
                    $("iframe", dialog.$modalContent).css("height", bodyInner>_body.clientHeight?bodyInner:_body.clientHeight);
                }
            }
        },
        /**
         * 执行一个Ajax操作
         * @param e             事件对象
         * @param btnOption     Button标签的参数
         */
        doAjax:function(e,btnOption)
        {
            var _this=this;
            var option={
                cache: false,
                loading:true,
                dataType:'json',
                eventTarget: {currentTarget:e.currentTarget},
                url:  btnOption.url||btnOption.href||btnOption.target,
                error: function(request, state, msg) {
                    $(e.currentTarget).unlock();
                    var message = msg;
                    if(request.responseJSON && request.responseJSON.message){
                        message = request.responseJSON.message;
                    }
                    if (request.status != 601 && request.status != 608) {
                        _this.showErrorMessage(message);
                    }
                },
                success: function(data) {
                    /*if(btnOption.success){
                        btnOption.success(data);
                    }*/
                    _this._callbackAjax(data,e,btnOption);
                }
            };
            //btnOption.post    为获取数据的js方法名
            if(btnOption.post)
            {
                option.type="POST";
                option.data=this.doPageFunction(e, btnOption.post,btnOption);
            }
            if(btnOption.dataType)
            {
                option.dataType=btnOption.dataType;
            }
            option.eventCall=function(e){
                _this.ajax(option);
            };
            this.ajax(option);
        },
        /**
         * 封装Jquery Ajax操作，处理异步引起的登录问题的处理
         * @param option
         */
        ajax:function(option){
            if(!option.url || option.url==root)
            {
                console.log("url: invalide!");
                return;
            }
            /*if(!option.loading){
                option.loading=true;
            }*/
            if(option.loading){
                this.loading();
                // $('.preloader').css("width",document.body.clientWidth)
                //     .css("height", $(window).height()>document.body.clientHeight?$(window).height():document.body.clientHeight).show();
                // $('.preloader dd').css("margin-top",$(window).height()/2);
            }
            if (option.success) {
                var oldSuccess = option.success;
                option.success = function (data) {
                    if (data.token) {
                        if ($(document).find("input[name=gb\\.token]") && $(document).find("input[name=gb\\.token]").size() > 0) {
                            $(document).find("input[name=gb\\.token]").val(data.token);
                        }
                        if ($("iframe",document).contents().find("input[name=gb\\.token]")) {
                            $("iframe",document).contents().find("input[name=gb\\.token]").val(data.token);
                        }
                    }
                    oldSuccess(data);
                };
            }
            $.ajax(option);
        },
        /**
         * 打开一个对话框
         * @param option        对话框参数
         */
        openDialog:function(option)
        {
            var opt={
                title: option.title,
                closeByBackdrop: false,
                closable: true,
                draggable: true,
                shade: 0.8
            };
            $.extend(opt, option);
            BootstrapDialog.show(opt);
        },
        /**
         * 关闭最上层的对话框
         */
        closeDialog:function()
        {
            var topDialog=null;
            if(BootstrapDialog.dialogsArray.length>0) {
                var topDialog=BootstrapDialog.dialogsArray.pop();
                while(!(topDialog.isRealized() && topDialog.isOpened())){
                    topDialog=BootstrapDialog.dialogsArray.pop();
                }
                topDialog.close();
            }
            /*
            $.each(BootstrapDialog.dialogs, function(id, dialogInstance) {
                if (dialogInstance.isRealized() && dialogInstance.isOpened()) {
                    if(topDialog==null) {
                        topDialog = dialogInstance;
                    }
                    else{
                        if(dialogInstance.$modal.css("z-index")>topDialog.$modal.css("z-index"))
                        {
                            topDialog = dialogInstance;
                        }
                    }
                }
            });
            topDialog.close();*/
        },
        /**
         * 执行当前对象的指定方法
         * PageFunction需要自行决定是否需要解锁相应的按钮
         * @param e             事件对象
         * @param func          方法名称，不带括号和参数
         * @param option        Button标签的参数
         * @returns {*}         执行成功则返回方法的返回值，不成功则提示
         */
        doPageFunction:function(e,func,option)
        {
            var _this=this;

            if(func.constructor == Function || (func.constructor.name && func.constructor.name == "Function")) {
                return func.apply(null,[e,option]);
            }
            if(func.constructor == String)
            {
                var page=e.page;
                var funcs=func.split(".");
                for(var i=0;i<funcs.length-1;i++){
                    page=page[funcs[i]];
                }
                if(funcs[funcs.length-1]!=""){
                    var fn = page[funcs[funcs.length-1]];
                    if (typeof fn === "function") {
                        var rs = fn.call(page,e,option);
                        return rs;
                    }
                }

            }
            if(func!=undefined && func!="" && func.constructor != Function)
            {
                console.log("Function "+func +" is not found!");
                _this.showErrorMessage("Function "+func +" is not found!");
            }
            $(e.currentTarget).unlock();
        },

        /**
         * 对话框关闭前的回调函数
         * @param e         事件对象
         * @private         私有方法
         */
        _callbackDialog:function(e,btnOption)
        {
            //unclock
            if(e.currentTarget) {
                $(e.currentTarget).unlock();
            }
            if(btnOption && btnOption.callback) {
                this.doPageFunction(e, btnOption.callback, btnOption);
            }
        },

        /**
         * Ajax方法执行成功时的回调函数
         * @param data      Ajax返回的数据
         *                  data.msg：为空时，不弹出确认提示
         * @param e         事件对象
         * @private         私有方法
         */
        _callbackAjax:function(data,e,btnOption)        {

            var _this=this;
            btnOption.data=data;

            if(data.msg) {
                if(e.currentTarget) {
                    var msgType=data.state==true?'success':'danger';
                    e.page.showPopover(e,btnOption,msgType,data.msg,true);
                    $(e.currentTarget).unlock();
                    //var timeNext = new Date();
                    //timeNext.setTime(timeNext.getTime() + 1500);
                    //$(e.currentTarget).countdown(timeNext).on('finish.countdown', function () {
                    //    $(e.currentTarget).popover("destroy");
                    //    if (btnOption && btnOption.callback) {
                    //        _this.doPageFunction(e, btnOption.callback, btnOption);
                    //    }
                    //});
                }else{
                    if(data.state) {
                        this.showSuccessMessage(data.msg, function () {
                            if(btnOption && btnOption.callback) {
                                _this.doPageFunction(e, btnOption.callback, btnOption);
                            }
                        });
                    } else {
                        this.showErrorMessage(data.msg,function () {
                            if(btnOption && btnOption.callback) {
                                _this.doPageFunction(e, btnOption.callback, btnOption);
                            }
                        });
                    }
                }
            }
            if(!data.msg && btnOption.callback){
                _this.doPageFunction(e, btnOption.callback, btnOption);
            }
        },
        currentMenuTitle: function () {
            return this.titleRoot+(this.titleFirstLevel.length>0?(" - " + this.titleFirstLevel):"")
                +(this.titleSecondLevel.length>0?(" - " + this.titleSecondLevel):"");
        },
        getUrlParam : function(local,url) {
            var reg = new RegExp("(^|&)" + url + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
            var r = local.search.substr(1).match(reg);  // 匹配目标参数
            if (r != null) return unescape(r[2]); return null; // 返回参数值
        },

        getWebRootPath: function () {
            var webroot = document.location.href;
            webroot = webroot.substring(webroot.indexOf('//') + 2, webroot.length);
            webroot = webroot.substring(webroot.indexOf('/') + 1, webroot.length);
            webroot = webroot.substring(0, webroot.indexOf('/'));
            var rootpath = "/" + webroot;
            return rootpath;
        },
        /**
         * 弹出安全密码的检查是否验证过
         * @param e
         * @returns {boolean}
         */
        checkPrivilege: function (e) {
            var _this = this;
            var url = "/privilege/checkPrivilege.html";
            var result = false;
            if (typeof PrivilegeStatusEnum == 'undefined') {
                var PrivilegeStatusEnum = {};
                PrivilegeStatusEnum.ALLOW_ACCESS = 100;
                PrivilegeStatusEnum.LOCKED = 99;
                PrivilegeStatusEnum.ERROR = 98;
                PrivilegeStatusEnum.NOT_SET = 96;
                PrivilegeStatusEnum.NOT_VALID = 0;
            }
            var pwdIsNull = false;
            window.top.topPage.ajax({
                url: root + url,
                dataType: 'json',
                cache: false,
                type: "get",
                async: false,
                success: function (data) {
                    if (data.state == PrivilegeStatusEnum.NOT_VALID) {
                        url = "/privilege/showCheckPrivilege.html";
                    } else if (data.state == PrivilegeStatusEnum.ALLOW_ACCESS) {
                        //do nothing
                        result = true;
                    } else if (data.state == PrivilegeStatusEnum.LOCKED) {
                        url = "/privilege/showLockPrivilege.html";
                    } else if (data.state == PrivilegeStatusEnum.ERROR) {
                        url = "/privilege/showCheckPrivilege.html";
                    } else if (data.state == PrivilegeStatusEnum.NOT_SET) {
                        pwdIsNull = true;
                        url = "/privilege/setPrivilegePassword.html";
                    }
                }
            });
            if (!result) {
                var title = window.top.message.privilege['title'];
                if(pwdIsNull){
                    title = window.top.message.privilege['privilege.setpermissionPwd'];
                }
                var option = {
                    target: root + url,
                    text: title,
                    callback:function(event, option){
                        /*if(pwdIsNull){
                            var reqUrl = window.location.hash;
                            reqUrl = reqUrl.substring(1,reqUrl.length);
                            var url = root+reqUrl;
                            window.top.topPage.ajax({
                                url: url,
                                success: function(data) {
                                    $("#mainFrame").html(data);
                                    $("#bankInfo .bottomline").css("display","");
                                    $("#bankInfo .set").hide();
                                    $("#bankInfo .shrink").css("display","block");
                                },
                                error: function(data) {
                                }
                            });
                        }else {*/
                            if (!e.eventTarget) {
                                e.eventTarget = {};
                            }
                            e.eventTarget.returnValue = event.returnValue;
                            if (e.type == 0) {
                                if (e.eventCall && event.returnValue == true) {
                                    e.eventCall(e.eventTarget);
                                }
                            }
                            else if (e.type == 1 && e.owner.location.href == window.top.location.href) {
                                _this.showPage();
                            }
                            else if (e.owner.location.href != window.top.location.href) {
                                if (!event.returnValue || event.returnValue == false) {
                                    window.top.topPage.closeDialog();
                                }
                                // 安全密码正确之后404所注释
                                // else {
                                //     e.owner.location.href = e.url;
                                // }
                            }
                            else {
                                $(e.eventTarget.currentTarget).click();
                            }
                        /*}*/
                    }
                };
                window.top.topPage.doDialog(e, option);
            } else {
                return result;
            }
        },
        /**
         * 初始化单个图片上传带预览功能
         * @param input
         * @param img
         * @param option
         * {
         *  maxImageWidth:最大宽度,
         *  maxImageHeight:最大高度,
         *  minImageWidth:最小宽度,
         *  minImageHeight:最小高度,
         *  maxFileSize:最大文件大小,
         *  allowedFileExtensions:允许的文件扩展名数组}
         */
        initFileWithPreview:function(input,img,option)
        {
            var _this=this;
            var $input=$(input);
            var $img=$(img);
            var maxFileSize=parseInt(option.maxFileSize||0);
            var allowedFileExtensions=option.allowedFileExtensions||undefined;

            $img.load(function(){
                if((option.maxImageWidth && option.maxImageWidth<this.width) ||
                    (option.maxImageHeight && option.maxImageHeight<this.height) ||
                    (option.minImageWidth && option.minImageWidth>this.width) ||
                    (option.minImageHeight && option.minImageHeight>this.height)){

                    var msg=window.top.message.common["file.image.fileSize.isNotAllowed"];
                    if(option.callback){
                       msg =  option.callback(this);
                    }else {
                        var imageSize;
                        var maxImage = (option.maxImageWidth + "x" + option.maxImageHeight);
                        var minImage = (option.minImageWidth + "x" + option.minImageHeight);
                        if (maxImage && minImage) {
                            imageSize = minImage + " ~ " + maxImage;
                        }
                        else {
                            imageSize = minImage || maxImage;
                        }
                        var args = [imageSize];
                        msg = msg.replace(/\{(\d+)\}/g, function (m, n) {
                            return args[n];
                        });
                    }
                    _this.showWarningMessage(msg);
                    $input[0].value="";
                    $img.attr('src', "");
                    return false;
                }
            });

            $input.change(function(){
                if ($input[0].files && $input[0].files[0]) {
                    if(maxFileSize>0 && maxFileSize<(($input[0].files[0].size || 0) / 1024)){
                        var msg = "";
                        var args=0;
                        if (maxFileSize>=1024) {
                            msg=window.top.message.common["file.image.maxFileSize.isNotAllowed"];
                            args=[maxFileSize / 1024];
                        } else {
                            msg=window.top.message.common["file.image.maxFileSize.isNotAllowed2"];
                            args=[maxFileSize];
                        }
                        msg=msg.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
                        _this.showWarningMessage(!!option.msgSizeTooLarge?option.msgSizeTooLarge:msg);
                        $input[0].value="";
                        return false;
                    }
                    var fileExt=$input[0].files[0].name.substring($input[0].files[0].name.indexOf("."));
                    if(allowedFileExtensions && allowedFileExtensions.indexOf(fileExt)<0){
                        _this.showWarningMessage(window.top.message.common["file.fileType.isNotAllowed"]);
                        $input[0].value="";
                        return false;
                    }

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $img.attr('src', e.target.result);
                    };
                    reader.readAsDataURL($input[0].files[0]);
                }
                else
                {
                    //$img.attr('src', "");
                }
            });
        },
        /**
         * 图片全屏预览组件
         * @param e
         * @param opt
         */
        imageSilde:function(e,opt)
        {
            $(e.currentTarget).unlock();
            if(!e.imgs){
                return false;
            }
            $(window.top.document.body).css({"height":$(window).height(),"overflow":"hidden"});
            $(window.top.document.documentElement).css({"height":$(window).height(),"overflow":"hidden"});
            var size={"height":$(window).height(),"width":$(window).width()};
            var $container= $("<div class='container carousel-fill' style='background-color: #000000;opacity:1;padding:0px;position: absolute;z-index: 9999;left:0px;top:0px;'>" +
                "    <div id='myCarousel' class='carousel slide'>" +
                "        <div class='carousel-control' style='width:100%;font-size: 60px;z-index:999;height: 60px;line-height: 30px;text-align:right;background-color: transparent;'><button class='close' style='opacity:1;color: #ffffff;font-size: 30px;'>×</button></div>"+
                "        <div class='carousel-inner'>" +
                "        </div>" +
                "        <div class='pull-center'>" +
                "            <a class='carousel-control left "+ (e.imgs.length === 1 ? "hide":"")+"' style='z-index:998;font-size: 130px;' href='#myCarousel' data-slide='prev'>‹</a>" +
                "            <a class='carousel-control right "+ (e.imgs.length === 1 ? "hide":"")+"' style='z-index:998;font-size: 130px;' href='#myCarousel' data-slide='next'>›</a>" +
                "        </div>" +
                "    </div>" +
                "</div>");

            //TODO e.imgs
            $.each(e.imgs,function(index,obj){
                var $item=$("<div class=' item'><div class='carousel-fill' ><img /></div></div>");
                $("img",$item).attr("src",obj);
                if(index==0)
                {
                    $item.addClass("active");
                }
                $(".carousel-fill",$item).css(size);
                $(".carousel-inner",$container).append($item);
            });
            $container.css(size);
            $container.css("line-height",$(window).height()+"px");
            $('.close',$container).bind("click",function()
            {
                $(window.top.document.documentElement).css({"height":"auto","overflow":"auto"});
                $(window.top.document.body).css({"height":"auto","overflow":"auto"});
                $container.remove();
            });
            $container.appendTo(window.top.document.body);
            $(".carousel",$container).carousel();
        },
        customerPopover: function (obj,msg) {
            //自定义弹出显示
            obj.popover({
                placement: 'top',
                title: function () {
                    return "";
                },
                container: "body",
                html: true,
                template: "<div class='popover success' role='tooltip'><div class='arrow'></div><div class='popover-content'></div></div>",
                content: msg
            });
            var show = obj.popover('show');
            window.setTimeout(function(){
                show.popover("destroy");
                var popoverId = $(obj).attr("aria-describedby");
                $("#"+popoverId+".popover").popover('destroy');
            },1500);
        }
    });

});