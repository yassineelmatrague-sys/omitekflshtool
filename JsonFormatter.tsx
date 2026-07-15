import React, { useState } from 'react';
import { Copy, Trash2, Check, AlertTriangle, FileCode, Braces } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export default function JsonFormatter({ lang }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState<number>(2);

  const formatJson = (spacing: number = indent) => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, spacing);
      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
      setOutput('');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
      setOutput('');
    }
  };

  const loadSample = () => {
    const sample = {
      appName: "Developer Toolkit",
      version: "1.0.0",
      active: true,
      supportedTools: ["JSON Formatter", "Base64 Encoder", "Regex Tester", "JWT Decoder", "Hash Generator", "SQL Formatter"],
      developer: {
        github: "https://github.com",
        languages: ["TypeScript", "React", "Tailwind"]
      },
      settings: {
        theme: "dark-slate",
        defaultIndent: 2
      }
    };
    setInput(JSON.stringify(sample));
    setError(null);
    try {
      setOutput(JSON.stringify(sample, null, indent));
    } catch (_) {}
  };

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

  // Translations
  const t = {
    title: lang === 'ar' ? 'منسق ومدقق JSON' : 'JSON Formatter & Validator',
    desc: lang === 'ar' ? 'قم بتنسيق، تجميل، أو تصغير نصوص JSON مع التحقق من صحتها فورياً.' : 'Format, beautify, validate or minify raw JSON structures with error tracking.',
    inputPlaceholder: lang === 'ar' ? 'ألصق نص JSON غير المنسق هنا...' : 'Paste raw JSON string here...',
    outputPlaceholder: lang === 'ar' ? 'النتيجة المنسقة ستظهر هنا...' : 'Formatted JSON result will be displayed here...',
    btnFormat: lang === 'ar' ? 'تنسيق (تجميل)' : 'Format (Beautify)',
    btnMinify: lang === 'ar' ? 'تصغير (ضغظ)' : 'Minify (Compact)',
    btnSample: lang === 'ar' ? 'تحميل مثال' : 'Load Sample',
    btnClear: lang === 'ar' ? 'مسح' : 'Clear',
    indentLabel: lang === 'ar' ? 'المسافة البادئة:' : 'Indentation:',
    errorTitle: lang === 'ar' ? 'خطأ في صياغة JSON:' : 'JSON Parsing Error:',
    copied: lang === 'ar' ? 'تم النسخ!' : 'Copied!',
    copy: lang === 'ar' ? 'نسخ النتيجة' : 'Copy Output',
  };

  return (
    <div className="space-y-6">
      {/* Description Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Braces className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100">{t.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.desc}</p>
        </div>
      </div>

      {/* Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
              {lang === 'ar' ? 'المدخلات (JSON الخام)' : 'INPUT (RAW JSON)'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={loadSample}
                className="text-xs px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all font-mono"
              >
                {t.btnSample}
              </button>
              <button
                onClick={handleClear}
                className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/20 transition-all"
                title={t.btnClear}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Clean-up error if input becomes empty
              if (!e.target.value.trim()) {
                setError(null);
                setOutput('');
              }
            }}
            placeholder={t.inputPlaceholder}
            className="w-full h-80 code-textarea p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            spellCheck="false"
          />

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => formatJson()}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-900/20 flex items-center gap-2"
            >
              <FileCode className="w-4 h-4" />
              {t.btnFormat}
            </button>
            <button
              onClick={minifyJson}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/50 transition-all flex items-center gap-2"
            >
              <Braces className="w-4 h-4" />
              {t.btnMinify}
            </button>

            {/* Indent Selector */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-400">{t.indentLabel}</span>
              <select
                value={indent}
                onChange={(e) => {
                  const newIndent = Number(e.target.value);
                  setIndent(newIndent);
                  if (output && !error) formatJson(newIndent);
                }}
                className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value={8}>8 Spaces</option>
              </select>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
              {lang === 'ar' ? 'المخرجات (النتيجة المنسقة)' : 'OUTPUT (FORMATTED)'}
            </span>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all flex items-center gap-1.5 font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t.copied : t.copy}
              </button>
            )}
          </div>

          <div className="relative flex-1 min-h-[320px]">
            {error ? (
              <div className="absolute inset-0 p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-400 flex flex-col space-y-2 overflow-auto">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>{t.errorTitle}</span>
                </div>
                <p className="font-mono text-sm break-all bg-rose-950/40 p-3 rounded-lg border border-rose-950/60">
                  {error}
                </p>
                <p className="text-xs text-rose-500/80">
                  {lang === 'ar' 
                    ? 'يرجى تصحيح الخطأ البرمجي في الجملة المدخلة وتجربة إعادة التنسيق.' 
                    : 'Please review the highlighted syntax error in your source string and format again.'}
                </p>
              </div>
            ) : null}

            <textarea
              readOnly
              value={output}
              placeholder={t.outputPlaceholder}
              className={`w-full h-80 code-textarea p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-emerald-400 placeholder-slate-600 focus:outline-none resize-none ${
                error ? 'opacity-20 select-none pointer-events-none' : ''
              }`}
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
