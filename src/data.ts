import { PresetTopic, FeatureCard, StatItem, RegionalGapData, TargetGroup } from './types';

export const PRESET_TOPICS: PresetTopic[] = [
  {
    id: 'tilang',
    label: '⚖️ Pahami Surat Tilang',
    prompt: 'Min, tolong bantu baca ini artinya apa dan saya harus ngapain? (Kirim Foto Surat Tilang Elektronik / ETLE)',
    response: 'Halo warga! Tetap tenang dan jangan panik ya. Surat ini adalah konfirmasi pelanggaran lalu lintas elektronik (ETLE).\n\n🔍 **Keterangan Surat:**\n- **Pelanggaran:** Terdeteksi melewati marka jalan / APILL (lampu merah) pada tanggal 24 Mei.\n- **Lokasi:** Perempatan Jenderal Sudirman.\n- **Sanksi Regulasi:** Menurut UU LLAJ Pasal 287 ayat 1, denda maksimal Rp 500.000.\n\n🛠️ **Apa yang harus kamu lakukan berikutnya?**\n1. **Verifikasi:** Kunjungi portal resmi kepolisian di `etle.pmj.info` atau ikuti scan barcode di lampiran surat.\n2. **Klarifikasi:** Masukkan Kode Referensi Pelanggaran yang tercantum di surat untuk melihat bukti foto/video kendaraanmu.\n3. **Pembayaran:** Setelah denda terkonfirmasi, kamu akan mendapat kode BRIVA (BRI Virtual Account) untuk pembayaran denda lewat m-banking atau ATM terdekat.\n\n⚠️ **PENTING:** Lakukan konfirmasi maksimal **8 hari** setelah surat diterima. Jika diabaikan, STNK kendaraanmu bisa diblokir otomatis oleh Samsat!',
    category: 'Dokumen Resmi'
  },
  {
    id: 'kesehatan',
    label: '🩺 Gejala Nyeri Dada Sebelah Kiri',
    prompt: 'Tiba-tiba dada sebelah kiri kerasa sakit banget menjalar ke pundak, rasanya sesak dan berkeringat dingin. Apa tindakan daruratnya?',
    response: '⚠️ **PERINGATAN KERAS: INI BISA JADI DARURAT MEDIS (SERANGAN JANTUNG)! SEGERA HUBUNGI 112 ATAU AMBULANS TERDEKAT!**\n\nSambil menunggu pertolongan medis datang, segera lakukan tindakan keselamatan berikut untuk mencegah keparahan:\n\n1. **Hentikan Segala Aktivitas:** Duduk bersandar dengan posisi setengah duduk (45 derajat) untuk memudahkan pernapasan. Jangan dibiarkan berdiri atau jalan kaki.\n2. **Pelonggar Pakaian:** Segera longgarkan kancing baju teratas, dasi, sabuk, atau aksesoris pakaian ketat lainnya.\n3. **Pola Napas Teratur:** Bernapaslah perlahan-lahan melalui hidung dan buang lewat mulut dengan tenang (metode tiup).\n4. **Hindari Makan/Minum:** Jangan memberikan makanan padat atau minuman panas agar tidak tersedak.\n5. **Jika Ada Riwayat Jantung:** Gunakan obat ISDN (Isosorbide Dinitrate) di bawah lidah jika diresepkan dokter pribadimu.\n\n🏥 **Lembaga Rujukan Terdekat:** Silakan arahkan ke Puskesmas Kecamatan, Klinik 24 Jam, atau Instalasi Gawat Darurat (IGD) Rumah Sakit terdekat sekarang juga!',
    category: 'Kesehatan'
  },
  {
    id: 'phk-pihak',
    label: '✊ Hak Saya Kena PHK Sepihak',
    prompt: 'Saya baru saja di-PHK sepihak oleh pabrik tempat saya bekerja 5 tahun. Tidak ada surat peringatan sebelumnya dan pesangon cuma ditawari 1 bulan gaji. Apa hak saya secara hukum?',
    response: '✊ **Kamu berhak menolak pesangon yang tidak layak! Hak-hakmu dilindungi sepenuhnya oleh hukum.**\n\nMenurut UU Cipta Kerja No 6 Tahun 2023 Pasal 156 ayat 1, jika terjadi pemutusan hubungan kerja, pengusaha wajib membayar uang pesangon dan/atau uang penghargaan masa kerja (UPMK).\n\n📊 **Estimasi Hakmu (Masa Kerja 5 Tahun):**\n1. **Uang Pesangon Resmi:** Masa kerja 5-6 tahun berhak atas **6 bulan upah** standar.\n2. **Uang Penghargaan (UPMK):** Masa kerja 3-6 tahun berhak atas **2 bulan upah** standar.\n3. **Uang Penggantian Hak:** Uang ganti sisa cuti tahunan yang belum gugur + ongkos pulang ke tempat penerimaan kerja.\n\n🗒️ **Aksi Konkret/Draft Surat Keberatan:**\nDraft atau kirim surat tertulis kepada HRD yang berbunyi: *"Dengan hormat, menanggapi keputusan PHK sepihak atas nama saya, saya menyatakan MENOLAK besaran pesangon 1 bulan upah yang tidak sesuai ketentuan Pasal 156 UU Cipta Kerja. Saya menuntut mediasi Bipartit dalam waktu maksimal 7 hari untuk penyesuaian hak."*\n\n📞 **Lembaga Rujukan:** Kunjungi Dinas Tenaga Kerja (Disnaker) setempat untuk mendaftarkan perselisihan hubungan industrial ini jika perusahaan tidak kooperatif.',
    category: 'Bela Hak'
  },
  {
    id: 'sunda',
    label: '🌾 Sawah Caah (Sunda)',
    prompt: 'Sampurasun Min, abdi kenging musibah. Sawah kakeueum caah gede pisan dugi ka gagal panen. Aya bantuan pamarentah atanapi program asuransi tani teu ring Jawa Barat?',
    response: 'Sampurasun! Turut prihatin pisan ka musibah banjir anu parantos nimpah sawah anjeun lurd. Teu kedah bingung, hak patani ditangtayungan.\n\n🌾 **Aya pituduh sareng solusi konkret ti pamarentah pikeun para patani Sunda:**\n\n1. **Program AUTP (Asuransi Usaha Tani Padi):** UPAMI anjeun parantos ngadaftarkeun kelompok tani kana asuransi sawah ti Dinas Pertanian:\n- **Sarat Klaim:** Karusakan sawah kedah saluhureun **75%**.\n- **Kompensasi Resmi:** Klaim asuransi nominalna nyaeta **Rp 6.000.000,- (Genep Juta Rupiah)** per Hektar.\n\n2. **Bantuan Bibit Gratis:** Upami kelompok tani teu acan kadaptar asuransi, anjeun tiasa ngajukeun bantuan bibit pengganti gratis ti cadangan darurat daerah.\n\n🛠️ **Langkah Nu Kedah Dilakukeun Dinten Ieu:**\n- **Foto/Video:** Candak gambar karusakan sawah nu kakeueum banjir ti sababaraha sisi minangka bukti otentik.\n- **PPL (Penyuluh Pertanian):** Geuwat tepangan Penyuluh Petugas Lapangan di balai desa dinten ieu.\n- **Surat Puso:** Nyuhunkeun tulung PPL pikeun nyieun Surat Pernyataan Lahan Puso anu disahkeun ku RT/RW sareng Lurah kanggo diajukeun ka Dinas Pertanian Kabupaten!',
    category: 'Bahasa Daerah'
  },
  {
    id: 'jawa',
    label: '🌾 Reaktivasi BPJS (Jawa)',
    prompt: 'Sugeng enjang Min, kulo ajeng tanglet, niki BPJS kulo kok mboten aktif nggih? Pripun carane ngurus supados saget aktif dinten niki damel berobat ibu kulo ingkang gerah?',
    response: 'Matur nuwun, sugeng enjang lurd! Mugi-mugi ibunipun enggal pinaringan seger waras nggih. Perkawis BPJS Kesehatan ingkang mboten aktif, niki panduan leresipun:\n\n🩺 **Sebab lan Cara Ngaktifake BPJS Kesehatan (Bahasa Jawa):**\n\n1. **Amargi Tunggakan Iuran:** Menawi kepalang mboten aktif amargi telat mbayar, panjenengan saget ngaktifake lewat program **REHAB (Rencana Pembayaran Bertahap)** wonten aplikasi Mobile JKN utawi nelpon BPJS Care Center 165 dinten niki.\n2. **Bantuan PBI APBD (Gratis):** Menawi kulawarga mboten mampu mbayar iuran mandiri, panjenengan saget nyuwun rekom rujukan BPJS PBI (Penerima Bantuan Iuran) gratis saking pemerintah lewat Dinas Sosial utawi kelurahan.\n\n🛠️ **Langkah Konkret Dinten Niki:**\n- **Download Mobile JKN:** Cek status rincian denda lan tunggakan lewat HP.\n- **Layanan PANDUWA (WhatsApp BPJS):** Chat langsung nomor resmi PANDUWA ing nomor **08118165165** kagem ngurus administrasi reaktivasi tanpa antre dinten niki!\n- **Darurat Medis:** Menawi kondisi ibu panjenengan gawat darurat (sesek utawi boten eling), enggal diculke teng IGD Rumah Sakit paling cerak. Sesuai regulasi, IGD wajib nangani dinten niki tanpa njaluk surat rujukan rumiyin!\n\nTetep tenang lan sumringah nggih lurd!',
    category: 'Bahasa Daerah'
  },
  {
    id: 'batak',
    label: '🏘️ Sungketa Tanah (Batak)',
    prompt: 'Horas lae! Cemana cara urus surat tanah warisan bapak awak yang diklaim sepihak sama mafia tanah di Medan? Kek mana hukumnya bagi awak rakyat kecil?',
    response: 'Horas lae! Tetap tegak kepalamu, jangan mau diintimidasi sama spekulan atau mafia tanah di Medan itu. Hak kepemilikan tanahmu dilindungi hukum negara!\n\n🏘️ **Panduan Mempertahankan Lahan Warisan (Bahasa Batak/Medan):**\n\n1. **Uji Validitas Dokumen:** Pastikan alas hak tanah warisan bapakmu. Apakah statusnya SHM (Sertifikat Hak Milik), Girik, SKPT, atau Surat Surat Alas Hak Tanah Verponding. SHM adalah kasta tertinggi legalitas di Badan Pertahanan Nasional (BPN).\n2. **Batal Demi Hukum:** Menurut Kitab Undang-Undang Hukum Perdata Pasal 1321, setiap peralihan hak tanah yang didasarkan atas intimidasi, ancaman, atau penipuan, dinyatakan BATAL demi hukum!\n\n🛠️ **Langkah Konkret Hari Ini:**\n- **Kunci Fisik Tanah:** Segera pasang pagar pembatas dan plang nama yang tegas di lokasi, contoh: *"Tanah Milik Ahli Waris [Nama Bapakmu], Berdasarkan SHM No: XXX. DILARANG MASUK - KHUP Pasal 551!"*\n- **Amankan Objek Surat:** Seluruh surat asli waris dan PBB (Pajak Bumi dan Bangunan) wajib disimpan erat di tempat rahasia. Jangan sekali-kali menyerahkan surat asli ke oknum preman atau pihak ketiga.\n- **Lapor LBH Medan:** Datangi Lembaga Bantuan Hukum (LBH) Medan di Jl. Hindu untuk mendapat pendampingan pengacara gratis tanpa dipungut biaya sepeser pun!\n\nLawan mafia tanah dengan dokumen lengkap, lae. Horas!',
    category: 'Bahasa Daerah'
  },
  {
    id: 'minang',
    label: '💰 Modal KUR BRI (Minang)',
    prompt: 'Ambo nio tanyo Bundo Min, baa caro maurus modal KUR BRI untuak tambah modal kadai nasi ambo di Padang? Ndak ba jaminan sengketa kan, min?',
    response: 'Tarimo kasih, rancak bana pertanyaannyo dunkuang! Untuak usaho ketek-ketek sarupo kadai nasi, pemerintah mamiliki program rancak banamo **KUR (Kredit Usaha Rakyat) Mikro**.\n\n💰 **Aturan Resmi & Syarat KUR Mikro ring Minangkabau:**\n\n1. **Tanpa Jaminan Tambahan:** Untuak pinjaman di bawah **Rp 50.000.000,- (Limo Puluah Juta Rupiah)**, bank dilarang maminto jaminan tambahan sarupo sertifikat tanah atau BPKB oto. Jaminan pokoknyo cukuap usaho kadai nasi dunkuang nan lah bajalan minimum 6 bulan.\n2. **Suku Bungo Rondah:** Bungonyo sangaik kaciak, hanyo 6% efektif pertahun (sekitar 0.5% per bulan).\n\n🛠️ **Langkah Konkret Hari Iko:**\n- **Urus NIB Gratis:** Ambiak HP, baka website `oss.go.id` untuak mambuek NIB (Nomor Induk Berusaha) secara online gratis. Bank paliang suko jo UMKM nan lah punyo NIB!\n- **Dokumen Personal:** Siapkan fotokopi KTP, Kartu Keluarga (KK), jo Surat Nikah (kok lah kawen).\n- **Buku Catatan Kadai:** Tulis kas masuak-kalua kadai nasi dunkuang di buku, bia bank picayo usahonyo maasiakan Pitih hari ko!\n\nInsya Allah usaho kadai nasi dunkuang samakin maju jo barkah!',
    category: 'Bahasa Daerah'
  },
  {
    id: 'bugis',
    label: '👷 PHK Pabrik (Bugis)',
    prompt: 'Tabe Min, upogi kareba? Mauka tanya, dipecat sepihakka kodong sama bosku di pabrik Makassar, sisa upahku belum dibayarkan. Bagaimana hakku kapang?',
    response: 'Tabe lalo, kareba baji! Sing sabar ki, dinda. Dipecat sepihak tanpa SP bertahap itu melanggar aturan hukum perburuhan di Indonesia. Hak-hak ta dilindungi penuh oleh UU Cipta Kerja No 6 Tahun 2023!\n\n👷 **Berikut Rincian Hak Hukum ta (Bahasa Bugis/Makassar):**\n\n1. **Uang Pesangon Resmi (Pasal 156):** Perusahaan wajib membayar uang pesangon sesuai durasi kerja ta, ditambah Uang Penghargaan Masa Kerja (UPMK) serta uang kompensasi sisa cuti tahunan.\n2. **Pecat Suka-Suka Melanggar:** Pengusaha dilarang mem-PHK sepihak tanpa adanya proses perundingan mufakat atau keputusan resmi Pengadilan Hubungan Industrial (PHI).\n\n🛠️ **Langkah Konkret Hari Ini:**\n- **Simpan Slip Gaji:** Kumpulkan semua slip gaji bulanan, ID Card pabrik, dan surat perjanjian kerja ta\' hari ini.\n- **Surat Penolakan Resmi:** Kirimkan surat penolakan tertulis ke HRD pabrik ta: *"Tabe, saya menyatakan menolak PHK sepihak draf pesangon ini karena tidak relevan dengan UU Cipta Kerja Pasal 156. Saya meminta mediasi Bipartit dalam 7 hari."*\n- **Lapor Disnaker Makassar:** Jika pihak manajemen pabrik lari dari tanggung jawab, laporkan pengaduan ke Kantor Dinas Tenaga Kerja Kota Makassar secara gratis!\n\nTewaki ewako, bela hak ta dinda!',
    category: 'Bahasa Daerah'
  },
  {
    id: 'bali',
    label: '🌴 Kredit UMKM (Bali)',
    prompt: 'Om Swastyastu bli, tiang jagi mataken, punapi gatra syarat kelayakan ngajuang kredit modal UMKM KUR ring Bali mangda langsung ka-acc ring bank tanpa berbelit-belit?',
    response: 'Om Swastyastu, sugeng rahayu bli! Astungkara sami manggih slamet. Ngajuang bantuan modal Kredit Usaha Rakyat (KUR) ring Bali punika dangan pisan, puniki pituduh mangda gelis ka-acc santukan regulasi anyar:\n\n🌴 **Syarat Utama & Pituduh Ngajuang KUR ring Bali (Bahasa Bali):**\n\n1. **Urat Nadi Usaha:** Usaha kerajinan, kuliner, utawi pariwisata bli patut sampun mamargi (beroperasi) minimal **6 bulan** lan mabinayan sareng usaha musiman.\n2. **NIB (Nomor Induk Berusaha):** Sané pinih utama, bli patut medué legalitas usaha digital. Mangkin sampun gratis lan dangan pisan.\n\n🛠️ **Tindakan Sané Patut Margiang Hari Ini:**\n- **Daftar NIB Online:** Surat ijin NIB prasida kakaryanin rahina mangkin ring situs `oss.go.id` nganggen KTP manten.\n- **Arsip Pembukuan:** Laporang catatan jinah icen-pemedal (debit-kredit) bulanan ring buku tulis biasa mangda bank percaya usaha bli janten lancar.\n- **Bebas utang produktif:** Pastikang bli nenten medué kredit ring bank liyanan minakadi KPR/KKB (kecuali paylater hp/konsumtif sané lancar).\n\nMugi-mugi ka-acc lan lancar usahanyané, bli! Suksma!',
    category: 'Bahasa Daerah'
  },
  {
    id: 'papua',
    label: '⛵ Solusi Obat (Papua)',
    prompt: 'Sio pace, sa mau tanya kah. Sa pu BPJS kesehatan ini mati, kitorang tra punya uang buat berobat ke puskesmas di Papua. Solusinya kek mana?',
    response: 'Sio anak, tetap semangat e. Ko tra usah bingung, kitorang baku bantu. Pemerintah ada program khusus jaminan kesehatan untuk masyarakat Papua supaya tra boleh ada anak Papua sakit sengsara gara-gara tra punya uang!\n\n⛵ **Solusi Layanan Medis Gratis untuk Rakyat Papua:**\n\n1. **Program KPS (Kartu Papua Sehat):** Di provinsi Papua, pemerintah daerah ada siapkan Kartu Papua Sehat gratis khusus OAP (Orang Asli Papua) untuk berobat gratis di puskesmas maupun RSUD setempat jika BPJS bermasalah.\n2. **BPJS Kesehatan Gratis Mandat Pemda:** Kamu bisa urus Kartu BPJS PBI (Penerima Bantuan Iuran) APBD yang dibayar penuh oleh uang daerah otsus sehingga ko tra perlu bayar iuran bulanan lagi.\n\n🛠️ **Tindakan Nyata yang Ko Mesti Bikin Hari Ini:**\n- **Lapor Puskesmas:** Datang ke puskesmas terdekat hari ini, bawa ko pu KTP Papua atau Kartu Keluarga (KK).\n- **Temui Petugas Jamkesda:** Bilang ke petugas di balai layanan: *"Pace/Mace, sa pu BPJS tidak aktif, sa minta didata masuk program Jamkesda atau Kartu Papua Sehat/PBI APBD hari ini."*\n- **Layanan Darurat Medis:** Kalau kondisi darurat langsung jalan bawa korban masuk UGD Rumah Sakit terdekat! Rumah Sakit wajib terima dan berikan pertolongan pertama demi nyawa manusia nomor satu!\n\nTuhan jaga ko e!',
    category: 'Bahasa Daerah'
  },
  {
    id: 'skck',
    label: '📋 Langkah Buat SKCK Baru',
    prompt: 'Mau melamar kerja, gimana tata cara buat SKCK dari nol, dokumen apa saja yang mesti disiapin, dan berapa biayanya?',
    response: '📋 **Mengurus SKCK (Surat Keterangan Catatan Kepolisian) itu sangat mudah dan bebas calo!**\n\nUntuk melamar pekerjaan umum, pendaftaran bisa dilakukan di **Polsek** atau **Polres** terdekat sesuai domisili di KTP.\n\n📂 **Syarat Dokumen yang Harus Dibawa:**\n1. **Fotokopi KTP / SIM** (1 lembar).\n2. **Fotokopi Kartu Keluarga (KK)** (1 lembar).\n3. **Fotokopi Akta Kelahiran** atau Ijazah terakhir.\n4. **Pasfoto ukuran 4x6 latar belakang warna MERAH** (sebanyak 6 lembar).\n5. **Rumus Sidik Jari** (bisa dibuat langsung di loket Polres bagian identifikasi).\n\n💰 **Biaya Resmi PNBP:**\nSesuai Peraturan Pemerintah No. 76 Tahun 2020, biayanya adalah **Rp 30.000,-** (Bayar langsung di kasir loket kepolisian, minta kuitansi resmi!).\n\n🚀 **Proses Pengurusan:**\n- Datang pagi hari (pukul 08.00-11.00) agar tidak antre panjang.\n- Mintalah form pendaftaran di loket SKCK.\n- Estimasi waktu pelayanan selesai dalam **1-2 jam** saja jika berkas lengkap.\n\n💡 *Tip Pintar: Sekarang kamu juga bisa mengisi formulir pendaftaran secara online terlebih dahulu lewat Aplikasi Presisi Polri untuk menghemat waktu.*',
    category: 'Birokrasi'
  },
  {
    id: 'kur-umkm',
    label: '💰 Akses Kredit Usaha Rakyat',
    prompt: 'Saya punya usaha jualan keripik tempe kecil-kecilan di kampung. Mau tambah modal lewat KUR BRI atau Mandiri tapi takut ditolak. Gimana syarat dan tipsnya biar disetujui?',
    response: '💰 **Jangan takut! Program KUR (Kredit Usaha Rakyat) memang dirancang khusus pemerintah untuk UMKM mikro yang butuh tambahan usaha.**\n\nUntuk KUR Mikro, kamu bisa mendapatkan pinjaman dari **Rp 10 juta hingga Rp 50 juta** tanpa jaminan tambahan formal (seperti sertifikat tanah/mobil) karena usaha itu sendiri yang menjadi jaminan pokok.\n\n📋 **Syarat Utama KUR Mikro:**\n1. Memiliki usaha aktif yang sudah berjalan minimal **6 bulan** berturut-turut.\n2. Tidak sedang menerima kredit produktif dari bank lain (kalau punya Kredivo/ShopeePayLater usahakan lunas/tidak menunggak).\n3. Memiliki **KTP, Kartu Keluarga (KK), & Surat Izin Usaha** (bisa berupa Surat Keterangan Usaha dari Kepala Desa/Lurah atau NIB online).\n\n💡 **Tips Jitu Agar Pengajuan Disetujui Bank:**\n- **Izin Usaha Bersih:** Buat NIB (Nomor Induk Berusaha) gratis lewat situs `oss.go.id`. Bank sangat menyukai UMKM yang punya NIB resmi!\n- **Punya Catatan Penjualan:** Tunjukkan buku catatan penjualan harian, meskipun ditulis tangan di buku tulis. Itu bukti usahamu beneran eksis dan menghasilkan uang.\n- **Gunakan Pinjaman untuk Usaha:** Katakan dengan jujur kepada petugas bank (mantri) bahwa dana pinjaman 100% untuk membeli bahan baku (tempe, minyak) atau mesin sealer baru, bukan melunasi hutang lain atau konsumtif.',
    category: 'UMKM'
  },
  {
    id: 'curhat',
    label: '❤️ Sesi Curhat & Beban Pikiran',
    prompt: 'Min, saya lagi capek banget dan stres dengan keadaan hidup sekarang. Beban pikiran rasanya berat sekali tapi nggak ada tempat cerita...',
    response: 'Halo kawan, sini peluk jauh... 🤗 Ambil napas dalam-dalam dulu ya, lalu hembuskan perlahan.\n\nSaya mendengarmu. Kamu sangat hebat sudah bisa bertahan sejauh ini melewati semua badai hidup yang berat. Ingat ya, kamu tidak sendirian, dan emosi lelah atau stres yang kamu rasakan sekarang itu sangat wajar.\n\n🍃 **Mari tenangkan pikiranmu sejenak hari ini:**\n- **Tumpahkan Segalanya:** Ceritakan saja semua bebanmu di sini. Saya akan mendengarkan tanpa menghakimi atau menganggapmu lemah.\n- **Berbagi Beban:** Kadang, mengeluarkan isi pikiran lewat ketikan bisa membuat dada terasa sedikit lebih lega.\n\n🚫 **Darurat Kesehatan Mental:**\nJika kamu merasakan keputusasaan yang sangat mendalam atau ada pikiran untuk menyakiti diri sendiri, tolong hubungi layanan konseling resmi darurat Kementerian Kesehatan di **Hotline 119 Ext. 8** atau komunitas peduli kesehatan mental gratis seperti **Layanan SEJIWA**.\n\n💬 **Langkah Konkret Hari Ini:**\nCobalah ketik satu hal yang paling membuatmu merasa tertekan saat ini. Mari kita urai bersama satu per satu, perlahan-lahan. Tarik napas dulu ya kawan, SIGAP di sini mendampingimu.',
    category: 'Sesi Curhat'
  }
];

