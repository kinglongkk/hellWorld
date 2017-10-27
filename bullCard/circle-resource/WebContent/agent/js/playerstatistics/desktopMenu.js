define(['common/BaseListPage',"echartsAll"], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            echartIndexProfit();
            echartIndexTotal();
            echartIndexActive();
            echartIndexAdd();
            echartIndexLines();
        }
    });
});
//放大缩小
function bigOrSmall(obj,str){
    var $obj = $(obj).parent("div");
    $obj.find("div").html("");
    if($obj.hasClass("big")){
        $(obj).html("放大").removeClass("fa-search-minus").addClass("fa-search-plus");
        $obj.removeClass("big").find("div").removeClass("childBig");
    }else{
        $(obj).html("缩小").removeClass("fa-search-plus").addClass("fa-search-minus");
        $obj.addClass("big").find("div").addClass("childBig");
    }

    if(str == "echartIndexProfit"){
        echartIndexProfit();
    }
    if(str == "echartIndexTotal"){
        echartIndexTotal();
    }
    if(str == "echartIndexActive"){
        echartIndexActive();
    }
    if(str == "addLinesLabels_desk"){
        echartIndexActive();
    }
    if(str == "echartIndexAdd"){
        echartIndexAdd();
    }
    if(str == "echartIndexLines"){
        echartIndexLines();
    }
}
//总盈亏
function echartIndexProfit(){
    var myChart = echarts.init(document.getElementById('echartIndexProfit'));
    myChart.showLoading({
        text: '正在努力的读取数据中...'
    });
    var dataStr = $("#dataStr").val();
    var dataArry = dataStr.split(",");
    var valStr = [];
    $.ajax({
        type:"post",
        url:  root+"/playerDataStatistics/indexDayLinesAjax.html",
        data:{year:$("select[name='year']").val(),month:$("select[name='month']").val()},
        async : true
    }).done(function( data ) {
        valStr = $.parseJSON(data);
        myChart.hideLoading();
        myChart.setOption({
                tooltip : {
                    trigger: 'axis',
                    showDelay: 0,
                    hideDelay: 50,
                    transitionDuration:0,
                    backgroundColor : 'rgba(255,0,255,0.7)',
                    borderColor : '#f50',
                    borderRadius : 8,
                    borderWidth: 2,
                    padding: 10,
                    position : function(p) {
                        return [p[0] + 10, p[1] - 10];
                    },
                    textStyle : {
                        color: 'yellow',
                        decoration: 'none',
                        fontFamily: 'Verdana, sans-serif',
                        fontSize: 15,
                        fontStyle: 'italic',
                        fontWeight: 'bold'
                    },
                    formatter: function (params,ticket,callback) {
                        var res = params[0].name;
                        for (var i = 0, l = params.length; i < l; i++) {
                            res +=  params[i].seriesName + ' : ' + params[i].value;
                        }
                        setTimeout(function (){
                            callback(ticket, res);
                        }, 100)
                        return 'loading';
                    }
                },
                title : {
                    text: '总盈亏'
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: false, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : dataArry
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        scale:true,
                        splitNumber: 3,
                        boundaryGap: [0.05, 0.05],
                        axisLabel: {
                            formatter: function (v) {
                                return Math.round(v/10000) + ' 万'
                            }
                        },
                        splitArea : {show : true}
                    }
                ],
                series : [
                    {
                        name:'盈亏',
                        type:'line',
                        data:valStr
                    }
                ]
            });
    });

}
//总玩家数
function echartIndexTotal(){
    var myChart = echarts.init(document.getElementById('echartIndexTotal'));
    myChart.showLoading({
        text: '正在努力的读取数据中...'
    });
    var dataStr = $("#dataStr").val().split(",");
    var dataInt=[];
    $.ajax({
        type:"post",
        url:  root+"/playerSummery/indexTotalAjax.html",
        data:{year:$("select[name='year']").val(),month:$("select[name='month']").val()},
        async : true
    }).done(function( data ) {
        dataInt= $.parseJSON(data);
        myChart.hideLoading();
        myChart.setOption({
            tooltip : {
                trigger: 'axis',
                showDelay: 0,
                hideDelay: 50,
                transitionDuration:0,
                backgroundColor : 'rgba(255,0,255,0.7)',
                borderColor : '#f50',
                borderRadius : 8,
                borderWidth: 2,
                padding: 10,
                position : function(p) {
                    return [p[0] + 10, p[1] - 10];
                },
                textStyle : {
                    color: 'yellow',
                    decoration: 'none',
                    fontFamily: 'Verdana, sans-serif',
                    fontSize: 15,
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                },
                formatter: function (params,ticket,callback) {
                    var res = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        res +=  params[i].seriesName + ' : ' + params[i].value+'人';
                    }
                    setTimeout(function (){
                        callback(ticket, res);
                    }, 100)
                    return 'loading';
                }
            },
            title : {
                text: '总玩家数'
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: false, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : dataStr
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '单位(人)',
                    splitArea : {show : true}
                }
            ],
            series :[
                {
                    name:'玩家数',
                    type:'bar',
                    data:dataInt
                }
            ]

        });
    });

}
//玩家活跃数
function echartIndexActive(){
    var myChart = echarts.init(document.getElementById('echartIndexActive'));
    myChart.showLoading({
        text: '正在努力的读取数据中...'
    });
    var dataStr = $("#dataStr").val().split(",");
    var dataInt=[];
    $.ajax({
        type:"post",
        url:  root+"/playerSummery/indexActiveAjax.html",
        data:{year:$("select[name='year']").val(),month:$("select[name='month']").val()},
        async : true
    }).done(function( data ) {
        dataInt= $.parseJSON(data);
        myChart.hideLoading();
        myChart.setOption({
            tooltip : {
                trigger: 'axis',
                showDelay: 0,
                hideDelay: 50,
                transitionDuration:0,
                backgroundColor : 'rgba(255,0,255,0.7)',
                borderColor : '#f50',
                borderRadius : 8,
                borderWidth: 2,
                padding: 10,
                position : function(p) {
                    return [p[0] + 10, p[1] - 10];
                },
                textStyle : {
                    color: 'yellow',
                    decoration: 'none',
                    fontFamily: 'Verdana, sans-serif',
                    fontSize: 15,
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                },
                formatter: function (params,ticket,callback) {
                    var res = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        res +=  params[i].seriesName + ' : ' + params[i].value+'人';
                    }
                    setTimeout(function (){
                        callback(ticket, res);
                    }, 100)
                    return 'loading';
                }
            },
            title : {
                text: '玩家活跃数'
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: false, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : dataStr
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '单位(人)',
                    splitArea : {show : true}
                }
            ],
            series :[
                {
                    name:'玩家数',
                    type:'bar',
                    data:dataInt
                }
            ]

        });
    });


}
//玩家新增数
function echartIndexAdd(){
    var myChart = echarts.init(document.getElementById('echartIndexAdd'));
    myChart.showLoading({
        text: '正在努力的读取数据中...'
    });
    var dataStr = $("#dataStr").val().split(",");
    var dataInt=[];
    $.ajax({
        type:"post",
        url:  root+"/playerSummery/indexAddAjax.html",
        data:{year:$("select[name='year']").val(),month:$("select[name='month']").val()},
        async : true
    }).done(function( data ) {
        dataInt= $.parseJSON(data);
        myChart.hideLoading();
        myChart.setOption({
            tooltip : {
                trigger: 'axis',
                showDelay: 0,
                hideDelay: 50,
                transitionDuration:0,
                backgroundColor : 'rgba(255,0,255,0.7)',
                borderColor : '#f50',
                borderRadius : 8,
                borderWidth: 2,
                padding: 10,
                position : function(p) {
                    return [p[0] + 10, p[1] - 10];
                },
                textStyle : {
                    color: 'yellow',
                    decoration: 'none',
                    fontFamily: 'Verdana, sans-serif',
                    fontSize: 15,
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                },
                formatter: function (params,ticket,callback) {
                    var res = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        res +=  params[i].seriesName + ' : ' + params[i].value+'人';
                    }
                    setTimeout(function (){
                        callback(ticket, res);
                    }, 100)
                    return 'loading';
                }
            },
            title : {
                text: '玩家新增数'
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: false, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : dataStr
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '单位(人)',
                    splitArea : {show : true}
                }
            ],
            series :[
                {
                    name:'玩家数',
                    type:'bar',
                    data:dataInt
                }
            ]

        });
    });

}
//额度变化
function echartIndexLines(){
    var myChart = echarts.init(document.getElementById('echartIndexLines'));
    myChart.showLoading({
        text: '正在努力的读取数据中...'
    });
    var dataStr = $("#dataStr").val().split(",");
    var dataInt=[];
    $.ajax({
        type:"post",
        url:  root+"/playerSummery/indexLinesAjax.html",
        data:{year:$("select[name='year']").val(),month:$("select[name='month']").val()},
        async : true
    }).done(function( data ) {
        dataInt= $.parseJSON(data);
        myChart.hideLoading();
        myChart.setOption({
            tooltip : {
                trigger: 'axis',
                showDelay: 0,
                hideDelay: 50,
                transitionDuration:0,
                backgroundColor : 'rgba(255,0,255,0.7)',
                borderColor : '#f50',
                borderRadius : 8,
                borderWidth: 2,
                padding: 10,
                position : function(p) {
                    return [p[0] + 10, p[1] - 10];
                },
                textStyle : {
                    color: 'yellow',
                    decoration: 'none',
                    fontFamily: 'Verdana, sans-serif',
                    fontSize: 15,
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                },
                formatter: function (params,ticket,callback) {
                    var res = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        res +=  params[i].seriesName + ' : ' + params[i].value;
                    }
                    setTimeout(function (){
                        callback(ticket, res);
                    }, 100)
                    return 'loading';
                }
            },
            title : {
                text: '总额度'
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: false, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : dataStr
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    scale:true,
                    splitNumber: 3,
                    boundaryGap: [0.05, 0.05],
                    axisLabel: {
                        formatter: function (v) {
                            return Math.round(v/10000) + ' 万'
                        }
                    },
                    splitArea : {show : true}
                }
            ],
            series :[
                {
                    name:'额度',
                    type:'line',
                    data:dataInt
                }
            ]

        });
    });
}