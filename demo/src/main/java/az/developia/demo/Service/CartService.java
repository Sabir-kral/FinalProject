package az.developia.demo.Service;

import az.developia.demo.Entity.CartEntity;
import az.developia.demo.Entity.ProductEntity;
import az.developia.demo.Entity.UserEntity;
import az.developia.demo.Mapper.CartMapper;
import az.developia.demo.Repository.CartRepository;
import az.developia.demo.Repository.ProductRepo;
import az.developia.demo.Repository.UserRepo;
import az.developia.demo.Response.CartResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepo productRepository;
    private final UserRepo userRepository;

    public void addToCart(Long productId, String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("İstifadəçi tapılmadı"));

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Məhsul tapılmadı"));

        Optional<CartEntity> existingItem = cartRepository.findByUserAndProduct_Id(user, productId);

        if (existingItem.isPresent()) {
            CartEntity cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + 1);
            cartRepository.save(cartItem);
        } else {
            CartEntity newItem = new CartEntity();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(1);
            cartRepository.save(newItem);
        }
    }

    public List<CartResponse> getUserCart(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("İstifadəçi tapılmadı"));
        return CartMapper.toDTOList(cartRepository.findAllByUser(user));
    }
    @Transactional
    public void updateQuantity(Long productId, Integer quantity, String username) {
        // İstifadəçinin səbətindəki həmin məhsulu tapırıq
        CartEntity cartItem = cartRepository.findByProductIdAndUserUsername(productId, username)
                .orElseThrow(() -> new RuntimeException("Səbətdə məhsul tapılmadı"));

        // Yeni sayı set edirik
        cartItem.setQuantity(quantity);
        cartRepository.save(cartItem);
    }

    // 2. Məhsulu səbətdən silmək
    @Transactional
    public void removeItem(Long productId, String username) {
        cartRepository.deleteByProductIdAndUserUsername(productId, username);
    }

}