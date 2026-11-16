import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  BookOpen, 
  School, 
  PlusCircle, 
  Trash2, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  ChevronDown,
  Check,
  Lock,
  Printer,
  Copy,
  Search,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

// Path gambar background banner yang diunggah pengguna
const BANNER_BG = 'banner-bg.png';

// Daftar Guru Resmi (47 Guru Sekolah / Madrasah)
const DAFTAR_GURU = [
  'Abdur Rouf, S.Pd.I',
  'Ade Ayu Nur Tantri, S.Pd',
  'Aeni Afthina,S.Pd',
  'Ahmad Farid, S.Pd.I',
  'Ahmad Syafi, S.Hi',
  'Ahmad Syamsul Falah, S.Pd',
  'Aini Lutfiyah S.Pd.I',
  'Anis Masrufatun Saadah, S.Pd.Si',
  'Apris Dwi Priyatomo, S.Pd.',
  'Ayu Rosalita, S.Pd',
  'Baeny Abdul Fatah, S.Pd.',
  'Deny Prabowo, S.Pd',
  'Detty Turisha Wigunanti, S.Pd.',
  'Dewi Rachmawati, S.Pd',
  'Dra. Titin Sofiyatin',
  'Ella Lintang Agustin, S.Pd.',
  'Eny Erlina, S.Pd',
  'Ethik Rahmawati, S.Pd',
  'Etik Sulistyo Ratri',
  'Hariyanto, S.Pd. M.Pd',
  'Ismatul Maula, S.Pd.',
  'Khasanah, S.Ag',
  'Khodijatul Kubro',
  'M. Aziz Himawan Akbar, S.Pd., M.Pd.',
  'Mochammad Aqil Mahfudz, S.Pd.I',
  'Mohammad Azamin S Pd. I',
  'Muhammad Akvin Syarifudin',
  'Muhdi,S.Pd.I',
  'Mukhamad Aris, S.Kom',
  'Mustofa S.Ag',
  'Muzakky Miftah, Se.',
  'Nasarudin,A.Md',
  'Nopriyani, S.Kom',
  'Nur Azizah S.Pd.I',
  'Nur Khikmah S.Pd.',
  'Ragil Susyanto,S.Pd',
  'Ramdloni, S.Ag',
  'Retno Fajar Intami, S.Pd',
  'Ridlo Alam Nan Asa,S.Pdi',
  'Rizqi Yuni Arsih, S.Pd',
  'Silvia Tindiyah Sugiarto, S.Pd.',
  'Siti Isyuniati, S.Pd',
  'Siti Nurjanah,S.Pd',
  'Tuti Alawiyah, S. Pd.',
  'Wawan Erawan, S.Ag',
  'Yulita Listia Sari, S.Pd',
  'Sudiyanto, SE'
];

// Master Mata Pelajaran
const MASTER_MAPEL = [
  { id: 1, nama: 'Pendidikan Agama Islam', isParent: true, induk: '' },
  { id: 2, nama: 'Al Qur`an Hadis', isParent: false, induk: 'PAI' },
  { id: 3, nama: 'Akidah Akhlak', isParent: false, induk: 'PAI' },
  { id: 4, nama: 'Fikih', isParent: false, induk: 'PAI' },
  { id: 5, nama: 'Sejarah Kebudayaan Islam', isParent: false, induk: 'PAI' },
  { id: 6, nama: 'Bahasa Arab', isParent: false, induk: '' },
  { id: 7, nama: 'Pendidikan Pancasila', isParent: false, induk: '' },
  { id: 8, nama: 'Bahasa Indonesia', isParent: false, induk: '' },
  { id: 9, nama: 'Matematika', isParent: false, induk: '' },
  { id: 10, nama: 'Ilmu Pengetahuan Alam', isParent: false, induk: '' },
  { id: 11, nama: 'Ilmu Pengetahuan Sosial', isParent: false, induk: '' },
  { id: 12, nama: 'Bahasa Inggris', isParent: false, induk: '' },
  { id: 13, nama: 'Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)', isParent: false, induk: '' },
  { id: 14, nama: 'Informatika', isParent: false, induk: '' },
  { id: 15, nama: 'Seni Budaya / Prakarya', isParent: false, induk: '' },
  { id: 16, nama: 'Muatan Lokal', isParent: true, induk: '' },
  { id: 17, nama: 'Bahasa Daerah', isParent: false, induk: 'MULOK' },
  { id: 18, nama: 'Ke-Nu-An', isParent: false, induk: '' },
];

