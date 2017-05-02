/**
 * 初始化省份
 * 
 */
function initProvince(provinceSelectId, selectedValue) {
	// 获取推广渠道类型和渠道大类
	$
			.ajax({
				url : requestContextPath + "/common/getDictList.html",
				data : {
					codeType : '省份',
					pageSize : 10000,
					curPage : 1
				},
				dataType : "json",
				success : function(data) {
					var comboOptions = "<option value=''>请选择省份</option>";
					if (data.total > 0) {
						var total = data.total;
						var items = data.data;
						for (var i = 0; i < total; i++) {
							if (selectedValue != null
									&& selectedValue == items[i]["code"]) {
								comboOptions += "<option  value='"
										+ items[i]["code"] + "' selected>"
										+ items[i]["mainItem"] + "</option>"; // 使用全部小写，具体查看jquery
								$("#select2-" + provinceSelectId + "-container")
										.html(items[i]["mainItem"]);
							} else {
								comboOptions += "<option  value='"
										+ items[i]["code"] + "'>"
										+ items[i]["mainItem"] + "</option>"; // 使用全部小写，具体查看jquery
							}

							// .data
						}
					}
					$("#" + provinceSelectId).html(comboOptions).multiselect(
							'refresh');
				}
			});
}

// 省份改变事件
function changeSelectProvince(thisObject, citySelectId, districtSelectId,
		streetId) {

	$("#select2-" + citySelectId + "-container").html('请选择城市');
	$("#select2-" + districtSelectId + "-container").html('请选择地区');
	$("#" + streetId).val('');

	var $this = $(thisObject);
	var provinceId = $this.val();

	if (provinceId) {
		// 获取推广渠道类型和渠道大类
		$
				.ajax({
					url : requestContextPath + "/common/getDictList.html",
					data : {
						parentCode : provinceId,
						pageSize : 10000,
						curPage : 1
					},
					dataType : "json",
					success : function(data) {
						var comboOptions = "<option value='' selected>请选择城市</option>";
						if (data.total > 0) {
							var total = data.total;
							var items = data.data;
							for (var i = 0; i < total; i++) {
								comboOptions += "<option value='"
										+ items[i]["code"] + "'>"
										+ items[i]["mainItem"] + "</option>"; //
							}
						}
						$("#" + citySelectId).html(comboOptions).multiselect(
								'refresh');
					}
				});
	}
}

function initCity(provinceValue, citySelectId, selectedValue) {
	if (provinceValue) {
		// 获取推广渠道类型和渠道大类
		$
				.ajax({
					url : requestContextPath + "/common/getDictList.html",
					data : {
						parentCode : provinceValue,
						pageSize : 10000,
						curPage : 1
					},
					dataType : "json",
					success : function(data) {
						var comboOptions = "<option value=''>请选择城市</option>";
						if (data.total > 0) {
							var total = data.total;
							var items = data.data;
							for (var i = 0; i < total; i++) {
								if (selectedValue != null
										&& selectedValue == items[i]["code"]) {
									comboOptions += "<option value='"
											+ items[i]["code"] + "' selected>"
											+ items[i]["mainItem"]
											+ "</option>"; //

									$("#select2-" + citySelectId + "-container")
											.html(items[i]["mainItem"]);
								} else {
									comboOptions += "<option value='"
											+ items[i]["code"] + "'>"
											+ items[i]["mainItem"]
											+ "</option>"; //	
								}
							}
						}
						$("#" + citySelectId).html(comboOptions).multiselect(
								'refresh');
					}
				});
	}
}

// 城市改变事件
function changeSelectCity(thisObject, districtSelectId, streetId) {
	// debugger;

	$("#select2-" + districtSelectId + "-container").html('请选择地区');
	$("#" + streetId).val('');

	var $this = $(thisObject);
	var cityId = $this.val();

	if (cityId) {
		// 获取推广渠道类型和渠道大类
		$.ajax({
			url : requestContextPath + "/common/getDictList.html",
			data : {
				parentCode : cityId,
				pageSize : 10000,
				curPage : 1
			},
			dataType : "json",
			success : function(data) {
				var comboOptions = "<option value='' selected>请选择地区</option>";
				if (data.total > 0) {
					var total = data.total;
					var items = data.data;
					for (var i = 0; i < total; i++) {
						comboOptions += "<option value='" + items[i]["code"]
								+ "'>" + items[i]["mainItem"] + "</option>"; //
					}
				}
				$("#" + districtSelectId).html(comboOptions).multiselect(
						'refresh');
			}
		});
	}
}

function initDistrict(cityValue, districtSelectId, selectedValue) {
	if (cityValue) {
		// 获取推广渠道类型和渠道大类
		$.ajax({
			url : requestContextPath + "/common/getDictList.html",
			data : {
				parentCode : cityValue,
				pageSize : 10000,
				curPage : 1
			},
			dataType : "json",
			success : function(data) {
				var comboOptions = "<option value=''>请选择地区</option>";
				if (data.total > 0) {
					var total = data.total;
					var items = data.data;
					for (var i = 0; i < total; i++) {
						if (selectedValue != null
								&& selectedValue == items[i]["code"]) {
							comboOptions += "<option value='"
									+ items[i]["code"] + "' selected>"
									+ items[i]["mainItem"] + "</option>"; //
							$("#select2-" + districtSelectId + "-container")
									.html(items[i]["mainItem"]);
						} else {
							comboOptions += "<option value='"
									+ items[i]["code"] + "'>"
									+ items[i]["mainItem"] + "</option>"; //
						}
					}
				}
				$("#" + districtSelectId).html(comboOptions).multiselect(
						'refresh');
			}
		});
	}
}

// 地区改变
function changeSelectDistrict(thisObject, streetId) {
	$("#" + streetId).val('');
}
