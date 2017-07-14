/*
 * 红中麻将 数据操作 定义
 * Author: 	xjn 
 * Date:	2017.4.8
 * 
 * 功能：
 * */

var Hzmj = function(){};

var gg = gg || {};

//求阶乘
Hzmj.Factorial = function(n){
    var factorial = 1;
    var temp = n;
    for(var i=0; i<n; ++i){
        factorial *= temp;
        --temp;
    }

    return factorial;
};

//根据自己的位置，翻转y坐标 服务端屏宽 屏高 CMD_Hzmj.kScreenWidth CMD_Hzmj.kScreenHeight
Hzmj.SPosFlippedYByHeroChairId = function(serverPos){
    var clientX = serverPos.x;
    var clientY = serverPos.y;
    var heroChairId = g_objHero.getChairID();
    //上下位置的玩家，坐标转换
    if(heroChairId < 3){
        clientX = CMD_HZMJ.kScreenWidth - serverPos.x;
        clientY = CMD_HZMJ.kScreenHeight - serverPos.y;
    }

    return cc.p(clientX, clientY);
};

//服务端位置 转换为 cocos位置（服务端：x正→，y正↓）（cocos客户端：x正→，y正↑）
Hzmj.SPosToCCPos = function(serverPos){
    var x = serverPos.x;
    var y = CMD_HZMJ.kScreenHeight - serverPos.y;//转换为cocos坐标系
    return cc.p(x, y);
};

Hzmj.SPosArrayToCCPosArray = function(sPosArray, bFlippedYByHeroChairId){
	var tempArray = sPosArray.slice(0);
    for(var i=0; i<tempArray.length; i++){
        if(bFlippedYByHeroChairId){
            tempArray[i] = Hzmj.SPosFlippedYByHeroChairId(tempArray[i]);
        }
        
        tempArray[i] = Hzmj.SPosToCCPos(tempArray[i]);
    }

    return tempArray;
};

//COCOS位置 转换为 显示位置
Hzmj.CCPosToShowPos = function(pos){
    var sizeDir = cc.director.getWinSize();
    var scaleX = sizeDir.width / CMD_HZMJ.kScreenWidth;
    var scaleY = sizeDir.height / CMD_HZMJ.kScreenHeight;
    var showPos = cc.p(pos.x * scaleX, pos.y * scaleY);
    return showPos;
};

//显示位置 转换为 COCOS位置
Hzmj.ShowPosToCCPos = function(showPos){
    var sizeDir = cc.director.getWinSize();
    var scaleX = CMD_HZMJ.kScreenWidth / sizeDir.width;
    var scaleY = CMD_HZMJ.kScreenHeight / sizeDir.height;
    var pos = cc.p(showPos.x * scaleX, showPos.y * scaleY);
    return pos;
};

//CC弧度 to Show弧度
Hzmj.CCRadianToShowRadian = function(ccRadian){
    var pos = cc.pForAngle(ccRadian);
    var showPos = Hzmj.CCPosToShowPos(pos);
    var showRadian = cc.pToAngle(showPos);
    return showRadian;
};

//Show弧度 to CC弧度
Hzmj.ShowRadianToCCRadian = function(showRadian){
    var pos = cc.pForAngle(showRadian);
    var ccPos = Hzmj.ShowPosToCCPos(pos);
    var ccRadian = cc.pToAngle(ccPos);
    return ccRadian;
};

//CC角度 to Show角度
Hzmj.CCAngleToShowAngle = function(ccAngle){
    var ccRadian = Hzmj.AngleToRadian(ccAngle);
    var showRadian = Hzmj.CCRadianToShowRadian(ccRadian);
    var showAngle = Hzmj.RadianToAngle(showRadian);
    return showAngle;
};

//Show角度 to CC角度
Hzmj.ShowAngleToCCAngle = function(showAngle){
    var showRadian = Hzmj.AngleToRadian(showAngle);
    var ccRadian = Hzmj.ShowRadianToCCRadian(showRadian);
    var ccAngle = Hzmj.RadianToAngle(ccRadian);
    return ccAngle;
};

