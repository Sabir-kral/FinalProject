package az.developia.demo.Response;

import az.developia.demo.Entity.RoleEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Long id;
    private String accessToken;
    private String username;
    private Set<RoleEntity> roles;
}
