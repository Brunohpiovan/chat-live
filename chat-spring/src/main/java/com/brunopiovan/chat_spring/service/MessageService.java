package com.brunopiovan.chat_spring.service;
import com.brunopiovan.chat_spring.repository.MessageRepository;


import com.brunopiovan.chat_spring.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public List<Message> getPrivateMessages(String senderUsername, String recipientUsername) {
        try {
            return messageRepository.findBySenderAndRecipientOrRecipientAndSender(senderUsername, recipientUsername,recipientUsername, senderUsername);
        } catch (Exception e) {
            System.err.println("Erro ao buscar mensagens privadas: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
        
    }
}
