/*
*商品列表
*/
var goodsInfoInit = [];
var goodsInfoSelected = [];
var goods = {};
//获取商品列表
goods.getGoodsList = function() {
	var reqData = JSON.stringify({"itemType":"02"})
	$.ajax({
        type: "POST",
        url: "http://xiaozhuo.info/AIinfo/item/fudailist",
        contentType:'application/json;charset=utf-8',
        data: reqData,
        dataType: "json",
        success: function(data){
        	var resData = data;
        	if(resData.status === 0){
        		goods.fillGoodsList(resData.data)
        		goodsInfoInit = resData.data;
        	}else if(resData.status === 2) {
        		//未登录
        		window.location.href = "http://xiaozhuo.info/login.html"
        	}else {
        		$.toptip('系统异常', 'error');
        	}
        }
	});
}
goods.fillGoodsList = function(data) {
	var str = "";
	for (var i = 0; i < data.length; i++) {
		str += '<a href="javascript:;" class="weui-grid js_grid goods-item" goods-id="'+data[i].itemId+'">'
	        str += '<i class="weui-icon-circle select-goods-item"></i>'
	        str += '<div class="weui-grid__icon goods-pic">'
	          str += '<img class="" src="'+data[i].itemDesc+'">'
	        str += '</div>'
	        str += '<p class="weui-grid__label goods-basic-info">'
	          str += '<span class="goods-name" title="'+data[i].itemName+'">'+data[i].itemName+'</span>'
	          str += '<span class="goods-original-price">&yen;'+absoluteDiv(data[i].itemOriginPrice,100).toFixed(2)+'</span>'
	          str += '<span class="goods-actual-price">&yen;'+absoluteDiv(data[i].itemPrice,100).toFixed(2)+'</span>'
	        str += '</p>'
	    str += '</a>';
	}
	$('#goods-list-wrap').html(str)
	goods.bindEvent()
}
//选择商品
goods.selectGoods = function(_this) {
	var _this = _this;
	var $selectEl = _this.find('.select-goods-item') || _this;
	var stag = $selectEl.hasClass('weui-icon-success');
	var $parentEl = $selectEl.parent('.goods-item');
	var goodsId = $parentEl.attr('goods-id');
	if (stag) {
		$selectEl.removeClass('weui-icon-success').addClass('weui-icon-circle');
		//将商品从选中列表中删除
		var sIndex = goods.findArrayElem(goodsInfoSelected,goodsId,'itemId')
		goodsInfoSelected.splice(sIndex,1)
	}else {
		$selectEl.addClass('weui-icon-success').removeClass('weui-icon-circle')
		//将商品添加到选中列表中
		var sIndex = goods.findArrayElem(goodsInfoInit,goodsId,'itemId')
		goodsInfoInit[sIndex].itemNumber = 1;
		if(sIndex >= 0) {
			goodsInfoSelected.push(goodsInfoInit[sIndex])
		}
	}
	//选中商品金额计算
	goods.calGoodsAmt()
}
//选中商品金额计算
goods.calGoodsAmt = function(){
	var selectedTotalAmt = 0;
	for (var i = 0; i < goodsInfoSelected.length; i++) {
		selectedTotalAmt = absoluteAdd(goodsInfoSelected[i].itemPrice,selectedTotalAmt)
	}
	$('.payable-amt').text(absoluteDiv(selectedTotalAmt,100).toFixed(2))
}
//清空已选商品列表
goods.emptyData = function() {
	$('#goods-wrap').empty();
	// $('.to-settle').hide();
	$('#no-data-list').show()
}
//判断是否选择商品
goods.checkSelected = function() {
	if(goodsInfoSelected.length == 0) {
		$.toast("请选择商品", "text");
		return false;
	}
	return true;
}
//事件绑定
goods.bindEvent = function() {
	//选择商品事件
	$('.goods-item').click(function(e){
		goods.selectGoods($(this))
	})
}
 //按照属性值，查找对象数组元素
goods.findArrayElem = function(array,val,attr){
    for (var i=0;i<array.length;i++){
      if(attr) {
        if(array[i][attr]==val){
            return i;
        }
      }else {
        if(array[i]==val){
              return i;
          }
      }
    }
    return -1;
}


