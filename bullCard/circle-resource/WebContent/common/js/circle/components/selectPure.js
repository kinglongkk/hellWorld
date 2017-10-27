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
            //_this.initRelSelect(_this);
        },
        name:"selectPure",
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function(_this) {
            $(document).off("change","select",_this._selectChange ).on("change","select",{select:_this},_this._selectChange );
        },
        _selectChange:function (e) {
            var _this= e.data.select;
            var _select = $(this);
            if(_select.attr('relSelectPure')!=null){
                var _relObj =  $(document).find("select[name='"+_select.attr('relSelectPure')+"']");
                var _value = _select.val();
                _this.setNull(_this,_relObj,_value);
                /*if(_relObj!=null && _relObj!="" && _value!=null && _value!=""){
                    _this.ajaxList(_relObj);
                }*/
                var _url = _relObj.attr('ajaxListPathPure');
                var _value = _relObj.attr("initValue");
                _this.ajaxList(_relObj,_url,_value);
            }
            if(_select.attr("callback")!=null){
                e.page = window.page;
                e.key = _select.val();
                e.value = _select.html();
                window.top.topPage.doPageFunction(e,_select.attr("callback"),null);
            }
        },
        /**
         * 异步加载下拉款选项
         * @param _this
         */
        initAjaxList : function(_this){
            $(document).find("[ajaxListPathPure]").each(function(){
                var _select = $(this);
                var _url = _select.attr('ajaxListPathPure');
                var _value = _select.attr("initValue");
                _this.ajaxList(_select,_url,_value)
            });
        },
        setNull : function (_this,_relObj,_value){
            _relObj.val("");
            if(!(_relObj!=null && _relObj!="" && _value!=null && _value!="")){
                //_relObj.hide();
            }
            if(_relObj.attr('relSelectPure')!=null){
                var __relObj =  $(document).find("select[name='"+_relObj.attr('relSelectPure')+"']");
                var __value = _relObj.val();
                _this.setNull(_this,__relObj,__value);
                //__relObj.hide();
            }
        },
        ajaxList : function(_select,_url,_value){

            var relSelectPath=_select.attr('relselectpathpure');
            if(relSelectPath) {
                $.each(relSelectPath.match(/#[^#]+#/g), function (index, item) {
                    var _relObj = $(document).find("select[name='" + item.replace(/#/g, "") + "']");
                    var val=_relObj.val();
                    relSelectPath = relSelectPath.replace(item, val);
                });
                if(relSelectPath.indexOf("#")>0){
                    return false;
                }
                _url=relSelectPath;
            }else{
                if(!_url) {
                    _url = _select.attr('ajaxListPathPure')
                }
            }

            window.top.topPage.ajax({
                url:_url,
                dataType:'json',
                cache: false,
                type:"get",
                success:function(data){
                    var ops = "<option value=''>"+_select.attr('initPrompt')+"</option>";
                    if(Array.isArray(data)){
                        $.each(data, function(i,item){
                            if(item[_select.attr('listKey')]== _value){
                                ops += "<option selected value=" + item[_select.attr('listKey')] + "> " +item[_select.attr('listValue')] + "</option>";
                            }else{
                                ops += "<option value=" + item[_select.attr('listKey')] + "> " +item[_select.attr('listValue')] + "</option>";
                            }
                        });
                    }else{
                        $.each(data, function(key, value) {
                            if(key== _value){
                                ops += "<option selected value=" + key + "> " + value + "</option>";
                            }else{
                                ops += "<option value=" + key + "> " + value + "</option>";
                            }
                        });
                    }
                    _select.html(ops);
                    _select.trigger("change");
                }});
        }
    });

});