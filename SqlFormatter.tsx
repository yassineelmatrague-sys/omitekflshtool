import React, { useState } from 'react';
import { Copy, Trash2, Check, Database, Play, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { formatSql } from '../utils';

interface Props {
  lang: Language;
}

export default function SqlFormatter({ lang }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    const formatted = formatSql(input);
    setOutput(formatted);
  };

  const loadSample = () => {
    const sample = `select u.id, u.name, o.total_amount, o.created_at from users u left join orders o on u.id = o.user_id where o.status = 'completed' and o.total_amount > 100 group by u.id, u.name, o.total_amount, o.created_at order by o.total_amount desc limit 50;`;
    setInput(sample);
    setOutput(formatSql(sample));
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
  };

  const t = {
    title: lang === 'ar' ? 'منسق استعلامات SQL' : 'SQL Formatter & Beautifier',
    desc: lang === 'ar' ? 'قم بتنسيق وتجميل لغة SQL لتبسيط قراءتها وترتيب الأقسام والكلمات المحجوزة.' : 'Standardize SQL queries to improve readability, capitalization, and structure layout.',
    inputPlaceholder: lang === 'ar' ? 'ألصق استعلام SQL غير المنسق هنا...' : 'Paste your raw unformatted SQL query here...',
    outputPlaceholder: lang === 'ar' ? 'الاستعلام المنسق سيظهر هنا...' : 'Formatted SQL result will be shown here...',
    btnFormat: lang === 'ar' ? 'تنسيق الاستعلام' : 'Format SQL Query',
    btnSample: lang === 'ar' ? 'تحميل مثال استعلام' : 'Load Sample Query',
    btnClear: lang === 'ar' ? 'مسح' : 'Clear',
    copied: lang === 'ar' ? 'تم النسخ!' : 'Copied!',
    copy: lang === 'ar' ? 'نسخ الاستعلام' : 'Copy Query',
    labelInput: lang === 'ar' ? 'الاستعلام المدخل (Raw SQL)' : 'INPUT RAW SQL',
    labelOutput: lang === 'ar' ? 'الاستعلام المنسق (Beautified SQL)' : 'BEAUTIFIED SQL',
  };

  return (
    <div className="space-y-6">
      {/* Description Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
          <Database className="w-6 h-6" />
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
              {t.labelInput}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={loadSample}
                className="text-xs px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/20 transition-all font-mono"
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
            onChange={(e) => {
              setInput(e.target.value);
              if (!e.target.value.trim()) setOutput('');
            }}
            placeholder={t.inputPlaceholder}
            className="w-full h-80 code-textarea p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            spellCheck="false"
          />

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleFormat}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-900/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {t.btnFormat}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
              {t.labelOutput}
            </span>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all flex items-center gap-1.5 font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t.copied : t.copy}
              </button>
            )}
          </div>

          <textarea
            readOnly
            value={output}
            placeholder={t.outputPlaceholder}
            className="w-full h-80 code-textarea p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sky-400 placeholder-slate-700 focus:outline-none resize-none"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}
