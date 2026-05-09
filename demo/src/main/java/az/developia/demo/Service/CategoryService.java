package az.developia.demo.Service;

import az.developia.demo.Entity.CategoryEntity;
import az.developia.demo.Mapper.CategoryMapper;
import az.developia.demo.Repository.CategoryRepo;
import az.developia.demo.Request.CategoryRequest;
import az.developia.demo.Response.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepo repository;

    public CategoryResponse save(CategoryRequest category) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setName(category.getName());
        repository.save(categoryEntity);
        return CategoryMapper.toDTO(categoryEntity);
    }

    public void deleteByName(String name) {
        CategoryEntity categoryEntity = repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Category Not Found with name: " + name));
        repository.delete(categoryEntity);
    }

    public CategoryResponse updateByName(String name, CategoryRequest details) {
        CategoryEntity cat = repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Category Not Found with name: " + name));
        cat.setName(details.getName());
        repository.save(cat);
        return CategoryMapper.toDTO(cat);
    }
    public List<CategoryResponse> getAll(){
        return CategoryMapper.toDTOList(repository.findAll());
    }
}