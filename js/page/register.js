/*
 *注册页
 */
 $(function() {
	var registerFlag = true;
	$('#to-register-btn').click(function(){
		if (registerFlag) {
			if(register.checkVal()) {
				var tel = $('#tel').val();
 				var password = $('#password').val();
 				var userName = $('#userName').val()
 				var reqData = {
					"tel":tel,
					"password":$.md5(password),
					"userName":userName
				}
				reqData = JSON.stringify(reqData)
				registerFlag = false;
				$.ajax({
			        type: "POST",
			        url: "http://xiaozhuo.info/AIinfo/user/register",
			        contentType:'application/json;charset=utf-8',
			        data: reqData,
			        dataType: "json",
			        success: function(data){
			        	var resData = data;
			        	if(resData.status === 0){
			        		window.location.href = "http://xiaozhuo.info/login.html"
			        	}else {
			        		var msg = resData.msg || '系统异常'
			        		$.toptip(msg, 'error');
			        	}
			        	registerFlag = true;
			        }
				});
			}
		}
	})
 })
 var register = {};
 register.checkVal = function() {
 	var tel = $.trim($('#tel').val());
 	var password = $.trim($('#password').val());
 	var userName = $.trim($('#userName').val());

    if(!tel) {
    	$.toptip('请输入手机号');
    	return false;
    }else if(!/1[3|4|5|7|8]\d{9}/.test(tel)) {
    	$.toptip('手机号输入不正确');
    	return false;
    }
    if(!password) {
    	$.toptip('请输入密码');
    	return false;
    }
    if(!userName) {
    	$.toptip('请输入姓名');
    	return false;
    }
    return true;
 }