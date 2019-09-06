var province = null;
var city = null;
var district = null;
var date;
//经纬度坐标（默认长春理工大学南校区）
var point = null;
var longitude = 125.3202;//默认经度
var latitude = 43.836687;//纬度

//小车经纬度
var tempLongitude;
var tempLatitude;

//当前页面
var page;
var data =[{
    text:'历史轨迹',
    iconCls:'icon-sum',
},{
    text:'车流量数据',
    iconCls:'icon-sum',
},{
    text:'路网流量',
    iconCls:'icon-sum',
},{
    text:'车流量检索',
    iconCls:'icon-sum',
}]

//用户权限判断
$(document).ready(function(){
    var url = window.location.href;
    var power = url.split("?")[1];
    if(power == 'power=1'){
        //设置管理者特权功能
        $('#menuSet').ready(function(){
            $('#menuSet').show();
        });
    }else{
        $('#menuSet').ready(function(){
            $('#menuSet').hide();
        });
    }
});

//center部分
$(document).ready(function(){
    // //更改默认视图
    // $('#commodityTb').datagrid({
    //     url:'/commodity',
    //     scrollbarSize:'1',
    //     pagination: true,
    //     pageSize: 5,
    //     pageList: [1,2,5],
    //     loadFilter:pagerFilter
    //     // view: cardview
    // });
    // //进入是刷新datagrid，抵消easyui自身bug
    // $("#commodityTb").datagrid({pageSize:1});

    //隐藏标志栏
    $('#label').hide();

    // 时间日期选择框
    $("#dt").datetimebox({
        showSeconds: true,
        required:true,
        onChange:function(data){
            date = $('#dt').datetimebox('getValue');
            // console.log(date);
        }
    });

    //地点选择框
    $('#cc1').combobox({
        url:'/getPro',
        valueField:'id',
        textField:'name',
        width:'100%',
        editable:false,
        onSelect:function(record){//加载城市下拉框
            // console.log(record);
            var proId = record.id;
            province = record.name;

            $('#cc2').combobox({
                url:'/getCity?id='+proId,

                onSelect:function(record2){//加载区下拉框
                    var cityId = record2.id;
                    city = record2.name;

                    $('#cc3').combobox({
                        url:'/getDis?id='+cityId,
                        onSelect:function(record3){
                            district = record3.name;
                            // console.log(province,city,district);
                        }
                    })
                }
            })
        }
    });

    $('#cc2').combobox({
        editable:false,
        valueField:'id',
        textField:'name',
        width:'100%'
    });

    $('#cc3').combobox({
        editable:false,
        valueField:'id',
        textField:'name',
        width:'100%'
    });

    // 导航栏设置
    $('#win').window('close');

    //label
    $('.green').css('background-color', '#4CAF50')
    $('.yellow').css('background-color', 'yellow')
    $('.red').css('background-color', '#f44336')

    $('#container2').dblclick(function(){
        var _ans = $('#container1').css('padding');
        if(_ans != '0px'){

            $('#container1').css('padding', '0px');
            $('#container2').css('height', '100%');
            if(page == '路网流量'){
                $('#container2').css('width', '98%');
            }else{
                $('#container2').css('width', '100%');
            }
        }else{
            $('#container1').css('padding-top', '5%');
            $('#container1').css('padding-left', '23%');
            $('#container2').css('width', '70%');
            $('#container2').css('height', '80%');
        }

    });
});

