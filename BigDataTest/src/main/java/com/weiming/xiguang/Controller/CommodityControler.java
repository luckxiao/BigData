package com.weiming.xiguang.Controller;

import com.weiming.xiguang.Model.CommodityModel;
import com.weiming.xiguang.Service.CommodityServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class CommodityControler {
    @Autowired
    CommodityServicer commodityServicer;

    @RequestMapping(value = "/commodity")
    public Map getCommodities(){
        List<CommodityModel> getAll = commodityServicer.findAll();
        Map resultMap = new HashMap();
        resultMap.put("rows", getAll);
        resultMap.put("total", getAll.size());
        return resultMap;
    }

}
