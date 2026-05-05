package az.developia.demo.Repository;

import az.developia.demo.Entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepo extends JpaRepository<CustomerEntity,Long> {
    Optional<CustomerEntity> findByUsername(String username);
}
