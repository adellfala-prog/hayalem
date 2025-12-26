
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  UserCheck, 
  Search, 
  Lightbulb, 
  CheckCircle2, 
  Play,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  Shield,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Wand2,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Trophy,
  BrainCircuit,
  FileCode,
  ThumbsUp,
  AlertTriangle,
  Lightbulb as Idea,
  Star,
  Quote,
  Copy,
  Check,
  Globe,
  ExternalLink,
  Building2,
  Eye,
  Mic2,
  Accessibility,
  Hand,
  XCircle,
  Video,
  Smile,
  Layers
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { geminiService, GroundingSource } from '../services/gemini';

// --- CV Builder Component ---
const CVBuilder: React.FC = () => {
  const [cvData, setCvData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    militaryService: {
      unit: '',
      role: '',
      years: '',
      description: ''
    },
    experience: [{ company: '', role: '', years: '', desc: '' }],
    education: [{ institution: '', degree: '', years: '' }],
    skills: ['עבודה בצוות', 'יוזמה', 'אחריות']
  });

  const updateField = (path: string, value: any) => {
    if (path.includes('.')) {
      const [parent, child] = path.split('.');
      setCvData(prev => ({
        ...prev,
        [parent]: { ...(prev as any)[parent], [child]: value }
      }));
    } else {
      setCvData(prev => ({ ...prev, [path]: value }));
    }
  };

  const addItem = (type: 'experience' | 'education') => {
    const newItem = type === 'experience' 
      ? { company: '', role: '', years: '', desc: '' }
      : { institution: '', degree: '', years: '' };
    setCvData(prev => ({
      ...prev,
      [type]: [...(prev as any)[type], newItem]
    }));
  };

  const removeItem = (type: 'experience' | 'education', index: number) => {
    setCvData(prev => ({
      ...prev,
      [type]: (prev as any)[type].filter((_: any, i: number) => i !== index)
    }));
  };

  const updateListItem = (type: 'experience' | 'education', index: number, field: string, value: string) => {
    const newList = [...(cvData as any)[type]];
    newList[index][field] = value;
    setCvData(prev => ({ ...prev, [type]: newList }));
  };

  const downloadAsWord = () => {
    const content = document.getElementById('cv-print-area')?.innerHTML;
    if (!content) return;

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>קורות חיים</title>
      <style>
        body { font-family: 'Arial', sans-serif; direction: rtl; padding: 20px; }
        h1 { color: #1a202c; text-align: center; margin-bottom: 20px; }
        .section-title { color: #2563eb; border-bottom: 2px solid #eff6ff; padding-bottom: 5px; margin-top: 25px; font-weight: bold; font-size: 18px; }
        .item-header { display: flex; justify-content: space-between; font-weight: bold; margin-top: 15px; }
        .text-gray { color: #4b5563; font-size: 14px; }
      </style>
      </head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `קורות_חיים_${cvData.fullName || 'שלי'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      <div className="lg:col-span-5 space-y-6 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar no-print">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
            <User size={18} className="text-blue-600" />
            פרטים אישיים
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <input 
              type="text" placeholder="שם מלא" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={cvData.fullName} onChange={e => updateField('fullName', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <input type="email" placeholder="אימייל" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={cvData.email} onChange={e => updateField('email', e.target.value)} />
              <input type="text" placeholder="טלפון" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={cvData.phone} onChange={e => updateField('phone', e.target.value)} />
            </div>
            <input type="text" placeholder="כתובת" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={cvData.address} onChange={e => updateField('address', e.target.value)} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
            <Shield size={18} className="text-blue-600" />
            שירות צבאי
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="יחידה" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={cvData.militaryService.unit} onChange={e => updateField('militaryService.unit', e.target.value)} />
            <input type="text" placeholder="תפקיד" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={cvData.militaryService.role} onChange={e => updateField('militaryService.role', e.target.value)} />
            <textarea placeholder="תיאור העשייה והישגים בשירות..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl col-span-2 h-32 outline-none text-sm" value={cvData.militaryService.description} onChange={e => updateField('militaryService.description', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 flex flex-col gap-6">
        <div id="cv-print-area" className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full aspect-[1/1.4142] flex flex-col overflow-hidden origin-top" style={{ minHeight: '1000px' }}>
          <div className="bg-gray-900 text-white p-12 text-center">
            <h1 className="text-4xl font-black mb-4">{cvData.fullName || 'שם מלא'}</h1>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              {cvData.email && <span className="flex items-center gap-2"><Mail size={14} /> {cvData.email}</span>}
              {cvData.phone && <span className="flex items-center gap-2"><Phone size={14} /> {cvData.phone}</span>}
            </div>
          </div>
          <div className="p-12 space-y-10 flex-1 text-right" dir="rtl">
            {(cvData.militaryService.unit || cvData.militaryService.role) && (
              <section>
                <h3 className="text-blue-700 font-black border-b-2 border-blue-50 pb-2 mb-4 text-sm uppercase">שירות צבאי</h3>
                <div className="flex justify-between font-bold text-gray-900"><span>{cvData.militaryService.role}</span><span>{cvData.militaryService.unit}</span></div>
                <p className="text-gray-600 text-sm mt-2">{cvData.militaryService.description}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Interview Body Language Guide Component ---
const InterviewGuide: React.FC = () => {
  const guideSections = [
    {
      title: "מבט ועיניים",
      icon: <Eye className="w-8 h-8" />,
      color: "bg-blue-100 text-blue-600",
      description: "המבט הוא הגשר לביטחון עצמי. שמרו על קשר עין רציף אך נינוח.",
      tips: [
        "הסתכלו למראיין בעיניים כ-70% מהזמן.",
        "במידה ויש כמה מראיינים, חלקו את המבט ביניהם.",
        "אל תבהו - מצמצו וחייכו מדי פעם כדי להיראות אנושיים.",
        "הימנעו מלהסתכל על הרצפה - זה משדר חוסר ביטחון."
      ],
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "ישיבה ויציבה",
      icon: <Accessibility className="w-8 h-8" />,
      color: "bg-green-100 text-green-600",
      description: "איך שאתם יושבים מספר מי אתם עוד לפני שדיברתם.",
      tips: [
        "שבו זקוף אבל לא 'נוקשה' כמו במסדר.",
        "רכנו מעט קדימה (Lean in) כדי להראות עניין.",
        "הימנעו משילוב ידיים - זה יוצר מחסום פיזי.",
        "שמרו על רגליים יציבות על הרצפה או שלובות בעדינות."
      ],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "ידיים ותנועה",
      icon: <Hand className="w-8 h-8" />,
      color: "bg-purple-100 text-purple-600",
      description: "הידיים הן כלי עזר להמחשת הסיפור שלכם.",
      tips: [
        "השתמשו בידיים כדי להדגיש נקודות חשובות.",
        "שמרו על כפות ידיים גלויות (משדר אמינות).",
        "הימנעו מתיפוף על השולחן או משחק בעט.",
        "נגיעה בשיער או בפנים משדרת לחץ - הימנעו מכך."
      ],
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "טון דיבור ואנרגיה",
      icon: <Mic2 className="w-8 h-8" />,
      color: "bg-orange-100 text-orange-600",
      description: "השילוב בין עוצמה לרוגע הוא המפתח.",
      tips: [
        "דברו בקצב בינוני - לא מהר מדי ולא לאט מדי.",
        "השתמשו בטון בטוח אך לא תוקפני.",
        "חייכו תוך כדי דיבור - זה נשמע בקול שלכם.",
        "קחו נשימה עמוקה לפני תשובה לשאלות קשות."
      ],
      image: "https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-12 rounded-[64px] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex p-4 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 mb-4">
            <Sparkles size={40} className="text-yellow-300" />
          </div>
          <h3 className="text-4xl md:text-5xl font-black tracking-tight">המדריך הוויזואלי לשפת גוף</h3>
          <p className="text-xl text-blue-100 leading-relaxed font-medium">
            מראיינים מחליטים ב-7 השניות הראשונות. הנה איך לוודא שהמסר הלא-מילולי שלכם הוא של מקצוענות וביטחון.
          </p>
        </div>
        <BrainCircuit className="absolute -top-10 -left-10 text-white/5 w-96 h-96" />
      </div>

      {/* Video Workshop Section */}
      <div className="bg-white rounded-[56px] border border-gray-100 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 bg-black flex items-center justify-center p-4">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/nU-YAbh8oRE" 
              title="Interview Body Language Tips" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="lg:col-span-5 p-12 flex flex-col justify-center space-y-8 bg-gray-50/50">
          <div className="space-y-4">
            <h4 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-xl text-red-600"><Video size={24} /></div>
              סדנת וידאו קצרה
            </h4>
            <p className="text-gray-500 font-bold leading-relaxed">
              צפו בסרטון הבא המרכז את הטעויות הנפוצות ביותר של מועמדים. שימו לב במיוחד ל:
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "מהירות הדיבור בזמן לחץ",
              "תנועות 'ניקוי' עצמי (נגיעה בבגדים/שיער)",
              "שימוש נכון בחלל החדר",
              "כוחו של החיוך בברכת השלום"
            ].map((point, i) => (
              <li key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">{i+1}</div>
                <span className="text-gray-700 font-black">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Visual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {guideSections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-[48px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
            <div className="h-64 relative overflow-hidden">
               <img src={section.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={section.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80"></div>
               <div className={`absolute bottom-6 right-8 p-4 rounded-2xl ${section.color} shadow-xl backdrop-blur-sm`}>
                 {section.icon}
               </div>
            </div>
            <div className="p-10 space-y-6">
              <h4 className="text-3xl font-black text-gray-900">{section.title}</h4>
              <p className="text-gray-500 font-bold italic leading-relaxed text-lg">{section.description}</p>
              <div className="space-y-4 pt-4 border-t border-gray-50">
                {section.tips.map((tip, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <CheckCircle2 size={24} className="text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-bold leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Psychological Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[56px] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
           <div className="bg-white/10 p-10 rounded-[40px] border border-white/10 backdrop-blur-md shrink-0">
             <Layers size={64} className="text-blue-400" />
           </div>
           <div className="space-y-4">
              <h4 className="text-3xl font-black text-blue-400">טכניקת ה-"שיקוף" (Mirroring)</h4>
              <p className="text-xl text-gray-300 leading-relaxed font-medium">
                נסו לאמץ בעדינות (ממש בעדינות!) את קצב הדיבור או את שפת הגוף של המראיין. אם הוא מדבר לאט - האטו. אם הוא נשען קדימה - עשו זאת גם לאחר כמה שניות. זה יוצר "חיבור כימי" תת-מודע של אמון.
              </p>
           </div>
        </div>
        <div className="bg-white p-10 rounded-[56px] border border-blue-100 shadow-xl flex flex-col items-center justify-center text-center space-y-6">
           <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600">
             <Smile size={48} />
           </div>
           <h4 className="text-2xl font-black text-gray-900">חיוך הוא כוח</h4>
           <p className="text-gray-500 font-bold leading-relaxed">
             מחקרים מראים שחיוך ב-30 השניות הראשונות וב-30 האחרונות משאיר חותם של אופטימיות ויכולת עבודה בצוות.
           </p>
        </div>
      </div>

      {/* Dos & Don'ts Footer */}
      <div className="bg-gray-50 rounded-[64px] p-12 border border-gray-100">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
               <h4 className="text-3xl font-black mb-8 flex items-center gap-4 text-emerald-800">
                 <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg"><ThumbsUp size={28} className="text-white" /></div>
                 עשה (Dos)
               </h4>
               <ul className="space-y-6">
                 {[
                   "הגעה 10 דקות לפני הזמן (משדר אחריות).",
                   "לבוש נקי ומכובד - רושם ראשוני הוא הכל.",
                   "לחיצת יד בטוחה (אם רלוונטי) וחיוך בברכת השלום.",
                   "הקשבה פעילה - הנהנו כדי להראות שאתם מבינים."
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-5 bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm transition-all hover:translate-x-[-10px]">
                     <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                     <span className="font-black text-gray-800">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
            <div>
               <h4 className="text-3xl font-black mb-8 flex items-center gap-4 text-rose-800">
                 <div className="bg-rose-500 p-3 rounded-2xl shadow-lg"><XCircle size={28} className="text-white" /></div>
                 אל תעשה (Don'ts)
               </h4>
               <ul className="space-y-6">
                 {[
                   "אל תקטעו את דברי המראיין לעולם.",
                   "אל תשתמשו בסלנג צבאי (מילים כמו 'מסדר', 'רתק').",
                   "אל תבדקו את הטלפון - שימו אותו בתיק וכבו צלילים.",
                   "אל תדברו רעה על המפקד או המעסיק הקודם שלכם."
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-5 bg-white p-5 rounded-3xl border border-rose-100 shadow-sm transition-all hover:translate-x-[-10px]">
                     <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                     <span className="font-black text-gray-800">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- AI Interview Simulator Component ---
const InterviewSimulator: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'setup' | 'interview' | 'feedback'>('intro');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const startInterview = async (selectedRole?: string) => {
    const finalRole = selectedRole || role;
    if (!finalRole.trim()) return;
    setRole(finalRole);
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `ייצר רשימה של 4 שאלות ראיון עבודה נפוצות ומאתגרות לתפקיד: ${finalRole}. החזר רק רשימה ממוספרת בעברית.`,
      });
      const qList = response.text.split('\n').filter(q => q.trim().match(/^\d/)).map(q => q.replace(/^\d+[\.\)\s]+/, '').trim());
      setQuestions(qList);
      setStep('interview');
    } catch (e) {
      alert("חלה שגיאה ביצירת השאלות.");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `אני מתראיין לתפקיד "${role}". נשאלתי: "${questions[currentIndex]}". 
      עניתי: "${userAnswer}". 
      נתח את התשובה שלי כמאמן ראיונות מומחה הממוקד בחיילים משוחררים. 
      החזר תשובה במבנה הבא בדיוק (כולל הכותרות בסוגריים):
      [ציון] - מספר בין 1 ל-100 המייצג את איכות התשובה.
      [סיכום] - משפט אחד קולע על התשובה.
      [חוזקות] - 2-3 בולטים (התחל כל בולט בסימן •) על מה שהיה טוב.
      [לשיפור] - 2-3 בולטים (התחל כל בולט בסימן •) על מה שחסר.
      [תרגום לאזרחית] - איך להפוך את המילים שלי למונחים עסקיים/מקצועיים.
      [תשובה מנצחת] - תסריט מושלם ומפורט לתשובה האידיאלית לשאלה הזו, תוך שימוש בניסיון הצבאי כיתרון.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text;
      const parse = (tag: string) => {
        const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\[|$)`, 'i');
        const match = text.match(regex);
        return match ? match[1].trim() : "";
      };

      const positives = parse('חוזקות').split('\n').map(l => l.replace(/^•\s*/, '').trim()).filter(Boolean);
      const improvements = parse('לשיפור').split('\n').map(l => l.replace(/^•\s*/, '').trim()).filter(Boolean);
      
      setFeedback({ 
        score: parseInt(parse('ציון')) || 70,
        summary: parse('סיכום'),
        positives, 
        improvements, 
        militaryCivTranslation: parse('תרגום לאזרחית'), 
        sampleAnswer: parse('תשובה מנצחת') 
      });
      setStep('feedback');
    } catch (e) {
      alert("חלה שגיאה בניתוח התשובה.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (feedback?.sampleAnswer) {
      navigator.clipboard.writeText(feedback.sampleAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl overflow-hidden min-h-[700px] flex flex-col">
      <div className="bg-gray-900 p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-blue-600 p-5 rounded-3xl shadow-lg shadow-blue-900/20">
            <BrainCircuit size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight">מאמן הראיונות האישי</h3>
            <p className="text-gray-400 font-medium">הכנה מבוססת AI לתפקיד: <span className="text-blue-400">{role || 'טרם נבחר'}</span></p>
          </div>
        </div>
        {step === 'interview' || step === 'feedback' ? (
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
             <div className="text-left">
               <span className="text-[10px] block text-gray-500 font-black uppercase tracking-widest">התקדמות</span>
               <span className="text-lg font-black text-white">{currentIndex + 1} / {questions.length}</span>
             </div>
          </div>
        ) : null}
      </div>

      <div className="p-12 flex-1 flex flex-col bg-gray-50/30">
        {step === 'intro' && (
          <div className="text-center space-y-12 animate-in fade-in duration-700 max-w-3xl mx-auto my-auto">
            <div className="relative inline-block">
               <div className="w-32 h-32 bg-white text-blue-600 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl border border-gray-50">
                 <MessageSquare size={60} />
               </div>
               <div className="absolute -top-4 -right-4 bg-yellow-400 p-3 rounded-2xl shadow-lg animate-bounce">
                 <Zap size={24} className="text-gray-900" />
               </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-5xl font-black text-gray-900 leading-tight">בוא נתחיל להתאמן!</h4>
              <p className="text-xl text-gray-500 leading-relaxed font-medium">
                הסימולטור יציג לך שאלות שמעסיקים באמת שואלים. אתה תענה, וה-AI ינתח את התשובה שלך וייתן לך <span className="text-blue-600 font-black">תשובה מנצחת</span> מוכנה לשימוש.
              </p>
            </div>
            <button 
              onClick={() => setStep('setup')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black py-7 px-16 rounded-[32px] shadow-2xl shadow-blue-200 transition-all transform hover:scale-105 flex items-center justify-center gap-4 text-2xl mx-auto"
            >
              אני מוכן, בוא נתחיל
              <ArrowRight size={28} />
            </button>
          </div>
        )}

        {step === 'setup' && (
          <div className="w-full max-w-2xl space-y-12 animate-in slide-in-from-bottom-10 mx-auto my-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { title: 'אבטחה וחירום', value: 'מאבטח במוסד ממשלתי או איש ביטחון', icon: <Shield size={20} /> },
                 { title: 'שירות ומכירה', value: 'נציג שירות ומכירה בחברה גדולה', icon: <Phone size={20} /> },
                 { title: 'טכני ותחזוקה', value: 'טכנאי שטח או איש תחזוקה טכני', icon: <Zap size={20} /> },
                 { title: 'מנהלה ומשא"נ', value: 'רכז גיוס או עוזר משאבי אנוש', icon: <Users size={20} /> },
               ].map((s, idx) => (
                 <button 
                  key={idx} 
                  onClick={() => startInterview(s.value)}
                  className="bg-white hover:bg-blue-50 border-2 border-gray-100 hover:border-blue-300 p-6 rounded-[32px] text-right transition-all group shadow-sm flex items-center justify-between"
                 >
                   <span className="font-black text-gray-800 text-lg">{s.title}</span>
                 </button>
               ))}
            </div>
            <div className="space-y-6">
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="או הקלד תפקיד חופשי..."
                className="w-full p-7 bg-white border-2 border-gray-100 rounded-[32px] shadow-sm focus:border-blue-500 outline-none text-xl transition-all"
              />
              <button 
                onClick={() => startInterview()}
                disabled={isLoading || !role.trim()}
                className="w-full bg-gray-900 hover:bg-black text-white py-7 rounded-[32px] font-black text-xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "בנה לי ראיון מותאם אישית"}
              </button>
            </div>
          </div>
        )}

        {step === 'interview' && (
          <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            <div className="bg-white p-12 rounded-[56px] border border-blue-100 text-center relative shadow-xl shadow-blue-900/5">
              <h4 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                "{questions[currentIndex]}"
              </h4>
            </div>
            <textarea 
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="כתבו כאן איך הייתם עונים..."
              className="w-full h-64 p-10 bg-white border-2 border-gray-100 rounded-[48px] focus:border-blue-500 outline-none text-2xl transition-all shadow-inner"
            />
            <button 
              onClick={analyzeAnswer}
              disabled={isLoading || !userAnswer.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-8 rounded-[40px] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "נתח תשובה וקבל המלצות"}
            </button>
          </div>
        )}

        {step === 'feedback' && feedback && (
          <div className="w-full space-y-10 animate-in slide-in-from-bottom-12 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
               <div className="lg:col-span-1 bg-white rounded-[40px] p-8 border border-gray-100 shadow-lg flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-blue-600">{feedback.score}</span>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">ציון</span>
               </div>
               <div className="lg:col-span-3 bg-gray-900 rounded-[40px] p-10 text-white flex items-center">
                  <h4 className="text-2xl font-black italic">"{feedback.summary}"</h4>
               </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-[40px] p-10 border border-gray-100 space-y-6 shadow-sm">
                <h5 className="font-black text-green-600 text-xl">חוזקות</h5>
                <ul className="space-y-4">
                  {feedback.positives.map((p: string, i: number) => <li key={i} className="flex gap-4 font-bold">{p}</li>)}
                </ul>
              </div>
              <div className="bg-white rounded-[40px] p-10 border border-gray-100 space-y-6 shadow-sm">
                <h5 className="font-black text-orange-600 text-xl">שיפורים</h5>
                <ul className="space-y-4">
                  {feedback.improvements.map((p: string, i: number) => <li key={i} className="flex gap-4 font-bold">{p}</li>)}
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-[56px] border-4 border-blue-50 p-12 space-y-8 shadow-xl">
               <h5 className="text-3xl font-black text-gray-900">התשובה המנצחת שלך</h5>
               <p className="text-2xl text-gray-800 leading-loose italic">{feedback.sampleAnswer}</p>
            </div>
            <button 
              onClick={() => { setCurrentIndex(prev => prev + 1); setStep('interview'); setFeedback(null); setUserAnswer(''); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-8 rounded-[40px] font-black text-2xl shadow-2xl transition-all"
            >
              לשאלה הבאה
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- AI Job Search Engine Component ---
const OpenWebJobSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ jobs: any[], sources: GroundingSource[] } | null>(null);

  const searchJobs = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;
    setIsLoading(true);
    setResults(null);
    
    try {
      const data = await geminiService.searchJobs(query);
      const jobs: any[] = [];
      const jobSections = data.text.split(/\[משרה\]/i).filter(Boolean);
      jobSections.forEach((section) => {
        const title = section.match(/כותרת:\s*(.*)/i)?.[1] || "לא צוין";
        const company = section.match(/חברה:\s*(.*)/i)?.[1] || "חברה לא ידועה";
        const location = section.match(/מיקום:\s*(.*)/i)?.[1] || "מיקום לא צוין";
        const description = section.match(/תיאור:\s*(.*)/i)?.[1] || "";
        jobs.push({ title, company, location, description });
      });
      setResults({ jobs, sources: data.sources });
    } catch (err) {
      alert("חלה שגיאה בחיפוש המשרות.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-2xl max-w-4xl mx-auto">
        <form onSubmit={searchJobs} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש משרה בכל הרשת (למשל: נהג משאית, מתכנת...)"
            className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-[32px] focus:bg-white outline-none text-xl transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-6 px-12 rounded-[32px] shadow-lg transition-all flex items-center justify-center gap-3 text-xl"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
            חפש
          </button>
        </form>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {results.jobs.map((job, i) => (
            <div key={i} className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col group border-t-4 border-t-blue-500">
               <h4 className="text-2xl font-black text-gray-900 mb-2">{job.title}</h4>
               <p className="text-gray-500 font-bold mb-4">{job.company} | {job.location}</p>
               <p className="text-gray-600 leading-relaxed mb-8 flex-1">{job.description}</p>
               {results.sources[i] && (
                 <a href={results.sources[i].uri} target="_blank" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-center flex items-center justify-center gap-2">
                   למשרה באתר <ExternalLink size={20} />
                 </a>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---
const EmploymentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cv' | 'interview' | 'search' | 'guide'>('cv');

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-16 no-print">
        <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter">המרכז לקריירה מתקדמת</h2>
        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
          אל תשאיר את העתיד שלך ליד המקרה. השתמש בבינה המלאכותית ובמדריכים המקצועיים שלנו כדי להצליח בחיים האזרחיים.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-5 mb-16 no-print">
        {[
          { id: 'cv', label: 'בניית קורות חיים', icon: <FileText size={24} /> },
          { id: 'interview', label: 'מאמן ראיונות AI', icon: <UserCheck size={24} /> },
          { id: 'guide', label: 'מדריך שפת גוף', icon: <Zap size={24} /> },
          { id: 'search', label: 'חיפוש משרות בכל הרשת', icon: <Globe size={24} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-6 rounded-[40px] font-black transition-all transform active:scale-95 shadow-lg ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-blue-200 ring-8 ring-blue-50' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
        {activeTab === 'cv' && <CVBuilder />}
        {activeTab === 'interview' && <InterviewSimulator />}
        {activeTab === 'guide' && <InterviewGuide />}
        {activeTab === 'search' && <OpenWebJobSearch />}
      </div>
    </div>
  );
};

export default EmploymentPage;
