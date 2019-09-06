package com.weiming.xiguang.Controller;

import com.weiming.xiguang.Service.CarServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class CarController {
    @Autowired
    CarServicer carServicer;

    @RequestMapping(value = "/getCarLongitude")  // 跳转
    public double getLongitude(@RequestParam(value = "car_num") String car_num){//获得经度
        return carServicer.getlongitude(car_num);
    }

    @RequestMapping(value = "/getCarLatitude")
    public double getLatitude(@RequestParam(value = "car_num") String car_num){//获得纬度

        return carServicer.getlatitude(car_num);
    }

    @RequestMapping(value = "/getCarType")
    public String getType(@RequestParam(value = "car_num") String car_num){ return carServicer.getcartype(car_num); }

}
