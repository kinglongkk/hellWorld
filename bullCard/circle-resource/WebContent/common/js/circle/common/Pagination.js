define([], function () {

    return Class.extend({
        formSelector:"",
        targetPage:null,
        init: function (formSelector) {
            this.formSelector=formSelector;
            this._bindEvent();
        },
        _bindEvent: function () {
            var _this = this;
            $(_this.formSelector).on("click",".pagination a", function (e) {
                if(_this._isAEnabled($(this))) {
                    if(this.name=="paging.firstPageNumber") {
                        e.goType = -2;
                    }else if(this.name=="paging.prePage") {
                        e.goType = -1;
                    }
                    else if(this.name=="paging.Page") {
                        var form=window.top.topPage.getCurrentForm(e);
                        if(!/^\d+$/.test($(this).text())) {
                            e.preventDefault();
                            return false;
                        }
                        $("[name='paging.pageNumber']",form).val($(this).text());
                        e.goType = 0;
                    }
                    else if(this.name=="paging.nextPage") {
                        e.goType = 1;
                    }
                    else if(this.name=="paging.lastPageNumber") {
                        e.goType = 2;
                    }
                    e.page=_this.targetPage;
                    _this.gotoPage(e);
                }
            });
            $(_this.formSelector).on("click",".dataTables_paginate button", function (e) {
                e.preventDefault();
                e.goType = 0;
                var form=window.top.topPage.getCurrentForm(e);
                $("[name='paging.pageNumber']",form).val($("[name='paging.pageNumberText']",form).val());
                e.page=_this.targetPage;

                _this.gotoPage(e);
            });
            $(_this.formSelector).on("keydown",".dataTables_paginate input", function (e) {
                var e = window.event || e;
                var c = e.keyCode || e.which;
                // Allow: backspace, delete, tab, escape, enter and .
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                        // Allow: Ctrl+A
                    (e.keyCode == 65 && e.ctrlKey === true) ||
                        // Allow: Ctrl+C
                    (e.keyCode == 67 && e.ctrlKey === true) ||
                        // Allow: Ctrl+X
                    (e.keyCode == 88 && e.ctrlKey === true) ||
                        // Allow: home, end, left, right
                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                    // let it happen, don't do anything
                    return;
                }
                if(!((c>=48 && c<=57) ||(c>=96 && c<=105)))
                {
                    e.preventDefault();
                    return false;
                }
            });
            $(_this.formSelector).on("focus",".pagination input", function (e) {
                $(this).select();
            });
            /**
             * 跳转只能输入数字
             */
            $(_this.formSelector).on("keypress",".pagination input", function (e) {
                var e = window.event || this;
                var c = e.keyCode || e.which;
                if (c == 13) {
                    var form=window.top.topPage.getCurrentForm(e);
                    if(!/^\d+$/.test($(this).val())) {
                        if(this.name=="paging.pageSizeText") {
                            $(this).val($("[name='paging.pageSize']",form).val());
                        }else if(this.name=="paging.pageNumberText") {
                            $(this).val($("[name='paging.pageNumber']",form).val());
                        }
                        e.preventDefault();
                        return false;
                    }
                    e.goType = 0;
                    if(this.name=="paging.pageSizeText") {
                        $("[name='paging.pageSize']",form).val($(this).val());
                    }else if(this.name=="paging.pageNumberText") {
                        $("[name='paging.pageNumber']",form).val($(this).val());
                    }
                    e.page=_this.targetPage;
                    _this.gotoPage(e);
                }
            });

            /*$(_this.formSelector).on("change","selectdiv[name='paging.pageSize']", function (e) {
                e.goType=-2;
                e.page=_this.targetPage;
                _this.gotoPage(e);
            });*/

        },

        _isAEnabled : function(a) {
            return !a.parent().hasClass('disabled');
        },

        gotoPage: function (e) {
            var form=window.top.topPage.getCurrentForm(e);
            var pageNumber=1;
            if(e.goType == -2) {
                pageNumber=$("[name='paging.firstPageNumber']",form).val();
            }else  if(e.goType == -1) {
                pageNumber=$("[name='paging.prePage']",form).val();
            }else  if(!e.goType || e.goType == 0) {
                pageNumber=$("[name='paging.pageNumber']",form).val();
                var pNumber=parseInt(pageNumber);
                if(pNumber.toString()!=pageNumber){
                    pageNumber=1;
                }
            }else  if(e.goType == 1) {
                pageNumber=$("[name='paging.nextPage']",form).val();
            }else  if(e.goType == 2) {
                pageNumber=$("[name='paging.lastPageNumber']",form).val();
            }

            $("[name='paging.pageNumber']",form).val(pageNumber);
            e.page.query(e);
            return false;
        },
        //region 表格排序事件
        /**
         * 排序事件初始化函数
         * @param form          排序Form对象
         * @private             私有函数
         */
        processOrderColumnTag: function (page,form) {
            var _this=this;
            _this.targetPage=page;

            _this.targetPage.bindSelectChange($("input[name='paging.pageSize']"),function (e) {
                e.goType=-2;
                e.page=_this.targetPage;
                _this.gotoPage(e);
            });
            _this.targetPage.bindSelectChange($("select[name='paging.pageSize']"),function (e) {
                e.goType=-2;
                e.page=_this.targetPage;
                _this.gotoPage(e);
            });
            if(!form)
            {
                form=document.forms[0];
            }


            if ($('th input[property]',form).length != 0) {
                var $orderHiddens = $('th input[property]',form);
                $orderHiddens.each(function (i, item) {
                    var $orderHidden = $(item);
                    var property = $orderHidden.attr("property");
                    var order = $orderHidden.val();
                    if (order) {
                        var _order = order.toUpperCase() == "DESC" ? "sorting_desc" : "sorting_asc";
                        $orderHidden.parent().removeClass("sorting").removeClass("sorting_asc")
                            .removeClass("sorting_desc").addClass(_order);
                    }
                    var $th = $orderHidden.parent("th");
                    $th.css("cursor", "hand");

                    $th.hover(function () {
                        $th.addClass("sorting-hover");
                    }, function () {
                        $th.removeClass("sorting-hover");
                    });

                    $th.click(function (e) {
                        order = $orderHidden.val();
                        $orderHiddens.each(function (i, item) {
                            $(item).val(''); // 清除所有排序
                        });
                        if (order == "DESC") {
                            $orderHidden.val("");
                        } else if (order == "ASC") {
                            $orderHidden.val("DESC");
                        } else {
                            $orderHidden.val("ASC");
                        }
                        e.page=page;
                        _this.gotoPage(e);
                    });
                });
            }
        }
        //endregion
    });

});