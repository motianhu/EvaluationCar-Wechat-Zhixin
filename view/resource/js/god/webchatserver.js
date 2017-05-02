var connectedDataMap = new HashMap();
var unreadMessagesMap = new HashMap();
var curUser = null;

var websocket;
var win;
var output = null;
var onlineUser = null;
var wsConnectCode = -1;

var webPath = window.document.location.href;
var webPathName = window.document.location.pathname;
var webPathPos = webPath.indexOf(webPathName);
// 获取主机地址，如： http://localhost:8080
var webHost = webPath.substring("http://".length, webPathPos);

// var userId = getQueryString("customer");
// 图片处理 开始
var photoProps = {
	imageName : '',
	realWidth : 0,
	realHeight : 0,
	showWidth : 200,
	showHeight : 200,
	isLoaded : false,
	imageDataView : null,
	imageServerHtml : null
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

var escapeHTML = function(text) {
	if (typeof text === 'string') {
		return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g,
				"&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	}
	return text;
};

// 用于展示用户的聊天信息
Ext
		.define(
				'MessageContainer',
				{
					extend : 'Ext.view.View',
					trackOver : true,
					multiSelect : false,
					itemCls : 'l-im-message',
					itemSelector : 'div.l-im-message',
					overItemCls : 'l-im-message-over',
					selectedItemCls : 'l-im-message-selected',
					style : {
						'overflow-y' : 'scroll',
						backgroundColor : '#fff',
						'word-wrap' : 'normal',
						'font-size' : '16px'
					},
					tpl : [
							'<div></div>',
							'<tpl for=".">',
							'<div class="l-im-message">',
							'<div class="l-im-message-header l-im-message-header-{source}">{from}  {timestamp}</div>',
							'<div class="l-im-message-body">{content}</div>',
							'</div>', '</tpl>' ],

					messages : [],

					initComponent : function() {
						var me = this;
						me.messageModel = Ext.define('Leetop.im.MessageModel',
								{
									extend : 'Ext.data.Model',
									fields : [ 'from', 'timestamp', 'content',
											'source' ]
								});
						me.store = Ext.create('Ext.data.Store', {
							model : 'Leetop.im.MessageModel',
							data : me.messages
						});
						me.callParent();
					},

					// 将服务器推送的信息展示到页面中
					receive : function(message) {
						var me = this;
						message['timestamp'] = Ext.Date.format(new Date(
								message['timestamp']), 'Y-m-d H:i:s');
						if (message.from == user) {
							message.source = 'self';
						} else {
							message.source = 'remote';
						}
						me.store.add(message);
						if (me.el.dom) {
							me.el.dom.scrollTop = me.el.dom.scrollHeight;
						}
					}
				});

Ext
		.onReady(function() {
			// 创建用户输入框
			var input = Ext.create('Ext.form.TextArea', {
				region : 'south',
				height : 120,
				enableFont : false,
				enableSourceEdit : false,
				enableAlignments : false,
				enableKeyEvents : true,
				listeners : {
					"keyup" : function(src, e) {
						if (e.ctrlKey === true && e.keyCode == 13) {
							e.preventDefault();
							e.stopPropagation();
							send();
						}
					}
				}
			});

			// 创建消息展示容器
			output = Ext.create('MessageContainer', {
				region : 'center'
			});

			var leftTitle = Ext
					.create(
							'Ext.panel.Panel',
							{
								region : 'west',
								layout : 'border',
								width : '100%',
								height : 30,
								html : '<div class="l-im-message-close"><a href="javascript:closeChat();">关闭<img src="'
										+ requestContextPath
										+ '/view/admin/images/close-chat.png" /></a></div>'
							});
			var rightTitle = Ext.create('Ext.panel.Panel', {
				region : 'east',
				layout : 'border',
				width : 200,
				height : 30
			});

			var titlePanel = Ext.create('Ext.panel.Panel', {
				region : 'north',
				layout : 'border',
				width : 850,
				height : 30,
				items : [ leftTitle, rightTitle ]
			});

			var dialog = Ext.create('Ext.panel.Panel', {
				region : 'center',
				layout : 'border',
				items : [ input, output ],
				buttons : [ {
					text : '图片',
					style : {
						'padding' : '5px 5px 5px 5px'
					},
					iconCls : 'image-icon',
					handler : openUploadImage
				}, {
					text : '发送',
					style : {
						'padding' : '5px 5px 5px 5px'
					},
					iconCls : 'send-msg',
					handler : send
				} ]
			});

			// 初始话WebSocket
			function initWebSocket(showConnect) {
				if (window.WebSocket) {
					websocket = new WebSocket(
							encodeURI("ws://"
									+ webHost
									+ "/"
									+ requestContextPath
									+ "/one/message?usertype=CUSTOMER_OPT_USER&fromuser="
									+ userId));
					websocket.onopen = function() {
						// 连接成功
						win.setTitle(title + '&nbsp;&nbsp;(已连接)');
						wsConnectCode = 1;
						if (showConnect != null) {
							showConnect();
						}
					}
					websocket.onerror = function() {
						// 连接失败
						win.setTitle(title + '&nbsp;&nbsp;(连接发生错误)');
						websocket = null;
						wsConnectCode = -90;
					}
					websocket.onclose = function() {
						// 连接断开
						win.setTitle(title + '&nbsp;&nbsp;(已经断开连接)');
						websocket = null;
						wsConnectCode = -99;
					}
					// 消息接收
					websocket.onmessage = function(message) {
						var message = JSON.parse(message.data);
						// 接收用户发送的消息
						if (message.type == 'message') {
							var from_user = message.from;
							if (curUser != null && curUser == from_user) {
								output.receive(message);
							} else {
								if (!unreadMessagesMap.containsKey(from_user)) {
									var messagesArray = [];
									messagesArray.push(message);
									unreadMessagesMap.put(from_user,
											messagesArray);
								} else {
									var messagesArray = unreadMessagesMap
											.get(from_user);
									messagesArray.push(message);
								}
								// 有消息的图标
								showHasMessage(from_user);
							}

						} else if (message.type == 'get_online_user') {
							// 获取在线用户列表
							var root = onlineUser.getRootNode();
							Ext.each(message.list, function(user) {
								// var exsitnode = root.findChild('id', user);
								// if (exsitnode != null) {
								// continue;
								// }
								var node = root.createNode({
									id : user,
									text : user,
									iconCls : 'user',
									leaf : true
								});
								root.appendChild(node);
							});
						} else if (message.type == 'client_ready_connect') {
							// 用户等待连接
							var root = onlineUser.getRootNode();
							var client_user = message.client_user;
							var exsitnode = root.findChild('id', client_user);
							if (exsitnode != null) {
								return;
							}
							var node = root.createNode({
								id : client_user,
								text : client_user,
								iconCls : 'user',
								leaf : true
							});
							root.appendChild(node);
						} else if (message.type == 'client_user_leave') {
							// 用户下线
							var root = onlineUser.getRootNode();
							var client_user = message.client_user;
							var node = root.findChild('id', client_user);
							if (node != null) {
								root.removeChild(node);
							}

							if (curUser == client_user) {
								var message = {};
								Ext.apply(message, {
									from : '系统消息',
									content : '用户' + curUser
											+ '暂时离开<br /><br /><br /><br />',
									timestamp : new Date().getTime(),
									type : 'message'
								});
								output.receive(message);
								// bak
								var records = [];
								output.store.each(function(r) {
									records.push(r.copy());
								});
								connectedDataMap.put(curUser, records);
								output.store.removeAll();
								win.setTitle('欢迎您：' + user
										+ '&nbsp;&nbsp;(已连接)');
								curUser = null;
							} else {
								var message = {};
								Ext.apply(message, {
									from : '系统消息',
									content : '用户' + client_user
											+ '暂时离开<br /><br /><br /><br />',
									timestamp : new Date().getTime(),
									type : 'message'
								});
								if (unreadMessagesMap.containsKey(client_user)) {
									var messagesArray = unreadMessagesMap
											.get(client_user);
									messagesArray.push(message);
								} else {
									var messagesArray = [];
									messagesArray.push(message);
									unreadMessagesMap.put(client_user,
											messagesArray);
								}
							}

						}
					}
				}
			}
			// 新消息提示
			function showHasMessage(client_user) {
				var root = onlineUser.getRootNode();
				var node = root.findChild('id', client_user);
				if (node != null) {
					node.remove();
					var newnode = root.createNode({
						id : client_user,
						text : client_user,
						iconCls : 'user-message',
						leaf : true
					});
					root.insertChild(0, newnode);
				}
			}
			// 已读
			function hadReadMessage(client_user) {
				root = onlineUser.getRootNode();
				node = root.findChild('id', client_user);
				if (node != null) {
					node.remove();
					var newnode = root.createNode({
						id : client_user,
						text : client_user,
						iconCls : 'user',
						leaf : true
					});
					root.insertChild(0, newnode);
				}
			}
			// 在线用户树
			var serverManage = new Ext.panel.Panel({
				layout : 'border',
				region : 'north',
				title : '服务管理',
				width : 180,
				height : 60,
				buttons : [ {
					text : '重连',
					style : {
						'padding' : '5px 5px 5px 5px'
					},
					iconCls : 'reconnect-server',
					handler : reConnectServer
				}, {
					text : '系统退出',
					style : {
						'padding' : '5px 5px 5px 5px'
					},
					iconCls : 'shutdown-server',
					handler : exitServer
				} ]

			});
			// 在线用户树
			onlineUser = new Ext.tree.Panel({
				title : '在线用户',
				rootVisible : false,
				layout : 'border',
				region : 'north',
				width : 150,
				height : 580,
				lines : false,
				useArrows : true,
				autoScroll : true,
				split : true,
				iconCls : 'user-online',
				store : Ext.create('Ext.data.TreeStore', {
					root : {
						text : '等待中用户',
						expanded : true,
						children : []
					}
				})
			});

			onlineUser
					.on({
						// 目录树双击事件
						'itemdblclick' : function(view, rcd, item, idx, event,
								eOpts) {
							var dirid = rcd.get('id'); // 节点id
							win.setTitle('正在与 ' + dirid + ' 对话中');
							var message = {
								client_user : dirid,
								timestamp : new Date().getTime(),
								type : 'select_connect_user'
							};
							websocket.send(JSON.stringify(message));

							if (curUser != null) {
								// bak
								var records = [];
								output.store.each(function(r) {
									records.push(r.copy());
								});
								connectedDataMap.put(curUser, records);
								output.store.removeAll();
							}

							curUser = dirid;
							// 设置图标已读
							hadReadMessage(curUser);
							// get cache
							if (connectedDataMap.containsKey(dirid)) {
								var records = connectedDataMap.get(dirid);
								output.store.add(records);
								if (output.el.dom) {
									output.el.dom.scrollTop = output.el.dom.scrollHeight;
								}
							}

							// get unread message
							if (unreadMessagesMap.containsKey(dirid)) {
								var messagesArray = unreadMessagesMap
										.get(dirid);
								for (var i = 0; i < messagesArray.length; i++) {
									output.receive(messagesArray[i]);
								}
								unreadMessagesMap.remove(dirid);
								if (output.el.dom) {
									output.el.dom.scrollTop = output.el.dom.scrollHeight;
								}
							}
						}
					});

			var usePanels = Ext.create('Ext.panel.Panel', {
				width : 200,
				height : 600,
				layout : 'border',
				region : 'east',
				items : [ serverManage, onlineUser ],
				border : false
			});

			var title = '欢迎您：' + user;
			// 展示窗口
			win = Ext.create('Ext.window.Window', {
				title : title + '&nbsp;&nbsp;(未连接)',
				layout : 'border',
				iconCls : 'user-win',
				minWidth : 850,
				minHeight : 660,
				width : 850,
				animateTarget : 'websocket_button',
				height : 660,
				items : [ titlePanel, dialog, usePanels ],
				border : false,
				listeners : {
					render : function() {
						initWebSocket();
					}
				}
			});

			win.show();

			// 发送消息
			function send() {
				if (curUser == null) {
					Ext.Msg.alert('提示', '请选择对话的用户!');
					return;
				}
				var message = {};
				if (websocket != null) {
					if (input.getValue()) {
						var content = input.getValue();
						content = escapeHTML(content);
						content = content.replace(/\n/gi, '<br />');
						Ext.apply(message, {
							from : user,
							content : content,
							timestamp : new Date().getTime(),
							type : 'message'
						});
						websocket.send(JSON.stringify(message));
						output.receive(message);
						input.setValue('');
					}
				} else {
					Ext.Msg.alert('提示', '您已经掉线，无法发送消息!');
				}
			}
			// 发送图片
			function sendImage(imageFile) {
				if (curUser == null) {
					Ext.Msg.alert('提示', '请选择对话的用户!');
					return;
				}
				var message = {};
				if (websocket != null) {
					if (imageFile) {
						var sendImageHtml = '<a href="#" onclick="showImageView(this)" class="show-image-view"><img src="{src}" width="{width}" height="{height}" /></a>';
						sendImageHtml = sendImageHtml.replace(/{src}/,
								imageFile).replace(/{width}/,
								photoProps.showWidth).replace(/{height}/,
								photoProps.showHeight);
						Ext.apply(message, {
							from : user,
							content : sendImageHtml,
							timestamp : new Date().getTime(),
							type : 'message'
						});
						websocket.send(JSON.stringify(message));
						output.receive(message);
					}
				} else {
					Ext.Msg.alert('提示', '您已经掉线，无法发送消息!');
				}
			}
			// 重连
			function reConnectServer() {
				if (websocket == null) {
					curUser = null;
					initWebSocket(showConnect);
				}
			}
			// 提示连接情况
			function showConnect() {
				if (wsConnectCode == 1) {
					Ext.Msg.alert('系统提示', '连接成功！');
				} else {
					Ext.Msg.alert('系统提示', '连接失败，请检查网络是否联通或者账号是否已登录！');
				}
			}

			// 退出服务
			function exitServer() {
				Ext.Msg.confirm('系统提示', '是否退出服务？ 将导致无法接收数据和丢失数据。',
						function(btn) {
							if (btn == 'yes') {
								var message = {
									timestamp : new Date().getTime(),
									type : 'server_exit'
								};
								websocket.send(JSON.stringify(message));
								websocket.close(3666, '用户主动退出');

								removeChildrenRecursively(onlineUser
										.getRootNode());
								output.store.removeAll();
							}
						});
			}
			// 清理树节点
			function removeChildrenRecursively(node) {
				if (!node)
					return;
				while (node.hasChildNodes()) {
					removeChildrenRecursively(node.firstChild);
					node.removeChild(node.firstChild);
				}
			}

			function openUploadImage() {
				if (curUser == null) {
					Ext.Msg.alert('提示', '请选择对话的用户!');
					return;
				}
				// 上传图片模块 - 开始
				var img_reg = /\.([jJ][pP][gG]){1}$|\.([jJ][pP][eE][gG]){1}$|\.([gG][iI][fF]){1}$|\.([pP][nN][gG]){1}$|\.([bB][mM][pP]){1}$/;
				var win_uploadImage = new Ext.Window(
						{
							layout : 'fit',
							width : 380,
							closeAction : 'close',
							height : 380,
							resizable : false,
							shadow : false,
							modal : true,
							closable : true,
							bodyStyle : 'padding: 5 5 5 5',
							animCollapse : true,
							imageIndexName : 'idx_CheckPic1',
							items : [ {
								xtype : 'form',
								id : 'image-upload-form',
								frame : true,
								border : false,
								isAdd : false,
								enctype : 'multipart/form-data',
								fileUpload : true,
								layout : 'form',
								items : [
										{
											id : 'file-idx',
											name : 'uploadFile',
											inputType : "file",
											fieldLabel : '图片',
											xtype : 'textfield',
											blankText : '上传图片不能为空',
											anchor : '100%',
											listeners : {
												'change' : function() {
													// 得到选择的图片路径
													var url = 'file://'
															+ Ext
																	.getCmp('file-idx').value;
													// 是否是规定的图片类型
													if (img_reg.test(url)) {
														loadImageFile();
													}
												}

											},
										},
										{
											xtype : 'box',
											id : 'imageBrowse',
											fieldLabel : "预览图片",
											autoEl : {
												width : 300,
												height : 300,
												tag : 'img',
												src : Ext.BLANK_IMAGE_URL,
												style : 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);',
											}
										} ],
								buttons : [
										{
											text : '关闭',
											handler : function() {
												win_uploadImage.destroy();
											}
										},
										{
											text : '上传',
											handler : function() {
												var furl = "";
												furl = Ext
														.getCmp('image-upload-form').form
														.findField('uploadFile')
														.getValue();
												var type = furl.substring(
														furl.length - 3)
														.toLowerCase();
												if (furl == "" || furl == null) {
													return;
												}
												if (type != 'jpg'
														&& type != 'bmp'
														&& type != 'gif'
														&& type != 'png') {
													Ext.Msg
															.alert('提示',
																	'仅支持jpg、bmp、gif、png格式的图片!');
													return;
												}

												Ext.getCmp('image-upload-form').form
														.submit({
															clienValidation : true,
															waitMsg : '正在上传请稍候',
															waitTitle : '提示',
															url : '/carWeb/external/file/uploadExtjsFile.html?dirPath=source/upload/chat/',
															method : 'POST',
															type : 'text',
															success : function(
																	form,
																	action) {
																var picName = action.result.object;
																sendImage(picName);
																Ext
																		.getCmp(
																				'imageBrowse')
																		.getEl().dom.src = '';
																win_uploadImage
																		.destroy();
															},
															failure : function(
																	form,
																	action) {
																Ext.MessageBox
																		.show({
																			title : '失败',
																			msg : '上传失败!',
																			buttons : Ext.MessageBox.OK,
																			icon : Ext.MessageBox.ERROR
																		});
															}
														});
											}
										} ]
							} ]
						});
				win_uploadImage.setTitle("上传图片(建议2M以内)");
				win_uploadImage.show();
			}

			function loadImageFile() {
				var oFReader = new FileReader(), rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
				oFReader.onload = function(oFREvent) {
					Ext.getCmp('imageBrowse').getEl().dom.src = oFREvent.target.result;

					var img = new Image;
					img.src = oFREvent.target.result;
					img.onload = function() {
						photoProps.realWidth = img.width;
						photoProps.realHeight = img.height;
						if (photoProps.realWidth > 200
								|| photoProps.realHeight > 200) {
							if (photoProps.realWidth > photoProps.realHeight) {
								photoProps.showWidth = 200;
								photoProps.showHeight = Math
										.round((200 * photoProps.realHeight)
												/ photoProps.realWidth);
							} else {
								photoProps.showHeight = 200;
								photoProps.showWidth = Math
										.round((200 * photoProps.realWidth)
												/ photoProps.realHeight);
							}
						} else {
							photoProps.showWidth = photoProps.realWidth;
							photoProps.showHeight = photoProps.realHeight;
						}
						photoProps.imageDataView = oFREvent.target.result;
						photoProps.isLoaded = true;
					}
				};
				var fileIdx = Ext.getDom('file-idx');
				var imageInput = fileIdx.querySelector('input');
				oFReader.readAsDataURL(imageInput.files[0]);
			}
		});

function showImageView(e) {
	var img = e.childNodes[0];
	var imageWin = new Ext.Window({
		title : '图片',
		layout : 'fit', // 弹出窗口内布局会充满整个窗口;
		width : 800,
		height : 600,
		modal : true,
		bodyStyle : 'overflow-x:scroll; overflow-y:scroll',
		closeAction : 'close', // 点击右上角关闭按钮后会执行的操作;
		closable : true, // 隐藏关闭按钮;
		draggable : true,
		html : '<img src="' + img.src + '"/>',
		buttons : [ {
			text : '关闭',
			style : {
				'padding' : '5px 5px 5px 5px'
			},
			handler : closeImageWindow
		} ]
	});
	function closeImageWindow() {
		imageWin.close();
	}
	imageWin.show();
}

// 关闭会话
function closeChat() {
	if (curUser == null) {
		return;
	}
	Ext.Msg.confirm('系统提示', '是否关闭与 ' + curUser + ' 的会话？', function(btn) {
		if (btn == 'yes') {
			win.setTitle('欢迎您：' + user + '&nbsp;&nbsp;(已连接)');
			var message = {
				client_user : curUser,
				timestamp : new Date().getTime(),
				type : 'server_close_client'
			};
			websocket.send(JSON.stringify(message));

			if (curUser != null) {
				// bak
				var records = [];
				output.store.each(function(r) {
					records.push(r.copy());
				});
				connectedDataMap.put(curUser, records);
				output.store.removeAll();
			}

			var root = onlineUser.getRootNode();
			var node = root.findChild('id', curUser);
			if (node != null) {
				node.remove();
			}

			curUser = null;
		}

	}, this);
}