//将弧度转换成角度
Hzmj.RadianToAngle = function(radian){
    return (180 * radian / Math.PI);
};

//将角度转换成弧度
Hzmj.AngleToRadian = function(angle){
    return (angle * Math.PI / 180);
};

//是否在屏幕内
Hzmj.InsideScreenByShowPos = function(showPos){
    var ccpos = Hzmj.ShowPosToCCPos(showPos);
    var x = ccpos.x;
    var y = ccpos.y;
    return (x >= 0 && x <= CMD_HZMJ.kScreenWidth && y >= 0 && y <= CMD_HZMJ.kScreenHeight);
};

//玩家位置
Hzmj.getUserPosByChairId = function(chairId){
    var userPos = chairId;
    var heroChairId = g_objHero.getChairID();
    if(heroChairId < 3){
        userPos = (chairId + 3) % CMD_HZMJ.GAME_PLAYER;
    }

    return userPos;
};

//玩家ChairId
Hzmj.getChairIdByUserPos = function(userPos){
    var chairId = userPos;
    var heroChairId = g_objHero.getChairID();
    if(heroChairId < 3){
        chairId = (userPos - 3 + CMD_HZMJ.GAME_PLAYER) % CMD_HZMJ.GAME_PLAYER;
    }

    return chairId;
};

//炮管位置
Hzmj.getTurretShowPosByUserPos = function(userPos){
    var sPos = CMD_HZMJ.kGunPos[userPos];
    if(!sPos){
        sPos = cc.p(0,0);
    }

    var ccPos = Hzmj.SPosToCCPos(sPos);
    var showPos = Hzmj.CCPosToShowPos(ccPos);
    return showPos;
};

//炮管位置
Hzmj.getTurretShowPosByChairId = function(chairId){
    var userPos = Hzmj.getUserPosByChairId(chairId);
    var showPos = Hzmj.getTurretShowPosByUserPos(userPos);
    return showPos;
};

//开火显示位置
Hzmj.getFireShowPosByUserPos = function(userPos, angle){
    var turretPos = Hzmj.getTurretShowPosByUserPos(userPos);
    var gunLen = 50;
    angle = Hzmj.CCAngleToMathAngle(angle);
    var radian = Hzmj.AngleToRadian(angle);
    var cellPos = cc.pForAngle(radian);
    var x = turretPos.x + gunLen * cellPos.x;
    var y = turretPos.y + gunLen * cellPos.y;
    return cc.p(x, y);
};

//炮管服务端弧度
Hzmj.getGunSRadianByChairId = function(chairId, showPos){
    var turretShowPos =  Hzmj.getTurretShowPosByChairId(chairId);
    var ccPosTurret = Hzmj.ShowPosToCCPos(turretShowPos);
    var ccPos = Hzmj.ShowPosToCCPos(showPos);
    var radian = Hzmj.getRadianCCPos2(ccPosTurret, ccPos);

    var chairId = g_objHero.getChairID();
    if(chairId < 3){
        radian += Math.PI;
    }

    radian = Hzmj.MathRadianToCCRadian(radian);

    var angle = Hzmj.RadianToAngle(radian);
    cc.log("----------------------gun---angle = " + angle);

    return radian;
};

//炮管服务端弧度
Hzmj.getGunSRadianByShowAngle = function(chairId, showAngle){
    var ccAngle = Hzmj.ShowAngleToCCAngle(showAngle);
    var mathAngle = Hzmj.CCAngleToMathAngle(ccAngle);
    var radian = Hzmj.AngleToRadian(mathAngle);

    var chairId = g_objHero.getChairID();
    if(chairId < 3){
        radian += Math.PI;
    }

    radian = Hzmj.MathRadianToCCRadian(radian);

    var angle = Hzmj.RadianToAngle(radian);
    cc.log("----------------------gun---angle = " + angle);

    return radian;
};

