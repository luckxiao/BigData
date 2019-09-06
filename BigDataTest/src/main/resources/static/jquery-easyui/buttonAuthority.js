
function buttonAuthorit(readOnly){
	if(readOnly){
		$('.easyui-linkbutton').linkbutton('disable');
	}else{
		$('.easyui-linkbutton').linkbutton('enable');
	}
	$("[id^='ignoreAuthorit']").each(function(){	
		 $(this).linkbutton('enable');
	});
}
