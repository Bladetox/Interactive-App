import React, { useState, useEffect, useRef } from 'react';
import { Upload, Check, AlertCircle, Loader2, Eye, EyeOff, RefreshCw } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PriceItem {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface MatchedRow {
  item: PriceItem;
  newPrice: number;
  matched: boolean;
  rawLine: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Simple similarity score between two lowercase strings (0-1) */
function similarity(a: string, b: string): number {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  return matches / longer.length;
}

/** Extract text from all pages of a PDF using PDF.js */
async function extractPdfText(file: File): Promise<string> {
  // Dynamically import pdfjs-dist to keep initial bundle small
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item: any) => ('str' in item ? item.str : '')).join(' ') + '\n';
  }
  return fullText;
}

/**
 * Parse lines from PDF text trying to find: item name + price
 * Looks for patterns like:  "Milk  R22.99"  or  "Milk 22.99"  or  "Milk - 22.99"
 */
function parsePriceLines(text: string): Array<{ name: string; price: number }> {
  const results: Array<{ name: string; price: number }> = [];
  const lines = text.split(/\n/);
  const priceRe = /R?\s*(\d+[.,]\d{2})/i;
  for (const line of lines) {
    const match = line.match(priceRe);
    if (!match) continue;
    const price = parseFloat(match[1].replace(',', '.'));
    const name = line.slice(0, line.indexOf(match[0])).replace(/[-–|]/g, '').trim();
    if (name.length > 1 && price > 0) {
      results.push({ name, price });
    }
  }
  return results;
}

/** Match parsed lines against known items using fuzzy similarity */
function matchItems(parsed: Array<{ name: string; price: number }>, items: PriceItem[]): MatchedRow[] {
  return items.map(item => {
    let bestScore = 0;
    let bestMatch: { name: string; price: number } | null = null;
    const itemLower = item.name.toLowerCase();
    for (const p of parsed) {
      const score = similarity(itemLower, p.name.toLowerCase());
      if (score > bestScore) {
        bestScore = score;
        bestMatch = p;
      }
    }
    const THRESHOLD = 0.45;
    return {
      item,
      newPrice: bestMatch && bestScore >= THRESHOLD ? bestMatch.price : item.price,
      matched: bestMatch !== null && bestScore >= THRESHOLD,
      rawLine: bestMatch ? bestMatch.name : '',
    };
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('gh_admin_token') ?? '');
  const [showToken, setShowToken] = useState(false);
  const [currentPrices, setCurrentPrices] = useState<PriceItem[]>([]);
  const [rows, setRows] = useState<MatchedRow[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [status, setStatus] = useState<'idle' | 'parsing' | 'ready' | 'publishing' | 'done' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gh_admin_token', token);
  }, [token]);

  // Load current prices.json
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}prices.json`)
      .then(r => r.json())
      .then((d: { items: PriceItem[] }) => setCurrentPrices(d.items))
      .catch(() => setStatusMsg('Could not load prices.json'));
  }, []);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      setStatusMsg('Please upload a PDF file.');
      setStatus('error');
      return;
    }
    setPdfName(file.name);
    setStatus('parsing');
    setStatusMsg('');
    try {
      const text = await extractPdfText(file);
      const parsed = parsePriceLines(text);
      if (parsed.length === 0) {
        setStatus('error');
        setStatusMsg('No prices found in PDF. Make sure it\'s a text-based (not scanned) PDF.');
        return;
      }
      const matched = matchItems(parsed, currentPrices);
      setRows(matched);
      setStatus('ready');
    } catch (e) {
      setStatus('error');
      setStatusMsg('Failed to parse PDF: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handlePriceEdit = (id: number, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setRows(prev => prev.map(r => r.item.id === id ? { ...r, newPrice: num } : r));
  };

  const handlePublish = async () => {
    if (!token) {
      setStatusMsg('Please enter your GitHub token first.');
      setStatus('error');
      return;
    }
    setStatus('publishing');
    setStatusMsg('');
    try {
      // Build updated prices.json
      const updated = {
        items: rows.map(r => ({
          ...r.item,
          price: r.newPrice,
        })),
      };
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(updated, null, 2))));

      // Get current SHA of prices.json
      const getRes = await fetch(
        'https://api.github.com/repos/Bladetox/Interactive-App/contents/public/prices.json',
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
      );
      const getData = await getRes.json();
      const sha = getData.sha;

      // Commit new prices.json
      const putRes = await fetch(
        'https://api.github.com/repos/Bladetox/Interactive-App/contents/public/prices.json',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `chore(prices): update from PDF — ${new Date().toLocaleDateString('en-ZA')}`,
            content,
            sha,
          }),
        }
      );

      if (!putRes.ok) {
        const err = await putRes.json();
        throw new Error(err.message ?? 'GitHub API error');
      }

      setStatus('done');
      setStatusMsg('Published! Prices will go live in ~2 minutes once GitHub Pages rebuilds.');
    } catch (e) {
      setStatus('error');
      setStatusMsg('Publish failed: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const matchedCount = rows.filter(r => r.matched).length;

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-[600px] mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Price Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Upload a store PDF price list to update prices.json</p>
      </div>

      {/* Token input */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Token</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="github_pat_..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={() => setShowToken(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">Saved in your browser only. Never sent anywhere except GitHub API.</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-6 ${
          dragOver ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-400'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {status === 'parsing' ? (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            <p className="text-sm">Extracting prices from PDF...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload className="w-8 h-8" />
            <p className="text-sm font-medium">{pdfName || 'Drop a PDF here or tap to browse'}</p>
            <p className="text-xs">Text-based PDFs only (not scanned images)</p>
          </div>
        )}
      </div>

      {/* Status message */}
      {statusMsg && (
        <div className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm mb-6 ${
          status === 'error' ? 'bg-red-50 text-red-700' :
          status === 'done'  ? 'bg-green-50 text-green-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          {status === 'error' ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <Check className="w-4 h-4 mt-0.5 shrink-0" />}
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Preview table */}
      {rows.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">
              Preview — {matchedCount}/{rows.length} items matched
            </h2>
            <button
              onClick={() => { setRows([]); setPdfName(''); setStatus('idle'); setStatusMsg(''); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
            {rows.map(row => (
              <div key={row.item.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  row.matched ? 'bg-green-400' : 'bg-gray-200'
                }`} />
                <span className="flex-1 text-sm text-gray-700 truncate">{row.item.name}</span>
                {row.matched && (
                  <span className="text-xs text-gray-400 truncate max-w-[80px]" title={row.rawLine}>
                    ← {row.rawLine}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">R</span>
                  <input
                    type="number"
                    step="0.01"
                    value={row.newPrice}
                    onChange={e => handlePriceEdit(row.item.id, e.target.value)}
                    className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publish button */}
      {rows.length > 0 && status !== 'done' && (
        <button
          onClick={handlePublish}
          disabled={status === 'publishing'}
          className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'publishing' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
          ) : (
            'Publish Prices'
          )}
        </button>
      )}

      {status === 'done' && (
        <button
          onClick={() => { setRows([]); setPdfName(''); setStatus('idle'); setStatusMsg(''); }}
          className="w-full border border-green-500 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Upload another PDF
        </button>
      )}
    </div>
  );
}
