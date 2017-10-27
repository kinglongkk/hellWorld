define(['bootstrap-dialog','jsrender'], function (BootstrapDialog,jsrender) {
    return Class.extend({
        topMenu:".navbar-nav",
        init: function () {
            var _this = this;
            window.top.topPage.ajax({
                cache: true,
                type: "GET",
                loading:true,
                url: "sysResource/fetchAllMenus.html",
                success: function (data) {
                    if(data == "[]"){
                        window.top.topPage.showErrorMessage("获取菜单为空");
                        return;
                    }
                    var json = eval(data);
                    if(json.length>0) {
                        var html = $("#topMenuTmpl").render({m: json});
                        $(_this.topMenu).html(html);
                        if(json[0].object.resourceUrl){
                            _this.setFirstUrl(json[0].object.resourceUrl);
                        }else{
                            if(json[0].children.length>0){
                                _this.setFirstUrl(json[0].children[0].object.resourceUrl);
                            }
                        }
                        $("#mainFrame").css("minHeight", $(window).height() - $(".top:first").outerHeight() - $(".footer:first").outerHeight());
                    }
                    _this.showMenu();
                    _this.showDefaultMenu();
                }
            });
            _this.buildHomeLink();

        },

        setFirstUrl: function (url) {
            window.top.topPage.ajax({
                cache: true,
                type: "GET",
                sync:false,
                loading: true,
                url: url,
                success: function (data) {
                    var targetSelect;
                    if(location.hash.length>1){
                        if($("[href='"+location.hash.substr(1)+"'][nav-top]").length==0) {
                            $("#mainFrame").html(data);
                            targetSelect="#mainFrame";
                        }else{
                            targetSelect="#mainFrame";
                        }
                        $(targetSelect).html("");
                        window.top.topPage.ajax({
                            cache: true,
                            type: "GET",
                            sync:false,
                            loading: false,
                            url: root+location.hash.substr(1),
                            success: function (data1) {
                                $(targetSelect).html(data1);
                            }
                        });
                    }else{
                        $("#mainFrame").html(data)
                    }
                }
            });
        },

        showMenu: function () {
            {$(".navbar-nav .dropdown").hover(
                function() {
                    $('.dropdown-menu', this).not('.in .dropdown-menu').show();
                    $(this).toggleClass('open');
                },
                function() {
                    $('.dropdown-menu', this).not('.in .dropdown-menu').hide();
                    $(this).toggleClass('open');
                }
            );}
        },

        showDefaultMenu : function () {
            $("a[nav-top]:first").click();

        },

        buildHomeLink: function () {
            $(".home a").bind("click",function(e)
            {
                if(root!=window.location.href && root+"/index.html"!=window.location.href)
                {
                    window.location.href=root;
                }
                return false;
            });
        }
    });

});