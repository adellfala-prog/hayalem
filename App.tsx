
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ResourceCard from './components/ResourceCard';
import ChatBot from './components/ChatBot';
import AcademiaPage from './components/AcademiaPage';
import RightsPage from './components/RightsPage';
import EmploymentPage from './components/EmploymentPage';
import ContactPage from './components/ContactPage';
import AdminPanel from './components/AdminPanel';
import BlogDetailPage from './components/BlogDetailPage';
import { RESOURCES, INITIAL_WORKSHOPS, INITIAL_NEWS, INITIAL_BLOG, SCHOLARSHIPS, getIcon } from './constants';
import { Workshop, NewsItem, BlogPost, Scholarship } from './types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, MapPin, ArrowLeft, ShieldCheck, Bell, Newspaper, FileText, User, ChevronLeft, ChevronRight, Info } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // News Slider State
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const newsIntervalRef = useRef<number | null>(null);

  // Initial Load
  useEffect(() => {
    const savedWorkshops = localStorage.getItem('druze_workshops');
    const savedNews = localStorage.getItem('druze_news');
    const savedBlog = localStorage.getItem('druze_blog');
    const savedScholarships = localStorage.getItem('druze_scholarships');

    setWorkshops(savedWorkshops ? JSON.parse(savedWorkshops) : INITIAL_WORKSHOPS);
    setNews(savedNews ? JSON.parse(savedNews) : INITIAL_NEWS);
    setBlog(savedBlog ? JSON.parse(savedBlog) : INITIAL_BLOG);
    setScholarships(savedScholarships ? JSON.parse(savedScholarships) : SCHOLARSHIPS);
    setIsDataLoaded(true);
  }, []);

  // Persistence Sync
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('druze_workshops', JSON.stringify(workshops));
      localStorage.setItem('druze_news', JSON.stringify(news));
      localStorage.setItem('druze_blog', JSON.stringify(blog));
      localStorage.setItem('druze_scholarships', JSON.stringify(scholarships));
    }
  }, [workshops, news, blog, scholarships, isDataLoaded]);

  // News Auto Slider Logic
  useEffect(() => {
    if (newsIntervalRef.current) clearInterval(newsIntervalRef.current);
    
    if (news.length > 1) {
      newsIntervalRef.current = window.setInterval(() => {
        setActiveNewsIndex(prev => (prev + 1) % news.length);
      }, 5000);
    }
    return () => {
      if (newsIntervalRef.current) clearInterval(newsIntervalRef.current);
    };
  }, [news]);

  const statsData = [
    { name: 'אקדמיה', value: 45, color: '#2563eb' },
    { name: 'תעסוקה', value: 35, color: '#10b981' },
    { name: 'שירות המדינה', value: 20, color: '#f59e0b' },
  ];

  const handleReadFullArticle = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setCurrentPage('blog-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-20">
            <Hero 
              onStartChat={() => setCurrentPage('chat')} 
              onViewRights={() => setCurrentPage('rights')}
            />
            
            {/* News Fading Slider Section */}
            <section className="container mx-auto px-4">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-red-100 p-3 rounded-2xl text-red-600 animate-pulse">
                  <Bell size={24} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">מבזקים ועדכונים חמים</h3>
              </div>
              
              {news.length > 0 ? (
                <div className="relative h-[450px] md:h-[500px] w-full group overflow-hidden rounded-[48px] shadow-2xl bg-gray-900 border border-gray-100">
                  {news.map((item, idx) => (
                    <div 
                      key={item.id}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col md:flex-row ${
                        idx === activeNewsIndex ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' : 'opacity-0 translate-x-12 scale-105 pointer-events-none'
                      }`}
                    >
                      {/* Image Area */}
                      <div className="h-1/2 md:h-full md:w-1/2 relative overflow-hidden">
                        <img 
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1544919924-f7615950821e?q=80&w=1200'} 
                          className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110" 
                          alt={item.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent md:bg-gradient-to-l md:from-gray-900 md:via-transparent md:to-transparent"></div>
                        {item.isUrgent && (
                          <div className="absolute top-6 right-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg animate-bounce">
                            דחוף
                          </div>
                        )}
                      </div>
                      
                      {/* Content Area */}
                      <div className="h-1/2 md:h-full md:w-1/2 bg-gray-900 p-8 md:p-16 flex flex-col justify-center text-white text-right">
                        <span className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-4 block">
                          {item.date}
                        </span>
                        <h4 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">
                          {item.title}
                        </h4>
                        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
                          {item.content}
                        </p>
                        <button 
                          onClick={() => setCurrentPage('rights')}
                          className="w-fit flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                        >
                          פרטים נוספים
                          <ArrowLeft size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Navigation Controls */}
                  {news.length > 1 && (
                    <>
                      <div className="absolute bottom-8 right-8 flex gap-4 z-20">
                        <button 
                          onClick={() => setActiveNewsIndex(prev => (prev - 1 + news.length) % news.length)}
                          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md transition-all flex items-center justify-center border border-white/20"
                        >
                          <ChevronRight size={24} />
                        </button>
                        <button 
                          onClick={() => setActiveNewsIndex(prev => (prev + 1) % news.length)}
                          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md transition-all flex items-center justify-center border border-white/20"
                        >
                          <ChevronLeft size={24} />
                        </button>
                      </div>

                      {/* Indicators */}
                      <div className="absolute bottom-8 left-8 flex gap-2 z-20">
                        {news.map((_, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setActiveNewsIndex(idx)}
                            className={`h-1.5 transition-all duration-300 rounded-full ${
                              idx === activeNewsIndex ? 'w-12 bg-blue-500' : 'w-4 bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-[48px] h-[300px] flex flex-col items-center justify-center text-center p-8 space-y-4 border-2 border-dashed border-gray-200">
                  <div className="p-4 bg-white rounded-2xl text-gray-400">
                    <Info size={32} />
                  </div>
                  <h4 className="text-xl font-black text-gray-800">אין מבזקים להצגה כרגע</h4>
                  <p className="text-gray-500 font-bold">המנהלים יעלו עדכונים בקרוב</p>
                </div>
              )}
            </section>

            {/* Core Guidance Areas */}
            <section className="container mx-auto px-4">
              <h3 className="text-3xl font-black text-gray-900 mb-12 text-center">הכוונה לדרך החדשה</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {RESOURCES.map((res) => (
                  <div key={res.id} onClick={() => {
                    if (res.id === '1') setCurrentPage('rights');
                    if (res.id === '2') setCurrentPage('academia');
                    if (res.id === '3') setCurrentPage('employment');
                  }} className="cursor-pointer transition-transform hover:scale-105">
                    <ResourceCard resource={res} />
                  </div>
                ))}
              </div>
            </section>

            {/* Blog & Articles Section */}
            <section className="bg-slate-900 py-24 text-white">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-blue-400 font-black tracking-widest uppercase text-xs">
                      <Newspaper size={16} />
                      בלוג ומאמרים
                    </div>
                    <h3 className="text-5xl font-black tracking-tighter">סיפורי גבורה והצלחה</h3>
                  </div>
                  <p className="text-gray-400 max-w-md font-medium">השראה, ידע ומורשת - כל הכלים שאתה צריך כדי להבין את השורשים ולפרוץ קדימה.</p>
                </div>
                
                {blog.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {blog.map(post => (
                      <div 
                        key={post.id} 
                        onClick={() => handleReadFullArticle(post)}
                        className="bg-white/5 border border-white/10 rounded-[48px] overflow-hidden flex flex-col md:flex-row hover:bg-white/10 transition-all group text-right cursor-pointer"
                      >
                        <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                          <img src={post.imageUrl || 'https://images.unsplash.com/photo-1544919924-f7615950821e?q=80&w=800&auto=format&fit=crop'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                          <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{post.category}</div>
                        </div>
                        <div className="p-8 md:w-1/2 flex flex-col">
                          <span className="text-gray-500 text-[10px] font-black block mb-4">{post.date} | מאת {post.author}</span>
                          <h4 className="text-2xl font-black mb-4 leading-tight group-hover:text-blue-400 transition-colors">{post.title}</h4>
                          <p className="text-gray-400 text-sm mb-8 leading-relaxed flex-1">{post.summary}</p>
                          <button 
                            className="flex items-center gap-2 text-blue-400 font-black hover:text-blue-300 transition-colors group/btn"
                          >
                            קרא את המאמר המלא
                            <ChevronLeft className="group-hover/btn:translate-x-[-4px] transition-transform" size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-white/10 rounded-[48px] bg-white/5">
                    <p className="text-gray-500 font-bold">בקרוב יעלו מאמרים וסיפורי הצלחה חדשים</p>
                  </div>
                )}
              </div>
            </section>

            {/* Workshops & Lectures Section */}
            <section className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-black text-gray-900 mb-4">סדנאות והרצאות קרובות</h3>
                <p className="text-gray-600 max-w-2xl mx-auto font-medium">הצטרפו למפגשי הכשרה מקצועיים ולערבי מורשת מרתקים בכפרי העדה.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-right">
                {workshops.map((workshop) => (
                  <div key={workshop.id} className="bg-white rounded-[32px] p-8 border border-gray-100 flex flex-col hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${workshop.type === 'soldier' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {getIcon(workshop.icon)}
                      </div>
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-3">{workshop.title}</h4>
                    <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">{workshop.description}</p>
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-500"><Calendar size={14} />{workshop.date}</div>
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-500"><MapPin size={14} />{workshop.location}</div>
                    </div>
                    <button onClick={() => setCurrentPage('contact')} className="w-full py-4 bg-gray-50 text-gray-800 font-black rounded-2xl hover:bg-gray-900 hover:text-white transition-all">הרשמה למפגש</button>
                  </div>
                ))}
              </div>
            </section>

            {/* Statistics */}
            <section className="bg-gray-50 py-24">
              <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8 text-right">
                  <h3 className="text-4xl font-black text-gray-900 tracking-tight">לאן ממשיכים המשוחררים?</h3>
                  <p className="text-gray-600 leading-relaxed text-lg font-medium">רוב החיילים המשוחררים בני העדה פונים כיום למסלולי אקדמיה ותעסוקה טכנולוגית. אנחנו כאן כדי לוודא שיש לך את כל הכלים להשתלב במקומות הטובים ביותר.</p>
                  <div className="space-y-4">
                    {statsData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:translate-x-[-10px]">
                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-black text-gray-700">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-[400px] bg-white rounded-[48px] shadow-2xl p-8 border border-gray-100 relative group overflow-hidden flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statsData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value" animationDuration={1500}>
                        {statsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-2xl font-black text-gray-400 group-hover:text-blue-600 transition-colors">2025</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      case 'admin':
        return (
          <AdminPanel 
            workshops={workshops} onUpdateWorkshops={setWorkshops} 
            news={news} onUpdateNews={setNews}
            blog={blog} onUpdateBlog={setBlog}
            scholarships={scholarships} onUpdateScholarships={setScholarships}
            onExit={() => setCurrentPage('home')} 
          />
        );
      case 'blog-detail':
        return selectedBlogPost ? (
          <BlogDetailPage 
            post={selectedBlogPost} 
            onBack={() => { setCurrentPage('home'); setSelectedBlogPost(null); window.scrollTo({ top: 1500, behavior: 'smooth' }); }} 
          />
        ) : <div className="text-center py-32"><button onClick={() => setCurrentPage('home')}>חזרה הביתה</button></div>;
      case 'chat': return <div className="container mx-auto px-4 py-8 max-w-4xl"><ChatBot /></div>;
      case 'rights': return <RightsPage />;
      case 'academia': return <AcademiaPage scholarships={scholarships} />;
      case 'employment': return <EmploymentPage />;
      case 'contact': return <ContactPage />;
      default: return <div className="text-center py-32"><button onClick={() => setCurrentPage('home')}>חזרה הביתה</button></div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="flex-1 pb-12">{renderContent()}</main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-right">
          <div>
            <h3 className="text-2xl font-black mb-6">כוון לדרוזים</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">הפלטפורמה המקיפה ביותר להכוונה וליווי של חיילים משוחררים בני העדה הדרוזית. אנחנו כאן כדי לגשר על הפער בין השירות הצבאי לחיים האזרחיים.</p>
            <button onClick={() => setCurrentPage('admin')} className="mt-6 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
              <ShieldCheck size={14} /> פאנל ניהול (מנהלים בלבד)
            </button>
          </div>
          <div>
            <h4 className="font-black text-lg mb-6 text-blue-400">קישורים מהירים</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-bold">
              <li><button onClick={() => setCurrentPage('rights')} className="hover:text-white transition-colors">זכויות המשתחרר</button></li>
              <li><button onClick={() => setCurrentPage('academia')} className="hover:text-white transition-colors">לוח מלגות</button></li>
              <li><button onClick={() => setCurrentPage('employment')} className="hover:text-white transition-colors">חיפוש עבודה</button></li>
              <li><button onClick={() => setCurrentPage('chat')} className="hover:text-white transition-colors">צ'אט בוט הכוונה AI</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-lg mb-6 text-blue-400">צור קשר</h4>
            <p className="text-sm text-gray-400 mb-6 font-medium">מעוניינים להתייעץ איתי באופן אישי?</p>
            <button onClick={() => setCurrentPage('contact')} className="w-full bg-white text-gray-900 px-6 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all shadow-xl">שלח הודעה לעאדל</button>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs font-black uppercase tracking-widest">
          &copy; {new Date().getFullYear()} כוון לדרוזים. כל הזכויות שמורות. נבנה בגאווה עבור הקהילה.
        </div>
      </footer>
    </div>
  );
};

export default App;
