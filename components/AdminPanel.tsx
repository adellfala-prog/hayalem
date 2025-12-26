
import React, { useState } from 'react';
import { Workshop, NewsItem, BlogPost, Scholarship } from '../types';
import { getIcon, AVAILABLE_ICONS } from '../constants';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Lock, 
  Calendar, 
  MapPin, 
  Type, 
  Layout,
  LayoutDashboard,
  Newspaper,
  FileText,
  Bell,
  User,
  Image as ImageIcon,
  Mic2,
  AlertCircle,
  Tag,
  Link,
  X,
  CreditCard,
  GraduationCap,
  Info
} from 'lucide-react';

interface AdminPanelProps {
  workshops: Workshop[];
  onUpdateWorkshops: (workshops: Workshop[]) => void;
  news: NewsItem[];
  onUpdateNews: (news: NewsItem[]) => void;
  blog: BlogPost[];
  onUpdateBlog: (blog: BlogPost[]) => void;
  scholarships: Scholarship[];
  onUpdateScholarships: (scholarships: Scholarship[]) => void;
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  workshops, onUpdateWorkshops, 
  news, onUpdateNews, 
  blog, onUpdateBlog, 
  scholarships, onUpdateScholarships,
  onExit 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'workshops' | 'news' | 'blog' | 'scholarships'>('workshops');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('סיסמה שגויה!');
    }
  };

  const handleAdd = () => {
    const newId = `${activeTab.charAt(0)}-${Date.now()}`;
    const today = new Date().toLocaleDateString('he-IL');
    
    let newItem: any;
    
    if (activeTab === 'workshops') {
      newItem = { id: newId, title: 'סדנה חדשה', description: '', type: 'soldier', date: today, location: '', icon: 'Mic2' };
      onUpdateWorkshops([newItem, ...workshops]);
    } else if (activeTab === 'news') {
      newItem = { id: newId, title: 'מבזק חדש', content: '', date: today, imageUrl: '', isUrgent: false };
      onUpdateNews([newItem, ...news]);
    } else if (activeTab === 'blog') {
      newItem = { id: newId, title: 'מאמר חדש', summary: '', content: '', author: 'עאדל פלאח', date: today, imageUrl: '', category: 'כללי' };
      onUpdateBlog([newItem, ...blog]);
    } else if (activeTab === 'scholarships') {
      newItem = { id: newId, name: 'מלגה חדשה', provider: '', amount: '₪0', deadline: '', description: '', link: '', instructions: '' };
      onUpdateScholarships([newItem, ...scholarships]);
    }

    setEditingId(newId);
    setEditForm(newItem);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך להסיר את הפריט הזה לצמיתות מהאתר?')) return;
    
    if (activeTab === 'workshops') {
      onUpdateWorkshops(workshops.filter(w => w.id !== id));
    } else if (activeTab === 'news') {
      onUpdateNews(news.filter(n => n.id !== id));
    } else if (activeTab === 'blog') {
      onUpdateBlog(blog.filter(b => b.id !== id));
    } else if (activeTab === 'scholarships') {
      onUpdateScholarships(scholarships.filter(s => s.id !== id));
    }

    if (editingId === id) {
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleSave = () => {
    if (!editForm.title && !editForm.name) {
      alert('חובה להזין כותרת לפני השמירה');
      return;
    }

    if (activeTab === 'workshops') {
      onUpdateWorkshops(workshops.map(w => w.id === editingId ? { ...w, ...editForm } : w));
    } else if (activeTab === 'news') {
      onUpdateNews(news.map(n => n.id === editingId ? { ...n, ...editForm } : n));
    } else if (activeTab === 'blog') {
      onUpdateBlog(blog.map(b => b.id === editingId ? { ...b, ...editForm } : b));
    } else if (activeTab === 'scholarships') {
      onUpdateScholarships(scholarships.map(s => s.id === editingId ? { ...s, ...editForm } : s));
    }
    
    setEditingId(null);
    setEditForm({});
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-gray-100 max-w-md w-full text-center space-y-8">
          <div className="bg-blue-600 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto shadow-xl">
            <Lock className="text-white" size={44} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900">כניסת מנהל</h2>
            <p className="text-gray-500 font-bold">הזן סיסמה לניהול דינמי של האתר</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="סיסמה (admin123)" 
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none text-center text-xl font-bold" 
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black shadow-xl transition-all">
              התחבר למערכת
            </button>
            <button type="button" onClick={onExit} className="text-gray-400 hover:text-gray-600 font-bold text-sm">חזרה לאתר</button>
          </form>
        </div>
      </div>
    );
  }

  const currentList = activeTab === 'workshops' ? workshops : activeTab === 'news' ? news : activeTab === 'blog' ? blog : scholarships;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900">ניהול תוכן דינמי</h2>
            <p className="text-gray-500 font-bold">הוספה, עריכה והסרה של תכנים בזמן אמת</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAdd} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl transition-all active:scale-95"
          >
            <Plus size={22} />
            הוסף פריט חדש
          </button>
          <button onClick={onExit} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-2xl font-black">חזרה</button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'workshops', label: 'סדנאות', icon: <Mic2 size={20}/> },
          { id: 'news', label: 'מבזקי חדשות', icon: <Bell size={20}/> },
          { id: 'blog', label: 'מאמרי בלוג', icon: <FileText size={20}/> },
          { id: 'scholarships', label: 'מלגות', icon: <GraduationCap size={20}/> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setEditingId(null); }}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all whitespace-nowrap border-2 ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-105' 
                : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {currentList.map((item: any) => (
          <div key={item.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-2 duration-300">
            {editingId === item.id ? (
              <div className="p-8 space-y-6 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Title / Name */}
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Type size={12}/> שם המלגה / כותרת</label>
                    <input 
                      type="text" 
                      value={activeTab === 'scholarships' ? editForm.name : editForm.title} 
                      onChange={e => setEditForm({...editForm, [activeTab === 'scholarships' ? 'name' : 'title']: e.target.value})} 
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold focus:border-blue-500 outline-none" 
                    />
                  </div>

                  {/* Date / Deadline */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12}/> {activeTab === 'scholarships' ? 'מועד אחרון להגשה' : 'תאריך'}</label>
                    <input 
                      type="text" 
                      value={activeTab === 'scholarships' ? editForm.deadline : editForm.date} 
                      onChange={e => setEditForm({...editForm, [activeTab === 'scholarships' ? 'deadline' : 'date']: e.target.value})} 
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold focus:border-blue-500 outline-none" 
                    />
                  </div>

                  {/* Scholarship Specific: Provider & Amount */}
                  {activeTab === 'scholarships' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><User size={12}/> נותן המלגה</label>
                        <input type="text" value={editForm.provider} onChange={e => setEditForm({...editForm, provider: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><CreditCard size={12}/> גובה המלגה</label>
                        <input type="text" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold" />
                      </div>
                      <div className="space-y-2 lg:col-span-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Link size={12}/> קישור להגשה / קישור לקובץ</label>
                        <input type="text" value={editForm.link} onChange={e => setEditForm({...editForm, link: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold" placeholder="https://..." />
                      </div>
                      <div className="space-y-2 lg:col-span-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Info size={12}/> הנחיות הגשה ומסמכים נדרשים</label>
                        <textarea 
                          value={editForm.instructions} 
                          onChange={e => setEditForm({...editForm, instructions: e.target.value})} 
                          className="w-full p-6 bg-white border border-gray-200 rounded-2xl outline-none h-24 font-medium shadow-inner" 
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for Workshops */}
                  {activeTab === 'workshops' && (
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><MapPin size={12}/> מיקום</label>
                      <input 
                        type="text" 
                        value={editForm.location} 
                        onChange={e => setEditForm({...editForm, location: e.target.value})} 
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold focus:border-blue-500 outline-none" 
                      />
                    </div>
                  )}

                  {/* Image URL for News and Blog */}
                  {(activeTab === 'news' || activeTab === 'blog') && (
                    <div className="space-y-2 lg:col-span-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Link size={12}/> קישור לתמונה (URL)</label>
                      <input 
                        type="text" 
                        value={editForm.imageUrl} 
                        onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} 
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold focus:border-blue-500 outline-none" 
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  )}

                  {/* News Specific: Urgent Toggle */}
                  {activeTab === 'news' && (
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><AlertCircle size={12}/> סוג מבזק</label>
                      <button 
                        onClick={() => setEditForm({...editForm, isUrgent: !editForm.isUrgent})}
                        className={`w-full p-4 rounded-xl font-black border transition-all ${
                          editForm.isUrgent ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >
                        {editForm.isUrgent ? 'מבזק דחוף!' : 'מבזק רגיל'}
                      </button>
                    </div>
                  )}

                  {/* Blog Specific: Author & Category */}
                  {activeTab === 'blog' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><User size={12}/> מחבר</label>
                        <input type="text" value={editForm.author} onChange={e => setEditForm({...editForm, author: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Tag size={12}/> קטגוריה</label>
                        <input type="text" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full p-4 bg-white border border-gray-200 rounded-xl font-bold" />
                      </div>
                    </>
                  )}

                  {/* Content / Summary Area */}
                  <div className="md:col-span-2 lg:col-span-3 space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><FileText size={12}/> תיאור קצר</label>
                    <textarea 
                      value={editForm.content || editForm.description || editForm.summary} 
                      onChange={e => setEditForm({...editForm, [activeTab === 'workshops' ? 'description' : activeTab === 'news' ? 'content' : activeTab === 'scholarships' ? 'description' : 'summary']: e.target.value})} 
                      className="w-full p-6 bg-white border border-gray-200 rounded-2xl outline-none h-32 font-medium shadow-inner" 
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button onClick={() => setEditingId(null)} className="px-6 py-3 text-gray-400 font-bold hover:text-gray-600">ביטול</button>
                  <button 
                    onClick={handleSave} 
                    className="bg-blue-600 text-white px-10 py-3 rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Save size={18} /> שמור ועדכן אתר
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 group">
                {/* Thumbnail Preview */}
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="text-blue-500">
                      {activeTab === 'workshops' ? getIcon(item.icon) : activeTab === 'news' ? <Bell /> : activeTab === 'blog' ? <FileText /> : <GraduationCap />}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-right overflow-hidden">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h4 className="text-xl font-black text-gray-900 truncate">{item.title || item.name}</h4>
                    {item.isUrgent && <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-sm">דחוף</span>}
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400 font-bold text-xs uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-blue-500"/> {item.date || item.deadline}</span>
                    {item.location && <span className="flex items-center gap-1"><MapPin size={12} className="text-red-500"/> {item.location}</span>}
                    {item.author && <span className="flex items-center gap-1"><User size={12} className="text-emerald-500"/> {item.author}</span>}
                    {item.amount && <span className="flex items-center gap-1"><CreditCard size={12} className="text-emerald-500"/> {item.amount}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setEditingId(item.id); setEditForm(item); }} 
                    className="p-3 bg-gray-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    title="ערוך פריט"
                  >
                    <Edit size={20}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="p-3 bg-gray-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    title="מחק לצמיתות"
                  >
                    <Trash2 size={20}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {currentList.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 animate-in zoom-in-95">
             <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm">
               <ImageIcon size={32} />
             </div>
             <h4 className="text-xl font-black text-gray-800">אין פריטים להצגה</h4>
             <p className="text-gray-500 font-bold mb-6">התחל להוסיף תוכן כדי שיפיע באתר</p>
             <button onClick={handleAdd} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">צור פריט ראשון</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
