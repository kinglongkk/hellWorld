define(['custom','elastislide'], function(custom,elastislide) {
    var  start = 0;
    var themeId = 1;
    var fileName='default';
    var sliderStatus = true;
    return Class.extend({
        init:function()
        {

            var _this = this;
            //this.initRelTheme(_this,1);
            this.changeType(_this);

            /*增加快捷菜单滑动-有改动*/

            $("ul>li.menu").mouseover(function(){
                $(this).addClass("shut");
            })
            $("ul>li.menu").mouseleave(function(){
                $(this).removeClass("shut");
            })

            /*快捷菜单按钮效果-有改动*/
            $("ul.home-wrap dd").mouseover(function(){
                $(this).addClass("shut");
            })
            $("ul.home-wrap dd").mouseleave(function(){
                $(this).removeClass("shut");
            })

            $("ul.logo-wrap dd").mouseover(function(){
                $(this).addClass("shut");
            })
            $("ul.logo-wrap dd").mouseleave(function(){
                $(this).removeClass("shut");
            })

            //themes
            $("ul>li.themes").click(function(){
                $("ul>li.themes").addClass("open");
                $(".themes_list").slideToggle();
            })
            $(".pack_up").click(function(){
                $("ul>li.themes").removeClass("open");
                $(".themes_list").slideToggle();
            })
            //themes
            $("ul>li.adown").click(function(){
                $("ul>li.adown").toggleClass("open");
                $(".adown_list").slideToggle();
            })

        },
        //异步加载主题列表
        initRelTheme:function(_this,typeId){
            var url = "sysTheme/list/"+typeId+".html";
            window.top.topPage.ajax({
                url:url,
                dataType:'json',
                cache: false,
                type:"get",
                success:function(data){
                    var listVo = data["1"];
                    var user = data["2"];
                    var start,id;
                    if(user) {
                        start = user['lucency'];
                        id = user['themeId'];
                    }
                    var html = '<ul id="carousel" class="elastislide-list">';
                    var picUrl = "http://rcenter.me.so:8080/rcenter/static/mcenter/images/small/";
                    $.each(listVo, function(key, val) {
                        var str = "";
                        if(id==val['id']){
                            str = 'checked="checked"';
                        }
                        if(val['id']==1){
                            html +='<li><a href="javascript:void(0)"><img src="'+picUrl+val['pic']+'" alt="'+val['name']+'" /></a><label><input id="checkBoxDefault" type="checkbox" class="i-checks" tt="'+val['id']+'" fileName="'+val['fileName']+'" name="themeCheckbox" '+str+'></label></li>';
                        }else{
                            html +='<li><a href="javascript:void(0)"><img src="'+picUrl+val['pic']+'" alt="'+val['name']+'" /></a><label><input type="checkbox" class="i-checks" tt="'+val['id']+'" fileName="'+val['fileName']+'" name="themeCheckbox" '+str+'></label></li>';
                        }
                    });
                    $("#themeDiv").html(html+'</ul>');
                    _this.carouselElastislide();
                    _this.checkBox(_this);
                    _this.notUseTheme(_this);
                    if(sliderStatus){
                        _this.slider(_this);
                        sliderStatus=false;
                    }
                }});
        },
        carouselElastislide:function(){
            $( '#carousel' ).elastislide( {
                minItems : 2
            } );
        },
        checkBox:function(_this){
            $('input[name="themeCheckbox"]').click(function(){
                themeId = $(this).attr("tt");
                fileName = $(this).attr("fileName");
                if($(this).prop("checked")==true){
                    $('input[name="themeCheckbox"]').prop("checked", false);
                    this.checked=true;
                }else{
                    $("#checkBoxDefault").prop("checked", true);
                    themeId = $("#checkBoxDefault").attr("tt");
                    fileName = $("#checkBoxDefault").attr("fileName");
                }

                _this.editTheme();
            });

        },
        changeType:function(_this){
            $('a[name="themeTypeId"]').click(function(){
                $('a[name="themeTypeId"]').removeAttr("class");
                $(this).attr("class", "current");
                var typeId = $(this).attr("tt");
                _this.initRelTheme(_this,typeId);
            });
        },
        slider:function(_this){
            /*透明度滑块*/
            $("#basic_slider").noUiSlider({
                start: start,
                step: 1,
                behaviour: 'tap',
                connect: 'upper',
                range: {
                    'min':  0,
                    'max':  100
                }
            }).on('change',function(ev){
                start = parseInt($(this).val());
                _this.editTheme();
            })
        },
        notUseTheme:function(_this){
            $('#notUseTheme').click(function(){
                $('input[name="themeCheckbox"]').prop("checked", false);
                $("#checkBoxDefault").prop("checked", true);
                themeId = $("#checkBoxDefault").attr("tt");
                fileName = $("#checkBoxDefault").attr("fileName");
                _this.editTheme();
            });
        },
        editTheme:function(){
            var url = "sysTheme/editTheme.html";
            window.top.topPage.ajax({
                url:url,
                dataType:'json',
                cache: false,
                type:"get",
                data:{"id":themeId,"lucency":start,"fileName":fileName},
                success:function(data){
                    var bo = data["bo"];
                    if(!bo){
                        alert(data['msg']);
                    }
                }});
        }
    });

});