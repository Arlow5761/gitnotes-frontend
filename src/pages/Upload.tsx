import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { MethodSwitcher } from '../components/MethodSwitcher';
import {
  Upload as UploadIcon, FileText, RefreshCw, Crop, X, Plus, Camera, ChevronDown,
  GripVertical, FileImage, FileInput,
} from 'lucide-react';

type Mode = 'scan' | 'import';

interface PickedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  isImage: boolean;
  url?: string;
}

let uid = 0;

function toPicked(f: File): PickedFile {
  const isImage = f.type.startsWith('image/');
  return {
    id: `f${++uid}-${Date.now()}`,
    name: f.name,
    size: `${(f.size / 1024).toFixed(1)} KB`,
    type: (f.name.split('.').pop() ?? 'FILE').toUpperCase(),
    isImage,
    url: isImage ? URL.createObjectURL(f) : undefined,
  };
}

export function Upload() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const mode = (params.get('mode') as Mode) ?? 'scan';
  const setMode = (m: Mode) => setParams({ mode: m });

  const [files, setFiles] = useState<PickedFile[]>([]);
  const [drag, setDrag] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const accept = mode === 'scan' ? 'image/*,application/pdf' : '.pdf,.docx,.txt,.md';
  const acceptLabel = mode === 'scan' ? 'JPG, PNG, PDF — max 10MB per file' : 'PDF, DOCX, TXT, MD — max 20MB';
  const multiple = mode === 'scan';

  const onPickFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list);
    const picked = incoming.map(toPicked);
    if (mode === 'scan') {
      setFiles(prev => [...prev, ...picked]);
    } else {
      // import: single file replaces
      setFiles([picked[0]]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    setFiles(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const continueLabel = useMemo(() => {
    if (mode === 'scan') return files.length > 1 ? `Lanjut ke Editor (${files.length} halaman) →` : 'Lanjut ke Editor →';
    return 'Import & Edit →';
  }, [mode, files.length]);

  return (
    <div className="min-h-screen">
      <Header back backTo="/" title={mode === 'scan' ? 'Scan Catatan' : 'Import Dokumen'} />
      <main className="max-w-[920px] mx-auto px-6 py-10">
        <MethodSwitcher active={mode} />

        {/* Tab inside Upload between Scan / Import (also reachable via MethodSwitcher) */}
        <div className="mb-6 inline-flex rounded-xl card-surface p-1 gap-1">
          <ModeTab active={mode === 'scan'} icon={<FileImage size={15} />} label="Scan Gambar" onClick={() => { setMode('scan'); }} />
          <ModeTab active={mode === 'import'} icon={<FileInput size={15} />} label="Import File" onClick={() => { setMode('import'); }} />
        </div>

        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-text-primary">
            {mode === 'scan' ? 'Upload Gambar Catatan' : 'Import Catatan Lokal'}
          </h1>
          <p className="text-text-secondary mt-1">
            {mode === 'scan'
              ? 'Tambahkan satu atau beberapa gambar — masing-masing akan jadi halaman terpisah.'
              : 'Konversi file dokumen lokal ke dalam editor.'}
          </p>
        </div>

        {/* Drop zone */}
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault(); setDrag(false);
            if (e.dataTransfer.files.length) onPickFiles(e.dataTransfer.files);
          }}
          className={`block cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 text-center ${
            drag
              ? 'border-mauve-magic bg-indigo-velvet/30 glow-purple'
              : 'border-lavender-purple/50 bg-amethyst-800/30 hover:bg-amethyst-800/50 hover:border-mauve-magic/70'
          }`}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(e) => { if (e.target.files) onPickFiles(e.target.files); e.target.value = ''; }}
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary grid place-items-center glow-purple-sm">
            <UploadIcon size={30} className="text-white" />
          </div>
          <div className="font-display font-semibold text-lg text-text-primary mb-1">
            {files.length === 0
              ? `Drag & drop ${mode === 'scan' ? 'gambar' : 'file'} di sini`
              : (multiple ? 'Tambah lebih banyak gambar' : 'Ganti file')}
          </div>
          <div className="text-sm text-text-secondary">
            atau <span className="text-mauve-soft font-medium">klik untuk pilih file</span>
          </div>
          <div className="text-xs text-text-muted mt-3">{acceptLabel}</div>
        </label>

        {/* Camera (scan only) */}
        {mode === 'scan' && (
          <div className="mt-6 rounded-2xl card-surface overflow-hidden">
            <button
              onClick={() => setCameraOpen(!cameraOpen)}
              className="w-full px-5 py-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-velvet/50 grid place-items-center">
                <Camera size={18} className="text-mauve-soft" />
              </div>
              <div className="text-left flex-1">
                <div className="font-medium text-text-primary">Atau gunakan kamera</div>
                <div className="text-xs text-text-muted">Ambil foto catatan langsung dari device</div>
              </div>
              <ChevronDown size={18} className={`text-text-muted transition-transform ${cameraOpen ? 'rotate-180' : ''}`} />
            </button>
            {cameraOpen && (
              <div className="px-5 pb-5 anim-fade-up">
                <div className="aspect-video rounded-xl bg-amethyst-900 border border-white/10 grid place-items-center text-text-muted">
                  <div className="text-center">
                    <Camera size={36} className="mx-auto mb-2 opacity-40" />
                    <div className="text-sm">Preview kamera akan muncul di sini</div>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <Btn>📸 Ambil Foto</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-8 anim-fade-up">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-text-primary">
                {mode === 'scan' ? `Halaman (${files.length})` : 'File terpilih'}
              </h2>
              {mode === 'scan' && files.length > 1 && (
                <span className="text-xs text-text-muted">Tarik untuk urutkan ulang</span>
              )}
            </div>

            {mode === 'scan' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((f, idx) => (
                  <div
                    key={f.id}
                    draggable
                    onDragStart={() => setDragIdx(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => { if (dragIdx !== null) reorder(dragIdx, idx); setDragIdx(null); }}
                    className="relative group rounded-xl card-surface overflow-hidden card-hover"
                  >
                    <div className="aspect-[3/4] bg-amethyst-900 grid place-items-center overflow-hidden">
                      {f.url
                        ? <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                        : <FileText size={36} className="text-text-muted" />}
                    </div>
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="px-2 h-6 rounded-full gradient-primary text-[11px] font-bold text-white grid place-items-center">
                        {idx + 1}
                      </span>
                      <span className="cursor-grab p-1 rounded bg-amethyst-900/70 text-text-secondary opacity-0 group-hover:opacity-100">
                        <GripVertical size={12} />
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(f.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-amethyst-900/70 text-text-secondary hover:text-danger hover:bg-amethyst-900 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Hapus"
                    >
                      <X size={14} />
                    </button>
                    <div className="p-2.5 border-t border-white/5">
                      <div className="text-xs text-text-secondary truncate">{f.name}</div>
                      <div className="text-[10px] text-text-muted">{f.type} · {f.size}</div>
                    </div>
                  </div>
                ))}
                <label className="cursor-pointer rounded-xl border-2 border-dashed border-white/15 hover:border-mauve-magic/50 hover:bg-amethyst-800/30 transition-colors grid place-items-center min-h-[200px]">
                  <input type="file" accept={accept} multiple className="hidden" onChange={(e) => { if (e.target.files) onPickFiles(e.target.files); e.target.value = ''; }} />
                  <div className="text-center text-text-muted">
                    <Plus size={26} className="mx-auto mb-1" />
                    <div className="text-xs">Tambah halaman</div>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map(f => (
                  <div key={f.id} className="rounded-xl card-surface p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-velvet/50 grid place-items-center shrink-0">
                      <FileText size={22} className="text-mauve-soft" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-text-primary truncate">{f.name}</div>
                      <div className="text-xs text-text-muted">{f.type} · {f.size}</div>
                    </div>
                    <button
                      onClick={() => removeFile(f.id)}
                      className="p-2 rounded-lg hover:bg-danger/10 text-text-secondary hover:text-danger"
                      aria-label="Hapus"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {/* Preview excerpt */}
                <div className="rounded-2xl card-surface p-5 mt-4">
                  <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Preview Ringkasan</div>
                  <div className="prose-reader text-base">
                    <p>Dokumen ini berisi catatan kuliah tentang konsep dasar pemrograman. Bab pertama membahas variabel dan tipe data...</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-end mt-6">
              <Btn variant="secondary" onClick={() => setFiles([])}>
                <RefreshCw size={14} /> Reset
              </Btn>
              {mode === 'scan' && files.length === 1 && (
                <Btn variant="secondary"><Crop size={14} /> Crop</Btn>
              )}
              <Btn size="lg" onClick={() => navigate(`/editor?source=${mode}&meta=${encodeURIComponent(mode === 'scan' ? `${files.length} halaman` : files[0]?.name ?? '')}`)}>
                {continueLabel}
              </Btn>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ModeTab({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors ${
        active ? 'gradient-primary text-white glow-purple-sm' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
