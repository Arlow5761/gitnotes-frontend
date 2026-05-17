import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Header } from '../components/layout/Header';
import { Btn } from '../components/ui/Btn';
import { Search, Folder, Home, ChevronRight, Check } from 'lucide-react';
import { mockFolders, noteById } from '../data/mock';

export function MoveToFolder() {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const note = noteById(noteId);
  const [path, setPath] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const currentParent = path[path.length - 1] ?? null;
  const folders = mockFolders.filter(f => (f.parent ?? null) === currentParent);

  const crumb = path.map(p => mockFolders.find(f => f.id === p));

  return (
    <div className="min-h-screen">
      <Header back right={
        <Btn onClick={() => navigate(`/my-note/${noteId}`)} disabled={!selected}>
          Pindahkan →
        </Btn>
      } />
      <main className="max-w-[1280px] mx-auto px-6 py-10">
       <div className="max-w-[720px] mx-auto">
        <div className="mb-1 text-xs text-text-muted truncate">{note.title}</div>
        <h1 className="font-display font-bold text-3xl text-text-primary mb-6">Pindahkan ke Folder</h1>

        <div className="flex items-center gap-1.5 text-sm mb-5 flex-wrap">
          <button onClick={() => setPath([])} className="text-text-muted hover:text-text-primary flex items-center gap-1">
            <Home size={13} /> Beranda
          </button>
          {crumb.map((f, i) => (
            <span key={f?.id} className="flex items-center gap-1.5">
              <ChevronRight size={13} className="text-text-muted" />
              <button
                onClick={() => setPath(path.slice(0, i + 1))}
                className={`hover:text-text-primary ${i === crumb.length - 1 ? 'text-text-primary font-medium' : 'text-text-muted'}`}
              >
                {f?.name}
              </button>
            </span>
          ))}
        </div>

        <div className="relative mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            placeholder="Cari folder..."
            className="focus-ring w-full h-11 pl-11 pr-4 rounded-xl bg-amethyst-800/50 border border-white/10"
          />
        </div>

        <div className="rounded-2xl card-surface overflow-hidden">
          {folders.length === 0 && (
            <div className="p-10 text-center text-text-muted">Tidak ada subfolder di sini</div>
          )}
          {folders.map(f => (
            <div
              key={f.id}
              onClick={() => setSelected(f.id)}
              onDoubleClick={() => { setPath([...path, f.id]); setSelected(null); }}
              className={`flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-b-0 cursor-pointer transition-colors ${
                selected === f.id ? 'bg-indigo-velvet/40 border-l-2 border-l-mauve-magic' : 'hover:bg-indigo-velvet/20'
              }`}
            >
              <div className="w-10 h-10 rounded-lg grid place-items-center shrink-0"
                style={{ background: `${f.color}25`, boxShadow: `inset 0 0 0 1px ${f.color}50` }}>
                <Folder size={20} fill={f.color} stroke={f.color} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-text-primary">{f.name}</div>
                <div className="text-xs text-text-muted mt-0.5">{f.count} item</div>
              </div>
              {selected === f.id && (
                <div className="w-6 h-6 rounded-full gradient-primary grid place-items-center mr-2">
                  <Check size={13} className="text-white" strokeWidth={3} />
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setPath([...path, f.id]); setSelected(null); }}
                className="text-text-muted hover:text-text-primary p-1"
                aria-label="Masuk folder"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          ))}
        </div>
       </div>
      </main>
    </div>
  );
}
