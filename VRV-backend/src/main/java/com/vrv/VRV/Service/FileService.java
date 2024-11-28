package com.vrv.VRV.Service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.vrv.VRV.Modal.File;
import com.vrv.VRV.Modal.FileForm;
import com.vrv.VRV.Repository.FileRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private Cloudinary cloudinary;

    // Create a new file
    public File createFile(File file) {
        return fileRepository.save(file);
    }

    // Retrieve all files
    public List<File> getAllFiles() {
        return fileRepository.findAll();
    }

    // Retrieve a file by ID
    public File getFileById(String fileId) {
        return fileRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("File not found with ID: " + fileId));
    }

    // Update a file by ID
    public File updateFile(String fileId, FileForm updatedFile) {
        File existingFile = fileRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("File not found with ID: " + fileId));

        existingFile.setName(updatedFile.getName());
        return fileRepository.save(existingFile);
    }

    // Delete a file by ID
    public boolean deleteFile(String fileId) {
        if (!fileRepository.existsById(fileId)) {
            throw new EntityNotFoundException("File not found with ID: " + fileId);
        }
        fileRepository.deleteById(fileId);
        return true;
    }

    // Generate URL from public ID
    public String getUrlFromPublicId(String publicId, boolean isImage) {
        if (isImage) {
            // Generate URL with transformations for images
            return cloudinary.url().transformation(
                new Transformation<>().width(500)
                    .height(500)
                    .crop("fill")
            ).generate(publicId);
        } else {
            // Generate URL directly for non-image files (e.g., PDFs)
            return cloudinary.url().generate(publicId);
        }
    }

    // Upload file to Cloudinary
    public String uploadFile(MultipartFile file, String fileId, boolean isImage) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        try {
            byte[] data = file.getBytes(); // Read file content
            cloudinary.uploader().upload(data, ObjectUtils.asMap(
                "public_id", fileId
            ));
            return getUrlFromPublicId(fileId, isImage);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Cloudinary", e);
        }
    }
}
