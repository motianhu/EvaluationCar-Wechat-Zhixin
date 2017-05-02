$(function() {

	/* 获取时间 */
	function getCurrentTime() {
		var date = new Date();
		var dateObj = new Date();
		dateObj.setFullYear(date.getFullYear());
		dateObj.setMonth(date.getMonth());
		dateObj.setDate(date.getDate());
		var startDataObj = new Date();
		startDataObj.setFullYear(date.getFullYear());
		startDataObj.setMonth(date.getMonth() - 1);
		startDataObj.setDate(date.getDate());
		var time1 = dateObj.Format("yyyyMM");
		var time2 = startDataObj.Format("yyyyMM");
		var currentYear = date.getFullYear() + 3;
		return {
			startMon : time2,
			endMon : time1,
			year : currentYear
		}
	}

	var curTimeObj = getCurrentTime();

	function initMonthDataPicker($selector) {
		$selector.datepicker({
			language : "zh-CN",
			format : 'yyyymm',
			viewMode : "months",
			minViewMode : "months",
			autoclose : true,
		}).on("hide", function(e) {
			if (!this.value) {
				$(this).datepicker('show');
			}
		}).datepicker('setDate', curTimeObj.endMon.replace(/(.{4})/, "$1-"));
	}
	function initYearDataPicker($selector) {
		$selector.datepicker({
			language : "zh-CN",
			format : 'yyyy',
			viewMode : "years",
			minViewMode : "years",
			autoclose : true,
		}).on("hide", function(e) {
			if (!this.value) {
				$(this).datepicker('show');
			}
		}).datepicker('setDate', curTimeObj.endMon.replace(/(.{4})/, "$1-"));
	}
	// 逗号分开可以多个
	initMonthDataPicker($("#user_month_select"));

	// 导出用户统计数据
	$('#userStatBtn').click(function() {
		// 点击导出
		exportUsersStatData();
	});

	/** 区域统计导出记录 */
	window.exportUsersStatData = function() {
		var month = $("#user_month_select").val();
		Util.ajax({
			url : requestContextPath + "/carBill/export/exportUserStat.html",
			data : {
				"rangeTime" : month,
				"fileType" : "xls"
			},
			cache : false,
			dataType : "text",
			success : function(data) {
				location.href = window.location.protocol + "//"
						+ window.location.host + requestContextPath + "/"
						+ data;
			}
		}, "正在导出，请稍等...");
	}

	function dateRangeDayInit(dateComId) {
		var $dataTime = $(dateComId);
		$dataTime.daterangepicker({
			format : "YYYYMMDD",
			startDate : moment().add('days', -5),
			endDate : moment().add('days')
		}).data('daterangepicker').updateInputText();
	}
	// function dateRangeMonthInit(dateComId) {
	// var $dataTime = $(dateComId);
	// $dataTime.daterangepicker({
	// format : "YYYYMM",
	// startDate : moment().add('days', -5),
	// endDate : moment().add('days')
	// }).data('daterangepicker').updateInputText();
	// }
	// function dateRangeYearInit(dateComId) {
	// var $dataTime = $(dateComId);
	// $dataTime.daterangepicker({
	// format : "YYYY",
	// startView : 3,
	// minView : 3,
	// startDate : moment().add('days', -5),
	// endDate : moment().add('days')
	// }).data('daterangepicker').updateInputText();
	// }
	// 公司按天
	dateRangeDayInit("#company_day_select");
	// 公司按月
	initMonthDataPicker($("#company_month_select_start"));
	initMonthDataPicker($("#company_month_select_end"));
	// 公司按年
	initYearDataPicker($("#company_year_select_start"));
	initYearDataPicker($("#company_year_select_end"));

	// 公司进度
	window.exportCompanyProgressStatData = function(dateType, startTime,
			endTime) {
		Util.ajax({
			url : requestContextPath + "/carBill/exportCompanyProgress.html",
			data : {
				"dateType" : dateType,
				"startTime" : startTime,
				"endTime" : endTime,
				"fileType" : "xls"
			},
			cache : false,
			dataType : "text",
			success : function(data) {
				location.href = window.location.protocol + "//"
						+ window.location.host + requestContextPath + "/"
						+ data;
			}
		}, "正在导出，请稍等...");
	}

	// 导出用户统计数据
	$('#companyDayStatBtn').click(function() {
		var _dateRange = $('#company_day_select').val();
		var dateArray = _dateRange.split(" - ");
		var startTime = dateArray[0];
		var endTime = dateArray[1];
		startTime = convertString2Date(startTime);
		endTime = convertString2Date(endTime);
		exportCompanyProgressStatData("d", startTime, endTime);
	});
	$('#companyMonthStatBtn').click(function() {
		var startTime = $('#company_month_select_start').val();
		var endTime = $('#company_month_select_end').val();
		startTime = convertString2Date(startTime);
		endTime = convertString2Date(endTime);
		exportCompanyProgressStatData("m", startTime, endTime);
	});
	$('#companyYearStatBtn').click(function() {
		var startTime = $('#company_year_select_start').val();
		var endTime = $('#company_year_select_start').val();
		exportCompanyProgressStatData("y", startTime, endTime);
	});

	// 公司进度
	window.exportRefuseReasonStatData = function() {
		Util.ajax({
			url : requestContextPath
					+ "/carBill/export/exportRefuseReason.html",
			data : {
				"fileType" : "xls"
			},
			cache : false,
			dataType : "text",
			success : function(data) {
				location.href = window.location.protocol + "//"
						+ window.location.host + requestContextPath + "/"
						+ data;
			}
		}, "正在导出，请稍等...");
	}
	$('#refuseBtn').click(function() {
		// 点击导出
		exportRefuseReasonStatData();
	});

	// 各省金融公司 导出统计数据
	$('#companyAreaDayStatBtn').click(function() {
		var _dateRange = $('#company_area_day_select').val();
		var dateArray = _dateRange.split(" - ");
		var startTime = dateArray[0];
		var endTime = dateArray[1];
		startTime = convertString2Date(startTime);
		endTime = convertString2Date(endTime);
		exportCompanyAreaStatData("d", startTime, endTime);
	});
	$('#companyAreaMonthStatBtn').click(function() {
		var startTime = $('#company_area_month_select_start').val();
		var endTime = $('#company_area_month_select_end').val();
		startTime = convertString2Date(startTime);
		endTime = convertString2Date(endTime);
		exportCompanyAreaStatData("m", startTime, endTime);
	});
	$('#companyAreaYearStatBtn').click(function() {
		var startTime = $('#company_area_year_select_start').val();
		var endTime = $('#company_area_year_select_start').val();
		exportCompanyAreaStatData("y", startTime, endTime);
	});

	// 公司按天
	dateRangeDayInit("#company_area_day_select");
	// 公司按月
	initMonthDataPicker($("#company_area_month_select_start"));
	initMonthDataPicker($("#company_area_month_select_end"));
	// 公司按年
	initYearDataPicker($("#company_area_year_select_start"));
	initYearDataPicker($("#company_area_year_select_end"));

	// 公司进度
	window.exportCompanyAreaStatData = function(dateType, startTime, endTime) {
		Util.ajax({
			url : requestContextPath + "/carBill/exportStatCompanyArea.html",
			data : {
				"dateType" : dateType,
				"startTime" : startTime,
				"endTime" : endTime,
				"fileType" : "xls"
			},
			cache : false,
			dataType : "text",
			success : function(data) {
				location.href = window.location.protocol + "//"
						+ window.location.host + requestContextPath + "/"
						+ data;
			}
		}, "正在导出，请稍等...");
	}

	// 各省金融公司时长 导出统计数据
	$('#companyApplyTimeDayStatBtn').click(function() {
		var _dateRange = $('#company_applytime_day_select').val();
		var dateArray = _dateRange.split(" - ");
		var startTime = dateArray[0];
		var endTime = dateArray[1];
		startTime = convertString2Date(startTime);
		endTime = convertString2Date(endTime);
		exportCompanyApplyTimeStatData("d", startTime, endTime);
	});
	$('#companyApplyTimeMonthStatBtn').click(function() {
		var startTime = $('#company_applytime_month_select_start').val();
		var endTime = $('#company_applytime_month_select_end').val();
		startTime = convertString2Date(startTime);
		endTime = convertString2Date(endTime);
		exportCompanyApplyTimeStatData("m", startTime, endTime);
	});
	$('#companyApplyTimeYearStatBtn').click(function() {
		var startTime = $('#company_applytime_year_select_start').val();
		var endTime = $('#company_applytime_year_select_start').val();
		exportCompanyApplyTimeStatData("y", startTime, endTime);
	});

	// 公司按天
	dateRangeDayInit("#company_applytime_day_select");
	// 公司按月
	initMonthDataPicker($("#company_applytime_month_select_start"));
	initMonthDataPicker($("#company_applytime_month_select_end"));
	// 公司按年
	initYearDataPicker($("#company_applytime_year_select_start"));
	initYearDataPicker($("#company_applytime_year_select_end"));

	// 公司进度
	window.exportCompanyApplyTimeStatData = function(dateType, startTime,
			endTime) {
		Util.ajax({
			url : requestContextPath
					+ "/carBill/exportCompanyApplyTimeStat.html",
			data : {
				"dateType" : dateType,
				"startTime" : startTime,
				"endTime" : endTime,
				"fileType" : "xls"
			},
			cache : false,
			dataType : "text",
			success : function(data) {
				location.href = window.location.protocol + "//"
						+ window.location.host + requestContextPath + "/"
						+ data;
			}
		}, "正在导出，请稍等...");
	}

})