// initCarBrand(".brandName_sel", null);

/**
 * 初始化汽车品牌
 * 
 */
function initCarBrand(targetObject) {
	// 
	$.ajax({
		url : requestContextPath + "/common/getCarBrandCommonList.html",
		data : {
			pageSize : 10000,
			curPage : 1
		},
		dataType : "json",
		success : function(data) {
			var comboOptions = "<option value='' selected>请选择品牌</option>";
			if (data.total > 0) {
				var total = data.total;
				var items = data.data;
				for (var i = 0; i < total; i++) {
					comboOptions += "<option  value='" + items[i]["id"] + "'>"
							+ items[i]["brandName"] + "</option>"; // 使用全部小写，具体查看jquery
					// .data
				}
			}
			$(targetObject).html(comboOptions).multiselect('refresh');
		}
	});
}

function selectedCarBrand(targetObject, selectedValue) {
	// 
	$.ajax({
		url : requestContextPath + "/common/getCarBrandCommonList.html",
		data : {
			pageSize : 10000,
			curPage : 1
		},
		dataType : "json",
		success : function(data) {
			var comboOptions = "<option value=''>请选择品牌</option>";
			if (data.total > 0) {
				var total = data.total;
				var items = data.data;
				for (var i = 0; i < total; i++) {
					if (selectedValue != null
							&& selectedValue == items[i]["id"]) {
						comboOptions += "<option  value='" + items[i]["id"]
								+ "' selected >" + items[i]["brandName"]
								+ "</option>"; // 使用全部小写，具体查看jquery
						// .data
						$("#select2-" + targetObject + "-container").html(
								items[i]["brandName"]);
					} else {
						comboOptions += "<option  value='" + items[i]["id"]
								+ "'>" + items[i]["brandName"] + "</option>"; // 使用全部小写，具体查看jquery
						// .data
					}

				}
			}
			$("#" + targetObject).html(comboOptions).multiselect('refresh');
		}
	});
}

// 增加字典字段
function addCarBrand(brandName, brandObject) {
	var pinyin = "";
	if (brandName != null && brandName.length > 0) {
		pinyin = Util.getChineseCharacterPinyin(brandName);
		pinyin = pinyin.toUpperCase();
		pinyin = pinyin.substr(0, 1);
	}
	var brandFirstName = pinyin || '';
	Util.ajax({
		type : "POST",
		url : requestContextPath + "/carBrand/addCarBrand.html",
		data : {
			brandName : brandName,
			brandFirstName : brandFirstName,
		},
		dataType : 'json',
		success : function(data) {
			if (data.success) {
				$(brandObject).attr('brandId', data.object);
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