//左侧列表
$(document).ready(function(){

    console.log("$(document).ready(function()");

    //数据在数据库的menu_list_model表中
    var data;
    $('#menuSet').hide();

    $.get("/menuList",function(data){
        // console.log(data.rows);
        $('#sm').sidemenu({
            width:'100%',
            floatMenuWidth:'100%',
            data:convert1(data.rows),
            onSelect:function(item){
                var text = item.text;
                if(text == "历史轨迹"){
                    page = "历史轨迹";
                    $('#label').hide();
                    bdMap4();
                }else if(text == "车流量数据"){
                    page = "车流量数据";
                    $('#label').hide();
                    doEcharts();
                }else if(text == "路网流量"){
                    page = "路网流量";
                    $('#label').show();
                    var map = bdMap2(2);
                    addLayer(map);
                }else if(text = "车辆检索"){
                    page = "车辆检索";
                    bdMap3();
//                    var map = bdMap3();
//                    userSearch(map);
                }
            }
        });
        toggle();
    });

    //导航设置树
    $('#tt').tree({
        url: '/menuList',
        loadFilter: function(data){
            return convert1(data.rows)
        },
        animate: true,
        checkbox: true,
        onlyLeafCheck: true,
        lines: true,
    });

});

//底部块
$(document).ready(function(){
    $('#hand').click(function(){
        text= $('#hand').html();
        if(text == '隐藏'){
            $('#hand').html('显示');
        }else{
            $('#hand').html('隐藏');
        }

        $('#down').fadeToggle();
    });

    $('#hand').hover(function(){
        $('#hand').css('background-color', '#555');
        $('#hand').css('color', 'white');
    });

    $('#hand').mouseleave(function(){
        $('#hand').css('background-color', 'white');
        $('#hand').css('color', 'black');
    });

    $("#search").textbox({
        cls:'myTextSearch',
        prompt: '请输入检索的具体地址信息',
        type: 'text'
    });

    $(".myTextSearch").ready(function(){
        $(".myTextSearch").css("margin-top","2%");
    });

    $("#foot").layout({
        border:false,
        collapsible:false,
        maxHeight:20
    });
});

//获取经度和纬度
function getLongitude(data){
    var carNum = data;
    var getLongitudeResult;
       $.get('/getCarLongitude',{id:carNum},function(result){
          alert("this longitude is "+result);
                 return result;
        });
 }

 //author: XXX
 //Date: 2019/8/29
 //bdMap3在调用<getLongitude>时，存在返回值为 undefined 的情况
 //在此使用 async/await 方法针对本问题重构了函数
 //使用案例可以参考
 //1.   url: https://www.jianshu.com/p/1e75bd387aa0
 //2.   url：https://www.jb51.net/article/100661.htm
 //TODO:原函数可能在其他被调用处，也发生了类似bug，但是还未查证
 function getLongitudeForBdMap3(data){
     var carNum = data;
     var resultL=null;
     // promise 回调函数
     return new Promise(function(resolve){
          $.get('/getCarLongitude',{car_num:carNum},function(result){
                  //alert("this longitude is "+result);
                 resolve(result) ;
             });
     })
 }


function getLatitude(data){
    var carNum = data;
    var resultL=null;
    $.get('/getCarLatitude',{car_num:carNum},function(result){
//        alert("this latitude is "+result);
          return result;
    });
 }

 function getLatitudeForBdMap3(data){
     var carNum = data;
     var resultL=null;
     return new Promise(function(resolve){
          $.get('/getCarLatitude',{car_num:carNum},function(result){
//                  alert("this latitude is "+result);
                 resolve(result) ;
             });
     })
 }


//获得车型

 function getCarTpyeForBdMap3(data){
    console.log("getCarTpyeForBdMap3");
     var carNum = data;
     var resultL=null;
     return new Promise(function(resolve){
          $.get('/getCarType',{car_num:carNum},function(result){
                 //alert("this carType is "+result);
                 resolve(result) ;
             });
     })
 }

// Hbase 调用车辆的经度
  function getVehicleLongitudeForBdMap3(data){
     var carNum = data;
     var resultL=null;
     // promise 回调函数
     return new Promise(function(resolve){
          $.get('/getVehicleLongitude',{car_num:carNum},function(result){
                  //alert("this longitude is "+result);
                 resolve(result) ;
             });
     })
 }