const DAFTAR_MAPEL_INPUT = MASTER_MAPEL.filter(m => !m.isParent).map(m => m.nama);
const TINGKAT_LIST = ['VII', 'VIII', 'IX'];

const KELAS_MAP = {
  'VII': ['VII.A', 'VII.B', 'VII.C', 'VII.D', 'VII.E'],
  'VIII': ['VIII.A', 'VIII.B', 'VIII.C', 'VIII.D', 'VIII.E'],
  'IX': ['IX.A', 'IX.B', 'IX.C', 'IX.D', 'IX.E', 'IX.F', 'IX.G']
};

const ALL_KELAS = [
  ...KELAS_MAP['VII'],
  ...KELAS_MAP['VIII'],
  ...KELAS_MAP['IX']
];

const DEFAULT_PIN_ADMIN = '1977';
const GOOGLE_SCRIPT_URL = '';

/**
 * Tema Warna Kelas:
 * - Kelas 7: HIJAU
 * - Kelas 8: UNGU
 * - Kelas 9: PINK
 */
function getKelasTheme(kelasStr) {
  if (kelasStr.startsWith('VII.') || kelasStr.startsWith('7')) {
    return {
      tingkat: 'VII',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      activeBox: 'bg-emerald-600 border-emerald-600 text-white shadow-sm ring-2 ring-emerald-200',
      hoverBox: 'hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-700',
      checkSquare: 'text-emerald-700'
    };
  }
  if (kelasStr.startsWith('VIII.') || kelasStr.startsWith('8')) {
    return {
      tingkat: 'VIII',
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
      activeBox: 'bg-purple-600 border-purple-600 text-white shadow-sm ring-2 ring-purple-200',
      hoverBox: 'hover:border-purple-400 hover:bg-purple-50/40 text-slate-700',
      checkSquare: 'text-purple-700'
    };
  }
  return {
    tingkat: 'IX',
    badge: 'bg-pink-100 text-pink-800 border-pink-300',
    activeBox: 'bg-pink-600 border-pink-600 text-white shadow-sm ring-2 ring-pink-200',
    hoverBox: 'hover:border-pink-400 hover:bg-pink-50/40 text-slate-700',
    checkSquare: 'text-pink-700'
  };
}

