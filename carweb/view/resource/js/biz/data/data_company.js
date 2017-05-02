// initCarBrand(".brandName_sel", null);

/**
 * 机构
 * 
 */
function initCompany(targetObject, clientProp) {
	// 
	$.ajax({
		url : requestContextPath + "/company/getCompanyList.html",
		data : {
			clientProp : clientProp,
			pageSize : 10000,
			curPage : 1
		},
		dataType : "json",
		success : function(data) {
			var comboOptions = "<option value='' selected>请选择单位</option>";
			if (data.total > 0) {
				var total = data.total;
				var items = data.data;
				for (var i = 0; i < total; i++) {
					comboOptions += "<option  value='" + items[i].id + "'>"
							+ items[i].companyName + "</option>"; // 使用全部小写，具体查看jquery
					// .data
				}
			}
			$(targetObject).html(comboOptions).multiselect('refresh');
		}
	});
}

/**
 * 机构
 * 
 */
function initUserCompany(targetObject, clientProp) {
	// 
	$.ajax({
		url : requestContextPath + "/company/getUserCompanyList.html",
		data : {
			clientProp : clientProp,
			pageSize : 10000,
			curPage : 1
		},
		dataType : "json",
		success : function(data) {
			var comboOptions = "<option value='' selected>请选择单位</option>";
			if (data.total > 0) {
				var total = data.total;
				var items = data.data;
				for (var i = 0; i < total; i++) {
					comboOptions += "<option  value='" + items[i].id + "'>"
							+ items[i].companyName + "</option>"; // 使用全部小写，具体查看jquery
					// .data
				}
			}
			$(targetObject).html(comboOptions).multiselect('refresh');
		}
	});
}

function selectedCompany(targetObject, clientProp, selectedValue) {
	// 
	$.ajax({
		url : requestContextPath + "/company/getCompanyList.html",
		data : {
			clientProp : clientProp,
			pageSize : 10000,
			curPage : 1
		},
		dataType : "json",
		success : function(data) {
			var comboOptions = "<option value=''>请选择单位</option>";
			if (data.total > 0) {
				var total = data.total;
				var items = data.data;
				for (var i = 0; i < total; i++) {
					if (selectedValue != null
							&& selectedValue == items[i]["id"]) {
						comboOptions += "<option  value='" + items[i].id
								+ "' selected >" + items[i].companyName
								+ "</option>"; // 使用全部小写，具体查看jquery
						// .data
						$("#select2-" + targetObject + "-container").html(
								items[i].companyName);
					} else {
						comboOptions += "<option  value='" + items[i].id + "'>"
								+ items[i].companyName + "</option>"; // 使用全部小写，具体查看jquery
						// .data
					}

				}
			}
			$("#" + targetObject).html(comboOptions).multiselect('refresh');
		}
	});
}

function selectedUserCompany(targetObject, selectedValue) {
	// 
	$.ajax({
		url : requestContextPath + "/company/getUserCompanyList.html",
		data : {
			pageSize : 10000,
			curPage : 1
		},
		dataType : "json",
		success : function(data) {
			var comboOptions = "<option value=''>请选择单位</option>";
			if (data.total > 0) {
				var total = data.total;
				var items = data.data;
				for (var i = 0; i < total; i++) {
					if (selectedValue != null
							&& selectedValue == items[i]["id"]) {
						comboOptions += "<option  value='" + items[i].id
								+ "' selected >" + items[i].companyName
								+ "</option>"; // 使用全部小写，具体查看jquery
						// .data
						$("#select2-" + targetObject + "-container").html(
								items[i].companyName);
					} else {
						comboOptions += "<option  value='" + items[i].id + "'>"
								+ items[i].companyName + "</option>"; // 使用全部小写，具体查看jquery
						// .data
					}

				}
			}
			$("#" + targetObject).html(comboOptions).multiselect('refresh');
		}
	});
}
