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


        response.setBrand(entity.getBrand());
        response.setModel(entity.getModel());


        String combinedName = (entity.getBrand() != null ? entity.getBrand() : "") +
                " " +
                (entity.getModel() != null ? entity.getModel() : "");
        response.setName(combinedName.trim());

        response.setDescription(entity.getDescription());
        response.setRating(entity.getRating());
        response.setPrice(entity.getPrice());
        response.setDiscountRate(entity.getDiscountRate());
        response.setStockCount(entity.getStockCount());

        if (entity.getCategory() != null) {
            response.setCategoryName(entity.getCategory().getName());
        }


        // Məsələn: response.setImage("http://localhost:8080/api/files/download/" + entity.getImage());
        response.setImage(entity.getImage());

        return response;
    }
    public static List<ProductResponse> toDTOList(List<ProductEntity> entities) {
        return entities.stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }
}