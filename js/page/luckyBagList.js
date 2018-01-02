/*
*福袋列表
*/
var sharedLuckyBag = {};

//福袋列表初始化
sharedLuckyBag.initList = function() {
	var reqData = JSON.stringify({'fdStatus':'02'});
	$.ajax({
        type: "POST",
        url: "http://xiaozhuo.info/AIinfo/fudai/list",
        contentType:'application/json;charset=utf-8',
        data: reqData,
        dataType: "json",
        success: function(data){
        	var resData = data;
        	if(resData.status === 0){
        		sharedLuckyBag.fillList(resData.data)
        	}else if(resData.status === 2) {
        		//未登录
        		window.location.href = "http://xiaozhuo.info/login.html"
        	}else {
        		$.toptip('系统异常', 'error');
        	}
        }
	});
}
//填充福袋列表
sharedLuckyBag.fillList = function(data) {
	var str = "";
	var data = data;
	for (var i = 0; i < data.length; i++) {
		str += '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg lucky-bag-item" data-fdid="'+data[i].fdId+'">'
            str += '<div class="weui-media-box__hd">'
              str += '<img class="weui-media-box__thumb" src="" alt="">'
            str += '</div>'
            str += '<div class="weui-media-box__bd">'
              str += '<h4 class="weui-media-box__title fd-name">'+data[i].fdName+'</h4>'
              str += '<p class="weui-media-box__desc">'
              str += '<span class="original-price">&yen;'+absoluteDiv(data[i].fdAmount,100).toFixed(2)+'</span>'
              str += '<span class="actual-price">&yen;'+absoluteDiv(data[i].fdPrice,100).toFixed(2)+'</span>'
              str += '</p>'
            str += '</div>'

            str += '<div class="weui-media-box__ft">'
             str += '<p><span class="add-lucky-bag" data-fdid="'+data[i].fdId+'">+</span></p>'
            str += '</div>'
          str += '</a>'
	}
	$("#lucky-bag-list").html(str)
	sharedLuckyBag.bindEvent()
}
//清空福袋列表
sharedLuckyBag.emptyList = function() {

}
//添加到我的福袋
sharedLuckyBag.addMyLuckyBag = function(id) {
	var reqData = {
			"fdId":id,
			"actionType":"03"	
		}
	reqData = JSON.stringify(reqData);
	$.ajax({
        type: "POST",
        url: "http://xiaozhuo.info/AIinfo/fudai/update",
        contentType:'application/json;charset=utf-8',
        data: reqData,
        dataType: "json",
        success: function(data){
        	var resData = data;
        	if(resData.status === 0){
        		$.confirm({
				  title: '添加成功！',
				  text: '是否进入“我的福袋”查看?',
				  onOK: function () {
				    //点击确认
				    console.log('onOK')
				    window.location.href = "http://xiaozhuo.info/dmall.html#tab2"
				  },
				  onCancel: function () {
				  	console.log('onCancel')
				  }
				});
        	}else if(resData.status === 2) {
        		//未登录
        		window.location.href = "http://xiaozhuo.info/login.html"
        	}else {
        		$.toptip('系统异常', 'error');
        	}
        }
	});
}
//滚动加载福袋列表
sharedLuckyBag.appendLuckyBagList = function() {

}
//进入福袋详情页
sharedLuckyBag.toLuckyBagDetail = function(fdId) {
	window.location.href="http://xiaozhuo.info/page/luckyBagDetail.html?fdId="+fdId+'&skipFlag='+1;
}

//事件绑定
sharedLuckyBag.bindEvent = function() {
	$('.add-lucky-bag').click(function(event) {
		$.confirm({
		  title: '确定添加？',
		  text: '您确定将此福袋加入“我的福袋”？',
		  onOK: function () {
		    var fdId = $(this).attr('data-fdid')
			sharedLuckyBag.addMyLuckyBag(fdId);
		  },
		  onCancel: function () {
		  	console.log('取消添加')
		  }
		});
		event.stopPropagation();
	})
	
	$('.lucky-bag-item').click(function(e) {
		var fdId = $(this).attr('data-fdid')
		sharedLuckyBag.toLuckyBagDetail(fdId)
	})
}
$(function(){
 	var loading = false;
  	$(document.body).infinite().on("infinite", function() {
	    if(loading) return;
	    $('.weui-loadmore').show()
	    loading = true;
	    setTimeout(function() {
	      loading = false;
	      	console.log('loading 2000')
	      	$('.weui-loadmore').hide()
	    }, 2000);
  	});
  	sharedLuckyBag.initList()
})

