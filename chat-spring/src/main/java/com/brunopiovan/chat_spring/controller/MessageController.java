package com.brunopiovan.chat_spring.controller;


import com.brunopiovan.chat_spring.model.Message;
import com.brunopiovan.chat_spring.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
public class MessageController {

    @Autowired
    private MessageService messageService;

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public Message send(Message message) {
        message.setTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        return messageService.saveMessage(message);
    }

    @GetMapping("/api/messages")
    @ResponseBody
    public List<Message> getAllMessages() {
        return messageService.getAllMessages();
    }

    @GetMapping("/chat")
    public String chat() {
        return "chat"; // Nome do arquivo HTML sem a extensão
    }
}
