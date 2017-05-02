var emojiNames = [ '微笑', '撇嘴', '色色', '鼻涕', '悲哭', '害羞', '闭嘴', '瞌睡', '流泪', '尴尬',
		'大怒', '舌头', '呵呵', '惊讶', '不开心', '冒汗', '抓狂', '吐', '偷笑', '脸红', '白眼',
		'不高兴', '好吃', '困', '惶恐', '无语', '吼吼', '大兵', '奋斗', '咒骂', '问号', '嘘', '晕',
		'大抓狂', '衰', '锤子', '拜拜', '拭汗', '抠鼻', '好糗', '坏笑', '左哼', '右哼', '哈欠', '鄙视',
		'哭泣', '委屈', '邪恶', '亲亲', '吓', '可怜', '抱抱', '月亮', '太阳', '炸弹', '骷髅', '菜刀',
		'猪头', '西瓜', '咖啡', '米饭', '心', '强', '弱', '握手', '耶', '抱拳', '勾引', 'OK',
		'NO', '花朵', '凋谢', '香吻', '亲嘴', '飞吻' ];
var emojiImages = [ '1.gif', '2.gif', '3.gif', '4.gif', '5.gif', '6.gif',
		'7.gif', '8.gif', '9.gif', '10.gif', '11.gif', '12.gif', '13.gif',
		'14.gif', '15.gif', '16.gif', '17.gif', '18.gif', '19.gif', '20.gif',
		'21.gif', '22.gif', '23.gif', '24.gif', '25.gif', '26.gif', '27.gif',
		'28.gif', '29.gif', '30.gif', '31.gif', '32.gif', '33.gif', '34.gif',
		'35.gif', '36.gif', '37.gif', '38.gif', '39.gif', '40.gif', '41.gif',
		'42.gif', '43.gif', '44.gif', '45.gif', '46.gif', '47.gif', '48.gif',
		'49.gif', '50.gif', '51.gif', '52.gif', '53.gif', '54.gif', '55.gif',
		'56.gif', '57.gif', '58.gif', '59.gif', '60.gif', '61.gif', '62.gif',
		'63.gif', '64.gif', '65.gif', '66.gif', '67.gif', '68.gif', '69.gif',
		'70.gif', '71.gif', '72.gif', '73.gif', '74.gif', '75.gif' ];

var emojiMap = new HashMap();

initEmojis();
function initEmojis() {
	for (var i = 0; i < emojiNames.length; i++) {
		emojiMap.put('[' + emojiNames[i] + ']', emojiImages[i]);
	}
}

function createEmojiItem(imageName, imageFile) {
	var emojiItemHtml = '<div class="chat-emoji-item"><a class="emoji-image" title="{title}" href="#"><img src="emojiImg/{image}" /></a></div>';
	emojiItemHtml = emojiItemHtml.replace(/{title}/, imageName).replace(
			/{image}/, imageFile);
	return emojiItemHtml;
}

// 4*5 共4页
function createEmojiBox() {
	var html = '	<div id="chat-face-container" class="swiper-container" data-space-between="10">'
			+ '<div id="chat-emoji-list" class="swiper-wrapper" style="height:120px;">';
	for (var i = 0; i < 4; i++) {
		html = html + '<div class="swiper-slide">';
		for (var j = 0; j < 4; j++) {
			html = html + '<div class="chat-emoji-box">';
			for (var k = 0; k < 5; k++) {
				if (i * 20 + j * 5 + k >= emojiNames.length) {
					break;
				}
				html = html
						+ createEmojiItem(emojiNames[i * 20 + j * 5 + k],
								emojiImages[i * 20 + j * 5 + k]);
			}
			html = html + '</div>';
		}
		html = html + '</div>';
	}
	html = html + '</div><div class="swiper-pagination"></div></div>';
	return html;
}

// 语义转译
function decodeWords(words) {
	var newWords = '';
	var emojiWord = '';
	var startEmoji = -1, endEmoji = -1;
	var checkLeft = -1, checkRight = -1;
	for (var i = 0; i < words.length; i++) {
		if (words[i] == '[') {
			emojiWord = '[';
			startEmoji = i;
			// 预判断
			for (var s = 1; s < 6; s++) {
				if (words[i + s] == '[') {
					checkLeft = i + s;
					break;
				}
			}
			for (var s = 1; s < 6; s++) {
				if (words[i + s] == ']') {
					checkRight = i + s;
					break;
				}
			}
			if (checkLeft > 0 && (checkRight == -1 || checkLeft < checkRight)) {
				newWords = newWords + emojiWord;
				startEmoji = -1;
				endEmoji = -1;
				emojiWord = '';
				checkLeft = -1;
				checkRight = -1;
				continue;
			}
			checkLeft = -1;
			checkRight = -1;

			for (var s = 1; s < 6; s++) {
				i++;
				if (i >= words.length) {
					break;
				}
				emojiWord = emojiWord + words[i];
				if (words[i] == ']') {
					endEmoji = i;
					break;
				}
			}
			if (startEmoji >= 0 && endEmoji > 0 && emojiWord.length > 2) {
				if (emojiMap.containsKey(emojiWord)) {
					newWords = newWords
							+ '<img src="/carWeb/view/external/chat/emojiImg/'
							+ emojiMap.get(emojiWord) + '" />';
				} else {
					newWords = newWords + emojiWord;
				}
			} else {
				newWords = newWords + emojiWord;
				startEmoji = -1;
				endEmoji = -1;
				emojiWord = '';
			}
		} else {
			newWords = newWords + words[i];
		}
	}
	return newWords;
}