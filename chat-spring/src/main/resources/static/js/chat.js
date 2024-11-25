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
                userItem.innerText = user.username; 
                
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
                profilePicture: user.profilePictureUrl
            };
            console.log(message);
            stompClient.publish({
                destination: '/app/send',
                body: JSON.stringify(message)
            });
            messageInput.value = '';
        }
    });

    loadUsers();
    loadMessages();
});
