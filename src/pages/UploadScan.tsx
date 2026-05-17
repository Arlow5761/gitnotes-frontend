import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { Upload, Camera, ChevronDown, ImageIcon, RefreshCw, Crop } from 'lucide-react';

export function UploadScan() {
  const navigate = useNavigate();
  const [file, setFile] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const onPick = (f: File) => {
    const url = URL.createObjectURL(f);
    setFile(url);
  };

  return (
    <div className="min-h-screen">
      <Header back backTo="/" title="Upload Gambar Catatan" />
      <main className="max-w-[860px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-text-primary">Upload Scan Catatan</h1>
          <p className="text-text-secondary mt-1">Ubah catatan tulis tangan jadi catatan digital.</p>
        </div>

        {!file ? (
          <label
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault(); setDrag(false);
              const f = e.dataTransfer.files[0];
              if (f) onPick(f);
            }}
            className={`block cursor-pointer rounded-2xl border-2 border-dashed transition-all p-16 text-center ${
              drag ? 'border-mauve-magic bg-indigo-velvet/30 glow-purple' : 'border-lavender-purple/50 bg-amethyst-800/30 hover:bg-amethyst-800/50 hover:border-mauve-magic/70'
            }`}
          >
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f); }} />
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl gradient-primary grid place-items-center glow-purple-sm">
              <Upload size={36} className="text-white" />
            </div>
            <div className="font-display font-semibold text-xl text-text-primary mb-2">
              Drag & drop gambar di sini
            </div>
            <div className="text-text-secondary">
              atau <span className="text-mauve-soft font-medium underline-offset-4 hover:underline">klik untuk pilih file</span>
            </div>
            <div className="text-xs text-text-muted mt-4">Mendukung JPG, PNG, PDF — max 10MB</div>
          </label>
        ) : (
          <div className="rounded-2xl card-surface overflow-hidden anim-fade-up">
            <div className="aspect-video bg-amethyst-900 grid place-items-center overflow-hidden">
              <img src={file} alt="preview" className="w-full h-full object-contain" />
            </div>
            <div className="p-5 flex flex-wrap items-center gap-3 border-t border-white/5">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <ImageIcon size={16} className="text-mauve-soft" /> Gambar dipilih
              </div>
              <div className="flex-1" />
              <Btn variant="secondary" size="sm" onClick={() => setFile(null)}><RefreshCw size={14} /> Ganti</Btn>
              <Btn variant="secondary" size="sm"><Crop size={14} /> Crop</Btn>
              <Btn size="md" onClick={() => navigate('/editor?source=scan')}>Lanjut ke Editor →</Btn>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-2xl card-surface overflow-hidden">
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
      </main>
    </div>
  );
}
