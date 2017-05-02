<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Customer extends CI_Controller {

    private $user = '';

    public function __construct() {
        parent::__construct();
        //登录状态判断
        get_cookie('user') && $this->user = get_cookie('user');
        if (!$this->user) {
            redirect(base_url() . 'index.php/login/index');
            exit;
        }
    }

    public function index() {
        get_cookie('user') && $this->user = get_cookie('user');
        if (!$this->user) {
            redirect(base_url() . 'index.php/login/index');
            exit;
        } else {
            $data['englishName'] = $this->user;
            $this->load->view('customer_index', $data);
        }
    }

}
