package com.vrv.VRV.Util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.vrv.VRV.Service.CustomUserDetails;

@Component
public class AuthToken {

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private CustomUserDetails customUserDetails;

  public Authentication authenticate(String username, String password) {
    UserDetails userDetails = customUserDetails.loadUserByUsername(username);
    if(userDetails == null){
      throw new BadCredentialsException("Invalid Username");
    }
    if(!passwordEncoder.matches(password, userDetails.getPassword())){
      throw new BadCredentialsException("Invalid Password");
    }
    return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
  }
}

