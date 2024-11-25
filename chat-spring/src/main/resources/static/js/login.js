document.addEventListener('DOMContentLoaded', (event) => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const profilePicture = document.getElementById('profilePicture').files[0];

        const formData = new FormData();
        formData.append('file', profilePicture);

        try {
            const uploadResponse = await fetch('/api/upload-profile-picture', {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadResponse.json();

            const user = {
                username: username,
                profilePictureUrl: uploadData.url
            };

            const userResponse = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const userData = await userResponse.json();
            localStorage.setItem('user', JSON.stringify(userData));
            window.location.href = '/chat';
        } catch (error) {
            console.error('Error:', error);
        }
    });
});