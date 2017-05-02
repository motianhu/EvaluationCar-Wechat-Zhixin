~ function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var $createContainer = $('#for_create_container');
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;
	var $detail_modal = $("#detail_modal"); 

	beautifulSelect2();
	
	function beautifulSelect2() {
		
		$(".beautifulSelect2").select2({
			  theme: "classic"
		});
	};
	
	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			title: "",
			content: "",
			createUser:"",
			isReaded: "",
			fileType: "xls"
		}
		var toString = function(o) {
			for (var x in o) {
				if (o[x] && o[x] instanceof Array) o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.title = $("#title").val().trim();
			_queryParam.content = $("#content").val().trim();
			_queryParam.createUser = $("#createUser").val().trim();
			_queryParam.isReaded = $("#isReadedSelect").val();
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

	/** 导出记录 */
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
			url: requestContextPath + "/usermessage/export.html",
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

	/*
	 * 表格初始化，这里为了测试数据，url写的fake
	 */
	$jTable = $table.table({
		ajaxUrl: requestContextPath + "/usermessage/getUserMessageList.html",
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
					list.push("<span rowid='" + curRow.id + "'>" + curRow.id + "</span>"); // 编号
					list.push(curRow.recordFrom); 
					list.push("<span class='fastWeb-wrap'>" + curRow.title + "</span>"); 
					list.push("<a href='#' class='openShortConent' rowid='" + curRow.id + "'><span>" +curRow.shortContent + "</span></a>"); // 编号
					list.push(curRow.createUser);
					list.push(curRow.isReaded == "1" ? "<span class='status-metro status-disabled'>已读</span>" : "<span class='status-metro status-active'>未读</span>");
					dataList.push(list);
				};
			}
			dataSet.list = dataList;
			return dataSet;
		}
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
			
			var $next = $thisTr.next();
			
			var isChecked = curData.status ? 'checked' : "";
			var temp = rowTemplateHtml.replace(/{rowid}/g, curData.id)
				.replace("{edit_title}", curData.title || "")
				.replace("{edit_readedUser}", curData.readedUser || "")
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

	/** 行编辑-确定 */
	$table.on("click", '#dict_detail_confirm', function(e) {
		var id = $(this).attr("rowid");
		var status = $('#edit_status').prop("checked") ? 1 : 0;
		$.ajax({
			type: "POST",
			url: requestContextPath + "/usermessage/edit.html",
			data: {
				id:  id,
				title: $("#edit_title").val().trim(),
				content: $("#edit_content").html(),
				readedUser: $("#edit_readedUser").val().trim(),
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

	/** 行收缩-取消 */
	$table.on("click", '#dict_detail_cancel', function(e) {
		$(".row-edit-container").remove();
	});
	
	
	/***  打开消息内容  **/
	$table.on("click", '.openShortConent', function(e) {
		
		var $this = $(this);
		var id = $this.attr("rowid");
		
		// 查找未读，设置已读
		var $thisTd = $this.parent();
		var $thisTr = $thisTd.parent();
		var $unReaded = $thisTr.find(".status-active");
		
		// 设置已读 
		updateReaded(id, $unReaded);
		 
		$detail_modal.modal('show');

		if (id != null && id.length >0) {
			var curData = tableData[id];
			$("#detail_title").html(curData.title);
			$("#detail_content").html(curData.content);
		}
		
	});
	
	/***  更新消息已读  **/
	function updateReaded(rowid, $unReaded) {
		// 阅读
		var id = rowid;
		$.ajax({
			type: "POST",
			url: requestContextPath + "/usermessage/readed.html",
			data: {
				id:  id
			},
			dataType : 'json',
			success: function(data) {
				if (data.success) {
					if ($unReaded !=null && $unReaded.length >0) {
						$unReaded.removeClass('status-active').addClass('status-disabled');
						$unReaded.text('已读');
					}
					// 调用父窗口方法， 刷新信息
					window.parent.refreshMessage();
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

	
}(jQuery, window)