(function($, window) {
	"use strict";
	var $table = $("#role_table");
	var $jTable = null;
	var $createRole = $("#create_role");
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='6'>{0}</td></tr>";

	var totalRecords = 0;
	var tableData = {}; // 每一个id对应一个操作记录

	beautifulSelect2();

	function beautifulSelect2() {
		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}

	// 没有校验提示，闪红色
	function showNotSeletedTips($target) {
		var num = 6;
		var flag = setInterval(function() {
			$target.toggleClass("not-selected");
			if (--num == 0) {
				window.clearInterval(flag);
			}
		}, 150);
	}

	// 校验input是否为空，如果为空闪红色
	function inputNotEmptyValidator($array) {
		var result = true;
		for (var i = 0, len = $array.length; i < len; i++) {
			if (!($array[i].val() && $array[i].val().trim())) {
				result = false;
				showNotSeletedTips($($array[i]));
			}
		}
		return result;
	}

	/**
	 * 获得查询参数
	 * 
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			roleName : '',
			userName : '',
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
			_queryParam.roleName = $("#rolename").val();
			_queryParam.userName = getUserEnglishNames($('#username').val());
			_queryParam.status = $('#validSelect').val();
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

	// $("#validSelect").multiselect({
	// header: false,
	// multiple: false,
	// selectedList: 1
	// });

	$("#create_btn, #create_cancel_btn").click(function() {
		$createRole.toggle();

	});

	// 获取输入用户的微信端账号
	function getUserEnglishNames(nameStr) {
		var strArr = [], arr = nameStr.split(";"), cur;
		if (arr.length === 0) {
			return "";
		}
		arr.length = (arr.length - 1); // 去掉最后一个分号
		for (var i = 0, len = arr.length; i < len; i++) {
			cur = arr[i];
			strArr.push(arr[i].substring(0, arr[i].indexOf("(")));
		}
		return strArr.join(",");
	}

	// 显示审批记录
	function showRecord(id, $record) {
		if ($record.attr("haveDate") == "1") {

			$record.show();
			return; // 如果展示过，就直接返回了，不用多次发送ajax请求了
		}
		Util.ajax({
			url : requestContextPath + "/role/getRoleOpRecord.html",
			data : {
				"id" : id
			},
			dataType : "json",
			success : function(data) {
				if (data.total === 0) {
					$record.html("没有可展示的内容");
					return;
				}
				var trs = "";
				for (var i = 0, len = data.data.length; i < len; i++) {
					var d = data.data[i];
					var tr = "<tr>" + "<td>" + d.opUser + "</td>" + "<td>"
							+ d.opField + "</td>" + "<td>" + d.opTime + "</td>"
							+ "<td><div class='opDiv' title='" + d.beforeOp
							+ "'>" + d.beforeOp + "</div></td>"
							+ "<td><div class='opDiv' title='" + d.afterOp
							+ "'>" + d.afterOp + "</div></td>"
							+ "<td><div class='opDiv' title='"
							+ d.opDeclaration + "'>" + d.opDeclaration
							+ "</div></td></tr>";

					trs += tr;
				}
				$record.find('tbody').html(trs);
				$record.attr("haveDate", 1).show();

			}
		}, "数据加载中");
	}

	$(document).on("click", '.role-detail a', function(e) {
		var $this = $(this);
		$this.tab('show');
		var classname = $this.attr("class");
		$(".role-detail-tab").hide();
		var rowid = $this.parent().parent().attr("rowid");
		if (classname === 'role-detail-edit') {
			$("#for_edit").show();

		} else {
			showRecord(rowid, $("#for_record"));

		}
	});

	// 用户角色录入重复检测
	function detectUserMultiRoles(id, users, fCallback) {

		$.ajax({
			url : requestContextPath + "/role/checkUserRole.html",
			data : {
				'id' : id,
				'users' : users
			},
			dataType : "json",
			success : function(data) {
				if (!data.success && data.object) {

					var sContent = "用户";
					var aUser = data.object.data;
					if (aUser.length > 5) {
						for (var i = 0; i < aUser.length; i++) {
							var sTmp = "";
							if (i == 4) {
								sTmp += aUser[i];
								sContent += sTmp;
								break;
							} else {
								sTmp += aUser[i] + "、";
								sContent += sTmp;
							}
						}
						sContent += "等" + aUser.length + "个用户";
					} else {
						sContent += aUser.join('、');
					}
					sContent += "已有角色，重复录入后权限会叠加，请谨慎妥善管理";
					$.msgbox.show({
						'type' : 'info',
						'text' : sContent,
						'title' : '角色重复提示',
						'confirmCb' : fCallback
					});
				} else {
					fCallback();
				}
			},
			complete : function(xhr, textStatus) {
			}
		});
	}
	$("#create_submit_btn").click(function(e) {
		var roleCode = $("#role_code").val();
		var name = $("#role_name").val();
		var description = $('#role_desc').val();
		var users = $('#users_for_role').val();
		var status = $('#statusCreate').prop("checked") ? 1 : 0;

		// 先检查，确定后执行保存
		detectUserMultiRoles(null, users, function() {
			$.ajax({
				type : "POST",
				url : requestContextPath + "/role/addRole.html",
				data : {
					'roleCode' : roleCode,
					'name' : name,
					'description' : description,
					'users' : users,
					'status' : status
				},
				dataType : "json",
				success : function(data) {
					if (data.success) {
						$createRole.hide();
						$("#role_code").val("");
						$("#role_name").val("");
						$("#role_desc").val("");
						$("#users_for_role").val("");
						search();

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
	});

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
			url : requestContextPath + "/role/exportRoleData.html",
			data : getParam(),
			cache : false,
			dataType : "json",
			success : function(data) {
				location.href = data.object;
			}
		}, "正在导出，请稍等...");
	}

	function search() {
		$jTable.refreshTableData(getParam());
	}

	$("#searchBtn").click(search);

	/** 行展开 */
	$table.on("click", '.editrow',
			function(e) {
				e.stopPropagation();
				var $this = $(this);
				var $thisTr = $this.parent().parent();
				var $thatTr = $thisTr.next();
				if (!$thatTr.find(".arrow").length) {
					var id = $this.attr("rowid");
					var curData = tableData[id];
					var isChecked = curData.status ? 'checked' : "";
					var userIds = curData.chineseName;
					// if (userIds) {
					// userIds = userIds.replace(/,/g, ";") + ";" //用户名逗号替换成分号
					// }
					var temp = rowTemplateHtml.replace("{roleCode}",
							curData.roleCode).replace("{name}",
							curData.roleName).replace("{desc}",
							curData.description).replace("{users}", userIds)
							.replace(/{rowid}/g, curData.id).replace(
									"{checked}", isChecked);

					var trHtml = unfoldTrHtml.replace("{0}", temp);
					$(".row-edit-container").remove();
					$thisTr.after($(trHtml));
					$thisTr.next().find(".arrow").css(
							"left",
							$this.position().left - $thisTr.position().left - 6
									+ "px");
					// role_detail_users是动态生成的，所以要使它autocomplete，其中，是全局变量
					$('#role_detail_users').typeahead({
						source : autoUserList,
						items : 10,
						selectItems : 20
					});

				} else {
					return false;
				}
			});

	/** 行收缩-取消 */
	$table.on("click", '#role_detail_btnCancel', function(e) {
		$(".row-edit-container").remove();

	});

	/** 行收缩-确定 */
	$table.on("click", '#role_detail_btnSave', function(e) {
		var roleCode = $("#role_detail_roleCode").val();
		var name = $("#role_detail_name").val();
		var description = $('#role_detail_desc').val();
		var users = $('#role_detail_users').val();
		var status = $('#role_detail_status').prop("checked") ? 1 : 0;

		var id = $(this).attr("rowid");
		if (!inputNotEmptyValidator([ $("#role_detail_name") ])) {
			return false;
		}

		// 先检查，确定后执行保存
		users = getIdAutoComplete(users);

		// 先检查，确定后执行保存
		var sPreUser = tableData[id] && tableData[id]['userId'];
		var aUser = users.split(',');
		for (var i = 0; i < aUser.length; i++) {
			if (RegExp(aUser[i]).test(sPreUser)) {
				aUser.splice(i, 1);
				i--;
			}
		}
		var sUser = aUser.join(',');
		// debugger;
		detectUserMultiRoles(id, sUser, function() {
			$.ajax({
				type : "POST",
				url : requestContextPath + "/role/editRole.html",
				data : {
					'id' : id,
					'roleCode' : roleCode,
					'name' : name,
					'description' : description,
					'users' : users,
					'status' : status
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
	});

	$jTable = $table.table({
		ajaxUrl : requestContextPath + "/role/roleList.html",
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
					list.push("<span class='icon-edit editrow' rowid='"
							+ curRow.id + "'>" + curRow.id + "</span>");
					list.push(curRow.roleCode);
					list.push(curRow.roleName);
					list.push(curRow.description);
					list.push({
						innerHtml : "<div class='user-container' title='"
								+ curRow.chineseName + "'>"
								+ curRow.chineseName + "</div>",
						className : "table-long-text"
					});
					list.push();
					list.push(curRow.createUser);
					list.push(curRow.status ? '有效' : '无效');
					dataList.push(list);
				}
				;
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	$('#users_for_role').typeahead({
		source : autoUserList,
		items : 10,
		selectItems : 20
	});

})(jQuery, window);