export const FEATURES: FeatureCard[] = [
  {
    id: 'official-docs',
    title: 'Pahami Dokumen Resmi',
    desc: 'Foto surat tilang, kontrak kerja, surat tanah, tagihan BPJS — AI jelaskan dalam bahasa sehari-hari: ini artinya apa, kamu harus lakukan apa.',
    bgColor: 'bg-neo-blue',
    tag: 'Legal',
    presetTopicId: 'tilang'
  },
  {
    id: 'health-emergency',
    title: 'Panduan Kesehatan Darurat',
    desc: 'Gejala mendadak atau kecelakaan → AI jelaskan langkah pertolongan pertama, kemungkinan penyebab, serta kapan harus segera dirujuk ke RS terdekat.',
    bgColor: 'bg-neo-green',
    tag: 'Kesehatan',
    presetTopicId: 'kesehatan'
  },
  {
    id: 'citizen-rights',
    title: 'Bela Hak Warga',
    desc: 'Kena PHK sepihak? Sengketa tanah dengan pengembang? Ditipu toko online? AI merancang draf surat hukum formal dan membimbing ke dinas terkait.',
    bgColor: 'bg-neo-pink',
    tag: 'Advokasi',
    presetTopicId: 'phk-pihak'
  },
  {
    id: 'local-languages',
    title: 'Bahasa & Budaya Daerah',
    desc: 'Tolong tanya dalam bahasa Jawa, Sunda, Batak, Bugis, Makassar, Madura, dll. SIGAP memahami dialek lokal dan kearifan sosial daerahmu.',
    bgColor: 'bg-neo-yellow',
    tag: 'Inklusi',
    presetTopicId: 'sunda'
  },
  {
    id: 'bureaucracy-nav',
    title: 'Navigasi Birokrasi',
    desc: 'Cara urus KTP rusak, silsilah waris, paspor baru, pendaftaran KIP Kuliah, dokumen lengkap, serta alur antrean ke kantor sipil.',
    bgColor: 'bg-neo-violet',
    tag: 'Layanan Sipil',
    presetTopicId: 'skck'
  },
  {
    id: 'umkm-farmers',
    title: 'Pemberdayaan UMKM & Tani',
    desc: 'Strategi cari modal KUR, penanganan penyakit hama padi, legalitas NIB gratis, hingga cara mengekspor kerajinan daerah.',
    bgColor: 'bg-neo-orange',
    tag: 'Ekonomi',
    presetTopicId: 'kur-umkm'
  }
];