//方法们：----------------------------------------------------------------------------------------------------------------------
function index(){//检索方法
    var text = $('#search').textbox('getValue');
    if(province == null || city == null || page == null){
        if(page == null){
            $.messager.alert('提示', '请选中某一功能再行搜索地点信息');
        }else {
            $.messager.alert('提示', '请将省市信息填写完整');
        }
        reloadContainer2();
        return;
    }
    // // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(text, function(point1){
        point = point1;
        // console.log(point);
        if(page == "历史轨迹"){
            bdMap4();
        }else if(page == "车流量数据"){
            doEcharts();
        }else if(page == "路网流量"){
            $('#label').show();
            var map = bdMap2(2);
            addLayer(map);
        }else if(page = "车辆检索"){
            bdMap3();
//            var map = bdMap2(2);
//            userSearch(map);
        }
    }, city);

    //重置地点信息
    province = null;
    city = null;
    district = null;
    point = null;

}
//datagrid显示图片
// function showImg(value, row, index){
//     if(row.img){
//         return "<img src='"+row.img+"' height='259px' />";
//     }else{
//         return "<img src='./img/0.png' height='259px' />";
//     }
// }

//树过滤为列表
function convert1(rows) {
    function exists(rows, parentId) {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].id == parentId) return true;
        }
        return false;
    }

    var nodes = [];
    // 得到顶层节点
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (!exists(rows, row.parentId)) {
            nodes.push({
                id: row.id,
                text: row.name,
                iconCls:'icon-sum'
            });
        }
    }
    var toDo = [];
    for (var i = 0; i < nodes.length; i++) {
        toDo.push(nodes[i]);
    }
    while (toDo.length) {
        var node = toDo.shift();    // 父节点
        // 得到子节点
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.parentId == node.id) {
                var child = {id : row.id, text: row.name , iconCls:'icon-more' };
                if (node.children) {
                    node.children.push(child);
                } else {
                    node.children = [child];
                }
                toDo.push(child);
            }
        }
    }
    return nodes;
}

//展开列表栏目
function toggle(){
    var opts = $('#sm').sidemenu('options');
    $('#sm').sidemenu('expand');
    opts = $('#sm').sidemenu('options');
    $('#sm').sidemenu('resize',{
        width:'100%'
    })
}

//左侧导航栏设置
function menuSet(){
    $('#win').window('open');
}

//添加栏目
function addItem(){
    var selected = $('#tt').tree('getSelected');
    if(selected.id > 4 || selected.id == null){
        $.messager.alert('提示', '请选择根节点添加栏目');
        return;
    }
    $.messager.prompt('添加栏目', '请输入将要添加栏目的名称:', function(r){
        if (r){
            var data = {
                id : selected.id,
                name:r
            };
            $.get('/addItem',data,function () {
                $.messager.alert('提示', '添加成功');
                $('#tt').tree('reload');
            });
        }
    });
}
//删除栏目
function rmItem(){
    var checkeds = $('#tt').tree('getChecked');
    var ids;
    if(checkeds.length == 0){
        $.messager.alert('提示', '请选中要删除栏目的复选框');
        return;
    }
    ids = checkeds[0].id;
    for(var i = 1; i<checkeds.length; i++){
        ids += ','+checkeds[i].id;
    }
    $.get('/rmItem',{id:ids},function(){
        $.messager.alert('提示', '删除成功');
        $('#tt').tree('reload');
    });
}
//修改栏目
function alertItem(){
    var selected = $('#tt').tree('getSelected');
    if(selected.id == null || selected.id <5){
        $.messager.alert('提示', '请选择子节点添加栏目');
        return;
    }
    $.messager.prompt('添加栏目', '请输入将要修改栏目的名称:', function(r){
        if (r){
            var data = {
                id : selected.id,
                name:r
            };
            $.get('/alertItem',data,function () {
                $.messager.alert('提示', '修改成功');
                $('#tt').tree('reload');
            });
        }
    });
}

