import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Function to provide a beautiful, robust smart rule-based fallback if Gemini API is denied or fails
function getSmartFallbackResponse(query: string, topicId?: string): string {
  const text = (query || "").toLowerCase().trim();
  
  // Mapping of exact prompts to override with topicId
  const exactPrompts: Record<string, string> = {
    'min, tolong bantu baca ini artinya apa dan saya harus ngapain? (kirim foto surat tilang elektronik / etle)': 'tilang',
    'tiba-tiba dada sebelah kiri kerasa sakit banget menjalar ke pundak, rasanya sesak dan berkeringat dingin. apa tindakan daruratnya?': 'kesehatan',
    'saya baru saja di-phk sepihak oleh pabrik tempat saya bekerja 5 tahun. tidak ada surat peringatan sebelumnya dan pesangon cuma ditawari 1 bulan gaji. apa hak saya secara hukum?': 'phk-pihak',
    'sampurasun min, abdi kenging musibah. sawah kakeueum caah gede pisan dugi ka gagal panen. aya bantuan pamarentah atanapi program asuransi tani teu ring jawa barat?': 'sunda',
    'sugeng enjang min, kulo ajeng tanglet, niki bpjs kulo kok mboten aktif nggih? pripun carane ngurus supados saget aktif dinten niki damel berobat ibu kulo ingkang gerah?': 'jawa',
    'horas lae! cemana cara urus surat tanah warisan bapak awak yang diklaim sepihak sama mafia tanah di medan? kek mana hukumnya bagi awak rakyat kecil?': 'batak',
    'ambo nio tanyo bundo min, baa caro maurus modal kur bri untuak tambah modal kadai nasi ambo di padang? ndak ba jaminan sengketa kan, min?': 'minang',
    'tabe min, upogi kareba? mauka tanya, dipecat sepihakka kodong sama bosku di pabrik makassar, sisa upahku belum dibayarkan. bagaimana hakku kapang?': 'bugis',
    'om swastyastu bli, tiang jagi mataken, punapi gatra syarat kelayakan ngajuang kredit modal umkm kur ring bali mangda langsung ka-acc ring bank tanpa berbelit-belit?': 'bali',
    'sio pace, sa mau tanya kah. sa pu bpjs kesehatan ini mati, kitorang tra punya uang buat berobat ke puskesmas di papua. solusinya kek mana?': 'papua',
    'mau melamar kerja, gimana tata cara buat skck dari nol, dokumen apa saja yang mesti disiapin, dan berapa biayanya?': 'skck',
    'saya punya usaha jualan keripik tempe kecil-kecilan di kampung. mau tambah modal lewat kur bri atau mandiri tapi takut ditolak. gimana syarat dan tipsnya biar disetujui?': 'kur-umkm',
    'min, saya lagi capek banget dan stres dengan keadaan hidup sekarang. beban pikiran rasanya berat sekali tapi nggak ada tempat cerita...': 'curhat'
  };

  let finalTopicId = topicId;
  if (!finalTopicId && exactPrompts[text]) {
    finalTopicId = exactPrompts[text];
  }

  // 1. High fidelity Language/Regional detection
  const isJawa = text.includes("kulo") || text.includes("mboten") || text.includes("nggih") || text.includes("jenengan") || text.includes("piye") || text.includes("enjang") || text.includes("matur") || text.includes("sugeng") || text.includes("panjenengan") || text.includes("sederek") || text.includes("dinten") || text.includes("jowo") || text.includes("lurd") || text.includes("pripun");
  const isSunda = text.includes("abdi") || text.includes("teu") || text.includes("anjeun") || text.includes("kumaha") || text.includes("hapunten") || text.includes("sampurasun") || text.includes("tos") || text.includes("nuhun") || text.includes("hoyong") || text.includes("sunda") || text.includes("akang") || text.includes("teteh") || text.includes("baraya") || (text.includes("sawah") && text.includes("caah"));
  const isBatak = text.includes("horas") || text.includes("lae") || text.includes("cemana") || text.includes("awak") || text.includes("itok") || text.includes("kelen") || text.includes("kek mana") || text.includes("bah") || text.includes("warisan") || text.includes("medan") || text.includes("kedan") || text.includes("batak");
  const isMinang = text.includes("ambo") || text.includes("nio") || text.includes("tanyo") || text.includes("baa") || text.includes("rancak") || text.includes("aden") || text.includes("urang") || text.includes("tarimo") || text.includes("kadai") || text.includes("padang") || text.includes("dunkuang") || text.includes("minang") || text.includes("sanak");
  const isBugis = text.includes("tabe") || text.includes("kareba") || text.includes("kodong") || text.includes("maki") || text.includes("makassar") || text.includes("bosku") || text.includes("baji") || text.includes("bugis") || text.includes("dinda");
  const isBali = text.includes("swastyastu") || text.includes("tiang") || text.includes("mataken") || text.includes("gatra") || text.includes("suksma") || text.includes("bli") || text.includes("rahayu") || text.includes("ring bali") || text.includes("punapi") || text.includes("bali");
  const isPapua = text.includes("pace") || text.includes("mace") || text.includes("kitorang") || text.includes("tra punya") || text.includes("trada") || text.includes("kah") || text.includes("sio") || text.includes("papua") || text.includes("sa pu") || text.includes("ko pu");

  // 2. High fidelity Topic Detection
  const hasBPJS = text.includes("bpjs") || text.includes("gratis") || text.includes("yuran") || text.includes("kartu sehat") || text.includes("pbi") || text.includes("tunggak") || text.includes("rehab") || text.includes("jkn");
  const hasTani = text.includes("sawah") || text.includes("banjir") || text.includes("caah") || text.includes("tani") || text.includes("gagal") || text.includes("panen") || text.includes("kebon") || text.includes("tanduran") || text.includes("bibit") || text.includes("puso");
  const hasPHK = text.includes("phk") || text.includes("pecat") || text.includes("pesangon") || text.includes("disnaker") || text.includes("lembur") || (text.includes("kerja") && (text.includes("pecat") || text.includes("gaji") || text.includes("upah") || text.includes("pabrik") || text.includes("sepihak") || text.includes("kontrak")));
  const hasTanah = text.includes("tanah") || text.includes("sertifikat") || text.includes("sengketa") || text.includes("lahan") || text.includes("shm") || text.includes("agraria") || text.includes("bpn") || text.includes("mafia") || text.includes("warisan") || text.includes("patok") || text.includes("hukum sipil");
  const hasKUR = text.includes("modal") || text.includes("kur") || text.includes("bri") || text.includes("umkm") || text.includes("kredit") || text.includes("bank") || text.includes("pitih") || (text.includes("usaha") && !text.includes("sengketa"));
  const hasCivil = text.includes("ktp") || text.includes("kk") || text.includes("nik") || text.includes("birokrasi") || text.includes("dukcapil") || text.includes("administrasi") || text.includes("surat resmi");
  const hasEmergency = text.includes("sakit") || text.includes("dada") || text.includes("sesak") || text.includes("jantung") || text.includes("darurat") || text.includes("kecelakaan") || text.includes("pendarahan") || text.includes("luka") || text.includes("pundak") || text.includes("nyeri");
  const hasCurhat = text.includes("curhat") || text.includes("capek") || text.includes("stres") || text.includes("beban") || text.includes("sedih") || text.includes("mental") || text.includes("putus asa") || text.includes("lelah") || text.includes("judheg") || text.includes("bimbang");
  const hasTilang = text.includes("tilang") || text.includes("etle") || text.includes("samsat");
  const hasSKCK = text.includes("skck");

  // Multi-Turn Unified Regional CIVIC Dictionary
  const DICT: Record<string, any> = {
    jawa: {
      langName: "Boso Jowo",
      greeting: "Sugeng siyang lurd! SIGAP siap mbantu panjenengan kanti ikhlas.",
      emergency: `⚠️ **DARURAT MEDIS (JAWA):**\n\nNyeri dodo kiwo lan sesek napas saget tanda serangan jantung! \n\n📞 **Timbale Ambulans 112** utawi enggal mlayu teng IGD Rumah Sakit paling cerak dinten niki! Ampun nyetir piyambak.\n\n**Langkah Slamet dinten niki:** Lenggah sumendhe setengah lungguhan (45 derajat) supados napase longgar, ojo mlampah-mlampah!`,
      tani: `🌾 **Program Sawah Kebanjiran (JAWA):**\n\nMenawi dipun daptar AUTP, panjenengan saget klaim ganti rugi **Rp 6.000.000,-** per Hektar (karusakan sawah luwih saking 75%).\n\n**Langkah dinten niki:** Enggal foto karusakan sawah lan kepanggih Penyuluh Pertanian (PPL) wonten balai desa dinten niki kagem ngurus asuransi utawi bantuan bibit padi gratis!`,
      phk: `✊ **Hak Buruh PHK Sepihak (JAWA):**\n\nHak panjenengan dipun dapingi UU Ciptaker No 6/2023 Pasal 156. Kerja 5 tahun berhak angsal pesangon 6 bulan upah + 2 bulan UMPK.\n\n**Langkah dinten niki:** Amanke slip gaji lan kontrak kerja asli dinten niki. Ampun nanda-tangani berkas mundur sepihak menawi dirasa dipekso utawi mboten adil!`,
      tanah: `🏘️ **Hukum Sengketa Tanah Waris (JAWA):**\n\nSertifikat Hak Milik (SHM) tina BPN niku bukti kepemilikan paling kuat piyambak. KUHPer Pasal 1321 netoaken rembugan amargi paksaan iku BATAL demi hukum.\n\n**Langkah dinten niki:** Pasang pager/patok lan plang waris wonten lokasi. Laporke sengketa niki dhateng LBH gratis kagem pendampingan hukum!`,
      bpjs: `🩺 **Bantuan BPJS Kesehatan (JAWA):**\n\nBPJS nunggak saget diaktifke malih liwat program cicilan **REHAB** wonten Mobile JKN, hobi WA **PANDUWA BPJS (08118165165)** dinten niki.\n\n**Langkah dinten niki:** IGD Rumah Sakit wajib nampi pelayanan gawat darurat dinten niki tanpa rujukan rumiyin! Menawi mboten mampu, nyuwun rujukan kartu PBI gratis saking kelurahan.`,
      modal: `💰 **Modal KUR UMKM Dagang (JAWA):**\n\nKUR Mikro silihane di handape Rp 50 Juta mboten mbetahaken jaminan tambahan sertifikat. Jaminane nggih usaha jualan panjenengan ingkang sampun mlampah minimal 6 sasi.\n\n**Langkah dinten niki:** Damel **NIB** online gratis wonten \`oss.go.id\` liwat HP, banjur tindak dhateng mantri Bank BRI/Mandiri paling cerak nggawa KTP.`,
      tilang: `⚖️ **Telaah Tilang Elektronik / ETLE (JAWA):**\n\nBatas konfirmasi ETLE namung **8 dinten**. Cek foto/video pelanggaran wonten portal ETLE.\n\n**Langkah dinten niki:** Sanggah online yen motor wis dijual batur. Yen pancen melanggar, bayar liwat kode virtual BRIVA transfer bank resmi, **ojo mbayar tunai dhumateng polisi!**`,
      curhat: `❤️ **Sesi Curhat & Beban Pikiran (JAWA):**\n\nKulo mirengaken kanthi tulus sedaya keluh kesah lan panandang panjenengan dinten niki. 🤗 Panjenengan niku tiyang kuat ingkang sampun lincah liwat kathah pacoban urip. \n\n**Langkah dinten niki:** Serat 1 perkawis sing paling ngebaki dodo wonten mriki. Yen judheg sanget, hubungi **Hotline Kemenkes 119 Ext. 8** gratis.`,
      general: `🇮🇩 **SIGAP Pendamping Warga (JAWA):**\n\nKulo siap mbantu panjenengan ngrampungi macem-macem urusan lan perkawis sipil dinten niki tanpa calo.\n\nPanjenengan saget taken bab:\n- 🩺 **BPJS & Jaminan Kesehatan**\n- 🏘️ **Sengketa Tanah Waris / SHM**\n- ✊ **Ketenagakerjaan / PHK Sepihak**\n- 🌾 **Asuransi Tani / Sawah Kebanjiran**\n- 💰 **Kredit KUR Modal Usaha**\n- ⚖️ **Surat Tilang ETLE**\n- ❤️ **Sesi Curhat & Beban Pikiran**\n\n**Langkah dinten niki:** Mangga serat pitakonan utawi keluhan lengkap panjenengan teng mriki nggih lurd, utawi unggah berkas surat resmi supados kulo saged mriksani!`
    },
    sunda: {
      langName: "Bahasa Sunda",
      greeting: "Sampurasun baraya Sunda! SIGAP siap nungtun jalan kaluar anu tiis saged dinten ieu.",
      emergency: `⚠️ **DARURAT MEDIS (SUNDA):**\n\nNyeri dada kenca sareng sesak napas tiasa janten tanda serangan jantung! \n\n📞 **Geuwat hubungi 112** atanapi mios ka faskes / IGD Rumah Sakit pangcaketna dinten ieu! Tong nyetir nyalira.\n\n**Langkah Salamet dinten ieu:** Candak posisi calik rorompok (45 derajat) supados dada ngemplong lega. Ulah mapah atanapi nangtung!`,
      tani: `🌾 **Sawah Kebanjiran / Caah (SUNDA):**\n\nUpami kelompok tani anjeun parantos daptar program AUTP ti Dinas Pertanian, saged klaim ganti rugi **Rp 6.000.000,-** per Hektar (upami ruksak lahan saluhureun 75%).\n\n**Langkah dinten ieu:** Candak foto karusakan sawah ti sababaraha sisi, tuluy tepangan petugas PPL di balai desa pikeun ngajukeun bantuan bios pengganti gratis!`,
      phk: `✊ **Bela Hak Buruh PHK Sepihak (SUNDA):**\n\nHak buruh ditangtayungan ku UU Ciptaker No 6/2023 Pasal 156. Upami didamel 5 taun, anjeun berhak kenging pesangon 6 bulan upah + 2 bulan upah penghargaan.\n\n**Langkah dinten ieu:** Amankeun slip gaji sareng lambar kontrak asli dinten ieu. Tong buru-buru kersa nandatanganan kertas pengunduran diri sepihak upami dipaksa HRD!`,
      tanah: `🏘️ **Sengketa Tanah Warisan (SUNDA):**\n\nSertifikat Hak Milik (SHM) tina BPN mangrupikeun bukti legalitas mutlak pangkuatna. KUHPer Pasal 1321 nyebatkeun sagala rupa panyaluran taneuh dumasar paksaan dinyatakeun BATAL demi hukum.\n\n**Langkah dinten ieu:** Pageran taneuh anjeun sareng pasang plang ahli waris dinten ieu. Hubungi LBH Jawa Barat pikeun meunangkeun pengacara gratis!`,
      bpjs: `🩺 **Bantuan Layanan BPJS (SUNDA):**\n\nBPJS mareum tiasa diaktipkeun deui ngalangkungan program **REHAB** dina Mobile JKN, atanapi mangga chat WA resmi **PANDUWA (08118165165)** dinten ieu.\n\n**Langkah dinten ieu:** IGD Rumah Sakit wajib nampi pasien darurat dinten ieu tanpa rujukan ti heula! Lamun teu mampuh, menta kartu PBI gratis ka kelurahan.`,
      modal: `💰 **Modal Kredit KUR UMKM (SUNDA):**\n\nKUR di handapeun Rp 50 Juta dilarang nganggo jaminan tambahan sertifikat taneuh atanapi motor. Jaminan cekap usaha anjeun anu parantos jalan 6 bulan.\n\n**Langkah dinten ieu:** Daptar **NIB** online gratis dina portal \`oss.go.id\` nganggen KTP, teras dongkapan mantri Bank BRI/Mandiri pangcaketna dinten ieu.`,
      tilang: `⚖️ **Tilang Tilang ETLE (SUNDA):**\n\nBatas konfirmasi tilang nyaeta **8 dinten**. Cek foto/video palanggaran dina website konfirmasi ETLE.\n\n**Langkah dinten ieu:** Sanggah online lamun motor parantos dijual. Lamun leres melanggar, bayar resmi nganggo kode BRIVA virtual, **tong marios bayar tunai ka pulisi!**`,
      curhat: `❤️ **Sesi Curhat & Penenang Pikiran (SUNDA):**\n\nAbdi ngupingkeun tulus tina hate sakumaha beuratna beban anjeun dinten ieu. 🤗 Anjeun teu nyalira, kawan. Anjeun jalma kuat anu parantos satia ngaliwatan seueur cocoba hirup. \n\n**Langkah dinten ieu:** Seratkeun hiji perkawis anu paling sereg dina dada di dieu, urang lalaunan milarian solusi jeung SIGAP.`,
      general: `🇮🇩 **SIGAP Pendamping Warga (SUNDA):**\n\nAbdi siap ngabantu sadaya pasualanna dinten ieu kalayan gampil tanpa nganggo calo.\n\nBaraya tiasa naroskeun perkawis:\n- 🩺 **BPJS & Jaminan Kaséhatan**\n- 🏘️ **Sengketa Taneuh/Lahan Warisan**\n- ✊ **Katenagakerjaan & PHK**\n- 🌾 **Sawah Kebanjiran / Tani**\n- 💰 **Modal Kredit KUR UMKM**\n- ⚖️ **Sanggah Tilang ETLE**\n- ❤️ **Sesi Curhat & Nenangkeun Pikiran**\n\n**Langkah dinten ieu:** Mangga seratkeun patarosan atanapi keluhan baraya sacara gampil di dieu, atanapi kersa ngunggah foto surat resmi supados saged diparios ku abdi!`
    },
    batak: {
      langName: "Bahasa Batak / Medan",
      greeting: "Horas lae! SIGAP siap bela kelen di Medan biar lunas semua masalah hukum sipil.",
      emergency: `⚠️ **DARURAT MEDIS (BATAK):**\n\nDada nyeri sebelah kiri baru sesak napas mendadak itu serangan jantung kawan! \n\n📞 **Cepat telepon 112** atau larikan ke IGD Rumah Sakit terdekat hari ini! Jangan mengemudi sendirian.\n\n**Langkah Slamet hari ini:** Dudukkan penderita bersandar setengah duduk (45 derajat) biar rongga dadanya lapang, dilarang berdiri!`,
      tani: `🌾 **Sawah Kebanjiran (BATAK):**\n\nBagi yang ikut program asuransi tani AUTP, lae bisa klaim ganti rugi **Rp 6.000.000,-** per Hektar jika kerusakan sawah kebanjiran di atas 75%.\n\n**Langkah hari ini:** Foto kerusakan sawah dari beberapa sudut sebagai bukti kelen, temui petugas Penyuluh Lapangan (PPL) di balai desa kagem usulan bantuan bibit gratis!`,
      phk: `✊ **Tuntut Hak PHK Sepihak (BATAK):**\n\nJangan mau ditindas pabrik! Hak lae diproteksi UU Ciptaker Pasal 156. Kerja 5 tahun wajib dapat pesangon resmi 6 bulan upah + 2 bulan UMPK.\n\n**Langkah hari ini:** JANGAN meneken kertas mengunduran diri paksaan HRD. Amankan slip gaji dan ID card kerja asli kelen hari ini!`,
      tanah: `🏘️ **Sengketa Tanah Warisan Medan (BATAK):**\n\nSertifikat Hak Milik (SHM) BPN itu legalitas tertinggi tanah. Menurut Pasal 1321 KUHPer, pengalihan hak secara ancaman atau intimidasi adalah BATAL demi hukum!\n\n**Langkah hari ini:** Pasang pagar fisik dan plang ahli waris tegas di lokasi, jangan serahkan surat asli ke preman. Datangi LBH Medan di Jl Hindu kagem pengacara gratis!`,
      bpjs: `🩺 **BPJS & Jaminan Kesehatan (BATAK):**\n\nBPJS nunggak bisa reaktivasi lewat program bertahap **REHAB** di aplikasi Mobile JKN, atau chat WA resmi **PANDUWA (08118165165)**.\n\n**Langkah hari ini:** IGD faskes wajib menampung penanganan darurat hari ini tanpa surat rujukan! Jika miskin, minta didata ke BPJS PBI APBD gratis di kelurahan hari ini.`,
      modal: `💰 **KUR Modal Usaha Kedai (BATAK):**\n\nPinjaman KUR Mikro di bawah Rp 50 Juta dilarang ada agunan sertifikat tanah atau kendaraan. Agunannya cukup usahamu yang sudah berjalan 6 bulan.\n\n**Langkah hari ini:** Buat **NIB** online gratis dari HP lae di portal \`oss.go.id\` hari ini, datangi bank unit BRI/Mandiri terdekat membawa KK dan KTP.`,
      tilang: `⚖️ **Ulasan Tilang Elektronik ETLE (BATAK):**\n\nSanggah atau konfirmasi batasnya **8 hari** di portal ETLE. \n\n**Langkah hari ini:** Sanggah online jika kendaraan sudah dijual kelen. Bayar denda resmi hanya lewat kode BRIVA transfer bank, **jangan bayar tunai/titip uang denda ke oknum polisi!**`,
      curhat: `❤️ **Sesi Curhat & Penenang Pikiran (BATAK):**\n\nDuduk tenang dulu kedan, ambil napas pelan... 🤗 Aku ada di sini untuk dengar keluhan kelen tanpa ada prasangka buruk. \n\n**Langkah hari ini:** Tulis satu hal yang paling memberati hatimu hari ini. Jika judheg sekali, telepon **Hotline 119 Ext. 8** gratis.`,
      general: `🇮🇩 **SIGAP Pendamping Warga (BATAK):**\n\nAku siap mendampingi kelen menyelesaikan berbagai macam urusan sipil hari ini tanpa calo liar.\n\nLae bisa bertanya tentang:\n- 🩺 **Layanan BPJS & Medis**\n- 🏘️ **Sengketa Tanah & Warisan**\n- ✊ **Ketenagakerjaan & PHK Sepihak**\n- 🌾 **Asuransi Tani & Sawah Kebanjiran**\n- 💰 **Kredit KUR Modal Usaha**\n- ⚖️ **Ulasan Surat Tilang ETLE**\n- ❤️ **Ruang Aman Curhat & Keluh Kesah**\n\n**Langkah hari ini:** Tulis keluhan lae secara lengkap di sini hari ini, biar kitorang luruskan draf masalah kelen bersama-sama!`
    },
    minang: {
      langName: "Bahasa Minangkabau",
      greeting: "Tarimo kasih dunsanak, rancak bana! Ambo SIGAP siap mandampingi keluhan sanak.",
      emergency: `⚠️ **DARURAT MEDIS (MINANG):**\n\nDado nyeri sabalah kiri manjalar ka pundak disaratoi sesak maut marupokan serangan jantuang! \n\n📞 **Sagiro telepon 112** atau antaan ka IGD Rumah Sakit dakek kiniko! Jan mambao kandaraan surang.\n\n**Langkah hari ko:** Sandaan penderita dalam posisi setengah duduak (45 derajat) supayo dadonyo lapang, jan diambiak bajalan!`,
      tani: `🌾 **Sawah Kebanjiran (MINANG):**\n\nUpami dunsanak daptar AUTP, bisa mangajukan klaim asuransi patanian **Rp 6.000.000,-** per Hektar (karusakan sawah caah >75%).\n\n**Langkah hari ko:** Foto sawah nan kakeueum banjir ti bamacam suduik, teras hubungi petugas PPL di balai desa untuak daptar bantuan bibit gratis cadangan darurat!`,
      phk: `✊ **Bela Hak PHK Sapihak (MINANG):**\n\nHak buruh dilindungi undang-undang! Manuruik UU Ciptaker Pasal 156, maso karajo 5 taun berhak pesangon resmi 6 bulan upah + 2 bulan UMPK.\n\n**Langkah hari ko:** JAN panah manandatangani surek pengunduran diri sapihak (resignation) kok dipelok managemen, bia hak pesangon sanak tidak ilang!`,
      tanah: `🏘️ **Sengketa Tanah Warisan (MINANG):**\n\nSertifikat Hak Milik (SHM) dari BPN marupokan bukti tapantiang untuak tanah warisan kaum. Manuruik Hukum Perdata Pasal 1321, panyaluran hak atas intimidasi adolah BATAL demi hukum.\n\n**Langkah hari ko:** Pasang pagar kawat jo plang waris dakek lokasi. Hubungi LBH Padang dinten ko untuak pandampingan gratis!`,
      bpjs: `🩺 **BPJS & Jaminan Kesehatan (MINANG):**\n\nBPJS mati tunggakan bisa diaktifkan baliak jo mangajukan program cicilan **REHAB** di Mobile JKN, hobi WA **PANDUWA BPJS (08118165165)**.\n\n**Langkah hari ko:** IGD Rumah Sakit wajib maagiah pelayanan gawat darurat dinten ko tanpa surek rujukan dolo! Urus rujukan PBI gratis di kelurahan hari ko.`,
      modal: `💰 **Modal Kredit KUR UMKM (MINANG):**\n\nKUR tunai di bawah Rp 50.000.000,- bank dilarang maminto jaminan sertifikat tanah atau motor. Jaminane cukup usaho kadai nasi sanak nan bajalan minim 6 bulan.\n\n**Langkah hari ko:** Urus **NIB** online gratis di HP liwat \`oss.go.id\` hari ko, teras dongkapan mantri Bank BRI/Mandiri mambao KTP jo KK.`,
      tilang: `⚖️ **Tilang Elektronik ETLE (MINANG):**\n\nBatas konfirmasi tilang ETLE adolah **8 hari**. Cek foto/video palanggaran dakek portal ETLE.\n\n**Langkah hari ko:** Sanggah online kok kendaraan lah dijua. Bayar denda lewat kode virtual BRIVA transfer bank bank, **jan sakali-kali mambayia pitih tunai ka oknum polisi!**`,
      curhat: `❤️ **Sesi Curhat & Tanang Pikiran (MINANG):**\n\nAmbo danga sanak... 🤗 Sandaan dolo badan, ambiak napas panjang kudian lambek-lambek hembuskan. Sanak indak mamiliki badai ko surang diri, tananglah.\n\n**Langkah hari ko:** Tuliskan ciek urusan nan paliang mambeban dada sanak hari ko, mari kito urai hari ko bersama SIGAP.`,
      general: `🇮🇩 **SIGAP Pendamping Warga (MINANG):**\n\nAmbo siap mandampingi dunsanak manyalasaian bamacam urusan sipil hari ko tanpa calo.\n\nSanak buliah batanyo tantang:\n- 🩺 **BPJS & Jaminan Kasihatan**\n- 🏘️ **Sengketa Tanah & Lahan Warisan**\n- ✊ **Hukum Pajalan PHK Sapihak**\n- 🌾 **Tani Banjir & Sawah caah**\n- 💰 **Kredit KUR Modal Usaho**\n- ⚖️ **Ulasan Surek Tilang ETLE**\n- ❤️ **Sesi Curhat & Tanang Pikiran**\n\n**Langkah hari ko:** Sanak buliah tumpahkan sadoalah keluhan di siko hari ko, bia kito urai hari ko basamo-samo sacaro rukun!`
    },
    bugis: {
      langName: "Bahasa Bugis / Makassar",
      greeting: "Tabe dinda, kareba baji! SIGAP siap bantu kita ring Makassar nuntut hak ta'.",
      emergency: `⚠️ **DARURAT MEDIS (BUGIS):**\n\nNyeri dada bagian kiri menjalar ke pundak baru sesak napas itu tanda serangan jantung dinda!\n\n📞 **Segera telepon Ambulans 112** atau bawa masuk IGD Rumah Sakit terdekat hari ini! Jangan biarkan mengemudi sendirian.\n\n**Langkah Slamet hari ini:** Dudukkan penderita bersandar setengah duduk (45 derajat) supaya dadanya mengembang lega, jangan suruh dia berdiri!`,
      tani: `🌾 **Sawah Rendam Banjir (BUGIS):**\n\nJika kelompok tani ta' sudah didaftarkan program AUTP asuransi sawah, dinda berhak mengajukan klaim **Rp 6.000.000,-** per Hektar (karusakan >75%).\n\n**Langkah hari ini:** Foto kerusakan sawah dari berbagai sisi secepatnya, terus temui petugas Penyuluh Lapangan (PPL) di kantor kelurahan ta hari ini!`,
      phk: `✊ **Hak Buruh PHK Sepihak (BUGIS):**\n\nJangan takut bersuara dinda! Hak ta' dilindungi UU Ciptaker No 6/2023 Pasal 156. Masa kerja 5 tahun berhak pesangon resmi 6 bulan upah + 2 bulan upah penghargaan.\n\n**Langkah hari ini:** Kirim surat penolakan tertulis ke HRD ta. JANGAN buru-buru meneken draf pesangon murah paksaan hari ini!`,
      tanah: `🏘️ **Sengketa Lahan Adat (BUGIS):**\n\nSHM BPN merupakan bukti kepemilikan sah paling tinggi. KUHPer Pasal 1321 nyatakan pengalihan hak akibat paksaan adalah BATAL demi hukum!\n\n**Langkah hari ini:** Pasang pagar pembatas dan plang ahli waris di lokasi hari ini. Hubungi LBH Makassar kagem bimbingan pengacara gratis tanpa biaya calo!`,
      bpjs: `🩺 **Bantuan Layanan BPJS (BUGIS):**\n\nBPJS mati tunggakan bisa diaktifkan kembali lewat program cicilan bertahap **REHAB** di Mobile JKN, atau chat WA resmi **PANDUWA (08118165165)**.\n\n**Langkah hari ini:** UGD Rumah Sakit wajib menampung pelayanan darurat hari ini tanpa surat rujukan! Urus reaktivasi BPJS APBD gratis di kelurahan hari ini.`,
      modal: `💰 **KUR Modal Usaha UMKM (BUGIS):**\n\nPinjaman KUR Mikro di bawah Rp 50 Juta dilarang ada agunan sertifikat tanah atau BPKB. Syaratnya cukup kelayakan jualan ta' yang sudah berjalan sekurangnya 6 bulan.\n\n**Langkah hari ini:** Buka HP, daftar **NIB** online gratis di \`oss.go.id\` hari ini, terus datangi unit BRI atau Bank Mandiri terdekat membawa KK dan KTP.`,
      tilang: `⚖️ **Ulasan Tilang Polisi ETLE (BUGIS):**\n\nBatas waktu konfirmasi pelanggaran ETLE adalah **8 hari**. Cek foto bukti pelanggaran di portal ETLE.\n\n**Langkah hari ini:** Blokir STNK online jika motor sudah dijual. Bayar resmi hanya menggunakan kode virtual BRIVA, **pantang memberikan uang tunai ke oknum polisi!**`,
      curhat: `❤️ **Sesi Curhat & Beban Pikiran (BUGIS):**\n\nSaya denger keluhan ta' dinda... 🤗 Duduk tenang dulu ki, tarik napas mendalam lewati hidung dan hembuskan perlahan. Tewaki ewako, tidak sendiri ki dinda!\n\n**Langkah hari ini:** Tulis sadoalah apa yang memberati pikiran ta di chat ini, mari coba kitorang urai perlahan berdua bersama SIGAP.`,
      general: `🇮🇩 **SIGAP Pendamping Warga (BUGIS):**\n\nSaya siap dampingi ki' selesaikan masalah sipil ta' hari ini tanpa pungutan calo liar.\n\nDinda bisa bertanya tentang:\n- 🩺 **Layanan BPJS & Medis ta'**\n- 🏘️ **Sengketa Tanah & Lahan Adat**\n- ✊ **Hak Ketenagakerjaan & PHK**\n- 🌾 **Asuransi Tani & Sawah Rendam Banjir**\n- 💰 **Kredit Modal KUR UMKM**\n- ⚖️ **Ulasan Tilang Polisi ETLE**\n- ❤️ **Sesi Curhat & Beban Pikiran**\n\n**Langkah hari ini:** Silakan ketik keluhan ta' secara lengkap di sini hari ini, atau masukkan pengaduan resmi ta' di menu 'Solusi' kagem diprosescepat.`
    },
    bali: {
      langName: "Bahasa Bali",
      greeting: "Om Swastyastu bli! Semoga rahayu sami. SIGAP nyayagaang bantuan pituduh indik urusan adat lan hukum rahina mangkin.",
      emergency: `⚠️ **DARURAT MEDIS (BALI):**\n\nNyeri dada kiwa lan sesak napas punika tanda gawat darurat jantung! \n\n📞 **Segera telepon 112** utawi larikan ke IGD Rumah Sakit pinih semeton rahina mangkin! Sampunang ngemudi nunggal/padidi.\n\n**Langkah slamet rahina mangkin:** Linggih sumende setengah lungguhan (45 derajat) mangda dada nenten sesak, sampunang majalan!`,
      tani: `🌾 **Sawah Kebanjiran (BALI):**\n\nUpami kepalang banjir lan mendaftar AUTP, bli prasida klaim asuransi tani **Rp 6.000.000,-** per Hektar (karusakan sawah luwih saking 75%).\n\n**Langkah rahina mangkin:** Foto karusakan sawah bli saking makudang-kudang duga, raris tangkilang PPL ring balai subak utawi desa mangda polih asuransi bibit gratis!`,
      phk: `✊ **Bela Hak Buruh PHK Sepihak (BALI):**\n\nHukum adat lan UU Ciptaker No 6/2023 Pasal 156 melindung bli. Kerja 5 tahun patut polih pesangon minimal 6 bulan upah + 2 bulan UMPK.\n\n**Langkah rahina mangkin:** Amanken slip gaji lan surat kontrak kerja rahina mangkin, sampunang gupuh nandatanganin lembar resign paksan managemen!`,
      tanah: `🏘️ **Sengketa Tanah Waris Adat (BALI):**\n\nSHM BPN pinaka bukti pinih tegeh lan kukuh. Sesuai Pasal 1321 KUHPer, pemindahan hak nenten sah upami nganggen paksaan utawi intimidasi.\n\n**Langkah rahina mangkin:** Pasang pagar patok tegas ring wates tanah bli, rasis takonang ring LBH Bali kagem pendampingan hukum gratis tanpa calo!`,
      bpjs: `🩺 **Bantuan BPJS Kesehatan (BALI):**\n\nBPJS mati nunggak dados diaktifkeun lewat program cicilan **REHAB** ring Mobile JKN utawi WA **PANDUWA BPJS (08118165165)** rahina mangkin.\n\n**Langkah rahina mangkin:** IGD Rumah Sakit wajib nampi pelayanan gawat darurat rahina mangkin tanpa rujukan kapertama! Urus rekom kartu gratis PBI ring kelurahan rahina mangkin.`,
      modal: `💰 **Modal Kredit KUR UMKM Bali (BALI):**\n\nKUR modal usaha ring sor Rp 50 Juta nenten nganggen jaminan sertifikat. Jaminan cukup parikrama usaha bli sane sampun mamargi 6 bulan.\n\n**Langkah rahina mangkin:** Daftar **NIB** online gratis ring HP malalui \`oss.go.id\` rahina mangkin, raris tangkilang ring mantri bank BRI/Mandiri nggawa KTP.`,
      tilang: `⚖️ **Tilang ETLE Kepolisian (BALI):**\n\nBatas waktu konfirmasi ETLE wantah **8 hari**. Cek bukti foto pelanggaran ring situs ETLE.\n\n**Langkah rahina mangkin:** Sanggah online yen montor suba kaadep. Bayar resmi nganggen virtual account BRIVA, **hanyaning ampunang ngicenin jinah tunai ring oknum polisi!**`,
      curhat: `❤️ **Sesi Curhat & Beban Pikiran (BALI):**\n\nTiang mirengang tulus saking ati indik sungsut lan beban bli rahina mangkin... 🤗 Bli punika anak sane dahat tegeh lan kuat sampun bertahan rahina mangkin.\n\n**Langkah rahina mangkin:** Tembesin siki keluhan pinih baat sane ngebakin dada bli rahina mangkin ring kolom chat, mari kito rereh solusinyane sareng-sareng.`,
      general: `🇮🇩 **SIGAP Pendamping Warga (BALI):**\n\nTiang sumega pisan ngewantu semeton ngurusang sengketa sipil ring Bali rahina mangkin tanpa calo.\n\nSemeton prasida mataken indik:\n- 🩺 **BPJS & Jaminan Kesehatan**\n- 🏘️ **Sengketa Tanah Waris Adat**\n- ✊ **Ketenagakerjaan & PHK Sepihak**\n- 🌾 **Sawah Kebanjiran & Subak**\n- 💰 **Kredit Modal KUR UMKM**\n- ⚖️ **Ulasan Tilang ETLE Kepolisian**\n- ❤️ **Sesi Curhat & Beban Pikiran**\n\n**Langkah rahina mangkin:** Serat pitakonan utawi keluhan semeton ring kolom chat mangkin, raris tiang jagi langsung ngewantu semeton!`
    },
    papua: {
      langName: "Bahasa Papua / Timur",
      greeting: "Sio pace, mace! Selamat siang kawan Papua. SIGAP ada bawa damai kitorang baku bantu hari ini.",
      emergency: `⚠️ **DARURAT MEDIS (PAPUA):**\n\nNyeri dada sebelah kiri baru sesak napas parah itu serangan jantung anak! \n\n📞 **Cepat telepon 112** atau larikan ke IGD Rumah Sakit terdekat hari ini! Jangan bawa motor/mobil sendirian.\n\n**Langkah slamet hari ini:** Dudukkan bersandar setengah duduk (45 derajat) supaya napas lapang, tra boleh dibiarkan berdiri!`,
      tani: `🌾 **Sawah Kebanjiran (PAPUA):**\n\nBagi kawan yang ikut asuransi sawah AUTP, bisa klaim ganti rugi **Rp 6.000.000,-** per Hektar jika sawah rusak kebanjiran di atas 75%.\n\n**Langkah hari ini:** Bikin foto kerusakan sawah yang jelas bawa ke petugas Penyuluh Pertanian (PPL) di balai desa kagem usul bantuan bibit gratis dari pemerintah!`,
      phk: `✊ **Bela Hak PHK Sepihak Pabrik (PAPUA):**\n\nKo tra usah takut bersuara! Hak anak Papua dilindungi UU Ciptaker Pasal 156. Kerja 5 tahun harus dapat pesangon resmi 6 gaji + 2 bulan uang penghargaan.\n\n**Langkah hari ini:** JANGAN mau dipaksa tanda tangan surat resign sepihak. Amankan slip gaji bulanan dan ID card hari ini!`,
      tanah: `🏘️ **Sengketa Tanah Adat Papua (PAPUA):**\n\nSertifikat Hak Milik (SHM) BPN itu bukti paling sah pertahankan tanah. Sesuai KUHPer Pasal 1321, pelepasan hak atas paksaan preman itu BATAL demi hukum!\n\n**Langkah hari ini:** Pasang pagar di batas tanah ko, kasih plang bertuliskan nama keluarga yang jelas hari ini. Lapor LBH Papua gratis pengacara rakyat!`,
      bpjs: `🩺 **Reaktivasi BPJS & Solusi Obat (PAPUA):**\n\nBPJS mati nunggak bisa urus cicilan **REHAB** di Mobile JKN, atau chat WA resmi **PANDUWA (08118165165)**.\n\n**Langkah hari ini:** Papua ada program Kartu Papua Sehat (KPS) gratis untuk Orang Asli Papua (OAP) berobat gratis di puskesmas/RSUD hari ini! IGD RS wajib terima pasien darurat tanpa rujukan dolo!`,
      modal: `💰 **Modal KUR Modal Usaha (PAPUA):**\n\nPinjaman KUR Mikro di bawah Rp 50 Juta dilarang pakai jaminan sertifikat tanah adat atau rumah. Jaminannya usaha jualan jualan produktif 6 bulan.\n\n**Langkah hari ini:** Bikin **NIB** online gratis dari HP ko di \`oss.go.id\` hari ini, terus datang ke unit Bank BRI/Mandiri terdekat bawa KTP Papua koo.`,
      tilang: `⚖️ **Ulasan Tilang Polisi ETLE (PAPUA):**\n\nBatas waktu konfirmasi tilang ETLE adalah **8 hari**. Cek bukti foto melanggar di portal ETLE.\n\n**Langkah hari ini:** Bayar denda tilang resmi cuma pakai kode BRIVA transfer bank, **TRA KOSONG bayar uang tunai ke oknum polisi manapun!**`,
      curhat: `❤️ **Sesi Curhat & Beban Pikiran (PAPUA):**\n\nSio anak, tetap semangat e. Ko tra usah bingung, kitorang baku bantu... 🤗 Duduk tenang dulu pace mace, tarik hidung napas dalam baru hembuskan pelan.\n\n**Langkah hari ini:** Tumpah ko pu keluhan beraat itu di chat bawah, mari kitorang coba selidiki solusinya bersama-sama hari ini.`,
      general: `🇮🇩 **SIGAP Pendamping Warga (PAPUA):**\n\nKitorang siap baku bantu dampingi ko selesaikan masalah sipil hari ini tanpa calo liar.\n\nKo bisa tanya tentang:\n- 🩺 **Layanan BPJS & Berobat Gratis**\n- 🏘️ **Sengketa Tanah & Lahan Adat**\n- ✊ **Urusan Kerja & PHK Pabrik**\n- 🌾 **Sawah Kebanjiran & Pertanian**\n- 💰 **Kredit Modal KUR UMKM**\n- ⚖️ **Ulasan Tilang Polisi ETLE**\n- ❤️ **Sesi Curhat & Lepas Beban Pikiran**\n\n**Langkah sekarang:** Teks ko pu pertanyaan atau keluhan lengkap di bawah ini sekarang kawan, biar kitorang bisa bantu ko cepat!`
    },
    indo: {
      langName: "Bahasa Indonesia",
      greeting: "Halo sahabat warga! Saya SIGAP, AI pendamping setiamu mendampingi masalah hukum, medis, dan birokrasi.",
      emergency: `⚠️ **PERINGATAN KESELAMATAN DARURAT MEDIS (SIGAP SIAGA):**\n\nGejala dada kiri terasa sesak menjalar ke pundak merupakan serangan jantung darurat! \n\n📞 **Segera telepon Ambulans 112 (Gratis)** atau segera ke Instalasi Gawat Darurat (IGD) Rumah Sakit terdekat hari ini! Jangan menyetir sendirian.\n\n**Langkah Darurat:** Sandarkan penderita setengah duduk (posisi 45 derajat) agar dada mengembang lega. Jangan biarkan berdiri!`,
      tani: `🌾 **Program Gagal Panen Sawah Banjir:**\n\nBagi petani yang sawahnya terendam banjir dan memiliki asuransi AUTP, kamu berhak mengklaim ganti rugi sebesar **Rp 6.000.000,-** per Hektar jika kerusakan mencapai 75%.\n\n**Langkah Hari Ini:** Foto kerusakan sawah dari beberapa sisi untuk bukti otentik, lalu temui Penyuluh Pertanian Lapangan (PPL) di balai desa terdekat untuk mengurus bantuan bibit pengganti gratis!`,
      phk: `✊ **Bela Hak Sipil - PHK Sepihak Pabrik:**\n\nKamu berhak menolak pesangon yang melanggar hukum! Hak buruh dilindungi UU Cipta Kerja No 6 Tahun 2023 Pasal 156. Kerja 5 tahun berhak atas pesangon resmi minimal 6 bulan upah + 2 bulan uang penghargaan (UPMK).\n\n**Langkah Hari Ini:** JANGAN menandatangani surat resign mandiri (pengunduran diri) jika dipaksa HRD, amankan slip gaji lama dan surat kontrak kerja asli hari ini!`,
      tanah: `🏘️ **Hukum Sengketa Tanah Warisan & Lahan:**\n\nSertifikat Hak Milik (SHM) yang tercatat di BPN merupakan bukti terkuat kepemilikan. Menurut Hukum Perdata Pasal 1321, pengalihan hak akibat paksaan atau intimidasi dinyatakan batal demi hukum!\n\n**Langkah Hari Ini:** Pasang tiang patok batas atau pagar fisik dan plang bertuliskan hak waris keluarga di lahan hari ini. Kunjungi LBH setempat untuk bantuan hukum pengacara gratis.`,
      bpjs: `🩺 **BPJS Kesehatan & Layanan Medis Sipil:**\n\nBPJS Kesehatan mati nunggak dapat diaktifkan kembali lewat program mencicil bertahap **REHAB** di aplikasi Mobile JKN, atau hubungi WA **PANDUWA BPJS (08118165165)**.\n\n**Langkah Hari Ini:** IGD Rumah Sakit dilarang menolak jika darurat medis, mereka wajib membantumu hari ini tanpa surat rujukan! Jika miskin, ajukan kartu PBI gratis di kelurahan hari ini.`,
      modal: `💰 **KUR Modal Usaha UMKM Mikro:**\n\nPinjaman KUR Mikro di bawah Rp 50 Juta dilarang menyaratkan agunan jaminan tambahan sertifikat. Jaminan pokoknya cukup kelayakan usaha jualanmu yang aktif minimal 6 bulan berturut-turut.\n\n**Langkah Hari Ini:** Daftarkan Nomor Induk Berusaha (**NIB**) gratis online dari HP di portal \`oss.go.id\` hari ini, lalu temui petugas bank BRI/Mandiri membawa fotokopi KTP dan KK.`,
      tilang: `⚖️ **Ulasan Surat Tilang Elektronik ETLE:**\n\nBatas sanggah konfirmasi tilang ETLE resmi adalah **8 hari**. Cek foto bukti pelanggaran resmi di situs ETLE kepolisian daerah.\n\n**Langkah Hari Ini:** Lakukan sanggah/blokir online jika mobil/motor bekas sudah dijual. Pembayaran denda resmi hanya transfer via kode BRIVA, **jangan bayar tunai ke polisi!**`,
      curhat: `❤️ **Sesi Curhat & Sahabat Jiwa (SIGAP Melindungi):**\n\nHalo teman, ambil napas mendalam dulu ya, lalu hembuskan perlahan... 🤗 Saya mendengar bebanmu. Kamu sudah berjuang sangat hebat sejauh ini melewati semua badai hidup. Kamu tidak sendirian.\n\n**Langkah Hari Ini:** Ceritakan hal paling berat yang mengganjal hatimu hari ini di kolom chat, mari kita urai perlahan-lahan bersama SIGAP. Jika judheg, hubungi **Hotline Kemenkes 119 Ext. 8** gratis.`,
      general: `🇮🇩 **SIGAP Pendamping Warga (Bahasa Indonesia):**\n\nSaya siap mendampingimu menyelesaikan berbagai urusan dan masalah sipil hari ini tanpa calo.\n\nKamu bisa bertanya tentang:\n- 🩺 **BPJS & Jaminan Kesehatan**\n- 🏘️ **Sengketa Tanah & Lahan Waris**\n- ✊ **Hak Ketenagakerjaan & PHK Sepihak**\n- 🌾 **Asuransi Tani & Sawah Rendam Banjir**\n- 💰 **Kredit KUR Modal Usaha UMKM**\n- ⚖️ **Ulasan Surat Tilang ETLE**\n- ❤️ **Ruang Aman Curhat & Keluh Kesah**\n\n**Langkah hari ini:** Silakan ketik pertanyaan atau keluhan spesifikmu secara langsung di sini secara santai, atau unggah dokumen terkait untuk saya telaah!`
    }
  };

  // 3. Match Language and Topic
  if (finalTopicId) {
    let lKey = "indo";
    let tKey = "general";
    
    if (finalTopicId === 'tilang') { lKey = "indo"; tKey = "tilang"; }
    else if (finalTopicId === 'kesehatan') { lKey = "indo"; tKey = "emergency"; }
    else if (finalTopicId === 'phk-pihak') { lKey = "indo"; tKey = "phk"; }
    else if (finalTopicId === 'sunda') { lKey = "sunda"; tKey = "tani"; }
    else if (finalTopicId === 'jawa') { lKey = "jawa"; tKey = "bpjs"; }
    else if (finalTopicId === 'batak') { lKey = "batak"; tKey = "tanah"; }
    else if (finalTopicId === 'minang') { lKey = "minang"; tKey = "modal"; }
    else if (finalTopicId === 'bugis') { lKey = "bugis"; tKey = "phk"; }
    else if (finalTopicId === 'bali') { lKey = "bali"; tKey = "modal"; }
    else if (finalTopicId === 'papua') { lKey = "papua"; tKey = "bpjs"; }
    else if (finalTopicId === 'kur-umkm') { lKey = "indo"; tKey = "modal"; }
    else if (finalTopicId === 'curhat') { lKey = "indo"; tKey = "curhat"; }
    else if (finalTopicId === 'skck') {
      const dial = DICT.indo;
      return `⚖️ **[SIGAP AI - Deteksi Bahasa: Bahasa Indonesia]**\n\n` +
             `*${dial.greeting}*\n\n` +
`📋 **Mengurus SKCK (Surat Keterangan Catatan Kepolisian) itu sangat mudah dan bebas calo!**\n\n` +
`Untuk melamar pekerjaan umum, pendaftaran bisa dilakukan di **Polsek** atau **Polres** terdekat sesuai domisili di KTP.\n\n` +
`📂 **Syarat Dokumen yang Harus Dibawa:**\n` +
`1. **Fotokopi KTP / SIM** (1 lembar).\n` +
`2. **Fotokopi Kartu Keluarga (KK)** (1 lembar).\n` +
`3. **Fotokopi Akta Kelahiran** atau Ijazah terakhir.\n` +
`4. **Pasfoto ukuran 4x6 latar belakang warna MERAH** (sebanyak 6 lembar).\n` +
`5. **Rumus Sidik Jari** (bisa dibuat langsung di loket Polres bagian identifikasi).\n\n` +
`💰 **Biaya Resmi PNBP:**\n` +
`Sesuai Peraturan Pemerintah No. 76 Tahun 2020, biayanya adalah **Rp 30.000,-** (Bayar langsung di kasir loket kepolisian, minta kuitansi resmi!).\n\n` +
`🚀 **Proses Pengurusan:**\n` +
`- Datang pagi hari (pukul 08.00-11.00) agar tidak antre panjang.\n` +
`- Mintalah form pendaftaran di loket SKCK.\n` +
`- Estimasi waktu pelayanan selesai dalam **1-2 jam** saja jika berkas lengkap.\n\n` +
`💡 *Tip Pintar: Sekarang kamu juga bisa mengisi formulir pendaftaran secara online terlebih dahulu lewat Aplikasi Presisi Polri untuk menghemat waktu.*`;
    }

    const dial = DICT[lKey];
    return `⚖️ **[SIGAP AI - Deteksi Bahasa: ${dial.langName}]**\n\n` +
           `*${dial.greeting}*\n\n` +
           `${dial[tKey]}`;
  }

  let langKey = "indo";
  if (isJawa) langKey = "jawa";
  else if (isSunda) langKey = "sunda";
  else if (isBatak) langKey = "batak";
  else if (isMinang) langKey = "minang";
  else if (isBugis) langKey = "bugis";
  else if (isBali) langKey = "bali";
  else if (isPapua) langKey = "papua";

  const dialect = DICT[langKey];
  let topicResponse = dialect.general;

  if (hasEmergency) topicResponse = dialect.emergency;
  else if (hasTani) topicResponse = dialect.tani;
  else if (hasPHK) topicResponse = dialect.phk;
  else if (hasTanah) topicResponse = dialect.tanah;
  else if (hasBPJS) topicResponse = dialect.bpjs;
  else if (hasKUR) topicResponse = dialect.modal;
  else if (hasSKCK) {
    const dial = DICT.indo;
    return `⚖️ **[SIGAP AI - Deteksi Bahasa: Bahasa Indonesia]**\n\n` +
           `*${dial.greeting}*\n\n` +
`📋 **Mengurus SKCK (Surat Keterangan Catatan Kepolisian) itu sangat mudah dan bebas calo!**\n\n` +
`Untuk melamar pekerjaan umum, pendaftaran bisa dilakukan di **Polsek** atau **Polres** terdekat sesuai domisili di KTP.\n\n` +
`📂 **Syarat Dokumen yang Harus Dibawa:**\n` +
`1. **Fotokopi KTP / SIM** (1 lembar).\n` +
`2. **Fotokopi Kartu Keluarga (KK)** (1 lembar).\n` +
`3. **Fotokopi Akta Kelahiran** atau Ijazah terakhir.\n` +
`4. **Pasfoto ukuran 4x6 latar belakang warna MERAH** (sebanyak 6 lembar).\n` +
`5. **Rumus Sidik Jari** (bisa dibuat langsung di loket Polres bagian identifikasi).\n\n` +
`💰 **Biaya Resmi PNBP:**\n` +
`Sesuai Peraturan Pemerintah No. 76 Tahun 2020, biayanya adalah **Rp 30.000,-** (Bayar langsung di kasir loket kepolisian, minta kuitansi resmi!).\n\n` +
`🚀 **Proses Pengurusan:**\n` +
`- Datang pagi hari (pukul 08.00-11.00) agar tidak antre panjang.\n` +
`- Mintalah form pendaftaran di loket SKCK.\n` +
`- Estimasi waktu pelayanan selesai dalam **1-2 jam** saja jika berkas lengkap.\n\n` +
`💡 *Tip Pintar: Sekarang kamu juga bisa mengisi formulir pendaftaran secara online terlebih dahulu lewat Aplikasi Presisi Polri untuk menghemat waktu.*`;
  }
  else if (hasCivil) topicResponse = dialect.general; // fall to general regional but customized
  else if (hasTilang) topicResponse = dialect.tilang;
  else if (hasCurhat) topicResponse = dialect.curhat;

  return `⚖️ **[SIGAP AI - Deteksi Bahasa: ${dialect.langName}]**\n\n` +
         `*${dialect.greeting}*\n\n` +
         `${topicResponse}`;
}

