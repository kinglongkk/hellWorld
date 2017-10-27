define(['bootstrap-dialog','jsrender'], function (BootstrapDialog,jsrender) {
    return Class.extend({
        topMenu:"#side-menu",
        init: function () {
            var _this = this;
            window.top.topPage.ajax({
                cache: true,
                type: "GET",
                url: "index/content.html",
                success: function (data) {
                    $("#page-content").html(data);
                    if(location.hash.length>1) {
                        $("#mainFrame").load(root+location.hash.substr(1));
                    }else{
                        $(_this.topMenu + " li a").first().click();
                    }
                }
            });
        },
        /**
         *
         */
        exit: function () {
            if(confirm('您确定要退出系统？')) {
                window.location.reload();
                //$.ajax({
                //    url: joy.getWebRootPath()+"/logout?_joy_key__logout_method_code=11",
                //    error: function (request) {
                //        alert("发生未预期的错误！");
                //    },
                //    success: function (data) {
                //        window.location.reload();
                //    }
                //});
            }
        }
    });

});