"use client";

import { useState, useEffect, useRef } from "react";
import Image from 'next/image'
const Chat = () => {
  const [streamedResponse, setStreamedResponse] = useState("");
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatBoxRef = useRef(null);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8000/ws");
    // Handle incoming messages
    socketRef.current.onmessage = (event) => {
      console.log("Message received:", event.data);
      if (event.data == "end_stream") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: streamedResponse, sender: "bot" },
        ]);
      }
      else {
        setStreamedResponse((prev) => prev + event.data); // Append streamed chunks
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      // Cleanup on component unmount
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Append the new message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, sender: "user" },
    ]);

    setInputValue("");

    // const resp = await fetch("http://127.0.0.1:8000/submit-text", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ text: inputValue }),
    // });
    // console.log(resp.status);
    if (socketRef.current && inputValue) {
      setStreamedResponse(""); // Clear previous response
      socketRef.current.send(inputValue); // Send query to the backend
      setInputValue(""); // Clear the input
    }
  };

  return (
    <>
    <div className="flex flex-col h-screen bg-gray-700 overflow-hidden">
    <header className="flex w-full p-4 bg-neutral-700">
      <figure className="text-xl text-white font-semibold">
        LexLlama
      </figure>
    </header>
      <div className="flex-grow overflow-y-auto p-4 bg-neutral-600" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded-lg max-w-md ${
              msg.sender === "user"
                ? "ml-auto bg-gray-700 text-white"
                : "mr-auto bg-gray-200 text-slate-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      {streamedResponse != '' ? <div
        
        className={`mb-2 p-3 rounded-lg max-w-md mr-auto bg-gray-200 text-black`}
      >
        {streamedResponse}
      </div> : ''}
      </div>

      <div className="flex p-4 bg-neutral-700   w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-lg mr-2 bg-neutral-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-white text-slate-700 rounded-lg"
        >
          Send
        </button>
      </div>
    </div></>
  );
};

export default Chat;
