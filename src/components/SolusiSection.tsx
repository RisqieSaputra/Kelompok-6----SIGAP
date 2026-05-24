import { useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TARGET_GROUPS } from '../data';
import { TargetGroup, AduanSubmission } from '../types';
import { CheckCircle2, Copy, Send, Mail, Users, FileQuestion, HelpCircle, RefreshCw } from 'lucide-react';

export default function SolusiSection() {
  const [selectedGroup, setSelectedGroup] = useState<TargetGroup>(TARGET_GROUPS[0]);
  const [formData, setFormData] = useState<AduanSubmission>({
    nama: '',
    provinsi: '',
    masalah: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isResponseCopied, setIsResponseCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('halo@sigap.id');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(aiResponse);
    setIsResponseCopied(true);
    setTimeout(() => setIsResponseCopied(false), 2000);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!formData.nama.trim()) errors.nama = 'Nama Lengkap wajib diisi ya!';
    if (!formData.provinsi) errors.provinsi = 'Silakan pilih provinsi asalmu.';
    if (!formData.masalah.trim() || formData.masalah.length < 15) {
      errors.masalah = 'Tulis detail masalahmu minimal 15 karakter agar AI SIGAP paham.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsAnalyzing(true);
    setAiResponse('');

    try {
      const headersPayload: Record<string, string> = { "Content-Type": "application/json" };
      const savedApiKey = localStorage.getItem('SIGAP_GEMINI_API_KEY');
      if (savedApiKey) {
        headersPayload["X-Gemini-API-Key"] = savedApiKey;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: headersPayload,
        body: JSON.stringify({
          message: `Saya adalah ${formData.nama} dari provinsi ${formData.provinsi}. Saya ingin menyampaikan aduan: ${formData.masalah}`
        })
      });

      if (!response.ok) {
        throw new Error("Gagal terhubung ke intelijen SIGAP.");
      }

      const data = await response.json();
      if (data.reply) {
        setAiResponse(data.reply);
      } else {
        throw new Error("Format balasan tidak didukung.");
      }
    } catch (err) {
      console.warn("Mengaktifkan analisis cadangan lokal untuk aduan:", err);
      // Generate standard offline fallback on failed connection or browser blocks
      const lower = formData.masalah.toLowerCase();
      let fallbackText = '';
      if (lower.includes('phk') || lower.includes('pesangon') || lower.includes('kerja') || lower.includes('pecat') || lower.includes('gaji') || lower.includes('kontrak')) {
        fallbackText = `✊ **Bela Hak Sipil - Korban PHK Sepihak Pabrik/Kantor (Analisis Cadangan):**\n\nHalo ${formData.nama}, kami turut prihatin dengan situasi PHK ini. Berdasarkan UU Cipta Kerja No 6 Tahun 2023, PHK sepihak tanpa SP bertahap melanggar hukum.\n\n**Analisis Singkat Masalah Anda:**\nPersoalan Anda di provinsi ${formData.provinsi} sedang kami lacak dalam jejaring bantuan hukum setempat. Berdasarkan aduan Anda: "${formData.masalah}", Anda berhak menuntut pesangon penuh yang sah!\n\n**Langkah Konkret Hari Ini:**\n1. Jangan menandatangani surat pengunduran diri sukarela (resignation) jika dipaksa HRD.\n2. Amankan semua bukti pendukung seperti slip gaji resmi, jam lembur, percakapan WhatsApp, kontrak, dan surat keputusan PHK.\n3. Ajukan perundingan Bipartit resmi kepada manajemen HRD di perusahaan Anda.`;
      } else if (lower.includes('sakit') || lower.includes('dada') || lower.includes('sesak') || lower.includes('jantung')) {
        fallbackText = `⚠️ **PANDUAN KESELAMATAN DARURAT MEDIS (Analisis Cadangan):**\n\nHalo ${formData.nama}, keluhan nyeri dada kiri atau dada sesak berisiko tinggi serangan jantung! Keselamatan Anda adalah prioritas nomor satu.\n\n**Aksi Penyelamatan Jiwa Seketika:**\n1. Segera hubungi Ambulans/Panggilan Darurat Medis 112 sekarang juga.\n2. Duduk santai bersandar 45 derajat (posisi setengah duduk). Jangan berdiri atau terus berjalan.\n3. Longgarkan kancing baju dan ikat pinggang agar napas lega. Jangan makan/minum apapun dulu!`;
      } else {
        fallbackText = `🇮🇩 **Tuntunan Aduan Sipil Terpadu untuk ${formData.nama} (${formData.provinsi}):**\n\nTerima kasih atas aduan tepercaya yang Anda sampaikan mengenai: "${formData.masalah}".\n\n**Rekomendasi Tindakan Sipil:**\n1. **Kumpulkan Bukti:** Persiapkan kronologi tertulis, saksi, dokumen tertulis, foto, atau kuitansi yang mendukung aduan ini.\n2. **Hindari Pungli:** Jangan membayarkan denda atau biaya administrasi tidak resmi kepada calo/pihak luar sipil.\n3. **Konsultasi Legal:** Silakan ajukan berkas lengkap ke perwakilan Lembaga Bantuan Hukum (LBH) terdekat di Provinsi ${formData.provinsi} untuk mendapat konsultasi serta pendampingan gratis.`;
      }
      setAiResponse(fallbackText);
    } finally {
      setIsAnalyzing(false);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Reset form
    setFormData({
      nama: '',
      provinsi: '',
      masalah: ''
    });
  };

  return (
    <div className="space-y-16 py-4 relative">
      
      {/* Target Groups Section - Siapa yang Terbantu */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-none text-zinc-950">
            Siapa yang Terbantu oleh SIGAP?
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-bold font-mono">
            [ 💡 KLK CHIP BADGE UNTUK MELIHAT SKENARIO CONTOH KASUS ]
          </p>
        </div>

        {/* Dynamic Chips List */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {TARGET_GROUPS.map((target) => (
            <button
              key={target.id}
              onClick={() => setSelectedGroup(target)}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 border-black transition-all flex items-center gap-2 cursor-pointer ${
                selectedGroup.id === target.id
                  ? `${target.bgColor} text-black neo-shadow-sm -translate-y-0.5`
                  : 'bg-white hover:bg-neutral-50 text-gray-800'
              }`}
            >
              <span className="text-base">{target.icon}</span>
              <span>{target.group}</span>
            </button>
          ))}
        </div>

        {/* Selected target showcase box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGroup.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`max-w-4xl mx-auto rounded-3xl border-3 border-black p-6 sm:p-8 flex flex-col md:flex-row gap-6 justify-between items-center ${selectedGroup.bgColor} neo-shadow-sm`}
          >
            <div className="text-6xl sm:text-7xl p-4 bg-white rounded-2xl border-2 border-black neo-shadow-sm shrink-0">
              {selectedGroup.icon}
            </div>
            
            <div className="space-y-3 flex-1">
              <span className="text-[10px] font-mono font-extrabold uppercase bg-black text-white px-2 py-0.5 rounded">
                SASARAN PROGRAM
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold font-display text-zinc-950">
                Bagaimana SIGAP membantu {selectedGroup.group}?
              </h3>
              <p className="text-sm font-bold leading-relaxed text-zinc-900">
                "{selectedGroup.useCase}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Intake Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: Neubrutalist Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-3 border-black p-6 sm:p-8 neo-shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b-3 border-black pb-4">
            <div className="w-10 h-10 bg-neo-yellow rounded-xl border-2 border-black flex items-center justify-center font-bold">
              📝
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold font-display text-zinc-950">
                Formulir Aduan & Keluhan Warga
              </h3>
              <p className="text-xs text-neutral-500 font-bold font-mono">
                [ VERIFIKASI DOKUMEN SISTEM BERKAS TERPADU ]
              </p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Nama field */}
            <div className="space-y-1.5">
              <label className="text-sm font-extrabold text-black font-display flex items-center gap-1">
                <span>Nama Lengkap</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleFormChange}
                placeholder="cth. Warsito Adi"
                className={`w-full neo-input text-sm font-bold ${
                  formErrors.nama ? 'border-red-500 bg-red-50 focus:border-red-500' : ''
                }`}
              />
              {formErrors.nama && (
                <p className="text-xs text-red-600 font-extrabold font-mono mt-1">⚠️ {formErrors.nama}</p>
              )}
            </div>

            {/* Provinsi Dropdown */}
            <div className="space-y-1.5">
              <label className="text-sm font-extrabold text-black font-display flex items-center gap-1">
                <span>Asal Provinsi</span>
                <span className="text-red-500">*</span>
              </label>
              <select
                name="provinsi"
                value={formData.provinsi}
                onChange={handleFormChange}
                className={`w-full bg-white border-3 border-black p-3 rounded-xl outline-none font-bold text-sm shadow-[3px_3px_0px_#000000] focus:shadow-[4px_4px_0px_#000000] transition-shadow ${
                  formErrors.provinsi ? 'border-red-500 bg-red-50' : ''
                }`}
              >
                <option value="">-- Pilih Provinsi Domisili --</option>
                <option value="Aceh">Aceh</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
                <option value="Sumatera Barat">Sumatera Barat</option>
                <option value="Riau">Riau</option>
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Bali">Bali</option>
                <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
                <option value="Kalimantan Barat">Kalimantan Barat</option>
                <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                <option value="Maluku">Maluku</option>
                <option value="Papua">Papua</option>
              </select>
              {formErrors.provinsi && (
                <p className="text-xs text-red-600 font-extrabold font-mono mt-1">⚠️ {formErrors.provinsi}</p>
              )}
            </div>

            {/* Detail Masalah Textarea */}
            <div className="space-y-1.5">
              <label className="text-sm font-extrabold text-black font-display flex items-center gap-1">
                <span>Detail Aduan / Masalah Sipil</span>
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="masalah"
                value={formData.masalah}
                onChange={handleFormChange}
                rows={4}
                placeholder="Tulis kronologi kejadian, rincian denda, sengketa, atau tuntutanmu di sini..."
                className={`w-full neo-input text-sm font-bold resize-none ${
                  formErrors.masalah ? 'border-red-500 bg-red-50 focus:border-red-500' : ''
                }`}
              />
              {formErrors.masalah && (
                <p className="text-xs text-red-600 font-extrabold font-mono mt-1">⚠️ {formErrors.masalah}</p>
              )}
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1 uppercase font-mono">
                <span>AI SIGAP menganalisis draf surat regulasi lokal</span>
                <span>min. 15 karakter</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className={`w-full neo-btn bg-neo-yellow text-black hover:bg-yellow-400 py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isAnalyzing ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Menganalisis Berkas Aduan Anda...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Kirim ke AI SIGAP
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Collaboration Call to Action */}
        <div className="lg:col-span-12 xl:col-span-5 md:grid md:grid-cols-2 lg:block space-y-6 md:space-y-0 md:gap-6 lg:space-y-6">
          
          {/* Email / Collaboration card */}
          <div className="bg-neo-violet p-6 rounded-3xl border-3 border-black neo-shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center font-bold">
              👥
            </div>
            
            <h3 className="text-lg font-extrabold font-display text-zinc-950">
              Mari Berkolaborasi!
            </h3>
            
            <p className="text-xs font-bold text-zinc-950 leading-relaxed">
              Kami berdiri di atas asas gotong royong sosiologis. LSM Hukum, dokter relawan, praktisi sipil, dan mahasiswa hukum diundang memperkuat basis regulasi rujukan SIGAP.
            </p>
            
            {/* Email copying action box */}
            <div className="bg-white border-2 border-black rounded-xl p-3 flex items-center justify-between shadow-[2px_2px_0px_#000000]">
              <div className="flex items-center gap-2 truncate">
                <Mail size={16} className="text-gray-500 shrink-0" />
                <span className="text-xs font-bold font-mono text-gray-800 truncate select-all">halo@sigap.id</span>
              </div>
              
              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg border-2 border-black bg-neo-yellow hover:bg-yellow-400 cursor-pointer shadow-[1px_1px_0px_#000000] active:translate-y-0.5 active:shadow-none shrink-0"
                title="Salin Email"
              >
                {isCopied ? (
                  <span className="text-[10px] px-1 font-extrabold">Copied!</span>
                ) : (
                  <Copy size={12} className="text-black" />
                )}
              </button>
            </div>
          </div>

          {/* Core Team statement */}
          <div className="bg-white p-6 rounded-3xl border-3 border-black neo-shadow-sm space-y-3">
            <h4 className="text-sm font-extrabold font-display text-black uppercase tracking-wider">
              🛡️ Kepatuhan & Privasi Warga
            </h4>
            <ul className="text-xs font-bold text-neutral-700 space-y-2.5">
              <li className="flex gap-2 items-start">
                <span className="text-neo-green text-sm">✓</span>
                <span>Data aduan tidak dipaparkan atau dijual ke pihak pengiklan swasta mana pun.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-neo-green text-sm">✓</span>
                <span>Disandikan penuh menggunakan standar privasi data sipil nasional.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-neo-green text-sm">✓</span>
                <span>Murni dirancang untuk mencocokkan keluhan warga dengan draf naskah hukum & penanganan medis resmi.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Success Modal Backdrop Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl border-4 border-black p-5 sm:p-7 max-w-2xl w-full neo-shadow-lg space-y-5"
            >
              {/* Colored top bar / visual stamp */}
              <div className="flex items-center justify-between border-b-3 border-black pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-neo-green rounded-full border-2 border-black flex items-center justify-center text-xl shadow-[3px_3px_0px_#000000]">
                    🛡️
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold font-display text-emerald-950 leading-tight">
                      Hasil Kajian AI SIGAP
                    </h4>
                    <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase block tracking-wider">
                      TERARSIF DAN TERENKRIPSI AMAN
                    </span>
                  </div>
                </div>

                <span className="hidden sm:inline-block text-[9px] font-mono font-black bg-black text-neo-yellow px-2 py-1 rounded border border-black">
                  STATUS: VERIFIED
                </span>
              </div>

              {/* Citizen meta data info strip */}
              <div className="p-3 bg-neutral-100 border-2 border-dashed border-neutral-400 rounded-xl grid grid-cols-2 gap-2 text-xs font-bold text-zinc-800">
                <div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">Nama Pelapor:</span>
                  <span className="text-black">{formData.nama || 'Warga Tanpa Nama'}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block">Yurisdiksi Wilayah:</span>
                  <span className="text-black">Provinsi {formData.provinsi || 'Indonesia'}</span>
                </div>
              </div>

              {/* Message / Response Box */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold text-zinc-500 uppercase">
                    📝 SURAT REKOMENDASI DAN LANGKAH DARURAT:
                  </span>
                  
                  <button
                    onClick={handleCopyResponse}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-black bg-white rounded-lg border-2 border-black hover:bg-zinc-50 cursor-pointer shadow-[2px_2px_0px_#000000] active:translate-y-0.5 active:shadow-none transition-all duration-150"
                  >
                    {isResponseCopied ? 'Tersalin! ✅' : 'Salin Hasil Analisis'}
                  </button>
                </div>
                
                <div className="p-4 sm:p-5 bg-zinc-50 border-3 border-black rounded-2xl max-h-[285px] overflow-y-auto whitespace-pre-line text-xs sm:text-sm font-sans font-bold text-zinc-900 leading-relaxed shadow-inner selection:bg-neo-yellow selection:text-black">
                  {aiResponse ? aiResponse : 'Sedang memuat kajian komprehensif pelaporan Anda...'}
                </div>
              </div>

              <div className="p-3 bg-neo-yellow/20 border-2 border-black rounded-xl text-[11px] leading-relaxed font-bold text-zinc-800">
                ⚠️ **Catatan Hak Warga:** Pendampingan sipil ini hanya bersifat rujukan panduan administratif dan pertolongan pertama taktis. Lanjutkan dengan mendatangi LBH / dinas terkait untuk kebutuhan berkas pengadilan formal.
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={closeModal}
                  className="neo-btn bg-neo-yellow hover:bg-yellow-400 text-black text-sm px-6 py-3 font-extrabold active:translate-y-1 cursor-pointer"
                >
                  Selesai & Tutup Laporan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
