package az.developia.demo.Response;

import az.developia.demo.Response.ProductResponse;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartResponse {
    private Long id;
    private Integer quantity;
    private ProductResponse product; // İçində məhsul detalları olan obyekt
}