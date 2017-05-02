<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><?php echo $title;?>-海威康微估车</title>
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
		      	<a class="back" href="<?php echo base_url().'index.php/evaluation/index';?>" style="width:40px;color:#069;">返回</a>
	      </section>
	  </header>
      <div class="au_conBody manager question">
       <div class="searchbox">
       		<img src="/static/img/<?php echo $name;?>" alt="$title" style="width:100%" />
       </div>
      </div>
  </div>
</div>  
</body>
</html>