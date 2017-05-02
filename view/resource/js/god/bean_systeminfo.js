~function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var $createContainer = $('#for_create_container');
	var $systemContainer = $('#for_system_container');
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;

	var loadedSystemInfo = false;

	beautifulSelect2();

	function beautifulSelect2() {

		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}
	;

	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			threadState : "",
			fileType : "xls"
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.threadState = $("#threadStateSelect").val();
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

	$("#system_refresh_btn").click(function() {
		Util.ajax({
			type : "POST",
			url : requestContextPath + "/systeminfomanager/getSystemInfo.html",
			data : {},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					// 刷新
					$("#tableCpu").html(data.object.cpu);
					$("#tableMem").html(data.object.memory);
					$("#tableFile").html(data.object.file);

				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		}, "正在刷新，请稍等...");

	});

	getSystemInfo();
	// 增加字典字段
	function getSystemInfo() {
		Util.ajax({
			type : "POST",
			url : requestContextPath + "/systeminfomanager/getSystemInfo.html",
			data : {},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					$("#jdk_info").html(data.object.jdkInfo);
					$("#system_info").html(
							"<h3>CPU</h3><div>" + data.object.cpu
									+ "</div><h3>内存</h3><div>"
									+ data.object.memory
									+ "</div><h3>文件系统</h3><div>"
									+ data.object.file + "</div>");
					$("#system_info").accordion({
						active : 0,
						header : "h3",
						heightStyle : "100%"
					});
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		}, "正在刷新，请稍等...");
	}

	/** 导出记录 */
	window.exportData = function() {
		if ($jTable.getAttributes().total === 0) {
			$.msgbox.show({
				'type' : 'info',
				'text' : '没有可导出的记录',
				'title' : '提示'
			});
			return;
		}
		Util.ajax({
			url : requestContextPath + "/dictmanager/exportDict.html",
			data : getParam(),
			cache : false,
			dataType : "text",
			success : function(data) {
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

	$("#searchBtn").click(search);

	$("#create_btn").click(function() {
		if ($createContainer.is(':hidden')) {
			$createContainer.show();
		} else {
			$createContainer.hide();
		}
	});

	$("#create_cancel_btn").click(function() {
		$createContainer.hide();
	});

	$("#system_btn").click(function() {
		if ($systemContainer.is(':hidden')) {
			$systemContainer.show();
		} else {
			$systemContainer.hide();
		}
	});

	$("#system_cancel_btn").click(function() {
		$systemContainer.hide();
	});

	/*
	 * 表格初始化，这里为了测试数据，url写的fake
	 */
	$jTable = $table
			.table({
				ajaxUrl : requestContextPath
						+ "/systeminfomanager/getThreadsList.html",
				paramsJson : getParam(),
				// 线程全部显示
				pageKey : {
					total : "total",
					pageSize : 10000,
					curPage : 1
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
							tableData[curRow.threadId] = curRow;
							list.push(curRow.threadId); // threadId
							list.push(curRow.threadName);
							list.push(curRow.threadClass);
							list.push(curRow.threadState);
							dataList.push(list);
						}
						;
					}
					dataSet.list = dataList;
					return dataSet;
				}
			});

}(jQuery, window)