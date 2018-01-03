/*
 *主页js逻辑
 */
/****************** 我的福袋 ******************/
var luckybag = {};

//清空我的福袋
luckybag.emptyMyList = function() {
  $('.lucky-bag-list').empty();
  $('#no-lucky-bag').show()
}
//我的福袋---请求初始化数据
luckybag.initData = function (self) {
  var reqData = JSON.stringify({"isMy":"02"})
  $.ajax({
      type: "POST",
      url: "http://xiaozhuo.info/AIinfo/fudai/list",
      contentType:'application/json;charset=utf-8',
      data: reqData,
      dataType: "json",
      success: function(data){
        var resData = data;
        if(self) {
          $(self).pullToRefreshDone();
        }
        if(resData.status === 0){
          if(resData.data) {
            luckybag.fillMyList(resData.data)
          }
        }else if(resData.status === 2) {
          //未登录
          window.location.href = "http://xiaozhuo.info/login.html"
        }else {
          $.toptip('系统异常', 'error');
        }
      }
  });
}
//我的福袋---填充福袋数据
luckybag.fillMyList = function(data) {
  var data = data;
  if(data.length){
    $('#no-lucky-bag').hide()
  }
  var str = '';
  for (var i = 0; i < data.length; i++) {
    str += '<div class="weui-cell weui-cell_swiped">'
      str += '<div class="weui-cell__bd">'
        str += '<div class="weui-cell">'
         str += '<div class="weui-cell__hd lucky-bag-pic to-luckybag-detail" data-fdid="'+data[i].fdId+'"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="" ></div>'
          str += '<div class="weui-cell__bd" data-fdid="'+data[i].fdId+'">'
            str += '<p class="lucky-bag-name">'+data[i].fdName+'</p>'
          str += '</div>'
          str += '<div class="weui-cell__ft lucky-bag-price">'
            str += '<p class="original-price">&yen;'+absoluteDiv(data[i].fdAmount,100).toFixed(2)+'</p>'
            str += '<p class="actual-price">&yen;'+absoluteDiv(data[i].fdPrice,100).toFixed(2)+'</p>'
          str += '</div>'
        str += '</div>'
      str += '</div>'
      str += '<div class="weui-cell__ft">'
        str += '<a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout remove-bag-btn" href="javascript:;" data-fdid="'+data[i].fdId+'">删除</a>'
        str += '<a class="weui-swiped-btn weui-swiped-btn_default close-swipeout share-bag-btn" href="javascript:;" data-fdid="'+data[i].fdId+'">分享</a>'
      str += '</div>'
    str += '</div>';
  }
  
  $('.lucky-bag-list').html(str);
  luckybag.bindEvent()
}
//我的福袋---绑定事件
luckybag.bindEvent = function() {
  //滑动事件
  $('.weui-cell_swiped').swipeout()
  //删除福袋
  $('.remove-bag-btn').click(function(e) {
    var _this = $(this);
    $.confirm("您确定要删除此福袋？", " ", function() {
        var reqData = {
            "fdId":_this.attr('data-fdid'),
            "actionType":"99" 
        }
        reqData = JSON.stringify(reqData)
        $.ajax({
          type: "POST",
          url: "http://xiaozhuo.info/AIinfo/fudai/update",
          contentType:'application/json;charset=utf-8',
          data: reqData,
          dataType: "json",
          success: function(data){
            var resData = data;
            if(resData.status === 0){
              $.toptip('删除成功', 'success');
              _this.parents('.weui-cell_swiped').remove()
              //检查福袋列表是否为空
              luckybag.checkListIsEmpty();
            }else if(resData.status === 2) {
              //未登录
              window.location.href = "http://xiaozhuo.info/login.html"
            }else {
              $.toptip('删除失败', 'error');
            }
          }
        });
    }, function() {
      //取消操作
      $('.weui-cell_swiped').swipeout('close')
    });
  })
  //分享福袋
  $('.share-bag-btn').click(function(e) {
    var _this = $(this);
    var fdId = _this.attr('data-fdid');
    var reqData = {
          "fdId":fdId,
          "actionType":"02"
      }
      reqData = JSON.stringify(reqData)
      $.ajax({
        type: "POST",
        url: "http://xiaozhuo.info/AIinfo/fudai/update",
        contentType:'application/json;charset=utf-8',
        data: reqData,
        dataType: "json",
        success: function(data){
          var resData = data;
          if(resData.status === 0){
            window.location.href="http://xiaozhuo.info/page/luckyBagDetail.html?fdId="+fdId+'&skipFlag='+0;
          }else if(resData.status === 2) {
            //未登录
            window.location.href = "http://xiaozhuo.info/login.html"
          }else {
            $.toptip('删除失败', 'error');
          }
        }
      });
  })
  //进入福袋详情页
  $('.to-luckybag-detail').click(function(e) {
    var _this = $(this);
    var fdId = _this.attr('data-fdid');
    window.location.href="http://xiaozhuo.info/page/luckyBagDetail.html?fdId="+fdId+'&skipFlag='+0;
  })
}
//检查福袋列表是否为空
luckybag.checkListIsEmpty = function() {
  var $parentEl = $('.lucky-bag-list .weui-cell_swiped');
  if($parentEl.length === 0) {
    luckybag.emptyMyList()
  }
}





