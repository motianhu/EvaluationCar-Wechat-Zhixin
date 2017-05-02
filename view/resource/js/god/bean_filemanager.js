~function($, window) {
	"use strict"; // jshint ;_;
	initUploadFile();
	var url= window.location.href;
	var mainUrl = "";
	
	initUrl();
	
	function initUrl() {
		var httpHeader = "http://";
		mainUrl = url.substring(httpHeader.length);
		mainUrl = httpHeader + mainUrl.substring(0, mainUrl.indexOf('/'));
	}
	
	function initUploadFile() {
		$("#uploadFile").uploadify(
				{
					'buttonText' : '选择上传文件',
					'swf' : requestContextPath
							+ "/view/resource/uploadify/uploadify.swf",
					'uploader' : requestContextPath
							+ "/filemanager/uploadDirPathFile.html",
					'formData' : {
						'dirPath' :  ''
					},
					'auto' : true,
					'fileObjName' : 'uploadFile',
					// 'multi' : false,
					// 'removeCompleted':false,
					'queueID' : 'fileQueue',
					'cancelImg' : '../../uploadify/uploadify-cancel.png',
					'fileTypeExts' : '*.jpg;*.jpge;*.gif;*.png;*.txt;*.text;*.xls;*.xlsx;*.doc;*.docx',
					'fileSizeLimit' : '2MB',
					'onUploadComplete' : function(file) {
						//  initFileTree(); 刷新有问题
					},
                    'onUploadStart' : function(file) {  
                        $("#uploadFile").uploadify("settings", "formData", {
                        		'dirPath' : $('#hideDir').val()
                        });  
                    },
					// 加上此句会重写onSelectError方法【需要重写的事件】
					'overrideEvents' : [ 'onSelectError', 'onDialogClose' ],
					// 返回一个错误，选择文件的时候触发
					'onSelectError' : function(file, errorCode, errorMsg) {
						switch (errorCode) {
						case -110:
							$.msgbox.show({
								'type' : 'error',
								'text' : "文件 ["
										+ file.name
										+ "] 大小超出系统限制的"
										+ $('#uploadFile').uploadify(
												'settings', 'fileSizeLimit')
										+ "大小！",
								'title' : '错误'
							});
							break;
						case -120:
							$.msgbox.show({
								'type' : 'error',
								'text' : "文件 [" + file.name + "] 大小异常！",
								'title' : '错误'
							});
							break;
						case -130:
							$.msgbox.show({
								'type' : 'error',
								'text' : "文件 [" + file.name + "] 类型不正确！",
								'title' : '错误'
							});
							break;
						}
					},
				});
	}

	initFileTree();

	// 调用文件列表服务
	function initFileTree() {
		$('#fileTreeRoot').fileTree({
			root : 'source/upload/',
			script : requestContextPath + '/filemanager/getFileTree.html',
			folderEvent : 'click',
			expandSpeed : 1,
			collapseSpeed : 1
		}, function(file) {
			$('#fileLink').val(mainUrl + requestContextPath + "/" + file);
			$('#hideDir').val("/" + file);
			$('#showImage').attr('src', requestContextPath + "/" + file);
		});
	}

	
	$("#newDirBtn").click(function() {
		var selectedPath = $('#hideDir').val();
		var newDir = $('#newDir').val();
		$.ajax({
			type: "POST",
			url: requestContextPath + "/filemanager/mkdir.html",
			data: {
				path:  selectedPath,
				newDir : newDir
			},
			dataType: "json",
			success: function(data) {
				if (data.success) {
					$.msgbox.show({
						'type': 'info',
						'text': data.message,
						'title': '成功'
					});
					
					//刷新树
					initFileTree();
					
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
	
	$("#refreshBtn").click(function() {
		initFileTree();
	});
	
	beautifulSelect2();

	function beautifulSelect2() {

		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}

}(jQuery, window)