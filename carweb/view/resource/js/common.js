/**
 *	所有页面通用js
 *	@author vkyin
 */

//	原型对象
/**
 *	日期格式化
 *	@author meizz
 */
if (!Date.prototype.Format) {
	Date.prototype.Format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
}

/**
 *	字符串去空格
 */
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement, fromIndex) {
		var k;
		if (this == null) {
			throw new TypeError('"this" is null or not defined');
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if (len === 0) {
			return -1;
		}
		var n = +fromIndex || 0;

		if (Math.abs(n) === Infinity) {
			n = 0;
		}
		if (n >= len) {
			return -1;
		}
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
		while (k < len) {
			var kValue;
			if (k in O && O[k] === searchElement) {
				return k;
			}
			k++;
		}
		return -1;
	};
}
//通用函数

/**动态设置页面高度*/
function setIframeHeight() {
	var height = document.body.offsetHeight;
	if (height < 900) {
		height = 900;
	}
	var ifm_2 = parent.document.getElementById('ifm2');
	//var ifm_1 = parent.parent.document.getElementById('ifame1');
	if (ifm_2) {
		ifm_2.style.height = height + 50;
	}
	// if (ifm_1) {
	// ifm_1.style.height = height + 220 + 'px';
	// }
}

//通用工具
+ function($, window) {
	if (!$) {
		throw new Exception("jQuery is not defined");
	}

	window.Util = window.Util || {};

	function isType(type) {
		return function(obj) {
			return {}.toString.call(obj) === "[object " + type + "]";
		};
	}
	var isFunction = isType("Function");
	Util.isType = isType;

	/**
	 *	ajax插件封装
	 *	@author vkyin
	 *	@param ajaxParam jquery ajax 对象参数
	 *	@param noticeText 显示加载框时的提示文字, 忽略此参数则不显示加载框
	 */
	var $noticeModalBackdrop = $('<div class="modal-backdrop fade in" style="display:none;z-index:1050;opacity: 0.5;filter:alpha(opacity=50);background: #ffffff;"></div>');
	var $noticeDialogContainer = $('<div style="display:none;z-index:1050;position:fixed;top:0;bottom:0;left:0;right:0;"></div>');
	var $noticeContent = $('<div class="progress progress-bar progress-bar-striped active" style="width:200px;height:20px;z-index: 1060;position: absolute;top:50%;left:50%;margin:-12px 0 0 -100px;"></div>');
	var $dialog = $("<div style='font-size:18px;'>加载中</div>");
	$dialog.appendTo($noticeContent);
	$noticeContent.appendTo($noticeDialogContainer);
	$noticeModalBackdrop.appendTo($("body"));
	$noticeDialogContainer.appendTo($("body"));

	/*
	 * 加载中的模态框控制
	 * loadingDialog("show", "加载中"),loadingDialog("hide")
	 */
	Util.loadingDialog = function(str, text) {
		if ("show" === str) {
			$dialog.html(text || "加载中");
			$noticeModalBackdrop.show()
			$noticeDialogContainer.show();
		}
		if ("hide" === str) {
			$noticeModalBackdrop.hide();
			$noticeDialogContainer.hide();
		}
	};

	/*
	 * ajax请求的封装
	 */
	Util.ajax = function(ajaxParam, noticeText) {
		if (noticeText != undefined) {
			var _beforeSend = ajaxParam.beforeSend;
			var _complete = ajaxParam.complete;
			ajaxParam.beforeSend = function() {
				Util.loadingDialog("show", noticeText);
				if (isFunction(_beforeSend)) {
					_beforeSend();
				}
			}
			ajaxParam.complete = function() {
				if (isFunction(_complete)) {
					_complete();
				}
				Util.loadingDialog("hide");
			};
		}
		$.ajax(ajaxParam);
	};

	/*
	 * ajaxFileUpload组件的封装
	 */
	Util.ajaxFileUpload = function(ajaxObj, noticeText) {
		var _error = ajaxObj.erro,
			_success = ajaxObj.success;
		Util.loadingDialog("show", noticeText || "文件上传中");

		ajaxObj.success = function(data) {
			if (data == "failed") {
				$.msgbox.show({
					'type': 'error',
					'text': "文件上传失败",
					'title': '错误'
				});

			} else {
				if (isFunction(_success)) {
					_success(data);
				}
			}
			Util.loadingDialog("hide");
		};
		ajaxObj.error = function() {
			if (isFunction(_error)) {
				_error();
			}
			Util.loadingDialog("hide");
			$.msgbox.show({
				'type': 'error',
				'text': "文件上传失败",
				'title': '错误'
			});
		};
		$.ajaxFileUpload(ajaxObj);
	};

	/**
	 * 引入css、script文件
	 * @param {Object} file 文件路径
	 */
	Util.include = function(file) {
		var files = typeof file == "string" ? [file] : file;
		for (var i = 0; i < files.length; i++) {
			var name = files[i].replace(/^\s|\s$/g, "");
			var att = name.split('.');
			var ext = att[att.length - 1].toLowerCase();
			var isCSS = ext == "css";
			var tag = isCSS ? "link" : "script";
			var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
			var link = (isCSS ? "href" : "src") + "='" + '' + name + "'";
			if ($(tag + "[" + link + "]").length == 0) {
				$("<" + tag + attr + link + "></" + tag + ">").appendTo('head');
			}
		}
	};
	/**
	 * 数字格式化工具
	 * @param {String} strNum 数字字符串
	 */
	Util.numberFormatter = function(strNum) {
		if (strNum.length <= 3) {
			return strNum;
		}
		if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
			return strNum;
		}
		var a = RegExp.$1,
			b = RegExp.$2,
			c = RegExp.$3;
		var re = new RegExp();
		re.compile("(\\d)(\\d{3})(,|$)");
		while (re.test(b)) {
			b = b.replace(re, "$1,$2$3");
		}
		return a + "" + b + "" + c;
	};

	/**
	 * 取得字符串长度(汉字算两个)
	 */
	Util.getStringLen = function(str) {
		var i, len, code;
		if (str == null || str == "")
			return 0;
		len = str.length;
		for (i = 0; i < str.length; i++) {
			code = str.charCodeAt(i);
			if (code > 255) {
				len++;
			}
		}
		return len;
	};

	/**
	 * 文本过长处理
	 * 一般默认24个字符，之后使用省略符，使用title提示
	 */
	Util.textEllipsis = function(str) {

		if (str && str.length > 24) {
			str = str.substring(0, 24) + "...";
		}
		return str;
	}
}(jQuery, window); //一开始把window传进去为了提高效率, 因为会现在函数里面找, 再一层一层往外找, 最后才找到全局的window