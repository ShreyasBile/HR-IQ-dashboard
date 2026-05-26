import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { Bot, User, Send, Loader2, MessageSquare, Info, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  isTyping?: boolean;
}

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am the HRIQ AI Assistant. I have analyzed your workforce dataset. Ask me anything about attrition risks, performance trends, or anomalies.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What is the overall attrition rate?",
    "Which department has the highest turnover?",
    "Are there any compensation inversions?",
    "Show me the performance vs engagement correlation."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: typingId, role: 'assistant', content: '', isTyping: true }]);

    try {
      const response = await sendChatMessage(text);
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { id: typingId, role: 'assistant', content: response.answer, sources: response.sources }
          : msg
      ));
    } catch (err: any) {
      setMessages(prev => prev.map(msg => 
        msg.id === typingId 
          ? { id: typingId, role: 'assistant', content: `Error: ${err.response?.data?.detail || err.message}` }
          : msg
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">AI Intelligence <span className="gradient-text">Assistant</span></h1>
          <p className="text-secondary">Explore your workforce data through natural language conversations.</p>
        </div>
        <div className="flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
          <Sparkles className="h-4 w-4 text-secondary" />
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Powered by HRIQ Reasoning</span>
        </div>
      </div>

      <div className="flex-1 glass-card rounded-3xl flex flex-col overflow-hidden border border-white/50">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white/30 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500`}>
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-gradient-to-br from-secondary to-accent ml-5' : 'bg-white mr-5 border border-secondary/20'}`}>
                  {msg.role === 'user' ? <User className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-secondary" />}
                </div>
                
                <div className="flex flex-col">
                  <div className={`p-6 rounded-3xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-secondary text-white rounded-tr-none' 
                      : 'bg-white/80 backdrop-blur-sm border border-secondary/10 text-text-main rounded-tl-none'
                  }`}>
                    {msg.isTyping ? (
                      <div className="flex space-x-2 h-6 items-center px-2">
                        <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    ) : (
                      <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'text-text-main'}`}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 flex items-center text-[10px] font-bold text-secondary/70 bg-secondary/5 border border-secondary/10 rounded-xl px-3 py-1.5 w-max animate-in slide-in-from-top-2">
                      <Info className="h-3 w-3 mr-1.5" />
                      SOURCE: {msg.sources.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/50 backdrop-blur-xl border-t border-secondary/10">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-white text-secondary hover:bg-secondary hover:text-white border border-secondary/20 px-4 py-2 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="relative flex items-center"
          >
            <div className="absolute left-4 p-2 bg-secondary/10 rounded-xl text-secondary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your workforce data..."
              className="w-full pl-16 pr-16 py-5 bg-white border border-secondary/20 rounded-3xl focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all duration-300 shadow-inner placeholder:text-secondary/40"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`absolute right-3 p-3 h-12 w-12 flex justify-center items-center rounded-2xl transition-all duration-300 shadow-lg ${
                loading || !input.trim() 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-secondary text-white hover:bg-accent transform hover:scale-105 active:scale-95'
              }`}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-[10px] font-medium text-secondary/40 uppercase tracking-widest">AI Intelligence may produce artifacts. Always verify critical workforce data.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
