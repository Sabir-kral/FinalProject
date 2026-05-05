package az.developia.demo.Mapper;

import az.developia.demo.Entity.CategoryEntity;
import az.developia.demo.Entity.CustomerEntity;
import az.developia.demo.Response.CategoryResponse;
import az.developia.demo.Response.CustomerResponse;

import java.util.List;
import java.util.stream.Collectors;

public class CategoryMapper {
    public static CategoryResponse toDTO(CategoryEntity entity){
        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setId(entity.getId());
        categoryResponse.setName(entity.getName());

        return categoryResponse;
    }
    public static List<CategoryResponse> toDTOList(List<CategoryEntity> entities){
        return entities.stream().map(CategoryMapper::toDTO).collect(Collectors.toList());
    }
}
