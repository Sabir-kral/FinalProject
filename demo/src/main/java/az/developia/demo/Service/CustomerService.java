package az.developia.demo.Service;

import az.developia.demo.Entity.CustomerEntity;
import az.developia.demo.Entity.UserEntity;
import az.developia.demo.Mapper.CustomerMapper;
import az.developia.demo.Repository.CustomerRepo;
import az.developia.demo.Repository.RoleRepo;
import az.developia.demo.Repository.UserRepo;
import az.developia.demo.Repository.ProductRepo;
import az.developia.demo.Request.CustomerRequest;
import az.developia.demo.Response.CustomerResponse;
import az.developia.demo.Response.MessageResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepo repo;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final ProductRepo productRepo;

    @Transactional
    public CustomerResponse register(CustomerRequest request) {
        userService.isUserExists(request.getUsername());
        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        UserEntity savedUser = userRepo.save(user);

        CustomerEntity customer = new CustomerEntity();
        customer.setName(request.getName());
        customer.setSurname(request.getSurname());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setUsername(request.getUsername());
        customer.setUser(savedUser);

        CustomerEntity savedCustomer = repo.save(customer);
        roleRepo.assignCustomerRoles(savedUser.getId());

        return CustomerMapper.toDTO(savedCustomer);
    }

    @Transactional
    public void delete() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        CustomerEntity customer = repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer Not Found"));

        UserEntity user = customer.getUser();
        if (user != null) {
            roleRepo.deleteByUserId(user.getId());
            productRepo.deleteByUserId(user.getId());
        }
        repo.delete(customer);
        if (user != null) {
            userRepo.delete(user);
        }
    }

    @Transactional
    public MessageResponse updateCustomerProfile(CustomerRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        CustomerEntity customer = repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        UserEntity userEntity = customer.getUser();

        customer.setName(request.getName());
        customer.setSurname(request.getSurname());
        customer.setEmail(request.getEmail());
        customer.setUsername(request.getUsername());

        if(request.getPassword() != null && !request.getPassword().isEmpty()){
            String encodedPass = passwordEncoder.encode(request.getPassword());
            customer.setPassword(encodedPass);
            userEntity.setPassword(encodedPass);
        }
        userEntity.setUsername(request.getUsername());

        repo.save(customer);
        userRepo.save(userEntity);

        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setMessage("Customer Updated. Qeyd: İstifadəçi adı dəyişdiyi üçün yenidən login olmalısınız.");
        return messageResponse;
    }

    @Transactional
    public void deleteById(Long id) {
        CustomerEntity customer = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("İstifadəçi tapılmadı: ID " + id));

        try {
            UserEntity user = customer.getUser();

            if (user != null) {
                // Əlaqəli bütün asılılıqları (rollar və məhsullar) təmizləyirik
                roleRepo.deleteByUserId(user.getId());
                productRepo.deleteByUserId(user.getId());
            }

            repo.delete(customer);

            if (user != null) {
                userRepo.delete(user);
            }

            repo.flush();
        } catch (Exception e) {
            throw new RuntimeException("Silinmə zamanı xəta: " + e.getMessage());
        }
    }

    @Transactional
    public MessageResponse updateCustomerByAdmin(Long id, CustomerRequest request) {
        CustomerEntity customer = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("İstifadəçi tapılmadı: ID " + id));

        UserEntity userEntity = customer.getUser();

        if (request.getUsername() != null) {
            customer.setUsername(request.getUsername());
            if (userEntity != null) {
                userEntity.setUsername(request.getUsername());
            }
        }
        if (request.getEmail() != null) {
            customer.setEmail(request.getEmail());
        }
        if (request.getName() != null) {
            customer.setName(request.getName());
        }
        if (request.getSurname() != null) {
            customer.setSurname(request.getSurname());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            String encodedPass = passwordEncoder.encode(request.getPassword());
            customer.setPassword(encodedPass);
            if (userEntity != null) {
                userEntity.setPassword(encodedPass);
            }
        }

        repo.save(customer);
        if (userEntity != null) {
            userRepo.save(userEntity);
        }

        MessageResponse messageResponse = new MessageResponse();
        messageResponse.setMessage("İstifadəçi uğurla yeniləndi");
        return messageResponse;
    }

    public CustomerResponse profile(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        CustomerEntity customer = repo.findByUsername(username).orElseThrow(()->new RuntimeException("Not Found"));
        return CustomerMapper.toDTO(customer);
    }

    public List<CustomerResponse> getAll(){
        return CustomerMapper.toDTOList(repo.findAll());
    }
}