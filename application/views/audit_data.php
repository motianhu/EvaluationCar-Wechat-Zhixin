        	<?php if(!empty($list)){?>
        	<?php foreach ($list as $val){?>
	        <div class="web_list listbg">
	            <div class="palr">
	              <p>
	        	  <?php if($val['applyCarBillId']){?>
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
	              	<a class="d_submit" href="<?php echo base_url().'index.php/evaluation/index/'.$val['id'];?>" >修改</a>
	              	<?php }?>
	              </span>
	              </p>
	            </div>
	        </div>
          	<?php }?>
          	<?php }?>