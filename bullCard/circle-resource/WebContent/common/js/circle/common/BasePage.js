define(['poshytip', 'bootstrap-dialog', 'eventlock', 'jqcountdown', 'daterangepicker', 'moment', 'css!commonCss/chosen/chosen.css', 'css!commonCss/bootstrap-daterangepicker/daterangepicker.css'], function (Poshytip, BootstrapDialog, eventlock, jqcountdown, daterangepicker, Moment) {

    return Class.extend({
        /**
         * 用于远程验证数组时，获取当前验证的element的索引
         */
        rowIndex: null,
        /**
         * 上次事件对象目标，用于需要两次的重复调用时，比如执行某项操作时需要验证安全密码，安全密码验证完成后自动继续执行相关操作
         */
        parentTarget: null,
        /**
         * form选择器，主要目的是为了限定Jquery事件绑定的范围，防止重复绑定
         */
        formSelector: "",
        /**
         * 保存弹出框的返回值变量
         */
        returnValue: null,
        config: null,
        /**
         * 查无记录自定义信息
         */
        noRecordMessage: window.top.message.common["table.norecords"],
        imageSilde: function (e, opt) {
            e.imgs = ["http://boss.dev.so:8080/fserver/files/test/1/1439360641408.jpg"];

            window.top.topPage.imageSilde(e, opt);
        },
        /**
         * 日期选择改变回调示例
         * @param option.startDate
         * @param option.endDate
         */
        dateChangeCallBack: function (e, option) {
            console.log('===========' + e.startDate.format(e.format) + ' - ' + e.endDate.format('MMMM D, YYYY'));
        },
        /**
         * 在控件的上方显示依哥提示弹出层
         * @param obj
         * @param type
         * @param msg
         */
        showPopover: function (e, btnOption, type, msg, withCountDown) {
            var $obj = $(e.currentTarget);
            var placement = "";
            if (btnOption && btnOption.placement) {
                placement = btnOption.placement;
            } else {
                placement = 'top';
            }
            $obj.popover({
                placement: placement,
                title: function () {
                    return "";
                },
                container: "body",
                html: true,
                template: "<div class='popover " + type + "' role='tooltip'><div class='arrow'></div><div class='popover-content'></div></div>",
                content: msg
            });
            e.popoverObj = $obj.popover('show');
            if (withCountDown == true) {
                window.top.topPage.showPopoverCountDown(e, btnOption);
            }
        },
        /**
         * 提示信息回调
         * @param e
         * @param btnOption
         */
        /*showPopoverCountDown: function (e, btnOption) {
            var $obj = $(e.currentTarget);
            var timeNext = new Date();
            timeNext.setTime(timeNext.getTime() + 1500);
            $obj.countdown(timeNext).on('finish.countdown', function () {
                $obj.popover("destroy");
                if (btnOption && btnOption.callback) {
                    window.top.topPage.doPageFunction(e, btnOption.callback, btnOption);
                }
            });
        },*/
        /**
         * 初始化日期选择控件
         * @param ojb
         */
        initDatePick: function ($ojb) {
            var _this = this;
            $.each($ojb, function (index, item) {

                var $item = $(item);
                var $text = $("input[type='text']", $item.parent());
                var data = eval("(" + $text.attr('data-rel') + ")");
                if (data) {
                    var option = {};
                    if (data.useRange == true) {
                        option.ranges = {};
                        var momentToday = new Moment().locale(window.top.language).utcOffset(window.top.utcOffSet);
                        var momentYesterday = momentToday.clone().subtract(1, 'days');
                        var momentThisWeek = momentToday.clone().startOf('week');
                        var momentTDBYesterday = momentToday.clone().subtract(2, 'days');
                        var momentLastWeek = momentToday.clone().subtract(1, 'week');
                        var momentThisMonth = momentToday.clone().startOf('month');
                        var momentLastMonth = momentToday.clone().subtract(1, 'month');
                        var momentLast7Days = momentToday.clone().subtract(6 + (data.useToday ? 0 : 1), 'days');
                        var momentLast30Days = momentToday.clone().subtract(29 + (data.useToday ? 0 : 1), 'days');

                        option.ranges = {};
                        /*{
                         'Today': [momentToday.startOf('day').format(data.format), momentToday.endOf('day').format(data.format)],
                         'Yesterday': [momentYesterday.startOf('day').format(data.format), momentYesterday.endOf('day').format(data.format)],
                         'The Day Before Yesterday': [momentTDBYesterday.startOf('day').format(data.format), momentTDBYesterday.endOf('day').format(data.format)],
                         'This Week': [momentThisWeek.startOf('week').format(data.format), momentThisWeek.endOf('week').format(data.format)],
                         'Last Week': [momentLastWeek.startOf('week').format(data.format), momentLastWeek.endOf('week').format(data.format)],
                         'This Month': [momentThisMonth.startOf('month').format(data.format), momentThisMonth.endOf('month').format(data.format)],
                         'Last Month': [momentLastMonth.startOf('month').format(data.format), momentLastMonth.endOf('month').format(data.format)],
                         'Last 7 Days': [momentLast7Days.startOf('day').format(data.format), momentYesterday.clone().endOf('day').format(data.format)],
                         'Last 30 Days': [momentLast30Days.startOf('day').format(data.format), momentYesterday.clone().endOf('day').format(data.format)],
                         };*/

                        if (data.today == true) {
                            option.ranges[window.top.message.common["daterange.Today"]] =
                                [momentToday.startOf('day').format(data.format), momentToday.endOf('day').format(data.format)];
                        }
                        if (data.yesterday == true) {
                            option.ranges[window.top.message.common["daterange.Yesterday"]] =
                                [momentYesterday.startOf('day').format(data.format), momentYesterday.endOf('day').format(data.format)];
                        }
                        if (data.beforeYesterday == true) {
                            option.ranges[window.top.message.common["daterange.TheDayBeforeYesterday"]] =
                                [momentTDBYesterday.startOf('day').format(data.format), momentTDBYesterday.endOf('day').format(data.format)];
                        }
                        if (data.thisWeek == true) {
                            option.ranges[window.top.message.common["daterange.ThisWeek"]] =
                                [momentThisWeek.startOf('week').format(data.format), momentThisWeek.endOf('week').format(data.format)];
                        }
                        if (data.lastWeek == true) {
                            option.ranges[window.top.message.common["daterange.LastWeek"]] =
                                [momentLastWeek.startOf('week').format(data.format), momentLastWeek.endOf('week').format(data.format)];
                        }
                        if (data.thisMonth == true) {
                            option.ranges[window.top.message.common["daterange.ThisMonth"]] =
                                [momentThisMonth.startOf('month').format(data.format), momentThisMonth.endOf('month').format(data.format)];
                        }
                        if (data.lastMonth == true) {
                            option.ranges[window.top.message.common["daterange.LastMonth"]] =
                                [momentLastMonth.startOf('month').format(data.format), momentLastMonth.endOf('month').format(data.format)];
                        }
                        if (data.last7Days == true) {
                            option.ranges[window.top.message.common["daterange.Last7Days"]] =
                                [momentLast7Days.startOf('day').format(data.format), (data.useToday ? momentToday.endOf('day').format(data.format)
                                    : momentYesterday.clone().endOf('day').format(data.format))];
                        }
                        if (data.last30Days == true) {
                            option.ranges[window.top.message.common["daterange.Last30Days"]] =
                                [momentLast30Days.startOf('day').format(data.format), (data.useToday ? momentToday.endOf('day').format(data.format)
                                    : momentYesterday.clone().endOf('day').format(data.format))];
                        }

                        if (data.useToday != true) {
                            delete option.ranges[window.top.message.common["daterange.Today"]];
                        }
                        if (data.startDate) {
                            option.startDate = data.startDate;
                        }

                        if (data.endDate) {
                            option.endDate = data.endDate;
                        }

                        /*option.startDate= Moment(data.startDate).utcOffset("GMT-05:00");
                         option.endDate= Moment(data.endDate).utcOffset("GMT-05:00");*/
                    } else {
                        option.singleDatePicker = true;
                        if (data.startDate) {
                            option.startDate = data.startDate
                        }
                    }

                    if (data.useTime) {
                        option.timePicker = true;
                        option.timePickerIncrement = 1;
                        option.timePicker24Hour = true;
                        option.timePickerSeconds = true;
                    }
                    if (data.minDate) {
                        option.minDate = data.minDate;
                    }
                    if (data.maxDate) {
                        option.maxDate = data.maxDate;
                    }
                    if (data.showDropdowns) {
                        option.showDropdowns = data.showDropdowns;
                    }
                    option.autoApply = true;
                    option.utcOffSet = window.top.utcOffSet;
                    option.timeZone = window.top.utcOffSet;
                    option.locale = Moment().locales[window.top.language];
                    option.locale.format = data.format || option.locale.format;
                    option.drops = data.drops;

                    if (data.opens == "left") {
                        option.opens == "right";
                    }
                    else if (data.opens == "right") {
                        option.opens == "left";
                    } else {
                        option.opens = data.opens;
                    }
                    option.callback = data.callback;
                    $text.attr("readOnly", "readOnly");

                    //页面回退时回填数据
                    if (data.useRange) {
                        var startField = $("input[name='" + data.startName + "']", $item.parent());
                        var endField = $("input[name='" + data.endName + "']", $item.parent());
                        if (startField.length > 0 && endField.length > 0 && startField.val() != "" && endField.val() != "") {
                            $text.prop("value", startField.val() + ' - ' + endField.val());
                        }
                    } else {
                        $text.prop("value", data.startDate);
                    }
                    $item.daterangepicker(option);

                    $item.bind("apply.daterangepicker", function (e, picker) {
                        var start = picker.startDate;
                        var end = picker.endDate;
                        var startFormat = start.format(option.locale.format);
                        var endFormat = end.format(option.locale.format);

                        data.startDate = startFormat;
                        if (data.useRange == true) {
                            var startField = $("[name='" + data.startName + "']", $item.parent());
                            var endField = $("[name='" + data.endName + "']", $item.parent());
                            startField.prop("value", startFormat);
                            endField.prop("value", endFormat);
                            if (startField.valid) {
                                startField.valid();
                            }
                            if (endField.valid) {
                                endField.valid();
                            }
                            $text.prop("value", startFormat + ' - ' + endFormat);
                            data.endDate = endFormat;
                        } else {
                            $text.prop("value", startFormat);
                            if ($text.valid) {
                                $text.valid();
                            }
                        }
                        $text.attr("data-rel", JSON.stringify(data).replace(/"/g, "'"));
                        if (option.callback) {
                            window.top.topPage.doPageFunction(
                                {
                                    currentTarget: $text[0],
                                    page: _this,
                                    format: option.locale.format,
                                    startDate: start,
                                    endDate: end
                                }, option.callback, option)
                        } else {
                            //console.log('New date range selected: ' + start.format('yyyy-MM-dd') + ' to ' + end.format('yyyy-MM-dd'));
                        }
                    });
                }
            });

        },
        /**
         * 刷新页面操作，负责显示刷新时间和间隔
         * @param e
         * @param opt
         * @returns {boolean}
         */
        refreshPage: function (e, opt) {
            var $target = $(e.currentTarget);
            if (opt.target == "query") {
                if (opt.callback == "") {
                    opt.callback = "setCountDown";
                    //function无callback，所以在这里执行setCountDown方法
                    window.top.topPage.doPageFunction(e, opt.callback, opt);
                } else {
                    opt.callback = function (e, opt) {
                        window.top.topPage.doPageFunction(e, opt.callback, opt);
                        e.page.setCountDown(e, opt);
                    };
                }
            }
            if ($target.hasClass("countdown")) {
                return false;
            }
            return true;
        },
        doRefreshPage: function (e, opt) {

        },
        /**
         * 设置刷新后的倒计时提示
         * @param e
         * @param opt
         */
        setCountDown: function (e, opt) {
            var $target = $(e.currentTarget);
            $target.addClass("countdown");
            var timenow = new Date();
            var timeNext = new Date();
            var refreshInterval = 100000;
            if (opt.refreshInterval && parseInt(opt.refreshInterval) > 0) {
                refreshInterval = parseInt(opt.refreshInterval);
            }
            timeNext.setTime(timeNext.getTime() + refreshInterval);

            $target.countdown(timeNext, function (event) {
                $target.unbind("mouseover").bind("mouseover", function (event) {
                    $target.popover({
                        trigger: 'hover',
                        content: window.top.message.common['last_refresh_time'] + window.top.topPage.formatToMyDateTime(timenow,window.top.dateFormat.daySecond)
                    });
                });
            });
            $target.removeClass("countdown");
        },
        /**
         * 处理查询无数据
         */
        checkNoRecords: function () {
            var _this = this;
            $.each($(".dataTable tbody", this.formSelector), function (index, item) {
                if ($("tr", item).length == 0) {
                    $(item).append("<tr><td class='no-content_wrap' colspan='" + $("th", $("thead tr", $(item).parent())).length + "'>" +
                        "<div><i class='fa fa-exclamation-circle'></i> " + _this.noRecordMessage + "</div></td></tr>")
                }
            })
        },
        /**
         * 返回上一个页面的回调
         * @param e
         * @param option
         */
        goToLastPage: function (e, option) {
            window.top.topPage.goToLastPage(option.refresh);
        },
        /**
         * 初始化及构造函数，在子类中采用
         * this._super();
         * 调用
         */
        init: function (formSelector) {
            //window.ZeroClipboard=ZeroClipboard;
            this.formSelector = formSelector || this.formSelector;
            //this.bindButtonEvents();
            //this.initCaptcha();
            config = {
                '.chosen-select': {},
                '.chosen-select-deselect': {allow_single_deselect: true},
                '.chosen-select-no-single': {disable_search_threshold: 10},
                '.chosen-select-no-results': {no_results_text: 'Oops, nothing found!'},
                '.chosen-select-width': {width: "95%"}
            };
            this.bindEvent();
            this.onPageLoad();
            if(window.top.topPage){
                window.top.topPage.hashEvent.page = this;
            }
            //页面中点击？文案提示
            $('.help-popover').popover();

        },
        onPageLoad: function () {
            var _this = this;
            this.initSelect();
            this.initDatePick($(".glyphicon-calendar", this.formSelector));
            select.initAjaxList(select);
            $('.navbar-minimalize').unbind("click");
            $('.navbar-minimalize').click(function () {
                $("body").toggleClass("mini-navbar");
                _this.SmoothlyMenu();
            });
        },
        /**
         * 前进后退清除内容，以便重新初始化
         */
        unInitFileInput: function ($ele) {
            //前进后退清除内容，以便重新初始化
            $.each($ele, function (index, item) {
                if ($(item).parent().hasClass("btn-file")) {
                    var $cont = $(item).parent().parent().parent().parent();
                    $cont.find('.file-drop-zone').off();
                    $(item).insertBefore($cont).off('.fileinput').removeData();
                    $cont.off().remove();
                }
            });
            return $ele;
        },
        /**
         * 前进后退清除内容，以便重新初始化
         * @param el
         */
        unInitSwitch: function ($bootstrapSwitch) {
            $.each($bootstrapSwitch, function (index, item) {
                var bootstrap = $(item).parent().parent();
                if (bootstrap.hasClass("bootstrap-switch")) {
                    $(item).insertBefore(bootstrap);
                    bootstrap.remove();
                }
            });
            return $bootstrapSwitch;
        },

        /**
         * 当前对象事件初始化函数
         */
        bindEvent: function () {
            var _this = this;
            $(this.formSelector).bind("keydown", function (event) {
                var target, code, tag;
                if (!event) {
                    event = window.event; //针对ie浏览器
                    target = event.currentTarget;
                    code = event.keyCode;
                    if (code == 13) {
                        tag = target.tagName;
                        if (tag == "FORM") {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
                else {
                    target = event.currentTarget; //针对遵循w3c标准的浏览器，如Firefox
                    code = event.keyCode;
                    if (code == 13) {
                        tag = target.tagName;
                        if (tag == "FORM") {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                }
            });
        },
        /**
         * 左侧菜单折叠
         */
        SmoothlyMenu: function () {
            if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                // Hide menu in order to smoothly turn on when maximize menu
                $('#side-menu').hide();
                // For smoothly turn on menu
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(500);
                    }, 100);
            } else if ($('body').hasClass('fixed-sidebar')) {
                $('#side-menu').hide();
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(500);
                    }, 300);
            } else {
                // Remove all inline style from jquery fadeIn function to reset menu state
                $('#side-menu').removeAttr('style');
            }
        },
        /**
         * 自动绑定Button标签的所有按钮事件
         */
        bindButtonEvents: function () {
            window.top.topPage.bindButtonEvents(this, document);
        },
        selectContainer: '<div selectdiv="{name}" value="{selected}" class="{class}" initprompt="{initprompt}" callback="{callback}">' +
        '<input type="hidden" name="{name}" value="{value}" id="{id}">' +
        '<button type="button" class="{app}" data-toggle="dropdown" style="overflow: hidden;padding-right: 10px;" aria-expanded="false">' +
        '<span prompt="prompt" style="display:inline-block;min-width: 60px;">{initprompt}</span> ' +
        '<span class="caret"></span>' +
        '</button>' +
        '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">{items}</ul>' +
        '</div>',
        selectOption: '<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" {data} key="{value}">{text}</a></li>',
        _initSelect: function ($el, change) {
            if ($el.length == 0) {
                return;
            }
            var _this = this;
            if ($el[0].tagName == "SELECT" && select.name == "select") {
                var items = "";
                var app = $el.attr('app' || "");
                if (typeof(app) == 'undefined') {
                    app = 'btn btn-default dropdown-toggle';
                }
                var sel = _this.selectContainer.replace('{value}', $el.val() || "")
                    .replace('{selected}', $("option:selected", $el).val() || "")
                    .replace('{initprompt}', $("option:selected", $el).text() || "")
                    .replace('{initprompt}', $("option:selected", $el).text() || "")
                    .replace('{callback}', $el.attr("callback") || "")
                    .replace('{class}', ($el.attr('class') || ""))
                    .replace('{name}', $el.attr('name') || "")
                    .replace('{name}', $el.attr('name') || "")
                    .replace('{id}', $el.attr('id') || "")
                    .replace('{app}', app);
                $("option", $el).each(function (index, opt) {
                    var data = "";
                    for (var i = 0; i < opt.attributes.length; i++) {
                        if (opt.attributes[i].name != "value") {
                            data += " " + opt.attributes[i].name + "='" + opt.attributes[i].value + "'";
                        }
                    }
                    items += _this.selectOption.replace('{data}', data)
                        .replace('{value}', opt.value)
                        .replace('{text}', $(opt).text());
                });

                var $sel = $(sel.replace('{items}', items));
                $sel.insertBefore($el);
                $el.remove();
                $el = $("input", $sel);
            }
            _this.bindSelectChange($el, change);
        },
        bindSelectChange: function ($input, change) {
            $input.change(function (e) {
                if (change && change.constructor == Function) {
                    change(e);
                }
                var $this = $(this);
                if ($this.valid) {
                    $this.valid();
                }
            });

        },
        /**
         * 下拉框初始调用
         */
        initSelect: function () {
            var _this = this;
            for (var selector in config) {
                _this.initSelectOne($(selector, this.formSelector));
            }
        },
        /**
         * 动态增加下拉框初始调用,绑定事件
         */
        initSelectOne: function ($item, selector, change, option) {
            var _this = this;
            $item.each(function (index, el) {
                var $el = $(el);
                if ($el[0].tagName == "SELECT")
                    _this._initSelect($el, change);
            });
        },
        /**
         * 标签展示
         */
        initShowTab: function () {
            $(this.formSelector, document).on('shown.bs.tab', function (e) {
                var activeTab = $(e.target);
                var isLoad = $(activeTab).attr("data-load");
                if (isLoad != '1') {
                    var tabId = $(activeTab).attr("href");
                    var url = $(activeTab).attr("data-href");
                    window.top.topPage.ajax({
                        url: url,
                        loading: true,
                        success: function (data) {
                            $(tabId).html(data);
                            $(activeTab).attr("data-load", "1");
                        },
                        error: function (data) {

                        }
                    })
                }
            });
        },
        /**
         * Resize Dailog 自适应
         */
        resizeDialog: function () {
            var dialog = null;
            $.each(window.top.topPage.bootstrapDialog.dialogs, function (id, dialogInstance) {
                var centWin = $("iframe", dialogInstance.$modalDialog)[0];
                if (dialogInstance.isRealized() && dialogInstance.isOpened() &&
                    centWin && centWin.contentWindow.location.href == window.location.href) {
                    dialog = dialogInstance;
                }
            });
            window.top.topPage.doResizeDialog(dialog);
        },
        /**
         * 检查一个Json对象是不是为空
         * @param obj
         * @returns {boolean}
         */
        isEmpty: function (obj) {
            return window.top.topPage.isEmpty(obj);
        },
        /**
         * 关闭当前对话框页面
         * @param e
         * @param option
         */
        closePage: function () {
            window.top.topPage.closeDialog();
        },
        /**
         * 获取顶级或者指定窗口的可用大小
         * @param win       指定的Window对象，为空时则取window.top对象
         * @returns {*[]}   尺寸的数字数组，如：[750 ,500]
         */
        getWindowSize: function (win) {
            return window.top.topPage.getWindowSize(win);
        },
        /**
         * 根据指定的区域大小计算居中的位置
         * @param offset    以逗号隔开的两个数字字符串，如：”700,400“
         * @param area      区域大小的数字数组，如：[750 ,500]
         * @returns {*[]}   位置的数字数组，如：[750 ,500]
         */
        getCenterOffset: function (offset, area) {
            return window.top.topPage.getCenterOffset(offset, area);
        },
        /**
         * 根据传入的字符串获取指定或默认区域大小
         * @param area      以逗号隔开的两个数字字符串，如：”700,400“
         * @returns {*[]}   区域大小的数字数组，如：[750 ,500]
         */
        getArea: function (area) {
            return window.top.topPage.getArea(area);
        },
        /**
         * 根据当前的时间对象获取所对应的Form对象
         * @param e         发起事件
         * @returns {*}     返回Form对象
         */
        getCurrentForm: function (e) {
            e.page = e.page || this;
            return window.top.topPage.getCurrentForm(e);
        },
        /**
         * 根据标签获取第一个父对象
         * @param e         事件对象
         * @param tag       标签
         * @returns {*}     返回第一个父Tag对象
         */
        getFirstParentByTag: function (e, tag) {
            e.page = e.page || this;
            return window.top.topPage.getFirstParentByTag(e, tag);
        },
        /**
         *获取当前事件Form对象的Action属性
         * @param e             事件对象
         * @returns {string}    Form的Action
         */
        getCurrentFormAction: function (e) {
            e.page = e.page || this;
            return window.top.topPage.getCurrentFormAction(e);
        },
        /**
         * 获取当前事件Form数据的serialize值
         * @param e             事件对象
         * @returns {*|jQuery}  Form数据serialize值
         */
        getCurrentFormData: function (e) {
            e.page = e.page || this;
            return window.top.topPage.getCurrentFormData(e);
        },
        currentMenuTitle: function () {
            return window.top.topPage.currentMenuTitle();
        },
        /**
         * 获取URL参数
         * @param para
         * @returns {*|返回参数值}
         */
        getUrlParam: function (para) {
            return window.top.topPage.getUrlParam(window.location, para);
        },
        /**
         * 获取站点跟路径
         * @returns {*}
         */
        getWebRootPath: function () {

            return window.top.topPage.getWebRootPath();
        },
        /**
         * 初始化验证码
         */
        initCaptcha: function () {
            var _this = this;
            var url = null;
            $(this.formSelector, document).on("click", "[reloadable]", function (e) {
                //lock
                var isLocked = $(e.currentTarget).isLocked();
                if (isLocked) {
                    return;
                }
                if (!url) {
                    url = e.currentTarget.src;
                }
                e.currentTarget.src = url + '?t=' + Math.random();
                $("input[name=code]").val("");
            });
        },
        /**
         * 获取表单验证规则
         * @param $form
         * @returns {*}
         */
        getValidateRule: function ($form) {
            var $ruleDiv = $form.find('div[id=validateRule]');
            if ($ruleDiv.length > 0) {
                var rule = eval("({" + $ruleDiv.text() + "})");
                rule.ignore = ".ignore";
                return rule;
            }
            return null;
        },

        parentTarget: undefined,

        /**
         * 判断给定的数组中不为空的元素是否小于给定的count值
         *
         * @param values 值数组
         * @param count 预期不为空的元素个数
         * @returns {boolean}
         */
        testNotBlankCount: function (values, count) {
            var c = 0;
            if (values.length) {
                for (i in values) {
                    (typeof values[i] == "object" ? values[i].val() : values[i]) && c++;
                }
            }
            return count != 0 && c < count;
        },
        /**
         * 图片预览
         * 预览soul button中的图片，img标签需要有 data-src 属性
         * @param e
         * @param p
         */
        previewImg: function (e, p) {
            var images = $('img', e.currentTarget);
            e.imgs = [];
            if (images[1]) {
                images.each(function (index, obj) {
                    e.imgs.push($(obj).attr('data-src'));
                })
            } else {
                e.imgs.push(images.attr('data-src'))
            }
            //e.imgs = [$('img',e.currentTarget).attr('data-src')];
            window.top.topPage.imageSilde(e, p);
            //$(e.currentTarget).unlock();
        },
        reloadCurrentTab: function (e, b) {
            var $current_tab = $('.nav-tabs .active', this.formSelector);
            var $current_a = $("a[data-toggle]", $current_tab);
            //$current_a.data({load:'2'});
            //$current_a.tab('show');//TODO
            var tabId = $current_a.attr("href");
            var url = $current_a.attr("data-href");
            window.top.topPage.ajax({
                url: url,
                success: function (data) {
                    $(tabId).html(data);
                }
            });
            $(e.currentTarget).unlock();
        }

    });

});