package az.developia.demo.Controller;

import az.developia.demo.Request.CustomerRequest;
import az.developia.demo.Response.CustomerResponse;
import az.developia.demo.Response.MessageResponse;
import az.developia.demo.Service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CustomerController {
    private final CustomerService customerService;

    @PostMapping("/register")
    public CustomerResponse register(@RequestBody CustomerRequest request) {
        return customerService.register(request);
    }

    @GetMapping("/profile")
    public CustomerResponse getProfile() {
        return customerService.profile();
    }

    @PutMapping("/profile")
    public MessageResponse updateProfile(@RequestBody CustomerRequest request) {
        return customerService.updateCustomerProfile(request);
    }

    @DeleteMapping("/profile")
    public void deleteAccount() {
        customerService.delete();
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<CustomerResponse> getAllCustomers() {
        return customerService.getAll();
    }

    // SİLME - URL dəqiqləşdirildi
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteCustomerByAdmin(@PathVariable Long id) {
        customerService.deleteById(id);
    }

    // YENİLƏMƏ - URL dəqiqləşdirildi
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public MessageResponse updateCustomerByAdmin(@PathVariable Long id, @RequestBody CustomerRequest request) {
        return customerService.updateCustomerByAdmin(id, request);
    }
}