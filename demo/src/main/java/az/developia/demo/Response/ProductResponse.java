package az.developia.demo.Response;

import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private String brand;
    private String model;
    private String name;
    private String description;
    private Double price;
    private Integer rating;
    private Double discountRate;
    private Integer stockCount;
    private String categoryName;
    private String image;
}