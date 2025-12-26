
import React, { useState } from 'react';
import { ACADEMIC_INSTITUTIONS } from '../constants';
import { geminiService, GroundingSource } from '../services/gemini';
import { Scholarship } from '../types';
import { 
  ExternalLink, 
  GraduationCap, 
  School, 
  Book, 
  MapPin, 
  Search, 
  Loader2, 
  Info, 
  Sparkles,
  ChevronLeft,
  Calendar
} from 'lucide-react';

interface AcademiaPageProps {
  scholarships: Scholarship[];
}

const AcademiaPage: React.FC<AcademiaPageProps> = ({ scholarships }) => {
  const [activeTab, setActiveTab] = useState<'scholarships' | 'institutions'>('scholarships');
  const [filterType, setFilterType] = useState<'all' | 'university' | 'college'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarshipSearch, setScholarshipSearch] = useState('');
  
  // AI Search State
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiResult, setAiResult] = useState<{ text: string, sources: GroundingSource[] } | null>(null);

  const filteredScholarships = (scholarships || []).filter(s => 
    s.name.toLowerCase().includes(scholarshipSearch.toLowerCase()) || 
    s.provider.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
    s.description.toLowerCase().includes(scholarshipSearch.toLowerCase())
  );

  const filteredInstitutions = ACADEMIC_INSTITUTIONS.filter(inst => {
    const matchesType = filterType === 'all' || inst.type === filterType;
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inst.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAiSearch = async () => {
    if (isAiSearching) return;
    setIsAiSearching(true);
    setAiResult(null);
    
    const query = scholarshipSearch.trim() 
      ? `מצא מלגות עדכניות עבור: ${scholarshipSearch} לחיילים משוחררים דרוזים` 
      : "מצא רשימת מלגות עדכניות לסטודנטים בני העדה הדרוזית וחיילים משוחררים בישראל לשנת 2024-2025";
    
    const result = await geminiService.searchRights(query);
    setAiResult(result);
    setIsAiSearching(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">אקדמיה והשכלה גבוהה</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          מצא את המוסד הלימודי המתאים לך וגלה מלגות ייעודיות שיעזרו לך לממן את התואר.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'scholarships' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Book size={18} />
            מלגות ייעודיות
          </button>
          <button
            onClick={() => setActiveTab('institutions')}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'institutions' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <School size={18} />
            מוסדות אקדמיים
          </button>
        </div>
      </div>

      {/* Scholarships Content */}
      {activeTab === 'scholarships' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Scholarship Search & AI Button */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="חפש מלגה (למשל: 'לוחמים', 'דרוזית', 'משרד רה''מ')..."
                value={scholarshipSearch}
                onChange={(e) => setScholarshipSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border-2 border-blue-50 rounded-2xl shadow-sm focus:border-blue-500 focus:outline-none transition-all"
              />
              <Search className="absolute left-4 top-4.5 text-gray-400" size={20} />
            </div>
            <button
              onClick={handleAiSearch}
              disabled={isAiSearching}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isAiSearching ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              חפש במאגר ה-AI העולמי
            </button>
          </div>

          {/* AI Results Section */}
          {aiResult && (
            <div className="bg-purple-50 rounded-3xl p-8 border border-purple-100 shadow-sm animate-in slide-in-from-top-4 duration-500 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-600 p-2 rounded-lg text-white">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-bold text-purple-900">תוצאות סריקת מלגות בזמן אמת</h3>
              </div>
              <div className="prose prose-purple max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
                {aiResult.text}
              </div>
              {aiResult.sources.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {aiResult.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white hover:bg-purple-100 text-purple-700 text-sm px-4 py-2 rounded-xl border border-purple-200 transition-all font-medium"
                    >
                      <ExternalLink size={14} />
                      {source.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <Book className="text-blue-600" size={22} />
            מלגות קיימות במאגר
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((s) => (
              <div key={s.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col group">
                <div className="bg-gradient-to-l from-blue-700 to-blue-500 p-6">
                  <span className="text-xs text-blue-100 block mb-1 font-medium">{s.provider}</span>
                  <h4 className="text-xl font-bold text-white leading-tight">{s.name}</h4>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">{s.amount}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={12} className="text-gray-300" />
                      דדליין: {s.deadline}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-6 flex-1 leading-relaxed">{s.description}</p>
                  
                  <div className="space-y-3">
                    {s.instructions && (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-[11px] text-blue-700 font-bold flex items-center gap-1">
                          <Info size={12} />
                          הנחיות להגשה:
                        </p>
                        <p className="text-[11px] text-blue-600 mt-1 whitespace-pre-wrap">{s.instructions}</p>
                      </div>
                    )}
                    
                    {s.link ? (
                      <a 
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                      >
                        מעבר לאתר ההגשה / לקובץ
                        <ExternalLink size={16} />
                      </a>
                    ) : (
                      <button className="w-full py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl cursor-not-allowed">
                        ההרשמה טרם נפתחה
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredScholarships.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">לא מצאנו מלגות שתואמות את החיפוש שלך במאגר המקומי</p>
              <button 
                onClick={handleAiSearch}
                className="mt-4 text-blue-600 font-bold hover:underline flex items-center gap-1 mx-auto"
              >
                נסה לחפש במאגר ה-AI העולמי
                <ChevronLeft size={16} className="mt-0.5" />
              </button>
            </div>
          )}

          {/* Useful links for scholarships */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-6">מאגרי מלגות מומלצים נוספים:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'אתר "מלגות"', url: 'https://www.milgot.co.il/' },
                { name: 'לימודים בישראל - מלגות', url: 'https://www.universities-colleges.org.il/' },
                { name: 'האגף והקרן לחיילים משוחררים', url: 'https://www.hachvana.mod.gov.il/' },
                { name: 'כל-זכות: מלגות לימודים', url: 'https://www.kolzuchut.org.il/he/%D7%9E%D7%9C%D7%92%D7%95%D7%AA_%D7%9C%D7%9C%D7%99%D7%9E%D7%95%D7%93%D7%99%D7%9D' }
              ].map((site, i) => (
                <a
                  key={i}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between"
                >
                  <span className="text-sm font-bold text-gray-700">{site.name}</span>
                  <ExternalLink size={14} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Institutions Content */}
      {activeTab === 'institutions' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex gap-2 w-full md:w-auto">
              {[
                { id: 'all', label: 'הכל' },
                { id: 'university', label: 'אוניברסיטאות' },
                { id: 'college', label: 'מכללות' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilterType(t.id as any)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    filterType === t.id ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="חפש מוסד או עיר..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map((inst, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-lg transition-all flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center overflow-hidden border border-gray-100 p-2">
                  <img 
                    src={inst.logo} 
                    alt={inst.name} 
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(inst.name)}&background=f1f5f9&color=64748b&bold=true`;
                    }}
                  />
                </div>
                <div className="mb-2">
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full mb-2 inline-block ${
                    inst.type === 'university' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {inst.type === 'university' ? 'אוניברסיטה' : 'מכללה אקדמית'}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{inst.name}</h4>
                <p className="text-xs text-gray-400 flex items-center gap-1 justify-center mb-6">
                  <MapPin size={12} />
                  {inst.location}
                </p>
                <a
                  href={inst.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-auto py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  ביקור באתר המוסד
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>

          {filteredInstitutions.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">לא מצאנו מוסדות שתואמים את החיפוש שלך</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcademiaPage;
