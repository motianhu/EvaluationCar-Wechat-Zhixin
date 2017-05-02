// 全局图片
// var imageMap = new HashMap();
var company_xianfeng = 9;
~function($, window) {
	"use strict"; // jshint ;_;

	// init view
	initView();
	function initView() {
		if (userCompany == company_xianfeng
				|| userSuperCompany == company_xianfeng) {
			$(".input_image_required").css("display", "none");
		}
	}
	var imageArray = [ '登记证', '行驶证', '铭牌', '车身外观', '车体骨架', '车辆内饰', '差异补充',
			'原车保险' ];

	function putImageMap(imageClass, imageArray) {
		// 批量有序数组，不支持单个上传，否则无序.
		var newArray = imageArray;
		if (imageMap.containsKey(imageClass)) {
			var oldImageArray = imageMap.get(imageClass);
			if (oldImageArray != null && oldImageArray.length > 0) {
				newArray = oldImageArray.concat(newArray);
			}
		}
		imageMap.put(imageClass, newArray);
	}

	var fileInput1 = $("#file-1").fileinput({
		domId : "file-1",
		uploadUrl : requestContextPath + '/carImage/uploadImage.html',
		allowedFileExtensions : [ 'jpg', 'png', 'gif' ],
		overwriteInitial : false,
		maxFileSize : 10000,
		maxFilesNum : 20,
		allowedFileTypes : [ 'image' ],
		slugCallback : function(filename) {
			return filename.replace('(', '_').replace(']', '_');
		},
		ajaxSuccess : function(data) {
			putImageMap("file-1", data.object.carImage);
		},
		uploadAsync : false
	});
	$("#file-2").fileinput({
		domId : "file-2",
		uploadUrl : requestContextPath + '/carImage/uploadImage.html',
		// an error
		allowedFileExtensions : [ 'jpg', 'png', 'gif' ],
		overwriteInitial : false,
		maxFileSize : 10000,
		maxFilesNum : 20,
		allowedFileTypes : [ 'image' ],
		slugCallback : function(filename) {
			return filename.replace('(', '_').replace(']', '_');
		},
		ajaxSuccess : function(data) {
			putImageMap("file-2", data.object.carImage);
		},
		uploadAsync : false
	});

	$("#file-3").fileinput({
		domId : "file-3",
		uploadUrl : requestContextPath + '/carImage/uploadImage.html',
		// an error
		allowedFileExtensions : [ 'jpg', 'png', 'gif' ],
		overwriteInitial : false,
		maxFileSize : 10000,
		maxFilesNum : 20,
		allowedFileTypes : [ 'image' ],
		slugCallback : function(filename) {
			return filename.replace('(', '_').replace(']', '_');
		},
		ajaxSuccess : function(data) {
			putImageMap("file-3", data.object.carImage);
		},
		uploadAsync : false
	});

	$("#file-4").fileinput({
		domId : "file-4",
		uploadUrl : requestContextPath + '/carImage/uploadImage.html',
		// an error
		allowedFileExtensions : [ 'jpg', 'png', 'gif' ],
		overwriteInitial : false,
		maxFileSize : 10000,
		maxFilesNum : 20,
		allowedFileTypes : [ 'image' ],
		slugCallback : function(filename) {
			return filename.replace('(', '_').replace(']', '_');
		},
		ajaxSuccess : function(data) {
			putImageMap("file-4", data.object.carImage);
		},
		uploadAsync : false
	});
	$("#file-5").fileinput({
		domId : "file-5",
		uploadUrl : requestContextPath + '/carImage/uploadImage.html',
		// an error
		allowedFileExtensions : [ 'jpg', 'png', 'gif' ],
		overwriteInitial : false,
		maxFileSize : 10000,
		maxFilesNum : 20,
		allowedFileTypes : [ 'image' ],
		slugCallback : function(filename) {
			return filename.replace('(', '_').replace(']', '_');
		},
		ajaxSuccess : function(data) {
			putImageMap("file-5", data.object.carImage);
		},
		uploadAsync : false
	});

	$("#file-6").fileinput({
		domId : "file-6",
		uploadUrl : requestContextPath + '/carImage/uploadImage.html',
		// an error
		allowedFileExtensions : [ 'jpg', 'png', 'gif' ],
		overwriteInitial : false,
		maxFileSize : 10000,
		maxFilesNum : 20,
		allowedFileTypes : [ 'image' ],
		slugCallback : function(filename) {
			return filename.replace('(', '_').replace(']', '_');
		},
		ajaxSuccess : function(data) {
			putImageMap("file-6", data.object.carImage);
		},
		uploadAsync : false
	});

	$("#file-7").fileinput({
		domId : "file-7",
		uploadUrl : requestContextPath + '/carImage/uploadImage.html',
		// an error
		allowedFileExtensions : [ 'jpg', 'png', 'gif' ],
		overwriteInitial : false,
		maxFileSize : 10000,
		maxFilesNum : 20,
		allowedFileTypes : [ 'image' ],
		slugCallback : function(filename) {
			return filename.replace('(', '_').replace(']', '_');
		},
		ajaxSuccess : function(data) {
			putImageMap("file-7", data.object.carImage);
		},
		uploadAsync : false
	});

	$("#file-8").fileinput({
		domId : "file-8",
		uploadUrl : requestContextPath + '/carImage/uploadImage.html',
		// an error
		allowedFileExtensions : [ 'jpg', 'png', 'gif' ],
		overwriteInitial : false,
		maxFileSize : 10000,
		maxFilesNum : 20,
		allowedFileTypes : [ 'image' ],
		slugCallback : function(filename) {
			return filename.replace('(', '_').replace(']', '_');
		},
		ajaxSuccess : function(data) {
			putImageMap("file-8", data.object.carImage);
		},
		uploadAsync : false
	});

	// 提交数据
	$("#submitBtn").click(
			function() {
				// 先校验
				if (userCompany != company_xianfeng
						&& userSuperCompany != company_xianfeng) {
					for (var i = 1; i <= 6; i++) {
						var images = imageMap.get("file-" + i);
						// alert(images);
						if (images == null || images == undefined) {

							$.msgbox.show({
								'type' : 'error',
								'text' : imageArray[i - 1] + "不能为空或请先上传！",
								'title' : '失败'
							});
							return;
						}
					}
				}
				var preSalePrice = $("#preSalePrice").val();
				if (preSalePrice == null || preSalePrice == undefined
						|| preSalePrice.length <= 0) {
					$.msgbox.show({
						'type' : 'error',
						'text' : "预售价格不能为空!",
						'title' : '失败'
					});
					return;
				}
				var data = {
					'images1' : imageMap.get("file-1"),
					// 'images2' : imageMap.get("file-2"),
					// 'images3' : imageMap.get("file-1"),
					// 'images4' : imageMap.get("file-1"),
					// 'images5' : imageMap.get("file-1"),
					// 'images6' : imageMap.get("file-1"),
					// 'images7' : imageMap.get("file-1"),
					// 'images8' : imageMap.get("file-1"),

					'images2' : imageMap.get("file-2"),
					'images3' : imageMap.get("file-3"),
					'images4' : imageMap.get("file-4"),
					'images5' : imageMap.get("file-5"),
					'images6' : imageMap.get("file-6"),
					'images7' : imageMap.get("file-7"),
					'images8' : imageMap.get("file-8"),
					'mark' : $("#mark").val(),
					'preSalePrice' : preSalePrice,
				};
				Util.ajax({
					url : requestContextPath + "/carBill/addCarBill.html",
					type : "POST",
					contentType : "application/json; charset=UTF-8",
					data : JSON.stringify(data),
					dataType : "json",
					success : function(data) {
						if (data.success) {
							$.msgbox.show({
								'type' : 'info',
								'text' : data.message,
								'title' : '成功',
								'cancelBtnShow' : false,
								'confirmCb' : function() {
									parent.ReOpenAddCarBill();
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

}(jQuery, window)