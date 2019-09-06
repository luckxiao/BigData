package com.weiming.xiguang.Service;

import com.weiming.xiguang.Dao.MenuListDao;
import com.weiming.xiguang.Model.MenuListModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**陈开泰
 * 2019/7/17
 * */
@Service
public class MenuListServicer {
    @Autowired
    MenuListDao menuListDao;

    //返回menulist中所有数据
    public List<MenuListModel> findAll(){
        return menuListDao.findAll();
    }

    public MenuListModel findAllById(Integer id){
        return menuListDao.findAllById(id);
    }

    public List<String> findAllName(){
        return menuListDao.findAllName();
    }

    //添加一条数据
    public void addOne(String name, int parent_id){
        menuListDao.insertOne(name, parent_id);
    }

    //更改一条数据
    public void alertOne(String name, int id){
        menuListDao.setNameById(name, id);
    }

    //删除一条数据
    public void removeOne(int[] id){
        menuListDao.removeOne(id);
    }
}
