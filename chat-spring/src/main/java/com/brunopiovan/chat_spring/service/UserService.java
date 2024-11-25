package com.brunopiovan.chat_spring.service;

import com.brunopiovan.chat_spring.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    public User createUser(String username, String profilePictureUrl) {
        User user = new User();
        user.setUsername(username);
        user.setProfilePictureUrl(profilePictureUrl);
        return user;
    }
}
