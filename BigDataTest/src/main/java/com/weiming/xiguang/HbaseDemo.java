package com.weiming.xiguang;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.*;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;

import javax.swing.table.JTableHeader;

public class HbaseDemo {
    private static Connection connection; //HBase 连接

    public static void main (String [] agrs) throws IOException {
        // hadoop路径设置
        System.setProperty("hadoop.home.dir","D:\\thunder_file_Download\\hadoop-common-2.2.0-bin-master");
        init();//建立连接
        createTable("vehicle", new String[]{"vehicle_message"}); //建表
        createTable("vehicle_1", new String[]{"vehicle_message"}); //建表
        Vehicle vehicle = new Vehicle("C-A34183","bus","125.31987661001632","43.83861837062355");
        System.out.println("------------------车辆信息---------------------------");
        System.out.println(vehicle);
        System.out.println("------------------插入一行信息---------------------------");
        insertRowData("vehicle_1",vehicle);
        System.out.println("--------------------查询所有数据--------------------");
        List<Vehicle> list = getAllData("vehicle_1");
        System.out.println("--------------------插入测试数据后--------------------");
        for (Vehicle vehicle1 : list) {
            System.out.println(vehicle1.toString());
        }
        System.out.println("--------------------获取原始数据-----------------------");
        getNoDealData("vehicle_1");
        System.out.println("--------------------根据rowKey查询--------------------");
        Vehicle vehicle_one  = getDataByRowKey("vehicle_1", "vehicle-001");
        System.out.println(vehicle_one.toString());
        System.out.println("--------------------查询指定单条数据--------------------");
        String vehicleOne = getCellData("vehicle_1", "vehicle-001", "vehicle_message", "vehicle_longitude");
        System.out.println(vehicleOne);
        // 插入一个一个插入数据
        insertData("vehicle","20190831_A-B5842","vehicle_message","vehicle_id","A-B5842");//添加车牌号
        insertData("vehicle","20190831_A-B5842","vehicle_message","vehicle_type","car");//添加车型
        insertData("vehicle","20190831_A-B5842","vehicle_message","vehicle_longitude","125.31987661001632");//添加经度
        insertData("vehicle","20190831_A-B5842","vehicle_message","vehicle_latitude","43.83861837062355");//添加纬度

        // 浏览数据
        getData("vehicle","20190831_A-B5842","vehicle_message","vehicle_type");
        close();//关闭连接
    }
//创建表
    public static void createTable(String myTableName, String[] colFamily) throws IOException {
        TableName tableName = TableName.valueOf(myTableName);
        Admin admin = connection.getAdmin();
        if(admin.tableExists(tableName)){
//            admin.disableTable(tableName);
//            admin.deleteTable(tableName);
            System.out.println("table exists!");
        }
        else {
            HTableDescriptor hTableDescriptor = new HTableDescriptor(tableName);
            for(String str:colFamily){
                HColumnDescriptor hColumnDescriptor = new HColumnDescriptor(str);
                hTableDescriptor.addFamily(hColumnDescriptor);
            }
            admin.createTable(hTableDescriptor);
        }
    }

    static String myIP = "10.34.51.202";
    public static Connection init () throws IOException {   //建立连接
        //HBase 配置信息
        Configuration configuration = HBaseConfiguration.create();
        configuration.set("hbase.zookeeper.quorum",myIP);
        configuration.set("hbase.zookeeper.property.clientPort","2181");

        connection = ConnectionFactory.createConnection(configuration);
        return connection;
        //Admin admin = connection.getAdmin();
    }

    public static void close () {  //关闭连接
      try{
          Admin admin = connection.getAdmin();
          if(admin != null) {
              admin.close();
          }
          if (null != connection) {
              connection.close();
          }
      }catch (IOException e) {
          e.printStackTrace();
      }
    }
    //一条一条的插入数据
    public static void insertData(String tableName, String rowKey, String colFamily, String col, String val) throws IOException {
        Table table = connection.getTable(TableName.valueOf(tableName));
        Put put = new Put(rowKey.getBytes());
        put.addColumn(colFamily.getBytes(),col.getBytes(),val.getBytes());
        table.put(put);
        table.close();
    }

    // 插入一行数据

    public static void insertRowData(String tableName, Vehicle vehicle) throws IOException {
        System.out.println("———————————————插入数据———————————————————");
        TableName tablename = TableName.valueOf(tableName);
        Put put = new Put(("vehicle-" + vehicle.getVehicle_id()).getBytes());
        //参数：1.列族名  2.列名  3.值
        put.addColumn("vehicle_message".getBytes(), "getVehicle_type".getBytes(), vehicle.getVehicle_type().getBytes());
        put.addColumn("vehicle_message".getBytes(), "vehicle_longitude".getBytes(), vehicle.getVehicle_longitude().getBytes());
        put.addColumn("vehicle_message".getBytes(), "vehicle_latitude".getBytes(), vehicle.getVehicle_latitude().getBytes());
        //HTable table = new HTable(initHbase().getConfiguration(),tablename);已弃用
        Table table = init().getTable(tablename);
        table.put(put);
        System.out.println(table);
    }

