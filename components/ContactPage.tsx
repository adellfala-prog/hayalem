
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, Loader2, CheckCircle2, MessageSquare, ShieldCheck, GraduationCap, Briefcase, ExternalLink, Zap, User } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    category: 'כללי',
    message: ''
  });
  const [isRefining, setIsRefining] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const targetEmail = 'adellfalah@gmail.com';
  const targetWhatsApp = '972527025080';

  const handleRefineWithAI = async () => {
    if (!formData.message.trim()) return;
    setIsRefining(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `קח את ההודעה הבאה של חייל משוחרר דרוזי המעוניין להתייעץ, ושכתב אותה בצורה רשמית, מקצועית ומכובדת בעברית. שמור על המהות של הבקשה: "${formData.message}"`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setFormData(prev => ({ ...prev, message: response.text || prev.message }));
    } catch (error) {
      console.error("AI Refine Error:", error);
    } finally {
      setIsRefining(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');

    setTimeout(() => {
      const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(`${formData.category}: ${formData.subject}`)}&body=${encodeURIComponent(`שלום עאדל,\n\nשמי: ${formData.name}\n\nהודעה:\n${formData.message}`)}`;
      window.location.href = mailtoLink;
      setStatus('success');
      
      setTimeout(() => setStatus('idle'), 6000);
    }, 1200);
  };

  const handleWhatsAppSubmit = () => {
    let text = "";
    if (!formData.name.trim() && !formData.message.trim()) {
      // Default generic message if form is empty
      text = "שלום עאדל, הגעתי דרך אתר 'כוון לדרוזים' ואשמח להתייעץ איתך.";
    } else {
      text = `*פנייה חדשה מאתר כוון לדרוזים*\n\n*שם:* ${formData.name || 'לא צוין'}\n*נושא:* ${formData.category}: ${formData.subject || 'כללי'}\n\n*הודעה:*\n${formData.message || 'שלום, אשמח להתייעץ.'}`;
    }
    
    // Using api.whatsapp.com for better cross-platform reliability
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetWhatsApp}&text=${encodeURIComponent(text)}`;
    
    // Using location.href instead of window.open to bypass popup blockers
    window.location.href = whatsappUrl;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-blue-600 mb-6 shadow-inner">
          <MessageSquare size={32} />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">צור קשר עם עאדל</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          יש לך שאלה? זקוק לעזרה במיצוי זכויות? המערכת תכין עבורך את הפנייה בצורה המקצועית ביותר ותשלח אותה ישירות אליי.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-8 relative overflow-hidden">
            <h3 className="text-xl font-black text-gray-800 border-b pb-4 relative z-10">איך זה עובד?</h3>
            
            <div className="space-y-6 relative z-10">
              <div className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0 text-sm">1</div>
                <p className="text-gray-600 text-sm font-medium">ממלאים את פרטי השאלה בטופס</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0 text-sm">2</div>
                <p className="text-gray-600 text-sm font-medium">לוחצים על "לטש עם AI" לניסוח מושלם</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0 text-sm">3</div>
                <p className="text-gray-600 text-sm font-medium">בוחרים אם לשלוח במייל או ב-WhatsApp</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 relative z-10">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <Mail className="text-blue-600" size={20} />
                <span className="text-sm font-bold text-gray-800 break-all">{targetEmail}</span>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
          </div>

          <button 
            onClick={handleWhatsAppSubmit}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-[32px] font-black flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 transition-all transform hover:scale-105 active:scale-95"
          >
            <MessageSquare size={24} />
            פנייה ב-WhatsApp לעאדל
          </button>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          {status === 'success' ? (
            <div className="bg-white p-16 rounded-[48px] border-2 border-dashed border-green-200 shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                 <CheckCircle2 size={48} />
               </div>
               <div className="space-y-4">
                 <h3 className="text-3xl font-black text-gray-900">הפנייה מוכנה!</h3>
                 <p className="text-gray-600 font-medium text-lg">
                   אפליקציית המייל שלך נפתחה כעת עם ההודעה המלוטשת. <br/>
                   כל מה שנשאר זה ללחוץ על "שליחה" (Send).
                 </p>
               </div>
               <button 
                onClick={() => setStatus('idle')}
                className="text-blue-600 font-black hover:underline"
               >
                 שלח הודעה נוספת
               </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl space-y-8 relative">
              {status === 'processing' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 rounded-[40px] flex flex-col items-center justify-center space-y-4">
                   <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                   <p className="font-black text-blue-900">מכין את הפנייה שלך...</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-700 mr-2 flex items-center gap-2">
                    <User size={14} className="text-blue-500"/> שם מלא
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800 shadow-inner" 
                    placeholder="ישראל ישראלי"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-700 mr-2 flex items-center gap-2">
                    <Zap size={14} className="text-blue-500"/> נושא הפנייה
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800 shadow-inner" 
                    placeholder="נושא קצר וקולע..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-gray-700 mr-2">קטגוריה</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'זכויות', icon: <ShieldCheck size={14}/> },
                    { id: 'אקדמיה', icon: <GraduationCap size={14}/> },
                    { id: 'תעסוקה', icon: <Briefcase size={14}/> },
                    { id: 'כללי', icon: <MessageSquare size={14}/> }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat.id})}
                      className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-black text-xs transition-all ${
                        formData.category === cat.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-105' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'
                      }`}
                    >
                      {cat.icon}
                      {cat.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-black text-gray-700 mr-2">מה תרצה לשאול?</label>
                  <button 
                    type="button"
                    onClick={handleRefineWithAI}
                    disabled={isRefining || !formData.message.trim()}
                    className="text-xs bg-purple-600 text-white font-black px-4 py-2 rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all flex items-center gap-2 disabled:opacity-50 group"
                  >
                    {isRefining ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />}
                    לטש הודעה עם AI
                  </button>
                </div>
                <textarea 
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full h-56 p-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[32px] outline-none transition-all font-bold text-gray-800 shadow-inner resize-none custom-scrollbar" 
                  placeholder="כתוב כאן בצורה חופשית ואנחנו כבר נדאג לניסוח..."
                />
              </div>

              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[28px] shadow-2xl shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-4 text-xl"
                >
                  <Mail size={24} />
                  שלח מייל לעאדל
                </button>
                <button 
                  type="button"
                  onClick={handleWhatsAppSubmit}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-6 rounded-[28px] shadow-2xl shadow-emerald-100 transition-all transform active:scale-95 flex items-center justify-center gap-4 text-xl"
                >
                  <MessageSquare size={24} />
                  שלח ב-WhatsApp
                </button>
              </div>
              <p className="text-center text-[11px] text-gray-400 font-black mt-4 uppercase tracking-tighter">
                המערכת תפתח את אפליקציית התקשורת שבחרת עם ההודעה מוכנה
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
