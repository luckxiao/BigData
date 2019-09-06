package com.weiming.xiguang.Service;

import com.weiming.xiguang.Dao.CityDao;
import com.weiming.xiguang.Dao.DistrictDao;
import com.weiming.xiguang.Dao.ProvinceDao;
import com.weiming.xiguang.Model.CityModel;
import com.weiming.xiguang.Model.DistrictModel;
import com.weiming.xiguang.Model.ProvinceModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AreaServicer {
    @Autowired
    ProvinceDao provinceDao;
    @Autowired
    CityDao cityDao;
    @Autowired
    DistrictDao districtDao;

    public List<ProvinceModel> getAllPro(){
        List<ProvinceModel> result = null;
        try{
            result = provinceDao.getAll();
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return result;
    }

    public List<CityModel> getCityByProId(int id){
        List<CityModel> result = null;
        try{
            result = cityDao.getAllByParentId(id);
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return result;
    }

    public List<DistrictModel> getDisByCityId(int id){
        List<DistrictModel> result = null;
        try{
            result = districtDao.getAllByParentId(id);
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return result;
    }


}
