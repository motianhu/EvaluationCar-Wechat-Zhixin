(function($, window) {
	"use strict";
	var $table = $("#user-table");

	/**
	 * 设置合计和展开
	 */
	$(".totalOrOpen").click(function() {
		totalOrOpenClick($(this));
	});

	/**
	 * 合计和展开 点击
	 */
	function totalOrOpenClick($totalOrOpen) {
		var $beforeElem = $totalOrOpen.prev();
		if ($totalOrOpen.hasClass('glyphicon-minus')) {
			$totalOrOpen.removeClass('glyphicon-minus');
			$totalOrOpen.addClass('glyphicon-plus');
			$beforeElem.val('-1-合计');
		} else if ($totalOrOpen.hasClass('glyphicon-plus')) {
			$totalOrOpen.removeClass('glyphicon-plus');
			$totalOrOpen.addClass('glyphicon-minus');
			$beforeElem.val('-2-展开');
		}
	}

	function totalOrOpenValue($totalOrOpenVal) {
		var getVal = $totalOrOpenVal;
		if ($totalOrOpenVal == '-1-合计') {
			getVal = "-1";
		} else if ($totalOrOpenVal == '-2-展开') {
			getVal = '';
		}
		return getVal;
	}

	/**
	 * 获得查询参数
	 * 
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			dateRange : '',
			userName : '',
			pageSource : '',
			dimension : 'pageSource'
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			var userNameVal = totalOrOpenValue($('#userName').val());
			var pageSourceVal = totalOrOpenValue($('#pageSource').val());
			_queryParam.dateRange = $("#dateRange").val();
			_queryParam.userName = userNameVal;
			_queryParam.pageSource = pageSourceVal;

			// 设置表格列
			setTableColumnDisplay(_queryParam.userName, "userName");
			setTableColumnDisplay(_queryParam.pageSource, "urlName");
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

	beautifulSelect2();

	function beautifulSelect2() {
		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}

	dateRangeInit();

	function dateRangeInit() {
		// fastWebDatePickerID = "#dateRange";
		var $dataTime = $("#dateRange");
		$dataTime.daterangepicker({
			startDate : moment().add('days', -5),
			endDate : moment().add('days')
		}).data('daterangepicker').updateInputText();
	}

	chartVisitor();

	function chartVisitor() {
		var chartVo = getVisitorChartVo();
		if (chartVo == null && chartVo.length <= 0) {
			return;
		}
		$('#containerVisitor').highcharts({
			title : {
				text : '用户访问页面统计',
				x : -20
			// center
			},
			subtitle : {
				text : '',
				x : -20
			},
			xAxis : {
				categories : chartVo.x
			},
			yAxis : {
				title : {
					text : '访问次数'
				},
				plotLines : [ {
					value : 0,
					width : 1,
					color : '#808080'
				} ]
			},
			tooltip : {
				valueSuffix : ''
			},
			legend : {
				layout : 'horizontal',
				align : 'center',
				verticalAlign : 'bottom',
				borderWidth : 0
			},
			series : chartVo.info
		});
	}

	function getVisitorChartVo() {
		var chartVo = {};
		Util.ajax({
			url : requestContextPath + "/pagevisitor/getPageVisitorChart.html",
			data : getParam(),
			async : false,
			dataType : "json",
			success : function(data) {
				chartVo = data;
			}
		});
		return chartVo;
	}

	/**
	 * 设置表格列是否显示， 如果为合计，那么不显示列
	 * 
	 * @param requestVal
	 *            请求字段
	 * @param tableColumnName
	 *            表格字段名称
	 */
	function setTableColumnDisplay(requestVal, tableColumnName) {
		if (requestVal != null && requestVal == -1) {
			$table.bootstrapTable('hideColumn', tableColumnName);
		} else {
			$table.bootstrapTable('showColumn', tableColumnName);
		}
	}

	/*
	 * 点击查询
	 */
	$('#queryBtn').click(function() {
		// 图形
		chartVisitor();

		$table.bootstrapTable('refresh', {
			jsonData : getParam(),
			url : requestContextPath + "/pagevisitor/getPageVisitorList.html"
		});
	});

})(jQuery, window);