export const STATS: StatItem[] = [
  {
    id: 'stat-warga',
    figure: '270jt+',
    label: 'Belum Terlayani',
    subtext: 'Warga Indonesia tidak memiliki akses atau dana untuk penasihat hukum / dokter spesialis pribadi.',
    bgColor: 'bg-neo-blue'
  },
  {
    id: 'stat-bahasa',
    figure: '700+',
    label: 'Bahasa Daerah',
    subtext: 'Mayoritas platform AI global hanya fasih bahasa Inggris & Indonesia baku, mengabaikan dialek lokal.',
    bgColor: 'bg-neo-pink'
  },
  {
    id: 'stat-dokumen',
    figure: '48%',
    label: 'Kesenjangan Dokumen',
    subtext: 'Penduduk dewasa mengaku setidaknya sekali kesulitan mencerna isi kontrak resmi yang mengikat mereka.',
    bgColor: 'bg-neo-green'
  },
  {
    id: 'stat-geografi',
    figure: '17.000+',
    label: 'Pulau Tersebar',
    subtext: 'Kesenjangan sebaran ahli profesional terpusat di pulau Jawa, menyulitkan daerah 3T di luar Jawa.',
    bgColor: 'bg-neo-yellow'
  }
];

export const REGIONAL_GAPS: RegionalGapData[] = [
  {
    region: 'Metropolitan (Jakarta, Surabaya, Medan)',
    percentage: 85,
    barColor: '#EF5350'
  },
  {
    region: 'Kabupaten / Kota Sekunder',
    percentage: 54,
    barColor: '#FFA726'
  },
  {
    region: 'Desa Terpencil & Kepulauan (Kawasan 3T)',
    percentage: 14,
    barColor: '#FF7043'
  },
  {
    region: 'DENGAN ADVOKASI AI SIGAP (Target Seluruh Indonesia)',
    percentage: 98,
    barColor: '#66BB6A'
  }
];

