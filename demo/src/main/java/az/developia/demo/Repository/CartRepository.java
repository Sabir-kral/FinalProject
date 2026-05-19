package az.developia.demo.Repository;

import az.developia.demo.Entity.CartEntity;
import az.developia.demo.Entity.UserEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartEntity, Long> {
    List<CartEntity> findAllByUser(UserEntity user);
    Optional<CartEntity> findByUserAndProduct_Id(UserEntity user, Long productId);
    Optional<CartEntity> findByProductIdAndUserUsername(Long productId, String username);

    // İstifadəçiyə görə məhsulu silmək
    void deleteByProductIdAndUserUsername(Long productId, String username);

    @Modifying
    @Transactional
    @Query("DELETE FROM CartEntity c WHERE c.product.id = :productId")
    void deleteByProductId(Long productId);
}