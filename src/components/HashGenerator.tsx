import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Check, Shield, FileUp, Upload } from 'lucide-react';
import { Language } from '../types';
import { generateSha256, generateSha1, md5 } from '../utils';

interface Props {
  lang: Language;
}

export default function HashGenerator({ lang }: Props) {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    sha256: '',
    sha1: '',
    md5: ''
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const calculateHashes = async () => {
      if (!input) {
        setHashes({ sha256: '', sha1: '', md5: '' });
        return;
      }

      try {
        const sha256Val = await generateSha256(input);
        const sha1Val = await generateSha1(input);
        const md5Val = md5(input);

        setHashes({
          sha256: sha256Val,
          sha1: sha1Val,
          md5: md5Val
        });
      } catch (err) {
        console.error('Error generating hashes:', err);
      }
    };

    calculateHashes();
  }, [input]);

  const handleCopy = (val: string, key: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleClear = () => {
    setInput('');
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      readFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setInput(e.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const t = {
    title: lang === 'ar' ? 'مولد الهاش والتشفير (Hash Generator)' : 'Cryptographic Hash Generator',
    desc: lang === 'ar' ? 'قم بحساب بصمات الهاش الأمنية (SHA-256، SHA-1، MD5) للنصوص أو الملفات بشكل فوري وآمن.' : 'Compute secure cryptographic checksums (SHA-256, SHA-1, MD5) for any text block or uploaded file locally.',
    textLabel: lang === 'ar' ? 'النص المدخل أو سحب الملف هنا' : 'ENTER TEXT OR DRAG & DROP FILE',
    placeholderText: lang === 'ar' ? 'اكتب أو ألصق نصوصك هنا لحساب الهاش، أو قم بسحب وإسقاط أي ملف كودي/نصي للتحليل...' : 'Write, paste text, or drag and drop a local code/text file here to compute checksums instantly...',
    sha256Label: 'SHA-256 Checksum',
    sha1Label: 'SHA-1 Checksum',
    md5Label: 'MD5 Checksum',
    copied: lang === 'ar' ? 'تم النسخ!' : 'Copied!',
    dragHint: lang === 'ar' ? 'أفلت الملف هنا للتحميل...' : 'Release file to upload...',
    uploadPrompt: lang === 'ar' ? 'اسحب وأفلت الملفات النصية هنا، أو تصفح الملفات' : 'Drag & drop text file here, or browse local files',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100">{t.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.desc}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input area */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
              {t.textLabel}
            </span>
            {input && (
              <button
                onClick={handleClear}
                className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-all flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>

          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col h-80 rounded-2xl border transition-all ${
              dragActive 
                ? 'border-emerald-500 bg-emerald-500/5' 
                : 'border-slate-800 bg-slate-900/90'
            }`}
          >
            {dragActive ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 pointer-events-none text-emerald-400">
                <Upload className="w-10 h-10 animate-bounce" />
                <span className="text-sm font-semibold">{t.dragHint}</span>
              </div>
            ) : null}

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholderText}
              className="w-full flex-1 code-textarea p-4 bg-transparent text-slate-300 placeholder-slate-500 focus:outline-none resize-none border-b border-slate-800/60"
              spellCheck="false"
            />

            {/* Quick File Upload Helper */}
            <div className="p-3 flex items-center justify-between bg-slate-950/40 rounded-b-2xl">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <FileUp className="w-3.5 h-3.5 text-slate-400" />
                {t.uploadPrompt}
              </span>
              <label className="text-xs font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 transition-all cursor-pointer">
                <span>{lang === 'ar' ? 'اختر ملف' : 'Choose File'}</span>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".txt,.json,.js,.ts,.html,.css,.md,.xml,.yaml,.yml"
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Hashes output values */}
        <div className="flex flex-col space-y-4 justify-start">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
            {lang === 'ar' ? 'بصمات الهاش المستخرجة' : 'COMPUTED CHECKSUMS'}
          </span>

          {/* SHA-256 Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 font-mono tracking-wider">{t.sha256Label}</span>
              {hashes.sha256 && (
                <button
                  onClick={() => handleCopy(hashes.sha256, 'sha256')}
                  className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'sha256' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'sha256' ? t.copied : lang === 'ar' ? 'نسخ' : 'Copy'}
                </button>
              )}
            </div>
            <div className="p-2.5 font-mono text-xs rounded-lg bg-slate-950/80 border border-slate-800/80 text-slate-300 break-all select-all">
              {hashes.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </div>
          </div>

          {/* SHA-1 Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-400 font-mono tracking-wider">{t.sha1Label}</span>
              {hashes.sha1 && (
                <button
                  onClick={() => handleCopy(hashes.sha1, 'sha1')}
                  className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'sha1' ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'sha1' ? t.copied : lang === 'ar' ? 'نسخ' : 'Copy'}
                </button>
              )}
            </div>
            <div className="p-2.5 font-mono text-xs rounded-lg bg-slate-950/80 border border-slate-800/80 text-slate-300 break-all select-all">
              {hashes.sha1 || 'da39a3ee5e6b4b0d3255bfef95601890afd80709'}
            </div>
          </div>

          {/* MD5 Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-400 font-mono tracking-wider">{t.md5Label}</span>
              {hashes.md5 && (
                <button
                  onClick={() => handleCopy(hashes.md5, 'md5')}
                  className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'md5' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'md5' ? t.copied : lang === 'ar' ? 'نسخ' : 'Copy'}
                </button>
              )}
            </div>
            <div className="p-2.5 font-mono text-xs rounded-lg bg-slate-950/80 border border-slate-800/80 text-slate-300 break-all select-all">
              {hashes.md5 || 'd41d8cd98f00b204e9800998ecf8427e'}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