function normalizeName(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[`'\s\(\)\.\/\-_]/g, '');
}

function normalizeKelas(str) {
  if (!str) return '';
  let clean = str.trim().toUpperCase().replace(/\s+/g, '');
  clean = clean.replace(/^9([A-G])$/, 'IX.$1');
  clean = clean.replace(/^8([A-E])$/, 'VIII.$1');
  clean = clean.replace(/^7([A-E])$/, 'VII.$1');
  clean = clean.replace(/^IX([A-G])$/, 'IX.$1');
  clean = clean.replace(/^VIII([A-E])$/, 'VIII.$1');
  clean = clean.replace(/^VII([A-E])$/, 'VII.$1');
  return clean;
}

/**
 * Komponen Pemilih Kelas Multi-Select Centrang
 */
function MultiSelectKelas({ selectedKelas = [], onChange, isRequired = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Semua');

  const toggleKelas = (kelas) => {
    if (selectedKelas.includes(kelas)) {
      onChange(selectedKelas.filter(k => k !== kelas));
    } else {
      onChange([...selectedKelas, kelas]);
    }
  };

  const filteredKelas = activeTab === 'Semua' 
    ? ALL_KELAS 
    : (KELAS_MAP[activeTab] || []);

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[46px] px-3.5 py-2 bg-white border rounded-xl text-left flex items-center justify-between transition ${
          isOpen ? 'ring-2 ring-slate-400 border-slate-400' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <div className="flex-1 flex flex-wrap gap-1.5 items-center mr-2">
          {selectedKelas.length === 0 ? (
            <span className="text-sm text-slate-400">
              -- Centang Kelas (Bisa &gt; 1) -- {isRequired && <span className="text-rose-500">*</span>}
            </span>
          ) : (
            selectedKelas.map(k => {
              const theme = getKelasTheme(k);
              return (
                <span 
                  key={k} 
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${theme.badge}`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                  {k}
                </span>
              );
            })
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
          {selectedKelas.length > 0 && (
            <span className="text-[11px] font-bold bg-slate-800 text-white rounded-full px-1.5 py-0.2">
              {selectedKelas.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-slate-700' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-2.5 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('Semua')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  activeTab === 'Semua' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Semua
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('VII')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'VII' 
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-300' 
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Kelas 7</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('VIII')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'VIII' 
                    ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-300' 
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Kelas 8</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('IX')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'IX' 
                    ? 'bg-pink-600 text-white shadow-sm ring-1 ring-pink-300' 
                    : 'bg-pink-50 text-pink-800 hover:bg-pink-100 border border-pink-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span>Kelas 9</span>
              </button>
            </div>

            {selectedKelas.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
            {filteredKelas.map((kelas) => {
              const isChecked = selectedKelas.includes(kelas);
              const theme = getKelasTheme(kelas);

              return (
                <label
                  key={kelas}
                  onClick={() => toggleKelas(kelas)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold cursor-pointer select-none transition active:scale-95 ${
                    isChecked
                      ? theme.activeBox
                      : `bg-white border-slate-300 ${theme.hoverBox}`
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center transition ${
                    isChecked 
                      ? `bg-white ${theme.checkSquare}` 
                      : 'border border-slate-400 bg-slate-50'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                  </div>
                  <span className="text-sm font-bold">{kelas}</span>
                </label>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="py-1.5 px-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Selesai ({selectedKelas.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Halaman Rekapitulasi Admin
 */
function AdminRekapTable({ history, onBack, onGenerateMockData, onClearData }) {
  const [selectedTingkat, setSelectedTingkat] = useState('IX');
  const [selectedKelas, setSelectedKelas] = useState('IX.A');
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleTingkatChange = (newTingkat) => {
    setSelectedTingkat(newTingkat);
    const list = KELAS_MAP[newTingkat] || [];
    if (list.length > 0) setSelectedKelas(list[0]);
  };

  const mapelGuruMapping = useMemo(() => {
    const result = {};
    const targetKelasNormalized = normalizeKelas(selectedKelas);

    history.forEach(item => {
      [1, 2, 3].forEach(num => {
        const mapelField = item[`mata_pelajaran_${num}`];
        const kelasField = item[`kelas_${num}`];

        if (mapelField && kelasField) {
          const classesInSlot = kelasField.split(',').map(s => normalizeKelas(s));
          if (classesInSlot.includes(targetKelasNormalized)) {
            const normMapel = normalizeName(mapelField);
            result[normMapel] = {
              guru: item.nama_guru,
              id_jurnal: item.id_jurnal
            };
          }
        }
      });
    });

    return result;
  }, [history, selectedKelas]);

  const displayedRows = useMemo(() => {
    if (!searchQuery) return MASTER_MAPEL;
    const q = searchQuery.toLowerCase();
    return MASTER_MAPEL.filter(m => 
      m.nama.toLowerCase().includes(q) || 
      (m.induk && m.induk.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleCopyTable = () => {
    let tsv = `Rekap Mengajar Kelas: ${selectedKelas}\n`;
    tsv += 'No\tMata Pelajaran\tInduk\tGuru\n';

    displayedRows.forEach((row, idx) => {
      if (row.isParent) {
        tsv += `${idx + 1}\t${row.nama}\t\t\n`;
      } else {
        const match = mapelGuruMapping[normalizeName(row.nama)];
        const guruText = match ? match.guru : '-';
        tsv += `${idx + 1}\t${row.nama}\t${row.induk}\t${guruText}\n`;
      }
    });

    navigator.clipboard.writeText(tsv).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const handleExportExcel = () => {
    let csv = `data:text/csv;charset=utf-8,No,Mata Pelajaran,Induk,Guru\n`;
    displayedRows.forEach((row, idx) => {
      const match = mapelGuruMapping[normalizeName(row.nama)];
      const guruName = match ? `"${match.guru}"` : '""';
      csv += `"${idx + 1}","${row.nama}","${row.induk || ''}",${guruName}\n`;
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `Jurnal_Kelas_${selectedKelas}.csv`;
    link.click();
  };

  const totalMapelTerisi = Object.keys(mapelGuruMapping).length;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden font-sans text-slate-800 animate-fadeIn">
      
      {/* Top Banner Admin */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="py-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Form Guru</span>
          </button>
          <h1 className="text-sm sm:text-base font-bold flex items-center gap-2">
            <School className="w-4 h-4 text-emerald-400" />
            Sistem Jurnal Mengajar & Pembagian Guru per Kelas
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {history.length === 0 && (
            <button
              type="button"
              onClick={onGenerateMockData}
              className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded transition flex items-center gap-1 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Isi Contoh Data</span>
            </button>
          )}

          <div className="text-xs bg-slate-800 px-3 py-1 rounded border border-slate-700">
            Terisi: <b className="text-emerald-400">{totalMapelTerisi} Mapel</b> di Kelas {selectedKelas}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Filter Bar Atas: Tingkat & Kelas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pb-3 border-b border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Tingkat
            </label>
            <div className="relative">
              <select
                value={selectedTingkat}
                onChange={(e) => handleTingkatChange(e.target.value)}
                className="w-full h-9 pl-3 pr-8 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                {TINGKAT_LIST.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Kelas
            </label>
            <div className="relative">
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full h-9 pl-3 pr-8 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                {(KELAS_MAP[selectedTingkat] || []).map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Toolbar: Copy, Print, Excel, Show Entries, Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyTable}
              className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm active:bg-slate-200"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>{copyFeedback ? 'Tersalin!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm active:bg-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-2.5 py-1.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm active:bg-slate-200"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel</span>
            </button>

            <div className="flex items-center gap-1 ml-2 text-xs text-slate-600">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="h-7 border border-slate-300 rounded px-1.5 bg-white text-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mapel..."
              className="h-7 w-40 sm:w-48 px-2 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* TABEL DATA */}
        <div className="border border-slate-300 rounded overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-300 divide-x divide-slate-200 select-none">
                <th className="py-2.5 px-3 w-12 text-center text-slate-400">#</th>
                <th className="py-2.5 px-4 font-bold text-slate-800">
                  <div className="flex items-center justify-between">
                    <span>Mata Pelajaran</span>
                    <span className="text-slate-400 text-[10px]">▲▼</span>
                  </div>
                </th>
                <th className="py-2.5 px-4 w-28 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>Induk</span>
                    <span className="text-slate-400 text-[10px]">▲▼</span>
                  </div>
                </th>
                <th className="py-2.5 px-4 font-bold text-slate-800">
                  <div className="flex items-center justify-between">
                    <span>Guru</span>
                    <span className="text-slate-400 text-[10px]">▲▼</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {displayedRows.slice(0, entriesPerPage).map((row, idx) => {
                const matchCheckIn = !row.isParent ? mapelGuruMapping[normalizeName(row.nama)] : null;
                const isFilled = Boolean(matchCheckIn);

                if (row.isParent) {
                  return (
                    <tr key={row.id} className="bg-slate-50 font-bold text-slate-800 divide-x divide-slate-200">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{row.nama}</td>
                      <td className="py-2.5 px-4 text-center text-slate-400"></td>
                      <td className="py-2.5 px-4 bg-slate-50/50"></td>
                    </tr>
                  );
                }

                const isSubItem = row.induk === 'PAI' || row.induk === 'MULOK';

                return (
                  <tr 
                    key={row.id} 
                    className={`divide-x divide-slate-200 transition-colors ${
                      isFilled 
                        ? 'bg-emerald-50/40 hover:bg-emerald-50/70' 
                        : idx % 2 === 0 ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                      {idx + 1}
                    </td>

                    <td className={`py-2.5 px-4 ${isSubItem ? 'pl-8 italic text-slate-700' : 'font-medium text-slate-800'}`}>
                      {row.nama}
                    </td>

                    <td className="py-2.5 px-4 text-center text-slate-600 font-medium">
                      {row.induk || ''}
                    </td>

                    <td className="py-2 px-4">
                      {isFilled ? (
                        <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-emerald-300 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                          <span className="font-bold text-emerald-950 text-xs">
                            {matchCheckIn.guru}
                          </span>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            disabled
                            className="w-full h-8 pl-3 pr-6 bg-slate-50 border border-slate-300 rounded text-xs text-slate-400 appearance-none cursor-not-allowed"
                          >
                            <option>-Pilih Guru-</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2">
          <div>
            Menampilkan 1 sampai {Math.min(entriesPerPage, displayedRows.length)} dari {displayedRows.length} entries
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-semibold">
              ● Hijau: Guru sudah melakukan presensi di kelas ini
            </span>
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearData}
                className="text-rose-500 hover:text-rose-700 font-medium underline"
              >
                Hapus Data Rekap
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function App() {
  const [appMode, setAppMode] = useState('guru');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Form Guru States
  const [namaGuru, setNamaGuru] = useState('');
  const [slotMapel, setSlotMapel] = useState([
    { id: 1, mapel: '', kelas: [] }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [submissionHistory, setSubmissionHistory] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('riwayat_mengajar_guru');
      if (saved) setSubmissionHistory(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleOpenAdmin = () => {
    setPinInput('');
    setPinError('');
    setShowPinModal(true);
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput === DEFAULT_PIN_ADMIN) {
      setShowPinModal(false);
      setAppMode('admin');
    } else {
      setPinError('PIN salah! Silakan coba lagi.');
    }
  };

  const handleTambahSlot = () => {
    if (slotMapel.length < 3) {
      setSlotMapel(prev => [...prev, { id: prev.length + 1, mapel: '', kelas: [] }]);
    }
  };

  const handleHapusSlot = (idxToRemove) => {
    if (slotMapel.length > 1) {
      const updated = slotMapel
        .filter((_, idx) => idx !== idxToRemove)
        .map((item, idx) => ({ ...item, id: idx + 1 }));
      setSlotMapel(updated);
    }
  };

  const handleUpdateSlot = (index, field, value) => {
    setSlotMapel(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!namaGuru) {
      triggerToast('Pilih Nama Guru terlebih dahulu!', 'error');
      return;
    }

    if (!slotMapel[0].mapel || slotMapel[0].kelas.length === 0) {
      triggerToast('Mata Pelajaran 1 dan minimal 1 Kelas wajib diisi!', 'error');
      return;
    }

    setIsSubmitting(true);

    const idJurnal = typeof crypto.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : 'jrnl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

    const timestamp = new Date().toISOString();
    const formatKelas = (arr) => (Array.isArray(arr) && arr.length > 0 ? arr.join(', ') : '');

    const payload = {
      id_jurnal: idJurnal,
      timestamp: timestamp,
      nama_guru: namaGuru,
      mata_pelajaran_1: slotMapel[0].mapel,
      kelas_1: formatKelas(slotMapel[0].kelas),
      mata_pelajaran_2: slotMapel[1] ? slotMapel[1].mapel : '',
      kelas_2: slotMapel[1] ? formatKelas(slotMapel[1].kelas) : '',
      mata_pelajaran_3: slotMapel[2] ? slotMapel[2].mapel : '',
      kelas_3: slotMapel[2] ? formatKelas(slotMapel[2].kelas) : '',
    };

    try {
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const currentHistory = JSON.parse(localStorage.getItem('riwayat_mengajar_guru') || '[]');
      const updatedHistory = [payload, ...currentHistory];
      localStorage.setItem('riwayat_mengajar_guru', JSON.stringify(updatedHistory));
      setSubmissionHistory(updatedHistory);

      triggerToast('Presensi mengajar berhasil disimpan!', 'success');
      setNamaGuru('');
      setSlotMapel([{ id: 1, mapel: '', kelas: [] }]);

    } catch (error) {
      console.error('Submission error:', error);
      triggerToast('Terjadi kendala saat menyimpan. Coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateMockData = () => {
    const today = new Date().toISOString().split('T')[0];
    const mockList = [
      {
        id_jurnal: 'mock-1',
        timestamp: `${today}T07:15:00.000Z`,
        nama_guru: 'Abdur Rouf, S.Pd.I',
        mata_pelajaran_1: 'Fikih',
        kelas_1: 'IX.A, IX.B',
        mata_pelajaran_2: '',
        kelas_2: '',
        mata_pelajaran_3: '',
        kelas_3: ''
      },
      {
        id_jurnal: 'mock-2',
        timestamp: `${today}T08:30:00.000Z`,
        nama_guru: 'Ahmad Farid, S.Pd.I',
        mata_pelajaran_1: 'Al Qur`an Hadis',
        kelas_1: 'IX.A',
        mata_pelajaran_2: '',
        kelas_2: '',
        mata_pelajaran_3: '',
        kelas_3: ''
      },
      {
        id_jurnal: 'mock-3',
        timestamp: `${today}T09:45:00.000Z`,
        nama_guru: 'Ragil Susyanto,S.Pd',
        mata_pelajaran_1: 'Bahasa Daerah',
        kelas_1: 'IX.A',
        mata_pelajaran_2: '',
        kelas_2: '',
        mata_pelajaran_3: '',
        kelas_3: ''
      },
      {
        id_jurnal: 'mock-4',
        timestamp: `${today}T10:30:00.000Z`,
        nama_guru: 'Ahmad Syafi, S.Hi',
        mata_pelajaran_1: 'Ke-Nu-An',
        kelas_1: 'IX.A',
        mata_pelajaran_2: '',
        kelas_2: '',
        mata_pelajaran_3: '',
        kelas_3: ''
      },
      {
        id_jurnal: 'mock-5',
        timestamp: `${today}T11:15:00.000Z`,
        nama_guru: 'Dra. Titin Sofiyatin',
        mata_pelajaran_1: 'Bahasa Indonesia',
        kelas_1: 'IX.A',
        mata_pelajaran_2: '',
        kelas_2: '',
        mata_pelajaran_3: '',
        kelas_3: ''
      }
    ];

    localStorage.setItem('riwayat_mengajar_guru', JSON.stringify(mockList));
    setSubmissionHistory(mockList);
    triggerToast('Contoh data mengajar berhasil dimuat!', 'success');
  };

  const handleClearData = () => {
    if (window.confirm('Hapus seluruh riwayat lokal di perangkat ini?')) {
      localStorage.removeItem('riwayat_mengajar_guru');
      setSubmissionHistory([]);
      triggerToast('Data riwayat dibersihkan.', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-4 px-3 sm:px-6 flex flex-col justify-between">
      
      {/* Toast Alert */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-sm transition-all duration-300">
          <div className={`p-4 rounded-xl shadow-xl flex items-center space-x-3 text-white ${
            toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            )}
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Modal PIN Admin */}
      {showPinModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-center font-bold text-slate-800 text-base">Akses Halaman Admin</h2>
            <p className="text-center text-xs text-slate-500 mb-4 mt-0.5">
              Masukkan PIN Keamanan Admin
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-3">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN"
                autoFocus
                className="w-full text-center tracking-widest text-lg font-bold h-11 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700"
              />

              {pinError && (
                <p className="text-[11px] text-rose-600 font-semibold text-center">{pinError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl"
                >
                  Buka Rekap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODE ADMIN: TABEL REKAP */}
      {appMode === 'admin' ? (
        <AdminRekapTable
          history={submissionHistory}
          onBack={() => setAppMode('guru')}
          onGenerateMockData={handleGenerateMockData}
          onClearData={handleClearData}
        />
      ) : (

      /* ========================================================= */
      /* MODE GURU: FORMULIR DENGAN BACKGROUND GAMBAR ATAS & BAWAH */
      /* ========================================================= */
      <main className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* BAGIAN ATAS: Header dengan Background Gambar Unggahan */}
        <header className="relative p-5 overflow-hidden border-b border-slate-200">
          {/* Background Image Banner */}
          <img 
            src={BANNER_BG} 
            alt="Banner Atas" 
            className="absolute inset-0 w-full h-full object-cover object-center" 
          />
          {/* Soft Glass Overlay agar teks kontras dan terbaca jelas */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1.5px]"></div>

          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 drop-shadow-xs">
                Data Mengajar Guru
              </h1>
            </div>
            
            <button
              type="button"
              onClick={handleOpenAdmin}
              className="py-1.5 px-3 rounded-xl bg-slate-900/85 hover:bg-slate-900 active:bg-black text-white text-xs flex items-center gap-1.5 transition font-bold shadow-md border border-white/40"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Rekap</span>
            </button>
          </div>
        </header>

        {/* Form Guru */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* 1. Nama Guru */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-700" />
              Nama Guru <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={namaGuru}
                onChange={(e) => setNamaGuru(e.target.value)}
                required
                className="w-full h-12 pl-3.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:bg-white transition appearance-none"
              >
                <option value="">-- Pilih Nama Guru ({DAFTAR_GURU.length} Guru) --</option>
                {DAFTAR_GURU.map((guru) => (
                  <option key={guru} value={guru}>{guru}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-4">
            {slotMapel.map((item, idx) => (
              <div 
                key={item.id} 
                className={`p-3.5 rounded-xl border transition-all ${
                  idx === 0 
                    ? 'bg-slate-50/80 border-slate-200' 
                    : 'bg-slate-100/70 border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-bold">
                      {item.id}
                    </span>
                    {idx === 0 ? 'Mata Pelajaran & Kelas Utama' : `Mata Pelajaran & Kelas ke-${item.id}`}
                  </span>
                  
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleHapusSlot(idx)}
                      className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Mapel */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-700" />
                      Mata Pelajaran {idx === 0 && <span className="text-rose-500">*</span>}
                    </label>
                    <div className="relative">
                      <select
                        value={item.mapel}
                        onChange={(e) => handleUpdateSlot(idx, 'mapel', e.target.value)}
                        required={idx === 0}
                        className="w-full h-11 pl-3.5 pr-10 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 transition appearance-none"
                      >
                        <option value="">-- Pilih Mata Pelajaran --</option>
                        {DAFTAR_MAPEL_INPUT.map((mapel) => (
                          <option key={mapel} value={mapel}>{mapel}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Kelas Centrang (Warna: 7 = Hijau, 8 = Ungu, 9 = Pink) */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                        <School className="w-3.5 h-3.5 text-slate-700" />
                        Kelas {idx === 0 && <span className="text-rose-500">*</span>}
                      </label>
                      <div className="flex items-center gap-1 text-[10px] font-bold">
                        <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">7 Hijau</span>
                        <span className="text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">8 Ungu</span>
                        <span className="text-pink-700 bg-pink-100 px-1.5 py-0.2 rounded">9 Pink</span>
                      </div>
                    </div>

                    <MultiSelectKelas 
                      selectedKelas={item.kelas} 
                      onChange={(newKelasList) => handleUpdateSlot(idx, 'kelas', newKelasList)}
                      isRequired={idx === 0}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Sekunder Tambah Mapel/Kelas Lain */}
          {slotMapel.length < 3 && (
            <button
              type="button"
              onClick={handleTambahSlot}
              className="w-full py-2.5 px-3 border-2 border-dashed border-slate-300 hover:border-slate-500 bg-slate-50/60 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              <PlusCircle className="w-4 h-4 text-slate-700" />
              <span>+ Tambah Kelas / Mapel Lain (Maks. 3)</span>
            </button>
          )}

          {/* BAGIAN BAWAH: Tombol Simpan Presensi dengan Background Gambar Unggahan */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative overflow-hidden w-full py-3.5 px-4 rounded-xl font-black text-slate-900 text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition border border-slate-300 group ${
              isSubmitting ? 'cursor-not-allowed opacity-75' : ''
            }`}
          >
            {/* Background Image di Tombol */}
            <img 
              src={BANNER_BG} 
              alt="Banner Tombol" 
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
            />
            {/* Soft Glass Tint */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] group-hover:bg-white/45 transition"></div>

            <div className="relative z-10 flex items-center justify-center gap-2 text-slate-900 font-extrabold tracking-wide drop-shadow-xs">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan Jurnal...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 text-slate-900" />
                  <span>Simpan</span>
                </>
              )}
            </div>
          </button>
        </form>

        {/* BAGIAN BAWAH: Footer Card dengan Background Gambar */}
        <div className="relative overflow-hidden p-3.5 border-t border-slate-200 flex justify-between items-center text-xs">
          <img 
            src={BANNER_BG} 
            alt="Banner Footer" 
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70" 
          />
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]"></div>

          <div className="relative z-10 flex justify-between items-center w-full">
            <span className="text-slate-800 font-semibold">Tersimpan {submissionHistory.length} check-in</span>
            <button
              type="button"
              onClick={handleOpenAdmin}
              className="text-slate-900 font-extrabold hover:underline flex items-center gap-1 bg-white/90 px-2.5 py-1 rounded-lg border border-slate-300 shadow-xs"
            >
              <span>Buka Tabel Rekap</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </main>
      )}

      <footer className="w-full max-w-4xl mx-auto mt-4 text-center text-[11px] text-slate-500">
        Aplikasi Formulir & Rekap Pembagian Mengajar Guru
      </footer>
    </div>
  );
}
