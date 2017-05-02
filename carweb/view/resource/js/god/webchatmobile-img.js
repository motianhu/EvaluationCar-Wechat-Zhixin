//用于展示用户的聊天信息
var websocket;
var userId = 'cy';
var curCustomer = null;
var ip = "localhost";

var customer = null;
var clientUser = null;

// 聊天记录 开始
var loading = false;
// 每次加载添加多少条目
var pageSize = 20;
// 当前页
var curPage = 1;
var curDataCount = 0;
// 聊天记录 结束

$(document).on("pageInit", function(e, pageId, $page) {
	if (pageId == "chat") {
		initWebSocket();
		curPage = 1;
		loading = false;
		curDataCount = 0;
		$page.on('infinite', function() {
			attachHistoryChatInfinite();
		});
	}
});

loadServerList();
function loadServerList() {
	var userId = getQueryString("clientUser");
	var serverTemplate = '<li><a customer={customer} clientuser={clientuser} href="#"'
			+ ' data-no-cache="true" class="item-link item-content goto-server">'
			+ ' <div class="item-media">'
			+ '	<i class="icon icon-form-comment"></i></div>'
			+ ' <div class="item-inner">'
			+ '	<div class="item-title">客服{customer} ({curQueue})</div></div></a></li>';

	var recentServerTemplate = '<li><a customer={customer} clientuser={clientuser} href="#"'
			+ ' class="item-link item-content goto-server">'
			+ ' <div class="item-media">'
			+ '	<i class="icon icon-form-comment"></i></div>'
			+ ' <div class="item-inner">'
			+ '	<div class="item-title">客服{customer}</div></div></a></li>';

	$("#serverList").children().remove();
	$("#recentlyServer").children().remove();
	setTimeout(function() {
		$.hidePreloader();
	}, 1000);

	$.ajax({
		type : 'get',
		dataType : "json",
		data : {
			clientUser : userId
		},
		url : '/carWeb/external/chat/getServerList.html',
		success : function(data) {
			var serverListHtml = "";
			if (data.object.allServersVo) {
				for (var i = 0; i < data.object.allServersVo.length; i++) {
					serverListHtml = serverListHtml
							+ serverTemplate.replace(/{customer}/g,
									data.object.allServersVo[i]).replace(
									/{clientuser}/g, userId).replace(
									/{curQueue}/g,
									data.object.allServerQueue[i]);
				}
				$('#serverList').append(serverListHtml);
			}
			if (data.object.recentlyServerVo) {
				var recentServerHtml = recentServerTemplate.replace(
						/{customer}/g, data.object.recentlyServerVo).replace(
						/{clientuser}/g, userId);
				$('#recentlyServer').append(recentServerHtml);
			}

			$(document).on(
					'click',
					'.goto-server',
					function() {
						customer = $(this).attr('customer');
						clientUser = $(this).attr('clientuser');
						var dataNoCache = $(this).attr('data-no-cache');
						var ignoreCache = false;
						if (dataNoCache != null && dataNoCache != undefined
								&& dataNoCache == "true") {
							ignoreCache = true;
						}
						getChat(ignoreCache);
					});

		}
	});
}

// 初始话WebSocket
function initWebSocket() {
	// 调用方法
	var selectedCustomer = getQueryString("customer");
	$("#chatServerUser").html('聊天-' + selectedCustomer);
	userId = getQueryString("clientUser");
	if (curCustomer != null && selectedCustomer != curCustomer) {
		$.alert('请先退出最近连接的客服!', '提示!', function() {
		});
		return;
	}
	var checkIsOk = true;
	$.ajax({
		type : 'get',
		dataType : "json",
		async : false,
		data : {
			serverUser : selectedCustomer,
			clientUser : userId
		},
		url : '/carWeb/external/chat/checkConnectServer.html',
		success : function(data) {
			// console.log('success');
			if (!data.success) {
				checkIsOk = false;
				$.alert(data.message, '提示!', function() {
				});

			}
		}
	});
	// console.log('end');
	// 检查不成功退出
	if (!checkIsOk) {
		return;
	}
	if (websocket == null && window.WebSocket) {
		// 强制当前用户下线
		forceOfflineClient();
		curCustomer = selectedCustomer;
		websocket = new WebSocket(encodeURI("ws://" + ip
				+ ":8080/carWeb/one/message?usertype=USER&fromuser=" + userId
				+ "&touser=" + curCustomer));
		websocket.onopen = function() {
			// 连接成功
			$.alert('连接客服成功', '提示!', function() {
			});
		}
		websocket.onerror = function() {
			// 连接失败
			websocket = null;
			$.alert('连接出错', '错误!', function() {
			});
		}
		websocket.onclose = function() {
			// 连接断开
			websocket = null;
			$.alert('连接断开', '提示!', function() {
			});
		}
		// 消息接收
		websocket.onmessage = function(message) {
			var message = JSON.parse(message.data);
			// 接收用户发送的消息
			if (message.type == 'message') {
				receive("server", message);
			} else if (message.type == 'server_user_leave') {
				// 客服下线
				$.alert('客服已下线', '提示!', function() {
				});
				if (websocket != null) {
					websocket.close(3888, '客服下线导致客户退出');
				}
				websocket = null;
			} else if (message.type == 'client_force_leave') {
				// 客服下线
				$.alert('该用户在另一处登陆，你已被强制下线', '提示!', function() {
				});
				if (websocket != null) {
					websocket.close(3889, '该用户在另一处登陆，被强制下线');
				}
				websocket = null;
			} else if (message.type == 'server_close_client') {
				// 客服关闭会话
				$.alert('对方关闭对话', '提示!', function() {
				});
				if (websocket != null) {
					websocket.close(3890, '对方关闭对话');
				}
				websocket = null;
			}
		}
	}
}

