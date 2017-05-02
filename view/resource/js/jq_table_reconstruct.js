/* jQuery Resizable Columns v0.1.0 |
 * http://dobtco.github.io/jquery-resizable-columns/ |
 * Licensed MIT | Built Wed Apr 30 2014 14:24:25 */
~ function($, window) {
	var __bind = function(fn, me) {
			return function() {
				return fn.apply(me, arguments);
			};
		},
		__slice = [].slice;
	var ResizableColumns, parseWidth, pointerX, setWidth;
	parseWidth = function(node) {
		return parseFloat(node.style.width.replace('%', ''));
	};
	setWidth = function(node, width) {
		width = width.toFixed(2);
		return node.style.width = "" + width + "%";
	};
	pointerX = function(e) {
		if (e.type.indexOf('touch') === 0) {
			return (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]).pageX;
		}
		return e.pageX;
	};
	ResizableColumns = (function() {
		ResizableColumns.prototype.defaults = {
			selector: 'tr th:visible',
			store: window.store,
			syncHandlers: true,
			resizeFromBody: true,
			maxWidth: null,
			minWidth: null
		};

		function ResizableColumns($table, options) {
			this.pointerdown = __bind(this.pointerdown, this);
			this.constrainWidth = __bind(this.constrainWidth, this);
			this.options = $.extend({}, this.defaults, options);
			this.$table = $table;
			this.setHeaders();
			this.restoreColumnWidths();
			this.syncHandleWidths();
			$(window).on('resize.rc', ((function(_this) {
				return function() {
					return _this.syncHandleWidths();
				};
			})(this)));
			if (this.options.start) {
				this.$table.bind('column:resize:start.rc', this.options.start);
			}
			if (this.options.resize) {
				this.$table.bind('column:resize.rc', this.options.resize);
			}
			if (this.options.stop) {
				this.$table.bind('column:resize:stop.rc', this.options.stop);
			}
		}

		ResizableColumns.prototype.triggerEvent = function(type, args, original) {
			var event;
			event = $.Event(type);
			event.originalEvent = $.extend({}, original);
			return this.$table.trigger(event, [this].concat(args || []));
		};

		ResizableColumns.prototype.getColumnId = function($el) {
			return this.$table.data('resizable-columns-id') + '-' + $el.data('resizable-column-id');
		};

		ResizableColumns.prototype.setHeaders = function() {
			this.$tableHeaders = this.$table.find(this.options.selector);
			this.assignPercentageWidths();
			return this.createHandles();
		};

		ResizableColumns.prototype.destroy = function() {
			this.$handleContainer.remove();
			this.$table.removeData('resizableColumns');
			return this.$table.add(window).off('.rc');
		};

		ResizableColumns.prototype.assignPercentageWidths = function() {
			return this.$tableHeaders.each((function(_this) {
				return function(_, el) {
					var $el;
					$el = $(el);
					return setWidth($el[0], $el.outerWidth() / _this.$table.width() * 100);
				};
			})(this));
		};

		ResizableColumns.prototype.createHandles = function() {
			var _ref;
			if ((_ref = this.$handleContainer) != null) {
				_ref.remove();
			}
			this.$table.before((this.$handleContainer = $("<div class='rc-handle-container' />")));
			this.$tableHeaders.each((function(_this) {
				return function(i, el) {
					var $handle;
					if (_this.$tableHeaders.eq(i + 1).length === 0 || (_this.$tableHeaders.eq(i).attr('data-noresize') != null) || (_this.$tableHeaders.eq(i + 1).attr('data-noresize') != null)) {
						return;
					}
					$handle = $("<div class='rc-handle' />");
					$handle.data('th', $(el));
					return $handle.appendTo(_this.$handleContainer);
				};
			})(this));
			return this.$handleContainer.on('mousedown touchstart', '.rc-handle', this.pointerdown);
		};

		ResizableColumns.prototype.syncHandleWidths = function() {
			return this.$handleContainer.width(this.$table.width()).find('.rc-handle').each((function(_this) {
				return function(_, el) {
					var $el;
					$el = $(el);
					return $el.css({
						left: $el.data('th').outerWidth() + ($el.data('th').offset().left - _this.$handleContainer.offset().left),
						height: _this.options.resizeFromBody ? _this.$table.height() : _this.$table.find('thead').height()
					});
				};
			})(this));
		};

		ResizableColumns.prototype.saveColumnWidths = function() {
			return this.$tableHeaders.each((function(_this) {
				return function(_, el) {
					var $el;
					$el = $(el);
					if ($el.attr('data-noresize') == null) {
						if (_this.options.store != null) {
							return _this.options.store.set(_this.getColumnId($el), parseWidth($el[0]));
						}
					}
				};
			})(this));
		};

		ResizableColumns.prototype.restoreColumnWidths = function() {
			return this.$tableHeaders.each((function(_this) {
				return function(_, el) {
					var $el, width;
					$el = $(el);
					if ((_this.options.store != null) && (width = _this.options.store.get(_this.getColumnId($el)))) {
						return setWidth($el[0], width);
					}
				};
			})(this));
		};

		ResizableColumns.prototype.totalColumnWidths = function() {
			var total;
			total = 0;
			this.$tableHeaders.each((function(_this) {
				return function(_, el) {
					return total += parseFloat($(el)[0].style.width.replace('%', ''));
				};
			})(this));
			return total;
		};

		ResizableColumns.prototype.constrainWidth = function(width) {
			if (this.options.minWidth != null) {
				width = Math.max(this.options.minWidth, width);
			}
			if (this.options.maxWidth != null) {
				width = Math.min(this.options.maxWidth, width);
			}
			return width;
		};

		ResizableColumns.prototype.pointerdown = function(e) {
			var $currentGrip, $leftColumn, $ownerDocument, $rightColumn, newWidths, startPosition, widths;
			e.preventDefault();
			$ownerDocument = $(e.currentTarget.ownerDocument);
			startPosition = pointerX(e);
			$currentGrip = $(e.currentTarget);
			$leftColumn = $currentGrip.data('th');
			$rightColumn = this.$tableHeaders.eq(this.$tableHeaders.index($leftColumn) + 1);
			widths = {
				left: parseWidth($leftColumn[0]),
				right: parseWidth($rightColumn[0])
			};
			newWidths = {
				left: widths.left,
				right: widths.right
			};
			this.$handleContainer.add(this.$table).addClass('rc-table-resizing');
			$leftColumn.add($rightColumn).add($currentGrip).addClass('rc-column-resizing');
			this.triggerEvent('column:resize:start', [$leftColumn, $rightColumn, newWidths.left, newWidths.right], e);
			$ownerDocument.on('mousemove.rc touchmove.rc', (function(_this) {
				return function(e) {
					var difference;
					difference = (pointerX(e) - startPosition) / _this.$table.width() * 100;
					setWidth($leftColumn[0], newWidths.left = _this.constrainWidth(widths.left + difference));
					setWidth($rightColumn[0], newWidths.right = _this.constrainWidth(widths.right - difference));
					if (_this.options.syncHandlers != null) {
						_this.syncHandleWidths();
					}
					return _this.triggerEvent('column:resize', [$leftColumn, $rightColumn, newWidths.left, newWidths.right], e);
				};
			})(this));
			return $ownerDocument.one('mouseup touchend', (function(_this) {
				return function() {
					$ownerDocument.off('mousemove.rc touchmove.rc');
					_this.$handleContainer.add(_this.$table).removeClass('rc-table-resizing');
					$leftColumn.add($rightColumn).add($currentGrip).removeClass('rc-column-resizing');
					_this.syncHandleWidths();
					_this.saveColumnWidths();
					return _this.triggerEvent('column:resize:stop', [$leftColumn, $rightColumn, newWidths.left, newWidths.right], e);
				};
			})(this));
		};

		return ResizableColumns;

	})();
	return $.fn.extend({
		resizableColumns: function() {
			var args, option;
			option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
			return this.each(function() {
				var $table, data;
				$table = $(this);
				data = $table.data('resizableColumns');
				if (!data) {
					$table.data('resizableColumns', (data = new ResizableColumns($table, option)));
				}
				if (typeof option === 'string') {
					return data[option].apply(data, args);
				}
			});
		}
	});
}(window.jQuery, window);

