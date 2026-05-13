package az.developia.demo.Service;

import az.developia.demo.Entity.*;
import az.developia.demo.Exception.CustomException;
import az.developia.demo.Mapper.ProductMapper;
import az.developia.demo.Repository.*;
import az.developia.demo.Request.ProductRequest;
import az.developia.demo.Response.ProductResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final RoleRepo roleRepo;
    private final UserRepo userRepo;

    @Transactional
    public ProductResponse addProduct(ProductRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepo.findByUsername(username)
                .orElseThrow(() -> new CustomException("İstifadəçi tapılmadı", "Bad request", 400));

        ProductEntity productEntity = new ProductEntity();
        productEntity.setBrand(request.getBrand());
        productEntity.setModel(request.getModel());
        productEntity.setDescription(request.getDescription());
        productEntity.setPrice(request.getPrice());
        productEntity.setRating(request.getRating());
        productEntity.setImage(request.getImage());
        productEntity.setUser(user);

        if (request.getCategoryName() != null && !request.getCategoryName().isEmpty()) {
            CategoryEntity category = categoryRepo.findByNameIgnoreCase(request.getCategoryName())
                    .orElseGet(() -> {
                        CategoryEntity newCategory = new CategoryEntity();
                        newCategory.setName(request.getCategoryName());
                        return categoryRepo.save(newCategory);
                    });
            productEntity.setCategory(category);
        }

        boolean isAlreadySeller = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_SELLER"));
        if (!isAlreadySeller) {
            roleRepo.assignSellerRoles(user.getId());
        }

        ProductEntity saved = productRepo.save(productEntity);
        return ProductMapper.toDTO(saved);
    }

//    public List<ProductEntity> getFilteredProducts(String name, String category, Integer rating,
//                                                   Double minPrice, Double maxPrice, String sortType) {
//
//
//        String searchName = (name == null || name.isBlank()) ? null : name;
//        String searchCat = (category == null || category.isBlank() || category.equals("all")) ? null : category;
//
//
//        Sort sort;
//        switch (sortType) {
//            case "price_asc":
//                sort = Sort.by(Sort.Direction.ASC, "price");
//                break;
//            case "price_desc":
//                sort = Sort.by(Sort.Direction.DESC, "price");
//                break;
//            case "rating_desc":
//                sort = Sort.by(Sort.Direction.DESC, "rating");
//                break;
//            default:
//
//                break;
//        }
//
//        return productRepo.searchProducts(searchName, searchCat, rating, minPrice, maxPrice, sort);
//    }
    public List<ProductResponse> getProductsByLoggedInUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ProductMapper.toDTOList(productRepo.findByUserUsername(username));
    }

    public List<ProductResponse> getAllProducts() {
        return ProductMapper.toDTOList(productRepo.findAll());
    }

    public ProductResponse findById(Long id) {
        ProductEntity product = productRepo.findById(id).orElseThrow(() -> new RuntimeException("Tapılmadı"));
        return ProductMapper.toDTO(product);
    }



    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        ProductEntity productEntity = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Məhsul tapılmadı"));
        mapRequestToEntity(request, productEntity);
        productEntity.setImage(request.getImage());
        return ProductMapper.toDTO(productRepo.save(productEntity));
    }

    public void deleteProduct(Long id) {
        ProductEntity product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Məhsul tapılmadı"));
        productRepo.delete(product);
    }

    private void mapRequestToEntity(ProductRequest request, ProductEntity productEntity) {
        productEntity.setBrand(request.getBrand());
        productEntity.setModel(request.getModel());
        productEntity.setDescription(request.getDescription());
        productEntity.setRating(request.getRating());
        productEntity.setPrice(request.getPrice());

        if (request.getCategoryName() != null && !request.getCategoryName().isEmpty()) {
            CategoryEntity category = categoryRepo.findByNameIgnoreCase(request.getCategoryName())
                    .orElseGet(() -> {
                        CategoryEntity newCategory = new CategoryEntity();
                        newCategory.setName(request.getCategoryName());
                        return categoryRepo.save(newCategory);
                    });
            productEntity.setCategory(category);
        }
    }
}