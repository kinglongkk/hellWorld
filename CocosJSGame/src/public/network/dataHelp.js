/**
 * Created by Administrator on 2017/5/16.
 */

//判断字节序
var isLittleEndian = (function() {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    return new Int16Array(buffer)[0] === 256;
})();

//创建消息包================================
var DataBuilder = cc.Class.extend({
    dataBuffer:null,
    dataView:null,
    offset:0,
    init:function(len){
        this.dataBuffer = new ArrayBuffer(len);
        this.dataView = new DataView(this.dataBuffer);
        this.offset = 0;
    },
    getData:function(){
        return this.dataBuffer;
    },
    writeDWord:function(value){
        this.dataView.setUint32(this.offset, value, isLittleEndian);
        this.offset += 4;
    },
    writeInt:function(value){
        this.dataView.setInt32(this.offset, value, isLittleEndian);
        this.offset += 4;
    },
    writeWord:function(value){
        this.dataView.setUint16(this.offset, value, isLittleEndian);
        this.offset += 2;
    },
    writeFloat:function(value){
        this.dataView.setFloat32(this.offset, value, isLittleEndian);
        this.offset += 4;
    },
    writeDouble:function(value){
        this.dataView.setFloat64(this.offset, value, isLittleEndian);
        this.offset += 8;
    },
    writeByte:function(value){
        this.dataView.setUint8(this.offset, value, isLittleEndian);
        this.offset += 1;
    },
    writeBoolean:function(value){
        var bByte = 0;
        if(value){
            bByte = 1;
        }

        this.dataView.setUint8(this.offset, bByte, isLittleEndian);
        this.offset += 1;
    },
    writeByteArray:function(value, len){
        for(var i=0; i<len; i++){
            this.dataView.setUint8(this.offset, value[i], isLittleEndian);
            this.offset += 1;
        }
    },
    writeTChar:function(value){
        this.dataView.setUint16(this.offset, value.charCodeAt(0), isLittleEndian);
        this.offset += 2;
    },
    writeTCharArray:function(value, len){
        if(cc.sys.os == cc.sys.OS_WINDOWS){
            value = MyUtil.utf8to16(value);
        }

        for (var i = 0; i < len; i++) {
            if(i < value.length){
                this.dataView.setUint16(this.offset, value.charCodeAt(i), isLittleEndian);
                this.offset += 2;
            }else{
                this.dataView.setUint16(this.offset, 0, isLittleEndian);
                this.offset += 2;
            }

        }
    },
    writeChar:function(value){
        this.dataView.setUint8(this.offset, value.charCodeAt(0), isLittleEndian);
        this.offset += 2;
    },
    writeCharArray:function(value, len){
        if(cc.sys.os == cc.sys.OS_WINDOWS){
            //value = MyUtil.utf8to16(value);
        }

        for (var i = 0; i < len; i++) {
            if(i < value.length){
                this.dataView.setUint8(this.offset, value.charCodeAt(i), isLittleEndian);
                this.offset += 1;
            }else{
                this.dataView.setUint8(this.offset, 0, isLittleEndian);
                this.offset += 1;
            }

        }
    },
    writeInt64Number:function(value){

        var dWord1 = Math.floor( value / Math.pow(2, 32) ) >>> 0;
        var dWord2 = (value % Math.pow(2, 32)) >>> 0;


        if(isLittleEndian){
            this.writeDWord(dWord2);
            this.writeDWord(dWord1);
        }else{
            this.writeDWord(dWord1);
            this.writeDWord(dWord2);
        }
    },
    //writeInt64Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
    writeInt64Buffer:function(value){
        var i;

        if(isLittleEndian){
            for(i=7; i<0; i--){
                this.writeByte(value[i]);
            }
        }else{
            for(i=0; i<8; i++){
                this.writeByte(value[i]);
            }
        }
    },
    //根据格式写入
//	[
//	 [描述,类型,值],
//	 [描述,类型,值],
//	[描述, "STRUCT", [[描述,类型,值],[描述,类型,值]]],
//	 ...
//	]
    build:function(dataArray){
        //info[0] 描述
        //info[1] 类型
        //info[2] 值
        //info[3] TCHAR_ARRAY 大小
    	cc.log("ataArray.length", dataArray.length)
        for(var i = 0; i < dataArray.length; i++){
            var info = dataArray[i];
            if(!!info){
                switch (info[1]) {
                    case "LONG":
                    case "INT":
                        this.writeInt(info[2]);
                        break;
                    case "DWORD":
                        this.writeDWord(info[2]);
                        break;
                    case "WORD":
                        this.writeWord(info[2]);
                        break;
                    case "DWORD[]":
                        for(var j=0; j<info[3]; j++){
                            this.writeDWord(info[2][j]);
                        }
                        break;
                    case "WORD[]":
                        for(var j=0; j<info[3]; j++){
                            this.writeWord(info[2][j]);
                        }
                        break;
                    case "FLOAT":
                        this.writeFloat(info[2]);
                        break;
                    case "DOUBLE":
                        this.writeDouble(info[2]);
                        break;
                    case "BYTE":
                        this.writeByte(info[2]);
                        break;
                    case "BOOL":
                    case "BOOLEAN":
                        this.writeBoolean(info[2]);
                        break;
                    case "BYTE[]":
                        cc.log(" byte ........ ")
                        this.writeByteArray(info[2], info[3]);
                        break;
                    case "TCHAR":
                        this.writeTChar(info[2]);
                        break;
                    case "TCHARS":
                        cc.log(" TCHARS ======= ", info[3])
                        this.writeTCharArray(info[2], info[3]);
                        break;
                    case "CHAR":
                        this.writeChar(info[2]);
                        break;
                    case "CHARS":
                        this.writeCharArray(info[2], info[3]);
                        break;
                    case "SCORE":
                    case "LONGLONG":
                    case "INT64_NUMBER":
                        this.writeInt64Number(info[2]);
                        break;
                    case "INT64_BUFFER":
                        this.writeInt64Buffer(info[2]);
                        break;
                    case "STRUCT":
                        this.build(info[2]);
                        break;
                    default:
                        break;
                }
            }
        }
    }
});

