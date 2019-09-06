package com.weiming.xiguang.Dao;

import com.weiming.xiguang.Model.CarModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**陈开泰
 * 2019/8/27
 * 车辆信息表Dao*/
//数据库查询
public interface CarDao extends JpaRepository<CarModel, Integer> {
    @Query(value = "select latitude from car_model where car_num = ?1", nativeQuery = true)
    double getlatitude(String id);//获得纬度

    @Query(value = "select longitude from car_model where car_num = ?1", nativeQuery = true)
    double getlongitude(String id);//获得经度

    @Query(value = "select car_type from car_model where car_num = ?1",nativeQuery = true)
    String getcartype(String car_type); // 获得车型
}
