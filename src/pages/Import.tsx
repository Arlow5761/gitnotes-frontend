import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { FileText, Upload, RefreshCw, Check } from 'lucide-react';

export function Import() {
  const navigate = useNavigate();
  const [file, setFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [drag, setDrag] = useState(false);

  const pickFile = (f: File) => {
    setFile({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: (f.name.split('.').pop() ?? 'FILE').toUpperCase(),
    });
  };

  return (
    <div className="min-h-screen">
      <Header back backTo="/" title="Import Catatan Lokal" />
      <main className="max-w-[860px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-text-primary">Import Catatan Lokal</h1>
          <p className="text-text-secondary mt-1">Konversi PDF, DOCX, TXT, atau Markdown ke dalam editor.</p>
        </div>

        {!file ? (
          <label
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault(); setDrag(false);
              const f = e.dataTransfer.files[0];
              if (f) pickFile(f);
            }}
            className={`block cursor-pointer rounded-2xl border-2 border-dashed transition-all p-16 text-center ${
              drag ? 'border-mauve-magic bg-indigo-velvet/30 glow-purple' : 'border-lavender-purple/50 bg-amethyst-800/30 hover:bg-amethyst-800/50 hover:border-mauve-magic/70'
            }`}
          >
            <input type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); }} />
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl gradient-primary grid place-items-center glow-purple-sm">
              <Upload size={36} className="text-white" />
            </div>
            <div className="font-display font-semibold text-xl text-text-primary mb-2">
              Drag & drop file di sini
            </div>
            <div className="text-text-secondary">
              atau <span className="text-mauve-soft font-medium">klik untuk pilih file</span>
            </div>
            <div className="text-xs text-text-muted mt-4">PDF, DOCX, TXT, MD — max 20MB</div>
          </label>
        ) : (
          <div className="anim-fade-up space-y-6">
            <div className="rounded-2xl card-surface p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-velvet/50 grid place-items-center shrink-0">
                <FileText size={26} className="text-mauve-soft" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text-primary truncate">{file.name}</div>
                <div className="text-sm text-text-muted">{file.type} · {file.size}</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-success">
                <Check size={16} /> Berhasil dipilih
              </div>
            </div>

            <div className="rounded-2xl card-surface p-6">
              <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Preview Ringkasan</div>
              <div className="prose-reader text-base">
                <p>Dokumen ini berisi catatan kuliah tentang konsep dasar pemrograman. Bab pertama membahas variabel dan tipe data, dilanjutkan dengan control flow dan struktur perulangan.</p>
                <p>Bagian kedua mencakup function, scope, dan parameter passing. Terdapat juga contoh kasus penggunaan dan beberapa latihan soal di akhir setiap bab...</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Btn variant="secondary" onClick={() => setFile(null)}>
                <RefreshCw size={15} /> Ganti File
              </Btn>
              <Btn onClick={() => navigate(`/editor?source=import&meta=${encodeURIComponent(file.name)}`)}>
                Import & Edit →
              </Btn>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
