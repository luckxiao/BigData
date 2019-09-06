package com.weiming.xiguang.Controller;

import com.weiming.xiguang.Model.CityModel;
import com.weiming.xiguang.Model.DistrictModel;
import com.weiming.xiguang.Model.ProvinceModel;
import com.weiming.xiguang.Service.AreaServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AreaController {
    @Autowired
    AreaServicer areaServicer;

    @RequestMapping(value = "/getPro")
    public List<ProvinceModel> getAllPro(){
        return areaServicer.getAllPro();
    }

    @RequestMapping(value = "/getCity")
    public List<CityModel> getCityByProId(@RequestParam(value = "id") int id){
        return areaServicer.getCityByProId(id);
    }

    @RequestMapping(value = "/getDis")
    public List<DistrictModel> getDisByCityId(@RequestParam(value = "id") int id){
        return areaServicer.getDisByCityId(id);
    }
}
