/*
*商品列表
*/
var goodsInfoInit = [];
var goodsInfoSelected = [];
var goods = {};
//获取商品列表
goods.getGoodsList = function() {
	$.ajax({
        type: "GET",
        url: "http://192.168.50.250/item/fudailist",
        data: {"itemType":"02"},
        dataType: "json",
        success: function(data){
        	var resData = data;
        	if(resData.status === 0){

        	}
        }
	});
	goods.bindEvent()
}
goods.fillGoodsList = function(data) {
	var str = "";
	for (var i = 0; i < data.length; i++) {
		str += '<a href="javascript:;" class="weui-grid js_grid goods-item">'
	        str += '<i class="weui-icon-success select-goods-item"></i>'
	        str += '<div class="weui-grid__icon goods-pic">'
	          str += '<img class="" src="'+data[i].itemDesc+'">'
	        str += '</div>'
	        str += '<p class="weui-grid__label goods-basic-info">'
	          str += '<span class="goods-name">'+data[i].itemName+'</span>'
	          str += '<span class="goods-original-price">&yen;'+absoluteDiv(data[i].itemOriginPrice,100).toFix(2)+'</span>'
	          str += '<span class="goods-actual-price">&yen;'+absoluteDiv(data[i].itemPrice,100).toFix(2)+'</span>'
	        str += '</p>'
	    str += '</a>';
	}
	$('#goods-list-wrap').html(str)
}
//选择商品
goods.selectGoods = function(_this) {
	var _this = _this;
	var $selectEl = _this.find('.select-goods-item');
	var stag = $selectEl.hasClass('weui-icon-success')
	if (stag) {
		$selectEl.removeClass('weui-icon-success').addClass('weui-icon-circle');
		//将商品从选中列表中删除
	}else {
		$selectEl.addClass('weui-icon-success').removeClass('weui-icon-circle')
		//将商品添加到选中列表中
	}
	//选中商品金额计算
}
//选中商品金额计算
goods.calGoodsAmt = function(){
	//
}
//清空已选商品列表
goods.emptyData = function() {
	$('#goods-wrap').empty();
	// $('.to-settle').hide();
	$('#no-data-list').show()
}
//判断是否选择商品
goods.checkSelected = function() {

}
//事件绑定
goods.bindEvent = function() {
	//选择商品事件
	$('.goods-item').click(function(e){
		goods.selectGoods($(this))
	})
}
$(function () {
	goods.getGoodsList()

 	// $(document).on("open", ".weui-popup-modal", function() {
  //   	console.log("open popup");
  // 	}).on("close", ".weui-popup-modal", function() {
  //   	console.log("close popup");
  // 	});
  	//预览福袋
  	$('#to-preview-btn').click(function(e){
  		//判断是否选择商品
  		goods.checkSelected()
		goods.emptyData()
		$("#full-selected-goods").popup();
	})
})