import { useState } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  
  const sendMessage = (text) => {
    setMessages([...messages, { text, sender: 'user' }]);
    // Logic to call API
  };

  return { messages, sendMessage };
};