//炮管客户端弧度
Hzmj.getGunCRadianByChairId = function(chairId, sRadian){
    if(chairId < 3){
        sRadian -= Math.PI;
    }

    var heroChairId = g_objHero.getChairID();
    if(Math.floor(chairId/3) != Math.floor(heroChairId/3)){
        sRadian += Math.PI;
    }

    //服务端角度转换为客户端角度

    return sRadian;
};

//求组合
Hzmj.Combination = function(m, n){
    return Hzmj.Factorial(m) / (Hzmj.Factorial(n) * Hzmj.Factorial(m-n));
};

//数学坐标系角度 to 鱼图片角度
Hzmj.MathAngleToFishAngle = function(angle){
    //注意：3点方向，角度为0；逆时针0到360度
    //转换为：0点方向，角度为0；顺时针0到360
    angle = 360 - angle + 90;

    //图片默认方向，向右
    angle = angle - 90;

    return angle;
};

//鱼图片角度 to 数学坐标系角度
Hzmj.FishAngleToMathAngle = function(angle){
    //- 图片方向
    angle = angle + 90;

    //注意：0点方向，角度为0；顺时针0到360
    //转换为：3点方向，角度为0；逆时针0到360度
    angle = 360 - angle + 90;

    return angle;
};

//数学坐标系弧度 to COCOS弧度
Hzmj.MathRadianToCCRadian = function(Radian){
    return (Math.PI * 2 - Radian + Math.PI / 2);
};

//COCOS弧度 to 数学坐标系弧度
Hzmj.CCRadianToMathRadian = function(Radian){
    return (Math.PI * 2 - Radian + Math.PI / 2);
};

//数学坐标系角度 to COCOS角度
Hzmj.MathAngleToCCAngle = function(angle){
    return (360 - angle + 90);
};

//COCOS角度 to 数学坐标系角度
Hzmj.CCAngleToMathAngle = function(angle){
    return (360 - angle + 90);
};

//数学坐标系角度 to 子弹图片角度
Hzmj.MathAngleToBulletAngle = function(angle){
    return (360 - angle + 90);
};

//子弹图片角度 to 数学坐标系角度
Hzmj.BulletAngleToMathAngle = function(angle){
    return (360 - angle + 90);
};

//计算反弹后的数学角度  //参数：鱼速度像素每秒，反弹点坐标，反弹前数学角度，
Hzmj.getMathAngleByRebound = function(fishSpeed, reboundPos, mathAngle){
    var angle = mathAngle;
    var radian = Hzmj.AngleToRadian(angle);//将角度转换成弧度
    var x = reboundPos.x + fishSpeed * (CMD_HZMJ.kGameLoopElasped/1000) * Math.cos(radian);
    var y = reboundPos.y + fishSpeed * (CMD_HZMJ.kGameLoopElasped/1000) * Math.sin(radian);
    var screenW = CMD_HZMJ.kScreenWidth;
    var screenH = CMD_HZMJ.kScreenHeight;

    if (x < 0) {
        angle = 180-angle;
    }

    if (x > screenW) {
        angle = 180-angle;
    }

    if (y < 0) {
        angle = -angle;
    }

    if (y > screenH) {
        angle = -angle;
    }

    return angle;
};

//获得直线运动时间，参数：开始点、结束点、速度；返回值：毫秒
Hzmj.getDurationCCPos2 = function(startCCPos, endCCPos, speed){
    var distance = cc.pDistance(startCCPos, endCCPos);
    return ((distance / speed)*1000);
};

Hzmj.getDurationShowPos2 = function(startShowPos, endShowPos, speed){
    var startCCPos = Hzmj.ShowPosToCCPos(startShowPos);
    var endCCPos = Hzmj.ShowPosToCCPos(endShowPos);
    return Hzmj.getDurationCCPos2(startCCPos, endCCPos, speed);
};

