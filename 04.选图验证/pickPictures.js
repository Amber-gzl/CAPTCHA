// dom元素
var imgBox = $(".imgBox");
var refresh = $(".refresh");
var verifyBotton = $(".verifyBotton");
var canvas = document.getElementById("verCanvas");
// 创建画布
var ctx = canvas.getContext("2d");
var canvasW = 302;
canvas.width = canvasW;
var canvasH = 184;
canvas.height = canvasH;
// 正确验证数组
var corArr = []; 
var verArr = [];

// 定义图片数据
// 图片命名从0开始
// 图片为jpg格式
// 要求图片数据至少包括3种类型，每种类型图片至少4张
// 这里用对象数组存储备选图片
// {imgTypeId图片类型的唯一id，imgTypeName图片类型名，imgNum此类图片的总数}
var imgs = [
    {"imgTypeId" : 0, "imgTypeName" : "电线", "imgNum" : 8},
    {"imgTypeId" : 1, "imgTypeName" : "茶叶", "imgNum" : 8},
    {"imgTypeId" : 2, "imgTypeName" : "兔子", "imgNum" : 8},
    {"imgTypeId" : 3, "imgTypeName" : "猫", "imgNum" : 9},
    {"imgTypeId" : 4, "imgTypeName" : "狗", "imgNum" : 8},
    {"imgTypeId" : 5, "imgTypeName" : "苹果", "imgNum" : 8},
    {"imgTypeId" : 6, "imgTypeName" : "电线杆", "imgNum" : 7}
];
$(function() {
    // 初始加载
    refreshImg();
    // 为refresh按钮添加click事件
    refresh.on("click", function(){
        refreshImg();
        start();
    });
    // 开始判断逻辑
    start();
})

// 刷新图片
// 返回需要正确点击数据数组
function refreshImg(){
    // 0、清除画布、corArr、verArr和marker
    clear();
    // 1、选3种不同类型共8张备选图
    // 备选图二维数组img，img[*][0]记录imgTypeId
    var img = getImg();
    
    // 2、随机选择正确图片的类型，随机生成八张备选图顺序，并记录正确图片的顺序到corArr中
    // 2.1 随机选择正确图片的类型
    var corId = img[Math.floor(3*Math.random())][0];
    // 2.2 随机生成八张备选图顺序 imgRSort[[图片类型id，图片名称id]]
    var imgRSort = imgRandomSort(img);
    // 2.3 记录正确图片的顺序到corArr中 
    for(let i = 0; i<imgRSort.length; i++){
        if(imgRSort[i][0] == corId){
            corArr.push(i);
        }
    }
    // 3、生成验证图
    // 3.1 画提示语
    drawHint(imgs[corId].imgTypeName);
    // 3.2 画分割线
    drawLine();
    // 3.3 画备选图
    drawImage(imgRSort);    
}

var start = function(){
    // 1、为canvas添加click事件
    //  $(document).on()新添加的元素也会执行回调函数？？？？不是特别懂
    $(document).on("click", "#verCanvas", function(event){
        // pageX,Y分别是当前点击事件发生位置到屏幕边界的距离
        // convertPoint（elem，x，y）元素计算x y相对于elem边界的距离
        console.log(event.pageX, event.pageY);
        var point = convertPoint($(this), event.pageX, event.pageY)
        // console.log(point);
        verArr.push(point);
        console.log(verArr);
        // 在点击处创建标记图标
        createMarker(point.x, point.y);
    });
    // 2、为verifyBotton添加click事件
    verifyBotton.on("click", function(){
        if(corArr.length == verArr.length){
            // 把坐标转换成图顺序
            var vArr = convertCoor(verArr);
            // 将vArr升序排列
            vArr.sort( (a,b) => {return a-b});
            console.log("我的回答：", vArr);
            console.log("正确答案：", corArr);
            // 对比vArr与corArr是否一致
            if(vArr.toString() == corArr.toString()){
                // 验证成功
                verSucc();
            } else {
                // 验证失败
                verFail();
            }

        } else {
            console.log("我的回答：", vArr);
            console.log("正确答案：", corArr);
            // 验证失败
            verFail();
        }
    });
}

// 清除画布、corArr、verArr和marker
var clear = function(){
    // console.log("正确答案：",corArr);
    // console.log("我的回答：",verArr);
    ctx.clearRect(0,0,canvasW,canvasH);
    corArr = [];
    verArr = [];
    var marker = $(".marker")
    console.log("marker is",marker);
    marker.remove();
    verifyBotton.removeClass("success");
    verifyBotton.removeClass("fail");
    // 显示在提示条上
    verifyBotton.text("验证");

};

// 从图片数据中获取8张备选图
var getImg = function(){
    //备选图数组，img[*][0]记录imgTypeId
    var img = [[],[],[]]
    //1 从图片数据中抽取3种不同类型
    var helper= [];
    for(let i = 0; i<3; i++){
        img[i][0]= Math.floor(imgs.length*Math.random());
        while(helper.includes(img[i][0])){
            img[i][0] = Math.floor(imgs.length*Math.random());
        }
        helper.push(img[i][0]);
    }
    // 2 选择组合方式
    // 此处分为1+3+4、2+2+4、2+3+3组成
    // 分别由n=0/1/2表示
    var n = Math.floor(3*Math.random());
    //3按照组合方式随机选择类型内图片
    switch(n){
        // 1+3+4
        case 0:
            // 图片类型0取1张
            // chooseImg(备选图数组，类型标号，选取张数)
            chooseImg(img,0,1);
            // 图片类型1取3张
            chooseImg(img,1,3);
            // 图片类型2取4张
            chooseImg(img,2,4);
        break;
        case 1:
            // 图片类型0取2张
            chooseImg(img,0,2);
            // 图片类型1取2张
            chooseImg(img,1,2);
            // 图片类型2取4张
            chooseImg(img,2,4);
        break;
        case 2:
            // 图片类型0取2张
            chooseImg(img,0,2);
            // 图片类型1取3张
            chooseImg(img,1,2);
            // 图片类型2取3张
            chooseImg(img,2,4);
        break;
        default:
            try {
                throw new Error('不合法类型');
              } catch (e) {
                console.log(e.name + ': ' + e.message);
              }
    }
    return img;
};

