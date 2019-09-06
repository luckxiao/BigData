package com.weiming.xiguang.Dao;

import com.weiming.xiguang.Model.DistrictModel;
import com.weiming.xiguang.Model.ProvinceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DistrictDao extends JpaRepository<DistrictModel,Integer> {
    @Query(value = "select * from district_model where parent_id = ?1", nativeQuery = true)
    List<DistrictModel> getAllByParentId(int parent_id);
}
