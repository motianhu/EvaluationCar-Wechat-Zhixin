// selectedCarSet(".carSetName_sel", null);

/**
 * 初始化汽车车系
 * 
 */
function selectedCarSet(targetObject, carBrandId, selectedValue) {
	// 获取推广渠道类型和渠道大类
	if (carBrandId == null || carBrandId == undefined || carBrandId.length <= 0) {
		return;
	}
	$.ajax({
		url : requestContextPath + "/common/getCarSetCommonList.html",
		data : {
			carBrandId : carBrandId,
			pageSize : 10000,
			curPage : 1
		},
		dataType : "json",
		success : function(data) {
			var comboOptions = "<option value=''>请选择车系</option>";
			if (data.total > 0) {
				var total = data.total;
				var items = data.data;
				for (var i = 0; i < total; i++) {
					if (selectedValue != null
							&& selectedValue == items[i]["id"]) {
						comboOptions += "<option  value='" + items[i]["id"]
								+ "' selected>" + items[i]["carSetName"]
								+ "</option>"; // 使用全部小写，具体查看jquery
						// .data
						$("#select2-" + targetObject + "-container").html(
								items[i]["carSetName"]);
					} else {
						comboOptions += "<option  value='" + items[i]["id"]
								+ "'>" + items[i]["carSetName"] + "</option>"; // 使用全部小写，具体查看jquery
						// .data
					}
				}
			}
			$("#" + targetObject).html(comboOptions).multiselect('refresh');
		}
	});
}

// 增加字典字段
function addCarSet(carBrandId, carSetName, carSetObject) {
	var pinyin = "";
	if (carSetName != null && carSetName.length > 0) {
		pinyin = Util.getChineseCharacterPinyin(carSetName);
		pinyin = pinyin.toUpperCase();
		pinyin = pinyin.substr(0, 1);
	}
	var carSetFirstName = pinyin || '';
	Util.ajax({
		type : "POST",
		url : requestContextPath + "/carSet/addCarSet.html",
		data : {
			carBrandId : carBrandId,
			carSetName : carSetName,
			carSetFirstName : carSetFirstName,
		},
		dataType : 'json',
		success : function(data) {
			if (data.success) {
				$(carSetObject).attr('carSetId', data.object);
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
