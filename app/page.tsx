"use client";

// Import the useState hook from React to manage component state
import { useState } from "react";

// This is a chat interface component that displays messages between a user and a bot
export default function ChatPage() {
  // Initialize messages state with a welcome message from the bot
  const [messages, setMessages] = useState(
    [{ sender: "bot", text: "Hello! My name is Vivek, the CollectWise Chatbot. How can I help you today?"}]
  );
  
  // Initialize input state to store the current value of the message input field
  const [input, setInput] = useState("");

  // Handle form submission when user sends a message
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add the user's message to the messages array
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput(""); // Clear the input field

    // Simulate bot response with a delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: "hi" }]);
    }, 300);
  };

  return (
    // Main container with full screen height and gray background
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header section with blue background */}
      <header className="bg-blue-600 text-black p-4 text-xl text-center font-sans">
        CollectWise Chatbot
      </header>

      {/* Main chat area - flex-1 makes it take remaining space, overflow-y-auto enables scrolling */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Map through messages and render each one */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              // Align user messages to right, bot messages to left
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                // Style messages differently based on sender
                className={`p-4 rounded-2xl max-w-md break-words font-sans shadow-md
                  ${msg.sender === "user" 
                    ? "bg-blue-500 text-black ml-12" 
                    : "bg-white text-gray-900 mr-12 border border-gray-200"}`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Message input form at the bottom */}
      <form onSubmit={handleSubmit} className="p-4 bg-white flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l-lg text-black font-sans focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 font-sans"
        >
          Send
        </button>
      </form>
    </div>
  );
}