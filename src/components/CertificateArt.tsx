import React from 'react';

// School Crest for SK AU Keramat
export const SchoolCrestLogo: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 120" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Shield Base */}
    <defs>
      <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="crestRed" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
    </defs>
    
    {/* Ribbon Top */}
    <path d="M15,14 Q50,4 85,14 L80,24 Q50,16 20,24 Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="1.5" />
    <text x="50" y="20" fontSize="5.2" fontWeight="bold" textAnchor="middle" fill="#0f172a" fontFamily="sans-serif">
      SEK.KEB.AU.KERAMAT KL
    </text>
    
    {/* Shield */}
    <path d="M22,25 L78,25 C78,65 50,86 50,86 C50,86 22,65 22,25 Z" fill="url(#crestGold)" stroke="#1e293b" strokeWidth="2" />
    
    {/* Inner Shield Red */}
    <path d="M28,30 L72,30 C72,60 50,78 50,78 C50,78 28,60 28,30 Z" fill="url(#crestRed)" stroke="#fef08a" strokeWidth="1.5" />
    
    {/* Book / Torch / Gear symbol */}
    <circle cx="50" cy="50" r="14" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
    <path d="M42,50 Q50,44 58,50 Q50,56 42,50 Z" fill="#991b1b" />
    <path d="M50,40 L50,60" stroke="#991b1b" strokeWidth="2" />
    <circle cx="50" cy="50" r="4" fill="#fbbf24" />
    
    {/* Bottom Ribbon */}
    <path d="M10,88 Q50,102 90,88 L85,100 Q50,114 15,100 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
    <text x="50" y="99" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#1e293b" fontFamily="sans-serif">
      BERUSAHA BERILMU BERJAYA
    </text>
  </svg>
);

// TS25 Logo (Program Transformasi Sekolah 2025)
export const TS25Logo: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#9333ea" />
      </linearGradient>
    </defs>
    
    {/* Outer rounded container */}
    <rect x="5" y="5" width="90" height="90" rx="14" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2" />
    <rect x="8" y="8" width="84" height="64" rx="10" fill="url(#tsGrad)" />
    
    {/* TS25 text */}
    <text x="50" y="44" fontSize="32" fontWeight="900" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif" letterSpacing="1">
      TS
    </text>
    <text x="50" y="66" fontSize="22" fontWeight="900" textAnchor="middle" fill="#facc15" fontFamily="sans-serif">
      25
    </text>
    
    {/* Subtitle Banner */}
    <rect x="8" y="74" width="84" height="18" fill="#1e293b" rx="4" />
    <text x="50" y="82" fontSize="4.6" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif">
      PROGRAM TRANSFORMASI SEKOLAH 2025
    </text>
    <text x="50" y="89" fontSize="4.2" fontWeight="600" textAnchor="middle" fill="#93c5fd" fontFamily="sans-serif">
      Penggerak Pembelajaran Bermakna
    </text>
  </svg>
);

