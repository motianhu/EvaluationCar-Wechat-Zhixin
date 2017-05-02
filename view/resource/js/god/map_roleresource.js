~ function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var $treeModal = $("#tree_modal");
	var $createContainer = $('#for_create_container');
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;

	/**
	 * @param {Object} obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			param_roleName: "",
			param_source: "",
		}
		var toString = function(o) {
			for (var x in o) {
				if (o[x] && o[x] instanceof Array) o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.param_roleName = $("#roleId_ipt").val().trim();
			_queryParam.param_source = $("#source_ipt").val().trim();
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
		$.ajax({
			type: "POST",
			url: requestContextPath + "/roleresource/add.html",
			data: {
				param_roleName: $("#add_roleId_ipt").val().trim(),
				param_source: $("#add_source_ipt").val().trim(),
			},
			dataType: "json",
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
			url: requestContextPath + "/roleresource/export.html",
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

	$("#search_btn").click(search);
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
		ajaxUrl: requestContextPath + "/roleresource/getList.html",
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
					list.push("<span class='icon-edit editrow' rowid='" + curRow.id + "'>" + curRow.id + "</span>"); //编号
					list.push(curRow.roleName);
					list.push("<span class='fastWeb-wrap'>" + curRow.source + "</span>"); 
				
					dataList.push(list);
				};
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});
	
	$("#tree_modal_btnSave").click(function() {
		var $this = $(this);
		var targetObjectName = $("#targetObject").val();
		var treeObj = $.fn.zTree.getZTreeObj("privilege_tree");
		if (treeObj) {
			var nodes = treeObj.getCheckedNodes(true);
			var name = "",
				ids = ['main', 'common'];
			// 默认有mian主页, 默认一些资源
			var idxCount = 2;
			if (nodes.length > 0) {
				for(var i=0; i<nodes.length; i++) {
					if(!nodes[i].isParent) {
						ids[idxCount] = nodes[i].id;
						idxCount = idxCount + 1;
					}
				}
			}
			var idsToStr = ids.join();
			$(targetObjectName).val(idsToStr);
		}
		//显示数据到文本框中
		$treeModal.modal('hide');
	});

	$("#tree_modal_btnCancel").click(function() {
		$treeModal.modal('hide');
	});
	
	//新增时选择父对象
	$("#add_source_ipt").click(function() {
		var selectedNodes = $("#add_source_ipt").val();
		var targetObjectName = "#add_source_ipt";
		showPrivilegeTree(selectedNodes, targetObjectName);
	});
	
	//编辑时选择父对象
	$table.on("click", "#edit_source_ipt", function() {
		var selectedNodes = $("#edit_source_ipt").val();
		var targetObjectName = "#edit_source_ipt";
		showPrivilegeTree(selectedNodes, targetObjectName);
	});

	//展示选择权限树
	function showPrivilegeTree(checkNodes, targetObjectName) {
			var zNodes = [];
			$("#targetObject").val(targetObjectName);
			var setting = {
				check: {
					enable: true
				},
				data: {
					key: {
						name: "name",
						url: ""
					}
				},
				view: {
					showIcon: false,
					dblClickExpand: false
				},
				callback: {
					beforeClick: function(treeId, treeNode) {
						var zTree = $.fn.zTree.getZTreeObj("privilege_tree");
						zTree.checkNode(treeNode, !treeNode.checked, null, true);
						return false;
					}
				}
			};
			// var sourceJson = $.ajax({url:"resource.json?math=" + Math.random(), dataType : "json",async:false});
			var sourceJson = null;
			$.ajax({
				type : "POST",
				async:false,
				url : requestContextPath + "/common/getDict.html",
				data : {
					mainItem : 'menumanager'
				},
				dataType : "json",
				success : function(data) {
					if (data.success) {
						sourceJson = data.object.description;
					} else {
						$.msgbox.show({
							'type' : 'error',
							'text' : data.message,
							'title' : '错误'
						});
					}
				}
			});
					
			zNodes = eval(sourceJson);

			if (zNodes.length > 0) {
				$.fn.zTree.destroy("privilege_tree");
				$.fn.zTree.init($("#privilege_tree"), setting, zNodes);
				var treeObj = $.fn.zTree.getZTreeObj("privilege_tree");
				treeObj.expandAll(true);
				//isMenu是预留字段
				//以下代码是用于禁止给叶子节点再添加子节点
				/**var leafNodes = treeObj.getNodesByParam("isMenu", "1",null);
				for(var i = 0,len = leafNodes.length;i<len;i++){
				treeObj.setChkDisabled(leafNodes[i], true);
				}*/
				
				// checkNodes = "user,message"; 
				var checkarr = checkNodes.split(","); 
				for(var i=0;i<checkarr.length;i++){  
					var toBeCheckedLeaf = treeObj.getNodeByParam("id", checkarr[i], null);
					if (toBeCheckedLeaf) {
						treeObj.checkNode(toBeCheckedLeaf, true, null, true);
					}
				}
			} else {
				$("#privilege_tree").html("暂时没有菜单数据");
			}
			$treeModal.modal({
				'backdrop': 'static',
				'show': true
			});
		}

	/**行展开*/
	$table.on("click", '.editrow', function(e) {
		e.stopPropagation();
		var $this = $(this);
		var $thisTr = $this.parent().parent();
		var $thatTr = $thisTr.next();
		if (!$thatTr.find(".arrow").length) {
			var id = $this.attr("rowid");
			var curData = tableData[id];
			var temp = rowTemplateHtml.replace(/{rowid}/g, curData.id)
				.replace("{roleId}", curData.roleName || "")
				.replace("{source}", curData.source || "")
				.replace("{description}", curData.description || "");
			var trHtml = unfoldTrHtml.replace("{0}", temp);
			$(".row-edit-container").remove();
			$thisTr.after($(trHtml));
		} else {
			return false;
		}
	});

	/**行编辑-确定*/
	$table.on("click", '#dict_detail_confirm', function(e) {
		$.ajax({
			type: "POST",
			url: requestContextPath + "/roleresource/edit.html",
			data: {
				id:  $("#edit_id").val().trim(),
				param_roleName: $("#edit_roleId_ipt").val().trim(),
				param_source: $("#edit_source_ipt").val().trim(),
			},
			dataType: "json",
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