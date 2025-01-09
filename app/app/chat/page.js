"use client";

import { useState, useEffect, useRef } from "react";
import useWebSocket from "../lib/useWebSocket";
import ChatInputbox from "./ChatInputbox";

const Chat = () => {
  const [streamedResponse, setStreamedResponse] = useState("");
  const [socketRef, isConnected] = useWebSocket("http://localhost:8000/ws", handleIncoming, true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatBoxRef = useRef(null);
  const formRef = useRef(null)

  function handleIncoming(event) {
    console.log("Message received:", event.data);
    if (event.data == "end_stream") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: streamedResponse, sender: "bot" },
      ]);
    } else {
      setStreamedResponse((prev) => prev + event.data); // Append streamed chunks
    }
  }

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);


  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Append the new message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, sender: "user" },
    ]);

    setInputValue("");

    
    if (socketRef.current && inputValue) {
      setStreamedResponse(""); // Clear previous response
      socketRef.current.send(inputValue)
      setInputValue(""); // Clear the input
    }
  };

  async function uploadFile(files) {
    const formD = new FormData(formRef.current);
    formD.append('file', files[0])

    const fetchOptions = {
      method: 'POST',
      body: formD
    }

    const resp = await fetch('http://127.0.0.1:8000/submit-file', fetchOptions)
    console.log(resp.status)
  } 

  return (
    <div className="grid grid-rows-7 h-full">
      <div className="flex flex-col row-span-6">
        <div
          className="flex-grow overflow-y-auto p-4"
          ref={chatBoxRef}
        >
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
          {streamedResponse != "" ? (
            <div
              className={`mb-2 p-3 rounded-lg max-w-md mr-auto bg-gray-200 text-black`}
            >
              {streamedResponse}
            </div>
          ) : (
            ""
          )}
        </div>

      </div>
      <div className="flex justify-end relative">
      <ChatInputbox inputBoxVal={inputValue} setVal={setInputValue} buttonClick={sendMessage} buttonDisabled={!isConnected}></ChatInputbox>
      <form className="absolute -top-10 right-5 bg-neutral-100 p-3 text-neutral-800 font-semibold rounded-full h-10 flex items-center justify-center text-sm" ref={formRef}>
        <input type="file" className="hidden" name="fileUpload" id="fileUpload" accept="application/pdf,.doc,.docx,.txt,.xml" onChange={(e) => uploadFile(e.target.files)}></input>
        <label htmlFor="fileUpload">add files</label>
      </form>
      </div>
    </div>
  );
};

export default Chat;