// Malaysian Ministry / Official Seal (Cop Mohor Rasmi Sekolah)
export const SchoolOfficialSeal: React.FC<{ 
  schoolCode?: string; 
  schoolName?: string; 
  color?: string;
  className?: string;
}> = ({ 
  schoolCode = 'WBA0053', 
  schoolName = 'SEKOLAH KEBANGSAAN A.U. KERAMAT', 
  color = '#801818', 
  className = 'w-24 h-24' 
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="sealTopTextPath" d="M 32,100 A 68,68 0 1,1 168,100" />
          <path id="sealBottomTextPath" d="M 168,100 A 68,68 0 0,1 32,100" />
        </defs>

        {/* Scalloped / Starburst Edge */}
        <path
          d={`
            M 100,6 L 107,17 L 120,10 L 123,23 L 137,20 L 136,33 L 151,34 L 146,47 L 161,51 L 153,63 
            L 167,71 L 156,81 L 169,92 L 155,100 L 169,108 L 156,119 L 167,129 L 153,137 L 161,149 
            L 146,153 L 151,166 L 136,167 L 137,180 L 123,177 L 120,190 L 107,183 L 100,194 L 93,183 
            L 80,190 L 77,177 L 63,180 L 64,167 L 49,166 L 54,153 L 39,149 L 47,137 L 33,129 L 44,119 
            L 31,108 L 45,100 L 31,92 L 44,81 L 33,71 L 47,63 L 39,51 L 54,47 L 49,34 L 64,33 L 63,20 
            L 77,23 L 80,10 L 93,17 Z
          `}
          fill={color}
          opacity="0.95"
        />

        {/* Concentric Circles */}
        <circle cx="100" cy="100" r="76" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3,3" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="54" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        
        {/* Curved Text - School Name */}
        <text fill="#ffffff" fontSize="9.5" fontWeight="bold" letterSpacing="1.2">
          <textPath href="#sealTopTextPath" startOffset="50%" textAnchor="middle">
            {schoolName}
          </textPath>
        </text>

        {/* Center Box for School Code & Stars */}
        <g transform="translate(100, 100)">
          <path d="M -8,-28 L 0,-36 L 8,-28 Z" fill="#ffffff" />
          <path d="M -8,28 L 0,36 L 8,28 Z" fill="#ffffff" />
          <text y="-8" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="2">
            KOD SEKOLAH
          </text>
          <text y="10" fill="#fef08a" fontSize="13" fontWeight="900" textAnchor="middle" letterSpacing="1">
            {schoolCode}
          </text>
          <circle cx="-35" cy="0" r="3" fill="#ffffff" />
          <circle cx="35" cy="0" r="3" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};

// Sports Silhouettes Background Art (Matching the uploaded template)
export const SportsSilhouettesBg: React.FC<{ opacity?: number }> = ({ opacity = 0.9 }) => (
  <div 
    className="absolute inset-0 pointer-events-none overflow-hidden select-none"
    style={{ opacity }}
  >
    {/* Subtle Diagonal Speedlines from top right & bottom */}
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bannerGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="bannerGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="bannerGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="athleteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748b" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#475569" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Top right subtle angled hatched lines like the user's template */}
      <g stroke="#e2e8f0" strokeWidth="2.5" opacity="0.7">
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={i} x1={450 + i * 22} y1={-20} x2={600 + i * 22} y2={180} />
        ))}
      </g>

      {/* Bottom dynamic diagonal stripes in gradient */}
      <path d="M -50,1050 L 850,910 L 850,935 L -50,1075 Z" fill="url(#bannerGrad1)" />
      <path d="M -50,1070 L 850,930 L 850,955 L -50,1095 Z" fill="url(#bannerGrad2)" />
      <path d="M -50,1090 L 850,950 L 850,970 L -50,1110 Z" fill="url(#bannerGrad3)" />
      <path d="M -50,1110 L 850,970 L 850,1020 L -50,1160 Z" fill="#991b1b" opacity="0.3" />
    </svg>

    {/* Center Athlete Silhouettes */}
    <svg 
      className="absolute inset-x-0 bottom-24 mx-auto w-[85%] h-[60%]" 
      viewBox="0 0 800 650" 
      fill="url(#athleteGrad)"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Basketball / Netball Player (Center-Left reaching high) */}
      <g transform="translate(180, 20) scale(0.95)">
        <circle cx="120" cy="50" r="16" /> {/* Ball */}
        <circle cx="95" cy="85" r="15" /> {/* Head */}
        <path d="M80,105 C85,95 110,95 115,105 L125,170 C125,170 115,220 100,240 L115,360 L95,360 L85,250 L65,360 L45,360 L70,230 L65,170 Z" />
        {/* Arms raised up */}
        <path d="M75,110 L95,50 L110,50 L95,115 Z" />
        <path d="M105,110 L118,55 L130,60 L115,115 Z" />
      </g>

      {/* 2. Badminton Player (Center-Right smashing with racket) */}
      <g transform="translate(420, 70) scale(0.9)">
        <circle cx="100" cy="90" r="15" /> {/* Head */}
        <path d="M85,110 C90,100 115,100 120,110 L130,175 L115,245 L135,370 L115,370 L95,255 L75,370 L55,370 L80,240 L70,175 Z" />
        {/* Arm raising racket */}
        <path d="M110,115 L145,55 L155,60 L125,120 Z" />
        {/* Racket shaft & head */}
        <line x1="148" y1="58" x2="185" y2="10" stroke="#475569" strokeWidth="3" opacity="0.4" />
        <ellipse cx="200" cy="-8" rx="20" ry="26" fill="none" stroke="#475569" strokeWidth="2.5" opacity="0.4" transform="rotate(30 200 -8)" />
        {/* Left balancing arm */}
        <path d="M85,120 L40,150 L35,140 L75,115 Z" />
      </g>

      {/* 3. Archer with Bow (Bottom Right) */}
      <g transform="translate(520, 200) scale(0.85)">
        <circle cx="80" cy="110" r="15" />
        <path d="M65,130 C70,120 95,120 100,130 L105,190 L95,260 L115,360 L95,360 L80,270 L60,360 L40,360 L65,250 L55,190 Z" />
        {/* Draw arms */}
        <line x1="60" y1="140" x2="160" y2="140" stroke="#334155" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
        {/* Bow arc */}
        <path d="M165,70 Q130,140 165,210" fill="none" stroke="#334155" strokeWidth="4" opacity="0.5" />
        <line x1="165" y1="70" x2="60" y2="140" stroke="#64748b" strokeWidth="1.5" opacity="0.4" />
        <line x1="165" y1="210" x2="60" y2="140" stroke="#64748b" strokeWidth="1.5" opacity="0.4" />
      </g>

      {/* 4. Sprinter / Runner (Left side) */}
      <g transform="translate(40, 220) scale(0.8)">
        <circle cx="120" cy="100" r="15" />
        <path d="M100,120 L130,170 L150,230 L190,320 L165,330 L125,245 L90,320 L70,310 L100,225 L80,180 Z" />
        <path d="M110,125 L160,110 L155,100 L105,120 Z" />
        <path d="M90,135 L60,165 L50,155 L85,125 Z" />
      </g>
    </svg>
  </div>
);

