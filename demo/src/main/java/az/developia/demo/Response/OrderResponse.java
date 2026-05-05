package az.developia.demo.Response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String customerName;
    private List<String> productNames;
    private Double totalAmount;
    private String status;
    private LocalDateTime orderDate;
}