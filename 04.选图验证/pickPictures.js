
$(function() {
    // 随机选择添加图
    refreshImg()
    
    // 为refresh按钮添加click回调函数
    refresh.click(function() {
        e = event || window.event;
        e.stopPropagation();//阻止事件冒泡

        refreshImg();
        start();
    })
    
    // 为refresh按钮添加mousedown回调函数
    refresh.mousedown(function() {
        // 为refresh添加class = 'click'
        $(this).addClass('click')
    })
    refresh.mouseup(function() {
        // 移除refresh的class = 'click'
        $(this).removeClass('click')
    })

    window.onload = start()
})

function refreshImg(){
     // 定义图片数据
     var imgs = [
        {
            imgTypeId:0,
            imgTypeName:"电线",
            imgNum:5
        },
        {
            imgTypeId:1,
            imgTypeName:"茶叶",
            imgNum:5
        }
    ]
    // 生成图片
    // 1、选图
    // 从索引数组中抽取图片（8张）形成一个图片数组
    // 这里用对象数组存储备选图片
    // {imgTypeId图片类型的唯一id，imgTypeName图片类型名，imgNum此类图片的总数}
   
    // 打乱数组的顺序
    // 2、画图
    // 然后将图片依次画到大图上面去，用canvas
    // 在画小图的过程中，根据显示的偏移量生成验证数组
    
}
// 将点选图片不同位置时生成的点击坐标和验证数组进行比对。
// 只在点选的坐标数等于验证数组的长度才进行比对（如果长度不一样，那输入肯定是错的）。
function start(){

}