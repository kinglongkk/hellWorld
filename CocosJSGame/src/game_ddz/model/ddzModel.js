var DdzModel = function(){};
var cbIndexCount = 5;

//扑克类型 没牛-牛丁-牛二……牛八-牛九-牛牛-四花-五花-炸弹-小牛牛
DdzModel.CardType = {
    OX_VALUE0:					0,									//混合牌型
    OX_FOURKING:				102,								//天王牌型四花
    OX_FIVEKING:				103,								//天王牌型五花
    OX_FOUR_SAME:				104,								//炸弹——5张牌中有4张一样的牌。
    OX_THREE_SAME:				105,								//小牛牛——5张牌都小于5（含5），并且5张牌相加不大于10
};

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

//获得牌型
DdzModel.prototype.GetCardType = function(cardsData){
    var cardCount = DdzModel.prototype.CountArray(cardsData);

    DdzModel.prototype.sortCard(cardsData);
    switch (cardCount) {
        case 0: // 空牌
            return CMD_DDZ.CT_ERROR;
        case 1: // 单牌
            return CMD_DDZ.CT_SINGLE;
        case 2: {   // 对牌火箭
            if (cardsData[0] == 0x4f && cardsData[1] == 0x4e) return CMD_DDZ.CT_MISSILE_CARD;
            if (DdzModel.prototype.GetCardLogicValue(cardsData[0]) ==
                DdzModel.prototype.GetCardLogicValue(cardsData[1])) {
                return CMD_DDZ.CT_DOUBLE;
            }
            return CMD_DDZ.CT_ERROR;
        }
    }

    // 建一个牌型分析对象
    var AnalyseResult = DdzModel.prototype.MakeAnalyseResult();
    DdzModel.prototype.AnalysebCardData(cardsData, AnalyseResult);

    // 四牌判断
    if (AnalyseResult.cbBlockCount[3] > 0)
    {
        //牌型判断
        if ((AnalyseResult.cbBlockCount[3] == 1) && (cardCount == 4)) return CMD_DDZ.CT_BOMB_CARD;
        if ((AnalyseResult.cbBlockCount[3] == 1) && (cardCount == 6)) return CMD_DDZ.CT_FOUR_TAKE_ONE;
        if ((AnalyseResult.cbBlockCount[3] == 1) && (cardCount == 8) && (AnalyseResult.cbBlockCount[1] == 2))
            return CMD_DDZ.CT_FOUR_TAKE_TWO;

        return CMD_DDZ.CT_ERROR;
    }

    //三牌判断
    if (AnalyseResult.cbBlockCount[2] > 0)
    {
        //连牌判断
        if (AnalyseResult.cbBlockCount[2] > 1)
        {
            //变量定义
            var cbCardData = AnalyseResult.cbCardData[2][0];
            var cbFirstLogicValue = DdzModel.prototype.GetCardLogicValue(cbCardData);

            //错误过虑
            if (cbFirstLogicValue >= 15) return CMD_DDZ.CT_ERROR;

            //连牌判断
            for (var i = 1; i < AnalyseResult.cbBlockCount[2]; i++)
            {
                var cbCardData = AnalyseResult.cbCardData[2][i * 3];
                if (cbFirstLogicValue != (DdzModel.prototype.GetCardLogicValue(cbCardData) + i))
                    return CMD_DDZ.CT_ERROR;
            }
        }
        else if( cardCount == 3 ) return CMD_DDZ.CT_THREE;

        //牌形判断
        if (AnalyseResult.cbBlockCount[2] * 3 == cardCount) return CMD_DDZ.CT_THREE_LINE;
        if (AnalyseResult.cbBlockCount[2] * 4 == cardCount) return CMD_DDZ.CT_THREE_TAKE_ONE;
        if ((AnalyseResult.cbBlockCount[2] * 5 == cardCount) &&
            (AnalyseResult.cbBlockCount[1] == AnalyseResult.cbBlockCount[2]))
            return CMD_DDZ.CT_THREE_TAKE_TWO;

        return CMD_DDZ.CT_ERROR;
    }

    //两张类型
    if (AnalyseResult.cbBlockCount[1] >= 3)
    {
        //变量定义
        var cbCardData = AnalyseResult.cbCardData[1][0];
        var cbFirstLogicValue = DdzModel.prototype.GetCardLogicValue(cbCardData);

        //错误过虑
        if (cbFirstLogicValue >= 15) return CMD_DDZ.CT_ERROR;

        //连牌判断
        for (var i = 1;i < AnalyseResult.cbBlockCount[1]; i++) {
            var cbCardData = AnalyseResult.cbCardData[1][i * 2];
            if (cbFirstLogicValue != (DdzModel.prototype.GetCardLogicValue(cbCardData) + i))
                return CMD_DDZ.CT_ERROR;
        }

        //二连判断
        if ((AnalyseResult.cbBlockCount[1] * 2) == cardCount) return CMD_DDZ.CT_DOUBLE_LINE;

        return CMD_DDZ.CT_ERROR;
    }

    //单张判断
    if ((AnalyseResult.cbBlockCount[0] >= 5) && (AnalyseResult.cbBlockCount[0] == cardCount))
    {
        //变量定义
        var cbCardData = AnalyseResult.cbCardData[0][0];
        var cbFirstLogicValue = DdzModel.prototype.GetCardLogicValue(cbCardData);

        //错误过虑
        if (cbFirstLogicValue >= 15) return CMD_DDZ.CT_ERROR;

        //连牌判断
        for (var i = 1; i < AnalyseResult.cbBlockCount[0]; i++) {
            var cbCardData = AnalyseResult.cbCardData[0][i];
            if (cbFirstLogicValue != (DdzModel.prototype.GetCardLogicValue(cbCardData) + i))
                return CMD_DDZ.CT_ERROR;
        }

        return CMD_DDZ.CT_SINGLE_LINE;
    }

    return CMD_DDZ.CT_ERROR;
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

// 对比扑克
DdzModel.prototype.CompareCard  = function (cbFirstCard, cbNextCard) {
    var cbFirstCount = DdzModel.prototype.CountArray(cbFirstCard);
    var cbNextCount = DdzModel.prototype.CountArray(cbNextCard);

    // 获取类型
    var cbNextType = DdzModel.prototype.GetCardType(cbNextCard);
    var cbFirstType = DdzModel.prototype.GetCardType(cbFirstCard);

    // 如果出的是空牌，则任何类型都有效
    if (cbFirstType == CMD_DDZ.CT_ERROR && cbNextType != CMD_DDZ.CT_ERROR) return true;

    // 类型判断
    if (cbNextType == CMD_DDZ.CT_ERROR) return false;
    if (cbNextType == CMD_DDZ.CT_MISSILE_CARD) return true;
    cc.log("CompareCard:"+"cbNextType="+cbNextType+"cbFirstType"+cbFirstType);

    // 炸弹判断
    if ((cbFirstType != CMD_DDZ.CT_BOMB_CARD) && (cbNextType == CMD_DDZ.CT_BOMB_CARD)) return true;
    if ((cbFirstType == CMD_DDZ.CT_BOMB_CARD) && (cbNextType != CMD_DDZ.CT_BOMB_CARD)) return false;

    // 规则判断
    if ((cbFirstType != cbNextType) || (cbFirstCount != cbNextCount)) return false;

    // 开始对比
    switch (cbNextType) {
        case CMD_DDZ.CT_SINGLE:
        case CMD_DDZ.CT_DOUBLE:
        case CMD_DDZ.CT_THREE:
        case CMD_DDZ.CT_SINGLE_LINE:
        case CMD_DDZ.CT_DOUBLE_LINE:
        case CMD_DDZ.CT_THREE_LINE:
        case CMD_DDZ.CT_BOMB_CARD: {
            //获取数值
            var cbNextLogicValue = DdzModel.prototype.GetCardLogicValue(cbNextCard[0]);
            var cbFirstLogicValue = DdzModel.prototype.GetCardLogicValue(cbFirstCard[0]);

            //对比扑克
            return cbNextLogicValue > cbFirstLogicValue;
        }
        case CMD_DDZ.CT_THREE_TAKE_ONE:
        case CMD_DDZ.CT_THREE_TAKE_TWO: {
            //分析扑克
            var NextResult = DdzModel.prototype.MakeAnalyseResult();
            var FirstResult = DdzModel.prototype.MakeAnalyseResult();
            DdzModel.prototype.AnalysebCardData(cbNextCard, NextResult);
            DdzModel.prototype.AnalysebCardData(cbFirstCard, FirstResult);

            //获取数值
            var cbNextLogicValue = DdzModel.prototype.GetCardLogicValue(NextResult.cbCardData[2][0]);
            var cbFirstLogicValue = DdzModel.prototype.GetCardLogicValue(FirstResult.cbCardData[2][0]);

            //对比扑克
            return cbNextLogicValue > cbFirstLogicValue;
        }
        case CMD_DDZ.CT_FOUR_TAKE_ONE:
        case CMD_DDZ.CT_FOUR_TAKE_TWO:
        {
            //分析扑克
            var NextResult = DdzModel.prototype.MakeAnalyseResult();
            var FirstResult = DdzModel.prototype.MakeAnalyseResult();
            DdzModel.prototype.AnalysebCardData(cbNextCard, NextResult);
            DdzModel.prototype.AnalysebCardData(cbFirstCard, FirstResult);

            //获取数值
            var cbNextLogicValue = DdzModel.prototype.GetCardLogicValue(NextResult.cbCardData[3][0]);
            var cbFirstLogicValue = DdzModel.prototype.GetCardLogicValue(FirstResult.cbCardData[3][0]);

            //对比扑克
            return cbNextLogicValue > cbFirstLogicValue;
        }
    }

    return false;
};

// 构造一个分布信息对象
DdzModel.prototype.MakeTagDistributing = function () {
    var TagDistributing = {"cbCardCount": 0, "cbDistributing": []};
    for (var i = 0; i < 15; i++) {
        var arr = new Array();
        for (var j = 0; j < 6; j++) {
            arr.push(0);
        }
        TagDistributing.cbDistributing.push(arr);
    }
    return TagDistributing;
};

// 分析分布
DdzModel.prototype.AnalysebDistributing = function(cbCardData, Distributing)
{
    var cbCardCount = DdzModel.prototype.CountArray(cbCardData);
    //设置变量
    for (var i = 0; i < cbCardCount; i++) {
        if (cbCardData[i] == 0) continue;

        //获取属性
        var cbCardColor = DdzModel.prototype.GetCardColor(cbCardData[i]);
        var cbCardValue = DdzModel.prototype.GetCardValue(cbCardData[i]);

        //分布信息
        Distributing.cbCardCount++;
        Distributing.cbDistributing[cbCardValue - 1][cbIndexCount]++;
        Distributing.cbDistributing[cbCardValue - 1][cbCardColor >> 4]++;
    }
}

//
DdzModel.prototype.MakeTagSearchCardResult = function () {
    var TagSearchCardResult = {"cbSearchCount" : 0, "cbCardCount" : [], "cbResultCard" : []};
    for (var i = 0; i < CMD_DDZ.MAX_COUNT; i++) {
        TagSearchCardResult.cbCardCount.push(0);
        var arr = new Array();
        for (var j = 0; j < CMD_DDZ.MAX_COUNT; j++) {
            arr.push(0);
        }
        TagSearchCardResult.cbResultCard.push(arr);
    }

    return TagSearchCardResult;
};

//出牌搜索
DdzModel.prototype.SearchOutCard = function(cbHandCardData, cbTurnCardData, pSearchCardResult)
{
    var cbHandCardCount = DdzModel.prototype.CountArray(cbHandCardData);
    var cbTurnCardCount = DdzModel.prototype.CountArray(cbTurnCardData);
    var cbCardCount = cbHandCardCount;
    //变量定义
    var cbResultCount = 0;
    var tmpSearchCardResult = DdzModel.prototype.MakeTagSearchCardResult();

    //构造扑克
    var cbCardData = cbHandCardData;

    //排列扑克
    // SortCardList(cbCardData,cbCardCount,ST_ORDER);

    //获取类型
    cc.log("turncard="+cbTurnCardData);
    cc.log("handcard="+cbHandCardData);
    var cbTurnOutType = DdzModel.prototype.GetCardType(cbTurnCardData);

    cc.log("cbTurnOutType="+cbTurnOutType + "," + pSearchCardResult);
    //出牌分析
    switch (cbTurnOutType)
    {
        case CMD_DDZ.CT_ERROR:					//错误类型
        {
            //提取各种牌型一组
            //是否一手出完
            if( DdzModel.prototype.GetCardType(cbCardData) != CMD_DDZ.CT_ERROR )
            {
                pSearchCardResult.cbCardCount[cbResultCount] = cbCardCount;
                for (var i = 0; i < cbCardCount; i++) {
                    pSearchCardResult.cbResultCard[cbResultCount][i] = cbCardData[i];
                }
                cbResultCount++;
            }

            //如果最小牌不是单牌，则提取
            var cbSameCount = 0;
            if( cbCardCount > 1 && DdzModel.prototype.GetCardValue(cbCardData[cbCardCount - 1]) ==
                DdzModel.prototype.GetCardValue(cbCardData[cbCardCount - 2]) )
            {
                cbSameCount = 1;
                pSearchCardResult.cbResultCard[cbResultCount][0] = cbCardData[cbCardCount - 1];
                var cbCardValue = DdzModel.prototype.GetCardValue(cbCardData[cbCardCount-1]);
                for( var i = cbCardCount - 2; i >= 0; i-- )
                {
                    if( DdzModel.prototype.GetCardValue(cbCardData[i]) == cbCardValue )
                    {
                        pSearchCardResult.cbResultCard[cbResultCount][cbSameCount++] = cbCardData[i];
                    }
                    else break;
                }

                pSearchCardResult.cbCardCount[cbResultCount] = cbSameCount;
                cbResultCount++;
            }

            //单牌
            var cbTmpCount = 0;
            if( cbSameCount != 1 )
            {
                cc.log("查找相同的牌00");
                cbTmpCount = DdzModel.prototype.SearchSameCard(cbCardData, 0, 1, tmpSearchCardResult);
                if( cbTmpCount > 0 )
                {
                    pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                    for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                        pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                    }
                    cbResultCount++;
                }
            }

            //对牌
            if( cbSameCount != 2 )
            {
                cc.log("查找相同的牌22");
                cbTmpCount = DdzModel.prototype.SearchSameCard( cbCardData, 0, 2, tmpSearchCardResult);
                if( cbTmpCount > 0 )
                {
                    pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                    for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                        pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                    }
                    cbResultCount++;
                }
            }

            //三条
            if( cbSameCount != 3 )
            {
                cc.log("查找相同的牌33");
                cbTmpCount = DdzModel.prototype.SearchSameCard( cbCardData, 0, 3, tmpSearchCardResult);
                if( cbTmpCount > 0 )
                {
                    pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                    for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                        pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                    }
                    cbResultCount++;
                }
            }

            //三带一单
            cbTmpCount = DdzModel.prototype.SearchTakeCardType(cbCardData, 0, 3, 1, tmpSearchCardResult);
            if( cbTmpCount > 0 )
            {
                pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                    pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                }
                cbResultCount++;
            }

            //三带一对
            cbTmpCount = DdzModel.prototype.SearchTakeCardType( cbCardData, 0, 3, 2, tmpSearchCardResult );
            if( cbTmpCount > 0 )
            {
                pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                    pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                }
                cbResultCount++;
            }

            //单连
            cbTmpCount = DdzModel.prototype.SearchLineCardType( cbCardData, 0, 1, 0, tmpSearchCardResult );
            if( cbTmpCount > 0 )
            {
                pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                    pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                }
                cbResultCount++;
            }

            //连对
            cbTmpCount = DdzModel.prototype.SearchLineCardType( cbCardData, 0, 2, 0, tmpSearchCardResult );
            if( cbTmpCount > 0 )
            {
                pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                    pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                }
                cbResultCount++;
            }

            //三连
            cbTmpCount = DdzModel.prototype.SearchLineCardType( cbCardData, 0, 3, 0, tmpSearchCardResult );
            if( cbTmpCount > 0 )
            {
                pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                    pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                }
                cbResultCount++;
            }

            ////飞机
            //cbTmpCount = SearchThreeTwoLine( cbCardData,cbCardCount,&tmpSearchCardResult );
            //if( cbTmpCount > 0 )
            //{
            //	pSearchCardResult->cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
            //	CopyMemory( pSearchCardResult->cbResultCard[cbResultCount],tmpSearchCardResult.cbResultCard[0],
            //		sizeof(BYTE)*tmpSearchCardResult.cbCardCount[0] );
            //	cbResultCount++;
            //}

            //炸弹
            if( cbSameCount != 4 )
            {
                cbTmpCount = DdzModel.prototype.SearchSameCard( cbCardData, 0, 4, tmpSearchCardResult );
                if( cbTmpCount > 0 )
                {
                    pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[0];
                    for (var i = 0; i < tmpSearchCardResult.cbCardCount[0]; i++) {
                        pSearchCardResult.cbResultCard[cbResultCount][i] = tmpSearchCardResult.cbResultCard[0][i];
                    }
                    cbResultCount++;
                }
            }

            //搜索火箭
            if ((cbCardCount >= 2) && (cbCardData[0] == 0x4F) && (cbCardData[1] == 0x4E))
            {
                //设置结果
                pSearchCardResult.cbCardCount[cbResultCount] = 2;
                pSearchCardResult.cbResultCard[cbResultCount][0] = cbCardData[0];
                pSearchCardResult.cbResultCard[cbResultCount][1] = cbCardData[1];

                cbResultCount++;
            }

            pSearchCardResult.cbSearchCount = cbResultCount;
            return cbResultCount;
        }
        case CMD_DDZ.CT_SINGLE:					//单牌类型
        case CMD_DDZ.CT_DOUBLE:					//对牌类型
        case CMD_DDZ.CT_THREE:					//三条类型
        {
            //变量定义
            var cbReferCard = cbTurnCardData[0];
            var cbSameCount = 1;
            if( cbTurnOutType == CMD_DDZ.CT_DOUBLE ) cbSameCount = 2;
            else if( cbTurnOutType == CMD_DDZ.CT_THREE ) cbSameCount = 3;

            //搜索相同牌
            cbResultCount = DdzModel.prototype.SearchSameCard( cbCardData,cbReferCard,cbSameCount,pSearchCardResult );

            break;
        }
        case CMD_DDZ.CT_SINGLE_LINE:		//单连类型
        case CMD_DDZ.CT_DOUBLE_LINE:		//对连类型
        case CMD_DDZ.CT_THREE_LINE:				//三连类型
        {
            //变量定义
            var cbBlockCount = 1;
            if( cbTurnOutType == CMD_DDZ.CT_DOUBLE_LINE ) cbBlockCount = 2;
            else if( cbTurnOutType == CMD_DDZ.CT_THREE_LINE ) cbBlockCount = 3;

            var cbLineCount = cbTurnCardCount / cbBlockCount;

            //搜索边牌
            cbResultCount = DdzModel.prototype.SearchLineCardType( cbCardData, cbTurnCardData[0], cbBlockCount,  cbLineCount, pSearchCardResult );

            break;
        }
        case CMD_DDZ.CT_THREE_TAKE_ONE:	//三带一单
        case CMD_DDZ.CT_THREE_TAKE_TWO:	//三带一对
        {
            //效验牌数
            if( cbCardCount < cbTurnCardCount ) break;

            //如果是三带一或三带二
            if( cbTurnCardCount == 4 || cbTurnCardCount == 5 )
            {
                var cbTakeCardCount = cbTurnOutType == CMD_DDZ.CT_THREE_TAKE_ONE? 1 : 2;

                //搜索三带牌型
                cbResultCount = DdzModel.prototype.SearchTakeCardType( cbCardData, cbTurnCardData[2], 3, cbTakeCardCount, pSearchCardResult );
            }
            else
            {
                //变量定义
                var cbBlockCount = 3;
                var cbLineCount = cbTurnCardCount / (cbTurnOutType == CMD_DDZ.CT_THREE_TAKE_ONE? 4 : 5);
                var cbTakeCardCount = cbTurnOutType == CMD_DDZ.CT_THREE_TAKE_ONE? 1 : 2;

                //搜索连牌
                var cbTmpTurnCard = cbTurnCardData;
                DdzModel.prototype.SortOutCardList( cbTmpTurnCard );
                cbResultCount = DdzModel.prototype.SearchLineCardType( cbCardData, cbTmpTurnCard[0], cbBlockCount, cbLineCount, pSearchCardResult );

                //提取带牌
                var bAllDistill = true;
                for( var i = 0; i < cbResultCount; i++ )
                {
                    var cbResultIndex = cbResultCount - i - 1;

                    //变量定义
                    var cbTmpCardData = cbCardData;
                    var cbTmpCardCount = cbCardCount;

                    //删除连牌
                    DdzModel.prototype.RemoveCard( pSearchCardResult.cbResultCard[cbResultIndex],
                            pSearchCardResult.cbCardCount[cbResultIndex], cbTmpCardData, cbTmpCardCount );
                    cbTmpCardCount -= pSearchCardResult.cbCardCount[cbResultIndex];

                    //分析牌
                    var TmpResult = DdzModel.prototype.MakeAnalyseResult();
                    DdzModel.prototype.AnalysebCardData( cbTmpCardData, TmpResult );

                    //提取牌
                    var cbDistillCard = [];
                    var cbDistillCount = 0;
                    for( var j = cbTakeCardCount - 1; j < TmpResult.cbBlockCount.length; j++ )
                    {
                        if( TmpResult.cbBlockCount[j] > 0 )
                        {
                            if( j + 1 == cbTakeCardCount && TmpResult.cbBlockCount[j] >= cbLineCount )
                            {
                                var cbTmpBlockCount = TmpResult.cbBlockCount[j];
                                for (var k = 0; k < (j + 1) * cbLineCount; k++) {
                                    cbDistillCard[k] = TmpResult.cbCardData[j][(cbTmpBlockCount - cbLineCount) * (j + 1) + k];
                                }
                                cbDistillCount = (j + 1) * cbLineCount;
                                break;
                            }
                            else
                            {
                                for( var k = 0; k < TmpResult.cbBlockCount[j]; k++ )
                                {
                                    var cbTmpBlockCount = TmpResult.cbBlockCount[j];
                                    for (var l = 0; l < cbTakeCardCount; l++) {
                                        cbDistillCard[cbDistillCount][l] = TmpResult.cbCardData[j][(cbTmpBlockCount - k - 1) * (j + 1) + l];
                                    }
                                    cbDistillCount += cbTakeCardCount;

                                    //提取完成
                                    if( cbDistillCount == cbTakeCardCount*cbLineCount ) break;
                                }
                            }
                        }

                        //提取完成
                        if( cbDistillCount == cbTakeCardCount * cbLineCount ) break;
                    }

                    //提取完成
                    if( cbDistillCount == cbTakeCardCount * cbLineCount )
                    {
                        //复制带牌
                        var cbCount = pSearchCardResult.cbCardCount[cbResultIndex];
                        for (var j = 0; j < cbDistillCount; j++) {
                            pSearchCardResult.cbResultCard[cbResultIndex][cbCount + j] = cbDistillCard[j];
                        }
                        pSearchCardResult.cbCardCount[cbResultIndex] += cbDistillCount;
                    }
                    //否则删除连牌
                    else
                    {
                        bAllDistill = false;
                        pSearchCardResult.cbCardCount[cbResultIndex] = 0;
                    }
                }

                //整理组合
                if( !bAllDistill )
                {
                    pSearchCardResult.cbSearchCount = cbResultCount;
                    cbResultCount = 0;
                    for( var i = 0; i < pSearchCardResult.cbSearchCount; i++ )
                    {
                        if( pSearchCardResult.cbCardCount[i] != 0 )
                        {
                            tmpSearchCardResult.cbCardCount[cbResultCount] = pSearchCardResult.cbCardCount[i];
                            for (var j = 0; j < pSearchCardResult.cbCardCount[i]; j++) {
                                tmpSearchCardResult.cbResultCard[cbResultCount][j] = pSearchCardResult.cbResultCard[i][j];
                            }
                            cbResultCount++;
                        }
                    }
                    tmpSearchCardResult.cbSearchCount = cbResultCount;
                    pSearchCardResult = tmpSearchCardResult;
                    // CopyMemory( pSearchCardResult,&tmpSearchCardResult,sizeof(tagSearchCardResult) );
                }
            }

            break;
        }
        case CMD_DDZ.CT_FOUR_TAKE_ONE:		//四带两单
        case CMD_DDZ.CT_FOUR_TAKE_TWO:		//四带两双
        {
            var cbTakeCount = cbTurnOutType == CMD_DDZ.CT_FOUR_TAKE_ONE? 1 : 2;

            var cbTmpTurnCard = cbTurnCardData;
            // CopyMemory( cbTmpTurnCard,cbTurnCardData,sizeof(BYTE)*cbTurnCardCount );
            DdzModel.prototype.SortOutCardList( cbTmpTurnCard );

            //搜索带牌
            cbResultCount = DdzModel.prototype.SearchTakeCardType( cbCardData, cbTmpTurnCard[0], 4, cbTakeCount, pSearchCardResult );

            break;
        }
    }

    //搜索炸弹
    if ((cbCardCount >= 4) && (cbTurnOutType != CMD_DDZ.CT_MISSILE_CARD))
    {
        //变量定义
        var cbReferCard = 0;
        if (cbTurnOutType == CMD_DDZ.CT_BOMB_CARD) cbReferCard = cbTurnCardData[0];

        //搜索炸弹
        var cbTmpResultCount = DdzModel.prototype.SearchSameCard( cbCardData, cbReferCard, 4, tmpSearchCardResult );
        for( var i = 0; i < cbTmpResultCount; i++ )
        {
            pSearchCardResult.cbCardCount[cbResultCount] = tmpSearchCardResult.cbCardCount[i];
            for (var j = 0; j < tmpSearchCardResult.cbCardCount[i]; j++) {
                pSearchCardResult.cbResultCard[cbResultCount][j] = tmpSearchCardResult.cbResultCard[i][j];
            }
            cbResultCount++;
        }
    }

    //搜索火箭
    if (cbTurnOutType != CMD_DDZ.CT_MISSILE_CARD && (cbCardCount >= 2) && (cbCardData[0] == 0x4F) && (cbCardData[1] == 0x4E))
    {
        //设置结果
        pSearchCardResult.cbCardCount[cbResultCount] = 2;
        pSearchCardResult.cbResultCard[cbResultCount][0] = cbCardData[0];
        pSearchCardResult.cbResultCard[cbResultCount][1] = cbCardData[1];

        cbResultCount++;
    }

    pSearchCardResult.cbSearchCount = cbResultCount;
    return cbResultCount;
};

