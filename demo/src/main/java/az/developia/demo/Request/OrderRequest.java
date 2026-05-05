package az.developia.demo.Request;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private Long customerId;
    private List<Long> productIds;
}