function getChat(ignoreCache) {
	$.ajax({
		type : 'get',
		dataType : "json",
		data : {
			serverUser : customer,
			clientUser : clientUser
		},
		url : '/carWeb/external/chat/checkConnectServer.html',
		success : function(data) {
			if (!data.success) {
				$.alert(data.message, '提示!', function() {
				});
			} else {
				// 链接
				$.router.load('chat.php?customer=' + customer + '&clientUser='
						+ clientUser, ignoreCache)
			}
		}
	});
}

function forceOfflineClient() {
	// 检查强制下线用户
	$.ajax({
		type : 'get',
		dataType : "json",
		async : false,
		data : {
			clientUser : clientUser
		},
		url : '/carWeb/external/chat/forceOfflineClient.html'
	});
}

$(document).on('click', '#refresh', function() {
	// 刷新
	$.showPreloader('正在更新...');
	// setTimeout(function() {
	// $.hidePreloader();
	// }, 2000);
	loadServerList();
});

$(document).on('click', '#close', function() {
	// 发送
	if (websocket != null) {
		websocket.close(3666, '用户主动退出');
	}
	websocket = null;
	curCustomer = null;
});

$(document).on('click', '#submit', function() {
	// 发送
	send($('#input').val());
});

function receive(recordFrom, message) {
	var htmlTemplate = "";
	var sendTime = new Date(message.timestamp).format("yyyy-MM-dd hh:mm:ss");
	if (recordFrom == 'self') {
		htmlTemplate = htmlTemplate
				+ '<div class="messages-date">'
				+ sendTime
				+ '</div>'
				+ '<div class="message message-sent message-last message-with-tail message-first">'
				+ '<div class="message-text">' + message.content
				+ '</div></div>';
	} else {
		// 收
		htmlTemplate = htmlTemplate
				+ '<div class="message message-with-avatar message-received message-with-avatar message-last message-with-tail message-first">'
				+ '<div class="messages-date">'
				+ sendTime
				+ '</div>'
				+ '<div class="message-name">'
				+ message.from
				+ '</div>'
				+ '<div class="message-text">'
				+ message.content
				+ '</div>'
				+ '<div style="background-image:url(/carWeb/view/external/chat/img/server.png)" class="message-avatar"></div>'
				+ '</div>';
	}
	$('#chatList').append(htmlTemplate);
	// 底部
	var scroll = $('.native-scroll')[0];
	scroll.scrollTop = scroll.scrollHeight;
}

