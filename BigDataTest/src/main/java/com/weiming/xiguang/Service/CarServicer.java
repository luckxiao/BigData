package com.weiming.xiguang.Service;

import com.weiming.xiguang.Dao.CarDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;

@Service
public class CarServicer {
    @Autowired
    CarDao carDao;

    public double getlatitude(String car_Num){//获得纬度
//        System.out.println("car num is "+ car_Num);
        double latitude = 43.836687;//默认纬度
        if(car_Num == null){
            return latitude;
        }

        try{
            latitude = carDao.getlatitude(car_Num);
        }catch(Exception ex){
            System.err.println("获得纬度时出现异常，已设置为默认纬度");
        }
//        System.out.println("纬度是"+latitude);
        return latitude;
    }

    public double getlongitude(String car_Num){//获得经度
        double longitude = 125.3202;//默认经度
        if(car_Num == null){
            return longitude;
        }

        try{
            longitude = carDao.getlongitude(car_Num);
        }catch(Exception ex){
            System.err.println("获得经度时出现异常，已设置为默认纬度");
        }
        return longitude;
    }
    public String getcartype(String car_Num){//获得经度
        String cartype = null;
        try{
            cartype = carDao.getcartype(car_Num);
        }catch(Exception ex){
            System.err.println("获得车型时出现异常");
        }
        return cartype;
    }
}