//同牌搜索
DdzModel.prototype.SearchSameCard = function(cbHandCardData, cbReferCard, cbSameCardCount, pSearchCardResult) {
    var cbHandCardCount = DdzModel.prototype.CountArray(cbHandCardData);
    var cbResultCount = 0;

    //构造扑克
    var cbCardData = cbHandCardData;
    var cbCardCount = cbHandCardCount;

    // //排列扑克
    // SortCardList(cbCardData,cbCardCount,ST_ORDER);

    //分析扑克
    var AnalyseResult = DdzModel.prototype.MakeAnalyseResult();
    DdzModel.prototype.AnalysebCardData( cbCardData, AnalyseResult );

    var cbReferLogicValue = (cbReferCard ==  0)?  0 : DdzModel.prototype.GetCardLogicValue(cbReferCard);
    var cbBlockIndex = cbSameCardCount - 1;
    do
    {
        for( var i = 0; i < AnalyseResult.cbBlockCount[cbBlockIndex]; i++ )
        {
            var cbIndex = (AnalyseResult.cbBlockCount[cbBlockIndex] - i - 1) * (cbBlockIndex + 1);
            if( DdzModel.prototype.GetCardLogicValue(AnalyseResult.cbCardData[cbBlockIndex][cbIndex]) > cbReferLogicValue )
            {
                //复制扑克
                for (var j = 0; j < cbSameCardCount; j++) {
                    pSearchCardResult.cbResultCard[cbResultCount][j] = AnalyseResult.cbCardData[cbBlockIndex][cbIndex + j];
                }
                pSearchCardResult.cbCardCount[cbResultCount] = cbSameCardCount;

                cbResultCount++;
            }
        }

        cbBlockIndex++;
    }while( cbBlockIndex < AnalyseResult.cbBlockCount.length );

    pSearchCardResult.cbSearchCount = cbResultCount;

    return cbResultCount;
};

