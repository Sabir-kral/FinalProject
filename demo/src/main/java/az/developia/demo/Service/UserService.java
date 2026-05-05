package az.developia.demo.Service;

import az.developia.demo.Entity.UserEntity;
import az.developia.demo.Exception.CustomException;
import az.developia.demo.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;

    public void isUserExists(String username) {
        if (userRepo.findByUsername(username).isPresent()) {
            throw new CustomException("User already exists", "Bad Request", 400);
        }
    }

    public UserEntity getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName(); 
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

