package az.developia.demo.Repository;

import az.developia.demo.Entity.CartEntity;
import az.developia.demo.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartEntity, Long> {
    List<CartEntity> findAllByUser(UserEntity user);
    Optional<CartEntity> findByUserAndProduct_Id(UserEntity user, Long productId);
}