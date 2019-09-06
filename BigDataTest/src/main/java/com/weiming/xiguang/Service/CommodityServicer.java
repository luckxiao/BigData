package com.weiming.xiguang.Service;

import com.weiming.xiguang.Dao.CommodityDao;
import com.weiming.xiguang.Model.CommodityModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommodityServicer {
    @Autowired
    CommodityDao commodityDao;

    public List<CommodityModel> findAll(){
        return commodityDao.findAll();
    }
}