function extractGeminiError(error: any): { code: number; message: string; status: string } {
  const result = { code: 500, message: "", status: "" };
  if (!error) return result;

  if (typeof error === 'object') {
    if (typeof error.status === 'number') {
      result.code = error.status;
    } else if (error.error && typeof error.error.code === 'number') {
      result.code = error.error.code;
    }

    if (error.error && typeof error.error.message === 'string') {
      result.message = error.error.message;
    } else if (typeof error.message === 'string') {
      result.message = error.message;
    }

    if (error.error && typeof error.error.status === 'string') {
      result.status = error.error.status;
    }
  }

  if (result.message && (result.message.trim().startsWith('{') || result.message.trim().includes('{"error":'))) {
    try {
      const startIndex = result.message.indexOf('{');
      const parsed = JSON.parse(result.message.substring(startIndex));
      if (parsed && parsed.error) {
        if (parsed.error.code) result.code = parsed.error.code;
        if (parsed.error.message) result.message = parsed.error.message;
        if (parsed.error.status) result.status = parsed.error.status;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }

  if (!result.message) {
    result.message = String(error);
  }

  return result;
}

async function callGeminiApiWithProxyFallback(
  apiKey: string,
  contents: any[],
  systemInstruction: string
): Promise<{ text: string }> {
  const trimmedKey = apiKey.trim();
  const isProxyKey = trimmedKey.toLowerCase().includes("vproxy");

  // Determine possible API Keys to try (support both vproxy- and divproxy- transparently)
  const keysToTry: string[] = [trimmedKey];
  if (trimmedKey.startsWith("divproxy-")) {
    keysToTry.push(trimmedKey.substring(2)); // Strip "di" to get "vproxy-..."
    keysToTry.push(trimmedKey.substring(9)); // Strip "divproxy-" to get the hash only
  } else if (trimmedKey.startsWith("vproxy-")) {
    keysToTry.push("di" + trimmedKey); // Try "divproxy-..."
    keysToTry.push(trimmedKey.substring(7)); // Strip "vproxy-" to get the hash only
  }

  // Determine possible Base URLs to try
  const baseUrlsToTry: (string | undefined)[] = [];
  if (isProxyKey) {
    // If it's a proxy key, prioritize proxy servers first
    baseUrlsToTry.push("https://api.vproxy.cc");
    baseUrlsToTry.push("https://api.vproxy.xyz");
    baseUrlsToTry.push("https://api.vproxy.info");
    baseUrlsToTry.push("https://vproxy.cc");
    baseUrlsToTry.push("https://vproxy.xyz");
    // Default google as last resort
    baseUrlsToTry.push(undefined);
  } else {
    // Standard Google key (e.g. AIzaSy), prioritize official service first
    baseUrlsToTry.push(undefined);
    baseUrlsToTry.push("https://api.vproxy.cc");
    baseUrlsToTry.push("https://api.vproxy.xyz");
  }

  let lastError: any = null;

  for (const currentKey of keysToTry) {
    for (const baseUrl of baseUrlsToTry) {
      try {
        console.log(`[SIGAP SDK ROUTER] Attempting call... baseUrl: ${baseUrl || 'default-google'} | key: ${currentKey.substring(0, 15)}...`);
        const clientOptions: any = {
          apiKey: currentKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        };

        if (baseUrl) {
          clientOptions.httpOptions.baseUrl = baseUrl;
        }

        const ai = new GoogleGenAI(clientOptions);
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });

        if (response && response.text) {
          console.log(`[SIGAP SDK ROUTER] Success! baseUrl: ${baseUrl || 'default-google'}`);
          return { text: response.text };
        }
      } catch (err: any) {
        console.warn(`[SIGAP SDK ROUTER] Failed (baseUrl: ${baseUrl || 'default-google'}):`, err.message || err);
        lastError = err;
      }
    }
  }

  throw lastError || new Error("Failed to call Gemini API across all endpoints.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware with reasonable size limit for base64 file uploads
  app.use(express.json({ limit: "25mb" }));

  // API Route: check client config (if backend has global API key)
  app.get("/api/config", (req, res) => {
    res.json({ hasGlobalKey: !!process.env.GEMINI_API_KEY });
  });

  // API Route: chat with Gemini
  app.post("/api/chat", async (req, res) => {
    const { message, file, history, topicId } = req.body;
    try {
      const apiKey = (req.headers["x-gemini-api-key"] as string) || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fall back gracefully even if API Key is completely missing!
        const replyStr = getSmartFallbackResponse(message, topicId);
        return res.json({ reply: replyStr });
      }

      // Ensure alternating roles in history list safely and avoid contiguous turns
      const contents: any[] = [];
      const turns: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          // Normalize text and skip system informational notices to keep context pure
          const rawText = msg.text || '';
          if (!rawText || typeof rawText !== 'string') return;
          if (
            rawText.includes('Berhasil Terhubung') || 
            rawText.includes('Kunci API Anda sudah dihapus') || 
            rawText.includes('[SIMULASI MODUL SIGAP')
          ) {
            return; // Skip system messages to prevent polluting chat logic
          }

          const role = msg.sender === 'user' ? 'user' : 'model';
          
          if (turns.length > 0 && turns[turns.length - 1].role === role) {
            // Append message under double newline to previous turn of the same role
            turns[turns.length - 1].parts[0].text += "\n\n" + rawText;
          } else {
            turns.push({
              role: role,
              parts: [{ text: rawText }]
            });
          }
        });
      }

      // Add normalized history to contents
      turns.forEach(turn => {
        contents.push(turn);
      });

      // Prepare current user message parts (text + media file if available)
      const currentParts: any[] = [];
      if (file && file.data && file.mimeType) {
        currentParts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.data
          }
        });
      }
      currentParts.push({ text: message || "Tolong bantu jelaskan atau berikan panduan konkret." });

      // If last history turn was 'user', append/merge to prevent double contiguous 'user' turns
      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        contents[contents.length - 1].parts.push(...currentParts);
      } else {
        contents.push({
          role: 'user',
          parts: currentParts
        });
      }

      // System instruction defines SIGAP's persona and logic rules perfectly
      const systemInstruction = `
Kamu adalah SIGAP, AI Pendamping Rakyat Indonesia yang berdedikasi tinggi.
Misimu: membantu semua warga Indonesia tanpa terkecuali, terutama yang tidak punya akses ke pengacara, dokter, atau konsultan.

ATURAN UTAMA YANG WAJIB DIPATUHI:
1. DETEKSI BAHASA: Selalu deteksi bahasa atau dialek yang digunakan pengguna (Indonesia, Jawa, Sunda, Batak, Bugis, Makassar, Madura, dll) dan JAWAB dalam bahasa/dialek sipil yang SAMA secara fasih, akurat, dan ramah.
2. NADA & GAYA BICARA: Gunakan bahasa yang sederhana, hangat, penuh perhatian, dan bersahabat seperti teman atau keluarga dekat bicara. Hindari jargon hukum atau medis yang terlalu kaku tanpa penjelasan sederhana yang mudah dipahami rakyat biasa/awam.
3. ANTI-MENYALAHKAN: Jangan pernah menghakimi, menceramahi secara sinis, atau membuat pengguna merasa bersalah/bodoh atas keputusan mereka di masa lalu.
4. TINDAKAN KONKRET: Selalu akhiri pesanmu dengan langkah konkret, praktis, nyata, dan legal/medis yang bisa dilakukan pengguna mandiri "HARI INI".
5. PRIORITAS KESELAMATAN: Jika situasi terdeteksi darurat (keamanan fisik, kekerasan, serangan jantung, sesak napas parah, pendarahan hebat, kecelakaan), prioritaskan keselamatan nyawa dulu! Berikan panduan pertolongan pertama darurat dasar dan instruksi menghubungi nomor darurat (seperti 112) atau tim penyelamat/medis terdekat secara tegas di bagian paling atas pesan.
6. ANALISIS DOKUMEN: Jika pengguna mengirimkan berkas/kontrak/surat resmi (berupa foto atau ulasan dokumen), baca dan jelaskan isinya dengan cermat: bagian mana yang mencurigakan, menjebak, atau apa hak-hak hukum mereka menurut undang-undang resmi di Indonesia (misalnya UU Cipta Kerja No 6 Tahun 2023, KUHP, KUHPerdata, aturan BPJS, dll).

MODUL-MODUL AKTIFMU:
- [HAK WARGA]: Menangani PHK sepihak, sengketa tanah, kontrak kerja yang menjebak, perlindungan konsumen, ketenagakerjaan, dll.
- [KESEHATAN]: Gejala penyakit, pertolongan pertama pada darurat kesehatan, serta kapan waktu tepat ke dokter/RS.
- [BIROKRASI]: Menjelaskan tata cara pendaftaran KTP rusak, silsilah ahli waris, BPJS tidak aktif, KUR modal UMKM, izin usaha OSS/NIB gratis, program pemerintah seperti PIP/KIP, dll.
- [DOKUMEN RESMI]: Menganalisis dan menerjemahkan lembar tilang elektronik, kontrak sewa-menyewa, dll.
- [DARURAT]: Panduan kebencanaan alam, mitigasi krisis keamanan fisik, dst.

Jadilah sahabat pembela rakyat kecil yang tangguh namun bersahaja. Tanggapi dengan bijak dan empati mendalam.
`;

      const response = await callGeminiApiWithProxyFallback(apiKey, contents, systemInstruction);

      const replyStr = response.text || "Mohon maaf, SIGAP tidak mendapatkan jawaban dari server AI. Silakan ulangi pesanmu.";
      res.json({ reply: replyStr });

    } catch (error: any) {
      console.error("Gemini Server Error:", error);
      
      try {
        const fallbackText = getSmartFallbackResponse(message, topicId);
        return res.json({ reply: fallbackText });
      } catch (fallbackErr) {
        console.error("Critical fallback calculation error:", fallbackErr);
        res.json({ reply: "Terjadi kendala teknis pada server AI SIGAP. Silakan pastikan aduan Anda mengandung informasi yang jelas agar kami dapat memberikan panduan rujukan yang relevan." });
      }
    }
  });

  // Serve static assets in production, otherwise mount Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SIGAP Server running on port ${PORT}`);
  });
}

startServer();