//获得直线运动的，弧度 0 ~ 2PI，参数：cocos pos
Hzmj.getRadianCCPos2 = function(startPos, endPos){
    var radian = 0;

    var deltaPos = cc.pSub(endPos, startPos);
    var distance = cc.pDistance(startPos, endPos);
    if(distance > 0){
        radian = cc.pToAngle(deltaPos);
    }

    return radian;
};

//获得直线运动的，角度 0 ~ 360，参数：cocos pos
Hzmj.getAngleCCPos2 = function(startPos, endPos){
    var radian = Hzmj.getRadianCCPos2(startPos, endPos);
    var angle = Hzmj.RadianToAngle(radian);//将弧度转换成角度
    return angle;
};

//获得直线运动的，鱼角度，参数：cocos pos
Hzmj.getFishAngleCCPos2 = function(startPos, endPos){
    var angle = Hzmj.getAngleCCPos2(startPos, endPos);
    angle = Hzmj.MathAngleToFishAngle(angle);
    return angle;
};

/*测试角度
var testPos;
var angle;

testPos = cc.p(100, 0);
angle = Hzmj.getFishAngleCCPos2(cc.p(0,0), testPos);
cc.log("------------------angle = " + angle);

testPos = cc.p(100, 100);
angle = Hzmj.getFishAngleCCPos2(cc.p(0,0), testPos);
cc.log("------------------angle = " + angle);

testPos = cc.p(0, 100);
angle = Hzmj.getFishAngleCCPos2(cc.p(0,0), testPos);
cc.log("------------------angle = " + angle);

testPos = cc.p(-100, 100);
angle = Hzmj.getFishAngleCCPos2(cc.p(0,0), testPos);
cc.log("------------------angle = " + angle);

testPos = cc.p(-100, 0);
angle = Hzmj.getFishAngleCCPos2(cc.p(0,0), testPos);
cc.log("------------------angle = " + angle);

testPos = cc.p(-100, -100);
angle = Hzmj.getFishAngleCCPos2(cc.p(0,0), testPos);
cc.log("------------------angle = " + angle);

testPos = cc.p(0, -100);
angle = Hzmj.getFishAngleCCPos2(cc.p(0,0), testPos);
cc.log("------------------angle = " + angle);

testPos = cc.p(100, -100);
angle = Hzmj.getFishAngleCCPos2(cc.p(0,0), testPos);
cc.log("------------------angle = " + angle);
//*/

//计算贝塞尔曲线位置
Hzmj.getBezierPos = function(posArray, t){
    var tempPos = cc.p(0,0);
    var count = posArray.length - 1;

    if(count == 2){
        tempPos.x = (1-t)*(1-t)*posArray[0].x;
        tempPos.x += 2*t*(1-t)*posArray[1].x;
        tempPos.x += t*t*posArray[2].x;

        tempPos.y = (1-t)*(1-t)*posArray[0].y;
        tempPos.y += 2*t*(1-t)*posArray[1].y;
        tempPos.y += t*t*posArray[2].y;
    }

    if(count == 3){
        tempPos.x = (1-t)*(1-t)*(1-t)*posArray[0].x;
        tempPos.x += 3*t*(1-t)*(1-t)*posArray[1].x;
        tempPos.x += 3*t*t*(1-t)*posArray[2].x;
        tempPos.x += t*t*t*posArray[3].x;

        tempPos.y = (1-t)*(1-t)*(1-t)*posArray[0].y;
        tempPos.y += 3*t*(1-t)*(1-t)*posArray[1].y;
        tempPos.y += 3*t*t*(1-t)*posArray[2].y;
        tempPos.y += t*t*t*posArray[3].y;
    }

    /* 该算法效率低些
    var index = 0;
    while (index <= count) {
        var tempValue = Math.pow(t, index) * Math.pow(1 - t, (count - index)) * Hzmj.Combination(count, index);
        tempPos.x += posArray[index].x * tempValue;
        tempPos.y += posArray[index].y * tempValue;
        ++index;
    }
    //*/

    return tempPos;
};

