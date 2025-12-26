
import React, { useState } from 'react';
import { geminiService, GroundingSource } from '../services/gemini';
import { FAQS, getIcon } from '../constants';
import { 
  Search, 
  Loader2, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Lightbulb, 
  Target, 
  ClipboardCheck, 
  ArrowLeftCircle,
  Sparkles,
  Zap
} from 'lucide-react';

const CATEGORY_INFO: Record<string, string> = {
  'מענקים ופיקדון': 'זכויות כספיות, מענקי שחרור ופיקדון אישי.',
  'לימודים והכשרה': 'מלגות, מימון לימודים וקורסים מקצועיים.',
  'דיור והתיישבות': 'הטבות בנייה, מענקי שיכון וסיוע בדיור.',
  'זכויות עבודה ומס': 'נקודות זיכוי, זכויות בראיונות והעדפה מתקנת.',
};

const RightsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, sources: GroundingSource[], category?: string } | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const performSearch = async (query: string, categoryTitle?: string) => {
    setIsLoading(true);
    setResult(null);
    window.scrollTo({ top: 100, behavior: 'smooth' });
    
    const data = await geminiService.searchRights(query);
    setResult({ ...data, category: categoryTitle });
    setIsLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isLoading) return;
    performSearch(searchQuery);
  };

  const handleCategoryClick = (title: string) => {
    setSearchQuery(title);
    const detailedQuery = `מידע מפורט ועדכני על ${title} לחיילים משוחררים מהעדה הדרוזית`;
    performSearch(detailedQuery, title);
  };

  // Helper to parse structured AI responses with type literals for discriminated union narrowing
  const parseStructuredText = (text: string) => {
    const sections = {
      summary: '',
      keyPoints: [] as string[],
      actions: [] as string[],
      other: ''
    };

    const parts = text.split(/\[(.*?)\]/);
    for (let i = 1; i < parts.length; i += 2) {
      const title = parts[i].trim();
      const content = parts[i + 1]?.trim() || '';
      
      if (title.includes('תקציר')) sections.summary = content;
      else if (title.includes('נקודות')) {
        sections.keyPoints = content.split('\n').map(line => line.replace(/^[-*•\d.]+\s*/, '').trim()).filter(Boolean);
      }
      else if (title.includes('הנחיות')) {
        sections.actions = content.split('\n').map(line => line.replace(/^[-*•\d.]+\s*/, '').trim()).filter(Boolean);
      }
      else {
        sections.other += content;
      }
    }

    if (!sections.summary && !sections.keyPoints.length) {
       return { isStructured: false as const, content: text };
    }

    return { isStructured: true as const, ...sections };
  };

  const categories = [
    { title: 'מענקים ופיקדון', icon: 'CreditCard', color: 'bg-green-500' },
    { title: 'לימודים והכשרה', icon: 'GraduationCap', color: 'bg-blue-500' },
    { title: 'דיור והתיישבות', icon: 'Building', color: 'bg-yellow-500' },
    { title: 'זכויות עבודה ומס', icon: 'Scale', color: 'bg-purple-500' },
  ];

  const parsed = result ? parseStructuredText(result.text) : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header & Search */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">מרכז המידע לזכויות</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          כאן תוכל למצוא תשובות מהירות ומדויקות בנוגע לזכויות שלך לאחר השירות.
        </p>
        
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-10 group">
          <div className="absolute inset-0 bg-blue-100 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="למשל: מה מגיע לי בתור סטודנט דרוזי?"
              className="w-full pl-20 pr-8 py-5 bg-white border-2 border-gray-100 rounded-3xl shadow-xl focus:border-blue-500 focus:outline-none transition-all text-lg placeholder:text-gray-300"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute left-3 top-3 bottom-3 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={22} />}
              <span className="font-bold">חפש</span>
            </button>
          </div>
        </form>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleCategoryClick(cat.title)}
              className={`group p-4 bg-white rounded-3xl border-2 transition-all text-center flex flex-col items-center gap-3 shadow-sm hover:shadow-xl ${
                result?.category === cat.title ? 'border-blue-500 bg-blue-50 scale-105' : 'border-transparent hover:border-blue-100'
              }`}
            >
              <div className={`${cat.color} p-4 rounded-2xl text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                {getIcon(cat.icon)}
              </div>
              <h4 className="font-bold text-gray-800 text-sm whitespace-nowrap">{cat.title}</h4>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {isLoading ? (
          <div className="bg-white rounded-3xl p-16 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">סורק זכויות ומאגרים...</h3>
              <p className="text-gray-500">אנו מעבדים את המידע העדכני ביותר מרשות הפיתוח ומשרד הביטחון</p>
            </div>
          </div>
        ) : result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            
            {/* Structured Result Display - Using explicit null and literal check for narrowing */}
            {parsed && parsed.isStructured ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Executive Summary - Full width top */}
                <div className="md:col-span-3 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl border-t-4 border-t-blue-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <Zap size={20} />
                    </div>
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-wide">תקציר מהיר</h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed font-medium italic">
                    {parsed.summary}
                  </p>
                </div>

                {/* 2. Key Points List */}
                <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                      <Target size={20} />
                    </div>
                    <h3 className="text-xl font-black text-gray-800">מה מגיע לך?</h3>
                  </div>
                  <ul className="space-y-4">
                    {parsed.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-4 group">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 shrink-0 group-hover:scale-150 transition-transform"></div>
                        <span className="text-gray-700 font-bold group-hover:text-gray-900 transition-colors">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Action Items Side */}
                <div className="md:col-span-1 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 border border-orange-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-600 p-2 rounded-lg text-white">
                      <ClipboardCheck size={20} />
                    </div>
                    <h3 className="text-xl font-black text-orange-900">הנחיות לפעולה</h3>
                  </div>
                  <div className="space-y-5">
                    {parsed.actions.map((action, i) => (
                      <div key={i} className="bg-white/80 p-4 rounded-2xl border border-orange-200 shadow-sm flex items-start gap-3">
                        <ArrowLeftCircle className="text-orange-500 mt-1 shrink-0" size={18} />
                        <span className="text-sm font-bold text-orange-800 leading-snug">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Sources and Footer */}
                <div className="md:col-span-3 bg-gray-900 rounded-3xl p-8 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <h4 className="font-bold text-lg mb-2">מקורות וקישורים להמשך טיפול</h4>
                      <p className="text-gray-400 text-sm">לחץ על הקישורים למעבר ישיר לאתרי הממשלה והגשת טפסים</p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {result.sources.map((source, i) => (
                        <a
                          key={i}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-gray-900 text-xs px-5 py-3 rounded-2xl border border-white/20 transition-all font-bold"
                        >
                          <ExternalLink size={14} />
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* Fallback to original text display if structure fails */
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 px-8 py-5 border-b border-blue-700 flex items-center justify-between text-white">
                  <h3 className="font-bold flex items-center gap-2 text-xl">
                    <Info size={22} />
                    {result.category ? `זכויות בנושא: ${result.category}` : 'תוצאות חיפוש'}
                  </h3>
                </div>
                <div className="p-8">
                  <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {result.text}
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setResult(null)}
              className="mx-auto block text-gray-400 hover:text-blue-600 font-bold transition-colors py-4"
            >
              נקה תוצאות וחזור לחיפוש
            </button>
          </div>
        ) : (
          <div className="bg-blue-50/50 rounded-3xl p-16 border-2 border-dashed border-blue-100 text-center space-y-6">
            <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-sm rotate-3">
              <Lightbulb size={32} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-blue-900 mb-2">בחר נושא שמעניין אותך</h3>
              <p className="text-blue-600/70 max-w-md mx-auto">מערכת ה-AI שלנו תרכז עבורך את כל הזכויות העדכניות ביותר מהאתרים הרשמיים.</p>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 space-y-6">
          <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-2 bg-blue-600 rounded-full"></div>
            שאלות נפוצות
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className={`w-full px-8 py-5 flex items-center justify-between text-right transition-colors ${
                    expandedFaq === i ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`font-bold ${expandedFaq === i ? 'text-blue-700' : 'text-gray-700'}`}>
                    {faq.question}
                  </span>
                  {expandedFaq === i ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                {expandedFaq === i && (
                  <div className="px-8 pb-6 text-sm text-gray-600 animate-in slide-in-from-top-2 duration-300">
                    <div className="h-px bg-gray-100 mb-6" />
                    <p className="leading-relaxed font-medium">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightsPage;
