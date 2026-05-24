import { motion } from 'motion/react';
import { STATS, REGIONAL_GAPS } from '../data';
import { AlertCircle, ArrowUpRight, CheckSquare2 } from 'lucide-react';

export default function StatistikSection() {
  return (
    <div className="space-y-16 py-4">
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-none text-zinc-950">
          Mengapa Indonesia Membutuhkan SIGAP?
        </h2>
        <p className="text-sm sm:text-base text-gray-700 font-bold font-mono">
          [ 📊 REALITAS GAP AKSES PELAYANAN HUKUM, MEDIS, DAN BIROKRASI ]
        </p>
      </div>

      {/* Grid: 4 Stats Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`neo-card p-6 flex flex-col justify-between space-y-4 h-full ${stat.bgColor}`}
          >
            <div className="space-y-2">
              <span className="text-4xl sm:text-5xl font-black font-display text-black block tracking-tight">
                {stat.figure}
              </span>
              <h3 className="text-base font-extrabold font-display text-zinc-900 border-b-2 border-black pb-2">
                {stat.label}
              </h3>
              <p className="text-xs font-bold leading-relaxed text-neutral-800">
                {stat.subtext}
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <span className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-mono text-xs font-bold">
                #{i + 1}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Access Gap Progress Charts Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        {/* Left: Graphic representation */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-3 border-black p-6 sm:p-8 neo-shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b-3 border-black pb-4">
            <h3 className="text-lg sm:text-xl font-extrabold font-display text-zinc-950 flex items-center gap-2">
              📈 Kesenjangan Akses Regional Indonesia
            </h3>
            <span className="px-2 py-0.5 bg-neo-yellow border-2 border-black rounded text-[10px] font-mono font-bold">
              INDEKS 2026
            </span>
          </div>

          <div className="space-y-6">
            {REGIONAL_GAPS.map((gap, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-zinc-900">
                  <span className="flex items-center gap-2">
                    {i === REGIONAL_GAPS.length - 1 ? '✨' : '📍'}{' '}
                    <span className={i === REGIONAL_GAPS.length - 1 ? 'text-emerald-700 font-extrabold font-display' : ''}>
                      {gap.region}
                    </span>
                  </span>
                  <span>{gap.percentage}%</span>
                </div>
                
                {/* Horizontal Progress bar */}
                <div className="w-full h-8 bg-zinc-100 border-2 border-black rounded-lg overflow-hidden flex relative shadow-[inset_1px_1px_3px_rgba(0,0,0,0.15)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${gap.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    style={{ backgroundColor: gap.barColor }}
                    className="h-full border-r-2 border-black uppercase text-[10px] font-mono font-extrabold text-zinc-950 flex items-center justify-end px-3 tracking-wider shrink-0"
                  >
                    {gap.percentage > 20 && `${gap.percentage}%`}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>

          {/* Under bar caption */}
          <p className="text-[10px] sm:text-xs text-neutral-500 font-bold font-mono">
            *Sumber: Analisis Kesenjangan Layanan Profesional Pedesaan & Kepulauan Indonesia (Estimasi Sosiologis Sipil).
          </p>
        </div>

        {/* Right: Narrative card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neo-yellow p-6 rounded-2xl border-3 border-black neo-shadow-sm space-y-4">
            <h4 className="text-lg font-extrabold font-display text-zinc-950 flex items-center gap-1.5">
              <AlertCircle size={20} className="text-zinc-950" />
              Jurang Akses Sangat Menganga
            </h4>
            <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-relaxed">
              Di kota-kota megapolitan seperti Jakarta, seorang warga dapat dengan mudah berkonsultasi ke pengacara, mengklarifikasi denda tilang di samsat, atau pergi ke rumah sakit spesialis dalam hitungan menit.
            </p>
            <p className="text-xs sm:text-sm font-bold text-zinc-900 leading-relaxed">
              Namun di kawasan terpencil atau kepulauan 3T, warga harus mengorbankan waktu berhari-hari dan biaya jutaan rupiah demi urusan serupa. 
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-black rounded-lg text-xs font-mono font-extrabold uppercase text-indigo-950">
                ⚡ SIGAP Hadir Menutup Jurang Ini
              </span>
            </div>
          </div>

          {/* Core targets card checklist */}
          <div className="bg-white p-5 rounded-xl border-3 border-black neo-shadow-sm space-y-3">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wide">Misi Penyetaraan SIGAP:</span>
            <div className="space-y-2 text-xs font-bold text-gray-800">
              <div className="flex gap-2 items-start">
                <CheckSquare2 size={16} className="text-neo-green shrink-0 mt-0.5" />
                <span>Menghapus batasan finansial untuk pendampingan dasar sipil.</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckSquare2 size={16} className="text-neo-green shrink-0 mt-0.5" />
                <span>Memerdekakan warga dari kerumitan birokrasi dan jebakan regulasi.</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckSquare2 size={16} className="text-neo-green shrink-0 mt-0.5" />
                <span>Menyebarluaskan kecerdasan penanganan darurat ke berbagai pulau terluar.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
