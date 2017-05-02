<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>评估-海威康微估车</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=2.0" />
<meta name="format-detection" content="telephone=no">
<link rel="stylesheet" href="/static/css/westMobi.css" type="text/css" />
<script type="text/javascript" src="/static/js/jquery.js"></script>
<script type="text/javascript">
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
if( ! isWeiXin()){
	window.location.href = "<?php echo base_url().'index.php/evaluation/index/'.$id.'/1/'.$isEdit;?>";
}
</script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
</head>
<body>
	<form id="pg_form" name="pg_form" action="<?php echo base_url().'index.php/evaluation/do_eval';?>" method="post">
	<div class="MainBody pg">
		<div class="mainInfoBody">
			<div style="float:right;">您好:<?php echo $chineseName.'('.$englishName.')';?></div>
			<!------------------登记证--------------------->
			<header class="header">
		      <section>
		      	<a class="back">登记证&nbsp;&nbsp;<input type="checkbox" disabled="disabled" /></a>
		      	<strong style="float: right;font-size: 14px;"><a href="<?php echo base_url().'index.php/evaluation/jpg/1';?>" target="_blank">拍照规范</a></strong>
		      </section>
		    </header>
			<div class="pg_conbody pricelist">
				<ul class="datalist_page">
					<li i_type="登记证" i_no="1">
						<div class="up_img" <?php if(isset($carimage['登记证']['1'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['登记证']['1'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>1.登记证-首页</span>
					</li>
					<li i_type="登记证" i_no="2">
						<div class="up_img" <?php if(isset($carimage['登记证']['2'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['登记证']['2'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>2.登记证-车辆信息记录</span>
					</li>
					<?php 
						for ($j=1;$j<=2;$j++){
							if(isset($carimage['登记证'][$j]))
								unset($carimage['登记证'][$j]);
						}
						$i = $t = 3;
						if( ! empty($carimage['登记证'])){
							foreach ($carimage['登记证'] as $k1=>$v1){
					?>
					<li i_type="登记证" i_no="<?php echo $k1;?>">
						<div class="up_img" style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['登记证'][$k1]; ?>)"></div>
						<span class="pg_tigle"><?php echo $t;?>.备用<a class="d_submit" href="#" >删除</a></span>
					</li>
					<?php
								$i = $k1+1;
								$t++;
							}
						}
					?>
					<li i_type="登记证" i_no="<?php echo $i;?>">
						<div class="add_img"></div> 
						<span class="pg_tigle">增加</span>
					</li>
				</ul>
			</div>
			<!------------------行驶证--------------------->
			<header class="header">
		      <section>
		      	<a class="back">行驶证&nbsp;&nbsp;<input type="checkbox" disabled="disabled" /></a>
		      	<strong style="float: right;font-size: 14px;"><a href="<?php echo base_url().'index.php/evaluation/jpg/2';?>" target="_blank">拍照规范</a></strong>
		      </section>
		    </header>
			<div class="pg_conbody pricelist">
				<ul class="datalist_page">
					<li i_type="行驶证" i_no="1">
						<div class="up_img" <?php if(isset($carimage['行驶证']['1'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['行驶证']['1'];?>)"<?php } ?>></div>
						<span class="pg_tigle">
							<?php if(empty($isXfGroup)){?>
							<red>*</red>
							<?php } ?>
							1.行驶证-正本/副本同照
						</span>
					</li>
					<?php 
						for ($j=1;$j<=1;$j++){
							if(isset($carimage['登记证'][$j]))
								unset($carimage['登记证'][$j]);
						}
						$i = $t = 2;
						if( ! empty($carimage['行驶证'])){
							foreach ($carimage['行驶证'] as $k2=>$v2){
					?>
					<li i_type="行驶证" i_no="<?php echo $k2;?>">
						<div class="up_img" style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['行驶证'][$k2]; ?>)"></div>
						<span class="pg_tigle"><?php echo $t;?>.备用</span>
					</li>
					<?php
								$i = $k2+1;
								$t++; 
							}
						}
					?>
					<li i_type="行驶证" i_no="<?php echo $i;?>">
						<div class="add_img"></div> 
						<span class="pg_tigle">增加</span>
					</li>
				</ul>
			</div>
			<!------------------铭牌--------------------->
			<header class="header">
		      <section>
		      	<a class="back">车辆铭牌&nbsp;&nbsp;<input type="checkbox" disabled="disabled" /></a>
		      	<strong style="float: right;font-size: 14px;"><a href="<?php echo base_url().'index.php/evaluation/jpg/3';?>" target="_blank">拍照规范</a></strong>
		      </section>
		    </header>
			<div class="pg_conbody pricelist">
				<ul class="datalist_page">
					<li i_type="铭牌" i_no="1">
						<div class="up_img" <?php if(isset($carimage['铭牌']['1'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['铭牌']['1'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>1.车辆铭牌</span>
					</li>
					<?php 
						for ($j=1;$j<=1;$j++){
							if(isset($carimage['铭牌'][$j]))
								unset($carimage['铭牌'][$j]);
						}
						$i = $t = 2;
						if( ! empty($carimage['铭牌'])){
							foreach ($carimage['铭牌'] as $k3=>$v3){
					?>
					<li i_type="铭牌" i_no="<?php echo $k3;?>">
						<div class="up_img" style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['铭牌'][$k3]; ?>)"></div>
						<span class="pg_tigle"><?php echo $t;?>.备用</span>
					</li>
					<?php
								$i = $k3+1; 
								$t++;
							}
						}
					?>
					<li i_type="铭牌" i_no="<?php echo $i;?>">
						<div class="add_img"></div> 
						<span class="pg_tigle">增加</span>
					</li>
				</ul>
			</div>
			<!------------------车身外观--------------------->
			<header class="header clear">
		      <section>
		      	<a class="back">车身外观&nbsp;&nbsp;<input type="checkbox"  disabled="disabled" /></a>
		      	<strong style="float: right;font-size: 14px;"><a href="<?php echo base_url().'index.php/evaluation/jpg/5';?>" target="_blank">拍照规范</a></strong>
		      </section>
		    </header>
		    <div class="pg_conbody pricelist">
				<ul class="datalist_page">
					<li id="photo_1" i_type="车身外观" i_no="1">
						<div class="up_img" <?php if(isset($carimage['车身外观']['1'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车身外观']['1'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>1.车左前45度</span>
					</li>
					<li i_type="车身外观" i_no="2">
						<div class="up_img" <?php if(isset($carimage['车身外观']['2'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车身外观']['2'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>2.前挡风玻璃</span>
					</li>
					<li i_type="车身外观" i_no="3">
						<div class="up_img" <?php if(isset($carimage['车身外观']['3'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车身外观']['3'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>3.车右后45度</span>
					</li>
					<li i_type="车身外观" i_no="4">
						<div class="up_img" <?php if(isset($carimage['车身外观']['4'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车身外观']['4'];?>)"<?php } ?>></div>
						<span class="pg_tigle">
							<?php if(empty($isXfGroup)){?>
							<red>*</red>
							<?php } ?>
							4.后挡风玻璃
						</span>
					</li>
					<?php 
						for ($j=1;$j<=4;$j++){
							if(isset($carimage['车身外观'][$j]))
								unset($carimage['车身外观'][$j]);
						}
						$i = $t = 5;
						if( ! empty($carimage['车身外观'])){
							foreach ($carimage['车身外观'] as $k4=>$v4){
					?>
					<li i_type="车身外观" i_no="<?php echo $k4;?>">
						<div class="up_img" style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车身外观'][$k4]; ?>)"></div>
						<span class="pg_tigle"><?php echo $t;?>.备用</span>
					</li>
					<?php
								$i = $k4+1;
								$t++; 
							}
						}
					?>
					<li i_type="车身外观" i_no="<?php echo $i;?>">
						<div class="add_img"></div> 
						<span class="pg_tigle">增加</span>
					</li>
				</ul>
			</div>
		    <!------------------车体骨架--------------------->
		    <header class="header clear">
		      <section>
		      	<a class="back">车体骨架&nbsp;&nbsp;<input type="checkbox"  disabled="disabled" /></a>
		      	<strong style="float: right;font-size: 14px;"><a href="<?php echo base_url().'index.php/evaluation/jpg/6';?>" target="_blank">拍照规范</a></strong>
		      </section>
		    </header>
		    <div class="pg_conbody pricelist">
				<ul class="datalist_page">
					<li id="photo_1" i_type="车体骨架" i_no="1">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['1'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['1'];?>)"<?php } ?>></div>
						<span class="pg_tigle">
							<?php if(empty($isXfGroup)){?>
							<red>*</red>
							<?php } ?>
							1.发动机盖
						</span>
					</li>
					<li i_type="车体骨架" i_no="2">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['2'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['2'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>2.右侧内龟</span>
					</li>
					<li i_type="车体骨架" i_no="3">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['3'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['3'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>3.右侧水箱支架</span>
					</li>
					<li i_type="车体骨架" i_no="4">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['4'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['4'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>4.左侧内龟</span>
					</li>
					<li i_type="车体骨架" i_no="5">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['5'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['5'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>5.左侧水箱支架</span>
					</li>
					<li i_type="车体骨架" i_no="6">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['6'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['6'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>6.左前门</span>
					</li>
					<li i_type="车体骨架" i_no="7">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['7'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['7'];?>)"<?php } ?>></div>
						<span class="pg_tigle">
							<?php if(empty($isXfGroup)){?>
							<red>*</red>
							<?php } ?>
							7.左前门铰链
						</span>
					</li>
					<li i_type="车体骨架" i_no="8">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['8'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['8'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>8.左后门</span>
					</li>
					<li i_type="车体骨架" i_no="9">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['9'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['9'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>9.行李箱左侧</span>
					</li>
					<li i_type="车体骨架" i_no="10">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['10'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['10'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>10.行李箱右侧</span>
					</li>
					<li i_type="车体骨架" i_no="11">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['11'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['11'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>11.行李箱左侧底板</span>
					</li>
					<li i_type="车体骨架" i_no="12">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['12'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['12'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>12.行李箱右侧底板</span>
					</li>
					<li i_type="车体骨架" i_no="13">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['13'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['13'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>13.右后门</span>
					</li>
					<li i_type="车体骨架" i_no="14">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['14'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['14'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>14.右前门</span>
					</li>
					<li i_type="车体骨架" i_no="15">
						<div class="up_img" <?php if(isset($carimage['车体骨架']['13'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架']['15'];?>)"<?php } ?>></div>
						<span class="pg_tigle">
							<?php if(empty($isXfGroup)){?>
							<red>*</red>
							<?php } ?>
							15.右前门铰链
						</span>
					</li>
					<?php
					 	for ($j=1;$j<=15;$j++){
							if(isset($carimage['车体骨架'][$j]))
								unset($carimage['车体骨架'][$j]);
						} 
						$i = $t = 16;
						if( ! empty($carimage['车体骨架'])){
							foreach ($carimage['车体骨架'] as $k5=>$v5){
					?>
					<li i_type="车体骨架" i_no="<?php echo $k5;?>">
						<div class="up_img" style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车体骨架'][$k5]; ?>)"></div>
						<span class="pg_tigle"><?php echo $t;?>.备用</span>
					</li>
					<?php
								$i = $k5+1;
								$t++; 
							}
						}
					?>
					<li i_type="车体骨架" i_no="<?php echo $i;?>">
						<div class="add_img"></div> 
						<span class="pg_tigle">增加</span>
					</li>
				</ul>
			</div>
		    
		    
			<!------------------车辆内饰--------------------->
			<header class="header clear">
		      <section>
		      	<a class="back">车辆内饰&nbsp;&nbsp;<input type="checkbox"  disabled="disabled" /></a>
		      	<strong style="float: right;font-size: 14px;"><a href="<?php echo base_url().'index.php/evaluation/jpg/4';?>" target="_blank">拍照规范</a></strong>
		      </section>
		    </header>
		    <div class="pg_conbody pricelist">
				<ul class="datalist_page">
					<li id="photo_1" i_type="车辆内饰" i_no="1">
						<div class="up_img" <?php if(isset($carimage['车辆内饰']['1'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车辆内饰']['1'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>1.方向盘及仪表</span>
					</li>
					<li i_type="车辆内饰" i_no="2">
						<div class="up_img" <?php if(isset($carimage['车辆内饰']['2'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车辆内饰']['2'];?>)"<?php } ?>></div>
						<span class="pg_tigle">
							<?php if(empty($isXfGroup)){?>
							<red>*</red>
							<?php } ?>
							2.中央控制面板
						</span>
					</li>
					<li i_type="车辆内饰" i_no="3">
						<div class="up_img" <?php if(isset($carimage['车辆内饰']['3'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车辆内饰']['3'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>3.中控台含档位杆</span>
					</li>
					<li i_type="车辆内饰" i_no="4">
						<div class="up_img" <?php if(isset($carimage['车辆内饰']['4'])){?> style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车辆内饰']['4'];?>)"<?php } ?>></div>
						<span class="pg_tigle"><red>*</red>4.后出风口</span>
					</li>
					<?php 
						for ($j=1;$j<=4;$j++){
							if(isset($carimage['车辆内饰'][$j]))
								unset($carimage['车辆内饰'][$j]);
						} 
						$i = $t = 5;
						if( ! empty($carimage['车辆内饰'])){
							foreach ($carimage['车辆内饰'] as $k6=>$v6){
					?>
					<li i_type="车辆内饰" i_no="<?php echo $k6;?>">
						<div class="up_img" style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['车辆内饰'][$k6]; ?>)"></div>
						<span class="pg_tigle"><?php echo $t;?>.备用</span>
					</li>
					<?php
								$i = $k6+1; 
								$t++;
							}
						}
					?>
					<li i_type="车辆内饰" i_no="<?php echo $i;?>">
						<div class="add_img"></div> 
						<span class="pg_tigle">增加</span>
					</li>
				</ul>
			</div>
			<!------------------差异补充--------------------->
			<header class="header">
		      <section>
		      	<a class="back">差异补充&nbsp;&nbsp;<input type="checkbox" disabled="disabled" /></a>
		      </section>
		    </header>
			<div class="pg_conbody pricelist">
				<ul class="datalist_page">
					<?php 
						$i = $t = 1;
						if( ! empty($carimage['差异补充'])){
							foreach ($carimage['差异补充'] as $k7=>$v7){
					?>
					<li i_type="差异补充" i_no="<?php echo $k7;?>">
						<div class="up_img" style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['差异补充'][$k7]; ?>)"></div>
						<span class="pg_tigle"><?php echo $t;?>.备用</span>
					</li>
					<?php
								$i = $k7+1; 
								$t++;
							}
						}
					?>
					<li i_type="差异补充" i_no="<?php echo $i;?>">
						<div class="add_img"></div> 
						<span class="pg_tigle">增加</span>
					</li>
				</ul>
			</div>
			<!------------------原车保险--------------------->
			<header class="header">
		      <section>
		      	<a class="back">原车保险&nbsp;&nbsp;<input type="checkbox" disabled="disabled" /></a>
		      </section>
		    </header>
			<div class="pg_conbody pricelist">
				<ul class="datalist_page">
					<?php 
						$i = $t = 1;
						if( ! empty($carimage['原车保险'])){
							foreach ($carimage['原车保险'] as $k8=>$v8){
					?>
					<li i_type="原车保险" i_no="<?php echo $k8;?>">
						<div class="up_img" style="background-size: 100% 100%;background-image:url(<?php echo base_url().$carimage['原车保险'][$k8]; ?>)"></div>
						<span class="pg_tigle"><?php echo $t;?>.备用</span>
					</li>
					<?php
								$i = $k8+1; 
								$t++;
							}
						}
					?>
					<li i_type="原车保险" i_no="<?php echo $i;?>">
						<div class="add_img"></div> 
						<span class="pg_tigle">增加</span>
					</li>
				</ul>
			</div>
			<div style="clear:both;">
				<div style="padding:10px 0;"><span style="color:red;">*</span>预售价格：<input type="number" name="preSalePrice" min="0" id="ysjg" class="ysjg" /></div>
			</div>
			<?php if($is_show_aid == 'true'){?>
			<div style="clear:both;">
				<div style="padding:10px 0;"><span style="color:red;">*</span>申请单号：<input type="text" name="applyCarBillId" id="applyCarBillId" class="ysjg" /></div>
			</div>
			<?php }?>
			<div style="clear:both;">
				<div>备注</div>
				<div>
					<textarea name="remark" style="width:99%;padding:5px;" rows="6"><?php echo isset($remark)?$remark:'';?></textarea>
				</div>
			</div>
			<?php if(isset($status) && $status == '23'){?>
			<div style="clear:both;">
				<div>驳回信息:<?php echo $applyOpinion;?></div>
			</div>
			<?php }?>
			<div class="pg_field clear">
				<input type="reset" class="pg_d_submit" value="清空" style="background: -webkit-gradient(linear, 0 0, 0 100%, from(#A3A7AB), to(#303233));" />
				<input type="submit" class="pg_d_submit" id="pg_submit" value="提交" />
			</div>
			<!--<div class="mobiBottom">
				<div class="copyRight">
				</div>
			</div>-->
		</div>
	</div>
	</form>
</body>
<script type="text/javascript">
var tag = false; //不可编辑标志
//检查信息完整性
function check(tar){
	var recat = /xg\.jpg/gi;
	var i = j = 0;
	tar.find('.up_img').each(function(){
		j = j + 1;
		if(recat.test($(this).css("background-image"))){
			return false;
		}
		i = i + 1;
	});
	if(i == j)
		tar.parents('.pricelist').prev('.header').find('input').attr("checked",'true')
};

$('.datalist_page').each(function(){
	check($(this));
});

wx.config({
    debug: false,
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [
      // 所有要调用的 API 都要加到这个列表中
        'chooseImage',
        'uploadImage',
    ]
  });
  
var images = {
	    localId: ''
}; 
function up(t){
	var i_type = t.parent('li').attr('i_type');
	var i_no = t.parent('li').attr('i_no');
	wx.chooseImage({
	  count: 1,
      success: function (res) {
        images.localId = res.localIds;
	    //预览图片
        t.css({"background-image":"url("+res.localIds+")","background-size":"100% 100%"});
	    //上传图片到微信
        wx.uploadImage({
            localId: images.localId.toString(),
            success: function (res) {
	            //下载图片到服务器
	            $.get("<?php echo base_url().'index.php/evaluation/down_image/';?>"+res.serverId+'/'+i_type+'/'+i_no,function(msg){
					if(msg == 'success'){
						check(t.parents('.datalist_page'));
					}else{
						t.css({"background-image":"url(/static/img/xg.jpg)","background-size":"auto"});
						alert(i_type+'第'+i_no+'张图片上传失败，请重新上传.');
					}
		        });
            },
	        fail: function (res) {
			t.css({"background-image":"url(/static/img/xg.jpg)","background-size":"auto"});
		          alert(JSON.stringify(res));
		    }
         });
      }
    });
}
$('.add_img').click(function(){
	var tar = $(this);
	var tmp = tar.parent('li').clone();
	//虚拟序列号
	var v_no = tar.parents('ul').children('li').length;
	tmp.children('div').removeClass('add_img').addClass('up_img').siblings('.pg_tigle').html(v_no+'.备用<a class="d_submit" href="#" >删除</a>')
	tar.parent('li').before(tmp);
	tar.parent('li').attr('i_no',parseInt(tar.parent('li').attr('i_no'))+1);
	tmp.children('.up_img').click(function(){
		var t = $(this);
		up(t);
	});
});

//更新序列号
$('li .d_submit').live('click',function(){
	$(this).unbind();
	var d_tar = $(this).parents('li');
	//如果已传图片删除服务器数据
	var recat = /xg\.jpg/gi;
	if( ! recat.test(d_tar.children('.up_img').css("background-image"))){
		$.get("<?php echo base_url().'index.php/evaluation/del_image/';?>"+d_tar.attr('i_type')+'/'+d_tar.attr('i_no'),function(msg){
			alert(msg);
		});
	}
	//更新元素后面虚拟序列号
	var cnt = d_tar.nextAll('li').length;
	d_tar.nextAll('li').each(function(n){
		if( (n+1) >= cnt){
			return false;
		}
		var pg = $(this).children('.pg_tigle').html();
		var reCat = /\./;
		var arrpg = pg.split(reCat);
		pg = '';
		for (var i = 0; i < arrpg.length; i++)
		{
			if(i==0){
				pg = pg + (parseInt(arrpg[i])-1) + '.';
			}else{
				pg = pg + arrpg[i];
			}
		}
		$(this).children('.pg_tigle').html(pg);
	});
	d_tar.empty().remove();
	return false;
});

wx.ready(function () {
	  // 5.1 拍照、本地选图
	  $('.up_img').each(function(i){
		$(this).click(function(){
			if(tag){
				return false;
			}
			tag = true;
			var t = $(this);
			up(t);
			tag = false;
		});
	  });
});
$('#pg_submit').click(function(){
	$(this).attr('disabled',true);
	var jg = parseInt($('#ysjg').val());
	if( ! $.isNumeric(jg)){
		alert('预售价格必填.');
		$('#pg_submit').attr('disabled',false);
		return false;
	}
	<?php if($is_show_aid == 'true'){?>
		if( $('#applyCarBillId').val().length < 2 ){
			alert('申请单号必填.');
			$('#pg_submit').attr('disabled',false);
			return false;
		}
	<?php } ?>
	var recat = /xg\.jpg/gi;
	var flag = false;
	$('red').each(function(){
		var up_img = $(this).parent('.pg_tigle').prev('.up_img');
		var img = up_img.css('background-image');
		if(recat.test(img)){
			alert(up_img.parent('li').attr('i_type')+'第'+up_img.parent('li').attr('i_no')+'张图片没有上传.');
			$('#pg_submit').attr('disabled',false);
			flag = true;
			return false;
		}		
	});
	if(flag)
		return false;
	$('#pg_submit').attr('disabled',false);	
});	
</script>
</html>