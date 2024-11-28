package com.vrv.VRV.Util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.vrv.VRV.Authentication.JwtProvider;
import com.vrv.VRV.Response.AuthResponse;

@Component
public class AuthResponseProvider {

  @Autowired
  private AuthToken authToken;

  public ResponseEntity<AuthResponse> getAuthResponse(String email , String password){
        Authentication authentication = authToken.authenticate(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = JwtProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse();

        res.setMessage("Signup Success");
        res.setJwt(jwt);

        return new ResponseEntity<>(res,HttpStatus.CREATED);
  }
}