//消息包解析=====================================
var DataParser = cc.Class.extend({
    dataBuffer:null,
    dataView:null,
    offset:0,
    getOffset: function(){
        return this.offset;
    },

    init:function(buffer){
        this.dataBuffer = buffer;
        this.dataView = new DataView(this.dataBuffer);
        this.offset = 0;
    },
    readDWord:function(){
        var ret = this.dataView.getUint32(this.offset, isLittleEndian);
        this.offset += 4;

        return ret;
    },
    readInt:function(){
        var ret = this.dataView.getInt32(this.offset, isLittleEndian);
        this.offset += 4;

        return ret;
    },
    readWord:function(){
        var ret = this.dataView.getUint16(this.offset, isLittleEndian);
        this.offset += 2;

        return ret;
    },
    readFloat:function(){
        var ret = this.dataView.getFloat32(this.offset, isLittleEndian);
        this.offset += 4;

        return ret;
    },
    readDouble:function(){
        var ret = this.dataView.getFloat64(this.offset, isLittleEndian);
        this.offset += 8;

        return ret;
    },
    readByte:function(){
        var ret = this.dataView.getUint8(this.offset, isLittleEndian);
        this.offset += 1;

        return ret;
    },
    readBoolean: function(){
        var value = this.dataView.getUint8(this.offset, isLittleEndian);
        this.offset += 1;

        var ret = false;
        if(value == 1){
            ret = true;
        }

        return ret;
    },
    readTChar:function(){
        var value = this.dataView.getUint16(this.offset,  isLittleEndian);
        this.offset += 2;
        ret = String.fromCharCode(value);
        return ret;
    },
    readTCharArray:function(len){
        var ret = "";
        var offset = this.offset;
        for (var i = 0; i < len; i++) {
            var value = this.dataView.getUint16(offset, isLittleEndian);
            offset += 2;
            if(value != 0){
                if(cc.sys.os == cc.sys.OS_WINDOWS){
                    ret += MyUtil.utf16to8(String.fromCharCode(value));
                }else{
                    ret += String.fromCharCode(value);
                }
            }else{
                break;
            }
        }
        this.offset += len * 2;
        return ret;
    },

    readInt64Number:function(){
        var ret = 0;

        var dWord1 = this.readDWord();
        var dWord2 = this.readDWord();

        if(isLittleEndian){
            //负数
            if(dWord2 >= 0x80000000){
                dWord1 = ~dWord1;
                dWord1 = dWord1 >>> 0 ;
                dWord2 = ~dWord2;

                ret = 0 - (dWord2 * Math.pow(2, 32) + dWord1 + 1);
            }else{
                ret = dWord2 * Math.pow(2, 32) + dWord1;
            }
        }else{
            //负数
            if(dWord1 >= 0x80000000){
                dWord1 = ~dWord1;
                dWord2 = ~dWord2;
                dWord2 = dWord2 >>> 0 ;
                ret = 0 - (dWord1 * Math.pow(2, 32) + dWord2 + 1);
            }else{
                ret = dWord1 * Math.pow(2, 32) + dWord2;
            }
        }

        return ret;
    },
    //return [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]
    readInt64Buffer:function(){
        var rets = [];
        var i;

        for(i=0; i<8; i++){
            var ret = this.readByte();

            if(isLittleEndian){
                rets.unshift(ret);
            }else{
                rets.push(ret);
            }
        }

        return rets;
    },

    readByteArray: function(len){
        var ret = [];

        var i;
        for(i=0; i<len; i++){
            ret[i] = this.readByte();
        }

        return ret;
    },

    readByteArray2: function(len1, len2){
        var ret = [];

        var i;
        var j;
        for(i=0; i<len1; i++){
            ret[i] = [];

            for(j=0; j<len2; j++){
                ret[i][j] = this.readByte();
            }
        }

        return ret;
    },
    
    readIntArray2: function(len1, len2){
    	var ret = [];

    	var i;
    	var j;
    	for(i=0; i<len1; i++){
    		ret[i] = [];

    		for(j=0; j<len2; j++){
    			ret[i][j] = this.readInt();
    		}
    	}

    	return ret;
    },

    readInt64NumberArray: function(len){
        var ret = [];

        var i;
        for(i=0; i<len; i++){
            ret[i] = this.readInt64Number();
        }

        return ret;
    },

    //根据格式解析
//	[
//	[key,类型,数组大小],
//	[key,类型,数组大小],
    //嵌套结构体
//	[key, "STRUCT", [[key,类型,数组大小],[key,类型,数组大小]]],
//	...
//	]
    parse: function(structArray){
        var parseData = {};

        //info[0] key
        //info[1] 类型
        //info[2] 数组大小
        for(var i = 0; i < structArray.length; i++){
            var info = structArray[i];
            if(!!info){
                switch (info[1]) {
                    case "LONG":
                    case "INT":
                        parseData[info[0]] = this.readInt();
                        break;
                    case "DWORD":
                        parseData[info[0]] = this.readDWord();
                        break;
                    case "WORD":
                        parseData[info[0]] = this.readWord();
                        break;
                    case "FLOAT":
                        parseData[info[0]] = this.readFloat();
                        break;
                    case "FLOAT[]":
                        parseData[info[0]] = [];
                        for(var j=0; j<info[2]; j++){
                            parseData[info[0]][j] = this.readFloat();
                        }
                        break;
                    case "DOUBLE":
                        parseData[info[0]] = this.readDouble();
                        break;
                    case "INT[]":
                        parseData[info[0]] = [];
                        for(var j=0; j<info[2]; j++){
                            parseData[info[0]][j] = this.readInt();
                        }
                        break;
                    case "INT[][]":
                    	parseData[info[0]] = this.readIntArray2(info[2], info[3]);
                    	break;
                    case "DWORD[]":
                        parseData[info[0]] = [];
                        for(var j=0; j<info[2]; j++){
                            parseData[info[0]][j] = this.readDWord();
                        }
                        break;
                    case "WORD[]":
                        parseData[info[0]] = [];
                        for(var j=0; j<info[2]; j++){
                            parseData[info[0]][j] = this.readWord();
                        }
                        break;
                    case "BYTE":
                        parseData[info[0]] = this.readByte();
                        break;
                    case "BOOL":
                    case "BOOLEAN":
                        parseData[info[0]] = this.readBoolean();
                        break;
                    case "BOOL[]":
                    case "BOOLEAN[]":
                        parseData[info[0]] = [];
                        for(var j=0; j<info[2]; j++){
                            parseData[info[0]][j] = this.readBoolean();
                        }
                        break;
                    case "BYTE[]":
                        parseData[info[0]] = this.readByteArray(info[2]);
                        break;
                    case "BYTE[][]":
                        parseData[info[0]] = this.readByteArray2(info[2], info[3]);
                        break;
                    case "TCHAR":
                        parseData[info[0]] = this.readTChar();
                        break;
                    case "TCHARS":
                        parseData[info[0]] = this.readTCharArray(info[2]);
                        break;
                    case "TCHARS[]":
                        parseData[info[0]] = [];
                        for(var j=0; j<info[2]; j++){
                            parseData[info[0]][j] = this.readTCharArray(info[3]);
                        }
                        break;
                    case "SCORE":
                    case "LONGLONG":
                    case "INT64_NUMBER":
                        parseData[info[0]] = this.readInt64Number();
                        break;
                    case "SCORE[]":
                    case "LONGLONG[]":
                    case "INT64_NUMBER[]":
                        parseData[info[0]] = this.readInt64NumberArray(info[2]);
                        break;
                    case "INT64_BUFFER":
                        parseData[info[0]] = this.readInt64Buffer();
                        break;
                    case "STRUCT":
                        parseData[info[0]] = this.parse(info[2]);
                        break;
                    case "STRUCT[]":
                        parseData[info[0]] = [];
                        for(var j=0; j<info[3]; j++){
                            parseData[info[0]][j] = this.parse(info[2]);
                        }
                        break;
                    case "STRUCT[][]":
                        parseData[info[0]] = [];
                        for(var j=0; j<info[3]; j++){
                            parseData[info[0]][j] = [];
                            for(var k=0; k<info[4]; k++){
                                parseData[info[0]][j][k] = this.parse(info[2]);
                            }
                        }
                        break;
                    case "SYSTEMTIME":
                        parseData[info[0]] = this.parse([
                            ["wYear", "WORD"],
                            ["wMonth", "WORD"],
                            ["wDayOfWeek", "WORD"],
                            ["wDay", "WORD"],
                            ["wHour", "WORD"],
                            ["wMinute", "WORD"],
                            ["wSecond", "WORD"],
                            ["wMilliseconds", "WORD"]
                        ]);
                        break;
                    default:
                        break;
                }
            }
        }

        return parseData;
    },
});