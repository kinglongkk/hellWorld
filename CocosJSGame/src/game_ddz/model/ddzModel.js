var DdzModel = function(){};
var cbIndexCount = 5;

//扑克类型 没牛-牛丁-牛二……牛八-牛九-牛牛-四花-五花-炸弹-小牛牛
DdzModel.CardType = {

};

var DdzCardType = {
    // 牌类型
    CT_ERROR           : 0,     // 错误类型
    CT_SINGLE          : 0x100, // 单张牌（散牌）(结尾两位16进制代表牌的逻辑数值，直接可以拿来比大小)
    CT_DOUBLE          : 0x200, // 对子牌(结尾两位16进制代表牌的逻辑数值，直接可以拿来比大小)
    CT_THREE           : 0x300, // 三张牌(结尾两位16进制代表牌的逻辑数值，直接可以拿来比大小)
    CT_THREE_TAKE_ONE  : 0x400, // 三带一(结尾两位16进制代表三根主牌的逻辑数值，直接可以拿来比大小)
    CT_THREE_TAKE_TWO  : 0x500, // 三带二(结尾两位16进制代表三根主牌的逻辑数值，直接可以拿来比大小)
    CT_SINGLE_LINE     : 0x600, // 单顺子（第二位16进制代表顺子的张数，第一位16进制代表最大牌的逻辑值）
    CT_DOUBLE_LINE     : 0x700, // 双顺子（第二位16进制代表顺子的对子数，第一位16进制代表最大牌的逻辑值）
    CT_THREE_LINE      : 0x800, // 三顺子（第二位16进制代表顺子的对子数，第一位16进制代表最大牌的逻辑值）
    CT_THREE_LINE_TAKE : 0X900, // 飞机带翅膀(第二位16进制代表最大飞机主牌逻辑数值，第一位16进制中，第一位代表翅膀是对子还是单根，其它三位代表多少对)
    CT_FOUR_TAKE_TWO   : 0xA00, // 四带二(第一位16进制代表带的是单还是对子，第二位代表四根主牌的逻辑值)
    CT_BOMB_CARD       : 0xB00, // 炸弹类型(第一位16进制代表癞子数量，只要不为0，则任何为0的炸弹都比它大，第二位代表炸弹代表的逻辑值)
    CT_KING            : 0xC00 // 火箭(第一位16进制代表小王数量，第二位代表大王数量，两位相加多的大，一样多时，大王多的大)
};

DdzModel.prototype.Laizi = 0;

// 返回两个参数
var ReturnTwoRet = function (Type, b) {
    return {"v":Type, "b":b};
};

// 王的数量
DdzModel.prototype.getKingCount = function (cardArr) {
    var nCount = 0;

    for (var k in cardArr) {
        v = cardArr[k];
        if (v >= 0x4e) {
            nCount++;
        }
    }

    return nCount;
};

// 分析对象中的最大逻辑值和最小逻辑值
DdzModel.prototype.GetMaxAndMinLogicValue = function (AnalySeRet, withoutLaizi, withoutKing) {
    var maxValue = 0;
    var minValue = 100;
    for (var i = 0; i < 4; i++) {
        for (j = 0; j < AnalySeRet.Count[i]; j++) {
            var v = AnalySeRet.CardData[i][j * (i + 1)];
            if (v == 0) break;
            maxValue = Math.max(maxValue, v);
            minValue = Math.min(minValue, v);
        }
    }
    if (!withoutLaizi) {
        maxValue = Math.max(maxValue, DdzModel.prototype.Laizi);
        minValue = Math.min(minValue, DdzModel.prototype.Laizi);
    }

    return {"max" : maxValue, "min" : minValue};
};

// 获取数组对象中最大逻辑值和最小逻辑值
DdzModel.prototype.GetMaxAndMinLogicWithArr = function (cardArr, withoutLaizi) {
    var maxValue = 0;
    var minValue = 100;
    cc.log("最大值判断"+cardArr);
    for (var i = 0; i < cardArr.length; i++) {
        var v = cardArr[i];
        var v1 = DdzModel.prototype.GetCardValue(v);
        if (v1 != DdzModel.prototype.Laizi || !withoutLaizi) {
            maxValue = Math.max(maxValue, DdzModel.prototype.GetCardLogicValue(v));
            minValue = Math.min(minValue, DdzModel.prototype.GetCardLogicValue(v));
        }
    }

    cc.log("最大="+maxValue+"最小="+minValue);
    return {"max" : maxValue, "min" : minValue};
};

// 去掉某个值的牌
DdzModel.prototype.removeValueFromCard = function (cardArr, cardV) {

    var nCount = 0;
    for (var i = 0; i < cardArr.length; i++) {
        var v = cardArr[i];
        if (DdzModel.prototype.GetCardValue(v) == cardV) {
            nCount++;
            cardArr.splice(i, 1);
            i--
        }
    }
    return nCount;
};

// 获取某一个牌值的个数
DdzModel.prototype.getCountWithCardValue = function (cardArr, v) {
    var nCount = 0;
    for (var i = 0; i < cardArr.length; i++) {
        if (DdzModel.prototype.GetCardValue(cardArr[i]) == v) {
            nCount++;
        }
    }
    return nCount;
};

// 构造一个分析对象
DdzModel.prototype.MakeDdzAnalyseResult = function () {
    var AnalyseResult = {"Count": [0, 0, 0, 0], "CardData": [], "Laizi" : 0, "King" : 0, "LKing" : 0, "SKing" : 0, "LaiziData" : []};
    for (var i = 0; i < 4; i++) {
        var arr = new Array();
        for (var j = 0; j < CMD_DDZ.MAX_COUNT; j++) {
            arr.push(0);

        }
        AnalyseResult.CardData.push(arr);
    }
    return AnalyseResult;
};

// 扑克分析
DdzModel.prototype.DdzAnalysebCardData = function (cardData) {
    var AnalyseResult = DdzModel.prototype.MakeDdzAnalyseResult();
    var cardCount = DdzModel.prototype.CountArray(cardData);
    cc.log("扑克分析"+cardData+","+cardCount);
    for (var i = 0; i < cardCount; i++) {
        var nSameCount = 1;
        var nValue = DdzModel.prototype.GetCardValue(cardData[i]);

        // 搜索同牌
        for (var j = i + 1; j < cardCount; j++) {
            // 获取扑克
            if (DdzModel.prototype.GetCardValue(cardData[j]) != nValue) break;

            // 同牌数自增
            nSameCount++;
        }

        if (nSameCount > 4) {
            cc.log("警告！！！！不可能超过4张一样的牌");
            return null;
        }

        // 设置结果
        if (nValue == DdzModel.prototype.Laizi) {
            AnalyseResult.Laizi += nSameCount;
            for (var k = 0; k < nSameCount; k++) {
                AnalyseResult.LaiziData.push(cardData[i + k]);
            }
        } else if (nValue == 0xe) {
            cc.log("小王数量"+i+","+nSameCount);
            AnalyseResult.SKing += nSameCount;
        } else if (nValue == 0xf) {
            cc.log("大王数量"+i+","+nSameCount);
            AnalyseResult.LKing += nSameCount;
        } else {
            var nIndex = AnalyseResult.Count[nSameCount - 1]++;
            for (var j = 0; j < nSameCount; j++) {
                AnalyseResult.CardData[nSameCount - 1][nIndex * nSameCount + j] = cardData[i + j];
            }
        }

        i += nSameCount - 1;
    }

    AnalyseResult.King = AnalyseResult.LKing + AnalyseResult.SKing;
    return AnalyseResult;
};

