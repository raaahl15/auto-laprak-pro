import React, { useState, useEffect } from 'react';
import { UploadCloud, Plus, Trash2, FileText, Loader2, Users, BookOpen, Bookmark, BarChart2, BrainCircuit, Activity, LayoutDashboard, Settings, LogOut, Lock, User, TerminalSquare, Menu } from 'lucide-react';

export default function App() {
  // Helper to get initial state from localStorage or return a default value
  const getInitialState = (key, defaultValue) => {
    try {
      const savedItem = localStorage.getItem(key);
      // If the saved item is 'undefined', it's a string from a previous run, so treat it as null
      if (savedItem && savedItem !== 'undefined') {
        return JSON.parse(savedItem);
      }
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      localStorage.removeItem(key); // Corrupted, so remove it
    }
    return defaultValue;
  };

  // ==========================================
  // 0. SISTEM AUTHENTIKASI (LOGIN)
  // ==========================================
  const [isAuthenticated, setIsAuthenticated] = useState(() => getInitialState('isAuthenticated', false));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'RahulGh' && loginForm.password === 'Ra15Gh12') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Akses Ditolak: Username atau Password salah.');
    }
  };

  // ==========================================
  // 0. SISTEM ANTI-SPAM (GLOBAL COOLDOWN) ⏳
  // ==========================================
  const [globalAiLock, setGlobalAiLock] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);

  const triggerCooldown = (seconds) => {
    localStorage.setItem('cooldownEndTime', Date.now() + seconds * 1000);
    setCooldownSec(seconds);
    let timeLeft = seconds;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setCooldownSec(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        localStorage.removeItem('cooldownEndTime');
      }
    }, 1000);
  };

  // Effect to re-hydrate cooldown on page load
  useEffect(() => {
    const endTime = localStorage.getItem('cooldownEndTime');
    if (endTime) {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      if (remaining > 0) {
        triggerCooldown(remaining);
      } else {
        localStorage.removeItem('cooldownEndTime');
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // ==========================================
  // 1. STATE FORM IDENTITAS & MANUAL INPUT
  // ==========================================
  const defaultFormData = {
    kode_modul: 'SP-01', judul_modul: '', no_kelompok: 'Kelompok 01', nama_asprak: '', nim_asprak: '',
    hari: 'Senin', tanggal: '', jam: '08.00 - 10.30 WIB', tempat: 'Laboratorium Sensor dan Sistem Telekontrol',
    nama_matkul: '', dosen_pengampu: '',
  };
  const [formData, setFormData] = useState(() => getInitialState('formData', defaultFormData));

  const [anggotaList, setAnggotaList] = useState(() => getInitialState('anggotaList', [{ nama: '', nim: '' }]));
  const [alatList, setAlatList] = useState(() => getInitialState('alatList', [{ no: 1, nama_alat: '', spesifikasi: '', jumlah: '' }]));
  const [pustakaList, setPustakaList] = useState(() => getInitialState('pustakaList', ['']));

  // ==========================================
  // 2. STATE AI DRAFT STUDIO (BAB 1)
  // ==========================================
  const [tujuanList, setTujuanList] = useState(() => getInitialState('tujuanList', ['', '', '', '']));
  const defaultTeoriList = [
    { judul: '', isi: '', rekomendasi: '' },
    { judul: '', isi: '', rekomendasi: '' },
    { judul: '', isi: '', rekomendasi: '' },
    { judul: '', isi: '', rekomendasi: '' }
  ];
  const [teoriList, setTeoriList] = useState(() => getInitialState('teoriList', defaultTeoriList));
  const [isGeneratingTujuan, setIsGeneratingTujuan] = useState(false);
  const [loadingTeori, setLoadingTeori] = useState([false, false, false, false]);

  // ==========================================
  // 3. STATE AI BAB 2 (PROSEDUR)
  // ==========================================
  const [percobaanList, setPercobaanList] = useState(() => getInitialState('percobaanList', []));
  const [prosedurData, setProsedurData] = useState(() => getInitialState('prosedurData', { intro: '', persiapan: '', percobaan_steps: [], penyelesaian: '' }));
  const [isDetectingPercobaan, setIsDetectingPercobaan] = useState(false);
  const [isGeneratingProsedur, setIsGeneratingProsedur] = useState(false);

  // ==========================================
  // 4. STATE AI BAB 3 (PEMBAHASAN DETAIL)
  // ==========================================
  const [bab3Data, setBab3Data] = useState(() => getInitialState('bab3Data', [])); 
  const [loadingBab3, setLoadingBab3] = useState([]);

  // ==========================================
  // 5. STATE AI BAB 4 (PENUTUP)
  // ==========================================
  const [bab4Data, setBab4Data] = useState(() => getInitialState('bab4Data', { kesimpulan: '', saran: '' }));
  const [isGeneratingBab4, setIsGeneratingBab4] = useState(false);

  // ==========================================
  // 6. STATE UPLOAD BERKAS & STATUS FINAL
  // ==========================================
  const [modulFiles, setModulFiles] = useState([]);
  const [dataFiles, setDataFiles] = useState([]);
  const [isGeneratingFinal, setIsGeneratingFinal] = useState(false);

  // ==========================================
  // 7. PERSISTENSI STATE (LOCALSTORAGE)
  // ==========================================
  useEffect(() => {
    try {
      localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
      localStorage.setItem('formData', JSON.stringify(formData));
      localStorage.setItem('anggotaList', JSON.stringify(anggotaList));
      localStorage.setItem('alatList', JSON.stringify(alatList));
      localStorage.setItem('pustakaList', JSON.stringify(pustakaList));
      localStorage.setItem('tujuanList', JSON.stringify(tujuanList));
      localStorage.setItem('teoriList', JSON.stringify(teoriList));
      localStorage.setItem('percobaanList', JSON.stringify(percobaanList));
      localStorage.setItem('prosedurData', JSON.stringify(prosedurData));
      localStorage.setItem('bab3Data', JSON.stringify(bab3Data));
      localStorage.setItem('bab4Data', JSON.stringify(bab4Data));
    } catch (error) {
      console.error("Gagal menyimpan state ke localStorage:", error);
    }
  }, [
    isAuthenticated,
    formData,
    anggotaList,
    alatList,
    pustakaList,
    tujuanList,
    teoriList,
    percobaanList,
    prosedurData,
    bab3Data,
    bab4Data,
  ]);

  // ⚠️ PASTIKAN URL DEPLOYMENT TERBARU SUDAH DIMASUKKAN DI SINI
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyFivK-eULs2x2PjfKls-igDzIW0MW_Er51CmeNQppABo1K4I_A2BhVAKGIC2d3h3GkmQ/exec'; 

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({ fileName: file.name, mimeType: file.type, base64: reader.result.split(',')[1] });
      reader.onerror = (error) => reject(error);
    });
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAddAnggota = () => anggotaList.length < 8 ? setAnggotaList(list => [...list, { nama: '', nim: '' }]) : alert("Maksimal 8 anggota.");
  const handleRemoveAnggota = (index) => setAnggotaList(list => list.filter((_, i) => i !== index));
  const handleAnggotaChange = (index, field, value) => { const newList = [...anggotaList]; newList[index][field] = value; setAnggotaList(newList); };
  const handleAddAlat = () => setAlatList(list => [...list, { no: list.length + 1, nama_alat: '', spesifikasi: '', jumlah: '' }]);
  const handleRemoveAlat = (index) => setAlatList(list => list.filter((_, i) => i !== index).map((item, i) => ({ ...item, no: i + 1 })));
  const handleAlatChange = (index, field, value) => { const newList = [...alatList]; newList[index][field] = value; setAlatList(newList); };
  const handlePustakaChange = (index, value) => { const newList = [...pustakaList]; newList[index] = value; setPustakaList(newList); };
  const handleModulUpload = (e) => setModulFiles(files => [...files, ...Array.from(e.target.files)]);
  const handleRemoveModul = (index) => setModulFiles(files => files.filter((_, i) => i !== index));
  const handleDataUpload = (e) => setDataFiles(files => [...files, ...Array.from(e.target.files)]);
  const handleRemoveData = (index) => setDataFiles(files => files.filter((_, i) => i !== index));

  // ==========================================
  // FITUR AI 1: TUJUAN
  // ==========================================
  const handleGenerateTujuan = async () => {
    if (!formData.judul_modul) return alert("Isi Judul Modul Praktikum terlebih dahulu agar AI paham konteksnya!");
    if (pustakaList[0] === '') return alert("Minimal masukkan 1 referensi pustaka untuk acuan AI.");
    if (globalAiLock || cooldownSec > 0) return;
    
    setIsGeneratingTujuan(true);
    setGlobalAiLock(true);
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'generate_tujuan', judul_modul: formData.judul_modul, daftar_pustaka: pustakaList }), redirect: 'follow'
      });
      const result = await response.json();
      if (result && result.tujuan) setTujuanList(result.tujuan);
      else if (result && result._error_msg) alert("Gagal memanggil AI ❌\n\nPesan Asli: " + result._error_msg);
    } catch (e) { alert("Gagal menghubungi server Google."); } finally { 
      setIsGeneratingTujuan(false); 
      setGlobalAiLock(false);
      triggerCooldown(5);
    }
  };

  // ==========================================
  // FITUR AI 2: DASAR TEORI
  // ==========================================
  const handleGenerateTeoriSubbab = async (index) => {
    if (!formData.judul_modul || tujuanList[index] === '') return alert(`Isi Judul Modul dan Tujuan 1.1.${index + 1} dulu!`);
    if (pustakaList[0] === '') return alert("Masukkan minimal 1 Referensi Acuan untuk sitasi!");
    if (globalAiLock || cooldownSec > 0) return;
    
    const newLoading = [...loadingTeori]; newLoading[index] = true; setLoadingTeori(newLoading);
    setGlobalAiLock(true);
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'generate_teori_subbab', judul_modul: formData.judul_modul, tujuan_spesifik: tujuanList[index], index: index + 1, daftar_pustaka: pustakaList }), redirect: 'follow'
      });
      const result = await response.json();
      if (result && result.judul && result.isi) {
        const newTeori = [...teoriList];
        newTeori[index] = { judul: result.judul, isi: result.isi, rekomendasi: result.rekomendasi || '' };
        setTeoriList(newTeori);
      } else if (result && result._error_msg) alert("Gagal memanggil AI ❌\n\n" + result._error_msg);
    } catch (e) { alert("Gagal menghubungi server."); } finally { 
      const resetLoading = [...loadingTeori]; resetLoading[index] = false; setLoadingTeori(resetLoading); 
      setGlobalAiLock(false);
      triggerCooldown(5);
    }
  };

  // ==========================================
  // FITUR AI 3: DETEKSI PDF MODUL
  // ==========================================
  const handleDetectPercobaan = async () => {
    if (modulFiles.length === 0) return alert("Silakan upload file Modul Praktikum (.pdf) di dropzone atas terlebih dahulu!");
    if (globalAiLock || cooldownSec > 0) return;

    setIsDetectingPercobaan(true);
    setGlobalAiLock(true);
    try {
      const fileB64 = await convertFileToBase64(modulFiles[0]);
      const response = await fetch(GAS_URL, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'detect_percobaan', judul_modul: formData.judul_modul, file_data: fileB64.base64, mime_type: fileB64.mimeType })
      });
      const result = await response.json();
      if (result && result.percobaan_list) setPercobaanList(Array.isArray(result.percobaan_list) ? result.percobaan_list : [result.percobaan_list]);
      else alert("Gagal scan judul percobaan: " + (result._error_msg || "Format salah"));
    } catch (e) { alert("Gagal menghubungi server untuk memindai dokumen."); } finally { 
      setIsDetectingPercobaan(false); 
      setGlobalAiLock(false);
      triggerCooldown(5);
    }
  };

  // ==========================================
  // FITUR AI 4: GENERATE PROSEDUR FULL
  // ==========================================
  const handleGenerateProsedur = async () => {
    if (percobaanList.length === 0) return alert("Deteksi atau isi minimal 1 judul percobaan dulu!");
    if (globalAiLock || cooldownSec > 0) return;

    setIsGeneratingProsedur(true);
    setGlobalAiLock(true);
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'generate_prosedur', kode_modul: formData.kode_modul, judul_modul: formData.judul_modul, percobaan_list: percobaanList })
      });
      const result = await response.json();
      if (result && result.intro) {
        let normalizedSteps = [];
        if (Array.isArray(result.percobaan_steps)) {
          normalizedSteps = result.percobaan_steps.map(step => {
            if (typeof step === 'string') return step;
            if (typeof step === 'object') {
              const judulObj = step.judul ? `Judul: ${step.judul}\n` : '';
              const langkahObj = Array.isArray(step.langkah) ? step.langkah.map((l, i) => `${i+1}. ${l}`).join('\n') : '';
              return judulObj + langkahObj;
            }
            return String(step);
          });
        }
        setProsedurData({ intro: String(result.intro || ''), persiapan: Array.isArray(result.persiapan) ? result.persiapan.join('\n') : String(result.persiapan || ''), percobaan_steps: normalizedSteps, penyelesaian: Array.isArray(result.penyelesaian) ? result.penyelesaian.join('\n') : String(result.penyelesaian || '') });
      } else alert("Gagal generate prosedur. Format balasan AI salah.");
    } catch (e) { alert("Gagal menghubungi server Google."); } finally { 
      setIsGeneratingProsedur(false); 
      setGlobalAiLock(false);
      triggerCooldown(5);
    }
  };

  // ==========================================
  // FITUR AI 5: BAB 3 (PEMBAHASAN)
  // ==========================================
  const handleGenerateBab3Subbab = async (expIndex, subIndex) => {
    if (!formData.judul_modul) return alert("Isi Judul Modul!");
    if (globalAiLock || cooldownSec > 0) return;

    setLoadingBab3(prev => {
      const newLoading = prev.map(row => [...row]);
      if (!newLoading[expIndex]) {
        newLoading[expIndex] = [false, false, false, false, false];
      }
      newLoading[expIndex][subIndex] = true;
      return newLoading;
    });
    setGlobalAiLock(true);

    try {
      let dataFilePayload = null;
      if ((subIndex === 2 || subIndex === 3) && dataFiles.length > 0) {
        dataFilePayload = await convertFileToBase64(dataFiles[0]);
      }

      const response = await fetch(GAS_URL, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ 
          action: 'generate_bab3_subbab', judul_modul: formData.judul_modul, judul_percobaan: percobaanList[expIndex], sub_index: subIndex + 1, daftar_pustaka: pustakaList,
          file_data: dataFilePayload ? dataFilePayload.base64 : null, mime_type: dataFilePayload ? dataFilePayload.mimeType : null
        })
      });
      const result = await response.json();
      
      if (result && result.isi) {
        const newData = [...bab3Data];
        if (!newData[expIndex]) newData[expIndex] = ['', '', '', '', ''];
        newData[expIndex][subIndex] = result.isi;
        setBab3Data(newData);
      } else if (result && result._error_msg) alert(`Gagal (Bab 3.1.${subIndex + 1}): \n${result._error_msg}`);
    } catch (e) { alert("Gagal terhubung ke server Google."); } finally {
      setLoadingBab3(prev => {
        const newLoading = prev.map(row => [...row]);
        if (newLoading[expIndex]) {
          newLoading[expIndex][subIndex] = false;
        }
        return newLoading;
      });
      setGlobalAiLock(false);
      triggerCooldown(5);
    }
  };

  // ==========================================
  // FITUR AI 6: BAB 4 (PENUTUP)
  // ==========================================
  const handleGenerateBab4 = async () => {
    if (!formData.judul_modul || percobaanList.length === 0) return alert("Lengkapi Judul Modul dan Scan Percobaan di Bab 2 terlebih dahulu!");
    if (globalAiLock || cooldownSec > 0) return;
    
    setIsGeneratingBab4(true);
    setGlobalAiLock(true);
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'generate_bab4', judul_modul: formData.judul_modul, percobaan_list: percobaanList })
      });
      const result = await response.json();
      if (result && result.kesimpulan) setBab4Data({ kesimpulan: result.kesimpulan, saran: result.saran });
      else if (result && result._error_msg) alert(`Gagal menyusun Bab 4: \n${result._error_msg}`);
    } catch (e) { alert("Gagal menyusun Bab 4 karena gangguan jaringan."); } finally { 
      setIsGeneratingBab4(false); 
      setGlobalAiLock(false);
      triggerCooldown(5);
    }
  };

  // ==========================================
  // FITUR FINAL: RAKIT SELURUH DOKUMEN & FILE
  // ==========================================
  const handleGenerateFinal = async () => {
    if (!formData.judul_modul || !formData.tanggal) return alert("Mohon isi Judul Modul dan Tanggal Praktikum.");
    if (globalAiLock || cooldownSec > 0) return alert("Tunggu sistem AI selesai beristirahat sebelum mencetak laporan!");
    
    setIsGeneratingFinal(true);
    setGlobalAiLock(true);
    const opsiTanggal = { day: 'numeric', month: 'long', year: 'numeric' };
    const tanggalFormat = new Date(formData.tanggal).toLocaleDateString('id-ID', opsiTanggal);

    try {
      const allFiles = [...modulFiles, ...dataFiles];
      const convertedFilesPayload = await Promise.all(allFiles.map(file => convertFileToBase64(file)));

      const payload = {
        action: 'final_doc', kode_modul: formData.kode_modul, judul_modul: formData.judul_modul, nama_matkul: formData.nama_matkul, dosen_pengampu: formData.dosen_pengampu,
        cover: { nama_asprak: formData.nama_asprak, nim_asprak: formData.nim_asprak, no_kelompok: formData.no_kelompok, anggota: anggotaList },
        bab_1: { tujuan: tujuanList, teori: teoriList },
        bab_2: { hari: formData.hari, tanggal: tanggalFormat, jam: formData.jam, tempat: formData.tempat, alat_komponen: alatList, prosedur: prosedurData, judul_percobaan: percobaanList },
        bab_3: bab3Data, bab_4: bab4Data, daftar_pustaka: pustakaList, files: convertedFilesPayload 
      };

      const response = await fetch(GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      const result = await response.json();

      if(result.status === 'success') {
        alert('🚀 Proses Selesai!\nDokumen Laporan dan seluruh berkas telah diamankan di Google Drive.');
        if(result.docUrl) window.open(result.docUrl, '_blank');
      } else { alert('Error pada sistem Drive: ' + result.message); }
    } catch (error) { alert('Terjadi kesalahan saat mengeksekusi dokumen final.'); } finally { 
      setIsGeneratingFinal(false); 
      setGlobalAiLock(false);
    }
  };

  // ==========================================
  // RENDER PENGKONDISIAN: LOGIN vs DASHBOARD
  // ==========================================
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070f1d] font-sans text-slate-200 selection:bg-cyan-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#070f1d] to-[#070f1d]"></div>
        
        <div className="relative z-10 w-full max-w-md p-8 bg-[#0f172a]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-cyan-500/10 rounded-2xl mb-4 border border-cyan-500/20">
              <Activity className="w-10 h-10 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Auto-Laprak <span className="text-cyan-400">Pro</span></h1>
            <p className="text-slate-400 text-sm mt-2">Secure Laboratory Generation System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center font-medium animate-pulse">
                {loginError}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Authentication ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <input 
                  type="text" 
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Enter Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <input 
                  type="password" 
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full bg-[#1e293b] border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-900/50 transition-all flex items-center justify-center gap-2"
            >
              INITIALIZE SYSTEM
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#070f1d] font-sans text-slate-200 selection:bg-cyan-500/30">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0f172a] border-r border-slate-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between`}>
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
            <Activity className="w-7 h-7 text-cyan-400" />
            <div>
              <h1 className="text-lg font-bold tracking-wide text-white leading-tight">Aethra</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Monitoring Suite</p>
            </div>
          </div>
          
          <div className="px-4 py-6 space-y-1">
            <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Main Console</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-cyan-900/20 text-cyan-400 border border-cyan-800/30 transition-colors">
              <TerminalSquare className="w-5 h-5" /> Laprak Studio
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:bg-[#1e293b] transition-colors">
              <BarChart2 className="w-5 h-5" /> Analytics & Trends
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-5 h-5" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0f172a] via-[#070f1d] to-[#070f1d]">
        
        {/* TOPBAR */}
        <header className="h-20 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">System Online</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">Rahul Ghulam</p>
              <p className="text-xs text-slate-400">rahulghulam15@gmail.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1e293b] border border-slate-700 flex items-center justify-center text-cyan-400 font-bold">
              RG
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-32">
          
          {/* PAGE HEADER & TOP BUTTON */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Laprak Overview</h2>
              <p className="text-sm text-slate-400 mt-1">Real-time laboratory reporting and generation matrix.</p>
            </div>
            <div className="flex items-center gap-3">
              {cooldownSec > 0 && (
                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-2 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin"/> JEDA API: {cooldownSec}s
                </div>
              )}
              <button 
                onClick={handleGenerateFinal} 
                disabled={isGeneratingFinal || globalAiLock || cooldownSec > 0}
                className="bg-slate-100 hover:bg-white text-slate-900 px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
                {isGeneratingFinal ? <Loader2 className="w-4 h-4 animate-spin"/> : <FileText className="w-4 h-4"/>}
                {isGeneratingFinal ? 'SYNCING...' : 'REPORT'}
              </button>
            </div>
          </div>

          {/* SEKSI 1: IDENTITAS */}
          <section className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full"></div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-500"/> Identitas Praktikum
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="kode_modul" placeholder="Kode Modul" value={formData.kode_modul} onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors" />
                <input type="text" name="judul_modul" placeholder="Judul Praktikum" value={formData.judul_modul} onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors text-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <input type="text" name="hari" placeholder="Hari" value={formData.hari} onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors" />
                <input type="date" name="tanggal" onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors text-slate-400" />
                <input type="text" name="jam" placeholder="Jam" value={formData.jam} onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors" />
                <input type="text" name="tempat" placeholder="Tempat" value={formData.tempat} onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="nama_matkul" placeholder="Mata Kuliah" value={formData.nama_matkul} onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors" />
                <input type="text" name="dosen_pengampu" placeholder="Dosen Pengampu" value={formData.dosen_pengampu} onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="text" name="no_kelompok" placeholder="Kelompok" value={formData.no_kelompok} onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors" />
                <input type="text" name="nama_asprak" placeholder="Nama Asprak" value={formData.nama_asprak} onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors" />
                <input type="text" name="nim_asprak" placeholder="NIM Asprak" value={formData.nim_asprak} onChange={handleInputChange} className="p-3 bg-[#1e293b] border border-slate-700 rounded-xl text-sm focus:border-cyan-500 outline-none transition-colors" />
              </div>
            </div>
          </section>

          {/* SEKSI 2 & 3: ANGGOTA & ALAT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2"><User className="w-4 h-4 text-cyan-500"/> Team Roster</h3>
                <button onClick={handleAddAnggota} className="text-[10px] bg-cyan-900/30 text-cyan-400 font-bold px-2 py-1 rounded border border-cyan-800/50 hover:bg-cyan-800/50 self-end sm:self-center">+ ADD</button>
              </div>
              <div className="space-y-3">
                {anggotaList.map((anggota, index) => (
                  <div key={index} className="flex gap-2">
                    <input type="text" placeholder="Nama" value={anggota.nama} onChange={(e) => handleAnggotaChange(index, 'nama', e.target.value)} className="w-1/2 p-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-xs focus:border-cyan-500 outline-none" />
                    <input type="text" placeholder="NIM" value={anggota.nim} onChange={(e) => handleAnggotaChange(index, 'nim', e.target.value)} className="w-1/2 p-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-xs focus:border-cyan-500 outline-none" />
                    <button onClick={() => handleRemoveAnggota(index)} disabled={anggotaList.length === 1} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2"><Settings className="w-4 h-4 text-cyan-500"/> Hardware Specs</h3>
                <button onClick={handleAddAlat} className="text-[10px] bg-cyan-900/30 text-cyan-400 font-bold px-2 py-1 rounded border border-cyan-800/50 hover:bg-cyan-800/50 self-end sm:self-center">+ ADD</button>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {alatList.map((alat, index) => (
                  <div key={index} className="flex gap-2">
                    <input type="text" placeholder="Alat" value={alat.nama_alat} onChange={(e) => handleAlatChange(index, 'nama_alat', e.target.value)} className="w-2/5 p-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-xs focus:border-cyan-500 outline-none" />
                    <input type="text" placeholder="Spesifikasi" value={alat.spesifikasi} onChange={(e) => handleAlatChange(index, 'spesifikasi', e.target.value)} className="w-2/5 p-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-xs focus:border-cyan-500 outline-none" />
                    <input type="text" placeholder="Qty" value={alat.jumlah} onChange={(e) => handleAlatChange(index, 'jumlah', e.target.value)} className="w-1/5 p-2.5 bg-[#1e293b] border border-slate-700 rounded-lg text-xs focus:border-cyan-500 outline-none text-center" />
                    <button onClick={() => handleRemoveAlat(index)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SEKSI 4: PUSTAKA & UPLOAD BERKAS */}
          <section className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2"><Bookmark className="w-4 h-4 text-cyan-500"/> Bibliography (IEEE)</h3>
              <button onClick={() => setPustakaList([...pustakaList, ''])} className="text-[10px] bg-cyan-900/30 text-cyan-400 font-bold px-2 py-1 rounded border border-cyan-800/50 hover:bg-cyan-800/50 self-end sm:self-center">+ ADD</button>
            </div>
            <div className="space-y-3">
              {pustakaList.map((ref, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <span className="w-6 text-center text-slate-500 font-bold text-xs">[{index + 1}]</span>
                  <textarea placeholder='Penulis, "Judul," Jurnal, Vol, Tahun.' rows="1" value={ref} onChange={(e) => handlePustakaChange(index, e.target.value)} className="flex-1 p-3 bg-[#1e293b] border border-slate-700 rounded-xl focus:border-cyan-500 text-xs outline-none resize-none text-white" />
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-4"><UploadCloud className="w-4 h-4 text-cyan-500"/> Modul (.pdf)</h3>
              <div className="border-2 border-dashed border-slate-700 bg-[#1e293b]/50 rounded-xl p-6 text-center hover:bg-[#1e293b] transition relative cursor-pointer flex flex-col justify-center items-center">
                <input type="file" multiple accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleModulUpload} />
                <FileText className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-slate-400 font-medium text-xs">Drop PDF Files Here</p>
              </div>
              {modulFiles.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  {modulFiles.map((file, i) => (
                    <div key={i} className="flex justify-between items-center px-3 py-2 bg-[#1e293b] rounded-lg border border-slate-700 text-xs text-slate-300">
                      <span className="truncate w-3/4">{file.name}</span>
                      <button onClick={() => handleRemoveModul(i)} className="text-rose-400 hover:text-rose-500">Del</button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-cyan-500"/> Data Mentah (Img/CSV)</h3>
              <div className="border-2 border-dashed border-slate-700 bg-[#1e293b]/50 rounded-xl p-6 text-center hover:bg-[#1e293b] transition relative cursor-pointer flex flex-col justify-center items-center">
                <input type="file" multiple accept=".csv, .xlsx, .xls, .png, .jpg, .jpeg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleDataUpload} />
                <BarChart2 className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-slate-400 font-medium text-xs">Drop Data Files Here</p>
              </div>
              {dataFiles.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  {dataFiles.map((file, i) => (
                    <div key={i} className="flex justify-between items-center px-3 py-2 bg-[#1e293b] rounded-lg border border-slate-700 text-xs text-slate-300">
                      <span className="truncate w-3/4">{file.name}</span>
                      <button onClick={() => handleRemoveData(i)} className="text-rose-400 hover:text-rose-500">Del</button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="h-px bg-slate-800 w-full my-8"></div>

          {/* ========================================== */}
          {/* AI STUDIO: BAB 1 */}
          {/* ========================================== */}
          <section className="bg-gradient-to-br from-[#0f172a] to-[#0a1121] rounded-2xl p-8 border border-cyan-900/50 shadow-2xl shadow-cyan-900/10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-cyan-900/50 rounded-lg border border-cyan-700/50"><BrainCircuit className="w-5 h-5 text-cyan-400"/></div>
              <h2 className="text-lg font-bold text-white tracking-wide">AI Engine: Bab 1 (Teori)</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1e293b]/50 p-5 rounded-xl border border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h3 className="text-sm font-bold text-cyan-300">1.1 Tujuan Praktikum</h3>
                  <button onClick={handleGenerateTujuan} disabled={isGeneratingTujuan || globalAiLock || cooldownSec > 0} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold text-xs transition disabled:opacity-50 flex items-center gap-2">
                    {isGeneratingTujuan ? <><Loader2 className="w-3 h-3 animate-spin"/> Menganalisis...</> : cooldownSec > 0 ? `⏳ (${cooldownSec}s)` : "Generate"}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {tujuanList.map((tujuan, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <span className="text-xs font-bold text-slate-500 w-6">1.1.{index + 1}</span>
                      <textarea value={tujuan} rows="2" onChange={(e) => { const newTujuan = [...tujuanList]; newTujuan[index] = e.target.value; setTujuanList(newTujuan); }} className="flex-1 p-3 bg-[#0B1120] border border-slate-700 rounded-xl focus:border-cyan-500 text-xs text-slate-300 outline-none" placeholder="Tujuan eksperimen..." />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-300 pl-2">1.2 Dasar Teori</h3>
                {teoriList.map((teori, index) => (
                  <div key={index} className="bg-[#1e293b]/50 p-5 rounded-xl border border-slate-700 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-xs font-bold text-slate-500">1.2.{index + 1}</span>
                        <input type="text" value={teori.judul} onChange={(e) => { const newTeori = [...teoriList]; newTeori[index].judul = e.target.value; setTeoriList(newTeori); }} className="flex-1 bg-transparent border-b border-slate-600 focus:border-cyan-400 pb-1 text-sm font-bold text-slate-200 outline-none" placeholder="Judul Subbab" />
                      </div>
                      <button onClick={() => handleGenerateTeoriSubbab(index)} disabled={loadingTeori[index] || globalAiLock || cooldownSec > 0} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition disabled:opacity-50 whitespace-nowrap flex items-center gap-2">
                        {loadingTeori[index] ? <Loader2 className="w-3 h-3 animate-spin"/> : cooldownSec > 0 ? `⏳ (${cooldownSec}s)` : "Generate"}
                      </button>
                    </div>
                    <textarea value={teori.isi} rows="6" onChange={(e) => { const newTeori = [...teoriList]; newTeori[index].isi = e.target.value; setTeoriList(newTeori); }} className="w-full p-4 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-slate-300 focus:border-cyan-500 outline-none leading-relaxed" placeholder="Narasi teori..." />
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Saran / Rekomendasi Tambahan (Opsional):</label>
                      <textarea value={teori.rekomendasi} rows="2" placeholder="Cth: [Sisipkan Gambar Grafik Linieritas di sini]"
                        className="w-full p-3 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-slate-300 focus:border-cyan-500 outline-none"
                        onChange={(e) => { const newTeori = [...teoriList]; newTeori[index].rekomendasi = e.target.value; setTeoriList(newTeori); }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>




          {/* ========================================== */}
          {/* AI STUDIO: BAB 2 */}
          {/* ========================================== */}
          <section className="bg-gradient-to-br from-[#0f172a] to-[#0a1121] rounded-2xl p-8 border border-cyan-900/50 shadow-2xl shadow-cyan-900/10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-cyan-900/50 rounded-lg border border-cyan-700/50"><LayoutDashboard className="w-5 h-5 text-cyan-400"/></div>
              <h2 className="text-lg font-bold text-white tracking-wide">AI Engine: Bab 2 (Prosedur)</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1e293b]/50 p-5 rounded-xl border border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h3 className="text-sm font-bold text-cyan-300">2.1 Pemindaian OCR</h3>
                  <button onClick={handleDetectPercobaan} disabled={isDetectingPercobaan || globalAiLock || cooldownSec > 0} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold text-xs transition disabled:opacity-50 flex items-center gap-2">
                    {isDetectingPercobaan ? <><Loader2 className="w-3 h-3 animate-spin"/> Scanning...</> : "Scan PDF"}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {percobaanList.map((p, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="text" value={p} onChange={(e)=>{const n=[...percobaanList]; n[i]=e.target.value; setPercobaanList(n)}} className="flex-1 p-3 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-slate-300 focus:border-cyan-500 outline-none" placeholder={`Percobaan ${i+1}`} />
                      <button onClick={() => setPercobaanList(percobaanList.filter((_, idx)=>idx!==i))} className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                  <button onClick={() => setPercobaanList([...percobaanList, ''])} className="text-[10px] text-cyan-500 hover:text-cyan-400 mt-2 text-left font-bold tracking-wider">+ ADD MANUAL</button>
                </div>
              </div>

              <div className="bg-[#1e293b]/50 p-5 rounded-xl border border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                  <h3 className="text-sm font-bold text-cyan-300">2.2 SOP Generation</h3>
                  <button onClick={handleGenerateProsedur} disabled={isGeneratingProsedur || percobaanList.length === 0 || globalAiLock || cooldownSec > 0} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition disabled:opacity-50 flex items-center gap-2">
                    {isGeneratingProsedur ? <><Loader2 className="w-3 h-3 animate-spin"/> Executing...</> : "Generate SOP"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">A. Deskripsi Awal</label>
                    <textarea value={prosedurData.intro || ''} rows="2" onChange={(e)=>setProsedurData({...prosedurData, intro: e.target.value})} className="w-full p-3 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-slate-300 focus:border-cyan-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">B. Persiapan Perangkat</label>
                    <textarea value={prosedurData.persiapan || ''} rows="3" onChange={(e)=>setProsedurData({...prosedurData, persiapan: e.target.value})} className="w-full p-3 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-slate-300 focus:border-cyan-500 outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">C. Eksekusi Eksperimen</label>
                    {percobaanList.map((perc, i) => (
                      <div key={i} className="relative">
                        <span className="absolute top-2 right-3 text-[9px] font-bold text-cyan-600 uppercase">Exp 0{i+1}</span>
                        <textarea value={(prosedurData.percobaan_steps && prosedurData.percobaan_steps[i]) ? prosedurData.percobaan_steps[i] : ''} rows="4" onChange={(e)=>{ const nSteps = [...(prosedurData.percobaan_steps || [])]; nSteps[i] = e.target.value; setProsedurData({...prosedurData, percobaan_steps: nSteps}); }} className="w-full p-3 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-slate-300 focus:border-cyan-500 outline-none pt-6" placeholder={`SOP ${perc}`} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">D. Terminasi Sistem</label>
                    <textarea value={prosedurData.penyelesaian || ''} rows="2" onChange={(e)=>setProsedurData({...prosedurData, penyelesaian: e.target.value})} className="w-full p-3 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-slate-300 focus:border-cyan-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* AI STUDIO: BAB 3 */}
          {/* ========================================== */}
          <section className="bg-gradient-to-br from-[#0f172a] to-[#0a1121] rounded-2xl p-8 border border-cyan-900/50 shadow-2xl shadow-cyan-900/10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-cyan-900/50 rounded-lg border border-cyan-700/50"><BarChart2 className="w-5 h-5 text-cyan-400"/></div>
              <h2 className="text-lg font-bold text-white tracking-wide">AI Engine: Bab 3 (Analisis)</h2>
            </div>
            
            {percobaanList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">Scan Percobaan di Bab 2 untuk mengaktifkan modul ini.</p>
            ) : (
              <div className="space-y-8">
                {percobaanList.map((judulPerc, expIdx) => (
                  <div key={expIdx} className="space-y-4 border-l-2 border-cyan-900/30 pl-4">
                    <h3 className="text-sm font-bold text-cyan-300 bg-[#1e293b]/50 p-3 rounded-xl border border-slate-700 inline-block px-4">
                      {expIdx + 1}. {judulPerc}
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {["Pengaruh Variabel", "Kondisi Ideal", "Hasil & Data", "Analisis Data", "Penerapan Industri"].map((label, subIdx) => (
                        <div key={subIdx} className="bg-[#1e293b]/30 p-4 rounded-xl border border-slate-700/50">
                          <div className="flex justify-between items-center mb-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">3.{expIdx+1}.{subIdx+1} {label}</label>
                            <button onClick={() => handleGenerateBab3Subbab(expIdx, subIdx)} disabled={(loadingBab3[expIdx] && loadingBab3[expIdx][subIdx]) || globalAiLock || cooldownSec > 0} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition disabled:opacity-50">
                              {(loadingBab3[expIdx] && loadingBab3[expIdx][subIdx]) ? "Processing..." : "Generate"}
                            </button>
                          </div>
                          <textarea value={(bab3Data[expIdx] && bab3Data[expIdx][subIdx]) || ''} onChange={(e) => { const newData = [...bab3Data]; if(!newData[expIdx]) newData[expIdx] = ['', '', '', '', '']; newData[expIdx][subIdx] = e.target.value; setBab3Data(newData); }} rows="5" className="w-full p-3 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-slate-300 outline-none leading-relaxed focus:border-cyan-500" placeholder="Hasil analisis..." />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ========================================== */}
          {/* AI STUDIO: BAB 4 */}
          {/* ========================================== */}
          <section className="bg-gradient-to-br from-[#0f172a] to-[#0a1121] rounded-2xl p-8 border border-cyan-900/50 shadow-2xl shadow-cyan-900/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-900/50 rounded-lg border border-cyan-700/50"><BookOpen className="w-5 h-5 text-cyan-400"/></div>
                <h2 className="text-lg font-bold text-white tracking-wide">AI Engine: Bab 4 (Penutup)</h2>
              </div>
              <button onClick={handleGenerateBab4} disabled={isGeneratingBab4 || !formData.judul_modul || percobaanList.length === 0 || globalAiLock || cooldownSec > 0} className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-lg font-bold text-xs transition disabled:opacity-50 flex items-center gap-2">
                {isGeneratingBab4 ? <><Loader2 className="w-3 h-3 animate-spin"/> Summarizing...</> : "Generate Summary"}
              </button>
            </div>
            
            <div className="space-y-4 bg-[#1e293b]/30 p-5 rounded-xl border border-slate-700/50">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Kesimpulan Global ({'{{KESIMPULAN}}'})</label>
                <textarea value={bab4Data.kesimpulan} onChange={(e) => setBab4Data({...bab4Data, kesimpulan: e.target.value})} rows="5" className="w-full p-4 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-slate-300 outline-none leading-relaxed focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Saran Pengembangan ({'{{SARAN}}'})</label>
                <textarea value={bab4Data.saran} onChange={(e) => setBab4Data({...bab4Data, saran: e.target.value})} rows="3" className="w-full p-4 bg-[#0B1120] border border-slate-700 rounded-xl text-xs text-slate-300 outline-none leading-relaxed focus:border-cyan-500" />
              </div>
            </div>
          </section>

          {/* FINAL EXECUTION BUTTON */}
          <div className="pt-8 mt-8 border-t border-slate-800">
            <button 
              onClick={handleGenerateFinal} 
              disabled={isGeneratingFinal || globalAiLock || cooldownSec > 0}
              className="w-full bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/40 transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {isGeneratingFinal ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> MENGUNCI DOKUMEN & MENGIRIM BERKAS...</>
              ) : cooldownSec > 0 ? (
                `⏳ SISTEM JEDA (${cooldownSec}s)...`
              ) : (
                '🚀 FINALISASI & CETAK LAPORAN KE GOOGLE DOCS'
              )}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
