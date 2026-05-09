package az.developia.demo.Controller;

import az.developia.demo.Entity.ProductEntity;
import az.developia.demo.Request.ProductRequest;
import az.developia.demo.Response.ProductResponse;
import az.developia.demo.Service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;


    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse add(@RequestBody ProductRequest request) {

        return productService.addProduct(request);
    }

    
    @GetMapping("/all")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }


//    @GetMapping("/search")
//    public ResponseEntity<List<ProductEntity>> search(
//            @RequestParam(required = false) String name,
//            @RequestParam(required = false) String category,
//            @RequestParam(required = false) Integer rating,
//            @RequestParam(required = false) Double minPrice,
//            @RequestParam(required = false) Double maxPrice,
//            @RequestParam(required = false, defaultValue = "default") String sort) {
//
//        List<ProductEntity> results = productService
//                .getFilteredProducts(name, category, rating, minPrice, maxPrice, sort);
//        return ResponseEntity.ok(results);
//    }

    
    @GetMapping("/my-products")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<List<ProductResponse>> getMyProducts() {
        return ResponseEntity.ok(productService.getProductsByLoggedInUser());
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}