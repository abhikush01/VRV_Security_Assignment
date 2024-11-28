package com.vrv.VRV.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.vrv.VRV.Service.FileService;
import com.vrv.VRV.Service.UserService;
import com.vrv.VRV.Util.UniqueIdGenerator;
import com.vrv.VRV.Modal.File;
import com.vrv.VRV.Modal.FileForm;
import com.vrv.VRV.Modal.User;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private UserService userService;

    // Get all files (Accessible by Admin, Creator, Viewer)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'VIEWER')")
    public ResponseEntity<List<File>> getAllFiles() {
        try {
            List<File> files = fileService.getAllFiles();
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // Get a file by ID (Accessible by Admin, Creator, Viewer)
    @GetMapping("/{fileId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'VIEWER')")
    public ResponseEntity<File> getFileById(@PathVariable String fileId) {
        try {
            File file = fileService.getFileById(fileId);
            if (file == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(file);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Upload a new file (Accessible by Creator only)
    @PostMapping
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<File> uploadFile(@RequestParam("file") MultipartFile tempfile,
                                           @RequestParam("name") String name,
                                           @RequestHeader("Authorization") String jwt) {
        try {
            FileForm file = new FileForm(name,tempfile); 
          User user = userService.findUserProfileByJwt(jwt);
          File newfile = new File();
          newfile.setId(UniqueIdGenerator.generateUniqueId());
          newfile.setName(file.getName());
          if(file.getFile() != null &&  !file.getFile().isEmpty()){
            String id = UUID.randomUUID().toString();
            String fileUrl = fileService.uploadFile(file.getFile(), id ,false);
            newfile.setCloudinaryUrl(fileUrl);
          }
          newfile.setCreator(user);
          File uploadedFile = fileService.createFile(newfile);
            return ResponseEntity.ok(uploadedFile);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Update file details (Accessible by Creator only)
    @PutMapping("/{fileId}")
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<File> updateFile(@PathVariable String fileId,
                                           @RequestBody FileForm file) {
        try {
            File updatedFile = fileService.updateFile(fileId, file);
            if (updatedFile == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedFile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Delete a file by ID (Accessible by Creator only)
    @DeleteMapping("/{fileId}")
    @PreAuthorize("hasRole('CREATOR')")
    public ResponseEntity<String> deleteFile(@PathVariable String fileId) {
        try {
            boolean isDeleted = fileService.deleteFile(fileId);
            if (isDeleted) {
                return ResponseEntity.ok("File deleted successfully.");
            } else {
                return ResponseEntity.badRequest().body("File not found or cannot be deleted.");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting file: " + e.getMessage());
        }
    }
}
