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
	var fileInput1 = $("#file-1")
			.fileinput(
					{
						domId : "file-1",
						uploadUrl : requestContextPath
								+ '/carBill/uploadAttachFile.html?dirPath=source/upload/carbills/attachments/&carBillId='
								+ $("#hidden_carBillId").val(),
						maxFileSize : 10000,
						maxFilesNum : 20,
						previewFileIcon : '<i class="fa fa-file"></i>',
						allowedPreviewTypes : [ 'image' ],
						previewFileIconSettings : {
							'doc' : '<i class="fa fa-file-word-o text-primary"></i>',
							'xls' : '<i class="fa fa-file-excel-o text-success"></i>',
							'ppt' : '<i class="fa fa-file-powerpoint-o text-danger"></i>',
							'jpg' : '<i class="fa fa-file-photo-o text-warning"></i>',
							'pdf' : '<i class="fa fa-file-pdf-o text-danger"></i>',
							'zip' : '<i class="fa fa-file-archive-o text-muted"></i>',
							'htm' : '<i class="fa fa-file-code-o text-info"></i>',
							'txt' : '<i class="fa fa-file-text-o text-info"></i>',
							'mov' : '<i class="fa fa-file-movie-o text-warning"></i>',
							'mp3' : '<i class="fa fa-file-audio-o text-warning"></i>',
						},
						previewFileExtSettings : {
							'doc' : function(ext) {
								return ext.match(/(doc|docx)$/i);
							},
							'xls' : function(ext) {
								return ext.match(/(xls|xlsx)$/i);
							},
							'ppt' : function(ext) {
								return ext.match(/(ppt|pptx)$/i);
							},
							'zip' : function(ext) {
								return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
							},
							'htm' : function(ext) {
								return ext.match(/(php|js|css|htm|html)$/i);
							},
							'txt' : function(ext) {
								return ext.match(/(txt|ini|md)$/i);
							},
							'mov' : function(ext) {
								return ext
										.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
							},
							'mp3' : function(ext) {
								return ext.match(/(mp3|wav)$/i);
							},
						},
						ajaxSuccess : function(data) {
							searchFiles();
						},
						uploadAsync : false
					});

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

	// 根据车型获取新车价格信息等
	$("#carTypeId").on('change', function(e) {
		$.ajax({
			type : "POST",
			url : requestContextPath + "/carType/getCarTypeDetail.html",
			data : {
				carTypeId : $("#carTypeId").val(),
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					setCurrencyVal("#newCarPrice", data.object.newCarPrice);
				}
			}
		});
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

	// 车架
	$("#carFrameNum").on('blur', function(e) {
		var carFrameNum = $("#carFrameNum").val();
		carFrameNum = carFrameNum.toUpperCase();
		carFrameNum = carFrameNum.replace(/[OI]/g, '');
		carFrameNum = carFrameNum.replace(/[^0-9a-zA-Z]/g, '');
		$("#carFrameNum").val(carFrameNum);
		if (carFrameNum == null || carFrameNum == undefined) {
			$.msgbox.show({
				'type' : 'error',
				'text' : '车架号不能为空!',
				'title' : '失败'
			});
		} else if (carFrameNum.length != 17) {
			$.msgbox.show({
				'type' : 'error',
				'text' : '车架号必须是17位! 当前[' + carFrameNum.length + ']位',
				'title' : '失败'
			});
		}
	});

	initCarBill();
	// 初始化数据
	function initCarBill() {
		// 先校验
		Util
				.ajax(
						{
							url : requestContextPath
									+ "/carBill/getCarBillVoByPart.html",
							type : "POST",
							data : {
								'carBillId' : $("#hidden_carBillId").val(),
								'applyPart' : '高评'
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
									var userNature = data.object.useNature
											|| '非营运';
									$("#useNature").find(
											"input:radio[value='" + userNature
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
									// $('#applyResult
									// input:radio:checked').attr(
									// 'checked', false);
									// $(
									// "input[type=radio][name=applyResult][value="
									// + data.object.applyResult
									// + "]")
									// .prop("checked", true);
									//
									// $("#applyOpinion").val(
									// data.object.applyOpinion);
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

									var newRateValue = data.object.newRate || 75;
									$("#newRate").find(
											"option[value='" + newRateValue
													+ "']").attr("selected",
											true);
									$("#select2-newRate-container").html(
											newRateValue);

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
									$("#evaluateDate")
											.val(
													data.object.evaluateDate
															|| nowLine);
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

	// 保存数据
	function saveImageAngleInfo() {
		var lastAngle = iviewerMap.get("angle_" + curViewerImagePath);
		if (lastAngle == null) {
			lastAngle = 0;
		}
		var initDeg = $(curThumbCutImage).attr('angle');
		// 保存上一次角度
		if (initDeg != lastAngle) {
			saveCarImage(curImageId, lastAngle);
		}
	}

	// 保存数据
	$("#data_save")
			.click(
					function() {
						// check
						var newCarPrice = $("#newCarPrice").val();
						if (newCarPrice == null || newCarPrice == ''
								|| Number(newCarPrice) <= 0) {
							$.msgbox.show({
								'type' : 'error',
								'text' : '请填写新车价',
								'title' : '失败'
							});
							return;
						}
						
						var specialCarCondition = [];
						if ($('#firedCar').prop("checked")) {
							specialCarCondition.push('火烧车');
						}
						if ($('#wateredCar').prop("checked")) {
							specialCarCondition.push('泡水车');
						}

						// 先校验
						Util
								.ajax(
										{
											url : requestContextPath
													+ "/carBill/editGjCarBill.html",
											type : "POST",
											async : false,
											data : {
												'carBillId' : $(
														"#hidden_carBillId")
														.val(),
												'applyCarBillId' : $(
														"#applyCarBillId")
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
												'specialCarCondition' : specialCarCondition
														.join(),
												'carFrameInfo' : $(
														"#carFrameInfo").val(),
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

											},
											dataType : "json",
											success : function(data) {
												if (data.success) {
													// 保存图片信息
													saveImageAngleInfo();
													saveAllFrameImages();

													$.msgbox
															.show({
																'type' : 'info',
																'text' : data.message,
																'title' : '成功',
																'cancelBtnShow' : false,
																'confirmCb' : function() {
																	parent.window
																			.detailCarBillModalConfirm();
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
										}, "正在保存中");

					});

	// 提交数据
	$("#data_submit")
			.click(
					function() {
						// check
						var newCarPrice = $("#newCarPrice").val();
						if (newCarPrice == null || newCarPrice == ''
								|| Number(newCarPrice) <= 0) {
							$.msgbox.show({
								'type' : 'error',
								'text' : '请填写新车价',
								'title' : '失败'
							});
							return;
						}
						
						var specialCarCondition = [];
						if ($('#firedCar').prop("checked")) {
							specialCarCondition.push('火烧车');
						}
						if ($('#wateredCar').prop("checked")) {
							specialCarCondition.push('泡水车');
						}

						// 先检查，确定后执行保存
						// var nextPartUser =
						// getIdAutoComplete($("#nextPartUser")
						// .val());

						// 先校验
						Util
								.ajax(
										{
											url : requestContextPath
													+ "/carBill/editApplyGjCarBill.html",
											type : "POST",
											data : {
												'carBillId' : $(
														"#hidden_carBillId")
														.val(),
												'applyCarBillId' : $(
														"#applyCarBillId")
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
												// 'nextPartUser' :
												// nextPartUser,
												'specialCarCondition' : specialCarCondition
														.join(),
												'carFrameInfo' : $(
														"#carFrameInfo").val(),

											},
											dataType : "json",
											success : function(data) {
												if (data.success) {

													saveImageAngleInfo();
													saveAllFrameImages();

													// 更新审批计数器
													decIframeWorkSpaceCount(
															"#showGjCount",
															window.parent.parent.document);
													decParentMenuCount(
															"#gjCount",
															window.parent.parent.document);

													$.msgbox
															.show({
																'type' : 'info',
																'text' : data.message,
																'title' : '成功',
																'cancelBtnShow' : false,
																'confirmCb' : function() {
																	parent.window
																			.detailCarBillModalConfirm();
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

	// 撤销数据
	$("#data_cancel").click(function() {

		// 先校验
		Util.ajax({
			url : requestContextPath + "/carBill/cancelAndEditGjBill.html",
			type : "POST",
			data : {
				'carBillId' : $("#hidden_carBillId").val()
			},
			dataType : "json",
			success : function(data) {
				if (data.success) {
					parent.window.detailCarBillModalConfirm();
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
		}, "正在返回中");

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

	dateRangeInit();
	function dateRangeInit() {
		// fastWebDatePickerID = "#his_rangeTime";
		var $dataTime = $("#his_rangeTime");
		$dataTime.daterangepicker({
			startDate : moment().add('days', -5),
			endDate : moment().add('days')
		}).data('daterangepicker').updateInputText();
	}

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