package com.brunopiovan.chat_spring.controller;

import com.brunopiovan.chat_spring.model.User;
import com.brunopiovan.chat_spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UploadController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        // Defina o diretório de upload
        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        Path uploadPath = Paths.get(uploadDir);

        // Crie o diretório se ele não existir
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Falha ao criar diretório de uploads", e);
        }

        // Defina o caminho completo do arquivo
        String filePath = uploadDir + file.getOriginalFilename();
        File dest = new File(filePath);

        // Tente salvar o arquivo
        try {
            file.transferTo(dest);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar o arquivo", e);
        }

        // Prepare a resposta
        Map<String, String> response = new HashMap<>();
        response.put("url", "/uploads/" + file.getOriginalFilename());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/user")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Salve o usuário no banco de dados
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
         // Recupere todos os usuários do banco de dados 
         List<User> users = userRepository.findAll(); 
         return ResponseEntity.ok(users); }
}
