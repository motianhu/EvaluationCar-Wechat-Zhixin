(function($, window) {
	"use strict";
	var $table = $("#user-table");
	// 定义表列名称, 必须是有序序列
	var tableColumns = ["id","chineseName","englishName","email","phone","qq","wechat","status"];
	
	beautifulSelect2();
	
	function beautifulSelect2() {
		$(".beautifulSelect2").select2({
			  theme: "classic"
		});
	};
	
	$('#refresh').click(function () {
        $table.bootstrapTable('refresh', {
        	jsonData: getParam(),
            url: requestContextPath + "/report/userList.html"
        });
    });
	
	 $('#update-row').click(function () {
         $table.bootstrapTable('updateRow', {
             index: 1,
             row: {
                 name: 'test111111',
                 price: '$111111'
             }
         });
     });
	 
     $('#show-column, #hide-column').click(function () {
         $table.bootstrapTable('hideColumn', 'id'); 
     });
     
     
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
	

})(jQuery, window);