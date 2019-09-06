package com.weiming.xiguang.Dao;

import com.weiming.xiguang.Model.MenuListModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

public interface MenuListDao extends JpaRepository<MenuListModel, Integer> {
    @Query(value = "SELECT * from menu_list_model where id = ?1", nativeQuery = true)
    MenuListModel findAllById(Integer id);

    @Query(value = "select * from menu_list_model", nativeQuery = true)
    List<MenuListModel> findAll();

    @Query(value = "select name from menu_list_model", nativeQuery = true)
    List<String> findAllName();

    @Modifying
    @Transactional
    @Query(value = "update menu_list_model set name = ?1 where id = ?2",nativeQuery = true)
    void setNameById(String name, int id);

    @Modifying
    @Transactional
    @Query(value = "insert into menu_list_model(name, parent_id) values (?1, ?2)", nativeQuery = true)
    void insertOne(String name, int parent_id);

    @Modifying
    @Transactional
    @Query(value = "delete from menu_list_model where id in ?1", nativeQuery = true)
    void removeOne(int[] id);
}
