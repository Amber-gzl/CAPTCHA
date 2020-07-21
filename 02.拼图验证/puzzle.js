// 获取元素
var imgN = 15//背景图片总数量
var box = $('.box'),
imgBox = $('.imgBox'),
handle = $('.handle'),
swipper = $('.swipper'),
text = $('.text'),
verify = $('.verify'),
verified = $('.verified'),
refresh = $('.refresh');

// DOM加载完成后调用执行的回调函数，只执行一次
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

// 随机添加背景图
function refreshImg() {
    // 随机选取index(1-imgN)图片
    var index = Math.ceil(Math.random() * imgN);
    // 初始图片高度为0
    var imgH = 0;

    // 图片上滑块隐藏
    verify.hide()
    verified.hide()

    // 更改/添加图片
    var verImg = $('.verImg')
    if(verImg.length) {
        verImg.attr('src',`imgs/${index}.jpg`)//更改图片
    } else {
        imgBox.prepend(`<img class='verImg' src="imgs/${index}.jpg" />`)//在imgBox内部开头添加图片
    }
    verify.css('background-image', `url('imgs/${index}.jpg')`)//将图片作为滑块verify的背景图片
}


function start() {
    // 获取verImage元素
    var verImg = document.getElementsByClassName('verImg')[0]

    if(verImg) {
        verImg.onload = function() {
            // 获取图片高度
            var imgH = this.clientHeight

            // 图片宽度固定300px，高度不定
            // 在verX范围[112,232),verY范围[imgH/4,3imgH/4)内随机生成目标verified位置
            var verX = 300 * (0.5 + 0.4*Math.random()) -38,
            verY = imgH / 4 + Math.random() * imgH / 2;
            
            // 移动滑块
            fnDown(verX, verY);
        }
    }
}

function fnDown(verX, verY) {
    // 滑动条滑块鼠标按下事件
    swipper.mousedown(function() {
        e = event || window.event;
        e.stopPropagation();

        verify.css({
            display: 'block',
            //设置滑块位置,初始位于最左，同高度
            top: `${verY}px`,
            //显示目标位置的局部图片
            'background-position':`-${verX}px -${verY}px`
        })
        verified.css({ 
            display: 'block', 
            // 设置目标位置
            left:`${verX}px`,
            top:`${verY}px`
        })

        // 鼠标按下时相对于滑动条的距离
        var disX = e.clientX - $(this).offset().left,
        disY = e.clientY - $(this).offset().top;
        // 隐藏提示文字
        text.css('opacity','0')
        
        // 防止重复绑定触发多次
        box.unbind('mousemove');
        box.unbind('mouseup');

        // 将mousemove事件绑定到box上
        box.bind('mousemove', function() {
            e = event || window.event;
            // 移动滑动条滑块与图片滑块
            fnMove(e, disX, disY)
        })

        // mouseup意味着滑动结束，将mouseup事件绑定到box上
        box.bind('mouseup', function() {
            // 记录滑动停下位置
            console.log(verify)
            console.log(verify.offset())
            var stopL = verify.offset().left - 28;
            // 误差2px内验证成功
            console.log(stopL, verX, stopL- verX)
            if(Math.abs(stopL - verX) > 2) {
                alert('验证失败')
            } else {
                alert('验证成功')
            }

            // 解除绑定防抖，并将滑块归位
            box.unbind('mousemove')
            swipper.css('left', '0px')
            verify.css('left', '10px')
            text.css('opacity','1')
            box.unbind('mouseup')
        })
    })
}

// 移动滑动条滑块与图片滑块
function fnMove(e, posX, posY) {
    var l = e.clientX - posX - $(handle).offset().left,
    winW = $(handle).width() - 46;

    // 限制滑动条滑块在滑动条内
    if (l < 0){
        l = 0;
    } else if (l > winW){
        l = winW;
    }

    // 移动----->>>>--->>>-->>->
    swipper.css('left',`${l}px`)
    verify.css('left',`${l + 10}px`)
}

