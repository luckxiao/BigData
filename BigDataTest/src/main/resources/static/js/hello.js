$(function(){
    //账户框
    $('.username').textbox({
        prompt : '请输入用户名',
        type : 'text',
        label : 'UserName:',
        labelPosition : 'top',
        labelAlign : 'left',
        iconCls : 'icon-man',
        iconAlign : 'right'
    });
    //验证部分密码（密码中的四位）框
    $('.parpwd').textbox({
        prompt : '请输入密码中的某4位',
        type : 'text',
        label : 'PartialPassWord:',
        labelPosition : 'top',
        labelAlign : 'left',
        iconCls : 'icon-lock',
        iconAlign : 'right'
    });
    //重复输入密码框
    $('.repassword').textbox({
        prompt : '请再次输入密码',
        type : 'password',
        label : 'RePassWord:',
        labelPosition : 'top',
        labelAlign : 'left',
        iconCls : 'icon-lock',
        iconAlign : 'right'
    });
    //密码框
    $('.password').textbox({
        prompt : '请输入密码',
        type : 'password',
        label : 'PassWord:',
        labelPosition : 'top',
        labelAlign : 'left',
        iconCls : 'icon-lock',
        iconAlign : 'right',
        showEye : true
    });
    //设置密码框
    $('.setpassword').textbox({
        prompt : '请重新设置密码',
        type : 'password',
        label : 'PassWord:',
        labelPosition : 'top',
        labelAlign : 'left',
        iconCls : 'icon-lock',
        iconAlign : 'right',
        showEye : true
    });


    //账户密码验证
    $('.username').validatebox({
        requires: true
    });

    $('.password').validatebox({
        requires: true,
        validType : 'length[6,12]'
    });

});

//登录提交
function register(){
    var username = $('#username1').textbox('getValue');
    var password = $('#password1').textbox('getValue');
    // console.log(username,password);
    $.post("/register1",{username:username,password:password},function(result){
        // console.log(result);
        if(!(result.answer)){
            $.messager.alert("提示","用户名或密码错误！");
        }else{
            //跳转页面到登入页面
            window.location.href='index?power='+result.power;
        }

    });
};

function register2(){
    var username = $('#username2').textbox('getValue');
    var password = $('#password2').textbox('getValue');
    var repwd = $('#repassword2').textbox('getValue');
    // console.log(username,password);
    if(repwd != password){
        $.messager.alert('提示','密码不相同！');
    }else{
        $.post("/register2",{username:username,password:password},function(result){
            $.messager.alert("提示","注册成功！");
        });
    }

};

function register3(){
    var username = $('#username3').textbox('getValue');
    var parPwd = $('#parpwd').textbox('getValue');
    var password = $('#password3').textbox('getValue');
    // console.log(username,password);
    if(parPwd.length !=4){
        $.messager.alert("提示","请输入原密码中的任意4位");
        return;
    }
    $.post("/register3",{username:username,parPwd:parPwd,password:password},function(result){
        if(result == -2){
            $.messager.alert("提示","未知错误！");
            return;
        }else if(result == -1){
            $.messager.alert("提示","验证密码错误！");
            return;
        }else if(result == 1){
            $.messager.alert("提示","用户名不存在！");
            return;
        }else if(result == 0){
            $.messager.alert("提示","密码设置成功！");
            return;
        }
        $.messager.alert("提示","该系统正被骇客入侵，请联系工作人员！");
        return;
    });
};