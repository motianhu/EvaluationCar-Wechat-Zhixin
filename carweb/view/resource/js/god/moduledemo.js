~ function($, window) {

	/* 附件上传框事件 */
	$(document).on('change', "#uploadFile", function() {
		ajaxFileUpload('uploadFile');
	});

	/* excelFile导入事件 */
	$(document).on('change', "#excelFile", excelFileUpdate);

	function excelFileUpdate() {
		var name = this.value;
		var fileName = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
		if (fileName != "xls" && fileName != "xlsx") {
			$.msgbox.show({
				'type' : 'info',
				'text' : '请选择excel格式文件上传(xls, xlsx)',
				'title' : '提示'
			});
			return false;
		}
		ajaxFileUpload(this.id);
	}

	function ajaxFileUpload(id) {
		var uri = "/filemanager/uploadFile.html";

		Util.ajaxFileUpload({
			async : false,
			url : requestContextPath + uri,
			secureuri : false,
			fileElementId : id,
			dataType : 'text',
			success : function(data) {
				$('#' + id + 'Url').val(data);
				$('#' + id + 'Name').text(data);
				$('#' + id).prev().html("重新上传");
			},
			error : function(data, status, e) {
				$('#' + id + 'Url').val('error');
			}
		});
	}

	
	test();
	
	function test() {
	var $dataTime = $("#reservation");
	debugger;
	$dataTime.daterangepicker({
		startDate: moment().add('days', -9),
		endDate: moment().add('days')
	}).data('daterangepicker').updateInputText();
	}
	
}(jQuery, window)