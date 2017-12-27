/*
*福袋列表
*/
var sharedLuckyBag = {};

//福袋列表初始化
sharedLuckyBag.initList = function() {
	sharedLuckyBag.fillList()
}
//填充福袋列表
sharedLuckyBag.fillList = function() {
	sharedLuckyBag.bindEvent()
}
//清空福袋列表
sharedLuckyBag.emptyList = function() {

}
//添加到我的福袋
sharedLuckyBag.addMyLuckyBag = function(data) {
    $.confirm({
	  title: '添加成功！',
	  text: '是否进入“我的福袋”查看?',
	  onOK: function () {
	    //点击确认
	    console.log('onOK')
	  },
	  onCancel: function () {
	  	console.log('onCancel')
	  }
	});
}
//滚动加载福袋列表
sharedLuckyBag.appendLuckyBagList = function() {

}
//进入福袋详情页
sharedLuckyBag.toLuckyBagDetail = function() {
	console.log('进入福袋详情页')
}

//事件绑定
sharedLuckyBag.bindEvent = function() {
	$('.add-lucky-bag').click(function(event) {
		sharedLuckyBag.addMyLuckyBag();
		event.stopPropagation();
	})
	$('.lucky-bag-item').click(function(e) {
		sharedLuckyBag.toLuckyBagDetail()
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

