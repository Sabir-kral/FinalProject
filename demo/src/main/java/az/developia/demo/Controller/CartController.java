package az.developia.demo.Controller;

import az.developia.demo.Entity.CartEntity;
import az.developia.demo.Response.CartResponse;
import az.developia.demo.Service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
    public ResponseEntity<List<CartResponse>> getMyCart() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(cartService.getUserCart(username));
    }
    // Səbətdə say tənzimləmə
    @PutMapping("/update")
    public ResponseEntity<?> updateQuantity(@RequestParam Long productId,
                                            @RequestParam Integer quantity,
                                            Principal principal) {
        cartService.updateQuantity(productId, quantity, principal.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestParam Long productId,
                                            Principal principal) {
        cartService.removeItem(productId, principal.getName());
        return ResponseEntity.ok().build();
    }
}