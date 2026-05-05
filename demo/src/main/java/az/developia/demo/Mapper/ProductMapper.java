package az.developia.demo.Mapper;

import az.developia.demo.Entity.ProductEntity;
import az.developia.demo.Request.ProductRequest;
import az.developia.demo.Response.ProductResponse;

import java.util.List;
import java.util.stream.Collectors;

public class ProductMapper {

    public static ProductResponse toDTO(ProductEntity entity) {
        ProductResponse response = new ProductResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setDescription(entity.getDescription());
        response.setBrand(entity.getBrand());
        response.setPrice(entity.getPrice());
        response.setDiscountRate(entity.getDiscountRate());
        response.setStockCount(entity.getStockCount());
        response.setDiscountedPrice(entity.DiscountedPrice());
        if (entity.getCategory() != null) {
            response.setCategoryName(entity.getCategory().getName());
        }

        return response;
    }
    public static List<ProductResponse> toDTOList(List<ProductEntity> entities) {
        return entities.stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }
}