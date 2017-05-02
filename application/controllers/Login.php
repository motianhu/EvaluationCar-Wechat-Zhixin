<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {
	private $openid = '';
	private $user = '';
	private $wx_user_id = '';
	private $_log_path = '';
	private $_next_line = "\r\n\r\n";
	
	public function __construct()
	{
		parent::__construct();
		$this->load->library('jssdk',array('appId'=> $this->config->item('appId'),'appSecret'=> $this->config->item('appSecret')));
		//日志
		$this->_log_path = './log/'.date('Ymd').'.php';
		if ( ! file_exists('./log/'.date('Ymd').'.php'))
		{
			$log_msg = "<"."?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed'); ?".">".$this->_next_line;
			file_put_contents($this->_log_path, $log_msg);
		}
//		delete_cookie('wx_user_id');
//		delete_cookie('user');
	}
	public function index()
	{
		//用户已登录,直接跳过
		get_cookie('wx_user_id') && $this->wx_user_id = get_cookie('wx_user_id');
		get_cookie('user') && $this->user = get_cookie('user');
		if($this->user)
		{
			if( ! $this->wx_user_id){
				$query = $this->db->select('wx_user_id,companyId')->where(array('englishName'=>$this->user))->get('user');
				$this->wx_user_id = $query->row()->wx_user_id;
				if($this->wx_user_id)
				{
					set_cookie('wx_user_id',$this->wx_user_id,315360000);
					//获取公司名称
					$companyId = $query->row()->companyId;
					if($companyId)
					{
						$companyInfo = $this->db->select('companyName')->where(array('id'=>$companyId))->get('company');
						$companyName = isset($companyInfo->row()->companyName)?$companyInfo->row()->companyName:false;
						if($companyName)
						{
							show_error(base_url().'index.php/audit/index',500,'欢迎登录'.$companyName.'汽车服务采集系统.','1');
						}
					}
					show_error(base_url().'index.php/audit/index',500,'登录成功.','1');
				}
				else 
					$this->load->view('login_index');
				exit;	
			}
			//是否已绑定
			if($this->db->where(array('englishName'=>$this->user,'wx_user_id'=>$this->wx_user_id))->count_all_results('user'))
			{
				$query = $this->db->select('companyId')->where(array('englishName'=>$this->user))->get('user');
				$companyId = $query->row()->companyId;
				if($companyId)
				{
					$companyInfo = $this->db->select('companyName')->where(array('id'=>$companyId))->get('company');
					$companyName = isset($companyInfo->row()->companyName)?$companyInfo->row()->companyName:false;
					if($companyName)
					{
						show_error(base_url().'index.php/audit/index',500,'欢迎登录'.$companyName.'汽车服务采集系统.');
					}
				}
				redirect(base_url().'index.php/result/index/登录成功');	
			}
			else 
				$this->load->view('login_index');	
		}else
			$this->load->view('login_index');
	}
	
	//登录 默认微信$type = 0
	public function do_login($type = 0)
	{
		$this->user = trim($this->input->post('u_name'));
 		$pwd = trim($this->input->post('u_password'));
 		
		if($this->user && $pwd)
		{
			$pwd_url = $this->config->item('pwd_inter_addr').'?userName='.$this->user.'&password='.$pwd;
			$res = json_decode(file_get_contents($pwd_url));
			if( ! isset($res->success) )
			{
				show_error(base_url().'index.php/login/index',500,'服务器异常.');
			}
			if( $res->success != true)
			{
				show_error(base_url().'index.php/login/index',500,$res->message);
			}
			//{"success":false,"message":"密码错误","object":null}
			//查看用户是否存在
			$query = $this->db->select('id')->where(array('englishName'=>$this->user))->get('user');
			$user_info = $query->row_array();
			if( !empty($user_info) )
			{	
				if($type)
				{
					set_cookie('user',$this->user,315360000);
					redirect(base_url().'index.php/result/index/登录成功');
					exit;
				}
				else 
				{
					//获取openid,静默 ,state值a-zA-Z0-9的参数值，长度不可超过128个字节
					$redirect_url = urlencode(base_url().'index.php/login/oauth2');
					$url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$this->config->item('appId').
					'&redirect_uri='.$redirect_url.'&response_type=code&scope=snsapi_base&state='.$user_info['id'].'#wechat_redirect';
					redirect($url);
				}
			}
			else
			{
				show_error(base_url().'index.php/login/index',500,'用户不存在');
			}
		}
		else 
		{
			show_error(base_url().'index.php/login/index',500,'账号密码不能为空');
		}
		exit;
	}
	
	//获取登录结果
	public function is_login()
	{
		//8秒未登录
		for ($i=0;$i<5;$i++)
		{
			if($this->wx_user_id)
			{
				$query = $this->db->select('id')->where(array('wx_user_id'=>$this->wx_user_id))->get('user');
				$user_info = $query->row_array();
				if( !empty($user_info) )
				{
					set_cookie('wx_user_id',$this->wx_user_id,315360000);
					set_cookie('user_id',$this->user_id,315360000);
					$this->load->view('login_success');
				}
			}
			sleep(1);
		}
		$this->load->view('login_index');
	}
	
	
	//微信返回回调页面
	public function oauth2()
	{
		//微信返回数据
		$code = $this->input->get('code');
 		$userId = $this->input->get('state');
 		//用户详情
 		$query = $this->db->where('id',$userId)->select('englishName')->get('user');
 		$this->user = isset($query->row()->englishName) ? $query->row()->englishName : '';
 		if($this->user)
 		{ 
			$access_token = $this->jssdk->getAccessToken();
			$url = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=".$access_token."&code=".$code;
			$sec = $this->jssdk->httpGet($url);
			$log_msg = '时间:'.date('Y-m-d H:i:s').'用户:'.$this->user.$this->_next_line.'请求url:'.$url.$this->_next_line.'回调结果数据:'.$sec.$this->_next_line;
			file_put_contents($this->_log_path,$log_msg,FILE_APPEND);
			$res = json_decode($sec,true);
                        
                        //获取第一次用户微信号
                        $query = $this->db->select('wx_user_id,companyId')->where(array('englishName'=>$this->user))->get('user');
			$this->wx_user_id = $query->row()->wx_user_id;
                        
			//是内部成员，存在userid，关联用户
			if(isset($res['UserId']) && $res['UserId'])
			{
                                if(!$this->wx_user_id) {
				    $this->wx_user_id = $res['UserId'];
                                }
				//绑定微信
				$this->db->where(array('id'=>$userId))->update('user',array('wx_user_id'=>$this->wx_user_id));
				
				$log_msg = '时间:'.date('Y-m-d H:i:s').$this->_next_line.'绑定用户执行sql:'.$this->db->last_query().'影响'.$this->db->affected_rows().'行'.$this->_next_line;
				file_put_contents($this->_log_path,$log_msg,FILE_APPEND);
				
				set_cookie('wx_user_id',$this->wx_user_id,315360000);
				set_cookie('user',$this->user,315360000);
				redirect(base_url().'index.php/result/index/登录成功');
				exit;
			}
			else 
			{
				sleep(1);
				$this->wx_user_id = get_cookie('wx_user_id');
				if($this->wx_user_id)
				{
					//绑定微信
					$this->db->where(array('id'=>$userId))->update('user',array('wx_user_id'=>$this->wx_user_id));
					
					$log_msg = '时间:'.date('Y-m-d H:i:s').$this->_next_line.'绑定用户执行sql:'.$this->db->last_query().'影响'.$this->db->affected_rows().'行'.$this->_next_line;
					file_put_contents($this->_log_path,$log_msg,FILE_APPEND);
					redirect(base_url().'index.php/result/index/登录成功');
				}
				else 
					show_error(base_url().'index.php/login/index',500,'非企业用户,请先添加.');
			}
		}
		else
		{
			file_put_contents($this->_log_path,$log_msg,FILE_APPEND);
			show_error(base_url().'index.php/login/index',500,'用户不存在,请联系管理员.');
		}
	}
	
	//退出
	public function login_out()
	{
		delete_cookie('wx_user_id');
		delete_cookie('user');
		redirect(base_url().'index.php/result/index/已退出当前账号');
	}
}