// 癞子牌放前的排序
DdzModel.prototype.sortCardWithLaizi = function(arry){

    cc.log("当前癞子"+DdzModel.prototype.Laizi);
    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(arry);
    DdzModel.prototype.removeValueFromCard(arry, DdzModel.prototype.Laizi);
    DdzModel.prototype.sortCard(arry);

    DdzModel.prototype.sortCard(AnalyseResult.LaiziData);
    for (var i = AnalyseResult.Laizi - 1; i >= 0; i--) {
        arry.splice(0, 0, AnalyseResult.LaiziData[i])
    }

    return arry;
};

// 判断是否火箭
DdzModel.prototype.isRocketType = function (cardArr) {

    if (cardArr.length <= 1) {
        cc.log("火箭至少得两张牌以上");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    var smallKing = 0;
    var largeKing = 0;
    for (var k in cardArr) {
        v = cardArr[k];
        if (v == 0x4e) {
            smallKing++;
        } else if (v == 0x4f) {
            largeKing++;
        } else {
            break;
        }
    }

    if (smallKing + largeKing == cardArr.length) {
        var kingType = 0;
        kingType |= smallKing;
        kingType |= largeKing << 4;
        return ReturnTwoRet(DdzCardType.CT_KING | kingType, true);
    }
    return ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 判断是否炸弹
DdzModel.prototype.isBombType = function (cardArr) {
    cc.log("判断是否是炸弹"+cardArr);
    // 不是4张牌
    if (cardArr.length != 4) {
        cc.log("炸弹得是4张牌");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    // 有王肯定不是炸弹
    if (DdzModel.prototype.getKingCount(cardArr) > 0) {
        cc.log("炸弹不能有王");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(cardArr);
    for (var i = 0; i < 4; i++) {
        if (AnalyseResult.Count[i] * (i + 1) + AnalyseResult.Laizi >= 4) {
            if (i == 1 && AnalyseResult.Count[i] == 2) continue;    // 两个对子就不行了
            if (i == 0 && AnalyseResult.Count[i] > 1) continue;     // 单个不能超过1张
            var v = AnalyseResult.CardData[i][0];
            var vLogic = DdzModel.prototype.GetCardLogicValue(v == 0? DdzModel.prototype.Laizi : v);
            return ReturnTwoRet(DdzCardType.CT_BOMB_CARD | (vLogic << 4), true);
        }
    }

    return ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 判断是否是四带二
DdzModel.prototype.isFourTakeTwo = function(cardArr) {
    cc.log("判断是否四带二");
    var nCount = cardArr.length;
    if (nCount != 6 && nCount != 8) {
        cc.log("四带二要么是6，要么是8张");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(cardArr);

    // 有王就不可能形成对子
    if (nCount == 8 && AnalyseResult.King > 0) {
        cc.log("如果是8张牌，只能是四带两对，那么有王就不可能成为对子");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    var nLaiziCount = AnalyseResult.Laizi;
    if (nLaiziCount == 4) {
        // 六根就是4个癞子加两根其它
        if (nCount == 6) {
            return ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | DdzModel.prototype.GetCardLogicValue(DdzModel.prototype.LizeCard), true);
        }
        // 4个癞子加两个对子
        if (AnalyseResult.Count[1] == 2) {
            return ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | DdzModel.prototype.GetCardLogicValue(DdzModel.prototype.LizeCard) | 1, true);
        }
        // 4个癞子加4个其它
        if (AnalyseResult.Count[3] > 0) {
            var maxValue = 0;
            if (DdzModel.prototype.GetCardValue(AnalyseResult.CardData[3][0]) != DdzModel.prototype.LizeCard) {
                maxValue = DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[3][0])
            } else {
                maxValue = DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[3][4])
            }

            return ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (maxValue << 4) | 1, true);
        }

        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    // 有一对非癞子炸
    if (AnalyseResult.Count[3] > 0) {
        // 6根为4带两根单
        if (nCount == 6) {
            return ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[3][0]) << 4) | 0, true);
        }
        // 8根牌
        if (nCount == 8) {
            // 两个炸弹也满足
            if (AnalyseResult.Count[3] == 2) {
                var maxValue = DdzModel.prototype.maxValue(DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[3][0]), DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[3][4]));
                return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (maxValue << 4) | 1, true);

            }
            // 有一个三张+一张癞子
            if (AnalyseResult.Count[2] == 1 && nLaiziCount == 1) {
                return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0]) << 4) | 1, true);
            }
            // 四带两对
            if (AnalyseResult.Count[1] == 2) {
                return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[3][0]) << 4) | 1, true);
            }
            // 四带一对+至少一根癞子
            if (AnalyseResult.Count[1] == 1) {
                if (nLaiziCount >= 1) {
                    return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[3][0]) << 4) | 1, true);
                }
                return  ReturnTwoRet(DdzCardType.CT_ERROR, false);
            }
            // 一张散牌+三张癞子或者两张散牌+两张癞子
            if ((AnalyseResult.Count[0] == 1 && nLaiziCount == 3) || (AnalyseResult.Count[0] == 2 && nLaiziCount == 2)) {
                return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[3][0]) << 4) | 1, true);
            }
            // 其它情况不符合
        }
    } else if (AnalyseResult.Count[2] == 2) {
        // 两对三张+两根癞子
        if (nLaiziCount == 2) {
            var maxValue = DdzModel.prototype.maxValue(DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0]), DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][3]));

            return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (maxValue << 4) | 1, true);
        }
        // 其它不满足
    } else if (AnalyseResult.Count[2] == 1) {
        // 只有一对三张
        // 6张
        if (nCount == 6) {
            // 只要有一张癞子就符合条件
            if (nLaiziCount > 0) {
                return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0])) | 0, true);
            }
            return  ReturnTwoRet(DdzCardType.CT_ERROR, false);
        }

        // 有三张癞子，随便组合都符合
        if (nLaiziCount == 3) {
            return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0])) | 1, true);
        }
        // 三张+两对+一癞子
        if (nCount == 8 && nLaiziCount > 0 && AnalyseResult.Count[1] == 2) {
            return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0])) | 1, true);
        }
        // 三张+一对+三张癞子/三张+一对+两根癞子+一张非王
        if (AnalyseResult.Count[1] == 1 && nLaiziCount >= 2) {
            return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0])) | 1, true);
        }
        return  ReturnTwoRet(DdzCardType.CT_ERROR, false);
    } else if (nLaiziCount >= 2 && AnalyseResult.Count[0] <= 1) {
        // 有两张以上的癞子，散牌数量小于等于1张
        var maxValue = DdzModel.prototype.GetMaxAndMinLogicValue(AnalyseResult).max;
        return  ReturnTwoRet(DdzCardType.CT_FOUR_TAKE_TWO | (maxValue << 4) | 1, true);
    }

    return  ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 是否飞机带翅膀
