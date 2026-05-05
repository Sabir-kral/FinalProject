package az.developia.demo.Request;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private String brand;
    private Double price;
    private Double discountRate;
    private Integer stockCount;
    private String categoryName;
}