(function($, window) {
	$(".nav > ul > li").bind({
		"mouseover": function(e) {
			var $this = $(this);
			$this.find(".dropdown").show();
		},
		"mouseout": function(e) {
			var $this = $(this);
			$this.find(".dropdown").hide();
		}
	});
	var ids = [];


    var $document = $(document);

    //页面滚动条事件
    $document.scroll( function () {
        var dScrollTop = $document.scrollTop(); //滚动条距离顶部距离
        if (dScrollTop > 50) {
            $("#topnav").hide(100);
        }else{
            $("#topnav").show(100);
        }
    });
})(jQuery, window);