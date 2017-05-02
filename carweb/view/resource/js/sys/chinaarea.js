~ function($, window) {
	"use strict"; // jshint ;_;

	var $body = $("body");
	var $document = $(document);

	beautifulSelect2();
	
	function beautifulSelect2() {
		
		$(".beautifulSelect2").select2({
			  theme: "classic"
		});
	};
	
	
	mapQuery("深圳市南山区大学城");
	
	function mapQuery(address) {
		// 百度地图API功能
		var map = new BMap.Map("allmap");
		var point = new BMap.Point(116.331398, 39.897445);
		map.centerAndZoom(point, 12);
		// 创建地址解析器实例
		var myGeo = new BMap.Geocoder();
		// 将地址解析结果显示在地图上,并调整地图视野
		myGeo.getPoint(address, function(point) {
			if (point) {
				map.centerAndZoom(point, 16);
				map.addOverlay(new BMap.Marker(point));
			} else {
				alert("您选择地址没有解析到结果!");
			}
		}, ""); 
	}


	/*
	 * 用于校验空输入提示闪红色
	 */
	function showNotSeletedTips(target) {
		target.addClass("not-selected");
	}

	/*
	 * 所有的文本输入框focus时去掉class
	 */
	$document.on("focus", "input[type=text]", function() {
		$(this).removeClass("not-selected");
	});

	/*
	 * 选择select框
	 */
	$document.on("change", "select", function() {
		$(this).next().removeClass("not-selected");
	});
	
	initProvince();
	
	/**
	 * 初始化省份
	 * 
	 */
	function initProvince() {
		//获取推广渠道类型和渠道大类
		Util.ajax({
			url: requestContextPath + "/common/getDictList.html",
			data: {
				codeType: '省份',
				pageSize : 10000,
				curPage : 1
			},
			dataType: "json",
			success: function(data) {
				var comboOptions = "<option value='' selected>请选择省份</option>";
				if (data.total > 0) {
					var total = data.total;
					var items = data.data;
					for (var i = 0; i < total; i++) {
						comboOptions += "<option  value='" + items[i]["code"]  + "'>" + items[i]["mainItem"] + "</option>"; // 使用全部小写，具体查看jquery .data
					}
				}
				$("#province_sel").html(comboOptions).multiselect('refresh');
			}
		});
	}


	//选择省份
	$("#province_sel").on('change', function(e) {
		
		$("#select2-city_sel-container").html('请选择城市');
		$("#select2-district_sel-container").html('请选择地区');
		$("#street").val('');
		
		var $this = $(this);
		var provinceId = $this.val();

		if (provinceId) {
			//获取推广渠道类型和渠道大类
			Util.ajax({
				url: requestContextPath + "/common/getDictList.html",
				data: {
					parentCode: provinceId,
					pageSize : 10000,
					curPage : 1
				},
				dataType: "json",
				success: function(data) {
					var comboOptions = "<option value='' selected>请选择城市</option>";
					if (data.total > 0) {
						var total = data.total;
						var items = data.data;
						for (var i = 0; i < total; i++) {
							comboOptions += "<option value='" + items[i]["code"] + "'>" + items[i]["mainItem"] + "</option>"; //
						}
					}
					$("#city_sel").html(comboOptions).multiselect('refresh');
				}
			});
		} 
	});


	//选择城市
	$("#city_sel").on('change', function(e) {
		// debugger;

		$("#select2-district_sel-container").html('请选择地区');
		$("#street").val('');
		
		var $this = $(this);
		var cityId = $this.val();

		if (cityId) {
			//获取推广渠道类型和渠道大类
			Util.ajax({
				url: requestContextPath + "/common/getDictList.html",
				data: {
					parentCode: cityId,
					pageSize : 10000,
					curPage : 1
				},
				dataType: "json",
				success: function(data) {
					var comboOptions = "<option value='' selected>请选择地区</option>";
					if (data.total > 0) {
						var total = data.total;
						var items = data.data;
						for (var i = 0; i < total; i++) {
							comboOptions += "<option value='" + items[i]["code"] + "'>" + items[i]["mainItem"] + "</option>"; //
						}
					}
					$("#district_sel").html(comboOptions).multiselect('refresh');
				}
			});
		} 
	});

	$("#district_sel").on('change', function(e) {
		$("#street").val('');
	});
	
	$("#searchBtn").click(function() {
		var address = "";
		var province_sel = $("#province_sel").find("option:selected").text() ||  "北京市";
		var city_sel = $("#city_sel").find("option:selected").text() || "";
		var district_sel = $("#district_sel").find("option:selected").text() || "";
		var street = $("#street").val() || "";
		address = province_sel + city_sel + district_sel + street;
	
		mapQuery(address);
	});
	

	

}(jQuery, window);