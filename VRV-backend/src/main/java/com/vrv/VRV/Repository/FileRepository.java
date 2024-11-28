package com.vrv.VRV.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vrv.VRV.Modal.File;
import com.vrv.VRV.Modal.User;

@Repository
public interface FileRepository extends JpaRepository<File, String> {
    List<File> findByCreator(User creator);
}
