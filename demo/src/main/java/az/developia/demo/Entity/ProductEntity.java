package az.developia.demo.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;
    private String description;
    private Double price;
    private Integer rating;
    private Double discountRate;
    private Integer stockCount;

    
    private String image;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private CategoryEntity category;

    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    
    public Double DiscountedPrice() {
        if (this.discountRate == null || this.discountRate <= 0) {
            return this.price;
        }
        return this.price - (this.price * this.discountRate / 100);
    }
}