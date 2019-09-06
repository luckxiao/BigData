package com.weiming.xiguang.Dao;

import com.weiming.xiguang.Model.ProvinceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProvinceDao extends JpaRepository<ProvinceModel,Integer> {
    @Query(value = "select * from province_model", nativeQuery = true)
    List<ProvinceModel> getAll();
}
