"use strict";

$(function () {
  // 定义一个初始化函数
  function init() {
    swiperData();
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
        }

        console.log(result);
      }
    });
  } // 获取分类菜单数据

});
//# sourceMappingURL=index.js.map
