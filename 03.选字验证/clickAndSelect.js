
var imgN = 15//图片总数
var textN = 4//备选文字总数
var textToBeSelected = $("#textToBeSelected")
var box = $('.box'),
imgBox = $('.imgBox'),
refresh = $('.refresh');

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

// 生成选字图
function refreshImg(){
    // 1、设置背景图片
    // 随机选取index(1-imgN)图片
    var index = Math.ceil(Math.random() * imgN);
    // 初始图片高度为0
    var imgH = 0;
    // 更改/添加图片
    var verImg = $('.verImg')
    if(verImg.length) {
        verImg.attr('src',`./imgs/${index}.jpg`)//更改图片
    } else {
        imgBox.prepend(`<img class='verImg' src="./imgs/${index}.jpg" />`)//在imgBox内部开头添加图片
    }
    // 2、设置图片上方文字
    // 2.1 生成备选文字
    var alterText = [];
    textToBeSelected.text('')
    for(let i = 0; i<textN; i++){
        var a = getRandomChineseWord();
        // 防止重复
        if(alterText.includes(a)){
            i--
        }else{
            alterText.push(getRandomChineseWord());
        }
    }
    // console.log(alterText)
    // 2.2 添加文字到图片上
    // 删除上一次生成的文字
    var text = $('.text');
    if(text.length){
        text.remove();
    }
    
    // 添加文字
    // 选择备选文字前3个为需被选择文字
    var text0 = $("<div></div>").text(`${alterText[0]}`);
    text0.addClass("text t0");
    var text1 = $("<div></div>").text(`${alterText[1]}`);
    text1.addClass("text t1");
    var text2 = $("<div></div>").text(`${alterText[2]}`);
    text2.addClass("text t2");
    var text3 = $("<div></div>").text(`${alterText[3]}`);
    text3.addClass("text t3");
    imgBox.append(text0, text1, text2, text3);
    // 文字位置旋转随机
    // 记录text的位置
    var tPosition = [];
    for(let i = 0; i<4; i++){
        var t = $(`.t${i}`);
        // console.log(t);
        var tX = 35 + 198*Math.random();//字出现X范围35~233(300-25-32)
        var tY = 35 + 98*Math.random();//字出现Y范围50~133
        // 使文字不重叠
        var position = [tX, tY];
        var inside = false ;
        for(let j = i-1; j>=0; j--){
            inside = inside||isInside(position, tPosition[j]);//isInside(a,b)判断a字是否在b字范围内
            console.log(i,j,inside);
            // 如果在则重新生成position，并重新判断
            if(inside){
                // 重新生成position
                tX = 50 + 165*Math.random();
                tY = 50 + 65*Math.random();
                position = [tX, tY];
                inside = false;
                j = i;//重新判断
            }
        }
        tPosition.push(position);
        // console.log(tPosition);
        var tSize = 18 + 12*Math.random();//字体大小18~30px
        var tDeg = 150*Math.random() - 75;//字体角度-75~75度
        t.css({
            "left":`${tX}px`, 
            "top":`${tY}px`,
            "font-size":`${tSize}px`, 
            "transform":`rotate(${tDeg}deg)`
        });
    }
    console.log(tPosition)
    // 显示在提示条上
    for(let i = 0; i<3; i++){
        textToBeSelected.append(`"${alterText[i]}"`);
    }

}
// 随机生成汉字
function getRandomChineseWord() {
    var _rsl = "";
    var _randomUnicode = Math.floor(Math.random()*(40870-19968) + 19968).toString(16);
    eval("_rsl=" + '"\\u' + _randomUnicode + '"');
    return _rsl;
}
// 判断a字是否在b字范围内
function isInside(a, b){
    var f = false;
    var x = Math.abs(a[0]-b[0]);
    var y = Math.abs(a[1]-b[1]);
    if(x < 25 && y < 25){
        f = true;
    }
    return f;
}
function start() {
    var t0 = $('.t0');
    var t1 = $('.t1');
    var t2 = $('.t2');
    // 验证数组
    // ver[0]记录点击次数
    // ver[1]ver[2]ver[3]分别记录t0t1t3的验证结果
    var ver = [0, false, false, false];

    imgBox.unbind('click');
    t0.unbind('click');
    t1.unbind('click');
    t2.unbind('click');
    imgBox.bind('click',{ver},imgClick);
    t0.bind('click',{ver}, t0Click);
    t1.bind('click',{ver}, t1Click);
    t2.bind('click',{ver}, t2Click);
}
// 图片点击事件
// 每点一次出现一个icon提示点击位置
// 只允许点3次
var imgClick = function(events){
    var v = events.data.ver;
    console.log(`第${v[0]}次点击img`);
    v[0]++;
    if(v[0]>=3){
        imgBox.unbind('click');
        judg(v);
    }
};
// t0点击事件
// 如果在第1次点击则将对于标志ver[1]变为true
var t0Click = function(events){
    var v = events.data.ver;
    console.log(`在第${v[0]}次点击时点击了t0`);
    if(v[0]==0){
        v[1] = true;
    }
    if(v[0]>=3){
        imgBox.unbind('click');
    }
};
// t0点击事件
// 如果在第0次点击则将对于标志ver[1]变为true
var t0Click = function(events){
    var v = events.data.ver;
    console.log(`在第${v[0]}次点击时点击了t0`);
    if(v[0]==0){
        v[1] = true;
    }
};
// t1点击事件
// 如果在第1次点击则将对于标志ver[2]变为true
var t1Click = function(events){
    var v = events.data.ver;
    console.log(`在第${v[0]}次点击时点击了t1`);
    if(v[0]==1){
        v[2] = true;
    }
};
// t2点击事件
// 如果在第2次点击则将对于标志ver[3]变为true
var t2Click = function(events){
    var v = events.data.ver;
    console.log(`在第${v[0]}次点击时点击了t2`);
    if(v[0]==2){
        v[3] = true;
    }
};
function judg(ver) {
    if(ver[1]&&ver[2]&&ver[3]){
        console.log(ver,'验证成功')
    } else {
        console.log(ver,'验证失败')
    }
}