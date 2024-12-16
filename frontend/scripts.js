// Fetch and display top users by balance
fetch('/users')
    .then(response => response.json())
    .then(users => {
        const userList = document.querySelector('.user-list');
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.innerHTML = `
                <h3>${user.username}</h3>
                <p>Balance: $${user.balance.toFixed(2)}</p>
            `;
            userList.appendChild(userElement);
        });
    });

// Fetch and display trading updates
fetch('/trade-updates')
    .then(response => response.json())
    .then(updates => {
        const updatesContainer = document.querySelector('.updates');
        updates.forEach(update => {
            const updateElement = document.createElement('div');
            updateElement.classList.add('update');
            updateElement.innerHTML = `
                <p>${update.username} traded $${update.amount} (${update.status})</p>
                <small>${new Date(update.tradeTime).toLocaleString()}</small>
            `;
            updatesContainer.appendChild(updateElement);
        });
    });

// Fetch and display withdrawal updates
fetch('/withdrawal-updates')
    .then(response => response.json())
    .then(withdrawals => {
        const withdrawalsContainer = document.querySelector('.withdrawals');
        withdrawals.forEach(withdrawal => {
            const withdrawalElement = document.createElement('div');
            withdrawalElement.classList.add('withdrawal');
            withdrawalElement.innerHTML = `
                <p>${withdrawal.username} requested $${withdrawal.amount} (${withdrawal.status})</p>
                <small>${new Date(withdrawal.createdAt).toLocaleString()}</small>
            `;
            withdrawalsContainer.appendChild(withdrawalElement);
        });
    });

// Chat functionality
document.getElementById('send-chat').addEventListener('click', () => {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    if (message) {
        const chatMessages = document.getElementById('chat-messages');
        const newMessage = document.createElement('p');
        newMessage.textContent = `You: ${message}`;
        chatMessages.appendChild(newMessage);
        chatInput.value = '';
    }
});
