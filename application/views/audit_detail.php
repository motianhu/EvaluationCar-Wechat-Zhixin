<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>审核详情-海威康微估车</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, heigth=device-width, minimum-scale=1.0, maximum-scale=2.0" />
<meta name="format-detection" content="telephone=no">
<link rel="stylesheet" href="/static/css/westMobi.css" type="text/css" />
</head>
<body>
<div class="MainBody">
  <div class="mainInfoBody"> 
  		<header class="header">
		      <section>
		      	<a class="back" href="<?php echo base_url().'index.php/audit';?>" style="width:40px;color:#069;">返回</a>
		      </section>
		  </header>
      <section>
      <div class="au_conBody manager question">
       <div class="searchbox">
       	<p>
       		<div>
                      <p>
       			 <?php if($applyCarBillId){?>
       			 <b>申请单号:</b><?php echo $applyCarBillId;?>
       			 <?php }else{?>
       			 <b>评估单号:</b><?php echo $carBillId;?>
       			 <?php }?>
                      </p>
       		</div>
       		<div><p><b>订单状态:</b><?php echo $billStatus[$status];?></p></div>
       	</p>
       	<p>
       		<b>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</b><?php echo $createTime;?>
       	</p>
       </div>
       
        <div class="an_list s0">
	        <div class="web_list">
	        	<div class="palr">
	              <p><b>预计时间：</b>15分钟后</p>
	              <p><b>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</b></p>
	              <p><?php echo $mark;?></b></p>
                      <p><b>全部意见:</b></p>
	              <p><?php echo $applyAllOpinion;?></p>
	            </div>
	        </div>
        </div>
      </div>
    </section>
  </div>
</div>  
</body>
</html>