"use client";

import { useState, useEffect, useRef } from 'react';
import { socket } from "../lib/socket";

const Chat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatBoxRef = useRef(null);
  
    useEffect(() => {
      if (socket.connected) {
        onConnect();
      }
  
      function onConnect() {
        setIsConnected(true);
        setTransport(socket.io.engine.transport.name);
  
        socket.io.engine.on("upgrade", (transport) => {
          setTransport(transport.name);
        });
      }
  
      function onDisconnect() {
        setIsConnected(false);
        setTransport("N/A");
      }
  
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
  
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      };
    }, []);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    socket.on("msg", (msg) => {
      setMessages([...messages, {
        text: msg,
        user: 'bot'
      }])
    })
  }, [messages]);

  const sendMessage = () => {
    if (inputValue.trim() === '') return;

    // Append the new message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, sender: 'user' },
    ]);

    setInputValue('');

    socket.emit("msg", inputValue)
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4 bg-white" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded-lg max-w-md ${
              msg.sender === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-200 text-black'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex p-4 bg-gray-200">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-lg mr-2"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
