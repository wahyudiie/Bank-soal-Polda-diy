import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabaseService } from '../services/supabaseService';
import { Question, QuestionCategory } from '../types';
import { Search, Filter, Download, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { mockService } from '../services/mockService';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = mockService.getCurrentUser()!;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [qData, cData] = await Promise.all([
          supabaseService.getQuestions(),
          supabaseService.getCategories()
        ]);
        setQuestions(qData);
        setCategories(cData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? q.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout user={user}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-[10px] sm:text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-2 sm:mb-3">Repository Access</h1>
            <h2 className="text-2xl sm:text-4xl font-black text-[#002147] tracking-tight">Katalog Bank Soal</h2>
            <p className="text-gray-500 mt-2 sm:mt-3 font-semibold text-[11px] sm:text-sm max-w-lg leading-relaxed">Akses repositori digital materi persiapan ujian kepolisian daerah daerah istimewa yogyakarta.</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-full border border-gray-100 shadow-sm overflow-x-auto whitespace-nowrap no-scrollbar max-w-full">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                selectedCategory === null ? "bg-[#002147] text-white shadow-lg" : "text-gray-400 hover:text-[#002147]"
              )}
            >
              Semua
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                  selectedCategory === cat.id ? "bg-[#002147] text-white shadow-lg" : "text-gray-400 hover:text-[#002147]"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="CARI MATERI SOAL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-14 pr-6 py-5 bg-white border border-gray-100 focus:border-blue-600 rounded-2xl text-[#002147] outline-none shadow-sm transition-all text-xs tracking-widest font-black placeholder-gray-200 uppercase"
          />
        </div>

        {/* Questions Grid */}
        {filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/quiz/${q.id}`)}
                className="group bg-white border border-gray-100 p-8 transition-all hover:border-blue-600 hover:shadow-xl hover:shadow-blue-900/5 cursor-pointer relative overflow-hidden rounded-3xl"
              >
                {/* ID Tag */}
                <div className="flex justify-between items-start mb-8">
                  <span className="text-[10px] font-mono text-blue-600 font-bold tracking-tighter bg-blue-50 px-2 py-1 rounded border border-blue-100">
                    #REF-{q.id.toUpperCase()}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 p-2 rounded-lg">
                    <Download className="w-4 h-4 text-blue-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="inline-block bg-gray-50 px-2 py-0.5 text-[9px] font-black text-gray-400 uppercase tracking-widest rounded">
                    {categories.find(c => c.id === q.categoryId)?.name || 'GENERAL'}
                  </span>
                  <h3 className="text-xl font-black text-[#002147] leading-tight group-hover:text-blue-600 transition-colors">
                    {q.title}
                  </h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 font-semibold">
                    {q.description}
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase font-black text-gray-300 tracking-widest mb-1">Upload Date</p>
                    <p className="text-[10px] font-black text-gray-500 uppercase">
                      {new Date(q.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600 font-black text-[10px] uppercase tracking-widest group/btn">
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 py-24 text-center rounded-3xl shadow-sm">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-6 h-6 text-gray-200" />
            </div>
            <h3 className="text-xs font-black text-[#002147] uppercase tracking-widest leading-none">Record Not Found</h3>
            <p className="text-gray-400 mt-3 text-[10px] font-black uppercase tracking-widest">No matching question packages in our repository.</p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
}
