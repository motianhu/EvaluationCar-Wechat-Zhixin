<!-- saved from url=(0034)http://m.sui.taobao.org/demos/list -->
<html class="pixel-ratio-1">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
<meta charset="utf-8"></meta>
<meta http-equiv="X-UA-Compatible" content="IE=edge"></meta>
<meta name="author" content="thinking"></meta>
<meta name="viewport" content="initial-scale=1, maximum-scale=1"></meta>
<meta name="apple-mobile-web-app-capable" content="yes"></meta>
<meta name="apple-mobile-web-app-status-bar-style" content="black"></meta>
<meta name="format-detection" content="telephone=no"></meta>
<title>聊天列表</title>

<link rel="stylesheet"
	href="/carWeb/view/resource/mobile/css/sm.min.css" />
<link rel="stylesheet"
	href="/carWeb/view/resource/mobile/css/sm-extend.css" />
<link rel="stylesheet" href="/carWeb/view/external/chat/css/chat.css" />

</head>
<body>
	<div class="page-group">
		<div id="chatlist" class="page page-current">
			<header class="bar bar-nav">
				<a class="button button-link button-nav pull-left back" href="#">
					<span class="icon icon-left"></span> 返回
				</a>
				<h1 class="title">客服列表</h1>
			</header>
			<div class="content native-scroll">
				<div class="content-block-title">最近联系客服：</div>
				<div class="list-block">
					<ul id="recentlyServer">
					</ul>
				</div>
				<div class="content-block-title">当前在线客服：</div>
				<div class="list-block">
					<ul id="serverList">
					</ul>
				</div>
			</div>

		</div>

	</div>
	<script src="/carWeb/view/resource/mobile/js/zepto.min.js"></script>
	<script src="/carWeb/view/external/chat/js/config.js"></script>
	<script src="/carWeb/view/resource/mobile/js/sm.min.js"></script>
	<script src="/carWeb/view/resource/mobile/js/sm-extend.min.js"></script>
	<script src="/carWeb/view/resource/mobile/js/sm-city-picker.min.js"></script>

	<!-- web chat 引入相关脚本 -->
	<script src="/carWeb/view/resource/websocket/sockjs-0.3.4.min.js"
		type="text/javascript"></script>
	<script src="/carWeb/view/resource/websocket/stomp.js"
		type="text/javascript"></script>
	<script src="/carWeb/view/resource/js/god/webchatmobile.js"
		type="text/javascript"></script>
		
	<script type="text/javascript" src="mobileFace/js/jquery.min.js"></script>
	<script type="text/javascript" src="mobileFace/js/jquery-browser.js"></script>
	<script type="text/javascript" src="mobileFace/js/jquery.qqFace.js"></script>
	<script type="text/javascript" src="mobileFace/js/mobileFace.js"></script>
	
</body>
</html>