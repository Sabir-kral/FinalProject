package az.developia.demo.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
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
    private String name;
    private String description;
    private String brand;
    private Double price;
    private Double discountRate;
    private Integer stockCount;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    public Double DiscountedPrice() {
        if (this.discountRate == null || this.discountRate <= 0) {
            return this.price;
        }
        return this.price - (this.price * this.discountRate / 100);
    }
}