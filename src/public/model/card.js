var Card = cc.Class.extend({
    getContent: function () {

    }
});

var PokerCard = Card.extend({
    _cardValue: 0,

    setValue: function (value) {
        if (this.isValidValue(value)) {
            this._cardValue = value;
        }
    },
    getValue: function () {
        return this._cardValue;
    },
    getSuitValue: function () {
    	return this._cardValue & 0xF0;
    },
    getRankValue: function () {
        return this._cardValue & 0x0F;
    },
    isValidValue: function (value) {
        return true;
    },
    getContent: function () {
        return PokerCard.SuitTypes[this.getSuitValue()] + PokerCard.RankTypes[this.getRankValue() - 1];
    },

    equals: function (anotherCard) {
        return this.getValue() == anotherCard.getValue();
    }
});
//类成员
//公认的扑克花色大小: 黑桃 >　红桃 > 梅花 >　方片
PokerCard.SuitTypes = ['♦', '♣', '♥', '♠', 'Joker'];
PokerCard.RankTypes = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
//类函数
PokerCard.create = function (suitOrValue, rank) {
    var card = new PokerCard();
    if (!!card && suitOrValue != null) {
        if (!!rank) {
            card.setValue(suitOrValue * 0x10 + rank);
        }
        else {
            card.setValue(suitOrValue);
        }

        return card;
    }
    return null;
};

PokerCard.createCards = function (arr) {
    var cards = [];
    var str = "#### PokerCard.createCards = ";
    for (var idx in arr) {
        var card = PokerCard.create(arr[idx]);
        if (card) {
            cards.push(card);
            
            str += card.getContent();
            str += " ";
        }
    }
    
    //cc.log(str);
    
    return cards;
};
