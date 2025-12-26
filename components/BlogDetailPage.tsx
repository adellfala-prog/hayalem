
import React from 'react';
import { BlogPost } from '../types';
import { ArrowRight, Calendar, User, Tag, Share2, Clock } from 'lucide-react';

interface BlogDetailPageProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ post, onBack }) => {
  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700">
      {/* Article Header & Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={post.imageUrl || 'https://images.unsplash.com/photo-1544919924-f7615950821e?q=80&w=2000'} 
          className="w-full h-full object-cover" 
          alt={post.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        
        <div className="absolute bottom-0 right-0 left-0 p-8 md:p-16">
          <div className="container mx-auto max-w-4xl">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-8 font-black transition-colors group"
            >
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              חזרה לבלוג
            </button>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tighter">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-8 text-white/70 font-bold text-sm border-t border-white/10 pt-8">
              <div className="flex items-center gap-2">
                <div className="bg-white/10 p-2 rounded-xl"><User size={16} /></div>
                מאת: {post.author}
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/10 p-2 rounded-xl"><Calendar size={16} /></div>
                פורסם ב: {post.date}
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/10 p-2 rounded-xl"><Clock size={16} /></div>
                5 דקות קריאה
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto max-w-4xl px-6 py-20">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Main Text */}
          <div className="flex-1 space-y-10">
            <p className="text-2xl md:text-3xl text-gray-500 font-bold leading-relaxed border-r-4 border-blue-600 pr-8 italic">
              {post.summary}
            </p>
            
            <div className="prose prose-xl prose-blue max-w-none text-gray-800 leading-loose font-medium whitespace-pre-wrap">
              {post.content}
            </div>
            
            <div className="pt-16 border-t border-gray-100 flex justify-between items-center">
              <div className="flex gap-4">
                <button className="p-4 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                  <Share2 size={24} />
                </button>
              </div>
              <button 
                onClick={onBack}
                className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all"
              >
                חזרה לכל המאמרים
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:w-64 space-y-12">
            <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
               <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                 <Tag size={18} className="text-blue-600" />
                 תגיות
               </h4>
               <div className="flex flex-wrap gap-2">
                 {['מורשת', 'קריירה', 'הצלחה', 'דרוזים'].map(tag => (
                   <span key={tag} className="text-xs font-black text-gray-400 bg-white px-3 py-1.5 rounded-xl border border-gray-100 uppercase tracking-tighter">#{tag}</span>
                 ))}
               </div>
            </div>
            
            <div className="bg-blue-600 p-8 rounded-[40px] text-white space-y-4 shadow-xl shadow-blue-100">
               <h4 className="font-black text-xl">רוצה להתייעץ?</h4>
               <p className="text-blue-100 text-sm font-medium">עאדל פלאח זמין עבורך לכל שאלה בנושא המאמר.</p>
               <button className="w-full bg-white text-blue-600 py-3 rounded-2xl font-black text-sm transition-all hover:bg-blue-50">פנה אלינו</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