//自定义面板
// var cardview = $.extend({}, $.fn.datagrid.defaults.view, {
//     renderRow: function(target, fields, frozen, rowIndex, rowData){
//         var cc = [];
//         cc.push('<td colspan=' + fields.length + ' style="padding:10px 5px;border:0;">');
//         if (!frozen){
//             var aa = rowData.id.split('-');
//             var img = aa[1] + '.png';
//             cc.push('<img src="./img/' + img + '" style="width:150px;float:left">');
//             cc.push('<div style="float:left;margin-left:20px;">');
//             for(var i=0; i<fields.length; i++){
//                 var copts = $(target).datagrid('getColumnOption', fields[i]);
//                 cc.push('<p><span class="c-label">' + copts.title + ':</span> ' + rowData[fields[i]] + '</p>');
//             }
//             cc.push('</div>');
//         }
//         cc.push('</td>');
//         return cc.join('');
//     }
// });

//分页
// function pagerFilter(data){
//     if (typeof data.length == 'number' && typeof data.splice == 'function'){    // 判断数据是否是数组
//
//         data = {
//             total: data.length,
//             rows: data
//         }
//     }
//     var dg = $(this);
//     var opts = dg.datagrid('options');
//     var pager = dg.datagrid('getPager');
//     pager.pagination({
//         onSelectPage:function(pageNum, pageSize){
//             opts.pageNumber = pageNum;
//             opts.pageSize = pageSize;
//             pager.pagination('refresh',{
//                 pageNumber:pageNum,
//                 pageSize:pageSize
//             });
//             dg.datagrid('loadData',data);
//         }
//     });
//     if (!data.originalRows){
//         data.originalRows = (data.rows);
//     }
//     var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
//     var end = start + parseInt(opts.pageSize);
//     data.rows = (data.originalRows.slice(start, end));
//     return data;
//
// }

// 轮播图 js
// window.onload = function () {
//     var container = document.getElementById('container');
//     var list = document.getElementById('list');
//     var buttons = document.getElementById("buttons").getElementsByTagName("span");
//     var prev = document.getElementById('prev');
//     var next = document.getElementById('next');
//     var index = 1;
//     var animated = false;
//     var timer
//
//     function showButton() {
//         for(var i = 0;i < buttons.length; i++){
//             if(buttons[i].className == 'on'){
//                 buttons[i].className = '';
//                 break;
//             }
//         }
//         buttons[index - 1].className = 'on';
//     }
//
//     function animate(offset) {
//         animated = true;
//         var newLeft = parseInt(list.style.left) + offset;
//         var time = 300;
//         var interval = 10;
//         var speed = offset/(time/interval);
//
//         function go() {
//             if(speed < 0 && parseInt(list.style.left) > newLeft || (speed > 0 && parseInt(list.style.left) < newLeft)){
//                 list.style.left = parseInt(list.style.left) + speed + 'px';
//                 setTimeout(go,interval);
//             }
//             else {
//                 animated = false;
//                 list.style.left = newLeft + 'px';
//                 if(newLeft > -650){
//                     list.style.left = -3250 + 'px';
//                 }
//                 if(newLeft < -3250){
//                     list.style.left = -650 + 'px';
//                 }
//             }
//         }
//         go();
//
//     }
//     function play() {
//         timer = setInterval(function () {
//             next.onclick();
//         },3000);
//     }
//     function stop() {
//         clearInterval(timer);
//     }
//     next.onclick = function () {
//         if(index == 5){
//             index = 1;
//         }else {
//             index += 1;
//         }
//         showButton()
//         if(!animated){
//             animate(-650);
//         }
//
//
//     }
//     prev.onclick = function () {
//         if(index == 1){
//             index = 5;
//         }else {
//             index -= 1;
//         }
//         showButton();
//         if(!animated){
//             animate(650);
//         }
//     }
//
//     for(var i = 0;i< buttons.length;i++){
//         buttons[i].onclick = function () {
//             if(this.className == 'on'){
//                 return;
//             }
//             var myIndex = parseInt(this.getAttribute('index'));
//             var offset = -650 * (myIndex - index);
//             if(!animated){
//                 animate(offset);
//             }
//             index = myIndex;
//             showButton();
//         }
//     }
//     container.onmouseover = stop;
//     container.onmouseout = play;
// }

