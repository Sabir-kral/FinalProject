package az.developia.demo.Repository;

import az.developia.demo.Entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RoleRepo extends JpaRepository<RoleEntity, Long> {

    @Transactional
    @Modifying
    @Query(value = "insert into user_roles(user_id, role_id) select ?1, id from roles where customer=1", nativeQuery = true)
    void assignCustomerRoles(Long userId);
}