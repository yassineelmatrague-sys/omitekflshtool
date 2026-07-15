import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Check, ArrowLeftRight, Binary, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

type Mode = 'encode-b64' | 'decode-b64' | 'encode-url' | 'decode-url';

export default function Base64Codec({ lang }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode-b64');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Run conversion in real-time when input or mode changes
  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (mode === 'encode-b64') {
        // Handle Unicode characters correctly
        const bytes = new TextEncoder().encode(input);
        const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
        setOutput(btoa(binString));
        setError(null);
      } else if (mode === 'decode-b64') {
        const binString = atob(input.trim());
        const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
        setOutput(new TextDecoder().decode(bytes));
        setError(null);
      } else if (mode === 'encode-url') {
        setOutput(encodeURIComponent(input));
        setError(null);
      } else if (mode === 'decode-url') {
        setOutput(decodeURIComponent(input));
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid characters for this operation');
      setOutput('');
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleSwap = () => {
    if (!output && !input) return;
    setInput(output);
    
    // Reverse the mode
    if (mode === 'encode-b64') setMode('decode-b64');
    else if (mode === 'decode-b64') setMode('encode-b64');
    else if (mode === 'encode-url') setMode('decode-url');
    else if (mode === 'decode-url') setMode('encode-url');
  };

  const loadSample = () => {
    if (mode.includes('b64')) {
      if (mode === 'encode-b64') {
        setInput('Developer Toolkit is awesome! 🚀🚀');
      } else {
        setInput('RGV2ZWxvcGVyIFRvb2xraXQgaXMgYXdlc29tZSEg🚀🚀');
      }
    } else {
      if (mode === 'encode-url') {
        setInput('https://google.com/search?q=developer tools & cool stuff');
      } else {
        setInput('https%3A%2F%2Fgoogle.com%2Fsearch%3Fq%3Ddeveloper%20tools%20%26%20cool%20stuff');
      }
    }
  };

  // Translations
  const t = {
    title: lang === 'ar' ? 'مشفّر ومفكك ترميز Base64 / URL' : 'Base64 & URL Encoder / Decoder',
    desc: lang === 'ar' ? 'قم بتحويل النصوص فوراُ من وإلى صيغ Base64 أو روابط URL الآمنة.' : 'Convert text strings effortlessly to and from Base64 binary or web-safe URL formats.',
    labelInput: lang === 'ar' ? 'المدخلات (نص خام)' : 'INPUT STRING',
    labelOutput: lang === 'ar' ? 'النتيجة (مشفّر/مفكك)' : 'CONVERTED OUTPUT',
    placeholderInput: lang === 'ar' ? 'اكتب أو ألصق النص هنا للتحويل التلقائي...' : 'Type or paste content here for real-time translation...',
    placeholderOutput: lang === 'ar' ? 'النتيجة المحولة ستظهر هنا تلقائياً...' : 'Result will appear here dynamically...',
    optEncB64: lang === 'ar' ? 'تشفير Base64' : 'Encode Base64',
    optDecB64: lang === 'ar' ? 'فك تشفير Base64' : 'Decode Base64',
    optEncUrl: lang === 'ar' ? 'ترميز URL' : 'Encode URL',
    optDecUrl: lang === 'ar' ? 'فك ترميز URL' : 'Decode URL',
    btnSwap: lang === 'ar' ? 'عكس المدخلات والمخرجات' : 'Swap Input & Output',
    btnSample: lang === 'ar' ? 'مثال' : 'Sample',
    copied: lang === 'ar' ? 'تم النسخ!' : 'Copied!',
    errorLabel: lang === 'ar' ? 'خطأ في التحويل:' : 'Conversion Error:',
    invalidB64: lang === 'ar' ? 'النص المدخل لا يمثل صياغة Base64 صالحة للفك.' : 'The input does not represent a valid Base64 string for decoding.',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
          <Binary className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100">{t.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.desc}</p>
        </div>
      </div>

      {/* Control Switcher Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800/80 max-w-2xl">
        <button
          onClick={() => setMode('encode-b64')}
          className={`flex-1 py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all ${
            mode === 'encode-b64' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.optEncB64}
        </button>
        <button
          onClick={() => setMode('decode-b64')}
          className={`flex-1 py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all ${
            mode === 'decode-b64' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.optDecB64}
        </button>
        <div className="h-6 w-px bg-slate-800 hidden md:block"></div>
        <button
          onClick={() => setMode('encode-url')}
          className={`flex-1 py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all ${
            mode === 'encode-url' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.optEncUrl}
        </button>
        <button
          onClick={() => setMode('decode-url')}
          className={`flex-1 py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all ${
            mode === 'decode-url' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.optDecUrl}
        </button>
      </div>

      {/* Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
              {t.labelInput}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={loadSample}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all font-mono"
              >
                {t.btnSample}
              </button>
              <button
                onClick={handleClear}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-rose-400 transition-all"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholderInput}
            className="w-full h-64 code-textarea p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
            spellCheck="false"
          />
        </div>

        {/* Swap & Output Card */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
              {t.labelOutput}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                disabled={!input && !output}
                className="text-xs px-2.5 py-1 rounded bg-slate-800/80 text-emerald-400 border border-emerald-500/20 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 font-mono"
              >
                <ArrowLeftRight className="w-3 h-3" />
                {t.btnSwap}
              </button>
              {output && (
                <button
                  onClick={handleCopy}
                  className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all flex items-center gap-1 font-mono"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  {copied ? t.copied : lang === 'ar' ? 'نسخ' : 'Copy'}
                </button>
              )}
            </div>
          </div>

          <div className="relative flex-1 min-h-[256px]">
            {error ? (
              <div className="absolute inset-0 p-4 rounded-xl bg-rose-950/30 border border-rose-900/40 text-rose-400 flex flex-col justify-center items-center space-y-2 text-center">
                <Trash2 className="w-8 h-8 text-rose-500 opacity-60" />
                <span className="font-semibold text-sm">{t.errorLabel}</span>
                <p className="text-xs text-rose-400/80 max-w-sm">
                  {mode === 'decode-b64' ? t.invalidB64 : error}
                </p>
              </div>
            ) : null}

            <textarea
              readOnly
              value={output}
              placeholder={t.placeholderOutput}
              className={`w-full h-64 code-textarea p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-teal-400 placeholder-slate-600 focus:outline-none resize-none ${
                error ? 'opacity-15 select-none pointer-events-none' : ''
              }`}
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
