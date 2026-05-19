package az.developia.demo.Mapper;

import az.developia.demo.Entity.CartEntity;
import az.developia.demo.Response.CartResponse;
import az.developia.demo.Response.ProductResponse; // Bunu import etdiyindən əmin ol

import java.util.List;
import java.util.stream.Collectors;

public class CartMapper {
    public static CartResponse toDTO(CartEntity entity) {
        CartResponse cartResponse = new CartResponse();
        cartResponse.setId(entity.getId());
        cartResponse.setQuantity(entity.getQuantity());

        if (entity.getProduct() != null) {
            ProductResponse productDTO = new ProductResponse();
            productDTO.setId(entity.getProduct().getId());
            productDTO.setBrand(entity.getProduct().getBrand());
            productDTO.setModel(entity.getProduct().getModel());
            productDTO.setPrice(entity.getProduct().getPrice());
            productDTO.setImage(entity.getProduct().getImage());

            cartResponse.setProduct(productDTO);
        }

        return cartResponse;
    }

    public static List<CartResponse> toDTOList(List<CartEntity> entities) {
        return entities.stream().map(CartMapper::toDTO).collect(Collectors.toList());
    }
}