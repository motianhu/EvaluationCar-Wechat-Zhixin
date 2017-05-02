~function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
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

	dateRangeInit();

	function dateRangeInit() {
		// fastWebDatePickerID = "#query_rangeTime";
		var $dataTime = $("#query_rangeTime");
		$dataTime.daterangepicker({
			startDate : moment().add('days', -5),
			endDate : moment().add('days')
		}).data('daterangepicker').updateInputText();
	}

	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			carBillId : '',
			applyCarBillId : '',
			carNo : '',
			carBrandName : '',
			carSetName : '',
			carTypeName : '',
			carFrameNum : '',
			status : '',
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
			_queryParam.carBillId = $("#query_carBillId").val();
			_queryParam.applyCarBillId = $("#query_applyCarBillId").val();
			_queryParam.carNo = $("#query_carNo").val();
			_queryParam.carBrandName = $("#query_carBrandName").val();
			_queryParam.carSetName = $("#query_carSetName").val();
			_queryParam.carTypeName = $("#query_carTypeName").val();
			_queryParam.carFrameNum = $("#query_carFrameNum").val();
			_queryParam.status = $("#query_status").val();
			_queryParam.rangeTime = $("#query_rangeTime").val();
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
		ajaxUrl : requestContextPath + "/carBill/getCjBillList.html",
		paramsJson : getParam(),
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
					list.push(curRow.applyCarBillId);
					list.push(curRow.companyName);
					list.push(curRow.carFrameNum);
					list.push(curRow.statusName);
					list.push(curRow.carBrandName);
					list.push(curRow.carSetName);
					list.push(curRow.carTypeName);
					list.push(curRow.csUserName);
					list.push(curRow.curOperatorName);
					list.push(curRow.zjUserName);
					list.push(curRow.gjUserName);
					list.push(curRow.applyResultName);
					list.push(curRow.curApplyOpinion);

					dataList.push(list);
				}
				;
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	function showDetail() {
		var tr = $jTable.getSelectedRow();
		if (tr == null) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
		} else {
			var carBillId = $(tr).find("td span").attr("rowid");

			// 先校验
			$
					.ajax({
						url : requestContextPath
								+ "/carBill/getAndEditCjBill.html",
						type : "POST",
						data : {
							'carBillId' : carBillId,
						},
						dataType : "json",
						success : function(data) {
							if (!data.success) {
								$.msgbox.show({
									'type' : 'error',
									'text' : data.message,
									'title' : '错误'
								});
							} else {
								$("#detail_modal").modal("show");
								var $editFrame = $("#displayimagesframe");
								$editFrame
										.attr(
												"src",
												requestContextPath
														+ "/view/admin/canvas/cj_carbilldetail.jsp?carBillId="
														+ carBillId);
								$editFrame.attr("width",
										document.body.scrollWidth - 10);
								// $editFrame.attr("height",
								// document.body.scrollHeight - 50);
								$editFrame
										.attr(
												"height",
												document.documentElement.clientHeight - 50);

							}
						},
						complete : function(xhr, textStatus) {
						}
					});

		}

	}

	// 自定义右键上下文
	// 数据
	var objDelete = {
		text : "删除",
		func : function() {
			var tr = $jTable.getSelectedRow();
			if (tr == null) {
				$.msgbox.show({
					'type' : 'error',
					'text' : "请选择记录",
					'title' : '错误'
				});
			}
		}
	}, objRubbish = {
		text : "查看",
		func : function() {
			var tr = $jTable.getSelectedRow();
			if (tr == null) {
				$.msgbox.show({
					'type' : 'error',
					'text' : "请选择记录",
					'title' : '错误'
				});
			} else {
				// alert(tr.innerHTML);
				showDetail();
			}

		}
	};
	var mailMenuData = [ [ objRubbish ] ];

	// 绑定
	$table.smartMenu(mailMenuData);

	window.detailCarBillModalConfirm = function(type) {
		$("#detail_modal").modal('hide');
		if (type != 'cancel') {
			search();
		}
	};

}(jQuery, window)