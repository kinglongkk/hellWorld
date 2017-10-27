/**
 * Created by jeff on 15-10-26.
 */
define(['common/BaseEditPage','jstree','css!themesCss/jquery/plugins/jquery.jstree/jquery.jstree.min.css'], function (BaseEditPage,Jstree) {

    return BaseEditPage.extend({
        resourceJson:{},
        selectedArray:null,
        init: function () {
            console.log(new Date().getTime())
            this._super();
        },
        bindEvent: function () {
            this._super();
        },
        onPageLoad: function () {
            this._super();
            this.getResource(null,{post:$("#firstRoleId").val()});
            $(".side-left li.not_built_in a.img").mousedown(function(){
                $(this).parent("li").children(".edit").toggle();
            });
            $("li.not_built_in").mousemove(function(){
                $(this).addClass("current");
            });
            $("li.not_built_in").mouseleave(function(){
                var $this = $(this)
                $this.removeClass("current");
                $(".edit",$this).hide();
            });
            $("li.not_built_in .edit").mouseleave(function(){
                $(this).hide();
            });
            console.log(new Date().getTime());
        },
        /**
         * 递归得出该角色拥有的菜单
         * @param node
         * @param select
         */
        getMenu:function(node,select){
            var that=this;
            if(node.children && node.children.length>0){
                var children=[];
                for(var j = 0;node.children[j]; j++){
                    if(node.children[j].state.selected){
                        var sel= [];var obj = {};
                        that.getMenu(node.children[j],obj);
                        (obj && obj.id )&& children.push(obj);
                    }
                }
                if(children.length>0){
                    select.text = node.text;
                    select.state = node.state;
                    select.children = children;
                    select.id = node.id;
                }
            }
            else
            {
                if(node.state.selected){
                    select.text=node.text;
                    select.state=node.state;
                    select.id=node.id;
                }
            }
        },
        /**
         * 将父节点改为选中状态改为false
         * @param node
         * @param obj
         */
        changeParentNode:function(node,obj){
            for(var i = 0;node[i];i++){
                if(node[i].children){
                    node[i].state ={opened:node[i].state.opened,selected:false}
                    this.changeParentNode(node[i].children);
                }
            }

        },
        getResource:function( event , option ){
            var that = this;
            var roleId =(option&&option.post) ? option.post : eval('('+$('.side-left li:eq(0) a[data-rel]').data('rel')+')').post;
            var _selector = '#role_'+roleId;
            var allRoleBan = $(".role_tab_ban");
            var $currentRoleBan = $(_selector);
            var $currentRoleTree = $(_selector).find("div.role_tree");


            /*同级的恢复为预览状态*/
            var $editRole = $currentRoleBan.siblings(".role_edit");
            /*如果存在编辑的其他角色，置为预览状态*/
            if($editRole.length){
                var editRoleId = $("[name=roleId]input",$editRole).val();
                var obj = {post:editRoleId};
                editRoleId && this.cancelEdit(null,obj);

            }

            allRoleBan.addClass("hide");
            /*不是当前显示*/
            if($currentRoleBan.hasClass("hide")){
                /*已经取过 直接显示*/
                if($currentRoleTree.html().trim()){
                    /*已有数据直接显示*/
                    $currentRoleBan.removeClass('hide');

                    /*新增页清空内容*/
                    if("0" === roleId){
                        $('[name="result.name"]',$currentRoleBan).val('');
                        $currentRoleTree.jstree('uncheck_all')
                    }
                }else{
                    window.top.topPage.ajax({
                        url:root+"/sysResource/listResourceTree.html",
                        dataType:"json",
                        data:{
                            "search.roleId":roleId
                        },
                        success:function(data){

                            var obj = that.resourceJson[roleId] = {all:data};
                            /*所有的菜单*/
                            var dataAll = data;

                            /*角色所拥有的菜单*/
                            var selected = [];
                            /**/
                            for(var i = 0;dataAll[i]; i++){
                                var obj = {};
                                that.getMenu(dataAll[i],obj);
                                obj.id && (selected[selected.length] = obj);
                            }
                            that.changeParentNode(data);
                            /*添加到当前对象中*/
                            that.resourceJson[roleId]['selected'] = selected;

                            /*初始化树结构*/
                            $currentRoleTree.jstree({
                                'core' : {
                                    'data' :selected
                                }
                            });

                            /*加载结束显示*/
                            $currentRoleBan.removeClass('hide');
                            if(roleId === '0'){
                                that.editRole(null,{post:roleId});
                            }
                        }
                    });
                }
            }
            if(event){
                $(event.currentTarget).unlock();
            }

        },
        /**
         * 编辑角色 更改树结构
         * @param event
         * @param option
         */
        editRole:function( event , option ){
            var roleId = option.post;
            var _selector = '#role_'+roleId;
            var $currentRoleBan = $(_selector);
            var $currentRoleTree = $(_selector).find("div.role_tree");
            var allRoleBan = $(".role_tab_ban");
            var data = this.resourceJson[roleId]['all'];
            var role_navigetion = '';
            var $nav = $('.role_navigation',$currentRoleBan);

            /*编辑的添加class role_edit*/
            $currentRoleBan.addClass("role_edit");

            allRoleBan.addClass("hide");
            $currentRoleTree.jstree('destroy');
            $currentRoleTree.jstree({
                'core' : {
                    'data' :data
                }
                ,"plugins" : ["checkbox"]
            });
            /*改变角色名称的name 为表单验证*/
            $("[data-name]input").prop('name','');
            var $roleName = $("[data-name]",$currentRoleBan);
            $roleName.length && $roleName.prop("name",$roleName.data().name);


            /****** 导航 ******/
            
            if(!$nav.html().trim()){
                for(var i = 0;data[i];i++){
                    role_navigetion += '<li><a href="javascript:void(0)" data-anchor="'+data[i].id+'_anchor">'+data[i].text+'</a></li>';
                }
                $nav.html(role_navigetion);
            }
            $("[data-anchor]",$nav).off("click").on("click",function(){
                var $this = $(this);
                var offsetTop = $('#'+$this.data().anchor).offset().top;
                $(window).scrollTop(offsetTop)
            });

            $(".role_edit_content",$currentRoleBan).removeClass('hide');
            $(".show_role_content",$currentRoleBan).addClass('hide');
            $currentRoleBan.removeClass('hide');
            $currentRoleTree.addClass("pull-left");
            event && $(event.currentTarget).unlock();
        },
        /**
         * 取消编辑 恢复树结构
         * @param event
         * @param option
         */
        cancelEdit:function( event , option ){
            var roleId = option.post;
            var _selector = '#role_'+roleId;
            var $currentRoleBan = $(_selector);
            var $currentRoleTree = $(_selector).find("div.role_tree");
            var allRoleBan = $(".role_tab_ban");
            var data = this.resourceJson[roleId]['selected'];

            /*取消编辑的删除class role_edit*/
            $currentRoleBan.removeClass("role_edit");

            allRoleBan.addClass("hide");
            $currentRoleTree.jstree('destroy');

            $currentRoleTree.jstree({
                'core' : {
                    'data' : data
                }
            });
            $(".role_edit_content",$currentRoleBan).addClass('hide');
            $(".show_role_content",$currentRoleBan).removeClass('hide');
            $currentRoleBan.removeClass('hide');
            $currentRoleTree.addClass("pull-left");
            event && $(event.currentTarget).unlock();
        },
        saveRole:function (event , option){
            var that = this;
            var $currentRoleBan = $('.role_tab_ban:not(.hide)');

            /*当前编辑的资源树*/
            var $currentRoleTree = $('div.role_tree',$currentRoleBan);
            var roleId = $('input[name=roleId]',$currentRoleBan).val();
            var roleName = $('input[name="result.name"]',$currentRoleBan).val();
            $('._roleName',$currentRoleBan).html(roleName);
            roleId && $('._roles [data-id='+roleId+'] b').html(roleName);
            var selectedArray = this.selectedArray = $currentRoleTree.jstree('get_selected');
            var selectedArray_len = selectedArray.length;
            var errorMessage = "";
            if(!$currentRoleTree.hasClass("builtIn") && !roleName.trim()){
                errorMessage = window.top.message.subAccount['role.nameEmpty']
            }else if(!selectedArray_len){
                errorMessage = window.top.message.subAccount['role.resourceIdNotNull']
            }
            if(errorMessage){
                window.top.topPage.showWarningMessage(errorMessage);
                $(event.currentTarget).unlock();
                return;
            }
            var getParent = function (roleId){
                var parentId = $currentRoleTree.jstree('get_parent',roleId);
                if(parentId && $currentRoleTree.jstree('is_parent',parentId) && parentId !== '#'){
                    selectedArray.indexOf(parentId) === -1 && selectedArray.push(parentId);
                    getParent(parentId);
                }
            }

            for (var i = 0; i < selectedArray_len; i++){
                getParent(selectedArray[i]);
            }
            /*search.resourceIds*/
            var data = 'search.resourceIds='+selectedArray.join('&search.resourceIds=')+'&search.roleId='+roleId;
            if(roleName){
                data += "&roleName="+roleName;
            }
            window.top.topPage.ajax({
                type:"POST",
                url:root+'/sysResource/resetPermissions.html',
                data:data,
                success:function(data){
                    if(!roleId){
                    //    新增一条
                         that.reload(data);
                    }else{
                        $(".role_edit_content",$currentRoleBan).addClass('hide');
                        $(".show_role_content",$currentRoleBan).removeClass('hide');
                        $currentRoleTree.jstree("destroy");
                        that.getResource(null,{post:roleId})
                    }
                    $(event.currentTarget).unlock();
                    //that.query(event,option);
                }
            })
            /*$.unique(s)*/
        },
        deleteCurrentli:function( event , option){
            var $current_btn = $(event.currentTarget);
            var $parent_li = $current_btn.parents("li.air");
            var roleId = $parent_li.data().id;
            $parent_li.remove();
            !$("#role_"+roleId).hasClass("hide") && this.getResource();
            $(event.currentTarget).unlock();
        },
        deleteRole:function( event , option){
            var that = this;
            var roleId = option.post;
            window.top.topPage.ajax({
                url:root+"/subAccount/getRoleUsingUser.html",
                data:{
                    'search.roleId':roleId
                },
                success:function(count){
                    var message = window.top.message;
                    var confirmMessage = Number(count) ? message.subAccount['role.delete'].replace('{x}',count):message.subAccount['role.deleteConfirm'];
                    window.top.topPage.showConfirmMessage(confirmMessage,function(bol){
                        if(bol){
                            window.top.topPage.ajax({
                                url:root+'/subAccount/deleteRole.html',
                                data:{
                                    'search.id':option.post
                                },
                                success:function(data){
                                    that.deleteCurrentli( event , option);
                                }
                            });
                        }
                        $(event.currentTarget).unlock();
                    });
                }
            })
        },
        reload:function(roleId){
            var $currentRoleBan = $('.role_tab_ban:not(.hide)');
            var roleId = Number(roleId) !== Number(roleId) ? $('input[name=roleId]',$currentRoleBan).val():roleId;
            var that = this;
            window.top.topPage.ajax({
                url:root+'/subAccount/role.html',
                data:{"search.id":roleId},
                headers: {
                    "Soul-Requested-With":"XMLHttpRequest"
                },
                type:"post",
                success:function(data){
                    var $result=$(".search-list-container");
                    $result.html(data);
                    that.onPageLoad();
                }
            });
        }

    });
});