/* ===================================================
 * based on jQuery
 * author:amixu
 * date:2011-12-23
 * modified:thinking 2014-07-31
 * ========================================================== */
$.fn.table = function(params) {
	"use strict"; // jshint ;_;
	var defaults = {
		pageKey: {
			total: "total",
			pageSize: "pageSize",
			curPage: "curPage"
		}, //表格分页涉及的key值
		ajaxUrl: "", //点击页码和页数时发送的ajax请求的url，即表格数据所在的页面路径，pageSize和curPage通过插件内部方法自动链接到该url后面
		method: "get", //ajax请求方法
		isOddClassNeed: true, // 是否需要偶数行展示样式，默认
		paramsJson: {}, //ajax请求的参数(查询条件的参数，不包括pageSize和curPage)，可以是json对象，也可以是此格式"param1=a&param2=b"
		clickFun: function(size, page) {}, //如果ajaxUrl为空，点击页码和页数时会触发此函数，此函数的两个参数分别表示当前页码和页数，通过插件传出来的，直接使用即可
		callBefore: function() {}, //ajax请求前要触发的动作，比如对于慢的分页可以加一个正在加载中的提示
		callBack: function() {}, //ajax请求完毕后的回调函数
		isHideCols: false, //是否隐藏列，如果此参数为false，则忽略后面三个参数
		defaultColsNum: [], //最原始的默认隐藏列，数字数组，0表示第一列
		hideColsNum: [], //从cookie里面取出来的默认隐藏列，如果没有使用cookie，则hideColsNum和defaultColsNum的值应保持一致
		checkboxFun: function(str) {}, //点击隐藏列复选框所触发的事件，返回所有的隐藏列号
		tbodyMaker: function() {} //构造table body的文本内容
	};
	$.extend(defaults, params);

	var $table = $(this),
		pageKey = defaults.pageKey,
		tTotal = 0,
		tPageSize = parseInt(defaults[pageKey.pageSize], 10) ? parseInt(defaults[pageKey.pageSize], 10) : 20, //默认显示的记录数
		tCurPage = parseInt(defaults[pageKey.curPage], 10) ? parseInt(defaults[pageKey.curPage], 10) : 1, //默认当前页
		tAllPages = 0,
		clickFun = defaults.clickFun,
		ajaxUrl = defaults.ajaxUrl,
		method = defaults.method,
		isOddClassNeed = defaults.isOddClassNeed,
		isHideCols = defaults.isHideCols,
		hideColsNum = defaults.hideColsNum,
		defaultColsNum = defaults.defaultColsNum,
		paramsJson = defaults.paramsJson,
		checkboxFun = defaults.checkboxFun,
		callBefore = defaults.callBefore,
		callBack = defaults.callBack,
		tbodyMaker = defaults.tbodyMaker,
		$panelBox = null,
		$thead = $table.find(">thead").find(".thead").addClass("table-check-empty"),
		$tbody = $table.find(">tbody"),
		$tfoot = $table.find(">tfoot"),
		$recTotal = null,
		$recRange = null;

	$tbody = $tbody.length === 0 ? $("<tbody></tbody>").appendTo($table) : $tbody;
	$tfoot = ($tfoot.length === 0 ? $("<tfoot></tfoot>").appendTo($table) : $tfoot).hide();

	function refreshTfoot(total) {
		function getpageNumHtml(num, allPage, curPage) {
			for (var i = num; i <= allPage; i++) {
				if (i === curPage) {
					pageNumHtml += "<span class='page_num light_page_num'>" + i + "</span>";
				} else {
					pageNumHtml += "<span class='page_num'>" + i + "</span>";
				}
			}
		}
		if (total <= 0) {
			$tfoot.hide();
			return;
		}
		$tfoot.show();
		tAllPages = Math.ceil(total / tPageSize);
		var fIndex = tPageSize * (tCurPage - 1);
		var lIndex = tPageSize * tCurPage;
		lIndex = lIndex > total ? total : lIndex;
		$recTotal.html(total);
		$recRange.html((fIndex + 1) + "-" + lIndex);
		var pageSizeHtml = "";
		if (tAllPages > 1) {
			pageSizeHtml = "<div class='page_size_box'> 跳到 <input class='input-mini' name='page_num' style='margin-top: 5px;height: 25px;' size='1'/> 页 <div class='pageBtn' style='display: inline-block;cursor: pointer;'><span style='border-bottom: 1px solid rgb(89, 89, 89);'>GO</span></div></div>";
		}
		var pageNumHtml = "<div class='page_num_box' style='margin-top: 12px;'>";
		if (tCurPage === 1) {
			pageNumHtml += "<span class='pageUp' style='cursor: pointer;padding-right: 10px;color: rgb(165, 163, 163);'>上一页</span>";
		} else {
			pageNumHtml += "<span class='pageUp' style='cursor: pointer;padding-right: 10px;'>上一页</span>";
		}
		if (tAllPages === 1) {
			pageNumHtml = "<div style='display:none'>";
		} else if (tAllPages > 1 && tAllPages < 8) {
			getpageNumHtml(1, tAllPages, tCurPage);
		} else if (tCurPage < 5) {
			getpageNumHtml(1, 5, tCurPage);
			pageNumHtml += "<span class='ellipsis_num'>..</span><span class='page_num'>" + tAllPages + "</span>";
		} else if (tCurPage > tAllPages - 4) {
			pageNumHtml += "<span class='page_num'>1</span><span class='ellipsis_num'>..</span>";
			getpageNumHtml(tAllPages - 4, tAllPages, tCurPage);
		} else {
			pageNumHtml += "<span class='page_num'>1</span><span class='ellipsis_num'>..</span><span class='page_num'>" + (tCurPage - 1) + "</span><span class='page_num light_page_num'>" + tCurPage + "</span><span class='page_num'>" + (tCurPage + 1) + "</span><span class='ellipsis_num'>..</span><span class='page_num'>" + tAllPages + "</span>";
		}
		if (tCurPage === tAllPages) {
			pageNumHtml += "<span class='pageDown' style='cursor: pointer;padding-left: 10px;color: rgb(165, 163, 163);'>下一页</span>";
		} else {
			pageNumHtml += "<span class='pageDown' style='cursor: pointer;padding-left: 10px;'>下一页</span>";
		}
		pageNumHtml += "</div>";
		pageSizeHtml += pageNumHtml;
		$tfoot.find(".pagebox_jump").html(pageSizeHtml);
	}

	function initTfoot() {
		$tfoot.html("<tr><td class='pagebox' colspan='999'><div class='pagebox_select' style='float:left;margin-top: 10px;'></div><div class='pagebox_jump'></div></td></tr>")
		var pageHtml = "<div class='page_size_box'>当前显示 <b class='blue page_size_box_rec_total'></b> 条中 <b class='blue page_size_box_rec_range'></b> 条 <select name='page_size' style='width: 140px;height: 25px;margin-top: 5px;' class='page_size'>";
		if (tPageSize === 10) {
			pageHtml += "<option value='10' selected>每页显示10行</option>";
		} else {
			pageHtml += "<option value='10'>每页显示10行</option>";
		}
		if (tPageSize === 20) {
			pageHtml += "<option value='20' selected>每页显示20行</option>";
		} else {
			pageHtml += "<option value='20'>每页显示20行</option>";
		}
		if (tPageSize === 50) {
			pageHtml += "<option value='50' selected>每页显示50行</option>";
		} else {
			pageHtml += "<option value='50'>每页显示50行</option>";
		}
		if (tPageSize === 100) {
			pageHtml += "<option value='100' selected>每页显示100行</option>";
		} else {
			pageHtml += "<option value='100'>每页显示100行</option>";
		}
		// 用于增加每页显示1000行的功能
		if (tPageSize === 1000) {
			pageHtml += "<option value='1000' selected>每页显示1000行</option>";
		} else {
			pageHtml += "<option value='1000'>每页显示1000行</option>";
		}
		pageHtml += "</select></div>";

		$tfoot.find(".pagebox_select").html(pageHtml).find(".page_size").multiselect({
			header: false,
			multiple: false,
			selectedList: 1
		});
		$recTotal = $tfoot.find(".page_size_box_rec_total");
		$recRange = $tfoot.find(".page_size_box_rec_range");
	}

	initTableData();
	// 初始化表格数据
	function initTableData() {
		initTfoot();
		updateTable();
	}

	// 更新表格数据
	function updateTable() {
		if (!ajaxUrl) {
			clickFun(tPageSize, tCurPage);
		} else {
			refreshTableData(paramsJson);
		}
	}

	// 刷新表格数据
	function refreshTableData(paramsJson) {
		var dataObj = paramsJson;
		dataObj[pageKey["pageSize"]] = tPageSize;
		dataObj[pageKey["curPage"]] = tCurPage;
		Util.ajax({
			url: ajaxUrl,
			dataType: "json",
			data: dataObj,
			success: function(data) {
				tTotal = data[pageKey["total"]];
				makeTableHtml(tbodyMaker.call(null, data));
				$thead.removeClass('table-check');
				if (isOddClassNeed) {
					$tbody.find(">tr:odd").addClass("odd");
				}
				callBack.call();
				$table.resizableColumns();
				$("body").animate({
					scrollTop: 0
				}, 200);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {}
		}, "表格数据加载中");
	}

	// 构造表格body和updateFoot
	function makeTableHtml(dataSet) {
		if (!dataSet) {
			tbodyHtml = "<tr><td colspan='999'>没有记录</td></tr>";
			$tbody.html(tbodyHtml);
			refreshTfoot(0);
			return;
		}
		var total = dataSet.total,
			list = dataSet.list,
			tbodyHtml = "";
		if (dataSet.total <= 0) {
			tbodyHtml = "<tr><td colspan='999'>没有记录</td></tr>";
		} else {
			var tbodyHtmlArr = [];
			if (list) {
				for (var i = 0, len = list.length; i < len; i++) {
					tbodyHtmlArr.push("<tr data-table-rowid='" + i + "'>");
					for (var j = 0, len1 = list[i].length; j < len1; j++) {
						var oItem = list[i][j];
						if (oItem && (typeof oItem.checked) == "boolean") { // 勾选框
							var tdHtmlStr;
							if (oItem.checked) {
								oItem = '<div class="table-check-empty table-check" rowid="' + oItem.rowid + '"></div>';
							} else {
								oItem = '<div class="table-check-empty" rowid="' + oItem.rowid + '"></div>';
							}
							tdHtmlStr = "<td>" + oItem + "</td>";
						} else if (oItem && oItem.className) {
							tdHtmlStr = "<td class='" + oItem.className + "'>" + oItem.innerHtml + "</td>";
						} else if (/(^<|>$)/.test(oItem)) {
							tdHtmlStr = "<td>" + oItem + "</td>";
						} else if (oItem == "有效" || oItem == "无效") {
							tdHtmlStr = "<td title='" + oItem + "'>" + (oItem == "有效" ? "<span class='status-metro status-active'>" : "<span class='status-metro status-disabled'>") + oItem + "</span></td>";
						} else {
							if (oItem === undefined || oItem === null) {
								tdHtmlStr = "<td></td>";
							} else {
								tdHtmlStr = "<td title='" + oItem + "'>" + oItem + "</td>";
							}
						}
						tbodyHtmlArr.push(tdHtmlStr);
					}
					tbodyHtmlArr.push("</tr>");
				}
				tbodyHtml = tbodyHtmlArr.join("");
			}
		}
		$tbody.html(tbodyHtml);
		refreshTfoot(total);
	}

	//构造行展开
	//是否要考虑开放接口
	function API_expandRow(rowid) {
		var $tr;
		if (rowid instanceof $) {
			$tr = rowid.parents("tr");
		} else {
			$tr = $("[data-table-rowid=" + rowid + "]");
		}
		if ($tr.length === 0) {
			return;
		}
		var targetRowId = $tr.data("table-rowid");
		if (document.getElementById("table_expand_" + targetRowId)) {
			return false;
		}
		var $containTd = $("<tr class='table-row-edit-container' id='table_expand_" + targetRowId + "'><td colspan='999'></td></tr>").insertAfter($tr).find("td");
		var $containDiv = $("<div>")
		$("<div>").css({

		}).appendTo($containTd);
		return $containDiv.appendTo($containTd);
	}

	//关闭
	function API_closeRow(rowid) {
		if (typeof rowid === "undefined") {
			$(".table-row-edit-container").remove();
		} else if (typeof rowid === "string" || typeof rowid === "number") {
			$("#table_expand_" + rowid).remove();
		} else if (rowid instanceof $) {
			rowid.parents(".table-row-edit-container").remove();
		}
	}

	// 对外开放的API
	// 刷新表格数据
	function API_refreshTableData(newParamsJson) {
		//tPageSize = 20;
		tCurPage = 1;
		refreshTableData(newParamsJson);
	}

	//获取勾选框数据
	function API_getCheckedRowIds() {
			var ids = [],
				$checkboxs = $tbody.find(".table-check");
			for (var i = 0, len = $checkboxs.length; i < len; i++) {
				ids.push($($checkboxs[i]).attr("rowid"));
			}
			return ids;
		}
		//获取表格属性

	function API_getAttributes() {
			return {
				"total": tTotal,
				"pageSize": tPageSize,
				"currentPage": tCurPage
			};
		}
		// 页码跳转按回车键触发
	$tfoot.on("keydown", ".input-mini", function(e) {
		if (e.keyCode === 13) {
			$tfoot.find(".pageBtn").trigger("click");
		}
	});
	// 输入框跳转到第x页，如果当前页和跳转页一致，直接return
	$tfoot.on("click", ".pageBtn", function() {
		var pageBefore = tCurPage;
		tCurPage = +$tfoot.find(".input-mini").val();
		if (pageBefore === tCurPage) {
			return;
		}
		callBefore();
		if (!tCurPage) {
			tCurPage = 1;
		}
		if (tCurPage < 0) {
			tCurPage = 1;
		}
		if (tCurPage > tAllPages) {
			tCurPage = tAllPages;
		}
		updateTable();
	});

	$tfoot.on("click", ".page_num", function() {
		var $this = $(this);
		if ($this.hasClass("light_page_num")) { //如果已经是当前页
			return;
		}
		callBefore();
		tCurPage = +$this.text();
		updateTable();
	});

	$tfoot.on("click", ".pageUp", function() {
		if (tCurPage === 1) {
			return;
		}
		callBefore();
		tCurPage = tCurPage - 1;
		updateTable();
	});

	$tfoot.on("click", ".pageDown", function() {
		if (tCurPage === tAllPages) {
			return;
		}
		callBefore();
		tCurPage = tCurPage + 1;
		updateTable();
	});

	$tfoot.on("change", ".page_size", function() {
		callBefore();
		tPageSize = $tfoot.find(".page_size").val();
		tCurPage = 1; // 当前页翻到第一页
		updateTable();
	});

	$table.on("click", "th.sort", function() {
		sortTable($(this), $table);
	});

	/**选中，未选中切换*/
	$table.on("click", '.table-check-empty', function(e) {
		var $this = $(this);
		if ($this.hasClass('thead')) {
			//thead中的批量选择与不选按钮
			var $checkboxList = $this.closest('table').find('.table-check-empty');
			if ($this.hasClass('table-check')) {
				$checkboxList.removeClass('table-check');
			} else {
				$checkboxList.addClass('table-check');
			}
		} else {
			//tr中的按钮，控制单行
			var $thead = $this.closest('table').find('.thead');
			if ($this.hasClass('table-check')) {
				$this.removeClass('table-check');
				$thead.removeClass('table-check'); //移除表头checkbox
			} else {
				$this.addClass('table-check');
				var $emptyBoxs = $this.closest('table').find('.table-check-empty');
				var $checkedBoxs = $this.closest('table').find('.table-check');
				if ($emptyBoxs.length === $checkedBoxs.length + 1) { //如果被选中的勾选框是全部表格中的，头也选中
					$thead.addClass('table-check');
				}
			}
		}
	});

	function strSortDown(a, b) {
		return (a.sortKey.localeCompare(b.sortKey));
	}

	function strSortUp(a, b) {
		return (b.sortKey.localeCompare(a.sortKey));
	}

	function numSortDown(a, b) {
		return (a.sortKey - b.sortKey);
	}

	function numSortUp(a, b) {
		return (b.sortKey - a.sortKey);
	}

	function sortTable($thObj, $tabObj) {
		var rows = $('>tbody tr:visible', $tabObj).get();
		//获取第几列，col为点中的th在window.table_thead的所有tr中的位置；应该修改为在window.table_thead中display不为none的tr中的位置
		// var col = $thObj.index();
		var col = $thObj.index() - $thObj.closest('tr').find('th:lt(' + $thObj.index() + ')').not(':visible').length;
		if ($thObj.hasClass("sortNum")) {
			$.each(rows, function(index, row) {
				row.sortKey = parseFloat($(row).children().eq(col).text().replace(/,/g, "")) || 0;
			});
			if ($thObj.hasClass('js_down')) {
				$('th.sort', $tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_up');
				rows.sort(numSortDown);
			} else {
				$('th.sort', $tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_down');
				rows.sort(numSortUp);
			}
		} else if ($thObj.hasClass("sortValue")) {
			$.each(rows, function(index, row) {
				row.sortKey = $(row).children().eq(col).find("select").val().toUpperCase();
			});
			if ($thObj.hasClass('js_down')) {
				$('th.sort', $tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_up');
				rows.sort(strSortDown);
			} else {
				$('th.sort', $tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_down');
				rows.sort(strSortUp);
			}

		} else {
			$.each(rows, function(index, row) {
				row.sortKey = $(row).children().eq(col).text().toUpperCase() || "0";
			});
			if ($thObj.hasClass('js_down')) {
				$('th.sort', $tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_up');
				rows.sort(strSortDown);
			} else {
				$('th.sort', $tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_down');
				rows.sort(strSortUp);
			}
		}

		$.each(rows, function(index, row) {
			$('>tbody', $tabObj).append(row);
		});

		$('>tbody tr:visible', $tabObj).removeClass('odd').filter(':odd').addClass('odd');
	};

	// 返回实例，和API
	return {
		table: $table,
		refreshTableData: API_refreshTableData,
		getCheckedRowIds: API_getCheckedRowIds,
		getAttributes: API_getAttributes,
		//closeRow : API_closeRow,
		//expandRow : API_expandRow
	}
};