DdzModel.prototype.isThreeLineTake = function (cardArr) {
    cc.log("判断是否是飞机");
    if (cardArr.length < 8) {
        cc.log("飞机至少得有8张牌，当前只有"+cardArr.length);
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    var tmpArr = cardArr.slice(0);
    var nLaizi = DdzModel.prototype.removeValueFromCard(tmpArr, DdzModel.prototype.Laizi);

    var ret = DdzModel.prototype.recursionIsPlane(tmpArr, nLaizi);
    if (ret.b) {
        return ReturnTwoRet(DdzCardType.CT_THREE_LINE_TAKE | ret.v, true);
    }
    return  ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 将癞子牌递归插入到牌中并判断是否是飞机
DdzModel.prototype.recursionIsPlane = function (cardArr, nLaiziCount) {
    if (nLaiziCount == 0) {
        return DdzModel.prototype.isPlane(cardArr);
    }

    nLaiziCount--;
    for (var i = 1; i < 14; i++) {
        if (i == 2) continue;
        var tmpArr = cardArr.slice(0);
        tmpArr.push(i);
        var ret = DdzModel.prototype.recursionIsPlane(tmpArr, nLaiziCount);
        if (ret.b) {
            return ret;
        }
    }
    return ReturnTwoRet(0, false);
};

// 判断是否是飞机
DdzModel.prototype.isPlane = function (cardArr) {

    DdzModel.prototype.sortCard(cardArr);
    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(cardArr);
    if (AnalyseResult && AnalyseResult.Count[2] > 1) {
        var maxValue = 0;
        for (var i = 0; i < AnalyseResult.Count[2] - 1; i++) {
            var v1 = DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][i*3]);
            var v2 = DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][(i+1)*3]);
            cc.log("飞机"+v1+","+v2);
            if (v1 - v2 != 1) {
                return  ReturnTwoRet(DdzCardType.CT_ERROR, false);
            }
            maxValue = Math.max(maxValue, v1);
        }
        // 带单根的
        if (cardArr.length - 3 * AnalyseResult.Count[2] == AnalyseResult.Count[2]) {
            return ReturnTwoRet(DdzCardType.CT_THREE_LINE_TAKE | (maxValue << 4) | (AnalyseResult.Count[2] << 1), true);
        }
        // 带对子
        if ((cardArr.length - 3 * AnalyseResult.Count[2] == AnalyseResult.Count[2] * 2) && AnalyseResult.King == 0) {
            if (AnalyseResult.Count[1] == AnalyseResult.Count[2]) {
                return ReturnTwoRet(DdzCardType.CT_THREE_LINE_TAKE | (maxValue << 4) | (AnalyseResult.Count[2] << 1) | 1, true);
            }
        }
    }
    return  ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 是否是三顺子
DdzModel.prototype.isThreeLine = function (cardArr) {
    if (cardArr.length < 6 || DdzModel.prototype.getKingCount(cardArr) > 0) {
        cc.log("三顺子至少得6张，并且不能有王");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }
    // 有2也不满足
    if (DdzModel.prototype.Laizi != 2 && DdzModel.prototype.getCountWithCardValue(cardArr, 2) > 0) {
        cc.log("癞子不为2的情况下，三顺子不能有2");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    var tmpArr = cardArr.slice(0);
    var nLaizi = DdzModel.prototype.removeValueFromCard(tmpArr, DdzModel.prototype.Laizi);
    var ret = DdzModel.prototype.recursionIsLine(tmpArr, nLaizi, 3);
    if (ret.b) {
        return ReturnTwoRet(DdzCardType.CT_THREE_LINE | ((cardArr.length / 3) << 4) | ret.v, true);
    }
    return ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 是否双顺子
DdzModel.prototype.isDoubleLine = function (cardArr) {
    cc.log("是否双顺子"+cardArr);
    if (cardArr.length < 6 || DdzModel.prototype.getKingCount(cardArr) > 0) {
        cc.log("双顺子至少得6张，并且不能有王");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }
    // 有2也不满足
    if (DdzModel.prototype.Laizi != 2 && DdzModel.prototype.getCountWithCardValue(cardArr, 2) > 0) {
        cc.log("癞子不为2的情况下，双顺子不能有2");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    var tmpArr = cardArr.slice(0);
    var nLaizi = DdzModel.prototype.removeValueFromCard(tmpArr, DdzModel.prototype.Laizi);
    var ret = DdzModel.prototype.recursionIsLine(tmpArr, nLaizi, 2);
    if (ret.b) {
        return ReturnTwoRet(DdzCardType.CT_DOUBLE_LINE | ((cardArr.length / 2) << 4) | ret.v, true);
    }
    return ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 是否单顺子
DdzModel.prototype.isSingleLine = function (cardArr) {
    cc.log("判断是否是单顺子")
    if (cardArr.length < 5 || DdzModel.prototype.getKingCount(cardArr) > 0) {
        cc.log("单顺子至少得5张，并且不能有王");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }
    // 有2也不满足
    if (DdzModel.prototype.Laizi != 2 && DdzModel.prototype.getCountWithCardValue(cardArr, 2) > 0) {
        cc.log("单顺子也不能有2");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    var tmpArr = cardArr.slice(0);
    var nLaizi = DdzModel.prototype.removeValueFromCard(tmpArr, DdzModel.prototype.Laizi);
    var ret = DdzModel.prototype.recursionIsLine(tmpArr, nLaizi, 1);
    cc.log("ret.b="+ret.b+"v="+ret.v);
    if (ret.b) {
        return ReturnTwoRet(DdzCardType.CT_SINGLE_LINE | (cardArr.length << 4) | ret.v, true);
    }
    return ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 递归判断是否是顺子
DdzModel.prototype.recursionIsLine = function (cardArr, nLaiziCount, nType) {
    if (nLaiziCount == 0) {
        return DdzModel.prototype.isLine(cardArr, nType);
    }
    nLaiziCount--;
    for (var i = 14; i > 2; i--) {
        var tmpArr = cardArr.slice(0);
        tmpArr.push(i);
        var ret = DdzModel.prototype.recursionIsLine(tmpArr, nLaiziCount, nType);
        if (ret.b) {
            return ret;
        }
    }
    return ReturnTwoRet(0, false);
};

// 是否是顺子，nType为单顺子、双顺子、三顺子
DdzModel.prototype.isLine = function (cardArr, nType) {
    var lineArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var nMax = 0;
    var nMin = 14;

    // 把每张牌值的数量加到一个表里
    for (var i = 0; i < cardArr.length; i++) {
        v = DdzModel.prototype.GetCardLogicValue(cardArr[i]);
        if (v > 14) {
            return ReturnTwoRet(0, false);
        }
        if (v > nMax) {
            nMax = v;
        }
        if (v < nMin) {
            nMin = v;
        }
        lineArr[v]++;
    }

    var nCount = 0;
    for (var i = nMin; i < nMax + 1; i++) {
        if (lineArr[i] != nType) {
            return ReturnTwoRet(0, false);
        }
        nCount++;
    }

    if (nType == 1) {
        return ReturnTwoRet(nMax, nCount >= 5);
    }
    if (nType == 2) {
        return ReturnTwoRet(nMax, nCount >= 3);
    }
    if (nType == 3) {
        return ReturnTwoRet(nMax, nCount >= 2);
    }
    return ReturnTwoRet(nMax, true);
};

// 是否三带二
DdzModel.prototype.isThreeTakeTwo = function (cardArr) {
    cc.log("是否三带二"+cardArr+"-----"+DdzModel.prototype.getKingCount(cardArr));
    // 不是5张牌或者有一张王
    if (cardArr.length != 5 || DdzModel.prototype.getKingCount(cardArr) > 0) {
        cc.log("三带二至少得有5张，且不能有王");
        return ReturnTwoRet(DdzCardType.CT_ERROR, false);
    }

    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(cardArr);
    cc.log(AnalyseResult.Laizi);
    if (AnalyseResult.Laizi == 4) {
        var nMax = DdzModel.prototype.GetCardLogicValue(DdzModel.prototype.Laizi);
        nMax = Math.max(nMax, DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[0]));
        return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_TWO | nMax, true);
    }
    // 三张癞子
    if (AnalyseResult.Laizi == 3) {
        var nMax = 0;
        if (AnalyseResult.Count[1] == 1) {
            // 三癞子+一个对子
            nMax = Math.max(DdzModel.prototype.GetCardLogicValue(DdzModel.prototype.Laizi), DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[1][0]));
        } else {
            // 三癞子+两张散牌
            nMax = Math.max(DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[0][0]), DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[0][1]));
            nMax = Math.max(nMax, DdzModel.prototype.GetCardLogicValue(DdzModel.prototype.Laizi));
        }
        return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_TWO | nMax, true);
    }
    // 两张癞子+一个对子
    if (AnalyseResult.Laizi == 2 && AnalyseResult.Count[1] == 1) {
        nMax = Math.max(DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[1][0]), DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[0][0]));
        return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_TWO | nMax, true);
    }
    // 两张癞子+三个
    if (AnalyseResult.Laizi == 2 && AnalyseResult.Count[2] == 1) {
        return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_TWO | DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0]), true);
    }
    // 一张癞子
    if (AnalyseResult.Laizi == 1) {
        cc.log("一张癞子"+AnalyseResult.Count[2]+AnalyseResult.Count[1]);
        // 一对三张
        if (AnalyseResult.Count[2] == 1) {
            return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_TWO | DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0]), true);
        }
        // 两个对子
        if (AnalyseResult.Count[1] == 2) {
            var nMax = Math.max(DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[1][0]), DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[1][2]));
            cc.log("有两个对子"+nMax);
            return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_TWO | nMax, true);
        }
    }
    // 无癞子
    if (AnalyseResult.Count[2] == 1 && AnalyseResult.Count[1] == 1) {
        return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_TWO | DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0]), true);
    }

    return ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 是否三带一
