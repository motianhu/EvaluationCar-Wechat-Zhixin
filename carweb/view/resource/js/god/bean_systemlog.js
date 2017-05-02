~ function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var $createContainer = $('#for_create_container');
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;
	var $detail_modal = $("#detail_modal"); 

	dateRangeInit();

	function dateRangeInit() {
		// fastWebDatePickerID = "#dateRange";
		var $dataTime = $("#dateRange");
		$dataTime.daterangepicker({
			startDate : moment().add('days', -5),
			endDate : moment().add('days')
		}).data('daterangepicker').updateInputText();
	}
	
	beautifulSelect2();
	
	function beautifulSelect2() {
		
		$(".beautifulSelect2").select2({
			  theme: "classic"
		});
	};
	
	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			dateRange : "",
			detailInfo: "",
			fileType: "xls"
		}
		var toString = function(o) {
			for (var x in o) {
				if (o[x] && o[x] instanceof Array) o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.dateRange = $("#dateRange").val().trim();
			_queryParam.detailInfo = $("#content").val().trim();
			if (arguments.length != 0) {
				var args = arguments[0];
				for (var x in args) {
					if (_queryParam[x]) {
						_queryParam[x] = args[x];
					}
				}
			}
			toString(_queryParam);
			return _queryParam;
		};
	})();


	function search() {
		$jTable.refreshTableData(getParam());
	}

	$(".searchbox input").keydown(function(event) {
		if (event.keyCode == 13) {
			search();
		}
	});

	$("#searchBtn").click(search);

	/*
	 * 表格初始化，这里为了测试数据，url写的fake
	 */
	$jTable = $table.table({
		ajaxUrl: requestContextPath + "/systemlog/getList.html",
		paramsJson: getParam(),
		pageKey: {
			total: "total",
			pageSize: "pageSize",
			curPage: "curPage"
		},
		tbodyMaker: function(data) {
			tableData = {};
			var dataSet = {
				total: data.total,
				list: ""
			};
			var dataList = [];
			var items = data.data;
			if (items) {
				for (var i = 0, len = items.length; i < len; i++) {
					var list = [];
					var curRow = items[i];
					tableData[curRow.id] = curRow;
					list.push("<span rowid='" + curRow.id + "'>" + curRow.id + "</span>"); // 编号
					list.push(curRow.createTime);
					list.push("<a href='#' class='openShortConent' rowid='" + curRow.id + "'><span>" +curRow.shortInfo + "</span></a>"); // 编号
					dataList.push(list);
				};
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	
	/***  打开消息内容  **/
	$table.on("click", '.openShortConent', function(e) {
		
		var $this = $(this);
		var id = $this.attr("rowid");
 
		$detail_modal.modal('show');

		if (id != null && id.length >0) {
			var curData = tableData[id];
			$("#detail_title").html(curData.shortInfo);
			$("#detail_content").html(curData.detailInfo);
		}
		
	});

	
}(jQuery, window)