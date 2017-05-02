/**
 * ========================================
 * 月份选择器
 * @author johnnyzheng(johnnyzheng@fastWeb.com)
 * @version 2012-08-24
 *
 * ========================================
 */

var monthPicker = {
	_conf : {
		//月份选择器的开始年
		startYear : 1970,
		//默认是今年
		endYear : new Date().getFullYear(),
		//月份选择器的选择面板的月份排布的列数
		cols : 4,
		//月份选择器的选择面板的月份排布的行数
		rows : 3,
		//容器ID
		container : 'gri_monthPicker_wrapper',
		//选择框的id
		calendar : 'gri_monthPicker_panel',
		//日期框体 id
		dataTable : 'gri_monthPicker_table',
		// 日期表格的CSS类
		containerCss : 'calendar cf',
		// 时间选择的样式
		selectCss : 'current',
		//内容样式
		contentCss : 'calendar_cont cf',
		//表格样式
		tableCss : 'calendar-month',
		//不可选样式
		disabledCss : 'dis',
		// //宽度
		// width : '150px',
		// //高度
		// height : '150px',
		//输入控件
		input : {},
		//ID
		id : 'month_picker',
		//trigger 额外触发器
		trigger : 'month_trigger',
		//回调函数
		callback : function(obj){return true},
		//是否加载即回调
		autoCommit : false,
		//支持区间选择
		period :  false,
		//开始月份，只有上述为true时才生效
		start_month : '',
		//结束月份，只有上述为true时才生效
		end_month : '',
		//默认文字
		defaultText : ' - '
	},

	//最终的返回值，初始值是当前年月
	assemble : {
		'year' : new Date().getFullYear(),
		'month' : new Date().getMonth() + 1
	},

	/**
	* @description 外部调用接口
	* @param {String} id, element id
	* @param {Object} 外源配置
	*/
	create : function(id, conf){
		var that = this;
		that._conf.id = id ;
		that._conf = $.extend(true, that._conf, conf);
		$('#' + id).length > 0 && function(){
			$('#'+id).bind('click', function(){
				that.show(that.util.$(id));
			});
		}();
		$('#' + that._conf.trigger).length > 0 && function(){
			$('#'+that._conf.trigger).bind('click', function(){
				that.show(that.util.$(id));
			});
		}();
		//判断是取一段时间的话
		if(that._conf.period && that._conf.start_month!= '' && that._conf.end_month != ''){
			if( that._conf.start_month > that._conf.end_month){
				$('#'+id).html(that._conf.end_month + that._conf.defaultText + that._conf.start_month);
			}else{
				$('#'+id).html(that._conf.start_month + that._conf.defaultText + that._conf.end_month);
			}
			that._conf.autoCommit && that._conf.callback({startDate:that._conf.start_month+'-01', endDate: that._conf.end_month+'-31'});

		}
		else{
		//默认填充最近一个月
		var def = this.util.format(this.assemble);
		$('#'+id).html(def.year + '-' + def.month);
			that._conf.autoCommit && that._conf.callback(that.convertToDate(this.util.format(this.assemble)));
		}
		 //让用户点击页面即可关闭弹窗
	    $(document).bind('click', function (evt) {
	       that.cancel(evt);
	    });
	},

	/**
	 * @description 获得当前选择器的日期
	 * @return {Object} 年 月 对象
	 */
	getCurrentShowDate : function(){
		var that = this, str = '';
		if($('#' + that._conf.id).length > 0){
			str = $('#' + that._conf.id).html();
			return {'year' : str.split('-')[0], 'month' : str.split('-')[1]};
		}
	},

	/**
	 * @description 月份转换为日期
	 * @param {Object} 月份对象
	 * @return {Object} 开始结束时间对象
	 */
	convertToDate : function(obj){
		return {
				'startDate' : obj.year + '-' + obj.month + '-01',
				'endDate' : obj.year + '-' + obj.month + '-31'
				};
	},

	//展示框体
	show : function(ref) {
		this._conf.input = ref;
		//如果已经存在div，则不重复创建
		if(this.util.$(this._conf.container)) {
			var pos = $('#' + this._conf.id).offset();
			var offsetHeight = $('#' + this._conf.id).attr('offsetHeight');
			this.util.$(this._conf.container).style.display = 'block';
			//调整位置
			this.util.$(this._conf.container).style.top = pos.top + (offsetHeight ? offsetHeight -1 : 32)+ 'px';
			this.util.$(this._conf.container).style.left = pos.left + 'px';

			this.periodCss();
			return false;
		}
		//创建面板
		var div = this.util.creatEle('div');
		div.setAttribute('id', this._conf.container);
		$(div).addClass(this._conf.containerCss);
		div.style.zIndex = '9999';
		//调整位置
		var pos = $('#' + this._conf.id).offset();
		var offsetHeight = $('#' + this._conf.id).attr('offsetHeight');
		div.style.top = pos.top + (offsetHeight ? offsetHeight -1 : 32)+ 'px';
		div.style.left = pos.left + 'px';
		document.body.appendChild(div);
		var contentDiv = this.util.creatEle('div');
		contentDiv.id = this._conf.calendar;
		$(contentDiv).addClass(this._conf.contentCss);
		var ctrl = [];
		ctrl.push('<i class="i_pre" style="z-index:1" id="gri_preYear"></i>');
		ctrl.push('<i class="i_next" style="z-index:1" id="gri_nextYear"></i>');
		$(contentDiv).append(ctrl.join(''));
		div.appendChild(contentDiv);
		div.style.display = 'block';
		this.init();

		this.periodCss();
	},
	//初始化
	init : function() {
		var that = this;
		//点击输入框的时候，初始化的月份选择器的面板
		var ctrl = panel = [];
		var table = this.util.creatEle('table');
		$(table).addClass(this._conf.tableCss);
		var cap = document.createElement('caption');
		var sp = document.createElement('span');
		sp.id = 'gri_year';

		var tmp = new Date().getFullYear();
		if (this._conf.period && this._conf.end_month != '')
		{
		    tmp = this._conf.end_month.substr(0, 4);
		    this.assemble.year = tmp;
		    this.assemble.month = this._conf.end_month.substr(4, 2);
		}
		$(sp).append(tmp + '年');

		$(cap).append(sp);
		$(table).append(cap);

		var tbody = this.util.creatEle('tbody');
		var tr = this.util.creatEle('tr');
		var td = this.util.creatEle('td');
		tbody.setAttribute('id', this._conf.dataTable);
		table.appendChild(tbody);

		this._conf.calendar ? this.util.$(this._conf.calendar).appendChild(table) : document.body.appendChild(table);

		//构造月份等面板
		this.construct();

		//增加确定 和 取消按钮
		ctrl = [];

		//为上一年增加点击事件
		// this.util.addEvt(this.util.$('gri_preYear'), 'click', function(evt, target) {
			// that.preYear(that.reset);
		// });
		// //为下一年增加点击事件
		// this.util.addEvt(this.util.$('gri_nextYear'), 'click', function(evt, target) {
			// that.nextYear(that.reset);
		// });
		$('#gri_preYear').click(function(){
			that.preYear(that.reset);
		});
		$('#gri_nextYear').click(function(){
			that.nextYear(that.reset);
		});
		this.reset(this);
		return table;

	},
	//构造月份
	construct : function() {
		that = this;
		$('#'+this._conf.dataTable).html('');
		//months 容器，预留后面扩展的参数接口
		var months = {
			data : {
				1 : [1, 2, 3, 4],
				2 : [5, 6, 7, 8],
				3 : [9, 10, 11, 12]
			},
			typical : {
				1:'一', 2: '二' , 3:'三', 4:'四', 5:'五', 6:'六', 7:'七', 8:'八', 9:'九', 10:'十', 11:'十一', 12:'十二'
			},
			special : {}
		};

		//遍历月份接口
		for(var p in months.data) {
			var tr = this.util.creatEle('tr');
			for(var i = 0; i < months.data[p].length; i++) {
				var td = this.util.creatEle('td');
				td.innerHTML = months.typical[months.data[p][i]] + '月';
				td.setAttribute('id', 'gri_month' + months.data[p][i]);
				var method = this.addCss;
				//add by annyliu 增加判断，如果结束年是未来的年份，则不disable未来月份 2014-6-24
				//this._conf.endYear == this.util.getCurrentDate().year  --增加条件
				//判断是否超过今年
				//console.log(this._conf.endYear);
				if(this._conf.endYear == this.util.getCurrentDate().year && this.assemble.year == this.util.getCurrentDate().year &&  months.data[p][i] > this.util.getCurrentDate().month){
					$(td).addClass(this._conf.disabledCss);
				}
				//判断是否是区间选择
				else{

            		if(this._conf.period){
            			method = this.hdlPeriod;
            		}

            		if(window.attachEvent){
            			td.attachEvent('onclick', method);
            		}
            		else{
            			 td.addEventListener('click', method, false);
            		}

				}


				tr.appendChild(td);
			}
			//this.util.$(this._conf.dataTable).appendChild(tr);
			$('#'+this._conf.dataTable).append(tr);
		}

	},
	//上一年
	preYear : function(fn) {--this.assemble.year;
		this.util.$('gri_year').innerHTML = this.assemble.year + '年';
		fn && fn(this);
	},
	//下一年
	nextYear : function(fn) {++this.assemble.year;
		this.util.$('gri_year').innerHTML = this.assemble.year + '年';
		fn && fn(this);
	},
	//处理区间选择
	hdlPeriod : function(evt){
	    monthPicker.Params.click_num++

		//that.removeCss();
		var evt = window.event || evt, target = evt.srcElement || evt.target;
		var select_month = (/^gri_month(\d+)/).test(target.getAttribute('id')) && (/^gri_month(\d+)/).exec(target.getAttribute('id'))[1];
		var start = end = {};
		that.removeCss();
		//切换选中
		(monthPicker.Params.current == '' || monthPicker.Params.current == monthPicker.Constant.END_MONTH) ? (monthPicker.Params.current = monthPicker.Constant.START_MONTH) : (monthPicker.Params.current = monthPicker.Constant.END_MONTH);
		//target.setAttribute(that.util.getCla(), that._conf.selectCss);
		if( monthPicker.Params.current ==  monthPicker.Constant.START_MONTH){
			$(target).addClass(that._conf.selectCss);
			 monthPicker.Params.start_month = select_month;
			 monthPicker.Params.start_year = that.assemble.year;
			 var tmp = (select_month < 10) ? "0" + select_month : select_month;
			 that._conf.start_month = that.assemble.year + tmp;
		}
		else{
			 monthPicker.Params.end_month = select_month;
			 monthPicker.Params.end_year = that.assemble.year;
			 var tmp = (select_month < 10) ? "0" + select_month : select_month;
			 that._conf.end_month = that.assemble.year + tmp;

			/*
			start = that.util.format({year: monthPicker.Params.start_year, month: monthPicker.Params.start_month});
			end =  that.util.format({year: monthPicker.Params.end_year, month: monthPicker.Params.end_month});

			//这里做下比较，然后确定大小关系。
			if(new Date([start.year, start.month,'01'].join('-')).getTime() > new Date([end.year, end.month, '01'].join('-')).getTime()){
				var tmp = start;
				start = end;
				end= tmp;
			}

			debugger;
			//这里比较月份大小的逻辑中没有考虑到跨年的情况，这里修正一下：johnny@2014-01-08
			if(monthPicker.Params.start_year == monthPicker.Params.end_year){
				sm = Math.min( monthPicker.Params.end_month,  monthPicker.Params.start_month);
				em = Math.max( monthPicker.Params.end_month,  monthPicker.Params.start_month);
				for(var i = sm; i<=em; i++){
					$('#gri_month'+i).addClass(that._conf.selectCss);
				}
			}
			else{}
			*/
			var ret = that.periodCss();
			var start = ret.start, end = ret.end;
			//赋回页面显示
			if(start.year > end.year){
				that._conf.input.innerHTML = [end.year, end.month].join('') + that._conf.defaultText + [start.year, start.month].join('');
			}else if(start.year == end.year){//start.year <= end.year
				if(start.month > end.month){
					that._conf.input.innerHTML = [end.year, end.month].join('') + that._conf.defaultText + [start.year, start.month].join('');
				}else{
					that._conf.input.innerHTML = [start.year, start.month].join('') + that._conf.defaultText + [end.year, end.month].join('');
				}
			}else{
				that._conf.input.innerHTML = [start.year, start.month].join('') + that._conf.defaultText + [end.year, end.month].join('');
			}
			//提交，调用回调函数
			that._conf.callback({startDate:start.year+''+start.month+'01', endDate:end.year+''+end.month+'31'});
			that.util.$(that._conf.container).style.display = 'none';
		}

	},

	/**
	* ===========================================================
	* 样式处理，包括简单的单选月份，也包括区间选择的月份 ： start
	*/

	//增加样式
	addCss : function(evt) {
		that.removeCss();
		var evt = window.event || evt, target = evt.srcElement || evt.target;
		//target.setAttribute(that.util.getCla(), that._conf.selectCss);
		$(target).addClass(that._conf.selectCss);
		//赋值
		that.assemble.month = (/^gri_month(\d+)/).test(target.getAttribute('id')) && (/^gri_month(\d+)/).exec(target.getAttribute('id'))[1];
		//提交
		that.submit();

	},
	//去除样式
	removeCss : function() {
		//正则模糊匹配
		var reg = /^gri_month(\d+)/;
		var cells = $('#gri_monthPicker_table').find('td');
		for(var o in cells) {
			if(cells[o].id && reg.test(cells[o].id)) {
				// cells[o].removeAttribute(this.util.getCla());
				$(cells[o]).removeClass(this._conf.selectCss).removeClass(this._conf.disabledCss);
				if(this.assemble.year == this.util.getCurrentDate().year && cells[o].id.match(reg)[1] > this.util.getCurrentDate().month){
					$(cells[o]).addClass(this._conf.disabledCss);
				}
			}
		}
	},

	periodCss : function(){
		var start = that.util.format({year: monthPicker.Params.start_year, month: monthPicker.Params.start_month});
		var end =  that.util.format({year: monthPicker.Params.end_year, month: monthPicker.Params.end_month});

		//这里做下比较，然后确定大小关系。
		if(new Date([start.year, start.month,'01'].join('')).getTime() > new Date([end.year, end.month, '01'].join('')).getTime()){
			var tmp = start;
			start = end;
			end= tmp;
		}

		var sy = that._conf.start_month.substr(0, 4); // 开始的年
		var sm = that._conf.start_month.substr(4, 2); // 开始的月
		var ey = that._conf.end_month.substr(0, 4);   // 结束的年
		var em = that._conf.end_month.substr(4, 2);   // 结束的月

		if (monthPicker.Params.click_num != 1)
		{
    		if(sy == ey){
    			if(that.assemble.year == sy){
    				var min_month = Math.min(sm, em);
    			    var max_month = Math.max(sm, em);
    				for(var i = 1; i <= 12; i++){
    				    if(i >= min_month && i<= max_month){
    				        $('#gri_month'+i).addClass(that._conf.selectCss);
    				    }else{
    				        $('#gri_month'+i).addClass(that._conf.contentCss);
    				    }
    				}
    			}
    		}
    		else{
    			if(sy < that.assemble.year && that.assemble.year < ey){
    				for(var i = 1; i <= 12; i++){
    					$('#gri_month'+i).addClass(that._conf.selectCss);
    				}
    			}
    			else if(sy == that.assemble.year){
    				for(var i = 1; i <= 12; i++){
    				    if(i >= sm){
    				        $('#gri_month'+i).addClass(that._conf.selectCss);
    				    }else{
    				        $('#gri_month'+i).addClass(that._conf.contentCss);
    				    }
    				}
    			}
    			else if(ey == that.assemble.year){
    				for(var i = 1; i <= 12; i++){
        				if(i <= em){
    				        $('#gri_month'+i).addClass(that._conf.selectCss);
    				    }else{
    				        $('#gri_month'+i).addClass(that._conf.contentCss);
    				    }
    				}
    			}
    			else{
    				that.removeCss();
    			}
    		}
    	}


		//这里比较月份大小的逻辑中没有考虑到跨年的情况，这里修正一下：johnny@2014-01-08
		//if(monthPicker.Params.start_year == monthPicker.Params.end_year){
		//	if(that.assemble.year == start.year || '' == start.year){
		//		sm = Math.min( monthPicker.Params.end_month,  monthPicker.Params.start_month);
		//		em = Math.max( monthPicker.Params.end_month,  monthPicker.Params.start_month);
		//		for(var i = sm; i<=em; i++){
		//			$('#gri_month'+i).addClass(that._conf.selectCss);
		//		}
		//	}
		//	else{
		//		that.removeCss();
		//	}
		//
		//}
		//else{
		//	if(that.assemble.year == start.year){
		//		for(var i = start.month*1; i<= 12; i++){
		//			$('#gri_month'+i).addClass(that._conf.selectCss);
		//		}
		//	}
		//	else if(that.assemble.year == end.year){
		//		for(var i = 1; i<= end.month*1; i++){
		//			$('#gri_month'+i).addClass(that._conf.selectCss);
		//		}
		//	}
		//	else{
		//		that.removeCss();
		//	}
		//}

		return {'start': start, 'end':end};
	},
	/**
	* 样式处理，包括简单的单选月份，也包括区间选择的月份 ： end
	* =================================================================
	*/

	//取消
	cancel : function(evt) {
		var evt = window.event || evt, target = evt.srcElement || evt.target;
		!(target.id && (target.id == this._conf.id || target.id == this._conf.trigger) || (this._conf.period &&  monthPicker.Params.current ==  monthPicker.Constant.START_MONTH)|| target.className && (target.className == 'i_pre'|| target.className == 'i_next')) && $('#'+this._conf.container).length > 0 && $('#'+this._conf.container).hide();
		monthPicker.Params.click_num = 0;
	},
	//确定
	submit : function() {
		var result = [];
		fd = this.util.format(this.assemble);
		for(var p in fd) {
			result.push(fd[p]);
		}
		this.util.$(this._conf.container).style.display = 'none';
		//赋回原值
		this._conf.input.innerHTML = result.join('-');
		this._conf.callback(this.convertToDate(this.util.format(this.assemble)));

	},
	//reset 样式
	reset : function(obj) {
		//obj.removeCss();
		obj.construct();
		obj.util.$('gri_nextYear').style.display = (obj.assemble.year >= obj._conf.endYear ) ? 'none' : 'block';
		obj.util.$('gri_preYear').style.display = (obj.assemble.year <= obj._conf.startYear ) ? 'none' : 'block';
		//如果是当前年月，增加样式
		var c = obj.getCurrentShowDate();
		if(obj.util.format(obj.assemble).year == c.year && obj.util.format(obj.assemble).month == c.month) {
			$('#gri_month' + obj.assemble.month).addClass(obj._conf.selectCss);
		}
		if(obj._conf.period){
			obj.periodCss();
		}
	},
	//工具函数库
	util : {
		//取页面元素的的工具方法
		$ : function(id) {
			return document.getElementById(id);
		},
		//创建元素
		creatEle : function(ele) {
			return document.createElement(ele);
		},
		//增加事件
		addEvt : function(elem, type, hdl) {
			var callback = function(evt) {
				var evt = window.event || evt, target = evt.srcElement || evt.target;
				hdl(evt, target);
			};
			window.addEventListener && elem.addEventListener(type, callback, false) || window.attachEvent && elem.attachEvent('on' + type, callback);
		},
		//获得当前月份
		getCurrentDate : function() {
			return {
				'year' : new Date().getFullYear(),
				'month' : new Date().getMonth() + 1
			};
		},

		getCla: function(){
			return !!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1)?'class':'class';
		},

		//格式化，增加前导零
		format : function(obj) {
			return {
				'year' : obj.year,
				'month' : (obj.month < 10 ? '0' : '') + obj.month
			};
		}
	}
};

monthPicker.Constant = {
	START_MONTH : 'start_month',
	END_MONTH : 'end_month'

};
//存储一些全局变量
monthPicker.Params = {
	current : '',
	start_year : '',
	start_month : '',
	end_month : '',
	end_year : '',
	click_num : 0
};
