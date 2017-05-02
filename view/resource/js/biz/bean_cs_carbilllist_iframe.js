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
		ajaxUrl : requestContextPath + "/carBill/getCsBillList.html",
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
					list.push(curRow.carNo);
					list.push(curRow.statusName);
					list.push(curRow.curOperatorName);
					list.push(curRow.carBrandName);
					list.push(curRow.carSetName);
					list.push(curRow.carTypeName);
					list.push(curRow.carDisplace);
					list.push(curRow.carFrameNum);
					list.push(curRow.applyResultName);
					list.push(curRow.nextUserName);
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
			$("#hidden_carBillId").val(carBillId);
			// 先校验
			$
					.ajax({
						url : requestContextPath
								+ "/carBill/getAndEditCsBill.html",
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
								initCarBill(carBillId);
								$("#detail_modal").modal("show");
								// $("#images").width(document.body.scrollWidth
								// - 10);
								// $("#images").height(document.body.scrollHeight
								// - 50);
								var $editFrame = $("#displayimagesframe");
								$editFrame
										.attr(
												"src",
												requestContextPath
														+ "/view/admin/canvas/cs_carbilldetail.jsp?carBillId="
														+ carBillId);

								$editFrame.attr("width",
										document.body.scrollWidth - 520);
								// ie 无此scrollHeight
								// $editFrame.attr("height",
								// document.body.scrollHeight - 70);
								$editFrame
										.attr(
												"height",
												document.documentElement.clientHeight - 70);

								// 初始化评估师
								initApplyUserClass();
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
					$('#applyResult input:radio:checked')
							.attr('checked', false);
					$(
							"input[type=radio][name=applyResult][value="
									+ data.object.applyResult + "]").prop(
							"checked", true);

					$("#applyOpinion").val(data.object.applyOpinion);
					$("#applyDate").val(data.object.applyDate);
					$("#applyUser").val(data.object.applyUser);

					$("#nextPartUser").val('');

					$("#createUser").val(data.object.createUser);
					$("#createTime").val(data.object.createTime);
					$("#createUserPhone").val(data.object.createUserPhone);

					$("#rejectUser").val(data.object.rejectUser);
					$("#rejectOpinion").val(data.object.rejectOpinion);

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
			pageSizeNum : 6,
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

	// 提交数据
	$("#data_submit").click(
			function() {

				$("#displayimagesframe")[0].contentWindow.saveImageAngleInfo();

				// 先检查，确定后执行保存
				var nextPartUser = getIdAutoComplete($("#nextPartUser").val());

				var applyResultVal = $(
						'#applyResult input[name="applyResult"]:checked ')
						.val();
				// 先校验
				Util.ajax({
					url : requestContextPath
							+ "/carBill/editApplyCsCarBill.html",
					type : "POST",
					data : {
						'carBillId' : $("#hidden_carBillId").val(),
						'applyResult' : applyResultVal,
						'applyOpinion' : $("#applyOpinion").val(),
						'nextPartUser' : nextPartUser,
						'nextPart' : $("#carApplyUserClass").val(),
						'applyClass' : $("#hidden_applyClass").val(),
					},
					dataType : "json",
					success : function(data) {
						if (data.success) {
							// 审批通过
							if (applyResultVal == '1') {
								// 更新审批计数器
								decIframeWorkSpaceCount("#showCsCount",
										window.parent.parent.document);
								decParentMenuCount("#csCount",
										window.parent.parent.document);
							}
							$.msgbox.show({
								'type' : 'info',
								'text' : data.message,
								'title' : '成功',
								'cancelBtnShow' : false,
								'confirmCb' : function() {
									detailCarBillModalConfirm();
								}
							});
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
				}, "正在提交中");

			});

	// 撤销数据
	$("#data_cancel").click(function() {

		$("#displayimagesframe")[0].contentWindow.saveImageAngleInfo();

		// 先校验
		Util.ajax({
			url : requestContextPath + "/carBill/cancelAndEditCsBill.html",
			type : "POST",
			data : {
				'carBillId' : $("#hidden_carBillId").val()
			},
			dataType : "json",
			success : function(data) {
				if (data.success) {
					$("#detail_modal").modal('hide');
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
		}, "正在返回中");

	});

	function initApplyUserClass() {
		// 
		$("#select2-carApplyUserClass-container").html('请选择评估师级别');
		$
				.ajax({
					url : requestContextPath
							+ "/carBill/getCsNextPartUserClasses.html",
					data : {
						carBillId : $("#hidden_carBillId").val(),
						pageSize : 10000,
						curPage : 1
					},
					dataType : "json",
					success : function(data) {
						var comboOptions = "<option value='' selected>请选择评估师级别</option>";
						if (data.total > 0) {
							var total = data.total;
							var items = data.data;
							for (var i = 0; i < total; i++) {
								comboOptions += "<option  value='"
										+ items[i]["key"] + "'>"
										+ items[i]["value"] + "</option>"; // 使用全部小写，具体查看jquery
								// .data
							}
						}
						$(".applyUserClass_sel").html(comboOptions)
								.multiselect('refresh');
					}
				});
	}

	$("#carApplyUserClass").on(
			'change',
			function(e) {
				var partClass = $("#carApplyUserClass").val();
				var selectedText = $("#carApplyUserClass").find(
						"option:selected").text();
				if (partClass == 'prevPart') {
					$("#hidden_applyClass").val('prevPart');
					$("#nextPartUser").val(selectedText);
					$('#nextPartUser').attr("readonly", "readonly");
					$('#search_ueser_btn').hide();
					$("#user_table").hide();
				} else {
					$("#hidden_applyClass").val('');
					$("#nextPartUser").val('');
					$('#nextPartUser').removeAttr("readonly");
					$('#search_ueser_btn').show();
					$("#user_table").show();

				}
			});

}(jQuery, window)