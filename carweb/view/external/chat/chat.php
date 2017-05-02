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
			<!-- Floatin Action Button -->
			<a href="#" id="goto-top" class="floating-button-top"> <img
				src="img/i-form-go-top.png" />
			</a>
			<header class="bar bar-nav">
				<a id="close" class="button button-link button-nav pull-left" href="#">
					<span class="icon icon-left"></span> 退出
				</a>
				<h1 id="chatServerUser" class="title">聊天</h1>
			</header>
			<div class="content native-scroll">
				<!--  图片显示区域 -->
				<div class="imgzoom_pack">
					<div class="imgzoom_x">x</div>
					<div class="imgzoom_img">
						<img src="" />
					</div>
				</div>
				<div class="buttons-tab">
					<a href="#tab1" class="tab-link active button">对话</a> <a
						href="#tab2" id="historyChatTab" class="tab-link button">聊天记录</a>
				</div>
				<div class="tabs">
					<div id="tab1" class="tab active">
						<div class="messages-content">
							<div id='chatList' class="messages"></div>
						</div>

						<div class="card-content">
							<div class="card-content-inner">
								<div class="row">
								<div class="col-80">
									<div class="chat-item-input">
										<textarea id="input" class="chat-textarea"></textarea>
									</div>
								</div>
								<div class="col-20">
										<a href="#" id="submit"
													class="button button-big button-fill button-success">发送</a>
								</div>
								</div>
							</div>
						</div>
						<!-- 发送模块 -->
						<div>
							<div class="card-content">
								<div class="card-content-inner">
									<div class="content-block">
										<div class="row">
										<!-- Slider -->
										<div id="chat-face-container" class="swiper-container" data-space-between="10">
											<div id="chat-emoji-list" class="swiper-wrapper" style="height:120px;">
												<div class="swiper-slide">
													<div class="tool-kit-item div-file-upload">
														<form enctype="multipart/form-data" method="post">
															<div class="chat-photo-item file-beauty">
																<em></em><input type="file"
																	class="input-file-view chat-photo-view fileToUpload"
																	accept="image/*;capture=camera" id="chat-photo"
																	name="chat-photo" />
															</div>
														</form>
														<div class="thumb"></div>
													</div>
													<div class="tool-kit-item icon icon-form-emoji">
													</div>
												</div>
												<div class="swiper-slide"><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="微笑" href="#"><img src="emojiImg/1.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="撇嘴" href="#"><img src="emojiImg/2.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="色色" href="#"><img src="emojiImg/3.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="鼻涕" href="#"><img src="emojiImg/4.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="悲哭" href="#"><img src="emojiImg/5.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="害羞" href="#"><img src="emojiImg/6.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="闭嘴" href="#"><img src="emojiImg/7.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="瞌睡" href="#"><img src="emojiImg/8.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="流泪" href="#"><img src="emojiImg/9.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="尴尬" href="#"><img src="emojiImg/10.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="大怒" href="#"><img src="emojiImg/11.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="舌头" href="#"><img src="emojiImg/12.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="呵呵" href="#"><img src="emojiImg/13.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="惊讶" href="#"><img src="emojiImg/14.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="不开心" href="#"><img src="emojiImg/15.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="冒汗" href="#"><img src="emojiImg/16.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="抓狂" href="#"><img src="emojiImg/17.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="吐" href="#"><img src="emojiImg/18.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="偷笑" href="#"><img src="emojiImg/19.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="脸红" href="#"><img src="emojiImg/20.gif" /></a></div></div></div><div class="swiper-slide"><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="白眼" href="#"><img src="emojiImg/21.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="不高兴" href="#"><img src="emojiImg/22.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="好吃" href="#"><img src="emojiImg/23.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="困" href="#"><img src="emojiImg/24.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="惶恐" href="#"><img src="emojiImg/25.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="无语" href="#"><img src="emojiImg/26.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="吼吼" href="#"><img src="emojiImg/27.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="大兵" href="#"><img src="emojiImg/28.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="奋斗" href="#"><img src="emojiImg/29.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="咒骂" href="#"><img src="emojiImg/30.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="问号" href="#"><img src="emojiImg/31.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="嘘" href="#"><img src="emojiImg/32.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="晕" href="#"><img src="emojiImg/33.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="大抓狂" href="#"><img src="emojiImg/34.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="衰" href="#"><img src="emojiImg/35.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="锤子" href="#"><img src="emojiImg/36.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="拜拜" href="#"><img src="emojiImg/37.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="拭汗" href="#"><img src="emojiImg/38.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="抠鼻" href="#"><img src="emojiImg/39.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="好糗" href="#"><img src="emojiImg/40.gif" /></a></div></div></div><div class="swiper-slide"><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="坏笑" href="#"><img src="emojiImg/41.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="左哼" href="#"><img src="emojiImg/42.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="右哼" href="#"><img src="emojiImg/43.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="哈欠" href="#"><img src="emojiImg/44.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="鄙视" href="#"><img src="emojiImg/45.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="哭泣" href="#"><img src="emojiImg/46.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="委屈" href="#"><img src="emojiImg/47.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="邪恶" href="#"><img src="emojiImg/48.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="亲亲" href="#"><img src="emojiImg/49.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="吓" href="#"><img src="emojiImg/50.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="可怜" href="#"><img src="emojiImg/51.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="抱抱" href="#"><img src="emojiImg/52.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="月亮" href="#"><img src="emojiImg/53.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="太阳" href="#"><img src="emojiImg/54.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="炸弹" href="#"><img src="emojiImg/55.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="骷髅" href="#"><img src="emojiImg/56.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="菜刀" href="#"><img src="emojiImg/57.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="猪头" href="#"><img src="emojiImg/58.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="西瓜" href="#"><img src="emojiImg/59.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="咖啡" href="#"><img src="emojiImg/60.gif" /></a></div></div></div><div class="swiper-slide"><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="米饭" href="#"><img src="emojiImg/61.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="心" href="#"><img src="emojiImg/62.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="强" href="#"><img src="emojiImg/63.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="弱" href="#"><img src="emojiImg/64.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="握手" href="#"><img src="emojiImg/65.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="耶" href="#"><img src="emojiImg/66.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="抱拳" href="#"><img src="emojiImg/67.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="勾引" href="#"><img src="emojiImg/68.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="OK" href="#"><img src="emojiImg/69.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="NO" href="#"><img src="emojiImg/70.gif" /></a></div></div><div class="chat-emoji-box"><div class="chat-emoji-item"><a class="emoji-image" title="花朵" href="#"><img src="emojiImg/71.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="凋谢" href="#"><img src="emojiImg/72.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="香吻" href="#"><img src="emojiImg/73.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="亲嘴" href="#"><img src="emojiImg/74.gif" /></a></div><div class="chat-emoji-item"><a class="emoji-image" title="飞吻" href="#"><img src="emojiImg/75.gif" /></a></div></div><div class="chat-emoji-box"></div></div>
											</div>
											<div class="swiper-pagination"></div></div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="chat-blank-buttom"></div>
					</div>
					<div id="tab2" class="tab">
						<div id="chat-history-scroll-bottom" class="infinite-scroll"
							data-distance="100">
							<div class="chat-refresh">
								<a href="#" id="history-refresh"><i class="icon icon-form-refresh"></i></a>
							</div>
							<div class="messages-content">
								<div id='chatHistoryList' class="messages"></div>
							</div>
							<!-- 加载提示符 -->
							<div class="infinite-scroll-preloader">
								<div class="preloader"></div>
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