//导入百度地图
function bdMap(){
    bdMap2(1);
}

function bdMap2(style){
    // 创建地图实例
    var map = new BMap.Map("container2");
    var point1 = new BMap.Point(longitude, latitude);
    if(point==null){
        // 创建中心点坐标
        point1 = new BMap.Point(longitude, latitude);
    }else{
        point1 = point;
    }
    // console.log(point);
    // 初始化地图，设置中心点坐标和地图级别,设置为17——100米
    map.centerAndZoom(point1, 17);
    //添加目的地坐标
    map.addOverlay(new BMap.Marker(point1));
    //设置地图样式
    if(style == 1){
        map.setMapStyleV2({
            styleId: 'a465d5ef9c7769db091ef2a596d8bf4b'
        });
    }
    //设置允许鼠标滑轮缩放操作
    map.enableScrollWheelZoom(true);
    //取消双击事件
    map.disableDoubleClickZoom();
    //添加控件
    map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_ZOOM}));
    map.addControl(new BMap.OverviewMapControl());
    // map.addControl(new BMap.GeolocationControl());
    if(style != 1){
        map.addControl(new BMap.MapTypeControl());
        map.setCurrentCity("长春市"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
    }
    return map;
}
// 车辆检索
// 异步函数: async 函数返回的是一个promise 对象
async function bdMap3(){
    // 创建地图实例
    console.log("bdMap3");
    var map = new BMap.Map("container2");
    var point1 = new BMap.Point(longitude, latitude);
    // 如果默认的位置为空，就使用自己的坐标
    if(point==null){
        // 创建中心点坐标
        point1 = new BMap.Point(longitude, latitude);
    }else{
        point1 = point;
    }
    map.centerAndZoom(point1, 17);
    //设置允许鼠标滑轮缩放操作
    map.enableScrollWheelZoom(true);
    //取消双击事件
    map.disableDoubleClickZoom();
    //添加控件
    map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_ZOOM}));
    map.addControl(new BMap.OverviewMapControl());
    map.setCurrentCity("长春市"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用

    //动态第一辆车获取经度和纬度和车型
    tempLongitude=await getLongitudeForBdMap3("A2A840");
    tempLatitude=await getLatitudeForBdMap3("A2A840");
//    console.log("tempLongitude",tempLongitude);
//    console.log("tempLatitude",tempLatitude);
    tempCarType=await getCarTpyeForBdMap3("A2A840");

    //动态第一辆车获取经度和纬度和车型
    tempLongitude_1=await getLongitudeForBdMap3("B2A666");
    tempLatitude_1=await getLatitudeForBdMap3("B2A666");
//    console.log("tempLongitude",tempLongitude);
//    console.log("tempLatitude",tempLatitude);
    tempCarType_1=await getCarTpyeForBdMap3("B2A666");

    //if(tempCarType.match("car")){
    if(tempCarType=="car"){
        console.log("this is "+tempCarType);
        var myIcon = new BMap.Icon('http://developer.baidu.com/map/jsdemo/img/car.png', new BMap.Size(52, 26), {
//         指定定位位置。
//         当标注显示在地图上时，其所指向的地理位置距离图标左上
//         角各偏移10像素和25像素。您可以看到在本例中该位置即是
//         图标中央下端的尖角位置。
        anchor: new BMap.Size(27, 13),
        imageSize: new BMap.Size(52,26),
        // 设置图片偏移。
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。
        imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
                });
            // 创建标注对象并添加到地图
            //var point = new BMap.Point(125.31987661001632,43.83861837062355);
        //    var point = new BMap.Point(tempLatitude,tempLongitude);
        //    var marker = new BMap.Marker(point, {icon: myIcon});
        console.log("this is "+tempLongitude);
        console.log("this is "+tempLatitude);
        var marker = new BMap.Marker(new BMap.Point(tempLongitude,tempLatitude), {icon: myIcon});
        map.addOverlay(marker);
        function attribute(){
                var p = marker.getPosition();  //获取marker的位置
                alert("marker的位置是" + p.lng + "," + p.lat);
            }
        marker.addEventListener("click",attribute);
        marker.enableDragging();
    }

    if(tempCarType_1=="bus"){
        console.log("this is "+tempCarType_1);
        console.log("this is "+tempLongitude_1);
        console.log("this is "+tempLatitude_1);
        var myIcon_1 = new BMap.Icon('/img/bus.png', new BMap.Size(75,33), {
//         指定定位位置。
//         当标注显示在地图上时，其所指向的地理位置距离图标左上
//         角各偏移10像素和25像素。您可以看到在本例中该位置即是
//         图标中央下端的尖角位置。
        anchor: new BMap.Size(27, 13),
        imageSize: new BMap.Size(75,33),
        // 设置图片偏移。
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。
        imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
                });
        var marker_1 = new BMap.Marker(new BMap.Point(tempLongitude_1,tempLatitude_1), {icon: myIcon_1});
       // 增加标注点
        map.addOverlay(marker_1);
        // 添加监听事件用来显示车的位置
        function attribute_1(){
            var p = marker_1.getPosition();  //获取marker的位置
            alert("marker的位置是" + p.lng + "," + p.lat);
        }
        //marker_1.addEventListener("click",attribute_1)
            // 画直线
            var polyline = new BMap.Polyline([
                new BMap.Point(123.32065555,43.8788625),
                new BMap.Point(125.327277839,43.8390000),
                new BMap.Point(125.33214242,43.83906726838)
            ],{
                strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5   //创建折线
            });
            map.addOverlay(polyline);  //增加折线
            // 拖动小车
            marker_1.enableDragging();
    }
}

