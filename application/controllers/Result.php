<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Result extends CI_Controller {
	public function __construct()
	{
		parent::__construct();
		$this->load->library('jssdk',array('appId'=> $this->config->item('appId'),'appSecret'=> $this->config->item('appSecret')));
	}
	
	public function index($title='')
	{
		$data['title'] = urldecode($title);
		$data['signPackage'] = $this->jssdk->GetSignPackage();
		$this->load->view('result_index',$data);
	}
	
}
