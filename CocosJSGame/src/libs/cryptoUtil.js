var CryptoUtil = CryptoUtil || {};
CryptoUtil.md5 = function (data) {
	var data = CryptoJS.enc.Utf8.parse(data);
    return CryptoJS['MD5'](data).toString(CryptoJS['enc']['Hex']);
};

CryptoUtil.sha256 = function (data) {
    return CryptoJS['SHA256'](data).toString(CryptoJS['enc']['Hex']);
};

CryptoUtil.base64_encode = function (sContent) {
	var str = CryptoJS.enc.Utf8.parse(sContent);
	var base64 = CryptoJS.enc.Base64.stringify(str);
	return(base64);
};

CryptoUtil.base64_decode = function (str) {
	var words = CryptoJS.enc.Base64.parse(str);
	return words.toString(CryptoJS.enc.Utf8);
};

/*
"src/public/libs/CryptoJS/rollups/aes.js",
var pwd = "我的密码";

var mi=CryptoJS.AES.encrypt("你好，欢迎来到开源中国在线工具，这是一个AES加密测试",pwd);
cc.log("你好，欢迎来到开源中国在线工具，这是一个AES加密测试----密文:"+mi);

var result=CryptoJS.AES.decrypt(mi,pwd).toString(CryptoJS.enc.Utf8);

cc.log("解密结果："+result);
*/