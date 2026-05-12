import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockService } from '../services/mockService';
import { Question, User, QuestionCategory, QuizResult } from '../types';
import { 
  Plus, 
  FileText, 
  Users as UsersIcon, 
  TrendingUp, 
  Calendar, 
  Trash2, 
  Eye,
  Upload,
  Search,
  CheckCircle2,
  XCircle,
  X,
  ClipboardList,
  Award,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ToastContainer } from '../components/Toast';
import { useNotification } from '../hooks/useNotification';

// Subcomponents
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm relative group overflow-hidden">
    <div className="absolute top-0 right-0 p-2 opacity-5">
      <Icon className="w-12 h-12 text-[#002147]" />
    </div>
    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2 font-bold">{title}</p>
    <p className="text-3xl font-black text-[#002147] tracking-tight">{value}</p>
    <p className="text-[9px] text-blue-600 mt-2 uppercase tracking-widest font-black">Data Terverifikasi</p>
  </div>
);

const AdminOverview = ({ questions, users, results }: { questions: Question[], users: User[], results: QuizResult[] }) => (
  <div className="space-y-12">
    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Soal" value={questions.length} icon={FileText} />
      <StatCard title="Total User" value={users.length} icon={UsersIcon} />
      <StatCard title="Ujian Selesai" value={results.length} icon={ClipboardList} />
      <StatCard
        title="Rata-rata Skor"
        value={results.length > 0 ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0}
        icon={Award}
      />
    </div>

    {/* Recent Exam Results */}
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#002147]">Hasil Ujian Terkini</h3>
        <Link to="/admin/results" className="text-[10px] font-black tracking-widest text-blue-600 hover:underline uppercase transition-all">
          Lihat Semua
        </Link>
      </div>
      <div className="divide-y divide-gray-50">
        {results.slice(-5).reverse().map((r) => (
          <div key={r.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", r.status === 'LULUS' ? "bg-emerald-50" : "bg-red-50")}>
                {r.status === 'LULUS'
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  : <XCircle className="w-4 h-4 text-red-500" />
                }
              </div>
              <div>
                <p className="text-xs font-bold text-[#002147]">{r.userName}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{r.questionTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                r.status === 'LULUS' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
              )}>
                {r.score}/100 · {r.status}
              </span>
              <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">
                {new Date(r.completedAt).toLocaleDateString('id-ID')}
              </span>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="p-16 text-center text-gray-300 font-black uppercase tracking-[0.2em] text-[10px] italic">Belum ada ujian diselesaikan</div>
        )}
      </div>
    </div>

    {/* Recent Questions Log */}
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#002147]">Log Aktivitas Repository</h3>
        <button
          onClick={() => alert('Fitur Audit Log akan tersedia pada modul pemeliharaan sistem.')}
          className="text-[10px] font-black tracking-widest text-blue-600 hover:underline uppercase transition-all"
        >
          Audit Logs
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {questions.slice(0, 5).map((q) => (
          <div key={q.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl">
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#002147]">{q.title}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Uploader: <span className="text-blue-600">{q.uploadedBy}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black tracking-widest uppercase">{new Date(q.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {questions.length === 0 && (
          <div className="p-16 text-center text-gray-300 font-black uppercase tracking-[0.2em] text-[10px] italic">No activity detected</div>
        )}
      </div>
    </div>
  </div>
);

const ManageQuestions = ({ questions, categories, onDelete, onUpload }: any) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: categories[0]?.id || '',
    file: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      title: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
      fileName: formData.file?.name || 'document.pdf',
      fileUrl: URL.createObjectURL(formData.file!) || '#',
      uploadedBy: 'Administrator',
      items: [
        { id: '1', question: 'Apa kepanjangan dari POLRI?', options: ['Polisi Republik Indonesia', 'Kepolisian Negara Republik Indonesia', 'Persatuan Polisi RI'], correctAnswer: 1 },
        { id: '2', question: 'Di mana letak Mapolda DIY?', options: ['Sleman', 'Bantul', 'Kota Jogja'], correctAnswer: 0 }
      ]
    });
    setFormData({ title: '', description: '', categoryId: categories[0]?.id || '', file: null });
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-[#002147] tracking-tight">Manajemen Soal</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-2">Repository Registry System</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-[#002147] text-white px-8 py-4 rounded-full font-black flex items-center gap-2 shadow-lg shadow-blue-900/10 hover:bg-blue-600 transition-all active:scale-95 text-[11px] uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          <span>Tambah Soal</span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#002147]">Repository Registry</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input type="text" placeholder="CARI REF..." className="bg-white border border-gray-200 pl-8 pr-4 py-2 text-[10px] w-48 rounded-lg focus:border-blue-600 outline-none text-[#002147] font-bold tracking-widest" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <th className="px-4 sm:px-8 py-5 font-black">ID Ref</th>
                <th className="px-4 sm:px-6 py-5 font-black">Materi Soal</th>
                <th className="px-4 sm:px-6 py-5 font-black hidden md:table-cell">Category</th>
                <th className="px-4 sm:px-8 py-5 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[11px]">
              {questions.map((q: Question) => (
                <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 sm:px-8 py-5 font-mono text-blue-600 font-bold tracking-tighter">#REF-{q.id.toUpperCase().slice(0, 8)}</td>
                  <td className="px-4 sm:px-6 py-5">
                    <p className="font-black text-[#002147] tracking-wide line-clamp-1">{q.title}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">File: {q.fileName}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-5 hidden md:table-cell">
                    <span className="px-2 py-0.5 border border-gray-200 text-[9px] text-gray-500 font-black uppercase tracking-widest rounded">
                      {categories.find((c: any) => c.id === q.categoryId)?.name || 'GENERAL'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-8 py-5 text-right font-black text-[#002147] tracking-widest text-[9px]">
                    <div className="flex items-center justify-end gap-6 uppercase">
                      <button 
                        onClick={() => alert(`Membuka detail untuk materi: ${q.title}`)}
                        className="hover:text-blue-600 transition-colors"
                      >
                        Detail
                      </button>
                      <button 
                        onClick={() => onDelete(q.id)}
                        className="text-red-500 hover:text-red-600 transition-colors uppercase"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {questions.length === 0 && (
            <div className="p-24 text-center">
              <FileText className="w-12 h-12 text-gray-100 mx-auto mb-6" />
              <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">Registry Empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002147]/20 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-3xl border border-gray-100 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-xs font-black text-[#002147] uppercase tracking-[0.3em]">New Resource Authorization</h3>
                <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-white rounded-full transition-colors font-bold text-gray-400">Tutup</button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-5">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Materi Title</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold text-xs text-[#002147] tracking-widest uppercase"
                      placeholder="ENTER TITLE..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Category</label>
                      <select 
                        value={formData.categoryId}
                        onChange={e => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold text-xs text-[#002147] tracking-widest uppercase appearance-none"
                      >
                        {categories.map((c: any) => <option key={c.id} value={c.id} className="bg-white">{c.name.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Upload Berkas Soal (PDF/DOC)</label>
                      <div className="relative">
                        <input 
                          type="file"
                          required
                          onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})}
                          className="hidden"
                          id="file-upload"
                        />
                        <label 
                          htmlFor="file-upload"
                          className="w-full bg-gray-50 border border-dashed border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold text-[10px] text-blue-600 tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 hover:bg-blue-50"
                        >
                          <Upload className="w-3 h-3" />
                          {formData.file ? formData.file.name : 'PILIH BERKAS...'}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block">Detailed Specification</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold text-xs text-[#002147] h-32 resize-none tracking-widest uppercase"
                      placeholder="ENTER SPECIFICATION..."
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#002147] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-blue-600 active:scale-[0.99] transition-all mt-4 text-[11px] uppercase tracking-[0.3em]"
                >
                  Commit to Registry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ManageUsers = ({ users }: { users: User[] }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-black text-[#002147] tracking-tight">Manajemen Pengguna</h2>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-2">Personal Accreditation System</p>
      </div>
      <button 
        onClick={() => alert('Fitur Undang Personel memerlukan integrasi dengan basis data SDM.')}
        className="bg-blue-50 hover:bg-blue-100 border border-blue-100 font-black text-blue-600 px-6 py-3 rounded-full flex items-center gap-2 transition-all active:scale-95 text-[11px] uppercase tracking-widest"
      >
        <Plus className="w-4 h-4 text-blue-600" strokeWidth={3} />
        <span>Undang Personel</span>
      </button>
    </div>

    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#002147]">Active Personnel Registry</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <th className="px-8 py-5 font-black">Personnel Data</th>
              <th className="px-6 py-5 font-black">Access Authority</th>
              <th className="px-6 py-5 font-black">Identity Code</th>
              <th className="px-8 py-5 font-black text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[11px]">
            {users.map((u: User) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-[#002147] font-black text-xs uppercase tracking-tighter">
                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-black text-[#002147] tracking-wide">{u.name.toUpperCase()}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest rounded",
                    u.role === 'ADMIN' ? "border-red-100 text-red-500 bg-red-50" : "border-gray-100 text-gray-400 bg-gray-50/50"
                  )}>
                    {u.role} AUTHORITY
                  </span>
                </td>
                <td className="px-6 py-5 font-mono text-[10px] font-black text-gray-400 tracking-tighter">REF_{u.username.toUpperCase()}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-[0.2em]">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    VERIFIED
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

import { supabaseService } from '../services/supabaseService';
import { Question, User, QuestionCategory, QuizResult } from '../types';

export default function AdminDashboard() {
  const user = mockService.getCurrentUser()!;
  const location = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [prevResultCount, setPrevResultCount] = useState(0);
  const { toasts, removeToast, notification } = useNotification();

  useEffect(() => {
    refreshData();
  }, []);

  // Poll for new results every 10 seconds to simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const latest = await supabaseService.getResults();
        if (latest.length > prevResultCount && prevResultCount > 0) {
          const newest = latest[0]; // results are ordered by completed_at desc
          notification(
            `Ujian Baru Selesai!`,
            `${newest.userName} telah menyelesaikan ujian "${newest.questionTitle}" dengan skor ${newest.score}.`
          );
        }
        setPrevResultCount(latest.length);
        setResults(latest);
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [prevResultCount]);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [qData, uData, cData, rData] = await Promise.all([
        supabaseService.getQuestions(),
        supabaseService.getUsers(),
        supabaseService.getCategories(),
        supabaseService.getResults()
      ]);
      setQuestions(qData);
      setUsers(uData);
      setCategories(cData);
      setResults(rData);
      setPrevResultCount(rData.length);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
      try {
        await supabaseService.deleteQuestion(id);
        refreshData();
      } catch (err) {
        alert('Gagal menghapus soal.');
      }
    }
  };

  const handleUploadQuestion = async (data: any) => {
    try {
      await supabaseService.addQuestion(data);
      refreshData();
    } catch (err) {
      alert('Gagal mengunggah soal.');
    }
  };

  const handleDeleteResult = async (id: string) => {
    if (confirm('Hapus data hasil ujian ini?')) {
      try {
        await supabaseService.deleteResult(id);
        refreshData();
      } catch (err) {
        alert('Gagal menghapus hasil ujian.');
      }
    }
  };

  return (
    <Layout user={user}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<AdminOverview questions={questions} users={users} results={results} />} />
            <Route path="/questions" element={<ManageQuestions questions={questions} categories={categories} onDelete={handleDeleteQuestion} onUpload={handleUploadQuestion} />} />
            <Route path="/users" element={<ManageUsers users={users} />} />
            <Route path="/results" element={<ExamResults results={results} onDelete={handleDeleteResult} onRefresh={refreshData} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

function ExamResults({ results, onDelete, onRefresh }: { results: QuizResult[], onDelete: (id: string) => void, onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'LULUS' | 'TIDAK LULUS'>('ALL');

  const filtered = results
    .filter(r => filterStatus === 'ALL' || r.status === filterStatus)
    .filter(r =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.questionTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.userUsername.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  const avgScore = results.length > 0 ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0;
  const lulusCount = results.filter(r => r.status === 'LULUS').length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#002147] tracking-tight">Hasil Ujian Personel</h2>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-2">Exam Results Management System</p>
        </div>
        <button onClick={onRefresh} className="bg-blue-50 hover:bg-blue-100 border border-blue-100 font-black text-blue-600 px-6 py-3 rounded-full text-[11px] uppercase tracking-widest transition-all flex items-center gap-2">
          <Bell className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Total Ujian</p>
          <p className="text-3xl font-black text-[#002147]">{results.length}</p>
        </div>
        <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
          <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1">Lulus</p>
          <p className="text-3xl font-black text-emerald-600">{lulusCount} <span className="text-sm text-gray-400">/ {results.length}</span></p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Rata-rata Skor</p>
          <p className="text-3xl font-black text-[#002147]">{avgScore}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between bg-gray-50/30">
          <div className="flex gap-2">
            {(['ALL', 'LULUS', 'TIDAK LULUS'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                  filterStatus === s
                    ? "bg-[#002147] text-white border-[#002147]"
                    : "bg-white text-gray-400 border-gray-200 hover:border-[#002147]"
                )}
              >
                {s === 'ALL' ? 'Semua' : s}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder="CARI NAMA / SOAL..."
              className="bg-white border border-gray-200 pl-8 pr-4 py-2 text-[10px] w-56 rounded-lg focus:border-blue-600 outline-none text-[#002147] font-bold tracking-widest"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <th className="px-4 sm:px-8 py-5 font-black">Personel</th>
                <th className="px-4 sm:px-6 py-5 font-black hidden sm:table-cell">Modul Ujian</th>
                <th className="px-4 sm:px-6 py-5 font-black">Skor</th>
                <th className="px-4 sm:px-6 py-5 font-black hidden lg:table-cell">Status</th>
                <th className="px-4 sm:px-6 py-5 font-black hidden md:table-cell">Waktu</th>
                <th className="px-4 sm:px-8 py-5 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[11px]">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-black text-[#002147] tracking-wide">{r.userName.toUpperCase()}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">@{r.userUsername}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-[#002147]">{r.questionTitle}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                      {r.correctAnswers}/{r.totalQuestions} benar · {Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xl font-black text-[#002147]">{r.score}</span>
                    <span className="text-gray-300 text-sm">/100</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      r.status === 'LULUS'
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-red-50 text-red-600 border-red-100"
                    )}>
                      {r.status === 'LULUS' ? '✓ ' : '✗ '}{r.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    {new Date(r.completedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => onDelete(r.id)}
                      className="text-red-400 hover:text-red-600 transition-colors text-[9px] font-black uppercase tracking-widest"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-24 text-center">
              <ClipboardList className="w-12 h-12 text-gray-100 mx-auto mb-6" />
              <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">Belum ada data hasil ujian</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

