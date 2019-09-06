package com.weiming.xiguang.Model;

import javax.persistence.*;

@Entity
public class MenuListModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;//该名称

    @Column(insertable = false,columnDefinition = "int default -1")
    private int parentId;

    public void setId(Integer id){
        this.id = id;
    }

    public Integer getId(){
        return this.id;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getName(){
        return this.name;
    }

    public Integer getParentId(){
        return this.parentId;
    }

    public void setParentId(Integer parentId){
        this.parentId = parentId;
    }
}
