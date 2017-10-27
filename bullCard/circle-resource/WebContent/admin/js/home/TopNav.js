define(['bootstrap-dialog','jsrender'], function (BootstrapDialog,jsrender) {
    return Class.extend({
        topMenu:".navbar-nav",
        init: function () {
            var _this = this;
            //_this.language();
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