//*
//获得贝塞尔曲线(2次或3次)，每帧位置数组
//posArray：贝塞尔曲线的几个点；frameDistance：没帧的位移，速度*每帧耗时
Hzmj.BuildBezier = function(posArray, frameDistance){
    var posLen = posArray.length;
    if(posLen != 3 && posLen != 4){
        return [];
    }

    var posAngleList = [];

    //起点
    posAngleList.push({
        pos: posArray[0],
        angle: 0
    });

    var t = 0;
    var count = posLen - 1;
    var tempPos,posAngleLast,tempDis,angle;

    while (t < 1) {
        tempPos = Hzmj.getBezierPos(posArray, t);
        posAngleLast = posAngleList[posAngleList.length - 1];
        tempDis = cc.pDistance(posAngleLast.pos, tempPos);

        if (tempDis >= frameDistance) {
            angle = posAngleLast.angle;
            tempDis = cc.pDistance(tempPos, posAngleLast.pos);
            if (tempDis !== 0) {
                angle = Hzmj.getFishAngleCCPos2(posAngleLast.pos, tempPos);
            }

            posAngleList.push({
                pos: cc.p(tempPos.x, tempPos.y),
                angle: angle
            });
        }

        t += 0.001;
    }

    return posAngleList;
};

//切片
Hzmj.BuildBezierSlice = function(posArray, frameDistance, startAngle, tStart, tEnd){
    var posLen = posArray.length;
    if(posLen != 3 && posLen != 4){
        return [];
    }

    var posAngleList = [];

    //起点
    posAngleList.push({
        pos: Hzmj.getBezierPos(posArray, tStart),
        angle: startAngle
    });

    var t = tStart;
    var count = posLen - 1;
    var tempPos,posAngleLast,tempDis,angle;
    var tLast,angleLast;

    while (t < tEnd) {
        tempPos = Hzmj.getBezierPos(posArray, t);
        posAngleLast = posAngleList[posAngleList.length - 1];
        tempDis = cc.pDistance(posAngleLast.pos, tempPos);

        if (tempDis >= frameDistance) {
            angle = posAngleLast.angle;
            tempDis = cc.pDistance(tempPos, posAngleLast.pos);
            if (tempDis !== 0) {
                angle = Hzmj.getFishAngleCCPos2(posAngleLast.pos, tempPos);
            }

            posAngleList.push({
                pos: cc.p(tempPos.x, tempPos.y),
                angle: angle
            });

            tLast = t;
            angleLast = angle;
        }

        if(t >= 1){
            tLast = 1;
        }

        t += 0.001;
    }

    return {posAngleList:posAngleList, tLast:tLast, angleLast:angleLast};
};

//*


Hzmj.AllSpeed = [88,72,140,70,80,150,170,100,130,155,108,90];
Hzmj.ALLBezier = [
    [ [1666,258],[612,486],[460,288],[-300,271] ],
    [ [-300,4],[460,288],[612,486],[1666,732] ],
    [ [1666,732],[612,486],[460,288],[-300,4] ],
    [ [-300,4],[460,288],[612,486],[1000,1735] ],
    [ [1000,1735],[612,486],[460,288],[-300,4] ],
    [ [-300,4],[107,733],[1276,735],[1800,4] ],
    [ [1800,4],[1276,735],[107,733],[-300,4] ],
    [ [636,-400],[107,733],[1276,735],[1800,732] ],
    [ [1800,732],[1276,735],[107,733],[636,-400] ],
    [ [-400,729],[107,733],[1276,735],[1800,-200] ],
    [ [1800,-200],[1276,735],[107,733],[-400,729] ],
    [ [-400,640],[626,1],[1800,735] ],
    [ [1800,735],[626,1],[-400,640] ],
    [ [-300,271],[460,288],[612,486],[1666,258] ]
];
Hzmj.BezierPath = {};
Hzmj.BezierCalcuCount = 0;
Hzmj.BezierCalcuTotal = Hzmj.AllSpeed.length * Hzmj.ALLBezier.length;
//每次计算一条曲线
Hzmj.CalcuBezier = function(){
	if(Hzmj.BezierCalcuCount >= Hzmj.BezierCalcuTotal){
		return true;
	}

	var speedId = Math.floor(Hzmj.BezierCalcuCount / Hzmj.ALLBezier.length);
	var bezierId = Hzmj.BezierCalcuCount % Hzmj.ALLBezier.length;

	var speed = Hzmj.AllSpeed[speedId];
	var frameDistance = speed * CMD_HZMJ.kSpeed;
	var bezier = Hzmj.ALLBezier[bezierId];
	var pathId = speed + "_";
	var posArray = [];
	for(var i=0; i<bezier.length; i++){
		pathId += bezier[i][0];
		pathId += bezier[i][1];
		posArray.push(cc.p(bezier[i][0], bezier[i][1]));
	}
	posArray = Hzmj.SPosArrayToCCPosArray(posArray, true);

	Hzmj.BezierPath[pathId] = Hzmj.BuildBezier(posArray, frameDistance);

	//cc.log("------------add speedId = " + speedId + " bezierId=" + bezierId + " path id = " + pathId);

	Hzmj.BezierCalcuCount++;

	if(Hzmj.BezierCalcuCount >= Hzmj.BezierCalcuTotal){
		return true;
	}

	return false;
};