//带牌类型搜索(三带一，四带一等)
DdzModel.prototype.SearchTakeCardType = function(cbHandCardData, cbReferCard, cbSameCount, cbTakeCardCount, pSearchCardResult )
{
    var cbHandCardCount = DdzModel.prototype.CountArray(cbHandCardData);

    var cbResultCount = 0;

    //效验
    if( cbSameCount != 3 && cbSameCount != 4 )
        return cbResultCount;
    if( cbTakeCardCount != 1 && cbTakeCardCount != 2 )
        return cbResultCount;

    //长度判断
    if( cbSameCount == 4 && cbHandCardCount < cbSameCount + cbTakeCardCount * 2 ||
        cbHandCardCount < cbSameCount + cbTakeCardCount )
        return cbResultCount;

    //构造扑克
    var cbCardData = cbHandCardData;
    var cbCardCount = cbHandCardCount;

    // //排列扑克
    // SortCardList(cbCardData,cbCardCount,ST_ORDER);

    //搜索同张
    var SameCardResult = DdzModel.prototype.MakeTagSearchCardResult();
    var cbSameCardResultCount = DdzModel.prototype.SearchSameCard(cbCardData, cbReferCard, cbSameCount, SameCardResult);

    if( cbSameCardResultCount > 0 )
    {
        //分析扑克
        var AnalyseResult = DdzModel.prototype.MakeAnalyseResult();
        DdzModel.prototype.AnalysebCardData(cbCardData, AnalyseResult);

        //需要牌数
        var cbNeedCount = cbSameCount + cbTakeCardCount;
        if( cbSameCount == 4 ) cbNeedCount += cbTakeCardCount;

        //提取带牌
        for( var i = 0; i < cbSameCardResultCount; i++ )
        {
            var bMerge = false;

            for( var j = cbTakeCardCount - 1; j < AnalyseResult.cbBlockCount.length; j++ )
            {
                for( var k = 0; k < AnalyseResult.cbBlockCount[j]; k++ )
                {
                    //从小到大
                    var cbIndex = (AnalyseResult.cbBlockCount[j] - k - 1) * (j + 1);

                    //过滤相同牌
                    if( DdzModel.prototype.GetCardValue(SameCardResult.cbResultCard[i][0]) ==
                        DdzModel.prototype.GetCardValue(AnalyseResult.cbCardData[j][cbIndex]) )
                        continue;

                    //复制带牌
                    var cbCount = SameCardResult.cbCardCount[i];
                    for (var l = 0; l < cbTakeCardCount; l++) {
                        SameCardResult.cbResultCard[i][cbCount + l] = AnalyseResult.cbCardData[j][cbIndex + l];
                    }
                    SameCardResult.cbCardCount[i] += cbTakeCardCount;

                    if( SameCardResult.cbCardCount[i] < cbNeedCount ) continue;

                    //复制结果
                    for (var l = 0; l < SameCardResult.cbCardCount[i]; l++) {
                        pSearchCardResult.cbResultCard[cbResultCount][l] = SameCardResult.cbResultCard[i][l];
                    }
                    pSearchCardResult.cbCardCount[cbResultCount] = SameCardResult.cbCardCount[i];
                    cbResultCount++;

                    bMerge = true;

                    //下一组合
                    break;
                }

                if( bMerge ) break;
            }
        }
    }

    if( pSearchCardResult )
        pSearchCardResult.cbSearchCount = cbResultCount;
    return cbResultCount;
};

