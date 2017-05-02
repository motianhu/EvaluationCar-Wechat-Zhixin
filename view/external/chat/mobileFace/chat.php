<html class="pixel-ratio-1">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge"></meta>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
<meta charset="utf-8"></meta>
<meta http-equiv="X-UA-Compatible" content="IE=edge"></meta>
<meta name="author" content="thinking"></meta>
<meta name="viewport" content="initial-scale=1, maximum-scale=1"></meta>
<meta name="apple-mobile-web-app-capable" content="yes"></meta>
<meta name="apple-mobile-web-app-status-bar-style" content="black"></meta>
<meta name="format-detection" content="telephone=no"></meta>
<title>聊天</title>
<!-- Google Web Fonts -->


<link rel="stylesheet"
	href="/carWeb/view/resource/mobile/css/sm.min.css" />
<link rel="stylesheet"
	href="/carWeb/view/resource/mobile/css/sm-extend.css" />
<link rel="stylesheet" href="/carWeb/view/external/chat/css/chat.css" />


</head>
<body>
	<div class="page-group">
		<div id="chat" class="page page-current">
			<header class="bar bar-nav">
				<h1 id="chatServerUser" class="title">聊天</h1>
			</header>
			<div class="content native-scroll">
				<div id='chatList'></div>

				<div class="card">
					<div class="card-content">
						<div class="card-content-inner">
							<div class="chat-item-input">
								<textarea id="input" class="chat-textarea"></textarea>
								<p><span class="emotion">表情:)</span></p>
							</div>
						</div>
					</div>
				</div>

				<div class="card">
					<div class="card-content">
						<div class="card-content-inner">
							<div class="content-block">
								<div class="row">
									<div class="col-50">
										<a href="#" id="close"
											class="button button-big button-fill button-danger">退出</a>
									</div>
									<div class="col-50">
										<a href="#" id="submit"
											class="button button-big button-fill button-success">发送</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
	
	<script src="/carWeb/view/resource/mobile/js/zepto.min.js"></script>
	<script src="/carWeb/view/external/chat/js/config.js"></script>
	<script src="/carWeb/view/resource/mobile/js/sm.min.js"></script>
	<script src="/carWeb/view/resource/mobile/js/sm-extend.min.js"></script>
	<script src="/carWeb/view/resource/mobile/js/sm-city-picker.min.js"></script>

</body>
</html>