/****************** 购物车 ******************/
//购物车
var shopcar = {};
//清空购物车
shopcar.emptyData = function() {
	$('#shopcar-wrap').empty();
	$('.to-settle').hide();
	$('#no-data-list').show()
}
//购物车---请求初始化数据
shopcar.initData = function (argument) {
	shopcar.fillData()
}
//购物车---填充商品数据
shopcar.fillData = function() {
	$('#no-data-list').hide()
	$('.to-settle').show();
	var str = '';
	str = '<div class="weui-cell weui-cell_swiped">'
      str += '<div class="weui-cell__bd">'
        str += '<div class="weui-cell shopcar-cell">'
            str += '<div class="weui-cell__bd">'
              str += '<p>清风纸巾12包装</p>'
            str += '</div>'
            str += '<div class="weui-cell__ft">'
              str += '<span class="goods-price">￥<span class="goods-price-val" data-val="2400">24.00</span></span>'
              str += '<div class="weui-count">'
                str += '<a class="weui-count__btn weui-count__decrease"></a>'
                str += '<input class="weui-count__number goods-num" type="number" value="1" readonly="true"/>'
                str += '<a class="weui-count__btn weui-count__increase"></a>'
              str += '</div>'
            str += '</div>'
        str += '</div>'
      str += '</div>'
      str += '<div class="weui-cell__ft">'
        str += '<a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout remove-goods-item" href="javascript:">删除</a>'
      str += '</div>'
    str += '</div>';
    $('#shopcar-wrap').html(str);
    shopcar.calTotalAmtNum()
    shopcar.bindEvent()
}
//购物车---绑定事件
shopcar.bindEvent = function() {
	//滑动事件
	$('.weui-cell_swiped').swipeout()
  	
  	//计数器
  	var MAX = 999, MIN = 1;
  	$('.weui-count__decrease').click(function (e) {
    	var $input = $(e.currentTarget).parent().find('.weui-count__number');
    	var number = parseInt($input.val() || "0") - 1
    	if (number < MIN) number = MIN;
    	$input.val(number)
    	shopcar.calTotalAmtNum()
  	})
  	$('.weui-count__increase').click(function (e) {
    	var $input = $(e.currentTarget).parent().find('.weui-count__number');
    	var number = parseInt($input.val() || "0") + 1
    	if (number > MAX) number = MAX;
    	$input.val(number)
    	shopcar.calTotalAmtNum()
  	})
  	//删除商品
  	$('.remove-goods-item').click(function(e) {
  		var _this = $(this);
  		$.confirm("您确定要删除此商品？", " ", function() {
            $.toptip('删除成功', 'success');
            _this.parents('.weui-cell').remove()
            //检查购物车列表是否为空
            shopcar.checkGoodsListIsEmpty();
        }, function() {
          //取消操作
          $('.weui-cell_swiped').swipeout('close')
        });
  	})
  	//去结算
  	$('.to-settle-btn').click(function(e) {
  		shopcar.toSettle()
  	})
}
//购物车--汇总计算
shopcar.calTotalAmtNum = function() {
	var totalAmt = 0;
	var totalNum = 0;
	var $parentEl = $('#shopcar-wrap .weui-cell_swiped');
	$parentEl.each(function(index,element){
	    var amt = parseFloat($(element).find('.goods-price-val').attr('data-val'));
	    var num = parseFloat($(element).find('.goods-num').val());
	    var goodsTotalPrice = absoluteMul(amt,num)
	    totalAmt = absoluteAdd(goodsTotalPrice,totalAmt)
	    totalNum = absoluteAdd(num,totalNum)
	});
	$('.total-amt').attr('data-val',totalAmt);
	$('.total-amt').text(absoluteDiv(totalAmt,100).toFixed(2))
	$('.total-num').text(totalNum)
}
//检查购物车列表是否为空
shopcar.checkGoodsListIsEmpty = function() {
	var $parentEl = $('#shopcar-wrap .weui-cell_swiped');
	if($parentEl.length === 0) {
		shopcar.emptyData()
	}
}
//去结算
shopcar.toSettle = function() {
	console.log('去结算')
}

$(function() {

  $('#my-lucky-bag').click(function () {
    if($('#tab2').css('display') !== 'block') {
      //清空我的福袋
      luckybag.emptyMyList()
      //初始化我的福袋
      luckybag.initData()
    }
  })
  $('#tab2').pullToRefresh().on('pull-to-refresh', function (done) {
    console.log('done')
    var self = this;
    luckybag.initData(self)
    // setTimeout(function() {
      
    // }, 2000)
  })
	// 购物车
	$('#shopping-cart').click(function () {
  	if($('#tab3').css('display') !== 'block') {
  		//清空购物车
  		shopcar.emptyData()
  		//初始化购物车
  		shopcar.initData()
  	}
	})

	$('#tab3').pullToRefresh().on('pull-to-refresh', function (done) {
    console.log('done')
    var self = this
    setTimeout(function() {
      $(self).pullToRefreshDone();
    }, 2000)
  })

  //获取地址栏
  if(window.location.hash) {
    var hash = window.location.hash;
    if(hash === '#tab3') {
      $('#shopping-cart').trigger("click");
    }else if(hash === '#tab2') {
      $('#my-lucky-bag').trigger("click");
    }
  }
})

