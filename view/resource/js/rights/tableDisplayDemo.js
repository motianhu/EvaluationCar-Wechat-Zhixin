(function($, window) {
	"use strict";
	var $table = $("#user_table");
	var $jTable = null;
	// 定义表列名称, 必须是有序序列
	var tableColumns = ["id","chineseName","englishName","email","phone","qq","wechat","status"];
	var kkk = 0;
	function getTableColumnIndexByName(tableColumnsName) {
		var tableSize=tableColumns.length;
		var indexString = "";
		if(tableColumnsName == null || tableColumnsName.length<=0) {
			return "";
		}
		var findArray = tableColumnsName.split(",");
		for(var i=0;i < findArray.length; i++) {
			for(var j=0;j < tableSize; j++){
				if(findArray[i] == tableColumns[j]) {
					if(indexString == null || indexString.length<=0) {
						indexString = j;
					} else {
						indexString = indexString + "," + j;
					}
					break;
				}
			}
		}
		return indexString;
	};
	
	// 设置表格显示和隐藏
	function setTableDisplay(tableTr, tableIndex, isDisplay){
		if(tableIndex !=null && tableIndex.length>0) {
			var tableIdx = tableIndex.split(",");
			for(var i=0; i<tableIdx.length; i++) {
				if(isDisplay) {
					tableTr.find('td:eq(' + tableIdx[i] + ')').hide();
					tableTr.find('th:eq(' + tableIdx[i] + ')').hide();
				} else {
					tableTr.find('td:eq(' + tableIdx[i] + ')').show();
					tableTr.find('th:eq(' + tableIdx[i] + ')').show();
				}
			}
		}
	};
	
	beautifulSelect2();
	
	function beautifulSelect2() {
		$(".beautifulSelect2").select2({
			  theme: "classic"
		});
	};

	/**
	 * 获得查询参数
	 * 
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			userType : '',
			chineseName : '',
			englishName : '',
			status : '',
			fileType : "xls"
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.userType = $("#typeSelect").val();
			_queryParam.chineseName = $('#chinesename').val();
			_queryParam.englishName = $('#englishname').val();
			_queryParam.status = $("#validSelect").val();
			if (arguments.length != 0) {
				var args = arguments[0];
				for ( var x in args) {
					if (_queryParam[x]) {
						_queryParam[x] = args[x];
					}
				}
			}
			toString(_queryParam);
			return _queryParam;
		};
	})();
	
	$("#searchBtn").click(search); 
	
	function search() {
		var getTableIndex = getTableColumnIndexByName("id,qq");
		kkk = kkk+1;
		setTableDisplay($('#user-table tr'), getTableIndex, kkk %2==0);
	}

})(jQuery, window);