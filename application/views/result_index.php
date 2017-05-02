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
<link rel="stylesheet" href="/static/artdialog/css/ui-dialog.css">
<script type="text/javascript" src="/static/js/jquery.js"></script>
<script type="text/javascript" src="/static/artdialog/dist/dialog-min.js"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
</head>
<body>
</body>
<script type="text/javascript">
var d = dialog({content:"<?php echo $title; ?>"});
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
d.show();
if( ! isWeiXin()){
	setTimeout(function () {
	    d.close().remove();
	    window.location.href="<?php echo base_url().'index.php/evaluation';?>";
	}, 2000);
}else{
wx.config({
    debug: false,
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [
        'closeWindow'
    ]
  });
	setTimeout(function () {
	    d.close().remove();
	    wx.closeWindow();
	}, 2000);
}
</script>
</html>