// Traditional Royal Gold Frame Ornament
export const RoyalGoldBorder: React.FC = () => (
  <div className="absolute inset-4 pointer-events-none border-[3px] border-amber-600/70 p-2">
    <div className="w-full h-full border border-amber-400/50 p-2 flex flex-col justify-between">
      {/* Corner Ornaments */}
      <div className="flex justify-between items-start">
        <svg className="w-12 h-12 text-amber-600/80" viewBox="0 0 50 50" fill="currentColor">
          <path d="M0,0 L50,0 C30,5 5,30 0,50 Z" />
          <circle cx="16" cy="16" r="4" fill="#fbbf24" />
        </svg>
        <svg className="w-12 h-12 text-amber-600/80 -scale-x-100" viewBox="0 0 50 50" fill="currentColor">
          <path d="M0,0 L50,0 C30,5 5,30 0,50 Z" />
          <circle cx="16" cy="16" r="4" fill="#fbbf24" />
        </svg>
      </div>

      <div className="flex justify-between items-end">
        <svg className="w-12 h-12 text-amber-600/80 -scale-y-100" viewBox="0 0 50 50" fill="currentColor">
          <path d="M0,0 L50,0 C30,5 5,30 0,50 Z" />
          <circle cx="16" cy="16" r="4" fill="#fbbf24" />
        </svg>
        <svg className="w-12 h-12 text-amber-600/80 -scale-x-100 -scale-y-100" viewBox="0 0 50 50" fill="currentColor">
          <path d="M0,0 L50,0 C30,5 5,30 0,50 Z" />
          <circle cx="16" cy="16" r="4" fill="#fbbf24" />
        </svg>
      </div>
    </div>
  </div>
);

// Official Malaysian Organizer / Ministry / State Department Emblem
export const OrganizerEmblemLogo: React.FC<{ className?: string; label?: string }> = ({ 
  className = 'w-20 h-20',
  label = 'LOGO PENGANJUR' 
}) => (
  <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="orgGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="orgRed" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
      <linearGradient id="orgBlue" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    
    {/* Laurel Wreath */}
    <g fill="none" stroke="url(#orgGold)" strokeWidth="2.5" strokeLinecap="round">
      <path d="M22,78 C12,50 25,25 45,18" />
      <path d="M98,78 C108,50 95,25 75,18" />
      {/* Laurel leaves left */}
      <ellipse cx="26" cy="65" rx="5" ry="3" fill="#f59e0b" transform="rotate(-30 26 65)" />
      <ellipse cx="22" cy="50" rx="5" ry="3" fill="#f59e0b" transform="rotate(-45 22 50)" />
      <ellipse cx="25" cy="35" rx="5" ry="3" fill="#f59e0b" transform="rotate(-60 25 35)" />
      <ellipse cx="36" cy="24" rx="5" ry="3" fill="#f59e0b" transform="rotate(-75 36 24)" />
      {/* Laurel leaves right */}
      <ellipse cx="94" cy="65" rx="5" ry="3" fill="#f59e0b" transform="rotate(30 94 65)" />
      <ellipse cx="98" cy="50" rx="5" ry="3" fill="#f59e0b" transform="rotate(45 98 50)" />
      <ellipse cx="95" cy="35" rx="5" ry="3" fill="#f59e0b" transform="rotate(60 95 35)" />
      <ellipse cx="84" cy="24" rx="5" ry="3" fill="#f59e0b" transform="rotate(75 84 24)" />
    </g>

    {/* Central Royal Shield */}
    <path d="M36,25 L84,25 C84,65 60,88 60,88 C60,88 36,65 36,25 Z" fill="url(#orgGold)" stroke="#0f172a" strokeWidth="2" />
    <path d="M41,30 L79,30 C79,62 60,82 60,82 C60,82 41,62 41,30 Z" fill="url(#orgBlue)" stroke="#fef08a" strokeWidth="1.5" />

    {/* Crescent and Star / Torch of Youth & Sports */}
    <path d="M52,42 A12,12 0 1,0 68,54 A10,10 0 1,1 52,42 Z" fill="#fef08a" />
    {/* 14-pointed star or central symbol */}
    <polygon points="64,36 66,41 71,41 67,44 69,49 64,46 60,49 61,44 58,41 62,41" fill="#fef08a" />

    {/* Torch flame / athlete spirit */}
    <path d="M60,56 C57,60 55,66 60,72 C65,66 63,60 60,56 Z" fill="url(#orgRed)" />
    <circle cx="60" cy="65" r="3" fill="#fef08a" />

    {/* Ribbon Banner at Base */}
    <path d="M20,90 L40,86 L60,90 L80,86 L100,90 L95,102 L60,98 L25,102 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
    <path d="M20,90 L12,96 L25,102 Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
    <path d="M100,90 L108,96 L95,102 Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
    <text x="60" y="96" fontSize="4.8" fontWeight="900" textAnchor="middle" fill="#0f172a" fontFamily="sans-serif" letterSpacing="0.5">
      KERAJAAN MALAYSIA
    </text>
  </svg>
);

