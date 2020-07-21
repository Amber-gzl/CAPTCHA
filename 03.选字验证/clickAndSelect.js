
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
        verImg.attr('src',`../02.拼图验证/imgs/${index}.jpg`)//更改图片
    } else {
        imgBox.prepend(`<img class='verImg' src="../02.拼图验证/imgs/${index}.jpg" />`)//在imgBox内部开头添加图片
    }
    // 2、设置图片上方文字
    // 生成备选文字
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
    console.log(alterText)
    // 添加文字到图片上
    // 文字位置旋转随机

    // 选择备选文字前3个(可改)为需被选择文字
    // 显示在提示条上
    for(let i = 0; i<3; i++){
        textToBeSelected.append(`"${alterText[i]}"`);
    }

}
// 随机生成汉字，建议后端实现
function getRandomChineseWord() {
    var _rsl = "";
    var _randomUnicode = Math.floor(Math.random()*(40870-19968) + 19968).toString(16);
    eval("_rsl=" + '"\\u' + _randomUnicode + '"');
    return _rsl;
}
function start() {

    // 监听图片点击事件
    // 记录每次点击坐标
    // 三次点击后与文字对比坐标
    // 在规定范围内则验证通过
    // 提示条变绿
    // 不满足则验证失败
    // 提示条变红
    // 2秒后自动刷新

}
