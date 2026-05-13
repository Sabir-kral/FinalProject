package az.developia.demo.Controller;

import az.developia.demo.Entity.CartEntity;
import az.developia.demo.Service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<String> addToCart(@PathVariable Long productId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        cartService.addToCart(productId, username);
        return ResponseEntity.ok("Məhsul səbətə əlavə edildi");
    }

    @GetMapping("/my-cart")
    public ResponseEntity<List<CartEntity>> getMyCart() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(cartService.getUserCart(username));
    }
}