DdzModel.prototype.isThreeTakeOne = function(cardArr) {
    cc.log("是否三带一"+cardArr);
    if (cardArr.length == 4) {
        var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(cardArr);
        if (AnalyseResult.King > 1) {
            cc.log("三带一不能超过一张王");
            return ReturnTwoRet(DdzCardType.CT_ERROR, false);
        }
        // 三张或四张癞子都符合
        if (AnalyseResult.Laizi >= 3) {
            if (AnalyseResult.Laizi == 3 && AnalyseResult.King == 0) {
                return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_ONE | Math.max(DdzModel.prototype.GetCardLogicValue(DdzModel.prototype.Laizi), DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[0][0])), true);
            }
            return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_ONE | DdzModel.prototype.GetCardLogicValue(DdzModel.prototype.Laizi), true);
        }
        // 两张癞子
        if (AnalyseResult.Laizi == 2) {
            return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_ONE | DdzModel.prototype.GetMaxAndMinLogicValue(AnalyseResult, true).max, true);
        }
        // 一张癞子+一个对子
        if (AnalyseResult.Laizi == 1 && AnalyseResult.Count[1] == 1) {
            return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_ONE | DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[1][0]), true);
        }
        // 三张非癞子
        if (AnalyseResult.Count[2] == 1) {
            return ReturnTwoRet(DdzCardType.CT_THREE_TAKE_ONE | DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0]), true);
        }
    }
    return ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 是否三张牌
DdzModel.prototype.isThree = function(cardArr) {
    cc.log("是否三牌"+cardArr);
    if (cardArr.length == 3 && DdzModel.prototype.getKingCount(cardArr) == 0) {
        var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(cardArr);
        // 三张一样的
        if (AnalyseResult.Count[2] > 0) {
            return ReturnTwoRet(DdzCardType.CT_THREE | DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][0]), true);
        }

        // 一张癞子+一个对子，对子不为王
        if (AnalyseResult.Laizi == 1 && AnalyseResult.Count[1] > 0) {
            return ReturnTwoRet(DdzCardType.CT_THREE | DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[1][0]), true);
        }
        // 两张癞子+一张非癞子（不为王）
        if (AnalyseResult.Laizi == 2) {
            return ReturnTwoRet(DdzCardType.CT_THREE | DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[0][0]), true);
        }

        // 三张癞子
        if (AnalyseResult.Laizi == 3) {
            return ReturnTwoRet(DdzCardType.CT_THREE | DdzModel.prototype.GetCardLogicValue(DdzModel.prototype.Laizi), true);
        }
    }
    return ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 是否对子牌
DdzModel.prototype.isDouble = function(cardArr) {
    cc.log("是否对子");
    if (cardArr.length == 2 && DdzModel.prototype.getKingCount(cardArr) == 0) {
        if (DdzModel.prototype.GetCardValue(cardArr[0]) == DdzModel.prototype.GetCardValue(cardArr[1])) {
            return ReturnTwoRet(DdzCardType.CT_DOUBLE | DdzModel.prototype.GetCardLogicValue(cardArr[0]), true);
        } else if (DdzModel.prototype.getCountWithCardValue(cardArr, DdzModel.prototype.Laizi) > 0) {
            return ReturnTwoRet(DdzCardType.CT_DOUBLE | DdzModel.prototype.GetMaxAndMinLogicWithArr(cardArr, true).max, true);
        }
    }
    return ReturnTwoRet(DdzCardType.CT_ERROR, false);
};

// 自己第一次出怕的时候获取类型
DdzModel.prototype.GetDdzCardType = function (cardArr) {
    DdzModel.prototype.sortCard(cardArr);
    switch (cardArr.length) {
        case 0:
            return DdzCardType.CT_ERROR;
        case 1:
            return DdzCardType.CT_SINGLE | DdzModel.prototype.GetCardLogicValue(cardArr[0]);
        case 2:
        {
            var ret = DdzModel.prototype.isDouble(cardArr);
            if (ret.b) {
                return ret.v;
            }
        }
    }

    cc.log("1当前牌"+cardArr);
    // 判断是否是火箭12
    var ret = DdzModel.prototype.isRocketType(cardArr);
    if (ret.b) {
        return ret.v;
    }
    cc.log("2当前牌"+cardArr);
    // 两张牌的已经判断完毕
    if (cardArr.length == 2) {
        return DdzCardType.CT_ERROR;
    }
    cc.log("3当前牌"+cardArr);
    // 判断是否是炸弹11
    var ret = DdzModel.prototype.isBombType(cardArr);
    if (ret.b) {
        return ret.v;
    }
    cc.log("4当前牌"+cardArr);
    // 判断是否是4带2 10
    var ret = DdzModel.prototype.isFourTakeTwo(cardArr);
    if (ret.b) {
        return ret.v;
    }
    cc.log("5当前牌"+cardArr);
    // 飞机 9
    var ret = DdzModel.prototype.isThreeLineTake(cardArr);
    if (ret.b) {
        return ret.v;
    }
    cc.log("6当前牌"+cardArr);
    // 判断是否是三顺子 8
    var ret = DdzModel.prototype.isThreeLine(cardArr);
    if (ret.b) {
        return ret.v;
    }
    cc.log("7当前牌"+cardArr);
    // 判断是否是双顺子 7
    var ret = DdzModel.prototype.isDoubleLine(cardArr);
    if (ret.b) {
        return ret.v;
    }
    cc.log("8当前牌"+cardArr);
    // 判断是否是单顺子 6
    var ret = DdzModel.prototype.isSingleLine(cardArr);
    if (ret.b) {
        return ret.v;
    }
    cc.log("9当前牌"+cardArr);
    // 三带二 5
    var ret = DdzModel.prototype.isThreeTakeTwo(cardArr);
    if (ret.b) {
        return ret.v;
    }

    // 判断是否是三带一 4
    var ret = DdzModel.prototype.isThreeTakeOne(cardArr);
    if (ret.b) {
        return ret.v;
    }

    // 判断是否是三牌 3
    var ret = DdzModel.prototype.isThree(cardArr);
    if (ret.b) {
        return ret.v;
    }

    return DdzCardType.CT_ERROR;
};

