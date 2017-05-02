// JavaScript Document

(function ($) {
	$.parser = {
		auto : true,
		onComplete : function (_1) {},
		plugins : ["linkbutton", "menu", "menubutton", "splitbutton", "progressbar", "combobox", "numberbox", "validatebox", "searchbox", "numberspinner", "timespinner", "calendar", "datebox", "datetimebox", "layout", "panel", "tabs", "accordion", "window", "dialog"],
		parse : function (_2) {
			var aa = [];
			for (var i = 0; i < $.parser.plugins.length; i++) {
				var _3 = $.parser.plugins[i];
				var r = $(".easyui-" + _3, _2);
				if (r.length) {
					if (r[_3]) {
						r[_3]();
					} else {
						aa.push({
							name : _3,
							jq : r
						});
					}
				}
			}
			if (aa.length && window.easyloader) {
				var _4 = [];
				for (var i = 0; i < aa.length; i++) {
					_4.push(aa[i].name);
				}
				easyloader.load(_4, function () {
					for (var i = 0; i < aa.length; i++) {
						var _5 = aa[i].name;
						var jq = aa[i].jq;
						jq[_5]();
					}
					$.parser.onComplete.call($.parser, _2);
				});
			} else {
				$.parser.onComplete.call($.parser, _2);
			}
		}
	};
	$(function () {
		if (!window.easyloader && $.parser.auto) {
			$.parser.parse();
		}
	});
})(jQuery);

(function ($) {
	var _1 = false;
	$.fn.resizable = function (_2, _3) {
		if (typeof _2 == "string") {
			return $.fn.resizable.methods[_2](this, _3);
		}
		function _4(e) {
			var _5 = e.data;
			var _6 = $.data(_5.target, "resizable").options;
			if (_5.dir.indexOf("e") != -1) {
				var _7 = _5.startWidth + e.pageX - _5.startX;
				_7 = Math.min(Math.max(_7, _6.minWidth), _6.maxWidth);
				_5.width = _7;
			}
			if (_5.dir.indexOf("s") != -1) {
				var _8 = _5.startHeight + e.pageY - _5.startY;
				_8 = Math.min(Math.max(_8, _6.minHeight), _6.maxHeight);
				_5.height = _8;
			}
			if (_5.dir.indexOf("w") != -1) {
				_5.width = _5.startWidth - e.pageX + _5.startX;
				if (_5.width >= _6.minWidth && _5.width <= _6.maxWidth) {
					_5.left = _5.startLeft + e.pageX - _5.startX;
				}
			}
			if (_5.dir.indexOf("n") != -1) {
				_5.height = _5.startHeight - e.pageY + _5.startY;
				if (_5.height >= _6.minHeight && _5.height <= _6.maxHeight) {
					_5.top = _5.startTop + e.pageY - _5.startY;
				}
			}
		};
		function _9(e) {
			var _a = e.data;
			var _b = _a.target;
			if ($.boxModel == true) {
				$(_b).css({
					width : _a.width - _a.deltaWidth,
					height : _a.height - _a.deltaHeight,
					left : _a.left,
					top : _a.top
				});
			} else {
				$(_b).css({
					width : _a.width,
					height : _a.height,
					left : _a.left,
					top : _a.top
				});
			}
		};
		function _c(e) {
			_1 = true;
			$.data(e.data.target, "resizable").options.onStartResize.call(e.data.target, e);
			return false;
		};
		function _d(e) {
			_4(e);
			if ($.data(e.data.target, "resizable").options.onResize.call(e.data.target, e) != false) {
				_9(e);
			}
			return false;
		};
		function _e(e) {
			_1 = false;
			_4(e, true);
			_9(e);
			$.data(e.data.target, "resizable").options.onStopResize.call(e.data.target, e);
			$(document).unbind(".resizable");
			$("body").css("cursor", "auto");
			return false;
		};
		return this.each(function () {
			var _f = null;
			var _10 = $.data(this, "resizable");
			if (_10) {
				$(this).unbind(".resizable");
				_f = $.extend(_10.options, _2 || {});
			} else {
				_f = $.extend({}, $.fn.resizable.defaults, _2 || {});
				$.data(this, "resizable", {
					options : _f
				});
			}
			if (_f.disabled == true) {
				return;
			}
			$(this).bind("mousemove.resizable", {
				target : this
			}, function (e) {
				if (_1) {
					return;
				}
				var dir = _11(e);
				if (dir == "") {
					$(e.data.target).css("cursor", "");
				} else {
					$(e.data.target).css("cursor", dir + "-resize");
				}
			}).bind("mousedown.resizable", {
				target : this
			}, function (e) {
				var dir = _11(e);
				if (dir == "") {
					return;
				}
				function _12(css) {
					var val = parseInt($(e.data.target).css(css));
					if (isNaN(val)) {
						return 0;
					} else {
						return val;
					}
				};
				var _13 = {
					target : e.data.target,
					dir : dir,
					startLeft : _12("left"),
					startTop : _12("top"),
					left : _12("left"),
					top : _12("top"),
					startX : e.pageX,
					startY : e.pageY,
					startWidth : $(e.data.target).outerWidth(),
					startHeight : $(e.data.target).outerHeight(),
					width : $(e.data.target).outerWidth(),
					height : $(e.data.target).outerHeight(),
					deltaWidth : $(e.data.target).outerWidth() - $(e.data.target).width(),
					deltaHeight : $(e.data.target).outerHeight() - $(e.data.target).height()
				};
				$(document).bind("mousedown.resizable", _13, _c);
				$(document).bind("mousemove.resizable", _13, _d);
				$(document).bind("mouseup.resizable", _13, _e);
				$("body").css("cursor", dir + "-resize");
			}).bind("mouseleave.resizable", {
				target : this
			}, function (e) {
				$(e.data.target).css("cursor", "");
			});
			function _11(e) {
				var tt = $(e.data.target);
				var dir = "";
				var _14 = tt.offset();
				var _15 = tt.outerWidth();
				var _16 = tt.outerHeight();
				var _17 = _f.edge;
				if (e.pageY > _14.top && e.pageY < _14.top + _17) {
					dir += "n";
				} else {
					if (e.pageY < _14.top + _16 && e.pageY > _14.top + _16 - _17) {
						dir += "s";
					}
				}
				if (e.pageX > _14.left && e.pageX < _14.left + _17) {
					dir += "w";
				} else {
					if (e.pageX < _14.left + _15 && e.pageX > _14.left + _15 - _17) {
						dir += "e";
					}
				}
				var _18 = _f.handles.split(",");
				for (var i = 0; i < _18.length; i++) {
					var _19 = _18[i].replace(/(^\s*)|(\s*$)/g, "");
					if (_19 == "all" || _19 == dir) {
						return dir;
					}
				}
				return "";
			};
		});
	};
	$.fn.resizable.methods = {
		options : function (jq) {
			return $.data(jq[0], "resizable").options;
		},
		enable : function (jq) {
			return jq.each(function () {
				$(this).resizable({
					disabled : false
				});
			});
		},
		disable : function (jq) {
			return jq.each(function () {
				$(this).resizable({
					disabled : true
				});
			});
		}
	};
	$.fn.resizable.defaults = {
		disabled : false,
		handles : "n, e, s, w, ne, se, sw, nw, all",
		minWidth : 10,
		minHeight : 10,
		maxWidth : 10000,
		maxHeight : 10000,
		edge : 5,
		onStartResize : function (e) {},
		onResize : function (e) {},
		onStopResize : function (e) {}

	};
})(jQuery);

