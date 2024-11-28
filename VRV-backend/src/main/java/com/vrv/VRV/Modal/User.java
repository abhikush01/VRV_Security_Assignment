package com.vrv.VRV.Modal;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "users")
public class User {

  @Id
  private String id; 
  private String name;
  private String email;

  @Enumerated(EnumType.STRING)
  private Role role;

  @JsonProperty(access = Access.WRITE_ONLY)
  private String password;

  @OneToMany(mappedBy = "creator", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
  private List<File> files;
}
