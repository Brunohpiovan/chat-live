let currentChatUser = null;
const user = JSON.parse(localStorage.getItem('user'));
const currentUsername = user ? user.username : null;

document.addEventListener('DOMContentLoaded', (event) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    const chatBox = document.getElementById('chatBox');
    const userList = document.getElementById('userList');
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('message');
    const emojiButton = document.getElementById('emoji-button');
    const emojiPicker = document.getElementById('emoji-picker');


    userList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const username = event.target.previousSibling.textContent.trim();
            startPrivateChat(username);
        }
    });
    

     function startPrivateChat(username) {
        currentChatUser = username;
        chatBox.innerHTML = '';
        loadPrivateMessages(currentUsername,currentChatUser); 
    
        document.querySelector('.chat-column h1').innerText = `Conversando com ${currentChatUser}`;
    }

    async function loadPrivateMessages(sender,recipient) {
        try {
        const response = await fetch(`/api/messages/private/${sender}/${recipient}`);
        console.log("response " , response);
        if (!response.ok) {
             throw new Error('Failed to fetch private messages: ' + response.statusText);
         }
         const messages = await response.json(); 
         console.log(messages);
         messages.forEach(appendMessage);
         } catch (error) {
        console.error('Erro ao buscar mensagens privadas:', error); }
    }


    emojiButton.addEventListener('click', () => {
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    });

    emojiPicker.addEventListener('emoji-click', (event) => {
        console.log('Emoji clicado:', event.detail);
        const emoji = event.detail.unicode;
        messageInput.value += emoji;
        emojiPicker.style.display = 'none';

    });

  

    function appendMessage(message) {
        if (message.recipient) {
            // Exibir somente se a conversa atual corresponde ao destinatário/remetente
            if (
                (message.sender === currentUsername && message.recipient === currentChatUser) ||
                (message.sender === currentChatUser && message.recipient === currentUsername)
            ) {
                displayMessage(message);
            }
        } else {
            // Exibir mensagens públicas apenas na aba geral
            if (!currentChatUser) {
                displayMessage(message);
            }
        }
    }

    function displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('mb-2');
        messageElement.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${message.profilePicture}" alt="Profile" class="rounded-circle mr-2" style="width: 30px; height: 30px;">
                <strong>${message.sender}</strong> <small class="text-muted ml-2">${message.time}</small>
            </div>
            <div>${message.text}</div>
        `;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function loadMessages() {
        const response = await fetch('/api/messages');
        const messages = await response.json();
        messages.forEach(appendMessage);
    }

    async function loadUsers() { 
        try { 
            const response = await fetch('/api/users'); 
            if (!response.ok) { 
                throw new Error('Failed to fetch users: ' + response.statusText); 
            } 
            const users = await response.json(); 
            
            users.forEach(user => { 
                const userItem = document.createElement('li'); 
                userItem.classList.add('list-group-item');
                userItem.classList.add('username-item');
                userItem.innerHTML = `
                ${user.username}
                <button class="btn btn-primary btn-sm ml-2">Conversar</button>
            `; 
                
                userList.appendChild(userItem); 
            }); 
        } catch (error) { 
            console.error('Erro ao buscar usuários:', error); 
        }
    }
    


    const sock = new SockJS('/chat-websocket');
    const stompClient = new StompJs.Client({
        webSocketFactory: () => sock,
        onConnect: (frame) => {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/messages', (message) => {
                appendMessage(JSON.parse(message.body));
            });
            stompClient.subscribe(`/user/${user.username}/queue/private`, (message) => {
                appendMessage(JSON.parse(message.body));
            });
        },
        onWebSocketError: (error) => {
            console.error('Error with websocket', error);
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        }
    });

    stompClient.activate();

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const messageContent = messageInput.value.trim();
    if (messageContent && stompClient.connected) {
        const message = {
            sender: user.username,
            text: messageContent,
            profilePicture: user.profilePictureUrl,
            recipient: currentChatUser || null
        };
        if (currentChatUser) {
                 stompClient.publish({
                     destination: `/app/private/${currentChatUser}`,
                     body: JSON.stringify(message)
                 });
                 appendMessage({
                    ...message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' 
                        
                    })
                });
             } else {

                 stompClient.publish({
                     destination: '/app/send',
                     body: JSON.stringify(message)
                 });
             }
        messageInput.value = ''; // Limpar o campo de entrada de texto
    }
});

    loadUsers();
    loadMessages();
});