//异步计算，需要几秒的时间
Hzmj.CalcuBezierSync = function(cbCalcu){
    var fishSpeed = [88,72,140,70,80,150,170,100,130,155,108,90];
    var pathBezier = [
        [ [1666,258],[612,486],[460,288],[-300,271] ],
        [ [-300,4],[460,288],[612,486],[1666,732] ],
        [ [1666,732],[612,486],[460,288],[-300,4] ],
        [ [-300,4],[460,288],[612,486],[1000,1735] ],
        [ [1000,1735],[612,486],[460,288],[-300,4] ],
        [ [-300,4],[107,733],[1276,735],[1800,4] ],
        [ [1800,4],[1276,735],[107,733],[-300,4] ],
        [ [636,-400],[107,733],[1276,735],[1800,732] ],
        [ [1800,732],[1276,735],[107,733],[636,-400] ],
        [ [-400,729],[107,733],[1276,735],[1800,-200] ],
        [ [1800,-200],[1276,735],[107,733],[-400,729] ],
        [ [-400,640],[626,1],[1800,735] ],
        [ [1800,735],[626,1],[-400,640] ],
        [ [-300,271],[460,288],[612,486],[1666,258] ]
    ];

    var i,j,k;
    Hzmj.BezierCalcuCount = 0;
    var calcuCount = fishSpeed.length * pathBezier.length;

    for(i=0; i<fishSpeed.length; i++){
        var speed = fishSpeed[i];
        var frameDistance = speed * CMD_HZMJ.kSpeed;

        for(j=0; j<pathBezier.length; j++){
            var posArray = [];
            var pathId = "" + speed + "_";
            for(k=0; k<pathBezier[j].length; k++){
                pathId += pathBezier[j][k][0];
                pathId += pathBezier[j][k][1];

                posArray.push(cc.p(pathBezier[j][k][0], pathBezier[j][k][1]));
            }

            //坐标转换
            posArray = Hzmj.SPosArrayToCCPosArray(posArray, true);

            var calcu = function(pathId, posArray, frameDistance){
                return function(){
                    Hzmj.BezierPath[pathId] = Hzmj.BuildBezier(posArray, frameDistance);
                    Hzmj.BezierCalcuCount++;

                    cc.log("--------------------add pathId " + pathId);
                    cc.log("--------------------add len " + Hzmj.BezierPath[pathId].length);

                    if(cbCalcu){
                    	cbCalcu(Hzmj.BezierCalcuCount, calcuCount);
                    }
                };
            };

            setTimeout(calcu(pathId, posArray, frameDistance), 0);
        }
    }

    return calcuCount;
};
    


//cc.log("-----------------paths = " + JSON.stringify(paths));
//*/