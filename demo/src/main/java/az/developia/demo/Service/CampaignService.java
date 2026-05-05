package az.developia.demo.Service;

import az.developia.demo.Entity.ProductEntity;
import az.developia.demo.Repository.ProductRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {
    private final ProductRepo productRepo;

    @Transactional
    public void applyCampaignToCategoryName(String categoryName, Double rate) {
        List<ProductEntity> products = productRepo.findByCategoryNameIgnoreCase(categoryName);
        if (products.isEmpty()) {
            throw new RuntimeException("Bu adda kateqoriya və ya məhsul tapılmadı: " + categoryName);
        }
        for (ProductEntity p : products) {
            p.setDiscountRate(rate);
        }
        productRepo.saveAll(products);
    }
}