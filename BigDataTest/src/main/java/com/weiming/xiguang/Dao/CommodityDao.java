package com.weiming.xiguang.Dao;

import com.weiming.xiguang.Model.CommodityModel;
import org.hibernate.annotations.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommodityDao extends JpaRepository<CommodityModel, Integer>{

    @Query(value = "select * from commodity_model", nativeQuery = true)
    public List<CommodityModel> findAll();
}
