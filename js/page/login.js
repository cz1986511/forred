/*
 *登录页
 */
 $(function() {
	var loginFlag = true;
	$('#login-btn').click(function(){
		if (loginFlag) {
			if(login.checkVal()) {
				var tel = $('#tel').val();
 				var password = $('#password').val();
 				var reqData = {
					"tel":tel,
					"password":$.md5(password)
				}
				reqData = JSON.stringify(reqData)
				loginFlag = false;
				$.ajax({
			        type: "POST",
			        url: "http://xiaozhuo.info/AIinfo/user/login",
			        contentType:'application/json;charset=utf-8',
			        data: reqData,
			        dataType: "json",
			        success: function(data){
			        	var resData = data;
			        	if(resData.status === 0){
			        		window.location.href = "http://xiaozhuo.info/dmall.html"
			        	}else {
			        		var msg = resData.msg || '系统异常'
			        		$.toptip(msg, 'error');
			        	}
			        	loginFlag = true;
			        }
				});
			}
		}
	})
 })
 var login = {};
 login.checkVal = function() {
 	var tel = $.trim($('#tel').val());
 	var password = $.trim($('#password').val());
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
    return true;
 }