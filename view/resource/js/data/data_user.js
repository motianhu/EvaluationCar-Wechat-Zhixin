var autoUserList = [];
getAutoUserList();
function getAutoUserList() {
	$.ajax({
		type : "POST",
		url : requestContextPath + "/user/getAutoUserList.html",
		dataType : "json",
		success : function(data) {
			for (i in data) {
				autoUserList.push(data[i]['englishName'] + "("
						+ data[i]['chineseName'] + ")");
			}
		}
	});
}

function getIdAutoComplete(idNames) {
	var ids = '';
	var arrayStr = idNames.split(","); // 字符分割
	var itemStr = null;
	for (i = 0; i < arrayStr.length; i++) {
		itemStr = arrayStr[i].split("("); // 字符分割
		if (itemStr[0] != null && itemStr[0].length > 0) {
			ids = ids + ',' + itemStr[0];
		}
	}
	if (ids != null && ids.length > 0) {
		ids = ids.substring(1, ids.length);
	}
	return ids;
}