~function($, window) {
	"use strict"; // jshint ;_;
	var $table = $("#dict_table");
	var $createContainer = $('#for_create_container');
	var rowTemplateHtml = $("#openup_row_template").html();
	var unfoldTrHtml = "<tr class='row-edit-container'><td colspan='99'>{0}</td></tr>";
	var tableData = {};
	var $jTable = null;
	var $create_modal = $("#create_modal");

	beautifulSelect2();

	function beautifulSelect2() {

		$(".beautifulSelect2").select2({
			theme : "classic"
		});
	}

	dateInit();
	function dateInit() {
		var now = new Date().Format('yyyy-MM-dd');
		$('.datepicker').datepicker({
			format : 'yyyy-mm-dd',
			autoclose : true,
			defaultDate : +0,
			language : 'zh-CN',
		});
		$('#createTime').val(now);
	}

	function clearForm() {
		$("#create_modal input.input-medium").val('');
		$("#mark").val('');
	}

	/**
	 * @param {Object}
	 *            obj 该参数用于手动更改参数,格式为{"字段名":"值"}
	 */
	var getParam = (function() {
		var _queryParam = {
			companyName : "",
			clientProp : "",
			fileType : "xls"
		}
		var toString = function(o) {
			for ( var x in o) {
				if (o[x] && o[x] instanceof Array)
					o[x] = o[x].toString();
			}
		};
		return function() {
			_queryParam.companyName = $("#query_companyName").val().trim();
			_queryParam.clientProp = $("#query_clientProp").val().trim();
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
		var companyName = $("#companyName").val().trim();
		var province = $("#province_sel").val().trim() || -1;
		var city = $("#city_sel").val().trim();
		var district = $("#district_sel").val().trim();
		var detailAddress = $("#detailAddress").val().trim();
		var shortName = $("#shortName").val();
		var bank = $("#bank").val();
		var postalCode = $("#postalCode").val();
		var bankAccount = $("#bankAccount").val();
		var bankPostalCode = $("#bankPostalCode").val();
		var corporater = $("#corporater").val();
		var region = $("#region").val();
		var delegater = $("#delegater").val();
		var clientClass = $("#clientClass").val();
		var taxNum = $("#taxNum").val();
		var status = $("#validSelect").val();
		var contractNum = $("#contractNum").val();
		var createTime = $("#createTime").val();
		var clientProp = $('#clientProp input[name="clientProp"]:checked ')
				.val();
		var superCompany = $("#superCompany").val();
		var mark = $("#mark").val();
		var contactUser = $("#contactUser").val();
		var idNum = $("#idNum").val();
		var telphone = $("#telphone").val();
		var fax = $("#fax").val();
		var mobilephone = $("#mobilephone").val();
		var dzgn = $("#dzgn").val();
		var email = $("#email").val();
		var mileage = $("#mileage").val();
		var website = $("#website").val();
		var jd = $("#jd").val();
		var wd = $("#wd").val();

		Util.ajax({
			type : "POST",
			url : requestContextPath + "/company/addCompany.html",
			data : {
				companyName : companyName,
				province : province,
				city : city,
				area : district,
				detailAddress : detailAddress,
				shortName : shortName,
				bank : bank,
				postalCode : postalCode,
				bankAccount : bankAccount,
				bankPostalCode : bankPostalCode,
				corporater : corporater,
				delegater : delegater,
				region : region,
				clientClass : clientClass,
				taxNum : taxNum,
				status : status,
				contractNum : contractNum,
				createTime : createTime,
				clientProp : clientProp,
				superCompany : superCompany,
				mark : mark,
				contactUser : contactUser,
				idNum : idNum,
				telphone : telphone,
				fax : fax,
				mobilephone : mobilephone,
				dzgn : dzgn,
				email : email,
				mileage : mileage,
				website : website,
				jd : jd,
				wd : wd,
			},
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					$create_modal.modal('hide');
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

	initProvince("province_sel", null);
	$("#province_sel").on(
			'change',
			function(e) {
				changeSelectProvince(this, "city_sel", "district_sel",
						"detailAddress");
			});
	$("#city_sel").on('change', function(e) {
		changeSelectCity(this, "district_sel", "detailAddress");
	});
	$("#district_sel").on('change', function(e) {
		changeSelectDistrict(this, "detailAddress");
	});

	createSuperCompany();
	function createSuperCompany() {
		var clientPropVal = $('#clientProp input[name="clientProp"]:checked ')
				.val();
		if (clientPropVal == '经销商') {
			initCompany("#superCompany", "金融单位");
			$("#superCompany").attr("disabled", false);
		} else {
			$("#select2-superCompany-container").html("请选择");
			$("#superCompany").html("");
			$("#superCompany").attr("disabled", true);
		}
	}
	$("#clientProp").change(function() {
		createSuperCompany();
	});

	function selectEditSuperCompany(clientProp, selectedSuperCompany) {
		if (clientProp == '经销商') {
			selectedCompany("edit_superCompany", "金融单位", selectedSuperCompany);
			$("#edit_superCompany").attr("disabled", false);
		} else {
			$("#select2-edit_superCompany-container").html("请选择");
			$("#edit_superCompany").html("");
			$("#edit_superCompany").attr("disabled", true);
		}
	}

	/** 导出记录 */
	window.exportData = function() {
		if ($jTable.getAttributes().total === 0) {
			$.msgbox.show({
				'type' : 'info',
				'text' : '没有可导出的记录',
				'title' : '提示'
			});
			return;
		}
		Util.ajax({
			url : requestContextPath + "/dictmanager/exportDict.html",
			data : getParam(),
			cache : false,
			dataType : "text",
			success : function(data) {
				location.href = data;
			}
		}, "正在导出，请稍等...");
	}

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
		$create_modal.modal('show');
	});
	$("#create_confirm_btn").click(addDict);
	// $("#create_cancel_btn").click(function() {
	// $createContainer.hide();
	// });

	/*
	 * 表格初始化，这里为了测试数据，url写的fake
	 */
	$jTable = $table.table({
		ajaxUrl : requestContextPath + "/company/getCompanyList.html",
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
					list.push("<span class='icon-edit editrow' rowid='"
							+ curRow.id + "'>" + curRow.id + "</span>"); // 编号
					list.push(curRow.companyName);
					list.push(curRow.region);
					list.push(curRow.clientProp);
					dataList.push(list);
				}
				;
			}
			dataSet.list = dataList;
			return dataSet;
		}
	});

	/** 行展开 */
	$table
			.on(
					"click",
					'.editrow',
					function(e) {
						e.stopPropagation();
						var $this = $(this);
						var $thisTr = $this.parent().parent();
						var $thatTr = $thisTr.next();
						if (!$thatTr.find(".arrow").length) {
							var id = $this.attr("rowid");
							var curData = tableData[id];

							var $next = $thisTr.next();

							// var isChecked = curData.status ? 'checked' : "";
							var temp = rowTemplateHtml.replace(/{rowid}/g,
									curData.id).replace("{edit_companyName}",
									curData.companyName || "").replace(
									"{edit_detailAddress}",
									curData.detailAddress || "")
									.replace("{edit_shortName}",
											curData.shortName || "").replace(
											"{edit_bank}", curData.bank || "")
									.replace("{edit_postalCode}",
											curData.postalCode || "").replace(
											"{edit_bankAccount}",
											curData.bankAccount || "").replace(
											"{edit_bankPostalCode}",
											curData.bankPostalCode || "")
									.replace("{edit_region}",
											curData.region || "").replace(
											"{edit_corporater}",
											curData.corporater || "").replace(
											"{edit_delegater}",
											curData.delegater || "").replace(
											"{edit_clientClass}",
											curData.clientClass || "").replace(
											"{edit_taxNum}",
											curData.taxNum || "").replace(
											"{edit_validSelect}",
											curData.validSelect || "").replace(
											"{edit_contractNum}",
											curData.contractNum || "").replace(
											"{edit_createTime}",
											curData.createTime || "").replace(
											"{edit_clientProp}",
											curData.clientProp || "").replace(
											"{edit_superCompany}",
											curData.superCompany || "")
									.replace("{edit_mark}", curData.mark || "")
									.replace("{edit_contactUser}",
											curData.contactUser || "")
									.replace("{edit_idNum}",
											curData.idNum || "").replace(
											"{edit_telphone}",
											curData.telphone || "").replace(
											"{edit_fax}", curData.fax || "")
									.replace("{edit_mobilephone}",
											curData.mobilephone || "").replace(
											"{edit_dzgn}", curData.dzgn || "")
									.replace("{edit_email}",
											curData.email || "").replace(
											"{edit_mileage}",
											curData.mileage || "").replace(
											"{edit_website}",
											curData.website || "").replace(
											"{edit_jd}", curData.jd || "")
									.replace("{edit_wd}", curData.wd || "")
							var trHtml = unfoldTrHtml.replace("{0}", temp);
							$(".row-edit-container").remove();
							$thisTr.after($(trHtml));

							$("#edit_validSelect").find(
									"option[value=" + curData.status + "]")
									.attr("selected", true);
							$("#edit_region").find(
									"option[value=" + curData.region + "]")
									.attr("selected", true);
							$("#edit_clientClass")
									.find(
											"option[value="
													+ curData.clientClass + "]")
									.attr("selected", true);

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

							beautifulSelect2();
							$('.datepicker').datepicker({
								format : 'yyyy-mm-dd',
								autoclose : true,
								language : 'zh-CN',
							});
							$("#edit_createTime").val(curData.createTime);
							$("#edit_clientProp").find(
									"input:radio[value='" + curData.clientProp
											+ "']").attr("checked", true);

							selectEditSuperCompany(curData.clientProp,
									curData.superCompany);
							$("#edit_clientProp")
									.on(
											'change',
											function(e) {
												var editClientPropVal = $(
														'#edit_clientProp input[name="edit_clientProp"]:checked ')
														.val();
												selectEditSuperCompany(
														editClientPropVal, '');
											});

							initProvince("edit_province_sel", curData.province);
							initCity(curData.province, "edit_city_sel",
									curData.city);
							initDistrict(curData.city, "edit_district_sel",
									curData.area);
							$("#edit_province_sel").on(
									'change',
									function(e) {
										changeSelectProvince(this,
												"edit_city_sel",
												"edit_district_sel",
												"edit_detailAddress");
									});
							$("#edit_city_sel").on(
									'change',
									function(e) {
										changeSelectCity(this,
												"edit_district_sel",
												"edit_detailAddress");
									});
							$("#edit_district_sel").on(
									'change',
									function(e) {
										changeSelectDistrict(this,
												"edit_detailAddress");
									});

						} else {
							return false;
						}
					});

	/** 行编辑-确定 */
	$table
			.on(
					"click",
					'#dict_detail_confirm',
					function(e) {
						Util
								.ajax(
										{
											type : "POST",
											url : requestContextPath
													+ "/company/editCompany.html",
											data : {
												id : $(this).attr("rowid"),
												companyName : $(
														'#edit_companyName')
														.val().trim(),
												province : $(
														'#edit_province_sel')
														.val().trim(),
												city : $('#edit_city_sel')
														.val().trim(),
												area : $('#edit_district_sel')
														.val().trim(),
												detailAddress : $(
														'#edit_detailAddress')
														.val().trim(),
												shortName : $('#edit_shortName')
														.val().trim(),
												bank : $('#edit_bank').val()
														.trim(),
												postalCode : $(
														'#edit_postalCode')
														.val().trim(),
												bankAccount : $(
														'#edit_bankAccount')
														.val().trim(),
												bankPostalCode : $(
														'#edit_bankPostalCode')
														.val().trim(),
												region : $('#edit_region')
														.val().trim(),
												delegater : $('#edit_delegater')
														.val().trim(),
												corporater : $(
														'#edit_corporater')
														.val().trim(),
												clientClass : $(
														'#edit_clientClass')
														.val().trim(),
												taxNum : $('#edit_taxNum')
														.val().trim(),
												validSelect : $(
														'#edit_validSelect')
														.val().trim(),
												contractNum : $(
														'#edit_contractNum')
														.val().trim(),
												createTime : $(
														'#edit_createTime')
														.val().trim(),
												clientProp : $(
														'#edit_clientProp input[name="edit_clientProp"]:checked ')
														.val(),
												superCompany : $(
														'#edit_superCompany')
														.val(),
												mark : $('#edit_mark').val()
														.trim(),
												contactUser : $(
														'#edit_contactUser')
														.val().trim(),
												idNum : $('#edit_idNum').val()
														.trim(),
												telphone : $('#edit_telphone')
														.val().trim(),
												fax : $('#edit_fax').val()
														.trim(),
												mobilephone : $(
														'#edit_mobilephone')
														.val().trim(),
												dzgn : $('#edit_dzgn').val()
														.trim(),
												email : $('#edit_email').val()
														.trim(),
												mileage : $('#edit_mileage')
														.val().trim(),
												website : $('#edit_website')
														.val().trim(),
												jd : $('#edit_jd').val().trim(),
												wd : $('#edit_wd').val().trim(),
												status : $('#edit_validSelect')
														.val().trim(),
											},
											dataType : 'json',
											success : function(data) {
												if (data.success) {
													$(".row-edit-container")
															.remove();
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