//连牌搜索
DdzModel.prototype.SearchLineCardType = function(cbHandCardData, cbReferCard, cbBlockCount, cbLineCount, pSearchCardResult )
{
    var cbHandCardCount = DdzModel.prototype.CountArray(cbHandCardData);

    var cbResultCount = 0;

    //定义变量
    var cbLessLineCount = 0;
    if( cbLineCount == 0 )
    {
        if( cbBlockCount == 1 )
            cbLessLineCount = 5;
        else if( cbBlockCount == 2 )
            cbLessLineCount = 3;
        else cbLessLineCount = 2;
    }
    else cbLessLineCount = cbLineCount;

    var cbReferIndex = 2;
    if( cbReferCard != 0 )
    {
        cbReferIndex = DdzModel.prototype.GetCardLogicValue(cbReferCard) - cbLessLineCount + 1;
    }
    //超过A
    if( cbReferIndex+cbLessLineCount > 14 ) return cbResultCount;

    //长度判断
    if( cbHandCardCount < cbLessLineCount*cbBlockCount ) return cbResultCount;

    //构造扑克
    var cbCardData = cbHandCardData;
    var cbCardCount = cbHandCardCount;

    // //排列扑克
    // SortCardList(cbCardData,cbCardCount,ST_ORDER);

    //分析扑克
    var Distributing = DdzModel.prototype.MakeTagDistributing();
    DdzModel.prototype.AnalysebDistributing(cbCardData, Distributing);

    //搜索顺子
    var cbTmpLinkCount = 0;
    for (var cbValueIndex = cbReferIndex; cbValueIndex < 13;cbValueIndex++)
    {
        //继续判断
        if ( Distributing.cbDistributing[cbValueIndex][cbIndexCount] < cbBlockCount )
        {
            if( cbTmpLinkCount < cbLessLineCount )
            {
                cbTmpLinkCount = 0;
                continue;
            }
            else cbValueIndex--;
        }
        else
        {
            cbTmpLinkCount++;
            //寻找最长连
            if( cbLineCount == 0 ) continue;
        }

        if( cbTmpLinkCount >= cbLessLineCount )
        {
            //复制扑克
            var cbCount = 0;
            for( var cbIndex = cbValueIndex + 1 - cbTmpLinkCount; cbIndex <= cbValueIndex; cbIndex++ )
            {
                var cbTmpCount = 0;
                for (var cbColorIndex = 0;cbColorIndex < 4;cbColorIndex++)
                {
                    for( var cbColorCount = 0; cbColorCount < Distributing.cbDistributing[cbIndex][3 - cbColorIndex]; cbColorCount++ )
                    {
                        pSearchCardResult.cbResultCard[cbResultCount][cbCount++] = DdzModel.prototype.MakeCardData(cbIndex, 3 - cbColorIndex);

                        if( ++cbTmpCount == cbBlockCount ) break;
                    }
                    if( cbTmpCount == cbBlockCount ) break;
                }
            }

            //设置变量
            pSearchCardResult.cbCardCount[cbResultCount] = cbCount;
            cbResultCount++;

            if( cbLineCount != 0 )
            {
                cbTmpLinkCount--;
            }
            else
            {
                cbTmpLinkCount = 0;
            }
        }
    }

    //特殊顺子
    if( cbTmpLinkCount >= cbLessLineCount-1 && cbValueIndex == 13 )
    {
        if( Distributing.cbDistributing[0][cbIndexCount] >= cbBlockCount ||
            cbTmpLinkCount >= cbLessLineCount )
        {
            //复制扑克
            var cbCount = 0;
            var cbTmpCount = 0;
            for( var cbIndex = cbValueIndex-cbTmpLinkCount; cbIndex < 13; cbIndex++ )
            {
                cbTmpCount = 0;
                for (var cbColorIndex = 0; cbColorIndex < 4;cbColorIndex++)
                {
                    for( var cbColorCount = 0; cbColorCount < Distributing.cbDistributing[cbIndex][3 - cbColorIndex]; cbColorCount++ )
                    {
                        pSearchCardResult.cbResultCard[cbResultCount][cbCount++] = DdzModel.prototype.MakeCardData(cbIndex, 3 - cbColorIndex);

                        if( ++cbTmpCount == cbBlockCount ) break;
                    }
                    if( cbTmpCount == cbBlockCount ) break;
                }
            }
            //复制A
            if( Distributing.cbDistributing[0][cbIndexCount] >= cbBlockCount )
            {
                cbTmpCount = 0;
                for (var cbColorIndex = 0; cbColorIndex < 4;cbColorIndex++)
                {
                    for( var cbColorCount = 0; cbColorCount < Distributing.cbDistributing[0][3 - cbColorIndex]; cbColorCount++ )
                    {
                        pSearchCardResult.cbResultCard[cbResultCount][cbCount++] = DdzModel.prototype.MakeCardData(0, 3 - cbColorIndex);

                        if( ++cbTmpCount == cbBlockCount ) break;
                    }
                    if( cbTmpCount == cbBlockCount ) break;
                }
            }

            //设置变量
            pSearchCardResult.cbCardCount[cbResultCount] = cbCount;
            cbResultCount++;
        }
    }

    if( pSearchCardResult )
        pSearchCardResult.cbSearchCount = cbResultCount;
    return cbResultCount;
};

