'use client';  // Add this line at the top of the file

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isJournalMode, setIsJournalMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const endpoint = isJournalMode ? '/.netlify/functions/chatJournal' : '/.netlify/functions/chat';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleJournalMode = () => {
    setIsJournalMode(!isJournalMode);
  };

  return (
    <div className="container mx-auto px-4" style={{ maxWidth: '500px' }}>
      <h1 className="text-2xl font-bold mb-4">AI Guide</h1>
      <div className="mb-4 h-96 overflow-y-auto border p-2">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border p-2 mr-2"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        <button
          type="button"
          onClick={toggleJournalMode}
          className={`self-start px-4 py-2 rounded-full transition-colors duration-300 ${
            isJournalMode
              ? 'bg-salmon text-white'
              : 'bg-white text-salmon border-2 border-salmon'
          }`}
        >
          {isJournalMode ? 'Journal Mode: ON' : 'Journal Mode: OFF'}
        </button>
      </form>
    </div>
  );
}
