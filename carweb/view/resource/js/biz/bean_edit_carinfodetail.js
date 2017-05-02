~function($, window) {
	"use strict"; // jshint ;_;

	var now = new Date().Format('yyyyMMdd');

	var $imageBox = $(".imageBox");
	// var testCarBillId = '201601130015';
	var carBillId = $("#hidden_carBillId").val();
	initCarBillImage();

	function initCarBillImage() {
		$
				.ajax({
					url : requestContextPath
							+ "/carImage/getEditCarImages.html",
					type : "POST",
					data : {
						'carBillId' : carBillId,
					},
					dataType : "json",
					success : function(data) {
						if (data == null) {
							$.msgbox.show({
								'type' : 'error',
								'text' : "初始化失败",
								'title' : '错误'
							});
						} else {
							// 数据
							var h4_1 = $("#imageFileArray_1").find("h4")[0];
							createCarBillImageItem(data, '登记证',
									"imageFileArray_1", h4_1);
							var h4_2 = $("#imageFileArray_2").find("h4")[0];
							createCarBillImageItem(data, '行驶证',
									"imageFileArray_2", h4_2);
							var h4_3 = $("#imageFileArray_3").find("h4")[0];
							createCarBillImageItem(data, '铭牌',
									"imageFileArray_3", h4_3);
							var h4_4 = $("#imageFileArray_4").find("h4")[0];
							createCarBillImageItem(data, '车身外观',
									"imageFileArray_4", h4_4);
							var h4_5 = $("#imageFileArray_5").find("h4")[0];
							createCarBillImageItem(data, '车体骨架',
									"imageFileArray_5", h4_5);
							var h4_6 = $("#imageFileArray_6").find("h4")[0];
							createCarBillImageItem(data, '车辆内饰',
									"imageFileArray_6", h4_6);
							var h4_7 = $("#imageFileArray_7").find("h4")[0];
							createCarBillImageItem(data, '差异补充',
									"imageFileArray_7", h4_7);
							var h4_8 = $("#imageFileArray_8").find("h4")[0];
							createCarBillImageItem(data, '原车保险',
									"imageFileArray_8", h4_8);

							setCurrencyVal("#preSalePrice", data.preSalePrice);
							$("#mark").val(data.mark);

						}
					}
				});
	}

	function createCarBillImageItem(data, imageClass, imageFileArray, elem) {
		var imageBox = "<div class='imageBox'><span>{image_index}</span><div class='imageItem'>"
				+ "<img src='{showImageData}' class='imageData' mainImage='' mainImage=''"
				+ "width='100px' height='100px'></div><div class='imageEdit'>"
				+ "<div class='moveLeft' style='width: 20px; float: left;'>"
				+ "	<a href='javascript:void(0)'><img src='img/moveleft.png' />"
				+ "	</a>"
				+ "</div>"
				+ "<div style='width: 60px; float: left;'>"
				+ "	<span class='btn btn-default fileinput-button'> <span style='font-size: 12px;'>上传</span> "
				+ "		<input id='{fileImageId}' name='replaceImage' type='file'"
				+ "		class='fileinput replaceImage'>"
				+ "	</span>"
				+ "</div>"
				+ "<div style='width: 45px; float: left;'>"
				+ "	<button type='button' class='btn-cancel deleteImage'"
				+ "			style='float: left; font-size:12px;' name='deleteImage' value='删除'>删除</button>"
				+ "	</div>"
				+ "	<div class='moveRight' style='width: 20px; float: left;'>"
				+ "		<a href='javascript:void(0)'><img src='img/moveright.png' /></a>"
				+ " </div></div></div>";

		var imageList = data[imageClass];
		if (imageList == null || imageList == undefined) {
			return;
		}
		var imagesBoxHtml = "";
		var newId = '';
		for (var i = 0; i < imageList.length; i++) {
			newId = uuid();
			newId = newId.replace('-', '');
			var newImageBox = imageBox.replace("{image_index}", (i + 1))
					.replace(
							"{showImageData}",
							requestContextPath + "/"
									+ imageList[i].imageThumbPath).replace(
							'{fileImageId}', uuid);
			imagesBoxHtml += newImageBox;
		}
		$(elem).after(imagesBoxHtml);

		$("#" + imageFileArray).on('change', ".fileinput", ajaxFileUpload);
		$("#" + imageFileArray).find('.deleteImage').click(function(e) {
			isDeleteImage(this);
		});
		// 左移动
		$("#" + imageFileArray).find('.moveLeft').click(function(e) {
			moveLeftImage(this);
		});
		// 右移动
		$("#" + imageFileArray).find('.moveRight').click(function(e) {
			moveRightImage(this);
		});
	}

	$imageBox.on('change', ".fileinput", ajaxFileUpload);

	/*
	 * 文件上传
	 */
	function ajaxFileUpload() {
		var id = $(this).attr('id');
		// var category = $(this).attr('category');
		var category = 'test';
		var fileFullName = $(this).val();
		var nShortStartIndex = fileFullName.lastIndexOf("\\");
		if (nShortStartIndex > -1) {
			fileFullName = fileFullName.substring(nShortStartIndex + 1);
		}
		var imageItem = $(this).parent().parent().parent('.imageEdit').prev();
		if (/.png$|.jpg$|.gif$|.pdf$|.jpeg$/i.test(fileFullName)) {
			Util.ajaxFileUpload({
				async : false,
				url : requestContextPath
						+ '/carImage/uploadCommonFile.html?category='
						+ category,
				secureuri : false,
				fileElementId : id,
				dataType : 'json',
				success : function(data) {
					if (!data.success) {
						$.msgbox.show({
							'type' : 'error',
							'text' : data.message,
							'title' : '错误'
						});
					} else {

						$(imageItem).find('img')[0].src = requestContextPath
								+ "/" + data.object.carImage[0];
					}
				},
				error : function(data, status, e) {
					$.msgbox.show({
						'type' : 'error',
						'text' : "上传文件失败，请重新上传!",
						'title' : '错误'
					});
				}
			});
		} else {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请上传后缀名为.png .jpg .jpeg .gif .pdf的文件",
				'title' : '警告'
			});
		}

	}

	// 删除
	$('.deleteImage').click(function(e) {
		isDeleteImage(this);
	});

	function isDeleteImage(elem) {
		// 服务器图片不在上传
		// 删除数据
		$(elem).parent().parent().parent('.imageBox').remove();

	}

	// 添加
	$('.imageAdd').click(function(e) {
		addImage(this);
	});

	// 左移动
	$('.moveLeft').click(function(e) {
		moveLeftImage(this);
	});

	// 右移动
	$('.moveRight').click(function(e) {
		moveRightImage(this);
	});

	function moveLeftImage(elem) {
		var curImageBox = $(elem).parent().parent('.imageBox');
		var preImageBox = curImageBox.prev('.imageBox');
		if (preImageBox != null && preImageBox != undefined) {
			curImageBox.insertBefore(preImageBox);
		}

	}

	function moveRightImage(elem) {
		var curImageBox = $(elem).parent().parent('.imageBox');
		var nextImageBox = curImageBox.next('.imageBox');
		if (nextImageBox != null && nextImageBox != undefined) {
			curImageBox.insertAfter(nextImageBox);
		}
	}

	// 新增图片
	function addImage(elem) {
		var newImageBox = "<div class='imageBox'><span style='color:#4CAE4C;'>新</span><div class='imageItem'><img class='imageData' mainImage='' src='' width='100px' height='100px'>"
				+ "</div><div class='imageEdit'><div class='moveLeft' style='width: 20px; float: left;'><a href='javascript:void(0)'><img src='img/moveleft.png' /> </a>"
				+ "</div><div style='width: 60px; float: left;'><span class='btn btn-default fileinput-button'> <span style='font-size: 12px;'>上传</span> "
				+ "<input id='{fileImageId}' name='replaceImage' type='file' class='fileinput replaceImage'></span></div><div style='width: 45px; float: left;'>"
				+ "<button type='button' class='btn-cancel deleteImage' style='float: left; font-size:12px;' name='deleteImage' value='删除'>删除</button>"
				+ "</div><div class='moveRight' style='width: 20px; float: left;'><a href='javascript:void(0)'><img src='img/moveright.png' /></a></div></div></div>";
		var newId = uuid();
		newId = newId.replace('-', '');
		newImageBox = newImageBox.replace('{fileImageId}', newId);
		$(elem).before(newImageBox);

		var newImage = $(elem).prev();

		newImage.on('change', ".fileinput", ajaxFileUpload);

		newImage.find('.deleteImage').click(function(e) {
			isDeleteImage(this);
		});
		// 左移动
		newImage.find('.moveLeft').click(function(e) {
			moveLeftImage(this);
		});
		// 右移动
		newImage.find('.moveRight').click(function(e) {
			moveRightImage(this);
		});

	}

	// 文件列表
	function getImageList(imageFileArray) {
		var imagesArray = [];
		var images = $("#" + imageFileArray).find(".imageData");
		if (images != null && images.length > 0) {
			for (var i = 0; i < images.length; i++) {
				imagesArray.push(images[i].src);
			}
		}
		return imagesArray;
	}

	$('#submitBtn').click(
			function(e) {
				var imageFileArray_1 = getImageList("imageFileArray_1");
				var imageFileArray_2 = getImageList("imageFileArray_2");
				var imageFileArray_3 = getImageList("imageFileArray_3");
				var imageFileArray_4 = getImageList("imageFileArray_4");
				var imageFileArray_5 = getImageList("imageFileArray_5");
				var imageFileArray_6 = getImageList("imageFileArray_6");
				var imageFileArray_7 = getImageList("imageFileArray_7");
				var imageFileArray_8 = getImageList("imageFileArray_8");
				if (imageFileArray_1 == null || imageFileArray_1 == undefined
						|| imageFileArray_1.length <= 0) {
					$.msgbox.show({
						'type' : 'error',
						'text' : "登记证不能为空!",
						'title' : '错误'
					});
					return;
				}
				if (imageFileArray_2 == null || imageFileArray_2 == undefined
						|| imageFileArray_2.length <= 0) {
					$.msgbox.show({
						'type' : 'error',
						'text' : "行驶证不能为空!",
						'title' : '错误'
					});
					return;
				}
				if (imageFileArray_3 == null || imageFileArray_3 == undefined
						|| imageFileArray_3.length <= 0) {
					$.msgbox.show({
						'type' : 'error',
						'text' : "铭牌不能为空!",
						'title' : '错误'
					});
					return;
				}
				if (imageFileArray_4 == null || imageFileArray_4 == undefined
						|| imageFileArray_4.length <= 0) {
					$.msgbox.show({
						'type' : 'error',
						'text' : "车身外观不能为空!",
						'title' : '错误'
					});
					return;
				}
				if (imageFileArray_5 == null || imageFileArray_5 == undefined
						|| imageFileArray_5.length <= 0) {
					$.msgbox.show({
						'type' : 'error',
						'text' : "车体骨架不能为空!",
						'title' : '错误'
					});
					return;
				}
				if (imageFileArray_6 == null || imageFileArray_6 == undefined
						|| imageFileArray_6.length <= 0) {
					$.msgbox.show({
						'type' : 'error',
						'text' : "车辆内饰不能为空!",
						'title' : '错误'
					});
					return;
				}

				var data = {
					'images1' : imageFileArray_1,
					'images2' : imageFileArray_2,
					'images3' : imageFileArray_3,
					'images4' : imageFileArray_4,
					'images5' : imageFileArray_5,
					'images6' : imageFileArray_6,
					'images7' : imageFileArray_7,
					'images8' : imageFileArray_8,
					'mark' : $("#mark").val(),
					'preSalePrice' : $("#preSalePrice").val(),
					'carBillId' : carBillId
				};

				Util.ajax(
						{
							url : requestContextPath
									+ "/carBill/editCarImageBill.html",
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
											parent.detailCarBillModalConfirm();
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

	// 撤销数据
	$("#data_cancel").click(function() {
		parent.window.detailCarBillModalConfirm('cancel');
	});

}(jQuery, window)