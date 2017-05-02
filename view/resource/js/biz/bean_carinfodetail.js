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
	
	dateRangeInit();
	function dateRangeInit() {
		// fastWebDatePickerID = "#dateRange";
		var $dataTime = $("#dateRange");
		$dataTime.daterangepicker({
			startDate : moment().add('days', -5),
			endDate : moment().add('days')
		}).data('daterangepicker').updateInputText();
	}
	

	dateInit();
	function dateInit() {
		$('.datepicker').datepicker({
		    format: 'yyyy-mm-dd',
		    language: 'zh-CN',
		})
	}
	
	/**
	 * @param {Object} obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			title: "",
			content: "",
			readedUser:'',
			createUser:'',
			status: "",
			fileType: "xls"
		}
		var toString = function(o) {
			for (var x in o) {
				if (o[x] && o[x] instanceof Array) o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.code = $("#code").val().trim();
			_queryParam.parentCode = $("#parentCode").val().trim();
			_queryParam.codeType = $("#codeType").val().trim();
			_queryParam.mainItem = $("#mainItem").val().trim();
			_queryParam.subItem = $("#subItem").val().trim();
			_queryParam.status = $("#validSelect").val();
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
		var code = $("#add_code").val().trim();
		var parentCode = $("#add_parentCode").val().trim() || -1;
		var codeType = $("#add_codeType").val().trim();
		var mainItem = $("#add_mainItem").val().trim();
		var subItem = $("#add_subItem").val().trim();
		var description = $("#add_description").val();
		var status = $('#statusCreate').prop("checked") ? 1 : 0;
		$.ajax({
			type: "POST",
			url: requestContextPath + "/dictmanager/addDict.html",
			data: {
				code: code,
				parentCode: parentCode,
				codeType: codeType,
				mainItem: mainItem,
				subItem: subItem,
				description: description,
				status: status
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
			url: requestContextPath + "/dictmanager/exportDict.html",
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

	$("#searchBtn").click(search);
	
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
		ajaxUrl: requestContextPath + "/common/getDictList.html",
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
					tableData[curRow.code] = curRow;
					list.push("<span class='icon-edit editrow' rowid='" + curRow.code + "'>" + curRow.code + "</span>"); //编号
					list.push(curRow.parentCode);
					list.push(curRow.codeType);
					list.push(curRow.mainItem);
					list.push(curRow.subItem);
					list.push(curRow.createUser); 
					list.push(curRow.status ? '有效' : '无效');
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
			
			var $next = $thisTr.next();
			
			var isChecked = curData.status ? 'checked' : "";
			var temp = rowTemplateHtml.replace(/{rowid}/g, curData.id)
				.replace("{edit_code}", curData.code || "")
				.replace("{edit_parentCode}", curData.parentCode || "")
				.replace("{edit_codeType}", curData.codeType || "")
				.replace("{edit_mainItem}", curData.mainItem || "")
				.replace("{edit_subItem}", curData.subItem || "")
				.replace("{edit_description}", curData.description || "")
				.replace("{edit_checked}", isChecked)
			var trHtml = unfoldTrHtml.replace("{0}", temp);
			$(".row-edit-container").remove();
			$thisTr.after($(trHtml));
			
			$("#edit_content_div").initwysiwyg();
			$("#edit_content").html(curData.content || "");
		
			
		} else {
			return false;
		}
	});

	/**行编辑-确定*/
	$table.on("click", '#dict_detail_confirm', function(e) {
		var code = $('#edit_code').val().trim();
		var parentCode =$('#edit_parentCode').val().trim();
		var codeType =$('#edit_codeType').val().trim();
		var mainItem =$('#edit_mainItem').val().trim();
		var subItem =$('#edit_subItem').val().trim();
		var description =$('#edit_description').val();
		var status = $('#edit_status').prop("checked") ? 1 : 0;
		$.ajax({
			type: "POST",
			url: requestContextPath + "/dictmanager/editDict.html",
			data: {
				code:  code,
				parentCode: parentCode,
				codeType: codeType,
				mainItem: mainItem,
				subItem: subItem,
				description: description,
				status: status
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
		});
	});

	/**行收缩-取消*/
	$table.on("click", '#dict_detail_cancel', function(e) {
		$(".row-edit-container").remove();
	});
	
}(jQuery, window)