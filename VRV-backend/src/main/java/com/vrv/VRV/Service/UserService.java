package com.vrv.VRV.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vrv.VRV.Authentication.JwtProvider;
import com.vrv.VRV.Modal.Role;
import com.vrv.VRV.Modal.User;
import com.vrv.VRV.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
    }

    public User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User promoteToCreator(String userId) {
        User user = userRepository.findById(userId)
                                  .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.CREATOR);
        return userRepository.save(user);
    }

    public boolean deleteUser(String userId) {
        userRepository.deleteById(userId);
        return true;
    }

    public User findUserProfileByJwt(String jwt) throws Exception {
        jwt = jwt.substring(7);
        String email = JwtProvider.getEmailFromToken(jwt);
        return findUserByEmail(email);
  }
}
