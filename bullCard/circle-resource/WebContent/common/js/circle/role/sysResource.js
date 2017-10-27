define(['common/BasePage','jstree','common/BaseEditPage','css!themesCss/jquery/plugins/jquery.jstree/jquery.jstree.min.css','common/BaseListPage'], function(BasePage,jstree,BaseEditPage) {
    return BaseEditPage.extend({
        init : function() {
            this._super();
            $('[name="search.roleId"]').val(this.getUrlParam("roleId"));
     /*       if(jstree){
            }*/
                this.createTree();
            //this.getTreeDate();


        },
        /**
         * 当前对象事件初始化函数
         */
        bindEvent : function() {
            this._super();
            //this.bindButtonEvents();
        },
        createTree:function (_data){
            var s = $("MuLuHtml");

/*            $('#MuLuHtml').jstree({
                'core' : {
                    'data' : {
                        'url' : function (node) {
                            return node.id === '#' ?
                                'ajax_roots.json' :
                                'ajax_children.json';
                        },
                        'data' : function (node) {
                            return { 'id' : node.id };
                        }
                    }
                });*/
            var dddate;
            var _this = this;
            $('#MuLuHtml').jstree({
                    'core' : {
                        'data' : {
                            "url" :root+"/sysResource/listResourceTree.html",
                            "dataType" : "json", // needed only if you do not supply JSON headers
                            "data" :function (node){
                                return {"search.roleId":$("[name='search.roleId']").val()}
                            },
                            "success":function(data){
                                $('#MuLuHtml').on("changed.jstree");

                            }
                        }
                    },
                "plugins" : ["checkbox"]
                })
                .bind("loaded.jstree", function(e,data){
                    window.setTimeout(function(){ _this.resizeDialog();},100);
                });
            $('#MuLuHtml').on("changed.jstree", function (e, data) {
                $("form [name='search.resourceIds']").remove();
                for (var i = 0;data.selected[i];i++){
                    $("form").append("<input value='"+data.selected[i]+"' name='search.resourceIds' type='hidden'>")
                }
            });


/**/

/*
                $('#MuLuHtml').jstree({'plugins':["wholerow","checkbox"], 'core' : {
                    'data' : [
                        {
                            "text" : "Same but with checkboxes",
                            "children" : [
                                { "text" : "initially selected", "state" : { "selected" : true } },
                                { "text" : "custom icon URL", "icon" : "http://jstree.com/tree-icon.png" },
                                { "text" : "initially open", "state" : { "opened" : true }, "children" : [ "Another node" ] },
                                { "text" : "custom icon class", "icon" : "glyphicon glyphicon-leaf" }
                            ]
                        },
                        "And wholerow selection"
                    ]
                }});
*/


            /**/
        }/*,
        getTreeDate:function(){
            var _this = this;
            var ss ={
                url:  root+"/sysResource/listResourceTree.html",
                error: function(request, state, msg) {
                    //unclock
                    //$(e.target).unlock();
                    _this.showErrorMessage(msg);
                },
                success: function(data) {
                    //console.log(eval("("+data+")"));
                    //console.log(data);

                    data = eval("("+data+")")
                    for(var i = 0;data[i];i++){
                        data[i].id = data[i].object["id"];
                        data[i].state = true;
                        data[i].text = data[i].object["name"];

                        for(var ii = 0;data[i].children[ii];ii++){
                            //data[i].children[ii].state = { "selected" : true };
                            data[i].children[ii].id = data[i].children[ii].object["id"];
                            data[i].children[ii].text = data[i].children[ii].object["name"];
                        }
                    }
                    _this.createTree(data);
                }
            };

            $.ajax(ss);
        }*/
        ,
        saveResource:function(e,op){
            var _data = this.getCurrentFormData1();
            var that = this;
            var treeIds = $("form.tree").serialize();
            var treeAry = treeIds.split("&");
            if (treeAry.length==1) {
                window.top.topPage.showWarningMessage(window.top.message.common['choose.one.row']);
                $(e.currentTarget).unlock();
                return;
            }
            window.top.topPage.ajax({
                type: "POST",
                //headers: {'Content-type': 'application/json;charset=UTF-8'},
                url: root+"/sysResource/resetPermissions.html",
                dataType:'json',
                data:treeIds,
                error: function (request) {
                    window.top.topPage.showWarningMessage(window.top.message.common['unexpect.error']);
                    //alert("发生未预期的错误！");
                    $(e.currentTarget).unlock();
                },
                success: function (data) {
                    $(e.currentTarget).unlock();
                    that.saveCallbak()
                }
            });
        },
        getCurrentFormData1 :function (){
            return {'resourceIds':eval("["+$("[name='search.resourceIds']").val()+"]"),'roleId':Number($(".roleId").val())};
        }
    });
});