package com.brunopiovan.chat_spring.repository;

import com.brunopiovan.chat_spring.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndRecipientOrRecipientAndSender(
        String senderUsername, String recipientUsername,
        String recipientUsername2, String senderUsername2
    );
}
