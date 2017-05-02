~function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;

	var $usertable = $("#user_table");
	var userTableData = {};
	var $jUserTable = null;

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
		ajaxUrl : requestContextPath + "/carBill/getAllBillList.html",
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
					list.push(curRow.provinceName);
					list.push(curRow.createUserName);
					list.push(curRow.carFrameNum);
					list.push(curRow.statusName);
					list.push(curRow.curOperatorName);
					list.push(curRow.carBrandName);
					list.push(curRow.carSetName);
					list.push(curRow.carTypeName);
					list.push(currencyFormat.doFormat(curRow.preSalePrice));
					list.push(currencyFormat.doFormat(curRow.evaluatePrice));
					list.push(curRow.csTime);
					list.push(curRow.zsTime);
					list.push(curRow.consumeTime);
					list.push(curRow.curApplyOpinion);
					// list.push("<button rowid='" + curRow.carBillId
					// + "' class='createCarImage' >评估报告</button>");
					dataList.push(list);
				}
				;
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	$table.on("click", '.createCarImage', function(e) {
		var tr = $jTable.getSelectedRow();
		var carBillId = null;
		if (tr == null) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
			return;
		} else {
			carBillId = $(tr).find("td span").attr("rowid");
		}
		// 点击生成评估报告
		Util.ajax({
			url : requestContextPath + "/carBill/getCarEvaluateImage.html",
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
					// 评估报告
					$("#carBillImage_modal").modal("show");
					$("#evaluateFile").attr("src",
							requestContextPath + data.object);
				}
			},
			complete : function(xhr, textStatus) {
			}
		}, '获取报告中!');
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
			$("#hidden_carBillId").val(carBillId);

			initCarBill(carBillId);
			$("#detail_modal").modal("show");
			// $("#images").width(document.body.scrollWidth
			// - 10);
			// $("#images").height(document.body.scrollHeight
			// - 50);
			var $editFrame = $("#displayimagesframe");
			$editFrame.attr("src", requestContextPath
					+ "/view/admin/canvas/all_carbilldetail.jsp?carBillId="
					+ carBillId);
			$editFrame.attr("width", document.body.scrollWidth - 10);
			// $editFrame.attr("height",
			// document.body.scrollHeight - 50);
			$editFrame.attr("height",
					document.documentElement.clientHeight - 50);

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
			} else {
				var carBillId = $(tr).find("td span").attr("rowid");
				$.msgbox.show({
					'type' : 'warning',
					'text' : "删除数据，是否删除此评估单[" + carBillId + "]",
					'title' : '风险提示',
					'cancelBtnShow' : true,
					'confirmCb' : function() {
						deleteCarBill();
					}
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
	}, objRecreateReport = {
		text : "重新生成报告",
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
				reCreateCarImage();
			}

		}
	}, objCallBackBill = {
		text : "系统退回",
		func : function() {
			var tr = $jTable.getSelectedRow();
			if (tr == null) {
				$.msgbox.show({
					'type' : 'error',
					'text' : "请选择记录",
					'title' : '错误'
				});
			} else {
				var carBillId = $(tr).find("td span").attr("rowid");
				$.msgbox.show({
					'type' : 'warning',
					'text' : "退回导致数据覆盖，是否退回此评估单[" + carBillId + "]",
					'title' : '风险提示',
					'cancelBtnShow' : true,
					'confirmCb' : function() {
						callBackCarBill();
					}
				});
			}

		}
	}, objEditCallBill = {
		text : "编辑",
		func : function() {
			var tr = $jTable.getSelectedRow();
			if (tr == null) {
				$.msgbox.show({
					'type' : 'error',
					'text' : "请选择记录",
					'title' : '错误'
				});
			} else {
				var carBillId = $(tr).find("td span").attr("rowid");
				$.msgbox.show({
					'type' : 'warning',
					'text' : "编辑导致数据覆盖，是否编辑此评估单[" + carBillId + "]",
					'title' : '风险提示',
					'cancelBtnShow' : true,
					'confirmCb' : function() {
						editCarBill();
					}
				});
			}
		}
	}, objResetCopyCallBill = {
		text : "重置复制",
		func : function() {
			var tr = $jTable.getSelectedRow();
			if (tr == null) {
				$.msgbox.show({
					'type' : 'error',
					'text' : "请选择记录",
					'title' : '错误'
				});
			} else {
				var carBillId = $(tr).find("td span").attr("rowid");
				$.msgbox.show({
					'type' : 'info',
					'text' : "是否重置复制此评估单[" + carBillId + "]",
					'title' : '提示',
					'cancelBtnShow' : true,
					'confirmCb' : function() {
						resetCopyCarBill();
					}
				});
			}
		}
	};

	var mailMenuData = [ [ objRubbish, objCallBackBill, objEditCallBill,
			objResetCopyCallBill, objDelete ] ];

	function deleteCarBill() {
		var tr = $jTable.getSelectedRow();
		if (tr == null) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
		} else {
			var carBillId = $(tr).find("td span").attr("rowid");
			Util.ajax({
				url : requestContextPath + "/carBill/deleteCarBill.html",
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
						search();
						$.msgbox.show({
							'type' : 'info',
							'text' : data.message,
							'title' : '成功'
						});
					}
				},
				complete : function(xhr, textStatus) {
				}
			}, '处理中!');
		}
	}

	function editCarBill() {
		var tr = $jTable.getSelectedRow();
		if (tr == null) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
		} else {
			var carBillId = $(tr).find("td span").attr("rowid");
			$("#hidden_carBillId").val(carBillId);

			initCarBill(carBillId);
			$("#detail_modal").modal("show");
			// $("#images").width(document.body.scrollWidth
			// - 10);
			// $("#images").height(document.body.scrollHeight
			// - 50);
			var $editFrame = $("#displayimagesframe");
			$editFrame.attr("src", requestContextPath
					+ "/view/admin/canvas/edit_carbilldetail.jsp?carBillId="
					+ carBillId);
			$editFrame.attr("width", document.body.scrollWidth - 10);
			// $editFrame.attr("height",
			// document.body.scrollHeight - 50);
			$editFrame.attr("height",
					document.documentElement.clientHeight - 50);

		}

	}

	function callBackCarBill() {
		var tr = $jTable.getSelectedRow();
		if (tr == null) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
		} else {
			var carBillId = $(tr).find("td span").attr("rowid");
			Util.ajax({
				url : requestContextPath + "/carBill/callBackCarBill.html",
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
						search();
						$.msgbox.show({
							'type' : 'info',
							'text' : data.message,
							'title' : '成功'
						});
					}
				},
				complete : function(xhr, textStatus) {
				}
			}, '处理中!');
		}
	}

	function resetCopyCarBill() {
		var tr = $jTable.getSelectedRow();
		if (tr == null) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
		} else {
			var carBillId = $(tr).find("td span").attr("rowid");
			Util.ajax({
				url : requestContextPath + "/carBill/resetCopyCarBill.html",
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
						search();
						$.msgbox.show({
							'type' : 'info',
							'text' : data.message,
							'title' : '成功'
						});
					}
				},
				complete : function(xhr, textStatus) {
				}
			}, '处理中!');
		}
	}

	function reCreateCarImage() {
		var tr = $jTable.getSelectedRow();
		if (tr == null) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
		} else {
			var carBillId = $(tr).find("td span").attr("rowid");
			Util.ajax({
				url : requestContextPath
						+ "/carBill/createCarEvaluateImage.html?math="
						+ Math.random(),
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
						// 评估报告
						$("#carBillImage_modal").modal("show");
						$("#evaluateFile").attr(
								"src",
								requestContextPath + data.object + "?math="
										+ Math.random());
					}
				},
				complete : function(xhr, textStatus) {
				}
			}, '获取报告中!');
		}
	}

	// 绑定
	$table.smartMenu(mailMenuData);

	window.detailCarBillModalConfirm = function(type) {
		$("#detail_modal").modal('hide');
		if (type != 'cancel') {
			search();
		}
	};

	$("#carBrandId").on('change', function(e) {
		$("#select2-carSetId-container").html('请选择');
		$("#carSetId").val('');
		selectedCarSet('#carSetId', $("#carBrandId").val());
	});

	// 初始化数据
	function initCarBill(carBillId) {
		// 先校验
		Util.ajax({
			url : requestContextPath + "/carBill/getCarBillVoByPart.html",
			type : "POST",
			data : {
				'carBillId' : carBillId,
				'applyPart' : '初审'
			},
			dataType : "json",
			success : function(data) {
				if (data.success) {

					$("#applyResult").find(
							"input:radio[value='" + data.object.applyResult
									+ "']").attr('checked', true);
					$("#applyOpinion").val(data.object.applyOpinion);
					$("#applyDate").val(data.object.applyDate);
					$("#applyUser").val(data.object.applyUser);

					$("#nextPartUser").val('');

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

	/**
	 * 获得查询参数
	 * 
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getUserParam = (function() {
		var _queryParam = {
			userType : '',
			category : '',
			chineseName : '',
			englishName : '',
			status : '',
			fileType : "xls"
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.category = $('#carApplyUserClass').val() || '初级评估师';
			_queryParam.name = $('#queryUser').val();
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

	function selectUser(e) {
		// test
		var englishName = $(e).attr("englishName");
		var chineseName = $(e).attr("chineseName");
		var category = $(e).attr("category");
		var names = $("#nextPartUser").val();
		$("#nextPartUser")
				.val(
						names + englishName + "(" + chineseName + "-"
								+ category + "),");
	}

	function searchUser() {
		// $("#nextPartUser").val('');
		$jUserTable.refreshTableData(getUserParam());
	}

	$("#search_ueser_btn").click(function() {
		searchUser();
	});

	$jUserTable = $usertable.table({
		ajaxUrl : requestContextPath + "/user/getMixNameUserList.html",
		paramsJson : getUserParam(),
		pageKey : {
			total : "total",
			pageSize : "pageSize",
			curPage : "curPage",
			pageSizeNum : 8,
			curPageNum : 1,
		},
		clickRow : function() {
			// alert('click');
		},
		dbClickRow : function() {
			// alert('dbClick');
			// selectUser();
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
					userTableData[curRow.id] = curRow;
					list.push("<button class='userSelect' rowid='" + curRow.id
							+ "' englishName='" + curRow.englishName
							+ "' category='" + curRow.category
							+ "' chineseName='" + curRow.chineseName
							+ "'>确定</button>");
					list.push(curRow.chineseName);
					list.push(curRow.englishName);
					list.push(curRow.category);
					dataList.push(list);
				}
			}
			dataSet.list = dataList;
			return dataSet;
		},
		callBack : function() {
			$(".userSelect").click(function() {
				selectUser(this);
			});
		}
	});

	window.printData = function() {
		$("#evaluateFile").jqprint({
			operaSupport : false,
		});
	}

	$("#data_print").click(function() {
		printData();
	});

	/** 区域统计导出记录 */
	window.exportAreaStatData = function() {
		if ($jTable.getAttributes().total === 0) {
			$.msgbox.show({
				'type' : 'info',
				'text' : '没有可导出的记录',
				'title' : '提示'
			});
			return;
		}
		Util.ajax({
			url : requestContextPath + "/carBill/exportAreaStat.html",
			data : getParam(),
			cache : false,
			dataType : "text",
			success : function(data) {
				location.href = window.location.protocol + "//"
						+ window.location.host + requestContextPath + "/"
						+ data;
			}
		}, "正在导出，请稍等...");
	}

	/** 导出历史数据 */
	window.exportHistoryData = function() {
		if ($jTable.getAttributes().total === 0) {
			$.msgbox.show({
				'type' : 'info',
				'text' : '没有可导出的记录',
				'title' : '提示'
			});
			return;
		}
		Util.ajax({
			url : requestContextPath + "/carBill/exportHistory.html",
			data : getParam(),
			cache : false,
			dataType : "text",
			success : function(data) {
				location.href = window.location.protocol + "//"
						+ window.location.host + requestContextPath + "/"
						+ data;
			}
		}, "正在导出，请稍等...");
	}

}(jQuery, window)