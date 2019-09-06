package com.weiming.xiguang.Model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class CarModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String carNum;//车牌号

    private double longitude;//经度

    private double latitude;//纬度

    private String carType;//车型

    public void setId(int id){
        this.id = id;
    }

    public int getId(){
        return this.id;
    }

    public void setCarNum(String carNum){
        this.carNum = carNum;
    }

    public String getCarNum(){
        return carNum;
    }

    public void setCarType(String carType){
        this.carType = carType;
    }

    public String getCarType(){
        return this.carType;
    }

    public void setLongitude(double longitude){
        this.longitude = longitude;
    }

    public double getLongitude(){
        return longitude;
    }

    public void setLatitude(double latitude){
        this.latitude = latitude;
    }

    public double getLatitude(){
        return latitude;
    }
}
