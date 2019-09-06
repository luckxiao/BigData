package com.weiming.xiguang.Model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class CommodityModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name=null;//商品名称
    private double price=998;//商品价格
    private String img = null;//商品图片地址
    private String introduction=null;//商品简介
    private int parentId = -1;//商家id

    public void setId(int id){
        this.id = id;
    }

    public int getId(){
        return this.id;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getName(){
        return this.name;
    }

    public void setPrice(double price){
        this.price = price;
    }

    public double getPrice(){
        return this.price;
    }

    //存储格式固定为img目录下的mane加id.png
    public void setImg(String img){
        this.img = "./img/"+this.getName()+this.getId()+".png";
    }

    public String getImg(){
        return this.img;
    }

    public void setIntroduction(String introduction){
        this.introduction = introduction;
    }

    public String getIntroduction(){
        return this.introduction;
    }

    public void setParentId(int parentId){
        this.parentId = parentId;
    }

    public int getParentId(){
        return this.parentId;
    }
}
