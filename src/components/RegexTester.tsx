import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Check, Search, Info, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export default function RegexTester({ lang }: Props) {
  const [regexStr, setRegexStr] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [testText, setTestText] = useState('My email is hello@example.com and our support is support@company.org. Please contact us!');
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false });
  const [matches, setMatches] = useState<{ text: string; index: number; groups: string[] }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Compute matches in real-time
  useEffect(() => {
    if (!regexStr) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      // Build flag string
      let flagStr = '';
      if (flags.g) flagStr += 'g';
      if (flags.i) flagStr += 'i';
      if (flags.m) flagStr += 'm';
      if (flags.s) flagStr += 's';

      const regex = new RegExp(regexStr, flagStr);
      const results: { text: string; index: number; groups: string[] }[] = [];

      if (flags.g) {
        let match;
        let lastIndex = -1; // Prevent infinite loops
        while ((match = regex.exec(testText)) !== null) {
          if (regex.lastIndex === lastIndex) {
            regex.lastIndex++; // Advance if empty match
          }
          lastIndex = regex.lastIndex;
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1).filter(Boolean),
          });
          if (results.length > 500) break; // Safety limit
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1).filter(Boolean),
          });
        }
      }

      setMatches(results);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid regular expression');
      setMatches([]);
    }
  }, [regexStr, testText, flags]);

  const loadPreset = (pattern: string, test: string) => {
    setRegexStr(pattern);
    setTestText(test);
  };

  const toggleFlag = (flag: 'g' | 'i' | 'm' | 's') => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  // Translations
  const t = {
    title: lang === 'ar' ? 'مختبر التعبيرات النمطية (Regex)' : 'Regular Expression Tester',
    desc: lang === 'ar' ? 'اختبر وتحقق من التعبيرات النمطية (RegEx) مع نصوص التجارب في الوقت الفعلي.' : 'Build and test your regular expressions on sample inputs with group captures and highlight summaries.',
    regexLabel: lang === 'ar' ? 'التعبير النمطي (Pattern)' : 'REGULAR EXPRESSION',
    testLabel: lang === 'ar' ? 'نص التجربة (Test Text)' : 'TEST STRING / BODY',
    matchesHeader: lang === 'ar' ? 'المطابقات المستخرجة:' : 'Matches Found:',
    noMatches: lang === 'ar' ? 'لم يتم العثور على مطابقات.' : 'No matches found with current pattern.',
    errorLabel: lang === 'ar' ? 'خطأ في صياغة التعبير:' : 'Expression Error:',
    presetTitle: lang === 'ar' ? 'نماذج جاهزة:' : 'Presets:',
    presetEmail: lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address',
    presetPhone: lang === 'ar' ? 'أرقام الهواتف' : 'Phone Numbers',
    presetDate: lang === 'ar' ? 'تاريخ (YYYY-MM-DD)' : 'Date (YYYY-MM-DD)',
    cheatsheetTitle: lang === 'ar' ? 'دليل رموز Regex السريع' : 'Regex Cheatsheet Guide',
  };

  // Simple tokens cheatsheet
  const cheatsheet = [
    { token: '\\d', ar: 'أي رقم من 0-9', en: 'Any digit [0-9]' },
    { token: '\\w', ar: 'حرف هجائي أو رقم أو شرطة سفلية', en: 'Alphanumeric & underscore' },
    { token: '\\s', ar: 'مسافة فارغة', en: 'Whitespace character' },
    { token: '.', ar: 'أي حرف باستثناء سطر جديد', en: 'Any character except newline' },
    { token: '*', ar: 'تكرار صفر أو أكثر من المرات', en: 'Zero or more times' },
    { token: '+', ar: 'تكرار مرة واحدة أو أكثر', en: 'One or more times' },
    { token: '?', ar: 'تكرار صفر أو مرة واحدة (اختياري)', en: 'Zero or one time' },
    { token: '^ / $', ar: 'بداية / نهاية السطر', en: 'Start / end of string' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100">{t.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.desc}</p>
        </div>
      </div>

      {/* Grid: 2 columns - main workspace on left, cheatsheet on right */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Workspace (3 cols) */}
        <div className="xl:col-span-3 space-y-5">
          
          {/* Regex Input & Flags Panel */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
                {t.regexLabel}
              </label>
              {/* Presets */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{t.presetTitle}</span>
                <button
                  onClick={() => loadPreset('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'Contact emails: user@gmail.com, admin@website.co.uk.')}
                  className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700/60 transition-all font-mono"
                >
                  {t.presetEmail}
                </button>
                <button
                  onClick={() => loadPreset('\\+?\\d{1,4}[-\\s]?\\(?\\d{1,3}\\)?[-\\s]?\\d{3,4}[-\\s]?\\d{3,4}', 'Office phone: +1-555-0199 or 00966500000000.')}
                  className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700/60 transition-all font-mono"
                >
                  {t.presetPhone}
                </button>
                <button
                  onClick={() => loadPreset('\\d{4}-\\d{2}-\\d{2}', 'Created on 2026-07-15, modified on 2026-08-30.')}
                  className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700/60 transition-all font-mono"
                >
                  {t.presetDate}
                </button>
              </div>
            </div>

            {/* Input Row */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm select-none">/</span>
                <input
                  type="text"
                  value={regexStr}
                  onChange={(e) => setRegexStr(e.target.value)}
                  placeholder="[a-z]+"
                  className="w-full pl-6 pr-8 py-2.5 font-mono text-sm rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  spellCheck="false"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm select-none">/</span>
              </div>

              {/* Flags Toggles */}
              <div className="flex items-center gap-1.5 px-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
                {Object.entries(flags).map(([flag, active]) => (
                  <button
                    key={flag}
                    onClick={() => toggleFlag(flag as any)}
                    className={`px-2 py-1.5 rounded transition-all font-bold ${
                      active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-600 hover:text-slate-400 border border-transparent'
                    }`}
                    title={
                      flag === 'g' ? 'Global match' :
                      flag === 'i' ? 'Case insensitive' :
                      flag === 'm' ? 'Multiline matching' : 'Dot matches newline'
                    }
                  >
                    {flag}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 text-xs rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-400 font-mono">
                {t.errorLabel} {error}
              </div>
            )}
          </div>

          {/* Test Text Area */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
              {t.testLabel}
            </label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Paste test corpus text here..."
              className="w-full h-40 code-textarea p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              spellCheck="false"
            />
          </div>

          {/* Matches Output */}
          <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                {t.matchesHeader}
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono">
                  {matches.length}
                </span>
              </h3>
            </div>

            {matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {matches.map((match, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-mono">#{idx + 1} (idx: {match.index})</span>
                      {match.groups.length > 0 && (
                        <span className="text-teal-400 font-mono font-semibold">
                          Groups: {match.groups.length}
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-sm bg-slate-950/60 p-2 rounded border border-slate-800 text-cyan-400 break-all">
                      {match.text}
                    </div>
                    {match.groups.length > 0 && (
                      <div className="text-[11px] font-mono text-slate-500 pl-2 border-l border-slate-800">
                        {match.groups.map((g, gIdx) => (
                          <div key={gIdx} className="truncate">Group {gIdx + 1}: "{g}"</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4">{t.noMatches}</p>
            )}
          </div>

        </div>

        {/* Sidebar Cheatsheet Guide (1 col) */}
        <div className="xl:col-span-1 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/60 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{t.cheatsheetTitle}</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
            {cheatsheet.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/50 hover:border-cyan-500/20 transition-all flex flex-col space-y-1">
                <span className="font-mono text-xs text-cyan-400 font-semibold">{item.token}</span>
                <span className="text-xs text-slate-300">
                  {lang === 'ar' ? item.ar : item.en}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
