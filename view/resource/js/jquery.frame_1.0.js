var setting = {
	data: {
		simpleData: {
			enable: true
		}
	},
	view: {
		fontCss: getFont,
		dblClickExpand: false
	},
	callback: {
		beforeClick: zTreeBeforeClick,
		onClick: zTreeClick
	}
};

function getFont(treeId, node) {
	return node.font ? node.font : {};
}

function zTreeBeforeClick(treeId, treeNode, clickFlag){
    return (treeNode.target != "_blank");
};

function zTreeClick(e,treeId, treeNode){
	if(treeNode.url == undefined){
		zTreeObj.expandNode(treeNode);
		return;
	}
	if(treeNode.title){
		addTab(treeNode.title,treeNode.url,treeNode.font);
	}else{
		addTab(treeNode.name,treeNode.url,treeNode.font);
	}

	//打日志
	var pNode = treeNode.getParentNode();
	var pName = "";
	if(pNode){
		pName = pNode.name + pName;
		for(var i=0;i<3;i++){
			pNode = pNode.getParentNode();
			if(!pNode){
				break;
			}
			pName = pNode.name + " -> " + pName;
		}
	}
}

function setDefaultTab(obj,tit,url){
 	obj.tabs('add',{
 		title:tit,
 		width:50,
 		content:"<iframe class='" + navId + "' frameborder='0'  src='" + url + "'></iframe>",
 		fit:true,
 		border:false,
 		iconCls:'icon-reload',
 		closable:true
 	});
 }
/** 原函数 */
//function addTab(tit,url,font){
//  var dtit = tit,
//      tflag = true;
//  if(font){
//      tit = "<span>" + tit + "</span>";
//  }
//  if($ttbox.tabs('exists',tit)){
//      var tabs = $ttbox.tabs('tabs');
//      for(var i=0;i<tabs.length;i++){
//          var furl = tabs[i].find(">iframe").attr("src");
//          if(furl==url){
//              tflag = false;
//              $ttbox.tabs('select',i);
//              reloadTab();
//              break;
//          }
//      }
//  }
//  if(tflag){
//      $ttbox.tabs('add',{
//          title:tit,
//          content:"<iframe class='" + navId + "' frameborder='0'  src='" + url + "'></iframe>",
//          fit:true,
//          border:false,
//          iconCls:'icon-reload',
//          closable:true
//      });
//  }
//  window.location.hash = "#navId=" + navId + "#tabUrl=" + url + "#tabTitle=" + dtit;
//}
function addTab(tit,url,font){
    var dtit = tit,
        tflag = true;
    if(font){
        tit = "<span>" + tit + "</span>";
    }
    var tabs = $ttbox.tabs('tabs');
    for(var i=0;i<tabs.length;i++){
        var furl = tabs[i].find(">iframe").attr("src");
        var fTarget = furl.replace(/.*\//,'').replace(/\?.*/,''),
            target = url.replace(/.*\//,'').replace(/\?.*/,'');
        if(fTarget == target){
            tflag = false;
            $ttbox.tabs('select',i);
            //reloadTab();
            break;
        }
    }
    if(tflag){
        $ttbox.tabs('add',{
            title:tit,
            content:"<iframe class='" + navId + "' frameborder='0'  src='" + url + "'></iframe>",
            fit:true,
            border:false,
            iconCls:'icon-reload',
            closable:true
        });
    }
    //window.location.hash = "#navId=" + navId + "#tabUrl=" + url + "#tabTitle=" + dtit;
}

function reloadTab(){
	var tab = $ttbox.tabs('getSelected'),
		html = tab.html();
	tab.html(html);
}

$(function(){
	navId = "default";
	$ttbox = $("#ttbox");
	$tree = $("#filetree");
	var $nava = $("#frame_head .nav a"),
		navaText = $nava.text(),
		btnHtml = "<a class='layout-button-load' href='#' title='刷新'></a><a class='layout-button-up' href='#' title='折叠全部'></a><a class='layout-button-down' href='#' title='展开全部'></a>",
		winurl = window.location.href;

	if(winurl.indexOf("#navId=")!=-1){
		var barr = winurl.split("#navId=")[1].split("#tabUrl="),
			arr = barr[1].split("#tabTitle="),
			url = arr[0],
			tit = decodeURIComponent(arr[1]);
		if(barr[0]){
			navId = barr[0];
			if(navaText){
				$nava.each(function(){
					if($(this).attr("id")==navId){
						$(this).addClass("select");
						return false;
					}
				});
			}
		}else{
			navId = $nava.filter(":first").addClass("select").attr("id");
		}
		setDefaultTab($ttbox,tit,url);
		//console.log(navId);
	}else{
		if(navaText){
			navId = $nava.filter(":first").addClass("select").attr("id");
		}
		setDefaultValue($ttbox);
	}
	//设置同步加载
	$.ajaxSetup({
		  async:false
	});
	refreshTree(navId);

	zTreeObj = $.fn.zTree.getZTreeObj("filetree");

	$panelToolBtn = $(".layout-panel-west .panel-tool");

	$panelToolBtn.prepend(btnHtml);


	$panelToolBtn.find(".layout-button-up").click(function(){
		zTreeObj.expandAll(false);
		return false;
	});
	$panelToolBtn.find(".layout-button-down").click(function(){
		zTreeObj.expandAll(true);
		return false;
	});


	$ttbox.tabs({
	    onSelect:function(title){
			var $iframe = $("div.panel:visible>.panel-body>iframe",$ttbox),
				url = $iframe.attr("src"),
				menu = $iframe.attr("class");
			//window.location.hash = "#navId=" + menu + "#tabUrl=" + url + "#tabTitle=" + title;
			window.document.title = title;
	    }
	});

	$nava.click(function(){
		if($(this).hasClass("openWindow")){
			return;
		}
		$(this).addClass("select").siblings().removeClass("select");
		var thisId = $(this).attr("id");  //navId必须和表中字段f_menu保持一致

		if(thisId){
			navId = thisId;
			navClick(navId);
			var n = $(this).attr("name");	//打开默认页面必须指定name属性值
			if(n){
				addTab(n,$(this).attr("href"));
			}
		}else{
			addTab($(this).text(),$(this).attr("href"));  //如果nav没有对应的树，请务必不要填写id属性
		}
		return false;
	});

	$("li .icon-reload",$ttbox).die().live('click',function(){
		reloadTab();
	});


	//树刷新
	$panelToolBtn.find(".layout-button-load").click(function(){
		refreshTree(navId);
		return false;
	});

	//树搜索
	$("#tree_ss_btn").click(function(){
		var param = $(this).prev().serialize();
		if(param=="key="){
			alert("请输入关键字");
			return;
		}
		param += "&menu=" + navId;
		searchTree(param);
	});
	//树回车键搜索
	$("#tree_ss_name").keyup(function(e){
		if(e.keyCode != 13){
			return;
		}
		var param = $(this).serialize();
		if(param=="key="){
			alert("请输入关键字");
			return;
		}
		param += "&menu=" + navId;
		searchTree(param);
	});

	$("#tab-tools>a").click(function(){
		var $li = $(".tabs-wrap li",$ttbox),
			len = $li.length,
			index = 0;
		$li.each(function(){
			if($(this).hasClass("tabs-selected")){
				index = 1;
			}
			$ttbox.tabs('close',index);
		});
	});


	$tree.find("a").die().live('click',function(){
		if($(this).attr("target")!="_blank"){
			return false;
		}
	});
});