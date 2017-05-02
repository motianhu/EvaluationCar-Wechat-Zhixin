<?php
defined('BASEPATH') OR exit('No direct script access allowed');
if ( ! function_exists('function_usable'))
{
	function show_error( $url, $status_code = 500, $title = '' )
	{	
		$_error =& load_class('Exceptions', 'core');
		echo $_error->show_error($title, $url, 'error_general', $status_code);
		exit;
	}
}