//构造扑克
DdzModel.prototype.MakeCardData = function(cbValueIndex, cbColorIndex)
{
    return (cbColorIndex << 4) | (cbValueIndex + 1);
};

//搜索飞机
DdzModel.prototype.SearchThreeTwoLine = function(cbHandCardData, pSearchCardResult )
{
    var cbHandCardCount = DdzModel.prototype.CountArray(cbHandCardData);

    //变量定义
    var tmpSearchResult = DdzModel.prototype.MakeTagSearchCardResult();
    var tmpSingleWing = DdzModel.prototype.MakeTagSearchCardResult();
    var tmpDoubleWing = DdzModel.prototype.MakeTagSearchCardResult();
    var cbTmpResultCount = 0;

    //搜索连牌
    cbTmpResultCount = DdzModel.prototype.SearchLineCardType( cbHandCardData, 0, 3, 0, tmpSearchResult );

    if( cbTmpResultCount > 0 )
    {
        //提取带牌
        for( var i = 0; i < cbTmpResultCount; i++ )
        {
            //变量定义
            var cbTmpCardData = [];
            var cbTmpCardCount = cbHandCardCount;

            //不够牌
            if( cbHandCardCount-tmpSearchResult.cbCardCount[i] < tmpSearchResult.cbCardCount[i]/3 )
            {
                var cbNeedDelCount = 3;
                while( cbHandCardCount + cbNeedDelCount - tmpSearchResult.cbCardCount[i] < (tmpSearchResult.cbCardCount[i] - cbNeedDelCount) / 3 )
                    cbNeedDelCount += 3;
                //不够连牌
                if( (tmpSearchResult.cbCardCount[i] - cbNeedDelCount) / 3 < 2 )
                {
                    //废除连牌
                    continue;
                }

                //拆分连牌
                DdzModel.prototype.RemoveCard( tmpSearchResult.cbResultCard[i], cbNeedDelCount,tmpSearchResult.cbResultCard[i],
                    tmpSearchResult.cbCardCount[i] );
                tmpSearchResult.cbCardCount[i] -= cbNeedDelCount;
            }

            //删除连牌
            for (var j = 0; j < cbHandCardCount; j++) {
                cbTmpCardData[j] = cbHandCardData[j];
            }
            DdzModel.prototype.RemoveCard( tmpSearchResult.cbResultCard[i],tmpSearchResult.cbCardCount[i],
                cbTmpCardData,cbTmpCardCount )
            cbTmpCardCount -= tmpSearchResult.cbCardCount[i];

            //组合飞机
            var cbNeedCount = tmpSearchResult.cbCardCount[i] / 3;

            var cbResultCount = tmpSingleWing.cbSearchCount++;
            for (var j = 0; j < tmpSearchResult.cbCardCount[i]; j++) {
                tmpSingleWing.cbResultCard[cbResultCount][j] = tmpSearchResult.cbResultCard[i][j];
            }
            for (var j = 0; j < cbNeedCount; j++) {
                tmpSingleWing.cbResultCard[cbResultCount][tmpSearchResult.cbCardCount[i] + j] = cbTmpCardData[cbTmpCardCount - cbNeedCount][j];
            }
            tmpSingleWing.cbCardCount[i] = tmpSearchResult.cbCardCount[i] + cbNeedCount;

            //不够带翅膀
            if( cbTmpCardCount < tmpSearchResult.cbCardCount[i] / 3 * 2 )
            {
                var cbNeedDelCount = 3;
                while( cbTmpCardCount + cbNeedDelCount - tmpSearchResult.cbCardCount[i] < (tmpSearchResult.cbCardCount[i] - cbNeedDelCount) / 3 * 2 )
                    cbNeedDelCount += 3;
                //不够连牌
                if( (tmpSearchResult.cbCardCount[i] - cbNeedDelCount) / 3 < 2 )
                {
                    //废除连牌
                    continue;
                }

                //拆分连牌
                DdzModel.prototype.RemoveCard(  tmpSearchResult.cbResultCard[i],
                                                cbNeedDelCount,
                                                tmpSearchResult.cbResultCard[i],
                                                tmpSearchResult.cbCardCount[i] );
                tmpSearchResult.cbCardCount[i] -= cbNeedDelCount;

                //重新删除连牌
                for (var j = 0; j < cbHandCardCount; j++) {
                    cbTmpCardData[j] = cbHandCardData[j];
                }
                DdzModel.prototype.RemoveCard(  tmpSearchResult.cbResultCard[i],
                                                tmpSearchResult.cbCardCount[i],
                                                cbTmpCardData,
                                                cbTmpCardCount );
                cbTmpCardCount = cbHandCardCount-tmpSearchResult.cbCardCount[i];
            }

            //分析牌
            var TmpResult = DdzModel.prototype.MakeAnalyseResult();
            DdzModel.prototype.AnalysebCardData( cbTmpCardData, TmpResult );

            //提取翅膀
            var cbDistillCard = [];
            var cbDistillCount = 0;
            var cbLineCount = tmpSearchResult.cbCardCount[i] / 3;
            for( var j = 1; j < TmpResult.cbBlockCount.length; j++ )
            {
                if( TmpResult.cbBlockCount[j] > 0 )
                {
                    if( j + 1 == 2 && TmpResult.cbBlockCount[j] >= cbLineCount )
                    {
                        var cbTmpBlockCount = TmpResult.cbBlockCount[j];
                        for (var k = 0; k < (j + 1) * cbLineCount; k++) {
                            cbDistillCard[k] = TmpResult.cbCardData[j][(cbTmpBlockCount - cbLineCount) * (j + 1) + k];
                        }
                        cbDistillCount = (j + 1) * cbLineCount;
                        break;
                    }
                    else
                    {
                        for( var k = 0; k < TmpResult.cbBlockCount[j]; k++ )
                        {
                            var cbTmpBlockCount = TmpResult.cbBlockCount[j];
                            for (var l = 0; l < 2; l++) {
                                cbDistillCard[cbDistillCount + l] = TmpResult.cbCardData[j][(cbTmpBlockCount - k - 1) * (j + 1) + l];
                            }
                            cbDistillCount += 2;

                            //提取完成
                            if( cbDistillCount == 2*cbLineCount ) break;
                        }
                    }
                }

                //提取完成
                if( cbDistillCount == 2*cbLineCount ) break;
            }

            //提取完成
            if( cbDistillCount == 2*cbLineCount )
            {
                //复制翅膀
                cbResultCount = tmpDoubleWing.cbSearchCount++;
                for (var j = 0; j < tmpSearchResult.cbCardCount[i]; j++) {
                    tmpDoubleWing.cbResultCard[cbResultCount][j] = tmpSearchResult.cbResultCard[i][j];
                }
                for (var j = 0; j < cbDistillCount; j++) {
                    tmpDoubleWing.cbResultCard[cbResultCount][tmpSearchResult.cbCardCount[i] + j] = cbDistillCard[j];
                }
                tmpDoubleWing.cbCardCount[i] = tmpSearchResult.cbCardCount[i]+cbDistillCount;
            }
        }

        //复制结果
        for( var i = 0; i < tmpDoubleWing.cbSearchCount; i++ )
        {
            var cbResultCount = pSearchCardResult.cbSearchCount++;
            for (var j = 0; j < tmpDoubleWing.cbCardCount[i]; j++) {
                pSearchCardResult.cbResultCard[cbResultCount][j] = tmpDoubleWing.cbResultCard[i][j];
            }
            pSearchCardResult.cbCardCount[cbResultCount] = tmpDoubleWing.cbCardCount[i];
        }
        for( var i = 0; i < tmpSingleWing.cbSearchCount; i++ )
        {
            var cbResultCount = pSearchCardResult.cbSearchCount++;
            for (var j = 0; j < tmpSingleWing.cbCardCount[i]; j++) {
                pSearchCardResult.cbResultCard[cbResultCount][j] = tmpSingleWing.cbResultCard[i][j];
            }
            pSearchCardResult.cbCardCount[cbResultCount] = tmpSingleWing.cbCardCount[i];
        }
    }

    return pSearchCardResult.cbSearchCount;
};