// chooseImg(备选图数组，类型标号，选取张数)
var chooseImg = function(img, type, pNum){
    let helper = [];
    let len = imgs[img[type][0]].imgNum;
    for(let i=1; i<=pNum; i++){
        img[type][i]= Math.floor(len*Math.random());
        while(helper.includes(img[type][i])){
            img[type][i] = Math.floor(len*Math.random());
        }
        helper.push(img[type][i]);
    }
};

// 随机生成八张备选图顺序 返回imgRSort[[图片类型id，图片名称id]...]
var imgRandomSort = function(img){
    // 将备选图数组的图提取出来表示[imgTypeId:img[*][0],img[*][/0]]
    var imgRSort = [];
    for(let i = 0; i<img.length; i++){
        for(let j = 1; j<img[i].length; j++){
            imgRSort.push([img[i][0],img[i][j]]);
        }
    }
    // 打乱提取后的数组
    imgRSort.sort(function(){ return 0.5 - Math.random() });
    return imgRSort;
};

// 画验证图的提示语部分
var drawHint = function(hint){
    var pre = "请点击下图中", middle = "所有的";
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(pre,15,26);
    ctx.fillStyle = "#f00";
    ctx.fillText(middle,textWidth(pre,16)+rand(15,18),26);
    ctx.fillStyle = randColor();
    ctx.font = "20px Arial";
    ctx.fillText(hint,textWidth(pre+middle,16)+rand(17,20),26);

};

// 设置绘制文字大小（文字内容，像素）
var textWidth = function(string,size){
    ctx.font = size + "px Arial";
    return ctx.measureText(string).width;
}

// 于范围[min，max）中任选一值
var rand = function(min,max){
    return Math.random() * (max - min) + min;
}

// 随机生成颜色
var randColor = function(){
    return "rgb(" + ((Math.random() * 255)>>0) + "," + ((Math.random() * 255)>>0) + "," +((Math.random() * 255)>>0) +")";
};

// 画分割线
var drawLine = function(){
    ctx.beginPath();
    ctx.lineWidth="0.5";
    ctx.strokeStyle="gray"; // Green path
    ctx.moveTo(15,32);
    ctx.lineTo(canvasW-15,32);
    ctx.stroke();

};

// 画备选图
var drawImage = function(imgRSort){
    for(let i = 0; i<8; i++){
        // console.log("我是",i,"我啥也不干");        
        let x = 15+(i%4)*69; 
        let y = 40;
        if(i>3){
            y = 109;
        }
        // console.log(x,y);
        let imgPath = `./imgs/${imgRSort[i][0]}${imgs[imgRSort[i][0]].imgTypeName}/${imgRSort[i][1]}.jpg`;
        let imgElement=new Image();
        imgElement.onload = function() {
            // console.log(img.complete);
            console.log(x,y);
            // console.log(imgElement)
            ctx.drawImage(imgElement,x,y,65,65);
        } 
        imgElement.src = imgPath;
        
    }
};

// convertPoint（elem，x，y）元素计算x y相对于elem边界的距离
var convertPoint = function(elem, x, y){
    // jq的offset返回当前元素到屏幕边界的距离，单位是px{top:*,left:*}
    var offset = elem.offset();
    // console.log(elem,offset);
    return{
        x : x - offset.left,
        y : y - offset.top
     }
};

// 在点击处创建标记图标
var createMarker = function(x, y){
    // 以当前的时间作为uid标记
    var uid = new Date().getTime();
    imgBox.prepend(`<img class='marker marker${uid}' src='./icon/1184821.png'/>`)//在imgBox内部开头添加图片
    $(`.marker${uid}`).css({"top":`${y-20}px`, "left":`${x-10}px`});
};

// 将verArr[{x,y}]转换成对应的图片顺序号vArr[]并返回
var convertCoor = function(verArr){
    var vArr = [];
    for(let i = 0; i<verArr.length; i++){
        let seqX = Math.floor((verArr[i].x-15)/69);
        let seqY = 4*Math.floor((verArr[i].y-40)/69);
        // x正确取值为0 1 2 3，y正确取值为0 4
        if(seqX>=0 && seqX<=3 && seqY>=0 && seqY<=4){
            vArr.push(seqX+seqY);
        } else {
            // 错误取值用-1表示
            vArr.push(-1);
        }
    }
    return vArr;

};

// 验证成功之后的操作
var verSucc = function(){
    $('.verifyBotton').addClass("success");
    $('.verifyBotton').text('验证成功');
    $(document).off("click");
    verifyBotton.off("click");
};

// 验证失败之后的操作
var verFail = function(){
    $('.verifyBotton').addClass("fail");
    $('.verifyBotton').text('验证失败');
    console.log("验证失败");
    $(document).off("click");
    verifyBotton.off("click");
};
