package com.brunopiovan.chat_spring.repository;

import com.brunopiovan.chat_spring.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
    "(m.sender = :senderUsername AND m.recipient = :recipientUsername) " +
    "OR (m.sender = :recipientUsername AND m.recipient = :senderUsername) " +
    "ORDER BY m.time ASC")
    List<Message> findConversationMessages(
    @Param("senderUsername") String senderUsername,
    @Param("recipientUsername") String recipientUsername
    );
}
