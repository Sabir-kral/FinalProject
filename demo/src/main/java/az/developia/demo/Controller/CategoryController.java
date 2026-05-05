package az.developia.demo.Controller;

import az.developia.demo.Request.CategoryRequest;
import az.developia.demo.Response.CategoryResponse;
import az.developia.demo.Service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")

public class CategoryController {
    private final CategoryService categoryService;


    @PutMapping("/{name}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    public CategoryResponse update(@PathVariable String name, @RequestBody CategoryRequest categoryRequest) {
        return categoryService.updateByName(name, categoryRequest);
    }

    @DeleteMapping("/{name}")
    @PreAuthorize("hasAuthority('ROLE_SELLER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String name) {
        categoryService.deleteByName(name);
    }
}