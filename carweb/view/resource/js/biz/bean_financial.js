(function($, window) {
	"use strict";
	var $table = $("#user_table");
	var $jTable = null;
	var $createUser = $("#create_user");
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='10'>{0}</td></tr>";

	var totalRecords = 0;
	var tableData = {}; // 每一个id对应一个操作记录

	var $noticeDialog = $("#importNoticeDialog");
	var $noticeText = $(".notice-text");

	// var userTypeValue = [ "OA用户", "合作方", "渠道号" ];

	beautifulSelect2();

	function beautifulSelect2() {

		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}

	dateInit();
	function dateInit() {
		$('.datepicker').datepicker({
			format : 'yyyy-mm-dd',
			autoclose: true,
			language : 'zh-CN',
		});
	}

	// function addFormSuccess() {
	// clearForm();
	// search();
	// }
	// $(document).ready(function() {
	// var form = $('#addUserForm').easyform({
	// onSuccess : addFormSuccess
	// });
	//	});
	
	initCompany('#companyId', '金融单位');
	
	/**
	 * 获得查询参数
	 * 
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			category: '',
			userType : '',
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
			_queryParam.category = '金融人员';
			_queryParam.userType = $("#typeSelect").val();
			_queryParam.chineseName = $('#chinesename').val();
			_queryParam.englishName = $('#englishname').val();
			_queryParam.status = $("#validSelect").val();
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

	$("#addUserTypeSelect").change(function() {
		var item = $("#addUserTypeSelect").val();
		if (item === "1") {
			$('#addOA').show();
			$('#addSecondAccount').hide();
		} else {
			$('#addOA').hide();
			$('#addSecondAccount').show();
		}
	});
	// 新增、取消按钮点击事件
	$("#create_btn, #create_user_cancel").click(function() {
		$createUser.toggle();
		clearForm();
		// closeEasyTips(easyTips);
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

	/** 新增OA按钮事件* */
	$("#create_user_submit").click(function(e) {
		var userType = $("#addUserTypeSelect").val();
		var englishName = $("#englishName").val();
		var chineseName = $("#chineseName").val();
		// var password = $("#password").val();
		var email = $("#email").val();
		var phone = $("#phone").val();
		var qq = $("#qq").val();
		var weChat = $("#weChat").val();
		$.ajax({
			url : requestContextPath + "/financial/addoa.html",
			type : "POST",
			data : {
				'englishName' : englishName,
				'chineseName' : chineseName,
				'email' : email,
				'phone' : phone,
				'qq' : qq,
				'weChat' : weChat,
				
				'category' : $("#category").val(),
				'regoin' : $("#regoin").val(),
				'companyId' : $("#companyId").val(),
				'sex' : $("#sex").val(),
				'status' : $("#validSelect").val(),
				'workExperience' : $("#workExperience").val(),
				'brithDay' : $("#brithDay").val(),
				'workTime' : $("#workTime").val(),
				'telphone' : $("#telphone").val(),
				'homePhone' : $("#homePhone").val(),
				'address' : $("#address").val(),
				'speciality' : $("#speciality").val(),
				'education' : $("#education").val(),		
				'graduateSchool' : $("#graduateSchool").val(),
				'major' : $("#major").val(),	
			},
			dataType : "json",
			success : function(data) {
				if (data.success) {
					clearForm();
					search();
					$.msgbox.show({
						'type' : 'info',
						'text' : data.message,
						'title' : '成功'
					});
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			},
			complete : function(xhr, textStatus) {
			}
		});

	});

	function search() {
		$jTable.refreshTableData(getParam());
	}

	$("#searchBtn").click(search);

	// 显示审批记录
	function showRecord(id, $record) {
		if ($record.attr("haveDate") == "1") {

			$record.show();
			return; // 如果展示过，就直接返回了，不用多次发送ajax请求了
		}
		Util.ajax({
			url : requestContextPath + "/financial/getUserOpRecord.html",
			data : {
				"id" : id
			},
			dataType : "json",
			success : function(data) {
				if (data.total <= 0) {
					$record.html("没有可展示的内容");
					return;
				}
				var trs = "";
				for (var i = 0, len = data.data.length; i < len; i++) {
					var d = data.data[i];
					var tr = "<tr>" + "<td>" + d.opUser + "</td>" + "<td>"
							+ d.opField + "</td>" + "<td>" + d.opTime + "</td>"
							+ "<td>" + d.beforeOp + "</td>" + "<td>"
							+ d.afterOp + "</td></tr>";
					trs += tr;
				}
				$record.find('tbody').html(trs);
				$record.attr("haveDate", 1).show();

			}
		}, "数据加载中");
	}

	$jTable = $table.table({
		ajaxUrl : requestContextPath + "/financial/userList.html",
		paramsJson : getParam(),
		pageKey : {
			total : "total",
			pageSize : "pageSize",
			curPage : "curPage"
		},
		clickRow : function() {
			// alert('click');
		},
		dbClickRow : function() {
			// alert('dbClick');
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
							+ curRow.id + "'>" + curRow.id + "</span>");
					list.push(curRow.chineseName);
					list.push(curRow.englishName);
					list.push(curRow.category);
					list.push(curRow.companyName);
					list.push(curRow.phone);
					list.push(curRow.qq);
					list.push(curRow.wechat);
					list.push(curRow.status ? '有效' : '无效');
					dataList.push(list);
				}
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	/** 打印记录 */
	window.printData = function() {
		$("#user_table").jqprint({
			operaSupport : false
		});
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
			url : requestContextPath + "/financial/exportUserData.html",
			data : getParam(),
			cache : false,
			dataType : "text",
			success : function(data) {
				// location.href = data;
				$.fileDownload(data);
			}
		}, "正在导出，请稍等...");
	}

	$(document).on("click", '.user-detail a', function(e) {
		var $this = $(this);
		$this.tab('show');
		var classname = $this.attr("class");
		$(".user-detail-tab").hide();
		var rowid = $this.parent().parent().attr("rowid");
		if (classname === 'user-detail-edit') {
			$("#for_edit").show();

		} else {
			showRecord(rowid, $("#for_record"));
		}
	});

	/** 行展开 */
	$table
			.on("click", '.editrow',
					function(e) {
						e.stopPropagation();
						var $this = $(this);
						var $thisTr = $this.parent().parent();
						var $thatTr = $thisTr.next();	
						
						if (!$thatTr.find(".arrow").length) {
							var id = $this.attr("rowid");
							var curData = tableData[id];
							var isChecked = curData.status ? 'checked' : "";
							var displayValue = curData.userType == 2 ? "block"
									: "none";
							var englishName = curData.englishName;
							var chineseName = curData.chineseName;
							// var password = curData.password;
							var email = curData.email;
							var phone = curData.phone;
							var qq = curData.qq;
							var weChat = curData.wechat;
							var temp = rowTemplateHtml.replace(/{rowid}/g,
									curData.id).replace("{checked}", isChecked)
									.replace("{vendorType}", displayValue)
									.replace(/{englishName}/g,
											englishName || '').replace(
											"{chineseName}", chineseName || '')
									.replace("{email}", email || '').replace(
											"{phone}", phone || '').replace(
											"{qq}", qq || '').replace("{weChat}", weChat || '')
											.replace("{edit_workExperience}", curData.workExperience || '')
											.replace("{edit_brithDay}", curData.brithDay || '')
											.replace("{edit_workTime}", curData.workTime || '')
											.replace("{edit_telphone}", curData.telphone || '')
											.replace("{edit_homePhone}", curData.homePhone || '')
											.replace("{edit_speciality}", curData.speciality || '')
											.replace("{edit_education}", curData.education || '')
											.replace("{edit_graduateSchool}", curData.graduateSchool || '')
											.replace("{edit_major}", curData.major || '')
											.replace("{edit_address}", curData.address || '');
							var trHtml = unfoldTrHtml.replace("{0}", temp);
							$(".row-edit-container").remove();
							$thisTr.after($(trHtml));
							$thisTr.next().find(".arrow").css(
									"left",
									$this.position().left
											- $thisTr.position().left - 6
											+ "px");
							
							
							$("#edit_category").find("option[value=" + curData.category + "]").attr("selected",true);
							$("#edit_regoin").find("option[value=" + curData.regoin + "]").attr("selected",true);
							$("#edit_sex").find("option[value=" + curData.sex + "]").attr("selected",true);
							
							//Default Action
							$(".editTabBox .tab_content").hide(); //Hide all content
							$(".editTabBox ul.tabs li:first").addClass("active").show(); //Activate first tab
							$(".editTabBox .tab_content:first").show(); //Show first tab content
							//On Click Event
							$(".editTabBox ul.tabs li").click(function() {
								$(".editTabBox ul.tabs li").removeClass("active"); //Remove any "active" class
								$(this).addClass("active"); //Add "active" class to selected tab
								$(".editTabBox .tab_content").hide(); //Hide all tab content
								var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
								$(activeTab).fadeIn(); //Fade in the active content
								return false;
							});
							
							selectedCompany('edit_companyId', '金融单位', curData.companyId);
							
							beautifulSelect2();
						
							$('.datepicker').datepicker({
								format : 'yyyy-mm-dd',
								autoclose: true,
								language : 'zh-CN',
							});

						} else {
							return false;
						}
					});

	/** 行收缩-取消 */
	$table.on("click", '#user_detail_btnCancel', function(e) {
		$(".row-edit-container").remove();

	});
	/** 行收缩-确定 */
	$table.on("click", '#user_detail_btnSave', function(e) {
		var status = $('#user_detail_status').prop("checked") ? 1 : 0;
		var id = $(this).attr("rowid");
		var edit_chineseName = $("#edit_chineseName").val();
		var edit_englishName = $("#edit_englishName").val();
		var edit_email = $("#edit_email").val();
		var edit_phone = $("#edit_phone").val();
		var edit_qq = $("#edit_qq").val();
		var edit_weChat = $("#edit_weChat").val();

		/**
		 * var pwd = ""; if ($("#edit_password").length) { pwd =
		 * $.trim($("#edit_password").val()); var testReg = /^[0-9a-zA-Z]*$/; if
		 * (!testReg.test(pwd)) { $.msgbox.show({ 'type' : 'info', 'text' :
		 * "密码只允许输入字母和数字的组合", 'title' : '提示' }); return false; } }
		 */
		$.ajax({
			url : requestContextPath + "/financial/editoa.html",
			type : "POST",
			data : {
				'id' : id,
				'chineseName' : edit_chineseName,
				'englishName' : edit_englishName,
				'email' : edit_email,
				'phone' : edit_phone,
				'qq' : edit_qq,
				'weChat' : edit_weChat,
				'status' : status,
				
				'category' : $("#edit_category").val(),
				'regoin' : $("#edit_regoin").val(),
				'companyId' : $("#edit_companyId").val(),
				'sex' : $("#edit_sex").val(),
				'workExperience' : $("#edit_workExperience").val(),
				'brithDay' : $("#edit_brithDay").val(),
				'workTime' : $("#edit_workTime").val(),
				'telphone' : $("#edit_telphone").val(),
				'homePhone' : $("#edit_homePhone").val(),
				'address' : $("#edit_address").val(),
				'speciality' : $("#edit_speciality").val(),
				'education' : $("#edit_education").val(),
				'graduateSchool' : $("#edit_graduateSchool").val(),
				'major' : $("#edit_major").val(),
			},
			dataType : "json",
			success : function(data) {
				if (data.success) {
					$(".row-edit-container").remove();
					$jTable.refreshTableData(getParam());
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			},
			complete : function(xhr, textStatus) {
			}
		});
	});

	/** 清空input数据* */
	function clearForm() {
		$("#englishName").val("");
		$("#chineseName").val("");
		// $("#password").val("");
		$("#email").val("");
		$("#phone").val("");
		$("#qq").val("");
		$("#weChat").val("");
		
		$("#workExperience").val("");
		$("#brithDay").val("");
		$("#workTime").val("");
		$("#telphone").val("");
		$("#homePhone").val("");
		$("#address").val("");
		$("#speciality").val("");
		$("#education").val("");
		$("#graduateSchool").val("");
		$("#major").val("");

		/** 二级账户需求待定* */
		/**
		 * $("#chineseName").val(""); $("#englishName").val("");
		 * $("#password").val(""); $("#vendor").val("");
		 * $("#channelNum").val("");
		 */
	}

	$table.on("click", '#edit_reset_password', function(e) {
		// 重置密码
		var ids = $("#edit_reset_password").attr('rowid');
		$.ajax({
			url : requestContextPath + "/financial/resetUserPassword.html",
			data : {
				'ids' : ids,
			},
			dataType : "json",
			success : function(data) {
				if (data.success) {
					$.msgbox.show({
						'type' : 'info',
						'text' : data.message,
						'title' : '成功'
					});
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			},
			complete : function(xhr, textStatus) {
			}
		});
	});

	// 解锁
	$table.on("click", '#edit_unlock', function(e) {
		// 重置密码
		var englishname = $("#edit_unlock").attr('englishname');
		$.ajax({
			url : requestContextPath + "/financial/unLockUser.html",
			data : {
				'englishName' : englishname,
			},
			dataType : "json",
			success : function(data) {
				if (data.success) {
					$.msgbox.show({
						'type' : 'info',
						'text' : data.message,
						'title' : '成功'
					});
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			},
			complete : function(xhr, textStatus) {
			}
		});
	});

	// 中文转拼音
	$("#chineseName").blur(function() {
		var chineseName = $("#chineseName").val();
		chineseName = $.trim(chineseName);
		$("#chineseName").val(chineseName);
		var pinyin = Util.getChineseCharacterPinyin(chineseName);
		pinyin = pinyin.toLowerCase();
		$("#englishName").val(pinyin);
	});

	$("#englishName").blur(function() {
		var englishName = $("#englishName").val();
		englishName = $.trim(englishName);
		$("#englishName").val(englishName);
	});
	
	// 自定义右键上下文
	// 数据
	var objDelete = {
		text : "删除",
		func : function() {
			// test
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
				alert(tr.innerHTML);
			}

		}
	};
	
	//var mailMenuData = [ [ objRubbish, objDelete ] ];

	// 绑定
	//$table.smartMenu(mailMenuData);

})(jQuery, window);