// 比牌
DdzModel.prototype.CompareCardLaizi = function (card1, nType1, card2) {
    var nCount1 = card1.length;
    var nCount2 = card2.length;
    var nType2 = DdzModel.prototype.GetDdzCardType(card2);

    if (nType2 == DdzCardType.CT_ERROR) return false;
    if (nType1 == DdzCardType.CT_ERROR) {
        return true;
    }

    cc.log("ntype1="+nType1+"----"+card2);
    var ret = DdzModel.prototype.isRocketType(card2);
    // 前牌是火箭
    if (nType1 > DdzCardType.CT_KING) {
        if (ret.b) {
            if (nCount2 > nCount1) return true;
            if (nCount2 == nCount1) return ret.v > nType1;
        }
        return false;
    }

    // 前牌非火箭，后牌是火箭火箭
    if (ret.b) return true;
    // 前牌是炸弹
    ret = DdzModel.prototype.isBombType(card2);
    if (nType1 >= DdzCardType.CT_BOMB_CARD && nType1 < DdzCardType.CT_KING) {
        cc.log("后排是否是炸弹"+ret.b);
        if (ret.b) {
            // 两者都有癞子，比逻辑牌
            if ((nType1 & 0xF) > 0 && (ret.v & 0xF) > 0 || (nType1 & 0xF) == 0 && (ret.v & 0xF) == 0) {
                cc.log("两者同时有或同时无癞子"+ret.v+","+(ret.v & 0xF0)+","+(nType1 & 0xF0));
                return (ret.v & 0xF0) > (nType1 & 0xF0)
            }
            // 有一个无癞子，则无癞子的大
            return (nType1 & 0xF) > 0
        }
        return false;
    }

    // 前牌非炸弹，后牌是炸弹
    if (ret.b) return true;

    // 都非炸弹，进行牌型比较
    // 张数不同
    if (nCount1 != nCount2) {
        return false;
    }

    // 四带二
    if (nType1 >= DdzCardType.CT_FOUR_TAKE_TWO) {
        ret = DdzModel.prototype.isFourTakeTwo(card2);
        if (ret.b) {
            // 带单还是对子要一样
            if ((nType1 & 0xF) == (ret.v & 0xF)) {
                return (ret.v & 0xF0) > (nType1 & 0xF0);
            }
        }
        return false;
    }

    // 飞机带翅膀
    if (nType1 >= DdzCardType.CT_THREE_LINE_TAKE) {
        ret = DdzModel.prototype.isThreeLineTake(card2);
        if (ret.b) {
            if ((nType1 & 0xF) == (ret.v & 0xF)) {
                return (ret.v & 0xF0) > (nType1 & 0xF0);
            }
        }
        return false;
    }

    // 三顺子
    if (nType1 >= DdzCardType.CT_THREE_LINE) {
        ret = DdzModel.prototype.isThreeLine(card2);
        if (ret.b) {
            if ((nType1 & 0xF0) == (ret.v & 0xF0)) {
                return (ret.v & 0xF) > (nType1 & 0xF);
            }
        }
        return false;
    }

    // 双顺子
    if (nType1 >= DdzCardType.CT_DOUBLE_LINE) {
        ret = DdzModel.prototype.isDoubleLine(card2);
        if (ret.b) {
            if ((nType1 & 0xF0) == (ret.v & 0xF0)) {
                return (ret.v & 0xF) > (nType1 & 0xF);
            }
        }
        return false;
    }

    // 单顺子
    if (nType1 >= DdzCardType.CT_SINGLE_LINE) {
        ret = DdzModel.prototype.isSingleLine(card2);
        if (ret.b) {
            if ((nType1 & 0xF0) == (ret.v & 0xF0)) {
                return (ret.v & 0xF) > (nType1 & 0xF);
            }
        }
        return false;
    }

    // 三带二
    if (nType1 >= DdzCardType.CT_THREE_TAKE_TWO) {
        ret = DdzModel.prototype.isThreeTakeTwo(card2);
        if (ret.b) {
            return (ret.v & 0xFF) > (nType1 & 0xFF);
        }
        return false;
    }

    // 三带一
    if (nType1 >= DdzCardType.CT_THREE_TAKE_ONE) {
        ret = DdzModel.prototype.isThreeTakeOne(card2);
        if (ret.b) {
            return (ret.v & 0xFF) > (nType1 & 0xFF);
        }
        return false;
    }

    // 三张牌
    if (nType1 >= DdzCardType.CT_THREE) {
        ret = DdzModel.prototype.isThree(card2);
        if (ret.b) {
            return (ret.v & 0xFF) > (nType1 & 0xFF);
        }
        return false;
    }

    // 对子
    if (nType1 >= DdzCardType.CT_DOUBLE) {
        ret = DdzModel.prototype.isDouble(card2);
        cc.log("对牌取的结果"+ret.v);
        if (ret.b) {
            return (ret.v & 0xFF) > (nType1 & 0xFF);
        }
        return false;
    }

    // 单
    if (nType1 >= DdzCardType.CT_SINGLE) {
        return DdzModel.prototype.GetCardLogicValue(card2[0]) > DdzModel.prototype.GetCardLogicValue(card1[0]);
    }
    return false;
};

// 出牌搜索
DdzModel.prototype.DdzSearchOutCard = function (card1, nType1, handCard) {
    DdzModel.prototype.sortCard(handCard);
    // 创建一个出牌搜索对象
    var SearchRet = [];

    if (card1.length == 0) {
        nType1 = DdzCardType.CT_ERROR;
    }

    // 单牌
    if ((nType1 >= DdzCardType.CT_SINGLE && nType1 < DdzCardType.CT_DOUBLE) || (nType1 == DdzCardType.CT_ERROR)) {
        DdzModel.prototype.searchSingle(nType1 & 0xFF, handCard, SearchRet);
    }

    // 对子
    if ((nType1 >= DdzCardType.CT_DOUBLE && nType1 < DdzCardType.CT_THREE) || (nType1 == DdzCardType.CT_ERROR)) {
        DdzModel.prototype.searchDouble(nType1 & 0xFF, handCard, SearchRet);
    }

    // 三牌
    if ((nType1 >= DdzCardType.CT_THREE && nType1 < DdzCardType.CT_THREE_TAKE_ONE) || (nType1 == DdzCardType.CT_ERROR)) {
        DdzModel.prototype.searchThree(nType1 & 0xFF, handCard, SearchRet);
    }

    // 三带一
    if ((nType1 >= DdzCardType.CT_THREE_TAKE_ONE && nType1 < DdzCardType.CT_THREE_TAKE_TWO) || (nType1 == DdzCardType.CT_ERROR)) {
        DdzModel.prototype.searchThreeTakeOne(nType1 & 0xFF, handCard, SearchRet);
    }

    // 三带二
    if ((nType1 >= DdzCardType.CT_THREE_TAKE_TWO && nType1 < DdzCardType.CT_SINGLE_LINE) || (nType1 == DdzCardType.CT_ERROR)) {
        DdzModel.prototype.searchThreeTakeTwo(nType1 & 0xFF, handCard, SearchRet);
    }

    // 单顺子
    if ((nType1 >= DdzCardType.CT_SINGLE_LINE && nType1 < DdzCardType.CT_DOUBLE_LINE) || (nType1 == DdzCardType.CT_ERROR)) {
        DdzModel.prototype.searchLine(nType1, handCard, SearchRet);
    }

    // 双顺子
    if ((nType1 >= DdzCardType.CT_DOUBLE_LINE && nType1 < DdzCardType.CT_THREE_LINE) || (nType1 == DdzCardType.CT_ERROR)) {
        DdzModel.prototype.searchLine(nType1, handCard, SearchRet);
    }

    // 三顺子
    if ((nType1 >= DdzCardType.CT_THREE_LINE && nType1 < DdzCardType.CT_THREE_LINE_TAKE) || (nType1 == DdzCardType.CT_ERROR)) {
        DdzModel.prototype.searchLine(nType1, handCard, SearchRet);
    }

    // 飞机
    if ((nType1 >= DdzCardType.CT_THREE_LINE_TAKE && nType1 < DdzCardType.CT_FOUR_TAKE_TWO) || (nType1 == DdzCardType.CT_ERROR)) {
        DdzModel.prototype.searchThreeLineTake(nType1, handCard, SearchRet);
    }

    // 四带二
    if ((nType1 >= DdzCardType.CT_FOUR_TAKE_TWO && nType1 < DdzCardType.CT_BOMB_CARD) || (nType1 == DdzCardType.CT_ERROR)) {
        DdzModel.prototype.searchFourTakeTwo(nType1, handCard, SearchRet);
    }

    // 炸弹
    if (nType1 >= DdzCardType.CT_BOMB_CARD && nType1 < DdzCardType.CT_KING) {
        DdzModel.prototype.searchBomb(nType1, handCard, SearchRet);
    }

    // 比炸弹小的，把所有炸弹搜出来
    if (nType1 < DdzCardType.CT_BOMB_CARD) {
        DdzModel.prototype.searchBomb(0, handCard, SearchRet);
    }

    // 王炸
    if ((nType1 >= DdzCardType.CT_KING)) {
        DdzModel.prototype.searchKing(nType1, handCard, SearchRet);
    }

    // 比王炸小的
    if (nType1 < DdzCardType.CT_KING) {
        DdzModel.prototype.searchKing(0, handCard, SearchRet);
    }

    return SearchRet;
};

