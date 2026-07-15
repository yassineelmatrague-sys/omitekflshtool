import React, { useState, useRef } from 'react';
import { 
  Download, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Languages, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Clock,
  Heart,
  FileText,
  Send,
  UploadCloud,
  X,
  AlertCircle,
  Code
} from 'lucide-react';
import { Language } from './types';

const logoImg = '/src/assets/images/omitek_logo_1784145292696.jpg';

export default function App() {
  const [lang, setLang] = useState<Language>('ar'); // Default to Arabic as requested
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDownloadFile, setSelectedDownloadFile] = useState<string>('');
  
  // Bug Reporting Form State
  const [phoneBrand, setPhoneBrand] = useState('Tecno');
  const [errorType, setErrorType] = useState('brom_timeout');
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLanguage = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const handleDownloadTrigger = (fileName: string) => {
    setSelectedDownloadFile(fileName);
    setDownloadModalOpen(true);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.log') || file.name.endsWith('.txt')) {
        setUploadedFile(file);
      } else {
        alert(lang === 'ar' ? 'يرجى تحميل ملف نصي أو ملف سجل بامتداد .log أو .txt' : 'Please upload a text file or log file with .log or .txt extension');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      const ticketId = `OMITEK-BUG-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedTicket(ticketId);
    }, 1800);
  };

  const resetReportForm = () => {
    setDescription('');
    setUploadedFile(null);
    setSubmitSuccess(false);
  };

  // Translations content
  const t = {
    navBrand: 'OMITEK FLASH TOOL',
    navSubtitle: 'MTK EDITION',
    navHome: lang === 'ar' ? 'الرئيسية' : 'Home',
    navAbout: lang === 'ar' ? 'نبذة عن البرنامج' : 'About',
    navDownload: lang === 'ar' ? 'روابط التحميل' : 'Downloads',
    navReport: lang === 'ar' ? 'الإبلاغ عن المشاكل' : 'Report Issues',

    // About Section
    aboutBadge: lang === 'ar' ? 'الإصدار المباشر v3.21.0' : 'LIVE VERSION v3.21.0',
    aboutTitle: lang === 'ar' ? 'نبذة عن برنامج Omitek Flash Tool' : 'About Omitek Flash Tool',
    aboutDesc1: lang === 'ar' 
      ? 'أداة احترافية فائقة السرعة مصممة خصيصاً للفنيين ومطوري الهواتف الذكية للتعامل مع الأجهزة التي تعمل بمعالجات MediaTek (MTK). تتيح الأداة تفليش وإعادة كتابة الرومات الرسمية والمصنعية، وسحب النسخ الاحتياطية للأقسام المهمة بالكامل عبر وضع اتصال BROM عالي السرعة وبدون قيود.'
      : 'A premium, high-speed utility engineered for mobile technicians and hardware developers working with MediaTek (MTK) chipsets. The software facilitates flashing, repairing, and backing up partition tables directly over raw BROM interface protocols.',
    aboutDesc2: lang === 'ar'
      ? 'تتميز الأداة بواجهة عمل محلية 100٪ تضمن الأمان التام لملفات نظامك، وتتخطى حواجز الحماية الأساسية للأجهزة (SLA/DA Auth Bypass) بضغطة زر واحدة لتجعل من عمليات الصيانة والإصلاح تجربة سلسة وخالية من التعقيد.'
      : 'Featuring a fully secure offline engine, Omitek bypasses modern SLA/DA secure boot protections natively without hardware dongles, making firmware restoration and partitioning fluid and straightforward.',

    // Features Highlights
    feat1: lang === 'ar' ? 'دعم كامل لمعالجات MT67xx / MT68xx' : 'Full MT67xx & MT68xx chipset coverage',
    feat2: lang === 'ar' ? 'تجاوز حماية المعالج SLA/DA بنقرة واحدة' : 'Instant SLA/DA secure boot bypass',
    feat3: lang === 'ar' ? 'كتابة ملفات الاسكاتر (Scatter) بسرعة فائقة' : 'High-speed firmware flashing via scatter files',

    // Downloads Section
    downloadTitle: lang === 'ar' ? 'روابط التحميل الرسمية' : 'Official Downloads',
    downloadSubtitle: lang === 'ar' ? 'جميع الملفات آمنة ومرفوعة على خوادم سحابية سريعة ومحمية.' : 'All installation modules are virus-scanned and hosted on high-bandwidth servers.',
    colFile: lang === 'ar' ? 'اسم الملف والنسخة' : 'Filename & Version',
    colSize: lang === 'ar' ? 'الحجم' : 'Size',
    colSystem: lang === 'ar' ? 'النظام المتوافق' : 'Platform',
    btnDownload: lang === 'ar' ? 'تحميل مباشر' : 'Direct Download',

    // Report Section
    reportTitle: lang === 'ar' ? 'نظام الإبلاغ عن المشاكل ومتابعتها' : 'Diagnostics & Issue Reporting Center',
    reportSubtitle: lang === 'ar' ? 'شرح الوظيفة والهدف من هذا النموذج:' : 'Purpose and scope of this diagnostic system:',
    reportDesc: lang === 'ar'
      ? 'تعتمد جودة أدوات التفليش بشكل أساسي على التوافق الدقيق للتعريفات ومزامنة التوقيت لبروتوكول BROM. تساعدنا تقارير المشاكل والملفات المرفقة (مثل ملفات السجل .log) في تحليل أخطاء الاتصال، وحالات انقطاع منفذ COM، وأعطال التعريفات، لكي نقوم بتحديث الأداة وإصدار رقع برمجية سريعة تضمن استقرار الاتصال لجميع الفنيين.'
      : 'Flashing tools depend heavily on microsecond timing accuracy during BROM handshaking. Bug reports containing connection logs allow our development team to trace COM port dropout thresholds, identify driver mismatches, and deploy hotfixes instantly to stabilize firmware operations.',
    
    labelBrand: lang === 'ar' ? 'ماركة الهاتف التي واجهت المشكلة:' : 'Target Device Manufacturer:',
    labelErrorType: lang === 'ar' ? 'نوع الخطأ المكتشف:' : 'Error Category:',
    labelDesc: lang === 'ar' ? 'وصف تفصيلي للخطأ وسلوك البرنامج:' : 'Detailed description of the issue:',
    placeholderDesc: lang === 'ar' ? 'مثال: البرنامج يتوقف عند نسبة 48% أثناء تفليش ملف system.img مع رمز الخطأ STATUS_EXT_RAM_EXCEPTION...' : 'Example: Handshake times out on COM3 port after holding volume keys, showing BROM_CMD_START_FAIL...',
    labelUpload: lang === 'ar' ? 'إرفاق ملف السجل (Log File) - اختياري:' : 'Attach Debug Log File (.log / .txt) - Optional:',
    uploadHint: lang === 'ar' ? 'اسحب ملف السجل هنا أو اضغط للتصفح من جهازك' : 'Drag & drop your log file here or click to browse',
    uploadSupported: lang === 'ar' ? 'صيغ الملفات المدعومة: .log, .txt فقط' : 'Supported formats: .log, .txt files only',
    btnSubmit: lang === 'ar' ? 'إرسال التقرير للمهندسين' : 'Submit Diagnostic Report',
    btnSubmitting: lang === 'ar' ? 'جاري رفع البيانات والتحليل...' : 'Uploading & Analyzing...',
    
    // Success State
    successTitle: lang === 'ar' ? 'تم استلام تقرير التشخيص بنجاح!' : 'Diagnostic Report Received!',
    successTicket: lang === 'ar' ? 'رقم التذكرة:' : 'Ticket Reference:',
    successDesc: lang === 'ar' 
      ? 'شكراً لك. سيقوم مهندسونا بمراجعة ملف السجل المُرفق وتحليل معلومات اللوحة الأم لمنع تكرار هذا الخطأ في التحديث التلقائي القادم للأداة.'
      : 'Thank you. Our engineering team will parse the attached BROM log to patch firmware write-delays and push automatic driver updates.',
    btnNewReport: lang === 'ar' ? 'إرسال تقرير آخر' : 'Submit Another Report',

    // Modal / Download Popup
    modalTitle: lang === 'ar' ? 'تحضير رابط التحميل السريع...' : 'Preparing Direct Link...',
    modalDesc: lang === 'ar' ? 'شكراً لثقتك بأداة Omitek. ملف التثبيت آمن تماماً وخالي من أي برمجيات ضارة.' : 'Your download is starting securely. This distribution is verified clean.',
    modalCounter: lang === 'ar' ? 'سيتم بدء التحميل التلقائي فوراً...' : 'Direct download sequence initiated...',
    modalBtnForce: lang === 'ar' ? 'بدء التحميل الآن' : 'Download Now',
    modalWarning: lang === 'ar' ? 'تنبيه: قد تحتاج إلى إيقاف برنامج الحماية مؤقتاً أثناء التثبيت لتجنب حظر تعريفات منافذ BROM.' : 'Note: Pause local firewall temporarily if custom BROM drivers are blocked during LibUSB installation.',

    // Footer
    footerSlogan: lang === 'ar' ? 'البساطة والسرعة في تفليش الأجهزة الذكية.' : 'Simplifying mobile partition restoration and low-level system flashing.',
    footerCopyright: `© ${new Date().getFullYear()} Omitek Flash Tool. All rights reserved.`
  };

  const downloads = [
    {
      name: 'Omitek_Flash_Tool_v3.21.0_Portable.zip',
      size: '142 MB',
      system: 'Windows 10 / 11 (64-bit)'
    },
    {
      name: 'Omitek_Flash_Tool_v3.21.0_Installer.exe',
      size: '158 MB',
      system: 'Windows 7 / 8 / 10 / 11 (64-bit)'
    },
    {
      name: 'Omitek_MTK_USB_Drivers_v2.0.1.zip',
      size: '18 MB',
      system: 'Windows (All Architectures)'
    }
  ];

  const scrollSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Ambient background glow and grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[200px] right-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-auto rounded-lg bg-slate-900 border border-slate-800 p-1 relative flex items-center justify-center">
              <img 
                src={logoImg} 
                alt="Omitek" 
                className="h-7 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display font-extrabold text-white text-sm md:text-base tracking-wide">
                <span>{t.navBrand}</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono font-semibold">{t.navSubtitle}</span>
              </div>
            </div>
          </div>

          {/* Core Anchors */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-all cursor-pointer">{t.navHome}</button>
            <button onClick={() => scrollSection('about')} className="hover:text-white transition-all cursor-pointer">{t.navAbout}</button>
            <button onClick={() => scrollSection('download')} className="hover:text-white transition-all cursor-pointer">{t.navDownload}</button>
            <button onClick={() => scrollSection('report')} className="hover:text-white transition-all cursor-pointer">{t.navReport}</button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800/80 hover:bg-slate-800 transition-all font-mono cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16 relative">
        
        {/* SECTION 1: Brand Header with Logo & About ("نبذة عن البرنامج") */}
        <section id="about" className="space-y-8 scroll-mt-24">
          
          {/* Centered Graphic Logo Showcase */}
          <div className="max-w-md mx-auto relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-amber-500 rounded-3xl blur opacity-25 group-hover:opacity-35 transition duration-1000"></div>
            <div className="relative bg-slate-950 p-2 rounded-2xl border border-slate-900 overflow-hidden shadow-2xl">
              <img 
                src={logoImg} 
                alt="Omitek Flash Tool Metallic Logo" 
                className="w-full h-auto object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Text Description Block */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest font-mono">
              {t.aboutBadge}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
              {t.aboutTitle}
            </h1>
            <div className="space-y-3 text-slate-400 text-sm md:text-base leading-relaxed">
              <p>{t.aboutDesc1}</p>
              <p>{t.aboutDesc2}</p>
            </div>
          </div>

          {/* Quick Specifications Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2">
            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/60 flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-300">{t.feat1}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/60 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-300">{t.feat2}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900/60 flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-300">{t.feat3}</span>
            </div>
          </div>

        </section>

        {/* SECTION 2: Simplified Downloads ("روابط التحميل") */}
        <section id="download" className="space-y-6 scroll-mt-24">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold font-display text-white">
              {t.downloadTitle}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              {t.downloadSubtitle}
            </p>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-900">
                  <tr>
                    <th scope="col" className="px-6 py-4">{t.colFile}</th>
                    <th scope="col" className="px-6 py-4">{t.colSize}</th>
                    <th scope="col" className="px-6 py-4">{t.colSystem}</th>
                    <th scope="col" className="px-6 py-4 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 text-slate-300">
                  {downloads.map((dl, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-200 font-mono">
                        {dl.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {dl.size}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {dl.system}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDownloadTrigger(dl.name)}
                          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{t.btnDownload}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </section>

        {/* SECTION 3: Issue Diagnostic Reporting ("الإبلاغ عن المشاكل ووظيفتها") */}
        <section id="report" className="space-y-6 scroll-mt-24">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold font-display text-white">
              {t.reportTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Explanatory column (Left/Right depending on lang) - Purpose description */}
            <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-900/80 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono block">
                  {t.reportSubtitle}
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.reportDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-900 space-y-3">
                <div className="flex items-start gap-2 text-[11px] text-slate-500">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{lang === 'ar' ? 'حل مشكلات التعريفات غير المتطابقة تلقائياً.' : 'Identify incompatible driver configurations.'}</span>
                </div>
                <div className="flex items-start gap-2 text-[11px] text-slate-500">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{lang === 'ar' ? 'تعديل ثغرات استجابة ومزامنة منافذ BROM.' : 'Patch port timeout parameters for MTK silicon.'}</span>
                </div>
                <div className="flex items-start gap-2 text-[11px] text-slate-500">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{lang === 'ar' ? 'تحسين كفاءة تخطي الحماية (Auth Bypass) للأجهزة الحديثة.' : 'Update secure exploit payloads for modern chipsets.'}</span>
                </div>
              </div>
            </div>

            {/* Form column (Right/Left depending on lang) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-950 border border-slate-900/80 shadow-lg relative overflow-hidden">
              
              {submitSuccess ? (
                /* Success Message */
                <div className="space-y-6 text-center py-6 animate-in fade-in duration-300">
                  <div className="mx-auto p-4 bg-emerald-500/10 text-emerald-400 rounded-full w-fit">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white font-display">
                      {t.successTitle}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      {t.successDesc}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 w-fit mx-auto text-xs font-mono">
                    <span className="text-slate-500 mr-2">{t.successTicket}</span>
                    <span className="text-indigo-400 font-bold">{generatedTicket}</span>
                  </div>

                  <button
                    onClick={resetReportForm}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-all cursor-pointer"
                  >
                    {t.btnNewReport}
                  </button>
                </div>
              ) : (
                /* Interactive Form */
                <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
                  
                  {/* Row: Brand & Error Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold block">
                        {t.labelBrand}
                      </label>
                      <select
                        value={phoneBrand}
                        onChange={(e) => setPhoneBrand(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Tecno">Tecno</option>
                        <option value="Infinix">Infinix</option>
                        <option value="Realme">Realme</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="Oppo">Oppo</option>
                        <option value="Vivo">Vivo</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Other">{lang === 'ar' ? 'ماركة أخرى' : 'Other Brand'}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold block">
                        {t.labelErrorType}
                      </label>
                      <select
                        value={errorType}
                        onChange={(e) => setErrorType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="brom_timeout">{lang === 'ar' ? 'فشل اتصال BROM (Timeout)' : 'BROM Handshake Timeout'}</option>
                        <option value="write_crash">{lang === 'ar' ? 'انقطاع أثناء التفليش (Write Error)' : 'Crash during flash sequence'}</option>
                        <option value="auth_fail">{lang === 'ar' ? 'خطأ تخطي الحماية (Auth Bypass Fail)' : 'Exploit Bypass Failure'}</option>
                        <option value="driver_conflict">{lang === 'ar' ? 'مشكلة في تعريفات USB/COM' : 'USB/COM Driver Mismatch'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold block">
                      {t.labelDesc}
                    </label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t.placeholderDesc}
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                    ></textarea>
                  </div>

                  {/* Drag-and-Drop / Click File Upload container */}
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold block">
                      {t.labelUpload}
                    </label>
                    
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                        isDragging 
                          ? 'border-indigo-500 bg-indigo-500/10' 
                          : uploadedFile 
                            ? 'border-emerald-500/40 bg-emerald-500/5' 
                            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".log,.txt"
                        className="hidden" 
                      />

                      {uploadedFile ? (
                        <div className="space-y-2 w-full flex flex-col items-center relative" onClick={(e) => e.stopPropagation()}>
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="text-[11px] max-w-xs truncate text-slate-200 font-mono font-semibold">
                            {uploadedFile.name}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ({(uploadedFile.size / 1024).toFixed(1)} KB)
                          </span>
                          <button
                            type="button"
                            onClick={removeUploadedFile}
                            className="absolute -top-1 -right-1 p-1 bg-slate-900 border border-slate-800 hover:border-rose-500/40 hover:text-rose-400 rounded-full transition-colors cursor-pointer"
                            title={lang === 'ar' ? 'حذف الملف' : 'Remove File'}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1 pointer-events-none">
                          <UploadCloud className="w-6 h-6 text-indigo-400 mx-auto" />
                          <p className="text-[11px] font-semibold text-slate-300">
                            {t.uploadHint}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {t.uploadSupported}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission Trigger */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !description.trim()}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/20 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t.btnSubmitting}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{t.btnSubmit}</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 px-4 mt-16 text-center md:text-left">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Zap className="w-4.5 h-4.5 text-yellow-300 animate-pulse" />
              <span className="font-display font-extrabold text-white text-sm">{t.navBrand}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {t.footerSlogan}
            </p>
          </div>

          <div className="flex flex-col md:items-end space-y-2 text-[11px] text-slate-500">
            <span>{t.footerCopyright}</span>
            <span className="flex items-center gap-1.5 justify-center md:justify-end">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {lang === 'ar' ? 'تطبيق محلي آمن يعمل بنسبة 100٪ داخل بيئة نظامك.' : '100% Client-side safe. No telemetry collected.'}
            </span>
          </div>

        </div>
      </footer>

      {/* Download Direct Modal */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl relative space-y-5 text-center animate-in zoom-in-95 duration-200">
            
            <div className="mx-auto p-3 bg-indigo-600/10 text-indigo-400 rounded-full w-fit">
              <Download className="w-6 h-6 text-yellow-300 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold font-display text-white">{t.modalTitle}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.modalDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-center gap-2 text-indigo-400 font-mono text-[10px]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>{t.modalCounter}</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate" title={selectedDownloadFile}>
                {selectedDownloadFile}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] flex gap-1.5 items-start text-left" dir="ltr">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-normal">{t.modalWarning}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.open('https://github.com', '_blank');
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-950/50 cursor-pointer"
              >
                {t.modalBtnForce}
              </button>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
