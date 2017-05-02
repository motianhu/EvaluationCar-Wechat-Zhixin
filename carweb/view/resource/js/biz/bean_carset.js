~function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var $createContainer = $('#for_create_container');
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;

	beautifulSelect2();

	function beautifulSelect2() {

		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}

	initCarBrand(".brandName_sel");

	// 中文转拼音
	$("#carSetName").blur(function() {
		var carSetName = $("#carSetName").val() || '';
		carSetName = carSetName.trim();
		var pinyin = Util.getChineseCharacterPinyin(carSetName);
		pinyin = pinyin.toUpperCase();
		pinyin = pinyin.substr(0, 1);
		$("#carSetFirstName").val(pinyin);
	});

	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			carBrandId : "",
			carSetName : "",
			carSetFirstName : "",
			fileType : "xls"
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.carSetName = $("#query_carSetName").val().trim();
			_queryParam.carBrandId = $("#query_carBrandId").val().trim();

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

	// 增加字典字段
	function addDict() {
		var carBrandId = $("#carBrandId").val().trim();
		var carSetName = $("#carSetName").val().trim();
		var carSetFirstName = $("#carSetFirstName").val().trim() || '';
		Util.ajax({
			type : "POST",
			url : requestContextPath + "/carSet/addCarSet.html",
			data : {
				carBrandId : carBrandId,
				carSetName : carSetName,
				carSetFirstName : carSetFirstName,
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					$createContainer.hide();
					search();
					clearForm();
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		}, "提交中");
	}

	/** 导出记录 */
	// window.exportData = function() {
	// if ($jTable.getAttributes().total === 0) {
	// $.msgbox.show({
	// 'type': 'info',
	// 'text': '没有可导出的记录',
	// 'title': '提示'
	// });
	// return;
	// }
	// Util.ajax({
	// url: requestContextPath + "/dictmanager/exportDict.html",
	// data: getParam(),
	// cache: false,
	// dataType: "text",
	// success: function(data) {
	// location.href = data;
	// }
	// }, "正在导出，请稍等...");
	// }
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
	$("#create_confirm_btn").click(addDict);
	$("#create_cancel_btn").click(function() {
		$createContainer.hide();
	});

	/*
	 * 表格初始化，这里为了测试数据，url写的fake
	 */
	$jTable = $table.table({
		ajaxUrl : requestContextPath + "/carSet/getCarSetList.html",
		paramsJson : getParam(),
		pageKey : {
			total : "total",
			pageSize : "pageSize",
			curPage : "curPage"
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
					list.push({
						checked : false,
						rowid : curRow.id
					});
					list.push("<span class='icon-edit editrow' rowid='"
							+ curRow.id + "'>" + curRow.id + "</span>"); // 编号
					list.push(curRow.carBrandName);
					list.push(curRow.carSetName);
					list.push(curRow.carSetFirstName);
					dataList.push(list);
				}
				;
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	function getCheckedRows() {
		var ids = [];
		var $checkboxs = $table.find("tbody").find(".table-check");
		for (var i = 0; i < $checkboxs.length; i++) {
			var cur = $($checkboxs[i]);
			ids.push(cur.attr("rowid"));
		}
		return {
			ids : ids
		};
	}

	function deleteDatas(rowids) {
		var ids = rowids.ids;
		ids = ids.join();
		Util.ajax({
			type : "POST",
			url : requestContextPath + "/carSet/deleteCarSet.html",
			data : {
				ids : ids
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					search();
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		}, "提交中");

	}

	$("#del_btn").on('click', function(e) {
		var rowids = getCheckedRows();

		if (rowids == null || rowids.ids.length <= 0) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
		} else {
			$.msgbox.show({
				'type' : 'info',
				'text' : "确定删除数据？",
				'title' : '提示',
				'confirmCb' : function() {
					deleteDatas(rowids);
				}
			});
		}
	});

	/** 清空input数据* */
	function clearForm() {
		$("#carSetName").val("");
		$("#carSetFirstName").val("");
	}

	/** 行展开 */
	$table.on("click", '.editrow', function(e) {
		e.stopPropagation();
		var $this = $(this);
		var $thisTr = $this.parent().parent();
		var $thatTr = $thisTr.next();
		if (!$thatTr.find(".arrow").length) {
			var id = $this.attr("rowid");
			var curData = tableData[id];

			var $next = $thisTr.next();

			var isChecked = curData.status ? 'checked' : "";
			var temp = rowTemplateHtml.replace(/{rowid}/g, curData.id).replace(
					"{edit_carSetName}", curData.carSetName || "").replace(
					"{edit_carSetFirstName}", curData.carSetFirstName || "")
			var trHtml = unfoldTrHtml.replace("{0}", temp);
			$(".row-edit-container").remove();
			$thisTr.after($(trHtml));

			$(".beautifulSelect2").select2({
				theme : "classic"
			});

			$("#carBrandId option").each(function() {
				var oValue = $(this).val().toString();
				var oText = $(this).text().toString();
				var option = $("<option>").val(oValue).text(oText);
				$("#edit_carBrandId").append(option);
			});
			// 设置值
			$("#edit_carBrandId").find(
					"option[value=" + curData.carBrandId + "]").attr(
					"selected", true);
			$("#select2-edit_carBrandId-container").html(curData.carBrandName);

			// 中文转拼音
			$("#edit_carSetName").blur(function() {
				var carSetName = $("#edit_carSetName").val() || '';
				carSetName = carSetName.trim();
				var pinyin = Util.getChineseCharacterPinyin(carSetName);
				pinyin = pinyin.toUpperCase();
				pinyin = pinyin.substr(0, 1);
				$("#edit_carSetFirstName").val(pinyin);
			});

		} else {
			return false;
		}
	});

	/** 行编辑-确定 */
	$table.on("click", '#dict_detail_confirm', function(e) {
		var carSetName = $('#edit_carSetName').val().trim();
		var carSetFirstName = $('#edit_carSetFirstName').val().trim();
		var carBrandId = $("#edit_carBrandId").val().trim();
		var id = $(this).attr("rowid");
		Util.ajax({
			type : "POST",
			url : requestContextPath + "/carSet/editCarSet.html",
			data : {
				id : id,
				carBrandId : carBrandId,
				carSetName : carSetName,
				carSetFirstName : carSetFirstName,
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					$(".row-edit-container").remove();
					search();
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		}, "提交中");
	});

	/** 行收缩-取消 */
	$table.on("click", '#dict_detail_cancel', function(e) {
		$(".row-edit-container").remove();
	});

}(jQuery, window)