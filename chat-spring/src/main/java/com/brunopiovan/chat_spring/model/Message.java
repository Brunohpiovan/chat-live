package com.brunopiovan.chat_spring.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;
    private String recipient;
    private String text;
    private String time;
    private String profilePicture;

    public Message() {
    }

    public Message(Long id, String sender, String recipient, String text, String time, String profilePicture) {
        this.id = id;
        this.sender = sender;
        this.recipient = recipient;
        this.text = text;
        this.time = time;
        this.profilePicture = profilePicture;
    }

    public Message(Long id, String sender, String text, String time, String profilePicture) {
        this.id = id;
        this.sender = sender;
        this.text = text;
        this.time = time;
        this.profilePicture = profilePicture;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}