(function ($) {
	function _1(_2) {
		_2.each(function () {
			$(this).remove();
			if ($.browser.msie) {
				this.outerHTML = "";
			}
		});
	};
	function _3(_4, _5) {
		var _6 = $.data(_4, "panel").options;
		var _7 = $.data(_4, "panel").panel;
		var _8 = _7.children("div.panel-header");
		var _9 = _7.children("div.panel-body");
		if (_5) {
			if (_5.width) {
				_6.width = _5.width;
			}
			if (_5.height) {
				_6.height = _5.height;
			}
			if (_5.left != null) {
				_6.left = _5.left;
			}
			if (_5.top != null) {
				_6.top = _5.top;
			}
		}
		if (_6.fit == true) {
			var p = _7.parent();
			_6.width = p.width();
			_6.height = p.height();
		}
		_7.css({
			left : _6.left,
			top : _6.top
		});
		if (!isNaN(_6.width)) {
			if ($.boxModel == true) {
				_7.width(_6.width - (_7.outerWidth() - _7.width()));
			} else {
				_7.width(_6.width);
			}
		} else {
			_7.width("auto");
		}
		if ($.boxModel == true) {
			_8.width(_7.width() - (_8.outerWidth() - _8.width()));
			_9.width(_7.width() - (_9.outerWidth() - _9.width()));
		} else {
			_8.width(_7.width());
			_9.width(_7.width());
		}
		if (!isNaN(_6.height)) {
			if ($.boxModel == true) {
				_7.height(_6.height - (_7.outerHeight() - _7.height()));
				_9.height(_7.height() - _8.outerHeight() - (_9.outerHeight() - _9.height()));
			} else {
				_7.height(_6.height);
				_9.height(_7.height() - _8.outerHeight());
			}
		} else {
			_9.height("auto");
		}
		_7.css("height", "");
		_6.onResize.apply(_4, [_6.width, _6.height]);
		_7.find(">div.panel-body>div").triggerHandler("_resize");
	};
	function _a(_b, _c) {
		var _d = $.data(_b, "panel").options;
		var _e = $.data(_b, "panel").panel;
		if (_c) {
			if (_c.left != null) {
				_d.left = _c.left;
			}
			if (_c.top != null) {
				_d.top = _c.top;
			}
		}
		_e.css({
			left : _d.left,
			top : _d.top
		});
		_d.onMove.apply(_b, [_d.left, _d.top]);
	};
	function _f(_10) {
		var _11 = $(_10).addClass("panel-body").wrap("<div class=\"panel\"></div>").parent();
		_11.bind("_resize", function () {
			var _12 = $.data(_10, "panel").options;
			if (_12.fit == true) {
				_3(_10);
			}
			return false;
		});
		return _11;
	};
	function _13(_14) {
		var _15 = $.data(_14, "panel").options;
		var _16 = $.data(_14, "panel").panel;
		if (_15.tools && typeof _15.tools == "string") {
			_16.find(">div.panel-header>div.panel-tool .panel-tool-a").appendTo(_15.tools);
		}
		_1(_16.children("div.panel-header"));
		if (_15.title && !_15.noheader) {
			var _17 = $("<div class=\"panel-header\" style=\"display:none; \"><div class=\"panel-title\">" + _15.title + "</div></div>").prependTo(_16);
			if (_15.iconCls) {
				_17.find(".panel-title").addClass("panel-with-icon");
				$("<div class=\"panel-icon\"></div>").addClass(_15.iconCls).appendTo(_17);
			}
			var _18 = $("<div class=\"panel-tool\"></div>").appendTo(_17);
			if (_15.tools) {
				if (typeof _15.tools == "string") {
					$(_15.tools).children().each(function () {
						$(this).addClass($(this).attr("iconCls")).addClass("panel-tool-a").appendTo(_18);
					});
				} else {
					for (var i = 0; i < _15.tools.length; i++) {
						var t = $("<a href=\"javascript:void(0)\"></a>").addClass(_15.tools[i].iconCls).appendTo(_18);
						if (_15.tools[i].handler) {
							t.bind("click", eval(_15.tools[i].handler));
						}
					}
				}
			}
			if (_15.collapsible) {
				$("<a class=\"panel-tool-collapse\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click", function () {
					if (_15.collapsed == true) {
						_37(_14, true);
					} else {
						_27(_14, true);
					}
					return false;
				});
			}
			if (_15.minimizable) {
				$("<a class=\"panel-tool-min\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click", function () {
					_42(_14);
					return false;
				});
			}
			if (_15.maximizable) {
				$("<a class=\"panel-tool-max\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click", function () {
					if (_15.maximized == true) {
						_46(_14);
					} else {
						_26(_14);
					}
					return false;
				});
			}
			if (_15.closable) {
				$("<a class=\"panel-tool-close\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click", function () {
					_19(_14);
					return false;
				});
			}
			_16.children("div.panel-body").removeClass("panel-body-noheader");
		} else {
			_16.children("div.panel-body").addClass("panel-body-noheader");
		}
	};
	function _1a(_1b) {
		var _1c = $.data(_1b, "panel");
		if (_1c.options.href && (!_1c.isLoaded || !_1c.options.cache)) {
			_1c.isLoaded = false;
			var _1d = _1c.panel.find(">div.panel-body");
			if (_1c.options.loadingMessage) {
				_1d.html($("<div class=\"panel-loading\"></div>").html(_1c.options.loadingMessage));
			}
			$.ajax({
				url : _1c.options.href,
				cache : false,
				success : function (_1e) {
					_1d.html(_1c.options.extractor.call(_1b, _1e));
					if ($.parser) {
						$.parser.parse(_1d);
					}
					_1c.options.onLoad.apply(_1b, arguments);
					_1c.isLoaded = true;
				}
			});
		}
	};
	function _1f(_20) {
		$(_20).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible").each(function () {
			$(this).triggerHandler("_resize", [true]);
		});
	};
	function _21(_22, _23) {
		var _24 = $.data(_22, "panel").options;
		var _25 = $.data(_22, "panel").panel;
		if (_23 != true) {
			if (_24.onBeforeOpen.call(_22) == false) {
				return;
			}
		}
		_25.show();
		_24.closed = false;
		_24.minimized = false;
		_24.onOpen.call(_22);
		if (_24.maximized == true) {
			_24.maximized = false;
			_26(_22);
		}
		if (_24.collapsed == true) {
			_24.collapsed = false;
			_27(_22);
		}
		if (!_24.collapsed) {
			_1a(_22);
			_1f(_22);
		}
	};
	function _19(_28, _29) {
		var _2a = $.data(_28, "panel").options;
		var _2b = $.data(_28, "panel").panel;
		if (_29 != true) {
			if (_2a.onBeforeClose.call(_28) == false) {
				return;
			}
		}
		_2b.hide();
		_2a.closed = true;
		_2a.onClose.call(_28);
	};
	function _2c(_2d, _2e) {
		var _2f = $.data(_2d, "panel").options;
		var _30 = $.data(_2d, "panel").panel;
		if (_2e != true) {
			if (_2f.onBeforeDestroy.call(_2d) == false) {
				return;
			}
		}
		_1(_30);
		_2f.onDestroy.call(_2d);
	};
	function _27(_31, _32) {
		var _33 = $.data(_31, "panel").options;
		var _34 = $.data(_31, "panel").panel;
		var _35 = _34.children("div.panel-body");
		var _36 = _34.children("div.panel-header").find("a.panel-tool-collapse");
		if (_33.collapsed == true) {
			return;
		}
		_35.stop(true, true);
		if (_33.onBeforeCollapse.call(_31) == false) {
			return;
		}
		_36.addClass("panel-tool-expand");
		if (_32 == true) {
			_35.slideUp("normal", function () {
				_33.collapsed = true;
				_33.onCollapse.call(_31);
			});
		} else {
			_35.hide();
			_33.collapsed = true;
			_33.onCollapse.call(_31);
		}
	};
	function _37(_38, _39) {
		var _3a = $.data(_38, "panel").options;
		var _3b = $.data(_38, "panel").panel;
		var _3c = _3b.children("div.panel-body");
		var _3d = _3b.children("div.panel-header").find("a.panel-tool-collapse");
		if (_3a.collapsed == false) {
			return;
		}
		_3c.stop(true, true);
		if (_3a.onBeforeExpand.call(_38) == false) {
			return;
		}
		_3d.removeClass("panel-tool-expand");
		if (_39 == true) {
			_3c.slideDown("normal", function () {
				_3a.collapsed = false;
				_3a.onExpand.call(_38);
				_1a(_38);
				_1f(_38);
			});
		} else {
			_3c.show();
			_3a.collapsed = false;
			_3a.onExpand.call(_38);
			_1a(_38);
			_1f(_38);
		}
	};
	function _26(_3e) {
		var _3f = $.data(_3e, "panel").options;
		var _40 = $.data(_3e, "panel").panel;
		var _41 = _40.children("div.panel-header").find("a.panel-tool-max");
		if (_3f.maximized == true) {
			return;
		}
		_41.addClass("panel-tool-restore");
		if (!$.data(_3e, "panel").original) {
			$.data(_3e, "panel").original = {
				width : _3f.width,
				height : _3f.height,
				left : _3f.left,
				top : _3f.top,
				fit : _3f.fit
			};
		}
		_3f.left = 0;
		_3f.top = 0;
		_3f.fit = true;
		_3(_3e);
		_3f.minimized = false;
		_3f.maximized = true;
		_3f.onMaximize.call(_3e);
	};
	function _42(_43) {
		var _44 = $.data(_43, "panel").options;
		var _45 = $.data(_43, "panel").panel;
		_45.hide();
		_44.minimized = true;
		_44.maximized = false;
		_44.onMinimize.call(_43);
	};
	function _46(_47) {
		var _48 = $.data(_47, "panel").options;
		var _49 = $.data(_47, "panel").panel;
		var _4a = _49.children("div.panel-header").find("a.panel-tool-max");
		if (_48.maximized == false) {
			return;
		}
		_49.show();
		_4a.removeClass("panel-tool-restore");
		var _4b = $.data(_47, "panel").original;
		_48.width = _4b.width;
		_48.height = _4b.height;
		_48.left = _4b.left;
		_48.top = _4b.top;
		_48.fit = _4b.fit;
		_3(_47);
		_48.minimized = false;
		_48.maximized = false;
		$.data(_47, "panel").original = null;
		_48.onRestore.call(_47);
	};
	function _4c(_4d) {
		var _4e = $.data(_4d, "panel").options;
		var _4f = $.data(_4d, "panel").panel;
		if (_4e.border == true) {
			_4f.children("div.panel-header").removeClass("panel-header-noborder");
			_4f.children("div.panel-body").removeClass("panel-body-noborder");
		} else {
			_4f.children("div.panel-header").addClass("panel-header-noborder");
			_4f.children("div.panel-body").addClass("panel-body-noborder");
		}
		_4f.css(_4e.style);
		_4f.addClass(_4e.cls);
		_4f.children("div.panel-header").addClass(_4e.headerCls);
		_4f.children("div.panel-body").addClass(_4e.bodyCls);
	};
	function _50(_51, _52) {
		$.data(_51, "panel").options.title = _52;
		$(_51).panel("header").find("div.panel-title").html(_52);
	};
	var TO = false;
	var _53 = true;
	$(window).unbind(".panel").bind("resize.panel", function () {
		if (!_53) {
			return;
		}
		if (TO !== false) {
			clearTimeout(TO);
		}
		TO = setTimeout(function () {
				_53 = false;
				var _54 = $("body.layout");
				if (_54.length) {
					_54.layout("resize");
				} else {
					$("body").children("div.panel,div.accordion,div.tabs-container,div.layout").triggerHandler("_resize", [true]);  //添加.triggerHandler("_resize", [true])解决窗口resize自适应问题thinking
				}
				_53 = true;
				TO = false;
			}, 100);
	});
	$.fn.panel = function (_55, _56) {
		if (typeof _55 == "string") {
			return $.fn.panel.methods[_55](this, _56);
		}
		_55 = _55 || {};
		return this.each(function () {
			var _57 = $.data(this, "panel");
			var _58;
			if (_57) {
				_58 = $.extend(_57.options, _55);
			} else {
				_58 = $.extend({}, $.fn.panel.defaults, $.fn.panel.parseOptions(this), _55);
				$(this).attr("title", "");
				_57 = $.data(this, "panel", {
						options : _58,
						panel : _f(this),
						isLoaded : false
					});
			}
			if (_58.content) {
				$(this).html(_58.content);
				if ($.parser) {
					$.parser.parse(this);
				}
			}
			_13(this);
			_4c(this);
			if (_58.doSize == true) {
				_57.panel.css("display", "block");
				_3(this);
			}
			if (_58.closed == true || _58.minimized == true) {
				_57.panel.hide();
			} else {
				_21(this);
			}
		});
	};
	$.fn.panel.methods = {
		options : function (jq) {
			return $.data(jq[0], "panel").options;
		},
		panel : function (jq) {
			return $.data(jq[0], "panel").panel;
		},
		header : function (jq) {
			return $.data(jq[0], "panel").panel.find(">div.panel-header");
		},
		body : function (jq) {
			return $.data(jq[0], "panel").panel.find(">div.panel-body");
		},
		setTitle : function (jq, _59) {
			return jq.each(function () {
				_50(this, _59);
			});
		},
		open : function (jq, _5a) {
			return jq.each(function () {
				_21(this, _5a);
			});
		},
		close : function (jq, _5b) {
			return jq.each(function () {
				_19(this, _5b);
			});
		},
		destroy : function (jq, _5c) {
			return jq.each(function () {
				_2c(this, _5c);
			});
		},
		refresh : function (jq, _5d) {
			return jq.each(function () {
				$.data(this, "panel").isLoaded = false;
				if (_5d) {
					$.data(this, "panel").options.href = _5d;
				}
				_1a(this);
			});
		},
		resize : function (jq, _5e) {
			return jq.each(function () {
				_3(this, _5e);
			});
		},
		move : function (jq, _5f) {
			return jq.each(function () {
				_a(this, _5f);
			});
		},
		maximize : function (jq) {
			return jq.each(function () {
				_26(this);
			});
		},
		minimize : function (jq) {
			return jq.each(function () {
				_42(this);
			});
		},
		restore : function (jq) {
			return jq.each(function () {
				_46(this);
			});
		},
		collapse : function (jq, _60) {
			return jq.each(function () {
				_27(this, _60);
			});
		},
		expand : function (jq, _61) {
			return jq.each(function () {
				_37(this, _61);
			});
		}
	};
	$.fn.panel.parseOptions = function (_62) {
		var t = $(_62);
		return {
			width : (parseInt(_62.style.width) || undefined),
			height : (parseInt(_62.style.height) || undefined),
			left : (parseInt(_62.style.left) || undefined),
			top : (parseInt(_62.style.top) || undefined),
			title : (t.attr("title") || undefined),
			iconCls : (t.attr("iconCls") || t.attr("icon")),
			cls : t.attr("cls"),
			headerCls : t.attr("headerCls"),
			bodyCls : t.attr("bodyCls"),
			tools : t.attr("tools"),
			href : t.attr("href"),
			loadingMessage : (t.attr("loadingMessage") != undefined ? t.attr("loadingMessage") : undefined),
			cache : (t.attr("cache") ? t.attr("cache") == "true" : undefined),
			fit : (t.attr("fit") ? t.attr("fit") == "true" : undefined),
			border : (t.attr("border") ? t.attr("border") == "true" : undefined),
			noheader : (t.attr("noheader") ? t.attr("noheader") == "true" : undefined),
			collapsible : (t.attr("collapsible") ? t.attr("collapsible") == "true" : undefined),
			minimizable : (t.attr("minimizable") ? t.attr("minimizable") == "true" : undefined),
			maximizable : (t.attr("maximizable") ? t.attr("maximizable") == "true" : undefined),
			closable : (t.attr("closable") ? t.attr("closable") == "true" : undefined),
			collapsed : (t.attr("collapsed") ? t.attr("collapsed") == "true" : undefined),
			minimized : (t.attr("minimized") ? t.attr("minimized") == "true" : undefined),
			maximized : (t.attr("maximized") ? t.attr("maximized") == "true" : undefined),
			closed : (t.attr("closed") ? t.attr("closed") == "true" : undefined)
		};
	};
	$.fn.panel.defaults = {
		title : null,
		iconCls : null,
		width : "auto",
		height : "auto",
		left : null,
		top : null,
		cls : null,
		headerCls : null,
		bodyCls : null,
		style : {},
		href : null,
		cache : true,
		fit : false,
		border : true,
		doSize : true,
		noheader : false,
		content : null,
		collapsible : false,
		minimizable : false,
		maximizable : false,
		closable : false,
		collapsed : false,
		minimized : false,
		maximized : false,
		closed : false,
		tools : null,
		href : null,
		loadingMessage : "Loading...",
		extractor : function (_63) {
			var _64 = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
			var _65 = _64.exec(_63);
			if (_65) {
				return _65[1];
			} else {
				return _63;
			}
		},
		onLoad : function () {},
		onBeforeOpen : function () {},
		onOpen : function () {},
		onBeforeClose : function () {},
		onClose : function () {},
		onBeforeDestroy : function () {},
		onDestroy : function () {},
		onResize : function (_66, _67) {},
		onMove : function (_68, top) {},
		onMaximize : function () {},
		onRestore : function () {},
		onMinimize : function () {},
		onBeforeCollapse : function () {},
		onBeforeExpand : function () {},
		onCollapse : function () {},
		onExpand : function () {}

	};
})(jQuery);

