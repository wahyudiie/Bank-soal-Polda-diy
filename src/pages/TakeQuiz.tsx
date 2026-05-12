import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockService } from '../services/mockService';
import { Question, QuizItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, Timer, ShieldCheck, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { ToastContainer } from '../components/Toast';
import { useNotification } from '../hooks/useNotification';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockService.getCurrentUser()!;
  const { toasts, removeToast, success, error } = useNotification();

  const [questionData, setQuestionData] = useState<Question | null>(null);
  const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [startTime, setStartTime] = useState<number>(0);
  const [resultSaved, setResultSaved] = useState(false);

  useEffect(() => {
    const questions = mockService.getQuestions();
    const found = questions.find(q => q.id === id);
    if (found) {
      if (!found.items || found.items.length < 5) {
        const dummyItems: QuizItem[] = Array.from({ length: 50 }, (_, i) => ({
          id: `${i + 1}`,
          question: `Pertanyaan ke-${i + 1}: Apa tugas pokok Polri menurut UU No. 2 Tahun 2002?`,
          options: [
            'Memelihara Kamtibmas, Menegakkan Hukum, Memberikan Perlindungan',
            'Menjaga Perbatasan dan Pertahanan Negara',
            'Melakukan Operasi Militer Selain Perang',
            'Menjaga Kedaulatan Wilayah Udara'
          ],
          correctAnswer: 0
        }));
        found.items = dummyItems;
      }
      setQuestionData(found);
    }
  }, [id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && currentStep === 'quiz') {
      finishQuiz();
    }
    return () => clearInterval(timer);
  }, [currentStep, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStartTime(Date.now());
    setCurrentStep('quiz');
  };

  const handleAnswer = (optionIdx: number) => {
    setAnswers({ ...answers, [currentIndex]: optionIdx });
  };

  const calculateScore = () => {
    if (!questionData?.items) return 0;
    let correct = 0;
    questionData.items.forEach((item, idx) => {
      if (answers[idx] === item.correctAnswer) correct++;
    });
    return Math.round((correct / questionData.items.length) * 100);
  };

  const finishQuiz = () => {
    if (!questionData || resultSaved) return;
    const score = calculateScore();
    const totalQ = questionData.items?.length || 0;
    let correct = 0;
    questionData.items?.forEach((item, idx) => {
      if (answers[idx] === item.correctAnswer) correct++;
    });
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    mockService.saveResult({
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
      questionId: questionData.id,
      questionTitle: questionData.title,
      score,
      totalQuestions: totalQ,
      correctAnswers: correct,
      timeTaken,
      status: score >= 70 ? 'LULUS' : 'TIDAK LULUS',
    });

    setResultSaved(true);
    setCurrentStep('result');

    if (score >= 70) {
      success('Ujian Selesai!', `Selamat! Anda LULUS dengan skor ${score}. Data telah dikirim ke Admin.`);
    } else {
      error('Ujian Selesai', `Skor Anda ${score}. Belum memenuhi syarat. Data telah dikirim ke Admin.`);
    }
  };

  const handleNext = () => {
    if (currentIndex < (questionData?.items?.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const totalQuestions = questionData?.items?.length || 0;
      const answeredCount = Object.keys(answers).length;
      if (answeredCount < totalQuestions) {
        if (confirm(`Anda baru menjawab ${answeredCount} dari ${totalQuestions} soal. Apakah Anda yakin ingin mengakhiri ujian?`)) {
          finishQuiz();
        }
      } else {
        finishQuiz();
      }
    }
  };

  if (!questionData) return <div className="p-20 text-center uppercase font-black tracking-widest text-gray-400">Loading Module...</div>;

  return (
    <Layout user={user}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="max-w-4xl mx-auto py-10">
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-2xl shadow-blue-900/5"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Module Assessment</span>
              </div>

              <h1 className="text-4xl font-black text-[#002147] mb-6 leading-tight">{questionData.title}</h1>
              <p className="text-gray-500 mb-10 text-lg leading-relaxed">{questionData.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-2xl text-white">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Durasi Ujian</p>
                    <p className="text-sm font-black text-[#002147]">60 MENIT</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                  <div className="bg-emerald-500 p-3 rounded-2xl text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jumlah Soal</p>
                    <p className="text-sm font-black text-[#002147]">50 PERTANYAAN</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStart}
                className="w-full py-5 bg-[#002147] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
              >
                Mulai Tes Sekarang
              </button>
            </motion.div>
          )}

          {currentStep === 'quiz' && questionData.items && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              <div className="flex-1 space-y-8">
                <div className="flex items-center justify-between bg-white px-8 py-4 rounded-full border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Soal {currentIndex + 1} / {questionData.items.length}</div>
                    <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${((currentIndex + 1) / questionData.items.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center gap-2 font-mono font-black text-sm px-4 py-1 rounded-full border",
                    timeLeft < 300 ? "text-red-500 border-red-100 bg-red-50 animate-pulse" : "text-blue-600 border-blue-100 bg-blue-50"
                  )}>
                    <Timer className="w-4 h-4" />
                    {formatTime(timeLeft)}
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-xl">
                  <h3 className="text-2xl font-black text-[#002147] leading-tight mb-12">
                    {questionData.items[currentIndex].question}
                  </h3>

                  <div className="space-y-4">
                    {questionData.items[currentIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={cn(
                          "w-full p-6 rounded-2xl border text-left transition-all duration-200 group flex items-center justify-between",
                          answers[currentIndex] === idx
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                            : "bg-gray-50 border-gray-100 text-gray-600 hover:border-blue-600 hover:bg-white"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs",
                            answers[currentIndex] === idx ? "bg-white/20 text-white" : "bg-white text-gray-400 border border-gray-100"
                          )}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="font-bold text-sm tracking-wide">{option}</span>
                        </div>
                        {answers[currentIndex] === idx && <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"><ArrowRight className="w-3 h-3" /></div>}
                      </button>
                    ))}
                  </div>

                  <div className="mt-12 flex justify-between gap-4">
                    <button
                      onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                      disabled={currentIndex === 0}
                      className={cn(
                        "px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                        currentIndex === 0 ? "bg-gray-50 text-gray-300" : "bg-gray-100 text-[#002147] hover:bg-gray-200"
                      )}
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-3 transition-all bg-[#002147] text-white hover:bg-blue-600 shadow-xl shadow-blue-900/10 active:scale-95"
                    >
                      <span>{currentIndex === questionData.items.length - 1 ? 'Selesai & Kirim' : 'Lanjutkan'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Navigation Grid */}
              <div className="w-full lg:w-80 shrink-0">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl sticky top-8">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Navigasi Soal</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {questionData.items.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                          "w-full aspect-square rounded-xl text-[10px] font-black transition-all border flex items-center justify-center",
                          currentIndex === idx
                            ? "bg-[#002147] text-white border-[#002147] scale-110 z-10 shadow-lg shadow-blue-900/20"
                            : answers[idx] !== undefined
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-gray-50 text-gray-400 border-gray-100 hover:border-blue-600"
                        )}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 space-y-3 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded bg-emerald-500" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sudah Dijawab</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded bg-gray-50 border border-gray-100" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Belum Dijawab</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded bg-[#002147]" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Posisi Sekarang</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-2xl text-center"
            >
              <div className={cn(
                "mb-10 inline-flex items-center justify-center w-24 h-24 rounded-full",
                calculateScore() >= 70 ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
              )}>
                {calculateScore() >= 70
                  ? <CheckCircle2 className="w-12 h-12" />
                  : <XCircle className="w-12 h-12" />
                }
              </div>

              <h2 className="text-3xl font-black text-[#002147] mb-2 uppercase tracking-tight">Hasil Assessment</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10">
                Data telah dikirim ke Dashboard Admin
              </p>

              <div className="bg-gray-50 rounded-[2rem] p-12 mb-12 inline-block min-w-[300px]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Skor Akhir Anda</p>
                <div className="text-7xl font-black text-[#002147] mb-4">{calculateScore()}<span className="text-3xl text-gray-300">/100</span></div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full inline-block text-[10px] font-black uppercase tracking-widest",
                  calculateScore() >= 70 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                )}>
                  {calculateScore() >= 70 ? '✓ LULUS' : '✗ TIDAK LULUS'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setAnswers({});
                    setTimeLeft(3600);
                    setResultSaved(false);
                    setCurrentStep('intro');
                  }}
                  className="py-4 border border-gray-100 text-[#002147] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Ulangi Tes
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="py-4 bg-[#002147] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