//选中商品数据填充
goods.fillSelectedData = function() {
	$('#no-data-list').hide()
	var str = '';
	for (var i = 0; i < goodsInfoSelected.length; i++) {
		str += '<div class="weui-cell weui-cell_swiped">'
	      str += '<div class="weui-cell__bd">'
	        str += '<div class="weui-cell goods-cell" goods-id="'+goodsInfoSelected[i].itemId+'">'
	            str += '<div class="weui-cell__bd">'
	              str += '<p title="'+goodsInfoSelected[i].itemName+'" class="goods-selected-name">'+goodsInfoSelected[i].itemName+'</p>'
	            str += '</div>'
	            str += '<div class="weui-cell__ft">'
	              str += '<span class="goods-price">￥<span class="goods-price-val" data-val="">'+absoluteDiv(goodsInfoSelected[i].itemPrice,100).toFixed(2)+'</span></span>'
	              str += '<div class="weui-count">'
	                str += '<a class="weui-count__btn weui-count__decrease"></a>'
	                str += '<input class="weui-count__number goods-num" type="number" value="'+goodsInfoSelected[i].itemNumber+'" readonly="true"/>'
	                str += '<a class="weui-count__btn weui-count__increase"></a>'
	              str += '</div>'
	            str += '</div>'
	        str += '</div>'
	      str += '</div>'
	      str += '<div class="weui-cell__ft">'
	        str += '<a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout remove-goods-item" href="javascript:">删除</a>'
	      str += '</div>'
	    str += '</div>';
	}
	
    $('#goods-wrap').html(str);
    goods.calSelectedTotalAmtNum()
    goods.bindSelectedEvent()
}
//选中商品---绑定事件
goods.bindSelectedEvent = function() {
	//滑动事件
	$('.weui-cell_swiped').swipeout()
  	
  	//计数器
  	var MAX = 999, MIN = 1;
  	$('.weui-count__decrease').click(function (e) {
    	var $input = $(e.currentTarget).parent().find('.weui-count__number');
    	var $goodsItem = $input.parents('.goods-cell');
    	var goodsId = $goodsItem.attr('goods-id');
    	var number = parseInt($input.val() || "0") - 1
    	if (number < MIN) number = MIN;
    	$input.val(number)
    	var sIndex = goods.findArrayElem(goodsInfoSelected,goodsId,'itemId');
    	goodsInfoSelected[sIndex].itemNumber = number;
    	goods.calSelectedTotalAmtNum();
  	})
  	$('.weui-count__increase').click(function (e) {
    	var $input = $(e.currentTarget).parent().find('.weui-count__number');
    	var $goodsItem = $input.parents('.goods-cell');
    	var goodsId = $goodsItem.attr('goods-id');
    	var number = parseInt($input.val() || "0") + 1
    	if (number > MAX) number = MAX;
    	$input.val(number)
    	var sIndex = goods.findArrayElem(goodsInfoSelected,goodsId,'itemId');
    	goodsInfoSelected[sIndex].itemNumber = number;
    	goods.calSelectedTotalAmtNum()
  	})
  	//删除商品
  	$('.remove-goods-item').click(function(e) {
  		var _this = $(this);
  		$.confirm("您确定要删除此商品？", " ", function() {
  			var $goodsItem = _this.parents('.goods-cell');
    		var goodsId = $goodsItem.attr('goods-id');
    		var sIndex = goods.findArrayElem(goodsInfoSelected,goodsId,'itemId');
    		goodsInfoSelected.splice(sIndex,1)

            $.toptip('删除成功', 'success');
            _this.parents('.weui-cell').remove()
            //检查购物车列表是否为空
            goods.checkGoodsListIsEmpty();
            goods.calSelectedTotalAmtNum();
        }, function() {
          //取消操作
          $('.weui-cell_swiped').swipeout('close')
        });
  	})
}
//选中商品--汇总计算
goods.calSelectedTotalAmtNum = function() {
	var totalAmt = 0;
	var totalNum = 0;
	for (var i = 0; i < goodsInfoSelected.length; i++) {
		var tmpamt = absoluteMul(goodsInfoSelected[i].itemPrice,goodsInfoSelected[i].itemNumber)
		totalAmt = absoluteAdd(tmpamt,totalAmt)
		totalNum = absoluteAdd(goodsInfoSelected[i].itemNumber,totalNum)
	}
	// var $parentEl = $('#goods-wrap .weui-cell_swiped');
	// $parentEl.each(function(index,element){
	//     var amt = parseFloat($(element).find('.goods-price-val').attr('data-val'));
	//     var num = parseFloat($(element).find('.goods-num').val());
	//     var goodsTotalPrice = absoluteMul(amt,num)
	//     totalAmt = absoluteAdd(goodsTotalPrice,totalAmt)
	//     totalNum = absoluteAdd(num,totalNum)
	// });
	$('.total-amt').attr('data-val',totalAmt);
	$('.total-amt').text(absoluteDiv(totalAmt,100).toFixed(2))
	$('.total-num').text(totalNum)
}
//检查选中商品列表是否为空
goods.checkGoodsListIsEmpty = function() {
	var $parentEl = $('#goods-wrap .weui-cell_swiped');
	if($parentEl.length === 0) {
		goods.emptyData()
	}
}
goods.createLuckyBag = function(name) {
	var ajaxFlag = true;
	var fdName = name;
	var reqData = {
        "fdName":fdName,
        "fudaiItemInfos":[]
	};
	for (var i = 0; i < goodsInfoSelected.length; i++) {
		reqData.fudaiItemInfos[i] = {
			"fdItemId":goodsInfoSelected[i].itemId,
			"fdItemNumber":goodsInfoSelected[i].itemNumber
		}
	}
	reqData = JSON.stringify(reqData)
	$.ajax({
        type: "POST",
        url: "http://xiaozhuo.info/AIinfo/fudai/add",
        contentType:'application/json;charset=utf-8',
        data: reqData,
        dataType: "json",
        success: function(data){
        	var resData = data;
        	if(resData.status === 0){
        		window.location.href = "http://xiaozhuo.info/dmall.html#tab2"
        	}else if(resData.status === 2) {
        		//未登录
        		window.location.href = "http://xiaozhuo.info/login.html"
        	}else {
        		$.toptip('系统异常', 'error');
        	}
        }
	});
}
//创建福袋名称
goods.addLuckyBagName = function() {
	$.prompt({
      text: " ",
      title: "请输入福袋名称:",
      empty: false, // 是否允许为空
      onOK: function(text) {
        console.log("onOK",text);
        goods.createLuckyBag(text)
      },
      onCancel: function() {
        console.log("取消了");
      }
    });
}
$(function () {
	goods.getGoodsList()
  	//预览福袋
  	$('#to-preview-btn').click(function(e){
  		//判断是否选择商品
  		if(!goods.checkSelected()) return false;
		goods.emptyData()
		$("#full-selected-goods").popup();
		goods.fillSelectedData()
	})
	//创建福袋
	$('.save-popup').click(function(){
		if(goodsInfoSelected.length == 0) return false;
		goods.addLuckyBagName()
	})
})