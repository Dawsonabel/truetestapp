'use client';

import { useState, useEffect } from 'react';
import styles from 'app/chat/styles/chat.module.css';
import { prepareMessages } from './components/prompt';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [journalContext, setJournalContext] = useState('');

  const samplePrompts = [
    "What hidden strengths do my journal entries reveal?",
    "How does my personality type influence my decision-making?",
    "What growth patterns do you see in my recent journals?",
    "Based on my personality report, what's my ideal work environment?",
    "What emotional patterns appear in my journal entries?",
    "How can I better leverage my personality strengths?"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(samplePrompts[0]);

  useEffect(() => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setCurrentPrompt(randomPrompt);
  }, []);

  useEffect(() => {
    const fetchJournalContext = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const response = await fetch('/.netlify/functions/fetchJournal', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Journal fetch error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch journal entries');
        }

        const entries = await response.json();

        if (entries && entries.length > 0) {
          const contextSummary = entries.map(entry => `
            Entry Type: ${entry.type}
            Date: ${new Date(entry.dateTime).toLocaleDateString()}
            Responses: ${entry.responses.join(' | ')}
          `).join('\n\n');

          setJournalContext(contextSummary);
        }
      } catch (error) {
        console.error('Error in fetchJournalContext:', error);
      }
    };

    fetchJournalContext();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const preparedMessages = prepareMessages(journalContext, messages, userMessage);
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setCurrentStreamingMessage('');

    try {
      const response = await fetch('/netlify/edge-functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          messages: preparedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let fullResponse = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonString = line.slice(6);
            if (jsonString === '[DONE]') continue;
            
            try {
              const jsonData = JSON.parse(jsonString);
              const content = jsonData.choices[0]?.delta?.content || '';
              fullResponse += content;
              setCurrentStreamingMessage(fullResponse);
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        }
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: fullResponse 
      }]);
      setCurrentStreamingMessage('');
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSamplePromptClick = async () => {
    const userMessage = { role: 'user', content: currentPrompt };
    const preparedMessages = prepareMessages(journalContext, messages, userMessage);
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentStreamingMessage('');

    try {
      const response = await fetch('/netlify/edge-functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentPrompt,
          messages: preparedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let fullResponse = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonString = line.slice(6);
            if (jsonString === '[DONE]') continue;
            
            try {
              const jsonData = JSON.parse(jsonString);
              const content = jsonData.choices[0]?.delta?.content || '';
              fullResponse += content;
              setCurrentStreamingMessage(fullResponse);
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        }
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: fullResponse 
      }]);
      setCurrentStreamingMessage('');
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 z-0"></div>
      <div className="relative z-10 flex flex-col items-center justify-start py-8 min-h-screen">
        <div className="w-full max-w-lg px-4">
          {/* Header Section */}
          <div 
            onClick={() => setShowHelpModal(true)}
            className="bg-white rounded-lg p-4 mb-4 shadow-md w-full flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors duration-300"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center">
                <img src="./images/emotions/icon.png" alt="AI Guide Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#7081e6]">AI Guide</h2>
                <p className="text-sm text-gray-500">Your growth guide</p>
              </div>
            </div>
            <div className="flex items-center">
              <svg 
                className="w-9 h-9 text-[#7081e6]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>

          {showHelpModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#7081e6]">How to Use AI Guide</h3>
                  <button 
                    onClick={() => setShowHelpModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  <p className="text-gray-600">Welcome to AI Guide! Here&apos;s how to get started:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Type your message in the chat box below</li>
                    <li>The AI Guide has access to your personality reports and journal entries. 
                      You can use these to get very <span className="text-[#7081e6]">personalized</span> guidance.</li>
                    <li>You can ask things like: <br></br><span className="text-[#7081e6]">&quot;Based on my journal entries, 
                      what secret strengths do I have that I might not know about?&quot;</span></li>
                    <li>The AI will respond in real-time with helpful guidance</li>
                  </ul>
                  <p className="text-gray-600">Feel free to ask questions about anything!</p>
                </div>

                <button
                  onClick={() => setShowHelpModal(false)}
                  className="mt-6 w-full bg-[#7081e6] text-white px-4 py-2 rounded-lg hover:bg-[#5b6ac9] transition-colors duration-300"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}

          {/* Chat Container */}
          <div className="bg-white rounded-lg shadow-md w-full mb-4">
            <div className="h-[500px] overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="bg-[#7081e6] bg-opacity-15 rounded-3xl p-5 mb-5">
                    <svg className="w-21 h-21 opacity-85 text-[#7081e6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-center px-4">
                    Try asking: <br></br>
                    <button 
                      onClick={handleSamplePromptClick}
                      className="text-[#7081e6] hover:text-[#5b6ac9] transition-colors duration-300 cursor-pointer"
                    >
                      &quot;{currentPrompt}&quot;
                    </button>
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div key={index} 
                         className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.role === 'user' 
                          ? 'bg-[#7081e6] text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
              
              {currentStreamingMessage && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <p className="text-sm">{currentStreamingMessage}</p>
                  </div>
                </div>
              )}
              
              {isLoading && !currentStreamingMessage && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <p className="text-sm text-gray-500">Typing...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Section */}
            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow px-4 py-2 mb-0 border border-gray-200 rounded-l-lg rounded-r-none focus:outline-none focus:border-[#7081e6]"
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#7081e6] text-white px-6 py-2 border border-chill rounded-r-lg rounded-l-none hover:bg-[#5b6ac9] transition-colors duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending
                    </span>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
                {/* Disclaimer */}
                <p className="text-xs text-gray-500 text-center mt-2 px-4 mb-4">
          Your AI Guide can make mistakes. Review important info.
          </p>
    </div>
  );
}
