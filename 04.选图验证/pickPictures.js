// dom元素
var imgBox = $(".imgBox");
var refresh = $(".refresh");
var verifyBotton = $(".verifyBotton");
var canvas = document.getElementById("verCanvas");
// 创建画布
var ctx = canvas.getContext("2d");
var canvasW = 300;
var canvasH = 190;
// 正确验证数组
var corArr = []; 
var verArr = [];

// 定义图片数据
// 图片命名从0开始
// 图片大小为：60*60px jpg格式
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
        // reset();
    })
    // 为canvas添加click事件
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

})

// 刷新图片
// 返回需要正确点击数据数组
function refreshImg(){
    // 0、清除画布
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

// 清除画布、corArr、verArr和marker
var clear = function(){
    console.log(corArr);
    console.log(verArr);
    ctx.clearRect(0,0,canvasW,canvasH);
    corArr = [];
    verArr = [];
    $(".marker").remove();

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
    ctx.fillText(pre,15,21);
    ctx.fillStyle = "#f00";
    ctx.fillText(middle,textWidth(pre,16)+rand(15,18),21);
    ctx.fillStyle = randColor();
    ctx.font = "20px Arial";
    ctx.fillText(hint,textWidth(pre+middle,16)+rand(17,20),21);

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
    ctx.moveTo(15,30);
    ctx.lineTo(canvasW-15,30);
    ctx.stroke();

};

// 画备选图
var drawImage = function(imgRSort){
    for(let i = 0; i<8; i++){
        // 生成图片对象
        var imgElement = new Image();
        // 生成并设置地址
        var imgPath = `./imgs/${imgRSort[i][0]}${imgs[imgRSort[i][0]].imgTypeName}/${imgRSort[i][1]}.jpg`;
        imgElement.src = `${imgPath}` 
        // $(".imgBox").append(imgElement);
        // 计算图片坐标
        var x = 45;
        if(i>3){
            x = 115;
        }
        y = 15+(i%4)*70;
        console.log(imgElement)
        // console.log(x,y)
        // 绘制图片至画布
        imgElement.onload = function()
        {
            // console.log("imgElement loaded")
            // console.log(this)
            ctx.drawImage(imgElement,x,y,60,60);
            // console.log("图片绘制完毕")
        }
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
