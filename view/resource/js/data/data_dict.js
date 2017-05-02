// initCarBrand(".brandName_sel", null);

/**
 * 字典
 * 
 */
function initSystemDict(targetObject, codeType) {
	// 
	$.ajax({
		url : requestContextPath + "/common/getDictList.html",
		data : {
			codeType : codeType,
			pageSize : 10000,
			curPage : 1
		},
		dataType : "json",
		success : function(data) {
			var comboOptions = "";
			if (data.total > 0) {
				var total = data.total;
				var items = data.data;
				for (var i = 0; i < total; i++) {
					comboOptions += "<option  value='" + items[i]["mainItem"]
							+ "'>" + items[i]["mainItem"] + "</option>"; // 使用全部小写，具体查看jquery
					// .data
				}
			}
			$(targetObject).html(comboOptions).multiselect('refresh');
		}
	});
}

function selectedSystemDict(targetObject, codeType, selectedValue) {
	// 
	$.ajax({
		url : requestContextPath + "/common/getDictList.html",
		data : {
			codeType : codeType,
			status : 1,
			pageSize : 10000,
			curPage : 1
		},
		dataType : "json",
		success : function(data) {
			var comboOptions = "";
			if (data.total > 0) {
				var total = data.total;
				var items = data.data;
				for (var i = 0; i < total; i++) {
					if (selectedValue != null
							&& selectedValue == items[i]["mainItem"]) {
						comboOptions += "<option  value='"
								+ items[i]["mainItem"] + "' selected >"
								+ items[i]["mainItem"] + "</option>"; // 使用全部小写，具体查看jquery
						// .data
						$("#select2-" + targetObject + "-container").html(
								selectedValue);
					} else {
						comboOptions += "<option  value='"
								+ items[i]["mainItem"] + "'>"
								+ items[i]["mainItem"] + "</option>"; // 使用全部小写，具体查看jquery
						// .data
					}

				}
			}
			$("#" + targetObject).html(comboOptions).multiselect('refresh');
		}
	});
}

// 增加字典字段
function addSimpleDict(parentCode, codeType, mainItem) {
	Util.ajax({
		type : "POST",
		url : requestContextPath + "/common/addSimpleDict.html",
		data : {
			parentCode : parentCode,
			codeType : codeType,
			mainItem : mainItem,
			description : ' ',
			subItem : '',
		},
		dataType : 'json',
		success : function(data) {
			if (data.success) {
				$.msgbox.show({
					'type' : 'info',
					'text' : data.message,
					'title' : '成功'
				});
			} else {
				$.msgbox.show({
					'type' : 'error',
					'text' : data.message,
					'title' : '错误'
				});
			}
		}
	}, "提交中");
}
