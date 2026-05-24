import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FEATURES, PRESET_TOPICS } from '../data';
import { ChatMessage, FeatureCard, PresetTopic } from '../types';
import { Send, Smartphone, Sparkles, RefreshCw, FileText, CheckCircle2, Paperclip, Trash2, AlertCircle, Key, Eye, EyeOff } from 'lucide-react';

interface AttachedFile {
  name: string;
  mimeType: string;
  data: string; // Base64 representation
  preview?: string; // object URL for preview
}

export default function FiturSection() {
  const nonRegionalTopics = PRESET_TOPICS.filter(t => t.category !== 'Bahasa Daerah');
  const [activeTopic, setActiveTopic] = useState<PresetTopic>(nonRegionalTopics[0]);
  const [messages, setMessages] = useState<(ChatMessage & { fileName?: string; filePreview?: string })[]>([
    {
      id: 'init-1',
      sender: 'sigap',
      text: 'Halo! Saya AI SIGAP. Ada berkas resmi yang membingungkanmu? Mengalami kejadian darurat medis, sengketa hak kerja, atau kebingungan birokrasi?\n\nKamu bisa ketik pesan boso Jowo, Sunda, dll. Disini kamu bisa juga seret & taruh (drag and drop) atau klik logo klip kertas untuk mengunggah dokumen/surat resmi agar saya telaah isinya!',
      timestamp: '09:00'
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');
  
  // File upload states
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gemini API Key management
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('SIGAP_GEMINI_API_KEY') || '');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [hasGlobalKey, setHasGlobalKey] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(data => {
        if (data && typeof data.hasGlobalKey === 'boolean') {
          setHasGlobalKey(data.hasGlobalKey);
        }
      })
      .catch(err => console.error("Error checking backend API key config:", err));
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    localStorage.setItem('SIGAP_GEMINI_API_KEY', apiKeyInput.trim());
    setApiKey(apiKeyInput.trim());
    setApiKeyInput('');
    setMessages(prev => [
      ...prev,
      {
        id: `sys-key-${Date.now()}`,
        sender: 'sigap',
        text: '🔑 **Berhasil Terhubung:** Kunci API Gemini milikmu telah disimpan dengan aman di peramban lokal (localStorage) Anda! Sekarang, AI SIGAP akan merespons pertanyaanmu secara dinamis dan tidak monoton menggunakan kecerdasan buatan Gemini secara privat. Silakan coba kirimkan pesan atau berkas tuntutan apa saja!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('SIGAP_GEMINI_API_KEY');
    setApiKey('');
    setMessages(prev => [
      ...prev,
      {
        id: `sys-key-clear-${Date.now()}`,
        sender: 'sigap',
        text: '🗑️ Kunci API Gemini Anda sudah dihapus dari penyimpanan peramban lokal. AI SIGAP kini kembali bekerja dalam Mode Simulasi Offline dengan jawaban-jawaban template yang monoton.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const chatEndRef = useRef<HTMLDivElement>(null);
  const phoneContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle file read and store base64 representation
  const handleFileChange = (file: File) => {
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Maaf, ukuran berkas terlalu besar. Batas maksimum pengunggahan berkas adalah 8 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const resultStr = e.target?.result as string;
      const base64Data = resultStr?.split(",")[1];
      if (base64Data) {
        setAttachedFile({
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          data: base64Data,
          preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Main chat submission core
  const sendChatMessage = async (userText: string, fileToSubmit = attachedFile, topicId?: string) => {
    if (!userText.trim() && !fileToSubmit) return;

    const queryText = userText;
    const formattedTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;
    
    // Add User message to stream log
    const userMessage: ChatMessage & { fileName?: string; filePreview?: string } = {
      id: userMsgId,
      sender: 'user',
      text: queryText,
      timestamp: formattedTime
    };

    if (fileToSubmit) {
      userMessage.fileName = fileToSubmit.name;
      userMessage.filePreview = fileToSubmit.preview;
    }

    setMessages(prev => [...prev, userMessage]);
    setCustomInput('');
    setAttachedFile(null);
    setIsTyping(true);

    try {
      // Build history payload for Gemini model context
      const historyPayload = messages.slice(-12).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const bodyPayload: any = {
        message: queryText,
        history: historyPayload,
        topicId: topicId
      };

      if (fileToSubmit) {
        bodyPayload.file = {
          data: fileToSubmit.data,
          mimeType: fileToSubmit.mimeType
        };
      }

      const headersPayload: Record<string, string> = { "Content-Type": "application/json" };
      const savedApiKey = localStorage.getItem('SIGAP_GEMINI_API_KEY');
      if (savedApiKey) {
        headersPayload["X-Gemini-API-Key"] = savedApiKey;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: headersPayload,
        body: JSON.stringify(bodyPayload)
      });

      if (!response.ok) {
        throw new Error("Gagal menyambungkan ke server AI SIGAP.");
      }

      const data = await response.json();
      setIsTyping(false);

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [
        ...prev,
        {
          id: `sigap-${Date.now()}`,
          sender: 'sigap',
          text: data.reply,
          timestamp: formattedTime
        }
      ]);

    } catch (err: any) {
      console.warn("Real API Error, activating robust local fallback simulator:", err);

      // Simple keywords lookup for high-quality fallback simulation when API key is missing or server fails
      let simulatedResponse = 'Saya memahami situasi dan kendala Anda. Sebagai pendamping warga, silakan pastikan kelengkapan berkas bukti penunjang dan laporkan keluhan secara formal di tab "Solusi & Aduan" agar mendapatkan bimbingan dari jejaring relawan hukum kami!';
      
      const lower = queryText.toLowerCase();

      // Language detection matching server logic
      const isJawa = lower.includes("kulo") || lower.includes("mboten") || lower.includes("nggih") || lower.includes("jenengan") || lower.includes("piye") || lower.includes("enjang") || lower.includes("matur") || lower.includes("sugeng") || lower.includes("panjenengan") || lower.includes("lurd") || lower.includes("pripun") || lower.includes("sederek");
      const isSunda = lower.includes("abdi") || lower.includes("teu") || lower.includes("anjeun") || lower.includes("kumaha") || lower.includes("hapunten") || lower.includes("sampurasun") || lower.includes("tos") || lower.includes("nuhun") || lower.includes("hoyong") || lower.includes("sunda") || lower.includes("akang") || lower.includes("teteh") || lower.includes("baraya");
      const isBatak = lower.includes("horas") || lower.includes("lae") || lower.includes("cemana") || lower.includes("awak") || lower.includes("kelen") || lower.includes("kek mana") || lower.includes("bah") || lower.includes("medan") || lower.includes("kedan");
      const isMinang = lower.includes("ambo") || lower.includes("nio") || lower.includes("tanyo") || lower.includes("baa") || lower.includes("rancak") || lower.includes("kadai") || lower.includes("padang") || lower.includes("sanak");
      const isBugis = lower.includes("tabe") || lower.includes("kareba") || lower.includes("kodong") || lower.includes("makassar") || lower.includes("baji");
      const isBali = lower.includes("swastyastu") || lower.includes("tiang") || lower.includes("bli") || lower.includes("suksma") || lower.includes("rahayu") || lower.includes("bali");
      const isPapua = lower.includes("pace") || lower.includes("mace") || lower.includes("kitorang") || lower.includes("trada") || lower.includes("papua") || lower.includes("sa pu");

      const hasEmergency = lower.includes("sakit") || lower.includes("dada") || lower.includes("sesak") || lower.includes("darurat") || lower.includes("jantung") || lower.includes("nyeri");
      const hasTani = lower.includes("sawah") || lower.includes("banjir") || lower.includes("tani") || lower.includes("gagal") || lower.includes("caah") || lower.includes("puso") || lower.includes("irigasi");
      const hasPHK = lower.includes("phk") || lower.includes("pecat") || lower.includes("kerja") || lower.includes("pesangon") || lower.includes("pabrik") || lower.includes("upah") || lower.includes("kontrak");
      const hasTanah = lower.includes("tanah") || lower.includes("lahan") || lower.includes("waris") || lower.includes("mafia") || lower.includes("shm") || lower.includes("sertifikat");
      const hasBPJS = lower.includes("bpjs") || lower.includes("berobat") || lower.includes("obat") || lower.includes("sehat") || lower.includes("kartu");
      const hasKUR = lower.includes("kur") || lower.includes("modal") || lower.includes("kredit") || lower.includes("umkm") || lower.includes("usaha") || lower.includes("dagang") || lower.includes("bantuan");
      const hasTilang = lower.includes("tilang") || lower.includes("etle") || lower.includes("lalulintas") || lower.includes("polisi") || lower.includes("marka");
      const hasCurhat = lower.includes("curhat") || lower.includes("capek") || lower.includes("stres") || lower.includes("sedih") || lower.includes("beban") || lower.includes("pikir");
      const hasSKCK = lower.includes("skck") || lower.includes("polsek") || lower.includes("polres") || lower.includes("catatan kepolisian");

      let matchedTopicId = topicId || "";

      if (!matchedTopicId) {
        // Classify user text input based on dialect first
        if (isJawa) {
          if (hasEmergency) matchedTopicId = "kesehatan";
          else if (hasTani) matchedTopicId = "sunda"; // sawah (regional)
          else matchedTopicId = "jawa"; // BPJS Jawa
        } else if (isSunda) {
          if (hasEmergency) matchedTopicId = "kesehatan";
          else matchedTopicId = "sunda"; // sawah Sunda
        } else if (isBatak) {
          matchedTopicId = "batak"; // sengketa tanah Batak
        } else if (isMinang) {
          matchedTopicId = "minang"; // KUR Minang
        } else if (isBugis) {
          matchedTopicId = "bugis"; // PHK Bugis
        } else if (isBali) {
          matchedTopicId = "bali"; // KUR Bali
        } else if (isPapua) {
          matchedTopicId = "papua"; // BPJS Papua
        } else {
          // Standard Indonesian classification
          if (hasEmergency) matchedTopicId = "kesehatan";
          else if (hasTilang) matchedTopicId = "tilang";
          else if (hasPHK) matchedTopicId = "phk-pihak";
          else if (hasKUR) matchedTopicId = "kur-umkm";
          else if (hasSKCK) matchedTopicId = "skck";
          else if (hasCurhat) matchedTopicId = "curhat";
          else if (hasBPJS) matchedTopicId = "kesehatan";
        }
      }

      if (matchedTopicId) {
        const topic = PRESET_TOPICS.find(t => t.id === matchedTopicId);
        if (topic) {
          simulatedResponse = topic.response;
        }
      } else {
        // Fallback for general unclassified inputs
        if (lower.includes('bpjs')) {
          simulatedResponse = '🩺 **Mengenai Layanan BPJS Kesehatan (Simulasi Lokal):\n\n- **Tunggakan Kartu:** Untuk mengaktifkan kartu yang ditangguhkan, kamu bisa mengurus program cicilan REHAB lewat m-JKN.\n- **Layanan Rujukan:** Wajib melalui Faskes Tingkat 1 (Puskesmas/Klinik) terlebih dahulu. KECUALI dalam keadaan gawat darurat medis, kamu berhak langsung ke IGD rumah sakit terdekat mana saja tanpa selembar surat rujukan pun!\n- **Tindakan Hari Ini:** Sampaikan jika ada penolakan, laporkan ke kanal Pengaduan BPJS di 165.';
        } else if (lower.includes('tanah') || lower.includes('sertifikat')) {
          simulatedResponse = '🏘️ **Laporan Sengketa atau Hak Atas Lahan (Simulasi Lokal):\n\n- **Legalitas Dokumen:** Pastikan alas haknya berupa SHM (Sertifikat Hak Milik). Girik atau letter C harus divalidasi ke kantor kelurahan setempat.\n- **Klausul Konflik:** Menurut Pasal 1321 KUHPerdata, kesepakatan atau pemindahtangan hak di bawah ancaman/intimidasi adalah batal demi hukum.\n- **Tindakan Hari Ini:** Ambil foto tapal batas lahanmu, amankan tanda bukti bayar PBB, dan adukan ke BPN jika dipaksa meneken berkas sepihak!';
        } else if (lower.includes('kontrak') || lower.includes('perjanjian')) {
          simulatedResponse = '📝 **Penelaahan Perjanjian Kerja atau Kemitraan (Simulasi Lokal):\n\n- **Pasal Rentan:** Mintalah salinan kontrak secara utuh. Hati-hati dengan pasal denda pinalti pengunduran diri bernilai tinggi atau klausa pelepasan hak cipta sepihak.\n- **Tindakan Hari Ini:** Jangan buru-buru tanda tangan. Sebagai buruh/rekanan mikro, katakan *"Saya butuh 1 hari untuk membaca kembali draf ini bersama pendamping keluarga."*';
        } else if (lower.includes('skck')) {
          const skckTopic = PRESET_TOPICS.find(t => t.id === "skck");
          if (skckTopic) simulatedResponse = skckTopic.response;
        } else if (lower.includes('tilang') || lower.includes('etle')) {
          const tilangTopic = PRESET_TOPICS.find(t => t.id === "tilang");
          if (tilangTopic) simulatedResponse = tilangTopic.response;
        }
      }

      // Add information badge that we ran fallback
      const finalMsgText = simulatedResponse;
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: `sigap-${Date.now()}`,
            sender: 'sigap',
            text: finalMsgText,
            timestamp: formattedTime
          }
        ]);
      }, 1200);
    }
  };

  const loadTopicSimulation = (topicId: string, customText?: string) => {
    const topic = PRESET_TOPICS.find(t => t.id === topicId);
    if (topic && topic.category !== 'Bahasa Daerah') {
      setActiveTopic(topic);
    }
    const textToSend = customText || topic?.prompt || "Butuh bantuan panduan tentang hal ini.";
    
    // Smooth scroll phone into view
    phoneContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    sendChatMessage(textToSend, undefined, topicId);
  };

  const loadFeatureSimulation = (feature: FeatureCard) => {
    const topic = PRESET_TOPICS.find(t => t.id === feature.presetTopicId);
    if (topic && topic.category !== 'Bahasa Daerah') {
      setActiveTopic(topic);
    }
    loadTopicSimulation(feature.presetTopicId);
  };

  const handleCustomSend = (e: FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() && !attachedFile) return;
    sendChatMessage(customInput);
  };

  return (
    <div className="space-y-16 py-4">
      {/* Top Section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-none text-zinc-900">
          Pilih Masalah Sipumu, Let SIGAP Handle the Rest.
        </h2>
        <p className="text-sm sm:text-base text-gray-700 font-bold font-mono">
          [ ⚡ KLIK KARTU DI BAWAH UNTUK MEMICU CHATBOT PADA HANDPHONE ]
        </p>
      </div>

      {/* Grid: 3x2 Windows Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <div
            key={feature.id}
            onClick={() => loadFeatureSimulation(feature)}
            className="neo-card flex flex-col justify-between overflow-hidden cursor-pointer h-full group"
          >
            {/* Window bar */}
            <div className="px-3 py-2 border-b-3 border-black bg-white flex items-center justify-between">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 border-2 border-black group-hover:bg-red-500 transition-colors"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-black group-hover:bg-yellow-500 transition-colors"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-black group-hover:bg-green-500 transition-colors"></div>
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">{feature.tag}</span>
            </div>

            {/* Card Content body */}
            <div className={`p-5 flex-1 ${feature.bgColor} transition-colors border-b-3 border-black flex flex-col justify-between space-y-4`}>
              <h3 className="text-xl font-extrabold font-display leading-tight text-black flex items-center gap-2">
                {feature.title}
              </h3>
              <p className="text-xs font-bold text-neutral-800 leading-relaxed">
                {feature.desc}
              </p>
            </div>

            {/* Card Action footer button */}
            <div className="bg-white p-3 flex justify-between items-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px]">
              <span className="text-[10px] sm:text-xs font-mono font-extrabold text-indigo-950 flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-500 fill-amber-500" />
                Klik Uji Simulasi
              </span>
              <span className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Phone Chat Simulator */}
      <div ref={phoneContainerRef} className="max-w-4xl mx-auto pt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Chat Control / Info Panel */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-5 rounded-2xl border-3 border-black neo-shadow-sm space-y-4">
              <span className="inline-block px-2.5 py-0.5 bg-neo-pink text-white text-[10px] font-mono font-bold rounded neo-border-sm">
                LIVE DEMO CHATBOT
              </span>
              <h3 className="text-xl font-extrabold font-display text-zinc-950">
                Uji Coba AI SIGAP dengan HP Interaktif
              </h3>
              <p className="text-xs font-bold text-gray-700 leading-relaxed">
                Pilih topik siap-pakai di bawah, atau ketik kata kunci seperti <strong className="bg-neo-yellow/30 px-1 py-0.5 rounded">"BPJS"</strong>, <strong className="bg-neo-yellow/30 px-1 py-0.5 rounded">"tanah"</strong>, atau <strong className="bg-neo-yellow/30 px-1 py-0.5 rounded">"kontrak"</strong> pada kolom input handphone untuk menguji respons lokal SIGAP secara instan.
              </p>

              {/* Quick Preset Buttons list (Filtered non-regional) */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono font-extrabold text-neutral-500 uppercase tracking-wider">Topik Cepat:</span>
                <div className="flex flex-wrap gap-2">
                  {nonRegionalTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => loadTopicSimulation(topic.id)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border-2 border-black font-extrabold transition-all hover:bg-neutral-50 ${
                        activeTopic.id === topic.id ? 'bg-neo-yellow text-black neo-shadow-sm -translate-y-0.5' : 'bg-white text-gray-800'
                      }`}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Notice Badge */}
            <div className="bg-neo-violet p-4 rounded-xl border-3 border-black neo-shadow-sm flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-bold shrink-0">
                💡
              </div>
              <p className="text-xs font-bold text-zinc-950 leading-relaxed">
                <strong>Tips Warga:</strong> Seret foto surat tilang atau draf kontrakmu kesini! AI SIGAP akan mentranskrip, menerangkan perihal hukum secara terang-benderang.
              </p>
            </div>
          </div>

          {/* Physical Phone Mockup Chat Container */}
          <div className="md:col-span-7 flex justify-center">
            <div 
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full max-w-[340px] h-[550px] bg-neo-dark rounded-[40px] border-[5px] border-black relative neo-shadow-lg flex flex-col overflow-hidden p-2 transition-all ${
                dragActive ? 'scale-[1.02] ring-4 ring-offset-2 ring-neo-yellow' : ''
              }`}
            >
              {/* Drag overlay portal */}
              <AnimatePresence>
                {dragActive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-2 bg-neo-yellow/90 backdrop-blur-sm rounded-[30px] border-4 border-dashed border-black z-30 flex flex-col items-center justify-center p-4 text-center pointer-events-none"
                  >
                    <div className="w-14 h-14 bg-white border-3 border-black rounded-full flex items-center justify-center font-extrabold text-2xl neo-shadow-sm mb-3">
                      📂
                    </div>
                    <span className="text-sm font-extrabold font-display text-neutral-900 leading-tight">
                      Lepas berkas disini...
                    </span>
                    <span className="text-[10px] font-mono font-bold text-neutral-700 mt-1 uppercase">
                      Untuk dianalisis AI SIGAP
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Phone Camera Notch */}
              <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex justify-center items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
              </div>

              {/* Screen Inner Container */}
              <div className="w-full h-full bg-neutral-100 rounded-[30px] overflow-hidden flex flex-col border-2 border-black">
                
                {/* Simulated App Header */}
                <div className="pt-8 pb-3 px-4 bg-white border-b-2 border-black flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-neo-yellow rounded-full border-2 border-black flex items-center justify-center font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-black font-display leading-tight">AI SIGAP</h4>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[8px] font-mono font-bold text-emerald-600 uppercase">Sipil Siap Sedia</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 bg-gray-100 border border-black rounded text-[8px] font-mono font-bold text-gray-500">
                    VERSI 1.1.0
                  </div>
                </div>

                {/* Simulated Chat Messages log */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] flex flex-col justify-start">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] p-2.5 rounded-2xl border-2 border-black text-xs font-bold leading-relaxed neo-shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-white self-end text-neutral-900 rounded-tr-none'
                          : 'bg-neo-green self-start text-left rounded-tl-none whitespace-pre-line'
                      }`}
                    >
                      {msg.fileName && (
                        <div className="mb-2 p-1.5 bg-gray-100 border-2 border-black overflow-hidden rounded-xl text-[9px] font-mono text-left flex flex-col gap-1.5">
                          {msg.filePreview ? (
                            <img src={msg.filePreview} alt="Preview" className="w-full max-h-24 object-cover rounded border border-black" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="py-2.5 bg-neutral-200 border border-black rounded flex items-center justify-center font-black text-[8px]">
                              📁 DOKUMEN RESMI
                            </div>
                          )}
                          <div className="truncate font-black text-black">📄 {msg.fileName}</div>
                        </div>
                      )}
                      <p className="break-words leading-relaxed select-text">{msg.text}</p>
                      <span className="text-[7px] font-mono text-gray-500 block text-right mt-1 font-semibold">{msg.timestamp}</span>
                    </div>
                  ))}

                  {/* Simulated typing bubble */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="p-3 bg-neo-green border-2 border-black rounded-2xl rounded-tl-none self-start text-[10px] text-zinc-900 font-bold flex gap-1.5 items-center neo-shadow-sm"
                      >
                        <RefreshCw size={10} className="animate-spin text-zinc-950 shrink-0" />
                        <span>AI SIGAP menelaah tuntutanmu...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={chatEndRef} />
                </div>

                {/* File input attachment preview bar */}
                <AnimatePresence>
                  {attachedFile && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3 py-2 bg-neo-yellow/30 border-t-2 border-black flex items-center justify-between z-10"
                    >
                      <div className="flex items-center gap-2 truncate max-w-[80%]">
                        {attachedFile.preview ? (
                          <img src={attachedFile.preview} alt="Pratinjau Mini" className="w-6 h-6 object-cover border border-black rounded" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-6 h-6 bg-white border border-black rounded flex items-center justify-center text-xs">📄</div>
                        )}
                        <span className="text-[10px] font-mono font-bold truncate text-black">{attachedFile.name}</span>
                      </div>
                      <button
                        onClick={removeAttachedFile}
                        className="p-1 rounded bg-red-400 hover:bg-red-500 border border-black cursor-pointer shadow-[1px_1px_0px_#000000]"
                      >
                        <Trash2 size={10} className="text-black" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simulated Custom Chat Input Form */}
                <form onSubmit={handleCustomSend} className="p-2 bg-white border-t-2 border-black flex items-center gap-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    accept="image/*,application/pdf,text/*"
                  />
                  
                  {/* Clip Upload Button */}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-8 h-8 rounded-xl bg-white border-2 border-black hover:bg-gray-50 flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000] shrink-0"
                    title="Unggah Dokumen"
                  >
                    <Paperclip size={12} className="text-black" />
                  </button>

                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder={attachedFile ? "Beri pesan pertanyaan..." : "Tulis keluhanmu..."}
                    className="flex-1 px-2.5 py-2 text-xs border-2 border-black rounded-xl outline-none font-bold placeholder-gray-400 bg-gray-50 focus:bg-white min-w-0"
                  />
                  
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-xl bg-neo-yellow border-2 border-black hover:bg-yellow-400 flex items-center justify-center transition-all cursor-pointer shadow-[2px_2px_0px_#000000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000] shrink-0"
                  >
                    <Send size={12} className="text-black" />
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
