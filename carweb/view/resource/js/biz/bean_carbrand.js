~ function($, window) {
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
			  theme: "classic"
		});
	};
	
	// 中文转拼音
	$("#brandName").blur(function() {
		var brandName = $("#brandName").val() || '';
		brandName = brandName.trim();
		var pinyin = Util.getChineseCharacterPinyin(brandName);
		pinyin = pinyin.toUpperCase();
		pinyin = pinyin.substr(0,1);
		$("#brandFirstName").val(pinyin);
	});
	
	/**
	 * @param {Object} obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			brandName: "",
			brandFirstName: "",
			fileType: "xls"
		}
		var toString = function(o) {
			for (var x in o) {
				if (o[x] && o[x] instanceof Array) o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.brandName = $("#query_brandName").val().trim();
			// _queryParam.brandFirstName = $("#query_brandFirstName").val().trim();

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
		var brandName = $("#brandName").val().trim();
		var brandFirstName = $("#brandFirstName").val().trim() || '';
		Util.ajax({
			type: "POST",
			url: requestContextPath + "/carBrand/addCarBrand.html",
			data: {
				brandName: brandName,
				brandFirstName: brandFirstName,
			},
			dataType : 'json',
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
		}, "提交中");
	}

	/**导出记录*/
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
	//	}

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
	 **/
	$jTable = $table.table({
		ajaxUrl: requestContextPath + "/carBrand/getCarBrandList.html",
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
					list.push({
						checked : false,
						rowid : curRow.id
					});
					list.push("<span class='icon-edit editrow' rowid='" + curRow.id + "'>" + curRow.id + "</span>"); //编号
					list.push(curRow.brandName);
					list.push(curRow.brandFirstName);
					dataList.push(list);
				};
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
			type: "POST",
			url: requestContextPath + "/carBrand/deleteCarBrand.html",
			data: {
				ids:	ids
			},
			dataType : 'json',
			success: function(data) {
				if (data.success) {
					search();
				} else {
					$.msgbox.show({
						'type': 'error',
						'text': data.message,
						'title': '错误'
					});
				}
			}
		}, "提交中");
		
	}
	
	$("#del_btn").on('click', function(e) {
		var rowids = getCheckedRows();
		
		if (rowids == null || rowids.ids.length <=0) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
		}  else {
			$.msgbox.show({
				'type': 'info',
				'text': "确定删除数据？",
				'title': '提示',
				'confirmCb' : function() {
					deleteDatas(rowids);
				}
			});
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
			
			var $next = $thisTr.next();
			
			var isChecked = curData.status ? 'checked' : "";
			var temp = rowTemplateHtml.replace(/{rowid}/g, curData.id)
				.replace("{edit_brandName}", curData.brandName || "")
				.replace("{edit_brandFirstName}", curData.brandFirstName || "")
			var trHtml = unfoldTrHtml.replace("{0}", temp);
			$(".row-edit-container").remove();
			$thisTr.after($(trHtml));
			
			// 中文转拼音
			$("#edit_brandName").blur(function() {
				var brandName = $("#edit_brandName").val() || '';
				brandName = brandName.trim();
				var pinyin = Util.getChineseCharacterPinyin(brandName);
				pinyin = pinyin.toUpperCase();
				pinyin = pinyin.substr(0,1);
				$("#edit_brandFirstName").val(pinyin);
			});
			
			
		} else {
			return false;
		}
	});

	/**行编辑-确定*/
	$table.on("click", '#dict_detail_confirm', function(e) {
		var brandName = $('#edit_brandName').val().trim();
		var brandFirstName =$('#edit_brandFirstName').val().trim();
		var id = $(this).attr("rowid");
		Util.ajax({
			type: "POST",
			url: requestContextPath + "/carBrand/editCarBrand.html",
			data: {
				id : id,
				brandName:  brandName,
				brandFirstName: brandFirstName,
			},
			dataType : 'json',
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
		},"提交中");
	});

	/**行收缩-取消*/
	$table.on("click", '#dict_detail_cancel', function(e) {
		$(".row-edit-container").remove();
	});
	
}(jQuery, window)