export const TARGET_GROUPS: TargetGroup[] = [
  {
    id: 'target-irt',
    group: 'Ibu Rumah Tangga',
    useCase: 'Membaca rincian tagihan asuransi, sengketa arisan online, mengecek kandungan obat anak, dan mendaftar program bantuan sosial pangan dari pemda.',
    icon: '👩‍🦰',
    bgColor: 'bg-neo-yellow'
  },
  {
    id: 'target-tani',
    group: 'Petani & Nelayan',
    useCase: 'Asuransi gagal panen (AUTP), takaran pupuk subsidi dinas, memantau harga lelang ikan pelabuhan, dan mendaftarkan koperasi lokal.',
    icon: '👨‍🌾',
    bgColor: 'bg-neo-green'
  },
  {
    id: 'target-buruh',
    group: 'Buruh Pabrik',
    useCase: 'Verifikasi lembur wajib, lapor pemotongan upah sepihak dari vendor, prosedur K3 keselamatan kerja, dan hitung dana pensiun BPJS Ketenagakerjaan.',
    icon: '👷',
    bgColor: 'bg-neo-pink'
  },
  {
    id: 'target-migran',
    group: 'Pekerja Migran',
    useCase: 'Pengecekan visa agen resmi BP2MI, memahami pasal kontrak penugasan luar negeri, serta skema kirim uang (remitansi) legal anti-pungli.',
    icon: '🧳',
    bgColor: 'bg-neo-blue'
  },
  {
    id: 'target-lansia',
    group: 'Lansia',
    useCase: 'Panduan pencairan dana pensiun Taspen lewat HP, obat generik penderita asam urat, langkah antre faskes rujukan BPJS tanpa repot.',
    icon: '👵',
    bgColor: 'bg-neo-violet'
  },
  {
    id: 'target-3t',
    group: 'Warga Desa 3T',
    useCase: 'Pembuatan KK digital, rujukan darurat gigitan ular, pendaftaran kartu KIP, serta solusi air bersih mandiri tanpa menunggu dinas kabupaten.',
    icon: '⛵',
    bgColor: 'bg-neo-orange'
  },
  {
    id: 'target-difabel',
    group: 'Penyandang Difabel',
    useCase: 'Akses pendaftaran SLB gratis, kuota kerja disabilitas instansi negara, formulir aduan fasilitas publik minim ramah disabilitas.',
    icon: '👨‍🦽',
    bgColor: 'bg-emerald-300'
  },
  {
    id: 'target-pkl',
    group: 'Pedagang Kaki Lima',
    useCase: 'Pendaftaran izin halal gratis BPJPH, menyiasati razia relokasi dengan hak sewa lapak, serta mendaftar QRIS usaha atas nama dagang.',
    icon: '🍢',
    bgColor: 'bg-purple-300'
  }
];