(function ($) {
	function _1(_2) {
		var _3 = $.data(_2, "linkbutton").options;
		$(_2).empty();
		$(_2).addClass("l-btn");
		if (_3.id) {
			$(_2).attr("id", _3.id);
		} else {
			$.fn.removeProp ? $(_2).removeProp("id") : $(_2).removeAttr("id");
		}
		if (_3.plain) {
			$(_2).addClass("l-btn-plain");
		} else {
			$(_2).removeClass("l-btn-plain");
		}
		if (_3.text) {
			$(_2).html(_3.text).wrapInner("<span class=\"l-btn-left\">" + "<span class=\"l-btn-text\">" + "</span>" + "</span>");
			if (_3.iconCls) {
				$(_2).find(".l-btn-text").addClass(_3.iconCls).css("padding-left", "20px");
			}
		} else {
			$(_2).html("&nbsp;").wrapInner("<span class=\"l-btn-left\">" + "<span class=\"l-btn-text\">" + "<span class=\"l-btn-empty\"></span>" + "</span>" + "</span>");
			if (_3.iconCls) {
				$(_2).find(".l-btn-empty").addClass(_3.iconCls);
			}
		}
		$(_2).unbind(".linkbutton").bind("focus.linkbutton", function () {
			if (!_3.disabled) {
				$(this).find("span.l-btn-text").addClass("l-btn-focus");
			}
		}).bind("blur.linkbutton", function () {
			$(this).find("span.l-btn-text").removeClass("l-btn-focus");
		});
		_4(_2, _3.disabled);
	};
	function _4(_5, _6) {
		var _7 = $.data(_5, "linkbutton");
		if (_6) {
			_7.options.disabled = true;
			var _8 = $(_5).attr("href");
			if (_8) {
				_7.href = _8;
				$(_5).attr("href", "javascript:void(0)");
			}
			if (_5.onclick) {
				_7.onclick = _5.onclick;
				_5.onclick = null;
			}
			$(_5).addClass("l-btn-disabled");
		} else {
			_7.options.disabled = false;
			if (_7.href) {
				$(_5).attr("href", _7.href);
			}
			if (_7.onclick) {
				_5.onclick = _7.onclick;
			}
			$(_5).removeClass("l-btn-disabled");
		}
	};
	$.fn.linkbutton = function (_9, _a) {
		if (typeof _9 == "string") {
			return $.fn.linkbutton.methods[_9](this, _a);
		}
		_9 = _9 || {};
		return this.each(function () {
			var _b = $.data(this, "linkbutton");
			if (_b) {
				$.extend(_b.options, _9);
			} else {
				$.data(this, "linkbutton", {
					options : $.extend({}, $.fn.linkbutton.defaults, $.fn.linkbutton.parseOptions(this), _9)
				});
				$(this).removeAttr("disabled");
			}
			_1(this);
		});
	};
	$.fn.linkbutton.methods = {
		options : function (jq) {
			return $.data(jq[0], "linkbutton").options;
		},
		enable : function (jq) {
			return jq.each(function () {
				_4(this, false);
			});
		},
		disable : function (jq) {
			return jq.each(function () {
				_4(this, true);
			});
		}
	};
	$.fn.linkbutton.parseOptions = function (_c) {
		var t = $(_c);
		return {
			id : t.attr("id"),
			disabled : (t.attr("disabled") ? true : undefined),
			plain : (t.attr("plain") ? t.attr("plain") == "true" : undefined),
			text : $.trim(t.html()),
			iconCls : (t.attr("icon") || t.attr("iconCls"))
		};
	};
	$.fn.linkbutton.defaults = {
		id : null,
		disabled : false,
		plain : false,
		text : "",
		iconCls : null
	};
})(jQuery);

