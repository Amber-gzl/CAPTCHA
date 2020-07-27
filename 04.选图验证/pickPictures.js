// dom元素
var refresh = $(".refresh")
var verImg = $("#verImg")

// 定义图片数据
// 图片命名从0开始
// 图片大小为：60*60px
// 要求图片数据至少包括3种类型，每种类型图片至少4张
// 这里用对象数组存储备选图片
// {imgTypeId图片类型的唯一id，imgTypeName图片类型名，imgNum此类图片的总数}
var imgs = [
    {
        imgTypeId:0,
        imgTypeName:"电线",
        imgNum:8
    },
    {
        imgTypeId:1,
        imgTypeName:"茶叶",
        imgNum:8
    },
    {
        imgTypeId:2,
        imgTypeName:"兔子",
        imgNum:8
    },
    {
        imgTypeId:3,
        imgTypeName:"猫",
        imgNum:9
    },
    {
        imgTypeId:4,
        imgTypeName:"狗",
        imgNum:8
    },
    {
        imgTypeId:5,
        imgTypeName:"臻善科技",
        imgNum:8
    },
    {
        imgTypeId:6,
        imgTypeName:"电线杆",
        imgNum:7
    }
];

$(function() {
    // 随机选择添加图
    let corArr = refreshImg();
    
    // 为refresh按钮添加click回调函数
    refresh.click(function() {
        e = event || window.event;
        e.stopPropagation();//阻止事件冒泡

        let corArr = refreshImg();
        start(corArr);
    })
    
    // 为refresh按钮添加mousedown回调函数
    refresh.mousedown(function() {
        // 为refresh添加class = 'click'
        $(this).addClass('click');
    })
    refresh.mouseup(function() {
        // 移除refresh的class = 'click'
        $(this).removeClass('click');
    })

    window.onload = start(corArr);
})

// 刷新图片
// 返回需要正确点击数据数组
function refreshImg(){
    // 1、选8张备选图
    //备选图数组，img[*][0]记录imgTypeId
    var img = [[],[],[]]
    // 1.1 从图片数据中抽取3种不同类型
    var helper= [];
    for(let i = 0; i<3; i++){
        img[i][0]= Math.floor(imgs.length*Math.random());
        while(helper.includes(img[i][0])){
            img[i][0] = Math.floor(imgs.length*Math.random());
        }
        helper.push(img[i][0]);
    }
    // 1.2 选择组合方式
    // 此处分为1+3+4、2+2+4、2+3+3组成
    // 分别由n=0/1/2表示
    var n = Math.floor(3*Math.random());
    // 1.3按照组合方式随机选择类型内图片
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
    // 2、随机选择正确图片的类型，随机生成八张备选图顺序，并记录正确图片的顺序到corArr中
    // 2.1 随机选择正确图片的类型
    var corId = img[Math.floor(3*Math.random())][0];
    // 2.2 随机生成八张备选图顺序
    // 将备选图数组的图提取出来表示[imgTypeId:img[*][0],img[*][/0]]
    var imgSort = [];
    for(let i = 0; i<img.length; i++){
        for(let j = 1; j<img[i].length; j++){
            imgSort.push([img[i][0],img[i][j]]);
        }
    }
    // 打乱提取后的数组
    imgSort.sort(function(){ return 0.5 - Math.random() })
    // 2.3 记录正确图片的顺序到corArr中
    var corArr = [];
    for(let i = 0; i<imgSort.length; i++){
        if(imgSort[i][0] == corId){
            corArr.push(i);
        }
    }
    // 3、按照图片顺序提取图片并画图
    // 然后将图片依次画到大图上面去，用canvas
    // 在画小图的过程中，根据显示的偏移量生成验证数组

    return corArr;
    
}

// chooseImg(选出图数组，类型标号，选取张数)
var chooseImg = function(img, type, pNum){
    let helper = [];
    let len = imgs[img[type][0]].imgNum;
    for(let i=1; i<=pNum; i++){
        img[type][i]= Math.floor(len*Math.random());
        while(helper.includes(img[type][i])){
            img[type][i] = Math.floor(len.random());
        }
        helper.push(img[type][i]);
    }
};

// 将点选图片不同位置时生成的点击坐标和验证数组进行比对。
// 只在点选的坐标数等于验证数组的长度才进行比对（如果长度不一样，那输入肯定是错的）。
function start(corArr){

}