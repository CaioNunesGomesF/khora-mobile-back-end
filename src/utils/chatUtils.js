// A shared Map that holds chat history per user (keyed by user id)
export const userChat = new Map();

// Return the map (keeps backward compatibility with previous usage)
export const historyChat = () => userChat;

// Helpers to work with a specific user's chat
export const saveMessage = (userId, role, contents) => {
    const chat = userChat.get(userId) || [];
    chat.push({ role, contents });
    userChat.set(userId, chat);
};

export const getChatHistory = (userId) => {
    return userChat.get(userId) || [];
};

export const clearChatHistory = (userId) => {
    userChat.delete(userId);
};