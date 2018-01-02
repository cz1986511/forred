$(function() {
	$("#share-it-pop").on("click", function(){
	    $("#share-it-pop").hide(); 
	})
	var fdId = getQueryString(fdId);
	$.ajax({
        type: "GET",
        url: "http://xiaozhuo.info/AIinfo/fudai/"+fdId,
        contentType:'application/json;charset=utf-8',
        data: reqData,
        dataType: "json",
        success: function(data){
        	var resData = data;
        	if(resData.status === 0){
        		console.log(resData)
        	}else if(resData.status === 2) {
        		//未登录
        		window.location.href = "http://xiaozhuo.info/login.html"
        	}else {
        		$.toptip('系统异常', 'error');
        	}
        }
	});
})
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}