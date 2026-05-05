package az.developia.demo.Response;

import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String brand;
    private Double price;
    private Double discountedPrice;
    private Double discountRate;
    private Integer stockCount;
    private String categoryName;
}