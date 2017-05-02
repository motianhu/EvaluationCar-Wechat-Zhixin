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

var userId = getQueryString("customer");

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
		closeAction : 'show', // 点击右上角关闭按钮后会执行的操作;
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
