import React, { useState, useEffect, useRef } from 'react';
import { DriverInfo, ChatMessage } from '../types';
import { X, Send, Phone } from 'lucide-react';

interface ChatModalProps {
  driver: DriverInfo;
  onClose: () => void;
  onOpenCall: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ driver, onClose, onOpenCall }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'system',
      text: 'To protect your privacy, phone numbers are masked.',
      timestamp: 'Now',
    },
    {
      id: 'm2',
      sender: 'driver',
      text: "Hi! I'm on my way in the grey BMW X3. See you shortly!",
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "I'm waiting at the main entrance",
    "Wearing a dark jacket",
    "Take your time!",
    "I see your hazard lights",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'rider',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Driver auto-reply simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "Got it! Pulling up right next to the lobby curb now.",
        "Perfect, thanks for letting me know! See you in 30 seconds.",
        "Understood! Hazard lights are blinking.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `driver_reply_${Date.now()}`,
          sender: 'driver',
          text: randomReply,
          timestamp: 'Just now',
        },
      ]);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl h-[85vh] sm:h-[600px] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={driver.avatarUrl}
                alt={driver.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
              />
              <span className="w-3 h-3 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-slate-900"></span>
            </div>
            <div>
              <div className="font-extrabold text-base">{driver.name}</div>
              <div className="text-xs text-amber-300 font-medium">SwiftRide Driver • {driver.carPlate}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCall}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
              title="Call driver"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'system'
                  ? 'justify-center'
                  : msg.sender === 'rider'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              {msg.sender === 'system' ? (
                <div className="text-[11px] text-slate-400 bg-slate-200/60 px-3 py-1 rounded-full text-center max-w-[85%]">
                  {msg.text}
                </div>
              ) : (
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'rider'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-sm'
                      : 'bg-white text-slate-900 rounded-bl-none shadow-sm border border-slate-200/70'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[9px] block text-right mt-1 ${
                    msg.sender === 'rider' ? 'text-slate-800/70' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200/80 px-4 py-2 rounded-2xl rounded-bl-none text-xs text-slate-400 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 text-[11px]">{driver.name} is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(reply)}
              className="px-3 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-xs font-semibold rounded-full whitespace-nowrap transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Text Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            id="chat-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message ${driver.name}...`}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            id="btn-send-chat-message"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-400 rounded-2xl transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
