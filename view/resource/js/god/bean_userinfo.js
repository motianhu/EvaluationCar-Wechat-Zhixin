~function($, window) {
	"use strict"; // jshint ;_;

	initUserInfo();

	/**
	 * 初始化
	 * 
	 */
	function initUserInfo() {
		// 获取推广渠道类型和渠道大类
		Util.ajax({
			url : requestContextPath + "/common/getUserInfo.html",
			data : {},
			dataType : "json",
			success : function(data) {
				if (data.success) {
					var user = data.object;
					var forUserEdit = $("#for_edit").html();
					var temp = forUserEdit.replace("{chineseName}",
							user.chineseName || "").replace("{englishName}",
							user.englishName || "").replace("{email}",
							user.email || "").replace("{phone}",
							user.phone || "").replace("{qq}", user.qq || "")
							.replace("{weChat}", user.weChat || "");
					$("#for_edit").html(temp);
				}

			}
		});
	}

	$("#user_detail_btnSave").click(function() {

		var edit_chineseName = $('#edit_chineseName').val();
		var edit_email = $('#edit_email').val();
		var edit_phone = $('#edit_phone').val();
		var edit_qq = $('#edit_qq').val();
		var edit_weChat = $('#edit_weChat').val();
		$.ajax({
			type : "POST",
			url : requestContextPath + "/user/updateUserInfo.html",
			data : {
				chineseName : edit_chineseName.trim(),
				email : edit_email.trim(),
				phone : edit_phone.trim(),
				qq : edit_qq.trim(),
				weChat : edit_weChat.trim()
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {

					refreshQrvCard();

					$.msgbox.show({
						'type' : 'info',
						'text' : '修改成功',
						'title' : '成功'
					});
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

	/**
	 * 更新个人二维码
	 */
	function refreshQrvCard() {
		$('#userQrvCard').attr(
				'src',
				requestContextPath + '/common/getQrvCard.html?math='
						+ Math.random());
	}

	$("#userQrvCard").click(
			function() {
				$.ajax({
					type : "POST",
					url : requestContextPath
							+ '/common/getQrvCardImage.html?math='
							+ Math.random(),
					success : function(data) {
						window.open(window.location.protocol + "//"
								+ window.location.host + requestContextPath
								+ "/view/external/qrCode.jsp?image=" + data);
					}
				});

			});

	$("#user_updatePassword_btnSave").click(function() {

		var edit_oldPassword = $('#edit_oldPassword').val();
		var edit_newPassword = $('#edit_newPassword').val();
		var edit_comfirmPassword = $('#edit_comfirmPassword').val();
		$.ajax({
			type : "POST",
			url : requestContextPath + "/user/updateUserPassword.html",
			data : {
				oldPassword : edit_oldPassword.trim(),
				newPassword : edit_newPassword.trim(),
				comfirmPassword : edit_comfirmPassword.trim()
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					$.msgbox.show({
						'type' : 'info',
						'text' : '修改成功',
						'title' : '成功'
					});
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

}(jQuery, window)