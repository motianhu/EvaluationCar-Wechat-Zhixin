//author:amixu
//date:2011-12-23

$.fn.table = function(params){
	defaults = {
		total:10,				//记录总数，从数据库中获取，jsp变量
		pageSize:20,			//默认显示的记录数，jsp变量	
		curPage:1,				//当前页面，jsp变量
		ajaxUrl:"",				//点击页码和页数时发送的ajax请求的url，即表格数据所在的页面路径，pageSize和curPage通过插件内部方法自动链接到该url后面
		method:"get",			//ajax请求方法
		paramsJson:{},			//ajax请求的参数(查询条件的参数，不包括pageSize和curPage)，可以是json对象，也可以是此格式"param1=a&param2=b"
		doSqlPage:true,			//默认采取数据库分页，无需理会此参数
		clickFun:function(size,page){},	//如果ajaxUrl为空，点击页码和页数时会触发此函数，此函数的两个参数分别表示当前页码和页数，通过插件传出来的，直接使用即可
		callBefore:function(){},	//ajax请求前要触发的动作，比如对于慢的分页可以加一个正在加载中的提示
		callBack:function(){},		//ajax请求完毕后的回调函数
		isHideCols:false,			//是否隐藏列，如果次参数为false，则忽略后面三个参数
		defaultColsNum:[],			//最原始的默认隐藏列，数字数组，0表示第一列
		hideColsNum:[],				//从cookie里面取出来的默认隐藏列，如果没有使用cookie，则hideColsNum和defaultColsNum的值应保持一致
		checkboxFun:function(str){}	//点击隐藏列复选框所触发的事件，返回所有的隐藏列号
	};
	$.extend(defaults,params);
	
	var $table = $(this),
		tTotal = parseInt(defaults.total),
		tPageSize = parseInt(defaults.pageSize)?parseInt(defaults.pageSize):20,
		tCurPage = parseInt(defaults.curPage)?parseInt(defaults.curPage):1,
		clickFun = defaults.clickFun,
		ajaxUrl = defaults.ajaxUrl,
		method = defaults.method,
		isHideCols = defaults.isHideCols,
		hideColsNum = defaults.hideColsNum,
		defaultColsNum = defaults.defaultColsNum,
		paramsJson = defaults.paramsJson,
		doSqlPage = defaults.doSqlPage,
		checkboxFun = defaults.checkboxFun,
		callBefore = defaults.callBefore,
		callBack = defaults.callBack,
		tAllPages = Math.ceil(tTotal/tPageSize),
		pageSizeHtml = "",
		$panelBox = null,
		fIndex = tPageSize*(tCurPage - 1),
		lIndex = tPageSize*tCurPage ;
		lIndex = lIndex>tTotal?tTotal:lIndex;
		
	if(tTotal==0 || tTotal=="0"){
		$table.find(">tfoot").hide();
		return;
	}
	pageSizeHtml += "<div class='page_size_box'> 跳到 <input type='text'  class='input-mini' name='page_num' style='margin-top: 5px;height: 25px;' size='1'/> 页 <div class='pageBtn' style='display: inline-block;cursor: pointer;'><span style='border-bottom: 1px solid rgb(89, 89, 89);'>GO</span></div></div>";
	var pageHtml = "<div style=\"float:left;margin-top: 10px;\" class='page_size_box'>当前显示 <b class='blue'>" + tTotal + "</b>条中 <b class='blue'>" + (fIndex+1) + "-" + lIndex +"</b> 条  <select name='page_size' style='width: 120px;height: 25px;margin-top: 5px;' id='page_size'>";
	if(tPageSize == 10){
	    pageHtml += "<option value='10' selected>每页显示10行</option>";
	}
	else{
	    pageHtml += "<option value='10'>每页显示10行</option>";
	}
	if(tPageSize == 20){
	    pageHtml += "<option value='20' selected>每页显示20行</option>";
	}
	else{
	    pageHtml += "<option value='20'>每页显示20行</option>";
	}
	if(tPageSize == 50){
	    pageHtml += "<option value='50' selected>每页显示50行</option>";
	}
	else{
	    pageHtml += "<option value='50'>每页显示50行</option>";
	}
	if(tPageSize == 100){
	    pageHtml += "<option value='100' selected>每页显示100行</option>";
	}
	else{
	    pageHtml += "<option value='100'>每页显示100行</option>";
	}
	// 用于增加每页显示1000行的功能
	if(tPageSize == 1000){
	    pageHtml += "<option value='1000' selected>每页显示1000行</option>";
	}
	else{
	    pageHtml += "<option value='1000'>每页显示1000行</option>";
	}
	pageHtml += "</select> </div>";		
	var pageNumHtml = "<div class='page_num_box' style='margin-top: 12px;'>";
	if (tCurPage == 1){
		pageNumHtml += "<span class='pageUp' style='cursor: pointer;padding-right: 10px;color: rgb(165, 163, 163);'>上一页</span>";
	}
	else{
		pageNumHtml += "<span class='pageUp' style='cursor: pointer;padding-right: 10px;'>上一页</span>";
	}
	if(tAllPages==1){
		pageNumHtml = "<div style='display:none'>";
	}else if(tAllPages>1 && tAllPages<8){
		getpageNumHtml(1,tAllPages,tCurPage);
	}else if(tCurPage<5){
		getpageNumHtml(1,5,tCurPage);
		pageNumHtml +=  "<span class='ellipsis_num'>..</span><span class='page_num'>" + tAllPages + "</span>";
	}else if(tCurPage>tAllPages-4){
		pageNumHtml +=  "<span class='page_num'>1</span><span class='ellipsis_num'>..</span>";
		getpageNumHtml(tAllPages-4,tAllPages,tCurPage);
	}else{
		pageNumHtml +=  "<span class='page_num'>1</span><span class='ellipsis_num'>..</span><span class='page_num'>" + (tCurPage-1) + "</span><span class='page_num light_page_num'>" + tCurPage + "</span><span class='page_num'>" + (tCurPage+1) + "</span><span class='ellipsis_num'>..</span><span class='page_num'>" + tAllPages + "</span>";
	}
	if (tCurPage == tAllPages){
		pageNumHtml += "<span class='pageDown' style='cursor: pointer;padding-left: 10px;color: rgb(165, 163, 163);'>下一页</span>";
	}
	else{
		pageNumHtml += "<span class='pageDown' style='cursor: pointer;padding-left: 10px;'>下一页</span>";
	}	
	pageNumHtml += "</div>";
	pageHtml = pageSizeHtml + pageNumHtml + pageHtml;
	$(">tfoot td.pagebox",$table).append(pageHtml);
	$("select[id=page_size]").multiselect({
		header: false,
		multiple: false,
		selectedList: 1
	});
	
	$(".pageBtn",$table).click(function(){
		callBefore();
		tPageSize = $("#page_size option:selected").val();
		//tPageSize = $(this).siblings("input[name=page_size]").val();
		tCurPage = $(this).siblings("input[name=page_num]").val();
		if(tPageSize<0){
			alert("请输入正数");
			return;
		}
		if(tCurPage<0 || tCurPage>Math.ceil(tTotal/tPageSize)){
			alert("跳转页数输入异常(总页数:" + tAllPages+")");
			return;
		}
		tPageSize = parseInt(tPageSize);
		if(!tPageSize){
			alert("你想要每页显示多少条记录呢？");
			return;
		}
		tCurPage = parseInt(tCurPage);
		if(!tCurPage || (tCurPage-1)*tPageSize>tTotal){
			tCurPage = 1;
		}
		
		var sep = "?";
		if(ajaxUrl.indexOf("?")!=-1){
			var sep = "&";
		}
		var url = ajaxUrl + sep + "pageSize=" + tPageSize + "&curPage=" + tCurPage;
		if($panelBox!=null){
			var arr = [];
			$panelBox.find(":checkbox").each(function(){
				if(!this.checked){
					arr.push(this.value);
				}
			});
			
			url += "&hideColsNum=[" + arr + "]";
		}
		if(!ajaxUrl){
			clickFun(tPageSize,tCurPage);
		}else if(method=="post"||method=="POST"){
			$.post(url,paramsJson,function(data){
				$table.parent().html(data);
			});
		}else{
			$table.parent().load(url,paramsJson,callBack);
		}
	});
	
	$("span.page_num",$table).click(function(){
		callBefore();
		var num = $(this).text();
		var sep = "?";
		if(ajaxUrl.indexOf("?")!=-1){
			var sep = "&";
		}
		var url = ajaxUrl + sep + "pageSize=" + tPageSize + "&curPage=" + num;
		if($panelBox!=null){
			var arr = [];
			$panelBox.find(":checkbox").each(function(){
				if(!this.checked){
					arr.push(this.value);
				}
			});
			
			url += "&hideColsNum=[" + arr + "]";
		}if(!ajaxUrl){
			clickFun(tPageSize,num);
		}else if(method=="post"||method=="POST"){
			$.post(url,paramsJson,function(data){
				$table.parent().html(data);
			});
		}else{
			$table.parent().load(url,paramsJson,callBack);
		}
	});
	
	$("span.pageUp",$table).click(function(){
		callBefore();
		if(tCurPage == 1) return;
		var num = tCurPage-1;
		var sep = "?";
		if(ajaxUrl.indexOf("?")!=-1){
			var sep = "&";
		}
		var url = ajaxUrl + sep + "pageSize=" + tPageSize + "&curPage=" + num;
		if($panelBox!=null){
			var arr = [];
			$panelBox.find(":checkbox").each(function(){
				if(!this.checked){
					arr.push(this.value);
				}
			});
			
			url += "&hideColsNum=[" + arr + "]";
		}if(!ajaxUrl){
			clickFun(tPageSize,num);
		}else if(method=="post"||method=="POST"){
			$.post(url,paramsJson,function(data){
				$table.parent().html(data);
			});
		}else{
			$table.parent().load(url,paramsJson,callBack);
		}
	});
	
	$("span.pageDown",$table).click(function(){
		callBefore();
		if(tCurPage == tAllPages) return;
		var num = tCurPage+1;
		var sep = "?";
		if(ajaxUrl.indexOf("?")!=-1){
			var sep = "&";
		}
		var url = ajaxUrl + sep + "pageSize=" + tPageSize + "&curPage=" + num;
		if($panelBox!=null){
			var arr = [];
			$panelBox.find(":checkbox").each(function(){
				if(!this.checked){
					arr.push(this.value);
				}
			});
			
			url += "&hideColsNum=[" + arr + "]";
		}if(!ajaxUrl){
			clickFun(tPageSize,num);
		}else if(method=="post"||method=="POST"){
			$.post(url,paramsJson,function(data){
				$table.parent().html(data);
			});
		}else{
			$table.parent().load(url,paramsJson,callBack);
		}
	});
	
	$("#page_size",$table).change(function(){
		callBefore();
		tPageSize = $("#page_size option:selected").val();
		tCurPage = $(this).siblings("input[name=page_num]").val();
		if(tPageSize<0){
			alert("请输入正数");
			return;
		}
		if(tCurPage<0 || tCurPage>Math.ceil(tTotal/tPageSize)){
			alert("跳转页数输入异常(总页数:" + tAllPages+")");
			return;
		}
		tPageSize = parseInt(tPageSize);
		if(!tPageSize){
			alert("你想要每页显示多少条记录呢？");
			return;
		}
		tCurPage = parseInt(tCurPage);
		if(!tCurPage || (tCurPage-1)*tPageSize>tTotal){
			tCurPage = 1;
		}
		
		var sep = "?";
		if(ajaxUrl.indexOf("?")!=-1){
			var sep = "&";
		}
		var url = ajaxUrl + sep + "pageSize=" + tPageSize + "&curPage=" + tCurPage;
		if($panelBox!=null){
			var arr = [];
			$panelBox.find(":checkbox").each(function(){
				if(!this.checked){
					arr.push(this.value);
				}
			});
			
			url += "&hideColsNum=[" + arr + "]";
		}
		if(!ajaxUrl){
			clickFun(tPageSize,tCurPage);
		}else if(method=="post"||method=="POST"){
			$.post(url,paramsJson,function(data){
				$table.parent().html(data);
			});
		}else{
			$table.parent().load(url,paramsJson,callBack);
		}
	});

	$('>tbody>tr:odd',$table).addClass('odd');

	$("th.sort",$table).click(function(){
		sortTable($(this),$table);
	});
	
	if(!doSqlPage){
		$('>tbody tr',$table).hide().slice(fIndex, lIndex).show();
	}
	
	function getpageNumHtml(num,allPage,curPage){
		for(var i=num;i<=allPage;i++){
			if(i==curPage){
				pageNumHtml += "<span class='page_num light_page_num'>" + i +"</span>";
			}else{
				pageNumHtml += "<span class='page_num'>" + i +"</span>";
			}
		}
	};
	function strSortDown(a,b){
		return(a.sortKey.localeCompare(b.sortKey));
	};
	function strSortUp(a,b){
		return(b.sortKey.localeCompare(a.sortKey));
	};
	function numSortDown(a,b){
		return (a.sortKey - b.sortKey);
	};
	function numSortUp(a,b){
		return (b.sortKey - a.sortKey);
	};

	function   sortTable($thObj,$tabObj){
		var rows = $('>tbody tr:visible',$tabObj).get();
		//获取第几列，col为点中的th在window.table_thead的所有tr中的位置；应该修改为在window.table_thead中display不为none的tr中的位置
		// var col = $thObj.index();
		var col = $thObj.index() - $thObj.closest('tr').find('th:lt('+$thObj.index()+')').not(':visible').length;
		if($thObj.hasClass("sortNum")){
			$.each(rows,function(index,row){
				row.sortKey = parseFloat($(row).children().eq(col).text().replace(/,/g, "")) || 0;
			});
			if($thObj.hasClass('js_down')){
				$('th.sort',$tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_up');
				rows.sort(numSortDown);
			}else{
				$('th.sort',$tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_down');
				rows.sort(numSortUp);
			}
		}else if($thObj.hasClass("sortValue")){		
			$.each(rows,function(index,row){
				row.sortKey = $(row).children().eq(col).find("select").val().toUpperCase();
			});
			if($thObj.hasClass('js_down')){
				$('th.sort',$tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_up');
				rows.sort(strSortDown);
			}else{
				$('th.sort',$tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_down');
				rows.sort(strSortUp);
			}
		
		}else{
			$.each(rows,function(index,row){
				row.sortKey = $(row).children().eq(col).text().toUpperCase() || "0";
			});
			if($thObj.hasClass('js_down')){
				$('th.sort',$tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_up');
				rows.sort(strSortDown);
			}else{
				$('th.sort',$tabObj).removeClass('js_up').removeClass('js_down');
				$thObj.addClass('js_down');
				rows.sort(strSortUp);
			}
		}
		
		$.each(rows,function(index,row){
			$('>tbody',$tabObj).append(row);
		});
		
		$('>tbody tr:visible',$tabObj).removeClass('odd').filter(':odd').addClass('odd');
	};
	
	//全反选
	$('.check_all',$table).click(function(){		
		if(this.checked) $('>tbody tr:visible',$table).find(':checkbox').attr('checked','true');
		else $(':checkbox',$table).attr('checked','');
	});
	
	function stopBubble(e){
	    if(e && e.stopPropagation())  e.stopPropagation(); // firefox ...      
	    else window.event.cancelBubble = true;  // ie 
	}
	
	if(isHideCols){
		var clickFlick = true;
		var $th = $table.find('>thead>tr>th');
		var $showth = $th.filter(".hidecol");
		var $tr = $table.find('>tbody>tr');
		var numLen = hideColsNum.length;
		var numStr = ",";
		$panelBox = $("<div />").addClass("hide_click_box_flag").css({"position":"absolute","border":"1px solid #99BBE8","padding":"10px","background":"#ffffff","line-height":"20px"});
		if(numLen>0){
			numStr += hideColsNum.join() + ",";
			for(var i=0;i<numLen;i++){
				$th.eq(hideColsNum[i]).hide();
				$tr.each(function(){
					$(this).find(">td").eq(hideColsNum[i]).hide();
				});
			}
		}
		
		var html = "";
		$th.each(function(i){
			if(!$(this).hasClass("hidecol")){
				html += "<p style='display:none'><input type='checkbox' checked='checked' value='"+i+"'/></p>";
			}else if(numStr.indexOf(","+i+",")==-1){
				html += "<p class='hide_click_box_flag'><input class='hide_click_box_flag' type='checkbox' checked='checked' value='"+i+"'/><label class='hide_click_box_flag'>"+$(this).text()+"</label></p>";
			}else{
				html += "<p class='hide_click_box_flag'><input class='hide_click_box_flag' type='checkbox' value='"+i+"'/><label class='hide_click_box_flag'>"+$(this).text()+"</label></p>";
			}
		});
		html += "<p class='hide_click_box_flag ta_c'><input type='button' value='恢复默认设置'/></p>";
		$panelBox
		.hide()
		.append(html)
		.appendTo("body")
		.find("input[type=checkbox]").click(function(){
			var index = this.value;
			if(this.checked){
				$th.eq(index).show();
				$tr.each(function(){
					$(this).find(">td").eq(index).show();
				});
				numStr = numStr.replace(','+index+',',',');
			}
			else{
				if($showth.filter(":visible").length==1){
					$(this).attr("checked","checked");
					return;
				}
				$th.eq(index).hide();
				$tr.each(function(){
					$(this).find(">td").eq(index).hide();
				});
				numStr += index + ",";
			}
			checkboxFun(numStr.slice(1,-1));
		})
		.end()
		.find("input[type=button]").click(function(){
			var sep = "?";
			if(ajaxUrl.indexOf("?")!=-1){
				var sep = "&";
			}
			var url = ajaxUrl + sep + "pageSize=" + tPageSize + "&curPage=1&hideColsNum=[" + defaultColsNum + "]";			
			//if(!ajaxUrl){
				//clickFun(size,num);
			//}else 
			if(method=="post"||method=="POST"){
				$.post(url,paramsJson,function(data){
					$table.parent().html(data);
				});
			}else{
				$table.parent().load(url,paramsJson,callBack);
			}
		});
			
		$showth
		.prepend("<img style='margin:3px 0 0 5px' class='f_l' src ='http://www.wsd.com/jquery-easyui/themes/icons/mini_add.png' alt='隐藏列选项' title='隐藏列选项'/>")
		.find(">img").click(function(e){
			var x = $(this).offset().left + "px";
			var y = $(this).offset().top + 10 + "px";
			$panelBox.css({"left":x,"top":y}).show();
			try{
				stopBubble(e);
			}catch(error){
				return;
			}
		});
		
		
		$("html").click(function(e){
			if(e.target.className.indexOf("hide_click_box_flag")==-1 && $panelBox != null){
				$panelBox.hide();
			}
		});
	
	}
};
