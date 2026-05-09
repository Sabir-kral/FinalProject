package az.developia.demo.Request;

import lombok.Data;

@Data
public class ProductRequest {
    private String brand;
    private String model;
    private String description;
    private Double price;
    private Integer rating;
    private String categoryName;
    private String image;
}