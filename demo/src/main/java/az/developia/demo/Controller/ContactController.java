package az.developia.demo.Controller;

import az.developia.demo.Entity.ContactMessage;
import az.developia.demo.Repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
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
}