// 搜索单牌
DdzModel.prototype.searchSingle = function (card1, handCard, ret) {

    cc.log("搜单牌"+card1);
    var Ana = DdzModel.prototype.MakeAnalyseResult();
    DdzModel.prototype.AnalysebCardData(handCard, Ana);
    for (var i = 0; i < 4; i++) {
        for (var j = Ana.cbBlockCount[i] - 1; j >= 0; j--) {
            var v = Ana.cbCardData[i][j * (i + 1)];
            if (DdzModel.prototype.GetCardLogicValue(v) > card1) {
                var arr = [];
                arr.push(v);
                ret.push(arr);
            }
        }
    }
};

// 搜索对牌
DdzModel.prototype.searchDouble = function (card1, handCard, ret) {
    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(handCard);
    cc.log("搜对子"+card1);
    // 把所有对子赋值进去
    for (var i = AnalyseResult.Count[1]; i > 0; i--) {
        var v = AnalyseResult.CardData[1][i * 2 - 1];
        cc.log("搜到的对子"+v);
        if (DdzModel.prototype.GetCardLogicValue(v) <= card1) {
            continue;
        }
        var arr = [];
        arr.push(AnalyseResult.CardData[1][i * 2 - 1]);
        arr.push(AnalyseResult.CardData[1][i * 2 - 2]);
        ret.push(arr);
    }
    // 癞子跟散牌组合
    if (AnalyseResult.Laizi > 0) {
        for (var i = AnalyseResult.Count[0] - 1; i >= 0; i--) {
            var v = DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[0][i]);
            if (v <= card1) continue;
            var arr = [];
            arr.push(AnalyseResult.CardData[0][i]);
            arr.push(AnalyseResult.LaiziData[0]);
            ret.push(arr);
        }
    }
    // 两张癞子
    if (AnalyseResult.Laizi >= 2 && DdzModel.prototype.GetCardLogicValue(AnalyseResult.LaiziData[0]) > card1) {
        var arr = [];
        arr.push(AnalyseResult.LaiziData[1]);
        arr.push(AnalyseResult.LaiziData[0]);
        ret.push(arr);
    }
    // 拆三牌的
    for (var i = AnalyseResult.Count[2]; i > 0; i--) {
        var v = DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2][i * 3 - 1]);
        if (v <= card1) continue;
        var arr = [];
        arr.push(AnalyseResult.CardData[2][i * 3 - 1]);
        arr.push(AnalyseResult.CardData[2][i * 3 - 2]);
        ret.push(arr);
        cc.log("拆完的三值牌"+arr);
    }
    // 拆四张
    for (var i = AnalyseResult.Count[3]; i > 0; i--) {
        var v = DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[3][i * 4 - 1]);
        if (v <= card1) continue;
        var arr = [];
        arr.push(AnalyseResult.CardData[3][i * 4 - 1]);
        arr.push(AnalyseResult.CardData[3][i * 4 - 2]);
        ret.push(arr);
    }
};

// 搜索三张
DdzModel.prototype.searchThree = function (card1, handCard, ret) {
    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(handCard);

    var arr = [];
    for (var i = -1; i < AnalyseResult.Laizi; i++) {
        if (i != -1) {
            arr.push(AnalyseResult.LaiziData[i]);
        }
        for (var j = AnalyseResult.Count[1 - i]; j > 0; j--) {
            var arr1 = arr.slice(0);
            for (var k = 0; k <= 1 - i; k++) {
                var v = AnalyseResult.CardData[1 - i][(2 - i) * j - k - 1];
                if (DdzModel.prototype.GetCardLogicValue(v) <= card1) break;
                arr1.push(v);
            }

            if (arr1.length >= 3) {
                ret.push(arr1);
            }
        }
    }
};

// 搜索三带一
DdzModel.prototype.searchThreeTakeOne = function (card1, handCard, ret) {
    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(handCard);

    cc.log("搜三带一"+card1);
    var arr = [];
    for (var i = -1; i < AnalyseResult.Laizi; i++) {
        var curArr = handCard.slice(0);
        if (i != -1) {
            arr.push(AnalyseResult.LaiziData[i]);
            DdzModel.prototype.removeByValue(curArr, AnalyseResult.LaiziData[i]);
        }
        for (var j = AnalyseResult.Count[1 - i]; j > 0; j--) {
            var curArr1 = curArr.slice(0);
            var arr1 = arr.slice(0);
            for (var k = 0; k <= 1 - i; k++) {
                var v = AnalyseResult.CardData[1 - i][(2 - i) * j - k - 1];
                if (DdzModel.prototype.GetCardLogicValue(v) <= card1) break;
                arr1.push(v);
                DdzModel.prototype.removeByValue(curArr1, v);
            }

            if (arr1.length < 3) continue;
            // 从剩余的牌选一张作为翅膀
            if (curArr1.length > 0) {
                var a = [];
                DdzModel.prototype.searchSingle(0, curArr1, a);
                if (a.length > 0) {
                    arr1.push(a[0]);
                    ret.push(arr1);
                }
            }
        }
    }
};

// 搜索三带二
DdzModel.prototype.searchThreeTakeTwo = function (card1, handCard, ret) {
    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(handCard);

    var arr = [];
    for (var i = -1; i < AnalyseResult.Laizi; i++) {
        var curArr = handCard.slice(0);
        if (i != -1) {
            arr.push(AnalyseResult.LaiziData[i]);
            DdzModel.prototype.removeByValue(curArr, AnalyseResult.LaiziData[i]);
        }
        for (var j = AnalyseResult.Count[1 - i]; j > 0; j--) {
            var curArr1 = curArr.slice(0);
            var arr1 = arr.slice(0);
            for (var k = 0; k <= 1 - i; k++) {
                var v = AnalyseResult.CardData[1 - i][(2 - i) * j - k - 1];
                if (DdzModel.prototype.GetCardLogicValue(v) <= card1) break;
                arr1.push(v);
                DdzModel.prototype.removeByValue(curArr1, v);
            }

            if (arr1.length < 3) continue;
            // 从剩余的牌选一对作为翅膀
            if (curArr1.length > 1) {
                var tmpRet = [];
                DdzModel.prototype.searchDouble(0, curArr1, tmpRet);
                cc.log("搜完的对子"+tmpRet);
                for (var k = 0; k < tmpRet.length; k++) {
                    var tmp = tmpRet[k];
                    var arr2 = arr1.slice(0);
                    for (var l = 0; l < 2; l++) {
                        arr2.push(tmp[l]);
                    }
                    ret.push(arr2);
                    cc.log("对弟弟的"+arr2);
                }
            }
        }
    }
};

