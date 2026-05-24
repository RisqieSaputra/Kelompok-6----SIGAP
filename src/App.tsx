import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HomeSection from './components/HomeSection';
import FiturSection from './components/FiturSection';
import StatistikSection from './components/StatistikSection';
import SolusiSection from './components/SolusiSection';
import { Shield, Sparkles, AlertCircle, Clock, Heart, Users, Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'fitur' | 'statistik' | 'solusi'>('home');
  const [time, setTime] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Clock ticks
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Theme or color mapping for active tabs
  const getTabBg = (tab: typeof activeTab) => {
    switch (tab) {
      case 'home': return 'bg-neo-yellow';
      case 'fitur': return 'bg-neo-green';
      case 'statistik': return 'bg-neo-pink text-white';
      case 'solusi': return 'bg-neo-violet';
      default: return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen neo-grid-bg py-4 sm:py-8 px-2 sm:px-4 selection:bg-neo-yellow selection:text-black flex flex-col justify-between">
      
      {/* MOBILE DRAWER SIDEBAR (SLIDE-OUT MENU) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-out Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[280px] sm:max-w-xs h-full bg-neo-cream border-l-[6px] border-black p-6 flex flex-col justify-between shadow-[-8px_0px_0px_rgba(0,0,0,1)] z-10"
            >
              <div className="space-y-6">
                
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-black">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 bg-black text-neo-yellow flex items-center justify-center rounded border border-black font-display font-black text-xs">
                      S
                    </span>
                    <span className="font-display font-black text-base tracking-tight text-neo-dark uppercase">
                      SIGAP<span className="text-neo-pink">.ID</span>
                    </span>
                  </div>
                  
                  {/* Close circular button */}
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-8 h-8 rounded-full bg-red-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all text-neutral-900 cursor-pointer hover:bg-red-500"
                    title="Tutup Menu"
                  >
                    <X size={15} className="stroke-[2.5]" />
                  </button>
                </div>

                {/* Vertical menu navigation items */}
                <div className="space-y-3.5">
                  <span className="text-[10px] font-mono font-bold text-gray-500 block uppercase tracking-wider">
                    🧭 Navigasi Warga
                  </span>
                  
                  <button
                    onClick={() => {
                      setActiveTab('home');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm text-left font-bold rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                      activeTab === 'home' ? 'bg-neo-yellow text-black -translate-y-0.5' : 'bg-white text-gray-800'
                    }`}
                  >
                    <span className="text-base">🏠</span>
                    <span>Home Utama</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('fitur');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm text-left font-bold rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                      activeTab === 'fitur' ? 'bg-neo-green text-black -translate-y-0.5' : 'bg-white text-gray-800'
                    }`}
                  >
                    <span className="text-base">⚡</span>
                    <span>Fitur & Chatbot</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('statistik');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm text-left font-bold rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                      activeTab === 'statistik' ? 'bg-neo-pink text-white -translate-y-0.5' : 'bg-white text-gray-800'
                    }`}
                  >
                    <span className="text-base">📊</span>
                    <span>Statistik Sipil</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('solusi');
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm text-left font-bold rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                      activeTab === 'solusi' ? 'bg-neo-violet text-black -translate-y-0.5' : 'bg-white text-gray-800'
                    }`}
                  >
                    <span className="text-base">💡</span>
                    <span>Kirim Aduan</span>
                  </button>
                </div>

                {/* Citizens advice section */}
                <div className="p-3.5 bg-neo-yellow/30 border-2 border-black rounded-2xl text-[11px] leading-relaxed font-bold text-zinc-950">
                  <div className="font-mono text-[9px] text-neo-pink uppercase font-black mb-1">
                    🛡️ Aman & Terpercaya
                  </div>
                  Data aduan dilindungi enkripsi. LBH / pendamping medis kami tidak memungut biaya sepeser pun.
                </div>

              </div>

              {/* Bottom Support Contact */}
              <div className="pt-4 border-t-2 border-dashed border-black">
                <span className="text-[10px] font-mono font-bold text-gray-500 block uppercase">
                  Kontak Kolaborasi
                </span>
                <a
                  href="mailto:halo@sigap.id"
                  className="text-xs font-black text-blue-800 hover:underline block mt-1"
                >
                  📩 halo@sigap.id
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Outer Floating Window Canvas Frame Mockup */}
      <div className="w-full max-w-7xl mx-auto rounded-[24px] p-1.5 sm:p-2.5 border-[4px] border-black shadow-[12px_12px_0px_#000000] bg-neo-cream flex flex-col overflow-hidden">
        
        {/* WINDOW HEADER (MAC OS / WINDOWS STYLE TITLE BAR) */}
        <div className="px-3 sm:px-5 py-3.5 bg-white border-b-[4px] border-black flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between shrink-0">
          
          {/* Mock operational buttons */}
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-red-400 border-2 border-black hover:bg-red-500 transition-colors cursor-help" title="Utamakan Hak Sipil!"></div>
              <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-black hover:bg-yellow-500 transition-colors cursor-help" title="Anti Hambatan Keuangan!"></div>
              <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-black hover:bg-green-500 transition-colors cursor-help" title="Gotong Royong Sipil!"></div>
            </div>
            
            {/* Stamp Logo */}
            <div className="flex items-center gap-1.5 pl-2">
              <span className="w-7 h-7 bg-black text-neo-yellow flex items-center justify-center rounded-lg neo-border font-display font-black text-base select-none leading-none">
                S
              </span>
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-neo-dark uppercase flex items-center gap-1">
                SIGAP<span className="text-neo-pink">.ID</span>
              </span>
            </div>
          </div>

          {/* Slogan in Mono Font */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-md border-2 border-black text-xs font-mono font-bold text-gray-700">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span>Pendamping Advokasi Rakyat Pertama</span>
          </div>

          {/* UTC Clock / Status Widget */}
          <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-xs font-black text-slate-900 bg-neo-yellow/30 px-3 py-1.5 rounded-lg border-2 border-black">
            <Clock size={14} className="animate-pulse" />
            <span>WIB/IDT:</span>
            <span>{time || '12:00:00'}</span>
          </div>

        </div>

        {/* NAVIGATION MENUBAR SECTION */}
        <div className="bg-neutral-50 border-b-[4px] border-black p-2 sm:p-3 flex flex-col md:flex-row gap-3 md:gap-4 md:items-center md:justify-between sm:px-4">
          
          {/* Desktop Nav buttons - beautifully formatted as a cohesive contiguous index-tab deck */}
          <nav className="hidden md:flex items-center bg-white border-2 border-black rounded-xl overflow-hidden p-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] gap-1">
            <button
              id="nav-home"
              onClick={() => setActiveTab('home')}
              className={`px-3 lg:px-5 py-2 text-xs lg:text-sm font-display font-black rounded-lg transition-all duration-150 cursor-pointer ${
                activeTab === 'home' 
                  ? 'bg-neo-yellow text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                  : 'text-gray-700 hover:bg-neutral-100 hover:text-black border-2 border-transparent'
              }`}
            >
              🏠 Home
            </button>
            <button
              id="nav-fitur"
              onClick={() => setActiveTab('fitur')}
              className={`px-3 lg:px-5 py-2 text-xs lg:text-sm font-display font-black rounded-lg transition-all duration-150 cursor-pointer ${
                activeTab === 'fitur' 
                  ? 'bg-neo-green text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                  : 'text-gray-700 hover:bg-neutral-100 hover:text-black border-2 border-transparent'
              }`}
            >
              ⚡ Fitur & Simulator
            </button>
            <button
              id="nav-statistik"
              onClick={() => setActiveTab('statistik')}
              className={`px-3 lg:px-5 py-2 text-xs lg:text-sm font-display font-black rounded-lg transition-all duration-150 cursor-pointer ${
                activeTab === 'statistik' 
                  ? 'bg-neo-pink text-white border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                  : 'text-gray-700 hover:bg-neutral-100 hover:text-black border-2 border-transparent'
              }`}
            >
              📊 Statistik Realitas
            </button>
            <button
              id="nav-solusi"
              onClick={() => setActiveTab('solusi')}
              className={`px-3 lg:px-5 py-2 text-xs lg:text-sm font-display font-black rounded-lg transition-all duration-150 cursor-pointer ${
                activeTab === 'solusi' 
                  ? 'bg-neo-violet text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-0.5' 
                  : 'text-gray-700 hover:bg-neutral-100 hover:text-black border-2 border-transparent'
              }`}
            >
              💡 Solusi & Aduan
            </button>
          </nav>

          {/* Mobile indicator & burger - visible on mobile only */}
          <div className="flex md:hidden items-center justify-between w-full">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 border-2 border-black rounded-xl">
              <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">Halaman:</span>
              <span className="text-[11px] font-black text-black">
                {activeTab === 'home' && '🏠 Home'}
                {activeTab === 'fitur' && '⚡ Fitur & Simulator'}
                {activeTab === 'statistik' && '📊 Statistik'}
                {activeTab === 'solusi' && '💡 Solusi & Aduan'}
              </span>
            </div>

            <button
              id="burger-btn"
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neo-yellow text-black font-mono font-black text-xs border-2 border-black rounded-md shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            >
              <Menu size={14} />
              <span>MENU</span>
            </button>
          </div>

          {/* Dynamic Interactive Info & Support Area - fully active on tablet/desktop to eliminate gaps */}
          <div className="hidden md:flex items-center gap-3 ml-auto text-xs font-bold">
            <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black transition-all duration-300 ${
              activeTab === 'home' ? 'bg-neo-yellow/10' :
              activeTab === 'fitur' ? 'bg-neo-green/10' :
              activeTab === 'statistik' ? 'bg-neo-pink/10' :
              'bg-neo-violet/10'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-gray-500 font-mono text-[9px] uppercase">Fokus:</span>
              <span className="text-black font-extrabold">
                {activeTab === 'home' && 'Advokasi Warga Utama'}
                {activeTab === 'fitur' && 'Konsultasi & Smart Chat'}
                {activeTab === 'statistik' && 'Statistik Realitas Sipil'}
                {activeTab === 'solusi' && 'Kajian Rekomendasi Resmi'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 border-2 border-black rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <span className="text-[9px] font-mono font-black text-rose-500 uppercase">🛡️ BEBAS BIAYA</span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              <a href="mailto:halo@sigap.id" className="text-xs font-black text-blue-800 hover:underline flex items-center gap-1">
                <span>Hubungi:</span>
                <span className="text-black font-bold">halo@sigap.id</span>
              </a>
            </div>
          </div>

        </div>

        {/* CONTAINER WORKSPACE MAIN TAB CONTENT */}
        <main className="p-4 sm:p-8 flex-1 bg-transparent min-h-[500px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'home' && (
                <HomeSection onStartTalking={() => setActiveTab('fitur')} />
              )}
              {activeTab === 'fitur' && (
                <FiturSection />
              )}
              {activeTab === 'statistik' && (
                <StatistikSection />
              )}
              {activeTab === 'solusi' && (
                <SolusiSection />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* WINDOW FOOTER PANEL */}
        <footer className="border-t-[4px] border-black bg-neutral-900 text-white p-6 sm:p-8 rounded-b-[18px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Column Brand */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 bg-neo-yellow text-black flex items-center justify-center rounded border border-black font-display font-black text-sm select-none">
                  S
                </span>
                <span className="font-display font-extrabold text-lg tracking-tight select-none">
                  SIGAP<span className="text-neo-yellow">.ID</span>
                </span>
              </div>
              <p className="text-[11px] font-bold text-gray-400 max-w-sm">
                Pendamping, Pembela, dan Pemandu digital bagi seluruh lapisan warga Indonesia hingga ke wilayah pelosok 3T. Independen, andal, bebas komersialisasi berlebih.
              </p>
            </div>

            {/* Middle Column Badges */}
            <div className="md:col-span-4 flex flex-wrap gap-2 justify-start md:justify-center">
              <span className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 rounded text-[9px] font-bold font-mono text-neo-green uppercase tracking-wide">
                ⚖️ 100% Sipil Berdaulat
              </span>
              <span className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 rounded text-[9px] font-bold font-mono text-neo-pink uppercase tracking-wide">
                🗣️ Bahasa Daerah Aktif
              </span>
              <span className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 rounded text-[9px] font-bold font-mono text-neo-yellow uppercase tracking-wide">
                🔒 Tanpa Penjualan Data
              </span>
            </div>

            {/* Right Column Credits */}
            <div className="md:col-span-3 text-left md:text-right space-y-1">
              <span className="text-[10px] font-mono font-extrabold text-[#98D8A0] block">
                [ GERAKAN GOTONG ROYONG SIPIL INDONESIA ]
              </span>
              <p className="text-[10px] text-gray-500 font-bold">
                Copyright © 2026 SIGAP.ID. Semua Hak Sipil Dilindungi Undang-Undang.
              </p>
            </div>

          </div>
        </footer>

      </div>

      {/* Subtle Bottom Credit Badge (Anti-AI-Slop compliant: no telemetry ports, system-coordinates, or raw logs) */}
      <div className="text-center pt-4 flex justify-center items-center gap-1">
        <Heart size={10} className="text-neo-pink fill-neo-pink" />
        <span className="text-[10px] sm:text-xs font-mono font-bold text-gray-600">
          Dari Rakyat, Oleh Rakyat, Untuk Rakyat Indonesia.
        </span>
      </div>
    </div>
  );
}
