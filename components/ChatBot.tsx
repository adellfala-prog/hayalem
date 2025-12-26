
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/gemini';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2, Info, CheckCircle2, AlertCircle, HelpCircle, GraduationCap, Zap, Star } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'שלום! אני היועץ הדיגיטלי שלך. אני כאן כדי לעזור לך למצות את הזכויות שלך כחייל משוחרר מהעדה הדרוזית. \n\nבמה נוכל להתמקד היום? \n1. **מימוש מענקים ופיקדון** \n2. **מלגות לימודים ייעודיות** \n3. **הכוונה תעסוקתית ובניית קריירה** \n4. **זכויות בדיור והתיישבות**' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    let fullResponse = '';
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    const stream = geminiService.sendMessageStream(userMessage);
    
    for await (const chunk of stream) {
      fullResponse += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'model') {
          return [...prev.slice(0, -1), { role: 'model', text: fullResponse }];
        }
        return prev;
      });
    }

    setIsTyping(false);
  };

  // Smart Formatter for AI Responses
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');
    
    return lines.map((line, idx) => {
      let trimmedLine = line.trim();
      if (!trimmedLine) return <div key={idx} className="h-3" />;

      // 1. Headers [Header Name]
      const headerMatch = trimmedLine.match(/^\[(.*?)\]/);
      if (headerMatch) {
        const headerText = headerMatch[1];
        const isAction = headerText.includes('הנחיות') || headerText.includes('ביצוע');
        return (
          <div key={idx} className="mt-6 mb-3 first:mt-0 animate-in fade-in slide-in-from-right-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-r-4 w-fit shadow-sm ${
              isAction ? 'bg-orange-50 border-orange-600' : 'bg-blue-50 border-blue-600'
            }`}>
              {isAction ? <Zap size={16} className="text-orange-600" /> : <Info size={16} className="text-blue-600" />}
              <span className={`font-black text-sm ${isAction ? 'text-orange-900' : 'text-blue-900'}`}>{headerText}</span>
            </div>
          </div>
        );
      }

      // Formatting helper for Bold and Regular text
      const formatContent = (content: string) => {
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-black text-gray-900 bg-blue-50 px-1 rounded mx-0.5">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
      };

      // 2. Numbered Lists (Enhanced UX)
      const numberMatch = trimmedLine.match(/^(\d+[\.\)])\s*(.*)/);
      if (numberMatch) {
        return (
          <div key={idx} className="flex gap-4 mb-3 pr-2 group animate-in slide-in-from-right-3">
            <div className="flex flex-col items-center">
              <span className="font-black text-blue-700 shrink-0 w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-sm border-2 border-blue-200 group-hover:scale-110 transition-transform">
                {numberMatch[1].replace(/[\.\)]/, '')}
              </span>
              <div className="w-0.5 flex-1 bg-blue-50 my-1 group-last:hidden"></div>
            </div>
            <p className="text-gray-800 leading-relaxed flex-1 py-1 font-medium">{formatContent(numberMatch[2])}</p>
          </div>
        );
      }

      // 3. Bullet Points (Enhanced UX)
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•')) {
        const content = trimmedLine.replace(/^[-*•]\s*/, '');
        return (
          <div key={idx} className="flex gap-4 mb-3 pr-2 animate-in slide-in-from-right-2">
            <div className="mt-2.5 w-2 h-2 rounded-full bg-blue-400 shrink-0 shadow-sm" />
            <p className="text-gray-700 leading-relaxed flex-1 font-medium">{formatContent(content)}</p>
          </div>
        );
      }

      // 4. Important Highlights (Special logic for lines starting with emoji or specific keywords)
      if (trimmedLine.includes('⚠️') || trimmedLine.includes('שים לב')) {
        return (
          <div key={idx} className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-start animate-in zoom-in-95">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <p className="text-amber-900 text-sm font-bold leading-relaxed">{formatContent(trimmedLine)}</p>
          </div>
        );
      }

      // 5. Default Paragraph
      return (
        <p key={idx} className="mb-3 leading-relaxed text-gray-700 font-medium">
          {formatContent(line)}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[750px] bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 flex items-center justify-between relative">
        <div className="flex items-center gap-5 z-10">
          <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-xl border border-white/30 shadow-inner">
            <Bot className="text-white w-7 h-7" />
          </div>
          <div>
            <h3 className="text-white font-black text-2xl tracking-tight">היועץ הדיגיטלי</h3>
            <p className="text-blue-200 text-sm font-bold flex items-center gap-2 mt-0.5">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
              זמין כעת למענה על כל שאלה
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-3 z-10">
          <div className="bg-white/10 px-4 py-1.5 rounded-full text-[11px] text-white font-black uppercase tracking-widest border border-white/10">מיצוי זכויות</div>
          <div className="bg-white/10 px-4 py-1.5 rounded-full text-[11px] text-white font-black uppercase tracking-widest border border-white/10">הכוונה אישית</div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in fade-in duration-500`}
          >
            <div className={`flex gap-4 max-w-[95%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-gray-100'
              }`}>
                {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
              </div>
              
              <div className={`p-6 rounded-[32px] shadow-sm relative group transition-all hover:shadow-md ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                {msg.role === 'model' ? (
                  <div className="text-[16px]">
                    {msg.text ? renderFormattedText(msg.text) : (
                      isTyping && idx === messages.length - 1 ? (
                        <div className="flex gap-2 py-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  <p className="text-[16px] font-bold leading-relaxed">{msg.text}</p>
                )}
                
                <div className={`absolute bottom-[-22px] ${msg.role === 'user' ? 'right-2' : 'left-2'} text-[10px] text-gray-400 font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest`}>
                  נשלח ב-{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-8 bg-white border-t border-gray-100">
        <div className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="שאל אותי על מלגות, מענקים, דיור או קריירה..."
            className="w-full pl-20 pr-8 py-6 bg-gray-50 border-2 border-transparent rounded-[28px] text-lg focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-inner placeholder:text-gray-400 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className={`absolute left-2.5 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              input.trim() && !isTyping ? 'bg-blue-600 text-white shadow-blue-200 hover:scale-105 active:scale-95' : 'bg-gray-200 text-gray-400 shadow-none'
            }`}
          >
            {isTyping ? <Loader2 className="w-7 h-7 animate-spin" /> : <Send size={26} />}
          </button>
        </div>
        <div className="flex justify-center gap-4 mt-5 overflow-x-auto no-scrollbar pb-1">
          {[
            { label: 'מלגות 2025', icon: <GraduationCap size={16} /> },
            { label: 'פיקדון אישי', icon: <HelpCircle size={16} /> },
            { label: 'זכויות דיור', icon: <Star size={16} /> },
            { label: 'מענק שחרור', icon: <Info size={16} /> }
          ].map((chip, i) => (
            <button
              key={i}
              onClick={() => setInput(chip.label)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 border border-transparent hover:border-blue-400 shadow-sm"
            >
              {chip.icon}
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
