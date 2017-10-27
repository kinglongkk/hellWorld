define(['jquery'], function (jquery) {

    return Class.extend({
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init : function() {
            var _this=this;
            _this.bindEvent(_this);
            _this.initAjaxList(_this);
        },
        name:"select",
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function(_this) {
            $(document).on("click","div ul li [role='menuitem']", function (e) {
                var _div = $(this).parent().parent().parent();

                _div.find("input[type='hidden']").val($(this).attr("key"));
                _div.find("[prompt='prompt']").html($(this).html());
                _div.attr("value",$(this).attr("key"));
                var _value = _div.attr("value");

                var _e = {
                    currentTarget: e.currentTarget,
                    page: window.page,
                    key: $(this).attr("key"),
                    value: $(this).html()
                };
                var hdInput= _div.find("input[type='hidden']");
                hdInput.trigger('change',_e);
                if(hdInput.valid) {
                    hdInput.valid();
                }
                if(_div.attr("callback")!=null && _div.attr("callback")!=""){
                    window.top.topPage.doPageFunction(_e,_div.attr("callback"),null);
                }
                var _relSelect=_div.attr("relselect");
                if(_relSelect && _relSelect!="") {
                    $.each(_relSelect.split(","), function (index, item) {
                        var _relObj = $(document).find("[selectDiv='" + item + "']");
                        if (_value == null && _value == "") {
                            _this.clearOption(_relObj);
                        } else {
                            _this.ajaxList(_relObj);
                        }
                    });
                }
            });
            $(document).on('click','[data-toggle="dropdown"]',function(event){
                var $this=$(this);
                if($this.parent().attr("disable")){
                    event.preventDefault();
                    return false;
                }
                _this.setSelectHeight($this);
            });
        },
        setSelectHeight:function($this){
            var maxHeight= 300;
            if(!$this.parent().hasClass("dropup")){
                var maxHeight1=document.body.clientHeight-$this.parent()[0].offsetTop-$this[0].clientHeight-20;
                var maxHeight2=$(window).height()-$this.parent()[0].offsetTop-$this[0].clientHeight-20;
                if(maxHeight1>maxHeight2){
                    maxHeight=maxHeight2
                }
                else{
                    maxHeight=maxHeight1;
                }
                if(maxHeight>300){
                    maxHeight=300;
                }
            }
            var ul=$('ul[class="dropdown-menu"]',$this.parent());

            ul.css("maxHeight",maxHeight)
                .css("minWidth",93).css("minHeight",25).css('overflow-y','auto').css('overflow-x','visible');
        },
        /**
         * 异步加载下拉款选项
         * @param _this
         */
        initAjaxList : function(_this){
            $(document).find("[ajaxListPath]").each(function(){
                var _div = $(this);
                if (!_div.attr("inited")) {
                    _this.ajaxList(_div)
                } else {
                    _div.attr("inited", "true");
                }
            });
        },
        /**
         * 设置为Null
         * @param _this
         */
        setNull : function (_this,_relObj){
            _relObj.find("[prompt='prompt']").html(_relObj.attr("initPrompt"));
            _relObj.find("input[type='hidden']").val('');
            _relObj.attr("value",'');
            if(_relObj.attr('relSelect')!=null){
                var __relObj =  $(document).find("[selectDiv='"+_relObj.attr('relSelect')+"']");
                _this.setNull(_this,__relObj);
                //__relObj.hide();
            }
        },
        ajaxList : function(ele,_url){

            var $ele=$(ele);
            if($ele[0].tagName=="INPUT"){
                $ele=$ele.parent();
            }
            var relSelectPath=$ele.attr('relSelectPath');
            if(relSelectPath) {
                var matchs=relSelectPath.match(/#[^#]+#/g);
                if(matchs) {
                    $.each(matchs, function (index, item) {
                        var _relObj = $(document).find("[selectDiv='" + item.replace(/#/g, "") + "']");
                        var val = _relObj.attr("value");
                        if (val && val != "") {
                            relSelectPath = relSelectPath.replace(item, val);
                        }
                    });
                }
                if(relSelectPath.indexOf("#")>0){
                    return false;
                }
                _url=relSelectPath;
            }else{
                if(!_url) {
                    _url = $ele.attr('ajaxListPath')
                }
            }
            var _this=this;
            var _prompt = null;
            var _key = null;
            window.top.topPage.ajax({
                url:_url,
                dataType:'json',
                cache: false,
                type:"get",
                success:function(data){
                    _this.clearOption($ele);
                    if(Array.isArray(data)){
                        $.each(data, function(i,item){
                            _this.addOption($ele,item[$ele.attr('listKey')],item[$ele.attr('listValue')]);
                            if(item[$ele.attr('listKey')]==$ele.attr('value')){
                                _prompt = item[$ele.attr('listValue')];
                                _key = item[$ele.attr('listKey')];
                            }
                        });
                    }else{
                        $.each(data, function(key, value) {
                            _this.addOption($ele,key,value);
                            if(key==$ele.attr('value')){
                                _prompt = value;
                                _key = key;
                            }
                        });
                    }
                    if(_prompt!=null){
                        $ele.find("input[type='hidden']").val(_key);
                        $ele.find("[prompt='prompt']").html(_prompt);
                    }
                    /**
                     * 计算下拉的高度
                     * @type {number}
                     */
                    _this.setSelectHeight($ele);

                    $ele.show(function(){
                        if($ele.attr("relSelect")){
                            var _relObj = $(document).find("[selectDiv='" + $ele.attr("relSelect") + "']");
                            _this.ajaxList(_relObj,null);
                        }
                    });
                }});
        },
        /**
         * 隐藏该控件
         * @param ele
         */
        hide:function(ele){
            var $ele=$(ele);
            $ele=this._check($ele);
            $ele.addClass("hide");
        },
        /**
         * 显示该控件
         * @param ele
         */
        show:function(ele){
            var $ele=$(ele);
            $ele=this._check($ele);
            $ele.removeClass("hide");
        },
        /**
         * 设置选中值
         * @param ele
         * @param v
         */
        setValue: function (ele, v) {
            var $ele=$(ele);
            $ele=this._check($ele);
            $ele.find("input[type='hidden']").val(v);
            var prompt = $ele.find('a[key='+ v +']').html();
            $ele.find("[prompt='prompt']").html(prompt);
        },
        /**
         * 获取选中值
         * @param ele
         * @returns {*}
         */
        getValue: function (ele) {
            var $ele=$(ele);
            $ele=this._check($ele);
            return $ele.find("input[type='hidden']").val();
        },
        /**
         * 获取选中的选项
         * @param ele
         * @returns {*}
         */
        getSelected: function (ele) {
            var $ele=$(ele);
            $ele=this._check($ele);
            var v= $ele.find("input[type='hidden']").val();
            return $ele.find("a[key=\'"+ v +"\']");
        },
        /**
         * 清空选中值
         * @param ele
         */
        clearValue: function (ele) {
            var $ele=$(ele);
            $ele=this._check($ele);
            $ele.find("input[type='hidden']").val("");
            var prompt=$ele.attr("prompt");
            $ele.find("[prompt='prompt']").html(prompt==undefined?"":prompt);
        },
        /**
         * 设置选中的序列
         * @param ele
         * @param i
         */
        setIndex: function (ele, i) {
            var $ele=$(ele);
            $ele=this._check($ele);
            var $item=$($ele.find('a[key]')[0])
            $ele.find("input[type='hidden']").val($item.attr("key"));
            var prompt = $item.html();
            $ele.find("[prompt='prompt']").html(prompt);
        },
        /**
         * 清空所有的选项
         * @param ele
         * @param prompt
         */
        clearOption: function (ele, prompt) {
            this.clearValue(ele);
            var $ele=$(ele);
            $ele=this._check($ele);
            $ele.find("input[type='hidden']").val("");
            $.each($ele.find('li [key]:not(li [key=""])'),function(index,item){
                $(item).parent().remove();
            });
            if(typeof prompt == 'undefined'){
                prompt=$ele.attr("initprompt");
            }
            if(prompt != null && prompt!=undefined) {
                $ele.find('li [key=""]').text(prompt);
                $ele.find("[prompt='prompt']").html(prompt);
            }
        },
        /**
         * 禁用该控件
         * @param ele
         */
        disable: function (ele) {
            var $ele=$(ele);
            $ele=this._check($ele);
            $("button",$ele).attr("disabled",true);
        },
        /**
         * 启用该控件
         * @param ele
         */
        enable: function (ele) {
            var $ele=$(ele);
            $ele=this._check($ele);
            $("button",$ele).removeAttr("disabled",true);
        },
        /**
         * 新增一个选项
         * @param ele
         * @param o
         */
        addOption:function(ele,o){
            var $ele=$(ele);
            $ele=this._check($ele);
            $ele.find('ul[class="dropdown-menu"]').html($ele.find('ul[class="dropdown-menu"]').html()+ o.html());
        },
        /**
         * 新增一个选项
         * @param ele
         * @param v
         * @param t
         */
        addOption:function(ele,v,t){
            var $ele=$(ele);
            $ele=this._check($ele);
            var item="<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:void(0)' key=" + v + "> " +t + "</a></li>"
            $ele.find('ul[class="dropdown-menu"]').html($ele.find('ul[class="dropdown-menu"]').html()+item)
        },
        /**
         * 删除一个选项
         * @param ele
         * @param v
         */
        removeOption:function(ele,v){
            var selValue=this.getValue(ele)
            $("li a[role='menuitem'][key='"+v+"']",this._check(ele)).remove();
            if(selValue==v){
                this.clearValue(ele);
            }
        },
        /**
         * 检查该控件是否存在
         * @param ele
         * @returns {*}
         * @private
         */
        _check:function(ele){
            if(ele.length==0)
            {
                console.log("select "+ele.selector +" is not found!");
                throw "select "+ele.selector +" is not found!";
            }
            if(ele[0].tagName=="INPUT"){
                ele= ele.parent();
            }
            return ele;
        }
    });

});