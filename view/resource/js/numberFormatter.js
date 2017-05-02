var NumberFormatter = {		
		number:function(strNum){
			if (strNum.length <= 3) {
				return strNum;
			}
			if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
				return strNum;
			}
			var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
			var re = new RegExp();
			re.compile("(\\d)(\\d{3})(,|$)");
			while (re.test(b)) {
				b = b.replace(re, "$1,$2$3");
			}
			return a + "" + b + "" + c;
		}
}
