"use strict";

$(function () {
  // 定义一个初始化函数
  function init() {
    swiperData();
    catitems(); // 调用商品列表部分

    goodslist();
  }

  ;
  init(); // 自动化获取图片

  function swiperData() {
    $.ajax({
      type: "get",
      url: "http://api.pyg.ak48.xyz/api/public/v1/home/swiperdata",
      dataType: "json",
      success: function success(result) {
        if (result.meta.status == 200) {
          var html = template("pyg_slide", {
            arr: result.data
          });
          $('.pyg_slide').html(html); // 在这里引入初始化插件对象，不然的话，插件获取不到数据
          //获得slider插件对象

          var gallery = mui('.mui-slider');
          gallery.slider({
            interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；

          });
        } else {
          console.log("请求失败", result);
        }
      }
    });
  } // 获取分类菜单数据


  function catitems() {
    // $get(接口的路径，发送到后台去的参数，|可以不传，成功的回调函数)
    $.get("http://api.pyg.ak48.xyz/api/public/v1/home/catitems", function (result) {
      if (result.meta.status == 200) {
        // 请求成功
        // console.log(result)
        //获取要渲染的数据，数组
        var data = result.data; // 定义一个要拼接的字符串

        var html = ""; // 循环遍历数据

        for (var i = 0; i < data.length; i++) {
          var tmpHtml = "<a href=\"javascript:;\">\n                    <img src=\"".concat(data[i].image_src, "\"\n                        alt=\"\">\n                </a>");
          html += tmpHtml;
        }

        ; // 把分类的标签插入到容器中

        $(".pyg_cates").html(html);
      } else {
        console.log("请求失败", result);
      }
    });
  } // 商品列表部分


  function goodslist() {
    // 发送请求
    $.get("http://api.pyg.ak48.xyz/api/public/v1/home/goodslist", function (result) {
      if (result.meta.status == 200) {
        // console.log(result)
        // 获取要渲染的数据
        var data = result.data; // 生成要渲染的数据， 这里的data是数组，要转成对象

        var html = template("pyg_goodslist", {
          arr: data
        });
        $(".pyg_goodslist").html(html);
      }
    });
  }
});
//# sourceMappingURL=index.js.map
