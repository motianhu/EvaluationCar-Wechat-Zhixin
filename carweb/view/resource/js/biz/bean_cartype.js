~function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var $createContainer = $('#for_create_container');
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;

	beautifulSelect2();

	function beautifulSelect2() {

		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}

	// 中文转拼音
	$("#carSetName").blur(function() {
		var carSetName = $("#carSetName").val() || '';
		carSetName = carSetName.trim();
		var pinyin = Util.getChineseCharacterPinyin(carSetName);
		pinyin = pinyin.toUpperCase();
		pinyin = pinyin.substr(0, 1);
		$("#carSetFirstName").val(pinyin);
	});

	initCarBrand(".brandName_sel");

	$("#query_carBrandId").on('change', function(e) {
		$("#select2-query_carSetId-container").html('请选择');
		$("#query_carSetId").val('');
		selectedCarSet('query_carSetId', $("#query_carBrandId").val(), null);
	});
	$("#carBrandId").on('change', function(e) {
		$("#select2-carSetId-container").html('请选择');
		$("#carSetId").val('');
		selectedCarSet('carSetId', $("#carBrandId").val(), null);
	});

	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			carBrandId : "",
			carSetId : "",
			carTypeName : "",
			fileType : "xls"
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.carTypeName = $("#query_carTypeName").val().trim();
			_queryParam.carBrandId = $("#query_carBrandId").val().trim();
			_queryParam.carSetId = $("#query_carSetId").val().trim();
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

	// 增加字典字段
	function addDict() {
		var carBrandId = $("#carBrandId").val().trim();
		var carSetId = $("#carSetId").val().trim();
		var carTypeName = $("#carTypeName").val().trim();
		var highPrice = $("#highPrice").val().trim();
		var lowPrice = $("#lowPrice").val().trim();
		var newCarPrice = $("#newCarPrice").val().trim();
		Util.ajax({
			type : "POST",
			url : requestContextPath + "/carType/addCarType.html",
			data : {
				carBrandId : carBrandId,
				carSetId : carSetId,
				carTypeName : carTypeName,
				newCarPrice : newCarPrice,
				highPrice : highPrice,
				lowPrice : lowPrice,
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					$createContainer.hide();
					search();
					clearForm();
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		}, "提交中");
	}

	/** 导出记录 */
	// window.exportData = function() {
	// if ($jTable.getAttributes().total === 0) {
	// $.msgbox.show({
	// 'type': 'info',
	// 'text': '没有可导出的记录',
	// 'title': '提示'
	// });
	// return;
	// }
	// Util.ajax({
	// url: requestContextPath + "/dictmanager/exportDict.html",
	// data: getParam(),
	// cache: false,
	// dataType: "text",
	// success: function(data) {
	// location.href = data;
	// }
	// }, "正在导出，请稍等...");
	// }
	function search() {
		$jTable.refreshTableData(getParam());
	}

	$(".searchbox input").keydown(function(event) {
		if (event.keyCode == 13) {
			search();
		}
	});

	$("#searchBtn").click(search);

	$("#create_btn").click(function() {
		if ($createContainer.is(':hidden')) {
			$createContainer.show();
		} else {
			$createContainer.hide();
		}
	});
	$("#create_confirm_btn").click(addDict);
	$("#create_cancel_btn").click(function() {
		$createContainer.hide();
	});

	/*
	 * 表格初始化，这里为了测试数据，url写的fake
	 */
	$jTable = $table.table({
		ajaxUrl : requestContextPath + "/carType/getCarTypeList.html",
		paramsJson : getParam(),
		pageKey : {
			total : "total",
			pageSize : "pageSize",
			curPage : "curPage"
		},
		tbodyMaker : function(data) {
			tableData = {};
			var dataSet = {
				total : data.total,
				list : ""
			};
			var dataList = [];
			var items = data.data;
			if (items) {
				for (var i = 0, len = items.length; i < len; i++) {
					var list = [];
					var curRow = items[i];
					tableData[curRow.id] = curRow;
					list.push({
						checked : false,
						rowid : curRow.id
					});
					list.push("<span class='icon-edit editrow' rowid='"
							+ curRow.id + "'>" + curRow.id + "</span>"); // 编号
					list.push(curRow.carBrandName);
					list.push(curRow.carSetName);
					list.push(curRow.carTypeName);
					list.push(curRow.newCarPrice);
					dataList.push(list);
				}
				;
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	function getCheckedRows() {
		var ids = [];
		var $checkboxs = $table.find("tbody").find(".table-check");
		for (var i = 0; i < $checkboxs.length; i++) {
			var cur = $($checkboxs[i]);
			ids.push(cur.attr("rowid"));
		}
		return {
			ids : ids
		};
	}

	function deleteDatas(rowids) {
		var ids = rowids.ids;
		ids = ids.join();
		Util.ajax({
			type : "POST",
			url : requestContextPath + "/carType/deleteCarType.html",
			data : {
				ids : ids
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					search();
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		}, "提交中");

	}

	$("#del_btn").on('click', function(e) {
		var rowids = getCheckedRows();

		if (rowids == null || rowids.ids.length <= 0) {
			$.msgbox.show({
				'type' : 'error',
				'text' : "请选择记录",
				'title' : '错误'
			});
		} else {
			$.msgbox.show({
				'type' : 'info',
				'text' : "确定删除数据？",
				'title' : '提示',
				'confirmCb' : function() {
					deleteDatas(rowids);
				}
			});
		}
	});

	/** 清空input数据* */
	function clearForm() {
		$("#carSetName").val("");
		$("#carSetFirstName").val("");
	}

	/** 行展开 */
	$table.on("click", '.editrow', function(e) {
		e.stopPropagation();
		var $this = $(this);
		var $thisTr = $this.parent().parent();
		var $thatTr = $thisTr.next();
		if (!$thatTr.find(".arrow").length) {
			var id = $this.attr("rowid");
			var curData = tableData[id];

			var $next = $thisTr.next();

			var isChecked = curData.status ? 'checked' : "";
			var temp = rowTemplateHtml.replace(/{rowid}/g, curData.id).replace(
					"{edit_carTypeName}", curData.carTypeName || "").replace(
					"{edit_highPrice}", curData.highPrice || "").replace(
					"{edit_lowPrice}", curData.lowPrice || "");
			temp = temp.replace("{edit_newCarPrice}", curData.newCarPrice || "")
			.replace("{edit_changShangZhiDaoJia}", curData.changShangZhiDaoJia || "")
			.replace("{edit_canKaoDiJia}", curData.canKaoDiJia || "")
			.replace("{edit_changShang}", curData.changShang || "")
			.replace("{edit_jiBie}", curData.jiBie || "")
			.replace("{edit_faDongJi}", curData.faDongJi || "")
			.replace("{edit_bianSuxiang}", curData.bianSuxiang || "")
			.replace("{edit_changGaoKuan}", curData.changGaoKuan || "")
			.replace("{edit_cheShenJieGou}", curData.cheShenJieGou || "")
			.replace("{edit_zuiGaoCheSu}", curData.zuiGaoCheSu || "")
			.replace("{edit_guanFang0_100}", curData.guanFang0_100 || "")
			.replace("{edit_shiCe0_100}", curData.shiCe0_100 || "")
			.replace("{edit_shiCe100_0}", curData.shiCe100_0 || "")
			.replace("{edit_shiCeYouHao}", curData.shiCeYouHao || "")
			.replace("{edit_gongXinBuYouHao}", curData.gongXinBuYouHao || "")
			.replace("{edit_shiCeLiDiJianXi}", curData.shiCeLiDiJianXi || "")
			.replace("{edit_zhengCheZhiBao}", curData.zhengCheZhiBao || "")
			.replace("{edit_changDu}", curData.changDu || "")
			.replace("{edit_kuanDu}", curData.kuanDu || "")
			.replace("{edit_gaoDu}", curData.gaoDu || "")
			.replace("{edit_zhouJu}", curData.zhouJu || "")
			.replace("{edit_qianLunTai}", curData.qianLunTai || "")
			.replace("{edit_houLunTai}", curData.houLunTai || "")
			.replace("{edit_zuiXiaoJianXi}", curData.zuiXiaoJianXi || "")
			.replace("{edit_zhengBeiZhiLiang}", curData.zhengBeiZhiLiang || "")
			.replace("{edit_cheShen}", curData.cheShen || "")
			.replace("{edit_cheMenShu}", curData.cheMenShu || "")
			.replace("{edit_zuoWeiShu}", curData.zuoWeiShu || "")
			.replace("{edit_youXiangRongji}", curData.youXiangRongji || "")
			.replace("{edit_xingLiXiangRongJi}", curData.xingLiXiangRongJi || "")
			.replace("{edit_faDongJiXingHao}", curData.faDongJiXingHao || "")
			.replace("{edit_paiLiang}", curData.paiLiang || "")
			.replace("{edit_jinQiXingShi}", curData.jinQiXingShi || "")
			.replace("{edit_qiGangPaiLie}", curData.qiGangPaiLie || "")
			.replace("{edit_qiGangShu}", curData.qiGangShu || "")
			.replace("{edit_meiGangQiMenShu}", curData.meiGangQiMenShu || "")
			.replace("{edit_yaSuoBi}", curData.yaSuoBi || "")
			.replace("{edit_peiQiJiGou}", curData.peiQiJiGou || "")
			.replace("{edit_gangJing}", curData.gangJing || "")
			.replace("{edit_xingCheng}", curData.xingCheng || "")
			.replace("{edit_zuiDaMali}", curData.zuiDaMali || "")
			.replace("{edit_zuiDaGongLv}", curData.zuiDaGongLv || "")
			.replace("{edit_zuiDaZhuangSu}", curData.zuiDaZhuangSu || "")
			.replace("{edit_zuiDaNiuJu}", curData.zuiDaNiuJu || "")
			.replace("{edit_zuiDaNiuJuZhuanSu}", curData.zuiDaNiuJuZhuanSu || "")
			.replace("{edit_faDongJiTeYouJishu}", curData.faDongJiTeYouJishu || "")
			.replace("{edit_ranLiaoXingShi}", curData.ranLiaoXingShi || "")
			.replace("{edit_ranYouBiaoHao}", curData.ranYouBiaoHao || "")
			.replace("{edit_gongYouFangShi}", curData.gongYouFangShi || "")
			.replace("{edit_gangGaiCaiLiao}", curData.gangGaiCaiLiao || "")
			.replace("{edit_gangTiCaiLiao}", curData.gangTiCaiLiao || "")
			.replace("{edit_huanBaoBiaoZhun}", curData.huanBaoBiaoZhun || "")
			.replace("{edit_dianJiZongGongLv}", curData.dianJiZongGongLv || "")
			.replace("{edit_dianJiZongNiuJu}", curData.dianJiZongNiuJu || "")
			.replace("{edit_qianDianJiGongLv}", curData.qianDianJiGongLv || "")
			.replace("{edit_qianDianJiNiuJu}", curData.qianDianJiNiuJu || "")
			.replace("{edit_houDianJiGongLv}", curData.houDianJiGongLv || "")
			.replace("{edit_houDianJiGongNiuJu}", curData.houDianJiGongNiuJu || "")
			.replace("{edit_dianChiXuHang}", curData.dianChiXuHang || "")
			.replace("{edit_dianChiRongLiang}", curData.dianChiRongLiang || "")
			.replace("{edit_jianCheng}", curData.jianCheng || "")
			.replace("{edit_dangWeiGeShu}", curData.dangWeiGeShu || "")
			.replace("{edit_bianSuXiangLeiXing}", curData.bianSuXiangLeiXing || "")
			.replace("{edit_quDongFangShi}", curData.quDongFangShi || "")
			.replace("{edit_siQuXingShi}", curData.siQuXingShi || "")
			.replace("{edit_zhongYangChaSuQi}", curData.zhongYangChaSuQi || "")
			.replace("{edit_qianXuanJiaLeiXing}", curData.qianXuanJiaLeiXing || "")
			.replace("{edit_houXuanJiaLeiXing}", curData.houXuanJiaLeiXing || "")
			.replace("{edit_zhuLiLeiXing}", curData.zhuLiLeiXing || "")
			.replace("{edit_cheTiJieGou}", curData.cheTiJieGou || "")
			.replace("{edit_qianZhiDongQiLeiX}", curData.qianZhiDongQiLeiX || "")
			.replace("{edit_houZhiDongQiLeiX}", curData.houZhiDongQiLeiX || "")
			.replace("{edit_zhuCheZhiDongLeiX}", curData.zhuCheZhiDongLeiX || "")
			.replace("{edit_qianLunTaiGuiGe}", curData.qianLunTaiGuiGe || "")
			.replace("{edit_houLunTaiGuiGe}", curData.houLunTaiGuiGe || "")
			.replace("{edit_beiTaiGuiGe}", curData.beiTaiGuiGe || "")
			.replace("{edit_jiaShiZuoAnQuanQiN}", curData.jiaShiZuoAnQuanQiN || "")
			.replace("{edit_ceQiNang}", curData.ceQiNang || "")
			.replace("{edit_touBuQiNang}", curData.touBuQiNang || "")
			.replace("{edit_xiBuQiNang}", curData.xiBuQiNang || "")
			.replace("{edit_taiYaJianCeZhuangZ}", curData.taiYaJianCeZhuangZ || "")
			.replace("{edit_LingTaiYaJiXuXingS}", curData.LingTaiYaJiXuXingS || "")
			.replace("{edit_anQuanDaiTiShi}", curData.anQuanDaiTiShi || "")
			.replace("{edit_erTongZuoYiJieKou}", curData.erTongZuoYiJieKou || "")
			.replace("{edit_faDongJiFangDong}", curData.faDongJiFangDong || "")
			.replace("{edit_cheNeiZhongKongSuo}", curData.cheNeiZhongKongSuo || "")
			.replace("{edit_yaoKongYaoShi}", curData.yaoKongYaoShi || "")
			.replace("{edit_wuYaoShiQiDongXiT}", curData.wuYaoShiQiDongXiT || "")
			.replace("{edit_wuYaoShiJinRuXiT}", curData.wuYaoShiJinRuXiT || "")
			.replace("{edit_ABSFangBaoSi}", curData.ABSFangBaoSi || "")
			.replace("{edit_zhiDongLiFenPei}", curData.zhiDongLiFenPei || "")
			.replace("{edit_shaCheFuZhu}", curData.shaCheFuZhu || "")
			.replace("{edit_qianYinLiKongZhi}", curData.qianYinLiKongZhi || "")
			.replace("{edit_cheShenWenDingKongZ}", curData.cheShenWenDingKongZ || "")
			.replace("{edit_shangPoFuZhu}", curData.shangPoFuZhu || "")
			.replace("{edit_ziDongZhuChe}", curData.ziDongZhuChe || "")
			.replace("{edit_douPoHuanJiang}", curData.douPoHuanJiang || "")
			.replace("{edit_keBianXuanJia}", curData.keBianXuanJia || "")
			.replace("{edit_kongQianXuanJia}", curData.kongQianXuanJia || "")
			.replace("{edit_keBianZhuanXiangBi}", curData.keBianZhuanXiangBi || "")
			.replace("{edit_qianQiaoXianHuaCSQ}", curData.qianQiaoXianHuaCSQ || "")
			.replace("{edit_zhongYangChaSuQiSZGN}", curData.zhongYangChaSuQiSZGN || "")
			.replace("{edit_houQiaoXianHuaCSQ}", curData.houQiaoXianHuaCSQ || "")
			.replace("{edit_dianDongTianChuang}", curData.dianDongTianChuang || "")
			.replace("{edit_quanJingTianChuang}", curData.quanJingTianChuang || "")
			.replace("{edit_yunDongWaiGuanTaoJ}", curData.yunDongWaiGuanTaoJ || "")
			.replace("{edit_LvHeJinLunQuan}", curData.LvHeJinLunQuan || "")
			.replace("{edit_dianDongXiheJin}", curData.dianDongXiheJin || "")
			.replace("{edit_ceHuaMen}", curData.ceHuaMen || "")
			.replace("{edit_dianDongHouBeiXiang}", curData.dianDongHouBeiXiang || "")
			.replace("{edit_ganYingHouBeiXiang}", curData.ganYingHouBeiXiang || "")
			.replace("{edit_cheDingXingLiJia}", curData.cheDingXingLiJia || "")
			.replace("{edit_zhenPiFangXiangPan}", curData.zhenPiFangXiangPan || "")
			.replace("{edit_fangXiangPanTiaoJie}", curData.fangXiangPanTiaoJie || "")
			.replace("{edit_fangXiangPanDianDTJ}", curData.fangXiangPanDianDTJ || "")
			.replace("{edit_duoGongNengFangXP}", curData.duoGongNengFangXP || "")
			.replace("{edit_fangXiangPanHuanDang}", curData.fangXiangPanHuanDang || "")
			.replace("{edit_FangXiangPanJiaRe}", curData.FangXiangPanJiaRe || "")
			.replace("{edit_fangXiangPanJiYi}", curData.fangXiangPanJiYi || "")
			.replace("{edit_dingSuXunHang}", curData.dingSuXunHang || "")
			.replace("{edit_zhuCheLeiDa}", curData.zhuCheLeiDa || "")
			.replace("{edit_daoCheShiPinYingX}", curData.daoCheShiPinYingX || "")
			.replace("{edit_xingCheDiaoXianShiP}", curData.xingCheDiaoXianShiP || "")
			.replace("{edit_quanYeJingYeBiaoPan}", curData.quanYeJingYeBiaoPan || "")
			.replace("{edit_HUDTaiTouShuZiXianS}", curData.HUDTaiTouShuZiXianS || "")
			.replace("{edit_zuoYeCaiZhi}", curData.zuoYeCaiZhi || "")
			.replace("{edit_yunDongFengGeZuoYi}", curData.yunDongFengGeZuoYi || "")
			.replace("{edit_zuoYeGaoDiTiaoJie}", curData.zuoYeGaoDiTiaoJie || "")
			.replace("{edit_yaoBuZhiChengTiaoJie}", curData.yaoBuZhiChengTiaoJie || "")
			.replace("{edit_jianBuZhiChengTiaoJ}", curData.jianBuZhiChengTiaoJ || "")
			.replace("{edit_jiaShiZuoDianDongTJ}", curData.jiaShiZuoDianDongTJ || "")
			.replace("{edit_diErPaiZuoYiDianDTJ}", curData.diErPaiZuoYiDianDTJ || "")
			.replace("{edit_diErPaiZuoYiYiDong}", curData.diErPaiZuoYiYiDong || "")
			.replace("{edit_houPaiZuoYiDianDTJ}", curData.houPaiZuoYiDianDTJ || "")
			.replace("{edit_dianDongZuoYiJiYi}", curData.dianDongZuoYiJiYi || "")
			.replace("{edit_zuoYiJiaRe}", curData.zuoYiJiaRe || "")
			.replace("{edit_zuoYiTongFeng}", curData.zuoYiTongFeng || "")
			.replace("{edit_zuoYiAnMo}", curData.zuoYiAnMo || "")
			.replace("{edit_diSanPaiZuoYi}", curData.diSanPaiZuoYi || "")
			.replace("{edit_zuoYiFangDaoFangShi}", curData.zuoYiFangDaoFangShi || "")
			.replace("{edit_zhongYangFuShou}", curData.zhongYangFuShou || "")
			.replace("{edit_HouPaiBeiJia}", curData.HouPaiBeiJia || "")
			.replace("{edit_GPSDaoHangXiTong}", curData.GPSDaoHangXiTong || "")
			.replace("{edit_DingWeiHuDongFuWu}", curData.DingWeiHuDongFuWu || "")
			.replace("{edit_zhongKongCaiSeDaPing}", curData.zhongKongCaiSeDaPing || "")
			.replace("{edit_lanYaCheZaiDianHua}", curData.lanYaCheZaiDianHua || "")
			.replace("{edit_cheZaiDianShi}", curData.cheZaiDianShi || "")
			.replace("{edit_houPaiYeJingPing}", curData.houPaiYeJingPing || "")
			.replace("{edit_DianYuan_220V_230V}", curData.DianYuan_220V_230V || "")
			.replace("{edit_waiJieYinYuanJieKou}", curData.waiJieYinYuanJieKou || "")
			.replace("{edit_zhiChi_MP3_WMA}", curData.zhiChi_MP3_WMA || "")
			.replace("{edit_duoMeiTiXiTong}", curData.duoMeiTiXiTong || "")
			.replace("{edit_yangShengQiPinPai}", curData.yangShengQiPinPai || "")
			.replace("{edit_yangShengQiShuLiang}", curData.yangShengQiShuLiang || "")
			.replace("{edit_jinGuangDeng}", curData.jinGuangDeng || "")
			.replace("{edit_yuanGuangDeng}", curData.yuanGuangDeng || "")
			.replace("{edit_riJianXingCheDeng}", curData.riJianXingCheDeng || "")
			.replace("{edit_ziShiYingYuanJinG}", curData.ziShiYingYuanJinG || "")
			.replace("{edit_ziZhuTouDeng}", curData.ziZhuTouDeng || "")
			.replace("{edit_zhuangXiangFuZhuDeng}", curData.zhuangXiangFuZhuDeng || "")
			.replace("{edit_ZhuangXiangTouDeng}", curData.ZhuangXiangTouDeng || "")
			.replace("{edit_qianWuDeng}", curData.qianWuDeng || "")
			.replace("{edit_daDengGaoDuKeTiao}", curData.daDengGaoDuKeTiao || "")
			.replace("{edit_daDengQingXiZhuangZ}", curData.daDengQingXiZhuangZ || "")
			.replace("{edit_cheNeiFenWeiDeng}", curData.cheNeiFenWeiDeng || "")
			.replace("{edit_dianDongCheChuang}", curData.dianDongCheChuang || "")
			.replace("{edit_cheChuangFangJiaShou}", curData.cheChuangFangJiaShou || "")
			.replace("{edit_fangZiWaiXian}", curData.fangZiWaiXian || "")
			.replace("{edit_houShiJingDianDongTJ}", curData.houShiJingDianDongTJ || "")
			.replace("{edit_houShiJingJiaRe}", curData.houShiJingJiaRe || "")
			.replace("{edit_houShiJingZiDongXM}", curData.houShiJingZiDongXM || "")
			.replace("{edit_houShiJingDianDongZD}", curData.houShiJingDianDongZD || "")
			.replace("{edit_houShiJingJiYi}", curData.houShiJingJiYi || "")
			.replace("{edit_houFengDangZheYL}", curData.houFengDangZheYL || "")
			.replace("{edit_houPaiCeZZheYangL}", curData.houPaiCeZZheYangL || "")
			.replace("{edit_houPaiCeYinSiPoLi}", curData.houPaiCeYinSiPoLi || "")
			.replace("{edit_zheYangBanHuaZhuangJ}", curData.zheYangBanHuaZhuangJ || "")
			.replace("{edit_houYuShua}", curData.houYuShua || "")
			.replace("{edit_ganYingYuShua}", curData.ganYingYuShua || "")
			.replace("{edit_kongTiaoKongZhiFS}", curData.kongTiaoKongZhiFS || "")
			.replace("{edit_houPaiDuLiKongTiao}", curData.houPaiDuLiKongTiao || "")
			.replace("{edit_houZuoChuFengKou}", curData.houZuoChuFengKou || "")
			.replace("{edit_wenDuFenQuKongZhi}", curData.wenDuFenQuKongZhi || "")
			.replace("{edit_cheNeiKongQiTiaoJie}", curData.cheNeiKongQiTiaoJie || "")
			.replace("{edit_cheZaiBingXiang}", curData.cheZaiBingXiang || "")
			.replace("{edit_ziDongBoCheRuWei}", curData.ziDongBoCheRuWei || "")
			.replace("{edit_faDongJiQiTingJiShu}", curData.faDongJiQiTingJiShu || "")
			.replace("{edit_bingXianJiShu}", curData.bingXianJiShu || "")
			.replace("{edit_cheDaoPianLiYuJing}", curData.cheDaoPianLiYuJing || "")
			.replace("{edit_zhuDongShaChe}", curData.zhuDongShaChe || "")
			.replace("{edit_zhengTiZhuangXiangXT}", curData.zhengTiZhuangXiangXT || "")
			.replace("{edit_yeShiXiTong}", curData.yeShiXiTong || "")
			.replace("{edit_zhongKongYeJingPing}", curData.zhongKongYeJingPing || "")
			.replace("{edit_ziShiYingXunHang}", curData.ziShiYingXunHang || "")
			.replace("{edit_quanJingSheXiangTou}", curData.quanJingSheXiangTou || "")
			.replace("{edit_daiJiYiGongNengZDFX}", curData.daiJiYiGongNengZDFX || "")
			.replace("{edit_shuangShanQiDaDeng}", curData.shuangShanQiDaDeng || "")
			.replace("{edit_zhiNengYaoShi}", curData.zhiNengYaoShi || "")
			.replace("{edit_xuanZhuangBao4}", curData.xuanZhuangBao4 || "")
			.replace("{edit_waiGuanYanSeZhongW}", curData.waiGuanYanSeZhongW || "")
			.replace("{edit_waiGuanYanSe}", curData.waiGuanYanSe || "")
			.replace("{edit_neiShiYanSeZhongW}", curData.neiShiYanSeZhongW || "")
			.replace("{edit_neiShiYanSe}", curData.neiShiYanSe || "");
			var trHtml = unfoldTrHtml.replace("{0}", temp);
			$(".row-edit-container").remove();
			$thisTr.after($(trHtml));

			$(".beautifulSelect2").select2({
				theme : "classic"
			});

			$("#carBrandId option").each(function() {
				var oValue = $(this).val().toString();
				var oText = $(this).text().toString();
				var option = $("<option>").val(oValue).text(oText);
				$("#edit_carBrandId").append(option);
			});
			// 设置值
			$("#edit_carBrandId").find(
					"option[value=" + curData.carBrandId + "]").attr(
					"selected", true);
			$("#select2-edit_carBrandId-container").html(curData.carBrandName);

			selectedCarSet('edit_carSetId', $("#edit_carBrandId").val(),
					curData.carSetId);

			$("#edit_carBrandId").on(
					'change',
					function(e) {
						$("#select2-edit_carSetId-container").html('请选择');
						$("#edit_carSetId").val('');
						selectedCarSet('edit_carSetId', $("#edit_carBrandId")
								.val(), null);
					});
			
			// Default Action
			$(".editTabBox .tab_content").hide(); // Hide all
			// content
			$(".editTabBox ul.tabs li:first")
					.addClass("active").show(); // Activate
			// first tab
			$(".editTabBox .tab_content:first").show(); // Show
			// first tab content On Click Event
			$(".editTabBox ul.tabs li").click(
					function() {
						$(".editTabBox ul.tabs li")
								.removeClass("active"); // Remove
						// any "active" class
						$(this).addClass("active"); // Add
						// "active" class to selected tab
						$(".editTabBox .tab_content").hide(); // Hide
						// all tab content
						var activeTab = $(this).find("a").attr(
								"href"); // Find the rel
						// attribute value to identify the
						// active tab + content
						$(activeTab).fadeIn(); // Fade in the
						// active content
						return false;
					});			

			$("#detail_info").accordion({
				active : 0,
				header : "h3",
				heightStyle : "100%",
			});

		} else {
			return false;
		}
	});

	/** 行编辑-确定 */
	$table.on("click", '#dict_detail_confirm', function(e) {
		var carSetId = $('#edit_carSetId').val().trim();
		var carBrandId = $('#edit_carBrandId').val().trim();
		var carTypeName = $('#edit_carTypeName').val().trim();
		var highPrice = $("#edit_highPrice").val().trim();
		var lowPrice = $("#edit_lowPrice").val().trim();
		var id = $(this).attr("rowid");
		Util.ajax({
			type : "POST",
			url : requestContextPath + "/carType/editCarType.html",
			data : {
				id : id,
				carBrandId : carBrandId,
				carSetId : carSetId,
				carTypeName : carTypeName,
				highPrice : highPrice,
				lowPrice : lowPrice,
				newCarPrice : $('#edit_newCarPrice').val(),			
				changShangZhiDaoJia : $('#edit_changShangZhiDaoJia').val(),
				canKaoDiJia : $('#edit_canKaoDiJia').val(),
				changShang : $('#edit_changShang').val(),
				jiBie : $('#edit_jiBie').val(),
				faDongJi : $('#edit_faDongJi').val(),
				bianSuxiang : $('#edit_bianSuxiang').val(),
				changGaoKuan : $('#edit_changGaoKuan').val(),
				cheShenJieGou : $('#edit_cheShenJieGou').val(),
				zuiGaoCheSu : $('#edit_zuiGaoCheSu').val(),
				guanFang0_100 : $('#edit_guanFang0_100').val(),
				shiCe0_100 : $('#edit_shiCe0_100').val(),
				shiCe100_0 : $('#edit_shiCe100_0').val(),
				shiCeYouHao : $('#edit_shiCeYouHao').val(),
				gongXinBuYouHao : $('#edit_gongXinBuYouHao').val(),
				shiCeLiDiJianXi : $('#edit_shiCeLiDiJianXi').val(),
				zhengCheZhiBao : $('#edit_zhengCheZhiBao').val(),
				changDu : $('#edit_changDu').val(),
				kuanDu : $('#edit_kuanDu').val(),
				gaoDu : $('#edit_gaoDu').val(),
				zhouJu : $('#edit_zhouJu').val(),
				qianLunTai : $('#edit_qianLunTai').val(),
				houLunTai : $('#edit_houLunTai').val(),
				zuiXiaoJianXi : $('#edit_zuiXiaoJianXi').val(),
				zhengBeiZhiLiang : $('#edit_zhengBeiZhiLiang').val(),
				cheShen : $('#edit_cheShen').val(),
				cheMenShu : $('#edit_cheMenShu').val(),
				zuoWeiShu : $('#edit_zuoWeiShu').val(),
				youXiangRongji : $('#edit_youXiangRongji').val(),
				xingLiXiangRongJi : $('#edit_xingLiXiangRongJi').val(),
				faDongJiXingHao : $('#edit_faDongJiXingHao').val(),
				paiLiang : $('#edit_paiLiang').val(),
				jinQiXingShi : $('#edit_jinQiXingShi').val(),
				qiGangPaiLie : $('#edit_qiGangPaiLie').val(),
				qiGangShu : $('#edit_qiGangShu').val(),
				meiGangQiMenShu : $('#edit_meiGangQiMenShu').val(),
				yaSuoBi : $('#edit_yaSuoBi').val(),
				peiQiJiGou : $('#edit_peiQiJiGou').val(),
				gangJing : $('#edit_gangJing').val(),
				xingCheng : $('#edit_xingCheng').val(),
				zuiDaMali : $('#edit_zuiDaMali').val(),
				zuiDaGongLv : $('#edit_zuiDaGongLv').val(),
				zuiDaZhuangSu : $('#edit_zuiDaZhuangSu').val(),
				zuiDaNiuJu : $('#edit_zuiDaNiuJu').val(),
				zuiDaNiuJuZhuanSu : $('#edit_zuiDaNiuJuZhuanSu').val(),
				faDongJiTeYouJishu : $('#edit_faDongJiTeYouJishu').val(),
				ranLiaoXingShi : $('#edit_ranLiaoXingShi').val(),
				ranYouBiaoHao : $('#edit_ranYouBiaoHao').val(),
				gongYouFangShi : $('#edit_gongYouFangShi').val(),
				gangGaiCaiLiao : $('#edit_gangGaiCaiLiao').val(),
				gangTiCaiLiao : $('#edit_gangTiCaiLiao').val(),
				huanBaoBiaoZhun : $('#edit_huanBaoBiaoZhun').val(),
				dianJiZongGongLv : $('#edit_dianJiZongGongLv').val(),
				dianJiZongNiuJu : $('#edit_dianJiZongNiuJu').val(),
				qianDianJiGongLv : $('#edit_qianDianJiGongLv').val(),
				qianDianJiNiuJu : $('#edit_qianDianJiNiuJu').val(),
				houDianJiGongLv : $('#edit_houDianJiGongLv').val(),
				houDianJiGongNiuJu : $('#edit_houDianJiGongNiuJu').val(),
				dianChiXuHang : $('#edit_dianChiXuHang').val(),
				dianChiRongLiang : $('#edit_dianChiRongLiang').val(),
				jianCheng : $('#edit_jianCheng').val(),
				dangWeiGeShu : $('#edit_dangWeiGeShu').val(),
				bianSuXiangLeiXing : $('#edit_bianSuXiangLeiXing').val(),
				quDongFangShi : $('#edit_quDongFangShi').val(),
				siQuXingShi : $('#edit_siQuXingShi').val(),
				zhongYangChaSuQi : $('#edit_zhongYangChaSuQi').val(),
				qianXuanJiaLeiXing : $('#edit_qianXuanJiaLeiXing').val(),
				houXuanJiaLeiXing : $('#edit_houXuanJiaLeiXing').val(),
				zhuLiLeiXing : $('#edit_zhuLiLeiXing').val(),
				cheTiJieGou : $('#edit_cheTiJieGou').val(),
				qianZhiDongQiLeiX : $('#edit_qianZhiDongQiLeiX').val(),
				houZhiDongQiLeiX : $('#edit_houZhiDongQiLeiX').val(),
				zhuCheZhiDongLeiX : $('#edit_zhuCheZhiDongLeiX').val(),
				qianLunTaiGuiGe : $('#edit_qianLunTaiGuiGe').val(),
				houLunTaiGuiGe : $('#edit_houLunTaiGuiGe').val(),
				beiTaiGuiGe : $('#edit_beiTaiGuiGe').val(),
				jiaShiZuoAnQuanQiN : $('#edit_jiaShiZuoAnQuanQiN').val(),
				ceQiNang : $('#edit_ceQiNang').val(),
				touBuQiNang : $('#edit_touBuQiNang').val(),
				xiBuQiNang : $('#edit_xiBuQiNang').val(),
				taiYaJianCeZhuangZ : $('#edit_taiYaJianCeZhuangZ').val(),
				LingTaiYaJiXuXingS : $('#edit_LingTaiYaJiXuXingS').val(),
				anQuanDaiTiShi : $('#edit_anQuanDaiTiShi').val(),
				erTongZuoYiJieKou : $('#edit_erTongZuoYiJieKou').val(),
				faDongJiFangDong : $('#edit_faDongJiFangDong').val(),
				cheNeiZhongKongSuo : $('#edit_cheNeiZhongKongSuo').val(),
				yaoKongYaoShi : $('#edit_yaoKongYaoShi').val(),
				wuYaoShiQiDongXiT : $('#edit_wuYaoShiQiDongXiT').val(),
				wuYaoShiJinRuXiT : $('#edit_wuYaoShiJinRuXiT').val(),
				ABSFangBaoSi : $('#edit_ABSFangBaoSi').val(),
				zhiDongLiFenPei : $('#edit_zhiDongLiFenPei').val(),
				shaCheFuZhu : $('#edit_shaCheFuZhu').val(),
				qianYinLiKongZhi : $('#edit_qianYinLiKongZhi').val(),
				cheShenWenDingKongZ : $('#edit_cheShenWenDingKongZ').val(),
				shangPoFuZhu : $('#edit_shangPoFuZhu').val(),
				ziDongZhuChe : $('#edit_ziDongZhuChe').val(),
				douPoHuanJiang : $('#edit_douPoHuanJiang').val(),
				keBianXuanJia : $('#edit_keBianXuanJia').val(),
				kongQianXuanJia : $('#edit_kongQianXuanJia').val(),
				keBianZhuanXiangBi : $('#edit_keBianZhuanXiangBi').val(),
				qianQiaoXianHuaCSQ : $('#edit_qianQiaoXianHuaCSQ').val(),
				zhongYangChaSuQiSZGN : $('#edit_zhongYangChaSuQiSZGN').val(),
				houQiaoXianHuaCSQ : $('#edit_houQiaoXianHuaCSQ').val(),
				dianDongTianChuang : $('#edit_dianDongTianChuang').val(),
				quanJingTianChuang : $('#edit_quanJingTianChuang').val(),
				yunDongWaiGuanTaoJ : $('#edit_yunDongWaiGuanTaoJ').val(),
				LvHeJinLunQuan : $('#edit_LvHeJinLunQuan').val(),
				dianDongXiheJin : $('#edit_dianDongXiheJin').val(),
				ceHuaMen : $('#edit_ceHuaMen').val(),
				dianDongHouBeiXiang : $('#edit_dianDongHouBeiXiang').val(),
				ganYingHouBeiXiang : $('#edit_ganYingHouBeiXiang').val(),
				cheDingXingLiJia : $('#edit_cheDingXingLiJia').val(),
				zhenPiFangXiangPan : $('#edit_zhenPiFangXiangPan').val(),
				fangXiangPanTiaoJie : $('#edit_fangXiangPanTiaoJie').val(),
				fangXiangPanDianDTJ : $('#edit_fangXiangPanDianDTJ').val(),
				duoGongNengFangXP : $('#edit_duoGongNengFangXP').val(),
				fangXiangPanHuanDang : $('#edit_fangXiangPanHuanDang').val(),
				FangXiangPanJiaRe : $('#edit_FangXiangPanJiaRe').val(),
				fangXiangPanJiYi : $('#edit_fangXiangPanJiYi').val(),
				dingSuXunHang : $('#edit_dingSuXunHang').val(),
				zhuCheLeiDa : $('#edit_zhuCheLeiDa').val(),
				daoCheShiPinYingX : $('#edit_daoCheShiPinYingX').val(),
				xingCheDiaoXianShiP : $('#edit_xingCheDiaoXianShiP').val(),
				quanYeJingYeBiaoPan : $('#edit_quanYeJingYeBiaoPan').val(),
				HUDTaiTouShuZiXianS : $('#edit_HUDTaiTouShuZiXianS').val(),
				zuoYeCaiZhi : $('#edit_zuoYeCaiZhi').val(),
				yunDongFengGeZuoYi : $('#edit_yunDongFengGeZuoYi').val(),
				zuoYeGaoDiTiaoJie : $('#edit_zuoYeGaoDiTiaoJie').val(),
				yaoBuZhiChengTiaoJie : $('#edit_yaoBuZhiChengTiaoJie').val(),
				jianBuZhiChengTiaoJ : $('#edit_jianBuZhiChengTiaoJ').val(),
				jiaShiZuoDianDongTJ : $('#edit_jiaShiZuoDianDongTJ').val(),
				diErPaiZuoYiDianDTJ : $('#edit_diErPaiZuoYiDianDTJ').val(),
				diErPaiZuoYiYiDong : $('#edit_diErPaiZuoYiYiDong').val(),
				houPaiZuoYiDianDTJ : $('#edit_houPaiZuoYiDianDTJ').val(),
				dianDongZuoYiJiYi : $('#edit_dianDongZuoYiJiYi').val(),
				zuoYiJiaRe : $('#edit_zuoYiJiaRe').val(),
				zuoYiTongFeng : $('#edit_zuoYiTongFeng').val(),
				zuoYiAnMo : $('#edit_zuoYiAnMo').val(),
				diSanPaiZuoYi : $('#edit_diSanPaiZuoYi').val(),
				zuoYiFangDaoFangShi : $('#edit_zuoYiFangDaoFangShi').val(),
				zhongYangFuShou : $('#edit_zhongYangFuShou').val(),
				HouPaiBeiJia : $('#edit_HouPaiBeiJia').val(),
				GPSDaoHangXiTong : $('#edit_GPSDaoHangXiTong').val(),
				DingWeiHuDongFuWu : $('#edit_DingWeiHuDongFuWu').val(),
				zhongKongCaiSeDaPing : $('#edit_zhongKongCaiSeDaPing').val(),
				lanYaCheZaiDianHua : $('#edit_lanYaCheZaiDianHua').val(),
				cheZaiDianShi : $('#edit_cheZaiDianShi').val(),
				houPaiYeJingPing : $('#edit_houPaiYeJingPing').val(),
				DianYuan_220V_230V : $('#edit_DianYuan_220V_230V').val(),
				waiJieYinYuanJieKou : $('#edit_waiJieYinYuanJieKou').val(),
				zhiChi_MP3_WMA : $('#edit_zhiChi_MP3_WMA').val(),
				duoMeiTiXiTong : $('#edit_duoMeiTiXiTong').val(),
				yangShengQiPinPai : $('#edit_yangShengQiPinPai').val(),
				yangShengQiShuLiang : $('#edit_yangShengQiShuLiang').val(),
				jinGuangDeng : $('#edit_jinGuangDeng').val(),
				yuanGuangDeng : $('#edit_yuanGuangDeng').val(),
				riJianXingCheDeng : $('#edit_riJianXingCheDeng').val(),
				ziShiYingYuanJinG : $('#edit_ziShiYingYuanJinG').val(),
				ziZhuTouDeng : $('#edit_ziZhuTouDeng').val(),
				zhuangXiangFuZhuDeng : $('#edit_zhuangXiangFuZhuDeng').val(),
				ZhuangXiangTouDeng : $('#edit_ZhuangXiangTouDeng').val(),
				qianWuDeng : $('#edit_qianWuDeng').val(),
				daDengGaoDuKeTiao : $('#edit_daDengGaoDuKeTiao').val(),
				daDengQingXiZhuangZ : $('#edit_daDengQingXiZhuangZ').val(),
				cheNeiFenWeiDeng : $('#edit_cheNeiFenWeiDeng').val(),
				dianDongCheChuang : $('#edit_dianDongCheChuang').val(),
				cheChuangFangJiaShou : $('#edit_cheChuangFangJiaShou').val(),
				fangZiWaiXian : $('#edit_fangZiWaiXian').val(),
				houShiJingDianDongTJ : $('#edit_houShiJingDianDongTJ').val(),
				houShiJingJiaRe : $('#edit_houShiJingJiaRe').val(),
				houShiJingZiDongXM : $('#edit_houShiJingZiDongXM').val(),
				houShiJingDianDongZD : $('#edit_houShiJingDianDongZD').val(),
				houShiJingJiYi : $('#edit_houShiJingJiYi').val(),
				houFengDangZheYL : $('#edit_houFengDangZheYL').val(),
				houPaiCeZZheYangL : $('#edit_houPaiCeZZheYangL').val(),
				houPaiCeYinSiPoLi : $('#edit_houPaiCeYinSiPoLi').val(),
				zheYangBanHuaZhuangJ : $('#edit_zheYangBanHuaZhuangJ').val(),
				houYuShua : $('#edit_houYuShua').val(),
				ganYingYuShua : $('#edit_ganYingYuShua').val(),
				kongTiaoKongZhiFS : $('#edit_kongTiaoKongZhiFS').val(),
				houPaiDuLiKongTiao : $('#edit_houPaiDuLiKongTiao').val(),
				houZuoChuFengKou : $('#edit_houZuoChuFengKou').val(),
				wenDuFenQuKongZhi : $('#edit_wenDuFenQuKongZhi').val(),
				cheNeiKongQiTiaoJie : $('#edit_cheNeiKongQiTiaoJie').val(),
				cheZaiBingXiang : $('#edit_cheZaiBingXiang').val(),
				ziDongBoCheRuWei : $('#edit_ziDongBoCheRuWei').val(),
				faDongJiQiTingJiShu : $('#edit_faDongJiQiTingJiShu').val(),
				bingXianJiShu : $('#edit_bingXianJiShu').val(),
				cheDaoPianLiYuJing : $('#edit_cheDaoPianLiYuJing').val(),
				zhuDongShaChe : $('#edit_zhuDongShaChe').val(),
				zhengTiZhuangXiangXT : $('#edit_zhengTiZhuangXiangXT').val(),
				yeShiXiTong : $('#edit_yeShiXiTong').val(),
				zhongKongYeJingPing : $('#edit_zhongKongYeJingPing').val(),
				ziShiYingXunHang : $('#edit_ziShiYingXunHang').val(),
				quanJingSheXiangTou : $('#edit_quanJingSheXiangTou').val(),
				daiJiYiGongNengZDFX : $('#edit_daiJiYiGongNengZDFX').val(),
				shuangShanQiDaDeng : $('#edit_shuangShanQiDaDeng').val(),
				zhiNengYaoShi : $('#edit_zhiNengYaoShi').val(),
				xuanZhuangBao4 : $('#edit_xuanZhuangBao4').val(),
				waiGuanYanSeZhongW : $('#edit_waiGuanYanSeZhongW').val(),
				waiGuanYanSe : $('#edit_waiGuanYanSe').val(),
				neiShiYanSeZhongW : $('#edit_neiShiYanSeZhongW').val(),
				neiShiYanSe : $('#edit_neiShiYanSe').val(),		
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					$(".row-edit-container").remove();
					search();
				} else {
					$.msgbox.show({
						'type' : 'error',
						'text' : data.message,
						'title' : '错误'
					});
				}
			}
		}, "提交中");
	});

	/** 行收缩-取消 */
	$table.on("click", '#dict_detail_cancel', function(e) {
		$(".row-edit-container").remove();
	});

}(jQuery, window)