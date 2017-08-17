var MyUtil = MyUtil || (function () {

	var myUtil = {};

	//数字转中文大写
	myUtil.numberToStrMoney = function(number){
		var ary0 = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
		var ary1 = ["", "拾", "佰", "仟"];
		var ary2 = ["", "万", "亿", "兆"];
		
		var strNumber = number + "";
		
		var ary = [];
		for (var i = strNumber.length; i >= 0; i--) {
			ary.push(strNumber[i]);
		}
		ary = ary.join("");

		var zero = "";
		var newary = "";
		var i4 = -1;
		for (var i = 0; i < ary.length; i++) {
			if (i % 4 == 0) { //首先判断万级单位，每隔四个字符就让万级单位数组索引号递增
				i4++;
				newary = ary2[i4] + newary; //将万级单位存入该字符的读法中去，它肯定是放在当前字符读法的末尾，所以首先将它叠加入$r中，
				zero = ""; //在万级单位位置的“0”肯定是不用的读的，所以设置零的读法为空

			}
			//关于0的处理与判断。
			if (ary[i] == '0') { //如果读出的字符是“0”，执行如下判断这个“0”是否读作“零”
				switch (i % 4) {
					case 0:
						break;
						//如果位置索引能被4整除，表示它所处位置是万级单位位置，这个位置的0的读法在前面就已经设置好了，所以这里直接跳过
					case 1:
					case 2:
					case 3:
						if (ary[i - 1] != '0') {
							zero = "零"
						}
						; //如果不被4整除，那么都执行这段判断代码：如果它的下一位数字（针对当前字符串来说是上一个字符，因为之前执行了反转）也是0，那么跳过，否则读作“零”
						break;
				}

				newary = zero + newary;
				zero = '';
			}
			else { //如果不是“0”
				newary = ary0[parseInt(ary[i])] + ary1[i % 4] + newary; //就将该当字符转换成数值型,并作为数组ary0的索引号,以得到与之对应的中文读法，其后再跟上它的的一级单位（空、十、百还是千）最后再加上前面已存入的读法内容。
			}

		}
		if (newary.indexOf("零") == 0) {
			newary = newary.substr(1);
		}//处理前面的0
		
		return newary;
	};

	//数字每3位用逗号隔开
	myUtil.numberAddCommas = function(nStr) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	};
	
	//检测数字字符串
	myUtil.checkNumStr = function(str) {
		var Regx = /^[0-9]*$/;
		if (Regx.test(str)) {
			return true;
		}
		else {
			return false;
		}
	};
	
	myUtil.utf16to8 = function (str) {
		var out, i, len, c;

		out = "";
		len = str.length;
		for(i = 0; i < len; i++) {   c = str.charCodeAt(i);   if ((c >= 0x0001) && (c <= 0x007F)) {       out += str.charAt(i);   } else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
		}
		return out;
	};

	myUtil.utf8to16 = function (str) {
		var out, i, len, c;
		var char2, char3;

		out = "";
		len = str.length;
		i = 0;
		while(i < len) {   c = str.charCodeAt(i++);   switch(c >> 4)
		{
		case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			// 0xxxxxxx
			out += str.charAt(i-1);
			break;
		case 12: case 13:
			// 110x xxxx   10xx xxxx
			char2 = str.charCodeAt(i++);
			out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
			break;
		case 14:
			// 1110 xxxx  10xx xxxx  10xx xxxx
			char2 = str.charCodeAt(i++);
			char3 = str.charCodeAt(i++);
			out += String.fromCharCode(((c & 0x0F) << 12) |
					((char2 & 0x3F) << 6) |
					((char3 & 0x3F) << 0));
			break;
		}
		}

		return out;
	};
	
	myUtil.strCut = function (str, len, hasDot) {
		var newLength = 0;
	    var newStr = "";
	    var chineseRegex = /[^\x00-\xff]/g;
	    var singleChar = "";
	    var strLength = str.replace(chineseRegex,"**").length;
	    for(var i = 0;i < strLength;i++)
	    {
	        singleChar = str.charAt(i).toString();
	        if(singleChar.match(chineseRegex) != null)
	        {
	            newLength += 3;
	        }
	        else
	        {
	            newLength++;
	        }
	        if(newLength > len)
	        {
	            break;
	        }
	        newStr += singleChar;
	    }

	    if(hasDot && strLength > len)
	    {
	        newStr += "...";
	    }
	    return newStr;
		/*
		var strTemp = "";
		
		if(cc.sys.os == cc.sys.OS_WINDOWS){
			var strUtf16 = myUtil.utf8to16(str);
			var len16 = strUtf16.length;

			var strUtf8 = "";
			var strTemp16 = "";
			for(var i=0; i<len16; i++){
				strTemp16 = strUtf16.slice(0, i);
				strUtf8 = myUtil.utf16to8(strTemp16);
				if(strUtf8.length > len){
					break;
				}

				strTemp = strUtf8;
			}
		}else{
			strTemp = str;
			var lenStr = strTemp.length;
			if(len > lenStr){
				len = lenStr;
			}
			strTemp = strTemp.slice(0, len-1);
		}
		
		strTemp = strTemp + "...";
		
		return strTemp;
		*/
	};
        myUtil.getStrLen = function (str) {
            var newLength = 0;
            var newStr = "";
            var chineseRegex = /[^\x00-\xff]/g;
            var singleChar = "";
            var strLength = str.replace(chineseRegex,"**").length;
            for(var i = 0;i < strLength;i++)
            {
                singleChar = str.charAt(i).toString();
                if(singleChar.match(chineseRegex) != null)
                {
                    newLength += 2;
                }
                else
                {
                    newLength++;
                }
            }

            return newLength;

        };
	
	return myUtil;
}());

//cc.log("k-------------" + MyUtil.numberToStrMoney(234234123));
//cc.log("numberAddCommas test: " + MyUtil.numberAddCommas(23423412323));