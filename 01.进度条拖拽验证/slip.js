// 获取DOM元素
var $ = function(selector){
    return document.body.querySelector(selector);
},
box = $(".drag"),
bg = $(".bg"),
text = $(".text"),
btn = $(".btn"),
success = false,//是否通过验证
distance = box.offsetWidth - btn.offsetWidth;//滑动成功的宽度
console.log(box,btn);
console.log(distance);

// 为btn元素定义鼠标按下事件
btn.onmousedown = function(e){
    // 清除元素过渡属性
    btn.style.transition = "";
    bg.style.transition = "";
    e = e || window.event;
    var downX = e.clientX;// 鼠标按下时的水平位置
    document.onmousemove = function(e){
        e = e || windows.event;
        var moveX = e.clientX;//鼠标移动后的水平位置
        var offsetX = moveX - downX;//移动距离
        //移动位置控制在滑动条内
        if(offsetX > distance){
            offsetX = distance;
        }else if(offsetX < 0){
            offsetX = 0;
        }
        // 设置滑块位置
        btn.style.left = offsetX + "px";
        //设置滑动条背景颜色的宽度
        bg.style.width = offsetX + "px";

        // 判断是否滑动验证成功
        // 滑动验证成功
        if(offsetX == distance){
            text.innerHTML = "验证通过";
            text.style.color = "fff";
            btn.innerHTML = "&radic;";
            btn.style.color = "green";
            bg.style.backgroundColor = "lightgreen";
            success = true;
            // 清除鼠标按下事件和移动事件
            btn.onmousedown  = null;
            document.onmousemove = null;
            // 验证通过后调用回调函数
            setTimeout(function(){
                alert('解锁成功！');
            },100);
        }
    };

    // 为btn元素定义鼠标松开事件
    document.onmouseup = function(e){
        // 验证通过
        if(success) return;
        // 验证失败,则将滑块复位
        else{
            btn.style.left = 0;
            bg.style.width = 0;
            // 添加过渡效果
            btn.style.transition = "left 1s ease";
            bg.style.transition = "width 1s ease";
        }
        // 清除鼠标移动和松开事件
        document.onmousemove = null;
        document.onmouseup = null;
    };
};
