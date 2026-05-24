import { motion } from 'motion/react';
import { ShieldCheck, MessageSquare, HeartHandshake, Quote, Award } from 'lucide-react';

interface HomeSectionProps {
  onStartTalking: () => void;
}

export default function HomeSection({ onStartTalking }: HomeSectionProps) {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block px-3 py-1 bg-neo-yellow text-xs font-mono font-bold uppercase tracking-wider rounded-md neo-border-sm"
          >
            🇮🇩 AI Pendamping Warga Pertama
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-5xl font-extrabold font-display leading-[1.1] text-neo-dark"
          >
            Satu aplikasi yang menjadi{' '}
            <span className="bg-neo-yellow px-2 py-0.5 inline-block rounded-md neo-border-sm font-sans transform -rotate-1">teman</span>,{' '}
            <span className="bg-neo-pink text-white px-2 py-0.5 inline-block rounded-md neo-border-sm font-sans transform rotate-1">pembela</span>,{' '}
            dan{' '}
            <span className="bg-neo-green px-2 py-0.5 inline-block rounded-md neo-border-sm font-sans transform -rotate-2">pemandu</span>{' '}
            bagi seluruh rakyat Indonesia.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-800 font-medium leading-relaxed max-w-xl"
          >
            Dari Sabang sampai Merauke — dalam bahasa dan budaya mereka sendiri. Menjawab berkas hukum, darurat kesehatan, birokrasi, dan perlindungan hak sipil.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <button
              onClick={onStartTalking}
              className="neo-btn bg-neo-yellow text-black px-8 py-4 text-lg hover:bg-yellow-400 font-bold active:translate-y-1"
            >
              Mulai Bicara Sekarang
            </button>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('about-quote');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="neo-btn bg-white hover:bg-gray-50 text-black px-8 py-4 text-lg text-center"
            >
              Pelajari Filosofi
            </a>
          </motion.div>

          {/* Core Values Badge */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t-2 border-dashed border-black/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neo-blue flex items-center justify-center neo-border-sm">
                <HeartHandshake size={16} />
              </div>
              <span className="text-xs font-bold text-gray-700">100% Mengerti Warga</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neo-pink flex items-center justify-center neo-border-sm text-white">
                <ShieldCheck size={16} />
              </div>
              <span className="text-xs font-bold text-gray-700">Pembela Hak Hukum</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neo-green flex items-center justify-center neo-border-sm">
                <MessageSquare size={16} />
              </div>
              <span className="text-xs font-bold text-gray-700">700+ Bahasa Daerah</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Mockups */}
        <div className="lg:col-span-5 relative h-[450px] flex items-center justify-center">
          <div className="absolute inset-0 bg-neo-violet/30 rounded-3xl border-3 border-dashed border-black/40 -rotate-2"></div>
          
          {/* Main Backdrop Container */}
          <div className="absolute w-[90%] h-[90%] bg-amber-50 rounded-2xl border-3 border-black neo-shadow-lg flex flex-col overflow-hidden rotate-1 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Title bar of the mockup */}
            <div className="px-4 py-3 bg-white border-b-3 border-black flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-black"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-black"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-black"></div>
              </div>
              <span className="text-xs font-mono font-bold text-gray-500">sigap_core_system.sh</span>
              <div className="w-4 h-4 rounded-sm bg-gray-200 border-2 border-black"></div>
            </div>

            {/* Simulated content panel */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              {/* Message 1 */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="self-start max-w-[85%] bg-white p-3 rounded-xl border-2 border-black neo-shadow-sm rotate-[-1deg]"
              >
                <div className="flex gap-1 items-center mb-1 text-[10px] text-gray-500 font-bold font-mono">
                  <span>🧑‍🌾 Pak Warsito (Petani - Jatim)</span>
                </div>
                <p className="text-xs font-bold">
                  Sawah kulo kakeueum air bah, apa ana ganti rugisipun saking pemerintah?
                </p>
              </motion.div>

              {/* Message 2 */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="self-end max-w-[85%] bg-neo-green p-3 rounded-xl border-2 border-black neo-shadow-sm rotate-[1deg]"
              >
                <div className="flex gap-1 items-center mb-1 text-[10px] text-zinc-900 font-bold font-mono">
                  <span>🛡️ AI SIGAP (Pendamping)</span>
                </div>
                <p className="text-xs font-bold leading-relaxed">
                  Sugeng siyang, Pak. Wonten program AUTP (Asuransi Usaha Tani Padi). Karusakan &gt; 75% angsal ganti rugi Rp 6 Juta per Ha. Mangga dipun foto sawahipun, laporkeun dateng PPL Desa!
                </p>
              </motion.div>

              {/* Status capsule overlay inside panel */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.2 }}
                className="self-center bg-neo-yellow px-4 py-2 rounded-xl border-2 border-black neo-shadow-sm flex items-center gap-2 -rotate-3 hover:rotate-0 transition-transform cursor-pointer"
              >
                <Award size={16} className="text-amber-800" />
                <span className="text-[11px] font-mono font-extrabold">HUKUM & MEDIS SIAP SIAGA</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Quote Card */}
      <motion.div
        id="about-quote"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full bg-white rounded-2xl border-3 border-black p-8 relative overflow-hidden neo-shadow shadow-neo-pink"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-neo-pink/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-neo-yellow/15 rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="w-14 h-14 bg-neo-yellow rounded-full border-3 border-black flex items-center justify-center neo-shadow shadow-black/80">
            <Quote size={24} className="text-black transform -scale-x-100" />
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display leading-snug text-neutral-900">
            "Rakyat Indonesia tidak kekurangan kecerdasan. Mereka kekurangan akses — ke informasi yang benar, ke hak yang seharusnya mereka miliki, dan ke seseorang yang bisa dipercaya untuk membantu mereka menavigasi sistem yang rumit."
          </h3>

          <div className="flex flex-col items-center">
            <span className="text-sm font-extrabold uppercase tracking-widest font-mono text-neo-pink">Manifesto Solusi SIGAP</span>
            <span className="text-xs text-gray-500 font-bold mt-1">Teknologi Berpihak Pada Hak Rakyat Kecil</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
