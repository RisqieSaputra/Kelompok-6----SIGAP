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
          message: `Saya adalah ${formData.nama} (Kelompok: ${selectedGroup.group}) dari provinsi ${formData.provinsi}. Saya ingin menyampaikan aduan: ${formData.masalah}`,
          topicId: selectedGroup.id
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
      
      if (selectedGroup.id === 'target-buruh' || lower.includes('phk') || lower.includes('pesangon') || lower.includes('kerja') || lower.includes('pecat') || lower.includes('gaji') || lower.includes('kontrak')) {
        fallbackText = `✊ **Bela Hak Sipil - Rekomendasi Advokasi Buruh Pabrik & Ketenagakerjaan buat ${formData.nama} (${formData.provinsi}):**

Berdasarkan UU Cipta Kerja No 6 Tahun 2023 Pasal 156, PHK sepihak tanpa adanya SP (Surat Peringatan) bertahap dinyatakan melanggar hukum dan Anda berhak menolak pesangon yang tidak sesuai.

**Analisis Masalah Ketenagakerjaan Anda:**
1. **Perhitungan Pesangon Masa Kerja:** Sesuai ketentuan, masa kerja yang mapan (cth. 5 tahun) berhak atas pesangon 6 bulan upah standar + 2 bulan Uang Penghargaan Masa Kerja (UPMK) secara utuh.
2. **Lembur Wajib:** Setiap jam lembur wajib dibayarkan sesuai dengan akumulasi pengali jam kerja resmi Disnaker.

**Langkah Nyata Hari Ini:**
1. **Tolak Pengunduran Diri Sukarela:** JANGAN pernah menandatangani draf surat resign sukarela dari HRD jika Anda dipaksa/diintimidasi.
2. **Kumpulkan Bukti Valid:** Amankan slip gaji bulanan, ID Card, catatan jam lembur, percakapan WhatsApp koordinasi kerja, serta berkas kontrak kerja asli hari ini.
3. **Minta Mediasi Bipartit:** Ajukan surat resmi kepada manajemen HRD untuk melakukan perundingan bipartit dalam batas waktu 7 hari. Lapor ke Dinas Tenaga Kerja (Disnaker) ${formData.provinsi} jika perusahaan tidak kooperatif.`;
      
      } else if (selectedGroup.id === 'target-tani' || lower.includes('sawah') || lower.includes('banjir') || lower.includes('caah') || lower.includes('tani') || lower.includes('gagal') || lower.includes('panen') || lower.includes('nelayan') || lower.includes('pupuk')) {
        fallbackText = `🌾 **Pemberdayaan Petani & Nelayan - Solusi Klaim AUTP & Subsidi buat ${formData.nama} (${formData.provinsi}):**

Negara menjamin kesejahteraan pangan. Jika sawah Anda mengalami puso akibat banjir/kekeringan atau menghadapi kendala perikanan, berikut hak perlindungan Anda:

**Analisis Masalah Tani & Nelayan:**
1. **Asuransi AUTP (Tani Padi):** Bagi sawah terdaftar AUTP, Anda berhak menerima ganti rugi resmi senilai **Rp 6.000.000,- per Hektar** dari pemerintah jika tingkat kerusakan di atas 75%.
2. **Pupuk Subsidi:** Pembatasan pupuk diatasi dengan memastikan nama masuk dalam sistem e-RDKK Kelompok Tani setempat.
3. **Solar Nelayan:** Gunakan Kartu KUSUKA (Kartu Pelaku Usaha Kelautan & Perikanan) agar mendapatkan harga solar subsidi murni di SPBU Nelayan (SPBUN) tanpa pungli tambahan.

**Langkah Nyata Hari Ini:**
1. **Dokumentasi Kerusakan:** Ambil foto/video detail kerusakan lahan sawah atau perahu/alat penangkapan ikan dari berbagai sisi untuk melengkapi berkas syarat klaim.
2. **Hubungi PPL (Penyuluh Lapangan):** Temui Penyuluh Pertanian Lapangan (PPL) atau Penyuluh Perikanan daerah ${formData.provinsi} hari ini untuk verifikasi lapangan dan pembuatan Surat Pernyataan Lahan Puso/Gagal Panen dari RT/RW.
3. **Bantuan Bibit Gratis:** Jika sawah belum berasuransi, ajukan bantuan darurat berupa bibit pengganti gratis dari cadangan kabupaten/provinsi.`;

      } else if (selectedGroup.id === 'target-irt' || lower.includes('bansos') || lower.includes('arisan') || lower.includes('online') || lower.includes('bpj')) {
        fallbackText = `👩‍🦰 **Perlindungan Sipil Ibu Rumah Tangga - Advokasi PKH, BPJS, & Penipuan Online buat ${formData.nama} (${formData.provinsi}):**

Ibu Rumah Tangga memegang peran kemandirian keluarga. Berikut solusi taktis dari SIGAP untuk masalah yang Anda adukan:

**Analisis Masalah Rumah Tangga:**
1. **Bansos (PKH/BPNT) Terhambat:** Pastikan nama Anda terdaftar aktif di DTKS (Data Terpadu Kesejahteraan Sosial) Kemensos. Jika dinonaktifkan sepihak, kelurahan wajib mengusulkan ulang lewat musyawarah desa.
2. **Re-aktivasi BPJS Kesehatan Mati:** Jika iuran mandiri menunggak, gunakan layanan cicilan ringan program **REHAB** di aplikasi Mobile JKN agar kartu segera aktif kembali dinten ini untuk berobat.
3. **Penipuan Belanja/Arisan Online:** Berdasarkan aturan cyber polisi, transaksi penipuan wajib dilaporkan untuk membekukan rekening penipu.

**Langkah Nyata Hari Ini:**
1. **Cek DTKS Mandiri:** Unduh aplikasi resmi "Cek Bansos" dari HP kementerian sosial untuk mengecek status usulan bantuan sosial bansos keluarga Anda.
2. **Laporkan Rekening Penipu:** Kunjungi portal kepolisian \`cekrekening.id\` untuk memasukkan nomor rekening penipu agar secara kolektif database dicap kriminal, lalu bawa bukti chat ke bank kagem memblokir saldo rekening mereka.
3. **Fasilitas Medis Darurat:** IGD Puskesmas dan Rumah Sakit di ${formData.provinsi} wajib menerima rujukan lansia/anak sakit gawat darurat dinten ini tanpa memungut DP atau jaminan administratif awal!`;

      } else if (selectedGroup.id === 'target-migran' || lower.includes('migran') || lower.includes('pmi') || lower.includes('luar negeri') || lower.includes('majikan') || lower.includes('paspor')) {
        fallbackText = `🧳 **Advokasi Pekerja Migran Indonesia (PMI) - Perlindungan Kontrak & Anti-Eksploitasi buat ${formData.nama} (${formData.provinsi}):**

Hak asasi Pekerja Migran dilindungi sepenuhnya oleh UU No 18 Tahun 2017 tentang Perlindungan Pekerja Migran Indonesia.

**Analisis Masalah Migran Anda:**
1. **Penahanan Dokumen Ilegal:** Paspor dan kontrak kerja adalah dokumen resmi milik negara yang dipegang oleh warga negara yang bersangkutan, majikan atau agen dilarang keras menahannya secara paksa.
2. **Penipuan Biro/Agen Liar:** Pastikan selalu terdaftar melalui jalur resmi BP2MI (Badan Pelindungan Pekerja Migran Indonesia) kagem menjamin hak asuransi luar negeri.

**Langkah Nyata Hari Ini:**
1. **Gunakan Nomor Darurat KBRI:** Hubungi Call Center Perlindungan WNI KBRI di negara penempatan Anda segera lewat media sosial atau telepon darurat.
2. **Laporkan Agen Liar ke BP2MI:** Kirimkan aduan resmi gratis ke Call Center BP2MI di nomor **0800-1000-50** (layanan gratis dalam negeri) atau WhatsApp resmi BP2MI dari luar negeri untuk menindak agen penyalur Anda.
3. **Simpan Bukti Pembayaran:** Amankan bukti serah terima uang, kuitansi, nama agen perorangan, dan draf kontrak kerja secara aman di cloud/disimpan oleh keluarga Anda di ${formData.provinsi}.`;

      } else if (selectedGroup.id === 'target-lansia' || lower.includes('lansia') || lower.includes('pensiun') || lower.includes('taspen') || lower.includes('tua')) {
        fallbackText = `👵 **Layanan Perlindungan Mandiri Lansia - Fasilitas Medis & Pensiun Taspen buat ${formData.nama} (${formData.provinsi}):**

Memasuki masa tua yang terhormat, kakek, nenek, dan para lansia dibebaskan dari antrean birokrasi yang melelahkan.

**Analisis Layanan Lansia:**
1. **Pencairan Dana Taspen/Pensiun:** Otentikasi wajah berkala tidak perlu dilakukan dengan datang langsung. Gunakan aplikasi Taspen Otentikasi di HP anak/saudara agar dana masuk rekening bank otomatis.
2. **Layanan Kesehatan Tanpa Antre:** Lansia dengan penyakit penyerta (hipertensi, asam urat, gula) berhak diprioritaskan di ruang tunggu faskes tingkat satu serta mendapatkan program PRB (Program Rujuk Balik) agar mendapat obat bulanan gratis di apotek terdekat tanpa rujukan ulang.

**Langkah Nyata Hari Ini:**
1. **Daftarkan Kartu Lansia/Sembako:** Bawa fotokopi KTP Lansia ke Dinas Sosial ${formData.provinsi} atau kelurahan untuk diprioritaskan sebagai penerima bantuan asupan sembako atau asisten sosial lansia prasejahtera.
2. **Aktifkan Fasilitas PRB:** Saat kontrol berikutnya di Puskesmas, minta berkas rujukan PRB (Program Rujuk Balik) BPJS Kesehatan agar pengambilan obat bulan berikutnya bisa dilayani langsung tanpa mengantre dokter spesialis rumah sakit.`;

      } else if (selectedGroup.id === 'target-3t' || lower.includes('desa') || lower.includes('pelosok') || lower.includes('ular') || lower.includes('air') || lower.includes('pip')) {
        fallbackText = `⛵ **Akses Administrasi Sipil & Mitigasi Penyelamatan Desa 3T buat ${formData.nama} (${formData.provinsi}):**

Wilayah Terdepan, Terpencil, dan Tertinggal (3T) adalah beranda depan kedaulatan kita. Jarak administratif tidak boleh membatasi hak Anda.

**Analisis Masalah Wilayah 3T:**
1. **Pungli Dokumen Adminduk:** Pengurusan KTP, Kartu Keluarga (KK), Akta Kelahiran, dan Surat Waris Desa adalah **100% GRATIS** berdasarkan hukum kementerian dalam negeri.
2. **Kejadian Medis Darurat (cth: Gigitan Ular):** Jangan diikat kencang karena merusak otot. Lakukan imobilisasi (balut bidai/papan kayu di sekeliling area gigitan agar tidak digerakkan sama sekali), lalu evakuasi menuju faskes Penyedia Serum Anti Bisa Ular (SABU) gratis terdekat.

**Langkah Nyata Hari Ini:**
1. **Klaim Adminduk Digital:** Jika balai Dukcapil jauh, mintalah sekretaris desa mendaftarkan KK/KTP Anda secara kolektif digital melalui aplikasi Identitas Kependudukan Digital (IKD).
2. **Ajukan Dana Bantuan Siswa (PIP):** Daftarkan NIK anak Anda kepada operator data sekolah setempat agar status miskin/kurang mampu dimasukkan dalam prioritas penerima PIP (Program Indonesia Pintar).
3. **Adukan Pemeras Pungli:** Laporkan oknum pemeras administrasi sipil di desa ke Unit Pemberantasan Pungli (UPP) Saber Pungli Provinsi ${formData.provinsi} guna ditindaklanjuti secara hukum adat dan nasional.`;

      } else if (selectedGroup.id === 'target-difabel' || lower.includes('difabel') || lower.includes('cacat') || lower.includes('disabilitas') || lower.includes('slb')) {
        fallbackText = `👨‍🦽 **Kesetaraan & Advokasi Hak Penyandang Disabilitas buat ${formData.nama} (${formData.provinsi}):**

Hukum Indonesia menjamin pemenuhan hak-hak penyandang disabilitas secara utuh berdasarkan UU No 8 Tahun 2016.

**Analisis Masalah Hak Disabilitas:**
1. **Kuota Pekerjaan:** Setiap instansi pemerintah (BUMN/BUMD) wajib menyediakan kuota minimal **2%**, sedangkan sektor swasta wajib hukumnya menyediakan minimal **1%** untuk tenaga kerja disabilitas berkeahlian.
2. **Bantuan Alat Fisik Gratis:** Dinas Sosial mengalokasikan bantuan kursi roda, kaki palsu, alat bantu dengar, dan braille dari APBD daerah setiap tahunnya.

**Langkah Nyata Hari Ini:**
1. **Buat Surat Keterangan Disabilitas:** Minta surat resmi keterangan ragam disabilitas (fisik, intelektual, mental, atau sensorik) dari dokter Puskesmas.
2. **Ajukan Pengusulan Alat Bantu ke Dinsos:** Kirimkan surat usulan alat bantu ke Dinas Sosial Kabupaten/Kota di ${formData.provinsi} yang dilampiri foto fisik pemohon guna dimasukkan ke prioritas pagu anggaran pembagian APBD dinten ini.
3. **Konsultasikan Sekolah Luar Biasa (SLB):** Hubungi balai Dinas Pendidikan kagem mengakses beasiswa sekolah inklusi atau SLB negeri gratis tanpa hambatan biaya masuk.`;

      } else if (selectedGroup.id === 'target-pkl' || lower.includes('pkl') || lower.includes('dagang') || lower.includes('warung') || lower.includes('halal') || lower.includes('satpol')) {
        fallbackText = `🍢 **Perlindungan Hukum Pedagang Kaki Lima & Warung Kecil buat ${formData.nama} (${formData.provinsi}):**

Aktivitas wirausaha mandiri Anda dilindungi undang-undang sebagai penggerak ekonomi mikro rakyat.

**Analisis Legal PKL & UMKM:**
1. **Pendaftaran NIB Gratis:** Surat Izin Usaha sekarang disatukan dalam NIB (Nomor Induk Berusaha) yang bisa diakses instan dan gratis melalui HP. NIB ini adalah pelindung dari penertiban liar sekaligus syarat legalitas pengajuan KUR bank.
2. **Sertifikat Halal Gratis (SEHATI):** Produk makanan rumahan/warung Anda berhak memperoleh sertifikat halal gratis melalui pendaftaran mekanisme mandiri online (Self-Declare).
3. **Penertiban Satpol PP:** Kebijakan relokasi wajib diiringi dengan sosialisasi tertulis 3 kali, musyawarah bersama kagem kompensasi pemindahan area, serta penyediaan tempat penampungan dagang baru yang layak.

**Langkah Nyata Hari Ini:**
1. **Urus NIB lewat HP:** Buka portal resmi \`oss.go.id\` dengan mendaftarkan nomor WhatsApp aktif. Isikan deskripsi lapak produk makanan/minuman Anda kagem unduh NIB ber-barcode gratis dinten ini.
2. **Daftarkan QRIS Usaha Gratis:** Tunjukkan NIB ke Bank terdekat di ${formData.provinsi} kagem mengaktifkan QRIS Merchant atas nama warung Anda sendiri guna menghindari transaksi tunai kembalian sisa uang receh.
3. **Minta Negosiasi Kelompok:** Jika ada isu penertiban, gabungkan para pedagang dalam Paguyuban PKL kagem melayangkan surat keberatan resmi kepada Wali Kota / Bupati meminta mediasi lokasi dagang baru yang produktif.`;

      } else {
        fallbackText = `🇮🇩 **Tuntunan Aduan Sipil Terpadu untuk ${formData.nama} (${formData.provinsi}):**

Terima kasih atas aduan tepercaya yang Anda sampaikan mengenai: "${formData.masalah}".

**Rekomendasi Tindakan Sipil:**
1. **Kumpulkan Bukti:** Persiapkan kronologi tertulis, saksi, dokumen tertulis, foto, atau kuitansi yang mendukung aduan ini.
2. **Hindari Pungli:** Jangan membayarkan denda atau biaya administrasi tidak resmi kepada calo/pihak luar sipil.
3. **Konsultasi Legal:** Silakan ajukan berkas lengkap ke perwakilan Lembaga Bantuan Hukum (LBH) terdekat di Provinsi ${formData.provinsi} untuk mendapat konsultasi serta pendampingan gratis.`;
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
