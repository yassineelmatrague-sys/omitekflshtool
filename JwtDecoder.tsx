import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Check, ShieldAlert, KeyRound, Clock, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export default function JwtDecoder({ lang }: Props) {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<string>('');
  const [payload, setPayload] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [validation, setValidation] = useState<{
    valid: boolean;
    expired: boolean;
    expTime?: string;
    iatTime?: string;
    timeLeft?: string;
    error?: string;
  }>({ valid: false, expired: false });
  const [copied, setCopied] = useState(false);

  // Parse JWT
  useEffect(() => {
    if (!token.trim()) {
      setHeader('');
      setPayload('');
      setSignature('');
      setValidation({ valid: false, expired: false });
      return;
    }

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      setHeader('');
      setPayload('');
      setSignature('');
      setValidation({
        valid: false,
        expired: false,
        error: lang === 'ar' ? 'صيغة JWT غير صالحة. الرمز يجب أن يتكون من 3 أجزاء تفصلها نقطة.' : 'Malformed JWT structure. Token must consist of 3 dot-separated parts.',
      });
      return;
    }

    try {
      // Decode Base64Url
      const decodePart = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if missing
        while (base64.length % 4) {
          base64 += '=';
        }
        const binString = atob(base64);
        const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
        return new TextDecoder().decode(bytes);
      };

      const decodedHeader = JSON.parse(decodePart(parts[0]));
      const decodedPayload = JSON.parse(decodePart(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setSignature(parts[2]);

      // Timestamps calculations
      let expired = false;
      let expTime = '';
      let iatTime = '';
      let timeLeft = '';

      if (decodedPayload.exp) {
        const expDate = new Date(decodedPayload.exp * 1000);
        expTime = expDate.toLocaleString();
        const diffMs = expDate.getTime() - Date.now();
        expired = diffMs < 0;

        if (expired) {
          timeLeft = lang === 'ar' ? 'منتهي الصلاحية' : 'Expired';
        } else {
          const mins = Math.floor(diffMs / 60000);
          const hours = Math.floor(mins / 60);
          const days = Math.floor(hours / 24);

          if (days > 0) {
            timeLeft = lang === 'ar' ? `${days} يوم متبقي` : `${days}d left`;
          } else if (hours > 0) {
            timeLeft = lang === 'ar' ? `${hours} ساعة متبقي` : `${hours}h left`;
          } else {
            timeLeft = lang === 'ar' ? `${mins} دقيقة متبقي` : `${mins}m left`;
          }
        }
      }

      if (decodedPayload.iat) {
        iatTime = new Date(decodedPayload.iat * 1000).toLocaleString();
      }

      setValidation({
        valid: true,
        expired,
        expTime,
        iatTime,
        timeLeft,
      });

    } catch (err: any) {
      setHeader('');
      setPayload('');
      setSignature('');
      setValidation({
        valid: false,
        expired: false,
        error: lang === 'ar' ? 'فشل فك شفرة البيانات. الرمز غير مشفر بشكل صحيح.' : 'Unable to parse JSON contents. Malformed token coding.',
      });
    }
  }, [token]);

  const loadSample = () => {
    // Generate a valid-looking sample token
    const sampleHeader = { alg: "HS256", typ: "JWT" };
    const curTime = Math.floor(Date.now() / 1000);
    const samplePayload = {
      sub: "1234567890",
      name: "Yassine Elmatrague",
      role: "lead-developer",
      admin: true,
      iat: curTime - 3600, // issued 1 hour ago
      exp: curTime + 86400, // expires in 24 hours
      iss: "https://auth.developer-toolkit.dev"
    };

    const b64Encode = (obj: object) => {
      const str = JSON.stringify(obj);
      const bytes = new TextEncoder().encode(str);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
      return btoa(binString).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };

    const tokenBuilt = `${b64Encode(sampleHeader)}.${b64Encode(samplePayload)}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
    setToken(tokenBuilt);
  };

  const handleCopy = (txt: string) => {
    if (!txt) return;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const t = {
    title: lang === 'ar' ? 'مفكك ومحلل رموز JWT' : 'JWT Decoder & Analyzer',
    desc: lang === 'ar' ? 'قم بفك وتحليل رموز JSON Web Token لمعاينة تفاصيل الرأس والبيانات وصلاحية التوقيع.' : 'Decode JSON Web Token segments (header, payload, signature) with secure inline epoch parsing.',
    inputLabel: lang === 'ar' ? 'رمز JWT المدخل' : 'ENTER JWT TOKEN',
    placeholderInput: lang === 'ar' ? 'أدخل الرمز هنا (يبدأ بـ eyJ...)' : 'Paste token here (e.g. eyJ...)',
    headerLabel: lang === 'ar' ? 'الرأس (Header)' : 'HEADER: ALGORITHM & TOKEN TYPE',
    payloadLabel: lang === 'ar' ? 'البيانات (Payload)' : 'PAYLOAD: DATA / CLAIMS',
    sigLabel: lang === 'ar' ? 'التوقيع (Signature)' : 'SIGNATURE (RAW)',
    sampleBtn: lang === 'ar' ? 'تحميل نموذج JWT' : 'Load Sample Token',
    copied: lang === 'ar' ? 'تم النسخ!' : 'Copied!',
    statusLabel: lang === 'ar' ? 'حالة التوقيع والصلاحية' : 'Token Validity Summary',
    lblExp: lang === 'ar' ? 'تاريخ الانتهاء:' : 'Expiration (exp):',
    lblIat: lang === 'ar' ? 'تاريخ الإصدار:' : 'Issued At (iat):',
    lblStatus: lang === 'ar' ? 'حالة الرمز:' : 'Status:',
    statusExpired: lang === 'ar' ? 'منتهي الصلاحية' : 'Expired / Token invalid',
    statusValid: lang === 'ar' ? 'نشط وصالح' : 'Active / Valid',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400">
          <KeyRound className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100">{t.title}</h2>
          <p className="text-slate-400 text-sm mt-1">{t.desc}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Column (4 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
              {t.inputLabel}
            </label>
            <button
              onClick={loadSample}
              className="text-xs px-2.5 py-1 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-all font-mono"
            >
              {t.sampleBtn}
            </button>
          </div>

          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={t.placeholderInput}
            className="w-full h-80 code-textarea p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none break-all"
            spellCheck="false"
          />

          {/* Validation Status Block */}
          {token.trim() && (
            <div className="p-4 rounded-xl border bg-slate-950/40 border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                {t.statusLabel}
              </h3>

              {!validation.valid ? (
                <div className="flex items-start gap-2.5 text-rose-400 text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{validation.error}</span>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-900">
                    <span className="text-slate-400">{t.lblStatus}</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                      validation.expired ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {validation.expired ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {t.statusExpired}
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {t.statusValid}
                        </>
                      )}
                    </span>
                  </div>

                  {validation.expTime && (
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {t.lblExp}
                      </span>
                      <span className="font-mono text-[11px] text-right">{validation.expTime} ({validation.timeLeft})</span>
                    </div>
                  )}

                  {validation.iatTime && (
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {t.lblIat}
                      </span>
                      <span className="font-mono text-[11px] text-right">{validation.iatTime}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Decoder Output Columns (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Header Decode Segment */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-400 font-mono tracking-wider uppercase">
                {t.headerLabel}
              </span>
              {header && (
                <button
                  onClick={() => handleCopy(header)}
                  className="text-slate-400 hover:text-rose-400 transition-all"
                  title="Copy Header"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={header}
              placeholder={lang === 'ar' ? 'بيانات رأس الرمز ستظهر هنا...' : 'Header contents...'}
              className="w-full h-32 code-textarea p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-rose-400 placeholder-slate-700 focus:outline-none resize-none"
              spellCheck="false"
            />
          </div>

          {/* Payload Decode Segment */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-cyan-400 font-mono tracking-wider uppercase">
                {t.payloadLabel}
              </span>
              {payload && (
                <button
                  onClick={() => handleCopy(payload)}
                  className="text-slate-400 hover:text-cyan-400 transition-all"
                  title="Copy Payload"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={payload}
              placeholder={lang === 'ar' ? 'البيانات والحمولة للرمز ستظهر هنا...' : 'Payload properties...'}
              className="w-full h-44 code-textarea p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-cyan-400 placeholder-slate-700 focus:outline-none resize-none"
              spellCheck="false"
            />
          </div>

          {/* Raw Signature Segment */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-500 font-mono tracking-wider uppercase">
                {t.sigLabel}
              </span>
            </div>
            <div className="p-3 font-mono text-xs rounded-xl bg-slate-950/60 border border-slate-800 text-amber-500 truncate select-all" title="Click to select all">
              {signature || (lang === 'ar' ? 'بصمة التوقيع الرقمي...' : 'HMACSHA256 signature hash...')}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
