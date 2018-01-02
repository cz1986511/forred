/*
*福袋详情
*/
var luckyBagDetail = {};
//获取数据
luckyBagDetail.getData = function() {
	var fdId = getQueryString('fdId');
	$.ajax({
        type: "GET",
        url: "http://xiaozhuo.info/AIinfo/fudai/"+fdId,
        contentType:'application/json;charset=utf-8',
        dataType: "json",
        success: function(data){
        	var resData = data;
        	if(resData.status === 0){
        		console.log(resData)
        		luckyBagDetail.fillData(resData.data)
        		luckyBagDetail.calAmt(resData.data.fudaiItemInfos)
        	}else if(resData.status === 2) {
        		//未登录
        		window.location.href = "http://xiaozhuo.info/login.html"
        	}else {
        		$.toptip('系统异常', 'error');
        	}
        }
	});
}
//填充数据
luckyBagDetail.fillData = function(data) {
	var str = "";
	$('#lb-name').text(data.fdName)
	var itemList = data.fudaiItemInfos;
	for (var i = 0; i < itemList.length; i++) {
		str += '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">'
            str += '<div class="weui-media-box__hd">'
              str += '<img class="weui-media-box__thumb" src="" alt="">'
            str += '</div>'
            str += '<div class="weui-media-box__bd">'
              str += '<h4 class="weui-media-box__title item-name">'+itemList[i].fdItemName+'</h4>'
              str += '<p class="weui-media-box__desc">'
                str += '<span class="goods-num">&times;'+itemList[i].fdItemNumber+'</span>'
                str += '<span class="goods-price goods-actual-price">&yen;'+absoluteDiv(itemList[i].fdItemOriginPrice,100).toFixed(2)+'</span>'
                str += '<span class="goods-price goods-original-price">&yen;'+absoluteDiv(itemList[i].fdItemPrice,100).toFixed(2)+'</span>'
              str += '</p>'
            str += '</div>'
          str += '</a>'
	}
	$('#item-list').html(str)
}
luckyBagDetail.calAmt = function(data) {
	var tmpOPrice = 0;
	var tmpPrice = 0;
	for (var i = 0; i < data.length; i++) {
		var itemOprice = absoluteMul(data[i].fdItemOriginPrice,data[i].fdItemName)
		tmpOPrice = absoluteAdd(tmpOPrice,itemOprice) 

		var itemprice = absoluteMul(data[i].fdItemPrice,data[i].fdItemName)
		tmpPrice = absoluteAdd(tmpPrice,itemprice) 
	}
	$('.lb-original-price').text('&yen;'+absoluteDiv(tmpOPrice,100).toFixed(2))
	$('.lb-actual-price').text('&yen;'+absoluteDiv(itemprice,100).toFixed(2))
}
$(function() {
	$("#share-it-pop").on("click", function(){
	    $("#share-it-pop").hide(); 
	})
	luckyBagDetail.getData()
})
