~function($, window) {
	"use strict"; // jshint ;_;
	var totalRecords = 0;
	var tableData = {}; // 每一个id对应一个操作记录

	var $usertable = $("#user_table");
	var userTableData = {};
	var $jUserTable = null;
	var $filestable = $("#files_table");
	var filesTableData = {};
	var $jFilesTable = null;
	var now = new Date().Format('yyyyMMdd');

	beautifulSelect2();

	function beautifulSelect2() {

		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}

	initDetailSize();
	function initDetailSize() {
		var fsMainWidth = 0, imagesWidth = 0, viewerWidth = 0;
		if ($(parent.window).width() - 520 <= 700) {
			imagesWidth = 700;
			viewerWidth = 660;
			fsMainWidth = 1200;
		} else {
			imagesWidth = $(parent.window).width() - 520;
			viewerWidth = $(parent.window).width() - 560;
			fsMainWidth = $(parent.window).width();
		}
		$("#fsMain").width(fsMainWidth);
		$("#images").width(imagesWidth);
		$("#control_box").height($(parent.window).height() - 400);
		$("#viewer").width(viewerWidth);
		$("#viewer").height($(parent.window).height() - 250);
	}

	dateInit();
	function dateInit() {
		$('.datepicker').datepicker({
			format : 'yyyymmdd',
			language : 'zh-CN',
		});

		$('#applyDate').val(now);

	}

	function IsNum(s) {
		if (s != null && s != "") {
			return !isNaN(s);
		}
		return false;
	}
	// 格式化
	$(".round_number").on('blur', function(e) {
		var thisVal = $(this).val();
		if (!IsNum(thisVal)) {
			$(this).val('0.00');
		} else {
			thisVal = parseFloat(thisVal).toFixed(2);
			$(this).val(thisVal);
		}
	});
	$("#evaluatePrice").on('blur', function(e) {
		var thisVal = $(this).val();
		if (!IsNum(thisVal)) {
			$(this).val('0');
		} else {
			thisVal = parseFloat(thisVal).toFixed(0);
			$(this).val(thisVal);
		}
	});
	// 计算
	$("#calc_price_btn")
			.on(
					'click',
					function(e) {
						var newCarPrice = $("#newCarPrice").val();
						var favorablePrice = $("#favorablePrice").val();
						var purchaseTax = $("#purchaseTax").val();
						var purchasePrice = $("#purchasePrice").val();
						var carAgeChange = $("#carAgeChange").val();
						var marketDeep = $("#marketDeep").val();
						var upgrading = $("#upgrading").val();
						var carVersionParam = $("#carVersionParam").val();
						var runParam = $("#runParam").val();
						var carCondition = $("#carCondition").val();
						var colorParam = $("#colorParam").val();
						var repairCost = $("#repairCost").val();
						var evaluatePrice = $("#evaluatePrice").val();

						var newRate = $("#newRate").val();

						if (!IsNum(newCarPrice)) {
							setCurrencyVal("#newCarPrice", "0.00");
							newCarPrice = 0.00;
						}
						if (!IsNum(favorablePrice)) {
							setCurrencyVal("#favorablePrice", "0.00");
							favorablePrice = 0.00;
						}
						if (!IsNum(purchaseTax)) {
							setCurrencyVal("#purchaseTax", "0.00");
							purchaseTax = 0.00;
						}
						if (!IsNum(purchasePrice)) {
							setCurrencyVal("#purchasePrice", "0.00");
							purchasePrice = 0.00;
						}
						if (!IsNum(carAgeChange)) {
							$("#carAgeChange").val('0.00');
							carAgeChange = 0.00;
						}
						if (!IsNum(marketDeep)) {
							$("#marketDeep").val('0.00');
							marketDeep = 0.00;
						}
						if (!IsNum(upgrading)) {
							$("#upgrading").val('0.00');
							upgrading = 0.00;
						}
						if (!IsNum(carVersionParam)) {
							$("#carVersionParam").val('0.00');
							carVersionParam = 0.00;
						}
						if (!IsNum(runParam)) {
							$("#runParam").val('0.00');
							runParam = 0.00;
						}
						if (!IsNum(colorParam)) {
							$("#colorParam").val('0.00');
							colorParam = 0.00;
						}
						if (!IsNum(carCondition)) {
							$("#carCondition").val('0.00');
							carCondition = 0.00;
						}
						if (!IsNum(repairCost)) {
							setCurrencyVal("#repairCost", "0.00");
							repairCost = 0.00;
						}
						if (!IsNum(evaluatePrice)) {
							setCurrencyVal("#evaluatePrice", "0.00");
							evaluatePrice = 0.00;
						}
						purchaseTax = ((newCarPrice - favorablePrice) / 11.7)
								.toFixed(2);
						setCurrencyVal("#purchaseTax", purchaseTax);
						purchasePrice = parseFloat(newCarPrice - favorablePrice)
								+ parseFloat(purchaseTax);
						purchasePrice = purchasePrice.toFixed(2);
						setCurrencyVal("#purchasePrice", purchasePrice);
						var marketPrice = purchasePrice
								* (parseFloat(newRate / 100)
										+ parseFloat(carAgeChange / 100)
										+ parseFloat(marketDeep / 100) + parseFloat(upgrading / 100));
						// carVersionParam 这个没有用
						evaluatePrice = marketPrice
								* (1 + parseFloat(carVersionParam / 100)
										+ parseFloat(runParam / 100)
										+ parseFloat(carCondition / 100) + parseFloat(colorParam / 100))
								- repairCost;
						evaluatePrice = evaluatePrice.toFixed(0);
						setCurrencyVal("#evaluatePrice", evaluatePrice);
					});

	$(".checkDate").focus(function(event) {
		var dateValue = $(this).val();
		if (dateValue == null || dateValue.length <= 0) {
			return;
		}
		dateValue = dateValue.replace(/-/g, '');
		$(this).val(dateValue);
	});
	$(".checkDate").blur(function(event) {
		var dateValue = $(this).val();
		if (dateValue == null || dateValue.length <= 0) {
			return;
		}
		dateValue = dateValue.replace(/-/g, '');
		if (dateValue.length <= 5 || dateValue.length > 8) {
			$.msgbox.show({
				'type' : 'error',
				'text' : '日期错误',
				'title' : '错误'
			});
			return;
		}
		var formatDate = formateDate(dateValue);
		$(this).val(formatDate);
		var isOk = isFormateDate(formatDate);
		if (!isOk) {
			$.msgbox.show({
				'type' : 'error',
				'text' : '日期错误',
				'title' : '错误'
			});
		}
	});

	$("#regDate").focus(function(event) {
		var dateValue = $(this).val();
		if (dateValue == null || dateValue.length <= 0) {
			return;
		}
		dateValue = dateValue.replace(/-/g, '');
		$(this).val(dateValue);
	});
	$("#regDate").blur(function(event) {
		var dateValue = $(this).val();
		if (dateValue == null || dateValue.length <= 0) {
			return;
		}
		dateValue = dateValue.replace(/-/g, '');
		if (dateValue.length <= 5 || dateValue.length > 8) {
			$.msgbox.show({
				'type' : 'error',
				'text' : '日期错误',
				'title' : '错误'
			});
			return;
		}
		var formatDate = formateDate(dateValue);
		$(this).val(formatDate);
		var isOk = isFormateDate(formatDate);
		if (!isOk) {
			$.msgbox.show({
				'type' : 'error',
				'text' : '日期错误',
				'title' : '错误'
			});
		} else {
			var nowDate = new Date();
			var now = nowDate.Format('yyyyMMdd');
			var intNowYear = parseInt(now.substring(0, 4));
			var nowMonthDay = now.substring(4, 8);

			var intDateValue = dateValue.replace(/-/g, '');
			var intDate = parseInt(intDateValue);
			var year = intDateValue.substring(0, 4);
			var month = intDateValue.substring(4, 6);
			var day = intDateValue.substring(6, 8);
			var monthDay = intDateValue.substring(4, 8);
			var intYear = parseInt(year);
			var intMonth = parseInt(month);
			var intDay = parseInt(day);

			nowDate.setFullYear(nowDate.getFullYear() - 2);
			var posDay2 = parseInt(nowDate.Format('yyyyMMdd'));
			nowDate.setFullYear(nowDate.getFullYear() - 2);
			var posDay4 = parseInt(nowDate.Format('yyyyMMdd'));
			nowDate.setFullYear(nowDate.getFullYear() - 2);
			var posDay6 = parseInt(nowDate.Format('yyyyMMdd'));

			var regDate = new Date(intYear, intMonth - 1, intDay);
			var yearCheckDate = regDate.Format('yyyyMMdd');
			if (posDay2 <= intDate) {
				regDate.setFullYear(regDate.getFullYear() + 2);
				yearCheckDate = regDate.Format('yyyyMMdd');
			} else if (posDay4 <= intDate) {
				regDate.setFullYear(regDate.getFullYear() + 4);
				yearCheckDate = regDate.Format('yyyyMMdd');
			} else if (posDay6 <= intDate) {
				regDate.setFullYear(regDate.getFullYear() + 6);
				yearCheckDate = regDate.Format('yyyyMMdd');
			} else if (posDay6 > intDate) {
				yearCheckDate = dateValue;
			}
			yearCheckDate = formateDate(yearCheckDate);
			$("#yearCheckDate").val(yearCheckDate);
		}
	});

	// 新增品牌、车型、车系, <i>标签中isAddCarData 汽车数据
	function setAddTypeInfoMode() {
		$("#add_typeInfo").css("display", "block");
		$("#addTypeInfoBtn").css("display", "block");
		$("#iTypeInfoName").removeClass("glyphicon-plus");
		$("#iTypeInfoName").addClass("glyphicon-remove");
		$("#iTypeInfoName").addClass("isAddCarData");
		$("#boxTypeInfoListSelect").hide();
	}
	function setSelectTypeInfoMode() {
		$("#add_typeInfo").css("display", "none");
		$("#addTypeInfoBtn").css("display", "none");
		$("#iTypeInfoName").removeClass("glyphicon-remove");
		$("#iTypeInfoName").addClass("glyphicon-plus");
		$("#iTypeInfoName").addClass("isAddCarData");
		$("#boxTypeInfoListSelect").show();
		$("#iTypeInfoName").show();
	}

	function setAddBrandMode() {
		$("#add_brandName").css("display", "block");
		$("#addBrandBtn").css("display", "block");
		$("#iBrandName").removeClass("glyphicon-plus");
		$("#iBrandName").addClass("glyphicon-remove");
		$("#iBrandName").addClass("isAddCarData");
		$("#boxBrandSelect").hide();
	}
	function setSelectBrandMode() {
		$("#add_brandName").css("display", "none");
		$("#addBrandBtn").css("display", "none");
		$("#iBrandName").removeClass("glyphicon-remove");
		$("#iBrandName").addClass("glyphicon-plus");
		$("#iBrandName").removeClass("isAddCarData");
		$("#boxBrandSelect").show();
	}

	function setAddCarSetMode(showRemove) {
		$("#add_carSet").css("display", "block");
		$("#addCarSetBtn").css("display", "block");
		$("#iCarSetName").removeClass("glyphicon-plus");
		$("#iCarSetName").addClass("glyphicon-remove");
		if (!showRemove)
			$("#iCarSetName").hide();
		$("#iCarSetName").addClass("isAddCarData");
		$("#boxCarSetSelect").hide();
	}
	function setSelectCarSetMode() {
		$("#add_carSet").css("display", "none");
		$("#addCarSetBtn").css("display", "none");
		$("#iCarSetName").removeClass("glyphicon-remove");
		$("#iCarSetName").addClass("glyphicon-plus");
		$("#iCarSetName").addClass("isAddCarData");
		$("#boxCarSetSelect").show();
		$("#iCarSetName").show();
	}

	function setAddCarTypeMode(showRemove) {
		$("#add_carType").css("display", "block");
		$("#addCarTypeBtn").css("display", "block");
		$("#iCarTypeName").removeClass("glyphicon-plus");
		$("#iCarTypeName").addClass("glyphicon-remove");
		$("#iCarTypeName").addClass("isAddCarData");
		if (!showRemove)
			$("#iCarTypeName").hide();
		$("#boxCarTypeSelect").hide();
	}
	function setSelectCarTypeMode(showRemove) {
		$("#add_carType").css("display", "none");
		$("#addCarTypeBtn").css("display", "none");
		$("#iCarTypeName").removeClass("glyphicon-remove");
		$("#iCarTypeName").addClass("glyphicon-plus");
		$("#iCarTypeName").removeClass("isAddCarData");
		$("#boxCarTypeSelect").show();
		$("#iCarTypeName").show();
	}

	$("#carBrandId").on(
			'change',
			function(e) {
				$("#select2-carSetId-container").html('请选择');
				$("#carSetId").val('');
				$("#select2-carTypeId-container").html('请选择');
				$("#carTypeId").val('');
				selectedCarSet('carSetId', $("#carBrandId").val(), null);
				selectedCarType('carTypeId', $("#carBrandId").val(), $(
						"#carSetId").val(), null);
			});

	$("#carSetId").on(
			'change',
			function(e) {
				$("#select2-carTypeId-container").html('请选择');
				$("#carTypeId").val('');
				selectedCarType('carTypeId', $("#carBrandId").val(), $(
						"#carSetId").val(), null);
			});

	// 汽车字典 取数
	function getTypeInfoValue() {
		if ($("#iTypeInfoName").hasClass("isAddCarData")) {
			return $("#add_typeInfo").val();
		} else {
			return $("#carTypeInfo").val();
		}
	}
	function getCarBrandId() {
		if ($("#iBrandName").hasClass("isAddCarData")) {
			return $("#add_brandName").attr('brandId');
		} else {
			return $("#carBrandId").val();
		}
	}
	function getCarSetId() {
		if ($("#iCarSetName").hasClass("isAddCarData")) {
			return $("#add_carSet").attr('carSetId');
		} else {
			return $("#carSetId").val();
		}
	}
	function getCarTypeId() {
		if ($("#iCarTypeName").hasClass("isAddCarData")) {
			return $("#add_carType").attr('carTypeId');
		} else {
			return $("#carTypeId").val();
		}
	}
	// 车辆类型
	$("#addTypeInfoBtn").on('click', function(e) {
		var typeInfoValue = getTypeInfoValue();
		addSimpleDict('999999', '车辆类型', typeInfoValue);
	});
	$("#addBrandBtn").on('click', function(e) {
		addCarBrand($("#add_brandName").val(), "#add_brandName");
	});
	$("#addCarSetBtn").on('click', function(e) {
		var brandId = getCarBrandId();
		addCarSet(brandId, $("#add_carSet").val(), "#add_carSet");
	});
	$("#addCarTypeBtn").on('click', function(e) {
		var brandId = getCarBrandId();
		var carSetId = getCarSetId();
		addCarType(brandId, carSetId, $("#add_carType").val(), "#add_carType");
	});

	initCarBill();
	// 初始化数据
	function initCarBill() {
		// 先校验
		Util
				.ajax(
						{
							url : requestContextPath
									+ "/carBill/getDetailCarBillVo.html",
							type : "POST",
							data : {
								'carBillId' : $("#hidden_carBillId").val(),
							},
							dataType : "json",
							success : function(data) {
								if (data.success) {
									// 设置界面信息
									$("#carBillId").val(data.object.carBillId);
									$("#applyCarBillId").val(
											data.object.applyCarBillId);
									$("#carNo").val(data.object.carNo);
									$("#carUserName").val(
											data.object.carUserName);

									selectedCarBrand("carBrandId",
											data.object.carBrandId);
									// 选择数据
									selectedCarSet('carSetId',
											data.object.carBrandId,
											data.object.carSetId);
									selectedCarType('carTypeId',
											data.object.carBrandId,
											data.object.carSetId,
											data.object.carTypeId);

									$("#carDisplace").val(
											data.object.carDisplace);
									$("#carFrameNum").val(
											data.object.carFrameNum);
									$("#carFrameNum").attr('title',
											data.object.carFrameNum);
									$("#power").val(data.object.power);
									$("#engineNum").val(data.object.engineNum);

									var environmentType = data.object.environmentType
											|| '国4';
									$("#environmentType").find(
											"option[value=" + environmentType
													+ "]").attr("selected",
											true);
									$("#select2-environmentType-container")
											.html(environmentType);

									$("#runNum").val(data.object.runNum);
									$("#regDate").val(data.object.regDate);
									$("#productionDate").val(
											data.object.productionDate);
									// $("#issueDate").val(data.object.issueDate);
									var carClass = data.object.carClass
											|| '常规车型';
									$("#carClass").find(
											"option[value=" + carClass + "]")
											.attr("selected", true);
									$("#select2-carClass-container").html(
											carClass);

									$("#labelTypeNum").val(
											data.object.labelTypeNum);
									selectedSystemDict('carTypeInfo', '车辆类型',
											data.object.carTypeInfo || '小型轿车');
									$("#seat").val(data.object.seat);
									$("#color").val(data.object.color);
									$("#yearCheckDate").val(
											data.object.yearCheckDate);
									$("#takeUserPhone").val(
											data.object.takeUserPhone);
									setCurrencyVal("#preSalePrice",
											data.object.preSalePrice);
									$("#useNature").find(
											"input:radio[value='"
													+ data.object.useNature
													+ "']").attr('checked',
											true);
									$("#changeSpeed").find(
											"input:radio[value='"
													+ data.object.changeSpeed
													+ "']").attr('checked',
											true);
									$("#carDoor").find(
											"input:radio[value='"
													+ data.object.carDoor
													+ "']").attr('checked',
											true);
									$("#driveType").find(
											"input:radio[value='"
													+ data.object.driveType
													+ "']").attr('checked',
											true);
									$("#oilSystem").find(
											"input:radio[value='"
													+ data.object.oilSystem
													+ "']").attr('checked',
											true);
									$("#airSystem").find(
											"input:radio[value='"
													+ data.object.airSystem
													+ "']").attr('checked',
											true);
									$("#specialBizInfo").val(
											data.object.specialBizInfo);
									$("#specialConfigInfo").val(
											data.object.specialConfigInfo);
									$("#carInfoMark").val(
											data.object.carInfoMark);
									$("#applyAllOpinion").html(
											data.object.applyAllOpinion);
									$("#status").val(data.object.status);

									// 设置单选
									$('#applyResult input:radio:checked').attr(
											'checked', false);
									$(
											"input[type=radio][name=applyResult][value="
													+ data.object.applyResult
													+ "]")
											.prop("checked", true);

									$("#applyOpinion").val(
											data.object.applyOpinion);
									$("#applyDate").val(data.object.applyDate);
									$("#applyUser").val(data.object.applyUser);
									// $("#nextPartUser").val(data.object.nextUser);

									$("#hidden_carFrameImageA")
											.val(
													data.object.carFrameImageA
															|| "/source/images/car_frame_1.png");
									$("#hidden_carFrameImageB")
											.val(
													data.object.carFrameImageB
															|| "/source/images/car_frame_2.png");
									$("#hidden_carFrameImageC")
											.val(
													data.object.carFrameImageC
															|| "/source/images/car_frame_3.png");
									$("#hidden_carFrameImageD")
											.val(
													data.object.carFrameImageD
															|| "/source/images/car_frame_4.png");
									$("#carFrameInfo").val(
											data.object.carFrameInfo);

									// 价格
									setCurrencyVal("#newCarPrice",
											data.object.newCarPrice);
									setCurrencyVal("#favorablePrice",
											data.object.favorablePrice);
									setCurrencyVal("#purchaseTax",
											data.object.purchaseTax);
									setCurrencyVal("#purchasePrice",
											data.object.purchasePrice);

									$("#newRate")
											.find(
													"option[value="
															+ data.object.newRate
															+ "]").attr(
													"selected", true);
									$("#select2-newRate-container").html(
											data.object.newRate);

									$("#carAgeChange").val(
											data.object.carAgeChange);
									$("#marketDeep")
											.val(data.object.marketDeep);
									$("#upgrading").val(data.object.upgrading);
									$("#carVersionParam").val(
											data.object.carVersionParam);
									$("#runParam").val(data.object.runParam);
									$("#carCondition").val(
											data.object.carCondition);
									$("#colorParam")
											.val(data.object.colorParam);
									setCurrencyVal("#repairCost",
											data.object.repairCost);
									setCurrencyVal("#evaluatePrice",
											data.object.evaluatePrice);

									$("#carConditionEvaluate").val(
											data.object.carConditionEvaluate);
									$("#evaluateDate").val(
											data.object.evaluateDate || now);
									$("#evaluateValidite").val(
											data.object.evaluateValidite || 15);

									// $("#nextPartUser").val('');

									$("#createUser")
											.val(data.object.createUser);
									$("#createTime")
											.val(data.object.createTime);
									$("#createUserPhone").val(
											data.object.createUserPhone);

									var specialCarCondition = data.object.specialCarCondition
											|| '';
									if (specialCarCondition.indexOf('火烧车') >= 0) {
										$("#firedCar").attr("checked", 'true');
									}
									if (specialCarCondition.indexOf('泡水车') >= 0) {
										$("#wateredCar")
												.attr("checked", 'true');
									}

								} else {
									$.msgbox.show({
										'type' : 'error',
										'text' : data.message,
										'title' : '失败'
									});
								}
							},
							complete : function(xhr, textStatus) {
							}
						}, "正在查询中");
	}

	// 撤销数据
	$("#data_cancel").click(function() {
		parent.window.detailCarBillModalConfirm('cancel');
	});
	/**
	 * 获得查询参数
	 * 
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getFilesParam = (function() {
		var _queryParam = {
			carBillId : "",
			fileType : "xls"
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.carBillId = $("#hidden_carBillId").val();
			toString(_queryParam);
			return _queryParam;
		};
	})();
	function searchFiles() {
		$jFilesTable.refreshTableData(getFilesParam());
	}
	$jFilesTable = $filestable.table({
		ajaxUrl : requestContextPath + "/carBill/getAttachFiles.html",
		paramsJson : getFilesParam(),
		pageKey : {
			total : "total",
			pageSize : "pageSize",
			curPage : "curPage",
			pageSizeNum : 6,
			curPageNum : 1,
		},
		clickRow : function() {
		},
		dbClickRow : function() {
		},
		tbodyMaker : function(data) {
			userTableData = {};
			var dataSet = {
				total : data.total,
				list : ""
			};
			var dataList = [];
			var items = data.data;
			if (items) {
				for (var i = 0, len = items.length; i < len; i++) {
					var list = [];
					var curRow = items[i];
					list.push('<a target="_blank" href="'
							+ curRow.attachmentURL + '">' + curRow.fileName
							+ '</a>');
					list.push(curRow.createUser);
					list.push(curRow.createTime);
					dataList.push(list);
				}
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});
}(jQuery, window)