// GetCars()函数   函数的功能是通过ajax访问后台接口，从而返回车辆的实时位置信息。
var trackMap = [];
function getCars(){
	map.panTo(trackMap[trackMap.length - 1]);//将地图的中心点更改为给定的点。
	map.setZoom(14);//将视图切换到指定的缩放等级，中心点坐标不变。
	$.ajax({
		async:false,
		cache:true,
		url: "获取车辆实时位置信息的接口",
		type: 'GET',
		dataType:'text',
		success: function(result){
			var result = eval('('+ result +')');
			/*** 实时获取经纬度信息 ***/
			sitsLongitude = result.longitude;
			sitsLatitude = result.latitude;
			trackMap.push(new BMap.Point(sitsLongitude, sitsLatitude));//push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
			carContent = '<div><br/>经度： '+sitsLongitude+'<br/>纬度： '+sitsLatitude+'<p style="color:green; margin-left:65%;">正在跟踪中</p></div>';
			//addOverlay(overlay: Overlay) : 将覆盖物添加到地图中，一个覆盖物实例只能向地图中添加一次
			//Polyline(points: Array<Point>, opts: PolylineOptions) : 创建折线覆盖物对象
			//PolylineOptions: 此类表示Polyline构造函数的可选参数。
			if (trackMap.length > 2) {
				map.addOverlay(new BMap.Polyline([trackMap[trackMap.length-2], trackMap[trackMap.length - 1]], {strokeColor: "blue", strokeWeight: 3, strokeOpacity: 1, strokeStyle:"dashed"}));
			}
			addMouseoverHandler(carContent, carMarker);
			carMarker.setPosition(trackMap[trackMap.length-1]);//setPosition:设置标注的地理坐标
		},
		error:function(e){
			alert("获取物资信息失败");
		}
	});
	setTimeout(function(){	//setTimeout() 方法用于在指定的毫秒数后调用函数或计算表达式。setTimeout() 只执行 code 一次。如果要多次调用，请使用 setInterval() 或者让 code 自身再次调用 setTimeout()。
		getCars();
	}, 2000);
}





