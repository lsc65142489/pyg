$(function () {
    /*  1 实现了静态布局
      2 首页动态渲染数据
        1 左侧菜单是全部渲染 
        2 右侧的内容 是 根据左侧 被选中的菜单 才开始 渲染 
        3 写两个方法  (页面用到的数据 只要发送一次请求去获取 就可以提供给下次下次 使用 )
          渲染左边（）
          渲染右边（）
      3 点击左侧菜单
        1 左侧菜单被 激活选中
        2 右侧的内容 动态跟着渲染
          1 先获取 被点击的li标签的索引
    */

    // 定义一个全局变量 存放 接口返回的数据 result.data,也可以使用传参的形式来做，不过比较麻烦
    let CateDatas;

    // 定义一个一开始就执行的函数
    init();
    function init() { 

        categories();
        eventList();
     };
    
    // 创建一个负责绑定页面当中的一坨事件
    function eventList(params) { 
        // 1左侧菜单的点击事件，因为是动态生成的，所以使用事件委派
        // 有一个移动端的单击事件，tap
        // 这里有个bug那就是不支持es6的箭头函数语法
        $(".left_menu ").on("tap","li",function(){
            // 当前点击的按钮显示高亮，排他
            $(this).addClass("active").siblings().removeClass("active");

            // 获取被点击到的li标签的索引 方法 $(this).index();
            let index=$(this).index();
            // 调用渲染数据右边数据的方法
            // console.log($(this))
            renderRight(index);
        })
     }



    // 1.发请求获取数据
    function categories() { 
        $.get("http://api.pyg.ak48.xyz/api/public/v1/categories",(result)=>{
            if(result.meta.status==200){
                // console.log(result)
                // 获取要渲染的数据
                CateDatas=result.data;
                // 调用渲染左边的方法
                renderLeft();
                // 调用渲染右边的方法
                renderRight(0);
            }else{
                console.log("失败", result);
            }
        })


     };

    // 2 定义一个渲染左边的事件 
    function renderLeft() {
        // 要拼接的左侧的html
        let leftHtml="";
        for(let i=0;i<CateDatas.length;i++){
            let tmpHtml=`
            <li class="${i==0?"active":""}">
            ${CateDatas[i].cat_name}</li>
            `;
            leftHtml +=tmpHtml;
        };
        // 把数据插入到左侧容器中
        $(".left_menu").html(leftHtml);
      };
    
    // 3.渲染右边
    function renderRight(index) {
        // 获取大家电的数据,因为CateDatas是数组，所以要加索引
        let item2Obj=CateDatas[index];
        // 获取右侧内容，需要循环的数据
        let rightData=item2Obj.children;
        // 渲染数据
        let rightHtml=template("rightTp1",{arr:rightData});
        $('.right_box').html(rightHtml);
      }
})