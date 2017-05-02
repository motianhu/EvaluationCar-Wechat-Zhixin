function qqemotion() {
	$('.emotion').qqFace({
		id : 'facebox',
		assign : 'input',
		path : 'mobileFace/arclist/' // 表情存放的路径
	});
}

// 查看结果
function replace_em(str) {
	str = str.replace(/\</g, '&lt;');
	str = str.replace(/\>/g, '&gt;');
	str = str.replace(/\n/g, '<br/>');
	str = str.replace(/\[em_([0-9]*)\]/g,
			'<img src="mobileFace/arclist/$1.gif" border="0" />');
	return str;
}