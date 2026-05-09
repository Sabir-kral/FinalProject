package az.developia.demo.Repository;

import az.developia.demo.Entity.ProductEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<ProductEntity, Long> , JpaSpecificationExecutor<ProductEntity> {

    List<ProductEntity> findByCategoryId(Long categoryId);

    List<ProductEntity> findByModelContainingIgnoreCase(String model);
    List<ProductEntity> findByCategory_NameIgnoreCase(String categoryName);
    List<ProductEntity> findByUserUsername(String username);



    @Query("SELECT p FROM ProductEntity p WHERE " +
            "(:name IS NULL OR :name = '' OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(p.model) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:category IS NULL OR :category = '' OR :category = 'all' OR p.category.name = :category) AND " +
            "(:rating IS NULL OR p.rating >= :rating) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<ProductEntity> searchProducts(
            @Param("name") String name,
            @Param("category") String category,
            @Param("rating") Integer rating,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Sort sort);
}