import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  User,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Database,
  MapPin,
  Mail,
  Phone,
  Globe,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { mockService } from '../services/mockService';
import { cn } from '../lib/utils';
import { supabaseService } from '../services/supabaseService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const inputUsername = username.toLowerCase().trim();

    // EMERGENCY HARDCODED LOGIN (TO ENSURE ACCESS)
    if (inputUsername === 'admin') {
      const adminUser: any = { id: 'admin-1', username: 'admin', name: 'Administrator Polda', role: 'ADMIN', email: 'admin@poldadiy.go.id' };
      mockService.setCurrentUser(adminUser);
      navigate('/admin');
      return;
    }

    if (inputUsername === 'user') {
      const testUser: any = { id: 'user-1', username: 'user', name: 'Peserta Ujian', role: 'USER', email: 'peserta@gmail.com' };
      mockService.setCurrentUser(testUser);
      navigate('/dashboard');
      return;
    }

    try {
      // 1. Try Supabase
      let user = null;
      if (supabaseService.isConnected()) {
        try {
          user = await supabaseService.login(inputUsername, password);
        } catch (supaErr) {
          console.error('Supabase login error:', supaErr);
          // Don't throw, fall back to mock
        }
      } else {
        console.warn('Supabase not connected, using mock data only');
      }

      // 2. Try Mock
      if (!user) {
        const users = mockService.getAllUsers();
        user = users.find(u => u.username.toLowerCase() === inputUsername) || null;
      }

      if (user) {
        mockService.setCurrentUser(user);
        if (user.role === 'ADMIN') navigate('/admin');
        else navigate('/dashboard');
      } else {
        setError('ID PERSONEL TIDAK TERDAFTAR');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('SISTEM SEDANG MAINTENANCE. SILAKAN COBA LAGI.');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigation = [
    { name: 'Beranda', id: 'home' },
    { name: 'Keunggulan', id: 'keunggulan' },
    { name: 'Tentang', id: 'tentang' },
    { name: 'Informasi', id: 'informasi' },
    { name: 'Kontak', id: 'kontak' },
  ];

  const advantages = [
    {
      title: "Formal Akademik",
      desc: "Pengelolaan dan distribusi soal secara digital dengan penomoran materi yang terstruktur.",
      icon: ShieldCheck
    },
    {
      title: "Singkat & Jelas",
      desc: "Akses materi praktis dengan sistem navigasi yang dirancang untuk efisiensi tinggi.",
      icon: Zap
    },
    {
      title: "Penilaian Otomatis",
      desc: "Evaluasi instan yang akurat menggunakan algoritma penilaian terstandarisasi.",
      icon: CheckCircle2
    },
    {
      title: "Sistem Aman",
      desc: "Enkripsi data berlapis untuk menjaga kerahasiaan materi dan hasil seleksi.",
      icon: Database
    }
  ];

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans selection:bg-[#FACC15] selection:text-black">
      {/* Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        (isScrolled || window.innerWidth < 768)
          ? "bg-white py-3 shadow-md border-b border-gray-100"
          : "bg-transparent py-6 border-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 cursor-pointer" onClick={() => scrollToSection('home')}>
            <img
              src="/logo-polda.jpeg"
              alt="Logo Polda DIY"
              className="w-8 sm:w-12 h-8 sm:h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-sm font-black text-[#002147] uppercase leading-none">Bank Soal Online</span>
              <span className="text-[7px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 sm:mt-1">Polda D.I. Yogyakarta</span>
            </div>
          </div>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navigation.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-[10px] font-black text-gray-400 hover:text-[#002147] uppercase tracking-[0.2em] transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <button
            onClick={() => scrollToSection('login-form')}
            className="bg-[#002147] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-[#003366] transition-all shadow-lg shadow-blue-900/10"
          >
            Masuk Sistem
          </button>
        </div>
      </nav>

      {/* Hero / Login Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20 lg:pt-0">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute right-0 top-0 w-1/2 h-full hidden lg:block"
            style={{
              backgroundImage: `url('https://poldadiy.go.id/wp-content/uploads/2022/03/GEDUNG-MAPOLDA-DIY.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
          </div>
          <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-blue-50/50 rounded-tr-full blur-[100px] -z-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center py-20 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[#002147] mb-8 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Polda D.I. Yogyakarta</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-[#0F172A] leading-tight mb-6 sm:mb-8">
              Bank Soal <span className="text-blue-600">Online Digital</span> Polda DIY
            </h1>
            <p className="text-gray-600 text-lg max-w-lg mb-10">
              Akses materi ujian dinas, pengembangan karir, dan peningkatan wawasan kepolisian bagi seluruh personel Polda D.I. Yogyakarta.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => scrollToSection('keunggulan')}
                className="px-8 py-4 bg-gray-100 text-[#002147] font-black text-[11px] uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all"
              >
                Pelajari Fitur
              </button>
            </div>
          </motion.div>

          {/* Login Form Card */}
          <motion.div
            id="login-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl shadow-blue-900/5 border border-gray-100">
              <div className="text-center mb-10">
                <h3 className="text-lg font-black text-[#002147] tracking-tight mb-2">Portal Personel</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Silahkan otentikasi identitas</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all placeholder-gray-400 font-medium"
                      placeholder="Input NRP / Identitas"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all placeholder-gray-400 font-medium"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-[10px] text-center font-bold px-4 py-2 border border-red-100 bg-red-50 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 px-4 bg-[#002147] text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-[#003366] transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
                >
                  Dapatkan Akses
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Bid TIK &copy; Polda D.I. Yogyakarta
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Keunggulan */}
      <section id="keunggulan" className="py-32 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Sistem Mutakhir</h2>
            <h3 className="text-4xl font-black text-[#002147] tracking-tight mb-4">Fitur & Keunggulan</h3>
            <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((adv, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white p-6 sm:p-10 hover:-translate-y-2 transition-all rounded-3xl border border-gray-100 shadow-sm group"
              >
                <div className="bg-blue-50 w-14 h-14 flex items-center justify-center mb-8 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <adv.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#002147] mb-4">{adv.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {adv.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section id="tentang" className="py-32 px-6 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-block bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Tentang Sistem</h2>
          </div>
          <h3 className="text-3xl sm:text-5xl font-black text-[#002147] leading-tight">Pengembangan Karir Personel Polda DIY</h3>
          <p className="text-gray-600 text-lg leading-loose">
            Bank Soal Online Polda DIY merupakan sistem manajemen pengetahuan terpusat yang dirancang untuk memfasilitasi proses pengembangan karir dan peningkatan kompetensi personel Polri. Melalui sistem ini, personel dapat mengakses berbagai materi ujian dinas, tes pengetahuan kepolisian, dan materi pelatihan yang disusun untuk mendukung profesionalisme dalam bertugas.
          </p>
          <div className="pt-6">
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full opacity-20" />
          </div>
          <p className="text-gray-500 text-sm italic max-w-2xl mx-auto">
            "Platform ini menjadi sarana belajar mandiri bagi personel yang akan mengikuti ujian kenaikan pangkat maupun tes kompetensi spesifikasi fungsi teknis kepolisian."
          </p>
        </div>
      </section>

      {/* Informasi */}
      <section id="informasi" className="py-32 px-6 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Database className="w-[800px] h-[800px] absolute -right-40 -top-40" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-xs font-bold text-blue-300 uppercase tracking-[0.5em] mb-12">Informasi Publik</h2>
          <p className="text-xl md:text-3xl font-medium leading-relaxed italic opacity-90">
            "Sistem ini dikelola oleh Bidang TIK Polda DIY untuk memastikan integritas dan transparansi dalam setiap proses seleksi dan pelatihan berbasis digital."
          </p>
        </div>
      </section>

      {/* Kontak */}
      <section id="kontak" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-6">Kontak Resmi</h2>
            <h3 className="text-4xl font-black text-[#002147] mb-8">Hubungi Kami</h3>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Layanan dukungan teknis dan informasi operasional Bidang TIK Polda D.I. Yogyakarta.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <MapPin className="w-6 h-6 text-blue-600 mb-4" />
              <h4 className="text-sm font-bold text-[#002147] uppercase tracking-widest mb-4">Kantor Pusat</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Jln. Padjadjaran (Ring Road Utara), Condongcatur, Depok, Sleman, Yogyakarta.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <Mail className="w-6 h-6 text-blue-600 mb-4" />
              <h4 className="text-sm font-bold text-[#002147] uppercase tracking-widest mb-4">Email Satker</h4>
              <p className="text-sm text-gray-600">
                <a href="mailto:tikjogja@polri.go.id" className="hover:text-blue-600 transition-colors">tikjogja@polri.go.id</a> <br />
                <a href="mailto:bidhumas.diy@polri.go.id" className="hover:text-blue-600 transition-colors">bidhumas.diy@polri.go.id</a>
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <Phone className="w-6 h-6 text-blue-600 mb-4" />
              <h4 className="text-sm font-bold text-[#002147] uppercase tracking-widest mb-4">Hotline Bid TIK</h4>
              <a href="tel:0274884444" className="text-lg font-black text-[#002147] tracking-widest hover:text-blue-600 transition-colors">
                (0274) 884444
              </a>
            </div>

            <div className="bg-[#002147] p-8 rounded-3xl text-white">
              <Globe className="w-6 h-6 text-blue-400 mb-4" />
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Situs Resmi</h4>
              <a
                href="https://jogja.polri.go.id/polda/satker/bid-tik"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium border-b border-blue-400 pb-1 hover:text-blue-300 transition-colors"
              >
                jogja.polri.go.id/bid-tik
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/logo-polda.jpeg"
              alt="Logo"
              className="w-10 opacity-70"
            />
            <img
              src="/logo-tik.jpeg"
              alt="Logo TIK"
              className="w-10 opacity-70"
            />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              &copy; 2024 POLDA DIY Repository &bull; Bid TIK Official Application
            </p>
          </div>
          <div className="flex gap-6">
            <Shield className="w-4 h-4 text-gray-200" />
            <Database className="w-4 h-4 text-gray-200" />
          </div>
        </div>
      </footer>
    </div>
  );
}

