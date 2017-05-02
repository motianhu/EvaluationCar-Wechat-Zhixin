/**初始化多选下拉列表
*
* 2014年3月19日  增加对‘合计’的特殊处理  annyliu
*
*/
$(function(){
	/**
	*	解决异步生成的select框click事件没有绑定成功的问题 
	*	@author vkyin
	*	@time 2014年7月29日 15:35:53
	*/
	$(document).on("click",".multiselectimage",function(){
		//获取当前点中的记录的value值，value为-1代表此记录为‘合计’
		var isSum = $(this).children('input').attr('value');
		var context = $(this).closest('.ui-multiselect-menu').find('ul.ui-multiselect-checkboxes');
		if (isSum == -1) {
			//'合计'
			if(this.className.indexOf("itemselected") > -1){
				//'合计'最终不被选中
				this.className = "multiselectimage itemnotselected";
			} else {
				//'合计'最终选中，其它选项都改为不选
				$(".multiselectimage",context).removeClass('itemselected');
				$(".multiselectimage",context).addClass('itemnotselected');
				$(".itemselected",context).addClass('itemnotselected');
				$(".itemselected",context).removeClass('itemselected');
				//‘合计’项独自选中
				this.className = "multiselectimage itemselected";				
			}
		} else {
			//点击非合计item的情况
			var eles = this.childNodes;
			if(eles.length){
				var tmp = this.className.indexOf("itemselected");
				if(tmp > -1){
					this.className = "multiselectimage itemnotselected";
				}else {
					this.className = "multiselectimage itemselected";
					//如果‘合计’已选中，变为未选中
					if ( $(".itemselected input[value='-1']") ) {
						$(".itemselected input[value='-1']",context).parent().addClass('itemnotselected');	
						$(".itemselected input[value='-1']",context).parent().removeClass('itemselected');
					}
				}
			}			
		}	
	});

	/**全选*/
	$(document).on("click",".ui-multiselect-all",function(){
		var context = $(this).closest('.ui-multiselect-menu').find('ul.ui-multiselect-checkboxes');
		//增加判断，如果有‘合计’，则合计不选，其它项选中
		//所有项选中
		$("li:visible .multiselectimage",context).removeClass('itemnotselected');
		$("li:visible .multiselectimage",context).addClass('itemselected');
		$("li:visible .itemnotselected",context).addClass('itemselected');
		$("li:visible .itemnotselected",context).removeClass('itemnotselected');
	
		//‘合计’项不选
		$(".itemselected input[value='-1']",context).parent().removeClass('itemselected');
		$(".itemselected input[value='-1']",context).parent().addClass('itemnotselected');
		
	});

	/**不选*/
	$(document).on("click",".ui-multiselect-none",function(){
		var context = $(this).closest('.ui-multiselect-menu').find('ul.ui-multiselect-checkboxes');
		$("li:visible .multiselectimage",context).removeClass('itemselected');
		$("li:visible .multiselectimage",context).addClass('itemnotselected');
		$("li:visible .itemselected",context).addClass('itemnotselected');
		$("li:visible .itemselected",context).removeClass('itemselected');
	});
});



/**获取自动补全文本框中的值，返回给后台固定格式的参数*/
function getId(type,idAndName) {
	
	if (idAndName.indexOf(';') == -1) {
		if(type === 'vendor'){
			$('#vendorSupplier').val('-1-合作方全选;');			
		}else if (type === "channel") {
			$('#channelSelect').val('-1-渠道号-合计;');
		}else if (type === "provider") {
			$('providerSelect').val('-1-供应商-合计');
		}
		
		return -1;
	}
	
	if (idAndName.indexOf('合作方-展开') > -1 
		|| idAndName.indexOf("渠道号-展开") > -1
		|| idAndName.indexOf("供应商-展开") > -1) {
		return -2;
	}
	
	if (idAndName.indexOf('合作方全选') > -1  
			|| idAndName.indexOf("渠道号-合计") > -1  
			|| idAndName.indexOf("供应商-合计") > -1) {
			return -1;
	}
	
	var testtArray = idAndName.split(';');
	var length = testtArray.length;
	var index = testtArray[0].indexOf('-');
	var result = testtArray[0].substr(0,index);
	var i;
	for (i = 1; i < length-1; i++) {
		index = testtArray[i].indexOf('-');	
		if (index != 0) {
			result = result + ',' + testtArray[i].substr(0,index);
		}
	}
	return result;
}

/** 获取子渠道号*/
function getSubChannel(subChannel) {
	if (subChannel.indexOf(";") == -1) {
		$('#subChannelSelect').val('-1-子渠道-合计;');
		return -1;
	}
	if(subChannel.indexOf("子渠道-展开") > -1 )
		return -2;
	if(subChannel.indexOf("子渠道-合计") > -1 )
		return -1;
	var testtArray = subChannel.split(';');
	var length = testtArray.length;
	var result = testtArray[0];
	var i;
	for(i = 1; i<length-1; i++){
			result = result + ',' + testtArray[i];
	}
	result = result.replace(/\+/g,'%2B');
	return result;
}

/**获取版本号*/
function getVersionType(version) {
	if (version.indexOf(";") == -1) {
		$('#versionSelect').val('-1-版本-合计;');
		return -1;
	}
	if(version.indexOf("版本-展开") > -1 )
		return -2;
	if(version.indexOf("版本-合计") > -1 )
		return -1;
	var testtArray = version.split(';');
	var length = testtArray.length;
	var result = testtArray[0];
	var i;
	for(i = 1; i<length-1; i++){
			result = result + ',' + testtArray[i];
	}
	result = result.replace(/\+/g,'%2B');
	return result;
}

/**获取机型文本框，整理参数，传给后台*/
function getMachineType(machineType){			
	if (machineType.indexOf(";") == -1) {
		$('#deviceSelect').val('-1-机型-合计;');
		return -1;
	}
	if(machineType.indexOf("机型-展开") > -1 )
		return -2;
	if(machineType.indexOf("机型-合计") > -1 )
		return -1;
	var testtArray = machineType.split(';');
	var length = testtArray.length;
	var result = testtArray[0];
	var i;
	for(i = 1; i<length-1; i++){
			result = result + ',' + testtArray[i];
	}
	result = result.replace(/\+/g,'%2B');
	return result;
}