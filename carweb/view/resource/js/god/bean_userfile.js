~function($, window) {
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
			theme : "classic"
		});
	}

	initUploadFile();
	var url = window.location.href;
	var mainUrl = "";

	initUrl();

	function initUrl() {
		var httpHeader = "http://";
		mainUrl = url.substring(httpHeader.length);
		mainUrl = httpHeader + mainUrl.substring(0, mainUrl.indexOf('/'));
	}

	function initUploadFile() {
		$("#uploadFile")
				.uploadify(
						{
							'buttonText' : '选择上传文件',
							'swf' : requestContextPath
									+ "/view/resource/uploadify/uploadify.swf",
							'uploader' : requestContextPath
									+ "/userfile/addUserFile.html",
							'formData' : {
								'dirPath' : ''
							},
							'auto' : true,
							'fileObjName' : 'uploadFile',
							// 'multi' : false,
							// 'removeCompleted':false,
							// 'queueSizeLimit' : 50,
							'queueID' : 'fileQueue',
							'cancelImg' : '../../uploadify/uploadify-cancel.png',
							'fileTypeExts' : '*.jpg;*.jpge;*.gif;*.png;*.txt;*.text;*.xls;*.xlsx;*.doc;*.docx',
							'fileSizeLimit' : '2MB',
							'onUploadComplete' : function(file) {
								// initFileTree(); 刷新有问题
								// 这个是每个文件上传成功后，触发的事件
							},
							'onQueueComplete' : function(queueData) {
								// 上传成功, 刷新分类, 队列完成时，才触发
								initFileCategoryList();
								search();
							},
							'onUploadStart' : function(file) {
								$("#uploadFile").uploadify(
										"settings",
										"formData",
										{
											'category' : $('#newCategory')
													.val()
													|| ''
										});
							},
							// 加上此句会重写onSelectError方法【需要重写的事件】
							'overrideEvents' : [ 'onSelectError',
									'onDialogClose' ],
							// 返回一个错误，选择文件的时候触发
							'onSelectError' : function(file, errorCode,
									errorMsg) {
								switch (errorCode) {
								case -110:
									$.msgbox.show({
										'type' : 'error',
										'text' : "文件 ["
												+ file.name
												+ "] 大小超出系统限制的"
												+ $('#uploadFile').uploadify(
														'settings',
														'fileSizeLimit')
												+ "大小！",
										'title' : '错误'
									});
									break;
								case -120:
									$.msgbox
											.show({
												'type' : 'error',
												'text' : "文件 [" + file.name
														+ "] 大小异常！",
												'title' : '错误'
											});
									break;
								case -130:
									$.msgbox.show({
										'type' : 'error',
										'text' : "文件 [" + file.name
												+ "] 类型不正确！",
										'title' : '错误'
									});
									break;
								}
							},
						});
	}

	$("#newCategorySelect").change(function() {
		var selectedCategory = $("#newCategorySelect").val();
		$("#newCategory").val(selectedCategory);
	});

	initFileCategoryList();

	/**
	 * 初始化分类
	 * 
	 */
	function initFileCategoryList() {
		// 获取推广渠道类型和渠道大类
		Util.ajax({
			url : requestContextPath + "/userfile/getCategoryList.html",
			data : {},
			dataType : "json",
			success : function(data) {
				var comboOptions = "<option value='' selected>请选择分类</option>";
				if (data.total > 0) {
					var total = data.total;
					var items = data.data;
					for (var i = 0; i < total; i++) {
						comboOptions += "<option  value='"
								+ items[i]["category"] + "'>"
								+ items[i]["category"] + "</option>"; // 使用全部小写，具体查看jquery
						// .data
					}
				}
				$(".category_sel").html(comboOptions).multiselect('refresh');
			}
		});
	}

	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			fileName : "",
			category : "",
			fileType : "xls"
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.fileName = $("#fileName").val().trim();
			_queryParam.category = $("#categorySelect").val();
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
		var code = $("#add_fileName").val().trim();
		var status = $('#statusCreate').prop("checked") ? 1 : 0;
		$.ajax({
			type : "POST",
			url : requestContextPath + "/userfile/addUserFile.html",
			data : {
				fileName : fileName,
				status : status
			},
			dataType : 'json',
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
			url : requestContextPath + "/userfile/exportUserFile.html",
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

	$("#searchBtn").click(search);

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

	// $table.on("click", '.fastWeb-copy-url', function(e) {
	// var rowid = $(this).attr('rowid');
	// var curData = tableData[rowid];

	// var clip = new ZeroClipboard( document.getElementById("c1opy") );
	// clip.setText('我的测试');
	// clip.setData('text/html', '我的测试');
	// });

	/*
	 * 表格初始化，这里为了测试数据，url写的fake
	 */
	$jTable = $table.table({
		ajaxUrl : requestContextPath + "/userfile/getUserFileList.html",
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
					list.push({
						checked : false,
						rowid : curRow.id
					// 列id还是合同id，需要看实际场景
					});
					list.push("<span class='icon-edit editrow' rowid='"
							+ curRow.id + "'>" + curRow.id + "</span>"); // 编号
					list.push(curRow.category);
					list.push("<img onerror='noFindImg();' src='"
							+ curRow.previewPath + "' />");
					list.push(curRow.fileName);
					list.push(curRow.createUser);
					// list.push("<button class='fastWeb-file-delete' rowid='"
					// + curRow.id + "'>删除</button>");
					dataList.push(list);
				}
			}
			dataSet.list = dataList;
			return dataSet;
		}
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

	$("#delCategoryBtn").click(
			function() {

				$.msgbox.show({
					'type' : 'info',
					'text' : '是否该分类？',
					'title' : '删除分类',
					'confirmCb' : function() {

						// 删除分类
						var category = $("#newCategory").val();
						$.ajax({
							type : "POST",
							url : requestContextPath
									+ "/userfile/deleteCategoryUserFile.html",
							data : {
								category : category
							},
							dataType : 'json',
							success : function(data) {
								if (data.success) {
									initFileCategoryList();
									$("#newCategory").val('');

									$("#select2-newCategorySelect-container")
											.html('');
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
				});

			});

	$("#delSelectedFilesBtn").click(function() {

		$.msgbox.show({
			'type' : 'info',
			'text' : '是否批量删除改文件？',
			'title' : '批量删除文件',
			'confirmCb' : function() {

				// 全部删除
				var rows = getCheckedRows();
				var rowids = rows.ids;
				rowids = rowids.join();
				if (rowids.length == 0) {
					return false;
				}
				$.ajax({
					type : "POST",
					url : requestContextPath + "/userfile/deleteUserFile.html",
					data : {
						ids : rowids
					},
					dataType : 'json',
					success : function(data) {
						if (data.success) {
							initFileCategoryList();
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
		});

	});

	$table.on("click", '.fastWeb-file-delete', function(e) {
		var tableRow = $(this);
		$.msgbox.show({
			'type' : 'info',
			'text' : '是否删除此文件？',
			'title' : '删除文件',
			'confirmCb' : function() {

				fileOneDelete(tableRow);

			}
		});

	});

	function fileOneDelete(tableRow) {
		// 单个删除
		var rowid = tableRow.attr('rowid');
		var curData = tableData[rowid];
		var id = curData.id;
		$.ajax({
			type : "POST",
			url : requestContextPath + "/userfile/deleteUserFile.html",
			data : {
				ids : id
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
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
			var temp = rowTemplateHtml.replace(/{rowid}/g, curData.id).replace(
					"{edit_id}", curData.id || "").replace("{edit_category}",
					curData.category || "").replace("{edit_fileName}",
					curData.fileName || "").replace(/{edit_path}/g,
					curData.path || "").replace(
					"{edit_qrCode}",
					requestContextPath + "/common/imageQrCode.html?content="
							+ curData.path)
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
		var id = $('#edit_id').val().trim();
		var status = $('#edit_status').prop("checked") ? 1 : 0;
		$.ajax({
			type : "POST",
			url : requestContextPath + "/userfile/editUserFile.html",
			data : {
				id : id,
				status : status
			},
			dataType : 'json',
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