
define(['common/BaseListPage',"echartsAll"], function (BaseListPage) {
    return BaseListPage.extend({
        init: function () {
            var agent = $("select[name='agent']").val();
            if(agent == "all"){
                $("#echartIndexPie").parent().show();
                echartIndexPie();
            }else{
                $("#echartIndexPie").parent().hide();
            }
            getProfitAmount();
            echartIndexProfit();
            echartIndexTotal();
            echartIndexActive();
            echartIndexAdd();
            echartIndexLines();
            echartIndexPie();
            todayAddActive();
        }
    });
});
 //实时查询代理商玩家盈亏
function

getProfitAmount(){
    profitAmount();
    setInterval(function () {
        profitAmount();
    }, 120000);
}
function profitAmount(){

    var agent = $("select[name='agent']").val();
    if (new RegExp("@@@").test(agent)) {
        var username = agent.split("@@@")[1];
        rootUrl = root+"/agentDateActual/getProfitAmount.html?username="+username;
    } else {
        rootUrl = root+"/agentDateActual/getProfitAmount.html";
    }
    $.ajax({
        type:"post",
        url:  rootUrl,
        async : true
    }).done(function( data ) {
        // var obj =  $.parseJSON(data);
        if(data == null || data == undefined || data == "")
            $("#profitAmount").html("0");
        else
            $("#profitAmount").html(data);

    });
}
//今日玩家新增数和活跃数
function todayAddActive(){

    var agent = $("select[name='agent']").val();
    if (new RegExp("@@@").test(agent)) {
        var agentId = agent.split("@@@")[0];
        rootUrl = root+"/playerSummery/playerAddActive.html?agentId="+agentId;
    } else {
        rootUrl = root+"/playerSummery/playerAddActive.html";
    }
    $.ajax({
        type:"post",
        url:  rootUrl,
        async : true
    }).done(function( data ) {
        var obj =  $.parseJSON(data);
        $("#dxactive").html(obj.totalActive);
        $("#dxadd").html(obj.totalAdd);
    });
}
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
    if(str == "echartIndexAdd"){
        echartIndexAdd();
    }
    if(str == "echartIndexLines"){
        echartIndexLines();
    }
    if(str == "echartIndexPie"){
        echartIndexPie();
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
    var year = $("select[name='year']").val();
    var month = $("select[name='month']").val();
    var valStr = [];
    var rootUrl = "";
    var agent = $("select[name='agent']").val();
    if (new RegExp("@@@").test(agent)) {
        var username = agent.split("@@@")[1];
        rootUrl = root+"/playerDataStatistics/echartIndexProfitAgentAjax.html?year="+year+"&month="+month+"&username="+username;
    } else {
        rootUrl = root+"/playerDataStatistics/echartIndexProfitAjax.html?year="+year+"&month="+month;
    }
    $.ajax({
        type:"post",
        url: rootUrl,
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
    var year = $("select[name='year']").val();
    var month = $("select[name='month']").val();
    var rootUrl = "";
    var agent = $("select[name='agent']").val();
    if (new RegExp("@@@").test(agent)) {
        var username = agent.split("@@@")[1];
        rootUrl = root+"/playerSummery/indexOnePlayerAjax.html?year="+year+"&month="+month+"&username="+username+"&type=all";
    } else {
        rootUrl = root+"/playerSummery/echartIndexTotal.html?year="+year+"&month="+month;
    }
    $.ajax({
        type:"post",
        url:  rootUrl,
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
    var year = $("select[name='year']").val();
    var month = $("select[name='month']").val();
    var rootUrl = "";
    var agent = $("select[name='agent']").val();
    if (new RegExp("@@@").test(agent)) {
        var username = agent.split("@@@")[1];
        rootUrl = root+"/playerSummery/indexOnePlayerAjax.html?year="+year+"&month="+month+"&username="+username+"&type=active";
    } else {
        rootUrl = root+"/playerSummery/echartIndexActiveAjax.html?year="+year+"&month="+month;
    }
    $.ajax({
        type:"post",
        url: rootUrl,
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
    var year = $("select[name='year']").val();
    var month = $("select[name='month']").val();
    var rootUrl = "";
    var agent = $("select[name='agent']").val();
    if (new RegExp("@@@").test(agent)) {
        var username = agent.split("@@@")[1];
        rootUrl = root+"/playerSummery/indexOnePlayerAjax.html?year="+year+"&month="+month+"&username="+username+"&type=add";
    } else {
        rootUrl = root+"/playerSummery/echartIndexAddAjax.html?year="+year+"&month="+month;
    }
    $.ajax({
        type:"post",
        url:  rootUrl,
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
    var year = $("select[name='year']").val();
    var month = $("select[name='month']").val();
    var dataInt=[];
    var rootUrl = "";
    var agent = $("select[name='agent']").val();
    if (new RegExp("@@@").test(agent)) {
        var agentId = agent.split("@@@")[0];
        rootUrl = root+"/playerSummery/echartIndexLinesAgentAjax.html?year="+year+"&month="+month+"&agentId="+agent.split("@@@")[0];

    } else {
        rootUrl = root+"/playerSummery/echartIndexLinesAjax.html?year="+year+"&month="+month;
    }
    $.ajax({
        type:"post",
        url:  rootUrl,
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
//每日玩家前10 代理商
function echartIndexPie(){

    var myChart = echarts.init(document.getElementById('echartIndexPie'));
    myChart.showLoading({
        text: '正在努力的读取数据中...'
    });
    var dataArray = [];
    $.ajax({
        type:"post",
        url:  root+"/playerSummery/indexPieAjax.html",
        data:{dateTime:$("input[name='dateTime']").val()},
        async : true
    }).done(function( data ) {
        var a = $.parseJSON(data);
        var jsonArr = new Array();
        for(var i =0 ; i < a.length;i++){
            var childArray = {};
            dataArray[i]=a[i].username;
            childArray["value"] =  a[i].percentage;
            childArray["name"] =a[i].username;
            jsonArr.push(childArray);
        }
        var title = "代理商前10玩家汇总"
        if(dataArray.length == 0){
            title = title + "【暂无数据】";
        }
        myChart.hideLoading();
        myChart.setOption({
            title : {
                text: title,
                subtext: '昨日数据',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                showDelay: 0,
                hideDelay: 50,
                transitionDuration:0,
                backgroundColor : 'rgba(255,0,255,0.7)',
                borderColor : '#f50',
                borderRadius : 8,
                borderWidth: 2,
                padding: 10,
                textStyle : {
                    color: 'yellow',
                    decoration: 'none',
                    fontFamily: 'Verdana, sans-serif',
                    fontSize: 15,
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                },
                formatter: "{a} <br/>{b} : {d}%"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
                data:dataArray
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: false, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'代理商',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:jsonArr
                }
            ]
        });
    });

}
