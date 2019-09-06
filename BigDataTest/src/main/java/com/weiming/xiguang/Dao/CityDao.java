package com.weiming.xiguang.Dao;

import com.weiming.xiguang.Model.CityModel;
import com.weiming.xiguang.Model.ProvinceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CityDao extends JpaRepository<CityModel,Integer> {
    @Query(value = "select * from city_model where parent_id = ?1", nativeQuery = true)
    List<CityModel> getAllByParentId(int parent_id);
}