// 搜索顺子
DdzModel.prototype.searchLine = function (nType, handCard, ret) {
    // 不是顺子类型直接返回
    if (nType != DdzCardType.CT_ERROR && (nType < DdzCardType.CT_SINGLE_LINE || nType >= DdzCardType.CT_THREE_LINE_TAKE)) return;

    // 癞子、2、大小王去掉
    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(handCard);
    var tmpArr = handCard.slice(0);
    DdzModel.prototype.removeValueFromCard(tmpArr, DdzModel.prototype.Laizi);
    DdzModel.prototype.removeValueFromCard(tmpArr, 2);
    DdzModel.prototype.removeValueFromCard(tmpArr, 0xe);
    DdzModel.prototype.removeValueFromCard(tmpArr, 0xf);
    DdzModel.prototype.sortCard(tmpArr);
    cc.log("筛选完的牌"+tmpArr);

    var nLineCount = (nType & 0xf0) >> 4;
    var nLogic = nType & 0xf;
    var nCount = ((nType & 0xf00) >> 8) - 5; // 几连顺(1,2,3)

    var nMin = DdzModel.prototype.GetCardLogicValue(nLogic - nLineCount + 1);
    cc.log("顺子判断"+nLineCount+","+nLogic+","+nCount+","+nMin);
    for (var i = handCard.length - 1; i >= 0; i--) {
        var v = handCard[i];
        var vLogic = DdzModel.prototype.GetCardLogicValue(v);
        cc.log("i="+i+","+v % 16+"目前最小为"+nMin);
        if (nMin + nLineCount > 14) break;
        if (vLogic <= nMin) continue;

        var laiziArr = AnalyseResult.LaiziData.slice(0);

        var arr = [];
        for (var j = 0; j < nCount; j++) {
            var v1 = handCard[i - j + AnalyseResult.Laizi - laiziArr.length];
            if (DdzModel.prototype.GetCardLogicValue(v1) != nMin + 1) {
                if (laiziArr.length > 0) {
                    arr.push(laiziArr[laiziArr.length - 1]);
                    laiziArr.splice(laiziArr.length - 1, 1);
                    cc.log("筛选完的癞子"+laiziArr);
                    continue;
                } else {
                    i++;
                    break;
                }
            }
            arr.push(v1);
        }

        nMin++;
        if (arr.length != nCount) continue;
        i = i - nCount + 1 + AnalyseResult.Laizi - laiziArr.length;
        var nowValue = nMin;
        var lzArr = laiziArr.slice(0);
        for (j = i; j >= 0; j--) {
            var k = 0;
            var n = j;
            for (; k < nCount; k++) {
                var v1 = handCard[n - k];
                var v2 = DdzModel.prototype.GetCardLogicValue(v1);
                cc.log("当前arr里的数据"+arr);
                cc.log("遍历下一个的值"+v1+","+v2+","+nowValue);
                if (v2 <= nowValue) {
                    k--;
                    n--;
                    continue;
                }

                if (v2 != nowValue + 1) {
                    if (lzArr.length > 0) {
                        arr.push(lzArr[lzArr.length - 1]);
                        lzArr.splice(lzArr.length - 1, 1);
                        n--;
                        cc.log("第二次筛选完癞子"+lzArr);
                        continue;
                    } else {
                        break;
                    }
                }
                arr.push(v1);
            }
            j = j - k + laiziArr.length - lzArr.length;
            cc.log("找完了"+j+","+k+","+arr);
            if (k != nCount) break;
            if (arr.length == nLineCount * nCount) break;
            nowValue++;
        }
        if (arr.length == nLineCount * nCount) {
            cc.log("搜索出来的牌"+arr);
            ret.push(arr);
        }
    }
};

// 搜索飞机带翅膀
DdzModel.prototype.searchThreeLineTake = function (nType, handCard, ret) {
    var nLogicV = (nType & 0xf0) >> 4;  // 逻辑牌
    var isDouble = nType & 1;           // 翅膀是否是对子
    var nPair = (nType & 7) >> 1;        // 对数

    cc.log("搜飞机"+nLogicV+","+isDouble+","+nPair);
    var tmpRet = [];
    // 先搜三顺子
    DdzModel.prototype.searchLine(DdzCardType.CT_THREE_LINE | nLogicV | (nPair << 4), handCard, tmpRet);

    for (var i = 0; i < tmpRet.length; i++) {
        var arr = tmpRet[i];
        var tmpHandCard = handCard.slice(0);
        for (var k in arr) {
            DdzModel.prototype.removeByValue(tmpHandCard, arr[k]);
        }
        // 翅膀的数量不够
        if (tmpHandCard.length < (nPair * (isDouble + 1))) {
            return;
        }
        // 翅膀是单
        if (isDouble == 0) {
            var singleArr = [];
            DdzModel.prototype.searchSingle(0, tmpHandCard, singleArr);
            for (var j = 0; j < nPair; j++) {
                arr.push(singleArr[j]);
            }
            ret.push(arr);
        } else {
            var doubleArr = [];
            DdzModel.prototype.searchDouble(0, tmpHandCard, doubleArr);

            if (doubleArr.length >= nPair) {
                for (var j = 0; j < nPair; j++) {
                    var v = doubleArr[j];
                    arr.push(v[0]);
                    arr.push(v[1]);
                }
                ret.push(arr);
            }
        }
    }
};

// 搜索四带二
DdzModel.prototype.searchFourTakeTwo = function (nType, handCard, ret) {
    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(handCard);

    var nLogicV = (nType & 0xf0) >> 4;
    var nCount = nType & 0xf;

    var curArr = handCard.slice(0);
    var arr = [];
    for (var i = -1; i < AnalyseResult.Laizi; i++) {
        if (i != -1) {
            arr.push(AnalyseResult.LaiziData[i]);
            DdzModel.prototype.removeByValue(curArr, AnalyseResult.LaiziData[i]);
        }
        if (arr.length == 4) {
            DdzModel.prototype.searchFourTakeTwoWing(curArr, nCount, arr);
            if ((nCount == 0 && arr.length == 6) || (nCount == 1 && arr.length == 8)) {
                ret.push(arr);
            }
            break;
        }
        for (var j = AnalyseResult.Count[2 - i]; j > 0; j--) {
            var curArr1 = curArr.slice(0);
            var arr1 = arr.slice(0);
            for (var k = 0; k <= 2 - i; k++) {
                var v = AnalyseResult.CardData[2 - i][(3 - i) * j - k - 1];
                cc.log("怕怕"+v+","+nLogicV);
                if (DdzModel.prototype.GetCardLogicValue(v) <= nLogicV) break;
                arr1.push(v);
                DdzModel.prototype.removeByValue(curArr1, v);
            }

            if (arr1.length < 4) continue;
            // 从剩余的牌选一对作为翅膀
            DdzModel.prototype.searchFourTakeTwoWing(curArr1, nCount, arr1);
            if ((nCount == 0 && arr1.length == 6) || (nCount == 1 && arr1.length == 8)) {
                ret.push(arr1);
            }
        }
    }
};

// 四代二翅膀搜索
DdzModel.prototype.searchFourTakeTwoWing = function (cardArr, nCount, arr) {
    if (cardArr.length > 1) {
        if (nCount == 0) {
            // 找单牌
            var tmpRet = [];
            DdzModel.prototype.searchSingle(0, cardArr, tmpRet);
            cc.log("搜完的单牌"+tmpRet);
            if (tmpRet.length >= 2) {
                arr.push(tmpRet[0][0]);
                arr.push(tmpRet[1][0]);
            }
        } else {
            // 找对子
            var tmpRet = [];
            DdzModel.prototype.searchDouble(0, cardArr, tmpRet);
            cc.log("搜完的对子"+tmpRet);
            if (tmpRet.length >= 2) {
                arr.push(tmpRet[0][0]);
                arr.push(tmpRet[0][1]);
                arr.push(tmpRet[1][0]);
                arr.push(tmpRet[1][1]);
            }
        }
    }
};