//删除扑克
DdzModel.prototype.RemoveCard = function(cbRemoveCard, cbRemoveCount, cbCardData, cbCardCount)
{
    //定义变量
    var cbDeleteCount = 0;
    var cbTempCardData = cbCardData;

    //置零扑克
    for (var i = 0; i < cbRemoveCount; i++)
    {
        for (var j = 0; j < cbCardCount; j++)
        {
            if (cbRemoveCard[i]==cbTempCardData[j])
            {
                cbDeleteCount++;
                cbTempCardData[j]=0;
                break;
            }
        }
    }
    if (cbDeleteCount != cbRemoveCount) return false;

    //清理扑克
    var cbCardPos=0;
    for (var i = 0; i < cbCardCount; i++)
    {
        if (cbTempCardData[i] != 0) cbCardData[cbCardPos++] = cbTempCardData[i];
    }

    return true;
};

// 特殊类型排列扑克
DdzModel.prototype.SortOutCardList = function(cbCardData)
{
    var cbCardCount = DdzModel.prototype.CountArray(cbCardData);
    //获取牌型
    var cbCardType = DdzModel.prototype.GetCardType(cbCardData);

    if( cbCardType == CMD_DDZ.CT_THREE_TAKE_ONE || cbCardType == CMD_DDZ.CT_THREE_TAKE_TWO )
    {
        //分析牌
        var AnalyseResult = DdzModel.prototype.MakeAnalyseResult();
        DdzModel.prototype.AnalysebCardData( cbCardData, AnalyseResult );

        cbCardCount = AnalyseResult.cbBlockCount[2] * 3;
        for (var i = 0; i < cbCardCount; i++) {
            cbCardData[i] = AnalyseResult.cbCardData[2][i];
        }
        for( var i = AnalyseResult.cbBlockCount.length - 1; i >= 0; i-- )
        {
            if( i == 2 ) continue;

            if( AnalyseResult.cbBlockCount[i] > 0 ) {
                for (var j = 0; j < (i + 1) * AnalyseResult.cbBlockCount[i]; j++) {
                    cbCardData[cbCardCount + j] = AnalyseResult.cbCardData[i][j];
                }
                cbCardCount += (i + 1) * AnalyseResult.cbBlockCount[i];
            }
        }
    }
    else if( cbCardType == CMD_DDZ.CT_FOUR_TAKE_ONE || cbCardType == CMD_DDZ.CT_FOUR_TAKE_TWO )
    {
        //分析牌
        var AnalyseResult = DdzModel.prototype.MakeAnalyseResult();
        DdzModel.prototype.AnalysebCardData( cbCardData, AnalyseResult );

        cbCardCount = AnalyseResult.cbBlockCount[3] * 4;
        for (var i = 0; i < cbCardCount; i++) {
            cbCardData[i] = AnalyseResult.cbCardData[3][i];
        }
        for( var i = AnalyseResult.cbBlockCount.length - 1; i >= 0; i-- )
        {
            if( i == 3 ) continue;

            if( AnalyseResult.cbBlockCount[i] > 0 )
            {
                for (var j = 0; j < (i + 1) * AnalyseResult.cbBlockCount[i]; j++) {
                    cbCardData[cbCardCount + j] = AnalyseResult.cbCardData[i][j];
                }
                cbCardCount += (i + 1) * AnalyseResult.cbBlockCount[i];
            }
        }
    }

    return;
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

