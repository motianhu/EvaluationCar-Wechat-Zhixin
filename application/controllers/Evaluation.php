<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Evaluation extends CI_Controller {
	private $user = '';
	private $wx_user_id = '';
	private $_log_path = '';
	private $_next_line = "\r\n";
	public function __construct()
	{
		parent::__construct();
		//登录状态判断
		get_cookie('wx_user_id') && $this->wx_user_id = get_cookie('wx_user_id');
		get_cookie('user') && $this->user = get_cookie('user');
  		if(! $this->user)
  		{		
  			redirect(base_url().'index.php/login/index');
  			exit;
  		}
		$this->_log_path = './log/'.date('Ymd').'.php';
		if ( ! file_exists('./log/'.date('Ymd').'.php'))
		{
			$log_msg = "<"."?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); ?".">".$this->_next_line;
			file_put_contents($this->_log_path, $log_msg);
		}
		$this->load->library('jssdk',array('appId'=> $this->config->item('appId'),'appSecret'=> $this->config->item('appSecret')));
	}
	
	public function index($id = 0,$noWeixin = 0,$isEdit = 0)
	{
		//获取companyid
		$query = $this->db->select('companyId,chineseName')->where('englishName',$this->user)->get('user');
		$companyId = isset($query->row()->companyId) ? $query->row()->companyId : 0;
		$chineseName = isset($query->row()->chineseName) ? $query->row()->chineseName : '';
		
		if($id && $isEdit)
		{
			//修改'23'	=>	'初审驳回' 单据
			$query = $this->db->where(array('id'=>$id,'createUser'=>$this->user,'status'=>'33'))->order_by('createTime','DESC')->limit(1)->get('carbill');
			$data = $row = $query->row_array();
			
			if(empty($row))
			{
				show_error(base_url().'index.php/evaluation/index',500,'评估单不存在.');
			}
			else 
			{
				//获取驳回信息
				$query = $this->db->select('applyOpinion')->where(array('carBillId'=>$row['carBillId']))->get('carbillapply');
				$data['applyOpinion'] = isset($query->row()->applyOpinion) ? $query->row()->applyOpinion : '';
			}
		}
		else 
		{
			//获取最近一次未完成单据
			$query = $this->db->where(array('createUser'=>$this->user,'status'=>0))->order_by('createTime','DESC')->limit(1)->get('carbill');
			$data = $row = $query->row_array();
		}
		if( ! empty($row))
		{
			//存在未完成单据，获取单据详细信息
			$query = $this->db->where('carBillId',$data['carBillId'])->get('carimage');
			$res = $query->result_array();
			//构建数组
			if( ! empty($res))
			{
				foreach ($res as $v)
				{
					$data['carimage'][urldecode($v['imageClass'])][$v['imageSeqNum']] = $v['imagePath'];
				}
			}
			$carBillId = $data['carBillId'];
		}
		else 
		{
			//单据不存在，生成新单据
			$inter_car_bill_id = $this->config->item('inter_car_bill_id');
			$carBillId = file_get_contents($inter_car_bill_id);
			$carBillId = str_replace('"', '', $carBillId);
			$this->db->insert('carbill', array(
				'getherCompanyId'	=>	$companyId,
				'carBillId'		=>	$carBillId,	
				'recordFrom'	=>	$noWeixin ? 'mobileWeb' : '微信采集',
				'createTime'	=>	date('Y-m-d H:i:s'),
				'modifyTime'	=>	date('Y-m-d H:i:s'),
				'status'		=>	0,
				'createUser'		=>	$this->user
			));
			if( ! $carBillId)
			{
				//如果未取到接口订单号,更新订单号
				$data['id'] = $this->db->insert_id();
				$carBillId = date('Ymd').$data['id'];
				$this->db->where('id',$data['id'])->update('carbill',array('carBillId'=>$carBillId));
			}
		}
		set_cookie('car_bill_id',$carBillId,86500);
		//是否显示申请单号
		$show_url = $this->config->item('is_show_aid').'?companyId='.$companyId;
		$data['is_show_aid'] = 'false';//file_get_contents($show_url);
		
		$data['signPackage'] = $this->jssdk->GetSignPackage();
		$data['englishName'] = $this->user;
		$data['chineseName'] = $chineseName;
		
		$data['isEdit'] = $isEdit;
		
		//5.8如果单位是先锋，减少必填项目
                $data['companyId'] = $companyId;
                //5.9考虑先锋子公司
                $query = $this->db->where(array('id'=> $companyId, 'superCompany'=>9))->get('company');
                $isXfChildCompany = $row = $query->row_array();
                $data['isXfGroup'] = (($companyId == 9) or !empty($isXfChildCompany));
       	
                //是否广汇或下属公司
	        $data['isGh'] = FALSE;
	        if($companyId == '8'){
        	     $data['isGh'] = TRUE;
	        }else{
        	    //查询上级公司id
	            $query = $this->db->select('superCompany')->where('id',$companyId)->get('company');
	            $superCompany = isset($query->row()->superCompany) ? $query->row()->superCompany : 0;
        	     if($superCompany == '8'){
	                $data['isGh'] = TRUE;
	             }
        }
		if($noWeixin)
			$this->load->view('evaluation_index1',$data);
		else
			$this->load->view('evaluation_index',$data);
	}
	
	//拍照规范
	public function pzgf()
	{
		$this->load->view('evaluation_pzgf');
	}
	
	//查看图片
	public function jpg($type = '1')
	{
		switch ($type)
		{
			case '2':
				$data = array('title'=>'行驶证规范','name'=>'2xsz.jpg');
				break;
			case '3':
				$data = array('title'=>'车辆铭牌规范','name'=>'3clmp.jpg');
				break;
			case '4':
				$data = array('title'=>'车辆内饰规范','name'=>'4clns.jpg');
				break;
			case '5':
				$data = array('title'=>'车辆外观规范','name'=>'5clwg.jpg');
				break;
			case '6':
				$data = array('title'=>'车骨架主体规范','name'=>'6cgj.jpg');
				break;	
			default:
				$data = array('title'=>'登记证规范','name'=>'1djz.jpg');
				break;					
		}
		$this->load->view('evaluation_jpg',$data);
	}
	
	public function do_eval($noWeixin = 0)
	{
		$remark = $this->input->post('remark');
		$preSalePrice = intval(trim($this->input->post('preSalePrice'))*100)/100;//预售价格
		$car_bill_id = get_cookie('car_bill_id');//单据ID
		get_cookie('wx_user_id') && $this->wx_user_id = get_cookie('wx_user_id');
		//获取companyid
		$query = $this->db->select('companyId')->where('englishName',$this->user)->get('user');
		$companyId = isset($query->row()->companyId) ? $query->row()->companyId : 0;
		if($car_bill_id && $this->user)
		{
			//是否有申请单号
			$show_url = $this->config->item('is_show_aid').'?companyId='.$companyId;
			$is_show_aid = 'false';//file_get_contents($show_url);
			$applyCarBillId = $this->input->post('applyCarBillId') ? trim($this->input->post('applyCarBillId')) : '';
			if($is_show_aid == 'true' && ! $applyCarBillId)
			{
				show_error(base_url().'index.php/evaluation/index',500,'缺少申请单号.');
			}
			//申请单号是否重复
			if($applyCarBillId)
			{
				$repeat_num = $this->db->where(array(
						'applyCarBillId'=>$applyCarBillId,
						'carBillId != '=>$car_bill_id
						))->count_all_results('carbill');
				if($repeat_num)
				{
					show_error(base_url().'index.php/evaluation/index',500,'申请单号已存在,请重新填写.');
				}
			}
			//检查资料是否完整
			$num = $this->db->where('carBillId',$car_bill_id)->count_all_results('carimage');
			
                        //5.9考虑先锋子公司
                        $query = $this->db->where(array('id'=> $companyId, 'superCompany'=>9))->get('company');
                        $isXfChildCompany = $row = $query->row_array();
                        $data['isXfGroup'] = (($companyId == 9) or !empty($isXfChildCompany));
                        
                        //图片上传完，更新
			$bNum = $data['isXfGroup'] ? '18' : '24'; //必填数			
			//租赁期限
			$leaseTerm = intval($this->input->post('leaseTerm'));
                        
			if($num > $bNum)
			{
				$date = date('Y-m-d H:i:s');
				//中文名
				$query = $this->db->where('englishName',$this->user)->select('chineseName')->get('user');
				$chineseName = isset($query->row()->chineseName) ? $query->row()->chineseName : $this->user;
				//审批意见
				$op = $date.' '.$chineseName.'[采集]: '.$remark.'<br /><br />';
				//提交客户端
				$recordFrom = $noWeixin ? 'mobileWeb' : '微信采集';
				//状态0,23允许更新
				$sql = "update carbill set applyCarBillId='{$applyCarBillId}', recordFrom='{$recordFrom}', 
				createTime = IF(`status`='0','{$date}',createTime),
				`status`='31',preSalePrice={$preSalePrice},mark='{$remark}',modifyTime='{$date}',csTime='{$date}',
				applyAllOpinion=concat_ws('','{$op}',applyAllOpinion),leaseTerm = '{$leaseTerm}'
				where carBillId='{$car_bill_id}' and `status` in('0','23','33','32','31')";
				$r = $this->db->query($sql);
				if($r)
				{
					//删除单号cookie
					delete_cookie('car_bill_id');
					//获取订单号
					$query = $this->db->select('carBillId,modifyTime,createTime')->where('carBillId',$car_bill_id)->get('carbill');
					$finish_data = $query->row_array();
					if( ! $noWeixin)
					{
						//微信通知,写入消息表
						$content = '评估单提交成功,订单号：'.$finish_data['carBillId'];
						$this->db->insert('billmessage',array(
							'carbillId'	=>	$car_bill_id,
							'wxUserId'	=>	$this->wx_user_id,
							'carbillStatus'	=>	'21',
							'content'	=>	$content,
							'status'	=>	'0',
							'sendtime'	=>	date('Y-m-d H:i:s')
						));
					}
					file_put_contents($this->_log_path,$recordFrom.'端提交单据,ID:'.$car_bill_id.$this->_next_line,FILE_APPEND);
					
					$this->load->view('evaluation_finish',$finish_data);
				}
				else 
					show_error(base_url().'index.php/evaluation/index',500,'单据已提交.');
			}
			else
			{
				//补资料
				show_error(base_url().'index.php/evaluation/index',500,'资料不全，请补齐.');
			}
		}
		else
		{
			//过期，重新提交
			$this->index();
		}
	}
	
	public function down_image($serverId = 0, $type = 0, $no = 0)
	{
		$car_bill_id = get_cookie('car_bill_id');//单据
		$this->user = get_cookie('user');
		$type = urldecode($type);
		if($car_bill_id && $this->user && $serverId && $type && $no)
		{
			//开始事务
			$this->db->trans_start();
			//获取companyid
			$query = $this->db->select('companyId')->where('englishName',$this->user)->get('user');
			$companyId = isset($query->row()->companyId) ? $query->row()->companyId : 'noCompany';
			//存放路径	/2015/12/18/test01/2015121854/图片.png
			$eva_dir = $this->config->item('eva_dir');
			$ej_dir = $companyId.'/'.date('Y').'/'.date('m').'/'.date('d').'/'.$this->user.'/'.$car_bill_id.'/';
			$target = $eva_dir.$ej_dir;
			$img_name = uniqid().'.jpg';
			$targetName = $target.$img_name;
			$cy_target = '/var/www/html/'.$eva_dir.$ej_dir.$img_name;
			$dir_arr = array(
				0=>$companyId,	
				1=>date('Y'),
				2=>date('m'),
				3=>date('d'),
				4=>$this->user,
				5=>$car_bill_id					
			); 
			foreach ($dir_arr as $d)
			{
				if( ! is_dir($eva_dir.$d))
				{
					if( ! mkdir($eva_dir.$d, 0777,true))
					{
						if( ! chmod($eva_dir.$d, 0777))
						{
							echo 'error';
							file_put_contents($this->_log_path,'没有权限创建目录:'.$eva_dir.$d.$this->_next_line,FILE_APPEND);
							exit;
						}
					}
					else 
					{
						chmod($eva_dir.$d, 0777);
					}
				}
				$eva_dir = $eva_dir.$d.'/';
			}	
		
			$log_msg = '时间:'.date('Y-m-d H:i:s').$this->_next_line.'参数：serverId:'.$serverId .'---type:'. $type.'---no:' . $no.'---bill:' . $car_bill_id.'图片路径:'.$targetName.$this->_next_line;
			file_put_contents($this->_log_path,$log_msg,FILE_APPEND);
			//获取微信图片
			$accessToken = $this->jssdk->getAccessToken();
			$ch = curl_init("https://qyapi.weixin.qq.com/cgi-bin/media/get?access_token={$accessToken}&media_id={$serverId}");
			$fp = fopen(FCPATH.$targetName, 'wb');
			curl_setopt($ch, CURLOPT_FILE, $fp);
			curl_setopt($ch, CURLOPT_HEADER, 0);
			$res = curl_exec($ch);
			curl_close($ch);
			fclose($fp);
			//图片权限
			chmod($targetName, 0777);
			//保存数据
			//查找是否存在
			if($res)
			{
				//生成缩略图
				$sl = json_decode(file_get_contents($this->config->item('zip_img_addr').'?userName='.$this->user.'&fileName='.$cy_target));
				
				file_put_contents($this->_log_path,json_encode($sl).$this->_next_line,FILE_APPEND);
	                        if($sl->success !== true)
				{
					$res = array('status'=>'0','msg'=>$type.'第'.$no.'张图片生成缩略图失败失败，请重新上传.');
					echo json_encode($res);
					exit;
				}
				
				$query = $this->db->where(array('carBillId'=>$car_bill_id,'imageSeqNum'=>$no,'imageClass'=>$type))->get('carimage');
				$row = $query->row_array();
				if( ! empty($row))
				{
					//更新
					$this->db->where('id',$row['id'])->update('carimage',array(
						'imagePath'=>$targetName,
						'imageThumbPath'=>isset($sl->object) ? $target.$sl->object : ''
					));
				}
				else 
				{
					//新增
					$this->db->insert('carimage',array(
						'carBillId'=>$car_bill_id,
						'imageSeqNum'=>$no,
						'imageClass'=>$type,
						'imagePath'=>$targetName,
						'imageThumbPath'=>isset($sl->object) ? $target.$sl->object : ''
					));
				}
				file_put_contents($this->_log_path,$this->db->last_query().$this->_next_line,FILE_APPEND);
				$this->db->trans_complete();
				echo 'success';
				
			}
		}
		else
		{ 
			echo 'error';
		}
	}
	
	//非微信上传图片
	public function up_image( $type = 0, $no = 0)
	{
		header('content-type:text/html charset:utf-8');
		//没有成功上传文件，报错并退出。
	    if(empty($_FILES)) {
	      	$res = array('status'=>'0','message'=>'未选择文件.');
	      	echo json_encode($res);
			exit;
	    }
	    
	    $car_bill_id = get_cookie('car_bill_id');//单据
		$this->user = get_cookie('user');
		$type = urldecode($type);
		if($car_bill_id && $this->user && $type && $no)
		{
			//开始事务
			$this->db->trans_start();
			//获取companyid
			$query = $this->db->select('companyId')->where('englishName',$this->user)->get('user');
			$companyId = isset($query->row()->companyId) ? $query->row()->companyId : 'noCompany';
			//存放路径	/2015/12/18/test01/2015121854/图片.png
			$eva_dir = $this->config->item('eva_dir');
			$ej_dir = $companyId.'/'.date('Y').'/'.date('m').'/'.date('d').'/'.$this->user.'/'.$car_bill_id.'/';
			$target = $eva_dir.$ej_dir;
			$img_name = uniqid().'.jpg';
			$targetName = $target.$img_name;
			$cy_target = '/var/www/html/'.$eva_dir.$ej_dir.$img_name;
			$dir_arr = array(
				0=>$companyId,	
				1=>date('Y'),
				2=>date('m'),
				3=>date('d'),
				4=>$this->user,
				5=>$car_bill_id					
			); 
			foreach ($dir_arr as $d)
			{
				if( ! is_dir($eva_dir.$d))
				{
					if( ! mkdir($eva_dir.$d, 0777,true))
					{
						if( ! chmod($eva_dir.$d, 0777))
						{
							$res = array('status'=>'0','msg'=>'没有权限创建目录:'.$eva_dir.$d);
				        	echo json_encode($res);
							file_put_contents($this->_log_path,'没有权限创建目录:'.$eva_dir.$d.$this->_next_line,FILE_APPEND);
							exit;
						}
					}
					else 
					{
						chmod($eva_dir.$d, 0777);
					}
				}
				$eva_dir = $eva_dir.$d.'/';
			}
		}
	    
	    
		$filename = $_FILES['image_file']['name'];
//		$gb_filename = iconv('utf-8','gb2312',$filename);
		$MAXIMUM_FILESIZE = 2 * 1024 * 1024;     //文件大小限制    1M = 1 * 1024 * 1024 B;
        $rEFileTypes = "/^\.(jpg|jpeg|gif|png){1}$/i"; 
        $isMoved = false;  //默认上传失败
        if ($_FILES['image_file']['size'] > $MAXIMUM_FILESIZE){
        	$res = array('status'=>'0','msg'=>$type.'第'.$no.'张图片文件大小超限.');
        	echo json_encode($res);
			exit;
        }
		if ( ! preg_match($rEFileTypes, strrchr($filename, '.'))){
        	$res = array('status'=>'0','msg'=>$type.'第'.$no.'张图片文件格式错误.');
        	echo json_encode($res);
			exit;
        }
        $isMoved = @move_uploaded_file ( $_FILES['image_file']['tmp_name'], $cy_target);
		if($isMoved){
            $res = array('status'=>'1','message'=>'上传成功.','src'=>base_url().$targetName);
        }else {
            $res = array('status'=>'0','msg'=>$type.'第'.$no.'张图片上传失败，请重新上传.');
        	echo json_encode($res);
			exit;
        }
        
        $log_msg = '时间:'.date('Y-m-d H:i:s').$this->_next_line .'---type:'. $type.'---no:' . $no.'---bill:' . $car_bill_id.'图片路径:'.$targetName.$this->_next_line;
		file_put_contents($this->_log_path,$log_msg,FILE_APPEND);

		//生成缩略图
		$sl = json_decode(file_get_contents($this->config->item('zip_img_addr').'?userName='.$this->user.'&fileName='.$cy_target));

		file_put_contents($this->_log_path,json_encode($sl).$this->_next_line,FILE_APPEND);

		if($sl->success !== true)
		{
			$res = array('status'=>'0','msg'=>$type.'第'.$no.'张图片生成缩略图失败失败，请重新上传.');
			echo json_encode($res);
			exit;
		}

		$query = $this->db->where(array('carBillId'=>$car_bill_id,'imageSeqNum'=>$no,'imageClass'=>$type))->get('carimage');
		$row = $query->row_array();
		if( ! empty($row))
		{
			//更新
			$this->db->where('id',$row['id'])->update('carimage',array(
				'imagePath'=>$targetName,
				'imageThumbPath'=>isset($sl->object) ? $target.$sl->object : ''
			));
		}
		else 
		{
			//新增
			$this->db->insert('carimage',array(
				'carBillId'=>$car_bill_id,
				'imageSeqNum'=>$no,
				'imageClass'=>$type,
				'imagePath'=>$targetName,
				'imageThumbPath'=>isset($sl->object) ? $target.$sl->object : ''
			));
		}
		file_put_contents($this->_log_path,$this->db->last_query().$this->_next_line,FILE_APPEND);
		$this->db->trans_complete();
		echo json_encode($res);
		exit;
	}
	
	//删除备用图片
	public function del_image($type='',$no=0)
	{
		if($type && $no)
		{
			$car_bill_id = get_cookie('car_bill_id');
			$this->db->delete('carimage',array(
				'carBillId'	=>	$car_bill_id,
				'imageSeqNum'=>	$no,
				'imageClass' =>	urldecode($type)
			));
			echo '删除成功.';
		}
		else 
			echo '缺少参数.';
		exit;
	}
}