(function ($) {
	function _1(_2) {
		var _3 = $(_2).children("div.tabs-header");
		var _4 = 0;
		$("ul.tabs li", _3).each(function () {
			_4 += $(this).outerWidth(true);
		});
		var _5 = _3.children("div.tabs-wrap").width();
		var _6 = parseInt(_3.find("ul.tabs").css("padding-left"));
		return _4 - _5 + _6;
	};
	function _7(_8) {
		var _9 = $.data(_8, "tabs").options;
		var _a = $(_8).children("div.tabs-header");
		var _b = _a.children("div.tabs-tool");
		var _c = _a.children("div.tabs-scroller-left");
		var _d = _a.children("div.tabs-scroller-right");
		var _e = _a.children("div.tabs-wrap");
		var _f = ($.boxModel == true ? (_a.outerHeight() - (_b.outerHeight() - _b.height())) : _a.outerHeight());
		if (_9.plain) {
			_f -= 2;
		}
		_b.height(_f);
		var _10 = 0;
		$("ul.tabs li", _a).each(function () {
			_10 += $(this).outerWidth(true);
		});
		var _11 = _a.width() - _b.outerWidth();
		if (_10 > _11) {
			_c.show();
			_d.show();
			_b.css("right", _d.outerWidth());
			_e.css({
				marginLeft : _c.outerWidth(),
				marginRight : _d.outerWidth() + _b.outerWidth(),
				left : 0,
				width : _11 - _c.outerWidth() - _d.outerWidth()
			});
		} else {
			_c.hide();
			_d.hide();
			_b.css("right", 0);
			_e.css({
				marginLeft : 0,
				marginRight : _b.outerWidth(),
				left : 0,
				width : _11
			});
			_e.scrollLeft(0);
		}
	};
	function _12(_13) {
		var _14 = $.data(_13, "tabs").options;
		var _15 = $(_13).children("div.tabs-header");
		if (_14.tools) {
			if (typeof _14.tools == "string") {
				$(_14.tools).addClass("tabs-tool").appendTo(_15);
				$(_14.tools).show();
			} else {
				_15.children("div.tabs-tool").remove();
				var _16 = $("<div class=\"tabs-tool\"></div>").appendTo(_15);
				for (var i = 0; i < _14.tools.length; i++) {
					var _17 = $("<a href=\"javascript:void(0);\"></a>").appendTo(_16);
					_17[0].onclick = eval(_14.tools[i].handler || function () {});
					_17.linkbutton($.extend({}, _14.tools[i], {
							plain : true
						}));
				}
			}
		} else {
			_15.children("div.tabs-tool").remove();
		}
	};
	function _18(_19) {
		var _1a = $.data(_19, "tabs").options;
		var cc = $(_19);
		if (_1a.fit == true) {
			var p = cc.parent();
			_1a.width = p.width();
			_1a.height = p.height();
		}
		cc.width(_1a.width).height(_1a.height);
		var _1b = $(_19).children("div.tabs-header");
		if ($.boxModel == true) {
			_1b.width(_1a.width - (_1b.outerWidth() - _1b.width()));
		} else {
			_1b.width(_1a.width);
		}
		_7(_19);
		var _1c = $(_19).children("div.tabs-panels");
		var _1d = _1a.height;
		if (!isNaN(_1d)) {
			if ($.boxModel == true) {
				var _1e = _1c.outerHeight() - _1c.height();
				_1c.css("height", (_1d - _1b.outerHeight() - _1e) || "auto");
			} else {
				_1c.css("height", _1d - _1b.outerHeight());
			}
		} else {
			_1c.height("auto");
		}
		var _1f = _1a.width;
		if (!isNaN(_1f)) {
			if ($.boxModel == true) {
				_1c.width(_1f - (_1c.outerWidth() - _1c.width()));
			} else {
				_1c.width(_1f);
			}
		} else {
			_1c.width("auto");
		}
	};
	function _20(_21) {
		var _22 = $.data(_21, "tabs").options;
		var tab = _23(_21);
		if (tab) {
			var _24 = $(_21).children("div.tabs-panels");
			var _25 = _22.width == "auto" ? "auto" : _24.width();
			var _26 = _22.height == "auto" ? "auto" : _24.height();
			tab.panel("resize", {
				width : _25,
				height : _26
			});
		}
	};
	function _27(_28) {
		var cc = $(_28);
		cc.addClass("tabs-container");
		cc.wrapInner("<div class=\"tabs-panels\"/>");
		$("<div class=\"tabs-header\">" + "<div class=\"tabs-scroller-left\"></div>" + "<div class=\"tabs-scroller-right\"></div>" + "<div class=\"tabs-wrap\">" + "<ul class=\"tabs\"></ul>" + "</div>" + "</div>").prependTo(_28);
		var _29 = [];
		var tp = cc.children("div.tabs-panels");
		tp.children("div[selected]").attr("toselect", "true");
		tp.children("div").each(function () {
			var pp = $(this);
			_29.push(pp);
			_37(_28, pp);
		});
		cc.children("div.tabs-header").find(".tabs-scroller-left, .tabs-scroller-right").hover(function () {
			$(this).addClass("tabs-scroller-over");
		}, function () {
			$(this).removeClass("tabs-scroller-over");
		});
		cc.bind("_resize", function (e, _2a) {
			var _2b = $.data(_28, "tabs").options;
			if (_2b.fit == true || _2a) {
				_18(_28);
				_20(_28);
			}
			return false;
		});
		return _29;
	};
	function _2c(_2d) {
		var _2e = $.data(_2d, "tabs").options;
		var _2f = $(_2d).children("div.tabs-header");
		var _30 = $(_2d).children("div.tabs-panels");
		if (_2e.plain == true) {
			_2f.addClass("tabs-header-plain");
		} else {
			_2f.removeClass("tabs-header-plain");
		}
		if (_2e.border == true) {
			_2f.removeClass("tabs-header-noborder");

			_30.removeClass("tabs-panels-noborder");
		} else {
			_2f.addClass("tabs-header-noborder");
			_30.addClass("tabs-panels-noborder");
		}
		$(".tabs-scroller-left", _2f).unbind(".tabs").bind("click.tabs", function () {
			var _31 = $(".tabs-wrap", _2f);
			var pos = _31.scrollLeft() - _2e.scrollIncrement;
			_31.animate({
				scrollLeft : pos
			}, _2e.scrollDuration);
		});
		$(".tabs-scroller-right", _2f).unbind(".tabs").bind("click.tabs", function () {
			var _32 = $(".tabs-wrap", _2f);
			var pos = Math.min(_32.scrollLeft() + _2e.scrollIncrement, _1(_2d));
			_32.animate({
				scrollLeft : pos
			}, _2e.scrollDuration);
		});
		var _33 = $.data(_2d, "tabs").tabs;
		for (var i = 0, len = _33.length; i < len; i++) {
			var _34 = _33[i];
			var tab = _34.panel("options").tab;
			tab.unbind(".tabs").bind("click.tabs", {
				p : _34
			}, function (e) {
				_46(_2d, _36(_2d, e.data.p));
			}).bind("contextmenu.tabs", {
				p : _34
			}, function (e) {
				_2e.onContextMenu.call(_2d, e, e.data.p.panel("options").title);
			});
			tab.find("a.tabs-close").unbind(".tabs").bind("click.tabs", {
				p : _34
			}, function (e) {
				_35(_2d, _36(_2d, e.data.p));
				return false;
			});
		}
	};
	function _37(_38, pp, _39) {
		_39 = _39 || {};
		pp.panel($.extend({}, _39, {
				border : false,
				noheader : true,
				closed : true,
				doSize : false,
				iconCls : (_39.icon ? _39.icon : undefined),
				onLoad : function () {
					if (_39.onLoad) {
						_39.onLoad.call(this, arguments);
					}
					$.data(_38, "tabs").options.onLoad.call(_38, pp);
				}
			}));
		var _3a = pp.panel("options");
		var _3b = $(_38).children("div.tabs-header");
		var _3c = $("ul.tabs", _3b);
		var tab = $("<li></li>").appendTo(_3c);
		var _3d = $("<a href=\"javascript:void(0)\" class=\"tabs-inner\"></a>").appendTo(tab);
		var _3e = $("<span title='" + _3a.title + "'class=\"tabs-title\"></span>").html(_3a.title).appendTo(_3d);
		var _3f = $("<span class=\"tabs-icon\"></span>").appendTo(_3d);
		if (_3a.closable) {
			_3e.addClass("tabs-closable");
			$("<a href=\"javascript:void(0)\" class=\"tabs-close\"></a>").appendTo(tab);
		}
		if (_3a.iconCls) {
			_3e.addClass("tabs-with-icon");
			_3f.addClass(_3a.iconCls);
		}
		if (_3a.tools) {
			var _40 = $("<span class=\"tabs-p-tool\"></span>").insertAfter(_3d);
			if (typeof _3a.tools == "string") {
				$(_3a.tools).children().appendTo(_40);
			} else {
				for (var i = 0; i < _3a.tools.length; i++) {
					var t = $("<a href=\"javascript:void(0)\"></a>").appendTo(_40);
					t.addClass(_3a.tools[i].iconCls);
					if (_3a.tools[i].handler) {
						t.bind("click", eval(_3a.tools[i].handler));
					}
				}
			}
			var pr = _40.children().length * 12;
			if (_3a.closable) {
				pr += 8;
			} else {
				pr -= 3;
				_40.css("right", "5px");
			}
			_3e.css("padding-right", pr + "px");
		}
		_3a.tab = tab;
	};
	function _41(_42, _43) {
		var _44 = $.data(_42, "tabs").options;
		var _45 = $.data(_42, "tabs").tabs;
		var pp = $("<div></div>").appendTo($(_42).children("div.tabs-panels"));
		_45.push(pp);
		_37(_42, pp, _43);
		_44.onAdd.call(_42, _43.title);
		_7(_42);
		_2c(_42);
		_46(_42, _45.length - 1);
	};
	function _47(_48, _49) {
		var _4a = $.data(_48, "tabs").selectHis;
		var pp = _49.tab;
		var _4b = pp.panel("options").title;
		pp.panel($.extend({}, _49.options, {
				iconCls : (_49.options.icon ? _49.options.icon : undefined)
			}));
		var _4c = pp.panel("options");
		var tab = _4c.tab;
		tab.find("span.tabs-icon").attr("class", "tabs-icon");
		tab.find("a.tabs-close").remove();
		tab.find("span.tabs-title").html(_4c.title);
		if (_4c.closable) {
			tab.find("span.tabs-title").addClass("tabs-closable");
			$("<a href=\"javascript:void(0)\" class=\"tabs-close\"></a>").appendTo(tab);
		} else {
			tab.find("span.tabs-title").removeClass("tabs-closable");
		}
		if (_4c.iconCls) {
			tab.find("span.tabs-title").addClass("tabs-with-icon");
			tab.find("span.tabs-icon").addClass(_4c.iconCls);
		} else {
			tab.find("span.tabs-title").removeClass("tabs-with-icon");
		}
		if (_4b != _4c.title) {
			for (var i = 0; i < _4a.length; i++) {
				if (_4a[i] == _4b) {
					_4a[i] = _4c.title;
				}
			}
		}
		_2c(_48);
		$.data(_48, "tabs").options.onUpdate.call(_48, _4c.title);
	};
	function _35(_4d, _4e) {
		var _4f = $.data(_4d, "tabs").options;
		var _50 = $.data(_4d, "tabs").tabs;
		var _51 = $.data(_4d, "tabs").selectHis;
		if (!_52(_4d, _4e)) {
			return;
		}
		var tab = _53(_4d, _4e);
		var _54 = tab.panel("options").title;
		if (_4f.onBeforeClose.call(_4d, _54) == false) {
			return;
		}
		var tab = _53(_4d, _4e, true);
		tab.panel("options").tab.remove();
		tab.panel("destroy");
		_4f.onClose.call(_4d, _54);
		_7(_4d);
		for (var i = 0; i < _51.length; i++) {
			if (_51[i] == _54) {
				_51.splice(i, 1);
				i--;
			}
		}
		var _55 = _51.pop();
		if (_55) {
			_46(_4d, _55);
		} else {
			if (_50.length) {
				_46(_4d, 0);
			}
		}
	};
	function _53(_56, _57, _58) {
		var _59 = $.data(_56, "tabs").tabs;
		if (typeof _57 == "number") {
			if (_57 < 0 || _57 >= _59.length) {
				return null;
			} else {
				var tab = _59[_57];
				if (_58) {
					_59.splice(_57, 1);
				}
				return tab;
			}
		}
		for (var i = 0; i < _59.length; i++) {
			var tab = _59[i];
			if (tab.panel("options").title == _57) {
				if (_58) {
					_59.splice(i, 1);
				}
				return tab;
			}
		}
		return null;
	};
	function _36(_5a, tab) {
		var _5b = $.data(_5a, "tabs").tabs;
		for (var i = 0; i < _5b.length; i++) {
			if (_5b[i][0] == $(tab)[0]) {
				return i;
			}
		}
		return -1;
	};
	function _23(_5c) {
		var _5d = $.data(_5c, "tabs").tabs;
		for (var i = 0; i < _5d.length; i++) {
			var tab = _5d[i];
			if (tab.panel("options").closed == false) {
				return tab;
			}
		}
		return null;
	};
	function _5e(_5f) {
		var _60 = $.data(_5f, "tabs").tabs;
		for (var i = 0; i < _60.length; i++) {
			if (_60[i].attr("toselect") == "true") {
				_46(_5f, i);
				return;
			}
		}
		if (_60.length) {
			_46(_5f, 0);
		}
	};
	function _46(_61, _62) {
		var _63 = $.data(_61, "tabs").options;
		var _64 = $.data(_61, "tabs").tabs;
		var _65 = $.data(_61, "tabs").selectHis;
		if (_64.length == 0) {
			return;
		}
		var _66 = _53(_61, _62);
		if (!_66) {
			return;
		}
		var _67 = _23(_61);
		if (_67) {
			_67.panel("close");
			_67.panel("options").tab.removeClass("tabs-selected");
		}
		_66.panel("open");
		var _68 = _66.panel("options").title;
		_65.push(_68);
		var tab = _66.panel("options").tab;
		tab.addClass("tabs-selected");
		var _69 = $(_61).find(">div.tabs-header div.tabs-wrap");
		var _6a = tab.position().left + _69.scrollLeft();
		var _6b = _6a - _69.scrollLeft();
		var _6c = _6b + tab.outerWidth();
		if (_6b < 0 || _6c > _69.innerWidth()) {
			var pos = Math.min(_6a - (_69.width() - tab.width()) / 2, _1(_61));
			_69.animate({
				scrollLeft : pos
			}, _63.scrollDuration);
		} else {
			var pos = Math.min(_69.scrollLeft(), _1(_61));
			_69.animate({
				scrollLeft : pos
			}, _63.scrollDuration);
		}
		_20(_61);
		_63.onSelect.call(_61, _68);
	};
	function _52(_6d, _6e) {
		return _53(_6d, _6e) != null;
	};
	$.fn.tabs = function (_6f, _70) {
		if (typeof _6f == "string") {
			return $.fn.tabs.methods[_6f](this, _70);
		}
		_6f = _6f || {};
		return this.each(function () {
			var _71 = $.data(this, "tabs");
			var _72;
			if (_71) {
				_72 = $.extend(_71.options, _6f);
				_71.options = _72;
			} else {
				$.data(this, "tabs", {
					options : $.extend({}, $.fn.tabs.defaults, $.fn.tabs.parseOptions(this), _6f),
					tabs : _27(this),
					selectHis : []
				});
			}
			_12(this);
			_2c(this);
			_18(this);
			_5e(this);
		});
	};
	$.fn.tabs.methods = {
		options : function (jq) {
			return $.data(jq[0], "tabs").options;
		},
		tabs : function (jq) {
			return $.data(jq[0], "tabs").tabs;
		},
		resize : function (jq) {
			return jq.each(function () {
				_18(this);
				_20(this);
			});
		},
		add : function (jq, _73) {
			return jq.each(function () {
				_41(this, _73);
			});
		},
		close : function (jq, _74) {
			return jq.each(function () {
				_35(this, _74);
			});
		},
		getTab : function (jq, _75) {
			return _53(jq[0], _75);
		},
		getTabIndex : function (jq, tab) {
			return _36(jq[0], tab);
		},
		getSelected : function (jq) {
			return _23(jq[0]);
		},
		select : function (jq, _76) {
			return jq.each(function () {
				_46(this, _76);
			});
		},
		exists : function (jq, _77) {
			return _52(jq[0], _77);
		},
		update : function (jq, _78) {
			return jq.each(function () {
				_47(this, _78);
			});
		}
	};
	$.fn.tabs.parseOptions = function (_79) {
		var t = $(_79);
		return {
			width : (parseInt(_79.style.width) || undefined),
			height : (parseInt(_79.style.height) || undefined),
			fit : (t.attr("fit") ? t.attr("fit") == "true" : undefined),
			border : (t.attr("border") ? t.attr("border") == "true" : undefined),
			plain : (t.attr("plain") ? t.attr("plain") == "true" : undefined),
			tools : t.attr("tools")
		};
	};
	$.fn.tabs.defaults = {
		width : "auto",
		height : "auto",
		plain : false,
		fit : false,
		border : true,
		tools : null,
		scrollIncrement : 100,
		scrollDuration : 400,
		onLoad : function (_7a) {},
		onSelect : function (_7b) {},
		onBeforeClose : function (_7c) {},
		onClose : function (_7d) {},
		onAdd : function (_7e) {},
		onUpdate : function (_7f) {},
		onContextMenu : function (e, _80) {}

	};
})(jQuery);

