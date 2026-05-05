package az.developia.demo.Repository;

import az.developia.demo.Entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RoleRepo extends JpaRepository<RoleEntity, Long> {

    @Transactional
    @Modifying
    @Query(value = "insert into user_roles(user_id, role_id) select ?1, id from roles where customer=1", nativeQuery = true)
    void assignCustomerRoles(Long userId);

    @Transactional
    @Modifying
    @Query(value = "insert into user_roles(user_id, role_id) select ?1, id from roles where seller=1", nativeQuery = true)
    void assignSellerRoles(Long userId);

    @Transactional
    @Modifying
    @Query(value = "insert into user_roles(user_id, role_id) select ?1, id from roles where admin=1", nativeQuery = true)
    void assignAdminRoles(Long userId);

    @Query(value = "SELECT COUNT(r) > 0 FROM RoleEntity r WHERE r.user.id = :userId AND r.roleName = :roleName",nativeQuery = true)
    boolean existsByUserIdAndRoleName(@Param("userId") Long userId, @Param("roleName") String roleName);
    @Modifying
    @Query(value = "DELETE FROM user_roles WHERE user_id = :userId", nativeQuery = true)
    void deleteByUserId(Long userId);
}