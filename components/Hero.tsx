
import React from 'react';
import { Shield, Star, Award, Flag } from 'lucide-react';

interface HeroProps {
  onStartChat: () => void;
  onViewRights: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartChat, onViewRights }) => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden bg-slate-900 py-20 text-white">
      {/* Background Image with Darker Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544919924-f7615950821e?q=80&w=2000&auto=format&fit=crop" 
          alt="Israel Northern Landscape" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Flags & Symbols Badge */}
          <div className="flex items-center gap-4 mb-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Druze Flag Colors Representation */}
            <div className="flex gap-1 h-6 items-center">
              <div className="w-2 h-full bg-green-500 rounded-l-sm shadow-sm"></div>
              <div className="w-2 h-full bg-red-500 shadow-sm"></div>
              <div className="w-2 h-full bg-yellow-400 shadow-sm"></div>
              <div className="w-2 h-full bg-blue-500 shadow-sm"></div>
              <div className="w-2 h-full bg-white rounded-r-sm shadow-sm"></div>
            </div>
            <div className="w-px h-6 bg-white/30 mx-1"></div>
            {/* Israeli Flag Representation */}
            <div className="flex flex-col gap-0.5 w-8 h-6 bg-white rounded-sm border border-gray-100 overflow-hidden shadow-sm p-0.5 justify-between">
              <div className="h-1 bg-blue-600 w-full"></div>
              <div className="flex justify-center text-[8px] text-blue-600 font-bold leading-none">✡</div>
              <div className="h-1 bg-blue-600 w-full"></div>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-200 mr-2">גאווה ישראלית • מורשת דרוזית</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter">
            העתיד שלך מתחיל כאן <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              הכוונה ומיצוי זכויות ללוחמים
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-3xl leading-relaxed font-medium">
            פורטל ייעודי לחיילים משוחררים בני העדה הדרוזית. <br className="hidden md:block" />
            אנחנו מלווים אותך בצעדים הראשונים באזרחות - מאקדמיה ועד קריירה מצליחה.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
            <button 
              onClick={onStartChat}
              className="group relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-10 rounded-2xl transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 text-xl"
            >
              <Award className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              דבר עם היועץ הדיגיטלי
            </button>
            <button 
              onClick={onViewRights}
              className="bg-white/10 hover:bg-white/20 text-white font-black py-5 px-10 rounded-2xl border border-white/30 transition-all backdrop-blur-md flex items-center justify-center gap-3 text-xl hover:border-white"
            >
              <Shield className="w-6 h-6" />
              מדריך הזכויות המלא
            </button>
          </div>

          {/* Quick Stats/Features Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 w-full">
            {[
              { label: 'מיצוי זכויות', icon: <Star className="text-yellow-400" /> },
              { label: 'מלגות 2025', icon: <Award className="text-blue-400" /> },
              { label: 'הכוונה אקדמית', icon: <Flag className="text-red-400" /> },
              { label: 'ליווי תעסוקתי', icon: <Shield className="text-emerald-400" /> }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm flex flex-col items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
                {item.icon}
                <span className="text-xs font-bold text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
    </section>
  );
};

export default Hero;
