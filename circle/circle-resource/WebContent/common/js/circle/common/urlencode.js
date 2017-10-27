/**
 * URL 格式转换
 */
function UrlEncode(str){ 
	var hex='';
	var i,t;
	for (i=0; i<str.length; i++){
		t = hexfromdec( str.charCodeAt(i) );
		if (t=='25')
			t='';
		hex += '%' + t;
	}
	return hex;
}
function hexfromdec(num){
	if (num > 65535) { return ("err!"); }
	first = Math.round(num/4096 - .5);
	temp1 = num - first * 4096;
	second = Math.round(temp1/256 -.5);
	temp2 = temp1 - second * 256;
	third = Math.round(temp2/16 - .5);
	fourth = temp2 - third * 16;
	return (""+getletter(third)+getletter(fourth));
}
function getletter(num) {
	if (num < 10)
		return num;
	else {
		if (num == 10) { return "A"; }
		if (num == 11) { return "B"; }
		if (num == 12) { return "C"; }
		if (num == 13) { return "D"; }
		if (num == 14) { return "E"; }
		if (num == 15) { return "F"; }
	}
}