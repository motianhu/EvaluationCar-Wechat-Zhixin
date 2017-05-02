~function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var $treeModal = $("#tree_modal");
	var $createContainer = $('#for_create_container');
	var pageSourceTreeNode = null;
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;
	
	var editResource = null;

	beautifulSelect2();

	function beautifulSelect2() {

		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}
	;

	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			param_sourceName : "",
			param_sourceInfo : "",
			param_sourceType : "",
			param_description : ""
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.param_sourceName = $("#name_ipt").val().trim();
			_queryParam.param_sourceInfo = $("#info_ipt").val().trim();
			_queryParam.param_sourceType = $("#type_ipt").val().trim();
			_queryParam.param_description = $("#description_ipt").val().trim();
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
		$.ajax({
			type : "POST",
			url : requestContextPath + "/resource/add.html",
			data : {
				param_sourceName : $("#add_name_ipt").val().trim(),
				param_sourceInfo : $("#add_info_ipt").val().trim(),
				param_sourceType : $("#add_typeSelect").val().trim(),
				param_description : $("#add_description_ipt").val().trim(),
			},
			dataType: "json",
			success : function(data) {
				if (data.success) {
					$createContainer.hide();
					search();
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
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
			url : requestContextPath + "/resource/export.html",
			data : getParam(),
			cache : false,
			dataType : "text",
			success : function(data) {
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
	 */
	$jTable = $table.table({
		ajaxUrl : requestContextPath + "/resource/getList.html",
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
							+ curRow.id + "'>" + curRow.id + "</span>"); // 编号
					list.push(curRow.sourceName);
					list.push(curRow.sourceInfo);
					list.push(curRow.sourceType);
					list.push(curRow.description);
					dataList.push(list);
				}
				;
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
			var name = "", ids = [ 'main' ];
			// 默认有mian主页
			var idxCount = 1;
			if (nodes.length > 0) {
				for (var i = 0; i < nodes.length; i++) {
					if (!nodes[i].isParent) {
						ids[idxCount] = nodes[i].id;
						idxCount = idxCount + 1;
					}
				}
			}
			var idsToStr = ids.join();
			$(targetObjectName).val(idsToStr);
		}
		// 显示数据到文本框中
		$treeModal.modal('hide');
	});

	$("#tree_modal_btnCancel").click(function() {
		$treeModal.modal('hide');
	});

	// 页面树编辑时选择父对象
	/**
	$("#pageSourceEdit_btn").click(function() {
		$.ajax({
			type : "POST",
			url : requestContextPath + "/filemanager/getFileContent.html",
			data : {
				fileName : '/view/admin/systemmanager/resource.json'
			},
			dataType: "json",
			success : function(data) {
				if (data.success) {
					$("#resourceJson").val(data.object);
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		});
		
		$treeModal.modal({
			'backdrop' : 'static',
			'show' : true
		});
	});
    **/
	
	$("#pageSourceEdit_btn").click(function() {
		$.ajax({
			type : "POST",
			url : requestContextPath + "/common/getDict.html",
			data : {
				mainItem : 'menumanager'
			},
			dataType: "json",
			success : function(data) {
				if (data.success) {
					editResource = data.object;
					$("#resourceJson").val(data.object.description);
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		});
		
		$treeModal.modal({
			'backdrop' : 'static',
			'show' : true
		});
	});
	
	// 新增窗口弹出 --  树
	/**
	$("#tree_modal_btnSave").click(function() {
		$.ajax({
			type : "POST",
			url : requestContextPath + "/filemanager/writeFileContent.html",
			data : {
				fileName : '/view/admin/systemmanager/resource.json',
				content : $("#resourceJson").val()
			},
			dataType : "json",
			success : function(data) {
				if (data.success) {
					$treeModal.modal('hide');
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		});

	});
    **/
	
	$("#tree_modal_btnSave").click(function() {
		editResource.description = $("#resourceJson").val();
		$.ajax({
			type : "POST",
			url : requestContextPath + "/dictmanager/editDict.html",
			data : editResource,
			dataType : "json",
			success : function(data) {
				if (data.success) {
					$treeModal.modal('hide');
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		});

	});
	
	// 新增窗口弹出
	$("#source_modal_btnSave").click(function() {
		// debugger;
		var treeNode = pageSourceTreeNode;
		var newCount = 1;
		var zTree = $.fn.zTree.getZTreeObj("privilege_tree");
		var id = 100 + newCount;
		// 添加子节点信息
		zTree.addNodes(treeNode, {
			id : (100 + newCount),
			pId : treeNode.id,
			name : "new node" + (newCount++)
		});

		var nodes = zTree.getNodes();
		var curNode = [];
		var myNodes = buildTreeData(curNode, nodes);

		$.ajax({
			type : "POST",
			url : requestContextPath + "/resource/getTreeData.html",
			data : {
				param_treeData : myNodes
			},
			success : function(data) {
				if (data.success) {

				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		});

		$("#source_modal").modal('hide');
	});

	
	/** 行展开 */
	$table.on("click", '.editrow', function(e) {
		e.stopPropagation();

		var $this = $(this);
		var $thisTr = $this.parent().parent();
		var $thatTr = $thisTr.next();
		if (!$thatTr.find(".arrow").length) {
			var id = $this.attr("rowid");
			var curData = tableData[id];
			var temp = rowTemplateHtml.replace(/{rowid}/g, curData.id).replace(
					"{name}", curData.sourceName || "").replace("{info}",
					curData.sourceInfo || "").replace("{description}",
					curData.description || "");
			var trHtml = unfoldTrHtml.replace("{0}", temp);
			$(".row-edit-container").remove();
			$thisTr.after($(trHtml));
			$("#edit_type_ipt")
					.find('option[value=' + curData.sourceType + ']').attr(
							"selected", "selected");

			// 设置样式
			beautifulSelect2();
		} else {
			return false;
		}
	});

	/** 行编辑-确定 */
	$table.on("click", '#dict_detail_confirm', function(e) {
		$.ajax({
			type : "POST",
			url : requestContextPath + "/resource/edit.html",
			data : {
				id : $("#edit_id").val().trim(),
				param_sourceName : $("#edit_name_ipt").val().trim(),
				param_sourceInfo : $("#edit_info_ipt").val().trim(),
				param_sourceType : $("#edit_type_ipt").val().trim(),
				param_description : $("#edit_description_ipt").val().trim(),
			},
			dataType: "json",
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
		});
	});

	/** 行收缩-取消 */
	$table.on("click", '#dict_detail_cancel', function(e) {
		$(".row-edit-container").remove();
	});
}(jQuery, window)