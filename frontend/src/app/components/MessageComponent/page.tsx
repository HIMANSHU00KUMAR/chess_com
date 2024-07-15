// frontend/components/MessageComponent.js
"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const MessageComponent = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    socket.on('messageAcknowledged', (ackMessage) => {
      setResponse(ackMessage);
    });

    return () => {
      socket.off('messageAcknowledged');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('sendMessage', message);
    setMessage('');
  };

  return (
    <div>
      <h1>Send a Message</h1>
      <input
        type="text"
        value={message}
        className='text-black'
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
      <p className='bg-yellow-50 text-red'>{response}</p>
    </div>
  );
};

export default MessageComponent;
