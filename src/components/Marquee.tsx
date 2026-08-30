import React from 'react';

interface MarqueeProps {
  text?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({ text }) => {
  const defaultText = "🔥 UP Police Constable Result 2026 Declared Now! | 🚀 SSC CGL 2026 Notification & Online Form Active | 🎓 CBSE Board Class 10th & 12th Board Result Released | 💼 Railway RRB NTPC Admit Card Download Started!";
  const content = text || defaultText;

  return (
    <div className="custom-marquee-override bg-[#1e1e48] dark:bg-slate-950 text-amber-300 border-b border-amber-500/20 text-xs font-semibold h-8 flex items-center shadow-md overflow-hidden relative transition-colors">
      <div className="flex items-center w-full h-full">
        <div className="custom-marquee-badge-override bg-[#ffb703] text-black px-1.5 h-full flex items-center rounded-r-md mr-2 text-[9px] tracking-wide font-extrabold z-10 shadow-sm shrink-0 uppercase transition-colors">
          TRENDING
        </div>
        <div className="w-full overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer" style={{ animationName: 'marquee', color: 'inherit' }}>
            {content}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};