// 车辆历史轨迹
function bdMap4(){
// 百度地图动态行驶轨迹
    var map = new BMap.Map("container2");
    var point1 = new BMap.Point(longitude, latitude);
    // 如果默认的位置为空，就使用自己的坐标
    if(point==null){
        // 创建中心点坐标
        point1 = new BMap.Point(longitude, latitude);
    }else{
        point1 = point;
    }
    map.centerAndZoom(point1, 17);
    //设置允许鼠标滑轮缩放操作
    map.enableScrollWheelZoom(true);
    //取消双击事件
    map.disableDoubleClickZoom();
    //添加控件
    map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_ZOOM}));
    map.addControl(new BMap.OverviewMapControl());
    map.setCurrentCity("长春市"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
    //  获取需要画的历史轨迹的起止时间点
    var startTime; // 历史轨迹的起始时间点
    var endTime;  // 历史轨迹的终止时间

    //


    var myP1 = new BMap.Point(125.31546592996234,43.838787432589314);    //起点
    var myP2 = new BMap.Point(125.32766491878783,43.83874841833235);    //终点
    var myIcon = new BMap.Icon('http://developer.baidu.com/map/jsdemo/img/car.png', new BMap.Size(52,26), {
                    anchor : new BMap.Size(27, 13),
                    imageSize:new BMap.Size(52,26)
                });
//     var marker = new BMap.Marker(new BMap.Point(125.31987661001632,43.83861837062355), {icon: myIcon});
//     map.addOverlay(marker);   // 添加标识
     var driving2 = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});    //驾车实例
     driving2.search(myP1, myP2);    //显示一条公交线路
     window.run = function (){
    		var driving = new BMap.DrivingRoute(map);    //驾车实例
    		driving.search(myP1, myP2);
    		driving.setSearchCompleteCallback(function(){
    			var pts = driving.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
    			var paths = pts.length;    //获得有几个点
                //先将终点坐标展示的mark对象定义
    			var carMk = new BMap.Marker(pts[0],{icon:myIcon});

    			map.addOverlay(carMk);
    			i=0;
    			function resetMkPoint(i){
    				carMk.setPosition(pts[i]);
    				if(i < paths){
    					setTimeout(function(){
    						i++;
    						resetMkPoint(i);
    					},100);
    				}
    			}
    			setTimeout(function(){
    				resetMkPoint(5);
    			},100)

    		});
    	}

    	setTimeout(function(){
    		run();
    	},1500);
}



//为地图添加查流量图层
function addLayer(map){
    //创建交通图层实例
    var traffic = new BMap.TrafficLayer();
    map.addTileLayer(traffic);
}

//数据检索
function userSearch(map){
    //用鼠标绘制圆形区域
    var drawingManager = new BMapLib.DrawingManager(map, {
//使用鼠标工具需要引入鼠标工具开源库DrawingManager_min.js及样式文件DrawingManager_min.css
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            scale: 0.8 //工具栏缩放比例
        }
    });
    drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
    drawingManager.open();

    //在鼠标画圆结束后回调函数内进行周边检索
    drawingManager.addEventListener('circlecomplete', function(e) {
        circle = e;
        var radius= parseInt(e.getRadius()); //检索半径必须是整型
        var center= e.getCenter();
        drawingManager.close();
        if (customLayer) {
            map.removeTileLayer(customLayer);
        }
        localSearch.searchNearby(' ', center,radius,{customData:{databoxId: 4032}});//用新创建的databoxid替换该值
    });
}

