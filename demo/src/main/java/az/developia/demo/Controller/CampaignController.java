package az.developia.demo.Controller;

import az.developia.demo.Service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CampaignController {
    private final CampaignService campaignService;

    @PostMapping("/apply-by-name")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public void applyCampaign(@RequestParam String categoryName, @RequestParam Double rate) {
        campaignService.applyCampaignToCategoryName(categoryName, rate);
    }
}