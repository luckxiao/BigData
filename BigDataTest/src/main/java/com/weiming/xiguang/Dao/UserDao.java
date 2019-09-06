package com.weiming.xiguang.Dao;

import com.weiming.xiguang.Model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

public interface UserDao extends JpaRepository<UserModel, Integer> {
    @Query(value = "select id from user_model where user_name = ?1",nativeQuery = true)
    int getIdByUserName(String username);

    @Query(value = "select user_name from user_model where id = ?1", nativeQuery = true)
    String getUserNameById(int id);

    @Query(value = "select password from user_model where id = ?1", nativeQuery = true)
    String getPasswordById(int id);

    @Query(value = "select power from user_model where id = ?1", nativeQuery = true)
    int getPowerById(int id);

    @Modifying
    @Transactional
    @Query(value = "update user_model set password = ?1 where id = ?2",nativeQuery = true)
    void setPasswordById(String password, int id);

    @Modifying
    @Transactional
    @Query(value = "insert into user_model(user_name, password) values (?1, ?2)", nativeQuery = true)
    void insertOne(String username, String password);
}
