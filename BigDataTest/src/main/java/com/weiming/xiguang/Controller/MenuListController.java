package com.weiming.xiguang.Controller;

import com.weiming.xiguang.Model.MenuListModel;
import com.weiming.xiguang.Service.MenuListServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class MenuListController {
    @Autowired
    MenuListServicer menuListServicer;

    //返回菜单列表数据
    @RequestMapping(value = "/menuList")
    public Map findAll(){
        List list = menuListServicer.findAll();
        Map dataMap = new HashMap();
        dataMap.put("rows", list);
        return dataMap;
    }

    @RequestMapping(value = "/menu")
    public Map findAllName(){
        List<String> list = menuListServicer.findAllName();
        Map dataMap = new HashMap();
        dataMap.put("rows", list);
        return dataMap;
    }

    //添加一条数据
    @RequestMapping(value = "/addItem")
    public void addItem(@RequestParam(value = "id")int parent_id, @RequestParam(value = "name")String name){
        menuListServicer.addOne(name, parent_id);
    }

    //更改一条数据
    @RequestMapping(value = "/alertItem")
    public void alertOne(@RequestParam(value = "id")int id, @RequestParam(value = "name")String name){
        menuListServicer.alertOne(name, id);
    }

    //删除一条数据
    @RequestMapping(value = "/rmItem")
    public void removeOne(@RequestParam(value = "id")String id){
        String[] ids_String = id.split(",");
        int[] ids_int = new int[ids_String.length];
        try{
            for(int i = 0; i< ids_String.length; i++){
                ids_int[i] = Integer.parseInt(ids_String[i]);
            }
        }catch(Exception ex){
            System.err.println("疑似类型转换失败，具体查询MenuListController");
        }
        menuListServicer.removeOne(ids_int);
    }
}