//添加数据可视化echarts组件
function doEcharts(){
    //背景色加深
    $('#container2').css('background-color', 'rgba(204,204,204,0.8)');
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('container2'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '车流量统计'
        },
        tooltip: {},
        legend: {
            data:['流量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function reloadContainer2(){
    $('#container2').html(function(){
        $('#container2').css('background-color', 'rgba(204,204,204,0.4)');
        return "<!--时间选择框-->\n" +
            "            <div id=\"timeChoose\" style=\"width: 80%; height: 47%; margin: 2.5%; padding-top: 10%; padding-left:15%; margin-left: 10%;\">\n" +
            "                <h3>请选择日期以及时间：</h3>\n" +
            "                <!--日期时间框-->\n" +
            "                <input id=\"dt\" type=\"text\" style=\"width: 60%;\">\n" +
            "            </div>\n" +
            "\n" +
            "            <!--地点选择框-->\n" +
            "            <div id=\"areaChoose\" style=\"width: 80%; height: 47%; margin: 2.5%; padding-left:15%; margin-left: 10%\">\n" +
            "                <!--<h3>请选择地点信息：</h3>-->\n" +
            "\n" +
            "                <!--&lt;!&ndash;地点选择框&ndash;&gt;-->\n" +
            "                <!--<input id=\"pb1\" type=\"text\" title=\"省：\" style=\"width: 31%; margin: 1%; padding: 0px\">-->\n" +
            "                <!--<input id=\"pb2\" type=\"text\" title=\"市/县：\" style=\"width: 31%; margin: 1%; padding: 0px\">-->\n" +
            "                <!--<input id=\"pb3\" type=\"text\" title=\"区：\" style=\"width: 31%; margin: 1%; padding: 0px\">-->\n" +
            "                <div style=\"width: 24%; height: 100%; margin: 0px; padding: 0px; margin-right: 1%; float: left\">\n" +
            "                    <h3>省份</h3>\n" +
            "                    <input id=\"cc1\" value=\"省份\">\n" +
            "                </div>\n" +
            "\n" +
            "                <div style=\"width: 24%; height: 100%; margin: 0px; padding: 0px; margin-right: 1%; float: left\">\n" +
            "                    <h3>市/县</h3>\n" +
            "                    <input id=\"cc2\" value=\"市\">\n" +
            "                </div>\n" +
            "\n" +
            "                <div style=\"width: 24%; height: 100%; margin: 0px; padding: 0px; margin-right: 1%; float: left\">\n" +
            "                    <h3>区/县</h3>\n" +
            "                    <input id=\"cc3\" value=\"区/县\">\n" +
            "                </div>\n" +
            "\n" +
            "            </div>";
    });
    loadCenter();
}

function loadCenter(){
    // 时间日期选择框
    $("#dt").datetimebox({
        showSeconds: true,
        required:true,
        onChange:function(data){
            date = $('#dt').datetimebox('getValue');
            // console.log(date);
        }});

    //地点选择框
    $('#cc1').combobox({
        url:'/getPro',
        valueField:'id',
        textField:'name',
        width:'100%',
        editable:false,
        onSelect:function(record){//加载城市下拉框
            // console.log(record);
            var proId = record.id;
            province = record.name;

            $('#cc2').combobox({
                url:'/getCity?id='+proId,

                onSelect:function(record2){//加载区下拉框
                    var cityId = record2.id;
                    city = record2.name;

                    $('#cc3').combobox({
                        url:'/getDis?id='+cityId,
                        onSelect:function(record3){
                            district = record3.name;
                            // console.log(province,city,district);
                        }
                    })
                }
            })
        }
    });

    $('#cc2').combobox({
        editable:false,
        valueField:'id',
        textField:'name',
        width:'100%'
    });

    $('#cc3').combobox({
        editable:false,
        valueField:'id',
        textField:'name',
        width:'100%'
    });
}