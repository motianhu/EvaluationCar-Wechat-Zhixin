~ function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var $createContainer = $('#for_create_container');
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;

	/**
	 * @param {Object} obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			name: "",
			fileType: "xls"
		}
		var toString = function(o) {
			for (var x in o) {
				if (o[x] && o[x] instanceof Array) o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.name = $("#name_ipt").val().trim();
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

	// 增加字典字段
	function addDict() {
		$.ajax({
			type: "POST",
			url: requestContextPath + "/areainfo/add.html",
			data: {
				name: $("#add_name_ipt").val().trim(),
			},
			success: function(data) {
				if (data.success) {
					$createContainer.hide();
					search();
				} else {
					$.msgbox.show({
						'type': 'error',
						'text': data.message,
						'title': '错误'
					});
				}
			}
		});
	}

	/**导出记录*/
	window.exportData = function() {
		if ($jTable.getAttributes().total === 0) {
			$.msgbox.show({
				'type': 'info',
				'text': '没有可导出的记录',
				'title': '提示'
			});
			return;
		}
		Util.ajax({
			url: requestContextPath + "/incident/export.html",
			data: getParam(),
			cache: false,
			dataType: "text",
			success: function(data) {
				location.href = data;
			}
		}, "正在导出，请稍等...");
	}

	function search() {
		$jTable.refreshTableData(getParam());
	}

	$(".searchbox input").keydown(function(event) {
		if (event.keyCode == 13) {
			search();
		}
	});

	$("#search_btn").click(search);
	$("#create_btn").click(function() {
		$createContainer.show();
	});
	$("#create_confirm_btn").click(addDict);
	$("#create_cancel_btn").click(function() {
		$createContainer.hide();
	});

	/*
	 * 表格初始化，这里为了测试数据，url写的fake
	 **/
	$jTable = $table.table({
		ajaxUrl: requestContextPath + "/areainfo/getList.html",
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
					list.push("<span class='icon-edit editrow' rowid='" + curRow.id + "'>" + curRow.id + "</span>"); //编号
					list.push(curRow.name);
					dataList.push(list);
				};
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	/**行展开*/
	$table.on("click", '.editrow', function(e) {
		e.stopPropagation();
		var $this = $(this);
		var $thisTr = $this.parent().parent();
		var $thatTr = $thisTr.next();
		if (!$thatTr.find(".arrow").length) {
			var id = $this.attr("rowid");
			var curData = tableData[id];
			var temp = rowTemplateHtml.replace(/{rowid}/g, curData.id)
				.replace("{name}", curData.name || "")
			var trHtml = unfoldTrHtml.replace("{0}", temp);
			$(".row-edit-container").remove();
			$thisTr.after($(trHtml));
		} else {
			return false;
		}
	});

	/**行编辑-确定*/
	$table.on("click", '#dict_detail_confirm', function(e) {
		$.ajax({
			type: "POST",
			url: requestContextPath + "/areainfo/edit.html",
			data: {
				id:  $("#edit_id").val().trim(),
				name: $("#edit_name_ipt").val().trim(),
			},
			success: function(data) {
				if (data.success) {
					$(".row-edit-container").remove();
					search();
				} else {
					$.msgbox.show({
						'type': 'error',
						'text': data.message,
						'title': '错误'
					});
				}
			}
		});
	});

	/**行收缩-取消*/
	$table.on("click", '#dict_detail_cancel', function(e) {
		$(".row-edit-container").remove();
	});
}(jQuery, window)