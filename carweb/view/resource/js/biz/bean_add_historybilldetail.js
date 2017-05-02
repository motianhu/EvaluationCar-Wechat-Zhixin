~function($, window) {
	"use strict"; // jshint ;_;

	var $table = $("#user_table");
	var $jTable = null;

	var totalRecords = 0;
	var tableData = {}; // 每一个id对应一个操作记录

	var $usertable = $("#user_table");
	var userTableData = {};
	var $jUserTable = null;
	var now = new Date().Format('yyyyMMdd');
	var nowLine = new Date().Format('yyyy-MM-dd');

	var $historytable = $("#history_table");
	var historyTableData = {};
	var $jHistoryTable = null;

	beautifulSelect2();

	function beautifulSelect2() {

		$(".beautifulSelect2").select2({
			theme : "classic"
		});
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
	$("#iTypeInfoName").on('click', function(e) {
		if ($("#iTypeInfoName").hasClass("glyphicon-plus")) {
			setAddTypeInfoMode();
		} else {
			setSelectTypeInfoMode();
		}
	});

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

	$("#iBrandName").on('click', function(e) {
		if ($("#iBrandName").hasClass("glyphicon-plus")) {
			setAddBrandMode();
			setAddCarSetMode(false);
			setAddCarTypeMode(false);
		} else {
			setSelectBrandMode();
			setSelectCarSetMode();
			setSelectCarTypeMode();
		}
	});

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
	$("#iCarSetName").on('click', function(e) {
		if ($("#iCarSetName").hasClass("glyphicon-plus")) {
			setAddCarSetMode(true);
			setAddCarTypeMode(false);
		} else {
			setSelectCarSetMode();
			setSelectCarTypeMode();
		}
	});

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
	$("#iCarTypeName").on('click', function(e) {
		if ($("#iCarTypeName").hasClass("glyphicon-plus")) {
			setAddCarTypeMode(true);
		} else {
			setSelectCarTypeMode();
		}
	});

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

		selectedCarBrand("carBrandId", null);
		// 选择数据
		selectedCarSet('carSetId', null, null);
		selectedCarType('carTypeId', null, null, null);

		var environmentType = '国4';
		$("#environmentType").find("option[value=" + environmentType + "]")
				.attr("selected", true);
		$("#select2-environmentType-container").html(environmentType);

		selectedSystemDict('carTypeInfo', '车辆类型', '小型轿车');

		var userNature = '非营运';
		$("#useNature").find("input:radio[value='" + userNature + "']").attr(
				'checked', true);

		var newRateValue = 75;
		$("#newRate").find("option[value='" + newRateValue + "']").attr(
				"selected", true);
		$("#select2-newRate-container").html(newRateValue);

		$("#evaluateDate").val(nowLine);
		$("#evaluateValidite").val(15);

	}

	// 提交数据
	$("#data_submit")
			.click(
					function() {
						var specialCarCondition = [];
						if ($('#firedCar').prop("checked")) {
							specialCarCondition.push('火烧车');
						}
						if ($('#wateredCar').prop("checked")) {
							specialCarCondition.push('泡水车');
						}

						// 先检查，确定后执行保存
						var nextPartUser = '';

						// 先校验
						Util
								.ajax(
										{
											url : requestContextPath
													+ "/carBill/addHistoryCarBill.html",
											type : "POST",
											data : {
												'carBillId' : $(
														"#hidden_carBillId")
														.val(),
												'carNo' : $("#carNo").val(),
												'carUserName' : $(
														"#carUserName").val(),
												'carBrandId' : getCarBrandId() || 0,
												'carSetId' : getCarSetId() || 0,
												'carTypeId' : getCarTypeId() || 0,
												'carDisplace' : $(
														"#carDisplace").val(),
												'carFrameNum' : $(
														"#carFrameNum").val(),
												'powerName' : $("#power").val(),
												'engineNum' : $("#engineNum")
														.val(),
												'environmentType' : $(
														"#environmentType")
														.val(),
												'runNumName' : $("#runNum")
														.val(),
												'regDate' : $("#regDate").val(),
												'productionDate' : $(
														"#productionDate")
														.val(),
												'carClass' : $("#carClass")
														.val(),
												'labelTypeNum' : $(
														"#labelTypeNum").val(),
												'carTypeInfo' : getTypeInfoValue(),
												'seat' : $("#seat").val(),
												'color' : $("#color").val(),
												'yearCheckDate' : $(
														"#yearCheckDate").val(),
												'takeUserPhone' : $(
														"#takeUserPhone").val(),
												'preSalePriceName' : $(
														"#preSalePrice").val(),
												'useNature' : $(
														'#useNature input[name="useNature"]:checked ')
														.val(),
												'changeSpeed' : $(
														'#changeSpeed input[name="changeSpeed"]:checked ')
														.val(),
												'carDoor' : $(
														'#carDoor input[name="carDoor"]:checked ')
														.val(),
												'driveType' : $(
														'#driveType input[name="driveType"]:checked ')
														.val(),
												'oilSystem' : $(
														'#oilSystem input[name="oilSystem"]:checked ')
														.val(),
												'airSystem' : $(
														'#airSystem input[name="airSystem"]:checked ')
														.val(),
												'specialBizInfo' : $(
														"#specialBizInfo")
														.val(),
												'specialConfigInfo' : $(
														"#specialConfigInfo")
														.val(),
												'carInfoMark' : $(
														"#carInfoMark").val(),
												'newCarPrice' : $(
														"#newCarPrice").val(),
												'favorablePrice' : $(
														"#favorablePrice")
														.val(),
												'purchaseTax' : $(
														"#purchaseTax").val(),
												'purchasePrice' : $(
														"#purchasePrice").val(),
												'newRate' : $("#newRate").val(),
												'carAgeChange' : $(
														"#carAgeChange").val(),
												'marketDeep' : $("#marketDeep")
														.val(),
												'upgrading' : $("#upgrading")
														.val(),
												'carVersionParam' : $(
														"#carVersionParam")
														.val(),
												'runParam' : $("#runParam")
														.val(),
												'carCondition' : $(
														"#carCondition").val(),
												'colorParam' : $("#colorParam")
														.val(),
												'repairCost' : $("#repairCost")
														.val(),
												'evaluatePrice' : $(
														"#evaluatePrice").val(),
												'carConditionEvaluate' : $(
														"#carConditionEvaluate")
														.val(),
												'evaluateDate' : $(
														"#evaluateDate").val(),
												'evaluateValidite' : $(
														"#evaluateValidite")
														.val(),
												'applyResult' : $(
														'#applyResult input[name="applyResult"]:checked ')
														.val(),
												'applyOpinion' : $(
														"#applyOpinion").val(),
												'nextPartUser' : nextPartUser,
												'specialCarCondition' : specialCarCondition
														.join(),
												'carFrameInfo' : $(
														"#carFrameInfo").val(),

											},
											dataType : "json",
											success : function(data) {
												if (data.success) {
													// saveAllFrameImages();

													$.msgbox
															.show({
																'type' : 'info',
																'text' : data.message,
																'title' : '成功',
																'cancelBtnShow' : false,
																'confirmCb' : function() {
																	parent
																			.ReOpenAddHistoryCarBill();
																}
															});
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
										}, "正在提交中");

					});

	// history
	$("#histroy_price_btn").click(function() {
		$("#history_modal").modal("show");
		searchHistory();
	});

	$("#hisSearchBtn").click(function() {
		searchHistory();
	});

	function searchHistory() {
		if ($jHistoryTable == null) {
			$jHistoryTable = $historytable.table({
				ajaxUrl : requestContextPath
						+ "/carBill/getHisPriceBillList.html",
				paramsJson : getHistoryParam(),
				pageKey : {
					total : "total",
					pageSize : "pageSize",
					curPage : "curPage"
				},
				dbClickRow : function() {
					showDetail();
				},
				tbodyMaker : function(data) {
					tableData = {};
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
							tableData[curRow.id] = curRow;
							list.push("<span rowid='" + curRow.carBillId + "'>"
									+ curRow.carBillId + "</span>"); // 编号
							list.push(curRow.carBrandName);
							list.push(curRow.carSetName);
							list.push(curRow.carTypeName);
							list.push(curRow.carDisplace);
							list.push(curRow.preSalePrice);
							list.push(curRow.productionDate);
							list.push(curRow.regDate);
							list.push(curRow.runNum);
							list.push(curRow.evaluatePrice);
							dataList.push(list);
						}
					}
					dataSet.list = dataList;
					return dataSet;
				}
			});
		} else {
			$jHistoryTable.refreshTableData(getHistoryParam());
		}
	}

	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getHistoryParam = (function() {
		var _queryParam = {
			carBillId : '',
			carBrandName : '',
			carSetName : '',
			carTypeName : '',
			rangeTime : '',
			fileType : "xls"
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			var defaultCarBrand = $("#carBrandId").find("option:selected")
					.text();
			defaultCarBrand = defaultCarBrand.indexOf('请选择') >= 0 ? ''
					: defaultCarBrand;
			var defaultCarSet = $("#carSetId").find("option:selected").text();
			defaultCarSet = defaultCarSet.indexOf('请选择') >= 0 ? ''
					: defaultCarSet;
			var defaultCarType = $("#carTypeId").find("option:selected").text();
			defaultCarType = defaultCarType.indexOf('请选择') >= 0 ? ''
					: defaultCarType;
			_queryParam.carBillId = $("#his_carBillId").val();
			_queryParam.carBrandName = $("#his_carBrandName").val()
					|| defaultCarBrand;
			_queryParam.carSetName = $("#his_carSetName").val()
					|| defaultCarSet;
			_queryParam.carTypeName = $("#his_carTypeName").val()
					|| defaultCarType;
			_queryParam.rangeTime = $("#his_rangeTime").val();
			if (arguments.length != 0) {
				var args = arguments[0];
				for ( var x in args) {
					if (_queryParam[x]) {
						_queryParam[x] = args[x];
					}
				}
			}
			toString(_queryParam);
			return _queryParam;
		};
	})();

}(jQuery, window)