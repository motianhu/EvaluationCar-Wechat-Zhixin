$(function() {
	
	var $domContainer = $("#dom_container");//左侧布局区域
	var $tabContent = $("#select_tab_content");//右侧控件选择区域
	
	var $searchBox = $(".searchbox", $domContainer);
	var $btnBox = $(".btnbox", $domContainer);
	var $tableBox = $(".tablebox", $domContainer);
	var containerQueryItem = '<div class="container-item">{0}</div>'; //搜索区域的查询条件容器
	var sTableCheck = '<th style="width: 20px;" data-noresize><i class="table-check-empty thead"></i></th>';

	var $searchWidgetPropPopover = $("#search_prop_popover");
	var $tablePropPopover = $("#table_prop_popover");

	//为每一个选择类型的子li增加type，用于后面拖拽时判断type转移html
	$("#inputs_tab > ul >li").data("type", "input");
	$("#selects_tab > ul >li").data("type", "select");
	$("#buttons_tab > ul >li").data("type", "button");
	$("#tables_tab > ul >li").data("type", "table");

	//模式对应的操作
	$("#page_preview").click(function() {
		$("#style_for_preview").html("#dom_container .label-for-input{display:none}"); //添加css隐藏标签
		//正则去掉没有的label标签，去掉jqueryui的拖拽class，去掉select生成的button
		console.log($domContainer.html().replace(/<label[^>]+>(.*?)<\/label>|\sui-sortable|\sui-droppable/g, "").replace(/<button[^>]*class="ui-multiselect("|\s)[^>]*>.*?<\/button>/g ,""));
	});
	$("#page_editview").click(function() {
		$("#style_for_preview").html("");
		console.log($domContainer.html().replace(/<button[^>]*class="ui-multiselect("|\s)[^>]*>.*?<\/button>/g ,"")
											.replace(/contenteditable="true"/g, ""));
	});

	//查询条件区域右键菜单展示
	$searchBox.on("contextmenu", ".container-query", function(e) {
		e.preventDefault();

		var $this = $(this);
		$this.addClass("query-edit");
		$searchWidgetPropPopover.css({
			"top":  $this.offset().top + 30,
			"left": $this.offset().left
		}).show(); //详细的再计算
	});
	
	//表格右键菜单展示
	$tableBox.on("contextmenu", ".jq_table", function(e){
		e.preventDefault();
		
		var $this = $(this);
		$tablePropPopover.css({
			"top":  $this.offset().top + 50,
			"left": $this.offset().left
		}).show();
	});
	
	//布局区域条目可拖拽
	$(".container-item", $domContainer).draggable({
		revert: "invalid",
		containment: "document",
		cursor: "move"
	});

	// 各组件的容器拖拽
	$("li.list-group-item", $tabContent).draggable({
		revert: "invalid",
		containment: "document",
		helper: "clone",
		cursor: "move"
	});
	
	//拖拽排序功能
	$searchBox.sortable({
		revert: true
	}); 
	$btnBox.sortable({
		revert: true
	});