    // 获取原始数据
    public static void getNoDealData(String tableName){
        try {
            Table table= init().getTable(TableName.valueOf(tableName));
            Scan scan = new Scan();
            ResultScanner resutScanner = table.getScanner(scan);
            for(Result result: resutScanner){
                System.out.println("scan:  " + result);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    //获取数据
    public static void getData (String tableName,String rowKey,String colFamily,String col)throws IOException {
        Table table = connection.getTable(TableName.valueOf(tableName));
        Get get = new Get(rowKey.getBytes());
        get.addColumn(colFamily.getBytes(), col.getBytes());
        Result result = table.get(get);
        //System.out.println(new String(result.getValue(colFamily.getBytes(), col.getBytes())));
        System.out.println(new String(result.getValue(colFamily.getBytes(), col.getBytes())));
        table.close();
    }

    // 查询指定单cell内容
    public static String getCellData(String tableName, String rowKey, String colFamily, String col){
        try {
            Table table = init().getTable(TableName.valueOf(tableName));
            String result = null;
            Get get = new Get(rowKey.getBytes());
            if(!get.isCheckExistenceOnly()){
                get.addColumn(Bytes.toBytes(colFamily),Bytes.toBytes(col));
                Result res = table.get(get);
                byte[] resByte = res.getValue(Bytes.toBytes(colFamily), Bytes.toBytes(col));
                return result = Bytes.toString(resByte);
            }else{
                return result = "查询结果不存在";
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "出现异常";
    }

    //查询指定表名中所有的数据
    public static List<Vehicle> getAllData(String tableName){

        Table table = null;
        List<Vehicle> list = new ArrayList<Vehicle>();
        try {
            table = init().getTable(TableName.valueOf(tableName));
            ResultScanner results = table.getScanner(new Scan());
            Vehicle vehicle = null;
            for (Result result : results){
                String id = new String(result.getRow());
                System.out.println("车牌号:" + new String(result.getRow()));
                vehicle = new Vehicle();
                for(Cell cell : result.rawCells()){
                    String row = Bytes.toString(cell.getRowArray(), cell.getRowOffset(), cell.getRowLength());
                    //String family =  Bytes.toString(cell.getFamilyArray(),cell.getFamilyOffset(),cell.getFamilyLength());
                    String colName = Bytes.toString(cell.getQualifierArray(),cell.getQualifierOffset(),cell.getQualifierLength());
                    String value = Bytes.toString(cell.getValueArray(), cell.getValueOffset(), cell.getValueLength());
                    vehicle.setVehicle_id(row);
                    if(colName.equals("vehicle_id")){
                        vehicle.setVehicle_type(value);
                    }
                    if(colName.equals("vehicle_longitude")){
                        vehicle.setVehicle_longitude(value);
                    }
                    if (colName.equals("vehicle_latitude")){
                        vehicle.setVehicle_latitude(value);
                    }
                }
                list.add(vehicle);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list;
    }


     // 根据rowkey 进行查询
     public static Vehicle getDataByRowKey(String tableName, String rowKey) throws IOException {

         Table table = init().getTable(TableName.valueOf(tableName));
         Get get = new Get(rowKey.getBytes());
         Vehicle vehicle = new Vehicle();
         vehicle.setVehicle_id(rowKey);
         //先判断是否有此条数据
         if(!get.isCheckExistenceOnly()){
             Result result = table.get(get);
             for (Cell cell : result.rawCells()){
                 String colName = Bytes.toString(cell.getQualifierArray(),cell.getQualifierOffset(),cell.getQualifierLength());
                 String value = Bytes.toString(cell.getValueArray(), cell.getValueOffset(), cell.getValueLength());
                 if(colName.equals("vehicle_type")){
                     vehicle.setVehicle_type(value);
                 }
                 if(colName.equals("vehicle_longitude")){
                     vehicle.setVehicle_longitude(value);
                 }
                 if (colName.equals("vehicle_latitude")){
                     vehicle.setVehicle_latitude(value);
                 }
             }
         }
         return vehicle;
     }

    //删除表
    public static void deleteTable(String tableName){
        try {
            TableName tablename = TableName.valueOf(tableName);
            Admin admin = init().getAdmin();
            admin.disableTable(tablename);
            admin.deleteTable(tablename);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //删除指定cell数据
    public static void deleteByRowKey(String tableName, String rowKey) throws IOException {
        Table table = init().getTable(TableName.valueOf(tableName));
        Delete delete = new Delete(Bytes.toBytes(rowKey));
        //删除指定列
        //delete.addColumns(Bytes.toBytes("contact"), Bytes.toBytes("email"));
        table.delete(delete);
    }
}



