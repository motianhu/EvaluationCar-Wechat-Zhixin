// selectedCarType(".carTypeName_sel", null);

/**
 * 初始化汽车车型
 * 
 */
function selectedCarType(targetObject, carBrandId, carSetId, selectedValue) {
	// 获取推广渠道类型和渠道大类
	if (carBrandId == null || carBrandId == undefined || carBrandId.length <= 0
			|| carSetId == null || carSetId == undefined
			|| carSetId.length <= 0) {
		return;
	}
	$.ajax({
		url : requestContextPath + "/common/getCarTypeCommonList.html",
		data : {
			carBrandId : carBrandId,
			carSetId : carSetId,
			pageSize : 10000,
			curPage : 1
		},
		dataType : "json",
		success : function(data) {
			var comboOptions = "<option value=''>请选择车型</option>";
			if (data.total > 0) {
				var total = data.total;
				var items = data.data;
				for (var i = 0; i < total; i++) {
					if (selectedValue != null
							&& selectedValue == items[i]["id"]) {
						comboOptions += "<option  value='" + items[i]["id"]
								+ "' selected>" + items[i]["carTypeName"]
								+ "</option>"; // 使用全部小写，具体查看jquery
						// .data
						$("#select2-" + targetObject + "-container").html(
								items[i]["carTypeName"]);
					} else {
						comboOptions += "<option  value='" + items[i]["id"]
								+ "'>" + items[i]["carTypeName"] + "</option>"; // 使用全部小写，具体查看jquery
						// .data
					}
				}
			}
			$("#" + targetObject).html(comboOptions).multiselect('refresh');
		}
	});
}

// 增加字典字段
function addCarType(carBrandId, carSetId, carTypeName, carTypeObject) {
	var highPrice = 0;
	var lowPrice = 0;
	Util.ajax({
		type : "POST",
		url : requestContextPath + "/carType/addCarType.html",
		data : {
			carBrandId : carBrandId,
			carSetId : carSetId,
			carTypeName : carTypeName,
			highPrice : highPrice,
			lowPrice : lowPrice,
		},
		dataType : 'json',
		success : function(data) {
			if (data.success) {
				$(carTypeObject).attr('carTypeId', data.object);
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