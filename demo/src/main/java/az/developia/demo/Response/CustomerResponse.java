package az.developia.demo.Response;

import lombok.Data;

@Data
public class CustomerResponse {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String username;
    private String password;
}
