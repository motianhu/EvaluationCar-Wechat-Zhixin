// 更新工作区审批计数
function decIframeWorkSpaceCount(workId, mainframeDom) {
	// 获取主页
	var homeObj = $("#fastweb_tab_Home", mainframeDom).contents()[0];
	var workObj = $(homeObj).find(workId);
	var count = workObj.text();
	var intCount = parseInt(count, 0);
	workObj.text(intCount - 1);
}

// 更新菜单审批计数 -1
function decParentMenuCount(meunId, mainframeDom) {
	// eg decParentMenuCount("#csCount")
	var menuObj = $(meunId, mainframeDom);
	var showCount = menuObj.text();
	var intShowCount = parseInt(showCount, 0);
	menuObj.text(intShowCount - 1);
}

// 判断日期
function isNormalDate(intYear, intMonth, intDay) {
	if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay))
		return false;
	if (intMonth > 12 || intMonth < 1)
		return false;
	if (intDay < 1 || intDay > 31)
		return false;
	if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11)
			&& (intDay > 30))
		return false;
	if (intMonth == 2) {
		if (intDay > 29)
			return false;
		if ((((intYear % 100 == 0) && (intYear % 400 != 0)) || (intYear % 4 != 0))
				&& (intDay > 28))
			return false;
	}
	return true;
}

// 检查日期YYYY-MM-DD格式
function isFormateDate(formatDate) {
	var reg = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
	var r = formatDate.match(reg);
	if (r == null)
		return false;
	r[2] = r[2] - 1;
	var d = new Date(r[1], r[2], r[3]);
	if (d.getFullYear() != r[1])
		return false;
	if (d.getMonth() != r[2])
		return false;
	if (d.getDate() != r[3])
		return false;
	return true;
}

function formateDate(dateValue) {
	if (dateValue == null || dateValue.length <= 0) {
		return;
	}
	var r = new Array();
	if (dateValue.length == 8) {
		r.push(dateValue.substring(0, 4));
		r.push('-' + dateValue.substring(4, 6));
		r.push('-' + dateValue.substring(6, 8));
	} else if (dateValue.length == 7) {
		r.push(dateValue.substring(0, 4));
		r.push('-0' + dateValue.substring(4, 5));
		r.push('-' + dateValue.substring(5, 7));
	} else if (dateValue.length == 6) {
		r.push(dateValue.substring(0, 4));
		r.push('-0' + dateValue.substring(4, 5));
		r.push('-0' + dateValue.substring(5, 6));
	}
	var formatDate = r[0] + r[1] + r[2];
	return formatDate;
}
