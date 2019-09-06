package com.weiming.xiguang.Controller;

import com.weiming.xiguang.Service.UserServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

//登录controler
//2019/7/16
//陈开泰
@RestController
public class RegisterController {
    @Autowired
    private UserServicer userServicer;

    @RequestMapping(value = "/register1",method = RequestMethod.POST)//登录方法
    public Map registerPass(
            @RequestParam("username") String username,
            @RequestParam("password") String password
    ){
        boolean answer = userServicer.register1(username,password);
        int power = 0;
        if(answer){
            power = userServicer.getPowerByUserName(username);
        }
        Map result = new HashMap();
        result.put("answer",answer);
        result.put("power",power);
        return result;
    }

    @RequestMapping(value = "/register2",method = RequestMethod.POST)//注册方法
    public boolean register(
            @RequestParam("username") String username,
            @RequestParam("password") String password
    ){
        boolean result = userServicer.register2(username ,password);
        return result;
    }

    @RequestMapping(value = "/register3", method = RequestMethod.POST)//验证找回密码使用的4位残缺密码是否正确
    public int register3(//反回0验证正确，返回1用户名不存在，返回-1残缺密码错误,返回2时修改密码错误
            @RequestParam(value = "username") String username,
            @RequestParam(value = "parPwd") String parPwd,
            @RequestParam(value = "password")String password
    ){
        int result = -2;
        result = userServicer.register3(username,parPwd,password);
        return result;
    }
}
