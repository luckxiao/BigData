package com.weiming.xiguang;

public class Vehicle {

    private String vehicle_id;
    private String vehicle_type;
    private String vehicle_longitude;
    private String vehicle_latitude;


    public Vehicle(String vehicle_id, String vehicle_type, String vehicle_longitude, String vehicle_latitude) {
        this.vehicle_id = vehicle_id;
        this.vehicle_type = vehicle_type;
        this.vehicle_longitude = vehicle_longitude;
        this.vehicle_latitude = vehicle_latitude;
    }

    public Vehicle(){

    }

    public String getVehicle_id() {
        return vehicle_id;
    }

    public String getVehicle_type() {
        return vehicle_type;
    }

    public String getVehicle_longitude() {
        return vehicle_longitude;
    }

    public String getVehicle_latitude() {
        return vehicle_latitude;
    }

    public void setVehicle_id(String vehicle_id) {
        this.vehicle_id = vehicle_id;
    }

    public void setVehicle_type(String vehicle_type) {
        this.vehicle_type = vehicle_type;
    }

    public void setVehicle_longitude(String vehicle_longitude) {
        this.vehicle_longitude = vehicle_longitude;
    }

    public void setVehicle_latitude(String vehicle_latitude) {
        this.vehicle_latitude = vehicle_latitude;
    }

    @Override
    public String toString() {
        return "Vehicle{" +
                "vehicle_id='" + vehicle_id + '\'' +
                ", vehicle_type='" + vehicle_type + '\'' +
                ", vehicle_longitude='" + vehicle_longitude + '\'' +
                ", vehicle_latitude='" + vehicle_latitude + '\'' +
                '}';
    }
}