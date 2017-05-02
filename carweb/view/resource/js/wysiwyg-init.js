var template = "<div class='wysiwyg-toolbar'><div class='btn-toolbar' data-role='editor-toolbar' data-target='#{editor-id}'>"
	 + "	<div class='btn-group'>"
	 + "		<a class='dropdown' data-toggle='dropdown' title='' data-original-title='Font Size'><i class='icon-dashboard'></i><b class='caret'></b></a>"
	 + "		<ul class='dropdown-menu'>"
	 + "			<li><a data-edit='forecolor 000000' style='background-color:#000000'>&nbsp;</a></li>"
	 + "			<li><a data-edit='forecolor FF0000' style='background-color:#FF0000'>&nbsp;</a></li>"
	 + "			<li><a data-edit='forecolor 00FF00' style='background-color:#00FF00'>&nbsp;</a></li>"
	 + "			<li><a data-edit='forecolor 0000FF' style='background-color:#0000FF'>&nbsp;</a></li>"
	 + "			<li><a data-edit='forecolor FFFF00' style='background-color:#FFFF00'>&nbsp;</a></li>"
	 + "			<li><a data-edit='forecolor 00FFFF' style='background-color:#00FFFF'>&nbsp;</a></li>"
	 + "			<li><a data-edit='forecolor FF00FF' style='background-color:#FF00FF'>&nbsp;</a></li>"
	 + "			<li><a data-edit='forecolor C0C0C0' style='background-color:#C0C0C0'>&nbsp;</a></li>"
	 + "			<li><a data-edit='forecolor FFFFFF' style='background-color:#FFFFFF'>&nbsp;</a></li>"
	 + "		</ul>"
	 + "	</div>"
	 + "	<div class='btn-group'>"
	 + "		<a class='dropdown' data-toggle='dropdown' title='' data-original-title='Font Size'><i class='icon-text-height'></i><b class='caret'></b></a>"
	 + "		<ul class='dropdown-menu'>"
	 + "			<li><a data-edit='fontSize 5'><font size='5'>大</font></a></li>"
	 + "			<li><a data-edit='fontSize 3'><font size='3'>中</font></a></li>"
	 + "			<li><a data-edit='fontSize 3'><font size='2'>普通</font></a></li>"
	 + "			<li><a data-edit='fontSize 1'><font size='1'>小</font></a></li>"
	 + "		</ul>"
	 + "	</div>"
	 + "	<div class='btn-group'>"
	 + "		<a data-edit='bold' title='' data-original-title='Bold (Ctrl/Cmd+B)'><i class='icon-bold'></i></a>"
	 + "		<a data-edit='italic' title='' data-original-title='Italic (Ctrl/Cmd+I)'><i class='icon-italic'></i></a>"
	 + "		<a data-edit='strikethrough' title='' data-original-title='Strikethrough'><i class='icon-strikethrough'></i></a>"
	 + "		<a data-edit='underline' title='' data-original-title='Underline (Ctrl/Cmd+U)'><i class='icon-underline'></i></a>"
	 + "	</div>"
	 + "	<div class='btn-group'>"
	 + "		<a data-edit='insertunorderedlist' title='' data-original-title='Bullet list'><i class='icon-list-ul'></i></a>"
	 + "		<a data-edit='insertorderedlist' title='' data-original-title='Number list'><i class='icon-list-ol'></i></a>"
	 + "		<a data-edit='outdent' title='' data-original-title='Reduce indent (Shift+Tab)'><i class='icon-indent-left'></i></a>"
	 + "		<a data-edit='indent' title='' data-original-title='Indent (Tab)'><i class='icon-indent-right'></i></a>"
	 + "	</div>"
	 + "	<div class='btn-group'>"
	 + "		<a data-edit='justifyleft' title='' data-original-title='Align Left (Ctrl/Cmd+L)'><i class='icon-align-left'></i></a>"
	 + "		<a data-edit='justifycenter' title='' data-original-title='Center (Ctrl/Cmd+E)'><i class='icon-align-center'></i></a>"
	 + "		<a data-edit='justifyright' title='' data-original-title='Align Right (Ctrl/Cmd+R)'><i class='icon-align-right'></i></a>"
	 + "		<a data-edit='justifyfull' title='' data-original-title='Justify (Ctrl/Cmd+J)'><i class='icon-align-justify'></i></a>"
	 + "	</div>"
	 +'<div class="btn-group">'
	 +'  <a class="btn" title="" id="{editor-id}pictureBtn" data-original-title="Insert picture (or just drag &amp; drop)"><i class="icon-picture"></i></a>'
	 +'  <input type="file" id="{editor-id}upload" name="uploadFile" data-role="magic-overlay" data-target="#{editor-id}pictureBtn" data-edit="insertImage" style="opacity: 0; position: absolute; top: 0px; left: 0px; width: 37px;">'
	 +'</div>'
	 + "	<div class='btn-group'>"
	 + "		<a data-edit='undo' title='' data-original-title='Undo (Ctrl/Cmd+Z)'><i class='icon-undo'></i></a>"
	 + "		<a data-edit='redo' title='' data-original-title='Redo (Ctrl/Cmd+Y)'><i class='icon-repeat'></i></a>"
	 + "	</div>"
	 + "</div></div>"
	 + "<div class='wysiwyg-editor' id='{editor-id}' contenteditable='true'></div>";
$.fn.initwysiwyg = function(){
	var $this = $(this);
	$this.html(template.replace(/{editor-id}/g,$this.data("wysiwyg")));
	$("#" + $this.data("wysiwyg")).wysiwyg({toolbarSelector: '[data-role=editor-toolbar][data-target="#'+$this.data("wysiwyg")+'"]'});
	$this = null;
};
$("[data-wysiwyg]").each(function(){
	var $this = $(this);
	$this.initwysiwyg();
});