(function ($) {
	var _1 = false;
	function _2(_3) {
		var _4 = $.data(_3, "layout").options;
		var _5 = $.data(_3, "layout").panels;
		var cc = $(_3);
		if (_4.fit == true) {
			var p = cc.parent();
			cc.width(p.width()).height(p.height());
		}
		var _6 = {
			top : 0,
			left : 0,
			width : cc.width(),
			height : cc.height()
		};
		function _7(pp) {
			if (pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width : cc.width(),
				height : pp.panel("options").height,
				left : 0,
				top : 0
			});
			_6.top += pp.panel("options").height;
			_6.height -= pp.panel("options").height;
		};
		if (_b(_5.expandNorth)) {
			_7(_5.expandNorth);
		} else {
			_7(_5.north);
		}
		function _8(pp) {
			if (pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width : cc.width(),
				height : pp.panel("options").height,
				left : 0,
				top : cc.height() - pp.panel("options").height
			});
			_6.height -= pp.panel("options").height;
		};
		if (_b(_5.expandSouth)) {
			_8(_5.expandSouth);
		} else {
			_8(_5.south);
		}
		function _9(pp) {
			if (pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width : pp.panel("options").width,
				height : _6.height,
				left : cc.width() - pp.panel("options").width,
				top : _6.top
			});
			_6.width -= pp.panel("options").width;
		};
		if (_b(_5.expandEast)) {
			_9(_5.expandEast);
		} else {
			_9(_5.east);
		}
		function _a(pp) {
			if (pp.length == 0) {
				return;
			}
			pp.panel("resize", {
				width : pp.panel("options").width,
				height : _6.height,
				left : 0,
				top : _6.top
			});
			_6.left += pp.panel("options").width;
			_6.width -= pp.panel("options").width;
		};
		if (_b(_5.expandWest)) {
			_a(_5.expandWest);
		} else {
			_a(_5.west);
		}
		_5.center.panel("resize", _6);
	};
	function _c(_d) {
		var cc = $(_d);
		if (cc[0].tagName == "BODY") {
			$("html").css({
				height : "100%",
				overflow : "hidden"
			});
			$("body").css({
				height : "100%",
				overflow : "hidden",
				border : "none"
			});
		}
		cc.addClass("layout");
		cc.css({
			margin : 0,
			padding : 0
		});
		function _e(_f) {
			var pp = $(">div[region=" + _f + "]", _d).addClass("layout-body");
			var _10 = null;
			if (_f == "north") {
				_10 = "layout-button-up";
			} else {
				if (_f == "south") {
					_10 = "layout-button-down";
				} else {
					if (_f == "east") {
						_10 = "layout-button-right";
					} else {
						if (_f == "west") {
							_10 = "layout-button-left";
						}
					}
				}
			}
			var cls = "layout-panel layout-panel-" + _f;
			if (pp.attr("split") == "true") {
				cls += " layout-split-" + _f;
			}
			pp.panel({
				cls : cls,
				doSize : false,
				border : (pp.attr("border") == "false" ? false : true),
				width : (pp.length ? parseInt(pp[0].style.width) || pp.outerWidth() : "auto"),
				height : (pp.length ? parseInt(pp[0].style.height) || pp.outerHeight() : "auto"),
				tools : [{
						iconCls : _10,
						handler : function () {
							_1c(_d, _f);
						}
					}
				]
			});
			if (pp.attr("split") == "true") {
				var _11 = pp.panel("panel");
				var _12 = "";
				if (_f == "north") {
					_12 = "s";
				}
				if (_f == "south") {
					_12 = "n";
				}
				if (_f == "east") {
					_12 = "w";
				}
				if (_f == "west") {
					_12 = "e";
				}
				_11.resizable({
					handles : _12,
					onStartResize : function (e) {
						_1 = true;
						if (_f == "north" || _f == "south") {
							var _13 = $(">div.layout-split-proxy-v", _d);
						} else {
							var _13 = $(">div.layout-split-proxy-h", _d);
						}
						var top = 0,
						_14 = 0,
						_15 = 0,
						_16 = 0;
						var pos = {
							display : "block"
						};
						if (_f == "north") {
							pos.top = parseInt(_11.css("top")) + _11.outerHeight() - _13.height();
							pos.left = parseInt(_11.css("left"));
							pos.width = _11.outerWidth();
							pos.height = _13.height();
						} else {
							if (_f == "south") {
								pos.top = parseInt(_11.css("top"));
								pos.left = parseInt(_11.css("left"));
								pos.width = _11.outerWidth();
								pos.height = _13.height();
							} else {
								if (_f == "east") {
									pos.top = parseInt(_11.css("top")) || 0;
									pos.left = parseInt(_11.css("left")) || 0;
									pos.width = _13.width();
									pos.height = _11.outerHeight();
								} else {
									if (_f == "west") {
										pos.top = parseInt(_11.css("top")) || 0;
										pos.left = _11.outerWidth() - _13.width();
										pos.width = _13.width();
										pos.height = _11.outerHeight();
									}
								}
							}
						}
						_13.css(pos);
						$("<div class=\"layout-mask\"></div>").css({
							left : 0,
							top : 0,
							width : cc.width(),
							height : cc.height()
						}).appendTo(cc);
					},
					onResize : function (e) {
						if (_f == "north" || _f == "south") {
							var _17 = $(">div.layout-split-proxy-v", _d);
							_17.css("top", e.pageY - $(_d).offset().top - _17.height() / 2);
						} else {
							var _17 = $(">div.layout-split-proxy-h", _d);
							_17.css("left", e.pageX - $(_d).offset().left - _17.width() / 2);
						}
						return false;
					},
					onStopResize : function () {
						$(">div.layout-split-proxy-v", _d).css("display", "none");
						$(">div.layout-split-proxy-h", _d).css("display", "none");
						var _18 = pp.panel("options");
						_18.width = _11.outerWidth();
						_18.height = _11.outerHeight();
						_18.left = _11.css("left");
						_18.top = _11.css("top");
						pp.panel("resize");
						_2(_d);
						_1 = false;
						cc.find(">div.layout-mask").remove();
					}
				});
			}
			return pp;
		};
		$("<div class=\"layout-split-proxy-h\"></div>").appendTo(cc);
		$("<div class=\"layout-split-proxy-v\"></div>").appendTo(cc);
		var _19 = {
			center : _e("center")
		};
		_19.north = _e("north");
		_19.south = _e("south");
		_19.east = _e("east");
		_19.west = _e("west");
		$(_d).bind("_resize", function (e, _1a) {
			var _1b = $.data(_d, "layout").options;
			if (_1b.fit == true || _1a) {
			//if (true) {
				_2(_d);
			}
			return false;
		});
		return _19;
	};
	function _1c(_1d, _1e) {
		var _1f = $.data(_1d, "layout").panels;
		var cc = $(_1d);
		function _20(dir) {
			var _21;
			if (dir == "east") {
				_21 = "layout-button-left";
			} else {
				if (dir == "west") {
					_21 = "layout-button-right";
				} else {
					if (dir == "north") {
						_21 = "layout-button-down";
					} else {
						if (dir == "south") {
							_21 = "layout-button-up";
						}
					}
				}
			}
			var p = $("<div></div>").appendTo(cc).panel({
					cls : "layout-expand",
					title : "&nbsp;",
					closed : true,
					doSize : false,
					tools : [{
							iconCls : _21,
							handler : function () {
								_22(_1d, _1e);
							}
						}
					]
				});
			p.panel("panel").hover(function () {
				$(this).addClass("layout-expand-over");
			}, function () {
				$(this).removeClass("layout-expand-over");
			});
			return p;
		};
		if (_1e == "east") {
			if (_1f.east.panel("options").onBeforeCollapse.call(_1f.east) == false) {
				return;
			}
			_1f.center.panel("resize", {
				width : _1f.center.panel("options").width + _1f.east.panel("options").width - 28
			});
			_1f.east.panel("panel").animate({
				left : cc.width()
			}, function () {
				_1f.east.panel("close");
				_1f.expandEast.panel("open").panel("resize", {
					top : _1f.east.panel("options").top,
					left : cc.width() - 28,
					width : 28,
					height : _1f.east.panel("options").height
				});
				_1f.east.panel("options").onCollapse.call(_1f.east);
			});
			if (!_1f.expandEast) {
				_1f.expandEast = _20("east");
				_1f.expandEast.panel("panel").click(function () {
					_1f.east.panel("open").panel("resize", {
						left : cc.width()
					});
					_1f.east.panel("panel").animate({
						left : cc.width() - _1f.east.panel("options").width
					});
					return false;
				});
			}
		} else {
			if (_1e == "west") {
				if (_1f.west.panel("options").onBeforeCollapse.call(_1f.west) == false) {
					return;
				}
				_1f.center.panel("resize", {
					width : _1f.center.panel("options").width + _1f.west.panel("options").width - 28,
					left : 28
				});
				_1f.west.panel("panel").animate({
					left : -_1f.west.panel("options").width
				}, function () {
					_1f.west.panel("close");
					_1f.expandWest.panel("open").panel("resize", {
						top : _1f.west.panel("options").top,
						left : 0,
						width : 28,
						height : _1f.west.panel("options").height
					});
					_1f.west.panel("options").onCollapse.call(_1f.west);
				});
				if (!_1f.expandWest) {
					_1f.expandWest = _20("west");
					_1f.expandWest.panel("panel").click(function () {
						_1f.west.panel("open").panel("resize", {
							left : -_1f.west.panel("options").width
						});
						_1f.west.panel("panel").animate({
							left : 0
						});
						return false;
					});
				}
			} else {
				if (_1e == "north") {
					if (_1f.north.panel("options").onBeforeCollapse.call(_1f.north) == false) {
						return;
					}
					var hh = cc.height() - 28;
					if (_b(_1f.expandSouth)) {
						hh -= _1f.expandSouth.panel("options").height;
					} else {
						if (_b(_1f.south)) {
							hh -= _1f.south.panel("options").height;
						}
					}
					_1f.center.panel("resize", {
						top : 28,
						height : hh
					});
					_1f.east.panel("resize", {
						top : 28,
						height : hh
					});
					_1f.west.panel("resize", {
						top : 28,
						height : hh
					});
					if (_b(_1f.expandEast)) {
						_1f.expandEast.panel("resize", {
							top : 28,
							height : hh
						});
					}
					if (_b(_1f.expandWest)) {
						_1f.expandWest.panel("resize", {
							top : 28,
							height : hh
						});
					}
					_1f.north.panel("panel").animate({
						top : -_1f.north.panel("options").height
					}, function () {
						_1f.north.panel("close");
						_1f.expandNorth.panel("open").panel("resize", {
							top : 0,
							left : 0,
							width : cc.width(),
							height : 28
						});
						_1f.north.panel("options").onCollapse.call(_1f.north);
					});
					if (!_1f.expandNorth) {
						_1f.expandNorth = _20("north");
						_1f.expandNorth.panel("panel").click(function () {
							_1f.north.panel("open").panel("resize", {
								top : -_1f.north.panel("options").height
							});
							_1f.north.panel("panel").animate({
								top : 0
							});
							return false;
						});
					}
				} else {
					if (_1e == "south") {
						if (_1f.south.panel("options").onBeforeCollapse.call(_1f.south) == false) {
							return;
						}
						var hh = cc.height() - 28;
						if (_b(_1f.expandNorth)) {
							hh -= _1f.expandNorth.panel("options").height;
						} else {
							if (_b(_1f.north)) {
								hh -= _1f.north.panel("options").height;
							}
						}
						_1f.center.panel("resize", {
							height : hh
						});
						_1f.east.panel("resize", {
							height : hh
						});
						_1f.west.panel("resize", {
							height : hh
						});
						if (_b(_1f.expandEast)) {
							_1f.expandEast.panel("resize", {
								height : hh
							});
						}
						if (_b(_1f.expandWest)) {
							_1f.expandWest.panel("resize", {
								height : hh
							});
						}
						_1f.south.panel("panel").animate({
							top : cc.height()
						}, function () {
							_1f.south.panel("close");
							_1f.expandSouth.panel("open").panel("resize", {
								top : cc.height() - 28,
								left : 0,
								width : cc.width(),
								height : 28
							});
							_1f.south.panel("options").onCollapse.call(_1f.south);
						});
						if (!_1f.expandSouth) {
							_1f.expandSouth = _20("south");
							_1f.expandSouth.panel("panel").click(function () {
								_1f.south.panel("open").panel("resize", {
									top : cc.height()
								});
								_1f.south.panel("panel").animate({
									top : cc.height() - _1f.south.panel("options").height
								});
								return false;
							});
						}
					}
				}
			}
		}
	};
	function _22(_23, _24) {
		var _25 = $.data(_23, "layout").panels;
		var cc = $(_23);
		if (_24 == "east" && _25.expandEast) {
			if (_25.east.panel("options").onBeforeExpand.call(_25.east) == false) {
				return;
			}
			_25.expandEast.panel("close");
			_25.east.panel("panel").stop(true, true);
			_25.east.panel("open").panel("resize", {
				left : cc.width()
			});
			_25.east.panel("panel").animate({
				left : cc.width() - _25.east.panel("options").width
			}, function () {
				_2(_23);
				_25.east.panel("options").onExpand.call(_25.east);
			});
		} else {
			if (_24 == "west" && _25.expandWest) {
				if (_25.west.panel("options").onBeforeExpand.call(_25.west) == false) {
					return;
				}
				_25.expandWest.panel("close");
				_25.west.panel("panel").stop(true, true);
				_25.west.panel("open").panel("resize", {
					left : -_25.west.panel("options").width
				});
				_25.west.panel("panel").animate({
					left : 0
				}, function () {
					_2(_23);
					_25.west.panel("options").onExpand.call(_25.west);
				});
			} else {
				if (_24 == "north" && _25.expandNorth) {
					if (_25.north.panel("options").onBeforeExpand.call(_25.north) == false) {
						return;
					}
					_25.expandNorth.panel("close");
					_25.north.panel("panel").stop(true, true);
					_25.north.panel("open").panel("resize", {
						top : -_25.north.panel("options").height
					});
					_25.north.panel("panel").animate({
						top : 0
					}, function () {
						_2(_23);
						_25.north.panel("options").onExpand.call(_25.north);
					});
				} else {
					if (_24 == "south" && _25.expandSouth) {
						if (_25.south.panel("options").onBeforeExpand.call(_25.south) == false) {
							return;
						}
						_25.expandSouth.panel("close");
						_25.south.panel("panel").stop(true, true);
						_25.south.panel("open").panel("resize", {
							top : cc.height()
						});
						_25.south.panel("panel").animate({
							top : cc.height() - _25.south.panel("options").height
						}, function () {
							_2(_23);
							_25.south.panel("options").onExpand.call(_25.south);
						});
					}
				}
			}
		}
	};
	function _26(_27) {
		var _28 = $.data(_27, "layout").panels;
		var cc = $(_27);
		if (_28.east.length) {
			_28.east.panel("panel").bind("mouseover", "east", _1c);
		}
		if (_28.west.length) {
			_28.west.panel("panel").bind("mouseover", "west", _1c);
		}
		if (_28.north.length) {
			_28.north.panel("panel").bind("mouseover", "north", _1c);
		}
		if (_28.south.length) {
			_28.south.panel("panel").bind("mouseover", "south", _1c);
		}
		_28.center.panel("panel").bind("mouseover", "center", _1c);
		function _1c(e) {
			if (_1 == true) {
				return;
			}
			if (e.data != "east" && _b(_28.east) && _b(_28.expandEast)) {
				_28.east.panel("panel").animate({
					left : cc.width()
				}, function () {
					_28.east.panel("close");
				});
			}
			if (e.data != "west" && _b(_28.west) && _b(_28.expandWest)) {
				_28.west.panel("panel").animate({
					left : -_28.west.panel("options").width
				}, function () {
					_28.west.panel("close");
				});
			}
			if (e.data != "north" && _b(_28.north) && _b(_28.expandNorth)) {
				_28.north.panel("panel").animate({
					top : -_28.north.panel("options").height
				}, function () {
					_28.north.panel("close");
				});
			}
			if (e.data != "south" && _b(_28.south) && _b(_28.expandSouth)) {
				_28.south.panel("panel").animate({
					top : cc.height()
				}, function () {
					_28.south.panel("close");
				});
			}
			return false;
		};
	};
	function _b(pp) {
		if (!pp) {
			return false;
		}
		if (pp.length) {
			return pp.panel("panel").is(":visible");
		} else {
			return false;
		}
	};
	$.fn.layout = function (_29, _2a) {
		if (typeof _29 == "string") {
			return $.fn.layout.methods[_29](this, _2a);
		}
		return this.each(function () {
			var _2b = $.data(this, "layout");
			if (!_2b) {
				var _2c = $.extend({}, {
						fit : $(this).attr("fit") == "true"
					});
				$.data(this, "layout", {
					options : _2c,
					panels : _c(this)
				});
				_26(this);
			}
			_2(this);
		});
	};
	$.fn.layout.methods = {
		resize : function (jq) {
			return jq.each(function () {
				_2(this);
			});
		},
		panel : function (jq, _2d) {
			return $.data(jq[0], "layout").panels[_2d];
		},
		collapse : function (jq, _2e) {
			return jq.each(function () {
				_1c(this, _2e);
			});
		},
		expand : function (jq, _2f) {
			return jq.each(function () {
				_22(this, _2f);
			});
		}
	};
})(jQuery);