function send(inputValue, notEscape) {
	var selectedCustomer = getQueryString("customer");
	if (curCustomer != null && selectedCustomer != curCustomer) {
		$.alert('请先退出最近连接的客服!', '提示!', function() {
		});
		return;
	}

	var message = {};
	if (websocket != null) {
		if (inputValue) {
			var content = inputValue;
			if(!notEscape) {
				content = escapeHTML(content);
			}
			content = content.replace(/\n/gi, '<br />');
			message = {
				from : userId,
				content : content,
				timestamp : new Date().getTime(),
				type : 'message'
			};
			websocket.send(JSON.stringify(message));
			receive("self", message);
			$('#input').val('');
		}
	} else {
		$.alert('您已经退出或掉线，无法发送消息', '提示!', function() {
		});
	}
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

// take photo
$(document).on('click', '#take-chat-photo', function() {
	$('#chat-photo').click();
});

// 预览图
function showUploadImage() {
	var modal = $
			.modal({
				title : '预览',
				text : '<span id="showImageProgress"></span>',
				afterText : '<img id="imgView" width="200" height="200" />',
				buttons : [ {
					text : '取消',
					onClick : function() {
						$('#chat-photo').val('');
					}
				}, {
					text : '上传',
					bold : true,
					onClick : function() {
						executeUpload();
					}
				}, ]
			});
}

// 执行上传
function executeUpload() {
	$.showPreloader('正在上传中...');
	$(".div-file-upload")
			.fileUpload(
					{
						"url" : "/carWeb/external/file/uploadFile.html?dirPath=source/upload/chat/",
						"file" : "uploadFile",
						uploadComplete : function(data) {
							setTimeout(function() {
								$.hidePreloader();
							}, 1000);
							$('#chat-photo').val('');
							var sendImageHtml = '<img src="{src}" width="200" height="200" />';
							sendImageHtml = sendImageHtml.replace(/{src}/, data);
							send(sendImageHtml, true);
						}
					});
}

function loadImageFile() {
	var oFReader = new FileReader(), rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
	oFReader.onload = function(oFREvent) {
		$("#imgView")[0].src = oFREvent.target.result;
		$('#showImageProgress').html('加载完成');
	};
	if ($("#chat-photo")[0].files.length === 0) {
		return;
	}
	var oFile = $("#chat-photo")[0].files[0];
	if (!rFilter.test(oFile.type)) {
		alert("请选择图片类型!");
		return;
	}
	$('#showImageProgress').html('正在生成图片预览...');
	oFReader.readAsDataURL(oFile);
}
// 选择图片后，上传图片流程
$(document).on('change', "#chat-photo", function() {
	if ($("#chat-photo")[0].files.length === 0) {
		return;
	}
	showUploadImage();
	loadImageFile();
});

// top
$(document).on('click', '#goto-top', function() {
	var scroll = $('.native-scroll')[0];
	scroll.scrollTop = 0;
});

// 聊天记录模块 开始
$(document).on('click', '#historyChatTab', function() {
	addHistoryChatItems();
});

function addHistoryChatItems() {
	$
			.ajax({
				type : 'get',
				dataType : "json",
				data : {
					serverUser : customer,
					clientUser : clientUser,
					curPage : curPage,
					pageSize : pageSize
				},
				url : '/carWeb/external/chat/getHistoryChatList.html',
				success : function(data) {
					curDataCount = data.total;
					if (data.total > 0) {
						var rows = data.data;
						for (var i = 0; i < rows.length; i++) {
							// 生成新条目的HTML
							var htmlTemplate = "";
							var message = rows[i];
							var sendTime = message.createTime;
							if (message.createUser == clientUser) {
								htmlTemplate = htmlTemplate
										+ '<div class="messages-date">'
										+ sendTime
										+ '</div>'
										+ '<div class="message message-sent message-last message-with-tail message-first">'
										+ '<div class="message-text">'
										+ message.content + '</div></div>';
							} else {
								// 收
								htmlTemplate = htmlTemplate
										+ '<div class="message message-with-avatar message-received message-with-avatar message-last message-with-tail message-first">'
										+ '<div class="messages-date">'
										+ sendTime
										+ '</div>'
										+ '<div class="message-name">'
										+ '客服'
										+ '</div>'
										+ '<div class="message-text">'
										+ message.content
										+ '</div>'
										+ '<div style="background-image:url(/carWeb/view/external/chat/img/server.png)" class="message-avatar"></div>'
										+ '</div>';
							}
							$('#chatHistoryList').append(htmlTemplate);
						}
						curPage = curPage + 1;
					} else {
						$('.infinite-scroll-preloader').remove();
					}
				}
			});

}

// 注册'infinite'事件处理函数
// $(document).on('infinite', '#chat-history-scroll-bottom', function() {
// attachHistoryChatInfinite();
// });
function attachHistoryChatInfinite() {
	// 如果正在加载，则退出
	if (loading)
		return;
	// 设置flag
	loading = true;
	// 模拟1s的加载过程
	setTimeout(function() {
		// 重置加载flag
		loading = false;
		if (curDataCount <= 0) {
			// 加载完毕，则注销无限加载事件，以防不必要的加载
			$.detachInfiniteScroll($('.infinite-scroll'));
			// 删除加载提示符
			$('.infinite-scroll-preloader').remove();
			return;
		}
		// 添加新条目
		addHistoryChatItems();
		// 容器发生改变,如果是js滚动，需要刷新滚动
		$.refreshScroller();
	}, 1000);
}
// 聊天记录模块 结束

window.onbeforeunload = onbeforeunload_handler;
function onbeforeunload_handler() {
	if (websocket != null) {
		websocket.close();
	}
}