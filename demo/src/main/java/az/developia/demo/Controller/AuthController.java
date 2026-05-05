package az.developia.demo.Controller;

import az.developia.demo.Entity.UserEntity;
import az.developia.demo.Repository.UserRepo;
import az.developia.demo.Request.LoginRequest;
import az.developia.demo.Response.LoginResponse;
import az.developia.demo.Service.CustomUserDetailsService;
import az.developia.demo.Utility.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepo userRepo;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
            ));
        }catch (BadCredentialsException e) {
            throw new RuntimeException("Daxil edilen melumatlar yanlisdir");
        }

        UserEntity users = userRepo.findByUsername(request.getUsername()).orElseThrow(()->new RuntimeException("Not Found"));

        UserDetails user = userDetailsService.loadUserByUsername(request.getUsername());
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return new LoginResponse(users.getId(), accessToken,request.getUsername(),users.getRoles());
    }
}