package com.weiming.xiguang.Model;

import javax.persistence.*;

@Entity
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private long userNum;//用户账号

    private String password;//用户密码

    private String userName;//用户名

    /**用户权限
     * */
    @Column(insertable = false,columnDefinition = "int default 0")
    private int power = 0;

    public void setId(int id){
        this.id = id;
    }

    public int getId(){
        return this.id;
    }

    public void setUserNum(long userNum){
        this.userNum = userNum;
    }

    public long getUserNum(){
        return this.userNum;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public String getPassword(){
        return this.password;
    }

    public void setUserName(String userName){
        this.userName = userName;
    }

    public String getUserName(){
        return this.userName;
    }

    public void setPower(int power){
        this.power = power;
    }

    public int getPower(){
        return this.power;
    }
}
