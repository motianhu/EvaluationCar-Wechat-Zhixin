<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Audit extends CI_Controller {
	private $user = '';
	private $billStatus;
	//状态类型 1->审核中21,22; 2->
	private $status_type = array(
		'1'	=>	array('21','22','23','24','31','32','33','34','41','42','43','44','51','52','53'),
		'2'	=>	array('54')
	);
	public function __construct()
	{
		parent::__construct();
		$this->billStatus = $this->config->item('billStatus');
		//登录状态判断
		get_cookie('user') && $this->user = get_cookie('user');
//		$this->user = 'cy';
		if( ! $this->user)
		{		
			redirect(base_url().'index.php/login/index');
			exit;
		}
	}
	
	public function index($type = '1')
	{
		//获取companyid
		$query = $this->db->select('companyId,chineseName')->where('englishName',$this->user)->get('user');
		$companyId = isset($query->row()->companyId) ? $query->row()->companyId : 0;
		$chineseName = isset($query->row()->chineseName) ? $query->row()->chineseName : '';
		//是否显示申请单号
		$show_url = $this->config->item('is_show_aid').'?companyId='.$companyId;
		$data['is_show_aid'] = file_get_contents($show_url);
		
		$keyword = trim($this->input->post('keyword'));
		if($keyword)
		{
			if($data['is_show_aid'] == 'true')
				$this->db->like('applyCarBillId', $keyword);
			else
				$this->db->like('carBillId', $keyword);
			$this->db->where_in('status',array_merge($this->status_type['1'],$this->status_type['2']));
			$type = '3';
		}
		else
		{
			$this->db->where_in('status',$this->status_type[$type]);
		}
		$pageSize = $this->config->item('pageSize');
		
		$where = array('createUser'=>$this->user);
		$query = $this->db->where($where)->limit($pageSize)->order_by('modifyTime desc,createTime desc')->get('carbill');
		$data['list'] = $query->result_array();
		
		$data['billStatus'] = $this->billStatus;
		$data['status_type'] = $type;
		$data['keyword'] = $keyword;
		$data['englishName'] = $this->user;
		$data['chineseName'] = $chineseName;
		$this->load->view('audit_index',$data);

	}
	
	//加载数据
	public function get_audit_data($type = '1', $p = 1)
	{
		$keyword = trim($this->input->post('keyword'));
		if($keyword)
		{
			$this->db->like('carBillId', $keyword);
			$type = '3';
		}
		else
		{
			$this->db->where_in('status',$this->status_type[$type]);
		}
		$pageSize = $this->config->item('pageSize');
		$query = $this->db->where(array('createUser'=>$this->user))->order_by('modifyTime','desc')->limit($pageSize,$pageSize*$p)->get('carbill');		
		$data['list'] = $query->result_array();
		
		$data['billStatus'] = $this->billStatus;
		$data['status_type'] = $type;
		$data['keyword'] = $keyword;
		$this->load->view('audit_data',$data);
	}
	
	public function detail($id = 0)
	{
		if($id)
		{
			$query = $this->db->where('id',$id)->get('carbill');
			$data = $query->row_array();
			if ( ! empty($data))
			{
				//获取companyid
				$query = $this->db->select('companyId')->where('englishName',$this->user)->get('user');
				$companyId = isset($query->row()->companyId) ? $query->row()->companyId : 0;
				//是否显示申请单号
				$show_url = $this->config->item('is_show_aid').'?companyId='.$companyId;
				$data['is_show_aid'] = file_get_contents($show_url);
				$data['billStatus'] = $this->billStatus;
				$this->load->view('audit_detail',$data);
			}
			else 
				show_error(base_url().'index.php/audit/index',500,'单号不存在.');
		}
		else
			show_error(base_url().'index.php/audit/index',500,'单号不存在.');
	}
	
	public function get_bill($p = 0, $n = 10)
	{
		$query = $this->db->where('createUser',$this->user)->limit($n,$p)->get('callbill');
		return $query->result_array();
	}
	
}
