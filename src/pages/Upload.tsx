import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { MethodSwitcher } from '../components/MethodSwitcher';
import {
  Upload as UploadIcon, FileText, RefreshCw, Crop, X, Plus, Camera, ChevronDown, GripVertical,
} from 'lucide-react';

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
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [drag, setDrag] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const accept = 'image/*,.pdf,.docx,.txt,.md';

  const onPickFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list).map(toPicked);
    setFiles(prev => [...prev, ...incoming]);
  };

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    setFiles(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const pageCount = files.length;
  const continueLabel = pageCount > 1 ? `Lanjut ke Editor (${pageCount} halaman) →` : 'Lanjut ke Editor →';

  return (
    <div className="min-h-screen">
      <Header back backTo="/" title="Scan Catatan" />
      <main className="max-w-[920px] mx-auto px-6 py-10">
        <MethodSwitcher active="scan" />

        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-text-primary">Scan Catatan</h1>
          <p className="text-text-secondary mt-1">
            Upload gambar tulisan tangan atau file dokumen — gabungkan beberapa file sekaligus untuk catatan multi-halaman.
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
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) onPickFiles(e.target.files); e.target.value = ''; }}
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary grid place-items-center glow-purple-sm">
            <UploadIcon size={30} className="text-white" />
          </div>
          <div className="font-display font-semibold text-lg text-text-primary mb-1">
            {files.length === 0 ? 'Drag & drop gambar atau file di sini' : 'Tambah lebih banyak file'}
          </div>
          <div className="text-sm text-text-secondary">
            atau <span className="text-mauve-soft font-medium">klik untuk pilih</span>
          </div>
          <div className="text-xs text-text-muted mt-3">Gambar (JPG, PNG) · Dokumen (PDF, DOCX, TXT, MD)</div>
        </label>

        {/* Camera */}
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

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-8 anim-fade-up">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-text-primary">
                Halaman ({files.length})
              </h2>
              {files.length > 1 && (
                <span className="text-xs text-text-muted">Tarik untuk urutkan ulang</span>
              )}
            </div>

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
                      : (
                        <div className="text-center text-text-muted p-4">
                          <FileText size={40} className="mx-auto mb-2 text-mauve-soft" />
                          <div className="text-[10px] font-mono font-bold tracking-wider">{f.type}</div>
                        </div>
                      )}
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

            <div className="flex flex-wrap gap-3 justify-end mt-6">
              <Btn variant="secondary" onClick={() => setFiles([])}>
                <RefreshCw size={14} /> Reset
              </Btn>
              {files.length === 1 && files[0].isImage && (
                <Btn variant="secondary"><Crop size={14} /> Crop</Btn>
              )}
              <Btn size="lg" onClick={() => navigate(`/editor?source=scan&meta=${encodeURIComponent(`${files.length} halaman`)}`)}>
                {continueLabel}
              </Btn>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
