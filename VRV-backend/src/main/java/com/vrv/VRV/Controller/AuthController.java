package com.vrv.VRV.Controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.vrv.VRV.Modal.LoginForn;
import com.vrv.VRV.Modal.Role;
import com.vrv.VRV.Modal.User;
import com.vrv.VRV.Response.AuthResponse;
import com.vrv.VRV.Service.UserService;
import com.vrv.VRV.Util.AuthResponseProvider;
import com.vrv.VRV.Util.UniqueIdGenerator;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthResponseProvider authResponse;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Signup method
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody User user) {
        try {
            User savedUser = new User();
            savedUser.setId(UniqueIdGenerator.generateUniqueId());
            savedUser.setName(user.getName());
            savedUser.setEmail(user.getEmail());
            savedUser.setPassword(passwordEncoder.encode(user.getPassword()));
            savedUser.setRole(Role.VIEWER);
            savedUser.setFiles(new ArrayList<>());
            User newUser = userService.saveUser(savedUser);
            return authResponse.getAuthResponse(newUser.getEmail(), user.getPassword());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Login method
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginForn loginForm) {
        String email = loginForm.getEmail();
        String password = loginForm.getPassword();
        try {
            User user = userService.findUserByEmail(email);
            if(passwordEncoder.matches(password, user.getPassword())){
            System.out.println("HELLO");
              return authResponse.getAuthResponse(email,password);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
