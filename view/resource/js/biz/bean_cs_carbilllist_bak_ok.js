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
					list.push(curRow.carBrandName);
					list.push(curRow.carSetName);
					list.push(curRow.carTypeName);
					list.push(curRow.carDisplace);
					list.push(curRow.carFrameNum);
					list.push(curRow.applyResultName);

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
								$editFrame.attr("width", 700);
								$editFrame.attr("height",
										document.body.scrollHeight - 70);
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
	var mailMenuData = [ [ objRubbish, objDelete ] ];

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
		Util
				.ajax(
						{
							url : requestContextPath
									+ "/carBill/getCarBillVoByPart.html",
							type : "POST",
							data : {
								'carBillId' : carBillId,
								'applyPart' : '初审'
							},
							dataType : "json",
							success : function(data) {
								if (data.success) {
									// 设置界面信息
									$("#carBillId").val(data.object.carBillId);
									$("#carNo").val(data.object.carNo);
									$("#carUserName").val(
											data.object.carUserName);
									$("#carBrandId").find(
											"option[value="
													+ data.object.carBrandId
													+ "]").attr("selected",
											true);
									$("#select2-carBrandId-container").html(
											data.object.carBrandName);

									// 触发事件
									$("#carBrandId").change();

									$("#carSetId").find(
											"option[value="
													+ data.object.carSetId
													+ "]").attr("selected",
											true);
									$("#select2-carSetId-container").html(
											data.object.carSetName);

									$("#carTypeId").val(data.object.carTypeId);
									$("#carDisplace").val(
											data.object.carDisplace);
									$("#carFrameNum").val(
											data.object.carFrameNum);
									$("#power").val(data.object.power);
									$("#engineNum").val(data.object.engineNum);

									$("#environmentType")
											.find(
													"option[value="
															+ data.object.environmentType
															+ "]").attr(
													"selected", true);
									$("#select2-environmentType-container")
											.html(data.object.environmentType);

									$("#runNum").val(data.object.runNum);
									$("#regDate").val(data.object.regDate);
									$("#productionDate").val(
											data.object.productionDate);
									$("#labelTypeNum").val(
											data.object.labelTypeNum);
									$("#carTypeInfo").val(
											data.object.carTypeInfo);
									$("#seat").val(data.object.seat);
									$("#color").val(data.object.color);
									$("#yearCheckDate").val(
											data.object.yearCheckDate);
									$("#takeUserPhone").val(
											data.object.takeUserPhone);
									$("#preSalePrice").val(
											data.object.preSalePrice);
									$("#useNature").find(
											"input:radio[value='"
													+ data.object.useNature
													+ "']").attr('checked',
											true);
									$("#changeSpeed").find(
											"input:radio[value='"
													+ data.object.changeSpeed
													+ "']").attr('checked',
											true);
									$("#carDoor").find(
											"input:radio[value='"
													+ data.object.carDoor
													+ "']").attr('checked',
											true);
									$("#driveType").find(
											"input:radio[value='"
													+ data.object.driveType
													+ "']").attr('checked',
											true);
									$("#oilSystem").find(
											"input:radio[value='"
													+ data.object.oilSystem
													+ "']").attr('checked',
											true);
									$("#airSystem").find(
											"input:radio[value='"
													+ data.object.airSystem
													+ "']").attr('checked',
											true);
									$("#specialBizInfo").val(
											data.object.specialBizInfo);
									$("#specialConfigInfo").val(
											data.object.specialConfigInfo);
									$("#mark").val(data.object.mark);
									$("#status").val(data.object.status);

									$("#applyResult").find(
											"input:radio[value='"
													+ data.object.applyResult
													+ "']").attr('checked',
											true);
									$("#applyOpinion").val(
											data.object.applyOpinion);
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
						}, "正在保存中");
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
			_queryParam.category = '初审评估师,初级评估师,中级评估师,高级评估师';
			_queryParam.englishName = $('#queryUser').val();
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

	function selectUser() {
		// test
		var tr = $jUserTable.getSelectedRow();
		if (tr == null) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
		} else {
			var englishName = $(tr).find("td span").attr("englishName");
			var chineseName = $(tr).find("td span").attr("chineseName");
			var category = $(tr).find("td span").attr("category");
			var names = $("#nextPartUser").val();
			$("#nextPartUser").val(
					names + englishName + "(" + chineseName + "-" + category
							+ "),");
		}
	}
	
	function searchUser() {
		// 		$("#nextPartUser").val('');
		$jUserTable.refreshTableData(getUserParam());
	}
	
	$("#search_ueser_btn")
	.click(
			function() {
				searchUser();		
	});
	
	$jUserTable = $usertable.table({
		ajaxUrl : requestContextPath + "/user/userList.html",
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
			selectUser();
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
					list
							.push("<span rowid='" + curRow.id
									+ "' englishName='" + curRow.englishName
									+ "' category='" + curRow.category
									+ "' chineseName='" + curRow.chineseName
									+ "'>" + curRow.id + "</span>");
					list.push(curRow.chineseName);
					list.push(curRow.englishName);
					list.push(curRow.category);
					dataList.push(list);
				}
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	// 保存数据
	function saveImageAngleInfo() {
		var lastAngle = iviewerMap.get("angle_" + curViewerImagePath);
		if (lastAngle == null) {
			lastAngle = 0;
		}
		var initDeg = $(curThumbCutImage).attr('angle');
		// 保存上一次角度
		if (initDeg != lastAngle) {
			saveCarImage(curImageId, lastAngle);
		}
	}

	// 保存数据
	$("#data_save")
			.click(
					function() {

						saveImageAngleInfo();

						// 先校验
						Util
								.ajax(
										{
											url : requestContextPath
													+ "/carBill/editCsCarBill.html",
											type : "POST",
											data : {
												'carBillId' : $(
														"#hidden_carBillId")
														.val(),
												'carNo' : $("#carNo").val(),
												'carUserName' : $(
														"#carUserName").val(),
												'carBrandId' : $("#carBrandId")
														.val(),
												'carSetId' : $("#carSetId")
														.val(),
												'carTypeId' : $("#carTypeId")
														.val(),
												'carDisplace' : $(
														"#carDisplace").val(),
												'carFrameNum' : $(
														"#carFrameNum").val(),
												'powerName' : $("#power").val(),
												'engineNum' : $("#engineNum")
														.val(),
												'environmentType' : $(
														"#environmentType")
														.val(),
												'runNumName' : $("#runNum").val(),
												'regDate' : $("#regDate").val(),
												'productionDate' : $(
														"#productionDate")
														.val(),
												'labelTypeNum' : $(
														"#labelTypeNum").val(),
												'carTypeInfo' : $(
														"#carTypeInfo").val(),
												'seat' : $("#seat").val(),
												'color' : $("#color").val(),
												'yearCheckDate' : $(
														"#yearCheckDate").val(),
												'takeUserPhone' : $(
														"#takeUserPhone").val(),
												'preSalePriceName' : $(
														"#preSalePrice").val(),
												'useNature' : $(
														'#useNature input[name="useNature"]:checked ')
														.val(),
												'changeSpeed' : $(
														'#changeSpeed input[name="changeSpeed"]:checked ')
														.val(),
												'carDoor' : $(
														'#carDoor input[name="carDoor"]:checked ')
														.val(),
												'driveType' : $(
														'#driveType input[name="driveType"]:checked ')
														.val(),
												'oilSystem' : $(
														'#oilSystem input[name="oilSystem"]:checked ')
														.val(),
												'airSystem' : $(
														'#airSystem input[name="airSystem"]:checked ')
														.val(),
												'specialBizInfo' : $(
														"#specialBizInfo")
														.val(),
												'specialConfigInfo' : $(
														"#specialConfigInfo")
														.val(),
												'mark' : $("#mark").val(),

											},
											dataType : "json",
											success : function(data) {
												if (data.success) {
													$.msgbox
															.show({
																'type' : 'info',
																'text' : data.message,
																'title' : '成功',
																'cancelBtnShow' : false,
																'confirmCb' : function() {
																	parent.window
																			.detailCarBillModalConfirm();
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
										}, "正在保存中");
					});

	// 提交数据
	$("#data_submit")
			.click(
					function() {

						saveImageAngleInfo();

						// 先校验
						Util
								.ajax(
										{
											url : requestContextPath
													+ "/carBill/editApplyCsCarBill.html",
											type : "POST",
											data : {
												'carBillId' : $(
														"#hidden_carBillId")
														.val(),
												'carNo' : $("#carNo").val(),
												'carUserName' : $(
														"#carUserName").val(),
												'carBrandId' : $("#carBrandId")
														.val(),
												'carSetId' : $("#carSetId")
														.val(),
												'carTypeId' : $("#carTypeId")
														.val(),
												'carDisplace' : $(
														"#carDisplace").val(),
												'carFrameNum' : $(
														"#carFrameNum").val(),
												'powerName' : $("#power").val(),
												'engineNum' : $("#engineNum")
														.val(),
												'environmentType' : $(
														"#environmentType")
														.val(),
												'runNumName' : $("#runNum").val(),
												'regDate' : $("#regDate").val(),
												'productionDate' : $(
														"#productionDate")
														.val(),
												'labelTypeNum' : $(
														"#labelTypeNum").val(),
												'carTypeInfo' : $(
														"#carTypeInfo").val(),
												'seat' : $("#seat").val(),
												'color' : $("#color").val(),
												'yearCheckDate' : $(
														"#yearCheckDate").val(),
												'takeUserPhone' : $(
														"#takeUserPhone").val(),
												'preSalePriceName' : $(
														"#preSalePrice").val(),
												'useNature' : $(
														'#useNature input[name="useNature"]:checked ')
														.val(),
												'changeSpeed' : $(
														'#changeSpeed input[name="changeSpeed"]:checked ')
														.val(),
												'carDoor' : $(
														'#carDoor input[name="carDoor"]:checked ')
														.val(),
												'driveType' : $(
														'#driveType input[name="driveType"]:checked ')
														.val(),
												'oilSystem' : $(
														'#oilSystem input[name="oilSystem"]:checked ')
														.val(),
												'airSystem' : $(
														'#airSystem input[name="airSystem"]:checked ')
														.val(),
												'specialBizInfo' : $(
														"#specialBizInfo")
														.val(),
												'specialConfigInfo' : $(
														"#specialConfigInfo")
														.val(),
												'mark' : $("#mark").val(),

												'applyResult' : $(
														'#applyResult input[name="applyResult"]:checked ')
														.val(),
												'applyOpinion' : $(
														"#applyOpinion").val(),
												'nextPartUser' : $(
														"#nextPartUser").val(),

											},
											dataType : "json",
											success : function(data) {
												if (data.success) {
													$.msgbox
															.show({
																'type' : 'info',
																'text' : data.message,
																'title' : '成功',
																'cancelBtnShow' : false,
																'confirmCb' : function() {
																	parent.window
																			.detailCarBillModalConfirm();
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
}(jQuery, window)