//	$tableBox.sortable({ //因为拖拽影响编辑
//		revert: true
//	});
	
	//移除修改控件
	$tabContent.droppable({
		accept: "#dom_container .container-item",
		drop: function(event, ui){

			ui.draggable.remove();
		}
	});

	// 接受拖拽放下來
	$searchBox.droppable({
		accept: "#select_tab_content li.list-group-item",
		activeClass: "selectdom-highlight",
		drop: function(event, ui) {
			var $this = $(this);
			var labelReg = /<label[^>]+>(.*?)<\/label>/;
			var buttonReg = /<button[^>]+>(.*?)<\/button>/;
			var displayNoneReg = /style(\s*)=(\s*)"(\s*)display(\s*):(\s*)none;"/;
			var curDom = ui.draggable.html();

			// var curDom = ui.draggable.html().replace(/<label[^>]+>(.*?)<\/label>/, "");
			var domType = ui.draggable.data("type");
			switch (domType) {
				case "input":
					var $temp = $(containerQueryItem.replace("{0}", curDom));
					$temp.addClass("container-query");
					$this.append($temp);
					break;
				case "select":
					var $temp = $(containerQueryItem.replace("{0}", curDom.replace(buttonReg, "").replace(displayNoneReg, "")));
					$temp.addClass("container-query");
					$this.append($temp);
					$temp.find("select").initMultiSelect();
					break;
				case "button":
					var $temp = $(containerQueryItem.replace("{0}", curDom));
					$temp.find("button").attr("contenteditable", true);
					$this.append($temp);
					break;
				default:
					break;
			}
		}
	});

	// 接受拖拽放下來
	$btnBox.droppable({
		accept: "#select_tab_content li.list-group-item",
		activeClass: "selectdom-highlight",
		drop: function(event, ui) {
			var $this = $(this);
			var curDom = ui.draggable.html();
			var domType = ui.draggable.data("type");
			switch (domType) {
				case "button":
					var $temp = $(containerQueryItem.replace("{0}", curDom));
					$temp.find("button").attr("contenteditable", true);
					$this.append($temp);
					break;
				default:
					return false; //只接受button类型的东西
					break;
			}
		}
	});
	// 接受拖拽放下來
	$tableBox.droppable({
		accept: "#select_tab_content li.list-group-item",
		activeClass: "selectdom-highlight",
		drop: function(event, ui) {
			var $this = $(this);
			var $containerItem = $this.find(".container-item");
			if($containerItem.length > 0){
				return;
			}
			var curDom = ui.draggable.html();
			var domType = ui.draggable.data("type");
			switch (domType) {
				case "table":
					var $temp = $(containerQueryItem.replace("{0}", curDom));
					$temp.attr("contenteditable", true);
					$this.append($temp);
					break;
				default:
					return false; //只接受table类型的东西
					break;
			}
		}
	});
	
	$searchWidgetPropPopover.on("click", ".btn-cancel", function(e){
		
		var $queryEdit = $searchBox.find(".query-edit")
		$queryEdit.removeClass("query-edit");
		$searchWidgetPropPopover.hide();
	});
	$tablePropPopover.on("click", ".btn-cancel", function(e){
		
		$tablePropPopover.hide();
	});
	
	$searchWidgetPropPopover.on("click", ".btn-save",function(e){
		
		var labelText = $searchWidgetPropPopover.find(".label-text").val();
		var placeHolder = $searchWidgetPropPopover.find(".place-holder").val();
		var helpText = $searchWidgetPropPopover.find(".help-text").val();
		var $queryEdit = $searchBox.find(".query-edit");
		labelText && $queryEdit.find("label").text(labelText);
		placeHolder && $queryEdit.find("input").attr("placeholder", placeHolder);
		$queryEdit.removeClass("query-edit");
		$searchWidgetPropPopover.find("input").val("");
		$searchWidgetPropPopover.hide();
	});
	
	$tablePropPopover.on("click", ".btn-save", function(e){
		
		var $columnTotal = $tablePropPopover.find(".column_total");
		var columnTotal = $columnTotal.val();
		columnTotal = parseInt(columnTotal);
		if(!columnTotal || columnTotal < 1){
			return;
		}
		
		var $checkRemove = $tablePropPopover.find(".table_check");
		var checkRemove = $checkRemove.is(":checked");
		var $table = $tableBox.find(".jq_table");
		var $tableHead = $("thead > tr", $table);
		$tableHead.children().remove();
		if(!checkRemove){
			$tableHead.append(sTableCheck);
		}
		var sThArr = [];
		for(var i = 1; i < columnTotal + 1; i++){
			var sTh = "<th>第"+ i +"列</th>";
			sThArr.push(sTh);
		}
		$tableHead.append(sThArr.join());
		
		$columnTotal.val("");
		$checkRemove.attr("checked", false);
		$tablePropPopover.hide();
	});
	
	$tablePropPopover.on("click", ".btn-del", function(e){
	
		$tableBox.find(".container-item").remove();
		$tablePropPopover.hide();
	});
	
	$searchWidgetPropPopover.on("click", ".btn-del",function(e){
	
		var $queryEdit = $searchBox.find(".query-edit");
		$queryEdit.remove();
		$searchWidgetPropPopover.hide();
	});
	
	//模式选择
	$(".panel-heading button").on("click", function(e){
		
		var $this = $(this);
		$(".panel-heading button").removeClass("active");
		$this.addClass("active");
	});
	
	//生成代码
	$(".panel-heading .tryitbtn").on("click", function(e){
		
		var $mediaDom  = $("<div class='media-dom'></div>");//利用中间dom来操作，清晰易懂，之后用正则处理
		$(document.body).append($mediaDom);
		$mediaDom.append($domContainer.html());
		$mediaDom.find(".searchbox > div").removeClass("container-item").addClass("container-query");
		
		var $btnGroup = $("<div class='btn-group'></div>");
		$mediaDom.find(".btnbox").append($btnGroup);
		$btnGroup.append($mediaDom.find(".btnbox button"));
		$mediaDom.find(".btnbox .container-item").remove();
		
		$mediaDom.find(".tablebox").append($mediaDom.find(".jq_table"));
		$mediaDom.find(".tablebox .container-item").remove();
		
		var sHtml = $mediaDom.html().replace(/<label[^>]+>(.*?)<\/label>|\sui-sortable|\sui-droppable|container-item/g, "")
											.replace(/<button[^>]*class="ui-multiselect("|\s)[^>]*>.*?<\/button>/g ,"")
												.replace(/contenteditable="true"/g, "");
		$(".html-area textarea").val(sHtml);
		$mediaDom.remove();
	});

	//鼠标点击行外的区域，关闭行展开的内容
	$("body").on("click", function(e) {
		if (!$(e.target).closest("#search_prop_popover").length && $searchWidgetPropPopover.length) {
			$searchWidgetPropPopover.hide();
		}
		if (!$(e.target).closest("#table_prop_popover").length && $tablePropPopover.length) {
			$tablePropPopover.hide();
		}
	});
})