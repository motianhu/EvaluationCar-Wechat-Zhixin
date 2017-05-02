<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>审核查询-海威康微估车</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=2.0" />
<meta name="format-detection" content="telephone=no">
<link rel="stylesheet" href="/static/css/westMobi.css?1" type="text/css" />
<script type="text/javascript" src="/static/js/jquery.js"></script>
</head>
<body>
<div class="MainBody">
  <div class="mainInfoBody">
  	  <div style="width:97%;margin: auto;">
  		<div style="float:left;margin:2px 0 2px 0;"><a href="<?php echo base_url().'index.php/evaluation';?>">评估</a></div>
  		<div style="float:right;clear:right;margin:2px 0 2px 0;">您 好:<?php echo $chineseName.'('.$englishName.')';?></div>
      </div>
      <div class="au_conBody manager question" style="clear:both;">
       <p>
       		<span data="<?php echo base_url().'index.php/audit/index/1';?>" class="label<?php if($status_type =='1'){echo ' on';}?>">处理中</span>
       		<span data="<?php echo base_url().'index.php/audit/index/2';?>" class="label<?php if($status_type =='2'){echo ' on';}?>">已报价</span>
       		<span class="s_card label<?php if($status_type =='3'){echo ' on';}?>">搜索</span>
       	</p>
        <div class="an_list s0">
        	<div class="searchbox" <?php if($status_type != '3'){?> style="display:none;"<?php }?>>
		       <form action="<?php echo base_url().'index.php/audit';?>" method="post">
		       	<p>
		       		<?php if($is_show_aid == 'true'){?>
		       		申请单号
		       		<?php }else{?>
			       	评估单号 
			       	<?php }?>
			       	<input name="keyword" value="<?php echo $keyword;?>" type="number" class="s_text">
			       	<input name="" type="submit" class="d_submit" value="搜索">
		       	</p>
		       </form>
		    </div>
        	<?php if(!empty($list)){?>
        	<?php foreach ($list as $val){?>
	        <div class="web_list listbg">
	        	<div class="palr">
	        	  <p>
	        	 <?php if($is_show_aid == 'true'){?>
	        	  <strong>申请单号：</strong><a href="#"><?php echo $val['applyCarBillId'];?></a>
	        	  <?php }else{?>
	              <strong>评估单号：</strong><a href="#"><?php echo $val['carBillId'];?></a>
	              <?php }?>
	              <span class="cz_btn">状态：<?php echo $billStatus[$val['status']];?></span>
	              </p>
	              <p><strong>时间：</strong><span class="greencolor"><?php echo $val['modifyTime']?$val['modifyTime']:$val['createTime'];?></span>
	              </p>
	              <p>
	              <strong>最终评估价格：</strong><span class="greencolor"><?php echo $val['evaluatePrice']?(number_format($val['evaluatePrice']).'元'):'无';?></span>
	              <span class="cz_btn">
	              	<a class="d_submit" href="<?php echo base_url().'index.php/audit/detail/'.$val['id'];?>" >查看</a>
	              	<?php if($val['status'] == '23'){?>
	              	<a class="d_submit" href="<?php echo base_url().'index.php/evaluation/index/'.$val['id'].'/0/1';?>" >修改</a>
	              	<?php }?>
	              </span>
	              </p>
	            </div>
	        </div>
          	<?php }?>
          	<?php if(count($list)>6){?>
          	<div id="pullUp" style="text-align:center; width: 80%; margin: 0 auto;">
          		<span class="pullUpLabel fl" style="display:inline-block;height:40px;width:70px;line-height:40px;">加载更多...</span>    
          	</div> 
          	<?php }?>         	
          	<?php }else{?>
          	<div class="web_list listbg">
	        	<div class="palr">
	        	没有数据
	            </div>
	        </div>		
          	<?php }?>
        </div>
      </div>
</body>
<script type="text/javascript">
$('.label').each(function(){
	$(this).click(function(){
		if($(this).hasClass('s_card')){
			$(this).addClass('on').siblings('span').removeClass('on');
			$('.searchbox').show();
			$('.web_list').hide();
			$('#pullUp').hide();
		}else{
			window.location.href=$(this).attr('data');
		}
	});
});

var p = 1;
var stop = 0;
$(window).scroll( function() { 
	var doc_height = $(document).height();
	var scroll_top = $(document).scrollTop(); 
	var window_height = $(window).height();
	//滚动到底部加载数据
	if(scroll_top + window_height >= doc_height){
		if(stop < p)
			$.post("<?php echo base_url().'index.php/audit/get_audit_data/'.$status_type;?>/"+p,{keyword:"<?php echo $keyword;?>"},function(html){
				if(html.length > 20){
					$('#pullUp').before(html);
					p = p + 1;
				}else{
					stop = p + 1;
					$('.pullUpLabel').html('没有更多了');
				}
			});
	}
});
</script>
</html>