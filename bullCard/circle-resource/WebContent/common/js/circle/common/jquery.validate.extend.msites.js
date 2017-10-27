/**
 * Created by Kevice on 2015/1/22.
 */
(function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        define( ["jquery", "jqValidate"], factory );
    } else {
        factory( jQuery );
    }
}(function( $ ) {

    function delAllIndexes(name) {
        return name.replace(/\[\d+\]/g, '[]')
    }

    $.validator.setDefaults({
        errorClass:"has-error1",
        keypressDelay: 1000, //扩展的属性：延迟验证毫秒数
        onfocusout: function(element) {
            // 几选一当表单提交时才验证
            if($.validator.ignoreAtLeastRequired(this, element)) {
                return;
            }

            // 其它规则失去焦点时就验证
            $(element).valid();
        },

        onkeyup: function( element, event ) {
            if ( event.which === 9 && this.elementValue( element ) === "" ) {
                return;
            }
            if("remote" in $(element).rules()) { // remote规则延迟验证
                var submitted = this.submitted;
                var lastActive = this.lastActive;
                var validator = this;

                $.validator.delay(function() {
                    if ( element.name in submitted || element == lastActive ) {
                        validator.element(element);
                    }
                }, this.settings.keypressDelay);
            } else {
                if ( element.name in this.submitted || element === this.lastElement ) {
                    // 几选一当表单提交时才验证
                    if($.validator.ignoreAtLeastRequired(this, element)) {
                        return;
                    }

                    this.element( element );
                }
            }
        },

        success: function(error,element) {
            if ($(element).is(":hidden")) {
                var $parentElem = $(elem).parents(".form-group");
                var p = $(element).parent();
                /**/
                $(element).parent('.input-group').nextAll('small.help-block').remove();
                $(element).nextAll('small.help-block').remove();
                /*同一组验证*/
                $(elem).parent().removeClass("has-error").addClass("has-success")
                if($parentElem.find("small.help-block").length){
                }else{
                    $parentElem.removeClass("").removeClass("has-error").addClass("has-success");
                }
                if($.isFunction($(element).showSuccMsg)){
                    $(element).showSuccMsg();
                }
            }
            else {
                var elem = $(element);
                var $parentElem = $(elem).parents(".form-group");
                $(element).parent('.input-group').nextAll('small.help-block').remove();
                $(element).nextAll('small.help-block').remove();
                /*同一组验证*/
                $(elem).parent().removeClass("has-error").addClass("has-success")
                if($parentElem.find("small.help-block").length){
                }else{
                    $parentElem.removeClass("").removeClass("has-error").addClass("has-success");
                }
                if($.isFunction($(element).showSuccMsg)){
                    $(element).showSuccMsg();
                }
                if($.isFunction(elem.showSuccMsg)){
                    elem.showSuccMsg();
                }
            }

            if (element[0] && this.unhighlight ) {
                var rules = this.rules;
                if (element[0].name) {
                    var name = delAllIndexes(element[0].name);
                    if (rules && rules[name]) {

                        // 几选一一个验证通过后，移除其它红框
                        var required = rules[name].required;
                        if (required && required.depends) {
                            var f = required.depends.toString();
                            if (f.indexOf('testNotBlankCount') != -1 && f.indexOf(name) != -1) {
                                var names = f.match(/\[name='?.+?'?\]/g);
                                if (names) {
                                    for(var i = 0; i < names.length; i++) {
                                        this.unhighlight.call( this, $(names[i]), this.errorClass, this.validClass );
                                    }
                                }
                            }
                        }

                        // 数列验证通过后，移除其它红框
                        if (rules[name].series) {
                            var i = 0;
                            while (true) {
                                var $elem = $('[name="'+ name.replace(/\[\]\./, '[' + i + '].') +'"]');
                                if($elem.length == 0) {
                                    break;
                                }
                                this.unhighlight.call( this, $elem, this.errorClass, this.validClass );
                                i++;
                            }
                        }
                    }
                }
            }
        },
        unhighlight:function(element,errorClass,validClass ){
            if($(element).is(":hidden"))
            {
                var p = $(element).parent();
                if (p.hasClass("error")) {
                    p.removeClass( errorClass ).addClass( validClass );
                }
            }
            if ( element.type === "radio" ) {
                this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
            } else {
                $( element ).removeClass( errorClass ).addClass( validClass );
            }
        },
        errorPlacement: function(error, element) {
            var e = $.Event("validate");
            if (error.html()=="" && this.success ) {
                element.trigger(e, error.html());
                if (e.result) {
                    return e.result;
                }
                element.title="";
                error.html( "" );
                if ( typeof this.success === "string" ) {
                    error.addClass( this.success );
                } else {
                    this.success( error, element );
                }
            }
            else
            {
                var errorMsg = error[0].innerHTML;
                if (element[0]) {
                    var elementName = element[0].name;
                    var elem = $("[name='" + elementName+"']",element[0].form)[0];
                    var $parentElem = $(elem).parents(".form-group")

                    // 消息参数替换
                    var $form = $(element[0].form);
                    if (errorMsg.indexOf("{}") != -1) { // {}代表取绑定的label的文本来替换
                        var prev = $(elem).prev();
                        if(prev.attr('for') == elementName) {
                            errorMsg = errorMsg.replace(/{}/g, prev.text());
                        } else {
                            var lbl = $form.find("label[for='" + elementName + "']");
                            var name = "";
                            if(lbl.length != 0) {
                                name = lbl.text().trim().replace(/[:：]$/, '').replace(/^\*/, "").trim();
                            }
                            errorMsg = errorMsg.replace(/{}/g, name);
                        }
                    }
                    var groups = errorMsg.match(/{.+?}/g);
                    if (groups) {
                        var rules = this.rules;
                        elementName = delAllIndexes(elementName)
                        for(var i = 0; i < groups.length; i++) {
                            var group = groups[i];
                            var v = group.substr(1, group.length - 2);
                            errorMsg = errorMsg.replace(group, rules[elementName][v]);
                        }
                    }
                    element.trigger(e, errorMsg);
                    if (e.result) {
                        return e.result;
                    }
                    if($(elem).is(":hidden"))
                    {
                        var p = $(elem).parent();
                        if (!p.hasClass("error")) {
                            p.addClass("error");
                        }
                        var $elemParent = $(elem).parents(".form-group");
                        $(elem).parent().removeClass("has-success").addClass("has-error");
                        $elemParent.removeClass("has-success").addClass("has-error")
                        //p.formtip(errorMsg,undefined, $(elem));
                        $(elem).parent().find('small.help-block').remove();
                        $(elem).parents(".input-group").nextAll('small.help-block').remove();
                        
                        if($(elem).parent().hasClass("input-group")){
                            $(elem).parent().after('<small class="help-block" data-bv-validator="notEmpty" data-bv-for="username" data-bv-result="VALID">'+errorMsg+'</small>');
                        }else{
                            $(elem).siblings().last().after('<small class="help-block" data-bv-validator="notEmpty" data-bv-for="username" data-bv-result="VALID">'+errorMsg+'</small>');
                        }
                    }
                    else {
                        if(!$(elem).is(":focus") && !$(elem).hasClass("error")) {
                            if(!$(elem)[0].errorElements) {
                                //$(elem).focus(); 注释掉 焦点保持在未验证通过的表单
                            }
                        }
                        if($(elem)[0].errorElements&&$(elem)[0].errorElements.length>0) {
                            $(elem)[0].errorElements[$(elem)[0].errorElements.length-1].formtip(errorMsg);
                            $(elem)[0].errorElements = undefined;
                            $(elem)[0].successElements = undefined;
                        }else {
                            if(!$parentElem.hasClass("has-error")){
                                $parentElem.removeClass("has-success").addClass("has-error");
                            }
                            $(elem).parent().removeClass("has-success").addClass("has-error");
                            $(elem).parent().removeClass("has-success").find('small.help-block').remove();
                            $(elem).parents(".input-group").nextAll('small.help-block').remove();
                            
                             if($(elem).parent().hasClass("input-group")){
                                $(elem).parent().after('<small class="help-block" data-bv-validator="notEmpty" data-bv-for="username" data-bv-result="VALID">'+errorMsg+'</small>');
                            }else{
                                 $(elem).parent().append('<small class="help-block" data-bv-validator="notEmpty" data-bv-for="username" data-bv-result="VALID">'+errorMsg+'</small>');
                            }
                        }


                        //window.scrollTo(0,elem.offsetTop+$(elem).outerHeight());
                        //window.top.scrollTo(0,elem.offsetTop+$(elem).outerHeight());

                    }
                }
            }
        },
        showErrors:function(errorMap, errorList )
        {
            var i, elements, error;
            for ( i = 0; errorList[ i ]; i++ ) {
                error = errorList[ i ];
                if ( this.settings.highlight ) {
                    if(error.element.errorElements){
                        for(var ele in error.element.successElements){
                            this.settings.unhighlight(error.element.successElements[ele], this.settings.errorClass, this.settings.validClass);
                        }
                        for(var ele in error.element.errorElements){
                            this.settings.highlight.call( this, error.element.errorElements[ele], this.settings.errorClass, this.settings.validClass );
                        }
                    }else {
                        var p = $(error.element).parent();
                        var pHasErrCls = p.hasClass("error");
                        var currEleIsHidden = $(error.element).is(":hidden") || ( /radio|checkbox/i ).test( error.element.type );
                        var currHasErrCls = $(error.element).hasClass("error");

                        if(currEleIsHidden){
                            if (!currHasErrCls&&!pHasErrCls) {//当前ele对象隐藏，且当前无error样式，且父节点也没有error样式。
                                p.addClass("error");
                            }
                        }else {
                            if (pHasErrCls) {
                                p.removeClass("error");
                            }
                            this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );

                        }

                    }
                }
                if(i==0){
                    var errMsg = error.message;
                    if (/^{[^{}]+}$/.test(errMsg)) { // 注解中默认的提示信息key
                        var message = typeof message === 'undefined' ? window.top.message:message
                        errMsg = message["common"][errMsg];
                    } else {
                        var index = errMsg.indexOf('.');
                        if (index != -1) {
                            /*dialog message undefined*/
                            var message = typeof message === 'undefined' ? window.top.message:message
                            var module = message[errMsg.substr(0, index)];
                            if (module && errMsg.length > index + 1) {
                                var msg = module[errMsg.substr(index + 1)];
                                if (msg) {
                                    errMsg = msg;
                                }
                            }
                        }
                    }

                    this.showLabel(error.element, errMsg);
                }
            }
            if ( this.errorList.length ) {
                this.toShow = this.toShow.add( this.containers );
            }
            if ( this.settings.success ) {
                for ( i = 0; this.successList[ i ]; i++ ) {
                    this.showLabel( this.successList[ i ] );
                }
            }
            if ( this.settings.unhighlight ) {
                for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
                    //if(elements[i].value!='') 会造成依赖的规则不满足时，本身的红框去不掉
                    //{
                        this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
                    //}
                }
            }
            this.toHide = this.toHide.not( this.toShow );
            this.hideErrors();
            this.addWrapper( this.toShow ).show();
        },
    });

    $.validator.ignoreAtLeastRequired = function(_this, element) {
        if (element && !$(element).val()) {
            var rules = _this.settings.rules;
            if (rules && rules[element.name]) {
                var required = rules[element.name].required;
                if (required && required.depends) {
                    var f = required.depends.toString();
                    if (f.indexOf('testNotBlankCount') != -1 && f.indexOf(element.name) != -1) {
                        _this.settings.unhighlight.call( _this, $(element), _this.settings.errorClass, _this.settings.validClass );
                        _this.settings.success(null, $(element));
                        return true;
                    }
                }
            }
        }
        return false;
    }

    $.validator.delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    $.validator.prototype.elements = function() {
        var validator = this,
            rulesCache = {};

        // select all valid inputs inside the form (no submit or reset buttons)
        return $( this.currentForm )
            .find( "input, select, textarea" )
            .not( ":submit, :reset, :image, [disabled]" ) // delete ", [readonly]"
            .not( this.settings.ignore )
            .filter( function() {
                if ( !this.name && validator.settings.debug && window.console ) {
                    console.error( "%o has no name assigned", this );
                }

                // select only the first element for each name, and only those with rules specified
                if ( this.name in rulesCache || !validator.objectLength( $( this ).rules() ) // 原来的条件
                    && (!/^\w+\[\d+\]\.\w+$/.test(this.name) || validator.settings.rules && !validator.settings.rules[delAllIndexes(this.name)])) { // 处理带中括号的数组name
                    return false;
                }

                rulesCache[ this.name ] = true;
                return true;
            });
    };

    $.validator.prototype.customMessage = function( name, method ) {
        name = delAllIndexes(name);  // 处理带中括号的数组name
        var m = this.settings.messages[ name ];
        return m && ( m.constructor === String ? m : m[ method ]);
    },

    $.validator.staticRules = function( element ) {
        var rules = {},
            validator = $.data( element.form, "validator" );
        var pageExist = typeof(page) != 'undefined';
        if(element.name.indexOf("[")>=0&&pageExist) {
            page.rowIndex = element.name.substring(element.name.indexOf("[") + 1, element.name.indexOf("]"))
        }else if(pageExist){
            page.rowIndex = null;
        }
        if ( validator.settings.rules ) {
            var name = delAllIndexes(element.name);  // 处理带中括号的数组name
            rules = $.validator.normalizeRule( validator.settings.rules[ name ] ) || {};
        }
        return rules;
    },

    /**
     * Return true if the field value matches the given format RegExp
     *
     * @example $.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
     * @result true
     *
     * @example $.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
     * @result false
     *
     * @name $.validator.methods.pattern
     * @type Boolean
     * @cat Plugins/Validate/Methods
     */
    $.validator.addMethod("pattern", function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }
        if (typeof param === "string") {
            param = new RegExp("^(?:" + param + ")$");
        }
        return param.test(value);
    }, window.top.message.valid["pattern"]);

    $.validator.addMethod("integerPrecision", function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }
        value = (Math.abs(value) + '');
        var match = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
        if(match) {
            value = value.replace(/^0+\./,'0.');
            if(value.indexOf('0.') != 0) {
                value = value.replace(/\b0+/,"");
            }
            value = value.replace(/\..+\b/,"");
            match = value.length <= param;
        }
        return match;
    }, window.top.message.valid["integerPrecision"]);

    $.validator.addMethod("fractionPrecision", function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }
        value = (value + '');
        var match = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
        if(match) {
            if (value.indexOf(".") == -1) {
                value = "";
            } else {
                value = value.replace(/.*\./,'');
            }
            match = value.length <= param;
        }
        return match;
    }, window.top.message.valid["fractionPrecision"]);

    $.validator.addMethod("datetime", function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }

        if(value.length != param.length) {
            return false;
        }

        var yearIndex = param.indexOf("yyyy");
        var year = value.substr(yearIndex, 4);
        var monthIndex = param.indexOf("MM");
        var month = value.substr(monthIndex, 2);
        var dayIndex = param.indexOf("dd");
        var day = value.substr(dayIndex, 2);
        var date = year + "-" + month + "-" + day;
        var dateRegExp = /^\d{4}-(?:(?:0[13-9]|1[12])-(?:0[1-9]|[12]\d|30)|(?:0[13578]|1[02])-31|02-(?:0[1-9]|1\d|2[0-8]))|(?:(?:\d{2}(?:[13579][26]|[2468][048])|(?:[13579][26]|[2468][048])00)-02-29)$/;
        if(dateRegExp.test(date)) {
            var regexp = param;
            regexp = regexp.replace(/\./g, '\\.').replace(/\-/g, '\\-').replace(/\s/g, '\\s');
            regexp = regexp.replace(/yyyy/, '\\d{4}');
            regexp = regexp.replace(/MM/, '\\d{2}');
            regexp = regexp.replace(/dd/, '\\d{2}');
            regexp = regexp.replace(/HH/, '([0-1]\\d|2[0-3])');
            regexp = regexp.replace(/hh/, '(0[1-9]|1[0-2])');
            regexp = regexp.replace(/mm/, '([0-5]\\d)');
            regexp = regexp.replace(/ss/, '([0-5]\\d)');
            return new RegExp("^(?:" + regexp + ")$").test(value);
        }

        return false;
    }, window.top.message.valid["datetime"]);

    $.validator.addMethod("compare", function(value, element, param) {

        if (this.optional(element)) {
            return true;
        }

        var depends = param.dependsOn;
        if (depends) {
            if(!eval(depends)) {
                return true;
            }
        }

        var logic = param.logic;
        var val = $("[name='"+param.property+"']").val();

        if(param.isNumber === 'true'){
            value = Number(value);
            val = Number(val);
        }

        if (logic == 'EQ') {
            return value == val;
        } else if (logic == 'NE') {
            return value != val;
        } else if (logic == 'IEQ') {
            return value.toLowerCase() == val.toLowerCase();
        } else if (logic == 'GT') {
            return value > val;
        } else if (logic == 'GE') {
            return value >= val;
        } else if (logic == 'LT') {
            return value < val;
        } else if (logic == 'LE') {
            return value <= val;
        }

        return false;
    }, window.top.message.valid["compare"]);

    function isNumber(value) {
        return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
    }

    function toNumber(value) {
        if(value=="") {
            return value;
        }
        if (isNumber(value)) {
            return Number(value);
        }
        return value;
    }

    function seriesCompare(preValue, value, operator) {
        preValue = toNumber(preValue);
        value = toNumber(value);
        if (operator == 'INC') {
            return value > preValue;
        } else if (operator == 'DESC') {
            return value < preValue;
        } else if (operator == 'INC_EQ') {
            return value >= preValue;
        } else if (operator == 'DESC_EQ') {
            return value <= preValue;
        } else if (operator == 'DIFF') {
            return value != preValue;
        }
        return true;
    }

    $.validator.addMethod("series", function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }

        var r = element.name.match(/\[(\d+)\][^\]]*$/);
        var tail = r[0].replace("["+r[1]+"]", "");
        var i = 1;
        while (true) {
            var name = element.name.replace(/\[(\d+)\][^\]]*$/, "[" + i + "]" + tail);
            if($('[name="'+ name + '"]').length == 0) {
                break;
            }
            i++;
        }

        var index = i - 1; // 最大下标
        var flag = true;
        element.errorElements = [];
        element.successElements = [];
        for (var i = index; i != 0; i--) {
            var currentName = element.name.replace(/\[(\d+)\][^\]]*$/, "[" + i + "]" + tail);
            var currentField = $('[name="'+ currentName + '"]');
            var currentValue = currentField.val();
            var preName = element.name.replace(/\[(\d+)\][^\]]*$/, "[" + (i - 1) + "]" + tail);
            var preField = $('[name="'+ preName + '"]');
            var preValue = preField.val();

            if (!seriesCompare(preValue, currentValue, param)) {
                element.errorElements.push(currentField);
                flag = false;
            }else {
                element.successElements.push(currentField);
                element.successElements.push(preField);
            }
        }

        return flag;
    }, window.top.message.valid["series"]);

    $.validator.addMethod("qq", function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }
        return /^\d{5,11}$/.test( value );
    }, window.top.message.valid["qq"]);

    $.validator.addMethod("cellphone", function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }
        return /^(13[0-9]|15[0|1|2|3|5|6|7|8|9]|170|18[0|1|2|5|6|7|8|9])\d{8}$/.test( value );
    }, window.top.message.valid["cellphone"]);

    $.validator.addMethod("bankcard", function(value, element, param) {
        if (this.optional(element)) {
            return true;
        }
        // accept only spaces, digits and dashes
        if ( /[^0-9 \-]+/.test( value ) ) {
            return false;
        }
        var nCheck = 0,
            nDigit = 0,
            bEven = false,
            n, cDigit;

        value = value.replace( /\D/g, "" );

        // Basing min and max length on
        // http://developer.ean.com/general_info/Valid_Credit_Card_Types
        if ( value.length < 13 || value.length > 19 ) {
            return false;
        }

        for ( n = value.length - 1; n >= 0; n--) {
            cDigit = value.charAt( n );
            nDigit = parseInt( cDigit, 10 );
            if ( bEven ) {
                if ( nDigit > 9 ) {
                    nDigit -= 9;
                }
            }
            nCheck += nDigit;
            bEven = !bEven;
        }

        return ( nCheck % 10 ) === 0;
    }, window.top.message.valid["bankcard"]);

    /**
     * 重写maxlength主要是因为对ueditor进行校验时包含格式代码会影响验证结果。
     * 需要在UEditor所绑定的TextArea控件上增加ueditorId属性，属性值与ID一致。
     * 之所以需要增加此属性是因为TextArea本身的ID在UEditor渲染后会被移除。
     */
    $.validator.addMethod("maxlength", function(value, element, param) {
        var ueditorId = $(element).attr("ueditorId");
        if(ueditorId) {
            value = UE.getEditor(ueditorId).getContentTxt();
        }
        var length = $.isArray( value ) ? value.length : this.getLength( value, element );
        return this.optional( element ) || length <= param;
    }, window.top.message.valid["maxlength"]);

    $(document).click(function(event) {
        if (event.button==2) return true;
        if ($(".poshytip").length>1) {
            var tagName = event.target.tagName.toLowerCase();
            if(tagName=='a' || tagName=='button' || (tagName=='input' && (event.target.type=="button" || event.target.type=="submit"))<0) {
            }else{
                $(".poshytip").remove();
            }
        }
    });


}));
