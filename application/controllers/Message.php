<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Message extends CI_Controller {
	public function __construct()
	{
		parent::__construct();
		$this->load->library('jssdk',array('appId'=> $this->config->item('appId'),'appSecret'=> $this->config->item('appSecret')));
	}
	
	//发送微信通知
	public function index()
	{
		//微信通知
		//获取需发送消息列表
		$query = $this->db->where(array('status'=>'0','wxUserId != '=>''))->get('billmessage');
		$res = $query->result_array();
		if( ! empty($res))
		{
			$accessToken = $this->jssdk->getAccessToken();
			foreach ($res as $val)
			{
				$ch = curl_init("https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={$accessToken}");
				$data = array(
				   "touser"=>$val['wxUserId'],
				   "msgtype"=>"text",
				   "agentid"=> 0,
				   "text"=>array('content'=>$val['content']),
				   "safe"=>"0"
				);
//				$this_header = array(
//					"content-type: application/x-www-form-urlencoded; 
//					charset=UTF-8"
//				);
//				curl_setopt($ch,CURLOPT_HTTPHEADER,$this_header);
				curl_setopt ( $ch, CURLOPT_POST, 1 );
				curl_setopt ( $ch, CURLOPT_HEADER, 0 );
				curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
				curl_setopt ( $ch, CURLOPT_POSTFIELDS, json_encode($data,JSON_UNESCAPED_UNICODE));
				$sec = curl_exec ( $ch );
				curl_close ( $ch );
				//更新消息状态
				$res = json_decode($sec,true);
				var_dump($res);
				if($res['errcode'] == '0')
				{
					$this->db->where('id',$val['id'])->update('billmessage',array('status'=>'1'));
				}
			}
		}
	}
	
	public function JSON($array) {
        array_walk_recursive($array, 'urlencode', true);
        $json = json_encode($array);
        return urldecode($json);
    }
     
	
}
