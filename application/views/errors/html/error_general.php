<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>提示</title>
<link rel="stylesheet" href="/static/artdialog/css/ui-dialog.css">
<script type="text/javascript" src="/static/js/jquery.js"></script>
<script type="text/javascript" src="/static/artdialog/dist/dialog-min.js"></script>
</head>
<body>
</body>
<script type="text/javascript">
$(function(){
	var d = dialog({content:"<?php echo $title; ?>"});
	d.show();
	setTimeout(function () {
	    d.close().remove();
	    window.location.href= "<?php echo $url;?>";
	}, 2000);
})
</script>
</html>