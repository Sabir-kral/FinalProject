package az.developia.demo.Controller;

import az.developia.demo.Entity.ContactMessage;
import az.developia.demo.Repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact") // JS-də də buna uyğun yazmalıyıq
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContactController {
    private final ContactRepository contactRepo;

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody ContactMessage message) {
        contactRepo.save(message);
        return ResponseEntity.ok("Mesajınız uğurla göndərildi!");
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<ContactMessage> getAllMessages() {
        return contactRepo.findAllByOrderBySentAtDesc();
    }

    // JS-də üstünə basanda işləməsi üçün findById
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ContactMessage> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contactRepo.findById(id).orElseThrow());
    }

    // Silmə düyməsi üçün
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}