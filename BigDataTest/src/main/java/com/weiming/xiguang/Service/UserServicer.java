package com.weiming.xiguang.Service;

import com.weiming.xiguang.Dao.UserDao;
import com.weiming.xiguang.Model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 陈开泰
 * 2019/7/16*/
@Service
public class UserServicer {
    @Autowired
    UserDao userDao;

    public boolean register1(String username, String password){//验证登陆
        int id = 0;
        try{
            id = userDao.getIdByUserName(username);
        }catch(Exception ex){
            System.err.println("登录异常——用户名不存在");
            return false;
        }

        String pwd = userDao.getPasswordById(id);
        if (pwd.equals(password)){
            return true;
        }
        return false;
    }

    public boolean register2(String username, String password){//注册方法
        int id = 0;
        try{//该账号已存在
            id = userDao.getIdByUserName(username);
        }catch(Exception ex){//该账号不存在
            userDao.insertOne(username,password);
            return true;
        }
        return false;
    }

    public int register3(String username, String parPwd,String newPassword){//验证4位残缺密码是否正确,返回0正确，-1密码不正确，1不存在该用户名,2修改密码时错误
        int id = 0;
        int index = -1;
        String password = null;
        try{
            id = userDao.getIdByUserName(username);
        }catch(Exception ex){
            System.err.println("在找回密码时用户名不存在!");
            return 1;
        }
        password = userDao.getPasswordById(id);
        index = password.indexOf(parPwd);
        if(index != -1){//符合条件，开始修改密码
            userDao.setPasswordById(newPassword, id);
            return 0;
        }
        return -1;
    }

    public int getPowerById(int id){
        int power = 0;
        try{
            power = userDao.getPowerById(id);
        }catch(Exception ex){
            return 0;
        }
        return power;
    }

    public int getPowerByUserName(String username){
        int id = 0;
        try{
            id = userDao.getIdByUserName(username);
        }catch(Exception ex){
            System.err.println("获取用户id时发生异常，详细查询getPowerByUsername方法");
            return 0;
        }
        return getPowerById(id);
    }
}