// 搜索炸弹
DdzModel.prototype.searchBomb = function (nType, handCard, ret) {
    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(handCard);
    var laizi = nType & 0xF;
    var nValue = (nType & 0xF0) >> 4;

    cc.log("搜炸弹"+laizi+","+nValue+","+nType);
    for (var i = AnalyseResult.Count[3]; i > 0; i--) {
        var v = AnalyseResult.CardData[3][i * 4 - 1];
        if (laizi <= 0 && nValue >= DdzModel.prototype.GetCardLogicValue(v)) continue;
        var arr = [];
        arr.push(AnalyseResult.CardData[3][i * 4 - 1]);
        arr.push(AnalyseResult.CardData[3][i * 4 - 2]);
        arr.push(AnalyseResult.CardData[3][i * 4 - 3]);
        arr.push(AnalyseResult.CardData[3][i * 4 - 4]);
        ret.push(arr);
    }

    if (laizi > 0 || nType == DdzCardType.CT_ERROR) {
        var arr = [];
        for (var i = 0; i < AnalyseResult.Laizi; i++) {
            arr.push(AnalyseResult.LaiziData[i]);
            if (arr.length == 4) {
                ret.push(arr);
                return;
            }
            for (var j = AnalyseResult.Count[2 - i]; j > 0; j--) {
                var v = DdzModel.prototype.GetCardLogicValue(AnalyseResult.CardData[2 - i][j * (3 - i) - 1]);
                if (v <= nValue) continue;
                var tmpArr = arr.slice(0);
                for (var k = 0; k <= 2 - i; k++) {
                    tmpArr.push(AnalyseResult.CardData[2 - i][j * (3 - i) - 1 - k]);
                }
                ret.push(tmpArr);
            }
        }
    }
};

// 搜索王炸
DdzModel.prototype.searchKing = function (nType, handCard, ret) {
    var sKing = nType & 0xF;
    var lKing = (nType & 0xF0) >> 4;
    var nKing = sKing + lKing;
    var AnalyseResult = DdzModel.prototype.DdzAnalysebCardData(handCard);
    var arr = [];
    cc.log("搜王炸"+sKing+","+lKing+","+nKing);
    cc.log("分析结果"+AnalyseResult.King+","+AnalyseResult.SKing+","+AnalyseResult.LKing);
    if (AnalyseResult.King > nKing) {
        for (var i = 0; i < AnalyseResult.SKing; i++) {
            arr.push(0x4e);
            if (arr.length > nKing && arr.length >= 2) break;
        }
        if (arr.length <= nKing || arr.length < 2) {
            for (var i = 0; i < AnalyseResult.LKing; i++) {
                arr.push(0x4f);
                if (arr.length > nKing && arr.length >= 2) break;
            }
        }
    } else if (AnalyseResult.King == nKing && AnalyseResult.LKing > lKing) {
        for (var i = 0; i < AnalyseResult.LKing; i++) {
            arr.push(0x4f);
        }
        for (var i = 0; i < AnalyseResult.SKing; i++) {
            arr.push(0x4e);
        }
    }

    if (arr.length > 1) {
        ret.push(arr);
    }
};

/***************************************以下为无癞子算法**********************************************************/
// 获取数值
DdzModel.prototype.GetCardValue = function (cardData) {
    return cardData & CMD_DDZ.MASK_VALUE;
};

// 获取花色
DdzModel.prototype.GetCardColor = function (cardData) {
    return cardData & CMD_DDZ.MASK_COLOR;
};


// 逻辑数值
DdzModel.prototype.GetCardLogicValue = function(cardData){
    var nCardColor = DdzModel.prototype.GetCardColor(cardData);
    var nCardValue = DdzModel.prototype.GetCardValue(cardData);

    if (nCardValue <= 0 || nCardValue > (CMD_DDZ.MASK_VALUE & 0x4f)) return CMD_DDZ.INVALID;

    // 转换数值
    if (nCardColor == 0x40) return nCardValue + 2;
    return (nCardValue <= 2)? (nCardValue + 13) : nCardValue;
};

// 构造一个分析对象
DdzModel.prototype.MakeAnalyseResult = function () {
    var AnalyseResult = {"cbBlockCount": [0, 0, 0, 0], "cbCardData": []};
    for (var i = 0; i < 4; i++) {
        var arr = new Array();
        for (var j = 0; j < CMD_DDZ.MAX_COUNT; j++) {
            arr.push(0);
            
        }
        AnalyseResult.cbCardData.push(arr);
    }
    return AnalyseResult;
};

// 扑克分析
DdzModel.prototype.AnalysebCardData = function (cardData, AnalyseResult) {
    var cardCount = DdzModel.prototype.CountArray(cardData);
    cc.log("扑克分析"+cardData+","+cardCount);
    for (var i = 0; i < cardCount; i++) {
        var nSameCount = 1;
        var nLogicCalue = DdzModel.prototype.GetCardLogicValue(cardData[i]);

        // 搜索同牌
        for (var j = i + 1; j < cardCount; j++) {
            // 获取扑克
            if (DdzModel.prototype.GetCardLogicValue(cardData[j]) != nLogicCalue) break;

            // 同牌数自增
            nSameCount++;
        }

        if (nSameCount > 4) {
            cc.log("警告！！！！不可能超过4张一样的牌");
            return;
        }

        // 设置结果
        var nIndex = AnalyseResult.cbBlockCount[nSameCount - 1]++;
        for (var j = 0; j < nSameCount; j++) {
            AnalyseResult.cbCardData[nSameCount - 1][nIndex * nSameCount + j] = cardData[i + j];
        }

        i += nSameCount - 1;
    }
};

// 排序
DdzModel.prototype.sortCard = function(arry){
    var startValue = [0, 11, 11, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 0, 0];
    for(var num = 0; num < arry.length; num++){
        var a = arry[num] % 0x10;
        arry[num] += startValue[a];
    }

    var arrLen = arry.length;
    var Inum,Jnum;
    for(Inum = 0 ; Inum < arrLen ; Inum++){
        for(Jnum = 0 ;Jnum < arrLen - 1 ; Jnum++){
            if((arry[Jnum] % 16) < (arry[Jnum + 1] % 16)){
                arry[Jnum] = arry[Jnum] + arry[Jnum + 1];
                arry[Jnum + 1] = arry[Jnum] - arry[Jnum + 1];
                arry[Jnum] = arry[Jnum] - arry[Jnum + 1];
            }
            if((arry[Jnum] % 16) == (arry[Jnum + 1] % 16)){
                if((arry[Jnum] / 16) < (arry[Jnum + 1] / 16)){
                    arry[Jnum] = arry[Jnum] + arry[Jnum + 1];
                    arry[Jnum + 1] = arry[Jnum] - arry[Jnum + 1];
                    arry[Jnum] = arry[Jnum] - arry[Jnum + 1];
                }
            }
        }
    }

    var endValue = [0, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 11, 11, 0, 0];
    for(var num = 0; num < arry.length; num++){
        var a = arry[num] % 0x10;
        arry[num] -= endValue[a];
    }
    return arry;
};

// 求数组长度，去掉0后的
DdzModel.prototype.CountArray = function (cardData) {
    var nCount = 0;
    for (var i = 0; i < cardData.length; i++) {
        if (cardData[i] > 0) nCount++;
    }
    return nCount;
};

DdzModel.prototype.removeByValue = function (cardsValue, val) {
    for(var i = 0; i < cardsValue.length; i++) {
        if(cardsValue[i] == val) {
            cardsValue.splice(i, 1);
            break;
        }
    }
};

