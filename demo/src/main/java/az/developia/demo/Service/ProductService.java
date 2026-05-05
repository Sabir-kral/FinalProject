package az.developia.demo.Service;

import az.developia.demo.Entity.*;
import az.developia.demo.Exception.CustomException;
import az.developia.demo.Mapper.ProductMapper;
import az.developia.demo.Repository.*;
import az.developia.demo.Request.ProductRequest;
import az.developia.demo.Response.ProductResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
                .orElseThrow(() -> new CustomException("User not logined", "Bad request", 400));

        ProductEntity productEntity = new ProductEntity();
        mapRequestToEntity(request, productEntity);

        productRepo.save(productEntity);

        boolean isAlreadySeller = false;
        for (RoleEntity role : user.getRoles()) {
            if (role.getName().equals("ROLE_SELLER")) {
                isAlreadySeller = true;
                break;
            }
        }

        if (!isAlreadySeller) {
            roleRepo.assignSellerRoles(user.getId());
        }

        if (!isAlreadySeller) {
            roleRepo.assignSellerRoles(user.getId());
        }

        return ProductMapper.toDTO(productEntity);
    }
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        ProductEntity productEntity = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        mapRequestToEntity(request, productEntity);

        return ProductMapper.toDTO(productRepo.save(productEntity));
    }

    public void deleteProduct(Long id) {
        ProductEntity product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepo.delete(product);
    }

    public List<ProductResponse> getAllProducts() {
        return ProductMapper.toDTOList(productRepo.findAll());
    }

    public List<ProductResponse> searchProducts(String name, String category, Double minPrice, Double maxPrice) {
        if (name == null && category == null && minPrice == null && maxPrice == null) {
            return getAllProducts();
        }

        List<ProductEntity> products = productRepo.searchProducts(
                name != null ? name : "",
                category,
                minPrice,
                maxPrice
        );
        return ProductMapper.toDTOList(products);
    }

    private void mapRequestToEntity(ProductRequest request, ProductEntity productEntity) {
        productEntity.setName(request.getName());
        productEntity.setDescription(request.getDescription());
        productEntity.setBrand(request.getBrand());
        productEntity.setPrice(request.getPrice());
        productEntity.setDiscountRate(request.getDiscountRate());
        productEntity.setStockCount(request.getStockCount());

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