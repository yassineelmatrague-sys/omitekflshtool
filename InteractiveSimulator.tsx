import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Cpu, 
  Usb, 
  FileCode, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Radio, 
  Zap, 
  Battery, 
  Download, 
  FolderOpen 
} from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export default function InteractiveSimulator({ lang }: Props) {
  const [firmwarePath, setFirmwarePath] = useState('/firmware/MT6765_Tecno_Spark_6_Go/');
  const [scatterFile, setScatterFile] = useState('MT6765_Android_scatter.txt');
  const [downloadAgent, setDownloadAgent] = useState('MTK_AllInOne_DA_v5.bin');
  
  const [connectionType, setConnectionType] = useState<'USB' | 'UART'>('USB');
  const [batteryState, setBatteryState] = useState<'With' | 'Without' | 'Auto'>('Auto');
  const [autoReboot, setAutoReboot] = useState(true);
  const [bromState, setBromState] = useState('Disconnected');
  const [deviceConnected, setDeviceConnected] = useState(false);
  
  const [selectedBrand, setSelectedBrand] = useState('Tecno');
  const [selectedMemory, setSelectedMemory] = useState({
    DRAM: true,
    EMMC: true,
    LPDDR: false
  });
  const [startAddr, setStartAddr] = useState('0x08000000');
  const [endAddr, setEndAddr] = useState('0x09000000');

  // Simulation running state
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashProgress, setFlashProgress] = useState(0);
  const [currentPartition, setCurrentPartition] = useState('');
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] OMITEK Flash Tool MTK Edition initialized.`,
    `[${new Date().toLocaleTimeString()}] Ready for BROM Connection... Please hold Vol+ / Vol- and plug USB.`
  ]);
  const [flashSpeed, setFlashSpeed] = useState('0 B/s');
  const [writtenBytes, setWrittenBytes] = useState('0 MB');
  const [simulationSuccess, setSimulationSuccess] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleConnectDevice = () => {
    if (deviceConnected) {
      addLog('⚠️ Disconnecting device...');
      setDeviceConnected(false);
      setBromState('Disconnected');
    } else {
      addLog(`🔌 Attempting BROM handshaking via ${connectionType}...`);
      setBromState('Handshaking...');
      setTimeout(() => {
        addLog(`✅ Connected to MTK High-Speed USB Port (COM3)`);
        addLog(`📱 Device Detected: MediaTek MT6765 (Helio P35) [64-bit]`);
        addLog(`📦 Storage: eMMC | DRAM: 3GB LPDDR3`);
        setDeviceConnected(true);
        setBromState('Connected');
      }, 1200);
    }
  };

  const startFlashing = () => {
    if (!deviceConnected) {
      addLog('❌ Error: No device connected. Please plug device in BROM mode first!');
      return;
    }
    if (isFlashing) return;

    setIsFlashing(true);
    setFlashProgress(0);
    setSimulationSuccess(false);
    addLog(`🚀 Starting firmware flash sequence on ${selectedBrand} device...`);
    addLog(`📁 Parsing Scatter File: ${scatterFile}`);
    addLog(`⚙️ Loading Download Agent: ${downloadAgent}`);

    const partitions = [
      { name: 'preloader_mt6765.bin', size: 2 },
      { name: 'pgpt', size: 1 },
      { name: 'logo.bin', size: 8 },
      { name: 'boot.img', size: 32 },
      { name: 'recovery.img', size: 64 },
      { name: 'dtbo.img', size: 4 },
      { name: 'vbmeta.img', size: 1 },
      { name: 'system.img', size: 1450 },
      { name: 'vendor.img', size: 380 },
      { name: 'userdata.img', size: 890 }
    ];

    let pIdx = 0;
    let currentProg = 0;
    setFlashSpeed('42.8 MB/s');

    const interval = setInterval(() => {
      if (pIdx < partitions.length) {
        const part = partitions[pIdx];
        setCurrentPartition(part.name);
        addLog(`💾 Writing partition [${part.name.toUpperCase()}] ...`);
        
        currentProg += Math.ceil(100 / partitions.length);
        if (currentProg > 100) currentProg = 100;
        setFlashProgress(currentProg);
        
        // Calculate written bytes roughly
        const totalWritten = partitions.slice(0, pIdx + 1).reduce((acc, curr) => acc + curr.size, 0);
        setWrittenBytes(`${totalWritten} MB`);

        pIdx++;
      } else {
        clearInterval(interval);
        setFlashProgress(100);
        setIsFlashing(false);
        setCurrentPartition('');
        setFlashSpeed('0 B/s');
        setSimulationSuccess(true);
        addLog(`🎉 ========================================`);
        addLog(`🎉 [SUCCESS] Firmware Flashing Completed!`);
        addLog(`🔋 Auto rebooting device... Warm Boot triggered.`);
        addLog(`🎉 ========================================`);
      }
    }, 1500);
  };

  const resetSimulation = () => {
    setFlashProgress(0);
    setIsFlashing(false);
    setCurrentPartition('');
    setSimulationSuccess(false);
    setLogs([
      `[${new Date().toLocaleTimeString()}] Simulation environment reset.`,
      `[${new Date().toLocaleTimeString()}] Ready for connection.`
    ]);
  };

  // Translations
  const t = {
    title: lang === 'ar' ? 'محاكي واجهة الأداة التفاعلي' : 'Interactive Flash Tool Simulator',
    desc: lang === 'ar' ? 'اختبر واجهة أداة التفليش الاحترافية وتفاعل مع الأزرار وكأنها مثبتة على حاسوبك تماماً!' : 'Experience the real MTK Flash Tool interface. Interact with controls and simulate a full firmware flash locally!',
    connected: lang === 'ar' ? 'متصل' : 'Connected',
    disconnected: lang === 'ar' ? 'غير متصل' : 'Disconnected',
    firmwarePath: lang === 'ar' ? 'مسار الروم (Firmware):' : 'Firmware Path',
    scatterFile: lang === 'ar' ? 'ملف الاسكاتر (Scatter):' : 'Scatter File',
    downloadAgent: lang === 'ar' ? 'وكيل التنزيل (DA):' : 'Download Agent',
    bromConnection: lang === 'ar' ? 'اتصال BROM' : 'BROM Connection',
    batteryLabel: lang === 'ar' ? 'البطارية:' : 'Battery:',
    autoReboot: lang === 'ar' ? 'إعادة تشغيل تلقائي' : 'Auto Reboot',
    memoryTest: lang === 'ar' ? 'فحص الذاكرة' : 'Memory Test',
    resultsLabel: lang === 'ar' ? 'النتائج والتقارير' : 'RESULTS',
    logsTitle: lang === 'ar' ? 'سجل العمليات والكونسول' : 'PROCESS LOG TERMINAL',
    btnFlash: lang === 'ar' ? 'بدء تفليش الروم' : 'Start Firmware Flash',
    btnConnecting: lang === 'ar' ? 'جاري الاتصال...' : 'Connecting...',
    btnDisconnect: lang === 'ar' ? 'قطع اتصال الهاتف' : 'Disconnect Phone',
    btnConnect: lang === 'ar' ? 'توصيل الهاتف (BROM)' : 'Connect Phone (BROM)',
    brandSelect: lang === 'ar' ? 'اختر ماركة الهاتف للتجربة:' : 'Select Phone Brand for Test:',
    progressLabel: lang === 'ar' ? 'نسبة التقدم:' : 'Progress:',
    successMsg: lang === 'ar' ? 'اكتملت عملية التفليش بنجاح 100٪!' : 'Flashing Sequence Completed successfully!',
    checksum: lang === 'ar' ? 'حالة المنفذ: USB 2.0 High-Speed' : 'Port State: USB 2.0 High-Speed'
  };

  const brands = ['Tecno', 'Infinix', 'Realme', 'Xiaomi', 'Oppo', 'Vivo', 'Samsung'];

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest font-mono">
          {lang === 'ar' ? 'ميزة تجريبية تفاعلية' : 'LIVE INTERACTIVE DEMO'}
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold font-display text-white">
          {t.title}
        </h3>
        <p className="text-slate-400 text-sm md:text-base">
          {t.desc}
        </p>
      </div>

      {/* Main Flash Tool Mimic Frame */}
      <div className="bg-slate-950 rounded-2xl border-2 border-indigo-500/40 shadow-2xl overflow-hidden text-slate-300">
        
        {/* Mock Window Title Bar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400 ml-2">
              Omitek Flash Tool v3.21.0 - MTK Premium Edition
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono bg-indigo-950/60 border border-indigo-500/20 px-2 py-0.5 rounded text-indigo-400">
              License: ACTIVE
            </span>
          </div>
        </div>

        {/* Inner layout (Sidebar + Panels) */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column Controls & Specs (3 cols) */}
          <div className="lg:col-span-3 bg-slate-900/60 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-4 text-xs">
            
            {/* Phone Brand Selection */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold block">{t.brandSelect}</label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  addLog(`📍 Selected brand target preset changed to: ${e.target.value}`);
                }}
                disabled={isFlashing}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Connection Status Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400">MTK CONNECTION</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  deviceConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  ● {deviceConnected ? t.connected : t.disconnected}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-1.5 font-mono text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Chipset:</span>
                  <span className="text-white">MediaTek MT6765</span>
                </div>
                <div className="flex justify-between">
                  <span>BROM Port:</span>
                  <span className="text-indigo-400">{bromState}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="text-white">High-Speed DA v5</span>
                </div>
              </div>

              {/* Action Connection Button */}
              <button
                onClick={handleConnectDevice}
                disabled={isFlashing}
                className={`w-full py-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  deviceConnected 
                    ? 'bg-rose-600/10 text-rose-400 border border-rose-500/20 hover:bg-rose-600/20' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-950/20'
                }`}
              >
                <Usb className="w-3.5 h-3.5" />
                {deviceConnected ? t.btnDisconnect : t.btnConnect}
              </button>
            </div>

            {/* BROM Configuration */}
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="font-bold text-slate-400 tracking-wider block">{t.bromConnection}</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setConnectionType('USB')}
                  className={`py-1.5 rounded font-mono text-center transition-all border ${
                    connectionType === 'USB' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'border-slate-800 text-slate-500'
                  }`}
                >
                  USB
                </button>
                <button
                  onClick={() => setConnectionType('UART')}
                  className={`py-1.5 rounded font-mono text-center transition-all border ${
                    connectionType === 'UART' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'border-slate-800 text-slate-500'
                  }`}
                >
                  UART
                </button>
              </div>

              {/* Battery Selector */}
              <div className="space-y-1">
                <span className="text-slate-500 block">{t.batteryLabel}</span>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  {['With', 'Without', 'Auto'].map((bState) => (
                    <button
                      key={bState}
                      onClick={() => setBatteryState(bState as any)}
                      className={`py-1 rounded font-mono text-center border transition-all ${
                        batteryState === bState ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'border-slate-800 text-slate-500'
                      }`}
                    >
                      {bState}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Reboot Toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={autoReboot}
                  onChange={(e) => setAutoReboot(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[11px] text-slate-400">{t.autoReboot}</span>
              </label>
            </div>

          </div>

          {/* Right Main Interface Work Area (9 cols) */}
          <div className="lg:col-span-9 p-5 space-y-5 flex flex-col justify-between">
            
            {/* Input Files Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">{t.firmwarePath}</span>
                <div className="relative">
                  <input
                    type="text"
                    value={firmwarePath}
                    onChange={(e) => setFirmwarePath(e.target.value)}
                    disabled={isFlashing}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-3 pr-8 text-slate-300 font-mono focus:outline-none"
                  />
                  <FolderOpen className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-500" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">{t.scatterFile}</span>
                <div className="relative">
                  <input
                    type="text"
                    value={scatterFile}
                    onChange={(e) => setScatterFile(e.target.value)}
                    disabled={isFlashing}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-3 pr-8 text-slate-300 font-mono focus:outline-none"
                  />
                  <FileCode className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-500" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">{t.downloadAgent}</span>
                <div className="relative">
                  <input
                    type="text"
                    value={downloadAgent}
                    onChange={(e) => setDownloadAgent(e.target.value)}
                    disabled={isFlashing}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-3 pr-8 text-slate-300 font-mono focus:outline-none"
                  />
                  <Cpu className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Mid panel: Memory test mockup & Stats metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Memory Tester Spec Config */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  {t.memoryTest}
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(selectedMemory).map((mKey) => (
                    <label key={mKey} className="flex items-center gap-1.5 p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(selectedMemory as any)[mKey]}
                        onChange={(e) => setSelectedMemory(prev => ({ ...prev, [mKey]: e.target.checked }))}
                        className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                      />
                      <span className="font-mono text-[10px] text-slate-300">{mKey}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="space-y-1">
                    <span className="text-slate-500">Begin Addr</span>
                    <input 
                      type="text" 
                      value={startAddr} 
                      onChange={(e) => setStartAddr(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-300" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500">End Addr</span>
                    <input 
                      type="text" 
                      value={endAddr} 
                      onChange={(e) => setEndAddr(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-300" 
                    />
                  </div>
                </div>
              </div>

              {/* Operation metrics */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between text-xs space-y-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Real-time Telemetry
                </span>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Flashing Speed</span>
                    <span className="font-mono text-sm font-bold text-indigo-400">{flashSpeed}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Written</span>
                    <span className="font-mono text-sm font-bold text-teal-400">{writtenBytes}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Progress</span>
                    <span className="font-mono text-sm font-bold text-amber-500">{flashProgress}%</span>
                  </div>
                </div>

                {/* Main flashing action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={startFlashing}
                    disabled={isFlashing || !deviceConnected}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all py-2.5 rounded-lg text-white font-bold flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                    {t.btnFlash}
                  </button>

                  <button
                    onClick={resetSimulation}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all"
                    title="Reset Simulation"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Simulated Live Terminal logs output */}
            <div className="space-y-1.5 flex-1 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase font-mono flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-400" />
                {t.logsTitle}
              </span>
              <div className="flex-1 h-44 bg-slate-950 rounded-xl border border-slate-800/80 p-3.5 font-mono text-[11px] leading-relaxed text-indigo-300 overflow-y-auto space-y-1 shadow-inner">
                {logs.map((log, idx) => (
                  <div key={idx} className="break-all">
                    {log.includes('SUCCESS') ? (
                      <span className="text-emerald-400 font-bold">{log}</span>
                    ) : log.includes('❌') || log.includes('Error') ? (
                      <span className="text-rose-400 font-bold">{log}</span>
                    ) : log.includes('⚠️') ? (
                      <span className="text-amber-400">{log}</span>
                    ) : log.includes('Connected') || log.includes('✅') ? (
                      <span className="text-teal-400">{log}</span>
                    ) : (
                      <span>{log}</span>
                    )}
                  </div>
                ))}
                {isFlashing && (
                  <div className="text-indigo-400 flex items-center gap-1.5 animate-pulse pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                    <span>Flashing partition [{currentPartition}]...</span>
                  </div>
                )}
                <div ref={logEndRef}></div>
              </div>
            </div>

            {/* Flash Progress Bar bottom of interface */}
            {isFlashing || simulationSuccess ? (
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">{t.progressLabel} {flashProgress}%</span>
                  {simulationSuccess && (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> {t.successMsg}
                    </span>
                  )}
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${flashProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : null}

          </div>

        </div>

      </div>

    </div>
  );
}
